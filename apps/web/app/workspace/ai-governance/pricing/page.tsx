import Link from "next/link";

export const metadata = {
  title: "AI Governance Pricing | TA-14 AI Governance Exchange",
  description:
    "Interactive AI governance pricing with market comparisons, TA-14 pricing at 75% below benchmark, service details, and direct workflow actions.",
};

const services = [
  {
    category: "Preservation",
    title: "Preserved Governed Run",
    market: "$750",
    ta14: "$187.50",
    savings: "$562.50",
    description:
      "Preserve a completed AI governance run with its route state, decision, evidence references, correction history, and final outcome status.",
    includes: [
      "Durable route snapshot",
      "Decision basis",
      "Correction history",
      "Downloadable preserved record",
    ],
    href: "/workspace/routes",
    cta: "Choose a Route",
    sampleHref: "/workspace/records",
  },
  {
    category: "Record",
    title: "Admissible Execution Record",
    market: "$1,500",
    ta14: "$375",
    savings: "$1,125",
    description:
      "Generate a bounded execution record covering Reality through Outcome, including authority, binding, commit, execution, and result.",
    includes: [
      "Complete eight-stage route record",
      "Evidence and authority boundaries",
      "Commit and execution state",
      "Outcome declaration",
    ],
    href: "/workspace/routes/new",
    cta: "Build a Route",
    sampleHref: "/workspace/records",
  },
  {
    category: "Verification",
    title: "Signed Verification Package",
    market: "$2,500",
    ta14: "$625",
    savings: "$1,875",
    description:
      "Create a verification package suitable for internal review, procurement, audit preparation, or external reliance.",
    includes: [
      "Verification receipt",
      "Route digest",
      "Evidence continuity summary",
      "Export-ready package",
    ],
    href: "/verify",
    cta: "Open Verification",
    sampleHref: "/workspace/records",
  },
  {
    category: "Comparison",
    title: "Replay and Route Comparison",
    market: "$3,000",
    ta14: "$750",
    savings: "$2,250",
    description:
      "Compare an original failed or held route against a corrected route without erasing the prior state.",
    includes: [
      "Original route preservation",
      "Corrected route replay",
      "Difference analysis",
      "Decision change explanation",
    ],
    href: "/workspace/routes",
    cta: "Select Routes",
    sampleHref: "/verify",
  },
  {
    category: "Review",
    title: "Independent AI Route Review",
    market: "$8,000",
    ta14: "$2,000",
    savings: "$6,000",
    description:
      "Independent full-chain review of a consequential AI route, including evidence, authority, continuity, binding, commit, execution, and outcome.",
    includes: [
      "Full-chain review",
      "Declared findings",
      "Boundary and gap analysis",
      "Correction recommendations",
    ],
    href: "/workspace/entity-review-center",
    cta: "Start Review Intake",
    sampleHref: "/workspace/routes/new",
  },
  {
    category: "Entity Review",
    title: "AI Governance Entity Review",
    market: "$25,000",
    ta14: "$6,250",
    savings: "$18,750",
    description:
      "Review how an organization governs consequential AI across policies, routes, authorities, records, runtime decisions, and outcomes.",
    includes: [
      "Governance readiness assessment",
      "Route and authority sampling",
      "Evidence integrity findings",
      "Executive review package",
    ],
    href: "/workspace/entity-review-center",
    cta: "Begin Entity Review",
    sampleHref: "/entity-review-center",
  },
  {
    category: "Runtime",
    title: "Runtime Governance Integration",
    market: "$40,000+",
    ta14: "$10,000+",
    savings: "$30,000+",
    description:
      "Connect TA-14 governance controls to a live AI agent, application, workflow, toolchain, or consequential execution environment.",
    includes: [
      "Integration discovery",
      "Route and control mapping",
      "Commit-gate design",
      "Verification and deployment support",
    ],
    href: "/workspace/routes/new",
    cta: "Map an Integration",
    sampleHref: "/workspace/ai-governance",
  },
  {
    category: "Enterprise",
    title: "Enterprise AI Governance Program",
    market: "$100,000+",
    ta14: "$25,000+",
    savings: "$75,000+",
    description:
      "A scoped enterprise program for multiple AI systems, teams, authorities, review lanes, records, and runtime governance requirements.",
    includes: [
      "Multi-system governance architecture",
      "Organizational authority mapping",
      "Review and preservation workflows",
      "Phased implementation plan",
    ],
    href: "/workspace/entity-review-center",
    cta: "Start Enterprise Scope",
    sampleHref: "/ai-governance",
  },
];

const filters = [
  "All Services",
  "Preservation",
  "Record",
  "Verification",
  "Comparison",
  "Review",
  "Entity Review",
  "Runtime",
  "Enterprise",
];

export default function AIGovernancePricingPage() {
  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/workspace/ai-governance" style={styles.brand}>
          <span style={styles.brandMark}>TA-14</span>
          <span>
            <strong style={styles.brandTitle}>AI GOVERNANCE PRICING</strong>
            <small style={styles.brandSub}>Interactive service marketplace</small>
          </span>
        </Link>

        <nav style={styles.nav}>
          <Link href="/workspace/ai-governance" style={styles.navLink}>
            Playground
          </Link>
          <Link href="/workspace/routes/new" style={styles.navLink}>
            Build
          </Link>
          <Link href="/workspace/routes" style={styles.navLink}>
            My Routes
          </Link>
          <Link href="/" style={styles.returnButton}>
            Return to Exchange
          </Link>
        </nav>
      </header>

      <section style={styles.hero}>
        <div style={styles.eyebrow}>TRANSPARENT AI GOVERNANCE PRICING</div>
        <h1 style={styles.heroTitle}>
          See the market.
          <br />
          See the TA-14 price.
          <br />
          Choose what happens next.
        </h1>
        <p style={styles.heroText}>
          Exploration, route construction, correction, and learning remain free. When you choose
          preservation, verification, professional review, runtime integration, or enterprise
          implementation, the exact price appears before commitment. TA-14 is priced at 25% of the
          benchmark market price—75% lower.
        </p>

        <div style={styles.heroActions}>
          <Link href="#services" style={styles.primaryButton}>
            Explore Services
          </Link>
          <Link href="/workspace/ai-governance" style={styles.secondaryButton}>
            Return to Free Playground
          </Link>
        </div>

        <div style={styles.marketStrip}>
          <div>
            <span style={styles.marketLabel}>MARKET BENCHMARK</span>
            <strong style={styles.marketValue}>100%</strong>
          </div>
          <div>
            <span style={styles.marketLabel}>TA-14 PRICE</span>
            <strong style={styles.marketValue}>25%</strong>
          </div>
          <div>
            <span style={styles.marketLabel}>CUSTOMER SAVINGS</span>
            <strong style={styles.marketValue}>75%</strong>
          </div>
        </div>
      </section>

      <section id="services" style={styles.servicesSection}>
        <div style={styles.sectionHeading}>
          <div>
            <div style={styles.eyebrowDark}>INTERACTIVE SERVICE MARKETPLACE</div>
            <h2 style={styles.sectionTitle}>Choose a service and enter the correct workflow.</h2>
          </div>
          <p style={styles.sectionIntro}>
            Every service card shows the benchmark market price, the TA-14 price, the savings,
            what is included, and the next action. Nothing is hidden behind a sales conversation.
          </p>
        </div>

        <div style={styles.filterRow}>
          {filters.map((filter, index) => (
            <a
              key={filter}
              href={index === 0 ? "#services" : `#${filter.toLowerCase().replaceAll(" ", "-")}`}
              style={index === 0 ? styles.filterActive : styles.filter}
            >
              {filter}
            </a>
          ))}
        </div>

        <div style={styles.serviceGrid}>
          {services.map((service) => (
            <article
              key={service.title}
              id={service.category.toLowerCase().replaceAll(" ", "-")}
              style={styles.serviceCard}
            >
              <div style={styles.cardHeader}>
                <span style={styles.category}>{service.category}</span>
                <span style={styles.discountBadge}>75% LOWER</span>
              </div>

              <h3 style={styles.cardTitle}>{service.title}</h3>
              <p style={styles.cardDescription}>{service.description}</p>

              <div style={styles.pricePanel}>
                <div style={styles.priceRow}>
                  <span style={styles.priceLabel}>Typical market</span>
                  <strong style={styles.marketPrice}>{service.market}</strong>
                </div>
                <div style={styles.priceRow}>
                  <span style={styles.priceLabel}>TA-14 price</span>
                  <strong style={styles.ta14Price}>{service.ta14}</strong>
                </div>
                <div style={styles.savingsRow}>
                  <span>You save</span>
                  <strong>{service.savings}</strong>
                </div>
              </div>

              <div style={styles.includesTitle}>WHAT YOU RECEIVE</div>
              <ul style={styles.includesList}>
                {service.includes.map((item) => (
                  <li key={item} style={styles.includesItem}>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={styles.cardActions}>
                <Link href={service.href} style={styles.cardPrimaryButton}>
                  {service.cta}
                </Link>
                <Link href={service.sampleHref} style={styles.cardSecondaryButton}>
                  View Related Workspace
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.howItWorks}>
        <div>
          <div style={styles.eyebrow}>PRICING AT THE POINT OF ACTION</div>
          <h2 style={styles.howTitle}>The price follows the user’s choice.</h2>
          <p style={styles.howText}>
            A user may build and test freely. When they select a paid action, the platform should
            show the exact service, market benchmark, TA-14 price, savings, deliverable, and why
            payment is required before continuing.
          </p>
        </div>

        <div style={styles.steps}>
          <div style={styles.step}>
            <span style={styles.stepNumber}>01</span>
            <strong>Choose an action</strong>
            <p>Preserve, verify, review, compare, integrate, or scope an enterprise program.</p>
          </div>
          <div style={styles.step}>
            <span style={styles.stepNumber}>02</span>
            <strong>See the exact price</strong>
            <p>The selected service appears with its market benchmark and 75% savings.</p>
          </div>
          <div style={styles.step}>
            <span style={styles.stepNumber}>03</span>
            <strong>Enter the workflow</strong>
            <p>The selected service carries forward into the correct route, record, or intake page.</p>
          </div>
        </div>
      </section>

      <section style={styles.freeSection}>
        <div>
          <div style={styles.eyebrowDark}>WHAT REMAINS FREE</div>
          <h2 style={styles.freeTitle}>The playground is not a sales wall.</h2>
          <p style={styles.freeText}>
            Users can explore scenarios, build routes, deliberately break them, understand ALLOW,
            HOLD, DENY, and ESCALATE, correct failures, and learn the TA-14 chain without payment.
          </p>
        </div>

        <div style={styles.freeActions}>
          <Link
            href="/workspace/ai-governance/demonstrations/free-guided-demo"
            style={styles.primaryButton}
          >
            Run a Free Guided Demo
          </Link>
          <Link href="/workspace/routes/new" style={styles.secondaryDarkButton}>
            Build a Free AI Route
          </Link>
        </div>
      </section>

      <footer style={styles.footer}>
        <div>
          <strong>TA-14 Authority Governance Institution</strong>
          <div style={styles.footerSub}>No admissible evidence. No admissible execution.</div>
        </div>

        <div style={styles.footerLinks}>
          <Link href="/workspace/ai-governance" style={styles.footerLink}>
            AI Governance Playground
          </Link>
          <Link href="/ai-governance" style={styles.footerLink}>
            Public Introduction
          </Link>
          <Link href="/" style={styles.footerLink}>
            Exchange Home
          </Link>
        </div>
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f4f7f9",
    color: "#0d1822",
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
    padding: "16px clamp(18px, 4vw, 58px)",
    borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(6, 17, 29, 0.96)",
    backdropFilter: "blur(18px)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#ffffff",
    textDecoration: "none",
  },
  brandMark: {
    display: "grid",
    placeItems: "center",
    minWidth: 54,
    height: 42,
    padding: "0 10px",
    borderRadius: 10,
    background: "linear-gradient(135deg, #4fdcff, #7a8cff)",
    color: "#04101b",
    fontSize: 13,
    fontWeight: 950,
  },
  brandTitle: {
    display: "block",
    fontSize: 13,
    letterSpacing: "0.1em",
  },
  brandSub: {
    display: "block",
    marginTop: 3,
    color: "#8da4b7",
    fontSize: 11,
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 16,
  },
  navLink: {
    color: "#b8c8d6",
    fontSize: 13,
    fontWeight: 700,
    textDecoration: "none",
  },
  returnButton: {
    padding: "10px 14px",
    border: "1px solid rgba(110, 231, 255, 0.34)",
    borderRadius: 9,
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 800,
    textDecoration: "none",
  },
  hero: {
    padding: "clamp(72px, 9vw, 128px) clamp(24px, 7vw, 104px)",
    background:
      "radial-gradient(circle at 82% 10%, rgba(79, 220, 255, 0.2), transparent 28%), radial-gradient(circle at 20% 22%, rgba(122, 140, 255, 0.14), transparent 35%), #07131f",
    color: "#ffffff",
  },
  eyebrow: {
    color: "#5fe0ff",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.18em",
  },
  eyebrowDark: {
    color: "#08758b",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.18em",
  },
  heroTitle: {
    maxWidth: 1100,
    margin: "20px 0",
    fontSize: "clamp(48px, 7vw, 92px)",
    lineHeight: 0.98,
    letterSpacing: "-0.06em",
  },
  heroText: {
    maxWidth: 900,
    color: "#a8bdcc",
    fontSize: "clamp(17px, 2vw, 22px)",
    lineHeight: 1.65,
  },
  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 32,
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 22px",
    borderRadius: 10,
    background: "linear-gradient(135deg, #59e4ff, #8290ff)",
    color: "#04101b",
    fontSize: 14,
    fontWeight: 900,
    textDecoration: "none",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 22px",
    border: "1px solid rgba(148, 163, 184, 0.34)",
    borderRadius: 10,
    background: "rgba(255,255,255,0.03)",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 800,
    textDecoration: "none",
  },
  marketStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 1,
    maxWidth: 900,
    marginTop: 52,
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: 14,
    background: "rgba(148, 163, 184, 0.18)",
  },
  marketLabel: {
    display: "block",
    padding: "20px 20px 6px",
    background: "#0b1d2d",
    color: "#8299aa",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.13em",
  },
  marketValue: {
    display: "block",
    padding: "0 20px 22px",
    background: "#0b1d2d",
    color: "#ffffff",
    fontSize: 34,
  },
  servicesSection: {
    padding: "clamp(64px, 8vw, 110px) clamp(24px, 6vw, 82px)",
  },
  sectionHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 28,
    marginBottom: 30,
  },
  sectionTitle: {
    maxWidth: 820,
    margin: "10px 0 0",
    fontSize: "clamp(34px, 4vw, 58px)",
    lineHeight: 1.05,
    letterSpacing: "-0.045em",
  },
  sectionIntro: {
    maxWidth: 560,
    margin: 0,
    color: "#687581",
    fontSize: 16,
    lineHeight: 1.65,
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 28,
  },
  filter: {
    padding: "9px 13px",
    border: "1px solid #d6dee5",
    borderRadius: 999,
    background: "#ffffff",
    color: "#60707c",
    fontSize: 12,
    fontWeight: 800,
    textDecoration: "none",
  },
  filterActive: {
    padding: "9px 13px",
    border: "1px solid #0d8298",
    borderRadius: 999,
    background: "#dff7fb",
    color: "#075d70",
    fontSize: 12,
    fontWeight: 900,
    textDecoration: "none",
  },
  serviceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
  },
  serviceCard: {
    display: "flex",
    flexDirection: "column",
    minHeight: 620,
    padding: 25,
    border: "1px solid #d8e0e6",
    borderRadius: 16,
    background: "#ffffff",
    boxShadow: "0 18px 55px rgba(15, 23, 32, 0.055)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  category: {
    color: "#0d7d92",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },
  discountBadge: {
    padding: "6px 9px",
    borderRadius: 999,
    background: "#dcfce7",
    color: "#166534",
    fontSize: 10,
    fontWeight: 950,
  },
  cardTitle: {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.1,
    letterSpacing: "-0.035em",
  },
  cardDescription: {
    minHeight: 92,
    color: "#687682",
    fontSize: 14,
    lineHeight: 1.65,
  },
  pricePanel: {
    margin: "18px 0 24px",
    padding: 17,
    border: "1px solid #dde5ea",
    borderRadius: 12,
    background: "#f7fafb",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "7px 0",
  },
  priceLabel: {
    color: "#6e7b86",
    fontSize: 13,
  },
  marketPrice: {
    color: "#7a8791",
    fontSize: 17,
    textDecoration: "line-through",
  },
  ta14Price: {
    color: "#08758b",
    fontSize: 22,
  },
  savingsRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 9,
    paddingTop: 13,
    borderTop: "1px solid #dce4e9",
    color: "#166534",
    fontSize: 13,
  },
  includesTitle: {
    color: "#6f7d88",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.14em",
  },
  includesList: {
    flex: 1,
    margin: "13px 0 24px",
    paddingLeft: 20,
  },
  includesItem: {
    marginBottom: 9,
    color: "#4d5c68",
    fontSize: 13,
    lineHeight: 1.5,
  },
  cardActions: {
    display: "grid",
    gap: 10,
  },
  cardPrimaryButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 48,
    padding: "0 16px",
    borderRadius: 9,
    background: "#0b7d92",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 900,
    textDecoration: "none",
  },
  cardSecondaryButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 46,
    padding: "0 16px",
    border: "1px solid #d4dde4",
    borderRadius: 9,
    color: "#52616c",
    fontSize: 13,
    fontWeight: 800,
    textDecoration: "none",
  },
  howItWorks: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 0.9fr)",
    gap: 50,
    padding: "clamp(64px, 8vw, 108px) clamp(24px, 6vw, 82px)",
    background: "#091725",
    color: "#ffffff",
  },
  howTitle: {
    margin: "12px 0",
    fontSize: "clamp(34px, 4vw, 58px)",
    lineHeight: 1.05,
    letterSpacing: "-0.045em",
  },
  howText: {
    maxWidth: 760,
    color: "#9fb4c3",
    fontSize: 16,
    lineHeight: 1.65,
  },
  steps: {
    display: "grid",
    gap: 13,
  },
  step: {
    padding: 20,
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: 13,
    background: "#0e2132",
  },
  stepNumber: {
    display: "block",
    marginBottom: 10,
    color: "#71e7ff",
    fontSize: 11,
    fontWeight: 950,
  },
  freeSection: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
    gap: 42,
    alignItems: "center",
    padding: "clamp(58px, 7vw, 92px) clamp(24px, 6vw, 82px)",
    background: "#dff8fd",
  },
  freeTitle: {
    margin: "12px 0",
    fontSize: "clamp(34px, 4vw, 58px)",
    lineHeight: 1.05,
    letterSpacing: "-0.045em",
  },
  freeText: {
    maxWidth: 760,
    margin: 0,
    color: "#526a77",
    fontSize: 16,
    lineHeight: 1.65,
  },
  freeActions: {
    display: "grid",
    gap: 12,
  },
  secondaryDarkButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 22px",
    border: "1px solid rgba(15, 23, 32, 0.25)",
    borderRadius: 10,
    color: "#0c1b25",
    fontSize: 14,
    fontWeight: 900,
    textDecoration: "none",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    padding: "30px clamp(24px, 6vw, 82px)",
    background: "#06111d",
    color: "#dce8ef",
  },
  footerSub: {
    marginTop: 4,
    color: "#71899a",
    fontSize: 12,
  },
  footerLinks: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 16,
  },
  footerLink: {
    color: "#93a9b8",
    fontSize: 12,
    fontWeight: 700,
    textDecoration: "none",
  },
};
