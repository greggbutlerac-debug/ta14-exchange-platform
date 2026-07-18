export const ACADEMY_CATALOG_SCHEMA =
  "TA14_AI_GOVERNANCE_ACADEMY_CATALOG_V1" as const;

export type AcademyProgramId =
  | "ADMISSIBLE_EXECUTION_FOUNDATIONS"
  | "ROUTE_CREATION_AND_DESIGN"
  | "EVIDENCE_INTEGRITY_AND_PROVENANCE"
  | "CONTINUITY_AND_BINDING"
  | "RUNTIME_ADMISSIBILITY_GOVERNANCE"
  | "REPLAY_RECEIPTS_AND_VERIFICATION";

export type AcademyModuleStatus =
  | "AVAILABLE"
  | "IN_DEVELOPMENT"
  | "PLANNED";

export type AcademyModule = {
  id: string;
  title: string;
  summary: string;
  sequence: number;
  status: AcademyModuleStatus;
  learningOutcomes: readonly string[];
};

export type AcademyProgram = {
  schema: typeof ACADEMY_CATALOG_SCHEMA;
  id: AcademyProgramId;
  title: string;
  shortTitle: string;
  audience: string;
  summary: string;
  governingPrinciple: string;
  status: AcademyModuleStatus;
  delivery: readonly string[];
  modules: readonly AcademyModule[];
};

export const ACADEMY_PROGRAMS: readonly AcademyProgram[] = [
  {
    schema: ACADEMY_CATALOG_SCHEMA,
    id: "ADMISSIBLE_EXECUTION_FOUNDATIONS",
    title: "TA-14 Admissible Execution Foundations",
    shortTitle: "Execution Foundations",
    audience:
      "AI governance professionals, architects, builders, reviewers, risk leaders, and organizations evaluating consequence-bearing AI systems.",
    summary:
      "Introduces the TA-14 Admissible Execution Architecture and teaches why policy approval, model output, and operator trust are not enough to establish execution legitimacy.",
    governingPrinciple:
      "No admissible evidence. No admissible execution.",
    status: "AVAILABLE",
    delivery: [
      "Interactive lessons",
      "Route examples",
      "Knowledge checks",
      "Applied review exercises",
      "Sandbox practice",
    ],
    modules: [
      {
        id: "foundations-governance-problem",
        title: "The AI Governance Execution Problem",
        summary:
          "Why authorization, policy compliance, and model confidence can still produce illegitimate execution.",
        sequence: 1,
        status: "AVAILABLE",
        learningOutcomes: [
          "Distinguish governance approval from execution legitimacy",
          "Identify consequence-bearing execution",
          "Recognize evidence and continuity failures",
        ],
      },
      {
        id: "foundations-chain",
        title: "The TA-14 Execution Chain",
        summary:
          "Reality, Record, Continuity, Admissibility, Binding, Commit, Execution, and Outcome.",
        sequence: 2,
        status: "AVAILABLE",
        learningOutcomes: [
          "Explain each stage of the TA-14 chain",
          "Identify where a route can lose legitimacy",
          "Map an AI action to the full chain",
        ],
      },
      {
        id: "foundations-decisions",
        title: "ALLOW, HOLD, DENY, and ESCALATE",
        summary:
          "How admissibility decisions govern what may happen next without pretending uncertainty has disappeared.",
        sequence: 3,
        status: "AVAILABLE",
        learningOutcomes: [
          "Differentiate the four route decisions",
          "Apply decision states to example routes",
          "Avoid treating payment or approval as automatic ALLOW",
        ],
      },
    ],
  },
  {
    schema: ACADEMY_CATALOG_SCHEMA,
    id: "ROUTE_CREATION_AND_DESIGN",
    title: "TA-14 Route Creation and Design",
    shortTitle: "Route Creation",
    audience:
      "Builders, governance architects, compliance teams, AI product teams, and reviewers creating routes for the TA-14 Exchange Platform.",
    summary:
      "Teaches how to convert a proposed AI action into a structured, reviewable route with explicit evidence, authority, dependencies, gates, and expected outcomes.",
    governingPrinciple:
      "A route must make the path to consequence visible before execution occurs.",
    status: "IN_DEVELOPMENT",
    delivery: [
      "Route Builder exercises",
      "JSON route templates",
      "Worked examples",
      "Failure-pattern reviews",
      "Sandbox submissions",
    ],
    modules: [
      {
        id: "route-scope",
        title: "Define the Consequence-Bearing Action",
        summary:
          "Establish the exact action, system boundary, affected parties, and consequence before building the route.",
        sequence: 1,
        status: "IN_DEVELOPMENT",
        learningOutcomes: [
          "Write a precise route purpose",
          "Define the execution boundary",
          "Separate advisory output from consequence-bearing action",
        ],
      },
      {
        id: "route-inputs",
        title: "Declare Evidence and Authority Inputs",
        summary:
          "Identify what evidence is required, who or what supplies authority, and what must remain current.",
        sequence: 2,
        status: "IN_DEVELOPMENT",
        learningOutcomes: [
          "Declare required evidence",
          "Identify authority sources",
          "Define freshness and validity requirements",
        ],
      },
      {
        id: "route-gates",
        title: "Design Admissibility Gates",
        summary:
          "Create explicit requirements that determine whether the route may ALLOW, HOLD, DENY, or ESCALATE.",
        sequence: 3,
        status: "IN_DEVELOPMENT",
        learningOutcomes: [
          "Create testable requirements",
          "Avoid vague policy language",
          "Design fail-closed route behavior",
        ],
      },
      {
        id: "route-outcomes",
        title: "Bind Execution to Expected Outcomes",
        summary:
          "Define what execution is permitted, what must be recorded, and how outcome correspondence will be tested.",
        sequence: 4,
        status: "IN_DEVELOPMENT",
        learningOutcomes: [
          "Bind allowed execution to the route",
          "Define outcome evidence",
          "Prevent route drift after approval",
        ],
      },
    ],
  },
  {
    schema: ACADEMY_CATALOG_SCHEMA,
    id: "EVIDENCE_INTEGRITY_AND_PROVENANCE",
    title: "Evidence Integrity and Provenance",
    shortTitle: "Evidence Integrity",
    audience:
      "AI governance, audit, assurance, data, security, and risk professionals responsible for proving what information supported execution.",
    summary:
      "Teaches how evidence becomes usable for governance through provenance, integrity, temporal validity, source identification, and contradiction handling.",
    governingPrinciple:
      "Evidence that cannot be traced, tested, and preserved cannot support admissible execution.",
    status: "IN_DEVELOPMENT",
    delivery: [
      "Evidence mapping exercises",
      "Provenance reviews",
      "Integrity failure examples",
      "Contradiction analysis",
      "Receipt interpretation",
    ],
    modules: [
      {
        id: "evidence-source",
        title: "Source and Provenance",
        summary:
          "Who or what produced the evidence, how it entered the route, and whether its origin is independently reviewable.",
        sequence: 1,
        status: "IN_DEVELOPMENT",
        learningOutcomes: [
          "Identify evidence sources",
          "Document provenance",
          "Detect unsupported or synthetic claims",
        ],
      },
      {
        id: "evidence-integrity",
        title: "Integrity and Tamper Evidence",
        summary:
          "How hashing, signatures, immutable references, and preservation support later verification.",
        sequence: 2,
        status: "IN_DEVELOPMENT",
        learningOutcomes: [
          "Explain integrity controls",
          "Recognize broken evidence chains",
          "Understand what cryptographic proof does and does not prove",
        ],
      },
      {
        id: "evidence-temporal",
        title: "Temporal Validity and Reality Change",
        summary:
          "Why correct evidence can become inadmissible when reality changes before execution.",
        sequence: 3,
        status: "IN_DEVELOPMENT",
        learningOutcomes: [
          "Define evidence freshness",
          "Identify stale-route risk",
          "Require revalidation before consequence",
        ],
      },
    ],
  },
  {
    schema: ACADEMY_CATALOG_SCHEMA,
    id: "CONTINUITY_AND_BINDING",
    title: "Continuity, Identity, and Binding",
    shortTitle: "Continuity and Binding",
    audience:
      "Architects and reviewers responsible for keeping evidence, authority, route identity, and execution connected across time and systems.",
    summary:
      "Explains how continuity is preserved from initial reality through route identity, authority, commitment, execution, and outcome.",
    governingPrinciple:
      "A valid beginning does not legitimize an execution if continuity is lost before consequence occurs.",
    status: "PLANNED",
    delivery: [
      "Continuity diagrams",
      "Identity-binding exercises",
      "Commit-state examples",
      "Broken-chain case reviews",
    ],
    modules: [
      {
        id: "continuity-route-identity",
        title: "Route Identity",
        summary:
          "How a route is uniquely identified and protected from unnoticed substitution or mutation.",
        sequence: 1,
        status: "PLANNED",
        learningOutcomes: [
          "Define route identity",
          "Recognize route substitution",
          "Preserve version correspondence",
        ],
      },
      {
        id: "continuity-authority",
        title: "Authority Continuity",
        summary:
          "How delegated or derived authority remains connected to the route that uses it.",
        sequence: 2,
        status: "PLANNED",
        learningOutcomes: [
          "Trace authority origin",
          "Detect expired or misapplied authority",
          "Bind authority to scope",
        ],
      },
      {
        id: "continuity-commit",
        title: "Commit Before Execution",
        summary:
          "Why the approved route must be fixed before execution and why post-hoc reconstruction is insufficient.",
        sequence: 3,
        status: "PLANNED",
        learningOutcomes: [
          "Explain commit state",
          "Separate approval from commitment",
          "Detect execution against an uncommitted route",
        ],
      },
    ],
  },
  {
    schema: ACADEMY_CATALOG_SCHEMA,
    id: "RUNTIME_ADMISSIBILITY_GOVERNANCE",
    title: "Runtime Admissibility Governance",
    shortTitle: "Runtime Governance",
    audience:
      "AI runtime teams, platform engineers, governance architects, safety teams, and system owners deploying automated execution.",
    summary:
      "Teaches how admissibility is revalidated at runtime so a route that was once valid cannot continue acting after evidence, authority, or reality changes.",
    governingPrinciple:
      "Admissibility must remain valid through the moment of consequence.",
    status: "PLANNED",
    delivery: [
      "Runtime gate scenarios",
      "State-transition exercises",
      "Failure and recovery patterns",
      "Escalation design",
      "Adapter examples",
    ],
    modules: [
      {
        id: "runtime-revalidation",
        title: "Continuous Revalidation",
        summary:
          "Rechecking evidence, authority, continuity, and temporal validity before each consequence-bearing action.",
        sequence: 1,
        status: "PLANNED",
        learningOutcomes: [
          "Design runtime revalidation",
          "Identify invalidation events",
          "Stop execution when admissibility changes",
        ],
      },
      {
        id: "runtime-state",
        title: "Governed State Transitions",
        summary:
          "How route decisions control what the system may do next and what evidence must be produced.",
        sequence: 2,
        status: "PLANNED",
        learningOutcomes: [
          "Map decision states to system behavior",
          "Design HOLD and ESCALATE paths",
          "Prevent silent fallback execution",
        ],
      },
      {
        id: "runtime-adapters",
        title: "Execution Adapters and Boundaries",
        summary:
          "How governed routes connect to real systems without allowing the adapter to bypass route constraints.",
        sequence: 3,
        status: "PLANNED",
        learningOutcomes: [
          "Define adapter boundaries",
          "Bind execution parameters",
          "Verify execution correspondence",
        ],
      },
    ],
  },
  {
    schema: ACADEMY_CATALOG_SCHEMA,
    id: "REPLAY_RECEIPTS_AND_VERIFICATION",
    title: "Replay Packages, Receipts, and Independent Verification",
    shortTitle: "Verification",
    audience:
      "Auditors, reviewers, assurance teams, regulators, governance architects, and organizations testing whether an AI execution can be independently reconstructed.",
    summary:
      "Teaches how preserved route packages, receipts, signatures, dependencies, and outcome records support independent verification after execution.",
    governingPrinciple:
      "Verify the route, not the dashboard.",
    status: "PLANNED",
    delivery: [
      "Replay package walkthroughs",
      "Receipt validation exercises",
      "Signature verification examples",
      "Independent review scenarios",
      "Public record interpretation",
    ],
    modules: [
      {
        id: "verification-replay",
        title: "Replay Package Structure",
        summary:
          "The records required to reconstruct what route existed, what evidence supported it, and what decision was reached.",
        sequence: 1,
        status: "PLANNED",
        learningOutcomes: [
          "Identify replay package contents",
          "Test route completeness",
          "Recognize missing dependencies",
        ],
      },
      {
        id: "verification-receipts",
        title: "Receipts and Cryptographic Correspondence",
        summary:
          "How signed receipts connect route identity, decision, execution, and outcome without relying on operator claims.",
        sequence: 2,
        status: "PLANNED",
        learningOutcomes: [
          "Interpret signed receipts",
          "Verify correspondence fields",
          "Distinguish integrity proof from truth proof",
        ],
      },
      {
        id: "verification-independent",
        title: "Independent Verification",
        summary:
          "How an outside reviewer tests the preserved route without trusting the original platform dashboard.",
        sequence: 3,
        status: "PLANNED",
        learningOutcomes: [
          "Run an independent verification review",
          "Identify unverifiable claims",
          "Document verification outcomes",
        ],
      },
    ],
  },
] as const;

export function getAcademyProgram(
  programId: AcademyProgramId,
): AcademyProgram {
  const program = ACADEMY_PROGRAMS.find(
    (candidate) => candidate.id === programId,
  );

  if (!program) {
    throw new Error(`Unknown academy program: ${programId}`);
  }

  return program;
}

export function getAcademyProgramsByStatus(
  status: AcademyModuleStatus,
): readonly AcademyProgram[] {
  return ACADEMY_PROGRAMS.filter(
    (program) => program.status === status,
  );
}
