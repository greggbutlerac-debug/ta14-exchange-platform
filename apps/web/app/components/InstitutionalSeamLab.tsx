'use client';

import { useState } from 'react';

type Stage = {
  label: string;
  state: string;
  determination: 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';
  explanation: string;
  changed?: string;
};

export default function InstitutionalSeamLab({
  eyebrow,
  title,
  intro,
  nativeLabel,
  nativeValue,
  actionLabel,
  actionValue,
  stages,
  ui,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  nativeLabel: string;
  nativeValue: string;
  actionLabel: string;
  actionValue: string;
  stages: Stage[];
  ui?: Partial<{nativeSystem:string; governanceSeam:string; currentEvidenceAuthority:string; proposedConsequence:string; currentDetermination:string; reset:string; runAgain:string; readSeam:string; seamRule:string}>;
}) {
  const [step, setStep] = useState(0);
  const labels = {nativeSystem:'{labels.nativeSystem}',governanceSeam:'{labels.governanceSeam}',currentEvidenceAuthority:'{labels.currentEvidenceAuthority}',proposedConsequence:'{labels.proposedConsequence}',currentDetermination:'{labels.currentDetermination}',reset:'RESET',runAgain:'RUN AGAIN',readSeam:'READ THE SEAM',seamRule:'The upstream evidence or institution does not have to become false for permission to disappear. A material change can preserve the earlier record while requiring a new determination before consequence.',...ui};
  const current = stages[step];
  const next = step < stages.length - 1 ? stages[step + 1] : null;

  return <section className="islab">
    <p className="islab-eye">{eyebrow}</p>
    <h2>{title}</h2>
    <p className="islab-intro">{intro}</p>

    <div className="islab-map">
      <article><small>{nativeLabel}</small><b>{nativeValue}</b><span>NATIVE INSTITUTION / SYSTEM</span></article>
      <i>→</i>
      <article className="seam"><small>GOVERNANCE SEAM</small><b>{current.state}</b><span>{current.changed || 'CURRENT EVIDENCE + AUTHORITY'}</span></article>
      <i>→</i>
      <article><small>{actionLabel}</small><b>{actionValue}</b><span>PROPOSED CONSEQUENCE</span></article>
    </div>

    <div className="islab-result" data-result={current.determination}>
      <small>CURRENT DETERMINATION</small>
      <strong>{current.determination}</strong>
      <p>{current.explanation}</p>
    </div>

    <div className="islab-controls">
      <button type="button" onClick={() => setStep(0)} disabled={step === 0}>{labels.reset}</button>
      {next && <button type="button" className="primary" onClick={() => setStep(step + 1)}>{next.label} →</button>}
      {!next && <button type="button" className="primary" onClick={() => setStep(0)}>{labels.runAgain} ↻</button>}
    </div>

    <div className="islab-ledger">
      {stages.map((s, i) => <div key={s.label} className={i === step ? 'active' : i < step ? 'done' : ''}>
        <span>{String(i + 1).padStart(2,'0')}</span><b>{s.label}</b><em>{i <= step ? s.determination : '—'}</em>
      </div>)}
    </div>

    <p className="islab-rule"><b>{labels.readSeam}:</b> {labels.seamRule}</p>

    <style jsx>{`
      .islab{padding:68px 0;border-top:1px solid rgba(255,255,255,.09)}
      .islab-eye{font-size:10px;font-weight:950;letter-spacing:2px;color:#78c9ee}
      h2{font:clamp(34px,5vw,56px) Georgia,serif;max-width:980px;margin:10px 0 14px}
      .islab-intro{max-width:930px;color:#adbec8;font-size:16px;line-height:1.7}
      .islab-map{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:stretch;gap:10px;margin-top:30px}
      .islab-map article{padding:22px;border:1px solid #294452;background:#081721;min-width:0}
      .islab-map .seam{border-color:#e8b95e;background:#17170f}
      .islab-map i{align-self:center;color:#e8b95e;font-size:26px;font-style:normal}
      .islab-map small,.islab-result small{display:block;color:#8fa5b3;font-size:9px;font-weight:900;letter-spacing:1.3px}
      .islab-map b{display:block;margin:12px 0;color:#edf5f8;font-size:16px;line-height:1.35}
      .islab-map span{color:#78909d;font-size:9px;font-weight:800;letter-spacing:1px}
      .islab-result{margin-top:14px;padding:25px;border-left:4px solid #78c9ee;background:#0a1822}
      .islab-result strong{display:block;margin:7px 0;font:34px Georgia,serif;color:#e8b95e}
      .islab-result p{margin:0;max-width:900px;color:#b5c5ce;line-height:1.65}
      .islab-result[data-result="HOLD"]{border-color:#e8b95e;background:#1a170d}
      .islab-result[data-result="DENY"]{border-color:#d87878}
      .islab-result[data-result="ESCALATE"]{border-color:#c49ce8}
      .islab-controls{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}
      button{min-height:44px;padding:11px 16px;border:1px solid #496273;border-radius:8px;background:#08151e;color:#dbe8ee;font-weight:900;letter-spacing:.7px;cursor:pointer}
      button.primary{border-color:#e8b95e;color:#f0d28d;background:#1a170d}
      button:disabled{opacity:.35;cursor:not-allowed}
      .islab-ledger{display:grid;gap:7px}
      .islab-ledger div{display:grid;grid-template-columns:42px 1fr auto;gap:10px;padding:11px 13px;border:1px solid #243b49;color:#607784;background:#07131c}
      .islab-ledger div.active{border-color:#e8b95e;color:#dceaf0}.islab-ledger div.done{color:#9eb1bc}
      .islab-ledger span{color:#e8b95e;font-size:10px}.islab-ledger b{font-size:10px}.islab-ledger em{font-size:10px;font-style:normal;font-weight:900}
      .islab-rule{margin-top:18px;padding:18px;border:1px solid #334a58;color:#9fb3bf;font-size:12px;line-height:1.65}.islab-rule b{color:#e8b95e}
      @media(max-width:760px){.islab-map{grid-template-columns:1fr}.islab-map i{transform:rotate(90deg);justify-self:center}.islab-ledger div{grid-template-columns:34px 1fr auto}}
    `}</style>
  </section>;
}
