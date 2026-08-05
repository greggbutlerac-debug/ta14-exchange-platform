"use client";

/**
 * TA-14 Authority Governance Institution
 * MCD-001 — Mission Control Dashboard Component
 *
 * CREATE:
 *   apps/web/components/academy/mission-control-dashboard.tsx
 *
 * Purpose:
 *   Render a MissionControlViewModel produced by the verified Academy
 *   Mission Control integration layer.
 *
 * Boundary:
 *   This component presents institutional state and navigation.
 *   It does not create or mutate institutional records or effects.
 */

import Link from "next/link";
import type {
  MissionControlAction,
  MissionControlAlert,
  MissionControlCard,
  MissionControlMetric,
  MissionControlSection,
  MissionControlStageRailItem,
  MissionControlTone,
  MissionControlViewModel,
} from "../../lib/academy/mission-control-integration";

export interface MissionControlDashboardProps {
  readonly viewModel: MissionControlViewModel;
  readonly title?: string;
  readonly subtitle?: string;
  readonly showStageRail?: boolean;
  readonly showBoundaryNotice?: boolean;
  readonly compact?: boolean;
}

export function MissionControlDashboard({
  viewModel,
  title = "TA-14 Institutional Mission Control",
  subtitle =
    "Identity. Action. Records. Continuity.",
  showStageRail = true,
  showBoundaryNotice = true,
  compact = false,
}: MissionControlDashboardProps) {
  return (
    <section
      aria-labelledby="ta14-mission-control-title"
      className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 shadow-2xl shadow-black/40 sm:p-7 lg:p-9"
    >
      <CosmicBackdrop />

      <div className="relative z-10">
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          viewModel={viewModel}
          compact={compact}
        />

        {viewModel.alerts.length > 0 ? (
          <AlertStrip alerts={viewModel.alerts} />
        ) : null}

        <MetricsGrid
          metrics={viewModel.metrics}
          compact={compact}
        />

        {showStageRail ? (
          <StageRail
            items={viewModel.stageRail}
            compact={compact}
          />
        ) : null}

        <DashboardSections
          sections={viewModel.sections}
          compact={compact}
        />

        {showBoundaryNotice ? (
          <BoundaryNotice boundary={viewModel.boundary} />
        ) : null}
      </div>
    </section>
  );
}

function DashboardHeader({
  title,
  subtitle,
  viewModel,
  compact,
}: {
  readonly title: string;
  readonly subtitle: string;
  readonly viewModel: MissionControlViewModel;
  readonly compact: boolean;
}) {
  return (
    <header
      className={
        compact
          ? "mb-6"
          : "mb-8 lg:mb-10"
      }
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">
            TA-14 Authority Governance Institution
          </p>

          <h1
            id="ta14-mission-control-title"
            className={
              compact
                ? "text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                : "text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
            }
          >
            {title}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            {subtitle}
          </p>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            See current institutional position, required
            actions, active work, Registry status,
            execution state, outcomes, continuity, and
            revalidation in one governed operating view.
          </p>
        </div>

        <div className="grid min-w-[15rem] grid-cols-2 gap-3">
          <StatusPill
            label="Current"
            value={
              viewModel.summary.currentStage?.title ??
              "Not started"
            }
            tone={
              viewModel.hasCriticalAction
                ? "critical"
                : viewModel.hasUrgentAction
                  ? "warning"
                  : "attention"
            }
          />

          <StatusPill
            label="Next"
            value={
              viewModel.summary.nextStage?.title ??
              "No next stage"
            }
            tone="positive"
          />
        </div>
      </div>
    </header>
  );
}

function StatusPill({
  label,
  value,
  tone,
}: {
  readonly label: string;
  readonly value: string;
  readonly tone: MissionControlTone;
}) {
  return (
    <div
      className={[
        "rounded-2xl border px-4 py-3 backdrop-blur-xl",
        toneClasses(tone).surface,
      ].join(" ")}
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 line-clamp-2 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function AlertStrip({
  alerts,
}: {
  readonly alerts: readonly MissionControlAlert[];
}) {
  return (
    <div className="mb-7 space-y-3">
      {alerts.slice(0, 4).map((alert) => (
        <article
          key={alert.id}
          className={[
            "flex flex-col gap-4 rounded-2xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
            alertToneClasses(alert.severity),
          ].join(" ")}
        >
          <div>
            <p className="text-sm font-semibold text-white">
              {alert.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              {alert.description}
            </p>
          </div>

          {alert.action ? (
            <ActionLink
              action={alert.action}
              compact
            />
          ) : null}
        </article>
      ))}
    </div>
  );
}

function MetricsGrid({
  metrics,
  compact,
}: {
  readonly metrics: readonly MissionControlMetric[];
  readonly compact: boolean;
}) {
  return (
    <div
      className={[
        "grid gap-3",
        compact
          ? "grid-cols-2 lg:grid-cols-5"
          : "grid-cols-2 md:grid-cols-3 xl:grid-cols-5",
      ].join(" ")}
    >
      {metrics.map((metric) => (
        <MetricCard
          key={metric.id}
          metric={metric}
        />
      ))}
    </div>
  );
}

function MetricCard({
  metric,
}: {
  readonly metric: MissionControlMetric;
}) {
  const classes = toneClasses(metric.tone);

  return (
    <article
      className={[
        "relative overflow-hidden rounded-2xl border p-4 backdrop-blur-xl",
        classes.surface,
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "absolute inset-x-0 top-0 h-px opacity-80",
          classes.line,
        ].join(" ")}
      />

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {metric.label}
      </p>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {metric.value}
      </p>

      {metric.detail ? (
        <p className="mt-2 text-xs leading-5 text-slate-400">
          {metric.detail}
        </p>
      ) : null}
    </article>
  );
}

function StageRail({
  items,
  compact,
}: {
  readonly items: readonly MissionControlStageRailItem[];
  readonly compact: boolean;
}) {
  return (
    <section
      aria-labelledby="ta14-stage-rail-title"
      className={
        compact
          ? "mt-6"
          : "mt-8 lg:mt-10"
      }
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
            Institutional lifecycle
          </p>
          <h2
            id="ta14-stage-rail-title"
            className="mt-1 text-lg font-semibold text-white"
          >
            Governed stage progression
          </h2>
        </div>

        <p className="hidden text-xs text-slate-500 sm:block">
          Completed stages remain preserved.
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <ol className="flex min-w-max items-stretch gap-3">
          {items.map((item) => (
            <StageRailCard
              key={item.stageId}
              item={item}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function StageRailCard({
  item,
}: {
  readonly item: MissionControlStageRailItem;
}) {
  const content = (
    <div
      className={[
        "relative flex h-full w-[12rem] flex-col rounded-2xl border p-4 transition duration-300",
        item.current
          ? "border-cyan-300/70 bg-cyan-400/10 shadow-lg shadow-cyan-950/30"
          : item.next
            ? "border-violet-300/50 bg-violet-400/10"
            : toneClasses(item.tone).surface,
        item.href
          ? "hover:-translate-y-0.5 hover:border-white/30"
          : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500">
          {String(item.order).padStart(2, "0")}
        </span>

        {item.current ? (
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-cyan-200">
            Current
          </span>
        ) : item.next ? (
          <span className="rounded-full border border-violet-300/30 bg-violet-300/10 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-violet-200">
            Next
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-sm font-semibold text-white">
        {item.shortTitle}
      </p>

      <p className="mt-auto pt-4 text-xs capitalize text-slate-400">
        {item.status.replaceAll("_", " ")}
      </p>
    </div>
  );

  return (
    <li>
      {item.href ? (
        <Link
          href={item.href}
          aria-label={`Open ${item.title}`}
          className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}

function DashboardSections({
  sections,
  compact,
}: {
  readonly sections: readonly MissionControlSection[];
  readonly compact: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "mt-7 space-y-7"
          : "mt-9 space-y-9 lg:mt-12"
      }
    >
      {sections.map((section) => (
        <DashboardSection
          key={section.id}
          section={section}
        />
      ))}
    </div>
  );
}

function DashboardSection({
  section,
}: {
  readonly section: MissionControlSection;
}) {
  return (
    <section
      aria-labelledby={`mission-control-section-${section.id}`}
    >
      <div className="mb-4">
        <h2
          id={`mission-control-section-${section.id}`}
          className="text-xl font-semibold tracking-tight text-white"
        >
          {section.title}
        </h2>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
          {section.description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {section.cards.map((card) => (
          <DashboardCard
            key={card.id}
            card={card}
          />
        ))}
      </div>
    </section>
  );
}

function DashboardCard({
  card,
}: {
  readonly card: MissionControlCard;
}) {
  const classes = toneClasses(card.tone);

  return (
    <article
      className={[
        "group relative flex min-h-[14rem] flex-col overflow-hidden rounded-3xl border p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5",
        classes.surface,
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "absolute inset-x-0 top-0 h-px opacity-90",
          classes.line,
        ].join(" ")}
      />

      {card.eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {card.eyebrow}
        </p>
      ) : null}

      <h3 className="mt-2 text-lg font-semibold text-white">
        {card.title}
      </h3>

      {card.value !== undefined ? (
        <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
          {card.value}
        </p>
      ) : null}

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {card.description}
      </p>

      {card.action ? (
        <div className="mt-auto pt-6">
          <ActionLink action={card.action} />
        </div>
      ) : null}
    </article>
  );
}

function ActionLink({
  action,
  compact = false,
}: {
  readonly action: MissionControlAction;
  readonly compact?: boolean;
}) {
  const label = action.href ? (
    <Link
      href={action.href}
      className={[
        "inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 font-semibold text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
        compact
          ? "px-4 py-2 text-xs"
          : "px-5 py-2.5 text-sm",
      ].join(" ")}
    >
      {action.label}
      <span
        aria-hidden="true"
        className="ml-2 transition-transform group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  ) : (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 font-semibold text-slate-300",
        compact
          ? "px-4 py-2 text-xs"
          : "px-5 py-2.5 text-sm",
      ].join(" ")}
    >
      {action.label}
    </span>
  );

  return label;
}

function BoundaryNotice({
  boundary,
}: {
  readonly boundary: string;
}) {
  return (
    <aside className="mt-9 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        Institutional boundary
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        {boundary}
      </p>
    </aside>
  );
}

function CosmicBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -right-24 top-48 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.45)_0,rgba(255,255,255,0.45)_1px,transparent_1.5px)] [background-size:42px_42px]" />

      <div className="absolute left-[12%] top-[14%] h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" />
      <div className="absolute left-[72%] top-[10%] h-1 w-1 animate-pulse rounded-full bg-cyan-200/80 [animation-delay:700ms]" />
      <div className="absolute left-[82%] top-[64%] h-1.5 w-1.5 animate-pulse rounded-full bg-violet-200/70 [animation-delay:1200ms]" />
      <div className="absolute left-[22%] top-[78%] h-1 w-1 animate-pulse rounded-full bg-blue-200/70 [animation-delay:400ms]" />
    </div>
  );
}

function toneClasses(
  tone: MissionControlTone,
): {
  readonly surface: string;
  readonly line: string;
} {
  switch (tone) {
    case "positive":
      return {
        surface:
          "border-emerald-300/15 bg-emerald-400/[0.055]",
        line:
          "bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent",
      };

    case "attention":
      return {
        surface:
          "border-cyan-300/15 bg-cyan-400/[0.055]",
        line:
          "bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent",
      };

    case "warning":
      return {
        surface:
          "border-amber-300/20 bg-amber-400/[0.06]",
        line:
          "bg-gradient-to-r from-transparent via-amber-300/75 to-transparent",
      };

    case "critical":
      return {
        surface:
          "border-rose-300/20 bg-rose-400/[0.065]",
        line:
          "bg-gradient-to-r from-transparent via-rose-300/80 to-transparent",
      };

    default:
      return {
        surface:
          "border-white/10 bg-white/[0.035]",
        line:
          "bg-gradient-to-r from-transparent via-white/40 to-transparent",
      };
  }
}

function alertToneClasses(
  severity: MissionControlAlert["severity"],
): string {
  switch (severity) {
    case "critical":
      return "border-rose-300/25 bg-rose-400/[0.08]";
    case "urgent":
      return "border-amber-300/25 bg-amber-400/[0.08]";
    case "important":
      return "border-cyan-300/20 bg-cyan-400/[0.07]";
    default:
      return "border-white/10 bg-white/[0.04]";
  }
}

export default MissionControlDashboard;
