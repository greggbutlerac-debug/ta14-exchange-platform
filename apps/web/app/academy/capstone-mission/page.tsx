"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type GateState = "UNRESOLVED" | "SUPPORTED" | "DEFECT";

type MissionGate = {
  id: string;
  label: string;
  question: string;
  standard: string;
};

type SavedMission = {
  version: "1.0";
  updatedAt: string;
  missionTitle: string;
  learnerName: string;
  scenario: string;
  objective: string;
  authoritySource: string;
  executionBoundary: string;
  evidenceSummary: string;
  uncertainty: string;
  gateStates: Record<string, GateState>;
  gateNotes: Record<string, string>;
  decision: Decision;
  decisionRationale: string;
  outcomePlan: string;
  challengePath: string;
};

const STORAGE_KEY = "ta14-academy-capstone-mission-v1";

const gates: MissionGate[] = [
  {
    id: "reality",
    label: "Reality",
    question: "What condition actually exists now?",
    standard:
      "State the present condition without converting allegation, prediction, or assumption into fact.",
  },
  {
    id: "record",
    label: "Record",
    question: "What attributable evidence preserves that reality?",
    standard:
      "Identify sources, timestamps, measurements, artifacts, authorship, and material limitations.",
  },
  {
    id: "continuity",
    label: "Continuity",
    question: "Has the evidence remained intact and current?",
    standard:
      "Confirm custody, version, timing, dependencies, and whether intervening change broke the chain.",
  },
  {
    id: "admissibility",
    label: "Admissibility",
    question: "Is the evidence sufficient for this exact decision?",
    standard:
      "Evaluate relevance, completeness, currency, contradiction, uncertainty, and scope before consequence.",
  },
  {
    id: "binding",
    label: "Binding",
    question: "Who or what has authority to bind the decision?",
    standard:
      "Separate identity, access, capability, and role from valid authority for this action now.",
  },
  {
    id: "commit",
    label: "Commit",
    question: "What exact decision state will be preserved?",
    standard:
      "Record the approved version, rationale, conditions, exceptions, reviewer, and expiration point.",
  },
  {
    id: "execution",
    label: "Execution",
    question: "Does the proposed action correspond to the committed decision?",
    standard:
      "Confirm the action remains inside the approved boundary and has not drifted in purpose or scope.",
  },
  {
    id: "outcome",
    label: "Outcome",
    question: "How will the result be independently verified?",
    standard:
      "Define expected results, verification evidence, exception handling, challenge rights, and preservation.",
  },
];

const gateStyles: Record<GateState, string> = {
  UNRESOLVED: "border-white/10 bg-white/[0.03] text-slate-300",
  SUPPORTED: "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",
  DEFECT: "border-rose-300/40 bg-rose-300/10 text-rose-100",
};

const decisionDescriptions: Record<Decision, string> = {
  ALLOW: "Every required condition is supported and the execution may proceed within the preserved boundary.",
  HOLD: "A correctable deficiency or unresolved condition prevents execution for now.",
  DENY: "The action lacks admissible evidence, valid authority, or a permissible execution boundary.",
  ESCALATE: "A qualified authority must resolve a conflict, exception, or material uncertainty.",
};

export default function CapstoneMissionPage() {
  const [activeGate, setActiveGate] = useState(gates[0].id);
  const [missionTitle, setMissionTitle] = useState("");
  const [learnerName, setLearnerName] = useState("");
  const [scenario, setScenario] = useState("");
  const [objective, setObjective] = useState("");
  const [authoritySource, setAuthoritySource] = useState("");
  const [executionBoundary, setExecutionBoundary] = useState("");
  const [evidenceSummary, setEvidenceSummary] = useState("");
  const [uncertainty, setUncertainty] = useState("");
  const [gateStates, setGateStates] = useState<Record<string, GateState>>({});
  const [gateNotes, setGateNotes] = useState<Record<string, string>>({});
  const [decision, setDecision] = useState<Decision>("HOLD");
  const [decisionRationale, setDecisionRationale] = useState("");
  const [outcomePlan, setOutcomePlan] = useState("");
  const [challengePath, setChallengePath] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedMission;
      if (saved.version !== "1.0") return;
      setMissionTitle(saved.missionTitle || "");
      setLearnerName(saved.learnerName || "");
      setScenario(saved.scenario || "");
      setObjective(saved.objective || "");
      setAuthoritySource(saved.authoritySource || "");
      setExecutionBoundary(saved.executionBoundary || "");
      setEvidenceSummary(saved.evidenceSummary || "");
      setUncertainty(saved.uncertainty || "");
      setGateStates(saved.gateStates || {});
      setGateNotes(saved.gateNotes || {});
      setDecision(saved.decision || "HOLD");
      setDecisionRationale(saved.decisionRationale || "");
      setOutcomePlan(saved.outcomePlan || "");
      setChallengePath(saved.challengePath || "");
    } catch {
      setSaveState("error");
    }
  }, []);

  const currentGate = useMemo(
    () => gates.find((gate) => gate.id === activeGate) ?? gates[0],
    [activeGate],
  );

  const supportedCount = gates.filter((gate) => gateStates[gate.id] === "SUPPORTED").length;
  const defectCount = gates.filter((gate) => gateStates[gate.id] === "DEFECT").length;
  const resolvedCount = supportedCount + defectCount;
  const progress = Math.round((resolvedCount / gates.length) * 100);
  const complete = resolvedCount === gates.length;
  const recommendedDecision: Decision = defectCount > 0 ? "HOLD" : complete ? "ALLOW" : "HOLD";
  const decisionConflict = decision === "ALLOW" && (!complete || defectCount > 0);

  function setGateState(state: GateState) {
    setGateStates((current) => ({ ...current, [currentGate.id]: state }));
    setSaveState("idle");
  }

  function saveMission() {
    try {
      const payload: SavedMission = {
        version: "1.0",
        updatedAt: new Date().toISOString(),
        missionTitle,
        learnerName,
        scenario,
        objective,
        authoritySource,
        executionBoundary,
        evidenceSummary,
        uncertainty,
        gateStates,
        gateNotes,
        decision,
        decisionRationale,
        outcomePlan,
        challengePath,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function resetMission() {
    setActiveGate(gates[0].id);
    setMissionTitle("");
    setLearnerName("");
    setScenario("");
    setObjective("");
    setAuthoritySource("");
    setExecutionBoundary("");
    setEvidenceSummary("");
    setUncertainty("");
    setGateStates({});
    setGateNotes({});
    setDecision("HOLD");
    setDecisionRationale("");
    setOutcomePlan("");
    setChallengePath("");
    setSaveState("idle");
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      setSaveState("error");
    }
  }

  function exportMission() {
    const lines = [
      "TA-14 ACADEMY — CAPSTONE MISSION RECORD",
      "",
      `Mission: ${missionTitle || "Untitled mission"}`,
      `Learner: ${learnerName || "Not provided"}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "SCENARIO",
      scenario || "Not provided",
      "",
      "OBJECTIVE",
      objective || "Not provided",
      "",
      "AUTHORITY SOURCE",
      authoritySource || "Not provided",
      "",
      "EXECUTION BOUNDARY",
      executionBoundary || "Not provided",
      "",
      "EVIDENCE SUMMARY",
      evidenceSummary || "Not provided",
      "",
      "UNCERTAINTY",
      uncertainty || "None recorded",
      "",
      "GOVERNANCE CHAIN",
      ...gates.flatMap((gate) => [
        `${gate.label}: ${gateStates[gate.id] || "UNRESOLVED"}`,
        gateNotes[gate.id] || "No note recorded.",
        "",
      ]),
      `FINAL DETERMINATION: ${decision}`,
      decisionRationale || "No rationale recorded.",
      "",
      "OUTCOME VERIFICATION PLAN",
      outcomePlan || "Not provided",
      "",
      "CHALLENGE AND APPEAL PATH",
      challengePath || "Not provided",
      "",
      "No admissible evidence. No admissible execution.",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "TA-14_Academy_Capstone_Mission_Record.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030812] text-slate-100">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[3%] top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[4%] top-72 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-[38%] h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/academy" className="flex items-center gap-3">
            <span className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-black tracking-[0.18em] text-cyan-200">
              TA-14
            </span>
            <span>
              <strong className="block text-sm text-white">Academy</strong>
              <small className="text-xs text-slate-400">Capstone Mission</small>
            </span>
          </Link>

          <nav className="flex flex-wrap gap-2 text-sm" aria-label="Academy navigation">
            <Link href="/academy/dashboard" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">
              Mission Control
            </Link>
            <Link href="/academy/governed-execution-studio" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">
              Execution Studio
            </Link>
            <Link href="/academy/assessment" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">
              Assessment Center
            </Link>
          </nav>
        </header>

        <section className="py-12 lg:py-16">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Final practical examination</p>
          <h1 className="max-w-5xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Govern one consequential execution from reality through verified outcome.
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            The Capstone Mission requires a complete, attributable, challengeable governance record. The learner must preserve the evidence, validate authority, constrain execution, and define how the outcome will be independently verified.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <Metric label="Resolved gates" value={`${resolvedCount}/${gates.length}`} />
            <Metric label="Supported" value={String(supportedCount)} />
            <Metric label="Defects" value={String(defectCount)} />
            <Metric label="Recommended" value={recommendedDecision} emphasis />
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl lg:grid-cols-2 lg:p-7">
          <Field label="Mission title" value={missionTitle} onChange={setMissionTitle} placeholder="Name the governed execution mission." />
          <Field label="Learner or review team" value={learnerName} onChange={setLearnerName} placeholder="Preserve attribution." />
          <TextArea label="Scenario" value={scenario} onChange={setScenario} placeholder="Describe the consequential situation without assuming the conclusion." />
          <TextArea label="Mission objective" value={objective} onChange={setObjective} placeholder="Define the exact decision or action under review." />
          <TextArea label="Authority source" value={authoritySource} onChange={setAuthoritySource} placeholder="Identify the law, policy, delegation, contract, order, or approved rule." />
          <TextArea label="Execution boundary" value={executionBoundary} onChange={setExecutionBoundary} placeholder="Define what may occur, what may not occur, duration, subject, system, and jurisdiction." />
          <TextArea label="Evidence summary" value={evidenceSummary} onChange={setEvidenceSummary} placeholder="Summarize the attributable evidence supporting the mission." />
          <TextArea label="Known uncertainty" value={uncertainty} onChange={setUncertainty} placeholder="Preserve missing, conflicting, stale, or unresolved conditions." />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[330px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <p className="px-2 pb-3 text-xs font-black uppercase tracking-[0.22em] text-slate-400">Governance chain</p>
            <div className="space-y-2">
              {gates.map((gate, index) => {
                const state = gateStates[gate.id] || "UNRESOLVED";
                const active = gate.id === currentGate.id;
                return (
                  <button
                    key={gate.id}
                    type="button"
                    onClick={() => setActiveGate(gate.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/[0.04]"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-black tracking-[0.18em] text-cyan-200">{String(index + 1).padStart(2, "0")}</span>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-black tracking-[0.1em] ${gateStyles[state]}`}>{state}</span>
                    </div>
                    <strong className="mt-3 block text-sm text-white">{gate.label}</strong>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">{gate.question}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl lg:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Active gate</p>
            <h2 className="mt-3 text-3xl font-black text-white">{currentGate.label}</h2>
            <p className="mt-3 text-lg text-slate-200">{currentGate.question}</p>
            <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-5 text-sm leading-7 text-slate-300">
              <strong className="block text-cyan-100">Capstone standard</strong>
              {currentGate.standard}
            </div>

            <label className="mt-6 block text-sm font-bold text-slate-200">
              Preserved analysis
              <textarea
                value={gateNotes[currentGate.id] || ""}
                onChange={(event) => {
                  setGateNotes((current) => ({ ...current, [currentGate.id]: event.target.value }));
                  setSaveState("idle");
                }}
                className="mt-2 min-h-52 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                placeholder="Preserve the evidence, reasoning, limitations, and unresolved questions for this gate."
              />
            </label>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {(["SUPPORTED", "DEFECT", "UNRESOLVED"] as GateState[]).map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => setGateState(state)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-black tracking-[0.08em] transition ${gateStates[currentGate.id] === state ? gateStyles[state] : "border-white/10 bg-black/10 text-slate-400 hover:border-white/25 hover:text-white"}`}
                >
                  {state}
                </button>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl lg:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Final determination</p>
          <h2 className="mt-3 text-3xl font-black text-white">Select the decision supported by the preserved record.</h2>
          <p className="mt-3 max-w-4xl leading-7 text-slate-300">
            The capstone is not passed by selecting ALLOW. It is passed by issuing the decision the evidence, authority, continuity, and boundary actually support.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {(["ALLOW", "HOLD", "DENY", "ESCALATE"] as Decision[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDecision(option)}
                className={`rounded-2xl border p-5 text-left transition ${decision === option ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-black/10 hover:border-white/25"}`}
              >
                <strong className="block text-lg text-white">{option}</strong>
                <span className="mt-2 block text-xs leading-5 text-slate-400">{decisionDescriptions[option]}</span>
              </button>
            ))}
          </div>

          {decisionConflict && (
            <div className="mt-5 rounded-2xl border border-rose-300/40 bg-rose-300/10 p-4 text-sm leading-6 text-rose-100">
              ALLOW conflicts with the current capstone record because one or more gates remain unresolved or defective.
            </div>
          )}

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <TextArea label="Decision rationale" value={decisionRationale} onChange={setDecisionRationale} placeholder="Explain why the selected determination is supported." />
            <TextArea label="Outcome verification plan" value={outcomePlan} onChange={setOutcomePlan} placeholder="Define what must be measured, observed, preserved, and reviewed after execution." />
            <TextArea label="Challenge and appeal path" value={challengePath} onChange={setChallengePath} placeholder="Define who may challenge the decision, what evidence is required, and who reviews it." />
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-4 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Capstone record</p>
            <p className="mt-2 text-sm text-slate-300">
              {saveState === "saved" && "Mission saved locally."}
              {saveState === "error" && "The browser could not preserve the mission."}
              {saveState === "idle" && "Save the mission before leaving this page."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={resetMission} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-white/25 hover:text-white">
              Reset
            </button>
            <button type="button" onClick={saveMission} className="rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/20">
              Save mission
            </button>
            <button type="button" onClick={exportMission} className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200">
              Export record
            </button>
          </div>
        </section>

        <footer className="mt-10 flex flex-col gap-4 border-t border-white/10 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>No admissible evidence. No admissible execution.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/academy/review" className="transition hover:text-white">Review Workspace</Link>
            <Link href="/academy/assessment" className="transition hover:text-white">Assessment Center →</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Metric({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${emphasis ? "border-cyan-300/30 bg-cyan-300/[0.08]" : "border-white/10 bg-white/[0.04]"}`}>
      <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <strong className={`mt-2 block text-2xl font-black ${emphasis ? "text-cyan-200" : "text-white"}`}>{value}</strong>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block text-sm font-bold text-slate-200">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
        placeholder={placeholder}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block text-sm font-bold text-slate-200">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-36 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
        placeholder={placeholder}
      />
    </label>
  );
}
