"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Tab = "overview" | "institutions" | "reviews" | "findings" | "standards";
type AccreditationState = "APPLICANT" | "UNDER_REVIEW" | "CONDITIONAL" | "ACCREDITED" | "RENEWAL_DUE" | "SUSPENDED";
type ReviewState = "PLANNED" | "EVIDENCE_OPEN" | "PANEL_REVIEW" | "DECISION_PENDING" | "COMPLETE";
type FindingState = "OPEN" | "CORRECTIVE_ACTION" | "VERIFICATION" | "CLOSED";
type Severity = "CRITICAL" | "MAJOR" | "MINOR" | "OBSERVATION";

type Institution = {
  id: string;
  name: string;
  jurisdiction: string;
  program: string;
  state: AccreditationState;
  readiness: number;
  evidenceComplete: number;
  leadReviewer: string;
  nextMilestone: string;
  validThrough: string;
};

type Review = {
  id: string;
  institutionId: string;
  title: string;
  cycle: string;
  state: ReviewState;
  opened: string;
  due: string;
  panel: string[];
  evidenceItems: number;
  verifiedItems: number;
};

type Finding = {
  id: string;
  institutionId: string;
  standard: string;
  title: string;
  severity: Severity;
  state: FindingState;
  owner: string;
  due: string;
  correctiveAction: string;
};

type Standard = {
  id: string;
  code: string;
  title: string;
  principle: string;
  evidence: string[];
  mandatory: boolean;
};

type PersistedState = {
  tab: Tab;
  institutionSearch: string;
  institutionFilter: "ALL" | AccreditationState;
  selectedInstitutionId: string;
  selectedReviewId: string;
  selectedFindingId: string;
  institutions: Institution[];
  reviews: Review[];
  findings: Finding[];
};

const STORAGE_KEY = "ta14-academy-accreditation-center-v1";

const initialInstitutions: Institution[] = [
  { id: "inst-001", name: "Northstar Governance Institute", jurisdiction: "United States", program: "Applied Route Reviewer", state: "UNDER_REVIEW", readiness: 86, evidenceComplete: 91, leadReviewer: "A. Rivera", nextMilestone: "Panel review — Aug 12, 2026", validThrough: "Pending" },
  { id: "inst-002", name: "Civic Systems Academy", jurisdiction: "Canada", program: "Governance Route Author", state: "CONDITIONAL", readiness: 78, evidenceComplete: 83, leadReviewer: "M. Okafor", nextMilestone: "Corrective action verification", validThrough: "Dec 18, 2026" },
  { id: "inst-003", name: "Harborline Professional College", jurisdiction: "United States", program: "Applied Route Reviewer", state: "ACCREDITED", readiness: 96, evidenceComplete: 100, leadReviewer: "S. Lind", nextMilestone: "Annual surveillance — Nov 4, 2026", validThrough: "May 31, 2028" },
  { id: "inst-004", name: "Meridian Exchange School", jurisdiction: "United Kingdom", program: "Runtime Governance Steward", state: "APPLICANT", readiness: 42, evidenceComplete: 37, leadReviewer: "Unassigned", nextMilestone: "Application completeness review", validThrough: "Pending" },
  { id: "inst-005", name: "Axis Public Services Institute", jurisdiction: "Australia", program: "Governance Route Author", state: "RENEWAL_DUE", readiness: 89, evidenceComplete: 76, leadReviewer: "J. Bell", nextMilestone: "Renewal evidence due — Sep 2, 2026", validThrough: "Oct 15, 2026" },
];

const initialReviews: Review[] = [
  { id: "review-771", institutionId: "inst-001", title: "Initial institutional accreditation", cycle: "2026 initial", state: "PANEL_REVIEW", opened: "2026-06-18", due: "2026-08-12", panel: ["A. Rivera", "S. Lind", "J. Bell"], evidenceItems: 64, verifiedItems: 58 },
  { id: "review-772", institutionId: "inst-002", title: "Conditional accreditation follow-up", cycle: "2026 corrective", state: "EVIDENCE_OPEN", opened: "2026-07-10", due: "2026-08-28", panel: ["M. Okafor", "P. Shah"], evidenceItems: 31, verifiedItems: 22 },
  { id: "review-773", institutionId: "inst-003", title: "Annual surveillance review", cycle: "2026 surveillance", state: "PLANNED", opened: "2026-11-04", due: "2026-11-20", panel: ["S. Lind"], evidenceItems: 18, verifiedItems: 0 },
  { id: "review-774", institutionId: "inst-005", title: "Accreditation renewal", cycle: "2026 renewal", state: "EVIDENCE_OPEN", opened: "2026-07-21", due: "2026-09-02", panel: ["J. Bell", "A. Grant"], evidenceItems: 48, verifiedItems: 35 },
];

const initialFindings: Finding[] = [
  { id: "finding-101", institutionId: "inst-002", standard: "AC-04", title: "Instructor authorization records are incomplete", severity: "MAJOR", state: "CORRECTIVE_ACTION", owner: "Elena Morales", due: "2026-08-18", correctiveAction: "Reconcile instructor roster with current authorization evidence and preserve approval history." },
  { id: "finding-102", institutionId: "inst-002", standard: "AC-07", title: "Appeal process lacks independent reviewer assignment", severity: "MAJOR", state: "VERIFICATION", owner: "D. Clarke", due: "2026-08-09", correctiveAction: "Deploy independent assignment control and submit three test records." },
  { id: "finding-103", institutionId: "inst-001", standard: "AC-03", title: "One course version lacks preserved effective date", severity: "MINOR", state: "OPEN", owner: "Maya Chen", due: "2026-08-06", correctiveAction: "Attach the governing approval record and effective-date declaration." },
  { id: "finding-104", institutionId: "inst-005", standard: "AC-06", title: "Renewal sample contains two expired assessor credentials", severity: "CRITICAL", state: "CORRECTIVE_ACTION", owner: "Priya Shah", due: "2026-08-03", correctiveAction: "Suspend affected assessment authority, reassign review, and preserve revalidation evidence." },
];

const standards: Standard[] = [
  { id: "std-1", code: "AC-01", title: "Institutional authority", principle: "The institution must establish and preserve the authority under which accredited instruction, assessment, and credential recommendations occur.", evidence: ["Charter or legal authority", "Governance appointments", "Delegation boundaries"], mandatory: true },
  { id: "std-2", code: "AC-02", title: "Program correspondence", principle: "The delivered program must correspond to the approved Academy program, version, competencies, and governing boundaries.", evidence: ["Approved curriculum map", "Version history", "Change approvals"], mandatory: true },
  { id: "std-3", code: "AC-03", title: "Controlled learning records", principle: "Learning records must be attributable, reviewable, versioned, and preserved without overstating what occurred.", evidence: ["Enrollment records", "Completion evidence", "Version and effective dates"], mandatory: true },
  { id: "std-4", code: "AC-04", title: "Qualified instructors", principle: "Instruction may only be delivered by personnel whose competence and authority are current for the assigned program.", evidence: ["Instructor qualifications", "Authorization records", "Continuing competence"], mandatory: true },
  { id: "std-5", code: "AC-05", title: "Assessment integrity", principle: "Assessment must preserve identity, conditions, scoring integrity, challengeability, and separation of incompatible roles.", evidence: ["Assessment controls", "Scoring records", "Conflict controls"], mandatory: true },
  { id: "std-6", code: "AC-06", title: "Credential recommendation", principle: "An institution may recommend a credential only after every required condition has been verified and unresolved conditions have been exposed.", evidence: ["Eligibility review", "Final determination", "Recommendation record"], mandatory: true },
  { id: "std-7", code: "AC-07", title: "Challenge and appeal", principle: "Learners and affected parties must have access to a bounded, independent, and preserved challenge process.", evidence: ["Appeal procedure", "Independent assignment", "Disposition records"], mandatory: true },
  { id: "std-8", code: "AC-08", title: "Ongoing surveillance", principle: "Accreditation remains conditional on continued correspondence, current authority, and successful surveillance.", evidence: ["Annual return", "Material change notices", "Surveillance findings"], mandatory: true },
];

const stateTone: Record<AccreditationState, string> = {
  APPLICANT: "#93c5fd", UNDER_REVIEW: "#fbbf24", CONDITIONAL: "#fb923c", ACCREDITED: "#34d399", RENEWAL_DUE: "#c084fc", SUSPENDED: "#f87171",
};
const severityTone: Record<Severity, string> = { CRITICAL: "#f87171", MAJOR: "#fb923c", MINOR: "#fbbf24", OBSERVATION: "#93c5fd" };

export default function AccreditationCenterPage() {
  const [state, setState] = useState<PersistedState>({
    tab: "overview",
    institutionSearch: "",
    institutionFilter: "ALL",
    selectedInstitutionId: initialInstitutions[0].id,
    selectedReviewId: initialReviews[0].id,
    selectedFindingId: initialFindings[0].id,
    institutions: initialInstitutions,
    reviews: initialReviews,
    findings: initialFindings,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState((previous) => ({ ...previous, ...JSON.parse(raw) }));
    } catch { /* preserve defaults */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  const selectedInstitution = state.institutions.find((item) => item.id === state.selectedInstitutionId) ?? state.institutions[0];
  const selectedReview = state.reviews.find((item) => item.id === state.selectedReviewId) ?? state.reviews[0];
  const selectedFinding = state.findings.find((item) => item.id === state.selectedFindingId) ?? state.findings[0];

  const filteredInstitutions = useMemo(() => state.institutions.filter((item) => {
    const matchesSearch = `${item.name} ${item.jurisdiction} ${item.program}`.toLowerCase().includes(state.institutionSearch.toLowerCase());
    return matchesSearch && (state.institutionFilter === "ALL" || item.state === state.institutionFilter);
  }), [state.institutions, state.institutionSearch, state.institutionFilter]);

  const metrics = useMemo(() => ({
    accredited: state.institutions.filter((item) => item.state === "ACCREDITED").length,
    activeReviews: state.reviews.filter((item) => item.state !== "COMPLETE" && item.state !== "PLANNED").length,
    openFindings: state.findings.filter((item) => item.state !== "CLOSED").length,
    averageReadiness: Math.round(state.institutions.reduce((sum, item) => sum + item.readiness, 0) / state.institutions.length),
  }), [state.institutions, state.reviews, state.findings]);

  function patchFinding(patch: Partial<Finding>) {
    setState((previous) => ({ ...previous, findings: previous.findings.map((item) => item.id === selectedFinding.id ? { ...item, ...patch } : item) }));
  }

  function resetWorkspace() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <div>
          <Link href="/academy" className="eyebrow">TA-14 Academy</Link>
          <h1>Accreditation Center</h1>
          <p>Govern institutional approval, surveillance, corrective action, and renewal without confusing recognition with permanent authority.</p>
        </div>
        <div className="header-actions">
          <button onClick={() => window.print()}>Export review</button>
          <Link href="/academy/instructor-console" className="primary-link">Instructor Console</Link>
        </div>
      </header>

      <section className="boundary">
        <strong>Accreditation boundary</strong>
        <span>Accreditation recognizes current institutional correspondence. It does not transfer TA-14 credential authority, excuse future revalidation, or make every institutional execution admissible.</span>
      </section>

      <nav className="tabs" aria-label="Accreditation sections">
        {(["overview", "institutions", "reviews", "findings", "standards"] as Tab[]).map((tab) => (
          <button key={tab} className={state.tab === tab ? "active" : ""} onClick={() => setState((previous) => ({ ...previous, tab }))}>{tab.replaceAll("_", " ")}</button>
        ))}
      </nav>

      {state.tab === "overview" && <>
        <section className="metrics">
          <Metric label="Accredited institutions" value={metrics.accredited} note="Current recognition" />
          <Metric label="Active reviews" value={metrics.activeReviews} note="Evidence or panel stage" />
          <Metric label="Open findings" value={metrics.openFindings} note="Require disposition" />
          <Metric label="Average readiness" value={`${metrics.averageReadiness}%`} note="Across current portfolio" />
        </section>
        <section className="grid-two">
          <article className="panel">
            <PanelTitle title="Accreditation portfolio" subtitle="Current institutional standing and readiness" />
            <div className="institution-list">
              {state.institutions.map((item) => <button key={item.id} className={`institution-row ${selectedInstitution.id === item.id ? "selected" : ""}`} onClick={() => setState((previous) => ({ ...previous, selectedInstitutionId: item.id }))}>
                <div><strong>{item.name}</strong><span>{item.program} · {item.jurisdiction}</span></div>
                <div className="row-end"><StatusPill label={item.state} tone={stateTone[item.state]} /><b>{item.readiness}%</b></div>
              </button>)}
            </div>
          </article>
          <article className="panel detail-card">
            <PanelTitle title={selectedInstitution.name} subtitle={selectedInstitution.program} />
            <div className="score-ring" style={{ "--score": `${selectedInstitution.readiness * 3.6}deg` } as React.CSSProperties}><div><strong>{selectedInstitution.readiness}%</strong><span>readiness</span></div></div>
            <dl className="detail-list">
              <div><dt>Standing</dt><dd><StatusPill label={selectedInstitution.state} tone={stateTone[selectedInstitution.state]} /></dd></div>
              <div><dt>Evidence complete</dt><dd>{selectedInstitution.evidenceComplete}%</dd></div>
              <div><dt>Lead reviewer</dt><dd>{selectedInstitution.leadReviewer}</dd></div>
              <div><dt>Next milestone</dt><dd>{selectedInstitution.nextMilestone}</dd></div>
              <div><dt>Valid through</dt><dd>{selectedInstitution.validThrough}</dd></div>
            </dl>
          </article>
        </section>
      </>}

      {state.tab === "institutions" && <section className="panel">
        <PanelTitle title="Institution registry" subtitle="Search, compare, and open the current institutional record" />
        <div className="filters"><input value={state.institutionSearch} onChange={(event) => setState((previous) => ({ ...previous, institutionSearch: event.target.value }))} placeholder="Search institution, jurisdiction, or program" /><select value={state.institutionFilter} onChange={(event) => setState((previous) => ({ ...previous, institutionFilter: event.target.value as PersistedState["institutionFilter"] }))}><option value="ALL">All states</option>{Object.keys(stateTone).map((value) => <option key={value}>{value}</option>)}</select></div>
        <div className="table-wrap"><table><thead><tr><th>Institution</th><th>Program</th><th>Standing</th><th>Readiness</th><th>Evidence</th><th>Next milestone</th></tr></thead><tbody>{filteredInstitutions.map((item) => <tr key={item.id} onClick={() => setState((previous) => ({ ...previous, selectedInstitutionId: item.id }))}><td><strong>{item.name}</strong><small>{item.jurisdiction}</small></td><td>{item.program}</td><td><StatusPill label={item.state} tone={stateTone[item.state]} /></td><td>{item.readiness}%</td><td>{item.evidenceComplete}%</td><td>{item.nextMilestone}</td></tr>)}</tbody></table></div>
      </section>}

      {state.tab === "reviews" && <section className="grid-two">
        <article className="panel"><PanelTitle title="Review cycles" subtitle="Open evidence, panel, surveillance, and renewal reviews" />{state.reviews.map((review) => <button key={review.id} className={`review-card ${selectedReview.id === review.id ? "selected" : ""}`} onClick={() => setState((previous) => ({ ...previous, selectedReviewId: review.id }))}><div><strong>{review.title}</strong><span>{state.institutions.find((item) => item.id === review.institutionId)?.name}</span></div><StatusPill label={review.state} tone="#93c5fd" /></button>)}</article>
        <article className="panel"><PanelTitle title={selectedReview.title} subtitle={selectedReview.cycle} /><Progress label="Evidence verification" value={Math.round((selectedReview.verifiedItems / selectedReview.evidenceItems) * 100)} /><dl className="detail-list"><div><dt>State</dt><dd>{selectedReview.state}</dd></div><div><dt>Opened</dt><dd>{selectedReview.opened}</dd></div><div><dt>Due</dt><dd>{selectedReview.due}</dd></div><div><dt>Panel</dt><dd>{selectedReview.panel.join(", ")}</dd></div><div><dt>Evidence</dt><dd>{selectedReview.verifiedItems} of {selectedReview.evidenceItems} verified</dd></div></dl><div className="decision-box"><strong>Decision gate</strong><p>A final accreditation decision remains unavailable until required evidence is verified, panel authority is current, findings are dispositioned, and the record is preserved.</p></div></article>
      </section>}

      {state.tab === "findings" && <section className="grid-two">
        <article className="panel"><PanelTitle title="Findings register" subtitle="Deficiencies, observations, corrective actions, and verification" />{state.findings.map((finding) => <button key={finding.id} className={`finding-card ${selectedFinding.id === finding.id ? "selected" : ""}`} onClick={() => setState((previous) => ({ ...previous, selectedFindingId: finding.id }))}><div><span className="code">{finding.standard}</span><strong>{finding.title}</strong><small>{state.institutions.find((item) => item.id === finding.institutionId)?.name}</small></div><StatusPill label={finding.severity} tone={severityTone[finding.severity]} /></button>)}</article>
        <article className="panel"><PanelTitle title={selectedFinding.title} subtitle={`${selectedFinding.standard} · ${selectedFinding.severity}`} /><label className="field">Finding state<select value={selectedFinding.state} onChange={(event) => patchFinding({ state: event.target.value as FindingState })}>{["OPEN", "CORRECTIVE_ACTION", "VERIFICATION", "CLOSED"].map((value) => <option key={value}>{value}</option>)}</select></label><label className="field">Owner<input value={selectedFinding.owner} onChange={(event) => patchFinding({ owner: event.target.value })} /></label><label className="field">Due date<input type="date" value={selectedFinding.due} onChange={(event) => patchFinding({ due: event.target.value })} /></label><label className="field">Corrective action<textarea rows={7} value={selectedFinding.correctiveAction} onChange={(event) => patchFinding({ correctiveAction: event.target.value })} /></label><div className="decision-box"><strong>Closure condition</strong><p>A finding is not closed because an action was promised. Closure requires evidence that the action occurred, the deficiency was corrected, and an authorized reviewer verified the result.</p></div></article>
      </section>}

      {state.tab === "standards" && <section className="standards-grid">{standards.map((standard) => <article key={standard.id} className="panel standard-card"><div className="standard-head"><span className="code">{standard.code}</span><StatusPill label={standard.mandatory ? "MANDATORY" : "GUIDANCE"} tone={standard.mandatory ? "#34d399" : "#93c5fd"} /></div><h2>{standard.title}</h2><p>{standard.principle}</p><h3>Expected evidence</h3><ul>{standard.evidence.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</section>}

      <footer><span>Local workspace preservation enabled · {loaded ? "Ready" : "Loading"}</span><button onClick={resetWorkspace}>Reset sample workspace</button></footer>

      <style jsx>{`
        :global(*){box-sizing:border-box} :global(body){margin:0;background:#060912;color:#e8edf7;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.page-shell{min-height:100vh;padding:34px clamp(18px,4vw,64px) 48px;position:relative;overflow:hidden;background:radial-gradient(circle at 20% 0%,rgba(45,89,180,.16),transparent 34%),radial-gradient(circle at 85% 12%,rgba(22,163,120,.11),transparent 28%),linear-gradient(180deg,#070b14,#05070d 60%,#070a12)}.ambient{position:absolute;border-radius:999px;filter:blur(80px);opacity:.18;pointer-events:none}.ambient-one{width:360px;height:360px;background:#2b6fff;top:-160px;left:-100px}.ambient-two{width:300px;height:300px;background:#18b77a;right:-130px;top:240px}.topbar{display:flex;justify-content:space-between;gap:28px;align-items:flex-start;position:relative;z-index:1;max-width:1500px;margin:auto}.eyebrow{color:#74a7ff;text-transform:uppercase;letter-spacing:.18em;font-size:12px;text-decoration:none;font-weight:800}.topbar h1{font-size:clamp(34px,5vw,68px);line-height:.98;margin:14px 0 14px;letter-spacing:-.045em}.topbar p{max-width:790px;color:#9ba9bd;font-size:16px;line-height:1.7;margin:0}.header-actions{display:flex;gap:10px;flex-wrap:wrap}.header-actions button,.primary-link,footer button{border:1px solid #27334a;background:#111827;color:#dfe7f5;padding:11px 15px;border-radius:11px;text-decoration:none;font-weight:700;cursor:pointer}.primary-link{background:#e9efff;color:#09111f;border-color:#e9efff}.boundary{max-width:1500px;margin:28px auto 18px;border:1px solid rgba(251,191,36,.27);background:rgba(251,191,36,.07);padding:15px 18px;border-radius:14px;display:flex;gap:16px;align-items:flex-start;position:relative;z-index:1}.boundary strong{color:#fcd76b;white-space:nowrap}.boundary span{color:#c8bfa1;line-height:1.55}.tabs{max-width:1500px;margin:0 auto 20px;display:flex;gap:8px;flex-wrap:wrap;position:relative;z-index:1}.tabs button{border:1px solid #202b3e;background:#0b111d;color:#8290a6;border-radius:999px;padding:10px 16px;text-transform:capitalize;cursor:pointer;font-weight:750}.tabs button.active{color:#06101f;background:#dce8ff;border-color:#dce8ff}.metrics,.grid-two,.standards-grid{max-width:1500px;margin:0 auto 20px;display:grid;gap:16px;position:relative;z-index:1}.metrics{grid-template-columns:repeat(4,1fr)}.grid-two{grid-template-columns:minmax(0,1.2fr) minmax(340px,.8fr)}.standards-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.metric,.panel{border:1px solid rgba(105,126,159,.22);background:linear-gradient(180deg,rgba(15,22,36,.92),rgba(9,14,24,.92));box-shadow:0 18px 55px rgba(0,0,0,.22);border-radius:18px}.metric{padding:20px}.metric span,.metric small{display:block;color:#8290a6}.metric strong{display:block;font-size:32px;margin:8px 0 4px}.panel{padding:22px;min-width:0}.panel-title{display:flex;justify-content:space-between;gap:15px;align-items:flex-start;margin-bottom:18px}.panel-title h2{font-size:19px;margin:0 0 4px}.panel-title p{color:#7f8ba0;margin:0;font-size:13px}.institution-list{display:grid;gap:9px}.institution-row,.review-card,.finding-card{width:100%;border:1px solid #1e293b;background:#0a101b;color:inherit;border-radius:13px;padding:14px;text-align:left;display:flex;justify-content:space-between;gap:14px;align-items:center;cursor:pointer}.institution-row.selected,.review-card.selected,.finding-card.selected{border-color:#5c8ee6;background:#0e1a2e}.institution-row span,.review-card span,.finding-card small{display:block;color:#8290a6;font-size:12px;margin-top:5px}.row-end{display:flex;align-items:center;gap:12px}.status-pill{display:inline-flex;border:1px solid;padding:5px 8px;border-radius:999px;font-size:10px;font-weight:850;letter-spacing:.05em;white-space:nowrap}.detail-card{text-align:center}.score-ring{--score:0deg;width:148px;height:148px;border-radius:50%;margin:6px auto 22px;background:conic-gradient(#5c8ee6 var(--score),#172033 0);display:grid;place-items:center}.score-ring:before{content:"";position:absolute}.score-ring>div{width:116px;height:116px;border-radius:50%;background:#0b111d;display:grid;place-content:center}.score-ring strong{font-size:29px}.score-ring span{color:#8290a6;font-size:12px}.detail-list{margin:0;display:grid;gap:0;text-align:left}.detail-list div{display:grid;grid-template-columns:140px 1fr;gap:12px;padding:12px 0;border-top:1px solid #1b2434}.detail-list dt{color:#7f8ba0}.detail-list dd{margin:0;color:#d8e0ec}.filters{display:grid;grid-template-columns:1fr 220px;gap:10px;margin-bottom:15px}input,select,textarea{width:100%;background:#080e18;color:#dce5f3;border:1px solid #263247;border-radius:10px;padding:11px 12px;font:inherit}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:900px}th{text-align:left;color:#738198;font-size:11px;text-transform:uppercase;letter-spacing:.08em;padding:11px;border-bottom:1px solid #263247}td{padding:13px 11px;border-bottom:1px solid #172132;color:#cbd5e5}td small{display:block;color:#738198;margin-top:4px}tbody tr{cursor:pointer}tbody tr:hover{background:#0c1422}.review-card,.finding-card{margin-bottom:9px}.finding-card>div:first-child{max-width:78%}.code{display:inline-flex;background:#152239;color:#8eb4f8;border:1px solid #2a4167;border-radius:7px;padding:4px 7px;font-size:10px;font-weight:850;margin-right:8px}.progress-wrap{margin:18px 0}.progress-label{display:flex;justify-content:space-between;color:#93a0b4;font-size:13px;margin-bottom:8px}.progress-track{height:9px;background:#172033;border-radius:999px;overflow:hidden}.progress-fill{height:100%;background:linear-gradient(90deg,#4f83db,#35c48d);border-radius:999px}.decision-box{border:1px solid #2b3e5c;background:#0b1525;border-radius:13px;padding:15px;margin-top:17px;text-align:left}.decision-box strong{color:#9dc0ff}.decision-box p{color:#8f9db1;line-height:1.55;margin:7px 0 0}.field{display:block;color:#8694a9;font-size:12px;margin-bottom:13px}.field input,.field select,.field textarea{margin-top:7px}.standard-card h2{font-size:19px;margin:14px 0 8px}.standard-card p{color:#9aa8ba;line-height:1.65}.standard-card h3{font-size:12px;color:#7790b6;text-transform:uppercase;letter-spacing:.08em;margin-top:20px}.standard-card ul{padding-left:20px;color:#c6d0de;line-height:1.8}.standard-head{display:flex;justify-content:space-between}footer{max-width:1500px;margin:18px auto 0;display:flex;justify-content:space-between;gap:14px;align-items:center;color:#64748b;font-size:12px;position:relative;z-index:1}@media(max-width:1000px){.metrics{grid-template-columns:repeat(2,1fr)}.grid-two,.standards-grid{grid-template-columns:1fr}.topbar{flex-direction:column}.header-actions{width:100%}}@media(max-width:640px){.page-shell{padding:24px 14px 34px}.metrics{grid-template-columns:1fr}.boundary{flex-direction:column;gap:7px}.filters{grid-template-columns:1fr}.institution-row{align-items:flex-start}.row-end{flex-direction:column;align-items:flex-end}.detail-list div{grid-template-columns:1fr}.topbar h1{font-size:42px}footer{align-items:flex-start;flex-direction:column}}
      `}</style>
    </main>
  );
}

function Metric({ label, value, note }: { label: string; value: string | number; note: string }) {
  return <article className="metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
}
function PanelTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="panel-title"><div><h2>{title}</h2><p>{subtitle}</p></div></div>;
}
function StatusPill({ label, tone }: { label: string; tone: string }) {
  return <span className="status-pill" style={{ color: tone, borderColor: `${tone}55`, background: `${tone}12` }}>{label.replaceAll("_", " ")}</span>;
}
function Progress({ label, value }: { label: string; value: number }) {
  return <div className="progress-wrap"><div className="progress-label"><span>{label}</span><strong>{value}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${value}%` }} /></div></div>;
}
