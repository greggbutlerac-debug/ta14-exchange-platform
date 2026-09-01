"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Draft = {
  entityName: string;
  contactEmail: string;
  capability: string;
  version: string;
  claim: string;
  nonClaims: string;
  scope: string;
  authority: string;
  evidence: string;
  confidentiality: string;
  publication: string;
  attestation: boolean;
};

const STORAGE_KEY = "ta14.entity-review.guided-workspace.v2.local-draft";
const initialDraft: Draft = {
  entityName: "", contactEmail: "", capability: "", version: "", claim: "", nonClaims: "", scope: "", authority: "", evidence: "",
  confidentiality: "Bounded review only", publication: "No publication without separate written permission", attestation: false,
};

export default function EntityReviewPage() {
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setDraft({ ...initialDraft, ...JSON.parse(raw) });
    } catch { /* local draft recovery is non-authoritative */ }
  }, []);

  const checks = useMemo(() => [
    draft.entityName.trim().length > 1,
    /.+@.+\..+/.test(draft.contactEmail),
    draft.capability.trim().length > 3,
    draft.version.trim().length > 0,
    draft.claim.trim().length > 29,
    draft.nonClaims.trim().length > 19,
    draft.scope.trim().length > 34,
    draft.authority.trim().length > 24,
    draft.evidence.trim().length > 39,
    draft.attestation,
  ], [draft]);
  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const ready = score >= 90 && draft.attestation;

  function set<K extends keyof Draft>(key: K, value: Draft[K]) { setDraft(v => ({ ...v, [key]: value })); }
  function saveLocal() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setSavedAt(new Date().toISOString());
  }
  function reset() {
    if (!window.confirm("Reset this local Entity Review draft?")) return;
    window.localStorage.removeItem(STORAGE_KEY); setDraft(initialDraft); setSavedAt(null);
  }

  const field = (label: string, key: keyof Draft, rows = 0) => (
    <label><span>{label}</span>{rows ? <textarea rows={rows} value={String(draft[key])} onChange={e => set(key, e.target.value as never)} /> : <input value={String(draft[key])} onChange={e => set(key, e.target.value as never)} />}</label>
  );

  return <main>
    <header><div><b>TA-14 AUTHORITY GOVERNANCE INSTITUTION</b><small>Entity Review · Preparation Workspace</small></div><nav><Link href="/">Institution Home</Link><Link href="/workspace/ai-governance">AI Governance Exchange</Link></nav></header>

    <section className="hero"><p className="eyebrow">ENTITY REVIEW · GOVERNED INTAKE</p><h1>Build the package locally. <em>Cross the institutional boundary only through authoritative submission.</em></h1><p>This workspace prepares a bounded Entity Review package. Browser storage can preserve a draft, but it cannot submit, register, freeze, publish, or create institutional standing.</p><div className="rule"><strong>NO AUTHORITATIVE RECORD · NO AUTHORITATIVE STATUS</strong><span>A TA-14 submission receipt, Registry identifier, finalization timestamp, or publication state must come from server-side institutional state.</span></div></section>

    <section className="status"><article><span>LOCAL READINESS</span><strong>{score}%</strong><p>{ready ? "READY TO SUBMIT THROUGH AUTHORITATIVE INTAKE" : "DRAFT IN PROGRESS"}</p></article><article><span>CURRENT STANDING</span><strong>LOCAL ONLY</strong><p>Not submitted · Not registered · Not frozen</p></article><article><span>PUBLICATION</span><strong>SEPARATE</strong><p>Registration never implies publication.</p></article></section>

    <section className="workspace"><div className="notice"><b>Institutional boundary</b><p>This page intentionally does not manufacture a “submitted” state or local submission receipt. When an authoritative submission endpoint is connected, the server response—not localStorage—must supply the submission identifier and timestamp.</p></div><div className="grid">
      {field("Entity / architecture name", "entityName")}{field("Responsible contact email", "contactEmail")}{field("Bounded capability", "capability")}{field("Frozen version / release", "version")}{field("Exact bounded claim", "claim", 5)}{field("Explicit non-claims", "nonClaims", 5)}{field("Scope and exclusions", "scope", 5)}{field("Authority basis", "authority", 5)}{field("Evidence summary and continuity", "evidence", 6)}
      <label><span>Confidentiality boundary</span><select value={draft.confidentiality} onChange={e => set("confidentiality", e.target.value)}><option>Bounded review only</option><option>Public evidence allowed</option><option>Private review with public finding</option><option>Confidential review only</option></select></label>
      <label><span>Publication permission</span><select value={draft.publication} onChange={e => set("publication", e.target.value)}><option>No publication without separate written permission</option><option>Case study subject to mutual approval</option><option>Public case study permitted</option><option>Anonymous case study permitted</option><option>Finding only; no case study</option></select></label>
    </div>
    <label className="attest"><input type="checkbox" checked={draft.attestation} onChange={e => set("attestation", e.target.checked)} /><span>I attest that this local preparation package is accurate to the best of my knowledge and that its claim, non-claims, confidentiality, and publication boundaries are intentional.</span></label>
    <div className="actions"><button onClick={saveLocal}>Save local draft</button><button onClick={reset}>Reset local draft</button><button disabled={!ready} title="Authoritative server submission is not connected on this preparation page">{ready ? "Ready for authoritative submission" : "Complete package first"}</button></div>{savedAt && <p className="saved">Local draft saved {new Date(savedAt).toLocaleString()} · This is not a submission receipt.</p>}
    </section>

    <section className="chain"><h2>The authority chain is explicit.</h2><div><b>1 · PREPARE</b><span>Local draft</span><i>→</i><b>2 · SUBMIT</b><span>Server receipt</span><i>→</i><b>3 · REVIEW</b><span>Institutional determination</span><i>→</i><b>4 · FINALIZE</b><span>Registry ID</span><i>→</i><b>5 · PUBLISH</b><span>Only if authorized</span></div></section>

    <style jsx>{`
      :global(body){margin:0;background:#05070d;color:#eef3ff;font-family:Inter,ui-sans-serif,system-ui,sans-serif}main{min-height:100vh;background:radial-gradient(circle at 75% 10%,#17325766,transparent 30%),radial-gradient(circle at 10% 45%,#39245c44,transparent 30%),#05070d;padding-bottom:80px}header,.hero,.status,.workspace,.chain{max-width:1180px;margin:auto}header{display:flex;justify-content:space-between;align-items:center;padding:28px 24px;border-bottom:1px solid #ffffff18}header div{display:grid;gap:4px}header b{font-size:12px;letter-spacing:.14em}header small{color:#9ca9bd}nav{display:flex;gap:20px}nav a{color:#c8d5e8;text-decoration:none;font-size:13px}.hero{padding:80px 24px 42px}.eyebrow{color:#83b7ff;font-weight:800;letter-spacing:.15em;font-size:12px}.hero h1{font-size:clamp(38px,6vw,72px);line-height:1.02;max-width:1050px;margin:14px 0 22px}.hero h1 em{font-style:normal;color:#9cc5ff}.hero>p:not(.eyebrow){max-width:850px;color:#b6c1d2;font-size:18px;line-height:1.65}.rule{margin-top:32px;padding:22px 24px;border:1px solid #6aa9ff66;background:#0c1727cc;border-radius:18px;display:grid;gap:8px}.rule strong{color:#b8d7ff;letter-spacing:.08em}.rule span{color:#aab8cc}.status{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:0 24px 24px}.status article,.notice,.workspace,.chain{border:1px solid #ffffff1c;background:#0a0f19dd;border-radius:20px}.status article{padding:22px}.status span{font-size:11px;color:#8494aa;letter-spacing:.12em}.status strong{display:block;font-size:24px;margin:10px 0}.status p{color:#9eacc0;font-size:12px}.workspace{margin-top:12px;padding:26px}.notice{padding:18px 20px;margin-bottom:24px;border-color:#d7b56c55;background:#17130c}.notice b{color:#f1ce82}.notice p{color:#c5bda9;line-height:1.5}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.grid label{display:grid;gap:8px}.grid label:nth-child(n+5):nth-child(-n+9){grid-column:1/-1}label span{font-size:12px;font-weight:700;color:#c5d0df}input,textarea,select{box-sizing:border-box;width:100%;border:1px solid #ffffff22;border-radius:12px;background:#080c14;color:#f4f7fb;padding:13px 14px;font:inherit}textarea{resize:vertical}.attest{display:flex;gap:12px;margin:24px 0;padding:18px;background:#0e1522;border-radius:14px}.attest input{width:18px}.actions{display:flex;gap:12px;flex-wrap:wrap}.actions button{border:1px solid #ffffff2b;background:#111b2a;color:#e9f1ff;padding:12px 18px;border-radius:10px;font-weight:800}.actions button:last-child{background:#17365c;border-color:#5c9ae8}.actions button:disabled{opacity:.48}.saved{font-size:12px;color:#8fa0b6}.chain{margin-top:24px;padding:28px}.chain h2{margin-top:0}.chain div{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.chain b{color:#a9ceff}.chain span{color:#8e9caf}.chain i{color:#55708e}@media(max-width:760px){header{align-items:flex-start;gap:20px;flex-direction:column}.status,.grid{grid-template-columns:1fr}.grid label:nth-child(n){grid-column:auto}.hero{padding-top:50px}.status{padding:0 16px 16px}.workspace,.chain{margin-left:16px;margin-right:16px}}
    `}</style>
  </main>;
}
