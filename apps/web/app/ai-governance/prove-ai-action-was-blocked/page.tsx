import Link from 'next/link';

export const metadata = {
  title: 'How Do You Prove an AI Action Was Actually Blocked? | TA-14',
  description: 'Learn what evidence distinguishes a logged rejection from proof that an AI or agentic action could not form executable commitment or reach execution.',
};

export default function ProveAiActionWasBlockedPage() {
  return <main className="min-h-screen bg-slate-950 text-slate-100">
    <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">AI Control Evidence</p>
      <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">How do you prove an AI action was actually blocked?</h1>
      <p className="mt-7 max-w-4xl text-lg leading-8 text-slate-300">A rejection message is not automatically proof of restraint. A policy decision is not automatically proof that execution could not occur. If your system claims it blocked an AI or agentic action, the evidence should establish where the action stopped and whether any executable commitment or alternate execution path remained available.</p>
      <div className="mt-9 flex flex-wrap gap-4">
        <Link href="/execution-evidence-snapshot?utm_source=organic&utm_medium=problem_page&utm_campaign=blocked_action_proof" className="rounded-md bg-cyan-300 px-6 py-3 font-semibold text-slate-950">Examine one blocking claim — $249</Link>
        <Link href="/execution-claim-review/intake?utm_source=organic&utm_medium=problem_page&utm_campaign=blocked_action_proof" className="rounded-md border border-slate-600 px-6 py-3 font-semibold">Request a bounded review</Link>
      </div>
    </section>

    <section className="border-y border-slate-800 bg-slate-900/50"><div className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-3xl font-bold">“Rejected” and “could not execute” are different claims.</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-amber-400/30 bg-slate-950 p-6"><h3 className="text-xl font-semibold text-amber-200">Weak evidence</h3><ul className="mt-5 space-y-3 text-slate-300"><li>• UI says denied</li><li>• policy engine returned false</li><li>• audit log contains a rejection</li><li>• model says it refused</li><li>• workflow reports an error</li></ul></article>
        <article className="rounded-xl border border-cyan-300/30 bg-slate-950 p-6"><h3 className="text-xl font-semibold text-cyan-200">Stronger execution evidence</h3><ul className="mt-5 space-y-3 text-slate-300"><li>• request and authority state are identified</li><li>• governing determination is preserved</li><li>• executable commitment is shown not to have validly formed</li><li>• downstream execution is absent or causally prevented</li><li>• relevant alternate routes are bounded and tested</li></ul></article>
      </div>
    </div></section>

    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-3xl font-bold">Six questions a blocking claim should survive</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {[
          ['1. What action was attempted?','Identify the exact tool call, transaction, command, workflow action, or other consequential operation.'],
          ['2. What authority was required?','Establish the authority boundary that had to be satisfied before the action could proceed.'],
          ['3. What determination occurred?','Preserve the native decision or control result rather than replacing it with a retrospective narrative.'],
          ['4. Could executable commitment still form?','Show whether the action could acquire the state, token, transaction, approval, or other commitment needed for execution.'],
          ['5. Did anything execute anyway?','Inspect downstream requests, side effects, state changes, or other consequence evidence.'],
          ['6. Can the result be replayed?','A reviewer should be able to reconstruct why the action stopped and the boundary of what the evidence proves.'],
        ].map(([t,b])=><article key={t} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h3 className="font-semibold text-lg">{t}</h3><p className="mt-3 leading-7 text-slate-300">{b}</p></article>)}
      </div>
    </section>

    <section className="bg-slate-900"><div className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-3xl font-bold">The proof boundary matters.</h2>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">A route-specific control may prove that one governed path refused execution without proving that every external path to the same consequence was impossible. A truthful examination preserves that distinction. TA-14 does not turn a bounded blocking result into a universal claim unless the evidence actually supports it.</p>
    </div></section>

    <section className="mx-auto max-w-5xl px-6 py-20"><div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/5 p-8 md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Commercial examination</p>
      <h2 className="mt-3 text-3xl font-bold">Need to establish whether a control really blocked execution?</h2>
      <p className="mt-4 max-w-3xl leading-7 text-slate-300">Start with a $249 Execution Evidence Snapshot for one narrow blocking claim. Use the $750+ Execution Claim Review when the examination requires failure challenges, alternate-route analysis, authority testing, changed conditions, or replay. Payment buys examination work—not a predetermined result.</p>
      <div className="mt-7 flex flex-wrap gap-4"><Link href="/execution-evidence-snapshot?utm_source=organic&utm_medium=problem_page&utm_campaign=blocked_action_proof" className="rounded-md bg-cyan-300 px-6 py-3 font-semibold text-slate-950">Start the $249 Snapshot</Link><Link href="/execution-claim-review?utm_source=organic&utm_medium=problem_page&utm_campaign=blocked_action_proof" className="rounded-md border border-slate-600 px-6 py-3 font-semibold">See the $750+ Review</Link></div>
    </div></section>
  </main>;
}
