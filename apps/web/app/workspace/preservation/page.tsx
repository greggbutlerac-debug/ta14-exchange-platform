"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ArtifactType =
  | "EVIDENCE"
  | "AUTHORITY"
  | "ROUTE"
  | "COMMIT"
  | "EXECUTION"
  | "OUTCOME"
  | "RECEIPT";

type PreservationState =
  | "PRESERVED"
  | "PENDING"
  | "SUPERSEDED"
  | "REVOKED"
  | "INCOMPLETE";

type IntegrityState = "MATCH" | "MISMATCH" | "UNKNOWN";

type ArtifactRecord = {
  artifactId: string;
  routeId: string;
  routeName: string;
  routeVersion: string;
  type: ArtifactType;
  state: PreservationState;
  integrity: IntegrityState;
  createdAt: string;
  preservedAt: string;
  source: string;
  canonicalDigest: string;
  observedDigest: string;
  parentArtifactId: string;
  retentionClass: string;
  notes: string[];
};

const initialArtifacts: ArtifactRecord[] = [
  {
    artifactId: "TA14-ART-7F21A9",
    routeId: "TA14-RID-VP-0042",
    routeName: "Governed Vendor Payment",
    routeVersion: "3.1.0",
    type: "OUTCOME",
    state: "PRESERVED",
    integrity: "MATCH",
    createdAt: "2026-07-17T18:20:00.000Z",
    preservedAt: "2026-07-17T18:22:00.000Z",
    source: "Settlement Processor",
    canonicalDigest:
      "sha256:2b729c330f1ef0b92d75e0cf697c9f453e8a8f739bb81a7da72e4f09a7e8f8a3",
    observedDigest:
      "sha256:2b729c330f1ef0b92d75e0cf697c9f453e8a8f739bb81a7da72e4f09a7e8f8a3",
    parentArtifactId: "TA14-ART-1A90C3",
    retentionClass: "7-YEAR",
    notes: [
      "Outcome corresponds to the committed payment route.",
      "Preserved with route, receipt, and execution references.",
    ],
  },
  {
    artifactId: "TA14-ART-33B8D0",
    routeId: "TA14-RID-AI-0018",
    routeName: "Bounded AI Agent Action",
    routeVersion: "1.4.2",
    type: "AUTHORITY",
    state: "INCOMPLETE",
    integrity: "UNKNOWN",
    createdAt: "2026-07-17T17:31:00.000Z",
    preservedAt: "2026-07-17T17:33:00.000Z",
    source: "Delegation Registry",
    canonicalDigest: "sha256:UNKNOWN",
    observedDigest: "sha256:UNKNOWN",
    parentArtifactId: "UNKNOWN",
    retentionClass: "UNTIL_RESOLVED",
    notes: [
      "General delegation was preserved.",
      "Consequence-specific authority remains unavailable.",
    ],
  },
  {
    artifactId: "TA14-ART-920E4F",
    routeId: "TA14-RID-HVAC-0009",
    routeName: "Analyzer-Governed Refrigerant Intervention",
    routeVersion: "2.0.0",
    type: "EVIDENCE",
    state: "PENDING",
    integrity: "UNKNOWN",
    createdAt: "2026-07-17T15:12:00.000Z",
    preservedAt: "UNKNOWN",
    source: "Field Analyzer",
    canonicalDigest: "sha256:PENDING",
    observedDigest: "sha256:84e92b0f8a5f4d2c",
    parentArtifactId: "TA14-ART-6C3012",
    retentionClass: "FIELD_EVIDENCE",
    notes: [
      "Local evidence exists.",
      "Trusted device signing and server-side preservation remain pending.",
    ],
  },
  {
    artifactId: "TA14-ART-04C7E1",
    routeId: "TA14-RID-HR-0003",
    routeName: "Automated Candidate Rejection",
    routeVersion: "1.0.0",
    type: "ROUTE",
    state: "REVOKED",
    integrity: "MISMATCH",
    createdAt: "2026-07-14T12:42:00.000Z",
    preservedAt: "2026-07-14T12:44:00.000Z",
    source: "Route Registry",
    canonicalDigest:
      "sha256:7c9012cb4d52f7a23adfd08e7098d8b53f18f07383c2a2e4d6428ae4f8426c11",
    observedDigest:
      "sha256:3e3ac34113d475b09b78475ef72c9234c21f1e63ebf140994ca30a8d142fe876",
    parentArtifactId: "NONE",
    retentionClass: "PERMANENT_DENIAL_RECORD",
    notes: [
      "Observed route no longer matches the preserved canonical route.",
      "Revocation remains preserved as part of route history.",
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

export default function PreservationVaultPage() {
  const [artifacts, setArtifacts] = useState(initialArtifacts);
  const [selectedId, setSelectedId] = useState(initialArtifacts[0].artifactId);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ArtifactType | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return artifacts.filter((artifact) => {
      const matchesQuery =
        !needle ||
        [
          artifact.artifactId,
          artifact.routeId,
          artifact.routeName,
          artifact.routeVersion,
          artifact.source,
          artifact.parentArtifactId,
          artifact.retentionClass,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return matchesQuery && (type === "ALL" || artifact.type === type);
    });
  }, [artifacts, query, type]);

  const selected =
    artifacts.find((artifact) => artifact.artifactId === selectedId) ??
    filtered[0] ??
    artifacts[0];

  const metrics = useMemo(
    () => ({
      preserved: artifacts.filter((item) => item.state === "PRESERVED").length,
      pending: artifacts.filter((item) => item.state === "PENDING").length,
      incomplete: artifacts.filter((item) => item.state === "INCOMPLETE").length,
      integrityIssues: artifacts.filter(
        (item) => item.integrity === "MISMATCH" || item.integrity === "UNKNOWN",
      ).length,
    }),
    [artifacts],
  );

  const preservationPackage = {
    schema: "TA14_PRESERVATION_PACKAGE_V1",
    exportedAt: new Date().toISOString(),
    artifact: selected,
    preservationBoundary: {
      identityPreserved: true,
      routeVersionPreserved: true,
      lineagePreserved: selected.parentArtifactId !== "UNKNOWN",
      integrityEstablished: selected.integrity === "MATCH",
      productionPreservationComplete: selected.state === "PRESERVED",
    },
    limitation:
      "Preservation records what was retained and how it is linked. It does not prove admissibility, authority, or successful execution unless those claims are independently supported by the preserved route package.",
  };

  function markPreserved() {
    if (
      selected.state === "REVOKED" ||
      selected.integrity === "MISMATCH" ||
      selected.canonicalDigest.includes("UNKNOWN") ||
      selected.canonicalDigest.includes("PENDING")
    ) {
      return;
    }

    setArtifacts((items) =>
      items.map((item) =>
        item.artifactId === selected.artifactId
          ? {
              ...item,
              state: "PRESERVED",
              preservedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(preservationPackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="preservation-page">
      <style>{`
        * { box-sizing: border-box; }

        .preservation-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .preservation-wrap {
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
            radial-gradient(circle at 84% 8%, rgba(93, 175, 255, .17), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(77, 239, 188, .15), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "PRESERVE";
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
          grid-template-columns: minmax(220px, 1fr) 210px;
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

        .artifact-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .artifact-row:last-child { border-bottom: 0; }

        .artifact-row.active {
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

        .pill.PRESERVED, .pill.MATCH {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.PENDING, .pill.UNKNOWN {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.REVOKED, .pill.MISMATCH {
          color: #ff8e9b;
          border-color: rgba(255, 142, 155, .3);
        }

        .pill.INCOMPLETE {
          color: #ffad7d;
          border-color: rgba(255, 173, 125, .3);
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

        .kv {
          display: grid;
          grid-template-columns: 150px 1fr;
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

        .notes {
          margin-top: 18px;
          padding: 17px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .notes strong {
          color: #dfeaf4;
          font-size: .75rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .notes ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #9fb1c0;
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
          .preservation-wrap { width: min(100% - 24px, 1380px); }
          .preservation-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="preservation-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">TA-14 Exchange · Preservation Vault</p>
            <h1>
              Preserve the record.
              <br />
              <span className="gradient">Keep the lineage visible.</span>
            </h1>
            <p className="hero-copy">
              Retain route evidence, authority, commits, execution records,
              outcomes, and receipts with canonical identity, version lineage,
              integrity state, retention class, and revocation history intact.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/replay">
                Open Replay Console
              </Link>
              <Link className="button-secondary" href="/workspace/receipts">
                Open Receipt Vault
              </Link>
              <Link className="button-secondary" href="/workspace/registry">
                Open Registry
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.preserved}</strong>
            <span>Preserved artifacts</span>
          </article>
          <article className="metric">
            <strong>{metrics.pending}</strong>
            <span>Pending preservation</span>
          </article>
          <article className="metric">
            <strong>{metrics.incomplete}</strong>
            <span>Incomplete artifacts</span>
          </article>
          <article className="metric">
            <strong>{metrics.integrityIssues}</strong>
            <span>Integrity issues</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search preservation artifacts"
            placeholder="Search artifact, route, version, source, parent, or retention class"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter artifact type"
            value={type}
            onChange={(event) =>
              setType(event.target.value as ArtifactType | "ALL")
            }
          >
            <option value="ALL">All artifact types</option>
            <option value="EVIDENCE">EVIDENCE</option>
            <option value="AUTHORITY">AUTHORITY</option>
            <option value="ROUTE">ROUTE</option>
            <option value="COMMIT">COMMIT</option>
            <option value="EXECUTION">EXECUTION</option>
            <option value="OUTCOME">OUTCOME</option>
            <option value="RECEIPT">RECEIPT</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Preserved artifacts</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((artifact) => (
                <button
                  className={`artifact-row ${
                    selected.artifactId === artifact.artifactId ? "active" : ""
                  }`}
                  key={artifact.artifactId}
                  type="button"
                  onClick={() => setSelectedId(artifact.artifactId)}
                >
                  <div className="row-top">
                    <span className="route-name">{artifact.routeName}</span>
                    <span className={`pill ${artifact.state}`}>
                      {artifact.state}
                    </span>
                  </div>
                  <div className="mono">{artifact.artifactId}</div>
                  <div className="meta">
                    <span>{artifact.type}</span>
                    <span>{artifact.integrity}</span>
                    <span>v{artifact.routeVersion}</span>
                    <span>{formatDate(artifact.preservedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No preservation artifact matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className={`pill ${selected.integrity}`}>
                {selected.integrity}
              </span>
              <span className="pill">{selected.type}</span>
            </div>

            <h2>{selected.routeName}</h2>
            <div className="mono">{selected.artifactId}</div>
            <p>
              This artifact is retained as a discrete record within the route
              lineage. Its state does not independently prove the admissibility
              of the complete route.
            </p>

            <dl className="kv">
              <dt>Route ID</dt>
              <dd>{selected.routeId}</dd>

              <dt>Route version</dt>
              <dd>{selected.routeVersion}</dd>

              <dt>Created</dt>
              <dd>{formatDate(selected.createdAt)}</dd>

              <dt>Preserved</dt>
              <dd>{formatDate(selected.preservedAt)}</dd>

              <dt>Source</dt>
              <dd>{selected.source}</dd>

              <dt>Canonical digest</dt>
              <dd>{selected.canonicalDigest}</dd>

              <dt>Observed digest</dt>
              <dd>{selected.observedDigest}</dd>

              <dt>Parent artifact</dt>
              <dd>{selected.parentArtifactId}</dd>

              <dt>Retention class</dt>
              <dd>{selected.retentionClass}</dd>
            </dl>

            <div className="notes">
              <strong>Preservation notes</strong>
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
                onClick={markPreserved}
                disabled={
                  selected.state === "PRESERVED" ||
                  selected.state === "REVOKED" ||
                  selected.integrity !== "MATCH"
                }
              >
                {selected.state === "PRESERVED"
                  ? "Preserved"
                  : "Mark preserved"}
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
                    `${selected.artifactId.toLowerCase()}-preservation.json`,
                    preservationPackage,
                  )
                }
              >
                Download package
              </button>
              <Link className="small-button" href="/workspace/replay">
                Replay lineage
              </Link>
            </div>

            <div className="notice">
              Preservation keeps the record available, attributable, and linked.
              It does not convert incomplete evidence into complete evidence,
              repair a digest mismatch, restore revoked authority, or authorize
              execution.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
