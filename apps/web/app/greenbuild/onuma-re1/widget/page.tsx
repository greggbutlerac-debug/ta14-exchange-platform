import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TA-14 RE1 Execution Authority Widget | Greenbuild 2026',
  description: 'Compact ONUMA × TA-14 RE1 authority-boundary widget for Greenbuild 2026.',
};

const principles = [
  ['IDENTITY', '3593-22790 · RE-7'],
  ['CONTEXT', 'Space · work order · component'],
  ['TRUST', 'Authority not inherited'],
  ['CONTINUITY', 'Evidence limits preserved'],
  ['IMPROVEMENT', 'Changed context → revalidate'],
] as const;

export default function GreenbuildOnumaRE1Widget() {
  return (
    <main className="widget">
      <div className="top">
        <div><small>ONUMA × TA-14 · GREENBUILD 2026</small><h1>RE1 Execution Authority</h1></div>
        <span className="live">LIVE RECORD</span>
      </div>

      <div className="principles">
        {principles.map(([name, value]) => <div key={name}><b>{name}</b><span>{value}</span></div>)}
      </div>

      <div className="decision">
        <div><small>ACA · COMPUTATION</small><strong>SUPPORTED</strong><span>Represented topology</span></div>
        <i>→</i>
        <div><small>AEA · EXECUTION</small><strong>ALLOW</strong><span>Bounded investigation</span></div>
        <i>→</i>
        <div className="hold"><small>PHYSICAL CONSEQUENCE</small><strong>HOLD</strong><span>New field evidence required</span></div>
      </div>

      <div className="bottom">
        <p><b>The building can know.</b> That does not mean it may act.</p>
        <a href="https://www.ta14exchange.com/greenbuild/onuma-re1" target="_blank" rel="noreferrer">FULL TA-14 REPORT →</a>
      </div>

      <style>{`
        *{box-sizing:border-box}html,body{margin:0;background:transparent}.widget{width:100%;min-height:100vh;padding:18px;background:radial-gradient(circle at 90% 0,#174956 0,#071923 36%,#02080c 100%);color:#f4fbfd;font-family:Arial,sans-serif;border:1px solid #6eeaff55;border-radius:16px;overflow:hidden}.top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.top small,.decision small{display:block;color:#6eeaff;font-size:9px;font-weight:900;letter-spacing:.14em}.top h1{font:700 25px/1.05 Georgia,serif;margin:5px 0 0}.live{font-size:9px;font-weight:900;letter-spacing:.12em;color:#efc66f;border:1px solid #efc66f66;border-radius:999px;padding:6px 8px;white-space:nowrap}.principles{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:16px 0}.principles div{padding:9px;border:1px solid #ffffff17;border-radius:9px;background:#07151e;min-width:0}.principles b,.principles span{display:block}.principles b{font-size:8px;letter-spacing:.08em;color:#6eeaff}.principles span{font-size:9px;line-height:1.3;color:#a9bdc5;margin-top:4px}.decision{display:flex;align-items:stretch;gap:6px}.decision>div{flex:1;padding:11px;border:1px solid #67e6ff55;border-radius:10px;background:#071c26}.decision strong,.decision span{display:block}.decision strong{font-size:18px;margin:5px 0}.decision span{font-size:9px;color:#a8bdc6}.decision i{align-self:center;color:#68848e;font-style:normal}.decision .hold{border-color:#efc66f88;background:#211a0d}.decision .hold small,.decision .hold strong{color:#efc66f}.bottom{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px;padding-top:12px;border-top:1px solid #ffffff18}.bottom p{font:14px/1.3 Georgia,serif;margin:0;color:#dbe9ed}.bottom b{color:#efc66f}.bottom a{font-size:9px;font-weight:900;letter-spacing:.08em;color:#05202a;background:#9beeff;padding:9px 10px;border-radius:8px;text-decoration:none;white-space:nowrap}@media(max-width:650px){.principles{grid-template-columns:1fr 1fr}.decision{flex-direction:column}.decision i{transform:rotate(90deg)}.bottom{align-items:flex-start;flex-direction:column}}
      `}</style>
    </main>
  );
}
