import Link from "next/link";

export const metadata = {
  title: "Evidence Before Intervention Blueprint | TA-14 Academy HVAC",
  description: "TA-14 Evidence Before Intervention — HVAC Service Competency & Assessment Blueprint v0.1.",
};

const domains = [
  ["Baseline establishment", "20%", "Create a non-invasive operating baseline before disturbance."],
  ["Evidence sufficiency & determination", "25%", "Separate facts, unknowns, contradictions, and bounded diagnostic determination."],
  ["Refrigerant-entry admissibility", "25%", "Determine whether sealed-system entry is justified before gauge connection or refrigerant disturbance."],
  ["Evidence-governed intervention", "15%", "Keep intervention inside the declared determination, authority, and scope."],
  ["Outcome verification", "15%", "Compare post-intervention performance against the original baseline and close the outcome record."],
];

const criticalFailures = [
  "Entering the sealed refrigerant circuit before the defined entry threshold is established.",
  "Adding, removing, recovering, venting, or transferring refrigerant without a supported determination and applicable authority.",
  "Fabricating, backfilling, or silently changing baseline evidence.",
  "Performing an intervention beyond the declared scope or contrary to the candidate's own determination.",
  "Failing to preserve the post-intervention performance record needed to evaluate outcome.",
  "Creating an unsafe condition or violating applicable safety or legal requirements.",
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
          <small>TA-14 ACADEMY // HVAC // FOUNDATIONAL ARTIFACT</small>
          <h1>Evidence Before Intervention</h1>
          <p>HVAC Service Competency & Assessment Blueprint v0.1</p>
          <div className="actions">
            <a href="/academy/hvac/blueprint/TA14_Evidence_Before_Intervention_HVAC_Service_Competency_Assessment_Blueprint_v0_1.pdf" download>
              DOWNLOAD PDF
            </a>
            <Link href="/atlas-608-refrigerant-ops-lab/campaign">ENTER EPA 608 LAB</Link>
          </div>
        </header>

        <section className="principle">
          <b>No admissible evidence. No admissible intervention.</b>
          <span>
            Competency is not only the ability to perform a procedure. The candidate must demonstrate why the procedure became justified before consequence-bearing intervention occurs.
          </span>
        </section>

        <section>
          <div className="sectionHead"><span>01</span><h2>Assessment domains</h2></div>
          <div className="domainGrid">
            {domains.map(([name, weight, copy]) => (
              <article key={name}>
                <div><strong>{weight}</strong><small>WEIGHT</small></div>
                <h3>{name}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="sectionHead"><span>02</span><h2>Critical-failure boundary</h2></div>
          <p className="lead">A passing aggregate score cannot override a critical failure. The assessment fails closed when the candidate creates a consequence-bearing intervention without the required evidence, authority, scope, or safety boundary.</p>
          <div className="failureGrid">
            {criticalFailures.map((failure, index) => (
              <div key={failure}><b>{String(index + 1).padStart(2, "0")}</b><span>{failure}</span></div>
            ))}
          </div>
        </section>

        <section>
          <div className="sectionHead"><span>03</span><h2>Candidate evidence record</h2></div>
          <div className="recordFlow">
            {[
              "Equipment identity",
              "Complaint / consequence",
              "Pre-intervention conditions",
              "Non-invasive measurements",
              "Knowns / unknowns / contradictions",
              "Entry-threshold status",
              "Diagnostic determination",
              "Authorized intervention scope",
              "Execution observations",
              "Post-intervention measurements",
              "Baseline vs outcome",
              "Residual gaps / disposition",
            ].map((item, index) => <div key={item}><b>{index + 1}</b><span>{item}</span></div>)}
          </div>
        </section>

        <section className="independence">
          <div className="sectionHead"><span>04</span><h2>Credential separation</h2></div>
          <div className="split">
            <article><small>TA-14 ACADEMY</small><h3>Teach the competency</h3><p>Doctrine, simulations, practice cases, evidence discipline, labs, and candidate preparation.</p></article>
            <div className="arrow">→</div>
            <article><small>INDEPENDENT ASSESSMENT PATHWAY</small><h3>Determine the credential</h3><p>A mature pathway should preserve independence between instruction and final credential determination wherever feasible.</p></article>
          </div>
        </section>

        <footer>
          <p>Evidence before intervention. Determination before disturbance. Verification after consequence.</p>
          <a href="/academy/hvac/blueprint/TA14_Evidence_Before_Intervention_HVAC_Service_Competency_Assessment_Blueprint_v0_1.pdf" download>DOWNLOAD THE FULL v0.1 PDF →</a>
        </footer>
      </div>

      <style>{`
        .blueprintPage{min-height:100vh;color:#122434;background:linear-gradient(180deg,#f6fbfe,#fff);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.blueprintPage *{box-sizing:border-box}.shell{width:min(1120px,calc(100% - 40px));margin:0 auto;padding:24px 0 70px}nav{display:flex;justify-content:space-between;gap:20px;padding-bottom:22px;border-bottom:1px solid #d7e5ee}nav a{color:#16728c;text-decoration:none;font-size:.7rem;font-weight:950;letter-spacing:.1em}header{padding:72px 0 52px;max-width:920px}header small{color:#1683a1;font-weight:950;letter-spacing:.14em}header h1{margin:12px 0 6px;font-size:clamp(3rem,8vw,6.6rem);line-height:.9;letter-spacing:-.055em;color:#071b2b}header p{font-size:1.35rem;color:#61798a}.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}.actions a,footer a{padding:13px 16px;border-radius:10px;text-decoration:none;font-size:.68rem;font-weight:950;letter-spacing:.08em}.actions a:first-child,footer a{color:#fff;background:#09283b}.actions a:last-child{color:#0b694a;border:1px solid #9edfc4;background:#effbf5}.principle{display:grid;grid-template-columns:.8fr 1.5fr;gap:28px;padding:25px 28px;border:1px solid #9edbec;border-left:5px solid #29bce5;border-radius:14px;background:#eaf9fd}.principle b{font-size:1.25rem;color:#082b3c}.principle span{color:#4d6879;line-height:1.6}section{margin-top:64px}.sectionHead{display:flex;align-items:center;gap:14px;margin-bottom:22px}.sectionHead span{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;color:#0e7795;background:#e4f7fc;font-size:.7rem;font-weight:950}.sectionHead h2{margin:0;font-size:1.8rem;color:#071b2b}.domainGrid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}.domainGrid article{grid-column:span 2;min-height:220px;padding:20px;border:1px solid #d6e4ec;border-radius:16px;background:#fff;box-shadow:0 14px 40px rgba(28,68,90,.06)}.domainGrid article:nth-child(4),.domainGrid article:nth-child(5){grid-column:span 3}.domainGrid article>div{display:flex;justify-content:space-between;align-items:baseline}.domainGrid strong{font-size:1.6rem;color:#0e7997}.domainGrid small{font-size:.6rem;font-weight:950;letter-spacing:.1em;color:#7b929f}.domainGrid h3{margin:40px 0 10px;font-size:1.05rem}.domainGrid p,.lead,.split p{color:#607786;line-height:1.6}.failureGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.failureGrid div{display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:start;padding:16px;border:1px solid #efd3d5;border-radius:12px;background:#fff8f8}.failureGrid b{color:#b7434b}.failureGrid span{font-size:.88rem;line-height:1.5;color:#624f54}.recordFlow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.recordFlow div{min-height:100px;padding:13px;border:1px solid #d7e5ed;border-radius:12px;background:#fff}.recordFlow b{display:block;color:#19a0c4;font-size:.68rem}.recordFlow span{display:block;margin-top:20px;font-size:.78rem;font-weight:800}.split{display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:center}.split article{padding:24px;border:1px solid #d7e5ed;border-radius:16px;background:#fff}.split small{color:#1683a1;font-weight:950;letter-spacing:.1em}.split h3{margin:10px 0 6px;font-size:1.3rem}.arrow{font-size:2rem;color:#20a8cd}footer{display:flex;justify-content:space-between;gap:30px;align-items:center;margin-top:70px;padding:30px 0;border-top:1px solid #d7e5ed}footer p{font-weight:850;color:#385364}footer a{white-space:nowrap}@media(max-width:820px){.principle{grid-template-columns:1fr}.domainGrid{grid-template-columns:1fr}.domainGrid article,.domainGrid article:nth-child(4),.domainGrid article:nth-child(5){grid-column:auto}.failureGrid{grid-template-columns:1fr}.recordFlow{grid-template-columns:1fr 1fr}.split{grid-template-columns:1fr}.arrow{transform:rotate(90deg);justify-self:center}footer{align-items:flex-start;flex-direction:column}}@media(max-width:520px){.shell{width:min(100% - 24px,1120px)}header{padding-top:50px}.recordFlow{grid-template-columns:1fr}nav{align-items:flex-start;flex-direction:column}}
      `}</style>
    </main>
  );
}
