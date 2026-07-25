import Link from "next/link";

const lifecycleStages = [
  {
    title: "Governance Planning",
    description:
      "Establish policies, objectives, roles, authorities, and governance responsibilities before AI development begins.",
  },
  {
    title: "Design & Development",
    description:
      "Apply governance requirements during system architecture, data preparation, model development, and testing.",
  },
  {
    title: "Validation & Approval",
    description:
      "Verify readiness through testing, documentation, risk review, and execution authorization.",
  },
  {
    title: "Deployment",
    description:
      "Release AI systems with documented controls, monitoring, rollback capability, and preserved evidence.",
  },
  {
    title: "Operations & Monitoring",
    description:
      "Continuously monitor performance, incidents, drift, governance compliance, and operational outcomes.",
  },
  {
    title: "Retirement & Preservation",
    description:
      "Retire systems responsibly while preserving governance records, execution history, and audit evidence.",
  },
];

export default function LifecyclePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">AI Governance Lifecycle</h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Explore governance responsibilities across the complete AI lifecycle,
          from planning through retirement and evidence preservation.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {lifecycleStages.map((stage) => (
            <article
              key={stage.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-semibold">{stage.title}</h2>

              <p className="mt-4 text-slate-300">{stage.description}</p>

              <div className="mt-8 flex gap-3">
                <Link
                  href="/governance-library/frameworks"
                  className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950"
                >
                  Frameworks
                </Link>

                <Link
                  href="/governance-library/assurance"
                  className="rounded-lg border border-white/10 px-4 py-2"
                >
                  Assurance
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
