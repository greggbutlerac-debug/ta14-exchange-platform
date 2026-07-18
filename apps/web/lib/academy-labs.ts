export const ACADEMY_LAB_CLASSIFICATIONS = [
  "ALLOW",
  "HOLD",
  "DENY",
  "ESCALATE",
] as const;

export type AcademyLabClassification =
  (typeof ACADEMY_LAB_CLASSIFICATIONS)[number];

export const ACADEMY_LAB_DIFFICULTIES = [
  "Foundation",
  "Intermediate",
  "Advanced",
  "Capstone",
] as const;

export type AcademyLabDifficulty =
  (typeof ACADEMY_LAB_DIFFICULTIES)[number];

export type AcademyLabStage =
  | "Reality"
  | "Record"
  | "Continuity"
  | "Admissibility"
  | "Binding"
  | "Commit"
  | "Execution"
  | "Outcome";

export type AcademyLabRouteStage = {
  stage: AcademyLabStage;
  status: "PASS" | "FAIL" | "UNRESOLVED";
  evidence: string;
  question: string;
};

export type AcademyLabRepairOption = {
  id: string;
  label: string;
  description: string;
  correct: boolean;
  explanation: string;
};

export type AcademyLab = {
  id: string;
  number: string;
  title: string;
  classification: AcademyLabClassification;
  difficulty: AcademyLabDifficulty;
  summary: string;
  objective: string;
  focus: AcademyLabStage[];
  estimatedMinutes: number;
  scenario: string;
  governingQuestion: string;
  route: AcademyLabRouteStage[];
  repairOptions: AcademyLabRepairOption[];
  completionMessage: string;
};

export const ACADEMY_LABS: AcademyLab[] = [
  {
    id: "missing-evidence",
    number: "01",
    title: "Missing Evidence",
    classification: "HOLD",
    difficulty: "Foundation",
    summary:
      "A route reaches admissibility without enough evidence to support the proposed action.",
    objective:
      "Identify the missing record, restore evidentiary sufficiency, and determine whether execution can proceed.",
    focus: ["Reality", "Record", "Admissibility"],
    estimatedMinutes: 8,
    scenario:
      "An AI agent recommends suspending a customer account after detecting unusual activity. The system preserves a risk score and proposed action, but the source events used to produce the score are not attached to the route.",
    governingQuestion:
      "Can the proposed suspension become admissible when the decision record cannot show the underlying events?",
    route: [
      {
        stage: "Reality",
        status: "UNRESOLVED",
        evidence:
          "The route states that unusual activity occurred, but no source events are preserved.",
        question:
          "What observable facts establish that the triggering condition actually existed?",
      },
      {
        stage: "Record",
        status: "FAIL",
        evidence:
          "A risk score exists without the transaction records, timestamps, or event references used to produce it.",
        question:
          "Does the record preserve enough evidence for another reviewer to reconstruct the determination?",
      },
      {
        stage: "Continuity",
        status: "UNRESOLVED",
        evidence:
          "Continuity cannot be tested because the source evidence was never attached.",
        question:
          "Can integrity be established for evidence that the route does not contain?",
      },
      {
        stage: "Admissibility",
        status: "FAIL",
        evidence:
          "The route asks the system to rely on an unsupported conclusion.",
        question:
          "Is the evidence sufficient, relevant, current, and attributable to the proposed consequence?",
      },
      {
        stage: "Binding",
        status: "UNRESOLVED",
        evidence:
          "The proposed action cannot be bound to verified evidence.",
        question:
          "What exact evidence would the suspension authority bind to?",
      },
      {
        stage: "Commit",
        status: "UNRESOLVED",
        evidence:
          "No legitimate commitment can occur while admissibility remains unresolved.",
        question:
          "Can the system commit an action that has not crossed the admissibility gate?",
      },
      {
        stage: "Execution",
        status: "UNRESOLVED",
        evidence:
          "Execution must remain paused.",
        question:
          "What should the runtime do while the evidentiary defect remains open?",
      },
      {
        stage: "Outcome",
        status: "UNRESOLVED",
        evidence:
          "No consequence should be created until the route is repaired.",
        question:
          "What outcome preserves the customer and the integrity of the route?",
      },
    ],
    repairOptions: [
      {
        id: "approve-score",
        label: "Treat the risk score as sufficient evidence",
        description:
          "Allow the score to stand as the complete record because it was produced by an approved model.",
        correct: false,
        explanation:
          "Model approval does not replace the evidence required to support a consequence-bearing determination.",
      },
      {
        id: "attach-source-events",
        label: "Attach and bind the underlying source events",
        description:
          "Preserve the triggering events, timestamps, source identifiers, and scoring correspondence before re-evaluating admissibility.",
        correct: true,
        explanation:
          "This restores the missing record and allows continuity, admissibility, and binding to be tested.",
      },
      {
        id: "execute-and-review",
        label: "Suspend first and review afterward",
        description:
          "Create the consequence immediately, then investigate whether the evidence was adequate.",
        correct: false,
        explanation:
          "Post-consequence review cannot make an unsupported execution legitimate at the time it occurred.",
      },
    ],
    completionMessage:
      "The route remains on HOLD until the source events are preserved and bound to the proposed suspension.",
  },
  {
    id: "broken-continuity",
    number: "02",
    title: "Broken Continuity",
    classification: "DENY",
    difficulty: "Intermediate",
    summary:
      "Evidence exists, but the route cannot prove that the record remained intact across the decision chain.",
    objective:
      "Locate the continuity break, determine whether it can be repaired, and prevent unsupported execution.",
    focus: ["Record", "Continuity", "Binding"],
    estimatedMinutes: 10,
    scenario:
      "A claims-processing agent receives a damage assessment, supporting photographs, and an adjuster recommendation. One photograph was replaced after initial review, but the route contains no revision record or cryptographic linkage between versions.",
    governingQuestion:
      "Can the route rely on evidence whose identity and revision history cannot be established?",
    route: [
      {
        stage: "Reality",
        status: "PASS",
        evidence:
          "A property damage event and claim were independently recorded.",
        question:
          "Is the underlying event sufficiently established?",
      },
      {
        stage: "Record",
        status: "PASS",
        evidence:
          "The claim contains photographs, an assessment, and an adjuster recommendation.",
        question:
          "Does a decision record exist?",
      },
      {
        stage: "Continuity",
        status: "FAIL",
        evidence:
          "A photograph changed without a preserved version history, replacement reason, or integrity receipt.",
        question:
          "Can reviewers prove that the evidence used at commitment is the evidence originally collected?",
      },
      {
        stage: "Admissibility",
        status: "FAIL",
        evidence:
          "The altered evidence cannot be admitted as continuous with the original record.",
        question:
          "Can evidence with unresolved identity remain admissible?",
      },
      {
        stage: "Binding",
        status: "FAIL",
        evidence:
          "The proposed payment cannot be bound to a stable evidentiary package.",
        question:
          "Which version of the photograph supports the payment authority?",
      },
      {
        stage: "Commit",
        status: "UNRESOLVED",
        evidence:
          "Commitment must not proceed.",
        question:
          "What action is legitimate when the supporting record has lost continuity?",
      },
      {
        stage: "Execution",
        status: "UNRESOLVED",
        evidence:
          "Payment execution is blocked.",
        question:
          "Should the route hold, deny, or escalate?",
      },
      {
        stage: "Outcome",
        status: "UNRESOLVED",
        evidence:
          "No valid payment outcome can be produced from the current package.",
        question:
          "What outcome preserves reviewability?",
      },
    ],
    repairOptions: [
      {
        id: "accept-latest",
        label: "Use the latest photograph",
        description:
          "Assume the newest version is authoritative because it appears in the current claim file.",
        correct: false,
        explanation:
          "Recency does not prove identity, integrity, or legitimate replacement.",
      },
      {
        id: "reconstruct-history",
        label: "Reconstruct and verify the evidence history",
        description:
          "Recover both versions, preserve timestamps and source identity, record the replacement reason, and create continuity receipts.",
        correct: true,
        explanation:
          "The route can only be reconsidered after the evidence history is reconstructed and independently testable.",
      },
      {
        id: "ignore-photo",
        label: "Ignore all photographic evidence",
        description:
          "Remove the photographs and allow the recommendation alone to control.",
        correct: false,
        explanation:
          "Removing defective evidence does not automatically make the remaining record sufficient.",
      },
    ],
    completionMessage:
      "The current route is DENIED. A new route may be evaluated after continuity is reconstructed.",
  },
  {
    id: "invalid-authority",
    number: "03",
    title: "Invalid Authority",
    classification: "ESCALATE",
    difficulty: "Intermediate",
    summary:
      "The requested action appears valid, but the actor or system lacks sufficient authority to commit it.",
    objective:
      "Separate policy approval from execution legitimacy and route the action to the proper authority.",
    focus: ["Admissibility", "Binding", "Commit"],
    estimatedMinutes: 10,
    scenario:
      "A procurement agent identifies a valid supplier invoice and confirms that all documentation is complete. The payment exceeds the agent's delegated approval threshold.",
    governingQuestion:
      "Does a valid invoice make an unauthorized actor capable of committing payment?",
    route: [
      {
        stage: "Reality",
        status: "PASS",
        evidence:
          "The supplier delivered the documented goods.",
        question:
          "Is the underlying commercial event established?",
      },
      {
        stage: "Record",
        status: "PASS",
        evidence:
          "Invoice, delivery confirmation, and purchase order are preserved.",
        question:
          "Is the record complete enough for review?",
      },
      {
        stage: "Continuity",
        status: "PASS",
        evidence:
          "The evidence package is intact and attributable.",
        question:
          "Has the record remained continuous?",
      },
      {
        stage: "Admissibility",
        status: "PASS",
        evidence:
          "The invoice is supported and eligible for payment.",
        question:
          "Is the proposed payment substantively admissible?",
      },
      {
        stage: "Binding",
        status: "FAIL",
        evidence:
          "The agent's authority is limited to payments below the invoice amount.",
        question:
          "Can the admissible evidence be bound to this actor's authority?",
      },
      {
        stage: "Commit",
        status: "FAIL",
        evidence:
          "The agent cannot create a valid payment commitment.",
        question:
          "Who possesses authority to commit the consequence?",
      },
      {
        stage: "Execution",
        status: "UNRESOLVED",
        evidence:
          "Execution must wait for authorized commitment.",
        question:
          "What runtime lane preserves the valid evidence without exceeding authority?",
      },
      {
        stage: "Outcome",
        status: "UNRESOLVED",
        evidence:
          "Payment remains pending.",
        question:
          "How should the route preserve the pending legitimate claim?",
      },
    ],
    repairOptions: [
      {
        id: "split-payment",
        label: "Split the payment into smaller transactions",
        description:
          "Create multiple payments beneath the agent's individual authority limit.",
        correct: false,
        explanation:
          "Structuring transactions to evade an authority threshold does not create legitimate authority.",
      },
      {
        id: "escalate-authority",
        label: "Escalate the intact route to an authorized approver",
        description:
          "Preserve the evidence package and transfer commitment to an actor with sufficient delegated authority.",
        correct: true,
        explanation:
          "The evidence remains admissible, but commitment must occur under valid authority.",
      },
      {
        id: "temporary-override",
        label: "Grant the agent a temporary self-issued override",
        description:
          "Allow the agent to expand its own authority for this transaction.",
        correct: false,
        explanation:
          "An actor cannot legitimately manufacture the authority required to validate its own commitment.",
      },
    ],
    completionMessage:
      "The route is ESCALATED with its admissible evidence intact for commitment by an authorized approver.",
  },
  {
    id: "changed-reality",
    number: "04",
    title: "Reality Changed",
    classification: "HOLD",
    difficulty: "Advanced",
    summary:
      "A route was admissible when approved, but the governing reality changed before execution.",
    objective:
      "Revalidate the route at runtime and determine whether prior approval remains legitimate.",
    focus: ["Reality", "Admissibility", "Execution"],
    estimatedMinutes: 12,
    scenario:
      "An autonomous scheduling system approves a maintenance shutdown based on low operational demand. Before execution, an emergency workload enters the facility, but the approved route is still queued.",
    governingQuestion:
      "Can prior approval govern execution after the reality supporting that approval has materially changed?",
    route: [
      {
        stage: "Reality",
        status: "FAIL",
        evidence:
          "The low-demand condition no longer exists.",
        question:
          "Does the current reality still correspond to the approved route?",
      },
      {
        stage: "Record",
        status: "PASS",
        evidence:
          "The original approval record is complete.",
        question:
          "Was the prior determination properly recorded?",
      },
      {
        stage: "Continuity",
        status: "PASS",
        evidence:
          "The route has remained intact since approval.",
        question:
          "Has the route itself remained continuous?",
      },
      {
        stage: "Admissibility",
        status: "FAIL",
        evidence:
          "The original admissibility determination depends on a condition that is no longer true.",
        question:
          "Must admissibility be revalidated before execution?",
      },
      {
        stage: "Binding",
        status: "FAIL",
        evidence:
          "The approved action is bound to stale operating conditions.",
        question:
          "Does the existing binding still correspond to reality?",
      },
      {
        stage: "Commit",
        status: "UNRESOLVED",
        evidence:
          "The prior commitment cannot control without runtime revalidation.",
        question:
          "Can a stale commitment remain active?",
      },
      {
        stage: "Execution",
        status: "FAIL",
        evidence:
          "Executing the shutdown could interfere with emergency operations.",
        question:
          "What must happen immediately before consequence?",
      },
      {
        stage: "Outcome",
        status: "UNRESOLVED",
        evidence:
          "The intended maintenance outcome is no longer safely reachable.",
        question:
          "What outcome protects current operations?",
      },
    ],
    repairOptions: [
      {
        id: "honor-original",
        label: "Honor the original approval",
        description:
          "Proceed because the route was valid when it entered the execution queue.",
        correct: false,
        explanation:
          "Historical admissibility cannot substitute for runtime correspondence with current reality.",
      },
      {
        id: "runtime-revalidate",
        label: "Place the route on HOLD and revalidate current reality",
        description:
          "Suspend execution, preserve the changed condition, and submit the route for a new admissibility determination.",
        correct: true,
        explanation:
          "Continuous admissibility requires revalidation when material reality changes before consequence.",
      },
      {
        id: "execute-partially",
        label: "Perform a partial shutdown",
        description:
          "Modify execution without creating a new route or authority record.",
        correct: false,
        explanation:
          "Changing the action also changes the route and requires renewed evidence, binding, and commitment.",
      },
    ],
    completionMessage:
      "The route is placed on HOLD until current operational reality is recorded and re-evaluated.",
  },
  {
    id: "outcome-mismatch",
    number: "05",
    title: "Outcome Mismatch",
    classification: "DENY",
    difficulty: "Advanced",
    summary:
      "The recorded outcome does not correspond to the committed action or preserved execution evidence.",
    objective:
      "Compare commit, execution, and outcome records and identify the point where correspondence failed.",
    focus: ["Commit", "Execution", "Outcome"],
    estimatedMinutes: 12,
    scenario:
      "A benefits system commits to issue a one-month payment. Execution records show a three-month payment was transmitted, while the outcome record incorrectly states that the committed amount was delivered.",
    governingQuestion:
      "Can the route claim success when execution and outcome do not correspond to the commitment?",
    route: [
      {
        stage: "Reality",
        status: "PASS",
        evidence:
          "The recipient qualified for one month of benefits.",
        question:
          "Was the qualifying condition established?",
      },
      {
        stage: "Record",
        status: "PASS",
        evidence:
          "Eligibility and payment calculations were preserved.",
        question:
          "Is the determination reviewable?",
      },
      {
        stage: "Continuity",
        status: "PASS",
        evidence:
          "The evidence package remained intact.",
        question:
          "Did the record retain continuity?",
      },
      {
        stage: "Admissibility",
        status: "PASS",
        evidence:
          "A one-month payment was admissible.",
        question:
          "What consequence did the evidence support?",
      },
      {
        stage: "Binding",
        status: "PASS",
        evidence:
          "The recipient, amount, and authority were properly bound.",
        question:
          "Was the permitted consequence precisely identified?",
      },
      {
        stage: "Commit",
        status: "PASS",
        evidence:
          "The route committed a one-month payment.",
        question:
          "What exact action was authorized?",
      },
      {
        stage: "Execution",
        status: "FAIL",
        evidence:
          "The transmitted payment covered three months.",
        question:
          "Did execution correspond to the commitment?",
      },
      {
        stage: "Outcome",
        status: "FAIL",
        evidence:
          "The outcome record falsely reports successful correspondence.",
        question:
          "Can an inaccurate outcome record close the route?",
      },
    ],
    repairOptions: [
      {
        id: "edit-commit",
        label: "Edit the original commitment to match execution",
        description:
          "Change the preserved commitment from one month to three months.",
        correct: false,
        explanation:
          "Retrospective alteration would conceal the execution mismatch and destroy reviewability.",
      },
      {
        id: "record-mismatch",
        label: "Record the mismatch and open corrective execution",
        description:
          "Preserve the one-month commitment, the three-month execution, the failed correspondence, and a separately authorized recovery route.",
        correct: true,
        explanation:
          "The original route must remain a truthful record while correction occurs through a new governed route.",
      },
      {
        id: "close-success",
        label: "Close the route as successful",
        description:
          "Treat payment delivery as success because the recipient received funds.",
        correct: false,
        explanation:
          "An outcome is not legitimate merely because a consequence occurred; it must correspond to the committed action.",
      },
    ],
    completionMessage:
      "The route is DENIED as a successful completion and preserved as an execution-to-outcome mismatch.",
  },
  {
    id: "complete-route",
    number: "06",
    title: "Build a Complete Route",
    classification: "ALLOW",
    difficulty: "Capstone",
    summary:
      "Construct a complete consequence-bearing AI route from reality through independently reviewable outcome.",
    objective:
      "Create a route that remains admissible, bound, committed, executable, and replay-verifiable.",
    focus: [
      "Reality",
      "Record",
      "Continuity",
      "Admissibility",
      "Binding",
      "Commit",
      "Execution",
      "Outcome",
    ],
    estimatedMinutes: 20,
    scenario:
      "A customer requests a refund for a duplicated charge. Build a complete route that proves the duplicate transaction, preserves the evidence package, validates refund authority, commits the exact amount, verifies execution, and records the final outcome.",
    governingQuestion:
      "What must be preserved at every stage so an independent reviewer can verify the legitimacy of the refund?",
    route: [
      {
        stage: "Reality",
        status: "UNRESOLVED",
        evidence:
          "Define the observable duplicate-charge condition.",
        question:
          "What facts establish that the customer was charged twice?",
      },
      {
        stage: "Record",
        status: "UNRESOLVED",
        evidence:
          "Identify the transaction records and customer request.",
        question:
          "What evidence must the route preserve?",
      },
      {
        stage: "Continuity",
        status: "UNRESOLVED",
        evidence:
          "Define how evidence identity and integrity will be maintained.",
        question:
          "How will later reviewers know the evidence did not change?",
      },
      {
        stage: "Admissibility",
        status: "UNRESOLVED",
        evidence:
          "Define the rules that make the refund eligible.",
        question:
          "What conditions must be satisfied before refund authority can arise?",
      },
      {
        stage: "Binding",
        status: "UNRESOLVED",
        evidence:
          "Bind customer, transactions, amount, payment method, and authority.",
        question:
          "What exact entities and values must be bound together?",
      },
      {
        stage: "Commit",
        status: "UNRESOLVED",
        evidence:
          "Create an immutable refund commitment.",
        question:
          "What exact consequence is authorized?",
      },
      {
        stage: "Execution",
        status: "UNRESOLVED",
        evidence:
          "Capture the processor response and execution receipt.",
        question:
          "How will execution correspondence be proven?",
      },
      {
        stage: "Outcome",
        status: "UNRESOLVED",
        evidence:
          "Record whether the customer received the committed refund.",
        question:
          "What closes the route without relying on assertion alone?",
      },
    ],
    repairOptions: [
      {
        id: "complete-builder",
        label: "Construct the complete route in the Route Builder",
        description:
          "Transfer the scenario into the live builder and complete every stage with attributable evidence and correspondence.",
        correct: true,
        explanation:
          "The capstone is complete when the route can be evaluated and independently replayed from reality through outcome.",
      },
      {
        id: "policy-only",
        label: "Attach the refund policy",
        description:
          "Use the existence of a refund policy as the complete governance route.",
        correct: false,
        explanation:
          "Policy can constrain a route, but it does not prove reality, evidence continuity, authority, execution, or outcome.",
      },
      {
        id: "processor-trust",
        label: "Trust the payment processor",
        description:
          "Treat the processor's success response as proof that the entire route was legitimate.",
        correct: false,
        explanation:
          "A processor receipt only addresses part of execution and cannot establish the legitimacy of the preceding chain.",
      },
    ],
    completionMessage:
      "The route is eligible for ALLOW only after every stage is complete, continuous, and independently reviewable.",
  },
];

export function getAcademyLab(labId: string): AcademyLab | undefined {
  return ACADEMY_LABS.find((lab) => lab.id === labId);
}

export function isAcademyLabId(labId: string): boolean {
  return ACADEMY_LABS.some((lab) => lab.id === labId);
}

export function getAcademyLabIds(): string[] {
  return ACADEMY_LABS.map((lab) => lab.id);
}
