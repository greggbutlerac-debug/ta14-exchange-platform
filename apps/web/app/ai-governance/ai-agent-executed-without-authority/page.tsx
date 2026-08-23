import Link from 'next/link';

export const metadata = {
  title: 'AI Agent Executed Without Authority: What Must You Prove? | TA-14',
  description: 'A practical examination of unauthorized AI agent execution, authority boundaries, commitment formation, bypass, evidence, and replay.',
};

export default function AgentExecutedWithoutAuthorityPage() {
  return <main className="min-h-screen bg-slate-950 text-slate-100">
    <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-300">Agentic AI Execution Control</p>
      <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">An AI agent executed without authority. What must you prove now?</h1>
      <p className="mt-7 max-w-4xl text-lg leading-8 text-slate-300">When an agent reaches a consequential action without valid authority, a chat transcript or policy statement is not enough. The record needs to establish what the agent attempted, what authority existed, where enforcement should have occurred, whether executable commitment formed, how the action reached consequence, and whether the sequence can be replayed.</p>
      <div className="mt-9 flex flex-wrap gap-4">
        <Link href="/execution-evidence-snapshot?utm_source=organic&utm_medium=problem_page&utm_campaign=unauthorized_agent_execution" className="rounded-md bg-rose-300 px-6 py-3 font-semibold text-slate-950">Examine the evidence — $249</Link>
        <Link href="/execution-claim-review/intake?utm_source=organic&utm_medium=problem_page&utm_campaign=unauthorized_agent_execution" className="rounded-md border border-slate-600 px-6 py-3 font-semibold">Request a full claim review</Link>
      </div>
    </section>

    <section className="border-y border-slate-800 bg-slate-900/50"><div className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-3xl font-bold">The incident question is not merely “what did the model say?”</h2>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">A consequential agent can move through tools, APIs, payment rails, infrastructure, workflows, or delegated services. The critical governance question is whether valid authority existed at the point where the action became executable—and what control actually prevented or permitted commitment.</p>
    </div></section>

    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-3xl font-bold">Evidence an investigation should preserve</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {[
          ['Requested action','The exact consequential action the agent proposed or attempted, including target and material parameters.'],
          ['Authority state','The human, institutional, credential, policy, or delegated authority that existed—or did not exist—at the relevant moment.'],
          ['Execution route','The tools, services, APIs, or alternate paths through which the action moved toward consequence.'],
          ['Commit formation','Whether a valid executable commitment formed, when it formed, and what evidence supported that formation.'],
          ['Control response','Whether the system allowed, held, denied, escalated, bypassed, or failed to evaluate the action.'],
          ['Outcome and replay','What actually happened in reality and whether the full chain can be independently reconstructed.'],
        ].map(([t,b])=><article key={t} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h3 className="text-xl font-semibold">{t}</h3><p className="mt-3 leading-7 text-slate-300">{b}</p></article>)}
      </div>
    </section>

    <section className="bg-slate-900"><div className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-3xl font-bold">Logging the incident is not the same as governing execution.</h2>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">Observability can show that an event occurred. Governance has to answer whether the action was supportable, whether authority was admissible, whether commitment should have formed, and whether the execution path was actually controlled. Those are different claims and should be examined separately.</p>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">TA-14 can examine one bounded execution claim without requiring the system under review to become TA-14. Native architecture and evidence remain native; unsupported findings and bypass conditions remain valid examination results.</p>
    </div></section>

    <section className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-2xl font-bold">Related execution-evidence problems</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/ai-governance/authorization-changed-before-execution" className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-rose-300/60"><h3 className="font-semibold">Did authority change first?</h3><p className="mt-2 text-sm leading-6 text-slate-300">Examine whether a previously valid authorization lost standing before execution.</p></Link>
        <Link href="/ai-governance/evidence-changed-before-execution" className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-rose-300/60"><h3 className="font-semibold">Did the evidence become stale?</h3><p className="mt-2 text-sm leading-6 text-slate-300">Determine whether changed evidence should have triggered revalidation before consequence.</p></Link>
        <Link href="/ai-governance/prove-ai-action-was-blocked" className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-rose-300/60"><h3 className="font-semibold">Compare against a blocking claim</h3><p className="mt-2 text-sm leading-6 text-slate-300">See what evidence would be needed to prove an action actually stopped instead.</p></Link>
      </div>
      <Link href="/ai-governance/execution-evidence" className="mt-6 inline-block font-semibold text-rose-300">Explore the complete AI Execution Evidence hub →</Link>
    </section>

    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="rounded-2xl border border-rose-300/30 bg-rose-300/5 p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">Commercial examination</p>
        <h2 className="mt-3 text-3xl font-bold">Need to establish what actually failed?</h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">Use the $249 Execution Evidence Snapshot for one narrow evidence question. Use the $750+ Execution Claim Review when the incident requires authority analysis, alternate-route examination, changed conditions, commitment analysis, or replay. Payment buys the examination—not a favorable conclusion.</p>
        <div className="mt-7 flex flex-wrap gap-4"><Link href="/execution-evidence-snapshot?utm_source=organic&utm_medium=problem_page&utm_campaign=unauthorized_agent_execution" className="rounded-md bg-rose-300 px-6 py-3 font-semibold text-slate-950">Start with the $249 Snapshot</Link><Link href="/execution-claim-review?utm_source=organic&utm_medium=problem_page&utm_campaign=unauthorized_agent_execution" className="rounded-md border border-slate-600 px-6 py-3 font-semibold">See the full Claim Review</Link></div>
      </div>
    </section>
  </main>;
}
