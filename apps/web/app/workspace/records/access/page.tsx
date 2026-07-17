"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type AccessState =
  | "REQUESTED"
  | "AUTHORIZED"
  | "DENIED"
  | "ACCESSED"
  | "EXPIRED"
  | "REVOKED";

type AccessPurpose =
  | "INDEPENDENT_REVIEW"
  | "COMPLIANCE"
  | "LITIGATION_SUPPORT"
  | "RESEARCH"
  | "OPERATIONAL_RESPONSE"
  | "OWNER_REQUEST"
  | "REGULATORY_REQUEST"
  | "OTHER";

type DisclosureScope =
  | "METADATA_ONLY"
  | "SUMMARY"
  | "VERIFICATION_REPORT"
  | "EVIDENCE_MANIFEST"
  | "SELECTED_EVIDENCE"
  | "FULL_PACKAGE";

type AccessEvent = {
  accessId: string;
  recordId: string;
  listingId: string;
  recordTitle: string;
  recordVersion: string;
  requester: string;
  organization: string;
  purpose: AccessPurpose;
  scope: DisclosureScope;
  state: AccessState;
  requestedAt: string;
  authorizedAt: string;
  accessedAt: string;
  expiresAt: string;
  authorizedBy: string;
  authorityBasis: string;
  disclosedArtifacts: string[];
  redactions: string[];
  conditions: string[];
  deliveryMethod: string;
  accessReceiptId: string;
};

const initialEvents: AccessEvent[] = [
  {
    accessId: "TA14-RAL-000081",
    recordId: "TA14-AR-2026-000179",
    listingId: "TA14-ARX-000041",
    recordTitle: "Facility Moisture Excursion Record",
    recordVersion: "2.1.0",
    requester: "Independent Facility Auditor",
    organization: "North Basin Assurance",
    purpose: "COMPLIANCE",
    scope: "FULL_PACKAGE",
    state: "ACCESSED",
    requestedAt: "2026-07-17T17:10:00.000Z",
    authorizedAt: "2026-07-17T17:16:00.000Z",
    accessedAt: "2026-07-17T17:24:00.000Z",
    expiresAt: "2026-07-24T17:24:00.000Z",
    authorizedBy: "North Basin Operations",
    authorityBasis:
      "Record owner authorized disclosure for a defined compliance review.",
    disclosedArtifacts: [
      "TA14_ADMISSIBLE_RECORD_PACKAGE_V1",
      "TA14-ARV-000116",
      "TA14-CUST-PKG-000179",
      "TA14-PR-000588",
    ],
    redactions: [
      "Employee personal contact information",
      "Internal network identifiers",
    ],
    conditions: [
      "Use only for the stated compliance review.",
      "Do not redistribute disclosed evidence.",
      "Recheck revocation status before issuing a final report.",
    ],
    deliveryMethod: "Time-limited authenticated workspace session",
    accessReceiptId: "TA14-ACC-000081",
  },
  {
    accessId: "TA14-RAL-000080",
    recordId: "TA14-AR-2026-000184",
    listingId: "TA14-ARX-000042",
    recordTitle: "Field Equipment Condition Record",
    recordVersion: "1.0.0",
    requester: "Property Representative",
    organization: "Lido Condominiums",
    purpose: "OWNER_REQUEST",
    scope: "SELECTED_EVIDENCE",
    state: "AUTHORIZED",
    requestedAt: "2026-07-17T16:40:00.000Z",
    authorizedAt: "2026-07-17T16:48:00.000Z",
    accessedAt: "PENDING",
    expiresAt: "2026-07-20T16:48:00.000Z",
    authorizedBy: "Transparent Air",
    authorityBasis:
      "Authorized property representative requested access to service evidence.",
    disclosedArtifacts: [
      "Operating-condition video",
      "Field analyzer output",
      "Human-readable record summary",
    ],
    redactions: [
      "Technician private contact information",
      "Unrelated customer identifiers",
    ],
    conditions: [
      "Access does not include unpublished correction drafts.",
      "Evidence may not be edited or re-uploaded as an original artifact.",
    ],
    deliveryMethod: "Authenticated download package",
    accessReceiptId: "PENDING",
  },
  {
    accessId: "TA14-RAL-000079",
    recordId: "TA14-AR-2026-000172",
    listingId: "TA14-ARX-000039",
    recordTitle: "AI Payment Route Incident Record",
    recordVersion: "1.3.0",
    requester: "External Governance Consultant",
    organization: "Independent Advisory Group",
    purpose: "INDEPENDENT_REVIEW",
    scope: "FULL_PACKAGE",
    state: "DENIED",
    requestedAt: "2026-07-17T15:54:00.000Z",
    authorizedAt: "DENIED",
    accessedAt: "NOT ACCESSED",
    expiresAt: "NOT APPLICABLE",
    authorizedBy: "TA-14 Review Desk",
    authorityBasis:
      "Access denied because the record entered full-record revocation review.",
    disclosedArtifacts: [],
    redactions: [],
    conditions: [
      "Requester may reapply after revocation review is resolved.",
    ],
    deliveryMethod: "No delivery",
    accessReceiptId: "TA14-ACC-DENY-000079",
  },
];

function formatDate(value: string) {
  if (
    value === "PENDING" ||
    value === "DENIED" ||
    value === "NOT ACCESSED" ||
    value === "NOT APPLICABLE"
  ) {
    return value;
  }

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

export default function RecordAccessDisclosureLedgerPage() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedId, setSelectedId] = useState(initialEvents[0].accessId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<AccessState | "ALL">("ALL");
  const [scopeFilter, setScopeFilter] = useState<DisclosureScope | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return events.filter((event) => {
      const matchesQuery =
        !needle ||
        [
          event.accessId,
          event.recordId,
          event.listingId,
          event.recordTitle,
          event.requester,
          event.organization,
          event.purpose,
          event.scope,
          event.authorizedBy,
          event.authorityBasis,
          event.deliveryMethod,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || event.state === stateFilter) &&
        (scopeFilter === "ALL" || event.scope === scopeFilter)
      );
    });
  }, [events, query, scopeFilter, stateFilter]);

  const selected =
    events.find((event) => event.accessId === selectedId) ??
    filtered[0] ??
    events[0];

  const metrics = useMemo(
    () => ({
      authorized: events.filter((item) =>
        ["AUTHORIZED", "ACCESSED"].includes(item.state),
      ).length,
      denied: events.filter((item) => item.state === "DENIED").length,
      fullPackage: events.filter((item) => item.scope === "FULL_PACKAGE").length,
      active: events.filter((item) => item.state === "AUTHORIZED").length,
    }),
    [events],
  );

  const accessReceipt = {
    schema: "TA14_RECORD_ACCESS_DISCLOSURE_RECEIPT_V1",
    generatedAt: new Date().toISOString(),
    access: selected,
    governance: {
      versionBound: true,
      purposeBound: true,
      scopeBound: true,
      redactionsPreserved: true,
      conditionsPreserved: true,
      disclosureArtifactsEnumerated: true,
      silentDisclosureProhibited: true,
    },
    limitation:
      "An access receipt records authorization, scope, delivery, and disclosed artifacts. It does not expand the requester's authority, transfer ownership, or authorize redistribution beyond the recorded conditions.",
  };

  function transition(nextState: AccessState) {
    setEvents((items) =>
      items.map((item) =>
        item.accessId === selected.accessId
          ? {
              ...item,
              state: nextState,
              authorizedAt:
                nextState === "AUTHORIZED" && item.authorizedAt === "PENDING"
                  ? new Date().toISOString()
                  : item.authorizedAt,
              accessedAt:
                nextState === "ACCESSED"
                  ? new Date().toISOString()
                  : item.accessedAt,
              accessReceiptId:
                nextState === "ACCESSED" && item.accessReceiptId === "PENDING"
                  ? `TA14-ACC-${Math.floor(100000 + Math.random() * 900000)}`
                  : item.accessReceiptId,
            }
          : item,
      ),
    );
  }

  async function copyReceipt() {
    await navigator.clipboard.writeText(JSON.stringify(accessReceipt, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="access-page">
      <style>{`
        * { box-sizing: border-box; }

        .access-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .access-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(105, 168, 255, .17), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "ACCESS";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4.7rem, 12vw, 10rem);
          font-weight: 1000;
          letter-spacing: -.1em;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 990px;
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #69a8ff);
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
          background: linear-gradient(100deg, #56e6ff, #69a8ff);
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
          grid-template-columns: minmax(220px, 1fr) 220px 240px;
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

        .access-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .access-row:last-child { border-bottom: 0; }

        .access-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(105, 168, 255, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .access-title { font-weight: 900; }

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

        .pill.AUTHORIZED, .pill.ACCESSED {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.REQUESTED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.DENIED, .pill.EXPIRED, .pill.REVOKED {
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
          border-left: 3px solid #69a8ff;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(105, 168, 255, .045);
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
          .access-wrap { width: min(100% - 24px, 1420px); }
          .access-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="access-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Record Access & Disclosure Ledger
            </p>
            <h1>
              Govern every disclosure.
              <br />
              <span className="gradient">Record every access.</span>
            </h1>
            <p className="hero-copy">
              Preserve who requested access, who authorized it, which record
              version and artifacts were disclosed, the purpose, scope,
              redactions, conditions, delivery method, expiration, and receipt.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/records/exchange">
                Open Record Exchange
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/reliance"
              >
                Open Reliance Ledger
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/revocations"
              >
                Check Revocations
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.authorized}</strong>
            <span>Authorized or accessed</span>
          </article>
          <article className="metric">
            <strong>{metrics.active}</strong>
            <span>Awaiting access</span>
          </article>
          <article className="metric">
            <strong>{metrics.denied}</strong>
            <span>Denied</span>
          </article>
          <article className="metric">
            <strong>{metrics.fullPackage}</strong>
            <span>Full-package requests</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search access events"
            placeholder="Search record, requester, organization, purpose, scope, or authority"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter access state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as AccessState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="REQUESTED">REQUESTED</option>
            <option value="AUTHORIZED">AUTHORIZED</option>
            <option value="DENIED">DENIED</option>
            <option value="ACCESSED">ACCESSED</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="REVOKED">REVOKED</option>
          </select>

          <select
            aria-label="Filter disclosure scope"
            value={scopeFilter}
            onChange={(event) =>
              setScopeFilter(event.target.value as DisclosureScope | "ALL")
            }
          >
            <option value="ALL">All disclosure scopes</option>
            <option value="METADATA_ONLY">METADATA_ONLY</option>
            <option value="SUMMARY">SUMMARY</option>
            <option value="VERIFICATION_REPORT">VERIFICATION_REPORT</option>
            <option value="EVIDENCE_MANIFEST">EVIDENCE_MANIFEST</option>
            <option value="SELECTED_EVIDENCE">SELECTED_EVIDENCE</option>
            <option value="FULL_PACKAGE">FULL_PACKAGE</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Access and disclosure events</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((event) => (
                <button
                  className={`access-row ${
                    selected.accessId === event.accessId ? "active" : ""
                  }`}
                  key={event.accessId}
                  type="button"
                  onClick={() => setSelectedId(event.accessId)}
                >
                  <div className="row-top">
                    <span className="access-title">{event.recordTitle}</span>
                    <span className={`pill ${event.state}`}>{event.state}</span>
                  </div>
                  <div className="mono">{event.accessId}</div>
                  <div className="meta">
                    <span>{event.scope}</span>
                    <span>{event.purpose}</span>
                    <span>{event.requester}</span>
                    <span>v{event.recordVersion}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No access event matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.scope}</span>
              <span className="pill">{selected.purpose}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.accessId}</div>
            <p>{selected.authorityBasis}</p>

            <dl className="kv">
              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Listing ID</dt>
              <dd>{selected.listingId}</dd>

              <dt>Version</dt>
              <dd>{selected.recordVersion}</dd>

              <dt>Requester</dt>
              <dd>{selected.requester}</dd>

              <dt>Organization</dt>
              <dd>{selected.organization}</dd>

              <dt>Authorized by</dt>
              <dd>{selected.authorizedBy}</dd>

              <dt>Requested</dt>
              <dd>{formatDate(selected.requestedAt)}</dd>

              <dt>Authorized</dt>
              <dd>{formatDate(selected.authorizedAt)}</dd>

              <dt>Accessed</dt>
              <dd>{formatDate(selected.accessedAt)}</dd>

              <dt>Expires</dt>
              <dd>{formatDate(selected.expiresAt)}</dd>

              <dt>Delivery method</dt>
              <dd>{selected.deliveryMethod}</dd>

              <dt>Receipt</dt>
              <dd>{selected.accessReceiptId}</dd>
            </dl>

            <div className="box">
              <strong>Disclosed artifacts</strong>
              {selected.disclosedArtifacts.length ? (
                <ul>
                  {selected.disclosedArtifacts.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No artifacts disclosed.</p>
              )}
            </div>

            <div className="box">
              <strong>Redactions</strong>
              {selected.redactions.length ? (
                <ul>
                  {selected.redactions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No redactions recorded.</p>
              )}
            </div>

            <div className="box">
              <strong>Conditions</strong>
              <ul>
                {selected.conditions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={() => transition("AUTHORIZED")}
              >
                Authorize access
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("ACCESSED")}
                disabled={selected.state !== "AUTHORIZED"}
              >
                Record access
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("DENIED")}
              >
                Deny request
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("REVOKED")}
              >
                Revoke access
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyReceipt}
              >
                {copied ? "Copied" : "Copy access receipt"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.accessId.toLowerCase()}-access-receipt.json`,
                    accessReceipt,
                  )
                }
              >
                Download receipt
              </button>
            </div>

            <div className="notice">
              Access authorization is version-, purpose-, and scope-bound. It
              does not transfer ownership, permit unrestricted redistribution,
              or create authority beyond the recorded conditions.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
