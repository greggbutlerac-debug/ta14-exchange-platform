import Link from "next/link";

export const metadata = {
  title: "Evidence Before Intervention Blueprint | TA-14 Academy HVAC",
  description: "TA-14 Evidence Before Intervention - HVAC Service Competency & Assessment Blueprint v0.2.",
};

const domains = [
  ["Sequence", "15%", "Follow the governed service order and preserve prerequisite evidence before moving forward."],
  ["HVAC Performance Record", "20%", "Create and preserve the original-state baseline before consequence-bearing intervention."],
  ["NIRET", "20%", "Satisfy the Non-Invasive Refrigerant Entry Threshold before invasive refrigerant entry."],
  ["Declared Diagnostic Determination", "15%", "State the evidence-supported determination before intervention, including limits and unresolved conditions."],
  ["Evidence-Based Intervention", "15%", "Perform only the action supported by the preserved evidence and declared determination."],
  ["HVAC Post-Performance Record", "15%", "Create the post-state record and compare it directly against the original HVAC Performance Record."],
];

const criticalFailures = [
  "Creating a consequential intervention before the original HVAC Performance Record is preserved.",
  "Entering the refrigerant system before the applicable NIRET is satisfied.",
  "Fabricating, backfilling, reconstructing, or silently changing baseline evidence.",
  "Failing to declare the diagnostic determination before intervention.",
  "Performing an intervention materially unsupported by the evidence or declared determination.",
  "Claiming improvement without a comparable HVAC Post-Performance Record.",
  "Creating an unsafe condition or violating applicable safety or legal requirements.",
];

const proofChain = [
  "Sequence",
  "HVAC Performance Record / Baseline",
  "NIRET",
  "Declared Diagnostic Determination",
  "Evidence-Based Intervention",
  "HVAC Post-Performance Record",
];

export default function HvacBlueprintPage() {
  return (
    <main className="blueprintPage">
      <div className="shell">
        <nav>
          <Link href="/academy/hvac">← HVAC WORLD</Link>
          <Link href="/academy">TA-14 ACADEMY</Link>
        </nav>

        <header>
          <small>TA-14 ACADEMY // HVAC // ACADEMY-GROUNDED ARTIFACT</small>
          <h1>Evidence Before Intervention</h1>
          <p>HVAC Service Competency & Assessment Blueprint v0.2</p>
          <div className="actions">
            <a href="/academy/hvac/blueprint/TA14_Evidence_Before_Intervention_HVAC_Service_Competency_Assessment_Blueprint_v0_2.pdf" download>DOWNLOAD v0.2 PDF</a>
            <Link href="/atlas-608-refrigerant-ops-lab/campaign">01 · EPA 608 READINESS</Link>
            <Link href="/atlas-14-step-field-ops-lab">02 · RUN 7 IN / 7 OUT</Link>
          </div>
        </header>

        <section className="principle">
          <b>Evidence first. Truth preserved. Intervention earned.</b>
          <span>The technician must prove the progression from original system state, through justified refrigerant entry and a declared diagnostic determination, to an intervention whose outcome is verified against the preserved baseline.</span>
        </section>

        <section className="practiceBridge">
          <div><small>BLUEPRINT → LIVE PRACTICE</small><h2>The competency now has two playable proving grounds.</h2><p>Use EPA 608 Refrigerant Ops to build refrigerant readiness, then enter the TA-14 14-Step Field Ops Lab to practice the complete 7-In / 7-Out evidence-before-intervention sequence.</p></div>
          <div className="practiceActions"><Link href="/atlas-608-refrigerant-ops-lab/campaign">EPA 608 ARCADE →</Link><Link href="/atlas-14-step-field-ops-lab">TA-14 14-STEP →</Link></div>
        </section>

        <section><div className="sectionHead"><span>01</span><h2>The six canonical proof elements</h2></div><div className="proofChain">{proofChain.map((item,index)=><div key={item}><b>{String(index+1).padStart(2,"0")}</b><span>{item}</span></div>)}</div></section>
        <section><div className="sectionHead"><span>02</span><h2>Assessment domains</h2></div><div className="domainGrid">{domains.map(([name,weight,copy])=><article key={name}><div><strong>{weight}</strong><small>WEIGHT</small></div><h3>{name}</h3><p>{copy}</p></article>)}</div></section>
        <section className="niret"><div className="sectionHead"><span>03</span><h2>NIRET boundary</h2></div><div className="niretBox"><strong>Non-Invasive Refrigerant Entry Threshold</strong><p>Refrigerant-system entry is not treated as a neutral first diagnostic step. The candidate must demonstrate that the current TA-14 Academy NIRET has been satisfied before attaching gauges or otherwise crossing the invasive refrigerant boundary.</p><small>The assessment must use the current Academy NIRET standard. This blueprint does not invent or silently redefine the threshold.</small></div></section>
        <section><div className="sectionHead"><span>04</span><h2>Critical-failure boundary</h2></div><p className="lead">A passing aggregate score cannot override a critical failure. The credential fails closed when the candidate breaks the evidence-before-intervention chain.</p><div className="failureGrid">{criticalFailures.map((failure,index)=><div key={failure}><b>{String(index+1).padStart(2,"0")}</b><span>{failure}</span></div>)}</div></section>
        <section><div className="sectionHead"><span>05</span><h2>Candidate evidence record</h2></div><div className="recordFlow">{["Candidate / session identity","Equipment / system identity","Sequence execution record","Original HVAC Performance Record","NIRET evidence set and entry decision","Declared Diagnostic Determination","Intervention scope","Intervention execution record","HVAC Post-Performance Record","Baseline-to-post comparison","Outcome statement","Assessor scoring / critical-failure review"].map((item,index)=><div key={item}><b>{index+1}</b><span>{item}</span></div>)}</div></section>
        <section className="comparison"><div className="sectionHead"><span>06</span><h2>Close the performance loop</h2></div><div className="compareGrid"><article><small>ORIGINAL STATE</small><h3>HVAC Performance Record</h3><p>Preserved before intervention. This is the baseline against which the service outcome will be judged.</p></article><div className="arrow">→</div><article><small>POST-INTERVENTION STATE</small><h3>HVAC Post-Performance Record</h3><p>Comparable measurements after intervention establish whether performance improved, was restored, remained unchanged, degraded, or remains unresolved.</p></article></div></section>
        <section className="independence"><div className="sectionHead"><span>07</span><h2>Credential separation</h2></div><div className="split"><article><small>TA-14 ACADEMY</small><h3>Teach the competency</h3><p>Sequence, simulations, evidence discipline, NIRET reasoning, stop rules, labs, and candidate preparation.</p></article><div className="arrow">→</div><article><small>INDEPENDENT ASSESSMENT PATHWAY</small><h3>Determine the credential</h3><p>A mature pathway should preserve independence between instruction and final credential determination wherever feasible.</p></article></div></section>

        <footer><p>Sequence → Baseline → NIRET → Determination → Intervention → Post-Performance Record.</p><div className="footerActions"><Link href="/atlas-14-step-field-ops-lab">PRACTICE THE 14-STEP ROUTE →</Link><a href="/academy/hvac/blueprint/TA14_Evidence_Before_Intervention_HVAC_Service_Competency_Assessment_Blueprint_v0_2.pdf" download>DOWNLOAD FULL v0.2 PDF →</a></div></footer>
      </div>

      <style>{`
        .blueprintPage{min-height:100vh;color:#122434;background:linear-gradient(180deg,#f6fbfe,#fff);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.blueprintPage *{box-sizing:border-box}.shell{width:min(1120px,calc(100% - 40px));margin:0 auto;padding:24px 0 70px}nav{display:flex;justify-content:space-between;gap:20px;padding-bottom:22px;border-bottom:1px solid #d7e5ee}nav a{color:#16728c;text-decoration:none;font-size:.7rem;font-weight:950;letter-spacing:.1em}header{padding:72px 0 52px;max-width:920px}header small{color:#1683a1;font-weight:950;letter-spacing:.14em}header h1{margin:12px 0 6px;font-size:clamp(3rem,8vw,6.6rem);line-height:.9;letter-spacing:-.055em;color:#071b2b}header p{font-size:1.35rem;color:#61798a}.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}.actions a,footer a,.practiceActions a{padding:13px 16px;border-radius:10px;text-decoration:none;font-size:.68rem;font-weight:950;letter-spacing:.08em}.actions a:first-child,footer a:last-child{color:#fff;background:#09283b}.actions a:nth-child(2){color:#0b694a;border:1px solid #9edfc4;background:#effbf5}.actions a:nth-child(3){color:#075c77;border:1px solid #9edbec;background:#eaf9fd}.principle{display:grid;grid-template-columns:.8fr 1.5fr;gap:28px;padding:25px 28px;border:1px solid #9edbec;border-left:5px solid #29bce5;border-radius:14px;background:#eaf9fd}.principle b{font-size:1.25rem;color:#082b3c}.principle span{color:#4d6879;line-height:1.6}.practiceBridge{display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center;padding:26px 28px;border:1px solid #a9d9c3;border-radius:16px;background:#f0fbf5}.practiceBridge small{color:#0b7954;font-weight:950;letter-spacing:.12em}.practiceBridge h2{margin:8px 0;font-size:1.55rem}.practiceBridge p{max-width:720px;margin:0;color:#4c6c5d;line-height:1.6}.practiceActions{display:flex;flex-direction:column;gap:9px}.practiceActions a{white-space:nowrap;color:#0b694a;border:1px solid #9edfc4;background:#fff}
        section{margin-top:64px}.sectionHead{display:flex;align-items:center;gap:14px;margin-bottom:22px}.sectionHead span{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;color:#0e7795;background:#e4f7fc;font-size:.7rem;font-weight:950}.sectionHead h2{margin:0;font-size:1.8rem;color:#071b2b}.proofChain{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}.proofChain div{min-height:125px;padding:14px;border:1px solid #cfe2eb;border-radius:14px;background:#fff}.proofChain b{color:#16a1c5;font-size:.72rem}.proofChain span{display:block;margin-top:28px;font-size:.8rem;font-weight:900;line-height:1.35}.domainGrid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}.domainGrid article{grid-column:span 2;min-height:220px;padding:20px;border:1px solid #d6e4ec;border-radius:16px;background:#fff;box-shadow:0 14px 40px rgba(28,68,90,.06)}.domainGrid article>div{display:flex;justify-content:space-between;align-items:baseline}.domainGrid strong{font-size:1.6rem;color:#0e7997}.domainGrid small{font-size:.6rem;font-weight:950;letter-spacing:.1em;color:#7b929f}.domainGrid h3{margin:40px 0 10px;font-size:1.05rem}.domainGrid p,.lead,.split p,.compareGrid p{color:#607786;line-height:1.6}.niretBox{padding:26px 28px;border:1px solid #a9d9c3;border-left:5px solid #2aab74;border-radius:14px;background:#f0fbf5}.niretBox strong{font-size:1.3rem;color:#0b5f43}.niretBox p{color:#466a5a;line-height:1.65}.niretBox small{display:block;color:#6c887b;font-weight:750}.failureGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.failureGrid div{display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:start;padding:16px;border:1px solid #efd3d5;border-radius:12px;background:#fff8f8}.failureGrid b{color:#b7434b}.failureGrid span{font-size:.88rem;line-height:1.5;color:#624f54}.recordFlow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.recordFlow div{min-height:100px;padding:13px;border:1px solid #d7e5ed;border-radius:12px;background:#fff}.recordFlow b{display:block;color:#19a0c4;font-size:.68rem}.recordFlow span{display:block;margin-top:20px;font-size:.78rem;font-weight:800}.split,.compareGrid{display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:center}.split article,.compareGrid article{padding:24px;border:1px solid #d7e5ed;border-radius:16px;background:#fff}.split small,.compareGrid small{color:#1683a1;font-weight:950;letter-spacing:.1em}.split h3,.compareGrid h3{margin:10px 0 6px;font-size:1.3rem}.arrow{font-size:2rem;color:#20a8cd}footer{display:flex;justify-content:space-between;gap:30px;align-items:center;margin-top:70px;padding:30px 0;border-top:1px solid #d7e5ed}footer p{font-weight:850;color:#385364}.footerActions{display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end}.footerActions a:first-child{color:#075c77;border:1px solid #9edbec;background:#eaf9fd}.footerActions a:last-child{white-space:nowrap}
        @media(max-width:820px){.principle,.practiceBridge{grid-template-columns:1fr}.proofChain{grid-template-columns:1fr 1fr}.domainGrid{grid-template-columns:1fr}.domainGrid article{grid-column:auto}.failureGrid{grid-template-columns:1fr}.recordFlow{grid-template-columns:1fr 1fr}.split,.compareGrid{grid-template-columns:1fr}.arrow{transform:rotate(90deg);justify-self:center}footer{align-items:flex-start;flex-direction:column}.footerActions{justify-content:flex-start}}
        @media(max-width:520px){.shell{width:min(100% - 24px,1120px)}header{padding-top:50px}.proofChain,.recordFlow{grid-template-columns:1fr}nav{align-items:flex-start;flex-direction:column}.practiceActions{width:100%}.practiceActions a{text-align:center}}
      `}</style>
    </main>
  );
}
