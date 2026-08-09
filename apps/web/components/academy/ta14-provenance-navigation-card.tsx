import Link from "next/link";

export function TA14ProvenanceNavigationCard() {
  return (
    <Link
      href="/academy/24-link-architecture/provenance"
      className="group relative overflow-hidden rounded-3xl border border-indigo-300/20 bg-indigo-300/[0.045] p-6 transition hover:border-indigo-300/40 hover:bg-indigo-300/[0.075]"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-indigo-300/10 transition duration-700 group-hover:scale-125" />
      <div className="absolute right-8 top-8 h-2 w-2 rounded-full bg-indigo-200/70 shadow-[0_0_24px_rgba(199,210,254,0.8)]" />

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
        Provenance
      </p>

      <h3 className="mt-3 text-xl font-semibold text-white">
        24-Link Provenance Map
      </h3>

      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
        Trace each canonical link to its chronology, publications, patent
        position, patent applications, artifacts, reviews, and other governed
        source relationships.
      </p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-slate-500">
          Architecture → source → relationship
        </span>
        <span className="text-sm font-semibold text-indigo-200 transition group-hover:translate-x-1">
          Open map →
        </span>
      </div>
    </Link>
  );
}
