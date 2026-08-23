import Link from 'next/link';

export const metadata = {
  title: 'AI Execution Evidence: Authority, Changed Conditions, Refusal & Proof | TA-14',
  description: 'A practical hub for proving AI execution claims: changed authorization, changed evidence, unauthorized execution, refusal, blocking, and replayable evidence.',
  alternates: { canonical: 'https://ta14exchange.com/ai-governance/execution-evidence' },
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

const proofExamples = [
  {
    href: '/artifacts/ta14-ea-000013',
    title: 'Authority expires after approval but before execution',
    disposition: 'HOLD',
    body: 'Executable evidence for present-authority revalidation at the pre-execution boundary.',
  },
  {
    href: '/artifacts/ta14-ea-000017',
    title: 'New evidence supersedes admitted evidence',
    disposition: 'HOLD',
    body: 'Executable evidence showing prior admissibility suspended after material evidence supersession.',
  },
  {
    href: '/artifacts/ta14-ea-000020',
    title: 'Executed action differs from committed action',
    disposition: 'DENY',
    body: 'Executable evidence for commit-to-execution correspondence failure.',
  },
  {
    href: '/artifacts/ta14-ea-000030',
    title: 'Protected Consequence Non-Formation',
    disposition: 'HOLD',
    body: 'A hardened proof record showing why an internal denial alone is insufficient to establish downstream non-occurrence.',
  },
];

const faq = [
  ['What is AI execution evidence?', 'AI execution evidence is the record needed to support what an AI or agentic system was allowed to do, what conditions applied, what actually executed, and what outcome followed.'],
  ['Is an AI denial message proof that an action was blocked?', 'Not necessarily. A denial message can prove that one interface or governed path returned a denial. Proving non-occurrence may require evidence that the protected consequence did not form through the relevant execution surface.'],
  ['What if authorization changed after approval?', 'The relevant question is whether the earlier authorization still had standing at the immediate consequence boundary. A defensible system should preserve the authority state, changed condition, revalidation, and resulting determination.'],
  ['Can TA-14 review a system without forcing it to adopt TA-14?', 'Yes. A bounded examination can preserve the system’s native architecture, terminology, evidence, and result while testing the stated execution claim.'],
];

export default function ExecutionEvidenceHub() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
        <h2 className="text-3xl font-bold">Inspect executable examples—not just claims</h2>
        <p className="mt-5 max-w-4xl leading-8 text-slate-300">The TA-14 artifact registry now exposes executable specifications, stage traces, receipts, manifests, hashes, claims boundaries, and source paths. These examples show how changed authority, changed evidence, execution divergence, and non-occurrence claims are represented as bounded testable records.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {proofExamples.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-300/60">
              <div className="flex items-center justify-between gap-4"><h3 className="text-lg font-semibold">{item.title}</h3><span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-bold text-cyan-300">{item.disposition}</span></div>
              <p className="mt-3 leading-7 text-slate-300">{item.body}</p>
              <p className="mt-4 font-semibold text-cyan-300">Inspect the artifact →</p>
            </Link>
          ))}
        </div>
        <Link href="/artifacts/registry" className="mt-7 inline-block font-semibold text-cyan-300">Open the complete Artifact Registry →</Link>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/50"><div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold">The evidence chain matters</h2>
        <p className="mt-5 max-w-4xl leading-8 text-slate-300">TA-14 treats execution evidence as a chain rather than a screenshot. The relevant question may require reconstructing reality, record, continuity, admissibility, binding, commit, execution, and outcome. A break at one point can change what the final record can support.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['Reality → Record','Continuity → Admissibility','Binding → Commit','Execution → Outcome'].map((item) => <div key={item} className="rounded-lg border border-slate-800 bg-slate-950 p-5 font-semibold">{item}</div>)}
        </div>
      </div></section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold">Common AI execution-evidence questions</h2>
        <div className="mt-8 space-y-6">
          {faq.map(([question, answer]) => <article key={question} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h3 className="text-xl font-semibold">{question}</h3><p className="mt-3 max-w-4xl leading-7 text-slate-300">{answer}</p></article>)}
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
