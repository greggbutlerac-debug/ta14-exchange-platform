"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Lane = {
  id: string;
  title: string;
  summary: string;
  responsibilities: string[];
  boundaries: string[];
};

const lanes: Lane[] = [
  {
    id: "boundary-only",
    title: "Boundary-Only Reviewer",
    summary:
      "Identifies exclusions, limitations, unresolved conditions, and proof boundaries without reviewing or approving the complete route.",
    responsibilities: [
      "Declare the specialty boundary",
      "Identify unsupported claims",
      "Preserve exclusions and limitations",
      "Return attributable written findings",
    ],
    boundaries: [
      "No whole-route approval",
      "No execution authority",
      "No implied certification",
    ],
  },
  {
    id: "referral-only",
    title: "Referral-Only Partner",
    summary:
      "Identifies the appropriate review lane and transfers the entity without issuing a substantive technical or governance determination.",
    responsibilities: [
      "Identify the likely review need",
      "Preserve the referral rationale",
      "Declare conflicts and limitations",
      "Route the entity to qualified reviewers",
    ],
    boundaries: [
      "No substantive finding",
      "No approval language",
      "No review beyond referral scope",
    ],
  },
  {
    id: "scoped-review",
    title: "Scoped Review Candidate",
    summary:
      "Reviews a declared layer of the entity or route within a documented specialty, evidence boundary, and authority limit.",
    responsibilities: [
      "Review the assigned layer",
      "Cite the evidence relied upon",
      "Separate fact from interpretation",
      "Preserve findings and unresolved gaps",
    ],
    boundaries: [
      "No authority outside assigned scope",
      "No silent assumptions",
      "No substitution for second-layer review",
    ],
  },
  {
    id: "partner-track",
    title: "Partner-Track Candidate",
    summary:
      "Participates in broader governed reviews with attributable findings, preserved boundaries, and second-layer TA-14 review.",
    responsibilities: [
      "Maintain reviewer identity and authority",
      "Use governed review records",
      "Preserve evidence continuity",
      "Accept correction and second-layer review",
    ],
    boundaries: [
      "Acceptance is not permanent",
      "Findings remain reviewable",
      "TA-14 may HOLD, DENY, or ESCALATE",
    ],
  },
  {
    id: "strategic",
    title: "Strategic Ecosystem Partner",
    summary:
      "Supports specialized review capacity, governed referral routes, research, education, or infrastructure across the wider exchange.",
    responsibilities: [
      "Maintain declared capability records",
      "Preserve commercial and review boundaries",
      "Support repeatable review workflows",
      "Participate in governance updates",
    ],
    boundaries: [
      "No automatic exclusivity",
      "No implied endorsement of every service",
      "No authority beyond written agreements",
    ],
  },
];

const qualificationCriteria = [
  "A clearly declared governance or review architecture",
  "Written proof and non-proof boundaries",
  "Named reviewer identity and accountable authority",
  "Evidence-linked findings rather than generalized confidence",
  "A process for correction, escalation, and second-layer review",
  "No automatic conversion of a score, model output, or policy into approval",
  "Willingness to preserve review history and attribution",
  "A specialty that adds genuine review value to the exchange",
];

const processSteps = [
  {
    number: "01",
    title: "Apply",
    text: "Submit your organization, architecture, specialty, reviewer identity, boundaries, and representative materials.",
  },
  {
    number: "02",
    title: "Qualification review",
    text: "TA-14 reviews the submitted material for clarity, evidence discipline, review boundaries, and potential network fit.",
  },
  {
    number: "03",
    title: "Lane determination",
    text: "The applicant may be declined, held for more evidence, referred, or assigned a candidate lane.",
  },
  {
    number: "04",
    title: "Observed review",
    text: "Qualified candidates may complete a governed sample or supervised review before broader participation.",
  },
  {
    number: "05",
    title: "Network participation",
    text: "Accepted partners participate only within their written lane, authority, and continuing review conditions.",
  },
];

export default function PartnerReviewNetworkPage() {
  const [selectedLane, setSelectedLane] = useState("partner-track");

  const activeLane = useMemo(
    () => lanes.find((lane) => lane.id === selectedLane) ?? lanes[0],
    [selectedLane],
  );

  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="glow glowOne" />
      <div className="glow glowTwo" />

      <header className="topbar shell">
        <Link href="/workspace/entity-review" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>Partner Review Network</strong>
            <small>Entity Review Workspace</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/workspace/entity-review">Entity Review</Link>
          <Link href="/workspace/governed-records">Governed Records</Link>
          <Link href="/workspace/ai-governance">AI Governance</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">PARTNER REVIEW NETWORK</p>
          <h1>Independent expertise without collapsing the review boundary.</h1>
          <p className="lead">
            The Partner Review Network brings qualified governance systems,
            reviewers, specialists, and organizations into attributable,
            evidence-bound review lanes with written limitations and second-layer
            TA-14 review.
          </p>

          <div className="heroActions">
            <Link
              className="primaryButton"
              href="/workspace/entity-review/partner-network/apply"
            >
              Apply to the Network
              <span>→</span>
            </Link>

            <a className="secondaryButton" href="#how-it-works">
              See How It Works
            </a>
          </div>
        </div>

        <div className="networkVisual" aria-hidden="true">
          <div className="core">
            <span>TA-14</span>
            <strong>Second-Layer Review</strong>
          </div>

          <div className="orbit orbitOne">
            <i className="node nodeOne">GOV</i>
            <i className="node nodeTwo">LAW</i>
            <i className="node nodeThree">OPS</i>
          </div>

          <div className="orbit orbitTwo">
            <i className="node nodeFour">AI</i>
            <i className="node nodeFive">DATA</i>
            <i className="node nodeSix">RISK</i>
          </div>
        </div>
      </section>

      <section className="principle shell">
        <p className="eyebrow">THE NETWORK PRINCIPLE</p>
        <h2>Specialized review should strengthen the route—not silently replace it.</h2>
        <p>
          Every partner finding remains attributable to the reviewer, evidence,
          scope, authority, and date that produced it. No partner’s specialty is
          treated as automatic approval of the entire entity or execution route.
        </p>
      </section>

      <section className="lanes shell">
        <div className="sectionIntro">
          <p className="eyebrow">REVIEW LANES</p>
          <h2>Participation begins with a declared lane.</h2>
          <p>
            A partner can only review within the specialty, evidence boundary,
            and authority preserved in its acceptance record.
          </p>
        </div>

        <div className="laneLayout">
          <div className="laneButtons">
            {lanes.map((lane) => (
              <button
                type="button"
                key={lane.id}
                className={selectedLane === lane.id ? "active" : ""}
                onClick={() => setSelectedLane(lane.id)}
              >
                <span>{lane.title}</span>
                <small>{lane.summary}</small>
              </button>
            ))}
          </div>

          <article className="laneDetail">
            <p className="eyebrow">SELECTED LANE</p>
            <h3>{activeLane.title}</h3>
            <p className="laneSummary">{activeLane.summary}</p>

            <div className="laneColumns">
              <div>
                <span className="detailLabel">Responsibilities</span>
                <ul>
                  {activeLane.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="detailLabel boundaryLabel">Boundaries</span>
                <ul>
                  {activeLane.boundaries.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="qualification shell">
        <div>
          <p className="eyebrow">QUALIFICATION STANDARD</p>
          <h2>Is your AI governance strong enough to become a review partner?</h2>
          <p>
            The network is not a directory, badge program, or automatic
            acceptance system. Applicants must demonstrate that their work can
            be bounded, reviewed, attributed, corrected, and preserved.
          </p>
        </div>

        <div className="criteriaGrid">
          {qualificationCriteria.map((criterion, index) => (
            <article key={criterion}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{criterion}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process shell" id="how-it-works">
        <div className="sectionIntro">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>Application does not create acceptance.</h2>
          <p>
            The qualification review determines whether the applicant’s
            material supports further consideration and which lane, if any, is
            appropriate.
          </p>
        </div>

        <div className="processGrid">
          {processSteps.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing shell">
        <div className="priceBlock">
          <p className="eyebrow">QUALIFICATION REVIEW FEE</p>
          <div className="price">$450</div>
          <span className="priceNote">One-time application review</span>
        </div>

        <div className="priceCopy">
          <h2>The fee pays for review—not acceptance.</h2>
          <p>
            The qualification fee covers review of the applicant’s submitted
            architecture, materials, boundaries, reviewer identity, declared
            specialty, and potential fit within the Partner Review Network.
          </p>
          <p>
            Payment does not guarantee acceptance, placement, referrals,
            revenue, certification, endorsement, or any specific review lane.
            Applicants may be declined or asked to provide additional evidence.
          </p>

          <Link
            className="primaryButton"
            href="/workspace/entity-review/partner-network/apply"
          >
            Begin Qualification Application
            <span>→</span>
          </Link>
        </div>
      </section>

      <section className="economics shell">
        <div>
          <p className="eyebrow">PARTNER ECONOMICS</p>
          <h2>Revenue follows the governed route and the work actually performed.</h2>
          <p>
            Commercial participation is documented separately from reviewer
            authority. Referral, origination, execution, and second-layer review
            must remain visible rather than being blended into one opaque fee.
          </p>
        </div>

        <div className="economicsGrid">
          <article>
            <span>Origination</span>
            <strong>Preserved</strong>
            <p>
              The source of the relationship and any continuing origination
              interest can remain attributable across future scopes.
            </p>
          </article>

          <article>
            <span>Execution</span>
            <strong>Role-based</strong>
            <p>
              The partner performing the governed review is compensated for the
              declared work and remains accountable for its findings.
            </p>
          </article>

          <article>
            <span>Second layer</span>
            <strong>Separate</strong>
            <p>
              TA-14 review, route governance, records, and escalation remain
              distinct from the specialist’s underlying review.
            </p>
          </article>
        </div>
      </section>

      <section className="notNetwork shell">
        <div>
          <p className="eyebrow">WHAT THE NETWORK IS NOT</p>
          <h2>Participation is not a universal endorsement.</h2>
        </div>

        <div className="notGrid">
          <span>Not automatic certification</span>
          <span>Not legal approval</span>
          <span>Not permanent acceptance</span>
          <span>Not whole-route authority</span>
          <span>Not a pay-to-play badge</span>
          <span>Not protection from correction</span>
        </div>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>Every partner remains responsible for its own findings.</h2>
        </div>

        <p>
          TA-14 may preserve, review, challenge, HOLD, DENY, or ESCALATE a
          partner finding. Network participation does not transfer professional,
          legal, technical, contractual, or regulatory responsibility away from
          the reviewer or applicant.
        </p>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">APPLY TO THE NETWORK</p>
          <h2>Bring your architecture, evidence, boundaries, and review discipline.</h2>
          <p>
            Submit the material needed for TA-14 to determine whether your
            governance system or specialty may qualify for a Partner Review
            Network lane.
          </p>
        </div>

        <Link
          className="primaryButton"
          href="/workspace/entity-review/partner-network/apply"
        >
          Apply for Qualification
          <span>→</span>
        </Link>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/workspace/entity-review">Return to Entity Review</Link>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #090a0d;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #fffaf0;
          background:
            radial-gradient(circle at 12% 8%, rgba(255, 177, 30, 0.12), transparent 28%),
            radial-gradient(circle at 88% 24%, rgba(202, 118, 22, 0.1), transparent 28%),
            linear-gradient(180deg, #090a0d 0%, #11100f 50%, #08090d 100%);
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
            radial-gradient(circle, rgba(255,255,255,.72) 0 1px, transparent 1.4px);
          background-size: 92px 92px;
          animation: starDrift 34s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(255,183,48,.6) 0 1px, transparent 1.4px);
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
          opacity: 0.11;
          z-index: -3;
          animation: glowMove 14s ease-in-out infinite alternate;
        }

        .glowOne {
          left: -170px;
          top: -180px;
          background: #ffb31e;
        }

        .glowTwo {
          right: -180px;
          top: 44%;
          background: #ca6f18;
          animation-delay: -6s;
        }

        .topbar {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(190, 160, 112, 0.17);
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
          color: #1a1003;
          background: linear-gradient(135deg, #ffb31f, #ffe7a8);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          color: #958a78;
          margin-top: 2px;
        }

        nav {
          display: flex;
          gap: 22px;
        }

        nav a,
        footer a {
          color: #b9ae9e;
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
          color: #ffb421;
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
          color: #b5aa9b;
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
          color: #1b1002;
          background: linear-gradient(135deg, #ffb51f, #ffe6a4);
          box-shadow: 0 14px 38px rgba(255, 174, 28, 0.18);
        }

        .secondaryButton {
          color: #efe6d8;
          border: 1px solid rgba(187, 156, 107, 0.27);
          background: rgba(255, 255, 255, 0.035);
        }

        .networkVisual {
          min-height: 470px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .core {
          width: 210px;
          height: 210px;
          border-radius: 999px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 190, 71, 0.72);
          background:
            radial-gradient(circle, rgba(255, 180, 31, 0.16), rgba(24, 16, 6, 0.96) 68%);
          box-shadow:
            0 0 50px rgba(255, 175, 25, 0.28),
            inset 0 0 34px rgba(255, 181, 31, 0.15);
          z-index: 3;
        }

        .core span {
          color: #ffd16c;
          font-size: 38px;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .core strong {
          margin-top: 8px;
          max-width: 150px;
          text-align: center;
          font-size: 16px;
        }

        .orbit {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(255, 180, 34, 0.2);
          animation: rotate 24s linear infinite;
        }

        .orbitOne {
          width: 310px;
          height: 310px;
        }

        .orbitTwo {
          width: 430px;
          height: 430px;
          animation-duration: 34s;
          animation-direction: reverse;
        }

        .node {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 191, 72, 0.52);
          background: rgba(42, 26, 6, 0.95);
          color: #ffd476;
          font-size: 10px;
          font-style: normal;
          font-weight: 900;
          box-shadow: 0 0 18px rgba(255, 174, 25, 0.2);
        }

        .nodeOne {
          left: 50%;
          top: -25px;
        }

        .nodeTwo {
          left: -25px;
          top: 50%;
        }

        .nodeThree {
          right: -25px;
          top: 50%;
        }

        .nodeFour {
          left: 18%;
          top: 12px;
        }

        .nodeFive {
          right: 18%;
          bottom: 12px;
        }

        .nodeSix {
          left: -25px;
          bottom: 24%;
        }

        .principle,
        .lanes,
        .qualification,
        .process,
        .pricing,
        .economics,
        .notNetwork,
        .boundary,
        .finalCta {
          border: 1px solid rgba(181, 148, 96, 0.17);
          background:
            linear-gradient(180deg, rgba(24, 20, 15, 0.91), rgba(12, 11, 10, 0.96));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.24);
        }

        .principle {
          padding: 52px;
          text-align: center;
        }

        .principle h2,
        .sectionIntro h2,
        .qualification h2,
        .pricing h2,
        .economics h2,
        .notNetwork h2,
        .boundary h2,
        .finalCta h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .principle > p:not(.eyebrow),
        .sectionIntro > p:not(.eyebrow),
        .qualification p:not(.eyebrow),
        .pricing p,
        .economics p:not(.eyebrow),
        .notNetwork p,
        .boundary > p,
        .finalCta p:not(.eyebrow) {
          color: #b4aa9d;
          line-height: 1.68;
        }

        .principle > p:not(.eyebrow) {
          max-width: 820px;
          margin: 0 auto;
        }

        .lanes,
        .qualification,
        .process,
        .pricing,
        .economics,
        .notNetwork,
        .boundary {
          margin-top: 22px;
          padding: 42px;
        }

        .sectionIntro {
          max-width: 820px;
        }

        .laneLayout {
          display: grid;
          grid-template-columns: 0.82fr 1.18fr;
          gap: 18px;
          margin-top: 30px;
        }

        .laneButtons {
          display: grid;
          gap: 10px;
        }

        .laneButtons button {
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(179, 145, 95, 0.16);
          background: rgba(255, 255, 255, 0.018);
          color: #f8eedf;
          text-align: left;
          cursor: pointer;
        }

        .laneButtons button.active {
          border-color: rgba(255, 184, 42, 0.48);
          background: rgba(167, 99, 16, 0.1);
        }

        .laneButtons span {
          display: block;
          font-size: 17px;
          font-weight: 850;
        }

        .laneButtons small {
          display: block;
          margin-top: 7px;
          color: #9e9282;
          line-height: 1.45;
        }

        .laneDetail {
          padding: 28px;
          border-radius: 20px;
          border: 1px solid rgba(255, 184, 42, 0.22);
          background:
            radial-gradient(circle at 80% 10%, rgba(255, 180, 31, 0.08), transparent 34%),
            rgba(14, 12, 9, 0.88);
        }

        .laneDetail h3 {
          margin: 14px 0 10px;
          font-size: 34px;
          letter-spacing: -0.035em;
        }

        .laneSummary {
          color: #b5aa9b;
          line-height: 1.65;
        }

        .laneColumns {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
          margin-top: 24px;
        }

        .detailLabel {
          color: #ffbd3e;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .boundaryLabel {
          color: #ff9f7a;
        }

        ul {
          margin: 12px 0 0;
          padding-left: 20px;
          color: #d2c4b3;
        }

        li {
          margin-bottom: 9px;
          line-height: 1.52;
        }

        .qualification {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 38px;
          align-items: start;
        }

        .qualification h2,
        .pricing h2,
        .economics h2,
        .notNetwork h2,
        .boundary h2 {
          font-size: clamp(30px, 4.5vw, 48px);
        }

        .criteriaGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .criteriaGrid article {
          min-height: 120px;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(179, 145, 95, 0.15);
          background: rgba(255, 255, 255, 0.018);
        }

        .criteriaGrid span,
        .processGrid > article > span {
          color: #ffbd3e;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .criteriaGrid p {
          margin: 12px 0 0;
          color: #d5c8b8;
          line-height: 1.52;
        }

        .processGrid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-top: 28px;
        }

        .processGrid article {
          padding: 22px 18px;
          border-radius: 17px;
          border: 1px solid rgba(179, 145, 95, 0.15);
          background: rgba(255, 255, 255, 0.018);
        }

        .processGrid h3 {
          margin: 15px 0 9px;
          font-size: 21px;
        }

        .processGrid p {
          margin: 0;
          color: #a99e90;
          line-height: 1.55;
        }

        .pricing {
          display: grid;
          grid-template-columns: 0.72fr 1.28fr;
          gap: 42px;
          align-items: center;
        }

        .priceBlock {
          min-height: 310px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          border: 1px solid rgba(255, 188, 55, 0.34);
          background:
            radial-gradient(circle, rgba(255, 181, 30, 0.12), transparent 54%),
            rgba(15, 12, 8, 0.9);
          box-shadow: inset 0 0 38px rgba(255, 181, 30, 0.06);
          text-align: center;
        }

        .price {
          margin-top: 16px;
          color: #ffd16b;
          font-size: clamp(70px, 10vw, 120px);
          font-weight: 950;
          letter-spacing: -0.08em;
          line-height: 0.9;
        }

        .priceNote {
          margin-top: 14px;
          color: #a99a85;
          font-size: 13px;
        }

        .priceCopy .primaryButton {
          margin-top: 12px;
        }

        .economics {
          display: grid;
          grid-template-columns: 0.88fr 1.12fr;
          gap: 38px;
          align-items: center;
        }

        .economicsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .economicsGrid article {
          min-height: 220px;
          padding: 20px;
          border-radius: 17px;
          border: 1px solid rgba(179, 145, 95, 0.15);
          background: rgba(255, 255, 255, 0.018);
        }

        .economicsGrid span {
          color: #ae9e88;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .economicsGrid strong {
          display: block;
          margin-top: 14px;
          color: #ffca61;
          font-size: 25px;
        }

        .economicsGrid p {
          margin: 12px 0 0;
          line-height: 1.58;
        }

        .notNetwork {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .notGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .notGrid span {
          padding: 11px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 154, 115, 0.2);
          background: rgba(181, 74, 37, 0.06);
          color: #f1d9cf;
          font-size: 13px;
          font-weight: 800;
        }

        .boundary {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
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

        footer {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          color: #887d6e;
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

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 980px) {
          nav {
            display: none;
          }

          .hero,
          .laneLayout,
          .qualification,
          .pricing,
          .economics,
          .notNetwork,
          .boundary {
            grid-template-columns: 1fr;
          }

          .processGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .finalCta {
            flex-direction: column;
            align-items: flex-start;
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

          .networkVisual {
            min-height: 430px;
            transform: scale(0.8);
          }

          .principle,
          .lanes,
          .qualification,
          .process,
          .pricing,
          .economics,
          .notNetwork,
          .boundary,
          .finalCta {
            padding: 28px 24px;
          }

          .laneColumns,
          .criteriaGrid,
          .processGrid,
          .economicsGrid {
            grid-template-columns: 1fr;
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
