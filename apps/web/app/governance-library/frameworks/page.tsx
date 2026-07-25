import Link from "next/link";

const frameworks=[
{name:"EU AI Act",type:"Regulation",jurisdiction:"European Union",focus:"Risk-based AI governance.",href:"/governance-library/eu-ai-act"},
{name:"NIST AI RMF",type:"Framework",jurisdiction:"United States",focus:"Trustworthy AI risk management.",href:"/governance-library/nist-ai-rmf-1-0"},
{name:"ISO/IEC 42001",type:"Management System",jurisdiction:"International",focus:"AI management systems.",href:"/governance-library/iso-iec-42001-2023"},
];

export default function FrameworksPage(){
return (
<main className="min-h-screen bg-[#050816] text-white">
<div className="mx-auto max-w-7xl px-6 py-16">
<p className="text-sm uppercase tracking-[0.22em] text-sky-300">TA-14 AI Governance Library</p>
<h1 className="mt-3 text-5xl font-bold">AI Governance Frameworks</h1>
<p className="mt-6 max-w-3xl text-lg text-slate-300">Browse major AI governance authorities.</p>
<div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
{frameworks.map(f=>(
<article key={f.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
<span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs">{f.type}</span>
<h2 className="mt-4 text-2xl font-semibold">{f.name}</h2>
<p className="mt-2 text-sm text-slate-400">{f.jurisdiction}</p>
<p className="mt-4 text-slate-300">{f.focus}</p>
<div className="mt-6 flex gap-3">
<Link href={f.href} className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950">View Record</Link>
<Link href="/governance-library/crosswalks" className="rounded-lg border border-white/10 px-4 py-2">Crosswalk</Link>
</div>
</article>
))}
</div>
</div>
</main>);
}
