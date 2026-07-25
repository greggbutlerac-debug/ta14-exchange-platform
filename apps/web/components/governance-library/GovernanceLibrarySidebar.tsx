import Link from "next/link";
import { getCategoryCounts } from "../../lib/governance-library/statistics";

export default function GovernanceLibrarySidebar() {
  const categories = getCategoryCounts();

  return (
    <aside className="rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold text-white">
        Browse by Category
      </h2>

      <div className="mt-5 space-y-2">
        {categories.map(({ category, count }) => {
          const slug = category
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          return (
            <Link
              key={category}
              href={`/governance-library/category/${slug}`}
              className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-sky-400/40 hover:text-white"
            >
              <span>{category}</span>
              <span className="rounded-full bg-sky-400/10 px-2 py-0.5 text-xs text-sky-300">
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      <Link
        href="/governance-library/all"
        className="mt-6 inline-block rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950"
      >
        View Complete Library
      </Link>
    </aside>
  );
}
