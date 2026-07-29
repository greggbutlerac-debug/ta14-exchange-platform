"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type ReviewState = "SUPPORTED" | "DEFECT" | "UNRESOLVED" | "NOT_REVIEWED";
type Severity = "LOW" | "MATERIAL" | "CRITICAL";
type Confidence = "LOW" | "MODERATE" | "HIGH";
type Stage = "INTAKE" | "PRESERVATION" | "REVIEW" | "REMEDY" | "DISPOSITION";
type GroundKey =
  | "reality"
  | "record"
  | "continuity"
  | "admissibility"
  | "authority"
  | "commit"
  | "execution"
  | "outcome";

type GroundDefinition = {
  key: GroundKey;
  number: string;
  label: string;
  question: string;
  defectSignals: string[];
  remedyPrompts: string[];
};

type Mission = {
  id: string;
  title: string;
  domain: string;
  contestedAction: string;
  consequence: string;
  appellantPosition: string;
  respondentPosition: string;
  evidence: string[];
  authorityRecord: string;
  hiddenIssue: string;
  expectedDecision: Decision;
  expectedSeverity: Severity;
  expectedGrounds: GroundKey[];
  instructorAnalysis: string;
};

type GroundReview = {
  state: ReviewState;
  finding: string;
  source: string;
  requestedCorrection: string;
};

type AppealRecord = {
  appellant: string;
  organization: string;
  reviewer: string;
  caseReference: string;
  filedAt: string;
  stage: Stage;
  noticePreserved: boolean;
  originalDecisionPreserved: boolean;
  executionPaused: boolean;
  conflictCheckComplete: boolean;
  grounds: Record<GroundKey, GroundReview>;
  severity: Severity;
  confidence: Confidence;
  decision: Decision | "";
  rationale: string;
  requestedRemedy: string;
  dispositionConditions: string;
  verificationPlan: string;
  dissent: string;
  completed: boolean;
};

type PersistedState = {
  version: "3.0";
  activeMissionId: string;
  updatedAt: string;
  records: Record<string, AppealRecord>;
};

const STORAGE_KEY = "ta14-academy-challenge-and-appeal-lab-v3";

const grounds: GroundDefinition[] = [
  {
    key: "reality",
    number: "01",
    label: "Reality",
    question: "Did the original determination begin from the condition that actually existed?",
    defectSignals: [
      "The subject, system, asset, or event was incorrectly identified.",
      "A material condition changed before consequence occurred.",
      "The determination relied on assumption rather than verified condition.",
    ],
    remedyPrompts: [
      "Re-establish the present condition.",
      "Correct the subject or event identity.",
      "Pause consequence until reality is reverified.",
    ],
  },
  {
    key: "record",
    number: "02",
    label: "Record",
    question: "Was the governing evidence preserved, attributable, and available for challenge?",
    defectSignals: [
      "The decision cites a conclusion without its underlying record.",
      "The record lacks author, timestamp, source, or version.",
      "A material record was withheld from the original review.",
    ],
    remedyPrompts: [
      "Produce the complete record.",
      "Restore missing attribution and version history.",
      "Reopen review with the omitted evidence included.",
    ],
  },
  {
    key: "continuity",
    number: "03",
    label: "Continuity",
    question: "Can the evidence and authority be traced without an unexplained break?",
    defectSignals: [
      "A custody, handoff, or time interval is unexplained.",
      "The current condition no longer corresponds to the original record.",
      "The review relied on a superseded or unverified version.",
    ],
    remedyPrompts: [
      "Reconstruct the missing interval.",
      "Revalidate the current condition.",
      "Suspend the action until continuity is restored.",
    ],
  },
  {
    key: "admissibility",
    number: "04",
    label: "Admissibility",
    question: "Was the evidence sufficient, relevant, current, and conflict-resolved for this consequence?",
    defectSignals: [
      "Conflicting evidence was ignored or discounted without explanation.",
      "The evidence threshold was never defined.",
      "Available evidence was treated as sufficient merely because it existed.",
    ],
    remedyPrompts: [
      "Resolve the conflict through qualified review.",
      "Define and apply the governing threshold.",
      "Reconsider the decision using only admissible evidence.",
    ],
  },
  {
    key: "authority",
    number: "05",
    label: "Authority & Binding",
    question: "Did a valid authority possess power to bind this exact decision and consequence?",
    defectSignals: [
      "The actor had access but not authority.",
      "The delegation applied to a different subject, scope, jurisdiction, or threshold.",
      "Authority expired, was revoked, or was superseded before execution.",
    ],
    remedyPrompts: [
      "Refer the matter to the qualified authority.",
      "Vacate action taken outside delegated scope.",
      "Obtain renewed authorization before any further consequence.",
    ],
  },
  {
    key: "commit",
    number: "06",
    label: "Commit",
    question: "Was the approved decision fixed, versioned, attributable, and protected from silent change?",
    defectSignals: [
      "The approved state changed after review without renewed authorization.",
      "The decision record lacks a preserved version or rationale.",
      "A dependency changed after commitment and was not revalidated.",
    ],
    remedyPrompts: [
      "Restore the approved version and change history.",
      "Recommit the corrected decision through an attributable authority.",
      "Invalidate any silently modified execution package.",
    ],
  },
  {
    key: "execution",
    number: "07",
    label: "Execution",
    question: "Did the performed action remain correspondent to the approved action and boundary?",
    defectSignals: [
      "The actual method or scope differed from what was approved.",
      "A required stop condition, supervision control, or rollback path was bypassed.",
      "The consequence became irreversible before challenge could occur.",
    ],
    remedyPrompts: [
      "Stop or reverse execution where possible.",
      "Restore challenge-before-consequence controls.",
      "Revalidate the execution boundary before resuming.",
    ],
  },
  {
    key: "outcome",
    number: "08",
    label: "Outcome",
    question: "Was the consequence verified, attributable, reviewable, and open to correction?",
    defectSignals: [
      "The claimed outcome cannot be independently verified.",
      "The result differs materially from the approved consequence.",
      "No corrective path exists for an erroneous outcome.",
    ],
    remedyPrompts: [
      "Verify the actual consequence.",
      "Correct the outcome record.",
      "Provide restoration, reversal, or independent review.",
    ],
  },
];

const missions: Mission[] = [
  {
    id: "access-revocation",
    title: "Emergency access revocation",
    domain: "Critical infrastructure",
    contestedAction: "An operator's production access was revoked after an automated risk alert.",
    consequence: "The operator cannot perform assigned safety duties during an active incident.",
    appellantPosition: "The alert was generated from a stale identity record and the revocation occurred before human review.",
    respondentPosition: "The control was necessary to protect the environment and was authorized by emergency policy.",
    evidence: [
      "Automated alert generated at 09:14 UTC.",
      "Identity record last synchronized 47 days earlier.",
      "Supervisor attestation submitted at 09:19 UTC.",
      "Access revocation committed at 09:16 UTC.",
      "Emergency policy requires human confirmation within five minutes when operational safety duties are affected.",
    ],
    authorityRecord: "Security Operations Delegation 4.2, limited by Emergency Access Standard 7.1.",
    hiddenIssue: "The action may have been initially permissible, but the required review did not occur before the operational consequence attached.",
    expectedDecision: "HOLD",
    expectedSeverity: "CRITICAL",
    expectedGrounds: ["record", "admissibility", "authority", "execution"],
    instructorAnalysis: "Preserve the protective purpose while suspending the contested consequence. Revalidate identity, complete qualified review, and create a bounded temporary-access remedy.",
  },
  {
    id: "supplier-denial",
    title: "Supplier eligibility denial",
    domain: "Public procurement",
    contestedAction: "A supplier was denied eligibility based on an integrity-screening result.",
    consequence: "The supplier is excluded from a multi-year procurement opportunity.",
    appellantPosition: "The screening result belongs to a similarly named entity in another jurisdiction.",
    respondentPosition: "The system produced a high-confidence match and the exclusion rule is mandatory.",
    evidence: [
      "Screening result contains a matching trade name.",
      "Registration number differs by two digits.",
      "Registered address and beneficial owner do not match.",
      "Reviewer selected 'same entity' without preserving rationale.",
      "Exclusion notice was issued before the supplier received the evidence package.",
    ],
    authorityRecord: "Procurement Integrity Rule 12 and Appeals Procedure 3.",
    hiddenIssue: "Identity correspondence is unresolved and the challenge record was not available before exclusion.",
    expectedDecision: "DENY",
    expectedSeverity: "CRITICAL",
    expectedGrounds: ["reality", "record", "admissibility", "execution"],
    instructorAnalysis: "Deny the present exclusion, preserve the original screening result, correct identity correspondence, and conduct a new review with notice and opportunity to challenge.",
  },
  {
    id: "model-suspension",
    title: "Model deployment suspension",
    domain: "AI governance",
    contestedAction: "A deployed model was suspended after a post-market monitoring threshold was exceeded.",
    consequence: "A regulated service is unavailable while the appeal is reviewed.",
    appellantPosition: "The threshold breach was caused by a known telemetry defect and does not represent model performance.",
    respondentPosition: "The monitoring rule requires suspension whenever the threshold is exceeded.",
    evidence: [
      "Threshold exceeded for 18 minutes.",
      "Telemetry defect ticket opened three days earlier.",
      "Independent logs show normal model output during the interval.",
      "Suspension rule contains an exception for confirmed measurement failure.",
      "No qualified reviewer determined whether the exception applied.",
    ],
    authorityRecord: "Post-Market Monitoring Control PM-22 and Safety Suspension Delegation D-9.",
    hiddenIssue: "The suspension authority exists, but the exception review is a condition of continued consequence.",
    expectedDecision: "ESCALATE",
    expectedSeverity: "MATERIAL",
    expectedGrounds: ["admissibility", "authority", "commit"],
    instructorAnalysis: "Escalate to the qualified safety authority, preserve the suspension temporarily, verify telemetry integrity, and decide whether the exception authorizes restoration.",
  },
  {
    id: "benefit-recovery",
    title: "Automated benefit recovery",
    domain: "Administrative decision-making",
    contestedAction: "A recovery order was issued after a system identified an apparent overpayment.",
    consequence: "Funds are deducted from future payments before the recipient's appeal is heard.",
    appellantPosition: "The system omitted a lawful eligibility adjustment that was approved before the recovery period.",
    respondentPosition: "The ledger shows an overpayment and the recovery process is routine.",
    evidence: [
      "Eligibility adjustment approved on March 2.",
      "Payment ledger recalculated from the pre-adjustment baseline.",
      "Recovery notice does not cite the adjustment record.",
      "First deduction is scheduled before the appeal response deadline.",
      "Policy requires suspension of collection when a timely appeal presents material contrary evidence.",
    ],
    authorityRecord: "Recovery Policy 8.4 and Appeal Protection Rule 2.1.",
    hiddenIssue: "The record used to calculate consequence is incomplete and collection would occur before challenge can be effective.",
    expectedDecision: "HOLD",
    expectedSeverity: "CRITICAL",
    expectedGrounds: ["record", "continuity", "execution", "outcome"],
    instructorAnalysis: "Hold collection, incorporate the eligibility adjustment, recalculate the ledger, and issue a new reviewable determination before any deduction.",
  },
  {
    id: "vendor-termination",
    title: "Vendor termination appeal",
    domain: "Commercial operations",
    contestedAction: "A vendor agreement was terminated for repeated service-level failures.",
    consequence: "The vendor loses the contract and transition costs are imposed.",
    appellantPosition: "Two of the cited failures occurred during customer-directed maintenance windows excluded by contract.",
    respondentPosition: "The vendor missed the aggregate performance threshold and termination was approved.",
    evidence: [
      "Five incidents were cited in the termination record.",
      "Two incidents overlap approved maintenance windows.",
      "The contract excludes approved windows from service-level calculations.",
      "Three remaining incidents independently exceed the termination threshold.",
      "The approving authority preserved the calculation and notice record.",
    ],
    authorityRecord: "Master Services Agreement sections 9.2, 14.1, and Delegation Matrix C.",
    hiddenIssue: "The rationale contains defects, but the remaining admissible evidence may independently support the same consequence.",
    expectedDecision: "ALLOW",
    expectedSeverity: "LOW",
    expectedGrounds: ["record"],
    instructorAnalysis: "Correct the rationale and exclude the maintenance-window incidents. If the remaining three incidents still satisfy the threshold, the termination can remain allowed with an amended record.",
  },
  {
    id: "clinical-routing",
    title: "Clinical routing escalation",
    domain: "Health operations",
    contestedAction: "A patient referral was downgraded by an automated routing tool.",
    consequence: "Specialist review is delayed beyond the originally requested timeframe.",
    appellantPosition: "The tool did not ingest a new diagnostic result uploaded before the routing decision.",
    respondentPosition: "The referral was processed according to the information available in the routing queue.",
    evidence: [
      "Diagnostic result uploaded at 11:02.",
      "Routing snapshot created at 11:06.",
      "Queue ingestion log shows a synchronization failure.",
      "Downgrade committed at 11:08.",
      "Clinical protocol requires escalation when the diagnostic marker is present.",
    ],
    authorityRecord: "Clinical Routing Protocol CR-8; final triage remains with a licensed clinician.",
    hiddenIssue: "The record was technically available but not incorporated, and the automated tool lacks final authority for the downgraded consequence.",
    expectedDecision: "ESCALATE",
    expectedSeverity: "CRITICAL",
    expectedGrounds: ["record", "continuity", "authority", "execution"],
    instructorAnalysis: "Escalate immediately to the licensed clinician, restore the omitted diagnostic result, and prevent the downgrade from binding until qualified review occurs.",
  },
];

function emptyGroundReview(): GroundReview {
  return { state: "NOT_REVIEWED", finding: "", source: "", requestedCorrection: "" };
}

function createRecord(missionId: string): AppealRecord {
  const groundRecord = Object.fromEntries(
    grounds.map((ground) => [ground.key, emptyGroundReview()])
  ) as Record<GroundKey, GroundReview>;

  return {
    appellant: "",
    organization: "",
    reviewer: "",
    caseReference: `APPEAL-${missionId.toUpperCase()}-${new Date().getFullYear()}`,
    filedAt: new Date().toISOString().slice(0, 16),
    stage: "INTAKE",
    noticePreserved: false,
    originalDecisionPreserved: false,
    executionPaused: false,
    conflictCheckComplete: false,
    grounds: groundRecord,
    severity: "MATERIAL",
    confidence: "MODERATE",
    decision: "",
    rationale: "",
    requestedRemedy: "",
    dispositionConditions: "",
    verificationPlan: "",
    dissent: "",
    completed: false,
  };
}

function createInitialRecords(): Record<string, AppealRecord> {
  return Object.fromEntries(missions.map((mission) => [mission.id, createRecord(mission.id)]));
}

function stateLabel(state: ReviewState) {
  return state.replace("_", " ");
}

function decisionDescription(decision: Decision) {
  if (decision === "ALLOW") return "The challenged decision may remain in force, subject to the preserved rationale and any stated conditions.";
  if (decision === "HOLD") return "Pause consequence while a correctable material defect or unresolved condition is addressed.";
  if (decision === "DENY") return "The challenged decision cannot remain binding because the route is invalid or unsupported.";
  return "Transfer the unresolved issue to a qualified authority, independent reviewer, or higher decision level.";
}

export default function ChallengeAndAppealLabPage() {
  const [activeMissionId, setActiveMissionId] = useState(missions[0].id);
  const [records, setRecords] = useState<Record<string, AppealRecord>>(createInitialRecords);
  const [hydrated, setHydrated] = useState(false);
  const [showInstructor, setShowInstructor] = useState(false);
  const [activeGround, setActiveGround] = useState<GroundKey>("reality");
  const [toast, setToast] = useState("");

  const activeMission = useMemo(
    () => missions.find((mission) => mission.id === activeMissionId) ?? missions[0],
    [activeMissionId]
  );

  const record = records[activeMissionId] ?? createRecord(activeMissionId);
  const reviewedGrounds = grounds.filter((ground) => record.grounds[ground.key].state !== "NOT_REVIEWED").length;
  const defectGrounds = grounds.filter((ground) => record.grounds[ground.key].state === "DEFECT").length;
  const unresolvedGrounds = grounds.filter((ground) => record.grounds[ground.key].state === "UNRESOLVED").length;
  const completedMissions = missions.filter((mission) => records[mission.id]?.completed).length;
  const overallProgress = Math.round((completedMissions / missions.length) * 100);

  const intakeComplete = Boolean(
    record.appellant.trim() &&
      record.reviewer.trim() &&
      record.caseReference.trim() &&
      record.noticePreserved &&
      record.originalDecisionPreserved
  );
  const reviewComplete = reviewedGrounds === grounds.length;
  const dispositionComplete = Boolean(record.decision && record.rationale.trim() && record.requestedRemedy.trim() && record.verificationPlan.trim());
  const canComplete = intakeComplete && reviewComplete && dispositionComplete;

  const decisionConflict = useMemo(() => {
    if (!record.decision) return "";
    if (record.decision === "ALLOW" && (defectGrounds > 0 || unresolvedGrounds > 0)) {
      return "ALLOW conflicts with unresolved or defective grounds. Explain why those defects do not defeat the consequence, or select another disposition.";
    }
    if (record.decision === "DENY" && defectGrounds === 0) {
      return "DENY is not supported by a recorded defect. Preserve the ground that invalidates the challenged decision.";
    }
    if (record.decision === "HOLD" && defectGrounds === 0 && unresolvedGrounds === 0) {
      return "HOLD requires a correctable defect or unresolved condition. Identify the condition preventing final disposition.";
    }
    return "";
  }, [defectGrounds, record.decision, unresolvedGrounds]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        if (parsed.version === "3.0") {
          setActiveMissionId(parsed.activeMissionId || missions[0].id);
          setRecords({ ...createInitialRecords(), ...parsed.records });
        }
      }
    } catch {
      // A malformed local record must never prevent the lab from loading.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: PersistedState = {
      version: "3.0",
      activeMissionId,
      updatedAt: new Date().toISOString(),
      records,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [activeMissionId, hydrated, records]);

  function updateRecord(patch: Partial<AppealRecord>) {
    setRecords((current) => ({
      ...current,
      [activeMissionId]: { ...(current[activeMissionId] ?? createRecord(activeMissionId)), ...patch },
    }));
  }

  function updateGround(key: GroundKey, patch: Partial<GroundReview>) {
    setRecords((current) => {
      const currentRecord = current[activeMissionId] ?? createRecord(activeMissionId);
      return {
        ...current,
        [activeMissionId]: {
          ...currentRecord,
          grounds: {
            ...currentRecord.grounds,
            [key]: { ...currentRecord.grounds[key], ...patch },
          },
        },
      };
    });
  }

  function selectMission(id: string) {
    setActiveMissionId(id);
    setActiveGround("reality");
    setShowInstructor(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function completeMission() {
    if (!canComplete || decisionConflict) return;
    updateRecord({ completed: true, stage: "DISPOSITION" });
    setToast("Appeal record completed and preserved locally.");
    window.setTimeout(() => setToast(""), 2800);
  }

  function resetMission() {
    if (!window.confirm("Reset this mission and remove its locally preserved appeal record?")) return;
    setRecords((current) => ({ ...current, [activeMissionId]: createRecord(activeMissionId) }));
    setActiveGround("reality");
    setShowInstructor(false);
  }

  function downloadJson(filename: string, payload: unknown) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function exportMission() {
    downloadJson(`ta14-challenge-${activeMission.id}-${Date.now()}.json`, {
      recordType: "TA-14 Academy Governed Challenge and Appeal Record",
      schemaVersion: "3.0",
      exportedAt: new Date().toISOString(),
      mission: activeMission,
      appeal: record,
      reviewMetrics: { reviewedGrounds, defectGrounds, unresolvedGrounds },
    });
  }

  function exportTranscript() {
    downloadJson(`ta14-challenge-appeal-lab-transcript-${Date.now()}.json`, {
      recordType: "TA-14 Academy Challenge and Appeal Lab Transcript",
      schemaVersion: "3.0",
      exportedAt: new Date().toISOString(),
      overallProgress,
      completedMissions,
      missionCount: missions.length,
      records,
    });
  }

  const selectedGroundDefinition = grounds.find((ground) => ground.key === activeGround) ?? grounds[0];
  const selectedGroundReview = record.grounds[activeGround];

  return (
    <main className="page">
      <div className="ambient" aria-hidden="true">
        <span className="orb orbOne" />
        <span className="orb orbTwo" />
        <span className="gridTexture" />
      </div>

      {toast ? <div className="toast" role="status">{toast}</div> : null}

      <header className="topbar">
        <Link href="/academy" className="brand">
          <span className="brandMark">TA-14</span>
          <span className="brandCopy">
            <strong>Challenge & Appeal Lab</strong>
            <small>Challenge before irreversible consequence</small>
          </span>
        </Link>

        <nav aria-label="Academy navigation">
          <Link href="/academy/dashboard">Mission Control</Link>
          <Link href="/academy/review">Review Workspace</Link>
          <Link href="/academy/assessment">Assessment</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">Institutional laboratory · governed due process</p>
          <h1>
            Preserve the challenge.
            <em> Govern the remedy.</em>
          </h1>
          <p className="lede">
            A challenge is not merely disagreement. It is an attributable record that identifies a contested consequence,
            connects the objection to a governing defect, preserves the original decision, and produces a reviewable remedy.
          </p>
          <div className="heroActions">
            <button type="button" className="primaryButton" onClick={() => document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" })}>
              Enter adjudication workspace
            </button>
            <button type="button" className="secondaryButton" onClick={exportTranscript}>
              Export lab transcript
            </button>
          </div>
        </div>

        <aside className="governingRule">
          <span>Governing rule</span>
          <strong>Challenge must be meaningful before consequence becomes irreversible.</strong>
          <p>Preservation, notice, independent review, authority, and an effective remedy are part of the governed route.</p>
        </aside>
      </section>

      <section className="metrics shell" aria-label="Lab progress">
        <article>
          <span>Mission completion</span>
          <strong>{overallProgress}%</strong>
          <div className="progressTrack"><i style={{ width: `${overallProgress}%` }} /></div>
        </article>
        <article>
          <span>Completed missions</span>
          <strong>{completedMissions}/{missions.length}</strong>
          <small>Local learner transcript</small>
        </article>
        <article>
          <span>Grounds reviewed</span>
          <strong>{reviewedGrounds}/8</strong>
          <small>{defectGrounds} defects · {unresolvedGrounds} unresolved</small>
        </article>
        <article>
          <span>Current disposition</span>
          <strong className="decisionMetric">{record.decision || "PENDING"}</strong>
          <small>{record.completed ? "Record completed" : "Adjudication in progress"}</small>
        </article>
      </section>

      <section className="missionRail shell" aria-label="Challenge missions">
        {missions.map((mission, index) => {
          const missionRecord = records[mission.id];
          const active = mission.id === activeMissionId;
          return (
            <button
              type="button"
              key={mission.id}
              className={`missionCard ${active ? "active" : ""} ${missionRecord?.completed ? "complete" : ""}`}
              onClick={() => selectMission(mission.id)}
            >
              <span className="missionNumber">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <small>{mission.domain}</small>
                <strong>{mission.title}</strong>
              </span>
              <i>{missionRecord?.completed ? "✓" : "→"}</i>
            </button>
          );
        })}
      </section>

      <section className="caseBrief shell">
        <div className="caseTitle">
          <div>
            <p className="eyebrow">Mission case file · {activeMission.domain}</p>
            <h2>{activeMission.title}</h2>
          </div>
          <div className="caseActions">
            <button type="button" className="secondaryButton" onClick={exportMission}>Export case record</button>
            <button type="button" className="dangerButton" onClick={resetMission}>Reset mission</button>
          </div>
        </div>

        <div className="briefGrid">
          <article>
            <span>Contested action</span>
            <p>{activeMission.contestedAction}</p>
          </article>
          <article>
            <span>Consequence</span>
            <p>{activeMission.consequence}</p>
          </article>
          <article>
            <span>Appellant position</span>
            <p>{activeMission.appellantPosition}</p>
          </article>
          <article>
            <span>Respondent position</span>
            <p>{activeMission.respondentPosition}</p>
          </article>
        </div>

        <div className="evidenceAuthorityGrid">
          <article className="evidencePanel">
            <span>Preserved evidence package</span>
            <ol>
              {activeMission.evidence.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </article>
          <article className="authorityPanel">
            <span>Authority record</span>
            <strong>{activeMission.authorityRecord}</strong>
            <p>The learner must determine whether this authority supports the original decision, the appeal remedy, both, or neither.</p>
          </article>
        </div>
      </section>

      <section id="workspace" className="workspace shell">
        <aside className="stagePanel">
          <p className="eyebrow">Appeal lifecycle</p>
          <h2>Govern the review</h2>
          {(["INTAKE", "PRESERVATION", "REVIEW", "REMEDY", "DISPOSITION"] as Stage[]).map((stage, index) => (
            <button
              type="button"
              key={stage}
              className={record.stage === stage ? "active" : ""}
              onClick={() => updateRecord({ stage })}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{stage}</strong>
            </button>
          ))}

          <div className="completionChecklist">
            <h3>Completion boundary</h3>
            <p className={intakeComplete ? "met" : ""}>Intake and preservation complete</p>
            <p className={reviewComplete ? "met" : ""}>All eight grounds reviewed</p>
            <p className={dispositionComplete ? "met" : ""}>Disposition and remedy preserved</p>
            <p className={!decisionConflict && record.decision ? "met" : ""}>Decision is internally consistent</p>
          </div>
        </aside>

        <div className="workPanel">
          <section className="intakeSection">
            <div className="sectionHeading">
              <div>
                <p className="eyebrow">Stage 01 · Intake and preservation</p>
                <h2>Establish an attributable appeal record</h2>
              </div>
              <span className={`statePill ${intakeComplete ? "supported" : "unresolved"}`}>{intakeComplete ? "COMPLETE" : "INCOMPLETE"}</span>
            </div>

            <div className="formGrid">
              <label>
                <span>Appellant or challenging party</span>
                <input value={record.appellant} onChange={(event) => updateRecord({ appellant: event.target.value })} placeholder="Name or attributable role" />
              </label>
              <label>
                <span>Organization or jurisdiction</span>
                <input value={record.organization} onChange={(event) => updateRecord({ organization: event.target.value })} placeholder="Organization, agency, team, or jurisdiction" />
              </label>
              <label>
                <span>Assigned reviewer</span>
                <input value={record.reviewer} onChange={(event) => updateRecord({ reviewer: event.target.value })} placeholder="Qualified reviewer or review authority" />
              </label>
              <label>
                <span>Case reference</span>
                <input value={record.caseReference} onChange={(event) => updateRecord({ caseReference: event.target.value })} />
              </label>
              <label>
                <span>Filed at</span>
                <input type="datetime-local" value={record.filedAt} onChange={(event) => updateRecord({ filedAt: event.target.value })} />
              </label>
              <label>
                <span>Current stage</span>
                <select value={record.stage} onChange={(event) => updateRecord({ stage: event.target.value as Stage })}>
                  {(["INTAKE", "PRESERVATION", "REVIEW", "REMEDY", "DISPOSITION"] as Stage[]).map((stage) => <option key={stage}>{stage}</option>)}
                </select>
              </label>
            </div>

            <div className="preservationGrid">
              {[
                ["noticePreserved", "Notice preserved", "The challenging party received the decision, evidence basis, deadline, and available remedy."],
                ["originalDecisionPreserved", "Original decision preserved", "The appealed decision remains inspectable and has not been rewritten to fit the response."],
                ["executionPaused", "Consequence paused where required", "Irreversible or compounding consequence is held while a material challenge remains open."],
                ["conflictCheckComplete", "Reviewer conflict check complete", "The assigned reviewer is independent, qualified, and free of a disqualifying conflict."],
              ].map(([key, title, copy]) => (
                <button
                  type="button"
                  key={key}
                  className={record[key as keyof AppealRecord] ? "checked" : ""}
                  onClick={() => updateRecord({ [key]: !record[key as keyof AppealRecord] } as Partial<AppealRecord>)}
                >
                  <i>{record[key as keyof AppealRecord] ? "✓" : ""}</i>
                  <span><strong>{title}</strong><small>{copy}</small></span>
                </button>
              ))}
            </div>
          </section>

          <section className="groundsSection">
            <div className="sectionHeading">
              <div>
                <p className="eyebrow">Stage 02 · Grounds of challenge</p>
                <h2>Connect the objection to the governed route</h2>
              </div>
              <span className={`statePill ${reviewComplete ? "supported" : "unresolved"}`}>{reviewedGrounds}/8 REVIEWED</span>
            </div>

            <div className="groundTabs" role="tablist" aria-label="Challenge grounds">
              {grounds.map((ground) => {
                const groundState = record.grounds[ground.key].state;
                return (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeGround === ground.key}
                    key={ground.key}
                    className={`${activeGround === ground.key ? "active" : ""} ${groundState.toLowerCase()}`}
                    onClick={() => setActiveGround(ground.key)}
                  >
                    <span>{ground.number}</span>
                    <strong>{ground.label}</strong>
                    <i>{groundState === "NOT_REVIEWED" ? "—" : groundState === "SUPPORTED" ? "✓" : groundState === "DEFECT" ? "!" : "?"}</i>
                  </button>
                );
              })}
            </div>

            <article className="groundWorkspace">
              <div className="groundHeader">
                <div>
                  <span>Ground {selectedGroundDefinition.number}</span>
                  <h3>{selectedGroundDefinition.label}</h3>
                  <p>{selectedGroundDefinition.question}</p>
                </div>
                <div className="stateSelector">
                  {(["SUPPORTED", "DEFECT", "UNRESOLVED", "NOT_REVIEWED"] as ReviewState[]).map((state) => (
                    <button
                      type="button"
                      key={state}
                      className={selectedGroundReview.state === state ? "active" : ""}
                      onClick={() => updateGround(activeGround, { state })}
                    >
                      {stateLabel(state)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="groundBody">
                <div className="signalPanel">
                  <span>Failure signals</span>
                  <ul>{selectedGroundDefinition.defectSignals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
                  <span>Possible remedies</span>
                  <ul>{selectedGroundDefinition.remedyPrompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ul>
                </div>

                <div className="groundForm">
                  <label>
                    <span>Finding</span>
                    <textarea rows={6} value={selectedGroundReview.finding} onChange={(event) => updateGround(activeGround, { finding: event.target.value })} placeholder="State what the record supports, what failed, and why it matters to the contested consequence." />
                  </label>
                  <label>
                    <span>Source or record citation</span>
                    <textarea rows={3} value={selectedGroundReview.source} onChange={(event) => updateGround(activeGround, { source: event.target.value })} placeholder="Identify the source, timestamp, version, authority, policy, testimony, or preserved evidence." />
                  </label>
                  <label>
                    <span>Requested correction</span>
                    <textarea rows={3} value={selectedGroundReview.requestedCorrection} onChange={(event) => updateGround(activeGround, { requestedCorrection: event.target.value })} placeholder="Describe the correction, revalidation, restoration, suspension, reversal, or escalation required." />
                  </label>
                </div>
              </div>
            </article>
          </section>

          <section className="dispositionSection">
            <div className="sectionHeading">
              <div>
                <p className="eyebrow">Stage 03 · Remedy and disposition</p>
                <h2>Issue a reviewable appeal determination</h2>
              </div>
              <span className={`statePill ${dispositionComplete ? "supported" : "unresolved"}`}>{dispositionComplete ? "COMPLETE" : "INCOMPLETE"}</span>
            </div>

            <div className="classificationGrid">
              <label>
                <span>Defect severity</span>
                <select value={record.severity} onChange={(event) => updateRecord({ severity: event.target.value as Severity })}>
                  <option>LOW</option><option>MATERIAL</option><option>CRITICAL</option>
                </select>
              </label>
              <label>
                <span>Reviewer confidence</span>
                <select value={record.confidence} onChange={(event) => updateRecord({ confidence: event.target.value as Confidence })}>
                  <option>LOW</option><option>MODERATE</option><option>HIGH</option>
                </select>
              </label>
            </div>

            <div className="decisionGrid">
              {(["ALLOW", "HOLD", "DENY", "ESCALATE"] as Decision[]).map((decision) => (
                <button
                  type="button"
                  key={decision}
                  className={record.decision === decision ? "selected" : ""}
                  onClick={() => updateRecord({ decision })}
                >
                  <strong>{decision}</strong>
                  <span>{decisionDescription(decision)}</span>
                </button>
              ))}
            </div>

            {decisionConflict ? <div className="warningBox"><strong>Decision conflict</strong><p>{decisionConflict}</p></div> : null}

            <div className="dispositionForm">
              <label>
                <span>Reasoned determination</span>
                <textarea rows={7} value={record.rationale} onChange={(event) => updateRecord({ rationale: event.target.value })} placeholder="Explain how the evidence, authority, grounds, severity, uncertainty, and challenge protections support the disposition." />
              </label>
              <label>
                <span>Ordered or requested remedy</span>
                <textarea rows={5} value={record.requestedRemedy} onChange={(event) => updateRecord({ requestedRemedy: event.target.value })} placeholder="State the concrete restoration, correction, suspension, reversal, revalidation, or escalation required." />
              </label>
              <label>
                <span>Disposition conditions</span>
                <textarea rows={4} value={record.dispositionConditions} onChange={(event) => updateRecord({ dispositionConditions: event.target.value })} placeholder="Identify deadlines, responsible actors, temporary controls, prohibited actions, or conditions for resumption." />
              </label>
              <label>
                <span>Outcome verification plan</span>
                <textarea rows={4} value={record.verificationPlan} onChange={(event) => updateRecord({ verificationPlan: event.target.value })} placeholder="Define who verifies the remedy, what evidence proves completion, and how the record remains challengeable." />
              </label>
              <label>
                <span>Dissent or unresolved minority view</span>
                <textarea rows={3} value={record.dissent} onChange={(event) => updateRecord({ dissent: event.target.value })} placeholder="Preserve any material disagreement without rewriting the final disposition." />
              </label>
            </div>

            <div className="completionBar">
              <div>
                <span>Mission readiness</span>
                <strong>{canComplete && !decisionConflict ? "Ready to complete" : "Record remains incomplete"}</strong>
                <p>Completion records the learner's adjudication. It does not itself authorize real-world consequence.</p>
              </div>
              <button type="button" className="primaryButton" disabled={!canComplete || Boolean(decisionConflict)} onClick={completeMission}>
                Complete governed appeal
              </button>
            </div>
          </section>

          <section className="instructorSection">
            <button type="button" className="instructorToggle" onClick={() => setShowInstructor((current) => !current)}>
              <span><small>Instructor reference</small><strong>{showInstructor ? "Hide reference determination" : "Reveal after completing your review"}</strong></span>
              <i>{showInstructor ? "−" : "+"}</i>
            </button>

            {showInstructor ? (
              <div className="instructorBody">
                <div className="expectedRow">
                  <article><span>Reference disposition</span><strong>{activeMission.expectedDecision}</strong></article>
                  <article><span>Reference severity</span><strong>{activeMission.expectedSeverity}</strong></article>
                  <article><span>Material grounds</span><strong>{activeMission.expectedGrounds.map((ground) => grounds.find((item) => item.key === ground)?.label).join(", ")}</strong></article>
                </div>
                <div className="hiddenIssue">
                  <span>Hidden governance issue</span>
                  <p>{activeMission.hiddenIssue}</p>
                </div>
                <div className="analysisBox">
                  <span>Reference analysis</span>
                  <p>{activeMission.instructorAnalysis}</p>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </section>

      <section className="learningBoundary shell">
        <div>
          <p className="eyebrow">Learning boundary</p>
          <h2>What competent challenge governance requires</h2>
        </div>
        <div className="learningGrid">
          <article><strong>01</strong><h3>Preserve</h3><p>Keep the original decision, evidence, authority, notice, and change history inspectable.</p></article>
          <article><strong>02</strong><h3>Pause</h3><p>Prevent irreversible or compounding consequence when a material challenge remains unresolved.</p></article>
          <article><strong>03</strong><h3>Review</h3><p>Use an independent, qualified, attributable reviewer who can inspect the complete governed route.</p></article>
          <article><strong>04</strong><h3>Remedy</h3><p>Produce a correction that is concrete, bounded, time-aware, and independently verifiable.</p></article>
        </div>
      </section>

      <footer className="footer shell">
        <Link href="/academy/review">← Review Workspace</Link>
        <span>TA-14 Academy · Challenge & Appeal Lab · Local learning record</span>
        <Link href="/academy/assessment">Continue to Assessment →</Link>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; }
        :global(body) { margin: 0; background: #030812; }
        :global(button), :global(input), :global(textarea), :global(select) { font: inherit; }
        .page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          color: #edf7ff;
          background:
            radial-gradient(circle at 50% -20%, rgba(31, 105, 145, .25), transparent 42%),
            linear-gradient(180deg, #06101c 0%, #030812 45%, #02050a 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding-bottom: 72px;
        }
        .ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .orb { position: absolute; border-radius: 999px; filter: blur(90px); opacity: .25; }
        .orbOne { width: 560px; height: 560px; background: #14c8c4; left: -260px; top: 12%; }
        .orbTwo { width: 620px; height: 620px; background: #335bd6; right: -280px; top: 48%; }
        .gridTexture {
          position: absolute; inset: 0; opacity: .055;
          background-image:
            linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
        }
        .shell { width: min(1420px, calc(100% - 48px)); margin-inline: auto; position: relative; z-index: 1; }
        .topbar {
          width: min(1420px, calc(100% - 48px)); height: 92px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between; gap: 24px;
          border-bottom: 1px solid rgba(255,255,255,.08); position: relative; z-index: 2;
        }
        .brand { display: flex; align-items: center; gap: 14px; color: inherit; text-decoration: none; }
        .brandMark { padding: 10px 12px; border: 1px solid rgba(73, 224, 218, .7); border-radius: 10px; color: #66ebe7; font-weight: 900; letter-spacing: .08em; }
        .brandCopy { display: grid; gap: 3px; }
        .brandCopy strong { font-size: .98rem; }
        .brandCopy small { color: #819bad; }
        .topbar nav { display: flex; gap: 22px; }
        .topbar nav a, .footer a { color: #a8bdcc; text-decoration: none; transition: color .2s ease; }
        .topbar nav a:hover, .footer a:hover { color: #67e3df; }
        .hero { padding: 82px 0 48px; display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(280px, .55fr); gap: 54px; align-items: end; }
        .eyebrow { margin: 0 0 12px; color: #55dcd7; text-transform: uppercase; letter-spacing: .16em; font-size: .72rem; font-weight: 900; }
        .hero h1 { margin: 0; max-width: 970px; font-size: clamp(3rem, 6.7vw, 6.5rem); line-height: .92; letter-spacing: -.064em; }
        .hero h1 em { display: block; font-style: normal; color: #67dedb; }
        .lede { max-width: 900px; color: #a8bdcc; font-size: 1.1rem; line-height: 1.8; }
        .heroActions, .caseActions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
        .primaryButton, .secondaryButton, .dangerButton {
          border: 0; border-radius: 12px; padding: 13px 17px; cursor: pointer; font-weight: 850; transition: transform .18s ease, opacity .18s ease, border-color .18s ease;
        }
        .primaryButton { color: #031013; background: linear-gradient(135deg, #53e1dc, #4aabd4); }
        .secondaryButton { color: #c8f3f1; background: #0d2233; border: 1px solid rgba(78, 217, 212, .25); }
        .dangerButton { color: #ffb6bd; background: rgba(116, 34, 46, .22); border: 1px solid rgba(255, 129, 143, .2); }
        .primaryButton:hover, .secondaryButton:hover, .dangerButton:hover { transform: translateY(-1px); }
        .primaryButton:disabled { opacity: .35; cursor: not-allowed; transform: none; }
        .governingRule { padding: 26px; border: 1px solid rgba(84, 222, 216, .28); border-radius: 22px; background: rgba(7, 20, 32, .78); box-shadow: 0 34px 110px rgba(0,0,0,.22); }
        .governingRule span, .briefGrid span, .evidencePanel > span, .authorityPanel > span, .signalPanel > span, .hiddenIssue span, .analysisBox span, .expectedRow span, .completionBar span {
          color: #7f9bae; font-size: .7rem; font-weight: 850; text-transform: uppercase; letter-spacing: .12em;
        }
        .governingRule strong { display: block; margin: 12px 0; font-size: 1.3rem; line-height: 1.35; }
        .governingRule p { margin: 0; color: #9db3c3; line-height: 1.65; }
        .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
        .metrics article { min-height: 128px; padding: 20px; border: 1px solid rgba(255,255,255,.09); border-radius: 18px; background: rgba(7, 16, 28, .82); display: grid; align-content: space-between; gap: 8px; }
        .metrics article > span { color: #819bad; font-size: .74rem; text-transform: uppercase; letter-spacing: .1em; }
        .metrics strong { font-size: 2rem; }
        .metrics small { color: #7890a1; }
        .decisionMetric { font-size: 1.35rem !important; color: #64ded9; }
        .progressTrack { height: 6px; border-radius: 999px; background: #0c1d2b; overflow: hidden; }
        .progressTrack i { display: block; height: 100%; background: linear-gradient(90deg, #42d6d1, #5d9fda); }
        .missionRail { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 22px; }
        .missionCard { min-height: 92px; padding: 16px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 14px; color: inherit; text-align: left; border: 1px solid rgba(255,255,255,.08); background: rgba(7, 16, 28, .72); border-radius: 16px; cursor: pointer; }
        .missionCard:hover, .missionCard.active { border-color: rgba(83, 220, 215, .42); background: rgba(12, 31, 47, .88); }
        .missionCard.complete { box-shadow: inset 0 0 0 1px rgba(77, 212, 153, .2); }
        .missionNumber { width: 35px; height: 35px; border-radius: 10px; display: grid; place-items: center; background: #0d2435; color: #5fe0dc; font-weight: 900; }
        .missionCard > span:nth-child(2) { display: grid; gap: 5px; }
        .missionCard small { color: #7590a4; }
        .missionCard i { font-style: normal; color: #5fded9; font-size: 1.2rem; }
        .caseBrief, .workspace, .learningBoundary { border: 1px solid rgba(255,255,255,.09); border-radius: 24px; background: rgba(6, 15, 26, .84); box-shadow: 0 34px 100px rgba(0,0,0,.2); }
        .caseBrief { padding: 28px; margin-bottom: 22px; }
        .caseTitle, .sectionHeading { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
        .caseTitle h2, .sectionHeading h2, .learningBoundary h2 { margin: 0; font-size: clamp(1.8rem, 3vw, 2.65rem); letter-spacing: -.035em; }
        .briefGrid { margin-top: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .briefGrid article { padding: 18px; border-radius: 15px; background: #081522; border: 1px solid rgba(255,255,255,.07); }
        .briefGrid p { margin: 10px 0 0; color: #abc0ce; line-height: 1.65; }
        .evidenceAuthorityGrid { margin-top: 12px; display: grid; grid-template-columns: 1.3fr .7fr; gap: 12px; }
        .evidencePanel, .authorityPanel { padding: 20px; border-radius: 16px; background: #07121f; border: 1px solid rgba(255,255,255,.08); }
        .evidencePanel ol { margin: 16px 0 0; padding-left: 23px; color: #aec3d1; display: grid; gap: 9px; line-height: 1.55; }
        .authorityPanel { display: grid; align-content: start; gap: 14px; }
        .authorityPanel strong { color: #dff8f7; line-height: 1.5; }
        .authorityPanel p { color: #91a9b9; line-height: 1.65; }
        .workspace { display: grid; grid-template-columns: 260px minmax(0, 1fr); overflow: hidden; }
        .stagePanel { padding: 24px; border-right: 1px solid rgba(255,255,255,.08); background: rgba(4, 12, 21, .9); }
        .stagePanel h2 { margin: 0 0 20px; }
        .stagePanel > button { width: 100%; padding: 13px 12px; display: flex; align-items: center; gap: 11px; color: #90a9ba; background: transparent; border: 1px solid transparent; border-radius: 11px; cursor: pointer; text-align: left; }
        .stagePanel > button span { color: #5edbd7; font-size: .72rem; }
        .stagePanel > button.active { color: #edfbff; background: #0b2131; border-color: rgba(83, 220, 215, .2); }
        .completionChecklist { margin-top: 28px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.08); }
        .completionChecklist h3 { margin: 0 0 14px; font-size: .95rem; }
        .completionChecklist p { position: relative; margin: 10px 0; padding-left: 21px; color: #718b9e; font-size: .82rem; line-height: 1.4; }
        .completionChecklist p::before { content: "○"; position: absolute; left: 0; color: #536d80; }
        .completionChecklist p.met { color: #9fe0c2; }
        .completionChecklist p.met::before { content: "●"; color: #55d59d; }
        .workPanel { min-width: 0; }
        .intakeSection, .groundsSection, .dispositionSection, .instructorSection { padding: 30px; border-bottom: 1px solid rgba(255,255,255,.08); }
        .statePill { padding: 7px 10px; border-radius: 999px; font-size: .68rem; font-weight: 900; letter-spacing: .08em; }
        .statePill.supported { color: #83dfaf; background: rgba(64, 192, 128, .13); border: 1px solid rgba(64, 192, 128, .2); }
        .statePill.unresolved { color: #ffd589; background: rgba(214, 155, 51, .12); border: 1px solid rgba(214, 155, 51, .2); }
        .formGrid, .classificationGrid { margin-top: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        label { display: grid; gap: 8px; }
        label > span { color: #9eb4c3; font-size: .78rem; font-weight: 800; }
        input, textarea, select { width: 100%; color: #edf8ff; background: #071522; border: 1px solid rgba(255,255,255,.1); border-radius: 11px; padding: 12px 13px; outline: none; resize: vertical; }
        input:focus, textarea:focus, select:focus { border-color: rgba(80, 220, 214, .65); box-shadow: 0 0 0 3px rgba(80, 220, 214, .08); }
        .preservationGrid { margin-top: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .preservationGrid button { padding: 15px; display: grid; grid-template-columns: auto 1fr; gap: 12px; color: inherit; text-align: left; border: 1px solid rgba(255,255,255,.08); border-radius: 13px; background: #071421; cursor: pointer; }
        .preservationGrid button.checked { border-color: rgba(76, 211, 151, .32); background: rgba(31, 93, 66, .17); }
        .preservationGrid i { width: 25px; height: 25px; border: 1px solid rgba(255,255,255,.16); border-radius: 7px; display: grid; place-items: center; color: #63d99f; font-style: normal; }
        .preservationGrid span { display: grid; gap: 5px; }
        .preservationGrid small { color: #829aab; line-height: 1.45; }
        .groundTabs { margin-top: 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .groundTabs button { min-height: 74px; padding: 11px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 8px; color: #8fa8b8; text-align: left; background: #071421; border: 1px solid rgba(255,255,255,.07); border-radius: 11px; cursor: pointer; }
        .groundTabs button.active { color: #edfaff; border-color: rgba(81, 220, 214, .45); background: #0b2232; }
        .groundTabs button.supported i { color: #5bd59a; }
        .groundTabs button.defect i { color: #ff858e; }
        .groundTabs button.unresolved i { color: #ffd078; }
        .groundTabs span { color: #58dcd7; font-size: .7rem; }
        .groundTabs i { font-style: normal; }
        .groundWorkspace { margin-top: 12px; border: 1px solid rgba(255,255,255,.08); border-radius: 16px; overflow: hidden; background: #06111d; }
        .groundHeader { padding: 20px; display: flex; justify-content: space-between; gap: 24px; border-bottom: 1px solid rgba(255,255,255,.08); }
        .groundHeader > div:first-child > span { color: #55dcd7; font-size: .72rem; text-transform: uppercase; letter-spacing: .12em; }
        .groundHeader h3 { margin: 7px 0; font-size: 1.7rem; }
        .groundHeader p { margin: 0; max-width: 720px; color: #99afbf; line-height: 1.6; }
        .stateSelector { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 7px; align-content: flex-start; }
        .stateSelector button { padding: 8px 9px; color: #8da5b6; background: #0a1b2a; border: 1px solid rgba(255,255,255,.08); border-radius: 9px; cursor: pointer; font-size: .7rem; font-weight: 800; }
        .stateSelector button.active { color: #031114; background: #5edbd7; }
        .groundBody { display: grid; grid-template-columns: .7fr 1.3fr; }
        .signalPanel { padding: 20px; border-right: 1px solid rgba(255,255,255,.08); background: rgba(7, 20, 32, .72); }
        .signalPanel ul { margin: 11px 0 22px; padding-left: 18px; color: #8fa7b8; line-height: 1.55; display: grid; gap: 8px; }
        .groundForm { padding: 20px; display: grid; gap: 14px; }
        .classificationGrid { max-width: 680px; }
        .decisionGrid { margin-top: 18px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .decisionGrid button { min-height: 145px; padding: 17px; display: grid; align-content: start; gap: 10px; color: #a1b6c5; text-align: left; background: #071522; border: 1px solid rgba(255,255,255,.08); border-radius: 14px; cursor: pointer; }
        .decisionGrid button strong { color: #eaf9ff; font-size: 1.12rem; }
        .decisionGrid button span { line-height: 1.45; font-size: .82rem; }
        .decisionGrid button.selected { border-color: rgba(78, 222, 215, .55); background: #0c2637; box-shadow: inset 0 0 0 1px rgba(78, 222, 215, .12); }
        .warningBox { margin-top: 14px; padding: 15px; border-radius: 12px; border: 1px solid rgba(255, 184, 85, .28); background: rgba(105, 65, 14, .18); color: #ffd99f; }
        .warningBox p { margin: 6px 0 0; line-height: 1.55; }
        .dispositionForm { margin-top: 18px; display: grid; gap: 14px; }
        .completionBar { margin-top: 20px; padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 24px; border-radius: 15px; background: #081827; border: 1px solid rgba(255,255,255,.08); }
        .completionBar div { display: grid; gap: 6px; }
        .completionBar p { margin: 0; color: #829aab; }
        .instructorToggle { width: 100%; padding: 0; display: flex; justify-content: space-between; align-items: center; gap: 20px; color: inherit; text-align: left; background: transparent; border: 0; cursor: pointer; }
        .instructorToggle span { display: grid; gap: 5px; }
        .instructorToggle small { color: #56dcd7; text-transform: uppercase; letter-spacing: .12em; font-weight: 850; }
        .instructorToggle strong { font-size: 1.25rem; }
        .instructorToggle i { font-style: normal; font-size: 2rem; color: #56dcd7; }
        .instructorBody { margin-top: 22px; display: grid; gap: 12px; }
        .expectedRow { display: grid; grid-template-columns: .7fr .7fr 1.6fr; gap: 10px; }
        .expectedRow article, .hiddenIssue, .analysisBox { padding: 17px; border-radius: 13px; background: #071522; border: 1px solid rgba(255,255,255,.08); }
        .expectedRow article { display: grid; gap: 8px; }
        .hiddenIssue p, .analysisBox p { margin: 8px 0 0; color: #a8becc; line-height: 1.65; }
        .learningBoundary { margin-top: 22px; padding: 30px; }
        .learningGrid { margin-top: 22px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .learningGrid article { padding: 20px; border-radius: 15px; background: #071421; border: 1px solid rgba(255,255,255,.08); }
        .learningGrid article > strong { color: #59dcd7; font-size: 1.4rem; }
        .learningGrid h3 { margin: 14px 0 8px; }
        .learningGrid p { margin: 0; color: #91a9ba; line-height: 1.55; }
        .footer { padding: 28px 0 0; display: flex; justify-content: space-between; align-items: center; gap: 20px; color: #6f8798; font-size: .82rem; }
        .toast { position: fixed; z-index: 20; right: 24px; top: 24px; padding: 13px 17px; border-radius: 12px; color: #dffff2; background: #123c30; border: 1px solid rgba(92, 220, 166, .3); box-shadow: 0 18px 60px rgba(0,0,0,.35); }
        @media (max-width: 1160px) {
          .metrics { grid-template-columns: 1fr 1fr; }
          .missionRail { grid-template-columns: 1fr 1fr; }
          .workspace { grid-template-columns: 220px minmax(0, 1fr); }
          .groundTabs { grid-template-columns: 1fr 1fr; }
          .decisionGrid { grid-template-columns: 1fr 1fr; }
          .learningGrid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 900px) {
          .topbar nav { display: none; }
          .hero { grid-template-columns: 1fr; }
          .briefGrid, .evidenceAuthorityGrid { grid-template-columns: 1fr; }
          .workspace { grid-template-columns: 1fr; }
          .stagePanel { border-right: 0; border-bottom: 1px solid rgba(255,255,255,.08); display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
          .stagePanel > .eyebrow, .stagePanel > h2, .completionChecklist { grid-column: 1 / -1; }
          .stagePanel > button { justify-content: center; }
          .stagePanel > button strong { display: none; }
          .groundBody { grid-template-columns: 1fr; }
          .signalPanel { border-right: 0; border-bottom: 1px solid rgba(255,255,255,.08); }
          .expectedRow { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .shell, .topbar { width: min(100% - 28px, 1420px); }
          .hero { padding-top: 54px; }
          .hero h1 { font-size: clamp(2.8rem, 15vw, 4.5rem); }
          .metrics, .missionRail, .formGrid, .preservationGrid, .classificationGrid, .learningGrid { grid-template-columns: 1fr; }
          .caseTitle, .sectionHeading, .completionBar { display: grid; }
          .caseActions { margin-top: 0; }
          .groundTabs { grid-template-columns: 1fr; }
          .groundHeader { display: grid; }
          .stateSelector { justify-content: flex-start; }
          .decisionGrid { grid-template-columns: 1fr; }
          .intakeSection, .groundsSection, .dispositionSection, .instructorSection, .learningBoundary, .caseBrief { padding: 20px; }
          .footer { display: grid; text-align: center; }
          .footer a { justify-self: center; }
        }
      `}</style>
    </main>
  );
}
