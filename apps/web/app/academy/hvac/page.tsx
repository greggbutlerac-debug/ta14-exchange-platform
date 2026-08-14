import Link from "next/link";

export const metadata = {
  title: "HVAC | TA-14 Academy",
  description:
    "The TA-14 Academy HVAC world for evidence-before-intervention training, simulations, assessment, and credential readiness.",
};

const worlds = [
  {
    tag: "FOUNDATIONAL ARTIFACT",
    title: "Evidence Before Intervention",
    copy: "Enter the HVAC Service Competency & Assessment Blueprint. Learn how baseline evidence, entry thresholds, diagnostic determination, bounded intervention, and outcome verification become assessable competency.",
    href: "/academy/hvac/blueprint",
    action: "OPEN PDF BLUEPRINT",
    live: true,
  },
  {
    tag: "PLAYABLE OPERATIONS LAB",
    title: "EPA 608 Refrigerant Ops",
    copy: "Practice refrigerant operations inside the existing playable training environment while preserving the boundary between procedural capability and evidence that justifies intervention.",
    href: "/atlas-608-refrigerant-ops-lab/campaign",
    action: "ENTER OPERATIONS LAB",
    live: true,
  },
  {
    tag: "BASELINE LAB",
    title: "Measure Before Disturbance",
    copy: "Build pre-intervention records from operating conditions, temperature, airflow, electrical, equipment identity, and measurement integrity before the system is changed.",
    href: "#baseline",
    action: "WORLD EXPANSION QUEUED",
    live: false,
  },
  {
    tag: "DETERMINATION LAB",
    title: "Refrigerant Entry Threshold",
    copy: "Work through scenarios in which the candidate must decide whether the available non-invasive evidence is sufficient to justify sealed-system entry.",
    href: "#entry-threshold",
    action: "WORLD EXPANSION QUEUED",
    live: false,
  },
  {
    tag: "OUTCOME LAB",
    title: "Post-Intervention Performance Record",
    copy: "Compare post-intervention measurements against the original baseline and preserve what changed, what remains unresolved, and whether the intended result was achieved.",
    href: "#outcome",
    action: "WORLD EXPANSION QUEUED",
    live: false,
  },
];

const sequence = [
  "Baseline",
  "Evidence Sufficiency",
  "Entry Threshold",
  "Diagnostic Determination",
  "Bounded Intervention",
  "Post-Intervention Record",
  "Outcome Closure",
];

export default function HvacAcademyWorldPage() {
  return (
    <main className="hvacWorld">
      <div className="cosmos" aria-hidden="true">
        <div className="grid" />
        <div className="stars starsA" />
        <div className="stars starsB" />
        <div className="orb orbA" />
        <div className="orb orbB" />
      </div>

      <div className="shell">
        <header className="topbar">
          <Link href="/academy">← TA-14 ACADEMY</Link>
          <span>DOMAIN WORLD // HVAC</span>
        </header>

        <section className="hero">
          <div className="eyebrow">TA-14 ACADEMY DOMAIN WORLD</div>
          <h1>HVAC</h1>
          <p>
            One doorway into a complete evidence-governed HVAC learning world: technical practice,
            decision discipline, simulations, assessment, and credential readiness.
          </p>
          <div className="doctrine">
            <strong>Evidence before intervention.</strong>
            <span>Determination before disturbance. Verification after consequence.</span>
          </div>
        </section>

        <section className="sequence" aria-label="HVAC service sequence">
          {sequence.map((step, index) => (
            <div className="sequenceStep" key={step}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <span>{step}</span>
            </div>
          ))}
        </section>

        <section className="worldGrid">
          {worlds.map((world) => (
            <article className={`worldCard ${world.live ? "live" : "queued"}`} key={world.title}>
              <div className="statusRow">
                <span>{world.tag}</span>
                <i>{world.live ? "LIVE" : "PLANNED"}</i>
              </div>
              <h2>{world.title}</h2>
              <p>{world.copy}</p>
              {world.live ? (
                <Link href={world.href}>{world.action} →</Link>
              ) : (
                <span className="disabledAction">{world.action}</span>
              )}
            </article>
          ))}
        </section>

        <section className="credentialBand">
          <div>
            <small>FIRST GOVERNED HVAC CREDENTIAL ARTIFACT</small>
            <h2>TA-14 Evidence Before Intervention — HVAC Service</h2>
            <p>
              The blueprint defines assessable competency around baseline establishment, evidence
              sufficiency, refrigerant-entry admissibility, diagnostic determination, bounded
              intervention, and post-intervention outcome verification.
            </p>
          </div>
          <Link href="/academy/hvac/blueprint">VIEW / DOWNLOAD PDF</Link>
        </section>

        <footer>
          <span>TA-14 Academy // HVAC</span>
          <strong>No admissible evidence. No admissible intervention.</strong>
        </footer>
      </div>

      <style>{`
        :root {
          --ink:#effaff;
          --muted:#8ba7b8;
          --cyan:#4be6ff;
          --green:#4df2a6;
          --gold:#efc76a;
          --line:rgba(113,192,222,.18);
          --panel:rgba(4,16,27,.86);
        }
        .hvacWorld{position:relative;min-height:100vh;overflow:hidden;color:var(--ink);background:#020810;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .hvacWorld *{box-sizing:border-box}.cosmos{position:fixed;inset:0;pointer-events:none;overflow:hidden}.grid{position:absolute;inset:0;opacity:.18;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:52px 52px;mask-image:linear-gradient(to bottom,#000,transparent 92%)}
        .stars{position:absolute;inset:-20%;background-image:radial-gradient(circle,rgba(255,255,255,.8) 0 1px,transparent 1.3px);background-size:137px 137px;animation:drift 40s linear infinite}.starsB{opacity:.36;background-size:211px 211px;animation-duration:62s;animation-direction:reverse}.orb{position:absolute;width:34rem;height:34rem;border-radius:50%;filter:blur(90px);opacity:.13}.orbA{left:-12rem;top:4rem;background:#28d9ff}.orbB{right:-16rem;top:34rem;background:#48ff9f}
        @keyframes drift{to{transform:translate3d(110px,70px,0)}}
        .shell{position:relative;z-index:1;width:min(1220px,calc(100% - 40px));margin:0 auto;padding:24px 0 64px}.topbar{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:14px 0 28px;border-bottom:1px solid var(--line);font-size:.72rem;font-weight:900;letter-spacing:.12em;color:var(--muted)}.topbar a{color:var(--cyan);text-decoration:none}
        .hero{padding:74px 0 42px;max-width:880px}.eyebrow{font-size:.72rem;font-weight:950;letter-spacing:.18em;color:var(--green)}.hero h1{margin:10px 0 8px;font-size:clamp(4.8rem,14vw,10rem);line-height:.84;letter-spacing:-.065em}.hero>p{max-width:800px;margin:24px 0;color:#abc0cd;font-size:clamp(1.05rem,2vw,1.35rem);line-height:1.65}.doctrine{display:flex;flex-wrap:wrap;gap:10px 22px;padding:18px 20px;border:1px solid rgba(75,230,255,.34);border-radius:16px;background:rgba(7,30,43,.56);box-shadow:0 0 48px rgba(75,230,255,.08)}.doctrine strong{color:#dffaff}.doctrine span{color:var(--muted)}
        .sequence{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;margin:4px 0 38px}.sequenceStep{min-height:90px;padding:13px;border:1px solid var(--line);border-radius:14px;background:rgba(6,18,29,.7)}.sequenceStep b{display:block;color:var(--cyan);font-size:.7rem;letter-spacing:.12em}.sequenceStep span{display:block;margin-top:17px;font-size:.75rem;font-weight:850;color:#c9dce7}
        .worldGrid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:16px}.worldCard{grid-column:span 4;min-height:310px;display:flex;flex-direction:column;padding:24px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(160deg,rgba(8,25,39,.94),rgba(3,12,21,.94));box-shadow:0 22px 70px rgba(0,0,0,.24);transition:180ms ease}.worldCard:first-child{grid-column:span 8;background:radial-gradient(circle at 8% 0%,rgba(75,230,255,.13),transparent 32%),linear-gradient(160deg,rgba(8,25,39,.97),rgba(3,12,21,.96))}.worldCard:hover{transform:translateY(-4px);border-color:rgba(75,230,255,.45)}.worldCard.queued{opacity:.78}.statusRow{display:flex;justify-content:space-between;gap:12px;font-size:.62rem;font-weight:950;letter-spacing:.12em;color:var(--cyan)}.statusRow i{font-style:normal;color:var(--green)}.queued .statusRow i{color:var(--gold)}.worldCard h2{margin:46px 0 12px;font-size:1.55rem;line-height:1.05}.worldCard:first-child h2{font-size:2.3rem}.worldCard p{margin:0 0 28px;color:var(--muted);line-height:1.65;font-size:.92rem}.worldCard a,.disabledAction{margin-top:auto;align-self:flex-start;padding:11px 13px;border:1px solid rgba(75,230,255,.35);border-radius:11px;color:#dffaff;text-decoration:none;font-size:.68rem;font-weight:950;letter-spacing:.08em;background:rgba(28,112,138,.15)}.disabledAction{color:#7c8f9d;border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.03)}
        .credentialBand{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:32px;align-items:center;margin-top:18px;padding:30px;border:1px solid rgba(77,242,166,.28);border-radius:22px;background:radial-gradient(circle at 0 50%,rgba(77,242,166,.09),transparent 38%),rgba(4,17,27,.84)}.credentialBand small{color:var(--green);font-weight:950;letter-spacing:.14em}.credentialBand h2{margin:9px 0;font-size:1.7rem}.credentialBand p{max-width:830px;margin:0;color:var(--muted);line-height:1.6}.credentialBand a{padding:14px 18px;border:1px solid rgba(77,242,166,.55);border-radius:12px;color:#dfffee;text-decoration:none;font-size:.72rem;font-weight:950;letter-spacing:.08em;background:rgba(37,118,79,.2)}
        footer{display:flex;justify-content:space-between;gap:20px;margin-top:36px;padding-top:20px;border-top:1px solid var(--line);font-size:.7rem;color:var(--muted)}footer strong{color:#b8ccd8}
        @media(max-width:950px){.sequence{grid-template-columns:repeat(2,minmax(0,1fr))}.worldCard,.worldCard:first-child{grid-column:span 6}.credentialBand{grid-template-columns:1fr}}
        @media(max-width:680px){.shell{width:min(100% - 24px,1220px)}.topbar{align-items:flex-start;flex-direction:column}.hero{padding-top:52px}.sequence{grid-template-columns:1fr}.worldCard,.worldCard:first-child{grid-column:1/-1}.credentialBand{padding:22px}footer{flex-direction:column}.hero h1{font-size:5rem}}
        @media(prefers-reduced-motion:reduce){.stars{animation:none}.worldCard{transition:none}}
      `}</style>
    </main>
  );
}
