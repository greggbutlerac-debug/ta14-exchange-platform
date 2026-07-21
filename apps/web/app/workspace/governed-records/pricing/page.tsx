"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BillingMode = "monthly" | "annual";
type PlanKey = "free" | "preserve" | "professional" | "institution";

type Plan = {
  key: PlanKey;
  name: string;
  monthly: number;
  annualMonthly: number;
  description: string;
  bestFor: string;
  features: string[];
  emphasis?: string;
  cta: string;
};

const plans: Plan[] = [
  {
    key: "free",
    name: "Governed Records Free",
    monthly: 0,
    annualMonthly: 0,
    description:
      "Explore the Governed Records workspace, create demonstration artifacts, and understand the separation between record, continuity, comparison, preservation, and verification.",
    bestFor: "Individuals learning the TA-14 record architecture.",
    features: [
      "Interactive Governed Records playground",
      "Continuity Review demonstrations",
      "Record Comparison demonstrations",
      "Verification demonstrations",
      "Local browser-based demonstration artifacts",
      "No durable preservation included",
    ],
    cta: "Open Free Workspace",
  },
  {
    key: "preserve",
    name: "Preserved Record",
    monthly: 9,
    annualMonthly: 9,
    description:
      "Preserve a single governed record or review artifact with a stable identity, timestamp, version, integrity reference, and visible proof boundary.",
    bestFor: "One-time preservation of a consequential record.",
    features: [
      "One preserved governed artifact",
      "Stable record identity",
      "Version and preservation timestamp",
      "Integrity reference",
      "Declared source and authority",
      "Visible proof and non-proof boundary",
    ],
    emphasis: "$9 per preserved record",
    cta: "Prepare a Preserved Record",
  },
  {
    key: "professional",
    name: "Governed Records Professional",
    monthly: 99,
    annualMonthly: 79,
    description:
      "A professional workspace for organizations that need repeatable record preservation, continuity review, comparison, verification, and correction history.",
    bestFor: "Consultants, reviewers, contractors, and operational teams.",
    features: [
      "Up to 100 preserved artifacts each month",
      "Continuity Review workspace",
      "Record Comparison workspace",
      "Verification workspace",
      "Preserved correction and version history",
      "Exportable record receipts",
      "Private organization workspace",
      "Priority support",
    ],
    emphasis: "Most practical",
    cta: "Choose Professional",
  },
  {
    key: "institution",
    name: "Governed Records Institution",
    monthly: 499,
    annualMonthly: 399,
    description:
      "A multi-user governed record environment for institutions managing consequential records across teams, facilities, programs, or review domains.",
    bestFor: "Hospitals, building portfolios, laboratories, agencies, and enterprises.",
    features: [
      "Up to 1,000 preserved artifacts each month",
      "Multi-user organization access",
      "Reviewer roles and bounded authority",
      "Institutional record library",
      "Correction and replay history",
      "Advanced exports",
      "Priority onboarding",
      "Custom preservation volumes available",
    ],
    cta: "Request Institutional Access",
  },
];

const marketRows = [
  {
    category: "Governance review",
    market: "$750–$8,000+",
    ta14: "Free workspace or bounded preserved artifact",
  },
  {
    category: "Specialist assessment",
    market: "$1,500–$25,000+",
    ta14: "Review only the governed layer required",
  },
  {
    category: "Record preservation",
    market: "Often bundled into consulting",
    ta14: "$9 per preserved record",
  },
  {
    category: "Enterprise governance program",
    market: "$25,000+",
    ta14: "Institutional workspace from $499/month",
  },
];

function money(value: number): string {
  return value === 0 ? "$0" : `$${value}`;
}

export default function GovernedRecordsPricingPage() {
  const [billingMode, setBillingMode] = useState<BillingMode>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("professional");

  const selected = useMemo(
    () => plans.find((plan) => plan.key === selectedPlan) ?? plans[2],
    [selectedPlan],
  );

  return (
    <main className="page-shell">
      <div className="stars" />

      <header className="topbar">
        <Link className="brand" href="/workspace/governed-records">
          <span className="brand-mark">TA-14</span>
          <span>
            <strong>Governed Records</strong>
            <small>Pricing</small>
          </span>
        </Link>

        <nav aria-label="Governed Records">
          <Link href="/workspace/governed-records/my-records">My Records</Link>
          <Link href="/workspace/governed-records/continuity-review">
            Continuity Review
          </Link>
          <Link href="/workspace/governed-records/comparison">
            Record Comparison
          </Link>
          <Link href="/workspace/governed-records/preserved-records">
            Preserved Records
          </Link>
          <Link href="/workspace/governed-records/verification">
            Verification
          </Link>
          <Link className="active" href="/workspace/governed-records/pricing">
            Pricing
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">PAY FOR PRESERVATION — NOT FAVORABLE FINDINGS</p>
          <h1>Use the playground freely. Preserve only what matters.</h1>
          <p className="hero-copy">
            TA-14 separates access, preservation, review, and determination.
            Payment can purchase workspace access or preservation capacity. It
            cannot purchase admissibility, favorable findings, authority, or an
            acceptable outcome.
          </p>
        </div>

        <aside className="principle-card">
          <span>Commercial boundary</span>
          <strong>Payment does not change the record.</strong>
          <p>
            A preserved adverse result remains adverse. A HOLD remains a HOLD.
            A failed verification remains failed until a separately preserved
            correction and re-review establish otherwise.
          </p>
        </aside>
      </section>

      <section className="billing-switch" aria-label="Billing interval">
        <button
          className={billingMode === "monthly" ? "active" : ""}
          type="button"
          onClick={() => setBillingMode("monthly")}
        >
          Monthly
        </button>
        <button
          className={billingMode === "annual" ? "active" : ""}
          type="button"
          onClick={() => setBillingMode("annual")}
        >
          Annual
          <span>Save 20%</span>
        </button>
      </section>

      <section className="plan-grid">
        {plans.map((plan) => {
          const price =
            billingMode === "annual" ? plan.annualMonthly : plan.monthly;
          const active = selectedPlan === plan.key;

          return (
            <article
              className={`plan-card ${active ? "selected" : ""} ${
                plan.key === "professional" ? "featured" : ""
              }`}
              key={plan.key}
            >
              {plan.emphasis ? (
                <span className="emphasis">{plan.emphasis}</span>
              ) : null}

              <div className="plan-heading">
                <p className="eyebrow">{plan.bestFor}</p>
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
              </div>

              <div className="price">
                <strong>{money(price)}</strong>
                {plan.key === "preserve" ? (
                  <span>per preserved record</span>
                ) : price === 0 ? (
                  <span>forever</span>
                ) : (
                  <span>
                    per month
                    {billingMode === "annual" ? ", billed annually" : ""}
                  </span>
                )}
              </div>

              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <button
                className={active ? "primary" : ""}
                type="button"
                onClick={() => setSelectedPlan(plan.key)}
              >
                {active ? "Selected" : plan.cta}
              </button>
            </article>
          );
        })}
      </section>

      <section className="selection-panel">
        <div>
          <p className="eyebrow">SELECTED ACCESS</p>
          <h2>{selected.name}</h2>
          <p>{selected.description}</p>
        </div>

        <div className="selection-summary">
          <span>Current selection</span>
          <strong>
            {selected.key === "preserve"
              ? "$9 per record"
              : selected.monthly === 0
                ? "Free"
                : `${money(
                    billingMode === "annual"
                      ? selected.annualMonthly
                      : selected.monthly,
                  )}/month`}
          </strong>
          <small>
            Checkout and recurring billing are not connected on this
            demonstration page.
          </small>
        </div>

        <div className="selection-actions">
          {selected.key === "free" ? (
            <Link href="/workspace/governed-records">
              Open Governed Records
            </Link>
          ) : selected.key === "preserve" ? (
            <Link href="/workspace/governed-records/preserved-records">
              Prepare a Record
            </Link>
          ) : (
            <a href="mailto:greggbutlerac@gmail.com?subject=TA-14%20Governed%20Records%20Access">
              Request Access
            </a>
          )}
        </div>
      </section>

      <section className="comparison-section">
        <div className="section-heading">
          <p className="eyebrow">WHY THIS PRICING IS DIFFERENT</p>
          <h2>Most systems price the engagement. TA-14 prices the governed layer.</h2>
          <p>
            Organizations should not be forced into a full consulting program
            when they need one record preserved, one continuity question
            reviewed, or one verification boundary examined.
          </p>
        </div>

        <div className="comparison-table">
          <div className="comparison-head">
            <span>Need</span>
            <span>Typical market range</span>
            <span>TA-14 approach</span>
          </div>

          {marketRows.map((row) => (
            <div className="comparison-row" key={row.category}>
              <strong>{row.category}</strong>
              <span>{row.market}</span>
              <span>{row.ta14}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="boundary-grid">
        <article>
          <p className="eyebrow">PAYMENT CAN PURCHASE</p>
          <h3>Access and preservation capacity</h3>
          <ul>
            <li>Workspace access</li>
            <li>Record preservation</li>
            <li>Defined review activity</li>
            <li>Exportable receipts</li>
            <li>Organization capacity</li>
          </ul>
        </article>

        <article>
          <p className="eyebrow">PAYMENT CANNOT PURCHASE</p>
          <h3>Governance outcome</h3>
          <ul>
            <li>Favorable determination</li>
            <li>Admissibility</li>
            <li>Reviewer authority</li>
            <li>Removal of adverse findings</li>
            <li>Guaranteed execution or outcome</li>
          </ul>
        </article>

        <article>
          <p className="eyebrow">EVERY PLAN RETAINS</p>
          <h3>TA-14 separation discipline</h3>
          <ul>
            <li>Record separate from interpretation</li>
            <li>Comparison separate from diagnosis</li>
            <li>Verification separate from approval</li>
            <li>Correction separate from replacement</li>
            <li>Outcome separate from claim</li>
          </ul>
        </article>
      </section>

      <section className="faq-section">
        <div className="section-heading">
          <p className="eyebrow">COMMON QUESTIONS</p>
          <h2>Pricing boundaries</h2>
        </div>

        <div className="faq-grid">
          <article>
            <h3>Is the playground really free?</h3>
            <p>
              Yes. The interactive Governed Records pages can be explored
              without purchasing a preserved artifact.
            </p>
          </article>

          <article>
            <h3>What does the $9 charge cover?</h3>
            <p>
              It covers preservation of one governed artifact with stable
              identity, version, timestamp, integrity reference, and declared
              boundaries.
            </p>
          </article>

          <article>
            <h3>Does preservation prove the record is correct?</h3>
            <p>
              No. Preservation protects the artifact from silent substitution.
              It does not upgrade accuracy, authority, continuity, or truth.
            </p>
          </article>

          <article>
            <h3>Can an organization buy a favorable result?</h3>
            <p>
              No. Commercial participation is deliberately separated from
              findings, determinations, and qualification standing.
            </p>
          </article>
        </div>
      </section>

      <section className="next-panel">
        <div>
          <p className="eyebrow">RETURN TO THE WORKSPACE</p>
          <h2>Build the record before deciding what deserves preservation.</h2>
          <p>
            Explore the sequence freely, preserve the artifact that matters,
            and keep every later review layer visible.
          </p>
        </div>

        <div className="next-actions">
          <Link href="/workspace/governed-records">
            <span>Return to the Governed Records homepage</span>
            <strong>Open Governed Records →</strong>
          </Link>
          <Link href="/workspace/governed-records/preserved-records">
            <span>Review preservation receipts</span>
            <strong>Open Preserved Records →</strong>
          </Link>
        </div>
      </section>

      <footer>
        <strong>No admissible evidence. No admissible execution.</strong>
        <span>
          Pricing governs access and preservation capacity. It does not govern
          the finding.
        </span>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #04100f;
        }

        :global(body) {
          margin: 0;
          background: #04100f;
          color: #eef8f4;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        button {
          font: inherit;
        }

        .page-shell {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 0 28px 48px;
          background:
            radial-gradient(circle at 14% 6%, rgba(37, 190, 152, 0.13), transparent 28%),
            radial-gradient(circle at 84% 18%, rgba(194, 151, 67, 0.11), transparent 24%),
            linear-gradient(180deg, #061513 0%, #03100f 48%, #020b0b 100%);
          isolation: isolate;
        }

        .stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          opacity: 0.34;
          background-image:
            radial-gradient(circle, rgba(255, 255, 255, 0.7) 1px, transparent 1px),
            radial-gradient(circle, rgba(120, 255, 219, 0.42) 1px, transparent 1px);
          background-size: 86px 86px, 137px 137px;
          background-position: 0 0, 21px 39px;
        }

        .topbar {
          width: min(1500px, 100%);
          margin: 0 auto;
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(153, 213, 196, 0.15);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: 16px;
          border: 1px solid rgba(213, 181, 102, 0.65);
          color: #f2d694;
          background: linear-gradient(
            145deg,
            rgba(211, 170, 75, 0.18),
            rgba(18, 52, 45, 0.92)
          );
          font-weight: 900;
          font-size: 13px;
        }

        .brand > span:last-child {
          display: grid;
          gap: 3px;
        }

        .brand strong {
          font-size: 14px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .brand small {
          color: #8eaaa2;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        nav a {
          padding: 10px 12px;
          border-radius: 999px;
          color: #91aaa3;
          font-size: 13px;
          transition: 160ms ease;
        }

        nav a:hover,
        nav a:focus-visible,
        nav a.active {
          color: #f7fffc;
          background: rgba(34, 128, 105, 0.18);
          outline: none;
        }

        .hero {
          width: min(1500px, 100%);
          margin: 0 auto;
          padding: 78px 0 34px;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.6fr);
          gap: 36px;
          align-items: end;
        }

        .eyebrow {
          margin: 0 0 10px;
          color: #73d9bd;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        h1 {
          max-width: 980px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 6vw, 82px);
          line-height: 0.98;
          letter-spacing: -0.045em;
        }

        h2,
        h3,
        p {
          margin-top: 0;
        }

        h2 {
          margin-bottom: 0;
          font-size: 28px;
        }

        .hero-copy {
          max-width: 850px;
          margin: 24px 0 0;
          color: #a8beb8;
          font-size: 18px;
          line-height: 1.75;
        }

        .principle-card,
        .plan-card,
        .selection-panel,
        .comparison-section,
        .boundary-grid article,
        .faq-section,
        .next-panel {
          border: 1px solid rgba(135, 191, 176, 0.16);
          background: linear-gradient(
            180deg,
            rgba(10, 33, 29, 0.92),
            rgba(5, 20, 18, 0.92)
          );
          box-shadow: 0 18px 70px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(16px);
        }

        .principle-card {
          padding: 24px;
          border-radius: 24px;
          border-color: rgba(214, 177, 81, 0.35);
        }

        .principle-card span {
          display: block;
          color: #c9aa59;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .principle-card strong {
          display: block;
          margin: 8px 0;
          font-size: 27px;
          line-height: 1.25;
        }

        .principle-card p {
          margin-bottom: 0;
          color: #aebfba;
          line-height: 1.65;
        }

        .billing-switch {
          width: fit-content;
          margin: 0 auto 28px;
          padding: 5px;
          border-radius: 999px;
          border: 1px solid rgba(134, 186, 172, 0.16);
          background: rgba(4, 18, 16, 0.76);
          display: flex;
          gap: 5px;
        }

        .billing-switch button {
          border: 0;
          border-radius: 999px;
          padding: 11px 18px;
          color: #8fa8a1;
          background: transparent;
          cursor: pointer;
        }

        .billing-switch button.active {
          color: #062019;
          background: linear-gradient(135deg, #7ce5c6, #d9bd6a);
          font-weight: 800;
        }

        .billing-switch span {
          margin-left: 7px;
          font-size: 10px;
        }

        .plan-grid {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .plan-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 690px;
          padding: 24px;
          border-radius: 24px;
          transition: 160ms ease;
        }

        .plan-card.selected {
          border-color: rgba(112, 227, 197, 0.55);
          transform: translateY(-3px);
        }

        .plan-card.featured {
          border-color: rgba(214, 177, 81, 0.34);
        }

        .emphasis {
          position: absolute;
          top: 14px;
          right: 14px;
          padding: 7px 10px;
          border-radius: 999px;
          color: #f2d694;
          background: rgba(202, 157, 55, 0.12);
          border: 1px solid rgba(202, 157, 55, 0.24);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .plan-heading p:last-child {
          min-height: 132px;
          color: #9eb4ae;
          line-height: 1.65;
        }

        .price {
          margin: 20px 0;
          padding: 18px 0;
          border-top: 1px solid rgba(134, 183, 170, 0.12);
          border-bottom: 1px solid rgba(134, 183, 170, 0.12);
        }

        .price strong {
          display: block;
          font-size: 42px;
          line-height: 1;
        }

        .price span {
          display: block;
          margin-top: 7px;
          color: #78938b;
          font-size: 12px;
        }

        ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        li {
          position: relative;
          padding: 9px 0 9px 24px;
          color: #b6c7c2;
          line-height: 1.5;
        }

        li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #72d9bc;
          font-weight: 900;
        }

        .plan-card button,
        .selection-actions a,
        .next-actions a {
          border: 1px solid rgba(134, 186, 172, 0.18);
          border-radius: 12px;
          padding: 12px 14px;
          color: #dbeae6;
          background: rgba(7, 27, 24, 0.9);
          cursor: pointer;
          transition: 160ms ease;
        }

        .plan-card button {
          margin-top: auto;
        }

        .plan-card button.primary,
        .selection-actions a {
          color: #042019;
          background: linear-gradient(135deg, #7ce5c6, #d9bd6a);
          border-color: transparent;
          font-weight: 800;
          text-align: center;
        }

        .selection-panel {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
          padding: 26px;
          border-radius: 24px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 250px 250px;
          gap: 24px;
          align-items: center;
        }

        .selection-panel p {
          margin-bottom: 0;
          color: #9fb4ae;
          line-height: 1.65;
        }

        .selection-summary {
          display: grid;
          gap: 6px;
        }

        .selection-summary span,
        .selection-summary small {
          color: #78938b;
        }

        .selection-summary strong {
          font-size: 27px;
        }

        .selection-actions {
          display: grid;
        }

        .comparison-section,
        .faq-section {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
          padding: 28px;
          border-radius: 24px;
        }

        .section-heading {
          max-width: 900px;
          margin-bottom: 24px;
        }

        .section-heading > p:last-child {
          color: #9fb4ae;
          line-height: 1.7;
        }

        .comparison-table {
          overflow-x: auto;
        }

        .comparison-head,
        .comparison-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1.25fr;
          gap: 18px;
          min-width: 760px;
          padding: 15px 16px;
        }

        .comparison-head {
          color: #6f8c84;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .comparison-row {
          border-top: 1px solid rgba(136, 183, 171, 0.1);
          color: #b7c9c4;
        }

        .boundary-grid {
          width: min(1500px, 100%);
          margin: 0 auto 24px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .boundary-grid article {
          padding: 24px;
          border-radius: 22px;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .faq-grid article {
          padding: 20px;
          border-radius: 17px;
          border: 1px solid rgba(131, 185, 171, 0.12);
          background: rgba(3, 15, 13, 0.62);
        }

        .faq-grid p {
          margin-bottom: 0;
          color: #9fb4ae;
          line-height: 1.7;
        }

        .next-panel {
          width: min(1500px, 100%);
          margin: 0 auto;
          border-radius: 26px;
          padding: 28px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 0.8fr);
          gap: 30px;
          align-items: center;
        }

        .next-panel p {
          color: #a7bbb5;
          line-height: 1.7;
          margin-bottom: 0;
        }

        .next-actions {
          display: grid;
          gap: 12px;
        }

        .next-actions a {
          display: grid;
          gap: 6px;
          padding: 16px 18px;
        }

        .next-actions span {
          color: #809991;
          font-size: 12px;
        }

        footer {
          width: min(1500px, 100%);
          margin: 34px auto 0;
          padding: 22px 0 0;
          display: flex;
          gap: 16px;
          justify-content: space-between;
          color: #6f8881;
          border-top: 1px solid rgba(136, 184, 171, 0.12);
          font-size: 12px;
        }

        footer strong {
          color: #c9aa59;
        }

        @media (max-width: 1180px) {
          .hero,
          .selection-panel,
          .next-panel {
            grid-template-columns: 1fr;
          }

          .plan-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          nav {
            display: none;
          }
        }

        @media (max-width: 760px) {
          .page-shell {
            padding-inline: 16px;
          }

          .hero {
            padding-top: 54px;
          }

          .plan-grid,
          .boundary-grid,
          .faq-grid {
            grid-template-columns: 1fr;
          }

          .plan-card {
            min-height: auto;
          }

          .plan-heading p:last-child {
            min-height: auto;
          }

          footer {
            display: grid;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            transition: none !important;
          }

          .stars {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
