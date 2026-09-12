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
  evidencePrompt: string;
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
    standard: "State the present condition without converting allegation, prediction, expectation, or assumption into fact.",
    evidencePrompt: "Preserve observations, measurements, timestamps, source conditions, and material uncertainty about the present state.",
  },
  {
    id: "record",
    label: "Record",
    question: "What attributable evidence preserves that reality?",
    standard: "Identify the record that converts observed reality into evidence another reviewer can inspect and challenge.",
    evidencePrompt: "Identify authorship, source, time, method, artifact, measurement, record location, and limitations.",
  },
  {
    id: "continuity",
    label: "Continuity",
    question: "Has the evidence remained intact and current?",
    standard: "Confirm that the evidence still corresponds to the present decision state and has not been broken by drift, delay, replacement, or dependency change.",
    evidencePrompt: "Preserve custody, version, timing, dependencies, intervening changes, and any continuity break.",
  },
  {
    id: "admissibility",
    label: "Admissibility",
    question: "Is the evidence sufficient for this exact decision?",
    standard: "The question is not whether evidence exists, but whether it is sufficient, current, relevant, and bounded enough to support this consequence-bearing decision.",
    evidencePrompt: "Evaluate relevance, completeness, contradiction, uncertainty, scope, currency, and whether more evidence is required.",
  },
  {
    id: "binding",
    label: "Binding",
    question: "Who or what has authority to bind the decision?",
    standard: "Identity, access, technical capability, or organizational role do not by themselves establish valid authority for this action now.",
    evidencePrompt: "Identify the authority source, actor, delegation, scope, limits, jurisdiction, expiration, and any conflicting authority.",
  },
  {
    id: "commit",
    label: "Commit",
    question: "What exact decision state will be preserved?",
    standard: "The system must preserve the exact approved decision state before execution begins so the action can later be compared against what was actually authorized.",
    evidencePrompt: "Record the approved version, rationale, conditions, exceptions, reviewer, timestamp, and expiration or reassessment point.",
  },
  {
    id: "execution",
    label: "Execution",
    question: "Does the proposed action correspond to the committed decision?",
    standard: "Execution must remain inside the preserved decision boundary and must not silently drift in purpose, subject, method, scope, timing, or consequence.",
    evidencePrompt: "Compare proposed or actual execution against the committed state and record deviations, controls, interruptions, or refusal conditions.",
  },
  {
    id: "outcome",
    label: "Outcome",
    question: "How will the result be independently verified?",
    standard: "Completion is not proof. Define the evidence that will establish whether the intended result occurred and whether unintended consequences appeared.",
    evidencePrompt: "Define expected results, verification evidence, reviewer, timing, exception handling, preservation, and challenge rights.",
  },
];

const decisionDescriptions: Record<Decision, string> = {
  ALLOW: "All required conditions are supported and execution may proceed only within the preserved boundary.",
  HOLD: "A correctable deficiency, stale condition, or unresolved question prevents execution for now.",
  DENY: "The proposed action lacks admissible evidence, valid authority, or a permissible execution boundary.",
  ESCALATE: "A qualified authority must resolve a conflict, exception, or material uncertainty before the decision can be completed.",
};

const gateTone: Record<GateState, string> = {
  UNRESOLVED: "border-slate-700/80 bg-slate-900/55 text-slate-300",
  SUPPORTED: "border-emerald-400/35 bg-emerald-400/10 text-emerald-100",
  DEFECT: "border-rose-400/35 bg-rose-400/10 text-rose-100",
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

  const currentGate = useMemo(() => gates.find((gate) => gate.id === activeGate) ?? gates[0], [activeGate]);
  const supportedCount = gates.filter((gate) => gateStates[gate.id] === "SUPPORTED").length;
  const defectCount = gates.filter((gate) => gateStates[gate.id] === "DEFECT").length;
  const resolvedCount = supportedCount + defectCount;
  const unresolvedCount = gates.length - resolvedCount;
  const progress = Math.round((resolvedCount / gates.length) * 100);
  const complete = resolvedCount === gates.length;
  const recommendedDecision: Decision = defectCount > 0 ? "HOLD" : complete ? "ALLOW" : "HOLD";
  const decisionConflict = decision === "ALLOW" && (!complete || defectCount > 0);

  function markDirty() {
    setSaveState("idle");
  }

  function setGateState(state: GateState) {
    setGateStates((current) => ({ ...current, [currentGate.id]: state }));
    markDirty();
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
      `Learner / review team: ${learnerName || "Not provided"}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "SCENARIO",
      scenario || "Not provided",
      "",
      "MISSION OBJECTIVE",
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
      "KNOWN UNCERTAINTY",
      uncertainty || "None recorded",
      "",
      "GOVERNANCE CHAIN",
      ...gates.flatMap((gate, index) => [
        `${String(index + 1).padStart(2, "0")} ${gate.label}: ${gateStates[gate.id] || "UNRESOLVED"}`,
        gateNotes[gate.id] || "No preserved analysis.",
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
    <div className="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-7 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[30px] border border-cyan-300/15 bg-[linear-gradient(135deg,rgba(7,23,35,.96),rgba(5,14,24,.94))] shadow-[0_30px_90px_rgba(0,0,0,.28)]">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.35fr_.65fr] lg:px-9 lg:py-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-300">
              <span>TA-14 Academy</span>
              <span className="text-slate-600">•</span>
              <span>Final practical examination</span>
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.03] tracking-[-0.04em] text-white sm:text-5xl">
              Capstone Mission
            </h1>
            <p className="mt-4 max-w-4xl text-xl font-bold leading-8 text-slate-200">
              Govern one consequential execution from reality through verified outcome.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
              Build a complete, attributable, challengeable decision record. Preserve the evidence, validate authority, constrain execution, and define how the outcome will be independently verified before you issue the final determination.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/academy/review" className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-2.5 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/15">
                Review Workspace
              </Link>
              <Link href="/academy/assessment" className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:text-white">
                Assessment Center
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Mission readiness</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric label="Resolved" value={`${resolvedCount}/${gates.length}`} />
              <Metric label="Supported" value={String(supportedCount)} />
              <Metric label="Defects" value={String(defectCount)} danger={defectCount > 0} />
              <Metric label="Unresolved" value={String(unresolvedCount)} />
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-400">
                <span>Governance record completion</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-cyan-300 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">Recommended determination</span>
              <strong className="mt-1 block text-2xl font-black text-white">{recommendedDecision}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">Step 1 · Establish the mission</p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Define the consequential decision before you evaluate it.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">A capstone record should make the decision, authority, boundary, evidence, and uncertainty clear enough that another qualified reviewer can understand the problem without reconstructing it from memory.</p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Field label="Mission title" value={missionTitle} onChange={(value) => { setMissionTitle(value); markDirty(); }} placeholder="Name the governed execution mission." />
          <Field label="Learner or review team" value={learnerName} onChange={(value) => { setLearnerName(value); markDirty(); }} placeholder="Preserve attribution." />
          <TextArea label="Scenario" value={scenario} onChange={(value) => { setScenario(value); markDirty(); }} placeholder="Describe the consequential situation without assuming the conclusion." />
          <TextArea label="Mission objective" value={objective} onChange={(value) => { setObjective(value); markDirty(); }} placeholder="Define the exact decision or action under review." />
          <TextArea label="Authority source" value={authoritySource} onChange={(value) => { setAuthoritySource(value); markDirty(); }} placeholder="Identify the law, policy, delegation, contract, order, or approved rule." />
          <TextArea label="Execution boundary" value={executionBoundary} onChange={(value) => { setExecutionBoundary(value); markDirty(); }} placeholder="Define what may occur, what may not occur, duration, subject, system, and jurisdiction." />
          <TextArea label="Evidence summary" value={evidenceSummary} onChange={(value) => { setEvidenceSummary(value); markDirty(); }} placeholder="Summarize the attributable evidence supporting the mission." />
          <TextArea label="Known uncertainty" value={uncertainty} onChange={(value) => { setUncertainty(value); markDirty(); }} placeholder="Preserve missing, conflicting, stale, or unresolved conditions." />
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">Step 2 · Resolve the governance chain</p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Work every gate before issuing consequence.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">A gate is resolved only when you have preserved enough analysis to mark it supported or defective. Leaving a gate unresolved keeps the recommended determination at HOLD.</p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="space-y-2">
            {gates.map((gate, index) => {
              const state = gateStates[gate.id] || "UNRESOLVED";
              const active = gate.id === currentGate.id;
              return (
                <button
                  key={gate.id}
                  type="button"
                  onClick={() => setActiveGate(gate.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-cyan-300/40 bg-cyan-300/10 shadow-[inset_3px_0_0_#67e8f9]" : "border-white/10 bg-black/15 hover:border-white/20 hover:bg-white/[0.04]"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black tracking-[0.16em] text-cyan-200">{String(index + 1).padStart(2, "0")}</span>
                    <span className={`rounded-full border px-2 py-1 text-[9px] font-black tracking-[0.08em] ${gateTone[state]}`}>{state}</span>
                  </div>
                  <strong className="mt-2 block text-sm text-white">{gate.label}</strong>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{gate.question}</span>
                </button>
              );
            })}
          </aside>

          <article className="rounded-3xl border border-cyan-300/15 bg-[linear-gradient(150deg,rgba(8,25,37,.92),rgba(5,14,23,.92))] p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">Active gate</p>
                <h3 className="mt-2 text-3xl font-black text-white">{currentGate.label}</h3>
                <p className="mt-2 text-lg font-semibold text-slate-200">{currentGate.question}</p>
              </div>
              <span className={`w-fit rounded-full border px-3 py-1.5 text-[10px] font-black tracking-[0.1em] ${gateTone[gateStates[currentGate.id] || "UNRESOLVED"]}`}>
                {gateStates[currentGate.id] || "UNRESOLVED"}
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.055] p-4">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">Capstone standard</span>
                <p className="mt-2 text-sm leading-6 text-slate-300">{currentGate.standard}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">What to preserve</span>
                <p className="mt-2 text-sm leading-6 text-slate-300">{currentGate.evidencePrompt}</p>
              </div>
            </div>

            <label className="mt-6 block text-sm font-bold text-slate-200">
              Preserved analysis
              <textarea
                value={gateNotes[currentGate.id] || ""}
                onChange={(event) => {
                  setGateNotes((current) => ({ ...current, [currentGate.id]: event.target.value }));
                  markDirty();
                }}
                className="mt-2 min-h-56 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/45 focus:ring-2 focus:ring-cyan-300/10"
                placeholder="Preserve the evidence, reasoning, limitations, contradictions, and unresolved questions for this gate."
              />
            </label>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {(["SUPPORTED", "DEFECT", "UNRESOLVED"] as GateState[]).map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => setGateState(state)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-black tracking-[0.06em] transition ${gateStates[currentGate.id] === state ? gateTone[state] : "border-white/10 bg-black/15 text-slate-400 hover:border-white/25 hover:text-white"}`}
                >
                  {state}
                </button>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
        <div className="border-b border-white/10 pb-5">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">Step 3 · Issue the determination</p>
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Select the decision supported by the preserved record.</h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">The capstone is not passed by choosing ALLOW. It is passed by issuing the determination the evidence, authority, continuity, and execution boundary actually support.</p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {(["ALLOW", "HOLD", "DENY", "ESCALATE"] as Decision[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => { setDecision(option); markDirty(); }}
              className={`rounded-2xl border p-5 text-left transition ${decision === option ? "border-cyan-300/45 bg-cyan-300/10 shadow-[inset_0_0_0_1px_rgba(103,232,249,.06)]" : "border-white/10 bg-black/15 hover:border-white/20 hover:bg-white/[0.035]"}`}
            >
              <strong className="block text-xl font-black text-white">{option}</strong>
              <span className="mt-2 block text-xs leading-5 text-slate-400">{decisionDescriptions[option]}</span>
            </button>
          ))}
        </div>

        {decisionConflict && (
          <div className="mt-5 rounded-2xl border border-rose-400/35 bg-rose-400/10 p-4 text-sm leading-6 text-rose-100">
            <strong>ALLOW is not supported by the current record.</strong> One or more governance gates remain unresolved or defective. Resolve the record or select the determination the evidence supports.
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <TextArea label="Decision rationale" value={decisionRationale} onChange={(value) => { setDecisionRationale(value); markDirty(); }} placeholder="Explain why the selected determination is supported by the preserved record." />
          <TextArea label="Outcome verification plan" value={outcomePlan} onChange={(value) => { setOutcomePlan(value); markDirty(); }} placeholder="Define what must be measured, observed, preserved, and reviewed after execution." />
          <TextArea label="Challenge and appeal path" value={challengePath} onChange={(value) => { setChallengePath(value); markDirty(); }} placeholder="Define who may challenge the decision, what evidence is required, and who reviews it." />
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-cyan-300/20 bg-[linear-gradient(135deg,rgba(34,211,238,.07),rgba(255,255,255,.025))] p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">Capstone record</p>
            <h2 className="mt-2 text-xl font-black text-white">Preserve the mission before you leave.</h2>
            <p className="mt-2 text-sm text-slate-400">
              {saveState === "saved" && "Mission saved locally in this browser."}
              {saveState === "error" && "The browser could not preserve the mission locally."}
              {saveState === "idle" && "Unsaved changes are not yet preserved."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={resetMission} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-white/25 hover:text-white">Reset</button>
            <button type="button" onClick={saveMission} className="rounded-xl border border-cyan-300/35 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/15">Save mission</button>
            <button type="button" onClick={exportMission} className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200">Export record</button>
          </div>
        </div>
      </section>

      <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold text-slate-400">No admissible evidence. No admissible execution.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/academy/review" className="transition hover:text-white">Review Workspace</Link>
          <Link href="/academy/assessment" className="transition hover:text-white">Assessment Center →</Link>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">{label}</span>
      <strong className={`mt-1 block text-2xl font-black ${danger ? "text-rose-200" : "text-white"}`}>{value}</strong>
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
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/45 focus:ring-2 focus:ring-cyan-300/10"
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
        className="mt-2 min-h-36 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/45 focus:ring-2 focus:ring-cyan-300/10"
        placeholder={placeholder}
      />
    </label>
  );
}
