import Link from 'next/link';

export const metadata = {
  title: 'Execution-Bounded Evidence Sufficiency | TA-14 Showcase',
  description: 'How TA-14 translates contextual execution judgment into machine-verifiable evidence obligations without probabilistic risk scoring.',
};

const obligations = [
  ['Reality','What present condition must be established?'],
  ['Record','Which evidence objects must exist and remain identifiable?'],
  ['Continuity','Do those records still correspond to the current context?'],
  ['Admissibility','Do they support this proposition and no broader decision scope?'],
  ['Binding','Are current authority, identity, constraints and scope bound to this consequence?'],
  ['Commit','Does the committed action remain within admitted evidence and authority?'],
  ['Execution','Do all required predicates retain standing at the immediate consequence boundary?'],
  ['Outcome','Is outcome preserved separately rather than inferred from execution telemetry?'],
];

const dispositions = [
  ['ALLOW','Every mandatory obligation required for the bounded route has present standing.'],
  ['HOLD','A required obligation is missing, stale, unresolved, superseded, or requires requalification.'],
  ['DENY','A required condition is contradicted, invalid, prohibited, or outside admitted scope.'],
  ['ESCALATE','The unresolved determination exceeds the available autonomous authority.'],
];

export default function EvidenceSufficiencyShowcase(){
 return <main className="min-h-screen bg-slate-950 text-slate-100">
  <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
   <p className="text-sm font-bold uppercase tracking-[.22em] text-cyan-300">TA-14 Admissible Execution Architecture · Artifact Showcase</p>
   <h1 className="mt-5 max-w-5xl text-4xl font-bold tracking-tight md:text-6xl">Execution-Bounded Evidence Sufficiency</h1>
   <p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">From contextual judgment to machine-verifiable admissibility without making a probabilistic risk score the execution rule.</p>
   <div className="mt-9 flex flex-wrap gap-4"><Link href="/artifacts/ta14-ea-000041" className="rounded-md bg-cyan-300 px-6 py-3 font-bold text-slate-950">Inspect executable artifact TA14-EA-000041 →</Link><Link href="/foundation/concepts/admissibility" className="rounded-md border border-slate-600 px-6 py-3 font-bold">Canonical admissibility definition</Link></div>
  </section>

  <section className="border-y border-slate-800 bg-slate-900/50"><div className="mx-auto max-w-6xl px-6 py-16">
   <p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-300">The boundary</p>
   <h2 className="mt-3 text-3xl font-bold">The machine is not asked: “How risky does this feel?”</h2>
   <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">The governed question is narrower: for this proposed consequence, at this moment, which obligations were declared mandatory—and does each one have present standing? Missing truth is not manufactured probabilistically. The decision scope cannot exceed what the admitted evidence and authority can support.</p>
  </div></section>

  <section className="mx-auto max-w-6xl px-6 py-20"><h2 className="text-3xl font-bold">The obligation set</h2><p className="mt-4 max-w-4xl leading-8 text-slate-300">Context becomes computationally testable by declaring proposition-specific predicates before consequence-bearing commitment.</p><div className="mt-9 grid gap-5 md:grid-cols-2">{obligations.map(([name,body],i)=><article key={name} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><div className="text-xs font-bold text-cyan-300">{String(i+1).padStart(2,'0')}</div><h3 className="mt-2 text-xl font-bold">{name}</h3><p className="mt-3 leading-7 text-slate-300">{body}</p></article>)}</div></section>

  <section className="border-y border-slate-800 bg-slate-900/50"><div className="mx-auto max-w-6xl px-6 py-20"><h2 className="text-3xl font-bold">Deterministic route state</h2><div className="mt-8 grid gap-5 md:grid-cols-2">{dispositions.map(([name,body])=><article key={name} className="rounded-xl border border-slate-700 bg-slate-950 p-6"><h3 className="text-xl font-black text-cyan-300">{name}</h3><p className="mt-3 leading-7 text-slate-300">{body}</p></article>)}</div><p className="mt-8 font-mono text-sm leading-7 text-slate-300">No 83% confidence threshold. No low/medium/high risk label standing in for evidence. No human approval button promoted into proof.</p></div></section>

  <section className="mx-auto max-w-6xl px-6 py-20"><h2 className="text-3xl font-bold">Changed-context replay</h2><div className="mt-8 space-y-4">{[
   ['T0','Declared obligations satisfied','ALLOW'],['T1','A material contextual fact changes','Prior standing cannot silently carry forward'],['T2','Continuity/currency obligation no longer has present standing','HOLD'],['T3','New qualifying evidence is recorded and the route is re-evaluated','REVALIDATE'],['T4','A new bounded determination is produced','ALLOW / HOLD / DENY / ESCALATE']
  ].map(([t,event,state])=><div key={t} className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-5 md:grid-cols-[80px_1fr_240px]"><b className="text-cyan-300">{t}</b><span>{event}</span><b>{state}</b></div>)}</div></section>

  <section className="border-y border-slate-800 bg-slate-900/50"><div className="mx-auto max-w-6xl px-6 py-20"><h2 className="text-3xl font-bold">What this demonstrates—and what it does not</h2><div className="mt-8 grid gap-6 md:grid-cols-2"><article className="rounded-xl border border-emerald-500/30 bg-slate-950 p-7"><h3 className="font-bold text-emerald-300">Demonstrates</h3><p className="mt-4 leading-8 text-slate-300">A declared contextual obligation set can be represented as explicit predicates and evaluated deterministically across the execution chain. The resulting determination is reproducible and inspectable.</p></article><article className="rounded-xl border border-amber-500/30 bg-slate-950 p-7"><h3 className="font-bold text-amber-300">Does not claim</h3><p className="mt-4 leading-8 text-slate-300">Universal truth, guaranteed safety, complete domain knowledge, or a general solution to AI alignment. The architecture governs whether the declared evidentiary and authority obligations for a bounded consequence have standing.</p></article></div></div></section>

  <section className="mx-auto max-w-6xl px-6 py-20"><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-300">Inspect, don't take our word for it</p><h2 className="mt-3 text-3xl font-bold">The showcase points to the executable proof object.</h2><p className="mt-5 max-w-4xl leading-8 text-slate-300">TA14-EA-000041 exposes its frozen specification, eight-stage execution trace, machine-generated receipt, evidence manifest, cryptographic package root, source implementation, and claims boundary.</p><Link href="/artifacts/ta14-ea-000041" className="mt-7 inline-block rounded-md bg-cyan-300 px-6 py-3 font-bold text-slate-950">Open TA14-EA-000041 →</Link></section>
 </main>;
}
