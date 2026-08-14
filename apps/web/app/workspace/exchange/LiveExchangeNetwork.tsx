"use client";

import { useEffect, useMemo, useState } from "react";
import { getExchangeNetworkSnapshot, type ExchangeNetworkSnapshot } from "@/lib/exchange-network";

function tone(value:string){
  if(/PUBLISH|TEST|REVALIDAT|REVIEW/i.test(value)) return "border-cyan-300/25 text-cyan-200";
  if(/FORK|REVIS/i.test(value)) return "border-emerald-300/25 text-emerald-200";
  if(/CHALLENGE|DEGRA/i.test(value)) return "border-amber-300/25 text-amber-200";
  return "border-white/10 text-slate-300";
}

export default function LiveExchangeNetwork(){
  const [snapshot,setSnapshot]=useState<ExchangeNetworkSnapshot|null>(null);
  const [error,setError]=useState("");
  useEffect(()=>{let live=true;getExchangeNetworkSnapshot().then(x=>{if(live)setSnapshot(x)}).catch(e=>{if(live)setError(e instanceof Error?e.message:"Live Exchange state unavailable.")});return()=>{live=false}},[]);
  const domains=useMemo(()=>new Set(snapshot?.routes.map(r=>r.domain)??[]).size,[snapshot]);
  const tested=snapshot?.eventCounts.TESTED??0,forked=snapshot?.eventCounts.FORKED??0,challenged=snapshot?.eventCounts.CHALLENGED??0;
  return <section className="mt-24 border-t border-white/10 pt-16">
    <div className="flex flex-wrap items-end justify-between gap-5"><div><span className="text-[9px] font-black uppercase tracking-[.2em] text-emerald-300">Persistent Exchange network</span><h2 className="mt-3 font-serif text-5xl">Live institutional state.</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">These numbers and events are read from persisted Exchange records. They are separate from the four founding examples above and grow only when actual route or event objects exist.</p></div><span className={`rounded-full border px-3 py-2 text-[9px] font-black ${error?"border-rose-300/30 text-rose-200":"border-emerald-300/30 text-emerald-200"}`}>{error?"LIVE STATE UNAVAILABLE":snapshot?"DATABASE CONNECTED":"CONNECTING…"}</span></div>
    <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-6">{[["PERSISTED ROUTES",snapshot?.routes.length??"—"],["DOMAINS",snapshot?domains:"—"],["TEST EVENTS",snapshot?tested:"—"],["FORK EVENTS",snapshot?forked:"—"],["CHALLENGES",snapshot?challenged:"—"],["PUBLIC EVENTS",snapshot?.events.length??"—"]].map(([k,v])=><article key={String(k)} className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><small className="text-[8px] font-bold tracking-[.14em] text-slate-500">{k}</small><b className="mt-2 block font-serif text-3xl">{v}</b></article>)}</div>
    {error&&<div className="mt-5 rounded-2xl border border-rose-300/20 bg-rose-300/[.04] p-5 text-sm text-rose-100">{error}</div>}
    {snapshot&&<div className="mt-8 grid gap-6 lg:grid-cols-2"><div><div className="mb-3 text-[9px] font-black tracking-[.16em] text-slate-500">PERSISTED ROUTE OBJECTS</div><div className="space-y-2">{snapshot.routes.slice(0,8).map(r=><article key={r.id} className="rounded-2xl border border-white/10 bg-black/20 p-5"><div className="flex justify-between gap-4"><div><b>{r.title}</b><p className="mt-1 text-xs text-slate-500">{r.owner} · {r.domain} · v{r.version}</p></div><span className="h-fit rounded-full border border-white/10 px-2 py-1 text-[8px] font-black text-slate-300">{r.status}</span></div></article>)}{!snapshot.routes.length&&<div className="rounded-2xl border border-dashed border-white/15 p-8 text-sm text-slate-500">No persisted Exchange routes are publicly readable yet.</div>}</div></div><div><div className="mb-3 text-[9px] font-black tracking-[.16em] text-slate-500">PUBLIC EVENT LEDGER</div><div className="space-y-2">{snapshot.events.slice(0,8).map(e=><article key={e.id} className="rounded-2xl border border-white/10 bg-black/20 p-5"><div className="flex items-start justify-between gap-4"><div><span className={`rounded-full border px-2 py-1 text-[8px] font-black ${tone(e.eventType)}`}>{e.eventType}</span><b className="mt-3 block text-sm">{e.summary}</b><p className="mt-1 text-[10px] text-slate-500">{e.routeId} · {new Date(e.occurredAt).toLocaleString()}</p></div><span className="text-[8px] font-black text-slate-500">{e.eventState}</span></div></article>)}{!snapshot.events.length&&<div className="rounded-2xl border border-dashed border-white/15 p-8 text-sm leading-6 text-slate-500">The public event ledger is empty. It will populate from real TESTED, FORKED, CHALLENGED, REVALIDATED, DEGRADED, REVISED and REVIEWED events rather than simulated activity.</div>}</div></div></div>}
  </section>;
}
