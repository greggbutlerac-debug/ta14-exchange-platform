import { createHash } from "node:crypto";
import type { FreezeGate, FreezeGateState } from "./technical-freeze-record";

export type ResolvedFreezeGate = FreezeGate & {
  evidenceObjectIds?: string[];
  resolutionReason?: string;
};

export type FreezeCandidate = {
  recordId: string;
  instrumentId: string;
  intakeId: string;
  issuer: { name: string; authorityRecordId: string };
  participant: { name: string; organization?: string; reviewState: "COMPLETE" | "INCOMPLETE" };
  gates: ResolvedFreezeGate[];
  frozenObjects: Array<{ id: string; sha256: string }>;
  issuedAt?: string;
};

export type FreezeCompilation = {
  executable: boolean;
  unresolvedGateIds: string[];
  errors: string[];
  canonicalJson?: string;
  sha256?: string;
};

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map(key => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

function validSha256(value: string) {
  return /^[a-f0-9]{64}$/i.test(value);
}

export function compileTechnicalFreeze(candidate: FreezeCandidate): FreezeCompilation {
  const errors: string[] = [];
  const unresolvedGateIds = candidate.gates.filter(g => g.state === "UNSATISFIED").map(g => g.id);
  const invalidNa = candidate.gates.filter(g => g.state === "NOT_APPLICABLE" && !g.resolutionReason?.trim());
  if (invalidNa.length) errors.push(`NOT_APPLICABLE requires attributable reason: ${invalidNa.map(g => g.id).join(", ")}`);
  if (candidate.participant.reviewState !== "COMPLETE") errors.push("Participant factual review is incomplete.");
  if (!candidate.issuer.name.trim() || !candidate.issuer.authorityRecordId.trim()) errors.push("Issuer identity or authority record is missing.");
  if (!candidate.participant.name.trim()) errors.push("Participant identity is missing.");
  if (!candidate.frozenObjects.length) errors.push("No frozen evidence objects supplied.");
  const invalidHashes = candidate.frozenObjects.filter(o => !o.id.trim() || !validSha256(o.sha256));
  if (invalidHashes.length) errors.push(`Invalid frozen object identity/hash: ${invalidHashes.map(o => o.id || "UNIDENTIFIED").join(", ")}`);
  const satisfiedWithoutEvidence = candidate.gates.filter(g => g.state === "SATISFIED" && !g.evidenceObjectIds?.length);
  if (satisfiedWithoutEvidence.length) errors.push(`SATISFIED gate lacks evidence object identity: ${satisfiedWithoutEvidence.map(g => g.id).join(", ")}`);
  if (unresolvedGateIds.length) errors.push(`Required gates unresolved: ${unresolvedGateIds.join(", ")}`);
  if (errors.length) return { executable: false, unresolvedGateIds, errors };

  const frozen = { ...candidate, issuedAt: candidate.issuedAt ?? new Date().toISOString(), status: "TECHNICAL_FREEZE_ISSUED" as const };
  const canonicalJson = canonicalize(frozen);
  const sha256 = createHash("sha256").update(canonicalJson, "utf8").digest("hex");
  return { executable: true, unresolvedGateIds: [], errors: [], canonicalJson, sha256 };
}

export function gateState(state: FreezeGateState) { return state; }
