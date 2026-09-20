"use client";

import { useState } from "react";
import Link from "next/link";

const challenges = [
["X01","Capability without established authority","SUPPORTED"],
["X02","Authority expiry before consequential execution","SUPPORTED"],
["X03","Revocation while execution is in flight","SUPPORTED · REACHABILITY LIMITATION"],
["X04","Conflicting legitimate human authorities","SUPPORTED"],
["X05","Authentic proof with claim overreach","SUPPORTED"],
["X06","Multiple evidence objects with common-source dependency","SUPPORTED"],
["X07","Bounded local trust composing into systemic consequence","SUPPORTED"],
["X08","Hidden delegation descendants / incomplete revocation lineage","SUPPORTED · OBSERVABILITY / REACHABILITY LIMITATION"],
["X09","Overruled precedent with historical-state preservation","SUPPORTED"],
["X10","Self-expanding amendment authority and later rollback","SUPPORTED"],
];

const states=[
{label:"FROZEN BASELINE",result:"EXAMINATION OBJECT ESTABLISHED",text:"The exact HSG v1.0 documentary / structural object is frozen. 75/75 frozen files are verified. No examination result is presumed."},
{label:"CAPABILITY APPEARS",result:"AUTHORITY STILL REQUIRED",text:"X01 preserves the constitutional distinction: machine capability does not create authority."},
{label:"AUTHORITY EXPIRES",result:"PRIOR AUTHORITY DOES NOT SILENTLY PERSIST",text:"X02 tests expiry before consequential execution. Present standing must remain attributable and bounded."},
{label:"REVOKE IN FLIGHT",result:"SUPPORTED · REACHABILITY LIMIT",text:"X03 supports the architecture while preserving a hard limit: revocation cannot be represented as guaranteed physical interruption where an external or remote system cannot receive or effectuate the change before consequence."},
{label:"REVEAL UNKNOWN DESCENDANT",result:"SUPPORTED · UNKNOWN REMAINS",text:"X08 preserves the observability boundary. Known and reachable lineage can be governed without pretending hidden, unknown, or unreachable descendants have been universally revoked."},
{label:"CLAIM UNIVERSAL PROOF",result:"STOP · CLAIM OVERREACH",text:"The bounded documentary / structural PASS does not establish certification, perfect safety, production validation, universal revocation reachability, or every implementation labelled HSG."},
];

export default function HSGShowcasePage(){
 const [i,setI]=useState(0); const s=states[i];
 return <main className="page"><div className="wrap">
  <nav><Link href="/governance-showcase">← GOVERNANCE SHOWCASE</Link><Link href="/registry/TA-14-AIGR-000034">TA-14-AIGR-000034</Link></nav>
  <header><p className="eyebrow">ELIAS HUMAN SOVEREIGNTY GATEWAY · INTERACTIVE GOVERNANCE SHOWROOM</p><h1>Capability does not create authority.</h1><p className="lead">Enter the exact seam HSG v1.0 was examined to govern. Change authority, revocation, reachability, observability, and claim scope—and watch the boundary refuse to say more than the frozen record supports.</p><div className="badges"><b>HSG v1.0</b><b>10/10 CHALLENGES SUPPORTED</b><b>75/75 FROZEN FILES VERIFIED</b></div></header>
  <section className="lab"><aside><p className="eyebrow">CHANGE THE CONDITION</p>{states.map((x,n)=><button className={i===n?"active":""} onClick={()=>setI(n)} key={x.label}>{n+1}. {x.label}</button>)}<button onClick={()=>setI(0)}>RESTORE FROZEN BASELINE</button></aside><article><p className="eyebrow">CURRENT EXAMINATION STATE</p><h2>{s.label}</h2><strong className="result">{s.result}</strong><p>{s.text}</p><div className="chain"><span>HUMAN AUTHORITY</span><span>EVIDENCE</span><span>DETERMINATION</span><span>DISPOSITION</span><span>EXECUTION</span></div></article></section>
  <section><p className="eyebrow">PRESERVED FINDING</p><h2>SUPPORTED — BOUNDED DOCUMENTARY / STRUCTURAL PASS</h2><p className="lead">All ten TA-14-controlled challenge conditions produced supportable findings inside the frozen documentary / structural boundary. X03 and X08 remain visible because a successful bounded result does not erase reachability or observability limits.</p></section>
  <section><p className="eyebrow">TA-14 CHALLENGE LEDGER</p><h2>Ten attacks. No silent repair.</h2><div className="grid">{challenges.map(([id,name,status])=><article className="card" key={id}><b>{id}</b><h3>{name}</h3><strong>{status}</strong></article>)}</div></section>
  <section className="limits"><p className="eyebrow">NEGATIVE SPACE</p><h2>The PASS has a ceiling.</h2><div className="grid"><article className="card"><b>X03 · REACHABILITY</b><p>Already-effectuated consequences are not retrospectively erased. Unreachable external systems cannot be described as guaranteed to receive revocation before consequence.</p></article><article className="card"><b>X08 · OBSERVABILITY</b><p>Complete descendant revocation remains unestablished where complete lineage or reachability is unestablished.</p></article></div></section>
  <section className="boundary"><b>EXAMINATION BOUNDARY</b><p>This is not certification, regulatory approval, universal legal compliance, perfect safety, production deployment validation, universal hidden-actor discovery, universal revocation reachability, or proof that every implementation labelled HSG correctly implements the architecture. The finding belongs to the exact frozen HSG v1.0 documentary / structural object.</p></section>
  <footer><Link href="/registry/TA-14-AIGR-000034">OPEN PERMANENT REGISTRY RECORD →</Link><span>Presentation can become richer. The preserved finding does not change.</span></footer>
 </div><style jsx>{`
 :global(*){box-sizing:border-box}:global(body){margin:0;background:#020711;color:#f5f7fb;font-family:Inter,system-ui,sans-serif}:global(a){color:inherit;text-decoration:none}.page{min-height:100vh;background:radial-gradient(circle at 12% 5%,#143c6355,transparent 30%),radial-gradient(circle at 90% 5%,#6b501f44,transparent 26%),linear-gradient(#020711,#071321 55%,#020711)}.wrap{width:min(1240px,calc(100% - 36px));margin:auto;padding-bottom:80px}nav{height:76px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ffffff15;color:#a9cee8;font-size:.75rem;font-weight:800}header{padding:85px 0 50px}.eyebrow{color:#edc56e;font-size:.68rem;font-weight:900;letter-spacing:.16em}h1{font:clamp(3.5rem,8vw,7rem)/.9 Georgia,serif;max-width:1050px;margin:15px 0 25px}.lead{max-width:930px;color:#a7bdcc;font-size:1.08rem;line-height:1.75}.badges{display:flex;gap:8px;flex-wrap:wrap;margin-top:25px}.badges b{border:1px solid #e6bd6544;border-radius:999px;padding:9px 12px;color:#efca79;font-size:.65rem}.lab{display:grid;grid-template-columns:.72fr 1.28fr;gap:18px}.lab aside,.lab article,.card,.boundary{border:1px solid #79aeda22;background:#06121eDD;border-radius:20px;padding:24px}.lab button{display:block;width:100%;text-align:left;margin:6px 0;padding:13px;border:1px solid #27475c;border-radius:11px;background:#071725;color:#b9cfdd;cursor:pointer}.lab button.active{border-color:#e7be68;color:#fff;background:#302713}.lab h2,section>h2{font:clamp(2rem,4vw,3.7rem)/1 Georgia,serif;margin:10px 0 20px}.result{display:inline-block;color:#8de2ba;border:1px solid #65bd9455;border-radius:9px;padding:9px 11px}.lab article>p:last-of-type{color:#a7bdcc;line-height:1.7}.chain{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:34px}.chain span{text-align:center;padding:14px 5px;border:1px solid #6da6cd33;border-radius:9px;color:#9bdcff;font-size:.58rem;font-weight:900}section{padding:58px 0;border-top:1px solid #ffffff12}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:13px}.card h3{font-size:1rem;margin:9px 0 18px}.card>b{color:#edc56e}.card strong{color:#8de2ba;font-size:.72rem}.card p,.boundary p{color:#9fb6c5;line-height:1.7}.limits{margin-top:15px}.boundary{border-color:#e5bb6544;background:#241b0d66;margin:25px 0 45px}.boundary>b{color:#efc66f}footer{display:flex;justify-content:space-between;gap:20px;border-top:1px solid #ffffff14;padding-top:30px;color:#71899a;font-size:.75rem}footer a{color:#9bdcff;font-weight:900}@media(max-width:820px){.lab,.grid{grid-template-columns:1fr}.chain{grid-template-columns:1fr}footer{flex-direction:column}}
 `}</style></main>
}