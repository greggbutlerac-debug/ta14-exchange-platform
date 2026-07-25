import Link from "next/link";

const assuranceTopics = [
  {
    title: "Independent Review",
    description:
      "Independent assessment of governance processes, evidence, controls, and execution decisions.",
  },
  {
    title: "Conformity Assessment",
    description:
      "Determine whether an AI system satisfies applicable legal, regulatory, and governance requirements.",
  },
  {
    title: "Evidence Verification",
    description:
      "Validate that governance conclusions are supported by attributable, preserved, and admissible evidence.",
  },
  {
    title: "Execution Assurance",
    description:
      "Confirm that runtime execution controls operated as designed and that execution outcomes were preserved.",
  },
  {
    title: "Continuous Assurance",
    description:
      "Maintain confidence through ongoing monitoring, periodic reassessment, and governance improvement.",
  },
  {
    title: "Audit Readiness",
    description:
      "Prepare organizations for internal audits, external assessments, certification, and regulatory review.",
  },
];

export default function AssurancePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">AI Assurance</h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Explore the practices used to establish confidence that AI governance
          controls, evidence, and execution operate as intended.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {assuranceTopics.map((topic) => (
            <article
              key={topic.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-semibold">{topic.title}</h2>

              <p className="mt-4 text-slate-300">{topic.description}</p>

              <div className="mt-8 flex gap-3">
                <Link
                  href="/governance-library/testing"
                  className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950"
                >
                  Testing
                </Link>

                <Link
                  href="/governance-library/governed-records"
                  className="rounded-lg border border-white/10 px-4 py-2"
                >
                  Records
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
