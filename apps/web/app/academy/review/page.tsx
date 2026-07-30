'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
type Disposition = 'Open' | 'Accepted' | 'Corrected' | 'Rejected' | 'Superseded';
type Determination = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE' | 'NOT REVIEWED';
type Confidence = 'Low' | 'Moderate' | 'High';
type ReviewMode = 'Queue' | 'Workspace' | 'Compare' | 'Corrective actions' | 'Audit trail';

type Finding = {
  id: string;
  category: string;
  severity: Severity;
  disposition: Disposition;
  summary: string;
  rationale: string;
  evidenceReference: string;
  owner: string;
  correctiveAction: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

type ReviewCase = {
  id: string;
  title: string;
  domain: string;
  submittedBy: string;
  submittedAt: string;
  risk: Severity;
  status: string;
  version: string;
  purpose: string;
  action: string;
  boundary: string;
  evidenceCount: number;
  openQuestions: number;
  recommended: Determination;
};

type ReviewState = {
  selectedCaseId: string;
  determination: Determination;
  confidence: Confidence;
  reviewerNotes: string;
  findings: Finding[];
  checkedLinks: number[];
  acknowledgedPrinciples: number[];
  lastSavedAt: string;
};

const STORAGE_KEY = 'ta14-academy-review-workspace-v4';

const reviewCases: ReviewCase[] = [
  {
    id: 'RV-2401',
    title: 'Autonomous vendor payment release',
    domain: 'Financial operations',
    submittedBy: 'Procurement Governance Team',
    submittedAt: '2026-07-30T12:20:00-04:00',
    risk: 'Critical',
    status: 'Ready for review',
    version: 'v3.4',
    purpose: 'Govern a payment release initiated by an AI purchasing agent.',
    action: 'Release a $27,500 payment to a declared beneficiary.',
    boundary: 'Single approved invoice, named beneficiary, approved budget, current finance authority.',
    evidenceCount: 18,
    openQuestions: 3,
    recommended: 'HOLD',
  },
  {
    id: 'RV-2402',
    title: 'Clinical scheduling prioritization',
    domain: 'Healthcare operations',
    submittedBy: 'Care Access Office',
    submittedAt: '2026-07-30T11:05:00-04:00',
    risk: 'High',
    status: 'Evidence update received',
    version: 'v2.1',
    purpose: 'Review a scheduling model that prioritizes time-sensitive appointments.',
    action: 'Assign priority and propose appointment slots.',
    boundary: 'No diagnosis, no treatment selection, human confirmation required.',
    evidenceCount: 31,
    openQuestions: 2,
    recommended: 'ESCALATE',
  },
  {
    id: 'RV-2403',
    title: 'Building ventilation response',
    domain: 'Environmental integrity',
    submittedBy: 'Facilities Reliability Group',
    submittedAt: '2026-07-30T09:42:00-04:00',
    risk: 'High',
    status: 'Independent review',
    version: 'v5.0',
    purpose: 'Govern a response to measured ventilation degradation.',
    action: 'Place affected space into restricted-use status and dispatch inspection.',
    boundary: 'Named facility, current sensor package, no automatic equipment override.',
    evidenceCount: 42,
    openQuestions: 1,
    recommended: 'ALLOW',
  },
  {
    id: 'RV-2404',
    title: 'Employee access revocation',
    domain: 'Identity governance',
    submittedBy: 'Security Operations',
    submittedAt: '2026-07-29T17:30:00-04:00',
    risk: 'Critical',
    status: 'Challenge open',
    version: 'v1.8',
    purpose: 'Revoke access after a verified employment-status change.',
    action: 'Disable specified accounts and tokens.',
    boundary: 'Named identity, authoritative HR event, appeal and rollback path preserved.',
    evidenceCount: 24,
    openQuestions: 4,
    recommended: 'HOLD',
  },
  {
    id: 'RV-2405',
    title: 'Model deployment promotion',
    domain: 'AI platform operations',
    submittedBy: 'Model Reliability Council',
    submittedAt: '2026-07-29T15:15:00-04:00',
    risk: 'High',
    status: 'Awaiting reviewer',
    version: 'v7.2',
    purpose: 'Promote a tested model release from staging into production.',
    action: 'Bind approved artifact hash to production deployment.',
    boundary: 'Declared model, environment, data contract, rollback and monitoring conditions.',
    evidenceCount: 37,
    openQuestions: 2,
    recommended: 'NOT REVIEWED',
  },
  {
    id: 'RV-2406',
    title: 'Public-benefit eligibility notice',
    domain: 'Public administration',
    submittedBy: 'Eligibility Modernization Office',
    submittedAt: '2026-07-29T13:08:00-04:00',
    risk: 'Critical',
    status: 'Corrective action due',
    version: 'v4.6',
    purpose: 'Generate a proposed eligibility notice from authoritative case records.',
    action: 'Prepare notice for authorized human approval and delivery.',
    boundary: 'No autonomous denial; source citations and appeal rights required.',
    evidenceCount: 29,
    openQuestions: 5,
    recommended: 'DENY',
  },
  {
    id: 'RV-2407',
    title: 'Industrial maintenance shutdown',
    domain: 'Industrial safety',
    submittedBy: 'Plant Integrity Team',
    submittedAt: '2026-07-29T10:31:00-04:00',
    risk: 'Critical',
    status: 'Ready for review',
    version: 'v2.9',
    purpose: 'Initiate a controlled shutdown when verified hazard thresholds are exceeded.',
    action: 'Issue shutdown command to bounded equipment group.',
    boundary: 'Current sensors, named zone, valid safety authority, human override preserved.',
    evidenceCount: 46,
    openQuestions: 2,
    recommended: 'ESCALATE',
  },
  {
    id: 'RV-2408',
    title: 'Customer refund approval',
    domain: 'Consumer operations',
    submittedBy: 'Service Resolution Unit',
    submittedAt: '2026-07-28T16:45:00-04:00',
    risk: 'Medium',
    status: 'Peer review complete',
    version: 'v6.3',
    purpose: 'Approve refunds within a bounded policy and amount.',
    action: 'Issue refund up to $500 to original payment instrument.',
    boundary: 'Verified transaction, policy match, fraud screen, no cash substitution.',
    evidenceCount: 22,
    openQuestions: 0,
    recommended: 'ALLOW',
  },
];

const reviewCategories = [
  {
    name: 'Evidence',
    code: 'EV',
    question: 'Does the submitted material prove the declared fact within scope, time, and source boundaries?',
  },
  {
    name: 'Authority',
    code: 'AU',
    question: 'Does the actor possess valid authority for this exact action, object, boundary, and moment?',
  },
  {
    name: 'Continuity',
    code: 'CT',
    question: 'Has identity, evidence, authority, context, and dependency continuity been preserved?',
  },
  {
    name: 'Boundary',
    code: 'BD',
    question: 'Is the execution confined to the approved purpose, scope, system, population, and consequence?',
  },
  {
    name: 'Dependencies',
    code: 'DP',
    question: 'Are material dependencies identified, current, available, and within their accepted state?',
  },
  {
    name: 'Correspondence',
    code: 'CP',
    question: 'Does the planned execution correspond to the reviewed evidence, authority, and determination?',
  },
  {
    name: 'Binding',
    code: 'BN',
    question: 'Is the determination bound to the exact actor, action, object, time, and consequence?',
  },
  {
    name: 'Commit',
    code: 'CM',
    question: 'Is the committed version identifiable, immutable enough for replay, and linked to its authorization?',
  },
  {
    name: 'Execution',
    code: 'EX',
    question: 'Did the actual execution remain within the committed and authorized boundary?',
  },
  {
    name: 'Outcome',
    code: 'OC',
    question: 'Is the outcome recorded, attributable, challengeable, and connected to the originating route?',
  },
  {
    name: 'Uncertainty',
    code: 'UN',
    question: 'Are unresolved facts, unknowns, assumptions, and confidence limits preserved rather than erased?',
  },
  {
    name: 'Challenge',
    code: 'CH',
    question: 'Can an independent reviewer inspect, object, rebut, correct, and preserve the resulting record?',
  },
];

const runtimeLinks = [
  {
    number: '01',
    name: 'Reality',
    question: 'What is actually true in the operating environment now?',
  },
  {
    number: '02',
    name: 'Record',
    question: 'What attributable record captures that reality?',
  },
  {
    number: '03',
    name: 'Source integrity',
    question: 'Can the source, method, timestamp, and custody be inspected?',
  },
  {
    number: '04',
    name: 'Identity',
    question: 'Who or what produced, submitted, transformed, or approved the record?',
  },
  {
    number: '05',
    name: 'Purpose',
    question: 'What exact action and consequence is the route attempting to govern?',
  },
  {
    number: '06',
    name: 'Scope',
    question: 'What systems, people, objects, geography, and time are inside the boundary?',
  },
  {
    number: '07',
    name: 'Evidence',
    question: 'What evidence supports each material claim?',
  },
  {
    number: '08',
    name: 'Evidence sufficiency',
    question: 'Is the evidence relevant, current, complete enough, and fit for purpose?',
  },
  {
    number: '09',
    name: 'Authority',
    question: 'What authority permits this exact actor to perform this exact action?',
  },
  {
    number: '10',
    name: 'Authority validity',
    question: 'Is that authority current, unrevoked, and within its delegated boundary?',
  },
  {
    number: '11',
    name: 'Policy',
    question: 'Which rules, obligations, standards, and prohibitions apply?',
  },
  {
    number: '12',
    name: 'Dependencies',
    question: 'Which services, models, data, tools, and humans must remain valid?',
  },
  {
    number: '13',
    name: 'Continuity',
    question: 'Has the route preserved identity, evidence, authority, and context over time?',
  },
  {
    number: '14',
    name: 'Boundary',
    question: 'Are purpose, scope, and prohibited actions explicit?',
  },
  {
    number: '15',
    name: 'Risk',
    question: 'What consequence could occur if the route is wrong or drifts?',
  },
  {
    number: '16',
    name: 'Controls',
    question: 'Which preventive, detective, corrective, and recovery controls are active?',
  },
  {
    number: '17',
    name: 'Admissibility',
    question: 'Have the required conditions earned the right to proceed?',
  },
  {
    number: '18',
    name: 'Determination',
    question: 'Is the supported state ALLOW, HOLD, DENY, or ESCALATE?',
  },
  {
    number: '19',
    name: 'Binding',
    question: 'Is the determination bound to the exact action and evidence set reviewed?',
  },
  {
    number: '20',
    name: 'Commit',
    question: 'Is the executable version fixed and attributable?',
  },
  {
    number: '21',
    name: 'Execution',
    question: 'Did the action remain within the committed boundary?',
  },
  {
    number: '22',
    name: 'Correspondence',
    question: 'Does execution still correspond to the reviewed conditions?',
  },
  {
    number: '23',
    name: 'Outcome',
    question: 'What happened, and what evidence proves the outcome?',
  },
  {
    number: '24',
    name: 'Challenge and replay',
    question: 'Can the full route be independently reconstructed and challenged?',
  },
];

const reviewPrinciples = [
  'Review the consequence-bearing action, not merely the narrative around it.',
  'Never convert absence of evidence into favorable evidence.',
  'Preserve “unknown” as an unresolved state until evidence closes it.',
  'Authority must be valid for the exact action and cannot be inferred from access alone.',
  'Continuity must survive across identity, evidence, authority, context, and dependencies.',
  'A later correction must not silently overwrite the record that was originally reviewed.',
  'Every finding must identify the failed condition and the consequence of leaving it unresolved.',
  'Findings and source records remain distinct until an attributable disposition is preserved.',
  'A reviewer may recommend a determination but may not fabricate the facts required to support it.',
  'ALLOW is not the default; it is an earned and bounded determination.',
  'HOLD is a protective state when a remediable condition remains unresolved.',
  'DENY is appropriate when the route is prohibited, materially false, or outside recoverable scope.',
  'ESCALATE is appropriate when authority, consequence, ambiguity, or conflict exceeds reviewer scope.',
  'Severity reflects consequence exposure, not reviewer preference.',
  'Confidence must be stated separately from severity.',
  'Competing interpretations must be preserved when evidence does not settle the dispute.',
  'Every material change after review requires renewed correspondence testing.',
  'The earliest failed runtime link should be identified before downstream symptoms are analyzed.',
  'Corrective action must name the owner, evidence required, due condition, and revalidation boundary.',
  'Closure means the finding has a preserved disposition; it does not guarantee the route is admissible.',
  'Replay must reconstruct what the reviewer knew, when they knew it, and what version they inspected.',
  'Independent challenge is part of governance, not an interruption of governance.',
  'Credentials prove bounded competency; they do not replace evidence for a specific execution.',
  'No admissible evidence. No admissible execution.',
];

const initialFindings: Finding[] = [
  {
    id: 'F-101',
    category: 'Authority',
    severity: 'Critical',
    disposition: 'Open',
    summary: 'Finance authority is not bound to this payment release.',
    rationale: 'The submitted role record proves system access but does not prove current approval authority for the named amount and beneficiary.',
    evidenceReference: 'AUTH-ROLE-44',
    owner: 'Finance control owner',
    correctiveAction: 'Provide current delegated authority, amount limit, beneficiary scope, and revocation status.',
    dueDate: '2026-08-02',
    createdAt: '2026-07-30T12:30:00-04:00',
    updatedAt: '2026-07-30T12:30:00-04:00',
  },
  {
    id: 'F-102',
    category: 'Evidence',
    severity: 'High',
    disposition: 'Open',
    summary: 'Beneficiary ownership remains unproven.',
    rationale: 'The invoice identifies a payee, but the submitted record does not establish control of the destination account.',
    evidenceReference: 'INV-2026-884',
    owner: 'Procurement evidence owner',
    correctiveAction: 'Provide independently verified beneficiary and destination-account correspondence evidence.',
    dueDate: '2026-08-01',
    createdAt: '2026-07-30T12:30:00-04:00',
    updatedAt: '2026-07-30T12:30:00-04:00',
  },
  {
    id: 'F-103',
    category: 'Continuity',
    severity: 'High',
    disposition: 'Open',
    summary: 'Purchase approval predates the final invoice revision.',
    rationale: 'The approval was issued against invoice version 2, while the proposed payment binds to invoice version 4.',
    evidenceReference: 'PO-REV-19',
    owner: 'Route owner',
    correctiveAction: 'Revalidate approval against the committed invoice version and preserve the renewed binding.',
    dueDate: '2026-08-03',
    createdAt: '2026-07-30T12:30:00-04:00',
    updatedAt: '2026-07-30T12:30:00-04:00',
  },
];

const defaultState: ReviewState = {
  selectedCaseId: 'RV-2401',
  determination: 'HOLD',
  confidence: 'Moderate',
  reviewerNotes: '',
  findings: initialFindings,
  checkedLinks: [1, 2, 3, 4, 5, 6, 7],
  acknowledgedPrinciples: [],
  lastSavedAt: '',
};

function readState(): ReviewState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<ReviewState>;
    return { ...defaultState, ...parsed, findings: Array.isArray(parsed.findings) ? parsed.findings : initialFindings };
  } catch {
    return defaultState;
  }
}

function formatDate(value: string) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
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

export default function ReviewWorkspacePage() {
  const [state, setState] = useState<ReviewState>(defaultState);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [mode, setMode] = useState<ReviewMode>('Workspace');
  const [query, setQuery] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<'All' | Severity>('All');
  const [category, setCategory] = useState<string>('Evidence');
  const [severity, setSeverity] = useState<Severity>('Medium');
  const [summary, setSummary] = useState<string>('');
  const [rationale, setRationale] = useState<string>('');
  const [evidenceReference, setEvidenceReference] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const [correctiveAction, setCorrectiveAction] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [findingFilter, setFindingFilter] = useState<'All' | Disposition>('All');
  const [notice, setNotice] = useState<string>('');
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const importRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setState(readState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const next = { ...state, lastSavedAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [state, hydrated]);

  const selectedCase = useMemo(() => reviewCases.find((item) => item.id === state.selectedCaseId) ?? reviewCases[0], [state.selectedCaseId]);
  const filteredCases = useMemo(() => reviewCases.filter((item) => {
    const text = `${item.id} ${item.title} ${item.domain} ${item.submittedBy}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesRisk = riskFilter === 'All' || item.risk === riskFilter;
    return matchesQuery && matchesRisk;
  }), [query, riskFilter]);
  const visibleFindings = useMemo(() => state.findings.filter((item) => findingFilter === "All" || item.disposition === findingFilter), [state.findings, findingFilter]);
  const metrics = useMemo(() => {
    const open = state.findings.filter((item) => item.disposition === "Open").length;
    const high = state.findings.filter((item) => item.severity === "High" || item.severity === "Critical").length;
    const corrected = state.findings.filter((item) => item.disposition === "Corrected").length;
    const completion = Math.round((state.checkedLinks.length / runtimeLinks.length) * 100);
    return { open, high, corrected, completion };
  }, [state.findings, state.checkedLinks]);

  function selectCase(id: string) {
    const item = reviewCases.find((entry) => entry.id === id);
    if (!item) return;
    setState((current) => ({ ...current, selectedCaseId: id, determination: item.recommended, checkedLinks: [], reviewerNotes: "" }));
    setNotice(`Loaded ${id} into the bounded review workspace.`);
  }

  function toggleRuntimeLink(index: number) {
    setState((current) => ({ ...current, checkedLinks: current.checkedLinks.includes(index) ? current.checkedLinks.filter((item) => item !== index) : [...current.checkedLinks, index].sort((a,b) => a-b) }));
  }

  function addFinding() {
    if (!summary.trim() || !rationale.trim()) { setNotice("A precise summary and rationale are required."); return; }
    const now = new Date().toISOString();
    const finding: Finding = { id: `F-${Date.now().toString().slice(-6)}`, category, severity, disposition: "Open", summary: summary.trim(), rationale: rationale.trim(), evidenceReference: evidenceReference.trim(), owner: owner.trim(), correctiveAction: correctiveAction.trim(), dueDate, createdAt: now, updatedAt: now };
    setState((current) => ({ ...current, findings: [finding, ...current.findings] }));
    setSummary(""); setRationale(""); setEvidenceReference(""); setOwner(""); setCorrectiveAction(""); setDueDate("");
    setNotice(`Finding ${finding.id} preserved.`);
  }

  function updateFinding(id: string, disposition: Disposition) {
    setState((current) => ({ ...current, findings: current.findings.map((item) => item.id === id ? { ...item, disposition, updatedAt: new Date().toISOString() } : item) }));
    setNotice(`Finding ${id} disposition updated to ${disposition}.`);
  }

  function removeFinding(id: string) {
    setState((current) => ({ ...current, findings: current.findings.filter((item) => item.id !== id) }));
    setNotice(`Finding ${id} removed from this local training record.`);
  }

  function exportReview() {
    downloadJson(`ta14-academy-review-${selectedCase.id}-${Date.now()}.json`, { recordType: "TA-14 Academy Review Workspace Record", schemaVersion: "4.0", exportedAt: new Date().toISOString(), reviewCase: selectedCase, reviewState: state, governingPrinciple: "No admissible evidence. No admissible execution." });
    setNotice("Review package exported.");
  }

  function importReview(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as { reviewState?: Partial<ReviewState> };
        if (!parsed.reviewState) throw new Error("Missing reviewState");
        setState((current) => ({ ...current, ...parsed.reviewState, findings: Array.isArray(parsed.reviewState?.findings) ? parsed.reviewState.findings : current.findings }));
        setNotice("Review package imported into local workspace.");
      } catch { setNotice("The selected file is not a valid TA-14 Academy review package."); }
    };
    reader.readAsText(file);
  }

  function resetWorkspace() {
    setState(defaultState);
    window.localStorage.removeItem(STORAGE_KEY);
    setNotice("Local review workspace reset to the demonstration record.");
  }

  return (
    <main className="reviewPage">
      <div className="cosmos" aria-hidden="true">
        <span className="starField starField1" />
        <span className="starField starField2" />
        <span className="starField starField3" />
        <span className="starField starField4" />
        <span className="starField starField5" />
        <span className="starField starField6" />
        <span className="starField starField7" />
        <span className="starField starField8" />
        <span className="aurora auroraOne" />
        <span className="aurora auroraTwo" />
      </div>

      <header className="workspaceHeader">
        <div>
          <p className="kicker">TA-14 Academy · Bounded review environment</p>
          <h1>Review Workspace</h1>
          <p className="headerCopy">Challenge evidence, authority, continuity, boundaries, and correspondence before a consequence-bearing action is treated as admissible.</p>
        </div>
        <div className="headerActions">
          <button type="button" className="quietButton" onClick={() => importRef.current?.click()}>Import</button>
          <button type="button" className="quietButton" onClick={exportReview}>Export</button>
          <Link className="primaryLink" href="/academy/assessment">Open assessment →</Link>
          <input ref={importRef} hidden type="file" accept="application/json" onChange={(event) => importReview(event.target.files?.[0])} />
        </div>
      </header>

      {notice ? <div className="notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice("")}>Dismiss</button></div> : null}

      <section className="principleBanner">
        <div><span>Governing principle</span><strong>No admissible evidence. No admissible execution.</strong></div>
        <p>The Academy may guide and challenge. It may not fabricate evidence, invent authority, erase uncertainty, or silently select a favorable determination.</p>
      </section>

      <nav className="modeTabs" aria-label="Review workspace modes">
        {(["Queue", "Workspace", "Compare", "Corrective actions", "Audit trail"] as ReviewMode[]).map((item) => (
          <button key={item} type="button" className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{item}</button>
        ))}
      </nav>

      <section className="metricGrid">
        <article className="metricCard">
          <span>Selected route</span>
          <strong>{hydrated ? selectedCase.id : "—"}</strong>
          <small>Bounded review record</small>
        </article>
        <article className="metricCard">
          <span>Runtime review</span>
          <strong>{hydrated ? `${metrics.completion}%` : "—"}</strong>
          <small>24-link inspection progress</small>
        </article>
        <article className="metricCard">
          <span>Open findings</span>
          <strong>{hydrated ? metrics.open : "—"}</strong>
          <small>Unresolved objections</small>
        </article>
        <article className="metricCard">
          <span>High exposure</span>
          <strong>{hydrated ? metrics.high : "—"}</strong>
          <small>High or critical findings</small>
        </article>
        <article className="metricCard">
          <span>Determination</span>
          <strong>{hydrated ? state.determination : "—"}</strong>
          <small>Current recommendation</small>
        </article>
        <article className="metricCard">
          <span>Confidence</span>
          <strong>{hydrated ? state.confidence : "—"}</strong>
          <small>Separate from severity</small>
        </article>
      </section>

      <section className="workspaceLayout">
        <aside className="caseRail">
          <div className="sectionHeading"><div><span>Review queue</span><h2>Submitted routes</h2></div><b>{filteredCases.length}</b></div>
          <label className="searchField"><span>Search queue</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Case, domain, team…" /></label>
          <div className="riskFilters">
            {(["All", "Low", "Medium", "High", "Critical"] as const).map((item) => <button key={item} type="button" className={riskFilter === item ? "active" : ""} onClick={() => setRiskFilter(item)}>{item}</button>)}
          </div>
          <div className="caseList">
            {filteredCases.map((item) => (
              <button key={item.id} type="button" className={`caseCard ${state.selectedCaseId === item.id ? "selected" : ""}`} onClick={() => selectCase(item.id)}>
                <div className="caseTop"><span>{item.id}</span><em data-risk={item.risk}>{item.risk}</em></div>
                <strong>{item.title}</strong><small>{item.domain}</small>
                <div className="caseMeta"><span>{item.version}</span><span>{item.evidenceCount} records</span><span>{item.openQuestions} gaps</span></div>
              </button>
            ))}
          </div>
        </aside>

        <div className="reviewCanvas">
          <section className="caseSummary panel">
            <div className="panelTitle"><div><span>Selected review</span><h2>{selectedCase.title}</h2></div><div className="statusStack"><b>{selectedCase.status}</b><small>{selectedCase.version}</small></div></div>
            <div className="summaryGrid">
              <article>
                <span>Purpose</span>
                <p>{selectedCase.purpose}</p>
              </article>
              <article>
                <span>Consequence-bearing action</span>
                <p>{selectedCase.action}</p>
              </article>
              <article>
                <span>Declared boundary</span>
                <p>{selectedCase.boundary}</p>
              </article>
              <article>
                <span>Submitted by</span>
                <p>{selectedCase.submittedBy}</p>
              </article>
            </div>
            <div className="summaryFooter"><span>Submitted {formatDate(selectedCase.submittedAt)}</span><span>{selectedCase.evidenceCount} evidence records</span><span>{selectedCase.openQuestions} unresolved questions</span></div>
          </section>

          <section className="determinationPanel panel">
            <div className="panelTitle"><div><span>Bounded recommendation</span><h2>Current review determination</h2></div><button type="button" className="helpButton" onClick={() => setIsPanelOpen((v) => !v)}>Decision guidance</button></div>
            <div className="determinationButtons">
              {(["ALLOW", "HOLD", "DENY", "ESCALATE", "NOT REVIEWED"] as Determination[]).map((item) => <button key={item} type="button" data-state={item} className={state.determination === item ? "active" : ""} onClick={() => setState((current) => ({ ...current, determination: item }))}>{item}</button>)}
            </div>
            <div className="confidenceRow"><span>Reviewer confidence</span>{(["Low", "Moderate", "High"] as Confidence[]).map((item) => <button key={item} type="button" className={state.confidence === item ? "active" : ""} onClick={() => setState((current) => ({ ...current, confidence: item }))}>{item}</button>)}</div>
            {isPanelOpen ? <div className="decisionGuide"><article><strong>ALLOW</strong><p>All required conditions are supported and bound within scope.</p></article><article><strong>HOLD</strong><p>A remediable condition remains unresolved; execution must not proceed yet.</p></article><article><strong>DENY</strong><p>The action is prohibited, materially unsupported, or outside a recoverable boundary.</p></article><article><strong>ESCALATE</strong><p>Authority, consequence, ambiguity, or conflict exceeds this reviewer’s scope.</p></article></div> : null}
            <label className="notesField"><span>Reviewer synthesis</span><textarea rows={6} value={state.reviewerNotes} onChange={(e) => setState((current) => ({ ...current, reviewerNotes: e.target.value }))} placeholder="Explain the supported determination, unresolved conditions, and exact revalidation boundary." /></label>
          </section>

          <section className="runtimePanel panel">
            <div className="panelTitle"><div><span>Complete runtime inspection</span><h2>Twenty-four-link review map</h2></div><div className="progressPill">{state.checkedLinks.length}/24 reviewed</div></div>
            <div className="progressTrack"><span style={{ width: `${metrics.completion}%` }} /></div>
            <div className="runtimeGrid">
              {runtimeLinks.map((link, index) => { const checked = state.checkedLinks.includes(index + 1); return (
                <button key={link.number} type="button" className={`runtimeCard ${checked ? "checked" : ""}`} onClick={() => toggleRuntimeLink(index + 1)}>
                  <span>{link.number}</span><div><strong>{link.name}</strong><p>{link.question}</p></div><b>{checked ? "Reviewed" : "Inspect"}</b>
                </button>
              ); })}
            </div>
          </section>

          <section className="findingComposer panel">
            <div className="panelTitle"><div><span>Preserved challenge</span><h2>Create a bounded finding</h2></div><small>A finding does not alter the source record.</small></div>
            <div className="formGrid two">
              <label><span>Category</span><select value={category} onChange={(e) => setCategory(e.target.value)}>{reviewCategories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
              <label><span>Severity</span><select value={severity} onChange={(e) => setSeverity(e.target.value as Severity)}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
            </div>
            <div className="categoryQuestion">{reviewCategories.find((item) => item.name === category)?.question}</div>
            <label><span>Finding summary</span><input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="State the defect precisely and without speculation." /></label>
            <label><span>Review rationale</span><textarea rows={6} value={rationale} onChange={(e) => setRationale(e.target.value)} placeholder="Explain what failed, why it matters, the consequence exposure, and what must be revalidated." /></label>
            <div className="formGrid two">
              <label><span>Evidence reference</span><input value={evidenceReference} onChange={(e) => setEvidenceReference(e.target.value)} placeholder="Record, version, hash, or citation" /></label>
              <label><span>Corrective-action owner</span><input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Named accountable role or person" /></label>
            </div>
            <label><span>Required corrective action</span><textarea rows={4} value={correctiveAction} onChange={(e) => setCorrectiveAction(e.target.value)} placeholder="Describe the evidence, authority, correction, or renewed test required for re-review." /></label>
            <div className="formGrid actionRow"><label><span>Due condition or date</span><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></label><button type="button" className="createButton" onClick={addFinding}>Preserve finding →</button></div>
          </section>

          <section className="findingsPanel panel">
            <div className="panelTitle"><div><span>Challenge record</span><h2>Findings and dispositions</h2></div><div className="filterGroup">{(["All", "Open", "Accepted", "Corrected", "Rejected", "Superseded"] as const).map((item) => <button key={item} type="button" className={findingFilter === item ? "active" : ""} onClick={() => setFindingFilter(item)}>{item}</button>)}</div></div>
            <div className="findingList">
              {visibleFindings.length ? visibleFindings.map((finding) => (
                <article key={finding.id} className="findingCard" data-severity={finding.severity}>
                  <div className="findingHeader"><div><span>{finding.id} · {finding.category}</span><h3>{finding.summary}</h3></div><div><b>{finding.severity}</b><em>{finding.disposition}</em></div></div>
                  <p>{finding.rationale}</p>
                  <div className="findingDetails"><span><b>Evidence</b>{finding.evidenceReference || "Not supplied"}</span><span><b>Owner</b>{finding.owner || "Unassigned"}</span><span><b>Due</b>{finding.dueDate || "Condition-based"}</span></div>
                  {finding.correctiveAction ? <div className="correctiveText"><strong>Required correction</strong><p>{finding.correctiveAction}</p></div> : null}
                  <div className="findingActions"><select value={finding.disposition} onChange={(e) => updateFinding(finding.id, e.target.value as Disposition)}><option>Open</option><option>Accepted</option><option>Corrected</option><option>Rejected</option><option>Superseded</option></select><span>Updated {formatDate(finding.updatedAt)}</span><button type="button" onClick={() => removeFinding(finding.id)}>Remove local item</button></div>
                </article>
              )) : <div className="emptyState"><strong>No findings in this view.</strong><p>Change the disposition filter or preserve a new challenge above.</p></div>}
            </div>
          </section>

          <section className="reviewStandards panel">
            <div className="panelTitle"><div><span>Institutional review standard</span><h2>Twenty-four operating principles</h2></div><div className="progressPill">{state.acknowledgedPrinciples.length}/24 acknowledged</div></div>
            <div className="principleGrid">
              {reviewPrinciples.map((principle, index) => { const active = state.acknowledgedPrinciples.includes(index + 1); return <button key={principle} type="button" className={active ? "acknowledged" : ""} onClick={() => setState((current) => ({ ...current, acknowledgedPrinciples: active ? current.acknowledgedPrinciples.filter((item) => item !== index + 1) : [...current.acknowledgedPrinciples, index + 1] }))}><span>{String(index + 1).padStart(2, "0")}</span><p>{principle}</p><b>{active ? "Acknowledged" : "Review"}</b></button>; })}
            </div>
          </section>

          <section className="connectionPanel panel">
            <div className="panelTitle"><div><span>Connected Academy systems</span><h2>Continue the governed learning route</h2></div></div>
            <div className="connectionGrid">
              <Link href='/academy/mission-control'><span>Connected system</span><strong>Mission Control</strong><p>Return to the operational view of progress, evidence, simulations, and credentials.</p><b>Open →</b></Link>
              <Link href='/academy/simulator'><span>Connected system</span><strong>Simulation Center</strong><p>Replay failed conditions and test the earliest failure before consequence occurs.</p><b>Open →</b></Link>
              <Link href='/academy/route-construction-lab'><span>Connected system</span><strong>Route Construction Lab</strong><p>Correct the governed route without erasing the original review record.</p><b>Open →</b></Link>
              <Link href='/academy/assessment'><span>Connected system</span><strong>Assessment Center</strong><p>Demonstrate bounded review competency under evaluated conditions.</p><b>Open →</b></Link>
              <Link href='/academy/credential-registry'><span>Connected system</span><strong>Credential Registry</strong><p>Inspect authorized competency events without duplicating the Exchange Registry.</p><b>Open →</b></Link>
              <Link href='/verification'><span>Connected system</span><strong>Exchange Verification</strong><p>Move authoritative verification activity back to the connected Exchange system.</p><b>Open →</b></Link>
            </div>
          </section>

          <section className="recordControl panel">
            <div><span>Local training record</span><h2>Preserve, export, or reset this workspace.</h2><p>This Academy page stores practice data locally in this browser. Export creates a portable review package; it does not certify, authorize, or publish the determination.</p></div>
            <div className="recordActions"><button type="button" onClick={exportReview}>Export JSON package</button><button type="button" onClick={() => importRef.current?.click()}>Import package</button><button type="button" className="dangerButton" onClick={resetWorkspace}>Reset local workspace</button></div>
          </section>
        </div>
      </section>

      <footer className="pageFooter"><div><strong>TA-14 Academy</strong><span>Seventh major door of the TA-14 AI Governance Exchange</span></div><p>No admissible evidence. No admissible execution.</p><Link href="/academy">Academy Home →</Link></footer>

      <style jsx>{`

        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
          background: #020a10;
        }

        :global(body) {
          margin: 0;
          background: #020a10;
          color: #edf8ff;
        }

        :global(button),
        :global(input),
        :global(textarea),
        :global(select) {
          font: inherit;
        }

        .reviewPage {
          --ink: #edf8ff;
          --muted: #8ea6b7;
          --line: rgba(119, 185, 211, 0.18);
          --panel: rgba(7, 24, 34, 0.86);
          --panel-strong: rgba(5, 20, 29, 0.96);
          --cyan: #58dff2;
          --mint: #41efad;
          --amber: #f5c75f;
          --red: #ff7487;
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 30px clamp(20px, 3.2vw, 58px) 70px;
          background:
            radial-gradient(circle at 15% 6%, rgba(30, 174, 184, 0.16), transparent 30%),
            radial-gradient(circle at 88% 14%, rgba(18, 107, 118, 0.18), transparent 32%),
            linear-gradient(180deg, #031019 0%, #020a10 48%, #01070b 100%);
        }

        .cosmos {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .starField {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(199, 245, 255, 0.72);
          box-shadow:
            85px 110px rgba(199, 245, 255, 0.28),
            220px 65px rgba(73, 226, 240, 0.35),
            390px 210px rgba(199, 245, 255, 0.24),
            560px 95px rgba(65, 239, 173, 0.26),
            760px 280px rgba(199, 245, 255, 0.2),
            940px 120px rgba(73, 226, 240, 0.28),
            1130px 350px rgba(199, 245, 255, 0.18),
            1320px 160px rgba(65, 239, 173, 0.22),
            1500px 430px rgba(199, 245, 255, 0.2);
          animation: drift 28s linear infinite;
        }

        .starField1 { left: 2%; top: 5%; }
        .starField2 { left: 12%; top: 22%; animation-duration: 36s; }
        .starField3 { left: 24%; top: 42%; animation-duration: 42s; }
        .starField4 { left: 40%; top: 10%; animation-duration: 31s; }
        .starField5 { left: 52%; top: 55%; animation-duration: 46s; }
        .starField6 { left: 64%; top: 30%; animation-duration: 38s; }
        .starField7 { left: 75%; top: 68%; animation-duration: 44s; }
        .starField8 { left: 88%; top: 18%; animation-duration: 34s; }

        .aurora {
          position: absolute;
          width: 620px;
          height: 620px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.1;
        }

        .auroraOne {
          left: -260px;
          top: 20%;
          background: #23d6df;
        }

        .auroraTwo {
          right: -300px;
          top: 7%;
          background: #1ee392;
        }

        .workspaceHeader,
        .principleBanner,
        .modeTabs,
        .metricGrid,
        .workspaceLayout,
        .notice,
        .pageFooter {
          position: relative;
          z-index: 1;
          width: min(1520px, 100%);
          margin-left: auto;
          margin-right: auto;
        }

        .workspaceHeader {
          display: flex;
          justify-content: space-between;
          gap: 28px;
          align-items: flex-end;
          padding: 18px 0 26px;
          border-bottom: 1px solid var(--line);
        }

        .kicker,
        .panelTitle span,
        .sectionHeading span,
        .recordControl span {
          margin: 0 0 8px;
          color: var(--mint);
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .workspaceHeader h1 {
          margin: 0;
          font-size: clamp(2.2rem, 5vw, 4.8rem);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .headerCopy {
          max-width: 830px;
          margin: 14px 0 0;
          color: #a9bdc9;
          line-height: 1.7;
          font-size: 1.03rem;
        }

        .headerActions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .quietButton,
        .primaryLink,
        .recordActions button {
          min-height: 44px;
          padding: 0 16px;
          border-radius: 12px;
          border: 1px solid var(--line);
          background: rgba(8, 29, 39, 0.78);
          color: var(--ink);
          font-weight: 800;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .primaryLink {
          border-color: rgba(65, 239, 173, 0.46);
          background: linear-gradient(135deg, rgba(65, 239, 173, 0.19), rgba(88, 223, 242, 0.12));
        }

        .notice {
          margin-top: 16px;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          border: 1px solid rgba(88, 223, 242, 0.35);
          border-radius: 12px;
          background: rgba(7, 36, 47, 0.92);
          color: #dffaff;
        }

        .notice button {
          border: 0;
          background: transparent;
          color: var(--cyan);
          font-weight: 800;
          cursor: pointer;
        }

        .principleBanner {
          margin-top: 22px;
          padding: 20px 22px;
          border: 1px solid rgba(65, 239, 173, 0.28);
          border-radius: 18px;
          background: linear-gradient(120deg, rgba(10, 45, 48, 0.9), rgba(5, 23, 32, 0.84));
          display: grid;
          grid-template-columns: minmax(280px, 0.8fr) 1.2fr;
          gap: 24px;
          align-items: center;
        }

        .principleBanner span {
          display: block;
          color: var(--mint);
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-weight: 900;
          font-size: 0.7rem;
          margin-bottom: 7px;
        }

        .principleBanner strong {
          font-size: 1.25rem;
        }

        .principleBanner p {
          margin: 0;
          color: #abc0cb;
          line-height: 1.65;
        }

        .modeTabs {
          margin-top: 18px;
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .modeTabs button,
        .riskFilters button,
        .filterGroup button,
        .confidenceRow button {
          border: 1px solid var(--line);
          background: rgba(4, 19, 27, 0.78);
          color: #9fb3c0;
          border-radius: 999px;
          padding: 9px 14px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }

        .modeTabs button.active,
        .riskFilters button.active,
        .filterGroup button.active,
        .confidenceRow button.active {
          border-color: rgba(88, 223, 242, 0.54);
          color: #edfdff;
          background: rgba(29, 143, 154, 0.18);
        }

        .metricGrid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .metricCard {
          min-height: 132px;
          padding: 17px;
          border: 1px solid var(--line);
          border-radius: 17px;
          background: linear-gradient(180deg, rgba(8, 29, 39, 0.92), rgba(4, 17, 24, 0.88));
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .metricCard span,
        .metricCard small {
          color: #8fa8b7;
        }

        .metricCard strong {
          font-size: 1.55rem;
          line-height: 1;
        }

        .workspaceLayout {
          display: grid;
          grid-template-columns: 330px minmax(0, 1fr);
          gap: 18px;
          align-items: start;
          margin-top: 18px;
        }

        .caseRail {
          position: sticky;
          top: 18px;
          max-height: calc(100vh - 36px);
          overflow: auto;
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: rgba(3, 15, 22, 0.95);
          scrollbar-width: thin;
        }

        .sectionHeading,
        .panelTitle {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .sectionHeading h2,
        .panelTitle h2,
        .recordControl h2 {
          margin: 0;
          font-size: 1.28rem;
          letter-spacing: -0.025em;
        }

        .sectionHeading b,
        .progressPill {
          min-width: 42px;
          min-height: 34px;
          padding: 0 11px;
          border-radius: 999px;
          background: rgba(88, 223, 242, 0.1);
          color: var(--cyan);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.78rem;
        }

        .searchField,
        .findingComposer label,
        .notesField {
          display: grid;
          gap: 7px;
          margin-top: 16px;
        }

        .searchField span,
        .findingComposer label > span,
        .notesField > span {
          color: #9bb0bd;
          font-size: 0.78rem;
          font-weight: 800;
        }

        input,
        textarea,
        select {
          width: 100%;
          border: 1px solid rgba(129, 190, 213, 0.22);
          border-radius: 11px;
          background: rgba(1, 12, 18, 0.88);
          color: var(--ink);
          padding: 12px 13px;
          outline: none;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: rgba(88, 223, 242, 0.65);
          box-shadow: 0 0 0 3px rgba(88, 223, 242, 0.08);
        }

        textarea {
          resize: vertical;
          line-height: 1.6;
        }

        .riskFilters,
        .filterGroup {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .riskFilters button,
        .filterGroup button {
          padding: 7px 10px;
          font-size: 0.72rem;
        }

        .caseList {
          display: grid;
          gap: 10px;
          margin-top: 15px;
        }

        .caseCard {
          width: 100%;
          padding: 15px;
          text-align: left;
          border: 1px solid rgba(124, 180, 201, 0.15);
          border-radius: 14px;
          background: rgba(8, 26, 35, 0.7);
          color: var(--ink);
          cursor: pointer;
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
        }

        .caseCard:hover {
          transform: translateY(-2px);
          border-color: rgba(88, 223, 242, 0.38);
        }

        .caseCard.selected {
          border-color: rgba(65, 239, 173, 0.46);
          background: linear-gradient(135deg, rgba(13, 58, 56, 0.78), rgba(7, 29, 39, 0.88));
          box-shadow: inset 3px 0 0 var(--mint);
        }

        .caseTop,
        .caseMeta,
        .summaryFooter,
        .findingActions {
          display: flex;
          justify-content: space-between;
          gap: 9px;
          flex-wrap: wrap;
          align-items: center;
        }

        .caseTop span,
        .caseMeta,
        .caseCard small {
          color: #819aa9;
          font-size: 0.72rem;
        }

        .caseTop em {
          font-style: normal;
          font-size: 0.66rem;
          font-weight: 900;
          padding: 4px 7px;
          border-radius: 999px;
          color: #dcecf3;
          background: rgba(255, 255, 255, 0.06);
        }

        .caseTop em[data-risk='Critical'] { color: #ffc0c8; background: rgba(255, 116, 135, 0.12); }
        .caseTop em[data-risk='High'] { color: #ffe2a2; background: rgba(245, 199, 95, 0.12); }
        .caseTop em[data-risk='Medium'] { color: #c9f8ff; background: rgba(88, 223, 242, 0.1); }

        .caseCard > strong {
          display: block;
          margin: 10px 0 5px;
          line-height: 1.35;
        }

        .caseMeta {
          margin-top: 12px;
          justify-content: flex-start;
        }

        .reviewCanvas {
          min-width: 0;
          display: grid;
          gap: 18px;
        }

        .panel {
          border: 1px solid var(--line);
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(8, 27, 37, 0.92), rgba(3, 15, 22, 0.94));
          padding: clamp(18px, 2vw, 26px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
        }

        .statusStack {
          text-align: right;
        }

        .statusStack b {
          display: block;
          color: var(--mint);
        }

        .statusStack small {
          color: #829aa8;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 20px;
        }

        .summaryGrid article {
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(120, 184, 208, 0.14);
          background: rgba(2, 14, 21, 0.66);
        }

        .summaryGrid span {
          color: #7892a1;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 900;
        }

        .summaryGrid p {
          color: #c6d7df;
          line-height: 1.6;
          margin: 9px 0 0;
        }

        .summaryFooter {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid var(--line);
          justify-content: flex-start;
          color: #839ca9;
          font-size: 0.78rem;
        }

        .summaryFooter span {
          padding-right: 12px;
          border-right: 1px solid var(--line);
        }

        .helpButton {
          border: 1px solid rgba(88, 223, 242, 0.26);
          background: rgba(88, 223, 242, 0.08);
          color: var(--cyan);
          border-radius: 10px;
          padding: 9px 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .determinationButtons {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
          margin-top: 20px;
        }

        .determinationButtons button {
          min-height: 68px;
          border-radius: 13px;
          border: 1px solid rgba(125, 183, 205, 0.17);
          background: rgba(2, 14, 20, 0.76);
          color: #8fa6b4;
          font-weight: 950;
          letter-spacing: 0.06em;
          cursor: pointer;
        }

        .determinationButtons button.active[data-state='ALLOW'] { color: #93ffd0; border-color: rgba(65, 239, 173, 0.6); background: rgba(65, 239, 173, 0.1); }
        .determinationButtons button.active[data-state='HOLD'] { color: #ffe2a2; border-color: rgba(245, 199, 95, 0.6); background: rgba(245, 199, 95, 0.1); }
        .determinationButtons button.active[data-state='DENY'] { color: #ffc0c8; border-color: rgba(255, 116, 135, 0.6); background: rgba(255, 116, 135, 0.1); }
        .determinationButtons button.active[data-state='ESCALATE'] { color: #b9eaff; border-color: rgba(88, 223, 242, 0.6); background: rgba(88, 223, 242, 0.1); }
        .determinationButtons button.active[data-state='NOT REVIEWED'] { color: #e4e9ed; border-color: rgba(224, 233, 237, 0.36); background: rgba(224, 233, 237, 0.07); }

        .confidenceRow {
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .confidenceRow > span {
          color: #8ca4b2;
          font-size: 0.78rem;
          font-weight: 800;
          margin-right: 4px;
        }

        .decisionGuide {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .decisionGuide article {
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: rgba(3, 16, 23, 0.75);
        }

        .decisionGuide strong {
          color: var(--cyan);
          font-size: 0.76rem;
        }

        .decisionGuide p {
          margin: 8px 0 0;
          color: #96acb9;
          line-height: 1.55;
          font-size: 0.82rem;
        }

        .progressTrack {
          height: 7px;
          margin-top: 18px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }

        .progressTrack span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--cyan), var(--mint));
          transition: width 220ms ease;
        }

        .runtimeGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 16px;
        }

        .runtimeCard {
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) auto;
          gap: 12px;
          align-items: start;
          padding: 14px;
          text-align: left;
          border: 1px solid rgba(124, 182, 204, 0.14);
          border-radius: 13px;
          background: rgba(2, 14, 20, 0.72);
          color: var(--ink);
          cursor: pointer;
        }

        .runtimeCard.checked {
          border-color: rgba(65, 239, 173, 0.35);
          background: rgba(17, 66, 57, 0.22);
        }

        .runtimeCard > span {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(88, 223, 242, 0.09);
          color: var(--cyan);
          font-weight: 950;
          font-size: 0.75rem;
        }

        .runtimeCard strong {
          font-size: 0.9rem;
        }

        .runtimeCard p {
          margin: 6px 0 0;
          color: #8da5b3;
          line-height: 1.45;
          font-size: 0.78rem;
        }

        .runtimeCard > b {
          font-size: 0.67rem;
          color: #78929f;
        }

        .runtimeCard.checked > b {
          color: var(--mint);
        }

        .formGrid {
          display: grid;
          gap: 12px;
        }

        .formGrid.two {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .categoryQuestion {
          margin-top: 12px;
          padding: 12px 14px;
          border-left: 3px solid var(--cyan);
          background: rgba(88, 223, 242, 0.06);
          color: #a9bec9;
          line-height: 1.55;
          font-size: 0.85rem;
        }

        .actionRow {
          grid-template-columns: minmax(220px, 0.5fr) minmax(240px, 0.5fr);
          align-items: end;
        }

        .createButton {
          min-height: 47px;
          border: 1px solid rgba(65, 239, 173, 0.55);
          border-radius: 11px;
          background: linear-gradient(135deg, rgba(65, 239, 173, 0.22), rgba(88, 223, 242, 0.14));
          color: #f0fffa;
          font-weight: 950;
          cursor: pointer;
        }

        .findingList {
          display: grid;
          gap: 12px;
          margin-top: 18px;
        }

        .findingCard {
          padding: 18px;
          border: 1px solid var(--line);
          border-left: 4px solid var(--cyan);
          border-radius: 14px;
          background: rgba(2, 14, 20, 0.72);
        }

        .findingCard[data-severity='Critical'] { border-left-color: var(--red); }
        .findingCard[data-severity='High'] { border-left-color: var(--amber); }
        .findingCard[data-severity='Medium'] { border-left-color: var(--cyan); }
        .findingCard[data-severity='Low'] { border-left-color: var(--mint); }

        .findingHeader {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .findingHeader span {
          color: #7f99a7;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 900;
        }

        .findingHeader h3 {
          margin: 7px 0 0;
          font-size: 1.08rem;
        }

        .findingHeader > div:last-child {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .findingHeader b,
        .findingHeader em {
          font-style: normal;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          font-size: 0.68rem;
        }

        .findingCard > p {
          color: #a9bdc7;
          line-height: 1.65;
        }

        .findingDetails {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .findingDetails span {
          padding: 12px;
          border: 1px solid rgba(118, 177, 198, 0.12);
          border-radius: 10px;
          color: #9db1bd;
          font-size: 0.8rem;
        }

        .findingDetails b {
          display: block;
          margin-bottom: 5px;
          color: #718b99;
          font-size: 0.67rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .correctiveText {
          margin-top: 10px;
          padding: 13px;
          border-radius: 10px;
          background: rgba(245, 199, 95, 0.06);
          border: 1px solid rgba(245, 199, 95, 0.14);
        }

        .correctiveText strong {
          color: var(--amber);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        .correctiveText p {
          margin: 7px 0 0;
          color: #b9c6cc;
          line-height: 1.55;
        }

        .findingActions {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--line);
          justify-content: flex-start;
        }

        .findingActions select {
          width: auto;
          min-width: 140px;
          padding: 8px 10px;
        }

        .findingActions span {
          color: #748d9a;
          font-size: 0.72rem;
        }

        .findingActions button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: #d98c98;
          cursor: pointer;
          font-size: 0.76rem;
        }

        .emptyState {
          padding: 36px;
          text-align: center;
          border: 1px dashed rgba(125, 183, 205, 0.2);
          border-radius: 13px;
        }

        .emptyState p {
          color: #829aa8;
        }

        .principleGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .principleGrid button {
          display: grid;
          grid-template-columns: 36px minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          text-align: left;
          padding: 14px;
          border: 1px solid rgba(124, 181, 203, 0.13);
          border-radius: 12px;
          background: rgba(2, 14, 20, 0.72);
          color: var(--ink);
          cursor: pointer;
        }

        .principleGrid button.acknowledged {
          border-color: rgba(65, 239, 173, 0.34);
          background: rgba(17, 66, 57, 0.22);
        }

        .principleGrid button > span {
          color: var(--cyan);
          font-weight: 950;
          font-size: 0.74rem;
        }

        .principleGrid p {
          margin: 0;
          color: #a7bac5;
          line-height: 1.5;
          font-size: 0.82rem;
        }

        .principleGrid b {
          color: #718a98;
          font-size: 0.67rem;
        }

        .principleGrid button.acknowledged b {
          color: var(--mint);
        }

        .connectionGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .connectionGrid a {
          min-height: 190px;
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: rgba(2, 14, 20, 0.7);
          text-decoration: none;
          color: var(--ink);
          display: flex;
          flex-direction: column;
          transition: transform 160ms ease, border-color 160ms ease;
        }

        .connectionGrid a:hover {
          transform: translateY(-3px);
          border-color: rgba(88, 223, 242, 0.42);
        }

        .connectionGrid span {
          color: var(--mint);
          text-transform: uppercase;
          letter-spacing: 0.11em;
          font-size: 0.68rem;
          font-weight: 900;
        }

        .connectionGrid strong {
          margin-top: 14px;
          font-size: 1.05rem;
        }

        .connectionGrid p {
          color: #8fa6b3;
          line-height: 1.55;
          font-size: 0.82rem;
        }

        .connectionGrid b {
          margin-top: auto;
          color: var(--cyan);
          font-size: 0.78rem;
        }

        .recordControl {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) auto;
          gap: 24px;
          align-items: center;
        }

        .recordControl p {
          color: #8ea5b2;
          line-height: 1.6;
          margin-bottom: 0;
        }

        .recordActions {
          display: grid;
          gap: 9px;
          min-width: 230px;
        }

        .recordActions .dangerButton {
          border-color: rgba(255, 116, 135, 0.25);
          color: #ffb3be;
        }

        .pageFooter {
          margin-top: 24px;
          padding-top: 22px;
          border-top: 1px solid var(--line);
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 20px;
          align-items: center;
          color: #8098a6;
          font-size: 0.82rem;
        }

        .pageFooter strong,
        .pageFooter span {
          display: block;
        }

        .pageFooter strong {
          color: #dcecf3;
          margin-bottom: 4px;
        }

        .pageFooter p {
          color: var(--mint);
          font-weight: 800;
        }

        .pageFooter a {
          color: var(--cyan);
          text-decoration: none;
          font-weight: 850;
        }

        @keyframes drift {
          from { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(24px, -18px, 0); }
          to { transform: translate3d(0, 0, 0); }
        }

        @media (max-width: 1260px) {
          .metricGrid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .workspaceLayout {
            grid-template-columns: 290px minmax(0, 1fr);
          }

          .determinationButtons {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .connectionGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 980px) {
          .workspaceHeader,
          .principleBanner,
          .recordControl {
            grid-template-columns: 1fr;
            display: grid;
          }

          .workspaceHeader {
            align-items: start;
          }

          .headerActions {
            justify-content: flex-start;
          }

          .workspaceLayout {
            grid-template-columns: 1fr;
          }

          .caseRail {
            position: relative;
            top: auto;
            max-height: none;
          }

          .caseList {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .runtimeGrid,
          .principleGrid {
            grid-template-columns: 1fr;
          }

          .decisionGuide {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .recordActions {
            min-width: 0;
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .reviewPage {
            padding: 18px 14px 48px;
          }

          .metricGrid,
          .summaryGrid,
          .caseList,
          .formGrid.two,
          .actionRow,
          .findingDetails,
          .connectionGrid,
          .recordActions,
          .decisionGuide {
            grid-template-columns: 1fr;
          }

          .metricGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .determinationButtons {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .findingHeader,
          .panelTitle,
          .pageFooter {
            display: grid;
            grid-template-columns: 1fr;
          }

          .statusStack {
            text-align: left;
          }

          .runtimeCard,
          .principleGrid button {
            grid-template-columns: 36px minmax(0, 1fr);
          }

          .runtimeCard > b,
          .principleGrid b {
            grid-column: 2;
          }

          .findingActions button {
            margin-left: 0;
          }
        }

        @media (min-width: 1500px) {
          .workspaceLayout {
            grid-template-columns: 350px minmax(0, 1fr);
          }

          .runtimeGrid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .principleGrid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .connectionGrid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media print {
          :global(body) {
            background: #ffffff;
            color: #111111;
          }

          .reviewPage {
            padding: 0;
            background: #ffffff;
            color: #111111;
          }

          .cosmos,
          .modeTabs,
          .headerActions,
          .caseRail,
          .notice,
          .findingComposer,
          .connectionPanel,
          .recordControl,
          .pageFooter {
            display: none !important;
          }

          .workspaceHeader,
          .principleBanner,
          .metricGrid,
          .workspaceLayout {
            width: 100%;
            max-width: none;
          }

          .workspaceLayout {
            display: block;
          }

          .reviewCanvas {
            display: block;
          }

          .panel {
            break-inside: avoid;
            margin: 0 0 18px;
            border: 1px solid #cccccc;
            background: #ffffff;
            box-shadow: none;
            color: #111111;
          }

          .panel *,
          .workspaceHeader *,
          .principleBanner * {
            color: #111111 !important;
          }

          .runtimeGrid,
          .principleGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .runtimeCard,
          .principleGrid button,
          .findingCard,
          .summaryGrid article {
            background: #ffffff;
            border-color: #cccccc;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
