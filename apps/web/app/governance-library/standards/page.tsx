import Link from "next/link";

const standards = [
  {
    name: "ISO/IEC 42001",
    type: "AI Management System",
    organization: "ISO/IEC",
    summary: "Requirements for establishing, implementing, maintaining, and improving an AI management system.",
    href: "/governance-library/iso-iec-42001-2023",
  },
  {
    name: "ISO/IEC 23894",
    type: "AI Risk Management",
    organization: "ISO/IEC",
    summary: "Guidance on AI risk management.",
    href: "#",
  },
];

export default function StandardsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">AI Governance Standards</h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Browse international AI governance standards and management system specifications.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {standards.map((item) => (
            <article key={item.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs">
                {item.type}
              </span>

              <h2 className="mt-4 text-2xl font-semibold">{item.name}</h2>
              <p className="mt-2 text-sm text-slate-400">{item.organization}</p>
              <p className="mt-5 text-slate-300">{item.summary}</p>

              <div className="mt-6 flex gap-3">
                <Link href={item.href} className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950">
                  View Record
                </Link>
                <Link href="/governance-library/crosswalks" className="rounded-lg border border-white/10 px-4 py-2">
                  Crosswalk
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
