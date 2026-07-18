"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

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

const chain = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

const decisionColors: Record<Decision, { background: string; color: string }> = {
  ALLOW: { background: "#d1fae5", color: "#065f46" },
  HOLD: { background: "#fef3c7", color: "#92400e" },
  DENY: { background: "#fee2e2", color: "#991b1b" },
  ESCALATE: { background: "#ede9fe", color: "#5b21b6" },
};

export default function NewRoutePage() {
  const [form, setForm] = useState<RouteForm>(initialForm);
  const [result, setResult] = useState<CreatedRoute | null>(null);
  const [error, setError] = useState("");
  const [correlationId, setCorrelationId] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  function updateField(field: keyof RouteForm, value: string) {
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

  async function submitRoute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setResult(null);
    setError("");
    setCorrelationId("");

    try {
      const amountUsd = Number(form.amountUsd);

      if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
        throw new Error("Enter a valid payment amount greater than zero.");
      }

      const response = await fetch("/api/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationName: form.organizationName.trim(),
          systemName: form.systemName.trim(),
          actorId: form.actorId.trim(),
          supplierId: form.supplierId.trim(),
          invoiceId: form.invoiceId.trim(),
          beneficiaryId: form.beneficiaryId.trim(),
          amountUsd,
        }),
      });

      const payload = (await response.json()) as CreatedRoute | ApiError;

      if (!response.ok) {
        const failure = payload as ApiError;
        setCorrelationId(failure.correlationId ?? "");
        throw new Error(failure.error ?? "The route could not be created.");
      }

      const createdRoute = payload as CreatedRoute;

      setResult(createdRoute);
      setCorrelationId(createdRoute.correlationId ?? "");
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

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/workspace" style={styles.brand}>
          <span style={styles.brandMark}>14</span>

          <span>
            <strong style={styles.brandTitle}>TA-14 EXCHANGE PLATFORM</strong>
            <span style={styles.brandSub}>Route Construction Workspace</span>
          </span>
        </Link>

        <nav style={styles.nav}>
          <Link href="/workspace" style={styles.navLink}>
            Workspace
          </Link>

          <Link href="/workspace/records" style={styles.navLink}>
            Records
          </Link>

          <Link href="/workspace/verify" style={styles.navLink}>
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

      <section style={styles.breadcrumbs}>
        <Link href="/workspace" style={styles.breadcrumbLink}>
          Workspace
        </Link>

        <span>›</span>
        <span>Routes</span>
        <span>›</span>
        <strong>New Route</strong>
      </section>

      <section style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>NEW CONSEQUENTIAL ROUTE</div>

          <h1 style={styles.heroTitle}>
            Build the route before consequence occurs.
          </h1>

          <p style={styles.heroText}>
            Declare the organization, system, actor, supplier, invoice,
            beneficiary, and proposed payment. The route will be submitted to
            the live TA-14 evaluation engine and preserved under a unique RID.
          </p>
        </div>

        <aside style={styles.routePreview}>
          <span style={styles.previewLabel}>PROPOSED TRANSACTION</span>
          <strong style={styles.previewAmount}>{formattedAmount}</strong>
          <span style={styles.previewMeta}>
            Vendor payment route · Production API
          </span>
        </aside>
      </section>

      <section style={styles.chain}>
        {chain.map((item, index) => (
          <div key={item} style={styles.chainItem}>
            <span style={styles.chainIndex}>
              {String(index + 1).padStart(2, "0")}
            </span>

            <span>{item}</span>
          </div>
        ))}
      </section>

      <section style={styles.workspaceGrid}>
        <form onSubmit={submitRoute} style={styles.formCard}>
          <div style={styles.formHeader}>
            <div>
              <span style={styles.sectionLabel}>ROUTE MANIFEST</span>
              <h2 style={styles.formTitle}>Define the proposed execution.</h2>
            </div>

            <span style={styles.liveBadge}>LIVE API</span>
          </div>

          <div style={styles.fieldGrid}>
            <Field
              label="Organization name"
              value={form.organizationName}
              placeholder="Example Governance Organization"
              onChange={(value) => updateField("organizationName", value)}
            />

            <Field
              label="System name"
              value={form.systemName}
              placeholder="Vendor Payment Engine"
              onChange={(value) => updateField("systemName", value)}
            />

            <Field
              label="Actor ID"
              value={form.actorId}
              placeholder="ACTOR-001"
              onChange={(value) => updateField("actorId", value)}
            />

            <Field
              label="Supplier ID"
              value={form.supplierId}
              placeholder="SUPPLIER-001"
              onChange={(value) => updateField("supplierId", value)}
            />

            <Field
              label="Invoice ID"
              value={form.invoiceId}
              placeholder="INVOICE-001"
              onChange={(value) => updateField("invoiceId", value)}
            />

            <Field
              label="Beneficiary ID"
              value={form.beneficiaryId}
              placeholder="BENEFICIARY-001"
              onChange={(value) => updateField("beneficiaryId", value)}
            />
          </div>

          <Field
            label="Payment amount in USD"
            value={form.amountUsd}
            placeholder="27500"
            type="number"
            onChange={(value) => updateField("amountUsd", value)}
          />

          <div style={styles.boundaryNotice}>
            <strong>Demonstration boundary</strong>

            <p style={styles.boundaryText}>
              This creates a self-declared demonstration route. Supplier,
              invoice, bypass, replay, duplicate-payment, execution, and
              outcome observations may include labeled demonstration fixtures.
              This is not independent certification or legal approval.
            </p>
          </div>

          <div style={styles.formActions}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.primaryButton,
                opacity: submitting ? 0.65 : 1,
                cursor: submitting ? "wait" : "pointer",
              }}
            >
              {submitting
                ? "Creating and signing route..."
                : "Create Live TA-14 Route"}
            </button>

            <button
              type="button"
              onClick={clearForm}
              disabled={submitting}
              style={styles.secondaryButton}
            >
              Clear Manifest
            </button>
          </div>
        </form>

        <aside style={styles.sideColumn}>
          {!result && !error && (
            <section style={styles.statusCard}>
              <div style={styles.statusTop}>
                <span style={styles.sectionLabel}>ROUTE ENGINE</span>
                <span style={styles.readyBadge}>READY</span>
              </div>

              <h2 style={styles.statusTitle}>Ready for submission.</h2>

              <p style={styles.statusText}>
                The live engine will generate a unique RID, commit the payment
                declaration, evaluate the route, sign the receipt, and preserve
                version one.
              </p>

              <div style={styles.checkList}>
                <Check label="Unique route identity" />
                <Check label="Deterministic evaluation" />
                <Check label="Signed test receipt" />
                <Check label="Versioned persistence" />
                <Check label="Correlation identifier" />
              </div>
            </section>
          )}

          {error && (
            <section style={styles.errorCard}>
              <div style={styles.statusTop}>
                <span style={styles.sectionLabel}>SUBMISSION FAILURE</span>
                <span style={styles.errorBadge}>ERROR</span>
              </div>

              <h2 style={styles.statusTitle}>The route was not created.</h2>

              <p style={styles.errorText}>{error}</p>

              {correlationId && (
                <div style={styles.identityBlock}>
                  <span style={styles.identityLabel}>CORRELATION ID</span>
                  <code style={styles.identityValue}>{correlationId}</code>
                </div>
              )}

              <p style={styles.statusText}>
                Correct the manifest or inspect the corresponding Vercel
                Function log before changing backend code.
              </p>
            </section>
          )}

          {result && (
            <section style={styles.resultCard}>
              <div style={styles.statusTop}>
                <span style={styles.sectionLabel}>
                  SIGNED ROUTE RECEIPT
                </span>

                <span
                  style={{
                    ...styles.decisionBadge,
                    ...decisionColors[result.decision],
                  }}
                >
                  {result.decision}
                </span>
              </div>

              <h2 style={styles.resultTitle}>
                Route created and preserved.
              </h2>

              <div style={styles.identityBlock}>
                <span style={styles.identityLabel}>ROUTE IDENTITY</span>
                <code style={styles.ridValue}>{result.rid}</code>
              </div>

              <dl style={styles.details}>
                <Detail label="Organization" value={result.organizationName} />
                <Detail label="System" value={result.systemName} />
                <Detail label="Route version" value={String(result.version)} />
                <Detail
                  label="Created"
                  value={new Date(result.createdAt).toLocaleString()}
                />
                <Detail
                  label="Correlation ID"
                  value={result.correlationId}
                />
              </dl>

              {result.decision === "HOLD" && (
                <div style={styles.holdNotice}>
                  <strong>Expected initial result</strong>

                  <p style={styles.boundaryText}>
                    This vendor-payment route begins on HOLD because dual
                    authority and beneficiary verification have not yet been
                    supplied. The original HOLD must remain preserved when the
                    route is corrected.
                  </p>
                </div>
              )}

              <div style={styles.resultActions}>
                <Link
                  href={`/workspace/records?rid=${encodeURIComponent(
                    result.rid,
                  )}`}
                  style={styles.primaryLink}
                >
                  Open Route Records
                </Link>

                <Link
                  href={`/workspace/verify?rid=${encodeURIComponent(
                    result.rid,
                  )}`}
                  style={styles.secondaryLink}
                >
                  Verify RID
                </Link>
              </div>
            </section>
          )}

          <section style={styles.principleCard}>
            <span style={styles.sectionLabel}>GOVERNING PRINCIPLE</span>

            <strong style={styles.principle}>
              NO ADMISSIBLE EVIDENCE.
              <br />
              NO ADMISSIBLE EXECUTION.
            </strong>
          </section>
        </aside>
      </section>
    </main>
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
      <span style={styles.fieldLabel}>{label}</span>

      <input
        required
        type={type}
        min={type === "number" ? "0.01" : undefined}
        step={type === "number" ? "0.01" : undefined}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.detailRow}>
      <dt style={styles.detailLabel}>{label}</dt>
      <dd style={styles.detailValue}>{value}</dd>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
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
    gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.4fr)",
    gap: 42,
    alignItems: "end",
    padding: "clamp(54px, 7vw, 92px) clamp(20px, 6vw, 92px)",
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
    maxWidth: 880,
    margin: "16px 0",
    fontSize: "clamp(42px, 6vw, 76px)",
    lineHeight: 0.98,
    letterSpacing: "-0.055em",
  },

  heroText: {
    maxWidth: 840,
    color: "#5b6472",
    fontSize: "clamp(17px, 2vw, 21px)",
    lineHeight: 1.65,
  },

  routePreview: {
    padding: 26,
    border: "1px solid #d9dde4",
    borderRadius: 15,
    background: "#ffffff",
    boxShadow: "0 18px 55px rgba(15,23,42,0.07)",
  },

  previewLabel: {
    display: "block",
    color: "#6b7280",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.14em",
  },

  previewAmount: {
    display: "block",
    margin: "13px 0 8px",
    fontSize: 28,
    letterSpacing: "-0.03em",
  },

  previewMeta: {
    color: "#8a93a2",
    fontSize: 12,
  },

  chain: {
    display: "grid",
    gridTemplateColumns: "repeat(8, minmax(130px, 1fr))",
    overflowX: "auto",
    borderTop: "1px solid #d9dde4",
    borderBottom: "1px solid #d9dde4",
    background: "#ffffff",
  },

  chainItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 130,
    padding: "15px 18px",
    borderRight: "1px solid #e5e7eb",
    fontSize: 13,
    fontWeight: 800,
  },

  chainIndex: {
    color: "#067a58",
    fontSize: 9,
    fontWeight: 900,
  },

  workspaceGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.65fr)",
    gap: 24,
    alignItems: "start",
    padding: "clamp(34px, 5vw, 70px) clamp(20px, 6vw, 92px)",
  },

  formCard: {
    padding: "clamp(22px, 4vw, 38px)",
    border: "1px solid #d9dde4",
    borderRadius: 17,
    background: "#ffffff",
    boxShadow: "0 18px 55px rgba(15,23,42,0.05)",
  },

  formHeader: {
    display: "flex",
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

  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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

  boundaryText: {
    marginBottom: 0,
    color: "#5b6472",
    fontSize: 13,
    lineHeight: 1.65,
  },

  formActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 22,
  },

  primaryButton: {
    border: 0,
    borderRadius: 9,
    background: "#111827",
    color: "#ffffff",
    padding: "14px 20px",
    fontSize: 14,
    fontWeight: 850,
  },

  secondaryButton: {
    border: "1px solid #cbd1d9",
    borderRadius: 9,
    background: "#ffffff",
    color: "#111827",
    padding: "13px 20px",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },

  sideColumn: {
    display: "grid",
    gap: 18,
  },

  statusCard: {
    padding: 24,
    border: "1px solid #d9dde4",
    borderRadius: 15,
    background: "#ffffff",
    boxShadow: "0 18px 55px rgba(15,23,42,0.05)",
  },

  resultCard: {
    padding: 24,
    border: "1px solid #93d8c1",
    borderRadius: 15,
    background: "#ffffff",
    boxShadow: "0 18px 55px rgba(6,122,88,0.09)",
  },

  errorCard: {
    padding: 24,
    border: "1px solid #fecaca",
    borderRadius: 15,
    background: "#ffffff",
    boxShadow: "0 18px 55px rgba(153,27,27,0.08)",
  },

  statusTop: {
    display: "flex",
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
    gap: 0,
    margin: "20px 0",
  },

  detailRow: {
    display: "grid",
    gridTemplateColumns: "120px minmax(0, 1fr)",
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
    color: "#111827",
    fontSize: 13,
    fontWeight: 850,
    textDecoration: "none",
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
