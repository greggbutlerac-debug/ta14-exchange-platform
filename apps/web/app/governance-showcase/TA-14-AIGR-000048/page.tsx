"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Lang = "en" | "tn";
type Scenario = "baseline" | "missingAuthority" | "tamperedEvidence" | "externalExecution" | "failedTests";

const COPY = {
  en: {
    badge: "REGISTERED GOVERNANCE · PUBLIC INTERACTIVE SHOWROOM",
    title: "Structured Workflow Intelligence",
    subtitle: "Govern the path — not just the output.",
    lede: "SWI is a registered evidence-governance architecture for examining how a candidate AI or automated workflow moves from an input toward a consequence-bearing action. This showroom teaches the registered claims without turning registration into certification.",
    listen: "LISTEN TO THE GUIDED WALKTHROUGH",
    play: "▶ PLAY", stop: "■ STOP", language: "LANGUAGE",
    flowTitle: "Walk the workflow. Then break it.",
    flowSub: "Select a condition and watch the declared governance path respond. The model teaches SWI's registered position; it is not a TA-14 runtime certification.",
    scenario: "PRESSURE TEST",
    steps: ["INPUT","STRUCTURE","ANALYZE","EVIDENCE","DECIDE","EXECUTE"],
    baseline: ["Candidate request enters the workflow.","Workflow conditions and boundaries are structured.","Risk, impacts and alternatives can be examined.","Decision evidence is recorded and preserved.","Defined admission conditions produce a bounded decision.","External execution remains a separate enforcement dependency."],
    missingAuthority: ["Candidate request enters the workflow.","Workflow is structured, but authority is unresolved.","Analysis cannot manufacture authority.","Evidence records the unresolved authority condition.","Admission condition is not satisfied: deny or halt.","No execution authority is created by the SWI decision."],
    tamperedEvidence: ["Candidate request enters the workflow.","Workflow is structured.","Analysis reaches an evidence-dependent gate.","Tampered or bad-integrity evidence is rejected in the submitted reproduction.","The decision cannot rely on rejected evidence.","Execution should not inherit an unsupported decision."],
    externalExecution: ["Candidate request enters the workflow.","Workflow conditions are structured.","Analysis and evidence may support a decision.","SWI can preserve the governance decision.","A recorded decision is not proof that an external system enforced it.","External execution remains a separate dependency."],
    failedTests: ["Candidate request enters the workflow.","The workflow must preserve the state actually observed.","A failed test is evidence, not something to hide.","The current-main reproduction preserves 55 passes and 2 failures, including a node-registry failure.","A bounded decision must carry those limitations forward.","A failed test cannot be converted into execution assurance."],
    resultBaseline: "BOUNDED PATH · DECISION EVIDENCE PRESERVED · EXTERNAL ENFORCEMENT STILL SEPARATE",
    resultMissing: "DENY / HALT · AUTHORITY IS A GOVERNANCE CONDITION, NOT AN INFERENCE",
    resultTampered: "REJECT EVIDENCE · BAD INTEGRITY CANNOT BECOME DECISION PROOF",
    resultExternal: "BOUNDARY PRESERVED · GOVERNANCE DECISION ≠ EXTERNAL EXECUTION PROOF",
    resultFailed: "PRESERVE FAILURE · 55 PASSED + 2 FAILED IS STRONGER GOVERNANCE THAN A PERFECT-LOOKING RECORD",
    regTitle: "What registration established — and what it did not.",
    registered: "TA-14-AIGR-000048 is a public registered governance record. The Registry accepted the record as sufficiently attributable, bounded and preserved.",
    notCert: "Registration is not certification. TA-14 did not certify SWI's performance, legality, safety, production readiness, or fitness for execution.",
    evidenceTitle: "Evidence that keeps the imperfections.",
    evidenceBody: "The preserved SWI evidence records successful reproduced test runs, tampered-evidence rejection, bad-integrity rejection, and also preserves two failed tests in the current-main reproduction. The submission identifies the reproduction as participant-commissioned and AI-assisted, not an independent examination.",
    status: "SWI remains SEALED and NOT PRODUCTION READY.",
    owner: "Founder / steward", org: "Organization", version: "Registered version",
    walkthrough: "This is Structured Workflow Intelligence, registered as TA-14-AIGR-000048. Start at input. A request enters a governed workflow. Structure separates the request from the conditions that must be satisfied. Analysis can inspect risk, impacts and alternatives, but computation does not create authority. Evidence records what supports the decision and preserves what failed. Decide is a bounded governance outcome, including a deny or halt path when admission conditions are not satisfied. Execute is deliberately separated: a recorded governance decision does not prove that an external system enforced it. That boundary matters. SWI is registered, but registration is not certification, and the preserved record states that SWI remains sealed and not production ready."
  },
  tn: {
    badge: "PUSO E E KWADISITSWENG · PHAPOSI YA SETŠHABA E E DIRISANANG",
    title: "Structured Workflow Intelligence",
    subtitle: "Laola tsela — e seng fela sephetho.",
    lede: "SWI ke thulaganyo ya puso ya bosupi e e kwadisitsweng, e e sekasekang kafa tiro ya AI kgotsa ya othomathiki e tsamayang ka teng go tswa mo kopong go ya kwa kgatong e e ka nnang le ditlamorago. Phaposi eno e ruta ditlhaloso tse di kwadisitsweng ntle le go fetola kwadiso go nna setifikeiti.",
    listen: "REETSA TLHALOSO E E KAELANG",
    play: "▶ TSHAMEKA", stop: "■ EMISA", language: "PUO",
    flowTitle: "Latela tiro. Jaanong e leke ka maemo a a thata.",
    flowSub: "Tlhopha boemo mme o bone kafa tsela ya puso e e tlhalositsweng e arabelang ka teng. Seno se ruta boemo jo bo kwadisitsweng jwa SWI; ga se setifikeiti sa tiragatso sa TA-14.",
    scenario: "TEKO YA KGATELELO",
    steps: ["KOP0","THULAGANYO","SEKASEKA","BOSUPI","TSHWAETSO","TIRAGATSO"],
    baseline: ["Kopo e tsena mo tirong.","Maemo le melelwane ya tiro di a rulaganngwa.","Dikotsi, ditlamorago le ditsela tse dingwe di ka sekasekwa.","Bosupi jwa tshwetso bo a kwalwa le go bolokwa.","Maemo a a beilweng a tlhagisa tshwetso e e lekanyeditsweng.","Tiragatso ya kwa ntle e sala e le boikarabelo jo bo aroganeng."],
    missingAuthority: ["Kopo e tsena mo tirong.","Tiro e rulaganngwa, mme taolo ga e ise e tlhomamisiwe.","Tshekatsheko ga e kgone go itirela taolo.","Bosupi bo kwala gore taolo ga e ise e rarabololwe.","Maemo a ga a a kgotsofadiwa: gana kgotsa emisa.","Tshwetso ya SWI ga e itirele tetla ya tiragatso."],
    tamperedEvidence: ["Kopo e tsena mo tirong.","Tiro e a rulaganngwa.","Tshekatsheko e fitlha mo kgorong e e ikaegileng ka bosupi.","Bosupi jo bo fetotsweng kgotsa jo bo sa ikanyegeng bo a ganwa.","Tshwetso ga e a tshwanela go ikaega ka bosupi jo bo gannweng.","Tiragatso ga e a tshwanela go ikaega ka tshwetso e e sa tshegediwang."],
    externalExecution: ["Kopo e tsena mo tirong.","Maemo a tiro a a rulaganngwa.","Tshekatsheko le bosupi di ka tshegetsa tshwetso.","SWI e ka boloka tshwetso ya puso.","Tshwetso e e kwadilweng ga se bosupi jwa gore tsamaiso ya kwa ntle e e diragaditse.","Tiragatso ya kwa ntle e sala e le boikarabelo jo bo aroganeng."],
    failedTests: ["Kopo e tsena mo tirong.","Tiro e tshwanetse go boloka maemo a a bonweng.","Teko e e paletsweng ke bosupi, ga e a tshwanela go fitlhwa.","Reproduction ya current-main e boloka diteko tse 55 tse di atlegileng le tse 2 tse di paletsweng.","Tshwetso e tshwanetse go tsweletsa melelwane eo.","Teko e e paletsweng ga e kgone go fetolwa go nna netefatso ya tiragatso."],
    resultBaseline: "TSELA E E LEKANYEDITSWENG · BOSUPI JWA TSHWETSO BO BOLOKILWE · TIRAGATSO YA KWA NTLE E AROGANE",
    resultMissing: "GANA / EMISA · TAOLO KE MAEMO A PUSO, GA SE KAKANYO",
    resultTampered: "GANA BOSUPI · BOSUPI JO BO SA IKANYEGENG GA BO KGONE GO NNA BOPAKI JWA TSHWETSO",
    resultExternal: "MOLELWANE O BOLOKILWE · TSHWETSO YA PUSO ≠ BOSUPI JWA TIRAGATSO YA KWA NTLE",
    resultFailed: "BOLOKA GO PALELWA · REKOTO E E BONALANG E LE NNETE E BOTLHOKWA GO FETA E E BONALANG E ITEKANETSE",
    regTitle: "Se kwadiso e se tlhomamisitseng — le se e sa se tlhomamisang.",
    registered: "TA-14-AIGR-000048 ke rekoto ya puso ya setšhaba e e kwadisitsweng. Registry e amogetse rekoto jaaka e e nang le mong yo o bonalang, melelwane e e tlhalositsweng le bosupi jo bo bolokilweng.",
    notCert: "Kwadiso ga se setifikeiti. TA-14 ga e a netefatsa tiragatso, semolao, pabalesego, go siamela tlhagiso kgotsa go siamela tiragatso ga SWI.",
    evidenceTitle: "Bosupi jo bo bolokang le diphoso.",
    evidenceBody: "Bosupi jo bo bolokilweng jwa SWI bo kwala diteko tse di atlegileng, go ganwa ga bosupi jo bo fetotsweng le jo bo sa ikanyegeng, mme gape bo boloka diteko tse pedi tse di paletsweng. Teko e tlhalositswe jaaka e e kopilweng ke motsayakarolo le go thusiwa ke AI, e seng tlhatlhobo e e ikemetseng.",
    status: "SWI e santse e le SEALED mme GA E ISE E SIAMELE TLHAGISO.",
    owner: "Mothei / motlhokomedi", org: "Mokgatlho", version: "Mofuta o o kwadisitsweng",
    walkthrough: "Eno ke Structured Workflow Intelligence, e e kwadisitsweng jaaka TA-14-AIGR-000048. Simolola ka kopo. Kopo e tsena mo tirong e e laolwang. Thulaganyo e kgaoganya kopo le maemo a a tshwanetseng go kgotsofadiwa. Tshekatsheko e ka leba dikotsi le ditsela tse dingwe, mme khomputara ga e itirele taolo. Bosupi bo kwala se se tshegetsang tshwetso mme bo boloka le se se paletsweng. Tshwetso ke sephetho sa puso se se lekanyeditsweng, go akaretsa go gana kgotsa go emisa fa maemo a sa kgotsofadiwa. Tiragatso e a kgaoganngwa: tshwetso ya puso e e kwadilweng ga se bosupi jwa gore tsamaiso ya kwa ntle e e diragaditse. Molelwane oo o botlhokwa. SWI e kwadisitswe, mme kwadiso ga se setifikeiti, mme rekoto e bolela gore SWI e santse e le sealed mme ga e ise e siamele tlhagiso."
  }
} as const;

const SCENARIOS: {id:Scenario; en:string; tn:string}[] = [
  {id:"baseline",en:"BASELINE",tn:"MAEMO A MOTHEO"},
  {id:"missingAuthority",en:"MISSING AUTHORITY",tn:"TAOLO E TLHAELA"},
  {id:"tamperedEvidence",en:"TAMPERED EVIDENCE",tn:"BOSUPI JO BO FETOTSWENG"},
  {id:"externalExecution",en:"EXTERNAL EXECUTION",tn:"TIRAGATSO YA KWA NTLE"},
  {id:"failedTests",en:"FAILED TESTS",tn:"DITEKO TSE DI PALETSWENG"},
];

export default function SwiShowroom(){
  const [lang,setLang]=useState<Lang>("en");
  const [scenario,setScenario]=useState<Scenario>("baseline");
  const [speaking,setSpeaking]=useState(false);
  const c=COPY[lang];
  const details=useMemo(()=>c[scenario],[c,scenario]);
  const result=scenario==="baseline"?c.resultBaseline:scenario==="missingAuthority"?c.resultMissing:scenario==="tamperedEvidence"?c.resultTampered:scenario==="externalExecution"?c.resultExternal:c.resultFailed;

  useEffect(()=>()=>{if(typeof window!=="undefined"&&"speechSynthesis" in window) window.speechSynthesis.cancel()},[]);
  const speak=()=>{ if(!("speechSynthesis" in window))return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(c.walkthrough); u.lang=lang==="tn"?"tn-BW":"en-US"; const voices=speechSynthesis.getVoices(); const preferred=voices.find(v=>v.lang.toLowerCase().startsWith(lang==="tn"?"tn":"en")); if(preferred)u.voice=preferred; u.rate=.86; u.onend=()=>setSpeaking(false); u.onerror=()=>setSpeaking(false); setSpeaking(true); speechSynthesis.speak(u); };
  const stop=()=>{speechSynthesis.cancel();setSpeaking(false)};

  return <main style={{minHeight:"100vh",background:"radial-gradient(circle at 70% 0,#0d3760 0,#061523 35%,#02070d 75%)",color:"#eef7ff",fontFamily:"Arial,Helvetica,sans-serif"}}>
    <div style={{maxWidth:1240,margin:"0 auto",padding:"28px 22px 80px"}}>
      <nav style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap",fontSize:12,fontWeight:900,letterSpacing:".08em"}}>
        <Link href="/" style={{color:"#8ed8ff",textDecoration:"none"}}>TA-14 EXCHANGE</Link>
        <span style={{display:"flex",gap:14}}><Link href="/governance-showcase" style={{color:"#c8d8e6"}}>SHOWROOMS</Link><Link href="/workspace/ai-governance/registry" style={{color:"#c8d8e6"}}>REGISTRY →</Link></span>
      </nav>

      <header style={{padding:"70px 0 42px",textAlign:"center"}}>
        <div style={{color:"#f2c45f",fontSize:11,fontWeight:950,letterSpacing:".18em"}}>{c.badge}</div>
        <h1 style={{fontSize:"clamp(44px,8vw,92px)",lineHeight:.92,letterSpacing:"-.055em",margin:"18px auto 16px",maxWidth:1050}}>SWI</h1>
        <div style={{fontSize:"clamp(22px,3vw,38px)",fontWeight:900}}>{c.title}</div>
        <p style={{fontSize:"clamp(18px,2vw,26px)",color:"#8ed8ff",fontWeight:800,margin:"12px 0"}}>{c.subtitle}</p>
        <p style={{maxWidth:850,margin:"20px auto",lineHeight:1.75,color:"#b9cad7"}}>{c.lede}</p>
        <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap",marginTop:22}}>
          <span style={{padding:"10px 13px",border:"1px solid #f2c45f66",borderRadius:999,color:"#f2c45f",fontWeight:900}}>TA-14-AIGR-000048</span>
          <span style={{padding:"10px 13px",border:"1px solid #8ed8ff55",borderRadius:999,color:"#8ed8ff",fontWeight:900}}>VERSION 5.12</span>
          <span style={{padding:"10px 13px",border:"1px solid #8ed8ff55",borderRadius:999,color:"#8ed8ff",fontWeight:900}}>TRUSTS MOTION</span>
        </div>
      </header>

      <section style={{border:"1px solid #315b79",borderRadius:22,background:"#06111dcc",padding:"clamp(18px,3vw,34px)",boxShadow:"0 24px 80px #0008"}}>
        <img src="/Structured AI Governance Workflow.png" alt="Structured Workflow Intelligence governance workflow teaching visual" style={{width:"100%",display:"block",borderRadius:15,border:"1px solid #5fa7d955"}}/>
        <div style={{marginTop:18,padding:18,border:"1px solid #315b79",borderRadius:14,background:"#020a11"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:14,alignItems:"center",flexWrap:"wrap"}}>
            <b style={{fontSize:11,letterSpacing:".13em",color:"#8ed8ff"}}>{c.listen}</b>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
              <label style={{fontSize:10,fontWeight:900,color:"#91a9bb"}}>{c.language} <select value={lang} onChange={e=>{stop();setLang(e.target.value as Lang)}} style={{marginLeft:6,padding:"9px 10px",borderRadius:8,background:"#081a29",color:"#fff",border:"1px solid #315b79"}}><option value="en">English</option><option value="tn">Setswana</option></select></label>
              <button onClick={speaking?stop:speak} style={{cursor:"pointer",padding:"10px 14px",borderRadius:8,border:"1px solid #8ed8ff",background:speaking?"transparent":"#8ed8ff",color:speaking?"#8ed8ff":"#03101a",fontWeight:950}}>{speaking?c.stop:c.play}</button>
            </div>
          </div>
          <p style={{lineHeight:1.7,color:"#b8cbd9",marginBottom:0}}>{c.walkthrough}</p>
        </div>
      </section>

      <section style={{padding:"76px 0 20px"}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:".16em",color:"#f2c45f"}}>{c.scenario}</div>
        <h2 style={{fontSize:"clamp(34px,5vw,58px)",letterSpacing:"-.04em",margin:"10px 0"}}>{c.flowTitle}</h2>
        <p style={{maxWidth:800,color:"#a9bdcc",lineHeight:1.7}}>{c.flowSub}</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"24px 0"}}>
          {SCENARIOS.map(s=><button key={s.id} onClick={()=>setScenario(s.id)} style={{cursor:"pointer",padding:"11px 13px",borderRadius:9,border:"1px solid "+(scenario===s.id?"#f2c45f":"#315b79"),background:scenario===s.id?"#f2c45f18":"#061522",color:scenario===s.id?"#f2c45f":"#b9cad7",fontWeight:950,fontSize:11}}>{s[lang]}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10}}>
          {c.steps.map((step,i)=><article key={step} style={{position:"relative",padding:18,border:"1px solid #315b79",borderRadius:14,background:"linear-gradient(180deg,#0a2135,#05111c)",minHeight:180}}>
            <small style={{color:"#6dbce8",fontWeight:950}}>0{i+1}</small><h3 style={{fontSize:18,margin:"9px 0",color:"#fff"}}>{step}</h3><p style={{fontSize:13,lineHeight:1.6,color:"#aec0ce"}}>{details[i]}</p>
          </article>)}
        </div>
        <div style={{marginTop:12,padding:18,border:"1px solid #f2c45f77",borderRadius:12,background:"#f2c45f0d",color:"#f2c45f",fontWeight:950,fontSize:12,letterSpacing:".05em"}}>{result}</div>
      </section>

      <section style={{padding:"72px 0 8px"}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:".16em",color:"#8ed8ff"}}>WHY SWI MATTERS</div>
        <h2 style={{fontSize:"clamp(34px,5vw,58px)",letterSpacing:"-.04em",margin:"10px 0 18px"}}>A workflow can look intelligent and still lose the reason it was allowed to continue.</h2>
        <p style={{maxWidth:920,color:"#b8cbd9",lineHeight:1.8,fontSize:16}}>SWI's useful governance contribution is not another AI answer. It is the attempt to make the path inspectable: what entered, how the workflow was structured, what analysis occurred, what evidence survived, what decision was recorded, and where responsibility passes to an external execution system. That makes the workflow pressure-testable instead of merely impressive.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginTop:26}}>
          {[
            ["01 · STRUCTURE BEFORE CONSEQUENCE","A candidate request is not yet a governed consequence. Conditions, boundaries and admission logic must become explicit before a decision can carry weight."],
            ["02 · EVIDENCE MUST SURVIVE","A result is stronger when the record preserves supporting evidence, rejected evidence and failures instead of presenting only the successful path."],
            ["03 · DENIAL IS A REAL OUTCOME","A governed workflow must be able to stop. Missing authority, bad-integrity evidence or unmet admission conditions cannot be repaired by confidence or capability."],
            ["04 · EXECUTION IS ANOTHER BOUNDARY","SWI can preserve a governance decision. That does not prove an external API, agent, machine or institution obeyed it. The handoff remains a separate proof burden."]
          ].map(([h,b])=><article key={h} style={{padding:22,border:"1px solid #315b79",borderRadius:14,background:"#061522"}}><b style={{color:"#f2c45f",fontSize:12}}>{h}</b><p style={{color:"#b8cbd9",lineHeight:1.7,fontSize:14,marginBottom:0}}>{b}</p></article>)}
        </div>
      </section>

      <section style={{padding:"66px 0 8px"}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:".16em",color:"#f2c45f"}}>THE PRESERVED TEST RECORD</div>
        <h2 style={{fontSize:"clamp(34px,5vw,58px)",letterSpacing:"-.04em",margin:"10px 0 22px"}}>Do not erase the two failures.</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:10}}>
          <article style={{padding:24,border:"1px solid #315b79",borderRadius:14,background:"#071827"}}><small style={{color:"#7893a8"}}>REPRODUCED V1</small><strong style={{display:"block",fontSize:34,marginTop:8}}>379 / 379</strong><span style={{color:"#8ed8ff"}}>tests passed</span></article>
          <article style={{padding:24,border:"1px solid #315b79",borderRadius:14,background:"#071827"}}><small style={{color:"#7893a8"}}>REPRODUCED V2</small><strong style={{display:"block",fontSize:34,marginTop:8}}>645 / 645</strong><span style={{color:"#8ed8ff"}}>tests passed</span></article>
          <article style={{padding:24,border:"1px solid #f2c45f77",borderRadius:14,background:"#201b0d"}}><small style={{color:"#c9a94f"}}>CURRENT MAIN REPRODUCTION</small><strong style={{display:"block",fontSize:34,marginTop:8}}>55 + 2</strong><span style={{color:"#f2c45f"}}>passed + failed</span></article>
        </div>
        <p style={{maxWidth:920,color:"#a9bdcc",lineHeight:1.75,marginTop:20}}>The current-main reproduction includes two failed tests, including a node-registry failure. That is not a reason to cosmetically weaken the showroom. It is exactly why preserved evidence matters: a governance record should retain adverse observations alongside successes. The submitted reproduction was participant-commissioned and AI-assisted, not an independent TA-14 examination.</p>
      </section>

      <section style={{padding:"66px 0 8px"}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:".16em",color:"#8ed8ff"}}>TA-14 CONSEQUENCE BOUNDARY</div>
        <h2 style={{fontSize:"clamp(34px,5vw,58px)",letterSpacing:"-.04em",margin:"10px 0 18px"}}>Where SWI stops is as important as where it starts.</h2>
        <div style={{display:"flex",alignItems:"stretch",gap:8,flexWrap:"wrap"}}>
          {["SWI WORKFLOW","RECORDED DECISION","EXTERNAL ENFORCEMENT","REAL-WORLD CONSEQUENCE"].map((x,i)=><div key={x} style={{flex:"1 1 190px",padding:20,border:"1px solid "+(i===2?"#f2c45f88":"#315b79"),borderRadius:12,background:i===2?"#f2c45f0b":"#061522"}}><small style={{color:"#6d879a"}}>0{i+1}</small><b style={{display:"block",marginTop:7,color:i===2?"#f2c45f":"#eef7ff"}}>{x}</b>{i===2&&<p style={{fontSize:12,lineHeight:1.55,color:"#c8b77f"}}>SEPARATE PROOF BURDEN</p>}</div>)}
        </div>
        <div style={{marginTop:16,padding:18,borderLeft:"4px solid #f2c45f",background:"#f2c45f0c",color:"#d7c994",lineHeight:1.7}}><b>TA-14 RULE:</b> A preserved decision is evidence of a governance decision. It is not, by itself, evidence that execution was authorized, enforced, occurred as intended, or produced the claimed outcome.</div>
      </section>

      <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,padding:"64px 0"}}>
        <article style={{padding:28,border:"1px solid #315b79",borderRadius:18,background:"#061522"}}><div style={{color:"#8ed8ff",fontSize:11,fontWeight:950}}>REGISTRY</div><h2 style={{fontSize:28}}>{c.regTitle}</h2><p style={{lineHeight:1.7,color:"#bfd0dc"}}>{c.registered}</p><p style={{lineHeight:1.7,color:"#f2c45f"}}><b>{c.notCert}</b></p></article>
        <article style={{padding:28,border:"1px solid #315b79",borderRadius:18,background:"#061522"}}><div style={{color:"#8ed8ff",fontSize:11,fontWeight:950}}>PRESERVED EVIDENCE</div><h2 style={{fontSize:28}}>{c.evidenceTitle}</h2><p style={{lineHeight:1.7,color:"#bfd0dc"}}>{c.evidenceBody}</p><div style={{marginTop:16,padding:13,border:"1px dashed #f2c45f",borderRadius:9,color:"#f2c45f",fontWeight:950}}>{c.status}</div></article>
      </section>

      <section style={{padding:26,borderTop:"1px solid #24445c",borderBottom:"1px solid #24445c",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:18}}>
        <div><small style={{color:"#718da2"}}>{c.owner}</small><b style={{display:"block",marginTop:5}}>Keletso Ronald Mosidila</b></div>
        <div><small style={{color:"#718da2"}}>{c.org}</small><b style={{display:"block",marginTop:5}}>Trusts Motion</b></div>
        <div><small style={{color:"#718da2"}}>{c.version}</small><b style={{display:"block",marginTop:5}}>5.12</b></div>
        <div><small style={{color:"#718da2"}}>REGISTRY ID</small><b style={{display:"block",marginTop:5}}>TA-14-AIGR-000048</b></div>
      </section>

      <footer style={{padding:"36px 0 0",color:"#718da2",fontSize:12,lineHeight:1.7}}>TA-14 Authority Governance Institution · Public technical showroom · Registration is not certification.</footer>
    </div>
  </main>;
}
