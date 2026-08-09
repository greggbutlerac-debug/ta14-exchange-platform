import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "TA-14 24-Link Architecture | TA-14 Academy",
    template: "%s | TA-14 Academy",
  },
  description:
    "The TA-14 Academy learning environment for the 24-Link Admissible Execution Architecture.",
};

const navigation = [
  {
    href: "/academy/24-link-academy",
    label: "Academy Hub",
  },
  {
    href: "/academy/24-link-architecture",
    label: "Explorer",
  },
  {
    href: "/academy/24-link-architecture/route-state",
    label: "Route State",
  },
  {
    href: "/academy/24-link-architecture/simulator",
    label: "Simulator",
  },
  {
    href: "/academy/24-link-architecture/passport",
    label: "Passport",
  },
  {
    href: "/academy/24-link-architecture/build-a-chain",
    label: "Build-a-Chain",
  },
  {
    href: "/academy/24-link-architecture/health",
    label: "Health Overlay",
  },
  {
    href: "/academy/24-link-architecture/views",
    label: "Navigator",
  },
  {
    href: "/academy/24-link-architecture/provenance",
    label: "Provenance",
  },
  {
    href: "/academy/24-link-architecture/recursion",
    label: "Recursion",
  },
] as const;

export default function TA1424LinkArchitectureLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#030712]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030712]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-6 py-3 lg:px-8">
          <Link
            href="/academy/24-link-academy"
            className="shrink-0 text-sm font-semibold tracking-tight text-white"
          >
            TA-14
            <span className="ml-2 text-sky-300">24-Link Academy</span>
          </Link>

          <nav
            aria-label="24-Link Academy"
            className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-sky-300/30 hover:bg-sky-300/[0.07] hover:text-sky-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-white/10 bg-[#02050c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
                TA-14 Admissible Execution Architecture
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Reality → Record → Continuity → Admissibility → Binding →
                Commit → Execution → Outcome was created and publicly
                published as the foundational Chain of Eight on May 1, 2025.
                The 24-link architecture is the subsequent deeper-resolution
                expansion of that parent route.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/academy/24-link-academy"
                className="text-slate-400 transition hover:text-sky-300"
              >
                Academy
              </Link>
              <Link
                href="/academy/24-link-architecture"
                className="text-slate-400 transition hover:text-sky-300"
              >
                Canon
              </Link>
              <Link
                href="/academy/24-link-architecture/provenance"
                className="text-slate-400 transition hover:text-indigo-300"
              >
                Provenance
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-xs leading-6 text-slate-600">
            Academy learning, mapping, simulation, provenance display, or
            evidence-state views do not by themselves constitute certification,
            legal determination, patent-scope determination, production
            validation, endorsement, or authorization to execute.
          </div>
        </div>
      </footer>
    </div>
  );
}
