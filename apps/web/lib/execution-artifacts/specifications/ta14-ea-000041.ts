import type { ArtifactTestSpecification } from "../execution-harness";

/**
 * TA14-EA-000041
 * Execution-Bounded Evidence Sufficiency
 *
 * This artifact demonstrates how contextual execution judgment is translated
 * into an explicit, machine-verifiable obligation set without using a
 * probabilistic risk score as the admissibility decision rule.
 *
 * The machine does not infer universal truth or invent missing evidence. It
 * verifies whether the declared obligations for this bounded consequence have
 * standing at the execution boundary.
 */
export const TA14_EA_000041_SPECIFICATION: ArtifactTestSpecification = {
  schemaVersion: "ta14.execution-spec.v1",
  artifactId: "TA14-EA-000041",
  routeId: "TA14-ROUTE-041",
  title: "Execution-Bounded Evidence Sufficiency",
  frozenAt: "2026-09-07T12:30:00.000Z",
  input: {
    proposition:
      "A context-dependent agent action may proceed only when every declared mandatory obligation for the bounded consequence has present standing.",
    proposedAction: "AGENT_ACTION_041",
    consequenceBoundary: "Synthetic consequence-bearing agent execution",
    decisionRule: "DETERMINISTIC_OBLIGATION_SATISFACTION",
    probabilisticRiskScoreUsed: false,
    obligations: {
      reality: "Present relevant condition is established.",
      record: "Required evidence objects are identifiable and preserved.",
      continuity: "Evidence remains connected to the present context and has not been materially superseded.",
      admissibility: "Evidence corresponds to the proposition and supports no broader scope than declared.",
      binding: "Current authority and constraints are bound to this exact proposed consequence.",
      commit: "Committed action does not exceed admitted evidence, authority, or scope.",
      execution: "Execution predicates remain satisfied at the immediate consequence boundary.",
      outcome: "Result is preserved as a distinct record; execution does not self-prove outcome truth."
    },
    changedContextRule:
      "A material context change withdraws carry-forward standing and requires a new governed record and revalidation before execution can resume.",
    boundary:
      "Synthetic bounded governance test. Demonstrates obligation satisfaction, not universal truth, safety, alignment, or external-world correctness."
  },
  predicates: [
    {
      id: "EA41-REALITY-PRESENT",
      stage: "REALITY",
      description: "The relevant present condition for the bounded consequence is explicitly established.",
      required: true,
      observed: true,
      failureDetermination: "HOLD",
      evidenceRef: "specification.json#input.obligations.reality"
    },
    {
      id: "EA41-RECORD-IDENTIFIABLE",
      stage: "RECORD",
      description: "Required evidence objects are identifiable and preserved rather than replaced by assertion or confidence score.",
      required: true,
      observed: true,
      failureDetermination: "HOLD",
      evidenceRef: "specification.json#input.obligations.record"
    },
    {
      id: "EA41-CONTINUITY-CURRENT",
      stage: "CONTINUITY",
      description: "Evidence remains attributable to the current context and no material supersession has broken standing.",
      required: true,
      observed: true,
      failureDetermination: "HOLD",
      evidenceRef: "specification.json#input.obligations.continuity"
    },
    {
      id: "EA41-ADMISSIBILITY-SUFFICIENT",
      stage: "ADMISSIBILITY",
      description: "The admitted evidence corresponds to the declared proposition and is sufficient only for the bounded decision scope requested.",
      required: true,
      observed: true,
      failureDetermination: "DENY",
      evidenceRef: "specification.json#input.obligations.admissibility"
    },
    {
      id: "EA41-BINDING-AUTHORITY",
      stage: "BINDING",
      description: "Current authority, identity, constraints, and scope are bound to this exact proposed consequence.",
      required: true,
      observed: true,
      failureDetermination: "ESCALATE",
      evidenceRef: "specification.json#input.obligations.binding"
    },
    {
      id: "EA41-COMMIT-WITHIN-SCOPE",
      stage: "COMMIT",
      description: "The committed action does not exceed the scope supported by admitted evidence and authority.",
      required: true,
      observed: true,
      failureDetermination: "DENY",
      evidenceRef: "specification.json#input.obligations.commit"
    },
    {
      id: "EA41-EXECUTION-PRESENT-STANDING",
      stage: "EXECUTION",
      description: "All mandatory execution predicates retain standing at the immediate consequence boundary.",
      required: true,
      observed: true,
      failureDetermination: "HOLD",
      evidenceRef: "specification.json#input.obligations.execution"
    },
    {
      id: "EA41-OUTCOME-SEPARATED",
      stage: "OUTCOME",
      description: "Execution and outcome are preserved as distinct claims; execution telemetry is not promoted into independent outcome truth.",
      required: true,
      observed: true,
      failureDetermination: "HOLD",
      evidenceRef: "specification.json#input.obligations.outcome"
    }
  ],
  expectedDetermination: "ALLOW",
  claimsBoundary:
    "Demonstrates that a declared contextual obligation set can be evaluated deterministically at the bounded execution boundary without making a probabilistic risk score the admissibility rule. It does not prove universal truth, solve AI alignment generally, guarantee safety, or establish that the declared obligations are complete for every domain. Material context change requires revalidation rather than silent carry-forward."
};
