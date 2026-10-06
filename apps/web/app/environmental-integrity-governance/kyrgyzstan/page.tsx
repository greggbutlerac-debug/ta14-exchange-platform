import Link from "next/link";

export const metadata = {
  title: "Kyrgyz Republic — Evidence to Enforcement | TA14",
  description: "Independent TA14 examination of Kyrgyz Republic Ministry response No. 01-10/31492 dated 02.10.2026.",
};

const boards = [
  ["01","Official Ministry Response","The controlling record. Establish what the Ministry actually stated before any architectural interpretation begins.","/kyrgyz-official-ministry-response-01-corrected.png"],
  ["02","Roles Are Separated","Monitoring, evidence production, and consequential enforcement are not treated as the same institutional function.","/kyrgyz-roles-separated-02.png"],
  ["03","Evidence Must Be Verified and Current","Accurate measurement, proper calibration, verification, and currency matter before evidence is used for consequential decision-making.","/kyrgyz-verified-current-evidence-03.png"],
  ["04","Changed Conditions Trigger Revalidation","When material conditions change, yesterday's record cannot simply be carried forward. Re-measurement and additional verification may be required.","/kyrgyz-changed-conditions-revalidation-04.png"],
  ["05","Evidence-to-Enforcement Decision Architecture","A consequence must survive the path from observed conditions through evidence sufficiency and lawful authority before execution.","/kyrgyz-evidence-to-enforcement-decision-architecture-05.png"],
  ["06","TA14 Eight-Anchor Mapping","TA14 independently maps the response against the canonical chain: Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome.","/kyrgyz-ta14-eight-anchor-architecture-mapping-06.png"],
  ["07","Put the Consequence on Trial","A pressure test asks whether yesterday's valid evidence can authorize today's proposed consequence after reality has changed.","/kyrgyz-consequence-pressure-test-07.png"],
  ["08","Execution Must Produce a Verified Outcome","Governance does not end when an action occurs. The outcome must be observed and preserved as the new reality.","/kyrgyz-execution-to-verified-outcome-08.png"],
];

export default function KyrgyzstanPage() {
  return (
    <main style={{minHeight:"100vh",background:"#f4f7fb",color:"#10254b"}}>
      <section style={{background:"linear-gradient(135deg,#071c45,#075aa8)",color:"white",padding:"28px 20px 52px"}}>
        <div style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap",fontSize:13,fontWeight:800,letterSpacing:".08em"}}>
            <Link href="/showrooms" style={{color:"white",textDecoration:"none"}}>← SHOWROOMS</Link>
            <span>TA14 · PUBLIC TECHNICAL EXAMINATION · KYRGYZ REPUBLIC</span>
          </div>
          <div style={{marginTop:40,maxWidth:920}}>
            <div style={{fontSize:14,fontWeight:900,letterSpacing:".14em",color:"#ffd54a"}}>OFFICIAL MINISTRY RESPONSE RECEIVED · 02 OCT 2026</div>
            <h1 style={{fontSize:"clamp(42px,7vw,82px)",lineHeight:.95,margin:"14px 0 20px",letterSpacing:"-.04em"}}>Evidence to Enforcement</h1>
            <p style={{fontSize:"clamp(19px,2.4vw,28px)",lineHeight:1.35,margin:0,maxWidth:900}}>What happens when environmental evidence is valid, conditions change, and a real consequence is proposed?</p>
          </div>
        </div>
      </section>

      <section style={{maxWidth:1180,margin:"-24px auto 0",padding:"0 20px 70px"}}>
        <div style={{background:"white",borderRadius:18,padding:"28px",boxShadow:"0 16px 50px rgba(5,34,77,.12)",border:"1px solid #d9e3f0"}}>
          <div style={{fontSize:13,fontWeight:900,letterSpacing:".12em",color:"#b1261b"}}>CONTROLLING SOURCE</div>
          <h2 style={{fontSize:30,margin:"8px 0 12px"}}>Ministry response № 01-10/31492 · 02.10.2026</h2>
          <p style={{fontSize:18,lineHeight:1.65,margin:0}}>The Ministry of Natural Resources, Ecology and Technical Supervision of the Kyrgyz Republic provided a formal response to TA14. The signed Ministry record controls. The teaching boards and architectural mappings below are independent TA14 analysis and must not be read as Ministry adoption of TA14.</p>
        </div>

        <div style={{margin:"34px 0",padding:"26px",borderRadius:16,background:"#071c45",color:"white"}}>
          <div style={{fontSize:13,fontWeight:900,letterSpacing:".13em",color:"#ffd54a"}}>THE GOVERNING QUESTION</div>
          <div style={{fontSize:"clamp(25px,3vw,39px)",fontWeight:900,lineHeight:1.18,marginTop:10}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</div>
        </div>

        <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginBottom:42}}>
          {[
            ["MINISTRY RESPONSE","The signed governmental record."],
            ["TA14 MAPPING","Independent architectural examination."],
            ["TA14 FINDING","SUPPORTED — BOUNDED ALIGNMENT."],
            ["BOUNDARY","No adoption · endorsement · partnership · certification."],
          ].map(([a,b])=><div key={a} style={{background:"white",border:"1px solid #d9e3f0",borderRadius:14,padding:20}}><div style={{fontSize:12,fontWeight:900,letterSpacing:".1em",color:"#0961a8"}}>{a}</div><div style={{fontSize:17,fontWeight:800,lineHeight:1.4,marginTop:8}}>{b}</div></div>)}
        </section>

        <section>
          <div style={{fontSize:13,fontWeight:900,letterSpacing:".12em",color:"#0961a8"}}>EIGHT-BOARD TEACHING SEQUENCE</div>
          <h2 style={{fontSize:"clamp(32px,4vw,50px)",margin:"8px 0 10px"}}>The record advances one question at a time.</h2>
          <p style={{fontSize:18,lineHeight:1.6,maxWidth:850,margin:"0 0 30px"}}>Each board has a different job. The sequence moves from source integrity to institutional roles, evidence currency, revalidation, authority, pressure testing, execution, and proven outcome.</p>
          {boards.map(([n,title,desc,img])=>(
            <article key={n} style={{background:"white",border:"1px solid #d9e3f0",borderRadius:18,overflow:"hidden",margin:"0 0 30px",boxShadow:"0 10px 30px rgba(5,34,77,.07)"}}>
              <div style={{padding:"22px 24px"}}>
                <div style={{fontSize:12,fontWeight:900,letterSpacing:".12em",color:"#0961a8"}}>BOARD {n} OF 08</div>
                <h3 style={{fontSize:28,margin:"5px 0 7px"}}>{title}</h3>
                <p style={{fontSize:17,lineHeight:1.55,margin:0,color:"#38506f"}}>{desc}</p>
              </div>
              <img src={img} alt={title} style={{display:"block",width:"100%",height:"auto",borderTop:"1px solid #d9e3f0"}} />
            </article>
          ))}
        </section>

        <section style={{background:"#fff7dc",border:"2px solid #e8b51e",borderRadius:18,padding:"28px",marginTop:40}}>
          <div style={{fontSize:13,fontWeight:900,letterSpacing:".12em",color:"#8c5d00"}}>TA14 INDEPENDENT FINDING</div>
          <h2 style={{fontSize:34,margin:"8px 0",color:"#0b6335"}}>SUPPORTED — BOUNDED ALIGNMENT</h2>
          <p style={{fontSize:18,lineHeight:1.65,margin:"0 0 14px"}}>The examined Ministry response independently demonstrates governance behaviors materially consistent with TA14 principles concerning evidence currency, measurement verification, authority separation, changed-condition revalidation, renewed decision basis, and interruption before consequential action.</p>
          <p style={{fontSize:17,lineHeight:1.6,margin:0,fontWeight:800}}>This finding does not establish adoption of TA14, equivalence to TA14, endorsement, partnership, certification, regulatory approval, or implementation of the complete TA14 architecture.</p>
        </section>

        <section style={{marginTop:38,background:"white",border:"1px solid #d9e3f0",borderRadius:18,padding:"28px"}}>
          <div style={{fontSize:13,fontWeight:900,letterSpacing:".12em",color:"#0961a8"}}>TECHNICAL GOVERNANCE REFERENCE · v1.1 EXAMINATION EDITION</div>
          <h2 style={{fontSize:30,margin:"8px 0 10px"}}>Download the complete examination record</h2>
          <p style={{fontSize:17,lineHeight:1.6}}>The downloadable reference preserves source precedence, claim boundaries, the canonical eight-anchor architecture, and the changed-condition revalidation analysis used to build this showroom.</p>
          <a href="/TA14_Kyrgyz_Republic_Evidence_to_Enforcement_Technical_Governance_Reference_v1.1_Examination_Edition%20(1).pdf" style={{display:"inline-block",marginTop:8,background:"#075aa8",color:"white",padding:"14px 20px",borderRadius:10,fontWeight:900,textDecoration:"none"}}>DOWNLOAD TECHNICAL GOVERNANCE REFERENCE PDF ↓</a>
          <p style={{fontSize:13,color:"#6a7890",marginTop:12}}>Frozen v1.1 Examination Edition · Ministry record № 01-10/31492 · 02.10.2026</p>
        </section>

        <section style={{marginTop:38,padding:"26px",borderRadius:16,background:"#071c45",color:"white"}}>
          <div style={{fontSize:13,fontWeight:900,letterSpacing:".12em",color:"#ffd54a"}}>THE CONTROL RULE</div>
          <div style={{fontSize:26,fontWeight:900,marginTop:8}}>Yesterday's valid evidence does not automatically authorize today's consequence.</div>
          <div style={{fontSize:20,marginTop:10}}>Observed is not inferred. Inferred is not authorized.</div>
        </section>
      </section>
    </main>
  );
}
