"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

type Scenario = {
  id: string;
  title: string;
  domain: string;
  request: string;
  facts: string[];
  gaps: string[];
  expected: Decision;
  explanation: string;
};

type SavedState = {
  version: "1.0";
  updatedAt: string;
  activeScenario: string;
  decisions: Record<string, Decision | "">;
  rationales: Record<string, string>;
  completed: string[];
};

const STORAGE_KEY = "ta14-academy-runtime-governance-lab-v1";

const scenarios: Scenario[] = [
  {
    id: "refrigerant-charge",
    title: "Refrigerant Charging Request",
    domain: "HVAC field execution",
    request: "Authorize refrigerant charging based on a technician's pressure reading.",
    facts: [
      "Technician identity is verified.",
      "The work order authorizes diagnostic activity.",
      "A pressure reading was recorded 38 minutes ago.",
      "Outdoor temperature changed materially after the reading.",
    ],
    gaps: [
      "No current superheat or subcooling calculation.",
      "No verified airflow condition.",
      "No preserved baseline showing that charge is the primary determination.",
    ],
    expected: "HOLD",
    explanation:
      "The actor may be trusted, but the evidence is not sufficient or current enough to authorize a consequential charging action. Evidence must be refreshed and the execution basis revalidated.",
  },
  {
    id: "claims-release",
    title: "Automated Claims Release",
    domain: "Financial execution",
    request: "Release a payment after an AI system marks the claim as eligible.",
    facts: [
      "The model output is preserved and attributable.",
      "The claimant identity passed verification.",
      "The applicable policy version is known.",
      "The payment amount is within the normal range.",
    ],
    gaps: [
      "The model used an expired external eligibility dataset.",
      "No revalidation occurred before payment binding.",
    ],
    expected: "DENY",
    explanation:
      "The execution basis depends on an expired authority-bearing dataset. Because the invalid dependency directly affects eligibility, the payment must not proceed on the present route state.",
  },
  {
    id: "access-change",
    title: "Privileged Access Change",
    domain: "Identity and access governance",
    request: "Grant elevated production access to an engineer for an emergency repair.",
    facts: [
      "The engineer's identity and credentials are valid.",
      "An incident has been declared.",
      "The requested role exists and is technically available.",
      "The repair window is time-sensitive.",
    ],
    gaps: [
      "The incident commander has not approved the elevation.",
      "The requested access exceeds the engineer's standing authority.",
    ],
    expected: "ESCALATE",
    explanation:
      "The request may be legitimate, but the required authority is absent. It should be routed to the actor who can lawfully bind the temporary elevation rather than silently approved or permanently rejected.",
  },
  {
    id: "inspection-record",
    title: "Inspection Record Acceptance",
    domain: "Governed records",
    request: "Accept a completed inspection record into the official registry.",
    facts: [
      "The record is signed by the assigned inspector.",
      "Creation time, location, and asset identity are preserved.",
      "Required evidence attachments are present.",
      "Hash and version history match the submitted package.",
      "No unresolved contradiction is present.",
    ],
    gaps: [],
    expected: "ALLOW",
    explanation:
      "The record is attributable, continuous, complete, within scope, and supported by valid authority. The acceptance action corresponds to the reviewed package and may proceed.",
  },
];

const decisionStyles: Record<Decision, string> = {
  ALLOW: "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",
  HOLD: "border-amber-300/40 bg-amber-300/10 text-amber-100",
  DENY: "border-rose-300/40 bg-rose-300/10 text-rose-100",
  ESCALATE: "border-violet-300/40 bg-violet-300/10 text-violet-100",
};

export default function RuntimeGovernanceLabPage() {
  const [activeScenario, setActiveScenario] = useState(scenarios[0].id);
  const [decisions, setDecisions] = useState<Record<string, Decision | "">>({});
  const [rationales, setRationales] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<string[]>([]);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedState;
      if (saved.version !== "1.0") return;
      setActiveScenario(saved.activeScenario || scenarios[0].id);
      setDecisions(saved.decisions || {});
      setRationales(saved.rationales || {});
      setCompleted(Array.isArray(saved.completed) ? saved.completed : []);
    } catch {
      setSaveState("error");
    }
  }, []);

  const scenario = useMemo(
    () => scenarios.find((item) => item.id === activeScenario) ?? scenarios[0],
    [activeScenario],
  );

  const selectedDecision = decisions[scenario.id] || "";
  const rationale = rationales[scenario.id] || "";
  const progress = Math.round((completed.length / scenarios.length) * 100);
  const isCorrect = selectedDecision === scenario.expected;

  function chooseScenario(id: string) {
    setActiveScenario(id);
    setFeedbackVisible(false);
    setSaveState("idle");
  }

  function chooseDecision(decision: Decision) {
    setDecisions((current) => ({ ...current, [scenario.id]: decision }));
    setFeedbackVisible(false);
    setSaveState("idle");
  }

  function submitReview() {
    if (!selectedDecision || rationale.trim().length < 20) return;
    setFeedbackVisible(true);
    setCompleted((current) =>
      current.includes(scenario.id) ? current : [...current, scenario.id],
    );
  }

  function saveProgress() {
    try {
      const payload: SavedState = {
        version: "1.0",
        updatedAt: new Date().toISOString(),
        activeScenario,
        decisions,
        rationales,
        completed,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function resetLab() {
    setActiveScenario(scenarios[0].id);
    setDecisions({});
    setRationales({});
    setCompleted([]);
    setFeedbackVisible(false);
    setSaveState("idle");
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      setSaveState("error");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030812] text-slate-100">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[5%] top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[7%] top-64 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-[38%] h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/academy" className="flex items-center gap-3">
            <span className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-black tracking-[0.18em] text-cyan-200">TA-14</span>
            <span>
              <strong className="block text-sm text-white">Academy</strong>
              <small className="text-xs text-slate-400">Runtime Governance Lab</small>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm" aria-label="Academy navigation">
            <Link href="/academy/dashboard" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">Mission Control</Link>
            <Link href="/academy/architecture-explorer" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">Architecture Explorer</Link>
            <Link href="/academy/review" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">Review Workspace</Link>
          </nav>
        </header>

        <section className="py-12 lg:py-16">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Applied execution governance</p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Decide whether an execution has earned the right to proceed.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Identity, access, confidence, and technical capability do not independently make an action admissible. Review each live scenario against evidence, continuity, authority, boundary, and execution correspondence.</p>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-white">Lab progress</p>
                <p className="text-sm text-slate-400">{completed.length} of {scenarios.length} scenarios reviewed</p>
              </div>
              <div className="w-full sm:max-w-md">
                <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${progress}%` }} /></div>
                <p className="mt-2 text-right text-xs font-bold text-cyan-200">{progress}%</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <p className="px-2 pb-3 text-xs font-black uppercase tracking-[0.22em] text-slate-400">Scenario queue</p>
            <div className="space-y-2">
              {scenarios.map((item, index) => {
                const active = item.id === scenario.id;
                const done = completed.includes(item.id);
                return (
                  <button key={item.id} type="button" onClick={() => chooseScenario(item.id)} className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/[0.04]"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-black tracking-[0.18em] text-cyan-200">{String(index + 1).padStart(2, "0")}</span>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${done ? "bg-emerald-300/15 text-emerald-200" : "bg-white/5 text-slate-500"}`}>{done ? "Reviewed" : "Open"}</span>
                    </div>
                    <strong className="mt-3 block text-sm text-white">{item.title}</strong>
                    <span className="mt-1 block text-xs text-slate-400">{item.domain}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="space-y-6">
            <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
              <div className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">{scenario.domain}</p>
                  <h2 className="mt-2 text-3xl font-black text-white">{scenario.title}</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-bold text-slate-300">Runtime review</span>
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Execution request</p>
                <p className="mt-2 text-lg font-semibold leading-7 text-white">{scenario.request}</p>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <h3 className="font-black text-white">Known facts</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                    {scenario.facts.map((fact) => <li key={fact} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />{fact}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <h3 className="font-black text-white">Unresolved conditions</h3>
                  {scenario.gaps.length ? (
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                      {scenario.gaps.map((gap) => <li key={gap} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />{gap}</li>)}
                    </ul>
                  ) : <p className="mt-4 text-sm leading-6 text-slate-400">No unresolved condition is presented in the scenario package.</p>}
                </div>
              </div>
            </article>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
              <h3 className="text-2xl font-black text-white">Issue a runtime disposition</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Select the decision that should govern this exact execution now. Then explain the evidence, authority, continuity, or boundary condition that controls your answer.</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {(["ALLOW", "HOLD", "DENY", "ESCALATE"] as Decision[]).map((decision) => (
                  <button key={decision} type="button" onClick={() => chooseDecision(decision)} className={`rounded-2xl border px-5 py-4 text-sm font-black tracking-[0.12em] transition ${selectedDecision === decision ? decisionStyles[decision] : "border-white/10 bg-black/20 text-slate-300 hover:border-white/25 hover:text-white"}`}>{decision}</button>
                ))}
              </div>

              <label className="mt-6 block">
                <span className="text-sm font-bold text-white">Governance rationale</span>
                <textarea value={rationale} onChange={(event) => { setRationales((current) => ({ ...current, [scenario.id]: event.target.value })); setFeedbackVisible(false); setSaveState("idle"); }} rows={6} placeholder="Identify what is admissible, what remains unresolved, and why consequence may or may not bind..." className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40" />
              </label>

              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={submitReview} disabled={!selectedDecision || rationale.trim().length < 20} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40">Review decision</button>
                <button type="button" onClick={saveProgress} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-white/25 hover:bg-white/5">Save progress</button>
                <button type="button" onClick={resetLab} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-400 transition hover:border-rose-300/30 hover:text-rose-200">Reset lab</button>
                {saveState === "saved" && <span className="self-center text-sm font-bold text-emerald-300">Progress saved.</span>}
                {saveState === "error" && <span className="self-center text-sm font-bold text-rose-300">Progress could not be saved.</span>}
              </div>

              {feedbackVisible && (
                <div className={`mt-6 rounded-2xl border p-5 ${isCorrect ? "border-emerald-300/30 bg-emerald-300/[0.08]" : "border-amber-300/30 bg-amber-300/[0.08]"}`}>
                  <p className={`text-xs font-black uppercase tracking-[0.2em] ${isCorrect ? "text-emerald-200" : "text-amber-200"}`}>{isCorrect ? "Disposition aligned" : "Reconsider the controlling condition"}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-200"><strong className="text-white">Expected disposition: {scenario.expected}.</strong> {scenario.explanation}</p>
                </div>
              )}
            </section>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Constitutional rule</p>
          <h2 className="mt-3 text-2xl font-black text-white">No admissible evidence. No admissible execution.</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">A completed exercise is not an execution authorization. This laboratory teaches the reasoning discipline required to challenge evidence, authority, continuity, and correspondence before consequence occurs.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/academy/simulator" className="rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100">Open route simulator</Link>
            <Link href="/academy/assessment" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-300/40 hover:bg-white/5">Continue to assessment</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
