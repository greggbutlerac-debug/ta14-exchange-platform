'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Status = 'Draft' | 'Submitted' | 'Under review' | 'Resolved';
type Ground = 'Evidence' | 'Authority' | 'Continuity' | 'Boundary' | 'Execution' | 'Outcome';

type Challenge = {
  id: string;
  title: string;
  ground: Ground;
  claim: string;
  requestedRemedy: string;
  status: Status;
  createdAt: string;
};

const STORAGE_KEY = 'ta14-academy-challenge-appeal-lab-v1';
const grounds: Ground[] = ['Evidence', 'Authority', 'Continuity', 'Boundary', 'Execution', 'Outcome'];

function readChallenges(): Challenge[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Challenge[]) : [];
  } catch {
    return [];
  }
}

export default function ChallengeAndAppealLabPage() {
  const [items, setItems] = useState<Challenge[]>([]);
  const [title, setTitle] = useState('');
  const [ground, setGround] = useState<Ground>('Evidence');
  const [claim, setClaim] = useState('');
  const [requestedRemedy, setRequestedRemedy] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readChallenges());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const metrics = useMemo(() => ({
    total: items.length,
    open: items.filter((item) => item.status !== 'Resolved').length,
    resolved: items.filter((item) => item.status === 'Resolved').length,
  }), [items]);

  function addChallenge() {
    if (!title.trim() || !claim.trim() || !requestedRemedy.trim()) return;
    setItems((current) => [{
      id: crypto.randomUUID(),
      title: title.trim(),
      ground,
      claim: claim.trim(),
      requestedRemedy: requestedRemedy.trim(),
      status: 'Draft',
      createdAt: new Date().toISOString(),
    }, ...current]);
    setTitle('');
    setClaim('');
    setRequestedRemedy('');
  }

  function setStatus(id: string, status: Status) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }

  function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function exportRecord() {
    const payload = {
      recordType: 'TA-14 Academy Challenge and Appeal Record',
      exportedAt: new Date().toISOString(),
      challenges: items,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ta14-challenge-record-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page">
      <div className="cosmos" aria-hidden="true"><span className="glow one"/><span className="glow two"/><span className="stars"/></div>

      <header className="topbar">
        <Link href="/academy/dashboard" className="brand"><span className="mark">TA-14</span><span><strong>Challenge & Appeal Lab</strong><small>Preserved objection before consequence</small></span></Link>
        <nav><Link href="/academy/review">Review</Link><Link href="/academy/assessment">Assessment</Link><Link href="/academy/dashboard">Mission Control</Link></nav>
      </header>

      <section className="hero">
        <div><p className="eyebrow">Challengeability · due process · preserved review</p><h1>An execution that cannot survive challenge is not ready to bind reality.</h1><p>Build a challenge record that identifies the contested decision, states the governing defect, preserves the requested remedy, and tracks disposition without rewriting the source record.</p></div>
        <aside><span>Governing rule</span><strong>Challenge must be possible before irreversible consequence.</strong></aside>
      </section>

      <section className="metrics">
        <article><span>Total challenges</span><strong>{hydrated ? metrics.total : '—'}</strong></article>
        <article><span>Open</span><strong>{hydrated ? metrics.open : '—'}</strong></article>
        <article><span>Resolved</span><strong>{hydrated ? metrics.resolved : '—'}</strong></article>
      </section>

      <section className="grid">
        <article className="panel composer">
          <p className="eyebrow">Create challenge</p><h2>Preserve the objection</h2>
          <label><span>Challenge title</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Name the contested determination"/></label>
          <label><span>Ground</span><select value={ground} onChange={(e) => setGround(e.target.value as Ground)}>{grounds.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Claim</span><textarea rows={6} value={claim} onChange={(e) => setClaim(e.target.value)} placeholder="State what failed, what evidence supports the challenge, and why the decision should not bind."/></label>
          <label><span>Requested remedy</span><textarea rows={4} value={requestedRemedy} onChange={(e) => setRequestedRemedy(e.target.value)} placeholder="Revalidate, correct, suspend, reverse, escalate, or preserve for independent review."/></label>
          <button className="primary" type="button" onClick={addChallenge} disabled={!title.trim() || !claim.trim() || !requestedRemedy.trim()}>Preserve challenge</button>
        </article>

        <article className="panel queue">
          <div className="queueHead"><div><p className="eyebrow">Appeal record</p><h2>Challenge lifecycle</h2></div><button className="secondary" type="button" onClick={exportRecord} disabled={items.length === 0}>Export record</button></div>
          <div className="list">
            {items.length === 0 ? <div className="empty"><strong>No challenge preserved.</strong><span>Create one to begin the appeal lifecycle.</span></div> : items.map((item) => (
              <article className="card" key={item.id}>
                <div className="cardTop"><div><span className="ground">{item.ground}</span><h3>{item.title}</h3></div><span className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span></div>
                <p>{item.claim}</p><div className="remedy"><span>Requested remedy</span><strong>{item.requestedRemedy}</strong></div>
                <div className="actions">{(['Draft','Submitted','Under review','Resolved'] as Status[]).map((status) => <button key={status} type="button" className={item.status === status ? 'active' : ''} onClick={() => setStatus(item.id, status)}>{status}</button>)}<button type="button" className="delete" onClick={() => remove(item.id)}>Delete</button></div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="lesson panel"><p className="eyebrow">Learning boundary</p><h2>What this lab teaches</h2><div className="lessonGrid"><article><strong>1</strong><span>Separate disagreement from a governed challenge.</span></article><article><strong>2</strong><span>Connect every objection to evidence, authority, continuity, boundary, execution, or outcome.</span></article><article><strong>3</strong><span>Preserve the original decision while tracking review and remedy.</span></article><article><strong>4</strong><span>Require a disposition that is attributable, dated, and reviewable.</span></article></div></section>

      <style jsx>{`
        :global(*){box-sizing:border-box}.page{min-height:100vh;color:#eef7ff;background:#030812;font-family:Inter,ui-sans-serif,system-ui,sans-serif;position:relative;overflow:hidden;padding-bottom:72px}.cosmos{position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 50% -10%,rgba(38,110,146,.22),transparent 40%),linear-gradient(180deg,#07101d,#02060c)}.glow{position:absolute;border-radius:999px;filter:blur(80px);opacity:.28}.one{width:420px;height:420px;background:#1ac7c9;top:12%;left:-150px}.two{width:520px;height:520px;background:#3267d6;right:-220px;top:38%}.stars{position:absolute;inset:0;background-image:radial-gradient(#fff 1px,transparent 1px);background-size:42px 42px;opacity:.08}.topbar,.hero,.metrics,.grid,.lesson{position:relative;z-index:1;max-width:1260px;margin:auto}.topbar{height:92px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;border-bottom:1px solid rgba(255,255,255,.08)}.brand{display:flex;gap:14px;align-items:center;color:inherit;text-decoration:none}.brand span:last-child{display:grid}.brand small{color:#8ea8bb;margin-top:3px}.mark{border:1px solid #34d6d4;color:#67eeea;padding:9px 12px;border-radius:10px;font-weight:800;letter-spacing:.08em}.topbar nav{display:flex;gap:22px}.topbar nav a{color:#afc2d1;text-decoration:none}.hero{display:grid;grid-template-columns:1.5fr .65fr;gap:44px;padding:84px 24px 44px}.eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:.72rem;font-weight:800;color:#52d9d5;margin:0 0 12px}.hero h1{font-size:clamp(2.7rem,6vw,5.5rem);line-height:.96;letter-spacing:-.055em;margin:0;max-width:900px}.hero p:not(.eyebrow){font-size:1.08rem;line-height:1.8;color:#a8bccb;max-width:800px}.hero aside{align-self:end;border:1px solid rgba(82,217,213,.28);background:rgba(8,20,32,.72);padding:24px;border-radius:20px;display:grid;gap:10px}.hero aside span,.metrics span,.remedy span{color:#82a0b4;font-size:.78rem;text-transform:uppercase;letter-spacing:.1em}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:0 24px 22px}.metrics article,.panel{background:rgba(7,16,28,.82);border:1px solid rgba(255,255,255,.09);border-radius:22px;box-shadow:0 24px 80px rgba(0,0,0,.24)}.metrics article{padding:20px 22px;display:grid;gap:8px}.metrics strong{font-size:1.9rem}.grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:20px;padding:0 24px}.panel{padding:28px}.panel h2{font-size:1.7rem;margin:0 0 22px}.composer label{display:grid;gap:8px;margin-top:16px}.composer label span{font-size:.8rem;color:#a8bccb;font-weight:700}.composer input,.composer select,.composer textarea{width:100%;border:1px solid rgba(255,255,255,.12);background:#07111e;color:#eef7ff;border-radius:12px;padding:13px 14px;font:inherit;outline:none}.composer input:focus,.composer select:focus,.composer textarea:focus{border-color:#36d3d0}.primary,.secondary,.actions button{border:0;border-radius:11px;font-weight:800;cursor:pointer}.primary{width:100%;margin-top:18px;padding:14px;background:linear-gradient(135deg,#3ce0db,#34a9d2);color:#031017}.primary:disabled,.secondary:disabled{opacity:.4;cursor:not-allowed}.queueHead{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.secondary{padding:11px 14px;background:#10263a;color:#bdeeed;border:1px solid rgba(82,217,213,.25)}.list{display:grid;gap:14px}.empty{padding:42px;border:1px dashed rgba(255,255,255,.15);border-radius:16px;text-align:center;display:grid;gap:8px;color:#88a0b2}.card{padding:20px;background:#081421;border:1px solid rgba(255,255,255,.08);border-radius:16px}.cardTop{display:flex;justify-content:space-between;gap:16px}.card h3{margin:7px 0 12px}.ground{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#53dbd7}.status{height:max-content;font-size:.72rem;padding:6px 9px;border-radius:999px;background:#142436;color:#b6ccda}.status.resolved{background:rgba(53,201,143,.15);color:#6fe1ae}.card p{color:#abc0cf;line-height:1.65}.remedy{display:grid;gap:6px;border-left:2px solid #39d6d2;padding-left:12px}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.actions button{padding:8px 10px;background:#102033;color:#9fb5c5}.actions button.active{background:#2dcbc7;color:#031112}.actions .delete{margin-left:auto;color:#ff9fa6;background:#2a151d}.lesson{margin-top:20px}.lessonGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.lessonGrid article{padding:18px;background:#081421;border-radius:14px;display:grid;gap:10px;color:#aec2d0}.lessonGrid strong{color:#50dfda;font-size:1.4rem}@media(max-width:900px){.hero,.grid{grid-template-columns:1fr}.lessonGrid{grid-template-columns:1fr 1fr}.topbar nav{display:none}}@media(max-width:560px){.metrics{grid-template-columns:1fr}.lessonGrid{grid-template-columns:1fr}.hero{padding-top:54px}.panel{padding:20px}.queueHead{display:grid}}
      `}</style>
    </main>
  );
}
