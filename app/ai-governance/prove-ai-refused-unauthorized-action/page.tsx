import Link from 'next/link';

export const metadata = {
  title: 'How to Prove an AI System Refused an Unauthorized Action | TA-14',
  description: 'A practical evidence framework for proving that an AI system actually refused an unauthorized consequential action, not merely that a policy said it should.',
};

const evidence = [
  ['Request record', 'What action was requested, by whom or what, against which object, with what payload and at what time?'],
  ['Authority state', 'What authority existed at the relevant moment, and what evidence established that authority?'],
  ['Admissibility condition', 'Which evidence and conditions were required before the action could bind to execution?'],
  ['Refusal event', 'What native control prevented commit or execution, and what record proves that prevention occurred?'],
  ['Non-formation evidence', 'Can you show that no executable commitment, authorization token, transaction instruction, or equivalent consequence-bearing object formed?'],
  ['Replay boundary', 'Can an independent reviewer reconstruct the same inputs, conditions, control state, and refusal result from the preserved record?'],
] as const;

export default function UnauthorizedActionRefusalPage() {
  const claimHref = '/execution-claim-review?utm_source=seo&utm_medium=organic&utm_campaign=ai_refusal_evidence';
  const snapshotHref = '/execution-evidence-snapshot?utm_source=seo&utm_medium=organic&utm_campaign=ai_refusal_evidence';
  const intakeHref = '/execution-claim-review/intake?utm_source=seo&utm_medium=organic&utm_campaign=ai_refusal_evidence';

  return <main className="min-h-screen bg-slate-950 text-slate-100">
    <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">AI EXECUTION GOVERNANCE · BUYER PROBLEM</p>
      <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">How do you prove an AI system actually refused an unauthorized action?</h1>
      <p className="mt-7 max-w-4xl text-lg leading-8 text-slate-300">A policy that says an AI agent “must not execute without authorization” is not the same thing as evidence that an unauthorized action was actually prevented. For a consequential system, the stronger question is whether the preserved record can show what entered, what authority existed, what condition failed, what could not bind, and what never reached execution.</p>
      <div className="mt-9 flex flex-wrap gap-4">
        <Link href={snapshotHref} className="rounded-md bg-cyan-300 px-6 py-3 font-semibold text-slate-950">Start with a $249 Evidence Snapshot</Link>
        <Link href={claimHref} className="rounded-md border border-slate-600 px-6 py-3 font-semibold">See the $750+ Claim Review</Link>
      </div>
    </section>

    <section className="border-y border-slate-800 bg-slate-900/50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-bold">The evidence problem</h2>
        <p className="mt-5 max-w-4xl leading-8 text-slate-300">Many systems can show a rule, a policy, a permission matrix, a human approval step, or a log entry. Those records can be useful, but none automatically proves that an unauthorized consequential action was prevented from becoming executable. The proof surface has to connect the request to authority, the relevant conditions, the control decision, and the resulting non-execution.</p>
      </div>
    </section>

    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-3xl font-bold">Six records we would want to inspect</h2>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {evidence.map(([title, body], i) => <article key={title} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><span className="text-sm font-bold text-cyan-300">0{i + 1}</span><h3 className="mt-2 text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-slate-300">{body}</p></article>)}
      </div>
    </section>

    <section className="bg-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold">What weak proof looks like</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {['A policy says authorization is required, but no execution-time authority state is preserved.','A log says “denied,” but there is no evidence that an executable object failed to form.','The system records a human approval, but the payload executed later cannot be tied to the approved payload.','A refusal is demonstrated under one route, while an alternate route capable of producing the same consequence remains outside the claimed boundary.','The control worked historically, but the evidence does not establish that the same authority or conditions remained valid at execution time.','A favorable demo result is preserved, but adverse cases, changed conditions, or bypass attempts were never tested.'].map(x => <div key={x} className="rounded-lg border border-slate-800 p-5 leading-7 text-slate-300">{x}</div>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-3xl font-bold">A bounded way to test the claim</h2>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">TA-14 can examine one consequential claim without requiring your architecture to become TA-14. The object is frozen, the evidence and authority boundary is defined, agreed changed conditions or failure cases are introduced, and the resulting record preserves what the evidence supports, what it does not support, and what remains unresolved.</p>
      <div className="mt-8 rounded-xl border border-amber-400/30 bg-amber-400/5 p-7">
        <p className="font-semibold text-amber-300">Commercial boundary</p>
        <p className="mt-3 leading-7 text-slate-300">Payment purchases a bounded examination or evidence review. It does not purchase certification, endorsement, regulatory approval, or a favorable finding. An unsupported claim is an admissible result.</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-4"><Link href={intakeHref} className="rounded-md bg-amber-400 px-6 py-3 font-semibold text-slate-950">Bring us one consequential claim</Link><Link href="/artifacts/registry" className="rounded-md border border-slate-600 px-6 py-3 font-semibold">Inspect the artifact record</Link></div>
    </section>

    <section className="border-t border-slate-800"><div className="mx-auto max-w-5xl px-6 py-14 text-sm text-slate-500">TA-14 Authority Governance Institution · No admissible evidence. No admissible execution.</div></section>
  </main>;
}
