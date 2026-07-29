export default function RouteValidationWorkshopPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">TA-14 Academy — Route Validation Workshop</h1>
      <p className="mb-4">
        This lesson teaches students to validate a completed governed route before
        execution. Every route is reviewed for Reality, Record, Continuity,
        Admissibility, Binding, Commit, Execution, and Outcome.
      </p>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Validation Checklist</h2>
        <ul className="list-disc pl-6">
          <li>Evidence is current and preserved.</li>
          <li>Authority is valid for the requested action.</li>
          <li>Continuity has not been broken.</li>
          <li>Dependencies remain admissible.</li>
          <li>Execution remains inside its approved boundary.</li>
          <li>Outcome can be independently verified.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Decision</h2>
        <p>
          Final recommendation:
          <strong> ALLOW / HOLD / DENY / ESCALATE</strong>
        </p>
      </section>
    </main>
  );
}
