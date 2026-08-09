import Link from "next/link";
import { notFound } from "next/navigation";

import {
  TA14_24_LINKS,
  TA14_PROVENANCE_STATEMENT,
  getTA14LinkBySlug,
} from "@/lib/academy/ta14-24-link-canon";

type PageProps = {
  params: Promise<{
    link: string;
  }>;
};

function routeSegment(order: number, slug: string) {
  return `${String(order).padStart(2, "0")}-${slug}`;
}

function extractSlug(value: string) {
  return decodeURIComponent(value).replace(/^\d{1,2}-/, "");
}

export function generateStaticParams() {
  return TA14_24_LINKS.map((item) => ({
    link: routeSegment(item.order, item.slug),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { link } = await params;
  const item = getTA14LinkBySlug(extractSlug(link));

  if (!item) {
    return {
      title: "TA-14 Link Not Found | TA-14 Academy",
    };
  }

  return {
    title: `${String(item.order).padStart(2, "0")} ${item.canonicalName} | TA-14 Academy`,
    description: item.definition,
  };
}

export default async function TA14CanonicalLinkPage({ params }: PageProps) {
  const { link } = await params;
  const item = getTA14LinkBySlug(extractSlug(link));

  if (!item) {
    notFound();
  }

  const index = TA14_24_LINKS.findIndex(
    (candidate) => candidate.linkId === item.linkId,
  );

  const previous = index > 0 ? TA14_24_LINKS[index - 1] : null;
  const next =
    index >= 0 && index < TA14_24_LINKS.length - 1
      ? TA14_24_LINKS[index + 1]
      : null;

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_85%_20%,rgba(99,102,241,0.10),transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/academy/24-link-architecture"
            className="text-sm font-semibold text-sky-300 transition hover:text-sky-200"
          >
            ← Back to 24-Link Explorer
          </Link>

          <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
                  Link {String(item.order).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  Parent anchor: {item.parentAnchor}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {item.versionState}
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
                {item.canonicalName}
              </h1>

              <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
                {item.definition}
              </p>
            </div>

            <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Canonical identifier
              </p>
              <p className="mt-2 font-mono text-sm text-sky-200">
                {item.linkId}
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Architecture region
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {item.region}
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Position
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {item.order} of 24
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            eyebrow="Governing question"
            title="What must this link answer?"
            body={item.governingQuestion}
          />
          <Panel
            eyebrow="Proof object"
            title="What demonstrates the state?"
            body={item.proofObject}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ListPanel
            eyebrow="Evidence requirements"
            title="What evidence must support this link?"
            items={item.evidenceRequirements}
          />
          <ListPanel
            eyebrow="Failure modes"
            title="What can make this link unsupportable?"
            items={item.failureModes}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel
            eyebrow="Transition rule"
            title="What must be true before progression?"
            body={item.transitionRule}
          />
          <Panel
            eyebrow="Hold / refuse / escalate"
            title="When must continuation stop or narrow?"
            body={item.holdRefuseEscalateRule}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <DependencyPanel item={item} />
          <Panel
            eyebrow="Downstream consequence"
            title="What becomes vulnerable if this link is weak?"
            body={item.downstreamConsequence}
          />
        </div>

        <section className="mt-10 rounded-3xl border border-emerald-300/25 bg-emerald-300/[0.06] p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
            Mastery task
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Demonstrate capability, not seat time.
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-200">
            {item.masteryTask}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {["Recognize", "Explain", "Evidence-map", "Diagnose", "Apply"].map(
              (step) => (
                <div
                  key={step}
                  className="rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-center text-sm font-semibold text-slate-200"
                >
                  {step}
                </div>
              ),
            )}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-indigo-300/20 bg-indigo-300/[0.045] p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
            Trace this canonical link
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Move from doctrine to provenance.
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
            Continue from this lesson into the governed public record behind
            {` ${item.canonicalName}`}: chronology, publications, patent
            position, artifacts, reviews, and source relationships remain
            separate evidence classes and should be read within their declared
            boundaries.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <Link
              href={`/academy/24-link-architecture/provenance?link=${encodeURIComponent(
                item.linkId,
              )}`}
              className="rounded-2xl border border-sky-300/20 bg-sky-300/[0.05] p-5 transition hover:border-sky-300/40 hover:bg-sky-300/[0.08]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
                Provenance Map
              </p>
              <p className="mt-2 font-semibold text-white">
                Inspect source relationships
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Trace the architecture to chronology, publications, artifacts,
                reviews, and other governed public sources.
              </p>
            </Link>

            <Link
              href="/academy/24-link-architecture/provenance/patents"
              className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-5 transition hover:border-amber-300/40 hover:bg-amber-300/[0.08]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
                Patent Position
              </p>
              <p className="mt-2 font-semibold text-white">
                Explore mapped applications
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Review the documented application portfolio and its bounded
                architectural relationships.
              </p>
            </Link>

            <Link
              href={`/academy/24-link-architecture/provenance/intake?link=${encodeURIComponent(
                item.linkId,
              )}`}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-indigo-300/30 hover:bg-white/[0.055]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">
                Administrative Intake
              </p>
              <p className="mt-2 font-semibold text-white">
                Register a source for this link
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Open provenance intake with {item.linkId} already selected for
                a bounded source-to-link relationship.
              </p>
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-amber-300/20 bg-amber-300/[0.05] p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
            Provenance boundary
          </p>
          <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-300">
            {TA14_PROVENANCE_STATEMENT}
          </p>
        </section>
      </section>

      <nav className="border-t border-white/10 bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-10 sm:grid-cols-2 lg:px-8">
          <div>
            {previous ? (
              <Link
                href={`/academy/24-link-architecture/${routeSegment(
                  previous.order,
                  previous.slug,
                )}`}
                className="block rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-sky-300/30 hover:bg-white/[0.055]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Previous link
                </p>
                <p className="mt-2 font-semibold text-sky-200">
                  {String(previous.order).padStart(2, "0")}{" "}
                  {previous.canonicalName}
                </p>
              </Link>
            ) : (
              <div className="rounded-2xl border border-white/5 p-5 text-sm text-slate-600">
                Beginning of canonical route
              </div>
            )}
          </div>

          <div>
            {next ? (
              <Link
                href={`/academy/24-link-architecture/${routeSegment(
                  next.order,
                  next.slug,
                )}`}
                className="block rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-right transition hover:border-sky-300/30 hover:bg-white/[0.055]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Next link
                </p>
                <p className="mt-2 font-semibold text-sky-200">
                  {String(next.order).padStart(2, "0")} {next.canonicalName}
                </p>
              </Link>
            ) : (
              <div className="rounded-2xl border border-white/5 p-5 text-right text-sm text-slate-600">
                Future Chain completes the canonical route
              </div>
            )}
          </div>
        </div>
      </nav>
    </main>
  );
}

function Panel({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-xl font-semibold">{title}</h2>
      <p className="mt-4 leading-7 text-slate-300">{body}</p>
    </section>
  );
}

function ListPanel({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: readonly string[];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-xl font-semibold">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((value) => (
          <li
            key={value}
            className="flex gap-3 rounded-xl border border-white/5 bg-black/10 px-4 py-3 text-sm leading-6 text-slate-300"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DependencyPanel({
  item,
}: {
  item: (typeof TA14_24_LINKS)[number];
}) {
  const upstream = item.upstreamDependencies
    .map((linkId) =>
      TA14_24_LINKS.find((candidate) => candidate.linkId === linkId),
    )
    .filter(
      (candidate): candidate is (typeof TA14_24_LINKS)[number] =>
        Boolean(candidate),
    );

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
        Upstream dependencies
      </p>
      <h2 className="mt-3 text-xl font-semibold">
        What prior states does this link depend on?
      </h2>

      {upstream.length === 0 ? (
        <p className="mt-4 leading-7 text-slate-300">
          This is the entry link. It establishes the bounded reality from which
          the governed route begins.
        </p>
      ) : (
        <div className="mt-5 flex flex-wrap gap-2">
          {upstream.map((dependency) => (
            <Link
              key={dependency.linkId}
              href={`/academy/24-link-architecture/${routeSegment(
                dependency.order,
                dependency.slug,
              )}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-sky-300/30 hover:text-sky-200"
            >
              {String(dependency.order).padStart(2, "0")}{" "}
              {dependency.canonicalName}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export const dynamicParams = false;
export const revalidate = false;
