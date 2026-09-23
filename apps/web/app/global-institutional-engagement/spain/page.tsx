import Link from 'next/link';
import GuidedShowroom from '../../components/GuidedShowroom';
import InstitutionalSeamLab from '../../components/InstitutionalSeamLab';

const chain=['REALIDAD','REGISTRO','CONTINUIDAD','ADMISIBILIDAD','VINCULACIÓN','COMMIT','EJECUCIÓN','RESULTADO'];
const sources=[
 ['GLOBAL COMMISSION / IWBI','Global Framework for Action: coordinated healthy-indoor-air roadmap.','https://www.wellcertified.com/'],
 ['INBIOT','Spanish indoor-air monitoring and building-performance context.','https://inbiot.es/']
];

export const metadata={title:'España · Del aire medido a la consecuencia autorizada | TA-14',description:'Independent TA-14 technical showroom examining Spain, healthy indoor air, measurement and the governed consequence boundary.'};

export default function Page(){return <main className="p"><div className="s">
<nav><Link className="brand" href="/"><b>TA-14</b> AUTHORITY</Link><Link href="/global-institutional-engagement">GLOBAL INSTITUTIONAL ENGAGEMENT</Link><Link href="/global-institutional-engagement/control-board">CONTROL BOARD</Link></nav>

<header>
 <div className="flags"><span>🇪🇸 <b>ESPAÑA · SPAIN</b></span><span>🇺🇸 <b>TA-14 · UNITED STATES</b></span></div>
 <p className="eye">GLOBAL FRAMEWORK FOR ACTION · COUNTRY BLUEPRINT EXAMINATION · SEPTEMBER 2026</p>
 <h1>MEDIDO.<br/><em>¿Y DESPUÉS QUÉ?</em></h1>
 <p className="en">MEASURED. THEN WHAT?</p>
 <p className="lead">La medición establece qué está haciendo realmente un edificio, no solamente qué fue diseñado para hacer. Cuando la evidencia indica que algo debería cambiar, aparece una segunda pregunta: <b>¿qué establece que la consecuencia propuesta puede convertirse en realidad ahora?</b></p>
 <div className="boundary"><b>INDEPENDENT TECHNICAL EXAMINATION</b><p>This showroom is an independent TA-14 examination informed by publicly available Global Commission / IWBI materials and Maria Figols’ public invitation concerning a potential Spanish Blueprint for Action. It does not imply endorsement, partnership, certification, adoption or affiliation by Maria Figols, inBiot, IWBI, the Global Commission or Spanish authorities.</p></div>
</header>

<div className="chain">{chain.map(x=><span key={x}>{x}</span>)}</div>

<section><p className="eye">01 · GLOBAL STARTING POINT</p><h2>El marco es global.<br/>La implementación será nacional.</h2>
<p className="copy">The Global Commission on Healthy Indoor Air describes the Global Framework for Action as a coordinated roadmap for turning science, policy and practice into healthier indoor environments. Its launch identifies more than 200 experts and leaders across 40+ countries, nine levers of market transformation, 40 strategic priority areas and 179 recommendations.</p>
<div className="stats">{[['200+','EXPERTS + LEADERS'],['40+','COUNTRIES'],['9','LEVERS'],['40','PRIORITY AREAS'],['179','RECOMMENDATIONS']].map(([n,l])=><article key={l}><b>{n}</b><span>{l}</span></article>)}</div>
<div className="call"><b>THE NEXT SCALE IS COUNTRY-SPECIFIC.</b><p>Maria Figols has publicly highlighted measurement and invited Spain’s regulators, researchers, facility managers and investors into the conversation about a Spanish Blueprint for Action.</p></div></section>

<section className="band"><div className="in"><p className="eye">02 · MARIA FIGOLS’ DOORWAY</p><h2>“Measured” is where this examination begins.</h2>
<div className="measure"><div><small>DESIGN INTENT</small><b>What the building was supposed to do</b></div><span>≠</span><div><small>MEASURED REALITY</small><b>What the building is actually doing now</b></div></div>
<p className="copy">Measurement makes performance visible. TA-14 does not replace sensors, monitoring platforms, scientists, building professionals, WELL, Spanish institutions or applicable law. It examines the downstream seam: what must be established before measured evidence becomes a consequential act.</p></div></section>

<InstitutionalSeamLab eyebrow="SPAIN · MEASUREMENT-TO-CONSEQUENCE LAB" title="The condition can be established while the consequence is not." intro="Operate the seam between measured indoor-air reality and a contemplated building intervention." nativeLabel="MEASUREMENT / BUILDING LAYER" nativeValue="sensor + zone + time + occupancy + operating state + provenance" actionLabel="PROPOSED CONSEQUENCE" actionValue="increase outdoor-air ventilation for the affected occupied zone" stages={[
 {label:'CONDITION MEASURED',state:'EVIDENCE PRESENT',determination:'HOLD',changed:'CONSEQUENCE NOT YET BOUND',explanation:'The condition is evidence. Applicable Authority and Established Standing for the exact consequence still must be established.'},
 {label:'AUTHORITY + STANDING BOUND',state:'CURRENT + ATTRIBUTABLE',determination:'ALLOW',changed:'EVIDENCE + AUTHORITY + STANDING + EXACT ACT',explanation:'The consequence is bound to current evidence, applicable authority, established standing and the defined execution path.'},
 {label:'BUILDING CONTEXT CHANGES',state:'PRIOR BINDING NOT CURRENT',determination:'HOLD',changed:'OCCUPANCY / SENSOR / EQUIPMENT / AUTHORITY',explanation:'The old record remains historically valid, but material change requires revalidation before execution.'},
 {label:'REVALIDATED',state:'CURRENT AGAIN',determination:'ALLOW',changed:'NEW CURRENT-STATE BINDING',explanation:'Evidence, authority, standing and the exact consequence are re-established for the execution moment.'}
]}/>

<GuidedShowroom eyebrow="ESPAÑA · RECORRIDO GUIADO" title="De la realidad medida al resultado verificable." intro="A Spanish Blueprint can localize priorities. This path asks what must remain established when a specific consequence is allowed to become real." accent="#f2c94c" gold="#f2c94c" steps={[
 {label:'01 · REALIDAD',title:'Observe the occupied environment',plain:'The actual indoor condition exists independently of policy, dashboards or design intent.'},
 {label:'02 · REGISTRO',title:'Measure and preserve it',plain:'Sensor identity, zone, time, method, operating state and provenance preserve what was observed.'},
 {label:'03 · CONTINUIDAD',title:'Establish context',plain:'Chronology shows whether evidence remains representative of the condition under examination.'},
 {label:'04 · ADMISIBILIDAD',title:'Determine what the evidence supports',plain:'Test attribution, sufficiency, currentness and scope before consequential reliance.'},
 {label:'05 · VINCULACIÓN',title:'Establish authority and standing',plain:'Bind Applicable Authority and the actor with Established Standing to the exact proposed consequence.',result:'ALLOW · HOLD · DENY · ESCALATE'},
 {label:'06 · COMMIT',title:'Freeze the authorized state',plain:'Preserve evidence, authority, standing, scope and execution path immediately before execution.'},
 {label:'07 · EJECUCIÓN',title:'Execute only what was authorized',plain:'Capability is not authority. A changed path or condition can require revalidation.'},
 {label:'08 · RESULTADO',title:'Measure what actually happened',plain:'The outcome becomes new observable reality and a new record.'}
]}/>

<section><p className="eye">03 · SPAIN BLUEPRINT LABORATORY</p><h2>Un marco compartido.<br/>Cuatro edificios diferentes.</h2>
<div className="grid four">
<article><span>ESCUELA · SCHOOL</span><b>Children + changing occupancy</b><p>Measured conditions can establish evidence. The exercise asks who may bind a specific operational response and under what current conditions.</p></article>
<article><span>HOSPITAL · HOSPITAL</span><b>Health-critical environment</b><p>Clinical, facilities and infection-control authority cannot be collapsed into a sensor reading.</p></article>
<article><span>OFICINA · OFFICE</span><b>Performance + workplace</b><p>Continuous monitoring can reveal operating performance while authority determines which intervention is permitted, by whom and when.</p></article>
<article><span>RESIDENCIAL · RESIDENTIAL</span><b>Home + shared systems</b><p>Measurement can expose conditions without automatically resolving ownership, duty, standing, access or authority to alter shared systems.</p></article>
</div></section>

<section className="band"><div className="in"><p className="eye">04 · CHANGE THE BUILDING</p><h2>Commissioned once ≠ authorized forever.</h2>
<div className="changes">{[['CHANGE OCCUPANCY','Exposure and ventilation context changes.'],['CHANGE THE SENSOR','Evidence identity or confidence changes.'],['CHANGE AUTHORITY','The actor with standing changes.'],['CHANGE EQUIPMENT','The execution path is no longer the evaluated path.']].map(([a,b])=><article key={a}><b>{a}</b><p>{b}</p></article>)}</div>
<div className="hard"><b>Changed context does not erase the old record.</b><p>It changes what that record can authorize now. Revalidation asks whether current evidence, Applicable Authority, Established Standing and the exact proposed consequence are still bound at execution.</p></div></div></section>

<section><p className="eye">05 · THE BOUNDARY</p><h2>Measurement makes reality visible.<br/>Governance determines what evidence is authorized to become.</h2>
<div className="flow"><div><b>MEASURE</b><p>observable building performance</p></div><span>→</span><div><b>VALIDATE</b><p>identity · provenance · continuity</p></div><span>→</span><div className="gate"><b>GOVERN THE CONSEQUENCE</b><p>Admissible Evidence · Applicable Authority · Established Standing</p></div><span>→</span><div><b>VERIFY OUTCOME</b><p>what happened becomes the new record</p></div></div>
<blockquote>Does this proposed consequence have sufficient <b>Admissible Evidence, Applicable Authority, and Established Standing</b> to become reality NOW?</blockquote></section>

<section><p className="eye">06 · BOUNDARY CONDITIONS</p><h2>Spain determines Spain’s pathway.</h2><div className="grid three">
<article><b>NOT A SUBSTITUTE</b><p>TA-14 does not replace Spanish law, public-health authority, professional judgment, WELL, monitoring systems or building controls.</p></article>
<article><b>NOT AN ENDORSEMENT</b><p>This does not state that Maria Figols, inBiot, IWBI, the Global Commission or a Spanish institution has adopted TA-14.</p></article>
<article><b>THE NARROW ROLE</b><p>TA-14 examines the boundary between proposed consequence and reality: evidence, authority, standing, binding, commit, execution and outcome.</p></article>
</div></section>

<section><p className="eye">07 · PUBLIC SOURCE MAP</p><h2>Keep the originating work visible.</h2><div className="sources">{sources.map(([name,copy,href])=><a key={name} href={href} target="_blank" rel="noreferrer"><b>{name}</b><p>{copy}</p><span>OPEN SOURCE ↗</span></a>)}</div></section>

<footer>TA-14 AUTHORITY · GLOBAL INSTITUTIONAL ENGAGEMENT<br/>ESPAÑA · GLOBAL FRAMEWORK FOR ACTION · INDEPENDENT PUBLIC TECHNICAL SHOWROOM · SEPTEMBER 2026</footer>
</div><style>{`
*{box-sizing:border-box}.p{min-height:100vh;background:radial-gradient(circle at 8% 0%,#8e141c44,transparent 28%),radial-gradient(circle at 92% 0%,#f2c94c25,transparent 24%),linear-gradient(180deg,#080606,#100d09 48%,#050505);color:#f7f4ed;font-family:Arial,sans-serif}.s,.in{max-width:1220px;margin:auto;padding:0 28px}nav{height:76px;display:flex;align-items:center;gap:24px;border-bottom:1px solid #3b3024}nav a{color:#c9c0b2;text-decoration:none;font-size:9px;font-weight:900}.brand{margin-right:auto;font-size:15px!important}.brand b,.eye{color:#f2c94c}header{padding:72px 0 48px}.flags{display:flex;justify-content:space-between;gap:18px;margin-bottom:45px}.flags span{padding:13px 16px;border:1px solid #ffffff24;background:#ffffff08;font-size:12px}h1{font:clamp(58px,8vw,100px)/.9 Georgia,serif;letter-spacing:-4px;margin:22px 0 8px}h1 em{font-style:normal;color:#f2c94c}.en{font-weight:950;letter-spacing:.22em}.lead,.copy{max-width:980px;color:#c1b8aa;font-size:17px;line-height:1.75}.lead b{color:#fff}.boundary,.call,.hard{margin-top:26px;padding:24px;border-left:4px solid #f2c94c;background:#171208}.boundary b,.call b,.hard b{color:#f2c94c}.boundary p,.call p,.hard p{color:#c1b8aa;line-height:1.65}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;padding:20px 0 55px}.chain span{text-align:center;border:1px solid #f2c94c44;padding:12px 3px;color:#f2c94c;font-size:8px;font-weight:900}section{padding:66px 0;border-top:1px solid #332b21}h2{font:clamp(36px,5vw,60px)/1.03 Georgia,serif;max-width:1050px}.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:28px}.stats article,.grid article,.changes article{padding:22px;border:1px solid #493c29;background:#100d09}.stats b{display:block;font:38px Georgia,serif;color:#f2c94c}.stats span,.grid span{display:block;margin-top:7px;color:#b8aa94;font-size:8px;font-weight:950}.band{margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);background:#100d09}.measure{display:grid;grid-template-columns:1fr auto 1fr;gap:15px;align-items:center;margin:28px 0}.measure div{padding:30px;border:1px solid #4a3d29;background:#090807}.measure small{display:block;color:#aa9d89;font-size:9px;margin-bottom:10px}.measure b{font:22px Georgia,serif}.measure span{font-size:30px;color:#f2c94c}.grid,.changes{display:grid;gap:12px;margin-top:28px}.four,.changes{grid-template-columns:repeat(4,1fr)}.three{grid-template-columns:repeat(3,1fr)}article b{color:#f7f1e6;font-size:11px}article p{color:#b6ad9f;line-height:1.65}.changes b{color:#f2c94c}.flow{display:grid;grid-template-columns:1fr auto 1fr auto 1.25fr auto 1fr;align-items:center;gap:10px;margin-top:28px}.flow div{padding:22px;border:1px solid #493c29;background:#100d09}.flow>span{color:#f2c94c;font-size:25px}.flow b{color:#f2c94c}.flow p{color:#aea596;font-size:12px}.gate{border:2px solid #f2c94c!important}blockquote{margin:34px 0 0;padding:30px;border-left:4px solid #aa151b;background:#14090a;font:22px/1.55 Georgia,serif}blockquote b{color:#f2c94c}.sources{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:25px}.sources a{padding:24px;border:1px solid #493c29;background:#100d09;color:#fff;text-decoration:none}.sources a b{color:#f2c94c}.sources a p{color:#b6ad9f;line-height:1.6}footer{padding:45px 0 70px;color:#857b6d;font-size:9px;line-height:1.8}@media(max-width:900px){.stats{grid-template-columns:repeat(3,1fr)}.four,.changes,.three,.sources{grid-template-columns:1fr 1fr}.chain{grid-template-columns:repeat(2,1fr)}.flow{grid-template-columns:1fr}.flow>span{transform:rotate(90deg);justify-self:center}}@media(max-width:650px){.four,.changes,.three,.sources,.stats,.measure{grid-template-columns:1fr}.s,.in{padding:0 18px}nav{height:auto;padding:18px 0;flex-wrap:wrap}h1{letter-spacing:-2px}.flags{flex-direction:column}}
`}</style></main>}
