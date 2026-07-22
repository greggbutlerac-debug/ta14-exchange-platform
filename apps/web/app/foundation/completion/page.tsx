import Link from "next/link";

const foundationSections = [
  {
    number: "01",
    title: "Canonical Concepts",
    status: "Published",
    body:
      "The Foundation defines the concepts that govern how TA-14 separates evidence, continuity, admissibility, determination, authority, commitment, execution, and outcome.",
    href: "/foundation/concepts",
    action: "Open Concept Directory",
  },
  {
    number: "02",
    title: "Architectures",
    status: "In Progress",
    body:
      "The architecture library will publish the systems, chains, separation requirements, route controls, and institutional structures built from the public canon.",
    href: "/foundation/architectures",
    action: "Open Architectures",
  },
  {
    number: "03",
    title: "Chronology",
    status: "In Progress",
    body:
      "The chronology will preserve the dated development of TA-14 through publications, declarations, repositories, filings, demonstrations, corrections, and supersessions.",
    href: "/foundation/chronology",
    action: "Open Chronology",
  },
  {
    number: "04",
    title: "Publications",
    status: "In Progress",
    body:
      "The publication record will connect books, articles, papers, public declarations, technical artifacts, and later amendments to the concepts they support.",
    href: "/foundation/publications",
    action: "Open Publications",
  },
  {
    number: "05",
    title: "Evidence",
    status: "Planned",
    body:
      "The evidence library will connect public claims to dated supporting artifacts without converting possession, publication, or registration into stronger findings.",
    href: "/foundation/evidence",
    action: "Open Evidence",
  },
  {
    number: "06",
    title: "Challenges and Corrections",
    status: "Planned",
    body:
      "The challenge pathway will preserve allegations, responses, verified evidence, institutional observations, corrections, disputes, and competent external findings as separate records.",
    href: "/foundation/challenges",
    action: "Open Challenge Pathway",
  },
];

const principles = [
  {
    title: "Everything material becomes inspectable.",
    body:
      "TA-14 will not depend on private endorsement to establish what it is. The public record will be available for examination by researchers, institutions, critics, regulators, founders, and the public.",
  },
  {
    title: "Chronology is preserved, not rewritten.",
    body:
      "Earlier records remain visible. Later corrections, disputes, amendments, withdrawals, and supersessions are appended as new attributable records.",
  },
  {
    title: "Claims remain bounded by evidence.",
    body:
      "Publication, registration, citation, or preservation does not automatically prove validity, priority, competence, ownership, legal standing, or universal admissibility.",
  },
  {
    title: "TA-14 is subject to its own rules.",
    body:
      "TA-14 records, claims, chronology, disputes, and corrections must remain open to the same evidentiary and procedural scrutiny expected of any other architecture.",
  },
];

const completionSteps = [
  "Publish the complete canonical concept set.",
  "Connect each concept to its architecture, chronology, publications, and evidence.",
  "Publish the TA-14 institutional chronology with dated source references.",
  "Establish public challenge, response, correction, and supersession procedures.",
  "Create stable identifiers and citation formats for every canonical record.",
  "Expose the Foundation through permanent public routes and exportable records.",
];

export default function FoundationCompletionPage() {
  return (
    <main className="page">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />

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
        <div className="status-pill">
          <span className="pulse" />
          Foundation build in progress
        </div>

        <p className="eyebrow">Institutional completion route</p>
        <h1>Complete the Foundation.</h1>

        <p className="hero-copy">
          TA-14 is publishing the architecture, chronology, concepts, claims,
          evidence, corrections, and institutional boundaries required for the
          world to inspect what TA-14 is and how it came to exist.
        </p>

        <div className="hero-actions">
          <Link href="/foundation" className="button primary">
            Enter the Foundation
          </Link>
          <Link href="/foundation/concepts" className="button secondary">
            Review Canonical Concepts
          </Link>
        </div>
      </section>

      <section className="declaration shell">
        <div className="declaration-label">
          <span>Public declaration</span>
          <small>TA-14 Foundation</small>
        </div>

        <blockquote>
          TA-14 will establish institutional standing through open chronology,
          attributable evidence, explicit claims, declared limitations, public
          challenge, and universal inspectability—not through dependence on a
          private partner, reviewer, sponsor, or approving authority.
        </blockquote>

        <p>
          Every material Foundation record is intended to become publicly
          reviewable. Any person or institution may inspect the record, challenge
          a claim, identify a contradiction, submit evidence, or question the
          architecture. Scrutiny does not weaken the Foundation. Properly
          preserved scrutiny becomes part of it.
        </p>
      </section>

      <section className="map shell">
        <div className="section-heading">
          <p className="eyebrow">Foundation map</p>
          <h2>One public institution. Six connected record surfaces.</h2>
          <p>
            The Foundation is complete only when concepts, architectures,
            chronology, publications, evidence, and challenges can be examined
            together without collapsing one category into another.
          </p>
        </div>

        <div className="section-grid">
          {foundationSections.map((section) => (
            <article className="section-card" key={section.title}>
              <div className="card-top">
                <span>{section.number}</span>
                <small>{section.status}</small>
              </div>

              <h3>{section.title}</h3>
              <p>{section.body}</p>

              <Link href={section.href}>{section.action} →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="published shell">
        <div className="section-heading">
          <p className="eyebrow">Canonical concept record</p>
          <h2>The first concept pages are now part of the public Foundation.</h2>
        </div>

        <div className="published-grid">
          <Link href="/foundation/concepts/admissibility" className="concept-card">
            <span>TA-14-CONCEPT-001</span>
            <h3>Admissibility</h3>
            <p>
              Whether evidence, authority, scope, continuity, and conditions are
              sufficient for a declared consequence-bearing reliance.
            </p>
          </Link>

          <Link href="/foundation/concepts/continuity" className="concept-card">
            <span>TA-14-CONCEPT-002</span>
            <h3>Continuity</h3>
            <p>
              The preserved connection between reality, record, identity,
              chronology, custody, authority, and conditions.
            </p>
          </Link>

          <Link href="/foundation/concepts/governed-record" className="concept-card">
            <span>TA-14-CONCEPT-003</span>
            <h3>Governed Record</h3>
            <p>
              An attributable representation of evidence that remains separate
              from interpretation, determination, optimization, and action.
            </p>
          </Link>
        </div>
      </section>

      <section className="principles shell">
        <div className="section-heading">
          <p className="eyebrow">Completion principles</p>
          <h2>The Foundation must be able to withstand examination.</h2>
        </div>

        <div className="principle-grid">
          {principles.map((principle, index) => (
            <article key={principle.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="scrutiny shell">
        <div className="scrutiny-copy">
          <p className="eyebrow">Universal scrutiny</p>
          <h2>No privileged reviewer is required.</h2>
          <p>
            TA-14 may receive useful criticism from partners, founders,
            researchers, engineers, regulators, institutions, or adversarial
            reviewers. None receives automatic authority over the Foundation.
            Their observations stand or fall according to the evidence,
            reasoning, scope, and competence supporting them.
          </p>
        </div>

        <div className="scrutiny-levels">
          <div>
            <span>01</span>
            <strong>Inspect</strong>
            <p>Anyone may examine the public record.</p>
          </div>
          <div>
            <span>02</span>
            <strong>Challenge</strong>
            <p>Anyone may identify an alleged contradiction or weakness.</p>
          </div>
          <div>
            <span>03</span>
            <strong>Respond</strong>
            <p>TA-14 preserves a bounded, attributable institutional response.</p>
          </div>
          <div>
            <span>04</span>
            <strong>Correct</strong>
            <p>Supported corrections are appended without erasing chronology.</p>
          </div>
          <div>
            <span>05</span>
            <strong>Preserve</strong>
            <p>The complete exchange remains part of the institutional record.</p>
          </div>
        </div>
      </section>

      <section className="completion shell">
        <div className="section-heading">
          <p className="eyebrow">Completion requirements</p>
          <h2>The next work is explicit.</h2>
        </div>

        <ol className="completion-list">
          {completionSteps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">Institutional boundary</p>
          <h2>Review does not create authority.</h2>
        </div>

        <p>
          A reviewer, registrant, critic, contributor, pilot participant, or
          external architecture does not acquire ownership, co-authorship,
          approval rights, veto power, interpretive control, institutional
          standing, or governance authority over TA-14 merely by examining,
          discussing, testing, citing, challenging, or using a public record.
        </p>
      </section>

      <section className="next-route shell">
        <div>
          <p className="eyebrow">Continue the build</p>
          <h2>The Foundation remains open until the full record is connected.</h2>
        </div>

        <div className="next-actions">
          <Link href="/foundation/concepts" className="button primary">
            Continue Canonical Concepts
          </Link>
          <Link href="/foundation/chronology" className="button secondary">
            Build the Chronology
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
              radial-gradient(circle at 50% -8%, rgba(72,113,224,.21), transparent 31%),
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
            filter: blur(110px);
            pointer-events: none;
          }

          .orb-one {
            width: 560px;
            height: 560px;
            top: 650px;
            left: -300px;
            background: rgba(51,106,255,.21);
            animation: floatOne 18s ease-in-out infinite alternate;
          }

          .orb-two {
            width: 660px;
            height: 660px;
            top: 2350px;
            right: -380px;
            background: rgba(143,79,255,.16);
            animation: floatTwo 22s ease-in-out infinite alternate;
          }

          .orb-three {
            width: 480px;
            height: 480px;
            top: 3900px;
            left: 20%;
            background: rgba(44,156,200,.1);
            animation: floatThree 20s ease-in-out infinite alternate;
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

          .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 30px;
            padding: 10px 15px;
            border: 1px solid rgba(155,190,255,.22);
            border-radius: 999px;
            color: #abc2f5;
            background: rgba(255,255,255,.03);
            font-size: 12px;
            font-weight: 780;
            letter-spacing: .06em;
            text-transform: uppercase;
          }

          .pulse {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #9ab8ff;
            box-shadow: 0 0 18px rgba(113,157,255,.9);
            animation: pulse 1.9s ease-in-out infinite;
          }

          .hero h1 {
            max-width: 1050px;
            margin: 0 auto;
            font-size: clamp(68px, 10vw, 140px);
            line-height: .9;
            letter-spacing: -.075em;
          }

          .hero-copy {
            max-width: 920px;
            margin: 38px auto 0;
            color: #bdc6d8;
            font-size: clamp(21px, 2.5vw, 30px);
            line-height: 1.62;
          }

          .hero-actions,
          .next-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
          }

          .hero-actions { justify-content: center; margin-top: 38px; }

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

          .declaration {
            padding: 54px;
            border: 1px solid rgba(255,255,255,.09);
            border-radius: 30px;
            background:
              radial-gradient(circle at 8% 12%, rgba(77,118,224,.15), transparent 35%),
              rgba(11,17,30,.84);
          }

          .declaration-label {
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
            max-width: 1030px;
            margin: 38px 0 28px;
            font-size: clamp(30px, 4vw, 50px);
            line-height: 1.2;
            letter-spacing: -.04em;
          }

          .declaration > p {
            max-width: 900px;
            margin: 0;
            color: #aeb8ca;
            font-size: 18px;
            line-height: 1.8;
          }

          .section-heading { max-width: 850px; margin-bottom: 38px; }

          .section-heading h2,
          .scrutiny h2,
          .boundary h2,
          .next-route h2,
          .footer-content h2 {
            margin: 0;
            font-size: clamp(36px, 5vw, 60px);
            line-height: 1.03;
            letter-spacing: -.048em;
          }

          .section-heading > p:last-child,
          .scrutiny-copy > p:last-child {
            color: #aab5c7;
            line-height: 1.76;
          }

          .section-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .section-card {
            min-height: 330px;
            padding: 28px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 24px;
            background: linear-gradient(180deg, rgba(16,23,40,.82), rgba(8,12,22,.88));
          }

          .card-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
          }

          .card-top span,
          .principle-grid span,
          .scrutiny-levels span,
          .completion-list span {
            color: #6e83ad;
            font-size: 11px;
            font-weight: 850;
          }

          .card-top small {
            padding: 7px 10px;
            border: 1px solid rgba(160,190,255,.18);
            border-radius: 999px;
            color: #9fb7eb;
            font-size: 9px;
            font-weight: 850;
            letter-spacing: .1em;
            text-transform: uppercase;
          }

          .section-card h3,
          .concept-card h3,
          .principle-grid h3 {
            margin: 38px 0 13px;
            font-size: 25px;
            letter-spacing: -.03em;
          }

          .section-card p,
          .concept-card p,
          .principle-grid p {
            color: #9faabd;
            line-height: 1.7;
          }

          .section-card a {
            display: inline-block;
            margin-top: 18px;
            color: #b9ccf8;
            font-size: 14px;
            font-weight: 760;
            text-decoration: none;
          }

          .published-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .concept-card {
            min-height: 290px;
            padding: 30px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 25px;
            color: inherit;
            background:
              radial-gradient(circle at 80% 10%, rgba(84,128,234,.13), transparent 34%),
              rgba(11,17,30,.8);
            text-decoration: none;
            transition: transform .2s ease, border-color .2s ease;
          }

          .concept-card:hover {
            transform: translateY(-4px);
            border-color: rgba(154,187,255,.34);
          }

          .concept-card > span {
            color: #849bd0;
            font-size: 10px;
            font-weight: 850;
            letter-spacing: .12em;
          }

          .principle-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }

          .principle-grid article {
            min-height: 270px;
            padding: 30px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 24px;
            background: rgba(11,17,30,.78);
          }

          .scrutiny {
            display: grid;
            grid-template-columns: .9fr 1.1fr;
            gap: 70px;
            align-items: start;
          }

          .scrutiny-levels {
            display: grid;
            gap: 12px;
          }

          .scrutiny-levels div {
            padding: 22px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 19px;
            background: rgba(11,17,30,.78);
          }

          .scrutiny-levels strong {
            display: block;
            margin-top: 14px;
            font-size: 20px;
          }

          .scrutiny-levels p {
            margin: 8px 0 0;
            color: #a5b0c3;
            line-height: 1.6;
          }

          .completion-list {
            display: grid;
            gap: 12px;
            margin: 0;
            padding: 0;
            list-style: none;
          }

          .completion-list li {
            display: grid;
            grid-template-columns: 54px 1fr;
            gap: 18px;
            align-items: center;
            min-height: 84px;
            padding: 18px 22px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 19px;
            background: rgba(11,17,30,.76);
          }

          .completion-list p {
            margin: 0;
            color: #bac4d5;
            font-size: 18px;
            line-height: 1.55;
          }

          .boundary,
          .next-route {
            display: grid;
            grid-template-columns: .85fr 1.15fr;
            gap: 60px;
            align-items: center;
            padding: 50px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 30px;
            background:
              radial-gradient(circle at 12% 15%, rgba(77,118,224,.14), transparent 32%),
              rgba(11,17,30,.82);
          }

          .boundary > p {
            margin: 0;
            color: #b1bbcc;
            font-size: 18px;
            line-height: 1.82;
          }

          .next-route {
            margin-bottom: 72px;
          }

          .next-actions { justify-content: flex-end; }

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

          @keyframes pulse {
            50% { opacity: .42; transform: scale(.78); }
          }

          @keyframes floatOne { to { transform: translate(100px, 120px); } }
          @keyframes floatTwo { to { transform: translate(-110px, -90px); } }
          @keyframes floatThree { to { transform: translate(120px, -70px); } }

          @media (max-width: 1000px) {
            nav { display: none; }
            .section-grid,
            .published-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .scrutiny,
            .boundary,
            .next-route { grid-template-columns: 1fr; }
            .next-actions { justify-content: flex-start; }
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

            .declaration,
            .boundary,
            .next-route {
              padding: 32px;
            }

            .section-grid,
            .published-grid,
            .principle-grid {
              grid-template-columns: 1fr;
            }

            .completion-list li {
              grid-template-columns: 38px 1fr;
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
