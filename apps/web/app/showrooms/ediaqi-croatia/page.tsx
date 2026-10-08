const cards = [
  ["MONITOR","What is happening?","CO₂, particulate matter, temperature, humidity, VOCs, pressure, ventilation rates and other conditions can be observed continuously."],
  ["UNDERSTAND","What does it mean?","Engineering, analytics and AI can interpret those observations, identify risk and propose technically intelligent responses."],
  ["GOVERN","What may happen next?","Before a proposed response becomes physical consequence, evidence, authority and present standing still have to be established."]
];
const chain=["Reality","Record","Continuity","Admissibility","Binding","Commit","Execution","Outcome"];
const dispositions=[
  ["ALLOW","The evidence, authority and standing required for this consequence are established now."],
  ["HOLD","The system knows enough to know it does not yet know enough to act."],
  ["DENY","The proposed consequence is prohibited or cannot be justified."],
  ["ESCALATE","Human or higher authority is required before consequence."]
];

export default function EdiaqiCroatiaShowroom(){
return <main style={{fontFamily:"Arial,sans-serif",background:"#f3f7f8",color:"#10242d"}}>
<header style={{background:"radial-gradient(circle at 82% 15%,#0b6488 0,transparent 28%),linear-gradient(135deg,#021923,#06394e)",color:"#fff",padding:"78px 6vw 68px"}}>
<div style={{maxWidth:1160,margin:"auto"}}>
<p style={{fontWeight:950,letterSpacing:2,fontSize:11,color:"#6bddff"}}>🇭🇷 CROATIA · EDIAQI INDOOR AIR QUALITY CONFERENCE · ZAGREB · 29 SEP 2026</p>
<h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(48px,7vw,88px)",lineHeight:.94,letterSpacing:"-.045em",maxWidth:1050,margin:"18px 0 25px"}}>We are getting better at knowing what is in the air.<br/><span style={{color:"#9be9ff"}}>What governs what happens next?</span></h1>
<p style={{fontFamily:"Georgia,serif",fontSize:21,lineHeight:1.65,maxWidth:900,color:"#d7e9ef"}}>A public companion surface to Greggory Don Butler's seven-minute EDIAQI presentation on continuous monitoring, indoor air quality and the consequence boundary.</p>
<p style={{fontSize:10,fontWeight:950,letterSpacing:1.4,marginTop:28}}>INDEPENDENT TA-14 CONFERENCE SURFACE · NOT AN EDIAQI ENDORSEMENT · OPEN FOR CORRECTION</p>
</div></header>

<section style={{padding:"70px 6vw",maxWidth:1160,margin:"auto"}}>
<p style={{fontWeight:950,letterSpacing:2,fontSize:10,color:"#08799f"}}>01 · START WHERE IAQ STARTS</p>
<h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(38px,5vw,62px)",lineHeight:1.02,letterSpacing:"-.04em",maxWidth:950}}>Sensors. Dashboards. Thresholds. Analytics. Artificial intelligence.</h2>
<p style={{fontFamily:"Georgia,serif",fontSize:19,lineHeight:1.75,maxWidth:900}}>Indoor air quality has become increasingly capable of observing reality. We can measure CO₂, particulate matter, temperature, humidity, VOCs, pressure and ventilation. We can trend those measurements continuously, establish thresholds, generate alarms and use analytics or AI to interpret what they mean.</p>
<div style={{margin:"38px 0",padding:"30px",background:"#fff",borderLeft:"6px solid #087ba3",fontFamily:"Georgia,serif",fontSize:"clamp(26px,3vw,38px)",lineHeight:1.4}}><strong>All of that matters.</strong><br/>But then comes a different question:<br/><strong style={{color:"#075d7b"}}>What happens next?</strong></div>
</section>

<section style={{padding:"70px 6vw",background:"#dff4fb"}}>
<div style={{maxWidth:1160,margin:"auto"}}>
<p style={{fontWeight:950,letterSpacing:2,fontSize:10,color:"#08799f"}}>02 · CONTINUOUS MONITORING</p>
<h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(38px,5vw,62px)",lineHeight:1.02,letterSpacing:"-.04em",maxWidth:980}}>Continuous monitoring is necessary to govern air. It is not everything necessary to govern air.</h2>
<p style={{fontFamily:"Georgia,serif",fontSize:19,lineHeight:1.75,maxWidth:900}}>Air changes continuously. Occupancy changes. Outdoor conditions change. Equipment performance changes. Filtration changes. Pressure relationships change. Building use changes. A single inspection or commissioning event cannot establish every present condition.</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:14,marginTop:34}}>{cards.map(([a,b,c])=><article key={a} style={{background:"#fff",padding:27,border:"1px solid #c8dde5"}}><small style={{fontWeight:950,color:"#08799f",letterSpacing:1.4}}>{a}</small><h3 style={{fontFamily:"Georgia,serif",fontSize:28}}>{b}</h3><p style={{lineHeight:1.7,color:"#52666e"}}>{c}</p></article>)}</div>
<div style={{marginTop:30,padding:28,background:"#062b3a",color:"#fff",fontFamily:"Georgia,serif",fontSize:28,lineHeight:1.45}}>Continuous monitoring can tell us <strong>what is happening.</strong><br/>It does not, by itself, establish <strong>what is authorized to happen next.</strong></div>
</div></section>

<section style={{padding:"70px 6vw",maxWidth:1160,margin:"auto"}}>
<p style={{fontWeight:950,letterSpacing:2,fontSize:10,color:"#08799f"}}>03 · THE CLASSROOM</p>
<h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(38px,5vw,62px)",lineHeight:1.02,letterSpacing:"-.04em"}}>The data can be true. The recommendation can be intelligent. Permission is still a separate question.</h2>
<div style={{background:"#fff",border:"1px solid #d1e0e5",padding:32,marginTop:30}}>
<p style={{fontSize:17,lineHeight:1.8}}>A classroom sensor reports elevated CO₂. The measurement may be perfectly accurate. Analytics may correctly determine that ventilation should increase. An AI system may even calculate exactly how much additional outdoor air is required.</p>
<p style={{fontFamily:"Georgia,serif",fontSize:31,lineHeight:1.4,color:"#075d7b"}}><strong>But may this system actually change the building right now?</strong></p>
<p style={{fontSize:17,lineHeight:1.8}}>Measurement and authority are not the same thing. Technical intelligence and permission are not the same thing. This is the boundary TA-14 examines.</p>
</div></section>

<section style={{padding:"72px 6vw",background:"#061c26",color:"#fff"}}>
<div style={{maxWidth:1160,margin:"auto"}}>
<p style={{fontWeight:950,letterSpacing:2,fontSize:10,color:"#68dcff"}}>04 · THE WORD IS NOW</p>
<h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(40px,5vw,66px)",lineHeight:1.02,letterSpacing:"-.04em",maxWidth:1000}}>Commissioned once does not mean authorized forever.</h2>
<p style={{fontFamily:"Georgia,serif",fontSize:19,lineHeight:1.75,maxWidth:900,color:"#bed2da"}}>A measurement taken yesterday may be true. A commissioning report from six months ago may be valid. A sensor may have been calibrated. A control sequence may have been approved. The building may have been operating correctly an hour ago. The question at the moment of consequence is whether the evidence, authority and standing necessary for this particular action still exist.</p>
<div style={{marginTop:35,padding:34,border:"1px solid #376174",background:"#0b2a37",fontFamily:"Georgia,serif",fontSize:"clamp(25px,3vw,38px)",lineHeight:1.45}}>Does this proposed consequence have sufficient <strong style={{color:"#8de7ff"}}>Admissible Evidence, Applicable Authority, and Established Standing</strong> to become reality <strong style={{color:"#8de7ff"}}>NOW?</strong></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(105px,1fr))",gap:6,marginTop:28}}>{chain.map((x,i)=><div key={x} style={{padding:"16px 8px",textAlign:"center",border:"1px solid #315365",background:i===5?"#12475c":"#0a2936",fontSize:10,fontWeight:900}}>{x}</div>)}</div>
</div></section>

<section style={{padding:"70px 6vw",maxWidth:1160,margin:"auto"}}>
<p style={{fontWeight:950,letterSpacing:2,fontSize:10,color:"#08799f"}}>05 · THE CHAIN IS ALLOWED TO STOP</p>
<h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(38px,5vw,62px)",lineHeight:1.02,letterSpacing:"-.04em"}}>HOLD is not necessarily failure. It can be intelligence with restraint.</h2>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginTop:30}}>{dispositions.map(([a,b])=><article key={a} style={{background:"#fff",border:"1px solid #d2e0e5",padding:25}}><h3 style={{fontSize:14,letterSpacing:1.5,color:"#08799f"}}>{a}</h3><p style={{lineHeight:1.7}}>{b}</p></article>)}</div>
</section>

<section style={{padding:"70px 6vw",background:"#dff4fb"}}>
<div style={{maxWidth:1160,margin:"auto"}}>
<p style={{fontWeight:950,letterSpacing:2,fontSize:10,color:"#08799f"}}>06 · WILDFIRE TEST</p>
<h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(38px,5vw,62px)",lineHeight:1.02,letterSpacing:"-.04em"}}>The sensor can be right and the proposed action can still be wrong.</h2>
<div style={{background:"#fff",padding:32,border:"1px solid #c8dde5",marginTop:30}}>
<p style={{fontSize:17,lineHeight:1.8}}>Particulate matter rises dramatically inside a school. Opening outdoor-air dampers appears to be the obvious response. But outdoor monitoring simultaneously shows wildfire smoke.</p>
<p style={{fontSize:17,lineHeight:1.8}}>The indoor measurement can be correct. The outdoor measurement can be correct. The control logic can be correct. The equipment can be functioning correctly.</p>
<p style={{fontFamily:"Georgia,serif",fontSize:30,lineHeight:1.4,color:"#075d7b"}}><strong>And increasing outdoor air can still be the wrong consequence.</strong></p>
<p style={{fontSize:17,lineHeight:1.8}}><strong>The question is not simply: “Is the data true?”</strong><br/>It is: “Is this evidence sufficient for this consequence, under these conditions, at this moment?”</p>
</div></div></section>

<section style={{padding:"70px 6vw",maxWidth:1160,margin:"auto"}}>
<p style={{fontWeight:950,letterSpacing:2,fontSize:10,color:"#08799f"}}>07 · AUTHORITY</p>
<h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(38px,5vw,62px)",lineHeight:1.02,letterSpacing:"-.04em"}}>Capability ≠ Authority. Understanding ≠ Permission.</h2>
<p style={{fontFamily:"Georgia,serif",fontSize:19,lineHeight:1.75,maxWidth:900}}>A sensor does not have authority because it measured something. An AI does not acquire authority because its recommendation is intelligent. A building-management system does not acquire unlimited authority because it can move a damper, start a fan, change a setpoint, unlock a door or shut down equipment.</p>
<div style={{marginTop:32,padding:30,background:"#fff",borderLeft:"6px solid #087ba3",fontFamily:"Georgia,serif",fontSize:28,lineHeight:1.45}}>The future of indoor air quality is not simply better sensing.<br/><strong>It is better governance of the distance between sensing and consequence.</strong></div>
</section>

<section style={{padding:"70px 6vw",background:"#061c26",color:"#fff"}}>
<div style={{maxWidth:1160,margin:"auto"}}>
<p style={{fontWeight:950,letterSpacing:2,fontSize:10,color:"#68dcff"}}>08 · CONNECTED BUILDINGS</p>
<h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(38px,5vw,62px)",lineHeight:1.02,letterSpacing:"-.04em"}}>Connection does not equal authority.</h2>
<p style={{fontFamily:"Georgia,serif",fontSize:19,lineHeight:1.75,maxWidth:900,color:"#bed2da"}}>A sensor manufacturer may provide evidence. An analytics company may interpret it. AI may recommend an action. A building owner may establish policy. A controls contractor may provide execution capability. A government or regulator may establish requirements. These systems need to communicate—but communication does not automatically transfer execution authority.</p>
<p style={{fontFamily:"Georgia,serif",fontSize:27,lineHeight:1.5}}>Evidence may travel. Credentials may travel. Authority context may travel. A determination may travel.<br/><strong style={{color:"#8de7ff"}}>Execution authority must still be established where the consequence will occur.</strong></p>
</div></section>

<section style={{padding:"76px 6vw",maxWidth:1160,margin:"auto"}}>
<p style={{fontWeight:950,letterSpacing:2,fontSize:10,color:"#08799f"}}>09 · THE FINISH LINE</p>
<h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(40px,5vw,66px)",lineHeight:1.02,letterSpacing:"-.04em"}}>The next generation of intelligent buildings needs to prove why a physical consequence was permitted before that consequence becomes reality.</h2>
<p style={{fontFamily:"Georgia,serif",fontSize:20,lineHeight:1.75,maxWidth:920}}>Not afterward in an audit. Not because somebody trusted the software. Not because an AI was confident. Not simply because the equipment could do it. At the actual boundary of execution.</p>
<div style={{margin:"38px 0",padding:34,background:"#062b3a",color:"#fff",fontFamily:"Georgia,serif",fontSize:29,lineHeight:1.5}}><strong>Continuous monitoring helps us know what is happening.</strong><br/><span style={{color:"#8de7ff"}}>Governance determines what may legitimately happen next.</span></div>
<p style={{fontFamily:"Georgia,serif",fontSize:24,lineHeight:1.55}}><strong>The most important measurement is not simply what the building knows.</strong><br/>It is whether what the building does next is justified.</p>
<div style={{marginTop:45,padding:24,background:"#fff",border:"1px solid #d2e0e5",fontSize:13,lineHeight:1.75,color:"#455c65"}}><strong>Disclosure boundary.</strong> This is an independent TA-14 public conference surface prepared in connection with Greggory Don Butler's selected remote oral presentation at the EDIAQI Indoor Air Quality Conference in Zagreb on 29 September 2026. It does not state or imply that EDIAQI, its organisers, speakers, participants, funders or partner institutions have adopted, validated or endorsed TA-14. Conference-related factual corrections are welcomed. This surface is intended to remain as the pre-presentation record and may be extended downward after the conference with questions, corrections, responses and subsequent examination material.</div>
</section>
<section style={{padding:"76px 6vw",background:"#eef7fa",borderTop:"1px solid #c9dce4"}}>
<div style={{maxWidth:1160,margin:"auto"}}>
<p style={{fontWeight:950,letterSpacing:2,fontSize:10,color:"#08799f"}}>10 · PRESENTATION RECORD · 29 SEP 2026</p>
<h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(40px,5vw,66px)",lineHeight:1.02,letterSpacing:"-.04em",maxWidth:980}}>Presentation delivered. Public surface preserved. The record remains open.</h2>
<p style={{fontFamily:"Georgia,serif",fontSize:19,lineHeight:1.75,maxWidth:920}}>Greggory Don Butler delivered the remote oral presentation to the EDIAQI Indoor Air Quality Conference in Zagreb using this public showroom as the live presentation surface. The screen was shared in Microsoft Teams and the showroom was scrolled in sequence with the spoken presentation so the visual record and oral argument remained aligned.</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginTop:30}}>
<article style={{background:"#fff",border:"1px solid #d2e0e5",padding:25}}><small style={{fontWeight:950,color:"#08799f",letterSpacing:1.4}}>DELIVERY</small><h3 style={{fontFamily:"Georgia,serif",fontSize:27}}>Completed live</h3><p style={{lineHeight:1.7,color:"#52666e"}}>The full seven-minute presentation was delivered remotely on 29 September 2026.</p></article>
<article style={{background:"#fff",border:"1px solid #d2e0e5",padding:25}}><small style={{fontWeight:950,color:"#08799f",letterSpacing:1.4}}>PRESENTATION SURFACE</small><h3 style={{fontFamily:"Georgia,serif",fontSize:27}}>This showroom was used live</h3><p style={{lineHeight:1.7,color:"#52666e"}}>The public page itself served as the visual presentation surface while the argument was delivered and scrolled in sequence.</p></article>
<article style={{background:"#fff",border:"1px solid #d2e0e5",padding:25}}><small style={{fontWeight:950,color:"#08799f",letterSpacing:1.4}}>Q&A</small><h3 style={{fontFamily:"Georgia,serif",fontSize:27}}>Questions raised: 0</h3><p style={{lineHeight:1.7,color:"#52666e"}}>No audience questions were raised during the allotted question period. This records the event as it occurred; it does not infer why no questions were asked.</p></article>
</div>
<div style={{marginTop:34,padding:32,background:"#062b3a",color:"#fff"}}>
<p style={{fontWeight:950,letterSpacing:1.6,fontSize:10,color:"#6bddff"}}>THE RECORD REMAINS OPEN</p>
<p style={{fontFamily:"Georgia,serif",fontSize:27,lineHeight:1.5,marginBottom:0}}>Questions, corrections, technical challenges, equivalent mechanisms and examination requests may be added below this preserved presentation record as they arise.</p>
</div>
<div style={{marginTop:28,padding:24,background:"#fff",border:"1px solid #d2e0e5",fontSize:13,lineHeight:1.75,color:"#455c65"}}><strong>Preservation rule.</strong> The material above remains the public presentation surface used for the conference. Post-presentation developments are appended beneath it rather than rewriting the record of what was presented.</div>
</div></section>

<section style={{padding:"76px 6vw",background:"#fff",borderTop:"1px solid #c9dce4"}}>
<div style={{maxWidth:1160,margin:"auto"}}>
<p style={{fontWeight:950,letterSpacing:2,fontSize:10,color:"#08799f"}}>11 · INDEPENDENT CONFERENCE DOCUMENT · 8 OCT 2026</p>
<h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(38px,5vw,62px)",lineHeight:1.05,letterSpacing:"-.04em"}}>Certificate of Presentation received.</h2>
<p style={{fontFamily:"Georgia,serif",fontSize:20,lineHeight:1.7,maxWidth:920}}>On 8 October 2026, the EDIAQI conference organizers sent Greggory Don Butler an official Certificate of Presentation recognizing delivery of an oral presentation at the EDIAQI Indoor Air Quality Conference, Zagreb, Croatia, on 29 September 2026.</p>
<div style={{border:"2px solid #b8d6e2",padding:"clamp(24px,5vw,54px)",background:"#f4fafc",maxWidth:820,margin:"34px auto",textAlign:"center"}}>
<p style={{fontSize:12,letterSpacing:2,fontWeight:900,color:"#08799f"}}>EDIAQI · DOCUMENTED PRESENTATION RECOGNITION</p>
<h3 style={{fontFamily:"Georgia,serif",fontSize:"clamp(34px,5vw,54px)",margin:"20px 0"}}>Certificate of Presentation</h3>
<p style={{fontSize:23,fontWeight:800}}>Greggory Don Butler</p>
<p>TA-14 Authority / Transparent Air, United States</p>
<p style={{fontFamily:"Georgia,serif",fontSize:19,lineHeight:1.7}}>For delivering an oral presentation at the<br/><strong>EDIAQI Indoor Air Quality Conference</strong><br/>Zagreb, Croatia · 29 September 2026</p>
<p style={{fontSize:13,color:"#52666e"}}>Mario Lovrić · EDIAQI Scientific Coordinator</p>
<p style={{fontSize:11,color:"#52666e",marginTop:22}}>Transcribed details from the issued certificate; this panel is not a reproduction of the signed original PDF.</p>
</div>
<p style={{fontSize:16,lineHeight:1.8,maxWidth:920}}>The original PDF, titled “Greggory Don Butler.pdf”, is retained as the source document. This public panel records its verified wording; the original PDF is not yet hosted here for download.</p>
<div style={{padding:24,background:"#062b3a",color:"#fff",lineHeight:1.8,maxWidth:920}}><strong>Scope of recognition:</strong> The certificate confirms an oral presentation. It does not certify, validate, approve, or endorse TA14 governance architecture, its claims, or any implementation. The earlier presentation surface and its chronology remain unchanged.</div>
</div></section>
<footer style={{padding:"34px 6vw",background:"#02141c",color:"#8ca6b0",fontSize:10,letterSpacing:1,lineHeight:1.7}}><div style={{maxWidth:1160,margin:"auto"}}>🇭🇷 CROATIA · EDIAQI × TA-14 · PUBLIC CONFERENCE SURFACE · MONITORING → GOVERNANCE → CONSEQUENCE · NO ENDORSEMENT IMPLIED · TA-14 EXCHANGE</div></footer>
</main>;
}