import Link from "next/link";

const regulations = [
  {
    title: "EU AI Act",
    description:
      "Risk-based legal requirements for providers, deployers, importers, distributors, and other actors across the AI lifecycle.",
  },
  {
    title: "U.S. Executive and Agency Requirements",
    description:
      "Federal directives, agency rules, procurement requirements, and sector-specific obligations affecting AI governance.",
  },
  {
    title: "State and Local AI Laws",
    description:
      "Subnational requirements addressing automated decisions, employment tools, consumer protection, privacy, and disclosure.",
  },
  {
    title: "Privacy and Data Protection",
    description:
      "Requirements governing personal data, lawful processing, transparency, access, correction, retention, and automated decision-making.",
  },
  {
    title: "Sector-Specific Regulation",
    description:
      "Obligations that apply to healthcare, finance, insurance, critical infrastructure, education, employment, and other regulated domains.",
  },
  {
    title: "Product Safety and Liability",
    description:
      "Rules concerning safety, defects, foreseeable misuse, documentation, accountability, and responsibility for AI-enabled products.",
  },
];

export default function RegulationsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">AI Regulations</h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Explore binding legal requirements, regulatory obligations, and
          sector-specific rules that shape AI governance and execution.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {regulations.map((regulation) => (
            <article
              key={regulation.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-semibold">{regulation.title}</h2>

              <p className="mt-4 text-slate-300">
                {regulation.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/governance-library/laws"
                  className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950"
                >
                  View Laws
                </Link>

                <Link
                  href="/governance-library/crosswalks"
                  className="rounded-lg border border-white/10 px-4 py-2"
                >
                  View Crosswalks
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
