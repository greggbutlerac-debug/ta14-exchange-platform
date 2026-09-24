'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type Customer = 'Individual' | 'Professional' | 'Small Business' | 'Organization' | 'Enterprise / Public Institution';
type Depth = 'Examine' | 'Establish' | 'Operate';

const anchors = ['Reality','Record','Continuity','Admissibility','Binding','Commit','Execution','Outcome'];

const customerBase: Record<Customer, number> = {
  'Individual': 49,
  'Professional': 149,
  'Small Business': 349,
  'Organization': 750,
  'Enterprise / Public Institution': 1500,
};

const depthFactor: Record<Depth, number> = { Examine: 1, Establish: 1.8, Operate: 2.6 };

function money(n:number) {
  return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
}

export default function PricingPage() {
  const [customer,setCustomer] = useState<Customer>('Small Business');
  const [subject,setSubject] = useState('AI Agent');
  const [routes,setRoutes] = useState(1);
  const [domains,setDomains] = useState(1);
  const [depth,setDepth] = useState<Depth>('Examine');
  const [implementation,setImplementation] = useState(false);
  const [revalidation,setRevalidation] = useState(false);
  const [broken,setBroken] = useState<string | null>(null);

  const price = useMemo(() => {
    const base = customerBase[customer];
    const extraRoutes = Math.max(0,routes-1) * Math.max(35,Math.round(base*.22));
    const federation = Math.max(0,domains-1) * Math.max(50,Math.round(base*.18));
    const implementationCost = implementation ? Math.max(100,Math.round(base*.45)) : 0;
    const revalidationCost = revalidation ? Math.max(49,Math.round(base*.2)) : 0;
    return Math.round((base+extraRoutes+federation+implementationCost+revalidationCost)*depthFactor[depth]);
  },[customer,routes,domains,depth,implementation,revalidation]);

  const determination = broken ? (broken === 'Admissibility' || broken === 'Binding' ? 'DENY / ESCALATE' : 'HOLD') : 'ALLOW — DEMONSTRATION ONLY';

  return (
    <div className="page">
      <style>{`
        :root{--bg:#02060b;--panel:#07111d;--line:rgba(129,190,235,.18);--text:#f6fbff;--muted:#9bb0c3;--cyan:#5ce9ff;--green:#42f5a7;--gold:#ffd56e}
        *{box-sizing:border-box} body{margin:0;background:radial-gradient(circle at 15% 0,rgba(45,157,255,.17),transparent 30%),linear-gradient(180deg,#02060b,#07111d 52%,#02060b);color:var(--text);font-family:Inter,system-ui,sans-serif}
        button,select,input{font:inherit}.page{min-height:100vh}.shell{width:min(1180px,92vw);margin:auto}.top{position:sticky;top:0;z-index:20;background:rgba(2,6,11,.86);backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}
        .nav{height:68px;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:10px;color:white;text-decoration:none;font-weight:950;letter-spacing:.08em}.mark{display:grid;place-items:center;width:40px;height:40px;border:1px solid rgba(92,233,255,.4);border-radius:13px;color:var(--cyan)}
        .navlinks{display:flex;gap:18px}.navlinks a{color:var(--muted);text-decoration:none;font-size:14px}.hero{text-align:center;padding:82px 0 48px}.eyebrow{color:var(--cyan);font-size:11px;font-weight:950;letter-spacing:.19em;text-transform:uppercase}
        h1{font-size:clamp(48px,7vw,88px);line-height:.94;letter-spacing:-.055em;margin:13px auto 20px;max-width:1050px}.grad{color:transparent;background:linear-gradient(90deg,#fff,var(--cyan),var(--green));background-clip:text}
        .hero p{max-width:850px;margin:auto;color:#b5c6d7;font-size:19px;line-height:1.7}.manifesto{margin:26px auto 0;padding:15px 20px;width:fit-content;border:1px solid rgba(66,245,167,.25);border-radius:999px;color:var(--green);font-weight:900}
        .chain{display:grid;grid-template-columns:repeat(8,1fr);gap:7px;margin:10px 0 44px}.anchor{padding:14px 6px;text-align:center;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.025);font-size:12px;font-weight:850}.anchor.off{border-color:rgba(255,95,95,.5);color:#ff9292;background:rgba(255,70,70,.08)}
        .builder{display:grid;grid-template-columns:1.25fr .75fr;gap:18px;margin-bottom:70px}.panel{border:1px solid var(--line);border-radius:25px;background:rgba(7,17,29,.86);padding:28px;box-shadow:0 24px 70px rgba(0,0,0,.24)}
        .panel h2{font-size:34px;letter-spacing:-.04em;margin:7px 0 8px}.panel>p{color:var(--muted);line-height:1.6}.fields{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:24px}.field{display:grid;gap:7px}.field label{font-size:12px;color:#c8d7e5;font-weight:850}.field select,.field input{width:100%;min-height:48px;border:1px solid var(--line);border-radius:12px;background:#06101b;color:white;padding:0 12px}
        .rangeRow{display:flex;align-items:center;gap:12px}.rangeRow input{padding:0}.count{min-width:42px;text-align:center;font-weight:950;color:var(--cyan)}.toggles{display:grid;gap:10px;margin-top:15px}.toggle{display:flex;align-items:center;justify-content:space-between;padding:13px 14px;border:1px solid var(--line);border-radius:12px;color:#d8e5ef}.toggle input{width:20px;height:20px}
        .receipt{position:sticky;top:88px;height:fit-content}.price{font-size:58px;font-weight:950;letter-spacing:-.06em;color:var(--green);margin:10px 0}.small{font-size:12px;color:var(--muted)}.summary{display:grid;gap:9px;margin:20px 0}.row{display:flex;justify-content:space-between;gap:20px;padding-bottom:9px;border-bottom:1px solid var(--line);font-size:13px}.row span:first-child{color:var(--muted)}.notice{padding:14px;border-radius:13px;background:rgba(255,213,110,.07);border:1px solid rgba(255,213,110,.2);color:#ffe6a3;font-size:13px;line-height:1.55}
        .cta{display:flex;justify-content:center;align-items:center;min-height:50px;margin-top:16px;border-radius:13px;background:linear-gradient(90deg,var(--cyan),var(--green));color:#02110b;text-decoration:none;font-weight:950}
        .section{margin-bottom:78px}.section h2{font-size:clamp(36px,5vw,58px);letter-spacing:-.05em;line-height:1;margin:10px 0 14px}.section p{color:var(--muted);line-height:1.7;max-width:850px}.routes{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-top:24px}.route{padding:20px;border:1px solid var(--line);border-radius:18px;background:rgba(7,17,29,.75)}.route b{display:block;margin-bottom:7px}.route span{color:var(--muted);font-size:13px;line-height:1.5}
        .break{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:22px 0}.break button{min-height:45px;border-radius:11px;border:1px solid var(--line);background:rgba(255,255,255,.03);color:white;cursor:pointer}.break button.active{border-color:#ff7373;color:#ff9b9b;background:rgba(255,70,70,.08)}.determination{padding:18px;border:1px solid var(--line);border-radius:15px;font-weight:950;font-size:20px}.determination strong{color:var(--gold)}
        .compare{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:22px}.compareCard{padding:23px;border:1px solid var(--line);border-radius:20px;background:rgba(7,17,29,.78)}.compareCard h3{margin:0 0 8px}.compareCard p{font-size:14px}.bigline{font-size:25px;font-weight:950;color:var(--cyan);margin:15px 0 6px}
        .footerRule{margin:0 0 90px;padding:34px;border-radius:25px;border:1px solid rgba(92,233,255,.28);background:linear-gradient(135deg,rgba(45,157,255,.1),rgba(66,245,167,.05))}.footerRule h2{font-size:42px;margin:8px 0 12px;letter-spacing:-.04em}.footerRule p{color:#b7c8d7;line-height:1.7}
        @media(max-width:850px){.builder,.compare{grid-template-columns:1fr}.fields{grid-template-columns:1fr}.chain{grid-template-columns:repeat(4,1fr)}.routes{grid-template-columns:1fr}.break{grid-template-columns:repeat(2,1fr)}.receipt{position:static}.navlinks{display:none}}
      `}</style>

      <header className="top"><div className="shell nav"><Link className="brand" href="/"><span className="mark">14</span>TA-14 PRICING & ENGAGEMENT</Link><nav className="navlinks"><Link href="/admissible-federation-architecture">AFA</Link><Link href="/execution-authority-boundary-architecture">EABA</Link><Link href="/showrooms">Showrooms</Link><Link href="/review">Review</Link></nav></div></header>

      <main className="shell">
        <section className="hero">
          <div className="eyebrow">TA-14 Admissible Execution Architecture</div>
          <h1>Do more examination.<br/><span className="grad">Not less.</span></h1>
          <p>One proposed consequence is rarely one question. Configure a bounded TA-14 examination, add routes, change conditions, and see the price update as you build. The goal is simple: make rigorous examination affordable enough to run again.</p>
          <div className="manifesto">DON'T SPEND MORE TO EXAMINE LESS.</div>
        </section>

        <div className="chain">{anchors.map(a=><div key={a} className={'anchor '+(broken===a?'off':'')}>{a}</div>)}</div>

        <section className="builder">
          <div className="panel">
            <div className="eyebrow">Build your examination</div><h2>What are you trying to make happen safely?</h2>
            <p>Start with the consequence. The architecture stays underneath the experience and calculates the bounded scope as you make selections.</p>
            <div className="fields">
              <div className="field"><label>WHO ARE YOU?</label><select value={customer} onChange={e=>setCustomer(e.target.value as Customer)}>{Object.keys(customerBase).map(x=><option key={x}>{x}</option>)}</select></div>
              <div className="field"><label>WHAT ARE YOU EXAMINING?</label><select value={subject} onChange={e=>setSubject(e.target.value)}>{['AI Agent','Building / HVACD/R','Indoor Environmental Quality','Financial Transaction','Data / API','Autonomous System','Human Decision','Other'].map(x=><option key={x}>{x}</option>)}</select></div>
              <div className="field"><label>HOW FAR SHOULD TA-14 GO?</label><select value={depth} onChange={e=>setDepth(e.target.value as Depth)}><option>Examine</option><option>Establish</option><option>Operate</option></select></div>
              <div className="field"><label>INDEPENDENT DOMAINS</label><div className="rangeRow"><input type="range" min="1" max="6" value={domains} onChange={e=>setDomains(Number(e.target.value))}/><span className="count">{domains}</span></div></div>
              <div className="field" style={{gridColumn:'1 / -1'}}><label>EXAMINATION ROUTES — ADD ROUTES, NOT GIANT NEW ENGAGEMENTS</label><div className="rangeRow"><input type="range" min="1" max="12" value={routes} onChange={e=>setRoutes(Number(e.target.value))}/><span className="count">{routes}</span></div></div>
            </div>
            <div className="toggles">
              <label className="toggle"><span>Add implementation work</span><input type="checkbox" checked={implementation} onChange={e=>setImplementation(e.target.checked)}/></label>
              <label className="toggle"><span>Add continuing revalidation</span><input type="checkbox" checked={revalidation} onChange={e=>setRevalidation(e.target.checked)}/></label>
            </div>
          </div>

          <aside className="panel receipt">
            <div className="eyebrow">Live scope estimate</div><div className="price">{money(price)}</div>
            <div className="small">Interactive planning estimate. Final scope is confirmed before paid work begins.</div>
            <div className="summary">
              <div className="row"><span>Subject</span><b>{subject}</b></div><div className="row"><span>Depth</span><b>{depth}</b></div><div className="row"><span>Routes</span><b>{routes}</b></div><div className="row"><span>Domains</span><b>{domains}</b></div><div className="row"><span>Parent chain</span><b>8 anchors</b></div>
            </div>
            <div className="notice"><b>TA-14 does not sell ALLOW.</b><br/>You are paying for examination, evidence work, implementation, documentation and governance — never a predetermined determination.</div>
            <a className="cta" href={`mailto:ta14admissibleexecution@gmail.com?subject=TA-14%20Bounded%20Examination%20Request&body=Customer:%20${encodeURIComponent(customer)}%0ASubject:%20${encodeURIComponent(subject)}%0ADepth:%20${depth}%0ARoutes:%20${routes}%0ADomains:%20${domains}%0APlanning%20estimate:%20${encodeURIComponent(money(price))}`}>START THIS BOUNDED EXAMINATION</a>
          </aside>
        </section>

        <section className="section">
          <div className="eyebrow">One consequence. Multiple routes.</div><h2>Ask more questions with the same baseline.</h2>
          <p>The first route establishes the field. Additional bounded routes can reuse what remains valid, so testing changed conditions does not automatically become another full engagement.</p>
          <div className="routes">
            <div className="route"><b>Normal route</b><span>Evidence, authority and conditions remain valid through commit.</span></div>
            <div className="route"><b>Evidence changes</b><span>Remove provenance, continuity, currency or a required record and run again.</span></div>
            <div className="route"><b>Authority changes</b><span>Revoke, expire or narrow authority before the proposed consequence reaches commit.</span></div>
            <div className="route"><b>Connection changes</b><span>Change or revoke the governed relationship between independent parties.</span></div>
            <div className="route"><b>Reality changes</b><span>Occupancy, equipment, environment or another material condition changes.</span></div>
            <div className="route"><b>Federated route</b><span>Carry governed context across domains while execution authority remains locally established.</span></div>
          </div>
        </section>

        <section className="section">
          <div className="eyebrow">Interactive demonstration</div><h2>Break the chain.</h2>
          <p>Remove an anchor and watch the demonstration disposition change. This is illustrative, not a real determination; actual TA-14 findings depend on the evidence, authority, standing and frozen examination criteria.</p>
          <div className="break">{anchors.map(a=><button key={a} className={broken===a?'active':''} onClick={()=>setBroken(broken===a?null:a)}>{broken===a?'Restore ':'Remove '}{a}</button>)}</div>
          <div className="determination">DEMONSTRATION DISPOSITION: <strong>{determination}</strong></div>
        </section>

        <section className="section">
          <div className="eyebrow">Pricing philosophy</div><h2>Different services answer different questions.</h2>
          <p>TA-14 does not claim that commissioning, cybersecurity, AI governance, interoperability, legal review or compliance are interchangeable. The comparison that matters is what each engagement explicitly establishes — and what still must be established before a proposed consequence may become reality.</p>
          <div className="compare">
            <div className="compareCard"><h3>Published market examples</h3><p>Where we display outside pricing, it should be dated, sourced and described as that provider's published scope — never presented as an invented industry average or as an equivalent service.</p><div className="bigline">Source the claim.</div><p>Then let the visitor compare budgets without attacking the provider.</p></div>
            <div className="compareCard"><h3>TA-14 budget view</h3><p>The useful question is not “who is cheaper?” It is: with the same available budget, how many bounded routes and changed conditions can be put under examination here?</p><div className="bigline">{routes} route{routes===1?'':'s'} · {money(price)}</div><p>Change the route count above and the estimate recalculates immediately.</p></div>
          </div>
        </section>

        <section className="footerRule">
          <div className="eyebrow">Independent execution boundary</div><h2>No admissible evidence. No admissible execution.</h2>
          <p><b>Payment cannot purchase a favorable result.</b> TA-14 fees compensate the professional work required to examine and, where engaged, establish or operate the route. The governing question remains: Does this proposed consequence have sufficient <b>Admissible Evidence</b>, <b>Applicable Authority</b>, and <b>Established Standing</b> to become reality NOW?</p>
        </section>
      </main>
    </div>
  );
}
