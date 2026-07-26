import Link from "next/link";

const cards = [
  { title: "Browse Records", description: "Search every governance record in the library.", href: "/governance-library/all" },
  { title: "Browse Categories", description: "Explore records grouped by governance category.", href: "/governance-library/category" },
  { title: "Official References", description: "View records with official source links.", href: "/governance-library/references" },
  { title: "Governance Dashboard", description: "See library metrics and summaries.", href: "/governance-library/dashboard" },
];

export default function GovernanceLibraryFeaturedActions() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-semibold text-white">Start Exploring</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="rounded-xl border border-white/10 p-5 transition hover:border-sky-400/40 hover:bg-sky-400/10">
            <h3 className="font-semibold text-white">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
