import Link from "next/link";

const chronologyEntries = [
  {
    date: "May 1, 2025",
    type: "Publication",
    title: "The Atmospheric Integrity Network",
    body:
      "Earliest identified public publication of the TA-14 chain and the admissibility-centered governance direction later expanded across environmental and execution domains.",
    status: "Public record",
  },
  {
    date: "December 14, 2025",
    type: "Patent filing",
    title: "Standardized HVAC Diagnostic & Electrical Integrity — Provisional",
    body:
      "Provisional filing associated with evidence-bound diagnostic sequence, electrical integrity, and standardized technical execution.",
    status: "Filed",
  },
  {
    date: "December 19, 2025",
    type: "Patent filing",
    title: "Standardized HVAC Diagnostic & Electrical Integrity — Non-Provisional",
    body:
      "Non-provisional filing extending the governed diagnostic and electrical integrity architecture into a formal patent record.",
    status: "Filed",
  },
  {
    date: "January 9, 2026",
    type: "Patent filing",
    title: "Analyzer-Driven Refrigerant Governor",
    body:
      "Provisional filing for evidence-bound refrigerant charging, custody, sequencing, lockout, and governed execution controls.",
    status: "Filed",
  },
  {
    date: "January 12, 2026",
    type: "Canonical declaration",
    title: "Diagnostic Truth as Diagnostic Determination",
    body:
      "TA-14 formally declared that diagnostic truth must be expressed as a diagnostic determination: evidence-bound, rule-constrained, attributable, and separated from intervention.",
    status: "Declared",
  },
  {
    date: "June 2026",
    type: "Architecture",
    title: "Twenty-Four-Link Admissibility Chain",
    body:
      "The runtime admissibility gate was expanded into a twenty-four-link chain supporting ALLOW, HOLD, DENY, and ESCALATE route classifications.",
    status: "Published in development record",
  },
  {
    date: "June 10, 2026",
    type: "Publication",
    title: "Environmental Integrity Governance",
    body:
      "Published work defining atmospheric integrity records and the governance of air reality within the broader TA-14 environmental integrity architecture.",
    status: "Published",
  },
  {
    date: "June 10, 2026",
    type: "Publication",
    title: "Admissible Reality: Why AI Fails Before Execution",
    body:
      "Published work extending TA-14 principles into AI governance, execution boundaries, admissibility, and the separation between evidence and action.",
    status: "Published",
  },
  {
    date: "June 2026",
    type: "Public architecture",
    title: "Partner Review Network",
    body:
      "TA-14 described a review-network model built around independent architectures, written boundaries, specialized review layers, and second-layer route review.",
    status: "Publicly described",
  },
  {
    date: "July 2026",
    type: "Platform",
    title: "TA-14 AI Governance Exchange",
    body:
      "The Exchange entered public development as a free governance playground for route building, governed records, verification, execution mapping, and preserved testing.",
    status: "Public development",
  },
  {
    date: "July 2026",
    type: "Institution",
    title: "TA-14 AI Governance Registry",
    body:
      "The Registry was defined as a dated, searchable, attributable record of governance architectures, claims, boundaries, supporting evidence, versions, and disputes.",
    status: "Public development",
  },
  {
    date: "July 2026",
    type: "Foundation",
    title: "TA-14 Foundation Public Canon",
    body:
      "The Foundation began publication as the public institutional layer for concepts, chronology, architectures, publications, evidence, corrections, and universal scrutiny.",
    status: "In progress",
  },
];

const recordClasses = [
  {
    title: "Publication records",
    body:
      "Books, articles, papers, public declarations, and other works that preserve the date, language, scope, and public availability of TA-14 claims.",
  },
  {
    title: "Repository records",
    body:
      "Commits, releases, files, deployment history, schemas, and public source artifacts showing how the architecture and platform changed over time.",
  },
  {
    title: "Filing records",
    body:
      "Patent applications, registrations, identifiers, and related records that preserve formal dates without automatically proving validity, scope, or ownership beyond the record itself.",
  },
  {
    title: "Declaration records",
    body:
      "Dated statements establishing definitions, distinctions, boundaries, doctrines, methods, and governing principles.",
  },
  {
    title: "Correction records",
    body:
      "Later records that identify errors, ambiguities, changed terminology, withdrawn claims, or superseded interpretations without deleting the original chronology.",
  },
  {
    title: "Challenge records",
    body:
      "Allegations, responses, evidence, observations, and competent findings preserved as distinct categories so criticism does not become a conclusion by appearance.",
  },
];

const chronologyRules = [
  "Every material entry must carry a date or a clearly declared date range.",
  "Each entry must identify its record class and supporting source.",
  "Later corrections must be appended rather than silently substituted.",
  "Publication proves publication, not universal validity or priority.",
  "A filing proves that a filing record exists, not that every claim is granted.",
  "A public statement proves what was stated, not that the statement is accurate.",
  "Disputed chronology remains visible together with the dispute and response.",
  "Where dates remain uncertain, uncertainty must be declared rather than guessed.",
];

const nextBuilds = [
  {
    title: "Source-linked timeline",
    body:
      "Connect every chronology entry to a public publication, repository artifact, filing record, archived page, declaration, or preserved evidence record.",
  },
  {
    title: "Claim-to-record matrix",
    body:
      "Show which dated records support each institutional claim, concept, architecture, and boundary.",
  },
  {
    title: "Correction ledger",
    body:
      "Publish every material correction, changed date, revised title, superseded term, or withdrawn assertion as a separate record.",
  },
  {
    title: "Public challenge route",
    body:
      "Allow any person to challenge chronology entries and preserve the allegation, response, evidence, and final status without erasing history.",
  },
];

export default function FoundationChronologyPage() {
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
        <div className="record-id">TA-14-CHRONOLOGY-001</div>
        <p className="eyebrow">Public institutional record</p>
        <h1>TA-14 Chronology</h1>
        <p className="hero-copy">
          A dated, attributable, correctable, and publicly inspectable record of
          how TA-14 concepts, architectures, publications, filings, platforms,
          and institutional claims developed over time.
        </p>

        <div className="hero-actions">
          <a href="#timeline" className="button primary">
            Review the Timeline
          </a>
          <Link href="/foundation/completion" className="button secondary">
            Foundation Completion Route
          </Link>
        </div>
      </section>

      <section className="declaration shell">
        <div className="declaration-label">
          <span>Chronology declaration</span>
          <small>Version 1.0</small>
        </div>

        <blockquote>
          The TA-14 chronology is not a promotional history. It is a governed
          institutional record that must remain open to correction, dispute,
          evidence, and independent scrutiny.
        </blockquote>

        <p>
          Each entry preserves what the available record supports and no more.
          Dates, titles, claims, and classifications may be challenged. Supported
          corrections will be added as new attributable records while the earlier
          chronology remains visible.
        </p>
      </section>

      <section className="method shell">
        <div className="section-heading">
          <p className="eyebrow">Chronology method</p>
          <h2>The timeline separates existence, claim, evidence, and finding.</h2>
          <p>
            A publication date proves that a work was published. A filing date
            proves that a filing record exists. A declaration proves what was
            declared. None automatically proves universal validity, legal
            priority, technical correctness, ownership, or admissibility.
          </p>
        </div>

        <div className="method-grid">
          <article>
            <span>01</span>
            <h3>Record</h3>
            <p>The dated artifact or event is preserved.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Claim</h3>
            <p>The institutional meaning asserted from that record is stated.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Boundary</h3>
            <p>What the record does not establish is declared.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Challenge</h3>
            <p>Contradictory evidence or disputed chronology is preserved.</p>
          </article>
        </div>
      </section>

      <section id="timeline" className="timeline-section shell">
        <div className="section-heading">
          <p className="eyebrow">Public timeline</p>
          <h2>Initial institutional chronology.</h2>
          <p>
            This first chronology establishes the structure. Each entry should
            later connect to its supporting public source, citation, repository
            artifact, filing record, or preserved declaration.
          </p>
        </div>

        <div className="timeline">
          {chronologyEntries.map((entry, index) => (
            <article className="timeline-entry" key={`${entry.date}-${entry.title}`}>
              <div className="timeline-marker">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <div className="timeline-date">
                <strong>{entry.date}</strong>
                <small>{entry.type}</small>
              </div>

              <div className="timeline-content">
                <div className="entry-heading">
                  <h3>{entry.title}</h3>
                  <span>{entry.status}</span>
                </div>
                <p>{entry.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="record-classes shell">
        <div className="section-heading">
          <p className="eyebrow">Chronology record classes</p>
          <h2>The story must be supported by inspectable record types.</h2>
        </div>

        <div className="class-grid">
          {recordClasses.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rules shell">
        <div className="rules-copy">
          <p className="eyebrow">Chronology rules</p>
          <h2>The record cannot be made stronger by presentation.</h2>
          <p>
            Every entry must remain bounded by what its supporting evidence
            actually proves. Missing sources, uncertain dates, disputed claims,
            and changed terminology must be visible.
          </p>
        </div>

        <ol className="rule-list">
          {chronologyRules.map((rule, index) => (
            <li key={rule}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{rule}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="scrutiny shell">
        <div>
          <p className="eyebrow">Public scrutiny</p>
          <h2>The chronology belongs to the record, not to a preferred reviewer.</h2>
        </div>

        <p>
          No partner, critic, registrant, reviewer, institution, or private pilot
          receives exclusive authority to determine what TA-14 is. Anyone may
          inspect the same public chronology, challenge an entry, provide
          contradictory evidence, or propose a correction. The standing of the
          challenge depends on the evidence supporting it.
        </p>
      </section>

      <section className="next-build shell">
        <div className="section-heading">
          <p className="eyebrow">Next chronology work</p>
          <h2>The structure is public. The next step is source binding.</h2>
        </div>

        <div className="next-grid">
          {nextBuilds.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="citation shell">
        <div>
          <p className="eyebrow">Recommended citation</p>
          <h2>TA-14-CHRONOLOGY-001</h2>
          <p>
            TA-14 Authority Governance Institution. “TA-14 Chronology.”
            TA-14 Foundation Public Canon of Admissible Execution, Version 1.0.
          </p>
        </div>

        <div className="citation-actions">
          <Link href="/foundation/completion" className="button secondary">
            Foundation Completion
          </Link>
          <Link href="/foundation" className="button primary">
            Foundation Home
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
            mask-image: linear-gradient(to bottom, black, transparent 94%);
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
            top: 720px;
            left: -310px;
            background: rgba(51,106,255,.21);
            animation: floatOne 18s ease-in-out infinite alternate;
          }

          .orb-two {
            width: 660px;
            height: 660px;
            top: 2700px;
            right: -390px;
            background: rgba(143,79,255,.16);
            animation: floatTwo 22s ease-in-out infinite alternate;
          }

          .orb-three {
            width: 500px;
            height: 500px;
            top: 4550px;
            left: 18%;
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

          .record-id {
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
            max-width: 1080px;
            margin: 0 auto;
            font-size: clamp(68px, 10vw, 140px);
            line-height: .9;
            letter-spacing: -.075em;
          }

          .hero-copy {
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
          .rules h2,
          .scrutiny h2,
          .citation h2,
          .footer-content h2 {
            margin: 0;
            font-size: clamp(36px, 5vw, 60px);
            line-height: 1.03;
            letter-spacing: -.048em;
          }

          .section-heading > p:last-child,
          .rules-copy > p:last-child {
            color: #aab5c7;
            line-height: 1.76;
          }

          .method-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
          }

          .method-grid article,
          .class-grid article,
          .next-grid article {
            min-height: 240px;
            padding: 28px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 23px;
            background: rgba(11,17,30,.78);
          }

          .method-grid span,
          .class-grid span,
          .next-grid span,
          .rule-list span {
            color: #6e83ad;
            font-size: 11px;
            font-weight: 850;
          }

          .method-grid h3,
          .class-grid h3,
          .next-grid h3 {
            margin: 32px 0 12px;
            font-size: 23px;
            letter-spacing: -.025em;
          }

          .method-grid p,
          .class-grid p,
          .next-grid p {
            margin: 0;
            color: #9faabd;
            line-height: 1.68;
          }

          .timeline {
            position: relative;
            display: grid;
            gap: 16px;
          }

          .timeline::before {
            content: "";
            position: absolute;
            top: 26px;
            bottom: 26px;
            left: 28px;
            width: 1px;
            background: linear-gradient(to bottom, rgba(139,171,243,.55), rgba(139,171,243,.08));
          }

          .timeline-entry {
            position: relative;
            display: grid;
            grid-template-columns: 58px 170px 1fr;
            gap: 24px;
            align-items: start;
            padding: 26px 28px 26px 0;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 22px;
            background: linear-gradient(180deg, rgba(15,22,38,.82), rgba(9,13,24,.88));
          }

          .timeline-marker {
            position: relative;
            z-index: 2;
            display: grid;
            place-items: center;
            width: 58px;
            min-height: 58px;
          }

          .timeline-marker::before {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            border: 4px solid #09101e;
            border-radius: 50%;
            background: #8cacf5;
            box-shadow: 0 0 22px rgba(104,151,255,.7);
          }

          .timeline-marker span {
            position: absolute;
            left: -42px;
            color: #5f739d;
            font-size: 9px;
            font-weight: 850;
          }

          .timeline-date {
            display: grid;
            gap: 8px;
            padding-top: 5px;
          }

          .timeline-date strong {
            font-size: 15px;
            letter-spacing: -.01em;
          }

          .timeline-date small {
            color: #7f94c0;
            font-size: 10px;
            font-weight: 850;
            letter-spacing: .12em;
            text-transform: uppercase;
          }

          .entry-heading {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 18px;
          }

          .entry-heading h3 {
            margin: 0;
            font-size: 23px;
            letter-spacing: -.03em;
          }

          .entry-heading span {
            flex: none;
            padding: 7px 10px;
            border: 1px solid rgba(159,190,255,.18);
            border-radius: 999px;
            color: #9fb7eb;
            font-size: 9px;
            font-weight: 850;
            letter-spacing: .09em;
            text-transform: uppercase;
          }

          .timeline-content p {
            margin: 14px 0 0;
            color: #a6b1c4;
            line-height: 1.7;
          }

          .class-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .rules {
            display: grid;
            grid-template-columns: .88fr 1.12fr;
            gap: 70px;
            align-items: start;
          }

          .rule-list {
            display: grid;
            gap: 12px;
            margin: 0;
            padding: 0;
            list-style: none;
          }

          .rule-list li {
            display: grid;
            grid-template-columns: 42px 1fr;
            gap: 14px;
            align-items: start;
            padding: 20px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 18px;
            background: rgba(11,17,30,.78);
          }

          .rule-list p {
            margin: 0;
            color: #b1bbcd;
            line-height: 1.65;
          }

          .scrutiny {
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

          .scrutiny > p {
            margin: 0;
            color: #b1bbcc;
            font-size: 18px;
            line-height: 1.82;
          }

          .next-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
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
          @keyframes floatThree { to { transform: translate(120px, -70px); } }

          @media (max-width: 1000px) {
            nav { display: none; }
            .method-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .class-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .rules,
            .scrutiny { grid-template-columns: 1fr; }
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
            .scrutiny,
            .citation {
              padding: 32px;
            }

            .method-grid,
            .class-grid,
            .next-grid {
              grid-template-columns: 1fr;
            }

            .timeline-entry {
              grid-template-columns: 46px 1fr;
              gap: 14px;
              padding-right: 20px;
            }

            .timeline::before { left: 22px; }
            .timeline-marker { width: 46px; }
            .timeline-marker span { display: none; }

            .timeline-date {
              grid-column: 2;
              padding-top: 0;
            }

            .timeline-content {
              grid-column: 2;
            }

            .entry-heading {
              display: grid;
            }

            .entry-heading span {
              justify-self: start;
            }

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
