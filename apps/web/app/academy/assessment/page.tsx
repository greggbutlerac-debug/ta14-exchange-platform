import React from "react";

export default function AssessmentPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Academy Assessments</h1>

        <div className="mt-8 rounded-xl border p-6">
          <h2 className="text-2xl font-semibold">Assessment Center</h2>
          <ul className="mt-4 list-disc pl-5 space-y-2">
            <li>Knowledge Checks</li>
            <li>Scenario Evaluations</li>
            <li>Governance Challenges</li>
            <li>Evidence Validation</li>
            <li>Progress Tracking</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
