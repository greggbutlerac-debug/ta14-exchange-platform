import type {Metadata} from 'next';
import Link from 'next/link';
import CommissioningContinuityLab from './CommissioningContinuityLab';

export const metadata:Metadata={
  title:'Continuous Commissioning Showroom | TA-14 Exchange',
  description:'Interactive TA-14 showroom examining what survives the handoff from commissioning into operations, changed conditions, revalidation, commit and outcome evidence.'
};

const chain=['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'];

export default function ContinuousCommissioningShowroom(){
  return <main className="cc">
    <style>{`
      *{box-sizing:border-box}.cc{min-height:100vh;color:#f4fbff;background:radial-gradient(circle at 12% 0,rgba(66,205,255,.17),transparent 30%),radial-gradient(circle at 88% 5%,rgba(241,196,88,.12),transparent 26%),linear-gradient(180deg,#02070b,#07131b 52%,#02070b);font-family:Inter,system-ui,sans-serif}.shell{width:min(1220px,calc(100% - 36px));margin:auto;padding:24px 0 100px}.nav{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:14px 0 26px;border-bottom:1px solid #193642}.nav a{color:#f5fbff;text-decoration:none;font-weight:950;letter-spacing:.09em;font-size:11px}.nav span{color:#67dfff;font-size:10px;font-weight:950;letter-spacing:.16em}.hero{padding:82px 0 34px;max-width:1100px}.eyebrow{color:#62e9b4;font-size:10px;font-weight:950;letter-spacing:.19em}.hero h1{font-size:clamp(48px,8vw,94px);line-height:.91;letter-spacing:-.055em;margin:17px 0 22px}.hero h1 em{color:#f0c35a;font-style:normal}.hero p{max-width:900px;color:#a8bac4;font-size:19px;line-height:1.72}.principle{margin:28px 0 50px;padding:18px 20px;border:1px solid #6e5b2e;border-radius:14px;background:rgba(93,70,15,.19);color:#f0c35a;font-weight:950;letter-spacing:.08em}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:8px;margin:24px 0 54px}.chain span{padding:12px 8px;border:1px solid #244c5d;border-radius:9px;text-align:center;color:#91b8c8;font-size:9px;font-weight:950;letter-spacing:.08em}.section{margin-top:66px}.section h2{font:700 clamp(32px,5vw,58px)/1.02 Georgia,serif;margin:8px 0 14px}.section p{max-width:900px;color:#a7b9c3;line-height:1.72}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-top:26px}.card{padding:22px;border:1px solid #244653;border-radius:17px;background:rgba(4,17,24,.83)}.card b{display:block;color:#f4fbff;margin-bottom:9px}.card small{color:#63e7b3;font-weight:950;letter-spacing:.12em}.card p{font-size:13px}.quote{margin-top:50px;padding:30px;border-left:4px solid #f0c35a;background:rgba(240,195,90,.07);font:700 clamp(25px,4vw,42px)/1.15 Georgia,serif}.boundary{margin-top:52px;padding:24px;border:1px solid #31505e;border-radius:16px;background:#051019}.boundary b{color:#67dfff}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}.actions a{padding:12px 14px;border:1px solid #315a6c;border-radius:9px;color:#e8f6ff;text-decoration:none;font-size:10px;font-weight:950}.actions a:first-child{border-color:#f0c35a;color:#f0c35a}@media(max-width:920px){.grid{grid-template-columns:1fr}.chain{grid-template-columns:repeat(4,1fr)}}@media(max-width:620px){.hero{padding-top:50px}.chain{grid-template-columns:repeat(2,1fr)}}
    `}</style>
    <div className="shell">
      <nav className="nav"><Link href="/">TA-14 EXCHANGE</Link><span>CONTINUOUS COMMISSIONING · INTERACTIVE SHOWROOM</span></nav>
      <section className="hero">
        <div className="eyebrow">COMMISSIONING → OPERATIONS → CHANGED CONDITION → CONSEQUENCE</div>
        <h1>THE COMMISSIONING ENDED.<br/><em>THE BUILDING DID NOT.</em></h1>
        <p>This showroom examines the evidence boundary between a correctly commissioned condition and a later operational consequence. It does not replace commissioning. It asks what must still be true after handoff before yesterday's verified condition can support today's action.</p>
      </section>
      <div className="principle">COMMISSIONED ONCE ≠ AUTHORIZED FOREVER · PRESENT CONSEQUENCE REQUIRES PRESENT STANDING.</div>
      <div className="chain">{chain.map(x=><span key={x}>{x}</span>)}</div>

      <CommissioningContinuityLab/>

      <section className="section">
        <div className="eyebrow">THE CONTINUOUS COMMISSIONING SEAM</div>
        <h2>Commissioning establishes a baseline. Continuity determines whether it still matters.</h2>
        <p>Traditional commissioning can establish that a system met defined requirements at an accepted moment. Ongoing and continuous commissioning can observe drift, retest performance and identify changed conditions. TA-14 adds a separate governance question at the consequence boundary: is the evidence, authority, target and present reality still sufficient for this exact action now?</p>
        <div className="grid">
          <article className="card"><small>01 · COMMISSION</small><b>Establish what was verified.</b><p>Requirements, test evidence, accepted configuration, responsible parties and baseline state become explicit.</p></article>
          <article className="card"><small>02 · CONTINUE</small><b>Preserve what changed.</b><p>Operational history, interventions, overrides, replacements, environmental drift and control changes remain reviewable.</p></article>
          <article className="card"><small>03 · REVALIDATE</small><b>Resolve the present state.</b><p>Before consequence, the system determines whether the earlier basis remains current or must be narrowed, held, denied or escalated.</p></article>
        </div>
      </section>

      <div className="quote">“What evidence survives the handoff?” is not only a commissioning question. It becomes an execution question the moment somebody intends to act because of that evidence.</div>

      <section className="section">
        <div className="eyebrow">SEMICONDUCTOR FACILITY APPLICATION</div>
        <h2>Why complex facilities make the seam visible.</h2>
        <p>Cleanrooms, critical utilities, process systems, controls, manufacturing tools and operating teams are tightly coupled. A change in one layer can invalidate assumptions made in another. Continuous commissioning can detect and investigate that drift. TA-14 focuses on the final transition from evidence and recommendation into consequence-bearing action.</p>
      </section>

      <section className="boundary">
        <b>BOUNDARY</b>
        <p>This showroom is an educational architecture demonstration. It is not ASHRAE guidance, a commissioning standard, semiconductor design guidance, certification, code compliance, safety approval, or a claim that TA-14 replaces commissioning practice. It demonstrates a possible interoperability seam between commissioning evidence and admissible execution governance.</p>
        <div className="actions"><Link href="/ai-governance/ta14-architecture-showroom">TA-14 ARCHITECTURE SHOWROOM →</Link><Link href="/global-institutional-engagement/showrooms">ALL SHOWROOMS →</Link><Link href="/registry/ta-14-admissible-execution-architecture">AEA RECORD →</Link></div>
      </section>
    </div>
  </main>
}
