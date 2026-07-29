"use client";

import Link from "next/link";

const cards = [
  { title: "Resume Learning", href: "/academy/start", desc: "Continue your guided Academy pathway." },
  { title: "Execution Simulator", href: "/academy/simulator", desc: "Practice governed execution decisions." },
  { title: "Review Workspace", href: "/academy/review", desc: "Review and preserve findings." },
  { title: "Assessment Center", href: "/academy/assessment", desc: "Validate knowledge and track progress." },
];

export default function AcademyDashboardPage() {
  return (
    <main className="min-h-screen bg-[#030812] text-white">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <h1 className="text-5xl font-bold">TA-14 Academy Mission Control</h1>
        <p className="mt-3 text-slate-300">
          Your central workspace for Academy learning, simulation, review, and assessment.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/40 hover:bg-white/10"
            >
              <h2 className="text-2xl font-semibold">{card.title}</h2>
              <p className="mt-2 text-slate-300">{card.desc}</p>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
          <h2 className="text-2xl font-semibold">Progress</h2>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/3 bg-cyan-400" />
          </div>
          <p className="mt-3 text-slate-300">Connect this page to your Academy progress service and user profile.</p>
        </section>
      </div>
    </main>
  );
}
