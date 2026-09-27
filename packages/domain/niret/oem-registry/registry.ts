/**
 * Governed OEM reference registry (TA-14-NIRET-GA-C1 Amendment A7).
 *
 * Loads bounded OEM reference records, rejects anything that fails the
 * registration rules, resolves an exactly matched manufacturer and
 * indoor/outdoor combination, and projects a VERIFIED, CURRENT record into the
 * engine's OemReference. It never invents, interpolates, or defaults a value:
 * the projection carries only what the record states, with its citations.
 *
 * Custody is process-based (A7): a record reaches the registry only through an
 * owner-reviewed change that pins its canonical SHA-256 in the manifest. Any
 * rejected record makes the whole registry unavailable (fail closed).
 */

import Ajv2020 from "ajv/dist/2020";
import { sha256Canonical } from "../../../crypto/receipts";
import recordSchema from "../../../../schemas/niret-oem-reference-record.schema.json";
import { EXPECTED_UNIT } from "../evaluate-gate-a";
import type { MatchedSystem, MeasurementKey, OemRange, OemReference, Unit } from "../types";

export interface Cite {
  pageRef: string;
  tableOrChart: string | null;
}

interface CitedRange {
  min: number;
  max: number;
  unit: Unit;
  cite: Cite;
}

export interface OemReferenceRecord {
  recordId: string;
  recordVersion: number;
  contract: "TA-14-NIRET-GA-C1/A7";
  equipment: {
    manufacturer: string;
    modelFamily: string | null;
    matchedSystems: Array<MatchedSystem & { cite: Cite }>;
  };
  document: { documentId: string; title: string; revision: string | null; date: string | null; sha256: string; mediaType: string };
  acquisition: {
    method: "OEM_WEBSITE_DOWNLOAD" | "OEM_DIRECT_SUPPLY" | "DISTRIBUTOR_SUPPLY" | "LITERATURE_SHIPPED_WITH_EQUIPMENT";
    sourceRef: string;
    acquiredBy: string;
    acquiredAt: string;
  };
  curation: { transcribedBy: string; transcribedAt: string; curationRequestRef: string | null };
  review: {
    state: "PENDING_REVIEW" | "VERIFIED" | "REJECTED";
    reviewedBy: string | null;
    reviewedAt: string | null;
    method: "INDEPENDENT_SECOND_READ_AGAINST_HASHED_DOCUMENT";
    notes: string | null;
  };
  status: { supersession: "CURRENT" | "SUPERSEDED" | "WITHDRAWN"; supersededBy: string | null; supersedes: string[] };
  criteria: {
    chargingMethod:
      | { status: "IDENTIFIED"; description: string; cite: Cite }
      | { status: "NOT_IN_DOCUMENT" }
      | { status: "OEM_CONFIRMED_NOT_PUBLISHED"; cite: Cite };
    specialToolOrModeRequired: { value: boolean; description: string | null; cite: Cite | null };
    airflowRange?: CitedRange;
    espRange?: CitedRange;
    ambientEnvelope?: CitedRange;
    voltageRange?: CitedRange;
    minRunMinutes?: { value: number; cite: Cite };
    stabilityCriterion?: { measurement: MeasurementKey; maxChange: number; unit: Unit; cite: Cite };
    permitsEcmWithTableMethod?: { value: boolean; cite: Cite };
    measurementLocations: Partial<Record<MeasurementKey, { location: string; oemText: string; cite: Cite }>>;
    noninvasiveCriterion:
      | {
          status: "PUBLISHED";
          derivation: Extract<OemReference["noninvasiveCriterion"], { status: "PUBLISHED" }>["derivation"];
          coverage: "COMPLETE" | "PARTIAL";
          lookup: { interpolationRequired: boolean; calculationRequired: boolean; unrepresentedConditions: string[] };
          candidates: Array<{
            candidateId: string;
            range: { min: number; max: number; unit: Unit };
            cite: Cite;
            appliesWhen: Array<{ measurement: MeasurementKey; min: number; max: number; unit: Unit; cite: Cite }>;
          }>;
        }
      | { status: "NOT_IN_DOCUMENT" }
      | { status: "OEM_CONFIRMED_NOT_PUBLISHED"; cite: Cite };
  };
}

export interface RegistryManifest {
  records: Record<string, string>;
}

export interface OemRegistry {
  /** False when any record or manifest entry was rejected: the registry then resolves nothing. */
  available: boolean;
  records: ReadonlyArray<{ record: OemReferenceRecord; recordHash: string }>;
  rejections: ReadonlyArray<{ recordId: string | null; reason: string }>;
}

export type OemResolution =
  | { status: "RESOLVED"; recordId: string; recordHash: string; record: OemReferenceRecord; reference: OemReference }
  | { status: "NOT_VERIFIED"; recordId: string }
  | { status: "NO_RECORD" }
  | { status: "REGISTRY_UNAVAILABLE"; reasons: string[] };

const validateRecord = new Ajv2020({ allErrors: true, strict: false }).compile(recordSchema);

/** Identity compares exactly, ignoring only case and whitespace (A7). */
export const identityKey = (value: string): string => value.toUpperCase().replace(/\s+/g, "");

const RANGE_UNITS: Readonly<Record<"airflowRange" | "espRange" | "ambientEnvelope" | "voltageRange", Unit>> = {
  airflowRange: "CFM", espRange: "IN_WC", ambientEnvelope: "F", voltageRange: "V",
};

/** Registration rules beyond the schema. Returns rejection reasons; empty means registrable. */
export function registrationFindings(record: OemReferenceRecord): string[] {
  const findings: string[] = [];
  const at = (stamp: string | null) => (stamp === null ? Number.NaN : Date.parse(stamp));
  for (const [label, stamp] of [["acquiredAt", record.acquisition.acquiredAt], ["transcribedAt", record.curation.transcribedAt], ["reviewedAt", record.review.reviewedAt]] as const) {
    if (stamp !== null && Number.isNaN(at(stamp))) findings.push(`TIMESTAMP_UNPARSEABLE:${label}`);
  }

  const review = record.review;
  if (review.state !== "PENDING_REVIEW" && (!review.reviewedBy || !review.reviewedAt)) findings.push("REVIEW_IDENTITY_OR_TIME_MISSING");
  if (review.state === "VERIFIED" && review.reviewedBy && identityKey(review.reviewedBy) === identityKey(record.curation.transcribedBy)) {
    findings.push("REVIEW_NOT_INDEPENDENT_OF_TRANSCRIPTION");
  }
  if (review.reviewedAt && at(review.reviewedAt) < at(record.curation.transcribedAt)) findings.push("REVIEW_PRECEDES_TRANSCRIPTION");

  const status = record.status;
  if (status.supersession === "SUPERSEDED" && !status.supersededBy) findings.push("SUPERSEDED_WITHOUT_SUCCESSOR");
  if (status.supersession === "CURRENT" && status.supersededBy) findings.push("CURRENT_RECORD_NAMES_SUCCESSOR");

  const criteria = record.criteria;
  for (const key of Object.keys(RANGE_UNITS) as Array<keyof typeof RANGE_UNITS>) {
    const range = criteria[key];
    if (!range) continue;
    if (range.min > range.max) findings.push(`BOUNDS_INVERTED:${key}`);
    if (range.unit !== RANGE_UNITS[key]) findings.push(`UNIT_NOT_CONTRACT_UNIT:${key}`);
  }
  if (criteria.stabilityCriterion && criteria.stabilityCriterion.unit !== EXPECTED_UNIT[criteria.stabilityCriterion.measurement]) {
    findings.push("UNIT_NOT_CONTRACT_UNIT:stabilityCriterion");
  }

  const criterion = criteria.noninvasiveCriterion;
  if (criterion.status === "PUBLISHED") {
    const indicatorUnit = criterion.derivation.kind === "SINGLE_MEASUREMENT" ? EXPECTED_UNIT[criterion.derivation.measurement] : "F";
    const ids = new Set<string>();
    const axes = (candidate: (typeof criterion.candidates)[number]) => candidate.appliesWhen.map((c) => c.measurement).sort().join(",");
    const firstAxes = axes(criterion.candidates[0] as (typeof criterion.candidates)[number]);
    for (const candidate of criterion.candidates) {
      if (ids.has(candidate.candidateId)) findings.push(`CANDIDATE_ID_DUPLICATED:${candidate.candidateId}`);
      ids.add(candidate.candidateId);
      if (candidate.range.min > candidate.range.max) findings.push(`BOUNDS_INVERTED:${candidate.candidateId}`);
      if (candidate.range.unit !== indicatorUnit) findings.push(`UNIT_NOT_CONTRACT_UNIT:${candidate.candidateId}`);
      if (new Set(candidate.appliesWhen.map((c) => c.measurement)).size !== candidate.appliesWhen.length) {
        findings.push(`CONDITION_REPEATED:${candidate.candidateId}`);
      }
      if (axes(candidate) !== firstAxes) findings.push(`CANDIDATE_CONDITIONS_NOT_UNIFORM:${candidate.candidateId}`);
      for (const condition of candidate.appliesWhen) {
        if (condition.min > condition.max) findings.push(`BOUNDS_INVERTED:${candidate.candidateId}:${condition.measurement}`);
        if (condition.unit !== EXPECTED_UNIT[condition.measurement]) findings.push(`UNIT_NOT_CONTRACT_UNIT:${candidate.candidateId}:${condition.measurement}`);
      }
    }
    // Overlapping applicability bands would let two published values apply at once.
    criterion.candidates.forEach((a, i) => criterion.candidates.slice(i + 1).forEach((b) => {
      const overlaps = a.appliesWhen.every((ca) => {
        const cb = b.appliesWhen.find((c) => c.measurement === ca.measurement);
        return cb !== undefined && ca.min < cb.max && cb.min < ca.max;
      });
      if (overlaps) findings.push(`CANDIDATE_BANDS_OVERLAP:${a.candidateId}/${b.candidateId}`);
    }));
  }
  return findings;
}

export function loadOemRegistry(records: readonly unknown[], manifest: RegistryManifest): OemRegistry {
  const accepted: Array<{ record: OemReferenceRecord; recordHash: string }> = [];
  const rejections: Array<{ recordId: string | null; reason: string }> = [];
  const seen = new Set<string>();

  for (const raw of records) {
    const recordId = typeof (raw as { recordId?: unknown })?.recordId === "string" ? (raw as { recordId: string }).recordId : null;
    if (!validateRecord(raw)) {
      rejections.push({ recordId, reason: `SCHEMA_INVALID:${(validateRecord.errors ?? []).map((e) => `${e.instancePath} ${e.message}`).join("; ")}` });
      continue;
    }
    const record = raw as unknown as OemReferenceRecord;
    if (seen.has(record.recordId)) { rejections.push({ recordId, reason: "RECORD_ID_DUPLICATED" }); continue; }
    seen.add(record.recordId);
    const recordHash = sha256Canonical(record);
    if (manifest.records[record.recordId] !== recordHash) { rejections.push({ recordId, reason: "RECORD_HASH_NOT_PINNED_IN_MANIFEST" }); continue; }
    const findings = registrationFindings(record);
    if (findings.length > 0) { for (const reason of findings) rejections.push({ recordId, reason }); continue; }
    accepted.push({ record, recordHash });
  }
  for (const recordId of Object.keys(manifest.records)) {
    if (!seen.has(recordId)) rejections.push({ recordId, reason: "MANIFEST_ENTRY_WITHOUT_RECORD" });
  }

  // At most one CURRENT, non-rejected record per matched system.
  const claimed = new Map<string, string>();
  for (const { record } of accepted) {
    if (record.status.supersession !== "CURRENT" || record.review.state === "REJECTED") continue;
    for (const system of record.equipment.matchedSystems) {
      const key = [record.equipment.manufacturer, system.indoorModel, system.outdoorModel].map(identityKey).join("|");
      const other = claimed.get(key);
      if (other) rejections.push({ recordId: record.recordId, reason: `DUPLICATE_CURRENT_RECORD_FOR_SYSTEM:${other}` });
      else claimed.set(key, record.recordId);
    }
  }

  return { available: rejections.length === 0, records: accepted, rejections };
}

export function resolveOemReference(
  registry: OemRegistry,
  equipment: { manufacturer?: unknown; indoorModel?: unknown; outdoorModel?: unknown },
): OemResolution {
  if (!registry.available) {
    return { status: "REGISTRY_UNAVAILABLE", reasons: registry.rejections.map((item) => `${item.recordId ?? "?"}:${item.reason}`) };
  }
  const { manufacturer, indoorModel, outdoorModel } = equipment;
  if (typeof manufacturer !== "string" || typeof indoorModel !== "string" || typeof outdoorModel !== "string") return { status: "NO_RECORD" };
  const match = registry.records.find(({ record }) =>
    record.status.supersession === "CURRENT" && record.review.state !== "REJECTED" &&
    identityKey(record.equipment.manufacturer) === identityKey(manufacturer) &&
    record.equipment.matchedSystems.some((system) =>
      identityKey(system.indoorModel) === identityKey(indoorModel) && identityKey(system.outdoorModel) === identityKey(outdoorModel)));
  if (!match) return { status: "NO_RECORD" };
  if (match.record.review.state !== "VERIFIED") return { status: "NOT_VERIFIED", recordId: match.record.recordId };
  return {
    status: "RESOLVED",
    recordId: match.record.recordId,
    recordHash: match.recordHash,
    record: match.record,
    reference: projectRecord(match.record, match.recordHash),
  };
}

/** Citation string carried into every engine reference: document, revision, page and table/chart. */
export function citation(record: OemReferenceRecord, cite: Cite): string {
  const document = [record.document.documentId, record.document.revision ? `rev ${record.document.revision}` : null].filter(Boolean).join(" ");
  return [document, `p. ${cite.pageRef}`, cite.tableOrChart].filter(Boolean).join(" · ");
}

/** Projects a VERIFIED, CURRENT record into the engine contract. Only values the record states are carried. */
export function projectRecord(record: OemReferenceRecord, recordHash: string): OemReference {
  const criteria = record.criteria;
  const ref = (cite: Cite) => citation(record, cite);
  const range = (value: CitedRange | undefined): OemRange | undefined =>
    value ? { min: value.min, max: value.max, unit: value.unit, ref: ref(value.cite) } : undefined;
  const cites = new Set<string>();
  const note = (cite: Cite | null | undefined) => { if (cite) cites.add([`p. ${cite.pageRef}`, cite.tableOrChart].filter(Boolean).join(" ")); };
  record.equipment.matchedSystems.forEach((system) => note(system.cite));

  const reference: Record<string, unknown> = {
    documentRefs: [`${record.document.documentId}${record.document.revision ? ` rev ${record.document.revision}` : ""} — ${record.document.title}`],
    requiresUnavailableToolOrMode: criteria.specialToolOrModeRequired.value,
    measurementLocations: Object.fromEntries(Object.entries(criteria.measurementLocations).map(([key, value]) => {
      note(value?.cite);
      return [key, value?.location];
    })),
  };
  note(criteria.specialToolOrModeRequired.cite);

  const method = criteria.chargingMethod;
  if (method.status === "IDENTIFIED") note(method.cite);
  reference.chargingMethod = method.status === "IDENTIFIED"
    ? { status: "IDENTIFIED", ref: `${ref(method.cite)} · ${method.description}` }
    : { status: "NOT_OBTAINED", obtainable: method.status === "NOT_IN_DOCUMENT" };

  for (const key of ["airflowRange", "espRange", "ambientEnvelope", "voltageRange"] as const) {
    const value = criteria[key];
    if (value) { note(value.cite); reference[key] = range(value); }
  }
  if (criteria.minRunMinutes) { note(criteria.minRunMinutes.cite); reference.minRunMinutes = { value: criteria.minRunMinutes.value, ref: ref(criteria.minRunMinutes.cite) }; }
  if (criteria.stabilityCriterion) {
    const stability = criteria.stabilityCriterion;
    note(stability.cite);
    reference.stabilityCriterion = { measurement: stability.measurement, maxChange: stability.maxChange, unit: stability.unit, ref: ref(stability.cite) };
  }
  if (criteria.permitsEcmWithTableMethod) { note(criteria.permitsEcmWithTableMethod.cite); reference.permitsEcmWithTableMethod = criteria.permitsEcmWithTableMethod.value; }

  const criterion = criteria.noninvasiveCriterion;
  if (criterion.status === "PUBLISHED") {
    reference.noninvasiveCriterion = {
      status: "PUBLISHED",
      derivation: criterion.derivation,
      coverage: criterion.coverage,
      lookup: criterion.lookup,
      candidates: criterion.candidates.map((candidate) => {
        note(candidate.cite);
        return {
          candidateId: candidate.candidateId,
          range: { ...candidate.range, ref: ref(candidate.cite) },
          appliesWhen: candidate.appliesWhen.map((condition) => {
            note(condition.cite);
            return { measurement: condition.measurement, min: condition.min, max: condition.max, unit: condition.unit, ref: ref(condition.cite) };
          }),
        };
      }),
    };
  } else {
    if (criterion.status === "OEM_CONFIRMED_NOT_PUBLISHED") note(criterion.cite);
    reference.noninvasiveCriterion = { status: "NOT_OBTAINED", obtainable: criterion.status === "NOT_IN_DOCUMENT" };
  }

  const provenance: Record<string, unknown> = {
    acquisitionMethod: "GOVERNED_LIBRARY",
    verification: "VERIFIED",
    manufacturer: record.equipment.manufacturer,
    documentId: record.document.documentId,
    pageRef: [...cites].sort().join("; "),
    sourceRef: record.acquisition.sourceRef,
    verifiedBy: record.review.reviewedBy,
    verifiedAt: record.review.reviewedAt,
    recordId: record.recordId,
    recordHash,
    documentHash: record.document.sha256,
    matchedSystems: record.equipment.matchedSystems.map(({ indoorModel, outdoorModel }) => ({ indoorModel, outdoorModel })),
    transcribedBy: record.curation.transcribedBy,
    transcribedAt: record.curation.transcribedAt,
    supersession: record.status.supersession,
  };
  if (record.equipment.modelFamily) provenance.model = record.equipment.modelFamily;
  if (record.document.revision) provenance.revision = record.document.revision;
  if (record.document.date) provenance.documentDate = record.document.date;
  reference.provenance = provenance;
  return reference as unknown as OemReference;
}
