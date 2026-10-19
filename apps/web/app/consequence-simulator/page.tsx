"use client";

import { useState } from "react";
import SamanthaScenes from "./SamanthaScenes";

type Choice = "execute" | "approve" | "hold" | "escalate";
type Mode = "ungoverned" | "governed";
const cases: Record<Choice, { label: string; action: string; without: string; with: string; disposition: string }> = {
  execute: {
    label: "Execute the AI recommendation",
    action: "You instructed the controller to reduce hospital electrical demand.",
    without: "SIMULATED: The command executes. Protected cooling is reduced, the grid receives temporary relief, and hospital temperatures begin to rise. Clinical operations are disrupted.",
    with: "SIMULATED: The execution gate cannot establish authority to curtail protected cooling. The command is held before dispatch; grid risk remains and requires an alternative response.",
    disposition: "HOLD"
  },
  approve: {
    label: "Obtain supervisor approval",
    action: "You requested approval from a human supervisor.",
    without: "SIMULATED: Approval is accepted without verifying the supervisor's standing over protected hospital loads. The command executes and critical cooling is disrupted.",
    with: "SIMULATED: Approval alone does not satisfy the authority examination. Missing standing and scope evidence trigger escalation; the disputed command is not executed.",
    disposition: "ESCALATE"
  },
  hold: {
    label: "Hold the action",
    action: "You withheld the load-reduction instruction.",
    without: "SIMULATED: Hospital cooling continues, but the grid imbalance remains unresolved and there is no structured pathway for re-examination.",
    with: "SIMULATED: HOLD is recorded with missing evidence and authority requirements. Operators investigate authorized alternatives. No safe outcome is guaranteed.",
    disposition: "HOLD"
  },
  escalate: {
    label: "Escalate to responsible authorities",
    action: "You referred the conflict for institutional resolution.",
    without: "SIMULATED: Operators negotiate, but authority boundaries and the decision record remain ambiguous; delays may worsen grid risk.",
    with: "SIMULATED: ESCALATE records the conflicting obligations and routes the matter to designated authorities. A revised command must be examined before execution.",
    disposition: "ESCALATE"
  }
};
export default function ConsequenceSimulator() {
  const [choice, setChoice] = useState<Choice>("execute");
  const [mode, setMode] = useState<Mode>("ungoverned");
  const [history, setHistory] = useState<Array<{choice: Choice; mode: Mode}>>([]);
  const selected = cases[choice];
  return (
    <main style={{minHeight:"100vh",background:"#081523",color:"#edf5ff",padding:"clamp(20px,5vw,72px)",fontFamily:"system-ui,sans-serif"}}>
      <div style={{maxWidth:960,margin:"auto"}}>
        <p style={{letterSpacing:3,color:"#8dc9f5"}}>TA14 AUTHORITY GOVERNANCE INSTITUTION</p>
        <h1 style={{fontSize:"clamp(2rem,5vw,4rem)",lineHeight:1.1}}>YOU AUTHORIZED WHAT HAPPENS NEXT</h1>
        <p style={{fontSize:18,color:"#b7ccdd"}}>Interactive consequence and execution authority experience · Hypothetical demonstration</p>
        <SamanthaScenes />
        <section id="decision-gate" style={{background:"#11283b",padding:28,borderRadius:18,marginTop:28}}>
          <h2>Scenario 01 — The Hospital Power Decision</h2>
          <p>A grid AI proposes reducing hospital electricity demand by 15%. Protected cooling may be affected. The grid and hospital have competing operational obligations.</p>
          <h3>What do you authorize?</h3>
          <div style={{display:"grid",gap:12}}>
            {(Object.keys(cases) as Choice[]).map(key=><label key={key} style={{display:"flex",gap:12,padding:14,border:"1px solid #4a6881",borderRadius:10,cursor:"pointer"}}>
              <input type="radio" name="decision" checked={choice===key} onChange={()=>setChoice(key)}/>{cases[key].label}
            </label>)}
          </div>
          <h3 style={{marginTop:28}}>Compare execution pathways</h3>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button onClick={()=>setMode("ungoverned")} aria-pressed={mode==="ungoverned"} style={buttonStyle(mode==="ungoverned")}>Without TA14</button>
            <button onClick={()=>setMode("governed")} aria-pressed={mode==="governed"} style={buttonStyle(mode==="governed")}>With TA14</button>
          </div>
          <div aria-live="polite" style={{background:"#071b2b",borderLeft:"4px solid #eab45a",padding:22,marginTop:20,borderRadius:8}}>
            <strong>{mode==="governed"?"GOVERNED PATHWAY — "+selected.disposition:"UNGOVERNED PATHWAY — SIMULATED"}</strong>
            <p>{selected.action}</p>
            <p>{mode==="governed"?selected.with:selected.without}</p>
          </div>
          <button style={{...buttonStyle(true),marginTop:20}} onClick={()=>setHistory(prev=>[...prev,{choice,mode}])}>Record this decision</button>
        </section>
        <section style={{marginTop:30,padding:24,border:"1px solid #46627a",borderRadius:16}}>
          <h2>Consequence accountability record</h2>
          {history.length===0?<p>No decisions recorded yet.</p>:<ol>{history.map((h,i)=><li key={i} style={{marginBottom:14}}>{cases[h.choice].label} — {h.mode==="governed"?"TA14 examination: "+cases[h.choice].disposition:"No TA14 examination"} — {h.mode==="governed"?cases[h.choice].with:cases[h.choice].without}</li>)}</ol>}
          <button style={buttonStyle(false)} onClick={()=>{setHistory([]);setChoice("execute");setMode("ungoverned")}}>Reset experience</button>
        </section>
        <p style={{fontSize:13,color:"#a9bdcd",marginTop:28}}>Educational simulation only. The described failures and preventions are hypothetical, not observed incidents or validated deployment outcomes. A HOLD or ESCALATE does not guarantee safety or resolve the underlying emergency.</p>
      </div>
    </main>
  );
}
function buttonStyle(active:boolean):React.CSSProperties {return {background:active?"#dca84f":"#23445f",color:active?"#101923":"#ffffff",border:0,padding:"12px 18px",borderRadius:8,fontWeight:700,cursor:"pointer"};}
