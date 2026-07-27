"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

const sources = [
  {
    code: "EU",
    name: "EU AI Act",
    expanded: "European Union Artificial Intelligence Act",
    type: "Regulation",
    description:
      "Legal duties tied to actor roles, system classes, prohibited uses, transparency, risk, documentation, oversight, and enforcement.",
    href: "/workspace/ai-governance/eu-ai-act",
    accent: "#63e6ff",
  },
  {
    code: "NIST",
    name: "NIST AI RMF",
    expanded:
      "National Institute of Standards and Technology Artificial Intelligence Risk Management Framework",
    type: "Framework",
    description:
      "A structured framework for governing AI risk through the Govern, Map, Measure, and Manage functions.",
    href: "/governance-library/dictionary?term=NIST%20AI%20RMF",
    accent: "#8eb6ff",
  },
  {
    code: "42001",
    name: "ISO/IEC 42001",
    expanded: "Artificial intelligence management system standard",
    type: "Standard",
    description:
      "Management-system requirements for organizations developing, providing, or using artificial intelligence.",
    href: "/governance-library/dictionary?term=ISO%2FIEC%2042001",
    accent: "#72e6b2",
  },
  {
    code: "23894",
    name: "ISO/IEC 23894",
    expanded: "Artificial intelligence risk management guidance",
    type: "Standard",
    description:
      "Guidance for identifying, analyzing, evaluating, treating, and monitoring artificial-intelligence risks.",
    href: "/governance-library/dictionary?term=ISO%2FIEC%2023894",
    accent: "#b7ef68",
  },
  {
    code: "38507",
    name: "ISO/IEC 38507",
    expanded:
      "Governance implications of the use of artificial intelligence by organizations",
    type: "Standard",
    description:
      "Governing-body responsibilities and organizational oversight implications associated with AI use.",
    href: "/governance-library/dictionary?term=ISO%2FIEC%2038507",
    accent: "#ffc65c",
  },
  {
    code: "OECD",
    name: "OECD AI Principles",
    expanded: "Organisation for Economic Co-operation and Development AI Principles",
    type: "Principles",
    description:
      "Widely referenced principles concerning trustworthy artificial intelligence and public policy.",
    href: "/governance-library/dictionary?term=OECD%20AI%20Principles",
    accent: "#c68cff",
  },
  {
    code: "UN",
    name: "UNESCO Recommendation",
    expanded:
      "United Nations Educational, Scientific and Cultural Organization Recommendation on the Ethics of Artificial Intelligence",
    type: "Recommendation",
    description:
      "An international ethics- and rights-oriented recommendation addressing artificial intelligence.",
    href: "/governance-library/dictionary?term=UNESCO%20AI%20Recommendation",
    accent: "#ff8db5",
  },
  {
    code: "AIV",
    name: "AI Verify",
    expanded: "Singapore AI governance testing framework and toolkit",
    type: "Testing framework",
    description:
      "Structured testing and documentation of governance principles and technical practices.",
    href: "/governance-library/dictionary?term=AI%20Verify",
    accent: "#ff826f",
  },
];

const categories = [
  ["Laws & Regulations", "Binding legal instruments, duties, prohibitions, enforcement structures, and jurisdiction-specific obligations.", "/governance-library?category=law"],
  ["Standards", "Technical, management-system, risk, governance, and assurance standards.", "/governance-library?category=standard"],
  ["Frameworks", "Structured systems for risk, trustworthiness, accountability, and organizational governance.", "/governance-library?category=framework"],
  ["Principles & Recommendations", "Ethical, rights-based, public-interest, and policy guidance.", "/governance-library?category=principles"],
  ["Testing & Assurance", "Impact assessments, red teaming, conformity review, assurance cases, and validation.", "/governance-library?category=testing"],
  ["Sector Overlays", "Healthcare, finance, buildings, public services, infrastructure, insurance, and other domains.", "/governance-library?category=sector-governance"],
];

export default function GovernanceLibraryPage() {
  return (
    <main className="libraryPage">
      <section className="shell">
        <div className="topbar">
          <Link href="/" className="button quiet">← Return to Exchange</Link>
          <Link href="/workspace/ai-governance" className="button primary">
            Enter AI Governance →
          </Link>
        </div>

        <header className="hero">
          <div className="seal">GL</div>
          <p className="eyebrow">TA-14 AI GOVERNANCE LIBRARY</p>
          <h1>Decode the landscape before governing within it.</h1>
          <p className="lead">
            Explore laws, regulations, standards, frameworks, principles,
            recommendations, testing systems, and sector overlays. Every source
            remains connected to its issuer, class, authority, version,
            applicability, evidence expectations, and TA-14 execution pathway.
          </p>
          <div className="journey">
            {["Learn", "Determine", "Map", "Build", "Test", "Review", "Verify", "Export"].map(
              (item, index, all) => (
                <span key={item}>
                  <strong>{item}</strong>
                  {index < all.length - 1 ? <i>→</i> : null}
                </span>
              ),
            )}
          </div>
        </header>

        <section className="categorySection">
          <div className="heading">
            <div>
              <p className="eyebrow">EXPLORE BY SOURCE TYPE</p>
              <h2>Know what kind of authority you are looking at.</h2>
            </div>
            <p>
              A regulation is not a standard. A standard is not a framework. A
              framework is not a certification. The Library keeps each source
              type and boundary visible.
            </p>
          </div>

          <div className="categoryGrid">
            {categories.map(([title, description, href], index) => (
              <Link className="categoryCard" href={href} key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <strong>Explore category →</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className="sourceSection">
          <div className="heading">
            <div>
              <p className="eyebrow">INITIAL GOVERNANCE MODULES</p>
              <h2>The sources organizations encounter most often.</h2>
            </div>
            <p>
              Acronyms are expanded at the point of use and connected to a
              source-authority record rather than presented as unexplained
              abbreviations.
            </p>
          </div>

          <div className="sourceGrid">
            {sources.map((source, index) => (
              <Link
                href={source.href}
                key={source.name}
                className="sourceCard"
                style={{ "--accent": source.accent } as CSSProperties}
              >
                <div className="sourceTop">
                  <span className="sourceCode">{source.code}</span>
                  <span className="number">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <p className="sourceType">{source.type}</p>
                <h3>{source.name}</h3>
                <p className="expanded">{source.expanded}</p>
                <p className="description">{source.description}</p>
                <strong>Open library entry →</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className="boundary">
          <p className="eyebrow gold">SOURCE AND INTERPRETATION BOUNDARY</p>
          <h2>The Library explains governance. It does not fabricate authority.</h2>
          <p>
            Every entry should preserve the issuing body, official source,
            version, dates, legal or normative force, interpretation status,
            relationships, unresolved questions, and review history. Summaries
            and TA-14 implementation routes do not replace original source
            materials, legal advice, accreditation, conformity assessment, or
            independent certification.
          </p>
          <div className="actions">
            <Link href="/governance-library/dictionary" className="button primary">
              Open Acronym Dictionary →
            </Link>
            <Link href="/governance-library/applicability" className="button goldButton">
              Find What Applies →
            </Link>
          </div>
        </section>
      </section>

      <style jsx>{`
        .libraryPage{min-height:100vh;color:#f7fbff}.shell{width:min(1480px,calc(100% - 40px));margin:auto;padding:24px 0 80px}
        .topbar{display:flex;justify-content:space-between;gap:14px;padding:12px;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:rgba(4,17,29,.74);backdrop-filter:blur(16px)}
        .button{min-height:46px;padding:0 17px;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;text-decoration:none;font-size:11px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}
        .quiet{color:#c4d5de;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.18)}.primary{color:#041a23;border:1px solid #aaf2ff;background:linear-gradient(135deg,#d9fbff,#76deef 64%,#38aeca)}
        .goldButton{color:#241704;border:1px solid #ffe09a;background:linear-gradient(135deg,#fff0bd,#eeb84b)}
        .hero{max-width:1120px;margin:auto;padding:82px 0 68px;text-align:center}.seal{width:112px;height:112px;margin:0 auto 26px;display:grid;place-items:center;border:1px solid rgba(255,199,82,.4);border-radius:50%;color:#ffe5a0;background:radial-gradient(circle,rgba(255,193,64,.14),rgba(4,18,30,.86) 66%);font:900 34px Georgia,serif}
        .eyebrow{margin:0;color:#6fe8ff;font-size:10px;font-weight:950;letter-spacing:.22em;text-transform:uppercase}.eyebrow.gold{color:#efbd59}
        h1,h2,h3{font-family:Georgia,"Times New Roman",serif}.hero h1{max-width:1050px;margin:14px auto 0;font-size:clamp(52px,6.5vw,94px);line-height:.96;letter-spacing:-.052em}.lead{max-width:900px;margin:26px auto 0;color:#b3c6cf;font-size:18px;line-height:1.72}
        .journey{margin:35px auto 0;display:flex;flex-wrap:wrap;justify-content:center;gap:10px}.journey span{display:flex;align-items:center;gap:10px}.journey strong{padding:9px 13px;border:1px solid rgba(99,230,255,.16);border-radius:999px;background:rgba(99,230,255,.055);font-size:10px;letter-spacing:.08em;text-transform:uppercase}.journey i{color:#e5b956;font-style:normal}
        .categorySection,.sourceSection{padding:38px 0}.heading{display:grid;grid-template-columns:1.2fr .8fr;align-items:end;gap:40px;margin-bottom:32px}.heading h2,.boundary h2{margin:12px 0 0;font-size:clamp(38px,4.5vw,66px);line-height:1;letter-spacing:-.045em}.heading>p{margin:0;color:#9fb2bc;font-size:15px;line-height:1.7}
        .categoryGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:17px}.categoryCard{min-height:250px;padding:24px;display:flex;flex-direction:column;border:1px solid rgba(99,230,255,.14);border-radius:24px;color:inherit;text-decoration:none;background:linear-gradient(145deg,rgba(10,31,47,.93),rgba(4,14,24,.97));box-shadow:0 22px 50px rgba(0,0,0,.26);transition:.25s}.categoryCard:hover{transform:translateY(-6px);border-color:rgba(99,230,255,.5)}.categoryCard>span{color:#72dff2;font-size:10px;font-weight:900}.categoryCard h3{margin:25px 0 0;font-size:28px;line-height:1.05}.categoryCard p{flex:1;color:#9db1bb;font-size:14px;line-height:1.65}.categoryCard strong{color:#8fefff;font-size:12px}
        .sourceGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:17px}.sourceCard{--accent:#63e6ff;min-height:370px;padding:23px;display:flex;flex-direction:column;border:1px solid color-mix(in srgb,var(--accent) 30%,rgba(255,255,255,.06));border-radius:25px;color:inherit;text-decoration:none;background:linear-gradient(145deg,rgba(10,29,46,.95),rgba(4,13,23,.98));box-shadow:0 22px 54px rgba(0,0,0,.3);transition:.26s}.sourceCard:hover{transform:translateY(-7px);border-color:var(--accent);box-shadow:0 28px 64px rgba(0,0,0,.38),0 0 28px color-mix(in srgb,var(--accent) 24%,transparent)}
        .sourceTop{display:flex;justify-content:space-between}.sourceCode{min-width:66px;height:66px;padding:0 10px;display:grid;place-items:center;border:1px solid var(--accent);border-radius:18px;color:var(--accent);background:rgba(0,0,0,.22);font-size:16px;font-weight:950}.number{color:#6d8390;font-size:9px;font-weight:900}.sourceType{margin:25px 0 0;color:var(--accent);font-size:10px;font-weight:900;letter-spacing:.17em;text-transform:uppercase}.sourceCard h3{margin:10px 0 0;font-size:29px}.expanded{margin:10px 0 0;color:#d2dde2;font-size:13px;line-height:1.5}.description{flex:1;color:#94aab5;font-size:14px;line-height:1.65}.sourceCard strong{color:var(--accent);font-size:12px}
        .boundary{margin-top:75px;padding:50px 34px;border:1px solid rgba(255,197,82,.22);border-radius:30px;background:radial-gradient(circle at 50% 0%,rgba(255,185,44,.1),transparent 42%),linear-gradient(180deg,rgba(8,20,33,.96),rgba(3,10,18,.98));text-align:center}.boundary h2{max-width:1000px;margin:14px auto 0}.boundary>p:not(.eyebrow){max-width:980px;margin:24px auto 0;color:#a4b4bc;font-size:15px;line-height:1.75}.actions{margin-top:28px;display:flex;flex-wrap:wrap;justify-content:center;gap:12px}
        @media(max-width:1180px){.sourceGrid{grid-template-columns:repeat(2,1fr)}}@media(max-width:900px){.categoryGrid{grid-template-columns:repeat(2,1fr)}.heading{grid-template-columns:1fr;gap:16px}}@media(max-width:650px){.shell{width:calc(100% - 22px)}.topbar{flex-direction:column}.button{width:100%}.hero{padding:58px 0}.categoryGrid,.sourceGrid{grid-template-columns:1fr}.boundary{padding:40px 20px}}
      `}</style>
    </main>
  );
}
