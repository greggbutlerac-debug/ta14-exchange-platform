"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  engineName: string;
  guideHref: string;
  assuranceState?: string;
};

export default function EngineAcademyHelp({ engineName, guideHref, assuranceState = "Academy guide available" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open TA-14 Academy help for ${engineName}`}
        style={{
          position: "fixed", right: 22, bottom: 22, zIndex: 90,
          border: "1px solid rgba(219,174,82,.72)", borderRadius: 999,
          padding: "12px 17px", cursor: "pointer", color: "#07111d",
          background: "linear-gradient(135deg,#f1cf83,#b47b25)",
          boxShadow: "0 18px 60px rgba(0,0,0,.42)", fontWeight: 900,
          letterSpacing: ".035em", fontSize: 12,
        }}
      >
        TA-14 ACADEMY · HELP
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${engineName} Academy help`}
          onClick={() => setOpen(false)}
          style={{position:"fixed",inset:0,zIndex:100,background:"rgba(1,7,13,.76)",backdropFilter:"blur(10px)",display:"grid",placeItems:"center",padding:20}}
        >
          <section
            onClick={(event) => event.stopPropagation()}
            style={{width:"min(720px,100%)",border:"1px solid rgba(219,174,82,.38)",borderRadius:24,background:"linear-gradient(145deg,#111d2a,#07111d)",boxShadow:"0 30px 100px rgba(0,0,0,.62)",padding:26,color:"#edf3f7"}}
          >
            <div style={{fontSize:10,fontWeight:900,letterSpacing:".18em",color:"#ddb25d"}}>TA-14 ACADEMY · EMBEDDED OPERATING GUIDANCE</div>
            <h2 style={{margin:"9px 0 6px",fontSize:28,lineHeight:1.08}}>{engineName}</h2>
            <p style={{margin:0,color:"#9db1c2",lineHeight:1.65,fontSize:14}}>
              Learn what this engine governs, what you need before beginning, the exact operating sequence, what a correct result looks like, and what to do when the engine holds, denies, escalates, or cannot complete a record.
            </p>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,marginTop:20}}>
              {["Before you begin","Step-by-step operation","Visual walkthrough","Failure & refusal states"].map((label,index)=>(
                <div key={label} style={{border:"1px solid rgba(135,163,185,.18)",borderRadius:14,padding:13,background:"rgba(255,255,255,.025)"}}>
                  <div style={{fontSize:10,color:"#ddb25d",fontWeight:900}}>0{index+1}</div>
                  <div style={{marginTop:5,fontSize:12,fontWeight:800}}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{marginTop:18,padding:"12px 14px",borderRadius:12,background:"rgba(69,174,132,.08)",border:"1px solid rgba(69,174,132,.2)",fontSize:12,color:"#b9d7ca"}}>
              Assurance state · {assuranceState}
            </div>

            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:20}}>
              <Link href={guideHref} style={{flex:"1 1 250px",textAlign:"center",textDecoration:"none",padding:"13px 16px",borderRadius:12,background:"linear-gradient(135deg,#e4bb67,#a66f20)",color:"#07111d",fontWeight:900,fontSize:12}}>
                OPEN FULL ACADEMY WALKTHROUGH →
              </Link>
              <button type="button" onClick={() => setOpen(false)} style={{padding:"13px 18px",borderRadius:12,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.04)",color:"#c7d3dc",cursor:"pointer",fontWeight:800}}>
                Return to engine
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
