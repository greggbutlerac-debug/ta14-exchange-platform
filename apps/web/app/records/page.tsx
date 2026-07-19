"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type RequirementResult = "SATISFIED" | "HOLD" | "DENY" | "ESCALATE";
type WorkspaceMode = "LANDING" | "BUILD" | "DRAFTS" | "VERIFY" | "LEARN";

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

type IntakeMaterial = {
  id: string;
  name: string;
  size: number;
  type: string;
  classification:
    | "Reality"
    | "Record"
    | "Authority"
    | "Binding"
    | "Commit"
    | "Execution"
    | "Outcome"
    | "Supporting Evidence"
    | "Unknown";
  integrity: "Hash pending" | "Locally inventoried";
  continuity: "Source review required" | "Ready for source review";
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

const constructionStages = [
  {
    number: "01",
    title: "Reality",
    description: "Define the condition, event, transaction, or environment the record preserves.",
  },
  {
    number: "02",
    title: "Evidence",
    description: "Inventory the materials that support the declared reality and claims.",
  },
  {
    number: "03",
    title: "Identity",
    description: "Establish the record owner, system, actor, source, subject, and identifiers.",
  },
  {
    number: "04",
    title: "Continuity",
    description: "Preserve chronology, custody, provenance, timestamps, and transformations.",
  },
  {
    number: "05",
    title: "Authority",
    description: "Establish who possessed authority, under what scope, and for what period.",
  },
  {
    number: "06",
    title: "Admissibility",
    description: "Evaluate requirements, limitations, missing evidence, and exception states.",
  },
  {
    number: "07",
    title: "Binding",
    description: "Bind evidence, authority, policy, identity, and intent to one record object.",
  },
  {
    number: "08",
    title: "Commit",
    description: "Freeze the pre-execution state and create a durable manifest identity.",
  },
  {
    number: "09",
    title: "Execution",
    description: "Preserve what actually occurred and compare it to what was committed.",
  },
  {
    number: "10",
    title: "Outcome",
    description: "Preserve the resulting state and establish outcome correspondence.",
  },
  {
    number: "11",
    title: "Governed Record",
    description: "Issue the RID, version, receipt, event chain, and record passport.",
  },
  {
    number: "12",
    title: "Lifecycle",
    description: "Activate access, custody, reliance, correction, retention, and disposition.",
  },
];

const lifecycleCards = [
  {
    title: "Access",
    href: "/workspace/records/access",
    description: "Define who may discover, retrieve, inspect, export, or act upon the record.",
    symbol: "AC",
  },
  {
    title: "Custody",
    href: "/workspace/records/custody",
    description: "Preserve possession, transfer, provenance, system transitions, and integrity checks.",
    symbol: "CU",
  },
  {
    title: "Reliance",
    href: "/workspace/records/reliance",
    description: "Declare what later decisions or executions may rely upon, and under what scope.",
    symbol: "RL",
  },
  {
    title: "Corrections",
    href: "/workspace/records/corrections",
    description: "Create governed versions without overwriting material history.",
    symbol: "CR",
  },
  {
    title: "Retention",
    href: "/workspace/records/retention",
    description: "Apply retention class, review dates, legal basis, and preservation obligations.",
    symbol: "RT",
  },
  {
    title: "Revocation",
    href: "/workspace/records/revocations",
    description: "Invalidate authority or reliance without erasing the preserved record.",
    symbol: "RV",
  },
  {
    title: "Disposition",
    href: "/workspace/records/disposition",
    description: "Authorize archival, transfer, anonymization, or destruction after requirements are met.",
    symbol: "DP",
  },
  {
    title: "Disputes",
    href: "/workspace/records/disputes",
    description: "Preserve challenges to identity, evidence, authority, continuity, or outcome.",
    symbol: "DS",
  },
];

const decisionTheme: Record<
  Decision,
  { background: string; border: string; foreground: string }
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

  const [mode, setMode] = useState<WorkspaceMode>(
    initialRid ? "VERIFY" : "LANDING",
  );
  const [ridInput, setRidInput] = useState(initialRid);
  const [record, setRecord] = useState<RouteRecordResponse | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [loading, setLoading] = useState(Boolean(initialRid));
  const [error, setError] = useState("");
  const [materials, setMaterials] = useState<IntakeMaterial[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    setMode("VERIFY");
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/routes/${encodeURIComponent(normalizedRid)}`,
        {
          method: "GET",
          cache: "no-store",
          headers: { Accept: "application/json" },
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

  function openMode(nextMode: WorkspaceMode) {
    setMode(nextMode);
    setError("");

    if (nextMode !== "VERIFY") {
      setRecord(null);
      setSelectedVersion(null);
      window.history.replaceState({}, "", "/records");
    }

    window.setTimeout(() => {
      document
        .getElementById("records-workspace")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 20);
  }

  function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);

    const nextMaterials = files.map<IntakeMaterial>((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
      name: file.name,
      size: file.size,
      type: file.type || "Unknown media type",
      classification: proposeClassification(file),
      integrity: "Locally inventoried",
      continuity: "Ready for source review",
    }));

    setMaterials((current) => [...current, ...nextMaterials]);
    setMode("BUILD");
  }

  function removeMaterial(id: string) {
    setMaterials((current) => current.filter((material) => material.id !== id));
  }

  function updateMaterialClassification(
    id: string,
    classification: IntakeMaterial["classification"],
  ) {
    setMaterials((current) =>
      current.map((material) =>
        material.id === id ? { ...material, classification } : material,
      ),
    );
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

  const readiness = useMemo(() => {
    const hasReality = materials.some(
      (material) => material.classification === "Reality",
    );
    const hasAuthority = materials.some(
      (material) => material.classification === "Authority",
    );
    const hasExecution = materials.some(
      (material) => material.classification === "Execution",
    );
    const hasOutcome = materials.some(
      (material) => material.classification === "Outcome",
    );

    const dimensions = [
      { label: "Reality", complete: hasReality },
      { label: "Evidence", complete: materials.length > 0 },
      { label: "Identity", complete: materials.length > 0 },
      { label: "Continuity", complete: materials.length > 1 },
      { label: "Authority", complete: hasAuthority },
      { label: "Binding", complete: false },
      { label: "Commit", complete: false },
      { label: "Execution", complete: hasExecution },
      { label: "Outcome", complete: hasOutcome },
    ];

    const completed = dimensions.filter((dimension) => dimension.complete).length;

    return {
      dimensions,
      percentage: Math.round((completed / dimensions.length) * 100),
    };
  }, [materials]);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.brand}>
          <span style={styles.brandMark}>14</span>
          <span>
            <strong style={styles.brandTitle}>
              TA-14 GOVERNED RECORDS
            </strong>
            <span style={styles.brandSubtitle}>
              Build · Preserve · Govern · Verify
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

      {!record && (
        <>
          <section style={styles.futureHero}>
            <div style={styles.heroGlowOne} />
            <div style={styles.heroGlowTwo} />
            <div style={styles.heroGrid} />

            <div style={styles.futureHeroContent}>
              <span style={styles.eyebrow}>
                GOVERNED RECORD CONSTRUCTION
              </span>

              <h1 style={styles.futureHeroTitle}>
                Turn raw materials into
                <span style={styles.heroAccent}>
                  {" "}
                  independently reviewable records.
                </span>
              </h1>

              <p style={styles.futureHeroText}>
                Bring the materials that describe reality. TA-14 guides
                identity, evidence, continuity, authority, admissibility,
                binding, execution correspondence, outcome correspondence,
                and lifecycle control without forcing users through a wall of
                forms.
              </p>

              <div style={styles.heroActions}>
                <button
                  type="button"
                  onClick={() => openMode("BUILD")}
                  style={styles.heroPrimary}
                >
                  Build a Governed Record
                </button>

                <button
                  type="button"
                  onClick={() => openMode("VERIFY")}
                  style={styles.heroSecondary}
                >
                  Verify an Existing Record
                </button>
              </div>

              <div style={styles.heroProofRow}>
                <span>Persistent identity</span>
                <span>Cryptographic continuity</span>
                <span>Governed lifecycle</span>
                <span>Independent review</span>
              </div>
            </div>

            <aside style={styles.heroPassport}>
              <span style={styles.passportTopline}>
                TA-14 GOVERNED RECORD
              </span>

              <div style={styles.passportPulse}>
                <span style={styles.passportPulseCore} />
              </div>

              <span style={styles.passportLabel}>READINESS PREVIEW</span>
              <strong style={styles.passportScore}>82%</strong>

              <div style={styles.passportMiniGrid}>
                <PassportState label="Identity" state="VERIFIED" />
                <PassportState label="Continuity" state="VERIFIED" />
                <PassportState label="Authority" state="PENDING" />
                <PassportState label="Binding" state="PENDING" />
              </div>

              <div style={styles.passportFooter}>
                <span>RID issued after commit</span>
                <span>Version history preserved</span>
              </div>
            </aside>
          </section>

          <section style={styles.laneSection}>
            <div style={styles.sectionHeadingRow}>
              <div>
                <span style={styles.sectionLabel}>START HERE</span>
                <h2 style={styles.sectionTitle}>
                  One workspace. Four clear ways forward.
                </h2>
              </div>

              <p style={styles.sectionIntro}>
                Sophisticated governance should feel guided, not
                bureaucratic. Choose the task you came to complete.
              </p>
            </div>

            <div style={styles.laneGrid}>
              <WorkspaceLane
                number="01"
                title="Build a Governed Record"
                description="Bring documents, images, video, logs, receipts, sensor exports, and evidence packages into a guided construction flow."
                action="Start construction"
                active={mode === "BUILD"}
                onClick={() => openMode("BUILD")}
              />

              <WorkspaceLane
                number="02"
                title="Continue a Draft"
                description="Resume an autosaved package, review unresolved gaps, and continue from the last completed governance decision."
                action="Open drafts"
                active={mode === "DRAFTS"}
                onClick={() => openMode("DRAFTS")}
              />

              <WorkspaceLane
                number="03"
                title="Verify an Existing Record"
                description="Enter a persistent RID and inspect the production record, signed receipt, evidence bindings, versions, and event continuity."
                action="Open verification"
                active={mode === "VERIFY"}
                onClick={() => openMode("VERIFY")}
              />

              <WorkspaceLane
                number="04"
                title="Learn Record Governance"
                description="Understand identity, continuity, authority, binding, corrections, retention, reliance, revocation, and disposition."
                action="Open guided learning"
                active={mode === "LEARN"}
                onClick={() => openMode("LEARN")}
              />
            </div>
          </section>

          <section id="records-workspace" style={styles.workspaceShell}>
            {mode === "LANDING" && (
              <LandingOverview onBuild={() => openMode("BUILD")} />
            )}

            {mode === "BUILD" && (
              <BuildWorkspace
                materials={materials}
                readiness={readiness}
                isDragging={isDragging}
                fileInputRef={fileInputRef}
                setIsDragging={setIsDragging}
                addFiles={addFiles}
                removeMaterial={removeMaterial}
                updateMaterialClassification={updateMaterialClassification}
              />
            )}

            {mode === "DRAFTS" && <DraftWorkspace />}

            {mode === "VERIFY" && (
              <VerifyWorkspace
                ridInput={ridInput}
                setRidInput={setRidInput}
                loading={loading}
                error={error}
                submitSearch={submitSearch}
              />
            )}

            {mode === "LEARN" && <LearnWorkspace />}
          </section>

          <section style={styles.lifecycleSection}>
            <div style={styles.sectionHeadingRow}>
              <div>
                <span style={styles.sectionLabel}>GOVERNANCE LIFECYCLE</span>
                <h2 style={styles.sectionTitle}>
                  The record remains governed after creation.
                </h2>
              </div>

              <p style={styles.sectionIntro}>
                Access, custody, reliance, correction, retention, revocation,
                disputes, and disposition remain visible parts of the record.
              </p>
            </div>

            <div style={styles.lifecycleGrid}>
              {lifecycleCards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  style={styles.lifecycleCard}
                >
                  <span style={styles.lifecycleSymbol}>{card.symbol}</span>
                  <div>
                    <strong style={styles.lifecycleTitle}>
                      {card.title}
                    </strong>
                    <p style={styles.lifecycleText}>
                      {card.description}
                    </p>
                  </div>
                  <span style={styles.lifecycleArrow}>↗</span>
                </Link>
              ))}
            </div>
          </section>

          <section style={styles.standardSection}>
            <div>
              <span style={styles.sectionLabel}>FINAL PRODUCT STANDARD</span>
              <h2 style={styles.standardTitle}>
                A governed record is not a document.
              </h2>
            </div>

            <p style={styles.standardText}>
              It is an execution object whose identity, evidence, continuity,
              authority, bindings, correspondence, versions, and lifecycle
              remain reviewable long after consequence occurs.
            </p>
          </section>
        </>
      )}

      {loading && record === null && mode === "VERIFY" && (
        <section style={styles.emptyState}>
          <span style={styles.loadingDot} />
          <h2 style={styles.emptyTitle}>
            Retrieving the preserved route.
          </h2>
          <p style={styles.emptyText}>
            Loading versions, signed receipt checks, evidence bindings, and
            event-chain continuity.
          </p>
        </section>
      )}

      {record && activeVersion && !loading && (
        <>
          <section style={styles.recordHero}>
            <div>
              <button
                type="button"
                onClick={() => {
                  setRecord(null);
                  setSelectedVersion(null);
                  setMode("LANDING");
                  window.history.replaceState({}, "", "/records");
                }}
                style={styles.backButton}
              >
                ← Back to Governed Records
              </button>

              <span style={styles.eyebrow}>
                PRESERVED EXECUTION EVIDENCE
              </span>

              <h1 style={styles.recordHeroTitle}>
                Inspect the route,
                <br />
                not the dashboard.
              </h1>

              <p style={styles.recordHeroText}>
                Review declarations, evidence bindings, governing
                requirements, signed decision receipt, version history, and
                immutable event-chain continuity.
              </p>
            </div>

            <form onSubmit={submitSearch} style={styles.searchCard}>
              <span style={styles.sectionLabel}>ROUTE RETRIEVAL</span>

              <label style={styles.searchLabel} htmlFor="rid-search-detail">
                Enter another TA-14 route identity
              </label>

              <input
                id="rid-search-detail"
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
            </form>
          </section>

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
              value={String(activeVersion.input.evidenceBindings.length)}
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
                  value={formatCurrency(activeVersion.input.amountUsd)}
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
                          <strong>Version {version.version}</strong>
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
                    activeVersion.receipt.requirementLibraryVersion
                  }
                />
                <HashLine
                  label="Manifest hash"
                  value={activeVersion.receipt.inputManifestHash}
                />
                <HashLine
                  label="Decision fingerprint"
                  value={activeVersion.receipt.decisionFingerprint}
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
          Every material correction creates a new preserved version.
        </span>
      </footer>
    </main>
  );
}

function LandingOverview({
  onBuild,
}: {
  onBuild: () => void;
}) {
  return (
    <div style={styles.overviewGrid}>
      <section style={styles.overviewMain}>
        <span style={styles.sectionLabel}>WHAT MAKES IT GOVERNED</span>
        <h2 style={styles.overviewTitle}>
          The platform does not treat upload as proof.
        </h2>

        <p style={styles.overviewText}>
          A governed record becomes reviewable only when identity, evidence,
          continuity, authority, admissibility, binding, execution, outcome,
          and lifecycle controls are made visible and attributable.
        </p>

        <div style={styles.constructionPreview}>
          {constructionStages.slice(0, 8).map((stage) => (
            <div key={stage.number} style={styles.previewStage}>
              <span style={styles.previewNumber}>{stage.number}</span>
              <span>{stage.title}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onBuild}
          style={styles.overviewButton}
        >
          Bring the materials that describe reality
        </button>
      </section>

      <aside style={styles.overviewSide}>
        <span style={styles.sectionLabel}>GOVERNANCE COACH</span>
        <h3 style={styles.coachTitle}>
          Clear guidance at the moment it matters.
        </h3>

        <CoachMessage
          title="Classification proposal"
          text="This image appears to document observed reality. Review before classification."
        />
        <CoachMessage
          title="Authority warning"
          text="The supplied authority document appears expired. Replace it or record an authorized exception."
        />
        <CoachMessage
          title="Correspondence gap"
          text="Outcome correspondence cannot yet be established because post-execution evidence is missing."
        />
      </aside>
    </div>
  );
}

function BuildWorkspace({
  materials,
  readiness,
  isDragging,
  fileInputRef,
  setIsDragging,
  addFiles,
  removeMaterial,
  updateMaterialClassification,
}: {
  materials: IntakeMaterial[];
  readiness: {
    percentage: number;
    dimensions: { label: string; complete: boolean }[];
  };
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setIsDragging: (value: boolean) => void;
  addFiles: (files: FileList | File[]) => void;
  removeMaterial: (id: string) => void;
  updateMaterialClassification: (
    id: string,
    classification: IntakeMaterial["classification"],
  ) => void;
}) {
  return (
    <div style={styles.buildGrid}>
      <section style={styles.intakePanel}>
        <span style={styles.sectionLabel}>MATERIALS INTAKE</span>
        <h2 style={styles.workspaceTitle}>
          Bring the materials that describe reality.
        </h2>

        <p style={styles.workspaceText}>
          Add documents, photographs, video, audio, JSON, CSV, logs, email,
          receipts, sensor exports, or evidence packages. Every item becomes a
          reviewable evidence object before any final record is issued.
        </p>

        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              fileInputRef.current?.click();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            addFiles(event.dataTransfer.files);
          }}
          style={{
            ...styles.dropZone,
            borderColor: isDragging ? "#5eead4" : "#304157",
            background: isDragging
              ? "rgba(20,184,166,0.14)"
              : "rgba(15,23,42,0.76)",
            transform: isDragging ? "scale(1.01)" : "scale(1)",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(event) => {
              if (event.target.files) {
                addFiles(event.target.files);
                event.target.value = "";
              }
            }}
            style={{ display: "none" }}
          />

          <span style={styles.dropIcon}>+</span>
          <strong style={styles.dropTitle}>
            Drop evidence materials here
          </strong>
          <span style={styles.dropText}>
            or select files from your device
          </span>
          <span style={styles.dropFormats}>
            PDF · Images · Video · Audio · JSON · CSV · Logs · Email · ZIP
          </span>
        </div>

        {materials.length === 0 ? (
          <div style={styles.intakeEmpty}>
            <strong>No materials added yet.</strong>
            <span>
              The workspace will inventory each item, propose a classification,
              and show what remains unresolved.
            </span>
          </div>
        ) : (
          <div style={styles.materialList}>
            {materials.map((material) => (
              <EvidenceMaterialCard
                key={material.id}
                material={material}
                removeMaterial={removeMaterial}
                updateMaterialClassification={
                  updateMaterialClassification
                }
              />
            ))}
          </div>
        )}
      </section>

      <aside style={styles.readinessPanel}>
        <span style={styles.sectionLabel}>GOVERNED RECORD READINESS</span>

        <div style={styles.readinessDial}>
          <div
            style={{
              ...styles.readinessRing,
              background: `conic-gradient(#5eead4 ${readiness.percentage}%, #1f2937 ${readiness.percentage}% 100%)`,
            }}
          >
            <div style={styles.readinessInner}>
              <strong style={styles.readinessValue}>
                {readiness.percentage}%
              </strong>
              <span style={styles.readinessCaption}>
                readiness preview
              </span>
            </div>
          </div>
        </div>

        <p style={styles.readinessExplanation}>
          This preview is transparent and requirement-based. Upload alone never
          establishes admissibility.
        </p>

        <div style={styles.readinessList}>
          {readiness.dimensions.map((dimension) => (
            <div key={dimension.label} style={styles.readinessRow}>
              <span>{dimension.label}</span>
              <strong
                style={{
                  color: dimension.complete ? "#5eead4" : "#94a3b8",
                }}
              >
                {dimension.complete ? "SATISFIED" : "MISSING"}
              </strong>
            </div>
          ))}
        </div>

        <div style={styles.coachPanel}>
          <span style={styles.coachAvatar}>A</span>
          <div>
            <strong style={styles.coachPanelTitle}>
              Governance Coach
            </strong>
            <p style={styles.coachPanelText}>
              I can identify, propose, explain, and warn. Final governed
              classifications remain attributable to a user, policy, or
              authorized automated process.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={materials.length === 0}
          style={{
            ...styles.continueButton,
            opacity: materials.length === 0 ? 0.45 : 1,
            cursor: materials.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Continue to Reality Definition
        </button>
      </aside>
    </div>
  );
}

function DraftWorkspace() {
  return (
    <div style={styles.centerWorkspace}>
      <span style={styles.sectionLabel}>DRAFT CONTINUATION</span>
      <h2 style={styles.workspaceTitle}>
        Resume without losing governance context.
      </h2>
      <p style={styles.workspaceText}>
        Persistent draft storage will show last activity, current stage,
        readiness, blockers, collaborators, and expiration policy. No final RID
        is issued until commit and establishment requirements are satisfied.
      </p>

      <div style={styles.placeholderGrid}>
        <PlaceholderCard
          title="Draft identity"
          text="Created as soon as the first material or declaration is added."
        />
        <PlaceholderCard
          title="Autosave state"
          text="Visible save confirmation after every material governance change."
        />
        <PlaceholderCard
          title="Resumable uploads"
          text="Interrupted sessions return to the last verified upload state."
        />
      </div>

      <span style={styles.phaseBadge}>
        PERSISTENT DRAFT API CONNECTION — NEXT BUILD PHASE
      </span>
    </div>
  );
}

function VerifyWorkspace({
  ridInput,
  setRidInput,
  loading,
  error,
  submitSearch,
}: {
  ridInput: string;
  setRidInput: (value: string) => void;
  loading: boolean;
  error: string;
  submitSearch: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div style={styles.verifyGrid}>
      <section>
        <span style={styles.sectionLabel}>INDEPENDENT VERIFICATION</span>
        <h2 style={styles.workspaceTitle}>
          Inspect the route, not the dashboard.
        </h2>
        <p style={styles.workspaceText}>
          Retrieve the production record directly by persistent RID. The
          inspector preserves requirement-level decisions, evidence hashes,
          versions, signed receipts, and event-chain continuity.
        </p>

        <div style={styles.verifyFeatureGrid}>
          <PlaceholderCard
            title="Signed receipt"
            text="Review decision, policy, requirement results, next action, and signature."
          />
          <PlaceholderCard
            title="Evidence manifest"
            text="Inspect evidence identity, claim, observed time, and preserved digest."
          />
          <PlaceholderCard
            title="Event continuity"
            text="Validate genesis, previous-event hashes, versions, and correction history."
          />
        </div>
      </section>

      <form onSubmit={submitSearch} style={styles.verifyCard}>
        <span style={styles.sectionLabel}>ROUTE RETRIEVAL</span>
        <label style={styles.verifyLabel} htmlFor="rid-search">
          Enter a TA-14 route identity
        </label>

        <input
          id="rid-search"
          value={ridInput}
          onChange={(event) =>
            setRidInput(event.target.value.toUpperCase())
          }
          placeholder="TA14-RID-XXXXXXXX"
          style={styles.verifyInput}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.verifyButton,
            opacity: loading ? 0.65 : 1,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Retrieving route..." : "Inspect Preserved Route"}
        </button>

        {error && (
          <div style={styles.inlineError}>
            <strong>Route retrieval failed.</strong>
            <span>{error}</span>
          </div>
        )}

        <p style={styles.verifyHelp}>
          Missing production records are never replaced with demonstration
          data.
        </p>
      </form>
    </div>
  );
}

function LearnWorkspace() {
  return (
    <div>
      <div style={styles.sectionHeadingRow}>
        <div>
          <span style={styles.sectionLabel}>GUIDED LEARNING</span>
          <h2 style={styles.workspaceTitle}>
            Governance explained one decision at a time.
          </h2>
        </div>

        <p style={styles.sectionIntro}>
          Each stage explains what must be established, why it matters, the
          materials that answer it, and the next safe action.
        </p>
      </div>

      <div style={styles.learningGrid}>
        {constructionStages.map((stage) => (
          <article key={stage.number} style={styles.learningCard}>
            <span style={styles.learningNumber}>{stage.number}</span>
            <div>
              <strong style={styles.learningTitle}>
                {stage.title}
              </strong>
              <p style={styles.learningText}>
                {stage.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function WorkspaceLane({
  number,
  title,
  description,
  action,
  active,
  onClick,
}: {
  number: string;
  title: string;
  description: string;
  action: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.laneCard,
        borderColor: active ? "#2dd4bf" : "#d8e0e8",
        background: active ? "#0f172a" : "#ffffff",
        color: active ? "#ffffff" : "#101827",
        transform: active ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <span
        style={{
          ...styles.laneNumber,
          color: active ? "#5eead4" : "#0f766e",
        }}
      >
        {number}
      </span>

      <strong style={styles.laneTitle}>{title}</strong>
      <span
        style={{
          ...styles.laneDescription,
          color: active ? "#cbd5e1" : "#667085",
        }}
      >
        {description}
      </span>

      <span
        style={{
          ...styles.laneAction,
          color: active ? "#5eead4" : "#0f766e",
        }}
      >
        {action} →
      </span>
    </button>
  );
}

function EvidenceMaterialCard({
  material,
  removeMaterial,
  updateMaterialClassification,
}: {
  material: IntakeMaterial;
  removeMaterial: (id: string) => void;
  updateMaterialClassification: (
    id: string,
    classification: IntakeMaterial["classification"],
  ) => void;
}) {
  const classifications: IntakeMaterial["classification"][] = [
    "Reality",
    "Record",
    "Authority",
    "Binding",
    "Commit",
    "Execution",
    "Outcome",
    "Supporting Evidence",
    "Unknown",
  ];

  return (
    <article style={styles.materialCard}>
      <div style={styles.materialHeader}>
        <div style={styles.materialIdentity}>
          <span style={styles.materialIcon}>
            {material.name.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <strong style={styles.materialName}>
              {material.name}
            </strong>
            <span style={styles.materialMeta}>
              {formatFileSize(material.size)} · {material.type}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => removeMaterial(material.id)}
          style={styles.removeButton}
          aria-label={`Remove ${material.name}`}
        >
          ×
        </button>
      </div>

      <div style={styles.materialDetails}>
        <div>
          <span style={styles.materialLabel}>
            PROPOSED CLASSIFICATION
          </span>
          <select
            value={material.classification}
            onChange={(event) =>
              updateMaterialClassification(
                material.id,
                event.target
                  .value as IntakeMaterial["classification"],
              )
            }
            style={styles.classificationSelect}
          >
            {classifications.map((classification) => (
              <option key={classification} value={classification}>
                {classification}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span style={styles.materialLabel}>INTEGRITY</span>
          <strong style={styles.materialState}>
            {material.integrity}
          </strong>
        </div>

        <div>
          <span style={styles.materialLabel}>CONTINUITY</span>
          <strong style={styles.materialState}>
            {material.continuity}
          </strong>
        </div>
      </div>
    </article>
  );
}

function PassportState({
  label,
  state,
}: {
  label: string;
  state: "VERIFIED" | "PENDING";
}) {
  return (
    <div style={styles.passportState}>
      <span>{label}</span>
      <strong
        style={{
          color: state === "VERIFIED" ? "#5eead4" : "#94a3b8",
        }}
      >
        {state}
      </strong>
    </div>
  );
}

function CoachMessage({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <article style={styles.coachMessage}>
      <span style={styles.coachDot} />
      <div>
        <strong style={styles.coachMessageTitle}>{title}</strong>
        <p style={styles.coachMessageText}>{text}</p>
      </div>
    </article>
  );
}

function PlaceholderCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <article style={styles.placeholderCard}>
      <strong style={styles.placeholderTitle}>{title}</strong>
      <p style={styles.placeholderText}>{text}</p>
    </article>
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
        <span>Library version: {check.requirementVersion}</span>
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

function proposeClassification(
  file: File,
): IntakeMaterial["classification"] {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (
    type.startsWith("image/") ||
    type.startsWith("video/") ||
    name.includes("sensor")
  ) {
    return "Reality";
  }

  if (
    name.includes("authority") ||
    name.includes("authorization") ||
    name.includes("license")
  ) {
    return "Authority";
  }

  if (
    name.includes("receipt") ||
    name.includes("execution") ||
    name.includes("invoice")
  ) {
    return "Execution";
  }

  if (
    name.includes("outcome") ||
    name.includes("result") ||
    name.includes("completion")
  ) {
    return "Outcome";
  }

  if (type === "application/json" || name.endsWith(".json")) {
    return "Record";
  }

  return "Supporting Evidence";
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

function formatFileSize(value: number): string {
  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    overflowX: "hidden",
    background: "#f4f6f8",
    color: "#101827",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    padding: "16px clamp(18px, 5vw, 72px)",
    borderBottom: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(244,246,248,0.92)",
    backdropFilter: "blur(20px)",
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
    borderRadius: 11,
    background: "#0f172a",
    color: "#5eead4",
    fontWeight: 950,
    boxShadow: "0 12px 30px rgba(15,23,42,0.18)",
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
    color: "#0f766e",
    fontSize: 14,
    fontWeight: 900,
    textDecoration: "none",
  },
  futureHero: {
    position: "relative",
    isolation: "isolate",
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.18fr) minmax(310px, 0.52fr)",
    gap: "clamp(34px, 5vw, 72px)",
    alignItems: "center",
    minHeight: "670px",
    padding:
      "clamp(70px, 9vw, 128px) clamp(20px, 6vw, 92px)",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #07111f 0%, #0f172a 55%, #102a2a 100%)",
    color: "#ffffff",
  },
  heroGlowOne: {
    position: "absolute",
    zIndex: -2,
    top: "-18%",
    right: "-6%",
    width: 520,
    height: 520,
    borderRadius: 999,
    background:
      "radial-gradient(circle, rgba(45,212,191,0.24), transparent 68%)",
  },
  heroGlowTwo: {
    position: "absolute",
    zIndex: -2,
    bottom: "-32%",
    left: "18%",
    width: 680,
    height: 680,
    borderRadius: 999,
    background:
      "radial-gradient(circle, rgba(59,130,246,0.14), transparent 70%)",
  },
  heroGrid: {
    position: "absolute",
    inset: 0,
    zIndex: -1,
    opacity: 0.18,
    backgroundImage:
      "linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)",
    backgroundSize: "42px 42px",
    maskImage:
      "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 92%)",
  },
  futureHeroContent: {
    maxWidth: 980,
  },
  eyebrow: {
    color: "#5eead4",
    fontSize: 11,
    fontWeight: 950,
    letterSpacing: "0.18em",
  },
  futureHeroTitle: {
    maxWidth: 980,
    margin: "20px 0",
    fontSize: "clamp(48px, 7vw, 88px)",
    lineHeight: 0.98,
    letterSpacing: "-0.06em",
  },
  heroAccent: {
    color: "#99f6e4",
  },
  futureHeroText: {
    maxWidth: 850,
    margin: 0,
    color: "#c4cedb",
    fontSize: "clamp(17px, 2vw, 21px)",
    lineHeight: 1.65,
  },
  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 32,
  },
  heroPrimary: {
    border: 0,
    borderRadius: 10,
    padding: "15px 19px",
    background: "#5eead4",
    color: "#07221f",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 18px 38px rgba(45,212,191,0.2)",
  },
  heroSecondary: {
    border: "1px solid rgba(148,163,184,0.42)",
    borderRadius: 10,
    padding: "14px 18px",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 850,
    cursor: "pointer",
  },
  heroProofRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "9px 18px",
    marginTop: 28,
    color: "#8fa0b5",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  heroPassport: {
    position: "relative",
    display: "grid",
    gap: 18,
    padding: "28px",
    border: "1px solid rgba(94,234,212,0.24)",
    borderRadius: 24,
    background:
      "linear-gradient(155deg, rgba(255,255,255,0.10), rgba(255,255,255,0.035))",
    boxShadow: "0 35px 90px rgba(0,0,0,0.28)",
    backdropFilter: "blur(20px)",
  },
  passportTopline: {
    color: "#99f6e4",
    fontSize: 10,
    fontWeight: 950,
    letterSpacing: "0.16em",
  },
  passportPulse: {
    display: "grid",
    placeItems: "center",
    width: 88,
    height: 88,
    margin: "8px auto 0",
    borderRadius: 999,
    border: "1px solid rgba(94,234,212,0.35)",
    boxShadow:
      "0 0 0 12px rgba(45,212,191,0.05), 0 0 0 24px rgba(45,212,191,0.025)",
  },
  passportPulseCore: {
    width: 24,
    height: 24,
    borderRadius: 999,
    background: "#5eead4",
    boxShadow: "0 0 28px rgba(94,234,212,0.85)",
  },
  passportLabel: {
    color: "#94a3b8",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.15em",
    textAlign: "center",
  },
  passportScore: {
    fontSize: 50,
    lineHeight: 1,
    letterSpacing: "-0.06em",
    textAlign: "center",
  },
  passportMiniGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  },
  passportState: {
    display: "grid",
    gap: 5,
    padding: 12,
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: 10,
    background: "rgba(15,23,42,0.54)",
    color: "#cbd5e1",
    fontSize: 10,
  },
  passportFooter: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 14,
    borderTop: "1px solid rgba(148,163,184,0.15)",
    color: "#7f8da1",
    fontSize: 9,
  },
  laneSection: {
    padding:
      "clamp(58px, 7vw, 96px) clamp(20px, 6vw, 92px) 28px",
  },
  sectionHeadingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 30,
    marginBottom: 28,
  },
  sectionLabel: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: 950,
    letterSpacing: "0.15em",
  },
  sectionTitle: {
    maxWidth: 780,
    margin: "10px 0 0",
    fontSize: "clamp(34px, 4.8vw, 58px)",
    lineHeight: 1.02,
    letterSpacing: "-0.055em",
  },
  sectionIntro: {
    maxWidth: 540,
    margin: 0,
    color: "#667085",
    lineHeight: 1.65,
  },
  laneGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 255px), 1fr))",
    gap: 15,
  },
  laneCard: {
    display: "grid",
    alignContent: "start",
    gap: 13,
    minHeight: 270,
    padding: 24,
    border: "1px solid",
    borderRadius: 17,
    textAlign: "left",
    cursor: "pointer",
    boxShadow: "0 18px 45px rgba(15,23,42,0.045)",
    transition: "all 180ms ease",
  },
  laneNumber: {
    fontSize: 10,
    fontWeight: 950,
    letterSpacing: "0.12em",
  },
  laneTitle: {
    marginTop: 8,
    fontSize: 23,
    lineHeight: 1.12,
    letterSpacing: "-0.035em",
  },
  laneDescription: {
    fontSize: 14,
    lineHeight: 1.62,
  },
  laneAction: {
    alignSelf: "end",
    marginTop: "auto",
    fontSize: 12,
    fontWeight: 900,
  },
  workspaceShell: {
    scrollMarginTop: 96,
    margin: "24px clamp(20px, 6vw, 92px)",
    padding: "clamp(24px, 4vw, 46px)",
    border: "1px solid #d9e1e8",
    borderRadius: 24,
    background: "#ffffff",
    boxShadow: "0 30px 90px rgba(15,23,42,0.06)",
  },
  overviewGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.25fr) minmax(300px, 0.55fr)",
    gap: 28,
  },
  overviewMain: {
    padding: "clamp(6px, 2vw, 18px)",
  },
  overviewTitle: {
    maxWidth: 760,
    margin: "12px 0 16px",
    fontSize: "clamp(35px, 5vw, 58px)",
    lineHeight: 1,
    letterSpacing: "-0.055em",
  },
  overviewText: {
    maxWidth: 790,
    color: "#667085",
    fontSize: 17,
    lineHeight: 1.7,
  },
  constructionPreview: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 9,
    marginTop: 28,
  },
  previewStage: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 13,
    border: "1px solid #e3e8ee",
    borderRadius: 10,
    background: "#f8fafc",
    fontSize: 13,
    fontWeight: 800,
  },
  previewNumber: {
    color: "#0f766e",
    fontSize: 9,
    fontWeight: 950,
  },
  overviewButton: {
    marginTop: 24,
    border: 0,
    borderRadius: 10,
    padding: "14px 18px",
    background: "#0f172a",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",
  },
  overviewSide: {
    padding: 24,
    borderRadius: 18,
    background: "#0f172a",
    color: "#ffffff",
  },
  coachTitle: {
    margin: "11px 0 20px",
    fontSize: 26,
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
  },
  coachMessage: {
    display: "grid",
    gridTemplateColumns: "12px minmax(0, 1fr)",
    gap: 12,
    padding: "16px 0",
    borderTop: "1px solid rgba(148,163,184,0.15)",
  },
  coachDot: {
    width: 8,
    height: 8,
    marginTop: 5,
    borderRadius: 999,
    background: "#5eead4",
    boxShadow: "0 0 16px rgba(94,234,212,0.8)",
  },
  coachMessageTitle: {
    color: "#99f6e4",
    fontSize: 11,
  },
  coachMessageText: {
    margin: "6px 0 0",
    color: "#aebacc",
    fontSize: 13,
    lineHeight: 1.6,
  },
  buildGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.25fr) minmax(310px, 0.55fr)",
    gap: 28,
    alignItems: "start",
  },
  intakePanel: {
    minWidth: 0,
  },
  workspaceTitle: {
    margin: "12px 0 15px",
    fontSize: "clamp(34px, 4.6vw, 56px)",
    lineHeight: 1.03,
    letterSpacing: "-0.055em",
  },
  workspaceText: {
    maxWidth: 790,
    color: "#667085",
    fontSize: 16,
    lineHeight: 1.68,
  },
  dropZone: {
    display: "grid",
    justifyItems: "center",
    gap: 10,
    marginTop: 28,
    padding: "clamp(40px, 7vw, 78px) 24px",
    border: "1px dashed",
    borderRadius: 20,
    color: "#ffffff",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 160ms ease",
  },
  dropIcon: {
    display: "grid",
    placeItems: "center",
    width: 58,
    height: 58,
    borderRadius: 999,
    border: "1px solid rgba(94,234,212,0.42)",
    color: "#5eead4",
    fontSize: 30,
    fontWeight: 300,
  },
  dropTitle: {
    marginTop: 8,
    fontSize: 24,
    letterSpacing: "-0.035em",
  },
  dropText: {
    color: "#b6c2d2",
    fontSize: 14,
  },
  dropFormats: {
    marginTop: 10,
    color: "#718096",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.06em",
  },
  intakeEmpty: {
    display: "grid",
    gap: 6,
    marginTop: 16,
    padding: 18,
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    color: "#667085",
    fontSize: 13,
  },
  materialList: {
    display: "grid",
    gap: 12,
    marginTop: 18,
  },
  materialCard: {
    padding: 17,
    border: "1px solid #dfe6ed",
    borderRadius: 14,
    background: "#fbfcfd",
  },
  materialHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
  },
  materialIdentity: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  },
  materialIcon: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    width: 42,
    height: 42,
    borderRadius: 10,
    background: "#0f172a",
    color: "#5eead4",
    fontSize: 10,
    fontWeight: 950,
  },
  materialName: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 14,
  },
  materialMeta: {
    display: "block",
    marginTop: 5,
    color: "#7b8492",
    fontSize: 10,
  },
  removeButton: {
    border: 0,
    background: "transparent",
    color: "#94a3b8",
    fontSize: 23,
    cursor: "pointer",
  },
  materialDetails: {
    display: "grid",
    gridTemplateColumns:
      "minmax(180px, 1.2fr) minmax(130px, 0.7fr) minmax(150px, 0.8fr)",
    gap: 12,
    marginTop: 15,
    paddingTop: 15,
    borderTop: "1px solid #e8edf2",
  },
  materialLabel: {
    display: "block",
    marginBottom: 7,
    color: "#7c8798",
    fontSize: 8,
    fontWeight: 950,
    letterSpacing: "0.09em",
  },
  classificationSelect: {
    width: "100%",
    padding: "9px 10px",
    border: "1px solid #d7dee7",
    borderRadius: 8,
    background: "#ffffff",
    color: "#172033",
    fontSize: 11,
    fontWeight: 800,
  },
  materialState: {
    color: "#0f766e",
    fontSize: 11,
  },
  readinessPanel: {
    position: "sticky",
    top: 92,
    padding: 24,
    borderRadius: 18,
    background: "#0f172a",
    color: "#ffffff",
  },
  readinessDial: {
    display: "grid",
    placeItems: "center",
    padding: "26px 0 16px",
  },
  readinessRing: {
    display: "grid",
    placeItems: "center",
    width: 184,
    height: 184,
    borderRadius: 999,
  },
  readinessInner: {
    display: "grid",
    placeItems: "center",
    width: 148,
    height: 148,
    borderRadius: 999,
    background: "#0f172a",
  },
  readinessValue: {
    fontSize: 44,
    letterSpacing: "-0.06em",
  },
  readinessCaption: {
    color: "#94a3b8",
    fontSize: 10,
  },
  readinessExplanation: {
    color: "#a8b4c6",
    fontSize: 12,
    lineHeight: 1.6,
  },
  readinessList: {
    display: "grid",
    gap: 0,
    marginTop: 14,
  },
  readinessRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    padding: "10px 0",
    borderTop: "1px solid rgba(148,163,184,0.13)",
    color: "#d4dbe6",
    fontSize: 11,
  },
  coachPanel: {
    display: "grid",
    gridTemplateColumns: "38px minmax(0, 1fr)",
    gap: 12,
    marginTop: 18,
    padding: 14,
    border: "1px solid rgba(94,234,212,0.18)",
    borderRadius: 12,
    background: "rgba(45,212,191,0.07)",
  },
  coachAvatar: {
    display: "grid",
    placeItems: "center",
    width: 34,
    height: 34,
    borderRadius: 999,
    background: "#5eead4",
    color: "#06201d",
    fontWeight: 950,
  },
  coachPanelTitle: {
    color: "#99f6e4",
    fontSize: 11,
  },
  coachPanelText: {
    margin: "5px 0 0",
    color: "#a8b4c6",
    fontSize: 10,
    lineHeight: 1.55,
  },
  continueButton: {
    width: "100%",
    marginTop: 16,
    border: 0,
    borderRadius: 9,
    padding: "13px 15px",
    background: "#5eead4",
    color: "#07221f",
    fontSize: 12,
    fontWeight: 950,
  },
  centerWorkspace: {
    display: "grid",
    justifyItems: "start",
    maxWidth: 980,
    margin: "0 auto",
  },
  placeholderGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 13,
    width: "100%",
    marginTop: 24,
  },
  placeholderCard: {
    padding: 18,
    border: "1px solid #e0e6ed",
    borderRadius: 12,
    background: "#f8fafc",
  },
  placeholderTitle: {
    display: "block",
    fontSize: 14,
  },
  placeholderText: {
    margin: "7px 0 0",
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 1.6,
  },
  phaseBadge: {
    marginTop: 24,
    padding: "9px 12px",
    borderRadius: 999,
    background: "#ecfeff",
    color: "#0f766e",
    fontSize: 9,
    fontWeight: 950,
    letterSpacing: "0.08em",
  },
  verifyGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) minmax(310px, 0.55fr)",
    gap: 32,
    alignItems: "start",
  },
  verifyFeatureGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    marginTop: 24,
  },
  verifyCard: {
    display: "grid",
    gap: 13,
    padding: 24,
    borderRadius: 17,
    background: "#0f172a",
    color: "#ffffff",
  },
  verifyLabel: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: 850,
  },
  verifyInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 15px",
    border: "1px solid #334155",
    borderRadius: 9,
    background: "#111c2f",
    color: "#ffffff",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 13,
    fontWeight: 750,
    outline: "none",
  },
  verifyButton: {
    border: 0,
    borderRadius: 9,
    padding: "14px 16px",
    background: "#5eead4",
    color: "#07221f",
    fontSize: 13,
    fontWeight: 950,
  },
  verifyHelp: {
    margin: 0,
    color: "#8997aa",
    fontSize: 10,
    lineHeight: 1.5,
  },
  inlineError: {
    display: "grid",
    gap: 4,
    padding: 13,
    border: "1px solid rgba(252,165,165,0.25)",
    borderRadius: 9,
    background: "rgba(127,29,29,0.25)",
    color: "#fecaca",
    fontSize: 11,
  },
  learningGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 12,
  },
  learningCard: {
    display: "grid",
    gridTemplateColumns: "42px minmax(0, 1fr)",
    gap: 14,
    padding: 18,
    border: "1px solid #dfe6ed",
    borderRadius: 13,
    background: "#fbfcfd",
  },
  learningNumber: {
    color: "#0f766e",
    fontSize: 10,
    fontWeight: 950,
  },
  learningTitle: {
    fontSize: 15,
  },
  learningText: {
    margin: "6px 0 0",
    color: "#667085",
    fontSize: 12,
    lineHeight: 1.58,
  },
  lifecycleSection: {
    padding:
      "clamp(60px, 8vw, 110px) clamp(20px, 6vw, 92px)",
  },
  lifecycleGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
    gap: 13,
  },
  lifecycleCard: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "48px minmax(0, 1fr) 18px",
    gap: 14,
    minHeight: 142,
    padding: 20,
    border: "1px solid #dce3ea",
    borderRadius: 15,
    background: "#ffffff",
    color: "#101827",
    textDecoration: "none",
    boxShadow: "0 14px 40px rgba(15,23,42,0.035)",
  },
  lifecycleSymbol: {
    display: "grid",
    placeItems: "center",
    width: 42,
    height: 42,
    borderRadius: 10,
    background: "#0f172a",
    color: "#5eead4",
    fontSize: 10,
    fontWeight: 950,
  },
  lifecycleTitle: {
    fontSize: 16,
  },
  lifecycleText: {
    margin: "7px 0 0",
    color: "#667085",
    fontSize: 12,
    lineHeight: 1.58,
  },
  lifecycleArrow: {
    color: "#0f766e",
    fontSize: 16,
  },
  standardSection: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 0.8fr) minmax(0, 1.2fr)",
    gap: 38,
    alignItems: "center",
    padding:
      "clamp(56px, 8vw, 104px) clamp(20px, 6vw, 92px)",
    background: "#0f172a",
    color: "#ffffff",
  },
  standardTitle: {
    margin: "12px 0 0",
    fontSize: "clamp(36px, 5vw, 64px)",
    lineHeight: 1,
    letterSpacing: "-0.055em",
  },
  standardText: {
    margin: 0,
    color: "#b8c3d1",
    fontSize: "clamp(18px, 2.2vw, 25px)",
    lineHeight: 1.6,
  },
  recordHero: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.1fr) minmax(310px, 0.5fr)",
    gap: 46,
    alignItems: "end",
    padding:
      "clamp(60px, 8vw, 108px) clamp(20px, 6vw, 92px)",
    background:
      "radial-gradient(circle at 88% 14%, rgba(52,211,153,0.18), transparent 31%), linear-gradient(180deg,#ffffff 0%,#f4f5f7 100%)",
    borderBottom: "1px solid #dce1e8",
  },
  backButton: {
    display: "block",
    marginBottom: 24,
    border: 0,
    padding: 0,
    background: "transparent",
    color: "#0f766e",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  },
  recordHeroTitle: {
    margin: "18px 0",
    fontSize: "clamp(48px, 7vw, 84px)",
    lineHeight: 0.96,
    letterSpacing: "-0.06em",
  },
  recordHeroText: {
    maxWidth: 820,
    color: "#5f6978",
    fontSize: "clamp(17px, 2vw, 20px)",
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
    background: "#07111f",
    color: "#ffffff",
  },
  footerPrinciple: {
    color: "#5eead4",
    fontSize: 13,
    letterSpacing: "0.05em",
  },
  footerText: {
    color: "#94a3b8",
    fontSize: 12,
  },
};

