'use client';

import Link from '../../apps/web/node_modules/next/link';
import ProofLayer from './ProofLayer';

const doors = [
  ['AI GOVERNANCE', '/workspace/ai-governance'],
  ['TA-14 ACADEMY', '/academy'],
  ['ENVIRONMENTAL INTEGRITY GOVERNANCE', '/environmental-integrity-governance'],
  ['LAW · STANDARDS · PUBLIC POLICY', '/law-standards-public-policy'],
  ['EU AI ACT WORLD', '/eu-ai-act'],
] as const;

const architecturePaths = [
  ['ACA', '/ai-governance/admissible-computation'],
  ['AEA', '/registry/ta-14-admissible-execution-architecture'],
  ['FEIG', '/artifacts/ta14-feig'],
] as const;

export default function FrontDoorPrototype() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02040a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,.18),transparent_18%),radial-gradient(circle_at_18%_20%,rgba(59,130,246,.12),transparent_22%),radial-gradient(circle_at_82%_28%,rgba(168,85,247,.12),transparent_20%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25">{Array.from({ length: 32 }, (_, i) => <div key={i} className="absolute top-[-120%] h-[240%] w-px bg-gradient-to-b from-transparent via-cyan-300/70 to-transparent animate-pulse" style={{ left: `${(i + 1) * (100 / 33)}%` }} />)}</div>
      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
          <div className="text-center lg:text-left"><p className="text-xs font-semibold tracking-[.35em] text-cyan-300">AI GOVERNANCE</p><h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">INTELLIGENCE NEEDS GOVERNANCE</h1></div>
          <div className="relative mx-auto flex h-52 w-52 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_90px_rgba(34,211,238,.35)] backdrop-blur sm:h-64 sm:w-64"><div className="absolute inset-5 rounded-full border border-white/15"/><div className="text-center"><div className="text-4xl font-black tracking-[.15em]">TA-14</div><div className="mt-2 text-[10px] tracking-[.28em] text-cyan-200">AUTHORITY</div></div></div>
          <div className="text-center lg:text-right"><p className="text-xs font-semibold tracking-[.35em] text-violet-300">ADMISSIBLE EXECUTION</p><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">NO ADMISSIBLE EVIDENCE.<br/>NO ADMISSIBLE EXECUTION.</h2></div>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{doors.map(([label,href])=><Link key={href} href={href} className="flex min-h-28 items-center justify-center rounded-2xl border border-white/15 bg-white/[.045] p-5 text-center text-sm font-bold tracking-[.12em] backdrop-blur transition hover:border-cyan-300/60 hover:bg-cyan-300/10">{label}</Link>)}</div>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs tracking-[.18em] text-white/70"><span>AI GOVERNANCE ARCHITECTURES</span>{architecturePaths.map(([label,href])=><Link key={href} href={href} className="rounded-full border border-white/15 px-4 py-2 hover:border-cyan-300/50 hover:text-cyan-200">{label}</Link>)}</div>
        <ProofLayer />
      </section>
    </main>
  );
}
