import Link from "next/link";
import { notFound } from "next/navigation";

import { governanceLibraryCatalog } from "../../../lib/governance-library/catalog";
import {
  getGovernanceLibraryRecordBySlug,
  getRelatedGovernanceRecords,
} from "../../../lib/governance-library/search";
import type {
  GovernanceAuthorityLevel,
  GovernanceEvidenceType,
  GovernanceLifecycleStage,
  Ta14ChainLink,
} from "../../../lib/governance-library/types";

type GovernanceLibraryRecordPageProps = {
  params:
    | {
        slug: string;
      }
    | Promise<{
        slug: string;
      }>;
};

const toTitleCase = (value: string): string =>
  value
    .split("-")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");

const authorityBadgeClass = (
  authorityLevel: GovernanceAuthorityLevel,
): string => {
  switch (authorityLevel) {
    case "binding-law":
    case "binding-regulation":
      return "border-rose-400/40 bg-rose-500/10 text-rose-100";
    case "certifiable-standard":
      return "border-sky-400/40 bg-sky-500/10 text-sky-100";
    case "official-guidance":
      return "border-amber-400/40 bg-amber-500/10 text-amber-100";
    default:
      return "border-white/15 bg-white/5 text-slate-200";
  }
};

const chainOrder: Ta14ChainLink[] = [
  "reality",
  "record",
  "continuity",
  "admissibility",
  "binding",
  "commit",
  "execution",
  "outcome",
];

const lifecycleOrder: GovernanceLifecycleStage[] = [
  "concept",
  "design",
  "data",
  "development",
  "training",
  "evaluation",
  "validation",
  "procurement",
  "deployment",
  "operation",
  "monitoring",
  "change-management",
  "incident-response",
  "retirement",
  "post-execution-review",
];

const evidenceOrder: GovernanceEvidenceType[] = [
  "policy",
  "procedure",
  "risk-assessment",
  "impact-assessment",
  "data-record",
  "model-record",
  "system-card",
  "technical-documentation",
  "test-result",
  "evaluation-result",
  "validation-result",
  "audit-record",
  "approval-record",
  "authority-record",
  "training-record",
  "incident-record",
  "monitoring-record",
  "change-record",
  "execution-record",
  "outcome-record",
  "supplier-record",
  "contract",
  "public-notice",
  "human-oversight-record",
  "security-record",
  "privacy-record",
  "other",
];

export function generateStaticParams() {
  return governanceLibraryCatalog.map((record) => ({
    slug: record.slug,
  }));
}

export default async function GovernanceLibraryRecordPage({
  params,
}: GovernanceLibraryRecordPageProps) {
  const { slug } = await Promise.resolve(params);
  const record = getGovernanceLibraryRecordBySlug(slug);

  if (!record) notFound();

  const relatedRecords = getRelatedGovernanceRecords(record.id);

  const lifecycleStages = lifecycleOrder.filter((stage) =>
    record.lifecycleStages.includes(stage),
  );

  const evidenceTypes = evidenceOrder.filter((type) =>
    record.evidenceTypes.includes(type),
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_36%),linear-gradient(to_bottom,rgba(15,23,42,0.2),rgba(5,8,22,0.96))]" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <Link
            href="/governance-library"
            className="inline-flex text-sm font-medium text-sky-300 transition hover:text-sky-200"
          >
            ← Back to AI Governance Library
          </Link>

          <div className="mt-8 max-w-5xl">
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${authorityBadgeClass(
                  record.authorityLevel,
                )}`}
              >
                {toTitleCase(record.authorityLevel)}
              </span>

              {record.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                >
                  {toTitleCase(category)}
                </span>
              ))}
            </div>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
              Governed Library Record
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {record.acronym}
            </h1>

            <p className="mt-4 max-w-4xl text-xl leading-8 text-sky-100">
              {record.fullName}
            </p>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
              {record.plainLanguagePurpose}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
              <h2 className="text-2xl font-semibold">
                What it is
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                {record.description}
              </p>

              <div className="mt-6 border-t border-white/10 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Scope
                </h3>
                <p className="mt-3 leading-7 text-slate-300">
                  {record.scopeSummary}
                </p>
              </div>
            </section>

            {record.requirements?.length ? (
              <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                <h2 className="text-2xl font-semibold">
                  Principal governance requirements
                </h2>

                <div className="mt-6 space-y-4">
                  {record.requirements.map((requirement) => (
                    <article
                      key={requirement.id}
                      className="rounded-xl border border-white/10 bg-black/15 p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">
                          {requirement.label}
                        </h3>

                        {requirement.mandatory ? (
                          <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-100">
                            Mandatory
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-3 leading-7 text-slate-300">
                        {requirement.summary}
                      </p>

                      {requirement.ta14ChainLinks?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {requirement.ta14ChainLinks.map(
                            (chainLink) => (
                              <span
                                key={chainLink}
                                className="rounded-full border border-sky-400/20 bg-sky-400/[0.07] px-3 py-1 text-xs text-sky-100"
                              >
                                TA-14: {toTitleCase(chainLink)}
                              </span>
                            ),
                          )}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {record.ta14RouteActions?.length ? (
              <section className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.04] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
                  TA-14 Admissible Execution Mapping
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  From governance language to controlled execution
                </h2>

                <div className="mt-6 space-y-4">
                  {chainOrder
                    .filter((chainLink) =>
                      record.ta14RouteActions?.some(
                        (action) =>
                          action.chainLink === chainLink,
                      ),
                    )
                    .flatMap((chainLink) =>
                      (record.ta14RouteActions ?? [])
                        .filter(
                          (action) =>
                            action.chainLink === chainLink,
                        )
                        .map((action, index) => (
                          <article
                            key={`${chainLink}-${index}`}
                            className="rounded-xl border border-white/10 bg-black/20 p-5"
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-100">
                                {toTitleCase(chainLink)}
                              </span>

                              {action.failureDecision ? (
                                <span className="rounded-full border border-amber-400/25 bg-amber-400/[0.08] px-3 py-1 text-xs text-amber-100">
                                  Failure result:{" "}
                                  {action.failureDecision}
                                </span>
                              ) : null}
                            </div>

                            <h3 className="mt-4 text-lg font-semibold">
                              {action.action}
                            </h3>

                            <p className="mt-3 leading-7 text-slate-300">
                              {action.purpose}
                            </p>

                            {action.requiredEvidence?.length ? (
                              <div className="mt-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                  Required evidence
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                  {action.requiredEvidence.map(
                                    (evidence) => (
                                      <span
                                        key={evidence}
                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                                      >
                                        {toTitleCase(evidence)}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            ) : null}
                          </article>
                        )),
                    )}
                </div>
              </section>
            ) : null}

            {relatedRecords.length ? (
              <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                <h2 className="text-2xl font-semibold">
                  Related governance instruments
                </h2>

                <div className="mt-6 space-y-4">
                  {relatedRecords.map((related) => (
                    <article
                      key={related.record.id}
                      className="rounded-xl border border-white/10 bg-black/15 p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {toTitleCase(related.relationship)} ·{" "}
                            {toTitleCase(related.confidence)}
                          </p>

                          <h3 className="mt-2 text-lg font-semibold">
                            {related.record.acronym}
                          </h3>

                          <p className="mt-1 text-sm text-sky-200">
                            {related.record.fullName}
                          </p>

                          <p className="mt-3 leading-7 text-slate-300">
                            {related.explanation}
                          </p>
                        </div>

                        <Link
                          href={`/governance-library/${related.record.slug}`}
                          className="shrink-0 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-white"
                        >
                          Open record
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <h2 className="text-lg font-semibold">
                Source authority
              </h2>

              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">
                    Issuing authority
                  </dt>
                  <dd className="mt-1 leading-6 text-slate-200">
                    {record.source.issuingAuthority}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">
                    Official title
                  </dt>
                  <dd className="mt-1 leading-6 text-slate-200">
                    {record.source.officialTitle}
                  </dd>
                </div>

                {record.source.version ? (
                  <div>
                    <dt className="text-slate-500">Version</dt>
                    <dd className="mt-1 text-slate-200">
                      {record.source.version}
                    </dd>
                  </div>
                ) : null}

                {record.source.publicationDate ? (
                  <div>
                    <dt className="text-slate-500">
                      Publication date
                    </dt>
                    <dd className="mt-1 text-slate-200">
                      {record.source.publicationDate}
                    </dd>
                  </div>
                ) : null}

                {record.source.effectiveDate ? (
                  <div>
                    <dt className="text-slate-500">
                      Effective date
                    </dt>
                    <dd className="mt-1 text-slate-200">
                      {record.source.effectiveDate}
                    </dd>
                  </div>
                ) : null}

                <div>
                  <dt className="text-slate-500">Status</dt>
                  <dd className="mt-1 text-slate-200">
                    {toTitleCase(record.status)}
                  </dd>
                </div>
              </dl>

              {record.source.officialUrl ? (
                <a
                  href={record.source.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full justify-center rounded-xl border border-sky-400/30 bg-sky-400/10 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-300/50 hover:bg-sky-400/20"
                >
                  Open official source
                </a>
              ) : null}
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <h2 className="text-lg font-semibold">
                Lifecycle coverage
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {lifecycleStages.map((stage) => (
                  <span
                    key={stage}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300"
                  >
                    {toTitleCase(stage)}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <h2 className="text-lg font-semibold">
                Evidence types
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {evidenceTypes.map((evidence) => (
                  <span
                    key={evidence}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300"
                  >
                    {toTitleCase(evidence)}
                  </span>
                ))}
              </div>
            </section>

            {record.aliases?.length ? (
              <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <h2 className="text-lg font-semibold">
                  Also known as
                </h2>

                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
                  {record.aliases.map((alias) => (
                    <li key={alias}>{alias}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>

        <section className="mt-10 rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-5">
          <p className="text-sm leading-6 text-amber-100/80">
            {record.legalDisclaimer ??
              "This governed library record is an educational navigation aid. It does not replace official source material, qualified legal advice, certification, conformity assessment, or regulator determinations."}
          </p>

          {record.limitations?.length ? (
            <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-100/70">
              {record.limitations.map((limitation) => (
                <li key={limitation}>• {limitation}</li>
              ))}
            </ul>
          ) : null}
        </section>
      </section>
    </main>
  );
}
