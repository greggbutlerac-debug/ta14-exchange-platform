"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type StageKey =
  | "reality"
  | "record"
  | "continuity"
  | "admissibility"
  | "binding"
  | "commit"
  | "execution"
  | "outcome";

type RouteStatus = "DRAFT" | "HOLD" | "READY_FOR_TEST";

type Stage = {
  key: StageKey;
  number: string;
  label: string;
  userTitle: string;
  description: string;
  placeholder: string;
  value: string;
};

type RouteTemplate = {
  label: string;
  domain: string;
  owner: string;
  stages: Partial<Record<StageKey, string>>;
};

const stageDefinitions: Omit<Stage, "value">[] = [
  {
    key: "reality",
    number: "01",
    label: "Reality",
    userTitle: "What consequence are you trying to create?",
    description:
      "Describe the real-world condition and the action being proposed. State only what is known.",
    placeholder:
      "Example: Pay supplier invoice INV-2048 for equipment delivered to the organization.",
  },
  {
    key: "record",
    number: "02",
    label: "Record",
    userTitle: "What evidence supports this request?",
    description:
      "Identify the durable records that establish the facts behind the proposed consequence.",
    placeholder:
      "Example: Signed invoice, purchase order, delivery confirmation, supplier identity record, and approval evidence.",
  },
  {
    key: "continuity",
    number: "03",
    label: "Continuity",
    userTitle: "How will the evidence remain trustworthy?",
    description:
      "Explain how origin, custody, timestamps, transformations, dependencies, and versions remain provable.",
    placeholder:
      "Example: Preserve source hashes, timestamps, signer identities, dependency references, and every superseded version.",
  },
  {
    key: "admissibility",
    number: "04",
    label: "Admissibility",
    userTitle: "What must be true before the route may proceed?",
    description:
      "Define the evidence, authority, policy, safety, and timing requirements the engine must evaluate.",
    placeholder:
      "Example: The invoice must match the purchase order, delivery must be confirmed, and the required approval threshold must be satisfied.",
  },
  {
    key: "binding",
    number: "05",
    label: "Binding",
    userTitle: "Who and what must be bound to this route?",
    description:
      "Bind the actor, authority, beneficiary, destination, object, system, and operating environment.",
    placeholder:
      "Example: Bind finance actor A-17, policy AP-4, supplier S-91, invoice INV-2048, approved bank destination, amount, currency, and payment environment.",
  },
  {
    key: "commit",
    number: "06",
    label: "Commit",
    userTitle: "What exact route state must be frozen?",
    description:
      "Define the canonical route object that cannot silently change after an admissibility decision.",
    placeholder:
      "Example: Freeze the route payload, evidence set, authority receipt, bindings, decision, expiry boundary, and route digest.",
  },
  {
    key: "execution",
    number: "07",
    label: "Execution",
    userTitle: "What action may actually occur?",
    description:
      "State the permitted action and how execution correspondence will be checked against the committed route.",
    placeholder:
      "Example: Release only the committed amount and currency to the bound destination when the execution payload matches the committed digest.",
  },
  {
    key: "outcome",
    number: "08",
    label: "Outcome",
    userTitle: "What will prove what actually happened?",
    description:
      "Identify the authoritative outcome artifact and the correspondence checks required after execution.",
    placeholder:
      "Example: Preserve the settlement receipt, trace identifier, final amount, destination confirmation, timestamp, and reconciliation result.",
  },
];

const initialStages: Stage[] = stageDefinitions.map((stage) => ({
  ...stage,
  value: "",
}));

const templates: Record<string, RouteTemplate> = {
  "Vendor payment": {
    label: "Vendor payment",
    domain: "Finance",
    owner: "Finance Operations",
    stages: {
      reality:
        "An approved supplier invoice exists for goods or services received by the organization.",
      record:
        "Invoice, purchase order, delivery confirmation, supplier identity record, and approval evidence.",
      continuity:
        "Preserve source digests, timestamps, signer identities, dependency references, and every superseded route version.",
      admissibility:
        "The invoice must match the purchase order, delivery must be confirmed, the supplier must be active, beneficiary identity must be verified, and approval must satisfy the payment threshold.",
      binding:
        "Bind the requesting actor, procurement authority, finance authority, supplier beneficiary, bank destination, invoice, amount, currency, and production payment environment.",
      commit:
        "Freeze the canonical payment route, evidence dependency set, decision receipt, bindings, expiry boundary, and route digest.",
      execution:
        "Release only the committed amount and currency to the bound beneficiary through the approved payment rail when execution correspondence is confirmed.",
      outcome:
        "Verify settlement using the processor receipt, bank trace, settled amount, destination confirmation, timestamp, and reconciliation result.",
    },
  },
  "AI agent action": {
    label: "AI agent action",
    domain: "AI Governance",
    owner: "AI Governance Team",
    stages: {
      reality:
        "An AI agent has proposed a consequence-bearing action in an operating environment.",
      record:
        "Prompt context, model and tool identifiers, retrieved evidence, proposed action payload, policy inputs, and affected resources.",
      continuity:
        "Preserve provenance for every input, transformation, model invocation, tool call, correction, and route version.",
      admissibility:
        "Required evidence must be complete, current, attributable, policy-conforming, and sufficient for the proposed consequence.",
      binding:
        "Bind the agent, delegated authority, affected party, tool destination, action object, model version, and execution environment.",
      commit:
        "Freeze the exact action payload, evidence dependency graph, authority receipt, admissibility decision, and cryptographic route identity.",
      execution:
        "Permit only tool calls whose actor, arguments, destination, timing, and environment correspond to the committed route.",
      outcome:
        "Capture authoritative tool and system receipts, resulting state, affected resources, exceptions, and independent verification status.",
    },
  },
  "HVAC intervention": {
    label: "HVAC intervention",
    domain: "HVAC",
    owner: "Field Operations",
    stages: {
      reality:
        "A measurable operating condition indicates that an HVAC system may require intervention.",
      record:
        "Analyzer measurements, equipment identity, ambient conditions, electrical readings, airflow evidence, refrigerant data, and video.",
      continuity:
        "Bind measurements to instrument identity, calibration state, technician, property, timestamps, media, and preserved revisions.",
      admissibility:
        "The non-invasive evidence threshold must establish that intervention is justified and that required safety conditions are satisfied.",
      binding:
        "Bind the technician, company authority, equipment, property, intervention type, governed tools, refrigerant container, and environmental conditions.",
      commit:
        "Freeze the diagnostic determination, supporting evidence, authorized intervention, limits, material identity, and route digest.",
      execution:
        "Allow only the authorized intervention within committed limits while recording measurements and governed material movement.",
      outcome:
        "Verify post-intervention performance, final readings, material balance, equipment response, technician record, and property outcome.",
    },
  },
};

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "untitled-route"
  );
}

function stageState(stage: Stage): "COMPLETE" | "UNKNOWN" {
  return stage.value.trim() ? "COMPLETE" : "UNKNOWN";
}

export default function BuildRoutePage() {
  const [routeName, setRouteName] = useState(
    "Untitled governance route",
  );
  const [domain, setDomain] = useState("AI Governance");
  const [owner, setOwner] = useState("UNKNOWN");
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [selected, setSelected] =
    useState<StageKey>("reality");
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentIndex = stages.findIndex(
    (stage) => stage.key === selected,
  );

  const current = stages[currentIndex] ?? stages[0];

  const completed = stages.filter(
    (stage) => stage.value.trim().length > 0,
  ).length;

  const missing = stages
    .filter((stage) => !stage.value.trim())
    .map((stage) => stage.label);

  const progress = Math.round((completed / 8) * 100);

  const status: RouteStatus =
    completed === 8
      ? "READY_FOR_TEST"
      : completed >= 4
        ? "HOLD"
        : "DRAFT";

  const route = useMemo(
    () => ({
      schema: "TA14_ROUTE_DRAFT_V1",
      routeId: `draft:${slugify(routeName)}`,
      status,
      metadata: {
        name:
          routeName.trim() || "Untitled governance route",
        domain: domain.trim() || "UNKNOWN",
        owner: owner.trim() || "UNKNOWN",
        version: 1,
      },
      chain: Object.fromEntries(
        stages.map((stage) => [
          stage.key,
          stage.value.trim() || "UNKNOWN",
        ]),
      ),
      readiness: {
        completedStages: completed,
        totalStages: 8,
        missingStages: missing,
        nextAction:
          completed === 8
            ? "SUBMIT_TO_SANDBOX"
            : "COMPLETE_ROUTE_DEFINITION",
      },
      governingPrinciple:
        "No admissible evidence. No admissible execution.",
    }),
    [
      completed,
      domain,
      missing,
      owner,
      routeName,
      stages,
      status,
    ],
  );

  function updateCurrent(value: string) {
    setStages((items) =>
      items.map((stage) =>
        stage.key === selected
          ? { ...stage, value }
          : stage,
      ),
    );
  }

  function selectTemplate(name: string) {
    const template = templates[name];

    setRouteName(template.label);
    setDomain(template.domain);
    setOwner(template.owner);
    setStages((items) =>
      items.map((stage) => ({
        ...stage,
        value:
          template.stages[stage.key] ?? stage.value,
      })),
    );
    setSelected("reality");
    setShowJson(false);
  }

  function clearRoute() {
    setRouteName("Untitled governance route");
    setDomain("AI Governance");
    setOwner("UNKNOWN");
    setStages(initialStages);
    setSelected("reality");
    setShowJson(false);
    setCopied(false);
  }

  function goPrevious() {
    if (currentIndex > 0) {
      setSelected(stages[currentIndex - 1].key);
    }
  }

  function goNext() {
    if (currentIndex < stages.length - 1) {
      setSelected(stages[currentIndex + 1].key);
    }
  }

  function downloadDraft() {
    const blob = new Blob(
      [JSON.stringify(route, null, 2)],
      {
        type: "application/json",
      },
    );

    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = href;
    anchor.download = `${slugify(routeName)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(href);
  }

  async function copyJson() {
    await navigator.clipboard.writeText(
      JSON.stringify(route, null, 2),
    );

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1600);
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">
            TA-14 Exchange · Route construction
          </p>
          <h1>Build a Governed Route</h1>
          <p className="intro">
            Define the consequence, supporting evidence,
            authority, binding, execution, and outcome. The
            canonical chain updates as the route becomes
            complete.
          </p>
        </div>

        <div className="topActions">
          <Link href="/workspace/discover" className="textButton">
            ← Discovery
          </Link>

          <button
            type="button"
            className="textButton"
            onClick={() => setShowJson((value) => !value)}
          >
            {showJson ? "Hide JSON" : "Preview JSON"}
          </button>

          <button
            type="button"
            className="textButton"
            onClick={downloadDraft}
          >
            Download draft
          </button>

          <button
            type="button"
            className="dangerButton"
            onClick={clearRoute}
          >
            Clear
          </button>
        </div>
      </header>

      <section className="identityGrid">
        <label>
          <span>Route name</span>
          <input
            value={routeName}
            onChange={(event) =>
              setRouteName(event.target.value)
            }
          />
        </label>

        <label>
          <span>Domain</span>
          <input
            value={domain}
            onChange={(event) =>
              setDomain(event.target.value)
            }
          />
        </label>

        <label>
          <span>Route owner</span>
          <input
            value={owner}
            onChange={(event) =>
              setOwner(event.target.value)
            }
          />
        </label>

        <div className="statusCard">
          <span>Construction state</span>
          <strong data-state={status}>{status}</strong>
        </div>
      </section>

      <section className="workspace">
        <aside className="chainPanel">
          <div className="panelHeading">
            <div>
              <p className="eyebrow">Canonical chain</p>
              <h2>Execution progress</h2>
            </div>

            <strong>{progress}%</strong>
          </div>

          <div className="progressTrack">
            <div
              className="progressFill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="chain">
            {stages.map((stage) => {
              const isSelected = stage.key === selected;
              const state = stageState(stage);

              return (
                <button
                  key={stage.key}
                  type="button"
                  className={`chainStage ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => setSelected(stage.key)}
                >
                  <span className="stageNumber">
                    {stage.number}
                  </span>

                  <span className="stageName">
                    {stage.label}
                  </span>

                  <span
                    className={`stageState ${state.toLowerCase()}`}
                  >
                    {state === "COMPLETE" ? "✓" : "○"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="principle">
            <span>Governing principle</span>
            <strong>
              No admissible evidence. No admissible execution.
            </strong>
          </div>
        </aside>

        <section className="editorPanel">
          <div className="stageMeta">
            <div>
              <p className="eyebrow">
                Stage {current.number}
              </p>
              <h2>{current.label}</h2>
            </div>

            <span>
              {currentIndex + 1} / {stages.length}
            </span>
          </div>

          <div className="questionBlock">
            <h3>{current.userTitle}</h3>
            <p>{current.description}</p>
          </div>

          <textarea
            value={current.value}
            onChange={(event) =>
              updateCurrent(event.target.value)
            }
            placeholder={current.placeholder}
            rows={10}
          />

          <div className="ruleCard">
            <strong>Rule</strong>
            <p>
              Do not invent missing facts. Define the required
              proof, binding, authority, or correspondence.
              Unsupported values remain UNKNOWN until evidence
              resolves them.
            </p>
          </div>

          <div className="editorActions">
            <button
              type="button"
              className="secondaryButton"
              onClick={goPrevious}
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>

            {currentIndex < stages.length - 1 ? (
              <button
                type="button"
                className="primaryButton"
                onClick={goNext}
              >
                Next stage →
              </button>
            ) : (
              <Link
                href="/workspace/routes/new"
                className="primaryButton linkButton"
              >
                Evaluate route →
              </Link>
            )}
          </div>
        </section>

        <aside className="readinessPanel">
          <p className="eyebrow">Construction readiness</p>

          <div className="score">
            <strong>{completed}</strong>
            <span>of 8 stages defined</span>
          </div>

          <div className="metric">
            <span>Schema</span>
            <strong>ROUTE_DRAFT_V1</strong>
          </div>

          <div className="metric">
            <span>Version</span>
            <strong>1</strong>
          </div>

          <div className="metric">
            <span>Unknown stages</span>
            <strong>{8 - completed}</strong>
          </div>

          <div className="metric">
            <span>Next action</span>
            <strong>
              {completed === 8 ? "EVALUATE" : "COMPLETE"}
            </strong>
          </div>

          {missing.length > 0 ? (
            <div className="missingBlock">
              <span>Unresolved stages</span>

              <div>
                {missing.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      const stage = stages.find(
                        (item) => item.label === label,
                      );

                      if (stage) {
                        setSelected(stage.key);
                      }
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="readyCard">
              <strong>Route definition complete</strong>
              <p>
                All eight stages are defined. Submit the route
                to the live engine for an admissibility
                determination.
              </p>

              <Link href="/workspace/routes/new">
                Evaluate route →
              </Link>
            </div>
          )}
        </aside>
      </section>

      <section className="templates">
        <div>
          <p className="eyebrow">Guided starting points</p>
          <h2>Start from a template</h2>
          <p>
            Templates provide declared route content only. They
            do not prove that evidence exists or that authority
            is valid.
          </p>
        </div>

        <div className="templateGrid">
          {Object.keys(templates).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => selectTemplate(name)}
            >
              <span>{name}</span>
              <strong>Load route →</strong>
            </button>
          ))}
        </div>
      </section>

      {showJson ? (
        <section className="jsonPanel">
          <div className="jsonHeader">
            <div>
              <p className="eyebrow">Canonical draft</p>
              <h2>Route JSON</h2>
            </div>

            <button
              type="button"
              className="secondaryButton"
              onClick={copyJson}
            >
              {copied ? "Copied" : "Copy JSON"}
            </button>
          </div>

          <pre>{JSON.stringify(route, null, 2)}</pre>
        </section>
      ) : null}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          padding: 42px;
          background:
            radial-gradient(
              circle at top right,
              rgba(49, 209, 158, 0.09),
              transparent 30%
            ),
            #f5f7f8;
          color: #10201a;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 28px;
          max-width: 1480px;
          margin: 0 auto 28px;
        }

        .eyebrow {
          margin: 0 0 9px;
          color: #0f7c5c;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          margin-bottom: 12px;
          font-size: clamp(36px, 5vw, 64px);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .intro {
          max-width: 760px;
          margin-bottom: 0;
          color: #5b6b64;
          font-size: 17px;
          line-height: 1.65;
        }

        .topActions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }

        .textButton,
        .dangerButton,
        .secondaryButton,
        .primaryButton {
          border-radius: 11px;
          text-decoration: none;
          cursor: pointer;
        }

        .textButton,
        .dangerButton {
          padding: 11px 14px;
          border: 1px solid #dce4df;
          background: white;
          color: #263c33;
          font-size: 13px;
          font-weight: 800;
        }

        .dangerButton {
          color: #a33b3b;
        }

        .identityGrid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 0.8fr;
          gap: 14px;
          max-width: 1480px;
          margin: 0 auto 18px;
        }

        .identityGrid label,
        .statusCard {
          padding: 16px;
          border: 1px solid #dde5e0;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.92);
        }

        .identityGrid label span,
        .statusCard span {
          display: block;
          margin-bottom: 8px;
          color: #718078;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .identityGrid input {
          width: 100%;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #12251c;
          font-weight: 800;
        }

        .statusCard strong {
          display: inline-flex;
          padding: 7px 10px;
          border-radius: 999px;
          background: #edf2ef;
          font-size: 12px;
          letter-spacing: 0.06em;
        }

        .statusCard strong[data-state="HOLD"] {
          background: #fff3d7;
          color: #8d5d00;
        }

        .statusCard strong[data-state="READY_FOR_TEST"] {
          background: #dcf8eb;
          color: #08724f;
        }

        .workspace {
          display: grid;
          grid-template-columns: 290px minmax(0, 1fr) 285px;
          gap: 18px;
          max-width: 1480px;
          margin: 0 auto;
        }

        .chainPanel,
        .editorPanel,
        .readinessPanel,
        .templates,
        .jsonPanel {
          border: 1px solid #dce4df;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 20px 60px rgba(20, 47, 36, 0.06);
        }

        .chainPanel,
        .readinessPanel {
          padding: 20px;
        }

        .panelHeading,
        .stageMeta,
        .jsonHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .panelHeading h2,
        .stageMeta h2,
        .jsonHeader h2 {
          margin-bottom: 0;
          font-size: 21px;
          letter-spacing: -0.03em;
        }

        .panelHeading > strong {
          color: #0f7c5c;
          font-size: 22px;
        }

        .progressTrack {
          height: 7px;
          margin: 18px 0;
          overflow: hidden;
          border-radius: 999px;
          background: #e8eeea;
        }

        .progressFill {
          height: 100%;
          border-radius: inherit;
          background: #14946d;
          transition: width 180ms ease;
        }

        .chain {
          display: grid;
          gap: 7px;
        }

        .chainStage {
          display: grid;
          grid-template-columns: 36px 1fr 26px;
          align-items: center;
          width: 100%;
          padding: 12px;
          border: 1px solid transparent;
          border-radius: 12px;
          background: transparent;
          color: #52615a;
          text-align: left;
          cursor: pointer;
        }

        .chainStage:hover {
          background: #f4f8f6;
        }

        .chainStage.selected {
          border-color: #bcded0;
          background: #eaf7f2;
          color: #10251c;
        }

        .stageNumber {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .stageName {
          font-weight: 800;
        }

        .stageState {
          display: grid;
          width: 24px;
          height: 24px;
          place-items: center;
          border-radius: 50%;
          font-weight: 900;
        }

        .stageState.complete {
          background: #d9f5e9;
          color: #08724f;
        }

        .stageState.unknown {
          background: #edf1ef;
          color: #8a9690;
        }

        .principle {
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid #e3e9e5;
        }

        .principle span {
          display: block;
          margin-bottom: 7px;
          color: #7a8781;
          font-size: 11px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .principle strong {
          font-size: 13px;
          line-height: 1.45;
        }

        .editorPanel {
          padding: 28px;
        }

        .stageMeta > span {
          padding: 8px 11px;
          border-radius: 999px;
          background: #eff4f1;
          color: #52615a;
          font-size: 12px;
          font-weight: 850;
        }

        .questionBlock {
          max-width: 760px;
          margin: 38px 0 22px;
        }

        .questionBlock h3 {
          margin-bottom: 12px;
          font-size: clamp(27px, 4vw, 43px);
          line-height: 1.05;
          letter-spacing: -0.045em;
        }

        .questionBlock p {
          margin-bottom: 0;
          color: #627169;
          font-size: 16px;
          line-height: 1.65;
        }

        textarea {
          width: 100%;
          min-height: 250px;
          padding: 20px;
          resize: vertical;
          border: 1px solid #cfd9d3;
          border-radius: 15px;
          outline: none;
          background: #fbfcfb;
          color: #14251d;
          font-size: 16px;
          line-height: 1.65;
        }

        textarea:focus {
          border-color: #4fae8d;
          box-shadow: 0 0 0 4px rgba(79, 174, 141, 0.12);
        }

        .ruleCard {
          margin-top: 16px;
          padding: 16px 18px;
          border: 1px solid #e1e7e3;
          border-radius: 13px;
          background: #f7f9f8;
        }

        .ruleCard strong {
          display: block;
          margin-bottom: 5px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .ruleCard p {
          margin-bottom: 0;
          color: #68766f;
          font-size: 13px;
          line-height: 1.6;
        }

        .editorActions {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          margin-top: 22px;
        }

        .secondaryButton,
        .primaryButton {
          padding: 13px 17px;
          border: 1px solid #ced8d2;
          background: white;
          color: #20382d;
          font-weight: 850;
        }

        .primaryButton {
          border-color: #123c2e;
          background: #123c2e;
          color: white;
        }

        .linkButton {
          display: inline-flex;
          align-items: center;
        }

        .secondaryButton:disabled {
          opacity: 0.38;
          cursor: not-allowed;
        }

        .readinessPanel > .eyebrow {
          margin-bottom: 22px;
        }

        .score {
          margin-bottom: 24px;
        }

        .score strong {
          display: block;
          font-size: 50px;
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .score span {
          color: #718078;
          font-size: 13px;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 0;
          border-top: 1px solid #e4eae6;
          font-size: 12px;
        }

        .metric span {
          color: #75827c;
        }

        .metric strong {
          text-align: right;
        }

        .missingBlock {
          margin-top: 20px;
        }

        .missingBlock > span {
          display: block;
          margin-bottom: 10px;
          color: #75827c;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .missingBlock > div {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .missingBlock button {
          padding: 8px 10px;
          border: 1px solid #e2e7e4;
          border-radius: 999px;
          background: #f6f8f7;
          color: #4e5e56;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .readyCard {
          margin-top: 20px;
          padding: 16px;
          border-radius: 14px;
          background: #eaf8f2;
        }

        .readyCard strong {
          display: block;
          margin-bottom: 7px;
        }

        .readyCard p {
          color: #4d685c;
          font-size: 13px;
          line-height: 1.55;
        }

        .readyCard a {
          color: #08724f;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .templates,
        .jsonPanel {
          max-width: 1480px;
          margin: 18px auto 0;
          padding: 26px;
        }

        .templates {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 28px;
        }

        .templates h2 {
          margin-bottom: 10px;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .templates p:last-child {
          margin-bottom: 0;
          color: #68766f;
          line-height: 1.6;
        }

        .templateGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .templateGrid button {
          display: flex;
          min-height: 125px;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          padding: 18px;
          border: 1px solid #d8e1dc;
          border-radius: 15px;
          background: #fbfcfb;
          color: #173128;
          text-align: left;
          cursor: pointer;
        }

        .templateGrid button:hover {
          border-color: #72b79e;
          background: #f0f8f5;
        }

        .templateGrid span {
          font-size: 17px;
          font-weight: 900;
        }

        .templateGrid strong {
          color: #0d7d5b;
          font-size: 12px;
        }

        .jsonPanel pre {
          max-height: 620px;
          overflow: auto;
          margin: 22px 0 0;
          padding: 22px;
          border-radius: 15px;
          background: #0f1c17;
          color: #dff6eb;
          font-size: 12px;
          line-height: 1.65;
        }

        @media (max-width: 1100px) {
          .identityGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .workspace {
            grid-template-columns: 240px minmax(0, 1fr);
          }

          .readinessPanel {
            grid-column: 1 / -1;
          }

          .templates {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .page {
            padding: 22px 14px;
          }

          .topbar {
            flex-direction: column;
          }

          .topActions {
            justify-content: flex-start;
          }

          .identityGrid,
          .workspace,
          .templates,
          .templateGrid {
            grid-template-columns: 1fr;
          }

          .chainPanel,
          .readinessPanel {
            grid-column: auto;
          }

          .chain {
            grid-template-columns: repeat(2, 1fr);
          }

          .editorPanel {
            padding: 20px;
          }

          .questionBlock {
            margin-top: 28px;
          }

          .editorActions {
            flex-direction: column;
          }

          .secondaryButton,
          .primaryButton {
            width: 100%;
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
