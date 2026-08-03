'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Decision = 'return_for_correction' | 'hold' | 'escalate' | 'accept_for_registration';

type Props = {
  submissionId: string;
  status: string;
  currentDecision?: string | null;
  currentRationale?: string | null;
};

const options: Array<{ value: Decision; label: string; detail: string }> = [
  { value: 'accept_for_registration', label: 'Accept for Registration', detail: 'The record is sufficiently attributable, bounded, and preserved to proceed to finalization.' },
  { value: 'return_for_correction', label: 'Return for Correction', detail: 'The registrant must correct or complete the record before resubmission.' },
  { value: 'hold', label: 'Place on Hold', detail: 'Pause review pending information, authority, evidence, or institutional capacity.' },
  { value: 'escalate', label: 'Escalate', detail: 'Refer the record for additional institutional or specialist review.' },
];

export default function ReviewDecisionPanel({ submissionId, status, currentDecision, currentRationale }: Props) {
  const router = useRouter();
  const [decision, setDecision] = useState<Decision>('accept_for_registration');
  const [rationale, setRationale] = useState(currentRationale ?? '');
  const [notes, setNotes] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mayReview = ['submitted', 'under_review', 'hold', 'escalated'].includes(status.toLowerCase());
  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return url && anonKey ? createBrowserClient(url, anonKey) : null;
  }, []);

  async function submitDecision() {
    if (!mayReview || !confirmation || rationale.trim().length < 20 || submitting) return;
    setSubmitting(true); setError(''); setSuccess('');
    try {
      if (!supabase) throw new Error('Supabase environment variables are not configured.');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.access_token) throw new Error('Your reviewer session is missing or expired.');

      const response = await fetch('/api/registry/reviewer/decision', {
        method: 'POST',
        cache: 'no-store',
        headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ submissionId, decision, rationale: rationale.trim(), notes: notes.trim() }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'The review decision could not be recorded.');
      setSuccess(payload.message || 'Review decision recorded.');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The review decision could not be recorded.');
    } finally { setSubmitting(false); }
  }

  if (!mayReview) {
    return (
      <section className="decisionPanel decisionClosed">
        <p className="decisionEyebrow">BOUNDED REVIEW DECISION</p>
        <h2>Reviewer decision is preserved.</h2>
        <p>Current decision: <strong>{currentDecision || 'No decision recorded'}</strong>. The current lifecycle state does not permit another ordinary review decision.</p>
        <style jsx>{styles}</style>
      </section>
    );
  }

  return (
    <section className="decisionPanel">
      <div>
        <p className="decisionEyebrow">BOUNDED REVIEW DECISION</p>
        <h2>Record the institutional review outcome.</h2>
        <p className="decisionIntro">Choose one bounded decision and preserve the rationale supporting it. Review is not certification.</p>

        <div className="optionGrid">
          {options.map((option) => (
            <label key={option.value} className={decision === option.value ? 'selected' : ''}>
              <input type="radio" name="decision" value={option.value} checked={decision === option.value} onChange={() => setDecision(option.value)} disabled={submitting} />
              <span><strong>{option.label}</strong><small>{option.detail}</small></span>
            </label>
          ))}
        </div>

        <label className="fieldLabel">
          <span>Reviewer rationale <em>Required</em></span>
          <textarea value={rationale} onChange={(event) => setRationale(event.target.value)} rows={6} disabled={submitting} placeholder="Explain the evidence, boundaries, and institutional basis for this decision." />
          <small>{rationale.trim().length}/20 minimum characters</small>
        </label>

        <label className="fieldLabel">
          <span>Internal reviewer notes <em>Optional · not public</em></span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} disabled={submitting} />
        </label>

        <label className="confirmRow">
          <input type="checkbox" checked={confirmation} onChange={(event) => setConfirmation(event.target.checked)} disabled={submitting} />
          <span>I confirm this is a bounded Registry review decision and not certification, legal approval, safety assurance, or endorsement.</span>
        </label>

        {error ? <div className="message error"><strong>Decision not recorded.</strong><span>{error}</span></div> : null}
        {success ? <div className="message success"><strong>Decision recorded.</strong><span>{success}</span></div> : null}
      </div>

      <button type="button" className="decisionButton" disabled={!confirmation || rationale.trim().length < 20 || submitting} onClick={() => void submitDecision()}>
        {submitting ? 'Recording Decision…' : 'Record Review Decision'}
      </button>
      <style jsx>{styles}</style>
    </section>
  );
}

const styles = `
  .decisionPanel { width:min(1180px,100%); margin:28px auto 18px; padding:28px; display:grid; grid-template-columns:minmax(0,1fr) 260px; gap:26px; border:1px solid rgba(127,228,196,.32); border-radius:22px; background:rgba(11,25,47,.9); box-shadow:0 24px 80px rgba(0,0,0,.26); }
  .decisionClosed { grid-template-columns:1fr; border-color:rgba(164,190,231,.2); }
  .decisionEyebrow { margin:0 0 10px; color:#7fe4c4; font-size:.76rem; font-weight:900; letter-spacing:.18em; }
  h2 { margin:0 0 12px; font-size:clamp(1.7rem,3vw,2.7rem); }
  .decisionIntro, .decisionClosed p { color:#aebdd4; line-height:1.7; }
  .optionGrid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin:20px 0; }
  .optionGrid label { display:grid; grid-template-columns:auto 1fr; gap:11px; padding:14px; border:1px solid rgba(164,190,231,.14); border-radius:13px; background:rgba(7,17,33,.45); cursor:pointer; }
  .optionGrid label.selected { border-color:rgba(255,210,127,.55); background:rgba(96,65,22,.25); }
  .optionGrid input { margin-top:3px; }
  .optionGrid strong, .optionGrid small { display:block; }
  .optionGrid small { margin-top:5px; color:#8fa1ba; line-height:1.45; }
  .fieldLabel { display:grid; gap:8px; margin-top:16px; color:#dce7f5; font-weight:800; }
  .fieldLabel em { color:#ffd27f; font-style:normal; font-size:.75rem; }
  textarea { width:100%; padding:13px; border:1px solid rgba(164,190,231,.2); border-radius:12px; background:rgba(4,12,25,.68); color:#eef4ff; font:inherit; line-height:1.55; resize:vertical; }
  .fieldLabel > small { color:#8394ac; font-weight:400; }
  .confirmRow { margin-top:18px; display:grid; grid-template-columns:auto 1fr; gap:11px; padding:14px; border:1px solid rgba(255,210,127,.18); border-radius:12px; background:rgba(84,56,20,.16); color:#d8e2f0; line-height:1.55; cursor:pointer; }
  .confirmRow input { margin-top:3px; }
  .decisionButton { align-self:center; min-height:54px; padding:13px 18px; border:1px solid rgba(255,226,167,.72); border-radius:13px; background:linear-gradient(135deg,#ffe4a6,#e8a33d); color:#171005; font:inherit; font-weight:900; cursor:pointer; }
  .decisionButton:disabled { opacity:.42; cursor:not-allowed; }
  .message { margin-top:14px; padding:13px; display:grid; gap:4px; border-radius:11px; }
  .message.error { border:1px solid rgba(255,124,145,.34); background:rgba(87,18,35,.26); color:#f4c4cc; }
  .message.success { border:1px solid rgba(127,228,196,.34); background:rgba(20,79,65,.24); color:#c8f6e7; }
  @media(max-width:900px){ .decisionPanel{grid-template-columns:1fr}.optionGrid{grid-template-columns:1fr} }
`;
