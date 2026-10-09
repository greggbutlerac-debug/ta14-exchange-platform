import Link from "next/link";

export const metadata = {
  title: "Evidence Before Intervention Blueprint | TA-14 Academy HVAC",
  description: "TA-14 Evidence Before Intervention - HVAC Service Competency & Assessment Blueprint v0.2.",
};

const domains = [
  ["Sequence + Non-Invasive Evidence", "20%", "Preserve the governed order and establish operating reality before invasive disturbance."],
  ["NIRET + Original-State Record", "20%", "Apply NIRET inside baseline establishment and preserve refrigerant-side evidence only when entry is justified."],
  ["Declared Diagnostic Determination", "15%", "State what the evidence establishes, what it does not establish, and remaining uncertainty before intervention."],
  ["Evidence-Based Intervention", "15%", "Execute only an intervention supported by evidence and within separately established applicable authority."],
  ["HVAC Post-Performance Record", "15%", "Capture the post-intervention state using comparable methods, points, units, and operating conditions."],
  ["Proof of Performance", "15%", "Compare original-state and post-performance records and issue the supported verified outcome."],
];

const criticalFailures = [
  "Creating a consequential intervention before the original HVAC Performance Record is preserved.",
  "Entering the refrigerant system before the applicable NIRET is satisfied.",
  "Fabricating, backfilling, reconstructing, or silently changing baseline evidence.",
  "Failing to declare the diagnostic determination before intervention.",
  "Performing an intervention materially unsupported by the evidence or declared determination.",
  "Claiming improvement from a post-performance record alone, without Proof of Performance against the preserved original state.",
  "Creating an unsafe condition or violating applicable safety or legal requirements.",
];

const proofChain = [
  "Sequence",
  "Non-Invasive Evidence",
  "NIRET",
  "Refrigerant-Side Evidence (if justified)",
  "Original-State HVAC Performance Record",
  "Declared Diagnostic Determination",
  "Evidence-Based Intervention",
  "HVAC Post-Performance Record",
  "Proof of Performance",
];

const teachingImages = [
  ["00", "Evidence Before Intervention", "/HVAC Evidence-First Service Sequence Poster (1).png"],
  ["01", "Sequence", "/HVAC Sequence_ Evidence Before Intervention.png"],
  ["02", "Original-State Baseline", "/Original-State HVAC Baseline Infographic.png"],
  ["03", "NIRET", "/HVAC NIRET Decision Flow Infographic.png"],
  ["04", "Refrigerant-Side Evidence — if justified", "/Refrigerant-Side HVAC Evidence Baseline.png"],
  ["05", "Original-State Established", "/HVAC Evidence-to-Outcome Sequence Summary.png"],
  ["06", "Declared Diagnostic Determination", "/HVAC Evidence-Based Diagnostic Workflow (1).png"],
  ["07", "Evidence-Based Intervention", "/Evidence-Based HVAC Intervention Workflow.png"],
  ["08", "HVAC Post-Performance Record", "/HVAC Post-Performance Record Infographic.png"],
  ["09", "Proof of Performance", "/HVAC Proof of Performance Workflow.png"],
  ["10", "Complete Governed Sequence", "/Complete HVAC Evidence-to-Outcome Sequence.png"],
];

const lessonGuides = [
  ["This opening image introduces the whole method. A service call is not permission to change a system.","Explain why a technician must preserve the original state before disturbing equipment.","Next: establish the sequence that keeps observation ahead of intervention."],
  ["Sequence is the order of operations, not proof by itself. Record what was observed and when.","Identify the next permissible investigative step without skipping prerequisite evidence.","Next: gather non-invasive measurements while the original operating state is intact."],
  ["Build the baseline from observations such as operating conditions, airflow, temperatures, controls, and electrical evidence.","Separate what was actually measured from what is only suspected.","Next: use that preserved evidence to evaluate whether refrigerant-system entry is necessary."],
  ["NIRET is a threshold for evidential necessity, not a grant of execution authority.","Explain what non-invasive evidence supports entry—or why entry should be avoided.","Next: if entry is justified and separately authorized, capture refrigerant-side evidence."],
  ["Refrigerant pressures, saturation temperatures, superheat, and subcooling require appropriate system access.","Record conditions and measurements without treating refrigerant data as automatically required.","Next: combine justified observations into the preserved original-state performance record."],
  ["The original-state HVAC Performance Record is the baseline against which later results can be compared.","Check that sources, units, methods, timestamps, and uncertainty are preserved.","Next: declare what this evidence actually establishes before proposing a change."],
  ["A declared diagnostic determination states the supported finding, its limits, and unresolved uncertainty.","Distinguish evidence-supported determination from assumption; a determination does not grant authority.","Next: evaluate a bounded intervention under applicable authority and established standing."],
  ["The intervention must match the preserved evidence, declared determination, approved scope, and applicable authority.","Identify the action, safety controls, scope limits, and execution record; stop if conditions change.","Next: capture the system's new operating state without rewriting the original record."],
  ["The post-performance record documents what the system did after intervention.","Capture comparable operating conditions, points, methods, and units.","Next: compare the two records; the post-state record alone is not proof of improvement."],
  ["Proof of Performance is the supported comparison between original and post-intervention records.","Determine whether the evidence supports IMPROVED, RESTORED, UNCHANGED, DEGRADED, or UNRESOLVED.","Next: examine the complete chain and verify whether the outcome claim is warranted."],
  ["This closing image brings observation, evidence, authority, intervention, comparison, and outcome together.","Trace the complete record and identify any unsupported leap or missing authority.","Return to the field lab to practice the method, then use assessment to demonstrate competency."],
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
          <span>The technician must establish and preserve the original system state before disturbance, use NIRET to determine whether refrigerant-side entry is evidentially necessary, declare what the evidence supports, intervene only within established authority, and prove the result by comparing the post-performance record to the preserved original state.</span>
        </section>

        <section className="practiceBridge">
          <div><small>BLUEPRINT → LIVE PRACTICE</small><h2>The competency now has two playable proving grounds.</h2><p>Use EPA 608 Refrigerant Ops to build refrigerant readiness, then enter the TA-14 14-Step Field Ops Lab to practice the complete 7-In / 7-Out evidence-before-intervention sequence.</p></div>
          <div className="practiceActions"><Link href="/atlas-608-refrigerant-ops-lab/campaign">EPA 608 ARCADE →</Link><Link href="/atlas-14-step-field-ops-lab">TA-14 14-STEP →</Link></div>
        </section>

        <section><div className="sectionHead"><span>01</span><h2>The nine proof elements</h2></div><p className="lead">The original state is established before consequence-bearing intervention. NIRET belongs inside that baseline process: non-invasive evidence determines whether refrigerant-side entry is evidentially necessary. Evidence may justify an action; applicable authority and standing must still be established.</p><div className="proofChain">{proofChain.map((item,index)=><div key={item}><b>{String(index+1).padStart(2,"0")}</b><span>{item}</span></div>)}</div></section>
        <section className="teachingSequence"><div className="sectionHead"><span>02</span><h2>Learn the complete evidence-to-outcome sequence</h2></div><p className="lead">Move through the visuals in order. Each image teaches one boundary in the field method. The final image closes the chain from observation to verified outcome.</p><div className="teachingGrid">{teachingImages.map(([number,title,src],index)=><article key={number}><div className="imageLabel"><b>{number}</b><span>{title}</span></div><img src={src} alt={`TA-14 HVAC teaching visual ${number}: ${title}`} loading={number==="00"?"eager":"lazy"} /><div className="lessonGuide"><small>AFTER THE IMAGE · WHAT YOU JUST LEARNED</small><p>{lessonGuides[index][0]}</p><strong>CHECK YOUR UNDERSTANDING</strong><p>{lessonGuides[index][1]}</p><div className="nextLesson"><span>{lessonGuides[index][2]}</span>{index<teachingImages.length-1&&<b>↓</b>}</div></div></article>)}</div></section>
        <section><div className="sectionHead"><span>03</span><h2>Assessment domains</h2></div><div className="domainGrid">{domains.map(([name,weight,copy])=><article key={name}><div><strong>{weight}</strong><small>WEIGHT</small></div><h3>{name}</h3><p>{copy}</p></article>)}</div></section>
        <section className="niret"><div className="sectionHead"><span>04</span><h2>NIRET inside the original-state baseline</h2></div><div className="niretBox"><strong>Non-Invasive Refrigerant Entry Threshold</strong><p>NIRET is part of establishing the original-state baseline. The technician first preserves non-invasive operating evidence. If that evidence supports refrigerant-system entry, refrigerant-side measurements are added to the original-state record. If it does not, unnecessary intrusion is avoided. NIRET does not itself create execution authority.</p><small>The assessment must use the current Academy NIRET standard. This blueprint does not invent or silently redefine the threshold.</small></div></section>
        <section><div className="sectionHead"><span>05</span><h2>Critical-failure boundary</h2></div><p className="lead">A passing aggregate score cannot override a critical failure. The credential fails closed when the candidate breaks the evidence-before-intervention chain.</p><div className="failureGrid">{criticalFailures.map((failure,index)=><div key={failure}><b>{String(index+1).padStart(2,"0")}</b><span>{failure}</span></div>)}</div></section>
        <section><div className="sectionHead"><span>06</span><h2>Candidate evidence record</h2></div><div className="recordFlow">{["Candidate / session identity","Equipment / system identity","Sequence execution record","Original HVAC Performance Record","NIRET evidence set and entry decision","Declared Diagnostic Determination","Intervention scope","Intervention execution record","HVAC Post-Performance Record","Proof of Performance — original-state to post-performance comparison","Verified outcome / disposition","Assessor scoring / critical-failure review"].map((item,index)=><div key={item}><b>{index+1}</b><span>{item}</span></div>)}</div></section>
        <section className="comparison"><div className="sectionHead"><span>07</span><h2>Close the performance loop with Proof of Performance</h2></div><div className="compareGrid"><article><small>ORIGINAL STATE</small><h3>HVAC Performance Record</h3><p>Preserved before intervention. This is the baseline against which the service outcome will be judged.</p></article><div className="arrow">→</div><article><small>POST-INTERVENTION STATE</small><h3>HVAC Post-Performance Record</h3><p>The post-performance record establishes the new state. Proof of Performance comes from comparing it with the preserved original-state record under comparable methods and conditions, producing an outcome of IMPROVED, RESTORED, UNCHANGED, DEGRADED, or UNRESOLVED.</p></article></div></section>
        <section className="independence"><div className="sectionHead"><span>08</span><h2>Credential separation</h2></div><div className="split"><article><small>TA-14 ACADEMY</small><h3>Teach the competency</h3><p>Sequence, simulations, evidence discipline, NIRET reasoning, stop rules, labs, and candidate preparation.</p></article><div className="arrow">→</div><article><small>INDEPENDENT ASSESSMENT PATHWAY</small><h3>Determine the credential</h3><p>A mature pathway should preserve independence between instruction and final credential determination wherever feasible.</p></article></div></section>

        <footer><p>Sequence → Non-Invasive Evidence → NIRET → Refrigerant-Side Evidence (if justified) → Original-State HVAC Performance Record → Declared Diagnostic Determination → Evidence-Based Intervention → HVAC Post-Performance Record → Proof of Performance → Verified Outcome.</p><div className="footerActions"><Link href="/atlas-14-step-field-ops-lab">PRACTICE THE 14-STEP ROUTE →</Link><a href="/academy/hvac/blueprint/TA14_Evidence_Before_Intervention_HVAC_Service_Competency_Assessment_Blueprint_v0_2.pdf" download>DOWNLOAD FULL v0.2 PDF →</a></div></footer>
      </div>

      <style>{`
        .blueprintPage{min-height:100vh;color:#122434;background:linear-gradient(180deg,#f6fbfe,#fff);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.blueprintPage *{box-sizing:border-box}.shell{width:min(1120px,calc(100% - 40px));margin:0 auto;padding:24px 0 70px}nav{display:flex;justify-content:space-between;gap:20px;padding-bottom:22px;border-bottom:1px solid #d7e5ee}nav a{color:#16728c;text-decoration:none;font-size:.7rem;font-weight:950;letter-spacing:.1em}header{padding:72px 0 52px;max-width:920px}header small{color:#1683a1;font-weight:950;letter-spacing:.14em}header h1{margin:12px 0 6px;font-size:clamp(3rem,8vw,6.6rem);line-height:.9;letter-spacing:-.055em;color:#071b2b}header p{font-size:1.35rem;color:#61798a}.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}.actions a,footer a,.practiceActions a{padding:13px 16px;border-radius:10px;text-decoration:none;font-size:.68rem;font-weight:950;letter-spacing:.08em}.actions a:first-child,footer a:last-child{color:#fff;background:#09283b}.actions a:nth-child(2){color:#0b694a;border:1px solid #9edfc4;background:#effbf5}.actions a:nth-child(3){color:#075c77;border:1px solid #9edbec;background:#eaf9fd}.principle{display:grid;grid-template-columns:.8fr 1.5fr;gap:28px;padding:25px 28px;border:1px solid #9edbec;border-left:5px solid #29bce5;border-radius:14px;background:#eaf9fd}.principle b{font-size:1.25rem;color:#082b3c}.principle span{color:#4d6879;line-height:1.6}.practiceBridge{display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center;padding:26px 28px;border:1px solid #a9d9c3;border-radius:16px;background:#f0fbf5}.practiceBridge small{color:#0b7954;font-weight:950;letter-spacing:.12em}.practiceBridge h2{margin:8px 0;font-size:1.55rem}.practiceBridge p{max-width:720px;margin:0;color:#4c6c5d;line-height:1.6}.practiceActions{display:flex;flex-direction:column;gap:9px}.practiceActions a{white-space:nowrap;color:#0b694a;border:1px solid #9edfc4;background:#fff}
        section{margin-top:64px}.sectionHead{display:flex;align-items:center;gap:14px;margin-bottom:22px}.sectionHead span{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;color:#0e7795;background:#e4f7fc;font-size:.7rem;font-weight:950}.sectionHead h2{margin:0;font-size:1.8rem;color:#071b2b}.proofChain{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.proofChain div{min-height:125px;padding:14px;border:1px solid #cfe2eb;border-radius:14px;background:#fff}.proofChain b{color:#16a1c5;font-size:.72rem}.proofChain span{display:block;margin-top:28px;font-size:.8rem;font-weight:900;line-height:1.35}.teachingGrid{display:grid;gap:28px}.teachingGrid article{overflow:hidden;border:1px solid #cfe2eb;border-radius:18px;background:#fff;box-shadow:0 18px 50px rgba(28,68,90,.08)}.imageLabel{display:flex;gap:14px;align-items:center;padding:15px 18px;border-bottom:1px solid #d7e5ed}.imageLabel b{color:#0e7997;font-size:.75rem}.imageLabel span{font-weight:900;color:#173447}.teachingGrid img{display:block;width:100%;height:auto}.lessonGuide{padding:24px 28px;background:#f5fafc}.lessonGuide small{font-size:.68rem;font-weight:950;letter-spacing:.12em;color:#0e7997}.lessonGuide p{max-width:900px;color:#405b6a;line-height:1.7;margin:10px 0 18px}.lessonGuide strong{font-size:.74rem;letter-spacing:.08em;color:#173447}.nextLesson{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-top:20px;padding:18px 20px;border-left:4px solid #18a1c3;background:#e5f6fb;border-radius:8px;color:#084a61;font-weight:800;line-height:1.5}.nextLesson b{font-size:1.7rem}.missingVisual{display:grid;place-items:center;gap:10px;min-height:260px;padding:36px;text-align:center;background:linear-gradient(135deg,#071b2b,#0d536b);color:#fff}.missingVisual strong{font-size:1.3rem;letter-spacing:.04em}.missingVisual span{max-width:640px;color:#c9e6ef;line-height:1.6}.domainGrid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}.domainGrid article{grid-column:span 2;min-height:220px;padding:20px;border:1px solid #d6e4ec;border-radius:16px;background:#fff;box-shadow:0 14px 40px rgba(28,68,90,.06)}.domainGrid article>div{display:flex;justify-content:space-between;align-items:baseline}.domainGrid strong{font-size:1.6rem;color:#0e7997}.domainGrid small{font-size:.6rem;font-weight:950;letter-spacing:.1em;color:#7b929f}.domainGrid h3{margin:40px 0 10px;font-size:1.05rem}.domainGrid p,.lead,.split p,.compareGrid p{color:#607786;line-height:1.6}.niretBox{padding:26px 28px;border:1px solid #a9d9c3;border-left:5px solid #2aab74;border-radius:14px;background:#f0fbf5}.niretBox strong{font-size:1.3rem;color:#0b5f43}.niretBox p{color:#466a5a;line-height:1.65}.niretBox small{display:block;color:#6c887b;font-weight:750}.failureGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.failureGrid div{display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:start;padding:16px;border:1px solid #efd3d5;border-radius:12px;background:#fff8f8}.failureGrid b{color:#b7434b}.failureGrid span{font-size:.88rem;line-height:1.5;color:#624f54}.recordFlow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.recordFlow div{min-height:100px;padding:13px;border:1px solid #d7e5ed;border-radius:12px;background:#fff}.recordFlow b{display:block;color:#19a0c4;font-size:.68rem}.recordFlow span{display:block;margin-top:20px;font-size:.78rem;font-weight:800}.split,.compareGrid{display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:center}.split article,.compareGrid article{padding:24px;border:1px solid #d7e5ed;border-radius:16px;background:#fff}.split small,.compareGrid small{color:#1683a1;font-weight:950;letter-spacing:.1em}.split h3,.compareGrid h3{margin:10px 0 6px;font-size:1.3rem}.arrow{font-size:2rem;color:#20a8cd}footer{display:flex;justify-content:space-between;gap:30px;align-items:center;margin-top:70px;padding:30px 0;border-top:1px solid #d7e5ed}footer p{font-weight:850;color:#385364}.footerActions{display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end}.footerActions a:first-child{color:#075c77;border:1px solid #9edbec;background:#eaf9fd}.footerActions a:last-child{white-space:nowrap}
        @media(max-width:820px){.principle,.practiceBridge{grid-template-columns:1fr}.proofChain{grid-template-columns:1fr 1fr}.domainGrid{grid-template-columns:1fr}.domainGrid article{grid-column:auto}.failureGrid{grid-template-columns:1fr}.recordFlow{grid-template-columns:1fr 1fr}.split,.compareGrid{grid-template-columns:1fr}.arrow{transform:rotate(90deg);justify-self:center}footer{align-items:flex-start;flex-direction:column}.footerActions{justify-content:flex-start}}
        @media(max-width:520px){.shell{width:min(100% - 24px,1120px)}header{padding-top:50px}.proofChain,.recordFlow{grid-template-columns:1fr}nav{align-items:flex-start;flex-direction:column}.practiceActions{width:100%}.practiceActions a{text-align:center}}
      `}</style>
    </main>
  );
}
