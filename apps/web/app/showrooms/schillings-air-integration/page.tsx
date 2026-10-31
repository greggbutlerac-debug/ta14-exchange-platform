"use client";
import Image from "next/image";
import { useMemo, useState } from "react";

const paths = {
  hero: "/HVAC Integration Architecture and Governance.png",
  workflow: "/TA-14 HVAC Performance Workflow.png",
  before: "/HVAC Retrofit Governance_ Before and After.png",
  owner: "/Building Owner HVAC Verification Report.png",
  evidence: "/HVAC Governance Evidence Dashboard.png",
  matrix: "/Four Determinations_ TA-14 HVAC Governance Matrix.png",
  deployment: "/TA-14 Deployment Pathway Infographic.png",
  overview: "/Schillings Air × TA-14 HVAC Governance Architecture.png",
  retrofit: "/HVAC Governance Before and After.png",
  pdf: "/TA14_Schillings_Integration_Technical_Proposal_v1%20(1).pdf",
};
const chain = [
  ["Reality", "What actually occurred at the equipment or in the space?", "A physical observation or intervention request exists."],
  ["Record", "Can the observation be attributed to an identified source?", "A time-stamped, source-identified measurement is captured."],
  ["Continuity", "Has the evidence remained traceable and current?", "Provenance, freshness and relevant changes remain accounted for."],
  ["Admissibility", "Is the evidence fit for this specific decision?", "Quality, relevance and applicable limits have been examined."],
  ["Binding", "Does the proposed action have current authority and scope?", "Identity, permissions, scope and changed context are checked."],
  ["Commit", "Is the exact consequence authorized now?", "A bounded authorization is recorded before action."],
  ["Execution", "Did the authorized action occur as permitted?", "Actual actuation or technician work is attributable and recorded."],
  ["Outcome", "What happened afterward?", "Post-action evidence is captured without assuming success."],
];
type Result = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
export default function Page() {
  const [fresh, setFresh] = useState(true);
  const [source, setSource] = useState(true);
  const [authority, setAuthority] = useState(true);
  const [safe, setSafe] = useState(true);
  const [conflict, setConflict] = useState(false);
  const [selected, setSelected] = useState(0);
  const [run, setRun] = useState(0);
  const result: Result = useMemo(() => {
    if (!safe) return "DENY";
    if (conflict) return "ESCALATE";
    if (!fresh || !source || !authority) return "HOLD";
    return "ALLOW";
  }, [safe, conflict, fresh, source, authority]);
  const reasons = {
    ALLOW: "Illustrative checks pass. A real gate would still revalidate at binding and commit.",
    HOLD: "Missing or stale evidence or missing authority prevents admissible execution.",
    DENY: "The proposed action violates a hard safety or policy boundary.",
    ESCALATE: "Conflicting instructions require a designated accountable authority.",
  };
  const color = { ALLOW: "text-emerald-300 border-emerald-400/50 bg-emerald-400/10", HOLD: "text-amber-200 border-amber-300/50 bg-amber-300/10", DENY: "text-rose-300 border-rose-400/50 bg-rose-400/10", ESCALATE: "text-violet-300 border-violet-400/50 bg-violet-400/10" };
  const checks = [
    { label: "Evidence within freshness window", value: fresh, set: setFresh },
    { label: "Source identity and continuity established", value: source, set: setSource },
    { label: "Authorized actor and scope present", value: authority, set: setAuthority },
    { label: "Safety and policy boundary satisfied", value: safe, set: setSafe },
    { label: "Conflicting authority requires review", value: conflict, set: setConflict },
  ];
  return <main className="min-h-screen bg-[#06121d] text-white">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 py-6">
        <a href="/" className="text-sm font-black tracking-[.2em] text-cyan-300">TA-14 AUTHORITY</a>
        <div className="flex gap-5 text-xs font-bold tracking-wide text-slate-300"><a href="#simulator" className="hover:text-cyan-300">LIVE DEMO</a><a href="#architecture" className="hover:text-cyan-300">ARCHITECTURE</a><a href="#pilot" className="hover:text-cyan-300">PAID PILOT</a></div>
      </nav>
      <header className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="text-xs font-bold tracking-[.24em] text-cyan-300">SCHILLINGS AIR × TA-14 · PROPOSED INTEGRATION</p>
          <h1 className="mt-6 text-5xl font-black leading-[1.08] tracking-tight sm:text-7xl">A building can measure.<br/><span className="text-cyan-300">Can it justify acting?</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300">Connect measurement-led HVAC retrofit decisions to a traceable chain of evidence, authority, execution and examined outcomes.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#simulator" className="rounded-lg bg-cyan-300 px-6 py-3 font-bold text-[#06121d]">Operate the demonstration</a><a href="#architecture" className="rounded-lg border border-white/30 px-6 py-3 font-semibold">Explore the eight-link chain</a></div>
          <p className="mt-7 max-w-xl border-l-2 border-amber-300 pl-4 text-sm leading-relaxed text-amber-100">Independent technical concept. No Schillings Air partnership, integration or field outcome is claimed. All sample data and records are fictional.</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-cyan-300/20 bg-white shadow-2xl shadow-cyan-950"><Image src={paths.hero} width={1536} height={1024} unoptimized alt="Conceptual HVAC architecture illustration" className="h-auto w-full"/></div>
      </header>
      <section className="grid gap-4 border-y border-white/10 py-7 text-center sm:grid-cols-4">
        {[["01","Observe"],["02","Examine"],["03","Authorize"],["04","Verify"]].map(([n,t])=><div key={n}><p className="text-sm font-bold text-cyan-300">{n}</p><p className="mt-1 text-xl font-semibold">{t}</p></div>)}
      </section>
      <section className="grid items-center gap-8 border-t border-white/10 py-16 lg:grid-cols-2"><div><p className="text-xs font-bold tracking-[.2em] text-cyan-300">SYSTEM INTEGRATION</p><h2 className="mt-3 text-4xl font-black">Preserve existing engineering. Add a decision boundary.</h2><p className="mt-5 text-lg leading-relaxed text-slate-300">A proposed separation between the source systems that measure and operate the building and the governance process that examines whether a consequential request has standing. This is a conceptual interface, not a validated Schillings Air implementation.</p></div><div className="overflow-hidden rounded-xl bg-white"><Image src={paths.overview} width={1536} height={1024} unoptimized alt="Illustrative Schillings Air and TA-14 architecture" className="h-auto w-full"/></div></section>
      <section id="simulator" className="scroll-mt-8 py-20">
        <p className="text-xs font-bold tracking-[.2em] text-cyan-300">INTERACTIVE GOVERNANCE LAB · SIMULATED</p>
        <h2 className="mt-3 text-4xl font-black sm:text-5xl">Change the evidence. Change the decision.</h2>
        <p className="mt-5 max-w-3xl text-lg text-slate-300">Hypothetical request: increase outdoor-air intake for an AHU after elevated CO₂ observations. Toggle each condition to see how a simplified TA-14 determination changes. This is an educational simulation, not a connected HVAC controller or the production governance engine.</p>
        <div className="mt-9 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-2xl border border-white/15 bg-[#102739] p-6 sm:p-8">
            <p className="mb-5 text-xs font-bold tracking-widest text-slate-400">INPUT CONDITIONS</p>
            <div className="space-y-3">{checks.map((c,i)=><label key={c.label} className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#071927] p-4"><span className="text-sm font-medium sm:text-base">{c.label}</span><input type="checkbox" checked={c.value} onChange={e=>c.set(e.target.checked)} className="h-5 w-5 shrink-0 accent-cyan-300" aria-label={c.label}/></label>)}</div>
            <button type="button" onClick={()=>{setFresh(true);setSource(true);setAuthority(true);setSafe(true);setConflict(false);setRun(n=>n+1);}} className="mt-6 rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold hover:border-cyan-300">Reset scenario</button>
          </div>
          <div className="flex flex-col rounded-2xl border border-white/15 bg-[#102739] p-6 sm:p-8">
            <p className="text-xs font-bold tracking-widest text-slate-400">SIMULATED DETERMINATION</p>
            <div aria-live="polite" className={"mt-6 rounded-xl border px-6 py-9 text-center "+color[result]}>
              <p className="text-5xl font-black tracking-tight sm:text-6xl">{result}</p>
              <p className="mt-4 text-sm leading-relaxed">{reasons[result]}</p>
            </div>
            <div className="mt-7 space-y-3 text-sm text-slate-300">
              <p><strong className="text-white">Requested consequence:</strong> Increase outdoor-air intake at AHU-3.</p>
              <p><strong className="text-white">Execution:</strong> No real command is issued.</p>
              <p><strong className="text-white">Revalidation:</strong> A real implementation would check live context at commit.</p>
              <p><strong className="text-white">Replay:</strong> Change any input to inspect a new determination.</p>
            </div>
            <p className="mt-auto pt-8 text-xs text-slate-400">Simplified rule ordering for demonstration only; not an implementation specification.</p>
          </div>
        </div>
      </section>
      <section className="grid items-center gap-8 border-t border-white/10 py-16 lg:grid-cols-2"><div className="overflow-hidden rounded-xl bg-white"><Image src={paths.evidence} width={1536} height={1024} unoptimized alt="Illustrative evidence and continuity dashboard" className="h-auto w-full"/></div><div><p className="text-xs font-bold tracking-[.2em] text-cyan-300">EVIDENCE CUSTODY</p><h2 className="mt-3 text-4xl font-black">A reading is not automatically admissible evidence.</h2><p className="mt-5 text-lg leading-relaxed text-slate-300">Examine origin, time, continuity, fitness and decision-specific authority. All identifiers, readings, signatures and verification indicators shown in this specimen are fictional.</p></div></section>
      <section className="grid items-center gap-8 border-t border-white/10 py-16 lg:grid-cols-2"><div><p className="text-xs font-bold tracking-[.2em] text-cyan-300">RUNTIME CONSEQUENCES</p><h2 className="mt-3 text-4xl font-black">Four determinations. Different obligations.</h2><p className="mt-5 text-lg leading-relaxed text-slate-300">ALLOW is bounded, HOLD awaits evidence, DENY blocks impermissible action, and ESCALATE transfers an unresolved question to accountable authority. Safety interlocks remain independently controlling.</p></div><div className="overflow-hidden rounded-xl bg-white"><Image src={paths.matrix} width={1536} height={1024} unoptimized alt="Illustrative four-determination governance matrix" className="h-auto w-full"/></div></section>
      <section id="architecture" className="scroll-mt-8 border-t border-white/10 py-20">
        <p className="text-xs font-bold tracking-[.2em] text-cyan-300">THE PARENT ARCHITECTURE</p>
        <h2 className="mt-3 text-4xl font-black sm:text-5xl">Eight links. One accountable consequence.</h2>
        <p className="mt-5 max-w-3xl text-lg text-slate-300">Select a link to examine the question that must be answered before the next boundary can be crossed.</p>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{chain.map(([name],i)=><button key={name} onClick={()=>setSelected(i)} type="button" aria-pressed={selected===i} className={"min-h-28 rounded-xl border p-4 text-left transition "+(selected===i?"border-cyan-300 bg-cyan-300/15":"border-white/15 bg-[#102739] hover:border-cyan-300/60")}><span className="text-xs font-bold text-cyan-300">{String(i+1).padStart(2,"0")}</span><span className="mt-3 block font-bold">{name}</span></button>)}</div>
          <div className="flex min-h-60 flex-col justify-center rounded-xl border border-cyan-300/30 bg-[#102739] p-7">
            <p className="text-xs font-bold tracking-widest text-cyan-300">BOUNDARY {String(selected+1).padStart(2,"0")}</p>
            <h3 className="mt-3 text-3xl font-bold">{chain[selected][0]}</h3>
            <p className="mt-5 text-xl leading-relaxed">{chain[selected][1]}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">{chain[selected][2]}</p>
          </div>
        </div>
      </section>
      <section className="border-t border-white/10 py-20">
        <p className="text-xs font-bold tracking-[.2em] text-cyan-300">HVAC PERFORMANCE RECORD</p>
        <h2 className="mt-3 text-4xl font-black">Diagnose after the baseline is frozen.</h2>
        <p className="my-6 max-w-3xl text-lg leading-relaxed text-slate-300">HPR-BL → NIRET → DDD → authorized intervention, if justified → HPR-V. The baseline must be complete before the Declared Diagnostic Determination. Routine maintenance does not automatically require invasive work.</p>
        <div className="overflow-hidden rounded-xl bg-white"><Image src={paths.workflow} width={1536} height={1024} unoptimized alt="Illustrative HVAC performance workflow" className="w-full"/></div>
      </section>
      <section className="grid items-center gap-8 border-t border-white/10 py-20 lg:grid-cols-2">
        <div><p className="text-xs font-bold tracking-[.2em] text-cyan-300">EXAMINED OUTCOME</p><h2 className="mt-3 text-4xl font-black">An intervention is not proof of improvement.</h2><p className="mt-5 text-lg leading-relaxed text-slate-300">A post-intervention record should distinguish measured change, uncertainty, limitations and the authority under which work occurred. The pictured before-and-after measurements are fictional and cannot establish actual savings or air-quality improvement.</p></div>
        <div className="overflow-hidden rounded-xl bg-white"><Image src={paths.before} width={1536} height={1024} unoptimized alt="Fictional HVAC before and after example" className="w-full"/></div>
      </section>
      <section className="grid items-center gap-8 border-t border-white/10 py-16 lg:grid-cols-2"><div className="overflow-hidden rounded-xl bg-white"><Image src={paths.retrofit} width={1536} height={1024} unoptimized alt="Illustrative HVAC governance before and after comparison" className="h-auto w-full"/></div><div><p className="text-xs font-bold tracking-[.2em] text-cyan-300">RETROFIT GOVERNANCE</p><h2 className="mt-3 text-4xl font-black">A decision trail before and after intervention.</h2><p className="mt-5 text-lg leading-relaxed text-slate-300">An example of how baseline records, authorization and post-intervention examination can be kept distinct. No depicted improvement is a verified Schillings Air result.</p></div></section>
      <section id="pilot" className="scroll-mt-8 border-t border-white/10 py-20">
        <p className="text-xs font-bold tracking-[.2em] text-cyan-300">PROPOSED COMMERCIAL ENGAGEMENT</p>
        <h2 className="mt-3 text-4xl font-black">Start with a paid shadow-mode pilot.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[["A","Scope & contracts","Select an asset, action class, evidence sources, authority roles and acceptance tests."],["B","Read-only evaluation","Replay representative decisions without controlling equipment. Log gaps and failure cases."],["C","Separate control decision","Only consider bounded execution after safety, security, timing and changed-context checks are accepted."]].map(([n,t,d])=><div key={n} className="rounded-xl border border-white/15 bg-[#102739] p-7"><p className="text-3xl font-black text-cyan-300">{n}</p><h3 className="mt-4 text-xl font-bold">{t}</h3><p className="mt-3 leading-relaxed text-slate-300">{d}</p></div>)}
        </div>
        <div className="mt-9 overflow-hidden rounded-xl bg-white"><Image src={paths.deployment} width={1536} height={1024} unoptimized alt="Illustrative phased deployment pathway" className="h-auto w-full"/></div>
        <div className="mt-10 rounded-2xl border border-cyan-300/25 bg-[#102739] p-8">
          <h3 className="text-2xl font-bold">What a pilot must produce</h3>
          <p className="mt-4 max-w-4xl leading-relaxed text-slate-300">A documented interface map, evidence contract, simulated decision logs, failure-mode replay, explicit operational boundaries, acceptance results and a commercial recommendation. No integration or performance outcome is pre-approved.</p>
          <a href={paths.pdf} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-lg bg-cyan-300 px-6 py-3 font-bold text-[#06121d]">Read technical proposal v1 (draft PDF)</a>
        </div>
      </section>
      <section className="border-t border-white/10 py-20">
        <p className="text-xs font-bold tracking-[.2em] text-cyan-300">SPECIMEN OWNER RECORD</p>
        <h2 className="mt-3 text-4xl font-black">Show the evidence. Not just the score.</h2>
        <p className="my-6 max-w-3xl text-lg text-slate-300">The illustration below is a fictional report mockup. Its signatures, QR code, facility, hashes, approvals and numerical improvements are not genuine verification artifacts.</p>
        <div className="overflow-hidden rounded-xl bg-white"><Image src={paths.owner} width={1536} height={1024} unoptimized alt="Fictional building-owner verification report specimen" className="w-full"/></div>
      </section>
      <footer className="border-t border-white/10 py-10 text-sm text-slate-400">
        <p className="font-bold text-white">TA-14 Authority Governance Institution · Technical exploration</p>
        <p className="mt-2">No admissible evidence. No admissible execution.</p>
        <p className="mt-2">Draft proposal only. No partnership, endorsement or live deployment is represented.</p>
      </footer>
    </div>
  </main>;
}
