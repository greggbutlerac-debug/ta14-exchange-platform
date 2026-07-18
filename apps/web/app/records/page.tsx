"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type RequirementResult = "SATISFIED" | "HOLD" | "DENY" | "ESCALATE";

type EvidenceBinding = {
  evidenceId: string;
  claim: string;
  hash: string;
  observedAt: string;
};

type Authority = {
  authorityId?: string;
  authorityType?: string;
  actorId?: string;
  validFrom?: string;
  validUntil?: string;
  [key: string]: unknown;
};

type RequirementCheck = {
  requirementId: string;
  requirementVersion: string;
  result: RequirementResult;
  reason: string;
  evidenceIds: string[];
};

type SignedReceipt = {
  receiptId: string;
  routeId: string;
  routeVersion: number;
  requirementLibraryVersion: string;
  policyVersion: string;
  inputManifestHash: string;
  evaluatedAt: string;
  decisionFingerprint: string;
  scopeState: string;
  decision: Decision;
  results: RequirementCheck[];
  nextAction: string;
  signingKeyId: string;
  signature: string;
};

type RouteInput = {
  routeId: string;
  routeVersion: number;
  organizationId: string;
  systemId: string;
  actorId: string;
  policyVersion: string;
  amountUsd: number;
  supplierId: string;
  invoiceId: string;
  beneficiaryId: string;
  beneficiaryVerified: boolean;
  committedPaymentHash: string;
  executionPaymentHash: string;
  duplicatePaymentDetected: boolean;
  bypassSucceeded: boolean;
  replayAuthorizationUsed: boolean;
  outcomeAttributionResolved: boolean;
  authorities: Authority[];
  evidenceBindings: EvidenceBinding[];
  evaluatedAt: string;
};

type StoredRouteVersion = {
  rid: string;
  organizationName: string;
  systemName: string;
  version: number;
  input: RouteInput;
  receipt: SignedReceipt;
  createdAt: string;
};

type RouteEvent = {
  eventId: string;
  rid: string;
  type: "ROUTE_CREATED" | "ROUTE_CORRECTED" | "AER_ISSUED";
  at: string;
  version: number;
  details?: Record<string, unknown>;
  prevEventHash: string | null;
  eventHash: string;
};

type RegistryRecord = {
  status?: string;
  issuedAt?: string;
  limitations?: string[];
  aer?: Record<string, unknown>;
};

type RouteRecordResponse = {
  rid: string;
  latest: StoredRouteVersion;
  versions: StoredRouteVersion[];
  events: RouteEvent[];
  eventChainValid: boolean;
  registry: RegistryRecord | null;
};

type ApiError = {
  error?: string;
  rid?: string;
};

const chainStages = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

const decisionTheme: Record<
  Decision,
  {
    background: string;
    border: string;
    foreground: string;
  }
> = {
  ALLOW: {
    background: "#dcfce7",
    border: "#86efac",
    foreground: "#166534",
  },
  HOLD: {
    background: "#fef3c7",
    border: "#f5d167",
    foreground: "#92400e",
  },
  DENY: {
    background: "#fee2e2",
    border: "#fca5a5",
    foreground: "#991b1b",
  },
  ESCALATE: {
    background: "#ede9fe",
    border: "#c4b5fd",
    foreground: "#5b21b6",
  },
};

export default function RecordsPage() {
  const searchParams = useSearchParams();
  const initialRid = searchParams.get("rid")?.trim().toUpperCase() ?? "";

  const [ridInput, setRidInput] = useState(initialRid);
  const [record, setRecord] = useState<RouteRecordResponse | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [loading, setLoading] = useState(Boolean(initialRid));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialRid) {
      return;
    }

    void loadRoute(initialRid);
  }, [initialRid]);

  async function loadRoute(requestedRid: string) {
    const normalizedRid = requestedRid.trim().toUpperCase();

    if (!normalizedRid) {
      setError("Enter a route identity.");
      setRecord(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/routes/${encodeURIComponent(normalizedRid)}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const payload = (await response.json()) as
        | RouteRecordResponse
        | ApiError;

      if (!response.ok) {
        const failure = payload as ApiError;

        throw new Error(
          failure.error ?? "The route record could not be retrieved.",
        );
      }

      const loadedRecord = payload as RouteRecordResponse;

      setRecord(loadedRecord);
      setSelectedVersion(loadedRecord.latest.version);
      setRidInput(loadedRecord.rid);

      const nextUrl = `/records?rid=${encodeURIComponent(
        loadedRecord.rid,
      )}`;

      window.history.replaceState({}, "", nextUrl);
    } catch (routeError) {
      setRecord(null);
      setSelectedVersion(null);
      setError(
        routeError instanceof Error
          ? routeError.message
          : "An unknown retrieval error occurred.",
      );
    } finally {
      setLoading(false);
    }
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadRoute(ridInput);
  }

  const activeVersion = useMemo(() => {
    if (!record) {
      return null;
    }

    return (
      record.versions.find(
        (version) => version.version === selectedVersion,
      ) ?? record.latest
    );
  }, [record, selectedVersion]);

  const requirementCounts = useMemo(() => {
    const checks = activeVersion?.receipt.results ?? [];

    return {
      total: checks.length,
      satisfied: checks.filter(
        (check) => check.result === "SATISFIED",
      ).length,
      hold: checks.filter((check) => check.result === "HOLD").length,
      deny: checks.filter((check) => check.result === "DENY").length,
      escalate: checks.filter(
        (check) => check.result === "ESCALATE",
      ).length,
    };
  }, [activeVersion]);

  const integrityPercentage =
    requirementCounts.total === 0
      ? 0
      : Math.round(
          (requirementCounts.satisfied / requirementCounts.total) *
            100,
        );

  const decision = activeVersion?.receipt.decision ?? "HOLD";
  const theme = decisionTheme[decision];

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.brand}>
          <span style={styles.brandMark}>14</span>

          <span>
            <strong style={styles.brandTitle}>
              TA-14 RECORD EXCHANGE
            </strong>

            <span style={styles.brandSubtitle}>
              Preserved Route Inspection
            </span>
          </span>
        </Link>

        <nav style={styles.navigation}>
          <Link href="/architecture" style={styles.navLink}>
            Architecture
          </Link>

          <Link href="/workspace" style={styles.navLink}>
            Workspace
          </Link>

          <Link href="/records" style={styles.activeNavLink}>
            Records
          </Link>

          <Link href="/exchange" style={styles.navLink}>
            Exchange
          </Link>
        </nav>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroCopy}>
          <span style={styles.eyebrow}>
            PRESERVED EXECUTION EVIDENCE
          </span>

          <h1 style={styles.heroTitle}>
            Inspect the route,
            <br />
            not the dashboard.
          </h1>

          <p style={styles.heroText}>
            Retrieve a route by its persistent RID and inspect its
            declarations, evidence bindings, governing requirements,
            signed decision receipt, version history, and immutable
            event-chain continuity.
          </p>
        </div>

        <form onSubmit={submitSearch} style={styles.searchCard}>
          <span style={styles.sectionLabel}>ROUTE RETRIEVAL</span>

          <label style={styles.searchLabel} htmlFor="rid-search">
            Enter a TA-14 route identity
          </label>

          <input
            id="rid-search"
            value={ridInput}
            onChange={(event) =>
              setRidInput(event.target.value.toUpperCase())
            }
            placeholder="TA14-RID-XXXXXXXX"
            style={styles.searchInput}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.searchButton,
              opacity: loading ? 0.65 : 1,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Retrieving route..." : "Inspect Preserved Route"}
          </button>

          <p style={styles.searchHelp}>
            Retrieval reads the production route record directly. It
            does not depend on a static demonstration catalog.
          </p>
        </form>
      </section>

      {!record && !loading && !error && (
        <section style={styles.emptyState}>
          <span style={styles.emptyIcon}>RID</span>

          <h2 style={styles.emptyTitle}>
            Enter a preserved route identity.
          </h2>

          <p style={styles.emptyText}>
            Create a route in the workspace or paste an existing RID
            above to inspect its complete production record.
          </p>

          <Link
            href="/workspace/routes/new"
            style={styles.primaryLink}
          >
            Create a New Route
          </Link>
        </section>
      )}

      {loading && (
        <section style={styles.emptyState}>
          <span style={styles.loadingDot} />

          <h2 style={styles.emptyTitle}>
            Retrieving the preserved route.
          </h2>

          <p style={styles.emptyText}>
            Loading route versions, receipt checks, evidence bindings,
            and event-chain records.
          </p>
        </section>
      )}

      {error && !loading && (
        <section style={styles.errorState}>
          <span style={styles.sectionLabel}>RETRIEVAL FAILURE</span>

          <h2 style={styles.errorTitle}>
            The route could not be opened.
          </h2>

          <p style={styles.errorMessage}>{error}</p>

          <p style={styles.errorHelp}>
            Confirm the RID and try again. A missing route is not
            replaced with demonstration data.
          </p>
        </section>
      )}

      {record && activeVersion && !loading && (
        <>
          <section style={styles.identityBand}>
            <div>
              <span style={styles.sectionLabel}>ROUTE IDENTITY</span>

              <code style={styles.rid}>{record.rid}</code>

              <p style={styles.identityDescription}>
                {activeVersion.organizationName} ·{" "}
                {activeVersion.systemName}
              </p>
            </div>

            <div style={styles.identityStatus}>
              <span
                style={{
                  ...styles.decisionBadge,
                  background: theme.background,
                  borderColor: theme.border,
                  color: theme.foreground,
                }}
              >
                {decision}
              </span>

              <span
                style={{
                  ...styles.chainBadge,
                  background: record.eventChainValid
                    ? "#dcfce7"
                    : "#fee2e2",
                  color: record.eventChainValid
                    ? "#166534"
                    : "#991b1b",
                }}
              >
                EVENT CHAIN{" "}
                {record.eventChainValid ? "VALID" : "INVALID"}
              </span>
            </div>
          </section>

          <section style={styles.metricsGrid}>
            <Metric
              label="Integrity"
              value={`${integrityPercentage}%`}
              detail={`${requirementCounts.satisfied}/${requirementCounts.total} requirements satisfied`}
            />

            <Metric
              label="Route version"
              value={String(activeVersion.version)}
              detail={`${record.versions.length} preserved version${
                record.versions.length === 1 ? "" : "s"
              }`}
            />

            <Metric
              label="Evidence bindings"
              value={String(
                activeVersion.input.evidenceBindings.length,
              )}
              detail="Hash-bound declarations and fixtures"
            />

            <Metric
              label="Event records"
              value={String(record.events.length)}
              detail={
                record.eventChainValid
                  ? "Continuity verified"
                  : "Continuity failure detected"
              }
            />
          </section>

          <section style={styles.contentGrid}>
            <div style={styles.mainColumn}>
              <section style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.sectionLabel}>
                      SIGNED DECISION RECEIPT
                    </span>

                    <h2 style={styles.cardTitle}>
                      Governing requirement results
                    </h2>
                  </div>

                  <span
                    style={{
                      ...styles.decisionBadge,
                      background: theme.background,
                      borderColor: theme.border,
                      color: theme.foreground,
                    }}
                  >
                    {decision}
                  </span>
                </div>

                <p style={styles.summaryText}>
                  {activeVersion.receipt.nextAction}
                </p>

                <div style={styles.requirementList}>
                  {activeVersion.receipt.results.map((check) => (
                    <RequirementRow
                      key={check.requirementId}
                      check={check}
                    />
                  ))}
                </div>
              </section>

              <section style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.sectionLabel}>
                      EVIDENCE MANIFEST
                    </span>

                    <h2 style={styles.cardTitle}>
                      Preserved evidence bindings
                    </h2>
                  </div>

                  <span style={styles.countBadge}>
                    {activeVersion.input.evidenceBindings.length} LINKS
                  </span>
                </div>

                <div style={styles.evidenceList}>
                  {activeVersion.input.evidenceBindings.map(
                    (evidence) => (
                      <article
                        key={evidence.evidenceId}
                        style={styles.evidenceItem}
                      >
                        <div style={styles.evidenceHeader}>
                          <div>
                            <code style={styles.evidenceId}>
                              {evidence.evidenceId}
                            </code>

                            <strong style={styles.evidenceClaim}>
                              {formatLabel(evidence.claim)}
                            </strong>
                          </div>

                          <time style={styles.evidenceTime}>
                            {formatDate(evidence.observedAt)}
                          </time>
                        </div>

                        <div style={styles.hashBlock}>
                          <span style={styles.hashLabel}>
                            SHA-256 HASH
                          </span>

                          <code style={styles.hashValue}>
                            {evidence.hash}
                          </code>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              </section>

              <section style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.sectionLabel}>
                      EVENT CONTINUITY
                    </span>

                    <h2 style={styles.cardTitle}>
                      Immutable route event chain
                    </h2>
                  </div>

                  <span
                    style={{
                      ...styles.chainBadge,
                      background: record.eventChainValid
                        ? "#dcfce7"
                        : "#fee2e2",
                      color: record.eventChainValid
                        ? "#166534"
                        : "#991b1b",
                    }}
                  >
                    {record.eventChainValid ? "VALID" : "INVALID"}
                  </span>
                </div>

                <div style={styles.eventList}>
                  {record.events.map((event, index) => (
                    <article
                      key={event.eventId}
                      style={styles.eventItem}
                    >
                      <span style={styles.eventIndex}>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div style={styles.eventBody}>
                        <div style={styles.eventHeader}>
                          <strong style={styles.eventType}>
                            {formatLabel(event.type)}
                          </strong>

                          <time style={styles.eventTime}>
                            {formatDate(event.at)}
                          </time>
                        </div>

                        <p style={styles.eventMeta}>
                          Route version {event.version} · Event{" "}
                          {event.eventId}
                        </p>

                        <HashLine
                          label="Previous event hash"
                          value={
                            event.prevEventHash ??
                            "GENESIS — NO PRIOR EVENT"
                          }
                        />

                        <HashLine
                          label="Event hash"
                          value={event.eventHash}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside style={styles.sideColumn}>
              <section style={styles.darkCard}>
                <span style={styles.darkLabel}>ROUTE DECLARATION</span>

                <Detail
                  label="Organization ID"
                  value={activeVersion.input.organizationId}
                  dark
                />

                <Detail
                  label="System ID"
                  value={activeVersion.input.systemId}
                  dark
                />

                <Detail
                  label="Actor ID"
                  value={activeVersion.input.actorId}
                  dark
                />

                <Detail
                  label="Supplier ID"
                  value={activeVersion.input.supplierId}
                  dark
                />

                <Detail
                  label="Invoice ID"
                  value={activeVersion.input.invoiceId}
                  dark
                />

                <Detail
                  label="Beneficiary ID"
                  value={activeVersion.input.beneficiaryId}
                  dark
                />

                <Detail
                  label="Amount"
                  value={formatCurrency(
                    activeVersion.input.amountUsd,
                  )}
                  dark
                />

                <Detail
                  label="Policy"
                  value={activeVersion.input.policyVersion}
                  dark
                />
              </section>

              <section style={styles.card}>
                <span style={styles.sectionLabel}>
                  VERSION HISTORY
                </span>

                <h2 style={styles.sideTitle}>
                  Preserved route lineage
                </h2>

                <div style={styles.versionList}>
                  {record.versions.map((version) => {
                    const isActive =
                      version.version === activeVersion.version;

                    return (
                      <button
                        key={version.version}
                        type="button"
                        onClick={() =>
                          setSelectedVersion(version.version)
                        }
                        style={{
                          ...styles.versionButton,
                          borderColor: isActive
                            ? "#111827"
                            : "#d8dde5",
                          background: isActive
                            ? "#111827"
                            : "#ffffff",
                          color: isActive ? "#ffffff" : "#111827",
                        }}
                      >
                        <span>
                          <strong>
                            Version {version.version}
                          </strong>

                          <small
                            style={{
                              ...styles.versionDate,
                              color: isActive
                                ? "#cbd5e1"
                                : "#7b8492",
                            }}
                          >
                            {formatDate(version.createdAt)}
                          </small>
                        </span>

                        <span
                          style={{
                            ...styles.miniDecision,
                            background:
                              decisionTheme[
                                version.receipt.decision
                              ].background,
                            color:
                              decisionTheme[
                                version.receipt.decision
                              ].foreground,
                          }}
                        >
                          {version.receipt.decision}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section style={styles.card}>
                <span style={styles.sectionLabel}>
                  RECEIPT INTEGRITY
                </span>

                <h2 style={styles.sideTitle}>
                  Cryptographic identity
                </h2>

                <Detail
                  label="Receipt ID"
                  value={activeVersion.receipt.receiptId}
                />

                <Detail
                  label="Signing key"
                  value={activeVersion.receipt.signingKeyId}
                />

                <Detail
                  label="Scope"
                  value={activeVersion.receipt.scopeState}
                />

                <Detail
                  label="Requirement library"
                  value={
                    activeVersion.receipt
                      .requirementLibraryVersion
                  }
                />

                <HashLine
                  label="Manifest hash"
                  value={
                    activeVersion.receipt.inputManifestHash
                  }
                />

                <HashLine
                  label="Decision fingerprint"
                  value={
                    activeVersion.receipt.decisionFingerprint
                  }
                />

                <HashLine
                  label="Signature"
                  value={activeVersion.receipt.signature}
                />
              </section>

              <section style={styles.card}>
                <span style={styles.sectionLabel}>
                  CANONICAL EXECUTION CHAIN
                </span>

                <div style={styles.chainList}>
                  {chainStages.map((stage, index) => (
                    <div key={stage} style={styles.chainStage}>
                      <span style={styles.stageNumber}>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <strong>{stage}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section style={styles.actionCard}>
                <span style={styles.sectionLabel}>NEXT ACTIONS</span>

                <Link
                  href={`/workspace/verify?rid=${encodeURIComponent(
                    record.rid,
                  )}`}
                  style={styles.primaryAction}
                >
                  Verify This RID
                </Link>

                <Link
                  href="/workspace/routes/new"
                  style={styles.secondaryAction}
                >
                  Run Another Route
                </Link>

                <Link
                  href="/architecture"
                  style={styles.secondaryAction}
                >
                  Review Architecture
                </Link>
              </section>
            </aside>
          </section>
        </>
      )}

      <footer style={styles.footer}>
        <strong style={styles.footerPrinciple}>
          NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.
        </strong>

        <span style={styles.footerText}>
          Every material correction creates a new preserved route
          version.
        </span>
      </footer>
    </main>
  );
}

function RequirementRow({
  check,
}: {
  check: RequirementCheck;
}) {
  const colors =
    check.result === "SATISFIED"
      ? {
          background: "#dcfce7",
          foreground: "#166534",
          border: "#bbf7d0",
        }
      : check.result === "HOLD"
        ? {
            background: "#fef3c7",
            foreground: "#92400e",
            border: "#fde68a",
          }
        : check.result === "DENY"
          ? {
              background: "#fee2e2",
              foreground: "#991b1b",
              border: "#fecaca",
            }
          : {
              background: "#ede9fe",
              foreground: "#5b21b6",
              border: "#ddd6fe",
            };

  return (
    <article style={styles.requirementItem}>
      <div style={styles.requirementTop}>
        <div>
          <code style={styles.requirementId}>
            {check.requirementId}
          </code>

          <p style={styles.requirementReason}>{check.reason}</p>
        </div>

        <span
          style={{
            ...styles.requirementBadge,
            background: colors.background,
            borderColor: colors.border,
            color: colors.foreground,
          }}
        >
          {check.result}
        </span>
      </div>

      <div style={styles.requirementFooter}>
        <span>
          Library version: {check.requirementVersion}
        </span>

        <span>
          Evidence:{" "}
          {check.evidenceIds.length > 0
            ? check.evidenceIds.join(", ")
            : "None supplied"}
        </span>
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article style={styles.metricCard}>
      <span style={styles.metricLabel}>{label}</span>
      <strong style={styles.metricValue}>{value}</strong>
      <span style={styles.metricDetail}>{detail}</span>
    </article>
  );
}

function Detail({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        ...styles.detailRow,
        borderBottomColor: dark ? "#293348" : "#e9edf2",
      }}
    >
      <span
        style={{
          ...styles.detailLabel,
          color: dark ? "#91a0b8" : "#737d8c",
        }}
      >
        {label}
      </span>

      <code
        style={{
          ...styles.detailValue,
          color: dark ? "#ffffff" : "#172033",
        }}
      >
        {value}
      </code>
    </div>
  );
}

function HashLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={styles.hashLine}>
      <span style={styles.hashLabel}>{label}</span>
      <code style={styles.hashValue}>{value}</code>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f4f5f7",
    color: "#101827",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 30,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    padding: "17px clamp(20px, 5vw, 72px)",
    borderBottom: "1px solid #dce1e8",
    background: "rgba(244,245,247,0.96)",
    backdropFilter: "blur(18px)",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#101827",
    textDecoration: "none",
  },

  brandMark: {
    display: "grid",
    placeItems: "center",
    width: 42,
    height: 42,
    borderRadius: 9,
    background: "#111827",
    color: "#ffffff",
    fontWeight: 900,
  },

  brandTitle: {
    display: "block",
    fontSize: 13,
    letterSpacing: "0.08em",
  },

  brandSubtitle: {
    display: "block",
    marginTop: 3,
    color: "#70798a",
    fontSize: 11,
  },

  navigation: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 20,
  },

  navLink: {
    color: "#4b5563",
    fontSize: 14,
    fontWeight: 750,
    textDecoration: "none",
  },

  activeNavLink: {
    color: "#047857",
    fontSize: 14,
    fontWeight: 900,
    textDecoration: "none",
  },

  hero: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.15fr) minmax(320px, 0.55fr)",
    gap: 48,
    alignItems: "end",
    padding:
      "clamp(60px, 8vw, 110px) clamp(20px, 6vw, 92px)",
    background:
      "radial-gradient(circle at 88% 14%, rgba(52,211,153,0.18), transparent 31%), linear-gradient(180deg,#ffffff 0%,#f4f5f7 100%)",
    borderBottom: "1px solid #dce1e8",
  },

  heroCopy: {
    maxWidth: 900,
  },

  eyebrow: {
    color: "#047857",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.17em",
  },

  heroTitle: {
    margin: "18px 0",
    fontSize: "clamp(48px, 7vw, 88px)",
    lineHeight: 0.96,
    letterSpacing: "-0.06em",
  },

  heroText: {
    maxWidth: 820,
    color: "#5f6978",
    fontSize: "clamp(17px, 2vw, 21px)",
    lineHeight: 1.65,
  },

  searchCard: {
    display: "grid",
    gap: 13,
    padding: 27,
    border: "1px solid #d7dde5",
    borderRadius: 16,
    background: "#ffffff",
    boxShadow: "0 22px 65px rgba(15,23,42,0.08)",
  },

  sectionLabel: {
    color: "#697386",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.15em",
  },

  searchLabel: {
    marginTop: 7,
    color: "#273247",
    fontSize: 14,
    fontWeight: 850,
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 15px",
    border: "1px solid #cbd2dc",
    borderRadius: 9,
    background: "#f9fafb",
    color: "#111827",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 14,
    fontWeight: 750,
    outline: "none",
  },

  searchButton: {
    border: 0,
    borderRadius: 9,
    padding: "14px 17px",
    background: "#111827",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 850,
  },

  searchHelp: {
    margin: 0,
    color: "#7b8492",
    fontSize: 12,
    lineHeight: 1.5,
  },

  emptyState: {
    display: "grid",
    justifyItems: "center",
    gap: 14,
    margin:
      "clamp(42px, 7vw, 90px) clamp(20px, 6vw, 92px)",
    padding: "70px 30px",
    border: "1px solid #dce1e8",
    borderRadius: 18,
    background: "#ffffff",
    textAlign: "center",
  },

  emptyIcon: {
    display: "grid",
    placeItems: "center",
    width: 66,
    height: 66,
    borderRadius: 999,
    background: "#111827",
    color: "#6ee7b7",
    fontWeight: 900,
  },

  loadingDot: {
    width: 20,
    height: 20,
    borderRadius: 999,
    background: "#10b981",
    boxShadow: "0 0 0 9px rgba(16,185,129,0.14)",
  },

  emptyTitle: {
    margin: "10px 0 0",
    fontSize: 29,
    letterSpacing: "-0.035em",
  },

  emptyText: {
    maxWidth: 580,
    margin: 0,
    color: "#667085",
    lineHeight: 1.65,
  },

  primaryLink: {
    marginTop: 8,
    padding: "13px 17px",
    borderRadius: 8,
    background: "#111827",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 850,
    textDecoration: "none",
  },

  errorState: {
    margin:
      "clamp(42px, 7vw, 90px) clamp(20px, 6vw, 92px)",
    padding: "34px",
    border: "1px solid #fecaca",
    borderRadius: 16,
    background: "#ffffff",
  },

  errorTitle: {
    margin: "15px 0 12px",
    fontSize: 31,
    letterSpacing: "-0.04em",
  },

  errorMessage: {
    padding: 16,
    borderRadius: 9,
    background: "#fff1f2",
    color: "#991b1b",
    fontWeight: 750,
  },

  errorHelp: {
    color: "#6b7280",
    lineHeight: 1.6,
  },

  identityBand: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 25,
    padding: "30px clamp(20px, 6vw, 92px)",
    background: "#ffffff",
    borderBottom: "1px solid #dce1e8",
  },

  rid: {
    display: "block",
    marginTop: 10,
    color: "#047857",
    fontSize: "clamp(24px, 3vw, 39px)",
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },

  identityDescription: {
    margin: "8px 0 0",
    color: "#697386",
    fontSize: 14,
  },

  identityStatus: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 9,
  },

  decisionBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 12px",
    border: "1px solid",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 900,
  },

  chainBadge: {
    padding: "8px 11px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 900,
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 16,
    padding: "32px clamp(20px, 6vw, 92px) 0",
  },

  metricCard: {
    display: "grid",
    gap: 7,
    padding: 22,
    border: "1px solid #dce1e8",
    borderRadius: 13,
    background: "#ffffff",
  },

  metricLabel: {
    color: "#747e8d",
    fontSize: 11,
    fontWeight: 850,
    textTransform: "uppercase",
    letterSpacing: "0.09em",
  },

  metricValue: {
    fontSize: 31,
    letterSpacing: "-0.04em",
  },

  metricDetail: {
    color: "#7b8492",
    fontSize: 12,
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.35fr) minmax(330px, 0.65fr)",
    alignItems: "start",
    gap: 22,
    padding:
      "24px clamp(20px, 6vw, 92px) clamp(60px, 8vw, 100px)",
  },

  mainColumn: {
    display: "grid",
    gap: 22,
  },

  sideColumn: {
    display: "grid",
    gap: 22,
  },

  card: {
    padding: "clamp(22px, 3vw, 32px)",
    border: "1px solid #dce1e8",
    borderRadius: 16,
    background: "#ffffff",
    boxShadow: "0 16px 45px rgba(15,23,42,0.035)",
  },

  darkCard: {
    padding: 27,
    borderRadius: 16,
    background: "#0f172a",
    color: "#ffffff",
  },

  darkLabel: {
    display: "block",
    marginBottom: 15,
    color: "#6ee7b7",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.14em",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 22,
  },

  cardTitle: {
    margin: "8px 0 0",
    fontSize: "clamp(25px, 3vw, 36px)",
    letterSpacing: "-0.04em",
  },

  sideTitle: {
    margin: "9px 0 20px",
    fontSize: 23,
    letterSpacing: "-0.035em",
  },

  summaryText: {
    padding: 17,
    borderLeft: "4px solid #10b981",
    background: "#f0fdf4",
    color: "#36584d",
    fontSize: 14,
    lineHeight: 1.65,
  },

  requirementList: {
    display: "grid",
    gap: 12,
    marginTop: 20,
  },

  requirementItem: {
    padding: 17,
    border: "1px solid #e2e7ed",
    borderRadius: 11,
    background: "#fbfcfd",
  },

  requirementTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "flex-start",
  },

  requirementId: {
    color: "#047857",
    fontSize: 11,
    fontWeight: 850,
  },

  requirementReason: {
    margin: "8px 0 0",
    color: "#384457",
    fontSize: 14,
    lineHeight: 1.55,
  },

  requirementBadge: {
    flexShrink: 0,
    padding: "6px 9px",
    border: "1px solid",
    borderRadius: 999,
    fontSize: 9,
    fontWeight: 900,
  },

  requirementFooter: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 9,
    marginTop: 13,
    paddingTop: 12,
    borderTop: "1px solid #e6eaf0",
    color: "#7a8492",
    fontSize: 11,
  },

  countBadge: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "#eef2f7",
    color: "#556071",
    fontSize: 10,
    fontWeight: 900,
  },

  evidenceList: {
    display: "grid",
    gap: 13,
  },

  evidenceItem: {
    padding: 17,
    border: "1px solid #e1e6ec",
    borderRadius: 11,
    background: "#fbfcfd",
  },

  evidenceHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
  },

  evidenceId: {
    display: "block",
    color: "#047857",
    fontSize: 11,
    fontWeight: 850,
  },

  evidenceClaim: {
    display: "block",
    marginTop: 7,
    color: "#273247",
    fontSize: 14,
  },

  evidenceTime: {
    color: "#87909d",
    fontSize: 10,
  },

  hashBlock: {
    display: "grid",
    gap: 6,
    marginTop: 14,
    padding: 12,
    borderRadius: 8,
    background: "#111827",
  },

  hashLine: {
    display: "grid",
    gap: 6,
    marginTop: 13,
    padding: 12,
    borderRadius: 8,
    background: "#f2f4f7",
  },

  hashLabel: {
    color: "#788293",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },

  hashValue: {
    color: "#4b657d",
    fontSize: 10,
    lineHeight: 1.45,
    overflowWrap: "anywhere",
  },

  eventList: {
    display: "grid",
    gap: 14,
  },

  eventItem: {
    display: "grid",
    gridTemplateColumns: "42px minmax(0, 1fr)",
    gap: 15,
    padding: 17,
    border: "1px solid #e2e7ed",
    borderRadius: 11,
    background: "#fbfcfd",
  },

  eventIndex: {
    display: "grid",
    placeItems: "center",
    width: 38,
    height: 38,
    borderRadius: 999,
    background: "#111827",
    color: "#6ee7b7",
    fontSize: 11,
    fontWeight: 900,
  },

  eventBody: {
    minWidth: 0,
  },

  eventHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 15,
  },

  eventType: {
    fontSize: 14,
  },

  eventTime: {
    color: "#88919e",
    fontSize: 10,
  },

  eventMeta: {
    color: "#707a89",
    fontSize: 11,
  },

  detailRow: {
    display: "grid",
    gap: 5,
    padding: "11px 0",
    borderBottom: "1px solid",
  },

  detailLabel: {
    fontSize: 10,
    fontWeight: 850,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },

  detailValue: {
    fontSize: 11,
    fontWeight: 750,
    lineHeight: 1.45,
    overflowWrap: "anywhere",
  },

  versionList: {
    display: "grid",
    gap: 9,
  },

  versionButton: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
    width: "100%",
    padding: 14,
    border: "1px solid",
    borderRadius: 9,
    textAlign: "left",
    cursor: "pointer",
  },

  versionDate: {
    display: "block",
    marginTop: 5,
    fontSize: 9,
  },

  miniDecision: {
    padding: "5px 7px",
    borderRadius: 999,
    fontSize: 9,
    fontWeight: 900,
  },

  chainList: {
    display: "grid",
    gap: 0,
    marginTop: 18,
  },

  chainStage: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "11px 0",
    borderBottom: "1px solid #edf0f3",
    fontSize: 13,
  },

  stageNumber: {
    color: "#047857",
    fontSize: 9,
    fontWeight: 900,
  },

  actionCard: {
    display: "grid",
    gap: 10,
    padding: 25,
    border: "1px solid #dce1e8",
    borderRadius: 16,
    background: "#ffffff",
  },

  primaryAction: {
    marginTop: 10,
    padding: "13px 15px",
    borderRadius: 8,
    background: "#111827",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 850,
    textAlign: "center",
    textDecoration: "none",
  },

  secondaryAction: {
    padding: "12px 15px",
    border: "1px solid #cfd6df",
    borderRadius: 8,
    color: "#111827",
    fontSize: 13,
    fontWeight: 800,
    textAlign: "center",
    textDecoration: "none",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    padding: "28px clamp(20px, 6vw, 92px)",
    background: "#0f172a",
    color: "#ffffff",
  },

  footerPrinciple: {
    color: "#6ee7b7",
    fontSize: 13,
    letterSpacing: "0.05em",
  },

  footerText: {
    color: "#94a3b8",
    fontSize: 12,
  },
};
