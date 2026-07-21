"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const WORKSPACE_ROUTES = {
  testing: "/workspace/testing",
  verify: "/workspace/verify",
  registry: "/workspace/registry",
} as const;


type ReceiptState = "SIMULATION" | "PAYMENT_REQUIRED" | "SIGNED" | "REVOKED";
type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

type ReceiptRecord = {
  receiptId: string;
  routeId: string;
  routeName: string;
  testId: string;
  state: ReceiptState;
  decision: Decision;
  issuedAt: string;
  issuer: string;
  signatureAlgorithm: string;
  keyId: string;
  digest: string;
  feeUsd: number;
  findings: number;
  note: string;
};

const initialReceipts: ReceiptRecord[] = [
  {
    receiptId: "TA-14-RCPT-7C3A19",
    routeId: "TA-14-RID-VP-0042",
    routeName: "Governed Vendor Payment",
    testId: "TA-14-TEST-9F21C4",
    state: "SIGNED",
    decision: "ALLOW",
    issuedAt: "2026-07-17T18:16:00.000Z",
    issuer: "TA-14 Exchange Test Issuer",
    signatureAlgorithm: "Ed25519",
    keyId: "ta14-test-key-2026-01",
    digest: "sha256:7a822eaf1c43f94fd2841828ebca756a0f8716f5bdb898f15614e053b6c24e11",
    feeUsd: 9,
    findings: 0,
    note:
      "Example signed test receipt retained to demonstrate the receipt vault interface.",
  },
  {
    receiptId: "TA-14-RCPT-4B88E1",
    routeId: "TA-14-RID-AI-0018",
    routeName: "Bounded AI Agent Action",
    testId: "TA-14-TEST-7A11B8",
    state: "SIMULATION",
    decision: "HOLD",
    issuedAt: "2026-07-17T17:40:00.000Z",
    issuer: "Local Simulation",
    signatureAlgorithm: "NONE",
    keyId: "NONE",
    digest: "sha256:UNKNOWN",
    feeUsd: 0,
    findings: 1,
    note:
      "Free simulation receipt. It is not a production signature and does not authorize execution.",
  },
  {
    receiptId: "TA-14-RCPT-2E913F",
    routeId: "TA-14-RID-HVAC-0009",
    routeName: "Analyzer-Governed Refrigerant Intervention",
    testId: "TA-14-TEST-5D02C7",
    state: "PAYMENT_REQUIRED",
    decision: "ESCALATE",
    issuedAt: "2026-07-17T15:04:00.000Z",
    issuer: "TA-14 Exchange Test Issuer",
    signatureAlgorithm: "PENDING",
    keyId: "PENDING",
    digest: "sha256:PENDING",
    feeUsd: 9,
    findings: 2,
    note:
      "Signed-test request prepared. Payment and server-side issuance have not yet occurred.",
  },
  {
    receiptId: "TA-14-RCPT-1A044D",
    routeId: "TA-14-RID-HR-0003",
    routeName: "Automated Candidate Rejection",
    testId: "TA-14-TEST-1B229A",
    state: "REVOKED",
    decision: "DENY",
    issuedAt: "2026-07-15T11:22:00.000Z",
    issuer: "TA-14 Exchange Test Issuer",
    signatureAlgorithm: "Ed25519",
    keyId: "ta14-test-key-2026-01",
    digest: "sha256:5d4be2b814652393fdcbef78d4ef13e3f18541431e213e9847e9bc99f735cb0d",
    feeUsd: 9,
    findings: 3,
    note:
      "Receipt revoked after route identity and authority continuity were invalidated.",
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

export default function ReceiptVaultPage() {
  const [receipts] = useState<ReceiptRecord[]>(initialReceipts);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<ReceiptState | "ALL">("ALL");
  const [selectedId, setSelectedId] = useState(initialReceipts[0].receiptId);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return receipts.filter((receipt) => {
      const matchesQuery =
        !needle ||
        [
          receipt.receiptId,
          receipt.routeId,
          receipt.routeName,
          receipt.testId,
          receipt.issuer,
          receipt.keyId,
          receipt.digest,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      const matchesState = state === "ALL" || receipt.state === state;
      return matchesQuery && matchesState;
    });
  }, [query, receipts, state]);

  const selected =
    receipts.find((receipt) => receipt.receiptId === selectedId) ??
    filtered[0] ??
    receipts[0];

  const metrics = useMemo(
    () => ({
      total: receipts.length,
      signed: receipts.filter((item) => item.state === "SIGNED").length,
      pending: receipts.filter((item) => item.state === "PAYMENT_REQUIRED").length,
      revoked: receipts.filter((item) => item.state === "REVOKED").length,
    }),
    [receipts],
  );

  const exportPackage = selected
    ? {
        schema: "TA_14_TEST_RECEIPT_PACKAGE_V1",
        exportedAt: new Date().toISOString(),
        receipt: selected,
        verificationBoundary: {
          signaturePresent: selected.state === "SIGNED" || selected.state === "REVOKED",
          trustedKeyRequired: true,
          canonicalPayloadRequired: true,
          revocationCheckRequired: true,
        },
        limitation:
          "A visible signature value is not proof of cryptographic validity. Independent verification requires the canonical payload, trusted public key, algorithm rules, and current revocation status.",
      }
    : null;

  async function copyReceipt() {
    if (!exportPackage) return;
    await navigator.clipboard.writeText(JSON.stringify(exportPackage, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="vault-page">
      <style>{`
        * { box-sizing: border-box; }

        .vault-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .vault-wrap {
          width: min(1360px, calc(100% - 48px));
          margin: 0 auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: clamp(32px, 5vw, 68px);
          border: 1px solid rgba(132, 177, 216, .16);
          border-radius: 34px;
          background:
            radial-gradient(circle at 84% 8%, rgba(255, 190, 90, .15), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .16), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "RECEIPTS";
          position: absolute;
          right: -10px;
          bottom: -36px;
          color: rgba(255,255,255,.025);
          font-size: clamp(5rem, 14vw, 12rem);
          font-weight: 1000;
          letter-spacing: -.09em;
          pointer-events: none;
        }

        .hero-content { position: relative; z-index: 1; max-width: 930px; }

        .eyebrow {
          margin: 0 0 17px;
          color: #6ce9ff;
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
          background: linear-gradient(100deg, #fff, #8ceaff 52%, #ffd18a);
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

        .button:focus-visible,
        .button-secondary:focus-visible,
        .small-button:focus-visible,
        .receipt-row:focus-visible,
        input:focus-visible,
        select:focus-visible {
          outline:3px solid rgba(108,233,255,.72);
          outline-offset:4px;
        }

        .button {
          min-height: 47px;
          padding: 0 19px;
          border: 0;
          color: #07100f;
          background: linear-gradient(100deg, #56e6ff, #ffd18a);
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
          grid-template-columns: minmax(0, 1.08fr) minmax(360px, .92fr);
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
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 19px 21px;
          border-bottom: 1px solid rgba(132, 177, 216, .12);
        }

        .receipt-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .receipt-row:last-child { border-bottom: 0; }

        .receipt-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 209, 138, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .receipt-name { font-weight: 900; }

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

        .pill.SIGNED { color: #54efae; border-color: rgba(84, 239, 174, .3); }
        .pill.SIMULATION { color: #7bd9ff; border-color: rgba(123, 217, 255, .3); }
        .pill.PAYMENT_REQUIRED { color: #ffd27b; border-color: rgba(255, 210, 123, .3); }
        .pill.REVOKED { color: #ff8e9b; border-color: rgba(255, 142, 155, .3); }

        .detail {
          position: sticky;
          top: 92px;
          padding: 25px;
        }

        .detail-top { justify-content: space-between; }

        .detail h2 {
          margin: 20px 0 7px;
          font-size: 1.85rem;
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
          min-width: 0;
          overflow-wrap: anywhere;
          color: #dce8f3;
        }

        .warning {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #ffd18a;
          border-radius: 0 13px 13px 0;
          color: #9eafbe;
          background: rgba(255, 209, 138, .045);
          font-size: .82rem;
          line-height: 1.65;
        }

        .empty {
          padding: 42px 22px;
          color: #8399ad;
          text-align: center;
          line-height: 1.7;
        }

        @media (max-width: 980px) {
          .metrics { grid-template-columns: repeat(2, 1fr); }
          .grid { grid-template-columns: 1fr; }
          .detail { position: static; }
        }

        @media (max-width: 700px) {
          .vault-wrap { width: min(100% - 24px, 1360px); }
          .vault-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="vault-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">TA-14 Exchange · Receipt Vault</p>
            <h1>
              Preserve the test.
              <br />
              <span className="gradient">Verify the receipt.</span>
            </h1>
            <p className="hero-copy">
              Store simulation receipts, paid signed-test requests, issued
              receipts, and revocation states in one inspectable vault without
              treating the mere presence of a signature string as proof.
            </p>

            <div className="hero-actions">
              <Link className="button" href={WORKSPACE_ROUTES.testing}>
                Run a route test
              </Link>
              <Link className="button-secondary" href={WORKSPACE_ROUTES.verify}>
                Open verifier
              </Link>
              <Link className="button-secondary" href={WORKSPACE_ROUTES.registry}>
                Open registry
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.total}</strong>
            <span>Total receipts</span>
          </article>
          <article className="metric">
            <strong>{metrics.signed}</strong>
            <span>Signed receipts</span>
          </article>
          <article className="metric">
            <strong>{metrics.pending}</strong>
            <span>Payment required</span>
          </article>
          <article className="metric">
            <strong>{metrics.revoked}</strong>
            <span>Revoked receipts</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search receipts"
            placeholder="Search receipt, route, test, issuer, key, or digest"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter receipt state"
            value={state}
            onChange={(event) =>
              setState(event.target.value as ReceiptState | "ALL")
            }
          >
            <option value="ALL">All receipt states</option>
            <option value="SIMULATION">SIMULATION</option>
            <option value="PAYMENT_REQUIRED">PAYMENT_REQUIRED</option>
            <option value="SIGNED">SIGNED</option>
            <option value="REVOKED">REVOKED</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Receipt records</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((receipt) => (
                <button
                  className={`receipt-row ${
                    selected?.receiptId === receipt.receiptId ? "active" : ""
                  }`}
                  key={receipt.receiptId}
                  type="button"
                  onClick={() => setSelectedId(receipt.receiptId)}
                >
                  <div className="row-top">
                    <span className="receipt-name">{receipt.routeName}</span>
                    <span className={`pill ${receipt.state}`}>
                      {receipt.state}
                    </span>
                  </div>
                  <div className="mono">{receipt.receiptId}</div>
                  <div className="meta">
                    <span>{receipt.testId}</span>
                    <span>{receipt.decision}</span>
                    <span>${receipt.feeUsd}</span>
                    <span>{formatDate(receipt.issuedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No receipt matches the current search and state filters.
              </div>
            )}
          </div>

          {selected ? (
            <aside className="panel detail">
              <div className="detail-top">
                <span className={`pill ${selected.state}`}>{selected.state}</span>
                <span className="pill">{selected.decision}</span>
              </div>

              <h2>{selected.routeName}</h2>
              <div className="mono">{selected.receiptId}</div>
              <p>{selected.note}</p>

              <dl className="kv">
                <dt>Route ID</dt>
                <dd>{selected.routeId}</dd>

                <dt>Test ID</dt>
                <dd>{selected.testId}</dd>

                <dt>Issued</dt>
                <dd>{formatDate(selected.issuedAt)}</dd>

                <dt>Issuer</dt>
                <dd>{selected.issuer}</dd>

                <dt>Algorithm</dt>
                <dd>{selected.signatureAlgorithm}</dd>

                <dt>Key ID</dt>
                <dd>{selected.keyId}</dd>

                <dt>Digest</dt>
                <dd>{selected.digest}</dd>

                <dt>Fee</dt>
                <dd>${selected.feeUsd}</dd>

                <dt>Findings</dt>
                <dd>{selected.findings}</dd>
              </dl>

              <div className="detail-actions">
                <button
                  className="small-button"
                  type="button"
                  onClick={copyReceipt}
                >
                  {copied ? "Copied" : "Copy package"}
                </button>
                <button
                  className="small-button"
                  type="button"
                  onClick={() =>
                    exportPackage &&
                    downloadJson(
                      `${selected.receiptId.toLowerCase()}-package.json`,
                      exportPackage,
                    )
                  }
                >
                  Download package
                </button>
                <Link className="small-button" href={WORKSPACE_ROUTES.verify}>
                  Verify receipt
                </Link>
              </div>

              <div className="warning">
                A receipt is independently trustworthy only when its canonical
                payload, trusted public key, algorithm, signature, and current
                revocation status can all be verified. Simulation and pending
                records are preserved but are not production signatures.
              </div>
            </aside>
          ) : null}
        </section>
      </div>
    </main>
  );
}
