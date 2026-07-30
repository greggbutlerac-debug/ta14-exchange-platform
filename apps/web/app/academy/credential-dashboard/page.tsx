"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CredentialState = "VERIFIED" | "IN_PROGRESS" | "RENEWAL_DUE" | "SUSPENDED";
type ActivityState = "COMPLETE" | "ACTIVE" | "NOT_STARTED";
type EvidenceState = "ACCEPTED" | "PENDING" | "EXPIRED";
type Tab = "overview" | "credentials" | "transcript" | "competencies" | "verification";

type Credential = {
  id: string;
  title: string;
  kind: string;
  state: CredentialState;
  issuedOn: string;
  expiresOn: string;
  progress: number;
  version: string;
  issuer: string;
  description: string;
  competencies: string[];
  requirements: Requirement[];
  evidence: EvidenceItem[];
};

type Requirement = {
  id: string;
  label: string;
  state: ActivityState;
  detail: string;
};

type EvidenceItem = {
  id: string;
  label: string;
  state: EvidenceState;
  recordedOn: string;
  source: string;
};

type TranscriptRow = {
  id: string;
  title: string;
  category: string;
  state: ActivityState;
  score: number | null;
  completedOn: string | null;
  evidence: string;
};

type Competency = {
  id: string;
  title: string;
  level: number;
  target: number;
  status: "DEMONSTRATED" | "DEVELOPING" | "NOT_EVALUATED";
  evidenceCount: number;
  description: string;
};

const STORAGE_KEY = "ta14-academy-credential-dashboard-v4";

const credentials: Credential[] = [
  {
    id: "TA14-EAF-2026-001",
    title: "Execution Admissibility Foundations",
    kind: "Foundation certificate",
    state: "VERIFIED",
    issuedOn: "2026-07-29",
    expiresOn: "2028-07-29",
    progress: 100,
    version: "2.0",
    issuer: "TA-14 Academy",
    description:
      "Demonstrates foundational understanding of governed routes, admissibility, authority, execution correspondence, and outcome verification.",
    competencies: [
      "Reality and record",
      "Continuity",
      "Admissibility",
      "Authority and binding",
      "Execution correspondence",
      "Outcome verification",
    ],
    requirements: [
      { id: "r1", label: "Eight foundation lessons", state: "COMPLETE", detail: "All foundation lessons recorded." },
      { id: "r2", label: "Scenario assessment", state: "COMPLETE", detail: "Assessment score exceeded the credential threshold." },
      { id: "r3", label: "Route review exercise", state: "COMPLETE", detail: "Review record preserved with attributable findings." },
      { id: "r4", label: "Capstone mission", state: "COMPLETE", detail: "Capstone completed under credential version 2.0." },
    ],
    evidence: [
      { id: "e1", label: "Assessment record", state: "ACCEPTED", recordedOn: "2026-07-28", source: "Academy Assessment Center" },
      { id: "e2", label: "Capstone mission record", state: "ACCEPTED", recordedOn: "2026-07-29", source: "Capstone Mission" },
      { id: "e3", label: "Credential issuance record", state: "ACCEPTED", recordedOn: "2026-07-29", source: "TA-14 Academy" },
    ],
  },
  {
    id: "TA14-RVA-2026-014",
    title: "Route Validation Analyst",
    kind: "Applied credential",
    state: "IN_PROGRESS",
    issuedOn: "Not issued",
    expiresOn: "Not applicable",
    progress: 72,
    version: "1.1",
    issuer: "TA-14 Academy",
    description:
      "Recognizes the ability to inspect governed routes, classify defects, preserve review evidence, and issue supportable determinations.",
    competencies: [
      "Eight-anchor inspection",
      "Defect classification",
      "Evidence conflict analysis",
      "Corrective action planning",
      "Reviewer attribution",
    ],
    requirements: [
      { id: "r1", label: "Route Validation Workshop", state: "COMPLETE", detail: "Workshop completion recorded." },
      { id: "r2", label: "Evidence Conflict Resolution Lab", state: "COMPLETE", detail: "Conflict analysis record accepted." },
      { id: "r3", label: "Challenge and Appeal Lab", state: "ACTIVE", detail: "Three of six missions completed." },
      { id: "r4", label: "Applied analyst review", state: "NOT_STARTED", detail: "Instructor evaluation remains outstanding." },
    ],
    evidence: [
      { id: "e1", label: "Validation workshop transcript", state: "ACCEPTED", recordedOn: "2026-07-29", source: "Route Validation Workshop" },
      { id: "e2", label: "Conflict lab transcript", state: "ACCEPTED", recordedOn: "2026-07-30", source: "Evidence Conflict Resolution Lab" },
      { id: "e3", label: "Instructor evaluation", state: "PENDING", recordedOn: "Pending", source: "Academy Review" },
    ],
  },
  {
    id: "TA14-GER-2025-008",
    title: "Governed Execution Reviewer",
    kind: "Professional credential",
    state: "RENEWAL_DUE",
    issuedOn: "2025-08-18",
    expiresOn: "2026-08-18",
    progress: 84,
    version: "1.0",
    issuer: "TA-14 Academy",
    description:
      "Demonstrates applied competence in execution-boundary analysis, authority revalidation, decision recording, and challengeable review.",
    competencies: [
      "Execution boundary analysis",
      "Authority revalidation",
      "Decision record integrity",
      "Challenge-before-consequence",
      "Outcome verification",
    ],
    requirements: [
      { id: "r1", label: "Annual knowledge review", state: "COMPLETE", detail: "Knowledge review completed." },
      { id: "r2", label: "Two current review records", state: "ACTIVE", detail: "One of two current records accepted." },
      { id: "r3", label: "Boundary revalidation exercise", state: "COMPLETE", detail: "Exercise completed under current standard." },
      { id: "r4", label: "Renewal attestation", state: "NOT_STARTED", detail: "Attestation opens thirty days before expiration." },
    ],
    evidence: [
      { id: "e1", label: "Knowledge review", state: "ACCEPTED", recordedOn: "2026-07-22", source: "Academy Assessment Center" },
      { id: "e2", label: "Current review record", state: "ACCEPTED", recordedOn: "2026-07-26", source: "Review Workspace" },
      { id: "e3", label: "Second review record", state: "PENDING", recordedOn: "Pending", source: "Review Workspace" },
    ],
  },
];

const transcript: TranscriptRow[] = [
  { id: "t1", title: "What Is a Governance Route?", category: "Foundation", state: "COMPLETE", score: 96, completedOn: "2026-07-20", evidence: "Lesson completion record" },
  { id: "t2", title: "Reality and Record", category: "Foundation", state: "COMPLETE", score: 94, completedOn: "2026-07-20", evidence: "Knowledge check" },
  { id: "t3", title: "Continuity", category: "Foundation", state: "COMPLETE", score: 91, completedOn: "2026-07-21", evidence: "Scenario response" },
  { id: "t4", title: "Admissibility", category: "Foundation", state: "COMPLETE", score: 93, completedOn: "2026-07-22", evidence: "Knowledge check" },
  { id: "t5", title: "Authority and Binding", category: "Foundation", state: "COMPLETE", score: 95, completedOn: "2026-07-23", evidence: "Scenario response" },
  { id: "t6", title: "Commit and Version History", category: "Foundation", state: "COMPLETE", score: 90, completedOn: "2026-07-24", evidence: "Version analysis" },
  { id: "t7", title: "Execution Correspondence", category: "Foundation", state: "COMPLETE", score: 92, completedOn: "2026-07-25", evidence: "Correspondence review" },
  { id: "t8", title: "Outcome and Verification", category: "Foundation", state: "COMPLETE", score: 94, completedOn: "2026-07-26", evidence: "Outcome record" },
  { id: "t9", title: "Route Validation Workshop", category: "Applied lab", state: "COMPLETE", score: 89, completedOn: "2026-07-29", evidence: "Workshop transcript" },
  { id: "t10", title: "Evidence Conflict Resolution Lab", category: "Applied lab", state: "COMPLETE", score: 91, completedOn: "2026-07-30", evidence: "Governed conflict record" },
  { id: "t11", title: "Challenge and Appeal Lab", category: "Applied lab", state: "ACTIVE", score: null, completedOn: null, evidence: "Three missions preserved" },
  { id: "t12", title: "Applied Analyst Review", category: "Evaluation", state: "NOT_STARTED", score: null, completedOn: null, evidence: "No evidence recorded" },
];

const competencies: Competency[] = [
  { id: "c1", title: "Reality and Record", level: 4, target: 4, status: "DEMONSTRATED", evidenceCount: 7, description: "Separates observable reality from preserved representations and identifies record limitations." },
  { id: "c2", title: "Continuity", level: 4, target: 4, status: "DEMONSTRATED", evidenceCount: 6, description: "Traces the chain between source evidence, determination, authority, execution, and outcome." },
  { id: "c3", title: "Admissibility", level: 4, target: 4, status: "DEMONSTRATED", evidenceCount: 8, description: "Evaluates whether evidence and conditions have earned the right to support execution." },
  { id: "c4", title: "Authority and Binding", level: 3, target: 4, status: "DEVELOPING", evidenceCount: 5, description: "Validates the source, scope, currency, and limitations of authority." },
  { id: "c5", title: "Execution Correspondence", level: 3, target: 4, status: "DEVELOPING", evidenceCount: 4, description: "Tests whether runtime action still corresponds to the authorized determination." },
  { id: "c6", title: "Outcome Verification", level: 4, target: 4, status: "DEMONSTRATED", evidenceCount: 6, description: "Preserves what occurred and maintains a challengeable verification record." },
  { id: "c7", title: "Conflict Resolution", level: 3, target: 4, status: "DEVELOPING", evidenceCount: 3, description: "Classifies conflicts, missing evidence, and unresolved conditions without forcing unsupported certainty." },
  { id: "c8", title: "Challenge and Appeal", level: 2, target: 4, status: "DEVELOPING", evidenceCount: 2, description: "Preserves challenges, remedies, reviewer findings, and attributable appeal outcomes." },
];

const tabLabels: Record<Tab, string> = {
  overview: "Overview",
  credentials: "Credentials",
  transcript: "Transcript",
  competencies: "Competencies",
  verification: "Verification",
};

const stateCopy: Record<CredentialState, string> = {
  VERIFIED: "Credential record is current and prepared for independent verification.",
  IN_PROGRESS: "Required learning or evaluation evidence remains incomplete.",
  RENEWAL_DUE: "Credential remains active, but renewal requirements must be satisfied before expiration.",
  SUSPENDED: "Credential should not be represented as current while the suspension remains unresolved.",
};

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

function safeRead(): { selectedId?: string; tab?: Tab; publicPreview?: boolean } {
  if (typeof window === "undefined") return {};
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return {};
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as { selectedId?: string; tab?: Tab; publicPreview?: boolean };
  } catch {
    return {};
  }
}

export default function CredentialDashboardPage() {
  const [selectedId, setSelectedId] = useState(credentials[0].id);
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [publicPreview, setPublicPreview] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = safeRead();
    if (stored.selectedId && credentials.some((credential) => credential.id === stored.selectedId)) {
      setSelectedId(stored.selectedId);
    }
    if (stored.tab && Object.prototype.hasOwnProperty.call(tabLabels, stored.tab)) {
      setTab(stored.tab);
    }
    if (typeof stored.publicPreview === "boolean") {
      setPublicPreview(stored.publicPreview);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selectedId, tab, publicPreview }),
    );
  }, [hydrated, publicPreview, selectedId, tab]);

  const selected = useMemo(
    () => credentials.find((credential) => credential.id === selectedId) ?? credentials[0],
    [selectedId],
  );

  const filteredTranscript = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return transcript;
    return transcript.filter((row) =>
      [row.title, row.category, row.state, row.evidence]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  const completedTranscript = transcript.filter((row) => row.state === "COMPLETE");
  const scoredRows = completedTranscript.filter((row) => row.score !== null);
  const averageScore = scoredRows.length
    ? Math.round(scoredRows.reduce((total, row) => total + (row.score ?? 0), 0) / scoredRows.length)
    : 0;
  const demonstratedCount = competencies.filter((item) => item.status === "DEMONSTRATED").length;
  const acceptedEvidence = credentials.reduce(
    (total, credential) => total + credential.evidence.filter((item) => item.state === "ACCEPTED").length,
    0,
  );

  const exportTranscript = () => {
    downloadJson("ta14-academy-transcript.json", {
      schema: "ta14.academy.transcript.v1",
      exportedAt: new Date().toISOString(),
      learner: "Academy learner",
      summary: {
        completedUnits: completedTranscript.length,
        totalUnits: transcript.length,
        averageScore,
        demonstratedCompetencies: demonstratedCount,
      },
      transcript,
      competencies,
    });
  };

  const exportCredential = () => {
    downloadJson(`${selected.id.toLowerCase()}-credential-record.json`, {
      schema: "ta14.academy.credential-record.v1",
      exportedAt: new Date().toISOString(),
      credential: selected,
      integrityNotice:
        "This exported learning record does not independently establish execution authority or execution-specific admissibility.",
    });
  };

  return (
    <main className="page">
      <div className="cosmos" aria-hidden="true">
        <span className="glow glowOne" />
        <span className="glow glowTwo" />
        <span className="stars starsOne" />
        <span className="stars starsTwo" />
      </div>

      <header className="topbar">
        <Link className="brand" href="/academy">
          <span className="mark">TA-14</span>
          <span>
            <strong>Academy Credential Center</strong>
            <small>Learning records · credentials · verification</small>
          </span>
        </Link>

        <nav aria-label="Credential Center navigation">
          <Link href="/academy/dashboard">Mission Control</Link>
          <Link href="/academy/assessment">Assessment</Link>
          <Link href="/verify">Verification</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">TA-14 Academy · Credential Center</p>
          <h1>
            Preserve demonstrated learning.
            <em> Keep authority separate.</em>
          </h1>
          <p className="lede">
            Review credentials, transcript evidence, competency coverage, renewal posture,
            and public verification data without confusing an Academy record with present
            authority to execute.
          </p>

          <div className="heroActions">
            <button type="button" onClick={exportTranscript}>Export transcript</button>
            <button type="button" className="secondary" onClick={() => setTab("verification")}>Open verification record</button>
          </div>
        </div>

        <aside className="identityCard">
          <div className="identityHeader">
            <span className="avatar" aria-hidden="true">GB</span>
            <div>
              <span>Credential holder</span>
              <strong>Academy learner</strong>
              <small>TA-14 learner record</small>
            </div>
          </div>
          <dl>
            <div><dt>Record posture</dt><dd>Current</dd></div>
            <div><dt>Accepted evidence</dt><dd>{acceptedEvidence}</dd></div>
            <div><dt>Last activity</dt><dd>July 30, 2026</dd></div>
          </dl>
          <p>
            Identity, issuance, assessment, and status must be independently confirmed
            before a credential is relied upon outside the Academy.
          </p>
        </aside>
      </section>

      <section className="metrics" aria-label="Credential summary">
        <article>
          <span>Credentials</span>
          <strong>{credentials.length}</strong>
          <p>{credentials.filter((item) => item.state === "VERIFIED").length} currently verified</p>
        </article>
        <article>
          <span>Learning units</span>
          <strong>{completedTranscript.length}/{transcript.length}</strong>
          <p>Completed transcript records</p>
        </article>
        <article>
          <span>Average score</span>
          <strong>{averageScore}%</strong>
          <p>Across scored completed work</p>
        </article>
        <article>
          <span>Competencies</span>
          <strong>{demonstratedCount}/{competencies.length}</strong>
          <p>Demonstrated at target level</p>
        </article>
      </section>

      <section className="tabs" aria-label="Credential dashboard sections">
        {(Object.keys(tabLabels) as Tab[]).map((item) => (
          <button
            type="button"
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => setTab(item)}
          >
            {tabLabels[item]}
          </button>
        ))}
      </section>

      {tab === "overview" && (
        <section className="overviewGrid">
          <article className="primaryPanel">
            <div className="panelHeading">
              <div>
                <p className="eyebrow">Current credential pathway</p>
                <h2>{selected.title}</h2>
              </div>
              <span className={`statePill ${selected.state.toLowerCase()}`}>{selected.state.replaceAll("_", " ")}</span>
            </div>

            <p className="panelDescription">{selected.description}</p>

            <div className="progressCopy">
              <span>Credential completion</span>
              <strong>{selected.progress}%</strong>
            </div>
            <div className="progressTrack" aria-label={`${selected.progress}% complete`}>
              <span style={{ width: `${selected.progress}%` }} />
            </div>

            <div className="requirementGrid">
              {selected.requirements.map((requirement) => (
                <div className="requirement" key={requirement.id}>
                  <span className={`activityDot ${requirement.state.toLowerCase()}`} />
                  <div>
                    <strong>{requirement.label}</strong>
                    <p>{requirement.detail}</p>
                  </div>
                  <small>{requirement.state.replaceAll("_", " ")}</small>
                </div>
              ))}
            </div>

            <div className="panelActions">
              <button type="button" onClick={() => setTab("credentials")}>Inspect credential</button>
              <button type="button" className="secondary" onClick={exportCredential}>Export record</button>
            </div>
          </article>

          <aside className="sideStack">
            <article className="integrityCard">
              <p className="eyebrow">Credential integrity</p>
              <h3>Learning evidence is not execution authority.</h3>
              <p>
                Credentials may support role qualification, but every governed execution
                still requires current evidence, valid authority, preserved continuity,
                and execution-specific admissibility.
              </p>
            </article>

            <article className="renewalCard">
              <p className="eyebrow">Next action</p>
              <h3>Continue Challenge and Appeal Lab</h3>
              <p>Three missions remain before the applied analyst review can begin.</p>
              <Link href="/academy/challenge-and-appeal-lab">Resume laboratory →</Link>
            </article>
          </aside>

          <article className="timelinePanel">
            <div className="sectionHeading">
              <p className="eyebrow">Recent learning activity</p>
              <h2>Credential timeline</h2>
            </div>
            <ol className="timeline">
              <li><span>30 JUL</span><div><strong>Evidence Conflict Resolution Lab completed</strong><p>Governed conflict record accepted into the learner transcript.</p></div></li>
              <li><span>29 JUL</span><div><strong>Route Validation Workshop completed</strong><p>Five validation missions preserved with attributable findings.</p></div></li>
              <li><span>29 JUL</span><div><strong>Foundation credential issued</strong><p>Execution Admissibility Foundations version 2.0 entered verified status.</p></div></li>
              <li><span>28 JUL</span><div><strong>Scenario assessment passed</strong><p>Assessment result exceeded the credential threshold.</p></div></li>
            </ol>
          </article>
        </section>
      )}

      {tab === "credentials" && (
        <section className="credentialWorkspace">
          <aside className="credentialList">
            <div className="sectionHeading">
              <p className="eyebrow">Credential portfolio</p>
              <h2>Issued and active pathways</h2>
            </div>
            {credentials.map((credential) => (
              <button
                type="button"
                key={credential.id}
                onClick={() => setSelectedId(credential.id)}
                className={credential.id === selectedId ? "credential active" : "credential"}
              >
                <div>
                  <span>{credential.kind}</span>
                  <strong>{credential.title}</strong>
                  <small>{credential.id}</small>
                </div>
                <b>{credential.progress}%</b>
              </button>
            ))}
          </aside>

          <article className="credentialDetail">
            <div className="detailTop">
              <div>
                <p className="eyebrow">Selected credential</p>
                <h2>{selected.title}</h2>
                <p>{selected.id} · Version {selected.version}</p>
              </div>
              <span className={`statePill ${selected.state.toLowerCase()}`}>{selected.state.replaceAll("_", " ")}</span>
            </div>

            <div className="credentialMeta">
              <dl>
                <div><dt>Issuer</dt><dd>{selected.issuer}</dd></div>
                <div><dt>Issued</dt><dd>{selected.issuedOn}</dd></div>
                <div><dt>Expires</dt><dd>{selected.expiresOn}</dd></div>
                <div><dt>Credential version</dt><dd>{selected.version}</dd></div>
              </dl>
            </div>

            <p className="detailDescription">{selected.description}</p>

            <div className="stateNotice">
              <strong>{selected.state.replaceAll("_", " ")}</strong>
              <p>{stateCopy[selected.state]}</p>
            </div>

            <section className="detailSection">
              <h3>Competency coverage</h3>
              <div className="chipList">
                {selected.competencies.map((competency) => <span key={competency}>{competency}</span>)}
              </div>
            </section>

            <section className="detailSection">
              <h3>Credential evidence</h3>
              <div className="evidenceList">
                {selected.evidence.map((item) => (
                  <div key={item.id}>
                    <span className={`evidenceState ${item.state.toLowerCase()}`}>{item.state}</span>
                    <div><strong>{item.label}</strong><p>{item.source}</p></div>
                    <small>{item.recordedOn}</small>
                  </div>
                ))}
              </div>
            </section>

            <div className="panelActions">
              <button type="button" onClick={exportCredential}>Export credential record</button>
              <button type="button" className="secondary" onClick={() => setTab("verification")}>Preview verification</button>
            </div>
          </article>
        </section>
      )}

      {tab === "transcript" && (
        <section className="transcriptPanel">
          <div className="transcriptHeader">
            <div className="sectionHeading">
              <p className="eyebrow">Academy transcript</p>
              <h2>Attributable learning record</h2>
            </div>
            <div className="transcriptActions">
              <label>
                <span className="srOnly">Filter transcript</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter learning records" />
              </label>
              <button type="button" onClick={exportTranscript}>Export JSON</button>
            </div>
          </div>

          <div className="tableWrap">
            <table>
              <thead>
                <tr><th>Learning unit</th><th>Category</th><th>Status</th><th>Score</th><th>Completed</th><th>Evidence</th></tr>
              </thead>
              <tbody>
                {filteredTranscript.map((row) => (
                  <tr key={row.id}>
                    <td><strong>{row.title}</strong></td>
                    <td>{row.category}</td>
                    <td><span className={`activityPill ${row.state.toLowerCase()}`}>{row.state.replaceAll("_", " ")}</span></td>
                    <td>{row.score === null ? "—" : `${row.score}%`}</td>
                    <td>{row.completedOn ?? "—"}</td>
                    <td>{row.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTranscript.length === 0 && (
            <div className="emptyState"><strong>No matching learning records</strong><p>Change the transcript filter to restore records.</p></div>
          )}
        </section>
      )}

      {tab === "competencies" && (
        <section className="competencyPanel">
          <div className="sectionHeading">
            <p className="eyebrow">Competency matrix</p>
            <h2>Demonstrated capability and remaining development</h2>
          </div>

          <div className="competencyIntro">
            <p>
              Competency levels summarize preserved Academy evidence. They do not guarantee
              performance in a new context and do not replace role-specific authorization.
            </p>
            <div><span>Scale</span><strong>1 awareness · 2 guided · 3 applied · 4 demonstrated</strong></div>
          </div>

          <div className="competencyGrid">
            {competencies.map((competency) => (
              <article key={competency.id}>
                <div className="competencyHeading">
                  <div><span>{competency.status.replaceAll("_", " ")}</span><h3>{competency.title}</h3></div>
                  <strong>{competency.level}/{competency.target}</strong>
                </div>
                <p>{competency.description}</p>
                <div className="levelTrack" aria-label={`${competency.title} level ${competency.level} of ${competency.target}`}>
                  {[1, 2, 3, 4].map((level) => <span key={level} className={level <= competency.level ? "filled" : ""} />)}
                </div>
                <footer><span>{competency.evidenceCount} evidence records</span><button type="button" onClick={() => setTab("transcript")}>View transcript</button></footer>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "verification" && (
        <section className="verificationPanel">
          <div className="verificationControls">
            <div>
              <p className="eyebrow">Public verification preview</p>
              <h2>Control what a verifier can inspect.</h2>
              <p>
                The preview is a local Academy representation. Production verification should
                use an authoritative credential record, current status, issuance evidence, and
                cryptographic or institutional verification controls.
              </p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={publicPreview} onChange={(event) => setPublicPreview(event.target.checked)} />
              <span aria-hidden="true" />
              Public preview {publicPreview ? "enabled" : "disabled"}
            </label>
          </div>

          <div className="verificationGrid">
            <article className="publicCard">
              <div className="seal" aria-hidden="true"><span>TA</span><strong>14</strong></div>
              <p className="eyebrow">Credential verification</p>
              <h2>{selected.title}</h2>
              <p className="credentialId">{selected.id}</p>
              <span className={`statePill ${selected.state.toLowerCase()}`}>{selected.state.replaceAll("_", " ")}</span>

              {publicPreview ? (
                <dl>
                  <div><dt>Credential holder</dt><dd>Academy learner</dd></div>
                  <div><dt>Issuer</dt><dd>{selected.issuer}</dd></div>
                  <div><dt>Version</dt><dd>{selected.version}</dd></div>
                  <div><dt>Issued</dt><dd>{selected.issuedOn}</dd></div>
                  <div><dt>Expires</dt><dd>{selected.expiresOn}</dd></div>
                </dl>
              ) : (
                <div className="privateState"><strong>Preview is private</strong><p>Enable the local preview to inspect the proposed public record.</p></div>
              )}
            </article>

            <aside className="verificationChecklist">
              <p className="eyebrow">Verifier checklist</p>
              <h3>Do not rely on appearance alone.</h3>
              <ol>
                <li><span>01</span><div><strong>Confirm identity</strong><p>Match the credential holder to an appropriate identity record.</p></div></li>
                <li><span>02</span><div><strong>Confirm issuer</strong><p>Verify that the issuing institution and credential definition are authentic.</p></div></li>
                <li><span>03</span><div><strong>Confirm current status</strong><p>Check expiration, suspension, revocation, and renewal posture.</p></div></li>
                <li><span>04</span><div><strong>Inspect evidence scope</strong><p>Understand what the credential demonstrates and what it does not.</p></div></li>
                <li><span>05</span><div><strong>Revalidate execution authority</strong><p>Do not treat training evidence as permission for a specific execution.</p></div></li>
              </ol>
              <Link href="/verify">Open Exchange verification →</Link>
            </aside>
          </div>
        </section>
      )}

      <section className="boundaryNotice">
        <div>
          <span>Credential boundary</span>
          <strong>No Academy credential independently authorizes execution.</strong>
        </div>
        <p>
          A credential preserves demonstrated learning under a defined version and assessment
          process. Every consequential action still requires current evidence, valid authority,
          preserved continuity, execution correspondence, and a verifiable outcome.
        </p>
      </section>

      <footer className="pageFooter">
        <Link href="/academy/dashboard">← Return to Mission Control</Link>
        <span>TA-14 Academy · Credential Center</span>
        <Link href="/academy/capstone-mission">Open Capstone Mission →</Link>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { background: #04080d; }
        :global(body) {
          margin: 0;
          background: #04080d;
          color: #edf7ff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        :global(button), :global(input) { font: inherit; }
        :global(a) { color: inherit; }
        .page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding: 0 5vw 64px;
          background:
            radial-gradient(circle at 88% 8%, rgba(41, 210, 188, .12), transparent 30%),
            radial-gradient(circle at 4% 38%, rgba(65, 107, 255, .12), transparent 32%),
            linear-gradient(180deg, #08131d 0%, #050a10 42%, #03070b 100%);
        }
        .cosmos { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .glow { position: absolute; border-radius: 999px; filter: blur(100px); opacity: .2; }
        .glowOne { width: 390px; height: 390px; background: #47dfcc; right: -120px; top: -160px; }
        .glowTwo { width: 340px; height: 340px; background: #456dff; left: -180px; top: 520px; }
        .stars { position: absolute; inset: 0; opacity: .15; background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 42px 42px; }
        .starsTwo { transform: translate(18px, 16px); background-size: 68px 68px; opacity: .08; }
        .topbar, .hero, .metrics, .tabs, .overviewGrid, .credentialWorkspace,
        .transcriptPanel, .competencyPanel, .verificationPanel, .boundaryNotice,
        .pageFooter { max-width: 1420px; margin-left: auto; margin-right: auto; position: relative; z-index: 1; }
        .topbar {
          min-height: 94px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,.1);
        }
        .brand { display: flex; gap: 14px; align-items: center; text-decoration: none; }
        .brand strong, .brand small { display: block; }
        .brand small { color: #8199aa; margin-top: 3px; }
        .mark {
          border: 1px solid rgba(105, 233, 216, .55);
          color: #8af4e7;
          border-radius: 11px;
          padding: 10px 12px;
          font-weight: 900;
          letter-spacing: .08em;
          box-shadow: inset 0 0 24px rgba(90, 225, 207, .08);
        }
        .topbar nav { display: flex; gap: 24px; }
        .topbar nav a, .pageFooter a { color: #a9bfcd; text-decoration: none; }
        .topbar nav a:hover, .pageFooter a:hover { color: #8af4e7; }
        .hero { display: grid; grid-template-columns: 1.45fr .65fr; gap: 30px; padding: 74px 0 34px; }
        .eyebrow { margin: 0 0 11px; color: #75e2d4; text-transform: uppercase; letter-spacing: .17em; font-size: .73rem; font-weight: 900; }
        .hero h1 { margin: 0; max-width: 940px; font-size: clamp(2.7rem, 5.2vw, 5.6rem); line-height: .98; letter-spacing: -.045em; }
        .hero h1 em { display: block; color: #81eadf; font-style: normal; }
        .lede { max-width: 860px; margin: 24px 0 0; color: #a8bdca; font-size: 1.08rem; line-height: 1.78; }
        .heroActions, .panelActions, .transcriptActions { display: flex; flex-wrap: wrap; gap: 11px; }
        .heroActions { margin-top: 28px; }
        button {
          border: 1px solid rgba(126, 238, 224, .35);
          background: #82eee1;
          color: #061017;
          font-weight: 850;
          padding: 12px 16px;
          border-radius: 11px;
          cursor: pointer;
        }
        button:hover { transform: translateY(-1px); filter: brightness(1.05); }
        button.secondary { background: rgba(126, 238, 224, .07); color: #c9fff8; }
        .identityCard, .metrics article, .primaryPanel, .integrityCard, .renewalCard,
        .timelinePanel, .credentialList, .credentialDetail, .transcriptPanel,
        .competencyPanel, .verificationPanel, .boundaryNotice {
          border: 1px solid rgba(255,255,255,.105);
          background: rgba(9, 23, 34, .78);
          box-shadow: 0 24px 80px rgba(0,0,0,.26);
          backdrop-filter: blur(20px);
        }
        .identityCard { align-self: end; border-radius: 21px; padding: 25px; }
        .identityHeader { display: flex; align-items: center; gap: 14px; }
        .avatar { width: 50px; height: 50px; border-radius: 15px; display: grid; place-items: center; color: #061017; background: linear-gradient(135deg, #7deadd, #8fb7ff); font-weight: 950; }
        .identityHeader span, .identityHeader strong, .identityHeader small { display: block; }
        .identityHeader > div > span { color: #79e4d7; text-transform: uppercase; font-size: .68rem; letter-spacing: .13em; }
        .identityHeader strong { margin: 4px 0; font-size: 1.15rem; }
        .identityHeader small { color: #8ba2b1; }
        .identityCard dl { margin: 24px 0 0; }
        .identityCard dl div, .credentialMeta dl div, .publicCard dl div { display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.07); }
        dt { color: #8299aa; }
        dd { margin: 0; color: #dcecf5; text-align: right; }
        .identityCard > p { color: #8fa5b4; line-height: 1.55; font-size: .86rem; margin: 20px 0 0; }
        .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 24px; }
        .metrics article { padding: 21px; border-radius: 16px; }
        .metrics span, .metrics p { color: #8da4b4; }
        .metrics strong { display: block; margin: 6px 0; font-size: 2rem; }
        .metrics p { margin: 0; font-size: .85rem; }
        .tabs { display: flex; gap: 8px; padding: 7px; border-radius: 15px; background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.08); margin-bottom: 24px; overflow-x: auto; }
        .tabs button { flex: 1; min-width: 130px; background: transparent; color: #9db1bf; border-color: transparent; }
        .tabs button.active { color: #071019; background: #80ecdf; }
        .overviewGrid { display: grid; grid-template-columns: 1.35fr .65fr; gap: 22px; }
        .primaryPanel { grid-row: span 2; border-radius: 22px; padding: 28px; }
        .panelHeading, .detailTop, .transcriptHeader, .competencyHeading, .verificationControls { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; }
        .panelHeading h2, .sectionHeading h2, .detailTop h2, .verificationControls h2 { margin: 0; font-size: clamp(1.7rem, 3vw, 2.55rem); letter-spacing: -.025em; }
        .statePill, .activityPill, .evidenceState { display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; border-radius: 999px; padding: 8px 11px; font-size: .68rem; font-weight: 900; letter-spacing: .08em; }
        .verified, .accepted, .complete, .demonstrated { color: #8cf0bd; background: rgba(77, 222, 151, .11); border: 1px solid rgba(77, 222, 151, .3); }
        .in_progress, .active, .pending, .developing { color: #9fbeff; background: rgba(85, 133, 255, .11); border: 1px solid rgba(85, 133, 255, .3); }
        .renewal_due, .expired { color: #ffd08b; background: rgba(255, 181, 71, .11); border: 1px solid rgba(255, 181, 71, .3); }
        .suspended, .not_started, .not_evaluated { color: #ff9aa8; background: rgba(255, 98, 122, .1); border: 1px solid rgba(255, 98, 122, .28); }
        .panelDescription, .detailDescription { color: #a4b8c5; line-height: 1.7; }
        .progressCopy { display: flex; justify-content: space-between; margin-top: 26px; }
        .progressCopy span { color: #96adbb; }
        .progressTrack { height: 10px; background: #10202c; border-radius: 999px; overflow: hidden; margin: 9px 0 24px; }
        .progressTrack span { display: block; height: 100%; background: linear-gradient(90deg, #4ecdbd, #88efe3); border-radius: inherit; }
        .requirementGrid { display: grid; gap: 10px; }
        .requirement { display: grid; grid-template-columns: auto 1fr auto; gap: 13px; align-items: start; padding: 15px; border: 1px solid rgba(255,255,255,.075); background: rgba(255,255,255,.025); border-radius: 14px; }
        .requirement strong, .requirement p { display: block; }
        .requirement p { margin: 5px 0 0; color: #879dac; line-height: 1.45; font-size: .86rem; }
        .requirement small { color: #879dac; font-size: .67rem; letter-spacing: .08em; }
        .activityDot { width: 11px; height: 11px; border-radius: 999px; margin-top: 4px; background: #72828d; }
        .activityDot.complete { background: #58dba2; box-shadow: 0 0 18px rgba(88,219,162,.5); }
        .activityDot.active { background: #6d9cff; box-shadow: 0 0 18px rgba(109,156,255,.5); }
        .panelActions { margin-top: 24px; }
        .sideStack { display: grid; gap: 22px; }
        .integrityCard, .renewalCard { border-radius: 20px; padding: 24px; }
        .integrityCard { border-left: 4px solid #74e2d5; }
        .integrityCard h3, .renewalCard h3 { margin: 0; font-size: 1.35rem; }
        .integrityCard p:last-child, .renewalCard p { color: #9cafbc; line-height: 1.62; }
        .renewalCard a { display: inline-block; color: #89eee2; text-decoration: none; margin-top: 7px; font-weight: 800; }
        .timelinePanel { grid-column: 1 / -1; border-radius: 22px; padding: 28px; }
        .timeline { list-style: none; padding: 0; margin: 20px 0 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .timeline li { padding: 17px; border-radius: 14px; border: 1px solid rgba(255,255,255,.075); background: rgba(255,255,255,.022); }
        .timeline li > span { color: #77e2d5; font-size: .68rem; letter-spacing: .12em; font-weight: 900; }
        .timeline strong { display: block; margin: 10px 0 6px; }
        .timeline p { margin: 0; color: #879cab; line-height: 1.5; font-size: .84rem; }
        .credentialWorkspace { display: grid; grid-template-columns: .72fr 1.28fr; gap: 22px; }
        .credentialList, .credentialDetail, .transcriptPanel, .competencyPanel, .verificationPanel { border-radius: 22px; padding: 27px; }
        .credential { width: 100%; display: flex; justify-content: space-between; align-items: center; text-align: left; margin-top: 10px; background: rgba(255,255,255,.025); color: #edf7ff; border-color: rgba(255,255,255,.08); }
        .credential.active { background: rgba(115, 227, 212, .09); border-color: rgba(115,227,212,.5); }
        .credential span, .credential strong, .credential small { display: block; }
        .credential span, .credential small { color: #879cac; }
        .credential strong { margin: 6px 0; }
        .credential b { color: #82ecdf; }
        .detailTop > div > p:last-child { color: #879cac; }
        .credentialMeta { margin: 22px 0; padding: 16px 18px; border-radius: 15px; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); }
        .credentialMeta dl { margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); column-gap: 26px; }
        .stateNotice { margin: 22px 0; border-left: 4px solid #73dfd2; padding: 15px 18px; background: rgba(115,223,210,.055); border-radius: 0 13px 13px 0; }
        .stateNotice p { margin: 6px 0 0; color: #9db1be; line-height: 1.55; }
        .detailSection { margin-top: 26px; }
        .detailSection h3 { margin: 0 0 13px; }
        .chipList { display: flex; flex-wrap: wrap; gap: 9px; }
        .chipList span { padding: 8px 11px; border-radius: 999px; color: #c4d7e2; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.07); }
        .evidenceList { display: grid; gap: 9px; }
        .evidenceList > div { display: grid; grid-template-columns: auto 1fr auto; gap: 13px; align-items: center; padding: 14px; border-radius: 13px; background: rgba(255,255,255,.022); border: 1px solid rgba(255,255,255,.07); }
        .evidenceList strong, .evidenceList p { display: block; }
        .evidenceList p { color: #8299a8; margin: 4px 0 0; font-size: .84rem; }
        .evidenceList small { color: #8399a8; }
        .transcriptHeader { align-items: center; margin-bottom: 20px; }
        .transcriptActions input { min-width: 250px; padding: 12px 14px; color: #eaf5fc; background: #0a1721; border: 1px solid rgba(255,255,255,.11); border-radius: 10px; outline: none; }
        .transcriptActions input:focus { border-color: rgba(120,230,216,.55); }
        .tableWrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 900px; }
        th, td { text-align: left; padding: 15px 13px; border-bottom: 1px solid rgba(255,255,255,.075); }
        th { color: #8299a8; text-transform: uppercase; letter-spacing: .1em; font-size: .69rem; }
        td { color: #bdcfda; }
        td strong { color: #edf7ff; }
        .emptyState { padding: 42px; text-align: center; color: #91a6b4; }
        .emptyState strong { color: #eaf5fc; }
        .competencyIntro { display: flex; justify-content: space-between; gap: 25px; margin: 18px 0 22px; color: #9bafbc; }
        .competencyIntro > p { max-width: 800px; line-height: 1.65; }
        .competencyIntro > div { min-width: 290px; padding: 15px; border-radius: 13px; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); }
        .competencyIntro span, .competencyIntro strong { display: block; }
        .competencyIntro span { color: #73dfd2; text-transform: uppercase; font-size: .68rem; letter-spacing: .1em; }
        .competencyIntro strong { margin-top: 7px; font-size: .86rem; }
        .competencyGrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .competencyGrid article { padding: 20px; border-radius: 16px; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.075); }
        .competencyHeading span { color: #74dfd2; font-size: .66rem; letter-spacing: .1em; }
        .competencyHeading h3 { margin: 6px 0 0; }
        .competencyHeading > strong { color: #85eee2; font-size: 1.25rem; }
        .competencyGrid article > p { color: #8fa5b3; line-height: 1.55; min-height: 72px; }
        .levelTrack { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
        .levelTrack span { height: 8px; border-radius: 999px; background: #152531; }
        .levelTrack span.filled { background: linear-gradient(90deg, #4bcbbb, #7de8dc); }
        .competencyGrid footer { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; color: #8298a7; font-size: .82rem; }
        .competencyGrid footer button { padding: 8px 10px; background: transparent; color: #8aece1; }
        .verificationControls { margin-bottom: 22px; }
        .verificationControls > div > p:last-child { max-width: 850px; color: #9aafbc; line-height: 1.65; }
        .toggle { display: flex; align-items: center; gap: 10px; cursor: pointer; color: #b9ccd7; white-space: nowrap; }
        .toggle input { position: absolute; opacity: 0; }
        .toggle > span { width: 48px; height: 26px; padding: 3px; border-radius: 999px; background: #192a36; border: 1px solid rgba(255,255,255,.12); }
        .toggle > span::after { content: ""; display: block; width: 18px; height: 18px; border-radius: 999px; background: #90a2ad; transition: .2s ease; }
        .toggle input:checked + span { background: rgba(90,222,204,.2); border-color: rgba(90,222,204,.5); }
        .toggle input:checked + span::after { transform: translateX(20px); background: #7ce7da; }
        .verificationGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
        .publicCard, .verificationChecklist { border-radius: 18px; padding: 25px; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.075); }
        .seal { width: 70px; height: 70px; border-radius: 22px; display: grid; place-content: center; text-align: center; background: linear-gradient(145deg, #6adbcf, #7aa6ff); color: #071019; box-shadow: 0 16px 40px rgba(49,189,177,.18); }
        .seal span, .seal strong { display: block; line-height: .9; }
        .seal span { font-size: .72rem; letter-spacing: .14em; }
        .seal strong { font-size: 1.7rem; }
        .publicCard h2 { margin: 9px 0; font-size: 2rem; }
        .credentialId { color: #8da3b1; }
        .publicCard dl { margin-top: 24px; }
        .privateState { margin-top: 25px; padding: 30px; text-align: center; border-radius: 15px; background: rgba(255,255,255,.025); border: 1px dashed rgba(255,255,255,.15); }
        .privateState p { color: #8ca1af; }
        .verificationChecklist h3 { margin: 0; font-size: 1.5rem; }
        .verificationChecklist ol { list-style: none; padding: 0; margin: 20px 0; display: grid; gap: 11px; }
        .verificationChecklist li { display: grid; grid-template-columns: auto 1fr; gap: 13px; padding: 13px; border-radius: 13px; background: rgba(255,255,255,.022); }
        .verificationChecklist li > span { color: #78e2d5; font-weight: 900; }
        .verificationChecklist strong, .verificationChecklist p { display: block; }
        .verificationChecklist p { margin: 4px 0 0; color: #869dab; line-height: 1.45; font-size: .85rem; }
        .verificationChecklist a { color: #86eee2; text-decoration: none; font-weight: 850; }
        .boundaryNotice { margin-top: 24px; border-radius: 18px; padding: 22px 24px; display: grid; grid-template-columns: .8fr 1.2fr; gap: 26px; border-left: 4px solid #78e2d5; }
        .boundaryNotice span, .boundaryNotice strong { display: block; }
        .boundaryNotice span { color: #75dfd2; text-transform: uppercase; letter-spacing: .12em; font-size: .68rem; }
        .boundaryNotice strong { margin-top: 7px; }
        .boundaryNotice p { margin: 0; color: #9cafbc; line-height: 1.65; }
        .pageFooter { display: flex; justify-content: space-between; gap: 18px; align-items: center; margin-top: 28px; color: #8096a5; font-size: .88rem; }
        .srOnly { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        @media (max-width: 1100px) {
          .hero, .overviewGrid, .credentialWorkspace, .verificationGrid { grid-template-columns: 1fr; }
          .identityCard { max-width: 680px; }
          .primaryPanel { grid-row: auto; }
          .timeline { grid-template-columns: repeat(2, 1fr); }
          .credentialMeta dl { grid-template-columns: 1fr; }
        }
        @media (max-width: 820px) {
          .topbar { padding: 18px 0; align-items: flex-start; }
          .topbar nav { display: none; }
          .hero { padding-top: 48px; }
          .metrics { grid-template-columns: repeat(2, 1fr); }
          .competencyGrid { grid-template-columns: 1fr; }
          .competencyIntro, .verificationControls, .transcriptHeader { flex-direction: column; }
          .transcriptActions { width: 100%; }
          .transcriptActions label, .transcriptActions input { width: 100%; }
          .boundaryNotice { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .page { padding-left: 18px; padding-right: 18px; }
          .metrics, .timeline { grid-template-columns: 1fr; }
          .hero h1 { font-size: 2.65rem; }
          .tabs button { min-width: 115px; }
          .primaryPanel, .credentialList, .credentialDetail, .transcriptPanel, .competencyPanel, .verificationPanel, .timelinePanel { padding: 19px; }
          .panelHeading, .detailTop, .competencyHeading { flex-direction: column; }
          .requirement, .evidenceList > div { grid-template-columns: auto 1fr; }
          .requirement small, .evidenceList small { grid-column: 2; }
          .pageFooter { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </main>
  );
}
