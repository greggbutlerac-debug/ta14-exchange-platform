import Link from 'next/link';

const offers = [
  ['01','GOVERNANCE ARCHITECTURE ADVISORY','Leadership and technical advisory for organizations designing accountable, consequence-bearing systems.','Architecture map · governance boundary · implementation priorities'],
  ['02','BOUNDED INTEROPERABILITY EXAMINATION','Examine how two independent architectures meet without either one absorbing, redefining, or borrowing authority from the other.','Frozen proposition · seam definition · evidence package · bounded finding'],
  ['03','EXECUTION-READINESS REVIEW','Test whether a consequential workflow has sufficient present evidence, authority, continuity, scope and standing to proceed.','Route review · HOLD conditions · authority gaps · readiness record'],
  ['04','INSTITUTIONAL / BUILDING PILOT','Apply TA-14 to a bounded operational environment such as HVAC, IAQ, controls, facilities, public infrastructure or another consequential system.','Bounded use case · baseline · governed run · preserved outcome'],
  ['05','TRAINING + ACADEMY DEPLOYMENT','Bring TA-14 instruction, simulations, arcades and operator-readiness pathways into a school, team, partner program or workforce environment.','Instruction · exercises · assessment · deployment plan'],
  ['06','CUSTOM GOVERNANCE INTEGRATION','Work directly with your product, platform or operating environment to define the evidence-to-authority and Commit-to-Execution boundary.','Integration scope · control map · implementation pathway'],
];

export const metadata = {
  title: 'Work With TA-14 | Commercial Entry',
  description: 'Commercial entry point for TA-14 governance advisory, interoperability examinations, execution-readiness reviews, pilots, training and integration.',
};

const mail = `mailto:registry@ta14authority.org?subject=${encodeURIComponent('TA-14 Commercial Engagement')}&body=${encodeURIComponent('Organization:\nName / role:\nWhat are you trying to govern, examine, or build?\nWhat consequence or execution boundary matters?\nDesired timing:\n')}`;

export default function WorkWithTA14(){
  return <main className="page">
    <div className="grid"/>
    <nav><Link href="/">TA-14 AUTHORITY</Link><span>DOOR 08 · COMMERCIAL ENTRY</span><a href={mail}>START A CONVERSATION →</a></nav>
    <header>
      <p className="eyebrow">THE SIMPLE QUESTION</p>
      <h1>WHAT CAN YOU<br/><em>HIRE TA-14 TO DO?</em></h1>
      <p className="lead">If you have a consequential system, governance problem, institutional boundary, interoperability question, training need, or execution risk, this is the commercial front door.</p>
      <div className="actions"><a className="primary" href={mail}>TELL US WHAT YOU NEED →</a><Link href="/governance-showcase">SEE THE PUBLIC RECORD</Link></div>
      <aside><b>NO SALES CLAIM OVERRIDES THE RECORD.</b><span>Commercial engagement does not change TA-14 examination standards. Registration, evidence, findings, HOLD conditions, limitations and outcomes remain independently preserved.</span></aside>
    </header>

    <section>
      <p className="eyebrow">WAYS TO ENGAGE</p>
      <h2>Start with the problem. We will determine the smallest serious engagement that fits it.</h2>
      <div className="offers">{offers.map(([n,t,d,o])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><small>WHAT YOU RECEIVE</small><b>{o}</b><a href={mail}>DISCUSS THIS ENGAGEMENT →</a></article>)}</div>
    </section>

    <section className="path">
      <p className="eyebrow">HOW COMMERCIAL WORK BEGINS</p>
      <h2>Interest should turn into a bounded engagement, not an endless conversation.</h2>
      <div className="steps">
        <article><span>01</span><b>STATE THE PROBLEM</b><p>Tell us what system, decision, boundary, evidence problem or execution risk matters.</p></article>
        <article><span>02</span><b>BOUND THE ENGAGEMENT</b><p>TA-14 identifies the smallest defensible scope, required evidence, actors and stop conditions.</p></article>
        <article><span>03</span><b>AGREE THE COMMERCIAL TERMS</b><p>Deliverables, timing, responsibilities and price are made explicit before substantive paid work begins.</p></article>
        <article><span>04</span><b>DO THE WORK</b><p>The engagement proceeds against the frozen scope. Unsupported claims do not become deliverables.</p></article>
        <article><span>05</span><b>RETURN THE RECORD</b><p>The client receives the agreed work product, findings, limitations and next-step options.</p></article>
      </div>
    </section>

    <section className="buyer">
      <div><p className="eyebrow">WHO THIS IS FOR</p><h2>You do not need to know TA-14 terminology before you contact us.</h2><p>Enterprise leaders, building owners, product teams, governance teams, schools, public institutions, operators, architects and technology partners can start with the real problem in ordinary language.</p></div>
      <div className="question"><small>YOU CAN LITERALLY START WITH:</small><strong>“We have a system that can do something consequential. We need to know what should govern whether it is allowed to do it.”</strong><a href={mail}>START THERE →</a></div>
    </section>

    <footer><b>No admissible evidence. No admissible execution.</b><span>TA-14 AUTHORITY · GOVERNANCE INSTITUTION · COMMERCIAL DOOR 08</span></footer>

    <style>{`
      *{box-sizing:border-box}.page{position:relative;min-height:100vh;overflow:hidden;background:radial-gradient(circle at 12% 0%,rgba(255,209,102,.19),transparent 28%),radial-gradient(circle at 90% 10%,rgba(92,216,255,.12),transparent 24%),linear-gradient(180deg,#01060c,#06121b 48%,#02070b);color:#f4f7f9;font-family:Inter,ui-sans-serif,system-ui,sans-serif}.grid{position:fixed;inset:0;pointer-events:none;opacity:.25;background-image:linear-gradient(rgba(106,230,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(106,230,255,.04) 1px,transparent 1px);background-size:42px 42px}.page>nav,.page>header,.page>section,.page>footer{position:relative;width:min(1180px,calc(100% - 36px));margin:auto}.page>nav{min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:18px;border-bottom:1px solid #ffffff12}.page>nav a{color:#e9f5fa;text-decoration:none;font-size:10px;font-weight:950;letter-spacing:.08em}.page>nav span{color:#ffd166;font-size:9px;font-weight:950;letter-spacing:.16em}header{padding:92px 0 70px}.eyebrow{color:#ffd166;font-size:10px;font-weight:950;letter-spacing:.18em}h1,h2{font-family:Georgia,serif}h1{font-size:clamp(58px,9vw,110px);line-height:.9;letter-spacing:-.055em;margin:18px 0 24px;max-width:1000px}h1 em{font-style:normal;color:#ffd166}.lead{max-width:900px;color:#b5c7d0;font-size:20px;line-height:1.7}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}.actions a{padding:15px 18px;border:1px solid #ffffff22;border-radius:10px;color:#eaf6fa;text-decoration:none;font-size:10px;font-weight:950}.actions .primary{background:#ffd166;color:#07121a;border-color:#ffd166}header aside{max-width:900px;margin-top:38px;padding:20px 22px;border-left:3px solid #ffd166;background:#ffd1660d}header aside b,header aside span{display:block}header aside b{color:#ffd166;font-size:10px;letter-spacing:.12em}header aside span{margin-top:8px;color:#9fb2bc;line-height:1.65;font-size:12px}section{padding:72px 0;border-top:1px solid #ffffff10}section h2{font-size:clamp(36px,5vw,60px);line-height:1.04;max-width:980px;margin:10px 0 30px}.offers{display:grid;grid-template-columns:repeat(2,1fr);gap:15px}.offers article{position:relative;min-height:330px;padding:28px;border:1px solid #ffffff16;border-radius:20px;background:linear-gradient(145deg,#081a25,#041018)}.offers article>span{color:#ffd166;font-size:11px;font-weight:950}.offers h3{font-size:24px;margin:18px 0 10px}.offers p{color:#9db1bc;line-height:1.65;min-height:80px}.offers small{display:block;color:#6fdcf4;font-weight:950;letter-spacing:.12em;font-size:8px}.offers b{display:block;margin-top:8px;color:#dce8ed;font-size:12px;line-height:1.6}.offers a{position:absolute;left:28px;bottom:26px;color:#ffd166;text-decoration:none;font-size:9px;font-weight:950}.steps{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.steps article{padding:22px 18px;border:1px solid #ffffff14;border-radius:14px;background:#06131c}.steps span{color:#ffd166;font-weight:950}.steps b{display:block;margin-top:18px;font-size:11px}.steps p{color:#8fa5b0;font-size:11px;line-height:1.6}.buyer{display:grid;grid-template-columns:1.1fr .9fr;gap:24px;align-items:center}.buyer>div>p{color:#a4b6bf;font-size:16px;line-height:1.7}.question{padding:30px;border:1px solid #ffd16644;border-radius:20px;background:#2d240d55}.question small{color:#ffd166;font-size:9px;font-weight:950}.question strong{display:block;margin:16px 0 22px;font:25px/1.45 Georgia,serif}.question a{color:#07121a;background:#ffd166;padding:13px 16px;text-decoration:none;font-size:9px;font-weight:950;border-radius:8px}footer{padding:50px 0 80px;border-top:1px solid #ffffff10;display:flex;justify-content:space-between;gap:20px;color:#718894;font-size:9px}footer b{color:#ffd166}@media(max-width:850px){.offers,.buyer{grid-template-columns:1fr}.steps{grid-template-columns:1fr 1fr}.page>nav span{display:none}}@media(max-width:560px){.offers,.steps{grid-template-columns:1fr}.page>nav{flex-wrap:wrap;padding:18px 0}h1{font-size:50px}}`
    }</style>
  </main>
}
