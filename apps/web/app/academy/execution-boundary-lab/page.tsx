"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type AnchorState = "SUPPORTED" | "DEFECT" | "UNRESOLVED" | "NOT_REVIEWED";
type Severity = "NONE" | "LOW" | "MATERIAL" | "CRITICAL";
type Confidence = "LOW" | "MODERATE" | "HIGH";

type AnchorKey =
  | "reality"
  | "record"
  | "continuity"
  | "admissibility"
  | "binding"
  | "commit"
  | "execution"
  | "outcome";

type AnchorDefinition = {
  key: AnchorKey;
  label: string;
  shortLabel: string;
  question: string;
  supportedPrompt: string;
  defectPrompt: string;
  unresolvedPrompt: string;
  failureSignals: string[];
};

type Mission = {
  id: string;
  title: string;
  domain: string;
  consequence: string;
  routeSummary: string;
  evidencePackage: string[];
  knownChanges: string[];
  hiddenRisk: string;
  expectedDecision: Decision;
  expectedSeverity: Severity;
  expectedDefects: AnchorKey[];
  explanation: string;
};

type AnchorReview = {
  state: AnchorState;
  note: string;
  source: string;
  correctiveAction: string;
};

type MissionReview = {
  reviewer: string;
  organization: string;
  reviewedAt: string;
  anchorReviews: Record<AnchorKey, AnchorReview>;
  severity: Severity;
  confidence: Confidence;
  decision: Decision | "";
  rationale: string;
  challengeQuestion: string;
  remediationPlan: string;
  verificationPlan: string;
  completed: boolean;
};

type PersistedState = {
  version: "3.0";
  updatedAt: string;
  activeMissionId: string;
  reviews: Record<string, MissionReview>;
};

const STORAGE_KEY = "ta14-academy-execution-boundary-lab-v4";

const anchors: AnchorDefinition[] = [
  {
    key: "reality",
    label: "Reality",
    shortLabel: "01",
    question: "Does the route begin from the condition that actually exists now?",
    supportedPrompt: "Identify the present condition, subject, environment, and consequence boundary that remain verified.",
    defectPrompt: "Describe any mismatch, substitution, assumption, stale condition, or invented fact at the beginning of the route.",
    unresolvedPrompt: "Identify what cannot yet be known and what evidence is required to establish reality.",
    failureSignals: [
      "The route relies on an assumed condition rather than a verified condition.",
      "The subject, system, person, asset, or environment cannot be specifically identified.",
      "A material condition changed after the route was constructed.",
    ],
  },
  {
    key: "record",
    label: "Record",
    shortLabel: "02",
    question: "Is the reality preserved in an attributable and reviewable record?",
    supportedPrompt: "Cite the record, source, timestamp, instrument, author, version, or evidence package supporting the route.",
    defectPrompt: "Identify missing attribution, incomplete evidence, contradictory records, or evidence that cannot be independently inspected.",
    unresolvedPrompt: "State which record element remains unavailable and whether a replacement record can be lawfully obtained.",
    failureSignals: [
      "The route cites conclusions without preserving the underlying evidence.",
      "The record lacks timestamps, attribution, version history, or source identity.",
      "The record was altered without a preserved change history.",
    ],
  },
  {
    key: "continuity",
    label: "Continuity",
    shortLabel: "03",
    question: "Can the evidence be traced continuously from capture to the present review?",
    supportedPrompt: "Describe custody, version, handoff, revalidation, elapsed time, and dependency checks preserving correspondence.",
    defectPrompt: "Locate the unexplained gap, broken handoff, stale interval, or version discontinuity.",
    unresolvedPrompt: "State which interval cannot be accounted for and what revalidation must occur.",
    failureSignals: [
      "There is an ungoverned interval between evidence capture and execution.",
      "A handoff occurred without attributable receipt or acceptance.",
      "The route cannot prove that the current condition still corresponds to the original record.",
    ],
  },
  {
    key: "admissibility",
    label: "Admissibility",
    shortLabel: "04",
    question: "Is the evidence sufficient, current, relevant, and conflict-resolved for this exact decision?",
    supportedPrompt: "Explain why the evidence is enough for this consequence and why remaining uncertainty does not defeat the decision.",
    defectPrompt: "Identify insufficiency, staleness, unresolved conflict, missing threshold, or evidence that supports a different conclusion.",
    unresolvedPrompt: "Define the uncertainty that prevents an admissibility determination and the evidence needed to resolve it.",
    failureSignals: [
      "The route treats available evidence as sufficient merely because it exists.",
      "Conflicting evidence was ignored or explained away without review.",
      "The decision threshold was never defined.",
    ],
  },
  {
    key: "binding",
    label: "Binding",
    shortLabel: "05",
    question: "Does a valid authority have power to bind this exact decision and consequence?",
    supportedPrompt: "Identify the governing authority, role, delegation, jurisdiction, limits, and conditions that remain valid.",
    defectPrompt: "Identify expired, absent, exceeded, conditional, conflicted, or incorrectly delegated authority.",
    unresolvedPrompt: "State which authority question requires qualified review before the route can bind.",
    failureSignals: [
      "The actor has system access but lacks authority for the consequence.",
      "The approval applies to a different action, subject, jurisdiction, or threshold.",
      "Authority expired or was superseded before execution.",
    ],
  },
  {
    key: "commit",
    label: "Commit",
    shortLabel: "06",
    question: "Is the approved state fixed, attributable, versioned, and protected from silent change?",
    supportedPrompt: "Identify the approved version, decision record, limits, dependencies, rationale, and accountable authority.",
    defectPrompt: "Identify an unversioned change, mutable approval, missing rationale, or dependency that changed after commitment.",
    unresolvedPrompt: "State what must be fixed before an execution state can be committed.",
    failureSignals: [
      "The route can change after approval without renewed review.",
      "The approved execution package lacks a preserved version or fingerprint.",
      "Dependencies are referenced but not frozen or revalidated.",
    ],
  },
  {
    key: "execution",
    label: "Execution",
    shortLabel: "07",
    question: "Is the proposed action precisely bounded, controlled, and correspondent to the approved route?",
    supportedPrompt: "Define the exact action, operator, sequence, duration, controls, stop conditions, rollback, and prohibited actions.",
    defectPrompt: "Identify scope expansion, method substitution, bypassed control, missing stop condition, or execution drift.",
    unresolvedPrompt: "State which execution element is too ambiguous to permit consequence.",
    failureSignals: [
      "The approved action and the actual action are not the same.",
      "The route lacks stop conditions, rollback, supervision, or bounded duration.",
      "A tool or operator changed without revalidation.",
    ],
  },
  {
    key: "outcome",
    label: "Outcome",
    shortLabel: "08",
    question: "Can the result be verified, preserved, challenged, and linked back to the authorized execution?",
    supportedPrompt: "Define success, failure, observation period, evidence capture, attribution, review, and challenge path.",
    defectPrompt: "Identify an unverifiable result, missing outcome evidence, absent monitoring, or consequence beyond the approved boundary.",
    unresolvedPrompt: "State what must be observable or preserved before outcome verification is possible.",
    failureSignals: [
      "The route ends when the action occurs rather than when the outcome is verified.",
      "No independent evidence proves that the intended result occurred.",
      "Adverse consequences have no preserved challenge or correction path.",
    ],
  },
];

const missions: Mission[] = [
  {
    id: "facility-restart",
    title: "Facility Restart After Environmental Drift",
    domain: "Environmental integrity governance",
    consequence: "Restarting the facility could expose occupants and equipment to an unresolved moisture and pressure condition.",
    routeSummary: "A facility shutdown route was constructed from a verified high-dew-point condition. Operations now requests restart based on a verbal report that the condition has improved.",
    evidencePackage: [
      "Original atmospheric integrity record with timestamped dew point and pressure data.",
      "Shutdown authorization tied to the original evidence package.",
      "A verbal statement from maintenance that the space feels dry.",
      "No preserved post-remediation sensor record.",
    ],
    knownChanges: [
      "Outdoor conditions changed materially.",
      "A temporary dehumidifier was moved between zones.",
      "No current continuity record proves the original risk is resolved.",
    ],
    hiddenRisk: "The actor requesting restart has operational access but no authority to supersede the environmental hold.",
    expectedDecision: "HOLD",
    expectedSeverity: "MATERIAL",
    expectedDefects: ["record", "continuity", "admissibility", "binding", "outcome"],
    explanation: "The route cannot move from shutdown to restart on an unpreserved verbal assurance. Current environmental evidence and valid release authority are required before execution.",
  },
  {
    id: "model-release",
    title: "AI Model Release With a Changed Dependency",
    domain: "Enterprise AI governance",
    consequence: "A changed retrieval source could alter recommendations delivered to regulated users.",
    routeSummary: "A model release was approved after testing against a fixed knowledge source. The deployment team replaced that source with a newer index to improve performance.",
    evidencePackage: [
      "Approved evaluation package for model version 4.2.",
      "Signed deployment record naming the original retrieval index.",
      "Change ticket showing the newer index was substituted after approval.",
      "No regression test for the substituted index.",
    ],
    knownChanges: [
      "A material dependency changed after commitment.",
      "The model binary is unchanged.",
      "The expected user population and consequence remain unchanged.",
    ],
    hiddenRisk: "The deployment team assumes that an unchanged model means an unchanged governed execution.",
    expectedDecision: "HOLD",
    expectedSeverity: "CRITICAL",
    expectedDefects: ["continuity", "admissibility", "commit", "execution", "outcome"],
    explanation: "The dependency substitution breaks correspondence between the tested route and the proposed execution. The combined system must be revalidated before release.",
  },
  {
    id: "payment-threshold",
    title: "Automated Payment Above the Approved Threshold",
    domain: "Financial execution integrity",
    consequence: "A payment may bind beyond the amount and authority originally reviewed.",
    routeSummary: "A claim was approved below an automated payment threshold. A later fee increased the amount above that threshold, but the system still presents the original approval token.",
    evidencePackage: [
      "Claimant identity and eligibility record.",
      "Original approval for the lower payment amount.",
      "System-generated fee added after approval.",
      "Current payment instruction above the automated threshold.",
    ],
    knownChanges: [
      "The financial consequence increased.",
      "The payment destination remains verified.",
      "No qualified reviewer approved the new amount.",
    ],
    hiddenRisk: "The route appears technically complete because the approval token remains valid in the system.",
    expectedDecision: "ESCALATE",
    expectedSeverity: "MATERIAL",
    expectedDefects: ["binding", "commit", "execution"],
    explanation: "The original approval cannot silently stretch to a larger consequence. The correct disposition is escalation to the authority assigned to the higher threshold.",
  },
  {
    id: "registry-acceptance",
    title: "Governed Record Registry Acceptance",
    domain: "Governed records",
    consequence: "Acceptance makes the record available as an official institutional artifact.",
    routeSummary: "An inspection package has completed review and is ready for acceptance into the governed registry.",
    evidencePackage: [
      "Attributable inspection record with verified asset identity.",
      "Complete evidence package and hash manifest.",
      "Preserved version history and reviewer disposition.",
      "Valid acceptance authority and registry scope.",
      "Defined post-acceptance verification and challenge path.",
    ],
    knownChanges: [],
    hiddenRisk: "The reviewer must still verify that the acceptance action exactly matches the approved registry scope.",
    expectedDecision: "ALLOW",
    expectedSeverity: "NONE",
    expectedDefects: [],
    explanation: "The route remains complete, continuous, attributable, bounded, and verifiable. Acceptance is supported if the reviewer confirms each anchor without contradiction.",
  },
  {
    id: "clinical-alert",
    title: "Clinical Alert With Conflicting Evidence",
    domain: "High-consequence decision support",
    consequence: "An automated escalation could trigger intervention based on a conflicted patient state.",
    routeSummary: "A clinical alert recommends immediate escalation. One current measurement supports the alert, while a second verified source contradicts it.",
    evidencePackage: [
      "Timestamped alert from the monitoring system.",
      "A separate verified measurement captured within the same interval.",
      "The two sources are materially inconsistent.",
      "No conflict-resolution protocol has been completed.",
    ],
    knownChanges: [
      "The patient's condition may be changing rapidly.",
      "Both sources are attributable and current.",
      "The governing route requires qualified review when evidence conflicts.",
    ],
    hiddenRisk: "The urgency of the alert may pressure the reviewer to treat one source as dispositive without preserving the conflict.",
    expectedDecision: "ESCALATE",
    expectedSeverity: "CRITICAL",
    expectedDefects: ["admissibility", "execution"],
    explanation: "Current evidence exists, but it is not yet admissible for autonomous binding because the conflict is unresolved. Qualified escalation preserves urgency without pretending certainty.",
  },
];

const stateDescriptions: Record<AnchorState, string> = {
  SUPPORTED: "The anchor is affirmatively supported by preserved evidence.",
  DEFECT: "A material defect prevents this anchor from supporting execution.",
  UNRESOLVED: "The anchor cannot yet be classified because required evidence or authority is missing.",
  NOT_REVIEWED: "No review determination has been preserved for this anchor.",
};

const stateLabels: Record<AnchorState, string> = {
  SUPPORTED: "Supported",
  DEFECT: "Defect",
  UNRESOLVED: "Unresolved",
  NOT_REVIEWED: "Not reviewed",
};

const decisions: Array<{ value: Decision; title: string; description: string }> = [
  { value: "ALLOW", title: "ALLOW", description: "Every required anchor is supported and the execution remains inside its approved boundary." },
  { value: "HOLD", title: "HOLD", description: "A correctable defect or unresolved condition prevents execution now." },
  { value: "DENY", title: "DENY", description: "The route lacks a lawful or admissible basis and cannot be corrected within this request." },
  { value: "ESCALATE", title: "ESCALATE", description: "A qualified authority must resolve a conflict, threshold, or consequence beyond the reviewer’s scope." },
];

function emptyAnchorReview(): AnchorReview {
  return { state: "NOT_REVIEWED", note: "", source: "", correctiveAction: "" };
}

function createMissionReview(): MissionReview {
  return {
    reviewer: "",
    organization: "",
    reviewedAt: "",
    anchorReviews: anchors.reduce((accumulator, anchor) => {
      accumulator[anchor.key] = emptyAnchorReview();
      return accumulator;
    }, {} as Record<AnchorKey, AnchorReview>),
    severity: "NONE",
    confidence: "MODERATE",
    decision: "",
    rationale: "",
    challengeQuestion: "",
    remediationPlan: "",
    verificationPlan: "",
    completed: false,
  };
}

function createInitialReviews(): Record<string, MissionReview> {
  return missions.reduce((accumulator, mission) => {
    accumulator[mission.id] = createMissionReview();
    return accumulator;
  }, {} as Record<string, MissionReview>);
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function ExecutionBoundaryLabPage() {
  const [activeMissionId, setActiveMissionId] = useState(missions[0].id);
  const [reviews, setReviews] = useState<Record<string, MissionReview>>(createInitialReviews);
  const [activeAnchor, setActiveAnchor] = useState<AnchorKey>("reality");
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [showReference, setShowReference] = useState(false);
  const [showFailureSignals, setShowFailureSignals] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        if (parsed.version === "3.0" && parsed.reviews) {
          setReviews((current) => ({ ...current, ...parsed.reviews }));
          if (parsed.activeMissionId && missions.some((mission) => mission.id === parsed.activeMissionId)) {
            setActiveMissionId(parsed.activeMissionId);
          }
        }
      }
    } catch {
      setSaveState("error");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timeout = window.setTimeout(() => {
      try {
        const state: PersistedState = {
          version: "3.0",
          updatedAt: new Date().toISOString(),
          activeMissionId,
          reviews,
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [activeMissionId, hydrated, reviews]);

  const activeMission = useMemo(
    () => missions.find((mission) => mission.id === activeMissionId) ?? missions[0],
    [activeMissionId],
  );

  const activeReview = reviews[activeMission.id] ?? createMissionReview();
  const activeDefinition = anchors.find((anchor) => anchor.key === activeAnchor) ?? anchors[0];
  const activeAnchorReview = activeReview.anchorReviews[activeAnchor];

  const missionMetrics = useMemo(() => {
    const records = Object.values(activeReview.anchorReviews);
    const supported = records.filter((record) => record.state === "SUPPORTED").length;
    const defects = records.filter((record) => record.state === "DEFECT").length;
    const unresolved = records.filter((record) => record.state === "UNRESOLVED").length;
    const reviewed = records.filter((record) => record.state !== "NOT_REVIEWED").length;
    const notesComplete = records.filter((record) => record.note.trim().length >= 25).length;
    const anchorScore = Math.round((reviewed / anchors.length) * 60);
    const noteScore = Math.round((notesComplete / anchors.length) * 20);
    const decisionScore = activeReview.decision ? 10 : 0;
    const rationaleScore = activeReview.rationale.trim().length >= 50 ? 10 : 0;
    const readiness = anchorScore + noteScore + decisionScore + rationaleScore;
    return { supported, defects, unresolved, reviewed, notesComplete, readiness };
  }, [activeReview]);

  const globalMetrics = useMemo(() => {
    const missionReviews = missions.map((mission) => reviews[mission.id] ?? createMissionReview());
    const completed = missionReviews.filter((review) => review.completed).length;
    const anchorsReviewed = missionReviews.reduce(
      (total, review) => total + Object.values(review.anchorReviews).filter((record) => record.state !== "NOT_REVIEWED").length,
      0,
    );
    const totalAnchors = missions.length * anchors.length;
    const progress = Math.round(((anchorsReviewed + completed * 2) / (totalAnchors + missions.length * 2)) * 100);
    return { completed, anchorsReviewed, totalAnchors, progress };
  }, [reviews]);

  const decisionConflict = useMemo(() => {
    if (!activeReview.decision) return "Select a decision after completing the anchor review.";
    if (activeReview.decision === "ALLOW" && (missionMetrics.defects > 0 || missionMetrics.unresolved > 0 || missionMetrics.reviewed < anchors.length)) {
      return "ALLOW conflicts with the preserved route record because at least one anchor is defective, unresolved, or not reviewed.";
    }
    if (activeReview.decision === "DENY" && missionMetrics.defects === 0 && missionMetrics.unresolved === 0) {
      return "DENY requires a preserved basis. The current anchor record contains no defect or unresolved condition.";
    }
    if (activeReview.decision === "HOLD" && missionMetrics.defects === 0 && missionMetrics.unresolved === 0) {
      return "HOLD should identify the correctable defect or unresolved condition preventing execution now.";
    }
    return "The selected decision is structurally consistent with the current boundary review.";
  }, [activeReview.decision, missionMetrics]);

  const canComplete =
    missionMetrics.reviewed === anchors.length &&
    missionMetrics.notesComplete === anchors.length &&
    Boolean(activeReview.decision) &&
    activeReview.rationale.trim().length >= 50 &&
    activeReview.reviewer.trim().length >= 2 &&
    activeReview.reviewedAt.trim().length > 0 &&
    !(activeReview.decision === "ALLOW" && (missionMetrics.defects > 0 || missionMetrics.unresolved > 0));

  function updateReview(mutator: (review: MissionReview) => MissionReview) {
    setReviews((current) => ({
      ...current,
      [activeMission.id]: mutator(current[activeMission.id] ?? createMissionReview()),
    }));
    setSaveState("idle");
  }

  function updateAnchorReview(patch: Partial<AnchorReview>) {
    updateReview((review) => ({
      ...review,
      completed: false,
      anchorReviews: {
        ...review.anchorReviews,
        [activeAnchor]: { ...review.anchorReviews[activeAnchor], ...patch },
      },
    }));
  }

  function setMission(id: string) {
    setActiveMissionId(id);
    setActiveAnchor("reality");
    setShowReference(false);
    setShowFailureSignals(false);
  }

  function resetMission() {
    if (!window.confirm("Reset this mission review? This removes the saved work for the active mission.")) return;
    setReviews((current) => ({ ...current, [activeMission.id]: createMissionReview() }));
    setActiveAnchor("reality");
    setShowReference(false);
    setShowFailureSignals(false);
  }

  function completeMission() {
    if (!canComplete) return;
    updateReview((review) => ({ ...review, completed: true }));
  }

  function exportMission() {
    const payload = {
      recordType: "TA-14 Academy Route Validation Record",
      recordVersion: "3.0",
      exportedAt: new Date().toISOString(),
      principle: "No valid boundary. No admissible execution.",
      mission: activeMission,
      review: activeReview,
      metrics: missionMetrics,
      structuralWarning: decisionConflict,
    };
    downloadJson(`ta14-route-validation-${activeMission.id}-${Date.now()}.json`, payload);
  }

  function exportLaboratory() {
    const payload = {
      recordType: "TA-14 Academy Execution Boundary Lab Transcript",
      recordVersion: "3.0",
      exportedAt: new Date().toISOString(),
      principle: "No valid boundary. No admissible execution.",
      progress: globalMetrics,
      missions: missions.map((mission) => ({ mission, review: reviews[mission.id] ?? createMissionReview() })),
    };
    downloadJson(`ta14-route-validation-laboratory-${Date.now()}.json`, payload);
  }

  return (
    <main className="laboratoryPage">
      <div className="cosmos" aria-hidden="true">
        <span className="orb orbOne" />
        <span className="orb orbTwo" />
        <span className="orb orbThree" />
        <span className="gridGlow" />
      </div>

      <header className="topbar">
        <Link className="brand" href="/academy">
          <span className="brandMark">TA-14</span>
          <span className="brandText">
            <strong>Academy</strong>
            <small>Execution Boundary Lab</small>
          </span>
        </Link>

        <nav aria-label="Academy navigation">
          <Link href="/academy/routes">Route Reading</Link>
          <Link href="/academy/route-construction-lab">Construction Lab</Link>
          <Link href="/academy/review">Review Workspace</Link>
          <Link href="/academy/dashboard">Mission Control</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Challenge the route before consequence</p>
          <h1>
            A complete route is not automatically
            <em> an admissible route.</em>
          </h1>
          <p className="heroSummary">
            Inspect every anchor, preserve every defect, and determine whether the proposed execution has earned the right to proceed now. This laboratory teaches route validation as an independent discipline—not as a final glance at an already favored decision.
          </p>

          <div className="heroRule">
            <span>Governing principle</span>
            <strong>No valid boundary. No admissible execution.</strong>
          </div>
        </div>

        <aside className="heroStatus">
          <p className="eyebrow">Laboratory progress</p>
          <div className="largeProgress">
            <strong>{globalMetrics.progress}%</strong>
            <span>{globalMetrics.completed} of {missions.length} missions completed</span>
          </div>
          <div className="progressTrack"><span style={{ width: `${globalMetrics.progress}%` }} /></div>
          <dl>
            <div><dt>Anchors reviewed</dt><dd>{globalMetrics.anchorsReviewed}/{globalMetrics.totalAnchors}</dd></div>
            <div><dt>Saved state</dt><dd>{saveState === "saved" ? "Preserved" : saveState === "error" ? "Save error" : "Updating"}</dd></div>
            <div><dt>Version</dt><dd>Laboratory 3.0</dd></div>
          </dl>
          <button type="button" className="secondaryButton full" onClick={exportLaboratory}>Export laboratory transcript</button>
        </aside>
      </section>

      <section className="missionStrip" aria-label="Validation missions">
        {missions.map((mission, index) => {
          const review = reviews[mission.id] ?? createMissionReview();
          const isActive = mission.id === activeMission.id;
          return (
            <button key={mission.id} type="button" onClick={() => setMission(mission.id)} className={`missionTab ${isActive ? "active" : ""} ${review.completed ? "complete" : ""}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><strong>{mission.title}</strong><small>{mission.domain}</small></div>
              <em>{review.completed ? "Complete" : "Open"}</em>
            </button>
          );
        })}
      </section>

      <section className="missionOverview">
        <div className="missionTitleBlock">
          <p className="eyebrow">Active validation mission</p>
          <h2>{activeMission.title}</h2>
          <p>{activeMission.routeSummary}</p>
        </div>

        <div className="consequenceBox">
          <span>Consequence at stake</span>
          <strong>{activeMission.consequence}</strong>
        </div>

        <div className="overviewGrid">
          <article>
            <span className="cardKicker">Evidence package</span>
            <ul>{activeMission.evidencePackage.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <span className="cardKicker">Known changes</span>
            {activeMission.knownChanges.length > 0 ? <ul>{activeMission.knownChanges.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="emptyState">No material changes are disclosed in the mission record.</p>}
          </article>
          <article className="riskCard">
            <span className="cardKicker">Validation pressure</span>
            <p>{activeMission.hiddenRisk}</p>
          </article>
        </div>
      </section>

      <section className="metricsGrid" aria-label="Mission metrics">
        <MetricCard label="Review readiness" value={`${missionMetrics.readiness}%`} note="Anchor review, notes, decision, and rationale" />
        <MetricCard label="Supported" value={String(missionMetrics.supported)} note="Affirmatively preserved anchors" tone="supported" />
        <MetricCard label="Defects" value={String(missionMetrics.defects)} note="Material route failures" tone="defect" />
        <MetricCard label="Unresolved" value={String(missionMetrics.unresolved)} note="Evidence or authority still required" tone="unresolved" />
      </section>

      <section className="validationWorkspace">
        <aside className="anchorRail">
          <div className="railHeader">
            <p className="eyebrow">Eight-anchor inspection</p>
            <strong>Select an anchor</strong>
          </div>

          <div className="anchorList">
            {anchors.map((anchor) => {
              const state = activeReview.anchorReviews[anchor.key].state;
              return (
                <button key={anchor.key} type="button" className={`anchorButton ${activeAnchor === anchor.key ? "active" : ""} state-${state.toLowerCase()}`} onClick={() => { setActiveAnchor(anchor.key); setShowFailureSignals(false); }}>
                  <span>{anchor.shortLabel}</span>
                  <div><strong>{anchor.label}</strong><small>{stateLabels[state]}</small></div>
                  <em>{state === "SUPPORTED" ? "✓" : state === "DEFECT" ? "!" : state === "UNRESOLVED" ? "?" : "—"}</em>
                </button>
              );
            })}
          </div>

          <div className="railProgress">
            <span>{missionMetrics.reviewed}/{anchors.length} anchors reviewed</span>
            <div><i style={{ width: `${Math.round((missionMetrics.reviewed / anchors.length) * 100)}%` }} /></div>
          </div>
        </aside>

        <article className="reviewPanel">
          <header className="reviewHeader">
            <div>
              <p className="eyebrow">Anchor {activeDefinition.shortLabel}</p>
              <h2>{activeDefinition.label}</h2>
              <p>{activeDefinition.question}</p>
            </div>
            <button type="button" className="textButton" onClick={() => setShowFailureSignals((current) => !current)}>
              {showFailureSignals ? "Hide failure signals" : "Show failure signals"}
            </button>
          </header>

          {showFailureSignals && (
            <div className="failureSignals">
              <strong>Common failure signals</strong>
              <ul>{activeDefinition.failureSignals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
            </div>
          )}

          <div className="stateSelector" role="group" aria-label={`${activeDefinition.label} validation state`}>
            {(["SUPPORTED", "DEFECT", "UNRESOLVED", "NOT_REVIEWED"] as AnchorState[]).map((state) => (
              <button key={state} type="button" onClick={() => updateAnchorReview({ state })} className={activeAnchorReview.state === state ? "selected" : ""}>
                <strong>{stateLabels[state]}</strong>
                <span>{stateDescriptions[state]}</span>
              </button>
            ))}
          </div>

          <div className="promptBox">
            <span>Review guidance</span>
            <p>
              {activeAnchorReview.state === "SUPPORTED" && activeDefinition.supportedPrompt}
              {activeAnchorReview.state === "DEFECT" && activeDefinition.defectPrompt}
              {activeAnchorReview.state === "UNRESOLVED" && activeDefinition.unresolvedPrompt}
              {activeAnchorReview.state === "NOT_REVIEWED" && "Select a state before preserving the anchor analysis."}
            </p>
          </div>

          <div className="fieldStack">
            <label>
              <span>Validation analysis</span>
              <textarea value={activeAnchorReview.note} onChange={(event) => updateAnchorReview({ note: event.target.value })} placeholder="State what the route proves, what it fails to prove, and why that matters before consequence." rows={8} />
              <small>{activeAnchorReview.note.trim().length}/25 minimum characters for completion</small>
            </label>

            <div className="twoColumnFields">
              <label>
                <span>Evidence or authority source</span>
                <textarea value={activeAnchorReview.source} onChange={(event) => updateAnchorReview({ source: event.target.value })} placeholder="Identify the record, source, version, role, threshold, or evidence package reviewed." rows={5} />
              </label>
              <label>
                <span>Corrective action or revalidation</span>
                <textarea value={activeAnchorReview.correctiveAction} onChange={(event) => updateAnchorReview({ correctiveAction: event.target.value })} placeholder="State what must change, be obtained, or be revalidated before this anchor can support execution." rows={5} />
              </label>
            </div>
          </div>

          <footer className="reviewFooter">
            <button type="button" className="secondaryButton" disabled={activeAnchor === anchors[0].key} onClick={() => {
              const index = anchors.findIndex((anchor) => anchor.key === activeAnchor);
              if (index > 0) setActiveAnchor(anchors[index - 1].key);
            }}>← Previous anchor</button>
            <span>{stateLabels[activeAnchorReview.state]} · {activeAnchorReview.note.trim().length >= 25 ? "Analysis sufficient" : "Analysis incomplete"}</span>
            <button type="button" className="primaryButton" disabled={activeAnchor === anchors[anchors.length - 1].key} onClick={() => {
              const index = anchors.findIndex((anchor) => anchor.key === activeAnchor);
              if (index < anchors.length - 1) setActiveAnchor(anchors[index + 1].key);
            }}>Next anchor →</button>
          </footer>
        </article>
      </section>

      <section className="determinationSection">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Final route determination</p>
            <h2>What has this route earned the right to do?</h2>
            <p>A determination must correspond to the preserved anchor record. It cannot be selected first and justified afterward.</p>
          </div>
          <div className={`structuralNotice ${decisionConflict.startsWith("The selected") ? "consistent" : "warning"}`}>
            <span>Structural check</span>
            <strong>{decisionConflict}</strong>
          </div>
        </div>

        <div className="decisionGrid">
          {decisions.map((item) => (
            <button key={item.value} type="button" onClick={() => updateReview((review) => ({ ...review, completed: false, decision: item.value }))} className={`decisionCard decision-${item.value.toLowerCase()} ${activeReview.decision === item.value ? "selected" : ""}`}>
              <span>{item.value === "ALLOW" ? "A" : item.value === "HOLD" ? "H" : item.value === "DENY" ? "D" : "E"}</span>
              <div><strong>{item.title}</strong><p>{item.description}</p></div>
            </button>
          ))}
        </div>

        <div className="determinationFields">
          <label>
            <span>Decision rationale</span>
            <textarea rows={7} value={activeReview.rationale} onChange={(event) => updateReview((review) => ({ ...review, completed: false, rationale: event.target.value }))} placeholder="Explain how the anchor record supports the decision, including defects, uncertainty, authority, boundary, and consequence." />
            <small>{activeReview.rationale.trim().length}/50 minimum characters</small>
          </label>

          <div className="threeColumnFields">
            <label><span>Defect severity</span><select value={activeReview.severity} onChange={(event) => updateReview((review) => ({ ...review, completed: false, severity: event.target.value as Severity }))}><option>NONE</option><option>LOW</option><option>MATERIAL</option><option>CRITICAL</option></select></label>
            <label><span>Reviewer confidence</span><select value={activeReview.confidence} onChange={(event) => updateReview((review) => ({ ...review, completed: false, confidence: event.target.value as Confidence }))}><option>LOW</option><option>MODERATE</option><option>HIGH</option></select></label>
            <label><span>Review date and time</span><input type="datetime-local" value={activeReview.reviewedAt} onChange={(event) => updateReview((review) => ({ ...review, completed: false, reviewedAt: event.target.value }))} /></label>
          </div>

          <div className="twoColumnFields">
            <label><span>Reviewer name</span><input value={activeReview.reviewer} onChange={(event) => updateReview((review) => ({ ...review, completed: false, reviewer: event.target.value }))} placeholder="Attributable reviewer" /></label>
            <label><span>Organization or learning cohort</span><input value={activeReview.organization} onChange={(event) => updateReview((review) => ({ ...review, completed: false, organization: event.target.value }))} placeholder="Optional organization" /></label>
          </div>

          <div className="twoColumnFields">
            <label><span>Challenge question</span><textarea rows={5} value={activeReview.challengeQuestion} onChange={(event) => updateReview((review) => ({ ...review, completed: false, challengeQuestion: event.target.value }))} placeholder="What is the strongest question an independent reviewer should ask before accepting this determination?" /></label>
            <label><span>Remediation plan</span><textarea rows={5} value={activeReview.remediationPlan} onChange={(event) => updateReview((review) => ({ ...review, completed: false, remediationPlan: event.target.value }))} placeholder="What exact evidence, authority, correction, or revalidation would change the disposition?" /></label>
          </div>

          <label><span>Outcome verification plan</span><textarea rows={5} value={activeReview.verificationPlan} onChange={(event) => updateReview((review) => ({ ...review, completed: false, verificationPlan: event.target.value }))} placeholder="Define what must be observed, preserved, and reviewed after execution or remediation." /></label>
        </div>
      </section>

      <section className="referenceSection">
        <div>
          <p className="eyebrow">Instructor reference</p>
          <h2>Compare your preserved reasoning—not just your final answer.</h2>
          <p>The reference is revealed only after the learner has had the opportunity to make an attributable determination.</p>
        </div>
        <button type="button" className="secondaryButton" onClick={() => setShowReference((current) => !current)}>{showReference ? "Hide reference analysis" : "Reveal reference analysis"}</button>

        {showReference && (
          <div className="referenceCard">
            <div className="referenceDecision"><span>Reference disposition</span><strong>{activeMission.expectedDecision}</strong><small>{activeMission.expectedSeverity} severity</small></div>
            <div><span>Expected anchor defects</span><div className="tagList">{activeMission.expectedDefects.length > 0 ? activeMission.expectedDefects.map((key) => <em key={key}>{anchors.find((anchor) => anchor.key === key)?.label}</em>) : <em>None</em>}</div></div>
            <div><span>Reference explanation</span><p>{activeMission.explanation}</p></div>
            <div className={`comparison ${activeReview.decision === activeMission.expectedDecision ? "match" : "mismatch"}`}><strong>{activeReview.decision === activeMission.expectedDecision ? "Your decision matches the reference disposition." : "Your decision differs from the reference disposition."}</strong><p>A different answer is not automatically invalid, but it must be defensible from the preserved route record and governing boundary.</p></div>
          </div>
        )}
      </section>

      <section className="completionSection">
        <div className="completionSummary">
          <p className="eyebrow">Mission completion</p>
          <h2>{activeReview.completed ? "Boundary revalidation record preserved." : "Complete the attributable route record."}</h2>
          <p>{activeReview.completed ? "This mission is marked complete and remains available for review, export, reset, or further challenge." : "Every anchor requires a state and meaningful analysis. The final determination requires attribution, timing, and a preserved rationale."}</p>

          <div className="completionChecklist">
            <ChecklistItem complete={missionMetrics.reviewed === anchors.length} label="All eight anchors reviewed" />
            <ChecklistItem complete={missionMetrics.notesComplete === anchors.length} label="Every anchor contains meaningful analysis" />
            <ChecklistItem complete={Boolean(activeReview.decision)} label="Final determination selected" />
            <ChecklistItem complete={activeReview.rationale.trim().length >= 50} label="Decision rationale preserved" />
            <ChecklistItem complete={activeReview.reviewer.trim().length >= 2} label="Reviewer is attributable" />
            <ChecklistItem complete={Boolean(activeReview.reviewedAt)} label="Review time preserved" />
          </div>
        </div>

        <div className="completionActions">
          <button type="button" className="primaryButton large" disabled={!canComplete} onClick={completeMission}>{activeReview.completed ? "Mission complete" : "Complete mission"}</button>
          <button type="button" className="secondaryButton" onClick={exportMission}>Export boundary revalidation record</button>
          <button type="button" className="dangerButton" onClick={resetMission}>Reset active mission</button>
        </div>
      </section>

      <footer className="pageFooter">
        <div><span className="brandMark small">TA-14</span><p>Route validation is the discipline of proving that a proposed execution still corresponds to admissible reality.</p></div>
        <nav><Link href="/academy/route-construction-lab">← Route Construction Lab</Link><Link href="/academy/review">Continue to Review Workspace →</Link></nav>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(body) { margin: 0; background: #020711; }
        .laboratoryPage { position: relative; min-height: 100vh; overflow: hidden; color: #e8f2ff; background: radial-gradient(circle at 14% 6%, rgba(16,185,129,.09), transparent 28%), radial-gradient(circle at 86% 18%, rgba(34,211,238,.09), transparent 30%), linear-gradient(180deg,#020711 0%,#04101d 52%,#020711 100%); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .cosmos { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
        .orb { position: absolute; border-radius: 999px; filter: blur(100px); opacity: .28; }
        .orbOne { width: 420px; height: 420px; left: -160px; top: 200px; background: #0ea5e9; }
        .orbTwo { width: 500px; height: 500px; right: -220px; top: 720px; background: #10b981; }
        .orbThree { width: 360px; height: 360px; left: 44%; bottom: -180px; background: #8b5cf6; }
        .gridGlow { position: absolute; inset: 0; opacity: .18; background-image: linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px); background-size: 54px 54px; mask-image: linear-gradient(to bottom,black,transparent 82%); }
        .topbar,.hero,.missionStrip,.missionOverview,.metricsGrid,.validationWorkspace,.determinationSection,.referenceSection,.completionSection,.pageFooter { position: relative; z-index: 1; width: min(1480px, calc(100% - 40px)); margin-inline: auto; }
        .topbar { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 28px 0 22px; border-bottom: 1px solid rgba(148,163,184,.16); }
        .brand { display: inline-flex; align-items: center; gap: 13px; color: inherit; text-decoration: none; }
        .brandMark { display: inline-grid; place-items: center; min-width: 68px; height: 44px; padding: 0 13px; border: 1px solid rgba(34,211,238,.32); border-radius: 13px; background: rgba(34,211,238,.09); color: #67e8f9; font-weight: 950; letter-spacing: .14em; box-shadow: inset 0 0 22px rgba(34,211,238,.05); }
        .brandMark.small { min-width: 60px; height: 38px; font-size: 12px; }
        .brandText { display: grid; gap: 2px; }
        .brandText strong { font-size: 14px; }
        .brandText small { color: #8191a8; font-size: 12px; }
        .topbar nav,.pageFooter nav { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; }
        .topbar nav a,.pageFooter nav a { color: #b7c7da; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 14px; border: 1px solid rgba(148,163,184,.13); border-radius: 999px; background: rgba(255,255,255,.025); transition: .2s ease; }
        .topbar nav a:hover,.pageFooter nav a:hover { color: white; border-color: rgba(34,211,238,.38); transform: translateY(-1px); }
        .hero { display: grid; grid-template-columns: minmax(0,1fr) 360px; gap: 44px; align-items: center; padding: 74px 0 54px; }
        .eyebrow { margin: 0 0 13px; color: #5eead4; font-size: 11px; font-weight: 900; letter-spacing: .24em; text-transform: uppercase; }
        .hero h1 { max-width: 980px; margin: 0; color: #fff; font-size: clamp(44px,6.1vw,86px); line-height: .98; letter-spacing: -.055em; }
        .hero h1 em { display: block; margin-top: 8px; color: transparent; font-style: normal; background: linear-gradient(90deg,#67e8f9,#6ee7b7,#c4b5fd); -webkit-background-clip: text; background-clip: text; }
        .heroSummary { max-width: 920px; margin: 27px 0 0; color: #aebed1; font-size: 18px; line-height: 1.8; }
        .heroRule { display: inline-grid; gap: 5px; margin-top: 28px; padding: 16px 20px; border: 1px solid rgba(94,234,212,.22); border-radius: 18px; background: rgba(16,185,129,.06); }
        .heroRule span,.heroStatus dt,.cardKicker,.consequenceBox span,.promptBox span,.determinationFields label>span,.fieldStack label>span,.referenceCard>div>span { color: #7f92aa; font-size: 10px; font-weight: 900; letter-spacing: .17em; text-transform: uppercase; }
        .heroRule strong { color: #d7fff5; font-size: 15px; }
        .heroStatus { padding: 25px; border: 1px solid rgba(148,163,184,.16); border-radius: 28px; background: linear-gradient(180deg,rgba(255,255,255,.065),rgba(255,255,255,.025)); box-shadow: 0 24px 80px rgba(0,0,0,.32); backdrop-filter: blur(16px); }
        .largeProgress { display: grid; gap: 4px; }
        .largeProgress strong { font-size: 52px; line-height: 1; color: white; }
        .largeProgress span { color: #9fb0c5; font-size: 13px; }
        .progressTrack { height: 8px; margin: 18px 0 20px; overflow: hidden; border-radius: 999px; background: rgba(255,255,255,.08); }
        .progressTrack span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg,#22d3ee,#34d399); transition: width .35s ease; }
        .heroStatus dl { display: grid; gap: 10px; margin: 0 0 20px; }
        .heroStatus dl div { display: flex; justify-content: space-between; gap: 20px; padding: 11px 0; border-bottom: 1px solid rgba(148,163,184,.1); }
        .heroStatus dd { margin: 0; color: white; font-size: 12px; font-weight: 800; }
        .missionStrip { display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: 10px; padding-bottom: 26px; }
        .missionTab { position: relative; display: grid; grid-template-columns: 34px 1fr; gap: 11px; align-items: center; min-height: 92px; padding: 15px; text-align: left; color: #d9e7f7; border: 1px solid rgba(148,163,184,.13); border-radius: 20px; background: rgba(255,255,255,.025); cursor: pointer; transition: .2s ease; }
        .missionTab:hover { transform: translateY(-2px); border-color: rgba(34,211,238,.3); }
        .missionTab.active { border-color: rgba(34,211,238,.45); background: linear-gradient(180deg,rgba(34,211,238,.11),rgba(255,255,255,.03)); box-shadow: 0 16px 48px rgba(8,145,178,.09); }
        .missionTab.complete { box-shadow: inset 0 0 0 1px rgba(52,211,153,.18); }
        .missionTab>span { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 11px; color: #67e8f9; background: rgba(34,211,238,.1); font-size: 11px; font-weight: 900; }
        .missionTab div { min-width: 0; display: grid; gap: 5px; }
        .missionTab strong { overflow: hidden; color: white; font-size: 12px; line-height: 1.35; text-overflow: ellipsis; }
        .missionTab small { color: #778aa2; font-size: 10px; }
        .missionTab em { position: absolute; right: 12px; bottom: 9px; color: #5f7289; font-size: 9px; font-style: normal; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
        .missionTab.complete em { color: #6ee7b7; }
        .missionOverview { padding: 34px; border: 1px solid rgba(148,163,184,.14); border-radius: 30px; background: linear-gradient(145deg,rgba(9,20,35,.92),rgba(5,13,24,.86)); box-shadow: 0 26px 80px rgba(0,0,0,.24); }
        .missionTitleBlock h2,.determinationSection h2,.referenceSection h2,.completionSection h2 { margin: 0; color: white; font-size: clamp(30px,4vw,52px); letter-spacing: -.035em; }
        .missionTitleBlock>p:last-child,.sectionHeading>div>p:last-child,.referenceSection>div>p:last-child,.completionSummary>p { max-width: 940px; color: #a8b9cc; font-size: 15px; line-height: 1.75; }
        .consequenceBox { display: grid; gap: 8px; margin-top: 24px; padding: 18px 20px; border-left: 3px solid #fb7185; border-radius: 0 17px 17px 0; background: rgba(244,63,94,.06); }
        .consequenceBox strong { color: #ffe4e9; font-size: 14px; line-height: 1.6; }
        .overviewGrid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 15px; margin-top: 23px; }
        .overviewGrid article { min-height: 190px; padding: 21px; border: 1px solid rgba(148,163,184,.12); border-radius: 21px; background: rgba(255,255,255,.027); }
        .overviewGrid ul,.failureSignals ul { display: grid; gap: 10px; margin: 16px 0 0; padding: 0; list-style: none; }
        .overviewGrid li,.failureSignals li { position: relative; padding-left: 17px; color: #b5c5d7; font-size: 13px; line-height: 1.55; }
        .overviewGrid li::before,.failureSignals li::before { content:""; position:absolute; left:0; top:.62em; width:6px; height:6px; border-radius:99px; background:#22d3ee; }
        .riskCard { border-color: rgba(251,191,36,.18)!important; background: rgba(245,158,11,.045)!important; }
        .riskCard p,.emptyState { color: #c6d3e2; font-size: 13px; line-height: 1.7; }
        .metricsGrid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; margin-top: 18px; }
        .metricCard { display: grid; gap: 4px; min-height: 118px; padding: 20px; border: 1px solid rgba(148,163,184,.13); border-radius: 22px; background: rgba(255,255,255,.027); }
        .metricCard span { color: #8092a9; font-size: 10px; font-weight: 900; letter-spacing: .15em; text-transform: uppercase; }
        .metricCard strong { color: white; font-size: 31px; }
        .metricCard small { color: #71849b; font-size: 11px; }
        .metricCard.supported { border-color: rgba(52,211,153,.2); }
        .metricCard.defect { border-color: rgba(251,113,133,.2); }
        .metricCard.unresolved { border-color: rgba(251,191,36,.2); }
        .validationWorkspace { display: grid; grid-template-columns: 330px minmax(0,1fr); gap: 18px; margin-top: 20px; }
        .anchorRail,.reviewPanel,.determinationSection,.referenceSection,.completionSection { border: 1px solid rgba(148,163,184,.14); background: rgba(5,14,26,.82); box-shadow: 0 24px 70px rgba(0,0,0,.23); backdrop-filter: blur(14px); }
        .anchorRail { align-self: start; position: sticky; top: 18px; padding: 19px; border-radius: 26px; }
        .railHeader { padding: 4px 4px 15px; }
        .railHeader strong { color: white; font-size: 14px; }
        .anchorList { display: grid; gap: 8px; }
        .anchorButton { display: grid; grid-template-columns: 40px 1fr 22px; gap: 11px; align-items: center; width: 100%; min-height: 67px; padding: 11px; text-align: left; color: #c9d8e8; border: 1px solid rgba(148,163,184,.1); border-radius: 16px; background: rgba(255,255,255,.018); cursor: pointer; transition: .18s ease; }
        .anchorButton:hover,.anchorButton.active { border-color: rgba(34,211,238,.34); background: rgba(34,211,238,.055); }
        .anchorButton>span { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; color: #7dd3fc; background: rgba(14,165,233,.08); font-size: 10px; font-weight: 900; }
        .anchorButton div { display: grid; gap: 4px; }
        .anchorButton strong { color: white; font-size: 12px; }
        .anchorButton small { color: #70839a; font-size: 10px; }
        .anchorButton em { font-style: normal; font-weight: 900; color: #64748b; }
        .anchorButton.state-supported em { color: #6ee7b7; }
        .anchorButton.state-defect em { color: #fb7185; }
        .anchorButton.state-unresolved em { color: #fbbf24; }
        .railProgress { display: grid; gap: 8px; margin-top: 17px; padding: 14px 4px 2px; border-top: 1px solid rgba(148,163,184,.1); }
        .railProgress>span { color: #71839a; font-size: 10px; font-weight: 800; }
        .railProgress>div { height: 6px; overflow: hidden; border-radius: 999px; background: rgba(255,255,255,.07); }
        .railProgress i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg,#22d3ee,#34d399); }
        .reviewPanel { min-width: 0; padding: 31px; border-radius: 28px; }
        .reviewHeader { display: flex; justify-content: space-between; gap: 26px; align-items: start; }
        .reviewHeader h2 { margin: 0; color: white; font-size: 42px; letter-spacing: -.035em; }
        .reviewHeader>div>p:last-child { max-width: 780px; color: #aab9ca; font-size: 15px; line-height: 1.7; }
        .textButton { flex: 0 0 auto; padding: 10px 13px; color: #8bdff0; border: 1px solid rgba(34,211,238,.18); border-radius: 12px; background: rgba(34,211,238,.04); cursor: pointer; font-size: 11px; font-weight: 800; }
        .failureSignals { margin-top: 20px; padding: 18px; border: 1px solid rgba(251,191,36,.16); border-radius: 18px; background: rgba(245,158,11,.035); }
        .failureSignals strong { color: #fde68a; font-size: 12px; }
        .stateSelector { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 10px; margin-top: 24px; }
        .stateSelector button { min-height: 130px; padding: 16px; text-align: left; color: #bdcad8; border: 1px solid rgba(148,163,184,.12); border-radius: 18px; background: rgba(255,255,255,.022); cursor: pointer; transition: .18s ease; }
        .stateSelector button:hover,.stateSelector button.selected { transform: translateY(-2px); border-color: rgba(34,211,238,.37); background: rgba(34,211,238,.065); }
        .stateSelector strong { display: block; color: white; font-size: 11px; letter-spacing: .08em; }
        .stateSelector span { display: block; margin-top: 9px; color: #8293a8; font-size: 11px; line-height: 1.55; }
        .promptBox { display: grid; gap: 7px; margin-top: 15px; padding: 16px 18px; border-left: 3px solid #22d3ee; border-radius: 0 15px 15px 0; background: rgba(34,211,238,.045); }
        .promptBox p { margin: 0; color: #c7d7e7; font-size: 13px; line-height: 1.65; }
        .fieldStack,.determinationFields { display: grid; gap: 16px; margin-top: 22px; }
        label { display: grid; gap: 8px; }
        textarea,input,select { width: 100%; color: #eaf4ff; border: 1px solid rgba(148,163,184,.14); border-radius: 15px; background: rgba(0,0,0,.22); outline: none; transition: .18s ease; }
        textarea { resize: vertical; min-height: 110px; padding: 14px 15px; font: inherit; font-size: 13px; line-height: 1.65; }
        input,select { height: 47px; padding: 0 14px; font: inherit; font-size: 12px; }
        textarea:focus,input:focus,select:focus { border-color: rgba(34,211,238,.44); box-shadow: 0 0 0 3px rgba(34,211,238,.06); }
        textarea::placeholder,input::placeholder { color: #506278; }
        label small { color: #5f7188; font-size: 10px; }
        .twoColumnFields { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }
        .threeColumnFields { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; }
        .reviewFooter { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 23px; padding-top: 20px; border-top: 1px solid rgba(148,163,184,.11); }
        .reviewFooter>span { color: #6f8197; font-size: 10px; font-weight: 800; text-align: center; }
        button { font: inherit; }
        .primaryButton,.secondaryButton,.dangerButton { display: inline-flex; align-items: center; justify-content: center; min-height: 45px; padding: 0 17px; border-radius: 13px; cursor: pointer; font-size: 11px; font-weight: 900; letter-spacing: .03em; transition: .18s ease; }
        .primaryButton { color: #031018; border: 1px solid rgba(103,232,249,.7); background: linear-gradient(135deg,#67e8f9,#5eead4); }
        .primaryButton:hover:not(:disabled),.secondaryButton:hover:not(:disabled),.dangerButton:hover:not(:disabled) { transform: translateY(-1px); }
        .primaryButton:disabled,.secondaryButton:disabled { opacity: .4; cursor: not-allowed; }
        .secondaryButton { color: #c8d8e9; border: 1px solid rgba(148,163,184,.18); background: rgba(255,255,255,.035); }
        .dangerButton { color: #fecdd3; border: 1px solid rgba(251,113,133,.23); background: rgba(244,63,94,.06); }
        .full { width: 100%; }
        .large { min-height: 56px; font-size: 12px; }
        .determinationSection,.referenceSection,.completionSection { margin-top: 20px; padding: 34px; border-radius: 30px; }
        .sectionHeading { display: grid; grid-template-columns: minmax(0,1fr) 380px; gap: 24px; align-items: start; }
        .structuralNotice { display: grid; gap: 7px; padding: 17px; border: 1px solid rgba(251,191,36,.18); border-radius: 17px; background: rgba(245,158,11,.04); }
        .structuralNotice.consistent { border-color: rgba(52,211,153,.2); background: rgba(16,185,129,.04); }
        .structuralNotice span { color: #93a4b9; font-size: 9px; font-weight: 900; letter-spacing: .15em; text-transform: uppercase; }
        .structuralNotice strong { color: #e5edf7; font-size: 11px; line-height: 1.55; }
        .decisionGrid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; margin-top: 25px; }
        .decisionCard { display: grid; grid-template-columns: 46px 1fr; gap: 13px; min-height: 150px; padding: 18px; text-align: left; color: #becddd; border: 1px solid rgba(148,163,184,.13); border-radius: 20px; background: rgba(255,255,255,.022); cursor: pointer; transition: .2s ease; }
        .decisionCard:hover,.decisionCard.selected { transform: translateY(-2px); border-color: rgba(34,211,238,.35); background: rgba(34,211,238,.055); }
        .decisionCard>span { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; color: white; background: rgba(255,255,255,.06); font-weight: 950; }
        .decisionCard strong { color: white; font-size: 14px; letter-spacing: .08em; }
        .decisionCard p { margin: 8px 0 0; color: #8395aa; font-size: 11px; line-height: 1.55; }
        .decision-allow.selected { border-color: rgba(52,211,153,.4); background: rgba(16,185,129,.07); }
        .decision-hold.selected { border-color: rgba(251,191,36,.4); background: rgba(245,158,11,.07); }
        .decision-deny.selected { border-color: rgba(251,113,133,.4); background: rgba(244,63,94,.07); }
        .decision-escalate.selected { border-color: rgba(196,181,253,.42); background: rgba(139,92,246,.07); }
        .referenceSection { display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: start; }
        .referenceCard { grid-column: 1/-1; display: grid; grid-template-columns: 210px 1fr 1.4fr; gap: 14px; padding-top: 22px; border-top: 1px solid rgba(148,163,184,.11); }
        .referenceCard>div { padding: 18px; border: 1px solid rgba(148,163,184,.12); border-radius: 18px; background: rgba(255,255,255,.022); }
        .referenceDecision { display: grid; align-content: start; gap: 8px; }
        .referenceDecision strong { color: #6ee7b7; font-size: 29px; }
        .referenceDecision small { color: #8798ad; font-size: 10px; }
        .referenceCard p { color: #b5c5d7; font-size: 12px; line-height: 1.65; }
        .tagList { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 12px; }
        .tagList em { padding: 7px 10px; color: #beeaf2; border: 1px solid rgba(34,211,238,.18); border-radius: 999px; background: rgba(34,211,238,.045); font-size: 10px; font-style: normal; font-weight: 800; }
        .comparison { grid-column: 1/-1; }
        .comparison strong { color: #e8f2ff; font-size: 13px; }
        .comparison.match { border-color: rgba(52,211,153,.2)!important; }
        .comparison.mismatch { border-color: rgba(251,191,36,.2)!important; }
        .completionSection { display: grid; grid-template-columns: minmax(0,1fr) 290px; gap: 36px; align-items: center; }
        .completionChecklist { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 9px; margin-top: 22px; }
        .checklistItem { display: flex; align-items: center; gap: 10px; min-height: 43px; padding: 10px 12px; border: 1px solid rgba(148,163,184,.1); border-radius: 13px; background: rgba(255,255,255,.018); }
        .checklistItem span { display: grid; place-items: center; width: 23px; height: 23px; border-radius: 8px; color: #64748b; background: rgba(255,255,255,.05); font-size: 10px; font-weight: 900; }
        .checklistItem.complete span { color: #042f2e; background: #6ee7b7; }
        .checklistItem strong { color: #aebed1; font-size: 10px; }
        .completionActions { display: grid; gap: 10px; }
        .pageFooter { display: flex; align-items: center; justify-content: space-between; gap: 28px; padding: 40px 0 54px; }
        .pageFooter>div { display: flex; align-items: center; gap: 14px; }
        .pageFooter p { max-width: 570px; margin: 0; color: #71839a; font-size: 11px; line-height: 1.55; }
        @media (max-width: 1180px) {
          .hero { grid-template-columns: 1fr; }
          .heroStatus { max-width: 620px; }
          .missionStrip { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .overviewGrid { grid-template-columns: 1fr 1fr; }
          .overviewGrid .riskCard { grid-column: 1/-1; }
          .metricsGrid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .validationWorkspace { grid-template-columns: 280px minmax(0,1fr); }
          .stateSelector,.decisionGrid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .sectionHeading { grid-template-columns: 1fr; }
          .referenceCard { grid-template-columns: 1fr 1fr; }
          .referenceCard>div:nth-child(3) { grid-column: 1/-1; }
        }
        @media (max-width: 820px) {
          .topbar { align-items: flex-start; flex-direction: column; }
          .hero { padding-top: 48px; }
          .hero h1 { font-size: clamp(42px,12vw,68px); }
          .missionStrip { grid-template-columns: 1fr; }
          .overviewGrid,.metricsGrid,.validationWorkspace,.twoColumnFields,.threeColumnFields,.completionSection,.referenceSection { grid-template-columns: 1fr; }
          .anchorRail { position: static; }
          .anchorList { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .reviewHeader { flex-direction: column; }
          .referenceSection .secondaryButton { justify-self: start; }
          .referenceCard { grid-template-columns: 1fr; }
          .referenceCard>div:nth-child(3),.comparison { grid-column: auto; }
          .completionChecklist { grid-template-columns: 1fr; }
          .pageFooter { align-items: flex-start; flex-direction: column; }
        }
        @media (max-width: 560px) {
          .topbar,.hero,.missionStrip,.missionOverview,.metricsGrid,.validationWorkspace,.determinationSection,.referenceSection,.completionSection,.pageFooter { width: min(100% - 24px,1480px); }
          .topbar nav { width: 100%; }
          .topbar nav a { flex: 1 1 auto; text-align: center; }
          .heroSummary { font-size: 16px; }
          .missionOverview,.reviewPanel,.determinationSection,.referenceSection,.completionSection { padding: 22px; border-radius: 23px; }
          .anchorList,.stateSelector,.decisionGrid { grid-template-columns: 1fr; }
          .reviewFooter { align-items: stretch; flex-direction: column; }
          .reviewFooter>span { order: -1; }
          .pageFooter nav { width: 100%; align-items: stretch; flex-direction: column; }
          .pageFooter nav a { text-align: center; }
        }
      `}</style>
    </main>
  );
}

function MetricCard({ label, value, note, tone = "" }: { label: string; value: string; note: string; tone?: string }) {
  return <article className={`metricCard ${tone}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function ChecklistItem({ complete, label }: { complete: boolean; label: string }) {
  return <div className={`checklistItem ${complete ? "complete" : ""}`}><span>{complete ? "✓" : "—"}</span><strong>{label}</strong></div>;
}
