import Link from "next/link";
import type { ReactNode } from "react";

type GovernanceLibraryLayoutProps = {
  children: ReactNode;
};

const navigationSections = [
  {
    label: "Library",
    links: [
      { href: "/governance-library", label: "Overview" },
      { href: "/governance-library/dictionary", label: "AI Governance Dictionary" },
      { href: "/governance-library?category=law", label: "Laws" },
      { href: "/governance-library?category=standard", label: "Standards" },
      { href: "/governance-library?category=framework", label: "Frameworks" },
    ],
  },
  {
    label: "Governance Systems",
    links: [
      {
        href: "/governance-library?category=management-system",
        label: "Management Systems",
      },
      {
        href: "/governance-library?category=risk-management",
        label: "Risk Management",
      },
      { href: "/governance-library?category=testing", label: "Testing" },
      {
        href: "/governance-library?category=sector-governance",
        label: "Sector Governance",
      },
    ],
  },
  {
    label: "Execution Tools",
    links: [
      { href: "/governance-library/crosswalks", label: "Crosswalks" },
      {
        href: "/governance-library/applicability",
        label: "Applicability Engine",
      },
      { href: "/ai-governance/build-a-route", label: "TA-14 Route Builder" },
    ],
  },
];

function GovernanceLibraryNavigation() {
  return (
    <nav aria-label="AI Governance Library">
      <Link href="/governance-library" className="block">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
          TA-14
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">
          AI Governance Library
        </h2>
      </Link>

      <div className="mt-7 space-y-7">
        {navigationSections.map((section) => (
          <section key={section.label}>
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {section.label}
            </p>

            <div className="mt-2 space-y-1">
              {section.links.map((link) => (
                <Link
                  key={`${section.label}-${link.href}-${link.label}`}
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </nav>
  );
}

export default function GovernanceLibraryLayout({
  children,
}: GovernanceLibraryLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/10 bg-[#070b19] px-5 py-8 lg:block">
          <div className="sticky top-6">
            <GovernanceLibraryNavigation />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="border-b border-white/10 bg-[#070b19] px-5 py-4 lg:hidden">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-white">
                <span>AI Governance Library Navigation</span>
                <span className="text-slate-400 transition group-open:rotate-180">
                  ↓
                </span>
              </summary>

              <div className="mt-3 rounded-xl border border-white/10 bg-[#050816] p-4">
                <GovernanceLibraryNavigation />
              </div>
            </details>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
