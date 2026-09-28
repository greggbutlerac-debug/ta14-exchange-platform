import Link from "next/link";

export const metadata = {
  title: "HABITS × TA-14 R1 Final Result | TA-14 Exchange",
  description: "Bilaterally preserved R1 result establishing bounded interface-state interoperability at the tested HABITS × TA-14 determination-state seam."
};

const established = [
  "Bidirectional transport",
  "Object identity / provenance preservation",
  "Attribution preservation",
  "Inspectable cross-architecture context",
  "Material UNKNOWN preservation",
  "Freshness / currentness preservation",
  "Continuity preservation",
  "Consequence binding preservation"
];

const notEstablished = [
  "Authority transfer",
  "Determination transfer",
  "Execution authority transfer"
];

export default function Page() {
  return <main className="page"><div className="wrap">
    <nav>
      <Link href="/">TA-14 EXCHANGE</Link>
      <div><Link href="/governance-showcase/TA-14-AIGR-000044">HABITS GOVERNANCE</Link><Link href="/showrooms/artifacts-examination-records">ARTIFACT RECORDS</Link></div>
    </nav>

    <header>
      <p className="eyebrow">HABITS × TA-14 · INTEROPERABILITY EXAMINATION · R1</p>
      <div className="status">v1.0-PRESERVED · BILATERALLY CONFIRMED</div>
      <h1>Two architectures.<br/><em>One tested seam.</em></h1>
      <p className="lede">R1 tested whether HABITS and TA-14 could transport and recognize independently attributable determination state across a frozen interface without either architecture inheriting the other's authority or determination.</p>
      <div className="result"><small>R1 RESULT</small><strong>BOUNDED INTERFACE-STATE INTEROPERABILITY ESTABLISHED FOR THE TESTED R1 OBJECTS, FIELDS, DIRECTIONS AND FROZEN INTERFACE CONDITIONS.</strong></div>
    </header>

    <section>
      <p className="eyebrow">THE TESTED SEAM</p>
      <h2>Recognition without adoption.</h2>
      <div className="crossing">
        <article><span>HABITS → TA-14</span><h3>UAB: HOLD crossed.</h3><p>TA-14 received the HABITS determination as independently attributable context. Receipt did not convert it into a TA-14 determination, Admissible Evidence, Applicable Authority or Established Standing.</p></article>
        <div className="seam">RECEIPT<br/>≠<br/>ACCEPTANCE</div>
        <article><span>TA-14 → HABITS</span><h3>TA-14: HOLD crossed.</h3><p>HABITS received the TA-14 determination as attributable context. It did not become a HABITS determination, PAF standing, represented site-specific DAS, governance authorization or execution authority.</p></article>
      </div>
    </section>

    <section>
      <p className="eyebrow">WHAT R1 ESTABLISHED</p>
      <h2>The state could cross. The authority did not.</h2>
      <div className="grid">{established.map(x=><article key={x}><b>ESTABLISHED</b><p>{x}</p></article>)}</div>
      <div className="independence"><div><small>LOCAL DETERMINATION INDEPENDENCE AT RECEIPT</small><strong>PRESERVED</strong></div><div><small>LOCAL AUTHORITY INDEPENDENCE AT RECEIPT</small><strong>PRESERVED</strong></div></div>
    </section>

    <section>
      <p className="eyebrow">WHAT DID NOT CROSS</p>
      <div className="grid three">{notEstablished.map(x=><article key={x} className="no"><b>NOT ESTABLISHED</b><p>{x}</p></article>)}</div>
      <div className="rules"><b>R1 SUCCESS ≠ GENERAL INTEROPERABILITY.</b><b>TRANSPORT ≠ AUTHORITY TRANSFER.</b><b>RECOGNITION ≠ ADOPTION.</b><b>CONVERGENCE ≠ DERIVATION.</b></div>
    </section>

    <section>
      <p className="eyebrow">DYNAMIC-INDEPENDENCE BOUNDARY</p>
      <h2>R1 stops exactly where the evidence stops.</h2>
      <div className="boundary"><div><small>INDEPENDENCE AT RECEIPT</small><strong>ESTABLISHED</strong></div><div><small>INDEPENDENCE UNDER SUBSEQUENT STATE CHANGE</small><strong>NOT YET TESTED</strong></div></div>
      <p className="note">R1 did not test later disagreement, staleness, changed evidence, changed authority, changed standing, changed freshness or changed consequence state. Any such examination must be separately constituted and cannot modify the preserved R1 result.</p>
    </section>

    <section>
      <p className="eyebrow">CENTRAL R1 FINDING</p>
      <blockquote>THE TWO ARCHITECTURES DID NOT HAVE TO BECOME ONE ARCHITECTURE IN ORDER TO INTEROPERATE AT THE TESTED DETERMINATION-STATE SEAM.</blockquote>
    </section>

    <section>
      <p className="eyebrow">PRESERVED RECORD</p>
      <div className="record">
        <div><small>RECORD</small><strong>HABITS × TA-14 INTEROPERABILITY EXAMINATION — R1 FINAL RESULT RECORD — v1.0-PRESERVED</strong></div>
        <div><small>STATUS</small><strong>BILATERALLY CONFIRMED / PRESERVED · R1 CLOSED</strong></div>
        <div><small>PRESERVATION TIMESTAMP</small><strong>28 September 2026 — 21:19:50 AEST (UTC+10:00), Australia/Sydney</strong></div>
        <div><small>FINAL PDF SHA-256</small><code>9e1e8832239a13f1e72be4e3fcef983c3879ce8912e321b24c1f19505d81bcb6</code></div>
      </div>
      <div className="discipline"><b>CONSOLIDATION ≠ REINTERPRETATION.</b><b>PRESERVATION ≠ EXPANSION.</b></div>
    </section>

    <footer><div><b>R1: CLOSED</b><p>This public showroom describes the preserved bilateral result. It does not reopen, expand or reinterpret R1.</p></div><Link href="/habits-ta14-interoperability">VIEW THE EXAMINATION LAB →</Link></footer>
  </div><style>{`
    *{box-sizing:border-box}body{margin:0}.page{min-height:100vh;background:radial-gradient(circle at 12% 0,#173c5f66,transparent 28%),radial-gradient(circle at 88% 8%,#73552244,transparent 26%),linear-gradient(180deg,#02070c,#071522 55%,#02070c);color:#eef6fb;font-family:Arial,sans-serif}.wrap{width:min(1180px,calc(100% - 34px));margin:auto}nav{min-height:76px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff17}nav div{display:flex;gap:18px}a{color:#8ddcff;text-decoration:none;font-size:10px;font-weight:950;letter-spacing:.09em}header{padding:90px 0 70px}.eyebrow{color:#efc86c;font-size:10px;font-weight:950;letter-spacing:.17em}.status{display:inline-block;margin-top:18px;padding:9px 12px;border:1px solid #7ff0bd55;border-radius:999px;color:#7ff0bd;font-size:9px;font-weight:950;letter-spacing:.1em}h1{font:clamp(55px,8vw,100px)/.94 Georgia,serif;letter-spacing:-.045em;margin:24px 0}h1 em{color:#efc86c;font-weight:400}.lede{max-width:920px;color:#a7bdca;font-size:19px;line-height:1.7}.result{margin-top:35px;max-width:1000px;padding:23px;border:1px solid #7ff0bd55;border-radius:16px;background:#7ff0bd09}.result small,.record small,.boundary small,.independence small{display:block;color:#829dab;font-size:8px;font-weight:950;letter-spacing:.13em;margin-bottom:8px}.result strong{color:#bdf8dc;line-height:1.55;font-size:13px}section{padding:65px 0;border-top:1px solid #ffffff14}h2{font:clamp(35px,5vw,60px)/1.04 Georgia,serif;margin:12px 0 30px}.crossing{display:grid;grid-template-columns:1fr 120px 1fr;gap:14px}.crossing article,.grid article{padding:25px;border:1px solid #ffffff18;border-radius:17px;background:#06121c}.crossing span,.grid b{color:#8ddcff;font-size:9px;font-weight:950;letter-spacing:.12em}.crossing h3{font:28px Georgia,serif;margin:12px 0}.crossing p,.grid p,.note,footer p{color:#9db3c0;line-height:1.65}.seam{display:grid;place-items:center;text-align:center;color:#efc86c;font-size:10px;font-weight:950;line-height:1.7}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.grid article p{margin-bottom:0;font-weight:800}.grid.three{grid-template-columns:repeat(3,1fr)}.grid .no{border-color:#efc86c44}.grid .no b{color:#efc86c}.independence,.boundary{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.independence div,.boundary div,.record>div{padding:20px;border:1px solid #ffffff17;border-radius:13px;background:#030b12}.independence strong,.boundary strong{color:#7ff0bd}.boundary div:last-child strong{color:#efc86c}.rules,.discipline{display:flex;gap:9px;flex-wrap:wrap;margin-top:18px}.rules b,.discipline b{padding:10px 12px;border:1px solid #efc86c33;border-radius:999px;color:#efc86c;font-size:9px}blockquote{margin:20px 0;padding:35px;border-left:3px solid #efc86c;background:#efc86c08;font:clamp(27px,4vw,47px)/1.22 Georgia,serif;color:#f1dfb4}.record{display:grid;gap:8px}.record strong,.record code{font-size:12px;line-height:1.55;color:#d8e7ee;overflow-wrap:anywhere}footer{padding:40px 0 70px;border-top:1px solid #ffffff18;display:flex;justify-content:space-between;gap:25px;align-items:center}footer b{color:#7ff0bd;letter-spacing:.1em}@media(max-width:800px){nav,footer{align-items:flex-start;flex-direction:column;padding:22px 0}.crossing,.grid,.grid.three,.independence,.boundary{grid-template-columns:1fr}.seam{min-height:70px}nav div{flex-wrap:wrap}}
  `}</style></main>
}