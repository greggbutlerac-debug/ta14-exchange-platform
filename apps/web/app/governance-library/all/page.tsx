import Link from "next/link";
import { governanceLibraryRecords } from "../../lib/governance-library";
import { getGovernanceLibraryStatistics } from "../../lib/governance-library/statistics";

const librarySections = [
  {
    title: "Browse All Records",
    description:
      "Open the complete TA-14 AI Governance Library catalog and review every available governance record.",
    href: "/governance-library/all",
  },
  {
    title: "Frameworks",
    description:
      "Explore AI governance frameworks, control structures, and implementation models.",
    href: "/governance-library/frameworks",
  },
  {
    title: "Laws",
    description:
      "Review enacted and proposed AI laws, statutory obligations, and legal governance requirements.",
    href: "/governance-library/laws",
  },
  {
    title: "Standards",
    description:
      "Examine international, technical, assurance, and management-system standards.",
    href: "/governance-library/standards",
  },
  {
    title: "Regulations",
    description:
      "Review regulatory requirements, agency guidance, and jurisdiction-specific obligations.",
    href: "/governance-library/regulations",
  },
  {
    title: "Risk Management",
    description:
      "Explore governance records focused on identifying, evaluating, treating, and preserving AI risk.",
    href: "/governance-library/risk-management",
  },
  {
    title: "Testing",
    description:
      "Review testing, validation, red-team, evaluation, and verification governance resources.",
    href: "/governance-library/testing",
  },
  {
    title: "Governed Records",
    description:
      "Explore evidence-preserving records that support review, continuity, accountability, and replay.",
    href: "/governance-library/governed-records",
  },
  {
    title: "Crosswalks",
    description:
      "Compare governance frameworks, laws, standards, controls, and TA-14 execution requirements.",
    href: "/governance-library/crosswalks",
  },
  {
    title: "Dictionary",
    description:
      "Review governance terminology, defined concepts, and execution-control language.",
    href: "/governance-library/dictionary",
  },
];

export default function GovernanceLibraryPage() {
  const statistics = getGovernanceLibraryStatistics();
  const featuredRecords = governanceLibraryRecords.slice(0, 6);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300">
            TA-14 AI Governance Exchange
          </p>

          <h1 className="mt-4 max-w-5xl text-5xl font-bold leading-tight md:text-7xl">
            AI Governance Library
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            A structured library of AI governance laws, standards, frameworks,
            principles, controls, records, testing methods, assurance resources,
            and admissible execution architecture.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/governance-library/all"
              className="rounded-lg bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Browse All Records
            </Link>

            <Link
              href="/governance-library/recommendations"
              className="rounded-lg border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-sky-400/50"
            >
              Get Recommendations
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-3xl font-bold text-sky-300">
              {statistics.totalRecords}
            </div>
            <div className="mt-2 text-sm text-slate-300">Governance records</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-3xl font-bold text-sky-300">
              {statistics.totalCategories}
            </div>
            <div className="mt-2 text-sm text-slate-300">Categories</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-3xl font-bold text-sky-300">
              {statistics.totalJurisdictions}
            </div>
            <div className="mt-2 text-sm text-slate-300">Jurisdictions</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-3xl font-bold text-sky-300">
              {statistics.totalRecordTypes}
            </div>
            <div className="mt-2 text-sm text-slate-300">Record types</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-300">
              Library Access
            </p>
            <h2 className="mt-3 text-3xl font-bold">Explore by governance area</h2>
          </div>

          <Link
            href="/governance-library/all"
            className="hidden text-sm font-semibold text-sky-300 hover:text-sky-200 md:block"
          >
            View complete catalog →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {librarySections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-sky-400/40 hover:bg-white/[0.07]"
            >
              <h3 className="text-xl font-semibold group-hover:text-sky-300">
                {section.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-300">
                {section.description}
              </p>
              <div className="mt-5 text-sm font-semibold text-sky-300">
                Open section →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featuredRecords.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-12 pb-20">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-300">
              Available Now
            </p>
            <h2 className="mt-3 text-3xl font-bold">Featured governance records</h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredRecords.map((record) => (
              <Link
                key={record.slug}
                href={`/governance-library/${record.slug}`}
                className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-sky-400/40"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-sky-300">
                  {record.recordType}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{record.title}</h3>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-300">
                  {record.summary}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/governance-library/all"
              className="inline-block rounded-lg bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Enter the Complete Library
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
