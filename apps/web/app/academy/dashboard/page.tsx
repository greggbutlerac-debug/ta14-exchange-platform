import React from "react";

export default function AcademyDashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">TA-14 Academy Mission Control</h1>
        <p className="mt-4 text-lg">
          Resume learning, continue your last governed route, review progress,
          labs, assessments, credentials, and recent activity.
        </p>

        <div className="grid gap-6 mt-8 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Resume Learning",
            "Continue Last Route",
            "Recommended Next Step",
            "Current Pathway",
            "Labs Status",
            "Route Status",
            "Assessment Status",
            "Credential Status",
            "Recent Activity",
          ].map((title) => (
            <div key={title} className="rounded-xl border p-6 shadow">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm opacity-80">
                Placeholder panel to be integrated with existing Exchange data.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
