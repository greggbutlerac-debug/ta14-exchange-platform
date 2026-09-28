/**
 * CRR-1 registry shell: derives each entry's state from an append-only event log and resolves
 * references for calculation, failing closed.
 *
 * Phase 2A promotion safety (owner ruling):
 * - PRODUCTION registries accept REGISTERED events only. No promotion-attestation authority is governed
 *   yet, so any other event is refused (EIE-REF-PROMOTION_ATTESTATION_NOT_GOVERNED).
 * - In any mode, promotion events are accepted only for SYNTHETIC entries. No real external or TA-14
 *   reference can reach ACTIVE in Phase 2A.
 * - SYNTHETIC entries are refused from PRODUCTION registries.
 *
 * ACTIVE requires, in log order before the ACTIVATED event, all five s05 prerequisites: possession
 * ESTABLISHED by evidence, an APPROVED review by someone other than the registrant, conformance passed
 * for the entry's own implementation hash, a pin of the registered entry hash, and owner activation.
 */
import { deepFreeze, objectHash } from "../../chain";
import { EIE_REASON } from "../../reason-codes";
import type { CrrEntry, CrrEvent, ReferenceRole, ReferenceState, RegistryMode } from "./types";

export interface CrrRegistry {
  readonly mode: RegistryMode;
  readonly entries: Readonly<Record<string, { entry: CrrEntry; entryHash: string }>>;
  readonly states: Readonly<Record<string, ReferenceState>>;
  /** Registrations refused when building the registry. */
  readonly refused: ReadonlyArray<{ referenceId: string; reasonCodes: string[] }>;
}

const nonEmpty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

function entryShapeValid(entry: CrrEntry): boolean {
  return nonEmpty(entry.referenceId) && nonEmpty(entry.publisher) && nonEmpty(entry.title) && nonEmpty(entry.editionOrVersion)
    && nonEmpty(entry.applicability) && Array.isArray(entry.locators) && Array.isArray(entry.assumptions)
    && (entry.kind !== "SYNTHETIC" || (entry.referenceId.startsWith("CRR-SYNTHETIC-") && entry.title.startsWith("SYNTHETIC")));
}

export function buildRegistry(entries: readonly CrrEntry[], events: readonly CrrEvent[], mode: RegistryMode): CrrRegistry {
  const accepted = new Map<string, { entry: CrrEntry; entryHash: string }>();
  const refused: Array<{ referenceId: string; reasonCodes: string[] }> = [];
  for (const entry of entries) {
    const codes: string[] = [];
    if (!entryShapeValid(entry)) codes.push(EIE_REASON.REF_ENTRY_INVALID);
    if (entry.kind === "SYNTHETIC" && mode === "PRODUCTION") codes.push(EIE_REASON.REF_SYNTHETIC_IN_PRODUCTION);
    if (accepted.has(entry.referenceId)) codes.push(EIE_REASON.REF_ENTRY_INVALID);
    if (codes.length > 0) refused.push({ referenceId: entry.referenceId, reasonCodes: codes });
    else accepted.set(entry.referenceId, { entry: structuredClone(entry), entryHash: objectHash(entry) });
  }

  const states = new Map<string, ReferenceState>();
  for (const [referenceId, { entry, entryHash }] of accepted) {
    const state: ReferenceState = {
      referenceId, entryHash,
      possessionAndUseBasis: { status: "NOT_ESTABLISHED", evidenceRef: null },
      review: { state: "NOT_REVIEWED", reviewedBy: null, reviewedAt: null },
      conformance: { state: "NOT_TESTED", testRef: null, implementationFileHash: null },
      pin: { state: "NOT_PINNED", entryHash: null, manifestRef: null },
      activation: { state: "CANDIDATE", activatedBy: null, activatedAt: null },
      supersededBy: null,
      refusedEvents: [],
    };
    let registrant: string | null = null;
    const refuse = (event: CrrEvent, code: string) => state.refusedEvents.push({ event: structuredClone(event), reasonCodes: [code] });

    for (const event of events.filter((e) => e.referenceId === referenceId)) {
      if (event.type === "REGISTERED") {
        if (registrant !== null || event.entryHash !== entryHash) refuse(event, EIE_REASON.REF_ENTRY_INVALID);
        else registrant = event.by.id;
        continue;
      }
      if (registrant === null) { refuse(event, EIE_REASON.REF_ENTRY_INVALID); continue; }
      if (mode === "PRODUCTION") { refuse(event, EIE_REASON.REF_PROMOTION_ATTESTATION_NOT_GOVERNED); continue; }
      if (entry.kind !== "SYNTHETIC") { refuse(event, EIE_REASON.REF_PROMOTION_REFUSED); continue; }
      if (state.activation.state === "RETIRED" || state.supersededBy !== null) { refuse(event, EIE_REASON.REF_PROMOTION_REFUSED); continue; }

      switch (event.type) {
        case "POSSESSION_ESTABLISHED":
          if (!nonEmpty(event.evidenceRef)) refuse(event, EIE_REASON.REF_POSSESSION_NOT_ESTABLISHED);
          else state.possessionAndUseBasis = { status: "ESTABLISHED", evidenceRef: event.evidenceRef };
          break;
        case "REVIEWED":
          if (event.by.id === registrant) refuse(event, EIE_REASON.REF_UNCONFIRMED);
          else state.review = { state: event.outcome, reviewedBy: event.by.id, reviewedAt: event.at };
          break;
        case "CONFORMANCE_PASSED":
          if (!entry.implementation || event.implementationFileHash !== entry.implementation.fileHash) refuse(event, EIE_REASON.REF_IMPLEMENTATION_UNVERIFIED);
          else state.conformance = { state: "PASSED", testRef: event.testRef, implementationFileHash: event.implementationFileHash };
          break;
        case "PINNED":
          if (event.entryHash !== entryHash) refuse(event, EIE_REASON.HASH_MISMATCH);
          else state.pin = { state: "PINNED", entryHash: event.entryHash, manifestRef: event.manifestRef };
          break;
        case "ACTIVATED": {
          const ready = state.possessionAndUseBasis.status === "ESTABLISHED" && state.review.state === "APPROVED"
            && state.conformance.state === "PASSED" && state.pin.state === "PINNED" && event.by.role === "OWNER";
          if (!ready || (state.activation.state !== "CANDIDATE" && state.activation.state !== "SUSPENDED")) refuse(event, EIE_REASON.REF_NOT_ACTIVATED);
          else state.activation = { state: "ACTIVE", activatedBy: event.by.id, activatedAt: event.at };
          break;
        }
        case "SUSPENDED":
          if (state.activation.state !== "ACTIVE") refuse(event, EIE_REASON.REF_PROMOTION_REFUSED);
          else state.activation = { ...state.activation, state: "SUSPENDED" };
          break;
        case "RETIRED":
          state.activation = { ...state.activation, state: "RETIRED" };
          break;
        case "SUPERSEDED":
          if (!nonEmpty(event.supersededBy)) refuse(event, EIE_REASON.REF_PROMOTION_REFUSED);
          else state.supersededBy = event.supersededBy;
          break;
      }
    }
    if (registrant === null) refused.push({ referenceId, reasonCodes: [EIE_REASON.REF_ENTRY_INVALID] });
    else states.set(referenceId, state);
  }
  for (const id of [...accepted.keys()]) if (!states.has(id)) accepted.delete(id);
  // Frozen plain records (a frozen Map would still accept set()).
  return deepFreeze({ mode, entries: Object.fromEntries(accepted), states: Object.fromEntries(states), refused });
}

export type ReferenceResolution =
  | { ok: true; entry: CrrEntry; entryHash: string; state: ReferenceState }
  | { ok: false; entry: CrrEntry | null; entryHash: string | null; state: ReferenceState | null; reasonCodes: string[] };

/** Resolves a reference for a calculation role. Only an ACTIVE, possessed, reviewed, conformance-tested, pinned entry resolves. */
export function resolveReference(registry: CrrRegistry, referenceId: string, role: ReferenceRole, analyzerMode: RegistryMode): ReferenceResolution {
  const found = Object.hasOwn(registry.entries, referenceId) ? registry.entries[referenceId] : undefined;
  const state = Object.hasOwn(registry.states, referenceId) ? registry.states[referenceId] : undefined;
  if (!found || !state) return { ok: false, entry: null, entryHash: null, state: null, reasonCodes: [EIE_REASON.REF_MISSING] };
  const { entry, entryHash } = found;
  const codes = new Set<string>();
  if (registry.mode !== analyzerMode) codes.add(EIE_REASON.REF_REGISTRY_MODE_MISMATCH);
  if (entry.kind === "SYNTHETIC" && analyzerMode === "PRODUCTION") codes.add(EIE_REASON.REF_SYNTHETIC_IN_PRODUCTION);
  if (entry.role !== role) codes.add(EIE_REASON.REF_ROLE_MISMATCH);
  if (state.supersededBy !== null) codes.add(EIE_REASON.REF_SUPERSEDED);
  if (state.activation.state !== "ACTIVE") codes.add(EIE_REASON.REF_NOT_ACTIVATED);
  if (state.possessionAndUseBasis.status !== "ESTABLISHED") codes.add(EIE_REASON.REF_POSSESSION_NOT_ESTABLISHED);
  if (state.review.state !== "APPROVED") codes.add(EIE_REASON.REF_UNCONFIRMED);
  if (state.conformance.state !== "PASSED" || !entry.implementation || state.conformance.implementationFileHash !== entry.implementation.fileHash) {
    codes.add(EIE_REASON.REF_IMPLEMENTATION_UNVERIFIED);
  }
  if (state.pin.state !== "PINNED" || state.pin.entryHash !== entryHash) codes.add(EIE_REASON.REF_NOT_ACTIVATED);
  if (codes.size > 0) return { ok: false, entry, entryHash, state, reasonCodes: [...codes].sort() };
  return { ok: true, entry, entryHash, state };
}
