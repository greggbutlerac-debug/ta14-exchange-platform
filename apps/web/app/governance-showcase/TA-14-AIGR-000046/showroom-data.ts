/**
 * HROS v3.3 interactive showroom — presentation data.
 *
 * Two kinds of text live in this module and must stay distinguishable:
 *   1. REGISTERED_* arrays and HROS_EVIDENCE descriptions are copied verbatim from the permanent public
 *      Registry record for TA-14-AIGR-000046 (GET /api/registry/public/TA-14-AIGR-000046 and the public
 *      evidence viewer). They are the registrant's declarations. Do not edit, strengthen or reinterpret them;
 *      the Registry record controls.
 *   2. Everything else is TA-14 presentation copy explaining the declared architecture. It must never state
 *      or imply that TA-14 has examined, demonstrated, verified or certified any HROS claim — TA-14 has not
 *      published any finding, demonstration or governed artifact under TA-14-AIGR-000046.
 */

export const HROS_REGISTRY_IDENTIFIER = "TA-14-AIGR-000046";

export const HROS_RECORD = {
  registryIdentifier: HROS_REGISTRY_IDENTIFIER,
  governanceName: "Human Router Protocol Operating System",
  shortName: "HROS",
  version: "3.3",
  category: "AI Governance, Runtime Execution Gating, Evidence & Provenance Ledger",
  steward: "Claimant: Steven James Stobo",
  organization: "WeRAI AI Integration Inc.",
  status: "Registered · Public",
  registeredAt: "2026-09-29T23:53:03Z",
  registeredDisplay: "September 29, 2026 · 23:53 UTC",
  summary:
    "The Human Router Protocol Operating System (HROS) is a deterministic, fail-closed runtime AI governance architecture engineered to enforce non-delegable human authority at the execution boundary.",
  recordDigestSha256: "e8143c06f9451aeafb424875b5011f46f9f6a442ac1728bbd56a40e5c2f24fac",
  publicProjectionDigestSha256: "f1fe9e2eba9ab998e65721a9fc06fae5735df2e59071489e9d0ef94b44ae4a93",
  publicProjectionDigestVersion: "TA14-PUBLIC-PROJECTION-V1",
  boundary: "Registration is not certification.",
} as const;

export const HROS_LINKS = {
  record: `/workspace/ai-governance/registry/records/${HROS_REGISTRY_IDENTIFIER}`,
  evidence: `/workspace/ai-governance/registry/records/${HROS_REGISTRY_IDENTIFIER}/evidence`,
  history: `/workspace/ai-governance/registry/history/${HROS_REGISTRY_IDENTIFIER}`,
  registry: "/workspace/ai-governance/registry",
  artifactRegistry: "/artifacts/registry",
  governanceShowcase: "/governance-showcase",
  registeredGovernance: "/showrooms/registered-governance",
  foundingDemonstrations: "/artifacts/founding-demonstrations",
  adversarialExamination: "/workspace/ai-governance/adversarial-examination",
  consequenceExamination: "/workspace/ai-governance/examination-engine",
  interoperabilityExaminations: "/artifacts/interoperability-examinations",
} as const;

// ---------------------------------------------------------------------------------------------------------
// VERBATIM — permanent Registry record TA-14-AIGR-000046 (one entry per line of the registered text).
// Claim numbers used on the page follow the order in which the claims appear in the registered text.
// ---------------------------------------------------------------------------------------------------------

export const REGISTERED_FORMAL_CLAIMS: readonly string[] = [
  "Decoupling of Generative Capability and Execution Authority: Computational capability produced by probabilistic models does not confer authority to mutate external or physical state.",
  "Deterministic Fail-Closed Runtime Gating (G=1): Consequential state transitions—including external API calls, financial transactions, database writes, and actuation—fail closed until authorized by an explicit, context-bound human signature.",
  "Substrate-Level Transport Interlocks: Execution boundaries are anchored in deterministic transport and operating system layers (process boundaries, socket quarantine, hardware interlocks), preventing bypass via prompt injection, tool recursion, or autonomous path discovery.",
  "Cryptographic Non-Repudiable Provenance Spine: Every observation, model proposal, human authorization receipt, and verified outcome is committed to an append-only, hash-linked provenance ledger.",
  "Decoupled Actor and Historian Architecture: The computational component executing or proposing a state transition is architecturally prohibited from being the sole recorder or validator of its own justification.",
  "Elimination of Post-Hoc Plausible Deniability: Every consequential state change requires an antecedent, non-repudiable authorization receipt, eliminating reliance on post-hoc explanatory approximations.",
  "Zero-Cloud Sovereign Edge Execution: Core runtime governance gates and provenance records operate on local, sovereign hardware nodes without mandatory cloud egress or external dependency surfaces.",
];

export const REGISTERED_NON_CLAIMS: readonly string[] = [
  "Does Not Claim to Eliminate Foundation Model Hallucinations: HROS governs state transitions, tool invocations, and execution boundaries; it does not claim to alter the latent weights or probabilistic generation mechanics of upstream models.",
  "Does Not Claim Autonomous Alignment: The framework explicitly rejects the premise that autonomous agents can reliably self-govern through prompt heuristics; it enforces deterministic, fail-closed human authorization (G=1) at irreversible boundaries.",
  "Does Not Claim Universal Protection Without Substrate Integration: Runtime containment requires deterministic binding to host operating systems, network transport gates, process sandboxes, or bare-metal execution interlocks.",
  "Does Not Claim to Adjudicate Subjective Moral Truth: The protocol enforces non-delegable human authority and immutable evidentiary provenance; it verifies authorization standing and procedural compliance rather than subjective moral quality.",
  "Does Not Claim Retroactive Containment of Legacy Systems: Governance guarantees apply strictly to execution paths routed through verified gates; un-instrumented external endpoints require gateway retrofitting.",
];

export const REGISTERED_KNOWN_LIMITATIONS: readonly string[] = [
  "Latency Overhead on High-Frequency Operations: Enforcing human-gated authorization introduces discrete operational latency, making direct synchronous human gates unsuitable for sub-second micro-transaction loops without tiered batch policies.",
  "Host Kernel and Physical Dependency: Gate guarantees depend on the integrity of the host OS kernel or transport boundary; compromised root environments require external hardware interlocks (e.g., physical consent tokens) to ensure isolation.",
  "Human Authorization Saturation: System efficacy depends on human cognitive bandwidth and interface presentation fidelity, requiring design safeguards against authorization fatigue and rubber-stamp approvals under high-volume alerts.",
  "Cross-Regulatory Admissibility Standards: Interoperability between cryptographic execution receipts and varying jurisdictional evidentiary standards (e.g., EU AI Act Article 12 vs. Federal Rules of Evidence) remains subject to ongoing bilateral validation.",
];

/** Splits a registered line into its registrant-supplied heading and body ("Heading: body"). */
export function splitRegisteredLine(line: string): { heading: string; body: string } {
  const index = line.indexOf(": ");
  return index === -1 ? { heading: "", body: line } : { heading: line.slice(0, index), body: line.slice(index + 2) };
}

// ---------------------------------------------------------------------------------------------------------
// VERBATIM — public evidence viewer, TA-14-AIGR-000046 (all five items: Public · Current, relationship
// "Other", classification "Other supporting evidence", source date not recorded).
// ---------------------------------------------------------------------------------------------------------

export type HrosEvidence = {
  index: number;
  fileName: string;
  mimeType: string;
  size: string;
  sha256: string;
  supportsClaims: number[];
  /** The registrant's description, verbatim. */
  description: string;
  /** TA-14 presentation note (never a finding). */
  note?: string;
};

export const HROS_EVIDENCE: readonly HrosEvidence[] = [
  {
    index: 1,
    fileName: "HROS_Attribution_Gate_Execution_Boundary.jpg",
    mimeType: "image/jpeg",
    size: "829.9 KB",
    sha256: "bb9fc4099046bc349eb3862d36bd0cadf952f5e13e0dc3f438711aeece2d637e",
    supportsClaims: [2, 3, 5],
    description:
      "Supports Claims 2, 3, and 5: Demonstrates the architectural mechanics of the HROS Attribution Gate, enforcing the T=0 fail-closed execution boundary and separating the executing model from the independent provenance recorder.",
  },
  {
    index: 2,
    fileName: "DeepKang_Labs_IAST_Corpus_Review_Independent_Evaluation.pdf",
    mimeType: "application/pdf",
    size: "74.4 KB",
    sha256: "2816bb3c1e12edcc54d234951fe11cf610e5dd7c69d044cdb5dda6ceedab5731",
    supportsClaims: [1, 4, 6],
    description:
      "Supports Claims 1, 4, and 6: Independent technical review and structural evaluation of the IAST/HROS corpus and execution boundaries conducted by DeepKang Labs.",
    note:
      "Registrant-submitted. The “independent” characterization is the registrant’s description of a third-party document. It is not a TA-14 review, and TA-14 has issued no finding on its content.",
  },
  {
    index: 3,
    fileName: "WeRAI_Sovereign_Mesh_Architecture_Infographic.jpg",
    mimeType: "image/jpeg",
    size: "733.1 KB",
    sha256: "4bfdbf028840a76b10ad2145bf652c1601cfdc9723c55703bab784a1ca0a2621",
    supportsClaims: [7],
    description:
      "Supports Claim 7: Demonstrates the sovereign edge mesh topology, local inference node coordination, and zero-telemetry boundary without mandatory cloud dependencies.",
  },
  {
    index: 4,
    fileName: "HROS_HABITS_Foundational_Architecture_v2.0.pdf",
    mimeType: "application/pdf",
    size: "1.0 MB",
    sha256: "fafc5f5316e661b6fb8734ab8f3ae4bc18dc68f5704e47067df43085e06a0137",
    supportsClaims: [1, 2, 3, 4],
    description:
      "Supports Claims 1, 2, 3, and 4: Foundational technical specification detailing the decoupling of capability from authority, deterministic G=1 runtime gating, and the cryptographic provenance ledger.",
  },
  {
    index: 5,
    fileName: "HROS_Document_Laundering_Matrix_Forensic_Anatomy.pdf",
    mimeType: "application/pdf",
    size: "496.5 KB",
    sha256: "6d3120de1b30b975760a1916bdfeaf623a12909b86d13aab482a14fdd22941bb",
    supportsClaims: [4, 5, 6],
    description:
      "Supports Claims 4, 5, and 6: Detailed forensic analysis of multi-tier provenance, adversarial bypass containment, and the structural necessity of decoupling the actor from the historian to eliminate plausible deniability.",
  },
];

// ---------------------------------------------------------------------------------------------------------
// TA-14 presentation — the declared authority chain and visitor-operable conditions.
// ---------------------------------------------------------------------------------------------------------

export type NodeId = "proposal" | "gate" | "authority" | "receipt" | "execution" | "provenance";

export const HROS_NODES: readonly { id: NodeId; label: string; role: string; claims: number[] }[] = [
  { id: "proposal", label: "PROPOSAL", role: "A probabilistic model proposes a consequential state transition. Capability confers no authority.", claims: [1] },
  { id: "gate", label: "GATE", role: "Deterministic G=1 runtime gate, anchored in transport and operating-system layers.", claims: [2, 3] },
  { id: "authority", label: "HUMAN AUTHORITY", role: "An explicit, context-bound human signature — non-delegable human authority.", claims: [2] },
  { id: "receipt", label: "RECEIPT", role: "An antecedent, non-repudiable authorization receipt exists before the state change.", claims: [6] },
  { id: "execution", label: "EXECUTION", role: "The state transition runs on local, sovereign edge hardware.", claims: [7] },
  { id: "provenance", label: "PROVENANCE", role: "An independent historian commits the chain to an append-only, hash-linked ledger.", claims: [4, 5] },
];

/**
 * Node status inside a condition. Labels are always rendered as text so status is never conveyed by colour alone.
 *   pass       — the declared architecture describes this step as satisfied
 *   halted     — the declared architecture stops the transition here
 *   blocked    — a path around the declared chain is shown as refused by the declared interlock
 *   unreached  — the step is not reached because an earlier step halted
 *   dependent  — the declared guarantee at this step rests on a registered limitation or non-claim
 *   undeclared — the registered record does not describe the behaviour at this step for this condition
 */
export type NodeStatus = "pass" | "halted" | "blocked" | "unreached" | "dependent" | "undeclared";

export const NODE_STATUS_LABEL: Record<NodeStatus, string> = {
  pass: "DECLARED · SATISFIED",
  halted: "DECLARED · FAILS CLOSED",
  blocked: "DECLARED · BYPASS REFUSED",
  unreached: "NOT REACHED",
  dependent: "REGISTERED LIMITATION",
  undeclared: "NOT DECLARED IN RECORD",
};

export type ConditionId =
  | "baseline"
  | "missing-signature"
  | "authority-revoked"
  | "transport-bypass"
  | "historian-failure"
  | "compromised-host"
  | "authorization-fatigue";

export type HrosCondition = {
  id: ConditionId;
  control: string;
  label: string;
  result: string;
  nodes: Record<NodeId, NodeStatus>;
  /** TA-14's plain reading of what the registered declarations say about this condition. */
  declared: string;
  /** Formal claims (1-based) the declared response rests on. */
  claims: number[];
  /** Registered non-claims (1-based) that bound this condition. */
  nonClaims: number[];
  /** Registered known limitations (1-based) that bound this condition. */
  limitations: number[];
  /** Where the registered record is silent, said plainly rather than filled in. */
  gap?: string;
};

export const HROS_CONDITIONS: readonly HrosCondition[] = [
  {
    id: "baseline",
    control: "BASELINE · CURRENT AUTHORITY",
    label: "CURRENT HUMAN AUTHORITY PRESENT",
    result: "DECLARED PATH: AUTHORIZED TRANSITION PROCEEDS",
    nodes: { proposal: "pass", gate: "pass", authority: "pass", receipt: "pass", execution: "pass", provenance: "pass" },
    declared:
      "A model proposal reaches the G=1 gate. An explicit, context-bound human signature is given, an antecedent authorization receipt exists before the state change, execution runs at the sovereign edge, and a historian separate from the actor commits the chain to the hash-linked ledger.",
    claims: [1, 2, 4, 5, 6, 7],
    nonClaims: [4],
    limitations: [1],
  },
  {
    id: "missing-signature",
    control: "REMOVE HUMAN SIGNATURE",
    label: "NO EXPLICIT HUMAN SIGNATURE",
    result: "DECLARED RESPONSE: FAILS CLOSED · NO STATE TRANSITION",
    nodes: { proposal: "pass", gate: "halted", authority: "halted", receipt: "unreached", execution: "unreached", provenance: "pass" },
    declared:
      "Under the G=1 declaration, a consequential state transition does not proceed until an explicit, context-bound human signature authorizes it. Without one, no authorization receipt exists and execution is not reached. The declared provenance spine records model proposals as well as outcomes.",
    claims: [2, 4, 6],
    nonClaims: [2],
    limitations: [],
  },
  {
    id: "authority-revoked",
    control: "REVOKE AUTHORITY",
    label: "AUTHORITY REVOKED BEFORE EXECUTION",
    result: "DECLARED BASIS: NO CURRENT, CONTEXT-BOUND AUTHORITY → NO RECEIPT",
    nodes: { proposal: "pass", gate: "halted", authority: "halted", receipt: "undeclared", execution: "unreached", provenance: "undeclared" },
    declared:
      "The registered claims require an explicit, context-bound human signature and an antecedent authorization receipt for every consequential state change. A revoked authority is shown here as no longer supplying that basis, so the transition is shown held at the gate.",
    claims: [2, 6],
    nonClaims: [],
    limitations: [],
    gap:
      "The registered record does not separately describe how revocation is expressed, propagated or timed, or what happens to a receipt issued before revocation. This condition shows only what Claims 2 and 6 would require; it is not a declared revocation mechanism.",
  },
  {
    id: "transport-bypass",
    control: "ATTEMPT TRANSPORT BYPASS",
    label: "PATH AROUND THE GATE ATTEMPTED",
    result: "DECLARED RESPONSE: SUBSTRATE INTERLOCK REFUSES THE BYPASS",
    nodes: { proposal: "pass", gate: "blocked", authority: "unreached", receipt: "unreached", execution: "blocked", provenance: "undeclared" },
    declared:
      "HROS declares that execution boundaries are anchored in deterministic transport and operating-system layers — process boundaries, socket quarantine, hardware interlocks — preventing bypass via prompt injection, tool recursion, or autonomous path discovery.",
    claims: [3],
    nonClaims: [3, 5],
    limitations: [2],
    gap:
      "Per the registrant's own non-claims, this protection applies only to execution paths routed through HROS gates and bound to the host substrate. Un-instrumented external endpoints are outside it until retrofitted. Whether a refused bypass attempt is itself recorded is not stated in the record.",
  },
  {
    id: "historian-failure",
    control: "FAIL THE HISTORIAN",
    label: "PROVENANCE HISTORIAN UNAVAILABLE",
    result: "DECLARED REQUIREMENT CANNOT BE MET · FAILURE BEHAVIOUR NOT DECLARED",
    nodes: { proposal: "pass", gate: "undeclared", authority: "pass", receipt: "undeclared", execution: "undeclared", provenance: "halted" },
    declared:
      "HROS declares that observations, proposals, authorization receipts and outcomes are committed to an append-only, hash-linked ledger, and that the component executing or proposing a transition may not be the sole recorder or validator of its own justification. With the historian down, the actor cannot stand in as its own record.",
    claims: [4, 5],
    nonClaims: [],
    limitations: [],
    gap:
      "The registered record does not state whether execution halts, queues or proceeds when the provenance historian is unavailable. The showroom marks those steps as not declared rather than assuming a fail-closed outcome.",
  },
  {
    id: "compromised-host",
    control: "COMPROMISE THE HOST",
    label: "HOST KERNEL / ROOT ENVIRONMENT COMPROMISED",
    result: "REGISTERED LIMITATION: GATE GUARANTEES DEPEND ON HOST INTEGRITY",
    nodes: { proposal: "pass", gate: "dependent", authority: "dependent", receipt: "dependent", execution: "dependent", provenance: "dependent" },
    declared:
      "HROS registers this condition as a known limitation, not a guarantee: gate guarantees depend on the integrity of the host OS kernel or transport boundary, and compromised root environments require external hardware interlocks, such as physical consent tokens, to ensure isolation.",
    claims: [3],
    nonClaims: [3],
    limitations: [2],
  },
  {
    id: "authorization-fatigue",
    control: "FLOOD WITH AUTHORIZATIONS",
    label: "HIGH-VOLUME ALERTS · AUTHORIZATION FATIGUE",
    result: "REGISTERED LIMITATION: EFFICACY DEPENDS ON HUMAN BANDWIDTH",
    nodes: { proposal: "pass", gate: "pass", authority: "dependent", receipt: "pass", execution: "pass", provenance: "pass" },
    declared:
      "The declared gate requires an explicit human signature. Non-Claim 4 places authorization standing and procedural compliance, not subjective quality, inside its scope. HROS registers that efficacy depends on human cognitive bandwidth and interface presentation fidelity, and that direct synchronous gates do not suit sub-second loops without tiered batch policies.",
    claims: [2],
    nonClaims: [4],
    limitations: [1, 3],
    gap:
      "The record names the need for design safeguards against authorization fatigue and rubber-stamp approvals; it does not describe which safeguards HROS v3.3 implements.",
  },
];

// ---------------------------------------------------------------------------------------------------------
// Registration boundary and examination surface.
// ---------------------------------------------------------------------------------------------------------

export const REGISTRATION_ESTABLISHED: readonly string[] = [
  "A permanent Registry identifier, TA-14-AIGR-000046, attributable to Claimant Steven James Stobo · WeRAI AI Integration Inc.",
  "A bounded declaration of HROS Version 3.3: its formal claims, explicit non-claims and known limitations, preserved as submitted.",
  "Five public evidence items preserved with SHA-256 digests and the registrant's stated claim support.",
  "A dated, public record state — Registered · Public — that later events append to rather than rewrite.",
];

export const REGISTRATION_NOT_ESTABLISHED: readonly string[] = [
  "Certification",
  "Technical validation",
  "Patent validation",
  "Legal approval",
  "Safety assurance",
  "Interoperability proof",
  "Performance proof",
  "Execution authorization",
];

export type ExaminationSurface = {
  kind: string;
  title: string;
  href: string;
  questions: string[];
};

export const NEXT_EXAMINATION_SURFACES: readonly ExaminationSurface[] = [
  {
    kind: "FOUNDING DEMONSTRATIONS",
    title: "Does the declared G=1 gate fail closed on a live transition?",
    href: HROS_LINKS.foundingDemonstrations,
    questions: [
      "A frozen consequential transition attempted with no human signature (Claim 2).",
      "The same transition with a valid, context-bound signature, and the receipt ordering relative to execution (Claim 6).",
    ],
  },
  {
    kind: "ADVERSARIAL EXAMINATIONS",
    title: "Can the transport interlock be routed around?",
    href: HROS_LINKS.adversarialExamination,
    questions: [
      "Prompt-injection, tool-recursion and autonomous path-discovery bypass attempts (Claim 3), bounded by Non-Claims 3 and 5.",
      "Behaviour under a compromised host and under authorization fatigue (Limitations 2 and 3).",
    ],
  },
  {
    kind: "CONSEQUENCE EXAMINATIONS",
    title: "Does the record reconstruct who authorized what, before it happened?",
    href: HROS_LINKS.consequenceExamination,
    questions: [
      "Independent replay of the hash-linked provenance spine (Claim 4).",
      "Whether the actor can ever be the sole recorder of its own justification (Claim 5), and behaviour when the historian is unavailable.",
    ],
  },
  {
    kind: "INTEROPERABILITY EXAMINATIONS",
    title: "What does an HROS receipt mean outside HROS?",
    href: HROS_LINKS.interoperabilityExaminations,
    questions: [
      "Admissibility of cryptographic execution receipts across evidentiary standards (Limitation 4).",
      "Bounded interface examinations with independently registered architectures, without collapsing either identity.",
    ],
  },
];

export type LivingHistoryEntry = { date: string; title: string; detail: string; kind: "evidence" | "registration" | "presentation" };

/** Append-only. New entries go at the end; existing entries are never edited or removed. */
export const HROS_LIVING_HISTORY: readonly LivingHistoryEntry[] = [
  {
    date: "September 28, 2026",
    kind: "evidence",
    title: "Five public evidence items submitted",
    detail: "Evidence 1–5 entered with SHA-256 digests and registrant-stated claim support. Evidence presence is not a TA-14 finding.",
  },
  {
    date: "September 29, 2026",
    kind: "registration",
    title: "Permanent identity entered the Registry — TA-14-AIGR-000046",
    detail: "HROS Version 3.3 registered and published at 23:53 UTC. Record state: Registered · Public. Registration is not certification.",
  },
  {
    date: "September 29, 2026",
    kind: "presentation",
    title: "Interactive registered-governance showroom prepared",
    detail: "Presentation layer only. The Registry record, its claims, non-claims, limitations and evidence are unchanged.",
  },
];
