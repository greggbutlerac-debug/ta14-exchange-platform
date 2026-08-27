'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Summary = {
  offerViewedEvents:number;
  offerViewedVisitors:number;
  ctaClickEvents:number;
  ctaClickVisitors:number;
  trialActivated:number;
  activeTrials:number;
  convertedTrials:number;
  paidSubscriptions:number;
  clickThroughRate:number|null;
  clickToTrialRate:number|null;
};
type Payload = { generatedAt:string; windowDays:number; summary:Summary; boundary:string; error?:string };

function formatRate(value:number|null){return value==null?'No denominator':`${value.toLocaleString()}%`}

export default function CommercialHandoffPage(){
 const [data,setData]=useState<Payload|null>(null);
 const [status,setStatus]=useState('Loading commercial handoff intelligence…');
 useEffect(()=>{let live=true;async function load(){try{const response=await fetch('/api/mission-control/commercial-handoff',{cache:'no-store',credentials:'include'});const payload=await response.json() as Payload;if(!response.ok)throw new Error(payload.error||'Commercial handoff intelligence is unavailable.');if(live){setData(payload);setStatus('')}}catch(error){if(live)setStatus(error instanceof Error?error.message:'Commercial handoff intelligence is unavailable.')}}void load();const timer=window.setInterval(load,60000);return()=>{live=false;window.clearInterval(timer)}},[]);
 const stages=useMemo(()=>data?[
  ['01','Offer viewed',data.summary.offerViewedVisitors],
  ['02','CTA clicked',data.summary.ctaClickVisitors],
  ['03','Trial activated',data.summary.trialActivated],
  ['04','Trial active',data.summary.activeTrials],
  ['05','Converted',data.summary.convertedTrials],
  ['06','Paid',data.summary.paidSubscriptions],
 ] as const:[],[data]);
 return <main className="shell">
  <header className="top"><div><p className="eye">SEO INTELLIGENCE · PRIVATE</p><h1>Registry → Revenue Handoff</h1><p className="lead">Measure the exact commercial continuation after a participant reaches a registered governance record.</p></div><nav><Link href="/workspace/mission-control/seo-intelligence">SEO Intelligence</Link><Link href="/workspace/mission-control/governance-registry">Registry Watch</Link><Link href="/workspace/mission-control">Mission Control</Link></nav></header>
  {status?<section className="notice">{status}</section>:null}
  {data?<>
   <section className="hero"><div><p className="eye">COMMERCIAL CONVERSION CONTROL</p><h2>Registered is not paid.</h2><p>TA-14 now observes the behavioral bridge from a completed Registry experience into the 60-day workspace trial and onward into authoritative commercial state.</p></div><div className="rates"><article><span>{formatRate(data.summary.clickThroughRate)}</span><small>Offer viewed → CTA clicked</small></article><article><span>{formatRate(data.summary.clickToTrialRate)}</span><small>CTA clicked → Trial activated</small></article></div></section>
   <section className="chain">{stages.map(([number,label,value],index)=><article key={label}><span>{number}</span><strong>{value.toLocaleString()}</strong><b>{label}</b>{index<stages.length-1?<i>→</i>:null}</article>)}</section>
   <section className="metrics"><article><small>OFFER VIEW EVENTS</small><strong>{data.summary.offerViewedEvents.toLocaleString()}</strong><p>Raw recorded offer-view observations.</p></article><article><small>CTA CLICK EVENTS</small><strong>{data.summary.ctaClickEvents.toLocaleString()}</strong><p>Raw clicks on the 60-day workspace continuation.</p></article><article><small>ACTIVE TRIALS</small><strong>{data.summary.activeTrials.toLocaleString()}</strong><p>Authoritative commercial trials currently active.</p></article><article><small>PAID SUBSCRIPTIONS</small><strong>{data.summary.paidSubscriptions.toLocaleString()}</strong><p>Authoritative billing subscription state only.</p></article></section>
   <section className="diagnostic"><div><p className="eye">CONVERSION-LOSS INTELLIGENCE</p><h2>{data.summary.offerViewedVisitors===0?'No participant has observed the new offer yet.':data.summary.ctaClickVisitors===0?'The current leak is Offer Viewed → CTA Clicked.':data.summary.trialActivated===0?'The current leak is CTA Clicked → Trial Activated.':data.summary.paidSubscriptions===0?'Commercial progression exists; paid conversion has not yet occurred.':'Paid commercial progression is now observed.'}</h2><p>{data.summary.offerViewedVisitors===0?'The instrumentation is live, but there is not yet an external participant observation to evaluate.':data.summary.ctaClickVisitors===0?'Registered participants are reaching the commercial offer but have not yet selected the trial continuation.':data.summary.trialActivated===0?'At least one participant selected the continuation, but the authoritative trial table has not yet recorded activation.':data.summary.paidSubscriptions===0?'Trial activation has crossed the handoff boundary. The next measurable problem is value proof and conversion to payment.':'The chain has reached authoritative paid subscription state.'}</p></div></section>
   <section className="boundary"><b>Evidence boundary</b><p>{data.boundary}</p><span>Rolling {data.windowDays}-day window · generated {new Date(data.generatedAt).toLocaleString()}</span></section>
  </>:null}
  <style jsx>{`.shell{min-height:100vh;padding:42px clamp(18px,4vw,58px) 80px;background:radial-gradient(circle at 12% 0%,rgba(53,190,255,.13),transparent 30%),radial-gradient(circle at 88% 18%,rgba(244,198,103,.08),transparent 25%),#030811;color:#eef6ff;font-family:Inter,system-ui,sans-serif}.top,.hero,.chain,.metrics,.diagnostic,.boundary,.notice{max-width:1480px;margin-inline:auto}.top{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:28px}.top nav{display:flex;gap:9px;flex-wrap:wrap}.top nav :global(a){padding:11px 14px;border:1px solid rgba(114,223,255,.22);border-radius:11px;background:rgba(114,223,255,.05);color:#dff7ff;text-decoration:none;font-size:12px;font-weight:800}.eye{margin:0 0 8px;color:#72dfff;font-size:11px;font-weight:900;letter-spacing:.15em;text-transform:uppercase}h1,h2,p{margin-top:0}h1{margin-bottom:12px;font-size:clamp(2.5rem,5vw,5rem);letter-spacing:-.055em;line-height:.96}.lead{max-width:850px;margin:0;color:#91a6bc;line-height:1.7}.hero{display:grid;grid-template-columns:1.35fr .65fr;gap:18px;margin-bottom:18px}.hero>div,.rates{border:1px solid rgba(255,255,255,.1);border-radius:22px;background:rgba(255,255,255,.03);padding:24px}.hero h2{font-size:clamp(2rem,4vw,3.5rem);margin-bottom:10px}.hero p{color:#91a6bc;line-height:1.65}.rates{display:grid;grid-template-columns:1fr 1fr;gap:10px}.rates article{display:grid;align-content:center;min-height:150px;padding:16px;border:1px solid rgba(255,255,255,.07);border-radius:16px;background:rgba(0,0,0,.14)}.rates span{font-size:2rem;font-weight:900}.rates small{margin-top:8px;color:#7f93aa;line-height:1.5}.chain{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));margin-bottom:18px;border:1px solid rgba(255,255,255,.1);border-radius:22px;background:rgba(255,255,255,.025);overflow:hidden}.chain article{position:relative;min-height:150px;padding:20px;border-right:1px solid rgba(255,255,255,.07)}.chain article:last-child{border-right:0}.chain article>span{color:#72dfff;font-size:10px;font-weight:900}.chain strong{display:block;margin:14px 0 6px;font-size:2.5rem}.chain b{color:#9fb1c4;font-size:11px;text-transform:uppercase}.chain i{position:absolute;right:-7px;top:48%;z-index:2;color:#72dfff;font-style:normal}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}.metrics article{padding:20px;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:rgba(255,255,255,.028)}.metrics small{color:#71869c;font-size:10px;font-weight:900}.metrics strong{display:block;margin:10px 0 8px;font-size:2.5rem}.metrics p{margin:0;color:#7f93aa;font-size:12px;line-height:1.5}.diagnostic{padding:28px;border:1px solid rgba(244,198,103,.24);border-radius:22px;background:linear-gradient(135deg,rgba(95,67,20,.14),rgba(255,255,255,.02));margin-bottom:18px}.diagnostic h2{font-size:clamp(1.8rem,3vw,3rem);margin-bottom:10px}.diagnostic p{max-width:980px;margin:0;color:#9cafc2;line-height:1.65}.boundary{padding:18px 20px;border:1px solid rgba(255,255,255,.09);border-radius:16px;background:rgba(0,0,0,.16)}.boundary b{color:#ffd27e;font-size:10px;text-transform:uppercase}.boundary p{margin:7px 0;color:#8398ad;font-size:12px;line-height:1.6}.boundary span{color:#61778e;font-size:11px}.notice{padding:18px;border:1px solid rgba(255,255,255,.1);border-radius:16px;color:#9fb1c4}@media(max-width:1000px){.hero{grid-template-columns:1fr}.chain{grid-template-columns:repeat(3,1fr)}.metrics{grid-template-columns:repeat(2,1fr)}}@media(max-width:680px){.top{align-items:stretch;flex-direction:column}.rates,.chain,.metrics{grid-template-columns:1fr}.chain article{border-right:0;border-bottom:1px solid rgba(255,255,255,.07)}.chain i{display:none}}`}</style>
 </main>
}
