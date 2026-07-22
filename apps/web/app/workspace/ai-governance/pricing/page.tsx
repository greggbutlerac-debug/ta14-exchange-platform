"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BillingMode = "Monthly" | "Annual";

type Plan = {
  id: string;
  name: string;
  audience: string;
  monthlyPrice: number;
  annualPrice: number;
  priceLabel?: string;
  description: string;
  featured?: boolean;
  features: string[];
  boundaries: string[];
  cta: string;
  href: string;
};

const plans: Plan[] = [
  {
    id: "playground",
    name: "Free Playground",
    audience: "Explore the architecture",
    monthlyPrice: 0,
    annualPrice: 0,
    description:
      "Build routes, test governance logic, explore records, and learn how TA-14 separates evidence, authority, execution, and outcomes.",
    features: [
      "Unlimited draft route building",
      "Governance playground access",
      "Sample review flows",
      "Demonstration records",
      "Route and evidence education",
      "No payment required",
    ],
    boundaries: [
      "Draft and demonstration use",
      "No preserved governed run",
      "No formal review determination",
      "No execution authority",
    ],
    cta: "Open Free Playground",
    href: "/workspace",
  },
  {
    id: "preserved-run",
    name: "Preserved Governed Run",
    audience: "One consequential route",
    monthlyPrice: 9,
    annualPrice: 9,
    priceLabel: "$9 per preserved run",
    description:
      "Preserve one governed route evaluation with attributable inputs, findings, decision state, evidence references, and replay history.",
    featured: true,
    features: [
      "One preserved route evaluation",
      "ALLOW / HOLD / DENY / ESCALATE result",
      "Evidence and authority references",
      "Governance decision record",
      "Replay-verification history",
      "Downloadable route artifact",
    ],
    boundaries: [
      "Price applies per preserved run",
      "Does not include specialist review",
      "Does not create certification",
      "Execution remains separately governed",
    ],
    cta: "Preserve a Governed Run",
    href: "/workspace/routes",
  },
  {
    id: "pro",
    name: "TA-14 Exchange Pro",
    audience: "Builders and governance teams",
    monthlyPrice: 99,
    annualPrice: 990,
    description:
      "A working environment for teams that build, test, preserve, compare, and improve consequential governance routes.",
    features: [
      "Expanded preserved-run allowance",
      "Private route library",
      "Reusable route templates",
      "Version and comparison history",
      "Team workspace controls",
      "Priority record exports",
      "Advanced replay analysis",
      "Governance drift visibility",
    ],
    boundaries: [
      "Professional workspace, not certification",
      "Specialist review priced separately",
      "Storage and usage limits may apply",
      "Execution services remain separate",
    ],
    cta: "Choose Exchange Pro",
    href: "/account",
  },
  {
    id: "organization",
    name: "Organization",
    audience: "Operational governance programs",
    monthlyPrice: 499,
    annualPrice: 4990,
    description:
      "Organization-level governance infrastructure for multiple teams, systems, routes, records, reviewers, and controlled review workflows.",
    features: [
      "Organization-scoped workspaces",
      "Multiple users and roles",
      "Governed record libraries",
      "Review and authority assignments",
      "Organization route templates",
      "Governance history and chain audit",
      "Priority support",
      "Implementation planning session",
    ],
    boundaries: [
      "Final scope confirmed before activation",
      "Partner and specialist fees are separate",
      "Custom integration work is not included",
      "No implied legal or regulatory approval",
    ],
    cta: "Request Organization Access",
    href: "/workspace/entity-review",
  },
];

const services = [
  {
    title: "Entity Review",
    price: "Scoped separately",
    description:
      "Review an organization, AI system, governance architecture, deployment, or consequential route against a declared question and evidence set.",
  },
  {
    title: "Partner Review Network",
    price: "$450 qualification review",
    description:
      "Application review for governance systems, reviewers, and specialists seeking a bounded Partner Review Network lane.",
  },
  {
    title: "Specialist Review",
    price: "Based on scope",
    description:
      "Independent technical, legal, risk, data, cybersecurity, operational, environmental, or sector-specific review.",
  },
  {
    title: "Governed Implementation",
    price: "Custom",
    description:
      "Architecture, workflow, integration, record, review, and execution-governance implementation for operational environments.",
  },
];

const comparisonRows = [
  {
    category: "AI governance assessment",
    typical: "$750–$1,500+",
    ta14: "Free exploration or $9 preserved run",
  },
  {
    category: "Specialized governance review",
    typical: "$8,000+",
    ta14: "Scoped review based on actual route and evidence",
  },
  {
    category: "Enterprise governance engagement",
    typical: "$25,000+",
    ta14: "Organization workspace from $499/month; implementation separate",
  },
  {
    category: "Partner qualification",
    typical: "Opaque or invitation-only",
    ta14: "$450 documented qualification review",
  },
];

export default function AiGovernancePricingPage() {
  const [billingMode, setBillingMode] = useState<BillingMode>("Monthly");

  const savings = useMemo(() => {
    const monthly = plans
      .filter((plan) => plan.monthlyPrice > 0 && plan.id !== "preserved-run")
      .reduce((total, plan) => total + plan.monthlyPrice * 12, 0);
    const annual = plans
      .filter((plan) => plan.annualPrice > 0 && plan.id !== "preserved-run")
      .reduce((total, plan) => total + plan.annualPrice, 0);

    return monthly - annual;
  }, []);

  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="glow glowOne" />
      <div className="glow glowTwo" />

      <header className="topbar shell">
        <Link href="/workspace/ai-governance" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>AI Governance Pricing</strong>
            <small>TA-14 AI Governance Exchange</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/workspace/governed-records">Governed Records</Link>
          <Link href="/workspace/entity-review">Entity Review</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">PRICING</p>
          <h1>Start free. Pay when the governance work becomes worth preserving.</h1>
          <p className="lead">
            Explore the exchange without charge, preserve a governed run for
            $9, or move into professional and organization workspaces when the
            route requires reusable records, team controls, review, and
            governance continuity.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="/workspace">
              Open Free Playground
              <span>→</span>
            </Link>
            <a className="secondaryButton" href="#plans">
              Compare Plans
            </a>
          </div>
        </div>

        <div className="priceVisual" aria-hidden="true">
          <div className="priceCore">
            <small>PRESERVED RUN</small>
            <strong>$9</strong>
            <span>Governed · Attributable · Replayable</span>
          </div>

          <div className="orbit orbitOne">
            <i />
          </div>
          <div className="orbit orbitTwo">
            <i />
          </div>
        </div>
      </section>

      <section className="principle shell">
        <p className="eyebrow">THE PRICING PRINCIPLE</p>
        <h2>Experimentation should be accessible. Consequential evidence should be preserved.</h2>
        <p>
          TA-14 does not charge simply because someone wants to learn, build, or
          test a route. Pricing begins when a user asks the exchange to preserve
          a governed run, maintain a professional workspace, conduct an
          attributable review, or support operational implementation.
        </p>
      </section>

      <section className="plansSection shell" id="plans">
        <div className="plansHeader">
          <div>
            <p className="eyebrow">WORKSPACE PLANS</p>
            <h2>Choose the level of preservation and governance you need.</h2>
          </div>

          <div className="billingToggle" aria-label="Billing mode">
            <button
              type="button"
              className={billingMode === "Monthly" ? "active" : ""}
              onClick={() => setBillingMode("Monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              className={billingMode === "Annual" ? "active" : ""}
              onClick={() => setBillingMode("Annual")}
            >
              Annual
            </button>
          </div>
        </div>

        <div className="plansGrid">
          {plans.map((plan) => {
            const displayedPrice =
              billingMode === "Annual" ? plan.annualPrice : plan.monthlyPrice;
            const suffix =
              plan.id === "preserved-run"
                ? ""
                : billingMode === "Annual"
                  ? "/year"
                  : "/month";

            return (
              <article
                className={`planCard ${plan.featured ? "featured" : ""}`}
                key={plan.id}
              >
                {plan.featured && <span className="featuredFlag">CORE ENTRY</span>}

                <span className="audience">{plan.audience}</span>
                <h3>{plan.name}</h3>

                <div className="planPrice">
                  {plan.priceLabel ? (
                    <strong className="priceLabel">{plan.priceLabel}</strong>
                  ) : (
                    <>
                      <strong>${displayedPrice.toLocaleString()}</strong>
                      <small>{displayedPrice === 0 ? "" : suffix}</small>
                    </>
                  )}
                </div>

                <p className="planDescription">{plan.description}</p>

                <Link className="planButton" href={plan.href}>
                  {plan.cta}
                  <span>→</span>
                </Link>

                <div className="planDetails">
                  <div>
                    <span className="detailLabel">Included</span>
                    <ul>
                      {plan.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="boundaries">
                    <span className="detailLabel">Boundaries</span>
                    <ul>
                      {plan.boundaries.map((boundary) => (
                        <li key={boundary}>{boundary}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {billingMode === "Annual" && (
          <div className="annualNotice">
            Annual pricing shown. Across the listed professional and
            organization plans, the annual options preserve ${savings.toLocaleString()} compared
            with twelve monthly payments.
          </div>
        )}
      </section>

      <section className="nineDollar shell">
        <div className="nineDollarVisual">
          <span>$9</span>
          <small>per preserved governed run</small>
        </div>

        <div>
          <p className="eyebrow">THE PRESERVED RUN</p>
          <h2>The $9 price is for preservation—not for clicking a button.</h2>
          <p>
            A preserved governed run retains the declared route, submitted
            inputs, evidence references, authority conditions, decision state,
            findings, timestamps, and replay-verification history. It creates a
            record that can be inspected later.
          </p>

          <div className="runFlow">
            <span>Build</span>
            <i>→</i>
            <span>Test</span>
            <i>→</i>
            <span>Review</span>
            <i>→</i>
            <span>Preserve</span>
            <i>→</i>
            <span>Replay</span>
          </div>
        </div>
      </section>

      <section className="services shell">
        <div className="sectionIntro">
          <p className="eyebrow">REVIEW AND IMPLEMENTATION</p>
          <h2>Some governance work cannot be reduced to a subscription.</h2>
          <p>
            Reviews and implementations are priced according to the entity,
            evidence volume, specialties required, route complexity, authority
            boundary, and expected deliverables.
          </p>
        </div>

        <div className="servicesGrid">
          {services.map((service) => (
            <article key={service.title}>
              <span>{service.price}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="comparison shell">
        <div className="sectionIntro">
          <p className="eyebrow">MARKET POSITION</p>
          <h2>Others often price the report. TA-14 prices the route and the evidence.</h2>
          <p>
            These examples are positioning references, not promises that every
            engagement has the same scope. Final review and implementation
            pricing depends on the work actually required.
          </p>
        </div>

        <div className="comparisonTable">
          <div className="tableRow tableHead">
            <span>Category</span>
            <span>Typical market framing</span>
            <span>TA-14 entry</span>
          </div>

          {comparisonRows.map((row) => (
            <div className="tableRow" key={row.category}>
              <strong>{row.category}</strong>
              <span>{row.typical}</span>
              <span>{row.ta14}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="whatYouPayFor shell">
        <div>
          <p className="eyebrow">WHAT YOU ARE PAYING FOR</p>
          <h2>Not a score. Not a badge. Not a confident paragraph.</h2>
        </div>

        <div className="payGrid">
          <article>
            <span>01</span>
            <h3>Attribution</h3>
            <p>Who submitted, reviewed, decided, changed, or executed.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Evidence continuity</h3>
            <p>Which source, version, custody, time, and route support the finding.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Bounded determination</h3>
            <p>What is supported, unsupported, held, denied, or escalated.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Preserved history</h3>
            <p>What changed without erasing the earlier governance state.</p>
          </article>
          <article>
            <span>05</span>
            <h3>Replay</h3>
            <p>Whether the decision can be inspected against the preserved record.</p>
          </article>
          <article>
            <span>06</span>
            <h3>Outcome verification</h3>
            <p>Whether execution produced the claimed result after the decision.</p>
          </article>
        </div>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>Payment does not create admissibility by itself.</h2>
        </div>

        <p>
          A paid run, plan, review, or application only creates access to the
          stated service. Admissibility depends on the actual evidence,
          continuity, authority, scope, findings, execution controls, and
          outcome records preserved within the route.
        </p>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">START WHERE YOU ARE</p>
          <h2>Build for free. Preserve the route when it becomes consequential.</h2>
          <p>
            Enter the playground without payment or move directly into a
            preserved governed run.
          </p>
        </div>

        <div className="finalActions">
          <Link className="primaryButton" href="/workspace">
            Open Free Playground
            <span>→</span>
          </Link>
          <Link className="secondaryButton" href="/workspace/routes">
            Start a $9 Preserved Run
          </Link>
        </div>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/workspace/ai-governance">Return to AI Governance</Link>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #040914;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #f7fbff;
          background:
            radial-gradient(circle at 12% 8%, rgba(52, 118, 230, 0.13), transparent 28%),
            radial-gradient(circle at 88% 24%, rgba(63, 200, 255, 0.1), transparent 28%),
            linear-gradient(180deg, #040914 0%, #07101f 50%, #050914 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        main {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .shell {
          width: min(1260px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .stars {
          position: fixed;
          inset: -12%;
          pointer-events: none;
          z-index: -4;
          opacity: 0.34;
        }

        .starsOne {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.4px);
          background-size: 92px 92px;
          animation: starDrift 34s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(91,176,255,.62) 0 1px, transparent 1.4px);
          background-size: 156px 156px;
          background-position: 39px 58px;
          animation: starDrift 48s linear infinite reverse;
        }

        .glow {
          position: fixed;
          width: 470px;
          height: 470px;
          border-radius: 999px;
          filter: blur(120px);
          opacity: 0.12;
          z-index: -3;
          animation: glowMove 14s ease-in-out infinite alternate;
        }

        .glowOne {
          left: -170px;
          top: -180px;
          background: #346dff;
        }

        .glowTwo {
          right: -180px;
          top: 44%;
          background: #31bdf4;
          animation-delay: -6s;
        }

        .topbar {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(132, 154, 188, 0.16);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
        }

        .brandMark {
          min-width: 64px;
          height: 38px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #04111d;
          background: linear-gradient(135deg, #5caeff, #c5efff);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          color: #7e91a6;
          margin-top: 2px;
        }

        nav {
          display: flex;
          gap: 22px;
        }

        nav a,
        footer a {
          color: #a9b8ca;
          text-decoration: none;
          font-size: 14px;
        }

        .hero {
          min-height: 650px;
          display: grid;
          grid-template-columns: 1.12fr 0.88fr;
          gap: 50px;
          align-items: center;
          padding: 76px 0;
        }

        .eyebrow {
          margin: 0;
          color: #68b6ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        h1 {
          max-width: 890px;
          margin: 18px 0 22px;
          font-size: clamp(48px, 7vw, 88px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .lead {
          max-width: 770px;
          margin: 0;
          color: #9fb0c4;
          font-size: 18px;
          line-height: 1.68;
        }

        .heroActions,
        .finalActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          border-radius: 14px;
          padding: 0 20px;
          text-decoration: none;
          font-weight: 850;
        }

        .primaryButton {
          color: #04111d;
          background: linear-gradient(135deg, #5caeff, #c3edff);
          box-shadow: 0 14px 38px rgba(71, 160, 255, 0.18);
        }

        .secondaryButton {
          color: #dce8f4;
          border: 1px solid rgba(130, 162, 188, 0.25);
          background: rgba(255, 255, 255, 0.035);
        }

        .priceVisual {
          min-height: 470px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .priceCore {
          width: 245px;
          height: 245px;
          border-radius: 999px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(105, 181, 255, 0.7);
          background:
            radial-gradient(circle, rgba(64, 137, 255, 0.18), rgba(7, 18, 36, 0.97) 68%);
          box-shadow:
            0 0 50px rgba(67, 146, 255, 0.28),
            inset 0 0 34px rgba(64, 151, 255, 0.15);
          z-index: 3;
        }

        .priceCore small {
          color: #78bbff;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .priceCore strong {
          margin: 8px 0;
          font-size: 82px;
          line-height: 0.92;
          letter-spacing: -0.08em;
        }

        .priceCore span {
          max-width: 175px;
          color: #91a8bd;
          text-align: center;
          font-size: 12px;
        }

        .orbit {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(100, 174, 255, 0.2);
          animation: rotate 22s linear infinite;
        }

        .orbit i {
          position: absolute;
          width: 10px;
          height: 10px;
          right: -5px;
          top: 50%;
          border-radius: 999px;
          background: #6fb8ff;
          box-shadow: 0 0 14px #6fb8ff;
        }

        .orbitOne {
          width: 340px;
          height: 340px;
        }

        .orbitTwo {
          width: 450px;
          height: 450px;
          animation-duration: 32s;
          animation-direction: reverse;
        }

        .orbitTwo i {
          background: #ffd75e;
          box-shadow: 0 0 14px #ffd75e;
        }

        .principle,
        .plansSection,
        .nineDollar,
        .services,
        .comparison,
        .whatYouPayFor,
        .boundary,
        .finalCta {
          border: 1px solid rgba(131, 155, 189, 0.16);
          background:
            linear-gradient(180deg, rgba(12, 21, 36, 0.9), rgba(7, 13, 24, 0.94));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.22);
        }

        .principle {
          padding: 52px;
          text-align: center;
        }

        .principle h2,
        .plansHeader h2,
        .nineDollar h2,
        .sectionIntro h2,
        .whatYouPayFor h2,
        .boundary h2,
        .finalCta h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .principle > p:not(.eyebrow),
        .nineDollar p,
        .sectionIntro > p:not(.eyebrow),
        .boundary > p,
        .finalCta p:not(.eyebrow) {
          color: #9fafc2;
          line-height: 1.68;
        }

        .principle > p:not(.eyebrow) {
          max-width: 860px;
          margin: 0 auto;
        }

        .plansSection,
        .nineDollar,
        .services,
        .comparison,
        .whatYouPayFor,
        .boundary {
          margin-top: 22px;
          padding: 42px;
        }

        .plansHeader {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 28px;
        }

        .plansHeader > div:first-child {
          max-width: 820px;
        }

        .billingToggle {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 6px;
          min-width: 230px;
          padding: 5px;
          border-radius: 14px;
          border: 1px solid rgba(126, 157, 193, 0.17);
          background: rgba(4, 11, 22, 0.72);
        }

        .billingToggle button {
          min-height: 40px;
          border: 0;
          border-radius: 10px;
          background: transparent;
          color: #96a8bc;
          cursor: pointer;
          font-weight: 850;
        }

        .billingToggle button.active {
          background: rgba(72, 154, 239, 0.14);
          color: #eaf6ff;
        }

        .plansGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 30px;
        }

        .planCard {
          position: relative;
          padding: 28px;
          border-radius: 22px;
          border: 1px solid rgba(128, 155, 188, 0.16);
          background: rgba(8, 16, 29, 0.86);
        }

        .planCard.featured {
          border-color: rgba(103, 185, 255, 0.55);
          box-shadow:
            0 0 0 1px rgba(90, 169, 247, 0.08),
            0 24px 60px rgba(40, 125, 214, 0.11);
        }

        .featuredFlag {
          position: absolute;
          right: 22px;
          top: 22px;
          padding: 6px 9px;
          border-radius: 999px;
          color: #98d2ff;
          background: rgba(64, 145, 228, 0.1);
          border: 1px solid rgba(93, 177, 255, 0.22);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .audience {
          color: #72b9ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .planCard h3 {
          margin: 12px 0 0;
          font-size: 31px;
          letter-spacing: -0.04em;
        }

        .planPrice {
          min-height: 70px;
          margin-top: 18px;
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .planPrice strong {
          font-size: 54px;
          letter-spacing: -0.065em;
        }

        .planPrice strong.priceLabel {
          font-size: 34px;
          letter-spacing: -0.04em;
        }

        .planPrice small {
          color: #8598ad;
          font-weight: 700;
        }

        .planDescription {
          min-height: 76px;
          color: #9fafc2;
          line-height: 1.6;
        }

        .planButton {
          min-height: 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-top: 20px;
          padding: 0 15px;
          border-radius: 12px;
          border: 1px solid rgba(99, 179, 255, 0.25);
          background: rgba(66, 142, 224, 0.07);
          color: #8bc9ff;
          text-decoration: none;
          font-weight: 850;
        }

        .planDetails {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
          margin-top: 25px;
          padding-top: 24px;
          border-top: 1px solid rgba(130, 155, 188, 0.12);
        }

        .detailLabel {
          color: #72b9ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .boundaries .detailLabel {
          color: #ffc876;
        }

        ul {
          margin: 12px 0 0;
          padding-left: 20px;
          color: #b6c4d4;
        }

        li {
          margin-bottom: 9px;
          line-height: 1.5;
        }

        .annualNotice {
          margin-top: 18px;
          padding: 15px 18px;
          border-radius: 14px;
          border: 1px solid rgba(88, 213, 159, 0.19);
          background: rgba(54, 178, 126, 0.06);
          color: #a8dec5;
          line-height: 1.55;
        }

        .nineDollar {
          display: grid;
          grid-template-columns: 0.55fr 1.45fr;
          gap: 38px;
          align-items: center;
        }

        .nineDollarVisual {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 22px;
          border: 1px solid rgba(100, 181, 255, 0.36);
          background:
            radial-gradient(circle, rgba(69, 151, 237, 0.13), transparent 55%),
            rgba(5, 13, 25, 0.8);
          text-align: center;
        }

        .nineDollarVisual span {
          color: #dff4ff;
          font-size: 112px;
          font-weight: 950;
          line-height: 0.9;
          letter-spacing: -0.08em;
        }

        .nineDollarVisual small {
          max-width: 175px;
          margin-top: 14px;
          color: #7da6ca;
          line-height: 1.45;
        }

        .nineDollar h2 {
          font-size: clamp(30px, 4.7vw, 50px);
        }

        .runFlow {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin-top: 22px;
        }

        .runFlow span {
          padding: 9px 12px;
          border-radius: 999px;
          border: 1px solid rgba(99, 179, 255, 0.2);
          color: #d5e8fa;
          font-size: 12px;
          font-weight: 800;
        }

        .runFlow i {
          color: #5daaff;
          font-style: normal;
        }

        .sectionIntro {
          max-width: 900px;
        }

        .sectionIntro h2 {
          font-size: clamp(32px, 4.8vw, 54px);
        }

        .servicesGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .servicesGrid article,
        .payGrid article {
          padding: 22px;
          border-radius: 18px;
          border: 1px solid rgba(112, 168, 219, 0.16);
          background: rgba(58, 118, 185, 0.05);
        }

        .servicesGrid span {
          color: #74baff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .servicesGrid h3 {
          margin: 15px 0 10px;
          font-size: 22px;
        }

        .servicesGrid p,
        .payGrid p {
          margin: 0;
          color: #9fafc2;
          line-height: 1.58;
        }

        .comparisonTable {
          margin-top: 28px;
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid rgba(128, 155, 188, 0.16);
        }

        .tableRow {
          display: grid;
          grid-template-columns: 0.9fr 0.85fr 1.25fr;
          gap: 16px;
          padding: 18px 20px;
          border-top: 1px solid rgba(128, 155, 188, 0.12);
          color: #aebed0;
        }

        .tableRow:first-child {
          border-top: 0;
        }

        .tableHead {
          background: rgba(68, 143, 223, 0.08);
          color: #75bcff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .tableRow strong {
          color: #e4eef8;
        }

        .whatYouPayFor {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 34px;
          align-items: start;
        }

        .whatYouPayFor h2 {
          font-size: clamp(30px, 4.5vw, 48px);
        }

        .payGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .payGrid span {
          color: #69b3ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .payGrid h3 {
          margin: 14px 0 8px;
          font-size: 21px;
        }

        .boundary {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .boundary h2 {
          font-size: clamp(30px, 4.5vw, 48px);
        }

        .boundary > p {
          margin: 0;
        }

        .finalCta {
          margin-top: 74px;
          padding: 54px 46px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
        }

        .finalCta > div:first-child {
          max-width: 690px;
        }

        .finalActions {
          margin-top: 0;
          justify-content: flex-end;
        }

        footer {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          color: #74869a;
          font-size: 12px;
        }

        @keyframes starDrift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(90px, 140px, 0);
          }
        }

        @keyframes glowMove {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(55px, 35px, 0) scale(1.1);
          }
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 980px) {
          nav {
            display: none;
          }

          .hero,
          .nineDollar,
          .whatYouPayFor,
          .boundary {
            grid-template-columns: 1fr;
          }

          .servicesGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .finalCta {
            flex-direction: column;
            align-items: flex-start;
          }

          .finalActions {
            justify-content: flex-start;
          }
        }

        @media (max-width: 720px) {
          .shell {
            width: min(100% - 20px, 1260px);
          }

          .hero {
            min-height: auto;
            padding: 58px 0;
          }

          .priceVisual {
            min-height: 430px;
            transform: scale(0.8);
          }

          .principle,
          .plansSection,
          .nineDollar,
          .services,
          .comparison,
          .whatYouPayFor,
          .boundary,
          .finalCta {
            padding: 28px 24px;
          }

          .plansHeader {
            flex-direction: column;
            align-items: flex-start;
          }

          .billingToggle {
            width: 100%;
          }

          .plansGrid,
          .planDetails,
          .servicesGrid,
          .payGrid {
            grid-template-columns: 1fr;
          }

          .tableRow {
            grid-template-columns: 1fr;
          }

          .tableHead {
            display: none;
          }

          footer {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
