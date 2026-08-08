import Link from 'next/link';

const pathways = [
  ['Participant Review', 'Preserve an attributable review from the steward, architect, owner, or authorized participant associated with a governed record.'],
  ['Participant Response', 'Respond to a TA-14 finding, artifact, challenge, review, or other governed record without rewriting the underlying record.'],
  ['Independent Review', 'Submit attributable independent analysis of a registered governance, demonstration, finding, artifact, evidence package, or methodology.'],
  ['Evidence Challenge', 'Challenge a specific claim, evidence basis, execution artifact, or finding while preserving the original record.'],
  ['Factual Correction', 'Request correction of an objective record error such as an identifier, version, timestamp, hash, description, or attribution.'],
  ['Technical Comment', 'Add substantive technical analysis that remains attributable and separate from TA-14 findings.'],
  ['Replication / Demonstration Request', 'Request reproducible examination or a new bounded demonstration against a registered governance record.'],
  ['External Publication', 'Attach an attributable outside publication to the relevant governed record without converting it into a TA-14 finding.'],
];

export default function ReviewsResponsesPage() {
  return (
    <main className="page-shell">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body { margin: 0; }
        .page-shell {
          min-height: 100vh;
          color: #f6f7fb;
          background:
            radial-gradient(circle at 12% 10%, rgba(62,101,255,.18), transparent 30%),
            radial-gradient(circle at 88% 18%, rgba(222,180,79,.13), transparent 28%),
            linear-gradient(180deg, #05070d 0%, #090d17 48%, #05070d 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 32px 22px 80px;
        }
        .wrap { width: min(1180px, 100%); margin: 0 auto; }
        .topbar { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:42px; flex-wrap:wrap; }
        .brand { color:#fff; text-decoration:none; font-weight:800; letter-spacing:.02em; }
        .brand small { display:block; color:#aeb8ce; font-weight:600; margin-top:4px; }
        .nav { display:flex; gap:10px; flex-wrap:wrap; }
        .nav a, .button { border:1px solid rgba(255,255,255,.14); color:#f7f8fc; text-decoration:none; border-radius:999px; padding:10px 16px; font-weight:700; font-size:14px; background:rgba(255,255,255,.035); }
        .nav a:hover, .button:hover { border-color:rgba(222,180,79,.65); transform:translateY(-1px); }
        .hero { border:1px solid rgba(255,255,255,.12); border-radius:28px; padding:48px; background:linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018)); box-shadow:0 28px 80px rgba(0,0,0,.35); }
        .eyebrow { color:#deb44f; font-size:12px; font-weight:900; letter-spacing:.19em; text-transform:uppercase; }
        h1 { font-size:clamp(42px,7vw,82px); line-height:.97; letter-spacing:-.055em; margin:16px 0 22px; max-width:900px; }
        .lede { color:#c4cadd; font-size:19px; line-height:1.65; max-width:850px; margin:0; }
        .hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:30px; }
        .button.primary { background:#deb44f; color:#11141b; border-color:#deb44f; }
        .button.secondary { background:rgba(255,255,255,.045); }
        .principle { margin-top:28px; display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
        .principle div { padding:16px; border-radius:16px; background:rgba(0,0,0,.24); border:1px solid rgba(255,255,255,.08); }
        .principle strong { display:block; color:#fff; margin-bottom:5px; }
        .principle span { color:#9ca8c2; font-size:13px; line-height:1.45; }
        .section { margin-top:54px; }
        .section-head { display:flex; justify-content:space-between; align-items:end; gap:24px; margin-bottom:22px; }
        .section h2 { margin:5px 0 0; font-size:34px; letter-spacing:-.03em; }
        .section-note { max-width:560px; color:#9fa9bf; line-height:1.55; }
        .grid { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
        .card { padding:24px; border-radius:20px; border:1px solid rgba(255,255,255,.10); background:rgba(255,255,255,.035); }
        .card h3 { margin:0 0 10px; font-size:19px; }
        .card p { margin:0; color:#aeb7ca; line-height:1.58; }
        .featured { display:grid; grid-template-columns:1.25fr .75fr; gap:18px; margin-top:20px; }
        .record { padding:30px; border-radius:24px; border:1px solid rgba(222,180,79,.34); background:linear-gradient(145deg, rgba(222,180,79,.09), rgba(255,255,255,.025)); }
        .record h3 { font-size:26px; margin:8px 0 12px; }
        .record p { color:#bec6d7; line-height:1.6; }
        .record-meta { display:flex; gap:8px; flex-wrap:wrap; margin:18px 0 24px; }
        .tag { border:1px solid rgba(255,255,255,.12); border-radius:999px; padding:7px 10px; color:#cfd5e3; font-size:12px; font-weight:800; }
        .rulebox { padding:30px; border-radius:24px; border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.03); }
        .rulebox strong { display:block; font-size:20px; margin-bottom:12px; }
        .rulebox p { color:#aeb7ca; line-height:1.6; }
        .footer { margin-top:56px; padding-top:24px; border-top:1px solid rgba(255,255,255,.09); display:flex; justify-content:space-between; gap:18px; flex-wrap:wrap; color:#7f8aa1; font-size:13px; }
        @media (max-width: 820px) {
          .hero { padding:30px 22px; }
          .principle { grid-template-columns:1fr 1fr; }
          .grid, .featured { grid-template-columns:1fr; }
          .section-head { align-items:flex-start; flex-direction:column; }
        }
        @media (max-width: 520px) { .principle { grid-template-columns:1fr; } }
      `}</style>

      <div className="wrap">
        <header className="topbar">
          <Link className="brand" href="/workspace/ai-governance">
            TA-14 AI Governance Exchange
            <small>Reviews & Responses</small>
          </Link>
          <nav className="nav" aria-label="Reviews and responses navigation">
            <Link href="/workspace/ai-governance/registry">Governance Registry</Link>
            <Link href="/artifacts">Artifact Registry</Link>
            <Link href="/workspace/ai-governance/reviews/submit">Submit a Record</Link>
          </nav>
        </header>

        <section className="hero">
          <div className="eyebrow">Governed public record</div>
          <h1>Independent voices. Preserved chronology.</h1>
          <p className="lede">
            Reviews & Responses is the Exchange layer for attributable participant reviews, participant responses, independent reviews, evidence challenges, factual corrections, technical comments, replication requests, and external publications. New voices are attached to the record without silently rewriting the evidence, artifact, or finding that came before them.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/workspace/ai-governance/reviews/submit">Submit Review or Response →</Link>
            <Link className="button secondary" href="/artifacts">Inspect Execution Artifacts →</Link>
          </div>
          <div className="principle">
            <div><strong>Attributable</strong><span>Every voice remains tied to its speaker or submitting entity.</span></div>
            <div><strong>Dated</strong><span>Later commentary never erases what the record showed earlier.</span></div>
            <div><strong>Record-bound</strong><span>Responses can link to a governance, demonstration, case, finding, or artifact.</span></div>
            <div><strong>Independent</strong><span>Participant opinion does not automatically become a TA-14 finding.</span></div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div><div className="eyebrow">Available pathways</div><h2>Choose the correct record type.</h2></div>
            <p className="section-note">The Exchange preserves separate voices because review, disagreement, correction, replication, and publication are different institutional acts.</p>
          </div>
          <div className="grid">
            {pathways.map(([title, description]) => (
              <article className="card" key={title}><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div><div className="eyebrow">First participant record</div><h2>Harmonic · FD-2026-0002</h2></div>
            <p className="section-note">Harmonic demonstrates why this layer exists: a bounded independent finding can remain intact while the participant adds its own review and subsequent engineering response.</p>
          </div>
          <div className="featured">
            <article className="record">
              <div className="eyebrow">Preserved progression</div>
              <h3>Version 1 finding → participant review → Version 2 engineering response</h3>
              <p>
                Harmonic Constitutional Runtime Version 1.0 produced a refusal / block determination under the constitutional state represented in its admitted execution packet. TA-14 preserved the evidentiary boundary around the surrounding chronology. Harmonic then stated that the finding directly influenced subsequent Version 2 engineering rather than retroactively altering the frozen Version 1 record.
              </p>
              <div className="record-meta">
                <span className="tag">TA-14-AIGR-000008</span>
                <span className="tag">FD-2026-0002</span>
                <span className="tag">CASE 001</span>
                <span className="tag">TA14-EAR-000013</span>
              </div>
              <div className="hero-actions">
                <Link className="button primary" href="/artifacts/fd-2026-0002-case-001">Inspect Harmonic Artifact →</Link>
                <Link className="button secondary" href="/workspace/ai-governance/registry/profiles/harmonic-constitutional-runtime">Open Governance Profile →</Link>
              </div>
            </article>
            <aside className="rulebox">
              <strong>The governing rule</strong>
              <p>A review does not overwrite an artifact. A participant response does not overwrite a finding. A correction does not silently erase chronology. Each new record is preserved as a new attributable institutional act.</p>
              <Link className="button secondary" href="/workspace/ai-governance/reviews/submit">Add a governed voice →</Link>
            </aside>
          </div>
        </section>

        <footer className="footer">
          <span>TA-14 Authority · AI Governance Exchange</span>
          <span>Registration · Evidence · Review · Artifact · Response · Preserved History</span>
        </footer>
      </div>
    </main>
  );
}
