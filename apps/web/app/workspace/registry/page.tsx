"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type RouteState = "DRAFT" | "TESTING" | "PUBLISHED" | "SUPERSEDED";

type RouteRecord = {
  rid: string;
  name: string;
  domain: string;
  version: string;
  owner: string;
  state: RouteState;
  decision: Decision;
  readiness: number;
  updatedAt: string;
  tests: number;
  successfulTests: number;
  parentRid?: string;
  summary: string;
  unresolved: string[];
};

const initialRoutes: RouteRecord[] = [
  {
    rid: "TA14-RID-VP-0042",
    name: "Governed Vendor Payment",
    domain: "Finance",
    version: "3.1.0",
    owner: "TA-14 Exchange",
    state: "PUBLISHED",
    decision: "ALLOW",
    readiness: 100,
    updatedAt: "2026-07-17T18:14:00.000Z",
    tests: 48,
    successfulTests: 38,
    summary:
      "Payment release above a defined threshold with invoice, purchase-order, supplier-account, approver, execution, and settlement correspondence.",
    unresolved: [],
  },
  {
    rid: "TA14-RID-AI-0018",
    name: "Bounded AI Agent Action",
    domain: "AI Governance",
    version: "1.4.2",
    owner: "TA-14 Exchange",
    state: "TESTING",
    decision: "HOLD",
    readiness: 78,
    updatedAt: "2026-07-17T16:43:00.000Z",
    tests: 21,
    successfulTests: 9,
    summary:
      "A consequential AI action route requiring actor identity, delegated authority, evidence continuity, tool binding, commit correspondence, and outcome verification.",
    unresolved: [
      "Production authority source is not yet bound.",
      "Outcome receipt issuer remains UNKNOWN.",
    ],
  },
  {
    rid: "TA14-RID-HVAC-0009",
    name: "Analyzer-Governed Refrigerant Intervention",
    domain: "HVAC",
    version: "2.0.0",
    owner: "Transparent Air",
    state: "DRAFT",
    decision: "ESCALATE",
    readiness: 66,
    updatedAt: "2026-07-16T21:08:00.000Z",
    tests: 7,
    successfulTests: 2,
    summary:
      "Refrigerant intervention route bound to equipment identity, technician identity, non-invasive evidence, analyzer determination, governed execution, and post-intervention performance.",
    unresolved: [
      "Field device signing key is not registered.",
      "Exception authority requires independent review.",
      "Post-intervention verification window is incomplete.",
    ],
  },
  {
    rid: "TA14-RID-HR-0003",
    name: "Automated Candidate Rejection",
    domain: "Employment",
    version: "0.8.0",
    owner: "Example Organization",
    state: "SUPERSEDED",
    decision: "DENY",
    readiness: 43,
    updatedAt: "2026-07-14T12:30:00.000Z",
    tests: 12,
    successfulTests: 0,
    summary:
      "Legacy candidate-rejection route retained to preserve the failed design, findings, and replacement history.",
    unresolved: [
      "Decision authority was delegated beyond its permitted scope.",
      "Evidence set could not support the proposed consequence.",
      "Human review was absent.",
    ],
  },
];

const decisionOrder: Decision[] = ["ALLOW", "HOLD", "DENY", "ESCALATE"];
const stateOrder: RouteState[] = ["DRAFT", "TESTING", "PUBLISHED", "SUPERSEDED"];

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

export default function RouteRegistryPage() {
  const [routes, setRoutes] = useState<RouteRecord[]>(initialRoutes);
  const [query, setQuery] = useState("");
  const [decision, setDecision] = useState<Decision | "ALL">("ALL");
  const [state, setState] = useState<RouteState | "ALL">("ALL");
  const [selectedRid, setSelectedRid] = useState(initialRoutes[0].rid);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return routes.filter((route) => {
      const matchesQuery =
        !needle ||
        [
          route.rid,
          route.name,
          route.domain,
          route.owner,
          route.summary,
          route.version,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      const matchesDecision = decision === "ALL" || route.decision === decision;
      const matchesState = state === "ALL" || route.state === state;
      return matchesQuery && matchesDecision && matchesState;
    });
  }, [routes, query, decision, state]);

  const selected =
    routes.find((route) => route.rid === selectedRid) ??
    filtered[0] ??
    routes[0];

  const metrics = useMemo(() => {
    const totalTests = routes.reduce((sum, route) => sum + route.tests, 0);
    const successfulTests = routes.reduce(
      (sum, route) => sum + route.successfulTests,
      0,
    );
    return {
      total: routes.length,
      published: routes.filter((route) => route.state === "PUBLISHED").length,
      holds: routes.filter((route) => route.decision === "HOLD").length,
      successRate: totalTests
        ? Math.round((successfulTests / totalTests) * 100)
        : 0,
    };
  }, [routes]);

  const manifest = useMemo(
    () => ({
      schema: "TA14_ROUTE_REGISTRY_MANIFEST_V1",
      generatedAt: new Date().toISOString(),
      routeCount: routes.length,
      routes,
      limitation:
        "Registry presence does not prove current production admissibility. Every route must be reevaluated against its actual evidence, authority, environment, commit, execution, and outcome.",
    }),
    [routes],
  );

  function duplicateRoute(route: RouteRecord) {
    const now = new Date().toISOString();
    const copy: RouteRecord = {
      ...route,
      rid: `TA14-RID-FORK-${Date.now().toString(36).toUpperCase()}`,
      name: `${route.name} — Fork`,
      version: "0.1.0",
      owner: "Local Workspace",
      state: "DRAFT",
      decision: "HOLD",
      readiness: Math.min(route.readiness, 70),
      updatedAt: now,
      tests: 0,
      successfulTests: 0,
      parentRid: route.rid,
      unresolved: [
        "Forked routes must be rebound to their actual actor, authority, evidence, environment, and outcome source.",
      ],
    };
    setRoutes((current) => [copy, ...current]);
    setSelectedRid(copy.rid);
  }

  async function copyRecord(route: RouteRecord) {
    await navigator.clipboard.writeText(
      JSON.stringify(
        {
          schema: "TA14_ROUTE_REGISTRY_RECORD_V1",
          exportedAt: new Date().toISOString(),
          route,
        },
        null,
        2,
      ),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="registry-page">
      <style>{`
        * { box-sizing: border-box; }

        .registry-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .registry-wrap {
          width: min(1380px, calc(100% - 48px));
          margin: 0 auto;
        }

        .registry-hero {
          position: relative;
          overflow: hidden;
          padding: clamp(30px, 5vw, 66px);
          border: 1px solid rgba(134, 181, 221, .16);
          border-radius: 34px;
          background:
            radial-gradient(circle at 88% 10%, rgba(59, 242, 165, .13), transparent 28%),
            radial-gradient(circle at 16% 0%, rgba(70, 200, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 31, 49, .96), rgba(5, 12, 21, .97));
          box-shadow: 0 38px 120px rgba(0, 0, 0, .35);
        }

        .registry-hero::after {
          content: "REGISTRY";
          position: absolute;
          right: -12px;
          bottom: -38px;
          color: rgba(255,255,255,.025);
          font-size: clamp(5rem, 14vw, 12rem);
          font-weight: 1000;
          letter-spacing: -.09em;
          line-height: 1;
          pointer-events: none;
        }

        .hero-content { position: relative; z-index: 1; max-width: 900px; }

        .eyebrow {
          margin: 0 0 17px;
          color: #62e6fb;
          font-size: .72rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          font-size: clamp(3.3rem, 7vw, 7rem);
          line-height: .91;
          letter-spacing: -.072em;
        }

        .gradient {
          color: transparent;
          background: linear-gradient(100deg, #fff 10%, #8beaff 52%, #53efb1 94%);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 820px;
          margin: 24px 0 0;
          color: #9fb4c8;
          font-size: 1.08rem;
          line-height: 1.75;
        }

        .hero-actions {
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
          transition: transform .2s ease, border-color .2s ease, filter .2s ease;
        }

        .button:hover, .button-secondary:hover, .small-button:hover {
          transform: translateY(-2px);
        }

        .button {
          min-height: 48px;
          padding: 0 20px;
          border: 0;
          color: #03110d;
          background: linear-gradient(100deg, #54e8ff, #39f2a1);
          box-shadow: 0 0 34px rgba(57, 242, 161, .15);
        }

        .button-secondary {
          min-height: 48px;
          padding: 0 20px;
          border: 1px solid rgba(138, 180, 220, .22);
          color: #dce9f5;
          background: rgba(7, 17, 29, .72);
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
          grid-template-columns: minmax(220px, 1fr) 180px 180px;
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

        input:focus, select:focus {
          border-color: rgba(84, 232, 255, .55);
          box-shadow: 0 0 0 3px rgba(84, 232, 255, .08);
        }

        .registry-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(360px, .88fr);
          gap: 18px;
          align-items: start;
        }

        .panel {
          overflow: hidden;
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 25px;
          background: rgba(6, 15, 25, .78);
          box-shadow: 0 24px 80px rgba(0,0,0,.22);
        }

        .panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 19px 21px;
          border-bottom: 1px solid rgba(132, 177, 216, .12);
        }

        .panel-head strong { font-size: .9rem; }
        .panel-head span { color: #6f879e; font-size: .75rem; }

        .route-list { display: grid; }

        .route-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
          transition: background .2s ease;
        }

        .route-row:last-child { border-bottom: 0; }
        .route-row:hover { background: rgba(84, 232, 255, .035); }
        .route-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(57, 242, 161, .025));
          box-shadow: inset 3px 0 0 #54e8ff;
        }

        .route-top, .route-meta, .detail-top, .detail-actions {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .route-top { justify-content: space-between; }
        .route-name { font-weight: 900; }
        .route-id { margin-top: 7px; color: #6f879e; font: 700 .72rem ui-monospace, SFMono-Regular, Menlo, monospace; }

        .route-meta { margin-top: 13px; color: #8ea4b8; font-size: .75rem; }

        .pill {
          display: inline-flex;
          align-items: center;
          min-height: 25px;
          padding: 0 9px;
          border: 1px solid rgba(135, 180, 220, .18);
          border-radius: 999px;
          color: #b9c9d8;
          background: rgba(8, 18, 30, .72);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .07em;
        }

        .pill.ALLOW { color: #54efae; border-color: rgba(84, 239, 174, .3); }
        .pill.HOLD { color: #ffd27b; border-color: rgba(255, 210, 123, .3); }
        .pill.DENY { color: #ff8e9b; border-color: rgba(255, 142, 155, .3); }
        .pill.ESCALATE { color: #b8a5ff; border-color: rgba(184, 165, 255, .3); }

        .empty {
          padding: 42px 22px;
          color: #8399ad;
          text-align: center;
          line-height: 1.7;
        }

        .detail {
          position: sticky;
          top: 92px;
          padding: 25px;
        }

        .detail-top { justify-content: space-between; }
        .detail h2 { margin: 20px 0 8px; font-size: 1.8rem; letter-spacing: -.04em; }
        .detail-rid { color: #72dff4; font: 750 .75rem ui-monospace, SFMono-Regular, Menlo, monospace; }
        .detail p { color: #98aec2; line-height: 1.7; }

        .progress-track {
          height: 9px;
          margin-top: 16px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.055);
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #54e8ff, #39f2a1);
        }

        .detail-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
          margin: 18px 0;
        }

        .detail-stat {
          padding: 14px;
          border: 1px solid rgba(132, 177, 216, .13);
          border-radius: 15px;
          background: rgba(2, 9, 16, .55);
        }

        .detail-stat strong { display: block; font-size: 1.05rem; }
        .detail-stat span { color: #7189a0; font-size: .66rem; font-weight: 850; text-transform: uppercase; }

        .finding-box {
          margin-top: 18px;
          padding: 17px;
          border: 1px solid rgba(255, 210, 123, .16);
          border-radius: 17px;
          background: rgba(65, 43, 8, .15);
        }

        .finding-box strong {
          color: #ffd27b;
          font-size: .75rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .finding-box ul {
          margin: 11px 0 0;
          padding-left: 18px;
          color: #b8c7d4;
          line-height: 1.65;
        }

        .clear-box {
          border-color: rgba(84, 239, 174, .16);
          background: rgba(14, 62, 44, .13);
        }

        .clear-box strong { color: #54efae; }

        .detail-actions { margin-top: 20px; }

        .small-button {
          min-height: 40px;
          padding: 0 14px;
          border: 1px solid rgba(135, 180, 220, .19);
          color: #dce9f5;
          background: rgba(8, 18, 30, .78);
          font-size: .75rem;
        }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #54e8ff;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(84, 232, 255, .045);
          font-size: .82rem;
          line-height: 1.65;
        }

        @media (max-width: 980px) {
          .metrics { grid-template-columns: repeat(2, 1fr); }
          .registry-grid { grid-template-columns: 1fr; }
          .detail { position: static; }
        }

        @media (max-width: 700px) {
          .registry-wrap { width: min(100% - 24px, 1380px); }
          .registry-page { padding-top: 24px; }
          .registry-hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .detail-stats { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="registry-wrap">
        <section className="registry-hero">
          <div className="hero-content">
            <p className="eyebrow">TA-14 Exchange · Operational portfolio</p>
            <h1>
              Your governed routes.
              <br />
              <span className="gradient">One inspectable registry.</span>
            </h1>
            <p className="hero-copy">
              Track route identity, version, ownership, decision state, test
              history, unresolved findings, publication status, and lineage
              without confusing registration with admissibility.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/workspace/build">
                Create a route
              </Link>
              <Link className="button-secondary" href="/workspace/exchange">
                Browse the Exchange
              </Link>
              <button
                className="button-secondary"
                type="button"
                onClick={() =>
                  downloadJson("ta14-route-registry-manifest.json", manifest)
                }
              >
                Export registry manifest
              </button>
            </div>
          </div>
        </section>

        <section className="metrics" aria-label="Registry metrics">
          <article className="metric">
            <strong>{metrics.total}</strong>
            <span>Registered routes</span>
          </article>
          <article className="metric">
            <strong>{metrics.published}</strong>
            <span>Published routes</span>
          </article>
          <article className="metric">
            <strong>{metrics.holds}</strong>
            <span>Routes on hold</span>
          </article>
          <article className="metric">
            <strong>{metrics.successRate}%</strong>
            <span>Aggregate test success</span>
          </article>
        </section>

        <section className="toolbar" aria-label="Registry filters">
          <input
            aria-label="Search registry"
            placeholder="Search route, RID, domain, owner, or version"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter by decision"
            value={decision}
            onChange={(event) =>
              setDecision(event.target.value as Decision | "ALL")
            }
          >
            <option value="ALL">All decisions</option>
            {decisionOrder.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by state"
            value={state}
            onChange={(event) =>
              setState(event.target.value as RouteState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            {stateOrder.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </section>

        <section className="registry-grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Route registry</strong>
              <span>{filtered.length} visible</span>
            </div>

            <div className="route-list">
              {filtered.length ? (
                filtered.map((route) => (
                  <button
                    className={`route-row ${
                      route.rid === selected?.rid ? "active" : ""
                    }`}
                    key={route.rid}
                    type="button"
                    onClick={() => setSelectedRid(route.rid)}
                  >
                    <div className="route-top">
                      <span className="route-name">{route.name}</span>
                      <span className={`pill ${route.decision}`}>
                        {route.decision}
                      </span>
                    </div>
                    <div className="route-id">{route.rid}</div>
                    <div className="route-meta">
                      <span>{route.domain}</span>
                      <span>v{route.version}</span>
                      <span>{route.state}</span>
                      <span>{route.readiness}% ready</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="empty">
                  No route matches the current filters. Change the search,
                  decision, or registry state.
                </div>
              )}
            </div>
          </div>

          {selected ? (
            <aside className="panel detail">
              <div className="detail-top">
                <span className={`pill ${selected.decision}`}>
                  {selected.decision}
                </span>
                <span className="pill">{selected.state}</span>
              </div>

              <h2>{selected.name}</h2>
              <div className="detail-rid">{selected.rid}</div>
              <p>{selected.summary}</p>

              <div className="progress-track" aria-label="Route readiness">
                <div
                  className="progress-fill"
                  style={{ width: `${selected.readiness}%` }}
                />
              </div>

              <div className="detail-stats">
                <div className="detail-stat">
                  <strong>{selected.readiness}%</strong>
                  <span>Readiness</span>
                </div>
                <div className="detail-stat">
                  <strong>{selected.tests}</strong>
                  <span>Tests</span>
                </div>
                <div className="detail-stat">
                  <strong>{selected.successfulTests}</strong>
                  <span>Successful</span>
                </div>
              </div>

              <p>
                <strong>Owner:</strong> {selected.owner}
                <br />
                <strong>Version:</strong> {selected.version}
                <br />
                <strong>Updated:</strong> {formatDate(selected.updatedAt)}
                {selected.parentRid ? (
                  <>
                    <br />
                    <strong>Forked from:</strong> {selected.parentRid}
                  </>
                ) : null}
              </p>

              {selected.unresolved.length ? (
                <div className="finding-box">
                  <strong>Unresolved findings</strong>
                  <ul>
                    {selected.unresolved.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="finding-box clear-box">
                  <strong>No unresolved registry findings</strong>
                  <p>
                    This record is complete at the registry layer. Production
                    execution still requires current admissibility.
                  </p>
                </div>
              )}

              <div className="detail-actions">
                <button
                  className="small-button"
                  type="button"
                  onClick={() => duplicateRoute(selected)}
                >
                  Fork route
                </button>
                <button
                  className="small-button"
                  type="button"
                  onClick={() => copyRecord(selected)}
                >
                  {copied ? "Copied" : "Copy record"}
                </button>
                <button
                  className="small-button"
                  type="button"
                  onClick={() =>
                    downloadJson(
                      `${selected.rid.toLowerCase()}-registry-record.json`,
                      {
                        schema: "TA14_ROUTE_REGISTRY_RECORD_V1",
                        exportedAt: new Date().toISOString(),
                        route: selected,
                      },
                    )
                  }
                >
                  Download JSON
                </button>
                <Link className="small-button" href="/workspace/scanner">
                  Scan route
                </Link>
              </div>

              <div className="notice">
                Registration preserves identity, version, lineage, and status.
                It does not authorize execution and does not convert a route
                into an admissible route merely because the route appears here.
              </div>
            </aside>
          ) : null}
        </section>
      </div>
    </main>
  );
}
