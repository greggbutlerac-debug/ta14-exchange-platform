"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type ReviewState = "draft" | "ready" | "submitted";
type Determination = "SUPPORTED" | "CONDITIONAL" | "HOLD" | "DENY" | "ESCALATE" | "OUTSIDE_SCOPE";

type ReviewForm = {
  entityName: string;
  website: string;
  entityType: string;
  jurisdiction: string;
  contactName: string;
  contactEmail: string;
  capabilityName: string;
  capabilitySummary: string;
  claim: string;
  nonClaims: string;
  scope: string;
  exclusions: string;
  authorityBasis: string;
  evidenceSummary: string;
  evidenceTypes: string[];
  version: string;
  executionPath: string;
  expectedOutcome: string;
  limitations: string;
  confidentiality: string;
  publicationPermission: string;
  conflictDisclosure: string;
  attestation: boolean;
};

type Step = {
  id: number;
  short: string;
  title: string;
  academyTitle: string;
  academyText: string;
  why: string;
  reviewQuestion: string;
};

const STORAGE_KEY = "ta14.entity-review.guided-workspace.v1";

const initialForm: ReviewForm = {
  entityName: "",
  website: "",
  entityType: "AI governance entity",
  jurisdiction: "",
  contactName: "",
  contactEmail: "",
  capabilityName: "",
  capabilitySummary: "",
  claim: "",
  nonClaims: "",
  scope: "",
  exclusions: "",
  authorityBasis: "",
  evidenceSummary: "",
  evidenceTypes: [],
  version: "",
  executionPath: "",
  expectedOutcome: "",
  limitations: "",
  confidentiality: "Bounded review only",
  publicationPermission: "Case study subject to mutual approval",
  conflictDisclosure: "",
  attestation: false,
};

const steps: Step[] = [
  {
    id: 1,
    short: "Entity",
    title: "Identify the entity entering review",
    academyTitle: "Entity identity is the first governance boundary",
    academyText:
      "TA-14 does not review an abstract claim without preserving who made it, who controls the capability, who may answer for it, and which jurisdiction or authority applies.",
    why:
      "Identity prevents a review from becoming detached from ownership, stewardship, responsibility, and the version of the entity that made the declaration.",
    reviewQuestion: "Can the reviewing institution attribute the submission to a real and accountable entity?",
  },
  {
    id: 2,
    short: "Capability",
    title: "Choose one bounded capability",
    academyTitle: "A whole architecture is usually too broad to prove in one review",
    academyText:
      "The strongest founding demonstrations begin with one capability that can be observed, evidenced, bounded, and evaluated without pretending the review proves the entity's entire system.",
    why:
      "A narrow capability allows the review to preserve what was demonstrated, what was not tested, and where the result may or may not be relied upon.",
    reviewQuestion: "Is the selected capability specific enough to be reviewed through evidence rather than marketing language?",
  },
  {
    id: 3,
    short: "Claim",
    title: "State the exact claim and non-claims",
    academyTitle: "A claim becomes governable when its boundaries are explicit",
    academyText:
      "Statements such as 'our platform ensures safe AI' cannot be reviewed without translation. TA-14 helps convert broad promotional language into a bounded statement that can survive scrutiny.",
    why:
      "Non-claims are not weaknesses. They prevent an artifact or case study from silently expanding beyond what the evidence supports.",
    reviewQuestion: "Can an independent reviewer tell precisely what would count as support, partial support, or failure?",
  },
  {
    id: 4,
    short: "Scope",
    title: "Define scope, exclusions, and review conditions",
    academyTitle: "Scope is the perimeter of the review",
    academyText:
      "The review should identify the system, workflow, environment, role, jurisdiction, version, operating conditions, exclusions, and dependencies that limit the meaning of any finding.",
    why:
      "Without scope, a supported result may be repeated in settings where the capability was never tested or authorized.",
    reviewQuestion: "Would a later reader know exactly where the finding applies and where it does not?",
  },
  {
    id: 5,
    short: "Authority",
    title: "Identify authority and governing instruments",
    academyTitle: "Capability does not create authority",
    academyText:
      "A technical system may be able to act without being authorized to act. The review therefore preserves the policy, law, standard, contract, delegation, role, or technical permission relied upon.",
    why:
      "Authority determines whether the proposed action, control, refusal, escalation, or output was permitted under the conditions of the demonstration.",
    reviewQuestion: "What current and applicable authority governed the capability at the time of review?",
  },
  {
    id: 6,
    short: "Evidence",
    title: "Assemble evidence and continuity",
    academyTitle: "Evidence must be attributable, relevant, and continuous",
    academyText:
      "Screenshots and assertions may help explain a capability, but they do not automatically preserve identity, chronology, version, integrity, execution effect, or outcome.",
    why:
      "TA-14 must distinguish source evidence from interpretation, identify gaps, and determine whether the evidence remains connected to the claim through the complete route.",
    reviewQuestion: "What evidence can be admitted, and what remains merely asserted?",
  },
  {
    id: 7,
    short: "Execution",
    title: "Map the execution pathway and expected outcome",
    academyTitle: "A decision is not the same as execution",
    academyText:
      "The review maps what action was proposed, what technical boundary controlled it, what effect occurred, what left the system, and what outcome became observable in reality.",
    why:
      "Execution mapping prevents a policy decision, signed record, or dashboard result from being mistaken for proof that the consequential action was actually controlled.",
    reviewQuestion: "Can the route show what crossed the commit boundary and what outcome followed?",
  },
  {
    id: 8,
    short: "Boundaries",
    title: "Set confidentiality, publication, and conflict boundaries",
    academyTitle: "Review should not require surrendering intellectual property",
    academyText:
      "The participant chooses what TA-14 may inspect, preserve, reference, publish, redact, or keep private. Public findings remain bounded by the agreed evidence and publication perimeter.",
    why:
      "These boundaries allow serious review without turning participation into uncontrolled disclosure or implied endorsement.",
    reviewQuestion: "Are confidentiality, attribution, publication, conflict, and correction rights explicit?",
  },
  {
    id: 9,
    short: "Validate",
    title: "Validate the package before submission",
    academyTitle: "Readiness is not the same as a favorable finding",
    academyText:
      "A complete package means the submission is organized enough to enter review. TA-14 may still return supported, conditional, hold, deny, escalate, or outside-scope findings.",
    why:
      "Validation reduces avoidable review delay and shows the participant which weaknesses can be corrected before institutional review begins.",
    reviewQuestion: "Is the package complete, coherent, bounded, and ready for a governed review?",
  },
];

const evidenceChoices = [
  "Policies and procedures",
  "System architecture",
  "Technical logs",
  "Signed records",
  "Demonstration video",
  "Test results",
  "Source code excerpts",
  "API or tool output",
  "Authority documents",
  "Standards or legal mapping",
  "Outcome evidence",
  "Independent review material",
];

const findings: Array<{ status: Determination; meaning: string }> = [
  { status: "SUPPORTED", meaning: "The admitted evidence supports the bounded claim under the preserved conditions." },
  { status: "CONDITIONAL", meaning: "The claim is supported only if stated dependencies, controls, or limitations remain true." },
  { status: "HOLD", meaning: "The review cannot proceed or conclude until a correctable gap is resolved." },
  { status: "DENY", meaning: "The evidence or authority does not support the proposed claim or execution pathway." },
  { status: "ESCALATE", meaning: "The matter requires another authority, specialist, conflict process, or higher review lane." },
  { status: "OUTSIDE_SCOPE", meaning: "The question is not resolved by this review and must not be implied by the resulting artifact." },
];

const academyPath = [
  ["Learn", "Understand the review purpose, terms, evidence rules, and finding states."],
  ["Build", "Construct the entity identity, capability, claim, scope, authority, and evidence package."],
  ["Validate", "Identify missing fields, unsupported language, conflicts, and weak boundaries before submission."],
  ["Submit", "Commit a structured review package with an explicit attestation and publication perimeter."],
  ["Review", "TA-14 examines admissibility, authority, continuity, execution, outcomes, and limits."],
  ["Receive Findings", "Obtain bounded findings, corrective actions, artifact options, and publication pathways."],
];

function fieldScore(form: ReviewForm): { complete: number; total: number; percentage: number } {
  const checks = [
    form.entityName.trim().length >= 2,
    form.jurisdiction.trim().length >= 2,
    form.contactName.trim().length >= 2,
    /.+@.+\..+/.test(form.contactEmail),
    form.capabilityName.trim().length >= 4,
    form.capabilitySummary.trim().length >= 40,
    form.claim.trim().length >= 30,
    form.nonClaims.trim().length >= 20,
    form.scope.trim().length >= 35,
    form.exclusions.trim().length >= 20,
    form.authorityBasis.trim().length >= 25,
    form.evidenceSummary.trim().length >= 40,
    form.evidenceTypes.length >= 2,
    form.version.trim().length >= 1,
    form.executionPath.trim().length >= 40,
    form.expectedOutcome.trim().length >= 25,
    form.limitations.trim().length >= 20,
    form.confidentiality.trim().length >= 5,
    form.publicationPermission.trim().length >= 5,
    form.conflictDisclosure.trim().length >= 2,
    form.attestation,
  ];
  const complete = checks.filter(Boolean).length;
  return { complete, total: checks.length, percentage: Math.round((complete / checks.length) * 100) };
}

function statusFromScore(score: number): ReviewState {
  if (score >= 95) return "ready";
  return "draft";
}

function updateField<K extends keyof ReviewForm>(
  setter: React.Dispatch<React.SetStateAction<ReviewForm>>,
  key: K,
  value: ReviewForm[K],
) {
  setter((current) => ({ ...current, [key]: value }));
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  help,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "email" | "url";
  help?: string;
}) {
  return (
    <label className="field">
      <span>{label}{required ? <b>Required</b> : null}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      {help ? <small>{help}</small> : null}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required,
  help,
  rows = 6,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  help?: string;
  rows?: number;
}) {
  return (
    <label className="field fieldWide">
      <span>{label}{required ? <b>Required</b> : null}</span>
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      {help ? <small>{help}</small> : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  help,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  help?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      {help ? <small>{help}</small> : null}
    </label>
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function EntityReviewPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [form, setForm] = useState<ReviewForm>(initialForm);
  const [reviewState, setReviewState] = useState<ReviewState>("draft");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [showAcademy, setShowAcademy] = useState(true);
  const [showPackage, setShowPackage] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as { form?: ReviewForm; activeStep?: number; submittedAt?: string | null };
      if (parsed.form) setForm({ ...initialForm, ...parsed.form });
      if (typeof parsed.activeStep === "number") setActiveStep(Math.min(9, Math.max(1, parsed.activeStep)));
      if (parsed.submittedAt) {
        setSubmittedAt(parsed.submittedAt);
        setReviewState("submitted");
      }
    } catch (error) {
      console.error("Unable to restore Entity Review workspace", error);
    }
  }, []);

  const score = useMemo(() => fieldScore(form), [form]);
  const computedState = reviewState === "submitted" ? "submitted" : statusFromScore(score.percentage);
  const currentStep = steps.find((step) => step.id === activeStep) ?? steps[0];

  useEffect(() => {
    if (reviewState !== "submitted") setReviewState(computedState);
  }, [computedState, reviewState]);

  function saveDraft() {
    const timestamp = new Date().toISOString();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, activeStep, submittedAt }));
    setSavedAt(timestamp);
  }

  function resetDraft() {
    if (!window.confirm("Reset this guided Entity Review package? This removes the saved local draft.")) return;
    setForm(initialForm);
    setActiveStep(1);
    setReviewState("draft");
    setSavedAt(null);
    setSubmittedAt(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function submitPackage() {
    if (score.percentage < 95 || !form.attestation) {
      setActiveStep(9);
      setShowPackage(true);
      return;
    }
    const timestamp = new Date().toISOString();
    setSubmittedAt(timestamp);
    setReviewState("submitted");
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, activeStep: 9, submittedAt: timestamp }));
  }

  function toggleEvidence(value: string) {
    setForm((current) => ({
      ...current,
      evidenceTypes: current.evidenceTypes.includes(value)
        ? current.evidenceTypes.filter((item) => item !== value)
        : [...current.evidenceTypes, value],
    }));
  }

  const packagePreview = {
    entity: form.entityName || "Not supplied",
    capability: form.capabilityName || "Not supplied",
    claim: form.claim || "Not supplied",
    scope: form.scope || "Not supplied",
    authority: form.authorityBasis || "Not supplied",
    evidence: form.evidenceTypes,
    version: form.version || "Not supplied",
    confidentiality: form.confidentiality,
    publication: form.publicationPermission,
    readiness: `${score.percentage}%`,
  };

  return (
    <main>
      <div className="cosmos" aria-hidden="true">
        <div className="nebula nebulaA" />
        <div className="nebula nebulaB" />
        <div className="stars starsA" />
        <div className="stars starsB" />
        <div className="route routeA" />
        <div className="route routeB" />
        <div className="route routeC" />
        <div className="orbital orbitalOne"><i/><i/><i/><span/></div>
        <div className="orbital orbitalTwo"><i/><i/><i/><span/></div>
      </div>

      <section className="topBar shell">
        <div>
          <p>TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
          <span>Entity Review · Guided Institutional Intake</span>
        </div>
        <nav>
          <Link href="/">Institution Home</Link>
          <Link href="/workspace/ai-governance">AI Governance Exchange</Link>
          <Link href="/academy">TA-14 Academy</Link>
        </nav>
      </section>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">ENTITY REVIEW ACADEMY + LIVE SUBMISSION WORKSPACE</p>
          <h1>Do not upload a pile of documents. <em>Build a review-ready governance package.</em></h1>
          <p className="heroLead">
            TA-14 guides your entity through identity, capability, claim, scope, authority, evidence, execution, confidentiality, validation, and submission. Every step teaches why the requirement matters so your organization understands the package it creates before it enters institutional review.
          </p>
          <div className="heroActions">
            <button className="button primary" onClick={() => document.getElementById("guided-review")?.scrollIntoView({ behavior: "smooth" })}>Begin guided review <span>↓</span></button>
            <button className="button gold" onClick={() => setShowAcademy((value) => !value)}>{showAcademy ? "Hide" : "Open"} Entity Review Academy</button>
            <Link className="button glass" href="/artifacts">Inspect execution artifacts <Arrow /></Link>
          </div>
          <div className="heroSignals">
            <article><strong>9</strong><span>Guided review stages</span></article>
            <article><strong>6</strong><span>Finding states</span></article>
            <article><strong>1</strong><span>Structured review package</span></article>
          </div>
        </div>
        <div className="heroVisual" aria-hidden="true">
          <div className="temple">
            <div className="templeCrown"><i/><i/><i/></div>
            <div className="templeColumns left"><i/><i/><i/></div>
            <div className="templeColumns right"><i/><i/><i/></div>
            <div className="templeDoor">
              <div className="innerWorld"><span>ER</span><i/><i/><i/></div>
              <div className="doorLeaf"><b>ENTITY REVIEW</b><small>LEARN · BUILD · VALIDATE · SUBMIT</small></div>
            </div>
            <div className="lightSpill" />
            <div className="templeSteps"><i/><i/><i/></div>
          </div>
        </div>
      </section>

      <section className="academyRibbon shell" aria-label="Entity Review Academy pathway">
        {academyPath.map(([title, text], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{title}</strong>
            <p>{text}</p>
          </article>
        ))}
      </section>

      {showAcademy ? (
        <section className="academy shell">
          <div className="sectionHeading">
            <p className="eyebrow">TA-14 ENTITY REVIEW ACADEMY</p>
            <h2>Understand the review before you enter it.</h2>
            <p>
              Entity Review Academy teaches the process, evidence expectations, claim boundaries, confidentiality protections, finding states, artifact options, and correction pathways. A participant should never be asked to submit to a process it cannot understand.
            </p>
          </div>
          <div className="academyGrid">
            <article>
              <span>01</span>
              <h3>What is reviewed?</h3>
              <p>The entity, selected capability, bounded claim, authority, admitted evidence, route, execution effect, outcome, and limitations.</p>
            </article>
            <article>
              <span>02</span>
              <h3>What is not implied?</h3>
              <p>Registration is not certification. Participation is not endorsement. One supported claim does not prove the entire organization.</p>
            </article>
            <article>
              <span>03</span>
              <h3>How is IP protected?</h3>
              <p>The participant defines the inspection, preservation, redaction, attribution, confidentiality, and publication perimeter.</p>
            </article>
            <article>
              <span>04</span>
              <h3>What comes back?</h3>
              <p>Bounded findings, limitations, corrective actions, artifact options, registry pathways, and mutually approved publication opportunities.</p>
            </article>
          </div>
          <div className="findingMatrix">
            {findings.map((finding) => (
              <article key={finding.status} data-state={finding.status}>
                <strong>{finding.status.replace("_", " ")}</strong>
                <p>{finding.meaning}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="workspace shell" id="guided-review">
        <aside className="stepRail">
          <div className="railHeading">
            <p>Guided package</p>
            <strong>{score.percentage}% ready</strong>
          </div>
          <div className="progressTrack"><span style={{ width: `${score.percentage}%` }} /></div>
          <div className="stateBadge" data-state={reviewState}>{reviewState === "submitted" ? "SUBMITTED" : reviewState === "ready" ? "READY FOR REVIEW" : "DRAFT IN PROGRESS"}</div>
          <nav>
            {steps.map((step) => (
              <button key={step.id} className={activeStep === step.id ? "active" : ""} onClick={() => setActiveStep(step.id)}>
                <span>{String(step.id).padStart(2, "0")}</span>
                <div><strong>{step.short}</strong><small>{step.title}</small></div>
              </button>
            ))}
          </nav>
          <div className="railActions">
            <button onClick={saveDraft}>Save local draft</button>
            <button onClick={() => setShowPackage(true)}>Preview package</button>
            <button className="danger" onClick={resetDraft}>Reset package</button>
          </div>
          {savedAt ? <p className="savedNotice">Saved {new Date(savedAt).toLocaleString()}</p> : null}
        </aside>

        <div className="reviewPanel">
          <header className="panelHeader">
            <div>
              <p className="eyebrow">STEP {String(currentStep.id).padStart(2, "0")} · {currentStep.short.toUpperCase()}</p>
              <h2>{currentStep.title}</h2>
            </div>
            <span>{activeStep} / {steps.length}</span>
          </header>

          <section className="academyCard">
            <div className="academyIcon">AC</div>
            <div>
              <strong>{currentStep.academyTitle}</strong>
              <p>{currentStep.academyText}</p>
              <small><b>Why TA-14 asks:</b> {currentStep.why}</small>
              <small><b>Reviewer question:</b> {currentStep.reviewQuestion}</small>
            </div>
          </section>

          <div className="formArea">
            {activeStep === 1 ? (
              <div className="fieldGrid">
                <TextField label="Legal or public entity name" required value={form.entityName} onChange={(value) => updateField(setForm, "entityName", value)} placeholder="Example: Strix Governance Labs" />
                <TextField label="Website" type="url" value={form.website} onChange={(value) => updateField(setForm, "website", value)} placeholder="https://" />
                <SelectField label="Entity type" value={form.entityType} onChange={(value) => updateField(setForm, "entityType", value)} options={["AI governance entity", "Technical control provider", "Assurance organization", "Research group", "Independent architect", "Enterprise governance team", "Public institution", "Other"]} />
                <TextField label="Primary jurisdiction" required value={form.jurisdiction} onChange={(value) => updateField(setForm, "jurisdiction", value)} placeholder="Country, state, or governing jurisdiction" />
                <TextField label="Responsible contact" required value={form.contactName} onChange={(value) => updateField(setForm, "contactName", value)} />
                <TextField label="Contact email" type="email" required value={form.contactEmail} onChange={(value) => updateField(setForm, "contactEmail", value)} />
              </div>
            ) : null}

            {activeStep === 2 ? (
              <div className="fieldGrid">
                <TextField label="Capability name" required value={form.capabilityName} onChange={(value) => updateField(setForm, "capabilityName", value)} placeholder="Example: Signed refusal artifact for unauthorized role change" help="Name one capability, not the entire company." />
                <TextField label="Version or release" required value={form.version} onChange={(value) => updateField(setForm, "version", value)} placeholder="v1.4.2, build ID, release date, or immutable reference" />
                <TextAreaField label="Capability summary" required value={form.capabilitySummary} onChange={(value) => updateField(setForm, "capabilitySummary", value)} placeholder="Describe what the capability does, who uses it, what enters it, what leaves it, and the consequence it controls." help="Use operational language. Avoid unsupported words such as always, guarantees, fully compliant, or safe by design unless you can prove them." />
              </div>
            ) : null}

            {activeStep === 3 ? (
              <div className="fieldGrid">
                <TextAreaField label="Exact bounded claim" required value={form.claim} onChange={(value) => updateField(setForm, "claim", value)} placeholder="Under the defined conditions, the capability..." help="Write one statement that could be supported, conditioned, held, denied, escalated, or placed outside scope." />
                <TextAreaField label="Explicit non-claims" required value={form.nonClaims} onChange={(value) => updateField(setForm, "nonClaims", value)} placeholder="This review does not claim that..." help="State what the participant and TA-14 must not imply from the result." />
              </div>
            ) : null}

            {activeStep === 4 ? (
              <div className="fieldGrid">
                <TextAreaField label="Review scope" required value={form.scope} onChange={(value) => updateField(setForm, "scope", value)} placeholder="Identify the system, workflow, users, environment, geography, version, operating conditions, and review period." />
                <TextAreaField label="Exclusions and dependencies" required value={form.exclusions} onChange={(value) => updateField(setForm, "exclusions", value)} placeholder="Identify integrations, downstream systems, human decisions, vendor dependencies, environments, or claims excluded from this review." />
                <TextAreaField label="Known limitations" required value={form.limitations} onChange={(value) => updateField(setForm, "limitations", value)} placeholder="Describe conditions where the capability may fail, degrade, require escalation, or stop being reliable." />
              </div>
            ) : null}

            {activeStep === 5 ? (
              <div className="fieldGrid">
                <TextAreaField label="Authority basis" required value={form.authorityBasis} onChange={(value) => updateField(setForm, "authorityBasis", value)} placeholder="Identify the law, policy, standard, contract, role delegation, authorization, approval rule, or technical permission relied upon." help="Capability answers what the system can do. Authority answers what it is allowed to do." />
                <div className="guidedExample">
                  <strong>Authority examples</strong>
                  <p>Organizational policy · employment role · regulatory obligation · contractual duty · delegated approval · safety rule · access-control policy · technical scope grant.</p>
                </div>
              </div>
            ) : null}

            {activeStep === 6 ? (
              <div className="fieldGrid">
                <TextAreaField label="Evidence summary" required value={form.evidenceSummary} onChange={(value) => updateField(setForm, "evidenceSummary", value)} placeholder="Describe the source evidence, who created it, when it was created, how it is attributed, and how it connects to the claim." />
                <div className="evidencePicker fieldWide">
                  <span>Evidence available <b>Select at least two</b></span>
                  <div>
                    {evidenceChoices.map((choice) => (
                      <button key={choice} className={form.evidenceTypes.includes(choice) ? "selected" : ""} onClick={() => toggleEvidence(choice)} type="button">
                        <i>{form.evidenceTypes.includes(choice) ? "✓" : "+"}</i>{choice}
                      </button>
                    ))}
                  </div>
                  <small>Selection does not make evidence admissible. TA-14 will still inspect relevance, integrity, identity, chronology, version, authority, continuity, and limitations.</small>
                </div>
              </div>
            ) : null}

            {activeStep === 7 ? (
              <div className="fieldGrid">
                <TextAreaField label="Execution pathway" required value={form.executionPath} onChange={(value) => updateField(setForm, "executionPath", value)} placeholder="Proposed action → evidence and authority checks → determination → commit boundary → technical effect → egress → observed outcome." help="Describe what actually happens, not only what the policy or interface says should happen." />
                <TextAreaField label="Expected observable outcome" required value={form.expectedOutcome} onChange={(value) => updateField(setForm, "expectedOutcome", value)} placeholder="What should become observable in reality if the capability operates correctly?" />
              </div>
            ) : null}

            {activeStep === 8 ? (
              <div className="fieldGrid">
                <SelectField label="Confidentiality boundary" value={form.confidentiality} onChange={(value) => updateField(setForm, "confidentiality", value)} options={["Bounded review only", "Public evidence allowed", "Private review with public finding", "Confidential review only", "Custom confidentiality agreement required"]} />
                <SelectField label="Publication permission" value={form.publicationPermission} onChange={(value) => updateField(setForm, "publicationPermission", value)} options={["Case study subject to mutual approval", "Public case study permitted", "Anonymous case study permitted", "Finding only; no case study", "No publication without separate written permission"]} />
                <TextAreaField label="Conflict and relationship disclosure" required value={form.conflictDisclosure} onChange={(value) => updateField(setForm, "conflictDisclosure", value)} placeholder="Disclose partnerships, financial relationships, prior review involvement, authorship overlap, or state none identified." />
              </div>
            ) : null}

            {activeStep === 9 ? (
              <div className="validationView">
                <div className="readinessGauge" style={{ "--score": `${score.percentage * 3.6}deg` } as CSSProperties}>
                  <div><strong>{score.percentage}%</strong><span>Package readiness</span></div>
                </div>
                <div className="validationCopy">
                  <h3>{score.percentage >= 95 ? "The package is ready to enter institutional review." : "The package still contains incomplete review requirements."}</h3>
                  <p>{score.complete} of {score.total} readiness checks are currently satisfied. Readiness means the package is organized enough to review; it does not predict or guarantee a favorable finding.</p>
                  <label className="attestation">
                    <input type="checkbox" checked={form.attestation} onChange={(event) => updateField(setForm, "attestation", event.target.checked)} />
                    <span>I attest that this submission is accurate to the best of my knowledge, that the claim and non-claims are intentionally bounded, and that TA-14 may review the package under the confidentiality and publication conditions selected above.</span>
                  </label>
                  <div className="validationActions">
                    <button className="button glass" onClick={() => setShowPackage(true)}>Preview complete package</button>
                    <button className="button gold" onClick={saveDraft}>Save before submission</button>
                    <button className="button primary" disabled={reviewState === "submitted"} onClick={submitPackage}>{reviewState === "submitted" ? "Package submitted" : "Submit for Entity Review"}</button>
                  </div>
                  {submittedAt ? <div className="submittedReceipt"><strong>Submission receipt created</strong><span>{new Date(submittedAt).toLocaleString()}</span><p>This local demonstration preserves a submission state in your browser. Production submission should bind the package to authenticated entity identity, server-side storage, integrity hashes, and reviewer assignment.</p></div> : null}
                </div>
              </div>
            ) : null}
          </div>

          <footer className="panelFooter">
            <button onClick={() => setActiveStep((value) => Math.max(1, value - 1))} disabled={activeStep === 1}>← Previous</button>
            <span>TA-14 Academy explains every requirement before the participant commits it.</span>
            <button onClick={() => setActiveStep((value) => Math.min(9, value + 1))} disabled={activeStep === 9}>Next step →</button>
          </footer>
        </div>
      </section>

      <section className="institutionalOutput shell">
        <div className="sectionHeading centered">
          <p className="eyebrow">WHAT TA-14 RETURNS</p>
          <h2>A review does not end with a score.</h2>
          <p>The output preserves what was reviewed, what evidence was admitted, what authority applied, what was demonstrated, what remained unresolved, and what later readers are permitted to rely upon.</p>
        </div>
        <div className="outputGrid">
          <article><span>01</span><h3>Bounded findings</h3><p>Supported, conditional, held, denied, escalated, and outside-scope conclusions tied to the precise claim and evidence.</p></article>
          <article><span>02</span><h3>Corrective actions</h3><p>Specific evidence, authority, continuity, control, execution, publication, or scope issues that may be corrected and resubmitted.</p></article>
          <article><span>03</span><h3>Execution artifact</h3><p>Where applicable, a preserved proof package connecting the proposed action, route, determination, technical effect, outcome, and limits.</p></article>
          <article><span>04</span><h3>Case study pathway</h3><p>A mutually approved publication explaining what the evidence established without disclosing excluded intellectual property.</p></article>
          <article><span>05</span><h3>Registry eligibility</h3><p>A dated and attributable record of the reviewed capability, version, stewardship, findings, status, challenges, and supersession history.</p></article>
          <article><span>06</span><h3>Reassessment route</h3><p>Conditions for correction, renewal, material-change review, version reassessment, withdrawal, or supersession.</p></article>
        </div>
      </section>

      <section className="chainSection shell">
        <p className="eyebrow">THE GOVERNING ROUTE</p>
        <div className="chain">
          {["Reality", "Record", "Continuity", "Admissibility", "Binding", "Commit", "Execution", "Outcome"].map((label, index, array) => (
            <div key={label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong>{index < array.length - 1 ? <i>→</i> : null}</div>
          ))}
        </div>
        <p>No admissible evidence. No admissible execution.</p>
      </section>

      <footer className="siteFooter shell">
        <div><strong>TA-14 Entity Review</strong><span>Guided institutional intake, Academy, readiness, and bounded review.</span></div>
        <div><Link href="/">Authority Institution</Link><Link href="/academy">Academy</Link><Link href="/registry">Registry</Link><Link href="/artifacts">Artifacts</Link></div>
      </footer>

      {showPackage ? (
        <div className="modalBackdrop" role="presentation" onMouseDown={() => setShowPackage(false)}>
          <section className="packageModal" role="dialog" aria-modal="true" aria-label="Entity Review package preview" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><p className="eyebrow">REVIEW PACKAGE PREVIEW</p><h2>{form.entityName || "Unnamed entity"}</h2></div><button onClick={() => setShowPackage(false)}>×</button></header>
            <div className="packageStatus"><span data-state={reviewState}>{reviewState.toUpperCase()}</span><strong>{score.percentage}% readiness</strong></div>
            <div className="packageGrid">
              {Object.entries(packagePreview).map(([key, value]) => (
                <article key={key}><span>{key.replace(/([A-Z])/g, " $1")}</span><p>{Array.isArray(value) ? value.join(" · ") || "Not supplied" : value}</p></article>
              ))}
            </div>
            <div className="packageBoundary"><strong>Preview boundary</strong><p>This preview is generated from the participant's current local draft. It is not an institutional finding, certification, registry entry, or execution artifact.</p></div>
            <footer><button className="button glass" onClick={() => setShowPackage(false)}>Return to builder</button><button className="button gold" onClick={saveDraft}>Save package</button></footer>
          </section>
        </div>
      ) : null}

      <style jsx>{
`
        :global(*){
box-sizing:border-box
}

        :global(html){
scroll-behavior:smooth;
background:#020611
}

        :global(body){
margin:0;
background:#020611;
color:#f7fbff;
font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
}

        :global(button),:global(input),:global(textarea),:global(select){
font:inherit
}

        :global(a){
color:inherit
}

        main{
min-height:100vh;
position:relative;
overflow:hidden;
isolation:isolate;
background:linear-gradient(180deg,rgba(2,6,17,.5),rgba(2,8,15,.94))
}

        .shell{
width:min(1480px,calc(100% - 36px));
margin-inline:auto;
position:relative;
z-index:2
}

        .cosmos{
position:fixed;
inset:0;
z-index:-4;
overflow:hidden;
pointer-events:none;
background:radial-gradient(circle at 48% -10%,rgba(25,123,177,.2),transparent 34%),linear-gradient(180deg,#020611,#06121e 55%,#020711)
}

        .nebula{
position:absolute;
width:780px;
height:780px;
border-radius:50%;
filter:blur(120px);
opacity:.14;
animation:nebula 18s ease-in-out infinite alternate
}

        .nebulaA{
left:-260px;
top:15%;
background:#0069d5
}

        .nebulaB{
right:-240px;
top:48%;
background:#9b4dff;
animation-delay:-8s
}

        .stars{
position:absolute;
inset:-10%
}

        .starsA{
background-image:radial-gradient(circle,rgba(255,255,255,.9) 0 1px,transparent 1.5px);
background-size:108px 108px;
animation:starDrift 45s linear infinite
}

        .starsB{
background-image:radial-gradient(circle,rgba(94,219,255,.72) 0 1px,transparent 1.5px);
background-size:176px 176px;
background-position:43px 67px;
animation:starDriftB 58s linear infinite
}

        .route{
position:absolute;
width:78vw;
height:1px;
background:linear-gradient(90deg,transparent,rgba(90,211,239,.68),rgba(255,197,77,.55),transparent);
filter:drop-shadow(0 0 8px rgba(76,210,240,.45))
}

        .route::after{
content:"";
position:absolute;
left:15%;
top:-3px;
width:7px;
height:7px;
border-radius:50%;
background:#fff0b5;
box-shadow:0 0 16px #ffd56a;
animation:packet 7s linear infinite
}

        .routeA{
left:-20%;
top:20%;
transform:rotate(-8deg);
animation:routeA 22s linear infinite
}

        .routeB{
right:-20%;
top:52%;
transform:rotate(9deg);
animation:routeB 27s linear infinite
}

        .routeC{
left:-20%;
top:82%;
transform:rotate(-4deg);
animation:routeA 31s linear infinite reverse
}

        .orbital{
position:absolute;
width:320px;
height:220px;
opacity:.5;
animation:float 10s ease-in-out infinite alternate
}

        .orbitalOne{
left:-35px;
top:70px
}

        .orbitalTwo{
right:-30px;
top:110px;
animation-delay:-4s
}

        .orbital i{
position:absolute;
inset:35px 10px;
border:1px solid rgba(255,195,64,.35);
border-radius:50%;
transform:rotate(-18deg)
}

        .orbital i:nth-child(2){
transform:rotate(17deg) scale(.76);
border-color:rgba(84,217,246,.3)
}

        .orbital i:nth-child(3){
transform:rotate(-42deg) scale(.54)
}

        .orbital span{
position:absolute;
left:50%;
top:50%;
width:62px;
height:62px;
border-radius:50%;
background:radial-gradient(circle at 35% 30%,#fff7c3,#f5ac2b 34%,#723100 72%);
box-shadow:0 0 34px rgba(255,174,40,.6);
transform:translate(-50%,-50%)
}

        .topBar{
min-height:84px;
display:flex;
align-items:center;
justify-content:space-between;
gap:24px;
border-bottom:1px solid rgba(116,216,238,.14)
}

        .topBar p{
margin:0;
color:#f5d58b;
font-size:10px;
font-weight:950;
letter-spacing:.21em
}

        .topBar span{
display:block;
margin-top:6px;
color:#7393a3;
font-size:11px
}

        .topBar nav{
display:flex;
flex-wrap:wrap;
justify-content:flex-end;
gap:10px
}

        .topBar nav a{
padding:9px 11px;
border:1px solid rgba(111,205,226,.17);
border-radius:999px;
color:#b9d1dc;
text-decoration:none;
font-size:10px;
font-weight:850;
transition:.22s
}

        .topBar nav a:hover{
border-color:#77dff2;
color:white;
transform:translateY(-2px)
}

        .hero{
min-height:760px;
padding:70px 0 56px;
display:grid;
grid-template-columns:1.12fr .88fr;
gap:62px;
align-items:center
}

        .heroCopy{
position:relative;
z-index:2
}

        .eyebrow{
margin:0;
color:#6fe0f4;
font-size:10px;
font-weight:950;
letter-spacing:.2em
}

        .hero h1{
max-width:900px;
margin:16px 0 22px;
font-family:Georgia,"Times New Roman",serif;
font-size:clamp(54px,6vw,92px);
line-height:.95;
letter-spacing:-.055em;
text-wrap:balance
}

        .hero h1 em{
color:#ffc84f;
font-style:italic;
text-shadow:0 0 36px rgba(255,188,54,.18)
}

        .heroLead{
max-width:860px;
margin:0;
color:#c2d1da;
font-size:17px;
line-height:1.72
}

        .heroActions{
display:flex;
flex-wrap:wrap;
gap:11px;
margin-top:28px
}

        .button{
min-height:50px;
padding:0 19px;
display:inline-flex;
align-items:center;
justify-content:center;
gap:11px;
border-radius:13px;
border:1px solid transparent;
text-decoration:none;
font-size:12px;
font-weight:950;
cursor:pointer;
transition:.25s;
position:relative;
overflow:hidden
}

        .button:hover{
transform:translateY(-3px)
}

        .button:disabled{
opacity:.45;
cursor:not-allowed;
transform:none
}

        .button.primary{
color:#031016;
background:linear-gradient(135deg,#c8f7ff,#65d6ef 64%,#2ca1c4);
border-color:#9cebf8;
box-shadow:0 14px 32px rgba(67,196,224,.22)
}

        .button.gold{
color:#281600;
background:linear-gradient(135deg,#ffebae,#efbc4d 62%,#b36e0d);
border-color:#f5d17b;
box-shadow:0 14px 32px rgba(225,164,42,.2)
}

        .button.glass{
color:#e8faff;
background:linear-gradient(180deg,rgba(18,49,68,.9),rgba(7,24,38,.92));
border-color:rgba(124,215,236,.28)
}

        .heroSignals{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:11px;
margin-top:34px;
max-width:780px
}

        .heroSignals article{
padding:17px;
border:1px solid rgba(111,205,226,.14);
border-radius:15px;
background:rgba(255,255,255,.024)
}

        .heroSignals strong{
display:block;
color:#ffe2a0;
font-family:Georgia,serif;
font-size:30px
}

        .heroSignals span{
display:block;
margin-top:4px;
color:#829ca8;
font-size:9px;
font-weight:900;
letter-spacing:.1em;
text-transform:uppercase
}

        .heroVisual{
height:620px;
display:grid;
place-items:center;
perspective:1800px
}

        .temple{
width:450px;
height:560px;
position:relative;
filter:drop-shadow(0 30px 60px rgba(0,0,0,.5))
}

        .templeCrown{
position:absolute;
left:50%;
top:10px;
width:390px;
height:95px;
transform:translateX(-50%);
clip-path:polygon(50% 0,100% 85%,92% 100%,8% 100%,0 85%);
background:linear-gradient(180deg,#e2bd73,#8b5310 70%,#4d2904);
box-shadow:0 0 28px rgba(255,196,71,.3)
}

        .templeCrown::before{
content:"TA-14";
position:absolute;
left:50%;
top:47%;
transform:translate(-50%,-50%);
color:#fff0bd;
font-family:Georgia,serif;
font-size:23px;
font-weight:950;
letter-spacing:.12em
}

        .templeCrown i{
position:absolute;
left:50%;
bottom:5px;
width:2px;
height:72px;
background:linear-gradient(180deg,#fff0b9,#6d3600);
transform-origin:bottom
}

        .templeCrown i:nth-child(1){
transform:rotate(-25deg)
}

        .templeCrown i:nth-child(2){
transform:rotate(0)
}

        .templeCrown i:nth-child(3){
transform:rotate(25deg)
}

        .templeColumns{
position:absolute;
top:105px;
bottom:82px;
width:72px;
display:flex;
gap:5px;
z-index:4
}

        .templeColumns.left{
left:18px
}
.templeColumns.right{
right:18px
}

        .templeColumns i{
flex:1;
border-radius:8px 8px 3px 3px;
background:linear-gradient(90deg,#704009,#f0ca72 44%,#8a500d 80%);
box-shadow:0 0 18px rgba(255,192,57,.25)
}

        .templeDoor{
position:absolute;
left:50%;
top:100px;
width:275px;
height:395px;
transform:translateX(-50%);
border:12px solid #b87b17;
border-radius:145px 145px 14px 14px;
background:linear-gradient(90deg,#5b3003,#f0c66c 18%,#97570a 50%,#f4cc76 82%,#5d3103);
box-shadow:0 0 0 3px rgba(255,224,162,.5),0 0 52px rgba(255,181,45,.32)
}

        .templeDoor::before{
content:"";
position:absolute;
inset:12px;
border-radius:128px 128px 5px 5px;
background:#06121d;
overflow:hidden
}

        .innerWorld{
position:absolute;
inset:25px;
z-index:1;
border-radius:120px 120px 4px 4px;
display:grid;
place-items:center;
background:radial-gradient(circle at 50% 42%,rgba(221,131,255,.42),transparent 18%),radial-gradient(circle at 50% 55%,rgba(73,214,242,.25),transparent 48%),linear-gradient(180deg,#110921,#041421);
overflow:hidden
}

        .innerWorld span{
width:105px;
height:105px;
display:grid;
place-items:center;
border-radius:50%;
border:2px solid #da91ff;
color:#f7dcff;
background:rgba(43,14,63,.72);
box-shadow:0 0 40px rgba(209,111,255,.36);
font-family:Georgia,serif;
font-size:37px;
font-weight:950
}

        .innerWorld i{
position:absolute;
width:180%;
height:1px;
background:linear-gradient(90deg,transparent,#81e9f8,transparent);
animation:scan 4s ease-in-out infinite
}

        .innerWorld i:nth-child(2){
transform:rotate(32deg);
animation-delay:-1s
}

        .innerWorld i:nth-child(3){
transform:rotate(-27deg);
animation-delay:-2s
}

        .innerWorld i:nth-child(4){
transform:rotate(6deg);
animation-delay:-3s
}

        .doorLeaf{
position:absolute;
inset:12px;
z-index:3;
border-radius:128px 128px 5px 5px;
transform-origin:left center;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
border:1px solid rgba(255,228,170,.55);
background:linear-gradient(100deg,rgba(255,255,255,.16),transparent 20%,transparent 76%,rgba(0,0,0,.28)),repeating-linear-gradient(96deg,rgba(255,255,255,.04) 0 2px,transparent 2px 8px),linear-gradient(90deg,#8d4f08,#dda038 42%,#a86411 65%,#774006);
box-shadow:inset 0 0 0 3px rgba(87,45,3,.38),inset 0 0 28px rgba(255,226,168,.13),0 12px 32px rgba(0,0,0,.35);
transition:transform 850ms cubic-bezier(.16,.78,.16,1)
}

        .doorLeaf b{
color:#fff0c1;
font-family:Georgia,serif;
font-size:26px;
letter-spacing:.05em;
text-shadow:0 0 18px rgba(255,204,91,.4)
}

        .doorLeaf small{
max-width:170px;
margin-top:10px;
color:#472500;
font-size:8px;
font-weight:950;
letter-spacing:.14em;
text-align:center
}

        .temple:hover .doorLeaf{
transform:translateZ(30px) rotateY(-52deg)
}

        .lightSpill{
position:absolute;
left:50%;
bottom:38px;
width:92px;
height:250px;
transform:translateX(-50%) scaleX(.18);
transform-origin:top;
clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);
background:linear-gradient(180deg,#fffad7,rgba(255,197,77,.72) 42%,transparent);
filter:blur(6px);
opacity:.2;
transition:.85s;
z-index:2
}

        .temple:hover .lightSpill{
opacity:1;
transform:translateX(-50%) scaleX(4.5)
}

        .templeSteps{
position:absolute;
left:50%;
bottom:20px;
width:430px;
transform:translateX(-50%);
display:grid;
gap:6px
}

        .templeSteps i{
height:18px;
background:linear-gradient(180deg,#d9aa56,#684007);
box-shadow:0 4px 16px rgba(0,0,0,.35)
}

        .templeSteps i:nth-child(2){
margin-inline:-18px
}
.templeSteps i:nth-child(3){
margin-inline:-36px
}

        .academyRibbon{
display:grid;
grid-template-columns:repeat(6,1fr);
gap:10px;
padding:18px;
border:1px solid rgba(255,192,71,.2);
border-radius:22px;
background:linear-gradient(145deg,rgba(31,24,16,.82),rgba(5,16,27,.94));
box-shadow:0 22px 60px rgba(0,0,0,.22)
}

        .academyRibbon article{
min-height:145px;
padding:15px;
border:1px solid rgba(255,201,92,.12);
border-radius:13px;
background:rgba(255,255,255,.018)
}

        .academyRibbon span{
color:#b98731;
font-size:9px;
font-weight:950
}

        .academyRibbon strong{
display:block;
margin:14px 0 7px;
color:#ffe2a0;
font-size:13px
}

        .academyRibbon p{
margin:0;
color:#8499a4;
font-size:10px;
line-height:1.5
}

        .academy{
margin-top:80px;
padding:54px;
border:1px solid rgba(112,216,239,.18);
border-radius:30px;
background:radial-gradient(circle at 0 0,rgba(71,199,229,.11),transparent 36%),linear-gradient(145deg,rgba(10,31,46,.94),rgba(4,14,24,.98));
box-shadow:0 30px 80px rgba(0,0,0,.25)
}

        .sectionHeading{
max-width:1020px
}

        .sectionHeading.centered{
margin-inline:auto;
text-align:center
}

        .sectionHeading h2{
margin:12px 0 16px;
font-family:Georgia,serif;
font-size:clamp(40px,4.8vw,70px);
line-height:.98;
letter-spacing:-.045em
}

        .sectionHeading>p:not(.eyebrow){
color:#aebfc8;
font-size:16px;
line-height:1.7
}

        .academyGrid{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:13px;
margin-top:30px
}

        .academyGrid article{
min-height:215px;
padding:23px;
border:1px solid rgba(101,205,229,.15);
border-radius:18px;
background:rgba(255,255,255,.022)
}

        .academyGrid span,.outputGrid span{
width:40px;
height:40px;
display:grid;
place-items:center;
border-radius:50%;
border:1px solid rgba(112,216,239,.35);
color:#8deafb;
background:rgba(67,188,215,.07);
font-size:10px;
font-weight:950
}

        .academyGrid h3,.outputGrid h3{
margin:24px 0 9px;
font-size:20px
}

        .academyGrid p,.outputGrid p{
margin:0;
color:#93a8b3;
line-height:1.62;
font-size:13px
}

        .findingMatrix{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:10px;
margin-top:22px
}

        .findingMatrix article{
padding:17px;
border-radius:14px;
border:1px solid rgba(255,255,255,.1);
background:rgba(255,255,255,.025)
}

        .findingMatrix strong{
font-size:11px;
letter-spacing:.1em
}

        .findingMatrix p{
margin:7px 0 0;
color:#9dacb5;
font-size:11px;
line-height:1.5
}

        .findingMatrix [data-state="SUPPORTED"]{
border-color:rgba(93,232,164,.35)
}

        .findingMatrix [data-state="CONDITIONAL"]{
border-color:rgba(255,209,91,.34)
}

        .findingMatrix [data-state="HOLD"]{
border-color:rgba(255,180,70,.34)
}

        .findingMatrix [data-state="DENY"]{
border-color:rgba(255,105,105,.34)
}

        .findingMatrix [data-state="ESCALATE"]{
border-color:rgba(210,126,255,.34)
}

        .findingMatrix [data-state="OUTSIDE_SCOPE"]{
border-color:rgba(139,171,191,.3)
}

        .workspace{
margin-top:92px;
display:grid;
grid-template-columns:330px 1fr;
gap:18px;
align-items:start;
scroll-margin-top:24px
}

        .stepRail{
position:sticky;
top:18px;
padding:22px;
border:1px solid rgba(109,210,233,.17);
border-radius:22px;
background:linear-gradient(180deg,rgba(10,29,43,.96),rgba(5,17,28,.98));
box-shadow:0 24px 70px rgba(0,0,0,.28)
}

        .railHeading{
display:flex;
align-items:end;
justify-content:space-between;
gap:10px
}

        .railHeading p{
margin:0;
color:#d8f7fd;
font-size:10px;
font-weight:950;
letter-spacing:.13em;
text-transform:uppercase
}

        .railHeading strong{
color:#ffe09a;
font-family:Georgia,serif;
font-size:22px
}

        .progressTrack{
height:7px;
margin:14px 0 12px;
border-radius:999px;
background:#08111a;
overflow:hidden;
box-shadow:inset 0 0 0 1px rgba(255,255,255,.05)
}

        .progressTrack span{
display:block;
height:100%;
border-radius:inherit;
background:linear-gradient(90deg,#54d7ec,#ffd06c);
box-shadow:0 0 14px rgba(89,218,239,.4);
transition:width .3s
}

        .stateBadge{
display:inline-flex;
min-height:28px;
align-items:center;
padding:0 9px;
border-radius:999px;
border:1px solid rgba(112,216,239,.25);
color:#95e9f7;
background:rgba(58,178,205,.08);
font-size:8px;
font-weight:950;
letter-spacing:.11em
}

        .stateBadge[data-state="ready"]{
border-color:rgba(255,205,92,.38);
color:#ffe09b;
background:rgba(105,69,10,.13)
}

        .stateBadge[data-state="submitted"]{
border-color:rgba(89,231,157,.4);
color:#a9ffd1;
background:rgba(28,100,65,.14)
}

        .stepRail nav{
display:grid;
gap:6px;
margin-top:18px
}

        .stepRail nav button{
width:100%;
min-height:63px;
padding:10px;
display:grid;
grid-template-columns:34px 1fr;
gap:10px;
align-items:center;
border:1px solid transparent;
border-radius:12px;
color:#adbec7;
background:transparent;
text-align:left;
cursor:pointer;
transition:.22s
}

        .stepRail nav button:hover,.stepRail nav button.active{
border-color:rgba(116,218,237,.26);
background:rgba(62,184,211,.07);
transform:translateX(3px)
}

        .stepRail nav button>span{
width:31px;
height:31px;
display:grid;
place-items:center;
border-radius:50%;
border:1px solid rgba(112,216,239,.25);
color:#82dff0;
font-size:9px;
font-weight:950
}

        .stepRail nav strong{
display:block;
color:#edfaff;
font-size:11px
}

        .stepRail nav small{
display:block;
margin-top:3px;
color:#708a96;
font-size:9px;
line-height:1.35
}

        .railActions{
display:grid;
grid-template-columns:1fr 1fr;
gap:7px;
margin-top:18px
}

        .railActions button{
min-height:36px;
border:1px solid rgba(112,216,239,.2);
border-radius:9px;
color:#bfe6ee;
background:rgba(255,255,255,.025);
font-size:9px;
font-weight:900;
cursor:pointer
}

        .railActions .danger{
grid-column:span 2;
border-color:rgba(255,105,105,.18);
color:#d8a3a3
}

        .savedNotice{
margin:11px 0 0;
color:#77929d;
font-size:9px;
text-align:center
}

        .reviewPanel{
min-width:0;
border:1px solid rgba(111,205,226,.18);
border-radius:26px;
background:linear-gradient(145deg,rgba(10,29,44,.96),rgba(4,14,24,.99));
box-shadow:0 30px 85px rgba(0,0,0,.32);
overflow:hidden
}

        .panelHeader{
min-height:130px;
padding:27px 30px;
display:flex;
justify-content:space-between;
align-items:center;
gap:20px;
border-bottom:1px solid rgba(111,205,226,.12);
background:radial-gradient(circle at 100% 0,rgba(85,211,238,.08),transparent 42%)
}

        .panelHeader h2{
margin:9px 0 0;
font-family:Georgia,serif;
font-size:clamp(31px,3.2vw,50px);
line-height:1;
letter-spacing:-.035em
}

        .panelHeader>span{
width:62px;
height:62px;
display:grid;
place-items:center;
border-radius:50%;
border:1px solid rgba(255,198,77,.3);
color:#ffdc8b;
background:rgba(93,59,5,.11);
font-family:Georgia,serif;
font-size:17px
}

        .academyCard{
margin:22px 28px 0;
padding:19px;
display:grid;
grid-template-columns:58px 1fr;
gap:16px;
border:1px solid rgba(255,197,76,.2);
border-radius:16px;
background:linear-gradient(145deg,rgba(77,50,12,.15),rgba(255,255,255,.02))
}

        .academyIcon{
width:54px;
height:54px;
display:grid;
place-items:center;
border-radius:50%;
border:2px solid #f1bc4a;
color:#ffe5a2;
background:rgba(90,58,8,.2);
box-shadow:0 0 22px rgba(255,188,54,.14);
font-family:Georgia,serif;
font-weight:950
}

        .academyCard strong{
color:#ffe1a0;
font-size:14px
}

        .academyCard p{
margin:7px 0 10px;
color:#b9c7ce;
font-size:12px;
line-height:1.58
}

        .academyCard small{
display:block;
margin-top:4px;
color:#8297a2;
font-size:10px;
line-height:1.5
}

        .academyCard small b{
color:#7fdff0
}

        .formArea{
padding:28px
}

        .fieldGrid{
display:grid;
grid-template-columns:repeat(2,1fr);
gap:18px
}

        .fieldWide{
grid-column:span 2
}

        .field{
display:grid;
gap:8px
}

        .field>span,.evidencePicker>span{
display:flex;
justify-content:space-between;
gap:14px;
color:#d9eef3;
font-size:11px;
font-weight:900
}

        .field>span b,.evidencePicker>span b{
color:#78929e;
font-size:8px;
letter-spacing:.1em;
text-transform:uppercase
}

        .field input,.field textarea,.field select{
width:100%;
border:1px solid rgba(115,213,234,.18);
border-radius:12px;
color:#f4fbff;
background:#06131f;
outline:none;
transition:.2s
}

        .field input,.field select{
min-height:48px;
padding:0 13px
}

        .field textarea{
padding:13px;
resize:vertical;
line-height:1.58
}

        .field input:focus,.field textarea:focus,.field select:focus{
border-color:#6fdff3;
box-shadow:0 0 0 3px rgba(85,208,234,.08)
}

        .field small,.evidencePicker small{
color:#708892;
font-size:9px;
line-height:1.45
}

        .guidedExample{
grid-column:span 2;
padding:18px;
border:1px dashed rgba(255,200,90,.26);
border-radius:13px;
background:rgba(255,190,64,.04)
}

        .guidedExample strong{
color:#ffe09b;
font-size:12px
}

        .guidedExample p{
margin:7px 0 0;
color:#8fa2ab;
font-size:11px;
line-height:1.5
}

        .evidencePicker{
display:grid;
gap:10px
}

        .evidencePicker>div{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:8px
}

        .evidencePicker button{
min-height:45px;
padding:9px 10px;
display:flex;
align-items:center;
gap:8px;
border:1px solid rgba(112,216,239,.15);
border-radius:10px;
color:#a9bdc6;
background:rgba(255,255,255,.02);
text-align:left;
font-size:10px;
cursor:pointer;
transition:.2s
}

        .evidencePicker button:hover,.evidencePicker button.selected{
border-color:rgba(112,216,239,.5);
color:#e9fbff;
background:rgba(64,184,211,.08)
}

        .evidencePicker button i{
width:21px;
height:21px;
display:grid;
place-items:center;
border-radius:50%;
border:1px solid rgba(112,216,239,.24);
color:#7fe0f1;
font-style:normal;
font-weight:950
}

        .validationView{
display:grid;
grid-template-columns:260px 1fr;
gap:34px;
align-items:center;
padding:10px 0 4px
}

        .readinessGauge{
width:230px;
height:230px;
margin:auto;
display:grid;
place-items:center;
border-radius:50%;
background:conic-gradient(#65ddef var(--score),rgba(255,255,255,.06) 0);
box-shadow:0 0 50px rgba(76,208,235,.16);
position:relative
}

        .readinessGauge::before{
content:"";
position:absolute;
inset:15px;
border-radius:50%;
background:#071521;
box-shadow:inset 0 0 35px rgba(255,198,77,.08)
}

        .readinessGauge div{
position:relative;
z-index:2;
text-align:center
}

        .readinessGauge strong{
display:block;
color:#ffe09a;
font-family:Georgia,serif;
font-size:48px
}

        .readinessGauge span{
display:block;
color:#8299a4;
font-size:9px;
font-weight:900;
letter-spacing:.1em;
text-transform:uppercase
}

        .validationCopy h3{
margin:0 0 10px;
font-family:Georgia,serif;
font-size:31px
}

        .validationCopy>p{
color:#9eb0b9;
line-height:1.6
}

        .attestation{
margin-top:18px;
padding:15px;
display:grid;
grid-template-columns:22px 1fr;
gap:12px;
border:1px solid rgba(255,198,77,.18);
border-radius:13px;
background:rgba(255,192,70,.04);
cursor:pointer
}

        .attestation input{
width:18px;
height:18px;
accent-color:#64d8ed
}

        .attestation span{
color:#b7c6cd;
font-size:11px;
line-height:1.55
}

        .validationActions{
display:flex;
flex-wrap:wrap;
gap:9px;
margin-top:18px
}

        .submittedReceipt{
margin-top:18px;
padding:15px;
border:1px solid rgba(89,231,157,.25);
border-radius:13px;
background:rgba(29,105,68,.1)
}

        .submittedReceipt strong{
color:#aaffd1
}
.submittedReceipt span{
display:block;
margin-top:4px;
color:#7f9b8d;
font-size:9px
}
.submittedReceipt p{
margin:8px 0 0;
color:#93aaa0;
font-size:10px;
line-height:1.5
}

        .panelFooter{
min-height:74px;
padding:14px 24px;
display:grid;
grid-template-columns:120px 1fr 120px;
gap:14px;
align-items:center;
border-top:1px solid rgba(111,205,226,.12);
background:rgba(0,0,0,.12)
}

        .panelFooter button{
min-height:40px;
border:1px solid rgba(112,216,239,.2);
border-radius:10px;
color:#d7f6fc;
background:rgba(255,255,255,.025);
font-size:10px;
font-weight:900;
cursor:pointer
}

        .panelFooter button:disabled{
opacity:.3;
cursor:not-allowed
}

        .panelFooter span{
color:#6f8792;
font-size:9px;
text-align:center
}

        .institutionalOutput{
margin-top:118px
}

        .outputGrid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:14px;
margin-top:34px
}

        .outputGrid article{
min-height:250px;
padding:24px;
border:1px solid rgba(111,205,226,.15);
border-radius:20px;
background:radial-gradient(circle at 100% 0,rgba(82,208,236,.08),transparent 42%),linear-gradient(145deg,rgba(11,33,48,.9),rgba(5,17,28,.96));
transition:.25s
}

        .outputGrid article:hover{
transform:translateY(-7px);
border-color:rgba(112,216,239,.42);
box-shadow:0 24px 58px rgba(0,0,0,.25)
}

        .chainSection{
margin-top:110px;
padding:42px;
border:1px solid rgba(255,191,67,.22);
border-radius:26px;
text-align:center;
background:radial-gradient(circle at 50% 0,rgba(255,184,41,.09),transparent 42%),linear-gradient(145deg,rgba(26,22,16,.9),rgba(5,15,25,.97))
}

        .chain{
display:grid;
grid-template-columns:repeat(8,1fr);
gap:8px;
margin-top:22px
}

        .chain div{
position:relative;
padding:15px 8px;
border:1px solid rgba(255,198,77,.14);
border-radius:13px;
background:rgba(255,255,255,.02)
}

        .chain span{
display:block;
color:#9a7430;
font-size:8px;
font-weight:950
}
.chain strong{
display:block;
margin-top:6px;
color:#ffd778;
font-family:Georgia,serif;
font-size:14px
}
.chain i{
position:absolute;
right:-9px;
top:50%;
color:#bc7d1c;
font-style:normal
}

        .chainSection>p:last-child{
margin:22px 0 0;
color:#ffe4a4;
font-size:13px;
font-weight:900
}

        .siteFooter{
min-height:120px;
margin-top:80px;
display:flex;
align-items:center;
justify-content:space-between;
gap:20px;
border-top:1px solid rgba(111,205,226,.13)
}

        .siteFooter strong{
display:block;
color:#dff7fc;
font-size:12px
}
.siteFooter span{
display:block;
margin-top:5px;
color:#708692;
font-size:10px
}
.siteFooter>div:last-child{
display:flex;
flex-wrap:wrap;
gap:9px
}
.siteFooter a{
color:#829aa6;
text-decoration:none;
font-size:10px
}
.siteFooter a:hover{
color:white
}

        .modalBackdrop{
position:fixed;
inset:0;
z-index:1000;
padding:24px;
display:grid;
place-items:center;
background:rgba(0,4,10,.78);
backdrop-filter:blur(14px)
}

        .packageModal{
width:min(980px,100%);
max-height:90vh;
overflow:auto;
border:1px solid rgba(112,216,239,.26);
border-radius:24px;
background:linear-gradient(145deg,#0b2231,#06121e);
box-shadow:0 40px 120px rgba(0,0,0,.6)
}

        .packageModal>header{
padding:24px 26px;
display:flex;
justify-content:space-between;
align-items:center;
gap:18px;
border-bottom:1px solid rgba(112,216,239,.14)
}

        .packageModal h2{
margin:8px 0 0;
font-family:Georgia,serif;
font-size:34px
}
.packageModal>header button{
width:42px;
height:42px;
border:1px solid rgba(255,255,255,.13);
border-radius:50%;
color:white;
background:rgba(255,255,255,.03);
font-size:25px;
cursor:pointer
}

        .packageStatus{
padding:16px 26px;
display:flex;
align-items:center;
justify-content:space-between;
gap:12px;
border-bottom:1px solid rgba(112,216,239,.1)
}

        .packageStatus span{
padding:7px 10px;
border:1px solid rgba(112,216,239,.25);
border-radius:999px;
color:#89e6f5;
font-size:9px;
font-weight:950;
letter-spacing:.1em
}
.packageStatus strong{
color:#ffe09a;
font-family:Georgia,serif;
font-size:18px
}

        .packageGrid{
display:grid;
grid-template-columns:repeat(2,1fr);
gap:10px;
padding:24px
}

        .packageGrid article{
padding:14px;
border:1px solid rgba(112,216,239,.12);
border-radius:12px;
background:rgba(255,255,255,.02)
}

        .packageGrid span{
color:#6fe0f3;
font-size:8px;
font-weight:950;
letter-spacing:.1em;
text-transform:uppercase
}
.packageGrid p{
margin:7px 0 0;
color:#b9c8cf;
font-size:11px;
line-height:1.55;
white-space:pre-wrap
}

        .packageBoundary{
margin:0 24px 20px;
padding:15px;
border:1px solid rgba(255,197,76,.18);
border-radius:13px;
background:rgba(255,191,67,.04)
}

        .packageBoundary strong{
color:#ffe09a;
font-size:11px
}
.packageBoundary p{
margin:5px 0 0;
color:#8ea1aa;
font-size:10px;
line-height:1.5
}

        .packageModal>footer{
padding:18px 24px;
display:flex;
justify-content:flex-end;
gap:9px;
border-top:1px solid rgba(112,216,239,.12)
}

        @keyframes nebula{
to{
transform:translate(70px,-40px) scale(1.12)
}

}

        @keyframes starDrift{
to{
transform:translate(110px,140px)
}

}

        @keyframes starDriftB{
to{
transform:translate(-120px,95px)
}

}

        @keyframes routeA{
from{
translate:-40vw 0;
opacity:0
}
20%{
opacity:.45
}
80%{
opacity:.3
}
to{
translate:110vw 0;
opacity:0
}

}

        @keyframes routeB{
from{
translate:40vw 0;
opacity:0
}
20%{
opacity:.4
}
80%{
opacity:.28
}
to{
translate:-110vw 0;
opacity:0
}

}

        @keyframes packet{
from{
transform:translateX(-20vw);
opacity:0
}
15%{
opacity:1
}
80%{
opacity:1
}
to{
transform:translateX(80vw);
opacity:0
}

}

        @keyframes float{
to{
translate:10px 13px
}

}

        @keyframes scan{
0%,100%{
translate:-50px -80px;
opacity:.1
}
50%{
translate:50px 80px;
opacity:.8
}

}

        @media(max-width:1220px){
.hero{
grid-template-columns:1fr
}
.heroVisual{
order:-1;
height:540px
}
.academyRibbon{
grid-template-columns:repeat(3,1fr)
}
.academyGrid{
grid-template-columns:repeat(2,1fr)
}
.workspace{
grid-template-columns:285px 1fr
}
.outputGrid{
grid-template-columns:repeat(2,1fr)
}
.chain{
grid-template-columns:repeat(4,1fr)
}
.chain i{
display:none
}

}

        @media(max-width:900px){
.topBar{
align-items:flex-start;
flex-direction:column;
padding:18px 0
}
.topBar nav{
justify-content:flex-start
}
.workspace{
grid-template-columns:1fr
}
.stepRail{
position:relative;
top:auto
}
.stepRail nav{
grid-template-columns:repeat(3,1fr)
}
.stepRail nav button{
grid-template-columns:30px 1fr
}
.validationView{
grid-template-columns:1fr
}
.fieldGrid{
grid-template-columns:1fr
}
.fieldWide,.guidedExample{
grid-column:span 1
}
.evidencePicker>div{
grid-template-columns:repeat(2,1fr)
}

}

        @media(max-width:700px){
.shell{
width:min(100% - 20px,1480px)
}
.hero{
padding-top:40px
}
.hero h1{
font-size:clamp(43px,12vw,64px)
}
.heroVisual{
height:430px;
transform:scale(.78);
margin-inline:-80px
}
.heroActions .button{
width:100%
}
.heroSignals{
grid-template-columns:1fr
}
.academyRibbon{
grid-template-columns:1fr
}
.academy,.chainSection{
padding:30px 18px
}
.academyGrid,.findingMatrix,.outputGrid,.packageGrid{
grid-template-columns:1fr
}
.stepRail nav{
grid-template-columns:1fr
}
.panelHeader{
padding:22px 18px
}
.panelHeader>span{
display:none
}
.academyCard{
margin:16px 14px 0;
grid-template-columns:1fr
}
.formArea{
padding:18px 14px
}
.evidencePicker>div{
grid-template-columns:1fr
}
.panelFooter{
grid-template-columns:1fr
}
.panelFooter span{
order:-1
}
.chain{
grid-template-columns:repeat(2,1fr)
}
.siteFooter{
align-items:flex-start;
flex-direction:column;
justify-content:center
}
.packageModal>footer{
flex-direction:column
}
.packageModal>footer .button{
width:100%
}

}

        @media(prefers-reduced-motion:reduce){
*,*::before,*::after{
animation-duration:1ms!important;
animation-iteration-count:1!important;
transition-duration:1ms!important;
scroll-behavior:auto!important
}

}

      `}</style>
    </main>
  );
}
