import Link from 'next/link';
import GuidedShowroom from '../../../components/GuidedShowroom';

const timeline=[
['5 Sep 2026','TA-14 → ASHRAE Standards Section','Technical question submitted: when does an interoperable, technically valid building command become presently authorized physical execution?'],
['9 Sep 2026','ASHRAE Technical Services → TA-14','Heather Pierce explains that Standard 135 is outside her expertise and directs TA-14 to BACnet standard contacts for the technical question.'],
['10 Sep 2026','TA-14 → BACnet contacts','TA-14 follows the referral and asks whether Standard 135 contains a pre-execution authority determination, where it is located if so, or whether that responsibility sits outside BACnet.'],
['17 Sep 2026','U.S. EPA Indoor Air → TA-14','After the classroom CO₂ / wildfire PM₂.₅ scenario is sharpened to the changed-condition seam, EPA states it lacks regulatory authority over indoor air quality and refers TA-14 to ASHRAE standards.'],
['19 Sep 2026','TA-14','The two institutional paths are preserved together: the earlier ASHRAE → BACnet referral and EPA’s later independent ASHRAE referral now converge on the same unresolved pre-execution question.'],
['NEXT','ASHRAE / BACnet technical continuation','Continue the existing standards inquiry without treating referral, correspondence, or silence as endorsement or technical agreement.']
];

const standards=[
['ASHRAE Standard 135 / BACnet','Communication protocol and building-automation interoperability layer under examination.'],
['ASHRAE Standard 223','Semantic interoperability context raised in TA-14’s original standards inquiry.'],
['EPA IAQ referral','Independent institutional referral carrying the sharpened changed-condition question back to ASHRAE standards.']
];

export const metadata={
 title:'United States · ASHRAE / BACnet Continuation | TA-14',
 description:'TA-14 public technical continuation surface preserving the U.S. EPA to ASHRAE and ASHRAE to BACnet referral path around changed-condition execution authority.'
};

export default function AshraeBacnetContinuation(){
 return <main className="p"><div className="s">
  <nav><Link className="brand" href="/"><b>TA-14</b> AUTHORITY</Link><Link href="/global-institutional-engagement/united-states-epa-indoor-air">U.S. SHOWROOM 07</Link><Link href="/global-institutional-engagement">GLOBAL ENGAGEMENT</Link></nav>
  <header><p className="eye">UNITED STATES · SHOWROOM 07 · STANDARDS / BUILDING-CONTROL CONTINUATION</p><h1>A valid command is not the same thing as<br/><em>present authority to execute.</em></h1><p className="lead">This surface continues the bounded U.S. institutional record from EPA Indoor Air into the ASHRAE / BACnet standards layer. It does not restart the examination. It preserves the referral chain already earned and carries forward one unresolved question: after material conditions change, what prevents authority established under the earlier state from persisting silently into physical execution?</p>
  <div className="status"><b>ASHRAE REFERRAL RECORDED</b><b>BACNET INQUIRY SENT</b><b>EPA → ASHRAE REFERRAL RECORDED</b><b>NO ENDORSEMENT IMPLIED</b></div></header>

  <GuidedShowroom eyebrow="ASHRAE / BACNET · GUIDED QUESTION" title="Interoperability can carry a command. What makes it executable now?" intro="This continuation keeps the standards question narrow. It does not claim an answer from ASHRAE or BACnet; it lets the visitor walk the unresolved pre-execution authority seam." accent="#78c9ee" gold="#e8b95e" steps={[
   {label:'01 · CONNECT',title:'The systems interoperate',plain:'BACnet or another building-control layer can carry valid information and commands between components.'},
   {label:'02 · PREPARE',title:'A technically valid command is prepared',plain:'The command can be syntactically and operationally valid under the earlier state.',why:'Technical validity is not the same proposition as present authority.'},
   {label:'03 · CHANGE',title:'Material reality changes before execution',plain:'New environmental evidence arrives after preparation but before physical consequence.'},
   {label:'04 · ASK',title:'Where is the authority gate?',plain:'What mechanism withholds, revokes, expires, or requires revalidation of the already-prepared action?',result:'THIS REMAINS THE BOUNDED TECHNICAL QUESTION'},
   {label:'05 · PRESERVE',title:'Do not turn referral or silence into agreement',plain:'The public record preserves the ASHRAE referral, BACnet inquiry, and EPA referral without treating any of them as adoption, endorsement, or technical agreement.'},
  ]}/>

  <section><p className="eye">WHY THIS IS A CONTINUATION — NOT A NEW SHOWROOM</p><h2>Two independent institutional paths converge on the same technical layer.</h2>
   <div className="paths"><article><span>PATH A</span><b>TA-14 → ASHRAE → BACnet</b><p>TA-14 raised the execution-authority boundary with ASHRAE first. ASHRAE Technical Services directed the Standard 135 question to BACnet contacts, and TA-14 followed that route.</p></article><article><span>PATH B</span><b>TA-14 ↔ U.S. EPA → ASHRAE</b><p>The later EPA exchange sharpened the question around changed environmental conditions between prepared action and execution. EPA then independently directed TA-14 to ASHRAE standards.</p></article></div>
   <div className="converge">ASHRAE / BACnet is therefore the next technical chamber of U.S. Showroom 07 — not a claim of ASHRAE adoption, partnership, or agreement.</div>
  </section>

  <section className="band"><div className="in"><p className="eye">THE FROZEN QUESTION</p><h2>What makes the damper allowed to do it now?</h2>
   <div className="steps"><article><span>T₀</span><b>CONDITION VALID</b><p>Indoor CO₂ supports additional outdoor air under the applicable control logic.</p></article><article><span>T₀+</span><b>COMMAND PREPARED</b><p>The building-control system prepares the physical action.</p></article><article><span>ΔN</span><b>REALITY CHANGES</b><p>Outdoor wildfire PM₂.₅ rises materially before execution.</p></article><article><span>T₁</span><b>CHANGE KNOWN</b><p>The new environmental condition is detected correctly.</p></article><article className="gate"><span>?</span><b>AUTHORITY GATE</b><p>What withholds, revokes, expires, or requires revalidation of the already-prepared action?</p></article></div>
   <div className="hard">If nothing explicitly says HOLD, does the earlier command execute because absence of refusal has become permission?</div>
  </div></section>

  <section><p className="eye">STANDARDS-LAYER EXAMINATION</p><h2>The question is architectural, not rhetorical.</h2>
   <div className="grid">{standards.map(([a,b])=><article key={a}><b>{a}</b><p>{b}</p></article>)}</div>
   <div className="questions"><p><b>1 · LOCATION</b> Does Standard 135, Standard 223, or another ASHRAE mechanism define a distinct pre-execution authority determination?</p><p><b>2 · REVOCATION</b> If authority was valid when a command was prepared, what event makes material changed evidence capable of withholding or revoking it?</p><p><b>3 · REVALIDATION</b> What requires the prepared action to be rebound to the current state before consequence?</p><p><b>4 · BOUNDARY</b> If this is intentionally outside BACnet, where does ASHRAE place responsibility for that determination?</p></div>
  </section>

  <section className="band"><div className="in"><p className="eye">TA-14 HANDOFF</p><h2>Interoperability can transport a command. It does not by itself establish authority to execute it.</h2>
   <div className="rail"><div><b>REALITY → RECORD</b><p>Environmental state and provenance.</p></div><span>→</span><div><b>CONTINUITY → ADMISSIBILITY</b><p>Is the evidence still current and sufficient?</p></div><span>→</span><div className="gate"><b>BINDING → COMMIT</b><p>Is this action still bound to current evidence and present authority?</p></div><span>→</span><div><b>EXECUTION → OUTCOME</b><p>Only current authority reaches physical consequence.</p></div></div>
   <div className="states"><b>ALLOW</b><b>HOLD</b><b>DENY</b><b>ESCALATE</b></div>
  </div></section>

  <section><div className="boundary"><b>PUBLIC-RECORD BOUNDARY</b><p>This continuation surface records TA-14 correspondence and referral continuity involving ASHRAE Technical Services, BACnet contacts, and the U.S. EPA Indoor Air Quality exchange. It does not represent ASHRAE, BACnet International, any BACnet committee member, or EPA endorsement, adoption, validation, certification, partnership, procurement, pilot authorization, regulatory recognition, or agreement with TA-14’s architecture or conclusions. ASHRAE and BACnet materials remain authoritative for their own standards and positions. TA-14’s execution-authority framing remains a bounded technical question unless and until a separate record establishes more.</p></div></section>

  <section className="institutional"><p className="eye">INSTITUTIONAL CONTINUITY RECORD</p><h2>What happened, when it happened, and what comes next.</h2><div className="timeline">{timeline.map(([d,p,e])=><article key={d+p}><span>{d}</span><b>{p}</b><p>{e}</p></article>)}</div></section>
  <footer>TA-14 AUTHORITY · GLOBAL INSTITUTIONAL ENGAGEMENT<br/>UNITED STATES · SHOWROOM 07 · ASHRAE / BACNET TECHNICAL CONTINUATION</footer>
 </div><style>{`
*{box-sizing:border-box}.p{min-height:100vh;background:radial-gradient(circle at 12% 0%,#17344b,transparent 29%),radial-gradient(circle at 90% 0%,#443313,transparent 25%),#061019;color:#eef5f8;font-family:Arial,sans-serif}.s,.in{max-width:1220px;margin:auto;padding:0 28px}nav{min-height:76px;display:flex;align-items:center;gap:25px;border-bottom:1px solid #29404f}nav a{color:#bacbd5;text-decoration:none;font-size:9px;font-weight:900;letter-spacing:1px}.brand{margin-right:auto;font-size:15px!important}.brand b,.eye{color:#78c9ee}header{padding:82px 0 58px}.eye{font-size:10px;font-weight:950;letter-spacing:2px}h1{font:clamp(50px,7vw,88px) Georgia,serif;line-height:.98;letter-spacing:-3px;max-width:1080px}h1 em{color:#e8b95e;font-style:normal}.lead{max-width:980px;color:#b4c5cf;font-size:18px;line-height:1.75}.status,.states{display:flex;gap:8px;flex-wrap:wrap;margin-top:28px}.status b,.states b{padding:9px 12px;border:1px solid #78c9ee45;border-radius:999px;font-size:8px;letter-spacing:.8px}section{padding:68px 0;border-top:1px solid #ffffff12}h2{font:clamp(34px,5vw,56px) Georgia,serif;max-width:980px}.paths,.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.paths article,.grid article,.steps article,.questions p{padding:24px;border:1px solid #2b4657;background:#091823}.paths span,.steps span{display:block;color:#e8b95e;font-size:10px;font-weight:900;margin-bottom:10px}.paths b,.grid b,.steps b,.questions b{color:#8bd2f1;font-size:11px}.paths p,.grid p,.steps p,.questions p{color:#9fb3bf;line-height:1.65}.converge,.hard{margin-top:25px;padding:26px;border-left:4px solid #e8b95e;background:#17170f;color:#e7d6ac;font:20px/1.55 Georgia,serif}.band{margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);background:#091620}.steps{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.steps .gate,.rail .gate{border-color:#e8b95e}.grid{grid-template-columns:repeat(3,1fr)}.questions{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:24px}.questions p{margin:0}.rail{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;align-items:center;gap:9px}.rail div{padding:22px;border:1px solid #2b4657;background:#07131d}.rail span{color:#e8b95e;font-size:25px}.rail b{color:#8bd2f1;font-size:10px}.rail p{color:#91a8b5;font-size:12px;line-height:1.6}.states b{flex:1;text-align:center;color:#d9eaf2}.boundary{padding:28px;border:1px solid #8a6c35;background:#17170f}.boundary b{color:#e8b95e;font-size:10px}.boundary p{color:#c3bdad;font-size:12px;line-height:1.7}.timeline{display:grid;gap:10px}.timeline article{display:grid;grid-template-columns:135px 245px 1fr;gap:18px;padding:17px;border:1px solid #ffffff16;background:#ffffff05}.timeline span{color:#e8b95e;font-size:10px;font-weight:900}.timeline b{color:#dbeaf2;font-size:10px}.timeline p{margin:0;color:#91a8b5;font-size:11px;line-height:1.6}footer{padding:45px 0 70px;border-top:1px solid #ffffff12;color:#718894;font-size:9px;line-height:1.8}@media(max-width:900px){.steps,.grid{grid-template-columns:1fr 1fr}.rail{grid-template-columns:1fr}.rail>span{transform:rotate(90deg);justify-self:center}}@media(max-width:700px){.paths,.grid,.steps,.questions{grid-template-columns:1fr}.timeline article{grid-template-columns:1fr;gap:6px}.s,.in{padding:0 18px}h1{letter-spacing:-1px}nav{height:auto;padding:18px 0;flex-wrap:wrap}}
`}</style></main>
}