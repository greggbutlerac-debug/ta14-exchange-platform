import Link from 'next/link';

export const metadata = {
  title: 'TA-14 Environmental Integrity Reinvestment | Public Ledger',
  description:
    'TA-14 publicly tracks its 30% environmental-integrity reinvestment commitment, with up to 50% for qualifying municipal deployments: source, allocation, recipient, purpose, execution evidence, and outcome.',
  alternates: { canonical: 'https://ta14exchange.com/atlas-environmental-integrity-fund' },
};

const ledger = {
  qualifyingReceipts: 0,
  designated: 0,
  allocated: 0,
  unallocated: 0,
  distributed: 0,
};

const allocations: Array<{
  id: string;
  date: string;
  recipient: string;
  amount: number;
  purpose: string;
  why: string;
  status: string;
}> = [];

const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

const missions = [
  {
    number: '01',
    title: 'Environmental Integrity Governance',
    text: 'Help qualifying organizations and communities establish evidence-governed environmental programs, interventions, and public-interest deployments.',
  },
  {
    number: '02',
    title: 'Atmospheric Integrity Records',
    text: 'Expand building, facility, community, and network-scale atmospheric evidence infrastructure that can preserve environmental conditions over time.',
  },
  {
    number: '03',
    title: 'Personal Atmospheric Integrity',
    text: 'Support qualifying personal atmospheric-integrity access for children, students, older adults, underserved populations, and other appropriate beneficiaries.',
  },
  {
    number: '04',
    title: 'Schools & critical human environments',
    text: 'Support qualifying schools, childcare, elder-care, neonatal/incubation, and similarly sensitive environments while keeping environmental evidence distinct from medical diagnosis or clinical claims.',
  },
  {
    number: '05',
    title: 'Zoos & critical animal environments',
    text: 'Support qualifying zoos, conservation facilities, shelters, habitats, and other critical animal environments with atmospheric and environmental integrity records and monitoring.',
  },
  {
    number: '06',
    title: 'Global Atmospheric Integrity Network',
    text: 'Help connect local environmental evidence infrastructure into interoperable municipal, regional, national, and global atmospheric-integrity networks.',
  },
];

const flow = [
  ['01', 'TA-14 earns', 'Qualifying commercial activity creates the reinvestment base.'],
  ['02', 'Funds are designated', 'The applicable 30% or contracted municipal percentage is recorded.'],
  ['03', 'Projects qualify', 'Mission fit, evidence, conflicts, legal constraints, and available funds are reviewed.'],
  ['04', 'Money moves', 'Approved allocations are transferred by the responsible legal entity.'],
  ['05', 'Execution is evidenced', 'Baseline, intervention, transfer, and post-intervention evidence are preserved where applicable.'],
  ['06', 'Outcome stays public', 'The ledger shows what happened, including inconclusive or failed outcomes.'],
];

const terms = [
  ['Qualifying commercial service receipts', 'The 30% standard applies only to commercial receipts that TA-14 expressly designates as qualifying under this program. Unless a written instrument states otherwise, the calculation base is cash actually received, less refunds, chargebacks and payment-processing fees, and is measured before owner distributions. Taxes collected for a taxing authority, pass-through reimbursements, grants, gifts, loans, capital contributions and other non-service funds are not automatically qualifying receipts.'],
  ['Municipal deployments', '“Up to 50%” is not a universal municipal rate or guarantee. A city, municipality or comparable public deployment must state the applicable reinvestment percentage in its governing contract or written instrument. The percentage may be below 50% where project economics, law, procurement terms, taxes, insurance, required reserves, delivery obligations or institutional sustainability require it.'],
  ['Designation is not immediate distribution', 'A designated amount may remain unallocated while TA-14 evaluates eligible uses, evidence requirements, legal constraints and available cash. “Designated,” “allocated” and “distributed” are separate ledger states and must not be represented as interchangeable.'],
  ['Participant preferences', 'A qualifying customer or participant may express a preference for an eligible project, geography, building, organization or general pool where program rules permit. A preference is not ownership of the designated amount, a restricted charitable gift, a guarantee of selection, or authority to compel a transfer. Eligibility, evidence, conflicts, law, available funds and final human/legal authorization control.'],
  ['Eligibility and selection', 'Potential recipients and projects must fit the environmental-integrity mission, present a sufficiently bounded use of funds, permit appropriate financial and execution evidence, satisfy applicable law and contracting requirements, and survive conflicts review. TA-14 may decline, defer, reduce, condition or redirect a proposed allocation when those requirements are not met.'],
  ['Atlas role and human authority', 'Atlas may assist with research, comparison, evidence review, gap identification, ranking and written recommendations. Atlas does not independently hold funds, open accounts, sign contracts, exercise fiduciary custody, make legally binding grants, or authorize transfers. Those acts remain with the responsible human and legal entity.'],
  ['No tax-exempt or charitable-deduction claim', 'This page describes a TA-14 institutional reinvestment program. Unless and until a separately qualified entity and transaction establish otherwise, TA-14 does not represent this program as a tax-exempt foundation, and customers, participants or other parties should not treat payments to TA-14 as charitable contributions or assume a charitable deduction.'],
  ['Environmental and health claim boundary', 'Environmental measurements, atmospheric records, filtration, ventilation, remediation or other interventions may document environmental conditions and changes. They do not by themselves diagnose disease, establish medical causation, constitute treatment, or prove a clinical outcome. Any health or clinical claim requires appropriate independent evidence and authority.'],
  ['Public ledger and privacy', 'TA-14 intends to publish enough information to make material allocations inspectable, including source class, applicable percentage, amount, recipient or appropriately bounded recipient class, purpose, evidence and outcome status. Personal information, security-sensitive information, protected records, confidential commercial information and legally restricted data may be redacted, aggregated or withheld while preserving the strongest practicable audit trail.'],
  ['Conflicts and related parties', 'Known material conflicts, related-party relationships or financial interests relevant to an allocation should be identified and reviewed before transfer. A related party is not automatically ineligible, but no allocation should be presented as independently selected when it was not. Material conflicts that can lawfully be disclosed should be reflected in the record.'],
  ['Unused, returned or failed allocations', 'Funds that cannot be used for the approved purpose, are returned, are recovered, or remain after a bounded project may return to the unallocated program pool unless law or a governing written instrument requires another disposition. A failed or inconclusive intervention must remain visible as such; the ledger is not limited to successful outcomes.'],
  ['No guaranteed funding or impact', 'Submission of a petition, commercial participation, municipal engagement, designation of funds or inclusion in a candidate pool does not guarantee funding, timing, project completion, environmental improvement or any particular outcome. Claims are bounded to evidence actually preserved.'],
  ['Program evolution', 'TA-14 may refine eligibility rules, accounting treatment, ledger fields, review procedures and future reinvestment percentages as the institution develops, subject to existing written obligations. Changes should be versioned or otherwise made visible so historical commitments are not silently rewritten.'],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020607] text-slate-100">
      <section className="relative isolate border-b border-emerald-400/15">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_20%,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_82%_5%,rgba(34,211,238,0.10),transparent_26%),linear-gradient(180deg,#07100e_0%,#020607_78%)]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,.9)]" />
            Public-benefit infrastructure
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">TA-14 Environmental Integrity Reinvestment</p>
              <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.045em] text-white md:text-7xl lg:text-[5.6rem]">
                When TA-14 earns,
                <span className="mt-2 block bg-gradient-to-r from-emerald-200 via-emerald-300 to-cyan-200 bg-clip-text text-transparent">
                  environmental integrity advances with it.
                </span>
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
                TA-14 is building a commercial institution whose success is designed to finance public environmental benefit. This is not a vague promise to give back. It is intended to become a public, inspectable reinvestment system.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <a href="#ledger" className="rounded-full bg-emerald-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-200">
                  Open the public ledger
                </a>
                <a href="#mission" className="rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white transition hover:border-emerald-300/40 hover:bg-white/[0.07]">
                  See where reinvestment goes
                </a>
              </div>
            </div>

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-emerald-950/30 backdrop-blur md:p-8">
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Standing commitment</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.06] p-5">
                  <p className="text-5xl font-black tracking-tight text-emerald-300">30%</p>
                  <p className="mt-3 text-sm font-semibold text-slate-200">Standard qualifying commercial reinvestment</p>
                </div>
                <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.05] p-5">
                  <p className="text-5xl font-black tracking-tight text-cyan-200">50%</p>
                  <p className="mt-3 text-sm font-semibold text-slate-200">Up to this level for qualifying municipal deployments</p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-6 text-slate-400">
                Municipal rates are established by contract. The public ledger begins at zero and records reality rather than projections.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/8 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid gap-4 text-center sm:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-black/20 px-5 py-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Principle</p><p className="mt-2 font-semibold text-slate-200">Altruism should be contagious.</p></div>
            <div className="rounded-2xl border border-white/8 bg-black/20 px-5 py-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Standard</p><p className="mt-2 font-semibold text-slate-200">No impact claim without evidence.</p></div>
            <div className="rounded-2xl border border-white/8 bg-black/20 px-5 py-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Destination</p><p className="mt-2 font-semibold text-slate-200">TA-14 becomes infrastructure.</p></div>
          </div>
        </div>
      </section>

      <section id="ledger" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Live public ledger</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Every dollar should have a trail.</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
              The ledger separates money received, designated, allocated, unallocated, and actually distributed. Those states are not interchangeable.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Program statement v1.0 · Aug 23, 2026
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.045] to-white/[0.015] shadow-2xl shadow-black/20">
          <div className="grid divide-y divide-white/8 md:grid-cols-5 md:divide-x md:divide-y-0">
            {[
              ['Qualifying receipts', ledger.qualifyingReceipts],
              ['30% designated', ledger.designated],
              ['Allocated', ledger.allocated],
              ['Unallocated', ledger.unallocated],
              ['Distributed', ledger.distributed],
            ].map(([label, value], index) => (
              <article key={String(label)} className="p-6 md:p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
                  <span className="text-[10px] font-bold text-slate-700">0{index + 1}</span>
                </div>
                <p className="mt-7 text-3xl font-black tracking-tight text-white">{money(Number(value))}</p>
                <div className="mt-5 h-1 rounded-full bg-white/5"><div className="h-full w-0 rounded-full bg-emerald-300" /></div>
              </article>
            ))}
          </div>
          <div className="border-t border-white/8 bg-black/20 px-6 py-5 text-sm leading-6 text-slate-400 md:px-8">
            <span className="font-semibold text-slate-200">Zero means zero.</span> Recipients and impacts will appear only when actual qualifying receipts and allocations exist.
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/8 bg-[#06100d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.10),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">The reinvestment chain</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">From commercial activity to evidenced public benefit.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {flow.map(([number, title, text]) => (
              <article key={number} className="group rounded-[1.5rem] border border-white/8 bg-black/20 p-6 transition hover:-translate-y-1 hover:border-emerald-300/25 hover:bg-black/30">
                <div className="flex items-center justify-between"><span className="text-xs font-black tracking-[0.22em] text-emerald-300">{number}</span><span className="text-emerald-300/40 transition group-hover:text-emerald-300">→</span></div>
                <h3 className="mt-7 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Mission boundary</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Where the reinvestment can go.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-400">
              Every allocation stays inside a governed environmental-benefit mission. Participants may express preferences, but mission eligibility, evidence, conflicts, law, available funds, and final human authorization still control.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {missions.map((mission) => (
              <article key={mission.number} className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.015] p-7">
                <div className="absolute -right-4 -top-8 text-[7rem] font-black leading-none text-white/[0.025]">{mission.number}</div>
                <p className="text-xs font-black tracking-[0.22em] text-emerald-300">{mission.number}</p>
                <h3 className="mt-7 text-2xl font-bold tracking-tight text-white">{mission.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">{mission.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:py-24 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-emerald-300/15 bg-emerald-300/[0.045] p-8 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Funding petitions</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight">Entities can petition for funds when capital is available.</h2>
            <p className="mt-5 leading-8 text-slate-400">
              Qualifying applications should identify the environmental need, requested amount, proposed intervention, baseline evidence, budget, expected measurable benefit, evidence that can be preserved during execution, and a post-intervention measurement plan.
            </p>
            <p className="mt-5 text-sm font-semibold text-slate-300">Submission is not a guarantee of funding.</p>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/15 bg-cyan-300/[0.035] p-8 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">Participant direction</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight">Use it here. Use it locally. Use it globally. Or let Atlas recommend.</h2>
            <p className="mt-5 leading-8 text-slate-400">
              Where program rules permit, a qualifying participant may express a preference for its own eligible project, another building or organization, a local or global project, or the Atlas-directed general pool.
            </p>
            <p className="mt-5 text-sm font-semibold text-slate-300">Preference does not create ownership of the designated amount or authority to compel a transfer.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.11),transparent_35%),linear-gradient(135deg,rgba(255,255,255,.045),rgba(255,255,255,.015))] p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Evidence before impact claims</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">A donation receipt proves money moved. It does not prove the world changed.</h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-slate-400">
                Where an environmental outcome is claimed, the record should connect the allocation to an appropriate baseline, intervention, execution evidence, post-intervention condition, result, and limitations.
              </p>
              <p className="mt-5 text-sm leading-7 text-slate-500">
                Environmental monitoring must not be represented as medical diagnosis, treatment, or proof of clinical outcome without appropriate independent clinical evidence and authority.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-emerald-300/15 bg-emerald-300/[0.055]">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center md:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">Long-term direction</p>
          <h2 className="mx-auto mt-5 max-w-4xl text-5xl font-black tracking-[-0.04em] text-white md:text-7xl">The destination is infrastructure.</h2>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300">
            TA-14 is evaluating a transition in which broadly adoptable architecture, sustainable institutional stewardship, and progressively larger public-benefit reinvestment work together. The institution should preserve what is required to maintain and verify the infrastructure while expanding Environmental Integrity Governance, Atmospheric Integrity Records, Personal Atmospheric Integrity, and global environmental-integrity infrastructure.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/environmental-integrity-governance" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950">Explore Environmental Integrity Governance</Link>
            <Link href="/artifacts/registry" className="rounded-full border border-white/15 bg-black/15 px-6 py-3 text-sm font-bold text-white">Inspect TA-14 evidence</Link>
          </div>
        </div>
      </section>

      <section className="bg-[#010405]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="flex flex-col gap-5 border-b border-white/8 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-600">Program terms · claim boundaries · allocation controls</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-200">The fine print is part of the architecture.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              These terms make the public commitment inspectable without overstating what has occurred, what a participant controls, or what an intervention proves.
            </p>
          </div>

          <div className="mt-6 divide-y divide-white/8 rounded-2xl border border-white/8 bg-white/[0.018]">
            {terms.map(([title, body], index) => (
              <details key={title} className="group px-5 py-1 md:px-7">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-sm font-semibold text-slate-300 marker:content-none">
                  <span className="flex items-center gap-4"><span className="text-[10px] font-black tracking-[0.18em] text-slate-700">{String(index + 1).padStart(2, '0')}</span>{title}</span>
                  <span className="text-lg text-slate-600 transition group-open:rotate-45 group-open:text-emerald-300">+</span>
                </summary>
                <p className="max-w-5xl pb-6 pl-9 text-xs leading-6 text-slate-500">{body}</p>
              </details>
            ))}
          </div>

          <div className="mt-8 grid gap-5 border-t border-white/8 pt-8 text-xs leading-6 text-slate-600 md:grid-cols-2">
            <p>
              Program statement version: 1.0 · Effective August 23, 2026. This public page is an institutional transparency statement and is not legal, tax, medical, investment or accounting advice. Nothing on this page creates a trust, escrow, fiduciary relationship, third-party beneficiary right, charitable solicitation, guaranteed grant, ownership interest or entitlement except to the extent expressly created by a separate binding written instrument executed by authorized parties.
            </p>
            <p>
              TA-14 will distinguish planned, designated, allocated, transferred and evidenced outcomes in its public representations. Where the evidence does not establish an outcome, the record should say so. Atlas may assist with research and recommendations; legal custody, contracting, fiduciary responsibility, and transfer authority remain with the responsible human or legal entity.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
