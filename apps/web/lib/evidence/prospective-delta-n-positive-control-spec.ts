export const STANDING_PRESERVING_CONTROL_SPEC = {
  id: "TA14-PDN-R1-PC01",
  parentRecord: "TA14-PDN-R1",
  frozenEvaluatorCommit: "3b2a1990be32c5ddbe42b8da4387bdac088a86c7",
  proposition: "A material Delta-N must trigger present-standing re-evaluation, but material change alone must not force HOLD or DENY when every condition required for the same consequence remains current, supported, non-contradicted, and present authority remains current.",
  scope: "Same consequence and same frozen evaluator used by TA14-PDN-R1. This control tests discrimination, not failure detection.",
  materialityRule: "For this control, Delta-N is material when the governed execution context changes enough that present standing must be re-evaluated before commit, even if the changed context ultimately remains inside the already-declared admissible constraint. Materiality therefore requires re-evaluation; it does not by itself mean a required condition has failed.",
  requiredStandingRule: "ALLOW is correct only if authority remains current and every required fact remains current, supported, and non-contradicted after the changed context is represented.",
  expectedDetermination: "ALLOW",
  falsifier: "The control is falsified if the unchanged frozen evaluator returns HOLD or DENY solely because a material Delta-N occurred while all required present-standing conditions remain established, or if the evaluator returns ALLOW while any required condition is stale, unsupported, contradicted, or authority is not current.",
  implementationFreezeRule: "The evaluator at apps/web/lib/evidence/prospective-delta-n-core.ts must remain byte-identical to blob 83e9eb267ea9a0e3dc19ffb591c4081f9f796d1c from the original freeze. No evaluator patch is permitted for this control.",
  controlVectorDisclosure: "The concrete standing-preserving Delta-N vector is intentionally not defined in this specification. It must be introduced in a later commit so the proposition, scope, materiality rule, expected determination, falsifier, and implementation constraint predate the trial vector."
} as const;
