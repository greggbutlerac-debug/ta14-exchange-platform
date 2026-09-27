/**
 * Pipeline stage: DETERMINISTIC RECEIPT.
 *
 * Builds the frozen receipt schema from the input and the evaluation. The
 * receipt is a pure function of its inputs (no clock, no randomness), so
 * identical inputs produce an identical content hash.
 */

import { sha256Canonical } from "../../crypto/receipts";
import spec from "./gate-a-c1.spec.json";
import { validityTerminatingConditions } from "./invalidation";
import { EXECUTION_AUTHORITY } from "./evaluate-gate-a";
import {
  DO_NOT_CONNECT_ACTION,
  FROZEN_SPEC_SHA256,
  GATE_A_SCOPE,
  GATE_A_STATEMENT,
  GATE_A_VERSION,
  NEXT_ACTION_BY_PROPOSITION,
  REQUIRED_PROPOSITIONS,
  TA14_POLICY_REFS,
  type PropositionId,
} from "./propositions";
import type { GateAEvaluation, GateAInput, PropositionCheck } from "./types";

const NEXT_ACTION_BY_DENY_REASON: Readonly<Record<string, string>> = {
  PRESSURE_INSTRUMENT_ENTRY_NOT_AUTHORIZED: "RETURN_TO_NONINVASIVE_EVIDENCE_AND_RESUBMIT",
  AUTHORITY_TO_TEST_WITHHELD: "OBTAIN_AUTHORITY_TO_TEST",
  NOT_INDICATED: "CONTINUE_DIAGNOSIS_WITHOUT_PRESSURE_ENTRY",
  NOT_INDICATED_PROHIBITED_BASIS: "CONTINUE_DIAGNOSIS_WITHOUT_PRESSURE_ENTRY",
};

function nextActionFor(check: PropositionCheck): string {
  if (check.result === "ESCALATE") return "REFER_OUTSIDE_BOUNDED_GATE_A";
  if (check.result === "DENY") return NEXT_ACTION_BY_DENY_REASON[check.reason] ?? NEXT_ACTION_BY_PROPOSITION[check.proposition];
  return NEXT_ACTION_BY_PROPOSITION[check.proposition];
}

const CERTIFICATION_REASONS = new Set([
  "CERTIFICATION_DOCUMENTATION_MISSING", "TECHNICIAN_NOT_CERTIFIED", "CERTIFICATION_TYPE_NOT_APPLICABLE",
  "SUPERVISOR_CERTIFICATION_TYPE_NOT_APPLICABLE", "CERTIFICATION_NOT_VERIFIED", "CERTIFICATION_VERIFICATION_UNAVAILABLE",
  "CERTIFICATION_VERIFICATION_EVIDENCE_INCOMPLETE", "CERTIFICATION_SELF_VERIFICATION_REJECTED",
]);

/** Amendment A4: the receipt distinguishes a declared credential from a verified one. */
function certificationStatus(certification: GateAInput["evidence"]["technician"]["certification"] | undefined, p17: PropositionCheck[]) {
  const failing = p17.filter((check) => check.result !== "SATISFIED" && CERTIFICATION_REASONS.has(check.reason)).map((check) => check.reason);
  if (!certification) return { credential: "MISSING", established: false, reason_codes: failing };
  if (certification.status === "NOT_CERTIFIED") return { credential: "NOT_CERTIFIED", established: false, reason_codes: failing };
  const verification = certification.verification;
  return {
    credential: certification.status,
    type: certification.status === "CERTIFIED" ? certification.type : certification.supervisorType,
    reference: certification.status === "CERTIFIED" ? certification.certificateRef : certification.supervisorCertificateRef,
    applies_to: certification.status === "CERTIFIED" ? "TECHNICIAN" : "SUPERVISOR",
    assurance: verification?.assurance ?? "DECLARED",
    verification_status: verification?.status ?? "NOT_VERIFIED",
    verifier: verification?.verifier ?? null,
    verification_reference: verification?.reference ?? null,
    verified_at: verification?.verifiedAt ?? null,
    established: failing.length === 0,
    reason_codes: failing,
  };
}

const AUTHORITY_REASON_PREFIX: Readonly<Record<string, string[]>> = {
  identity: ["TECHNICIAN_IDENTITY_"],
  work_scope: ["WORK_SCOPE_"],
  site_permission: ["SITE_PERMISSION_", "AUTHORITY_TO_TEST_WITHHELD"],
  jurisdiction: ["JURISDICTION_", "JURISDICTIONAL_AUTHORIZATION_"],
};

/** Amendment A5: each authority element shows what was declared and what (if anything) established it. */
function authorityStatus(evidence: GateAInput["evidence"], p17: PropositionCheck[]) {
  const failing = p17.filter((check) => check.result !== "SATISFIED").map((check) => check.reason);
  const declared: Record<string, unknown> = {
    identity: evidence.technician.identity,
    work_scope: { ref: evidence.authorization.workScopeRef ?? null, includesDiagnosis: evidence.authorization.workScopeIncludesDiagnosis ?? null },
    site_permission: evidence.authorization.sitePermission ?? null,
    jurisdiction: evidence.authorization.jurisdiction ?? null,
  };
  const keyFor: Readonly<Record<string, "identity" | "workScope" | "sitePermission" | "jurisdiction">> = {
    identity: "identity", work_scope: "workScope", site_permission: "sitePermission", jurisdiction: "jurisdiction",
  };
  const elements = Object.fromEntries(Object.entries(AUTHORITY_REASON_PREFIX).map(([name, prefixes]) => {
    const record = evidence.authorityEstablishment?.[keyFor[name]];
    const reasons = failing.filter((reason) => prefixes.some((prefix) => reason.startsWith(prefix)));
    return [name, {
      declared: declared[name],
      declared_assurance: "DECLARED",
      establishment_status: record?.status ?? "NOT_ESTABLISHED",
      finding: record?.finding ?? null,
      source: record?.source ?? null,
      reference: record?.reference ?? null,
      established_at: record?.establishedAt ?? null,
      established: record?.status === "ESTABLISHED" && reasons.length === 0,
      reason_codes: reasons,
    }];
  }));
  return {
    submitter_authenticated: evidence.submittedBy !== undefined,
    ...elements,
    certification: "see certification_status",
  };
}

/** Amendment A5: provenance and verification state of the OEM reference. */
function oemProvenanceStatus(oem: GateAInput["oem"], p14: PropositionCheck[]) {
  const reasons = p14.filter((check) => check.result !== "SATISFIED" && check.reason.startsWith("OEM_REFERENCE_")).map((check) => check.reason);
  const provenance = oem.provenance;
  return {
    acquisition_method: provenance?.acquisitionMethod ?? "UNSPECIFIED",
    verification: provenance?.verification ?? "NOT_VERIFIED",
    manufacturer: provenance?.manufacturer ?? null,
    model: provenance?.model ?? null,
    document_id: provenance?.documentId ?? null,
    revision: provenance?.revision ?? null,
    page_ref: provenance?.pageRef ?? null,
    source_ref: provenance?.sourceRef ?? null,
    verified_by: provenance?.verifiedBy ?? null,
    verified_at: provenance?.verifiedAt ?? null,
    // Amendment A7: exactly which governed record, document and custody supported the determination.
    record_id: provenance?.recordId ?? null,
    record_hash: provenance?.recordHash ?? null,
    document_hash: provenance?.documentHash ?? null,
    document_date: provenance?.documentDate ?? null,
    matched_systems: provenance?.matchedSystems ?? [],
    transcribed_by: provenance?.transcribedBy ?? null,
    transcribed_at: provenance?.transcribedAt ?? null,
    supersession: provenance?.supersession ?? null,
    established: provenance?.verification === "VERIFIED" && reasons.length === 0,
    reason_codes: reasons,
  };
}

export type GateAReceipt = Record<string, unknown> & {
  receipt_id: string;
  content_hash: string;
  determination: GateAEvaluation["determination"];
  scope: typeof GATE_A_SCOPE;
  gate_b_authorized: false;
};

export function buildReceipt(raw: unknown, evaluation: GateAEvaluation): GateAReceipt {
  const valid = evaluation.checks.some((check) => check.proposition === "INPUT" && check.result === "SATISFIED");
  const input = valid ? (raw as GateAInput) : null;
  const request = input?.request;
  const evidence = input?.evidence;
  const oem = input?.oem;

  const byProposition = new Map<PropositionId, PropositionCheck[]>();
  for (const check of evaluation.checks) {
    byProposition.set(check.proposition, [...(byProposition.get(check.proposition) ?? []), check]);
  }
  const established = REQUIRED_PROPOSITIONS.filter((id) =>
    (byProposition.get(id) ?? []).every((check) => check.result === "SATISFIED"));
  const unresolved = REQUIRED_PROPOSITIONS
    .filter((id) => !established.includes(id))
    .map((id) => {
      const failing = (byProposition.get(id) ?? []).filter((check) => check.result !== "SATISFIED");
      return {
        proposition: id,
        results: [...new Set(failing.map((check) => check.result))].sort(),
        reason_codes: [...new Set(failing.map((check) => check.reason))].sort(),
        evidence_keys: [...new Set(failing.flatMap((check) => check.evidenceKeys))].sort(),
        next_justified_action: nextActionFor(failing[0] as PropositionCheck),
      };
    });
  const nextActions = evaluation.determination === "ALLOW"
    ? ["ACQUIRE_PRESSURE_EVIDENCE_ONLY"]
    : [...new Set([
        // A6: technical ALLOW is never authority to execute.
        ...(evaluation.technicalDetermination === "ALLOW" ? [DO_NOT_CONNECT_ACTION] : []),
        ...unresolved.map((item) => item.next_justified_action),
      ])];
  const partOf = (inExecution: boolean) => {
    const ids = REQUIRED_PROPOSITIONS.filter((id) => EXECUTION_AUTHORITY.has(id) === inExecution);
    return {
      established_propositions: ids.filter((id) => established.includes(id)),
      unresolved_propositions: ids.filter((id) => !established.includes(id)),
      reason_codes: [...new Set(evaluation.checks
        .filter((check) => check.result !== "SATISFIED" && EXECUTION_AUTHORITY.has(check.proposition) === inExecution)
        .map((check) => check.reason))].sort(),
    };
  };

  const measurements = evidence?.measurements ?? {};
  const evidenceHashes: Record<string, string> = {};
  for (const [key, measurement] of Object.entries(measurements)) evidenceHashes[key] = sha256Canonical(measurement);
  if (evidence) evidenceHashes.evidence_record = sha256Canonical(evidence);
  if (oem) evidenceHashes.oem_reference = sha256Canonical(oem);

  const oemRefs = oem ? [...new Set([
    ...oem.documentRefs,
    ...(oem.chargingMethod.status === "IDENTIFIED" ? [oem.chargingMethod.ref] : []),
    ...[oem.airflowRange, oem.espRange, oem.ambientEnvelope, oem.voltageRange].flatMap((range) => (range ? [range.ref] : [])),
    ...(oem.minRunMinutes ? [oem.minRunMinutes.ref] : []),
    ...(oem.stabilityCriterion ? [oem.stabilityCriterion.ref] : []),
    ...(oem.noninvasiveCriterion.status === "PUBLISHED"
      ? oem.noninvasiveCriterion.candidates.flatMap((candidate) => [candidate.range.ref, ...candidate.appliesWhen.map((condition) => condition.ref)])
      : []),
  ])].sort() : [];

  const certification = evidence?.technician.certification;
  const p06 = byProposition.get("P06") ?? [];

  const body = {
    gate_version: GATE_A_VERSION,
    frozen_spec_sha256: FROZEN_SPEC_SHA256,
    record_id: evidence?.recordId ?? null,
    evaluated_at: request?.evaluatedAt ?? evaluation.window.windowEnd,
    determination: evaluation.determination,
    determination_meaning: "PRESSURE_INSTRUMENT_ENTRY_AUTHORIZED only when determination is ALLOW (technical and execution authority both ALLOW)",
    technical_determination: {
      question: "Has sufficient admissible non-invasive evidence been established to justify obtaining refrigerant pressure evidence?",
      determination: evaluation.technicalDetermination,
      ...partOf(false),
    },
    execution_authority: {
      question: "Is the actor presently authorized to perform the pressure-instrument entry?",
      determination: evaluation.executionAuthorityDetermination,
      ...partOf(true),
    },
    reason_codes: [...new Set(evaluation.checks.filter((check) => check.result !== "SATISFIED").map((check) => check.reason))].sort(),
    indication_path: evaluation.indicationPath,
    scope: GATE_A_SCOPE,
    gate_b_authorized: false as const,
    statement: GATE_A_STATEMENT,
    workflow_terminated: false,
    question_type: request?.question ?? null,
    stated_proposition: request?.statedProposition ?? null,
    stated_basis: request?.statedBasis ?? [],
    equipment_identity: evidence ? { manufacturer: evidence.equipment.manufacturer ?? null, indoorModel: evidence.equipment.indoorModel ?? null, outdoorModel: evidence.equipment.outdoorModel ?? null } : null,
    pairing: evidence ? {
      verifiedAgainstOem: evidence.equipment.pairingVerifiedAgainstOem ?? null,
      verifiedAt: evidence.equipment.verifiedAt ?? null,
      establishedByGovernedOemRecord: (byProposition.get("P01") ?? []).every((check) => check.result === "SATISFIED") ? oem?.provenance?.recordId ?? null : null,
    } : null,
    equipment_class: evidence ? { configuration: evidence.equipment.configuration, compressorStaging: evidence.equipment.compressorStaging, mode: evidence.mode } : null,
    metering_device: evidence?.metering.type ?? null,
    metering_device_evidence: evidence ? { basis: evidence.metering.evidenceBasis, verifiedAt: evidence.metering.verifiedAt ?? null } : null,
    refrigerant_declared: evidence?.refrigerant.declared ?? null,
    a2l_check: evidence ? {
      safetyClass: evidence.refrigerant.safetyClass ?? null,
      a2lMarkingsObserved: evidence.refrigerant.a2lMarkingsObserved,
      flammableRefrigerantLabelsObserved: evidence.refrigerant.flammableRefrigerantLabelsObserved,
      scopeResult: (byProposition.get("SCOPE") ?? []).some((check) => check.reason === "OUT_OF_SCOPE_A2L") ? "A2L_ESCALATE" : "NON_A2L_OR_UNRESOLVED",
    } : null,
    technician_identity: evidence?.technician.identity ?? null,
    certification_or_supervisor_ref: certification
      ? certification.status === "CERTIFIED" ? { status: certification.status, type: certification.type, ref: certification.certificateRef }
      : certification.status === "SUPERVISED_APPRENTICE" ? { status: certification.status, type: certification.supervisorType, ref: certification.supervisorCertificateRef }
      : { status: certification.status }
      : null,
    certification_status: certificationStatus(certification, byProposition.get("P17") ?? []),
    submitted_by: evidence?.submittedBy ?? null,
    authority_status: evidence ? authorityStatus(evidence, byProposition.get("P17") ?? []) : null,
    oem_reference_provenance: oem ? oemProvenanceStatus(oem, byProposition.get("P14") ?? []) : null,
    oem_criterion_selection: {
      ...evaluation.criterionSelection,
      range: oem?.noninvasiveCriterion.status === "PUBLISHED"
        ? oem.noninvasiveCriterion.candidates.find((candidate) => candidate.candidateId === evaluation.criterionSelection.candidateId)?.range ?? null
        : null,
      interpolation_performed: false,
    },
    work_scope_ref: evidence?.authorization.workScopeRef ?? null,
    site_and_jurisdiction_status: evidence ? {
      sitePermission: evidence.authorization.sitePermission ?? null,
      jurisdiction: evidence.authorization.jurisdiction ?? null,
    } : null,
    instruments: evidence ? { measurement: evidence.instruments, plannedPressure: evidence.plannedPressureInstruments } : null,
    oem_document_refs: oemRefs,
    measurement_set: measurements,
    raw_static_pressures: { returnStatic: measurements.returnStatic ?? null, supplyStatic: measurements.supplyStatic ?? null },
    derived_tesp: evaluation.derivedTesp,
    steady_state_window: evaluation.window,
    run_start: evidence?.operation.runStartedAt ?? null,
    run_interrupted: evaluation.runRestarted,
    ice_policy_status: {
      policy: "TA14-POLICY-T2 / TA14-RULING-F2 (TA-14 policy; not attributed to any external authority)",
      established: p06.length > 0 && p06.every((check) => check.result === "SATISFIED"),
      reason_codes: p06.map((check) => check.reason).sort(),
      asserts_diagnosis: false,
    },
    ice_restoration_record: evidence?.evaporator.iceRestoration ?? null,
    pre_gate_corrections: evidence?.corrections ?? [],
    validity_terminating_conditions: validityTerminatingConditions(),
    evidence_hashes: evidenceHashes,
    evidence_provenance: Object.fromEntries(Object.entries(measurements).map(([key, measurement]) => [key, measurement?.provenance ?? null])),
    policy_refs: [...TA14_POLICY_REFS],
    authority_refs: spec.external_authorities,
    not_generalized: spec.not_generalized,
    limitations: Object.entries(spec.limitations).map(([key, value]) => `${key}: ${value}`),
    prior_receipt_ids: request?.priorReceiptIds ?? [],
    required_propositions: [...REQUIRED_PROPOSITIONS],
    established_propositions: established,
    unresolved_propositions: unresolved,
    next_justified_actions: nextActions,
    ambiguity_findings: evaluation.ambiguityFindings,
  };

  const contentHash = sha256Canonical(body);
  return {
    receipt_id: `NIRET-GA-C1-${contentHash.slice(0, 24).toUpperCase()}`,
    ...body,
    content_hash: contentHash,
  };
}
