import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Schillings Air × TA-14 | Integration Exploration",
  description: "Proposed evidence-bound HVAC retrofit governance, illustrated through fictional technical examples.",
  robots: { index: false, follow: false },
};

const sections = [
  {
    id: "architecture", label: "01 / INTEGRATION", title: "Keep the infrastructure. Govern the decision.",
    image: "/HVAC Integration Architecture and Governance.png",
    detail: "Existing HVAC sensors, BMS and service records remain the physical and operational sources. The proposed TA-14 layer examines continuity, admissibility, authority and scope before a consequential action. Actual interfaces require joint engineering validation.",
  },
  {
    id: "evidence", label: "02 / EVIDENCE", title: "Establish the right to rely.",
    image: "/HVAC Governance Evidence Dashboard.png",
    detail: "The specimen illustrates Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome. Displayed record identifiers, readings, signatures, hashes and verification states are fictional.",
  },
  {
    id: "determinations", label: "03 / RUNTIME", title: "Four determinations, four distinct consequences.",
    image: "/Four Determinations_ TA-14 HVAC Governance Matrix.png",
    detail: "ALLOW authorizes only the bounded permitted action. HOLD awaits admissible evidence. DENY blocks an impermissible request. ESCALATE refers an unresolved matter to accountable authority. Existing safety interlocks remain controlling.",
  },
  {
    id: "workflow", label: "04 / HVAC METHOD", title: "Evidence before intervention.",
    image: "/TA-14 HVAC Performance Workflow.png",
    detail: "HPR-BL baseline → NIRET gate → DDD after evidence is collected and frozen → authorized intervention where warranted → HPR-V post-intervention record. No invasive work is assumed to be necessary.",
  },
  {
    id: "outcomes", label: "05 / HYPOTHETICAL CASE", title: "Separate action from examined outcome.",
    image: "/HVAC Retrofit Governance_ Before and After.png",
    detail: "The illustrated changes in CO₂, particulate matter, airflow and comfort are fictional teaching values, not measured Schillings Air results. They demonstrate the form of a proposed evidence comparison, not a performance guarantee.",
  },
  {
    id: "pilot", label: "06 / DEPLOYMENT", title: "Observe first. Consider control only after validation.",
    image: "/TA-14 Deployment Pathway Infographic.png",
    detail: "Proposed paid Phase A: read-only shadow evaluation at one selected asset. Optional Phase B: bounded controlled execution only after agreed security, safety, timing, authority and failure-mode acceptance. Illustrated schedules and portfolio figures are not commitments.",
  },
  {
    id: "owner", label: "07 / CUSTOMER DELIVERABLE", title: "A record the building owner can examine.",
    image: "/Building Owner HVAC Verification Report.png",
    detail: "This is a fictional report specimen. The depicted facility, signatories, QR code, hash, measurements, green approvals and outcomes do not constitute authentic verification or customer authorization.",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#071522] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-6">
          <a href="/" className="font-bold tracking-[.18em] text-cyan-300">TA-14 AUTHORITY</a>
          <span className="rounded-full border border-amber-300/40 px-4 py-2 text-xs font-semibold text-amber-200">DRAFT · TECHNICAL EXPLORATION ONLY</span>
        </div>
        <header className="py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-cyan-300">Schillings Air × TA-14 · Proposed integration</p>
          <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight sm:text-7xl">Govern the decision.<br/><span className="text-cyan-300">Examine the outcome.</span></h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-300">An illustrated engineering exploration of how HVAC measurements and retrofit operations could be connected to evidence-bound admissible execution governance.</p>
          <p className="mt-5 max-w-3xl border-l-2 border-amber-300 pl-4 text-sm leading-relaxed text-amber-100">No partnership, endorsement, integration or deployment is claimed. All displayed site details, performance figures, approvals and results are illustrative.</p>
          <nav aria-label="Chapters" className="mt-9 flex flex-wrap gap-2">
            {sections.map(s => <a key={s.id} href={"#"+s.id} className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold hover:border-cyan-300">{s.label}</a>)}
          </nav>
        </header>
        <div className="space-y-24">
          {sections.map(s => <section key={s.id} id={s.id} className="scroll-mt-8">
            <p className="text-sm font-bold tracking-[.18em] text-cyan-300">{s.label}</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-bold sm:text-5xl">{s.title}</h2>
            <p className="my-6 max-w-4xl text-lg leading-relaxed text-slate-300">{s.detail}</p>
            <div className="overflow-hidden rounded-xl border border-white/20 bg-white shadow-xl">
              <Image src={s.image} alt={s.title + " — illustrative technical diagram, not verified Schillings Air field evidence"} width={1536} height={1024} unoptimized className="h-auto w-full"/>
            </div>
            <p className="mt-3 text-xs text-slate-400">Concept artwork only. Fictional figures, site details and approval markings are not field evidence.</p>
          </section>)}
        </div>
        <section className="mt-24 rounded-2xl border border-cyan-300/30 bg-[#0d293e] p-8 sm:p-12">
          <p className="text-sm font-bold tracking-widest text-cyan-300">PROPOSED COMMERCIAL NEXT STEP</p>
          <h2 className="mt-4 text-4xl font-bold">One bounded, paid shadow-mode pilot.</h2>
          <p className="mt-5 max-w-4xl text-lg leading-relaxed text-slate-300">Exchange technical materials, identify a specific asset and intervention, define evidence and authority interfaces, and agree on a paid Phase A statement of work and acceptance tests. Any live-control gate is a separate decision.</p>
          <a href="/TA14_Schillings_Integration_Technical_Proposal_v1%20(1).pdf" target="_blank" rel="noopener noreferrer" className="mt-8 inline-block rounded-lg bg-cyan-300 px-6 py-3 font-bold text-[#071522]">Open technical proposal v1 PDF</a>
          <p className="mt-3 text-sm text-amber-200">This linked PDF is an earlier draft, not a final approved commercial proposal.</p>
        </section>
        <footer className="mt-16 border-t border-white/20 py-8 text-sm text-slate-400">
          <p className="font-semibold text-white">Greggory Don Butler · Founder, TA-14 Authority Governance Institution</p>
          <p className="mt-2">No admissible evidence. No admissible execution.</p>
        </footer>
      </div>
    </main>
  );
}
