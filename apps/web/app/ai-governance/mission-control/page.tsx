/**
 * TA-14 Authority Governance Institution
 * MCP-001 — Mission Control Page Integration
 *
 * REPLACE:
 *   apps/web/app/ai-governance/mission-control/page.tsx
 *
 * Purpose:
 *   Connect the verified Institutional Engine, Mission Control live resolver,
 *   snapshot resolver, integration adapter, and dashboard component into the
 *   visible Mission Control route.
 *
 * Integration note:
 *   This page uses the repository factory exported by
 *   `mission-control-repository.ts` when present. Until the production
 *   repository adapter is connected, it falls back to an empty governed
 *   snapshot rather than inventing institutional records.
 */

import type { Metadata } from "next";
import { createClient } from "../../../lib/supabase/server";

import MissionControlDashboard from "../../../components/academy/mission-control-dashboard";

import {
  buildMissionControlViewModel,
  createEmptyMissionControlSnapshot,
} from "../../../lib/academy/mission-control-integration";

import {
  MissionControlLiveResolver,
  type MissionControlLiveIdentity,
  type MissionControlLiveRepository,
} from "../../../lib/academy/mission-control-live-resolver";

import type {
  MissionControlSnapshotRequest,
} from "../../../lib/academy/mission-control-snapshot";

/* ========================================================================== *
 * Metadata
 * ========================================================================== */

export const metadata: Metadata = {
  title:
    "Institutional Mission Control | TA-14 Authority Governance Institution",
  description:
    "See active institutional work, required actions, registered entities, reviews, artifacts, credentials, execution state, outcomes, continuity, and institutional history in one governed operating view.",
};

/* ========================================================================== *
 * Page configuration
 * ========================================================================== */

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MISSION_CONTROL_PAGE_ID =
  "TA14-MISSION-CONTROL-PAGE-000001" as const;

const FALLBACK_SUBJECT_ID =
  "TA14-SUBJECT-UNRESOLVED" as const;

/* ========================================================================== *
 * Page
 * ========================================================================== */

export default async function MissionControlPage() {
  const generatedAt = new Date().toISOString();

  const identity =
    await resolveMissionControlIdentity();

  const repository =
    await resolveMissionControlRepository();

  const request:
    MissionControlSnapshotRequest = {
      subjectId:
        identity?.subjectId ??
        FALLBACK_SUBJECT_ID,
      organizationId:
        identity?.organizationId,
      governanceEntityId:
        identity?.governanceEntityId,
      generatedAt,
      snapshotId:
        `${MISSION_CONTROL_PAGE_ID}-${generatedAt.replace(/[^0-9]/g, "").slice(0, 17)}`,
  };

  const result =
    repository && identity
      ? await resolveLiveMissionControl(
          repository,
          request,
        )
      : null;

  const snapshot =
    result?.resolution.snapshot ??
    createEmptyMissionControlSnapshot({
      snapshotId: request.snapshotId!,
      subjectId: request.subjectId,
      organizationId:
        request.organizationId,
      governanceEntityId:
        request.governanceEntityId,
      generatedAt,
    });

  const viewModel =
    buildMissionControlViewModel(snapshot);

  return (
    <main className="min-h-screen bg-[#02030a] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[100rem]">
        <MissionControlPageShell
          identity={identity}
          repositoryConnected={Boolean(repository)}
          resolutionComplete={
            result?.resolution.complete ?? false
          }
          errors={
            result?.resolution.errors ?? []
          }
          warnings={
            result?.resolution.warnings ?? []
          }
        />

        <MissionControlDashboard
          viewModel={viewModel}
          title="TA-14 Institutional Mission Control"
          subtitle="Identity. Action. Records. Continuity."
          showStageRail
          showBoundaryNotice
        />
      </div>
    </main>
  );
}

/* ========================================================================== *
 * Live resolution
 * ========================================================================== */

async function resolveLiveMissionControl(
  repository: MissionControlLiveRepository,
  request: MissionControlSnapshotRequest,
) {
  try {
    const resolver =
      new MissionControlLiveResolver({
        repository,
        requireActiveIdentity: true,
      });

    return await resolver.resolve(request);
  } catch (error) {
    console.error(
      "TA-14 Mission Control live resolution failed.",
      error,
    );

    return null;
  }
}

/* ========================================================================== *
 * Identity resolution
 * ========================================================================== */

/**
 * Resolve Mission Control identity from the authenticated Supabase session.
 * Server environment variables must never select the visible user identity.
 */
async function resolveMissionControlIdentity():
Promise<MissionControlLiveIdentity | null> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const [{ data: profile }, { data: registeredEntity }] = await Promise.all([
    supabase
      .from("exchange_profiles")
      .select("display_name,organization_name,status")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("ai_governance_registry_submissions")
      .select("registry_identifier")
      .eq("owner_user_id", user.id)
      .eq("status", "registered")
      .not("registry_identifier", "is", null)
      .order("accepted_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return Object.freeze({
    subjectId: user.id,
    email: user.email || undefined,
    displayName:
      profile?.display_name?.trim() ||
      (typeof user.user_metadata?.display_name === "string"
        ? user.user_metadata.display_name.trim()
        : undefined) ||
      user.email ||
      undefined,
    organizationId: profile?.organization_name?.trim() || undefined,
    governanceEntityId: registeredEntity?.registry_identifier || undefined,
    active: profile?.status ? profile.status === "active" : true,
  });
}

/* ========================================================================== *
 * Repository resolution
 * ========================================================================== */

/**
 * The page remains compile-safe before a production repository adapter exists.
 *
 * When `apps/web/lib/academy/mission-control-repository.ts` is added, export:
 *
 *   createMissionControlLiveRepository()
 *
 * and replace the body below with a static import.
 *
 * A static import should be used after the repository adapter exists because
 * Next.js bundling cannot reliably discover arbitrary runtime module paths.
 */
async function resolveMissionControlRepository():
Promise<MissionControlLiveRepository | null> {
  return null;
}

/* ========================================================================== *
 * Page shell
 * ========================================================================== */

function MissionControlPageShell({
  identity,
  repositoryConnected,
  resolutionComplete,
  errors,
  warnings,
}: {
  readonly identity:
    MissionControlLiveIdentity | null;
  readonly repositoryConnected: boolean;
  readonly resolutionComplete: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}) {
  const mode =
    repositoryConnected &&
    identity &&
    resolutionComplete
      ? "Live institutional mode"
      : identity
        ? "Identity resolved — repository pending"
        : "Governed empty state";

  return (
    <section className="mb-5 rounded-[1.5rem] border border-white/10 bg-white/[0.035] px-5 py-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
            Mission Control status
          </p>

          <h1 className="mt-1 text-lg font-semibold text-white">
            {mode}
          </h1>

          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
            {repositoryConnected
              ? "The dashboard is connected to the institutional record resolver."
              : "The verified dashboard is active. No institutional records are invented while the production repository adapter remains unconnected."}
          </p>
        </div>

        <div className="grid min-w-[18rem] grid-cols-2 gap-3">
          <ShellStatus
            label="Identity"
            value={
              identity?.displayName ??
              identity?.email ??
              identity?.subjectId ??
              "Unresolved"
            }
            ready={Boolean(identity)}
          />

          <ShellStatus
            label="Repository"
            value={
              repositoryConnected
                ? "Connected"
                : "Pending"
            }
            ready={repositoryConnected}
          />
        </div>
      </div>

      {errors.length > 0 ? (
        <MessageList
          title="Resolution errors"
          messages={errors}
          tone="error"
        />
      ) : null}

      {warnings.length > 0 ? (
        <MessageList
          title="Resolution warnings"
          messages={warnings}
          tone="warning"
        />
      ) : null}
    </section>
  );
}

function ShellStatus({
  label,
  value,
  ready,
}: {
  readonly label: string;
  readonly value: string;
  readonly ready: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border px-4 py-3",
        ready
          ? "border-emerald-300/20 bg-emerald-400/[0.06]"
          : "border-amber-300/20 bg-amber-400/[0.06]",
      ].join(" ")}
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function MessageList({
  title,
  messages,
  tone,
}: {
  readonly title: string;
  readonly messages: readonly string[];
  readonly tone: "warning" | "error";
}) {
  return (
    <aside
      className={[
        "mt-4 rounded-2xl border px-4 py-3",
        tone === "error"
          ? "border-rose-300/20 bg-rose-400/[0.06]"
          : "border-amber-300/20 bg-amber-400/[0.06]",
      ].join(" ")}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>

      <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-300">
        {messages.map((message) => (
          <li key={message}>
            {message}
          </li>
        ))}
      </ul>
    </aside>
  );
}
