import Link from "next/link";

const quickLinks = [
  { href: "/governance-library/all", label: "All Records" },
  { href: "/governance-library/category", label: "Categories" },
  { href: "/governance-library/jurisdiction", label: "Jurisdictions" },
  { href: "/governance-library/type", label: "Record Types" },
  { href: "/governance-library/topics", label: "Topics" },
  { href: "/governance-library/references", label: "Official References" },
];

export default function GovernanceLibraryQuickLinks() {
  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold text-white">
        Quick Access
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-white/10 px-4 py-3 text-slate-300 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
