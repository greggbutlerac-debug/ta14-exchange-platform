"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RelianceState =
  | "PERMITTED"
  | "CONDITIONAL"
  | "SUSPENDED"
  | "REVOKED"
  | "EXPIRED";

type ReliancePurpose =
  | "INDEPENDENT_REVIEW"
  | "RESEARCH"
  | "OPERATIONAL_DECISION"
  | "COMPLIANCE"
  | "CERTIFICATION"
  | "LITIGATION_SUPPORT"
  | "TRAINING"
  | "OTHER";

type RelianceEvent = {
  relianceId: string;
  recordId: string;
  listingId: string;
  recordTitle: string;
  recordVersion: string;
  reliedUponBy: string;
  organization: string;
  purpose: ReliancePurpose;
  state: RelianceState;
  requestedAt: string;
  grantedAt: string;
  expiresAt: string;
  authorityBasis: string;
  conditions: string[];
  prohibitedUses: string[];
  citedArtifact: string;
  verificationReportId: string;
  revocationCheck: string;
  acknowledgement: string;
};

const initialRelianceEvents: RelianceEvent[] = [
  {
    relianceId: "TA14-RRL-000051",
    recordId: "TA14-AR-2026-000179",
    listingId: "TA14-ARX-000041",
    recordTitle: "Facility Moisture Excursion Record",
    recordVersion: "2.1.0",
    reliedUponBy: "Independent Facility Auditor",
    organization: "North Basin Assurance",
    purpose: "COMPLIANCE",
    state: "CONDITIONAL",
    requestedAt: "2026-07-17T17:18:00.000Z",
    grantedAt: "2026-07-17T17:22:00.000Z",
    expiresAt: "2026-10-17T17:22:00.000Z",
    authorityBasis:
      "Public verified record with owner-authorized compliance-review use.",
    conditions: [
      "Cite version 2.1.0 and verification report TA14-ARV-000116.",
      "Disclose the preserved sensor-outage limitation.",
      "Recheck revocation and supersession status before final reliance.",
    ],
    prohibitedUses: [
      "Do not represent the record as proof of uninterrupted measurement.",
      "Do not use the record to create execution authority.",
    ],
    citedArtifact: "TA14_ADMISSIBLE_RECORD_PACKAGE_V1",
    verificationReportId: "TA14-ARV-000116",
    revocationCheck: "CLEAR AS OF 2026-07-17T17:21:52.000Z",
    acknowledgement:
      "Reviewer acknowledged that verification establishes package correspondence, not universal truth or legal admissibility.",
  },
  {
    relianceId: "TA14-RRL-000050",
    recordId: "TA14-AR-2026-000184",
    listingId: "TA14-ARX-000042",
    recordTitle: "Field Equipment Condition Record",
    recordVersion: "1.0.0",
    reliedUponBy: "Property Representative",
    organization: "Lido Condominiums",
    purpose: "OPERATIONAL_DECISION",
    state: "SUSPENDED",
    requestedAt: "2026-07-17T16:50:00.000Z",
    grantedAt: "PENDING",
    expiresAt: "PENDING",
    authorityBasis:
      "Owner-requested review of a condition record pending completion of signature verification and contextual correction.",
    conditions: [
      "Reliance may resume only after verification is complete.",
      "Correction TA14-ARC-000024 must be reviewed.",
    ],
    prohibitedUses: [
      "Do not rely on the current record for final repair attribution.",
      "Do not publish the record as verified.",
    ],
    citedArtifact: "TA14_ADMISSIBLE_RECORD_PACKAGE_V1",
    verificationReportId: "TA14-ARV-000117",
    revocationCheck: "CLEAR",
    acknowledgement:
      "Requester acknowledged that the record remains incomplete and under correction review.",
  },
  {
    relianceId: "TA14-RRL-000049",
    recordId: "TA14-AR-2026-000172",
    listingId: "TA14-ARX-000039",
    recordTitle: "AI Payment Route Incident Record",
    recordVersion: "1.3.0",
    reliedUponBy: "Internal Risk Committee",
    organization: "Orchard Systems",
    purpose: "OPERATIONAL_DECISION",
    state: "REVOKED",
    requestedAt: "2026-07-16T23:02:00.000Z",
    grantedAt: "2026-07-16T23:08:00.000Z",
    expiresAt: "2026-07-17T17:03:00.000Z",
    authorityBasis:
      "Internal governance review of a preserved incident record.",
    conditions: [
      "Use only for internal investigation.",
      "Recheck package integrity before any final decision.",
    ],
    prohibitedUses: [
      "No external publication.",
      "No certification or enforcement action.",
    ],
    citedArtifact: "TA14_ADMISSIBLE_RECORD_PACKAGE_V1",
    verificationReportId: "TA14-ARV-000115",
    revocationCheck: "REVOKED BY TA14-ARR-000012",
    acknowledgement:
      "Reliance terminated after package corruption entered revocation review.",
  },
];

function formatDate(value: string) {
  if (value === "PENDING") return value;
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

export default function RecordRelianceLedgerPage() {
  const [events, setEvents] = useState(initialRelianceEvents);
  const [selectedId, setSelectedId] = useState(initialRelianceEvents[0].relianceId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<RelianceState | "ALL">("ALL");
  const [purposeFilter, setPurposeFilter] = useState<ReliancePurpose | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return events.filter((event) => {
      const matchesQuery =
        !needle ||
        [
          event.relianceId,
          event.recordId,
          event.listingId,
          event.recordTitle,
          event.reliedUponBy,
          event.organization,
          event.purpose,
          event.authorityBasis,
          event.verificationReportId,
          event.revocationCheck,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || event.state === stateFilter) &&
        (purposeFilter === "ALL" || event.purpose === purposeFilter)
      );
    });
  }, [events, purposeFilter, query, stateFilter]);

  const selected =
    events.find((event) => event.relianceId === selectedId) ??
    filtered[0] ??
    events[0];

  const metrics = useMemo(
    () => ({
      active: events.filter((item) =>
        ["PERMITTED", "CONDITIONAL"].includes(item.state),
      ).length,
      suspended: events.filter((item) => item.state === "SUSPENDED").length,
      revoked: events.filter((item) => item.state === "REVOKED").length,
      operational: events.filter(
        (item) => item.purpose === "OPERATIONAL_DECISION",
      ).length,
    }),
    [events],
  );

  const relianceReceipt = {
    schema: "TA14_RECORD_RELIANCE_RECEIPT_V1",
    generatedAt: new Date().toISOString(),
    reliance: selected,
    governance: {
      versionBound: true,
      verificationBound: true,
      revocationCheckRequired: true,
      supersessionCheckRequired: true,
      conditionsPreserved: true,
      prohibitedUsesPreserved: true,
    },
    limitation:
      "A reliance receipt records who relied on which version, for what purpose, under what authority, conditions, and restrictions. It does not create authority beyond the stated scope or guarantee the underlying record is legally admissible.",
  };

  function transition(nextState: RelianceState) {
    setEvents((items) =>
      items.map((item) =>
        item.relianceId === selected.relianceId
          ? {
              ...item,
              state: nextState,
              grantedAt:
                nextState === "PERMITTED" || nextState === "CONDITIONAL"
                  ? item.grantedAt === "PENDING"
                    ? new Date().toISOString()
                    : item.grantedAt
                  : item.grantedAt,
              expiresAt:
                nextState === "REVOKED"
                  ? new Date().toISOString()
                  : item.expiresAt,
            }
          : item,
      ),
    );
  }

  async function copyReceipt() {
    await navigator.clipboard.writeText(
      JSON.stringify(relianceReceipt, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="reliance-page">
      <style>{`
        * { box-sizing: border-box; }

        .reliance-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .reliance-wrap {
          width: min(1420px, calc(100% - 48px));
          margin: 0 auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: clamp(32px, 5vw, 68px);
          border: 1px solid rgba(132, 177, 216, .16);
          border-radius: 34px;
          background:
            radial-gradient(circle at 85% 7%, rgba(84, 239, 174, .16), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "RELIANCE";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4.4rem, 11vw, 9.5rem);
          font-weight: 1000;
          letter-spacing: -.1em;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 980px;
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #54efae);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 900px;
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
          background: linear-gradient(100deg, #56e6ff, #54efae);
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
          grid-template-columns: minmax(220px, 1fr) 220px 260px;
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

        .reliance-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .reliance-row:last-child { border-bottom: 0; }

        .reliance-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(84, 239, 174, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .reliance-title { font-weight: 900; }

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

        .pill.PERMITTED {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.CONDITIONAL, .pill.SUSPENDED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.REVOKED, .pill.EXPIRED {
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
          grid-template-columns: 170px 1fr;
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

        .box {
          margin-top: 17px;
          padding: 16px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .box strong {
          display: block;
          color: #dce8f3;
          font-size: .76rem;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .box p {
          margin: 10px 0 0;
          font-size: .8rem;
        }

        .box ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #9fb1c1;
          line-height: 1.65;
        }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #54efae;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(84, 239, 174, .04);
          font-size: .82rem;
          line-height: 1.65;
        }

        .empty {
          padding: 42px 22px;
          color: #8399ad;
          text-align: center;
          line-height: 1.7;
        }

        @media (max-width: 1040px) {
          .grid { grid-template-columns: 1fr; }
          .detail { position: static; }
        }

        @media (max-width: 760px) {
          .reliance-wrap { width: min(100% - 24px, 1420px); }
          .reliance-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="reliance-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Record Reliance Ledger
            </p>
            <h1>
              Record who relied.
              <br />
              <span className="gradient">Bind why they relied.</span>
            </h1>
            <p className="hero-copy">
              Preserve who relied on a record, which version they used, the
              purpose, authority, verification state, conditions, prohibited
              uses, revocation check, and acknowledgement made before reliance.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/records/exchange">
                Open Record Exchange
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/revocations"
              >
                Check Revocations
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/verify"
              >
                Check Verification
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.active}</strong>
            <span>Active reliance</span>
          </article>
          <article className="metric">
            <strong>{metrics.suspended}</strong>
            <span>Suspended</span>
          </article>
          <article className="metric">
            <strong>{metrics.revoked}</strong>
            <span>Revoked</span>
          </article>
          <article className="metric">
            <strong>{metrics.operational}</strong>
            <span>Operational decisions</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search reliance events"
            placeholder="Search record, user, organization, purpose, authority, or verification"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter reliance state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as RelianceState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="PERMITTED">PERMITTED</option>
            <option value="CONDITIONAL">CONDITIONAL</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="REVOKED">REVOKED</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>

          <select
            aria-label="Filter reliance purpose"
            value={purposeFilter}
            onChange={(event) =>
              setPurposeFilter(event.target.value as ReliancePurpose | "ALL")
            }
          >
            <option value="ALL">All purposes</option>
            <option value="INDEPENDENT_REVIEW">INDEPENDENT_REVIEW</option>
            <option value="RESEARCH">RESEARCH</option>
            <option value="OPERATIONAL_DECISION">OPERATIONAL_DECISION</option>
            <option value="COMPLIANCE">COMPLIANCE</option>
            <option value="CERTIFICATION">CERTIFICATION</option>
            <option value="LITIGATION_SUPPORT">LITIGATION_SUPPORT</option>
            <option value="TRAINING">TRAINING</option>
            <option value="OTHER">OTHER</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Reliance events</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((event) => (
                <button
                  className={`reliance-row ${
                    selected.relianceId === event.relianceId ? "active" : ""
                  }`}
                  key={event.relianceId}
                  type="button"
                  onClick={() => setSelectedId(event.relianceId)}
                >
                  <div className="row-top">
                    <span className="reliance-title">{event.recordTitle}</span>
                    <span className={`pill ${event.state}`}>{event.state}</span>
                  </div>
                  <div className="mono">{event.relianceId}</div>
                  <div className="meta">
                    <span>{event.purpose}</span>
                    <span>{event.reliedUponBy}</span>
                    <span>{event.organization}</span>
                    <span>v{event.recordVersion}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No reliance event matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.purpose}</span>
              <span className="pill">v{selected.recordVersion}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.relianceId}</div>
            <p>{selected.acknowledgement}</p>

            <dl className="kv">
              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Listing ID</dt>
              <dd>{selected.listingId}</dd>

              <dt>Relied upon by</dt>
              <dd>{selected.reliedUponBy}</dd>

              <dt>Organization</dt>
              <dd>{selected.organization}</dd>

              <dt>Requested</dt>
              <dd>{formatDate(selected.requestedAt)}</dd>

              <dt>Granted</dt>
              <dd>{formatDate(selected.grantedAt)}</dd>

              <dt>Expires</dt>
              <dd>{formatDate(selected.expiresAt)}</dd>

              <dt>Artifact</dt>
              <dd>{selected.citedArtifact}</dd>

              <dt>Verification</dt>
              <dd>{selected.verificationReportId}</dd>

              <dt>Revocation check</dt>
              <dd>{selected.revocationCheck}</dd>
            </dl>

            <div className="box">
              <strong>Authority basis</strong>
              <p>{selected.authorityBasis}</p>
            </div>

            <div className="box">
              <strong>Conditions of reliance</strong>
              <ul>
                {selected.conditions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Prohibited uses</strong>
              <ul>
                {selected.prohibitedUses.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={() => transition("PERMITTED")}
              >
                Permit reliance
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("CONDITIONAL")}
              >
                Make conditional
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("SUSPENDED")}
              >
                Suspend
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("REVOKED")}
              >
                Revoke
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyReceipt}
              >
                {copied ? "Copied" : "Copy reliance receipt"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.relianceId.toLowerCase()}-reliance-receipt.json`,
                    relianceReceipt,
                  )
                }
              >
                Download receipt
              </button>
            </div>

            <div className="notice">
              A reliance receipt does not make the record true. It proves who
              relied on which version, for what purpose, under which conditions,
              after which verification and revocation checks.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
