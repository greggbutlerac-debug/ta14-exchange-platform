"use client";

import Link from "next/link";

const recordTypes = [
  {
    title: "Atmospheric Integrity Records",
    description:
      "Interpret governed air records across psychrometrics, pressure, particulates, gases, sound, and continuity.",
    href: "/workspace/environmental-records/atmospheric",
    action: "Open atmospheric records",
  },
  {
    title: "Building Environmental Records",
    description:
      "Review environmental evidence for buildings, rooms, critical spaces, HVAC systems, and operational conditions.",
    href: "/workspace/environmental-records/buildings",
    action: "Open building records",
  },
  {
    title: "Hospital and Laboratory Records",
    description:
      "Interpret evidence for healthcare, isolation, laboratory, neonatal, hospice, and other consequential spaces.",
    href: "/workspace/environmental-records/healthcare",
    action: "Open healthcare records",
  },
  {
    title: "Land, Water, and Sensor Records",
    description:
      "Bring environmental datasets, laboratory reports, field evidence, and sensor packages into a bounded record workflow.",
    href: "/workspace/environmental-records/interpreter",
    action: "Open record interpreter",
  },
];

const evidenceClasses = [
  "Temperature",
  "Relative humidity",
  "Dew point",
  "Enthalpy",
  "Wet bulb",
  "Static pressure",
  "Room pressure",
  "Particulate matter",
  "Carbon dioxide",
  "Volatile organic compounds",
  "Radon",
  "Sound",
  "Airflow",
  "Equipment state",
  "Land evidence",
  "Water evidence",
];

export default function EnvironmentalRecordsPage() {
  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="glow glowOne" />
      <div className="glow glowTwo" />

      <header className="topbar shell">
        <Link href="/" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>Environmental Records</strong>
            <small>TA-14 AI Governance Exchange</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/workspace/governed-records">Governed Records</Link>
          <Link href="/workspace/entity-review">Entity Review</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">ENVIRONMENTAL RECORDS WORKSPACE</p>
          <h1>Make environmental reality governable without reducing it to a score.</h1>
          <p className="lead">
            Upload, preserve, interpret, and review evidence for land, water,
            air, buildings, hospitals, laboratories, HVAC systems, and sensor
            networks within declared proof boundaries.
          </p>

          <div className="heroActions">
            <Link
              className="primaryButton"
              href="/workspace/environmental-records/interpreter"
            >
              Open Environmental Record Interpreter
              <span>→</span>
            </Link>
            <Link
              className="secondaryButton"
              href="/workspace/governed-records/builder"
            >
              Create a Governed Record
            </Link>
          </div>
        </div>

        <div className="environmentVisual" aria-hidden="true">
          <div className="planet">
            <div className="planetGlow" />
            <div className="land landOne" />
            <div className="land landTwo" />
            <div className="waterArc waterArcOne" />
            <div className="waterArc waterArcTwo" />
            <div className="atmosphere atmosphereOne" />
            <div className="atmosphere atmosphereTwo" />
            <div className="sensorPoint pointOne" />
            <div className="sensorPoint pointTwo" />
            <div className="sensorPoint pointThree" />
          </div>
          <div className="orbit orbitOne">
            <span />
          </div>
          <div className="orbit orbitTwo">
            <span />
          </div>
        </div>
      </section>

      <section className="principle shell">
        <p className="eyebrow">THE ENVIRONMENTAL RECORD PRINCIPLE</p>
        <h2>A point system is not the same as an admissible environmental record.</h2>
        <p>
          Environmental integrity depends on preserving the actual evidence,
          its source, continuity, time, place, instrument state, uncertainty,
          and declared limitations—not merely assigning a favorable score.
        </p>
      </section>

      <section className="recordTypes shell">
        <div className="sectionIntro">
          <p className="eyebrow">BEGIN HERE</p>
          <h2>Choose the environmental record you need to interpret.</h2>
          <p>
            Each workflow preserves its own domain, evidence classes, and review
            boundaries.
          </p>
        </div>

        <div className="recordGrid">
          {recordTypes.map((item, index) => (
            <article key={item.title}>
              <span className="number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link href={item.href}>
                {item.action}
                <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="evidenceSection shell">
        <div>
          <p className="eyebrow">EVIDENCE CLASSES</p>
          <h2>Bring the record as it exists.</h2>
          <p>
            Environmental records may contain direct measurements, laboratory
            evidence, equipment states, field observations, documents, sensor
            packages, or linked governed records.
          </p>
        </div>

        <div className="evidenceGrid">
          {evidenceClasses.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="interpretation shell">
        <div>
          <p className="eyebrow">BOUNDED INTERPRETATION</p>
          <h2>What the record proves. What it suggests. What it cannot establish.</h2>
        </div>

        <div className="interpretationGrid">
          <article>
            <span>01</span>
            <h3>Identify</h3>
            <p>
              Determine the record type, source, time boundary, location,
              instruments, and declared purpose.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>Validate</h3>
            <p>
              Review continuity, completeness, custody, calibration evidence,
              version, and missing conditions.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Interpret</h3>
            <p>
              Explain what the evidence can support without turning correlation,
              thresholds, or incomplete data into certainty.
            </p>
          </article>

          <article>
            <span>04</span>
            <h3>Preserve</h3>
            <p>
              Generate a Governed Interpretation Record with explicit claims,
              non-claims, limitations, and review history.
            </p>
          </article>
        </div>
      </section>

      <section className="useCases shell">
        <div className="useCaseCopy">
          <p className="eyebrow">CONSEQUENTIAL ENVIRONMENTS</p>
          <h2>Environmental evidence can govern far more than comfort.</h2>
          <p>
            The same record discipline can support hospitals, critical rooms,
            laboratories, dry rooms, cold chain, data centers, schools,
            residences, public buildings, industrial sites, and environmental
            investigations.
          </p>
        </div>

        <div className="useCaseList">
          <span>Hospitals</span>
          <span>Isolation rooms</span>
          <span>Laboratories</span>
          <span>Neonatal spaces</span>
          <span>Hospice environments</span>
          <span>Battery dry rooms</span>
          <span>Data centers</span>
          <span>Cold chain</span>
          <span>Schools</span>
          <span>Commercial buildings</span>
          <span>Residential buildings</span>
          <span>Land and water sites</span>
        </div>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>An environmental record is not automatically a diagnosis.</h2>
        </div>
        <p>
          The record preserves environmental evidence. Diagnosis, remediation,
          optimization, legal conclusions, health conclusions, and execution
          remain separate governed layers requiring their own authority and
          evidence.
        </p>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">ENVIRONMENTAL RECORD INTERPRETER</p>
          <h2>Bring the evidence. Preserve the boundary.</h2>
          <p>
            Start with the environmental record and generate a governed,
            attributable interpretation that does not claim more than the
            evidence can support.
          </p>
        </div>

        <Link
          className="primaryButton"
          href="/workspace/environmental-records/interpreter"
        >
          Enter Environmental Records
          <span>→</span>
        </Link>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/">Return to the four doors</Link>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #060912;
        }

        :global(body) {
          margin: 0;
          color: #f8f8ff;
          background:
            radial-gradient(circle at 12% 8%, rgba(167, 78, 255, 0.13), transparent 28%),
            radial-gradient(circle at 88% 24%, rgba(67, 120, 255, 0.11), transparent 28%),
            linear-gradient(180deg, #060912 0%, #0b0d1d 50%, #060813 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        main {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .shell {
          width: min(1260px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .stars {
          position: fixed;
          inset: -12%;
          pointer-events: none;
          z-index: -4;
          opacity: 0.34;
        }

        .starsOne {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.4px);
          background-size: 92px 92px;
          animation: starDrift 34s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(195,113,255,.62) 0 1px, transparent 1.4px);
          background-size: 156px 156px;
          background-position: 39px 58px;
          animation: starDrift 48s linear infinite reverse;
        }

        .glow {
          position: fixed;
          width: 470px;
          height: 470px;
          border-radius: 999px;
          filter: blur(120px);
          opacity: 0.12;
          z-index: -3;
          animation: glowMove 14s ease-in-out infinite alternate;
        }

        .glowOne {
          left: -170px;
          top: -180px;
          background: #b64fff;
        }

        .glowTwo {
          right: -180px;
          top: 44%;
          background: #426cff;
          animation-delay: -6s;
        }

        .topbar {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(132, 154, 188, 0.16);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
        }

        .brandMark {
          min-width: 64px;
          height: 38px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #16091e;
          background: linear-gradient(135deg, #c473ff, #ead2ff);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          color: #7e91a6;
          margin-top: 2px;
        }

        nav {
          display: flex;
          gap: 22px;
        }

        nav a,
        footer a {
          color: #a9b8ca;
          text-decoration: none;
          font-size: 14px;
        }

        .hero {
          min-height: 650px;
          display: grid;
          grid-template-columns: 1.12fr 0.88fr;
          gap: 50px;
          align-items: center;
          padding: 76px 0;
        }

        .eyebrow {
          margin: 0;
          color: #c77aff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        h1 {
          max-width: 860px;
          margin: 18px 0 22px;
          font-size: clamp(48px, 7vw, 88px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .lead {
          max-width: 760px;
          margin: 0;
          color: #a5afc7;
          font-size: 18px;
          line-height: 1.68;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          border-radius: 14px;
          padding: 0 20px;
          text-decoration: none;
          font-weight: 850;
        }

        .primaryButton {
          color: #16091e;
          background: linear-gradient(135deg, #bd6cff, #ead3ff);
          box-shadow: 0 14px 38px rgba(180, 84, 255, 0.18);
        }

        .secondaryButton {
          color: #e4dced;
          border: 1px solid rgba(163, 134, 188, 0.27);
          background: rgba(255, 255, 255, 0.035);
        }

        .environmentVisual {
          min-height: 470px;
          display: grid;
          place-items: center;
          position: relative;
        }

        .planet {
          width: 260px;
          height: 260px;
          border-radius: 999px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(205, 139, 255, 0.62);
          background:
            radial-gradient(circle at 34% 30%, rgba(230, 201, 255, 0.18), transparent 20%),
            radial-gradient(circle at 50% 50%, rgba(89, 52, 151, 0.62), rgba(17, 12, 35, 0.98) 70%);
          box-shadow:
            0 0 52px rgba(185, 91, 255, 0.3),
            inset 0 0 36px rgba(204, 137, 255, 0.18);
          animation: planetFloat 5s ease-in-out infinite alternate;
        }

        .planetGlow {
          position: absolute;
          inset: 20px;
          border-radius: 999px;
          border: 1px solid rgba(231, 204, 255, 0.16);
        }

        .land {
          position: absolute;
          background: linear-gradient(135deg, #bc76ff, #7741b8);
          opacity: 0.7;
          filter: blur(1px);
        }

        .landOne {
          width: 94px;
          height: 72px;
          border-radius: 52% 48% 60% 40%;
          left: 38px;
          top: 54px;
          transform: rotate(-18deg);
        }

        .landTwo {
          width: 78px;
          height: 104px;
          border-radius: 44% 56% 42% 58%;
          right: 36px;
          bottom: 42px;
          transform: rotate(20deg);
        }

        .waterArc,
        .atmosphere {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(103, 166, 255, 0.5);
        }

        .waterArcOne {
          inset: 28px 18px 72px 22px;
          transform: rotate(22deg);
        }

        .waterArcTwo {
          inset: 75px 38px 26px 28px;
          transform: rotate(-34deg);
        }

        .atmosphereOne {
          inset: -16px;
          border-color: rgba(209, 145, 255, 0.34);
        }

        .atmosphereTwo {
          inset: -30px;
          border-color: rgba(108, 172, 255, 0.22);
        }

        .sensorPoint {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #fff0ff;
          box-shadow:
            0 0 8px #d688ff,
            0 0 16px #b54cff;
        }

        .pointOne {
          left: 54px;
          top: 88px;
        }

        .pointTwo {
          right: 50px;
          top: 64px;
        }

        .pointThree {
          left: 106px;
          bottom: 42px;
        }

        .orbit {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(191, 112, 255, 0.2);
          animation: rotate 20s linear infinite;
        }

        .orbit span {
          position: absolute;
          width: 10px;
          height: 10px;
          right: -5px;
          top: 50%;
          border-radius: 999px;
          background: #c372ff;
          box-shadow: 0 0 14px #c372ff;
        }

        .orbitOne {
          width: 340px;
          height: 340px;
        }

        .orbitTwo {
          width: 430px;
          height: 430px;
          animation-duration: 29s;
          animation-direction: reverse;
        }

        .orbitTwo span {
          background: #6aa2ff;
          box-shadow: 0 0 14px #6aa2ff;
        }

        .principle,
        .evidenceSection,
        .interpretation,
        .useCases,
        .boundary,
        .finalCta {
          border: 1px solid rgba(141, 133, 181, 0.17);
          background:
            linear-gradient(180deg, rgba(16, 18, 38, 0.9), rgba(9, 10, 25, 0.95));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.22);
        }

        .principle {
          padding: 52px;
          text-align: center;
        }

        .principle h2,
        .sectionIntro h2,
        .evidenceSection h2,
        .interpretation h2,
        .useCases h2,
        .boundary h2,
        .finalCta h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .principle > p:not(.eyebrow),
        .sectionIntro > p:not(.eyebrow),
        .evidenceSection p:not(.eyebrow),
        .interpretation p,
        .useCases p:not(.eyebrow),
        .boundary > p,
        .finalCta p:not(.eyebrow) {
          color: #a4aec3;
          line-height: 1.68;
        }

        .principle > p:not(.eyebrow) {
          max-width: 800px;
          margin: 0 auto;
        }

        .recordTypes {
          padding: 90px 0;
        }

        .sectionIntro {
          max-width: 740px;
          margin-bottom: 34px;
        }

        .sectionIntro > p:not(.eyebrow) {
          margin: 0;
        }

        .recordGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .recordGrid article {
          min-height: 290px;
          padding: 30px;
          border-radius: 22px;
          border: 1px solid rgba(150, 126, 189, 0.18);
          background:
            linear-gradient(180deg, rgba(18, 20, 42, 0.88), rgba(9, 10, 25, 0.95));
          transition:
            transform 220ms ease,
            border-color 220ms ease;
        }

        .recordGrid article:hover {
          transform: translateY(-5px);
          border-color: rgba(195, 111, 255, 0.48);
        }

        .number,
        .interpretationGrid span {
          color: #c374ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .recordGrid h3 {
          margin: 18px 0 12px;
          font-size: 28px;
          letter-spacing: -0.03em;
        }

        .recordGrid p {
          color: #a4aec3;
          line-height: 1.65;
          min-height: 82px;
        }

        .recordGrid a {
          display: inline-flex;
          gap: 20px;
          color: #d08fff;
          text-decoration: none;
          font-weight: 850;
        }

        .evidenceSection {
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 42px;
          align-items: center;
        }

        .evidenceSection h2 {
          font-size: clamp(30px, 4.5vw, 50px);
        }

        .evidenceGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .evidenceGrid span,
        .useCaseList span {
          padding: 10px 13px;
          border-radius: 999px;
          border: 1px solid rgba(190, 111, 255, 0.2);
          background: rgba(172, 77, 238, 0.06);
          color: #ead9f7;
          font-size: 13px;
          font-weight: 750;
        }

        .interpretation {
          margin-top: 22px;
          padding: 42px;
        }

        .interpretation > div:first-child {
          max-width: 920px;
        }

        .interpretation h2 {
          font-size: clamp(30px, 4.5vw, 50px);
        }

        .interpretationGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .interpretationGrid article {
          padding: 24px 20px;
          border-radius: 18px;
          border: 1px solid rgba(180, 112, 230, 0.16);
          background: rgba(154, 80, 214, 0.05);
        }

        .interpretationGrid h3 {
          margin: 15px 0 10px;
          font-size: 23px;
        }

        .interpretationGrid p {
          margin: 0;
          line-height: 1.58;
        }

        .useCases {
          margin-top: 22px;
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 42px;
          align-items: center;
        }

        .useCases h2 {
          font-size: clamp(30px, 4.5vw, 48px);
        }

        .useCaseList {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .boundary {
          margin-top: 22px;
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .boundary h2 {
          font-size: clamp(28px, 4vw, 44px);
        }

        .boundary > p {
          margin: 0;
        }

        .finalCta {
          margin-top: 74px;
          padding: 54px 46px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
        }

        .finalCta > div {
          max-width: 760px;
        }

        .finalCta h2 {
          font-size: clamp(36px, 5vw, 58px);
        }

        footer {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          color: #74869a;
          font-size: 12px;
        }

        @keyframes starDrift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(90px, 140px, 0);
          }
        }

        @keyframes glowMove {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(55px, 35px, 0) scale(1.1);
          }
        }

        @keyframes planetFloat {
          from {
            transform: translateY(-8px) rotate(-2deg);
          }
          to {
            transform: translateY(9px) rotate(2deg);
          }
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          nav {
            display: none;
          }

          .hero,
          .evidenceSection,
          .useCases,
          .boundary {
            grid-template-columns: 1fr;
          }

          .interpretationGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .shell {
            width: min(100% - 20px, 1260px);
          }

          .hero {
            min-height: auto;
            padding: 58px 0;
          }

          .environmentVisual {
            min-height: 430px;
            transform: scale(0.8);
          }

          .principle,
          .evidenceSection,
          .interpretation,
          .useCases,
          .boundary,
          .finalCta {
            padding: 28px 24px;
          }

          .recordGrid,
          .interpretationGrid {
            grid-template-columns: 1fr;
          }

          .finalCta {
            flex-direction: column;
            align-items: flex-start;
          }

          footer {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
