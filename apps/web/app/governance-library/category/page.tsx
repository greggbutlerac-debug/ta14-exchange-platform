import Link from "next/link";
import { getAllCategories } from "../../../lib/governance-library/filters";
import { getCategoryCounts } from "../../../lib/governance-library/statistics";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function GovernanceCategoriesPage() {
  const categories = getAllCategories();
  const counts = new Map(
    getCategoryCounts().map((item) => [item.category, item.count])
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Governance Categories
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Browse governance records organized by category.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: string) => (
            <Link
              key={category}
              href={`/governance-library/category/${slugify(category)}`}
              className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-sky-400/40"
            >
              <h2 className="text-xl font-semibold">{category}</h2>

              <p className="mt-3 text-slate-300">
                {counts.get(category) ?? 0} record(s)
              </p>

              <div className="mt-5 text-sm font-semibold text-sky-300">
                View Category →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
