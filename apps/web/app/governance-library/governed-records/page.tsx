import Link from "next/link";

const records = [
  {
    title: "Technical Documentation",
    description:
      "Design records, architecture, intended purpose, limitations, and implementation evidence.",
  },
  {
    title: "Risk Assessments",
    description:
      "Preserved evaluations of identified risks, mitigations, and residual risk.",
  },
  {
    title: "Validation Evidence",
    description:
      "Evidence demonstrating the AI system performs acceptably for its intended use.",
  },
  {
    title: "Runtime Execution Records",
    description:
      "Execution-time evidence including admissibility decisions and preserved outcomes.",
  },
  {
    title: "Monitoring Records",
    description:
      "Operational monitoring, drift detection, incidents, and post-deployment observations.",
  },
  {
    title: "Audit Records",
    description:
      "Independent governance reviews, findings, corrective actions, and verification evidence.",
  },
];

export default function GovernedRecordsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">Governed Records</h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Browse evidence records used to demonstrate governance,
          admissibility, accountability, traceability, and execution integrity.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {records.map((record) => (
            <article
              key={record.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-semibold">{record.title}</h2>

              <p className="mt-4 text-slate-300">
                {record.description}
              </p>

              <div className="mt-8 flex gap-3">
                <Link
                  href="/governance-library/dictionary"
                  className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950"
                >
                  Related Terms
                </Link>

                <Link
                  href="/governance-library/crosswalks"
                  className="rounded-lg border border-white/10 px-4 py-2"
                >
                  Crosswalks
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
