'use client';

import Link from '../../apps/web/node_modules/next/link';

export default function ProofLayer(){
  return <section className="mt-16 border-t border-white/10 pt-12" id="institutional-proof">
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-[10px] font-black tracking-[.2em] text-emerald-300">PUBLIC EVIDENCE · NOT FUTURE PROMISES</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Look through the windows. The institution has already started leaving a record.</h2>
      <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/60">A serious visitor should not have to accept TA-14's description of itself. Enter the governed worlds above, then inspect the registry, demonstrations, examinations, artifacts, and operational evidence preserved inside them.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/workspace/ai-governance/registry" className="rounded-full border border-emerald-300/30 px-5 py-3 text-xs font-bold tracking-[.12em] text-emerald-200">OPEN GOVERNANCE REGISTRY</Link>
        <Link href="/governance-showcase" className="rounded-full border border-cyan-300/30 px-5 py-3 text-xs font-bold tracking-[.12em] text-cyan-200">OPEN EVIDENCE SHOWCASE</Link>
        <Link href="/artifacts" className="rounded-full border border-white/20 px-5 py-3 text-xs font-bold tracking-[.12em] text-white/80">OPEN ARTIFACTS</Link>
      </div>
      <p className="mt-10 text-xs font-black tracking-[.16em] text-emerald-300">WHEN EVIDENCE STOPS, AUTHORITY STOPS.</p>
    </div>
  </section>;
}
