import type { ReactNode } from "react";

const bridgeRows = [
  ["shared_event_id", "Mission Timeline Event ID", "External/source event reference", "Correlate only"],
  ["object_id", "EISO-1 / ONUMA 3254365", "EISO-1 / RE1", "Persistent identity"],
  ["native_source", "ONUMA / BIMgenie / API / correspondence", "Evidence source binding", "Native source retained"],
  ["native_assertion", "What Happened / Result", "Observed Fact", "No semantic overwrite"],
  ["boundary_or_finding", "Boundary / Finding", "TA-14 Standing", "Independent interpretation"],
  ["determination", "Presentation / operational status when applicable", "ALLOW · HOLD · DENY · ESCALATE", "TA-14 authoritative"],
  ["evidence_ref", "Evidence / Link", "EVD-###", "Bidirectional citation"],
  ["unresolved_condition", "Next Step / gap", "Explicit open condition", "Closure remains evidence-bound"],
  ["sync_state", "Website / presentation state", "Current reliance state", "Never upgrades standing"],
] as const;

export default function OnumaRe1Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <section className="omr-bridge-wrap" aria-label="ONUMA TA-14 controlled interoperability bridge">
        <div className="omr-bridge-grid" />
        <div className="omr-bridge-shell">
          <div className="omr-bridge-head">
            <div>
              <p className="omr-bridge-eyebrow">CONTROLLED RECORD BRIDGE · TA14-OMR-000001</p>
              <h2>Parallel records. Shared reality. No authority collapse.</h2>
              <p className="omr-bridge-lead">
                The ONUMA mission tracker and the TA-14 Mission Record Engine remain independently authoritative for different things.
                This bridge correlates the same building object, events, evidence and state transitions without merging either record or
                allowing synchronization to manufacture execution standing.
              </p>
            </div>
            <div className="omr-bridge-mark">
              <span>BRIDGE STATE</span>
              <strong>CONTROLLED</strong>
              <small>REFERENCE · DO NOT OVERWRITE</small>
            </div>
          </div>

          <div className="omr-bridge-architecture">
            <article>
              <small>ONUMA / BECOME THE BUILDING</small>
              <strong>Native mission + lifecycle record</strong>
              <p>Chronology · participants · building semantics · workflow · maturity context · presentation output</p>
              <a className="omr-public-link" href="https://sites.google.com/onuma.com/becomethebuildingbimstorm/Become-the-Building-BIMStorm" target="_blank" rel="noreferrer">OPEN PUBLIC MISSION SURFACE →</a>
              <b>AUTHORITATIVE FOR ITS NATIVE RECORD</b>
            </article>
            <div className="omr-bridge-core">
              <span>↔</span>
              <strong>SHARED OBJECT + EVENT REFERENCES</strong>
              <em>EISO-1 · RE1 · WO 3593-22778</em>
            </div>
            <article className="ta14">
              <small>TA-14</small>
              <strong>Evidence + admissibility record</strong>
              <p>Observed fact · evidence binding · present standing · unresolved conditions · determination · execution boundary</p>
              <b>AUTHORITATIVE FOR TA-14 STANDING</b>
            </article>
          </div>

          <div className="omr-bridge-rule">
            <strong>SHARED IDENTITY DOES NOT MEAN SHARED AUTHORITY.</strong>
            <span>Correlation may move references across the bridge. It may not silently transfer authorship, standing, permission, or control.</span>
          </div>

          <div className="omr-bridge-table" role="table" aria-label="Minimum bridge contract">
            <div className="omr-bridge-tr header" role="row">
              <span>BRIDGE FIELD</span><span>ONUMA NATIVE RECORD</span><span>TA-14 RECORD</span><span>SYNC RULE</span>
            </div>
            {bridgeRows.map(([field, onuma, ta14, rule]) => (
              <div className="omr-bridge-tr" role="row" key={field}>
                <span><code>{field}</code></span><span>{onuma}</span><span>{ta14}</span><span>{rule}</span>
              </div>
            ))}
          </div>

          <div className="omr-bridge-flow">
            <span>ONUMA NATIVE EVENT</span><b>→</b><span>SHARED EISO-1 REFERENCE</span><b>→</b><span>TA-14 EVIDENCE BINDING</span><b>→</b><span className="hold">HOLD</span><b>→</b><span>ONUMA PRESENTATION / NEXT STATE</span>
          </div>

          <div className="omr-bridge-bottom">
            <article>
              <small>WRITE DISCIPLINE</small>
              <strong>Append. Correlate. Challenge. Never clean up history.</strong>
              <p>A changed native state becomes a new referenced event. A TA-14 reevaluation becomes a new standing event. Neither side rewrites the other to make the story converge.</p>
            </article>
            <article>
              <small>PUBLIC REASONING STREAM</small>
              <strong>Short public exchanges may be preserved as provenance.</strong>
              <p>LinkedIn comments can document attributable questions, challenges and responses. They remain reasoning/provenance evidence unless separately bound to a native operational fact or admissibility determination.</p>
            </article>
            <article>
              <small>FOUNDING INTEROPERABILITY RULE</small>
              <strong>Different architectures. Same building reality. Inspectable boundaries.</strong>
              <p>The bridge exists to prove interoperability without architecture absorption, authority laundering, or retrospective reconciliation.</p>
            </article>
          </div>
        </div>
        <style>{`
          .omr-bridge-wrap{position:relative;overflow:hidden;background:#030b13;color:#f4f1e8;font-family:Arial,sans-serif;padding:0 20px 80px}
          .omr-bridge-grid{position:absolute;inset:0;opacity:.1;background-image:linear-gradient(#fff1 1px,transparent 1px),linear-gradient(90deg,#fff1 1px,transparent 1px);background-size:52px 52px;pointer-events:none}
          .omr-bridge-shell{position:relative;width:min(1400px,100%);margin:0 auto;border:1px solid #7edcf344;border-radius:24px;background:radial-gradient(circle at 50% 0,#2078951c,transparent 32%),#07131fdd;padding:40px}
          .omr-bridge-head{display:grid;grid-template-columns:1.45fr .55fr;gap:50px;align-items:center}
          .omr-bridge-eyebrow{color:#e9b84f;font-size:11px;font-weight:900;letter-spacing:.15em;margin:0}
          .omr-bridge-head h2{font-family:Georgia,serif;font-size:clamp(36px,4vw,58px);line-height:1;margin:10px 0 18px}
          .omr-bridge-lead{max-width:900px;color:#aebdca;font-size:16px;line-height:1.7}
          .omr-bridge-mark{border:1px solid #7edcf355;border-radius:18px;padding:26px;background:#081925}
          .omr-bridge-mark span,.omr-bridge-mark small{display:block;color:#8fa4b4;font-size:9px;font-weight:900;letter-spacing:.13em}
          .omr-bridge-mark strong{display:block;color:#7edcf3;font-size:34px;margin:8px 0}
          .omr-bridge-architecture{display:grid;grid-template-columns:1fr 260px 1fr;gap:18px;align-items:stretch;margin-top:30px}
          .omr-bridge-architecture article{padding:26px;border:1px solid #ffffff18;border-radius:17px;background:#091927}
          .omr-bridge-architecture article.ta14{border-color:#e9b84f55}
          .omr-bridge-architecture small,.omr-bridge-bottom small{color:#8fa4b4;font-size:9px;font-weight:900;letter-spacing:.13em}
          .omr-bridge-architecture article>strong{display:block;font-family:Georgia,serif;font-size:24px;margin:10px 0}
          .omr-bridge-architecture p,.omr-bridge-bottom p{color:#9fb0bc;line-height:1.55}
          .omr-public-link{display:inline-block;margin:4px 0 16px;color:#7edcf3;text-decoration:none;font-size:10px;font-weight:900;letter-spacing:.09em;border-bottom:1px solid #7edcf366;padding-bottom:4px}
          .omr-public-link:hover{color:#bdefff;border-bottom-color:#bdefff}
          .omr-bridge-architecture article>b{display:block;margin-top:8px;color:#7edcf3;font-size:9px;letter-spacing:.12em}
          .omr-bridge-architecture .ta14>b{color:#e9b84f}
          .omr-bridge-core{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;border:1px solid #ffffff18;border-radius:17px;background:#06111c;padding:20px}
          .omr-bridge-core>span{font-size:44px;color:#7edcf3}.omr-bridge-core strong{font-size:11px;letter-spacing:.11em}.omr-bridge-core em{margin-top:10px;color:#e9b84f;font-size:10px;font-style:normal;font-weight:900}
          .omr-bridge-rule{margin-top:18px;padding:20px 22px;border:1px solid #ff675b66;border-radius:15px;background:#2b1419;display:flex;gap:22px;align-items:center}
          .omr-bridge-rule strong{color:#ff756b;font-size:18px}.omr-bridge-rule span{color:#c0cbd1;line-height:1.5}
          .omr-bridge-table{margin-top:22px;border:1px solid #ffffff17;border-radius:16px;overflow:auto}
          .omr-bridge-tr{min-width:980px;display:grid;grid-template-columns:1fr 1.45fr 1.45fr 1fr;border-bottom:1px solid #ffffff12}
          .omr-bridge-tr span{padding:13px 14px;color:#afbec8;font-size:11px;line-height:1.4}.omr-bridge-tr code{color:#7edcf3;font-size:10px}
          .omr-bridge-tr.header{background:#0d2130}.omr-bridge-tr.header span{color:#8299a7;font-size:9px;font-weight:900;letter-spacing:.1em}
          .omr-bridge-flow{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;margin-top:22px;padding:18px;border:1px solid #e9b84f44;border-radius:15px}
          .omr-bridge-flow span{padding:9px 12px;border:1px solid #ffffff18;border-radius:99px;font-size:9px;font-weight:900}.omr-bridge-flow b{color:#7edcf3}.omr-bridge-flow .hold{border-color:#ff675b;color:#ff675b;background:#301518}
          .omr-bridge-bottom{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:22px}
          .omr-bridge-bottom article{padding:22px;border:1px solid #ffffff18;border-radius:15px;background:#091725}
          .omr-bridge-bottom strong{display:block;margin:9px 0;font-family:Georgia,serif;font-size:20px;line-height:1.2}
          @media(max-width:900px){.omr-bridge-head,.omr-bridge-architecture{grid-template-columns:1fr}.omr-bridge-core{min-height:150px}.omr-bridge-bottom{grid-template-columns:1fr}.omr-bridge-rule{align-items:flex-start;flex-direction:column}}
          @media(max-width:600px){.omr-bridge-wrap{padding:0 10px 50px}.omr-bridge-shell{padding:24px}.omr-bridge-head h2{font-size:36px}}
        `}</style>
      </section>
    </>
  );
}
