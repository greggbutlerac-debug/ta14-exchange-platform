export const metadata = {
  title: 'TA-14-AIGR-000027 | S3DVS',
  description: 'Permanent public TA-14 AI Governance Registry record for S3DVS Version 1.0 by Mario Koehn.',
};

const evidence = [
  's3dvs-ta14-cover-letter.pdf — formal submission letter defining the GRC and physical enforcement boundary',
  's3dvs-registration-dossier.pdf — technical specification of eight memory categories, Dual-Processor separation model, and architectural non-claims',
  's3dvs-empirical-evidence-report.pdf — Hardware Demonstrator empirical evidence, Protocols 1–10',
  'Patent DE 10 2013 005 971 B3.pdf — German patent specification for Schadsoftware-sicheres Datenverarbeitungssystem',
];

export default function S3DVSRegistryRecord() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-slate-100">
      <div className="mb-8 border-b border-cyan-900/60 pb-8">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-400">TA-14 AI Governance Registry</p>
        <h1 className="mt-3 text-4xl font-semibold">S3DVS Version 1.0</h1>
        <p className="mt-3 text-lg text-slate-300">Permanent Registry ID: TA-14-AIGR-000027</p>
      </div>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
          <h2 className="text-xl font-semibold">Frozen baseline</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-slate-400">Architecture</dt><dd>S3DVS</dd></div>
            <div><dt className="text-slate-400">Version</dt><dd>1.0</dd></div>
            <div><dt className="text-slate-400">Baseline confirmation</dt><dd>September 1, 2026 — 14:14:34 (participant-supplied confirmation timestamp)</dd></div>
            <div><dt className="text-slate-400">Authenticated Exchange identity</dt><dd>dcb.office.becker@gmail.com</dd></div>
            <div><dt className="text-slate-400">Registry state</dt><dd>FROZEN — preserved without rewriting</dd></div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
          <h2 className="text-xl font-semibold">Declared examination boundary</h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            The participant proposes a bounded examination of whether an inadmissible execution remains physically non-bypassable at the consequence boundary even under a compromised runtime.
          </p>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Registration preserves the participant's declared baseline and evidence. It does not itself constitute TA-14 validation of the proposition, patent claims, or empirical conclusions. Those remain subject to bounded examination.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-xl font-semibold">Frozen evidence manifest</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          {evidence.map((item) => <li key={item} className="border-l-2 border-cyan-900 pl-4">{item}</li>)}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border border-amber-900/50 bg-amber-950/10 p-6">
        <h2 className="text-xl font-semibold">Institutional status</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Independent registration → verified frozen baseline → bounded proposition → examination. No authority is transferred by registration. No evidence is rewritten by TA-14. Any later finding must preserve the distinction between the registered claim, the examined evidence, and the resulting determination.
        </p>
      </section>
    </main>
  );
}
