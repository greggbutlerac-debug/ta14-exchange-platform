import type { Metadata } from "next";
export const metadata: Metadata = { title: "Laboratory to Authorized Deployment | TA14", description: "Independent TA14 technical examination of laboratory evidence, field transferability and deployment authority." };
const lessons = [{title:"The Laboratory-to-Reality Gap",image:"/The Laboratory-to-Reality Gap.png",note:"A controlled laboratory result cannot independently establish real-world performance, human benefit or deployment authority."},
{title:"What Does the Test Actually Establish?",image:"/Laboratory Test Evidence Infographic.png",note:"Examine the exact claim, endpoint, test conditions, controls, uncertainty and limitations before drawing conclusions."},
{title:"Provenance, Raw Observations and Baseline Continuity",image:"/Provenance and Baseline Continuity Infographic.png",note:"Preserve original observations and adjustments separately, including their methods, provenance and continuity."},
{title:"Laboratory-to-Field Transferability",image:"/Laboratory-to-Field Transferability Gates.png",note:"Six gates examine claim boundary, environmental match, safety, continuity, authority and verification."},
{title:"Human Consequence, Safety and Uncertainty",image:"/Human Consequence and Safety Infographic.png",note:"Examine vulnerable occupants, secondary pollutants, exposure pathways, failure modes and uncertainty."},
{title:"Applicable Authority and Established Standing",image:"/Authority and Standing Governance Infographic (2).png",note:"Identify the actor, capacity, standing basis and authority relationship for the specific site and consequence."},
{title:"ALLOW / HOLD / DENY / ESCALATE",image:"/Deployment Decision Dispositions Infographic.png",note:"Record a bounded decision with rationale and reopening conditions; a HOLD never permits deployment."},
{title:"Authorized Deployment and Verified Outcome",image:"/From Laboratory Evidence to Verified Outcomes.png",note:"Monitor, document deviations and verify outcomes after a properly authorized intervention."}];
const pdf="/TA14_Laboratory_to_Authorized_Deployment_v3_Institutional_Technical_Examination%20(2).pdf";
export default function Page(){return <main style={{background:"#071a2d",color:"#f2f7ff",minHeight:"100vh",fontFamily:"system-ui, sans-serif"}}>
<div style={{maxWidth:1180,margin:"auto",padding:"36px 20px 80px"}}>
<a href="/" style={{color:"#9fddff"}}>← TA14 Exchange</a>
<p style={{letterSpacing:2,color:"#8dd9ff",marginTop:35}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT TECHNICAL EXAMINATION</p>
<h1 style={{fontSize:"clamp(2.1rem,5vw,4.2rem)",lineHeight:1.1,maxWidth:980}}>From Laboratory Efficacy to Authorized Deployment</h1>
<p style={{fontSize:"1.2rem",lineHeight:1.7,maxWidth:850,color:"#cbdcec"}}>How does a controlled air-treatment result become sufficient evidence for a bounded, accountable decision in an occupied building? Scientific observation is not deployment authority.</p>
<img src="/Laboratory%20Evidence%20to%20Authorized%20Deployment.png" alt="TA14 laboratory evidence to authorized deployment overview" style={{width:"100%",borderRadius:16,margin:"18px 0"}}/>
<div style={{display:"flex",gap:12,flexWrap:"wrap",margin:"20px 0 45px"}}>
<a href={pdf} target="_blank" rel="noopener noreferrer" style={{background:"#b8eaff",color:"#061827",padding:"13px 18px",borderRadius:8,fontWeight:700}}>Read technical reference v3.0 (PDF)</a>
<a href="#lessons" style={{border:"1px solid #75a6c7",color:"#e4f5ff",padding:"13px 18px",borderRadius:8}}>Explore eight teaching frames ↓</a>
</div>
<section style={{background:"#102c45",padding:24,borderRadius:14,marginBottom:38}}>
<h2>Governing question</h2><p style={{fontSize:"1.3rem",lineHeight:1.65}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p>
<p style={{color:"#a9d6ef"}}>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</p>
</section>
<section id="lessons"><h2 style={{fontSize:"2rem"}}>Eight-frame institutional examination</h2>
<p style={{color:"#bcd4e6"}}>Scroll freely. Each frame is an educational examination, not an empirical finding.</p>
{lessons.map((item,i)=><article key={item.title} style={{background:"#102c45",border:"1px solid #31516b",borderRadius:14,padding:18,margin:"26px 0"}}>
<p style={{color:"#91ddff",fontWeight:700}}>FRAME {String(i+1).padStart(2,"0")} / 08</p>
<h3 style={{fontSize:"clamp(1.3rem,3vw,2rem)",marginTop:0}}>{item.title}</h3>
<img src={encodeURI(item.image)} alt={item.title} loading="lazy" style={{width:"100%",height:"auto",borderRadius:8}}/>
<p style={{lineHeight:1.7,fontSize:"1.08rem"}}>{item.note}</p>
</article>)}</section>
<section style={{background:"#102c45",padding:24,borderRadius:14,marginTop:40}}>
<h2>Examine · Establish · Operate</h2>
<p>Examine existing evidence-to-deployment gaps. Establish bounded evidence, authority and standing records. Operate ongoing verification and reassessment workflows. These are proposed examination lanes, not funded CRADA work.</p>
<a href={pdf} style={{color:"#9fddff"}}>Open the complete technical examination PDF ↗</a>
</section>
<footer style={{marginTop:35,color:"#a5bdcd",lineHeight:1.7}}>Independent TA14 educational examination. No EPA or Blueprint Biosecurity endorsement, affiliation, scientific validation or regulatory approval is implied. Illustrative charts and numerical examples are not study findings. All deployment decisions remain with duly authorized parties.</footer>
</div></main>}