import Link from 'next/link';

export function AtlasEnvironmentalIntegrityFundStrip() {
  return (
    <aside className="border-y border-emerald-300/20 bg-emerald-300/5" aria-label="TA-14 Environmental Integrity Reinvestment">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">30% Environmental Integrity Reinvestment · Up to 50% Municipal</p>
          <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-300">
            Qualifying TA-14 commercial activity is designed to finance Environmental Integrity Governance, Atmospheric Integrity Records, Personal Atmospheric Integrity, schools and other critical environments, zoos and critical animal environments, and global atmospheric-integrity infrastructure. Every actual allocation is intended to be publicly traceable from source to recipient to outcome evidence.
          </p>
        </div>
        <Link href="/atlas-environmental-integrity-fund" className="shrink-0 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
          See the commitment and public ledger -&gt;
        </Link>
      </div>
    </aside>
  );
}
