"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type RegistrationState = "DRAFT" | "READY" | "SUBMITTED";

type Owner = {
  id: string;
  name: string;
  email: string;
  role: string;
  accountable: boolean;
};

type Claim = {
  id: string;
  title: string;
  statement: string;
  selected: boolean;
};

type RegistrationDraft = {
  organizationName: string;
  legalName: string;
  website: string;
  country: string;
  registrationNumber: string;

  architectureName: string;
  architectureVersion: string;
  effectiveDate: string;
  architectureSummary: string;
  architectureHash: string;

  declaredPurpose: string;
  sectors: string[];
  jurisdictions: string[];
  determinations: Determination[];

  owners: Owner[];
  claims: Claim[];
  evidenceReferences: string;
  implementationState: string;
  executionPathway: string;
  declaredLimits: string;
  confidentialityBoundary: string;
  publicationPermission: "PUBLIC" | "BOUNDED" | "PRIVATE" | "";
  publicSummary: string;

  acceptsTerms: boolean;
  attestsAccuracy: boolean;
  attestsAuthority: boolean;
};

type Step = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  why: string;
};

const STEPS: Step[] = [
  { id: 1, eyebrow: "Identity", title: "Who is entering the record?", description: "Establish the attributable organization or entity behind the governance registration.", why: "The Registry needs a stable identity before claims, evidence, versions, or future findings can be attributed." },
  { id: 2, eyebrow: "Architecture", title: "What governance architecture are you registering?", description: "Name the architecture or governance system and preserve its current version.", why: "A registration must point to a specific named and versioned governance identity, not a moving target." },
  { id: 3, eyebrow: "Purpose", title: "What is this governance intended to do?", description: "Describe the architecture in plain language before selecting detailed claims.", why: "A third party should be able to understand the declared purpose without private explanation." },
  { id: 4, eyebrow: "Claims", title: "What capabilities are you actually claiming?", description: "Select only the capabilities you are prepared to place in the public record.", why: "Bounded claims are easier to inspect, challenge, preserve, and compare over time." },
  { id: 5, eyebrow: "Sector scope", title: "Where does the architecture apply?", description: "Select the sectors or operating domains within the declared applicability boundary.", why: "A claim without scope can silently expand beyond the evidence that supports it." },
  { id: 6, eyebrow: "Jurisdiction", title: "Where is this governance intended to operate?", description: "Declare geographic, legal, or organization-specific jurisdictional scope.", why: "Registration does not create legal authority. It records the jurisdiction the registrant claims." },
  { id: 7, eyebrow: "Determinations", title: "What decisions can the governance produce?", description: "Declare which bounded decision effects the architecture supports.", why: "A governance architecture should state what it is entitled to decide before a consequence-bearing route is relied upon." },
  { id: 8, eyebrow: "Stewardship", title: "Who is accountable for this registration?", description: "Identify at least one human steward who can answer for the registration and its public claims.", why: "Governance claims need attributable human stewardship rather than an anonymous or self-authenticating system identity." },
  { id: 9, eyebrow: "Evidence", title: "What evidence supports the present baseline?", description: "List public references, repositories, papers, demonstrations, receipts, tests, or other evidence surfaces.", why: "Registration preserves what evidence existed at the baseline without silently upgrading that evidence into independent proof." },
  { id: 10, eyebrow: "Implementation", title: "What is implemented today?", description: "Describe the current implementation state and the path by which governance reaches execution, if applicable.", why: "A declared architecture and a deployed mechanism are not automatically the same thing." },
  { id: 11, eyebrow: "Limits", title: "What does this registration not claim?", description: "State limitations, exclusions, unresolved conditions, and explicit non-claims.", why: "The limits travel with the registration. They should not disappear when a claim is quoted elsewhere." },
  { id: 12, eyebrow: "Confidentiality", title: "What must remain protected?", description: "Define the confidentiality and intellectual-property boundary for future evidence or review activity.", why: "A closed implementation can remain closed. Registration should not force disclosure of proprietary internals." },
  { id: 13, eyebrow: "Publication", title: "What may TA-14 publish from this registration?", description: "Set the publication boundary and write the public-facing summary that may appear in the Registry.", why: "Publication permission should be explicit before the record is submitted, not reconstructed afterward." },
  { id: 14, eyebrow: "Review", title: "Review and attest the registration", description: "Inspect the complete baseline, accept the operating terms, and freeze the candidate package for institutional review.", why: "Submission should preserve a deliberate, attributable baseline rather than a partially completed draft." },
];

const SECTORS = [
  "AI operations",
  "Financial services",
  "Healthcare",
  "Life sciences",
  "Cybersecurity",
  "Critical infrastructure",
  "Public sector",
  "Education",
  "Employment",
  "Insurance",
  "Legal operations",
  "Procurement",
  "Data governance",
  "Physical systems",
  "Environmental systems",
  "Mobility",
  "Digital platforms",
  "Research governance",
  "Enterprise operations",
  "Records governance",
] as const;

const JURISDICTIONS = [
  "United States",
  "European Union",
  "United Kingdom",
  "Canada",
  "Australia",
  "Singapore",
  "Japan",
  "Global / multi-jurisdiction",
  "Organization-specific private domain",
] as const;

const CLAIM_TEMPLATES: Claim[] = [
  { id: "claim-01", title: "Evidence governance", statement: "Preserves attributable evidence, provenance, custody, freshness, sufficiency, and conflicts.", selected: false },
  { id: "claim-02", title: "Authority governance", statement: "Resolves identity, role, delegation, scope, expiry, revocation, and concurrence before consequence.", selected: false },
  { id: "claim-03", title: "Execution boundaries", statement: "Defines permitted destination, privilege, amount, model, tool, time, and prohibited actions.", selected: false },
  { id: "claim-04", title: "Commit discipline", statement: "Freezes the governed route, determination, reasons, actor, and dependencies before execution.", selected: false },
  { id: "claim-05", title: "Runtime enforcement", statement: "Connects governance determinations to technical effects that control what the system can do.", selected: false },
  { id: "claim-06", title: "Outcome closure", statement: "Preserves what actually bound to reality, residual conditions, verification, and follow-up obligations.", selected: false },
  { id: "claim-07", title: "Challenge and correction", statement: "Maintains append-only challenge, amendment, supersession, withdrawal, and prospective-reliance history.", selected: false },
  { id: "claim-08", title: "Privacy-preserving proof", statement: "Supports public proof while protecting confidential evidence, sensitive data, and proprietary implementation.", selected: false },
];

const INITIAL_DRAFT: RegistrationDraft = {
  organizationName: "",
  legalName: "",
  website: "",
  country: "",
  registrationNumber: "",

  architectureName: "",
  architectureVersion: "v1.0",
  effectiveDate: "",
  architectureSummary: "",
  architectureHash: "",

  declaredPurpose: "",
  sectors: [],
  jurisdictions: [],
  determinations: ["ALLOW", "HOLD", "DENY", "ESCALATE"],

  owners: [{ id: "owner-1", name: "", email: "", role: "Accountable owner", accountable: true }],
  claims: CLAIM_TEMPLATES,
  evidenceReferences: "",
  implementationState: "",
  executionPathway: "",
  declaredLimits: "",
  confidentialityBoundary: "",
  publicationPermission: "",
  publicSummary: "",

  acceptsTerms: false,
  attestsAccuracy: false,
  attestsAuthority: false,
};

const STORAGE_KEY = "ta14-governance-registration-draft-v2";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42);
}

function pseudoMix(block: string, index: number) {
  const n = index + 1;
  return block.split("").map((c, i) => ((parseInt(c, 16) + i + n) % 16).toString(16)).join("");
}

function pseudoHash(value: string) {
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < value.length; i += 1) {
    h1 = Math.imul(h1 ^ value.charCodeAt(i), 16777619);
    h2 = Math.imul(h2 ^ (value.charCodeAt(i) + i), 2246822519);
  }
  const block = `${(h1 >>> 0).toString(16).padStart(8, "0")}${(h2 >>> 0).toString(16).padStart(8, "0")}`;
  return Array.from({ length: 4 }, (_, index) => pseudoMix(block, index)).join("");
}

function downloadJson(name: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function ChoiceCard({ active, title, description, onClick }: { active: boolean; title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" className={cx("choice-card", active && "active")} onClick={onClick}>
      <span className="choice-mark">{active ? "✓" : "+"}</span>
      <span><strong>{title}</strong><small>{description}</small></span>
    </button>
  );
}

export default function GovernanceRegistrationPage() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<RegistrationState>("DRAFT");
  const [draft, setDraft] = useState<RegistrationDraft>(INITIAL_DRAFT);
  const [notice, setNotice] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setDraft(JSON.parse(stored) as RegistrationDraft);
    } catch {
      // keep clean draft
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  const patch = <K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const selectedClaims = useMemo(() => draft.claims.filter((claim) => claim.selected), [draft.claims]);

  const stepValid = useMemo(() => ({
    1: Boolean(draft.organizationName.trim() && draft.legalName.trim() && draft.country.trim()),
    2: Boolean(draft.architectureName.trim() && draft.architectureVersion.trim()),
    3: draft.declaredPurpose.trim().length >= 40 && draft.architectureSummary.trim().length >= 80,
    4: selectedClaims.length > 0,
    5: draft.sectors.length > 0,
    6: draft.jurisdictions.length > 0,
    7: draft.determinations.length > 0,
    8: draft.owners.some((owner) => owner.accountable && owner.name.trim() && owner.email.trim()),
    9: draft.evidenceReferences.trim().length >= 20,
    10: draft.implementationState.trim().length >= 30,
    11: draft.declaredLimits.trim().length >= 30,
    12: draft.confidentialityBoundary.trim().length >= 20,
    13: Boolean(draft.publicationPermission && draft.publicSummary.trim().length >= 60),
    14: draft.acceptsTerms && draft.attestsAccuracy && draft.attestsAuthority,
  }), [draft, selectedClaims]);

  const completedCount = Object.values(stepValid).filter(Boolean).length;
  const ready = Object.values(stepValid).every(Boolean);
  const progress = Math.round(((step - 1) / 13) * 100);

  useEffect(() => {
    setState(ready ? "READY" : state === "SUBMITTED" ? "SUBMITTED" : "DRAFT");
  }, [ready]);

  const registrationPayload = useMemo(() => ({
    schema: "ta14.governance.registration.candidate.v2",
    organization: {
      display_name: draft.organizationName,
      legal_name: draft.legalName,
      website: draft.website,
      country: draft.country,
      registration_number: draft.registrationNumber || null,
    },
    architecture: {
      name: draft.architectureName,
      version: draft.architectureVersion,
      effective_date: draft.effectiveDate || null,
      purpose: draft.declaredPurpose,
      summary: draft.architectureSummary,
      declared_hash: draft.architectureHash || null,
    },
    scope: {
      sectors: draft.sectors,
      jurisdictions: draft.jurisdictions,
      determinations: draft.determinations,
    },
    stewardship: draft.owners,
    claims: selectedClaims,
    evidence: draft.evidenceReferences,
    implementation: {
      state: draft.implementationState,
      execution_pathway: draft.executionPathway,
    },
    limits: draft.declaredLimits,
    confidentiality_boundary: draft.confidentialityBoundary,
    publication: {
      permission: draft.publicationPermission,
      public_summary: draft.publicSummary,
    },
    attestations: {
      terms: draft.acceptsTerms,
      accuracy: draft.attestsAccuracy,
      authority: draft.attestsAuthority,
    },
  }), [draft, selectedClaims]);

  const packageHash = useMemo(() => pseudoHash(JSON.stringify(registrationPayload)), [registrationPayload]);
  const candidateId = useMemo(
    () => `TA14-GOV-CAND-${slug(draft.organizationName || "unassigned").toUpperCase()}-${packageHash.slice(0, 8).toUpperCase()}`,
    [draft.organizationName, packageHash]
  );

  const currentStep = STEPS[step - 1];

  const goNext = () => {
    if (!stepValid[step as keyof typeof stepValid]) {
      setNotice("Complete the required information on this step before continuing.");
      return;
    }
    setNotice("");
    if (step < 14) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    setNotice("");
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submit = () => {
    if (!ready) {
      setNotice("Submission blocked. Resolve every required step before freezing the candidate package.");
      return;
    }
    setState("SUBMITTED");
    setNotice("Candidate registration package frozen locally for institutional intake. Registration is not certification.");
  };

  const toggleSector = (value: string) => {
    patch("sectors", draft.sectors.includes(value) ? draft.sectors.filter((item) => item !== value) : [...draft.sectors, value]);
  };

  const toggleJurisdiction = (value: string) => {
    patch("jurisdictions", draft.jurisdictions.includes(value) ? draft.jurisdictions.filter((item) => item !== value) : [...draft.jurisdictions, value]);
  };

  const toggleDetermination = (value: Determination) => {
    patch("determinations", draft.determinations.includes(value) ? draft.determinations.filter((item) => item !== value) : [...draft.determinations, value]);
  };

  const toggleClaim = (id: string) => {
    patch("claims", draft.claims.map((claim) => claim.id === id ? { ...claim, selected: !claim.selected } : claim));
  };

  const updateOwner = (id: string, field: keyof Owner, value: string | boolean) => {
    patch("owners", draft.owners.map((owner) => owner.id === id ? { ...owner, [field]: value } : owner));
  };

  const resetDraft = () => {
    if (!window.confirm("Clear this registration draft and start over?")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setDraft(INITIAL_DRAFT);
    setStep(1);
    setState("DRAFT");
    setNotice("Draft cleared.");
  };

  return (
    <main className="registration-page">
      <div className="grid-plane" aria-hidden="true" />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">TA</span>
          <span><b>TA-14 Authority</b><small>Governance Registration</small></span>
        </Link>
        <nav>
          <Link href="/governance/registration-evidence-terms">Registration Terms</Link>
          <Link href="/governance/directory">Registry</Link>
          <Link href="/">Exchange</Link>
        </nav>
        <Badge tone={state === "READY" ? "pass" : state === "SUBMITTED" ? "submitted" : "draft"}>{state}</Badge>
      </header>

      <section className="progress-shell">
        <div className="progress-copy">
          <div>
            <span>Governance Entity Registration</span>
            <strong>Step {step} of 14 · {currentStep.eyebrow}</strong>
          </div>
          <small>{completedCount} of 14 requirements currently satisfied</small>
        </div>
        <div className="progress-track"><i style={{ width: `${Math.max(progress, 2)}%` }} /></div>
      </section>

      <section className="wizard-shell">
        <aside className="step-rail" aria-label="Registration progress">
          <div className="rail-heading">
            <span>Registration route</span>
            <strong>One step at a time</strong>
            <p>Your draft saves automatically on this device.</p>
          </div>
          <div className="rail-steps">
            {STEPS.map((item) => {
              const valid = stepValid[item.id as keyof typeof stepValid];
              const active = item.id === step;
              return (
                <button
                  type="button"
                  key={item.id}
                  className={cx("rail-step", active && "active", valid && "complete")}
                  onClick={() => setStep(item.id)}
                  aria-current={active ? "step" : undefined}
                >
                  <span>{valid ? "✓" : String(item.id).padStart(2, "0")}</span>
                  <div><b>{item.eyebrow}</b><small>{item.title}</small></div>
                </button>
              );
            })}
          </div>
          <div className="rail-actions">
            <button type="button" className="text-button" onClick={() => setPreviewOpen(true)}>Preview public record</button>
            <button type="button" className="text-button danger" onClick={resetDraft}>Clear draft</button>
          </div>
        </aside>

        <div className="wizard-main">
          <section className="step-card">
            <div className="step-number">{String(step).padStart(2, "0")}</div>
            <div className="step-copy">
              <p className="eyebrow">{currentStep.eyebrow}</p>
              <h1>{currentStep.title}</h1>
              <p className="lede">{currentStep.description}</p>
              <div className="why-box"><span>Why this matters</span><p>{currentStep.why}</p></div>
            </div>
          </section>

          {notice ? <div className="notice"><strong>Registration notice</strong><p>{notice}</p></div> : null}

          <section className="form-card">
            {step === 1 ? (
              <div className="form-grid two">
                <Field label="Public organization name"><input value={draft.organizationName} onChange={(e) => patch("organizationName", e.target.value)} placeholder="Example Governance Institute" /></Field>
                <Field label="Legal entity name"><input value={draft.legalName} onChange={(e) => patch("legalName", e.target.value)} placeholder="Example Governance Institute, Inc." /></Field>
                <Field label="Website" hint="Optional"><input value={draft.website} onChange={(e) => patch("website", e.target.value)} placeholder="https://example.org" /></Field>
                <Field label="Country of registration"><input value={draft.country} onChange={(e) => patch("country", e.target.value)} placeholder="United States" /></Field>
                <Field label="Legal registration number" hint="Optional at intake; may be required before final institutional approval."><input value={draft.registrationNumber} onChange={(e) => patch("registrationNumber", e.target.value)} placeholder="Entity or company number" /></Field>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="form-grid two">
                <Field label="Governance architecture / system name"><input value={draft.architectureName} onChange={(e) => patch("architectureName", e.target.value)} placeholder="Example Constitutional Runtime" /></Field>
                <Field label="Current version"><input value={draft.architectureVersion} onChange={(e) => patch("architectureVersion", e.target.value)} placeholder="v1.0" /></Field>
                <Field label="Effective date" hint="Optional"><input type="date" value={draft.effectiveDate} onChange={(e) => patch("effectiveDate", e.target.value)} /></Field>
                <Field label="Declared architecture hash" hint="Optional. Use only if you already maintain a frozen architecture package."><input value={draft.architectureHash} onChange={(e) => patch("architectureHash", e.target.value)} placeholder="sha256:..." /></Field>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="form-stack">
                <Field label="Declared purpose" hint="Minimum 40 characters. Explain the problem this governance exists to address."><textarea rows={5} value={draft.declaredPurpose} onChange={(e) => patch("declaredPurpose", e.target.value)} placeholder="This governance architecture exists to..." /></Field>
                <Field label="Architecture summary" hint="Minimum 80 characters. Describe how the governance works at a high level without disclosing proprietary internals."><textarea rows={8} value={draft.architectureSummary} onChange={(e) => patch("architectureSummary", e.target.value)} placeholder="Describe the evidence, authority, decision, execution, and recordkeeping model at a public level..." /></Field>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="choice-grid">
                {draft.claims.map((claim) => (
                  <ChoiceCard key={claim.id} active={claim.selected} title={claim.title} description={claim.statement} onClick={() => toggleClaim(claim.id)} />
                ))}
              </div>
            ) : null}

            {step === 5 ? (
              <div className="choice-grid compact">
                {SECTORS.map((item) => <ChoiceCard key={item} active={draft.sectors.includes(item)} title={item} description="Include this sector in the declared applicability boundary." onClick={() => toggleSector(item)} />)}
              </div>
            ) : null}

            {step === 6 ? (
              <div className="choice-grid compact">
                {JURISDICTIONS.map((item) => <ChoiceCard key={item} active={draft.jurisdictions.includes(item)} title={item} description="Declare intended applicability. Registration does not grant legal authority." onClick={() => toggleJurisdiction(item)} />)}
              </div>
            ) : null}

            {step === 7 ? (
              <div className="determination-grid">
                {(["ALLOW", "HOLD", "DENY", "ESCALATE"] as Determination[]).map((item) => (
                  <button type="button" key={item} className={cx("determination", item.toLowerCase(), draft.determinations.includes(item) && "active")} onClick={() => toggleDetermination(item)}>
                    <strong>{item}</strong>
                    <small>{item === "ALLOW" ? "Permit exact bounded scope" : item === "HOLD" ? "Pause pending repair or revalidation" : item === "DENY" ? "Refuse prohibited or unsupported execution" : "Route to named authority or review"}</small>
                  </button>
                ))}
              </div>
            ) : null}

            {step === 8 ? (
              <div className="owner-card">
                <div className="form-grid two">
                  <Field label="Accountable owner name"><input value={draft.owners[0]?.name || ""} onChange={(e) => updateOwner(draft.owners[0].id, "name", e.target.value)} placeholder="Full name" /></Field>
                  <Field label="Email"><input type="email" value={draft.owners[0]?.email || ""} onChange={(e) => updateOwner(draft.owners[0].id, "email", e.target.value)} placeholder="name@example.org" /></Field>
                  <Field label="Institutional role"><input value={draft.owners[0]?.role || ""} onChange={(e) => updateOwner(draft.owners[0].id, "role", e.target.value)} placeholder="Founder, steward, governance lead..." /></Field>
                </div>
                <div className="info-box"><strong>Accountability rule</strong><p>This person is attributable to the registration. Registration does not make TA-14 the owner or steward of the architecture.</p></div>
              </div>
            ) : null}

            {step === 9 ? (
              <Field label="Evidence references" hint="List URLs, repositories, papers, tests, receipts, demonstrations, public records, or other evidence surfaces. One per line is easiest to inspect."><textarea rows={12} value={draft.evidenceReferences} onChange={(e) => patch("evidenceReferences", e.target.value)} placeholder="https://...\nRepository: ...\nTest record: ...\nPublic paper: ..." /></Field>
            ) : null}

            {step === 10 ? (
              <div className="form-stack">
                <Field label="Current implementation state" hint="Minimum 30 characters. State what is implemented, demonstrated, partial, experimental, planned, or not yet established."><textarea rows={7} value={draft.implementationState} onChange={(e) => patch("implementationState", e.target.value)} placeholder="Today, the implemented system..." /></Field>
                <Field label="Execution pathway" hint="Optional. Describe how a governed decision reaches execution, if the architecture has an executable path."><textarea rows={6} value={draft.executionPathway} onChange={(e) => patch("executionPathway", e.target.value)} placeholder="A governed request enters..." /></Field>
              </div>
            ) : null}

            {step === 11 ? (
              <Field label="Declared limits and non-claims" hint="Minimum 30 characters. Be explicit about what this registration does not establish."><textarea rows={12} value={draft.declaredLimits} onChange={(e) => patch("declaredLimits", e.target.value)} placeholder="This registration does not establish...\nThis architecture does not currently...\nThe following remains unverified..." /></Field>
            ) : null}

            {step === 12 ? (
              <Field label="Confidentiality and IP boundary" hint="Minimum 20 characters. State what TA-14 may inspect, retain, publish, or must treat as non-public in later work."><textarea rows={10} value={draft.confidentialityBoundary} onChange={(e) => patch("confidentialityBoundary", e.target.value)} placeholder="Public: ...\nMay be submitted confidentially: ...\nNot submitted / proprietary: ..." /></Field>
            ) : null}

            {step === 13 ? (
              <div className="form-stack">
                <div className="publication-grid">
                  {([
                    ["PUBLIC", "Public registry record", "TA-14 may publish the registration baseline and public summary."],
                    ["BOUNDED", "Bounded publication", "Only the approved public summary and agreed registry fields may be published."],
                    ["PRIVATE", "Private intake", "Registration remains non-public pending a separate publication decision."],
                  ] as const).map(([value, title, description]) => (
                    <button type="button" key={value} className={cx("publication-card", draft.publicationPermission === value && "active")} onClick={() => patch("publicationPermission", value)}>
                      <strong>{title}</strong><span>{value}</span><p>{description}</p>
                    </button>
                  ))}
                </div>
                <Field label="Public registry summary" hint="Minimum 60 characters. Write the plain-language summary you would be comfortable having attached to the registration."><textarea rows={8} value={draft.publicSummary} onChange={(e) => patch("publicSummary", e.target.value)} placeholder="[Architecture] is a governance architecture that..." /></Field>
              </div>
            ) : null}

            {step === 14 ? (
              <div className="review-layout">
                <div className="review-summary">
                  <div className="review-head"><div><span>Candidate registration ID</span><strong>{candidateId}</strong></div><Badge tone={ready ? "pass" : "review"}>{ready ? "READY" : `${14 - completedCount} REMAIN`}</Badge></div>
                  <ReviewRow label="Organization" value={draft.organizationName || "Not provided"} />
                  <ReviewRow label="Architecture" value={`${draft.architectureName || "Not provided"} ${draft.architectureVersion || ""}`.trim()} />
                  <ReviewRow label="Claims" value={`${selectedClaims.length} bounded claim${selectedClaims.length === 1 ? "" : "s"}`} />
                  <ReviewRow label="Scope" value={`${draft.sectors.length} sectors · ${draft.jurisdictions.length} jurisdictions`} />
                  <ReviewRow label="Steward" value={draft.owners[0]?.name || "Not provided"} />
                  <ReviewRow label="Publication" value={draft.publicationPermission || "Not selected"} />
                  <ReviewRow label="Package hash" value={packageHash} mono />
                </div>

                <div className="attestations">
                  <label className="check-row"><input type="checkbox" checked={draft.acceptsTerms} onChange={(e) => patch("acceptsTerms", e.target.checked)} /><span><b>Registration & Evidence Terms</b><small>I accept the published TA-14 Registration & Evidence Terms applicable to this submission.</small></span></label>
                  <label className="check-row"><input type="checkbox" checked={draft.attestsAccuracy} onChange={(e) => patch("attestsAccuracy", e.target.checked)} /><span><b>Accuracy attestation</b><small>I attest that the submitted information is complete and not materially misleading to the best of my knowledge.</small></span></label>
                  <label className="check-row"><input type="checkbox" checked={draft.attestsAuthority} onChange={(e) => patch("attestsAuthority", e.target.checked)} /><span><b>Authority attestation</b><small>I possess authority to submit this governance registration on behalf of the named entity.</small></span></label>
                </div>

                <div className="final-actions">
                  <Link className="secondary" href="/governance/registration-evidence-terms" target="_blank">Read registration terms</Link>
                  <button type="button" className="secondary" onClick={() => downloadJson(`${slug(draft.organizationName || "governance")}-registration-candidate.json`, { candidate_id: candidateId, package_hash: packageHash, ...registrationPayload })}>Download candidate JSON</button>
                  <button type="button" className="primary" disabled={!ready || state === "SUBMITTED"} onClick={submit}>{state === "SUBMITTED" ? "Candidate frozen" : "Freeze and submit for review"}</button>
                </div>

                {state === "SUBMITTED" ? (
                  <div className="submission-receipt">
                    <span>Submission receipt</span>
                    <h3>Candidate package preserved.</h3>
                    <p>This candidate remains subject to institutional review. No Governance Registration ID has been issued yet, and registration is not certification.</p>
                    <code>{candidateId}</code>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>

          <div className="step-status">
            <div className={cx("status-pill", stepValid[step as keyof typeof stepValid] && "pass")}>
              <span>{stepValid[step as keyof typeof stepValid] ? "✓" : "!"}</span>
              <div><b>{stepValid[step as keyof typeof stepValid] ? "Step complete" : "Required information remains"}</b><small>{stepValid[step as keyof typeof stepValid] ? "You can continue to the next step." : "Complete the required fields above to continue."}</small></div>
            </div>
          </div>

          <div className="wizard-actions">
            <button type="button" className="secondary" onClick={goBack} disabled={step === 1}>← Back</button>
            <div className="action-note">Step {step} of 14 · Draft saves automatically</div>
            {step < 14 ? <button type="button" className="primary" onClick={goNext} disabled={!stepValid[step as keyof typeof stepValid]}>Continue →</button> : <button type="button" className="primary" onClick={submit} disabled={!ready || state === "SUBMITTED"}>{state === "SUBMITTED" ? "Submitted" : "Submit registration"}</button>}
          </div>
        </div>
      </section>

      {previewOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Registration preview">
          <div className="modal-card">
            <button className="modal-close" type="button" onClick={() => setPreviewOpen(false)}>×</button>
            <p className="eyebrow">Public record preview</p>
            <h2>{draft.architectureName || "Governance architecture not yet named"}</h2>
            <div className="preview-grid">
              <ReviewRow label="Candidate ID" value={candidateId} mono />
              <ReviewRow label="Organization" value={draft.organizationName || "Not yet declared"} />
              <ReviewRow label="Version" value={draft.architectureVersion || "Not yet declared"} />
              <ReviewRow label="Claims" value={`${selectedClaims.length} selected`} />
              <ReviewRow label="Publication" value={draft.publicationPermission || "Not selected"} />
              <ReviewRow label="State" value={state} />
            </div>
            <div className="preview-copy"><span>Public summary</span><p>{draft.publicSummary || "Your public-facing summary will appear here when you write it in Step 13."}</p></div>
            <div className="preview-copy"><span>Declared limits</span><p>{draft.declaredLimits || "Your explicit limitations and non-claims will appear here when you write them in Step 11."}</p></div>
          </div>
        </div>
      ) : null}

      <footer>
        <div><strong>TA-14 AI Governance Exchange</strong><span>Governance Entity Registration</span></div>
        <p>Declare it. Bound it. Evidence it. Register it.</p>
        <nav><Link href="/">Exchange</Link><Link href="/governance/registration-evidence-terms">Terms</Link><Link href="/governance/directory">Registry</Link></nav>
      </footer>

      <style jsx global>{`
        :root{color-scheme:dark;--bg:#030712;--panel:rgba(7,16,31,.9);--panel2:#0b1729;--line:rgba(126,164,211,.18);--line2:rgba(77,209,255,.34);--text:#f6f8fc;--muted:#9fb0c5;--cyan:#4dd1ff;--cyan2:#1ba7e1;--gold:#e9c46a;--green:#53e3a6;--red:#ff7184;--shadow:0 24px 80px rgba(0,0,0,.38)}
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.registration-page{position:relative;min-height:100vh;overflow:hidden;background:radial-gradient(circle at 50% -20%,rgba(27,112,174,.18),transparent 38%),linear-gradient(180deg,#02050c 0%,#07111f 52%,#030712 100%)}
        .grid-plane{position:fixed;inset:0;pointer-events:none;opacity:.12;background-image:linear-gradient(rgba(77,209,255,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(77,209,255,.09) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(to bottom,black,transparent 84%)}
        .ambient{position:fixed;width:520px;height:520px;border-radius:50%;filter:blur(110px);pointer-events:none;opacity:.13}.ambient-one{top:5%;left:-240px;background:#12649f}.ambient-two{right:-250px;top:42%;background:#80651d}
        .topbar{position:relative;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:24px;max-width:1500px;margin:auto;padding:20px 34px;border-bottom:1px solid var(--line);background:rgba(3,7,18,.72);backdrop-filter:blur(18px)}.brand{display:flex;align-items:center;gap:12px;color:inherit;text-decoration:none}.brand-mark{display:grid;place-items:center;width:44px;height:44px;border:1px solid rgba(233,196,106,.55);background:linear-gradient(145deg,rgba(233,196,106,.2),rgba(77,209,255,.08));color:var(--gold);font-weight:900}.brand b,.brand small{display:block}.brand small{margin-top:3px;color:var(--muted);font-size:10px;letter-spacing:.14em;text-transform:uppercase}.topbar nav{display:flex;gap:18px}.topbar nav a,footer a{color:var(--muted);text-decoration:none;font-size:13px}.topbar nav a:hover,footer a:hover{color:var(--cyan)}
        .badge{display:inline-flex;align-items:center;justify-content:center;padding:6px 10px;border:1px solid var(--line);border-radius:999px;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;background:rgba(255,255,255,.04)}.badge-pass{color:var(--green);border-color:rgba(83,227,166,.4);background:rgba(83,227,166,.08)}.badge-draft{color:var(--cyan)}.badge-submitted,.badge-review{color:var(--gold);border-color:rgba(233,196,106,.4);background:rgba(233,196,106,.08)}
        .progress-shell{position:relative;z-index:8;max-width:1500px;margin:auto;padding:24px 34px 0}.progress-copy{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:12px}.progress-copy span,.progress-copy strong{display:block}.progress-copy span{font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}.progress-copy strong{margin-top:5px;font-size:18px}.progress-copy small{color:var(--muted)}.progress-track{height:5px;border-radius:999px;background:rgba(255,255,255,.06);overflow:hidden}.progress-track i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--cyan2),var(--cyan));transition:width .35s ease}
        .wizard-shell{position:relative;z-index:5;display:grid;grid-template-columns:300px minmax(0,1fr);gap:28px;max-width:1500px;margin:0 auto;padding:28px 34px 90px}.step-rail{position:sticky;top:20px;align-self:start;max-height:calc(100vh - 40px);overflow:auto;border:1px solid var(--line);background:rgba(5,13,26,.82);box-shadow:var(--shadow)}.rail-heading{padding:22px;border-bottom:1px solid var(--line)}.rail-heading span{display:block;color:var(--gold);font-size:10px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.rail-heading strong{display:block;margin-top:6px;font-size:20px}.rail-heading p{margin:8px 0 0;color:var(--muted);font-size:12px;line-height:1.5}.rail-steps{display:grid}.rail-step{display:grid;grid-template-columns:36px 1fr;gap:10px;text-align:left;padding:13px 16px;border:0;border-bottom:1px solid rgba(126,164,211,.1);background:transparent;color:inherit;cursor:pointer}.rail-step>span{display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--line);border-radius:50%;font-size:10px;font-weight:900;color:var(--muted)}.rail-step b,.rail-step small{display:block}.rail-step b{font-size:11px;color:#dce8f6}.rail-step small{margin-top:2px;color:#76879a;font-size:10px;line-height:1.35}.rail-step.active{background:rgba(77,209,255,.075);box-shadow:inset 3px 0 0 var(--cyan)}.rail-step.active>span{border-color:var(--cyan);color:var(--cyan)}.rail-step.complete>span{border-color:rgba(83,227,166,.45);color:var(--green);background:rgba(83,227,166,.07)}.rail-actions{display:grid;gap:8px;padding:16px}.text-button{border:0;background:transparent;color:var(--cyan);text-align:left;cursor:pointer;font-weight:800}.text-button.danger{color:#d9828e}
        .wizard-main{min-width:0}.step-card{display:grid;grid-template-columns:86px 1fr;gap:24px;padding:34px;border:1px solid var(--line);background:linear-gradient(145deg,rgba(10,24,45,.93),rgba(5,12,25,.94));box-shadow:var(--shadow)}.step-number{font-family:Georgia,serif;font-size:64px;line-height:1;color:rgba(77,209,255,.28)}.eyebrow{margin:0 0 9px;color:var(--gold);font-size:11px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.step-card h1{margin:0;font-family:Georgia,serif;font-size:clamp(34px,5vw,64px);line-height:1.02;letter-spacing:-.035em}.lede{max-width:820px;margin:16px 0 0;color:#c3d1df;font-size:17px;line-height:1.65}.why-box{margin-top:22px;padding:16px 18px;border-left:3px solid var(--gold);background:rgba(3,7,18,.42)}.why-box span{font-size:10px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;color:var(--gold)}.why-box p{margin:5px 0 0;color:var(--muted);line-height:1.55}
        .notice{margin-top:18px;padding:15px 18px;border:1px solid rgba(233,196,106,.28);background:rgba(233,196,106,.07)}.notice strong{color:var(--gold)}.notice p{margin:5px 0 0;color:#d8dfeb}.form-card{margin-top:18px;padding:32px;border:1px solid var(--line);background:rgba(5,13,26,.88);box-shadow:var(--shadow)}.form-grid{display:grid;gap:18px}.form-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.form-stack{display:grid;gap:20px}.field{display:grid;gap:8px}.field-label{font-size:12px;font-weight:900;color:#e6edf6}.field-hint{font-size:11px;color:var(--muted);line-height:1.5}.field input,.field textarea{width:100%;border:1px solid var(--line);border-radius:6px;background:#071120;color:var(--text);padding:13px 14px;font:inherit;outline:none}.field textarea{resize:vertical;line-height:1.55}.field input:focus,.field textarea:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(77,209,255,.08)}
        .choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.choice-grid.compact{grid-template-columns:repeat(3,minmax(0,1fr))}.choice-card{display:grid;grid-template-columns:34px 1fr;gap:12px;text-align:left;min-height:112px;padding:16px;border:1px solid var(--line);border-radius:7px;background:#071120;color:inherit;cursor:pointer}.choice-card.active{border-color:rgba(77,209,255,.6);background:rgba(77,209,255,.075);box-shadow:inset 0 0 24px rgba(77,209,255,.04)}.choice-mark{display:grid;place-items:center;width:28px;height:28px;border:1px solid var(--line);border-radius:50%;color:var(--cyan);font-weight:900}.choice-card strong,.choice-card small{display:block}.choice-card small{margin-top:6px;color:var(--muted);line-height:1.45}.determination-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.determination{min-height:150px;padding:18px;text-align:left;border:1px solid var(--line);border-radius:7px;background:#071120;color:inherit;cursor:pointer;opacity:.62}.determination.active{opacity:1;border-color:var(--line2);box-shadow:inset 0 0 26px rgba(77,209,255,.04)}.determination strong{display:block;font-size:22px}.determination small{display:block;margin-top:10px;color:var(--muted);line-height:1.55}.determination.allow strong{color:var(--green)}.determination.hold strong,.determination.escalate strong{color:var(--gold)}.determination.deny strong{color:var(--red)}
        .owner-card{display:grid;gap:20px}.info-box{padding:16px;border:1px solid var(--line);background:rgba(77,209,255,.04)}.info-box p{margin:6px 0 0;color:var(--muted);line-height:1.55}.publication-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.publication-card{min-height:160px;padding:18px;text-align:left;border:1px solid var(--line);border-radius:7px;background:#071120;color:inherit;cursor:pointer}.publication-card.active{border-color:var(--cyan);background:rgba(77,209,255,.07)}.publication-card strong,.publication-card span{display:block}.publication-card span{margin-top:7px;color:var(--gold);font-size:10px;font-weight:900;letter-spacing:.12em}.publication-card p{color:var(--muted);line-height:1.5}
        .review-layout{display:grid;gap:24px}.review-summary{border:1px solid var(--line);background:#071120}.review-head{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:20px;border-bottom:1px solid var(--line)}.review-head span,.review-head strong{display:block}.review-head span{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.12em}.review-head strong{margin-top:5px;font-size:15px}.review-row{display:grid;grid-template-columns:180px minmax(0,1fr);gap:18px;padding:13px 18px;border-bottom:1px solid rgba(126,164,211,.09)}.review-row:last-child{border-bottom:0}.review-row span{color:var(--muted);font-size:11px;font-weight:800}.review-row strong,.review-row code{overflow-wrap:anywhere}.review-row code{font-size:11px;color:#b9dcef}.attestations{display:grid;gap:10px}.check-row{display:grid;grid-template-columns:22px 1fr;gap:12px;align-items:start;padding:16px;border:1px solid var(--line);background:#071120}.check-row input{margin-top:3px}.check-row b,.check-row small{display:block}.check-row small{margin-top:5px;color:var(--muted);line-height:1.45}.final-actions{display:flex;flex-wrap:wrap;gap:10px}.submission-receipt{padding:22px;border:1px solid rgba(83,227,166,.32);background:rgba(83,227,166,.06)}.submission-receipt span{color:var(--green);font-size:10px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.submission-receipt h3{margin:6px 0 0}.submission-receipt p{color:var(--muted);line-height:1.55}.submission-receipt code{display:block;margin-top:12px;color:#d6eef6;overflow-wrap:anywhere}
        .step-status{margin-top:16px}.status-pill{display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px solid rgba(255,113,132,.25);background:rgba(255,113,132,.045)}.status-pill>span{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,113,132,.4);color:var(--red);font-weight:900}.status-pill.pass{border-color:rgba(83,227,166,.25);background:rgba(83,227,166,.045)}.status-pill.pass>span{border-color:rgba(83,227,166,.4);color:var(--green)}.status-pill b,.status-pill small{display:block}.status-pill small{margin-top:3px;color:var(--muted)}.wizard-actions{display:grid;grid-template-columns:150px 1fr 170px;gap:12px;align-items:center;margin-top:16px}.action-note{text-align:center;color:var(--muted);font-size:11px}.primary,.secondary{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border-radius:6px;border:1px solid var(--line2);font-size:13px;font-weight:900;text-decoration:none;cursor:pointer}.primary{background:linear-gradient(135deg,#21b8ed,#4dd1ff);color:#011018;box-shadow:0 15px 38px rgba(32,185,238,.18)}.secondary{background:rgba(8,21,38,.82);color:#dce9f8}.primary:disabled,.secondary:disabled{opacity:.32;cursor:not-allowed}
        .modal-backdrop{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:24px;background:rgba(0,0,0,.72);backdrop-filter:blur(8px)}.modal-card{position:relative;width:min(760px,100%);max-height:88vh;overflow:auto;padding:28px;border:1px solid var(--line2);background:#071120;box-shadow:0 30px 120px rgba(0,0,0,.6)}.modal-close{position:absolute;top:14px;right:14px;width:36px;height:36px;border:1px solid var(--line);border-radius:50%;background:#0a1627;color:#fff;font-size:22px;cursor:pointer}.modal-card h2{margin:0 0 20px;font-family:Georgia,serif;font-size:38px}.preview-grid{border:1px solid var(--line)}.preview-copy{margin-top:14px;padding:16px;border:1px solid var(--line);background:rgba(255,255,255,.02)}.preview-copy span{font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}.preview-copy p{margin:7px 0 0;color:var(--muted);line-height:1.6}
        footer{position:relative;z-index:4;display:flex;align-items:center;justify-content:space-between;gap:24px;max-width:1500px;margin:auto;padding:28px 34px;border-top:1px solid var(--line);color:var(--muted)}footer strong,footer span{display:block}footer span{margin-top:3px;font-size:11px}footer nav{display:flex;gap:16px}
        @media (max-width:1100px){.wizard-shell{grid-template-columns:1fr}.step-rail{position:relative;top:auto;max-height:none}.rail-steps{grid-template-columns:repeat(2,minmax(0,1fr))}.choice-grid.compact{grid-template-columns:repeat(2,minmax(0,1fr))}.determination-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media (max-width:760px){.topbar{padding:16px 18px}.topbar nav{display:none}.progress-shell{padding:20px 18px 0}.progress-copy{align-items:flex-start;flex-direction:column}.wizard-shell{padding:20px 18px 70px}.rail-steps{grid-template-columns:1fr}.step-card{grid-template-columns:1fr;padding:24px}.step-number{font-size:42px}.form-card{padding:22px}.form-grid.two,.choice-grid,.choice-grid.compact,.publication-grid,.determination-grid{grid-template-columns:1fr}.wizard-actions{grid-template-columns:1fr}.action-note{order:-1}.review-row{grid-template-columns:1fr;gap:4px}footer{align-items:flex-start;flex-direction:column;padding:24px 18px}}
      `}</style>
    </main>
  );
}

function ReviewRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div className="review-row"><span>{label}</span>{mono ? <code>{value}</code> : <strong>{value}</strong>}</div>;
}
