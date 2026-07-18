"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Decision = "NOT_EVALUATED" | "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

type RouteForm = {
  routeName: string;
  consequenceType: string;
  actor: string;
  organization: string;
  target: string;
  purpose: string;
  authoritySource: string;
  evidenceSummary: string;
  destination: string;
  expectedOutcome: string;
};

const initialForm: RouteForm = {
  routeName: "",
  consequenceType: "",
  actor: "",
  organization: "",
  target: "",
  purpose: "",
  authoritySource: "",
  evidenceSummary: "",
  destination: "",
  expectedOutcome: "",
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

export default function NewRoutePage() {
  const [form, setForm] = useState<RouteForm>(initialForm);
  const [decision, setDecision] = useState<Decision>("NOT_EVALUATED");
  const [submitted, setSubmitted] = useState(false);

  const missing = useMemo(() => {
    const required: Array<[keyof RouteForm, string]> = [
      ["routeName", "Route name"],
      ["consequenceType", "Consequence type"],
      ["actor", "Actor identity"],
      ["organization", "Organization"],
      ["target", "Target"],
      ["purpose", "Purpose"],
      ["authoritySource", "Authority source"],
      ["evidenceSummary", "Evidence summary"],
      ["destination", "Execution destination"],
      ["expectedOutcome", "Expected outcome"],
    ];

    return required
      .filter(([key]) => !form[key].trim())
      .map(([, label]) => label);
  }, [form]);

  const routeId = useMemo(() => {
    const base = form.routeName
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 18);

    return `TA14-RID-${base || "DRAFT"}-${String(
      Math.abs(
        [...(form.routeName || "draft")].reduce(
          (sum, char) => sum + char.charCodeAt(0),
          0
        )
      ) % 10000
    ).padStart(4, "0")}`;
  }, [form.routeName]);

  function updateField(key: keyof RouteForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setDecision("NOT_EVALUATED");
    setSubmitted(false);
  }

  function runEvaluation() {
    setSubmitted(true);

    if (missing.length > 0) {
      setDecision("HOLD");
      return;
    }

    if (
      form.authoritySource.toLowerCase().includes("unknown") ||
      form.authoritySource.toLowerCase().includes("none")
    ) {
      setDecision("DENY");
      return;
    }

    if (
      form.evidenceSummary.toLowerCase().includes("conflict") ||
      form.evidenceSummary.toLowerCase().includes("dispute")
    ) {
      setDecision("ESCALATE");
      return;
    }

    setDecision("ALLOW");
  }

  const decisionStyles: Record<Decision, React.CSSProperties> = {
    NOT_EVALUATED: { background: "#eef2f7", color: "#475569" },
    ALLOW: { background: "#d1fae5", color: "#065f46" },
    HOLD: { background: "#fef3c7", color: "#92400e" },
    DENY: { background: "#fee2e2", color: "#991b1b" },
    ESCALATE: { background: "#ede9fe", color: "#5b21b6" },
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.brand}>
          <span style={styles.brandMark}>14</span>
          <span>
            <strong style={styles.brandTitle}>TA-14 EXCHANGE PLATFORM</strong>
            <small style={styles.brandSub}>Route Construction Workspace</small>
          </span>
        </Link>

        <nav style={styles.nav}>
          <Link href="/workspace" style={styles.navLink}>Workspace</Link>
          <Link href="/workspace/routes" style={styles.navLink}>Routes</Link>
          <Link href="/verify" style={styles.navLink}>Verification</Link>
          <Link href="/registry" style={styles.navLink}>Registry</Link>
          <Link href="/" style={styles.navLink}>Public Site</Link>
        </nav>
      </header>

      <div style={styles.breadcrumbs}>
        <Link href="/workspace" style={styles.breadcrumbLink}>Workspace</Link>
        <span>›</span>
        <Link href="/workspace/routes" style={styles.breadcrumbLink}>Routes</Link>
        <span>›</span>
        <strong>New Route</strong>
      </div>

      <section style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>NEW CONSEQUENTIAL ROUTE</div>
          <h1 style={styles.heroTitle}>Build the route before consequence occurs.</h1>
          <p style={styles.heroText}>
            Declare the actor, authority, evidence, target, destination, and expected outcome.
            TA-14 evaluates the route itself—not the confidence of the operator or the appearance
            of a dashboard.
          </p>
        </div>

        <aside style={styles.routeIdentity}>
          <span style={styles.identityLabel}>DRAFT ROUTE IDENTITY</span>
          <strong style={styles.identityValue}>{routeId}</strong>
          <span style={styles.identityMeta}>Self-declared preview · Not yet preserved</span>
        </aside>
      </section>

      <section style={styles.chainSection}>
        {chain.map((item, index) => (
          <div key={item} style={styles.chainItem}>
            <span style={styles.chainIndex}>{String(index + 1).padStart(2, "0")}</span>
            <span>{item}</span>
          </div>
        ))}
      </section>

      <section style={styles.workspaceGrid}>
        <form
          style={styles.formCard}
          onSubmit={(event) => {
            event.preventDefault();
            runEvaluation();
          }}
        >
          <div style={styles.formHeader}>
            <div>
              <div style={styles.eyebrow}>ROUTE MANIFEST</div>
              <h2 style={styles.formTitle}>Define the proposed execution.</h2>
            </div>
            <span style={styles.draftBadge}>DRAFT</span>
          </div>

          <div style={styles.fieldGrid}>
            <Field
              label="Route name"
              placeholder="Vendor payment above USD 25,000"
              value={form.routeName}
              onChange={(value) => updateField("routeName", value)}
            />
            <Field
              label="Consequence type"
              placeholder="Financial transfer"
              value={form.consequenceType}
              onChange={(value) => updateField("consequenceType", value)}
            />
            <Field
              label="Actor identity"
              placeholder="Procurement Agent v4.2"
              value={form.actor}
              onChange={(value) => updateField("actor", value)}
            />
            <Field
              label="Organization"
              placeholder="Northstar Procurement Group"
              value={form.organization}
              onChange={(value) => updateField("organization", value)}
            />
            <Field
              label="Target"
              placeholder="Apex Industrial Supply"
              value={form.target}
              onChange={(value) => updateField("target", value)}
            />
            <Field
              label="Purpose"
              placeholder="Settle approved invoice INV-2026-0716"
              value={form.purpose}
              onChange={(value) => updateField("purpose", value)}
            />
            <Field
              label="Authority source"
              placeholder="Procurement approval PA-4471 + finance approval FA-9082"
              value={form.authoritySource}
              onChange={(value) => updateField("authoritySource", value)}
            />
            <Field
              label="Execution destination"
              placeholder="Verified beneficiary account ending 8841"
              value={form.destination}
              onChange={(value) => updateField("destination", value)}
            />
          </div>

          <TextAreaField
            label="Evidence summary"
            placeholder="Describe the records, provenance, freshness, integrity checks, and dependencies supporting this route."
            value={form.evidenceSummary}
            onChange={(value) => updateField("evidenceSummary", value)}
          />

          <TextAreaField
            label="Expected outcome"
            placeholder="Describe what should happen if the route is admissible and what evidence should exist afterward."
            value={form.expectedOutcome}
            onChange={(value) => updateField("expectedOutcome", value)}
          />

          <div style={styles.formActions}>
            <button type="submit" style={styles.primaryButton}>
              Run TA-14 Evaluation
            </button>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => {
                setForm(initialForm);
                setDecision("NOT_EVALUATED");
                setSubmitted(false);
              }}
            >
              Clear Draft
            </button>
          </div>
        </form>

        <aside style={styles.sideColumn}>
          <section style={styles.decisionCard}>
            <div style={styles.decisionTop}>
              <span style={styles.identityLabel}>DECISION RECEIPT PREVIEW</span>
              <span style={{ ...styles.decisionBadge, ...decisionStyles[decision] }}>
                {decision.replace("_", " ")}
              </span>
            </div>

            <h2 style={styles.decisionTitle}>
              {decision === "NOT_EVALUATED" && "Ready for route evaluation."}
              {decision === "ALLOW" && "The declared route is ready to proceed."}
              {decision === "HOLD" && "The route is incomplete and cannot proceed."}
              {decision === "DENY" && "The declared authority is not admissible."}
              {decision === "ESCALATE" && "The evidence requires independent review."}
            </h2>

            <p style={styles.decisionText}>
              {decision === "NOT_EVALUATED" &&
                "Complete the route manifest and run the engine to receive an exact route-level result."}
              {decision === "ALLOW" &&
                "All required manifest fields are present. This demonstration result does not independently verify the truth of the submitted evidence."}
              {decision === "HOLD" &&
                "Missing dependencies must be corrected before the route may be evaluated again."}
              {decision === "DENY" &&
                "A route cannot derive execution authority from an unknown or absent source."}
              {decision === "ESCALATE" &&
                "Conflicting or disputed evidence cannot be silently resolved by the execution system."}
            </p>

            {submitted && missing.length > 0 && (
              <div style={styles.findingBox}>
                <strong style={styles.findingTitle}>Exact HOLD reasons</strong>
                <ul style={styles.findingList}>
                  {missing.map((item) => (
                    <li key={item}>{item} is required.</li>
                  ))}
                </ul>
              </div>
            )}

            {decision === "ALLOW" && (
              <div style={styles.successActions}>
                <Link href={`/workspace/routes/${routeId}`} style={styles.primaryButtonLink}>
                  Open Route Record
                </Link>
                <Link href="/pricing" style={styles.secondaryButtonLink}>
                  Preserve for $9
                </Link>
              </div>
            )}

            {(decision === "HOLD" || decision === "DENY" || decision === "ESCALATE") && (
              <div style={styles.successActions}>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 280, behavior: "smooth" })}
                  style={styles.primaryButton}
                >
                  Correct Route
                </button>
                <Link href="/contact" style={styles.secondaryButtonLink}>
                  Request Review
                </Link>
              </div>
            )}
          </section>

          <section style={styles.guidanceCard}>
            <div style={styles.eyebrow}>WHAT TA-14 CHECKS</div>
            <ul style={styles.guidanceList}>
              <li>Who or what is acting</li>
              <li>Which authority permits the action</li>
              <li>What evidence supports the route</li>
              <li>Whether evidence remains continuous and current</li>
              <li>Who or what is bound to the consequence</li>
              <li>Where execution will occur</li>
              <li>What outcome must be recorded afterward</li>
            </ul>
            <Link href="/architecture" style={styles.textLink}>
              Read the governing architecture →
            </Link>
          </section>

          <section style={styles.boundaryCard}>
            <div style={styles.boundaryLabel}>BOUNDARY NOTICE</div>
            <p style={styles.boundaryText}>
              This page creates a self-declared demonstration route. A completed form does not
              prove that the submitted evidence is true, independently verified, or legally sufficient.
            </p>
          </section>
        </aside>
      </section>

      <section style={styles.cta}>
        <div>
          <div style={styles.ctaEyebrow}>NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</div>
          <h2 style={styles.ctaTitle}>Need to test an existing governance architecture?</h2>
          <p style={styles.ctaText}>
            Bring your policy engine, agent system, evidence framework, review layer, or runtime
            control into the TA-14 Exchange and test it against one preserved route.
          </p>
        </div>
        <div style={styles.ctaActions}>
          <Link href="/ecosystem" style={styles.lightButton}>Connect Architecture</Link>
          <Link href="/contact" style={styles.outlineButton}>Request Governance Review</Link>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </label>
  );
}

function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        style={styles.textarea}
      />
    </label>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f4f5f7",
    color: "#111827",
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
    padding: "18px clamp(22px, 5vw, 72px)",
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
    borderRadius: 8,
    background: "#111827",
    color: "#fff",
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
    fontWeight: 700,
    textDecoration: "none",
  },
  breadcrumbs: {
    display: "flex",
    gap: 10,
    padding: "18px clamp(22px, 6vw, 92px)",
    borderBottom: "1px solid #e2e5ea",
    color: "#6b7280",
    fontSize: 13,
  },
  breadcrumbLink: {
    color: "#067a58",
    textDecoration: "none",
    fontWeight: 750,
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.45fr)",
    gap: 40,
    alignItems: "end",
    padding: "clamp(54px, 7vw, 92px) clamp(22px, 6vw, 92px)",
    background:
      "radial-gradient(circle at 84% 16%, rgba(110,231,183,0.2), transparent 30%), linear-gradient(180deg,#fff 0%,#f4f5f7 100%)",
  },
  eyebrow: {
    color: "#067a58",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.17em",
  },
  heroTitle: {
    maxWidth: 850,
    margin: "16px 0",
    fontSize: "clamp(42px, 6vw, 76px)",
    lineHeight: 1,
    letterSpacing: "-0.055em",
  },
  heroText: {
    maxWidth: 820,
    color: "#5b6472",
    fontSize: "clamp(17px, 2vw, 21px)",
    lineHeight: 1.65,
  },
  routeIdentity: {
    padding: 24,
    border: "1px solid #d9dde4",
    borderRadius: 14,
    background: "#fff",
    boxShadow: "0 18px 55px rgba(15,23,42,0.07)",
  },
  identityLabel: {
    display: "block",
    color: "#6b7280",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.14em",
  },
  identityValue: {
    display: "block",
    margin: "12px 0 8px",
    color: "#111827",
    fontSize: 18,
    wordBreak: "break-word",
  },
  identityMeta: {
    color: "#8a93a2",
    fontSize: 12,
  },
  chainSection: {
    display: "grid",
    gridTemplateColumns: "repeat(8, minmax(110px, 1fr))",
    overflowX: "auto",
    borderTop: "1px solid #d9dde4",
    borderBottom: "1px solid #d9dde4",
    background: "#fff",
  },
  chainItem: {
    display: "flex",
    gap: 8,
    alignItems: "center",
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
    padding: "clamp(34px, 5vw, 70px) clamp(22px, 6vw, 92px)",
  },
  formCard: {
    padding: "clamp(22px, 4vw, 38px)",
    border: "1px solid #d9dde4",
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 18px 55px rgba(15,23,42,0.05)",
  },
  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "start",
    marginBottom: 28,
  },
  formTitle: {
    margin: "8px 0 0",
    fontSize: "clamp(28px, 3vw, 42px)",
    letterSpacing: "-0.04em",
  },
  draftBadge: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "#eef2f7",
    color: "#475569",
    fontSize: 10,
    fontWeight: 900,
  },
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    padding: "13px 14px",
    border: "1px solid #cfd5dd",
    borderRadius: 9,
    background: "#fbfcfd",
    color: "#111827",
    fontFamily: "inherit",
    fontSize: 14,
    lineHeight: 1.55,
    outline: "none",
  },
  formActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    border: 0,
    borderRadius: 9,
    background: "#111827",
    color: "#fff",
    padding: "14px 20px",
    fontSize: 14,
    fontWeight: 850,
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid #cbd1d9",
    borderRadius: 9,
    background: "#fff",
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
  decisionCard: {
    padding: 24,
    border: "1px solid #d9dde4",
    borderRadius: 15,
    background: "#fff",
    boxShadow: "0 18px 55px rgba(15,23,42,0.05)",
  },
  decisionTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "center",
  },
  decisionBadge: {
    padding: "7px 10px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 900,
  },
  decisionTitle: {
    margin: "22px 0 10px",
    fontSize: 25,
    lineHeight: 1.15,
    letterSpacing: "-0.03em",
  },
  decisionText: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 1.65,
  },
  findingBox: {
    marginTop: 18,
    padding: 16,
    border: "1px solid #f2d18a",
    borderRadius: 10,
    background: "#fffbeb",
  },
  findingTitle: {
    color: "#92400e",
    fontSize: 13,
  },
  findingList: {
    marginBottom: 0,
    paddingLeft: 18,
    color: "#92400e",
    fontSize: 13,
    lineHeight: 1.6,
  },
  successActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },
  primaryButtonLink: {
    display: "inline-flex",
    justifyContent: "center",
    padding: "13px 16px",
    borderRadius: 8,
    background: "#111827",
    color: "#fff",
    fontSize: 13,
    fontWeight: 850,
    textDecoration: "none",
  },
  secondaryButtonLink: {
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
  guidanceCard: {
    padding: 24,
    border: "1px solid #d9dde4",
    borderRadius: 15,
    background: "#fff",
  },
  guidanceList: {
    display: "grid",
    gap: 10,
    paddingLeft: 18,
    color: "#4b5563",
    fontSize: 14,
    lineHeight: 1.5,
  },
  textLink: {
    color: "#067a58",
    fontSize: 13,
    fontWeight: 850,
    textDecoration: "none",
  },
  boundaryCard: {
    padding: 22,
    border: "1px solid #d8dce3",
    borderRadius: 14,
    background: "#eef2f7",
  },
  boundaryLabel: {
    color: "#475569",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.14em",
  },
  boundaryText: {
    marginBottom: 0,
    color: "#5b6472",
    fontSize: 13,
    lineHeight: 1.6,
  },
  cta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 30,
    padding: "clamp(50px, 7vw, 84px) clamp(22px, 6vw, 92px)",
    background: "#067a58",
    color: "#fff",
  },
  ctaEyebrow: {
    color: "#bbf7d0",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.16em",
  },
  ctaTitle: {
    maxWidth: 800,
    margin: "12px 0",
    fontSize: "clamp(32px, 4vw, 54px)",
    lineHeight: 1.06,
    letterSpacing: "-0.045em",
  },
  ctaText: {
    maxWidth: 780,
    margin: 0,
    color: "#d1fae5",
    fontSize: 16,
    lineHeight: 1.65,
  },
  ctaActions: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 12,
    minWidth: 280,
  },
  lightButton: {
    padding: "14px 20px",
    borderRadius: 8,
    background: "#fff",
    color: "#065f46",
    fontSize: 14,
    fontWeight: 850,
    textDecoration: "none",
  },
  outlineButton: {
    padding: "13px 20px",
    border: "1px solid rgba(255,255,255,0.55)",
    borderRadius: 8,
    color: "#fff",
    fontSize: 14,
    fontWeight: 850,
    textDecoration: "none",
  },
};
