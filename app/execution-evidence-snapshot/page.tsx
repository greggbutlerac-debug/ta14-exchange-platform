import Link from "next/link";

export const metadata = { title: "TA-14 Execution Evidence Snapshot | $249", description: "A lower-friction bounded TA-14 review of one execution-evidence question." };

export default function ExecutionEvidenceSnapshotPage() {
  return <main className="min-h-screen bg-slate-950 text-slate-100"><section className="mx-auto max-w-5xl px-6 py-24">
    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">TA-14 Entry Examination</p><h1 className="mt-5 text-4xl font-bold md:text-6xl">Execution Evidence Snapshot</h1>
    <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">One narrow evidence question. One bounded record. A practical way to determine whether the evidence behind an execution claim deserves deeper examination.</p>
    <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8"><p className="text-sm uppercase text-slate-400">Founding commercial price</p><p className="mt-2 text-5xl font-bold">$249</p><p className="mt-5 leading-7 text-slate-300">The Snapshot is intentionally narrower than the full Execution Claim Review. TA-14 examines one defined evidence question, records the supplied boundary, identifies material gaps or unresolved conditions, and returns a concise bounded disposition. A favorable result is not guaranteed.</p><Link href="/execution-claim-review/intake?snapshot=1" className="mt-8 inline-block rounded-md bg-amber-400 px-7 py-3 font-semibold text-slate-950">Request a Snapshot</Link></div>
    <div className="mt-14 grid gap-6 md:grid-cols-2"><div className="rounded-xl border border-slate-800 p-6"><h2 className="text-xl font-semibold">Good fit</h2><p className="mt-3 leading-7 text-slate-300">You have a specific execution, authorization, evidence, provenance, continuity, or changed-condition question and want a bounded look before commissioning a larger examination.</p></div><div className="rounded-xl border border-slate-800 p-6"><h2 className="text-xl font-semibold">Next step when warranted</h2><p className="mt-3 leading-7 text-slate-300">If the Snapshot exposes a consequential proposition requiring failure challenges, replay, or deeper authority analysis, scope a full Execution Claim Review starting at $750.</p></div></div>
    <div className="mt-14"><Link href="/execution-claim-review" className="font-semibold text-amber-400">Compare with the full Execution Claim Review →</Link></div>
  </section></main>;
}
