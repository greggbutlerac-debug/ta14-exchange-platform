import Link from "next/link";
import { createClient } from "@/apps/web/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Promise<{
  type?: string;
  registry?: string;
  case?: string;
}>;

type ReviewRecord = {
  id: string;
  record_identifier: string | null;
  record_type: string;
  record_type_label: string;
  voice_classification: string;
  title: string;
  summary: string | null;

  author_name: string;
  author_role: string | null;
  author_organization: string | null;

  registry_identifier: string | null;
  governance_entity_name: string | null;
  governance_version: string | null;

  demonstration_identifier: string | null;
  case_identifier: string | null;
  finding_identifier: string | null;
  artifact_identifier: string | null;

  parent_record_id: string | null;

  related_record_type: string | null;
  related_record_identifier: string | null;

  status: string;
  disposition: string | null;

  source_url: string | null;
  publication_date: string | null;

  submitted_at: string;
  published_at: string | null;

  integrity_digest: string | null;
  metadata: Record<string, unknown> | null;
};

type PublicCount = {
  record_type: string;
  record_type_label: string;
  record_count: number | string;
};

type CaseSummary = {
  registry_identifier: string | null;
  governance_entity_name: string | null;
  governance_version: string | null;
  demonstration_identifier: string | null;
  case_identifier: string | null;

  total_public_records: number | string;
  participant_reviews: number | string;
  participant_responses: number | string;
  independent_reviews: number | string;
  evidence_challenges: number | string;
  factual_corrections: number | string;
  technical_comments: number | string;
  replication_requests: number | string;
  demonstration_requests: number | string;
  external_publications: number | string;

  latest_public_record_at: string | null;
};

type VersionLineage = {
  registry_identifier: string;
  governance_entity_name: string;
  version: string;
  parent_version: string | null;
  lineage_status: string;

  registered: boolean;
  frozen: boolean;
  demonstrated: boolean;

  demonstration_identifier: string | null;
  case_identifier: string | null;

  finding_summary: string | null;

  development_started_at: string | null;
  frozen_at: string | null;
  registered_at: string | null;

  notes: string | null;

  created_at: string;
  updated_at: string;
};

const RECORD_FILTERS = [
  { value: "ALL", label: "All" },
  {
    value: "PARTICIPANT_REVIEW",
    label: "Participant Reviews",
  },
  {
    value: "PARTICIPANT_RESPONSE",
    label: "Participant Responses",
  },
  {
    value: "INDEPENDENT_REVIEW",
    label: "Independent Reviews",
  },
  {
    value: "EVIDENCE_CHALLENGE",
    label: "Evidence Challenges",
  },
  {
    value: "FACTUAL_CORRECTION",
    label: "Factual Corrections",
  },
  {
    value: "TECHNICAL_COMMENT",
    label: "Technical Comments",
  },
  {
    value: "EXTERNAL_PUBLICATION",
    label: "External Publications",
  },
];

const RECORD_ORDER = [
  "PARTICIPANT_REVIEW",
  "PARTICIPANT_RESPONSE",
  "INDEPENDENT_REVIEW",
  "EVIDENCE_CHALLENGE",
  "FACTUAL_CORRECTION",
  "TECHNICAL_COMMENT",
  "REPLICATION_REQUEST",
  "DEMONSTRATION_REQUEST",
  "EXTERNAL_PUBLICATION",
  "GOVERNED_MESSAGE",
];

const RECORD_DESCRIPTIONS: Record<string, string> = {
  PARTICIPANT_REVIEW:
    "An attributable review from the steward, architect, founder, owner, or authorized participant associated with the governed record.",

  PARTICIPANT_RESPONSE:
    "An attributable participant response to a finding, review, challenge, artifact, or other governed record.",

  INDEPENDENT_REVIEW:
    "An attributable external examination of evidence, methodology, architecture boundaries, execution behavior, or institutional findings.",

  EVIDENCE_CHALLENGE:
    "A bounded challenge identifying a specific evidentiary issue and the record to which that challenge applies.",

  FACTUAL_CORRECTION:
    "A request or preserved record concerning objective factual accuracy without renegotiating an independent finding.",

  TECHNICAL_COMMENT:
    "Substantive technical commentary preserved separately from formal review, finding, or evidence-challenge authority.",

  REPLICATION_REQUEST:
    "A request to repeat a prior demonstration, behavior, artifact, or evidence route under comparable conditions.",

  DEMONSTRATION_REQUEST:
    "A request to examine a registered governance claim, control, route, or consequence-bearing behavior through a future bounded demonstration.",

  EXTERNAL_PUBLICATION:
    "An independently authored publication linked to the governed record without becoming TA-14 institutional doctrine.",

  GOVERNED_MESSAGE:
    "A contextual institutional communication linked to a governed record and preserved according to its visibility and evidentiary status.",
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Not recorded";
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function normalizeCount(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function recordBadgeClass(recordType: string) {
  switch (recordType) {
    case "PARTICIPANT_REVIEW":
      return "border-emerald-300/30 bg-emerald-400/10 text-emerald-100";

    case "PARTICIPANT_RESPONSE":
      return "border-cyan-300/30 bg-cyan-400/10 text-cyan-100";

    case "INDEPENDENT_REVIEW":
      return "border-violet-300/30 bg-violet-400/10 text-violet-100";

    case "EVIDENCE_CHALLENGE":
      return "border-amber-300/30 bg-amber-400/10 text-amber-100";

    case "FACTUAL_CORRECTION":
      return "border-blue-300/30 bg-blue-400/10 text-blue-100";

    case "TECHNICAL_COMMENT":
      return "border-slate-300/30 bg-slate-400/10 text-slate-100";

    case "EXTERNAL_PUBLICATION":
      return "border-fuchsia-300/30 bg-fuchsia-400/10 text-fuchsia-100";

    default:
      return "border-white/15 bg-white/5 text-slate-100";
  }
}

function statusBadgeClass(status: string) {
  if (status === "PUBLISHED") {
    return "border-emerald-300/30 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "DISPUTED") {
    return "border-amber-300/30 bg-amber-400/10 text-amber-100";
  }

  if (status === "UNDER_REVIEW") {
    return "border-blue-300/30 bg-blue-400/10 text-blue-100";
  }

  return "border-white/15 bg-white/5 text-slate-300";
}

function lineageLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function buildFilterHref(type: string) {
  if (type === "ALL") {
    return "/workspace/ai-governance/reviews";
  }

  return `/workspace/ai-governance/reviews?type=${encodeURIComponent(type)}`;
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.12)] backdrop-blur">
      <div className="text-3xl font-semibold tracking-tight text-white">
        {value}
      </div>

      <div className="mt-2 text-sm font-semibold text-slate-100">
        {label}
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function RecordCard({
  record,
}: {
  record: ReviewRecord;
}) {
  const metadata = record.metadata ?? {};

  const caseTitle =
    typeof metadata.case_title === "string"
      ? metadata.case_title
      : null;

  const findingClass =
    typeof metadata.ta14_finding_class === "string"
      ? metadata.ta14_finding_class
      : null;

  const closingDetermination =
    typeof metadata.closing_determination === "string"
      ? metadata.closing_determination
      : null;

  return (
    <article className="group rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.16)] backdrop-blur transition hover:border-white/20 hover:bg-white/[0.06]">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${recordBadgeClass(
            record.record_type,
          )}`}
        >
          {record.record_type_label}
        </span>

        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${statusBadgeClass(
            record.status,
          )}`}
        >
          {record.status.replaceAll("_", " ")}
        </span>

        {record.voice_classification ? (
          <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-300">
            {record.voice_classification}
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
          {record.record_identifier ?? "Linked institutional record"}
        </p>

        <h3 className="mt-2 text-xl font-semibold leading-tight text-white">
          {record.title}
        </h3>

        {record.summary ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {record.summary}
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Author
          </div>

          <div className="mt-1 text-sm font-medium text-slate-100">
            {record.author_name}
          </div>

          {record.author_role || record.author_organization ? (
            <div className="mt-1 text-xs leading-5 text-slate-400">
              {[record.author_role, record.author_organization]
                .filter(Boolean)
                .join(" · ")}
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Governance
          </div>

          <div className="mt-1 text-sm font-medium text-slate-100">
            {record.governance_entity_name ?? "Not specified"}
          </div>

          {record.registry_identifier ? (
            <div className="mt-1 text-xs text-slate-400">
              {record.registry_identifier}
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Demonstration
          </div>

          <div className="mt-1 text-sm font-medium text-slate-100">
            {record.demonstration_identifier ?? "Not specified"}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            {caseTitle ?? record.case_identifier ?? "No case linked"}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Published
          </div>

          <div className="mt-1 text-sm font-medium text-slate-100">
            {formatDate(
              record.publication_date ?? record.published_at,
            )}
          </div>

          {record.disposition ? (
            <div className="mt-1 text-xs text-slate-400">
              {record.disposition.replaceAll("_", " ")}
            </div>
          ) : null}
        </div>
      </div>

      {findingClass || closingDetermination ? (
        <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.045] p-4">
          {findingClass ? (
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
              {findingClass}
            </div>
          ) : null}

          {closingDetermination ? (
            <p className="mt-2 text-sm leading-6 text-slate-200">
              {closingDetermination}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {record.record_type === "PARTICIPANT_REVIEW" &&
        record.record_identifier ? (
          <Link
            href={`/workspace/ai-governance/reviews/${record.record_identifier}`}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Read Participant Review →
          </Link>
        ) : null}

        {record.record_type === "EXTERNAL_PUBLICATION" &&
        record.source_url ? (
          <a
            href={record.source_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Open Publication ↗
          </a>
        ) : null}

        {record.registry_identifier ? (
          <Link
            href={`/workspace/ai-governance/registry/public/${record.registry_identifier}`}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/[0.05]"
          >
            Registry Record
          </Link>
        ) : null}

        {record.demonstration_identifier ? (
          <Link
            href="/workspace/ai-governance/demonstrations"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/[0.05]"
          >
            Demonstrations
          </Link>
        ) : null}
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="text-xs leading-5 text-slate-500">
          This record retains its own authorship and institutional
          classification. Publication in Reviews & Responses does not
          automatically constitute TA-14 adoption, endorsement, validation,
          certification, or modification of another governed record.
        </p>
      </div>
    </article>
  );
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const selectedType =
    params.type?.toUpperCase() ?? "ALL";

  const selectedRegistry =
    params.registry ?? null;

  const selectedCase =
    params.case ?? null;

  const supabase = await createClient();

  let recordsQuery = supabase
    .from("ta14_reviews_responses_public_index")
    .select("*")
    .order("published_at", {
      ascending: false,
    });

  if (selectedType !== "ALL") {
    recordsQuery = recordsQuery.eq(
      "record_type",
      selectedType,
    );
  }

  if (selectedRegistry) {
    recordsQuery = recordsQuery.eq(
      "registry_identifier",
      selectedRegistry,
    );
  }

  if (selectedCase) {
    recordsQuery = recordsQuery.eq(
      "case_identifier",
      selectedCase,
    );
  }

  const [
    recordsResult,
    countsResult,
    caseSummaryResult,
    lineageResult,
  ] = await Promise.all([
    recordsQuery,

    supabase
      .from("ta14_reviews_responses_public_counts")
      .select("*"),

    supabase
      .from("ta14_reviews_responses_case_summary")
      .select("*")
      .order("latest_public_record_at", {
        ascending: false,
      }),

    supabase
      .from("ta14_public_governance_version_lineage")
      .select("*")
      .eq(
        "registry_identifier",
        "TA-14-AIGR-000008",
      )
      .order("version", {
        ascending: true,
      }),
  ]);

  if (recordsResult.error) {
    console.error(
      "TA-14 Reviews records query failed:",
      recordsResult.error,
    );
  }

  if (countsResult.error) {
    console.error(
      "TA-14 Reviews counts query failed:",
      countsResult.error,
    );
  }

  if (caseSummaryResult.error) {
    console.error(
      "TA-14 Reviews case summary query failed:",
      caseSummaryResult.error,
    );
  }

  if (lineageResult.error) {
    console.error(
      "TA-14 Reviews lineage query failed:",
      lineageResult.error,
    );
  }

  const records =
    (recordsResult.data ?? []) as ReviewRecord[];

  const counts =
    (countsResult.data ?? []) as PublicCount[];

  const caseSummaries =
    (caseSummaryResult.data ?? []) as CaseSummary[];

  const lineage =
    (lineageResult.data ?? []) as VersionLineage[];

  const countMap = new Map(
    counts.map((item) => [
      item.record_type,
      normalizeCount(item.record_count),
    ]),
  );

  const totalPublicRecords =
    Array.from(countMap.values()).reduce(
      (sum, value) => sum + value,
      0,
    );

  const participantReviews =
    countMap.get("PARTICIPANT_REVIEW") ?? 0;

  const participantResponses =
    countMap.get("PARTICIPANT_RESPONSE") ?? 0;

  const independentReviews =
    countMap.get("INDEPENDENT_REVIEW") ?? 0;

  const evidenceChallenges =
    countMap.get("EVIDENCE_CHALLENGE") ?? 0;

  const factualCorrections =
    countMap.get("FACTUAL_CORRECTION") ?? 0;

  const technicalComments =
    countMap.get("TECHNICAL_COMMENT") ?? 0;

  const externalPublications =
    countMap.get("EXTERNAL_PUBLICATION") ?? 0;

  const foundingCase =
    caseSummaries.find(
      (item) =>
        item.registry_identifier ===
          "TA-14-AIGR-000008" &&
        item.demonstration_identifier ===
          "FD-2026-0002" &&
        item.case_identifier ===
          "CASE-001",
    ) ?? null;

  const sortedCounts = [...counts].sort(
    (a, b) => {
      const aIndex = RECORD_ORDER.indexOf(
        a.record_type,
      );

      const bIndex = RECORD_ORDER.indexOf(
        b.record_type,
      );

      return (
        (aIndex === -1 ? 999 : aIndex) -
        (bIndex === -1 ? 999 : bIndex)
      );
    },
  );

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute right-[-8rem] top-[-6rem] h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-[120px]" />
          <div className="absolute bottom-[-14rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-blue-600/10 blur-[140px]" />

          <div className="absolute left-[12%] top-[34%] h-2 w-2 animate-pulse rounded-full bg-cyan-200/70" />
          <div className="absolute right-[18%] top-[26%] h-1.5 w-1.5 animate-pulse rounded-full bg-violet-200/70" />
          <div className="absolute bottom-[24%] right-[32%] h-1 w-1 rounded-full bg-white/60" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            <Link
              href="/workspace/ai-governance"
              className="transition hover:text-white"
            >
              AI Governance
            </Link>

            <span>/</span>

            <span className="text-cyan-200">
              Reviews & Responses
            </span>
          </div>

          <div className="mt-8 max-w-5xl">
            <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
              Governed Institutional Record
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
              Reviews & Responses
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300 lg:text-xl">
              Independent voices. Preserved chronology.
              Governed scrutiny.
            </p>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 lg:text-base">
              The TA-14 Reviews & Responses record preserves
              participant reviews, responses, independent reviews,
              evidence challenges, factual corrections, technical
              comments, external publications, replication
              requests, demonstration requests, and governed
              communications without collapsing those voices into
              one institutional narrative.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="#public-record"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Explore the Public Record
            </Link>

            <Link
              href="#submission-pathways"
              className="rounded-full border border-white/15 bg-white/[0.025] px-5 py-3 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/[0.05]"
            >
              Review or Respond
            </Link>

            <Link
              href="/workspace/ai-governance/registry"
              className="rounded-full border border-white/15 bg-white/[0.025] px-5 py-3 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/[0.05]"
            >
              Governance Registry
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Public Records"
              value={totalPublicRecords}
              description="Published governed records presently visible through Reviews & Responses."
            />

            <StatCard
              label="Participant Reviews"
              value={participantReviews}
              description="Attributable participant accounts preserved separately from TA-14 findings."
            />

            <StatCard
              label="Independent Reviews"
              value={independentReviews}
              description="External governed reviews preserved under independent authorship."
            />

            <StatCard
              label="Evidence Challenges"
              value={evidenceChallenges}
              description="Bounded evidentiary challenges attached to identifiable governed records."
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Participant Responses"
              value={participantResponses}
              description="Attributable participant responses to findings, reviews, and challenges."
            />

            <StatCard
              label="Factual Corrections"
              value={factualCorrections}
              description="Objective correction history without renegotiating independent determinations."
            />

            <StatCard
              label="Technical Comments"
              value={technicalComments}
              description="Bounded technical commentary that remains distinct from formal findings."
            />

            <StatCard
              label="External Publications"
              value={externalPublications}
              description="Independent publications linked into the governed chronology."
            />
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                Governing Principle
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                Preserve separate voices without losing the record.
              </h2>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">
                TA-14 findings remain TA-14 findings. Participant
                reviews remain participant reviews. Independent
                reviews remain attributable to their authors.
                Challenges remain challenges. Corrections remain
                versioned corrections.
              </p>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
                The objective is not consensus. The objective is
                an inspectable governance history in which later
                interpretation cannot silently erase earlier state.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Institutional Sequence
              </div>

              <div className="mt-5 space-y-3 text-sm text-slate-200">
                {[
                  "Registered Baseline",
                  "Governed Demonstration",
                  "Admitted Evidence",
                  "TA-14 Finding",
                  "Participant Review",
                  "Participant Response",
                  "Independent Review",
                  "Evidence Challenge",
                  "Correction",
                  "Engineering Learning",
                  "New Version",
                ].map((item, index, array) => (
                  <div key={item}>
                    <div className="rounded-xl border border-white/10 bg-black/10 px-4 py-3">
                      {item}
                    </div>

                    {index !== array.length - 1 ? (
                      <div className="py-1 text-center text-slate-600">
                        ↓
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {foundingCase ? (
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
            <div className="rounded-[32px] border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[0.075] via-white/[0.035] to-violet-400/[0.04] p-7 lg:p-9">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-100">
                  Founding Reviews & Responses Case
                </span>

                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium text-slate-300">
                  TA-14-AIGR-000008
                </span>
              </div>

              <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-white">
                    Harmonic Constitutional Runtime
                  </h2>

                  <p className="mt-2 text-sm font-medium text-cyan-100">
                    FD-2026-0002 · Case 001
                  </p>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                    Authority Revoked Before Consequential
                    Execution became the first completed
                    independent external TA-14 governed
                    demonstration to generate a Participant Review
                    and linked independent External Publication.
                  </p>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                      PARTIALLY DEMONSTRATED — EVIDENCE-BOUNDED
                    </div>

                    <p className="mt-3 text-base leading-7 text-white">
                      Runtime behavior demonstrated.
                      <br />
                      Full surrounding chronology not independently
                      demonstrated.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/workspace/ai-governance/registry/public/TA-14-AIGR-000008"
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                    >
                      Permanent Registry Record →
                    </Link>

                    <Link
                      href="/workspace/ai-governance/demonstrations"
                      className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white"
                    >
                      Demonstration Records
                    </Link>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="text-2xl font-semibold text-white">
                      {normalizeCount(
                        foundingCase.participant_reviews,
                      )}
                    </div>

                    <div className="mt-1 text-sm text-slate-300">
                      Participant Review
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="text-2xl font-semibold text-white">
                      {normalizeCount(
                        foundingCase.external_publications,
                      )}
                    </div>

                    <div className="mt-1 text-sm text-slate-300">
                      External Publication
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="text-2xl font-semibold text-white">
                      {normalizeCount(
                        foundingCase.evidence_challenges,
                      )}
                    </div>

                    <div className="mt-1 text-sm text-slate-300">
                      Evidence Challenges
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="text-2xl font-semibold text-white">
                      {normalizeCount(
                        foundingCase.independent_reviews,
                      )}
                    </div>

                    <div className="mt-1 text-sm text-slate-300">
                      Independent Reviews
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="public-record"
        className="scroll-mt-24 border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                Public Record
              </div>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                Inspect the governed voices attached to the record.
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Publication here preserves authorship and
                chronology. It does not collapse participant,
                reviewer, challenger, or TA-14 authority into one
                voice.
              </p>
            </div>

            <div className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-semibold text-white">
                {records.length}
              </span>{" "}
              record{records.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {RECORD_FILTERS.map((filter) => {
              const active =
                selectedType === filter.value;

              return (
                <Link
                  key={filter.value}
                  href={buildFilterHref(filter.value)}
                  className={
                    active
                      ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                      : "rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/25 hover:text-white"
                  }
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 space-y-5">
            {records.length > 0 ? (
              records.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                />
              ))
            ) : (
              <div className="rounded-[28px] border border-dashed border-white/15 bg-white/[0.025] px-6 py-16 text-center">
                <div className="text-lg font-semibold text-white">
                  No public records in this category yet.
                </div>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  An empty category is not evidence that the
                  corresponding institutional event occurred.
                  Records appear here only when they have been
                  attributable, governed, and published.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
              Record Classes
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Different submissions carry different institutional
              meaning.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedCounts.length > 0
              ? sortedCounts.map((item) => (
                  <div
                    key={item.record_type}
                    className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-base font-semibold text-white">
                          {item.record_type_label}
                        </div>

                        <p className="mt-2 text-xs leading-5 text-slate-400">
                          {RECORD_DESCRIPTIONS[
                            item.record_type
                          ] ??
                            "Governed attributable record."}
                        </p>
                      </div>

                      <div className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-sm font-semibold text-white">
                        {normalizeCount(
                          item.record_count,
                        )}
                      </div>
                    </div>
                  </div>
                ))
              : RECORD_FILTERS.filter(
                  (item) => item.value !== "ALL",
                ).map((item) => (
                  <div
                    key={item.value}
                    className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5"
                  >
                    <div className="text-base font-semibold text-white">
                      {item.label}
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {RECORD_DESCRIPTIONS[item.value] ??
                        "Governed attributable record."}
                    </p>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {lineage.length > 0 ? (
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                Version Lineage
              </div>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                Improvement should not rewrite the architecture
                that was actually evaluated.
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
                Version lineage preserves the distinction between
                the implementation that entered review and
                subsequent engineering that emerged from evidence,
                challenge, or learning.
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {lineage.map((item) => (
                <div
                  key={`${item.registry_identifier}-${item.version}`}
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {item.registry_identifier}
                      </div>

                      <div className="mt-2 text-2xl font-semibold text-white">
                        Version {item.version}
                      </div>
                    </div>

                    <div className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs font-semibold text-slate-200">
                      {lineageLabel(
                        item.lineage_status,
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      ["Registered", item.registered],
                      ["Frozen", item.frozen],
                      ["Demonstrated", item.demonstrated],
                    ].map(([label, value]) => (
                      <div
                        key={String(label)}
                        className="rounded-xl border border-white/10 bg-black/10 p-3"
                      >
                        <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
                          {String(label)}
                        </div>

                        <div
                          className={`mt-1 text-sm font-semibold ${
                            Boolean(value)
                              ? "text-emerald-200"
                              : "text-slate-400"
                          }`}
                        >
                          {Boolean(value)
                            ? "Yes"
                            : "No"}
                        </div>
                      </div>
                    ))}
                  </div>

                  {item.parent_version ? (
                    <div className="mt-4 text-sm text-slate-400">
                      Parent lineage:{" "}
                      <span className="font-medium text-slate-200">
                        Version {item.parent_version}
                      </span>
                    </div>
                  ) : null}

                  {item.finding_summary ? (
                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Finding
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {item.finding_summary}
                      </p>
                    </div>
                  ) : null}

                  {item.notes ? (
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      {item.notes}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="submission-pathways"
        className="scroll-mt-24 border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="max-w-4xl">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
              Governed Participation
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Review the record. Challenge it. Correct it. Add
              another attributable voice.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              Reviews & Responses is not an unrestricted comment
              feed. Every substantive submission should identify
              what record it addresses, who submitted it, what
              type of contribution it represents, and what
              evidence or authority supports it.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "Review a Record",
                description:
                  "Submit an attributable participant or independent review addressing a specific governed record.",
                action: "Review",
              },
              {
                title: "Respond to a Finding",
                description:
                  "Preserve an attributable participant response without rewriting the underlying TA-14 determination.",
                action: "Respond",
              },
              {
                title: "Challenge Evidence",
                description:
                  "Identify a specific evidentiary issue, provide the basis, and attach supporting sources or artifacts.",
                action: "Challenge",
              },
              {
                title: "Request Factual Correction",
                description:
                  "Identify an objective record error such as an identifier, date, timestamp, attribution, or transcription issue.",
                action: "Correct",
              },
              {
                title: "Leave Technical Comment",
                description:
                  "Submit substantive technical analysis without automatically creating a formal review or finding.",
                action: "Comment",
              },
              {
                title: "Request Demonstration",
                description:
                  "Propose a bounded claim, route, behavior, or governance condition for future TA-14 demonstration.",
                action: "Request",
              },
              {
                title: "Request Replication",
                description:
                  "Ask whether an existing demonstration or evidence route should be repeated under comparable conditions.",
                action: "Replicate",
              },
              {
                title: "Submit External Publication",
                description:
                  "Link independently authored analysis, research, case studies, or public commentary to the governed record.",
                action: "Publish",
              },
              {
                title: "Contact TA-14",
                description:
                  "Send a structured governed message about a specific Registry entity, demonstration, artifact, finding, or review.",
                action: "Message",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex h-full flex-col rounded-[24px] border border-white/10 bg-white/[0.035] p-5"
              >
                <div className="text-lg font-semibold text-white">
                  {item.title}
                </div>

                <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>

                <div className="mt-5">
                  <span className="inline-flex rounded-full border border-white/10 bg-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                    {item.action} intake coming next
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                Governed Messaging
              </div>

              <h3 className="mt-3 text-2xl font-semibold text-white">
                Communication should enter with context.
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                A message about a Registry entity, case, finding,
                artifact, or review should remain bound to that
                record. The sender should not have to reconstruct
                identifiers already known by the Exchange.
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm leading-7 text-slate-300">
                Registry Entity
                <br />
                → Demonstration
                <br />
                → Case
                <br />
                → Record Addressed
                <br />
                → Communication Type
                <br />
                → Attributable Message
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                Evidentiary Boundary
              </div>

              <h3 className="mt-3 text-2xl font-semibold text-white">
                Receipt is not adoption.
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                A message does not become evidence merely because
                TA-14 received it. A review does not become a
                finding merely because it was published. A
                technical comment does not acquire institutional
                authority merely by appearing in the Exchange.
              </p>

              <div className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[0.045] p-4 text-sm leading-7 text-slate-300">
                Each submission retains its own record type,
                attribution, publication status, evidentiary
                status, disposition, and institutional meaning.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-7">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Institutional Boundary
            </div>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              Publication does not collapse authority.
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "TA-14 does not require participants to agree with an independent finding.",
                "Participants cannot rewrite a TA-14 finding merely because they disagree with it.",
                "Independent reviewers do not acquire TA-14 authority merely by submitting a review.",
                "Technical comments do not become findings simply because they are published.",
                "Governed messages do not become evidence merely because they are received.",
                "Favorable Participant Reviews do not become TA-14 endorsements.",
                "External publications retain independent authorship and responsibility.",
                "Later engineering must not be presented as though it existed in an earlier frozen version.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm leading-6 text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
              TA-14 Authority Governance Institution
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The objective is not one final narrative.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
              The objective is an inspectable governance history.
            </p>

            <div className="mx-auto mt-8 max-w-2xl rounded-[26px] border border-white/10 bg-white/[0.04] p-6 text-sm leading-7 text-slate-300">
              Preserve the beginning.
              <br />
              Preserve the evidence.
              <br />
              Preserve the finding.
              <br />
              Preserve the response.
              <br />
              Preserve the challenge.
              <br />
              Preserve the correction.
              <br />
              Preserve what changed next.
            </div>

            <div className="mt-8 text-lg font-semibold text-white">
              No admissible evidence. No admissible execution.
            </div>

            <div className="mt-6">
              <Link
                href="/workspace/ai-governance"
                className="text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
              >
                Return to AI Governance Home →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
