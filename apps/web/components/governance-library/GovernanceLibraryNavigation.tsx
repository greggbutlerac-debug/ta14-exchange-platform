import Link from "next/link";

const navigationSections = [
  {
    title: "Explore",
    links: [
      { href: "/governance-library", label: "Library Home" },
      { href: "/governance-library/all", label: "All Records" },
      { href: "/governance-library/dashboard", label: "Dashboard" },
      { href: "/governance-library/compare", label: "Comparison Matrix" },
      { href: "/governance-library/timeline", label: "Timeline" },
    ],
  },
  {
    title: "Browse",
    links: [
      { href: "/governance-library/category", label: "Categories" },
      { href: "/governance-library/jurisdiction", label: "Jurisdictions" },
      { href: "/governance-library/type", label: "Record Types" },
      { href: "/governance-library/publishers", label: "Publishers" },
      { href: "/governance-library/authorities", label: "Authorities" },
      { href: "/governance-library/years", label: "Publication Years" },
    ],
  },
  {
    title: "Knowledge",
    links: [
      { href: "/governance-library/topics", label: "Topics" },
      { href: "/governance-library/topic-map", label: "Topic Map" },
      { href: "/governance-library/glossary", label: "Glossary" },
      { href: "/governance-library/relationships", label: "Relationships" },
    ],
  },
  {
    title: "Verification",
    links: [
      { href: "/governance-library/references", label: "Official References" },
      { href: "/governance-library/sources", label: "Source Index" },
      { href: "/governance-library/coverage", label: "Coverage Report" },
      { href: "/governance-library/status", label: "Status Index" },
      {
        href: "/governance-library/publisher-matrix",
        label: "Publisher Matrix",
      },
    ],
  },
];

export default function GovernanceLibraryNavigation() {
  return (
    <nav
      aria-label="Governance Library"
      className="rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {navigationSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
              {section.title}
            </h2>

            <div className="mt-4 space-y-2">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-sky-400/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
