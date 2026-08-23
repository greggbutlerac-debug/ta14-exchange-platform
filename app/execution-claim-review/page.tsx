import Link from "next/link";

export const metadata = {
  title: "TA-14 Execution Claim Review | Test the Claim Before Consequence",
  description: "A bounded TA-14 examination of one consequential execution claim: freeze the claim, examine evidence and authority, challenge changed conditions, and preserve what the claim can and cannot support.",
};

const steps = [
  ["1", "Freeze one consequential claim", "Define exactly what the system, architecture, control, or process is claiming before examination begins."],
  ["2", "Bound evidence and authority", "Identify the evidence relied upon, authority asserted, execution boundary, and what is explicitly outside scope."],
  ["3", "Challenge the claim", "Introduce agreed changed conditions, failure cases, bypass conditions, and continuity breaks without rewriting the architecture."],
  ["4", "Preserve the result", "Return a bounded record of observed determinations, claims and non-claims, unresolved conditions, and disposition."],
];

export default function ExecutionClaimReviewPage() {
  return <main className="min-h-screen bg-slate-950 text-slate-100">
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28"><div className="max-w-4xl">
      <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">TA-14 Commercial Examination</p>
      <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Can your system actually support the consequential claim you are making?</h1>
      <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">The TA-14 Execution Claim Review is a bounded examination of one consequential execution claim. We do not certify the architecture, guarantee a favorable result, or rewrite the system to make it pass. We establish the object, preserve the boundary, challenge the proposition, and record what the evidence supports.</p>
      <div className="mt-9 flex flex-wrap gap-4"><Link href="/execution-claim-review/intake" className="rounded-md bg-amber-400 px-6 py-3 font-semibold text-slate-950">Request a $750 Claim Review</Link><Link href="/execution-evidence-snapshot" className="rounded-md border border-slate-600 px-6 py-3 font-semibold">Start with a $249 Snapshot</Link></div>
      <p className="mt-4 text-sm text-slate-400">Founding commercial pricing. Scope is confirmed in writing before custom work begins.</p>
    </div></section>
    <section className="border-y border-slate-800 bg-slate-900/50"><div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 md:grid-cols-3"><div><p className="text-sm uppercase text-slate-400">Starting price</p><p className="mt-2 text-3xl font-bold">$750</p></div><div><p className="text-sm uppercase text-slate-400">Object</p><p className="mt-2 text-xl font-semibold">One bounded claim</p></div><div><p className="text-sm uppercase text-slate-400">Success standard</p><p className="mt-2 text-xl font-semibold">Truthful, replayable record</p></div></div></section>
    <section className="mx-auto max-w-6xl px-6 py-20"><h2 className="text-3xl font-bold">What the examination does</h2><div className="mt-10 grid gap-6 md:grid-cols-2">{steps.map(([n,title,body]) => <article key={n} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><span className="text-sm font-bold text-amber-400">{n}</span><h3 className="mt-2 text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-slate-300">{body}</p></article>)}</div></section>
    <section className="bg-slate-900"><div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2"><div><h2 className="text-3xl font-bold">What you receive</h2><ul className="mt-6 space-y-3 text-slate-300"><li>• Frozen claim and examination boundary</li><li>• Evidence and authority map</li><li>• Agreed changed-condition / failure challenges</li><li>• Observed determinations and execution behavior</li><li>• Claims, non-claims, and unresolved conditions</li><li>• Bounded disposition and preserved examination record</li></ul></div><div><h2 className="text-3xl font-bold">What this is not</h2><ul className="mt-6 space-y-3 text-slate-300"><li>• Not TA-14 certification</li><li>• Not an investment endorsement</li><li>• Not a promise that your system will pass</li><li>• Not a rewrite into TA-14 terminology</li><li>• Not permission for claims beyond frozen scope</li></ul></div></div></section>
    <section className="mx-auto max-w-6xl px-6 py-20"><div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-8 md:p-12"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">Lower-friction entry</p><h2 className="mt-3 text-3xl font-bold">Not ready for the full review?</h2><p className="mt-4 max-w-3xl leading-7 text-slate-300">Start with an Execution Evidence Snapshot for $249. We examine a narrower evidence question and return a concise bounded record. If the problem warrants deeper examination, the next step is the full Execution Claim Review.</p><Link href="/execution-evidence-snapshot" className="mt-7 inline-block rounded-md bg-slate-100 px-6 py-3 font-semibold text-slate-950">View the $249 Snapshot</Link></div></section>
    <section className="border-t border-slate-800"><div className="mx-auto max-w-4xl px-6 py-20 text-center"><h2 className="text-3xl font-bold">Bring us one consequential claim.</h2><p className="mx-auto mt-4 max-w-2xl text-slate-300">If the claim matters when execution reaches real consequence, we can determine a bounded examination scope before work begins.</p><Link href="/execution-claim-review/intake" className="mt-8 inline-block rounded-md bg-amber-400 px-7 py-3 font-semibold text-slate-950">Request scope</Link><p className="mt-8 text-sm text-slate-500">No admissible evidence. No admissible execution.</p></div></section>
  </main>;
}
