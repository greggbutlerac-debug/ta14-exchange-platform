"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type LedgerEventType =
  | "ROUTE_CREATED"
  | "VERSION_PUBLISHED"
  | "TEST_COMPLETED"
  | "CORRECTION_OPENED"
  | "CORRECTION_RESOLVED"
  | "RECEIPT_ISSUED"
  | "REPLAY_VERIFIED"
  | "AUTHORITY_REVOKED"
  | "OUTCOME_PRESERVED";

type LedgerState = "ACTIVE" | "SUPERSEDED" | "REVOKED" | "DISPUTED";
type IntegrityState = "VALID" | "BROKEN" | "UNKNOWN";

type LedgerEvent = {
  eventId: string;
  routeId: string;
  routeName: string;
  routeVersion: string;
  type: LedgerEventType;
  state: LedgerState;
  integrity: IntegrityState;
  occurredAt: string;
  recordedAt: string;
  actor: string;
  sourceRecord: string;
  previousEventId: string;
  previousDigest: string;
  eventDigest: string;
  summary: string;
};

const initialEvents: LedgerEvent[] = [
  {
    eventId: "TA14-LEDGER-EVT-0019A7",
    routeId: "TA14-RID-VP-0042",
    routeName: "Governed Vendor Payment",
    routeVersion: "3.1.0",
    type: "OUTCOME_PRESERVED",
    state: "ACTIVE",
    integrity: "VALID",
    occurredAt: "2026-07-17T18:22:00.000Z",
    recordedAt: "2026-07-17T18:22:04.000Z",
    actor: "TA-14 Preservation Service",
    sourceRecord: "TA14-ART-7F21A9",
    previousEventId: "TA14-LEDGER-EVT-0019A6",
    previousDigest:
      "sha256:6e51a6df0ed2fd89b682a03f4339bd57cc7be9d8c142d32244f455758f26821a",
    eventDigest:
      "sha256:d0fe1e8e67777f3782c537457f6c8cf84335f840d8ea067c85e7eb972310031f",
    summary:
      "Settlement outcome preserved and linked to the committed route, execution record, and signed test receipt.",
  },
  {
    eventId: "TA14-LEDGER-EVT-0019A6",
    routeId: "TA14-RID-VP-0042",
    routeName: "Governed Vendor Payment",
    routeVersion: "3.1.0",
    type: "REPLAY_VERIFIED",
    state: "ACTIVE",
    integrity: "VALID",
    occurredAt: "2026-07-17T18:21:00.000Z",
    recordedAt: "2026-07-17T18:21:03.000Z",
    actor: "TA-14 Replay Verifier",
    sourceRecord: "TA14-REPLAY-72A91F",
    previousEventId: "TA14-LEDGER-EVT-0019A5",
    previousDigest:
      "sha256:9ed08bb34060f8e801c65d343c3d7700243a8a409ab305d165bcce8d340d64c0",
    eventDigest:
      "sha256:6e51a6df0ed2fd89b682a03f4339bd57cc7be9d8c142d32244f455758f26821a",
    summary:
      "Replay correspondence established across all eight stages, subject to independent signature verification.",
  },
  {
    eventId: "TA14-LEDGER-EVT-00B332",
    routeId: "TA14-RID-AI-0018",
    routeName: "Bounded AI Agent Action",
    routeVersion: "1.4.2",
    type: "CORRECTION_OPENED",
    state: "ACTIVE",
    integrity: "VALID",
    occurredAt: "2026-07-17T18:41:00.000Z",
    recordedAt: "2026-07-17T18:41:02.000Z",
    actor: "TA-14 Review Desk",
    sourceRecord: "TA14-FIND-5B19D2",
    previousEventId: "TA14-LEDGER-EVT-00B331",
    previousDigest:
      "sha256:832a28e467432788a1a912f9f12b10cd4c28b3a5880a27e89bce1002e9f61152",
    eventDigest:
      "sha256:bc574b664889bd40b2a5e51c2a708e383b1972a104e5641b11ad89c36cddbe5a",
    summary:
      "Blocking correction opened because delegated authority was not bound to the exact tool consequence.",
  },
  {
    eventId: "TA14-LEDGER-EVT-004D20",
    routeId: "TA14-RID-HR-0003",
    routeName: "Automated Candidate Rejection",
    routeVersion: "1.0.0",
    type: "AUTHORITY_REVOKED",
    state: "REVOKED",
    integrity: "BROKEN",
    occurredAt: "2026-07-14T13:10:00.000Z",
    recordedAt: "2026-07-14T13:10:02.000Z",
    actor: "Independent Reviewer 01",
    sourceRecord: "TA14-REV-512E0B",
    previousEventId: "TA14-LEDGER-EVT-004D1F",
    previousDigest:
      "sha256:0f47119095a80be5f5d10b43c3314e84a56f2f72d18f657cc2d43cedf2654f12",
    eventDigest:
      "sha256:3a4a12d8a2c3f57d19e15d2fcb0fcf3d7ac118f635f0c91b7cfced35fdc54dd1",
    summary:
      "Route authority revoked after the submitted correction attempted to remove required human review.",
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
    second: "2-digit",
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

export default function RouteHistoryLedgerPage() {
  const [events] = useState(initialEvents);
  const [selectedId, setSelectedId] = useState(initialEvents[0].eventId);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<LedgerEventType | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return events.filter((event) => {
      const matchesQuery =
        !needle ||
        [
          event.eventId,
          event.routeId,
          event.routeName,
          event.routeVersion,
          event.actor,
          event.sourceRecord,
          event.previousEventId,
          event.summary,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return matchesQuery && (type === "ALL" || event.type === type);
    });
  }, [events, query, type]);

  const selected =
    events.find((event) => event.eventId === selectedId) ??
    filtered[0] ??
    events[0];

  const routeEvents = useMemo(
    () =>
      events
        .filter((event) => event.routeId === selected.routeId)
        .sort(
          (a, b) =>
            new Date(b.recordedAt).getTime() -
            new Date(a.recordedAt).getTime(),
        ),
    [events, selected.routeId],
  );

  const metrics = useMemo(
    () => ({
      total: events.length,
      valid: events.filter((event) => event.integrity === "VALID").length,
      broken: events.filter((event) => event.integrity === "BROKEN").length,
      revoked: events.filter((event) => event.state === "REVOKED").length,
    }),
    [events],
  );

  const ledgerPackage = {
    schema: "TA14_ROUTE_HISTORY_LEDGER_V1",
    exportedAt: new Date().toISOString(),
    selectedEvent: selected,
    routeHistory: routeEvents,
    chainCheck: {
      selectedEventHasPredecessor:
        selected.previousEventId !== "NONE" &&
        selected.previousEventId !== "UNKNOWN",
      selectedEventDigestPresent: selected.eventDigest.startsWith("sha256:"),
      selectedIntegrityState: selected.integrity,
    },
    limitation:
      "A ledger establishes preserved sequence and linkage only to the extent its digests, signatures, time sources, identities, and predecessor records can be independently verified.",
  };

  async function copyLedger() {
    await navigator.clipboard.writeText(JSON.stringify(ledgerPackage, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="ledger-page">
      <style>{`
        * { box-sizing: border-box; }

        .ledger-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .ledger-wrap {
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
            radial-gradient(circle at 84% 8%, rgba(127, 117, 255, .18), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "HISTORY";
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #a89cff);
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
          background: linear-gradient(100deg, #56e6ff, #a89cff);
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
          grid-template-columns: minmax(220px, 1fr) 240px;
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

        .event-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .event-row:last-child { border-bottom: 0; }

        .event-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(168, 156, 255, .025));
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

        .pill.VALID, .pill.ACTIVE {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.BROKEN, .pill.REVOKED {
          color: #ff8e9b;
          border-color: rgba(255, 142, 155, .3);
        }

        .pill.UNKNOWN, .pill.DISPUTED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
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

        .timeline {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .timeline-item {
          position: relative;
          padding: 15px 15px 15px 38px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 16px;
          background: rgba(2, 9, 16, .52);
        }

        .timeline-item::before {
          content: "";
          position: absolute;
          left: 16px;
          top: 19px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #75e4f8;
          box-shadow: 0 0 0 5px rgba(117, 228, 248, .08);
        }

        .timeline-item strong {
          display: block;
          color: #dce8f3;
          font-size: .78rem;
        }

        .timeline-item span {
          display: block;
          margin-top: 5px;
          color: #8198ad;
          font-size: .7rem;
        }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #a89cff;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(168, 156, 255, .045);
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
          .ledger-wrap { width: min(100% - 24px, 1380px); }
          .ledger-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ledger-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">TA-14 Exchange · Route History Ledger</p>
            <h1>
              Follow every change.
              <br />
              <span className="gradient">Never rewrite the past.</span>
            </h1>
            <p className="hero-copy">
              Preserve route creation, versioning, tests, corrections, receipts,
              replay determinations, revocations, and outcomes as linked ledger
              events with predecessor identity and digest continuity visible.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/registry">
                Open Route Registry
              </Link>
              <Link className="button-secondary" href="/workspace/preservation">
                Open Preservation Vault
              </Link>
              <Link className="button-secondary" href="/workspace/replay">
                Open Replay Console
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.total}</strong>
            <span>Total events</span>
          </article>
          <article className="metric">
            <strong>{metrics.valid}</strong>
            <span>Valid links</span>
          </article>
          <article className="metric">
            <strong>{metrics.broken}</strong>
            <span>Broken links</span>
          </article>
          <article className="metric">
            <strong>{metrics.revoked}</strong>
            <span>Revoked events</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search route history"
            placeholder="Search event, route, actor, source, predecessor, or summary"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter ledger event type"
            value={type}
            onChange={(event) =>
              setType(event.target.value as LedgerEventType | "ALL")
            }
          >
            <option value="ALL">All event types</option>
            <option value="ROUTE_CREATED">ROUTE_CREATED</option>
            <option value="VERSION_PUBLISHED">VERSION_PUBLISHED</option>
            <option value="TEST_COMPLETED">TEST_COMPLETED</option>
            <option value="CORRECTION_OPENED">CORRECTION_OPENED</option>
            <option value="CORRECTION_RESOLVED">CORRECTION_RESOLVED</option>
            <option value="RECEIPT_ISSUED">RECEIPT_ISSUED</option>
            <option value="REPLAY_VERIFIED">REPLAY_VERIFIED</option>
            <option value="AUTHORITY_REVOKED">AUTHORITY_REVOKED</option>
            <option value="OUTCOME_PRESERVED">OUTCOME_PRESERVED</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Ledger events</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((event) => (
                <button
                  className={`event-row ${
                    selected.eventId === event.eventId ? "active" : ""
                  }`}
                  key={event.eventId}
                  type="button"
                  onClick={() => setSelectedId(event.eventId)}
                >
                  <div className="row-top">
                    <span className="route-name">{event.routeName}</span>
                    <span className={`pill ${event.integrity}`}>
                      {event.integrity}
                    </span>
                  </div>
                  <div className="mono">{event.eventId}</div>
                  <div className="meta">
                    <span>{event.type}</span>
                    <span>{event.state}</span>
                    <span>v{event.routeVersion}</span>
                    <span>{formatDate(event.recordedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No ledger event matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.integrity}`}>
                {selected.integrity}
              </span>
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.type}</span>
            </div>

            <h2>{selected.routeName}</h2>
            <div className="mono">{selected.eventId}</div>
            <p>{selected.summary}</p>

            <dl className="kv">
              <dt>Route ID</dt>
              <dd>{selected.routeId}</dd>

              <dt>Route version</dt>
              <dd>{selected.routeVersion}</dd>

              <dt>Occurred</dt>
              <dd>{formatDate(selected.occurredAt)}</dd>

              <dt>Recorded</dt>
              <dd>{formatDate(selected.recordedAt)}</dd>

              <dt>Actor</dt>
              <dd>{selected.actor}</dd>

              <dt>Source record</dt>
              <dd>{selected.sourceRecord}</dd>

              <dt>Previous event</dt>
              <dd>{selected.previousEventId}</dd>

              <dt>Previous digest</dt>
              <dd>{selected.previousDigest}</dd>

              <dt>Event digest</dt>
              <dd>{selected.eventDigest}</dd>
            </dl>

            <div className="timeline">
              {routeEvents.map((event) => (
                <button
                  className="timeline-item"
                  key={event.eventId}
                  type="button"
                  onClick={() => setSelectedId(event.eventId)}
                >
                  <strong>{event.type}</strong>
                  <span>
                    {event.eventId} · {formatDate(event.recordedAt)}
                  </span>
                </button>
              ))}
            </div>

            <div className="detail-actions">
              <button
                className="small-button"
                type="button"
                onClick={copyLedger}
              >
                {copied ? "Copied" : "Copy ledger package"}
              </button>
              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.routeId.toLowerCase()}-history-ledger.json`,
                    ledgerPackage,
                  )
                }
              >
                Download ledger
              </button>
              <Link className="small-button" href="/workspace/verify">
                Verify records
              </Link>
            </div>

            <div className="notice">
              Ledger continuity cannot be inferred from ordering alone. Each
              event must preserve its predecessor identity, predecessor digest,
              event digest, actor, time source, and source record for the chain
              to remain independently reviewable.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
