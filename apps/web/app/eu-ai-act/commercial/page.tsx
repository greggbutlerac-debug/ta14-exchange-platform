import Link from 'next/link';

type Plan={name:string;monthly:string;annual:string;savings:string;systems:string;best?:boolean;outcome:string;features:string[];href:string};

const plans:Plan[]=[
  {name:'EVIDENCE PASSPORT',monthly:'$19',annual:'$182.40',savings:'Save $45.60 / year',systems:'Up to 3 AI systems',outcome:'Keep a small AI portfolio organized around a living evidence record instead of scattered compliance files.',features:['Persistent System Passports','Article 4 + Article 50 tracking','Bounded evidence records and current state','Version and change history','Monthly evidence-state review view','TA-14 Academy guidance inside the workflow'],href:'/eu-ai-act/join?plan=passport'},
  {name:'COMPLIANCE WORKSPACE',monthly:'$49',annual:'$470.40',savings:'Save $117.60 / year',systems:'Up to 10 AI systems',outcome:'Turn EU AI Act work into a repeatable team process with owners, evidence gaps, documentation and oversight records.',features:['Everything in Evidence Passport','Team evidence workspace','Obligation-to-evidence gap matrix','Technical-documentation workspace','Human-oversight records','Incident and corrective-action records','Structured readiness views by system'],href:'/eu-ai-act/join?plan=workspace'},
  {name:'GOVERNANCE PRO',monthly:'$99',annual:'$950.40',savings:'Save $237.60 / year',systems:'Up to 25 AI systems',best:true,outcome:'Operate a serious governance program across a growing portfolio and know what changed, what is under pressure and what must be revalidated.',features:['Everything in Compliance Workspace','High-risk readiness workflows','GPAI and FRIA evidence pathways','Post-market monitoring records','Material-change revalidation','Classification + obligation + evidence continuity','Command Center portfolio visibility','Preserved determination and revalidation history'],href:'/eu-ai-act/join?plan=pro'},
  {name:'INSTITUTION',monthly:'$499',annual:'$4,790.40',savings:'Save $1,197.60 / year',systems:'Portfolio / institutional use',outcome:'Give leadership, governance teams and examiners a shared operating picture across business units without collapsing evidence, authority or review boundaries.',features:['Everything in Governance Pro','Portfolio and business-unit dashboards','Authority and accountable-owner workflows','Controlled examiner-room pathways','Executive governance reporting','Cross-system change and revalidation visibility','Institutional evidence and determination continuity','Priority access for scoped TA-14 review pathways'],href:'/eu-ai-act/join?plan=institution'},
];

const urgentQuestions=[
  ['01','DO WE HAVE AN EU AI ACT PROBLEM?','Identify the AI system, intended purpose, actor role, EU exposure, possible risk path and unresolved facts before treating a generic checklist as applicable.'],
  ['02','WHAT DO WE NEED TO SHOW?','Map obligations to the documents, tests, notices, decisions, owners, versions and limitations that actually support the position being taken.'],
  ['03','WHAT IS MISSING RIGHT NOW?','Expose evidence gaps, stale evidence, review-required determinations and material changes instead of burying them in folders.'],
  ['04','CAN WE STILL RELY ON YESTERDAY\'S ANSWER?','Revalidate when the model, use case, vendor, evidence, authority, deployment or legal-source state changes.'],
];

const journey=[
  ['01','CLASSIFY','Start with the actual AI system and identify possible actor, scope and risk pathways.','/eu-ai-act/classifier'],
  ['02','MAP','Translate applicable or potentially applicable requirements into bounded evidence and ownership routes.','/eu-ai-act'],
  ['03','PRESERVE','Create a living System Passport and evidence state instead of a one-time spreadsheet.','/eu-ai-act/passport'],
  ['04','REVALIDATE','Keep prior determinations under pressure when the system or source state changes.','/eu-ai-act/command-center'],
];

export default function EUAICommercial(){return <main className="page">
  <nav>
    <Link href="/eu-ai-act">← EU AI ACT WORLD</Link>
    <b>TA-14 · GOVERNED WORLD 05</b>
    <Link className="navCta" href="/eu-ai-act/classifier">CHECK MY AI SYSTEM — FREE →</Link>
  </nav>

  <header className="hero">
    <small>EU AI ACT COMPLIANCE OPERATING LAYER</small>
    <h1>KNOW WHAT APPLIES.<br/><em>KNOW WHAT YOU CAN PROVE.</em></h1>
    <p>If your organization develops, sells, deploys, imports or operates AI connected to the European market, the hard part is no longer finding the regulation. The hard part is maintaining a defensible record of the system, the obligation, the evidence, the decision, the limitation and what changed.</p>
    <div className="heroActions">
      <Link className="primary" href="/eu-ai-act/classifier">CHECK MY AI SYSTEM — FREE →</Link>
      <Link className="reviewCta" href="#readiness-review">GET A GOVERNED READINESS REVIEW →</Link>
      <Link className="secondary" href="#pricing">VIEW SOFTWARE PLANS ↓</Link>
    </div>
    <div className="trust">
      <span>FREE SYSTEM CLASSIFICATION ENTRY</span>
      <span>PAID GOVERNANCE WORKSPACES</span>
      <span>FIXED-SCOPE HUMAN REVIEW</span>
      <span>NO AUTOMATIC COMPLIANCE CLAIM</span>
    </div>
  </header>

  <section className="problem">
    <div className="sectionHead">
      <small>THE BUSINESS PROBLEM</small>
      <h2>Compliance is not a PDF you finish once.</h2>
      <p>AI systems change. Vendors change. intended purpose changes. Evidence ages. Guidance changes. People need a current answer to four operational questions.</p>
    </div>
    <div className="problemGrid">{urgentQuestions.map(([n,title,copy])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
  </section>

  <section className="journey">
    <div className="sectionHead"><small>THE GOVERNED PATH</small><h2>From uncertainty to a maintained evidence position.</h2><p>The system starts with a real AI use case, not a subscription tier.</p></div>
    <div className="journeyGrid">{journey.map(([n,title,copy,href])=><Link href={href} key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p><b>OPEN →</b></Link>)}</div>
  </section>

  <section className="free">
    <div><small>NO PURCHASE REQUIRED</small><h2>Start with your actual AI system.</h2><p>Use the free classifier to establish the system, intended purpose, possible actor role, EU exposure and unresolved facts. You do not need to understand TA-14 before starting.</p></div>
    <Link href="/eu-ai-act/classifier">CHECK MY AI SYSTEM — FREE →</Link>
  </section>

  <section id="readiness-review" className="reviewOffer">
    <div className="reviewLead">
      <small>NEED HUMAN HELP NOW?</small>
      <h2>EU AI Act Governed Readiness Review</h2>
      <p>A fixed-scope review for one AI system when your organization needs more than software and wants a bounded second set of eyes on the current position.</p>
      <div className="price"><strong>$750</strong><span>starting fixed scope · one AI system</span></div>
      <Link href="/eu-ai-act/readiness-review">REQUEST THE REVIEW →</Link>
    </div>
    <div className="reviewScope">
      <article><b>01 · SYSTEM & ROLE</b><p>Identify the system, intended purpose, organizational role, EU exposure and declared scope.</p></article>
      <article><b>02 · APPLICABILITY</b><p>Map the relevant or potentially relevant EU AI Act routes and preserve unresolved questions rather than forcing certainty.</p></article>
      <article><b>03 · EVIDENCE STATE</b><p>Separate what is currently supported from evidence gaps, stale objects, unsupported reliance and review-required conditions.</p></article>
      <article><b>04 · GOVERNED OUTPUT</b><p>Return a bounded readiness record with findings, limitations and the next evidence actions. The review is not legal advice, certification, conformity assessment or regulatory approval.</p></article>
    </div>
  </section>

  <section id="pricing" className="pricing">
    <div className="sectionHead centered">
      <small>CONTINUING GOVERNANCE SOFTWARE</small>
      <h2>Pay to maintain the record—not to read the law.</h2>
      <p>The regulation is public. The subscription value is the operating layer that keeps system identity, classification, obligations, evidence, change, review and revalidation connected over time.</p>
    </div>
    <div className="plans">{plans.map(p=><article key={p.name} className={p.best?'best':''}>
      {p.best&&<div className="flag">BEST FOR AN ACTIVE GOVERNANCE PROGRAM</div>}
      <small>{p.systems}</small>
      <h3>{p.name}</h3>
      <div className="monthly"><strong>{p.monthly}</strong><span>/ month</span></div>
      <div className="annual"><b>{p.annual}</b><span>/ year · 20% savings</span></div>
      <div className="save">{p.savings}</div>
      <div className="outcome"><b>WHAT THIS TIER DOES FOR YOU</b><p>{p.outcome}</p></div>
      <ul>{p.features.map(f=><li key={f}>✓ {f}</li>)}</ul>
      <Link href={p.href}>START {p.name} →</Link>
    </article>)}</div>
    <div className="paymentNote"><b>IMPORTANT CAPABILITY BOUNDARY</b><p>Subscription access does not purchase a favorable finding, certification, legal opinion, conformity assessment, CE marking or regulatory approval. Human review remains a separately governed activity unless a specific written scope says otherwise.</p></div>
  </section>

  <section className="buyers">
    <div className="sectionHead"><small>WHO THIS IS FOR</small><h2>Built for organizations that need to operate—not just study.</h2></div>
    <div className="buyerGrid">
      {[
        ['AI SaaS & software companies','Teams selling or deploying AI products into Europe that need system-level evidence and change continuity.'],
        ['Employers using AI','Organizations using AI in recruitment, workforce management, support, monitoring or other consequential workflows.'],
        ['US & non-EU companies','Providers and operators outside Europe with systems, customers, users or market exposure inside the EU.'],
        ['Compliance & governance teams','Counsel, privacy, risk, security and AI-governance teams that need one operating picture instead of disconnected spreadsheets.'],
        ['Consultants & advisors','Professionals who need a governed evidence workspace while preserving the boundary between advisory work and formal determinations.'],
        ['Multi-system organizations','Businesses with enough AI systems that version drift, evidence age and ownership become a portfolio problem.'],
      ].map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}
    </div>
  </section>

  <section className="decision">
    <div><small>START WITH THE PROBLEM YOU HAVE</small><h2>You do not need to choose the perfect plan first.</h2><p>If you are unsure what applies, classify the system free. If you already know you need help, request the $750 readiness review. If you need continuing evidence infrastructure, start a subscription.</p></div>
    <div className="decisionActions">
      <Link className="primary" href="/eu-ai-act/classifier">CLASSIFY MY SYSTEM →</Link>
      <Link className="reviewCta" href="/eu-ai-act/readiness-review">REQUEST A REVIEW →</Link>
      <Link className="secondary" href="/eu-ai-act/join">START PAID ACCESS →</Link>
    </div>
  </section>

  <section className="boundary">
    <small>GOVERNANCE BOUNDARY</small>
    <h2>Evidence infrastructure is not a disguised certification claim.</h2>
    <p>TA-14 can structure and preserve applicability reasoning, evidence, gaps, review, change and outcome records. Subscription access and a readiness review do not themselves constitute legal advice, regulatory approval, CE marking, notified-body conformity assessment, certification or a favorable regulator determination.</p>
    <div><Link href="/eu-ai-act">RETURN TO EU AI ACT WORLD</Link><Link href="/eu-ai-act/command-center">OPEN COMMAND CENTER</Link><Link href="/eu-ai-act/join">START GOVERNED ACCESS</Link></div>
  </section>

  <style>{`*{box-sizing:border-box}.page{min-height:100vh;background:radial-gradient(circle at 50% 0,#0b315d 0,#030711 34%,#010205 100%);color:#eef6ff;padding-bottom:100px;font-family:Inter,system-ui,sans-serif}nav{height:72px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #173a5a;background:rgba(2,7,14,.9);position:sticky;top:0;z-index:20;backdrop-filter:blur(18px)}nav a{color:#83e7ff;text-decoration:none;font-size:10px;font-weight:900;letter-spacing:.1em}nav b{font-size:9px;letter-spacing:.18em;color:#7e96aa}.navCta{border:1px solid #69dcff;padding:11px 15px;border-radius:999px}.hero{max-width:1280px;margin:auto;padding:100px 24px 90px;text-align:center}.hero>small,.sectionHead small,.free small,.decision small,.boundary>small,.reviewLead>small{color:#73dfff;letter-spacing:.22em;font-size:10px;font-weight:900}.hero h1{font:clamp(50px,7vw,98px)/.9 Georgia,serif;margin:24px 0}.hero h1 em{font-style:normal;color:#83e8ff}.hero>p{max-width:980px;margin:auto;color:#bfd0de;font-size:19px;line-height:1.78}.heroActions,.decisionActions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:30px}.primary,.secondary,.reviewCta{padding:15px 18px;text-decoration:none;font-size:10px;font-weight:950;letter-spacing:.07em;border-radius:10px}.primary{background:#7de6ff;color:#051018}.secondary{border:1px solid #315d7a;color:#c9e7f4;background:#07121e}.reviewCta{background:linear-gradient(135deg,#e3b85d,#ffe7a8);color:#171005}.trust{margin:38px auto 0;display:flex;justify-content:center;gap:8px;flex-wrap:wrap}.trust span{border:1px solid #183d5a;background:#06101b;padding:8px 10px;color:#8aa6ba;font-size:8px;font-weight:900}.problem,.journey,.pricing,.buyers{max-width:1500px;margin:0 auto 100px;padding:0 5vw}.sectionHead{max-width:880px;margin-bottom:34px}.sectionHead h2,.free h2,.decision h2,.boundary h2,.reviewLead h2{font:clamp(34px,4vw,60px)/1 Georgia,serif;margin:12px 0}.sectionHead p,.free p,.decision p,.boundary p,.reviewLead p,.reviewScope p,.buyerGrid p{color:#9fb4c7;line-height:1.7}.problemGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.problemGrid article{padding:25px;border:1px solid #244b67;background:#06131f;min-height:250px}.problemGrid span{font:30px Georgia,serif;color:#72e2fc}.problemGrid h3{font-size:13px;letter-spacing:.05em}.problemGrid p{font-size:12px;color:#9db1c1;line-height:1.7}.journeyGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.journeyGrid a{min-height:250px;border:1px solid #1b405e;background:#081522;padding:24px;text-decoration:none;color:#eef6ff;display:flex;flex-direction:column}.journeyGrid span{font:28px Georgia,serif;color:#62dafa}.journeyGrid p{color:#8fa7b9;line-height:1.6;font-size:13px}.journeyGrid b{margin-top:auto;color:#6edffb;font-size:9px}.free,.decision{max-width:1350px;margin:0 auto 100px;padding:38px 42px;border:1px solid #24506d;background:#071522;display:flex;align-items:center;justify-content:space-between;gap:30px}.free>div,.decision>div{max-width:820px}.free>a{white-space:nowrap;text-decoration:none;background:#eef7ff;color:#06111b;padding:16px 18px;font-size:10px;font-weight:950;border-radius:10px}.reviewOffer{max-width:1350px;margin:0 auto 100px;padding:42px;border:1px solid #b78938;background:radial-gradient(circle at 0 0,#d9ac531d,transparent 34%),#0c0c0b;display:grid;grid-template-columns:.8fr 1.2fr;gap:36px}.reviewLead .price{display:flex;align-items:end;gap:14px;margin:24px 0}.reviewLead .price strong{font:58px Georgia,serif;color:#f2d083}.reviewLead .price span{color:#a99773;font-size:10px;padding-bottom:8px}.reviewLead>a{display:inline-block;background:linear-gradient(135deg,#e3b85d,#ffe7a8);color:#171005;text-decoration:none;padding:15px 18px;border-radius:10px;font-size:9px;font-weight:950}.reviewScope{display:grid;grid-template-columns:1fr 1fr;gap:10px}.reviewScope article{padding:22px;border:1px solid #5d4b2c;background:#100e09}.reviewScope b{font-size:9px;color:#f1cf7c}.reviewScope p{font-size:11px}.centered{text-align:center;margin:0 auto 42px}.plans{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;align-items:stretch}.plans article{position:relative;border:1px solid #1d405e;background:#06101c;padding:28px 25px;border-radius:22px;display:flex;flex-direction:column;overflow:hidden}.plans article.best{border-color:#e9bd64;background:linear-gradient(180deg,#17160c,#07101b 38%)}.flag{margin:-28px -25px 24px;padding:10px;text-align:center;background:#d9ac53;color:#171005;font-size:8px;font-weight:950}.plans article>small{color:#68dfff;font-size:9px}.plans h3{font:24px Georgia,serif;min-height:58px}.monthly strong{font:46px Georgia,serif}.monthly span,.annual span{color:#7894a8;font-size:10px}.annual{margin-top:10px}.annual b{font-size:18px}.annual span{display:block}.save{margin:14px 0;padding:8px 10px;border:1px solid #2e644f;background:#071a14;color:#75e5ad;font-size:9px;font-weight:900}.outcome{padding:14px;border:1px solid #24465d;background:#040b12}.outcome b{font-size:8px;color:#7de6ff;letter-spacing:.1em}.outcome p{font-size:11px;color:#b5c6d2;line-height:1.55}.plans ul{list-style:none;padding:0;margin:16px 0 24px;color:#a8bbca;font-size:11px;line-height:1.8}.plans article>a{margin-top:auto;text-align:center;text-decoration:none;background:#7de6ff;color:#061018;padding:14px 12px;border-radius:9px;font-size:9px;font-weight:950}.paymentNote{margin-top:20px;border:1px solid #6a572c;background:#110e07;padding:22px}.paymentNote b{color:#ffd77e;font-size:10px}.paymentNote p{color:#aa9c7e;font-size:12px;line-height:1.65}.buyerGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.buyerGrid article{padding:25px;border:1px solid #1f435d;background:#06121d}.buyerGrid h3{font:22px Georgia,serif;margin:0 0 8px}.buyerGrid p{font-size:12px}.decisionActions{margin:0;min-width:340px}.boundary{max-width:1100px;margin:0 auto;padding:42px;border:1px solid #3a4b5c;border-radius:24px;background:#050b13;text-align:center}.boundary>small{color:#ffd77e}.boundary>div{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin-top:26px}.boundary a{color:#7de6ff;font-size:10px;font-weight:900}@media(max-width:1100px){.plans,.problemGrid,.journeyGrid,.buyerGrid{grid-template-columns:repeat(2,1fr)}.reviewOffer{grid-template-columns:1fr}.free,.decision{margin-left:5vw;margin-right:5vw}}@media(max-width:680px){nav b{display:none}.hero{padding-top:70px}.plans,.problemGrid,.journeyGrid,.buyerGrid,.reviewScope{grid-template-columns:1fr}.free,.decision{padding:28px 24px;display:block}.free>a{display:inline-block;margin-top:20px}.decisionActions{justify-content:flex-start;min-width:0}.reviewOffer{margin-left:5vw;margin-right:5vw;padding:28px 22px}.boundary{margin:0 5vw;padding:30px 22px}}`}</style>
</main>}
