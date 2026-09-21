'use client';
import {useMemo,useState} from 'react';

const audiences={
ecole:{label:'ÉCOLE',icon:'🏫',place:'Salle de classe',facts:['CO₂ en hausse pendant l’occupation','Humidité élevée de façon récurrente','Ventilation modifiée après un événement'],action:'Investigation ventilation / usage'},
collectivite:{label:'COLLECTIVITÉ',icon:'🏛️',place:'Portefeuille ERP',facts:['Plusieurs bâtiments remontent des conditions différentes','Les actions et responsables varient selon le site','Le résultat doit rester comparable dans le temps'],action:'Prioriser, attribuer, vérifier'},
cmei:{label:'SANTÉ / CMEI',icon:'🫁',place:'Environnement de vie',facts:['Symptômes et environnement doivent rester distincts','Observations, prélèvements et contexte ont des temporalités différentes','Le record complète — sans remplacer — le jugement clinique'],action:'Préserver la chronologie environnementale'},
batiment:{label:'BÂTIMENT',icon:'⚙️',place:'Système technique',facts:['Une condition déclenche une investigation','Le diagnostic ne constitue pas une autorité d’intervention','La réalité post-action doit être revalidée'],action:'Diagnostic → autorité → intervention'}
};
const stages=[
{key:'reality',n:'01',label:'RÉALITÉ',title:'Que se passe-t-il maintenant ?',body:'La condition physique existe avant le tableau de bord : air, occupation, humidité, ventilation, particules, événement et contexte.'},
{key:'record',n:'02',label:'RECORD',title:'Qu’avons-nous réellement observé ?',body:'Chaque observation doit rester liée à sa source, son lieu, son heure et son contexte. Une valeur sans provenance n’est pas encore une histoire défendable.'},
{key:'continuity',n:'03',label:'CONTINUITÉ',title:'Est-ce isolé, récurrent ou changé ?',body:'La continuité distingue une pointe, une dérive, une récurrence et un changement de condition. Une ancienne preuve ne devient pas automatiquement une permission actuelle.'},
{key:'admissibility',n:'04',label:'ADMISSIBILITÉ',title:'La preuve est-elle suffisante pour cette décision ?',body:'TA-14 ne corrige pas silencieusement les lacunes. La suffisance est examinée avant la conséquence.'},
{key:'authority',n:'05',label:'AUTORITÉ',title:'Qui peut agir ici, maintenant ?',body:'Admissible evidence ≠ intervention authority. L’autorité doit être actuelle, locale, bornée et liée à l’action proposée.'},
{key:'execute',n:'06',label:'EXÉCUTION',title:'ALLOW, HOLD, DENY ou ESCALATE ?',body:'La décision d’exécution est enregistrée avant la conséquence. Le refus reste une capacité architecturale, pas une intervention humaine improvisée.'},
{key:'outcome',n:'07',label:'RÉSULTAT',title:'Qu’est-ce qui est vrai après l’action ?',body:'Le résultat retourne à la réalité. Le post-record établit ce qui a changé et ouvre une nouvelle chaîne plutôt que de prolonger silencieusement l’ancienne.'}
];

export default function FranceExperience(){
 const [aud,setAud]=useState<keyof typeof audiences>('ecole');
 const [step,setStep]=useState(0);
 const [event,setEvent]=useState(false);
 const [authority,setAuthority]=useState(false);
 const a=audiences[aud];
 const decision=useMemo(()=>step<3?'OBSERVE':!event?'HOLD':step<4?'REVALIDATE':!authority?'HOLD':step<5?'BIND':'ALLOW',[step,event,authority]);
 const advance=()=>setStep(v=>Math.min(stages.length-1,v+1));
 const reset=()=>{setStep(0);setEvent(false);setAuthority(false)};
 return <div className="fx">
  <div className="fxTop"><div><p className="k">TA-14 FRANCE · LIVE EXAMINATION</p><h2>Entrez par votre réalité française.</h2><p>Choisissez un contexte. Le même principe de gouvernance est ensuite testé contre une situation différente.</p></div><div className={'verdict '+decision.toLowerCase()}><small>ÉTAT ACTUEL</small><b>{decision}</b></div></div>
  <div className="audiences">{Object.entries(audiences).map(([k,v])=><button key={k} className={aud===k?'active':''} onClick={()=>{setAud(k as keyof typeof audiences);reset()}}><span>{v.icon}</span><b>{v.label}</b></button>)}</div>
  <div className="case">
   <div className="caseHead"><div><small>SCÉNARIO · {a.place.toUpperCase()}</small><h3>{a.action}</h3></div><div className="pulse"><i/>LIVE RECORD</div></div>
   <div className="signals">{a.facts.map((x,i)=><div key={x}><span>0{i+1}</span><p>{x}</p></div>)}</div>
   <div className="switches">
    <label><input type="checkbox" checked={event} onChange={e=>setEvent(e.target.checked)}/><span><b>CHANGED CONDITION</b><small>Un événement ou changement de contexte a été explicitement enregistré.</small></span></label>
    <label><input type="checkbox" checked={authority} onChange={e=>setAuthority(e.target.checked)}/><span><b>PRESENT AUTHORITY</b><small>Une autorité actuelle et bornée est établie pour l’action proposée.</small></span></label>
   </div>
  </div>
  <div className="runtime">
   <div className="rail">{stages.map((s,i)=><button key={s.key} className={i===step?'now':i<step?'done':''} onClick={()=>setStep(i)}><span>{s.n}</span><b>{s.label}</b></button>)}</div>
   <div className="stage"><p className="k">{stages[step].n} · {stages[step].label}</p><h3>{stages[step].title}</h3><p>{stages[step].body}</p>
    {step===4&&!authority&&<div className="hold">HOLD · La preuve peut être forte sans établir le droit d’intervenir.</div>}
    {step>=5&&authority&&event&&<div className="allow">ALLOW · Autorité présente + condition revalidée + binding explicite.</div>}
    <div className="controls"><button onClick={reset}>RECOMMENCER</button><button className="primary" disabled={step===stages.length-1} onClick={advance}>{step===stages.length-1?'CHAÎNE TERMINÉE':'ÉTAPE SUIVANTE →'}</button></div>
   </div>
  </div>
  <div className="air">
   <div><small>MONITORING</small><b>JE VOIS UNE VALEUR.</b></div><span>→</span><div><small>AIR</small><b>JE PEUX RECONSTRUIRE CE QUI S’EST PASSÉ.</b></div><span>→</span><div><small>AEA / EABA</small><b>JE SAIS SI CETTE PREUVE PEUT DEVENIR ACTION.</b></div>
  </div>
  <style>{`
.fx{margin:24px 0 70px;border:1px solid #27455a;border-radius:24px;overflow:hidden;background:linear-gradient(145deg,#07131d,#091722 55%,#0b1118);color:#eef6fa}.fxTop{display:flex;justify-content:space-between;gap:25px;padding:30px;border-bottom:1px solid #263b49}.fxTop h2{font:42px Georgia,serif;margin:7px 0}.fxTop p{color:#aebdc5;max-width:760px;line-height:1.6}.k{font-size:9px!important;font-weight:950;color:#7dbbff!important;letter-spacing:1.7px}.verdict{min-width:145px;border:1px solid #42505a;border-radius:16px;padding:18px;align-self:center;text-align:center}.verdict small{display:block;font-size:8px;color:#8296a2}.verdict b{display:block;margin-top:8px;font-size:18px}.verdict.hold{border-color:#d9a343;color:#ffd37b}.verdict.allow{border-color:#56bd89;color:#7ee0ad}.audiences{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:16px 30px;background:#061019}.audiences button{min-height:70px;border:1px solid #263b49;border-radius:13px;background:#091722;color:#aebdc5;cursor:pointer}.audiences button span{display:block;font-size:19px;margin-bottom:5px}.audiences button b{font-size:9px}.audiences button.active{border-color:#6db2ff;background:#0d2740;color:white}.case{padding:28px 30px;border-top:1px solid #203542}.caseHead{display:flex;justify-content:space-between;gap:15px;align-items:center}.caseHead small{color:#8096a2;font-size:9px}.caseHead h3,.stage h3{font:29px Georgia,serif;margin:7px 0}.pulse{font-size:8px;color:#7ee0ad;font-weight:900}.pulse i{display:inline-block;width:7px;height:7px;background:#62d69b;border-radius:50%;margin-right:6px}.signals{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:20px 0}.signals div{padding:16px;border:1px solid #263b49;border-radius:12px}.signals span{color:#ef6a72;font-size:9px;font-weight:900}.signals p{font-size:12px;color:#b4c2c9;line-height:1.5}.switches{display:grid;grid-template-columns:1fr 1fr;gap:10px}.switches label{display:flex;gap:12px;align-items:center;padding:15px;border:1px solid #30434e;border-radius:12px;cursor:pointer}.switches input{width:20px;height:20px}.switches b,.switches small{display:block}.switches b{font-size:9px;color:#8fc6ff}.switches small{font-size:10px;color:#81939d;margin-top:4px}.runtime{display:grid;grid-template-columns:210px 1fr;border-top:1px solid #263b49}.rail{padding:20px;background:#061019}.rail button{display:flex;width:100%;gap:10px;align-items:center;padding:12px 8px;border:0;border-left:2px solid #263b49;background:transparent;color:#718792;text-align:left;cursor:pointer}.rail button span{font-size:8px}.rail button b{font-size:9px}.rail button.done{border-left-color:#57ba87;color:#83d7aa}.rail button.now{border-left-color:#6db2ff;background:#0c2132;color:#fff}.stage{padding:30px;min-height:320px}.stage>p:not(.k){font-size:15px;line-height:1.7;color:#adbbc3;max-width:750px}.hold,.allow{margin:22px 0;padding:16px;border-radius:10px;font-size:11px;font-weight:900}.hold{border:1px solid #8d6728;background:#2a2113;color:#ffd27a}.allow{border:1px solid #397a5a;background:#11271d;color:#8ae3b5}.controls{display:flex;gap:10px;margin-top:28px}.controls button{padding:13px 16px;border:1px solid #3b4c57;border-radius:9px;background:#0a1620;color:#c4d0d6;font-size:9px;font-weight:900;cursor:pointer}.controls .primary{background:#e9eef1;color:#09131a}.controls button:disabled{opacity:.45}.air{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:12px;padding:24px 30px;border-top:1px solid #263b49;background:#080f15}.air div{padding:14px}.air small{display:block;color:#ef6a72;font-size:8px;font-weight:900;margin-bottom:7px}.air b{font:14px Georgia,serif}.air>span{color:#617886}@media(max-width:760px){.fxTop,.caseHead{display:block}.verdict{margin-top:15px}.audiences,.signals,.switches{grid-template-columns:1fr 1fr}.runtime{grid-template-columns:1fr}.rail{display:grid;grid-template-columns:repeat(4,1fr)}.rail button{display:block}.air{grid-template-columns:1fr}.air>span{transform:rotate(90deg);text-align:center}}@media(max-width:440px){.audiences,.signals,.switches{grid-template-columns:1fr}.rail{grid-template-columns:1fr 1fr}.fxTop h2{font-size:34px}}
`}</style>
 </div>
}