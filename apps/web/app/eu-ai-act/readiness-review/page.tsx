"use client";

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

type SubmitState = 'IDLE' | 'SUBMITTING' | 'PAYMENT' | 'SUCCESS' | 'ERROR';

type ApiSuccess = {
  ok: true;
  intakeId: string;
  status: string;
  submittedAt: string;
  boundary: string;
};

type ApiError = {
  error?: string;
  missing?: string[];
};

const boundaryText =
  'This request creates a governed intake record only. It is not legal advice, certification, conformity assessment, CE marking, regulatory approval, or a favorable finding.';

export default function EUAIActReadinessReviewPage() {
  const [submitState, setSubmitState] = useState<SubmitState>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [intake, setIntake] = useState<ApiSuccess | null>(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  const paypalButtonsRef = useRef<HTMLDivElement | null>(null);
  const [form, setForm] = useState({
    organizationName: '',
    contactName: '',
    contactEmail: '',
    systemName: '',
    systemPublicUrl: '',
    declaredRole: '',
    intendedPurpose: '',
    euExposure: '',
    currentClassification: '',
    possibleRiskPath: '',
    requestedOutcome: '',
    evidenceSummary: '',
    evidenceLinks: '',
    knownGaps: '',
    materialChanges: '',
    additionalContext: '',
    urgency: 'STANDARD',
    limitationAcknowledged: false,
    accuracyAcknowledged: false,
    website: '',
  });

  const requiredReady = useMemo(
    () =>
      Boolean(
        form.organizationName.trim() &&
          form.contactName.trim() &&
          form.contactEmail.trim() &&
          form.systemName.trim() &&
          form.intendedPurpose.trim() &&
          form.euExposure.trim() &&
          form.requestedOutcome.trim() &&
          form.evidenceSummary.trim() &&
          form.limitationAcknowledged &&
          form.accuracyAcknowledged,
      ),
    [form],
  );

  function setField(name: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!requiredReady || submitState === 'SUBMITTING') return;

    setSubmitState('SUBMITTING');
    setErrorMessage('');

    const params = new URLSearchParams(window.location.search);

    try {
      const response = await fetch('/api/eu-ai-act/readiness-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sourcePage: window.location.pathname,
          referrer: document.referrer || '',
          utmSource: params.get('utm_source') || '',
          utmMedium: params.get('utm_medium') || '',
          utmCampaign: params.get('utm_campaign') || '',
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as
        | ApiSuccess
        | ApiError;

      if (!response.ok || !('ok' in payload) || payload.ok !== true) {
        const errorPayload = payload as ApiError;
        throw new Error(
          errorPayload.error || 'Unable to preserve the review request.',
        );
      }

      setIntake(payload);
      setSubmitState('PAYMENT');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to preserve the review request.',
      );
      setSubmitState('ERROR');
    }
  }


  useEffect(() => {
    if (submitState !== 'PAYMENT' || !intake || !paypalButtonsRef.current) return;
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) { setPaymentMessage('PayPal checkout is not configured for this deployment.'); return; }
    let cancelled = false;
    const renderButtons = () => {
      if (cancelled || !window.paypal || !paypalButtonsRef.current) return;
      paypalButtonsRef.current.innerHTML = '';
      const buttons = window.paypal.Buttons({
        style: { layout: 'vertical', shape: 'rect', label: 'paypal', height: 48 },
        createOrder: async () => {
          setPaymentMessage('Creating secure $750 payment…');
          const response = await fetch('/api/paypal/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: 'eu-ai-act-readiness-review', customerReference: intake.intakeId }) });
          const payload = await response.json();
          if (!response.ok || typeof payload.orderId !== 'string') throw new Error(payload.message || 'Unable to create the PayPal order.');
          return payload.orderId;
        },
        onApprove: async (data: { orderID?: string }) => {
          if (!data.orderID) throw new Error('PayPal did not return an order ID.');
          setPaymentMessage('Confirming payment…');
          const response = await fetch('/api/paypal/capture-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: data.orderID }) });
          const payload = await response.json();
          if (!response.ok || payload.captureStatus !== 'COMPLETED' || payload.referenceId !== 'eu-ai-act-readiness-review' || payload.amount !== '750.00' || payload.currency !== 'USD') throw new Error(payload.message || 'The $750 payment could not be confirmed.');
          setPaymentMessage('Payment completed. Your governed readiness review is now paid.');
          setSubmitState('SUCCESS');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onCancel: () => setPaymentMessage('Payment cancelled. Your intake is preserved, but no review work has been purchased.'),
        onError: (error: unknown) => setPaymentMessage(error instanceof Error ? error.message : 'PayPal checkout encountered an error.'),
      });
      if (!buttons.isEligible || buttons.isEligible()) void buttons.render(paypalButtonsRef.current);
    };
    if (window.paypal) { renderButtons(); return () => { cancelled = true; }; }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture&commit=true&components=buttons`;
    script.async = true; script.onload = renderButtons; script.onerror = () => setPaymentMessage('PayPal could not be loaded. Please refresh and try again.'); document.head.appendChild(script);
    return () => { cancelled = true; };
  }, [submitState, intake]);

  if (submitState === 'PAYMENT' && intake) {
    return (<main className="page"><section className="success"><small>EU AI ACT · GOVERNED READINESS REVIEW</small><h1>INTAKE PRESERVED.</h1><p>Your request is preserved. Complete the $750 payment below to purchase the fixed-scope review and place it into paid intake.</p><div className="id">{intake.intakeId}</div><div className="scope"><b>$750 · ONE AI SYSTEM · FIXED SCOPE</b><p>No review work is represented as purchased or underway until PayPal confirms a completed $750 capture.</p></div><div ref={paypalButtonsRef} className="paypalButtons" />{paymentMessage && <div className="paymentMessage">{paymentMessage}</div>}<div className="boundary">{intake.boundary}</div></section><style>{styles}</style></main>);
  }

  if (submitState === 'SUCCESS' && intake) {
    return (
      <main className="page">
        <section className="success">
          <small>EU AI ACT · GOVERNED READINESS REVIEW</small>
          <h1>PAYMENT CONFIRMED.</h1>
          <p>
            Your $750 payment has been confirmed and the governed readiness review is now in paid intake. Keep the intake identifier below for follow-up.
          </p>
          <div className="id">{intake.intakeId}</div>
          <div className="status">STATUS · {intake.status.toUpperCase()}</div>
          <div className="scope">
            <b>$750 STARTING FIXED SCOPE · ONE AI SYSTEM</b>
            <p>
              Payment purchases the stated fixed-scope review for one AI system. Findings remain bounded by the evidence supplied and the stated governance limitations.
            </p>
          </div>
          <div className="boundary">{intake.boundary}</div>
          <div className="actions">
            <Link href="/eu-ai-act/commercial">RETURN TO EU AI ACT →</Link>
            <Link href="/eu-ai-act/classifier">CLASSIFY ANOTHER SYSTEM →</Link>
          </div>
        </section>
        <style>{styles}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <nav>
        <Link href="/eu-ai-act/commercial">← EU AI ACT</Link>
        <b>TA-14 · GOVERNED READINESS REVIEW</b>
        <Link href="/eu-ai-act/classifier">FREE CLASSIFIER →</Link>
      </nav>

      <header className="hero">
        <small>FIXED-SCOPE HUMAN REVIEW · ONE AI SYSTEM</small>
        <h1>
          EU AI ACT<br />
          <em>GOVERNED READINESS REVIEW</em>
        </h1>
        <p>
          Use this intake when your organization has one real AI system and
          needs a bounded second set of eyes on applicability, evidence state,
          unresolved gaps, and the next defensible actions.
        </p>
        <div className="price">
          <strong>$750</strong>
          <span>starting fixed scope · one AI system</span>
        </div>
        <div className="trust">
          <span>REAL PERSISTED INTAKE</span>
          <span>NO AUTOMATIC FAVORABLE FINDING</span>
          <span>NO LEGAL ADVICE CLAIM</span>
          <span>ONE SYSTEM PER REVIEW</span>
        </div>
      </header>

      <section className="scopeGrid">
        {[
          ['01', 'SYSTEM & ROLE', 'Identify the AI system, intended purpose, organizational role, EU exposure and declared scope.'],
          ['02', 'APPLICABILITY', 'Map relevant or potentially relevant EU AI Act routes without forcing certainty where evidence is incomplete.'],
          ['03', 'EVIDENCE STATE', 'Separate supported positions from stale evidence, gaps, unresolved reliance and review-required conditions.'],
          ['04', 'GOVERNED OUTPUT', 'Return a bounded readiness record with findings, limitations and next evidence actions.'],
        ].map(([n, title, copy]) => (
          <article key={n}>
            <span>{n}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <form className="formWrap" onSubmit={submit}>
        <section className="panel">
          <small>01 · REQUESTER</small>
          <h2>Who is asking for the review?</h2>
          <div className="twoCol">
            <Field label="Organization *">
              <input value={form.organizationName} onChange={(e) => setField('organizationName', e.target.value)} />
            </Field>
            <Field label="Contact name *">
              <input value={form.contactName} onChange={(e) => setField('contactName', e.target.value)} />
            </Field>
          </div>
          <Field label="Contact email *">
            <input type="email" value={form.contactEmail} onChange={(e) => setField('contactEmail', e.target.value)} />
          </Field>
        </section>

        <section className="panel">
          <small>02 · AI SYSTEM</small>
          <h2>What system are we reviewing?</h2>
          <div className="twoCol">
            <Field label="AI system name *">
              <input value={form.systemName} onChange={(e) => setField('systemName', e.target.value)} />
            </Field>
            <Field label="Public product / system URL">
              <input value={form.systemPublicUrl} onChange={(e) => setField('systemPublicUrl', e.target.value)} />
            </Field>
          </div>
          <Field label="Your role in relation to the system">
            <input placeholder="Provider, deployer, importer, distributor, product manufacturer, other" value={form.declaredRole} onChange={(e) => setField('declaredRole', e.target.value)} />
          </Field>
          <Field label="Intended purpose *">
            <textarea placeholder="What does the system do, for whom, and what decisions or outputs can it influence?" value={form.intendedPurpose} onChange={(e) => setField('intendedPurpose', e.target.value)} />
          </Field>
          <Field label="EU exposure *">
            <textarea placeholder="Where is the system offered, deployed, used, sold or producing effects in the EU?" value={form.euExposure} onChange={(e) => setField('euExposure', e.target.value)} />
          </Field>
        </section>

        <section className="panel">
          <small>03 · CURRENT POSITION</small>
          <h2>What do you currently believe applies?</h2>
          <Field label="Current classification or working position">
            <textarea placeholder="For example: prohibited-practice screen complete; possible Annex III employment high-risk; Article 50 transparency likely; not yet classified." value={form.currentClassification} onChange={(e) => setField('currentClassification', e.target.value)} />
          </Field>
          <Field label="Possible risk / obligation path">
            <textarea placeholder="Articles, Annex III category, GPAI, transparency, FRIA, importer duties, or other routes you believe may matter." value={form.possibleRiskPath} onChange={(e) => setField('possibleRiskPath', e.target.value)} />
          </Field>
        </section>

        <section className="panel">
          <small>04 · EVIDENCE & GAPS</small>
          <h2>What can you prove today?</h2>
          <Field label="Evidence summary *">
            <textarea placeholder="Describe the documents, logs, policies, test results, notices, system instructions, contracts, assessments or other evidence already available." value={form.evidenceSummary} onChange={(e) => setField('evidenceSummary', e.target.value)} />
          </Field>
          <Field label="Evidence links">
            <textarea placeholder="Public or shareable links, one per line if useful." value={form.evidenceLinks} onChange={(e) => setField('evidenceLinks', e.target.value)} />
          </Field>
          <Field label="Known gaps or unresolved questions">
            <textarea placeholder="What do you already know is incomplete, uncertain, stale or disputed?" value={form.knownGaps} onChange={(e) => setField('knownGaps', e.target.value)} />
          </Field>
          <Field label="Material changes">
            <textarea placeholder="Recent model, vendor, intended-purpose, data, workflow, authority or deployment changes." value={form.materialChanges} onChange={(e) => setField('materialChanges', e.target.value)} />
          </Field>
        </section>

        <section className="panel">
          <small>05 · REQUESTED OUTCOME</small>
          <h2>What do you need from this review?</h2>
          <Field label="Requested outcome *">
            <textarea placeholder="What decision, readiness question or evidence problem do you need the review to resolve or narrow?" value={form.requestedOutcome} onChange={(e) => setField('requestedOutcome', e.target.value)} />
          </Field>
          <div className="twoCol">
            <Field label="Urgency">
              <select value={form.urgency} onChange={(e) => setField('urgency', e.target.value)}>
                <option value="STANDARD">Standard</option>
                <option value="PRIORITY">Priority</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </Field>
            <Field label="Additional context">
              <textarea className="short" value={form.additionalContext} onChange={(e) => setField('additionalContext', e.target.value)} />
            </Field>
          </div>
        </section>

        <section className="panel acknowledgements">
          <small>06 · GOVERNANCE BOUNDARY</small>
          <h2>Confirm the intake boundary.</h2>
          <label className="check">
            <input type="checkbox" checked={form.limitationAcknowledged} onChange={(e) => setField('limitationAcknowledged', e.target.checked)} />
            <span>{boundaryText}</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={form.accuracyAcknowledged} onChange={(e) => setField('accuracyAcknowledged', e.target.checked)} />
            <span>I confirm that the information submitted is accurate to the best of my knowledge and that unresolved facts have not been intentionally presented as established.</span>
          </label>

          <div className="honeypot" aria-hidden="true">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setField('website', e.target.value)} />
            </label>
          </div>

          {submitState === 'ERROR' && <div className="error">{errorMessage}</div>}

          <button type="submit" disabled={!requiredReady || submitState === 'SUBMITTING'}>
            {submitState === 'SUBMITTING' ? 'PRESERVING REQUEST…' : 'CONTINUE TO $750 PAYMENT →'}
          </button>
          <p className="submitNote">
            Your intake is preserved first. You will then be taken directly to secure PayPal checkout. The review is not purchased or underway until a completed $750 payment is confirmed.
          </p>
        </section>
      </form>

      <style>{styles}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

const styles = `
*{box-sizing:border-box}.page{min-height:100vh;background:radial-gradient(circle at 50% 0,#0b315d 0,#030711 36%,#010205 100%);color:#edf6ff;padding-bottom:100px;font-family:Inter,system-ui,sans-serif}nav{height:72px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #183e5c;background:rgba(2,7,14,.92);position:sticky;top:0;z-index:20;backdrop-filter:blur(16px)}nav a{color:#77e4ff;text-decoration:none;font-size:10px;font-weight:900;letter-spacing:.08em}nav b{font-size:9px;letter-spacing:.15em;color:#8198ac}.hero{max-width:1180px;margin:auto;text-align:center;padding:90px 24px 52px}.hero>small,.panel>small,.success>small{color:#6fe0fb;font-size:10px;font-weight:950;letter-spacing:.2em}.hero h1,.success h1{font:clamp(48px,7vw,90px)/.92 Georgia,serif;margin:20px 0}.hero h1 em{font-style:normal;color:#80e8ff}.hero>p,.success>p{max-width:850px;margin:auto;color:#adc0d0;font-size:18px;line-height:1.7}.price{margin:30px auto 0;display:flex;align-items:baseline;justify-content:center;gap:12px}.price strong{font:52px Georgia,serif;color:#ffe49b}.price span{color:#a5b7c5;font-size:12px}.trust{margin:26px auto 0;display:flex;justify-content:center;gap:8px;flex-wrap:wrap}.trust span{border:1px solid #1c4563;padding:8px 10px;background:#07131f;color:#87a4b8;font-size:8px;font-weight:900}.scopeGrid{max-width:1350px;margin:0 auto 48px;padding:0 5vw;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.scopeGrid article{border:1px solid #1e4765;background:#071521;padding:24px;min-height:210px}.scopeGrid span{font:28px Georgia,serif;color:#6cdff8}.scopeGrid h2{font-size:13px;letter-spacing:.05em}.scopeGrid p{font-size:12px;color:#94aabd;line-height:1.7}.formWrap{max-width:1100px;margin:auto;padding:0 24px;display:grid;gap:16px}.panel{border:1px solid #1c405b;background:rgba(6,15,25,.88);padding:28px;border-radius:18px}.panel h2{font:32px/1.05 Georgia,serif;margin:8px 0 22px}.field{display:block;margin-top:16px}.field>span{display:block;margin-bottom:8px;color:#bad0df;font-size:11px;font-weight:850}.twoCol{display:grid;grid-template-columns:1fr 1fr;gap:14px}input,textarea,select{width:100%;border:1px solid #284e69;border-radius:11px;background:#030b13;color:#edf6ff;font:inherit;outline:none}input,select{min-height:48px;padding:0 13px}textarea{min-height:125px;padding:13px;resize:vertical;line-height:1.55}.short{min-height:92px}input:focus,textarea:focus,select:focus{border-color:#65ddfa;box-shadow:0 0 0 3px rgba(101,221,250,.08)}.acknowledgements{border-color:#675a2d}.check{display:flex;gap:12px;align-items:flex-start;margin:15px 0;color:#b5c6d3;line-height:1.6;font-size:13px}.check input{width:18px;min-height:18px;height:18px;margin-top:3px;flex:0 0 auto}.honeypot{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}button{margin-top:18px;width:100%;min-height:54px;border:0;border-radius:12px;background:linear-gradient(135deg,#e5bb60,#ffe6a5);color:#161005;font-weight:950;letter-spacing:.05em;cursor:pointer}button:disabled{opacity:.42;cursor:not-allowed}.submitNote{color:#7f97aa;font-size:11px;line-height:1.6;text-align:center}.paypalButtons{max-width:520px;margin:28px auto 0;min-height:55px}.paymentMessage{margin:14px auto 0;max-width:520px;padding:13px;border:1px solid #32647f;background:#071622;color:#b9d9e9;border-radius:10px;line-height:1.5}.error{margin-top:18px;padding:13px;border:1px solid #723a3a;background:#251012;color:#ffb1b1;border-radius:10px}.success{max-width:900px;margin:0 auto;padding:130px 24px;text-align:center}.id{margin:34px auto 8px;padding:18px;border:1px solid #3d6f8f;background:#071622;border-radius:14px;font:24px ui-monospace,SFMono-Regular,Menlo,monospace;color:#80e8ff;word-break:break-all}.status{font-size:10px;letter-spacing:.16em;color:#90a7b7}.scope{margin:34px auto 0;padding:24px;border:1px solid #6b592c;background:#161205;border-radius:14px}.scope b{color:#ffe09b}.scope p{color:#b8c5cf;line-height:1.6}.boundary{margin:18px auto 0;padding:18px;border:1px solid #29475b;background:#07111b;color:#91a8ba;line-height:1.6;border-radius:12px}.actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:28px}.actions a{padding:13px 16px;border:1px solid #32647f;border-radius:9px;color:#8ce9ff;text-decoration:none;font-size:9px;font-weight:900}@media(max-width:850px){nav b{display:none}.scopeGrid{grid-template-columns:1fr 1fr}.twoCol{grid-template-columns:1fr}}@media(max-width:560px){.scopeGrid{grid-template-columns:1fr}.hero{padding-top:62px}.panel{padding:21px}.price{flex-direction:column;align-items:center;gap:2px}}
`;
