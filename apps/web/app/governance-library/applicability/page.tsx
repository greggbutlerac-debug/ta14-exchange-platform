import Link from "next/link";

const authorities = [
  {
    name: "EU AI Act",
    why: "Selected profile indicates potential high-risk or regulated AI deployment.",
    evidence: ["Technical Documentation","Risk Assessment","Human Oversight","Post-Market Monitoring"],
    route: "TA-14 Runtime Admissibility Route",
  },
  {
    name: "ISO/IEC 42001",
    why: "Organization indicated an AI management system approach.",
    evidence: ["Governance Policy","Roles","Objectives","Management Review"],
    route: "TA-14 AI Management Route",
  },
  {
    name: "NIST AI RMF",
    why: "Risk management and trustworthy AI objectives were selected.",
    evidence: ["Risk Register","Validation","Monitoring","Testing"],
    route: "TA-14 Risk & Evidence Route",
  },
];

export default function ApplicabilityEnginePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          AI Governance Applicability Engine
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Identify governance authorities that are likely applicable to your AI
          system before building a TA-14 execution route.
        </p>

        <div className="mt-10 grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm">Organization Role</label>
            <select className="w-full rounded-lg border border-white/10 bg-[#0b1022] p-3">
              <option>Provider</option>
              <option>Deployer</option>
              <option>Integrator</option>
              <option>Customer</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm">Jurisdiction</label>
            <select className="w-full rounded-lg border border-white/10 bg-[#0b1022] p-3">
              <option>Global</option>
              <option>European Union</option>
              <option>United States</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm">AI System</label>
            <select className="w-full rounded-lg border border-white/10 bg-[#0b1022] p-3">
              <option>General-Purpose AI</option>
              <option>Foundation Model</option>
              <option>High-Risk AI</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm">Deployment</label>
            <select className="w-full rounded-lg border border-white/10 bg-[#0b1022] p-3">
              <option>Internal</option>
              <option>Customer Facing</option>
              <option>Public</option>
            </select>
          </div>
        </div>

        <h2 className="mt-14 text-3xl font-semibold">Likely Applicable Authorities</h2>

        <div className="mt-6 space-y-6">
          {authorities.map((a)=>(
            <article key={a.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-2xl font-semibold">{a.name}</h3>
              <p className="mt-3 text-slate-300">{a.why}</p>

              <div className="mt-5">
                <h4 className="font-semibold text-sky-300">Recommended Evidence</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {a.evidence.map(e=>(
                    <span key={e} className="rounded-full border border-white/10 px-3 py-1 text-xs">
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-5"><strong>Recommended Route:</strong> {a.route}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/governance-library" className="rounded-lg border border-white/10 px-4 py-2">
                  Open Library
                </Link>
                <Link href="/governance-library/dictionary" className="rounded-lg border border-white/10 px-4 py-2">
                  Dictionary
                </Link>
                <Link href="/ai-governance/build-a-route" className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950">
                  Build TA-14 Route
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
