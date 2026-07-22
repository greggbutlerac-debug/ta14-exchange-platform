'use client';

import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useMemo, useState } from 'react';

type FinalizationResult = {
  submissionId: string;
  registryIdentifier: string;
  registeredAt: string;
  publicRecordId: string;
  publiclyPublished: boolean;
  message: string;
  boundary: string;
};

type FinalizationError = {
  error?: string;
  message?: string;
  detail?: unknown;
};

type FinalizeRegistrationPanelProps = {
  submissionId: string;
  status: string;
  registryIdentifier?: string | null;
};

function readableStatus(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function FinalizeRegistrationPanel({
  submissionId,
  status,
  registryIdentifier,
}: FinalizeRegistrationPanelProps) {
  const [confirmation, setConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<FinalizationResult | null>(null);
  const [error, setError] = useState('');

  const normalizedStatus = status.trim().toLowerCase();
  const alreadyRegistered =
    normalizedStatus === 'registered' && Boolean(registryIdentifier);
  const mayFinalize = normalizedStatus === 'accepted';

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return null;

    return createBrowserClient(url, anonKey);
  }, []);

  async function finalizeRegistration() {
    if (!confirmation || !mayFinalize || submitting) return;

    setSubmitting(true);
    setError('');

    try {
      if (!supabase) {
        throw new Error('Supabase environment variables are not configured.');
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.access_token) {
        throw new Error('Your reviewer session is missing or expired. Sign in again.');
      }

      const response = await fetch('/api/registry/reviewer/finalize', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ submissionId }),
      });

      const payload = (await response.json()) as FinalizationResult | FinalizationError;

      if (!response.ok) {
        const failure = payload as FinalizationError;
        throw new Error(
          failure.message ||
            'The Registry submission could not be finalized.',
        );
      }

      setResult(payload as FinalizationResult);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'The Registry submission could not be finalized.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <section className="finalizationPanel finalizationSuccess">
        <div>
          <p className="finalizationEyebrow">REGISTRY FINALIZATION COMPLETE</p>
          <h2>{result.registryIdentifier}</h2>
          <p>{result.message}</p>
          <p className="boundaryLine">{result.boundary}</p>
        </div>

        <div className="finalizationActions">
          {result.publiclyPublished ? (
            <Link
              href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
                result.registryIdentifier,
              )}`}
              className="finalizationPrimary"
            >
              Open Permanent Record
            </Link>
          ) : null}

          <Link
            href="/workspace/ai-governance/registry/review"
            className="finalizationSecondary"
          >
            Return to Review Queue
          </Link>
        </div>

        <style jsx>{styles}</style>
      </section>
    );
  }

  if (alreadyRegistered) {
    return (
      <section className="finalizationPanel finalizationSuccess">
        <div>
          <p className="finalizationEyebrow">REGISTRY RECORD FINALIZED</p>
          <h2>{registryIdentifier}</h2>
          <p>
            This submission is already registered. Finalization cannot be
            repeated to create a second Registry identity.
          </p>
          <p className="boundaryLine">Registration is not certification.</p>
        </div>

        <div className="finalizationActions">
          <Link
            href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
              registryIdentifier ?? '',
            )}`}
            className="finalizationPrimary"
          >
            Open Permanent Record
          </Link>
        </div>

        <style jsx>{styles}</style>
      </section>
    );
  }

  if (!mayFinalize) {
    return (
      <section className="finalizationPanel finalizationBlocked">
        <div>
          <p className="finalizationEyebrow">FINALIZATION GATE CLOSED</p>
          <h2>Registration cannot be finalized yet.</h2>
          <p>
            This record is currently <strong>{readableStatus(status)}</strong>.
            Only a reviewer-accepted submission may enter Registry
            finalization.
          </p>
          <p className="boundaryLine">
            Review, acceptance, and finalization remain separate institutional
            acts.
          </p>
        </div>

        <style jsx>{styles}</style>
      </section>
    );
  }

  return (
    <section className="finalizationPanel">
      <div>
        <p className="finalizationEyebrow">CONTROLLED REGISTRY FINALIZATION</p>
        <h2>Assign the permanent Registry identity.</h2>
        <p>
          This action converts the accepted submission into a registered
          record, assigns its permanent <strong>TA-14-AIGR</strong> identifier,
          creates the publication projection permitted by its visibility
          setting, and appends the immutable finalization event.
        </p>

        <label className="confirmationRow">
          <input
            type="checkbox"
            checked={confirmation}
            onChange={(event) => setConfirmation(event.target.checked)}
            disabled={submitting}
          />
          <span>
            I confirm that the accepted decision, attributable rationale,
            declarations, evidence record, visibility request, and Registry
            boundaries have been reviewed. I understand that registration is
            not certification.
          </span>
        </label>

        {error ? (
          <div className="finalizationError" role="alert">
            <strong>Finalization did not complete.</strong>
            <span>{error}</span>
          </div>
        ) : null}
      </div>

      <div className="finalizationActions">
        <button
          type="button"
          className="finalizationPrimary"
          disabled={!confirmation || submitting}
          onClick={() => void finalizeRegistration()}
        >
          {submitting ? 'Finalizing Registration…' : 'Finalize Registration'}
        </button>

        <span className="irreversibilityNotice">
          Permanent identifier assignment is an institutional act. It should
          not be used as a draft-saving or review-decision control.
        </span>
      </div>

      <style jsx>{styles}</style>
    </section>
  );
}

const styles = `
  .finalizationPanel {
    width: min(1180px, 100%);
    margin: 28px auto 0;
    padding: 28px;
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.75fr);
    gap: 28px;
    border: 1px solid rgba(255, 207, 122, 0.34);
    border-radius: 22px;
    background:
      radial-gradient(circle at 100% 0%, rgba(255, 193, 92, 0.12), transparent 38%),
      rgba(11, 25, 47, 0.9);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(18px);
  }

  .finalizationSuccess {
    border-color: rgba(127, 228, 196, 0.42);
    background:
      radial-gradient(circle at 100% 0%, rgba(62, 203, 158, 0.14), transparent 38%),
      rgba(11, 25, 47, 0.9);
  }

  .finalizationBlocked {
    border-color: rgba(164, 190, 231, 0.2);
  }

  .finalizationEyebrow {
    margin: 0 0 10px;
    color: #ffd27f;
    font-size: 0.76rem;
    font-weight: 900;
    letter-spacing: 0.18em;
  }

  .finalizationSuccess .finalizationEyebrow {
    color: #7fe4c4;
  }

  h2 {
    margin: 0 0 14px;
    font-size: clamp(1.75rem, 3.5vw, 3rem);
    letter-spacing: -0.04em;
  }

  p {
    margin: 0;
    color: #b8c6dc;
    line-height: 1.72;
  }

  .boundaryLine {
    margin-top: 15px;
    color: #f7d79e;
    font-weight: 800;
  }

  .confirmationRow {
    margin-top: 22px;
    padding: 17px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 13px;
    align-items: start;
    border: 1px solid rgba(255, 210, 127, 0.2);
    border-radius: 15px;
    background: rgba(7, 17, 33, 0.52);
    color: #d9e3f1;
    line-height: 1.62;
    cursor: pointer;
  }

  .confirmationRow input {
    width: 19px;
    height: 19px;
    margin-top: 2px;
    accent-color: #7fe4c4;
  }

  .finalizationActions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 11px;
  }

  .finalizationPrimary,
  .finalizationSecondary {
    min-height: 50px;
    padding: 12px 17px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 13px;
    font: inherit;
    font-weight: 900;
    text-align: center;
    text-decoration: none;
    transition:
      transform 160ms ease,
      opacity 160ms ease,
      border-color 160ms ease;
  }

  .finalizationPrimary {
    border: 1px solid rgba(255, 226, 167, 0.72);
    background: linear-gradient(135deg, #ffe4a6, #e8a33d);
    color: #171005;
    cursor: pointer;
  }

  .finalizationPrimary:hover:not(:disabled),
  .finalizationSecondary:hover {
    transform: translateY(-2px);
  }

  .finalizationPrimary:disabled {
    opacity: 0.42;
    cursor: not-allowed;
  }

  .finalizationSecondary {
    border: 1px solid rgba(164, 190, 231, 0.3);
    background: rgba(15, 34, 63, 0.74);
    color: #eef4ff;
  }

  .irreversibilityNotice {
    color: #8fa1bb;
    font-size: 0.78rem;
    line-height: 1.55;
    text-align: center;
  }

  .finalizationError {
    margin-top: 16px;
    padding: 14px 16px;
    display: grid;
    gap: 5px;
    border: 1px solid rgba(255, 124, 145, 0.34);
    border-left: 4px solid #ff7c91;
    border-radius: 13px;
    background: rgba(87, 18, 35, 0.26);
  }

  .finalizationError strong {
    color: #ffb1bd;
  }

  .finalizationError span {
    color: #f1c7ce;
    line-height: 1.55;
  }

  @media (max-width: 900px) {
    .finalizationPanel {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 620px) {
    .finalizationPanel {
      padding: 22px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .finalizationPrimary,
    .finalizationSecondary {
      transition: none;
    }
  }
`;
