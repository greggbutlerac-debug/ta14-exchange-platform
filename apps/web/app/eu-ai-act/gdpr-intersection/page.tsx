"use client";

import Link from "next/link";
import {useMemo,useState} from "react";

type State="SUPPORTED"|"INCOMPLETE"|"REVIEW REQUIRED";

const changeTriggers=[
  "Purpose changes","Personal-data scope changes","Controller / processor role changes",
  "AI-system role or classification changes","Deployment context changes",
  "Authority or oversight changes","Evidence becomes stale, contradicted or incomplete",
];

export default function GdprEuAiActIntersectionPage(){
  const [personalData,setPersonalData]=useState<"yes"|"no"|"unknown">("unknown");
  const [lawfulBasis,setLawfulBasis]=useState<"yes"|"no"|"unknown">("unknown");
  const [gdprEvidence,setGdprEvidence]=useState<"yes"|"no"|"unknown">("unknown");
  const [aiInScope,setAiInScope]=useState<"yes"|"no"|"unknown">("unknown");
  const [aiClassified,setAiClassified]=useState<"yes"|"no"|"unknown">("unknown");
  const [aiEvidence,setAiEvidence]=useState<"yes"|"no"|"unknown">("unknown");
  const [materialChange,setMaterialChange]=useState<"yes"|"no"|"unknown">("unknown");

  const result=useMemo(()=>{
    const changed=materialChange!=="no";
    const gdpr:State=personalData==="no"?"REVIEW REQUIRED":
      personalData==="yes"&&lawfulBasis==="yes"&&gdprEvidence==="yes"&&!changed?"SUPPORTED":"INCOMPLETE";
    const ai:State=aiInScope==="yes"&&aiClassified==="yes"&&aiEvidence==="yes"&&!changed?"SUPPORTED":"INCOMPLETE";
    return {gdpr,ai,changed};
  },[personalData,lawfulBasis,gdprEvidence,aiInScope,aiClassified,aiEvidence,materialChange]);

  const select=(label:string,value:string,setter:(v:any)=>void)=><label style={{display:"grid",gap:8}}><span style={{fontWeight:700}}>{label}</span><select value={value} onChange={e=>setter(e.target.value)} style={{padding:12,borderRadius:10,background:"#081522",color:"#edf4ff",border:"1px solid #36506f"}}><option value="unknown">Unknown / not established</option><option value="yes">Yes</option><option value="no">No</option></select></label>;

  const stateCard=(title:string,state:State,copy:string)=><article style={{border:"1px solid #29405f",borderRadius:16,padding:20,background:"#0c192b"}}><div style={{fontSize:12,letterSpacing:1.5,color:"#a8c8ff",fontWeight:800}}>{title}</div><h3 style={{fontSize:28,margin:"10px 0"}}>{state}</h3><p style={{lineHeight:1.55,color:"#c9d7ea"}}>{copy}</p></article>;

  return <main style={{minHeight:"100vh",background:"#07111f",color:"#edf4ff",padding:"48px 24px",fontFamily:"system-ui, sans-serif"}}><div style={{maxWidth:1120,margin:"0 auto"}}>
    <nav style={{fontSize:14,opacity:.8,marginBottom:32}}><Link href="/">TA-14 AI Governance Exchange</Link> <span>›</span> <Link href="/eu-ai-act">EU AI Act</Link> <span>›</span> GDPR Intersection</nav>

    <header style={{padding:"28px 0 36px"}}><div style={{letterSpacing:2,fontSize:12,fontWeight:800,color:"#a8c8ff"}}>GDPR × EU AI ACT GOVERNED INTERSECTION</div><h1 style={{fontSize:"clamp(40px,7vw,76px)",lineHeight:1.02,maxWidth:980,margin:"16px 0"}}>Two legal boundaries. One system. No collapsed compliance claim.</h1><p style={{fontSize:20,lineHeight:1.6,maxWidth:900,color:"#c9d7ea"}}>GDPR personal-data governance and EU AI Act AI-risk governance are assessed independently. Shared evidence may support both, but one favorable state cannot manufacture the other.</p></header>

    <section style={{border:"1px solid #8b6b2e",background:"#201b10",padding:20,borderRadius:16,marginBottom:28}}><strong>Governance boundary</strong><p style={{marginBottom:0,lineHeight:1.6}}>TA-14 structures evidence, gaps, changed conditions and bounded determinations. It does not provide legal advice, certify statutory compliance, or convert evidence of a control into authority to execute.</p></section>

    <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:20,margin:"32px 0"}}>
      <article style={{border:"1px solid #29405f",borderRadius:18,padding:24,background:"#0c192b"}}><div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,color:"#a8c8ff"}}>BOUNDARY A · GDPR</div><h2>Personal-data governance</h2><div style={{display:"grid",gap:16}}>{select("Is personal data in scope?",personalData,setPersonalData)}{select("Is a lawful basis established?",lawfulBasis,setLawfulBasis)}{select("Are purpose, role, minimisation, retention, rights and sharing evidence established?",gdprEvidence,setGdprEvidence)}</div></article>
      <article style={{border:"1px solid #29405f",borderRadius:18,padding:24,background:"#0c192b"}}><div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,color:"#a8c8ff"}}>BOUNDARY B · EU AI ACT</div><h2>AI-risk governance</h2><div style={{display:"grid",gap:16}}>{select("Is the AI system/use case in scope?",aiInScope,setAiInScope)}{select("Are actor role and risk classification established?",aiClassified,setAiClassified)}{select("Are applicable obligations and supporting evidence established?",aiEvidence,setAiEvidence)}</div></article>
    </section>

    <section style={{border:"1px solid #29405f",borderRadius:18,padding:24,background:"#0c192b",margin:"24px 0"}}><div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,color:"#a8c8ff"}}>CHANGE / REVALIDATION GATE</div><h2>Prior support does not travel silently.</h2><div style={{maxWidth:560}}>{select("Has any material condition changed since the evidence/determination was established?",materialChange,setMaterialChange)}</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10,marginTop:18}}>{changeTriggers.map(t=><div key={t} style={{border:"1px solid #29405f",borderRadius:10,padding:12}}>{t}</div>)}</div></section>

    <section style={{padding:"24px 0"}}><div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,color:"#a8c8ff"}}>BOUNDED OUTPUT</div><h2 style={{fontSize:34}}>Independent determinations</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16}}>{stateCard("GDPR EVIDENCE STATE",result.gdpr,result.gdpr==="SUPPORTED"?"The supplied inputs support this bounded GDPR evidence state. This is not legal certification.":"The supplied inputs do not support a favorable GDPR evidence state. Missing, unresolved, or changed conditions remain explicit.")}{stateCard("EU AI ACT EVIDENCE STATE",result.ai,result.ai==="SUPPORTED"?"The supplied inputs support this bounded EU AI Act evidence state. This is not legal certification.":"The supplied inputs do not support a favorable EU AI Act evidence state. Missing, unresolved, or changed conditions remain explicit.")}</div>{result.changed&&<div style={{marginTop:16,border:"1px solid #7a3340",background:"#211218",padding:18,borderRadius:14}}><strong>REVALIDATION REQUIRED.</strong> A favorable prior state cannot be relied upon while a material change is present or unresolved.</div>}</section>

    <section style={{padding:"26px 0"}}><div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,color:"#a8c8ff"}}>INTERSECTION CHAIN</div><h2 style={{fontSize:34}}>Data → Evidence → AI Risk → Authority → Execution</h2><p style={{fontSize:18,lineHeight:1.7,maxWidth:900,color:"#c9d7ea"}}>Lawful data processing does not itself authorize an AI consequence. AI-risk controls do not retroactively establish a lawful basis for personal-data processing. Each proposition keeps its own source, evidence, standing, change state and unresolved conditions.</p></section>

    <div style={{display:"flex",gap:12,flexWrap:"wrap",paddingBottom:40}}><Link href="/eu-ai-act" style={{padding:"14px 18px",border:"1px solid #44658d",borderRadius:10}}>Return to EU AI Act World</Link><Link href="/eu-ai-act/classifier" style={{padding:"14px 18px",border:"1px solid #44658d",borderRadius:10}}>Classify AI System</Link><Link href="/eu-ai-act/command-center" style={{padding:"14px 18px",border:"1px solid #44658d",borderRadius:10}}>Open Command Center</Link></div>
  </div></main>;
}
