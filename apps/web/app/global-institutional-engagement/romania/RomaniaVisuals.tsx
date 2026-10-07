'use client';
import {useState} from 'react';

const boards=[
 {n:'01',title:'REALITATE & OBSERVAȚIE',img:'https://raw.githubusercontent.com/greggbutlerac-debug/ta14-exchange-platform/main/TA14_Romania_01_Reality_Observation.png',
 en:'Begin with the atmosphere as it actually exists at a specific place and time. Monitoring can observe pollutants and environmental conditions, but observation is not yet a decision. The first discipline is to preserve what was actually observed without silently converting it into inference or authority.',
 ro:'Începem cu atmosfera așa cum există ea în realitate, într-un anumit loc și moment. Monitorizarea poate observa poluanți și condiții de mediu, dar observația nu este încă o decizie. Prima disciplină este păstrarea a ceea ce a fost observat efectiv, fără transformarea tacită a observației în inferență sau autoritate.'},
 {n:'02',title:'ÎNREGISTRARE & CONTINUITATE',img:'https://raw.githubusercontent.com/greggbutlerac-debug/ta14-exchange-platform/main/TA14_Romania_02_Record_Continuity.png',
 en:'An observation becomes usable evidence only when the record preserves time, place, parameter, method, quality information, provenance and continuity. This board asks how Romania preserves the chain from original measurement to later institutional reliance.',
 ro:'O observație devine probă utilizabilă numai atunci când înregistrarea păstrează timpul, locul, parametrul, metoda, informațiile privind calitatea, proveniența și continuitatea. Această planșă întreabă cum păstrează România lanțul dintre măsurarea inițială și utilizarea instituțională ulterioară.'},
 {n:'03',title:'VALIDARE & FIABILITATE',img:'https://raw.githubusercontent.com/greggbutlerac-debug/ta14-exchange-platform/main/TA14_Romania_03_Validation_Reliability.png',
 en:'Recorded data must still be shown to be technically reliable for its intended use. Calibration, quality assurance, quality control, reference methods, uncertainty and documented limitations matter before a measurement can carry institutional weight.',
 ro:'Datele înregistrate trebuie să fie demonstrate ca fiind fiabile din punct de vedere tehnic pentru utilizarea intenționată. Calibrarea, asigurarea și controlul calității, metodele de referință, incertitudinea și limitările documentate contează înainte ca o măsurare să poată avea greutate instituțională.'},
 {n:'04',title:'ADMISIBILITATE',img:'https://raw.githubusercontent.com/greggbutlerac-debug/ta14-exchange-platform/main/TA14_Romania_04_Admissibility.png',
 en:'Technically valid data is not automatically sufficient for every purpose. Admissibility asks whether this evidence, in this form, under the applicable rules and limitations, is sufficient for the specific institutional determination being considered.',
 ro:'Datele valide din punct de vedere tehnic nu sunt automat suficiente pentru orice scop. Admisibilitatea întreabă dacă aceste probe, în această formă, conform regulilor și limitărilor aplicabile, sunt suficiente pentru determinarea instituțională concretă avută în vedere.'},
 {n:'05',title:'AUTORITATE & CALITATE',img:'https://raw.githubusercontent.com/greggbutlerac-debug/ta14-exchange-platform/main/TA14_Romania_05_Authority_Standing.png',
 en:'Evidence does not manufacture authority. This boundary asks which Romanian institution, role or body may interpret the evidence, make the relevant determination, request action or authorize a consequence, and what law, mandate or procedure establishes that standing.',
 ro:'Probele nu creează autoritate prin ele însele. Această limită întreabă ce instituție, funcție sau organism din România poate interpreta probele, lua determinarea relevantă, solicita o acțiune sau autoriza o consecință și ce lege, mandat sau procedură stabilește această calitate.'},
 {n:'06',title:'CONSECINȚĂ & ACȚIUNE AUTORIZATĂ',img:'https://raw.githubusercontent.com/greggbutlerac-debug/ta14-exchange-platform/main/TA14_Romania_06_Consequence_Authorized_Action.png',
 en:'Once evidence and authority are established, the question becomes narrower: what action is actually permitted? TA14 distinguishes ALLOW, HOLD, DENY and ESCALATE so uncertainty, missing authority or changed conditions do not silently become execution.',
 ro:'După stabilirea probelor și a autorității, întrebarea devine mai precisă: ce acțiune este permisă în mod efectiv? TA14 distinge între ALLOW, HOLD, DENY și ESCALATE, astfel încât incertitudinea, lipsa autorității sau schimbarea condițiilor să nu devină în mod tacit execuție.'},
 {n:'07',title:'REVALIDARE — ACUM',img:'https://raw.githubusercontent.com/greggbutlerac-debug/ta14-exchange-platform/main/TA14_Romania_07_Revalidation_NOW.png',
 en:'A determination that was justified earlier may not remain justified now. Revalidation asks whether the evidence, authority, standing, risk and real-world context remain sufficient immediately before the proposed consequence becomes reality.',
 ro:'O determinare justificată anterior poate să nu mai fie justificată acum. Revalidarea întreabă dacă probele, autoritatea, calitatea, riscul și contextul real rămân suficiente imediat înainte ca o consecință propusă să devină realitate.'},
 {n:'08',title:'REZULTAT & NOUA REALITATE',img:'https://raw.githubusercontent.com/greggbutlerac-debug/ta14-exchange-platform/main/A14_Romania_08_Outcome_New_Reality.png',
 en:'Execution is not the end of the evidence chain. The outcome must return to observation. What actually happened should be measured, preserved and compared with the intended consequence so the next decision begins from a new proved reality, not an assumption.',
 ro:'Execuția nu reprezintă sfârșitul lanțului probator. Rezultatul trebuie să revină la observație. Ceea ce s-a întâmplat efectiv trebuie măsurat, păstrat și comparat cu consecința intenționată, astfel încât următoarea decizie să pornească de la o nouă realitate demonstrată, nu de la o presupunere.'}
];

function AudioGuide({text,lang,label}:{text:string;lang:string;label:string}){
 const [speaking,setSpeaking]=useState(false); const [status,setStatus]=useState('');
 const play=()=>{ if(typeof window==='undefined')return; speechSynthesis.cancel(); setStatus('');
  const voices=speechSynthesis.getVoices();
  const voice=lang==='ro-RO'
   ? voices.find(v=>v.lang.toLowerCase().startsWith('ro'))
   : (voices.find(v=>v.name==='Samantha')||voices.find(v=>v.lang.toLowerCase().startsWith('en-us'))||voices.find(v=>v.lang.toLowerCase().startsWith('en')));
  if(lang==='ro-RO'&&!voice){setStatus('Vocea română nu este disponibilă pe acest dispozitiv. Textul românesc rămâne disponibil mai jos.');return;}
  const u=new SpeechSynthesisUtterance(text);u.lang=lang;if(voice)u.voice=voice;u.rate=.82;u.pitch=1;
  u.onend=()=>setSpeaking(false);u.onerror=()=>{setSpeaking(false);setStatus('Redarea audio nu este disponibilă în acest browser.');};
  setSpeaking(true);speechSynthesis.speak(u);
 };
 return <div className="audio"><div className="audioTop"><b>{label}</b><div><button onClick={play}>▶ PLAY</button><button onClick={()=>{speechSynthesis.cancel();setSpeaking(false)}} disabled={!speaking}>■ STOP</button></div></div>{status&&<div className="status">{status}</div>}<p>{text}</p></div>
}

export default function RomaniaVisuals(){
 return <section className="walk"><div className="sectionHead"><small>08 PLANȘE DIDACTICE · ROMÂNA ESTE LIMBA PRINCIPALĂ</small><h2>Samantha explică fiecare limită, pas cu pas.</h2><p>Fiecare planșă predă o întrebare distinctă. Narațiunea și explicația în limba română sunt prezentate primele; engleza rămâne referință secundară. Imaginile sunt ilustrații didactice, nu afirmații despre operațiunile sau rezultatele Guvernului României.</p></div>
 <div className="boards">{boards.map(b=><article key={b.n}><div className="boardHead"><span>{b.n}</span><div><small>ROMÂNIA · SOLICITARE TEHNICĂ</small><h3>{b.title}</h3></div></div><img src={b.img} alt={b.title}/><div className="guides"><AudioGuide text={b.ro} lang="ro-RO" label="ROMÂNĂ · GHID AUDIO"/><AudioGuide text={b.en} lang="en-US" label="ENGLISH · SECONDARY REFERENCE"/></div></article>)}</div>
 <style jsx>{`
 .walk{padding:70px 0;border-top:1px solid #ffffff12}.sectionHead{max-width:900px;margin-bottom:34px}.sectionHead small{color:#63d8ff;font-size:9px;font-weight:950;letter-spacing:.18em}.sectionHead h2{font:clamp(38px,5vw,62px) Georgia,serif;margin:10px 0}.sectionHead p{color:#9eb3bf;line-height:1.75}.boards{display:grid;gap:42px}.boards article{padding:20px;border:1px solid #23485d;border-radius:20px;background:linear-gradient(145deg,#091925,#040a10)}.boardHead{display:flex;gap:15px;align-items:center;margin-bottom:16px}.boardHead>span{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;background:#0b75ba;border:2px solid #5bd9ff;font:24px Georgia,serif}.boardHead small{color:#65dfff;font-size:8px;letter-spacing:.14em}.boardHead h3{font:27px Georgia,serif;margin:5px 0}.boards img{display:block;width:100%;height:auto;border-radius:13px;border:1px solid #ffffff16}.guides{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:13px}.audio{padding:16px;border:1px solid #ffffff12;border-radius:12px;background:#ffffff07}.audioTop{display:flex;justify-content:space-between;gap:10px;align-items:center}.audioTop>b{font-size:9px;letter-spacing:.1em;color:#79e2ff}.audio button{padding:8px 10px;margin-left:5px;border:1px solid #2c6680;border-radius:7px;background:#081722;color:#dff7ff;font-size:8px;font-weight:900}.audio button:disabled{opacity:.35}.audio p{color:#aabdc7;font-size:13px;line-height:1.65;margin:13px 0 0}.status{margin-top:10px;color:#ffd36a;font-size:10px}@media(max-width:760px){.guides{grid-template-columns:1fr}.audioTop{align-items:flex-start;flex-direction:column}.audio button{margin-left:0;margin-right:5px}}
 `}</style></section>
}