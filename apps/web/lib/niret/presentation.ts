/**
 * Presentation of the engine's canonical receipt.
 *
 * Every value here is read from the receipt. Nothing is computed that could
 * change or anticipate a determination. The determination shown is always
 * receipt.determination.
 */

import { describeReason, humanize, NEXT_ACTION_LABELS, PROPOSITION_LABELS } from "./labels";

export type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

export const BOUNDARY_NOTICE =
  "GATE-A ALLOW AUTHORIZES PRESSURE-EVIDENCE ACQUISITION ONLY. IT DOES NOT AUTHORIZE ADDING, REMOVING, RECOVERING, EVACUATING, CHARGING, OR OTHERWISE MOVING REFRIGERANT.";

export const DETERMINATION_TEXT: Readonly<Record<Determination, { headline: string; meaning: string }>> = {
  ALLOW: {
    headline: "ALLOW — PRESSURE EVIDENCE JUSTIFIED",
    meaning: "Pressure-instrument diagnostic entry is justified for the bounded purpose of obtaining pressure evidence only.",
  },
  HOLD: {
    headline: "HOLD — ADDITIONAL/CORRECTED EVIDENCE REQUIRED",
    meaning: "The determination cannot yet be resolved: required evidence, test conditions, continuity, or prerequisite state is insufficient or unresolved.",
  },
  DENY: {
    headline: "DENY — PRESSURE ENTRY NOT JUSTIFIED",
    meaning: "Pressure-instrument entry is not authorized by the evidence and authority currently established.",
  },
  ESCALATE: {
    headline: "ESCALATE — OUTSIDE BOUNDED SCOPE / SAFETY / AUTHORITY",
    meaning: "Safety, certification, equipment class, OEM authority, or another condition requires review outside the normal Gate-A path.",
  },
};

/** A6: the technical NIRET answer, stated on its own. */
export const TECHNICAL_TEXT: Readonly<Record<Determination, { headline: string; meaning: string }>> = {
  ALLOW: { headline: "TECHNICAL NIRET: ALLOW", meaning: "Sufficient admissible non-invasive evidence exists to justify obtaining pressure evidence." },
  HOLD: { headline: "TECHNICAL NIRET: HOLD", meaning: "Additional or corrected evidence is required before obtaining pressure evidence is justified." },
  DENY: { headline: "TECHNICAL NIRET: DENY", meaning: "The established evidence does not justify obtaining pressure evidence." },
  ESCALATE: { headline: "TECHNICAL NIRET: ESCALATE", meaning: "The technical question is outside this Gate-A version or needs authority it cannot supply here (for example, governed OEM criteria)." },
};

/** A6: whether the actor may actually perform the pressure-instrument entry. */
export const EXECUTION_TEXT: Readonly<Record<Determination, { headline: string; meaning: string }>> = {
  ALLOW: { headline: "EXECUTION AUTHORITY: ESTABLISHED", meaning: "The actor is authorized to perform the pressure-instrument entry." },
  HOLD: { headline: "EXECUTION AUTHORITY: HOLD / NOT ESTABLISHED", meaning: "Pressure-instrument entry may not yet be executed." },
  DENY: { headline: "EXECUTION AUTHORITY: DENY", meaning: "Pressure-instrument entry is not authorized." },
  ESCALATE: { headline: "EXECUTION AUTHORITY: ESCALATE / NOT ESTABLISHED", meaning: "Authority to perform the entry must be confirmed outside this tool." },
};

export const ENTRY_AUTHORIZED = "PRESSURE-INSTRUMENT ENTRY: AUTHORIZED — pressure evidence only";
export const ENTRY_NOT_AUTHORIZED = "PRESSURE-INSTRUMENT ENTRY: NOT AUTHORIZED — do not connect pressure instruments";

export const PREMATURE_ENTRY_REASON = "PRESSURE_INSTRUMENT_ENTRY_NOT_AUTHORIZED";

interface ReceiptUnresolved {
  proposition: string;
  results: string[];
  reason_codes: string[];
  evidence_keys: string[];
  next_justified_action: string;
}

/** Per-check detail returned by the evaluator alongside the canonical receipt. */
export interface FindingLike {
  proposition: string;
  result: string;
  reason: string;
  evidenceKeys: string[];
}

export interface CertificationStatusLike {
  credential: string;
  type?: string;
  reference?: string;
  applies_to?: string;
  assurance?: string;
  verification_status?: string;
  verifier?: string | null;
  verification_reference?: string | null;
  verified_at?: string | null;
  established: boolean;
  reason_codes: string[];
}

interface AuthorityElementLike {
  declared: unknown;
  establishment_status: string;
  source: string | null;
  established: boolean;
}

export interface OemProvenanceLike {
  acquisition_method: string;
  verification: string;
  manufacturer: string | null;
  model: string | null;
  document_id: string | null;
  revision: string | null;
  page_ref: string | null;
  source_ref: string | null;
  verified_by: string | null;
  /** Amendment A7: governed record identity. */
  record_id?: string | null;
  document_hash?: string | null;
  supersession?: string | null;
  established: boolean;
}

export interface ReceiptLike {
  determination: Determination;
  reason_codes: string[];
  required_propositions: string[];
  established_propositions: string[];
  unresolved_propositions: ReceiptUnresolved[];
  next_justified_actions: string[];
  derived_tesp: { value: number; uncertainty: number; unit: string } | null;
  steady_state_window: { effectiveRunStart: string | null; windowStart: string | null; windowEnd: string };
  measurement_set: Record<string, { value: number } | undefined>;
  receipt_id: string;
  content_hash: string;
  frozen_spec_sha256: string;
  gate_version: string;
  technical_determination: { determination: Determination; reason_codes: string[]; unresolved_propositions: string[] };
  execution_authority: { determination: Determination; reason_codes: string[]; unresolved_propositions: string[] };
  certification_status: CertificationStatusLike | null;
  submitted_by: { accountId: string; method: string } | null;
  authority_status: (Record<string, AuthorityElementLike | unknown> & { submitter_authenticated: boolean }) | null;
  oem_reference_provenance: OemProvenanceLike | null;
}

export interface PresentedReceipt {
  /** Pressure-instrument entry authorized (A6): ALLOW only when both parts are ALLOW. */
  determination: Determination;
  headline: string;
  meaning: string;
  technical: { determination: Determination; headline: string; meaning: string };
  execution: { determination: Determination; headline: string; meaning: string };
  prematureEntry: boolean;
  reasons: Array<{ code: string; label: string }>;
  unresolved: Array<{ proposition: string; label: string; reasons: string[]; messages: string[]; fields: string[]; nextAction: string }>;
  certification: { summary: string; verified: boolean } | null;
  authority: Array<{ label: string; summary: string; established: boolean }>;
  oemProvenance: { summary: string; established: boolean } | null;
  submittedBy: string | null;
  establishedCount: number;
  requiredCount: number;
  nextActions: string[];
  windowOpens: string | null;
  derivedTesp: ReceiptLike["derived_tesp"];
  boundaryNotice: string;
}

/** Plain wording of the receipt's certification status; DECLARED is never shown as VERIFIED. */
export function presentCertification(status: CertificationStatusLike | null): { summary: string; verified: boolean } | null {
  if (!status) return null;
  if (status.credential === "MISSING") return { summary: "Certification: not provided", verified: false };
  if (status.credential === "NOT_CERTIFIED") return { summary: "Certification: recorded as NOT CERTIFIED", verified: false };
  const verified = status.verification_status === "VERIFIED" && status.established;
  const who = status.applies_to === "SUPERVISOR" ? "Supervisor certification" : "Certification";
  const verification = status.verification_status === "VERIFIED"
    ? `VERIFIED by ${status.verifier ?? "unknown verifier"}${status.verification_reference ? ` (${status.verification_reference})` : ""}${status.established ? "" : " — verification not accepted"}`
    : status.verification_status === "VERIFICATION_UNAVAILABLE" ? "NOT VERIFIED — verification unavailable" : "NOT VERIFIED";
  return { summary: `${who}: ${status.assurance ?? "DECLARED"} ${status.type ?? ""} ${status.reference ?? ""} · ${verification}`.replace(/\s+/g, " ").trim(), verified };
}

export function presentReceipt(receipt: ReceiptLike, findings: readonly FindingLike[] = []): PresentedReceipt {
  const technical = receipt.technical_determination.determination;
  const execution = receipt.execution_authority.determination;
  const authorized = receipt.determination === "ALLOW";
  return {
    determination: receipt.determination,
    headline: authorized ? ENTRY_AUTHORIZED : ENTRY_NOT_AUTHORIZED,
    meaning: authorized
      ? "Technical NIRET and execution authority are both established. Acquire pressure evidence only."
      : DETERMINATION_TEXT[receipt.determination].meaning,
    technical: { determination: technical, ...TECHNICAL_TEXT[technical] },
    execution: { determination: execution, ...EXECUTION_TEXT[execution] },
    prematureEntry: receipt.reason_codes.includes(PREMATURE_ENTRY_REASON),
    reasons: receipt.reason_codes.map((code) => ({ code, label: humanize(code) })),
    unresolved: receipt.unresolved_propositions.map((item) => ({
      proposition: item.proposition,
      label: PROPOSITION_LABELS[item.proposition] ?? item.proposition,
      reasons: item.reason_codes,
      messages: messagesFor(item, findings),
      fields: item.evidence_keys,
      nextAction: NEXT_ACTION_LABELS[item.next_justified_action] ?? item.next_justified_action,
    })),
    establishedCount: receipt.established_propositions.length,
    requiredCount: receipt.required_propositions.length,
    nextActions: receipt.next_justified_actions.map((action) => NEXT_ACTION_LABELS[action] ?? action),
    windowOpens: receipt.steady_state_window.windowStart,
    derivedTesp: receipt.derived_tesp,
    boundaryNotice: BOUNDARY_NOTICE,
    certification: presentCertification(receipt.certification_status),
    authority: presentAuthority(receipt.authority_status),
    oemProvenance: presentOemProvenance(receipt.oem_reference_provenance),
    submittedBy: receipt.submitted_by?.accountId ?? null,
  };
}

const AUTHORITY_LABELS: Readonly<Record<string, string>> = {
  identity: "Technician identity", work_scope: "Work authorization", site_permission: "Site/property permission", jurisdiction: "Jurisdiction",
};

/** Declared vs established, per authority element. A declaration is never shown as established. */
export function presentAuthority(status: ReceiptLike["authority_status"]): PresentedReceipt["authority"] {
  if (!status) return [];
  return Object.entries(AUTHORITY_LABELS).map(([key, label]) => {
    const element = status[key] as AuthorityElementLike | undefined;
    const established = element?.established === true;
    const declared = typeof element?.declared === "object" ? JSON.stringify(element?.declared) : String(element?.declared ?? "—");
    const state = established
      ? `ESTABLISHED by ${element?.source}`
      : element?.establishment_status === "SOURCE_UNAVAILABLE" ? "NOT ESTABLISHED — no independent source available" : "NOT ESTABLISHED";
    return { label, established, summary: `declared: ${declared} · ${state}` };
  });
}

export function presentOemProvenance(provenance: OemProvenanceLike | null): PresentedReceipt["oemProvenance"] {
  if (!provenance) return null;
  const identity = [provenance.record_id, provenance.manufacturer, provenance.model, provenance.document_id, provenance.revision, provenance.page_ref].filter(Boolean).join(" · ");
  const state = provenance.established
    ? `VERIFIED governed record, reviewed by ${provenance.verified_by}`
    : provenance.verification === "VERIFICATION_UNAVAILABLE" ? "NOT VERIFIED — no governed OEM source available" : "NOT VERIFIED";
  const method = provenance.acquisition_method === "MANUAL_TRANSCRIPTION" ? "manual transcription"
    : provenance.acquisition_method === "GOVERNED_LIBRARY" ? "governed OEM registry" : provenance.acquisition_method.toLowerCase().replace(/_/g, " ");
  return { established: provenance.established, summary: `${identity || "OEM reference"} (${method}) · ${state}` };
}

function messagesFor(item: ReceiptUnresolved, findings: readonly FindingLike[]): string[] {
  const own = findings.filter((finding) => finding.proposition === item.proposition);
  const messages = own.length
    ? own.flatMap((finding) => describeReason(finding.reason, finding.evidenceKeys))
    : item.reason_codes.flatMap((code) => describeReason(code, item.evidence_keys));
  return [...new Set(messages)];
}

/** Plain messages for one form field, from the evaluator's per-check findings. */
export function fieldMessages(findings: readonly FindingLike[], field: string): Array<{ code: string; message: string }> {
  return findings
    .filter((finding) => finding.evidenceKeys.some((key) => key === field || key.startsWith(`/evidence/measurements/${field}`)))
    .flatMap((finding) => describeReason(finding.reason, [field]).map((message) => ({ code: finding.reason, message })));
}

/** Form fields the receipt names as needing attention (measurement keys are field ids). */
export function fieldsNeedingAttention(receipt: ReceiptLike): string[] {
  return [...new Set(receipt.unresolved_propositions.flatMap((item) => item.evidence_keys))]
    .filter((key) => !key.startsWith("/"))
    .sort();
}

const BTUH_PER_NOMINAL_TON = 12_000; // unit definition of a refrigeration ton, not a performance target

/**
 * CFM per ton — technician context only. Shown only after the engine has
 * established airflow (P08) and a nominal capacity was entered. It is never
 * sent to Gate A and carries no target, band, or pass/fail meaning.
 */
export function cfmPerTonContext(receipt: ReceiptLike, nominalCapacityBtuh: string): { value: number; note: string } | null {
  const capacity = Number(nominalCapacityBtuh);
  const airflow = receipt.measurement_set.airflow?.value;
  if (!receipt.established_propositions.includes("P08") || airflow === undefined || !Number.isFinite(capacity) || capacity <= 0) {
    return null;
  }
  return {
    value: airflow / (capacity / BTUH_PER_NOMINAL_TON),
    note: "Context only. Not evaluated by Gate A. TA-14 applies no universal CFM-per-ton target; the OEM airflow range governs.",
  };
}
