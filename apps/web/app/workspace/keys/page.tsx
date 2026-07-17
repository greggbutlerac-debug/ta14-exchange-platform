"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type KeyState = "ACTIVE" | "PENDING" | "SUSPENDED" | "REVOKED" | "EXPIRED";
type KeyPurpose =
  | "ROUTE_SIGNING"
  | "RECEIPT_SIGNING"
  | "DEVICE_IDENTITY"
  | "AUTHORITY_BINDING"
  | "OUTCOME_ATTESTATION";

type TrustLevel = "UNVERIFIED" | "REGISTERED" | "TRUSTED" | "RESTRICTED";

type KeyRecord = {
  keyId: string;
  ownerId: string;
  ownerName: string;
  purpose: KeyPurpose;
  algorithm: string;
  publicKeyFingerprint: string;
  state: KeyState;
  trustLevel: TrustLevel;
  issuedAt: string;
  expiresAt: string;
  registeredAt: string;
  revokedAt: string;
  revocationReason: string;
  sourceRecord: string;
  permittedScopes: string[];
  restrictions: string[];
};

const initialKeys: KeyRecord[] = [
  {
    keyId: "TA14-KEY-RECEIPT-001",
    ownerId: "TA14-ISSUER-01",
    ownerName: "TA-14 Receipt Issuer",
    purpose: "RECEIPT_SIGNING",
    algorithm: "Ed25519",
    publicKeyFingerprint:
      "SHA256:9A:13:72:4E:06:CB:91:66:2A:F8:7C:10:08:DA:95:33",
    state: "ACTIVE",
    trustLevel: "TRUSTED",
    issuedAt: "2026-07-01T12:00:00.000Z",
    expiresAt: "2027-07-01T12:00:00.000Z",
    registeredAt: "2026-07-01T12:04:00.000Z",
    revokedAt: "UNKNOWN",
    revocationReason: "NONE",
    sourceRecord: "TA14-KEYREG-1001",
    permittedScopes: [
      "TA14_ROUTE_TEST_RECEIPT_V1",
      "TA14_TEST_RECEIPT_PACKAGE_V1",
    ],
    restrictions: [
      "May not sign route authority.",
      "May not sign execution outcomes.",
    ],
  },
  {
    keyId: "TA14-KEY-DEVICE-114",
    ownerId: "TA14-DEVICE-ANALYZER-114",
    ownerName: "Field Analyzer 114",
    purpose: "DEVICE_IDENTITY",
    algorithm: "Ed25519",
    publicKeyFingerprint:
      "SHA256:2D:C8:A1:3F:77:49:BE:10:35:22:F9:90:CB:4D:61:7A",
    state: "PENDING",
    trustLevel: "REGISTERED",
    issuedAt: "2026-07-17T14:00:00.000Z",
    expiresAt: "2028-07-17T14:00:00.000Z",
    registeredAt: "2026-07-17T14:12:00.000Z",
    revokedAt: "UNKNOWN",
    revocationReason: "NONE",
    sourceRecord: "TA14-KEYREG-1140",
    permittedScopes: [
      "FIELD_EVIDENCE",
      "DEVICE_STATUS",
      "REFRIGERANT_INTERVENTION_RECORD",
    ],
    restrictions: [
      "Trust activation requires physical device attestation.",
      "Production signing is blocked until activation.",
    ],
  },
  {
    keyId: "TA14-KEY-AUTH-031",
    ownerId: "ORG-EXAMPLE-09",
    ownerName: "Example Organization Authority Service",
    purpose: "AUTHORITY_BINDING",
    algorithm: "P-256",
    publicKeyFingerprint:
      "SHA256:7B:11:8E:8D:84:05:38:E1:7C:AF:9A:4C:60:01:33:DE",
    state: "SUSPENDED",
    trustLevel: "RESTRICTED",
    issuedAt: "2026-05-20T10:30:00.000Z",
    expiresAt: "2027-05-20T10:30:00.000Z",
    registeredAt: "2026-05-20T11:02:00.000Z",
    revokedAt: "UNKNOWN",
    revocationReason:
      "Authority scope could not be reconciled with the current delegation record.",
    sourceRecord: "TA14-KEYREG-3102",
    permittedScopes: ["LOW_RISK_TOOL_ACTIONS"],
    restrictions: [
      "No financial execution.",
      "No employment consequence.",
      "No autonomous escalation.",
    ],
  },
  {
    keyId: "TA14-KEY-OUTCOME-008",
    ownerId: "PROCESSOR-SETTLEMENT-08",
    ownerName: "Settlement Outcome Service",
    purpose: "OUTCOME_ATTESTATION",
    algorithm: "RSA-PSS-SHA256",
    publicKeyFingerprint:
      "SHA256:4E:C5:10:11:AF:63:31:9A:65:86:87:C3:03:19:78:A4",
    state: "REVOKED",
    trustLevel: "UNVERIFIED",
    issuedAt: "2025-11-03T09:00:00.000Z",
    expiresAt: "2026-11-03T09:00:00.000Z",
    registeredAt: "2025-11-03T09:18:00.000Z",
    revokedAt: "2026-07-12T16:20:00.000Z",
    revocationReason: "Private-key exposure reported by issuer.",
    sourceRecord: "TA14-KEYREV-0081",
    permittedScopes: ["SETTLEMENT_OUTCOME"],
    restrictions: [
      "All signatures after revocation time are invalid.",
      "Pre-revocation signatures require timestamp verification.",
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

export default function TrustKeyRegistryPage() {
  const [keys, setKeys] = useState(initialKeys);
  const [selectedId, setSelectedId] = useState(initialKeys[0].keyId);
  const [query, setQuery] = useState("");
  const [purpose, setPurpose] = useState<KeyPurpose | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return keys.filter((key) => {
      const matchesQuery =
        !needle ||
        [
          key.keyId,
          key.ownerId,
          key.ownerName,
          key.algorithm,
          key.publicKeyFingerprint,
          key.sourceRecord,
          ...key.permittedScopes,
          ...key.restrictions,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return matchesQuery && (purpose === "ALL" || key.purpose === purpose);
    });
  }, [keys, purpose, query]);

  const selected =
    keys.find((key) => key.keyId === selectedId) ?? filtered[0] ?? keys[0];

  const metrics = useMemo(
    () => ({
      active: keys.filter((key) => key.state === "ACTIVE").length,
      pending: keys.filter((key) => key.state === "PENDING").length,
      restricted: keys.filter((key) => key.trustLevel === "RESTRICTED").length,
      revoked: keys.filter((key) => key.state === "REVOKED").length,
    }),
    [keys],
  );

  const keyPackage = {
    schema: "TA14_TRUST_KEY_REGISTRY_RECORD_V1",
    exportedAt: new Date().toISOString(),
    key: selected,
    verificationBoundary: {
      keyUsable:
        selected.state === "ACTIVE" && selected.trustLevel === "TRUSTED",
      revocationCheckRequired: true,
      scopeCheckRequired: true,
      expirationCheckRequired: true,
      algorithmCheckRequired: true,
    },
    limitation:
      "Key registration does not prove that a signature is valid. Verification still requires the exact canonical payload, signature bytes, algorithm, trusted public key, scope, timestamp, expiration status, and revocation status.",
  };

  function activateKey() {
    if (
      selected.state !== "PENDING" ||
      selected.trustLevel !== "REGISTERED"
    ) {
      return;
    }

    setKeys((items) =>
      items.map((item) =>
        item.keyId === selected.keyId
          ? { ...item, state: "ACTIVE", trustLevel: "TRUSTED" }
          : item,
      ),
    );
  }

  async function copyRecord() {
    await navigator.clipboard.writeText(JSON.stringify(keyPackage, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="keys-page">
      <style>{`
        * { box-sizing: border-box; }

        .keys-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .keys-wrap {
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
          content: "TRUST";
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ffc15c);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 840px;
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
          grid-template-columns: minmax(220px, 1fr) 235px;
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

        .key-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .key-row:last-child { border-bottom: 0; }

        .key-row.active {
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

        .owner-name { font-weight: 900; }

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

        .pill.ACTIVE, .pill.TRUSTED {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.PENDING, .pill.REGISTERED {
          color: #7bd9ff;
          border-color: rgba(123, 217, 255, .3);
        }

        .pill.SUSPENDED, .pill.RESTRICTED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.REVOKED, .pill.EXPIRED, .pill.UNVERIFIED {
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
          grid-template-columns: 160px 1fr;
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

        .list-box {
          margin-top: 18px;
          padding: 17px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .list-box strong {
          color: #e2edf6;
          font-size: .75rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .list-box ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #a3b5c5;
          line-height: 1.65;
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
          .keys-wrap { width: min(100% - 24px, 1380px); }
          .keys-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="keys-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">TA-14 Exchange · Trust Key Registry</p>
            <h1>
              Verify the signer.
              <br />
              <span className="gradient">Then verify the scope.</span>
            </h1>
            <p className="hero-copy">
              Register trusted public keys for route signing, receipt issuance,
              device identity, authority binding, and outcome attestation while
              preserving purpose, scope, algorithm, expiration, suspension, and
              revocation boundaries.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/verify">
                Verify a signature
              </Link>
              <Link className="button-secondary" href="/workspace/receipts">
                Open Receipt Vault
              </Link>
              <Link className="button-secondary" href="/workspace/history">
                Open History Ledger
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.active}</strong>
            <span>Active keys</span>
          </article>
          <article className="metric">
            <strong>{metrics.pending}</strong>
            <span>Pending activation</span>
          </article>
          <article className="metric">
            <strong>{metrics.restricted}</strong>
            <span>Restricted keys</span>
          </article>
          <article className="metric">
            <strong>{metrics.revoked}</strong>
            <span>Revoked keys</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search trust keys"
            placeholder="Search key, owner, fingerprint, source, scope, or restriction"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter key purpose"
            value={purpose}
            onChange={(event) =>
              setPurpose(event.target.value as KeyPurpose | "ALL")
            }
          >
            <option value="ALL">All key purposes</option>
            <option value="ROUTE_SIGNING">ROUTE_SIGNING</option>
            <option value="RECEIPT_SIGNING">RECEIPT_SIGNING</option>
            <option value="DEVICE_IDENTITY">DEVICE_IDENTITY</option>
            <option value="AUTHORITY_BINDING">AUTHORITY_BINDING</option>
            <option value="OUTCOME_ATTESTATION">OUTCOME_ATTESTATION</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Registered public keys</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((key) => (
                <button
                  className={`key-row ${
                    selected.keyId === key.keyId ? "active" : ""
                  }`}
                  key={key.keyId}
                  type="button"
                  onClick={() => setSelectedId(key.keyId)}
                >
                  <div className="row-top">
                    <span className="owner-name">{key.ownerName}</span>
                    <span className={`pill ${key.state}`}>{key.state}</span>
                  </div>
                  <div className="mono">{key.keyId}</div>
                  <div className="meta">
                    <span>{key.purpose}</span>
                    <span>{key.trustLevel}</span>
                    <span>{key.algorithm}</span>
                    <span>{formatDate(key.expiresAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No trust-key record matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className={`pill ${selected.trustLevel}`}>
                {selected.trustLevel}
              </span>
              <span className="pill">{selected.purpose}</span>
            </div>

            <h2>{selected.ownerName}</h2>
            <div className="mono">{selected.keyId}</div>
            <p>
              This registry record identifies a public key and its permitted
              trust boundary. It does not verify any signature by itself.
            </p>

            <dl className="kv">
              <dt>Owner ID</dt>
              <dd>{selected.ownerId}</dd>

              <dt>Algorithm</dt>
              <dd>{selected.algorithm}</dd>

              <dt>Fingerprint</dt>
              <dd>{selected.publicKeyFingerprint}</dd>

              <dt>Issued</dt>
              <dd>{formatDate(selected.issuedAt)}</dd>

              <dt>Registered</dt>
              <dd>{formatDate(selected.registeredAt)}</dd>

              <dt>Expires</dt>
              <dd>{formatDate(selected.expiresAt)}</dd>

              <dt>Revoked</dt>
              <dd>{formatDate(selected.revokedAt)}</dd>

              <dt>Revocation reason</dt>
              <dd>{selected.revocationReason}</dd>

              <dt>Source record</dt>
              <dd>{selected.sourceRecord}</dd>
            </dl>

            <div className="list-box">
              <strong>Permitted scopes</strong>
              <ul>
                {selected.permittedScopes.map((scope) => (
                  <li key={scope}>{scope}</li>
                ))}
              </ul>
            </div>

            <div className="list-box">
              <strong>Restrictions</strong>
              <ul>
                {selected.restrictions.map((restriction) => (
                  <li key={restriction}>{restriction}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <button
                className="small-button"
                type="button"
                onClick={activateKey}
                disabled={
                  selected.state !== "PENDING" ||
                  selected.trustLevel !== "REGISTERED"
                }
              >
                {selected.state === "ACTIVE"
                  ? "Active"
                  : selected.state === "PENDING"
                    ? "Activate trusted key"
                    : "Activation unavailable"}
              </button>
              <button
                className="small-button"
                type="button"
                onClick={copyRecord}
              >
                {copied ? "Copied" : "Copy key record"}
              </button>
              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.keyId.toLowerCase()}-registry-record.json`,
                    keyPackage,
                  )
                }
              >
                Download record
              </button>
              <Link className="small-button" href="/workspace/verify">
                Verify signature
              </Link>
            </div>

            <div className="notice">
              A registered key is usable only when its state, trust level,
              purpose, scope, algorithm, expiration, timestamp, and revocation
              status all permit the exact signature being verified.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
