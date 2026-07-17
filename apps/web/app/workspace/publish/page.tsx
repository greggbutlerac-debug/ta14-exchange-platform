"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PublicationState =
  | "DRAFT"
  | "READY"
  | "PUBLISHED"
  | "SUPERSEDED"
  | "WITHDRAWN";

type GovernanceDecision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type Visibility = "PUBLIC" | "UNLISTED" | "PRIVATE";

type PublicationRecord = {
  publicationId: string;
  routeId: string;
  routeName: string;
  routeVersion: string;
  state: PublicationState;
  decision: GovernanceDecision;
  visibility: Visibility;
  owner: string;
  publisher: string;
  createdAt: string;
  publishedAt: string;
  registryRecord: string;
  signedReceipt: string;
  replayRecord: string;
  preservationRecord: string;
  summary: string;
  categories: string[];
  unresolvedItems: string[];
};

const initialRecords: PublicationRecord[] = [
  {
    publicationId: "TA14-PUB-20A91F",
    routeId: "TA14-RID-VP-0042",
    routeName: "Governed Vendor Payment",
    routeVersion: "3.1.0",
    state: "PUBLISHED",
    decision: "ALLOW",
    visibility: "PUBLIC",
    owner: "TA-14 Exchange",
    publisher: "TA-14 Publication Desk",
    createdAt: "2026-07-17T18:30:00.000Z",
    publishedAt: "2026-07-17T18:35:00.000Z",
    registryRecord: "TA14-REG-0042",
    signedReceipt: "TA14-RECEIPT-9017",
    replayRecord: "TA14-REPLAY-72A91F",
    preservationRecord: "TA14-ART-7F21A9",
    summary:
      "A bounded route for vendor payments above an organizational threshold with authority, evidence, commit, execution, and settlement correspondence preserved.",
    categories: ["Finance", "Agentic AI", "Runtime Governance"],
    unresolvedItems: [],
  },
  {
    publicationId: "TA14-PUB-7C3D81",
    routeId: "TA14-RID-AI-0018",
    routeName: "Bounded AI Agent Action",
    routeVersion: "1.4.2",
    state: "DRAFT",
    decision: "HOLD",
    visibility: "PRIVATE",
    owner: "Example Organization",
    publisher: "UNASSIGNED",
    createdAt: "2026-07-17T18:50:00.000Z",
    publishedAt: "UNKNOWN",
    registryRecord: "TA14-REG-0018",
    signedReceipt: "UNKNOWN",
    replayRecord: "TA14-REPLAY-19B7C2",
    preservationRecord: "TA14-ART-33B8D0",
    summary:
      "A proposed AI-agent route that limits tool use and consequence creation through explicit evidence and authority checks.",
    categories: ["Agentic AI", "Tool Governance"],
    unresolvedItems: [
      "Consequence-specific authority is not bound.",
      "Production signed receipt is unavailable.",
    ],
  },
  {
    publicationId: "TA14-PUB-17D0E4",
    routeId: "TA14-RID-HVAC-0009",
    routeName: "Analyzer-Governed Refrigerant Intervention",
    routeVersion: "2.0.0",
    state: "READY",
    decision: "ESCALATE",
    visibility: "UNLISTED",
    owner: "Transparent Air",
    publisher: "TA-14 Publication Desk",
    createdAt: "2026-07-17T16:12:00.000Z",
    publishedAt: "UNKNOWN",
    registryRecord: "TA14-REG-0009",
    signedReceipt: "TA14-RECEIPT-4412",
    replayRecord: "TA14-REPLAY-A80211",
    preservationRecord: "TA14-ART-920E4F",
    summary:
      "An analyzer-controlled refrigerant intervention route with threshold detection, technician identity, governed execution, and post-intervention verification.",
    categories: ["HVAC", "Environmental Governance", "Field Execution"],
    unresolvedItems: [
      "Trusted device key registration remains pending.",
      "Exception authority requires independent binding.",
    ],
  },
  {
    publicationId: "TA14-PUB-B712E0",
    routeId: "TA14-RID-HR-0003",
    routeName: "Automated Candidate Rejection",
    routeVersion: "1.0.0",
    state: "WITHDRAWN",
    decision: "DENY",
    visibility: "PRIVATE",
    owner: "Example Organization",
    publisher: "Independent Reviewer 01",
    createdAt: "2026-07-14T13:20:00.000Z",
    publishedAt: "UNKNOWN",
    registryRecord: "TA14-REG-0003",
    signedReceipt: "NONE",
    replayRecord: "TA14-REPLAY-DENIED-03",
    preservationRecord: "TA14-ART-04C7E1",
    summary:
      "A rejected route that attempted to automate an employment consequence without admissible authority, complete evidence, or required human review.",
    categories: ["Employment", "Denied Route"],
    unresolvedItems: [
      "Authority exceeded permitted scope.",
      "Required human review was absent.",
      "Evidence did not support the proposed consequence.",
    ],
  },
];

function formatDate(value: string) {
  if (value === "UNKNOWN") return "UNKNOWN";
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

export default function RoutePublicationDeskPage() {
  const [records, setRecords] = useState(initialRecords);
  const [selectedId, setSelectedId] = useState(initialRecords[0].publicationId);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<PublicationState | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.publicationId,
          record.routeId,
          record.routeName,
          record.owner,
          record.publisher,
          record.summary,
          ...record.categories,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return matchesQuery && (state === "ALL" || record.state === state);
    });
  }, [query, records, state]);

  const selected =
    records.find((record) => record.publicationId === selectedId) ??
    filtered[0] ??
    records[0];

  const metrics = useMemo(
    () => ({
      published: records.filter((item) => item.state === "PUBLISHED").length,
      ready: records.filter((item) => item.state === "READY").length,
      draft: records.filter((item) => item.state === "DRAFT").length,
      withdrawn: records.filter((item) => item.state === "WITHDRAWN").length,
    }),
    [records],
  );

  const canPublish =
    selected.state === "READY" &&
    selected.decision === "ALLOW" &&
    selected.unresolvedItems.length === 0 &&
    !["UNKNOWN", "NONE"].includes(selected.signedReceipt) &&
    selected.replayRecord !== "UNKNOWN" &&
    selected.preservationRecord !== "UNKNOWN";

  const publicationPackage = {
    schema: "TA14_ROUTE_PUBLICATION_PACKAGE_V1",
    exportedAt: new Date().toISOString(),
    publication: selected,
    publicationReadiness: {
      routeRegistered: selected.registryRecord !== "UNKNOWN",
      signedReceiptPresent: !["UNKNOWN", "NONE"].includes(
        selected.signedReceipt,
      ),
      replayRecordPresent: selected.replayRecord !== "UNKNOWN",
      preservationRecordPresent: selected.preservationRecord !== "UNKNOWN",
      unresolvedItems: selected.unresolvedItems.length,
      publishable: canPublish,
    },
    limitation:
      "Publication makes a route discoverable. It does not grant permanent execution authority, replace runtime admissibility, or certify that a route remains valid after evidence, authority, or reality changes.",
  };

  function publishRoute() {
    if (!canPublish) return;

    setRecords((items) =>
      items.map((item) =>
        item.publicationId === selected.publicationId
          ? {
              ...item,
              state: "PUBLISHED",
              visibility:
                item.visibility === "PRIVATE" ? "UNLISTED" : item.visibility,
              publishedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(publicationPackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="publication-page">
      <style>{`
        * { box-sizing: border-box; }

        .publication-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .publication-wrap {
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
            radial-gradient(circle at 84% 8%, rgba(83, 239, 174, .15), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "PUBLISH";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(5rem, 14vw, 12rem);
          font-weight: 1000;
          letter-spacing: -.1em;
          pointer-events: none;
        }

        .hero-content { position: relative; z-index: 1; max-width: 930px; }

        .eyebrow {
          margin: 0 0 17px;
          color: #70e4fa;
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #54efae);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 830px;
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

        .metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
          margin: 22px 0;
        }

        .metric {
          padding: 21px;
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 21px;
          background: rgba(7, 16, 27, .74);
        }

        .metric strong {
          display: block;
          font-size: 1.75rem;
          letter-spacing: -.045em;
        }

        .metric span {
          display: block;
          margin-top: 5px;
          color: #7890a7;
          font-size: .72rem;
          font-weight: 850;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .toolbar {
          display: grid;
          grid-template-columns: minmax(220px, 1fr) 220px;
          gap: 12px;
          margin-bottom: 22px;
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
          grid-template-columns: minmax(0, .78fr) minmax(0, 1.22fr);
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

        .publication-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .publication-row:last-child { border-bottom: 0; }

        .publication-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(83, 239, 174, .025));
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

        .pill.PUBLISHED, .pill.ALLOW {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.READY {
          color: #7bd9ff;
          border-color: rgba(123, 217, 255, .3);
        }

        .pill.HOLD, .pill.ESCALATE {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.DENY, .pill.WITHDRAWN {
          color: #ff8e9b;
          border-color: rgba(255, 142, 155, .3);
        }

        .detail {
          position: sticky;
          top: 92px;
          padding: 25px;
        }

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

        .category-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 15px;
        }

        .kv {
          display: grid;
          grid-template-columns: 155px 1fr;
          gap: 10px 14px;
          margin-top: 20px;
          padding: 17px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
          font-size: .78rem;
        }

        .kv dt { color: #718aa1; }
        .kv dd {
          margin: 0;
          overflow-wrap: anywhere;
          color: #dce8f3;
        }

        .readiness-box, .blocker-box {
          margin-top: 18px;
          padding: 17px;
          border-radius: 17px;
        }

        .readiness-box {
          border: 1px solid rgba(84, 239, 174, .16);
          background: rgba(14, 62, 44, .13);
          color: #addac7;
        }

        .blocker-box {
          border: 1px solid rgba(255, 210, 123, .16);
          background: rgba(65, 43, 8, .15);
        }

        .blocker-box strong {
          color: #ffd27b;
          font-size: .75rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .blocker-box ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #b8c7d4;
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
          .detail { position: static; }
        }

        @media (max-width: 760px) {
          .publication-wrap { width: min(100% - 24px, 1380px); }
          .publication-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="publication-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">TA-14 Exchange · Route Publication Desk</p>
            <h1>
              Publish the route.
              <br />
              <span className="gradient">Not the promise.</span>
            </h1>
            <p className="hero-copy">
              Move tested, registered, preserved, and replayable routes into the
              Exchange with version identity, publication state, visibility,
              supporting records, and unresolved limitations plainly visible.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/exchange">
                Open Exchange
              </Link>
              <Link className="button-secondary" href="/workspace/registry">
                Open Registry
              </Link>
              <Link className="button-secondary" href="/workspace/testing">
                Open Testing Desk
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.published}</strong>
            <span>Published routes</span>
          </article>
          <article className="metric">
            <strong>{metrics.ready}</strong>
            <span>Ready to publish</span>
          </article>
          <article className="metric">
            <strong>{metrics.draft}</strong>
            <span>Publication drafts</span>
          </article>
          <article className="metric">
            <strong>{metrics.withdrawn}</strong>
            <span>Withdrawn routes</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search publication records"
            placeholder="Search publication, route, owner, publisher, category, or summary"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter publication state"
            value={state}
            onChange={(event) =>
              setState(event.target.value as PublicationState | "ALL")
            }
          >
            <option value="ALL">All publication states</option>
            <option value="DRAFT">DRAFT</option>
            <option value="READY">READY</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="SUPERSEDED">SUPERSEDED</option>
            <option value="WITHDRAWN">WITHDRAWN</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Publication queue</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`publication-row ${
                    selected.publicationId === record.publicationId
                      ? "active"
                      : ""
                  }`}
                  key={record.publicationId}
                  type="button"
                  onClick={() => setSelectedId(record.publicationId)}
                >
                  <div className="row-top">
                    <span className="route-name">{record.routeName}</span>
                    <span className={`pill ${record.state}`}>
                      {record.state}
                    </span>
                  </div>
                  <div className="mono">{record.publicationId}</div>
                  <div className="meta">
                    <span>{record.decision}</span>
                    <span>{record.visibility}</span>
                    <span>v{record.routeVersion}</span>
                    <span>{formatDate(record.publishedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No publication record matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className={`pill ${selected.decision}`}>
                {selected.decision}
              </span>
              <span className="pill">{selected.visibility}</span>
            </div>

            <h2>{selected.routeName}</h2>
            <div className="mono">{selected.publicationId}</div>
            <p>{selected.summary}</p>

            <div className="category-row">
              {selected.categories.map((category) => (
                <span className="pill" key={category}>
                  {category}
                </span>
              ))}
            </div>

            <dl className="kv">
              <dt>Route ID</dt>
              <dd>{selected.routeId}</dd>

              <dt>Route version</dt>
              <dd>{selected.routeVersion}</dd>

              <dt>Owner</dt>
              <dd>{selected.owner}</dd>

              <dt>Publisher</dt>
              <dd>{selected.publisher}</dd>

              <dt>Created</dt>
              <dd>{formatDate(selected.createdAt)}</dd>

              <dt>Published</dt>
              <dd>{formatDate(selected.publishedAt)}</dd>

              <dt>Registry record</dt>
              <dd>{selected.registryRecord}</dd>

              <dt>Signed receipt</dt>
              <dd>{selected.signedReceipt}</dd>

              <dt>Replay record</dt>
              <dd>{selected.replayRecord}</dd>

              <dt>Preservation record</dt>
              <dd>{selected.preservationRecord}</dd>
            </dl>

            {selected.unresolvedItems.length ? (
              <div className="blocker-box">
                <strong>Publication blockers</strong>
                <ul>
                  {selected.unresolvedItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="readiness-box">
                No unresolved publication blockers are recorded for this route
                version.
              </div>
            )}

            <div className="detail-actions">
              <button
                className="small-button"
                type="button"
                onClick={publishRoute}
                disabled={!canPublish}
              >
                {selected.state === "PUBLISHED"
                  ? "Published"
                  : canPublish
                    ? "Publish route"
                    : "Publication blocked"}
              </button>
              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy package"}
              </button>
              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.publicationId.toLowerCase()}-publication.json`,
                    publicationPackage,
                  )
                }
              >
                Download package
              </button>
              <Link className="small-button" href="/workspace/exchange">
                View Exchange
              </Link>
            </div>

            <div className="notice">
              Publication makes a route discoverable. It does not create
              permanent authority, eliminate runtime checks, certify future
              evidence, or guarantee that the route remains admissible when
              reality changes.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
