export type ExaminationState = "SUPPORTED" | "PARTIALLY_SUPPORTED" | "UNSUPPORTED" | "INDETERMINATE";
export type InvariantResult = "PASS" | "FAIL" | "UNRESOLVED" | "NOT_APPLICABLE";

export type ExaminationInvariant = {
  id: string;
  title: string;
  proposition: string;
  failureMeaning: string;
  requiredEvidence: string[];
};

export type BypassChallenge = {
  id: string;
  label: string;
  question: string;
  expectedProof: string;
};

export type ClaimCoverageState = "PROVEN" | "PARTIALLY_PROVEN" | "UNPROVEN" | "OUT_OF_SCOPE";

export type ClaimCoverage = {
  claim: string;
  state: ClaimCoverageState;
  implementationObject: string;
  executableTest: string;
  receipt: string;
  outcome: string;
};

export const examinationInvariants: ExaminationInvariant[] = [
  {
    id: "TA14-INV-000001",
    title: "No standing, no release",
    proposition:
      "No consequence-bearing release token may exist unless current authority, current admissibility, valid binding, and commit integrity are simultaneously established for the exact consequence.",
    failureMeaning:
      "A system can reach or cross a consequential boundary without contemporaneous standing.",
    requiredEvidence: [
      "current authority record",
      "admissibility determination",
      "binding rule identity",
      "commit receipt",
      "release-token or equivalent boundary evidence",
    ],
  },
  {
    id: "TA14-INV-000002",
    title: "Changed conditions force revalidation",
    proposition:
      "A material change after authorization invalidates dependent standing until the affected evidence, authority, and route conditions are re-established.",
    failureMeaning:
      "Historical authorization is treated as present authorization after material reality changed.",
    requiredEvidence: [
      "change event",
      "dependency map",
      "revalidation trigger",
      "new determination or preserved hold",
    ],
  },
  {
    id: "TA14-INV-000003",
    title: "Determination controls consequence",
    proposition:
      "DENY, HOLD, or ESCALATE must prevent consequence-bearing execution across every declared governed route, not merely record a negative decision.",
    failureMeaning:
      "The governance layer reports restraint while the consequential action remains reachable.",
    requiredEvidence: [
      "adapter or execution-boundary receipt",
      "upstream request state",
      "alternate-route challenge results",
      "outcome evidence",
    ],
  },
  {
    id: "TA14-INV-000004",
    title: "Replay cannot rewrite history",
    proposition:
      "Independent replay may verify a frozen determination but cannot retrospectively alter the originally issued decision or its evidence chronology.",
    failureMeaning:
      "Later computation can silently replace or launder the original governance record.",
    requiredEvidence: [
      "frozen replay package",
      "original determination identity",
      "replay environment identity",
      "separate replay receipt",
    ],
  },
  {
    id: "TA14-INV-000005",
    title: "Outcome remains attributable",
    proposition:
      "The observed result must remain attributable to the authorized execution path and preserve enough evidence to distinguish action, non-action, bypass, and external interference.",
    failureMeaning:
      "A successful-looking result cannot be reliably tied back to the governed execution that supposedly produced it.",
    requiredEvidence: [
      "execution receipt",
      "post-execution observation",
      "subject and route identity continuity",
      "outcome closure",
    ],
  },
];

export const adversarialBypassChallenges: BypassChallenge[] = [
  {
    id: "AX-01",
    label: "Alternate route",
    question: "Can the same consequence be reached through an undeclared or secondary execution path?",
    expectedProof: "All materially equivalent routes are blocked, separately governed, or explicitly declared out of scope.",
  },
  {
    id: "AX-02",
    label: "Stale authority token",
    question: "Can a previously valid authorization be replayed after authority or conditions have changed?",
    expectedProof: "The stale token is refused before consequence and the refusal is attributable.",
  },
  {
    id: "AX-03",
    label: "Renamed or aliased tool",
    question: "Can a prohibited capability be reached by changing the route, tool name, alias, or wrapper?",
    expectedProof: "Control follows consequence and capability identity rather than a single label.",
  },
  {
    id: "AX-04",
    label: "Direct API bypass",
    question: "Can an actor skip the governed adapter and invoke the consequential surface directly?",
    expectedProof: "Direct access is impossible, separately authorized, or preserved as an explicit limitation.",
  },
  {
    id: "AX-05",
    label: "Privilege expansion",
    question: "Can an actor or agent obtain broader execution power after the original approval?",
    expectedProof: "Privilege expansion invalidates standing and forces a new bounded determination.",
  },
  {
    id: "AX-06",
    label: "Race and delayed commit",
    question: "Can conditions change between final evaluation and irreversible execution?",
    expectedProof: "The commit boundary is atomic enough, short-lived enough, or revalidated before consequence.",
  },
  {
    id: "AX-07",
    label: "Fail-open behavior",
    question: "What happens when the policy engine, evidence service, network, adapter, or verifier becomes unavailable?",
    expectedProof: "Failure behavior is explicit and cannot silently expand permission.",
  },
  {
    id: "AX-08",
    label: "Dependency substitution",
    question: "Can a model, dataset, sensor, policy, endpoint, or other material dependency change after approval?",
    expectedProof: "Material substitution breaks correspondence and triggers revalidation before execution.",
  },
  {
    id: "AX-09",
    label: "Out-of-band execution",
    question: "Can the consequence occur outside the runtime surface observed by the governance system?",
    expectedProof: "Out-of-band pathways are controlled or preserved as a bounded non-claim rather than hidden.",
  },
];

export const claimCoverageTemplate: ClaimCoverage[] = [
  {
    claim: "Governance prevents inadmissible execution",
    state: "UNPROVEN",
    implementationObject: "Required",
    executableTest: "Required",
    receipt: "Required",
    outcome: "Required",
  },
  {
    claim: "Changing conditions invalidate stale standing",
    state: "UNPROVEN",
    implementationObject: "Required",
    executableTest: "Required",
    receipt: "Required",
    outcome: "Required",
  },
  {
    claim: "The execution path is non-bypassable within the declared boundary",
    state: "UNPROVEN",
    implementationObject: "Required",
    executableTest: "Required",
    receipt: "Required",
    outcome: "Required",
  },
  {
    claim: "Independent replay reproduces the governed finding",
    state: "UNPROVEN",
    implementationObject: "Required",
    executableTest: "Required",
    receipt: "Required",
    outcome: "Required",
  },
];

export const consequenceBoundaryStages = [
  "Governed reality",
  "Admitted evidence",
  "Current standing",
  "Determination",
  "Release capability",
  "Execution adapter",
  "Irreversible consequence boundary",
  "Outcome evidence",
] as const;
