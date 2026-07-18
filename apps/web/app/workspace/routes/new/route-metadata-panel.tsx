"use client";

import type { CSSProperties } from "react";
import type { TransferRouteDraft } from "../../../../lib/route-draft-transfer";

type RouteMetadataPanelProps = {
  draft: TransferRouteDraft;
};

export function RouteMetadataPanel({
  draft,
}: RouteMetadataPanelProps) {
  const completedStages =
    draft.readiness.completedStages;

  const totalStages =
    draft.readiness.totalStages;

  const completionPercent =
    totalStages > 0
      ? Math.round(
          (completedStages / totalStages) * 100,
        )
      : 0;

  return (
    <aside
      aria-label="Route metadata"
      style={styles.panel}
    >
      <div style={styles.header}>
        <div>
          <span style={styles.eyebrow}>
            ROUTE METADATA
          </span>

          <h3 style={styles.title}>
            Transferred route record
          </h3>
        </div>

        <span style={styles.statusBadge}>
          {draft.status}
        </span>
      </div>

      <div style={styles.metadataList}>
        <MetadataRow
          label="Route"
          value={draft.metadata.name}
        />

        <MetadataRow
          label="Domain"
          value={draft.metadata.domain}
        />

        <MetadataRow
          label="Owner"
          value={draft.metadata.owner}
        />

        <MetadataRow
          label="State"
          value={draft.status}
        />

        <MetadataRow
          label="Schema"
          value={draft.schema}
          monospace
        />

        <MetadataRow
          label="Draft ID"
          value={draft.routeId}
          monospace
        />

        <MetadataRow
          label="Version"
          value={String(draft.metadata.version)}
        />

        <MetadataRow
          label="Stages"
          value={`${completedStages}/${totalStages}`}
        />
      </div>

      <div style={styles.completionSection}>
        <div style={styles.completionHeader}>
          <span style={styles.completionLabel}>
            DECLARATION COMPLETION
          </span>

          <strong style={styles.completionValue}>
            {completionPercent}%
          </strong>
        </div>

        <div
          role="progressbar"
          aria-label="Route declaration completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={completionPercent}
          style={styles.progressTrack}
        >
          <div
            style={{
              ...styles.progressFill,
              width: `${completionPercent}%`,
            }}
          />
        </div>

        <p style={styles.completionText}>
          {completedStages} of {totalStages} canonical
          route stages contain transferred declarations.
        </p>
      </div>

      <div style={styles.boundary}>
        <strong style={styles.boundaryTitle}>
          Metadata boundary
        </strong>

        <p style={styles.boundaryText}>
          These values describe the transferred builder
          draft. They do not independently prove evidence
          integrity, authority, admissibility, execution,
          or outcome correspondence.
        </p>
      </div>
    </aside>
  );
}

function MetadataRow({
  label,
  value,
  monospace = false,
}: {
  label: string;
  value: string;
  monospace?: boolean;
}) {
  return (
    <div style={styles.metadataRow}>
      <span style={styles.metadataLabel}>
        {label}
      </span>

      <span
        title={value}
        style={{
          ...styles.metadataValue,
          ...(monospace
            ? styles.metadataValueMonospace
            : {}),
        }}
      >
        {value}
      </span>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  panel: {
    display: "grid",
    alignContent: "start",
    gap: 20,
    padding: 22,
    border: "1px solid #d9dde4",
    borderRadius: 15,
    background: "#ffffff",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    paddingBottom: 18,
    borderBottom: "1px solid #e5e7eb",
  },
  eyebrow: {
    display: "block",
    marginBottom: 7,
    color: "#067a58",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.12em",
  },
  title: {
    margin: 0,
    color: "#172033",
    fontSize: 17,
    lineHeight: 1.3,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 150,
    padding: "7px 10px",
    border: "1px solid #a9dbc9",
    borderRadius: 999,
    background: "#eaf8f2",
    color: "#075f47",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.08em",
    textAlign: "center",
    overflowWrap: "anywhere",
  },
  metadataList: {
    display: "grid",
  },
  metadataRow: {
    display: "grid",
    gridTemplateColumns: "88px minmax(0, 1fr)",
    gap: 12,
    alignItems: "start",
    padding: "11px 0",
    borderBottom: "1px solid #edf0f3",
  },
  metadataLabel: {
    color: "#7a8493",
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  metadataValue: {
    minWidth: 0,
    color: "#263140",
    fontSize: 12,
    fontWeight: 800,
    lineHeight: 1.45,
    textAlign: "right",
    overflowWrap: "anywhere",
  },
  metadataValueMonospace: {
    fontFamily:
      '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
    fontSize: 11,
  },
  completionSection: {
    padding: 16,
    border: "1px solid #dceee7",
    borderRadius: 12,
    background: "#f5fbf8",
  },
  completionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  completionLabel: {
    color: "#526171",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.09em",
  },
  completionValue: {
    color: "#067a58",
    fontSize: 14,
  },
  progressTrack: {
    height: 8,
    marginTop: 12,
    overflow: "hidden",
    borderRadius: 999,
    background: "#dfe8e4",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background:
      "linear-gradient(90deg, #07805d, #13a678)",
    transition: "width 200ms ease",
  },
  completionText: {
    margin: "10px 0 0",
    color: "#657180",
    fontSize: 11,
    lineHeight: 1.55,
  },
  boundary: {
    padding: 15,
    border: "1px solid #e1e5ea",
    borderRadius: 12,
    background: "#f7f8fa",
  },
  boundaryTitle: {
    display: "block",
    marginBottom: 7,
    color: "#263140",
    fontSize: 11,
  },
  boundaryText: {
    margin: 0,
    color: "#687383",
    fontSize: 11,
    lineHeight: 1.6,
  },
};
