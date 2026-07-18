import Link from "next/link";

export const metadata = {
  title: "Governance Workspace | TA-14 Exchange Platform",
  description:
    "Build, test, verify, preserve, and review consequential execution routes through the TA-14 Governance Workspace.",
};

const primaryActions = [
  {
    title: "Start a Free Route",
    description:
      "Create a bounded consequential route, declare the evidence and authority required, and run the TA-14 engine.",
    href: "/workspace/routes/new",
    label: "Create Route",
  },
  {
    title: "Run the Live Demonstration",
    description:
      "Experience a deterministic HOLD, correct the missing bindings, and produce a preserved execution record.",
    href: "/workspace/demo",
    label: "Run Demo",
  },
  {
    title: "Verify a Route",
    description:
      "Inspect route identity, receipt continuity, evidence bindings, decision history, execution, and outcome.",
    href: "/verify",
    label: "Open Verification",
  },
  {
    title: "Search the Public Registry",
    description:
      "Look up durable TA14-RID records, manifests, decisions, corrections, certificates, and current limitations.",
    href: "/registry",
    label: "Search Registry",
  },
];

const lifecycle = [
  {
    step: "01",
    title: "Route Construction",
    description: "Define the actor, target, purpose, authority, evidence, policy, destination, and expected consequence.",
    href: "/workspace/routes/new",
    action: "Build Route",
  },
  {
    step: "02",
    title: "Evidence Intake",
    description: "Bind evidence sources, provenance, freshness, integrity, dependencies, and admissibility conditions.",
    href: "/workspace/evidence",
    action: "Submit Evidence",
  },
  {
    step: "03",
    title: "Admissibility Decision",
    description: "Run the route through ALLOW, HOLD, DENY, or ESCALATE without hiding adverse results.",
    href: "/workspace/routes",
    action: "Evaluate Routes",
  },
  {
    step: "04",
    title: "Finality & Certificates",
    description: "Resolve finality, issue certificates, and preserve the exact basis for consequence-bearing reliance.",
    href: "/workspace/records/disposition/finality",
    action: "Open Finality",
  },
  {
    step: "05",
    title: "Reliance",
    description: "Bind who may rely, for what purpose, against which route, certificate, scope, and time window.",
    href: "/workspace/records/disposition/finality/certificates/reliance",
    action: "Manage Reliance",
  },
  {
    step: "06",
    title: "Closure & Audit",
    description: "Close reliance, audit the closure record, preserve findings, and identify required remediation.",
    href: "/workspace/records/disposition/finality/certificates/reliance/closure/audit",
    action: "Run Closure Audit",
  },
  {
    step: "07",
    title: "Remediation & Retest",
    description: "Correct failed conditions, preserve the correction record, and submit the route for independent retest.",
    href: "/workspace/records/disposition/finality/certificates/reliance/closure/audit/remediation/retest",
    action: "Open Retest",
  },
  {
    step: "08",
    title: "Restoration",
    description: "Restore verified closure only after the failed conditions have been independently resolved and verified.",
    href: "/workspace/records/disposition/finality/certificates/reliance/closure/audit/remediation/retest/restoration",
    action: "Review Restoration",
  },
  {
    step: "09",
    title: "Reauthorization",
    description: "Request and verify new post-restoration reliance before any renewed consequential execution.",
    href: "/workspace/records/disposition/finality/certificates/reliance/closure/audit/remediation/retest/restoration/reauthorization",
    action: "Open Reauthorization",
  },
  {
    step: "10",
    title: "Activation & Outcome",
    description: "Activate the bounded route, preserve execution correspondence, and record the actual outcome.",
    href: "/workspace/records/disposition/finality/certificates/reliance/closure/audit/remediation/retest/restoration/reauthorization/verify/activation",
    action: "Activate Reliance",
  },
];

const exchangeActions = [
  {
    title: "Connect an Architecture",
    description:
      "Map an independent governance architecture to the TA-14 chain while preserving its identity and boundaries.",
    href: "/ecosystem",
    action: "Connect Architecture",
  },
  {
    title: "Request a Governance Review",
    description:
      "Submit a bounded system, route, evidence model, or runtime control for scoped review.",
    href: "/contact",
    action: "Request Review",
  },
  {
    title: "Join the Partner Review Network",
    description:
      "Establish a written partner lane for referrals, scoped challenge, second-layer review, and attribution continuity.",
    href: "/ecosystem",
    action: "Explore Partner Lane",
  },
  {
    title: "Request Enterprise Access",
    description:
      "Discuss API integration, private workspaces, governed registries, review operations, and production deployment.",
    href: "/contact",
    action: "Contact TA-14",
  },
];

const recentRoutes = [
  {
    id: "TA14-RID-DEMO-32500",
    route: "Vendor payment above USD 25,000",
    state: "READY",
    decision: "TESTABLE",
  },
  {
    id: "TA14-RID-REAUTH-014",
    route: "Post-restoration reliance activation",
    state: "PENDING",
    decision: "VERIFY",
  },
  {
    id: "TA14-RID-RET-008",
    route: "Independent remediation retest",
    state: "HELD",
    decision: "HOLD",
  },
];

export default function WorkspacePage() {
  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.brand} aria-label="TA-14 Exchange Platform home">
          <span style={styles.brandMark}>14</span>
          <span>
            <strong style={styles.brandTitle}>TA-14 EXCHANGE PLATFORM</strong>
            <small style={styles.brandSub}>Governance Workspace</small>
          </span>
        </Link>

        <nav style={styles.nav} aria-label="Workspace navigation">
          <Link href="/workspace" style={styles.navLink}>Workspace</Link>
          <Link href="/workspace/routes" style={styles.navLink}>Routes</Link>
          <Link href="/verify" style={styles.navLink}>Verification</Link>
          <Link href="/registry" style={styles.navLink}>Registry</Link>
          <Link href="/pricing" style={styles.navLink}>Pricing</Link>
          <Link href="/" style={styles.navLink}>Public Site</Link>
        </nav>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroCopy}>
          <div style={styles.eyebrow}>GOVERNANCE CONSTRUCTION ENVIRONMENT</div>
          <h1 style={styles.heroTitle}>
            Build the route.
            <br />
            Prove the authority.
            <br />
            Preserve the consequence.
          </h1>
          <p style={styles.heroText}>
            The TA-14 Governance Workspace connects route construction, evidence intake,
            deterministic challenge, correction, verification, registry continuity,
            certificates, reliance, audit, restoration, reauthorization, activation,
            execution, and outcome in one visible operating environment.
          </p>

          <div style={styles.heroActions}>
            <Link href="/workspace/routes/new" style={styles.primaryButton}>
              Start a Free Route
            </Link>
            <Link href="/workspace/demo" style={styles.secondaryButton}>
              Run the Live Demonstration
            </Link>
          </div>

          <div style={styles.trustRow}>
            <span style={styles.trustItem}>Evidence Bound</span>
            <span style={styles.trustItem}>Route Verifiable</span>
            <span style={styles.trustItem}>Adverse Results Preserved</span>
          </div>
        </div>

        <aside style={styles.statusPanel}>
          <div style={styles.panelTop}>
            <span style={styles.panelLabel}>WORKSPACE STATUS</span>
            <span style={styles.liveBadge}>LIVE</span>
          </div>
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Route Engine</span>
            <strong style={styles.metricValue}>READY</strong>
          </div>
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Decision States</span>
            <strong style={styles.metricValue}>4</strong>
          </div>
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Lifecycle Stages</span>
            <strong style={styles.metricValue}>10</strong>
          </div>
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Durable Record</span>
            <strong style={styles.metricValue}>$9</strong>
          </div>
          <Link href="/pricing" style={styles.panelButton}>
            View Commercial Ladder
          </Link>
        </aside>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeading}>
          <div>
            <div style={styles.eyebrow}>START HERE</div>
            <h2 style={styles.sectionTitle}>Choose what you need to do.</h2>
          </div>
          <p style={styles.sectionIntro}>
            Every major capability has a direct action. No hidden routes. No dead-end pages.
          </p>
        </div>

        <div style={styles.actionGrid}>
          {primaryActions.map((item) => (
            <article key={item.title} style={styles.actionCard}>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardText}>{item.description}</p>
              <Link href={item.href} style={styles.cardButton}>
                {item.label}
                <span aria-hidden="true"> →</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.darkSection}>
        <div style={styles.sectionHeading}>
          <div>
            <div style={styles.darkEyebrow}>THE GOVERNING CHAIN</div>
            <h2 style={styles.darkTitle}>One route from reality to outcome.</h2>
          </div>
          <p style={styles.darkIntro}>
            Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome
          </p>
        </div>

        <div style={styles.lifecycleGrid}>
          {lifecycle.map((item) => (
            <article key={item.step} style={styles.lifecycleCard}>
              <div style={styles.step}>{item.step}</div>
              <h3 style={styles.lifecycleTitle}>{item.title}</h3>
              <p style={styles.lifecycleText}>{item.description}</p>
              <Link href={item.href} style={styles.lifecycleButton}>
                {item.action}
                <span aria-hidden="true"> ↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.splitGrid}>
          <div>
            <div style={styles.eyebrow}>ACTIVE WORK</div>
            <h2 style={styles.sectionTitle}>Recent routes</h2>
            <p style={styles.sectionIntroLeft}>
              Inspect current route state, reopen preserved records, or continue the next required action.
            </p>
          </div>

          <div style={styles.routeList}>
            {recentRoutes.map((route) => (
              <Link
                href={`/workspace/routes/${route.id}`}
                key={route.id}
                style={styles.routeRow}
              >
                <div>
                  <div style={styles.routeId}>{route.id}</div>
                  <div style={styles.routeName}>{route.route}</div>
                </div>
                <div style={styles.routeState}>
                  <span style={styles.routeBadge}>{route.state}</span>
                  <strong>{route.decision}</strong>
                </div>
              </Link>
            ))}
            <Link href="/workspace/routes" style={styles.fullWidthButton}>
              View All Routes
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.exchangeSection}>
        <div style={styles.sectionHeading}>
          <div>
            <div style={styles.eyebrow}>GOVERNANCE EXCHANGE</div>
            <h2 style={styles.sectionTitle}>Bring your architecture. Connect it here.</h2>
          </div>
          <p style={styles.sectionIntro}>
            TA-14 does not erase independent governance systems. It gives them a bounded,
            attributable execution route where their claims can be tested and verified.
          </p>
        </div>

        <div style={styles.exchangeGrid}>
          {exchangeActions.map((item) => (
            <article key={item.title} style={styles.exchangeCard}>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardText}>{item.description}</p>
              <Link href={item.href} style={styles.textLink}>
                {item.action}
                <span aria-hidden="true"> →</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.cta}>
        <div>
          <div style={styles.ctaEyebrow}>NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</div>
          <h2 style={styles.ctaTitle}>Consequences should never outrun their evidence.</h2>
          <p style={styles.ctaText}>
            Build and test for free. Preserve one official route identity and its essential continuity for $9.
          </p>
        </div>
        <div style={styles.ctaActions}>
          <Link href="/workspace/routes/new" style={styles.lightButton}>
            Start a Route
          </Link>
          <Link href="/pricing" style={styles.outlineLightButton}>
            View Pricing
          </Link>
        </div>
      </section>

      <footer style={styles.footer}>
        <Link href="/" style={styles.footerBrand}>
          <span style={styles.brandMark}>14</span>
          <span>
            <strong style={styles.brandTitle}>TA-14 EXCHANGE PLATFORM</strong>
            <small style={styles.brandSub}>Build. Test. Connect. Verify. Preserve.</small>
          </span>
        </Link>
        <div style={styles.footerLinks}>
          <Link href="/architecture" style={styles.footerLink}>Architecture</Link>
          <Link href="/runtime" style={styles.footerLink}>Runtime</Link>
          <Link href="/pricing" style={styles.footerLink}>Pricing</Link>
          <Link href="/ecosystem" style={styles.footerLink}>Ecosystem</Link>
          <Link href="/contact" style={styles.footerLink}>Contact</Link>
        </div>
      </footer>
    </main>
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
    background: "rgba(244,245,247,0.96)",
    borderBottom: "1px solid #d9dde4",
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
    color: "#ffffff",
    fontWeight: 800,
    letterSpacing: "-0.04em",
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
    letterSpacing: "0.04em",
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
    fontWeight: 650,
    textDecoration: "none",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.5fr) minmax(300px, 0.55fr)",
    gap: 36,
    padding: "clamp(60px, 8vw, 120px) clamp(22px, 6vw, 92px)",
    background:
      "radial-gradient(circle at 82% 12%, rgba(110, 231, 183, 0.22), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f4f5f7 100%)",
  },
  heroCopy: { maxWidth: 880 },
  eyebrow: {
    color: "#067a58",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.18em",
  },
  heroTitle: {
    margin: "22px 0",
    color: "#0b0f19",
    fontSize: "clamp(48px, 7vw, 92px)",
    lineHeight: 0.97,
    letterSpacing: "-0.065em",
  },
  heroText: {
    maxWidth: 800,
    color: "#4b5563",
    fontSize: "clamp(18px, 2vw, 23px)",
    lineHeight: 1.65,
  },
  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 34,
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 24px",
    borderRadius: 9,
    background: "#111827",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 750,
    textDecoration: "none",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 24px",
    border: "1px solid #c7ccd4",
    borderRadius: 9,
    background: "#ffffff",
    color: "#111827",
    fontSize: 15,
    fontWeight: 750,
    textDecoration: "none",
  },
  trustRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 28,
  },
  trustItem: {
    padding: "8px 11px",
    border: "1px solid #d9dde4",
    borderRadius: 999,
    background: "#ffffff",
    color: "#4b5563",
    fontSize: 12,
    fontWeight: 700,
  },
  statusPanel: {
    alignSelf: "end",
    padding: 26,
    border: "1px solid #d9dde4",
    borderRadius: 16,
    background: "#ffffff",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)",
  },
  panelTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  panelLabel: {
    color: "#6b7280",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.16em",
  },
  liveBadge: {
    padding: "5px 8px",
    borderRadius: 999,
    background: "#d1fae5",
    color: "#065f46",
    fontSize: 10,
    fontWeight: 900,
  },
  metric: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "18px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  metricLabel: { color: "#6b7280", fontSize: 14 },
  metricValue: { color: "#111827", fontSize: 15 },
  panelButton: {
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
    padding: "13px 16px",
    borderRadius: 8,
    background: "#ecfdf5",
    color: "#065f46",
    fontSize: 14,
    fontWeight: 800,
    textDecoration: "none",
  },
  section: {
    padding: "clamp(66px, 8vw, 112px) clamp(22px, 6vw, 92px)",
  },
  sectionHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 28,
    marginBottom: 36,
  },
  sectionTitle: {
    margin: "10px 0 0",
    fontSize: "clamp(34px, 4vw, 58px)",
    lineHeight: 1.06,
    letterSpacing: "-0.045em",
  },
  sectionIntro: {
    maxWidth: 560,
    margin: 0,
    color: "#6b7280",
    fontSize: 17,
    lineHeight: 1.65,
  },
  sectionIntroLeft: {
    maxWidth: 560,
    color: "#6b7280",
    fontSize: 17,
    lineHeight: 1.65,
  },
  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))",
    gap: 18,
  },
  actionCard: {
    display: "flex",
    flexDirection: "column",
    minHeight: 255,
    padding: 26,
    border: "1px solid #d9dde4",
    borderRadius: 14,
    background: "#ffffff",
  },
  cardTitle: {
    margin: 0,
    fontSize: 22,
    letterSpacing: "-0.025em",
  },
  cardText: {
    flex: 1,
    color: "#6b7280",
    fontSize: 15,
    lineHeight: 1.65,
  },
  cardButton: {
    display: "inline-flex",
    alignSelf: "flex-start",
    padding: "11px 14px",
    borderRadius: 8,
    background: "#111827",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 800,
    textDecoration: "none",
  },
  darkSection: {
    padding: "clamp(66px, 8vw, 112px) clamp(22px, 6vw, 92px)",
    background: "#0b0f19",
    color: "#ffffff",
  },
  darkEyebrow: {
    color: "#6ee7b7",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.18em",
  },
  darkTitle: {
    margin: "10px 0 0",
    fontSize: "clamp(34px, 4vw, 58px)",
    lineHeight: 1.06,
    letterSpacing: "-0.045em",
  },
  darkIntro: {
    maxWidth: 620,
    margin: 0,
    color: "#aeb6c5",
    fontSize: 16,
    lineHeight: 1.65,
  },
  lifecycleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
    gap: 16,
  },
  lifecycleCard: {
    display: "flex",
    flexDirection: "column",
    minHeight: 275,
    padding: 24,
    border: "1px solid #283142",
    borderRadius: 13,
    background: "#121826",
  },
  step: {
    color: "#6ee7b7",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.18em",
  },
  lifecycleTitle: {
    margin: "18px 0 10px",
    fontSize: 21,
    letterSpacing: "-0.02em",
  },
  lifecycleText: {
    flex: 1,
    color: "#aeb6c5",
    fontSize: 14,
    lineHeight: 1.65,
  },
  lifecycleButton: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 800,
    textDecoration: "none",
  },
  splitGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 0.65fr) minmax(0, 1.35fr)",
    gap: 50,
    alignItems: "start",
  },
  routeList: {
    display: "grid",
    gap: 12,
  },
  routeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    padding: 20,
    border: "1px solid #d9dde4",
    borderRadius: 12,
    background: "#ffffff",
    color: "#111827",
    textDecoration: "none",
  },
  routeId: {
    marginBottom: 6,
    color: "#067a58",
    fontSize: 11,
    fontWeight: 850,
    letterSpacing: "0.08em",
  },
  routeName: {
    fontSize: 15,
    fontWeight: 750,
  },
  routeState: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 12,
  },
  routeBadge: {
    padding: "6px 8px",
    borderRadius: 999,
    background: "#eef2f7",
    color: "#4b5563",
    fontSize: 10,
    fontWeight: 900,
  },
  fullWidthButton: {
    display: "flex",
    justifyContent: "center",
    padding: 15,
    borderRadius: 9,
    background: "#111827",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 800,
    textDecoration: "none",
  },
  exchangeSection: {
    padding: "clamp(66px, 8vw, 112px) clamp(22px, 6vw, 92px)",
    background: "#ffffff",
  },
  exchangeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 18,
  },
  exchangeCard: {
    display: "flex",
    flexDirection: "column",
    minHeight: 240,
    padding: 25,
    border: "1px solid #d9dde4",
    borderRadius: 13,
    background: "#f8fafc",
  },
  textLink: {
    marginTop: "auto",
    color: "#067a58",
    fontSize: 14,
    fontWeight: 850,
    textDecoration: "none",
  },
  cta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 30,
    padding: "clamp(52px, 7vw, 86px) clamp(22px, 6vw, 92px)",
    background: "#067a58",
    color: "#ffffff",
  },
  ctaEyebrow: {
    color: "#bbf7d0",
    fontSize: 11,
    fontWeight: 850,
    letterSpacing: "0.16em",
  },
  ctaTitle: {
    maxWidth: 850,
    margin: "12px 0",
    fontSize: "clamp(34px, 4vw, 58px)",
    lineHeight: 1.06,
    letterSpacing: "-0.045em",
  },
  ctaText: {
    maxWidth: 780,
    margin: 0,
    color: "#d1fae5",
    fontSize: 17,
    lineHeight: 1.6,
  },
  ctaActions: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 12,
    minWidth: 250,
  },
  lightButton: {
    display: "inline-flex",
    justifyContent: "center",
    padding: "14px 20px",
    borderRadius: 8,
    background: "#ffffff",
    color: "#065f46",
    fontSize: 14,
    fontWeight: 850,
    textDecoration: "none",
  },
  outlineLightButton: {
    display: "inline-flex",
    justifyContent: "center",
    padding: "13px 20px",
    border: "1px solid rgba(255,255,255,0.5)",
    borderRadius: 8,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 850,
    textDecoration: "none",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    padding: "32px clamp(22px, 6vw, 92px)",
    borderTop: "1px solid #d9dde4",
    background: "#f4f5f7",
  },
  footerBrand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#111827",
    textDecoration: "none",
  },
  footerLinks: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 18,
  },
  footerLink: {
    color: "#4b5563",
    fontSize: 13,
    fontWeight: 700,
    textDecoration: "none",
  },
};
