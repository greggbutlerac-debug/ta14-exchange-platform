import Link from "next/link";

const categories = [
  {
    title: "Healthcare",
    description: "Governance resources for clinical AI, diagnostics, medical devices, and patient safety.",
  },
  {
    title: "Financial Services",
    description: "Governance resources for lending, fraud detection, payments, insurance, and investment systems.",
  },
  {
    title: "Government",
    description: "Governance resources for public-sector AI, procurement, transparency, and accountability.",
  },
  {
    title: "Critical Infrastructure",
    description: "Governance resources for energy, transportation, utilities, and communications.",
  },
  {
    title: "Building Automation",
    description: "Governance resources for smart buildings, HVAC, BAS, environmental integrity, and operational AI.",
  },
  {
    title: "Manufacturing",
    description: "Governance resources for robotics, industrial automation, and quality assurance.",
  },
];

export default function SectorGovernancePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Sector Governance
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Explore governance considerations that are specific to regulated industries
          and operational environments.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((sector) => (
            <article
              key={sector.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-semibold">{sector.title}</h2>

              <p className="mt-4 text-slate-300">
                {sector.description}
              </p>

              <div className="mt-8 flex gap-3">
                <Link
                  href="/governance-library"
                  className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950"
                >
                  Browse Library
                </Link>

                <Link
                  href="/governance-library/crosswalks"
                  className="rounded-lg border border-white/10 px-4 py-2"
                >
                  Crosswalks
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
