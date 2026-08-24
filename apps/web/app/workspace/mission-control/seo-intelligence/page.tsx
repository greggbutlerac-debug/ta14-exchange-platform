"use client";
import Link from "next/link";
import {useEffect,useState} from "react";

type Item={name:string;count:number};
type Data={generatedAt:string;windowDays:number;degraded?:{identityAttribution?:boolean;subscriptionAttribution?:boolean};summary:{pageViews:number;uniqueVisitors:number;clicks:number;searchArrivals:number;commercialIntentEvents:number;commercialIntentVisitors:number;averageIntentScore:number;authenticatedAttributedUsers:number;paidSubscriptions:number;attributedPaidSubscriptions:number;attributedRevenue:number};pages:Item[];searchEngines:Item[];searchQueries:Item[];referrers:Item[];campaigns:Item[];sources:Item[];terms:Item[];devices:Item[];locations:Item[];clickTargets:Item[];intentTypes:Item[];intentPages:Item[];subscriptionPlans:Item[]};

const metricStyles=[
  "from-sky-500/20 to-cyan-400/5 border-sky-400/20",
  "from-indigo-500/20 to-sky-400/5 border-indigo-400/20",
  "from-fuchsia-500/20 to-violet-400/5 border-fuchsia-400/20",
  "from-emerald-500/20 to-teal-400/5 border-emerald-400/20",
  "from-amber-500/20 to-orange-400/5 border-amber-400/20",
  "from-rose-500/20 to-pink-400/5 border-rose-400/20",
  "from-cyan-500/20 to-blue-400/5 border-cyan-400/20",
  "from-lime-500/20 to-emerald-400/5 border-lime-400/20"
];

function Panel({title,items,empty="No data recorded yet."}:{title:string;items:Item[];empty?:string}){
 return <section className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_22px_60px_rgba(2,8,23,.28)] backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/[0.06]">
  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent"/>
  <h2 className="mb-4 text-xs font-semibold uppercase tracking-[.22em] text-cyan-100">{title}</h2>
  {items?.length?<div className="space-y-2.5">{items.slice(0,15).map((x,i)=><div key={`${x.name}-${i}`} className="flex items-start justify-between gap-4 rounded-xl border border-white/[0.05] bg-black/10 px-3 py-2.5 text-sm"><span className="break-all text-slate-300">{x.name}</span><strong className="shrink-0 rounded-full bg-white/[0.07] px-2.5 py-1 text-xs text-white">{x.count.toLocaleString()}</strong></div>)}</div>:<div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-7 text-center"><div className="mx-auto mb-2 h-2 w-2 rounded-full bg-cyan-300/70 shadow-[0_0_18px_rgba(103,232,249,.6)]"/><p className="text-sm text-slate-500">{empty}</p></div>}
 </section>
}

export default function SeoIntelligencePage(){
 const[data,setData]=useState<Data|null>(null);const[status,setStatus]=useState("Loading private telemetry…");
 useEffect(()=>{fetch("/api/admin/seo-intelligence",{cache:"no-store"}).then(async r=>{if(r.status===401)throw new Error("Sign in to view this private engine.");if(r.status===403)throw new Error("This engine is restricted to the TA-14 owner account.");if(!r.ok)throw new Error("SEO Intelligence is not available yet.");return r.json()}).then(d=>{setData(d);setStatus("")}).catch(e=>setStatus(e.message))},[]);
 const degraded=!!(data?.degraded?.identityAttribution||data?.degraded?.subscriptionAttribution);
 return <main className="relative min-h-screen overflow-hidden bg-[#07111f] px-5 py-10 text-white">
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(14,165,233,.20),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(99,102,241,.17),transparent_30%),linear-gradient(180deg,#07111f_0%,#081522_48%,#0b1724_100%)]"/>
  <div className="pointer-events-none absolute inset-0 opacity-[.16] [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:48px_48px]"/>
  <div className="relative mx-auto max-w-7xl">
   <section className="relative mb-8 overflow-hidden rounded-[32px] border border-cyan-300/15 bg-gradient-to-br from-white/[0.08] via-white/[0.045] to-cyan-400/[0.03] p-7 shadow-[0_30px_100px_rgba(0,0,0,.38)] backdrop-blur-xl md:p-9">
    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"/>
    <div className="relative flex flex-wrap items-end justify-between gap-6">
     <div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.25em] text-cyan-100"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,.95)]"/>TA-14 Private Institutional Engine</div><h1 className="bg-gradient-to-r from-white via-cyan-100 to-sky-300 bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-6xl">SEO Intelligence</h1><p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">A private command surface for discovery, demand, commercial intent, authenticated identity, conversion and attributable revenue.</p><div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-300">{["DISCOVERY","INTENT","IDENTITY","CONVERSION","REVENUE"].map((x,i)=><span key={x} className="rounded-full border border-white/10 bg-black/15 px-3 py-1.5"><span className="mr-2 text-cyan-300">0{i+1}</span>{x}</span>)}</div></div>
     <Link href="/workspace/mission-control" className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm text-slate-200 shadow-lg transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.08]">← Mission Control</Link>
    </div>
   </section>
   {status&&<div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-slate-300 backdrop-blur">{status}</div>}
   {data&&<>
    <div className="mb-3 flex items-center justify-between gap-4"><div><div className="text-xs font-semibold uppercase tracking-[.22em] text-cyan-200">Thirty-day institutional signal</div><div className="mt-1 text-sm text-slate-500">Live private telemetry · refreshed from the Exchange evidence surface</div></div><div className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${degraded?"border-amber-300/25 bg-amber-300/[0.08] text-amber-200":"border-emerald-300/25 bg-emerald-300/[0.08] text-emerald-200"}`}>{degraded?"ATTRIBUTION DEGRADED":"SYSTEMS NOMINAL"}</div></div>
    <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Page views",data.summary.pageViews],["Unique visitors",data.summary.uniqueVisitors],["Tracked clicks",data.summary.clicks],["Search arrivals",data.summary.searchArrivals],["Intent events",data.summary.commercialIntentEvents],["Intent visitors",data.summary.commercialIntentVisitors],["Authenticated attribution",data.summary.authenticatedAttributedUsers],["Paid subscriptions",data.summary.paidSubscriptions]].map(([k,v],i)=><div key={String(k)} className={`relative overflow-hidden rounded-[22px] border bg-gradient-to-br ${metricStyles[i]} p-5 shadow-[0_18px_50px_rgba(0,0,0,.25)]`}><div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-white/55 shadow-[0_0_14px_rgba(255,255,255,.5)]"/><div className="text-4xl font-semibold tracking-tight text-white">{Number(v).toLocaleString()}</div><div className="mt-2 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-300">{k}</div></div>)}</div>
    <div className="mb-6 grid gap-3 sm:grid-cols-3"><div className="rounded-[24px] border border-emerald-300/20 bg-gradient-to-br from-emerald-400/15 to-cyan-400/[0.04] p-5 shadow-lg"><div className="text-4xl font-semibold">{data.summary.attributedPaidSubscriptions.toLocaleString()}</div><div className="mt-2 text-xs font-semibold uppercase tracking-[.16em] text-emerald-100">Attributed paid conversions</div></div><div className="rounded-[24px] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/15 to-blue-400/[0.04] p-5 shadow-lg"><div className="text-4xl font-semibold">${data.summary.attributedRevenue.toLocaleString()}</div><div className="mt-2 text-xs font-semibold uppercase tracking-[.16em] text-cyan-100">Attributed revenue</div></div><div className="rounded-[24px] border border-violet-300/20 bg-gradient-to-br from-violet-400/15 to-fuchsia-400/[0.04] p-5 shadow-lg"><div className="text-4xl font-semibold">{data.summary.averageIntentScore.toLocaleString()}</div><div className="mt-2 text-xs font-semibold uppercase tracking-[.16em] text-violet-100">Average intent score</div></div></div>
    <div className="mb-8 rounded-[22px] border border-cyan-300/15 bg-gradient-to-r from-cyan-400/[0.06] via-white/[0.035] to-indigo-400/[0.06] px-5 py-4 text-sm leading-6 text-slate-300 shadow-inner">Private owner view · rolling {data.windowDays}-day traffic window · no raw IP address stored. Behavioral intent is inferred, authenticated attribution requires a signed-in TA-14 identity, and paid conversion requires the authoritative billing ledger. Revenue remains $0 until separately verified monetary evidence is connected.</div>
    <div className="mb-4"><div className="text-xs font-semibold uppercase tracking-[.22em] text-cyan-200">Signal detail</div><h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">What the Exchange is telling us</h2></div>
    <div className="grid gap-5 lg:grid-cols-2"><Panel title="Paid subscription plans" items={data.subscriptionPlans} empty="No authoritative paid subscriptions recorded yet."/><Panel title="Commercial intent categories" items={data.intentTypes}/><Panel title="Pages producing intent" items={data.intentPages}/><Panel title="Top Exchange pages" items={data.pages}/><Panel title="What people click" items={data.clickTargets}/><Panel title="Search engines & AI referrers" items={data.searchEngines}/><Panel title="Search terms observed" items={data.searchQueries}/><Panel title="Traffic sources" items={data.referrers}/><Panel title="Approximate geographic demand" items={data.locations}/><Panel title="Campaign names" items={data.campaigns}/><Panel title="UTM sources" items={data.sources}/><Panel title="UTM terms / keyword campaigns" items={data.terms}/><Panel title="Devices" items={data.devices}/></div>
   </>}
  </div>
 </main>
}
