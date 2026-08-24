import Link from 'next/link';

export function AtlasEnvironmentalIntegrityFundStrip() {
  return (
    <aside className="border-y border-emerald-300/20 bg-emerald-300/5" aria-label="TA-14 Environmental Integrity Reinvestment">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">30% Environmental Integrity Reinvestment · Up to 50% Municipal</p>
          <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-300">
            Across qualifying paid TA-14 products and services, covered payments can create recurring environmental-integrity reinvestment allocations. Participants can direct eligible mission preferences and receive private verification, annual/cumulative records, and qualifying recognition tied to actual allocation evidence.
          </p>
        </div>
        <Link href="/atlas-environmental-integrity-fund" className="shrink-0 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
          See how your participation creates impact -&gt;
        </Link>
      </div>
    </aside>
  );
}
