'use client';

import Link from 'next/link';

const stages = [
  ['01', 'LIVE INTEROPERABILITY', 'ONUMA / RE1', 'A live information environment exposed the practical problem: machine-readable identity can be technically available while the selected identity or context can still be wrong.'],
  ['02', 'CONTRADICTION', 'Identity mismatch surfaced', 'The workflow did not become evidence of perfection. It became evidence of why consequential execution needs cross-checking, provenance, and correction.'],
  ['03', 'RECONSTRUCTION', 'Records before narrative', 'The event chronology was reconstructed against the API and records rather than silently rewritten after the mismatch was discovered.'],
  ['04', 'REVALIDATION', 'Changed context matters', 'A prior determination cannot simply ride forward when identity, evidence, authority, or material context has changed.'],
  ['05', 'PATENT PROVENANCE', 'U.S. Application 19/794,767', 'On September 2, 2026, USPTO electronically acknowledged receipt of the non-provisional filing directed to cross-architecture evidence-bound admissible execution and changed-context revalidation.'],
  ['06', 'NEXT REALITY', 'PAE operating-building boundary', 'The next proposed test moves from a corrected RE1 identity event toward unresolved equipment and incomplete information in an operating-building context, subject to access and permission.'],
];

const boundaries = [
  'The USPTO acknowledgement establishes receipt of the identified filing package; it does not establish allowance, issuance, patentability, validity, enforceability, novelty, or exclusivity.',
  'The ONUMA / RE1 interoperability activity and the patent filing are separate evidence streams. Their proximity and architectural relationship are shown as chronology, not as proof that one legally caused or validates the other.',
  'TA-14 does not represent that ONUMA, PAE, Kimon Onuma, or any participant has adopted, certified, or transferred governance authority to TA-14 unless separately documented.',
  'PAE operating-building work remains prospective until the required access, scope, authority, confidentiality, and publication boundaries are established.',
  'Unexpected failures and unresolved conditions remain part of the record; they are not converted into successful findings by narrative.',
];

export default function CrossArchitectureShowcase() {
  return (
    <main className="min-h-screen bg-[#050914] text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/registry/ta-14-admissible-execution-architecture" className="text-sm text-cyan-300 hover:text-cyan-200">← TA-14 Admissible Execution Architecture</Link>
          <Link href="/registry/ta-14-admissible-execution-architecture/patents" className="text-sm text-slate-400 hover:text-slate-200">Patent provenance registry →</Link>
        </div>

        <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-cyan-700/50 bg-gradient-to-br from-cyan-950/40 via-slate-950 to-indigo-950/30 p-8 shadow-2xl lg:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <p className="relative text-xs font-bold uppercase tracking-[0.32em] text-cyan-300">TA-14 Founding Interoperability Showcase</p>
          <h1 className="relative mt-5 max-w-5xl text-4xl font-black tracking-tight sm:text-6xl">Cross-Architecture Evidence-Bound Admissible Execution</h1>
          <p className="relative mt-5 max-w-4xl text-lg leading-8 text-slate-300">A provenance-first chronology connecting live interoperability, identity contradiction, record reconstruction, changed-context revalidation, patent filing, and the next operating-building test boundary.</p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-cyan-600/70 bg-cyan-950/50 px-4 py-2 text-sm font-semibold text-cyan-200">U.S. 19/794,767</span>
            <span className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-300">NON-PROVISIONAL §111(a)</span>
            <span className="rounded-full border border-emerald-700/70 bg-emerald-950/30 px-4 py-2 text-sm font-semibold text-emerald-200">USPTO RECEIPT 2026-09-02</span>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs uppercase tracking-wider text-slate-500">Architecture</p><p className="mt-2 font-bold">Cross-Architecture</p><p className="mt-2 text-sm text-slate-400">Independent systems remain independently attributable.</p></div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs uppercase tracking-wider text-slate-500">Condition</p><p className="mt-2 font-bold">Evidence-Bound</p><p className="mt-2 text-sm text-slate-400">Capability alone does not establish admissible consequence.</p></div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs uppercase tracking-wider text-slate-500">Change</p><p className="mt-2 font-bold">Δ Context</p><p className="mt-2 text-sm text-slate-400">Material change can invalidate prior reliance.</p></div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs uppercase tracking-wider text-slate-500">Control</p><p className="mt-2 font-bold">Revalidate</p><p className="mt-2 text-sm text-slate-400">Current evidence and authority must support the current action.</p></div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs uppercase tracking-wider text-slate-500">Boundary</p><p className="mt-2 font-bold">Before Execution</p><p className="mt-2 text-sm text-slate-400">No admissible evidence. No admissible execution.</p></div>
        </section>

        <section className="mt-12">
          <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-300">Founding chronology</p><h2 className="mt-2 text-3xl font-bold">From live contradiction to governed continuation</h2></div>
          <div className="space-y-4">{stages.map(([n, label, title, text]) => <article key={n} className="grid gap-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:grid-cols-[72px_1fr]"><div className="text-3xl font-black text-cyan-400/70">{n}</div><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p><h3 className="mt-1 text-xl font-bold">{title}</h3><p className="mt-2 max-w-4xl leading-7 text-slate-300">{text}</p></div></article>)}</div>
        </section>

        <section className="mt-12 overflow-hidden rounded-[2rem] border border-cyan-700/60 bg-cyan-950/20 p-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">The patent provenance moment</p>
          <h2 className="mt-3 text-3xl font-black">Systems and Methods for Cross-Architecture Evidence-Bound Admissible Execution and Changed-Context Revalidation</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4"><div className="rounded-xl bg-slate-950/60 p-4"><p className="text-xs text-slate-500">APPLICATION</p><p className="mt-1 font-mono font-bold text-cyan-200">19/794,767</p></div><div className="rounded-xl bg-slate-950/60 p-4"><p className="text-xs text-slate-500">RECEIVED</p><p className="mt-1 font-bold">Sep 2, 2026</p></div><div className="rounded-xl bg-slate-950/60 p-4"><p className="text-xs text-slate-500">TIME</p><p className="mt-1 font-bold">08:27:08 AM ET</p></div><div className="rounded-xl bg-slate-950/60 p-4"><p className="text-xs text-slate-500">SPECIFICATION</p><p className="mt-1 font-bold">23 pages • digest recorded</p></div></div>
          <p className="mt-6 max-w-5xl leading-7 text-slate-300">The filing record and the live interoperability work are preserved as separate evidence streams. Their significance here is the convergence of the architectural questions they expose: identity, evidence, changed context, revalidation, authority, and consequence before execution.</p>
        </section>

        <section className="mt-12 rounded-[2rem] border border-amber-800/50 bg-amber-950/20 p-8"><p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Evidence boundaries</p><h2 className="mt-2 text-2xl font-bold">What this showcase does not claim</h2><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{boundaries.map((b) => <li key={b} className="rounded-xl border border-amber-900/40 bg-slate-950/30 p-4">{b}</li>)}</ul></section>

        <section className="mt-12 rounded-[2rem] border border-slate-800 bg-slate-900/60 p-8 text-center"><p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Forward path</p><p className="mt-4 text-xl font-bold sm:text-2xl">RE1 → Cross-check → Reconstruction → Revalidation → Patent Provenance → PAE Operating Building</p><p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-slate-400">The next stage is not pre-declared as a success. The building, evidence, authority, and observed conditions determine what becomes supportable.</p></section>
      </div>
    </main>
  );
}
