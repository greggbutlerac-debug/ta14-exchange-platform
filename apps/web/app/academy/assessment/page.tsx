"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type Domain = "Foundation" | "Architecture" | "Evidence" | "Continuity" | "Authority" | "Binding" | "Boundary" | "Commit" | "Execution" | "Outcome" | "Determination" | "Review" | "Assurance";
type Choice = {
  label: string;
  explanation: string;
};
type Question = {
  id: string;
  domain: Domain;
  prompt: string;
  choices: Choice[];
  answer: number;
  critical: boolean;
};
type Attempt = {
  id: string;
  completedAt: string;
  score: number;
  percentage: number;
  criticalMisses: number;
  determination: Determination;
  answers: Record<string, number>;
};
type PracticalArtifact = {
  id: string;
  label: string;
  status: "missing" | "draft" | "submitted" | "accepted";
  note: string;
};

const STORAGE_KEY = "ta14-academy-assessment-center-v3";
const PASS_SCORE = 85;

const questions: Question[] = [
  {
    id: "q01",
    domain: "Foundation",
    prompt: "What is the governing purpose of execution admissibility?",
    answer: 1,
    critical: true,
    choices: [
      {
        label: "To accelerate every automated action",
        explanation: "Speed is not the governing objective.",
      },
      {
        label: "To determine whether a specific action has earned the right to proceed now",
        explanation: "Correct. Admissibility is action-specific and time-specific.",
      },
      {
        label: "To replace all organizational policy",
        explanation: "The architecture does not erase policy.",
      },
      {
        label: "To approve every authenticated request",
        explanation: "Authentication alone does not establish admissibility.",
      },
    ],
  },
  {
    id: "q02",
    domain: "Architecture",
    prompt: "Which sequence represents the eight visible anchor links?",
    answer: 2,
    critical: true,
    choices: [
      {
        label: "Record → Reality → Outcome → Execution",
        explanation: "The order is incomplete and reversed.",
      },
      {
        label: "Identity → Access → Trust → Automation",
        explanation: "Those are useful controls, but not the TA-14 anchor chain.",
      },
      {
        label: "Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome",
        explanation: "Correct. These are the eight public orientation anchors.",
      },
      {
        label: "Policy → Model → Prompt → Response",
        explanation: "That sequence does not govern consequential execution.",
      },
    ],
  },
  {
    id: "q03",
    domain: "Evidence",
    prompt: "A record exists, but it is stale and cannot be traced to its source. What is proper?",
    answer: 1,
    critical: true,
    choices: [
      {
        label: "ALLOW because a record exists",
        explanation: "Existence alone does not make evidence admissible.",
      },
      {
        label: "HOLD until currency and provenance are restored",
        explanation: "Correct. The action must not proceed on stale or untraceable evidence.",
      },
      {
        label: "DENY permanently",
        explanation: "Permanent denial is not required when the defect may be cured.",
      },
      {
        label: "Ignore the record and continue",
        explanation: "Bypassing the evidence requirement breaks the chain.",
      },
    ],
  },
  {
    id: "q04",
    domain: "Continuity",
    prompt: "What does continuity preserve?",
    answer: 1,
    critical: false,
    choices: [
      {
        label: "Only the final output",
        explanation: "The final output alone cannot establish an unbroken chain.",
      },
      {
        label: "The relationship among reality, record, provenance, determination, and action",
        explanation: "Correct. Continuity keeps later challenge possible.",
      },
      {
        label: "Only the vendor confidence score",
        explanation: "A confidence score is not continuity.",
      },
      {
        label: "Only the user login session",
        explanation: "Session continuity is narrower than execution continuity.",
      },
    ],
  },
  {
    id: "q05",
    domain: "Authority",
    prompt: "An actor has valid credentials but lacks authority for the exact action. What should happen?",
    answer: 1,
    critical: true,
    choices: [
      {
        label: "ALLOW because identity is verified",
        explanation: "Verified identity does not establish action-specific authority.",
      },
      {
        label: "ESCALATE to the proper authority",
        explanation: "Correct. The execution requires an authorized decision.",
      },
      {
        label: "Commit automatically",
        explanation: "Commit cannot precede valid authority.",
      },
      {
        label: "Change the evidence",
        explanation: "Evidence cannot cure an authority defect by itself.",
      },
    ],
  },
  {
    id: "q06",
    domain: "Binding",
    prompt: "What is binding?",
    answer: 0,
    critical: false,
    choices: [
      {
        label: "The point where consequence becomes attached to a governed decision",
        explanation: "Correct. Binding is where the decision becomes consequential.",
      },
      {
        label: "The process of logging into the Exchange",
        explanation: "Authentication is not binding.",
      },
      {
        label: "A draft recommendation",
        explanation: "A draft has not yet bound consequence.",
      },
      {
        label: "Any model output",
        explanation: "A model output may remain nonbinding.",
      },
    ],
  },
  {
    id: "q07",
    domain: "Execution",
    prompt: "A dependency changes after approval but before execution. What must occur?",
    answer: 1,
    critical: true,
    choices: [
      {
        label: "Proceed because approval already happened",
        explanation: "Changed conditions can invalidate the prior determination.",
      },
      {
        label: "Revalidate admissibility before execution",
        explanation: "Correct. Authority and evidence must survive changed conditions.",
      },
      {
        label: "Delete the dependency record",
        explanation: "Deleting evidence destroys continuity.",
      },
      {
        label: "Convert the action to a recommendation",
        explanation: "That does not resolve the changed dependency.",
      },
    ],
  },
  {
    id: "q08",
    domain: "Outcome",
    prompt: "Why must outcome evidence be preserved?",
    answer: 0,
    critical: false,
    choices: [
      {
        label: "To prove the action occurred as governed and support later verification",
        explanation: "Correct. Outcome evidence closes the chain.",
      },
      {
        label: "To improve visual design",
        explanation: "Presentation is not the governing purpose.",
      },
      {
        label: "To avoid all human review",
        explanation: "Preservation supports review; it does not eliminate it.",
      },
      {
        label: "To guarantee the model was correct",
        explanation: "Outcome evidence records what happened; it does not guarantee correctness.",
      },
    ],
  },
  {
    id: "q09",
    domain: "Boundary",
    prompt: "A proposed action extends beyond the approved operational scope. What is required?",
    answer: 2,
    critical: true,
    choices: [
      {
        label: "ALLOW if the model is confident",
        explanation: "Confidence cannot expand the boundary.",
      },
      {
        label: "Silently widen the scope",
        explanation: "Silent scope expansion defeats governance.",
      },
      {
        label: "HOLD and obtain an explicit boundary decision",
        explanation: "Correct. The action must remain bounded or be newly authorized.",
      },
      {
        label: "Delete the original boundary",
        explanation: "The original boundary must remain preserved.",
      },
    ],
  },
  {
    id: "q10",
    domain: "Evidence",
    prompt: "Two authoritative records conflict. What is the correct response?",
    answer: 3,
    critical: true,
    choices: [
      {
        label: "Choose the record that supports execution",
        explanation: "Favorable selection is not admissibility.",
      },
      {
        label: "Average the two records",
        explanation: "Averaging does not resolve provenance or authority.",
      },
      {
        label: "Proceed with a warning",
        explanation: "Known evidence conflict is a material defect.",
      },
      {
        label: "HOLD, preserve the conflict, and resolve it through an attributable process",
        explanation: "Correct. The disagreement remains visible until resolved.",
      },
    ],
  },
  {
    id: "q11",
    domain: "Commit",
    prompt: "What is the purpose of commit?",
    answer: 1,
    critical: false,
    choices: [
      {
        label: "To create a draft idea",
        explanation: "Drafting occurs before commit.",
      },
      {
        label: "To preserve the exact approved state before execution",
        explanation: "Correct. Commit fixes the governed state that execution must correspond to.",
      },
      {
        label: "To erase previous versions",
        explanation: "Version history must remain preserved.",
      },
      {
        label: "To skip revalidation",
        explanation: "Commit does not eliminate revalidation duties.",
      },
    ],
  },
  {
    id: "q12",
    domain: "Determination",
    prompt: "Which statement best distinguishes HOLD from DENY?",
    answer: 0,
    critical: false,
    choices: [
      {
        label: "HOLD identifies a curable unresolved condition; DENY identifies a condition that makes the action impermissible",
        explanation: "Correct. The determinations carry different meanings.",
      },
      {
        label: "They are identical",
        explanation: "They are not interchangeable.",
      },
      {
        label: "HOLD is always weaker evidence",
        explanation: "HOLD is a determination, not an evidence grade.",
      },
      {
        label: "DENY means the system crashed",
        explanation: "A denial is a governed decision, not a technical failure.",
      },
    ],
  },
  {
    id: "q13",
    domain: "Review",
    prompt: "A reviewer discovers a material omission after a route was approved but before execution. What now?",
    answer: 2,
    critical: true,
    choices: [
      {
        label: "Ignore it because approval is final",
        explanation: "Approval cannot immunize a route from material new facts.",
      },
      {
        label: "Execute and document later",
        explanation: "Post-hoc documentation does not restore pre-action admissibility.",
      },
      {
        label: "HOLD and reopen the affected links",
        explanation: "Correct. The chain must be re-examined before consequence.",
      },
      {
        label: "Delete the reviewer note",
        explanation: "Destroying the finding breaks accountability.",
      },
    ],
  },
  {
    id: "q14",
    domain: "Assurance",
    prompt: "What does a competency credential prove?",
    answer: 3,
    critical: false,
    choices: [
      {
        label: "That the learner attended every session",
        explanation: "Attendance is not competency.",
      },
      {
        label: "That the learner completed a course",
        explanation: "Completion is not sufficient by itself.",
      },
      {
        label: "That the learner can perform every possible governance task",
        explanation: "Credentials must remain scope-bounded.",
      },
      {
        label: "That preserved evidence supports demonstrated capability within a defined scope",
        explanation: "Correct. Competency must be evidenced and bounded.",
      },
    ],
  },
  {
    id: "q15",
    domain: "Authority",
    prompt: "Authority was valid six months ago, but regulations changed yesterday. What is required?",
    answer: 1,
    critical: true,
    choices: [
      {
        label: "Use the original authority without review",
        explanation: "Authority may have drifted.",
      },
      {
        label: "Revalidate authority under current conditions",
        explanation: "Correct. Authority must still be valid now.",
      },
      {
        label: "Treat the regulation as optional",
        explanation: "Applicable regulation cannot be ignored.",
      },
      {
        label: "Replace the authority record with a summary",
        explanation: "A summary cannot substitute for current authority.",
      },
    ],
  },
  {
    id: "q16",
    domain: "Execution",
    prompt: "What must execution correspond to?",
    answer: 2,
    critical: true,
    choices: [
      {
        label: "The latest model output",
        explanation: "A later output may differ from the governed decision.",
      },
      {
        label: "The fastest available path",
        explanation: "Speed does not define correspondence.",
      },
      {
        label: "The preserved committed state and current admissibility conditions",
        explanation: "Correct. Execution must match what was authorized and remain admissible.",
      },
      {
        label: "Any user preference",
        explanation: "Preference cannot replace governed conditions.",
      },
    ],
  },
  {
    id: "q17",
    domain: "Outcome",
    prompt: "The action executed, but outcome telemetry is missing. What is the status?",
    answer: 1,
    critical: false,
    choices: [
      {
        label: "Fully verified",
        explanation: "Verification cannot be complete without outcome evidence.",
      },
      {
        label: "Outcome verification remains unresolved",
        explanation: "Correct. The chain cannot be closed without preserved outcome evidence.",
      },
      {
        label: "Automatically denied",
        explanation: "The missing telemetry creates an unresolved verification condition, not necessarily retroactive denial.",
      },
      {
        label: "The record should be deleted",
        explanation: "The execution record must remain preserved.",
      },
    ],
  },
  {
    id: "q18",
    domain: "Architecture",
    prompt: "Why are the eight visible anchors distinguished from the complete 24-link runtime chain?",
    answer: 0,
    critical: false,
    choices: [
      {
        label: "The anchors orient the public while the runtime chain preserves the complete governing architecture",
        explanation: "Correct. Orientation must not be confused with completeness.",
      },
      {
        label: "The other links are optional",
        explanation: "The complete runtime links are not optional when applicable.",
      },
      {
        label: "The anchors replace detailed governance",
        explanation: "They provide orientation, not replacement.",
      },
      {
        label: "The distinction is only visual branding",
        explanation: "The distinction protects architectural accuracy.",
      },
    ],
  },
  {
    id: "q19",
    domain: "Boundary",
    prompt: "A user answers “I do not know” to a material question. What should the Academy do?",
    answer: 3,
    critical: true,
    choices: [
      {
        label: "Invent a likely answer",
        explanation: "The Academy may never fabricate evidence.",
      },
      {
        label: "Select the safest-looking answer silently",
        explanation: "Silent answer selection destroys attribution.",
      },
      {
        label: "Skip the question permanently",
        explanation: "A material gap cannot simply disappear.",
      },
      {
        label: "Preserve the uncertainty and prevent unsupported progression",
        explanation: "Correct. Unknown remains unresolved until properly addressed.",
      },
    ],
  },
  {
    id: "q20",
    domain: "Assurance",
    prompt: "Which condition is required for an assessment to support credential eligibility?",
    answer: 2,
    critical: true,
    choices: [
      {
        label: "A high confidence self-rating",
        explanation: "Self-confidence is not competency evidence.",
      },
      {
        label: "Course attendance alone",
        explanation: "Attendance is not sufficient.",
      },
      {
        label: "Passing performance with no critical governance failures and preserved evidence",
        explanation: "Correct. Both performance and critical safeguards matter.",
      },
      {
        label: "Instructor preference",
        explanation: "Credential eligibility cannot rest on preference.",
      },
    ],
  },
];

const rubricRows = [
  {
    title: "Evidence discipline",
    description: "Identifies source, currency, provenance, sufficiency, conflict, and preservation requirements.",
    weight: 25,
  },
  {
    title: "Authority discipline",
    description: "Distinguishes identity, access, role, delegation, jurisdiction, and action-specific authority.",
    weight: 20,
  },
  {
    title: "Continuity discipline",
    description: "Preserves the unbroken relationship from reality through outcome and detects drift.",
    weight: 15,
  },
  {
    title: "Boundary discipline",
    description: "Maintains scope, actors, purpose, consequence, dependencies, and explicit exclusions.",
    weight: 15,
  },
  {
    title: "Determination quality",
    description: "Selects ALLOW, HOLD, DENY, or ESCALATE without hiding uncertainty.",
    weight: 15,
  },
  {
    title: "Challengeability",
    description: "Creates an attributable record that can be reviewed, corrected, appealed, and verified.",
    weight: 10,
  },
];

const assessmentPrinciples = [
  {
    number: "01",
    title: "Assessment is not attendance",
    description: "Presence in a course does not establish capability.",
  },
  {
    number: "02",
    title: "Completion is not competency",
    description: "Finishing content is not proof that the learner can govern consequential execution.",
  },
  {
    number: "03",
    title: "Evidence precedes eligibility",
    description: "Credential eligibility must arise from preserved performance evidence.",
  },
  {
    number: "04",
    title: "Critical failures matter",
    description: "A high average cannot erase a critical failure in evidence, authority, boundary, or execution.",
  },
  {
    number: "05",
    title: "Scope must remain bounded",
    description: "A credential applies only to the demonstrated scope.",
  },
  {
    number: "06",
    title: "Uncertainty stays visible",
    description: "The learner may preserve “I do not know”; the system may not silently convert it into certainty.",
  },
  {
    number: "07",
    title: "Assessor authority is explicit",
    description: "Only authorized assessors may bind a formal determination.",
  },
  {
    number: "08",
    title: "Rubrics are inspectable",
    description: "Learners must know what capability is being evaluated.",
  },
  {
    number: "09",
    title: "Versions remain preserved",
    description: "Question sets, submissions, rubrics, findings, and determinations retain history.",
  },
  {
    number: "10",
    title: "Appeal is part of governance",
    description: "A challenge must be attributable, reviewable, and connected to the original record.",
  },
  {
    number: "11",
    title: "Simulation informs assessment",
    description: "Practice activity may support readiness but does not automatically become credential evidence.",
  },
  {
    number: "12",
    title: "Identity does not equal authority",
    description: "Authenticated learners and assessors still require valid scope-specific authority.",
  },
  {
    number: "13",
    title: "Currency is required",
    description: "Expired evidence and stale authority cannot support a current determination.",
  },
  {
    number: "14",
    title: "Continuity must survive handoff",
    description: "Evidence must remain connected as work moves among learner, assessor, reviewer, and registry.",
  },
  {
    number: "15",
    title: "No favorable substitution",
    description: "The system may not replace a weak artifact with a stronger-looking but unrelated artifact.",
  },
  {
    number: "16",
    title: "Determinations are explicit",
    description: "ALLOW, HOLD, DENY, and ESCALATE must never be inferred from visual styling alone.",
  },
  {
    number: "17",
    title: "Outcome evidence closes the loop",
    description: "The assessment record must preserve what was submitted, evaluated, corrected, and decided.",
  },
  {
    number: "18",
    title: "Human review remains accountable",
    description: "Human involvement does not remove the need for evidence and authority.",
  },
  {
    number: "19",
    title: "Automation remains bounded",
    description: "Automated scoring may assist but cannot fabricate findings or assessor authority.",
  },
  {
    number: "20",
    title: "Remediation is governed",
    description: "Corrective learning must address the specific failed capability.",
  },
  {
    number: "21",
    title: "Credential events are separate",
    description: "The Academy prepares authorized events for the Registry; it does not duplicate the Registry.",
  },
  {
    number: "22",
    title: "Privacy is preserved",
    description: "Assessment evidence must be minimized, protected, and handled within lawful boundaries.",
  },
  {
    number: "23",
    title: "Accessibility is a competency condition",
    description: "A valid assessment must provide an equitable way to demonstrate the intended capability.",
  },
  {
    number: "24",
    title: "No admissible evidence, no admissible credential",
    description: "The governing principle applies to learning outcomes as it does to execution.",
  },
];

const practicalSteps = [
  {
    number: "01",
    title: "Purpose boundary",
    description: "State the exact consequential action under assessment.",
  },
  {
    number: "02",
    title: "Actors",
    description: "Identify the learner, operator, reviewer, assessor, authority holder, and affected parties.",
  },
  {
    number: "03",
    title: "Consequence",
    description: "Describe what can bind to reality if the proposed action proceeds.",
  },
  {
    number: "04",
    title: "Reality state",
    description: "Record the current conditions that matter to the decision.",
  },
  {
    number: "05",
    title: "Source records",
    description: "Identify the records that represent those conditions.",
  },
  {
    number: "06",
    title: "Evidence test",
    description: "Evaluate provenance, currency, relevance, integrity, sufficiency, and conflicts.",
  },
  {
    number: "07",
    title: "Authority test",
    description: "Verify current action-specific authority and all required delegations.",
  },
  {
    number: "08",
    title: "Continuity test",
    description: "Check whether the chain remains unbroken across records, versions, dependencies, and handoffs.",
  },
  {
    number: "09",
    title: "Admissibility",
    description: "Determine whether the evidence and authority can support this action now.",
  },
  {
    number: "10",
    title: "Binding point",
    description: "Identify the exact point where consequence would attach.",
  },
  {
    number: "11",
    title: "Commit state",
    description: "Preserve the approved version, conditions, and constraints.",
  },
  {
    number: "12",
    title: "Execution correspondence",
    description: "Verify that the proposed execution still matches the committed state.",
  },
  {
    number: "13",
    title: "Determination",
    description: "Select ALLOW, HOLD, DENY, or ESCALATE and explain why.",
  },
  {
    number: "14",
    title: "Outcome plan",
    description: "Define the evidence required to verify what actually happened.",
  },
];


const initialArtifacts: PracticalArtifact[] = [
  {
    id: "boundary",
    label: "Bounded action statement",
    status: "missing",
    note: "Define the exact action, actors, scope, exclusions, and consequence.",
  },
  {
    id: "evidence",
    label: "Evidence package",
    status: "missing",
    note: "Provide attributable records with currency, provenance, integrity, and conflict treatment.",
  },
  {
    id: "authority",
    label: "Authority package",
    status: "missing",
    note: "Show current action-specific authority, delegation, jurisdiction, and constraints.",
  },
  {
    id: "continuity",
    label: "Continuity map",
    status: "missing",
    note: "Preserve the relationship among reality, record, decision, commit, execution, and outcome.",
  },
  {
    id: "determination",
    label: "Determination record",
    status: "missing",
    note: "State ALLOW, HOLD, DENY, or ESCALATE with reasons and unresolved conditions.",
  },
  {
    id: "outcome",
    label: "Outcome verification plan",
    status: "missing",
    note: "Define the evidence required to prove what actually happened after execution.",
  },
];

const anchors = [
  ["01", "Reality", "Current conditions before interpretation."],
  ["02", "Record", "Attributable representation of reality."],
  ["03", "Continuity", "Unbroken relationship across the chain."],
  ["04", "Admissibility", "Fitness to support this action now."],
  ["05", "Binding", "The point where consequence attaches."],
  ["06", "Commit", "Preserved approved state before execution."],
  ["07", "Execution", "Controlled correspondence to the commit."],
  ["08", "Outcome", "Preserved evidence of what occurred."],
] as const;

const centerLinks = [
  ["Mission Control", "/academy/mission-control", "Resume work and inspect readiness."],
  ["Learning Pathways", "/academy/pathways", "Return to the competency sequence."],
  ["Architecture Explorer", "/academy/architecture-explorer", "Inspect anchors and runtime links."],
  ["Simulation Center", "/academy/simulator", "Practice before formal assessment."],
  ["Review Workspace", "/academy/review", "Challenge findings and preserve corrections."],
  ["Credential Dashboard", "/academy/credential-dashboard", "Inspect scope-bounded eligibility."],
  ["Credential Registry", "/academy/credential-registry", "Connect authorized credential events."],
  ["Return to Exchange", "/", "Leave the Academy without losing local work."],
] as const;

function determinationClass(value: Determination) {
  return `determination determination-${value.toLowerCase()}`;
}

function AssessmentCenterPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [artifacts, setArtifacts] = useState<PracticalArtifact[]>(initialArtifacts);
  const [scenarioNotes, setScenarioNotes] = useState("");
  const [assessorNotes, setAssessorNotes] = useState("");
  const [appealText, setAppealText] = useState("");
  const [activeTab, setActiveTab] = useState<"knowledge" | "practical" | "rubric" | "history">("knowledge");
  const [domainFilter, setDomainFilter] = useState<Domain | "All">("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        answers?: Record<string, number>;
        attempts?: Attempt[];
        artifacts?: PracticalArtifact[];
        scenarioNotes?: string;
        assessorNotes?: string;
        appealText?: string;
      };
      if (parsed.answers) setAnswers(parsed.answers);
      if (parsed.attempts) setAttempts(parsed.attempts);
      if (parsed.artifacts) setArtifacts(parsed.artifacts);
      if (parsed.scenarioNotes) setScenarioNotes(parsed.scenarioNotes);
      if (parsed.assessorNotes) setAssessorNotes(parsed.assessorNotes);
      if (parsed.appealText) setAppealText(parsed.appealText);
    } catch {
      // Local preservation is helpful but never treated as authoritative evidence.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          answers,
          attempts,
          artifacts,
          scenarioNotes,
          assessorNotes,
          appealText,
        }),
      );
    } catch {
      // The interface remains usable if storage is unavailable.
    }
  }, [answers, attempts, artifacts, scenarioNotes, assessorNotes, appealText]);

  const filteredQuestions = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return questions.filter((question) => {
      const domainMatch = domainFilter === "All" || question.domain === domainFilter;
      const textMatch = !needle || `${question.prompt} ${question.domain}`.toLowerCase().includes(needle);
      return domainMatch && textMatch;
    });
  }, [domainFilter, search]);

  const result = useMemo(() => {
    let correct = 0;
    let criticalMisses = 0;
    const domainScores: Record<string, { correct: number; total: number }> = {};

    for (const question of questions) {
      if (!domainScores[question.domain]) {
        domainScores[question.domain] = { correct: 0, total: 0 };
      }
      domainScores[question.domain].total += 1;
      const isCorrect = answers[question.id] === question.answer;
      if (isCorrect) {
        correct += 1;
        domainScores[question.domain].correct += 1;
      } else if (question.critical) {
        criticalMisses += 1;
      }
    }

    const percentage = Math.round((correct / questions.length) * 100);
    const answered = Object.keys(answers).length;
    const complete = answered === questions.length;
    const practicalAccepted = artifacts.filter((artifact) => artifact.status === "accepted").length;

    let determination: Determination = "HOLD";
    if (complete && percentage >= PASS_SCORE && criticalMisses === 0 && practicalAccepted === artifacts.length) {
      determination = "ALLOW";
    } else if (complete && criticalMisses >= 3) {
      determination = "DENY";
    } else if (complete && percentage >= 70 && criticalMisses <= 1) {
      determination = "ESCALATE";
    }

    return {
      correct,
      answered,
      percentage,
      criticalMisses,
      complete,
      practicalAccepted,
      determination,
      domainScores,
    };
  }, [answers, artifacts]);

  const currentQuestion = filteredQuestions[Math.min(activeQuestion, Math.max(filteredQuestions.length - 1, 0))];
  const practicalProgress = Math.round((artifacts.filter((artifact) => artifact.status !== "missing").length / artifacts.length) * 100);

  function setAnswer(questionId: string, choiceIndex: number) {
    if (submitted) return;
    setAnswers((current) => ({ ...current, [questionId]: choiceIndex }));
  }

  function updateArtifact(id: string, status: PracticalArtifact["status"]) {
    setArtifacts((current) => current.map((artifact) => artifact.id === id ? { ...artifact, status } : artifact));
  }

  function submitAssessment() {
    if (!result.complete) return;
    const attempt: Attempt = {
      id: `attempt-${Date.now()}`,
      completedAt: new Date().toISOString(),
      score: result.correct,
      percentage: result.percentage,
      criticalMisses: result.criticalMisses,
      determination: result.determination,
      answers,
    };
    setAttempts((current) => [attempt, ...current].slice(0, 12));
    setSubmitted(true);
  }

  function resetAssessment() {
    setAnswers({});
    setSubmitted(false);
    setActiveQuestion(0);
  }

  function exportPackage() {
    const payload = {
      exportedAt: new Date().toISOString(),
      notice: "Local learner package. Not a credential or authoritative Registry event.",
      result,
      answers,
      artifacts,
      scenarioNotes,
      assessorNotes,
      appealText,
      attempts,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ta14-academy-assessment-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="assessmentPage">
      <section className="hero">
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />
        <div className="eyebrow">TA-14 Academy · Competency Evaluation Environment</div>
        <div className="heroGrid">
          <div>
            <div className="doorMark">07 / AC</div>
            <h1>Assessment Center</h1>
            <p className="heroLead">
              Demonstrate governed capability through preserved knowledge, practical artifacts,
              critical safeguards, and scope-bounded assessor review.
            </p>
            <div className="principleBanner">
              <span>Governing principle</span>
              <strong>No admissible evidence. No admissible execution.</strong>
            </div>
            <div className="heroActions">
              <button onClick={() => setActiveTab("knowledge")} className="primaryButton">Begin assessment</button>
              <button onClick={() => setActiveTab("practical")} className="secondaryButton">Open practical evidence</button>
              <button onClick={exportPackage} className="ghostButton">Export local package</button>
            </div>
          </div>
          <aside className="statusCard">
            <div className="statusTop">
              <span>Current readiness</span>
              <span className={determinationClass(result.determination)}>{result.determination}</span>
            </div>
            <div className="scoreRing" style={{ "--score": `${result.percentage}%` } as CSSProperties}>
              <div>
                <strong>{result.percentage}%</strong>
                <span>knowledge score</span>
              </div>
            </div>
            <div className="statusMetrics">
              <div><strong>{result.answered}/{questions.length}</strong><span>answered</span></div>
              <div><strong>{result.criticalMisses}</strong><span>critical misses</span></div>
              <div><strong>{result.practicalAccepted}/{artifacts.length}</strong><span>accepted artifacts</span></div>
            </div>
            <p>
              A passing percentage does not override a critical failure or missing practical evidence.
            </p>
          </aside>
        </div>
      </section>

      <section className="dashboardBand">
        <div className="metricCard"><span>Knowledge threshold</span><strong>{PASS_SCORE}%</strong><small>with zero critical misses</small></div>
        <div className="metricCard"><span>Practical evidence</span><strong>{practicalProgress}%</strong><small>drafted or submitted</small></div>
        <div className="metricCard"><span>Assessment domains</span><strong>13</strong><small>architecture through assurance</small></div>
        <div className="metricCard"><span>Credential effect</span><strong>None yet</strong><small>Registry event remains separate</small></div>
      </section>

      <nav className="tabBar" aria-label="Assessment center sections">
        <button className={activeTab === "knowledge" ? "active" : ""} onClick={() => setActiveTab("knowledge")}>Knowledge validation</button>
        <button className={activeTab === "practical" ? "active" : ""} onClick={() => setActiveTab("practical")}>Practical evidence</button>
        <button className={activeTab === "rubric" ? "active" : ""} onClick={() => setActiveTab("rubric")}>Rubric and readiness</button>
        <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>Attempts and appeal</button>
      </nav>

      {activeTab === "knowledge" && (
        <section className="workspaceSection">
          <div className="sectionHeader">
            <div>
              <span className="sectionKicker">Knowledge validation</span>
              <h2>Architecture understanding under consequence</h2>
              <p>Every critical question protects a condition that cannot be averaged away.</p>
            </div>
            <div className="headerControls">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search questions" />
              <select value={domainFilter} onChange={(event) => setDomainFilter(event.target.value as Domain | "All")}>
                <option value="All">All domains</option>
                {Array.from(new Set(questions.map((question) => question.domain))).map((domain) => <option key={domain} value={domain}>{domain}</option>)}
              </select>
            </div>
          </div>

          <div className="assessmentLayout">
            <aside className="questionRail">
              {filteredQuestions.map((question, index) => {
                const answered = answers[question.id] !== undefined;
                const correct = submitted && answers[question.id] === question.answer;
                const wrong = submitted && answered && !correct;
                return (
                  <button key={question.id} className={`questionRailButton ${activeQuestion === index ? "active" : ""} ${answered ? "answered" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} onClick={() => setActiveQuestion(index)}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><strong>{question.domain}</strong><small>{question.critical ? "Critical safeguard" : answered ? "Answered" : "Open"}</small></div>
                  </button>
                );
              })}
            </aside>

            <div className="questionWorkspace">
              {currentQuestion ? (
                <>
                  <div className="questionMeta">
                    <span>{currentQuestion.domain}</span>
                    {currentQuestion.critical && <span className="criticalBadge">Critical safeguard</span>}
                  </div>
                  <h3>{currentQuestion.prompt}</h3>
                  <div className="choiceGrid">
                    {currentQuestion.choices.map((choice, choiceIndex) => {
                      const selected = answers[currentQuestion.id] === choiceIndex;
                      const correct = submitted && currentQuestion.answer === choiceIndex;
                      const wrong = submitted && selected && !correct;
                      return (
                        <button key={choice.label} disabled={submitted} className={`choiceCard ${selected ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} onClick={() => setAnswer(currentQuestion.id, choiceIndex)}>
                          <span className="choiceLetter">{String.fromCharCode(65 + choiceIndex)}</span>
                          <div><strong>{choice.label}</strong>{submitted && <p>{choice.explanation}</p>}</div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="questionNavigation">
                    <button disabled={activeQuestion === 0} onClick={() => setActiveQuestion((value) => Math.max(0, value - 1))}>Previous</button>
                    <span>{result.answered} of {questions.length} answered</span>
                    <button disabled={activeQuestion >= filteredQuestions.length - 1} onClick={() => setActiveQuestion((value) => Math.min(filteredQuestions.length - 1, value + 1))}>Next</button>
                  </div>
                </>
              ) : (
                <div className="emptyState">No questions match the current search and domain filter.</div>
              )}
            </div>

            <aside className="assessmentSummary">
              <h3>Submission gate</h3>
              <div className="summaryRow"><span>Answered</span><strong>{result.answered}/{questions.length}</strong></div>
              <div className="summaryRow"><span>Current score</span><strong>{result.percentage}%</strong></div>
              <div className="summaryRow"><span>Critical misses</span><strong>{result.criticalMisses}</strong></div>
              <div className="summaryRow"><span>Practical accepted</span><strong>{result.practicalAccepted}/{artifacts.length}</strong></div>
              <div className="summaryDetermination"><span>Current determination</span><strong className={determinationClass(result.determination)}>{result.determination}</strong></div>
              <button disabled={!result.complete || submitted} onClick={submitAssessment} className="primaryButton full">Submit knowledge assessment</button>
              <button onClick={resetAssessment} className="ghostButton full">Reset current answers</button>
              <p className="finePrint">Submission creates a local learner attempt only. It does not issue a credential or Registry event.</p>
            </aside>
          </div>

          {submitted && (
            <div className="resultsPanel">
              <div>
                <span className="sectionKicker">Preserved result</span>
                <h3>{result.determination === "ALLOW" ? "Knowledge and practical conditions satisfied" : "Further action is required"}</h3>
                <p>The determination reflects knowledge performance, critical misses, and accepted practical evidence.</p>
              </div>
              <div className={determinationClass(result.determination)}>{result.determination}</div>
            </div>
          )}
        </section>
      )}

      {activeTab === "practical" && (
        <section className="workspaceSection">
          <div className="sectionHeader">
            <div><span className="sectionKicker">Practical assessment</span><h2>Build the evidence that supports demonstrated capability</h2><p>Draft, submit, and preserve each artifact without inventing missing information.</p></div>
            <div className="progressBlock"><strong>{practicalProgress}%</strong><span>package progress</span></div>
          </div>

          <div className="practicalGrid">
            <div className="scenarioPanel">
              <div className="scenarioHeader"><span>Scenario A-24</span><strong>Consequential eligibility decision</strong></div>
              <p>An AI-supported system proposes to make an eligibility decision that will alter access to a material service. One source record is current, one is stale, the delegated authority is limited to recommendations, and the operating context changed after the initial review.</p>
              <div className="scenarioCallout"><strong>Your task</strong><p>Construct a bounded route, identify the earliest failure, preserve uncertainty, and issue a supported determination before consequence occurs.</p></div>
              <label className="textareaLabel">Learner analysis<textarea value={scenarioNotes} onChange={(event) => setScenarioNotes(event.target.value)} placeholder="Preserve purpose, actors, consequence, boundary, records, evidence, authority, continuity, admissibility, determination, and outcome plan..." /></label>
            </div>
            <div className="artifactPanel">
              {artifacts.map((artifact) => (
                <article key={artifact.id} className="artifactCard">
                  <div><span className={`artifactStatus artifact-${artifact.status}`}>{artifact.status}</span><h3>{artifact.label}</h3><p>{artifact.note}</p></div>
                  <select value={artifact.status} onChange={(event) => updateArtifact(artifact.id, event.target.value as PracticalArtifact["status"])}>
                    <option value="missing">Missing</option>
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="accepted">Accepted</option>
                  </select>
                </article>
              ))}
            </div>
          </div>

          <div className="stepSection">
            <div className="sectionHeader compact"><div><span className="sectionKicker">Guided construction</span><h2>Fourteen practical assessment moves</h2></div></div>
            <div className="stepGrid">
              {practicalSteps.map((step) => <article key={step.number} className="stepCard"><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}
            </div>
          </div>
        </section>
      )}

      {activeTab === "rubric" && (
        <section className="workspaceSection">
          <div className="sectionHeader"><div><span className="sectionKicker">Competency rubric</span><h2>Scoring that cannot hide a critical governance failure</h2><p>Weighted performance supports interpretation, while critical safeguards remain independent gates.</p></div></div>
          <div className="rubricGrid">
            {rubricRows.map((row) => <article key={row.title} className="rubricCard"><div className="rubricWeight">{row.weight}%</div><div><h3>{row.title}</h3><p>{row.description}</p></div></article>)}
          </div>
          <div className="readinessGrid">
            <article className="readinessCard"><span>Knowledge condition</span><h3>{result.percentage >= PASS_SCORE ? "Satisfied" : "Not satisfied"}</h3><p>Minimum {PASS_SCORE}% across all questions.</p></article>
            <article className="readinessCard"><span>Critical safeguard condition</span><h3>{result.criticalMisses === 0 ? "Satisfied" : "Not satisfied"}</h3><p>No critical evidence, authority, boundary, or execution failures.</p></article>
            <article className="readinessCard"><span>Practical evidence condition</span><h3>{result.practicalAccepted === artifacts.length ? "Satisfied" : "Not satisfied"}</h3><p>All required practical artifacts accepted by an authorized assessor.</p></article>
            <article className="readinessCard"><span>Credential condition</span><h3>Separate event</h3><p>Eligibility may support an authorized Registry event but never creates one automatically.</p></article>
          </div>
          <label className="textareaLabel assessorNotes">Assessor notes<textarea value={assessorNotes} onChange={(event) => setAssessorNotes(event.target.value)} placeholder="Preserve findings, scope, evidence reviewed, unresolved conditions, remediation, and authority..." /></label>
        </section>
      )}

      {activeTab === "history" && (
        <section className="workspaceSection">
          <div className="sectionHeader"><div><span className="sectionKicker">Attempt history and challenge</span><h2>Preserve performance without erasing prior states</h2><p>Each local attempt remains distinct. Appeals do not overwrite the original determination.</p></div></div>
          <div className="historyLayout">
            <div className="attemptList">
              {attempts.length === 0 ? <div className="emptyState">No submitted attempts have been preserved on this device.</div> : attempts.map((attempt) => (
                <article key={attempt.id} className="attemptCard">
                  <div><span>{new Date(attempt.completedAt).toLocaleString()}</span><h3>{attempt.score}/{questions.length} correct · {attempt.percentage}%</h3><p>{attempt.criticalMisses} critical misses</p></div>
                  <strong className={determinationClass(attempt.determination)}>{attempt.determination}</strong>
                </article>
              ))}
            </div>
            <div className="appealPanel"><span className="sectionKicker">Challenge record</span><h3>Preserve an appeal or correction request</h3><p>Describe the exact finding, evidence, authority, rubric interpretation, or procedural condition being challenged.</p><textarea value={appealText} onChange={(event) => setAppealText(event.target.value)} placeholder="State the challenged item, supporting evidence, requested correction, and unresolved conditions..." /><button className="secondaryButton" onClick={exportPackage}>Export appeal with local package</button><small>This interface preserves a local draft. It does not submit an institutional appeal automatically.</small></div>
          </div>
        </section>
      )}

      <section className="anchorSection">
        <div className="sectionHeader"><div><span className="sectionKicker">Architecture orientation</span><h2>Eight visible anchors, one complete governing movement</h2><p>The anchors orient assessment. They do not replace TA-14&apos;s verified complete 24-link runtime architecture.</p></div></div>
        <div className="anchorGrid">{anchors.map(([number, title, description]) => <article key={number} className="anchorCard"><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>

      <section className="principlesSection">
        <div className="sectionHeader"><div><span className="sectionKicker">Assessment constitution</span><h2>Twenty-four operating principles</h2><p>These constraints prevent assessment from becoming a cosmetic completion engine.</p></div></div>
        <div className="principlesGrid">{assessmentPrinciples.map((principle) => <article key={principle.number} className="principleCard"><span>{principle.number}</span><div><h3>{principle.title}</h3><p>{principle.description}</p></div></article>)}</div>
      </section>

      <section className="connectionsSection">
        <div className="sectionHeader"><div><span className="sectionKicker">Connected Academy systems</span><h2>Assessment remains part of a larger governed learning route</h2></div></div>
        <div className="connectionsGrid">{centerLinks.map(([label, href, description]) => <Link key={href} href={href} className="connectionCard"><span>{label}</span><p>{description}</p><strong>Open →</strong></Link>)}</div>
      </section>

      <footer className="academyFooter"><div><strong>TA-14 Academy Assessment Center</strong><span>Competency before credentials. Evidence before eligibility.</span></div><Link href="/academy">Return to Academy entrance →</Link></footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }
        .assessmentPage {
          min-height: 100vh;
          overflow: hidden;
          color: #e8f0fb;
          background: #030812;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .hero {
          position: relative;
          padding: 74px clamp(22px, 5vw, 76px) 56px;
          border-bottom: 1px solid rgba(130, 157, 192, .16);
          overflow: hidden;
        }
        .heroGlow {
          position: absolute;
          border-radius: 999px;
          filter: blur(90px);
          opacity: .24;
          pointer-events: none;
        }
        .heroGlowOne {
          width: 420px;
          height: 420px;
          background: #0d7da5;
          left: -110px;
          top: -150px;
        }
        .heroGlowTwo {
          width: 500px;
          height: 500px;
          background: #5630a9;
          right: -150px;
          top: 60px;
        }
        .eyebrow, .sectionKicker {
          color: #6ee7f5;
          text-transform: uppercase;
          letter-spacing: .21em;
          font-size: 12px;
          font-weight: 800;
        }
        .heroGrid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(310px, .75fr);
          gap: 48px;
          max-width: 1500px;
          margin: 0 auto;
          align-items: center;
        }
        .doorMark {
          margin-top: 26px;
          color: #8ea4c0;
          font-weight: 800;
          letter-spacing: .18em;
        }
        h1 {
          margin: 12px 0 0;
          max-width: 850px;
          color: #fff;
          font-size: clamp(48px, 6.4vw, 92px);
          line-height: .94;
          letter-spacing: -.06em;
        }
        .heroLead {
          max-width: 850px;
          margin: 26px 0 0;
          color: #b7c5d8;
          font-size: clamp(18px, 2vw, 24px);
          line-height: 1.55;
        }
        .principleBanner {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 24px;
          align-items: center;
          margin-top: 30px;
          padding: 18px 20px;
          border: 1px solid rgba(99, 221, 238, .25);
          border-radius: 16px;
          background: rgba(8, 22, 39, .72);
        }
        .principleBanner span {
          color: #8ea4c0;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .15em;
        }
        .principleBanner strong {
          color: #f8fbff;
          font-size: 17px;
        }
        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }
        button, select, input, textarea {
          font: inherit;
        }
        button {
          cursor: pointer;
        }
        button:disabled {
          cursor: not-allowed;
          opacity: .5;
        }
        .primaryButton, .secondaryButton, .ghostButton {
          border-radius: 12px;
          padding: 13px 17px;
          font-weight: 800;
          transition: .18s ease;
        }
        .primaryButton {
          border: 1px solid #79e8f5;
          color: #001019;
          background: linear-gradient(135deg, #82edf7, #5dc7ef);
        }
        .secondaryButton {
          border: 1px solid rgba(128, 215, 246, .42);
          color: #dffbff;
          background: rgba(17, 75, 105, .36);
        }
        .ghostButton {
          border: 1px solid rgba(143, 163, 190, .26);
          color: #d8e4f3;
          background: rgba(8, 17, 31, .58);
        }
        .primaryButton:hover, .secondaryButton:hover, .ghostButton:hover {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }
        .full {
          width: 100%;
          margin-top: 12px;
        }
        .statusCard {
          padding: 26px;
          border: 1px solid rgba(117, 143, 178, .23);
          border-radius: 24px;
          background: linear-gradient(180deg, rgba(14, 28, 49, .92), rgba(6, 14, 27, .94));
          box-shadow: 0 24px 70px rgba(0, 0, 0, .28);
        }
        .statusTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #aebdd0;
        }
        .determination {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 82px;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .1em;
        }
        .determination-allow {
          color: #baffd5;
          background: rgba(22, 128, 72, .22);
          border: 1px solid rgba(74, 222, 128, .36);
        }
        .determination-hold {
          color: #ffe9a8;
          background: rgba(161, 112, 12, .22);
          border: 1px solid rgba(250, 204, 21, .35);
        }
        .determination-deny {
          color: #ffc1c1;
          background: rgba(148, 35, 35, .24);
          border: 1px solid rgba(248, 113, 113, .38);
        }
        .determination-escalate {
          color: #dfc9ff;
          background: rgba(91, 47, 148, .28);
          border: 1px solid rgba(192, 132, 252, .38);
        }
        .scoreRing {
          --score: 0%;
          width: 184px;
          height: 184px;
          margin: 28px auto;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: conic-gradient(#65d8ef var(--score), rgba(101, 216, 239, .12) 0);
          position: relative;
        }
        .scoreRing::after {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          background: #07111f;
        }
        .scoreRing > div {
          position: relative;
          z-index: 1;
          text-align: center;
        }
        .scoreRing strong {
          display: block;
          color: white;
          font-size: 38px;
        }
        .scoreRing span {
          color: #8ea4c0;
          font-size: 12px;
        }
        .statusMetrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .statusMetrics div {
          padding: 12px 8px;
          border: 1px solid rgba(134, 159, 190, .16);
          border-radius: 12px;
          background: rgba(6, 13, 25, .6);
          text-align: center;
        }
        .statusMetrics strong {
          display: block;
          color: #fff;
          font-size: 18px;
        }
        .statusMetrics span {
          color: #8297b1;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        .statusCard > p {
          margin: 18px 0 0;
          color: #8ea4c0;
          line-height: 1.6;
          font-size: 13px;
        }
        .dashboardBand {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          max-width: 1500px;
          margin: -1px auto 0;
          padding: 28px clamp(22px, 5vw, 76px);
        }
        .metricCard {
          padding: 18px;
          border: 1px solid rgba(130, 157, 192, .16);
          border-radius: 16px;
          background: rgba(8, 17, 31, .72);
        }
        .metricCard span, .metricCard small {
          display: block;
          color: #8195af;
        }
        .metricCard span {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .12em;
        }
        .metricCard strong {
          display: block;
          margin: 9px 0 5px;
          color: #fff;
          font-size: 25px;
        }
        .metricCard small {
          line-height: 1.4;
        }
        .tabBar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          gap: 8px;
          max-width: 1500px;
          margin: 0 auto;
          padding: 12px clamp(22px, 5vw, 76px);
          border-top: 1px solid rgba(130, 157, 192, .12);
          border-bottom: 1px solid rgba(130, 157, 192, .16);
          background: rgba(3, 8, 18, .92);
          backdrop-filter: blur(20px);
          overflow-x: auto;
        }
        .tabBar button {
          white-space: nowrap;
          padding: 11px 15px;
          border: 1px solid transparent;
          border-radius: 10px;
          color: #91a4bc;
          background: transparent;
          font-weight: 750;
        }
        .tabBar button.active {
          color: #e8fdff;
          border-color: rgba(98, 218, 238, .28);
          background: rgba(24, 95, 119, .26);
        }
        .workspaceSection, .anchorSection, .principlesSection, .connectionsSection {
          max-width: 1500px;
          margin: 0 auto;
          padding: 64px clamp(22px, 5vw, 76px);
        }
        .sectionHeader {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: end;
          margin-bottom: 30px;
        }
        .sectionHeader.compact {
          margin-bottom: 20px;
        }
        .sectionHeader h2 {
          max-width: 900px;
          margin: 8px 0 0;
          color: #fff;
          font-size: clamp(30px, 4vw, 52px);
          letter-spacing: -.04em;
        }
        .sectionHeader p {
          max-width: 800px;
          margin: 12px 0 0;
          color: #93a7bf;
          line-height: 1.65;
        }
        .headerControls {
          display: flex;
          gap: 10px;
        }
        input, select, textarea {
          color: #e8f0fb;
          border: 1px solid rgba(127, 154, 188, .25);
          background: rgba(7, 15, 29, .88);
          outline: none;
        }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(91, 221, 239, .68);
          box-shadow: 0 0 0 3px rgba(50, 186, 209, .1);
        }
        input, select {
          min-height: 44px;
          padding: 0 13px;
          border-radius: 10px;
        }
        .assessmentLayout {
          display: grid;
          grid-template-columns: 230px minmax(0, 1fr) 270px;
          gap: 18px;
          align-items: start;
        }
        .questionRail, .assessmentSummary, .questionWorkspace {
          border: 1px solid rgba(130, 157, 192, .18);
          border-radius: 18px;
          background: rgba(7, 15, 28, .78);
        }
        .questionRail {
          max-height: 710px;
          padding: 10px;
          overflow: auto;
        }
        .questionRailButton {
          width: 100%;
          display: flex;
          gap: 11px;
          align-items: center;
          padding: 11px;
          border: 1px solid transparent;
          border-radius: 11px;
          color: #aebdd0;
          background: transparent;
          text-align: left;
        }
        .questionRailButton + .questionRailButton {
          margin-top: 5px;
        }
        .questionRailButton > span {
          display: grid;
          place-items: center;
          width: 33px;
          height: 33px;
          flex: 0 0 33px;
          border-radius: 9px;
          background: rgba(121, 150, 186, .12);
          font-size: 11px;
          font-weight: 900;
        }
        .questionRailButton strong, .questionRailButton small {
          display: block;
        }
        .questionRailButton strong {
          font-size: 13px;
        }
        .questionRailButton small {
          margin-top: 3px;
          color: #7087a4;
          font-size: 10px;
        }
        .questionRailButton.active {
          color: #eaffff;
          border-color: rgba(89, 221, 240, .34);
          background: rgba(22, 92, 115, .23);
        }
        .questionRailButton.answered > span {
          color: #b6f7ff;
        }
        .questionRailButton.correct > span {
          color: #a9ffc6;
          background: rgba(31, 129, 71, .23);
        }
        .questionRailButton.wrong > span {
          color: #ffc1c1;
          background: rgba(140, 40, 40, .23);
        }
        .questionWorkspace {
          min-height: 610px;
          padding: clamp(24px, 4vw, 46px);
        }
        .questionMeta {
          display: flex;
          gap: 10px;
          align-items: center;
          color: #6ee7f5;
          text-transform: uppercase;
          letter-spacing: .13em;
          font-size: 11px;
          font-weight: 900;
        }
        .criticalBadge {
          color: #ffd59a;
          padding: 5px 8px;
          border: 1px solid rgba(245, 184, 79, .28);
          border-radius: 999px;
          background: rgba(133, 88, 18, .18);
        }
        .questionWorkspace h3 {
          margin: 20px 0 26px;
          color: #fff;
          font-size: clamp(25px, 3vw, 38px);
          line-height: 1.24;
        }
        .choiceGrid {
          display: grid;
          gap: 12px;
        }
        .choiceCard {
          display: flex;
          gap: 14px;
          width: 100%;
          padding: 17px;
          border: 1px solid rgba(132, 158, 190, .19);
          border-radius: 14px;
          color: #d9e4f2;
          background: rgba(8, 18, 33, .76);
          text-align: left;
        }
        .choiceCard:hover {
          border-color: rgba(104, 213, 236, .42);
          background: rgba(11, 31, 49, .82);
        }
        .choiceCard.selected {
          border-color: rgba(103, 225, 241, .7);
          background: rgba(20, 85, 104, .24);
        }
        .choiceCard.correct {
          border-color: rgba(81, 222, 135, .55);
          background: rgba(24, 101, 57, .2);
        }
        .choiceCard.wrong {
          border-color: rgba(248, 113, 113, .52);
          background: rgba(111, 31, 31, .2);
        }
        .choiceLetter {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          border-radius: 9px;
          color: #99eaf3;
          background: rgba(48, 129, 150, .18);
          font-weight: 900;
        }
        .choiceCard strong {
          line-height: 1.5;
        }
        .choiceCard p {
          margin: 8px 0 0;
          color: #9eb0c6;
          line-height: 1.5;
          font-size: 13px;
        }
        .questionNavigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
        }
        .questionNavigation button {
          padding: 10px 14px;
          border: 1px solid rgba(131, 158, 190, .22);
          border-radius: 9px;
          color: #dce8f6;
          background: rgba(11, 23, 41, .8);
        }
        .questionNavigation span {
          color: #7f94ae;
          font-size: 12px;
        }
        .assessmentSummary {
          position: sticky;
          top: 84px;
          padding: 20px;
        }
        .assessmentSummary h3 {
          margin: 0 0 18px;
          color: white;
          font-size: 19px;
        }
        .summaryRow {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding: 11px 0;
          border-bottom: 1px solid rgba(130, 157, 192, .12);
          color: #8fa3bc;
        }
        .summaryRow strong {
          color: #edf5ff;
        }
        .summaryDetermination {
          margin: 18px 0;
        }
        .summaryDetermination span {
          display: block;
          margin-bottom: 8px;
          color: #8196b0;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .1em;
        }
        .finePrint {
          color: #7187a2;
          font-size: 11px;
          line-height: 1.55;
        }
        .resultsPanel {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          margin-top: 20px;
          padding: 22px;
          border: 1px solid rgba(123, 153, 189, .2);
          border-radius: 16px;
          background: rgba(9, 21, 38, .85);
        }
        .resultsPanel h3 {
          margin: 7px 0 6px;
          color: white;
        }
        .resultsPanel p {
          margin: 0;
          color: #8fa3bb;
        }
        .practicalGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(390px, .95fr);
          gap: 20px;
        }
        .scenarioPanel, .artifactPanel, .appealPanel {
          border: 1px solid rgba(130, 157, 192, .18);
          border-radius: 18px;
          background: rgba(7, 15, 28, .78);
        }
        .scenarioPanel {
          padding: 28px;
        }
        .scenarioHeader {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .scenarioHeader span {
          color: #67dce9;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .14em;
        }
        .scenarioHeader strong {
          color: white;
          font-size: 27px;
        }
        .scenarioPanel > p, .scenarioCallout p {
          color: #9badc3;
          line-height: 1.7;
        }
        .scenarioCallout {
          margin: 22px 0;
          padding: 17px;
          border-left: 3px solid #55d8e8;
          background: rgba(22, 81, 101, .16);
        }
        .scenarioCallout strong {
          color: white;
        }
        .textareaLabel {
          display: block;
          color: #9db0c7;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .09em;
        }
        .textareaLabel textarea, .appealPanel textarea {
          width: 100%;
          min-height: 220px;
          margin-top: 10px;
          padding: 15px;
          border-radius: 12px;
          resize: vertical;
          line-height: 1.55;
        }
        .artifactPanel {
          padding: 12px;
        }
        .artifactCard {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          padding: 17px;
          border-radius: 12px;
          background: rgba(10, 22, 39, .66);
        }
        .artifactCard + .artifactCard {
          margin-top: 8px;
        }
        .artifactCard h3 {
          margin: 7px 0 4px;
          color: white;
          font-size: 16px;
        }
        .artifactCard p {
          margin: 0;
          max-width: 520px;
          color: #8297b0;
          font-size: 12px;
          line-height: 1.5;
        }
        .artifactCard select {
          min-width: 122px;
        }
        .artifactStatus {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .12em;
          font-weight: 900;
        }
        .artifact-missing {
          color: #ffb6b6;
        }
        .artifact-draft {
          color: #ffe394;
        }
        .artifact-submitted {
          color: #9eeeff;
        }
        .artifact-accepted {
          color: #a8ffc6;
        }
        .progressBlock {
          min-width: 150px;
          padding: 14px 18px;
          border: 1px solid rgba(94, 216, 235, .23);
          border-radius: 14px;
          text-align: center;
          background: rgba(13, 55, 73, .25);
        }
        .progressBlock strong, .progressBlock span {
          display: block;
        }
        .progressBlock strong {
          color: white;
          font-size: 26px;
        }
        .progressBlock span {
          color: #86a2bb;
          font-size: 11px;
        }
        .stepSection {
          margin-top: 54px;
        }
        .stepGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .stepCard {
          min-height: 180px;
          padding: 19px;
          border: 1px solid rgba(130, 157, 192, .16);
          border-radius: 15px;
          background: rgba(8, 17, 31, .68);
        }
        .stepCard > span {
          color: #5fddea;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .13em;
        }
        .stepCard h3 {
          margin: 14px 0 8px;
          color: white;
          font-size: 17px;
        }
        .stepCard p {
          margin: 0;
          color: #8196ae;
          font-size: 13px;
          line-height: 1.55;
        }
        .rubricGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .rubricCard {
          display: flex;
          gap: 16px;
          padding: 21px;
          border: 1px solid rgba(130, 157, 192, .17);
          border-radius: 16px;
          background: rgba(8, 17, 31, .7);
        }
        .rubricWeight {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          flex: 0 0 58px;
          border-radius: 14px;
          color: #dffcff;
          background: rgba(34, 119, 141, .24);
          font-weight: 900;
        }
        .rubricCard h3 {
          margin: 2px 0 7px;
          color: white;
        }
        .rubricCard p {
          margin: 0;
          color: #8498b0;
          line-height: 1.55;
          font-size: 13px;
        }
        .readinessGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 30px;
        }
        .readinessCard {
          padding: 20px;
          border: 1px solid rgba(130, 157, 192, .17);
          border-radius: 15px;
          background: rgba(7, 15, 28, .72);
        }
        .readinessCard span {
          color: #6edeea;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .12em;
        }
        .readinessCard h3 {
          margin: 10px 0 7px;
          color: white;
        }
        .readinessCard p {
          margin: 0;
          color: #8296ad;
          line-height: 1.5;
          font-size: 12px;
        }
        .assessorNotes {
          margin-top: 28px;
        }
        .historyLayout {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(340px, .85fr);
          gap: 20px;
        }
        .attemptList {
          display: grid;
          gap: 10px;
        }
        .attemptCard {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 19px;
          border: 1px solid rgba(130, 157, 192, .17);
          border-radius: 14px;
          background: rgba(8, 17, 31, .72);
        }
        .attemptCard span, .attemptCard p {
          color: #8195ae;
          font-size: 12px;
        }
        .attemptCard h3 {
          margin: 7px 0 4px;
          color: white;
        }
        .attemptCard p {
          margin: 0;
        }
        .appealPanel {
          padding: 24px;
        }
        .appealPanel h3 {
          margin: 9px 0;
          color: white;
          font-size: 24px;
        }
        .appealPanel p, .appealPanel small {
          color: #879bb3;
          line-height: 1.6;
        }
        .appealPanel button {
          margin-top: 14px;
          width: 100%;
        }
        .appealPanel small {
          display: block;
          margin-top: 14px;
        }
        .emptyState {
          padding: 42px;
          border: 1px dashed rgba(130, 157, 192, .25);
          border-radius: 14px;
          color: #8297b0;
          text-align: center;
        }
        .anchorSection, .principlesSection, .connectionsSection {
          border-top: 1px solid rgba(130, 157, 192, .12);
        }
        .anchorGrid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 10px;
        }
        .anchorCard {
          min-height: 180px;
          padding: 17px;
          border: 1px solid rgba(130, 157, 192, .16);
          border-radius: 14px;
          background: linear-gradient(180deg, rgba(11, 24, 43, .76), rgba(6, 13, 25, .76));
        }
        .anchorCard span {
          color: #5cd7e5;
          font-size: 11px;
          font-weight: 900;
        }
        .anchorCard h3 {
          margin: 20px 0 8px;
          color: white;
        }
        .anchorCard p {
          margin: 0;
          color: #7f93ac;
          font-size: 12px;
          line-height: 1.5;
        }
        .principlesGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .principleCard {
          display: flex;
          gap: 14px;
          min-height: 150px;
          padding: 18px;
          border: 1px solid rgba(130, 157, 192, .15);
          border-radius: 14px;
          background: rgba(8, 17, 31, .66);
        }
        .principleCard > span {
          color: #5ddce9;
          font-weight: 900;
        }
        .principleCard h3 {
          margin: 0 0 7px;
          color: white;
          font-size: 16px;
        }
        .principleCard p {
          margin: 0;
          color: #8094ac;
          font-size: 12px;
          line-height: 1.55;
        }
        .connectionsGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
        }
        .connectionCard {
          display: block;
          min-height: 175px;
          padding: 20px;
          border: 1px solid rgba(130, 157, 192, .17);
          border-radius: 15px;
          color: inherit;
          background: rgba(8, 17, 31, .7);
          text-decoration: none;
          transition: .18s ease;
        }
        .connectionCard:hover {
          transform: translateY(-2px);
          border-color: rgba(90, 218, 237, .42);
          background: rgba(12, 31, 48, .8);
        }
        .connectionCard span {
          color: white;
          font-size: 18px;
          font-weight: 850;
        }
        .connectionCard p {
          min-height: 58px;
          color: #8296ae;
          font-size: 13px;
          line-height: 1.55;
        }
        .connectionCard strong {
          color: #66dce9;
          font-size: 12px;
        }
        .academyFooter {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 28px clamp(22px, 5vw, 76px);
          border-top: 1px solid rgba(130, 157, 192, .14);
          background: #02060d;
        }
        .academyFooter strong, .academyFooter span {
          display: block;
        }
        .academyFooter strong {
          color: white;
        }
        .academyFooter span {
          margin-top: 4px;
          color: #71859e;
          font-size: 12px;
        }
        .academyFooter a {
          color: #74e3ef;
          text-decoration: none;
          font-weight: 800;
        }
        @media (max-width: 1280px) {
          .assessmentLayout {
            grid-template-columns: 200px minmax(0, 1fr);
          }
          .assessmentSummary {
            position: static;
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
          }
          .assessmentSummary h3, .assessmentSummary .finePrint {
            grid-column: 1 / -1;
          }
          .summaryDetermination {
            margin: 0;
          }
          .assessmentSummary .full {
            margin: 0;
          }
          .anchorGrid {
            grid-template-columns: repeat(4, 1fr);
          }
          .stepGrid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 980px) {
          .heroGrid, .practicalGrid, .historyLayout {
            grid-template-columns: 1fr;
          }
          .dashboardBand, .readinessGrid {
            grid-template-columns: repeat(2, 1fr);
          }
          .assessmentLayout {
            grid-template-columns: 1fr;
          }
          .questionRail {
            display: flex;
            max-height: none;
            overflow-x: auto;
          }
          .questionRailButton {
            min-width: 170px;
          }
          .rubricGrid, .principlesGrid {
            grid-template-columns: repeat(2, 1fr);
          }
          .connectionsGrid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stepGrid {
            grid-template-columns: repeat(2, 1fr);
          }
          .sectionHeader {
            align-items: start;
            flex-direction: column;
          }
        }
        @media (max-width: 700px) {
          .hero {
            padding-top: 44px;
          }
          .dashboardBand {
            grid-template-columns: 1fr;
          }
          .statusMetrics {
            grid-template-columns: 1fr;
          }
          .headerControls {
            width: 100%;
            flex-direction: column;
          }
          .headerControls input, .headerControls select {
            width: 100%;
          }
          .questionWorkspace {
            padding: 22px 16px;
          }
          .assessmentSummary {
            display: block;
          }
          .summaryRow {
            display: flex;
          }
          .artifactCard {
            align-items: stretch;
            flex-direction: column;
          }
          .artifactCard select {
            width: 100%;
          }
          .rubricGrid, .readinessGrid, .principlesGrid, .connectionsGrid, .stepGrid, .anchorGrid {
            grid-template-columns: 1fr;
          }
          .resultsPanel, .academyFooter {
            align-items: flex-start;
            flex-direction: column;
          }
          .tabBar {
            padding-left: 18px;
            padding-right: 18px;
          }
        }
      `}</style>
    </main>
  );
}

export default AssessmentCenterPage;
