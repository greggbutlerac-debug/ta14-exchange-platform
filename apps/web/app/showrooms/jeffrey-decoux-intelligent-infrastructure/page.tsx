import Link from 'next/link';
import Image from 'next/image';
import Samantha from '../epic-air-quality-fund/Samantha';
import AuthorityLab from './AuthorityLab';

export const metadata = {title:'Intelligent Infrastructure | Edge Attestation to Authorized Consequence | TA14', description:'Independent eight-image TA14 examination of AFA, EABA, federated authority context and local autonomous mobility execution boundaries.'};

const images = [
  {
    "number": "01",
    "title": "The Intelligent District",
    "src": "/Intelligent District Autonomous Mobility Hub.png",
    "description": "Shared infrastructure creates overlapping jurisdictions, not a single universal authorization.",
    "script": "Section one: the intelligent district. People, autonomous ground systems, infrastructure operators, and air mobility share physical space. Their technical capabilities and permissions are not identical. We must ask who governs each particular movement and at what location and time."
  },
  {
    "number": "02",
    "title": "Edge Attestation",
    "src": "/Edge Attestation and Corridor Permission.png",
    "description": "An attested property is evidence within a defined scheme, not blanket permission to act.",
    "script": "Section two: edge attestation. A signed attestation may provide verifiable claims concerning component identity, software state, issuer, timestamp, scope and trust anchor. Its precise meaning depends on the actual attestation scheme. A valid claim does not itself confer corridor permission, local authority, or authorization to execute."
  },
  {
    "number": "03",
    "title": "Federated Authority Context",
    "src": "/Authority Context Across Boundaries.png",
    "description": "Authority context can cross entities; permission for execution must be established locally.",
    "script": "Section three: federated context. AFA permits evidence and authority context to travel across multiple entities while preserving provenance and limits. A corridor permission issued upstream does not automatically become a mandate for a local crossing. Execution authority must be established at the relevant local boundary."
  },
  {
    "number": "04",
    "title": "Conditions Change Before Action",
    "src": "/Autonomous Vehicle Decision at Crosswalk.png",
    "description": "A pedestrian and a local restriction change the decision conditions after corridor permission.",
    "script": "Section four: conditions change. At fourteen hundred hours the route was permitted. At fourteen hundred and eleven seconds a pedestrian enters and a local restriction becomes active. Even when the attestation and corridor claim remain valid, the proposed crossing needs to be re-evaluated against current observations and locally applicable authority."
  },
  {
    "number": "05",
    "title": "The Local Execution Boundary",
    "src": "/Local Execution Boundary_ Autonomous Vehicle Hold.png",
    "description": "Evidence, authority, standing and current conditions must bind to the exact action.",
    "script": "Section five: the local execution boundary. EABA asks whether this precise movement, at this crossing, at this moment, has sufficient admissible evidence, applicable authority, and established standing to become reality now. A current local restriction and unresolved conflict prevent assuming that earlier permission remains sufficient."
  },
  {
    "number": "06",
    "title": "Decision and Disposition",
    "src": "/Intelligent Infrastructure_ Local Decision Hold.png",
    "description": "HOLD is an auditable governance disposition, not a physical actuation command.",
    "script": "Section six: decision and disposition. The available options are ALLOW, HOLD, DENY, and ESCALATE. In this hypothetical, HOLD is recorded because renewed authority is insufficient while the crossing restriction is active. The decision record preserves the evidence, reason, issuer, timestamps, limitations and conditions for re-evaluation."
  },
  {
    "number": "07",
    "title": "Local Safety Enforcement",
    "src": "/Local Safety Enforcement Infographic.png",
    "description": "Independent vehicle controls remain responsible for physical safety.",
    "script": "Section seven: physical safety remains local. TA14 describes a governance disposition, not a braking command. The vehicle controller and safety systems independently manage sensing, obstacle avoidance and safe motion. A governance ALLOW must never bypass a safety interlock; a HOLD does not replace the vehicle's independent duty to behave safely."
  },
  {
    "number": "08",
    "title": "Observed Outcome and Continuity",
    "src": "/Autonomous Vehicle Governance Outcomes.png",
    "description": "Prove what happened from independently observed evidence, not merely from a log.",
    "script": "Section eight: observed outcome. Preserve the request, the decision, the controller acknowledgement, and independent observations of what physically occurred. A command or log is not proof of physical outcome. Preserve raw observations separately from interpretations. Future movement requires a fresh bounded evaluation, not an automatic restoration of permission."
  }
];
const pdf = '/TA14_Intelligent_Infrastructure_Execution_Boundary_Technical_Reference_v2.0%20(1).pdf';

export default function Page(){return <main style={{minHeight:'100vh',background:'#030c14',color:'#edf7ff',fontFamily:'Arial, sans-serif'}}><div style={{maxWidth:1180,margin:'auto',padding:'24px 20px 80px'}}>
<nav style={{display:'flex',gap:20,justifyContent:'space-between',flexWrap:'wrap',fontSize:13,paddingBottom:20,borderBottom:'1px solid #234454'}}><Link href='/showrooms/interoperability-systems' style={{color:'#79dff4'}}>← INTEROPERABILITY & SYSTEMS</Link><Link href='/showrooms' style={{color:'#79dff4'}}>ALL SHOWROOMS →</Link></nav>
<header style={{padding:'58px 0 35px'}}><p style={{color:'#6de5ea',fontWeight:800,letterSpacing:2,fontSize:11}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT TECHNICAL PRE-EXAMINATION</p><h1 style={{fontSize:'clamp(38px,6vw,70px)',lineHeight:1.08,letterSpacing:'-.035em',maxWidth:1030,margin:'18px 0'}}>Intelligent Infrastructure:<br/><span style={{color:'#83ddec'}}>From Edge Attestation to Authorized Physical Consequence</span></h1><p style={{color:'#bfd0dc',fontSize:20,lineHeight:1.65,maxWidth:980}}>An eight-image technical examination of federated authority context, local execution boundaries, autonomous mobility, and the distinction between permission and physical consequence.</p><p style={{fontSize:13,lineHeight:1.7,background:'#0e2131',padding:20,border:'1px solid #38536c',borderRadius:12,color:'#e1cd9e'}}>INDEPENDENT EDUCATIONAL DEMONSTRATION · BASELINE NOT FROZEN · NO FORMAL DISPOSITION. All scenarios, records, identities and timestamps are hypothetical. No affiliation, participation, technical integration, approval or endorsement by Jeffrey DeCoux, Autonomy Institute, or other entities is claimed.</p><a href={pdf} download style={{display:'inline-block',background:'#7ee8d2',color:'#06202e',padding:'15px 21px',marginTop:18,borderRadius:9,fontWeight:800,textDecoration:'none'}}>↓ DOWNLOAD TECHNICAL GOVERNANCE REFERENCE v2.0 (PDF)</a></header>
<section style={{padding:'26px 0 46px',borderTop:'1px solid #294150'}}><p style={{fontSize:12,letterSpacing:2,color:'#7ceaf1'}}>THE GOVERNING QUESTION</p><h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(26px,3vw,40px)',lineHeight:1.35,maxWidth:1030}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</h2><p style={{color:'#adbdc8',lineHeight:1.8,fontSize:17}}>Edge attestation may establish a defined claim about a system. Corridor permission establishes a separate bounded claim. AFA carries context across entities. EABA examines the proposed action at its local execution boundary. Independent vehicle safety controls remain responsible for physical behavior.</p></section>
<div style={{display:'flex',flexWrap:'wrap',gap:10,marginBottom:35}}>{images.map(v=><a key={v.number} href={'#section-'+v.number} style={{textDecoration:'none',color:'#bdf0ff',padding:'10px 13px',border:'1px solid #2d5264',borderRadius:9,fontSize:13}}>{v.number} · {v.title}</a>)}</div>
{images.map(v=><section id={'section-'+v.number} key={v.number} style={{padding:'42px 0 55px',borderTop:'1px solid #2b4756',scrollMarginTop:25}}><p style={{color:'#8ae4f5',fontSize:13,fontWeight:800,letterSpacing:2}}>IMAGE {v.number} / 08</p><h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(30px,4vw,46px)',margin:'10px 0'}}>{v.title}</h2><p style={{color:'#bccdd7',fontSize:18,lineHeight:1.7}}>{v.description}</p><div style={{overflow:'hidden',borderRadius:15,border:'1px solid #375566'}}><Image src={v.src} alt={'TA14 image '+v.number+': '+v.title} width={1536} height={1024} sizes='(max-width: 1180px) 100vw, 1180px' style={{display:'block',width:'100%',height:'auto'}} /></div><Samantha text={v.script}/><p style={{maxWidth:1000,color:'#9eb9c7',fontSize:15,lineHeight:1.8,marginTop:22}}>{v.script}</p></section>)}
<AuthorityLab />
<section style={{padding:'42px 0 54px',borderTop:'1px solid #315161'}}><p style={{fontSize:12,letterSpacing:2,color:'#6de5ea',fontWeight:900}}>WRITTEN TECHNICAL CHALLENGE</p><h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(30px,4vw,46px)'}}>Where does attestation end and local authority begin?</h2><p style={{fontSize:17,lineHeight:1.8,color:'#b6ceda'}}>An infrastructure architect can challenge the scenario by identifying one real, bounded attestation-to-action chain: the attested claim and issuer, the corridor permission lifecycle, the competent local authority, revocation behavior, the independent controller's response, and the observed outcome. TA14 invites written technical criticism without presuming a defect, partnership, endorsement or integration.</p><a href='mailto:greggbutlerac@gmail.com?subject=Intelligent%20Infrastructure%20Authority%20Boundary%20Technical%20Exchange' style={{display:'inline-block',padding:'13px 20px',background:'#7ee8d2',color:'#06202e',fontWeight:800,borderRadius:9,textDecoration:'none'}}>REQUEST WRITTEN TECHNICAL EXCHANGE →</a></section>
<footer style={{borderTop:'1px solid #315161',paddingTop:30,color:'#a3bac5',fontSize:14,lineHeight:1.8}}><h2 style={{color:'#eef7ff'}}>The examination boundary remains independent.</h2><p>TA14 does not assert deficiencies in any real autonomy infrastructure. This demonstration is not a safety case, regulatory approval or completed examination. Formal examination requires registered governance, established standing, a defined scope, a frozen baseline, admissible evidence and agreed criteria.</p><p>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome.</p><a href={pdf} style={{color:'#7be5ef'}}>Technical Governance Reference v2.0 ↗</a></footer>
</div></main>}
