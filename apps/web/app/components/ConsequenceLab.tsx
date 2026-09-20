'use client';

import { useMemo, useState } from 'react';

type Determination = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';
type Condition = {
  id: string;
  label: string;
  question: string;
  healthy: string;
  failed: string;
  failure: Determination;
  failureReason: string;
};
type Props = {
  eyebrow?: string;
  title: string;
  intro: string;
  actionLabel: string;
  conditions: Condition[];
  allowReason: string;
  resetLabel?: string;
};

const priority: Record<Determination, number> = { ALLOW: 0, HOLD: 1, ESCALATE: 2, DENY: 3 };

export default function ConsequenceLab({eyebrow='INTERACTIVE CONSEQUENCE LAB',title,intro,actionLabel,conditions,allowReason,resetLabel='RESET CASE'}:Props){
  const [state,setState]=useState<Record<string,boolean>>(()=>Object.fromEntries(conditions.map(c=>[c.id,true])));
  const failures=conditions.filter(c=>!state[c.id]);
  const determination=useMemo<Determination>(()=>failures.reduce<Determination>((d,c)=>priority[c.failure]>priority[d]?c.failure:d,'ALLOW'),[failures]);
  const reason=determination==='ALLOW'?allowReason:failures.filter(c=>c.failure===determination).map(c=>c.failureReason).join(' ');
  const toggle=(id:string)=>setState(s=>({...s,[id]:!s[id]}));
  const reset=()=>setState(Object.fromEntries(conditions.map(c=>[c.id,true])));
  return <section className="ta14-lab" aria-label={title}>
    <style>{`
      .ta14-lab{margin:38px 0;padding:30px;border:1px solid rgba(255,255,255,.16);border-radius:20px;background:rgba(3,10,14,.72);color:#eef7f5}
      .ta14-lab .lab-eye{font-size:10px;font-weight:900;letter-spacing:.18em;color:#e9b85e}
      .ta14-lab h2{margin:9px 0 10px;font-size:clamp(28px,4vw,44px);line-height:1.05}
      .ta14-lab .lab-intro{max-width:900px;color:#aebfc4;line-height:1.65}
      .ta14-lab .lab-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:24px 0}
      .ta14-lab button{font:inherit}
      .ta14-lab .condition{min-height:116px;text-align:left;padding:16px;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.035);color:inherit;cursor:pointer}
      .ta14-lab .condition strong{display:block;font-size:12px;letter-spacing:.06em;color:#e8f2ef}
      .ta14-lab .condition span{display:block;margin-top:8px;color:#9fb2b7;font-size:12px;line-height:1.5}
      .ta14-lab .condition b{display:inline-block;margin-top:10px;font-size:10px;letter-spacing:.08em;color:#79d7ad}
      .ta14-lab .condition.off{border-color:rgba(233,184,94,.55);background:rgba(111,75,17,.14)}
      .ta14-lab .condition.off b{color:#e9b85e}
      .ta14-lab .result{padding:22px;border:1px solid rgba(255,255,255,.16);border-radius:16px;background:rgba(255,255,255,.035)}
      .ta14-lab .result small{font-size:9px;letter-spacing:.15em;color:#8ea3a8}
      .ta14-lab .result strong{display:block;margin:5px 0 8px;font-size:34px;color:#e9b85e}
      .ta14-lab .result p{margin:0;color:#c3d0d2;line-height:1.6}
      .ta14-lab .actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:15px}
      .ta14-lab .actions button{min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(233,184,94,.45);background:transparent;color:#e9b85e;font-weight:900;cursor:pointer}
      .ta14-lab .hint{margin-top:12px;color:#82979c;font-size:11px}
      @media(max-width:680px){.ta14-lab{padding:20px}.ta14-lab .lab-grid{grid-template-columns:1fr}}
    `}</style>
    <div className="lab-eye">{eyebrow}</div><h2>{title}</h2><p className="lab-intro">{intro}</p>
    <div className="lab-grid">{conditions.map(c=><button type="button" key={c.id} className={'condition '+(state[c.id]?'':'off')} onClick={()=>toggle(c.id)} aria-pressed={!state[c.id]}><strong>{c.label}</strong><span>{c.question}</span><b>{state[c.id]?c.healthy:c.failed}</b></button>)}</div>
    <div className="result" aria-live="polite"><small>GOVERNED DETERMINATION</small><strong>{determination}</strong><p>{reason}</p></div>
    <div className="actions"><button type="button" onClick={()=>{const first=conditions.find(c=>state[c.id]);if(first)toggle(first.id)}}>{actionLabel}</button><button type="button" onClick={reset}>{resetLabel}</button></div>
    <p className="hint">Select any condition to change the case. The result responds to the state you establish; a successful upstream fact never silently substitutes for a missing downstream predicate.</p>
  </section>;
}
