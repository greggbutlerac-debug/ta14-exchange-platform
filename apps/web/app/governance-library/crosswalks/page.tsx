import Link from "next/link";

const concepts = [
  {
    concept: "Risk Management",
    eu: "Supported",
    nist: "Supported",
    iso: "Supported",
    oecd: "Supported",
    ta14: "Maps to admissibility gates, evidence validation, and execution controls."
  },
  {
    concept: "Human Oversight",
    eu: "Supported",
    nist: "Supported",
    iso: "Supported",
    oecd: "Partial",
    ta14: "Mapped to authority validation, escalation, and intervention evidence."
  },
  {
    concept: "Technical Documentation",
    eu: "Supported",
    nist: "Partial",
    iso: "Supported",
    oecd: "Partial",
    ta14: "Documentation becomes governed evidence bound to execution."
  },
  {
    concept: "Post-Market Monitoring",
    eu: "Supported",
    nist: "Partial",
    iso: "Supported",
    oecd: "Partial",
    ta14: "New evidence triggers runtime revalidation."
  }
];

export default function CrosswalksPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          AI Governance Crosswalks
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Compare governance concepts across major AI governance authorities and
          understand how they map into TA-14 admissible execution.
        </p>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
          <table className="min-w-full text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="p-4 text-left">Concept</th>
                <th className="p-4">EU AI Act</th>
                <th className="p-4">NIST AI RMF</th>
                <th className="p-4">ISO/IEC 42001</th>
                <th className="p-4">OECD</th>
                <th className="p-4 text-left">TA-14 Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {concepts.map((row)=>(
                <tr key={row.concept} className="border-t border-white/10">
                  <td className="p-4 font-medium">
                    <Link href="/governance-library/dictionary">
                      {row.concept}
                    </Link>
                  </td>
                  <td className="p-4 text-center">{row.eu}</td>
                  <td className="p-4 text-center">{row.nist}</td>
                  <td className="p-4 text-center">{row.iso}</td>
                  <td className="p-4 text-center">{row.oecd}</td>
                  <td className="p-4">{row.ta14}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm text-amber-100">
          Crosswalks are governance navigation aids. Official laws, standards,
          and regulations remain the controlling authorities.
        </div>
      </div>
    </main>
  );
}
