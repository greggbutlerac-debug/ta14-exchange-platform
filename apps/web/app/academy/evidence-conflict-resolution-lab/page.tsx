export default function EvidenceConflictResolutionLabPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">
        TA-14 Academy — Evidence Conflict Resolution Lab
      </h1>

      <p className="mb-6">
        Learn how to evaluate conflicting evidence without allowing unsupported
        conclusions to bind to execution.
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold">Workflow</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Collect all admissible records.</li>
            <li>Identify conflicts and missing evidence.</li>
            <li>Determine whether continuity is preserved.</li>
            <li>Request additional evidence when required.</li>
            <li>Issue an ALLOW, HOLD, DENY, or ESCALATE recommendation.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Learning Goal</h2>
          <p>
            Students learn that unresolved evidence conflicts should pause
            execution until the governing deficiency is resolved.
          </p>
        </section>
      </div>
    </main>
  );
}
