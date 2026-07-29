"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Bucket = "Foundation" | "Evidence" | "Authority" | "Execution";
type Choice = { label: string; explanation: string };
type Question = {
  id: string;
  bucket: Bucket;
  prompt: string;
  choices: Choice[];
  answer: number;
  critical?: boolean;
};

type SavedAttempt = {
  completedAt: string;
  score: number;
  percentage: number;
  criticalMisses: number;
  bucketScores: Record<Bucket, { correct: number; total: number }>;
};

const STORAGE_KEY = "ta14-academy-assessment-attempt-v1";

const questions: Question[] = [
  {
    id: "q1",
    bucket: "Foundation",
    prompt: "What is the governing purpose of execution admissibility?",
    choices: [
      { label: "To make AI systems faster", explanation: "Speed is not the governing objective." },
      { label: "To determine whether a specific action has earned the right to proceed now", explanation: "Correct. Admissibility is action-specific and time-specific." },
      { label: "To replace organizational policy", explanation: "The architecture governs execution; it does not erase policy." },
      { label: "To approve every authenticated request", explanation: "Authentication alone does not establish admissibility." },
    ],
    answer: 1,
    critical: true,
  },
  {
    id: "q2",
    bucket: "Foundation",
    prompt: "Which sequence best represents the eight visible anchor links?",
    choices: [
      { label: "Record → Reality → Outcome → Execution", explanation: "The order is incomplete and reversed." },
      { label: "Identity → Access → Trust → Automation", explanation: "Those are useful controls, but not the TA-14 anchor chain." },
      { label: "Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome", explanation: "Correct. These are the eight visible anchor links." },
      { label: "Policy → Model → Prompt → Response", explanation: "This does not represent consequential execution governance." },
    ],
    answer: 2,
  },
  {
    id: "q3",
    bucket: "Evidence",
    prompt: "A record exists, but it is stale and cannot be traced to its source. What is the proper determination?",
    choices: [
      { label: "ALLOW, because a record exists", explanation: "Existence alone does not make evidence admissible." },
      { label: "HOLD until currency and provenance are restored", explanation: "Correct. The action must not proceed on stale or untraceable evidence." },
      { label: "DENY permanently", explanation: "A permanent denial is not required if the defect can be cured." },
      { label: "Ignore the record and continue", explanation: "Bypassing the evidence requirement breaks the chain." },
    ],
    answer: 1,
    critical: true,
  },
  {
    id: "q4",
    bucket: "Evidence",
    prompt: "What does continuity preserve?",
    choices: [
      { label: "Only the final output", explanation: "The final output alone cannot establish an unbroken chain." },
      { label: "The relationship among reality, record, provenance, determination, and action", explanation: "Correct. Continuity preserves the chain that makes later challenge possible." },
      { label: "The model vendor's confidence score", explanation: "A confidence score is not continuity." },
      { label: "A user's login session", explanation: "Session continuity is narrower than execution continuity." },
    ],
    answer: 1,
  },
  {
    id: "q5",
    bucket: "Authority",
    prompt: "An actor has valid credentials but lacks authority for the exact action. What should happen?",
    choices: [
      { label: "ALLOW because identity is verified", explanation: "Verified identity does not establish action-specific authority." },
      { label: "ESCALATE to the proper authority", explanation: "Correct. The execution requires an authorized decision." },
      { label: "Commit automatically", explanation: "Commit cannot precede valid authority." },
      { label: "Change the evidence", explanation: "Evidence cannot cure an authority defect by itself." },
    ],
    answer: 1,
    critical: true,
  },
  {
    id: "q6",
    bucket: "Authority",
    prompt: "What is binding?",
    choices: [
      { label: "The moment a consequence becomes attached to a governed decision", explanation: "Correct. Binding is where the decision becomes consequential." },
      { label: "The process of logging into the Exchange", explanation: "Authentication is not binding." },
      { label: "A draft recommendation", explanation: "A draft has not yet bound consequence." },
      { label: "Any model output", explanation: "A model output may remain nonbinding." },
    ],
    answer: 0,
  },
  {
    id: "q7",
    bucket: "Execution",
    prompt: "A dependency changes after approval but before execution. What must occur?",
    choices: [
      { label: "Proceed because approval already happened", explanation: "Changed conditions can invalidate the prior determination." },
      { label: "Revalidate admissibility before execution", explanation: "Correct. Execution authority must survive changed conditions." },
      { label: "Delete the dependency record", explanation: "Deleting evidence destroys continuity." },
      { label: "Convert the action to a recommendation", explanation: "That does not resolve the changed dependency." },
    ],
    answer: 1,
    critical: true,
  },
  {
    id: "q8",
    bucket: "Execution",
    prompt: "Why must outcome evidence be preserved?",
    choices: [
      { label: "To prove the action occurred as governed and support later verification", explanation: "Correct. Outcome evidence closes the chain and preserves challengeability." },
      { label: "To improve visual design", explanation: "Presentation is not the purpose of outcome evidence." },
      { label: "To avoid all human review", explanation: "Preservation supports review; it does not eliminate it." },
      { label: "To guarantee the model was correct", explanation: "Outcome evidence records what happened; it does not guarantee correctness." },
    ],
    answer: 0,
  },
];

const buckets: Bucket[] = ["Foundation", "Evidence", "Authority", "Execution"];

function emptyBucketScores(): Record<Bucket, { correct: number; total: number }> {
  return {
    Foundation: { correct: 0, total: 0 },
    Evidence: { correct: 0, total: 0 },
    Authority: { correct: 0, total: 0 },
    Execution: { correct: 0, total: 0 },
  };
}

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [savedAttempt, setSavedAttempt] = useState<SavedAttempt | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setSavedAttempt(JSON.parse(stored) as SavedAttempt);
    } catch {
      setSavedAttempt(null);
    }
  }, []);

  const result = useMemo(() => {
    const bucketScores = emptyBucketScores();
    let score = 0;
    let criticalMisses = 0;

    for (const question of questions) {
      const correct = answers[question.id] === question.answer;
      bucketScores[question.bucket].total += 1;
      if (correct) {
        score += 1;
        bucketScores[question.bucket].correct += 1;
      } else if (question.critical) {
        criticalMisses += 1;
      }
    }

    const percentage = Math.round((score / questions.length) * 100);
    return { score, percentage, criticalMisses, bucketScores };
  }, [answers]);

  const answeredCount = Object.keys(answers).length;
  const ready = answeredCount === questions.length;
  const passed = result.percentage >= 80 && result.criticalMisses === 0;

  function submitAssessment() {
    if (!ready) return;
    setSubmitted(true);
    const attempt: SavedAttempt = {
      completedAt: new Date().toISOString(),
      score: result.score,
      percentage: result.percentage,
      criticalMisses: result.criticalMisses,
      bucketScores: result.bucketScores,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attempt));
    setSavedAttempt(attempt);
  }

  function resetAssessment() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030812] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[6%] top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[4%] top-52 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
            TA-14 Academy · Competency Validation
          </p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Assessment Center
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Demonstrate understanding of the governing architecture before moving from learning into consequential route construction.
              </p>
            </div>
            <Link
              href="/academy/dashboard"
              className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/30 hover:bg-white/[0.07]"
            >
              Return to Mission Control
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Questions answered" value={`${answeredCount}/${questions.length}`} />
          <Metric label="Current score" value={submitted ? `${result.percentage}%` : "Pending"} />
          <Metric label="Critical misses" value={submitted ? String(result.criticalMisses) : "Pending"} />
          <Metric label="Passing rule" value="80% + no critical miss" />
        </section>

        {savedAttempt && !submitted ? (
          <section className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-cyan-100">Previous preserved attempt</p>
                <p className="mt-1 text-sm text-slate-300">
                  {savedAttempt.percentage}% · {savedAttempt.criticalMisses} critical miss{savedAttempt.criticalMisses === 1 ? "" : "es"} · {new Date(savedAttempt.completedAt).toLocaleString()}
                </p>
              </div>
              <span className="rounded-full border border-cyan-300/25 px-3 py-1 text-xs font-bold text-cyan-100">
                Local training record
              </span>
            </div>
          </section>
        ) : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {questions.map((question, index) => {
              const selected = answers[question.id];
              const correct = submitted && selected === question.answer;
              const incorrect = submitted && selected !== question.answer;

              return (
                <section key={question.id} className="rounded-3xl border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-black/20 backdrop-blur">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-sm font-black text-cyan-200">
                        {index + 1}
                      </span>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {question.bucket}
                      </span>
                    </div>
                    {question.critical ? (
                      <span className="rounded-full border border-rose-400/25 bg-rose-400/10 px-3 py-1 text-xs font-bold text-rose-100">
                        Critical concept
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-5 text-xl font-bold leading-8 text-white">{question.prompt}</h2>

                  <div className="mt-5 space-y-3">
                    {question.choices.map((choice, choiceIndex) => {
                      const isSelected = selected === choiceIndex;
                      const isCorrectChoice = submitted && choiceIndex === question.answer;
                      const isWrongSelected = submitted && isSelected && choiceIndex !== question.answer;

                      return (
                        <label
                          key={choice.label}
                          className={`block cursor-pointer rounded-2xl border p-4 transition ${
                            isCorrectChoice
                              ? "border-emerald-400/45 bg-emerald-400/10"
                              : isWrongSelected
                                ? "border-rose-400/45 bg-rose-400/10"
                                : isSelected
                                  ? "border-cyan-300/45 bg-cyan-300/10"
                                  : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]"
                          }`}
                        >
                          <span className="flex gap-3">
                            <input
                              type="radio"
                              name={question.id}
                              checked={isSelected}
                              disabled={submitted}
                              onChange={() => setAnswers((current) => ({ ...current, [question.id]: choiceIndex }))}
                              className="mt-1 h-4 w-4 accent-cyan-400"
                            />
                            <span>
                              <span className="block font-semibold text-white">{choice.label}</span>
                              {submitted && (isSelected || isCorrectChoice) ? (
                                <span className="mt-2 block text-sm leading-6 text-slate-300">{choice.explanation}</span>
                              ) : null}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {submitted ? (
                    <p className={`mt-4 text-sm font-semibold ${correct ? "text-emerald-200" : incorrect ? "text-rose-200" : "text-slate-300"}`}>
                      {correct ? "Correct determination." : "Remediation required for this concept."}
                    </p>
                  ) : null}
                </section>
              );
            })}
          </div>

          <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
            <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/25 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Assessment status</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{submitted ? (passed ? "Competency demonstrated" : "Remediation required") : "In progress"}</h2>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
              </div>
              <p className="mt-3 text-sm text-slate-400">{answeredCount} of {questions.length} questions answered.</p>

              {!submitted ? (
                <button
                  type="button"
                  disabled={!ready}
                  onClick={submitAssessment}
                  className="mt-6 w-full rounded-2xl bg-cyan-300 px-5 py-4 font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit assessment
                </button>
              ) : (
                <button type="button" onClick={resetAssessment} className="mt-6 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-4 font-bold text-white transition hover:bg-white/[0.08]">
                  Begin new attempt
                </button>
              )}

              <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                Attempts are preserved locally for Academy progress and do not create an external credential by themselves.
              </p>
            </section>

            {submitted ? (
              <section className={`rounded-3xl border p-6 ${passed ? "border-emerald-400/30 bg-emerald-400/[0.07]" : "border-amber-400/30 bg-amber-400/[0.07]"}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Final result</p>
                <p className="mt-3 text-5xl font-black text-white">{result.percentage}%</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {passed
                    ? "You met the score threshold without missing a critical concept."
                    : "Review the weakest bucket and all critical misses before attempting the assessment again."}
                </p>
              </section>
            ) : null}

            <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Bucket scoring</p>
              <div className="mt-4 space-y-4">
                {buckets.map((bucket) => {
                  const item = result.bucketScores[bucket];
                  const percentage = submitted && item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
                  return (
                    <div key={bucket}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-white">{bucket}</span>
                        <span className="text-slate-400">{submitted ? `${item.correct}/${item.total}` : "Pending"}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-violet-300 transition-all" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur">
              <h3 className="font-bold text-white">Recommended remediation</h3>
              <div className="mt-4 space-y-2 text-sm">
                <Link href="/academy/what-is-a-route" className="block rounded-xl border border-white/10 p-3 text-slate-300 transition hover:border-cyan-300/30 hover:text-white">What Is a Governance Route?</Link>
                <Link href="/academy/reality-and-record" className="block rounded-xl border border-white/10 p-3 text-slate-300 transition hover:border-cyan-300/30 hover:text-white">Reality and Record</Link>
                <Link href="/academy/authority-and-binding" className="block rounded-xl border border-white/10 p-3 text-slate-300 transition hover:border-cyan-300/30 hover:text-white">Authority and Binding</Link>
                <Link href="/academy/execution-correspondence" className="block rounded-xl border border-white/10 p-3 text-slate-300 transition hover:border-cyan-300/30 hover:text-white">Execution Correspondence</Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
    </div>
  );
}
