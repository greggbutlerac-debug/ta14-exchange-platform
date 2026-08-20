import Link from 'next/link';

type Faq={q:string;a:string};
type Card={title:string;copy:string};

type Props={
  eyebrow:string;
  title:string;
  accent:string;
  intro:string;
  sourceLabel:string;
  sourceHref:string;
  sourceNote:string;
  cards:Card[];
  steps:Card[];
  faqs:Faq[];
  classifierHref:string;
  workspaceHref?:string;
  workspaceLabel?:string;
};

export default function SeoAcquisitionPage({eyebrow,title,accent,intro,sourceLabel,sourceHref,sourceNote,cards,steps,faqs,classifierHref,workspaceHref='/eu-ai-act/commercial',workspaceLabel='VIEW EU AI ACT WORKSPACES →'}:Props){
  return <main className="seoPage">
    <nav><Link href="/eu-ai-act">← EU AI ACT WORLD</Link><span>TA-14 · GOVERNED WORLD 05</span><Link href={classifierHref}>CHECK MY AI SYSTEM — FREE →</Link></nav>

    <header className="hero">
      <small>{eyebrow}</small>
      <h1>{title}<br/><em>{accent}</em></h1>
      <p>{intro}</p>
      <div className="actions"><Link className="primary" href={classifierHref}>CHECK MY AI SYSTEM — FREE →</Link><Link className="secondary" href={workspaceHref}>{workspaceLabel}</Link></div>
      <div className="boundary"><b>BOUNDARY</b><span>This page is educational and operational guidance. It is not legal advice, certification, conformity assessment or regulatory approval.</span></div>
    </header>

    <section className="source">
      <div><small>CURRENT SOURCE ANCHOR</small><h2>{sourceLabel}</h2><p>{sourceNote}</p></div>
      <a href={sourceHref} target="_blank" rel="noreferrer">OPEN OFFICIAL EU SOURCE ↗</a>
    </section>

    <section className="section">
      <div className="sectionHead"><small>WHAT BUSINESSES NEED TO ESTABLISH</small><h2>Do not start with a generic checklist.</h2><p>Start with the actual system, role, use case and evidence boundary. The same regulation can produce different obligations for different actors and systems.</p></div>
      <div className="cards">{cards.map((card,i)=><article key={card.title}><span>{String(i+1).padStart(2,'0')}</span><h3>{card.title}</h3><p>{card.copy}</p></article>)}</div>
    </section>

    <section className="route">
      <div className="sectionHead"><small>THE TA-14 OPERATING ROUTE</small><h2>Turn the question into a governed record.</h2><p>The goal is not merely to reach an answer. It is to preserve what facts, evidence, scope and limitations supported that answer at that time.</p></div>
      <div className="steps">{steps.map((step,i)=><article key={step.title}><b>{String(i+1).padStart(2,'0')}</b><div><h3>{step.title}</h3><p>{step.copy}</p></div></article>)}</div>
    </section>

    <section className="cta">
      <small>START WITH ONE SYSTEM</small>
      <h2>Find out what may apply before you buy anything.</h2>
      <p>Use the free classifier to establish the system, intended purpose, possible actor role, EU exposure and unresolved facts. If you then need continuing evidence infrastructure or a human readiness review, those are separate next steps.</p>
      <div className="actions"><Link className="primary" href={classifierHref}>CHECK MY AI SYSTEM — FREE →</Link><Link className="secondary" href="/eu-ai-act/readiness-review">REQUEST A $750 READINESS REVIEW →</Link></div>
    </section>

    <section className="faq">
      <div className="sectionHead"><small>COMMON QUESTIONS</small><h2>Questions businesses are asking now.</h2></div>
      <div>{faqs.map(item=><article key={item.q}><h3>{item.q}</h3><p>{item.a}</p></article>)}</div>
    </section>

    <section className="end"><span>EU AI ACT WORLD · TA-14 AUTHORITY GOVERNANCE INSTITUTION</span><h2>Understand the requirement. Preserve the evidence. Revalidate when reality changes.</h2><div className="actions"><Link className="primary" href={classifierHref}>START FREE CLASSIFICATION →</Link><Link className="secondary" href="/eu-ai-act">OPEN EU AI ACT WORLD →</Link></div></section>

    <style>{`*{box-sizing:border-box}.seoPage{min-height:100vh;background:radial-gradient(circle at 50% 0,#0a3159,#030811 34%,#010205 100%);color:#eef7ff;font-family:Inter,system-ui,sans-serif;padding-bottom:90px}.seoPage nav{height:68px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #173b58;background:#02070de8;position:sticky;top:0;z-index:30;backdrop-filter:blur(18px)}.seoPage nav a{color:#82e8ff;text-decoration:none;font-size:9px;font-weight:950;letter-spacing:.08em}.seoPage nav span{color:#718ca0;font-size:8px;letter-spacing:.16em}.hero{max-width:1240px;margin:auto;padding:95px 24px 70px;text-align:center}.hero>small,.sectionHead small,.source small,.cta small{color:#72e2ff;font-size:9px;font-weight:950;letter-spacing:.2em}.hero h1{font:clamp(50px,7vw,96px)/.9 Georgia,serif;margin:18px 0}.hero h1 em{font-style:normal;color:#82e8ff}.hero>p{max-width:960px;margin:auto;color:#b7cad9;font-size:18px;line-height:1.8}.actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:28px}.primary,.secondary{padding:14px 17px;border-radius:10px;text-decoration:none;font-size:9px;font-weight:950;letter-spacing:.07em}.primary{background:#7fe8ff;color:#061018}.secondary{border:1px solid #315f7d;color:#c4eaf6;background:#07121d}.boundary{max-width:900px;margin:34px auto 0;padding:14px 16px;border:1px solid #6a572d;background:#120f08;color:#bdad8d;display:flex;gap:12px;text-align:left}.boundary b{color:#ffd778;font-size:8px}.boundary span{font-size:10px;line-height:1.6}.source{max-width:1260px;margin:0 auto 90px;padding:30px 34px;border:1px solid #244c67;background:#06131e;display:flex;justify-content:space-between;align-items:center;gap:28px}.source h2{font:34px Georgia,serif;margin:8px 0}.source p{max-width:850px;color:#93aabd;line-height:1.7}.source>a{white-space:nowrap;color:#061018;background:#79e4fb;text-decoration:none;padding:13px 15px;font-size:8px;font-weight:950}.section,.route,.faq{max-width:1450px;margin:0 auto 100px;padding:0 5vw}.sectionHead{max-width:900px;margin-bottom:32px}.sectionHead h2,.cta h2,.end h2{font:clamp(34px,4vw,58px)/1 Georgia,serif;margin:10px 0}.sectionHead p,.cta p,.end p{color:#97adbe;line-height:1.75}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.cards article{min-height:240px;padding:24px;border:1px solid #1e435e;background:#06121c}.cards span{font:28px Georgia,serif;color:#65daf7}.cards h3{font-size:14px}.cards p,.steps p,.faq p{font-size:12px;line-height:1.7;color:#9db2c1}.steps{display:grid;gap:8px}.steps article{display:grid;grid-template-columns:55px 1fr;gap:18px;padding:20px;border:1px solid #1d4059;background:#06121d}.steps b{font:28px Georgia,serif;color:#65dcf7}.steps h3{margin:0 0 5px;font-size:15px}.steps p{margin:0}.cta{max-width:1250px;margin:0 auto 100px;padding:46px;border:1px solid #b58c40;background:radial-gradient(circle at 50% 0,#d7ad4e1a,transparent 45%),#0b0d0e;text-align:center}.cta p{max-width:900px;margin:auto}.faq>div:last-child{display:grid;grid-template-columns:1fr 1fr;gap:10px}.faq article{padding:24px;border:1px solid #1d4059;background:#05101a}.faq h3{font:20px Georgia,serif;margin:0 0 8px}.end{max-width:1150px;margin:auto;padding:45px;text-align:center;border-top:1px solid #1c4057}.end>span{font-size:8px;color:#71dff9;letter-spacing:.18em;font-weight:900}@media(max-width:960px){.cards{grid-template-columns:repeat(2,1fr)}.source{margin-left:5vw;margin-right:5vw;display:block}.source>a{display:inline-block;margin-top:10px}.faq>div:last-child{grid-template-columns:1fr}}@media(max-width:620px){.seoPage nav span{display:none}.cards{grid-template-columns:1fr}.cta{margin-left:5vw;margin-right:5vw;padding:30px 22px}.source h2{font-size:28px}}`}</style>
  </main>
}