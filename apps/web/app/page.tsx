import FrontDoorPrototype from '../../../prototypes/front-door-institutional-map-2026-09-09/FrontDoorPrototype';
import RainEnhancer from './front-door-preview/RainEnhancer';
import ArchitectureFamilyEnhancer from './front-door-preview/ArchitectureFamilyEnhancer';
import CanonicalChain24 from './front-door-preview/CanonicalChain24';
import './front-door-preview/multilingual-rain.css';

const consequenceJourney = [
  ['01', 'REGISTER', 'Establish the governed identity and preserve who owns the architecture.'],
  ['02', 'FREEZE', 'Fix the proposition, version, evidence boundary, falsifiers, and stop rules before the result is known.'],
  ['03', 'EXAMINE', 'Run the bounded proposition without silently repairing the architecture or enlarging the claim.'],
  ['04', 'EVIDENCE', 'Preserve what actually happened, including failure, uncertainty, HOLD conditions, and limitations.'],
  ['05', 'DETERMINE', 'Return only what the evidence supports: ALLOW, HOLD, DENY, or ESCALATE.'],
  ['06', 'CLOSE', 'Bind the determination to the exact proposition and preserve the historical record.'],
  ['07', 'INSPECT', 'Make the record and its applicability boundary understandable without creating a new finding.'],
  ['08', 'REVALIDATE', 'When material conditions change, require a new assessment instead of inheriting old standing.'],
];

export default function HomePage() {
  return (
    <>
      <RainEnhancer />
      <ArchitectureFamilyEnhancer />
      <section className="consequence-first" aria-labelledby="consequence-first-title">
        <div className="consequence-first__inner">
          <p className="consequence-first__eyebrow">THE CONSEQUENCE BOUNDARY</p>
          <h1 id="consequence-first-title">A consequence is proposed. Can it become reality <em>NOW?</em></h1>
          <p className="consequence-first__lead">Before capability becomes consequence, TA-14 asks whether this exact proposed consequence has <strong>ADMISSIBLE EVIDENCE</strong>, <strong>APPLICABLE AUTHORITY</strong>, and <strong>ESTABLISHED STANDING</strong> to become reality now.</p>
          <div className="consequence-first__tests" aria-label="TA-14 consequence-boundary tests">
            <div><small>EVIDENCE</small><b>ADMISSIBLE</b><p>Attributable, continuous, current, and sufficient for this determination.</p></div>
            <div><small>AUTHORITY</small><b>APPLICABLE</b><p>Valid for this actor, object, scope, condition, jurisdiction, and execution path.</p></div>
            <div><small>STANDING</small><b>ESTABLISHED</b><p>Established from the authoritative state available at the consequence boundary.</p></div>
            <div><small>TIME</small><b>NOW</b><p>Changed reality can preserve, defeat, or leave standing unresolved.</p></div>
          </div>
          <div className="consequence-first__states" aria-label="TA-14 determination states">
            <span>ALLOW</span><span>HOLD</span><span>DENY</span><span>ESCALATE</span>
          </div>
          <a className="consequence-first__cta" href="/consequence-boundary">RUN THE BOUNDARY →</a>
          <p className="consequence-first__rule">Everything else in the Exchange exists to establish, examine, preserve, teach, or reconstruct why that determination was legitimate.</p>
          <div className="consequence-first__journey">
            {consequenceJourney.map(([n,title,copy]) => (
              <article key={n}><small>{n}</small><b>{title}</b><p>{copy}</p></article>
            ))}
          </div>
          <p className="consequence-first__close"><strong>AUTHORITY IS NOT AUTOMATICALLY APPLICABLE. STANDING IS NOT AUTOMATICALLY INHERITED.</strong><br/>NEW PROPOSITION = NEW CHAIN. A historical determination stays fixed. If material conditions cross its evidence boundary, the answer is <strong>NEW ASSESSMENT REQUIRED.</strong></p>
        </div>
      </section>
      <FrontDoorPrototype />
      <CanonicalChain24 />
      <style>{`
        .consequence-first{background:radial-gradient(circle at 50% 0,rgba(77,201,255,.18),transparent 36%),linear-gradient(180deg,#01060c,#04131d);color:#f3f8fb;border-bottom:1px solid rgba(255,255,255,.08);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .consequence-first__inner{width:min(1220px,calc(100% - 36px));margin:auto;padding:54px 0 48px}
        .consequence-first__eyebrow{margin:0;color:#79dcff;font-size:10px;font-weight:950;letter-spacing:.2em}
        .consequence-first h1{max-width:1050px;margin:14px 0 20px;font-size:clamp(46px,7vw,92px);line-height:.94;letter-spacing:-.055em}
        .consequence-first h1 em{font-style:normal;color:#efc966}
        .consequence-first__lead{max-width:960px;color:#afc0cb;font-size:clamp(17px,2vw,22px);line-height:1.62}
        .consequence-first__lead strong{color:#f3d98f}
        .consequence-first__tests{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:26px 0 18px}
        .consequence-first__tests div{padding:15px;border:1px solid rgba(121,220,255,.18);border-radius:12px;background:rgba(3,16,24,.72)}
        .consequence-first__tests small{display:block;color:#7f96a4;font-size:9px;font-weight:900;letter-spacing:.12em}
        .consequence-first__tests b{display:block;margin-top:6px;color:#f3d98f;font-size:13px;letter-spacing:.08em}
        .consequence-first__tests p{margin:7px 0 0;color:#8fa2ad;font-size:10px;line-height:1.5}
        .consequence-first__states{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0 24px}
        .consequence-first__states span{padding:9px 13px;border:1px solid rgba(121,220,255,.28);border-radius:999px;color:#9ce6ff;font-size:10px;font-weight:950;letter-spacing:.12em;background:rgba(3,18,29,.8)}
        .consequence-first__cta{display:inline-flex;align-items:center;min-height:50px;padding:0 18px;border-radius:11px;background:linear-gradient(135deg,#81e5ff,#73e2b5);color:#04131b;text-decoration:none;font-size:11px;font-weight:950;letter-spacing:.08em}
        .consequence-first__rule{max-width:980px;margin:28px 0;color:#d6e1e7;font:20px/1.55 Georgia,serif}
        .consequence-first__journey{display:grid;grid-template-columns:repeat(8,1fr);gap:7px;margin-top:24px}
        .consequence-first__journey article{min-height:150px;padding:15px 12px;border:1px solid rgba(118,231,193,.17);border-radius:12px;background:rgba(3,16,24,.82)}
        .consequence-first__journey small{display:block;color:#76e7c1;font-size:9px;font-weight:950}
        .consequence-first__journey b{display:block;margin-top:9px;font-size:10px;letter-spacing:.08em}
        .consequence-first__journey p{margin:9px 0 0;color:#879ca9;font-size:10px;line-height:1.5}
        .consequence-first__close{margin:18px 0 0;padding:16px 18px;border:1px solid rgba(239,201,102,.25);border-radius:12px;background:rgba(48,35,8,.28);color:#aaafac;font-size:12px;line-height:1.65}
        .consequence-first__close strong{color:#efc966}
        @media(max-width:980px){.consequence-first__tests,.consequence-first__journey{grid-template-columns:repeat(4,1fr)}}
        @media(max-width:620px){.consequence-first__tests,.consequence-first__journey{grid-template-columns:repeat(2,1fr)}.consequence-first__inner{padding-top:38px}}
      `}</style>
    </>
  );
}
