// apps/web/components/eu-ai-act/evidence-panel.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type EvidenceStatus =
  | 'NOT STARTED'
  | 'DECLARED'
  | 'IN REVIEW'
  | 'VERIFIED'
  | 'HOLD'
  | 'DENY'
  | 'ESCALATE';

export type EvidenceItem = {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  declared?: boolean;
  verified?: boolean;
  source?: string;
  version?: string;
  date?: string;
};

export type FailureState = {
  id: string;
  title: string;
  consequence: string;
  requiredEvidence?: string[];
  recoveryRoute?: string[];
};

export type EvidencePanelProps = {
  id: string;
  requirement: string;
  requirementReference?: string;
  requirementHref?: string;
  summary?: string;
  responsibleRoles: string[];
  evidence: EvidenceItem[];
  failureStates?: FailureState[];
  governedOutputs?: string[];
  reviewStatus?: EvidenceStatus;
  governedOutcome?: EvidenceStatus;
  governedRecordLabel?: string;
  governedRecordHref?: string;
  verificationLabel?: string;
  verificationHref?: string;
  compact?: boolean;
  defaultExpanded?: boolean;
  onEvidenceChange?: (evidence: EvidenceItem[]) => void;
  onReviewStatusChange?: (status: EvidenceStatus) => void;
  onOutcomeChange?: (status: EvidenceStatus) => void;
};

const statusLabels: EvidenceStatus[] = [
  'NOT STARTED',
  'DECLARED',
  'IN REVIEW',
  'VERIFIED',
  'HOLD',
  'DENY',
  'ESCALATE',
];

function slugifyStatus(status: EvidenceStatus) {
  return status.toLowerCase().replaceAll(' ', '-');
}

function calculatePercent(items: EvidenceItem[], key: 'declared' | 'verified') {
  if (!items.length) {
    return 0;
  }

  return Math.round(
    (items.filter((item) => Boolean(item[key])).length / items.length) * 100,
  );
}

export default function EvidencePanel({
  id,
  requirement,
  requirementReference,
  requirementHref,
  summary,
  responsibleRoles,
  evidence,
  failureStates = [],
  governedOutputs = [],
  reviewStatus = 'NOT STARTED',
  governedOutcome = 'NOT STARTED',
  governedRecordLabel = 'No governed record linked',
  governedRecordHref,
  verificationLabel = 'No verification record linked',
  verificationHref,
  compact = false,
  defaultExpanded = true,
  onEvidenceChange,
  onReviewStatusChange,
  onOutcomeChange,
}: EvidencePanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [localEvidence, setLocalEvidence] = useState<EvidenceItem[]>(evidence);
  const [localReviewStatus, setLocalReviewStatus] =
    useState<EvidenceStatus>(reviewStatus);
  const [localOutcome, setLocalOutcome] =
    useState<EvidenceStatus>(governedOutcome);
  const [activeFailureState, setActiveFailureState] = useState<string | null>(
    null,
  );

  const declaredPercent = useMemo(
    () => calculatePercent(localEvidence, 'declared'),
    [localEvidence],
  );

  const verifiedPercent = useMemo(
    () => calculatePercent(localEvidence, 'verified'),
    [localEvidence],
  );

  const requiredItems = useMemo(
    () => localEvidence.filter((item) => item.required !== false),
    [localEvidence],
  );

  const missingEvidence = useMemo(
    () =>
      requiredItems.filter((item) => !item.declared).map((item) => item.label),
    [requiredItems],
  );

  const unresolvedVerification = useMemo(
    () =>
      requiredItems.filter((item) => !item.verified).map((item) => item.label),
    [requiredItems],
  );

  const status: EvidenceStatus = useMemo(() => {
    if (localOutcome === 'DENY') {
      return 'DENY';
    }

    if (localOutcome === 'HOLD') {
      return 'HOLD';
    }

    if (localOutcome === 'ESCALATE') {
      return 'ESCALATE';
    }

    if (verifiedPercent === 100 && localReviewStatus === 'VERIFIED') {
      return 'VERIFIED';
    }

    if (declaredPercent === 100 && localReviewStatus === 'IN REVIEW') {
      return 'IN REVIEW';
    }

    if (declaredPercent > 0) {
      return 'DECLARED';
    }

    return 'NOT STARTED';
  }, [declaredPercent, localOutcome, localReviewStatus, verifiedPercent]);

  function updateEvidence(
    evidenceId: string,
    field: 'declared' | 'verified',
    value: boolean,
  ) {
    const nextEvidence = localEvidence.map((item) =>
      item.id === evidenceId
        ? {
            ...item,
            [field]: value,
            ...(field === 'declared' && !value ? { verified: false } : {}),
          }
        : item,
    );

    setLocalEvidence(nextEvidence);
    onEvidenceChange?.(nextEvidence);
  }

  function updateReviewStatus(statusValue: EvidenceStatus) {
    setLocalReviewStatus(statusValue);
    onReviewStatusChange?.(statusValue);
  }

  function updateOutcome(statusValue: EvidenceStatus) {
    setLocalOutcome(statusValue);
    onOutcomeChange?.(statusValue);
  }

  return (
    <article
      className={[
        'evidence-panel',
        compact ? 'compact' : '',
        expanded ? 'expanded' : 'collapsed',
      ]
        .filter(Boolean)
        .join(' ')}
      id={id}
    >
      <div className="panel-header">
        <div className="requirement-block">
          <div className="topline">
            <span className="panel-id">{id}</span>
            <span className={`status-badge ${slugifyStatus(status)}`}>
              {status}
            </span>
          </div>

          <div className="title-row">
            <div>
              <h3>{requirement}</h3>
              {requirementReference ? (
                requirementHref ? (
                  <Link className="requirement-reference" href={requirementHref}>
                    {requirementReference}
                  </Link>
                ) : (
                  <span className="requirement-reference">
                    {requirementReference}
                  </span>
                )
              ) : null}
            </div>

            <button
              type="button"
              className="expand-button"
              aria-expanded={expanded}
              aria-controls={`${id}-content`}
              onClick={() => setExpanded((current) => !current)}
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          </div>

          {summary ? <p className="summary">{summary}</p> : null}
        </div>

        <div className="progress-block">
          <div className="progress-card">
            <div className="progress-label">
              <span>Evidence declared</span>
              <strong>{declaredPercent}%</strong>
            </div>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${declaredPercent}%` }} />
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-label">
              <span>Evidence verified</span>
              <strong>{verifiedPercent}%</strong>
            </div>
            <div className="progress-track verification" aria-hidden="true">
              <span style={{ width: `${verifiedPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="role-row" aria-label="Responsible roles">
        <span>Responsible roles</span>
        <div>
          {responsibleRoles.map((role) => (
            <span className="role-chip" key={role}>
              {role}
            </span>
          ))}
        </div>
      </div>

      {expanded ? (
        <div className="panel-content" id={`${id}-content`}>
          <section className="evidence-section">
            <div className="section-title">
              <div>
                <span className="section-index">01</span>
                <h4>Evidence package</h4>
              </div>
              <p>
                Declaration and verification are separate states. A declaration
                does not prove validity, completeness, continuity, or legal
                sufficiency.
              </p>
            </div>

            <div className="evidence-grid">
              {localEvidence.map((item) => (
                <article className="evidence-item" key={item.id}>
                  <div className="evidence-item-topline">
                    <div>
                      <span>{item.required === false ? 'SUPPORTING' : 'REQUIRED'}</span>
                      <small>{item.id}</small>
                    </div>
                    <span
                      className={[
                        'item-state',
                        item.verified
                          ? 'verified'
                          : item.declared
                            ? 'declared'
                            : 'missing',
                      ].join(' ')}
                    >
                      {item.verified
                        ? 'VERIFIED'
                        : item.declared
                          ? 'DECLARED'
                          : 'MISSING'}
                    </span>
                  </div>

                  <h5>{item.label}</h5>
                  {item.description ? <p>{item.description}</p> : null}

                  {(item.source || item.version || item.date) && (
                    <dl className="metadata-grid">
                      {item.source ? (
                        <div>
                          <dt>Source</dt>
                          <dd>{item.source}</dd>
                        </div>
                      ) : null}
                      {item.version ? (
                        <div>
                          <dt>Version</dt>
                          <dd>{item.version}</dd>
                        </div>
                      ) : null}
                      {item.date ? (
                        <div>
                          <dt>Date</dt>
                          <dd>{item.date}</dd>
                        </div>
                      ) : null}
                    </dl>
                  )}

                  <div className="evidence-controls">
                    <label className={item.declared ? 'control active' : 'control'}>
                      <input
                        type="checkbox"
                        checked={Boolean(item.declared)}
                        onChange={(event) =>
                          updateEvidence(
                            item.id,
                            'declared',
                            event.target.checked,
                          )
                        }
                      />
                      <span>
                        <strong>Declared</strong>
                        <small>Existence asserted only</small>
                      </span>
                    </label>

                    <label
                      className={
                        item.verified
                          ? 'control active verified-control'
                          : 'control verified-control'
                      }
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(item.verified)}
                        disabled={!item.declared}
                        onChange={(event) =>
                          updateEvidence(
                            item.id,
                            'verified',
                            event.target.checked,
                          )
                        }
                      />
                      <span>
                        <strong>Verified</strong>
                        <small>Independent validation asserted</small>
                      </span>
                    </label>
                  </div>
                </article>
              ))}
            </div>

            <div className="gap-grid">
              <article>
                <span>Missing evidence</span>
                {missingEvidence.length ? (
                  <ul>
                    {missingEvidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No required evidence is presently marked missing.</p>
                )}
              </article>

              <article>
                <span>Unresolved verification</span>
                {unresolvedVerification.length ? (
                  <ul>
                    {unresolvedVerification.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>All required evidence is presently marked verified.</p>
                )}
              </article>
            </div>
          </section>

          <section className="decision-section">
            <div className="section-title">
              <div>
                <span className="section-index">02</span>
                <h4>Review and governed outcome</h4>
              </div>
              <p>
                Review status and outcome status remain independent from evidence
                declaration. Neither should be silently inferred from the other.
              </p>
            </div>

            <div className="decision-grid">
              <label>
                <span>Review status</span>
                <select
                  value={localReviewStatus}
                  onChange={(event) =>
                    updateReviewStatus(event.target.value as EvidenceStatus)
                  }
                >
                  {statusLabels.map((statusValue) => (
                    <option key={statusValue}>{statusValue}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Governed outcome</span>
                <select
                  value={localOutcome}
                  onChange={(event) =>
                    updateOutcome(event.target.value as EvidenceStatus)
                  }
                >
                  {statusLabels.map((statusValue) => (
                    <option key={statusValue}>{statusValue}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="outcome-record">
              <span>Current bounded state</span>
              <strong>{status}</strong>
              <p>
                This state reflects browser-side declarations only. It is not a
                legal conclusion, certification, conformity decision, or
                authorisation to execute.
              </p>
            </div>
          </section>

          {failureStates.length ? (
            <section className="failure-section">
              <div className="section-title">
                <div>
                  <span className="section-index">03</span>
                  <h4>Failure states and recovery routes</h4>
                </div>
                <p>
                  Select a failure state to expose why it matters, which evidence
                  is required, and what recovery route should be followed.
                </p>
              </div>

              <div className="failure-grid">
                <div className="failure-list">
                  {failureStates.map((failure) => (
                    <button
                      type="button"
                      key={failure.id}
                      className={
                        activeFailureState === failure.id
                          ? 'failure-button active'
                          : 'failure-button'
                      }
                      onClick={() =>
                        setActiveFailureState((current) =>
                          current === failure.id ? null : failure.id,
                        )
                      }
                    >
                      <span>{failure.id}</span>
                      <strong>{failure.title}</strong>
                    </button>
                  ))}
                </div>

                <div className="failure-detail">
                  {activeFailureState ? (
                    failureStates
                      .filter((failure) => failure.id === activeFailureState)
                      .map((failure) => (
                        <div key={failure.id}>
                          <span className="detail-label">Why it matters</span>
                          <p>{failure.consequence}</p>

                          {failure.requiredEvidence?.length ? (
                            <>
                              <span className="detail-label">
                                Required evidence
                              </span>
                              <ul>
                                {failure.requiredEvidence.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </>
                          ) : null}

                          {failure.recoveryRoute?.length ? (
                            <>
                              <span className="detail-label">
                                Recovery route
                              </span>
                              <ol className="recovery-route">
                                {failure.recoveryRoute.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ol>
                            </>
                          ) : null}
                        </div>
                      ))
                  ) : (
                    <div className="empty-detail">
                      <span>SELECT A FAILURE STATE</span>
                      <p>
                        No failure state is currently expanded. Failure-state
                        selection does not itself change the governed outcome.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ) : null}

          <section className="records-section">
            <div className="section-title">
              <div>
                <span className="section-index">
                  {failureStates.length ? '04' : '03'}
                </span>
                <h4>Outputs, records, and verification</h4>
              </div>
              <p>
                Outputs should remain bound to identifiable records and
                verification evidence rather than existing as unsupported status
                labels.
              </p>
            </div>

            {governedOutputs.length ? (
              <div className="output-grid">
                {governedOutputs.map((output) => (
                  <div key={output}>
                    <span>GOVERNED OUTPUT</span>
                    <strong>{output}</strong>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="link-grid">
              <article>
                <span>Governed record</span>
                <strong>{governedRecordLabel}</strong>
                {governedRecordHref ? (
                  <Link href={governedRecordHref}>Open governed record →</Link>
                ) : (
                  <small>No record link has been supplied.</small>
                )}
              </article>

              <article>
                <span>Verification</span>
                <strong>{verificationLabel}</strong>
                {verificationHref ? (
                  <Link href={verificationHref}>Open verification →</Link>
                ) : (
                  <small>No verification link has been supplied.</small>
                )}
              </article>
            </div>
          </section>
        </div>
      ) : null}

      <style jsx>{`
        .evidence-panel {
          overflow: hidden;
          border: 1px solid rgba(103, 194, 220, 0.18);
          border-radius: 26px;
          color: #edf8fc;
          background:
            linear-gradient(
              145deg,
              rgba(14, 38, 55, 0.96),
              rgba(7, 23, 36, 0.94)
            );
          box-shadow: 0 24px 62px rgba(0, 0, 0, 0.18);
        }

        .evidence-panel.compact .panel-header {
          padding: 20px;
        }

        .panel-header {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(260px, 0.75fr);
          gap: 28px;
          padding: 27px;
        }

        .topline,
        .title-row,
        .progress-label,
        .evidence-item-topline {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .panel-id,
        .section-index,
        .evidence-item-topline > div > span,
        .output-grid span,
        .link-grid article > span,
        .detail-label {
          color: #70d8ef;
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .status-badge,
        .item-state {
          flex: 0 0 auto;
          border-radius: 999px;
          padding: 7px 9px;
          font-size: 0.62rem;
          font-weight: 950;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .status-badge.not-started,
        .item-state.missing {
          color: #b4c4ca;
          background: rgba(113, 135, 145, 0.11);
        }

        .status-badge.declared,
        .item-state.declared {
          color: #a7dcff;
          background: rgba(52, 129, 178, 0.12);
        }

        .status-badge.in-review {
          color: #ffe09a;
          background: rgba(184, 131, 27, 0.12);
        }

        .status-badge.verified,
        .item-state.verified {
          color: #8cebc3;
          background: rgba(45, 163, 113, 0.12);
        }

        .status-badge.hold {
          color: #ffe09a;
          background: rgba(184, 131, 27, 0.12);
        }

        .status-badge.deny {
          color: #ffaaaa;
          background: rgba(184, 58, 58, 0.13);
        }

        .status-badge.escalate {
          color: #d3b3ff;
          background: rgba(111, 69, 173, 0.13);
        }

        .title-row {
          margin-top: 18px;
        }

        h3,
        h4,
        h5,
        p {
          margin-top: 0;
        }

        h3 {
          margin-bottom: 9px;
          font-size: clamp(1.65rem, 3vw, 2.55rem);
          line-height: 1.08;
          letter-spacing: -0.035em;
        }

        .requirement-reference {
          display: inline-flex;
          color: #e0c46f;
          font-size: 0.8rem;
          font-weight: 850;
          text-decoration: none;
        }

        .summary {
          max-width: 820px;
          margin: 18px 0 0;
          color: #a9bec8;
          line-height: 1.68;
        }

        .expand-button {
          flex: 0 0 auto;
          border: 1px solid rgba(128, 207, 228, 0.22);
          border-radius: 999px;
          padding: 9px 13px;
          color: #aee8f5;
          background: rgba(255, 255, 255, 0.025);
          cursor: pointer;
        }

        .progress-block {
          display: grid;
          gap: 12px;
        }

        .progress-card {
          padding: 17px;
          border: 1px solid rgba(111, 196, 220, 0.14);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.025);
        }

        .progress-label span {
          color: #7899a7;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .progress-label strong {
          color: #f5fbff;
        }

        .progress-track {
          height: 8px;
          overflow: hidden;
          margin-top: 13px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.07);
        }

        .progress-track > span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #5ecde7, #9cecff);
          transition: width 180ms ease;
        }

        .progress-track.verification > span {
          background: linear-gradient(90deg, #53d39a, #a0efc9);
        }

        .role-row {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 15px;
          align-items: center;
          padding: 16px 27px;
          border-top: 1px solid rgba(104, 191, 216, 0.1);
          border-bottom: 1px solid rgba(104, 191, 216, 0.1);
          background: rgba(255, 255, 255, 0.018);
        }

        .role-row > span {
          color: #7899a7;
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .role-row > div {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .role-chip {
          border: 1px solid rgba(102, 204, 229, 0.18);
          border-radius: 999px;
          padding: 7px 10px;
          color: #b7e7f1;
          background: rgba(60, 171, 199, 0.06);
          font-size: 0.72rem;
          font-weight: 850;
        }

        .panel-content {
          display: grid;
          gap: 0;
        }

        .panel-content > section {
          padding: 28px;
          border-top: 1px solid rgba(104, 191, 216, 0.11);
        }

        .section-title {
          display: grid;
          grid-template-columns: minmax(220px, 0.7fr) minmax(0, 1.3fr);
          gap: 28px;
          align-items: start;
          margin-bottom: 22px;
        }

        .section-title > div {
          display: flex;
          gap: 12px;
          align-items: baseline;
        }

        .section-title h4 {
          margin-bottom: 0;
          font-size: 1.28rem;
        }

        .section-title p {
          margin-bottom: 0;
          color: #91aab5;
          line-height: 1.62;
        }

        .evidence-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .evidence-item {
          display: flex;
          min-height: 310px;
          flex-direction: column;
          padding: 18px;
          border: 1px solid rgba(105, 191, 215, 0.13);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.022);
        }

        .evidence-item-topline > div {
          display: grid;
          gap: 4px;
        }

        .evidence-item-topline small {
          color: #627f8c;
        }

        h5 {
          margin: 26px 0 9px;
          font-size: 1.08rem;
        }

        .evidence-item > p {
          color: #93abb6;
          line-height: 1.58;
        }

        .metadata-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 7px;
          margin: 14px 0 0;
        }

        .metadata-grid > div {
          padding: 9px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.025);
        }

        .metadata-grid dt {
          color: #678897;
          font-size: 0.61rem;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .metadata-grid dd {
          margin: 5px 0 0;
          overflow-wrap: anywhere;
          color: #b8cbd3;
          font-size: 0.76rem;
        }

        .evidence-controls {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-top: auto;
          padding-top: 18px;
        }

        .control {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 9px;
          align-items: center;
          padding: 11px;
          border: 1px solid rgba(105, 190, 214, 0.13);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.018);
          cursor: pointer;
        }

        .control.active {
          border-color: rgba(83, 204, 226, 0.35);
          background: rgba(50, 157, 183, 0.07);
        }

        .control.verified-control.active {
          border-color: rgba(72, 207, 148, 0.35);
          background: rgba(43, 156, 105, 0.07);
        }

        .control input {
          width: 17px;
          height: 17px;
          accent-color: #67d8ed;
        }

        .control input:disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }

        .control > span {
          display: grid;
          gap: 2px;
        }

        .control strong {
          font-size: 0.78rem;
        }

        .control small {
          color: #688794;
          font-size: 0.67rem;
        }

        .gap-grid,
        .decision-grid,
        .link-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 14px;
        }

        .gap-grid article,
        .link-grid article {
          padding: 17px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.022);
        }

        .gap-grid article > span {
          color: #e0c46f;
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .gap-grid ul,
        .failure-detail ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #9eb4be;
          line-height: 1.58;
        }

        .gap-grid p {
          margin: 10px 0 0;
          color: #8fa7b1;
        }

        .decision-grid label {
          display: grid;
          gap: 8px;
        }

        .decision-grid label > span {
          color: #7899a7;
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        select {
          width: 100%;
          min-height: 46px;
          border: 1px solid rgba(130, 207, 227, 0.22);
          border-radius: 13px;
          padding: 11px 13px;
          color: #f5fbff;
          background: rgba(4, 16, 27, 0.82);
          outline: none;
        }

        select:focus {
          border-color: #70d8ef;
          box-shadow: 0 0 0 3px rgba(76, 198, 227, 0.13);
        }

        select option {
          color: #eaf7fb;
          background: #091b2a;
        }

        .outcome-record {
          margin-top: 14px;
          padding: 17px;
          border-left: 3px solid #67d8ed;
          border-radius: 0 14px 14px 0;
          background: rgba(55, 169, 196, 0.06);
        }

        .outcome-record > span {
          color: #789eaa;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .outcome-record strong {
          display: block;
          margin: 7px 0;
          font-size: 1.12rem;
        }

        .outcome-record p {
          margin: 0;
          color: #8fa7b1;
          line-height: 1.56;
        }

        .failure-grid {
          display: grid;
          grid-template-columns: minmax(250px, 0.68fr) minmax(0, 1.32fr);
          gap: 12px;
        }

        .failure-list {
          display: grid;
          gap: 8px;
        }

        .failure-button {
          display: grid;
          gap: 7px;
          width: 100%;
          border: 1px solid rgba(104, 190, 214, 0.14);
          border-radius: 13px;
          padding: 14px;
          color: #edf8fc;
          background: rgba(255, 255, 255, 0.02);
          text-align: left;
          cursor: pointer;
        }

        .failure-button.active {
          border-color: rgba(225, 184, 77, 0.46);
          background: rgba(193, 132, 18, 0.07);
        }

        .failure-button > span {
          color: #d9b75f;
          font-size: 0.62rem;
          font-weight: 950;
        }

        .failure-detail {
          min-height: 280px;
          padding: 20px;
          border: 1px solid rgba(104, 190, 214, 0.14);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.022);
        }

        .failure-detail p {
          color: #a0b6c0;
          line-height: 1.64;
        }

        .recovery-route {
          display: grid;
          gap: 7px;
          margin: 10px 0 0;
          padding-left: 20px;
          color: #a9c2cc;
          line-height: 1.55;
        }

        .empty-detail {
          display: grid;
          min-height: 230px;
          place-content: center;
          text-align: center;
        }

        .empty-detail span {
          color: #718f9c;
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.09em;
        }

        .empty-detail p {
          max-width: 440px;
          margin: 10px auto 0;
          color: #708b97;
        }

        .output-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
        }

        .output-grid > div {
          min-height: 110px;
          padding: 15px;
          border: 1px solid rgba(105, 190, 214, 0.13);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.022);
        }

        .output-grid strong {
          display: block;
          margin-top: 22px;
          line-height: 1.35;
        }

        .link-grid article {
          display: grid;
          gap: 7px;
        }

        .link-grid strong {
          line-height: 1.38;
        }

        .link-grid a {
          margin-top: 8px;
          color: #98e8f8;
          font-size: 0.78rem;
          font-weight: 900;
          text-decoration: none;
        }

        .link-grid small {
          margin-top: 8px;
          color: #6d8a97;
        }

        @media (max-width: 900px) {
          .panel-header,
          .section-title,
          .failure-grid {
            grid-template-columns: 1fr;
          }

          .progress-block {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .evidence-grid {
            grid-template-columns: 1fr;
          }

          .output-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .panel-header,
          .panel-content > section {
            padding: 20px;
          }

          .role-row {
            grid-template-columns: 1fr;
            padding: 14px 20px;
          }

          .title-row {
            flex-direction: column;
          }

          .progress-block,
          .evidence-controls,
          .gap-grid,
          .decision-grid,
          .link-grid,
          .output-grid,
          .metadata-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .progress-track > span {
            transition: none;
          }
        }
      `}</style>
    </article>
  );
}
