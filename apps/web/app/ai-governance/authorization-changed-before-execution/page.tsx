import Link from 'next/link';

export const metadata = {
  title: 'What Happens When AI Authorization Changes Before Execution? | TA-14',
  description: 'A practical governance guide to changed authorization, stale approvals, revalidation, and execution control for AI and agentic systems.',
};

export default function AuthorizationChangedBeforeExecutionPage() {
  return <main className="min-h-screen bg-slate-950 text-slate-100">
    <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">AI Execution Governance</p>
      <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">What happens when AI authorization changes before execution?</h1>
      <p className="mt-7 max-w-4xl text-lg leading-8 text-slate-300">An approval that was valid when an action was proposed may no longer be valid when the action reaches execution. If identity, authority, evidence, transaction terms, risk state, policy, or another material condition changes, a system needs a defensible answer to one question: does the old authorization still have standing?</p>
      <div className="mt-9 flex flex-wrap gap-4">
        <Link href="/execution-evidence-snapshot?utm_source=organic&utm_medium=problem_page&utm_campaign=authorization_change" className="rounded-md bg-cyan-300 px-6 py-3 font-semibold text-slate-950">Test one evidence question — $249</Link>
        <Link href="/execution-claim-review/intake?utm_source=organic&utm_medium=problem_page&utm_campaign=authorization_change" className="rounded-md border border-slate-600 px-6 py-3 font-semibold">Request a bounded claim review</Link>
      </div>
    </section>

    <section className="border-y border-slate-800 bg-slate-900/50"><div className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-3xl font-bold">The failure pattern is simple.</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {[
          ['1','Proposal','The action is initially supportable.'],
          ['2','Authorization','An approval, credential, limit, or authority state permits it.'],
          ['3','Material change','A relevant condition changes before execution.'],
          ['4','Execution question','Does the original authorization still bind?'],
        ].map(([n,t,b])=><article key={n} className="rounded-xl border border-slate-800 bg-slate-950 p-5"><span className="text-cyan-300 font-bold">{n}</span><h3 className="mt-2 font-semibold text-lg">{t}</h3><p className="mt-3 text-slate-300 leading-6">{b}</p></article>)}
      </div>
    </div></section>

    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-3xl font-bold">What a defensible system should be able to show</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {[
          ['Current authority state','Who or what had authority at proposal time, and what authority exists at execution time?'],
          ['Material-change detection','What changed, when did it change, and why is that change relevant to the pending action?'],
          ['Revalidation','Was the evidence and authority basis evaluated again before commitment or execution?'],
          ['Non-formation when support fails','If the action is no longer supportable, can the record prove that executable commitment did not validly form?'],
          ['Changed-condition determination','Did the system ALLOW, HOLD, DENY, or ESCALATE under the changed state, or produce its own native equivalent?'],
          ['Replayable evidence','Can an independent reviewer reconstruct the sequence from proposal through changed condition to outcome?'],
        ].map(([t,b])=><article key={t} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h3 className="text-xl font-semibold">{t}</h3><p className="mt-3 leading-7 text-slate-300">{b}</p></article>)}
      </div>
    </section>

    <section className="bg-slate-900"><div className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-3xl font-bold">Why this matters commercially</h2>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">Financial agents, payment workflows, privileged infrastructure actions, procurement systems, healthcare automation, and other consequential systems can all encounter a gap between approval and execution. The important claim is not merely that approval once existed. The important claim is that execution remained supportable when consequence was about to bind to reality.</p>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">TA-14 examines that claim without requiring your architecture to adopt TA-14 terminology. The object is bounded, the native evidence is preserved, changed conditions are introduced where agreed, and the result records what the system can and cannot support.</p>
    </div></section>

    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/5 p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Commercial examination</p>
        <h2 className="mt-3 text-3xl font-bold">Have a live authorization-change problem?</h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">Start with one bounded evidence question for $249, or request an Execution Claim Review from $750 when the issue requires changed-condition, failure, authority, or replay analysis. Payment buys the work—not a favorable result.</p>
        <div className="mt-7 flex flex-wrap gap-4"><Link href="/execution-evidence-snapshot?utm_source=organic&utm_medium=problem_page&utm_campaign=authorization_change" className="rounded-md bg-cyan-300 px-6 py-3 font-semibold text-slate-950">Start with the $249 Snapshot</Link><Link href="/execution-claim-review?utm_source=organic&utm_medium=problem_page&utm_campaign=authorization_change" className="rounded-md border border-slate-600 px-6 py-3 font-semibold">See the full Claim Review</Link></div>
      </div>
    </section>
  </main>;
}
