import Link from 'next/link';

export function AtlasEnvironmentalIntegrityFundStrip() {
  return (
    <aside
      className="relative overflow-hidden border-y border-emerald-300/15 bg-[radial-gradient(circle_at_15%_0%,rgba(52,211,153,0.12),transparent_34%),linear-gradient(180deg,rgba(6,78,59,0.12),rgba(2,6,23,0.72))]"
      aria-label="TA-14 Environmental Integrity Reinvestment"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
              Environmental Integrity Reinvestment
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Verified participant allocation</span>
          </div>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black tracking-[-0.05em] text-white">30%</span>
              <span className="max-w-36 text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-emerald-200/80">Standard qualifying reinvestment</span>
            </div>
            <div className="hidden h-12 w-px bg-white/10 sm:block" />
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold tracking-[-0.04em] text-white/90">Up to 50%</span>
              <span className="max-w-36 text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-slate-400">Qualifying municipal deployments</span>
            </div>
          </div>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-300">
            Qualifying paid TA-14 products and services can create recurring environmental-integrity allocations. Participants can direct eligible mission preferences and receive private verification, annual and cumulative records, and qualifying recognition tied to actual allocation evidence.
          </p>
        </div>

        <Link
          href="/atlas-environmental-integrity-fund"
          className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-5 py-3 text-sm font-bold text-emerald-100 transition hover:border-emerald-300/50 hover:bg-emerald-300/15"
        >
          See the reinvestment model
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </aside>
  );
}
