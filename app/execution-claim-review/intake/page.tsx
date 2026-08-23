'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ClaimReviewIntakePage() {
  const params = useSearchParams();
  const [status,setStatus] = useState<'idle'|'sending'|'done'|'error'>('idle');
  const [message,setMessage] = useState('');
  const [service,setService] = useState('EXECUTION_CLAIM_REVIEW');
  useEffect(()=>{ if(params.get('snapshot')==='1') setService('EXECUTION_EVIDENCE_SNAPSHOT'); },[params]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus('sending'); setMessage('');
    const form = new FormData(e.currentTarget); const value=(k:string)=>String(form.get(k)??'');
    const payload = { serviceType:service, organizationName:value('organizationName'), contactName:value('contactName'), contactEmail:value('contactEmail'), systemName:value('systemName'), systemPublicUrl:value('systemPublicUrl'), consequentialClaim:value('consequentialClaim'), executionConsequence:value('executionConsequence'), evidenceSummary:value('evidenceSummary'), authorityBoundary:value('authorityBoundary'), changedConditions:value('changedConditions'), knownGaps:value('knownGaps'), requestedExamination:value('requestedExamination'), additionalContext:value('additionalContext'), urgency:value('urgency'), website:value('website'), limitationAcknowledged:form.get('limitationAcknowledged')==='on', accuracyAcknowledged:form.get('accuracyAcknowledged')==='on', sourcePage:window.location.pathname+window.location.search, referrer:document.referrer, utmSource:params.get('utm_source')??'', utmMedium:params.get('utm_medium')??'', utmCampaign:params.get('utm_campaign')??'' };
    try { const res=await fetch('/api/execution-claim-review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); const data=await res.json(); if(!res.ok) throw new Error(data.error||'Submission failed.'); setStatus('done'); setMessage(`Preserved. Intake ID: ${data.intakeId}`); e.currentTarget.reset(); }
    catch(err){ setStatus('error'); setMessage(err instanceof Error?err.message:'Unable to submit.'); }
  }

  const input='mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100';
  return <main className="min-h-screen bg-slate-950 text-slate-100"><section className="mx-auto max-w-3xl px-6 py-20">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">TA-14 Commercial Intake</p><h1 className="mt-4 text-4xl font-bold">Bring us one consequential claim.</h1>
    <p className="mt-5 leading-7 text-slate-300">Submit the bounded question first. Payment is not collected here. TA-14 reviews the object and confirms scope before custom examination begins.</p>
    <form onSubmit={submit} className="mt-10 space-y-6 rounded-xl border border-slate-800 bg-slate-900 p-7">
      <label className="block">Requested scope<select value={service} onChange={e=>setService(e.target.value)} className={input}><option value="EXECUTION_EVIDENCE_SNAPSHOT">$249 Execution Evidence Snapshot</option><option value="EXECUTION_CLAIM_REVIEW">$750+ Execution Claim Review</option></select></label>
      <label className="block">Organization<input required name="organizationName" className={input}/></label>
      <label className="block">Your name<input required name="contactName" className={input}/></label>
      <label className="block">Email<input required type="email" name="contactEmail" className={input}/></label>
      <label className="block">System / architecture / process<input required name="systemName" className={input}/></label>
      <label className="block">Public URL, if any<input name="systemPublicUrl" className={input}/></label>
      <label className="block">Exact consequential claim or evidence question<textarea required name="consequentialClaim" rows={4} className={input}/></label>
      <label className="block">Why does this matter at execution?<textarea required name="executionConsequence" rows={4} className={input}/></label>
      <label className="block">Evidence currently available<textarea required name="evidenceSummary" rows={4} className={input}/></label>
      <label className="block">Authority / execution boundary<textarea name="authorityBoundary" rows={3} className={input}/></label>
      <label className="block">Known changed conditions or failure cases<textarea name="changedConditions" rows={3} className={input}/></label>
      <label className="block">Known gaps or unresolved issues<textarea name="knownGaps" rows={3} className={input}/></label>
      <label className="block">What do you want TA-14 to examine?<textarea required name="requestedExamination" rows={4} className={input}/></label>
      <label className="block">Additional context<textarea name="additionalContext" rows={3} className={input}/></label>
      <label className="block">Urgency<select name="urgency" className={input}><option>STANDARD</option><option>PRIORITY</option><option>CRITICAL</option></select></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true"/>
      <label className="flex gap-3 text-sm text-slate-300"><input required type="checkbox" name="limitationAcknowledged"/>I understand submission creates an intake record only and is not certification, endorsement, acceptance of scope, payment, or a favorable finding.</label>
      <label className="flex gap-3 text-sm text-slate-300"><input required type="checkbox" name="accuracyAcknowledged"/>I confirm the information supplied is accurate to the best of my knowledge and may be preserved as part of the intake record.</label>
      <button disabled={status==='sending'} className="rounded-md bg-amber-400 px-7 py-3 font-semibold text-slate-950 disabled:opacity-50">{status==='sending'?'Preserving request…':'Submit governed intake'}</button>
      {message && <div className={`rounded-md p-4 text-sm ${status==='done'?'bg-emerald-950 text-emerald-200':'bg-red-950 text-red-200'}`}>{message}</div>}
    </form>
    <div className="mt-8 rounded-lg border border-amber-400/30 bg-amber-400/5 p-5 text-sm leading-6 text-slate-300">Governance boundary: TA-14 confirms scope and commercial terms separately. The intake record does not establish technical standing beyond the information submitted.</div>
  </section></main>;
}
