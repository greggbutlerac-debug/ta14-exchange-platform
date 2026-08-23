import type { ArtifactTestSpecification } from "../execution-harness";

/**
 * Reference implementation for TA14-EA-000025.
 *
 * This specification deliberately does NOT pretend that an external observation
 * has occurred. The missing qualifying observation is the governed fact that
 * causes the harness to HOLD at RECORD.
 */
export const TA14_EA_000025_SPECIFICATION: ArtifactTestSpecification = {
  schemaVersion: "ta14.execution-spec.v1",
  artifactId: "TA14-EA-000025",
  routeId: "TA14-ROUTE-025",
  title: "Independent External-State Acquisition",
  frozenAt: "2026-08-23T19:36:00.000Z",
  input: {
    proposition: "A claimed external condition may acquire execution standing only from a qualifying external observation.",
    assertedExternalState: "CONDITION_PRESENT",
    assertedBy: "test-vector",
    qualifyingExternalObservationAttached: false,
    boundary: "Synthetic bounded governance test; no external event is claimed as independently observed.",
  },
  predicates: [
    {
      id: "EA25-REALITY-BOUNDED",
      stage: "REALITY",
      description: "The proposition and synthetic test boundary are explicitly identified.",
      required: true,
      observed: true,
      failureDetermination: "HOLD",
      evidenceRef: "specification.json#input.boundary",
    },
    {
      id: "EA25-RECORD-EXTERNAL-OBSERVATION",
      stage: "RECORD",
      description: "A qualifying external observation exists independently of caller-authored or test-vector state.",
      required: true,
      observed: false,
      failureDetermination: "HOLD",
      evidenceRef: "specification.json#input.qualifyingExternalObservationAttached",
    },
    {
      id: "EA25-CONTINUITY-PRESERVED",
      stage: "CONTINUITY",
      description: "Qualifying observation continuity can be established from acquisition through decision time.",
      required: true,
      observed: null,
      failureDetermination: "HOLD",
    },
    {
      id: "EA25-ADMISSIBILITY-CORRESPONDENCE",
      stage: "ADMISSIBILITY",
      description: "The qualifying observation corresponds to the proposition for which it is offered.",
      required: true,
      observed: null,
      failureDetermination: "HOLD",
    },
  ],
  expectedDetermination: "HOLD",
  claimsBoundary: "Demonstrates evidence-class gating between asserted state and qualifying external observation. It does not claim an external event was independently observed.",
};
