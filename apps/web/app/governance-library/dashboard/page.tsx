import Link from "next/link";
import {
  getGovernanceLibraryStatistics,
  getCategoryCounts,
  getJurisdictionCounts,
} from "../../../lib/governance-library/statistics";

export default function GovernanceLibraryDashboardPage() {
  const stats = getGovernanceLibraryStatistics();
  const topCategories = getCategoryCounts().slice(0, 10);
  const topJurisdictions = getJurisdictionCounts().slice(0, 10);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Library Dashboard
        </h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Records" value={stats.totalRecords} />
          <StatCard title="Categories" value={stats.totalCategories} />
          <StatCard title="Jurisdictions" value={stats.totalJurisdictions} />
          <StatCard title="Record Types" value={stats.totalRecordTypes} />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Top Categories</h2>

            <div className="mt-6 space-y-3">
              {topCategories.map((item) => (
                <Link
                  key={item.category}
                  href={`/governance-library/category/${slugify(item.category)}`}
                  className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 transition hover:border-sky-400/40"
                >
                  <span>{item.category}</span>
                  <span className="rounded-full bg-sky-400/10 px-3 py-1 text-sm text-sky-300">
                    {item.count}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Jurisdictions</h2>

            <div className="mt-6 space-y-3">
              {topJurisdictions.map((item) => (
                <div
                  key={item.jurisdiction}
                  className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3"
                >
                  <span>{item.jurisdiction}</span>
                  <span className="rounded-full bg-sky-400/10 px-3 py-1 text-sm text-sky-300">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="text-4xl font-bold text-sky-300">{value}</div>
      <div className="mt-2 text-slate-300">{title}</div>
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
