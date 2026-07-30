'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Lesson = {
  number: string;
  title: string;
  href: string;
  description: string;
};

const lessons: Lesson[] = [
  {
    number: '01',
    title: 'What Is a Governance Route?',
    href: '/academy/what-is-a-route',
    description: 'Learn why a governed route is more than a workflow.',
  },
  {
    number: '02',
    title: 'Reality and Record',
    href: '/academy/reality-and-record',
    description: 'Separate what is true from what has been preserved about it.',
  },
  {
    number: '03',
    title: 'Continuity',
    href: '/academy/continuity',
    description: 'Protect the chain between evidence, determination, and action.',
  },
  {
    number: '04',
    title: 'Admissibility',
    href: '/academy/admissibility',
    description: 'Determine whether an execution has earned the right to proceed.',
  },
  {
    number: '05',
    title: 'Authority and Binding',
    href: '/academy/authority-and-binding',
    description: 'Validate who may authorize consequence and within what boundary.',
  },
  {
    number: '06',
    title: 'Commit and Version History',
    href: '/academy/commit-and-version-history',
    description: 'Preserve the authorized state that execution is permitted to use.',
  },
  {
    number: '07',
    title: 'Execution Correspondence',
    href: '/academy/execution-correspondence',
    description: 'Test whether execution still corresponds to the approved determination.',
  },
  {
    number: '08',
    title: 'Outcome and Verification',
    href: '/academy/outcome-and-verification',
    description: 'Preserve what happened and make the result challengeable.',
  },
];

const STORAGE_KEY = 'ta14-academy-completed-lessons-v1';

function readCompletedLessons(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string')
      : [];
  } catch {
    return [];
  }
}

const controlCards = [
  {
    eyebrow: 'Practice',
    title: 'Execution Simulator',
    description:
      'Test evidence, authority, continuity, boundaries, and dependencies before consequence occurs.',
    href: '/academy/simulator',
    action: 'Open simulator',
  },
  {
    eyebrow: 'Challenge',
    title: 'Review Workspace',
    description:
      'Record governed findings, classify severity, and preserve a challengeable review record.',
    href: '/academy/review',
    action: 'Open review',
  },
  {
    eyebrow: 'Demonstrate',
    title: 'Assessment Center',
    description:
      'Validate understanding through scenario-based questions and competency evidence.',
    href: '/academy/assessment',
    action: 'Open assessment',
  },
];


const missionMetrics = [
  { label: 'Active pathway', value: 'Foundations', detail: 'Eight-anchor public orientation', tone: 'cyan' },
  { label: 'Competency record', value: 'In progress', detail: 'Evidence remains scope-bounded', tone: 'violet' },
  { label: 'Open simulations', value: '3', detail: 'Two HOLD · one ESCALATE', tone: 'amber' },
  { label: 'Review findings', value: '7', detail: 'Four corrected · three open', tone: 'rose' },
  { label: 'Credential state', value: 'Not issued', detail: 'Assessment evidence incomplete', tone: 'slate' },
  { label: 'Preserved events', value: '24', detail: 'Local Academy activity record', tone: 'green' },
];

const pathwayStages = [
  { number: '01', title: 'Orientation', state: 'Complete', detail: 'Institution, principle, and boundary understood.', href: '/academy/start' },
  { number: '02', title: 'Architecture', state: 'Active', detail: 'Eight visible anchors and 24-link runtime distinction.', href: '/academy/architecture-explorer' },
  { number: '03', title: 'Route construction', state: 'Available', detail: 'Translate an intended action into a governed route.', href: '/academy/route-construction-lab' },
  { number: '04', title: 'Simulation', state: 'Available', detail: 'Find the earliest failure before consequence.', href: '/academy/simulator' },
  { number: '05', title: 'Bounded review', state: 'Locked', detail: 'Requires a preserved route or simulation record.', href: '/academy/review' },
  { number: '06', title: 'Assessment', state: 'Locked', detail: 'Requires completed pathway evidence.', href: '/academy/assessment' },
  { number: '07', title: 'Credential decision', state: 'Locked', detail: 'Authority reviews competency evidence and scope.', href: '/academy/credential-dashboard' },
];

const actionQueue = [
  { priority: 'Now', title: 'Complete the architecture orientation', owner: 'Learner', due: 'Current session', href: '/academy/architecture-explorer', action: 'Continue' },
  { priority: 'Next', title: 'Build a first governed route', owner: 'Learner', due: 'After orientation', href: '/academy/route-construction-lab', action: 'Open lab' },
  { priority: 'Review', title: 'Resolve three preserved findings', owner: 'Learner + reviewer', due: 'Before assessment', href: '/academy/review', action: 'Review findings' },
  { priority: 'Evidence', title: 'Preserve competency artifacts', owner: 'Learner', due: 'Throughout pathway', href: '/academy/credential-dashboard', action: 'Inspect evidence' },
  { priority: 'Assessment', title: 'Demonstrate scope-bounded capability', owner: 'Assessor', due: 'After prerequisites', href: '/academy/assessment', action: 'View readiness' },
];

const recentActivity = [
  { time: '12:34', kind: 'Lesson', title: 'Continuity opened', status: 'Recorded', detail: 'Learning activity only; no competency inference.' },
  { time: '12:16', kind: 'Simulation', title: 'Authority dependency failed', status: 'HOLD', detail: 'Authority expired before execution time.' },
  { time: '11:52', kind: 'Review', title: 'Evidence conflict preserved', status: 'Open', detail: 'Two records remain materially inconsistent.' },
  { time: '11:28', kind: 'Route', title: 'Boundary revision committed', status: 'Version 4', detail: 'Prior version remains attributable and inspectable.' },
  { time: '10:47', kind: 'Assessment', title: 'Scenario response saved', status: 'Draft', detail: 'Not submitted and not available for evaluation.' },
  { time: '09:58', kind: 'Credential', title: 'Evidence set inspected', status: 'Incomplete', detail: 'Two required artifacts remain absent.' },
];

const competencyDomains = [
  { name: 'Reality identification', score: 82, evidence: 6, state: 'Developing' },
  { name: 'Record integrity', score: 74, evidence: 5, state: 'Developing' },
  { name: 'Continuity testing', score: 61, evidence: 3, state: 'Practice needed' },
  { name: 'Admissibility reasoning', score: 58, evidence: 3, state: 'Practice needed' },
  { name: 'Authority validation', score: 46, evidence: 2, state: 'Early' },
  { name: 'Boundary control', score: 67, evidence: 4, state: 'Developing' },
  { name: 'Execution correspondence', score: 39, evidence: 1, state: 'Early' },
  { name: 'Outcome verification', score: 52, evidence: 2, state: 'Early' },
];

const calendarItems = [
  { date: 'JUL 30', title: 'Architecture orientation', type: 'Learning', status: 'Open' },
  { date: 'AUG 01', title: 'Route construction checkpoint', type: 'Practice', status: 'Planned' },
  { date: 'AUG 03', title: 'Simulation review window', type: 'Review', status: 'Planned' },
  { date: 'AUG 05', title: 'Evidence completeness check', type: 'Evidence', status: 'Planned' },
  { date: 'AUG 07', title: 'Assessment readiness review', type: 'Assessment', status: 'Conditional' },
];

const systemConnections = [
  { code: 'RB', title: 'Route Builder', description: 'Construct consequence-bearing routes with bounded questions and preserved gaps.', href: '/workspace/build', state: 'Connected' },
  { code: 'VR', title: 'Verification', description: 'Inspect preserved records and challenge claims without duplicating authority.', href: '/verify', state: 'Connected' },
  { code: 'RG', title: 'Registry', description: 'Receive authorized credential events after a valid credential decision.', href: '/registry', state: 'Authoritative' },
  { code: 'GR', title: 'Governed Records', description: 'Create and interpret records that remain attributable and versioned.', href: '/records', state: 'Connected' },
  { code: 'GL', title: 'Governance Library', description: 'Inspect laws, standards, frameworks, and source authorities.', href: '/governance-library', state: 'Reference' },
  { code: 'PR', title: 'Partner Review Network', description: 'Escalate bounded work to qualified independent review partners.', href: '/workspace/partner-review-network', state: 'Conditional' },
];

const alerts = [
  { level: 'HOLD', title: 'Credential evidence incomplete', detail: 'Completion cannot be converted into competency without required artifacts.' },
  { level: 'NOTICE', title: 'Three findings remain open', detail: 'Open findings must remain visible through assessment readiness.' },
  { level: 'BOUNDARY', title: 'Academy authority is limited', detail: 'The Academy may teach, guide, simulate, and assess; it may not invent execution authority.' },
  { level: 'SYNC', title: 'Local activity restored', detail: 'Learner progress was recovered from the browser activity record.' },
];

const quickActions = [
  { label: 'Continue learning', href: '/academy/architecture-explorer', icon: '→' },
  { label: 'Build a route', href: '/academy/route-construction-lab', icon: '◇' },
  { label: 'Run simulation', href: '/academy/simulator', icon: '◎' },
  { label: 'Open review', href: '/academy/review', icon: '□' },
  { label: 'Check readiness', href: '/academy/assessment', icon: '✓' },
  { label: 'Inspect credentials', href: '/academy/credential-dashboard', icon: '⌁' },
];


const readinessChecks = [
  { id: 'R-01', label: 'Orientation complete', state: 'SATISFIED', evidence: 'Academy entrance and governing principle acknowledged.', owner: 'Learner' },
  { id: 'R-02', label: 'Architecture distinction understood', state: 'PARTIAL', evidence: 'Eight anchors reviewed; 24-link runtime distinction not yet assessed.', owner: 'Learner' },
  { id: 'R-03', label: 'Route construction demonstrated', state: 'MISSING', evidence: 'No submitted route artifact is available for evaluation.', owner: 'Learner' },
  { id: 'R-04', label: 'Simulation completed', state: 'PARTIAL', evidence: 'Three simulations exist; one requires corrected boundary evidence.', owner: 'Learner' },
  { id: 'R-05', label: 'Review findings resolved', state: 'OPEN', evidence: 'Three material findings remain open and attributable.', owner: 'Learner + reviewer' },
  { id: 'R-06', label: 'Assessment prerequisites met', state: 'HOLD', evidence: 'Prerequisites depend on R-03, R-04, and R-05.', owner: 'Assessment engine' },
  { id: 'R-07', label: 'Credential authority assigned', state: 'UNASSIGNED', evidence: 'No authorized credential decision-maker has been bound.', owner: 'Institution' },
  { id: 'R-08', label: 'Scope statement preserved', state: 'DRAFT', evidence: 'Proposed scope exists but has not been accepted.', owner: 'Learner + assessor' },
];

const governedArtifacts = [
  { type: 'Learning record', title: 'Continuity lesson completion', version: 'v1', state: 'Preserved', date: 'Jul 30, 2026', href: '/academy/continuity' },
  { type: 'Route draft', title: 'Consequential action route', version: 'v4', state: 'Open findings', date: 'Jul 30, 2026', href: '/academy/route-construction-lab' },
  { type: 'Simulation record', title: 'Expired authority condition', version: 'v2', state: 'HOLD', date: 'Jul 30, 2026', href: '/academy/simulator' },
  { type: 'Review record', title: 'Evidence conflict review', version: 'v1', state: 'Challenge open', date: 'Jul 30, 2026', href: '/academy/review' },
  { type: 'Assessment draft', title: 'Admissibility scenario response', version: 'Draft', state: 'Not submitted', date: 'Jul 30, 2026', href: '/academy/assessment' },
  { type: 'Credential evidence', title: 'Foundations evidence set', version: 'v3', state: 'Incomplete', date: 'Jul 30, 2026', href: '/academy/credential-dashboard' },
];

const instructorSignals = [
  { label: 'Learners requiring review', value: '12', change: '+3 today' },
  { label: 'Open material findings', value: '19', change: 'Across 8 learners' },
  { label: 'Assessment holds', value: '7', change: 'Prerequisites unmet' },
  { label: 'Credential decisions due', value: '4', change: 'Authority assigned' },
];

const institutionalControls = [
  { title: 'Accreditation Center', description: 'Manage institutional standards, findings, corrective actions, and renewal evidence.', href: '/academy/accreditation-center', status: 'Operational' },
  { title: 'Instructor Management', description: 'Preserve instructor qualifications, scope, assignments, and authorization periods.', href: '/academy/instructor-management-center', status: 'Operational' },
  { title: 'Certification Engine', description: 'Evaluate bounded credential conditions without converting attendance into competency.', href: '/academy/certification-engine', status: 'Controlled' },
  { title: 'Enterprise Management', description: 'Coordinate cohorts, programs, institutional roles, and governance boundaries.', href: '/academy/enterprise-management', status: 'Operational' },
  { title: 'Lesson Builder', description: 'Create governed learning experiences with explicit outcomes and evidence requirements.', href: '/academy/lesson-builder', status: 'Authoring' },
  { title: 'Instructor Console', description: 'Review learner activity, findings, evidence sets, and assessment readiness.', href: '/academy/instructor-console', status: 'Operational' },
];

const architectureLinks = [
  { n: '01', anchor: 'Reality', question: 'What is actually true now?', proof: 'Current, attributable observation', failure: 'Assumption substituted for reality' },
  { n: '02', anchor: 'Record', question: 'What has been preserved?', proof: 'Traceable record with provenance', failure: 'Unattributed or altered record' },
  { n: '03', anchor: 'Continuity', question: 'Has the chain remained intact?', proof: 'Unbroken correspondence across time', failure: 'Gap, drift, or dependency change' },
  { n: '04', anchor: 'Admissibility', question: 'May this evidence support this action?', proof: 'Scope-appropriate evidence determination', failure: 'Evidence present but unusable' },
  { n: '05', anchor: 'Binding', question: 'Is valid authority attached?', proof: 'Current authority within boundary', failure: 'Authority absent, expired, or exceeded' },
  { n: '06', anchor: 'Commit', question: 'What exact state was approved?', proof: 'Versioned authorized state', failure: 'Execution uses an uncommitted state' },
  { n: '07', anchor: 'Execution', question: 'Does action still correspond?', proof: 'Pre-action revalidation and match', failure: 'Execution diverges from approval' },
  { n: '08', anchor: 'Outcome', question: 'What happened in reality?', proof: 'Preserved, challengeable outcome', failure: 'Consequence without verification' },
];

export default function AcademyMissionControlPage() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'learning' | 'evidence' | 'operations'>('overview');
  const [query, setQuery] = useState('');
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  useEffect(() => {
    setCompletedLessons(readCompletedLessons());
    setHydrated(true);
  }, []);

  const completedCount = useMemo(
    () =>
      lessons.filter((lesson) => completedLessons.includes(lesson.href)).length,
    [completedLessons],
  );

  const progress = Math.round((completedCount / lessons.length) * 100);
  const nextLesson =
    lessons.find((lesson) => !completedLessons.includes(lesson.href)) ??
    lessons[lessons.length - 1];

  const filteredActivity = recentActivity.filter((item) =>
    `${item.kind} ${item.title} ${item.status} ${item.detail}`.toLowerCase().includes(query.toLowerCase()),
  );

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.includes(alert.title));

  return (
    <main className="missionControl">
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
            <strong>Academy Mission Control</strong>
            <small>Seventh major door of the Exchange</small>
          </span>
        </Link>

        <nav aria-label="Mission Control navigation">
          <Link href="/academy">Academy</Link>
          <Link href="/workspace/build">Route Builder</Link>
          <Link href="/verify">Verification</Link>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">TA-14 Academy · Mission Control</p>
          <h1>Continue the work from one governed center.</h1>
          <p className="heroCopy">
            Resume learning, move into practice, challenge a determination, or
            demonstrate competency without duplicating the authoritative systems
            already inside the Exchange.
          </p>
        </div>

        <aside className="principle">
          <span>Governing principle</span>
          <strong>No admissible evidence. No admissible execution.</strong>
        </aside>
      </section>

      <section className="overviewGrid" aria-label="Academy progress overview">
        <article className="primaryPanel">
          <div className="panelHeading">
            <div>
              <p className="eyebrow">Resume learning</p>
              <h2>{nextLesson.title}</h2>
            </div>
            <span className="lessonNumber">{nextLesson.number}</span>
          </div>

          <p>{nextLesson.description}</p>

          <div className="meterCopy">
            <span>Academy progress</span>
            <strong>{hydrated ? `${progress}%` : '—'}</strong>
          </div>
          <div className="meter" aria-label={`${progress}% complete`}>
            <span style={{ width: hydrated ? `${progress}%` : '0%' }} />
          </div>

          <div className="panelActions">
            <Link className="primaryButton" href={nextLesson.href}>
              Continue lesson <b aria-hidden="true">→</b>
            </Link>
            <Link className="secondaryButton" href="/academy/start">
              Revisit orientation
            </Link>
          </div>
        </article>

        <article className="statusPanel">
          <p className="eyebrow">Current pathway</p>
          <h2>Execution Admissibility Foundations</h2>
          <dl>
            <div>
              <dt>Lessons complete</dt>
              <dd>{hydrated ? `${completedCount} of ${lessons.length}` : '—'}</dd>
            </div>
            <div>
              <dt>Training mode</dt>
              <dd>Self-directed</dd>
            </div>
            <div>
              <dt>Credential status</dt>
              <dd>Not yet evaluated</dd>
            </div>
          </dl>
          <p className="boundaryNotice">
            Completion records learning activity. It does not create execution
            authority or independently establish competency.
          </p>
        </article>
      </section>

      <section className="sectionBlock">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Learning pathway</p>
            <h2>Eight visible anchors. One continuous governing movement.</h2>
          </div>
          <p>
            These lessons orient the public eight-anchor chain while preserving
            the distinction from TA-14&apos;s complete 24-link runtime architecture.
          </p>
        </div>

        <div className="lessonGrid">
          {lessons.map((lesson) => {
            const complete = completedLessons.includes(lesson.href);

            return (
              <Link className="lessonCard" href={lesson.href} key={lesson.href}>
                <div className="lessonTopline">
                  <span>{lesson.number}</span>
                  <small className={complete ? 'complete' : ''}>
                    {complete ? 'Complete' : 'Available'}
                  </small>
                </div>
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                <b>Open lesson →</b>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="sectionBlock">
        <div className="sectionHeading compact">
          <div>
            <p className="eyebrow">Practice and proof</p>
            <h2>Move from understanding into governed action.</h2>
          </div>
        </div>

        <div className="controlGrid">
          {controlCards.map((card) => (
            <article className="controlCard" key={card.title}>
              <p className="eyebrow">{card.eyebrow}</p>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link href={card.href}>{card.action} →</Link>
            </article>
          ))}
        </div>
      </section>


      <section className="commandBar" aria-label="Mission Control views">
        <div className="viewTabs">
          {(['overview', 'learning', 'evidence', 'operations'] as const).map((view) => (
            <button
              className={activeView === view ? 'active' : ''}
              key={view}
              onClick={() => setActiveView(view)}
              type="button"
            >
              {view}
            </button>
          ))}
        </div>
        <label className="missionSearch">
          <span>Search activity</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Lessons, findings, simulations, records…"
            type="search"
            value={query}
          />
        </label>
      </section>

      <section className="sectionBlock metricSection">
        <div className="sectionHeading compact">
          <div>
            <p className="eyebrow">Operational picture</p>
            <h2>One bounded view of learning, evidence, and readiness.</h2>
          </div>
          <span className="liveIndicator"><i /> Local activity available</span>
        </div>
        <div className="metricGrid">
          {missionMetrics.map((metric) => (
            <article className={`metricCard ${metric.tone}`} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.detail}</small>
            </article>
          ))}
        </div>
      </section>

      {visibleAlerts.length > 0 && (
        <section className="sectionBlock alertSection">
          <div className="sectionHeading compact">
            <div>
              <p className="eyebrow">Attention required</p>
              <h2>Conditions that must remain visible.</h2>
            </div>
          </div>
          <div className="alertStack">
            {visibleAlerts.map((alert) => (
              <article className="alertRow" key={alert.title}>
                <span className={`alertLevel level${alert.level}`}>{alert.level}</span>
                <div>
                  <h3>{alert.title}</h3>
                  <p>{alert.detail}</p>
                </div>
                <button
                  aria-label={`Dismiss ${alert.title}`}
                  onClick={() => setDismissedAlerts((current) => [...current, alert.title])}
                  type="button"
                >
                  Dismiss
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {(activeView === 'overview' || activeView === 'learning') && (
        <section className="sectionBlock">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">Pathway control</p>
              <h2>Progress without collapsing completion into permission.</h2>
            </div>
            <p>
              Each stage records what happened, what remains unresolved, and what
              conditions must be satisfied before the next stage becomes available.
            </p>
          </div>
          <div className="pathwayBoard">
            {pathwayStages.map((stage, index) => (
              <article className={`pathwayRow state${stage.state.replaceAll(' ', '')}`} key={stage.number}>
                <div className="pathwayIndex">{stage.number}</div>
                <div className="pathwayContent">
                  <div className="pathwayTitleline">
                    <h3>{stage.title}</h3>
                    <span>{stage.state}</span>
                  </div>
                  <p>{stage.detail}</p>
                </div>
                <Link href={stage.href}>{stage.state === 'Locked' ? 'Inspect condition' : 'Open stage'} →</Link>
                {index < pathwayStages.length - 1 && <i className="pathwayConnector" aria-hidden="true" />}
              </article>
            ))}
          </div>
        </section>
      )}

      {(activeView === 'overview' || activeView === 'operations') && (
        <section className="sectionBlock splitSection">
          <div className="queuePanel">
            <div className="sectionHeading compact">
              <div>
                <p className="eyebrow">Action queue</p>
                <h2>What needs attention next.</h2>
              </div>
            </div>
            <div className="queueList">
              {actionQueue.map((item) => (
                <article className="queueItem" key={item.title}>
                  <span className="queuePriority">{item.priority}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.owner} · {item.due}</p>
                  </div>
                  <Link href={item.href}>{item.action} →</Link>
                </article>
              ))}
            </div>
          </div>

          <aside className="quickPanel">
            <p className="eyebrow">Quick actions</p>
            <h2>Move directly into governed work.</h2>
            <div className="quickGrid">
              {quickActions.map((action) => (
                <Link href={action.href} key={action.label}>
                  <span>{action.icon}</span>
                  <strong>{action.label}</strong>
                </Link>
              ))}
            </div>
            <div className="authorityBoundary">
              <strong>Academy boundary</strong>
              <p>
                These actions may create learning and practice records. They do
                not create real-world execution authority unless an authoritative
                Exchange system separately establishes it.
              </p>
            </div>
          </aside>
        </section>
      )}

      {(activeView === 'overview' || activeView === 'evidence') && (
        <section className="sectionBlock">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">Competency evidence</p>
              <h2>Capability must be demonstrated by domain and scope.</h2>
            </div>
            <p>
              Scores are learning indicators, not credentials. Evidence quantity
              does not establish quality, admissibility, or authority by itself.
            </p>
          </div>
          <div className="competencyGrid">
            {competencyDomains.map((domain) => (
              <article className="competencyCard" key={domain.name}>
                <div className="competencyTopline">
                  <h3>{domain.name}</h3>
                  <span>{domain.score}%</span>
                </div>
                <div className="competencyMeter" aria-label={`${domain.name}: ${domain.score}%`}>
                  <span style={{ width: `${domain.score}%` }} />
                </div>
                <div className="competencyMeta">
                  <span>{domain.evidence} evidence items</span>
                  <strong>{domain.state}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="sectionBlock splitSection activitySection">
        <div className="activityPanel">
          <div className="sectionHeading compact">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h2>Attributable learning events.</h2>
            </div>
            <span>{filteredActivity.length} shown</span>
          </div>
          <div className="activityTable" role="table" aria-label="Recent Academy activity">
            <div className="activityHeader" role="row">
              <span>Time</span><span>Type</span><span>Event</span><span>Status</span>
            </div>
            {filteredActivity.map((item) => (
              <article className="activityRow" role="row" key={`${item.time}-${item.title}`}>
                <time>{item.time}</time>
                <span className="activityKind">{item.kind}</span>
                <div><strong>{item.title}</strong><small>{item.detail}</small></div>
                <span className="activityStatus">{item.status}</span>
              </article>
            ))}
            {filteredActivity.length === 0 && (
              <div className="emptyState">No activity matches “{query}”.</div>
            )}
          </div>
        </div>

        <aside className="calendarPanel">
          <p className="eyebrow">Milestones</p>
          <h2>Upcoming pathway events.</h2>
          <div className="calendarList">
            {calendarItems.map((item) => (
              <article key={`${item.date}-${item.title}`}>
                <time>{item.date}</time>
                <div><strong>{item.title}</strong><span>{item.type}</span></div>
                <small>{item.status}</small>
              </article>
            ))}
          </div>
          <Link className="calendarAction" href="/academy/routes">Open pathway plan →</Link>
        </aside>
      </section>

      <section className="sectionBlock">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Connected architecture</p>
            <h2>Use existing Exchange systems. Do not duplicate authority.</h2>
          </div>
          <p>
            Mission Control provides orientation and continuity. Authoritative
            records, verification events, and credential decisions remain in the
            systems established to govern them.
          </p>
        </div>
        <div className="systemGrid">
          {systemConnections.map((system) => (
            <Link className="systemCard" href={system.href} key={system.title}>
              <span className="systemCode">{system.code}</span>
              <div>
                <small>{system.state}</small>
                <h3>{system.title}</h3>
                <p>{system.description}</p>
              </div>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>


      <section className="sectionBlock">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Readiness control matrix</p>
            <h2>Every prerequisite remains explicit and independently inspectable.</h2>
          </div>
          <p>
            Mission Control does not average missing conditions into a favorable
            score. A material prerequisite remains unsatisfied until the required
            evidence and authority are actually present.
          </p>
        </div>
        <div className="readinessMatrix">
          <div className="matrixHeader">
            <span>ID</span><span>Condition</span><span>State</span><span>Evidence</span><span>Owner</span>
          </div>
          {readinessChecks.map((check) => (
            <article className="matrixRow" key={check.id}>
              <strong>{check.id}</strong>
              <span>{check.label}</span>
              <b className={`matrixState state${check.state}`}>{check.state}</b>
              <p>{check.evidence}</p>
              <small>{check.owner}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionBlock">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Governed artifacts</p>
            <h2>The work product remains attributable, versioned, and challengeable.</h2>
          </div>
          <p>
            These artifacts are learning and practice records unless an
            authoritative Exchange process explicitly promotes them into another
            governed record type.
          </p>
        </div>
        <div className="artifactLedger">
          {governedArtifacts.map((artifact) => (
            <Link className="artifactRecord" href={artifact.href} key={`${artifact.type}-${artifact.title}`}>
              <div className="artifactGlyph">{artifact.type.slice(0, 2).toUpperCase()}</div>
              <div className="artifactIdentity">
                <small>{artifact.type}</small>
                <h3>{artifact.title}</h3>
              </div>
              <div className="artifactVersion"><span>Version</span><strong>{artifact.version}</strong></div>
              <div className="artifactState"><span>State</span><strong>{artifact.state}</strong></div>
              <time>{artifact.date}</time>
              <b className="artifactOpen">Open ↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="sectionBlock instructorSection">
        <div className="instructorSummary">
          <p className="eyebrow">Instructor and assessor view</p>
          <h2>Operational signals without silent learner determinations.</h2>
          <p>
            Authorized instructors and assessors may inspect evidence and record
            findings. The interface must not infer competency, waive a condition,
            or issue a credential without an attributable decision.
          </p>
          <Link href="/academy/instructor-console">Open instructor console →</Link>
        </div>
        <div className="instructorSignals">
          {instructorSignals.map((signal) => (
            <article key={signal.label}>
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
              <small>{signal.change}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionBlock">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Institutional controls</p>
            <h2>Operate the Academy without creating a duplicate institution.</h2>
          </div>
          <p>
            Administrative capabilities remain connected to one Academy, one
            credential architecture, and the existing authoritative Registry.
          </p>
        </div>
        <div className="institutionGrid">
          {institutionalControls.map((control, index) => (
            <Link className="institutionCard" href={control.href} key={control.title}>
              <span className="institutionNumber">{String(index + 1).padStart(2, '0')}</span>
              <small>{control.status}</small>
              <h3>{control.title}</h3>
              <p>{control.description}</p>
              <b>Open control center →</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="sectionBlock architectureSection">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Architecture correspondence</p>
            <h2>Eight visible anchors guide the public learning movement.</h2>
          </div>
          <p>
            This orientation does not replace or compress TA-14&apos;s verified
            complete 24-link runtime architecture. It gives learners a visible
            movement they can inspect before entering the deeper system.
          </p>
        </div>
        <div className="architectureTable">
          {architectureLinks.map((link) => (
            <article key={link.n}>
              <span className="architectureNumber">{link.n}</span>
              <div className="architectureAnchor"><strong>{link.anchor}</strong><small>{link.question}</small></div>
              <div className="architectureProof"><span>Required proof</span><p>{link.proof}</p></div>
              <div className="architectureFailure"><span>Typical failure</span><p>{link.failure}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionBlock integrityBand">
        <div className="integrityMark">24</div>
        <div>
          <p className="eyebrow">Runtime integrity</p>
          <h2>The complete chain must survive before consequence binds to reality.</h2>
          <p>
            Mission Control helps the learner see progress, unresolved conditions,
            open findings, and evidence gaps. It never converts visibility into
            admissibility and never converts learning completion into execution permission.
          </p>
        </div>
        <div className="integrityStates">
          <span>ALLOW</span><span className="active">HOLD</span><span>DENY</span><span>ESCALATE</span>
        </div>
      </section>

      <section className="decisionBand">
        <div>
          <p className="eyebrow">Readiness determination</p>
          <h2>Not ready for credential evaluation.</h2>
          <p>
            The current record shows meaningful progress, but competency evidence,
            open findings, and assessment prerequisites remain incomplete.
          </p>
        </div>
        <div className="decisionState">
          <span>Current state</span>
          <strong>HOLD</strong>
          <small>Continue learning and preserve the missing evidence.</small>
        </div>
        <Link href="/academy/credential-dashboard">Inspect credential record →</Link>
      </section>

      <section className="exchangeBand">
        <div>
          <p className="eyebrow">Connected Exchange systems</p>
          <h2>The Academy teaches. The authoritative systems remain authoritative.</h2>
        </div>
        <div className="exchangeLinks">
          <Link href="/workspace/build">Build a governed route</Link>
          <Link href="/registry">Open the Registry</Link>
          <Link href="/verify">Verify a record</Link>
        </div>
      </section>

      <style jsx>{`
        .missionControl {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #eff8ff;
          background:
            radial-gradient(circle at 12% 12%, rgba(44, 194, 255, .12), transparent 30%),
            radial-gradient(circle at 88% 24%, rgba(103, 74, 255, .13), transparent 32%),
            linear-gradient(180deg, #02070d 0%, #07111d 52%, #030910 100%);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .cosmos,
        .glow,
        .stars {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .glow {
          width: 360px;
          height: 360px;
          border-radius: 50%;
          filter: blur(70px);
          opacity: .18;
        }

        .glowOne {
          inset: 18% auto auto -120px;
          background: #43e3ff;
        }

        .glowTwo {
          inset: auto -130px 8% auto;
          background: #7258ff;
        }

        .stars {
          opacity: .34;
          background-image:
            radial-gradient(circle, rgba(255,255,255,.76) 0 1px, transparent 1.2px),
            radial-gradient(circle, rgba(104,230,255,.48) 0 1px, transparent 1.2px);
          background-size: 170px 170px, 250px 250px;
          background-position: 0 0, 60px 80px;
        }

        .starsTwo {
          opacity: .17;
          transform: scale(1.1);
          background-size: 310px 310px, 410px 410px;
        }

        .topbar,
        .hero,
        .overviewGrid,
        .sectionBlock,
        .exchangeBand {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 40px));
          margin-inline: auto;
        }

        .topbar {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(123, 169, 205, .14);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 13px;
          color: inherit;
          text-decoration: none;
        }

        .mark {
          display: grid;
          place-items: center;
          min-width: 58px;
          height: 38px;
          border: 1px solid rgba(84, 232, 255, .42);
          border-radius: 12px;
          color: #80efff;
          background: rgba(84, 232, 255, .08);
          font-size: .76rem;
          font-weight: 950;
          letter-spacing: .08em;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          font-size: .96rem;
        }

        .brand small {
          margin-top: 3px;
          color: #8197aa;
          font-size: .7rem;
        }

        nav {
          display: flex;
          gap: 22px;
        }

        nav a {
          color: #a9bdcd;
          font-size: .82rem;
          font-weight: 800;
          text-decoration: none;
        }

        nav a:hover {
          color: #73eaff;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.35fr .65fr;
          gap: 54px;
          align-items: end;
          padding: 76px 0 48px;
        }

        .eyebrow {
          margin: 0 0 11px;
          color: #5ce8ff;
          font-size: .7rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 760px;
          margin-bottom: 20px;
          font-size: clamp(2.8rem, 6vw, 5.4rem);
          line-height: .97;
          letter-spacing: -.055em;
        }

        .heroCopy {
          max-width: 750px;
          margin-bottom: 0;
          color: #a9bdcd;
          font-size: 1.04rem;
          line-height: 1.75;
        }

        .principle {
          padding: 23px;
          border: 1px solid rgba(84, 232, 255, .22);
          border-radius: 22px;
          background: rgba(3, 14, 24, .76);
          box-shadow: 0 20px 70px rgba(0,0,0,.25);
        }

        .principle span {
          display: block;
          margin-bottom: 8px;
          color: #7f96a9;
          font-size: .68rem;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .principle strong {
          font-size: 1.03rem;
          line-height: 1.45;
        }

        .overviewGrid {
          display: grid;
          grid-template-columns: 1.35fr .65fr;
          gap: 22px;
          padding-bottom: 70px;
        }

        .primaryPanel,
        .statusPanel,
        .lessonCard,
        .controlCard {
          border: 1px solid rgba(125, 170, 205, .16);
          background: linear-gradient(180deg, rgba(11, 27, 43, .82), rgba(4, 13, 23, .86));
          box-shadow: 0 24px 80px rgba(0,0,0,.22);
          backdrop-filter: blur(16px);
        }

        .primaryPanel,
        .statusPanel {
          border-radius: 26px;
          padding: 28px;
        }

        .panelHeading {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: flex-start;
        }

        .panelHeading h2,
        .statusPanel h2,
        .sectionHeading h2,
        .exchangeBand h2 {
          margin-bottom: 12px;
          font-size: clamp(1.55rem, 3vw, 2.4rem);
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .primaryPanel > p,
        .sectionHeading > p,
        .controlCard > p,
        .lessonCard > p {
          color: #96aabd;
          line-height: 1.65;
        }

        .lessonNumber {
          color: #5ce8ff;
          font-size: 2rem;
          font-weight: 950;
          opacity: .72;
        }

        .meterCopy {
          display: flex;
          justify-content: space-between;
          margin: 28px 0 9px;
          color: #9fb3c5;
          font-size: .78rem;
          font-weight: 850;
        }

        .meter {
          height: 8px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(127, 166, 198, .13);
        }

        .meter span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #54e8ff, #39f2a1);
          box-shadow: 0 0 16px rgba(57, 242, 161, .4);
          transition: width .35s ease;
        }

        .panelActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 25px;
        }

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          min-height: 46px;
          padding: 0 17px;
          border-radius: 13px;
          font-size: .82rem;
          font-weight: 900;
          text-decoration: none;
        }

        .primaryButton {
          color: #021018;
          background: linear-gradient(90deg, #65eaff, #3df2a4);
        }

        .secondaryButton {
          border: 1px solid rgba(137, 180, 214, .20);
          color: #dbe9f4;
          background: rgba(255,255,255,.03);
        }

        .statusPanel dl {
          margin: 24px 0;
        }

        .statusPanel dl div {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 13px 0;
          border-bottom: 1px solid rgba(125, 170, 205, .11);
        }

        .statusPanel dt {
          color: #8499ac;
          font-size: .78rem;
          font-weight: 800;
        }

        .statusPanel dd {
          margin: 0;
          color: #e9f5fd;
          font-size: .8rem;
          font-weight: 900;
          text-align: right;
        }

        .boundaryNotice {
          margin-bottom: 0;
          padding: 15px;
          border: 1px solid rgba(255, 194, 82, .18);
          border-radius: 14px;
          color: #d7c9a7;
          background: rgba(255, 194, 82, .05);
          font-size: .77rem;
          line-height: 1.55;
        }

        .sectionBlock {
          padding: 72px 0;
          border-top: 1px solid rgba(125, 170, 205, .12);
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: 1.25fr .75fr;
          gap: 42px;
          align-items: end;
          margin-bottom: 30px;
        }

        .sectionHeading.compact {
          grid-template-columns: 1fr;
        }

        .sectionHeading > p {
          margin-bottom: 0;
          font-size: .92rem;
        }

        .lessonGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .lessonCard {
          min-height: 245px;
          padding: 21px;
          border-radius: 20px;
          color: inherit;
          text-decoration: none;
          transition: transform .2s ease, border-color .2s ease, background .2s ease;
        }

        .lessonCard:hover {
          transform: translateY(-4px);
          border-color: rgba(84, 232, 255, .40);
          background: linear-gradient(180deg, rgba(16, 38, 58, .92), rgba(5, 16, 27, .92));
        }

        .lessonTopline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .lessonTopline span {
          color: #5ce8ff;
          font-weight: 950;
        }

        .lessonTopline small {
          padding: 5px 8px;
          border-radius: 999px;
          color: #9eb2c3;
          background: rgba(255,255,255,.04);
          font-size: .62rem;
          font-weight: 900;
        }

        .lessonTopline small.complete {
          color: #66f2b3;
          background: rgba(57, 242, 161, .08);
        }

        .lessonCard h3,
        .controlCard h3 {
          margin-bottom: 10px;
          font-size: 1.12rem;
          line-height: 1.25;
        }

        .lessonCard > p,
        .controlCard > p {
          font-size: .82rem;
        }

        .lessonCard > b {
          display: block;
          margin-top: 20px;
          color: #64e9ff;
          font-size: .76rem;
        }

        .controlGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .controlCard {
          padding: 25px;
          border-radius: 22px;
        }

        .controlCard a {
          display: inline-block;
          margin-top: 12px;
          color: #65e9ff;
          font-size: .8rem;
          font-weight: 900;
          text-decoration: none;
        }

        .exchangeBand {
          display: grid;
          grid-template-columns: 1.25fr .75fr;
          gap: 40px;
          align-items: center;
          margin-bottom: 72px;
          padding: 34px;
          border: 1px solid rgba(84, 232, 255, .18);
          border-radius: 26px;
          background:
            radial-gradient(circle at 100% 0%, rgba(84, 232, 255, .10), transparent 35%),
            rgba(5, 17, 29, .82);
        }

        .exchangeLinks {
          display: grid;
          gap: 10px;
        }

        .exchangeLinks a {
          padding: 13px 15px;
          border: 1px solid rgba(126, 172, 207, .16);
          border-radius: 13px;
          color: #dcebf5;
          background: rgba(255,255,255,.03);
          font-size: .8rem;
          font-weight: 850;
          text-decoration: none;
        }

        @media (max-width: 980px) {
          .hero,
          .overviewGrid,
          .sectionHeading,
          .exchangeBand {
            grid-template-columns: 1fr;
          }

          .lessonGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .topbar {
            align-items: flex-start;
            padding: 18px 0;
          }

          nav {
            display: none;
          }

          .hero {
            padding-top: 54px;
          }

          .lessonGrid,
          .controlGrid {
            grid-template-columns: 1fr;
          }

          .panelHeading {
            align-items: center;
          }
        }

        .commandBar {
          position: relative;
          z-index: 3;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto 34px;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border: 1px solid rgba(125,170,205,.16);
          border-radius: 20px;
          background: rgba(5,16,27,.82);
          box-shadow: 0 18px 60px rgba(0,0,0,.22);
          backdrop-filter: blur(18px);
        }

        .viewTabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .viewTabs button {
          padding: 10px 14px;
          border: 1px solid transparent;
          border-radius: 12px;
          color: #8fa8ba;
          background: transparent;
          font: inherit;
          font-size: .74rem;
          font-weight: 900;
          text-transform: capitalize;
          cursor: pointer;
        }
        .viewTabs button:hover,
        .viewTabs button.active {
          color: #eafaff;
          border-color: rgba(92,232,255,.3);
          background: rgba(92,232,255,.1);
        }
        .missionSearch { min-width: min(390px, 100%); }
        .missionSearch span {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
        }
        .missionSearch input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid rgba(125,170,205,.18);
          border-radius: 12px;
          outline: none;
          color: #eff8ff;
          background: rgba(2,9,16,.8);
          font: inherit;
          font-size: .78rem;
        }
        .missionSearch input:focus {
          border-color: rgba(92,232,255,.58);
          box-shadow: 0 0 0 3px rgba(92,232,255,.08);
        }
        .metricSection { padding-top: 34px; }
        .liveIndicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #9cb2c2;
          font-size: .72rem;
          font-weight: 800;
        }
        .liveIndicator i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #57e4a0;
          box-shadow: 0 0 18px rgba(87,228,160,.7);
        }
        .metricGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }
        .metricCard {
          min-height: 152px;
          padding: 21px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(125,170,205,.15);
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(12,30,47,.84), rgba(4,13,23,.88));
        }
        .metricCard > span {
          color: #829bad;
          font-size: .7rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .metricCard strong {
          margin: 14px 0 8px;
          font-size: 1.65rem;
          letter-spacing: -.03em;
        }
        .metricCard small {
          color: #8fa7b8;
          line-height: 1.45;
        }
        .metricCard.cyan { border-top-color: rgba(92,232,255,.55); }
        .metricCard.violet { border-top-color: rgba(153,120,255,.55); }
        .metricCard.amber { border-top-color: rgba(255,188,92,.55); }
        .metricCard.rose { border-top-color: rgba(255,111,143,.55); }
        .metricCard.green { border-top-color: rgba(87,228,160,.55); }
        .metricCard.slate { border-top-color: rgba(170,190,207,.45); }
        .alertSection { padding-top: 22px; }
        .alertStack {
          display: grid;
          gap: 11px;
        }
        .alertRow {
          display: grid;
          grid-template-columns: 92px 1fr auto;
          gap: 18px;
          align-items: center;
          padding: 18px 20px;
          border: 1px solid rgba(125,170,205,.14);
          border-radius: 17px;
          background: rgba(7,20,33,.78);
        }
        .alertLevel {
          display: inline-grid;
          place-items: center;
          min-height: 32px;
          border-radius: 10px;
          font-size: .65rem;
          font-weight: 950;
          letter-spacing: .08em;
        }
        .levelHOLD {
          color: #ffd9a0;
          background: rgba(255,171,64,.13);
          border: 1px solid rgba(255,171,64,.3);
        }
        .levelNOTICE {
          color: #bdefff;
          background: rgba(92,232,255,.1);
          border: 1px solid rgba(92,232,255,.25);
        }
        .levelBOUNDARY {
          color: #d8c9ff;
          background: rgba(153,120,255,.12);
          border: 1px solid rgba(153,120,255,.28);
        }
        .levelSYNC {
          color: #bdf8d8;
          background: rgba(87,228,160,.1);
          border: 1px solid rgba(87,228,160,.25);
        }
        .alertRow h3 {
          margin-bottom: 5px;
          font-size: .95rem;
        }
        .alertRow p {
          margin: 0;
          color: #8fa6b8;
          font-size: .78rem;
          line-height: 1.5;
        }
        .alertRow button {
          border: 0;
          color: #8fa8ba;
          background: transparent;
          font: inherit;
          font-size: .7rem;
          font-weight: 850;
          cursor: pointer;
        }
        .alertRow button:hover { color: #effaff; }
        .pathwayBoard {
          display: grid;
          gap: 12px;
        }
        .pathwayRow {
          position: relative;
          display: grid;
          grid-template-columns: 54px 1fr auto;
          gap: 18px;
          align-items: center;
          padding: 19px 20px;
          border: 1px solid rgba(125,170,205,.14);
          border-radius: 18px;
          background: linear-gradient(90deg, rgba(10,27,43,.84), rgba(5,16,27,.78));
        }
        .pathwayIndex {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 13px;
          color: #74eaff;
          background: rgba(92,232,255,.08);
          font-size: .72rem;
          font-weight: 950;
        }
        .pathwayTitleline {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pathwayTitleline h3 {
          margin: 0;
          font-size: 1rem;
        }
        .pathwayTitleline span {
          padding: 5px 8px;
          border-radius: 999px;
          color: #9db2c1;
          background: rgba(255,255,255,.04);
          font-size: .62rem;
          font-weight: 900;
        }
        .pathwayContent p {
          margin: 6px 0 0;
          color: #8fa7b8;
          font-size: .78rem;
        }
        .pathwayRow > a {
          color: #74eaff;
          font-size: .73rem;
          font-weight: 900;
          text-decoration: none;
        }
        .stateLocked { opacity: .62; }
        .stateActive {
          border-color: rgba(92,232,255,.35);
          box-shadow: inset 3px 0 0 #5ce8ff;
        }
        .stateComplete { border-color: rgba(87,228,160,.22); }
        .splitSection {
          display: grid;
          grid-template-columns: 1.35fr .65fr;
          gap: 20px;
        }
        .queuePanel,
        .quickPanel,
        .activityPanel,
        .calendarPanel {
          padding: 26px;
          border: 1px solid rgba(125,170,205,.15);
          border-radius: 24px;
          background: linear-gradient(180deg, rgba(10,27,43,.82), rgba(4,13,23,.88));
        }
        .queueList {
          display: grid;
          gap: 10px;
        }
        .queueItem {
          display: grid;
          grid-template-columns: 72px 1fr auto;
          gap: 15px;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid rgba(125,170,205,.1);
        }
        .queueItem:last-child { border-bottom: 0; }
        .queuePriority {
          color: #72e9ff;
          font-size: .65rem;
          font-weight: 950;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .queueItem h3 {
          margin: 0 0 4px;
          font-size: .88rem;
        }
        .queueItem p {
          margin: 0;
          color: #8099ab;
          font-size: .7rem;
        }
        .queueItem a {
          color: #bfefff;
          font-size: .7rem;
          font-weight: 900;
          text-decoration: none;
        }
        .quickPanel h2,
        .calendarPanel h2 {
          font-size: 1.5rem;
          letter-spacing: -.03em;
        }
        .quickGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin: 22px 0;
        }
        .quickGrid a {
          min-height: 88px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(125,170,205,.14);
          border-radius: 14px;
          color: #eaf8ff;
          background: rgba(255,255,255,.025);
          text-decoration: none;
        }
        .quickGrid a:hover {
          border-color: rgba(92,232,255,.35);
          background: rgba(92,232,255,.07);
        }
        .quickGrid span { color: #65e8ff; }
        .quickGrid strong {
          font-size: .74rem;
          line-height: 1.25;
        }
        .authorityBoundary {
          padding: 16px;
          border-radius: 15px;
          background: rgba(255,171,64,.07);
          border: 1px solid rgba(255,171,64,.18);
        }
        .authorityBoundary strong {
          color: #ffd69a;
          font-size: .72rem;
        }
        .authorityBoundary p {
          margin: 7px 0 0;
          color: #a99578;
          font-size: .7rem;
          line-height: 1.55;
        }
        .competencyGrid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 14px;
        }
        .competencyCard {
          padding: 19px;
          border: 1px solid rgba(125,170,205,.14);
          border-radius: 18px;
          background: rgba(7,20,33,.78);
        }
        .competencyTopline {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 12px;
        }
        .competencyTopline h3 {
          margin: 0;
          font-size: .82rem;
          line-height: 1.35;
        }
        .competencyTopline > span {
          color: #6ceaff;
          font-size: .72rem;
          font-weight: 950;
        }
        .competencyMeter {
          height: 6px;
          margin: 18px 0 13px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.06);
        }
        .competencyMeter span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg,#5ce8ff,#9679ff);
        }
        .competencyMeta {
          display: flex;
          justify-content: space-between;
          gap: 9px;
          color: #8098aa;
          font-size: .63rem;
        }
        .competencyMeta strong { color: #afc2cf; }
        .activitySection { align-items: start; }
        .activityPanel .sectionHeading > span {
          color: #7f98aa;
          font-size: .7rem;
        }
        .activityTable {
          overflow: hidden;
          border: 1px solid rgba(125,170,205,.1);
          border-radius: 15px;
        }
        .activityHeader,
        .activityRow {
          display: grid;
          grid-template-columns: 58px 78px 1fr 92px;
          gap: 12px;
          align-items: center;
        }
        .activityHeader {
          padding: 10px 13px;
          color: #728b9d;
          background: rgba(255,255,255,.025);
          font-size: .6rem;
          font-weight: 950;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .activityRow {
          padding: 14px 13px;
          border-top: 1px solid rgba(125,170,205,.09);
        }
        .activityRow time {
          color: #728b9d;
          font-size: .67rem;
        }
        .activityKind {
          color: #6de9ff;
          font-size: .65rem;
          font-weight: 900;
        }
        .activityRow strong,
        .activityRow small { display: block; }
        .activityRow strong { font-size: .77rem; }
        .activityRow small {
          margin-top: 4px;
          color: #7e96a8;
          font-size: .63rem;
          line-height: 1.4;
        }
        .activityStatus {
          color: #b9cad5;
          font-size: .65rem;
          font-weight: 850;
          text-align: right;
        }
        .emptyState {
          padding: 28px;
          color: #849cad;
          text-align: center;
          font-size: .78rem;
        }
        .calendarList {
          display: grid;
          gap: 12px;
          margin-top: 20px;
        }
        .calendarList article {
          display: grid;
          grid-template-columns: 60px 1fr auto;
          gap: 12px;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(125,170,205,.1);
        }
        .calendarList time {
          color: #65e8ff;
          font-size: .65rem;
          font-weight: 950;
        }
        .calendarList strong,
        .calendarList span { display: block; }
        .calendarList strong { font-size: .73rem; }
        .calendarList span {
          margin-top: 4px;
          color: #7f98aa;
          font-size: .62rem;
        }
        .calendarList small {
          color: #9fb2bf;
          font-size: .6rem;
        }
        .calendarAction {
          display: inline-block;
          margin-top: 20px;
          color: #70e9ff;
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }
        .systemGrid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 14px;
        }
        .systemCard {
          display: grid;
          grid-template-columns: 48px 1fr auto;
          gap: 15px;
          min-height: 170px;
          padding: 20px;
          border: 1px solid rgba(125,170,205,.14);
          border-radius: 19px;
          color: inherit;
          background: linear-gradient(145deg,rgba(10,27,43,.8),rgba(4,13,23,.86));
          text-decoration: none;
        }
        .systemCard:hover {
          transform: translateY(-2px);
          border-color: rgba(92,232,255,.34);
        }
        .systemCode {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 13px;
          color: #6de9ff;
          background: rgba(92,232,255,.08);
          font-size: .68rem;
          font-weight: 950;
        }
        .systemCard small {
          color: #7d96a8;
          font-size: .6rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .systemCard h3 {
          margin: 7px 0 8px;
          font-size: .93rem;
        }
        .systemCard p {
          margin: 0;
          color: #879faf;
          font-size: .7rem;
          line-height: 1.55;
        }
        .systemCard b { color: #5ce8ff; }
        .decisionBand {
          position: relative;
          z-index: 2;
          width: min(1180px,calc(100% - 40px));
          margin: 0 auto 70px;
          padding: 30px;
          display: grid;
          grid-template-columns: 1fr 230px auto;
          gap: 28px;
          align-items: center;
          border: 1px solid rgba(255,171,64,.24);
          border-radius: 25px;
          background: linear-gradient(120deg,rgba(45,28,9,.7),rgba(8,18,29,.9));
        }
        .decisionBand h2 {
          margin-bottom: 8px;
          font-size: 1.8rem;
          letter-spacing: -.035em;
        }
        .decisionBand p {
          margin: 0;
          max-width: 660px;
          color: #a79883;
          line-height: 1.6;
        }
        .decisionState {
          padding: 16px;
          border-left: 1px solid rgba(255,171,64,.2);
        }
        .decisionState span,
        .decisionState strong,
        .decisionState small { display: block; }
        .decisionState span {
          color: #a38f72;
          font-size: .62rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .decisionState strong {
          margin: 6px 0;
          color: #ffc879;
          font-size: 1.5rem;
        }
        .decisionState small {
          color: #978873;
          line-height: 1.4;
        }
        .decisionBand > a {
          padding: 12px 15px;
          border-radius: 12px;
          color: #07111a;
          background: #ffc879;
          font-size: .7rem;
          font-weight: 950;
          text-decoration: none;
          white-space: nowrap;
        }

        @media (max-width: 980px) {
          .metricGrid,
          .systemGrid { grid-template-columns: repeat(2,1fr); }
          .competencyGrid { grid-template-columns: repeat(2,1fr); }
          .splitSection { grid-template-columns: 1fr; }
          .decisionBand { grid-template-columns: 1fr; }
          .decisionState {
            border-left: 0;
            border-top: 1px solid rgba(255,171,64,.2);
          }
        }

        @media (max-width: 720px) {
          .commandBar {
            align-items: stretch;
            flex-direction: column;
          }
          .missionSearch { min-width: 0; }
          .metricGrid,
          .systemGrid,
          .competencyGrid { grid-template-columns: 1fr; }
          .alertRow { grid-template-columns: 74px 1fr; }
          .alertRow button {
            grid-column: 2;
            justify-self: start;
            padding: 0;
          }
          .pathwayRow { grid-template-columns: 46px 1fr; }
          .pathwayRow > a { grid-column: 2; }
          .queueItem { grid-template-columns: 60px 1fr; }
          .queueItem a { grid-column: 2; }
          .activityHeader { display: none; }
          .activityRow { grid-template-columns: 52px 1fr; }
          .activityKind {
            grid-column: 2;
            grid-row: 1;
          }
          .activityRow > div { grid-column: 1 / -1; }
          .activityStatus {
            grid-column: 1 / -1;
            text-align: left;
          }
        }


        .readinessMatrix {
          overflow: hidden;
          border: 1px solid rgba(125,170,205,.13);
          border-radius: 20px;
          background: rgba(5,16,27,.74);
        }
        .matrixHeader,
        .matrixRow {
          display: grid;
          grid-template-columns: 58px 1.05fr 112px 1.55fr 130px;
          gap: 14px;
          align-items: center;
        }
        .matrixHeader {
          padding: 12px 16px;
          color: #6f899c;
          background: rgba(255,255,255,.025);
          font-size: .6rem;
          font-weight: 950;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .matrixRow {
          min-height: 78px;
          padding: 14px 16px;
          border-top: 1px solid rgba(125,170,205,.09);
        }
        .matrixRow > strong {
          color: #64e8ff;
          font-size: .67rem;
        }
        .matrixRow > span {
          font-size: .76rem;
          font-weight: 850;
        }
        .matrixRow p {
          margin: 0;
          color: #849dad;
          font-size: .68rem;
          line-height: 1.45;
        }
        .matrixRow small {
          color: #9ab0bf;
          font-size: .65rem;
        }
        .matrixState {
          justify-self: start;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: .57rem;
          letter-spacing: .06em;
        }
        .stateSATISFIED {
          color: #aef2cd;
          background: rgba(87,228,160,.1);
          border: 1px solid rgba(87,228,160,.22);
        }
        .statePARTIAL,
        .stateDRAFT {
          color: #bdefff;
          background: rgba(92,232,255,.09);
          border: 1px solid rgba(92,232,255,.2);
        }
        .stateMISSING,
        .stateOPEN,
        .stateHOLD {
          color: #ffd197;
          background: rgba(255,171,64,.1);
          border: 1px solid rgba(255,171,64,.24);
        }
        .stateUNASSIGNED {
          color: #d9c9ff;
          background: rgba(153,120,255,.1);
          border: 1px solid rgba(153,120,255,.22);
        }
        .artifactLedger {
          display: grid;
          gap: 10px;
        }
        .artifactRecord {
          display: grid;
          grid-template-columns: 48px 1.5fr 90px 120px 110px 70px;
          gap: 16px;
          align-items: center;
          min-height: 84px;
          padding: 15px 17px;
          border: 1px solid rgba(125,170,205,.13);
          border-radius: 17px;
          color: inherit;
          background: linear-gradient(90deg,rgba(10,27,43,.78),rgba(5,16,27,.8));
          text-decoration: none;
        }
        .artifactRecord:hover {
          border-color: rgba(92,232,255,.32);
          transform: translateX(2px);
        }
        .artifactGlyph {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          color: #68e9ff;
          background: rgba(92,232,255,.08);
          font-size: .66rem;
          font-weight: 950;
        }
        .artifactIdentity small,
        .artifactVersion span,
        .artifactState span {
          display: block;
          color: #718b9e;
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .07em;
          text-transform: uppercase;
        }
        .artifactIdentity h3 {
          margin: 5px 0 0;
          font-size: .82rem;
        }
        .artifactVersion strong,
        .artifactState strong {
          display: block;
          margin-top: 5px;
          color: #b8cad6;
          font-size: .68rem;
        }
        .artifactRecord time {
          color: #849cad;
          font-size: .62rem;
        }
        .artifactOpen {
          color: #67e9ff;
          font-size: .65rem;
          text-align: right;
        }
        .instructorSection {
          display: grid;
          grid-template-columns: .8fr 1.2fr;
          gap: 20px;
          align-items: stretch;
        }
        .instructorSummary {
          padding: 28px;
          border: 1px solid rgba(153,120,255,.2);
          border-radius: 24px;
          background: linear-gradient(145deg,rgba(33,20,57,.62),rgba(7,17,29,.9));
        }
        .instructorSummary h2 {
          margin-bottom: 13px;
          font-size: 1.75rem;
          letter-spacing: -.04em;
        }
        .instructorSummary > p:not(.eyebrow) {
          color: #9b92ad;
          line-height: 1.65;
        }
        .instructorSummary a {
          display: inline-block;
          margin-top: 14px;
          color: #c8b6ff;
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }
        .instructorSignals {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .instructorSignals article {
          min-height: 150px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(125,170,205,.14);
          border-radius: 20px;
          background: rgba(7,20,33,.8);
        }
        .instructorSignals span {
          color: #849cad;
          font-size: .67rem;
          font-weight: 850;
        }
        .instructorSignals strong {
          font-size: 2rem;
          letter-spacing: -.04em;
        }
        .instructorSignals small { color: #768fa2; }
        .institutionGrid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 15px;
        }
        .institutionCard {
          position: relative;
          min-height: 240px;
          padding: 23px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(125,170,205,.14);
          border-radius: 21px;
          color: inherit;
          background: linear-gradient(150deg,rgba(10,28,45,.82),rgba(4,13,23,.88));
          text-decoration: none;
        }
        .institutionCard:hover {
          border-color: rgba(92,232,255,.33);
          transform: translateY(-3px);
        }
        .institutionNumber {
          position: absolute;
          top: 19px;
          right: 20px;
          color: rgba(92,232,255,.2);
          font-size: 2rem;
          font-weight: 950;
        }
        .institutionCard small {
          color: #68e9ff;
          font-size: .6rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .institutionCard h3 {
          margin: 30px 0 10px;
          font-size: 1.05rem;
        }
        .institutionCard p {
          color: #879faf;
          font-size: .73rem;
          line-height: 1.6;
        }
        .institutionCard b {
          margin-top: auto;
          color: #73eaff;
          font-size: .68rem;
        }
        .architectureTable {
          display: grid;
          gap: 10px;
        }
        .architectureTable article {
          display: grid;
          grid-template-columns: 52px 1fr 1fr 1fr;
          gap: 18px;
          align-items: center;
          min-height: 92px;
          padding: 16px 18px;
          border: 1px solid rgba(125,170,205,.13);
          border-radius: 17px;
          background: rgba(6,18,30,.78);
        }
        .architectureNumber {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 13px;
          color: #65e8ff;
          background: rgba(92,232,255,.08);
          font-size: .68rem;
          font-weight: 950;
        }
        .architectureAnchor strong,
        .architectureAnchor small { display: block; }
        .architectureAnchor strong { font-size: .9rem; }
        .architectureAnchor small {
          margin-top: 5px;
          color: #829bad;
          font-size: .65rem;
        }
        .architectureProof span,
        .architectureFailure span {
          color: #718a9d;
          font-size: .56rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .architectureProof p,
        .architectureFailure p {
          margin: 6px 0 0;
          color: #9cb0be;
          font-size: .68rem;
          line-height: 1.45;
        }
        .architectureFailure p { color: #b39a9f; }
        .integrityBand {
          padding: 31px;
          display: grid;
          grid-template-columns: 92px 1fr auto;
          gap: 26px;
          align-items: center;
          border: 1px solid rgba(92,232,255,.2);
          border-radius: 25px;
          background: linear-gradient(120deg,rgba(5,29,43,.84),rgba(10,12,29,.9));
        }
        .integrityMark {
          display: grid;
          place-items: center;
          width: 84px;
          height: 84px;
          border: 1px solid rgba(92,232,255,.3);
          border-radius: 25px;
          color: #73eaff;
          background: rgba(92,232,255,.07);
          font-size: 2rem;
          font-weight: 950;
        }
        .integrityBand h2 {
          margin-bottom: 10px;
          font-size: 1.65rem;
          letter-spacing: -.035em;
        }
        .integrityBand p:not(.eyebrow) {
          margin: 0;
          max-width: 720px;
          color: #8ba4b5;
          line-height: 1.6;
        }
        .integrityStates {
          display: grid;
          gap: 7px;
          min-width: 110px;
        }
        .integrityStates span {
          padding: 7px 10px;
          border: 1px solid rgba(125,170,205,.13);
          border-radius: 9px;
          color: #718b9d;
          font-size: .58rem;
          font-weight: 950;
          text-align: center;
        }
        .integrityStates span.active {
          color: #ffd095;
          border-color: rgba(255,171,64,.32);
          background: rgba(255,171,64,.1);
        }

        @media (max-width: 980px) {
          .matrixHeader { display: none; }
          .matrixRow { grid-template-columns: 52px 1fr 110px; }
          .matrixRow p { grid-column: 2 / -1; }
          .matrixRow small { grid-column: 2 / -1; }
          .artifactRecord { grid-template-columns: 48px 1fr 90px; }
          .artifactState,
          .artifactRecord time { display: none; }
          .instructorSection { grid-template-columns: 1fr; }
          .institutionGrid { grid-template-columns: repeat(2,1fr); }
          .architectureTable article { grid-template-columns: 48px 1fr; }
          .architectureProof,
          .architectureFailure { grid-column: 2; }
          .integrityBand { grid-template-columns: 82px 1fr; }
          .integrityStates {
            grid-column: 1 / -1;
            grid-template-columns: repeat(4,1fr);
          }
        }

        @media (max-width: 720px) {
          .matrixRow { grid-template-columns: 48px 1fr; }
          .matrixState { grid-column: 2; }
          .artifactRecord { grid-template-columns: 44px 1fr; }
          .artifactVersion,
          .artifactOpen {
            grid-column: 2;
            text-align: left;
          }
          .instructorSignals,
          .institutionGrid { grid-template-columns: 1fr; }
          .integrityBand { grid-template-columns: 1fr; }
          .integrityStates {
            grid-column: 1;
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </main>
  );
}
