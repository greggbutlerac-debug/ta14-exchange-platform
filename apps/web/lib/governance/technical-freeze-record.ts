export type FreezeGateState = "SATISFIED" | "UNSATISFIED" | "NOT_APPLICABLE";

export type FreezeGate = {
  id: string;
  title: string;
  state: FreezeGateState;
  requiredObject: string;
};

export const baseLayerTechnicalFreezeRecord = {
  recordId: "TA14-CEI-BASELAYEROS-R1-TECHNICAL-FREEZE-DRAFT",
  status: "DRAFT — FREEZE NOT ISSUED",
  sourceInstrument: "TA14-CEI-BASELAYEROS-R1-DRAFT",
  sourceIntake: "TA14-CEI-BASELAYEROS-R1-INTAKE",
  rule: "Technical Freeze may issue only when every required gate is SATISFIED or explicitly NOT_APPLICABLE with an attributable reason. An unresolved required gate keeps the examination non-executable.",
  gates: [
    { id: "TF-01", title: "Participant authority", state: "UNSATISFIED", requiredObject: "Attributable participant identity and authority to freeze participant-controlled claims." },
    { id: "TF-02", title: "Architecture identity", state: "UNSATISFIED", requiredObject: "Exact BaseLayerOS architecture/version/release/commit identity." },
    { id: "TF-03", title: "Artifact integrity", state: "UNSATISFIED", requiredObject: "Repository, binary, container, package, or equivalent immutable identity plus SHA-256 or stronger available digest." },
    { id: "TF-04", title: "Claims and non-claims", state: "UNSATISFIED", requiredObject: "Participant-reviewed material claims, explicit limitations, and declined claims." },
    { id: "TF-05", title: "Native semantics", state: "UNSATISFIED", requiredObject: "Native authority, determination, refusal, and revalidation semantics preserved without TA-14 substitution." },
    { id: "TF-06", title: "Consequence boundary", state: "UNSATISFIED", requiredObject: "Declared last reversible state, first irreversible state, execution object, and boundary-proof evidence." },
    { id: "TF-07", title: "Changed-condition object", state: "UNSATISFIED", requiredObject: "Frozen initial condition, material change, timing, dependency affected, and expected native handling." },
    { id: "TF-08", title: "Route surface", state: "UNSATISFIED", requiredObject: "Primary route, known equivalent routes, bypass surfaces, and bounded out-of-scope pathways." },
    { id: "TF-09", title: "Evidence package", state: "UNSATISFIED", requiredObject: "Frozen inputs, logs, receipts, traces, policies, dependency identities, and environment declaration." },
    { id: "TF-10", title: "Acceptance criteria", state: "UNSATISFIED", requiredObject: "Participant-reviewed AC-01 through AC-06 and neutral reporting mapping." },
    { id: "TF-11", title: "Replay package", state: "UNSATISFIED", requiredObject: "Replay inputs, runtime requirements, operator boundary, expected reproducibility, and variance treatment." },
    { id: "TF-12", title: "Publication and confidentiality", state: "UNSATISFIED", requiredObject: "Written factual-review, attribution, confidentiality, and publication terms." },
  ] satisfies FreezeGate[],
  issuanceRequirements: [
    "Generate canonical JSON from the resolved freeze record using stable key ordering.",
    "Generate SHA-256 for the canonical freeze object and every separately frozen evidence object.",
    "Preserve timestamp, issuer identity, participant-reviewed state, and source-object identities.",
    "Issue a new immutable freeze identifier rather than mutating the pre-freeze draft.",
    "Any post-freeze material change requires a successor freeze or explicit revalidation record.",
    "The original freeze remains historically intact even if the examination is corrected, withdrawn, superseded, or replayed.",
  ],
  executableRule: "EXAMINATION_EXECUTABLE = all required TF gates resolved AND freeze hash issued AND participant factual-review state preserved",
} as const;
