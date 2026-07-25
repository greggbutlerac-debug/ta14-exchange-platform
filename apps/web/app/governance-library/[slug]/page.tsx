import Link from "next/link";
import {
  getRecordBySlug,
  getRelatedRecords,
} from "../../../lib/governance-library";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function GovernanceRecordPage({ params }: Props) {
  const { slug } = await params;
  const record = getRecordBySlug(slug);

  if (!record) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Record Not Found</h1>

          <Link
            href="/governance-library"
            className="mt-8 inline-block rounded-lg bg-sky-400 px-5 py-3 font-semibold text-slate-950"
          >
            Return to Library
          </Link>
        </div>
      </main>
    );
  }

  const related = getRelatedRecords(record);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          {record.recordType}
        </p>

        <h1 className="mt-3 text-5xl font-bold">{record.title}</h1>

        <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-300">
          <span className="rounded-full border border-white/10 px-3 py-1">
            {record.jurisdiction}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            {record.publisher}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            {record.status}
          </span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Summary</h2>
            <p className="mt-4 text-slate-300">{record.summary}</p>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Why It Matters</h2>
            <p className="mt-4 text-slate-300">{record.whyItMatters}</p>
          </section>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Key Topics</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {record.keyTopics.map((topic: string) => (
              <span
                key={topic}
                className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>

        {record.officialUrl ? (
          <div className="mt-10">
            <a
              href={record.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-lg bg-sky-400 px-5 py-3 font-semibold text-slate-950"
            >
              Official Source
            </a>
          </div>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold">Related Records</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/governance-library/${item.slug}`}
                  className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-400/40"
                >
                  <div className="font-semibold">{item.shortTitle}</div>
                  <div className="mt-2 text-sm text-slate-300">
                    {item.summary}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
