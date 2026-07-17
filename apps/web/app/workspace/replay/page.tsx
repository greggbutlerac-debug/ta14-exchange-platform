"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReplayState = "READY" | "INCOMPLETE" | "DIVERGENT" | "REVOKED";
type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

type ReplayStep = {
  stage:
    | "Reality"
    | "Record"
    | "Continuity"
    | "Admissibility"
    | "Binding"
    | "Commit"
    | "Execution"
    | "Outcome";
  expected: string;
  observed: string;
  matches: boolean;
};

type ReplayPackage = {
  replayId: string;
  routeId: string;
  routeName: string;
  routeVersion: string;
  receiptId: string;
  executionId: string;
  state: ReplayState;
  decision: Decision;
  createdAt: string;
  steps: ReplayStep[];
  notes: string[];
};

const packages: ReplayPackage[] = [
  {
    replayId: "TA14-REPLAY-72A91F",
    routeId: "TA14-RID-VP-0042",
    routeName: "Governed Vendor Payment",
    routeVersion: "3.1.0",
    receiptId: "TA14-RCPT-7C3A19",
    executionId: "TA14-EXEC-45B01E",
    state: "READY",
    decision: "ALLOW",
    createdAt: "2026-07-17T18:22:00.000Z",
    steps: [
      {
        stage: "Reality",
        expected: "Invoice INV-8841 for approved supplier",
        observed: "Invoice INV-8841 for approved supplier",
        matches: true,
      },
      {
        stage: "Record",
        expected: "Invoice, PO, supplier account, and approval record",
        observed: "Invoice, PO, supplier account, and approval record",
        matches: true,
      },
      {
        stage: "Continuity",
        expected: "Unbroken evidence and version lineage",
        observed: "Unbroken evidence and version lineage",
        matches: true,
      },
      {
        stage: "Admissibility",
        expected: "ALLOW before commit",
        observed: "ALLOW before commit",
        matches: true,
      },
      {
        stage: "Binding",
        expected: "Supplier, amount, account, and approver bound",
        observed: "Supplier, amount, account, and approver bound",
        matches: true,
      },
      {
        stage: "Commit",
        expected: "Commit digest sha256:11a4…8ef9",
        observed: "Commit digest sha256:11a4…8ef9",
        matches: true,
      },
      {
        stage: "Execution",
        expected: "$24,880 to account ending 7712",
        observed: "$24,880 to account ending 7712",
        matches: true,
      },
      {
        stage: "Outcome",
        expected: "Settlement receipt and ledger correspondence",
        observed: "Settlement receipt and ledger correspondence",
        matches: true,
      },
    ],
    notes: [
      "All preserved stages correspond to the admitted and committed route.",
      "Independent signature verification still requires trusted keys.",
    ],
  },
  {
    replayId: "TA14-REPLAY-219C4D",
    routeId: "TA14-RID-AI-0018",
    routeName: "Bounded AI Agent Action",
    routeVersion: "1.4.2",
    receiptId: "TA14-RCPT-4B88E1",
    executionId: "TA14-EXEC-0087AA",
    state: "DIVERGENT",
    decision: "HOLD",
    createdAt: "2026-07-17T17:52:00.000Z",
    steps: [
      {
        stage: "Reality",
        expected: "Customer requested refund review",
        observed: "Customer requested refund review",
        matches: true,
      },
      {
        stage: "Record",
        expected: "Order, payment, policy, and customer identity",
        observed: "Order, payment, and policy; customer identity UNKNOWN",
        matches: false,
      },
      {
        stage: "Continuity",
        expected: "Single policy version preserved",
        observed: "Policy changed after route construction",
        matches: false,
      },
      {
        stage: "Admissibility",
        expected: "HOLD pending identity and policy confirmation",
        observed: "HOLD pending identity and policy confirmation",
        matches: true,
      },
      {
        stage: "Binding",
        expected: "No refund tool invocation before clearance",
        observed: "Refund tool invoked against a different order ID",
        matches: false,
      },
      {
        stage: "Commit",
        expected: "No consequence-bearing commit",
        observed: "Commit token present but unsupported",
        matches: false,
      },
      {
        stage: "Execution",
        expected: "No execution",
        observed: "Refund attempted and rejected by processor",
        matches: false,
      },
      {
        stage: "Outcome",
        expected: "No financial consequence",
        observed: "No settlement occurred",
        matches: true,
      },
    ],
    notes: [
      "The attempted execution diverged from the admitted route.",
      "The preserved package is useful evidence of failure but is not a verified successful replay.",
    ],
  },
  {
    replayId: "TA14-REPLAY-CC5210",
    routeId: "TA14-RID-HVAC-0009",
    routeName: "Analyzer-Governed Refrigerant Intervention",
    routeVersion: "2.0.0",
    receiptId: "TA14-RCPT-2E913F",
    executionId: "UNKNOWN",
    state: "INCOMPLETE",
    decision: "ESCALATE",
    createdAt: "2026-07-17T15:20:00.000Z",
    steps: [
      {
        stage: "Reality",
        expected: "Bound equipment and observed operating condition",
        observed: "Bound equipment and observed operating condition",
        matches: true,
      },
      {
        stage: "Record",
        expected: "Analyzer evidence and technician identity",
        observed: "Analyzer evidence present; technician signature pending",
        matches: false,
      },
      {
        stage: "Continuity",
        expected: "Device, technician, and equipment lineage",
        observed: "Device and equipment lineage present",
        matches: false,
      },
      {
        stage: "Admissibility",
        expected: "ESCALATE pending trusted signing",
        observed: "ESCALATE pending trusted signing",
        matches: true,
      },
      {
        stage: "Binding",
        expected: "No intervention until signing completes",
        observed: "No intervention recorded",
        matches: true,
      },
      {
        stage: "Commit",
        expected: "No commit",
        observed: "No commit",
        matches: true,
      },
      {
        stage: "Execution",
        expected: "No execution",
        observed: "UNKNOWN",
        matches: false,
      },
      {
        stage: "Outcome",
        expected: "No outcome receipt",
        observed: "No outcome receipt",
        matches: true,
      },
    ],
    notes: [
      "The package is incomplete because execution correspondence cannot be established.",
      "UNKNOWN is preserved rather than converted into an assumed non-event.",
    ],
  },
];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "UNKNOWN";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function ReplayConsolePage() {
  const [selectedId, setSelectedId] = useState(packages[0].replayId);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<ReplayState | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return packages.filter((item) => {
      const matchesQuery =
        !needle ||
        [
          item.replayId,
          item.routeId,
          item.routeName,
          item.receiptId,
          item.executionId,
          item.routeVersion,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      const matchesState = state === "ALL" || item.state === state;
      return matchesQuery && matchesState;
    });
  }, [query, state]);

  const selected =
    packages.find((item) => item.replayId === selectedId) ??
    filtered[0] ??
    packages[0];

  const matchedStages = selected.steps.filter((step) => step.matches).length;
  const correspondence = Math.round(
    (matchedStages / selected.steps.length) * 100,
  );

  const replayReport = {
    schema: "TA14_REPLAY_REPORT_V1",
    generatedAt: new Date().toISOString(),
    replay: selected,
    correspondence: {
      matchedStages,
      totalStages: selected.steps.length,
      percentage: correspondence,
    },
    determination:
      selected.state === "READY"
        ? "The preserved route can be replayed as a corresponding sequence, subject to independent cryptographic verification."
        : "The preserved route cannot be treated as a fully corresponding replay.",
    limitation:
      "Replay correspondence does not by itself prove signature validity, source authenticity, or production authority. Those require trusted keys, canonical payloads, admissible evidence, and current revocation checks.",
  };

  async function copyReport() {
    await navigator.clipboard.writeText(
      JSON.stringify(replayReport, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="replay-page">
      <style>{`
        * { box-sizing: border-box; }

        .replay-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .replay-wrap {
          width: min(1380px, calc(100% - 48px));
          margin: 0 auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: clamp(32px, 5vw, 68px);
          border: 1px solid rgba(132, 177, 216, .16);
          border-radius: 34px;
          background:
            radial-gradient(circle at 86% 10%, rgba(57, 242, 161, .14), transparent 27%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "REPLAY";
          position: absolute;
          right: -8px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(6rem, 16vw, 14rem);
          font-weight: 1000;
          letter-spacing: -.1em;
          pointer-events: none;
        }

        .hero-content { position: relative; z-index: 1; max-width: 930px; }

        .eyebrow {
          margin: 0 0 17px;
          color: #68e8fb;
          font-size: .72rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          font-size: clamp(3.2rem, 7vw, 7rem);
          line-height: .92;
          letter-spacing: -.07em;
        }

        .gradient {
          color: transparent;
          background: linear-gradient(100deg, #fff, #8ceaff 52%, #53efae);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 820px;
          margin: 24px 0 0;
          color: #9eb4c8;
          font-size: 1.08rem;
          line-height: 1.75;
        }

        .hero-actions, .detail-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 28px;
        }

        .button, .button-secondary, .small-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 900;
          cursor: pointer;
          transition: transform .2s ease;
        }

        .button:hover, .button-secondary:hover, .small-button:hover {
          transform: translateY(-2px);
        }

        .button {
          min-height: 47px;
          padding: 0 19px;
          border: 0;
          color: #07100f;
          background: linear-gradient(100deg, #56e6ff, #53efae);
        }

        .button-secondary {
          min-height: 47px;
          padding: 0 19px;
          border: 1px solid rgba(136, 180, 219, .22);
          color: #dce9f5;
          background: rgba(7, 17, 29, .72);
        }

        .small-button {
          min-height: 40px;
          padding: 0 14px;
          border: 1px solid rgba(136, 180, 219, .2);
          color: #dce9f5;
          background: rgba(7, 17, 29, .75);
          font-size: .75rem;
        }

        .toolbar {
          display: grid;
          grid-template-columns: minmax(220px, 1fr) 210px;
          gap: 12px;
          margin: 22px 0;
          padding: 16px;
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 22px;
          background: rgba(7, 16, 27, .68);
        }

        input, select {
          width: 100%;
          min-height: 47px;
          padding: 0 15px;
          border: 1px solid rgba(135, 180, 220, .2);
          border-radius: 14px;
          outline: none;
          color: #edf6ff;
          background: rgba(2, 9, 16, .9);
          font: inherit;
        }

        .grid {
          display: grid;
          grid-template-columns: minmax(0, .72fr) minmax(0, 1.28fr);
          gap: 18px;
          align-items: start;
        }

        .panel {
          overflow: hidden;
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 25px;
          background: rgba(6, 15, 25, .8);
          box-shadow: 0 24px 80px rgba(0,0,0,.22);
        }

        .panel-head {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding: 19px 21px;
          border-bottom: 1px solid rgba(132, 177, 216, .12);
        }

        .replay-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .replay-row:last-child { border-bottom: 0; }

        .replay-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(57, 242, 161, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .route-name { font-weight: 900; }

        .mono {
          margin-top: 7px;
          color: #6edff4;
          font: 700 .72rem ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        .meta {
          margin-top: 12px;
          color: #8299ae;
          font-size: .74rem;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          min-height: 26px;
          padding: 0 9px;
          border: 1px solid rgba(135, 180, 220, .18);
          border-radius: 999px;
          color: #b9c9d8;
          background: rgba(8, 18, 30, .72);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .07em;
        }

        .pill.READY { color: #54efae; border-color: rgba(84, 239, 174, .3); }
        .pill.INCOMPLETE { color: #ffd27b; border-color: rgba(255, 210, 123, .3); }
        .pill.DIVERGENT { color: #ff9d8e; border-color: rgba(255, 157, 142, .3); }
        .pill.REVOKED { color: #ff8e9b; border-color: rgba(255, 142, 155, .3); }

        .detail { padding: 25px; }

        .detail-top { justify-content: space-between; }

        .detail h2 {
          margin: 19px 0 7px;
          font-size: 1.9rem;
          letter-spacing: -.04em;
        }

        .detail p {
          color: #94aabd;
          line-height: 1.7;
        }

        .score-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: end;
          margin-top: 20px;
        }

        .score {
          font-size: 3.8rem;
          font-weight: 950;
          letter-spacing: -.08em;
        }

        .score small {
          font-size: 1rem;
          color: #7590a8;
          letter-spacing: 0;
        }

        .progress {
          height: 9px;
          margin: 8px 0 20px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.055);
        }

        .progress div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #56e6ff, #53efae);
        }

        .timeline {
          display: grid;
          gap: 10px;
        }

        .stage {
          display: grid;
          grid-template-columns: 110px 1fr 1fr auto;
          gap: 12px;
          align-items: start;
          padding: 15px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 16px;
          background: rgba(2, 9, 16, .5);
        }

        .stage-name {
          color: #dce9f5;
          font-weight: 900;
          font-size: .78rem;
        }

        .stage-label {
          display: block;
          margin-bottom: 5px;
          color: #6f879d;
          font-size: .63rem;
          font-weight: 850;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .stage-value {
          color: #98aec1;
          font-size: .75rem;
          line-height: 1.55;
        }

        .match {
          width: 26px;
          height: 26px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          font-size: .75rem;
          font-weight: 950;
        }

        .match.yes {
          color: #54efae;
          background: rgba(84, 239, 174, .12);
        }

        .match.no {
          color: #ff9d8e;
          background: rgba(255, 157, 142, .12);
        }

        .notes {
          margin-top: 18px;
          padding: 17px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .notes strong {
          color: #dfeaf4;
          font-size: .76rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .notes ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #95aabd;
          line-height: 1.65;
        }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #53efae;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(83, 239, 174, .045);
          font-size: .82rem;
          line-height: 1.65;
        }

        .empty {
          padding: 42px 22px;
          color: #8399ad;
          text-align: center;
          line-height: 1.7;
        }

        @media (max-width: 1000px) {
          .grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 760px) {
          .replay-wrap { width: min(100% - 24px, 1380px); }
          .replay-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .stage { grid-template-columns: 1fr; }
          .match { width: auto; border-radius: 999px; padding: 0 9px; }
        }
      `}</style>

      <div className="replay-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">TA-14 Exchange · Replay Console</p>
            <h1>
              Reconstruct the route.
              <br />
              <span className="gradient">Compare every consequence.</span>
            </h1>
            <p className="hero-copy">
              Replay preserved evidence, authority, binding, commit, execution,
              and outcome records against the route that was actually admitted.
              Divergence remains visible instead of being flattened into a
              successful-looking audit trail.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/verify">
                Verify a package
              </Link>
              <Link className="button-secondary" href="/workspace/receipts">
                Open receipt vault
              </Link>
              <Link className="button-secondary" href="/workspace/registry">
                Open registry
              </Link>
            </div>
          </div>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search replay packages"
            placeholder="Search replay, route, receipt, execution, or version"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter replay state"
            value={state}
            onChange={(event) =>
              setState(event.target.value as ReplayState | "ALL")
            }
          >
            <option value="ALL">All replay states</option>
            <option value="READY">READY</option>
            <option value="INCOMPLETE">INCOMPLETE</option>
            <option value="DIVERGENT">DIVERGENT</option>
            <option value="REVOKED">REVOKED</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Replay packages</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((item) => (
                <button
                  className={`replay-row ${
                    selected?.replayId === item.replayId ? "active" : ""
                  }`}
                  key={item.replayId}
                  type="button"
                  onClick={() => setSelectedId(item.replayId)}
                >
                  <div className="row-top">
                    <span className="route-name">{item.routeName}</span>
                    <span className={`pill ${item.state}`}>{item.state}</span>
                  </div>
                  <div className="mono">{item.replayId}</div>
                  <div className="meta">
                    <span>{item.routeId}</span>
                    <span>v{item.routeVersion}</span>
                    <span>{item.receiptId}</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No replay package matches the current filters.
              </div>
            )}
          </div>

          <div className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.decision}</span>
            </div>

            <h2>{selected.routeName}</h2>
            <div className="mono">{selected.replayId}</div>
            <p>
              Route {selected.routeId} · version {selected.routeVersion}
              <br />
              Receipt {selected.receiptId} · execution {selected.executionId}
            </p>

            <div className="score-row">
              <div>
                <div className="score">
                  {correspondence}
                  <small>%</small>
                </div>
                <span className="meta">
                  {matchedStages} of {selected.steps.length} stages correspond
                </span>
              </div>
              <span className={`pill ${selected.state}`}>{selected.state}</span>
            </div>

            <div className="progress">
              <div style={{ width: `${correspondence}%` }} />
            </div>

            <div className="timeline">
              {selected.steps.map((step) => (
                <article className="stage" key={step.stage}>
                  <div className="stage-name">{step.stage}</div>
                  <div>
                    <span className="stage-label">Expected</span>
                    <div className="stage-value">{step.expected}</div>
                  </div>
                  <div>
                    <span className="stage-label">Observed</span>
                    <div className="stage-value">{step.observed}</div>
                  </div>
                  <div className={`match ${step.matches ? "yes" : "no"}`}>
                    {step.matches ? "✓" : "!"}
                  </div>
                </article>
              ))}
            </div>

            <div className="notes">
              <strong>Replay notes</strong>
              <ul>
                {selected.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <button
                className="small-button"
                type="button"
                onClick={copyReport}
              >
                {copied ? "Copied" : "Copy report"}
              </button>
              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.replayId.toLowerCase()}-report.json`,
                    replayReport,
                  )
                }
              >
                Download report
              </button>
              <Link className="small-button" href="/workspace/verify">
                Verify package
              </Link>
            </div>

            <div className="notice">
              Replay proves correspondence only to the extent supported by the
              preserved package. Missing, substituted, revoked, or UNKNOWN
              evidence remains visible and prevents false closure.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
