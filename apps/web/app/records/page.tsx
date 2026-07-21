'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type RecordState = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';
type RecordType =
  | 'Decision Receipt'
  | 'Execution Record'
  | 'Replay Package'
  | 'Evidence Record'
  | 'Inspection Record'
  | 'Environmental Record';
type ChainStatus = 'VERIFIED' | 'WARNING' | 'FAILED';
type WorkspaceMode = 'LANDING' | 'BUILD' | 'VERIFY' | 'LEARN';
type MaterialClass =
  | 'Reality'
  | 'Record'
  | 'Authority'
  | 'Binding'
  | 'Commit'
  | 'Execution'
  | 'Outcome'
  | 'Supporting Evidence'
  | 'Unknown';

type ExchangeRecord = {
  id: string;
  title: string;
  type: RecordType;
  state: RecordState;
  created: string;
  organization: string;
  actor: string;
  subject: string;
  integrity: number;
  evidence: number;
  findings: number;
  summary: string;
  demonstration: boolean;
  chain: Array<{
    stage: string;
    status: ChainStatus;
    detail: string;
  }>;
};

type IntakeMaterial = {
  id: string;
  name: string;
  size: number;
  mediaType: string;
  classification: MaterialClass;
};

const records: ExchangeRecord[] = [
  {
    id: 'TA14-AER-7F2A-91C4',
    title: 'Enterprise payment execution',
    type: 'Execution Record',
    state: 'ALLOW',
    created: '2026-07-17 13:42:18 UTC',
    organization: 'TA-14 Demonstration Organization',
    actor: 'Treasury Execution Agent 04',
    subject: 'Authorized vendor payment',
    integrity: 100,
    evidence: 24,
    findings: 0,
    summary:
      'The demonstration execution satisfied the required identity, authority, evidence, binding, commit, execution, and outcome conditions.',
    demonstration: true,
    chain: [
      {
        stage: 'Reality',
        status: 'VERIFIED',
        detail: 'The underlying payment obligation was established for demonstration review.',
      },
      {
        stage: 'Record',
        status: 'VERIFIED',
        detail: 'The required transaction records and supporting evidence were represented.',
      },
      {
        stage: 'Continuity',
        status: 'VERIFIED',
        detail: 'Evidence provenance and chronology remained reconstructable.',
      },
      {
        stage: 'Admissibility',
        status: 'VERIFIED',
        detail: 'The demonstration package satisfied its declared requirements.',
      },
      {
        stage: 'Binding',
        status: 'VERIFIED',
        detail: 'Actor, beneficiary, destination, tool, and payload remained bound.',
      },
      {
        stage: 'Commit',
        status: 'VERIFIED',
        detail: 'The committed manifest matched the authorized execution object.',
      },
      {
        stage: 'Execution',
        status: 'VERIFIED',
        detail: 'The represented action corresponded to the committed object.',
      },
      {
        stage: 'Outcome',
        status: 'VERIFIED',
        detail: 'The represented result corresponded to the authorized consequence.',
      },
    ],
  },
  {
    id: 'TA14-DR-44B1-0A8F',
    title: 'Expired delegated authority',
    type: 'Decision Receipt',
    state: 'DENY',
    created: '2026-07-17 12:09:51 UTC',
    organization: 'TA-14 Demonstration Organization',
    actor: 'Autonomous Sourcing Agent 12',
    subject: 'Procurement authorization',
    integrity: 83,
    evidence: 22,
    findings: 2,
    summary:
      'Execution was denied because delegated authority expired before commit and temporal validity could not be restored.',
    demonstration: true,
    chain: [
      {
        stage: 'Reality',
        status: 'VERIFIED',
        detail: 'The procurement requirement was represented.',
      },
      {
        stage: 'Record',
        status: 'VERIFIED',
        detail: 'The source records were present and attributable.',
      },
      {
        stage: 'Continuity',
        status: 'VERIFIED',
        detail: 'Evidence continuity remained intact.',
      },
      {
        stage: 'Admissibility',
        status: 'WARNING',
        detail: 'Evidence was sufficient, but authority validity was unresolved.',
      },
      {
        stage: 'Binding',
        status: 'VERIFIED',
        detail: 'The execution object and destination remained bound.',
      },
      {
        stage: 'Commit',
        status: 'FAILED',
        detail: 'Authority had expired before the commit event.',
      },
      {
        stage: 'Execution',
        status: 'FAILED',
        detail: 'Execution was blocked before consequence occurred.',
      },
      {
        stage: 'Outcome',
        status: 'VERIFIED',
        detail: 'No prohibited consequence was represented as having occurred.',
      },
    ],
  },
  {
    id: 'TA14-DR-AC92-771E',
    title: 'Incomplete clinical evidence package',
    type: 'Decision Receipt',
    state: 'HOLD',
    created: '2026-07-17 10:34:06 UTC',
    organization: 'TA-14 Demonstration Organization',
    actor: 'Clinical Decision Support Agent',
    subject: 'Clinical evidence review',
    integrity: 71,
    evidence: 19,
    findings: 3,
    summary:
      'The demonstration record was placed on HOLD because required evidence was missing and contradiction review remained incomplete.',
    demonstration: true,
    chain: [
      {
        stage: 'Reality',
        status: 'VERIFIED',
        detail: 'The represented condition was documented.',
      },
      {
        stage: 'Record',
        status: 'WARNING',
        detail: 'Two required source records were absent.',
      },
      {
        stage: 'Continuity',
        status: 'WARNING',
        detail: 'One imported record lacked complete provenance.',
      },
      {
        stage: 'Admissibility',
        status: 'FAILED',
        detail: 'The package did not meet the minimum completeness threshold.',
      },
      {
        stage: 'Binding',
        status: 'VERIFIED',
        detail: 'The subject and intended action remained correctly bound.',
      },
      {
        stage: 'Commit',
        status: 'VERIFIED',
        detail: 'No execution commit was issued while the record remained held.',
      },
      {
        stage: 'Execution',
        status: 'VERIFIED',
        detail: 'Execution remained blocked.',
      },
      {
        stage: 'Outcome',
        status: 'VERIFIED',
        detail: 'No clinical consequence was represented as having occurred.',
      },
    ],
  },
  {
    id: 'TA14-RP-C10D-52AA',
    title: 'Specialized expert escalation',
    type: 'Replay Package',
    state: 'ESCALATE',
    created: '2026-07-16 22:18:45 UTC',
    organization: 'TA-14 Demonstration Organization',
    actor: 'Critical Systems Governance Agent',
    subject: 'Critical infrastructure decision',
    integrity: 92,
    evidence: 24,
    findings: 1,
    summary:
      'The demonstration package was escalated because the evidence was intact but the proposed consequence exceeded delegated authority.',
    demonstration: true,
    chain: [
      {
        stage: 'Reality',
        status: 'VERIFIED',
        detail: 'The represented infrastructure condition was observed.',
      },
      {
        stage: 'Record',
        status: 'VERIFIED',
        detail: 'Sensor, maintenance, and inspection records were represented.',
      },
      {
        stage: 'Continuity',
        status: 'VERIFIED',
        detail: 'The evidence chain remained intact.',
      },
      {
        stage: 'Admissibility',
        status: 'VERIFIED',
        detail: 'The evidence was fit for authorized review.',
      },
      {
        stage: 'Binding',
        status: 'VERIFIED',
        detail: 'System, site, authority, and proposed action remained bound.',
      },
      {
        stage: 'Commit',
        status: 'WARNING',
        detail: 'The proposed consequence exceeded the actor’s delegated authority.',
      },
      {
        stage: 'Execution',
        status: 'VERIFIED',
        detail: 'Execution was withheld pending expert review.',
      },
      {
        stage: 'Outcome',
        status: 'VERIFIED',
        detail: 'The matter transferred to accountable higher authority.',
      },
    ],
  },
];

const stateOrder: Record<RecordState, number> = {
  DENY: 0,
  HOLD: 1,
  ESCALATE: 2,
  ALLOW: 3,
};

const materialClasses: MaterialClass[] = [
  'Reality',
  'Record',
  'Authority',
  'Binding',
  'Commit',
  'Execution',
  'Outcome',
  'Supporting Evidence',
  'Unknown',
];

const lifecycleItems = [
  ['Access', 'Control who may discover, retrieve, inspect, export, or rely on a governed record.'],
  ['Custody', 'Preserve possession, transfer, provenance, and integrity checks across time.'],
  ['Reliance', 'Declare which later decisions may rely on a record, its version, and its limitations.'],
  ['Corrections', 'Create a superseding version without overwriting material history.'],
  ['Retention', 'Apply retention classes, review dates, holds, and preservation obligations.'],
  ['Revocation', 'Invalidate authority or reliance without erasing the record or its history.'],
  ['Disposition', 'Govern archival, export, transfer, anonymization, or destruction.'],
  ['Disputes', 'Preserve challenges to identity, evidence, authority, continuity, or outcome.'],
] as const;

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 bytes';
  const units = ['bytes', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function RecordsPage() {
  const [mode, setMode] = useState<WorkspaceMode>('LANDING');
  const [activeRecordId, setActiveRecordId] = useState(records[0].id);
  const [stateFilter, setStateFilter] = useState<'ALL' | RecordState>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | RecordType>('ALL');
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<'NEWEST' | 'STATE' | 'INTEGRITY'>('NEWEST');
  const [materials, setMaterials] = useState<IntakeMaterial[]>([]);

  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return records
      .filter((record) => stateFilter === 'ALL' || record.state === stateFilter)
      .filter((record) => typeFilter === 'ALL' || record.type === typeFilter)
      .filter((record) => {
        if (!normalizedSearch) return true;
        return [
          record.id,
          record.title,
          record.organization,
          record.actor,
          record.subject,
          record.summary,
          record.type,
        ]
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

  function addMaterials(files: FileList | null) {
    if (!files) return;

    const next = Array.from(files).map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${index}`,
      name: file.name,
      size: file.size,
      mediaType: file.type || 'Unknown media type',
      classification: 'Unknown' as MaterialClass,
    }));

    setMaterials((current) => [...current, ...next]);
  }

  function updateMaterialClassification(id: string, classification: MaterialClass) {
    setMaterials((current) =>
      current.map((material) =>
        material.id === id ? { ...material, classification } : material,
      ),
    );
  }

  function removeMaterial(id: string) {
    setMaterials((current) => current.filter((material) => material.id !== id));
  }

  return (
    <main className="recordsPage">
      <header className="topBar">
        <Link href="/" className="brand" aria-label="TA-14 Exchange Platform home">
          <span className="brandMark">TA-14</span>
          <span>Exchange Platform</span>
        </Link>
        <nav className="topNav" aria-label="Primary navigation">
          <Link href="/architecture">Architecture</Link>
          <Link href="/workspace/routes/new">Routes</Link>
          <Link href="/records" aria-current="page">
            Records
          </Link>
          <Link href="/workspace/verify">Verification</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="eyebrow">TA-14 Governed Records</div>
        <h1>Every consequence deserves a record that survives independent review.</h1>
        <p>
          Build, preserve, govern, inspect, retain, correct, and disposition consequential
          information without losing identity, continuity, authority, or history.
        </p>
        <div className="heroActions">
          <button type="button" className="primaryButton" onClick={() => setMode('BUILD')}>
            Build a governed record
          </button>
          <button type="button" className="secondaryButton" onClick={() => setMode('VERIFY')}>
            Inspect existing records
          </button>
        </div>
        <div className="releaseNotice" role="note">
          <strong>Public demonstration environment.</strong> The records shown here are clearly
          identified demonstration objects. Preliminary material intake does not establish
          admissibility, create a final RID, or prove cryptographic continuity.
        </div>
      </section>

      <section className="modeBar" aria-label="Records workspace modes">
        {[
          ['LANDING', 'Overview'],
          ['BUILD', 'Build'],
          ['VERIFY', 'Inspect'],
          ['LEARN', 'Learn'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={mode === value ? 'modeButton active' : 'modeButton'}
            onClick={() => setMode(value as WorkspaceMode)}
          >
            {label}
          </button>
        ))}
      </section>

      {mode === 'LANDING' && (
        <>
          <section className="laneGrid" aria-label="Governed Records workspace lanes">
            <button type="button" className="laneCard" onClick={() => setMode('BUILD')}>
              <span className="laneNumber">01</span>
              <h2>Build a Governed Record</h2>
              <p>
                Bring documents, photographs, video, audio, email, logs, receipts, sensor
                exports, AI artifacts, and evidence packages into a guided intake flow.
              </p>
              <span className="laneAction">Open intake preview →</span>
            </button>

            <div className="laneCard mutedCard">
              <span className="laneNumber">02</span>
              <h2>Continue a Draft</h2>
              <p>
                Persistent, server-side drafts and resumable uploads are part of the next
                implementation phase.
              </p>
              <span className="statusPill planned">PLANNED</span>
            </div>

            <button type="button" className="laneCard" onClick={() => setMode('VERIFY')}>
              <span className="laneNumber">03</span>
              <h2>Inspect Existing Records</h2>
              <p>
                Search demonstration records, inspect their evidence relationships, and review
                the preserved TA-14 execution chain.
              </p>
              <span className="laneAction">Open inspector →</span>
            </button>

            <button type="button" className="laneCard" onClick={() => setMode('LEARN')}>
              <span className="laneNumber">04</span>
              <h2>Learn Record Governance</h2>
              <p>
                Understand identity, continuity, authority, admissibility, binding, versioning,
                retention, correction, and disposition.
              </p>
              <span className="laneAction">Learn the model →</span>
            </button>
          </section>

          <section className="sectionBlock">
            <div className="sectionHeading">
              <div>
                <div className="eyebrow">Governance lifecycle</div>
                <h2>A record remains governed after it is created.</h2>
              </div>
              <p>
                These are lifecycle capabilities of the TA-14 Governed Records architecture. They
                are presented here as the product standard and should not be interpreted as fully
                activated production controls until each workspace is connected to persistent
                identity, authority, and event-chain services.
              </p>
            </div>
            <div className="lifecycleGrid">
              {lifecycleItems.map(([title, description]) => (
                <article key={title} className="lifecycleCard">
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className="statusPill planned">ARCHITECTURE STANDARD</span>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {mode === 'BUILD' && (
        <section className="sectionBlock">
          <div className="sectionHeading">
            <div>
              <div className="eyebrow">Preliminary materials intake</div>
              <h2>Bring the materials that describe reality.</h2>
            </div>
            <p>
              This public preview inventories materials locally in your browser. It does not upload
              them, calculate a server-verified digest, establish continuity, save a draft, or issue
              an RID.
            </p>
          </div>

          <label className="dropZone">
            <input
              type="file"
              multiple
              onChange={(event) => {
                addMaterials(event.target.files);
                event.currentTarget.value = '';
              }}
            />
            <span className="dropIcon">＋</span>
            <strong>Select materials for preliminary review</strong>
            <span>
              PDF, images, video, audio, JSON, CSV, logs, email, receipts, sensor exports, and ZIP
              packages
            </span>
          </label>

          {materials.length === 0 ? (
            <div className="emptyState">
              <h3>No materials selected</h3>
              <p>
                Select one or more files to preview an evidence inventory. Nothing leaves your
                browser in this phase.
              </p>
            </div>
          ) : (
            <div className="materialList">
              {materials.map((material) => (
                <article key={material.id} className="materialCard">
                  <div>
                    <div className="materialName">{material.name}</div>
                    <div className="materialMeta">
                      {formatBytes(material.size)} · {material.mediaType}
                    </div>
                  </div>
                  <label>
                    Proposed classification
                    <select
                      value={material.classification}
                      onChange={(event) =>
                        updateMaterialClassification(
                          material.id,
                          event.target.value as MaterialClass,
                        )
                      }
                    >
                      {materialClasses.map((classification) => (
                        <option key={classification} value={classification}>
                          {classification}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="localState">
                    <strong>LOCAL INVENTORY ONLY</strong>
                    <span>No hash, persistence, authority, or admissibility established.</span>
                  </div>
                  <button
                    type="button"
                    className="textButton danger"
                    onClick={() => removeMaterial(material.id)}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          )}

          <div className="readinessPanel">
            <div>
              <div className="eyebrow">Readiness status</div>
              <h3>Not yet evaluated</h3>
            </div>
            <p>
              Uploading or classifying files cannot establish evidence integrity, identity,
              continuity, authority, admissibility, binding, execution correspondence, or outcome
              correspondence. Those determinations require transparent requirements and
              server-verified records.
            </p>
          </div>
        </section>
      )}

      {mode === 'VERIFY' && (
        <section className="sectionBlock">
          <div className="sectionHeading">
            <div>
              <div className="eyebrow">Record inspector</div>
              <h2>Inspect the record, not merely the interface.</h2>
            </div>
            <p>
              Search the visible demonstration records below. Production RID retrieval and
              independent cryptographic verification should remain connected to the authoritative
              record APIs as they are activated.
            </p>
          </div>

          <div className="filters" aria-label="Record filters">
            <label>
              Search
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="RID, title, organization, actor, subject…"
              />
            </label>
            <label>
              State
              <select
                value={stateFilter}
                onChange={(event) => setStateFilter(event.target.value as 'ALL' | RecordState)}
              >
                <option value="ALL">All states</option>
                <option value="ALLOW">ALLOW</option>
                <option value="HOLD">HOLD</option>
                <option value="DENY">DENY</option>
                <option value="ESCALATE">ESCALATE</option>
              </select>
            </label>
            <label>
              Record type
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value as 'ALL' | RecordType)}
              >
                <option value="ALL">All record types</option>
                <option value="Decision Receipt">Decision Receipt</option>
                <option value="Execution Record">Execution Record</option>
                <option value="Replay Package">Replay Package</option>
                <option value="Evidence Record">Evidence Record</option>
                <option value="Inspection Record">Inspection Record</option>
                <option value="Environmental Record">Environmental Record</option>
              </select>
            </label>
            <label>
              Sort
              <select
                value={sortMode}
                onChange={(event) =>
                  setSortMode(event.target.value as 'NEWEST' | 'STATE' | 'INTEGRITY')
                }
              >
                <option value="NEWEST">Newest first</option>
                <option value="STATE">State priority</option>
                <option value="INTEGRITY">Highest integrity</option>
              </select>
            </label>
          </div>

          <div className="recordWorkspace">
            <aside className="recordList" aria-label="Visible demonstration records">
              <div className="listHeader">
                <strong>Visible demonstration records</strong>
                <span>{filteredRecords.length}</span>
              </div>
              {filteredRecords.length === 0 ? (
                <div className="emptyState compact">
                  <h3>No matching records</h3>
                  <p>Change or clear the filters.</p>
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <button
                    key={record.id}
                    type="button"
                    className={record.id === activeRecord.id ? 'recordRow active' : 'recordRow'}
                    onClick={() => setActiveRecordId(record.id)}
                  >
                    <span className="recordId">{record.id}</span>
                    <strong>{record.title}</strong>
                    <span>{record.type}</span>
                    <span className={`statusPill ${record.state.toLowerCase()}`}>
                      {record.state}
                    </span>
                  </button>
                ))
              )}
            </aside>

            <article className="recordDetail">
              <div className="recordTitleRow">
                <div>
                  <span className="recordId">{activeRecord.id}</span>
                  <h2>{activeRecord.title}</h2>
                </div>
                <span className={`statusPill large ${activeRecord.state.toLowerCase()}`}>
                  {activeRecord.state}
                </span>
              </div>

              {activeRecord.demonstration && (
                <div className="demoBanner">
                  <strong>Demonstration record</strong>
                  <span>
                    This object illustrates the TA-14 record model. It is not represented as an
                    external customer record or a production-world consequence.
                  </span>
                </div>
              )}

              <p className="recordSummary">{activeRecord.summary}</p>

              <div className="metricGrid">
                <div>
                  <span>Integrity representation</span>
                  <strong>{activeRecord.integrity}%</strong>
                </div>
                <div>
                  <span>Evidence relationships</span>
                  <strong>{activeRecord.evidence}/24</strong>
                </div>
                <div>
                  <span>Findings</span>
                  <strong>{activeRecord.findings}</strong>
                </div>
              </div>

              <dl className="recordFacts">
                <div>
                  <dt>Record type</dt>
                  <dd>{activeRecord.type}</dd>
                </div>
                <div>
                  <dt>Organization</dt>
                  <dd>{activeRecord.organization}</dd>
                </div>
                <div>
                  <dt>Responsible actor</dt>
                  <dd>{activeRecord.actor}</dd>
                </div>
                <div>
                  <dt>Subject</dt>
                  <dd>{activeRecord.subject}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{activeRecord.created}</dd>
                </div>
              </dl>

              <div className="chainSection">
                <div className="eyebrow">Preserved stage correspondence</div>
                <h3>TA-14 execution-chain inspection</h3>
                <div className="chainList">
                  {activeRecord.chain.map((item, index) => (
                    <div key={`${item.stage}-${index}`} className="chainItem">
                      <div className="chainIndex">{String(index + 1).padStart(2, '0')}</div>
                      <div>
                        <div className="chainHeading">
                          <strong>{item.stage}</strong>
                          <span className={`chainStatus ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </div>
                        <p>{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {mode === 'LEARN' && (
        <section className="sectionBlock">
          <div className="sectionHeading">
            <div>
              <div className="eyebrow">Record governance</div>
              <h2>A governed record is more than a stored document.</h2>
            </div>
            <p>
              It is a durable governance object whose identity, evidence, continuity, authority,
              bindings, versions, limitations, and lifecycle remain reviewable after a decision,
              action, or consequence occurs.
            </p>
          </div>

          <div className="learnGrid">
            {[
              ['Reality', 'Define the condition, event, transaction, communication, or environment the record is intended to preserve.'],
              ['Evidence', 'Inventory the materials supporting the declared reality and any consequential claim.'],
              ['Identity', 'Establish the record, owner, system, actor, source, subject, and persistent identifiers.'],
              ['Continuity', 'Preserve chronology, custody, provenance, timestamps, versions, and transformations.'],
              ['Authority', 'Establish who or what possessed authority, including scope and temporal validity.'],
              ['Admissibility', 'Evaluate requirements, limitations, exclusions, missing evidence, and exception states.'],
              ['Binding', 'Bind evidence, authority, policy, identity, and declared intent to the same object.'],
              ['Commit', 'Freeze the pre-execution state and issue a durable manifest identity.'],
              ['Execution', 'Preserve what actually occurred and compare it to what was committed.'],
              ['Outcome', 'Preserve the resulting state and establish outcome correspondence.'],
              ['Governed Record', 'Issue a durable identity, version, receipt, event entries, and reviewable passport.'],
              ['Lifecycle', 'Apply access, custody, reliance, correction, retention, revocation, dispute, and disposition controls.'],
            ].map(([title, description], index) => (
              <article key={title} className="learnCard">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className="footer">
        <div>
          <strong>TA-14 Standard</strong>
          <span>No admissible evidence. No admissible execution.</span>
        </div>
        <div className="footerLinks">
          <Link href="/architecture">Review Architecture</Link>
          <Link href="/workspace/routes/new">Build a Route</Link>
          <Link href="/request-review">Request Independent Review</Link>
        </div>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(body) { margin: 0; background: #050807; color: #edf7f1; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        :global(a) { color: inherit; text-decoration: none; }
        button, input, select { font: inherit; }
        .recordsPage { min-height: 100vh; background: radial-gradient(circle at 15% 0%, rgba(31, 178, 115, .16), transparent 34rem), #050807; }
        .topBar { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: 2rem; padding: 1rem clamp(1rem, 4vw, 4rem); border-bottom: 1px solid rgba(148, 205, 175, .14); background: rgba(5, 8, 7, .86); backdrop-filter: blur(18px); }
        .brand { display: flex; align-items: center; gap: .8rem; font-weight: 700; }
        .brandMark { color: #63e6a6; letter-spacing: .06em; }
        .topNav { display: flex; gap: 1.35rem; color: #a8bdb1; font-size: .92rem; }
        .topNav a[aria-current="page"], .topNav a:hover { color: #fff; }
        .hero, .sectionBlock, .laneGrid, .modeBar, .footer { width: min(1180px, calc(100% - 2rem)); margin-inline: auto; }
        .hero { padding: clamp(4.5rem, 9vw, 8rem) 0 3rem; }
        .eyebrow { margin-bottom: .8rem; color: #63e6a6; font-size: .78rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
        .hero h1 { max-width: 960px; margin: 0; font-size: clamp(2.7rem, 7vw, 6.2rem); line-height: .96; letter-spacing: -.055em; }
        .hero > p { max-width: 800px; margin: 1.6rem 0 0; color: #adbbb3; font-size: clamp(1.05rem, 2vw, 1.35rem); line-height: 1.65; }
        .heroActions { display: flex; flex-wrap: wrap; gap: .8rem; margin-top: 2rem; }
        .primaryButton, .secondaryButton { border-radius: 999px; padding: .95rem 1.35rem; border: 1px solid transparent; cursor: pointer; font-weight: 750; }
        .primaryButton { background: #63e6a6; color: #062316; }
        .secondaryButton { border-color: rgba(166, 213, 188, .26); background: rgba(255,255,255,.03); color: #eef8f2; }
        .releaseNotice { max-width: 900px; margin-top: 2rem; padding: 1rem 1.1rem; border: 1px solid rgba(99, 230, 166, .28); border-radius: 14px; background: rgba(99, 230, 166, .07); color: #bed2c7; line-height: 1.55; }
        .releaseNotice strong { color: #fff; }
        .modeBar { display: flex; gap: .5rem; padding: .5rem; border: 1px solid rgba(148, 205, 175, .14); border-radius: 16px; background: rgba(255,255,255,.025); }
        .modeButton { flex: 1; border: 0; border-radius: 11px; padding: .85rem; background: transparent; color: #91a79a; cursor: pointer; font-weight: 700; }
        .modeButton.active { background: #13231b; color: #fff; box-shadow: inset 0 0 0 1px rgba(99,230,166,.17); }
        .laneGrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; padding: 1rem 0 4rem; }
        .laneCard { min-height: 260px; padding: 1.5rem; text-align: left; border: 1px solid rgba(148, 205, 175, .16); border-radius: 22px; background: linear-gradient(145deg, rgba(22, 35, 29, .84), rgba(8, 13, 11, .9)); color: #edf7f1; cursor: pointer; transition: transform .18s ease, border-color .18s ease; }
        button.laneCard:hover { transform: translateY(-3px); border-color: rgba(99,230,166,.5); }
        .mutedCard { cursor: default; opacity: .78; }
        .laneNumber { color: #63e6a6; font-size: .8rem; font-weight: 800; letter-spacing: .16em; }
        .laneCard h2 { margin: 2.6rem 0 .8rem; font-size: 1.55rem; }
        .laneCard p { max-width: 520px; color: #a9b9b0; line-height: 1.6; }
        .laneAction { display: inline-block; margin-top: 1rem; color: #8af0bb; font-weight: 750; }
        .sectionBlock { padding: 4.5rem 0; border-top: 1px solid rgba(148, 205, 175, .12); }
        .sectionHeading { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(280px, .9fr); gap: 3rem; align-items: end; margin-bottom: 2rem; }
        .sectionHeading h2 { margin: 0; font-size: clamp(2rem, 4vw, 3.7rem); line-height: 1.02; letter-spacing: -.04em; }
        .sectionHeading > p { margin: 0; color: #a7b8ae; line-height: 1.65; }
        .lifecycleGrid, .learnGrid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .8rem; }
        .lifecycleCard, .learnCard { min-height: 190px; padding: 1.2rem; border: 1px solid rgba(148,205,175,.14); border-radius: 18px; background: rgba(255,255,255,.025); }
        .lifecycleCard h3, .learnCard h3 { margin: 0 0 .7rem; }
        .lifecycleCard p, .learnCard p { color: #9fb1a7; line-height: 1.55; }
        .statusPill { display: inline-flex; width: fit-content; align-items: center; border-radius: 999px; padding: .35rem .6rem; font-size: .7rem; font-weight: 850; letter-spacing: .08em; }
        .statusPill.large { padding: .55rem .8rem; font-size: .78rem; }
        .planned { background: rgba(255,255,255,.07); color: #b8c6be; }
        .allow { background: rgba(71, 229, 145, .14); color: #76efad; }
        .hold { background: rgba(255, 204, 91, .13); color: #ffd578; }
        .deny { background: rgba(255, 99, 99, .14); color: #ff8a8a; }
        .escalate { background: rgba(133, 133, 255, .15); color: #a9a9ff; }
        .dropZone { display: grid; place-items: center; gap: .65rem; min-height: 260px; padding: 2rem; border: 1px dashed rgba(99,230,166,.46); border-radius: 22px; background: rgba(99,230,166,.035); text-align: center; cursor: pointer; }
        .dropZone input { position: absolute; width: 1px; height: 1px; opacity: 0; }
        .dropZone span:last-child { color: #94a99d; }
        .dropIcon { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; background: rgba(99,230,166,.12); color: #79edb2; font-size: 1.8rem; }
        .emptyState { margin-top: 1rem; padding: 2rem; border: 1px solid rgba(148,205,175,.12); border-radius: 18px; color: #9fb1a7; text-align: center; }
        .emptyState h3 { margin-top: 0; color: #fff; }
        .emptyState.compact { margin: .8rem; padding: 1rem; }
        .materialList { display: grid; gap: .8rem; margin-top: 1rem; }
        .materialCard { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(190px, .8fr) minmax(220px, 1fr) auto; gap: 1rem; align-items: center; padding: 1rem; border: 1px solid rgba(148,205,175,.14); border-radius: 16px; background: rgba(255,255,255,.025); }
        .materialName { font-weight: 750; overflow-wrap: anywhere; }
        .materialMeta { margin-top: .35rem; color: #8da095; font-size: .85rem; }
        label { display: grid; gap: .4rem; color: #a9b9b0; font-size: .8rem; }
        input, select { width: 100%; border: 1px solid rgba(148,205,175,.18); border-radius: 10px; padding: .75rem .8rem; background: #0b110e; color: #edf7f1; outline: none; }
        input:focus, select:focus { border-color: #63e6a6; box-shadow: 0 0 0 3px rgba(99,230,166,.1); }
        .localState { display: grid; gap: .3rem; color: #8fa196; font-size: .75rem; }
        .localState strong { color: #ffd578; }
        .textButton { border: 0; background: transparent; cursor: pointer; }
        .danger { color: #ff8a8a; }
        .readinessPanel { display: grid; grid-template-columns: minmax(220px,.5fr) 1fr; gap: 2rem; margin-top: 1rem; padding: 1.4rem; border: 1px solid rgba(255,204,91,.22); border-radius: 18px; background: rgba(255,204,91,.045); }
        .readinessPanel h3 { margin: 0; }
        .readinessPanel p { margin: 0; color: #b9b29d; line-height: 1.6; }
        .filters { display: grid; grid-template-columns: 2fr repeat(3, 1fr); gap: .8rem; margin-bottom: 1rem; }
        .recordWorkspace { display: grid; grid-template-columns: 340px minmax(0,1fr); gap: 1rem; align-items: start; }
        .recordList, .recordDetail { border: 1px solid rgba(148,205,175,.14); border-radius: 20px; background: rgba(255,255,255,.022); overflow: hidden; }
        .listHeader { display: flex; justify-content: space-between; padding: 1rem; border-bottom: 1px solid rgba(148,205,175,.12); color: #9eb1a6; }
        .recordRow { position: relative; display: grid; gap: .35rem; width: 100%; padding: 1rem; border: 0; border-bottom: 1px solid rgba(148,205,175,.1); background: transparent; color: #edf7f1; text-align: left; cursor: pointer; }
        .recordRow:hover, .recordRow.active { background: rgba(99,230,166,.065); }
        .recordRow .statusPill { position: absolute; top: 1rem; right: 1rem; }
        .recordRow > span:not(.statusPill) { color: #8fa196; font-size: .78rem; }
        .recordId { color: #68e9a9; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .78rem; }
        .recordDetail { padding: clamp(1.2rem, 3vw, 2rem); }
        .recordTitleRow { display: flex; justify-content: space-between; gap: 1rem; align-items: start; }
        .recordTitleRow h2 { margin: .55rem 0 0; font-size: clamp(1.7rem, 3vw, 2.8rem); letter-spacing: -.035em; }
        .demoBanner { display: grid; gap: .35rem; margin: 1.2rem 0; padding: 1rem; border: 1px solid rgba(99,230,166,.25); border-radius: 14px; background: rgba(99,230,166,.055); color: #a8bdb1; }
        .demoBanner strong { color: #fff; }
        .recordSummary { color: #b4c4bb; font-size: 1.05rem; line-height: 1.65; }
        .metricGrid { display: grid; grid-template-columns: repeat(3,1fr); gap: .8rem; margin: 1.4rem 0; }
        .metricGrid > div { padding: 1rem; border: 1px solid rgba(148,205,175,.12); border-radius: 14px; background: rgba(255,255,255,.022); }
        .metricGrid span { display: block; color: #8fa196; font-size: .78rem; }
        .metricGrid strong { display: block; margin-top: .45rem; font-size: 1.45rem; }
        .recordFacts { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: .7rem; }
        .recordFacts div { padding: .9rem 0; border-bottom: 1px solid rgba(148,205,175,.1); }
        .recordFacts dt { color: #7f9287; font-size: .75rem; }
        .recordFacts dd { margin: .35rem 0 0; }
        .chainSection { margin-top: 2rem; }
        .chainSection h3 { margin-top: 0; font-size: 1.5rem; }
        .chainList { display: grid; gap: .65rem; }
        .chainItem { display: grid; grid-template-columns: 44px 1fr; gap: .8rem; padding: .9rem; border: 1px solid rgba(148,205,175,.12); border-radius: 14px; }
        .chainIndex { color: #63e6a6; font-family: ui-monospace, monospace; }
        .chainHeading { display: flex; justify-content: space-between; gap: 1rem; }
        .chainItem p { margin: .4rem 0 0; color: #9fb1a7; line-height: 1.5; }
        .chainStatus { font-size: .7rem; font-weight: 850; letter-spacing: .08em; }
        .chainStatus.verified { color: #76efad; }
        .chainStatus.warning { color: #ffd578; }
        .chainStatus.failed { color: #ff8a8a; }
        .learnCard > span { color: #63e6a6; font-family: ui-monospace, monospace; font-size: .8rem; }
        .footer { display: flex; justify-content: space-between; gap: 2rem; padding: 2rem 0 3rem; border-top: 1px solid rgba(148,205,175,.12); color: #8fa196; }
        .footer > div:first-child { display: grid; gap: .35rem; }
        .footer strong { color: #edf7f1; }
        .footerLinks { display: flex; flex-wrap: wrap; gap: 1rem; }
        .footerLinks a:hover { color: #fff; }
        @media (max-width: 920px) {
          .topNav { display: none; }
          .laneGrid, .lifecycleGrid, .learnGrid { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .sectionHeading { grid-template-columns: 1fr; gap: 1rem; }
          .filters { grid-template-columns: repeat(2,1fr); }
          .recordWorkspace { grid-template-columns: 1fr; }
          .recordList { max-height: 420px; overflow: auto; }
          .materialCard { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 620px) {
          .hero h1 { font-size: 2.75rem; }
          .modeBar { overflow-x: auto; }
          .modeButton { min-width: 110px; }
          .laneGrid, .lifecycleGrid, .learnGrid, .filters, .metricGrid, .recordFacts, .materialCard, .readinessPanel { grid-template-columns: 1fr; }
          .laneCard { min-height: 230px; }
          .footer { flex-direction: column; }
          .recordTitleRow { flex-direction: column; }
        }
      `}</style>
    </main>
  );
}
