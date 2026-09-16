import Link from 'next/link';

const chain = ['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'];

const showrooms = [
  {
    n:'01', code:'UAE', flag:'🇦🇪', country:'UNITED ARAB EMIRATES', institution:'Ministry of Climate Change and Environment',
    status:'PUBLIC TECHNICAL SHOWROOM', language:'ARABIC + ENGLISH',
    question:'How can national air-quality measurement remain governed as evidence moves toward consequential environmental action?',
    detail:'Country-specific examination of how native national environmental measurement can remain intact while TA-14 governs continuity between evidence, authority, execution, and outcome.',
    href:'/environmental-integrity-governance/uae', accent:'#ef3340'
  },
  {
    n:'02', code:'TH', flag:'🇹🇭', country:'KINGDOM OF THAILAND', institution:'Pollution Control Department',
    status:'EXECUTIVE MATERIAL REQUESTED', language:'THAI + ENGLISH',
    question:'When does air-quality evidence become sufficiently current, traceable, and authorized to support consequential action?',
    detail:'A localized institutional surface that preserves Thailand-specific language, public-source context, environmental evidence pathways, and the bounded technical question under examination.',
    href:'/global-institutional-engagement/thailand', accent:'#2d5fb3'
  },
  {
    n:'03', code:'GT', flag:'🇬🇹', country:'REPUBLIC OF GUATEMALA', institution:'Ministerio de Ambiente y Recursos Naturales · MARN',
    status:'TECHNICAL CONVERSATION REQUESTED', language:'SPANISH + ENGLISH',
    question:'What must remain demonstrably true when technically valid atmospheric evidence begins to acquire institutional or operational consequence?',
    detail:'Built around MARN’s native monitoring and laboratory context, with AIR → EIG → AEA exposed as a complementary governance path rather than a replacement for existing measurement or public authority.',
    href:'/global-institutional-engagement/guatemala', accent:'#4997d0'
  },
];

const progression = [
  ['01','Institutional signal','A substantive public request, reply, technical question, or bounded reason to build exists.'],
  ['02','Country reconstruction','TA-14 maps the native institution, local environmental pathway, language, sources, and authority context.'],
  ['03','Public showroom','A country-specific technical surface is published so the proposition, boundaries, and examination path are visible.'],
  ['04','Bounded examination','If both sides choose to proceed, a native evidence case is frozen prospectively with proposition, falsifier, authority path, and outcome criteria.'],
  ['05','Preserved record','What actually happened is preserved. No later success silently erases an earlier failure, hold, or changed-context condition.'],
];

export const metadata = {
  title:'Global Institutional Engagement | TA-14 Authority',
  description:'TA-14 country-specific institutional engagement showrooms for bounded technical examination of evidence continuity, authority, execution and outcome.'
};

export default function GlobalInstitutionalEngagementPage(){
  return <main className="gie">
    <style>{`
      *{box-sizing:border-box}.gie{min-height:100vh;background:radial-gradient(circle at 12% 0%,rgba(47,141,198,.22),transparent 30%),radial-gradient(circle at 88% 3%,rgba(240,200,108,.11),transparent 24%),linear-gradient(180deg,#02070c,#06131c 44%,#02070b);color:#eef5f8;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.shell{width:min(1220px,calc(100% - 36px));margin:auto}.nav{height:78px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid rgba(255,255,255,.08)}.nav a{text-decoration:none;color:#d9e8ef;font-size:10px;font-weight:900;letter-spacing:.1em}.brand{font-size:18px!important}.brand span{color:#75ddff}.hero{padding:86px 0 46px}.eyebrow{color:#76ddff;font-size:10px;font-weight:950;letter-spacing:.2em}.hero h1{max-width:1050px;margin:17px 0 22px;font-family:Georgia,serif;font-size:clamp(54px,8vw,100px);line-height:.93;letter-spacing:-.05em}.hero h1 em{color:#f0c86c;font-style:normal}.hero p{max-width:930px;color:#adbec8;font-size:18px;line-height:1.72}.heroIntro{display:grid;grid-template-columns:1.35fr .65fr;gap:24px;align-items:start;margin-top:34px}.principle{padding:21px 24px;border-left:3px solid #f0c86c;background:rgba(240,200,108,.055);font-family:Georgia,serif;font-size:21px}.definition{padding:22px;border:1px solid rgba(118,221,255,.17);border-radius:16px;background:rgba(4,18,27,.72)}.definition strong{display:block;color:#9fdff2;font-size:9px;letter-spacing:.16em}.definition p{margin:10px 0 0;font-size:13px!important;line-height:1.65!important;color:#91a5b0!important}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:7px;margin:34px 0 64px}.chain span{padding:13px 8px;border:1px solid rgba(118,221,255,.18);border-radius:9px;text-align:center;color:#9fdff2;font-size:8px;font-weight:950;letter-spacing:.08em;background:rgba(4,18,27,.82)}.section{padding:68px 0;border-top:1px solid rgba(255,255,255,.07)}.section h2{max-width:980px;margin:10px 0 14px;font-family:Georgia,serif;font-size:clamp(36px,5vw,60px);line-height:1.04}.section>p{max-width:930px;color:#9eb0bb;line-height:1.72}.explainGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:32px}.explainGrid article{padding:24px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:rgba(5,17,25,.72)}.explainGrid b{display:block;color:#dcebf1;font-size:12px}.explainGrid span{display:block;margin:8px 0 0;color:#7fd8f6;font-size:9px;font-weight:900;letter-spacing:.12em}.explainGrid p{margin:12px 0 0;color:#8fa3ad;font-size:12px;line-height:1.65}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:36px}.card{position:relative;min-height:500px;padding:30px;border:1px solid color-mix(in srgb,var(--accent) 55%,transparent);border-radius:24px;background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 11%,#06131d),rgba(2,8,13,.97));color:#eff6f8;text-decoration:none;overflow:hidden;transition:.25s;box-shadow:inset 0 1px 0 rgba(255,255,255,.035)}.card:hover{transform:translateY(-6px);box-shadow:0 28px 76px rgba(0,0,0,.4),0 0 34px color-mix(in srgb,var(--accent) 14%,transparent)}.number{font-size:10px;font-weight:950;color:var(--accent);letter-spacing:.16em}.flag{position:absolute;right:24px;top:23px;font-size:48px;line-height:1;filter:drop-shadow(0 8px 16px rgba(0,0,0,.35))}.card h3{margin:62px 0 8px;font-family:Georgia,serif;font-size:30px;line-height:1.02}.institution{display:block;color:#bdcbd2;font-size:12px;line-height:1.45;min-height:52px}.badges{display:flex;gap:7px;flex-wrap:wrap;margin:20px 0}.badges b{padding:7px 9px;border:1px solid rgba(255,255,255,.12);border-radius:999px;font-size:8px;letter-spacing:.08em;color:#c7d5dc}.question{color:#dce8ed;font-size:14px;line-height:1.62}.detail{color:#8399a5;font-size:12px;line-height:1.65}.enter{position:absolute;left:30px;bottom:28px;color:var(--accent);font-size:9px;font-weight:950;letter-spacing:.13em}.progress{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:34px}.progress article{position:relative;padding:22px 18px;border:1px solid rgba(118,221,255,.14);border-radius:14px;background:rgba(4,18,27,.7)}.progress span{font-size:9px;font-weight:950;color:#76ddff}.progress h3{font-size:14px;margin:9px 0}.progress p{color:#899da8;font-size:11px;line-height:1.6;margin:0}.boundary{margin-top:42px;padding:26px;border:1px solid rgba(240,200,108,.22);border-radius:16px;background:rgba(40,31,8,.18)}.boundary strong{color:#f0c86c;font-size:10px;letter-spacing:.14em}.boundary p{color:#aabac3;line-height:1.7;font-size:13px}.cta{display:grid;grid-template-columns:1.35fr .65fr;gap:22px;align-items:center;margin-top:34px;padding:30px;border:1px solid rgba(118,221,255,.18);border-radius:18px;background:linear-gradient(120deg,rgba(20,78,104,.32),rgba(3,13,20,.8))}.cta h3{margin:0;font-family:Georgia,serif;font-size:28px}.cta p{margin:8px 0 0;color:#91a7b2;font-size:13px;line-height:1.65}.cta a{justify-self:end;padding:13px 16px;border:1px solid rgba(118,221,255,.32);border-radius:10px;color:#dff5ff;text-decoration:none;font-size:10px;font-weight:900;letter-spacing:.1em}.footer{padding:44px 0 70px;border-top:1px solid rgba(255,255,255,.07);color:#738894;font-size:10px;line-height:1.7}@media(max-width:980px){.grid{grid-template-columns:1fr}.card{min-height:430px}.progress{grid-template-columns:1fr 1fr}.explainGrid{grid-template-columns:1fr}.heroIntro,.cta{grid-template-columns:1fr}.cta a{justify-self:start}}@media(max-width:760px){.chain{grid-template-columns:repeat(2,1fr)}.progress{grid-template-columns:1fr}.nav{gap:12px;flex-wrap:wrap;height:auto;padding:18px 0}.hero{padding-top:58px}}
    `}</style>
    <div className="shell">
      <nav className="nav"><Link className="brand" href="/"><span>TA-14</span> AUTHORITY</Link><Link href="/environmental-integrity-governance">ENVIRONMENTAL INTEGRITY</Link><Link href="/">RETURN TO SIX-WORLD FRONT DOOR</Link></nav>

      <header className="hero">
        <div className="eyebrow">GOVERNED WORLD 06 · GLOBAL INSTITUTIONAL ENGAGEMENT</div>
        <h1>One architecture.<br/><em>Many jurisdictions.</em></h1>
        <p>Global Institutional Engagement is TA-14’s public country-level examination world. It exists to show, jurisdiction by jurisdiction, how technically valid environmental evidence moves toward consequential action — while preserving the native institution, native measurement system, native authority, local language, public record, and changed-context boundary.</p>
        <div className="heroIntro">
          <div className="principle">No admissible evidence. No admissible execution.</div>
          <div className="definition"><strong>WHAT A COUNTRY SHOWROOM IS</strong><p>Not a sales landing page. Not a claim of government adoption. It is a preserved technical surface showing what TA-14 understands, what remains native, what question is open, what would be examined, and what has actually been earned in the engagement record.</p></div>
        </div>
      </header>

      <div className="chain">{chain.map(x=><span key={x}>{x}</span>)}</div>

      <section className="section">
        <div className="eyebrow">WHY THIS WORLD EXISTS</div>
        <h2>Measurement, evidence, authority and execution are not the same thing.</h2>
        <p>Countries already have ministries, laboratories, monitoring networks, standards, operators, legal authorities and public reporting systems. TA-14 does not begin by asking them to replace those systems. It begins at the seam between what has been observed and what someone is allowed to do because of it.</p>
        <div className="explainGrid">
          <article><b>Native infrastructure stays native.</b><span>MEASUREMENT + INSTITUTION</span><p>Sensors, laboratories, public agencies, technical methods, reporting systems and statutory authority remain where they already belong.</p></article>
          <article><b>TA-14 governs the transition.</b><span>EVIDENCE + AUTHORITY</span><p>AIR, EIG and AEA examine identity, continuity, admissibility, binding, authority, changed context and the exact consequence under consideration.</p></article>
          <article><b>The result must return to the record.</b><span>OUTCOME + REVALIDATION</span><p>Execution is not the end of the chain. Outcomes are preserved, compared against prior state, and revalidated before previous authority or evidence is trusted again.</p></article>
        </div>
      </section>

      <section className="section">
        <div className="eyebrow">COUNTRY SHOWROOM INDEX</div>
        <h2>Enter the jurisdiction being examined.</h2>
        <p>Every country surface uses the same governing architecture, but the institutional context is reconstructed independently. Language, native evidence pathway, official sources, open question, engagement status and technical examination must be earned separately for each jurisdiction.</p>
        <div className="grid">{showrooms.map(s=><Link key={s.code} href={s.href} className="card" style={{'--accent':s.accent} as React.CSSProperties}>
          <span className="number">SHOWROOM {s.n}</span><span className="flag" aria-hidden="true">{s.flag}</span>
          <h3>{s.country}</h3><span className="institution">{s.institution}</span>
          <div className="badges"><b>{s.status}</b><b>{s.language}</b></div>
          <p className="question">{s.question}</p><p className="detail">{s.detail}</p>
          <span className="enter">ENTER COUNTRY SHOWROOM →</span>
        </Link>)}</div>
      </section>

      <section className="section">
        <div className="eyebrow">HOW ENGAGEMENT ADVANCES</div>
        <h2>A showroom is a stage in a governed institutional record.</h2>
        <p>TA-14 does not treat a reply, a meeting, a pilot, an examination and an adoption as interchangeable. Each step must be separately established and preserved.</p>
        <div className="progress">{progression.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
        <div className="boundary"><strong>PUBLIC-RECORD BOUNDARY</strong><p>Placement in Global Institutional Engagement records a TA-14 technical engagement surface. It does not represent endorsement, adoption, certification, procurement, partnership, pilot authorization, governmental approval, or regulatory recognition unless a separate preserved record expressly establishes that fact.</p></div>
        <div className="cta"><div><h3>For institutions considering a technical examination</h3><p>Begin with one bounded native case. Freeze the proposition, evidence, falsifier, authority path and outcome criteria before execution. Preserve whatever happens.</p></div><a href="mailto:ta14admissibleexecution@gmail.com">REQUEST TECHNICAL EXAMINATION</a></div>
      </section>

      <footer className="footer">TA-14 AUTHORITY · GOVERNANCE INSTITUTION<br/>GLOBAL INSTITUTIONAL ENGAGEMENT · PUBLIC TECHNICAL EXAMINATION WORLD</footer>
    </div>
  </main>
}
