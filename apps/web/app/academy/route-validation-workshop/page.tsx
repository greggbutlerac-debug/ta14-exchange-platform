"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GateState = "SUPPORTED" | "DEFECT" | "UNRESOLVED" | "NOT_REVIEWED";
type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

type Gate = {
  id: string;
  anchor: string;
  title: string;
  question: string;
  support: string;
  failure: string;
};

type RouteScenario = {
  id: string;
  title: string;
  domain: string;
  request: string;
  evidence: string[];
  defects: string[];
  expectedDecision: Decision;
  rationale: string;
};

type GateRecord = {
  state: GateState;
  note: string;
};

type ScenarioRecord = {
  reviewer: string;
  gates: Record<string, GateRecord>;
  decision: Decision | "";
  rationale: string;
  remediation: string;
  completed: boolean;
  reviewedAt: string;
};

const STORAGE_KEY = "ta14-academy-route-validation-workshop-v2";

const gates: Gate[] = [
  {
    id: "reality",
    anchor: "Reality",
    title: "The execution subject is correctly established",
    question: "Does the route identify the actual person, system, asset, event, environment, or transaction that will be affected?",
    support: "Preserve identifiers, timestamps, location, system state, and other facts that establish the execution subject.",
    failure: "A substituted, ambiguous, stale, simulated, or unverified reality cannot support binding consequence.",
  },
  {
    id: "record",
    anchor: "Record",
    title: "The evidence package is preserved",
    question: "Is the evidence attributable, inspectable, current enough, and connected to the identified reality?",
    support: "Cite the record, evidence package, source, version, timestamp, and custody basis.",
    failure: "Missing, unverifiable, contradicted, or unattributed evidence requires the route to pause.",
  },
  {
    id: "continuity",
    anchor: "Continuity",
    title: "No unexplained break exists",
    question: "Can the route be traced continuously from reality through the current request without an ungoverned gap?",
    support: "Preserve handoffs, versions, dependency changes, custody, and all material transitions.",
    failure: "An unexplained break prevents the route from proving that current evidence still corresponds to current reality.",
  },
  {
    id: "admissibility",
    anchor: "Admissibility",
    title: "The evidence is fit for this decision",
    question: "Is the available evidence sufficient, current, relevant, reliable, and within the decision boundary?",
    support: "Explain why the evidence is admissible for this exact determination now.",
    failure: "Evidence may exist and still be inadmissible because it is stale, incomplete, irrelevant, or outside scope.",
  },
  {
    id: "binding",
    anchor: "Binding",
    title: "Valid authority supports the consequence",
    question: "Does a current authority permit this actor or system to bind this action to reality?",
    support: "Identify the policy, delegation, role, approval, contract, order, or legal source supporting the action.",
    failure: "Identity, access, or technical capability does not alone establish binding authority.",
  },
  {
    id: "commit",
    anchor: "Commit",
    title: "The exact approved state is preserved",
    question: "Is the decision, version, evidence basis, boundary, and intended execution committed before action?",
    support: "Preserve the approved instruction, version history, decision record, and rollback conditions.",
    failure: "An uncommitted or silently modified route cannot prove what was actually authorized.",
  },
  {
    id: "execution",
    anchor: "Execution",
    title: "The proposed method corresponds to the approved method",
    question: "Will execution use the same controls, sequence, limits, actor, tools, and safeguards that were reviewed?",
    support: "Record the procedure, control set, stop conditions, monitoring method, and exception path.",
    failure: "Method drift, control bypass, or scope expansion invalidates the original route approval.",
  },
  {
    id: "outcome",
    anchor: "Outcome",
    title: "The result can be verified and preserved",
    question: "Can the consequence be observed, tested, attributed, challenged, and preserved after execution?",
    support: "Define expected result, acceptance criteria, monitoring, reversal path, and outcome evidence.",
    failure: "A route is incomplete when it cannot prove what happened after consequence occurred.",
  },
];

const scenarios: RouteScenario[] = [
  {
    id: "autonomous-refund",
    title: "Autonomous Customer Refund",
    domain: "Financial execution integrity",
    request: "Release a $7,850 refund automatically after a customer-service model classifies the complaint as valid.",
    evidence: [
      "Customer and transaction identities are verified.",
      "The original purchase record is preserved.",
      "The model output includes a confidence score and reason codes.",
      "A refund policy exists for amounts below $5,000.",
    ],
    defects: [
      "The requested refund exceeds the automated authority threshold.",
      "No authorized reviewer has approved the higher consequence.",
      "The model used a policy summary rather than the current governing policy version.",
    ],
    expectedDecision: "ESCALATE",
    rationale: "The claim may be supported, but the amount exceeds delegated automated authority and the governing policy source is not current. A qualified authority must rebind the route.",
  },
  {
    id: "hvac-intervention",
    title: "HVAC Refrigerant Intervention",
    domain: "Environmental and mechanical governance",
    request: "Add refrigerant based on low suction pressure observed before airflow was verified.",
    evidence: [
      "Equipment identity and service location are preserved.",
      "A low-pressure observation is recorded.",
      "The technician is EPA 608 certified.",
    ],
    defects: [
      "Airflow and static pressure were not established.",
      "No primary refrigerant determination is preserved.",
      "Current superheat or subcooling evidence is missing.",
      "Certification establishes handling authority, not diagnostic admissibility.",
    ],
    expectedDecision: "HOLD",
    rationale: "The proposed intervention lacks an admissible diagnostic basis. The route must pause until airflow, load, and refrigerant evidence establish the actual condition.",
  },
  {
    id: "access-revocation",
    title: "Privileged Access Revocation",
    domain: "Identity and access governance",
    request: "Immediately revoke a contractor's production access after the contract termination event is confirmed.",
    evidence: [
      "The contractor identity is verified.",
      "The termination event is preserved and attributable.",
      "The access account and affected systems are identified.",
      "The security policy expressly requires immediate revocation.",
      "The revocation action is logged and reversible by an authorized administrator.",
    ],
    defects: [],
    expectedDecision: "ALLOW",
    rationale: "Reality, evidence, authority, scope, method, and outcome verification all correspond to the required revocation action.",
  },
  {
    id: "medical-denial",
    title: "Automated Treatment Denial",
    domain: "High-consequence decision governance",
    request: "Deny a requested treatment because a prediction model classifies the patient as unlikely to benefit.",
    evidence: [
      "The patient identity and request are preserved.",
      "The model output is available.",
    ],
    defects: [
      "The model was not validated for the patient's condition and population.",
      "Material clinical evidence is missing from the input record.",
      "No qualified clinical authority reviewed the denial.",
      "No challenge or appeal path is included before consequence.",
    ],
    expectedDecision: "DENY",
    rationale: "The route cannot lawfully or operationally support the denial because evidence fitness, authority, and challenge protections are absent.",
  },
];

function blankRecord(): ScenarioRecord {
  return {
    reviewer: "",
    gates: Object.fromEntries(gates.map((gate) => [gate.id, { state: "NOT_REVIEWED", note: "" }])) as Record<string, GateRecord>,
    decision: "",
    rationale: "",
    remediation: "",
    completed: false,
    reviewedAt: "",
  };
}

export default function RouteValidationWorkshopPage() {
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id);
  const [records, setRecords] = useState<Record<string, ScenarioRecord>>(() =>
    Object.fromEntries(scenarios.map((scenario) => [scenario.id, blankRecord()]))
  );
  const [hydrated, setHydrated] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { activeScenarioId?: string; records?: Record<string, ScenarioRecord> };
        if (parsed.activeScenarioId) setActiveScenarioId(parsed.activeScenarioId);
        if (parsed.records) {
          setRecords((current) => {
            const next = { ...current };
            for (const scenario of scenarios) {
              const saved = parsed.records?.[scenario.id];
              if (saved) next[scenario.id] = { ...blankRecord(), ...saved };
            }
            return next;
          });
        }
      }
    } catch {
      // Ignore malformed local state and continue with a clean workshop.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: "2.0", activeScenarioId, records, updatedAt: new Date().toISOString() })
    );
  }, [activeScenarioId, records, hydrated]);

  useEffect(() => {
    setShowAnswer(false);
    setExportMessage("");
  }, [activeScenarioId]);

  const activeScenario = scenarios.find((scenario) => scenario.id === activeScenarioId) ?? scenarios[0];
  const activeRecord = records[activeScenario.id] ?? blankRecord();

  const counts = useMemo(() => {
    const values = Object.values(activeRecord.gates);
    return {
      supported: values.filter((gate) => gate.state === "SUPPORTED").length,
      defect: values.filter((gate) => gate.state === "DEFECT").length,
      unresolved: values.filter((gate) => gate.state === "UNRESOLVED").length,
      reviewed: values.filter((gate) => gate.state !== "NOT_REVIEWED").length,
    };
  }, [activeRecord.gates]);

  const completion = Math.round((counts.reviewed / gates.length) * 100);
  const completedMissions = Object.values(records).filter((record) => record.completed).length;

  function updateRecord(updater: (record: ScenarioRecord) => ScenarioRecord) {
    setRecords((current) => ({ ...current, [activeScenario.id]: updater(current[activeScenario.id] ?? blankRecord()) }));
  }

  function updateGate(gateId: string, patch: Partial<GateRecord>) {
    updateRecord((record) => ({
      ...record,
      completed: false,
      gates: { ...record.gates, [gateId]: { ...record.gates[gateId], ...patch } },
    }));
  }

  function finalizeReview() {
    if (counts.reviewed < gates.length || !activeRecord.decision || !activeRecord.rationale.trim()) return;
    updateRecord((record) => ({ ...record, completed: true, reviewedAt: new Date().toISOString() }));
  }

  function resetMission() {
    setRecords((current) => ({ ...current, [activeScenario.id]: blankRecord() }));
    setShowAnswer(false);
    setExportMessage("");
  }

  function exportRecord() {
    const payload = {
      recordType: "TA-14 Academy Route Validation Record",
      schemaVersion: "2.0",
      exportedAt: new Date().toISOString(),
      scenario: activeScenario,
      learnerRecord: activeRecord,
      governingRule: "No admissible evidence. No admissible execution.",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TA-14_Route_Validation_${activeScenario.id}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExportMessage("Governed validation record exported.");
  }

  const decisionConflict = Boolean(activeRecord.decision && activeRecord.decision !== activeScenario.expectedDecision);

  return (
    <main className="pageShell">
      <div className="ambient ambientOne" aria-hidden="true" />
      <div className="ambient ambientTwo" aria-hidden="true" />

      <header className="topbar">
        <Link href="/academy" className="brand">
          <span className="brandMark">TA-14</span>
          <span><strong>Academy</strong><small>Route Validation Workshop</small></span>
        </Link>
        <nav>
          <Link href="/academy/dashboard">Mission Control</Link>
          <Link href="/academy/route-construction-lab">Construction Lab</Link>
          <Link href="/academy/review">Review Workspace</Link>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">Applied governance workshop</p>
          <h1>Validate the route <em>before consequence becomes real.</em></h1>
          <p className="heroCopy">
            A route is not valid because it looks complete. It is valid only when each governing anchor is supported by current, attributable, admissible evidence and valid authority for the exact execution proposed now.
          </p>
        </div>
        <div className="heroRule">
          <span>Constitutional rule</span>
          <strong>No admissible evidence.<br />No admissible execution.</strong>
          <p>{completedMissions} of {scenarios.length} workshop missions completed</p>
        </div>
      </section>

      <section className="missionTabs" aria-label="Validation missions">
        {scenarios.map((scenario, index) => (
          <button
            type="button"
            key={scenario.id}
            className={scenario.id === activeScenario.id ? "active" : ""}
            onClick={() => setActiveScenarioId(scenario.id)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><strong>{scenario.title}</strong><small>{scenario.domain}</small></div>
            {records[scenario.id]?.completed && <b>✓</b>}
          </button>
        ))}
      </section>

      <section className="missionBrief">
        <div>
          <p className="eyebrow">Execution request</p>
          <h2>{activeScenario.title}</h2>
          <p className="request">{activeScenario.request}</p>
        </div>
        <div className="briefColumns">
          <article>
            <h3>Preserved evidence</h3>
            <ul>{activeScenario.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article className="defectBrief">
            <h3>Known route pressure</h3>
            {activeScenario.defects.length ? (
              <ul>{activeScenario.defects.map((item) => <li key={item}>{item}</li>)}</ul>
            ) : <p>No disclosed defect. Validate independently rather than assuming the route is admissible.</p>}
          </article>
        </div>
      </section>

      <section className="workshopGrid">
        <aside className="progressPanel">
          <p className="eyebrow">Validation status</p>
          <div className="progressNumber"><strong>{completion}%</strong><span>{counts.reviewed} of {gates.length} anchors reviewed</span></div>
          <div className="track"><span style={{ width: `${completion}%` }} /></div>
          <div className="metricGrid">
            <div><strong>{counts.supported}</strong><span>Supported</span></div>
            <div><strong>{counts.defect}</strong><span>Defects</span></div>
            <div><strong>{counts.unresolved}</strong><span>Unresolved</span></div>
          </div>
          <label className="reviewerField">Reviewer or learner
            <input value={activeRecord.reviewer} onChange={(e) => updateRecord((record) => ({ ...record, reviewer: e.target.value }))} placeholder="Name or identifier" />
          </label>
          <div className="statusRule">
            <strong>{counts.defect > 0 || counts.unresolved > 0 ? "Route not cleared" : counts.reviewed === gates.length ? "All anchors supported" : "Review incomplete"}</strong>
            <p>Completion is not authorization. Your final determination must correspond to the preserved record.</p>
          </div>
        </aside>

        <div className="gateStack">
          {gates.map((gate, index) => {
            const record = activeRecord.gates[gate.id];
            return (
              <article className={`gateCard state-${record.state.toLowerCase()}`} key={gate.id}>
                <div className="gateHeader">
                  <div className="gateIndex">{String(index + 1).padStart(2, "0")}</div>
                  <div><p>{gate.anchor}</p><h3>{gate.title}</h3><span>{gate.question}</span></div>
                </div>
                <div className="guidance"><p><strong>Support requires:</strong> {gate.support}</p><p><strong>Failure condition:</strong> {gate.failure}</p></div>
                <div className="stateButtons">
                  {(["SUPPORTED", "DEFECT", "UNRESOLVED", "NOT_REVIEWED"] as GateState[]).map((state) => (
                    <button type="button" key={state} className={record.state === state ? "selected" : ""} onClick={() => updateGate(gate.id, { state })}>{state.replace("_", " ")}</button>
                  ))}
                </div>
                <label>Validation note
                  <textarea value={record.note} onChange={(e) => updateGate(gate.id, { note: e.target.value })} placeholder="Preserve the evidence, source, limitation, conflict, or unresolved question supporting this state." />
                </label>
              </article>
            );
          })}
        </div>
      </section>

      <section className="determinationPanel">
        <div className="determinationIntro">
          <p className="eyebrow">Final route determination</p>
          <h2>What has this route earned the right to do?</h2>
          <p>Select the result supported by the completed validation record—not the result the requester prefers.</p>
        </div>
        <div className="decisionGrid">
          {(["ALLOW", "HOLD", "DENY", "ESCALATE"] as Decision[]).map((decision) => (
            <button type="button" key={decision} className={activeRecord.decision === decision ? "selected" : ""} onClick={() => updateRecord((record) => ({ ...record, decision, completed: false }))}>
              <strong>{decision}</strong>
              <span>{decision === "ALLOW" && "Every required condition is affirmatively supported."}{decision === "HOLD" && "A correctable evidentiary or continuity defect remains."}{decision === "DENY" && "The action is outside admissible or lawful execution."}{decision === "ESCALATE" && "A qualified authority must resolve or rebind the route."}</span>
            </button>
          ))}
        </div>
        <div className="textGrid">
          <label>Decision rationale<textarea value={activeRecord.rationale} onChange={(e) => updateRecord((record) => ({ ...record, rationale: e.target.value, completed: false }))} placeholder="Explain how the evidence and gate states support the selected determination." /></label>
          <label>Required remediation or next action<textarea value={activeRecord.remediation} onChange={(e) => updateRecord((record) => ({ ...record, remediation: e.target.value }))} placeholder="Define what must occur before the route can be reconsidered or executed." /></label>
        </div>

        {decisionConflict && <div className="warning"><strong>Decision conflict detected.</strong><p>Your selected determination differs from the workshop reference determination. Recheck the route or preserve a defensible reason for the difference.</p></div>}

        <div className="actionRow">
          <button type="button" className="primary" onClick={finalizeReview} disabled={counts.reviewed < gates.length || !activeRecord.decision || !activeRecord.rationale.trim()}>{activeRecord.completed ? "Validation completed" : "Complete validation"}</button>
          <button type="button" onClick={() => setShowAnswer((current) => !current)}>{showAnswer ? "Hide reference analysis" : "Reveal reference analysis"}</button>
          <button type="button" onClick={exportRecord} disabled={!activeRecord.completed}>Export governed record</button>
          <button type="button" className="danger" onClick={resetMission}>Reset mission</button>
        </div>
        {exportMessage && <p className="exportMessage">{exportMessage}</p>}

        {showAnswer && <article className="referenceAnswer"><span>Reference determination</span><strong>{activeScenario.expectedDecision}</strong><p>{activeScenario.rationale}</p></article>}
      </section>

      <section className="completionBand">
        <div><p className="eyebrow">Workshop progression</p><h2>{completedMissions === scenarios.length ? "Route validation workshop complete." : "Continue until every mission produces a preserved determination."}</h2></div>
        <div className="footerLinks"><Link href="/academy/route-construction-lab">← Route Construction Lab</Link><Link href="/academy/review">Continue to Review Workspace →</Link></div>
      </section>

      <style jsx>{`
        :global(*){box-sizing:border-box} :global(body){margin:0;background:#05080d;color:#edf4f7;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .pageShell{min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at top left,rgba(49,173,194,.12),transparent 32%),linear-gradient(180deg,#071018 0%,#05080d 58%,#080d12 100%)}
        .ambient{position:fixed;border-radius:999px;filter:blur(120px);pointer-events:none;opacity:.28}.ambientOne{width:360px;height:360px;background:#16a0b8;top:110px;right:-120px}.ambientTwo{width:280px;height:280px;background:#b7832f;bottom:40px;left:-100px}
        .topbar{max-width:1500px;margin:auto;padding:24px 38px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,.08);position:relative;z-index:2}.brand{display:flex;gap:14px;align-items:center;text-decoration:none;color:#fff}.brandMark{display:grid;place-items:center;width:58px;height:58px;border:1px solid rgba(117,222,232,.5);background:rgba(15,88,99,.32);font-weight:900;letter-spacing:.05em}.brand strong,.brand small{display:block}.brand strong{font-size:16px;letter-spacing:.18em;text-transform:uppercase}.brand small{margin-top:4px;color:#8da5af}.topbar nav{display:flex;gap:9px;flex-wrap:wrap}.topbar nav a,.footerLinks a{color:#b8cad1;text-decoration:none;border:1px solid rgba(255,255,255,.1);padding:10px 14px;border-radius:999px;font-size:13px}.topbar nav a:hover,.footerLinks a:hover{color:#fff;border-color:#48c5d2}
        .hero{max-width:1500px;margin:auto;padding:78px 38px 46px;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,.5fr);gap:48px;align-items:end;position:relative;z-index:1}.eyebrow{text-transform:uppercase;letter-spacing:.2em;color:#65d3dc;font-size:12px;font-weight:800;margin:0 0 13px}.hero h1{font-size:clamp(44px,6vw,84px);line-height:.96;max-width:1050px;margin:0;letter-spacing:-.055em}.hero h1 em{font-style:normal;color:#79d9df}.heroCopy{font-size:18px;line-height:1.75;color:#a9bdc5;max-width:950px;margin:28px 0 0}.heroRule{border:1px solid rgba(103,211,220,.26);background:rgba(8,22,29,.74);padding:27px;box-shadow:0 24px 80px rgba(0,0,0,.28)}.heroRule span{display:block;text-transform:uppercase;letter-spacing:.17em;color:#78939d;font-size:11px}.heroRule strong{display:block;margin:15px 0;font-size:22px;line-height:1.35}.heroRule p{margin:0;color:#65d3dc}
        .missionTabs{max-width:1500px;margin:0 auto;padding:0 38px 34px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.missionTabs button{display:flex;text-align:left;align-items:center;gap:13px;padding:16px;border:1px solid rgba(255,255,255,.1);background:rgba(10,17,23,.72);color:#c8d5da;cursor:pointer}.missionTabs button.active{border-color:#59ccd6;background:rgba(28,111,122,.24);color:#fff}.missionTabs button>span{color:#58c9d4;font-size:12px}.missionTabs button div{min-width:0;flex:1}.missionTabs strong,.missionTabs small{display:block}.missionTabs strong{font-size:13px}.missionTabs small{margin-top:5px;color:#758b94;font-size:11px}.missionTabs b{color:#7de59e}
        .missionBrief{max-width:1424px;margin:0 auto 28px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(135deg,rgba(14,27,36,.95),rgba(8,14,20,.95));padding:32px}.missionBrief h2{font-size:34px;margin:0 0 12px}.request{font-size:19px;color:#c8d7dc;line-height:1.6}.briefColumns{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:26px}.briefColumns article{border:1px solid rgba(255,255,255,.09);background:rgba(0,0,0,.16);padding:21px}.briefColumns h3{margin:0 0 13px;font-size:15px;color:#7ad6dd}.briefColumns ul{margin:0;padding-left:20px;color:#aebfc6;line-height:1.65}.defectBrief{border-color:rgba(224,155,69,.24)!important}.defectBrief h3{color:#e4ad61}.defectBrief p{color:#aebfc6;line-height:1.65}
        .workshopGrid{max-width:1424px;margin:0 auto;display:grid;grid-template-columns:300px minmax(0,1fr);gap:22px;align-items:start}.progressPanel{position:sticky;top:18px;border:1px solid rgba(255,255,255,.1);background:rgba(7,14,20,.92);padding:24px}.progressNumber strong{display:block;font-size:48px}.progressNumber span{color:#849aa3;font-size:12px}.track{height:7px;background:#131e25;margin:20px 0;overflow:hidden}.track span{display:block;height:100%;background:linear-gradient(90deg,#2ba8b6,#78dde3)}.metricGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.metricGrid div{padding:11px 6px;text-align:center;background:#0b151c;border:1px solid rgba(255,255,255,.07)}.metricGrid strong,.metricGrid span{display:block}.metricGrid span{font-size:9px;text-transform:uppercase;color:#778b94;margin-top:4px}.reviewerField{display:block;margin-top:22px;color:#91a6ae;font-size:12px}.reviewerField input{width:100%;margin-top:8px;padding:12px;background:#071016;border:1px solid rgba(255,255,255,.12);color:#fff}.statusRule{margin-top:18px;padding:17px;border-left:3px solid #d89e4b;background:rgba(198,132,39,.08)}.statusRule strong{font-size:14px}.statusRule p{font-size:12px;color:#8da1a9;line-height:1.55;margin-bottom:0}
        .gateStack{display:grid;gap:14px}.gateCard{border:1px solid rgba(255,255,255,.1);background:rgba(9,16,22,.88);padding:25px;transition:.2s}.gateCard.state-supported{border-color:rgba(72,193,126,.38)}.gateCard.state-defect{border-color:rgba(228,94,87,.45)}.gateCard.state-unresolved{border-color:rgba(226,164,73,.45)}.gateHeader{display:grid;grid-template-columns:50px 1fr;gap:16px}.gateIndex{width:48px;height:48px;display:grid;place-items:center;background:#0d222a;border:1px solid rgba(77,198,210,.27);color:#66d1da;font-size:12px}.gateHeader p{margin:0 0 4px;color:#64d0da;font-size:11px;letter-spacing:.16em;text-transform:uppercase}.gateHeader h3{margin:0;font-size:21px}.gateHeader span{display:block;color:#9cb0b8;margin-top:9px;line-height:1.55}.guidance{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:19px 0}.guidance p{margin:0;padding:14px;background:#081118;color:#879ca5;font-size:12px;line-height:1.55}.guidance strong{color:#c9d7dc}.stateButtons{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.stateButtons button,.actionRow button{border:1px solid rgba(255,255,255,.12);background:#0a151c;color:#9db0b7;padding:11px;cursor:pointer;font-size:11px;font-weight:800}.stateButtons button.selected{border-color:#5ed0d9;color:#fff;background:rgba(44,148,159,.22)}.gateCard label,.textGrid label{display:block;margin-top:16px;color:#8fa4ac;font-size:12px}.gateCard textarea,.textGrid textarea{width:100%;min-height:92px;margin-top:8px;padding:13px;resize:vertical;background:#060d12;border:1px solid rgba(255,255,255,.12);color:#edf4f7;line-height:1.55}
        .determinationPanel{max-width:1424px;margin:30px auto 0;padding:34px;border:1px solid rgba(99,209,219,.22);background:linear-gradient(145deg,rgba(13,31,39,.96),rgba(7,12,17,.96))}.determinationIntro{max-width:900px}.determinationIntro h2{font-size:38px;margin:0 0 10px}.determinationIntro>p:last-child{color:#9db0b8;line-height:1.65}.decisionGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:27px 0}.decisionGrid button{text-align:left;padding:19px;border:1px solid rgba(255,255,255,.11);background:#081118;color:#a9bac1;cursor:pointer}.decisionGrid button.selected{border-color:#5ed2dc;background:rgba(34,138,149,.23);color:#fff}.decisionGrid strong,.decisionGrid span{display:block}.decisionGrid strong{font-size:17px}.decisionGrid span{font-size:11px;line-height:1.5;margin-top:8px;color:#8499a2}.textGrid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.textGrid textarea{min-height:135px}.warning{margin-top:18px;border-left:4px solid #e09f43;background:rgba(204,132,37,.1);padding:18px}.warning p{margin:6px 0 0;color:#aebec4}.actionRow{display:flex;gap:9px;flex-wrap:wrap;margin-top:23px}.actionRow button{padding:13px 17px}.actionRow button.primary{background:#55cbd4;color:#041013;border-color:#55cbd4}.actionRow button.danger{border-color:rgba(225,87,82,.35);color:#e89b97}.actionRow button:disabled{opacity:.35;cursor:not-allowed}.exportMessage{color:#76dda0}.referenceAnswer{margin-top:22px;padding:24px;border:1px solid rgba(117,222,154,.3);background:rgba(37,118,73,.1)}.referenceAnswer span,.referenceAnswer strong{display:block}.referenceAnswer span{font-size:11px;text-transform:uppercase;letter-spacing:.18em;color:#77dda0}.referenceAnswer strong{font-size:30px;margin:7px 0}.referenceAnswer p{color:#aec2b5;line-height:1.65}.completionBand{max-width:1424px;margin:28px auto 0;padding:32px 0 54px;display:flex;justify-content:space-between;gap:20px;align-items:end}.completionBand h2{margin:0;max-width:850px}.footerLinks{display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end}
        @media(max-width:1050px){.hero,.workshopGrid{grid-template-columns:1fr}.progressPanel{position:relative;top:auto}.missionTabs{grid-template-columns:1fr 1fr}.briefColumns,.textGrid{grid-template-columns:1fr}.hero{padding-top:52px}.heroRule{max-width:480px}}
        @media(max-width:720px){.topbar{padding:18px;align-items:flex-start}.topbar nav{display:none}.hero,.missionTabs{padding-left:18px;padding-right:18px}.missionTabs{grid-template-columns:1fr}.missionBrief,.workshopGrid,.determinationPanel,.completionBand{margin-left:18px;margin-right:18px}.missionBrief,.determinationPanel{padding:22px}.guidance,.decisionGrid,.stateButtons{grid-template-columns:1fr}.completionBand{align-items:flex-start;flex-direction:column}.footerLinks{justify-content:flex-start}.hero h1{font-size:45px}.missionBrief h2,.determinationIntro h2{font-size:28px}.gateCard{padding:18px}.gateHeader{grid-template-columns:1fr}.gateIndex{width:40px;height:40px}}
      `}</style>
    </main>
  );
}
