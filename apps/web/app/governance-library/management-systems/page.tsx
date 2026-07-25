import Link from "next/link";

const systems = [
  {
    title: "ISO/IEC 42001 AIMS",
    description: "Artificial Intelligence Management System requirements and continual improvement.",
    record: "/governance-library/iso-iec-42001-2023",
  },
  {
    title: "NIST AI RMF Governance Program",
    description: "Organizational governance aligned with Govern, Map, Measure, and Manage.",
    record: "/governance-library/nist-ai-rmf-1-0",
  },
  {
    title: "TA-14 Admissible Execution",
    description: "Evidence-bound governance architecture for consequential AI execution.",
    record: "/governance-library",
  },
];

export default function ManagementSystemsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          AI Management Systems
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Explore AI management systems, governance programs, and organizational
          operating models used to manage AI throughout its lifecycle.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {systems.map((system) => (
            <article
              key={system.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-semibold">{system.title}</h2>

              <p className="mt-4 text-slate-300">
                {system.description}
              </p>

              <div className="mt-8 flex gap-3">
                <Link
                  href={system.record}
                  className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950"
                >
                  View Record
                </Link>

                <Link
                  href="/governance-library/crosswalks"
                  className="rounded-lg border border-white/10 px-4 py-2"
                >
                  Crosswalk
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
