import Link from "next/link";

const roles = [
  {
    title: "Governing Body",
    description:
      "Sets governance direction, approves policy, defines risk appetite, and maintains organizational accountability.",
  },
  {
    title: "AI System Owner",
    description:
      "Owns the system's intended purpose, lifecycle decisions, control requirements, and operational accountability.",
  },
  {
    title: "Risk & Compliance",
    description:
      "Interprets obligations, evaluates risk, reviews controls, and preserves evidence of governance decisions.",
  },
  {
    title: "Technical Team",
    description:
      "Designs, builds, tests, documents, deploys, and maintains AI systems within approved governance boundaries.",
  },
  {
    title: "Human Reviewer",
    description:
      "Exercises defined oversight authority, reviews exceptions, and intervenes when execution conditions are not satisfied.",
  },
  {
    title: "Independent Assessor",
    description:
      "Evaluates evidence, controls, conformance, and execution outcomes without owning the system being reviewed.",
  },
  {
    title: "Data Steward",
    description:
      "Maintains data quality, provenance, lawful use, access controls, retention, and governance continuity.",
  },
  {
    title: "Incident Authority",
    description:
      "Coordinates response, containment, escalation, corrective action, and post-incident evidence preservation.",
  },
];

export default function RolesPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Governance Roles & Responsibilities
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Explore the organizational roles required to govern AI systems,
          preserve accountability, and maintain authority across the lifecycle.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {roles.map((role) => (
            <article
              key={role.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-xl font-semibold">{role.title}</h2>

              <p className="mt-4 text-slate-300">{role.description}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/governance-library/management-systems"
                  className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950"
                >
                  Management Systems
                </Link>

                <Link
                  href="/governance-library/lifecycle"
                  className="rounded-lg border border-white/10 px-4 py-2"
                >
                  Lifecycle
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
