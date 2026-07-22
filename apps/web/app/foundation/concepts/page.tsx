import Link from "next/link";

const concepts = [
  {
    id: "TA-14-CONCEPT-001",
    title: "Admissibility",
    description:
      "The condition under which evidence, authority, continuity, and declared constraints are sufficient to support consequence-bearing reliance.",
    status: "Foundational",
    href: "/foundation/concepts/admissibility",
  },
  {
    id: "TA-14-CONCEPT-002",
    title: "Continuity",
    description:
      "The preserved connection between reality, record, identity, authority, sequence, and the conditions under which reliance remains justified.",
    status: "Foundational",
    href: "/foundation/concepts/continuity",
  },
  {
    id: "TA-14-CONCEPT-003",
    title: "Governed Record",
    description:
      "A preserved record with declared scope, provenance, evidence boundaries, version history, and explicit statements of what it proves and does not prove.",
    status: "Core",
    href: "/foundation/concepts/governed-record",
  },
  {
    id: "TA-14-CONCEPT-004",
    title: "Binding",
    description:
      "The point at which admissible evidence, authority, and conditions are connected to a specific proposed action before commitment.",
    status: "Core",
    href: "/foundation/concepts/binding",
  },
  {
    id: "TA-14-CONCEPT-005",
    title: "Commit",
    description:
      "The formal transition from an evaluated proposal into authorized consequence-bearing execution.",
    status: "Core",
    href: "/foundation/concepts/commit",
  },
  {
    id: "TA-14-CONCEPT-006",
    title: "Outcome",
    description:
      "The preserved resulting state after execution, including what changed, what did not change, and whether the declared objective was achieved.",
    status: "Core",
    href: "/foundation/concepts/outcome",
  },
  {
    id: "TA-14-CONCEPT-007",
    title: "Diagnostic Determination",
    description:
      "An evidence-bound, rule-constrained determination that remains separate from the original record and from the intervention that may follow.",
    status: "Domain-spanning",
    href: "/foundation/concepts/diagnostic-determination",
  },
  {
    id: "TA-14-CONCEPT-008",
    title: "Admissibility Drift",
    description:
      "A change in the conditions supporting reliance, where a previously acceptable route, record, authority, or evidence basis may no longer remain admissible.",
    status: "Domain-spanning",
    href: "/foundation/concepts/admissibility-drift",
  },
  {
    id: "TA-14-CONCEPT-009",
    title: "Institutional Continuity",
    description:
      "The preservation of public memory through corrections, disputes, supersessions, revocations of future reliance, and attributable chronology.",
    status: "Institutional",
    href: "/foundation/concepts/institutional-continuity",
  },
];

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

export default function FoundationConceptsPage() {
  return (
    <main className="concepts-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

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
          <Link href="/foundation/about-ta14">About TA-14</Link>
          <Link href="/foundation/architectures">Architectures</Link>
          <Link href="/foundation/publications">Publications</Link>
        </nav>
      </header>

      <section className="hero shell">
        <p className="eyebrow">Concept Explorer</p>
        <h1>
          The language of
          <span>admissible execution.</span>
        </h1>
        <p className="lead">
          The TA-14 public canon begins with defined concepts. Each concept
          remains connected to its place in the parent architecture, its
          supporting publications, its evidence, its related systems, and its
          operational implications.
        </p>

        <div className="hero-actions">
          <a href="#concept-directory" className="button primary">
            Browse Concepts
          </a>
          <Link href="/foundation/architectures" className="button secondary">
            Explore Architectures
          </Link>
        </div>
      </section>

      <section className="chain-section shell">
        <div className="section-heading centered">
          <p className="eyebrow">Parent sequence</p>
          <h2>Every concept must remain legible inside the full chain.</h2>
        </div>

        <div className="chain">
          {chain.map((item, index) => (
            <div className="chain-item" key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section id="concept-directory" className="directory shell">
        <div className="section-heading">
          <p className="eyebrow">Canonical concept directory</p>
          <h2>Foundational definitions, preserved in one public system.</h2>
          <p>
            The first release establishes the concept inventory and one complete
            vertical slice beginning with Admissibility. Additional pages may be
            published incrementally without changing the structure of the canon.
          </p>
        </div>

        <div className="concept-grid">
          {concepts.map((concept, index) => (
            <article className="concept-card" key={concept.id}>
              <div className="concept-meta">
                <span>{concept.id}</span>
                <small>{concept.status}</small>
              </div>

              <div>
                <p className="concept-number">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3>{concept.title}</h3>
                <p>{concept.description}</p>
              </div>

              <Link href={concept.href}>Open concept →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="method shell">
        <div className="section-heading">
          <p className="eyebrow">Concept page standard</p>
          <h2>Every published concept follows the same evidentiary pattern.</h2>
        </div>

        <div className="method-grid">
          <article>
            <span>01</span>
            <h3>Canonical definition</h3>
            <p>
              A concise public definition that can be cited without importing
              unrelated claims or hidden implementation assumptions.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>Architectural position</h3>
            <p>
              The exact relationship between the concept and the Chain of Eight,
              including upstream dependencies and downstream consequence.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Claims and non-claims</h3>
            <p>
              What the concept establishes, what it does not establish, and the
              limits of authority or interpretation attached to it.
            </p>
          </article>

          <article>
            <span>04</span>
            <h3>Publication lineage</h3>
            <p>
              Books, articles, declarations, patents, evidence records, and
              later revisions connected through attributable chronology.
            </p>
          </article>

          <article>
            <span>05</span>
            <h3>Operational destinations</h3>
            <p>
              Links to the Exchange, Registry, Academy, governed records,
              demonstrations, and domain-specific architectures.
            </p>
          </article>

          <article>
            <span>06</span>
            <h3>Challenge and supersession</h3>
            <p>
              Corrections, disputes, superseding definitions, or later evidence
              are appended as new records rather than silently rewriting history.
            </p>
          </article>
        </div>
      </section>

      <section className="featured shell">
        <div>
          <p className="eyebrow">First complete concept</p>
          <h2>Admissibility</h2>
          <p>
            Admissibility is where evidence, continuity, authority, and declared
            constraints become sufficient—or insufficient—to support reliance
            before consequence attaches.
          </p>
        </div>

        <Link
          href="/foundation/concepts/admissibility"
          className="button primary"
        >
          Open Admissibility
        </Link>
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

          body {
            margin: 0;
            background: #05070c;
          }

          .concepts-page {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            color: #f6f8fc;
            background:
              radial-gradient(circle at 50% -8%, rgba(67, 107, 222, .18), transparent 30%),
              linear-gradient(180deg, #060913 0%, #090d17 52%, #05070c 100%);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          .concepts-page::before {
            content: "";
            position: fixed;
            inset: 0;
            pointer-events: none;
            opacity: .28;
            background-image:
              linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
            background-size: 66px 66px;
            mask-image: linear-gradient(to bottom, black, transparent 88%);
          }

          .ambient {
            position: absolute;
            border-radius: 50%;
            filter: blur(100px);
            opacity: .24;
            pointer-events: none;
          }

          .ambient-one {
            width: 560px;
            height: 560px;
            top: 520px;
            left: -290px;
            background: rgba(63, 114, 255, .3);
            animation: driftOne 18s ease-in-out infinite alternate;
          }

          .ambient-two {
            width: 620px;
            height: 620px;
            top: 1480px;
            right: -330px;
            background: rgba(151, 93, 255, .2);
            animation: driftTwo 22s ease-in-out infinite alternate;
          }

          .shell {
            position: relative;
            z-index: 2;
            width: min(1180px, calc(100% - 40px));
            margin: 0 auto;
            padding: 82px 0;
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

          .brand-copy {
            display: grid;
            gap: 3px;
          }

          .brand-copy strong {
            font-size: 16px;
            letter-spacing: .04em;
          }

          .brand-copy small {
            color: #98a5bb;
            font-size: 12px;
          }

          nav {
            display: flex;
            gap: 24px;
          }

          nav a {
            color: #aeb9cc;
            font-size: 14px;
            text-decoration: none;
          }

          nav a:hover { color: white; }

          .eyebrow {
            margin: 0 0 14px;
            color: #8faefc;
            font-size: 12px;
            font-weight: 850;
            letter-spacing: .18em;
            text-transform: uppercase;
          }

          .hero {
            padding-top: 112px;
            text-align: center;
          }

          .hero h1 {
            max-width: 900px;
            margin: 0 auto;
            font-size: clamp(50px, 7.5vw, 90px);
            line-height: .97;
            letter-spacing: -.06em;
          }

          .hero h1 span {
            display: block;
            color: #9eb7ef;
          }

          .lead {
            max-width: 820px;
            margin: 30px auto 0;
            color: #b6c0d1;
            font-size: clamp(18px, 2vw, 22px);
            line-height: 1.75;
          }

          .hero-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 14px;
            margin-top: 34px;
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

          .primary {
            color: #07101f;
            background: linear-gradient(135deg, #f9fbff, #abc6ff);
          }

          .secondary {
            color: #e6edfc;
            border: 1px solid rgba(159,188,255,.28);
            background: rgba(255,255,255,.035);
          }

          .section-heading {
            max-width: 790px;
            margin-bottom: 38px;
          }

          .section-heading.centered {
            margin-right: auto;
            margin-left: auto;
            text-align: center;
          }

          .section-heading h2,
          .featured h2,
          .footer-content h2 {
            margin: 0;
            font-size: clamp(34px, 5vw, 58px);
            line-height: 1.03;
            letter-spacing: -.045em;
          }

          .section-heading > p:last-child {
            color: #aab5c7;
            line-height: 1.75;
          }

          .chain {
            display: grid;
            grid-template-columns: repeat(8, minmax(0, 1fr));
            gap: 10px;
            margin-top: 42px;
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

          .chain-item span {
            color: #6e83ad;
            font-size: 11px;
            font-weight: 850;
          }

          .chain-item strong {
            margin-top: 10px;
            font-size: 15px;
          }

          .concept-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .concept-card {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 330px;
            padding: 28px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 24px;
            background:
              linear-gradient(180deg, rgba(16,23,40,.82), rgba(8,12,22,.88));
          }

          .concept-card::after {
            content: "";
            position: absolute;
            width: 180px;
            height: 180px;
            right: -95px;
            bottom: -95px;
            border-radius: 50%;
            background: rgba(73,117,255,.1);
          }

          .concept-meta {
            display: flex;
            justify-content: space-between;
            gap: 12px;
          }

          .concept-meta span,
          .concept-meta small {
            color: #7186b1;
            font-size: 10px;
            font-weight: 850;
            letter-spacing: .1em;
            text-transform: uppercase;
          }

          .concept-number {
            margin: 34px 0 12px;
            color: #6682c4 !important;
            font-size: 12px;
            font-weight: 850;
          }

          .concept-card h3 {
            margin: 0 0 13px;
            font-size: 25px;
            letter-spacing: -.03em;
          }

          .concept-card p {
            margin: 0;
            color: #a4afc1;
            line-height: 1.68;
          }

          .concept-card a {
            position: relative;
            z-index: 2;
            margin-top: 30px;
            color: #b5caff;
            font-size: 14px;
            font-weight: 780;
            text-decoration: none;
          }

          .method-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .method-grid article {
            min-height: 250px;
            padding: 26px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 22px;
            background: rgba(11,17,30,.76);
          }

          .method-grid span {
            color: #6f86b9;
            font-size: 11px;
            font-weight: 850;
          }

          .method-grid h3 {
            margin: 28px 0 12px;
            font-size: 21px;
            letter-spacing: -.02em;
          }

          .method-grid p {
            margin: 0;
            color: #9faabd;
            line-height: 1.67;
          }

          .featured {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 40px;
            margin-bottom: 72px;
            padding: 50px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 30px;
            background:
              radial-gradient(circle at 12% 15%, rgba(77,118,224,.15), transparent 32%),
              rgba(11,17,30,.82);
          }

          .featured > div {
            max-width: 760px;
          }

          .featured p:last-child {
            color: #aab5c7;
            line-height: 1.75;
          }

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

          .footer-content h2 {
            font-size: clamp(32px, 4vw, 52px);
          }

          .steward {
            margin: 13px 0 34px;
            color: #aab5c8;
            font-size: 17px;
          }

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

          @keyframes driftOne {
            to { transform: translate(100px, 120px); }
          }

          @keyframes driftTwo {
            to { transform: translate(-110px, -90px); }
          }

          @media (max-width: 1000px) {
            nav { display: none; }

            .chain {
              grid-template-columns: repeat(4, minmax(0, 1fr));
            }

            .concept-grid,
            .method-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .institutional-footer {
              grid-template-columns: 1fr;
            }

            .contact-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 760px) {
            .topbar,
            .shell,
            .institutional-footer {
              width: min(100% - 28px, 1180px);
            }

            .hero {
              padding-top: 82px;
            }

            .chain {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .concept-grid,
            .method-grid {
              grid-template-columns: 1fr;
            }

            .featured {
              align-items: stretch;
              flex-direction: column;
              padding: 32px;
            }

            .institutional-footer {
              padding: 34px 26px;
            }

            .footer-seal {
              width: 132px;
              height: 132px;
            }

            .footer-principles {
              display: grid;
              gap: 8px;
            }
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
