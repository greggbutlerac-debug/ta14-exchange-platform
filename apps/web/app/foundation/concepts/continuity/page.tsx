import Link from "next/link";

const chain = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

const continuityDimensions = [
  {
    title: "Reality continuity",
    body:
      "The preserved connection between the original condition, event, measurement, declaration, or observed state and the record that represents it.",
  },
  {
    title: "Identity continuity",
    body:
      "The ability to establish which person, system, instrument, organization, asset, or authority produced, handled, reviewed, or relied upon the record.",
  },
  {
    title: "Temporal continuity",
    body:
      "The ordered chronology connecting when evidence arose, when it was captured, when it changed, and when reliance was proposed.",
  },
  {
    title: "Custody continuity",
    body:
      "The attributable handling history of evidence and records, including transfers, storage, access, modification, export, and preservation.",
  },
  {
    title: "Authority continuity",
    body:
      "The uninterrupted validity of the authority attached to a route, including scope, delegation, duration, revocation, and role changes.",
  },
  {
    title: "Condition continuity",
    body:
      "The preservation of the material circumstances under which the evidence and determination remain relevant to the proposed consequence.",
  },
];

const breaks = [
  "Unexplained gaps in time, sequence, custody, or handling",
  "Unverified identity, source, instrument, or system",
  "Material alteration without attributable version history",
  "Expired, revoked, transferred, or out-of-scope authority",
  "Evidence detached from the conditions in which it arose",
  "Contradictory records without governed reconciliation",
  "Export or migration that strips provenance or context",
  "Later evidence that changes the standing of future reliance",
];

const proves = [
  "The record remains connected to an attributable source and sequence.",
  "Material handling, changes, and transfers are visible rather than hidden.",
  "The evidence has not been silently detached from its original context.",
  "The basis for reliance can be traced from reality toward admissibility.",
];

const doesNotProve = [
  "That the underlying evidence is accurate merely because its custody is continuous.",
  "That the source, instrument, or authority was competent.",
  "That the record is admissible for every purpose or jurisdiction.",
  "That continuity alone justifies binding, commitment, or execution.",
  "That no future evidence can change the standing of later reliance.",
];

const responses = [
  {
    name: "PRESERVE",
    body:
      "Continue maintaining the record, chronology, custody, authority, and relevant conditions without material interruption.",
  },
  {
    name: "REPAIR",
    body:
      "Resolve a bounded and attributable gap before further reliance, without pretending the break never occurred.",
  },
  {
    name: "HOLD",
    body:
      "Stop progression toward admissibility or commitment until the continuity defect is sufficiently addressed.",
  },
  {
    name: "SUPERSEDE",
    body:
      "Preserve the original record while publishing a new attributable record that governs future reliance.",
  },
];

export default function ContinuityConceptPage() {
  return (
    <main className="page">
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      <header className="topbar">
        <Link href="/foundation" className="brand" aria-label="TA-14 Foundation">
          <span className="brand-mark">TA-14</span>
          <span className="brand-copy">
            <strong>Foundation</strong>
            <small>Public Canon of Admissible Execution</small>
          </span>
        </Link>

        <nav aria-label="Foundation navigation">
          <Link href="/foundation">Foundation</Link>
          <Link href="/foundation/concepts">Concepts</Link>
          <Link href="/foundation/architectures">Architectures</Link>
          <Link href="/foundation/publications">Publications</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="concept-id">TA-14-CONCEPT-002</div>
        <p className="eyebrow">Foundational concept</p>
        <h1>Continuity</h1>
        <p className="definition">
          The preserved connection between reality, record, identity, sequence,
          custody, authority, and the conditions under which consequence-bearing
          reliance may remain justified.
        </p>

        <div className="hero-actions">
          <a href="#canonical-definition" className="button primary">
            Read the Canonical Definition
          </a>
          <Link href="/foundation/concepts" className="button secondary">
            Return to Concepts
          </Link>
        </div>
      </section>

      <section id="canonical-definition" className="definition-panel shell">
        <div className="panel-label">
          <span>Canonical definition</span>
          <small>Version 1.0</small>
        </div>

        <blockquote>
          Continuity is the attributable preservation of the links connecting
          reality to its record and the record to the identity, chronology,
          custody, authority, and conditions required for later reliance.
        </blockquote>

        <p>
          Continuity does not convert a record into truth. It protects the route
          by making visible whether the record still represents the reality,
          source, sequence, custody, authority, and conditions it claims to
          represent. Where continuity breaks, reliance must not proceed as though
          the break did not occur.
        </p>
      </section>

      <section className="chain-section shell">
        <div className="section-heading">
          <p className="eyebrow">Architectural position</p>
          <h2>Continuity is the bridge between record and admissibility.</h2>
          <p>
            A record cannot become admissible merely because it exists. It must
            remain connected to the reality it represents and preserve the
            identity, sequence, custody, authority, and material conditions
            needed to evaluate reliance.
          </p>
        </div>

        <div className="chain">
          {chain.map((item, index) => (
            <div
              className={`chain-item ${item === "Continuity" ? "active" : ""}`}
              key={item}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="dimensions shell">
        <div className="section-heading">
          <p className="eyebrow">Continuity dimensions</p>
          <h2>Continuity is not one link. It is a preserved system of links.</h2>
        </div>

        <div className="card-grid">
          {continuityDimensions.map((item, index) => (
            <article className="card" key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="breaks shell">
        <div className="breaks-copy">
          <p className="eyebrow">Continuity breaks</p>
          <h2>A break must be governed, not hidden.</h2>
          <p>
            A continuity defect does not always destroy the record, but it
            changes what may safely be claimed from it. The break must become
            visible, attributable, and bounded before later reliance can be
            evaluated.
          </p>
        </div>

        <div className="break-list">
          {breaks.map((item, index) => (
            <div key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="responses shell">
        <div className="section-heading">
          <p className="eyebrow">Governed response</p>
          <h2>Continuity defects require an explicit route response.</h2>
        </div>

        <div className="response-grid">
          {responses.map((item) => (
            <article key={item.name}>
              <strong>{item.name}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="boundaries shell">
        <div className="boundary-column proves">
          <p className="eyebrow">What continuity establishes</p>
          <h2>It proves that the route remains traceable.</h2>
          <ul>
            {proves.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="boundary-column nonclaims">
          <p className="eyebrow">What continuity does not establish</p>
          <h2>Traceability is necessary, but it is not sufficient.</h2>
          <ul>
            {doesNotProve.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="institutional shell">
        <div className="institutional-copy">
          <p className="eyebrow">Institutional continuity</p>
          <h2>History is preserved through new records, not backward editing.</h2>
          <p>
            Corrections, disputes, challenges, supersessions, revocations of
            future reliance, and later findings must be appended as attributable
            records. The original chronology remains preserved so the institution
            can show what was known, claimed, authorized, and relied upon at each
            point in time.
          </p>
        </div>

        <div className="sequence">
          <div>
            <span>01</span>
            <strong>Original record</strong>
            <p>Preserved as created, with its scope and conditions.</p>
          </div>
          <div>
            <span>02</span>
            <strong>Later evidence</strong>
            <p>Captured as a new reality and a new attributable record.</p>
          </div>
          <div>
            <span>03</span>
            <strong>Changed standing</strong>
            <p>Future reliance is corrected, limited, disputed, or superseded.</p>
          </div>
        </div>
      </section>

      <section className="separation shell">
        <div className="section-heading">
          <p className="eyebrow">Required separation</p>
          <h2>Continuity preserves evidence without deciding the diagnosis.</h2>
        </div>

        <div className="separation-grid">
          <article>
            <span>01</span>
            <h3>Record</h3>
            <p>
              Preserves what occurred, what was captured, who handled it, and
              when material events or changes took place.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>Determination</h3>
            <p>
              Evaluates whether continuity is sufficient for the declared claim,
              scope, route, and proposed consequence.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Action</h3>
            <p>
              Proceeds only after continuity supports admissibility and the route
              is properly bound, committed, and authorized.
            </p>
          </article>
        </div>
      </section>

      <section className="citation shell">
        <div>
          <p className="eyebrow">Recommended citation</p>
          <h2>TA-14-CONCEPT-002</h2>
          <p>
            TA-14 Authority Governance Institution. “Continuity.”
            TA-14 Foundation Public Canon of Admissible Execution, Version 1.0.
          </p>
        </div>

        <div className="citation-actions">
          <Link href="/foundation/concepts/admissibility" className="button secondary">
            Previous: Admissibility
          </Link>
          <Link href="/foundation/concepts" className="button primary">
            Concept Directory
          </Link>
        </div>
      </section>

      <footer className="institutional-footer">
        <div className="footer-seal" aria-hidden="true">
          <span>TA-14</span>
          <small>AUTHORITY</small>
        </div>

        <div className="footer-content">
          <p className="eyebrow">Office of the Founder</p>
          <h2>TA-14 Authority Governance Institution</h2>
          <p className="steward">
            Steward of the TA-14 Foundation and Public Canon
          </p>

          <div className="contact-grid">
            <address>
              <strong>Institutional Address</strong>
              <span>140 Island Way, #144</span>
              <span>Clearwater Beach, Florida 33767</span>
              <span>United States</span>
            </address>

            <div>
              <strong>Founder</strong>
              <span>Greggory Don Butler</span>
            </div>

            <div>
              <strong>General Inquiries</strong>
              <a href="mailto:TA-14AdmissibleExecution@gmail.com">
                TA-14AdmissibleExecution@gmail.com
              </a>
              <a href="tel:+13863377215">+1 (386) 337-7215</a>
            </div>
          </div>

          <div className="footer-principles">
            <span>Evidence First.</span>
            <span>Truth Locked.</span>
            <span>Action Separated.</span>
          </div>

          <p className="footer-motto">
            No admissible evidence. No admissible execution.
          </p>
        </div>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root { color-scheme: dark; }
          * { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body { margin: 0; background: #05070c; }

          .page {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            color: #f6f8fc;
            background:
              radial-gradient(circle at 50% -10%, rgba(72, 113, 224, .2), transparent 31%),
              linear-gradient(180deg, #060913 0%, #090d17 55%, #05070c 100%);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          .page::before {
            content: "";
            position: fixed;
            inset: 0;
            pointer-events: none;
            opacity: .26;
            background-image:
              linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
            background-size: 66px 66px;
            mask-image: linear-gradient(to bottom, black, transparent 92%);
          }

          .orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(105px);
            pointer-events: none;
          }

          .orb-one {
            width: 560px;
            height: 560px;
            top: 760px;
            left: -300px;
            background: rgba(51, 106, 255, .22);
            animation: floatOne 18s ease-in-out infinite alternate;
          }

          .orb-two {
            width: 650px;
            height: 650px;
            top: 2380px;
            right: -360px;
            background: rgba(143, 79, 255, .16);
            animation: floatTwo 22s ease-in-out infinite alternate;
          }

          .shell {
            position: relative;
            z-index: 2;
            width: min(1180px, calc(100% - 40px));
            margin: 0 auto;
            padding: 84px 0;
          }

          .topbar {
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            width: min(1180px, calc(100% - 40px));
            margin: 0 auto;
            padding: 24px 0;
            border-bottom: 1px solid rgba(255,255,255,.08);
          }

          .brand {
            display: inline-flex;
            align-items: center;
            gap: 14px;
            color: inherit;
            text-decoration: none;
          }

          .brand-mark {
            display: grid;
            place-items: center;
            width: 58px;
            height: 58px;
            border: 1px solid rgba(168,196,255,.42);
            border-radius: 50%;
            font-size: 13px;
            font-weight: 850;
            letter-spacing: .06em;
            background:
              radial-gradient(circle at 35% 28%, rgba(255,255,255,.16), transparent 30%),
              rgba(30,45,78,.72);
            box-shadow: inset 0 0 0 5px rgba(255,255,255,.025);
          }

          .brand-copy { display: grid; gap: 3px; }
          .brand-copy strong { font-size: 16px; letter-spacing: .04em; }
          .brand-copy small { color: #98a5bb; font-size: 12px; }

          nav { display: flex; gap: 24px; }
          nav a { color: #aeb9cc; font-size: 14px; text-decoration: none; }
          nav a:hover { color: white; }

          .eyebrow {
            margin: 0 0 14px;
            color: #8faefc;
            font-size: 12px;
            font-weight: 850;
            letter-spacing: .18em;
            text-transform: uppercase;
          }

          .hero { padding-top: 118px; text-align: center; }

          .concept-id {
            display: inline-flex;
            margin-bottom: 24px;
            padding: 9px 14px;
            border: 1px solid rgba(157,185,249,.24);
            border-radius: 999px;
            color: #a9c0f8;
            background: rgba(255,255,255,.03);
            font-size: 11px;
            font-weight: 850;
            letter-spacing: .12em;
          }

          .hero h1 {
            margin: 0;
            font-size: clamp(70px, 12vw, 150px);
            line-height: .88;
            letter-spacing: -.075em;
          }

          .definition {
            max-width: 930px;
            margin: 38px auto 0;
            color: #bdc6d8;
            font-size: clamp(21px, 2.5vw, 30px);
            line-height: 1.62;
          }

          .hero-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 14px;
            margin-top: 38px;
          }

          .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 50px;
            padding: 0 22px;
            border-radius: 999px;
            font-size: 14px;
            font-weight: 780;
            text-decoration: none;
            transition: transform .2s ease;
          }

          .button:hover { transform: translateY(-2px); }
          .primary { color: #07101f; background: linear-gradient(135deg, #f9fbff, #abc6ff); }
          .secondary {
            color: #e6edfc;
            border: 1px solid rgba(159,188,255,.28);
            background: rgba(255,255,255,.035);
          }

          .definition-panel {
            padding: 54px;
            border: 1px solid rgba(255,255,255,.09);
            border-radius: 30px;
            background:
              radial-gradient(circle at 8% 12%, rgba(77,118,224,.15), transparent 35%),
              rgba(11,17,30,.84);
          }

          .panel-label {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            color: #88a2dc;
            font-size: 11px;
            font-weight: 850;
            letter-spacing: .13em;
            text-transform: uppercase;
          }

          blockquote {
            max-width: 1000px;
            margin: 38px 0 28px;
            font-size: clamp(30px, 4vw, 51px);
            line-height: 1.2;
            letter-spacing: -.04em;
          }

          .definition-panel > p {
            max-width: 900px;
            margin: 0;
            color: #aeb8ca;
            font-size: 18px;
            line-height: 1.8;
          }

          .section-heading { max-width: 820px; margin-bottom: 38px; }

          .section-heading h2,
          .boundary-column h2,
          .breaks h2,
          .institutional h2,
          .citation h2,
          .footer-content h2 {
            margin: 0;
            font-size: clamp(36px, 5vw, 60px);
            line-height: 1.03;
            letter-spacing: -.048em;
          }

          .section-heading > p:last-child,
          .breaks-copy > p:last-child,
          .institutional-copy > p:last-child {
            color: #aab5c7;
            line-height: 1.76;
          }

          .chain {
            display: grid;
            grid-template-columns: repeat(8, minmax(0, 1fr));
            gap: 10px;
          }

          .chain-item {
            display: grid;
            align-content: center;
            min-height: 132px;
            padding: 18px 15px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 18px;
            background: rgba(12,18,32,.72);
          }

          .chain-item.active {
            border-color: rgba(159,190,255,.5);
            background:
              radial-gradient(circle at 50% 18%, rgba(92,135,245,.25), transparent 50%),
              rgba(19,30,54,.94);
            box-shadow: 0 20px 60px rgba(32,76,181,.13);
          }

          .chain-item span,
          .card span,
          .separation-grid span,
          .sequence span {
            color: #6e83ad;
            font-size: 11px;
            font-weight: 850;
          }

          .chain-item strong { margin-top: 10px; font-size: 15px; }

          .card-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .card {
            min-height: 280px;
            padding: 28px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 23px;
            background: linear-gradient(180deg, rgba(16,23,40,.82), rgba(8,12,22,.88));
          }

          .card h3,
          .separation-grid h3 {
            margin: 34px 0 13px;
            font-size: 23px;
            letter-spacing: -.025em;
          }

          .card p,
          .separation-grid p {
            margin: 0;
            color: #9faabd;
            line-height: 1.7;
          }

          .breaks,
          .institutional {
            display: grid;
            grid-template-columns: .9fr 1.1fr;
            gap: 70px;
            align-items: start;
          }

          .break-list {
            display: grid;
            gap: 12px;
          }

          .break-list div {
            display: grid;
            grid-template-columns: 42px 1fr;
            gap: 14px;
            align-items: start;
            padding: 20px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 18px;
            background: rgba(11,17,30,.78);
          }

          .break-list span {
            color: #7188bc;
            font-size: 11px;
            font-weight: 850;
          }

          .break-list p {
            margin: 0;
            color: #b1bbcd;
            line-height: 1.65;
          }

          .response-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
          }

          .response-grid article {
            min-height: 230px;
            padding: 28px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 22px;
            background: rgba(11,17,30,.78);
          }

          .response-grid strong {
            font-size: 17px;
            letter-spacing: .12em;
          }

          .response-grid p {
            margin: 28px 0 0;
            color: #a1acbf;
            line-height: 1.68;
          }

          .boundaries {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }

          .boundary-column {
            padding: 42px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 28px;
            background: rgba(11,17,30,.8);
          }

          .boundary-column h2 {
            font-size: clamp(31px, 4vw, 48px);
          }

          .boundary-column ul {
            display: grid;
            gap: 16px;
            margin: 30px 0 0;
            padding: 0;
            list-style: none;
          }

          .boundary-column li {
            position: relative;
            padding-left: 27px;
            color: #adb7c9;
            line-height: 1.65;
          }

          .boundary-column li::before {
            content: "";
            position: absolute;
            top: .65em;
            left: 0;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: #8eacf2;
            box-shadow: 0 0 22px rgba(100,148,255,.7);
          }

          .nonclaims li::before { background: #9989d8; }

          .sequence {
            display: grid;
            gap: 14px;
          }

          .sequence div {
            min-height: 150px;
            padding: 24px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 20px;
            background: rgba(11,17,30,.8);
          }

          .sequence strong {
            display: block;
            margin-top: 16px;
            font-size: 20px;
          }

          .sequence p {
            margin: 9px 0 0;
            color: #a5b0c3;
            line-height: 1.6;
          }

          .separation-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .separation-grid article {
            min-height: 270px;
            padding: 30px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 24px;
            background: rgba(11,17,30,.78);
          }

          .citation {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 40px;
            margin-bottom: 72px;
            padding: 48px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 30px;
            background:
              radial-gradient(circle at 12% 15%, rgba(77,118,224,.15), transparent 32%),
              rgba(11,17,30,.82);
          }

          .citation > div:first-child { max-width: 760px; }
          .citation p:last-child { color: #aab5c7; line-height: 1.75; }
          .citation-actions { display: flex; flex-wrap: wrap; gap: 12px; }

          .institutional-footer {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: 190px 1fr;
            gap: 52px;
            width: min(1180px, calc(100% - 40px));
            margin: 0 auto 40px;
            padding: 58px;
            border: 1px solid rgba(177,200,255,.14);
            border-radius: 34px;
            background:
              radial-gradient(circle at 12% 22%, rgba(76,117,224,.13), transparent 31%),
              linear-gradient(180deg, rgba(13,19,34,.96), rgba(7,10,18,.98));
          }

          .footer-seal {
            display: grid;
            place-items: center;
            align-self: start;
            width: 160px;
            height: 160px;
            border: 1px solid rgba(171,197,255,.38);
            border-radius: 50%;
            background: radial-gradient(circle, rgba(73,112,199,.22), rgba(7,12,23,.9));
            box-shadow: inset 0 0 0 9px rgba(255,255,255,.025);
          }

          .footer-seal span {
            font-size: 31px;
            font-weight: 850;
            letter-spacing: -.045em;
          }

          .footer-seal small {
            margin-top: -48px;
            color: #90a7da;
            font-size: 9px;
            font-weight: 850;
            letter-spacing: .32em;
          }

          .footer-content h2 { font-size: clamp(32px, 4vw, 52px); }
          .steward { margin: 13px 0 34px; color: #aab5c8; font-size: 17px; }

          .contact-grid {
            display: grid;
            grid-template-columns: 1.2fr .8fr 1.25fr;
            gap: 30px;
            padding: 28px 0;
            border-top: 1px solid rgba(255,255,255,.08);
            border-bottom: 1px solid rgba(255,255,255,.08);
          }

          .contact-grid address,
          .contact-grid > div {
            display: grid;
            align-content: start;
            gap: 6px;
            font-style: normal;
          }

          .contact-grid strong {
            margin-bottom: 4px;
            color: #eef3ff;
            font-size: 12px;
            letter-spacing: .1em;
            text-transform: uppercase;
          }

          .contact-grid span,
          .contact-grid a {
            color: #a8b3c7;
            line-height: 1.5;
            text-decoration: none;
            overflow-wrap: anywhere;
          }

          .footer-principles {
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
            margin-top: 28px;
            color: #8fa7dc;
            font-size: 13px;
            font-weight: 850;
            letter-spacing: .09em;
            text-transform: uppercase;
          }

          .footer-motto {
            margin: 20px 0 0;
            color: #f1f5ff;
            font-size: clamp(20px, 3vw, 29px);
            font-weight: 800;
            letter-spacing: -.025em;
          }

          @keyframes floatOne { to { transform: translate(100px, 120px); } }
          @keyframes floatTwo { to { transform: translate(-110px, -90px); } }

          @media (max-width: 1000px) {
            nav { display: none; }
            .chain { grid-template-columns: repeat(4, minmax(0, 1fr)); }
            .card-grid,
            .separation-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .response-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .boundaries,
            .breaks,
            .institutional { grid-template-columns: 1fr; }
            .institutional-footer { grid-template-columns: 1fr; }
            .contact-grid { grid-template-columns: 1fr; }
          }

          @media (max-width: 760px) {
            .topbar,
            .shell,
            .institutional-footer {
              width: min(100% - 28px, 1180px);
            }

            .hero { padding-top: 82px; }
            .definition-panel,
            .boundary-column,
            .citation { padding: 32px; }
            .chain { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .card-grid,
            .response-grid,
            .separation-grid { grid-template-columns: 1fr; }

            .citation {
              align-items: stretch;
              flex-direction: column;
            }

            .institutional-footer { padding: 34px 26px; }
            .footer-seal { width: 132px; height: 132px; }
            .footer-principles { display: grid; gap: 8px; }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: .01ms !important;
              animation-iteration-count: 1 !important;
              scroll-behavior: auto !important;
            }
          }
        `,
        }}
      />
    </main>
  );
}
