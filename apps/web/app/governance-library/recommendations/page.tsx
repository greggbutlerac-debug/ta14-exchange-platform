import Link from "next/link";

export default function GovernanceRouteRecommendationsPage() {
  const routes = [
    {
      name: "TA-14 Runtime Admissibility Route",
      why: "Recommended for consequential AI decisions requiring runtime evidence validation before execution.",
      authorities: ["EU AI Act", "ISO/IEC 42001", "NIST AI RMF"],
      objectives: [
        "Evidence admissibility",
        "Authority validation",
        "Runtime execution control",
        "Outcome preservation",
      ],
      complexity: "Advanced",
      buildTime: "15–20 minutes",
    },
    {
      name: "TA-14 Human Oversight Route",
      why: "Recommended where meaningful human intervention is required.",
      authorities: ["EU AI Act", "NIST AI RMF"],
      objectives: [
        "Human oversight",
        "Escalation",
        "Approval evidence",
        "Decision traceability",
      ],
      complexity: "Intermediate",
      buildTime: "10–15 minutes",
    },
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Governance Route Recommendations
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Select your governance profile and receive recommended TA-14
          admissible execution routes.
        </p>

        <section className="mt-12 grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 lg:grid-cols-2">
          <div>
            <label className="block text-sm mb-2">Jurisdiction</label>
            <select className="w-full rounded-lg border border-white/10 bg-[#0b1022] p-3">
              <option>Global</option>
              <option>European Union</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Organization Role</label>
            <select className="w-full rounded-lg border border-white/10 bg-[#0b1022] p-3">
              <option>Provider</option>
              <option>Deployer</option>
              <option>Integrator</option>
              <option>Distributor</option>
              <option>Customer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">AI System Type</label>
            <select className="w-full rounded-lg border border-white/10 bg-[#0b1022] p-3">
              <option>General-Purpose AI</option>
              <option>Foundation Model</option>
              <option>High-Risk AI</option>
              <option>Healthcare AI</option>
              <option>Financial AI</option>
              <option>Industrial AI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Governance Objectives</label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {["Risk Management","Human Oversight","Transparency","Runtime Governance","Evidence Preservation","Auditability"].map(item=>(
                <label key={item} className="flex gap-2">
                  <input type="checkbox"/>
                  {item}
                </label>
              ))}
            </div>
          </div>
        </section>

        <h2 className="mt-14 text-3xl font-semibold">
          Recommended Routes
        </h2>

        <div className="mt-6 space-y-6">
          {routes.map(route=>(
            <article key={route.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-2xl font-semibold">{route.name}</h3>
              <p className="mt-3 text-slate-300">{route.why}</p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-sky-300">Objectives</h4>
                  <ul className="mt-2 list-disc pl-5">
                    {route.objectives.map(o=><li key={o}>{o}</li>)}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sky-300">Authorities</h4>
                  <ul className="mt-2 list-disc pl-5">
                    {route.authorities.map(a=><li key={a}>{a}</li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-6 text-sm">
                <span><strong>Complexity:</strong> {route.complexity}</span>
                <span><strong>Build Time:</strong> {route.buildTime}</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/ai-governance/build-a-route" className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950">
                  Build Route
                </Link>
                <button className="rounded-lg border border-white/10 px-4 py-2">
                  Customize
                </button>
                <button className="rounded-lg border border-white/10 px-4 py-2">
                  Export
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
