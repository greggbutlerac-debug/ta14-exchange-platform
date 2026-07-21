'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';

type EvidenceItem = {
  id: string;
  label: string;
  source: string;
  capturedAt: string;
  authority: string;
  notes: string;
};

const RECORD_TYPES = [
  'Atmospheric Integrity Record',
  'Personal Atmospheric Integrity Record',
  'Building Environmental Record',
  'Hospital Environmental Record',
  'Laboratory Record',
  'HVAC Diagnostic Record',
  'Sensor Evidence Package',
  'Operational Event Record',
  'Financial Execution Record',
  'AI Governance Record',
  'Other Governed Record',
] as const;

type RecordType = (typeof RECORD_TYPES)[number];

const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: 'evidence-1',
    label: '',
    source: '',
    capturedAt: '',
    authority: '',
    notes: '',
  },
];

const SIDEBAR_LINKS = [
  {
    label: 'Build the Record',
    href: '/workspace/governed-records/build',
    glyph: '＋',
    active: true,
  },
  {
    label: 'Governed Records Home',
    href: '/workspace/governed-records',
    glyph: '⌂',
    active: false,
  },
  {
    label: 'My Records',
    href: '/workspace/governed-records/my-records',
    glyph: 'R',
    active: false,
  },
  {
    label: 'Continuity Review',
    href: '/workspace/governed-records/continuity-review',
    glyph: 'C',
    active: false,
  },
  {
    label: 'Record Comparison',
    href: '/workspace/governed-records/comparison',
    glyph: '≋',
    active: false,
  },
  {
    label: 'Preserved Records',
    href: '/workspace/governed-records/preserved-records',
    glyph: 'P',
    active: false,
  },
  {
    label: 'Verification',
    href: '/workspace/governed-records/verification',
    glyph: '✓',
    active: false,
  },
  {
    label: 'Pricing',
    href: '/workspace/governed-records/pricing',
    glyph: '$',
    active: false,
  },
] as const;

export default function BuildGovernedRecordPage() {
  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState<RecordType>(
    RECORD_TYPES[0],
  );
  const [recordOwner, setRecordOwner] = useState('');
  const [recordAuthority, setRecordAuthority] = useState('');
  const [realityStatement, setRealityStatement] = useState('');
  const [proofStatement, setProofStatement] = useState('');
  const [nonProofStatement, setNonProofStatement] = useState('');
  const [continuityStatement, setContinuityStatement] = useState('');
  const [correctionRule, setCorrectionRule] = useState(
    'Corrections create a new version. Prior preserved states remain visible.',
  );
  const [evidence, setEvidence] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);
  const [status, setStatus] = useState<'draft' | 'review-ready'>('draft');

  const completion = useMemo(() => {
    const required = [
      title,
      recordType,
      recordOwner,
      recordAuthority,
      realityStatement,
      proofStatement,
      nonProofStatement,
      continuityStatement,
    ];

    const completedRequired = required.filter((value) => value.trim().length > 0).length;
    const evidenceComplete = evidence.some(
      (item) =>
        item.label.trim() &&
        item.source.trim() &&
        item.capturedAt.trim() &&
        item.authority.trim(),
    );

    return Math.round(
      ((completedRequired + (evidenceComplete ? 1 : 0)) / (required.length + 1)) * 100,
    );
  }, [
    title,
    recordType,
    recordOwner,
    recordAuthority,
    realityStatement,
    proofStatement,
    nonProofStatement,
    continuityStatement,
    evidence,
  ]);

  function updateEvidence(
    id: string,
    field: keyof Omit<EvidenceItem, 'id'>,
    value: string,
  ) {
    setEvidence((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  function addEvidenceItem() {
    setEvidence((current) => [
      ...current,
      {
        id: `evidence-${Date.now()}`,
        label: '',
        source: '',
        capturedAt: '',
        authority: '',
        notes: '',
      },
    ]);
  }

  function removeEvidenceItem(id: string) {
    setEvidence((current) =>
      current.length === 1 ? current : current.filter((item) => item.id !== id),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('review-ready');
  }

  return (
    <main className="builderShell">
      <aside className="sidebar">
        <div className="sidebarBrand">
          <p className="eyebrow">TA-14 Governed Records</p>
          <h1>Record Workspace</h1>
          <p>
            Begin with declared reality. Keep evidence separate from interpretation,
            determination, diagnosis, and optimization.
          </p>
        </div>

        <nav className="sidebarNav" aria-label="Governed Records navigation">
          {SIDEBAR_LINKS.map((item) => (
            <Link
              className={`sidebarLink ${
                item.active ? 'active' : ''
              }`}
              href={item.href}
              key={item.href}
            >
              <span>{item.glyph}</span>
              <strong>{item.label}</strong>
            </Link>
          ))}
        </nav>

        <div className="sidebarPrinciple">
          <span className="statusDot" />
          <p>No admissible evidence. No admissible execution.</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="pageHeader">
          <div>
            <p className="eyebrow">Construct</p>
            <h2>Build the governed record.</h2>
            <p>
              Capture the record first. Declare its source, continuity, authority,
              and proof boundaries before anyone interprets or acts on it.
            </p>
          </div>

          <div className="completionCard">
            <span>{completion}%</span>
            <div>
              <strong>Record completion</strong>
              <small>
                {status === 'review-ready'
                  ? 'Ready for bounded review'
                  : 'Draft record'}
              </small>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <section className="formSection">
            <div className="sectionNumber">01</div>
            <div className="sectionContent">
              <div className="sectionHeading">
                <p className="eyebrow">Record identity</p>
                <h3>Identify the record before describing what it contains.</h3>
                <p>
                  Identity must remain stable across review, correction, preservation,
                  comparison, and verification.
                </p>
              </div>

              <div className="fieldGrid twoColumns">
                <label>
                  <span>Record title</span>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Example: Building Atmospheric Integrity Record — July 21"
                    required
                  />
                </label>

                <label>
                  <span>Record type</span>
                  <select
                    value={recordType}
                    onChange={(event) =>
                      setRecordType(event.target.value as RecordType)
                    }
                  >
                    {RECORD_TYPES.map((type) => (
                      <option value={type} key={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Record owner</span>
                  <input
                    value={recordOwner}
                    onChange={(event) => setRecordOwner(event.target.value)}
                    placeholder="Person, facility, organization, or system"
                    required
                  />
                </label>

                <label>
                  <span>Governing authority</span>
                  <input
                    value={recordAuthority}
                    onChange={(event) => setRecordAuthority(event.target.value)}
                    placeholder="Who has authority to create and preserve this record?"
                    required
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="formSection">
            <div className="sectionNumber">02</div>
            <div className="sectionContent">
              <div className="sectionHeading">
                <p className="eyebrow">Declared reality</p>
                <h3>State what was actually observed, measured, received, or asserted.</h3>
                <p>
                  Do not begin with a diagnosis, recommendation, score, or conclusion.
                  Describe the bounded reality entering the record.
                </p>
              </div>

              <label>
                <span>Reality statement</span>
                <textarea
                  value={realityStatement}
                  onChange={(event) => setRealityStatement(event.target.value)}
                  placeholder="Describe the condition, event, measurement period, transaction, inspection, or operational state that this record preserves."
                  rows={7}
                  required
                />
              </label>
            </div>
          </section>

          <section className="formSection">
            <div className="sectionNumber">03</div>
            <div className="sectionContent">
              <div className="sectionHeading evidenceHeading">
                <div>
                  <p className="eyebrow">Evidence package</p>
                  <h3>Attach each evidentiary element to its source and authority.</h3>
                  <p>
                    A file, reading, image, statement, or sensor stream does not govern
                    itself. Every item needs a declared origin and custody point.
                  </p>
                </div>

                <button type="button" className="addButton" onClick={addEvidenceItem}>
                  + Add evidence item
                </button>
              </div>

              <div className="evidenceStack">
                {evidence.map((item, index) => (
                  <article className="evidenceCard" key={item.id}>
                    <div className="evidenceCardHeader">
                      <div>
                        <span>Evidence item {String(index + 1).padStart(2, '0')}</span>
                        <strong>
                          {item.label.trim() || 'Unidentified evidence'}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEvidenceItem(item.id)}
                        disabled={evidence.length === 1}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="fieldGrid twoColumns">
                      <label>
                        <span>Evidence label</span>
                        <input
                          value={item.label}
                          onChange={(event) =>
                            updateEvidence(item.id, 'label', event.target.value)
                          }
                          placeholder="Sensor export, inspection image, signed statement..."
                        />
                      </label>

                      <label>
                        <span>Source</span>
                        <input
                          value={item.source}
                          onChange={(event) =>
                            updateEvidence(item.id, 'source', event.target.value)
                          }
                          placeholder="Instrument, person, platform, facility, laboratory..."
                        />
                      </label>

                      <label>
                        <span>Captured or received at</span>
                        <input
                          type="datetime-local"
                          value={item.capturedAt}
                          onChange={(event) =>
                            updateEvidence(item.id, 'capturedAt', event.target.value)
                          }
                        />
                      </label>

                      <label>
                        <span>Evidence authority</span>
                        <input
                          value={item.authority}
                          onChange={(event) =>
                            updateEvidence(item.id, 'authority', event.target.value)
                          }
                          placeholder="Who was authorized to produce or submit it?"
                        />
                      </label>
                    </div>

                    <label>
                      <span>Evidence notes</span>
                      <textarea
                        value={item.notes}
                        onChange={(event) =>
                          updateEvidence(item.id, 'notes', event.target.value)
                        }
                        placeholder="Calibration, collection method, known limitations, custody, missing intervals, or other relevant conditions."
                        rows={4}
                      />
                    </label>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="formSection">
            <div className="sectionNumber">04</div>
            <div className="sectionContent">
              <div className="sectionHeading">
                <p className="eyebrow">Continuity</p>
                <h3>Declare the sequence and any known breaks.</h3>
                <p>
                  Continuity is not created by hiding gaps. It is preserved by making
                  sequence, custody, overlaps, omissions, and changes visible.
                </p>
              </div>

              <label>
                <span>Continuity statement</span>
                <textarea
                  value={continuityStatement}
                  onChange={(event) => setContinuityStatement(event.target.value)}
                  placeholder="Describe the collection period, custody, sequence, known gaps, source changes, transfer points, and version history."
                  rows={6}
                  required
                />
              </label>
            </div>
          </section>

          <section className="formSection">
            <div className="sectionNumber">05</div>
            <div className="sectionContent">
              <div className="sectionHeading">
                <p className="eyebrow">Proof boundaries</p>
                <h3>State what the record proves—and where proof stops.</h3>
                <p>
                  A governed record is not admissible merely because it is detailed.
                  Its permitted meaning must remain bounded by the evidence.
                </p>
              </div>

              <div className="fieldGrid twoColumns">
                <label>
                  <span>What this record proves</span>
                  <textarea
                    value={proofStatement}
                    onChange={(event) => setProofStatement(event.target.value)}
                    placeholder="State only the claims directly supported by the admitted evidence."
                    rows={7}
                    required
                  />
                </label>

                <label>
                  <span>What this record does not prove</span>
                  <textarea
                    value={nonProofStatement}
                    onChange={(event) => setNonProofStatement(event.target.value)}
                    placeholder="Declare unsupported conclusions, missing periods, excluded causes, absent authority, or other limits."
                    rows={7}
                    required
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="formSection">
            <div className="sectionNumber">06</div>
            <div className="sectionContent">
              <div className="sectionHeading">
                <p className="eyebrow">Correction and preservation</p>
                <h3>Preserve the prior state when the record changes.</h3>
                <p>
                  Correction must not erase history. A changed record becomes a new
                  version connected to the original state and reason for correction.
                </p>
              </div>

              <label>
                <span>Correction rule</span>
                <textarea
                  value={correctionRule}
                  onChange={(event) => setCorrectionRule(event.target.value)}
                  rows={4}
                />
              </label>
            </div>
          </section>

          <section className="reviewPanel">
            <div>
              <p className="eyebrow">Bounded submission</p>
              <h3>Prepare the record for review.</h3>
              <p>
                This action does not diagnose the condition, approve an intervention,
                confer authority, or prove an outcome. It prepares the declared record
                for continuity, admissibility, preservation, and verification review.
              </p>
            </div>

            <div className="reviewActions">
              <button type="button" className="secondaryAction">
                Save Draft
              </button>
              <button type="submit" className="primaryAction">
                Prepare for Review
              </button>
            </div>
          </section>
        </form>

        {status === 'review-ready' ? (
          <section className="successPanel" aria-live="polite">
            <div className="successIcon">✓</div>
            <div>
              <p className="eyebrow">Draft determination</p>
              <h3>Record prepared for bounded review.</h3>
              <p>
                The record has not yet been verified, preserved, interpreted, or
                admitted for consequential use.
              </p>
            </div>
            <Link href="/workspace/governed-records/continuity-review">
              Continue to Continuity Review →
            </Link>
          </section>
        ) : null}
      </section>

      <style>{`
        .builderShell {
          --cyan: #6ee7ff;
          --green: #66f0bd;
          --violet: #aa9cff;
          --amber: #ffc978;
          --line: rgba(145, 205, 225, 0.16);
          display: grid;
          grid-template-columns: 290px minmax(0, 1fr);
          min-height: 100vh;
          color: #f3f9fc;
          background:
            radial-gradient(circle at 85% 4%, rgba(110, 231, 255, 0.1), transparent 25%),
            linear-gradient(180deg, #061018 0%, #03090e 100%);
        }

        .sidebar {
          position: sticky;
          top: 0;
          display: flex;
          height: 100vh;
          flex-direction: column;
          padding: 28px 20px 22px;
          border-right: 1px solid var(--line);
          background: rgba(4, 14, 21, 0.94);
          backdrop-filter: blur(18px);
        }

        .eyebrow {
          margin: 0 0 10px;
          color: var(--cyan);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .sidebarBrand h1 {
          margin: 0;
          font-size: 1.65rem;
          letter-spacing: -0.04em;
        }

        .sidebarBrand > p:last-child {
          margin: 14px 0 0;
          color: #8299a7;
          font-size: 12px;
          line-height: 1.65;
        }

        .sidebarNav {
          display: grid;
          gap: 7px;
          margin-top: 30px;
        }

        .sidebarLink {
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr);
          gap: 10px;
          align-items: center;
          min-height: 48px;
          padding: 6px 10px;
          border: 1px solid transparent;
          border-radius: 12px;
          color: #8fa7b5;
          text-decoration: none;
          transition: border-color 170ms ease, background 170ms ease, color 170ms ease;
        }

        .sidebarLink span {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border: 1px solid rgba(110, 231, 255, 0.14);
          border-radius: 9px;
          font-size: 13px;
          font-weight: 900;
        }

        .sidebarLink strong {
          font-size: 12px;
        }

        .sidebarLink:hover {
          color: #dff7ff;
          border-color: rgba(110, 231, 255, 0.18);
          background: rgba(110, 231, 255, 0.04);
        }

        .sidebarLink.active {
          color: #031118;
          border-color: rgba(110, 231, 255, 0.44);
          background: linear-gradient(135deg, var(--cyan), var(--green));
        }

        .sidebarLink.active span {
          border-color: rgba(3, 17, 24, 0.18);
        }

        .sidebarPrinciple {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-top: auto;
          padding: 15px;
          border: 1px solid rgba(102, 240, 189, 0.16);
          border-radius: 13px;
          background: rgba(102, 240, 189, 0.035);
        }

        .statusDot {
          width: 8px;
          height: 8px;
          margin-top: 4px;
          flex: 0 0 auto;
          border-radius: 99px;
          background: var(--green);
          box-shadow: 0 0 14px rgba(102, 240, 189, 0.8);
        }

        .sidebarPrinciple p {
          margin: 0;
          color: #9bb7aa;
          font-size: 10px;
          font-weight: 800;
          line-height: 1.5;
        }

        .workspace {
          width: min(1180px, 100%);
          margin: 0 auto;
          padding: 42px clamp(20px, 4vw, 62px) 70px;
        }

        .pageHeader {
          display: flex;
          justify-content: space-between;
          gap: 28px;
          align-items: flex-end;
          margin-bottom: 30px;
        }

        .pageHeader h2 {
          margin: 0;
          font-size: clamp(2.8rem, 5vw, 5.8rem);
          line-height: 0.93;
          letter-spacing: -0.065em;
        }

        .pageHeader > div:first-child > p:last-child {
          max-width: 760px;
          margin: 18px 0 0;
          color: #8fa7b5;
          line-height: 1.72;
        }

        .completionCard {
          display: flex;
          min-width: 220px;
          gap: 14px;
          align-items: center;
          padding: 16px 18px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(8, 24, 34, 0.84);
        }

        .completionCard > span {
          color: var(--green);
          font-size: 1.5rem;
          font-weight: 900;
        }

        .completionCard strong,
        .completionCard small {
          display: block;
        }

        .completionCard strong {
          font-size: 12px;
        }

        .completionCard small {
          margin-top: 4px;
          color: #78909e;
          font-size: 10px;
        }

        form {
          display: grid;
          gap: 18px;
        }

        .formSection {
          display: grid;
          grid-template-columns: 62px minmax(0, 1fr);
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: rgba(7, 22, 31, 0.88);
        }

        .sectionNumber {
          display: flex;
          justify-content: center;
          padding-top: 31px;
          border-right: 1px solid var(--line);
          color: #547181;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          background: rgba(110, 231, 255, 0.025);
        }

        .sectionContent {
          padding: clamp(24px, 4vw, 38px);
        }

        .sectionHeading {
          max-width: 780px;
          margin-bottom: 25px;
        }

        .sectionHeading h3,
        .reviewPanel h3,
        .successPanel h3 {
          margin: 0;
          font-size: clamp(1.65rem, 3vw, 2.8rem);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .sectionHeading > p:last-child,
        .reviewPanel p:last-child,
        .successPanel p {
          margin: 13px 0 0;
          color: #849dab;
          font-size: 13px;
          line-height: 1.72;
        }

        .fieldGrid {
          display: grid;
          gap: 16px;
        }

        .twoColumns {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        label {
          display: grid;
          gap: 8px;
        }

        label > span {
          color: #bfd1d9;
          font-size: 11px;
          font-weight: 800;
        }

        input,
        select,
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid rgba(145, 205, 225, 0.17);
          border-radius: 11px;
          outline: none;
          color: #eaf6fa;
          background: rgba(3, 13, 20, 0.74);
          font: inherit;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        input,
        select {
          min-height: 47px;
          padding: 0 13px;
        }

        textarea {
          resize: vertical;
          padding: 13px;
          line-height: 1.6;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: rgba(110, 231, 255, 0.52);
          box-shadow: 0 0 0 3px rgba(110, 231, 255, 0.07);
        }

        input::placeholder,
        textarea::placeholder {
          color: #526b79;
        }

        select option {
          color: #edf8fb;
          background: #07131c;
        }

        .evidenceHeading {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          max-width: none;
        }

        .addButton,
        .secondaryAction,
        .primaryAction {
          border: 0;
          border-radius: 11px;
          cursor: pointer;
          font-weight: 900;
        }

        .addButton {
          min-height: 42px;
          flex: 0 0 auto;
          padding: 0 14px;
          border: 1px solid rgba(110, 231, 255, 0.22);
          color: var(--cyan);
          background: rgba(110, 231, 255, 0.05);
          font-size: 11px;
        }

        .evidenceStack {
          display: grid;
          gap: 14px;
        }

        .evidenceCard {
          padding: 20px;
          border: 1px solid rgba(145, 205, 225, 0.13);
          border-radius: 16px;
          background: rgba(2, 12, 18, 0.5);
        }

        .evidenceCardHeader {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 18px;
        }

        .evidenceCardHeader span,
        .evidenceCardHeader strong {
          display: block;
        }

        .evidenceCardHeader span {
          color: var(--green);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .evidenceCardHeader strong {
          margin-top: 5px;
          font-size: 14px;
        }

        .evidenceCardHeader button {
          border: 0;
          cursor: pointer;
          color: #b88787;
          background: transparent;
          font-size: 10px;
          font-weight: 800;
        }

        .evidenceCardHeader button:disabled {
          cursor: not-allowed;
          opacity: 0.3;
        }

        .evidenceCard > label {
          margin-top: 16px;
        }

        .reviewPanel {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          align-items: center;
          padding: clamp(26px, 4vw, 40px);
          border: 1px solid rgba(102, 240, 189, 0.23);
          border-radius: 22px;
          background:
            radial-gradient(circle at 8% 50%, rgba(102, 240, 189, 0.09), transparent 30%),
            rgba(6, 27, 29, 0.86);
        }

        .reviewPanel > div:first-child {
          max-width: 740px;
        }

        .reviewActions {
          display: flex;
          flex: 0 0 auto;
          gap: 10px;
        }

        .secondaryAction,
        .primaryAction {
          min-height: 48px;
          padding: 0 18px;
          font-size: 11px;
        }

        .secondaryAction {
          border: 1px solid rgba(110, 231, 255, 0.22);
          color: #d9f5fc;
          background: rgba(110, 231, 255, 0.04);
        }

        .primaryAction {
          color: #031118;
          background: linear-gradient(135deg, var(--cyan), var(--green));
        }

        .successPanel {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
          margin-top: 18px;
          padding: 22px;
          border: 1px solid rgba(102, 240, 189, 0.3);
          border-radius: 18px;
          background: rgba(7, 35, 31, 0.82);
        }

        .successIcon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          color: #032018;
          background: var(--green);
          font-weight: 900;
        }

        .successPanel a {
          color: var(--green);
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
        }

        @media (max-width: 980px) {
          .builderShell {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: relative;
            height: auto;
            border-right: 0;
            border-bottom: 1px solid var(--line);
          }

          .sidebarNav {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .sidebarPrinciple {
            margin-top: 22px;
          }

          .pageHeader,
          .reviewPanel {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 700px) {
          .workspace {
            padding-inline: 12px;
          }

          .sidebarNav,
          .twoColumns {
            grid-template-columns: 1fr;
          }

          .pageHeader {
            align-items: stretch;
          }

          .completionCard {
            min-width: 0;
          }

          .formSection {
            grid-template-columns: 1fr;
          }

          .sectionNumber {
            justify-content: flex-start;
            padding: 13px 18px;
            border-right: 0;
            border-bottom: 1px solid var(--line);
          }

          .evidenceHeading,
          .reviewPanel,
          .reviewActions {
            flex-direction: column;
          }

          .reviewActions {
            width: 100%;
          }

          .reviewActions button {
            width: 100%;
          }

          .successPanel {
            grid-template-columns: auto minmax(0, 1fr);
          }

          .successPanel a {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </main>
  );
}
