import Link from "next/link";

export const metadata = {
  title: "TA-14 Academy | The Seventh Door",
  description:
    "Enter the TA-14 Academy, the educational operating system of the TA-14 AI Governance Exchange.",
};

type RailItem = {
  label: string;
  href: string;
  glyph: string;
  action: string;
};

type Anchor = {
  number: string;
  title: string;
  description: string;
};

type Pathway = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
  status: string;
};

const railItems: RailItem[] = [
  {
    label: "Academy Home",
    href: "/academy",
    glyph: "AC",
    action: "Home",
  },
  {
    label: "Start Here",
    href: "/academy/start",
    glyph: "01",
    action: "Begin",
  },
  {
    label: "Mission Control",
    href: "/academy/dashboard",
    glyph: "MC",
    action: "Resume",
  },
  {
    label: "Architecture Explorer",
    href: "/academy/architecture-explorer",
    glyph: "AR",
    action: "Inspect",
  },
  {
    label: "Learning Routes",
    href: "/academy/routes",
    glyph: "RT",
    action: "Choose",
  },
  {
    label: "Simulation Center",
    href: "/academy/simulator",
    glyph: "SIM",
    action: "Test",
  },
  {
    label: "Review Workspace",
    href: "/academy/review",
    glyph: "RV",
    action: "Challenge",
  },
  {
    label: "Assessment Center",
    href: "/academy/assessment",
    glyph: "AS",
    action: "Prove",
  },
  {
    label: "Credential Dashboard",
    href: "/academy/credential-dashboard",
    glyph: "CR",
    action: "Advance",
  },
  {
    label: "Credential Registry",
    href: "/academy/credential-registry",
    glyph: "RG",
    action: "Verify",
  },
  {
    label: "Instructor Console",
    href: "/academy/instructor-console",
    glyph: "IN",
    action: "Teach",
  },
  {
    label: "Accreditation Center",
    href: "/academy/accreditation-center",
    glyph: "AD",
    action: "Govern",
  },
];

const anchors: Anchor[] = [
  {
    number: "01",
    title: "Reality",
    description: "What exists now, before interpretation or intervention.",
  },
  {
    number: "02",
    title: "Record",
    description: "What has been captured, by whom, when, and under what method.",
  },
  {
    number: "03",
    title: "Continuity",
    description: "Whether identity, provenance, time, custody, and sequence remain intact.",
  },
  {
    number: "04",
    title: "Admissibility",
    description: "Whether the evidence is sufficient for the exact decision being considered.",
  },
  {
    number: "05",
    title: "Binding",
    description: "Whether valid authority connects the determination to an allowed consequence.",
  },
  {
    number: "06",
    title: "Commit",
    description: "Whether the approved state is frozen, attributable, and version-preserved.",
  },
  {
    number: "07",
    title: "Execution",
    description: "Whether the action corresponds to the approved boundary and conditions.",
  },
  {
    number: "08",
    title: "Outcome",
    description: "Whether the real-world result is verified, preserved, and challengeable.",
  },
];

const pathways: Pathway[] = [
  {
    number: "01",
    eyebrow: "FOUNDATIONS",
    title: "Learn how governed execution begins.",
    description: "Understand the difference between a workflow and a governed route, between a record and admissible evidence, and between completion and permission to proceed.",
    href: "/academy/start",
    action: "Begin foundations",
    status: "AVAILABLE NOW",
  },
  {
    number: "02",
    eyebrow: "ARCHITECTURE",
    title: "Inspect the chain before you build.",
    description: "Explore the eight visible anchors while preserving the distinction between public orientation and the verified complete 24-link runtime architecture.",
    href: "/academy/architecture-explorer",
    action: "Explore architecture",
    status: "ORIENTATION",
  },
  {
    number: "03",
    eyebrow: "ROUTE CONSTRUCTION",
    title: "Move from uncertainty to a governed route.",
    description: "Use bounded questions, preserved gaps, explicit evidence, valid authority, continuity testing, and supported determinations to construct consequence-bearing routes.",
    href: "/academy/route-construction-lab",
    action: "Build a route",
    status: "CONNECTED LAB",
  },
  {
    number: "04",
    eyebrow: "SIMULATION",
    title: "Find the earliest failure before consequence.",
    description: "Test evidence, authority, continuity, boundary, and correspondence conditions before any execution is allowed to bind to reality.",
    href: "/academy/simulator",
    action: "Open simulation",
    status: "CONNECTED LAB",
  },
  {
    number: "05",
    eyebrow: "REVIEW",
    title: "Challenge, correct, and preserve what matters.",
    description: "Record findings, objections, corrections, versions, and unresolved gaps without rewriting history or manufacturing support.",
    href: "/academy/review",
    action: "Open review",
    status: "CONTROLLED WORKSPACE",
  },
  {
    number: "06",
    eyebrow: "ASSESSMENT",
    title: "Prove bounded competency, not attendance.",
    description: "Demonstrate the ability to reason, construct, test, review, and preserve a governed route within a declared scope.",
    href: "/academy/assessment",
    action: "Enter assessment",
    status: "EVIDENCE-BASED",
  },
];

const capabilities = [
  {
    title: "Mission Control",
    description: "Resume learning, routes, reviews, simulations, assessments, and credential progression from one institutional command center.",
  },
  {
    title: "Guided Construction",
    description: "Move through one bounded question at a time without hidden inference, silent answer selection, or fabricated completeness.",
  },
  {
    title: "Execution Simulation",
    description: "Test proposed routes against evidence, authority, continuity, boundary, and correspondence conditions before consequence.",
  },
  {
    title: "Bounded Review",
    description: "Preserve findings, objections, corrections, versions, and unresolved gaps without pretending missing support exists.",
  },
  {
    title: "Competency Evidence",
    description: "Separate attendance and content completion from demonstrated, attributable, scope-bounded capability.",
  },
  {
    title: "Registry Connection",
    description: "Return authorized credential events to the existing Exchange Registry instead of creating a duplicate source of truth.",
  },
  {
    title: "Instructor Governance",
    description: "Give instructors controlled tools for cohorts, lessons, reviews, assessments, interventions, and evidence preservation.",
  },
  {
    title: "Institutional Accreditation",
    description: "Manage program standards, reviewer findings, corrective actions, renewals, and institutional readiness.",
  },
];

const operatingPrinciples = [
  "Evidence before intervention",
  "Admissibility before execution",
  "Authority before binding",
  "Continuity before reliance",
  "Boundary before autonomy",
  "Commit before consequence",
  "Correspondence during execution",
  "Outcome evidence after execution",
];

const learningSequence = [
  {
    step: "01",
    title: "Purpose",
  },
  {
    step: "02",
    title: "Actors",
  },
  {
    step: "03",
    title: "Consequence",
  },
  {
    step: "04",
    title: "Boundary",
  },
  {
    step: "05",
    title: "Reality",
  },
  {
    step: "06",
    title: "Record",
  },
  {
    step: "07",
    title: "Evidence",
  },
  {
    step: "08",
    title: "Authority",
  },
  {
    step: "09",
    title: "Continuity",
  },
  {
    step: "10",
    title: "Admissibility",
  },
  {
    step: "11",
    title: "Determination",
  },
  {
    step: "12",
    title: "Preservation",
  },
];

export default function AcademyPage() {
  return (
    <main className="academyEntrance">
      <style>{`

        :root {
          --academy-ink: #eef8ff;
          --academy-muted: #8ea7bb;
          --academy-faint: #60788b;
          --academy-cyan: #56e8ff;
          --academy-green: #3df2a3;
          --academy-gold: #f0c35a;
          --academy-line: rgba(130, 181, 218, 0.16);
          --academy-panel: rgba(7, 18, 29, 0.88);
          --academy-panel-strong: rgba(4, 12, 21, 0.96);
          --academy-rail-width: 292px;
        }


        /* The shared Academy layout owns the permanent left rail and content offset. */
        .academy-framework > .academy-content {
          min-width: 0;
          width: auto;
        }

        .academyEntrance {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--academy-ink);
          background:
            radial-gradient(circle at 16% 3%, rgba(86, 232, 255, 0.12), transparent 28%),
            radial-gradient(circle at 88% 11%, rgba(61, 242, 163, 0.08), transparent 24%),
            radial-gradient(circle at 54% 70%, rgba(64, 86, 178, 0.08), transparent 34%),
            #020810;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .academyEntrance *,
        .academyEntrance *::before,
        .academyEntrance *::after {
          box-sizing: border-box;
        }

        .academyCosmos {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .academyGrid {
          position: absolute;
          inset: 0;
          opacity: 0.2;
          background-image:
            linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, #000 0%, rgba(0,0,0,.78) 62%, transparent 100%);
        }

        .academyStarfield,
        .academyStarfield::before,
        .academyStarfield::after {
          position: absolute;
          inset: 0;
          content: "";
          background-repeat: repeat;
        }

        .academyStarfield {
          opacity: .48;
          background-image: radial-gradient(circle, rgba(255,255,255,.72) 0 1px, transparent 1.4px);
          background-size: 137px 137px;
          background-position: 12px 24px;
        }

        .academyStarfield::before {
          opacity: .45;
          background-image: radial-gradient(circle, rgba(86,232,255,.68) 0 1px, transparent 1.4px);
          background-size: 211px 211px;
          background-position: 76px 14px;
        }

        .academyStarfield::after {
          opacity: .32;
          background-image: radial-gradient(circle, rgba(61,242,163,.62) 0 1px, transparent 1.4px);
          background-size: 293px 293px;
          background-position: 132px 88px;
        }

        .academyNebula {
          position: absolute;
          width: 34rem;
          height: 34rem;
          border-radius: 50%;
          filter: blur(76px);
          opacity: .16;
        }

        .academyNebulaOne {
          top: -14rem;
          left: 18%;
          background: #55e7ff;
        }

        .academyNebulaTwo {
          top: 32rem;
          right: -16rem;
          background: #3df2a3;
        }

        .academyMeteor {
          position: absolute;
          width: 170px;
          height: 1px;
          opacity: .42;
          transform: rotate(-28deg);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.9));
          animation: academyMeteor 12s linear infinite;
        }

        .academyMeteorOne { top: 12%; left: 62%; animation-delay: -2s; }
        .academyMeteorTwo { top: 42%; left: 82%; animation-delay: -8s; }
        .academyMeteorThree { top: 74%; left: 47%; animation-delay: -5s; }

        @keyframes academyMeteor {
          0% { transform: translate3d(220px,-120px,0) rotate(-28deg); opacity: 0; }
          8% { opacity: .48; }
          24% { opacity: 0; }
          100% { transform: translate3d(-980px,560px,0) rotate(-28deg); opacity: 0; }
        }

        .academyRail {
          display: none !important;
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 90;
          width: var(--academy-rail-width);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 18px 16px 22px;
          border-right: 1px solid rgba(130,181,218,.18);
          background:
            radial-gradient(circle at 50% 0%, rgba(86,232,255,.10), transparent 29%),
            linear-gradient(180deg, rgba(3,10,18,.985), rgba(2,8,14,.97));
          box-shadow: 24px 0 70px rgba(0,0,0,.30);
          backdrop-filter: blur(24px);
        }

        .academyRailBrand {
          display: grid;
          grid-template-columns: 46px minmax(0,1fr);
          align-items: center;
          gap: 12px;
          min-height: 68px;
          padding: 8px 7px 16px;
          border-bottom: 1px solid rgba(130,181,218,.14);
          color: #fff;
          text-decoration: none;
        }

        .academyRailMark {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(86,232,255,.34);
          border-radius: 14px;
          color: #e7fbff;
          background: linear-gradient(145deg, rgba(86,232,255,.21), rgba(15,35,52,.75));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 14px 30px rgba(40,199,230,.12);
          font-size: .72rem;
          font-weight: 950;
          letter-spacing: -.03em;
        }

        .academyRailBrandCopy {
          min-width: 0;
          display: grid;
          gap: 3px;
        }

        .academyRailBrandCopy strong {
          color: #fff;
          font-size: .84rem;
          letter-spacing: .11em;
        }

        .academyRailBrandCopy span {
          overflow: hidden;
          color: #8198ac;
          font-size: .66rem;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .academyReturn {
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 14px 7px 16px;
          border: 1px solid rgba(138,177,211,.18);
          border-radius: 12px;
          color: #c9d9e7;
          background: rgba(255,255,255,.025);
          text-decoration: none;
          font-size: .72rem;
          font-weight: 850;
          transition: 160ms ease;
        }

        .academyReturn:hover,
        .academyReturn:focus-visible {
          color: #fff;
          border-color: rgba(86,232,255,.35);
          background: rgba(86,232,255,.07);
          outline: none;
          transform: translateY(-1px);
        }

        .academyRailLabel {
          display: block;
          padding: 0 10px 8px;
          color: #62798d;
          font-size: .61rem;
          font-weight: 950;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .academyRailNav {
          display: grid;
          gap: 5px;
        }

        .academyRailLink {
          min-height: 46px;
          display: grid;
          grid-template-columns: 31px minmax(0,1fr) auto;
          align-items: center;
          gap: 9px;
          padding: 7px 9px;
          border: 1px solid transparent;
          border-radius: 13px;
          color: #aebfd0;
          text-decoration: none;
          transition: 160ms ease;
        }

        .academyRailLink:hover,
        .academyRailLink:focus-visible {
          color: #fff;
          border-color: rgba(86,232,255,.22);
          background: rgba(86,232,255,.06);
          outline: none;
          transform: translateX(2px);
        }

        .academyRailLinkActive {
          color: #fff;
          border-color: rgba(86,232,255,.29);
          background: linear-gradient(135deg, rgba(86,232,255,.14), rgba(61,242,163,.035));
          box-shadow: inset 3px 0 0 var(--academy-cyan);
        }

        .academyRailGlyph {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 9px;
          color: #70eaff;
          background: rgba(255,255,255,.025);
          font-size: .55rem;
          font-weight: 950;
        }

        .academyRailLinkCopy {
          min-width: 0;
          display: grid;
          gap: 1px;
        }

        .academyRailLinkCopy strong {
          overflow: hidden;
          color: inherit;
          font-size: .76rem;
          font-weight: 820;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .academyRailLinkCopy small {
          color: #60788b;
          font-size: .58rem;
          font-weight: 760;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .academyRailArrow {
          color: #587387;
          font-size: .72rem;
          font-weight: 900;
        }

        .academyRailCta {
          margin-top: 18px;
          padding: 18px;
          border: 1px solid rgba(61,242,163,.22);
          border-radius: 19px;
          background:
            radial-gradient(circle at 100% 0%, rgba(86,232,255,.14), transparent 44%),
            linear-gradient(145deg, rgba(61,242,163,.08), rgba(255,255,255,.02));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.045);
        }

        .academyRailCta small {
          display: block;
          color: #65f1b5;
          font-size: .60rem;
          font-weight: 950;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        .academyRailCta h2 {
          margin: 8px 0 0;
          color: #fff;
          font-size: .96rem;
          line-height: 1.35;
        }

        .academyRailCta p {
          margin: 8px 0 14px;
          color: #8fa6b8;
          font-size: .70rem;
          line-height: 1.55;
        }

        .academyRailPrimary,
        .academyRailSecondary {
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          text-decoration: none;
          font-size: .72rem;
          font-weight: 950;
        }

        .academyRailPrimary {
          color: #03120d;
          background: linear-gradient(105deg, #56e8ff, #3df2a3);
          box-shadow: 0 12px 28px rgba(61,242,163,.14);
        }

        .academyRailSecondary {
          margin-top: 8px;
          border: 1px solid rgba(130,181,218,.18);
          color: #bdd0df;
          background: rgba(255,255,255,.025);
        }

        .academyRailStatus {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 10px;
        }

        .academyRailStatus span {
          padding: 8px 7px;
          border: 1px solid rgba(130,181,218,.12);
          border-radius: 10px;
          color: #7991a4;
          background: rgba(255,255,255,.018);
          font-size: .57rem;
          font-weight: 800;
          text-align: center;
          text-transform: uppercase;
        }

        .academyMain {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          margin-left: 0;
        }

        .academyTopbar {
          position: sticky;
          top: 0;
          z-index: 50;
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 0 38px;
          border-bottom: 1px solid rgba(130,181,218,.13);
          background: rgba(2,8,15,.79);
          backdrop-filter: blur(22px);
        }

        .academyTopbarIdentity {
          display: grid;
          gap: 2px;
        }

        .academyTopbarIdentity strong {
          color: #fff;
          font-size: .77rem;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .academyTopbarIdentity span {
          color: #6c8498;
          font-size: .67rem;
        }

        .academyTopbarNav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .academyTopbarNav a {
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          padding: 0 13px;
          border: 1px solid transparent;
          border-radius: 11px;
          color: #9eb2c3;
          text-decoration: none;
          font-size: .70rem;
          font-weight: 850;
        }

        .academyTopbarNav a:hover {
          color: #fff;
          border-color: rgba(86,232,255,.19);
          background: rgba(86,232,255,.055);
        }

        .academyTopbarNav .academySignIn {
          border-color: rgba(86,232,255,.25);
          color: #dffaff;
          background: rgba(86,232,255,.07);
        }

        .academyContent {
          width: min(1560px, 100%);
          margin: 0 auto;
          padding: 0 38px 90px;
        }

        .academyHero {
          min-height: 780px;
          display: grid;
          grid-template-columns: minmax(0,1.12fr) minmax(390px,.88fr);
          align-items: center;
          gap: 54px;
          padding: 84px 0 74px;
        }

        .academyDoorLabel {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 31px;
        }

        .academyDoorLabel span {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(86,232,255,.31);
          border-radius: 13px;
          color: var(--academy-cyan);
          background: rgba(86,232,255,.06);
          font-size: .75rem;
          font-weight: 950;
        }

        .academyDoorLabel p {
          margin: 0;
          color: #879fb2;
          font-size: .73rem;
          font-weight: 800;
          letter-spacing: .03em;
        }

        .academyEyebrow {
          margin: 0 0 16px;
          color: var(--academy-green);
          font-size: .69rem;
          font-weight: 950;
          letter-spacing: .17em;
          text-transform: uppercase;
        }

        .academyHero h1 {
          max-width: 860px;
          margin: 0;
          color: #fff;
          font-size: clamp(3.6rem, 6.35vw, 7.5rem);
          line-height: .93;
          letter-spacing: -.075em;
        }

        .academyHero h1 em {
          display: block;
          color: transparent;
          background: linear-gradient(102deg, #eefcff 8%, #73ecff 47%, #55f0b4 88%);
          background-clip: text;
          font-style: normal;
        }

        .academyHeroSummary {
          max-width: 810px;
          margin: 29px 0 0;
          color: #9db3c4;
          font-size: 1.08rem;
          line-height: 1.76;
        }

        .academyHeroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }

        .academyButtonPrimary,
        .academyButtonSecondary {
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          padding: 0 21px;
          border-radius: 14px;
          text-decoration: none;
          font-size: .79rem;
          font-weight: 950;
        }

        .academyButtonPrimary {
          min-width: 184px;
          color: #03120d;
          background: linear-gradient(105deg, #56e8ff, #3df2a3);
          box-shadow: 0 18px 45px rgba(61,242,163,.14);
        }

        .academyButtonSecondary {
          border: 1px solid rgba(130,181,218,.21);
          color: #d4e5f1;
          background: rgba(255,255,255,.035);
        }

        .academyBoundaryRow {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 28px;
        }

        .academyBoundaryRow span {
          padding: 9px 11px;
          border: 1px solid rgba(130,181,218,.14);
          border-radius: 999px;
          color: #7f98aa;
          background: rgba(255,255,255,.02);
          font-size: .63rem;
          font-weight: 820;
        }

        .academyPortal {
          position: relative;
          min-height: 560px;
          display: grid;
          place-items: center;
        }

        .academyPortalRing {
          position: absolute;
          border: 1px solid rgba(86,232,255,.18);
          border-radius: 50%;
          animation: academySpin 30s linear infinite;
        }

        .academyPortalRingOne { width: 510px; height: 510px; }
        .academyPortalRingTwo { width: 420px; height: 420px; animation-direction: reverse; animation-duration: 24s; }
        .academyPortalRingThree { width: 330px; height: 330px; animation-duration: 18s; }

        .academyPortalRing::before,
        .academyPortalRing::after {
          position: absolute;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          content: "";
          background: var(--academy-cyan);
          box-shadow: 0 0 20px rgba(86,232,255,.75);
        }

        .academyPortalRing::before { top: 16%; left: 8%; }
        .academyPortalRing::after { right: 10%; bottom: 18%; background: var(--academy-green); }

        @keyframes academySpin { to { transform: rotate(360deg); } }

        .academyPortalCore {
          position: relative;
          z-index: 2;
          width: 270px;
          height: 390px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(86,232,255,.31);
          border-radius: 136px 136px 34px 34px;
          background:
            radial-gradient(circle at 50% 26%, rgba(86,232,255,.18), transparent 33%),
            linear-gradient(180deg, rgba(10,27,42,.92), rgba(3,12,20,.98));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.15),
            0 0 90px rgba(86,232,255,.11),
            0 34px 90px rgba(0,0,0,.44);
        }

        .academyPortalInner {
          display: grid;
          place-items: center;
          text-align: center;
        }

        .academyPortalNumber {
          color: rgba(255,255,255,.09);
          font-size: 8rem;
          font-weight: 950;
          line-height: .8;
          letter-spacing: -.09em;
        }

        .academyPortalBadge {
          width: 72px;
          height: 72px;
          display: grid;
          place-items: center;
          margin-top: -18px;
          border: 1px solid rgba(61,242,163,.32);
          border-radius: 22px;
          color: #dfffee;
          background: rgba(61,242,163,.08);
          font-size: 1.1rem;
          font-weight: 950;
        }

        .academyPortalInner strong {
          margin-top: 18px;
          color: #fff;
          font-size: 1.16rem;
          letter-spacing: .18em;
        }

        .academyPortalInner p {
          margin: 5px 0 0;
          color: var(--academy-cyan);
          font-size: .78rem;
          font-weight: 950;
          letter-spacing: .28em;
        }

        .academyPortalCaption {
          position: absolute;
          bottom: 18px;
          width: min(420px, 88%);
          margin: 0;
          color: #7891a4;
          font-size: .72rem;
          font-weight: 760;
          line-height: 1.55;
          text-align: center;
        }

        .academyPrincipleBand {
          display: grid;
          grid-template-columns: minmax(0,.9fr) minmax(0,1.1fr);
          gap: 36px;
          padding: 32px;
          border: 1px solid rgba(61,242,163,.20);
          border-radius: 24px;
          background:
            radial-gradient(circle at 0 50%, rgba(61,242,163,.09), transparent 29%),
            linear-gradient(135deg, rgba(9,25,35,.92), rgba(5,14,23,.84));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
        }

        .academyPrincipleBand small {
          display: block;
          color: var(--academy-green);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .17em;
          text-transform: uppercase;
        }

        .academyPrincipleBand h2 {
          margin: 9px 0 0;
          color: #fff;
          font-size: clamp(1.55rem, 2.5vw, 2.7rem);
          line-height: 1.08;
          letter-spacing: -.045em;
        }

        .academyPrincipleBand > p {
          align-self: center;
          margin: 0;
          color: #9ab0c1;
          font-size: .92rem;
          line-height: 1.75;
        }

        .academySection {
          padding: 108px 0 0;
        }

        .academySectionIntro {
          display: grid;
          grid-template-columns: minmax(0,1fr) minmax(300px,.66fr);
          align-items: end;
          gap: 48px;
          margin-bottom: 36px;
        }

        .academySectionIntro h2 {
          max-width: 900px;
          margin: 0;
          color: #fff;
          font-size: clamp(2.3rem, 4.1vw, 4.8rem);
          line-height: .98;
          letter-spacing: -.06em;
        }

        .academySectionIntro > p {
          margin: 0;
          color: #8ea5b7;
          font-size: .90rem;
          line-height: 1.72;
        }

        .academyAnchorGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 12px;
        }

        .academyAnchorCard {
          position: relative;
          min-height: 244px;
          padding: 23px;
          overflow: hidden;
          border: 1px solid rgba(130,181,218,.15);
          border-radius: 20px;
          background: linear-gradient(155deg, rgba(9,23,35,.88), rgba(4,12,20,.90));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.035);
        }

        .academyAnchorCard::after {
          position: absolute;
          right: -30px;
          bottom: -50px;
          width: 120px;
          height: 120px;
          border: 1px solid rgba(86,232,255,.10);
          border-radius: 50%;
          content: "";
        }

        .academyAnchorCard span {
          color: var(--academy-cyan);
          font-size: .67rem;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .academyAnchorCard h3 {
          margin: 42px 0 12px;
          color: #fff;
          font-size: 1.35rem;
          letter-spacing: -.025em;
        }

        .academyAnchorCard p {
          margin: 0;
          color: #8199ab;
          font-size: .78rem;
          line-height: 1.65;
        }

        .academyArchitectureStatement {
          display: grid;
          grid-template-columns: auto minmax(0,1fr);
          gap: 18px;
          margin-top: 16px;
          padding: 25px;
          border: 1px solid rgba(86,232,255,.15);
          border-radius: 18px;
          background: rgba(86,232,255,.035);
        }

        .academyPulse {
          width: 11px;
          height: 11px;
          margin-top: 7px;
          border-radius: 50%;
          background: var(--academy-green);
          box-shadow: 0 0 18px rgba(61,242,163,.72);
        }

        .academyArchitectureStatement p {
          margin: 0;
          color: #a8bdcc;
          font-size: .92rem;
          line-height: 1.7;
        }

        .academyPathwayGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 14px;
        }

        .academyPathwayCard {
          min-height: 370px;
          display: flex;
          flex-direction: column;
          padding: 25px;
          border: 1px solid rgba(130,181,218,.16);
          border-radius: 22px;
          background:
            radial-gradient(circle at 100% 0%, rgba(86,232,255,.07), transparent 35%),
            linear-gradient(150deg, rgba(8,22,34,.92), rgba(4,12,20,.92));
          transition: 180ms ease;
        }

        .academyPathwayCard:hover {
          border-color: rgba(86,232,255,.29);
          transform: translateY(-3px);
          box-shadow: 0 24px 60px rgba(0,0,0,.22);
        }

        .academyPathwayTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .academyPathwayTop span {
          color: var(--academy-cyan);
          font-size: .70rem;
          font-weight: 950;
        }

        .academyPathwayTop small {
          color: #688195;
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .09em;
        }

        .academyPathwayEyebrow {
          margin: 39px 0 10px;
          color: var(--academy-green);
          font-size: .63rem;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .academyPathwayCard h3 {
          margin: 0;
          color: #fff;
          font-size: 1.48rem;
          line-height: 1.15;
          letter-spacing: -.035em;
        }

        .academyPathwayCard > p:last-of-type {
          margin: 14px 0 28px;
          color: #849cad;
          font-size: .80rem;
          line-height: 1.67;
        }

        .academyPathwayCard a {
          min-height: 46px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding: 0 14px;
          border: 1px solid rgba(86,232,255,.18);
          border-radius: 13px;
          color: #dffaff;
          background: rgba(86,232,255,.05);
          text-decoration: none;
          font-size: .72rem;
          font-weight: 900;
        }

        .academyGuided {
          display: grid;
          grid-template-columns: minmax(0,1fr) minmax(340px,.72fr);
          gap: 18px;
        }

        .academyGuidedCopy,
        .academyQuestionPanel {
          border: 1px solid rgba(130,181,218,.16);
          border-radius: 24px;
          background: linear-gradient(155deg, rgba(8,22,34,.90), rgba(4,12,20,.93));
        }

        .academyGuidedCopy {
          padding: 34px;
        }

        .academyGuidedCopy h2 {
          max-width: 850px;
          margin: 0;
          color: #fff;
          font-size: clamp(2.2rem, 3.9vw, 4.3rem);
          line-height: 1;
          letter-spacing: -.06em;
        }

        .academyGuidedCopy > p:last-of-type {
          max-width: 850px;
          margin: 22px 0 0;
          color: #91a8ba;
          font-size: .90rem;
          line-height: 1.76;
        }

        .academySequence {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 8px;
          margin-top: 30px;
        }

        .academySequenceItem {
          min-height: 70px;
          display: grid;
          align-content: center;
          gap: 3px;
          padding: 10px;
          border: 1px solid rgba(130,181,218,.12);
          border-radius: 12px;
          background: rgba(255,255,255,.018);
        }

        .academySequenceItem span {
          color: var(--academy-cyan);
          font-size: .55rem;
          font-weight: 950;
        }

        .academySequenceItem strong {
          color: #cbdbe7;
          font-size: .68rem;
        }

        .academyQuestionPanel {
          padding: 28px;
          background:
            radial-gradient(circle at 100% 0%, rgba(61,242,163,.10), transparent 42%),
            linear-gradient(155deg, rgba(8,24,34,.94), rgba(4,12,20,.96));
        }

        .academyQuestionPanel > small {
          color: var(--academy-green);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .academyQuestionPanel h3 {
          margin: 18px 0 0;
          color: #fff;
          font-size: 1.65rem;
          line-height: 1.16;
          letter-spacing: -.035em;
        }

        .academyQuestionPanel > p {
          margin: 12px 0 0;
          color: #8da5b7;
          font-size: .78rem;
          line-height: 1.65;
        }

        .academyPromptBox {
          min-height: 106px;
          margin-top: 22px;
          padding: 16px;
          border: 1px solid rgba(86,232,255,.18);
          border-radius: 14px;
          color: #5f788c;
          background: rgba(1,7,12,.62);
          font-size: .74rem;
          line-height: 1.6;
        }

        .academyGuidanceList {
          display: grid;
          gap: 8px;
          margin-top: 16px;
        }

        .academyGuidanceList span {
          min-height: 38px;
          display: flex;
          align-items: center;
          padding: 0 11px;
          border: 1px solid rgba(130,181,218,.11);
          border-radius: 10px;
          color: #829bad;
          background: rgba(255,255,255,.018);
          font-size: .66rem;
          font-weight: 780;
        }

        .academyCapabilityGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 12px;
        }

        .academyCapabilityCard {
          min-height: 220px;
          padding: 24px;
          border: 1px solid rgba(130,181,218,.15);
          border-radius: 19px;
          background: linear-gradient(155deg, rgba(8,21,33,.89), rgba(4,12,20,.92));
        }

        .academyCapabilityNumber {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(86,232,255,.22);
          border-radius: 11px;
          color: var(--academy-cyan);
          background: rgba(86,232,255,.045);
          font-size: .64rem;
          font-weight: 950;
        }

        .academyCapabilityCard h3 {
          margin: 29px 0 10px;
          color: #fff;
          font-size: 1.10rem;
          letter-spacing: -.025em;
        }

        .academyCapabilityCard p {
          margin: 0;
          color: #8098aa;
          font-size: .76rem;
          line-height: 1.65;
        }

        .academyOperatingGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 10px;
        }

        .academyOperatingItem {
          min-height: 132px;
          display: grid;
          align-content: space-between;
          gap: 20px;
          padding: 18px;
          border: 1px solid rgba(130,181,218,.13);
          border-radius: 16px;
          background: rgba(255,255,255,.018);
        }

        .academyOperatingItem span {
          color: var(--academy-green);
          font-size: .60rem;
          font-weight: 950;
        }

        .academyOperatingItem strong {
          color: #d8e6ef;
          font-size: .80rem;
          line-height: 1.45;
        }

        .academyInstitutional {
          display: grid;
          grid-template-columns: minmax(0,1fr) minmax(0,1fr);
          gap: 14px;
        }

        .academyInstitutionalCard {
          min-height: 310px;
          padding: 30px;
          border: 1px solid rgba(130,181,218,.16);
          border-radius: 22px;
          background:
            radial-gradient(circle at 100% 0%, rgba(86,232,255,.08), transparent 37%),
            linear-gradient(155deg, rgba(8,22,34,.92), rgba(4,12,20,.94));
        }

        .academyInstitutionalCard h3 {
          margin: 0;
          color: #fff;
          font-size: 1.7rem;
          letter-spacing: -.04em;
        }

        .academyInstitutionalCard > p {
          margin: 13px 0 22px;
          color: #8ca4b6;
          font-size: .82rem;
          line-height: 1.7;
        }

        .academyInstitutionalLinks {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .academyInstitutionalLinks a {
          min-height: 46px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 13px;
          border: 1px solid rgba(130,181,218,.14);
          border-radius: 12px;
          color: #b9cedd;
          background: rgba(255,255,255,.02);
          text-decoration: none;
          font-size: .69rem;
          font-weight: 850;
        }

        .academyFinalCta {
          position: relative;
          overflow: hidden;
          padding: 52px;
          border: 1px solid rgba(61,242,163,.24);
          border-radius: 28px;
          background:
            radial-gradient(circle at 0 50%, rgba(61,242,163,.13), transparent 34%),
            radial-gradient(circle at 100% 0%, rgba(86,232,255,.12), transparent 38%),
            linear-gradient(135deg, rgba(8,25,34,.94), rgba(4,12,20,.96));
        }

        .academyFinalCta::after {
          position: absolute;
          right: -100px;
          bottom: -180px;
          width: 440px;
          height: 440px;
          border: 1px solid rgba(86,232,255,.12);
          border-radius: 50%;
          content: "";
        }

        .academyFinalCta h2 {
          position: relative;
          z-index: 2;
          max-width: 970px;
          margin: 0;
          color: #fff;
          font-size: clamp(2.6rem, 5vw, 5.7rem);
          line-height: .96;
          letter-spacing: -.065em;
        }

        .academyFinalCta p {
          position: relative;
          z-index: 2;
          max-width: 820px;
          margin: 22px 0 0;
          color: #9ab0c1;
          font-size: .94rem;
          line-height: 1.72;
        }

        .academyFinalActions {
          position: relative;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .academyFooter {
          display: grid;
          grid-template-columns: minmax(0,1fr) auto;
          align-items: end;
          gap: 30px;
          padding: 48px 0 16px;
        }

        .academyFooter strong {
          display: block;
          color: #fff;
          font-size: .82rem;
          letter-spacing: .12em;
        }

        .academyFooter p {
          margin: 7px 0 0;
          color: #677f93;
          font-size: .70rem;
        }

        .academyFooterStats {
          display: flex;
          gap: 10px;
        }

        .academyFooterStats span {
          min-width: 116px;
          padding: 12px;
          border: 1px solid rgba(130,181,218,.12);
          border-radius: 12px;
          color: #6f8799;
          background: rgba(255,255,255,.018);
          font-size: .62rem;
          font-weight: 800;
          text-align: center;
        }

        .academyMobileBar {
          display: none;
        }

        @media (max-width: 1260px) {
          :root { --academy-rail-width: 264px; }
          .academyHero { grid-template-columns: minmax(0,1fr) 390px; gap: 28px; }
          .academyAnchorGrid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .academyCapabilityGrid { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }

        @media (max-width: 1020px) {
          .academyRail { display: none; }
          .academyMain { margin-left: 0; }
          .academyContent { padding-right: 24px; padding-left: 24px; padding-bottom: 110px; }
          .academyTopbar { padding: 0 24px; }
          .academyMobileBar {
            position: fixed;
            right: 10px;
            bottom: 10px;
            left: 10px;
            z-index: 100;
            min-height: 66px;
            display: grid;
            grid-template-columns: repeat(5,minmax(0,1fr));
            gap: 4px;
            padding: 7px;
            border: 1px solid rgba(130,181,218,.18);
            border-radius: 20px;
            background: rgba(3,9,16,.95);
            box-shadow: 0 22px 60px rgba(0,0,0,.44);
            backdrop-filter: blur(22px);
          }
          .academyMobileBar a {
            display: grid;
            place-items: center;
            align-content: center;
            gap: 4px;
            border-radius: 12px;
            color: #8fa5b6;
            text-decoration: none;
            font-size: .58rem;
            font-weight: 850;
            text-align: center;
          }
          .academyMobileBar a:first-child { color: #fff; background: rgba(86,232,255,.10); }
          .academyMobileBar b { color: var(--academy-cyan); font-size: .64rem; }
        }

        @media (max-width: 820px) {
          .academyTopbarNav a:not(.academySignIn) { display: none; }
          .academyHero { min-height: auto; grid-template-columns: 1fr; padding-top: 60px; }
          .academyPortal { min-height: 500px; }
          .academyPrincipleBand,
          .academySectionIntro,
          .academyGuided,
          .academyInstitutional { grid-template-columns: 1fr; }
          .academyPathwayGrid { grid-template-columns: 1fr; }
          .academyOperatingGrid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .academyFinalCta { padding: 34px; }
          .academyFooter { grid-template-columns: 1fr; }
        }

        @media (max-width: 560px) {
          .academyContent { padding-right: 16px; padding-left: 16px; }
          .academyTopbar { padding: 0 16px; }
          .academyTopbarIdentity span { display: none; }
          .academyHero h1 { font-size: clamp(3rem, 16vw, 4.8rem); }
          .academyPortal { min-height: 420px; }
          .academyPortalRingOne { width: 360px; height: 360px; }
          .academyPortalRingTwo { width: 300px; height: 300px; }
          .academyPortalRingThree { width: 240px; height: 240px; }
          .academyPortalCore { width: 210px; height: 310px; }
          .academyAnchorGrid,
          .academyCapabilityGrid,
          .academyOperatingGrid { grid-template-columns: 1fr; }
          .academySequence { grid-template-columns: repeat(3,minmax(0,1fr)); }
          .academyInstitutionalLinks { grid-template-columns: 1fr; }
          .academyFinalCta { padding: 26px; }
          .academyFooterStats { flex-wrap: wrap; }
        }
      `}</style>

      <div className="academyCosmos" aria-hidden="true">
        <span className="academyGrid" />
        <span className="academyStarfield" />
        <span className="academyNebula academyNebulaOne" />
        <span className="academyNebula academyNebulaTwo" />
        <span className="academyMeteor academyMeteorOne" />
        <span className="academyMeteor academyMeteorTwo" />
        <span className="academyMeteor academyMeteorThree" />
      </div>

      <aside className="academyRail" aria-label="TA-14 Academy primary navigation">
        <Link className="academyRailBrand" href="/academy">
          <span className="academyRailMark">TA-14</span>
          <span className="academyRailBrandCopy">
            <strong>TA-14 ACADEMY</strong>
            <span>Seventh major door of the Exchange</span>
          </span>
        </Link>

        <Link className="academyReturn" href="/">
          ← Return to Exchange
        </Link>

        <span className="academyRailLabel">Academy destinations</span>
        <nav className="academyRailNav">
          {railItems.map((item, index) => (
            <Link
              key={item.href}
              className={`academyRailLink${index === 0 ? " academyRailLinkActive" : ""}`}
              href={item.href}
              aria-current={index === 0 ? "page" : undefined}
            >
              <span className="academyRailGlyph" aria-hidden="true">
                {item.glyph}
              </span>
              <span className="academyRailLinkCopy">
                <strong>{item.label}</strong>
                <small>{item.action}</small>
              </span>
              <span className="academyRailArrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>

        <article className="academyRailCta">
          <small>Primary call to action</small>
          <h2>Begin the governed learning route.</h2>
          <p>
            Start with orientation, then construct, simulate, review, assess,
            and preserve competency evidence without governance shortcuts.
          </p>
          <Link className="academyRailPrimary" href="/academy/start">
            Start the Academy →
          </Link>
          <Link className="academyRailSecondary" href="/academy/dashboard">
            Open Mission Control
          </Link>
          <div className="academyRailStatus">
            <span>Door 07</span>
            <span>Institution live</span>
          </div>
        </article>
      </aside>

      <div className="academyMain">
        <header className="academyTopbar">
          <div className="academyTopbarIdentity">
            <strong>TA-14 Academy</strong>
            <span>Educational operating system for AI governance</span>
          </div>
          <nav className="academyTopbarNav" aria-label="Academy utility navigation">
            <a href="#architecture">Architecture</a>
            <a href="#pathways">Pathways</a>
            <a href="#capabilities">Capabilities</a>
            <Link className="academySignIn" href="/login">Sign in</Link>
          </nav>
        </header>

        <div className="academyContent">
          <section className="academyHero" id="start">
            <div>
              <div className="academyDoorLabel">
                <span>07</span>
                <p>The seventh institutional door is now open.</p>
              </div>
              <p className="academyEyebrow">The educational operating system for AI governance</p>
              <h1>
                Learn how consequential AI
                <em>earns the right to proceed.</em>
              </h1>
              <p className="academyHeroSummary">
                TA-14 Academy turns governance architecture into a guided,
                inspectable, practical learning experience. Understand the system.
                Build the route. Test the conditions. Preserve the evidence.
                Prove the competency.
              </p>
              <div className="academyHeroActions">
                <Link className="academyButtonPrimary" href="/academy/start">
                  <span>Start Here</span>
                  <b aria-hidden="true">→</b>
                </Link>
                <Link className="academyButtonSecondary" href="/academy/architecture-explorer">
                  Explore the architecture
                </Link>
                <Link className="academyButtonSecondary" href="/academy/dashboard">
                  Open Mission Control
                </Link>
              </div>
              <div className="academyBoundaryRow">
                <span>Education before tools</span>
                <span>Competency before credentials</span>
                <span>Evidence before execution</span>
              </div>
            </div>

            <aside className="academyPortal" aria-label="TA-14 Academy seventh door">
              <span className="academyPortalRing academyPortalRingOne" />
              <span className="academyPortalRing academyPortalRingTwo" />
              <span className="academyPortalRing academyPortalRingThree" />
              <div className="academyPortalCore">
                <div className="academyPortalInner">
                  <span className="academyPortalNumber">7</span>
                  <span className="academyPortalBadge">AC</span>
                  <strong>TA-14</strong>
                  <p>ACADEMY</p>
                </div>
              </div>
              <p className="academyPortalCaption">
                One Academy. One canonical entrance. No duplicate institution.
              </p>
            </aside>
          </section>

          <section className="academyPrincipleBand" aria-label="Academy governing principle">
            <div>
              <small>Governing principle</small>
              <h2>No admissible evidence. No admissible execution.</h2>
            </div>
            <p>
              The Academy may explain, guide, and challenge. It may never fabricate
              evidence, invent authority, erase uncertainty, or silently select a
              favorable determination.
            </p>
          </section>

          <section className="academySection" id="architecture">
            <div className="academySectionIntro">
              <div>
                <p className="academyEyebrow">Architecture orientation</p>
                <h2>See the complete governing movement before entering the tools.</h2>
              </div>
              <p>
                These eight visible anchors provide the public orientation. They
                remain distinct from TA-14&apos;s verified complete 24-link runtime architecture.
              </p>
            </div>
            <div className="academyAnchorGrid">
              {anchors.map((anchor) => (
                <article className="academyAnchorCard" key={anchor.number}>
                  <span>{anchor.number}</span>
                  <h3>{anchor.title}</h3>
                  <p>{anchor.description}</p>
                </article>
              ))}
            </div>
            <div className="academyArchitectureStatement">
              <span className="academyPulse" aria-hidden="true" />
              <p>
                Zero Trust asks whether an actor and request should be trusted.
                Admissible execution asks whether this specific action has earned
                the right to bind to reality now.
              </p>
            </div>
          </section>

          <section className="academySection" id="pathways">
            <div className="academySectionIntro">
              <div>
                <p className="academyEyebrow">Choose your path</p>
                <h2>A clear next step for every person who enters.</h2>
              </div>
              <p>
                Nobody should arrive at a complex governance tool and be left
                wondering what to do. The Academy begins with understanding, then
                moves toward construction, challenge, and proof.
              </p>
            </div>
            <div className="academyPathwayGrid">
              {pathways.map((pathway) => (
                <article className="academyPathwayCard" key={pathway.number}>
                  <div className="academyPathwayTop">
                    <span>{pathway.number}</span>
                    <small>{pathway.status}</small>
                  </div>
                  <p className="academyPathwayEyebrow">{pathway.eyebrow}</p>
                  <h3>{pathway.title}</h3>
                  <p>{pathway.description}</p>
                  <Link href={pathway.href}>
                    <span>{pathway.action}</span>
                    <b aria-hidden="true">↗</b>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="academySection">
            <div className="academyGuided">
              <article className="academyGuidedCopy">
                <p className="academyEyebrow">A guided experience without governance shortcuts</p>
                <h2>Complex architecture. Calm conversation. One bounded question at a time.</h2>
                <p>
                  The Academy guides learners through purpose, actors, consequence,
                  boundary, reality, records, evidence, authority, continuity,
                  admissibility, determination, and preservation without pretending
                  that a missing answer has been supplied.
                </p>
                <div className="academySequence">
                  {learningSequence.map((item) => (
                    <div className="academySequenceItem" key={item.step}>
                      <span>{item.step}</span>
                      <strong>{item.title}</strong>
                    </div>
                  ))}
                </div>
              </article>
              <aside className="academyQuestionPanel">
                <small>Step 1 of 12</small>
                <h3>What action are you trying to govern?</h3>
                <p>Describe the exact action that could produce a consequence in the world.</p>
                <div className="academyPromptBox">
                  State the proposed action, who or what would perform it, and the
                  consequence that could bind to reality.
                </div>
                <div className="academyGuidanceList">
                  <span>Plain-language guidance</span>
                  <span>Examples without answer selection</span>
                  <span>“I do not know” remains unresolved</span>
                </div>
              </aside>
            </div>
          </section>

          <section className="academySection" id="capabilities">
            <div className="academySectionIntro">
              <div>
                <p className="academyEyebrow">Institutional capabilities</p>
                <h2>One Academy, connected to the systems that already govern the Exchange.</h2>
              </div>
              <p>
                The Academy teaches and proves capability. It does not duplicate
                authoritative records, invent a second registry, or disconnect
                education from governed execution.
              </p>
            </div>
            <div className="academyCapabilityGrid">
              {capabilities.map((capability, index) => (
                <article className="academyCapabilityCard" key={capability.title}>
                  <span className="academyCapabilityNumber">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="academySection">
            <div className="academySectionIntro">
              <div>
                <p className="academyEyebrow">Operating discipline</p>
                <h2>The Academy teaches the order that prevents consequence from outrunning proof.</h2>
              </div>
              <p>
                Every learning route preserves uncertainty, authority limits,
                version history, and the distinction between support and permission.
              </p>
            </div>
            <div className="academyOperatingGrid">
              {operatingPrinciples.map((principle, index) => (
                <div className="academyOperatingItem" key={principle}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{principle}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="academySection">
            <div className="academySectionIntro">
              <div>
                <p className="academyEyebrow">Institutional workspaces</p>
                <h2>Learning, instruction, credentialing, and accreditation remain connected.</h2>
              </div>
              <p>
                The seventh door serves learners, instructors, reviewers, program
                leaders, credential authorities, and accrediting institutions through
                bounded workspaces with explicit roles.
              </p>
            </div>
            <div className="academyInstitutional">
              <article className="academyInstitutionalCard">
                <h3>Learner journey</h3>
                <p>
                  Move from orientation to construction, simulation, review,
                  assessment, and credential progression without losing continuity.
                </p>
                <div className="academyInstitutionalLinks">
                  <Link href="/academy/start">Start Here <span>→</span></Link>
                  <Link href="/academy/routes">Learning Routes <span>→</span></Link>
                  <Link href="/academy/simulator">Simulation Center <span>→</span></Link>
                  <Link href="/academy/assessment">Assessment Center <span>→</span></Link>
                  <Link href="/academy/student-profile">Student Profile <span>→</span></Link>
                  <Link href="/academy/credential-dashboard">Credentials <span>→</span></Link>
                </div>
              </article>
              <article className="academyInstitutionalCard">
                <h3>Institutional governance</h3>
                <p>
                  Govern instruction, lesson development, program approval,
                  accreditation, certification, enterprise participation, and registry events.
                </p>
                <div className="academyInstitutionalLinks">
                  <Link href="/academy/instructor-console">Instructor Console <span>→</span></Link>
                  <Link href="/academy/lesson-builder">Lesson Builder <span>→</span></Link>
                  <Link href="/academy/instructor-management-center">Instructor Management <span>→</span></Link>
                  <Link href="/academy/accreditation-center">Accreditation Center <span>→</span></Link>
                  <Link href="/academy/certification-engine">Certification Engine <span>→</span></Link>
                  <Link href="/academy/enterprise-management">Enterprise Management <span>→</span></Link>
                </div>
              </article>
            </div>
          </section>

          <section className="academySection">
            <div className="academyFinalCta">
              <p className="academyEyebrow">Enter the seventh door</p>
              <h2>Governance becomes useful when people can understand it, practice it, and prove it.</h2>
              <p>
                Begin with the first lesson, inspect the architecture, construct a
                bounded route, test the conditions, preserve the evidence, and prove
                competency before consequence is allowed to proceed.
              </p>
              <div className="academyFinalActions">
                <Link className="academyButtonPrimary" href="/academy/start">
                  Begin with the first lesson →
                </Link>
                <Link className="academyButtonSecondary" href="/academy/dashboard">
                  Open Mission Control
                </Link>
                <Link className="academyButtonSecondary" href="/">
                  Return to the Exchange
                </Link>
              </div>
            </div>
          </section>

          <footer className="academyFooter">
            <div>
              <strong>TA-14 ACADEMY</strong>
              <p>Seventh major door of the TA-14 AI Governance Exchange</p>
              <p>No admissible evidence. No admissible execution.</p>
            </div>
            <div className="academyFooterStats" aria-label="Exchange public activity">
              <span>Public activity recorded</span>
              <span>Governed learning connected</span>
            </div>
          </footer>
        </div>
      </div>

      <nav className="academyMobileBar" aria-label="Mobile Academy navigation">
        <Link href="/academy"><b>AC</b><span>Home</span></Link>
        <Link href="/academy/start"><b>01</b><span>Start</span></Link>
        <Link href="/academy/dashboard"><b>MC</b><span>Mission</span></Link>
        <Link href="/academy/simulator"><b>SIM</b><span>Simulate</span></Link>
        <Link href="/academy/assessment"><b>AS</b><span>Assess</span></Link>
      </nav>
    </main>
  );
}
