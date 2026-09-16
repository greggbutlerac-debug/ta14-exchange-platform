import Link from "next/link";

export const metadata = {
  title: "Guatemala · MARN | TA-14 Institutional Engagement",
  description: "Superficie bilingüe de examen técnico institucional entre Guatemala y TA-14 Authority.",
};

const chain = ["Reality", "Record", "Continuity", "Admissibility", "Binding", "Commit", "Execution", "Outcome"];

export default function GuatemalaInstitutionalShowroom() {
  return (
    <main className="min-h-screen bg-[#06101c] text-white">
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <div className="mb-8 flex items-center justify-between border-b border-amber-300/40 pb-6">
          <div className="text-5xl" aria-label="Bandera de Guatemala">🇬🇹</div>
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">TA-14 Authority · Global Institutional Engagement</div>
            <div className="mt-2 text-sm text-slate-300">Guatemala ↔ United States · Technical Engagement</div>
          </div>
          <div className="text-5xl" aria-label="United States flag">🇺🇸</div>
        </div>

        <div className="rounded-3xl border border-sky-300/20 bg-white/[0.04] p-7 md:p-10">
          <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Guatemala · Ministerio de Ambiente y Recursos Naturales (MARN)</div>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">De la evidencia de calidad del aire a la acción gobernada.</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-200">Superficie de examen técnico preparada por TA-14 Authority para apoyar la conversación solicitada con el personal especializado del Laboratorio de Análisis y Calidad Atmosférica y Audial de MARN.</p>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">Technical examination surface prepared by TA-14 Authority to support MARN Guatemala’s requested discussion with specialized atmospheric-analysis and air-quality personnel.</p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <h2 className="text-2xl font-semibold">La pregunta técnica</h2>
            <p className="mt-4 leading-7 text-slate-200">¿Cuándo los datos técnicamente válidos de calidad del aire se convierten en un registro probatorio suficientemente gobernado para respaldar una decisión o acción con consecuencias, y qué debe seguir siendo verdadero entre la medición y la ejecución para que esa decisión permanezca defendible tanto probatoria como operacionalmente?</p>
            <p className="mt-5 text-sm leading-6 text-slate-400">When does technically valid air-quality data become a sufficiently governed evidentiary record to support consequential action, and what must remain true between measurement and execution?</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <h2 className="text-2xl font-semibold">Límite institucional</h2>
            <p className="mt-4 leading-7 text-slate-200">TA-14 no sustituye la medición, el análisis de laboratorio, la regulación ambiental, la competencia institucional de MARN ni la autoridad pública de Guatemala. Examina la continuidad de evidencia y autoridad cuando un registro puede conducir a una acción con consecuencias.</p>
            <p className="mt-5 text-sm leading-6 text-slate-400">This is a technical-conversation surface only. It does not imply endorsement, adoption, regulatory recognition, procurement, contracting, or pilot authorization.</p>
          </article>
        </section>

        <section className="mt-10 rounded-2xl border border-amber-300/20 bg-black/20 p-7">
          <h2 className="text-2xl font-semibold">Cadena de ejecución admisible</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {chain.map((item, i) => <span key={item} className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200">{item}{i < chain.length - 1 ? " →" : ""}</span>)}
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-4">
            {["ALLOW", "HOLD", "DENY", "ESCALATE"].map((item) => <div key={item} className="rounded-xl border border-sky-300/20 bg-sky-300/[0.05] p-4 text-center font-semibold tracking-wider">{item}</div>)}
          </div>
          <p className="mt-6 font-medium text-amber-200">El contexto cambiado exige revalidación. La ausencia de una negativa no se convierte en autorización.</p>
          <p className="mt-2 text-sm text-slate-400">Changed context requires revalidation. The absence of refusal does not become authorization.</p>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 p-7">
          <h2 className="text-2xl font-semibold">Estado del compromiso institucional</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div><div className="text-xs uppercase tracking-wider text-slate-500">Institución</div><div className="mt-1">MARN · Guatemala</div></div>
            <div><div className="text-xs uppercase tracking-wider text-slate-500">Estado</div><div className="mt-1">Technical Examination Open</div></div>
            <div><div className="text-xs uppercase tracking-wider text-slate-500">Formato propuesto</div><div className="mt-1">Reunión virtual</div></div>
          </div>
          <p className="mt-6 text-sm leading-6 text-slate-400">Registro: MARN recibió la solicitud de TA-14 y pidió ampliar el tema, indicar modalidad y proponer fechas para una reunión técnica con personal especializado. Esta página conserva el alcance técnico sin atribuir adopción o representación a ninguna persona.</p>
        </section>

        <nav className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Link className="rounded-xl border border-sky-300/30 px-4 py-3 text-center hover:bg-white/5" href="/environmental-integrity-governance">Environmental Integrity Governance</Link>
          <Link className="rounded-xl border border-sky-300/30 px-4 py-3 text-center hover:bg-white/5" href="/environmental-integrity-governance">Atmospheric Integrity Records</Link>
          <Link className="rounded-xl border border-sky-300/30 px-4 py-3 text-center hover:bg-white/5" href="/registry/ta-14-admissible-execution-architecture">Admissible Execution Architecture</Link>
          <Link className="rounded-xl border border-amber-300/40 px-4 py-3 text-center hover:bg-white/5" href="/global-institutional-engagement">All Institutional Showrooms</Link>
          <Link className="rounded-xl bg-white px-4 py-3 text-center font-semibold text-slate-950" href="/registry/ta-14-admissible-execution-architecture">Explore the Architecture</Link>
        </nav>
      </section>
    </main>
  );
}
