'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type RecordState = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';
type RecordType = 'Decision Receipt' | 'Execution Record' | 'Replay Package';

type ExecutionRecord = {
  id: string;
  title: string;
  type: RecordType;
  state: RecordState;
  created: string;
  organization: string;
  actor: string;
  route: string;
  integrity: number;
  evidence: number;
  findings: number;
  summary: string;
  chain: {
    stage: string;
    status: 'VERIFIED' | 'WARNING' | 'FAILED';
    detail: string;
  }[];
};

const records: ExecutionRecord[] = [
  {
    id: 'TA14-AER-7F2A-91C4',
    title: 'Enterprise payment route',
    type: 'Execution Record',
    state: 'ALLOW',
    created: '2026-07-17 13:42:18 UTC',
    organization: 'Northstar Financial Operations',
    actor: 'Treasury Execution Agent 04',
    route: 'Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome',
    integrity: 100,
    evidence: 24,
    findings: 0,
    summary:
      'The route satisfied all mandatory identity, authority, evidence, binding, commit, execution, and outcome requirements.',
    chain: [
      { stage: 'Reality', status: 'VERIFIED', detail: 'The underlying payment obligation was independently established.' },
      { stage: 'Record', status: 'VERIFIED', detail: 'Required transaction records and supporting evidence were captured.' },
      { stage: 'Continuity', status: 'VERIFIED', detail: 'Evidence provenance and custody remained reconstructable.' },
      { stage: 'Admissibility', status: 'VERIFIED', detail: 'The evidence package satisfied all mandatory thresholds.' },
      { stage: 'Binding', status: 'VERIFIED', detail: 'Actor, beneficiary, destination, tool, and payload remained bound.' },
      { stage: 'Commit', status: 'VERIFIED', detail: 'The committed manifest matched the authorized route.' },
      { stage: 'Execution', status: 'VERIFIED', detail: 'The action corresponded to the committed execution object.' },
      { stage: 'Outcome', status: 'VERIFIED', detail: 'The recorded result matched the authorized consequence.' },
    ],
  },
  {
    id: 'TA14-DR-44B1-0A8F',
    title: 'Expired delegated authority',
    type: 'Decision Receipt',
    state: 'DENY',
    created: '2026-07-17 12:09:51 UTC',
    organization: 'Meridian Procurement Network',
    actor: 'Autonomous Sourcing Agent 12',
    route: 'Reality → Record → Continuity → Admissibility → Binding → Commit',
    integrity: 83,
    evidence: 22,
    findings: 2,
    summary:
      'Execution was denied because the delegated authority expired before commit and temporal validity could not be restored.',
    chain: [
      { stage: 'Reality', status: 'VERIFIED', detail: 'The procurement requirement was established.' },
      { stage: 'Record', status: 'VERIFIED', detail: 'The source records were present and attributable.' },
      { stage: 'Continuity', status: 'VERIFIED', detail: 'Evidence continuity remained intact.' },
      { stage: 'Admissibility', status: 'WARNING', detail: 'Evidence was sufficient, but authority validity was unresolved.' },
      { stage: 'Binding', status: 'VERIFIED', detail: 'The route object and destination remained bound.' },
      { stage: 'Commit', status: 'FAILED', detail: 'Authority had expired before the commit event.' },
      { stage: 'Execution', status: 'FAILED', detail: 'Execution was blocked before consequence occurred.' },
      { stage: 'Outcome', status: 'VERIFIED', detail: 'No prohibited consequence was created.' },
    ],
  },
  {
    id: 'TA14-DR-AC92-771E',
    title: 'Incomplete clinical evidence package',
    type: 'Decision Receipt',
    state: 'HOLD',
    created: '2026-07-17 10:34:06 UTC',
    organization: 'Aster Clinical Review Group',
    actor: 'Clinical Decision Support Agent',
    route: 'Reality → Record → Continuity → Admissibility',
    integrity: 71,
    evidence: 19,
    findings: 3,
    summary:
      'The route was placed on HOLD because mandatory evidence fields were missing and contradiction review remained incomplete.',
    chain: [
      { stage: 'Reality', status: 'VERIFIED', detail: 'The patient condition was documented.' },
      { stage: 'Record', status: 'WARNING', detail: 'Two required source records were absent.' },
      { stage: 'Continuity', status: 'WARNING', detail: 'One imported record lacked complete provenance.' },
      { stage: 'Admissibility', status: 'FAILED', detail: 'The package did not meet the minimum completeness threshold.' },
      { stage: 'Binding', status: 'VERIFIED', detail: 'The subject and intended action remained correctly bound.' },
      { stage: 'Commit', status: 'VERIFIED', detail: 'No commit was issued while the route was held.' },
      { stage: 'Execution', status: 'VERIFIED', detail: 'Execution remained blocked.' },
      { stage: 'Outcome', status: 'VERIFIED', detail: 'No clinical consequence was created.' },
    ],
  },
  {
    id: 'TA14-RP-C10D-52AA',
    title: 'Specialized expert escalation',
    type: 'Replay Package',
    state: 'ESCALATE',
    created: '2026-07-16 22:18:45 UTC',
    organization: 'Helios Infrastructure Authority',
    actor: 'Critical Systems Governance Agent',
    route: 'Reality → Record → Continuity → Admissibility → Escalation',
    integrity: 92,
    evidence: 24,
    findings: 1,
    summary:
      'The route was escalated because the evidence was intact but the consequence exceeded the agent’s delegated decision boundary.',
    chain: [
      { stage: 'Reality', status: 'VERIFIED', detail: 'The infrastructure condition was independently observed.' },
      { stage: 'Record', status: 'VERIFIED', detail: 'Sensor, maintenance, and inspection records were preserved.' },
      { stage: 'Continuity', status: 'VERIFIED', detail: 'The evidence chain remained intact.' },
      { stage: 'Admissibility', status: 'VERIFIED', detail: 'The evidence was fit for review.' },
      { stage: 'Binding', status: 'VERIFIED', detail: 'System, site, authority, and proposed action were bound.' },
      { stage: 'Commit', status: 'WARNING', detail: 'The proposed consequence exceeded the actor’s delegated authority.' },
      { stage: 'Execution', status: 'VERIFIED', detail: 'Execution was withheld pending expert review.' },
      { stage: 'Outcome', status: 'VERIFIED', detail: 'The route transferred to accountable higher authority.' },
    ],
  },
];

const stateOrder: Record<RecordState, number> = {
  DENY: 0,
  HOLD: 1,
  ESCALATE: 2,
  ALLOW: 3,
};

export default function RecordsPage() {
  const [activeRecordId, setActiveRecordId] = useState(records[0].id);
  const [stateFilter, setStateFilter] = useState<'ALL' | RecordState>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | RecordType>('ALL');
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<'NEWEST' | 'STATE' | 'INTEGRITY'>('NEWEST');

  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return records
      .filter((record) => stateFilter === 'ALL' || record.state === stateFilter)
      .filter((record) => typeFilter === 'ALL' || record.type === typeFilter)
      .filter((record) => {
        if (!normalizedSearch) return true;

        return [record.id, record.title, record.organization, record.actor, record.summary]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .sort((a, b) => {
        if (sortMode === 'STATE') return stateOrder[a.state] - stateOrder[b.state];
        if (sortMode === 'INTEGRITY') return b.integrity - a.integrity;
        return b.created.localeCompare(a.created);
      });
  }, [search, sortMode, stateFilter, typeFilter]);

  const activeRecord =
    records.find((record) => record.id === activeRecordId) ?? filteredRecords[0] ?? records[0];

  return (
    <>
      <style>{`
        :root {
          --bg: #02050a;
          --panel: rgba(7, 16, 28, 0.8);
          --line: rgba(126, 180, 230, 0.16);
          --text: #f4f8ff;
          --muted: #91a5ba;
          --cyan: #57e6ff;
          --blue: #319cff;
          --green: #38f2a2;
          --gold: #ffd36b;
          --red: #ff4b70;
        }

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        body {
          margin: 0;
          color: var(--text);
          background:
            radial-gradient(circle at 15% 0%, rgba(49,156,255,0.16), transparent 30%),
            radial-gradient(circle at 90% 22%, rgba(56,242,162,0.07), transparent 28%),
            linear-gradient(180deg, #02050a 0%, #07111d 48%, #02050a 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        button, input, select { font: inherit; }

        .records-page { min-height: 100vh; position: relative; overflow: hidden; }
        .records-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.2;
          background-image:
            linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: linear-gradient(to bottom, black, transparent 95%);
        }

        .shell { width: min(1320px, 94vw); margin: 0 auto; position: relative; z-index: 2; }
        .topbar {
          position: sticky;
          top: 0;
          z-index: 60;
          border-bottom: 1px solid var(--line);
          background: rgba(3, 8, 15, 0.82);
          backdrop-filter: blur(20px);
        }

        .topbar-inner {
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: var(--cyan);
          border: 1px solid rgba(87,230,255,0.38);
          background: linear-gradient(145deg, rgba(49,156,255,0.18), rgba(56,242,162,0.06));
          box-shadow: 0 0 28px rgba(87,230,255,0.16);
        }

        .top-links { display: flex; align-items: center; gap: 20px; }
        .top-links a { color: var(--muted); text-decoration: none; font-size: 14px; }
        .top-links a:hover { color: white; }

        .hero {
          padding: 82px 0 44px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 30px;
          align-items: end;
        }

        .eyebrow {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        h1 {
          margin: 14px 0 18px;
          max-width: 900px;
          font-size: clamp(54px, 7vw, 96px);
          line-height: 0.92;
          letter-spacing: -0.06em;
        }

        .gradient {
          color: transparent;
          background: linear-gradient(90deg, white, var(--cyan), var(--green));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero p { max-width: 820px; margin: 0; color: #b2c2d4; font-size: 18px; line-height: 1.72; }
        .hero-stat {
          min-width: 210px;
          padding: 18px;
          border-radius: 18px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.025);
        }
        .hero-stat span { display: block; color: var(--muted); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; }
        .hero-stat strong { display: block; margin-top: 7px; font-size: 28px; }

        .toolbar {
          margin-bottom: 18px;
          padding: 16px;
          display: grid;
          grid-template-columns: 1.5fr repeat(3, minmax(150px, 0.55fr));
          gap: 12px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: var(--panel);
          backdrop-filter: blur(16px);
        }

        .field {
          width: 100%;
          min-height: 46px;
          border-radius: 13px;
          border: 1px solid var(--line);
          color: white;
          background: rgba(255,255,255,0.03);
          outline: none;
          padding: 0 14px;
        }
        .field:focus { border-color: rgba(87,230,255,0.36); box-shadow: 0 0 0 3px rgba(87,230,255,0.08); }
        select.field { cursor: pointer; }

        .workspace { display: grid; grid-template-columns: 0.78fr 1.22fr; gap: 18px; padding-bottom: 88px; }
        .panel {
          border: 1px solid var(--line);
          border-radius: 24px;
          background: var(--panel);
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 70px rgba(0,0,0,0.22);
        }

        .records-list { padding: 12px; max-height: 880px; overflow: auto; }
        .records-list::-webkit-scrollbar { width: 8px; }
        .records-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 999px; }

        .record-button {
          width: 100%;
          margin-bottom: 9px;
          padding: 17px;
          color: white;
          text-align: left;
          border-radius: 17px;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.022);
          cursor: pointer;
          transition: 180ms ease;
        }
        .record-button:hover { transform: translateX(3px); background: rgba(255,255,255,0.04); }
        .record-button.active {
          border-color: rgba(87,230,255,0.28);
          background: linear-gradient(90deg, rgba(49,156,255,0.1), rgba(56,242,162,0.035));
        }

        .record-button-top { display: flex; justify-content: space-between; gap: 14px; align-items: flex-start; }
        .record-button code { color: var(--cyan); font-size: 10px; letter-spacing: 0.06em; }
        .record-button h3 { margin: 8px 0 6px; font-size: 16px; line-height: 1.35; }
        .record-button p { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.55; }

        .state-pill {
          flex: 0 0 auto;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          border: 1px solid currentColor;
        }
        .state-pill.ALLOW, .state-word.ALLOW { color: var(--green); }
        .state-pill.HOLD, .state-word.HOLD { color: var(--gold); }
        .state-pill.DENY, .state-word.DENY { color: var(--red); }
        .state-pill.ESCALATE, .state-word.ESCALATE { color: var(--blue); }

        .empty { padding: 48px 20px; text-align: center; color: var(--muted); }
        .record-detail { overflow: hidden; }

        .detail-header {
          padding: 30px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 92% 10%, rgba(87,230,255,0.11), transparent 25%),
            rgba(255,255,255,0.012);
        }
        .detail-heading { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; }
        .detail-header code { color: var(--cyan); font-size: 11px; letter-spacing: 0.08em; }
        .detail-header h2 { margin: 10px 0 8px; font-size: clamp(30px, 4vw, 48px); letter-spacing: -0.04em; }
        .detail-header p { max-width: 760px; margin: 0; color: var(--muted); line-height: 1.7; }

        .state-word { font-size: clamp(44px, 6vw, 82px); line-height: 0.9; font-weight: 950; letter-spacing: -0.05em; }
        .metrics {
          padding: 18px 30px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          border-bottom: 1px solid var(--line);
        }
        .metric { padding: 14px; border-radius: 15px; background: rgba(255,255,255,0.025); border: 1px solid var(--line); }
        .metric span { display: block; color: var(--muted); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }
        .metric strong { display: block; margin-top: 6px; font-size: 18px; }

        .metadata {
          padding: 24px 30px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          border-bottom: 1px solid var(--line);
        }
        .metadata-item { min-width: 0; }
        .metadata-item span { display: block; color: var(--muted); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }
        .metadata-item strong { display: block; margin-top: 6px; overflow-wrap: anywhere; font-size: 14px; line-height: 1.5; }

        .chain-section { padding: 28px 30px 32px; }
        .section-label { color: var(--muted); font-size: 11px; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; }
        .chain-section h3 { margin: 9px 0 18px; font-size: 25px; }
        .chain-grid { display: grid; gap: 10px; }

        .chain-row {
          padding: 15px;
          display: grid;
          grid-template-columns: 130px 110px 1fr;
          gap: 14px;
          align-items: center;
          border-radius: 15px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.022);
        }
        .chain-row strong { font-size: 14px; }
        .chain-status { font-size: 10px; font-weight: 900; letter-spacing: 0.08em; }
        .chain-status.VERIFIED { color: var(--green); }
        .chain-status.WARNING { color: var(--gold); }
        .chain-status.FAILED { color: var(--red); }
        .chain-row p { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.55; }

        .actions { padding: 0 30px 30px; display: flex; flex-wrap: wrap; gap: 11px; }
        .primary, .secondary {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 17px;
          border-radius: 13px;
          text-decoration: none;
          font-weight: 900;
          cursor: pointer;
        }
        .primary { color: #03110b; border: 0; background: linear-gradient(90deg, var(--cyan), var(--green)); box-shadow: 0 0 30px rgba(87,230,255,0.18); }
        .secondary { color: white; border: 1px solid var(--line); background: rgba(255,255,255,0.03); }

        @media (max-width: 1060px) {
          .hero, .workspace { grid-template-columns: 1fr; }
          .hero-stat { min-width: 0; }
          .toolbar { grid-template-columns: 1fr 1fr; }
          .records-list { max-height: 520px; }
        }

        @media (max-width: 720px) {
          .top-links a:not(:last-child) { display: none; }
          .hero { padding-top: 60px; }
          h1 { font-size: 52px; }
          .toolbar, .metrics, .metadata { grid-template-columns: 1fr; }
          .detail-heading { flex-direction: column; }
          .chain-row { grid-template-columns: 1fr; }
          .detail-header, .metrics, .metadata, .chain-section, .actions { padding-left: 22px; padding-right: 22px; }
        }
      `}</style>

      <div className="records-page">
        <header className="topbar">
          <div className="shell topbar-inner">
            <Link className="brand" href="/">
              <span className="brand-mark">14</span>
              <span>TA-14 RECORD EXCHANGE</span>
            </Link>

            <nav className="top-links">
              <Link href="/architecture">Architecture</Link>
              <Link href="/runtime">Runtime Gate</Link>
              <a href="#records">Records</a>
              <Link href="/">Exchange</Link>
            </nav>
          </div>
        </header>

        <main className="shell">
          <section className="hero">
            <div>
              <div className="eyebrow">Preserved execution evidence</div>
              <h1>
                Inspect the route,
                <br />
                <span className="gradient">not the dashboard.</span>
              </h1>
              <p>
                The TA-14 Record Exchange presents decision receipts, admissible
                execution records, and replay packages as durable evidence objects
                that can survive operator, vendor, interface, and organizational change.
              </p>
            </div>

            <div className="hero-stat">
              <span>Visible demonstration records</span>
              <strong>{records.length}</strong>
            </div>
          </section>

          <section className="toolbar">
            <input
              className="field"
              type="search"
              placeholder="Search route ID, actor, organization, or finding…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              className="field"
              value={stateFilter}
              onChange={(event) => setStateFilter(event.target.value as 'ALL' | RecordState)}
            >
              <option value="ALL">All states</option>
              <option value="ALLOW">ALLOW</option>
              <option value="HOLD">HOLD</option>
              <option value="DENY">DENY</option>
              <option value="ESCALATE">ESCALATE</option>
            </select>

            <select
              className="field"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as 'ALL' | RecordType)}
            >
              <option value="ALL">All record types</option>
              <option value="Decision Receipt">Decision Receipt</option>
              <option value="Execution Record">Execution Record</option>
              <option value="Replay Package">Replay Package</option>
            </select>

            <select
              className="field"
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as 'NEWEST' | 'STATE' | 'INTEGRITY')}
            >
              <option value="NEWEST">Newest first</option>
              <option value="STATE">State priority</option>
              <option value="INTEGRITY">Highest integrity</option>
            </select>
          </section>

          <section id="records" className="workspace">
            <aside className="panel records-list">
              {filteredRecords.length === 0 ? (
                <div className="empty">No records match the current filters.</div>
              ) : (
                filteredRecords.map((record) => (
                  <button
                    className={`record-button ${activeRecord.id === record.id ? 'active' : ''}`}
                    key={record.id}
                    type="button"
                    onClick={() => setActiveRecordId(record.id)}
                  >
                    <div className="record-button-top">
                      <div>
                        <code>{record.id}</code>
                        <h3>{record.title}</h3>
                      </div>

                      <span className={`state-pill ${record.state}`}>{record.state}</span>
                    </div>

                    <p>{record.organization} · {record.type}</p>
                  </button>
                ))
              )}
            </aside>

            <article className="panel record-detail">
              <header className="detail-header">
                <div className="detail-heading">
                  <div>
                    <code>{activeRecord.id}</code>
                    <h2>{activeRecord.title}</h2>
                    <p>{activeRecord.summary}</p>
                  </div>

                  <div className={`state-word ${activeRecord.state}`}>{activeRecord.state}</div>
                </div>
              </header>

              <div className="metrics">
                <div className="metric"><span>Integrity score</span><strong>{activeRecord.integrity}%</strong></div>
                <div className="metric"><span>Evidence links</span><strong>{activeRecord.evidence}/24</strong></div>
                <div className="metric"><span>Findings</span><strong>{activeRecord.findings}</strong></div>
                <div className="metric"><span>Record type</span><strong>{activeRecord.type}</strong></div>
              </div>

              <div className="metadata">
                <div className="metadata-item"><span>Organization</span><strong>{activeRecord.organization}</strong></div>
                <div className="metadata-item"><span>Responsible actor</span><strong>{activeRecord.actor}</strong></div>
                <div className="metadata-item"><span>Created</span><strong>{activeRecord.created}</strong></div>
                <div className="metadata-item"><span>Canonical route</span><strong>{activeRecord.route}</strong></div>
              </div>

              <section className="chain-section">
                <div className="section-label">Execution chain inspection</div>
                <h3>Preserved stage correspondence</h3>

                <div className="chain-grid">
                  {activeRecord.chain.map((item) => (
                    <div className="chain-row" key={item.stage}>
                      <strong>{item.stage}</strong>
                      <span className={`chain-status ${item.status}`}>{item.status}</span>
                      <p>{item.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="actions">
                <Link className="primary" href="/runtime">Run Another Route</Link>
                <Link className="secondary" href="/architecture">Review Architecture</Link>
                <a className="secondary" href="mailto:ta14admissibleexecution@gmail.com">Request Independent Review</a>
              </div>
            </article>
          </section>
        </main>
      </div>
    </>
  );
}
