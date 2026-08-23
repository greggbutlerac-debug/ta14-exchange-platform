import Link from 'next/link';

export const metadata = {
  title: 'Atlas Environmental Integrity Fund | Public Allocation Ledger',
  description: 'TA-14 public ledger for its 15% Environmental Integrity Commitment: amounts designated, allocations, recipients, purposes, evidence, transfers, interventions, and outcomes.',
  alternates: { canonical: 'https://ta14exchange.com/atlas-environmental-integrity-fund' },
};

const ledger = {
  qualifyingReceipts: 0,
  designated: 0,
  allocated: 0,
  unallocated: 0,
  distributed: 0,
};

const allocations: Array<{id:string;date:string;recipient:string;amount:number;purpose:string;why:string;status:string;proof?:string;outcome?:string}> = [];

const money = (value:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);

export default function AtlasEnvironmentalIntegrityFundPage() {
  return <main className="min-h-screen bg-slate-950 text-slate-100">
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-300">TA-14 Public Impact Ledger</p>
      <h1 className="mt-5 max-w-5xl text-4xl font-bold tracking-tight md:text-6xl">Atlas Environmental Integrity Fund</h1>
      <p className="mt-7 max-w-4xl text-lg leading-8 text-slate-300">A transparent institutional program for turning a defined share of TA-14 commercial activity into evidence-governed environmental benefit. The ledger is designed to show what was designated, what remains available, where money went, who received it, why the allocation was made, what was done, and what outcome evidence supports the resulting impact claim.</p>
      <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400">This is a TA-14 institutional program. The name does not represent a separately incorporated charitable foundation or tax-exempt entity unless and until that legal status is separately established and disclosed here.</p>
    </section>

    <section className="border-y border-slate-800 bg-slate-900/50"><div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">The commitment</p>
      <h2 className="mt-3 text-3xl font-bold">15% is visible from receipt to outcome.</h2>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">TA-14 designates 15% of qualifying commercial service receipts after refunds and payment-processing fees and before owner distributions. The designated amount enters this public ledger. Allocation does not itself establish impact; transfer, intervention, and outcome evidence are recorded separately.</p>
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[['Qualifying receipts',ledger.qualifyingReceipts],['15% designated',ledger.designated],['Allocated',ledger.allocated],['Unallocated balance',ledger.unallocated],['Distributed',ledger.distributed]].map(([label,value])=><article key={String(label)} className="rounded-xl border border-slate-800 bg-slate-950 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p><p className="mt-3 text-2xl font-bold text-emerald-300">{money(Number(value))}</p></article>)}
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-400">Opening ledger: no qualifying receipts or allocations have yet been entered. Zero means zero; future balances will be recorded rather than estimated.</p>
    </div></section>

    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold">Every allocation gets a complete public record.</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {['Allocation ID and date','Recipient and amount','Purpose and eligibility basis','Why this project was selected','Conflict and eligibility review','Proof of transfer','Environmental baseline','Work or intervention performed','TA-14 governance/evidence requirements','Post-intervention evidence','Outcome and limitations','Unused/returned funds or follow-up'].map(item=><div key={item} className="rounded-xl border border-slate-800 bg-slate-900 p-5 font-semibold">{item}</div>)}
      </div>
    </section>

    <section className="border-y border-slate-800 bg-slate-900/50"><div className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold">Allocation ledger</h2>
      <p className="mt-4 max-w-4xl leading-7 text-slate-300">Records appear here only after an allocation exists. No placeholder recipient, invented impact, or projected donation is presented as completed activity.</p>
      {allocations.length === 0 ? <div className="mt-8 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8"><p className="font-semibold">No allocations recorded yet.</p><p className="mt-2 text-slate-400">The first qualifying commercial receipts will establish the first designated balance. Subsequent allocation records will disclose the recipient, purpose, transfer evidence, intervention, and outcome status.</p></div> : <div className="mt-8 space-y-5">{allocations.map(a=><article key={a.id} className="rounded-xl border border-slate-800 bg-slate-950 p-6"><div className="flex flex-wrap justify-between gap-3"><h3 className="text-xl font-semibold">{a.recipient}</h3><span className="font-bold text-emerald-300">{money(a.amount)}</span></div><p className="mt-3 text-slate-300">{a.purpose}</p><p className="mt-3 text-sm text-slate-400">Why selected: {a.why}</p><p className="mt-3 text-sm text-slate-400">Status: {a.status}</p></article>)}</div>}
    </div></section>

    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold">What the fund is intended to support</h2>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">Priority projects may include indoor-air quality improvement, ventilation, filtration, environmental monitoring, mold-risk reduction, Legionella-risk reduction, environmental-health interventions, and other clean-air or environmental-integrity work where the need, execution, and outcome can be governed through evidence.</p>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">Preference is given to projects where a baseline can be established, the intervention can be bounded, execution can be documented, and post-intervention conditions can be examined. The objective is not to manufacture a success story. The objective is to know what the money actually did.</p>
    </section>

    <section className="bg-slate-900"><div className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold">Allocation governance</h2>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">Atlas serves as the AI allocation steward: researching candidate projects, evaluating them against the published mission and evidence requirements, documenting recommendations, and examining outcome records. Legal possession and transfer of funds remain with the responsible human or institutional entity. No AI system independently owns, banks, or transfers fund assets.</p>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">A recommendation should consider environmental need, expected measurable benefit, evidence quality, conflict risk, feasibility, recipient eligibility, ability to preserve execution evidence, and capacity to examine the resulting outcome. Human authorization confirms legal and financial eligibility and executes the transfer.</p>
    </div></section>

    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold">No impact claim without an evidence record.</h2>
      <p className="mt-5 max-w-4xl leading-8 text-slate-300">A donation receipt proves a transfer. It does not by itself prove an environmental outcome. Where an outcome is claimed, this ledger is intended to connect the allocation to the baseline, intervention, execution evidence, post-intervention record, result, and limitations. If an intended result is not established, the record should say so.</p>
      <Link href="/environmental-integrity-governance" className="mt-7 inline-block font-semibold text-emerald-300">Explore TA-14 Environmental Integrity Governance -&gt;</Link>
    </section>
  </main>;
}
