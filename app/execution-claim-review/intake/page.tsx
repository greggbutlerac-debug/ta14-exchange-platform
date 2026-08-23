export const metadata = { title: "Request Scope | TA-14 Execution Claim Review", description: "Submit one consequential execution claim or evidence question for TA-14 commercial scope review." };

export default function ClaimReviewIntakePage() {
  const fields = ["Your name and organization", "Email / contact information", "The exact claim or evidence question", "Why the claim matters at execution", "System / architecture / process being examined", "Evidence currently available", "Known changed conditions, failure cases, or unresolved issues", "Preferred scope: $249 Snapshot or $750+ Claim Review"];
  return <main className="min-h-screen bg-slate-950 text-slate-100"><section className="mx-auto max-w-3xl px-6 py-20">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">TA-14 Commercial Intake</p><h1 className="mt-4 text-4xl font-bold">Bring us one consequential claim.</h1>
    <p className="mt-5 leading-7 text-slate-300">This route establishes the intake boundary for the commercial examination path. Payment is not collected until scope is confirmed. Until a live submission endpoint is connected, send the same information through the existing TA-14 contact channel and reference “Execution Claim Review.”</p>
    <div className="mt-10 space-y-6 rounded-xl border border-slate-800 bg-slate-900 p-7">{fields.map(field => <div key={field} className="rounded-md border border-slate-700 bg-slate-950 p-4 text-slate-300">{field}</div>)}</div>
    <div className="mt-8 rounded-lg border border-amber-400/30 bg-amber-400/5 p-5 text-sm leading-6 text-slate-300">Governance boundary: submission does not constitute acceptance, certification, endorsement, or a favorable finding. TA-14 confirms scope and commercial terms before custom work begins.</div>
  </section></main>;
}
