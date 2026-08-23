import Link from 'next/link';

export function AtlasEnvironmentalIntegrityFundStrip() {
  return (
    <aside className="border-y border-emerald-300/20 bg-emerald-300/5" aria-label="Atlas Environmental Integrity Fund">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">15% Environmental Integrity Commitment</p>
          <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-300">
            TA-14 designates 15% of qualifying commercial service receipts, after refunds and payment-processing fees and before owner distributions, to the Atlas Environmental Integrity Fund - a transparent institutional program supporting evidence-governed clean-air and environmental-integrity projects.
          </p>
        </div>
        <Link href="/atlas-environmental-integrity-fund" className="shrink-0 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
          See the public ledger -&gt;
        </Link>
      </div>
    </aside>
  );
}
