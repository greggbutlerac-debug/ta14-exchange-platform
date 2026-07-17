'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';

type VerificationState = 'VERIFIED' | 'PARTIAL' | 'INVALID';

type VerificationResult = {
  state: VerificationState;
  routeId: string;
  receiptId: string;
  recordType: string;
  organization: string;
  issuedAt: string;
  fingerprint: string;
  signature: string;
  chainIntegrity: number;
  events: number;
  evidenceObjects: number;
  summary: string;
  checks: {
    label: string;
    status: 'PASS' | 'WARN' | 'FAIL';
    detail: string;
  }[];
};

const fixtures: Record<string, VerificationResult> = {
  'TA14-RID-7F2A-91C4': {
    state: 'VERIFIED',
    routeId: 'TA14-RID-7F2A-91C4',
    receiptId: 'TA14-AER-7F2A-91C4',
    recordType: 'Admissible Execution Record',
    organization: 'Northstar Financial Operations',
    issuedAt: '2026-07-17 13:42:18 UTC',
    fingerprint: '9f71:2b8c:84d1:44a9:0fe8:77c6:ea22:193d',
    signature: 'Ed25519 development signature verified',
    chainIntegrity: 100,
    events: 18,
    evidenceObjects: 24,
    summary:
      'The preserved route, decision fingerprint, signed record, and event chain correspond without detected conflict.',
    checks: [
      {
        label: 'Registry presence',
        status: 'PASS',
        detail: 'The route identity exists in the public demonstration registry.',
      },
      {
        label: 'Receipt identity',
        status: 'PASS',
        detail: 'The receipt identity is unique and bound to this route version.',
      },
      {
        label: 'Decision fingerprint',
        status: 'PASS',
        detail: 'The deterministic decision fingerprint matches the preserved findings.',
      },
      {
        label: 'Signature verification',
        status: 'PASS',
        detail: 'The development Ed25519 signature validates against the exported public key.',
      },
      {
        label: 'Event-chain integrity',
        status: 'PASS',
        detail: 'Every event hash corresponds to the preceding event and preserved payload.',
      },
      {
        label: 'Route correspondence',
        status: 'PASS',
        detail: 'The AER, registry boundary, evidence index, and event history identify the same route.',
      },
      {
        label: 'Execution correspondence',
        status: 'PASS',
        detail: 'The recorded execution matches the committed object and authorized destination.',
      },
      {
        label: 'Outcome correspondence',
        status: 'PASS',
        detail: 'The preserved outcome matches the authorized consequence.',
      },
    ],
  },
  'TA14-RID-44B1-0A8F': {
    state: 'PARTIAL',
    routeId: 'TA14-RID-44B1-0A8F',
    receiptId: 'TA14-DR-44B1-0A8F',
    recordType: 'Decision Receipt',
    organization: 'Meridian Procurement Network',
    issuedAt: '2026-07-17 12:09:51 UTC',
    fingerprint: '312a:9d40:ccb8:40ae:f523:de91:110c:772f',
    signature: 'Signature valid; execution record absent',
    chainIntegrity: 92,
    events: 11,
    evidenceObjects: 22,
    summary:
      'The denial receipt and route history are authentic, but no execution record exists because the route was blocked before consequence.',
    checks: [
      {
        label: 'Registry presence',
        status: 'PASS',
        detail: 'The route identity exists in the demonstration registry.',
      },
      {
        label: 'Receipt identity',
        status: 'PASS',
        detail: 'The denial receipt is uniquely identified and route-bound.',
      },
      {
        label: 'Decision fingerprint',
        status: 'PASS',
        detail: 'The fingerprint corresponds to the preserved DENY findings.',
      },
      {
        label: 'Signature verification',
        status: 'PASS',
        detail: 'The signed decision receipt validates against the development public key.',
      },
      {
        label: 'Event-chain integrity',
        status: 'PASS',
        detail: 'The route event chain is internally consistent.',
      },
      {
        label: 'Execution correspondence',
        status: 'WARN',
        detail: 'No execution object exists because the gate denied the route.',
      },
      {
        label: 'Outcome correspondence',
        status: 'PASS',
        detail: 'The preserved outcome confirms that no prohibited consequence occurred.',
      },
    ],
  },
  'TA14-RID-CORRUPT-DEMO': {
    state: 'INVALID',
    routeId: 'TA14-RID-CORRUPT-DEMO',
    receiptId: 'TA14-AER-CORRUPT-DEMO',
    recordType: 'Replay Package',
    organization: 'Demonstration Fixture',
    issuedAt: '2026-07-16 20:10:00 UTC',
    fingerprint: 'mismatch detected',
    signature: 'Signature validation failed',
    chainIntegrity: 46,
    events: 12,
    evidenceObjects: 17,
    summary:
      'The submitted package cannot be treated as a trustworthy execution record because its fingerprint, signature, and event chain do not correspond.',
    checks: [
      {
        label: 'Registry presence',
        status: 'WARN',
        detail: 'A similarly named demonstration route exists, but the submitted package does not match it.',
      },
      {
        label: 'Receipt identity',
        status: 'FAIL',
        detail: 'The receipt identity conflicts with the preserved registry object.',
      },
      {
        label: 'Decision fingerprint',
        status: 'FAIL',
        detail: 'The submitted fingerprint does not match the deterministic decision output.',
      },
      {
        label: 'Signature verification',
        status: 'FAIL',
        detail: 'The signature does not validate against the expected public key.',
      },
      {
        label: 'Event-chain integrity',
        status: 'FAIL',
        detail: 'At least one event payload was altered after the chain was created.',
      },
      {
        label: 'Route correspondence',
        status: 'FAIL',
        detail: 'The package does not correspond to the preserved route version.',
      },
      {
        label: 'Outcome correspondence',
        status: 'WARN',
        detail: 'Outcome legitimacy cannot be established from the submitted package.',
      },
    ],
  },
};

const sampleIds = Object.keys(fixtures);

function stateLabel(state: VerificationState) {
  switch (state) {
    case 'VERIFIED':
      return 'Cryptographically and structurally consistent';
    case 'PARTIAL':
      return 'Authentic record with a bounded limitation';
    case 'INVALID':
      return 'Verification failed';
  }
}

export default function VerifyPage() {
  const [query, setQuery] = useState(sampleIds[0]);
  const [activeId, setActiveId] = useState(sampleIds[0]);
  const [isChecking, setIsChecking] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const result = useMemo(() => fixtures[activeId], [activeId]);

  function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsChecking(true);
    setNotFound(false);

    window.setTimeout(() => {
      const normalized = query.trim().toUpperCase();

      if (fixtures[normalized]) {
        setActiveId(normalized);
      } else {
        setNotFound(true);
      }

      setIsChecking(false);
    }, 900);
  }

  return (
    <>
      <style>{`
        :root {
          --bg: #02050a;
          --panel: rgba(7, 16, 28, 0.82);
          --line: rgba(126, 180, 230, 0.16);
          --text: #f4f8ff;
          --muted: #91a5ba;
          --cyan: #57e6ff;
          --blue: #319cff;
          --green: #38f2a2;
          --gold: #ffd36b;
          --red: #ff4b70;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          color: var(--text);
          background:
            radial-gradient(circle at 14% 0%, rgba(49,156,255,0.17), transparent 30%),
            radial-gradient(circle at 88% 18%, rgba(56,242,162,0.08), transparent 28%),
            linear-gradient(180deg, #02050a 0%, #07111d 50%, #02050a 100%);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        input {
          font: inherit;
        }

        .verify-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .verify-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.2;
          background-image:
            linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: linear-gradient(to bottom, black, transparent 95%);
        }

        .shell {
          width: min(1240px, 92vw);
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid var(--line);
          background: rgba(3, 8, 15, 0.82);
          backdrop-filter: blur(20px);
        }

        .topbar-inner {
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: var(--cyan);
          border: 1px solid rgba(87,230,255,0.38);
          background: linear-gradient(145deg, rgba(49,156,255,0.18), rgba(56,242,162,0.06));
          box-shadow: 0 0 28px rgba(87,230,255,0.16);
        }

        .top-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .top-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
        }

        .top-links a:hover {
          color: white;
        }

        .hero {
          padding: 88px 0 48px;
          text-align: center;
        }

        .eyebrow {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        h1 {
          margin: 14px auto 20px;
          max-width: 980px;
          font-size: clamp(56px, 7.2vw, 100px);
          line-height: 0.92;
          letter-spacing: -0.06em;
        }

        .gradient {
          color: transparent;
          background: linear-gradient(90deg, white, var(--cyan), var(--green));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero p {
          max-width: 820px;
          margin: 0 auto;
          color: #b2c2d4;
          font-size: 19px;
          line-height: 1.72;
        }

        .verify-form {
          width: min(880px, 100%);
          margin: 30px auto 0;
          padding: 8px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          border-radius: 19px;
          border: 1px solid rgba(87,230,255,0.22);
          background: rgba(255,255,255,0.035);
          box-shadow: 0 22px 70px rgba(0,0,0,0.24);
        }

        .verify-input {
          min-width: 0;
          min-height: 54px;
          padding: 0 16px;
          border: 0;
          outline: none;
          color: white;
          background: transparent;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          letter-spacing: 0.04em;
        }

        .verify-button {
          min-height: 54px;
          padding: 0 22px;
          border: 0;
          border-radius: 13px;
          color: #03110b;
          font-weight: 950;
          cursor: pointer;
          background: linear-gradient(90deg, var(--cyan), var(--green));
          box-shadow: 0 0 34px rgba(87,230,255,0.18);
        }

        .verify-button:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .samples {
          margin-top: 14px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .sample {
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid var(--line);
          color: var(--muted);
          background: rgba(255,255,255,0.025);
          cursor: pointer;
          font-size: 11px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        .sample:hover {
          color: white;
          border-color: rgba(87,230,255,0.28);
        }

        .not-found {
          width: min(880px, 100%);
          margin: 18px auto 0;
          padding: 16px;
          border-radius: 15px;
          color: #ffd9df;
          border: 1px solid rgba(255,75,112,0.26);
          background: rgba(255,75,112,0.07);
          text-align: left;
        }

        .result {
          margin-bottom: 90px;
          border-radius: 28px;
          border: 1px solid var(--line);
          background: var(--panel);
          box-shadow: 0 30px 90px rgba(0,0,0,0.26);
          overflow: hidden;
        }

        .result-hero {
          padding: 34px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 28px;
          align-items: center;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 88% 8%, rgba(87,230,255,0.11), transparent 26%),
            rgba(255,255,255,0.01);
        }

        .result-hero code {
          color: var(--cyan);
          font-size: 11px;
          letter-spacing: 0.08em;
        }

        .result-hero h2 {
          margin: 10px 0 10px;
          font-size: clamp(30px, 4vw, 50px);
          letter-spacing: -0.045em;
        }

        .result-hero p {
          max-width: 760px;
          margin: 0;
          color: var(--muted);
          line-height: 1.7;
        }

        .state {
          font-size: clamp(44px, 6vw, 80px);
          line-height: 0.9;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .state.VERIFIED {
          color: var(--green);
          text-shadow: 0 0 44px rgba(56,242,162,0.24);
        }

        .state.PARTIAL {
          color: var(--gold);
          text-shadow: 0 0 44px rgba(255,211,107,0.22);
        }

        .state.INVALID {
          color: var(--red);
          text-shadow: 0 0 44px rgba(255,75,112,0.24);
        }

        .state-label {
          margin-top: 8px;
          text-align: right;
          color: var(--muted);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .metrics {
          padding: 18px 34px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          border-bottom: 1px solid var(--line);
        }

        .metric {
          padding: 14px;
          border-radius: 15px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.024);
        }

        .metric span {
          display: block;
          color: var(--muted);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .metric strong {
          display: block;
          margin-top: 6px;
          font-size: 18px;
        }

        .record-data {
          padding: 26px 34px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          border-bottom: 1px solid var(--line);
        }

        .data-item {
          min-width: 0;
        }

        .data-item span {
          display: block;
          color: var(--muted);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .data-item strong,
        .data-item code {
          display: block;
          margin-top: 6px;
          overflow-wrap: anywhere;
          color: white;
          font-size: 14px;
          line-height: 1.5;
        }

        .checks {
          padding: 30px 34px 34px;
        }

        .section-label {
          color: var(--muted);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .checks h3 {
          margin: 9px 0 18px;
          font-size: 26px;
        }

        .check-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .check {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.022);
        }

        .check-top {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: center;
        }

        .check strong {
          font-size: 14px;
        }

        .check-status {
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .check-status.PASS {
          color: var(--green);
        }

        .check-status.WARN {
          color: var(--gold);
        }

        .check-status.FAIL {
          color: var(--red);
        }

        .check p {
          margin: 9px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.55;
        }

        .actions {
          padding: 0 34px 34px;
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
        }

        .primary,
        .secondary {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 17px;
          border-radius: 13px;
          text-decoration: none;
          font-weight: 900;
        }

        .primary {
          color: #03110b;
          background: linear-gradient(90deg, var(--cyan), var(--green));
        }

        .secondary {
          color: white;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.03);
        }

        @media (max-width: 900px) {
          .result-hero {
            grid-template-columns: 1fr;
          }

          .state-label {
            text-align: left;
          }

          .metrics,
          .record-data,
          .check-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .top-links a:not(:last-child) {
            display: none;
          }

          .hero {
            padding-top: 60px;
          }

          h1 {
            font-size: 52px;
          }

          .verify-form {
            grid-template-columns: 1fr;
          }

          .verify-button {
            width: 100%;
          }

          .result-hero,
          .metrics,
          .record-data,
          .checks,
          .actions {
            padding-left: 22px;
            padding-right: 22px;
          }
        }
      `}</style>

      <div className="verify-page">
        <header className="topbar">
          <div className="shell topbar-inner">
            <Link className="brand" href="/">
              <span className="brand-mark">14</span>
              <span>TA-14 PUBLIC VERIFIER</span>
            </Link>

            <nav className="top-links">
              <Link href="/architecture">Architecture</Link>
              <Link href="/runtime">Runtime Gate</Link>
              <Link href="/records">Records</Link>
              <Link href="/review">Request Review</Link>
            </nav>
          </div>
        </header>

        <main className="shell">
          <section className="hero">
            <div className="eyebrow">Independent route verification</div>

            <h1>
              Verify the record.
              <br />
              <span className="gradient">Do not trust the interface.</span>
            </h1>

            <p>
              Enter a TA14-RID to inspect registry presence, receipt identity,
              decision correspondence, signature validity, event-chain integrity,
              execution correspondence, and preserved outcome.
            </p>

            <form className="verify-form" onSubmit={verify}>
              <input
                className="verify-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Enter TA14-RID"
                aria-label="TA14 route identity"
              />

              <button
                className="verify-button"
                type="submit"
                disabled={isChecking}
              >
                {isChecking ? 'Verifying Route…' : 'Verify Route'}
              </button>
            </form>

            <div className="samples">
              {sampleIds.map((id) => (
                <button
                  className="sample"
                  key={id}
                  type="button"
                  onClick={() => {
                    setQuery(id);
                    setActiveId(id);
                    setNotFound(false);
                  }}
                >
                  {id}
                </button>
              ))}
            </div>

            {notFound && (
              <div className="not-found">
                No demonstration registry record matches that TA14-RID. Confirm
                the identifier and try again.
              </div>
            )}
          </section>

          <section className="result">
            <header className="result-hero">
              <div>
                <code>{result.routeId}</code>
                <h2>{result.recordType}</h2>
                <p>{result.summary}</p>
              </div>

              <div>
                <div className={`state ${result.state}`}>{result.state}</div>
                <div className="state-label">{stateLabel(result.state)}</div>
              </div>
            </header>

            <div className="metrics">
              <div className="metric">
                <span>Chain integrity</span>
                <strong>{result.chainIntegrity}%</strong>
              </div>

              <div className="metric">
                <span>Preserved events</span>
                <strong>{result.events}</strong>
              </div>

              <div className="metric">
                <span>Evidence objects</span>
                <strong>{result.evidenceObjects}</strong>
              </div>

              <div className="metric">
                <span>Verification state</span>
                <strong>{result.state}</strong>
              </div>
            </div>

            <div className="record-data">
              <div className="data-item">
                <span>Receipt identity</span>
                <code>{result.receiptId}</code>
              </div>

              <div className="data-item">
                <span>Organization</span>
                <strong>{result.organization}</strong>
              </div>

              <div className="data-item">
                <span>Issued</span>
                <strong>{result.issuedAt}</strong>
              </div>

              <div className="data-item">
                <span>Signature</span>
                <strong>{result.signature}</strong>
              </div>

              <div className="data-item">
                <span>Decision fingerprint</span>
                <code>{result.fingerprint}</code>
              </div>

              <div className="data-item">
                <span>Verification boundary</span>
                <strong>Public demonstration registry and development signing key</strong>
              </div>
            </div>

            <section className="checks">
              <div className="section-label">Verification sequence</div>
              <h3>Independent correspondence checks</h3>

              <div className="check-grid">
                {result.checks.map((check) => (
                  <article className="check" key={check.label}>
                    <div className="check-top">
                      <strong>{check.label}</strong>
                      <span className={`check-status ${check.status}`}>
                        {check.status}
                      </span>
                    </div>
                    <p>{check.detail}</p>
                  </article>
                ))}
              </div>
            </section>

            <div className="actions">
              <Link className="primary" href="/records">
                Inspect Record Exchange
              </Link>

              <Link className="secondary" href="/runtime">
                Run a Demonstration Route
              </Link>

              <Link className="secondary" href="/review">
                Request Independent Review
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
