"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RecordStatus = "PRESERVED" | "HOLD" | "INTERPRETED" | "VERIFIED";

type GovernedRecord = {
  id: string;
  title: string;
  recordClass: string;
  source: string;
  period: string;
  status: RecordStatus;
  updated: string;
};

const RECORDS: GovernedRecord[] = [
  {
    id: "AIR-2026-07-20-118",
    title: "Building Atmospheric Integrity Record",
    recordClass: "Atmospheric Integrity Record",
    source: "Building sensor network",
    period: "2026-07-19 00:00–23:59 ET",
    status: "INTERPRETED",
    updated: "Jul 20, 2026",
  },
  {
    id: "PAIR-2026-07-20-004",
    title: "Personal Atmospheric Integrity Record",
    recordClass: "Personal Atmospheric Integrity Record",
    source: "Wearable and room sensor package",
    period: "2026-07-19 06:00–22:00 ET",
    status: "HOLD",
    updated: "Jul 20, 2026",
  },
  {
    id: "ER-2026-07-18-021",
    title: "Cooling Tower Water Evidence Record",
    recordClass: "Environmental Record",
    source: "Facility sampling package",
    period: "2026-07-18",
    status: "PRESERVED",
    updated: "Jul 19, 2026",
  },
  {
    id: "DR-2026-07-17-091",
    title: "HVAC Diagnostic Record",
    recordClass: "Diagnostic Record",
    source: "Field service evidence package",
    period: "2026-07-17 09:14–11:42 ET",
    status: "VERIFIED",
    updated: "Jul 18, 2026",
  },
];

const FILTERS: Array<"ALL" | RecordStatus> = [
  "ALL",
  "PRESERVED",
  "HOLD",
  "INTERPRETED",
  "VERIFIED",
];

export default function MyGovernedRecordsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | RecordStatus>("ALL");

  const visibleRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return RECORDS.filter((record) => {
      const matchesFilter = filter === "ALL" || record.status === filter;
      const matchesQuery =
        !normalized ||
        record.id.toLowerCase().includes(normalized) ||
        record.title.toLowerCase().includes(normalized) ||
        record.recordClass.toLowerCase().includes(normalized) ||
        record.source.toLowerCase().includes(normalized);

      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const counts = useMemo(
    () => ({
      total: RECORDS.length,
      preserved: RECORDS.filter((record) => record.status === "PRESERVED").length,
      hold: RECORDS.filter((record) => record.status === "HOLD").length,
      interpreted: RECORDS.filter(
        (record) => record.status === "INTERPRETED",
      ).length,
      verified: RECORDS.filter((record) => record.status === "VERIFIED").length,
    }),
    [],
  );

  return (
    <>
      <style>{`
        :root {
          --my-bg: #02090b;
          --my-panel: rgba(5, 20, 22, 0.9);
          --my-border: rgba(114, 240, 189, 0.15);
          --my-text: #f5fbf9;
          --my-muted: #8ca7a1;
          --my-teal: #72f0bd;
          --my-cyan: #65e4ff;
          --my-gold: #ffd27a;
          --my-violet: #b79fff;
        }

        .my-page {
          min-height: 100vh;
          color: var(--my-text);
          background:
            radial-gradient(circle at 14% 8%, rgba(101,228,255,0.12), transparent 28%),
            radial-gradient(circle at 86% 12%, rgba(114,240,189,0.11), transparent 28%),
            linear-gradient(180deg, #02090b 0%, #031315 54%, #020709 100%);
        }

        .my-page *,
        .my-page *::before,
        .my-page *::after {
          box-sizing: border-box;
        }

        .my-shell {
          width: min(1240px, calc(100% - 28px));
          margin: 0 auto;
          padding: 24px 0 68px;
        }

        .my-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(114,240,189,0.1);
        }

        .my-brand,
        .my-return {
          color: inherit;
          text-decoration: none;
        }

        .my-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 900;
        }

        .my-mark {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border: 1px solid rgba(114,240,189,0.26);
          border-radius: 14px;
          color: var(--my-teal);
          background: rgba(114,240,189,0.07);
          font-size: 11px;
        }

        .my-return {
          color: #a3b7b2;
          font-size: 13px;
          font-weight: 800;
        }

        .my-hero {
          padding: 54px 0 30px;
        }

        .my-kicker {
          color: var(--my-teal);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .my-hero h1 {
          margin: 18px 0 16px;
          font-size: clamp(3rem, 7vw, 6.6rem);
          line-height: 0.94;
          letter-spacing: -0.065em;
        }

        .my-hero h1 span {
          display: block;
          color: transparent;
          background: linear-gradient(90deg, white, var(--my-teal), var(--my-cyan));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .my-hero p {
          max-width: 820px;
          margin: 0;
          color: var(--my-muted);
          font-size: 16px;
          line-height: 1.75;
        }

        .my-stats {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .my-stat {
          padding: 18px;
          border: 1px solid var(--my-border);
          border-radius: 18px;
          background: var(--my-panel);
        }

        .my-stat small {
          display: block;
          color: #6f8b85;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .my-stat strong {
          display: block;
          margin-top: 8px;
          font-size: 1.8rem;
        }

        .my-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
          padding: 16px;
          border: 1px solid var(--my-border);
          border-radius: 20px;
          background: var(--my-panel);
        }

        .my-search {
          flex: 1 1 360px;
          height: 46px;
          padding: 0 14px;
          border: 1px solid rgba(114,240,189,0.14);
          border-radius: 12px;
          color: white;
          background: rgba(2,10,12,0.78);
          outline: none;
        }

        .my-search:focus {
          border-color: rgba(101,228,255,0.42);
          box-shadow: 0 0 0 3px rgba(101,228,255,0.06);
        }

        .my-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .my-filter {
          min-height: 38px;
          padding: 0 12px;
          border: 1px solid rgba(114,240,189,0.13);
          border-radius: 999px;
          color: #a8bbb6;
          background: rgba(255,255,255,0.03);
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .my-filter.active {
          color: #03110d;
          border-color: transparent;
          background: linear-gradient(135deg, var(--my-teal), var(--my-cyan));
        }

        .my-list {
          display: grid;
          gap: 12px;
        }

        .my-record {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(160px, 0.5fr) auto;
          align-items: center;
          gap: 18px;
          padding: 20px;
          border: 1px solid var(--my-border);
          border-radius: 20px;
          background: var(--my-panel);
        }

        .my-record h2 {
          margin: 0;
          font-size: 1.1rem;
        }

        .my-record-id {
          display: block;
          margin-top: 7px;
          color: var(--my-cyan);
          font: 10px/1.5 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .my-record-meta {
          display: grid;
          gap: 5px;
          margin-top: 12px;
          color: var(--my-muted);
          font-size: 11px;
          line-height: 1.5;
        }

        .my-status {
          justify-self: start;
          padding: 8px 11px;
          border: 1px solid rgba(114,240,189,0.15);
          border-radius: 999px;
          color: #bdeed9;
          background: rgba(114,240,189,0.06);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.1em;
        }

        .my-status.HOLD {
          color: var(--my-gold);
          border-color: rgba(255,210,122,0.2);
          background: rgba(255,210,122,0.06);
        }

        .my-status.VERIFIED {
          color: #e6e0ff;
          border-color: rgba(183,159,255,0.2);
          background: rgba(183,159,255,0.06);
        }

        .my-action {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border: 1px solid rgba(114,240,189,0.16);
          border-radius: 12px;
          color: white;
          background: rgba(255,255,255,0.04);
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
        }

        .my-empty {
          padding: 34px;
          border: 1px dashed rgba(114,240,189,0.2);
          border-radius: 20px;
          color: var(--my-muted);
          text-align: center;
          background: rgba(5,20,22,0.6);
        }

        @media (max-width: 980px) {
          .my-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .my-record {
            grid-template-columns: 1fr;
          }

          .my-action {
            justify-self: start;
          }
        }

        @media (max-width: 720px) {
          .my-shell {
            width: min(100% - 18px, 1240px);
          }

          .my-topbar,
          .my-toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .my-search {
            width: 100%;
            flex-basis: auto;
          }

          .my-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <main className="my-page">
        <div className="my-shell">
          <header className="my-topbar">
            <Link className="my-brand" href="/workspace/governed-records">
              <span className="my-mark">TA-14</span>
              <span>Governed Records</span>
            </Link>

            <Link className="my-return" href="/workspace/governed-records">
              Return to Governed Records Playground
            </Link>
          </header>

          <section className="my-hero">
            <div className="my-kicker">My Records</div>
            <h1>
              Every preserved record
              <span>keeps its own standing.</span>
            </h1>
            <p>
              Review the records associated with this workspace without
              collapsing originals, interpretations, continuity findings, or
              verification states into one ambiguous file.
            </p>
          </section>

          <section className="my-stats">
            <div className="my-stat">
              <small>Total records</small>
              <strong>{counts.total}</strong>
            </div>
            <div className="my-stat">
              <small>Preserved</small>
              <strong>{counts.preserved}</strong>
            </div>
            <div className="my-stat">
              <small>On hold</small>
              <strong>{counts.hold}</strong>
            </div>
            <div className="my-stat">
              <small>Interpreted</small>
              <strong>{counts.interpreted}</strong>
            </div>
            <div className="my-stat">
              <small>Verified</small>
              <strong>{counts.verified}</strong>
            </div>
          </section>

          <section className="my-toolbar">
            <input
              className="my-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by record ID, title, class, or source..."
            />

            <div className="my-filters">
              {FILTERS.map((item) => (
                <button
                  className={`my-filter ${filter === item ? "active" : ""}`}
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="my-list">
            {visibleRecords.length ? (
              visibleRecords.map((record) => (
                <article className="my-record" key={record.id}>
                  <div>
                    <h2>{record.title}</h2>
                    <span className="my-record-id">{record.id}</span>
                    <div className="my-record-meta">
                      <span>{record.recordClass}</span>
                      <span>{record.source}</span>
                      <span>{record.period}</span>
                      <span>Updated {record.updated}</span>
                    </div>
                  </div>

                  <span className={`my-status ${record.status}`}>
                    {record.status}
                  </span>

                  <Link
                    className="my-action"
                    href="/workspace/governed-records/interpreter"
                  >
                    Open Record
                  </Link>
                </article>
              ))
            ) : (
              <div className="my-empty">
                No governed records match the current search and filter.
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
