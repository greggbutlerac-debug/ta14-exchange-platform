import type { ArtifactTestSpecification } from "../execution-harness";

/**
 * TA14-EA-000045
 * Carrier-Bound Execution Enforcement Challenge
 *
 * This is a prospective, falsifiable challenge specification. It deliberately
 * withholds carrier-enforcement standing because carrier-side evidence has not
 * yet been attached for the frozen real route. The resulting HOLD is the
 * governed result, not a defect to be hidden.
 */
export const TA14_EA_000045_SPECIFICATION: ArtifactTestSpecification = {
  schemaVersion: "ta14.execution-spec.v1",
  artifactId: "TA14-EA-000045",
  routeId: "TA14-ROUTE-045",
  title: "Carrier-Bound Execution Enforcement Challenge",
  frozenAt: "2026-09-07T13:10:00.000Z",
  input: {
    proposition:
      "A TA-14 HOLD or DENY determination may claim carrier-level enforcement only when the exact consequence-bearing carrier is frozen, the bound action is tested, and carrier-side or independently observable evidence demonstrates refusal or permitted passage through the declared route.",
    challengeState: "OPEN",
    currentStanding: "NOT_YET_DEMONSTRATED",
    priorRecordFinding: "TA14-OMR-000001 established a narrower record/admissibility finding and did not establish actuator-level or carrier-level interception.",
    carrierEvidenceAttached: false,
    realRouteFrozenAndExecuted: false,
    challengeObligations: {
      "CE-01": "Freeze the exact consequential carrier: endpoint, protocol, target device/system, route, actor, credentials, and execution-crossing point.",
      "CE-02": "Bind action, target, payload, authority, and current evidence state into one immutable execution object before commit.",
      "CE-03": "Under a frozen HOLD or DENY condition, prove the carrier rejects the consequential command and preserve evidence that no downstream request crossed the declared boundary.",
      "CE-04": "Under independently sufficient evidence and authority, prove that only the exact bound consequence can cross the same carrier.",
      "CE-05": "After an initially supportable state, materially change authority, evidence, or target before commit and prove the stale execution object is refused.",
      "CE-06": "Enumerate declared alternate consequence-bearing routes and prove each is governed by the same decision or explicitly outside the bounded claim.",
      "CE-07": "Preserve carrier-side or independently observable evidence of attempted, refused, and allowed execution; TA-14 record state alone is insufficient."
    },
    acceptanceRules: [
      "PASS requires carrier-side evidence that HOLD/DENY prevented the bound consequence through the declared route.",
      "A TA-14 HOLD record without carrier evidence is not a carrier-enforcement PASS.",
      "A missing command, manual non-action, or absent outcome is not equivalent to demonstrated refusal.",
      "No claim of universal non-bypass is permitted unless every in-scope consequence-bearing route is frozen and challenged.",
      "Physical outcome remains distinct from governance determination and execution receipt."
    ],
    boundary:
      "Prospective governance challenge. This specification freezes the proof obligations and current evidentiary gap. It does not claim the carrier-enforcement gap is closed."
  },
  predicates: [
    {
      id: "EA45-REALITY-BOUNDED",
      stage: "REALITY",
      description: "The carrier-enforcement proposition and its bounded claims boundary are explicitly declared.",
      required: true,
      observed: true,
      failureDetermination: "HOLD",
      evidenceRef: "specification.json#input.boundary"
    },
    {
      id: "EA45-RECORD-CHALLENGE-PRESERVED",
      stage: "RECORD",
      description: "The CE-01 through CE-07 challenge obligations and acceptance rules are preserved as a frozen test object.",
      required: true,
      observed: true,
      failureDetermination: "HOLD",
      evidenceRef: "specification.json#input.challengeObligations"
    },
    {
      id: "EA45-CONTINUITY-PRIOR-CLAIM-BOUNDED",
      stage: "CONTINUITY",
      description: "The prior TA14-OMR-000001 finding remains bounded to record/admissibility standing and is not silently promoted into carrier enforcement.",
      required: true,
      observed: true,
      failureDetermination: "HOLD",
      evidenceRef: "specification.json#input.priorRecordFinding"
    },
    {
      id: "EA45-ADMISSIBILITY-CARRIER-EVIDENCE",
      stage: "ADMISSIBILITY",
      description: "Qualifying carrier-side or independently observable evidence is attached for the exact bounded consequence route.",
      required: true,
      observed: false,
      failureDetermination: "HOLD",
      evidenceRef: "specification.json#input.carrierEvidenceAttached"
    },
    {
      id: "EA45-BINDING-REAL-ROUTE",
      stage: "BINDING",
      description: "The exact real consequence-bearing route, identity, authority, payload, target, and execution crossing are frozen into one governed object.",
      required: true,
      observed: null,
      failureDetermination: "HOLD",
      evidenceRef: "specification.json#input.realRouteFrozenAndExecuted"
    },
    {
      id: "EA45-COMMIT-NEGATIVE-POSITIVE-CONTROLS",
      stage: "COMMIT",
      description: "The frozen route has completed both HOLD/DENY negative control and ALLOW positive control under the declared acceptance rules.",
      required: true,
      observed: null,
      failureDetermination: "HOLD"
    },
    {
      id: "EA45-EXECUTION-BYPASS-CHALLENGE",
      stage: "EXECUTION",
      description: "In-scope alternate routes have been enumerated and challenged for bypass or explicitly excluded from the bounded claim.",
      required: true,
      observed: null,
      failureDetermination: "HOLD"
    },
    {
      id: "EA45-OUTCOME-INDEPENDENT-WITNESS",
      stage: "OUTCOME",
      description: "Carrier-side or independently observable evidence preserves attempted, refused, and allowed execution without promoting governance state into outcome proof.",
      required: true,
      observed: null,
      failureDetermination: "HOLD"
    }
  ],
  expectedDetermination: "HOLD",
  claimsBoundary:
    "TA14-EA-000045 demonstrates that the carrier-enforcement criticism has been converted into a frozen, machine-verifiable challenge and that present evidence is insufficient for a carrier-enforcement PASS. It does not establish actuator-level interception, physical non-occurrence, universal non-bypass, or closure of CE-01 through CE-07 until the frozen real route is executed and qualifying evidence is attached."
};
