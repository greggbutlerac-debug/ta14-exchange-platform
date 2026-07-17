'use client';

import { useMemo, useState } from 'react';

type Decision = 'HOLD' | 'ALLOW' | 'DENY' | 'ESCALATE';

type RequirementResult = {
  requirementId: string;
  result: Decision | 'PASS' | 'FAIL';
  reason: string;
};

type ApiRecord = {
  rid: string;
  version: number;
  decision: Decision;
  receipt?: {
    nextAction?: string;
    decisionFingerprint?: string;
    results?: RequirementResult[];
  };
  aer?: unknown;
  registry?: Record<string, unknown> | null;
  correlationId?: string;
};

const sha256Placeholder = '0'.repeat(64);

const fieldLabels: Record<string, string> = {
  organizationName: 'Organization name',
  systemName: 'Governance system or agent',
  actorId: 'Accountable actor ID',
  supplierId: 'Supplier ID',
  invoiceId: 'Invoice ID',
  beneficiaryId: 'Beneficiary ID',
  amountUsd: 'Payment amount (USD)',
  procurementAuthorityId: 'Procurement authority ID',
  procurementIssuer: 'Procurement authority issuer',
  procurementEffectiveAt: 'Procurement effective time',
  procurementExpiresAt: 'Procurement expiry time',
  financeAuthorityId: 'Finance authority ID',
  financeIssuer: 'Finance authority issuer',
  financeEffectiveAt: 'Finance effective time',
  financeExpiresAt: 'Finance expiry time',
  beneficiaryEvidenceId: 'Beneficiary evidence ID',
  beneficiaryEvidenceSource: 'Evidence source',
  beneficiaryEvidenceHash: 'Evidence SHA-256',
};

const phases = ['Define', 'Test', 'Correct', 'AER', 'Preserve'];

function phaseStatus(record: ApiRecord | null, index: number) {
  if (!record) return index === 0 ? 'active' : '';
  if (record.registry) return index <= 4 ? 'complete' : '';
  if (record.decision === 'ALLOW') return index <= 3 ? 'complete' : '';
  if (record.decision === 'HOLD') {
    if (index < 2) return 'complete';
    return index === 2 ? 'active' : '';
  }
  return index <= 1 ? 'complete' : '';
}

export default function WorkspacePage() {
  const [record, setRecord] = useState<ApiRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    organizationName: 'Acme Procurement',
    systemName: 'Procurement Agent v4.2',
    actorId: 'buyer-001',
    supplierId: 'supplier-009',
    invoiceId: 'INV-25001',
    beneficiaryId: 'beneficiary-009',
    amountUsd: '32500',
  });

  const validFrom = useMemo(
    () => new Date(Date.now() - 60_000).toISOString(),
    [],
  );
  const validUntil = useMemo(
    () => new Date(Date.now() + 30 * 86_400_000).toISOString(),
    [],
  );

  const [correction, setCorrection] = useState({
    procurementAuthorityId: 'TA14-AID-PROC-001',
    procurementIssuer: 'Procurement Director',
    procurementEffectiveAt: validFrom,
    procurementExpiresAt: validUntil,
    financeAuthorityId: 'TA14-AID-FIN-001',
    financeIssuer: 'Finance Director',
    financeEffectiveAt: validFrom,
    financeExpiresAt: validUntil,
    beneficiaryEvidenceId: 'TA14-EID-BEN-001',
    beneficiaryEvidenceSource: 'Beneficiary verification record',
    beneficiaryEvidenceHash: sha256Placeholder,
  });

  async function call(url: string, body: unknown = {}) {
    setBusy(true);
    setError('');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          `${payload.error || 'Request failed'}${
            payload.correlationId
              ? ` · correlation ${payload.correlationId}`
              : ''
          }`,
        );
      }

      setRecord(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Request failed');
    } finally {
      setBusy(false);
    }
  }

  const correctionBody = record
    ? {
        expectedVersion: record.version,
        procurementAuthority: {
          authorityId: correction.procurementAuthorityId,
          issuer: correction.procurementIssuer,
          effectiveAt: correction.procurementEffectiveAt,
          expiresAt: correction.procurementExpiresAt,
        },
        financeAuthority: {
          authorityId: correction.financeAuthorityId,
          issuer: correction.financeIssuer,
          effectiveAt: correction.financeEffectiveAt,
          expiresAt: correction.financeExpiresAt,
        },
        beneficiaryEvidence: {
          evidenceId: correction.beneficiaryEvidenceId,
          source: correction.beneficiaryEvidenceSource,
          hash: correction.beneficiaryEvidenceHash,
        },
      }
    : {};

  function reset() {
    setRecord(null);
    setError('');
  }

  return (
    <main className="workspace-shell">
      <style>{`
        :root { color-scheme: dark; }
        body { margin: 0; background: #03060b; color: #f5f8ff; }
        .workspace-shell {
          min-height: 100vh;
          padding: 32px 0 96px;
          background:
            radial-gradient(circle at 12% 0%, rgba(39, 162, 255, .17), transparent 32%),
            radial-gradient(circle at 92% 10%, rgba(60, 241, 166, .10), transparent 28%),
            linear-gradient(180deg, #02050a 0%, #07111d 52%, #02050a 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .workspace-shell::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .22;
          background-image: linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
          background-size: 38px 38px;
          mask-image: linear-gradient(to bottom, #000, transparent 88%);
        }
        .wrap { position: relative; width: min(1180px, 92vw); margin: 0 auto; }
        .topbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 72px; }
        .brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; color: #fff; font-weight: 800; letter-spacing: .08em; }
        .brand-mark { display:grid; place-items:center; width:42px; height:42px; border:1px solid rgba(84,232,255,.45); border-radius:13px; background:linear-gradient(145deg,rgba(84,232,255,.16),rgba(41,167,255,.05)); box-shadow:0 0 34px rgba(41,167,255,.20); }
        .top-actions { display:flex; gap:10px; flex-wrap:wrap; }
        .link-button { display:inline-flex; align-items:center; justify-content:center; min-height:42px; padding:0 16px; border:1px solid rgba(150,180,215,.20); border-radius:999px; color:#dce8f6; background:rgba(8,17,29,.66); text-decoration:none; font-weight:700; }
        .hero { max-width: 900px; margin-bottom: 44px; }
        .eyebrow { color:#63e9ff; font-size:.76rem; font-weight:900; letter-spacing:.16em; text-transform:uppercase; }
        h1 { margin:18px 0 18px; font-size:clamp(3rem,8vw,6.7rem); line-height:.92; letter-spacing:-.065em; max-width:1000px; }
        .gradient { color:transparent; background:linear-gradient(100deg,#fff 10%,#7eeaff 46%,#45f0ad 90%); background-clip:text; -webkit-background-clip:text; }
        .hero p { max-width:770px; margin:0; color:#9eb0c5; font-size:clamp(1.05rem,2vw,1.28rem); line-height:1.75; }
        .phase-rail { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; margin:34px 0 28px; }
        .phase { position:relative; min-height:78px; padding:16px; border:1px solid rgba(137,174,213,.14); border-radius:18px; background:rgba(8,17,29,.62); color:#71859b; font-weight:800; overflow:hidden; }
        .phase span { display:block; margin-bottom:8px; color:#51687e; font-size:.7rem; letter-spacing:.14em; }
        .phase.active, .phase.complete { color:#eef8ff; border-color:rgba(84,232,255,.34); box-shadow:0 0 34px rgba(41,167,255,.10); }
        .phase.complete::after { content:""; position:absolute; left:0; right:0; bottom:0; height:2px; background:linear-gradient(90deg,#29a7ff,#54e8ff,#39f2a1); }
        .grid-layout { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(320px,.85fr); gap:22px; align-items:start; }
        .panel { border:1px solid rgba(135,172,211,.16); border-radius:26px; background:linear-gradient(180deg,rgba(13,25,41,.88),rgba(6,13,23,.88)); box-shadow:0 30px 90px rgba(0,0,0,.34); overflow:hidden; }
        .panel-inner { padding:clamp(22px,4vw,38px); }
        .panel-head { display:flex; justify-content:space-between; gap:24px; align-items:flex-start; margin-bottom:28px; }
        .panel h2 { margin:10px 0 0; font-size:clamp(1.7rem,3vw,2.6rem); letter-spacing:-.035em; }
        .panel-head p, .muted { color:#93a6ba; line-height:1.7; }
        .panel-head p { max-width:410px; margin:0; }
        .form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
        .field { display:grid; gap:8px; }
        .field span { color:#aebed0; font-size:.78rem; font-weight:800; letter-spacing:.05em; }
        .field input { width:100%; min-height:50px; border:1px solid rgba(137,174,213,.17); border-radius:13px; padding:0 14px; color:#eef7ff; background:rgba(2,7,13,.66); outline:none; }
        .field input:focus { border-color:#54e8ff; box-shadow:0 0 0 3px rgba(84,232,255,.09); }
        .field input:disabled { color:#75889c; }
        .actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:24px; }
        button, .action { border:0; min-height:50px; border-radius:999px; padding:0 21px; cursor:pointer; font-weight:900; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; }
        .primary { color:#03100c; background:linear-gradient(100deg,#54e8ff,#39f2a1); box-shadow:0 0 36px rgba(57,242,161,.17); }
        .secondary { color:#dce8f6; border:1px solid rgba(142,180,219,.24); background:rgba(11,22,37,.78); }
        button:disabled { opacity:.62; cursor:not-allowed; }
        .boundary { margin-top:22px; padding:16px 18px; border:1px solid rgba(255,212,106,.16); border-radius:14px; color:#c5b98f; background:rgba(255,212,106,.045); line-height:1.6; font-size:.88rem; }
        .status-panel { position:sticky; top:22px; }
        .decision-orb { display:grid; place-items:center; width:150px; height:150px; margin:24px auto; border-radius:50%; border:1px solid rgba(84,232,255,.28); background:radial-gradient(circle,rgba(84,232,255,.13),rgba(41,167,255,.03) 60%,transparent 70%); box-shadow:0 0 70px rgba(41,167,255,.16),inset 0 0 40px rgba(84,232,255,.08); }
        .decision-orb strong { font-size:1.65rem; letter-spacing:.08em; }
        .decision-orb.hold { border-color:rgba(255,69,107,.38); box-shadow:0 0 70px rgba(255,69,107,.16); }
        .decision-orb.allow { border-color:rgba(57,242,161,.42); box-shadow:0 0 70px rgba(57,242,161,.18); }
        .status-copy { text-align:center; color:#9cafc2; line-height:1.7; }
        .route-meta { display:grid; gap:10px; margin-top:24px; }
        .meta-row { display:flex; justify-content:space-between; gap:18px; padding:13px 0; border-top:1px solid rgba(137,174,213,.11); color:#8195aa; font-size:.84rem; }
        .meta-row strong { color:#eaf5ff; text-align:right; overflow-wrap:anywhere; }
        .alert { margin:0 0 22px; padding:16px 18px; border:1px solid rgba(255,69,107,.27); border-radius:15px; background:rgba(255,69,107,.07); color:#ffc2cf; }
        .result-panel { margin-top:22px; }
        .result-head { display:flex; justify-content:space-between; gap:20px; align-items:flex-start; }
        .pill { display:inline-flex; align-items:center; min-height:30px; padding:0 11px; border-radius:999px; font-size:.72rem; font-weight:900; letter-spacing:.11em; }
        .pill.HOLD,.pill.FAIL { color:#ff8ca3; background:rgba(255,69,107,.10); border:1px solid rgba(255,69,107,.24); }
        .pill.ALLOW,.pill.PASS { color:#72f6b8; background:rgba(57,242,161,.09); border:1px solid rgba(57,242,161,.23); }
        .fingerprint { margin:22px 0; padding:15px; border-radius:13px; color:#7de9ff; background:#02070c; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; overflow-wrap:anywhere; }
        .requirements { display:grid; gap:12px; }
        .requirement { padding:17px; border:1px solid rgba(137,174,213,.13); border-radius:15px; background:rgba(2,8,14,.42); }
        .requirement-top { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .requirement p { margin:11px 0 0; color:#91a5b9; line-height:1.6; }
        .subpanel { margin-top:24px; padding:24px; border:1px solid rgba(84,232,255,.15); border-radius:20px; background:rgba(6,15,25,.68); }
        .preserved { text-align:center; }
        @media (max-width:900px){ .grid-layout{grid-template-columns:1fr}.status-panel{position:static}.phase-rail{grid-template-columns:1fr 1fr}.panel-head{display:block}.panel-head p{margin-top:14px}.topbar{margin-bottom:50px} }
        @media (max-width:620px){ .form-grid{grid-template-columns:1fr}.phase-rail{grid-template-columns:1fr}.top-actions{display:none}.workspace-shell{padding-top:20px}h1{font-size:3.2rem} }
      `}</style>

      <div className="wrap">
        <nav className="topbar" aria-label="Workspace navigation">
          <a className="brand" href="/">
            <span className="brand-mark">14</span>
            <span>TA-14 EXCHANGE</span>
          </a>
          <div className="top-actions">
            <a className="link-button" href="/architecture">Architecture</a>
            <a className="link-button" href="/verify">Verify a record</a>
            <a className="link-button" href="/review">Request review</a>
          </div>
        </nav>

        <section className="hero">
          <div className="eyebrow">Architecture workspace · live governed route</div>
          <h1><span className="gradient">Build governance that can survive execution.</span></h1>
          <p>
            Bring a consequential action into the TA-14 construction environment.
            Define the route, expose missing authority or evidence, correct it without
            erasing history, generate an admissible execution record, and preserve the result.
          </p>
        </section>

        <div className="phase-rail" aria-label="Route construction phases">
          {phases.map((phase, index) => (
            <div className={`phase ${phaseStatus(record, index)}`} key={phase}>
              <span>0{index + 1}</span>
              {phase}
            </div>
          ))}
        </div>

        {error && (
          <div className="alert" role="alert">
            <strong>Request could not be completed.</strong><br />{error}
          </div>
        )}

        <div className="grid-layout">
          <section className="panel">
            <div className="panel-inner">
              <div className="panel-head">
                <div>
                  <div className="eyebrow">Route definition</div>
                  <h2>Vendor payment above USD 25,000</h2>
                </div>
                <p>
                  The fields below create the exact payment object and accountable route
                  identity evaluated by the TA-14 engine.
                </p>
              </div>

              <div className="form-grid">
                {Object.entries(form).map(([key, value]) => (
                  <label className="field" key={key}>
                    <span>{fieldLabels[key] || key}</span>
                    <input
                      type={key === 'amountUsd' ? 'number' : 'text'}
                      value={value}
                      disabled={Boolean(record)}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                    />
                  </label>
                ))}
              </div>

              <div className="actions">
                <button
                  className="primary"
                  disabled={busy || Boolean(record)}
                  onClick={() =>
                    call('/api/routes', {
                      ...form,
                      amountUsd: Number(form.amountUsd),
                    })
                  }
                >
                  {busy ? 'Running admissibility engine…' : 'Run the initial route →'}
                </button>
                {record && (
                  <button className="secondary" disabled={busy} onClick={reset}>
                    Start a new route
                  </button>
                )}
              </div>

              <div className="boundary">
                <strong>Demonstration boundary:</strong> bypass, replay, duplicate-payment,
                execution, and outcome observations use labeled fixtures in this release.
                They are not represented as independently observed evidence.
              </div>
            </div>
          </section>

          <aside className="panel status-panel">
            <div className="panel-inner">
              <div className="eyebrow">Runtime state</div>
              <div className={`decision-orb ${record?.decision.toLowerCase() || ''}`}>
                <strong>{busy ? 'TESTING' : record?.decision || 'READY'}</strong>
              </div>
              <p className="status-copy">
                {!record && 'The route is defined and ready for deterministic evaluation.'}
                {record?.decision === 'HOLD' && 'The consequence is stopped. Required proof is incomplete but correctable.'}
                {record?.decision === 'ALLOW' && 'The route satisfies the mandatory requirements within its declared scope.'}
              </p>
              <div className="route-meta">
                <div className="meta-row"><span>Architecture</span><strong>TA-14 Admissible Execution</strong></div>
                <div className="meta-row"><span>Policy</span><strong>PROC-PAY-2026.1</strong></div>
                <div className="meta-row"><span>Route identity</span><strong>{record?.rid || 'Pending evaluation'}</strong></div>
                <div className="meta-row"><span>Version</span><strong>{record?.version || 'Not issued'}</strong></div>
              </div>
            </div>
          </aside>
        </div>

        {record && (
          <section className="panel result-panel">
            <div className="panel-inner">
              <div className="result-head">
                <div>
                  <div className={`pill ${record.decision}`}>{record.decision}</div>
                  <h2>Route {record.rid}</h2>
                  <p className="muted">Immutable version {record.version} · Policy PROC-PAY-2026.1</p>
                </div>
              </div>

              <p className="muted">{record.receipt?.nextAction}</p>
              <div className="fingerprint">
                Decision fingerprint · {record.receipt?.decisionFingerprint || 'Not available'}
              </div>

              <div className="requirements">
                {record.receipt?.results?.map((result) => (
                  <article className="requirement" key={result.requirementId}>
                    <div className="requirement-top">
                      <span className={`pill ${result.result}`}>{result.result}</span>
                      <strong>{result.requirementId}</strong>
                    </div>
                    <p>{result.reason}</p>
                  </article>
                ))}
              </div>

              {record.decision === 'HOLD' && (
                <div className="subpanel">
                  <div className="eyebrow">Free correction · history preserved</div>
                  <h2>Supply the missing authority and beneficiary proof.</h2>
                  <p className="muted">
                    The correction creates a new immutable route version. It does not erase the original HOLD.
                  </p>
                  <div className="form-grid">
                    {Object.entries(correction).map(([key, value]) => (
                      <label className="field" key={key}>
                        <span>{fieldLabels[key] || key}</span>
                        <input
                          value={value}
                          onChange={(event) =>
                            setCorrection((current) => ({
                              ...current,
                              [key]: event.target.value,
                            }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                  <div className="actions">
                    <button
                      className="primary"
                      disabled={busy}
                      onClick={() => call(`/api/routes/${record.rid}/correct`, correctionBody)}
                    >
                      {busy ? 'Creating version and rerunning…' : 'Submit correction and rerun →'}
                    </button>
                  </div>
                </div>
              )}

              {record.decision === 'ALLOW' && !record.registry && (
                <div className="subpanel">
                  <div className="eyebrow">AER continuity</div>
                  <h2>Generate the signed route record.</h2>
                  <p className="muted">
                    Preserve the demonstration record to generate an AER, event history,
                    manifest, and registry reference.
                  </p>
                  <div className="actions">
                    <button
                      className="primary"
                      disabled={busy}
                      onClick={() => call(`/api/routes/${record.rid}/preserve`)}
                    >
                      {busy ? 'Generating and signing…' : 'Generate AER and preserve record →'}
                    </button>
                  </div>
                </div>
              )}

              {Boolean(record.registry) && (
                <div className="subpanel preserved">
                  <div className="pill ALLOW">SELF-DECLARED RECORD ISSUED</div>
                  <h2>The route is preserved.</h2>
                  <p className="muted">
                    Inspect signatures, event continuity, limitations, and the downloadable verification bundle.
                  </p>
                  <div className="actions" style={{ justifyContent: 'center' }}>
                    <a className="action primary" href={`/registry/${record.rid}`}>
                      Open TA14-RID registry →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
