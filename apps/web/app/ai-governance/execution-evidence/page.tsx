import Link from 'next/link';

export const metadata = {
  title: 'AI Execution Evidence: Authority, Changed Conditions, Refusal & Proof | TA-14',
  description: 'A practical hub for proving AI execution claims: changed authorization, changed evidence, unauthorized execution, refusal, blocking, and replayable evidence.',
};

const problems = [
  {
    href: '/ai-governance/authorization-changed-before-execution',
    title: 'Authorization changed before execution',
    body: 'When approval or authority was valid earlier but may no longer have standing when execution is about to occur.',
  },
  {
    href: '/ai-governance/evidence-changed-before-execution',
    title: 'Evidence changed before execution',
    body: 'When the facts supporting an action materially change and the system must determine whether prior support still applies.',
  },
  {
    href: '/ai-governance/ai-agent-executed-without-authority',
    title: 'An AI agent executed without authority',
    body: 'When consequence already occurred and the record must establish authority state, execution path, commitment, outcome, and failure boundaries.',
  },
  {
    href: '/ai-governance/prove-ai-action-was-blocked',
    title: 'Prove an AI action was actually blocked',
    body: 'When a denial message or rejected interface request is not enough and you need evidence that execution did not validly form or proceed on the governed path.',
  },
];

export default function ExecutionEvidenceHub() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">TA-14 Execution Evidence</p>
        <h1 className="mt-5 max-w-5xl text-4xl font-bold tracking-tight md:text-6xl">Can you prove what your AI system was allowed to execute—and what it was not?</h1>
        <p className="mt-7 max-w-4xl text-lg leading-8 text-slate-300">AI governance claims become consequential when an action is about to bind to reality. This hub focuses on the evidence needed to examine authority, changed conditions, refusal, commitment formation, execution, and outcome without assuming that a policy statement, log entry, or interface message proves the underlying control.</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link href="/execution-evidence-snapshot?utm_source=organic&utm_medium=topic_hub&utm_campaign=execution_evidence" className="rounded-md bg-cyan-300 px-6 py-3 font-semibold text-slate-950">Start with one evidence question — $249</Link>
          <Link href="/execution-claim-review?utm_source=organic&utm_medium=topic_hub&utm_campaign=execution_evidence" className="rounded-md border border-slate-600 px-6 py-3 font-semibold">Execution Claim Review — $750+</Link>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Start with the execution problem you actually have</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {problems.map((problem) => (
              <Link key={problem.href} href={problem.href} className="rounded-xl border border-slate-800 bg-slate-950 p-7 transition hover:border-cyan-300/60">
                <h3 className="text-xl font-semibold">{problem.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{problem.body}</p>
                <p className="mt-5 font-semibold text-cyan-300">Examine this problem →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold">The evidence chain matters</h2>
        <p className="mt-5 max-w-4xl leading-8 text-slate-300">TA-14 treats execution evidence as a chain rather than a screenshot. The relevant question may require reconstructing reality, record, continuity, admissibility, binding, commit, execution, and outcome. A break at one point can change what the final record can support.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['Reality → Record','Continuity → Admissibility','Binding → Commit','Execution → Outcome'].map((item) => <div key={item} className="rounded-lg border border-slate-800 bg-slate-900 p-5 font-semibold">{item}</div>)}
        </div>
      </section>

      <section className="bg-slate-900"><div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold">A negative result is still a result.</h2>
        <p className="mt-5 max-w-4xl leading-8 text-slate-300">The purpose of an execution examination is not to manufacture a pass. A bounded record can support an ALLOW, HOLD, DENY, ESCALATE, unsupported claim, route-specific finding, or another native architectural result. Payment buys the examination work, not a favorable disposition.</p>
      </div></section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/5 p-8 md:p-10">
          <h2 className="text-3xl font-bold">Turn an AI execution claim into an evidence question.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">If you can state the claim—“the agent was blocked,” “the approval was still valid,” “the evidence remained current,” “the action could not execute”—TA-14 can scope what evidence would be required to examine it.</p>
          <div className="mt-7 flex flex-wrap gap-4"><Link href="/execution-evidence-snapshot?utm_source=organic&utm_medium=topic_hub&utm_campaign=execution_evidence" className="rounded-md bg-cyan-300 px-6 py-3 font-semibold text-slate-950">$249 Execution Evidence Snapshot</Link><Link href="/execution-claim-review/intake?utm_source=organic&utm_medium=topic_hub&utm_campaign=execution_evidence" className="rounded-md border border-slate-600 px-6 py-3 font-semibold">Submit a bounded claim</Link></div>
        </div>
      </section>
    </main>
  );
}
