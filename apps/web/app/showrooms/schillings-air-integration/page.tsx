import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Schillings Air × TA-14 | Proposed Retrofit Governance Integration",
  description: "A technical exploration of evidence-to-execution governance for measurement-led HVAC retrofits. Concept only; no partnership or production integration is claimed.",
  robots: { index: false, follow: false },
};

const chain = [
  ["01", "Reality", "Observed building conditions"],
  ["02", "Record", "Attributable measurements"],
  ["03", "Continuity", "Source, time, custody and change"],
  ["04", "Admissibility", "Evidence fit to rely upon"],
  ["05", "Binding", "Current authority and permitted scope"],
  ["06", "Commit", "Authorized, bounded decision"],
  ["07", "Execution", "Recorded intervention and actor"],
  ["08", "Outcome", "Post-action examination and exceptions"],
];
const decisions = [
  ["ALLOW", "Required evidence and authority are established for this bounded action."],
  ["HOLD", "Evidence is missing, stale, discontinuous or not yet admissible."],
  ["DENY", "The proposed action is prohibited or required authority is absent."],
  ["ESCALATE", "A designated accountable authority must resolve the condition."],
];
export default function SchillingsAirShowroom() {
  return (
    <main className="min-h-screen bg-[#061a2a] text-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5 text-sm">
          <a href="/" className="font-semibold tracking-wide text-teal-300">TA-14 AUTHORITY</a>
          <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-amber-100">PRIVATE REVIEW DRAFT · PROPOSED INTEGRATION</span>
        </div>
        <section className="py-10 sm:py-16">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[.25em] text-teal-300">Executive technical exploration · October 2026</p>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">Govern the decision.<br/><span className="text-teal-300">Examine the outcome.</span></h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">A proposed evidence-to-execution governance layer alongside Schillings Air&apos;s measurement-led HVAC retrofit offering. Existing sensors, controls, maintenance records and engineering authority remain in place.</p>
          <p className="mt-5 max-w-3xl text-sm text-amber-100">This page is a TA-14 concept for discussion. It does not announce a partnership, endorsement, commissioned integration, verified building result or approved Schillings Air deployment.</p>
        </section>
        <section aria-label="Illustrative integration architecture" className="overflow-hidden rounded-2xl border border-white/15 bg-white p-2">
          <Image src="/Schillings Air × TA-14 Retrofit Governance Infographic.png" alt="Illustrative Schillings Air and TA-14 HVAC governance concept, from building measurements through admissibility and authorization to post-intervention examination; all displayed readings and equipment depictions are fictional examples." width={1536} height={1024} unoptimized className="h-auto w-full" priority />
        </section>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">Illustrative concept artwork. Equipment depictions, CO₂ and PM values, control changes, performance improvements and authorization statuses are examples only; none are Schillings Air field data or validated results.</p>
        <section className="py-16">
          <h2 className="text-3xl font-semibold">Where TA-14 would fit</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["01 / OBSERVE", "Existing building systems", "Read-only telemetry and records: CO₂, particulate matter, airflow, occupancy, filters, equipment status, maintenance and source metadata where available."],
              ["02 / GOVERN", "TA-14 decision boundary", "Examine provenance, continuity, admissibility, applicable policy, authority, standing, permitted scope and freshness at the point of action."],
              ["03 / EXAMINE", "Bounded outcome record", "Record the proposed and actual intervention, responsible actor, decision basis, post-action evidence, uncertainty and unresolved exceptions."],
            ].map(([tag,title,body])=><article key={tag} className="rounded-xl border border-white/15 bg-white/5 p-6"><p className="text-sm font-semibold text-teal-300">{tag}</p><h3 className="mt-3 text-xl font-semibold">{title}</h3><p className="mt-3 leading-relaxed text-slate-300">{body}</p></article>)}
          </div>
        </section>
        <section className="rounded-2xl border border-white/15 bg-[#0b2940] p-6 sm:p-9">
          <h2 className="text-3xl font-semibold">Eight links. One bounded right to rely.</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {chain.map(([n,title,desc])=><div key={n} className="rounded-lg border border-white/10 bg-[#061a2a] p-4"><span className="text-sm font-bold text-teal-300">{n}</span><h3 className="mt-2 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm text-slate-300">{desc}</p></div>)}
          </div>
          <p className="mt-6 font-semibold text-teal-300">No admissible evidence. No admissible execution.</p>
        </section>
        <section className="py-16">
          <h2 className="text-3xl font-semibold">A decision is more than a score</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {decisions.map(([label,body])=><div key={label} className="rounded-xl border border-white/15 bg-white/5 p-5"><h3 className="text-xl font-bold text-teal-300">{label}</h3><p className="mt-2 text-slate-300">{body}</p></div>)}
          </div>
          <p className="mt-5 text-sm text-slate-400">Safety-critical controls, emergency procedures and site engineering authority must not be displaced by an unvalidated governance gate.</p>
        </section>
        <section className="rounded-2xl border border-white/15 bg-white/5 p-7 sm:p-10">
          <h2 className="text-3xl font-semibold">A practical, paid evaluation pathway</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div><h3 className="text-xl font-semibold text-teal-300">Phase A · Read-only shadow mode</h3><p className="mt-3 leading-relaxed text-slate-300">Select one asset class and intervention. Map available data, decision ownership and evidence quality. Exercise ALLOW, HOLD, DENY and ESCALATE against bounded scenarios without changing live controls.</p></div>
            <div><h3 className="text-xl font-semibold text-teal-300">Phase B · Optional controlled gate</h3><p className="mt-3 leading-relaxed text-slate-300">Consider only after jointly validating interface security, safety, authority, latency, revalidation, bypass detection and failure behavior. Production integration is not assumed.</p></div>
          </div>
          <p className="mt-7 border-t border-white/15 pt-6 text-slate-300">Proposed deliverables: integration map, event and evidence contract, scenario results, reviewable decision record, limitations and a deployment recommendation. Commercial terms require a mutually agreed statement of work.</p>
        </section>
        <footer className="py-12 text-sm text-slate-400">
          <p className="font-semibold text-white">Greggory Don Butler · Founder, TA-14 Authority Governance Institution</p>
          <p className="mt-2">Technical concept only · No Schillings Air endorsement or deployment asserted.</p>
        </footer>
      </div>
    </main>
  );
}
