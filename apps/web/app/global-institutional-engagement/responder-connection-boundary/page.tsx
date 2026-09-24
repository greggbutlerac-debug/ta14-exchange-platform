import Link from 'next/link';
import ResponderConnectionLab from './ResponderConnectionLab';

export const metadata = {
  title: 'The Governed Crossing | CNS/CP × ONUMA × TA-14',
  description: 'An interactive examination of the boundary between building meaning, Connection Profiles, connection policy, authority context and local execution.',
};

const layers = [
 ['01','BUILDING REALITY','ONUMA · RE1 · 223P','What exists? What is it? How is it related?','IDENTITY · SEMANTICS · TOPOLOGY'],
 ['02','INTERACTION CONTRACT','CNS/CP','What interaction exists between independent parties?','PROFILE · PURPOSE · SCOPE'],
 ['03','LIVE CONNECTION','CNS/CP','Who is connected under that Profile now?','PARTIES · DURATION · REVOCATION'],
 ['04','AUTHORITY CONTEXT','AFA · AVP','What attributable authority context may cross?','CONTEXT MAY TRAVEL'],
 ['05','LOCAL CONSEQUENCE','EABA · TA-14','May this exact consequence become reality now?','ALLOW · HOLD · DENY · ESCALATE'],
];

export default function Page(){
 return <main className="p"><div className="shell">
  <nav><Link className="brand" href="/"><b>TA-14</b> AUTHORITY</Link><Link href="/global-institutional-engagement/fire-chief-electrical-shutoff">SHUTOFF SANDBOX</Link><Link href="/registry/ta-14-admissible-execution-architecture/showcase/owner-to-consequence-collaboration">OWNER → CONSEQUENCE</Link></nav>

  <header>
   <p className="kicker">CNS/CP × ONUMA × TA-14 · PROPOSED JOINT EXAMINATION</p>
   <div className="status"><span>DRAFT</span><span>NOT FROZEN</span><span>NOT REGISTERED</span><span>OPEN FOR CORRECTION</span></div>
   <h1>THE GOVERNED<br/><em>CROSSING.</em></h1>
   <p className="dek">A graph can be right. A Profile can be right. A connection can be valid. Authority context can cross correctly. <strong>And the proposed consequence can still be HOLD.</strong></p>
   <div className="thesis"><small>THE SEAM WE ARE TESTING</small><b>The Connection Profile governs the crossing. TA-14 governs whether what crossed may become consequence.</b></div>
  </header>

  <section className="discovery">
   <p className="eyebrow">THE DISCOVERY</p><h2>The Profile is not derived from the building.<br/><em>It is derived from the interaction.</em></h2>
   <div className="contrast">
    <article className="no"><span>✕</span><small>OBJECT-FIRST</small><h3>“There is an AHU. Write an AHU Profile.”</h3><p>The graph can identify an AHU perfectly and still tell us nothing about the agreement between two independently operated parties.</p></article>
    <article className="yes"><span>✓</span><small>INTERACTION-FIRST</small><h3>“What does the responder need to read? What do they need to command?”</h3><p>Those are bounded interactions. They give the Profile a purpose, consumer, provider, scope, duration model and revocation surface.</p></article>
   </div>
  </section>

  <section>
   <p className="eyebrow">THE NARROW WAIST</p><h2>Five layers. Five different jobs.<br/><em>No silent inheritance.</em></h2>
   <div className="layers">{layers.map(([n,t,o,q,b],i)=><div className="layerRow" key={n}><div className="num">{n}</div><div className="owner"><small>{t}</small><b>{o}</b></div><div className="question">{q}</div><div className="badge">{b}</div>{i<4&&<div className="down">↓</div>}</div>)}</div>
   <div className="warning">LINKING ≠ CONNECTING <i>·</i> CONNECTING ≠ AUTHORITY TO EXECUTE <i>·</i> CROSSING ≠ COMMITMENT</div>
  </section>

  <section className="profiles">
   <p className="eyebrow">THE TWO PROFILES</p><h2>Same responder. <em>Two different interactions.</em></h2>
   <p className="sectionLead">The emergency does not rewrite these candidate Profiles. It changes which connections are established under them. A Profile exposes only properties the other party must act on at the connection layer; it does not unpack or inherit the contents of an authority object.</p>
   <div className="profileGrid">
    <article><div className="phead"><span>CP-01</span><small>PROPOSED · NOT FROZEN</small></div><h3>RESPONDER / READ</h3><p className="big">“Show me the bounded state I need to understand.”</p><dl><div><dt>PROFILE GOVERNS</dt><dd>Readable objects · purpose · scope · parties · duration model · revocation model</dd></div><div><dt>PROFILE DOES NOT ESTABLISH</dt><dd>Permission to alter the building or execute a physical consequence</dd></div></dl></article>
    <article><div className="phead"><span>CP-02</span><small>PROPOSED · NOT FROZEN</small></div><h3>RESPONDER / COMMAND</h3><p className="big">“Present this bounded command to the receiving domain.”</p><dl><div><dt>PROFILE GOVERNS</dt><dd>Commandable interaction · purpose · scope · parties · duration model · revocation model</dd></div><div><dt>PROFILE DOES NOT ESTABLISH</dt><dd>Sufficient Admissible Evidence · Applicable Authority · Established Standing at local commit · an ALLOW / HOLD / DENY / ESCALATE determination · permission to physically execute</dd></div></dl></article>
   </div>
   <div className="moves"><div><small>PROFILES</small><b>STAY FIXED</b></div><span>while</span><div><small>CONNECTION POLICY</small><b>MOVES</b></div></div>
  </section>

  <ResponderConnectionLab />

  <section>
   <p className="eyebrow">POSITIVE SPACE / NEGATIVE SPACE</p><h2>A good Profile names what the connection must carry.<br/><em>Everything else stays out of the Profile.</em></h2>
   <div className="spaceGrid">
    <article className="positive"><small>POSITIVE SPACE</small><h3>Properties the other party must act on</h3><ul><li>Named provider and consumer roles</li><li>Named interaction and purpose</li><li>Only the bounded properties required at the connection layer</li><li>Connection duration and connection-revocation terms</li><li>Required provenance / attributable reference when the interaction needs it</li><li>For AVP presentation: the Passport is carried opaque; only its digest is lifted out when a receipt must bind back to it</li></ul></article>
    <article className="negative"><small>NEGATIVE SPACE</small><h3>Absence is the mechanism</h3><p>The Description states the boundary in words. The property set enforces it by omission: if the connection layer must not carry something, there is no property for it.</p><ul><li>No local constitution property</li><li>No local lease property</li><li>No local capsule property</li><li>No effect / actuation property that could silently convey execution permission</li><li>No property that creates Applicable Authority or Established Standing locally</li><li>No exclusion field that pretends the connection layer decides the local consequence</li></ul></article>
   </div>
  </section>

  <section className="avp">
   <p className="eyebrow">WHERE AVP FITS</p><h2>CNS/CP establishes the relationship.<br/><em>The Passport remains a TA-14 object.</em></h2>
   <p className="sectionLead">AVP does not define how two independent domains come to have a relationship. That is the connection seam. Once a Passport is presented across that seam, CNS/CP does not open it and reinterpret its internal authority claims. The Passport stays opaque; the connection exposes only what the other party must act on, including a digest when a receipt must bind back to the presented Passport.</p>
   <div className="avpFlow"><div><small>CNS/CP</small><b>Establishes the connection and the bounded property contract</b></div><span>→</span><div><small>AFA + AVP</small><b>Passport is presented as attributable authority context; its internal content remains TA-14's object</b></div><span>→</span><div className="commit"><small>EABA + TA-14</small><b>From “Passport accepted” onward, the receiving domain performs its own local admissibility and execution-authority work</b></div></div>
   <div className="warning">A PASSPORT PRESENTED DIRECTLY TO AN EFFECTOR IS REJECTED · CONNECTION ≠ EXECUTION AUTHORITY</div>
  </section>

  <section>
   <p className="eyebrow">REVOCATION IS ITS OWN CONNECTION</p><h2>Passport presentation and revocation are related.<br/><em>They are not the same channel.</em></h2>
   <div className="spaceGrid">
    <article className="positive"><small>TA-14 EVENT</small><h3>Passport revocation</h3><p>A Passport revocation is a TA-14 lifecycle event carried across the dedicated revocation connection. The issuer sequence may advance even when no revocation event exists, allowing the receiver to confirm freshness.</p></article>
    <article className="negative"><small>CNS/CP POLICY</small><h3>Connection revocation</h3><p>Revoking the connection is CNS/CP policy and ends that channel. It does not itself revoke the Passport. Likewise, revoking the Passport does not by itself revoke the CNS/CP connection. Neither implies the other.</p></article>
   </div>
  </section>

  <section>
   <p className="eyebrow">PASSPORT LIFECYCLE ON A LIVE CONNECTION</p><h2>Renewal does not require a new connection.<br/><em>The property value changes.</em></h2>
   <p className="sectionLead">A renewed or superseded Passport is represented as a new value of the same Passport property on the same established connection. TA-14 lifecycle state changes; CNS/CP does not invent a new connection merely because the authority object has a new value.</p>
  </section>

  <section className="question">
   <p className="eyebrow">THE EXAMINATION QUESTION</p>
   <h2>Can the connection change without silently changing the execution-authority boundary?</h2>
   <p>If the same TA-14 receiving architecture can operate under different Connection Profiles while retaining the same local consequence rule, the seam becomes observable rather than rhetorical.</p>
   <div className="canon"><small>TA-14 LOCAL COMMIT QUESTION</small><b>Does this proposed consequence have sufficient <em>Admissible Evidence</em>, <em>Applicable Authority</em>, and <em>Established Standing</em> to become reality <em>NOW?</em></b></div>
  </section>

  <section>
   <p className="eyebrow">PROPOSED FREEZE SEQUENCE</p><h2>Correct the seam first.<br/><em>Then freeze the test.</em></h2>
   <div className="steps">
    <article><span>01</span><b>INSPECT</b><p>CNS/CP author reviews this representation and corrects anything attributed incorrectly.</p></article>
    <article><span>02</span><b>DRAFT</b><p>Construct CP-01 READ and CP-02 COMMAND so each property exists only where the other party must act on it at the connection layer; state the boundary in the Description and enforce negative space through absent properties.</p></article>
    <article><span>03</span><b>FREEZE</b><p>Freeze the Profiles only after the interaction boundary is mutually intelligible.</p></article>
    <article><span>04</span><b>RUN</b><p>Change declaration, connection, revocation and context while Profiles remain fixed.</p></article>
    <article><span>05</span><b>OBSERVE</b><p>Record whether the receiving domain retains an independent consequence decision.</p></article>
   </div>
  </section>

  <section className="boundary"><div><small>PUBLIC-RECORD BOUNDARY</small><b>Examination surface — not adoption.</b></div><p>This page is a proposed technical model derived from the ongoing Monday Live / ONUMA / CNS/CP / TA-14 discussion. It is intentionally marked DRAFT / NOT FROZEN / NOT REGISTERED. Anto Budiardjo's September 24 CNS/CP review has been incorporated into the connection-layer representation shown here, including opaque Passport carriage, digest binding, negative space by absent properties, a separate revocation connection, and same-connection Passport lifecycle updates. Nothing here claims endorsement, adoption, operational approval, emergency procedure, approval of CP-01 or CP-02, a frozen examination, or agreement by Padi, CNS/CP, ONUMA, ALN, NIST, ASHRAE, a responder, or a public authority.</p></section>
  <footer>TA-14 AUTHORITY · THE GOVERNED CROSSING<br/><b>NAME THE INTERACTION · FREEZE THE CONTRACT · CHANGE THE SITUATION · RUN THE TEST</b></footer>
 </div><style>{`
 .p{min-height:100vh;background:radial-gradient(circle at 82% 3%,#0e4160 0,transparent 26%),radial-gradient(circle at 0 36%,#182a50 0,transparent 23%),#02070b;color:#f1f7fa;font-family:Inter,Arial,sans-serif}.p *{box-sizing:border-box}.shell{max-width:1220px;margin:auto;padding:0 28px}nav{height:76px;display:flex;align-items:center;gap:26px;border-bottom:1px solid #ffffff16;font-size:9px;font-weight:900;letter-spacing:.14em}nav a{color:#8da4b1;text-decoration:none}.brand{margin-right:auto;font-size:14px!important}.brand b,.eyebrow,.kicker{color:#65ddff}header{padding:92px 0 78px}.kicker,.eyebrow{font-size:10px;font-weight:950;letter-spacing:.19em}.status{display:flex;gap:7px;flex-wrap:wrap;margin:17px 0 24px}.status span{padding:7px 9px;border:1px solid #ffcf6045;border-radius:999px;color:#ffdb82;font-size:8px;font-weight:950;letter-spacing:.1em;background:#ffcf6008}h1{font-size:clamp(64px,10vw,132px);line-height:.77;letter-spacing:-.075em;margin:30px 0 38px}h1 em{font-style:normal;color:#ffcf60}.dek{max-width:980px;font-size:clamp(20px,2.5vw,30px);line-height:1.5;color:#b8c9d2}.dek strong{color:#fff}.thesis{margin-top:38px;padding:26px 28px;border-left:5px solid #ffcf60;background:linear-gradient(90deg,#ffcf6012,transparent)}.thesis small{display:block;color:#ffcf60;font-size:9px;font-weight:950;letter-spacing:.16em}.thesis b{display:block;max-width:1000px;margin-top:10px;font-size:clamp(21px,2.6vw,32px);line-height:1.4}section{padding:76px 0;border-top:1px solid #ffffff11}h2{font-size:clamp(37px,5.3vw,66px);line-height:1.01;letter-spacing:-.05em;margin:12px 0 32px;max-width:1080px}h2 em{font-style:normal;color:#ffcf60}.sectionLead{font-size:18px;color:#9db1bc;max-width:850px;line-height:1.65}.contrast,.profileGrid,.spaceGrid{display:grid;grid-template-columns:1fr 1fr;gap:13px}.contrast article,.profileGrid article,.spaceGrid article{padding:28px;border-radius:19px;border:1px solid #ffffff16;background:#07131c}.contrast span{font-size:32px}.contrast .no span{color:#758792}.contrast .yes{border-color:#65ddff45;background:linear-gradient(145deg,#07131c,#06202b)}.contrast .yes span{color:#65ddff}.contrast small,.spaceGrid small{display:block;margin-top:16px;font-size:9px;font-weight:950;letter-spacing:.14em;color:#8198a5}.contrast h3{font-size:23px;line-height:1.3}.contrast p,.spaceGrid li{color:#a7bac4;line-height:1.65}.layers{margin-top:34px}.layerRow{position:relative;display:grid;grid-template-columns:80px 220px 1fr 220px;align-items:center;gap:18px;padding:20px 0;border-bottom:1px solid #ffffff10}.num{font:34px Georgia,serif;color:#ffcf60}.owner small{display:block;color:#718996;font-size:8px;font-weight:950;letter-spacing:.13em}.owner b{display:block;margin-top:5px;font-size:15px}.question{font-size:17px;color:#c8d5dc}.badge{justify-self:end;padding:8px 10px;border:1px solid #65ddff2f;border-radius:999px;color:#86e6ff;font-size:8px;font-weight:950;letter-spacing:.1em}.down{display:none}.warning{text-align:center;margin-top:26px;padding:16px;border:1px solid #ffcf6030;color:#ffdf91;font-size:10px;font-weight:950;letter-spacing:.12em}.warning i{margin:0 12px;color:#526c79}.profiles{margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding-left:max(28px,calc((100vw - 1164px)/2));padding-right:max(28px,calc((100vw - 1164px)/2));background:linear-gradient(135deg,#07151e,#07101a)}.profileGrid article{border-color:#65ddff35}.phead{display:flex;justify-content:space-between;align-items:center}.phead span{color:#ffcf60;font:24px Georgia,serif}.phead small{color:#7e96a2;font-size:8px;font-weight:950;letter-spacing:.1em}.profileGrid h3{font-size:29px;margin:22px 0 8px}.profileGrid .big{font-size:18px;color:#dce7eb;min-height:55px}.profileGrid dl{margin:26px 0 0}.profileGrid dl div{padding:15px 0;border-top:1px solid #ffffff10}.profileGrid dt{color:#65ddff;font-size:8px;font-weight:950;letter-spacing:.12em}.profileGrid dd{margin:7px 0 0;color:#9eb1bb;line-height:1.55}.moves{display:grid;grid-template-columns:1fr auto 1fr;gap:15px;align-items:center;margin-top:14px;text-align:center}.moves div{padding:19px;border:1px solid #ffffff15;border-radius:13px}.moves small{display:block;color:#8096a1;font-size:8px;font-weight:950}.moves b{display:block;margin-top:5px;color:#ffcf60;font-size:22px}.moves>span{color:#718793;font:italic 17px Georgia,serif}.spaceGrid .positive{border-color:#65ddff35}.spaceGrid .negative{border-color:#ffcf6040}.spaceGrid .positive small{color:#65ddff}.spaceGrid .negative small{color:#ffcf60}.spaceGrid h3{font-size:27px;margin:9px 0}.spaceGrid ul{padding-left:20px}.spaceGrid li{margin:9px 0}.avpFlow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:stretch;gap:10px}.avpFlow div{padding:23px;border:1px solid #ffffff16;border-radius:15px;background:#07131c}.avpFlow span{align-self:center;color:#617a87}.avpFlow small{display:block;color:#65ddff;font-size:8px;font-weight:950;letter-spacing:.12em}.avpFlow b{display:block;margin-top:9px;line-height:1.5}.avpFlow .commit{border:2px solid #ffcf6055;background:#ffcf6009}.question{text-align:left}.question>p{max-width:900px;color:#a7bac4;font-size:18px;line-height:1.7}.canon{margin-top:30px;padding:28px;border:1px solid #ffcf6050;border-radius:17px;background:#ffcf6009}.canon small{display:block;color:#ffcf60;font-size:9px;font-weight:950;letter-spacing:.13em}.canon b{display:block;margin-top:10px;font-size:clamp(21px,3vw,34px);line-height:1.4}.canon em{font-style:normal;color:#fff0ad}.steps{display:grid;grid-template-columns:repeat(5,1fr);gap:9px}.steps article{padding:21px;border:1px solid #ffffff14;border-radius:14px;background:#07131c}.steps span{display:block;color:#ffcf60;font:27px Georgia,serif}.steps b{display:block;margin-top:14px;font-size:10px;letter-spacing:.11em;color:#70dfff}.steps p{color:#96aab5;font-size:12px;line-height:1.6}.boundary{display:grid;grid-template-columns:270px 1fr;gap:30px;padding:28px;margin:54px 0 0;border:1px solid #8b6d36;background:#15140e;border-radius:16px}.boundary small{display:block;color:#ffcf60;font-size:9px;font-weight:950;letter-spacing:.12em}.boundary b{display:block;margin-top:8px;font-size:21px}.boundary p{margin:0;color:#c2bcaf;line-height:1.65}footer{padding:52px 0 78px;color:#6f8793;font-size:9px;letter-spacing:.13em;line-height:2}footer b{color:#8ea4af}@media(max-width:900px){.layerRow{grid-template-columns:55px 180px 1fr}.badge{grid-column:2/4;justify-self:start}.steps{grid-template-columns:1fr 1fr}.avpFlow{grid-template-columns:1fr}.avpFlow>span{text-align:center;transform:rotate(90deg)}}@media(max-width:650px){.shell{padding:0 18px}nav{height:auto;padding:18px 0;flex-wrap:wrap}.contrast,.profileGrid,.spaceGrid{grid-template-columns:1fr}.layerRow{grid-template-columns:45px 1fr}.question,.badge{grid-column:2}.moves{grid-template-columns:1fr}.steps{grid-template-columns:1fr}.boundary{grid-template-columns:1fr}h1{font-size:59px;letter-spacing:-.05em}}
 `}</style></main>
}