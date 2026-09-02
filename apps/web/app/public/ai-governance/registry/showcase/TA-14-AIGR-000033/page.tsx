import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'S3DVS Version 1.0 | TA-14 Governance Showcase',
  description:
    'Public TA-14 Governance Showcase for S3DVS Version 1.0, Registry identifier TA-14-AIGR-000033.',
};

const claims = [
  'Hardware-enforced memory segregation partitioning the active address space into eight unconditioned binary categories with immutable gate-level access attributes.',
  'A dual-processor separation model in which the Load Processor holds the instruction-memory write path while the Main Processor is physically restricted to instruction reads.',
  'Gate-level, real-time address validation against processor identity, access intent, and hardware memory-boundary registers.',
];

const nonClaims = [
  'S3DVS is not a logical software debugging system and does not claim to detect or correct semantic application defects.',
  'Operating-system scheduling, logging, and recovery remain outside the physical enforcement layer.',
  'Physical execution-boundary enforcement does not itself determine whether a human or logical authority remains legitimate or uncompromised.',
];

const limitations = [
  'Legacy self-modifying code and runtime JIT patterns that depend on executable data areas may conflict with the architecture\'s physical separation model.',
  'Absolute timing and latency claims require empirical measurement on target silicon under operational load.',
  'Speculative side-channel resistance remains a physical verification question for target silicon testing.',
];

export default function S3DVSShowcasePage() {
  return (
    <main className="page">
      <style>{`
        *{box-sizing:border-box}body{margin:0;background:#020711;color:#f5f7fb}
        .page{min-height:100vh;background:radial-gradient(circle at 12% 8%,rgba(34,102,166,.24),transparent 28%),radial-gradient(circle at 88% 10%,rgba(224,176,73,.16),transparent 26%),linear-gradient(180deg,#020711,#071321 54%,#020711);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .wrap{width:min(1180px,calc(100% - 36px));margin:0 auto;padding:34px 0 88px}
        .nav{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:58px}.nav a{color:#aac7df;text-decoration:none;font-size:13px}.nav b{color:#e8bd67}
        .hero{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(310px,.6fr);gap:42px;align-items:start}
        .eyebrow{color:#e9bd68;font-weight:900;font-size:11px;letter-spacing:.16em;text-transform:uppercase}.hero h1{font-size:clamp(48px,8vw,94px);line-height:.92;letter-spacing:-.055em;margin:18px 0 18px}.sub{font-size:clamp(19px,2.2vw,28px);line-height:1.4;color:#d6e3ee;max-width:850px}.lead{font-size:18px;line-height:1.75;color:#9fb7ca;max-width:900px}
        .card{border:1px solid rgba(226,181,88,.32);background:linear-gradient(160deg,rgba(16,27,39,.96),rgba(6,15,24,.97));border-radius:24px;padding:26px;box-shadow:0 28px 80px rgba(0,0,0,.32)}.seal{height:78px;width:78px;border:1px solid rgba(235,196,112,.42);border-radius:50%;display:grid;place-items:center;color:#efc875;font-weight:950;letter-spacing:.08em}.label{font-size:9px;letter-spacing:.13em;text-transform:uppercase;color:#6f8aa1;font-weight:900;margin-top:18px}.value{color:#f0cb7e;font-weight:900;margin-top:5px;overflow-wrap:anywhere}.fact{border-top:1px solid rgba(255,255,255,.07);padding-top:12px;margin-top:12px}.fact strong{display:block;color:#d9e8f4;margin-top:4px;font-size:14px;line-height:1.45}
        .band{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:36px 0}.metric{border:1px solid rgba(111,169,216,.18);background:rgba(7,20,33,.93);border-radius:18px;padding:20px}.metric strong{display:block;color:#efc875;font-size:24px}.metric span{display:block;color:#748fa6;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;margin-top:5px}
        section{margin-top:58px}.sectionHead{display:flex;justify-content:space-between;gap:20px;align-items:end;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:15px}.sectionHead h2{font-size:clamp(30px,4vw,48px);margin:0;letter-spacing:-.035em}.sectionHead p{max-width:620px;color:#869fb3;line-height:1.6;margin:0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:20px}.item{padding:22px;border:1px solid rgba(120,175,220,.16);border-radius:18px;background:rgba(6,18,30,.88);color:#b9ccda;line-height:1.65}.item b{display:block;color:#e8bd67;margin-bottom:10px}.boundary{margin-top:58px;padding:24px;border:1px solid rgba(231,183,79,.34);border-radius:18px;background:rgba(231,183,79,.07);color:#d8c38f;line-height:1.7}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:26px}.button{display:inline-flex;align-items:center;min-height:46px;padding:0 17px;border-radius:11px;text-decoration:none;font-weight:900;font-size:13px}.primary{background:linear-gradient(135deg,#f2d18a,#d7a745);color:#07111b}.secondary{border:1px solid rgba(117,173,218,.27);color:#d9e9f5;background:rgba(9,26,42,.72)}
        @media(max-width:860px){.hero{grid-template-columns:1fr}.band,.grid{grid-template-columns:1fr}.sectionHead{display:block}.sectionHead p{margin-top:10px}}
      `}</style>

      <div className="wrap">
        <nav className="nav">
          <Link href="/governance-showcase">Governance Showcase</Link><b>•</b>
          <Link href="/public/ai-governance/registry/showcase">Public Registry Showcase</Link><b>•</b>
          <span>TA-14-AIGR-000033</span>
        </nav>

        <div className="hero">
          <div>
            <p className="eyebrow">TA-14 PUBLIC GOVERNANCE SHOWCASE · REGISTERED BASELINE</p>
            <h1>S3DVS</h1>
            <p className="sub">Schad-Software-sichere Datenverarbeitungssysteme · Version 1.0</p>
            <p className="lead">
              A hardware-native security architecture built around physical separation of instruction and data paths, dual-processor asymmetry, eight-category memory segregation, and gate-level access enforcement. This showcase preserves the public Registry baseline and the boundaries of what has—and has not—been established.
            </p>
            <div className="actions">
              <Link className="button primary" href="/governance-showcase/TA-14-AIGR-000033">Open living showcase</Link>
              <Link className="button secondary" href="/public/ai-governance/registry/showcase/TA-14-AIGR-000033">Public record view</Link>
            </div>
          </div>

          <aside className="card">
            <div className="seal">TA-14</div>
            <div className="label">Permanent Registry Identity</div>
            <div className="value">TA-14-AIGR-000033</div>
            <div className="fact"><span className="label">Status</span><strong>Registered · Public</strong></div>
            <div className="fact"><span className="label">Version</span><strong>1.0</strong></div>
            <div className="fact"><span className="label">Organization</span><strong>S3DVS Architecture Group</strong></div>
            <div className="fact"><span className="label">Patent anchor</span><strong>DE 10 2013 005 971 B3</strong></div>
          </aside>
        </div>

        <div className="band">
          <div className="metric"><strong>8</strong><span>Memory categories</span></div>
          <div className="metric"><strong>2</strong><span>Asymmetric processors</span></div>
          <div className="metric"><strong>Gate-level</strong><span>Enforcement boundary</span></div>
          <div className="metric"><strong>Public</strong><span>Registry visibility</span></div>
        </div>

        <section>
          <div className="sectionHead"><h2>Declared architecture claims</h2><p>These are registrant-declared claims preserved as the public baseline. Registration records them; it does not independently certify them.</p></div>
          <div className="grid">{claims.map((claim,i)=><div className="item" key={claim}><b>CLAIM {String(i+1).padStart(2,'0')}</b>{claim}</div>)}</div>
        </section>

        <section>
          <div className="sectionHead"><h2>Explicit non-claims</h2><p>The public record is strongest when it preserves the edges as clearly as the center.</p></div>
          <div className="grid">{nonClaims.map((claim,i)=><div className="item" key={claim}><b>NON-CLAIM {String(i+1).padStart(2,'0')}</b>{claim}</div>)}</div>
        </section>

        <section>
          <div className="sectionHead"><h2>Known limitations</h2><p>These conditions remain visible so later testing can add evidence without rewriting the registered baseline.</p></div>
          <div className="grid">{limitations.map((claim,i)=><div className="item" key={claim}><b>LIMITATION {String(i+1).padStart(2,'0')}</b>{claim}</div>)}</div>
        </section>

        <section>
          <div className="sectionHead"><h2>Evidence path</h2><p>The next institutional layer is demonstrative evidence tied to the same Registry identity.</p></div>
          <div className="grid">
            <div className="item"><b>PROTOCOLS 1–9</b>Hardware demonstrator evidence is described as exercising strict eight-category isolation and observing gate-level refusal of unauthorized cross-category access.</div>
            <div className="item"><b>PROTOCOL 10</b>The full-address-overlap scenario is preserved as the contrasting condition used to show what changes when physical category separation is removed.</div>
            <div className="item"><b>NEXT GOVERNED STEP</b>A bounded TA-14 demonstration can convert the registered claims into an inspectable artifact series without changing the meaning of Registry admission.</div>
          </div>
        </section>

        <div className="boundary">
          <strong>Institutional boundary:</strong> TA-14 Registry admission establishes a stable, attributable public identity for the declared S3DVS Version 1.0 baseline. It does not certify security, patent validity, implementation correctness, performance, or empirical sufficiency. Those questions belong to separately governed evidence and demonstration records.
        </div>
      </div>
    </main>
  );
}
