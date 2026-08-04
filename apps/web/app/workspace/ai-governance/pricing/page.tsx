/**
 * TA-14 Authority Governance Institution
 * Commercial Experience V4 - Free Registration and Governed Paid Pathways
 * Repository path: apps/web/app/workspace/ai-governance/pricing/page.tsx
 *
 * This source preserves the production PayPal create-order and capture-order
 * integration already present in the repository while separating free self-service
 * governance entity registration from paid evidence preparation, institutional
 * review, demonstrations, artifacts, regulatory readiness, institutional programs,
 * Partner Review Network participation, workspace plans, governed checkout, and
 * Pay Later messaging, transparent scope-ledger pricing, financing planning, a live institutional route, an engagement-letter preview, deliverable records, and a preserved institutional record preview as one institutional engagement experience.
 */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

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
type FinancingTerm = 6 | 12 | 24;
type EngagementProfileId = "independent" | "organization" | "institutional";

type PayPalProductId =
  | "preserved-governed-run"
  | "independent-partner-review"
  | "dual-partner-review"
  | "architecture-demonstration"
  | "multidisciplinary-review-panel"
  | "exchange-pro-monthly"
  | "exchange-pro-annual"
  | "organization-monthly"
  | "organization-annual"
  | "verified-network-partner-annual"
  | "governance-entity-partner-annual"
  | "institutional-partner-annual";

type CheckoutProduct = {
  id: PayPalProductId;
  name: string;
  price: number;
  billing: string;
};

type PayPalButtonsInstance = {
  render: (target: HTMLElement) => Promise<void>;
  isEligible?: () => boolean;
};

type PayPalMessagesInstance = { render: (target: HTMLElement) => Promise<void> };

type PayPalNamespace = {
  Buttons: (options: Record<string, unknown>) => PayPalButtonsInstance;
  Messages?: (options: Record<string, unknown>) => PayPalMessagesInstance;
};

declare global {
  interface Window { paypal?: PayPalNamespace }
}


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
    eyebrow: "PREPARE AND REVIEW THE REGISTERED ENTITY",
    title: "Registered Entity Evidence & Institutional Review",
    description:
      "After free governance entity registration, TA-14 organizes the entity's declared claims, public and controlled evidence, authority boundaries, DOI, patent, Zenodo, publication, repository, and standards references for bounded institutional review and an enhanced Registry projection.",
    ta14Price: 1000,
    marketLow: 2500,
    marketHigh: 10000,
    deliverables: [
      "Guided post-registration evidence intake",
      "Claims and non-claims review record",
      "Authority and attribution analysis",
      "DOI, patent, Zenodo, publication, repository, and standards evidence map",
      "Evidence admission and integrity metadata",
      "Bounded TA-14 institutional review",
      "Enhanced public or controlled Registry projection",
    ],
  },
  {
    id: "review",
    eyebrow: "GOVERN THE CLAIM",
    title: "Bounded Governance Review",
    description:
      "Review one declared governance question against an admitted evidence set, explicit authority boundary, recorded rationale, and preserved determination.",
    ta14Price: 3000,
    marketLow: 7500,
    marketHigh: 25000,
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
    ta14Price: 8000,
    marketLow: 20000,
    marketHigh: 75000,
    deliverables: [
      "Demonstration scope construction",
      "Free governance entity registration prerequisite confirmed",
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
    ta14Price: 2000,
    marketLow: 5000,
    marketHigh: 15000,
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
    ta14Price: 12000,
    marketLow: 30000,
    marketHigh: 100000,
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
    ta14Price: 40000,
    marketLow: 100000,
    marketHigh: 350000,
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
    price: 2000,
    marketLow: 4000,
    marketHigh: 9000,
    description: "One qualified PRN reviewer adds an attributable, independently bounded finding.",
  },
  {
    id: "dual",
    title: "Dual Independent Review",
    price: 4000,
    marketLow: 8000,
    marketHigh: 20000,
    description: "Two reviewers preserve separate findings, agreement, disagreement, and stated limitations.",
  },
  {
    id: "panel",
    title: "Multidisciplinary Panel",
    price: 8000,
    marketLow: 16000,
    marketHigh: 40000,
    description: "Three to five reviewers examine a consequential matter across distinct competence domains.",
  },
];

const consequenceModifiers: Record<ConsequenceId, number> = {
  informational: 0,
  operational: 500,
  financial: 1500,
  employment: 1500,
  healthcare: 3000,
  "public-sector": 3000,
  "safety-critical": 5000,
};

const evidenceModifiers: Record<EvidenceId, number> = {
  organized: 0,
  partial: 500,
  technical: 1000,
  runtime: 1500,
  unorganized: 2000,
};

const visibilityModifiers: Record<VisibilityId, number> = {
  private: 0,
  controlled: 250,
  public: 500,
};

const engagementProfiles = [
  {
    id: "independent" as EngagementProfileId,
    title: "Independent Builder",
    multiplier: 0.8,
    description: "Accessible founder pricing for independent architects, researchers, and emerging governance entities.",
  },
  {
    id: "organization" as EngagementProfileId,
    title: "Organization",
    multiplier: 1,
    description: "Standard pricing for companies, governance firms, technical providers, and established operating teams.",
  },
  {
    id: "institutional" as EngagementProfileId,
    title: "Institution",
    multiplier: 1.2,
    description: "Expanded institutional pricing for universities, public bodies, professional organizations, and complex enterprises.",
  },
];

function profilePrice(value: number, multiplier: number) {
  return Math.round((value * multiplier) / 50) * 50;
}

function startingPrice(pathway: Pathway) {
  return profilePrice(pathway.ta14Price, engagementProfiles[0].multiplier);
}

const partnerMemberships = [
  {
    title: "Founding Review Partner",
    productId: null as PayPalProductId | null,
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
    productId: "verified-network-partner-annual" as PayPalProductId,
    price: "$995 / year",
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
    productId: "governance-entity-partner-annual" as PayPalProductId,
    price: "$2,995 / year",
    description:
      "For governance firms, architecture owners, technical-control providers, and specialist organizations.",
    included: [
      "Organizational partner profile",
      "Up to three participants",
      "$2,000 annual governed-service credit",
      "20% service discount",
    ],
  },
  {
    title: "Institutional Partner",
    productId: "institutional-partner-annual" as PayPalProductId,
    price: "$6,995 / year",
    description:
      "For universities, research groups, professional bodies, and larger governance institutions.",
    included: [
      "Up to ten participants",
      "$5,000 annual governed-service credit",
      "Co-developed Academy session",
      "Institutional publication pathway",
    ],
  },
];

const workspacePlans = [
  {
    title: "Free Playground",
    monthlyProductId: null as PayPalProductId | null,
    annualProductId: null as PayPalProductId | null,
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
    monthlyProductId: "preserved-governed-run" as PayPalProductId,
    annualProductId: "preserved-governed-run" as PayPalProductId,
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
    monthlyProductId: "exchange-pro-monthly" as PayPalProductId,
    annualProductId: "exchange-pro-annual" as PayPalProductId,
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
    monthlyProductId: "organization-monthly" as PayPalProductId,
    annualProductId: "organization-annual" as PayPalProductId,
    monthly: 499,
    annual: 4990,
    suffix: "",
    description: "Organization-level infrastructure for multiple teams, records, systems, and reviewers.",
    cta: "Request Access",
    href: "/workspace/entity-review",
    items: ["Role-based workspaces", "Governed record libraries", "Review assignments", "Implementation planning"],
  },
];

const checkoutCatalog: Record<PayPalProductId, CheckoutProduct> = {
  "preserved-governed-run": { id: "preserved-governed-run", name: "Preserved Governed Run", price: 9, billing: "one-time" },
  "independent-partner-review": { id: "independent-partner-review", name: "Independent Partner Review", price: 2000, billing: "one-time" },
  "dual-partner-review": { id: "dual-partner-review", name: "Dual-Partner Review", price: 4000, billing: "one-time" },
  "architecture-demonstration": { id: "architecture-demonstration", name: "Architecture-to-Architecture Demonstration", price: 8000, billing: "one-time" },
  "multidisciplinary-review-panel": { id: "multidisciplinary-review-panel", name: "Multidisciplinary Review Panel", price: 8000, billing: "one-time" },
  "exchange-pro-monthly": { id: "exchange-pro-monthly", name: "TA-14 Exchange Pro — Monthly", price: 99, billing: "monthly access purchase" },
  "exchange-pro-annual": { id: "exchange-pro-annual", name: "TA-14 Exchange Pro — Annual", price: 990, billing: "annual access purchase" },
  "organization-monthly": { id: "organization-monthly", name: "TA-14 Organization Workspace — Monthly", price: 499, billing: "monthly access purchase" },
  "organization-annual": { id: "organization-annual", name: "TA-14 Organization Workspace — Annual", price: 4990, billing: "annual access purchase" },
  "verified-network-partner-annual": { id: "verified-network-partner-annual", name: "Verified Network Partner — Annual", price: 995, billing: "annual" },
  "governance-entity-partner-annual": { id: "governance-entity-partner-annual", name: "Governance Entity Partner — Annual", price: 2995, billing: "annual" },
  "institutional-partner-annual": { id: "institutional-partner-annual", name: "Institutional Partner — Annual", price: 6995, billing: "annual" },
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AiGovernancePricingPage() {
  const [pathwayId, setPathwayId] = useState<PathwayId>("registry");
  const [profileId, setProfileId] = useState<EngagementProfileId>("independent");
  const [consequence, setConsequence] = useState<ConsequenceId>("operational");
  const [evidence, setEvidence] = useState<EvidenceId>("partial");
  const [visibility, setVisibility] = useState<VisibilityId>("public");
  const [partnerId, setPartnerId] = useState<PartnerId>("none");
  const [step, setStep] = useState(1);
  const [billingMode, setBillingMode] = useState<BillingMode>("monthly");
  const [financingTerm, setFinancingTerm] = useState<FinancingTerm>(12);
  const [checkoutProduct, setCheckoutProduct] = useState<CheckoutProduct | null>(null);
  const [paypalReady, setPayPalReady] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "creating" | "capturing" | "success" | "cancelled" | "error">("idle");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const paypalButtonsRef = useRef<HTMLDivElement | null>(null);
  const paypalMessageRef = useRef<HTMLDivElement | null>(null);
  const renderedProductRef = useRef<string | null>(null);

  const pathway = pathways.find((item) => item.id === pathwayId) ?? pathways[0];
  const partner = partnerOptions.find((item) => item.id === partnerId) ?? partnerOptions[0];
  const engagementProfile = engagementProfiles.find((item) => item.id === profileId) ?? engagementProfiles[0];

  const configured = useMemo(() => {
    const baseScope = profilePrice(pathway.ta14Price, engagementProfile.multiplier);
    const consequenceAdjustment = profilePrice(consequenceModifiers[consequence], engagementProfile.multiplier);
    const evidenceAdjustment = profilePrice(evidenceModifiers[evidence], engagementProfile.multiplier);
    const visibilityAdjustment = profilePrice(visibilityModifiers[visibility], engagementProfile.multiplier);

    const ta14 = baseScope + consequenceAdjustment + evidenceAdjustment + visibilityAdjustment + partner.price;

    const marketLow =
      pathway.marketLow +
      Math.round(consequenceModifiers[consequence] * 2.5) +
      Math.round(evidenceModifiers[evidence] * 2.5) +
      Math.round(visibilityModifiers[visibility] * 2.5) +
      partner.marketLow;

    const marketHigh =
      pathway.marketHigh +
      Math.round(consequenceModifiers[consequence] * 4) +
      Math.round(evidenceModifiers[evidence] * 4) +
      Math.round(visibilityModifiers[visibility] * 4) +
      partner.marketHigh;

    const percentage = marketLow > 0 ? Math.round((ta14 / marketLow) * 100) : 0;
    const savingsPercentage = marketLow > 0 ? Math.max(0, 100 - percentage) : 0;

    const breakdown = [
      { label: `${pathway.title} - ${engagementProfile.title}`, value: baseScope },
      { label: `${consequence.replace("-", " ")} consequence adjustment`, value: consequenceAdjustment },
      { label: `${evidence} evidence preparation`, value: evidenceAdjustment },
      { label: `${visibility} visibility boundary`, value: visibilityAdjustment },
      { label: partner.title, value: partner.price },
    ].filter((item) => item.value > 0);

    return { ta14, marketLow, marketHigh, percentage, savingsPercentage, breakdown };
  }, [pathway, engagementProfile, consequence, evidence, visibility, partner]);

  const scopeReference = useMemo(() => {
    const compact = [pathwayId, profileId, consequence, evidence, visibility, partnerId]
      .map((value) => value.replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase())
      .join("-");
    return `TA14-SCOPE-${compact}`;
  }, [pathwayId, profileId, consequence, evidence, visibility, partnerId]);

  const financingEstimate = useMemo(() => Math.ceil(configured.ta14 / financingTerm), [configured.ta14, financingTerm]);

  const summaryItems = useMemo(() => {
    const items = [...pathway.deliverables];
    if (partnerId !== "none") items.push(partner.title, "Preserved partner finding and conflict boundary");
    if (visibility === "public") items.push("Public institutional publication pathway");
    if (visibility === "controlled") items.push("Controlled-access publication pathway");
    if (evidence === "unorganized") items.push("Evidence organization and intake support");
    return Array.from(new Set(items));
  }, [pathway, partner, partnerId, visibility, evidence]);

  const institutionalRoute = useMemo(() => [
    { stage: "Inquiry", state: "Defined", detail: pathway.title },
    { stage: "Scope", state: "Live", detail: scopeReference },
    { stage: "Evidence", state: evidence === "organized" ? "Ready" : "Prepare", detail: `${evidence} evidence condition` },
    { stage: "Review", state: partnerId === "none" ? "TA-14" : "Independent", detail: partner.title },
    { stage: "Determination", state: "Bounded", detail: "ALLOW / HOLD / DENY / ESCALATE" },
    { stage: "Artifact", state: pathwayId === "artifact" || pathwayId === "demonstration" ? "Included" : "Available", detail: "Inspectable governed record" },
    { stage: "Registry", state: visibility === "private" ? "Private" : visibility === "controlled" ? "Controlled" : "Public", detail: "Versioned institutional history" },
    { stage: "Continuity", state: "Preserved", detail: "Challenge, correction, and supersession" },
  ], [pathway.title, scopeReference, evidence, partnerId, partner.title, pathwayId, visibility]);

  const engagementSummary = useMemo(() => ({
    institution: "TA-14 Authority Governance Institution",
    engagement: pathway.title,
    profile: engagementProfile.title,
    scopeReference,
    consequence: consequence.replace("-", " "),
    evidence,
    visibility,
    review: partner.title,
    configuredPrice: configured.ta14,
    marketReference: `${money(configured.marketLow)}-${money(configured.marketHigh)}`,
    exclusions: [
      "No favorable determination is purchased",
      "No certification or regulatory approval is implied",
      "Execution authority remains separately governed",
    ],
  }), [pathway.title, engagementProfile.title, scopeReference, consequence, evidence, visibility, partner.title, configured]);

  const recordPreview = useMemo(() => ({
    recordId: scopeReference.replace("SCOPE", "ENGAGEMENT"),
    entityState: pathwayId === "registry" ? "Registration pathway selected" : "Entity registration prerequisite checked",
    claimBoundary: pathway.description,
    evidenceState: `${evidence} evidence - ${evidence === "organized" ? "intake ready" : "preparation required"}`,
    authorityState: partnerId === "none" ? "TA-14 institutional review authority" : `${partner.title} with bounded competence record`,
    publicationState: `${visibility} projection`,
    historyState: "Versioned, challengeable, and supersession-aware",
  }), [scopeReference, pathwayId, pathway.description, evidence, partnerId, partner.title, visibility]);

  const openCheckout = (productId: PayPalProductId) => {
    setCheckoutProduct(checkoutCatalog[productId]);
    setCheckoutStatus("idle");
    setCheckoutMessage("");
    renderedProductRef.current = null;
  };

  useEffect(() => {
    if (!checkoutProduct) return;

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      setCheckoutStatus("error");
      setCheckoutMessage("PayPal checkout is not configured for this deployment.");
      return;
    }

    if (window.paypal) {
      setPayPalReady(true);
      return;
    }

    const existing = document.getElementById("ta14-paypal-sdk") as HTMLScriptElement | null;
    const handleLoad = () => setPayPalReady(true);
    const handleError = () => {
      setCheckoutStatus("error");
      setCheckoutMessage("PayPal could not be loaded. Please refresh and try again.");
    };

    if (existing) {
      existing.addEventListener("load", handleLoad, { once: true });
      existing.addEventListener("error", handleError, { once: true });
      return () => {
        existing.removeEventListener("load", handleLoad);
        existing.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");
    script.id = "ta14-paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture&commit=true&components=buttons,messages&enable-funding=paylater`;
    script.async = true;
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [checkoutProduct]);

  useEffect(() => {
    if (!checkoutProduct || !paypalReady || !window.paypal || !paypalButtonsRef.current) return;
    if (renderedProductRef.current === checkoutProduct.id) return;

    renderedProductRef.current = checkoutProduct.id;
    paypalButtonsRef.current.innerHTML = "";
    if (paypalMessageRef.current) paypalMessageRef.current.innerHTML = "";

    if (window.paypal.Messages && paypalMessageRef.current) {
      void window.paypal.Messages({
        amount: checkoutProduct.price,
        pageType: "checkout",
        style: { layout: "text", logo: { type: "inline" }, text: { color: "white", size: 13 } },
      }).render(paypalMessageRef.current).catch(() => undefined);
    }

    const buttons = window.paypal.Buttons({
      style: { layout: "vertical", shape: "rect", label: "paypal", height: 48 },
      createOrder: async () => {
        setCheckoutStatus("creating");
        setCheckoutMessage("Creating your governed PayPal order…");
        const response = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: checkoutProduct.id,
            customerReference: `pricing-${pathwayId}-${Date.now()}`,
          }),
        });
        const payload = await response.json();
        if (!response.ok || typeof payload.orderId !== "string") {
          throw new Error(payload.message || "PayPal could not create the order.");
        }
        return payload.orderId;
      },
      onApprove: async (data: { orderID?: string }) => {
        if (!data.orderID) throw new Error("PayPal did not return an order ID.");
        setCheckoutStatus("capturing");
        setCheckoutMessage("Capturing and confirming your payment…");
        const response = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderID }),
        });
        const payload = await response.json();
        if (!response.ok || payload.captureStatus !== "COMPLETED") {
          throw new Error(payload.message || "The payment could not be captured.");
        }
        setCheckoutStatus("success");
        setCheckoutMessage(`Payment completed. Capture ${payload.captureId}. TA-14 will begin the governed intake for ${checkoutProduct.name}.`);
      },
      onCancel: () => {
        setCheckoutStatus("cancelled");
        setCheckoutMessage("Checkout was cancelled. No payment was captured.");
      },
      onError: (error: unknown) => {
        setCheckoutStatus("error");
        setCheckoutMessage(error instanceof Error ? error.message : "PayPal checkout encountered an error.");
      },
    });

    if (!buttons.isEligible || buttons.isEligible()) {
      void buttons.render(paypalButtonsRef.current).catch((error: unknown) => {
        setCheckoutStatus("error");
        setCheckoutMessage(error instanceof Error ? error.message : "PayPal buttons could not be rendered.");
      });
    } else {
      setCheckoutStatus("error");
      setCheckoutMessage("PayPal is not available for this browser or transaction.");
    }
  }, [checkoutProduct, paypalReady, pathwayId]);

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
          <h1>Register your governance free. Engage the institution when governed work begins.</h1>
          <p className="lead">
            Every AI governance entity may create a free, attributable, versioned registration containing its identity,
            declared architecture, claims, boundaries, and public evidence references. Paid TA-14 pathways begin only
            when the entity requests evidence preparation, bounded review, a governed demonstration, an execution
            artifact, regulatory readiness work, or continuing institutional oversight.
          </p>
          <div className="heroStatements">
            <span>More governance</span>
            <span>More evidence</span>
            <span>More permanence</span>
            <span>Typically 50%+ below market</span>
          </div>
          <div className="heroActions">
            <Link className="primaryButton" href="/workspace/ai-governance/registry/register">Register Governance Free <span>→</span></Link>
            <a className="secondaryButton" href="#builder">Begin a Governed Engagement</a>
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

      <section className="institutionalRoute shell" aria-labelledby="institutional-route-title">
        <div className="routeHeading">
          <div>
            <p className="eyebrow">YOUR INSTITUTIONAL ROUTE</p>
            <h2 id="institutional-route-title">From inquiry to permanent institutional history.</h2>
          </div>
          <div className="routeLive"><span />Live configuration</div>
        </div>
        <div className="routeRail">
          {institutionalRoute.map((item, index) => (
            <article key={item.stage} className={index < 2 ? "routeActive" : ""}>
              <div className="routeIndex">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <small>{item.state}</small>
                <h3>{item.stage}</h3>
                <p>{item.detail}</p>
              </div>
              {index < institutionalRoute.length - 1 && <i aria-hidden="true">→</i>}
            </article>
          ))}
        </div>
        <div className="routeBoundary">
          <strong>The route is not decorative.</strong>
          <span>Each stage identifies a record, authority condition, evidence state, decision boundary, or continuity obligation that can be inspected later.</span>
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
            ["TA-14 Authority", "Free entity registration, followed by optional paid evidence, review, demonstration, artifact, execution, outcome, and continuity pathways."],
          ].map(([title, copy], index) => (
            <article className={index === 2 ? "categoryFeatured" : ""} key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>



      <section className="institutionalEntry shell" aria-labelledby="institutional-entry-title">
        <div className="entryHeading">
          <p className="eyebrow">CHOOSE HOW YOU ENTER TA-14 AUTHORITY</p>
          <h2 id="institutional-entry-title">Join the institutional record first. Engage governed services when the work requires them.</h2>
          <p>
            TA-14 separates participation from paid institutional work. Every governance entity may register itself at no cost.
            Evidence preparation, review, demonstrations, artifacts, regulatory readiness, and continuing governance remain
            optional governed engagements with preserved scope and transparent pricing.
          </p>
        </div>

        <div className="entryDoors">
          <article className="entryDoor freeDoor">
            <div className="doorTopline">
              <span className="doorNumber">DOOR 01</span>
              <span className="doorPrice">$0</span>
            </div>
            <p className="doorEyebrow">REGISTER YOUR GOVERNANCE ENTITY</p>
            <h3>Become part of the institutional record.</h3>
            <p>
              Establish an attributable, versioned governance identity and connect the public record supporting your architecture.
            </p>
            <ul>
              <li>Identity, ownership, stewardship, and public-contact boundary</li>
              <li>Declared architecture, capabilities, claims, non-claims, and limits</li>
              <li>DOIs, Zenodo deposits, patents, publications, repositories, and standards work</li>
              <li>Versions, rights, authority statements, and lifecycle history</li>
              <li>TA-14 governance entity registration record and identifier</li>
            </ul>
            <Link className="doorAction freeAction" href="/workspace/ai-governance/registry/register">
              Register Governance Free <span>→</span>
            </Link>
            <Link className="doorTextLink" href="/workspace/ai-governance/registry/directory">Explore registered entities</Link>
            <div className="doorBoundary">
              <strong>Registration is not review.</strong>
              <span>It does not mean TA-14 has verified, endorsed, certified, demonstrated, or approved the entity or any declared claim.</span>
            </div>
          </article>

          <article className="entryDoor governedDoor">
            <div className="doorTopline">
              <span className="doorNumber">DOOR 02</span>
              <span className="doorPrice">From $800</span>
            </div>
            <p className="doorEyebrow">ENGAGE TA-14 AUTHORITY</p>
            <h3>Request governed institutional work.</h3>
            <p>
              Move from self-declaration into bounded evidence handling, review, demonstration, artifact creation, and continuing institutional governance.
            </p>
            <ul>
              <li>Evidence preparation, admission, integrity, and authority analysis</li>
              <li>Bounded TA-14 or independent Partner Review Network review</li>
              <li>Governed demonstrations and execution artifacts</li>
              <li>Regulatory readiness and institutional governance programs</li>
              <li>Enhanced Registry projections, publication, challenge, and continuity</li>
            </ul>
            <a className="doorAction governedAction" href="#builder">
              Begin a Governed Engagement <span>→</span>
            </a>
            <Link className="doorTextLink" href="/workspace/entity-review">Request written scope</Link>
            <div className="doorBoundary">
              <strong>Payment is not approval.</strong>
              <span>Fees fund the stated work and preserved outputs. They never purchase admissibility, certification, authority, endorsement, or a favorable determination.</span>
            </div>
          </article>
        </div>

        <div className="entryLifecycle" aria-label="TA-14 institutional entry lifecycle">
          {[
            ["01", "Free registration"],
            ["02", "Entity record established"],
            ["03", "Optional governed services"],
            ["04", "Review"],
            ["05", "Artifact"],
            ["06", "Registry"],
            ["07", "Continuity"],
          ].map(([number, label], index, items) => (
            <div key={label}>
              <span>{number}</span>
              <strong>{label}</strong>
              {index < items.length - 1 && <i aria-hidden="true">→</i>}
            </div>
          ))}
        </div>
      </section>

      <section className="builder shell" id="builder">
        <div className="builderIntro">
          <p className="eyebrow">GUIDED GOVERNANCE CONFIGURATOR</p>
          <h2>Tell us what must be governed.</h2>
          <p>
            Free entity registration is separate and available above. Use this configurator only when TA-14 is being asked
            to perform paid institutional work: evidence preparation, bounded review, demonstration, artifact creation,
            regulatory readiness, independent specialist participation, or continuing governance. Your scope and price
            update immediately.
          </p>
        </div>

        <div className="profileSelector" aria-label="Engagement profile">
          <div className="profileSelectorIntro">
            <small>ENGAGEMENT PROFILE</small>
            <strong>Accessible for independent builders. Scaled for institutions.</strong>
          </div>
          <div className="profileOptions">
            {engagementProfiles.map((item) => (
              <button
                key={item.id}
                type="button"
                className={profileId === item.id ? "active" : ""}
                onClick={() => setProfileId(item.id)}
              >
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </button>
            ))}
          </div>
          <p>Every profile remains materially below the lower end of the matched enterprise market range. Institutional pricing reflects greater stakeholder, custody, review, and continuity obligations.</p>
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
                <h3>What paid institutional work should follow registration?</h3>
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
                      <em>{item.id === "registry" ? "Free registration required first · Paid service starts at " : "Starting at "}{money(startingPrice(item))}</em>
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
              <span>YOUR PAID GOVERNANCE PATHWAY</span>
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
              <p>TA-14 is {configured.percentage}% of the lower matched market reference - approximately {configured.savingsPercentage}% below it.</p>
            </div>

            <div className="scopeLedger">
              <div className="scopeLedgerHead"><div><small>CONFIGURED SCOPE LEDGER</small><strong>{scopeReference}</strong></div><span>LIVE</span></div>
              <div className="scopeLedgerRows">
                {configured.breakdown.map((item) => <div key={item.label}><span>{item.label}</span><strong>{money(item.value)}</strong></div>)}
                <div className="scopeLedgerTotal"><span>Configured institutional total</span><strong>{money(configured.ta14)}</strong></div>
              </div>
              <p>Every adjustment remains visible before scope preservation or payment. No hidden implementation multiplier is added at checkout.</p>
            </div>

            <div className="financingPlanner">
              <div><small>FINANCING PLANNER</small><strong>Illustrative payment planning</strong></div>
              <div className="termButtons" aria-label="Illustrative financing term">
                {([6, 12, 24] as FinancingTerm[]).map((term) => <button key={term} type="button" className={financingTerm === term ? "active" : ""} onClick={() => setFinancingTerm(term)}>{term} mo</button>)}
              </div>
              <div className="financeEstimate"><span>Planning estimate</span><strong>{money(financingEstimate)}<small>/month</small></strong></div>
              <p>This is an arithmetic planning estimate, not a credit offer. PayPal determines whether Pay Later is available and provides the actual terms, eligibility decision, fees, and disclosures.</p>
            </div>

            <div className="summaryDetails">
              <div><small>Engagement profile</small><strong>{engagementProfile.title}</strong></div>
              <div><small>Consequence</small><strong>{consequence.replace("-", " ")}</strong></div>
              <div><small>Evidence</small><strong>{evidence}</strong></div>
              <div><small>Visibility</small><strong>{visibility}</strong></div>
              <div><small>Independent review</small><strong>{partner.title}</strong></div>
            </div>

            <div className="deliverableList">
              <span>INCLUDED IN THIS PATHWAY</span>
              <ul>{summaryItems.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>

            {pathwayId === "review" && profileId === "organization" && consequence === "informational" && evidence === "organized" && visibility === "private" && partnerId === "none" ? (
              <button className="checkoutButton" type="button" onClick={() => openCheckout("independent-partner-review")}>
                Pay securely with PayPal <span>→</span>
              </button>
            ) : pathwayId === "demonstration" && profileId === "organization" && consequence === "informational" && evidence === "organized" && visibility === "private" && partnerId === "none" ? (
              <button className="checkoutButton" type="button" onClick={() => openCheckout("architecture-demonstration")}>
                Pay securely with PayPal <span>→</span>
              </button>
            ) : (
              <Link className="checkoutButton" href="/workspace/entity-review">
                Preserve Scope Before Payment <span>→</span>
              </Link>
            )}
            <small className="checkoutNote">Fixed-price catalog services can be purchased immediately. Configured or consequential pathways first receive a written institutional scope so the payment remains bound to defined work.</small>
          </aside>
        </div>
      </section>

      <section className="engagementWorkspace shell" aria-labelledby="engagement-summary-title">
        <div className="engagementHeader">
          <div>
            <p className="eyebrow">LIVE INSTITUTIONAL ENGAGEMENT SUMMARY</p>
            <h2 id="engagement-summary-title">Your scope is becoming an engagement record.</h2>
            <p>As the configurator changes, this summary updates the institutional question, authority boundary, evidence condition, deliverables, exclusions, and commercial terms that would be preserved before payment.</p>
          </div>
          <div className="engagementSeal">
            <span>TA-14</span>
            <strong>Scope Draft</strong>
            <small>{scopeReference}</small>
          </div>
        </div>

        <div className="engagementDocument">
          <div className="documentMeta">
            <div><small>INSTITUTION</small><strong>{engagementSummary.institution}</strong></div>
            <div><small>ENGAGEMENT</small><strong>{engagementSummary.engagement}</strong></div>
            <div><small>REFERENCE</small><strong>{engagementSummary.scopeReference}</strong></div>
            <div><small>STATUS</small><strong>Configuration draft</strong></div>
          </div>
          <div className="documentGrid">
            <div className="documentMain">
              <p className="documentLabel">DECLARED PURPOSE</p>
              <h3>{pathway.description}</h3>
              <div className="documentConditions">
                <div><span>Engagement profile</span><strong>{engagementSummary.profile}</strong></div>
                <div><span>Consequence</span><strong>{engagementSummary.consequence}</strong></div>
                <div><span>Evidence condition</span><strong>{engagementSummary.evidence}</strong></div>
                <div><span>Visibility</span><strong>{engagementSummary.visibility}</strong></div>
                <div><span>Review authority</span><strong>{engagementSummary.review}</strong></div>
              </div>
              <p className="documentLabel">INCLUDED RECORDS AND DELIVERABLES</p>
              <div className="deliverableCards">
                {summaryItems.slice(0, 8).map((item, index) => (
                  <article key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item}</strong>
                  </article>
                ))}
              </div>
            </div>
            <aside className="documentCommercial">
              <p className="documentLabel">COMMERCIAL TERMS</p>
              <div className="commercialAmount"><small>Configured institutional total</small><strong>{money(engagementSummary.configuredPrice)}</strong></div>
              <div className="commercialReference"><span>Comparable market reference</span><strong>{engagementSummary.marketReference}</strong></div>
              <ul>{engagementSummary.exclusions.map((item) => <li key={item}>{item}</li>)}</ul>
              <a href="#builder" className="documentAction">Revise configuration <span>↑</span></a>
              <Link href="/workspace/entity-review" className="documentAction secondary">Request written scope <span>→</span></Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="deliverablesInstitution shell" aria-labelledby="deliverables-title">
        <div className="sectionIntro">
          <p className="eyebrow">WHAT THE INSTITUTION PRESERVES</p>
          <h2 id="deliverables-title">The deliverable is not a paragraph. It is a governed record system.</h2>
          <p>Every pathway is designed to leave behind inspectable institutional material: what was claimed, what evidence was admitted, who had authority, what was determined, what was excluded, and how the record can be challenged or superseded.</p>
        </div>
        <div className="preservationGrid">
          {[
            ["01", "Governed scope", "The declared question, entity, system, use case, consequence, exclusions, and boundaries."],
            ["02", "Evidence record", "Admitted sources, versions, custody, timestamps, integrity metadata, and unsupported gaps."],
            ["03", "Authority record", "Who submitted, reviewed, decided, changed, approved, or remained outside authority."],
            ["04", "Determination", "A bounded ALLOW, HOLD, DENY, or ESCALATE state with attributable rationale."],
            ["05", "Execution artifact", "Where applicable, the action, route, technical effect, outcome, and integrity package."],
            ["06", "Registry history", "A dated, attributable, searchable, challengeable, versioned institutional record."],
          ].map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
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
          <div className="marketHead"><span>Governance need</span><span>Comparable enterprise engagement</span><span>TA-14 pathway</span><span>What remains governed</span></div>
          {[
            ["Registered entity evidence + institutional review", "$2,500–$10,000+", "Starting at $800", "Evidence organization, authority analysis, bounded review, enhanced projection, continuity"],
            ["Bounded specialist review", "$7,500–$25,000", "Starting at $2,400", "Question, admitted evidence, reviewer rationale, determination, limitations"],
            ["Governed demonstration", "$20,000–$75,000", "Starting at $6,400", "Scope, route, evidence, observation, artifact, case-study boundary"],
            ["Execution artifact", "$5,000–$15,000", "Starting at $1,600", "Action, evidence, authority, determination, execution, outcome, integrity"],
            ["Regulatory readiness", "$30,000–$100,000", "Starting at $9,600", "Role, obligation, evidence status, gaps, corrective route, preserved record"],
            ["Institutional program", "$100,000–$350,000+", "Starting at $32,000", "Registry, reviews, routes, artifacts, outcomes, PRN, lifecycle governance"],
          ].map((row) => (
            <div className="marketRow" key={row[0]}>{row.map((cell, index) => index === 0 ? <strong key={cell}>{cell}</strong> : <span key={cell}>{cell}</span>)}</div>
          ))}
        </div>
        <div className="sourceNote">
          <strong>Reference discipline:</strong> ranges are positioning estimates assembled from published governance-platform pricing, AI-readiness engagements, ISO/IEC 42001 implementation and certification references, and market-facing governance offerings. TA-14 profile pricing is designed to remain approximately 50% or more below the lower matched enterprise reference; final comparison depends on equivalent scope.
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
              <button type="button" className="cardCheckout" onClick={() => openCheckout(item.id === "single" ? "independent-partner-review" : item.id === "dual" ? "dual-partner-review" : "multidisciplinary-review-panel")}>Pay with PayPal</button>
            </article>
          ))}
          <article>
            <span>Starting at $15,000</span>
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
          {partnerMemberships.map((item) => {
            const productId = item.productId;

            return (
              <article key={item.title}>
                <span>{item.price}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <ul>{item.included.map((included) => <li key={included}>{included}</li>)}</ul>
                {productId ? (
                  <button
                    type="button"
                    className="cardCheckout"
                    onClick={() => openCheckout(productId)}
                  >
                    Join with PayPal
                  </button>
                ) : (
                  <Link href="/workspace/ai-governance/partner-review-network">Explore participation <b>→</b></Link>
                )}
              </article>
            );
          })}
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
                {(billingMode === "annual" ? plan.annualProductId : plan.monthlyProductId) ? (
                  <button type="button" className="cardCheckout" onClick={() => openCheckout((billingMode === "annual" ? plan.annualProductId : plan.monthlyProductId) as PayPalProductId)}>{plan.cta} with PayPal</button>
                ) : (
                  <Link href={plan.href}>{plan.cta} <span>→</span></Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="costArchitecture shell" aria-labelledby="cost-title">
        <div className="costCopy">
          <p className="eyebrow">WHY THE COST CAN BE LOWER</p>
          <h2 id="cost-title">TA-14 integrates the chain instead of rebilling the chain.</h2>
          <p>Conventional engagements often fragment discovery, assessment, legal interpretation, technical review, evidence organization, reporting, artifact creation, and continuing monitoring across separate vendors and disconnected deliverables.</p>
          <p>TA-14 lowers the entry cost by keeping those activities inside one governed institutional architecture, one preserved scope, one record model, and one continuity pathway. Independent builders receive accessible founder-level pricing; organizations and institutions scale upward with stakeholder, custody, review, and continuity complexity. The lower price does not remove evidence, review, attribution, or history.</p>
        </div>
        <div className="costComparison">
          <div className="fragmentedChain">
            <small>FRAGMENTED MARKET MODEL</small>
            {["Discovery vendor", "Advisory report", "Legal mapping", "Technical reviewer", "Evidence repository", "Monitoring tool"].map((item, index) => (
              <div key={item}><span>{index + 1}</span><strong>{item}</strong><em>Separate scope + margin</em></div>
            ))}
          </div>
          <div className="integratedChain">
            <small>TA-14 INSTITUTIONAL MODEL</small>
            <div className="integratedCore"><span>TA-14</span><strong>One governed chain</strong><em>One scope · one history · one continuity model</em></div>
            <div className="integratedOutcomes">
              <span>Registration</span><span>Evidence</span><span>Review</span><span>Artifact</span><span>Registry</span><span>Continuity</span>
            </div>
          </div>
        </div>
      </section>

      <section className="recordPreview shell" aria-labelledby="record-preview-title">
        <div className="recordPreviewIntro">
          <div>
            <p className="eyebrow">INSTITUTIONAL RECORD PREVIEW</p>
            <h2 id="record-preview-title">See what a preserved engagement begins to look like.</h2>
            <p>This preview is illustrative. It shows the structure of the institutional record produced by the current configuration; it is not a completed review, determination, certification, or registered artifact.</p>
          </div>
          <div className="recordStatus"><span />DRAFT - NOT YET PRESERVED</div>
        </div>
        <div className="recordSheet">
          <div className="recordTopline">
            <div><small>RECORD IDENTIFIER</small><strong>{recordPreview.recordId}</strong></div>
            <div><small>INSTITUTIONAL STATE</small><strong>Pre-engagement configuration</strong></div>
            <div><small>VERSION</small><strong>v0.1 draft</strong></div>
          </div>
          <div className="recordRows">
            {[
              ["Entity state", recordPreview.entityState],
              ["Claim boundary", recordPreview.claimBoundary],
              ["Evidence state", recordPreview.evidenceState],
              ["Authority state", recordPreview.authorityState],
              ["Publication state", recordPreview.publicationState],
              ["History state", recordPreview.historyState],
            ].map(([label, value], index) => (
              <div className="recordRow" key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{label}</small>
                <strong>{value}</strong>
                <em>{index < 2 ? "Configured" : "Pending intake"}</em>
              </div>
            ))}
          </div>
          <div className="recordFooter">
            <strong>No admissible evidence. No admissible execution.</strong>
            <span>This draft becomes authoritative only after scope confirmation, attribution, evidence intake, authorization, and preservation through the applicable TA-14 pathway.</span>
          </div>
        </div>
      </section>

      <section className="checkoutArchitecture shell">
        <div>
          <p className="eyebrow">GOVERNED CHECKOUT</p>
          <h2>Every payment remains bound to a defined institutional scope.</h2>
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
          <p>Register the entity for free. Then, when governed work is required, bound the claim, preserve the evidence, conduct the review, demonstrate the capability, and record execution and outcome.</p>
        </div>
        <div className="finalActions">
          <Link className="primaryButton" href="/workspace/ai-governance/registry/register">Register Governance Free <span>→</span></Link>
          <a className="secondaryButton" href="#builder">Begin a Governed Engagement</a>
          <Link className="secondaryButton" href="/workspace/entity-review">Request Scope Review</Link>
        </div>
      </section>


      {checkoutProduct && (
        <div className="checkoutOverlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutProduct(null); }}>
          <section className="checkoutModal" role="dialog" aria-modal="true" aria-labelledby="paypal-checkout-title">
            <button className="closeCheckout" type="button" aria-label="Close checkout" onClick={() => setCheckoutProduct(null)}>×</button>
            <p className="eyebrow">SECURE GOVERNED CHECKOUT</p>
            <h2 id="paypal-checkout-title">{checkoutProduct.name}</h2>
            <div className="checkoutAmount"><strong>{money(checkoutProduct.price)}</strong><span>{checkoutProduct.billing}</span></div>
            <p className="checkoutCopy">PayPal will process the payment securely. Eligible buyers may see Pay Later financing options determined and administered by PayPal.</p>
            <div ref={paypalMessageRef} className="paypalMessage" aria-label="PayPal Pay Later financing message" />
            <div ref={paypalButtonsRef} className="paypalButtons" />
            {!paypalReady && checkoutStatus !== "error" && <div className="checkoutLoading">Loading secure PayPal checkout…</div>}
            {checkoutMessage && <div className={`checkoutFeedback ${checkoutStatus}`} aria-live="polite">{checkoutMessage}</div>}
            <div className="checkoutBoundary"><strong>Payment is not approval.</strong><span>Payment purchases only the stated service pathway. It does not create certification, admissibility, endorsement, or a favorable governance determination.</span></div>
          </section>
        </div>
      )}

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
        .categoryStatement, .institutionalEntry, .builder, .market, .partnerNetwork, .membership, .workspace, .checkoutArchitecture, .finalCta { border: 1px solid rgba(131,155,189,.16); background: linear-gradient(180deg, rgba(12,21,36,.91), rgba(7,13,24,.95)); border-radius: 28px; box-shadow: 0 24px 80px rgba(0,0,0,.24); }
        .categoryStatement { padding: 54px; }
        .categoryStatement h2, .builderIntro h2, .sectionIntro h2, .partnerHero h2, .workspaceHeader h2, .checkoutArchitecture h2, .finalCta h2 { margin: 14px 0 16px; font-size: clamp(34px, 5vw, 60px); line-height: 1.03; letter-spacing: -.05em; }
        .categoryGrid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; margin-top: 32px; }
        .categoryGrid article { padding: 24px; border-radius: 20px; border: 1px solid rgba(119,155,190,.15); background: rgba(5,13,25,.72); }
        .categoryGrid article.categoryFeatured { border-color: rgba(103,185,255,.55); background: linear-gradient(180deg, rgba(66,142,224,.13), rgba(5,13,25,.82)); }
        .categoryGrid span { color: #69b5ff; font-size: 11px; font-weight: 950; letter-spacing: .15em; }
        .categoryGrid h3 { margin: 15px 0 10px; font-size: 24px; }
        .categoryGrid p, .builderIntro p, .sectionIntro p, .partnerHero p, .checkoutArchitecture p, .finalCta p { color: #9fafc2; line-height: 1.68; }
        .institutionalEntry, .builder, .market, .partnerNetwork, .membership, .workspace, .checkoutArchitecture { margin-top: 24px; padding: 44px; }
        .entryHeading { max-width:980px; }
        .entryHeading h2 { margin:14px 0 16px; font-size:clamp(38px,5vw,68px); line-height:1.01; letter-spacing:-.058em; }
        .entryHeading > p:last-child { color:#9fafc2; font-size:17px; line-height:1.7; }
        .entryDoors { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; margin-top:30px; }
        .entryDoor { min-height:610px; display:flex; flex-direction:column; padding:28px; border-radius:24px; border:1px solid rgba(121,156,191,.18); background:rgba(4,11,22,.74); }
        .freeDoor { border-color:rgba(103,205,160,.34); background:linear-gradient(180deg,rgba(55,172,119,.11),rgba(5,14,25,.88)); }
        .governedDoor { border-color:rgba(103,185,255,.38); background:linear-gradient(180deg,rgba(66,142,224,.13),rgba(5,14,25,.88)); }
        .doorTopline { display:flex; align-items:center; justify-content:space-between; gap:16px; }
        .doorNumber { color:#8198ae; font-size:10px; font-weight:950; letter-spacing:.14em; }
        .doorPrice { padding:8px 11px; border-radius:999px; color:#07120e; background:linear-gradient(135deg,#74e2b4,#dcffed); font-size:12px; font-weight:950; }
        .governedDoor .doorPrice { color:#04111d; background:linear-gradient(135deg,#68b7ff,#d7f4ff); }
        .doorEyebrow { margin:30px 0 0; color:#78cfaa; font-size:10px; font-weight:950; letter-spacing:.14em; }
        .governedDoor .doorEyebrow { color:#72bbff; }
        .entryDoor h3 { margin:12px 0 12px; font-size:clamp(30px,3.5vw,48px); line-height:1.04; letter-spacing:-.05em; }
        .entryDoor > p:not(.doorEyebrow) { margin:0; color:#9fafc2; line-height:1.65; }
        .entryDoor ul { margin:24px 0; padding-left:20px; color:#c0d1df; }
        .entryDoor li { margin:10px 0; line-height:1.5; }
        .doorAction { min-height:54px; margin-top:auto; display:flex; align-items:center; justify-content:space-between; gap:18px; padding:0 17px; border-radius:14px; text-decoration:none; font-weight:950; }
        .freeAction { color:#06120d; background:linear-gradient(135deg,#6ee0ad,#d7ffeb); }
        .governedAction { color:#04111d; background:linear-gradient(135deg,#5caeff,#d3f4ff); }
        .doorTextLink { margin-top:13px; color:#a8bfd2; text-align:center; text-decoration:none; font-size:12px; font-weight:850; }
        .doorBoundary { display:grid; gap:5px; margin-top:20px; padding:15px; border-radius:14px; border:1px solid rgba(130,164,193,.16); background:rgba(255,255,255,.025); }
        .freeDoor .doorBoundary strong { color:#b9efd3; }
        .governedDoor .doorBoundary strong { color:#d8efff; }
        .doorBoundary span { color:#8196aa; font-size:11px; line-height:1.5; }
        .entryLifecycle { display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); gap:8px; margin-top:18px; padding:18px; border-radius:18px; border:1px solid rgba(116,155,190,.16); background:rgba(4,11,22,.66); }
        .entryLifecycle > div { min-height:76px; position:relative; display:flex; flex-direction:column; justify-content:center; gap:7px; padding:10px; border-radius:12px; background:rgba(255,255,255,.018); }
        .entryLifecycle span { color:#68b7ff; font-size:9px; font-weight:950; letter-spacing:.12em; }
        .entryLifecycle strong { color:#c6d7e6; font-size:11px; line-height:1.35; }
        .entryLifecycle i { position:absolute; right:-10px; top:50%; z-index:2; color:#6ab9ff; font-style:normal; transform:translateY(-50%); }
        .notReviewBoundary { display:grid; gap:5px; margin-top:20px; padding:15px; border-radius:14px; border:1px solid rgba(255,196,103,.22); background:rgba(217,151,46,.06); }
        .notReviewBoundary strong { color:#ffd18b; }
        .notReviewBoundary span { color:#b9aa90; font-size:12px; line-height:1.5; }
        .builderIntro { max-width: 960px; }
        .profileSelector { margin-top: 28px; padding: 20px; border-radius: 20px; border: 1px solid rgba(102,185,255,.22); background: linear-gradient(180deg,rgba(66,142,224,.08),rgba(4,11,22,.72)); }
        .profileSelectorIntro { display: grid; gap: 6px; }
        .profileSelectorIntro small { color: #6fb8ff; font-size: 9px; font-weight: 950; letter-spacing: .13em; }
        .profileSelectorIntro strong { font-size: 18px; }
        .profileOptions { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; margin-top: 15px; }
        .profileOptions button { min-height: 112px; display: flex; flex-direction: column; align-items: flex-start; gap: 7px; padding: 15px; border-radius: 14px; border: 1px solid rgba(121,156,191,.16); color: #eaf5ff; background: rgba(255,255,255,.02); text-align: left; cursor: pointer; }
        .profileOptions button.active { border-color: rgba(103,185,255,.7); background: rgba(66,142,224,.14); box-shadow: 0 10px 30px rgba(31,100,177,.12); }
        .profileOptions button strong { font-size: 15px; }
        .profileOptions button span { color: #93a7ba; font-size: 11px; line-height: 1.5; }
        .profileSelector > p { margin: 13px 0 0; color: #8095aa; font-size: 11px; line-height: 1.55; }
        .builderLayout { display: grid; grid-template-columns: minmax(0,1.35fr) minmax(340px,.65fr); gap: 18px; margin-top: 18px; align-items: start; }
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
        .scopeLedger { margin:20px 0; border:1px solid rgba(102,177,255,.22); background:rgba(7,17,34,.72); border-radius:18px; padding:18px; }
        .scopeLedgerHead { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; padding-bottom:14px; border-bottom:1px solid rgba(133,160,198,.15); }.scopeLedgerHead div { display:grid; gap:5px; }.scopeLedgerHead small,.financingPlanner small { color:#75baff; font-size:9px; font-weight:950; letter-spacing:.13em; }.scopeLedgerHead strong { font-size:12px; letter-spacing:.05em; }.scopeLedgerHead>span { color:#06101f; background:#77e1ba; border-radius:999px; padding:5px 8px; font-size:8px; font-weight:950; letter-spacing:.12em; }
        .scopeLedgerRows { display:grid; margin-top:8px; }.scopeLedgerRows>div { display:flex; justify-content:space-between; gap:14px; align-items:center; padding:10px 0; border-bottom:1px solid rgba(133,160,198,.1); }.scopeLedgerRows span { color:#b8c7dc; font-size:12px; text-transform:capitalize; }.scopeLedgerRows strong { font-size:13px; }.scopeLedgerRows .scopeLedgerTotal { padding-top:14px; border-bottom:0; }.scopeLedgerRows .scopeLedgerTotal span { color:#fff; font-weight:900; }.scopeLedgerRows .scopeLedgerTotal strong { color:#7ce7bc; font-size:18px; }.scopeLedger>p,.financingPlanner>p { margin:10px 0 0; color:#8496af; font-size:10px; line-height:1.55; }
        .financingPlanner { margin:20px 0; padding:18px; border:1px solid rgba(134,113,255,.24); border-radius:18px; background:linear-gradient(135deg,rgba(40,34,96,.28),rgba(6,15,31,.8)); }.financingPlanner>div:first-child { display:grid; gap:5px; }.financingPlanner>div:first-child strong { font-size:14px; }.termButtons { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin:14px 0; }.termButtons button { border:1px solid rgba(143,160,201,.22); background:rgba(255,255,255,.03); color:#b9c7dc; border-radius:10px; padding:9px 8px; font:inherit; font-size:11px; font-weight:900; cursor:pointer; }.termButtons button.active { color:#07111f; background:#8ea8ff; border-color:#8ea8ff; }.financeEstimate { display:flex; justify-content:space-between; align-items:end; gap:16px; padding-top:12px; border-top:1px solid rgba(145,158,206,.15); }.financeEstimate span { color:#aebed4; font-size:11px; }.financeEstimate strong { font-size:24px; letter-spacing:-.04em; }.financeEstimate strong small { font-size:10px; color:#93a3ba; margin-left:3px; letter-spacing:0; }
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
        .checkoutButton { border: 0; width: 100%; cursor: pointer; font: inherit; }
        .cardCheckout { width: 100%; min-height: 44px; margin-top: 16px; border: 1px solid rgba(97,178,255,.28); border-radius: 12px; color: #dff3ff; background: rgba(68,146,229,.1); cursor: pointer; font-weight: 900; }
        .cardCheckout:hover { background: rgba(68,146,229,.18); }
        .checkoutOverlay { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 20px; background: rgba(1,5,12,.82); backdrop-filter: blur(14px); overflow-y: auto; }
        .checkoutModal { width: min(620px,100%); position: relative; padding: 34px; border-radius: 26px; border: 1px solid rgba(105,183,255,.35); background: linear-gradient(180deg,#0b1628,#050b15); box-shadow: 0 30px 100px rgba(0,0,0,.55); }
        .checkoutModal h2 { margin: 12px 44px 10px 0; font-size: clamp(30px,5vw,48px); letter-spacing: -.045em; }
        .closeCheckout { position: absolute; right: 18px; top: 16px; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(150,176,202,.22); color: #dcecff; background: rgba(255,255,255,.04); cursor: pointer; font-size: 25px; }
        .checkoutAmount { display: flex; align-items: baseline; gap: 10px; margin: 16px 0; }.checkoutAmount strong { font-size: 46px; letter-spacing: -.06em; }.checkoutAmount span { color: #89a0b7; text-transform: capitalize; }
        .checkoutCopy { color: #9fb1c4; line-height: 1.6; }.paypalMessage { min-height: 28px; margin: 14px 0; }.paypalButtons { min-height: 110px; margin-top: 12px; }.checkoutLoading { padding: 16px; text-align: center; color: #8fb4d3; }
        .checkoutFeedback { margin-top: 14px; padding: 14px 16px; border-radius: 14px; color: #dbeaff; background: rgba(70,139,206,.1); border: 1px solid rgba(83,166,244,.2); line-height: 1.5; }.checkoutFeedback.success { color: #bff0d2; border-color: rgba(77,207,137,.28); background: rgba(53,171,108,.08); }.checkoutFeedback.error { color: #ffd0d0; border-color: rgba(255,113,113,.25); background: rgba(207,67,67,.08); }.checkoutFeedback.cancelled { color: #f3d6a8; border-color: rgba(236,179,88,.24); background: rgba(204,141,46,.08); }
        .checkoutBoundary { display: grid; gap: 5px; margin-top: 16px; padding: 14px; border-radius: 14px; border: 1px solid rgba(255,195,99,.18); background: rgba(196,130,35,.05); }.checkoutBoundary strong { color: #ffd18b; }.checkoutBoundary span { color: #b4a78e; font-size: 13px; line-height: 1.5; }

        .institutionalRoute, .engagementWorkspace, .deliverablesInstitution, .costArchitecture, .recordPreview { margin-top: 24px; padding: 44px; border: 1px solid rgba(131,155,189,.16); background: linear-gradient(180deg, rgba(12,21,36,.91), rgba(7,13,24,.95)); border-radius: 28px; box-shadow: 0 24px 80px rgba(0,0,0,.24); }
        .routeHeading, .engagementHeader, .recordPreviewIntro { display:flex; align-items:flex-end; justify-content:space-between; gap:28px; }
        .routeHeading h2, .engagementHeader h2, .deliverablesInstitution h2, .costArchitecture h2, .recordPreview h2 { margin:14px 0 0; font-size:clamp(34px,5vw,60px); line-height:1.03; letter-spacing:-.05em; }
        .routeLive, .recordStatus { display:flex; align-items:center; gap:9px; padding:10px 13px; border-radius:999px; border:1px solid rgba(92,194,151,.24); color:#b8efd5; background:rgba(61,169,120,.07); font-size:11px; font-weight:900; letter-spacing:.08em; white-space:nowrap; }
        .routeLive span, .recordStatus span { width:8px; height:8px; border-radius:50%; background:#65d49b; box-shadow:0 0 18px rgba(101,212,155,.7); }
        .routeRail { display:grid; grid-template-columns:repeat(8,minmax(0,1fr)); gap:8px; margin-top:32px; }
        .routeRail article { min-height:190px; position:relative; padding:16px 14px; border-radius:18px; border:1px solid rgba(126,157,193,.15); background:rgba(4,11,22,.7); }
        .routeRail article.routeActive { border-color:rgba(102,185,255,.42); background:linear-gradient(180deg,rgba(70,150,238,.13),rgba(4,11,22,.82)); }
        .routeRail article > i { position:absolute; right:-11px; top:50%; z-index:2; color:#68b8ff; font-style:normal; transform:translateY(-50%); }
        .routeIndex { color:#5dafff; font-size:11px; font-weight:950; letter-spacing:.12em; }
        .routeRail small { display:block; margin-top:24px; color:#6ec6a0; font-size:9px; font-weight:950; letter-spacing:.12em; text-transform:uppercase; }
        .routeRail h3 { margin:8px 0 8px; font-size:18px; }
        .routeRail p { margin:0; color:#8397ab; font-size:11px; line-height:1.48; }
        .routeBoundary { display:flex; gap:12px; margin-top:16px; padding:16px 18px; border-radius:15px; border:1px solid rgba(102,185,255,.16); background:rgba(65,144,224,.05); color:#92a8bd; line-height:1.55; }
        .routeBoundary strong { color:#dceeff; white-space:nowrap; }
        .engagementHeader > div:first-child { max-width:900px; }
        .engagementHeader > div:first-child > p:last-child, .deliverablesInstitution .sectionIntro > p:last-child, .costCopy p, .recordPreviewIntro p { color:#9fafc2; line-height:1.68; }
        .engagementSeal { width:170px; min-width:170px; height:170px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; border-radius:50%; border:1px solid rgba(103,185,255,.42); background:radial-gradient(circle,rgba(70,150,238,.14),rgba(4,11,22,.9) 72%); box-shadow:inset 0 0 32px rgba(84,167,255,.09),0 0 36px rgba(73,154,238,.12); }
        .engagementSeal span { color:#65b6ff; font-size:30px; font-weight:950; letter-spacing:-.04em; }
        .engagementSeal strong { margin-top:4px; font-size:12px; }
        .engagementSeal small { max-width:120px; margin-top:7px; color:#71899f; font-size:8px; overflow-wrap:anywhere; }
        .engagementDocument { margin-top:30px; overflow:hidden; border-radius:22px; border:1px solid rgba(119,158,194,.2); background:#07111f; }
        .documentMeta { display:grid; grid-template-columns:1.1fr 1fr 1fr .7fr; gap:1px; background:rgba(113,158,199,.14); }
        .documentMeta div { min-height:84px; padding:16px; background:#0a1626; }
        .documentMeta small, .documentLabel, .recordTopline small { display:block; color:#6e8aa4; font-size:9px; font-weight:950; letter-spacing:.13em; }
        .documentMeta strong { display:block; margin-top:8px; color:#e7f1fb; font-size:13px; line-height:1.4; }
        .documentGrid { display:grid; grid-template-columns:1.3fr .7fr; }
        .documentMain { padding:28px; }
        .documentMain > h3 { margin:11px 0 22px; font-size:27px; line-height:1.3; letter-spacing:-.025em; }
        .documentConditions { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:10px; margin-bottom:28px; }
        .documentConditions div { padding:13px; border-radius:13px; border:1px solid rgba(121,156,191,.14); background:rgba(255,255,255,.02); }
        .documentConditions span { display:block; color:#6f8499; font-size:9px; text-transform:uppercase; letter-spacing:.08em; }
        .documentConditions strong { display:block; margin-top:6px; color:#dce9f5; font-size:12px; text-transform:capitalize; }
        .deliverableCards { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; margin-top:13px; }
        .deliverableCards article { min-height:66px; display:flex; gap:11px; align-items:flex-start; padding:13px; border-radius:13px; border:1px solid rgba(121,156,191,.13); background:rgba(255,255,255,.018); }
        .deliverableCards span { color:#63b3fb; font-size:10px; font-weight:950; }
        .deliverableCards strong { color:#c6d4e2; font-size:12px; line-height:1.42; }
        .documentCommercial { padding:28px; border-left:1px solid rgba(121,156,191,.16); background:linear-gradient(180deg,rgba(67,143,224,.08),rgba(4,11,22,.45)); }
        .commercialAmount { margin-top:14px; padding:20px; border-radius:17px; border:1px solid rgba(101,183,255,.28); background:rgba(68,146,229,.08); }
        .commercialAmount small { display:block; color:#8ca4bb; }
        .commercialAmount strong { display:block; margin-top:7px; font-size:44px; letter-spacing:-.06em; }
        .commercialReference { display:flex; justify-content:space-between; gap:14px; margin:14px 0; color:#8397aa; font-size:11px; }
        .commercialReference strong { color:#c9d8e6; }
        .documentCommercial ul { margin:18px 0; padding-left:18px; color:#aebdcb; font-size:12px; line-height:1.55; }
        .documentAction { min-height:48px; margin-top:9px; display:flex; align-items:center; justify-content:space-between; padding:0 14px; border-radius:12px; color:#04111d; background:linear-gradient(135deg,#5caeff,#d3f4ff); text-decoration:none; font-weight:900; }
        .documentAction.secondary { color:#dcecff; border:1px solid rgba(103,183,255,.22); background:rgba(66,142,224,.08); }
        .preservationGrid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:13px; margin-top:28px; }
        .preservationGrid article { min-height:210px; padding:22px; border-radius:18px; border:1px solid rgba(121,156,191,.15); background:rgba(5,13,25,.72); }
        .preservationGrid span { color:#61b2fb; font-size:11px; font-weight:950; letter-spacing:.13em; }
        .preservationGrid h3 { margin:28px 0 10px; font-size:25px; letter-spacing:-.035em; }
        .preservationGrid p { margin:0; color:#95a8ba; line-height:1.58; }
        .costArchitecture { display:grid; grid-template-columns:.9fr 1.1fr; gap:36px; align-items:center; }
        .costCopy p { max-width:680px; }
        .costComparison { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .fragmentedChain, .integratedChain { padding:20px; border-radius:20px; border:1px solid rgba(121,156,191,.16); background:rgba(4,11,22,.7); }
        .fragmentedChain > small, .integratedChain > small { color:#6d88a2; font-size:9px; font-weight:950; letter-spacing:.12em; }
        .fragmentedChain div { display:grid; grid-template-columns:28px 1fr; gap:5px 10px; margin-top:10px; padding:11px; border-radius:12px; background:rgba(255,255,255,.025); }
        .fragmentedChain span { grid-row:1/3; width:26px; height:26px; display:grid; place-items:center; border-radius:50%; color:#d8e7f5; border:1px solid rgba(135,159,185,.2); font-size:10px; }
        .fragmentedChain strong { font-size:12px; }
        .fragmentedChain em { color:#75899e; font-size:10px; font-style:normal; }
        .integratedChain { border-color:rgba(100,183,255,.34); background:linear-gradient(180deg,rgba(69,149,235,.1),rgba(4,11,22,.82)); }
        .integratedCore { min-height:210px; margin-top:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; border-radius:18px; border:1px solid rgba(101,183,255,.24); background:radial-gradient(circle,rgba(76,158,246,.16),transparent 70%); }
        .integratedCore span { color:#6fbdff; font-size:42px; font-weight:950; letter-spacing:-.05em; }
        .integratedCore strong { margin-top:8px; font-size:18px; }
        .integratedCore em { max-width:190px; margin-top:7px; color:#8097ad; font-size:11px; line-height:1.4; font-style:normal; }
        .integratedOutcomes { display:flex; flex-wrap:wrap; gap:7px; margin-top:12px; }
        .integratedOutcomes span { padding:7px 9px; border-radius:999px; color:#bfe5ff; border:1px solid rgba(101,183,255,.2); background:rgba(67,145,226,.07); font-size:9px; font-weight:850; }
        .recordPreviewIntro > div:first-child { max-width:900px; }
        .recordSheet { margin-top:28px; overflow:hidden; border-radius:22px; border:1px solid rgba(121,156,191,.2); background:#07111f; }
        .recordTopline { display:grid; grid-template-columns:1.2fr 1fr .45fr; gap:1px; background:rgba(112,159,201,.16); }
        .recordTopline div { padding:18px; background:#0a1626; }
        .recordTopline strong { display:block; margin-top:8px; color:#e5eff8; font-size:13px; }
        .recordRows { padding:12px; }
        .recordRow { display:grid; grid-template-columns:42px 150px 1fr 110px; gap:14px; align-items:center; min-height:66px; padding:12px 14px; border-bottom:1px solid rgba(121,156,191,.1); }
        .recordRow:last-child { border-bottom:0; }
        .recordRow > span { color:#63b3fb; font-size:10px; font-weight:950; }
        .recordRow small { color:#778da2; text-transform:uppercase; letter-spacing:.08em; }
        .recordRow strong { color:#c8d7e5; font-size:12px; line-height:1.45; }
        .recordRow em { color:#89a4ba; font-size:10px; font-style:normal; text-align:right; }
        .recordFooter { display:grid; grid-template-columns:.7fr 1.3fr; gap:18px; padding:20px; border-top:1px solid rgba(121,156,191,.15); background:rgba(68,146,229,.05); }
        .recordFooter strong { color:#dff2ff; }
        .recordFooter span { color:#8ea3b7; font-size:12px; line-height:1.55; }

        @keyframes starDrift { from{transform:translate3d(0,0,0)} to{transform:translate3d(90px,140px,0)} } @keyframes glowMove { from{transform:translate3d(0,0,0) scale(1)} to{transform:translate3d(55px,35px,0) scale(1.1)} }
        @media(max-width:1080px){ nav{display:none}.entryDoors{grid-template-columns:1fr}.entryLifecycle{grid-template-columns:repeat(4,minmax(0,1fr))}.entryLifecycle>div:nth-child(4) i{display:none}.routeRail{grid-template-columns:repeat(4,minmax(0,1fr))}.routeRail article:nth-child(4) i{display:none}.documentGrid,.costArchitecture{grid-template-columns:1fr}.documentCommercial{border-left:0;border-top:1px solid rgba(121,156,191,.16)}.preservationGrid{grid-template-columns:repeat(2,minmax(0,1fr))}.costComparison{max-width:800px}.recordRow{grid-template-columns:42px 130px 1fr}.recordRow em{display:none}.hero,.partnerHero,.checkoutArchitecture{grid-template-columns:1fr}.chainVisual{min-height:520px}.builderLayout{grid-template-columns:1fr}.liveSummary{position:relative;top:auto}.partnerServices,.membershipGrid,.workspaceGrid{grid-template-columns:repeat(2,minmax(0,1fr))}.marketHead,.marketRow{grid-template-columns:1fr 1fr}.marketHead span:nth-child(n+3){display:none}.categoryGrid{grid-template-columns:1fr}.finalCta{flex-direction:column;align-items:flex-start}.finalActions{justify-content:flex-start}}
        @media(max-width:720px){ .routeHeading,.engagementHeader,.recordPreviewIntro{align-items:flex-start;flex-direction:column}.routeRail{grid-template-columns:1fr}.routeRail article{min-height:auto}.routeRail article>i{display:none}.routeBoundary{flex-direction:column}.engagementSeal{width:130px;min-width:130px;height:130px}.documentMeta,.documentConditions,.deliverableCards,.preservationGrid,.costComparison,.recordTopline{grid-template-columns:1fr}.documentMain,.documentCommercial{padding:20px}.recordRow{grid-template-columns:32px 1fr}.recordRow small{grid-column:2}.recordRow strong{grid-column:2}.recordFooter{grid-template-columns:1fr}.shell{width:min(100% - 20px,1320px)}.hero{min-height:auto;padding:58px 0}.chainVisual{transform:scale(.78);margin:-52px 0}.categoryStatement,.institutionalEntry,.builder,.market,.partnerNetwork,.membership,.workspace,.checkoutArchitecture,.finalCta{padding:28px 22px}.progressRail small{display:none}.entryLifecycle,.profileOptions,.pathwayChoices,.compactChoices,.threeChoices,.partnerServices,.membershipGrid,.workspaceGrid{grid-template-columns:1fr}.questionBlock{min-height:auto}.marketHead{display:none}.marketRow{grid-template-columns:1fr}.workspaceHeader{flex-direction:column;align-items:flex-start}.billingToggle{width:100%}.summaryDetails{grid-template-columns:1fr}.finalCta{margin-top:48px}.entryDoor{min-height:auto}.entryLifecycle>div i{display:none}footer{flex-direction:column;justify-content:center;align-items:flex-start}footer div{flex-wrap:wrap}}
      `}</style>
    </main>
  );
}
