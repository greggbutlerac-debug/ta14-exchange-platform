"use client";

import Link from "next/link";
import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearPendingRouteDraft,
  readPendingRouteDraft,
  type TransferRouteDraft,
  type TransferStageKey,
} from "../../../../lib/route-draft-transfer";
import { AiGovernanceEvaluationPanel } from "./ai-governance-evaluation-panel";
import { RouteChainVisualizer } from "./route-chain-visualizer";
import { RouteMetadataPanel } from "./route-metadata-panel";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

type RouteForm = {
  organizationName: string;
  systemName: string;
  actorId: string;
  supplierId: string;
  invoiceId: string;
  beneficiaryId: string;
  amountUsd: string;
};

type RouteReceipt = {
  decision?: Decision;
  signature?: string;
  receiptId?: string;
  evaluatedAt?: string;
  [key: string]: unknown;
};

type CreatedRoute = {
  rid: string;
  organizationName: string;
  systemName: string;
  version: number;
  decision: Decision;
  correlationId: string;
  createdAt: string;
  receipt: RouteReceipt;
};



type RegisteredGovernance = {
  registrationId: string;
  organizationName: string;
  architectureName: string;
  version: string;
  status: "REGISTERED" | "REVIEW_REQUIRED" | "SUSPENDED";
  sectors: string[];
  jurisdictions: string[];
  supportedDeterminations: Decision[];
  routeCount: number;
  artifactCount: number;
  verificationLevel: number;
};

type RouteStudioHandoff = {
  handoffVersion: "2.0";
  createdAt: string;
  governance: RegisteredGovernance;
  route: {
    rid: string | null;
    name: string;
    domain: string;
    owner: string;
    version: number;
    selectedStage: TransferStageKey;
    stageDeclarations: Partial<Record<TransferStageKey, string>>;
    decision: Decision | null;
    receiptId: string | null;
    correlationId: string | null;
  };
  scope: {
    sector: string;
    jurisdiction: string;
    classification: "DEMONSTRATION" | "PRODUCTION_CANDIDATE";
  };
};


type ApiError = {
  error?: string;
  correlationId?: string;
};



const registeredGovernances: RegisteredGovernance[] = [
  {
    registrationId: "TA14-GOV-000001",
    organizationName: "TA-14 Authority",
    architectureName: "TA-14 Admissible Execution Architecture",
    version: "2.0",
    status: "REGISTERED",
    sectors: [
      "AI governance",
      "Financial execution",
      "Built environment",
      "Public administration",
    ],
    jurisdictions: ["United States", "Global demonstration"],
    supportedDeterminations: ["ALLOW", "HOLD", "DENY", "ESCALATE"],
    routeCount: 24,
    artifactCount: 12,
    verificationLevel: 6,
  },
  {
    registrationId: "TA14-GOV-DEMO-002",
    organizationName: "Northstar Governance Laboratory",
    architectureName: "Bounded Agent Control Framework",
    version: "1.4",
    status: "REGISTERED",
    sectors: ["AI governance", "Healthcare", "Enterprise operations"],
    jurisdictions: ["United States", "European Union"],
    supportedDeterminations: ["ALLOW", "HOLD", "DENY", "ESCALATE"],
    routeCount: 8,
    artifactCount: 3,
    verificationLevel: 4,
  },
  {
    registrationId: "TA14-GOV-DEMO-003",
    organizationName: "Civic Systems Assurance Group",
    architectureName: "Public Consequence Governance Model",
    version: "0.9",
    status: "REVIEW_REQUIRED",
    sectors: ["Public administration", "Procurement"],
    jurisdictions: ["United States"],
    supportedDeterminations: ["HOLD", "DENY", "ESCALATE"],
    routeCount: 2,
    artifactCount: 0,
    verificationLevel: 1,
  },
];

const ROUTE_STUDIO_HANDOFF_KEY = "ta14:registered-governance-route-handoff:v2";


const INSTITUTIONAL_LIFECYCLE = [
  { label: "Credentials", href: "/foundation", state: "complete" },
  { label: "Architecture", href: "/workspace/ai-governance/registry", state: "complete" },
  { label: "Registration", href: "/governance/register", state: "complete" },
  { label: "Workspace", href: "/governance/workspace", state: "complete" },
  { label: "Route Builder", href: "/workspace/routes/new", state: "current" },
  { label: "Artifact Studio", href: "/artifacts/studio", state: "next" },
  { label: "Artifact Registry", href: "/artifacts/registry", state: "future" },
  { label: "Verification", href: "/artifacts/verify", state: "future" },
] as const;

const STAGE_GUIDANCE: Record<TransferStageKey, { why: string; asks: string }> = {
  reality: { why: "Defines the real-world condition or proposed consequence that gives the route a reason to exist.", asks: "What condition exists, who is affected, and what consequence is proposed?" },
  record: { why: "Creates the attributable record that later evidence, authority, and receipts must resolve back to.", asks: "Which identities, systems, objects, and source records are being governed?" },
  continuity: { why: "Prevents a valid beginning from silently becoming a different request before execution.", asks: "What must remain connected, current, and unchanged through the full route?" },
  admissibility: { why: "Determines whether the available evidence is fit to govern consequence rather than merely present.", asks: "Is the evidence attributable, current, relevant, sufficient, and conflict-aware?" },
  binding: { why: "Limits the route to the exact scope, destination, privilege, amount, model, tool, and jurisdiction actually authorized.", asks: "What may this route bind—and what is explicitly outside its authority?" },
  commit: { why: "Freezes the route, reasons, actor, dependencies, and determination before technical execution begins.", asks: "What exact version and decision must be preserved before release?" },
  execution: { why: "Connects the governance decision to a technical effect that releases, holds, blocks, or reroutes action.", asks: "Which adapter enforces the decision, and what exact effect is permitted?" },
  outcome: { why: "Preserves what actually happened, residual risk, follow-up obligations, and the evidence required for closure.", asks: "What result must be observed and verified before the route can close?" },
};


const initialForm: RouteForm = {
  organizationName: "TA-14 Demonstration Organization",
  systemName: "Governed Vendor Payment Engine",
  actorId: "ACTOR-DEMO-001",
  supplierId: "SUPPLIER-DEMO-001",
  invoiceId: "INVOICE-DEMO-001",
  beneficiaryId: "BENEFICIARY-DEMO-001",
  amountUsd: "27500",
};

const chain: Array<{
  key: TransferStageKey;
  number: string;
  label: string;
}> = [
  {
    key: "reality",
    number: "01",
    label: "Reality",
  },
  {
    key: "record",
    number: "02",
    label: "Record",
  },
  {
    key: "continuity",
    number: "03",
    label: "Continuity",
  },
  {
    key: "admissibility",
    number: "04",
    label: "Admissibility",
  },
  {
    key: "binding",
    number: "05",
    label: "Binding",
  },
  {
    key: "commit",
    number: "06",
    label: "Commit",
  },
  {
    key: "execution",
    number: "07",
    label: "Execution",
  },
  {
    key: "outcome",
    number: "08",
    label: "Outcome",
  },
];

const decisionColors: Record<
  Decision,
  {
    background: string;
    color: string;
  }
> = {
  ALLOW: {
    background: "#d1fae5",
    color: "#065f46",
  },
  HOLD: {
    background: "#fef3c7",
    color: "#92400e",
  },
  DENY: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  ESCALATE: {
    background: "#ede9fe",
    color: "#5b21b6",
  },
};

function normalizeDomain(value: string): string {
  return value.trim().toLowerCase().replace(/[_-]+/g, " ");
}

function isVendorPaymentDraft(
  draft: TransferRouteDraft | null,
): boolean {
  if (!draft) {
    return true;
  }

  const domain = normalizeDomain(draft.metadata.domain);
  const name = normalizeDomain(draft.metadata.name);

  return (
    domain === "finance" ||
    domain === "financial governance" ||
    domain === "vendor payment" ||
    domain === "payment" ||
    name.includes("vendor payment") ||
    name.includes("supplier payment")
  );
}

function isAiGovernanceDraft(
  draft: TransferRouteDraft | null,
): boolean {
  if (!draft) {
    return false;
  }

  const domain = normalizeDomain(draft.metadata.domain);
  const name = normalizeDomain(draft.metadata.name);

  return (
    domain === "ai governance" ||
    domain === "artificial intelligence governance" ||
    domain === "ai" ||
    domain.includes("ai governance") ||
    name.includes("ai agent") ||
    name.includes("artificial intelligence")
  );
}

export default function NewRoutePage() {
  const [form, setForm] = useState<RouteForm>(initialForm);
  const [draft, setDraft] = useState<TransferRouteDraft | null>(
    null,
  );
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [selectedStage, setSelectedStage] =
    useState<TransferStageKey>("reality");
  const [result, setResult] = useState<CreatedRoute | null>(null);
  const [error, setError] = useState("");
  const [correlationId, setCorrelationId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedGovernanceId, setSelectedGovernanceId] = useState(
    registeredGovernances[0].registrationId,
  );
  const [selectedSector, setSelectedSector] = useState(
    registeredGovernances[0].sectors[0],
  );
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(
    registeredGovernances[0].jurisdictions[0],
  );
  const [routeClassification, setRouteClassification] = useState<
    "DEMONSTRATION" | "PRODUCTION_CANDIDATE"
  >("DEMONSTRATION");
  const [handoffMessage, setHandoffMessage] = useState("");

  const selectedGovernance = useMemo(
    () =>
      registeredGovernances.find(
        (governance) => governance.registrationId === selectedGovernanceId,
      ) ?? registeredGovernances[0],
    [selectedGovernanceId],
  );

  const governanceEligible = selectedGovernance.status === "REGISTERED";

  const governanceReadiness = useMemo(() => {
    const checks = [
      governanceEligible,
      selectedGovernance.verificationLevel >= 3,
      selectedGovernance.sectors.includes(selectedSector),
      selectedGovernance.jurisdictions.includes(selectedJurisdiction),
      selectedGovernance.supportedDeterminations.length >= 4,
    ];

    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );
  }, [
    governanceEligible,
    selectedGovernance,
    selectedSector,
    selectedJurisdiction,
  ]);



  useEffect(() => {
    setSelectedSector(selectedGovernance.sectors[0] ?? "AI governance");
    setSelectedJurisdiction(
      selectedGovernance.jurisdictions[0] ?? "United States",
    );
  }, [selectedGovernance]);

  useEffect(() => {
    const transferredDraft = readPendingRouteDraft();

    setDraft(transferredDraft);
    setDraftLoaded(true);

    if (
      transferredDraft &&
      isVendorPaymentDraft(transferredDraft)
    ) {
      setForm((current) => ({
        ...current,
        organizationName:
          transferredDraft.metadata.owner !== "UNKNOWN"
            ? transferredDraft.metadata.owner
            : current.organizationName,
        systemName:
          transferredDraft.metadata.name || current.systemName,
      }));
    }
  }, []);

  const vendorPaymentCompatible =
    isVendorPaymentDraft(draft);

  const aiGovernanceCompatible =
    isAiGovernanceDraft(draft);

  const hasRegisteredAdapter =
    vendorPaymentCompatible || aiGovernanceCompatible;
  const routeConditions = useMemo(() => {
    const identityReady = Boolean(selectedGovernance.registrationId && selectedGovernance.organizationName);
    const architectureReady = Boolean(selectedGovernance.architectureName && selectedGovernance.version);
    const scopeReady = Boolean(selectedSector && selectedJurisdiction);
    const routeDeclared = Boolean(draft ? chain.every((stage) => Boolean(draft.chain[stage.key]?.trim())) : form.organizationName.trim() && form.systemName.trim());
    const adapterReady = hasRegisteredAdapter;
    const frozen = Boolean(result?.rid && result?.receipt?.receiptId);
    return [
      { label: "Governance identity", state: identityReady ? "PASS" : "BLOCKED", detail: identityReady ? selectedGovernance.registrationId : "Select an attributable governance." },
      { label: "Architecture version", state: architectureReady ? "PASS" : "BLOCKED", detail: architectureReady ? `${selectedGovernance.architectureName} v${selectedGovernance.version}` : "Architecture identity is unresolved." },
      { label: "Declared scope", state: scopeReady ? "PASS" : "BLOCKED", detail: scopeReady ? `${selectedSector} · ${selectedJurisdiction}` : "Sector and jurisdiction are required." },
      { label: "Route declaration", state: routeDeclared ? "PASS" : "REVIEW", detail: routeDeclared ? "The route has enough declared context to continue." : "Complete the route or manifest declarations." },
      { label: "Compatible adapter", state: adapterReady ? "PASS" : "REVIEW", detail: adapterReady ? (aiGovernanceCompatible ? "AI governance adapter connected." : "Vendor-payment adapter connected.") : "A domain adapter must be connected before live evaluation." },
      { label: "Frozen receipt", state: frozen ? "PASS" : "PENDING", detail: frozen ? `RID ${result?.rid}` : "Created only after a successful route submission." },
    ] as const;
  }, [selectedGovernance, selectedSector, selectedJurisdiction, draft, form.organizationName, form.systemName, hasRegisteredAdapter, aiGovernanceCompatible, result]);

  const routeReadyForStudio = governanceEligible && Boolean(selectedSector) && Boolean(selectedJurisdiction) && hasRegisteredAdapter;
  const stageGuidance = STAGE_GUIDANCE[selectedStage];

  const formattedAmount = useMemo(() => {
    const value = Number(form.amountUsd);

    if (!Number.isFinite(value) || value <= 0) {
      return "Not declared";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  }, [form.amountUsd]);

  const selectedStageDefinition =
    chain.find((stage) => stage.key === selectedStage) ??
    chain[0];

  const selectedStageValue = draft
    ? draft.chain[selectedStage]
    : "No transferred route draft is currently loaded.";

  function updateField(
    field: keyof RouteForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setResult(null);
    setError("");
    setCorrelationId("");
  }

  function clearForm() {
    setForm({
      organizationName: "",
      systemName: "",
      actorId: "",
      supplierId: "",
      invoiceId: "",
      beneficiaryId: "",
      amountUsd: "",
    });

    setResult(null);
    setError("");
    setCorrelationId("");
  }

  function removeTransferredDraft() {
    clearPendingRouteDraft();
    setDraft(null);
    setSelectedStage("reality");
    setResult(null);
    setError("");
    setCorrelationId("");
  }

  async function submitRoute(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!vendorPaymentCompatible) {
      setError(
        "This transferred route is not compatible with the vendor-payment API. TA-14 will not relabel the route or invent payment-domain values.",
      );
      return;
    }

    setSubmitting(true);
    setResult(null);
    setError("");
    setCorrelationId("");

    try {
      const amountUsd = Number(form.amountUsd);

      if (
        !Number.isFinite(amountUsd) ||
        amountUsd <= 0
      ) {
        throw new Error(
          "Enter a valid payment amount greater than zero.",
        );
      }

      const response = await fetch("/api/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationName:
            form.organizationName.trim(),
          systemName: form.systemName.trim(),
          actorId: form.actorId.trim(),
          supplierId: form.supplierId.trim(),
          invoiceId: form.invoiceId.trim(),
          beneficiaryId:
            form.beneficiaryId.trim(),
          amountUsd,
        }),
      });

      const payload = (await response.json()) as
        | CreatedRoute
        | ApiError;

      if (!response.ok) {
        const failure = payload as ApiError;

        setCorrelationId(
          failure.correlationId ?? "",
        );

        throw new Error(
          failure.error ??
            "The route could not be created.",
        );
      }

      const createdRoute = payload as CreatedRoute;

      setResult(createdRoute);
      setCorrelationId(
        createdRoute.correlationId ?? "",
      );
    } catch (routeError) {
      setError(
        routeError instanceof Error
          ? routeError.message
          : "An unknown route-creation error occurred.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function openArtifactStudio(): void {
    if (!governanceEligible) {
      setHandoffMessage(
        "This governance registration must be active before a route can enter the Execution Artifact Studio.",
      );
      return;
    }

    const stageDeclarations = draft
      ? Object.fromEntries(
          chain.map((stage) => [
            stage.key,
            draft.chain[stage.key]?.trim() || "UNDECLARED",
          ]),
        )
      : {
          reality: `Organization ${form.organizationName} proposes a consequential action through ${form.systemName}.`,
          record: `Actor ${form.actorId}; supplier ${form.supplierId}; invoice ${form.invoiceId}; beneficiary ${form.beneficiaryId}.`,
          continuity: "Identity, source records, route version, and authority must remain connected through execution.",
          admissibility: "Evidence must be current, attributable, relevant, sufficient, and conflict-aware.",
          binding: `The route is bounded to ${selectedSector} in ${selectedJurisdiction}.`,
          commit: "No action may execute until the route version and determination are frozen.",
          execution: "The execution adapter may release only the exact committed action.",
          outcome: "The resulting condition and residual risk must be preserved and verified.",
        };

    const handoff: RouteStudioHandoff = {
      handoffVersion: "2.0",
      createdAt: new Date().toISOString(),
      governance: selectedGovernance,
      route: {
        rid: result?.rid ?? null,
        name: routeTitle,
        domain: routeDomain,
        owner: routeOwner,
        version: result?.version ?? 1,
        selectedStage,
        stageDeclarations,
        decision: result?.decision ?? null,
        receiptId: result?.receipt.receiptId ?? null,
        correlationId: result?.correlationId ?? (correlationId || null),
      },
      scope: {
        sector: selectedSector,
        jurisdiction: selectedJurisdiction,
        classification: routeClassification,
      },
    };

    try {
      window.localStorage.setItem(
        ROUTE_STUDIO_HANDOFF_KEY,
        JSON.stringify(handoff),
      );
      setHandoffMessage(
        "Governance identity and frozen route context were preserved for the Execution Artifact Studio.",
      );
      window.location.assign("/artifacts/studio");
    } catch (storageError) {
      setHandoffMessage(
        storageError instanceof Error
          ? storageError.message
          : "The route handoff could not be preserved.",
      );
    }
  }

  const routeTitle =
    draft?.metadata.name ?? "Vendor payment route";

  const routeDomain =
    draft?.metadata.domain ?? "Finance";

  const routeOwner =
    draft?.metadata.owner ??
    "TA-14 Demonstration Organization";

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.brand}>
          <span style={styles.brandMark}>14</span>

          <span>
            <strong style={styles.brandTitle}>
              TA-14 EXCHANGE PLATFORM
            </strong>

            <span style={styles.brandSub}>
              Registered Governance Route Builder 2.0
            </span>
          </span>
        </Link>

        <nav
          style={styles.nav}
          aria-label="Primary navigation"
        >
          <Link href="/workspace" style={styles.navLink}>
            Workspace
          </Link>

          <Link
            href="/workspace/routes"
            style={styles.navLink}
          >
            Records
          </Link>

          <Link href="/verify" style={styles.navLink}>
            Verification
          </Link>

          <Link href="/pricing" style={styles.navLink}>
            Pricing
          </Link>

          <Link href="/" style={styles.navLink}>
            Public Site
          </Link>
        </nav>
      </header>

      <div style={styles.breadcrumbs}>
        <Link
          href="/workspace"
          style={styles.breadcrumbLink}
        >
          Workspace
        </Link>

        <span>›</span>

        <Link
          href="/workspace/build"
          style={styles.breadcrumbLink}
        >
          Builder
        </Link>

        <span>›</span>
        <span>Evaluation</span>
      </div>

      <section style={styles.lifecycle} aria-label="TA-14 institutional lifecycle">
        <div style={styles.lifecycleInner}>
          {INSTITUTIONAL_LIFECYCLE.map((item, index) => (
            <div key={item.label} style={styles.lifecycleItemWrap}>
              <Link
                href={item.href}
                style={{
                  ...styles.lifecycleItem,
                  ...(item.state === "current" ? styles.lifecycleCurrent : {}),
                  ...(item.state === "complete" ? styles.lifecycleComplete : {}),
                  ...(item.state === "next" ? styles.lifecycleNext : {}),
                }}
              >
                <span style={styles.lifecycleNumber}>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.label}</strong>
                <small>{item.state === "current" ? "YOU ARE HERE" : item.state === "complete" ? "ESTABLISHED" : item.state === "next" ? "NEXT" : "LATER"}</small>
              </Link>
              {index < INSTITUTIONAL_LIFECYCLE.length - 1 ? <span style={styles.lifecycleArrow}>→</span> : null}
            </div>
          ))}
        </div>
      </section>

      <main>
        <section style={styles.hero}>
          <div>
            <span style={styles.eyebrow}>
              {draft
                ? "TRANSFERRED GOVERNANCE ROUTE"
                : "NEW CONSEQUENTIAL ROUTE"}
            </span>

            <h1 style={styles.heroTitle}>
              Bind the route to a registered governance before consequence occurs.
            </h1>

            <p style={styles.heroText}>
              {draft
                ? "The route constructed in the Visual Route Builder has been transferred into the evaluation workspace. Review its complete Reality → Outcome chain before choosing an available evaluation lane."
                : "Declare the organization, system, actor, supplier, invoice, beneficiary, and proposed payment. The payment route will be submitted to the current TA-14 vendor-payment engine and preserved under a unique RID."}
            </p>
          </div>

          <aside style={styles.routePreview}>
            <span style={styles.previewLabel}>
              ROUTE UNDER REVIEW
            </span>

            <strong style={styles.previewTitle}>
              {routeTitle}
            </strong>

            <div style={styles.previewDetails}>
              <PreviewDetail
                label="Domain"
                value={routeDomain}
              />

              <PreviewDetail
                label="Owner"
                value={routeOwner}
              />

              <PreviewDetail
                label="Governance"
                value={selectedGovernance.registrationId}
              />

              <PreviewDetail
                label="Architecture"
                value={`${selectedGovernance.architectureName} v${selectedGovernance.version}`}
              />

              <PreviewDetail
                label="State"
                value={
                  draft?.status ?? "NEW_ROUTE"
                }
              />

              <PreviewDetail
                label="Adapter"
                value={
                  aiGovernanceCompatible
                    ? "AI GOVERNANCE"
                    : vendorPaymentCompatible
                      ? "VENDOR PAYMENT"
                      : "NOT REGISTERED"
                }
              />
            </div>
          </aside>
        </section>

        <section style={styles.orientationGrid}>
          <article style={styles.orientationCard}>
            <span style={styles.sectionLabel}>WHAT YOU ARE BUILDING</span>
            <h2 style={styles.orientationTitle}>A governed path from declared condition to verifiable outcome.</h2>
            <p style={styles.orientationText}>The route does not authorize a general capability. It binds one named governance, one architecture version, one scope, one chain of declarations, and one technical effect.</p>
          </article>
          <article style={styles.orientationCard}>
            <span style={styles.sectionLabel}>WHAT HAPPENS NEXT</span>
            <h2 style={styles.orientationTitle}>Freeze the route, then produce the execution artifact.</h2>
            <p style={styles.orientationText}>A successful route handoff carries governance identity, scope, declarations, determination, receipt identifiers, and correlation data into the Artifact Studio.</p>
          </article>
          <article style={styles.orientationCard}>
            <span style={styles.sectionLabel}>WHAT THIS DOES NOT DO</span>
            <h2 style={styles.orientationTitle}>A route declaration is not evidence that execution occurred.</h2>
            <p style={styles.orientationText}>The later artifact must independently preserve admissible evidence, the committed decision, the technical effect, outcome evidence, integrity commitments, and the claims boundary.</p>
          </article>
        </section>

        <section style={styles.governanceDeck}>
          <div style={styles.governanceDeckHeader}>
            <div>
              <span style={styles.sectionLabel}>
                REGISTERED GOVERNANCE CONTEXT
              </span>
              <h2 style={styles.governanceDeckTitle}>
                A route cannot enter the artifact registry without an attributable governance identity.
              </h2>
              <p style={styles.governanceDeckText}>
                Select the registered governance, architecture version, sector, jurisdiction, and record classification that own this route. This context travels with the frozen route into the Execution Artifact Studio.
              </p>
            </div>
            <div style={styles.governanceReadinessCard}>
              <span style={styles.governanceReadinessLabel}>ROUTE READINESS</span>
              <strong style={styles.governanceReadinessValue}>{governanceReadiness}%</strong>
              <span
                style={{
                  ...styles.governanceStatusBadge,
                  ...(governanceEligible
                    ? styles.governanceStatusRegistered
                    : styles.governanceStatusReview),
                }}
              >
                {selectedGovernance.status.replaceAll("_", " ")}
              </span>
            </div>
          </div>

          <div style={styles.governanceControlGrid}>
            <label style={styles.governanceField}>
              <span style={styles.governanceFieldLabel}>Registered governance</span>
              <select
                value={selectedGovernanceId}
                onChange={(event) => setSelectedGovernanceId(event.target.value)}
                style={styles.governanceSelect}
              >
                {registeredGovernances.map((governance) => (
                  <option
                    key={governance.registrationId}
                    value={governance.registrationId}
                  >
                    {governance.organizationName} · {governance.registrationId}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.governanceField}>
              <span style={styles.governanceFieldLabel}>Sector</span>
              <select
                value={selectedSector}
                onChange={(event) => setSelectedSector(event.target.value)}
                style={styles.governanceSelect}
              >
                {selectedGovernance.sectors.map((sector) => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </label>

            <label style={styles.governanceField}>
              <span style={styles.governanceFieldLabel}>Jurisdiction</span>
              <select
                value={selectedJurisdiction}
                onChange={(event) => setSelectedJurisdiction(event.target.value)}
                style={styles.governanceSelect}
              >
                {selectedGovernance.jurisdictions.map((jurisdiction) => (
                  <option key={jurisdiction} value={jurisdiction}>{jurisdiction}</option>
                ))}
              </select>
            </label>

            <label style={styles.governanceField}>
              <span style={styles.governanceFieldLabel}>Record classification</span>
              <select
                value={routeClassification}
                onChange={(event) =>
                  setRouteClassification(
                    event.target.value as "DEMONSTRATION" | "PRODUCTION_CANDIDATE",
                  )
                }
                style={styles.governanceSelect}
              >
                <option value="DEMONSTRATION">Controlled demonstration</option>
                <option value="PRODUCTION_CANDIDATE">Production candidate</option>
              </select>
            </label>
          </div>

          <div style={styles.governanceIdentityGrid}>
            <div style={styles.governanceIdentityCard}>
              <span style={styles.governanceIdentityLabel}>ARCHITECTURE</span>
              <strong style={styles.governanceIdentityValue}>
                {selectedGovernance.architectureName}
              </strong>
              <span style={styles.governanceIdentityMeta}>
                Version {selectedGovernance.version} · Verification L{selectedGovernance.verificationLevel}
              </span>
            </div>
            <div style={styles.governanceIdentityCard}>
              <span style={styles.governanceIdentityLabel}>PORTFOLIO</span>
              <strong style={styles.governanceIdentityValue}>
                {selectedGovernance.routeCount} routes · {selectedGovernance.artifactCount} artifacts
              </strong>
              <span style={styles.governanceIdentityMeta}>
                {selectedGovernance.supportedDeterminations.join(" · ")}
              </span>
            </div>
            <div style={styles.governanceIdentityCard}>
              <span style={styles.governanceIdentityLabel}>REGISTRY RULE</span>
              <strong style={styles.governanceIdentityValue}>
                No registered governance. No registered artifact.
              </strong>
              <span style={styles.governanceIdentityMeta}>
                Governance identity remains bound to every route and artifact version.
              </span>
            </div>
          </div>

          <div style={styles.governanceActionBar}>
            <div>
              <strong style={styles.governanceActionTitle}>Freeze the route into the artifact workflow.</strong>
              <p style={styles.governanceActionText}>
                The handoff preserves the governance registration, architecture version, route declarations, scope, current determination, and receipt identifiers.
              </p>
              {handoffMessage ? (
                <p style={styles.handoffMessage}>{handoffMessage}</p>
              ) : null}
            </div>
            <div style={styles.governanceActionButtons}>
              <Link href="/governance/workspace" style={styles.secondaryLink}>
                Open governance workspace
              </Link>
              <button
                type="button"
                onClick={openArtifactStudio}
                disabled={!governanceEligible}
                style={{
                  ...styles.primaryButton,
                  ...(!governanceEligible ? styles.disabledButton : {}),
                }}
              >
                Freeze route and open Artifact Studio →
              </button>
            </div>
          </div>
        </section>

        <section style={styles.readinessSection}>
          <div style={styles.readinessHeader}>
            <div>
              <span style={styles.sectionLabel}>CONDITION-BASED READINESS</span>
              <h2 style={styles.readinessTitle}>The route advances only when its required conditions are explicit.</h2>
              <p style={styles.readinessText}>This ledger replaces a vague percentage with the exact institutional conditions that pass, remain pending, or block handoff.</p>
            </div>
            <span style={{...styles.routeStatePill, ...(routeReadyForStudio ? styles.routeStateReady : styles.routeStateReview)}}>
              {routeReadyForStudio ? "READY FOR HANDOFF" : "REVIEW REQUIRED"}
            </span>
          </div>
          <div style={styles.readinessGrid}>
            {routeConditions.map((condition, index) => (
              <article key={condition.label} style={styles.readinessCard}>
                <div style={styles.readinessCardTop}>
                  <span style={styles.readinessIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <span style={{...styles.conditionBadge, ...(condition.state === "PASS" ? styles.conditionPass : condition.state === "BLOCKED" ? styles.conditionBlocked : condition.state === "PENDING" ? styles.conditionPending : styles.conditionReview)}}>{condition.state}</span>
                </div>
                <strong style={styles.readinessCardTitle}>{condition.label}</strong>
                <p style={styles.readinessCardText}>{condition.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <RouteChainVisualizer
          stages={chain}
          draft={draft}
          selectedStage={selectedStage}
          onSelectStage={setSelectedStage}
          variant="horizontal"
          ariaLabel="TA-14 canonical route chain"
        />

        {draftLoaded && draft ? (
          <section style={styles.transferSection}>
            <div style={styles.transferHeader}>
              <div>
                <span style={styles.sectionLabel}>
                  TRANSFERRED ROUTE MANIFEST
                </span>

                <h2 style={styles.transferTitle}>
                  {draft.metadata.name}
                </h2>

                <p style={styles.transferIntro}>
                  This is the route definition preserved by
                  the builder. Declared content is not proof
                  that the underlying evidence, continuity,
                  authority, execution, or outcome exists.
                </p>
              </div>

              <div style={styles.transferActions}>
                <Link
                  href="/workspace/build"
                  style={styles.secondaryLink}
                >
                  ← Return to builder
                </Link>

                <button
                  type="button"
                  onClick={removeTransferredDraft}
                  style={styles.clearDraftButton}
                >
                  Remove transferred route
                </button>
              </div>
            </div>

            <div style={styles.transferGrid}>
              <RouteChainVisualizer
                stages={chain}
                draft={draft}
                selectedStage={selectedStage}
                onSelectStage={setSelectedStage}
                variant="vertical"
                ariaLabel="Transferred route stages"
              />

              <article
                id={`route-stage-${selectedStage}`}
                role="tabpanel"
                aria-label={`${selectedStageDefinition.label} stage declaration`}
                style={styles.stageReview}
              >
                <div style={styles.stageReviewTop}>
                  <div>
                    <span style={styles.sectionLabel}>
                      STAGE{" "}
                      {selectedStageDefinition.number}
                    </span>

                    <h3 style={styles.stageReviewTitle}>
                      {selectedStageDefinition.label}
                    </h3>
                  </div>

                  <span style={styles.declaredBadge}>
                    DECLARED
                  </span>
                </div>

                <div style={styles.stageGuidance}>
                  <div>
                    <span style={styles.stageGuidanceLabel}>WHY THIS STAGE MATTERS</span>
                    <p style={styles.stageGuidanceText}>{stageGuidance.why}</p>
                  </div>
                  <div>
                    <span style={styles.stageGuidanceLabel}>THE QUESTION TO ANSWER</span>
                    <p style={styles.stageGuidanceText}>{stageGuidance.asks}</p>
                  </div>
                </div>

                <p style={styles.stageValue}>
                  {selectedStageValue}
                </p>

                <div style={styles.stageBoundary}>
                  <strong>
                    Evaluation boundary
                  </strong>

                  <p style={styles.boundaryParagraph}>
                    This statement came from the route
                    builder. The evaluator must still
                    determine whether supporting evidence,
                    continuity, authority, binding,
                    execution correspondence, and outcome
                    correspondence are admissible.
                  </p>
                </div>
              </article>

              <RouteMetadataPanel draft={draft} />
            </div>
          </section>
        ) : null}

        {draft && aiGovernanceCompatible ? (
          <section style={styles.adapterSection}>
            <div style={styles.adapterHeader}>
              <div>
                <span style={styles.adapterEyebrow}>
                  AI GOVERNANCE ADAPTER
                </span>

                <h2 style={styles.adapterTitle}>
                  The route is connected to its compatible
                  evaluation lane.
                </h2>

                <p style={styles.adapterText}>
                  This route is evaluated as an AI
                  Governance route. It is not submitted to
                  the vendor-payment API, and no supplier,
                  invoice, beneficiary, payment value, or
                  financial record is invented.
                </p>
              </div>

              <div style={styles.adapterState}>
                <span style={styles.adapterStateLabel}>
                  ROUTE STATE
                </span>

                <strong style={styles.adapterStateValue}>
                  PRESERVED · ADAPTER CONNECTED
                </strong>

                <p style={styles.adapterStateText}>
                  Declared route content remains subject to
                  evidence, authority, execution, and
                  outcome verification.
                </p>
              </div>
            </div>

            <AiGovernanceEvaluationPanel draft={draft} />
          </section>
        ) : null}

        {draft && !hasRegisteredAdapter ? (
          <section style={styles.adapterBoundary}>
            <div>
              <span style={styles.adapterEyebrow}>
                DOMAIN ADAPTER BOUNDARY
              </span>

              <h2 style={styles.adapterTitle}>
                The route transferred correctly. The
                evaluator for this domain has not been
                connected yet.
              </h2>

              <p style={styles.adapterText}>
                This is a {draft.metadata.domain} route. The
                current production API evaluates the
                vendor-payment route schema. TA-14 will not
                relabel this route as a payment or submit
                invented supplier, invoice, beneficiary, or
                financial values merely to force it through
                an incompatible engine.
              </p>
            </div>

            <div style={styles.adapterState}>
              <span style={styles.adapterStateLabel}>
                ROUTE STATE
              </span>

              <strong style={styles.adapterStateValue}>
                PRESERVED · ADAPTER REQUIRED
              </strong>

              <p style={styles.adapterStateText}>
                The complete route remains available above
                for review and future domain-adapter
                integration.
              </p>
            </div>
          </section>
        ) : null}

        <section style={styles.consequenceSection}>
          <div style={styles.consequenceHeader}>
            <div>
              <span style={styles.sectionLabel}>ROUTE CONSEQUENCE SUMMARY</span>
              <h2 style={styles.consequenceTitle}>Know exactly what this route can—and cannot—authorize.</h2>
            </div>
            <span style={styles.classificationPill}>{routeClassification.replaceAll("_", " ")}</span>
          </div>
          <div style={styles.consequenceGrid}>
            <article style={styles.consequenceAllow}>
              <span style={styles.consequenceLabel}>THIS ROUTE MAY AUTHORIZE</span>
              <strong style={styles.consequenceStrong}>Only the exact action preserved by the selected governance, sector, jurisdiction, route version, determination, and technical adapter.</strong>
              <ul style={styles.consequenceList}>
                <li>{selectedGovernance.organizationName} · {selectedGovernance.registrationId}</li>
                <li>{selectedSector} · {selectedJurisdiction}</li>
                <li>{aiGovernanceCompatible ? "AI governance evaluation" : vendorPaymentCompatible ? `${formattedAmount} vendor-payment evaluation` : "A future compatible domain evaluation"}</li>
              </ul>
            </article>
            <article style={styles.consequenceDeny}>
              <span style={styles.consequenceLabel}>THIS ROUTE DOES NOT AUTHORIZE</span>
              <strong style={styles.consequenceStrong}>Any undeclared destination, privilege, amount, actor, runtime, jurisdiction, or action outside the frozen scope.</strong>
              <ul style={styles.consequenceList}>
                <li>Registration does not equal certification or legal approval.</li>
                <li>A declared route does not prove evidence admissibility or outcome closure.</li>
                <li>No execution may silently expand beyond the committed route.</li>
              </ul>
            </article>
            <article style={styles.consequenceEvidence}>
              <span style={styles.consequenceLabel}>EVIDENCE STILL REQUIRED</span>
              <strong style={styles.consequenceStrong}>The artifact must later preserve the evidence and receipts needed to justify reliance.</strong>
              <ul style={styles.consequenceList}>
                <li>Attributable evidence and authority sources</li>
                <li>Frozen determination and commit record</li>
                <li>Technical execution receipt and outcome evidence</li>
              </ul>
            </article>
          </div>
        </section>

        {(!draft || vendorPaymentCompatible) && (
          <section style={styles.workspaceGrid}>
            <form
              onSubmit={submitRoute}
              style={styles.formCard}
            >
              <div style={styles.formHeader}>
                <div>
                  <span style={styles.sectionLabel}>
                    LIVE VENDOR-PAYMENT MANIFEST
                  </span>

                  <h2 style={styles.formTitle}>
                    Define the proposed execution.
                  </h2>
                </div>

                <span style={styles.liveBadge}>
                  LIVE API
                </span>
              </div>

              {draft ? (
                <div style={styles.mappingNotice}>
                  <strong>
                    Compatible builder route detected
                  </strong>

                  <p style={styles.boundaryParagraph}>
                    The transferred route is categorized as
                    a finance or vendor-payment route. The
                    payment manifest remains explicit
                    because organization, actor, supplier,
                    invoice, beneficiary, and amount must be
                    bound to the API submission.
                  </p>
                </div>
              ) : null}

              <div style={styles.fieldGrid}>
                <Field
                  label="Organization name"
                  value={form.organizationName}
                  placeholder="Organization"
                  onChange={(value) =>
                    updateField(
                      "organizationName",
                      value,
                    )
                  }
                />

                <Field
                  label="System name"
                  value={form.systemName}
                  placeholder="System"
                  onChange={(value) =>
                    updateField("systemName", value)
                  }
                />

                <Field
                  label="Actor ID"
                  value={form.actorId}
                  placeholder="ACTOR-..."
                  onChange={(value) =>
                    updateField("actorId", value)
                  }
                />

                <Field
                  label="Supplier ID"
                  value={form.supplierId}
                  placeholder="SUPPLIER-..."
                  onChange={(value) =>
                    updateField("supplierId", value)
                  }
                />

                <Field
                  label="Invoice ID"
                  value={form.invoiceId}
                  placeholder="INVOICE-..."
                  onChange={(value) =>
                    updateField("invoiceId", value)
                  }
                />

                <Field
                  label="Beneficiary ID"
                  value={form.beneficiaryId}
                  placeholder="BENEFICIARY-..."
                  onChange={(value) =>
                    updateField(
                      "beneficiaryId",
                      value,
                    )
                  }
                />

                <Field
                  label="Amount in USD"
                  value={form.amountUsd}
                  placeholder="27500"
                  type="number"
                  onChange={(value) =>
                    updateField("amountUsd", value)
                  }
                />
              </div>

              <div style={styles.boundaryNotice}>
                <strong>
                  Demonstration boundary
                </strong>

                <p style={styles.boundaryParagraph}>
                  This creates a self-declared
                  vendor-payment demonstration route.
                  Supplier, invoice, bypass, replay,
                  duplicate-payment, execution, and outcome
                  observations may include labeled
                  demonstration fixtures. This is not
                  independent certification or legal
                  approval.
                </p>
              </div>

              <div style={styles.formActions}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    ...styles.primaryButton,
                    ...(submitting
                      ? styles.disabledButton
                      : {}),
                  }}
                >
                  {submitting
                    ? "Creating and signing route..."
                    : "Create Live TA-14 Route"}
                </button>

                <button
                  type="button"
                  onClick={clearForm}
                  style={styles.secondaryButton}
                >
                  Clear Manifest
                </button>
              </div>
            </form>

            <aside style={styles.sideColumn}>
              {!result && !error ? (
                <section style={styles.statusCard}>
                  <div style={styles.statusTop}>
                    <span style={styles.sectionLabel}>
                      ROUTE ENGINE
                    </span>

                    <span style={styles.readyBadge}>
                      READY
                    </span>
                  </div>

                  <h2 style={styles.statusTitle}>
                    Ready for submission.
                  </h2>

                  <p style={styles.statusText}>
                    The live vendor-payment engine will
                    generate a unique RID, commit the
                    payment declaration, evaluate the
                    route, sign the receipt, and preserve
                    version one.
                  </p>

                  <div style={styles.checkList}>
                    <Check label="Vendor-payment schema" />
                    <Check label="Deterministic evaluation" />
                    <Check label="Signed test receipt" />
                    <Check label="Preserved route version" />
                  </div>
                </section>
              ) : null}

              {error ? (
                <section style={styles.errorCard}>
                  <div style={styles.statusTop}>
                    <span style={styles.sectionLabel}>
                      SUBMISSION FAILURE
                    </span>

                    <span style={styles.errorBadge}>
                      ERROR
                    </span>
                  </div>

                  <h2 style={styles.statusTitle}>
                    The route was not created.
                  </h2>

                  <p style={styles.errorText}>
                    {error}
                  </p>

                  {correlationId ? (
                    <div style={styles.identityBlock}>
                      <span style={styles.identityLabel}>
                        CORRELATION ID
                      </span>

                      <code
                        style={styles.identityValue}
                      >
                        {correlationId}
                      </code>
                    </div>
                  ) : null}

                  <p style={styles.statusText}>
                    Correct the manifest or inspect the
                    corresponding Vercel Function log
                    before changing backend code.
                  </p>
                </section>
              ) : null}

              {result ? (
                <section style={styles.resultCard}>
                  <div style={styles.statusTop}>
                    <span style={styles.sectionLabel}>
                      SIGNED ROUTE RECEIPT
                    </span>

                    <span
                      style={{
                        ...styles.decisionBadge,
                        ...decisionColors[
                          result.decision
                        ],
                      }}
                    >
                      {result.decision}
                    </span>
                  </div>

                  <h2 style={styles.resultTitle}>
                    Route created and preserved.
                  </h2>

                  <div style={styles.identityBlock}>
                    <span style={styles.identityLabel}>
                      ROUTE IDENTITY
                    </span>

                    <code style={styles.ridValue}>
                      {result.rid}
                    </code>
                  </div>

                  <div style={styles.details}>
                    <Detail
                      label="Organization"
                      value={result.organizationName}
                    />

                    <Detail
                      label="System"
                      value={result.systemName}
                    />

                    <Detail
                      label="Version"
                      value={String(result.version)}
                    />

                    <Detail
                      label="Created"
                      value={result.createdAt}
                    />

                    <Detail
                      label="Correlation"
                      value={result.correlationId}
                    />
                  </div>

                  {result.decision === "HOLD" ? (
                    <div style={styles.holdNotice}>
                      <strong>
                        Expected initial result
                      </strong>

                      <p
                        style={
                          styles.boundaryParagraph
                        }
                      >
                        This vendor-payment route begins on
                        HOLD because dual authority and
                        beneficiary verification have not
                        yet been supplied. The original HOLD
                        must remain preserved when the route
                        is corrected.
                      </p>
                    </div>
                  ) : null}

                  <div style={styles.nextDestination}>
                    <span style={styles.sectionLabel}>NEXT DESTINATION</span>
                    <div style={styles.nextDestinationFlow}>
                      <span style={styles.nextDone}>✓ Route frozen</span>
                      <b>→</b>
                      <span style={styles.nextActive}>Artifact Studio</span>
                      <b>→</b>
                      <span>Artifact Registry</span>
                      <b>→</b>
                      <span>Verification</span>
                    </div>
                    <p style={styles.nextDestinationText}>The route receipt is not the execution artifact. Continue to the Artifact Studio to preserve execution evidence, outcome closure, integrity commitments, and the public claims boundary.</p>
                  </div>

                  <div style={styles.resultActions}>
                    <button type="button" onClick={openArtifactStudio} style={styles.primaryButton}>Open Artifact Studio →</button>
                    <Link
                      href="/workspace/routes"
                      style={styles.primaryLink}
                    >
                      Open Route Records
                    </Link>

                    <Link
                      href="/verify"
                      style={styles.secondaryLink}
                    >
                      Verify RID
                    </Link>
                  </div>
                </section>
              ) : null}

              <PrincipleCard />
            </aside>
          </section>
        )}

        {draft && !vendorPaymentCompatible ? (
          <section style={styles.principleSection}>
            <PrincipleCard />
          </section>
        ) : null}

        <section style={styles.helpSection}>
          <div style={styles.helpHeader}>
            <div>
              <span style={styles.sectionLabel}>INSTITUTIONAL HELP</span>
              <h2 style={styles.helpTitle}>The eight-stage language, in plain operational terms.</h2>
              <p style={styles.helpText}>Use this reference when a stage name is familiar but its role in governed execution is not yet clear.</p>
            </div>
            <Link href="/artifacts" style={styles.secondaryLink}>Inspect completed artifacts</Link>
          </div>
          <div style={styles.helpGrid}>
            {chain.map((stage) => (
              <article key={stage.key} style={styles.helpCard}>
                <span style={styles.helpNumber}>{stage.number}</span>
                <strong style={styles.helpCardTitle}>{stage.label}</strong>
                <p style={styles.helpCardText}>{STAGE_GUIDANCE[stage.key].why}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: "text" | "number";
  onChange: (value: string) => void;
}) {
  return (
    <label style={styles.field}>
      <span style={styles.fieldLabel}>
        {label}
      </span>

      <input
        required
        type={type}
        value={value}
        placeholder={placeholder}
        min={type === "number" ? "0.01" : undefined}
        step={type === "number" ? "0.01" : undefined}
        onChange={(event) =>
          onChange(event.target.value)
        }
        style={styles.input}
      />
    </label>
  );
}

function Check({ label }: { label: string }) {
  return (
    <div style={styles.checkItem}>
      <span style={styles.checkMark}>✓</span>
      <span>{label}</span>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={styles.detailRow}>
      <dt style={styles.detailLabel}>
        {label}
      </dt>

      <dd style={styles.detailValue}>
        {value}
      </dd>
    </div>
  );
}

function PreviewDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={styles.previewDetail}>
      <span style={styles.previewDetailLabel}>
        {label}
      </span>

      <span style={styles.previewDetailValue}>
        {value}
      </span>
    </div>
  );
}

function PrincipleCard() {
  return (
    <section style={styles.principleCard}>
      <span style={styles.sectionLabelLight}>
        GOVERNING PRINCIPLE
      </span>

      <strong style={styles.principle}>
        NO ADMISSIBLE EVIDENCE.
        <br />
        NO ADMISSIBLE EXECUTION.
      </strong>
    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f4f5f7",
    color: "#0b1020",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    padding: "17px clamp(20px, 5vw, 72px)",
    borderBottom: "1px solid #d9dde4",
    background: "rgba(244,245,247,0.96)",
    backdropFilter: "blur(16px)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#111827",
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
  brandSub: {
    display: "block",
    marginTop: 3,
    color: "#697386",
    fontSize: 11,
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 18,
  },
  navLink: {
    color: "#374151",
    fontSize: 14,
    fontWeight: 750,
    textDecoration: "none",
  },
  breadcrumbs: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    padding: "16px clamp(20px, 6vw, 92px)",
    borderBottom: "1px solid #e2e5ea",
    color: "#6b7280",
    fontSize: 13,
  },
  breadcrumbLink: {
    color: "#067a58",
    fontWeight: 800,
    textDecoration: "none",
  },
  hero: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    gap: 42,
    alignItems: "end",
    padding:
      "clamp(54px, 7vw, 92px) clamp(20px, 6vw, 92px)",
    background:
      "radial-gradient(circle at 84% 18%, rgba(110,231,183,0.25), transparent 30%), linear-gradient(180deg,#ffffff 0%,#f4f5f7 100%)",
  },
  eyebrow: {
    color: "#067a58",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.17em",
  },
  heroTitle: {
    maxWidth: 930,
    margin: "16px 0",
    fontSize: "clamp(42px, 6vw, 76px)",
    lineHeight: 0.98,
    letterSpacing: "-0.055em",
  },
  heroText: {
    maxWidth: 850,
    marginBottom: 0,
    color: "#5b6472",
    fontSize: "clamp(17px, 2vw, 21px)",
    lineHeight: 1.65,
  },
  routePreview: {
    padding: 26,
    border: "1px solid #d9dde4",
    borderRadius: 15,
    background: "#ffffff",
    boxShadow:
      "0 18px 55px rgba(15,23,42,0.07)",
  },
  previewLabel: {
    display: "block",
    color: "#6b7280",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.14em",
  },
  previewTitle: {
    display: "block",
    margin: "14px 0 18px",
    fontSize: 26,
    lineHeight: 1.1,
    letterSpacing: "-0.035em",
  },
  previewDetails: {
    display: "grid",
  },
  previewDetail: {
    display: "grid",
    gridTemplateColumns: "95px minmax(0, 1fr)",
    gap: 12,
    padding: "10px 0",
    borderTop: "1px solid #edf0f3",
  },
  previewDetailLabel: {
    color: "#7b8491",
    fontSize: 11,
    fontWeight: 750,
  },
  previewDetailValue: {
    color: "#17202e",
    fontSize: 11,
    textAlign: "right",
    overflowWrap: "anywhere",
  },
  chain: {
    display: "grid",
    gridTemplateColumns:
      "repeat(8, minmax(130px, 1fr))",
    overflowX: "auto",
    borderTop: "1px solid #d9dde4",
    borderBottom: "1px solid #d9dde4",
    background: "#ffffff",
  },
  chainItem: {
    display: "grid",
    gridTemplateColumns: "24px 1fr 24px",
    alignItems: "center",
    gap: 8,
    minWidth: 130,
    padding: "15px 18px",
    border: 0,
    borderRight: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#263140",
    fontSize: 13,
    fontWeight: 800,
    textAlign: "left",
    cursor: "pointer",
  },
  chainItemActive: {
    background: "#eaf8f2",
    color: "#075f47",
  },
  chainIndex: {
    color: "#067a58",
    fontSize: 9,
    fontWeight: 900,
  },
  chainState: {
    display: "grid",
    placeItems: "center",
    width: 21,
    height: 21,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 900,
  },
  chainComplete: {
    background: "#d1fae5",
    color: "#065f46",
  },
  chainUnknown: {
    background: "#edf0f3",
    color: "#8a93a2",
  },
  transferSection: {
    padding:
      "clamp(34px, 5vw, 66px) clamp(20px, 6vw, 92px)",
  },
  transferHeader: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 28,
    marginBottom: 24,
  },
  transferTitle: {
    margin: "9px 0 10px",
    fontSize: "clamp(30px, 4vw, 48px)",
    letterSpacing: "-0.045em",
  },
  transferIntro: {
    maxWidth: 740,
    marginBottom: 0,
    color: "#667085",
    fontSize: 15,
    lineHeight: 1.65,
  },
  transferActions: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 10,
  },
  clearDraftButton: {
    padding: "12px 16px",
    border: "1px solid #e4b8b8",
    borderRadius: 8,
    background: "#ffffff",
    color: "#9b2c2c",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },
  transferGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
    gap: 18,
    alignItems: "stretch",
  },
  transferChain: {
    display: "grid",
    alignContent: "start",
    gap: 7,
    padding: 18,
    border: "1px solid #d9dde4",
    borderRadius: 15,
    background: "#ffffff",
  },
  transferStage: {
    display: "grid",
    gridTemplateColumns: "34px 1fr 24px",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: 12,
    border: "1px solid transparent",
    borderRadius: 10,
    background: "#ffffff",
    color: "#4b5563",
    fontSize: 13,
    fontWeight: 800,
    textAlign: "left",
    cursor: "pointer",
  },
  transferStageActive: {
    borderColor: "#a9dbc9",
    background: "#eaf8f2",
    color: "#064e3b",
  },
  transferNumber: {
    color: "#07805d",
    fontSize: 10,
    fontWeight: 900,
  },
  transferCheck: {
    color: "#07805d",
    fontWeight: 900,
  },
  stageReview: {
    minWidth: 0,
    padding: "clamp(24px, 4vw, 40px)",
    border: "1px solid #d9dde4",
    borderRadius: 15,
    background: "#ffffff",
    boxShadow:
      "0 18px 55px rgba(15,23,42,0.05)",
  },
  stageReviewTop: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "flex-start",
  },
  stageReviewTitle: {
    margin: "8px 0 0",
    fontSize: "clamp(28px, 4vw, 45px)",
    letterSpacing: "-0.045em",
  },
  declaredBadge: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "#eef2f7",
    color: "#566171",
    fontSize: 10,
    fontWeight: 900,
  },
  stageValue: {
    minHeight: 145,
    margin: "34px 0 22px",
    color: "#17202e",
    fontSize: 19,
    lineHeight: 1.7,
    overflowWrap: "anywhere",
  },
  stageBoundary: {
    padding: 18,
    border: "1px solid #d8dce3",
    borderRadius: 11,
    background: "#f4f6f8",
    color: "#475569",
    fontSize: 13,
    lineHeight: 1.65,
  },
  boundaryParagraph: {
    marginBottom: 0,
    lineHeight: 1.65,
  },
  routeMetadata: {
    minWidth: 0,
    padding: 22,
    border: "1px solid #d9dde4",
    borderRadius: 15,
    background: "#ffffff",
  },
  metadataList: {
    marginTop: 12,
  },
  metadataRow: {
    display: "grid",
    gap: 5,
    padding: "13px 0",
    borderBottom: "1px solid #edf0f3",
  },
  metadataLabel: {
    color: "#7b8491",
    fontSize: 10,
    fontWeight: 850,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  metadataValue: {
    color: "#1f2937",
    fontSize: 12,
    overflowWrap: "anywhere",
  },
  adapterSection: {
    display: "grid",
    gap: 24,
    margin:
      "0 clamp(20px, 6vw, 92px) clamp(40px, 7vw, 90px)",
  },
  adapterHeader: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
    gap: 28,
    padding: "clamp(28px, 5vw, 50px)",
    border: "1px solid #8fd9bf",
    borderRadius: 18,
    background:
      "linear-gradient(135deg,#f5fffb 0%,#e8f8f1 100%)",
  },
  adapterBoundary: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
    gap: 28,
    margin:
      "0 clamp(20px, 6vw, 92px) clamp(40px, 7vw, 90px)",
    padding: "clamp(28px, 5vw, 50px)",
    border: "1px solid #dbc98b",
    borderRadius: 18,
    background:
      "linear-gradient(135deg,#fffdf4 0%,#fff8df 100%)",
  },
  adapterEyebrow: {
    color: "#067a58",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.15em",
  },
  adapterTitle: {
    maxWidth: 820,
    margin: "14px 0",
    fontSize: "clamp(29px, 4vw, 46px)",
    lineHeight: 1.04,
    letterSpacing: "-0.045em",
  },
  adapterText: {
    maxWidth: 820,
    marginBottom: 0,
    color: "#52675f",
    fontSize: 15,
    lineHeight: 1.75,
  },
  adapterState: {
    padding: 24,
    borderRadius: 14,
    background: "#111827",
    color: "#ffffff",
  },
  adapterStateLabel: {
    display: "block",
    color: "#a8b2c1",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.14em",
  },
  adapterStateValue: {
    display: "block",
    margin: "17px 0",
    color: "#69f0c1",
    fontSize: 19,
    lineHeight: 1.4,
  },
  adapterStateText: {
    marginBottom: 0,
    color: "#c4ccd8",
    fontSize: 13,
    lineHeight: 1.65,
  },
  workspaceGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
    gap: 24,
    alignItems: "start",
    padding:
      "clamp(34px, 5vw, 70px) clamp(20px, 6vw, 92px)",
  },
  formCard: {
    minWidth: 0,
    padding: "clamp(22px, 4vw, 38px)",
    border: "1px solid #d9dde4",
    borderRadius: 17,
    background: "#ffffff",
    boxShadow:
      "0 18px 55px rgba(15,23,42,0.05)",
  },
  formHeader: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "flex-start",
    marginBottom: 28,
  },
  sectionLabel: {
    color: "#697386",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.14em",
  },
  sectionLabelLight: {
    color: "#9aa8b9",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.14em",
  },
  formTitle: {
    margin: "8px 0 0",
    fontSize: "clamp(28px, 3vw, 42px)",
    letterSpacing: "-0.04em",
  },
  liveBadge: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "#d1fae5",
    color: "#065f46",
    fontSize: 10,
    fontWeight: 900,
  },
  mappingNotice: {
    marginBottom: 24,
    padding: 18,
    border: "1px solid #a7dbc8",
    borderRadius: 11,
    background: "#ecfdf5",
    color: "#075f47",
    fontSize: 13,
    lineHeight: 1.65,
  },
  fieldGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
    gap: 18,
  },
  field: {
    display: "grid",
    gap: 8,
    marginBottom: 18,
  },
  fieldLabel: {
    color: "#374151",
    fontSize: 13,
    fontWeight: 800,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: "1px solid #cfd5dd",
    borderRadius: 9,
    background: "#fbfcfd",
    color: "#111827",
    fontSize: 14,
    outline: "none",
  },
  boundaryNotice: {
    marginTop: 8,
    padding: 18,
    border: "1px solid #d8dce3",
    borderRadius: 11,
    background: "#eef2f7",
    color: "#475569",
    fontSize: 13,
  },
  formActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 22,
  },
  primaryButton: {
    padding: "14px 20px",
    border: 0,
    borderRadius: 9,
    background: "#111827",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 850,
    cursor: "pointer",
  },
  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  secondaryButton: {
    padding: "13px 20px",
    border: "1px solid #cbd1d9",
    borderRadius: 9,
    background: "#ffffff",
    color: "#111827",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
  sideColumn: {
    display: "grid",
    minWidth: 0,
    gap: 18,
  },
  statusCard: {
    padding: 24,
    border: "1px solid #d9dde4",
    borderRadius: 15,
    background: "#ffffff",
    boxShadow:
      "0 18px 55px rgba(15,23,42,0.05)",
  },
  resultCard: {
    padding: 24,
    border: "1px solid #93d8c1",
    borderRadius: 15,
    background: "#ffffff",
    boxShadow:
      "0 18px 55px rgba(6,122,88,0.09)",
  },
  errorCard: {
    padding: 24,
    border: "1px solid #fecaca",
    borderRadius: 15,
    background: "#ffffff",
    boxShadow:
      "0 18px 55px rgba(153,27,27,0.08)",
  },
  statusTop: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  readyBadge: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "#d1fae5",
    color: "#065f46",
    fontSize: 10,
    fontWeight: 900,
  },
  errorBadge: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: 10,
    fontWeight: 900,
  },
  decisionBadge: {
    padding: "7px 10px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 900,
  },
  statusTitle: {
    margin: "22px 0 10px",
    fontSize: 25,
    lineHeight: 1.15,
    letterSpacing: "-0.03em",
  },
  resultTitle: {
    margin: "22px 0 18px",
    fontSize: 28,
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
  },
  statusText: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 1.65,
  },
  errorText: {
    padding: 15,
    borderRadius: 9,
    background: "#fff1f2",
    color: "#991b1b",
    fontSize: 13,
    lineHeight: 1.6,
  },
  checkList: {
    display: "grid",
    gap: 11,
    marginTop: 20,
  },
  checkItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#4b5563",
    fontSize: 13,
    fontWeight: 700,
  },
  checkMark: {
    display: "grid",
    placeItems: "center",
    width: 22,
    height: 22,
    borderRadius: 999,
    background: "#d1fae5",
    color: "#065f46",
    fontSize: 12,
    fontWeight: 900,
  },
  identityBlock: {
    display: "grid",
    gap: 8,
    margin: "18px 0",
    padding: 16,
    borderRadius: 10,
    background: "#0b1020",
  },
  identityLabel: {
    color: "#93a4bc",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.14em",
  },
  identityValue: {
    color: "#ffffff",
    fontSize: 12,
    overflowWrap: "anywhere",
  },
  ridValue: {
    color: "#69f0c1",
    fontSize: 16,
    fontWeight: 800,
    overflowWrap: "anywhere",
  },
  details: {
    display: "grid",
    margin: "20px 0",
  },
  detailRow: {
    display: "grid",
    gridTemplateColumns:
      "120px minmax(0, 1fr)",
    gap: 12,
    padding: "11px 0",
    borderBottom: "1px solid #edf0f3",
  },
  detailLabel: {
    color: "#77808f",
    fontSize: 12,
    fontWeight: 750,
  },
  detailValue: {
    margin: 0,
    color: "#1f2937",
    fontSize: 12,
    fontWeight: 750,
    overflowWrap: "anywhere",
  },
  holdNotice: {
    padding: 16,
    border: "1px solid #f2d18a",
    borderRadius: 10,
    background: "#fffbeb",
    color: "#92400e",
    fontSize: 13,
  },
  resultActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },
  primaryLink: {
    display: "inline-flex",
    justifyContent: "center",
    padding: "13px 16px",
    borderRadius: 8,
    background: "#111827",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 850,
    textDecoration: "none",
  },
  secondaryLink: {
    display: "inline-flex",
    justifyContent: "center",
    padding: "12px 16px",
    border: "1px solid #cbd1d9",
    borderRadius: 8,
    background: "#ffffff",
    color: "#111827",
    fontSize: 13,
    fontWeight: 850,
    textDecoration: "none",
  },
  governanceDeck: {
    margin: "0 clamp(20px, 6vw, 92px) 34px",
    padding: "clamp(24px, 4vw, 44px)",
    border: "1px solid rgba(105,240,193,0.28)",
    borderRadius: 22,
    background:
      "radial-gradient(circle at 88% 8%, rgba(105,240,193,0.14), transparent 28%), linear-gradient(145deg, #07101f 0%, #0b1730 55%, #0b1020 100%)",
    boxShadow: "0 30px 90px rgba(4,12,26,0.24)",
    color: "#ffffff",
  },
  governanceDeckHeader: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 28,
  },
  governanceDeckTitle: {
    maxWidth: 850,
    margin: "10px 0 12px",
    fontSize: "clamp(25px, 3.6vw, 46px)",
    lineHeight: 1.05,
    letterSpacing: "-0.045em",
  },
  governanceDeckText: {
    maxWidth: 840,
    margin: 0,
    color: "#a9b8cc",
    fontSize: 15,
    lineHeight: 1.75,
  },
  governanceReadinessCard: {
    display: "grid",
    minWidth: 190,
    gap: 8,
    padding: 20,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    background: "rgba(255,255,255,0.055)",
    textAlign: "right",
  },
  governanceReadinessLabel: {
    color: "#8fa2bc",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.16em",
  },
  governanceReadinessValue: {
    color: "#69f0c1",
    fontSize: 38,
    lineHeight: 1,
    letterSpacing: "-0.05em",
  },
  governanceStatusBadge: {
    justifySelf: "end",
    padding: "6px 9px",
    borderRadius: 999,
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.1em",
  },
  governanceStatusRegistered: {
    background: "rgba(105,240,193,0.15)",
    color: "#69f0c1",
  },
  governanceStatusReview: {
    background: "rgba(251,191,36,0.15)",
    color: "#fbbf24",
  },
  governanceControlGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    marginTop: 30,
  },
  governanceField: {
    display: "grid",
    gap: 8,
  },
  governanceFieldLabel: {
    color: "#93a4bc",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  governanceSelect: {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid rgba(255,255,255,0.13)",
    borderRadius: 10,
    background: "#111d32",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 750,
    outline: "none",
  },
  governanceIdentityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14,
    marginTop: 18,
  },
  governanceIdentityCard: {
    display: "grid",
    gap: 8,
    minHeight: 132,
    padding: 18,
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14,
    background: "rgba(4,12,26,0.56)",
  },
  governanceIdentityLabel: {
    color: "#69f0c1",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.16em",
  },
  governanceIdentityValue: {
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 1.35,
  },
  governanceIdentityMeta: {
    alignSelf: "end",
    color: "#8fa2bc",
    fontSize: 12,
    lineHeight: 1.55,
  },
  governanceActionBar: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 22,
    marginTop: 22,
    paddingTop: 22,
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  governanceActionTitle: {
    display: "block",
    color: "#ffffff",
    fontSize: 17,
  },
  governanceActionText: {
    maxWidth: 780,
    margin: "7px 0 0",
    color: "#93a4bc",
    fontSize: 12,
    lineHeight: 1.6,
  },
  governanceActionButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  handoffMessage: {
    margin: "10px 0 0",
    color: "#69f0c1",
    fontSize: 12,
    fontWeight: 800,
  },
  lifecycle: {
    position: "sticky",
    top: 77,
    zIndex: 35,
    overflowX: "auto",
    borderBottom: "1px solid #d9dde4",
    background: "rgba(255,255,255,0.96)",
    backdropFilter: "blur(16px)",
  },
  lifecycleInner: {
    display: "flex",
    alignItems: "stretch",
    minWidth: 1120,
    padding: "10px clamp(20px, 5vw, 72px)",
  },
  lifecycleItemWrap: { display: "flex", alignItems: "center", flex: 1 },
  lifecycleNumber: { gridRow: "1 / 3", color: "#9ca3af", fontSize: 10, fontWeight: 900 },
  lifecycleItem: { display: "grid", gridTemplateColumns: "30px 1fr", gap: "2px 8px", minWidth: 125, padding: "9px 10px", border: "1px solid transparent", borderRadius: 10, color: "#6b7280", textDecoration: "none" },
  lifecycleArrow: { margin: "0 4px", color: "#aab2be" },
  lifecycleComplete: { color: "#075f47", background: "#f0fdf7" },
  lifecycleCurrent: { color: "#ffffff", borderColor: "#111827", background: "#111827", boxShadow: "0 8px 22px rgba(17,24,39,.18)" },
  lifecycleNext: { color: "#075f47", borderColor: "#8fd9bf", background: "#ecfdf5" },
  orientationGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, margin: "0 clamp(20px, 6vw, 92px) 34px" },
  orientationCard: { padding: 24, border: "1px solid #d9dde4", borderRadius: 15, background: "#ffffff", boxShadow: "0 14px 40px rgba(15,23,42,.04)" },
  orientationTitle: { margin: "10px 0", fontSize: 22, lineHeight: 1.2, letterSpacing: "-.03em" },
  orientationText: { margin: 0, color: "#667085", fontSize: 13, lineHeight: 1.7 },
  readinessSection: { margin: "0 clamp(20px, 6vw, 92px) 34px", padding: "clamp(24px, 4vw, 40px)", border: "1px solid #d9dde4", borderRadius: 20, background: "#ffffff" },
  readinessHeader: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 22, alignItems: "flex-start" },
  readinessTitle: { maxWidth: 820, margin: "10px 0", fontSize: "clamp(26px,3.6vw,44px)", lineHeight: 1.06, letterSpacing: "-.045em" },
  readinessText: { maxWidth: 820, margin: 0, color: "#667085", lineHeight: 1.7 },
  routeStatePill: { padding: "8px 12px", borderRadius: 999, fontSize: 10, fontWeight: 900, letterSpacing: ".1em" },
  routeStateReady: { background: "#d1fae5", color: "#065f46" },
  routeStateReview: { background: "#fef3c7", color: "#92400e" },
  readinessGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginTop: 26 },
  readinessCard: { minHeight: 150, padding: 18, border: "1px solid #e1e5ea", borderRadius: 13, background: "#f9fafb" },
  readinessCardTop: { display: "flex", justifyContent: "space-between", gap: 12 },
  readinessIndex: { color: "#067a58", fontSize: 10, fontWeight: 900 },
  conditionBadge: { padding: "5px 8px", borderRadius: 999, fontSize: 9, fontWeight: 900 },
  conditionPass: { background: "#d1fae5", color: "#065f46" },
  conditionBlocked: { background: "#fee2e2", color: "#991b1b" },
  conditionPending: { background: "#e5e7eb", color: "#4b5563" },
  conditionReview: { background: "#fef3c7", color: "#92400e" },
  readinessCardTitle: { display: "block", marginTop: 18, fontSize: 16 },
  readinessCardText: { margin: "8px 0 0", color: "#667085", fontSize: 12, lineHeight: 1.55 },
  stageGuidance: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginTop: 24 },
  stageGuidanceLabel: { display: "block", color: "#067a58", fontSize: 9, fontWeight: 900, letterSpacing: ".12em" },
  stageGuidanceText: { margin: "8px 0 0", color: "#52606d", fontSize: 13, lineHeight: 1.6 },
  consequenceSection: { margin: "0 clamp(20px, 6vw, 92px) 34px", padding: "clamp(24px,4vw,42px)", borderRadius: 22, background: "#0b1020", color: "#ffffff", boxShadow: "0 26px 70px rgba(11,16,32,.22)" },
  consequenceHeader: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 18, alignItems: "flex-start" },
  consequenceTitle: { maxWidth: 850, margin: "10px 0 0", fontSize: "clamp(28px,4vw,48px)", lineHeight: 1.04, letterSpacing: "-.045em" },
  classificationPill: { padding: "8px 11px", borderRadius: 999, background: "rgba(105,240,193,.12)", color: "#69f0c1", fontSize: 9, fontWeight: 900 },
  consequenceGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14, marginTop: 28 },
  consequenceAllow: { padding: 22, border: "1px solid rgba(105,240,193,.28)", borderRadius: 15, background: "rgba(105,240,193,.06)" },
  consequenceDeny: { padding: 22, border: "1px solid rgba(248,113,113,.28)", borderRadius: 15, background: "rgba(248,113,113,.06)" },
  consequenceEvidence: { padding: 22, border: "1px solid rgba(147,197,253,.28)", borderRadius: 15, background: "rgba(147,197,253,.06)" },
  consequenceLabel: { color: "#9fb0c7", fontSize: 9, fontWeight: 900, letterSpacing: ".14em" },
  consequenceStrong: { display: "block", margin: "13px 0", fontSize: 16, lineHeight: 1.5 },
  consequenceList: { margin: 0, paddingLeft: 18, color: "#b7c4d6", fontSize: 12, lineHeight: 1.75 },
  nextDestination: { marginTop: 20, padding: 18, border: "1px solid #a7dbc8", borderRadius: 11, background: "#ecfdf5" },
  nextDestinationFlow: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 12, color: "#6b7280", fontSize: 12, fontWeight: 800 },
  nextDone: { color: "#065f46" },
  nextActive: { padding: "6px 8px", borderRadius: 8, background: "#111827", color: "#ffffff" },
  nextDestinationText: { margin: "12px 0 0", color: "#52675f", fontSize: 12, lineHeight: 1.6 },
  helpSection: { margin: "0 clamp(20px, 6vw, 92px) clamp(50px,7vw,92px)", padding: "clamp(24px,4vw,42px)", border: "1px solid #d9dde4", borderRadius: 22, background: "#ffffff" },
  helpHeader: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 20, alignItems: "flex-start" },
  helpTitle: { maxWidth: 800, margin: "10px 0", fontSize: "clamp(28px,4vw,46px)", lineHeight: 1.05, letterSpacing: "-.045em" },
  helpText: { maxWidth: 820, margin: 0, color: "#667085", lineHeight: 1.7 },
  helpGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12, marginTop: 26 },
  helpCard: { minHeight: 190, padding: 19, border: "1px solid #e1e5ea", borderRadius: 13, background: "#f9fafb" },
  helpNumber: { color: "#067a58", fontSize: 10, fontWeight: 900 },
  helpCardTitle: { display: "block", marginTop: 16, fontSize: 18 },
  helpCardText: { margin: "10px 0 0", color: "#667085", fontSize: 12, lineHeight: 1.65 },
  principleSection: {
    padding:
      "0 clamp(20px, 6vw, 92px) clamp(40px, 7vw, 90px)",
  },
  principleCard: {
    padding: 24,
    borderRadius: 15,
    background: "#0b1020",
    color: "#ffffff",
  },
  principle: {
    display: "block",
    marginTop: 16,
    color: "#69f0c1",
    fontSize: 18,
    lineHeight: 1.45,
    letterSpacing: "0.02em",
  },
};
