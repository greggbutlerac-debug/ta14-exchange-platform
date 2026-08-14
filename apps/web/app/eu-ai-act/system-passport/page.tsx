'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Passport = {
  id:string; name:string; version:string; purpose:string; role:string; jurisdiction:string;
  provider:string; model:string; owner:string; risk:string; article50:string; highRisk:string;
  gpai:string; fria:string; lastChanged:string; evidenceState:string; notes:string;
};

const emptyPassport:Passport={
  id:'',name:'',version:'1.0',purpose:'',role:'UNRESOLVED',jurisdiction:'EU',provider:'',model:'',owner:'',risk:'UNRESOLVED',article50:'UNRESOLVED',highRisk:'UNRESOLVED',gpai:'UNRESOLVED',fria:'UNRESOLVED',lastChanged:'',evidenceState:'NOT ASSESSED',notes:''
};

const seed:Passport={
  id:'EUAI-SYS-001',name:'Customer Support Copilot',version:'4.2',purpose:'Customer service and account assistance',role:'DEPLOYER',jurisdiction:'EU / EEA',provider:'External foundation-model provider',model:'Support Copilot Model',owner:'AI Governance Office',risk:'TRANSPARENCY-SCOPED',article50:'APPLICABLE',highRisk:'REVIEW REQUIRED',gpai:'DEPENDENCY',fria:'NOT CURRENTLY ESTABLISHED',lastChanged:'2026-08-12',evidenceState:'CONDITIONAL',notes:'Demonstration passport. Replace with organisation-specific facts and evidence.'
};

const STORAGE='ta14-eu-ai-act-passports-v1';

function makeId(n:number){return `EUAI-SYS-${String(n).padStart(3,'0')}`}
function cls(v:string){return v.toLowerCase().replaceAll(' ','-').replaceAll('/','-')}

export default function SystemPassportPage(){
  const [passports,setPassports]=useState<Passport[]>([seed]);
  const [selected,setSelected]=useState(0);
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState<Passport>(seed);
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{
    try{const raw=localStorage.getItem(STORAGE);if(raw){const parsed=JSON.parse(raw) as Passport[];if(Array.isArray(parsed)&&parsed.length)setPassports(parsed)}}catch{}
    setLoaded(true);
  },[]);
  useEffect(()=>{if(loaded)localStorage.setItem(STORAGE,JSON.stringify(passports))},[passports,loaded]);
  useEffect(()=>{setDraft(passports[selected]||emptyPassport)},[selected,passports]);

  const active=passports[selected]||emptyPassport;
  const completeness=useMemo(()=>{
    const keys:(keyof Passport)[]=['name','version','purpose','role','jurisdiction','provider','owner','risk','article50','highRisk','lastChanged'];
    return Math.round(keys.filter(k=>String(active[k]||'').trim()&&String(active[k])!=='UNRESOLVED').length/keys.length*100);
  },[active]);

  function createPassport(){
    const p={...emptyPassport,id:makeId(passports.length+1),lastChanged:new Date().toISOString().slice(0,10)};
    setPassports([...passports,p]);setSelected(passports.length);setDraft(p);setEditing(true);
  }
  function save(){setPassports(p=>p.map((x,i)=>i===selected?draft:x));setEditing(false)}
  function remove(){if(passports.length===1)return;const next=passports.filter((_,i)=>i!==selected);setPassports(next);setSelected(0);setEditing(false)}

  const fields:[keyof Passport,string,string][]=[
    ['name','System name','text'],['version','Current version','text'],['purpose','Intended purpose','text'],['role','Actor role','text'],['jurisdiction','Jurisdiction / deployment geography','text'],['provider','Provider / upstream provider','text'],['model','Model / dependency','text'],['owner','Accountable owner','text'],['risk','Risk classification state','text'],['article50','Article 50 state','text'],['highRisk','High-risk state','text'],['gpai','GPAI dependency state','text'],['fria','FRIA state','text'],['lastChanged','Last material change','date'],['evidenceState','Evidence state','text'],['notes','Boundary / notes','textarea']
  ];

  return <main className="page">
    <div className="cosmos" aria-hidden="true"><i/><i/><b/></div>
    <nav className="top"><Link href="/eu-ai-act">TA-14 · EU AI ACT WORLD</Link><div><Link href="/eu-ai-act/command-center">COMMAND CENTER</Link><Link href="/eu-ai-act/classifier">CLASSIFIER</Link></div></nav>

    <div className="layout">
      <aside>
        <div className="asideHead"><span>SYSTEM PASSPORTS</span><strong>{passports.length}</strong></div>
        <p>Persistent governed identities for AI systems. Stored locally in this browser in the current release.</p>
        <div className="systemList">{passports.map((p,i)=><button key={p.id} onClick={()=>{setSelected(i);setEditing(false)}} className={i===selected?'active':''}><span>{p.id}</span><b>{p.name||'Unnamed AI system'}</b><small>{p.version} · {p.role}</small></button>)}</div>
        <button className="create" onClick={createPassport}>＋ CREATE SYSTEM PASSPORT</button>
        <div className="storageBoundary"><b>CURRENT STORAGE BOUNDARY</b><p>This release persists passport state in local browser storage. It is not yet an authenticated institutional system of record.</p></div>
      </aside>

      <section className="workspace">
        <header>
          <div><span className="eyebrow">EU AI ACT SYSTEM PASSPORT</span><h1>{active.name||'Unnamed AI system'}</h1><p>{active.id} · VERSION {active.version}</p></div>
          <div className="actions">{editing?<><button className="primary" onClick={save}>SAVE PASSPORT</button><button onClick={()=>{setDraft(active);setEditing(false)}}>CANCEL</button></>:<button className="primary" onClick={()=>setEditing(true)}>EDIT PASSPORT</button>}<Link href="/eu-ai-act/command-center">OPEN COMMAND CENTER →</Link></div>
        </header>

        <section className="integrity"><div><span>PASSPORT COMPLETENESS</span><strong>{completeness}%</strong><small>identity fields established</small></div><div><span>CURRENT EVIDENCE STATE</span><strong className={cls(active.evidenceState)}>{active.evidenceState}</strong><small>not a legal compliance determination</small></div><div><span>LAST MATERIAL CHANGE</span><strong>{active.lastChanged||'NOT RECORDED'}</strong><small>change should trigger impact review</small></div></section>

        <section className="principle"><strong>ONE SYSTEM IDENTITY SHOULD TRAVEL THROUGH THE WHOLE EU AI ACT WORLD.</strong><p>Classification, obligations, evidence, review, change, revalidation and examination should attach to this governed object rather than being recreated independently on every page.</p></section>

        {editing?<section className="editor"><div className="sectionHead"><span className="eyebrow">EDIT GOVERNED IDENTITY</span><h2>Describe the system that actually exists.</h2><p>Do not optimize the description for a favorable classification. Record the current condition, including unresolved facts.</p></div><div className="formGrid">{fields.map(([key,label,type])=><label key={key}><span>{label}</span>{type==='textarea'?<textarea value={draft[key]} onChange={e=>setDraft({...draft,[key]:e.target.value})}/>:<input type={type} value={draft[key]} onChange={e=>setDraft({...draft,[key]:e.target.value})}/>}</label>)}</div><div className="editFoot"><button className="primary" onClick={save}>SAVE GOVERNED IDENTITY</button>{passports.length>1?<button className="danger" onClick={remove}>DELETE PASSPORT</button>:null}</div></section>:
        <>
          <section className="identityGrid">
            <article><span>INTENDED PURPOSE</span><strong>{active.purpose||'NOT ESTABLISHED'}</strong></article>
            <article><span>ACTOR ROLE</span><strong>{active.role}</strong></article>
            <article><span>JURISDICTION</span><strong>{active.jurisdiction}</strong></article>
            <article><span>ACCOUNTABLE OWNER</span><strong>{active.owner||'NOT ESTABLISHED'}</strong></article>
            <article><span>PROVIDER</span><strong>{active.provider||'NOT ESTABLISHED'}</strong></article>
            <article><span>MODEL / DEPENDENCY</span><strong>{active.model||'NOT ESTABLISHED'}</strong></article>
          </section>

          <section className="section">
            <div className="sectionHead"><span className="eyebrow">REGULATORY POSITION</span><h2>Represent uncertainty instead of hiding it.</h2></div>
            <div className="stateGrid">{[['RISK CLASSIFICATION',active.risk],['ARTICLE 50',active.article50],['HIGH-RISK PATH',active.highRisk],['GPAI DEPENDENCY',active.gpai],['FRIA',active.fria],['EVIDENCE STATE',active.evidenceState]].map(([k,v])=><article key={k}><span>{k}</span><strong className={cls(v)}>{v}</strong></article>)}</div>
          </section>

          <section className="section chainSection"><div className="sectionHead"><span className="eyebrow">TA-14 GOVERNING CHAIN</span><h2>The passport is the identity anchor, not the finding.</h2></div><div className="chain">{['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><strong>{x}</strong>{i<7?<b>→</b>:null}</div>)}</div><p className="chainCopy">The passport records what system is being governed. Evidence and determinations must still establish what can be relied upon about that system.</p></section>

          <section className="section routeGrid"><Link href="/eu-ai-act/classifier"><span>01</span><h3>Classification</h3><p>Determine possible role, risk and transparency pathways against this recorded identity.</p><b>OPEN CLASSIFIER →</b></Link><Link href="/eu-ai-act/requirements"><span>02</span><h3>Obligation Map</h3><p>Map applicable, conditional, excluded and unresolved obligations.</p><b>OPEN REQUIREMENTS →</b></Link><Link href="/workspace/governed-records"><span>03</span><h3>Evidence Wallet</h3><p>Bind evidence objects, versions, owners and limitations to governed propositions.</p><b>OPEN RECORDS →</b></Link><Link href="/eu-ai-act/command-center"><span>04</span><h3>Change & Revalidation</h3><p>Trace how system or source changes place prior reliance under pressure.</p><b>OPEN COMMAND CENTER →</b></Link></section>

          <section className="section notes"><span className="eyebrow">BOUNDARY RECORD</span><h2>What this passport does not establish.</h2><p>{active.notes||'No additional boundary note has been recorded.'}</p><div><span>NOT LEGAL ADVICE</span><span>NOT CERTIFICATION</span><span>NOT CONFORMITY ASSESSMENT</span><span>NOT REGULATORY APPROVAL</span></div></section>
        </>}
      </section>
    </div>

    <style jsx>{`
      *{box-sizing:border-box}.page{min-height:100vh;background:#01050a;color:#edf7ff;font-family:Inter,system-ui,sans-serif;position:relative;overflow:hidden}.cosmos{position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 80% 10%,#0c3465 0,transparent 33%),radial-gradient(circle at 20% 80%,#1e163d 0,transparent 28%),#01050a}.cosmos i{position:absolute;inset:-20%;background-image:radial-gradient(#fff 0 .7px,transparent .9px);background-size:52px 52px;opacity:.14;animation:drift 80s linear infinite}.cosmos i+i{background-size:89px 89px;opacity:.08;animation-duration:120s;animation-direction:reverse}.cosmos b{position:absolute;width:420px;height:420px;border-radius:50%;right:-180px;top:42%;background:radial-gradient(circle at 35% 25%,#6ce5ff,#164b91 14%,#030913 65%);opacity:.18;box-shadow:0 0 100px #1c7eda}.top{position:relative;z-index:2;height:72px;padding:0 3vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #15324a;background:#02070dcc}.top a{color:#dff4ff;text-decoration:none;font-size:10px;font-weight:900;letter-spacing:.13em}.top div{display:flex;gap:22px}.layout{position:relative;z-index:1;display:grid;grid-template-columns:310px 1fr;max-width:1700px;margin:auto;min-height:calc(100vh - 72px)}aside{border-right:1px solid #15334b;padding:32px 18px;background:#030a11cc}.asideHead{display:flex;justify-content:space-between;align-items:end}.asideHead span{font-size:8px;letter-spacing:.17em;color:#6bdcf8}.asideHead strong{font:44px Georgia,serif}.asideHead+p{font-size:11px;color:#7d98ab;line-height:1.65}.systemList{display:grid;gap:7px;margin-top:24px}.systemList button{text-align:left;padding:15px;border:1px solid #183950;background:#06111a;color:#9bb2c3;display:grid;gap:5px;cursor:pointer}.systemList button.active{border-color:#62daf9;background:#0a1b28;color:#fff;box-shadow:0 0 24px #24b9e51a}.systemList span{font-size:7px;letter-spacing:.1em;color:#5fcde9}.systemList b{font-size:12px}.systemList small{font-size:8px;color:#748fa3}.create{width:100%;margin-top:14px;padding:13px;border:1px dashed #386681;background:transparent;color:#72dfff;font-size:8px;font-weight:900;letter-spacing:.1em}.storageBoundary{margin-top:30px;padding:16px;border:1px solid #644f23;background:#141005}.storageBoundary b{font-size:8px;color:#ffd36f;letter-spacing:.12em}.storageBoundary p{font-size:10px;color:#a89974;line-height:1.6;margin-bottom:0}.workspace{padding:45px 4vw 90px;min-width:0}.workspace>header{display:flex;justify-content:space-between;gap:30px;align-items:end;border-bottom:1px solid #17364d;padding-bottom:28px}.eyebrow{font-size:9px;letter-spacing:.2em;color:#68dafa;font-weight:900}.workspace h1{font:clamp(42px,5vw,72px)/.95 Georgia,serif;margin:12px 0}.workspace header p{color:#7e9aae}.actions{display:flex;gap:8px;flex-wrap:wrap}.actions button,.actions a,.editFoot button{padding:12px 15px;border:1px solid #2e5874;background:#071521;color:#b9eaff;text-decoration:none;font-size:8px;font-weight:900;letter-spacing:.08em}.actions .primary,.editFoot .primary{background:#6edff9;color:#031017;border-color:#6edff9}.integrity{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:24px 0}.integrity div{padding:20px;border:1px solid #183a52;background:#06111b;border-radius:13px}.integrity span,.identityGrid span,.stateGrid span{display:block;font-size:7px;letter-spacing:.13em;color:#6f94aa}.integrity strong{display:block;font:28px Georgia,serif;margin:8px 0}.integrity small{color:#7890a2;font-size:8px}.principle{padding:22px;border:1px solid #6e5b28;background:linear-gradient(90deg,#171205,#080b10);color:#ffe39a}.principle strong{font-size:12px;letter-spacing:.06em}.principle p{margin:8px 0 0;color:#aa9d79;line-height:1.6}.identityGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:28px}.identityGrid article,.stateGrid article{padding:22px;border:1px solid #18384f;background:#06111a;border-radius:13px}.identityGrid strong{display:block;margin-top:12px;line-height:1.4}.section{margin-top:70px;padding-top:55px;border-top:1px solid #133048}.sectionHead h2,.notes h2{font:clamp(32px,4vw,54px)/1 Georgia,serif;margin:10px 0}.stateGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:25px}.stateGrid strong{display:block;margin-top:12px;font-size:13px}.supported,.applicable{color:#6fe2b5!important}.conditional,.dependency{color:#6bdcf8!important}.review-required,.not-currently-established{color:#d8a5ff!important}.unresolved,.not-assessed{color:#ffd36f!important}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:3px;margin-top:25px}.chain div{min-height:82px;border:1px solid #193d56;background:#06121d;display:grid;place-content:center;text-align:center;position:relative}.chain span{font-size:7px;color:#5bcfeb}.chain strong{font-size:8px;letter-spacing:.08em;margin-top:6px}.chain b{position:absolute;right:-8px;top:34px;color:#5cd8f4;z-index:2}.chainCopy{text-align:center;color:#839dae;line-height:1.7}.routeGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.routeGrid a{padding:24px;border:1px solid #193a51;background:#06111a;color:#eaf6ff;text-decoration:none;border-radius:13px}.routeGrid span{font:24px Georgia,serif;color:#62d9f7}.routeGrid h3{margin:18px 0 8px}.routeGrid p{color:#8199aa;font-size:11px;line-height:1.65}.routeGrid b{font-size:8px;color:#6fdcf7}.notes p{max-width:900px;color:#99adbb;line-height:1.7}.notes>div{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}.notes>div span{padding:8px 10px;border:1px solid #6a5526;color:#d7bd77;font-size:7px;letter-spacing:.1em}.editor{margin-top:35px}.sectionHead p{color:#8099ab}.formGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.formGrid label{display:grid;gap:7px}.formGrid label span{font-size:8px;letter-spacing:.1em;color:#6f9bb2}.formGrid input,.formGrid textarea{width:100%;padding:13px;border:1px solid #1f465f;background:#06111b;color:#eaf6ff}.formGrid textarea{min-height:100px;resize:vertical}.editFoot{display:flex;justify-content:space-between;margin-top:22px}.editFoot .danger{border-color:#74393b;color:#ff9c9c;background:#17090a}@keyframes drift{to{transform:translate(160px,100px)}}@media(max-width:1000px){.layout{grid-template-columns:1fr}aside{border-right:0;border-bottom:1px solid #15334b}.identityGrid,.stateGrid,.routeGrid{grid-template-columns:1fr 1fr}.chain{grid-template-columns:repeat(4,1fr)}}@media(max-width:650px){.top div{display:none}.workspace>header{align-items:flex-start;flex-direction:column}.integrity,.identityGrid,.stateGrid,.routeGrid,.formGrid{grid-template-columns:1fr}.chain{grid-template-columns:1fr 1fr}.chain b{display:none}}
    `}</style>
  </main>
}
