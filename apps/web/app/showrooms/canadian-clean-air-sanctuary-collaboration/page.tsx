'use client';

import Link from 'next/link';
import Image from 'next/image';
import {useEffect,useRef,useState} from 'react';

const images = [
  'One Shared Public Purpose.png',
  'Building in Digital Context.png',
  'Asset Leadership Network_ Library Lifecycle Stewardship.png',
  'UnityNet Canada_ Clean Air Sanctuary.png',
  'Environmental Intelligence Dashboard.png',
  'TA-14 Execution Governance Infographic.png',
  'Independent Verification_ Public Library Outcomes.png',
  'Independent Organizations, Shared Purpose.png',
] as const;

const exhibits = [
  {
    title:'One Shared Public Purpose',
    subtitle:'A Canadian Clean Air Sanctuary',
    text:'A public library may be considered as a temporary refuge when wildfire smoke makes outdoor air hazardous. The shared question is not whether a building has impressive technology. It is whether an accountable owner can define a protective public service, operate it safely, and examine evidence of the outcome.',
    narration:'Exhibit one. Begin with people and a public purpose. A Canadian library is being considered as a clean-air sanctuary during a hypothetical wildfire smoke event. ONUMA, Asset Leadership Network, UnityNet International Canada, TA-14, the building owner, and prospective municipal and academic participants contribute different forms of expertise. None of those organizations automatically inherits another organization’s authority. The owner must establish the intended service, accessibility, operational limits and what would count as an acceptable outcome. This image illustrates a proposed demonstration. It does not depict a real operational sanctuary.',
    takeaway:'The owner and community define the public purpose before technology is selected.',
  },
  {
    title:'ONUMA — The Building in Digital Context',
    subtitle:'Connected building information for informed decisions',
    text:'ONUMA, represented in the proposed collaboration by Kimon Onuma and Yong Ku Kim, contributes building-information expertise: spatial and asset context, system relationships, equipment representation and connected digital building intelligence. Specific interfaces and data availability require ONUMA confirmation.',
    narration:'Exhibit two. Kimon Onuma, Yong Ku Kim, and ONUMA contribute the building information context. A digital model can describe the library’s spaces, ventilation equipment, filtration assets, outdoor-air intakes and relationships among building systems. The point is to connect environmental observations and proposed interventions to the equipment and spaces they actually concern. Building information supports decisions, but it does not authorize them. The owner retains operating authority, while every technical integration must be independently agreed and tested.',
    takeaway:'A digital building model provides context; it does not itself grant permission to operate.',
  },
  {
    title:'Asset Leadership Network — Stewardship Across the Lifecycle',
    subtitle:'Owner objectives, risk and durable public value',
    text:'Mike Bordenaro and the Asset Leadership Network contribute an owner-focused asset-stewardship perspective: the facility’s service objectives, lifecycle reliability, risks, maintenance obligations, resource decisions and ISO 55000-aligned asset management. ALN does not replace an owner’s legal or operational authority.',
    narration:'Exhibit three. Mike Bordenaro and the Asset Leadership Network help ask whether today’s sanctuary decision remains responsible over the life of the asset. A single filtration adjustment is not a full service plan. Owners also need maintenance, reliability, staffing, cost stewardship, performance expectations and a clear basis for deciding whether to continue, adapt or stop the service. Asset stewardship connects the technical demonstration to accountable long-term public value. This proposed contribution must be confirmed in an agreed scope.',
    takeaway:'A credible refuge must be maintained, resourced and governed beyond a one-day demonstration.',
  },
  {
    title:'UnityNet International Canada — Community Stewardship & Public Trust',
    subtitle:'People, place and responsible participation',
    text:'Lloyd Helferty contributes as a proposed community/public-service program contributor through UnityNet International Canada (UNIC), not as an owner-program lead. UNIC may support local needs assessment, ethical stewardship, inclusive access, consent conditions and exploratory Canadian coordination. Energime Institute is not a participating organization in this project. Municipalities, universities and other institutions are prospective until they expressly agree.',
    narration:'Exhibit four. Lloyd Helferty and UnityNet International Canada bring the human and community perspective. A sanctuary must be accessible and understandable to the people expected to depend on it. Whose needs are heard? Who establishes operating hours, capacity and accessible entry? What happens when the site cannot safely provide its declared service? Community-defined needs and consent conditions should receive a distinct community-stewardship review before the proposed service is approved. That review informs the owner-program requirements but does not transfer the legal duties of the facility owner, operator or qualified professionals. Municipal and academic relationships shown here are exploratory, not approvals or endorsements.',
    takeaway:'Community-stewardship review informs consent and service requirements; it never substitutes for lawful facility-owner authorization.',
  },
  {
    title:'Environmental Intelligence — Measure, Analyze & Recommend',
    subtitle:'Observed conditions inform bounded options',
    text:'Independent sensors, building systems and qualified analysts provide indoor and outdoor observations, equipment state and a bounded assessment of trade-offs. Occupancy, CO₂ trends and equipment constraints describe operational context; they do not establish an actor’s authority or standing. AI may recommend filtration or ventilation options, but its recommendation is advisory. The numbers displayed in the illustration are synthetic, not field measurements.',
    narration:'Exhibit five. Environmental intelligence begins by measuring conditions with appropriate instrument identity, calibration or qualification, timestamps, uncertainty and operating context. During a hypothetical smoke event, a system may observe outdoor fine particles, indoor particles, carbon dioxide, temperature and humidity. Analysts or artificial intelligence can compare possible interventions, including filtration and ventilation changes. A recommendation is useful evidence for an accountable decision. It is not authorization to actuate a building system. No sensor vendor, AI provider or installed control integration is represented as confirmed.',
    takeaway:'Measurement and recommendation inform the decision; neither automatically authorizes execution.',
  },
  {
    title:'TA-14 — The Execution Governance Boundary',
    subtitle:'Evidence, authority and standing before consequence',
    text:'TA-14 contributes Admissible Execution Architecture (AEA), Atmospheric Integrity Records (AIR) and Environmental Integrity Governance (EIG). At a proposed execution boundary, AEA examines admissible evidence, applicable authority and established standing, returning ALLOW, HOLD, DENY or ESCALATE within owner-approved rules and safety constraints. Established standing concerns whether the identified actor or system is legitimately entitled to request or execute this particular action at this time; occupancy, CO₂ and equipment constraints are contextual evidence, not standing.',
    narration:'Exhibit six. TA-14 contributes a distinct execution-governance architecture. Imagine an AI recommendation to increase outdoor air while wildfire smoke is severe. Before that discretionary command is allowed, AEA examines whether the evidence is admissible, the authority applies, and the identified actor or system has standing for this particular consequence now. Occupancy and CO₂ observations can inform admissibility and operating constraints, but do not confer standing. The decision may be allow, hold, deny or escalate. Missing mandatory evidence may justify hold. A prohibited or unsafe action may be denied. An unresolved authority question may be escalated. Atmospheric Integrity Records preserve attributable observations and Environmental Integrity Governance examines environmental trade-offs. This is a proposed interface, not a live installed safety controller, and independent emergency systems retain their authority.',
    takeaway:'Prediction is not permission. A proposed consequence requires a justified, accountable decision.',
  },
  {
    title:'Independent Verification — What Actually Happened?',
    subtitle:'Separate the command, response, environment and protection claims',
    text:'Independent examination distinguishes four claims: a decision was authorized, equipment actually responded, measured environmental conditions changed, and declared occupant-protection criteria were met. Every claim requires its own evidence and limitations. The illustrated PM2.5 change from 42 to 12 micrograms per cubic metre is fictional.',
    narration:'Exhibit seven. The collaboration must not confuse a successful command with public protection. First, was the proposed intervention authorized? Second, did the building equipment actually respond? Third, did indoor environmental conditions change under comparable, quality-checked observations? Fourth, did the owner’s predeclared occupant protection criteria hold, without unacceptable competing harms? Independent reviewers examine data completeness, calibration, uncertainty, possible adverse effects and the limits of the claims. The particle reduction in this image is illustrative, not a measured finding, and no individual health benefit has been established.',
    takeaway:'Four different claims require four separately examinable evidence paths.',
  },
  {
    title:'Independent Organizations. One Shared Public-Service Outcome.',
    subtitle:'Complementary expertise, independent responsibilities',
    text:'The proposed demonstration combines ONUMA building intelligence, ALN lifecycle stewardship, UnityNet community coordination, TA-14 governance, the owner’s public-service authority, and prospective municipal or academic input. The shared outcome is a testable public-service model, not a claim of an operating or field-validated sanctuary.',
    narration:'Exhibit eight. Return to the shared purpose. Kimon Onuma and Yong Ku Kim contribute ONUMA’s digital building intelligence. Mike Bordenaro and Asset Leadership Network contribute stewardship and owner-facing lifecycle thinking. Lloyd Helferty and UnityNet International Canada contribute proposed community/public-service programming, stewardship review and local coordination, without claiming owner authority. TA-14 contributes evidence and execution governance. The building owner alone establishes the legitimate service intent and operating authority within applicable law. Municipal and academic participants may choose to contribute later, but their participation is not confirmed. A responsible next step is a bounded owner-authorized discovery and simulation with community-stewardship review, agreed interfaces, evaluation criteria and independent review. Independent architectures. Shared purpose. Accountable outcomes.',
    takeaway:'The work becomes credible when each independent responsibility and the resulting evidence can be examined.',
  },
] as const;

const learningBridges = [
  { learned:'You learned that a Clean Air Sanctuary begins with an owner-defined public-service promise. The purpose, eligible users and acceptance criteria must be established before any technology can claim success.', next:'You are about to learn how ONUMA can give that public purpose a grounded digital representation of the building, its spaces and its equipment.' },
  { learned:'You learned that ONUMA can connect proposed decisions to building spaces, systems and assets. Digital context improves understanding but never substitutes for the owner\'s authorization.', next:'You are about to learn why Asset Leadership Network examines reliability, resources and lifecycle stewardship rather than treating one intervention as the whole solution.' },
  { learned:'You learned that asset stewardship asks whether the sanctuary can be operated, maintained and supported responsibly over time—not just demonstrated once.', next:'You are about to learn how UnityNet International Canada brings community needs, accessibility and public trust into the proposed collaboration.' },
  { learned:'You learned that UNIC contributes community/public-service programming and a distinct stewardship review, while operational authority remains with the legitimate building owner. Prospective partners are not automatically confirmed participants.', next:'You are about to learn how environmental measurements, equipment state and AI analysis can inform bounded recommendations without becoming permission to act.' },
  { learned:'You learned that occupancy, CO₂ trends and equipment constraints are contextual evidence, not the standing of an authorized actor. Attributable environmental evidence and analysis can support a proposed response. Synthetic dashboard values are teaching examples, and an AI recommendation is not an execution authorization.', next:'You are about to learn how TA-14 examines admissible evidence, applicable authority and established standing at the execution boundary.' },
  { learned:'You learned that TA-14\'s proposed execution gate distinguishes ALLOW, HOLD, DENY and ESCALATE for a specific consequence. Safety systems and lawful owner authority remain independently protected.', next:'You are about to learn how independent verification separates an authorized decision, equipment response, environmental change and demonstrated public-service performance.' },
  { learned:'You learned that a command, an equipment response, a changed reading and a verified refuge outcome are four different claims. Each needs its own evidence and limitations.', next:'You are about to learn how ONUMA, ALN, UnityNet International Canada, TA-14 and the building owner could work together without collapsing their separate responsibilities.' },
  { learned:'You learned how independent organizations can contribute complementary capabilities while the owner retains operating authority and prospective participation remains unconfirmed.', next:'You are about to examine the bounded discovery, simulation, evidence and approvals that would be needed before anyone could responsibly propose a live pilot.' },
] as const;

const participantRoles = [
  ['ONUMA','Kimon Onuma · Yong Ku Kim','Digital building intelligence and asset context'],
  ['Asset Leadership Network','Mike Bordenaro','Lifecycle stewardship and owner objectives'],
  ['UnityNet International Canada','Lloyd Helferty','Community/public-service program contribution, stewardship review and Canadian coordination'],
  ['TA-14 Authority Governance Institution','Greggory Don Butler','Evidence integrity and execution governance'],
  ['Public building owner','To be confirmed','Legitimate service intent and operational authority'],
  ['Municipal & academic participants','Prospective only','Local requirements, research and independent examination'],
] as const;

const pdf = '/' + encodeURIComponent('Canadian_Clean_Air_Sanctuary_Collaborative_Integration_V3 (1).pdf');
const ink='#edf8fa', muted='#bfd1d9', cyan='#78e2e6', amber='#f4cf80';
const card={background:'#0b222c',border:'1px solid #2b5662',borderRadius:15} as const;

export default function CanadianCleanAirSanctuaryShowroom(){
  const [speaking,setSpeaking]=useState<number|null>(null);
  const [speechSupported,setSpeechSupported]=useState(true);
  const voice=useRef<SpeechSynthesisVoice|null>(null);
  const speechToken=useRef(0);

  useEffect(()=>{
    if(!('speechSynthesis' in window)){setSpeechSupported(false);return;}
    const selectVoice=()=>{
      const choices=window.speechSynthesis.getVoices();
      voice.current=choices.find(v=>/samantha/i.test(v.name))
        ||choices.find(v=>v.lang.startsWith('en')&&/ava|jenny|aria|zira/i.test(v.name))
        ||choices.find(v=>v.lang.startsWith('en'))
        ||null;
    };
    selectVoice();
    window.speechSynthesis.addEventListener('voiceschanged',selectVoice);
    return ()=>{speechToken.current++;window.speechSynthesis.cancel();window.speechSynthesis.removeEventListener('voiceschanged',selectVoice);};
  },[]);

  const toggleNarration=(index:number)=>{
    if(!speechSupported)return;
    const token=++speechToken.current;
    window.speechSynthesis.cancel();
    if(speaking===index){setSpeaking(null);return;}
    const utterance=new SpeechSynthesisUtterance(exhibits[index].narration);
    if(voice.current)utterance.voice=voice.current;
    utterance.lang='en-US';
    utterance.rate=.91;
    utterance.onend=()=>{if(speechToken.current===token)setSpeaking(null);};
    utterance.onerror=()=>{if(speechToken.current===token)setSpeaking(null);};
    window.speechSynthesis.speak(utterance);
    setSpeaking(index);
  };

  return <main style={{minHeight:'100vh',color:ink,background:'radial-gradient(ellipse at 55% 0%, #163744 0%,#071a25 40%,#030b13 100%)',fontFamily:'Arial,Helvetica,sans-serif'}}>
    <div style={{maxWidth:1240,margin:'0 auto',padding:'0 22px 90px'}}>
      <nav style={{display:'flex',justifyContent:'space-between',gap:18,flexWrap:'wrap',padding:'24px 0',borderBottom:'1px solid #31505a',fontSize:13}}>
        <Link href="/showrooms" style={{color:cyan}}>← All showrooms</Link>
        <Link href="/showrooms/clean-air-sanctuary-owner-intent" style={{color:muted}}>Related owner-intent examination</Link>
      </nav>

      <header style={{padding:'72px 0 50px'}}>
        <p style={{letterSpacing:2.5,fontSize:12,fontWeight:800,color:cyan}}>PROPOSED CANADIAN COLLABORATIVE DEMONSTRATION · EIGHT EXHIBITS</p>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(39px,6vw,76px)',lineHeight:1.08,margin:'17px 0 20px',maxWidth:1040}}>Independent Organizations.<br/><span style={{color:'#a0e7e5'}}>One Shared Public-Service Outcome.</span></h1>
        <p style={{fontSize:'clamp(19px,2.4vw,26px)',maxWidth:980,lineHeight:1.55,color:muted}}>A Canadian Clean Air Sanctuary: how independent building expertise, asset stewardship, community participation and accountable decisions could support a public library during wildfire smoke.</p>
        <div style={{...card,maxWidth:1050,padding:'20px 24px',lineHeight:1.8,marginTop:25}}>
          <strong style={{color:amber}}>SCOPE AND STATUS · A PROPOSAL, NOT A DEPLOYMENT.</strong>
          <p style={{margin:'7px 0 0',color:muted}}>This independently developed TA-14 technical examination is not an ALN, PAE or UN-endorsed implementation. The library, decision scenarios, sensor values, performance illustrations and integrations are hypothetical. The named organizations have not jointly approved this exact showroom or signed the interfaces described here. Municipal, academic and building-owner participation remains prospective. No field-validated protection or public-health outcome is claimed.</p>
        </div>
        <div style={{display:'flex',gap:13,flexWrap:'wrap',marginTop:24}}>
          <a href="#exhibits" style={{display:'inline-block',padding:'14px 22px',background:'#7de4e7',color:'#06141a',fontWeight:900,textDecoration:'none',borderRadius:10}}>Explore all eight exhibits ↓</a>
          <a href={pdf} download style={{display:'inline-block',padding:'14px 22px',border:'1px solid #71cfd3',color:ink,fontWeight:800,textDecoration:'none',borderRadius:10}}>↓ Download collaborative integration V3 PDF</a>
        </div>
      </header>

      <section aria-label="Independent contributors" style={{margin:'0 0 55px'}}>
        <p style={{letterSpacing:2,color:cyan,fontSize:12,fontWeight:800}}>DISTINCT CONTRIBUTIONS · SHARED PUBLIC PURPOSE</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))',gap:14}}>
          {participantRoles.map(([org,people,role])=><div key={org} style={{...card,padding:20}}>
            <strong style={{fontSize:17}}>{org}</strong>
            <p style={{color:amber,margin:'7px 0',fontSize:14}}>{people}</p>
            <p style={{color:muted,lineHeight:1.6,margin:'0',fontSize:14}}>{role}</p>
          </div>)}
        </div>
      </section>

      <section id="exhibits" aria-label="Eight collaborative Clean Air Sanctuary exhibits">
        {exhibits.map((e,i)=><article key={e.title} id={'exhibit-'+(i+1)} style={{...card,marginBottom:38,overflow:'hidden'}}>
          <div style={{padding:'30px 30px 22px'}}>
            <p style={{fontSize:12,letterSpacing:2,color:cyan,fontWeight:900,margin:'0 0 11px'}}>EXHIBIT {String(i+1).padStart(2,'0')} / 08</p>
            <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(27px,3.3vw,44px)',lineHeight:1.17,margin:'0 0 9px'}}>{e.title}</h2>
            <p style={{fontSize:17,color:amber,margin:'0 0 16px'}}>{e.subtitle}</p>
            <p style={{fontSize:16,lineHeight:1.8,color:muted,maxWidth:1080,margin:0}}>{e.text}</p>
          </div>
          <div style={{position:'relative',width:'100%',aspectRatio:'16 / 9',background:'#07121a'}}>
            <Image src={'/'+encodeURIComponent(images[i])} alt={'Conceptual Clean Air Sanctuary Exhibit '+(i+1)+': '+e.title} fill priority={i===0} sizes="(max-width: 800px) 100vw, 1200px" style={{objectFit:'contain'}}/>
          </div>
          <div style={{padding:'23px 30px 29px'}}>
            <button type="button" disabled={!speechSupported} onClick={()=>toggleNarration(i)} aria-label={(speaking===i?'Stop':'Play')+' narration for exhibit '+(i+1)} style={{background:speaking===i?'#784039':'#17657a',border:'1px solid #80e7e5',color:'white',borderRadius:10,fontSize:15,fontWeight:800,padding:'13px 22px',cursor:speechSupported?'pointer':'not-allowed'}}>
              {speaking===i?'■ Stop narration':'▶ Play Samantha'}
            </button>
            <span style={{display:'inline-block',fontSize:12,color:muted,marginLeft:14,marginTop:9}}>On demand · Samantha if installed, otherwise an available English voice · no auto-scroll</span>
            {!speechSupported&&<p role="status">Speech playback is not supported in this browser. The complete narration is available below.</p>}
            <details style={{marginTop:19,paddingTop:15,borderTop:'1px solid #325965'}}>
              <summary style={{cursor:'pointer',color:cyan,fontWeight:700}}>Read full exhibit narration</summary>
              <p style={{maxWidth:1040,lineHeight:1.8,color:muted}}>{e.narration}</p>
            </details>
            <div aria-label={'Learning bridge after exhibit '+(i+1)} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:15,marginTop:23}}>
              <div style={{padding:'22px 23px',background:'#11363d',border:'1px solid #46848a',borderRadius:12}}>
                <h3 style={{fontSize:18,color:'#a8f1e7',margin:'0 0 12px'}}>What You Just Learned</h3>
                <p style={{lineHeight:1.75,color:ink,margin:0}}>{learningBridges[i].learned}</p>
              </div>
              <div style={{padding:'22px 23px',background:'#182b3e',border:'1px solid #47718b',borderRadius:12}}>
                <h3 style={{fontSize:18,color:'#b7dcff',margin:'0 0 12px'}}>What You're About to Learn</h3>
                <p style={{lineHeight:1.75,color:ink,margin:0}}>{learningBridges[i].next}</p>
              </div>
            </div>
          </div>
        </article>)}
      </section>

      <section style={{...card,padding:'26px 30px',marginTop:60}}>
        <p style={{letterSpacing:2,color:cyan,fontWeight:800,fontSize:12}}>FROM CONCEPT TO BOUNDED EXAMINATION</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(28px,4vw,43px)',margin:'12px 0'}}>What would justify a real pilot?</h2>
        <p style={{color:muted,lineHeight:1.8}}>An interested and authorized public owner; a defined refuge purpose and stop conditions; partner-confirmed roles and intellectual-property boundaries; owner-approved instruments, operating criteria and engineering safety case; read-only data validation before any actuation; independent evaluation; and transparent funding, procurement, staffing and long-term stewardship.</p>
        <p style={{color:muted,lineHeight:1.8}}>The next requested action is a scoped discovery and simulated demonstration—not live HVAC control, a health guarantee, municipal endorsement, or an assertion that the integrated system is field-validated. A separate extreme-heat resilience scenario may be examined later, but requires its own hazard analysis, engineering criteria, authorization and independent validation.</p>
        <a href={pdf} download style={{color:cyan,fontWeight:900}}>↓ Download the full eight-page collaborative technical PDF</a>
      </section>

      <footer style={{padding:'30px 0 0',marginTop:55,borderTop:'1px solid #365662',fontSize:13,color:muted,lineHeight:1.8}}>
        Canadian Clean Air Sanctuary · Independent architectures and responsibilities · Proposal for collaborative examination, November 2026. Names identify proposed technical and community roles, not an executed consortium contract or institutional endorsement. All illustration readings and outcomes are fictional.
      </footer>
    </div>
  </main>;
}
