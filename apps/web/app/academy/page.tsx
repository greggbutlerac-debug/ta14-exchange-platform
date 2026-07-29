import Link from "next/link";

export const metadata = {
  title: "TA-14 Academy | The Seventh Door",
  description:
    "Enter the TA-14 Academy, the educational operating system of the TA-14 AI Governance Exchange. Learn governance, inspect architecture, build governed routes, simulate, review, and prove competency.",
};

const anchors = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

const pathways = [
  {
    number: "01",
    eyebrow: "Foundations",
    title: "Learn how governed execution begins.",
    description:
      "Understand the difference between a workflow and a governed route, between a record and admissible evidence, and between completion and permission to proceed.",
    href: "/academy/what-is-a-route",
    action: "Begin foundations",
    status: "Available now",
  },
  {
    number: "02",
    eyebrow: "Architecture",
    title: "Inspect the chain before you build.",
    description:
      "Explore the eight visible anchors of the TA-14 architecture while preserving the distinction between those anchors and the verified complete 24-link runtime chain.",
    href: "#architecture",
    action: "Explore the anchors",
    status: "Orientation",
  },
  {
    number: "03",
    eyebrow: "Route Builder",
    title: "Move from uncertainty to a governed route.",
    description:
      "Use bounded questions, preserved gaps, explicit evidence, valid authority, continuity testing, and supported determinations to construct consequence-bearing routes.",
    href: "/workspace/build",
    action: "Open Route Builder",
    status: "Connected system",
  },
  {
    number: "04",
    eyebrow: "Review and verification",
    title: "Challenge, correct, and preserve what matters.",
    description:
      "Learn how findings, objections, corrections, versions, simulations, and outcomes remain attributable, challengeable, and connected to authoritative Exchange systems.",
    href: "/verify",
    action: "Open verification",
    status: "Connected system",
  },
];

const capabilities = [
  ["Mission Control", "One place to resume learning, routes, reviews, simulations, and credential progress."],
  ["Guided construction", "A calm, one-question-at-a-time experience for building a first governed route."],
  ["Execution simulation", "Test conditions and find the earliest failure before any real-world consequence occurs."],
  ["Bounded review", "Preserve findings and corrections without pretending missing evidence or authority exists."],
  ["Competency evidence", "Separate attendance and completion from demonstrated, scope-bounded capability."],
  ["Registry connection", "Return authorized credential events to the existing Registry instead of duplicating it."],
];

export default function AcademyPage() {
  return (
    <main className="academy">
      <div className="cosmos" aria-hidden="true">
        <span className="nebula nebulaOne" />
        <span className="nebula nebulaTwo" />
        <span className="planet planetOne" />
        <span className="planet planetTwo" />
        <span className="orbit orbitOne" />
        <span className="orbit orbitTwo" />
        <span className="meteor meteorOne" />
        <span className="meteor meteorTwo" />
        <span className="meteor meteorThree" />
        <span className="stars starsOne" />
        <span className="stars starsTwo" />
      </div>

      <header className="topbar">
        <Link className="brand" href="/" aria-label="Return to the TA-14 Exchange entrance">
          <span className="brandShield">TA-14</span>
          <span className="brandCopy">
            <strong>TA-14 Academy</strong>
            <small>Seventh major door of the Exchange</small>
          </span>
        </Link>

        <nav className="topnav" aria-label="Academy primary navigation">
          <a href="#start">Start Here</a>
          <a href="#architecture">Architecture</a>
          <a href="#pathways">Pathways</a>
          <Link href="/login">Sign in</Link>
        </nav>
      </header>

      <section className="hero" id="start">
        <div className="heroCopy">
          <div className="doorLabel">
            <span>07</span>
            <p>The seventh institutional door is now being opened.</p>
          </div>

          <p className="eyebrow">The educational operating system for AI governance</p>
          <h1>
            Learn how consequential AI
            <em> earns the right to proceed.</em>
          </h1>
          <p className="heroSummary">
            TA-14 Academy turns governance architecture into a guided, inspectable,
            practical learning experience. Understand the system. Build the route.
            Test the conditions. Preserve the evidence. Prove the competency.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="/academy/what-is-a-route">
              <span>Start Here</span>
              <b aria-hidden="true">→</b>
            </Link>
            <a className="secondaryButton" href="#architecture">
              Explore the architecture
            </a>
          </div>

          <div className="boundaryRow" aria-label="Academy boundaries">
            <span>Education before tools</span>
            <span>Competency before credentials</span>
            <span>Evidence before execution</span>
          </div>
        </div>

        <aside className="portal" aria-label="TA-14 Academy seventh door">
          <div className="portalHalo portalHaloOuter" />
          <div className="portalHalo portalHaloInner" />
          <div className="portalFrame">
            <div className="portalNumber">7</div>
            <div className="portalCore">
              <span className="academyMark">AC</span>
              <strong>TA-14</strong>
              <p>ACADEMY</p>
            </div>
          </div>
          <p className="portalCaption">One Academy. One canonical entrance. No duplicate institution.</p>
        </aside>
      </section>

      <section className="principleBand" aria-label="Governing principle">
        <div>
          <p>Governing principle</p>
          <h2>No admissible evidence. No admissible execution.</h2>
        </div>
        <p>
          The Academy may explain, guide, and challenge. It may never fabricate evidence,
          invent authority, erase uncertainty, or silently select a favorable determination.
        </p>
      </section>

      <section className="architecture" id="architecture">
        <div className="sectionIntro">
          <div>
            <p className="eyebrow">Architecture orientation</p>
            <h2>See the complete governing movement before entering the tools.</h2>
          </div>
          <p>
            These eight visible anchors provide the public orientation. They remain distinct
            from TA-14&apos;s verified complete 24-link runtime architecture.
          </p>
        </div>

        <ol className="chainRail" aria-label="Eight visible TA-14 architecture anchors">
          {anchors.map((anchor, index) => (
            <li key={anchor}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{anchor}</strong>
              {index < anchors.length - 1 ? <b aria-hidden="true">→</b> : null}
            </li>
          ))}
        </ol>

        <div className="architectureStatement">
          <span className="pulse" aria-hidden="true" />
          <p>
            Zero Trust asks whether an actor and request should be trusted. Admissible execution
            asks whether this specific action has earned the right to bind to reality now.
          </p>
        </div>
      </section>

      <section className="pathways" id="pathways">
        <div className="sectionIntro">
          <div>
            <p className="eyebrow">Choose your path</p>
            <h2>A clear next step for every person who enters.</h2>
          </div>
          <p>
            Nobody should arrive at a complex governance tool and be left wondering what to do.
            The Academy begins with understanding, then moves toward construction and proof.
          </p>
        </div>

        <div className="pathwayGrid">
          {pathways.map((pathway) => (
            <article className="pathwayCard" key={pathway.number}>
              <div className="cardTopline">
                <span>{pathway.number}</span>
                <small>{pathway.status}</small>
              </div>
              <p className="cardEyebrow">{pathway.eyebrow}</p>
              <h3>{pathway.title}</h3>
              <p>{pathway.description}</p>
              <Link href={pathway.href}>
                {pathway.action}
                <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="guidedExperience">
        <div className="guidedCopy">
          <p className="eyebrow">A guided experience without governance shortcuts</p>
          <h2>Complex architecture. Calm conversation. One bounded question at a time.</h2>
          <p>
            The Academy will guide learners through purpose, actors, consequence, boundary,
            reality, records, evidence, authority, continuity, admissibility, determination,
            and preservation—without ever pretending that a missing answer has been supplied.
          </p>

          <div className="questionPreview">
            <span>Step 1 of 12</span>
            <strong>What action are you trying to govern?</strong>
            <p>Describe the exact action that could produce a consequence in the world.</p>
            <div>
              <span>Plain-language guidance</span>
              <span>Examples without answer selection</span>
              <span>“I do not know” remains unresolved</span>
            </div>
          </div>
        </div>

        <div className="capabilityGrid">
          {capabilities.map(([title, description], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="finalCallout">
        <div>
          <p className="eyebrow">Enter the seventh door</p>
          <h2>Governance becomes useful when people can understand it, practice it, and prove it.</h2>
        </div>
        <div className="finalActions">
          <Link className="primaryButton" href="/academy/what-is-a-route">
            Begin with the first lesson <b aria-hidden="true">→</b>
          </Link>
          <Link className="secondaryButton" href="/">
            Return to the Exchange
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>TA-14 Academy</strong>
          <span>Seventh major door of the TA-14 AI Governance Exchange</span>
        </div>
        <p>No admissible evidence. No admissible execution.</p>
      </footer>

      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #02060b; color: #f4f8f6; }
        a { color: inherit; text-decoration: none; }

        .academy {
          --green: #82f35b;
          --green-soft: #b7ff9e;
          --cyan: #65e9ff;
          --gold: #dfbd73;
          --ink: #02060b;
          --panel: rgba(6, 14, 21, .78);
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 72% 10%, rgba(68, 173, 111, .16), transparent 24%),
            radial-gradient(circle at 15% 30%, rgba(35, 125, 168, .13), transparent 30%),
            linear-gradient(180deg, #02060b 0%, #061017 52%, #02060b 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .cosmos { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .stars { position: absolute; inset: 0; opacity: .75; }
        .starsOne { background-image: radial-gradient(circle, rgba(255,255,255,.95) 0 1px, transparent 1.5px); background-size: 79px 79px; animation: starDrift 50s linear infinite; }
        .starsTwo { background-image: radial-gradient(circle, rgba(124,233,255,.8) 0 1px, transparent 1.5px); background-size: 131px 131px; background-position: 31px 17px; animation: starDrift 80s linear infinite reverse; }
        .nebula { position: absolute; width: 520px; height: 520px; border-radius: 50%; filter: blur(75px); opacity: .13; animation: breathe 9s ease-in-out infinite; }
        .nebulaOne { top: 150px; right: -180px; background: #2df275; }
        .nebulaTwo { top: 920px; left: -230px; background: #2ba9ff; animation-delay: -4s; }
        .planet { position: absolute; border-radius: 50%; box-shadow: inset -25px -18px 45px rgba(0,0,0,.8), 0 0 45px rgba(72,174,255,.13); }
        .planetOne { width: 94px; height: 94px; top: 180px; left: 6%; background: radial-gradient(circle at 32% 28%, #4c7894, #132332 48%, #03070b 78%); opacity: .55; }
        .planetTwo { width: 44px; height: 44px; top: 610px; right: 7%; background: radial-gradient(circle at 30% 26%, #9ad1ae, #254235 50%, #050906 80%); opacity: .5; }
        .orbit { position: absolute; border: 1px solid rgba(119,229,255,.12); border-radius: 50%; transform: rotate(-22deg); }
        .orbitOne { width: 210px; height: 74px; top: 190px; left: 1.7%; }
        .orbitTwo { width: 150px; height: 54px; top: 606px; right: 2.4%; }
        .meteor { position: absolute; width: 110px; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.95)); transform: rotate(-35deg); opacity: 0; animation: meteor 8s linear infinite; }
        .meteor::after { content: ""; position: absolute; right: -2px; top: -2px; width: 5px; height: 5px; border-radius: 50%; background: white; box-shadow: 0 0 12px #fff; }
        .meteorOne { top: 150px; right: 18%; }
        .meteorTwo { top: 760px; left: 22%; animation-delay: 2.8s; }
        .meteorThree { top: 1240px; right: 26%; animation-delay: 5.3s; }

        .topbar, .hero, .principleBand, .architecture, .pathways, .guidedExperience, .finalCallout, .footer { position: relative; z-index: 2; width: min(1220px, calc(100% - 40px)); margin-inline: auto; }
        .topbar { min-height: 94px; display: flex; align-items: center; justify-content: space-between; gap: 28px; border-bottom: 1px solid rgba(145,190,182,.16); }
        .brand { display: inline-flex; align-items: center; gap: 13px; }
        .brandShield { display: grid; place-items: center; width: 56px; height: 48px; border: 1px solid rgba(223,189,115,.72); clip-path: polygon(50% 0, 94% 18%, 86% 74%, 50% 100%, 14% 74%, 6% 18%); color: #f3d493; background: linear-gradient(145deg, rgba(223,189,115,.14), rgba(223,189,115,.02)); font-size: .72rem; font-weight: 950; letter-spacing: .06em; }
        .brandCopy { display: grid; gap: 2px; }
        .brandCopy strong { font-size: .95rem; letter-spacing: .08em; text-transform: uppercase; }
        .brandCopy small { color: #92a6a6; font-size: .72rem; }
        .topnav { display: flex; align-items: center; gap: 23px; color: #b7c8c5; font-size: .78rem; font-weight: 800; }
        .topnav a { transition: color .2s ease; }
        .topnav a:hover { color: var(--green-soft); }
        .topnav a:last-child { padding: 11px 16px; border: 1px solid rgba(130,243,91,.32); border-radius: 999px; color: #eaffdf; background: rgba(130,243,91,.07); }

        .hero { min-height: 690px; display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(360px, .88fr); align-items: center; gap: 70px; padding: 70px 0 76px; }
        .doorLabel { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 24px; padding: 7px 14px 7px 7px; border: 1px solid rgba(130,243,91,.2); border-radius: 999px; background: rgba(10,24,19,.72); }
        .doorLabel span { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; color: #071008; background: var(--green); font-size: .73rem; font-weight: 950; box-shadow: 0 0 25px rgba(130,243,91,.35); }
        .doorLabel p { margin: 0; color: #d7e6df; font-size: .76rem; font-weight: 750; }
        .eyebrow { margin: 0 0 12px; color: var(--green); font-size: .74rem; font-weight: 900; letter-spacing: .15em; text-transform: uppercase; }
        .hero h1 { max-width: 800px; margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(3.4rem, 6vw, 6.8rem); font-weight: 500; line-height: .92; letter-spacing: -.055em; }
        .hero h1 em { display: block; color: var(--green-soft); font-style: normal; text-shadow: 0 0 36px rgba(130,243,91,.15); }
        .heroSummary { max-width: 750px; margin: 29px 0 0; color: #aebfbd; font-size: 1.05rem; line-height: 1.8; }
        .heroActions, .finalActions { display: flex; flex-wrap: wrap; gap: 13px; margin-top: 32px; }
        .primaryButton, .secondaryButton { min-height: 52px; display: inline-flex; align-items: center; justify-content: center; gap: 24px; padding: 0 21px; border-radius: 12px; font-size: .82rem; font-weight: 900; }
        .primaryButton { color: #071008; background: linear-gradient(135deg, var(--green-soft), var(--green)); box-shadow: 0 16px 42px rgba(79,215,62,.16); }
        .primaryButton:hover { transform: translateY(-2px); box-shadow: 0 20px 50px rgba(79,215,62,.24); }
        .secondaryButton { border: 1px solid rgba(162,199,197,.24); color: #dbe9e7; background: rgba(7,17,24,.58); }
        .boundaryRow { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 28px; color: #829693; font-size: .72rem; font-weight: 800; }
        .boundaryRow span { display: inline-flex; align-items: center; gap: 8px; }
        .boundaryRow span::before { content: ""; width: 5px; height: 5px; border-radius: 50%; background: var(--green); box-shadow: 0 0 10px rgba(130,243,91,.7); }

        .portal { position: relative; min-height: 520px; display: grid; place-items: center; }
        .portalHalo { position: absolute; border-radius: 50%; border: 1px solid rgba(130,243,91,.18); }
        .portalHaloOuter { width: 480px; height: 480px; animation: rotate 18s linear infinite; }
        .portalHaloOuter::before, .portalHaloOuter::after { content: ""; position: absolute; top: 50%; width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 18px var(--green); }
        .portalHaloOuter::before { left: -4px; }
        .portalHaloOuter::after { right: -4px; }
        .portalHaloInner { width: 390px; height: 390px; border-style: dashed; opacity: .62; animation: rotate 30s linear infinite reverse; }
        .portalFrame { position: relative; width: 280px; height: 420px; display: grid; place-items: center; border: 2px solid rgba(196,228,206,.25); border-radius: 145px 145px 20px 20px; background: linear-gradient(180deg, rgba(51,87,62,.34), rgba(5,15,14,.85)); box-shadow: inset 0 0 0 10px rgba(3,8,9,.55), inset 0 0 70px rgba(130,243,91,.14), 0 0 65px rgba(79,215,62,.13); }
        .portalFrame::before { content: ""; position: absolute; inset: 17px; border: 1px solid rgba(130,243,91,.42); border-radius: 130px 130px 12px 12px; box-shadow: inset 0 0 40px rgba(130,243,91,.12), 0 0 24px rgba(130,243,91,.14); }
        .portalNumber { position: absolute; top: -28px; display: grid; place-items: center; width: 58px; height: 58px; border: 2px solid rgba(223,189,115,.65); border-radius: 50%; color: #f8e5b8; background: #07100f; font-family: Georgia, serif; font-size: 1.7rem; box-shadow: 0 0 26px rgba(223,189,115,.12); }
        .portalCore { position: relative; z-index: 2; display: grid; justify-items: center; }
        .academyMark { display: grid; place-items: center; width: 108px; height: 108px; margin-bottom: 22px; border: 1px solid rgba(130,243,91,.62); clip-path: polygon(50% 0, 92% 23%, 92% 75%, 50% 100%, 8% 75%, 8% 23%); color: white; background: rgba(130,243,91,.08); font-size: 2.7rem; font-weight: 950; box-shadow: inset 0 0 30px rgba(130,243,91,.14); }
        .portalCore strong { color: #d8f7d2; font-size: 1.2rem; letter-spacing: .18em; }
        .portalCore p { margin: 6px 0 0; color: var(--green); font-size: 1.2rem; font-weight: 950; letter-spacing: .12em; }
        .portalCaption { position: absolute; bottom: 0; max-width: 360px; margin: 0; color: #708481; text-align: center; font-size: .72rem; line-height: 1.55; }

        .principleBand { display: grid; grid-template-columns: 1fr .8fr; gap: 50px; align-items: center; padding: 35px 42px; border: 1px solid rgba(130,243,91,.2); border-radius: 22px; background: linear-gradient(110deg, rgba(15,36,25,.82), rgba(5,14,18,.86)); box-shadow: 0 26px 80px rgba(0,0,0,.22); }
        .principleBand > div p { margin: 0 0 8px; color: var(--green); font-size: .7rem; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
        .principleBand h2 { margin: 0; font-family: Georgia, serif; font-size: clamp(1.65rem, 3vw, 2.8rem); font-weight: 500; }
        .principleBand > p { margin: 0; color: #9cb0ad; font-size: .9rem; line-height: 1.75; }

        .architecture, .pathways { padding: 120px 0 20px; }
        .sectionIntro { display: grid; grid-template-columns: 1fr .72fr; gap: 60px; align-items: end; }
        .sectionIntro h2, .guidedCopy > h2, .finalCallout h2 { max-width: 800px; margin: 0; font-family: Georgia, serif; font-size: clamp(2.4rem, 4.7vw, 5rem); font-weight: 500; line-height: 1.02; letter-spacing: -.035em; }
        .sectionIntro > p { margin: 0; color: #8fa3a0; font-size: .93rem; line-height: 1.75; }
        .chainRail { display: grid; grid-template-columns: repeat(8, minmax(0,1fr)); margin: 52px 0 0; padding: 0; list-style: none; border: 1px solid rgba(125,173,165,.17); border-radius: 20px; overflow: hidden; background: rgba(4,12,17,.72); }
        .chainRail li { position: relative; min-height: 118px; display: grid; align-content: center; gap: 12px; padding: 20px 16px; border-right: 1px solid rgba(125,173,165,.14); }
        .chainRail li:last-child { border-right: 0; }
        .chainRail li > span { color: var(--green); font-size: .66rem; font-weight: 950; letter-spacing: .08em; }
        .chainRail strong { font-size: .78rem; }
        .chainRail b { position: absolute; top: 50%; right: -9px; z-index: 2; display: grid; place-items: center; width: 18px; height: 18px; border-radius: 50%; color: #071008; background: var(--green); font-size: .62rem; }
        .architectureStatement { display: flex; align-items: center; gap: 17px; margin-top: 24px; padding: 20px 24px; border-left: 2px solid var(--green); color: #b5c6c3; background: rgba(12,25,25,.55); }
        .architectureStatement p { margin: 0; font-size: .86rem; line-height: 1.65; }
        .pulse { flex: 0 0 auto; width: 9px; height: 9px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 0 rgba(130,243,91,.45); animation: pulse 2s infinite; }

        .pathwayGrid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 16px; margin-top: 52px; }
        .pathwayCard { min-height: 340px; display: flex; flex-direction: column; padding: 29px; border: 1px solid rgba(129,176,169,.16); border-radius: 20px; background: linear-gradient(145deg, rgba(10,23,29,.9), rgba(4,10,15,.82)); transition: transform .25s ease, border-color .25s ease; }
        .pathwayCard:hover { transform: translateY(-5px); border-color: rgba(130,243,91,.35); }
        .cardTopline { display: flex; justify-content: space-between; color: var(--green); font-size: .68rem; font-weight: 900; }
        .cardTopline small { padding: 6px 9px; border: 1px solid rgba(130,243,91,.16); border-radius: 999px; color: #98b49f; background: rgba(130,243,91,.05); }
        .cardEyebrow { margin: 37px 0 10px !important; color: #90a6a3 !important; font-size: .7rem !important; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
        .pathwayCard h3 { max-width: 500px; margin: 0; font-family: Georgia, serif; font-size: 2rem; font-weight: 500; line-height: 1.08; }
        .pathwayCard > p { margin: 17px 0 0; color: #8fa29f; font-size: .86rem; line-height: 1.7; }
        .pathwayCard > a { display: inline-flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 28px; border-top: 1px solid rgba(129,176,169,.14); color: #dbf9d2; font-size: .78rem; font-weight: 900; }
        .pathwayCard > a span { color: var(--green); font-size: 1.2rem; }

        .guidedExperience { display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; padding: 130px 0; }
        .guidedCopy > p:not(.eyebrow) { max-width: 680px; margin: 23px 0 0; color: #92a7a3; line-height: 1.8; }
        .questionPreview { margin-top: 35px; padding: 26px; border: 1px solid rgba(130,243,91,.25); border-radius: 18px; background: linear-gradient(145deg, rgba(12,30,23,.82), rgba(5,14,17,.9)); box-shadow: 0 24px 70px rgba(0,0,0,.25); }
        .questionPreview > span { color: var(--green); font-size: .69rem; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
        .questionPreview strong { display: block; margin-top: 18px; font-family: Georgia, serif; font-size: 1.65rem; font-weight: 500; }
        .questionPreview > p { margin: 10px 0 0; color: #93a7a3; font-size: .83rem; line-height: 1.6; }
        .questionPreview > div { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
        .questionPreview > div span { padding: 7px 9px; border-radius: 999px; color: #a9bbb8; background: rgba(255,255,255,.045); font-size: .65rem; font-weight: 750; }
        .capabilityGrid { display: grid; gap: 10px; }
        .capabilityGrid article { display: grid; grid-template-columns: 46px 1fr; gap: 17px; padding: 19px; border: 1px solid rgba(127,170,163,.14); border-radius: 15px; background: rgba(5,13,18,.7); }
        .capabilityGrid article > span { display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid rgba(130,243,91,.22); border-radius: 12px; color: var(--green); font-size: .68rem; font-weight: 950; background: rgba(130,243,91,.05); }
        .capabilityGrid h3 { margin: 1px 0 5px; font-size: .89rem; }
        .capabilityGrid p { margin: 0; color: #819693; font-size: .76rem; line-height: 1.55; }

        .finalCallout { display: grid; grid-template-columns: 1fr auto; gap: 50px; align-items: center; padding: 58px; border: 1px solid rgba(130,243,91,.22); border-radius: 25px; background: radial-gradient(circle at 88% 50%, rgba(130,243,91,.11), transparent 32%), linear-gradient(125deg, rgba(12,29,23,.9), rgba(4,12,17,.92)); }
        .finalCallout h2 { max-width: 760px; font-size: clamp(2rem, 3.7vw, 3.8rem); }
        .finalActions { min-width: 275px; display: grid; margin-top: 0; }
        .footer { min-height: 150px; display: flex; align-items: center; justify-content: space-between; gap: 30px; color: #6d817e; font-size: .72rem; }
        .footer > div { display: grid; gap: 5px; }
        .footer strong { color: #d8e5e2; letter-spacing: .1em; text-transform: uppercase; }
        .footer p { margin: 0; }

        @keyframes starDrift { to { transform: translateY(80px); } }
        @keyframes breathe { 50% { transform: scale(1.12); opacity: .2; } }
        @keyframes rotate { to { transform: rotate(360deg); } }
        @keyframes meteor { 0%, 76% { opacity: 0; transform: translate(0,0) rotate(-35deg); } 78% { opacity: 1; } 88%, 100% { opacity: 0; transform: translate(-300px, 215px) rotate(-35deg); } }
        @keyframes pulse { 70% { box-shadow: 0 0 0 13px rgba(130,243,91,0); } 100% { box-shadow: 0 0 0 0 rgba(130,243,91,0); } }

        @media (max-width: 980px) {
          .topnav { display: none; }
          .hero { grid-template-columns: 1fr; padding-top: 80px; }
          .portal { min-height: 500px; }
          .principleBand, .sectionIntro, .guidedExperience, .finalCallout { grid-template-columns: 1fr; }
          .chainRail { grid-template-columns: repeat(4, 1fr); }
          .chainRail li:nth-child(4) { border-right: 0; }
          .finalActions { min-width: 0; }
        }

        @media (max-width: 680px) {
          .topbar, .hero, .principleBand, .architecture, .pathways, .guidedExperience, .finalCallout, .footer { width: min(100% - 24px, 1220px); }
          .topbar { min-height: 78px; }
          .brandCopy small { display: none; }
          .hero { min-height: auto; gap: 25px; padding: 58px 0 45px; }
          .hero h1 { font-size: clamp(3.15rem, 16vw, 5.2rem); }
          .heroSummary { font-size: .94rem; }
          .heroActions, .finalActions { display: grid; }
          .primaryButton, .secondaryButton { width: 100%; }
          .portal { min-height: 410px; transform: scale(.82); margin: -30px 0; }
          .principleBand { gap: 22px; padding: 28px 23px; }
          .architecture, .pathways { padding-top: 90px; }
          .sectionIntro { gap: 22px; }
          .chainRail { grid-template-columns: repeat(2, 1fr); }
          .chainRail li:nth-child(even) { border-right: 0; }
          .pathwayGrid { grid-template-columns: 1fr; }
          .pathwayCard { min-height: 320px; padding: 24px; }
          .guidedExperience { gap: 40px; padding: 95px 0; }
          .finalCallout { gap: 30px; padding: 34px 24px; }
          .footer { align-items: flex-start; flex-direction: column; justify-content: center; }
          .footer p { line-height: 1.5; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; }
        }
      `}</style>
    </main>
  );
}
