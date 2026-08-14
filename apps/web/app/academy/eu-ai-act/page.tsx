import Link from 'next/link';

const stages=[
 ['01','UNDERSTAND','Learn the Act, actor roles, risk structure, applicability, legal sources and what a governed determination means.','overview'],
 ['02','IDENTIFY','Establish the AI system, intended purpose, deployment context, jurisdiction, actors and governed System Passport.','system-passport'],
 ['03','CLASSIFY','Work through actor role, prohibited-practice, high-risk, GPAI and Article 50 indicators without hiding unresolved facts.','classifier'],
 ['04','MAP','Translate applicable provisions into obligation propositions, owners, evidence expectations, limitations and review routes.','requirements-explorer'],
 ['05','PROVE','Preserve evidence, technical records, logs, transparency implementation, review artifacts and evidence gaps.','evidence-passport'],
 ['06','DETERMINE','Understand supported, conditional, unresolved, review-required and other bounded determination states.','command-center'],
 ['07','MAINTAIN','Govern versions, source-law changes, evidence aging, system changes and revalidation pressure over time.','revalidation'],
 ['08','EXAMINE','Prepare bounded examiner packages for counsel, auditors, customers, assurance teams and regulators.','controlled-examination'],
];

const lessons=[
 ['Start Here','start-here','Know the minimum facts and evidence to gather before entering the operating environment.','/eu-ai-act/start'],
 ['Command Center','command-center','Learn how to read system state, obligations, gaps, changes and revalidation pressure.','/eu-ai-act/command-center'],
 ['System Passport','system-passport','Create the governed identity that every later classification and evidence object refers to.','/eu-ai-act/system-passport'],
 ['Classifier','classifier','Understand every classification step, required input, uncertainty state and resulting determination.','/eu-ai-act/classifier'],
 ['Article 50','article-50','Learn provider and deployer transparency routes, required evidence, exceptions and implementation records.','/eu-ai-act#article-50-workspace'],
 ['Requirements Explorer','requirements-explorer','Learn how provisions become bounded obligation propositions rather than checkboxes.','/eu-ai-act#requirements-explorer'],
 ['Prohibited Practices','prohibited-practices','Understand Article 5 screening, evidence needs, exceptions and escalation boundaries.','/eu-ai-act#requirements-explorer'],
 ['High-Risk AI','high-risk-ai','Understand high-risk pathways, lifecycle duties, evidence and temporal applicability.','/eu-ai-act#requirements-explorer'],
 ['GPAI','gpai','Understand model-provider pathways, downstream support, documentation and systemic-risk distinctions.','/eu-ai-act#requirements-roadmap'],
 ['FRIA','fria','Learn how to structure affected-person context, risks, safeguards, review and retained limitations.','/eu-ai-act#requirements-explorer'],
 ['Human Oversight','human-oversight','Learn accountable authority, intervention capability, competence, escalation and override boundaries.','/eu-ai-act#requirements-roadmap'],
 ['Technical Documentation','technical-documentation','Learn what system identity, architecture, data, testing, limitations and version evidence must show.','/eu-ai-act#requirements-roadmap'],
 ['Evidence Passport','evidence-passport','Learn how evidence objects support propositions and how gaps and stale evidence remain visible.','/eu-ai-act/passport'],
 ['Proof Lab','proof-lab','Learn how to challenge evidence correspondence and preserve review results without rewriting history.','/eu-ai-act/proof-lab'],
 ['Change & Revalidation','revalidation','Learn when prior reliance must be reassessed after system, evidence or legal-source change.','/eu-ai-act/command-center'],
 ['Controlled Examination','controlled-examination','Learn how to expose a bounded review package without exposing the entire organization.','/eu-ai-act/command-center'],
];

export default function EUAIActAcademy(){return <main style={{minHeight:'100vh',padding:'clamp(28px,5vw,70px)',background:'radial-gradient(circle at 18% 0,rgba(64,210,255,.13),transparent 28%),radial-gradient(circle at 90% 12%,rgba(242,196,86,.08),transparent 24%),#030911',color:'#eef8ff',fontFamily:'Inter,system-ui,sans-serif'}}>
 <div style={{maxWidth:1320,margin:'0 auto'}}>
  <Link href="/academy" style={{color:'#7ee6ff',textDecoration:'none',fontSize:12,fontWeight:850}}>← TA-14 Academy</Link>
  <header style={{padding:'56px 0 34px',maxWidth:980}}><span style={{color:'#f2c456',fontSize:11,fontWeight:950,letterSpacing:'.18em'}}>TA-14 ACADEMY · EU AI ACT</span><h1 style={{fontSize:'clamp(42px,7vw,86px)',lineHeight:.95,letterSpacing:'-.055em',margin:'14px 0 20px'}}>Learn the law. Learn the system. <span style={{color:'#7ee6ff'}}>Do the work.</span></h1><p style={{maxWidth:850,color:'#a9bfce',fontSize:'clamp(16px,2vw,20px)',lineHeight:1.7}}>This Academy mirrors the EU AI Act operating environment. Every lesson explains what a page means, why you would use it, what you need before starting, exactly how to complete the task, what the result means, what it does not mean, and where to go next.</p><div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:26}}><Link href="/academy/eu-ai-act/start-here" style={primary}>START HERE →</Link><Link href="/eu-ai-act" style={secondary}>OPEN OPERATING ENVIRONMENT →</Link></div></header>
  <section style={rule}><span style={eyebrow}>THE LEARNING ROUTE</span><h2 style={h2}>Eight stages from understanding to examination.</h2><div style={grid}>{stages.map(([n,title,copy,slug])=><Link key={n} href={`/academy/eu-ai-act/${slug}`} style={card}><span style={{color:'#7ee6ff',fontSize:11,fontWeight:950}}>{n}</span><h3 style={{fontSize:18,margin:'10px 0 8px'}}>{title}</h3><p style={copyStyle}>{copy}</p><b style={linkStyle}>LEARN THIS STAGE →</b></Link>)}</div></section>
  <section style={rule}><span style={eyebrow}>PAGE-BY-PAGE GUIDE</span><h2 style={h2}>Every operating page gets a matching Academy route.</h2><p style={{...copyStyle,maxWidth:800,marginBottom:24}}>Use the Academy when you need instruction. Use the operating page when you are ready to perform the task. Every guide sends you directly back to the tool it teaches.</p><div style={grid}>{lessons.map(([title,slug,copy,tool])=><article key={slug} style={card}><h3 style={{fontSize:17,margin:'0 0 8px'}}>{title}</h3><p style={copyStyle}>{copy}</p><div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:16}}><Link href={`/academy/eu-ai-act/${slug}`} style={smallPrimary}>LEARN THIS</Link><Link href={tool} style={smallSecondary}>USE THIS TOOL</Link></div></article>)}</div></section>
  <section style={{...rule,border:'1px solid rgba(242,196,86,.22)',borderRadius:22,padding:'28px',background:'linear-gradient(145deg,rgba(242,196,86,.07),rgba(126,230,255,.035))'}}><span style={eyebrow}>ACADEMY STANDARD</span><h2 style={{...h2,marginBottom:10}}>No operating page without instruction. No instruction without a route back to operation.</h2><p style={copyStyle}>New EU AI Act capabilities are not complete until their Academy explanation exists. Each guide must explain the goal, prerequisites, source basis, step-by-step workflow, evidence expectations, determination states, limitations, common mistakes, revalidation triggers and next action.</p></section>
 </div>
 </main>}

const primary={display:'inline-flex',padding:'13px 17px',borderRadius:11,background:'#7ee6ff',color:'#04101b',textDecoration:'none',fontSize:11,fontWeight:950} as const;
const secondary={...primary,background:'transparent',color:'#7ee6ff',border:'1px solid rgba(126,230,255,.4)'} as const;
const smallPrimary={...primary,padding:'9px 11px',fontSize:9} as const;
const smallSecondary={...secondary,padding:'9px 11px',fontSize:9} as const;
const rule={padding:'42px 0',borderTop:'1px solid rgba(126,230,255,.12)'} as const;
const eyebrow={color:'#f2c456',fontSize:10,fontWeight:950,letterSpacing:'.16em'} as const;
const h2={fontSize:'clamp(28px,4vw,46px)',letterSpacing:'-.035em',margin:'10px 0 24px'} as const;
const grid={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12} as const;
const card={display:'block',padding:'20px',border:'1px solid rgba(126,230,255,.14)',borderRadius:16,background:'rgba(255,255,255,.025)',color:'#eef8ff',textDecoration:'none'} as const;
const copyStyle={color:'#94adbe',fontSize:13,lineHeight:1.65,margin:0} as const;
const linkStyle={display:'block',marginTop:16,color:'#7ee6ff',fontSize:9,letterSpacing:'.08em'} as const;
