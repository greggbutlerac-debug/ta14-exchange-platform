import React from "react";

export default function ReviewPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Academy Review Workspace</h1>
        <div className="grid gap-6 mt-8 md:grid-cols-2">
          <section className="rounded-xl border p-6">
            <h2 className="text-2xl font-semibold">Assigned Reviews</h2>
            <p className="mt-2">Reviewer queue and governed assignments.</p>
          </section>
          <section className="rounded-xl border p-6">
            <h2 className="text-2xl font-semibold">Findings</h2>
            <p className="mt-2">Record objections, corrections, and dispositions.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
