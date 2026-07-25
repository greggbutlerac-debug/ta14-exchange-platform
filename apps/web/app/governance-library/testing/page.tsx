import Link from "next/link";

const methods = [
  {
    title: "Conformity Assessment",
    description: "Evaluate whether an AI system satisfies defined governance requirements before deployment.",
  },
  {
    title: "Validation Testing",
    description: "Demonstrate that an AI system performs acceptably for its intended use.",
  },
  {
    title: "Runtime Governance Testing",
    description: "Verify execution-time controls, evidence preservation, and admissibility decisions.",
  },
  {
    title: "Red Team Exercises",
    description: "Challenge AI systems using adversarial testing to identify weaknesses and governance gaps.",
  },
  {
    title: "Continuous Monitoring",
    description: "Observe deployed AI systems for drift, incidents, and governance compliance over time.",
  },
  {
    title: "Audit & Assurance",
    description: "Review governance controls, evidence, records, and execution history.",
  },
];

export default function TestingPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          AI Governance Testing
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Explore testing methodologies used to evaluate AI governance, assurance,
          runtime controls, and evidence quality.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {methods.map((method) => (
            <article
              key={method.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-semibold">
                {method.title}
              </h2>

              <p className="mt-4 text-slate-300">
                {method.description}
              </p>

              <div className="mt-8 flex gap-3">
                <Link
                  href="/governance-library/crosswalks"
                  className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950"
                >
                  View Crosswalk
                </Link>

                <Link
                  href="/governance-library/dictionary"
                  className="rounded-lg border border-white/10 px-4 py-2"
                >
                  Dictionary
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
