import Link from "next/link";

const riskAreas = [
  {
    title: "Risk Identification",
    description:
      "Identify foreseeable harms, affected parties, operational dependencies, and conditions that could make an AI system unsafe or inadmissible.",
  },
  {
    title: "Risk Analysis",
    description:
      "Evaluate likelihood, severity, exposure, uncertainty, and the evidence supporting each risk determination.",
  },
  {
    title: "Risk Treatment",
    description:
      "Define controls, restrictions, human review, escalation paths, and execution boundaries for identified risks.",
  },
  {
    title: "Residual Risk",
    description:
      "Preserve what remains unresolved after controls are applied and determine whether execution should be allowed, held, denied, or escalated.",
  },
  {
    title: "Risk Monitoring",
    description:
      "Track drift, incidents, control failures, environmental changes, and new evidence throughout the AI system lifecycle.",
  },
  {
    title: "Risk Evidence",
    description:
      "Bind risk conclusions to attributable records, governing authority, review history, and preserved outcomes.",
  },
];

export default function RiskManagementPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">AI Risk Management</h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Explore the governance processes used to identify, evaluate, control,
          monitor, and preserve evidence of AI-related risk.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {riskAreas.map((area) => (
            <article
              key={area.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-semibold">{area.title}</h2>

              <p className="mt-4 text-slate-300">{area.description}</p>

              <div className="mt-8 flex gap-3">
                <Link
                  href="/governance-library/frameworks"
                  className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950"
                >
                  View Frameworks
                </Link>

                <Link
                  href="/governance-library/governed-records"
                  className="rounded-lg border border-white/10 px-4 py-2"
                >
                  View Records
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
