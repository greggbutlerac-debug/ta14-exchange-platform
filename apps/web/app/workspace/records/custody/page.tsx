"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CustodyState =
  | "RECEIVED"
  | "VERIFIED"
  | "TRANSFERRED"
  | "SEALED"
  | "DISPUTED"
  | "REVOKED";

type IntegrityState = "MATCH" | "MISMATCH" | "UNKNOWN";
type TransferMethod =
  | "DIRECT_UPLOAD"
  | "SECURE_API"
  | "DEVICE_CAPTURE"
  | "MANUAL_TRANSFER"
  | "EXTERNAL_IMPORT";

type CustodyEvent = {
  eventId: string;
  evidenceId: string;
  recordId: string;
  evidenceName: string;
  state: CustodyState;
  integrity: IntegrityState;
  custodianFrom: string;
  custodianTo: string;
  transferMethod: TransferMethod;
  occurredAt: string;
  recordedAt: string;
  location: string;
  sourceDigest: string;
  receivedDigest: string;
  previousEventId: string;
  notes: string;
};

const initialEvents: CustodyEvent[] = [
  {
    eventId: "TA14-CUST-000194",
    evidenceId: "TA14-EV-0001",
    recordId: "TA14-AR-2026-000184",
    evidenceName: "RTU-4 operating-condition video",
    state: "VERIFIED",
    integrity: "MATCH",
    custodianFrom: "Body-worn field camera",
    custodianTo: "TA-14 Preservation Vault",
    transferMethod: "DEVICE_CAPTURE",
    occurredAt: "2026-07-17T14:35:00.000Z",
    recordedAt: "2026-07-17T14:35:06.000Z",
    location: "Clearwater, Florida",
    sourceDigest:
      "sha256:ab804c7a3f5b5a1df268d07f815ac9877f1f9f0b2ac8fc903ef7b063d21c12a4",
    receivedDigest:
      "sha256:ab804c7a3f5b5a1df268d07f815ac9877f1f9f0b2ac8fc903ef7b063d21c12a4",
    previousEventId: "TA14-CUST-000193",
    notes:
      "Original media transferred directly from the identified capture device. Source and received digests correspond.",
  },
  {
    eventId: "TA14-CUST-000195",
    evidenceId: "TA14-EV-0002",
    recordId: "TA14-AR-2026-000184",
    evidenceName: "Compressor current and voltage measurements",
    state: "SEALED",
    integrity: "MATCH",
    custodianFrom: "TA-14 Field Analyzer",
    custodianTo: "TA-14 Preservation Vault",
    transferMethod: "SECURE_API",
    occurredAt: "2026-07-17T14:41:00.000Z",
    recordedAt: "2026-07-17T14:41:02.000Z",
    location: "Clearwater, Florida",
    sourceDigest:
      "sha256:d611e93b92446ac255f3bba76144bcd63ef136e14328779f107cd03445cb6018",
    receivedDigest:
      "sha256:d611e93b92446ac255f3bba76144bcd63ef136e14328779f107cd03445cb6018",
    previousEventId: "TA14-CUST-000194",
    notes:
      "Measurement package sealed after deterministic normalization and preservation.",
  },
  {
    eventId: "TA14-CUST-000196",
    evidenceId: "TA14-EV-0003",
    recordId: "TA14-AR-2026-000184",
    evidenceName: "Property representative authorization email",
    state: "RECEIVED",
    integrity: "UNKNOWN",
    custodianFrom: "Property representative",
    custodianTo: "Transparent Air",
    transferMethod: "EXTERNAL_IMPORT",
    occurredAt: "2026-07-17T13:58:00.000Z",
    recordedAt: "2026-07-17T15:03:00.000Z",
    location: "Remote",
    sourceDigest: "UNKNOWN",
    receivedDigest:
      "sha256:5b35d6d22f09329fd4a5e37487c1a80d4c2a569a2d6f5c9f05334588d9750e19",
    previousEventId: "TA14-CUST-000195",
    notes:
      "Imported email copy received without a source-system digest. Authenticity remains subject to independent verification.",
  },
  {
    eventId: "TA14-CUST-000197",
    evidenceId: "TA14-EV-0004",
    recordId: "TA14-AR-2026-000184",
    evidenceName: "Third-party service invoice",
    state: "DISPUTED",
    integrity: "MISMATCH",
    custodianFrom: "External service provider",
    custodianTo: "Transparent Air",
    transferMethod: "MANUAL_TRANSFER",
    occurredAt: "2026-07-16T17:20:00.000Z",
    recordedAt: "2026-07-17T15:15:00.000Z",
    location: "Remote",
    sourceDigest:
      "sha256:2cc9c84f4d57d4a341b6b42264cb922fb0a9a8134eec41d2859bf9f9fdf88fd1",
    receivedDigest:
      "sha256:9ddf197b2a0f29a90b3ed3b4cbcf1fe3b2b4ceff23ff615e93df47ea73467111",
    previousEventId: "TA14-CUST-000196",
    notes:
      "Received digest does not match the digest supplied by the source. Evidence is preserved but not treated as continuous.",
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

export default function EvidenceCustodyDeskPage() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedId, setSelectedId] = useState(initialEvents[0].eventId);
  const [query, setQuery] = useState("");
  const [integrity, setIntegrity] = useState<IntegrityState | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return events.filter((event) => {
      const matchesQuery =
        !needle ||
        [
          event.eventId,
          event.evidenceId,
          event.recordId,
          event.evidenceName,
          event.custodianFrom,
          event.custodianTo,
          event.location,
          event.transferMethod,
          event.notes,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (integrity === "ALL" || event.integrity === integrity)
      );
    });
  }, [events, integrity, query]);

  const selected =
    events.find((event) => event.eventId === selectedId) ??
    filtered[0] ??
    events[0];

  const recordEvents = useMemo(
    () =>
      events
        .filter((event) => event.recordId === selected.recordId)
        .sort(
          (a, b) =>
            new Date(a.recordedAt).getTime() -
            new Date(b.recordedAt).getTime(),
        ),
    [events, selected.recordId],
  );

  const metrics = useMemo(
    () => ({
      total: events.length,
      match: events.filter((event) => event.integrity === "MATCH").length,
      unknown: events.filter((event) => event.integrity === "UNKNOWN").length,
      mismatch: events.filter((event) => event.integrity === "MISMATCH").length,
    }),
    [events],
  );

  const custodyPackage = {
    schema: "TA14_EVIDENCE_CUSTODY_PACKAGE_V1",
    exportedAt: new Date().toISOString(),
    selectedEvent: selected,
    recordCustodyHistory: recordEvents,
    continuityAssessment: {
      sourceDigestPresent: selected.sourceDigest !== "UNKNOWN",
      receivedDigestPresent: selected.receivedDigest !== "UNKNOWN",
      digestCorrespondence:
        selected.sourceDigest !== "UNKNOWN" &&
        selected.sourceDigest === selected.receivedDigest,
      predecessorRecorded:
        selected.previousEventId !== "UNKNOWN" &&
        selected.previousEventId !== "NONE",
      integrityState: selected.integrity,
    },
    limitation:
      "Custody records preserve transfer history and integrity observations. They do not independently prove source authenticity, truth of content, legal admissibility, or authority to create a consequence.",
  };

  function verifyDigest() {
    if (
      selected.sourceDigest === "UNKNOWN" ||
      selected.receivedDigest === "UNKNOWN"
    ) {
      return;
    }

    setEvents((items) =>
      items.map((item) =>
        item.eventId === selected.eventId
          ? {
              ...item,
              integrity:
                item.sourceDigest === item.receivedDigest
                  ? "MATCH"
                  : "MISMATCH",
              state:
                item.sourceDigest === item.receivedDigest
                  ? "VERIFIED"
                  : "DISPUTED",
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(JSON.stringify(custodyPackage, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="custody-page">
      <style>{`
        * { box-sizing: border-box; }

        .custody-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .custody-wrap {
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
            radial-gradient(circle at 84% 8%, rgba(255, 193, 92, .17), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "CUSTODY";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(5rem, 13vw, 11rem);
          font-weight: 1000;
          letter-spacing: -.1em;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 960px;
        }

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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ffc15c);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 850px;
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
          background: linear-gradient(100deg, #56e6ff, #ffc15c);
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

        .custody-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .custody-row:last-child { border-bottom: 0; }

        .custody-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 193, 92, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .evidence-name { font-weight: 900; }

        .mono {
          margin-top: 7px;
          overflow-wrap: anywhere;
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

        .pill.MATCH, .pill.VERIFIED, .pill.SEALED {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.UNKNOWN, .pill.RECEIVED, .pill.TRANSFERRED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.MISMATCH, .pill.DISPUTED, .pill.REVOKED {
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

        .kv {
          display: grid;
          grid-template-columns: 165px 1fr;
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
          border-left: 3px solid #ffc15c;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 193, 92, .045);
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
          .custody-wrap { width: min(100% - 24px, 1380px); }
          .custody-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="custody-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">TA-14 Exchange · Evidence Custody Desk</p>
            <h1>
              Preserve every transfer.
              <br />
              <span className="gradient">Expose every break.</span>
            </h1>
            <p className="hero-copy">
              Track who held the evidence, when it moved, how it moved, what
              digest was supplied, what digest arrived, and whether continuity
              remained intact from source through preservation.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/records">
                Open Record Studio
              </Link>
              <Link className="button-secondary" href="/workspace/preservation">
                Open Preservation Vault
              </Link>
              <Link className="button-secondary" href="/workspace/verify">
                Open Verification
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.total}</strong>
            <span>Custody events</span>
          </article>
          <article className="metric">
            <strong>{metrics.match}</strong>
            <span>Digest matches</span>
          </article>
          <article className="metric">
            <strong>{metrics.unknown}</strong>
            <span>Unknown integrity</span>
          </article>
          <article className="metric">
            <strong>{metrics.mismatch}</strong>
            <span>Digest mismatches</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search custody events"
            placeholder="Search record, evidence, custodian, location, method, or notes"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter integrity state"
            value={integrity}
            onChange={(event) =>
              setIntegrity(event.target.value as IntegrityState | "ALL")
            }
          >
            <option value="ALL">All integrity states</option>
            <option value="MATCH">MATCH</option>
            <option value="UNKNOWN">UNKNOWN</option>
            <option value="MISMATCH">MISMATCH</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Evidence custody events</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((event) => (
                <button
                  className={`custody-row ${
                    selected.eventId === event.eventId ? "active" : ""
                  }`}
                  key={event.eventId}
                  type="button"
                  onClick={() => setSelectedId(event.eventId)}
                >
                  <div className="row-top">
                    <span className="evidence-name">{event.evidenceName}</span>
                    <span className={`pill ${event.integrity}`}>
                      {event.integrity}
                    </span>
                  </div>
                  <div className="mono">{event.eventId}</div>
                  <div className="meta">
                    <span>{event.state}</span>
                    <span>{event.transferMethod}</span>
                    <span>{event.recordId}</span>
                    <span>{formatDate(event.recordedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No custody event matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className={`pill ${selected.integrity}`}>
                {selected.integrity}
              </span>
              <span className="pill">{selected.transferMethod}</span>
            </div>

            <h2>{selected.evidenceName}</h2>
            <div className="mono">{selected.eventId}</div>
            <p>{selected.notes}</p>

            <dl className="kv">
              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Evidence ID</dt>
              <dd>{selected.evidenceId}</dd>

              <dt>From</dt>
              <dd>{selected.custodianFrom}</dd>

              <dt>To</dt>
              <dd>{selected.custodianTo}</dd>

              <dt>Occurred</dt>
              <dd>{formatDate(selected.occurredAt)}</dd>

              <dt>Recorded</dt>
              <dd>{formatDate(selected.recordedAt)}</dd>

              <dt>Location</dt>
              <dd>{selected.location}</dd>

              <dt>Previous event</dt>
              <dd>{selected.previousEventId}</dd>

              <dt>Source digest</dt>
              <dd>{selected.sourceDigest}</dd>

              <dt>Received digest</dt>
              <dd>{selected.receivedDigest}</dd>
            </dl>

            <div className="timeline">
              {recordEvents.map((event) => (
                <button
                  className="timeline-item"
                  key={event.eventId}
                  type="button"
                  onClick={() => setSelectedId(event.eventId)}
                >
                  <strong>
                    {event.evidenceName} · {event.integrity}
                  </strong>
                  <span>
                    {event.custodianFrom} → {event.custodianTo}
                  </span>
                </button>
              ))}
            </div>

            <div className="detail-actions">
              <button
                className="small-button"
                type="button"
                onClick={verifyDigest}
                disabled={
                  selected.sourceDigest === "UNKNOWN" ||
                  selected.receivedDigest === "UNKNOWN"
                }
              >
                Verify digest correspondence
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy custody package"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.eventId.toLowerCase()}-custody-package.json`,
                    custodyPackage,
                  )
                }
              >
                Download package
              </button>

              <Link className="small-button" href="/workspace/review">
                Request review
              </Link>
            </div>

            <div className="notice">
              A custody record preserves transfer history and integrity
              observations. It does not independently establish truth,
              authenticity, authority, or legal admissibility.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
