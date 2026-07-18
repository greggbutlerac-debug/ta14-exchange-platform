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

type ApiError = {
  error?: string;
  correlationId?: string;
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
              Route Construction Workspace
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

      <main>
        <section style={styles.hero}>
          <div>
            <span style={styles.eyebrow}>
              {draft
                ? "TRANSFERRED GOVERNANCE ROUTE"
                : "NEW CONSEQUENTIAL ROUTE"}
            </span>

            <h1 style={styles.heroTitle}>
              Review the route before consequence occurs.
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

                  <div style={styles.resultActions}>
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
