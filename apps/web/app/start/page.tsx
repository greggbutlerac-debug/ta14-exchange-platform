import Link from 'next/link';

export const metadata = {
  title: 'Start with TA-14 | 60 days free',
  description: 'Start TA-14 governance software free for 60 days with no credit card, or choose independent review, governance registration, or institutional deployment.',
};

const paths = [
  {
    n: '01',
    title: 'I need continuing governance software',
    price: '60 DAYS FREE · then $19 / $49 / $99 monthly',
    copy: 'For organizations operating AI connected to the European market that need system identity, obligations, evidence, change, review, and revalidation kept connected over time.',
    bullets: ['No credit card to start', 'Evidence Passport — $19/month after trial', 'Compliance Workspace — $49/month after trial', 'Governance Pro — $99/month after trial'],
    href: '/start-free',
    cta: 'Start 60 days free',
    featured: true,
  },
  {
    n: '02',
    title: 'I need TA-14 to review one consequential claim',
    price: '$249 Snapshot · $750+ Execution Claim Review',
    copy: 'For APIs, agents, workflows, evidence chains, financial routes, and other consequential execution claims that need a bounded examination rather than another self-assessment.',
    bullets: ['Execution Evidence Snapshot — $249', 'Execution Claim Review — from $750', 'Evidence, authority, and changed-condition boundary', 'Truthful result preserved even when the claim is unsupported'],
    href: '/execution-claim-review',
    cta: 'Examine a consequential claim',
  },
  {
    n: '03',
    title: 'I built a governance architecture',
    price: 'Register identity · establish lineage · demonstrate bounded claims',
    copy: 'For architects and institutions that want an attributable governance baseline preserved in the TA-14 Registry and, where appropriate, examined through a bounded governed demonstration.',
    bullets: ['Register the governance baseline', 'Preserve identity, version, steward, and chronology', 'Define a bounded demonstration question', 'Publish findings without overstating what was established'],
    href: '/workspace/ai-governance/registry/register',
    cta: 'Register governance',
  },
  {
    n: '04',
    title: 'I need institutional deployment',
    price: 'Custom scope · enterprise pilots available',
    copy: 'For organizations that need sustained multi-route governance, evidence architecture, implementation support, replay design, and an institutional operating model.',
    bullets: ['Multi-route governance program', 'Architecture and integration support', 'Evidence and continuity infrastructure', 'Enterprise implementation roadmap'],
    href: '/pricing',
    cta: 'View institutional options',
  },
] as const;

export default function StartPage() {
  return <main className="page">
    <nav><Link href="/">TA-14 EXCHANGE</Link><span>START HERE</span><Link href="/start-free">60 DAYS FREE →</Link></nav>
    <header className="hero">
      <small>ONE QUESTION BEFORE THE PRODUCT</small>
      <h1>WHAT DO YOU NEED<br/><em>TA-14 TO DO?</em></h1>
      <p>The Exchange contains governance software, independent review, registration, demonstrations, artifacts, verification, education, and institutional deployment. You should not have to understand the whole institution before knowing where to start.</p>
      <div className="trialBanner"><div><b>TRY THE GOVERNANCE SOFTWARE ON REAL WORK</b><strong>60 DAYS FREE</strong><span>No credit card · No contract · No automatic charge</span></div><Link href="/start-free">START FREE →</Link></div>
      <div className="chain">REALITY <b>→</b> RECORD <b>→</b> CONTINUITY <b>→</b> ADMISSIBILITY <b>→</b> BINDING <b>→</b> COMMIT <b>→</b> EXECUTION <b>→</b> OUTCOME</div>
    </header>

    <section className="routes">
      {paths.map((p) => <article key={p.n} className={'featured' in p && p.featured ? 'featured' : ''}>
        <div className="num">{p.n}</div>
        <div className="body"><small>{'featured' in p && p.featured ? 'LOWEST-FRICTION COMMERCIAL ENTRY' : 'CHOOSE THIS PATH IF...'}</small><h2>{p.title}</h2><strong className="price">{p.price}</strong><p>{p.copy}</p><ul>{p.bullets.map(x => <li key={x}>{x}</li>)}</ul><Link href={p.href}>{p.cta.toUpperCase()} →</Link></div>
      </article>)}
    </section>

    <section className="conversion">
      <div><small>NEED A BOUNDED INDEPENDENT REVIEW?</small><h2>Not sure whether the evidence can support the claim?</h2><p>Start with a $249 Execution Evidence Snapshot. If the question requires deeper failure challenges, changed-condition analysis, authority review, or replay, move into the full Execution Claim Review from $750. Payment never purchases a favorable result.</p></div>
      <div className="conversionlinks"><Link href="/execution-evidence-snapshot">START WITH THE $249 SNAPSHOT →</Link><Link href="/execution-claim-review">OPEN THE $750+ CLAIM REVIEW →</Link><Link href="/execution-claim-review/intake">REQUEST A BOUNDED SCOPE →</Link></div>
    </section>

    <section className="proof">
      <div><small>NOT READY TO BUY?</small><h2>Inspect the institution before you trust it.</h2><p>Registration is not certification. A demonstration does not establish more than its bounded question. TA-14 publishes artifacts, limitations, unresolved conditions, and verification surfaces so the evidence can be inspected before a commercial decision.</p></div>
      <div className="prooflinks"><Link href="/artifacts/founding-demonstrations">FOUNDING DEMONSTRATIONS →</Link><Link href="/artifacts/registry">ARTIFACT REGISTRY →</Link><Link href="/workspace/ai-governance/registry/directory">GOVERNANCE REGISTRY →</Link><Link href="/runtime">OPEN RUNTIME →</Link></div>
    </section>

    <section className="boundary"><small>COMMERCIAL BOUNDARY</small><h2>Payment buys access, work, or infrastructure—not a favorable finding.</h2><p>TA-14 subscriptions, registrations, reviews, and institutional services do not purchase certification, endorsement, legal advice, regulatory approval, conformity assessment, or a predetermined result. Findings remain bounded by the evidence and the scope actually examined.</p></section>

    <footer><Link href="/">TA-14 Authority Governance Institution</Link><span>No admissible evidence. No admissible execution.</span></footer>
    <style>{`*{box-sizing:border-box}.page{min-height:100vh;background:radial-gradient(circle at 50% 0,#0d3153 0,#040914 35%,#010306 100%);color:#eef7ff;font-family:Inter,system-ui,sans-serif;padding-bottom:60px}a{color:inherit;text-decoration:none}nav{height:70px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #173752;background:rgba(2,7,13,.9);position:sticky;top:0;z-index:10;backdrop-filter:blur(18px)}nav a,nav span{font-size:10px;font-weight:900;letter-spacing:.14em;color:#83dfff}.hero{max-width:1250px;margin:auto;padding:100px 5vw 70px;text-align:center}.hero small,.body small,.proof small,.boundary small,.conversion small{color:#70dfff;font-size:10px;font-weight:950;letter-spacing:.2em}.hero h1{font:clamp(52px,8vw,104px)/.88 Georgia,serif;margin:24px 0}.hero h1 em{font-style:normal;color:#7ee6ff}.hero p{max-width:900px;margin:auto;color:#b3c7d6;font-size:18px;line-height:1.8}.trialBanner{max-width:940px;margin:34px auto 0;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;gap:24px;text-align:left;border:1px solid #4bc8e8;background:linear-gradient(135deg,#0a2a3c,#07131d);box-shadow:0 18px 55px #006b8d2b}.trialBanner b,.trialBanner strong,.trialBanner span{display:block}.trialBanner b{font-size:8px;letter-spacing:.14em;color:#82e9ff}.trialBanner strong{font:30px Georgia,serif;margin:4px 0;color:#fff}.trialBanner span{font-size:10px;color:#9db8c8}.trialBanner a{padding:14px 18px;background:#86e9ff;color:#031018;font-size:9px;font-weight:950;white-space:nowrap}.chain{margin:20px auto 0;max-width:1050px;padding:14px;border:1px solid #173e5b;background:#06121e;color:#94aec0;font-size:9px;font-weight:900;letter-spacing:.1em}.chain b{color:#64dcff;margin:0 7px}.routes{max-width:1400px;margin:auto;padding:0 5vw 70px;display:grid;grid-template-columns:1fr 1fr;gap:14px}.routes article{display:grid;grid-template-columns:76px 1fr;min-height:440px;border:1px solid #1d405b;background:linear-gradient(145deg,#071522,#040b13);transition:.2s}.routes article.featured{border-color:#4bc9e8;background:linear-gradient(145deg,#0a2434,#05101a);box-shadow:0 20px 65px #00688a22}.routes article:hover{border-color:#4fb7d6;transform:translateY(-2px)}.num{padding:26px 18px;color:#64dcff;font:30px Georgia,serif;border-right:1px solid #173752}.body{padding:28px}.body h2{font:32px/1.05 Georgia,serif;margin:10px 0 14px}.price{display:block;color:#f1c86c;font-size:14px;margin-bottom:16px}.body p{color:#9fb5c5;line-height:1.7;font-size:14px}.body ul{padding:0;list-style:none;display:grid;gap:9px;margin:22px 0}.body li{color:#d2e1ea;font-size:13px}.body li:before{content:'✓';color:#65e8ad;margin-right:9px;font-weight:900}.body>a{display:inline-flex;margin-top:12px;padding:13px 15px;border-radius:9px;background:#72e2ff;color:#041018;font-size:10px;font-weight:950;letter-spacing:.06em}.conversion,.proof,.boundary{max-width:1260px;margin:0 auto 90px;padding:42px 5vw;border:1px solid #1b405b;background:#06121d}.conversion{display:grid;grid-template-columns:1.2fr .8fr;gap:50px;border-color:#5b4821;background:linear-gradient(135deg,#151006,#07131c)}.conversion small{color:#f0c765}.conversion h2,.proof h2,.boundary h2{font:clamp(34px,4vw,55px)/1 Georgia,serif;margin:12px 0}.conversion p,.proof p,.boundary p{color:#9fb5c5;line-height:1.75}.conversionlinks,.prooflinks{display:grid;gap:10px;align-content:center}.conversionlinks a{padding:15px;border:1px solid #70592a;background:#1b1408;color:#f5d781;font-size:10px;font-weight:950;letter-spacing:.07em}.proof{display:grid;grid-template-columns:1.2fr .8fr;gap:50px}.prooflinks a{padding:15px;border:1px solid #26506d;background:#091925;color:#9fe9ff;font-size:10px;font-weight:950;letter-spacing:.07em}.boundary{border-color:#5b4821;background:#151006}.boundary small{color:#f0c765}.boundary h2{max-width:900px}.boundary p{max-width:1000px;color:#c9bfa7}footer{max-width:1260px;margin:auto;padding:30px 5vw;border-top:1px solid #152d40;display:flex;justify-content:space-between;gap:20px;color:#718b9e;font-size:11px}footer a{color:#c9dbe7;font-weight:800}@media(max-width:850px){nav span{display:none}.routes{grid-template-columns:1fr}.routes article{grid-template-columns:55px 1fr}.num{padding:22px 12px}.conversion,.proof{grid-template-columns:1fr}.hero{padding-top:70px}.trialBanner{align-items:stretch;flex-direction:column;text-align:center}.trialBanner a{text-align:center}footer{flex-direction:column}}`}</style>
  </main>;
}