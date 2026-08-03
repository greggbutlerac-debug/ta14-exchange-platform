"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PathwayId =
  | "registry"
  | "review"
  | "demonstration"
  | "artifact"
  | "regulatory"
  | "institutional";

type ConsequenceId =
  | "informational"
  | "operational"
  | "financial"
  | "employment"
  | "healthcare"
  | "public-sector"
  | "safety-critical";

type EvidenceId = "organized" | "partial" | "technical" | "runtime" | "unorganized";
type VisibilityId = "private" | "controlled" | "public";
type PartnerId = "none" | "single" | "dual" | "panel";
type BillingMode = "monthly" | "annual";

type Pathway = {
  id: PathwayId;
  eyebrow: string;
  title: string;
  description: string;
  ta14Price: number;
  marketLow: number;
  marketHigh: number;
  deliverables: string[];
};

type PartnerOption = {
  id: PartnerId;
  title: string;
  price: number;
  marketLow: number;
  marketHigh: number;
  description: string;
};

const pathways: Pathway[] = [
  {
    id: "registry",
    eyebrow: "ESTABLISH THE ENTITY",
    title: "Governance Entity Registration",
    description:
      "Create an attributable, versioned institutional record of the governance entity, its authority, claims, boundaries, evidence, rights, and lifecycle state.",
    ta14Price: 295,
    marketLow: 1200,
    marketHigh: 5000,
    deliverables: [
      "Guided governance intake",
      "Claims and non-claims record",
      "Authority and attribution record",
      "Evidence and integrity metadata",
      "Bounded institutional review",
      "Permanent TA-14 Registry identifier",
      "Public or controlled Registry projection",
    ],
  },
  {
    id: "review",
    eyebrow: "GOVERN THE CLAIM",
    title: "Bounded Governance Review",
    description:
      "Review one declared governance question against an admitted evidence set, explicit authority boundary, recorded rationale, and preserved determination.",
    ta14Price: 995,
    marketLow: 4000,
    marketHigh: 15000,
    deliverables: [
      "Declared review question",
      "Evidence admission boundary",
      "Authority and conflict record",
      "ALLOW / HOLD / DENY / ESCALATE determination",
      "Attributable reviewer rationale",
      "Permanent review history",
      "Challenge and correction pathway",
    ],
  },
  {
    id: "demonstration",
    eyebrow: "PROVE THE CAPABILITY",
    title: "Governed Demonstration",
    description:
      "Construct and preserve a bounded demonstration showing what a governance architecture does, what evidence supports it, and where its claims stop.",
    ta14Price: 2495,
    marketLow: 10000,
    marketHigh: 40000,
    deliverables: [
      "Demonstration scope construction",
      "Governance entity registration",
      "Evidence and confidentiality boundaries",
      "Governed route construction",
      "Observed determination and findings",
      "Publishable demonstration record",
      "Optional institutional case study",
    ],
  },
  {
    id: "artifact",
    eyebrow: "PRESERVE THE EXECUTION",
    title: "Execution Artifact",
    description:
      "Create an inspectable execution artifact preserving the proposed action, evidence, authority, route, determination, execution effect, and outcome boundary.",
    ta14Price: 495,
    marketLow: 2000,
    marketHigh: 8000,
    deliverables: [
      "Bounded consequential route",
      "Admitted evidence references",
      "Authority and continuity checks",
      "Committed determination",
      "Execution and outcome record",
      "Integrity hash package",
      "Permanent artifact verification path",
    ],
  },
  {
    id: "regulatory",
    eyebrow: "MAP THE OBLIGATION",
    title: "Regulatory Readiness Review",
    description:
      "Map a defined system, use case, or governance program against the EU AI Act, NIST AI RMF, ISO/IEC 42001, or a selected institutional framework.",
    ta14Price: 3995,
    marketLow: 15000,
    marketHigh: 60000,
    deliverables: [
      "System and role scoping",
      "Applicable obligation mapping",
      "Evidence-backed support status",
      "Gap and dependency record",
      "HOLD and escalation conditions",
      "Corrective route recommendations",
      "Preserved readiness artifact",
    ],
  },
  {
    id: "institutional",
    eyebrow: "BUILD THE FULL CHAIN",
    title: "Institutional Governance Program",
    description:
      "Establish a multi-system governance program spanning registration, evidence, review, route construction, execution artifacts, outcomes, and continuing institutional oversight.",
    ta14Price: 12500,
    marketLow: 50000,
    marketHigh: 250000,
    deliverables: [
      "Institutional governance architecture",
      "Governance entity and system Registry",
      "Reusable review and route standards",
      "Authority and evidence controls",
      "Execution artifact program",
      "Partner Review Network pathways",
      "Lifecycle, dispute, and supersession controls",
    ],
  },
];

const partnerOptions: PartnerOption[] = [
  {
    id: "none",
    title: "TA-14 Institutional Review",
    price: 0,
    marketLow: 0,
    marketHigh: 0,
    description: "TA-14 conducts the bounded institutional review without an external partner assignment.",
  },
  {
    id: "single",
    title: "One Independent Specialist",
    price: 995,
    marketLow: 4000,
    marketHigh: 9000,
    description: "One qualified PRN reviewer adds an attributable, independently bounded finding.",
  },
  {
    id: "dual",
    title: "Dual Independent Review",
    price: 1995,
    marketLow: 8000,
    marketHigh: 20000,
    description: "Two reviewers preserve separate findings, agreement, disagreement, and stated limitations.",
  },
  {
    id: "panel",
    title: "Multidisciplinary Panel",
    price: 3995,
    marketLow: 16000,
    marketHigh: 40000,
    description: "Three to five reviewers examine a consequential matter across distinct competence domains.",
  },
];

const consequenceModifiers: Record<ConsequenceId, number> = {
  informational: 0,
  operational: 250,
  financial: 750,
  employment: 750,
  healthcare: 1500,
  "public-sector": 1500,
  "safety-critical": 2500,
};

const evidenceModifiers: Record<EvidenceId, number> = {
  organized: 0,
  partial: 250,
  technical: 500,
  runtime: 750,
  unorganized: 995,
};

const visibilityModifiers: Record<VisibilityId, number> = {
  private: 0,
  controlled: 150,
  public: 295,
};

const partnerMemberships = [
  {
    title: "Founding Review Partner",
    price: "Invitation only · $0 during founding period",
    description:
      "For selected early contributors helping establish the governed review network and its first public demonstrations.",
    included: [
      "Founding partner designation",
      "Eligibility for compensated assignments",
      "Partner profile and written boundaries",
      "Demonstration and publication opportunities",
    ],
  },
  {
    title: "Verified Network Partner",
    price: "$795 / year",
    description:
      "For independent reviewers, architects, consultants, academics, and domain specialists.",
    included: [
      "Verified PRN listing",
      "Reviewer orientation",
      "Assignment eligibility",
      "Annual capability update",
    ],
  },
  {
    title: "Governance Entity Partner",
    price: "$1,995 / year",
    description:
      "For governance firms, architecture owners, technical-control providers, and specialist organizations.",
    included: [
      "Organizational partner profile",
      "Up to three participants",
      "One bounded demonstration annually",
      "20% service discount",
    ],
  },
  {
    title: "Institutional Partner",
    price: "$3,995 / year",
    description:
      "For universities, research groups, professional bodies, and larger governance institutions.",
    included: [
      "Up to ten participants",
      "Annual governed demonstration",
      "Co-developed Academy session",
      "Institutional publication pathway",
    ],
  },
];

const workspacePlans = [
  {
    title: "Free Playground",
    monthly: 0,
    annual: 0,
    suffix: "",
    description: "Explore routes, evidence, determinations, and demonstrations without payment.",
    cta: "Open the Playground",
    href: "/workspace",
    items: ["Draft route building", "Governance demonstrations", "Learning pathways", "No payment required"],
  },
  {
    title: "Preserved Governed Run",
    monthly: 9,
    annual: 9,
    suffix: "per run",
    description: "Preserve one attributable route evaluation with evidence references and replay history.",
    cta: "Preserve a Run",
    href: "/workspace/routes",
    items: ["One preserved route", "Decision state", "Replay history", "Downloadable artifact"],
  },
  {
    title: "Exchange Pro",
    monthly: 99,
    annual: 990,
    suffix: "",
    description: "A professional workspace for teams building and preserving consequential governance routes.",
    cta: "Choose Exchange Pro",
    href: "/account",
    items: ["Private route library", "Reusable templates", "Version history", "Priority exports"],
  },
  {
    title: "Organization",
    monthly: 499,
    annual: 4990,
    suffix: "",
    description: "Organization-level infrastructure for multiple teams, records, systems, and reviewers.",
    cta: "Request Access",
    href: "/workspace/entity-review",
    items: ["Role-based workspaces", "Governed record libraries", "Review assignments", "Implementation planning"],
  },
];

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AiGovernancePricingPage() {
  const [pathwayId, setPathwayId] = useState<PathwayId>("registry");
  const [consequence, setConsequence] = useState<ConsequenceId>("operational");
  const [evidence, setEvidence] = useState<EvidenceId>("partial");
  const [visibility, setVisibility] = useState<VisibilityId>("public");
  const [partnerId, setPartnerId] = useState<PartnerId>("none");
  const [step, setStep] = useState(1);
  const [billingMode, setBillingMode] = useState<BillingMode>("monthly");

  const pathway = pathways.find((item) => item.id === pathwayId) ?? pathways[0];
  const partner = partnerOptions.find((item) => item.id === partnerId) ?? partnerOptions[0];

  const configured = useMemo(() => {
    const ta14 =
      pathway.ta14Price +
      consequenceModifiers[consequence] +
      evidenceModifiers[evidence] +
      visibilityModifiers[visibility] +
      partner.price;

    const marketLow =
      pathway.marketLow +
      Math.round(consequenceModifiers[consequence] * 4) +
      Math.round(evidenceModifiers[evidence] * 4) +
      partner.marketLow;

    const marketHigh =
      pathway.marketHigh +
      Math.round(consequenceModifiers[consequence] * 6) +
      Math.round(evidenceModifiers[evidence] * 6) +
      partner.marketHigh;

    const percentage = marketLow > 0 ? Math.round((ta14 / marketLow) * 100) : 0;

    return { ta14, marketLow, marketHigh, percentage };
  }, [pathway, consequence, evidence, visibility, partner]);

  const summaryItems = useMemo(() => {
    const items = [...pathway.deliverables];
    if (partnerId !== "none") items.push(partner.title, "Preserved partner finding and conflict boundary");
    if (visibility === "public") items.push("Public institutional publication pathway");
    if (visibility === "controlled") items.push("Controlled-access publication pathway");
    if (evidence === "unorganized") items.push("Evidence organization and intake support");
    return Array.from(new Set(items));
  }, [pathway, partner, partnerId, visibility, evidence]);

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
            <strong>Governance Pathways</strong>
            <small>TA-14 Authority Governance Institution</small>
          </span>
        </Link>
        <nav>
          <Link href="/">Institution</Link>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/workspace/ai-governance/registry">Registry</Link>
          <Link href="/workspace/ai-governance/partner-review-network">Partner Network</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">GOVERNANCE OF GOVERNANCE</p>
          <h1>One-quarter of the conventional cost. The full institutional chain.</h1>
          <p className="lead">
            TA-14 is not another AI governance consultancy. It is the institution that registers governance entities,
            governs their claims, preserves their evidence, records bounded review, demonstrates capability, creates
            execution artifacts, and maintains permanent institutional history.
          </p>
          <div className="heroStatements">
            <span>More governance</span>
            <span>More evidence</span>
            <span>More permanence</span>
            <span>Lower cost</span>
          </div>
          <div className="heroActions">
            <a className="primaryButton" href="#builder">Build Your Pathway <span>→</span></a>
            <a className="secondaryButton" href="#market">Compare the Market</a>
          </div>
        </div>

        <div className="chainVisual" aria-label="TA-14 full institutional chain">
          <div className="chainCenter">
            <small>THE FULL CHAIN</small>
            <strong>TA-14</strong>
            <span>Governance that governs governance</span>
          </div>
          {["Reality", "Record", "Continuity", "Admissibility", "Binding", "Commit", "Execution", "Outcome"].map((label, index) => (
            <span className={`chainNode node${index + 1}`} key={label}>{label}</span>
          ))}
          <div className="ring ringOne" />
          <div className="ring ringTwo" />
        </div>
      </section>

      <section className="categoryStatement shell">
        <div>
          <p className="eyebrow">A DIFFERENT CATEGORY</p>
          <h2>You are not buying a cheaper report. You are entering a governed institutional pathway.</h2>
        </div>
        <div className="categoryGrid">
          {[
            ["Typical consultancy", "Assessment, policy package, maturity score, or advisory report."],
            ["Typical platform", "Inventory, workflow, dashboard, control mapping, and monitoring."],
            ["TA-14 Authority", "Registration, evidence, review, demonstration, artifact, execution, outcome, and permanent institutional history."],
          ].map(([title, copy], index) => (
            <article className={index === 2 ? "categoryFeatured" : ""} key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="builder shell" id="builder">
        <div className="builderIntro">
          <p className="eyebrow">GUIDED GOVERNANCE CONFIGURATOR</p>
          <h2>Tell us what must be governed.</h2>
          <p>
            Choose the pathway, consequence level, evidence condition, publication boundary, and independent review
            level. Your institutional scope and price update immediately.
          </p>
        </div>

        <div className="builderLayout">
          <div className="builderPanel">
            <div className="progressRail" aria-label="Configurator progress">
              {[1, 2, 3, 4, 5].map((item) => (
                <button
                  type="button"
                  className={step === item ? "active" : step > item ? "complete" : ""}
                  key={item}
                  onClick={() => setStep(item)}
                >
                  <span>{step > item ? "✓" : item}</span>
                  <small>{["Pathway", "Consequence", "Evidence", "Visibility", "Review"][item - 1]}</small>
                </button>
              ))}
            </div>

            {step === 1 && (
              <div className="questionBlock">
                <p className="questionNumber">QUESTION 1 OF 5</p>
                <h3>What are you trying to accomplish?</h3>
                <div className="choiceGrid pathwayChoices">
                  {pathways.map((item) => (
                    <button
                      type="button"
                      className={pathwayId === item.id ? "choice active" : "choice"}
                      onClick={() => setPathwayId(item.id)}
                      key={item.id}
                    >
                      <small>{item.eyebrow}</small>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                      <em>From {money(item.ta14Price)}</em>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="questionBlock">
                <p className="questionNumber">QUESTION 2 OF 5</p>
                <h3>What level of consequence is involved?</h3>
                <div className="choiceGrid compactChoices">
                  {([
                    ["informational", "Informational", "No direct consequence-bearing execution"],
                    ["operational", "Operational", "Workflow, service, or equipment consequence"],
                    ["financial", "Financial", "Payment, credit, claim, or financial eligibility"],
                    ["employment", "Employment", "Hiring, discipline, scheduling, or access"],
                    ["healthcare", "Healthcare", "Clinical, diagnostic, or care-path consequence"],
                    ["public-sector", "Public sector", "Government, civic, benefits, or public authority"],
                    ["safety-critical", "Safety critical", "Physical safety, infrastructure, or high consequence"],
                  ] as [ConsequenceId, string, string][]).map(([id, title, copy]) => (
                    <button type="button" className={consequence === id ? "choice active" : "choice"} onClick={() => setConsequence(id)} key={id}>
                      <strong>{title}</strong><span>{copy}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="questionBlock">
                <p className="questionNumber">QUESTION 3 OF 5</p>
                <h3>What evidence already exists?</h3>
                <div className="choiceGrid compactChoices">
                  {([
                    ["organized", "Organized record", "Claims, scope, evidence, and authority are already organized"],
                    ["partial", "Partial documentation", "Policies and materials exist but require governance organization"],
                    ["technical", "Technical evidence", "Logs, tests, architecture, repositories, or control evidence exist"],
                    ["runtime", "Runtime evidence", "Execution, monitoring, event, or outcome evidence exists"],
                    ["unorganized", "Nothing organized", "TA-14 must guide intake and evidence preparation"],
                  ] as [EvidenceId, string, string][]).map(([id, title, copy]) => (
                    <button type="button" className={evidence === id ? "choice active" : "choice"} onClick={() => setEvidence(id)} key={id}>
                      <strong>{title}</strong><span>{copy}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="questionBlock">
                <p className="questionNumber">QUESTION 4 OF 5</p>
                <h3>How should the resulting institutional record be visible?</h3>
                <div className="choiceGrid compactChoices threeChoices">
                  {([
                    ["private", "Private", "Preserved for the client and authorized TA-14 reviewers"],
                    ["controlled", "Controlled", "Available only through defined access and reliance conditions"],
                    ["public", "Public", "Eligible for permanent Registry publication and public citation"],
                  ] as [VisibilityId, string, string][]).map(([id, title, copy]) => (
                    <button type="button" className={visibility === id ? "choice active" : "choice"} onClick={() => setVisibility(id)} key={id}>
                      <strong>{title}</strong><span>{copy}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="questionBlock">
                <p className="questionNumber">QUESTION 5 OF 5</p>
                <h3>Would independent partner participation strengthen this pathway?</h3>
                <div className="choiceGrid compactChoices">
                  {partnerOptions.map((item) => (
                    <button type="button" className={partnerId === item.id ? "choice active" : "choice"} onClick={() => setPartnerId(item.id)} key={item.id}>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                      <em>{item.price === 0 ? "Included" : `+ ${money(item.price)}`}</em>
                    </button>
                  ))}
                </div>
                <div className="independenceBoundary">
                  <strong>Payment never purchases approval.</strong>
                  <span>Fees pay for governed review work, evidence handling, reviewer time, institutional administration, and preserved outputs.</span>
                </div>
              </div>
            )}

            <div className="builderNav">
              <button type="button" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))}>← Previous</button>
              <button type="button" className="nextButton" disabled={step === 5} onClick={() => setStep((current) => Math.min(5, current + 1))}>Next question →</button>
            </div>
          </div>

          <aside className="liveSummary">
            <div className="summaryTopline">
              <span>YOUR GOVERNANCE PATHWAY</span>
              <i>LIVE</i>
            </div>
            <h3>{pathway.title}</h3>
            <p>{pathway.description}</p>

            <div className="priceComparison">
              <div>
                <small>Typical market equivalent</small>
                <strong>{money(configured.marketLow)}–{money(configured.marketHigh)}</strong>
              </div>
              <div className="ta14Price">
                <small>TA-14 configured price</small>
                <strong>{money(configured.ta14)}</strong>
              </div>
            </div>

            <div className="quarterBar">
              <div><span style={{ width: `${Math.min(100, configured.percentage)}%` }} /></div>
              <p>Approximately {configured.percentage}% of the lower published-market reference range for comparable work.</p>
            </div>

            <div className="summaryDetails">
              <div><small>Consequence</small><strong>{consequence.replace("-", " ")}</strong></div>
              <div><small>Evidence</small><strong>{evidence}</strong></div>
              <div><small>Visibility</small><strong>{visibility}</strong></div>
              <div><small>Independent review</small><strong>{partner.title}</strong></div>
            </div>

            <div className="deliverableList">
              <span>INCLUDED IN THIS PATHWAY</span>
              <ul>{summaryItems.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>

            <Link className="checkoutButton" href="/workspace/entity-review">
              Request Institutional Scope Review <span>→</span>
            </Link>
            <small className="checkoutNote">PayPal checkout activates after scope confirmation and preservation of the governed order record.</small>
          </aside>
        </div>
      </section>

      <section className="market shell" id="market">
        <div className="sectionIntro">
          <p className="eyebrow">MARKET POSITION</p>
          <h2>TA-14 lowers cost by integrating the institution—not by removing governance.</h2>
          <p>
            Published enterprise AI governance and ISO/IEC 42001 reference points show software instances, readiness work,
            implementation, audits, and continuing monitoring can quickly reach thousands or tens of thousands of dollars.
            Many leading governance providers require a sales conversation rather than publishing complete prices.
          </p>
        </div>

        <div className="marketTable">
          <div className="marketHead"><span>Governance need</span><span>Published / typical reference</span><span>TA-14 pathway</span><span>What remains governed</span></div>
          {[
            ["Governance entity registration", "$1,200–$5,000+", "$295", "Identity, authority, claims, evidence, review, identifier, lifecycle"],
            ["Bounded specialist review", "$4,000–$15,000", "$995", "Question, admitted evidence, reviewer rationale, determination, limitations"],
            ["Governed demonstration", "$10,000–$40,000", "$2,495", "Scope, route, evidence, observation, artifact, case-study boundary"],
            ["Execution artifact", "$2,000–$8,000", "$495", "Action, evidence, authority, determination, execution, outcome, integrity"],
            ["Regulatory readiness", "$15,000–$60,000", "$3,995", "Role, obligation, evidence status, gaps, corrective route, preserved record"],
            ["Institutional program", "$50,000–$250,000+", "From $12,500", "Registry, reviews, routes, artifacts, outcomes, PRN, lifecycle governance"],
          ].map((row) => (
            <div className="marketRow" key={row[0]}>{row.map((cell, index) => index === 0 ? <strong key={cell}>{cell}</strong> : <span key={cell}>{cell}</span>)}</div>
          ))}
        </div>
        <div className="sourceNote">
          <strong>Reference discipline:</strong> ranges are positioning estimates assembled from published software pricing,
          published ISO/IEC 42001 cost breakdowns, and market-facing governance offerings. Final comparison depends on matched scope.
        </div>
      </section>

      <section className="partnerNetwork shell">
        <div className="partnerHero">
          <div>
            <p className="eyebrow">PARTNER REVIEW NETWORK</p>
            <h2>Independent expertise without ungoverned opinion.</h2>
            <p>
              The TA-14 Partner Review Network brings governance architectures, reviewers, specialists, researchers, and
              institutions into bounded assignments with written scope, conflict declarations, admitted evidence, attributable
              findings, and permanent institutional records.
            </p>
          </div>
          <div className="networkGraphic" aria-hidden="true">
            <span className="networkCore">TA-14</span>
            <i className="networkNode networkNode1">Architecture</i>
            <i className="networkNode networkNode2">Technical</i>
            <i className="networkNode networkNode3">Legal</i>
            <i className="networkNode networkNode4">Domain</i>
            <i className="networkNode networkNode5">Research</i>
          </div>
        </div>

        <div className="partnerServices">
          {partnerOptions.slice(1).map((item) => (
            <article key={item.id}>
              <span>{money(item.price)}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <small>Market reference: {money(item.marketLow)}–{money(item.marketHigh)}</small>
            </article>
          ))}
          <article>
            <span>From $7,500</span>
            <h3>Institutional Review Program</h3>
            <p>Recurring reviews, multiple systems, multiple departments, or continuing multi-party governance oversight.</p>
            <small>Custom written scope and partner compensation schedule</small>
          </article>
        </div>

        <div className="partnerBoundary">
          <strong>Review is not certification. Membership is not endorsement. Payment is not approval.</strong>
          <p>Every partner relationship remains bounded by declared competence, conflicts, scope, evidence, authority, and recorded limitations.</p>
        </div>
      </section>

      <section className="membership shell">
        <div className="sectionIntro">
          <p className="eyebrow">NETWORK PARTICIPATION</p>
          <h2>Join the institution as a reviewer, governance entity, or institutional partner.</h2>
        </div>
        <div className="membershipGrid">
          {partnerMemberships.map((item) => (
            <article key={item.title}>
              <span>{item.price}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ul>{item.included.map((included) => <li key={included}>{included}</li>)}</ul>
              <Link href="/workspace/ai-governance/partner-review-network">Explore participation <b>→</b></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="workspace shell">
        <div className="workspaceHeader">
          <div>
            <p className="eyebrow">WORKSPACE ACCESS</p>
            <h2>Start free. Preserve when consequence begins.</h2>
          </div>
          <div className="billingToggle">
            <button className={billingMode === "monthly" ? "active" : ""} type="button" onClick={() => setBillingMode("monthly")}>Monthly</button>
            <button className={billingMode === "annual" ? "active" : ""} type="button" onClick={() => setBillingMode("annual")}>Annual</button>
          </div>
        </div>
        <div className="workspaceGrid">
          {workspacePlans.map((plan) => {
            const value = billingMode === "annual" ? plan.annual : plan.monthly;
            return (
              <article key={plan.title}>
                <h3>{plan.title}</h3>
                <div className="workspacePrice"><strong>{money(value)}</strong><span>{plan.suffix || (value === 0 ? "" : billingMode === "annual" ? "/ year" : "/ month")}</span></div>
                <p>{plan.description}</p>
                <ul>{plan.items.map((item) => <li key={item}>{item}</li>)}</ul>
                <Link href={plan.href}>{plan.cta} <span>→</span></Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="checkoutArchitecture shell">
        <div>
          <p className="eyebrow">GOVERNED CHECKOUT</p>
          <h2>The payment will remain bound to a defined institutional scope.</h2>
          <p>
            Before PayPal opens, TA-14 will preserve the selected pathway, deliverables, exclusions, price version,
            visibility boundary, Partner Review Network involvement, and customer authorization. Payment will fund the
            stated work; it will never create approval, admissibility, certification, or a favorable determination.
          </p>
        </div>
        <div className="checkoutSteps">
          {["Configure pathway", "Confirm governed scope", "Create preserved order", "Pay securely through PayPal", "Begin institutional intake"].map((item, index) => (
            <div key={item}><span>{index + 1}</span><strong>{item}</strong></div>
          ))}
        </div>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">THE FULL INSTITUTIONAL CHAIN</p>
          <h2>Do not buy another governance promise. Build a record that can be inspected.</h2>
          <p>Register the entity. Bound the claim. Preserve the evidence. Govern the review. Demonstrate the capability. Record the execution and outcome.</p>
        </div>
        <div className="finalActions">
          <a className="primaryButton" href="#builder">Build Your Pathway <span>→</span></a>
          <Link className="secondaryButton" href="/workspace/entity-review">Request Scope Review</Link>
        </div>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <div>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/workspace/ai-governance/registry">Registry</Link>
          <Link href="/workspace/ai-governance/partner-review-network">Partner Review Network</Link>
        </div>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { background: #030711; scroll-behavior: smooth; }
        :global(body) {
          margin: 0;
          color: #f7fbff;
          background:
            radial-gradient(circle at 12% 6%, rgba(52, 118, 230, 0.15), transparent 28%),
            radial-gradient(circle at 88% 20%, rgba(54, 203, 255, 0.1), transparent 26%),
            linear-gradient(180deg, #030711 0%, #07101f 48%, #040813 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        main { min-height: 100vh; position: relative; overflow: hidden; isolation: isolate; }
        .shell { width: min(1320px, calc(100% - 36px)); margin-inline: auto; position: relative; z-index: 2; }
        .stars { position: fixed; inset: -14%; pointer-events: none; z-index: -4; opacity: .32; }
        .starsOne { background-image: radial-gradient(circle, rgba(255,255,255,.72) 0 1px, transparent 1.4px); background-size: 92px 92px; animation: starDrift 35s linear infinite; }
        .starsTwo { background-image: radial-gradient(circle, rgba(91,176,255,.58) 0 1px, transparent 1.4px); background-size: 156px 156px; background-position: 39px 58px; animation: starDrift 50s linear infinite reverse; }
        .glow { position: fixed; width: 520px; height: 520px; border-radius: 999px; filter: blur(135px); opacity: .11; z-index: -3; animation: glowMove 15s ease-in-out infinite alternate; }
        .glowOne { left: -190px; top: -190px; background: #346dff; }
        .glowTwo { right: -190px; top: 44%; background: #31bdf4; animation-delay: -6s; }
        .topbar { min-height: 86px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid rgba(132,154,188,.16); }
        .brand { display: flex; align-items: center; gap: 12px; color: white; text-decoration: none; }
        .brandMark { min-width: 66px; height: 40px; border-radius: 999px; display: grid; place-items: center; color: #04111d; background: linear-gradient(135deg, #5caeff, #d3f4ff); font-size: 13px; font-weight: 950; letter-spacing: .05em; }
        .brand > span:last-child { display: flex; flex-direction: column; }
        .brand small { color: #7e91a6; margin-top: 2px; }
        nav, footer div { display: flex; gap: 22px; }
        nav a, footer a { color: #a9b8ca; text-decoration: none; font-size: 14px; }
        .hero { min-height: 760px; display: grid; grid-template-columns: 1.1fr .9fr; gap: 52px; align-items: center; padding: 82px 0; }
        .eyebrow { margin: 0; color: #69b8ff; font-size: 11px; font-weight: 950; letter-spacing: .18em; }
        h1 { max-width: 930px; margin: 18px 0 24px; font-size: clamp(54px, 7vw, 96px); line-height: .96; letter-spacing: -.065em; }
        .lead { max-width: 800px; margin: 0; color: #a2b3c6; font-size: 19px; line-height: 1.7; }
        .heroStatements { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
        .heroStatements span { padding: 9px 12px; border-radius: 999px; color: #cde9ff; border: 1px solid rgba(92,174,255,.24); background: rgba(66,142,224,.08); font-size: 12px; font-weight: 850; }
        .heroActions, .finalActions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
        .primaryButton, .secondaryButton { min-height: 56px; display: inline-flex; align-items: center; justify-content: center; gap: 24px; border-radius: 14px; padding: 0 22px; text-decoration: none; font-weight: 900; }
        .primaryButton { color: #04111d; background: linear-gradient(135deg, #5caeff, #d3f4ff); box-shadow: 0 14px 42px rgba(71,160,255,.2); }
        .secondaryButton { color: #dce8f4; border: 1px solid rgba(130,162,188,.26); background: rgba(255,255,255,.035); }
        .chainVisual { min-height: 560px; position: relative; display: grid; place-items: center; }
        .chainCenter { width: 240px; height: 240px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border: 1px solid rgba(105,181,255,.72); background: radial-gradient(circle, rgba(64,137,255,.2), rgba(7,18,36,.97) 68%); box-shadow: 0 0 56px rgba(67,146,255,.3), inset 0 0 34px rgba(64,151,255,.16); z-index: 3; }
        .chainCenter small { color: #79bbff; font-weight: 950; letter-spacing: .14em; }
        .chainCenter strong { margin: 8px 0; font-size: 56px; letter-spacing: -.07em; }
        .chainCenter span { max-width: 155px; color: #91a8bd; font-size: 12px; }
        .ring { position: absolute; border-radius: 50%; border: 1px solid rgba(100,174,255,.18); }
        .ringOne { width: 360px; height: 360px; }
        .ringTwo { width: 500px; height: 500px; }
        .chainNode { position: absolute; min-width: 92px; padding: 8px 10px; border-radius: 999px; color: #dceeff; border: 1px solid rgba(96,179,255,.24); background: rgba(6,15,29,.92); text-align: center; font-size: 11px; font-weight: 900; z-index: 4; box-shadow: 0 10px 32px rgba(0,0,0,.2); }
        .node1 { top: 18px; left: 50%; transform: translateX(-50%); }.node2 { top: 95px; right: 34px; }.node3 { top: 50%; right: -2px; transform: translateY(-50%); }.node4 { bottom: 95px; right: 34px; }.node5 { bottom: 18px; left: 50%; transform: translateX(-50%); }.node6 { bottom: 95px; left: 34px; }.node7 { top: 50%; left: -2px; transform: translateY(-50%); }.node8 { top: 95px; left: 34px; }
        .categoryStatement, .builder, .market, .partnerNetwork, .membership, .workspace, .checkoutArchitecture, .finalCta { border: 1px solid rgba(131,155,189,.16); background: linear-gradient(180deg, rgba(12,21,36,.91), rgba(7,13,24,.95)); border-radius: 28px; box-shadow: 0 24px 80px rgba(0,0,0,.24); }
        .categoryStatement { padding: 54px; }
        .categoryStatement h2, .builderIntro h2, .sectionIntro h2, .partnerHero h2, .workspaceHeader h2, .checkoutArchitecture h2, .finalCta h2 { margin: 14px 0 16px; font-size: clamp(34px, 5vw, 60px); line-height: 1.03; letter-spacing: -.05em; }
        .categoryGrid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; margin-top: 32px; }
        .categoryGrid article { padding: 24px; border-radius: 20px; border: 1px solid rgba(119,155,190,.15); background: rgba(5,13,25,.72); }
        .categoryGrid article.categoryFeatured { border-color: rgba(103,185,255,.55); background: linear-gradient(180deg, rgba(66,142,224,.13), rgba(5,13,25,.82)); }
        .categoryGrid span { color: #69b5ff; font-size: 11px; font-weight: 950; letter-spacing: .15em; }
        .categoryGrid h3 { margin: 15px 0 10px; font-size: 24px; }
        .categoryGrid p, .builderIntro p, .sectionIntro p, .partnerHero p, .checkoutArchitecture p, .finalCta p { color: #9fafc2; line-height: 1.68; }
        .builder, .market, .partnerNetwork, .membership, .workspace, .checkoutArchitecture { margin-top: 24px; padding: 44px; }
        .builderIntro { max-width: 960px; }
        .builderLayout { display: grid; grid-template-columns: minmax(0,1.35fr) minmax(340px,.65fr); gap: 18px; margin-top: 32px; align-items: start; }
        .builderPanel, .liveSummary { border-radius: 22px; border: 1px solid rgba(121,156,191,.16); background: rgba(4,11,22,.78); }
        .builderPanel { padding: 22px; }
        .progressRail { display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: 8px; padding-bottom: 22px; border-bottom: 1px solid rgba(126,156,191,.13); }
        .progressRail button { display: flex; flex-direction: column; align-items: center; gap: 7px; border: 0; color: #71859a; background: transparent; cursor: pointer; }
        .progressRail button span { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; border: 1px solid rgba(121,156,191,.24); background: rgba(255,255,255,.025); font-weight: 900; }
        .progressRail button.active { color: #dff3ff; }.progressRail button.active span { color: #04111d; border-color: transparent; background: #76c2ff; box-shadow: 0 0 24px rgba(104,185,255,.28); }.progressRail button.complete span { color: #a9dfc6; border-color: rgba(91,205,151,.34); background: rgba(65,174,122,.09); }
        .questionBlock { padding-top: 24px; min-height: 560px; }
        .questionNumber { margin: 0; color: #6eb7ff; font-size: 10px; font-weight: 950; letter-spacing: .14em; }
        .questionBlock h3 { margin: 10px 0 22px; font-size: clamp(28px,4vw,46px); letter-spacing: -.04em; }
        .choiceGrid { display: grid; gap: 12px; }.pathwayChoices { grid-template-columns: repeat(2,minmax(0,1fr)); }.compactChoices { grid-template-columns: repeat(2,minmax(0,1fr)); }.threeChoices { grid-template-columns: repeat(3,minmax(0,1fr)); }
        .choice { min-height: 138px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 18px; border-radius: 16px; border: 1px solid rgba(121,156,191,.16); background: rgba(255,255,255,.018); color: #f5f9fc; text-align: left; cursor: pointer; transition: .2s ease; }
        .choice:hover { transform: translateY(-2px); border-color: rgba(102,184,255,.36); }.choice.active { border-color: rgba(103,185,255,.72); background: linear-gradient(180deg, rgba(66,142,224,.16), rgba(11,26,47,.42)); box-shadow: 0 12px 34px rgba(32,101,177,.12); }
        .choice small { color: #6fb8ff; font-size: 9px; font-weight: 950; letter-spacing: .12em; }.choice strong { font-size: 18px; }.choice span { color: #9fafc2; line-height: 1.5; }.choice em { margin-top: auto; color: #d9ecfa; font-style: normal; font-size: 12px; font-weight: 900; }
        .builderNav { display: flex; justify-content: space-between; gap: 12px; padding-top: 22px; border-top: 1px solid rgba(126,156,191,.13); }
        .builderNav button { min-height: 46px; padding: 0 16px; border-radius: 12px; border: 1px solid rgba(121,156,191,.18); background: rgba(255,255,255,.025); color: #b7c7d8; cursor: pointer; font-weight: 850; }.builderNav button:disabled { opacity: .35; cursor: not-allowed; }.builderNav .nextButton { color: #06111c; border: 0; background: linear-gradient(135deg,#63b5ff,#d4f4ff); }
        .independenceBoundary { margin-top: 14px; padding: 16px; border-radius: 14px; border: 1px solid rgba(255,196,103,.2); background: rgba(217,151,46,.05); display: flex; flex-direction: column; gap: 5px; }.independenceBoundary strong { color: #ffd18b; }.independenceBoundary span { color: #b7a98f; line-height: 1.5; }
        .liveSummary { position: sticky; top: 18px; padding: 24px; }
        .summaryTopline { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: #6fb8ff; font-size: 10px; font-weight: 950; letter-spacing: .13em; }.summaryTopline i { padding: 5px 8px; border-radius: 999px; color: #a9dfc6; background: rgba(65,174,122,.08); border: 1px solid rgba(91,205,151,.2); font-style: normal; }
        .liveSummary h3 { margin: 14px 0 10px; font-size: 30px; letter-spacing: -.04em; }.liveSummary > p { color: #9fafc2; line-height: 1.58; }
        .priceComparison { display: grid; gap: 10px; margin-top: 22px; }.priceComparison > div { padding: 15px; border-radius: 14px; border: 1px solid rgba(121,156,191,.15); background: rgba(255,255,255,.02); }.priceComparison small { display: block; color: #8498ad; margin-bottom: 7px; }.priceComparison strong { font-size: 24px; letter-spacing: -.04em; }.priceComparison .ta14Price { border-color: rgba(103,185,255,.5); background: rgba(66,142,224,.1); }.priceComparison .ta14Price strong { color: #dff4ff; font-size: 38px; }
        .quarterBar { margin-top: 16px; }.quarterBar > div { height: 10px; overflow: hidden; border-radius: 999px; background: rgba(255,255,255,.06); }.quarterBar span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg,#5caeff,#bfeaff); }.quarterBar p { margin: 8px 0 0; color: #8094a9; font-size: 11px; line-height: 1.45; }
        .summaryDetails { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; margin-top: 18px; }.summaryDetails div { padding: 11px; border-radius: 12px; background: rgba(255,255,255,.02); border: 1px solid rgba(121,156,191,.11); }.summaryDetails small { display: block; color: #778ba0; text-transform: uppercase; font-size: 8px; letter-spacing: .1em; }.summaryDetails strong { display: block; margin-top: 5px; font-size: 12px; text-transform: capitalize; }
        .deliverableList { margin-top: 20px; padding-top: 18px; border-top: 1px solid rgba(126,156,191,.13); }.deliverableList > span { color: #6fb8ff; font-size: 9px; font-weight: 950; letter-spacing: .13em; }.deliverableList ul { margin: 12px 0 0; padding-left: 20px; color: #b6c4d4; }.deliverableList li { margin-bottom: 8px; line-height: 1.45; font-size: 13px; }
        .checkoutButton { min-height: 52px; margin-top: 20px; display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 0 16px; border-radius: 13px; color: #04111d; background: linear-gradient(135deg,#5caeff,#d3f4ff); text-decoration: none; font-weight: 950; }.checkoutNote { display: block; margin-top: 10px; color: #71859a; line-height: 1.45; }
        .market .sectionIntro, .membership .sectionIntro { max-width: 980px; }.marketTable { margin-top: 28px; overflow: hidden; border-radius: 18px; border: 1px solid rgba(128,155,188,.16); }.marketHead,.marketRow { display: grid; grid-template-columns: .8fr .75fr .55fr 1.35fr; gap: 16px; padding: 18px 20px; }.marketHead { color: #75bcff; background: rgba(68,143,223,.08); font-size: 10px; font-weight: 950; letter-spacing: .1em; text-transform: uppercase; }.marketRow { border-top: 1px solid rgba(128,155,188,.12); color: #aebed0; }.marketRow strong { color: #e4eef8; }.sourceNote { margin-top: 16px; padding: 15px 17px; border-radius: 14px; border: 1px solid rgba(121,156,191,.14); color: #879aad; line-height: 1.55; font-size: 12px; }.sourceNote strong { color: #bed1e4; }
        .partnerHero { display: grid; grid-template-columns: 1.1fr .9fr; gap: 36px; align-items: center; }.networkGraphic { min-height: 360px; position: relative; display: grid; place-items: center; }.networkCore { width: 110px; height: 110px; display: grid; place-items: center; border-radius: 50%; color: #07111d; background: linear-gradient(135deg,#65b6ff,#d5f5ff); font-weight: 950; box-shadow: 0 0 42px rgba(91,174,255,.3); }.networkNode { position: absolute; min-width: 88px; padding: 9px 11px; border-radius: 999px; color: #dceeff; background: rgba(7,16,29,.95); border: 1px solid rgba(96,179,255,.25); text-align: center; font-style: normal; font-size: 11px; }.networkNode1{top:18px}.networkNode2{right:20px;top:110px}.networkNode3{right:48px;bottom:48px}.networkNode4{left:48px;bottom:48px}.networkNode5{left:20px;top:110px}
        .partnerServices { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 13px; margin-top: 30px; }.partnerServices article { padding: 22px; border-radius: 18px; border: 1px solid rgba(112,168,219,.16); background: rgba(58,118,185,.05); }.partnerServices span { color: #74baff; font-size: 13px; font-weight: 950; }.partnerServices h3 { margin: 14px 0 10px; font-size: 22px; }.partnerServices p { color: #9fafc2; line-height: 1.58; }.partnerServices small { color: #73889e; line-height: 1.4; }.partnerBoundary { margin-top: 16px; padding: 19px; border-radius: 16px; border: 1px solid rgba(255,196,103,.2); background: rgba(217,151,46,.05); }.partnerBoundary strong { color: #ffd18b; }.partnerBoundary p { margin: 7px 0 0; color: #b7a98f; line-height: 1.55; }
        .membershipGrid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 14px; margin-top: 28px; }.membershipGrid article, .workspaceGrid article { padding: 24px; border-radius: 20px; border: 1px solid rgba(121,156,191,.16); background: rgba(5,13,25,.72); }.membershipGrid > article > span { color: #72b9ff; font-size: 11px; font-weight: 950; text-transform: uppercase; letter-spacing: .08em; }.membershipGrid h3, .workspaceGrid h3 { margin: 14px 0 10px; font-size: 25px; letter-spacing: -.035em; }.membershipGrid p, .workspaceGrid p { color: #9fafc2; line-height: 1.58; }.membershipGrid ul, .workspaceGrid ul { padding-left: 20px; color: #b6c4d4; }.membershipGrid li, .workspaceGrid li { margin-bottom: 8px; line-height: 1.45; }.membershipGrid a, .workspaceGrid a { min-height: 46px; margin-top: 18px; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; border-radius: 12px; border: 1px solid rgba(99,179,255,.25); color: #8bc9ff; background: rgba(66,142,224,.07); text-decoration: none; font-weight: 850; }
        .workspaceHeader { display: flex; justify-content: space-between; align-items: end; gap: 28px; }.workspaceHeader > div:first-child { max-width: 860px; }.billingToggle { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; min-width: 230px; padding: 5px; border-radius: 14px; border: 1px solid rgba(126,157,193,.17); background: rgba(4,11,22,.72); }.billingToggle button { min-height: 40px; border: 0; border-radius: 10px; background: transparent; color: #96a8bc; cursor: pointer; font-weight: 850; }.billingToggle button.active { background: rgba(72,154,239,.14); color: #eaf6ff; }.workspaceGrid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 14px; margin-top: 28px; }.workspacePrice { min-height: 56px; display: flex; align-items: baseline; gap: 7px; }.workspacePrice strong { font-size: 42px; letter-spacing: -.06em; }.workspacePrice span { color: #8296aa; font-size: 12px; }
        .checkoutArchitecture { display: grid; grid-template-columns: 1.05fr .95fr; gap: 38px; align-items: center; }.checkoutSteps { display: grid; gap: 10px; }.checkoutSteps div { min-height: 58px; display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 14px; border: 1px solid rgba(121,156,191,.14); background: rgba(255,255,255,.02); }.checkoutSteps span { width: 31px; height: 31px; display: grid; place-items: center; border-radius: 50%; color: #06111c; background: #71bdff; font-weight: 950; }
        .finalCta { margin-top: 78px; padding: 56px 48px; display: flex; justify-content: space-between; align-items: center; gap: 30px; }.finalCta > div:first-child { max-width: 760px; }.finalActions { margin-top: 0; justify-content: flex-end; }
        footer { min-height: 130px; display: flex; align-items: center; justify-content: space-between; gap: 24px; color: #74869a; font-size: 12px; }
        @keyframes starDrift { from{transform:translate3d(0,0,0)} to{transform:translate3d(90px,140px,0)} } @keyframes glowMove { from{transform:translate3d(0,0,0) scale(1)} to{transform:translate3d(55px,35px,0) scale(1.1)} }
        @media(max-width:1080px){ nav{display:none}.hero,.partnerHero,.checkoutArchitecture{grid-template-columns:1fr}.chainVisual{min-height:520px}.builderLayout{grid-template-columns:1fr}.liveSummary{position:relative;top:auto}.partnerServices,.membershipGrid,.workspaceGrid{grid-template-columns:repeat(2,minmax(0,1fr))}.marketHead,.marketRow{grid-template-columns:1fr 1fr}.marketHead span:nth-child(n+3){display:none}.categoryGrid{grid-template-columns:1fr}.finalCta{flex-direction:column;align-items:flex-start}.finalActions{justify-content:flex-start}}
        @media(max-width:720px){ .shell{width:min(100% - 20px,1320px)}.hero{min-height:auto;padding:58px 0}.chainVisual{transform:scale(.78);margin:-52px 0}.categoryStatement,.builder,.market,.partnerNetwork,.membership,.workspace,.checkoutArchitecture,.finalCta{padding:28px 22px}.progressRail small{display:none}.pathwayChoices,.compactChoices,.threeChoices,.partnerServices,.membershipGrid,.workspaceGrid{grid-template-columns:1fr}.questionBlock{min-height:auto}.marketHead{display:none}.marketRow{grid-template-columns:1fr}.workspaceHeader{flex-direction:column;align-items:flex-start}.billingToggle{width:100%}.summaryDetails{grid-template-columns:1fr}.finalCta{margin-top:48px}footer{flex-direction:column;justify-content:center;align-items:flex-start}footer div{flex-wrap:wrap}}
      `}</style>
    </main>
  );
}
