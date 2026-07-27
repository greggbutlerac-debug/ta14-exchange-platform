import Link from "next/link";

export const metadata = {
  title: "AI Governance | TA-14 Exchange",
  description:
    "Enter the TA-14 AI Governance Exchange, explore architecture-specific playgrounds, build governed routes, preserve records, and test admissible execution.",
};

const primaryEntrances = [
  {
    title: "Architecture Library",
    description:
      "Explore every registered AI governance architecture, including runtime execution, model evaluation, data provenance, agent tools, human oversight, policy controls, risk, decision, compliance, security, and outcome assurance.",
    href: "/ai-governance/library",
    label: "Open library",
  },
  {
    title: "Governance Playground",
    description:
      "Test a governance route against evidence, authority, scope, controls, dependencies, intervention, execution, outcome, and replay requirements.",
    href: "/ai-governance/playground",
    label: "Enter playground",
  },
  {
    title: "Build a Route",
    description:
      "Create a bounded governance route before execution and preserve the exact claim, evidence, authority, controls, determinations, and conditions.",
    href: "/ai-governance/build-a-route",
    label: "Build a route",
  },
  {
    title: "My AI Routes",
    description:
      "Return to saved governance routes, preserved runs, replay packages, determinations, and continuing-validity records.",
    href: "/ai-governance/my-routes",
    label: "View my routes",
  },
];

const architectureEntrances = [
  {
    title: "Runtime Execution",
    description:
      "Govern the boundary where an approved decision becomes a consequence-bearing action.",
    laneId: "runtime-execution",
  },
  {
    title: "Model Evaluation",
    description:
      "Test model identity, evidence, thresholds, limitations, change, and deployment conditions.",
    laneId: "model-evaluation",
  },
  {
    title: "Data Provenance",
    description:
      "Trace source, custody, transformation, authority, quality, and downstream reliance.",
    laneId: "data-provenance",
  },
  {
    title: "Agent and Tool Governance",
    description:
      "Govern delegated authority, tool calls, permissions, side effects, intervention, and receipts.",
    laneId: "agent-tools",
  },
  {
    title: "Human Oversight",
    description:
      "Test meaningful review, intervention, stop authority, escalation, and accountability.",
    laneId: "human-oversight",
  },
  {
    title: "Policy and Controls",
    description:
      "Bind policy claims to enforceable rules, controls, evidence, testing, and execution behavior.",
    laneId: "policy-controls",
  },
];

const exchangeEntrances = [
  {
    title: "Governed Records",
    description:
      "Build, upload, interpret, review, preserve, and export governed records.",
    href: "/records",
  },
  {
    title: "AI Governance Registry",
    description:
      "Review dated, attributable, challengeable architecture and governance records.",
    href: "/registry",
  },
  {
    title: "EU AI Act",
    description:
      "Test provider and deployer obligations against evidence and execution routes.",
    href: "/eu-ai-act",
  },
  {
    title: "Marketplace",
    description:
      "Post a need, locate governance capabilities, and connect bounded work to qualified providers.",
    href: "/marketplace",
  },
];

function laneHref(laneId: string): string {
  return `/ai-governance/playground?lane=${encodeURIComponent(laneId)}`;
}

export default function AiGovernancePage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-22rem] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute right-[-14rem] top-32 h-[32rem] w-[32rem] rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.36em] text-cyan-300">
            TA-14 AI Governance Exchange
          </p>

          <h1 className="max-w-6xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-7xl lg:text-[7.5rem]">
            Governance
            <span className="block text-cyan-300">Before Execution</span>
          </h1>

          <p className="mt-8 max-w-4xl text-lg leading-8 text-white/68 sm:text-xl">
            Build the route. Prove the evidence. Bind the authority. Test the
            controls. Preserve the determination. Then, and only then, permit
            execution.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/ai-governance/library"
              className="rounded-full border border-cyan-300 bg-cyan-300 px-7 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
            >
              Open Architecture Library
            </Link>

            <Link
              href="/ai-governance/playground"
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:border-cyan-300 hover:text-cyan-300"
            >
              Enter Playground
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
              Main entrances
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.035em] sm:text-5xl">
              Choose how you want to govern
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {primaryEntrances.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="group min-h-[300px] rounded-3xl border border-white/10 bg-white/[0.035] p-8 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-cyan-300/[0.05]"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xl text-white/35 transition group-hover:translate-x-1 group-hover:text-cyan-300">
                    →
                  </span>
                </div>

                <h3 className="mt-10 text-3xl font-black uppercase tracking-[-0.035em]">
                  {item.title}
                </h3>

                <p className="mt-5 max-w-2xl leading-7 text-white/62">
                  {item.description}
                </p>

                <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                  {item.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Architecture entrances
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.035em] sm:text-5xl">
                Test the exact governance layer
              </h2>
            </div>

            <Link
              href="/ai-governance/library"
              className="text-sm font-black uppercase tracking-[0.18em] text-white/65 transition hover:text-cyan-300"
            >
              View every architecture →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {architectureEntrances.map((architecture) => (
              <Link
                key={architecture.laneId}
                href={laneHref(architecture.laneId)}
                className="group rounded-3xl border border-white/10 bg-[#05070b] p-7 transition hover:border-cyan-300/60"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="rounded-full border border-cyan-300/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                    {architecture.laneId}
                  </span>
                  <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-cyan-300">
                    →
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-black uppercase tracking-[-0.025em]">
                  {architecture.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-white/58">
                  {architecture.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-cyan-300/25 bg-cyan-300/[0.045] p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Governing chain
              </p>

              <h2 className="mt-5 text-3xl font-black uppercase leading-tight tracking-[-0.035em] sm:text-4xl">
                Reality → Record → Continuity → Admissibility → Binding →
                Commit → Execution → Outcome
              </h2>

              <p className="mt-6 max-w-4xl leading-7 text-white/65">
                The Exchange does not treat governance as a policy document
                placed beside execution. It makes governance inspectable at the
                exact point where evidence, authority, controls, and decisions
                become real-world action.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                Canon
              </p>

              <h2 className="mt-5 text-3xl font-black uppercase tracking-[-0.035em]">
                No admissible evidence.
                <span className="block text-cyan-300">
                  No admissible execution.
                </span>
              </h2>

              <Link
                href="/ai-governance/build-a-route"
                className="mt-8 inline-flex rounded-full border border-white/15 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] transition hover:border-cyan-300 hover:bg-cyan-300 hover:text-black"
              >
                Build a governed route
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
              Across the Exchange
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.035em] sm:text-4xl">
              Continue into the governance infrastructure
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {exchangeEntrances.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-cyan-300/50"
              >
                <h3 className="text-lg font-black uppercase tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/55">
                  {item.description}
                </p>
                <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  Open →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
