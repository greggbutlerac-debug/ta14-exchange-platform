import Link from 'next/link';

export const metadata = {
  title: 'What If the Evidence Changes Before AI Execution? | TA-14',
  description: 'How changed evidence, stale records, material updates, and revalidation affect AI execution standing before consequence occurs.',
};

export default function EvidenceChangedBeforeExecutionPage() {
  return <main className="min-h-screen bg-slate-950 text-slate-100">
    <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">AI Evidence Governance</p>
      <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">What if the evidence changes before AI execution?</h1>
      <p className="mt-7 max-w-4xl text-lg leading-8 text-slate-300">A system can be supportable at one moment and unsupported later. If the evidence behind an action changes before execution, the important question is not whether the evidence was once valid. The important question is whether it still has standing when consequence is about to occur.</p>
      <div className="mt-9 flex flex-wrap gap-4">
        <Link href="/execution-evidence-snapshot?utm_source=organic&utm_medium=problem_page&utm_campaign=evidence_change" className="rounded-md bg-emerald-300 px-6 py-3 font-semibold text-slate-950">Test one evidence question — $249</Link>
        <Link href="/execution-claim-review/intake?utm_source=organic&utm_medium=problem_page&utm_campaign=evidence_change" className="rounded-md border border-slate-600 px-6 py-3 font-semibold">Request a bounded claim review</Link>
      </div>
    </section>

    <section className="border-y border-slate-800 bg-slate-900/50"><div className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-3xl font-bold">The stale-evidence problem</h2>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">A model, agent, workflow, or approval process may rely on records that were true when first captured: identity data, account state, policy status, environmental conditions, risk classification, customer consent, inventory state, financial limits, or other execution-relevant facts. If those facts materially change, old evidence can become historically accurate but presently insufficient.</p>
    </div></section>

    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-3xl font-bold">What a defensible execution record should show</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {[
          ['Evidence identity','What exact evidence object, version, source, or record supported the original action?'],
          ['Continuity','Can the system show that the evidence used at execution is the same evidence—or a governed successor—to what was originally relied upon?'],
          ['Material change','What changed, when did it change, and why could that change affect execution standing?'],
          ['Revalidation','Was the proposition evaluated again against the changed evidence before binding or commitment?'],
          ['Refusal or hold behavior','If support was lost, did the system stop, narrow, hold, deny, or escalate rather than execute on stale standing?'],
          ['Replay','Can a reviewer reconstruct the original support, the change, the revalidation decision, and the final outcome?'],
        ].map(([t,b])=><article key={t} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h3 className="text-xl font-semibold">{t}</h3><p className="mt-3 leading-7 text-slate-300">{b}</p></article>)}
      </div>
    </section>

    <section className="bg-slate-900"><div className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-3xl font-bold">Historical validation is not always present standing.</h2>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">A prior approval, validation, test result, or evidence package can remain historically true while no longer being sufficient for a later execution decision. That distinction matters in finance, autonomous workflows, enterprise infrastructure, AI governance, healthcare, and other domains where conditions can change between proposal and consequence.</p>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">TA-14 examines whether the evidence actually retained execution standing under the changed condition. The architecture under review remains sovereign; the examination does not rewrite it into TA-14 terminology.</p>
    </div></section>

    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/5 p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Commercial examination</p>
        <h2 className="mt-3 text-3xl font-bold">Have a stale-evidence or changed-condition problem?</h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">Start with a $249 Execution Evidence Snapshot when you need one narrow answer. Use the $750+ Execution Claim Review when the question requires changed-condition testing, failure behavior, authority analysis, or replay. Payment buys examination work—not a favorable result.</p>
        <div className="mt-7 flex flex-wrap gap-4"><Link href="/execution-evidence-snapshot?utm_source=organic&utm_medium=problem_page&utm_campaign=evidence_change" className="rounded-md bg-emerald-300 px-6 py-3 font-semibold text-slate-950">Start with the $249 Snapshot</Link><Link href="/execution-claim-review?utm_source=organic&utm_medium=problem_page&utm_campaign=evidence_change" className="rounded-md border border-slate-600 px-6 py-3 font-semibold">See the full Claim Review</Link></div>
      </div>
    </section>
  </main>;
}
