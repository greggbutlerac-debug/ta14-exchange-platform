import Link from "next/link";

const principles = [
  {
    title: "Human Agency and Oversight",
    description:
      "AI systems should preserve meaningful human authority, intervention paths, and accountability for consequential decisions.",
  },
  {
    title: "Technical Robustness and Safety",
    description:
      "Systems should operate reliably, resist foreseeable failure, and remain within defined safety and execution boundaries.",
  },
  {
    title: "Privacy and Data Governance",
    description:
      "Data should be lawfully obtained, appropriately governed, traceable, secure, and limited to legitimate purposes.",
  },
  {
    title: "Transparency and Explainability",
    description:
      "Relevant parties should be able to understand the system's role, limitations, evidence basis, and decision path.",
  },
  {
    title: "Fairness and Non-Discrimination",
    description:
      "AI governance should identify, evaluate, and address unjustified differential treatment and harmful bias.",
  },
  {
    title: "Accountability and Auditability",
    description:
      "Roles, authority, evidence, approvals, execution decisions, and outcomes should be attributable and reviewable.",
  },
  {
    title: "Environmental and Social Well-Being",
    description:
      "AI systems should account for broader societal, environmental, and public-interest consequences.",
  },
  {
    title: "Admissible Execution",
    description:
      "Execution should occur only when evidence, authority, continuity, binding, and governing conditions are satisfied.",
  },
];

export default function PrinciplesPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">AI Governance Principles</h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Explore the foundational principles used across AI laws, standards,
          frameworks, management systems, and execution-control architectures.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-xl font-semibold">{principle.title}</h2>

              <p className="mt-4 text-slate-300">
                {principle.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/governance-library/crosswalks"
                  className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950"
                >
                  View Crosswalks
                </Link>

                <Link
                  href="/governance-library/dictionary"
                  className="rounded-lg border border-white/10 px-4 py-2"
                >
                  Related Terms
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
