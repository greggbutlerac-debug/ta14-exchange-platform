"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { governanceLibraryRecords } from "../../../../lib/governance-library";
import type { GovernanceLibraryRecord } from "../../../../lib/governance-library/records-foundational";

type JurisdictionProfile = {
  name: string;
  code: string;
  designation: string;
  summary: string;
  authorityBoundary: string;
  sourceFamilies: string[];
  applicability: string[];
  evidence: string[];
  routeQuestions: string[];
};

const profiles: Record<string, JurisdictionProfile> = {
  "united-states": {
    name: "United States",
    code: "US",
    designation: "Federal, state, local, sector, procurement, and enforcement landscape",
    summary:
      "Review United States AI governance without converting a distributed legal landscape into a single national rule. Preserve the issuing authority, jurisdiction, sector, regulated activity, effective date, enforcement basis, and relationship between federal, state, local, and voluntary sources.",
    authorityBoundary:
      "A federal framework, agency action, state statute, municipal rule, procurement condition, sector obligation, and voluntary standard do not carry the same legal force. Each source must remain attached to the authority that issued it and the activity it can actually govern.",
    sourceFamilies: [
      "Federal statutes and agency regulations",
      "Executive and administrative instruments",
      "State statutes, regulations, and enforcement actions",
      "Municipal and local automated-decision requirements",
      "Civil-rights, employment, consumer-protection, and sector law",
      "Government procurement and contractual controls",
      "Standards, frameworks, and voluntary guidance",
      "Court decisions, regulator interpretations, and official notices",
    ],
    applicability: [
      "Federal, state, local, tribal, or multi-jurisdiction activity",
      "Developer, provider, deployer, operator, purchaser, or affected party",
      "Public-sector, employment, credit, housing, health, education, or consumer use",
      "Automated decision, consequential decision, generative output, or supporting tool",
      "Existing sector law, civil-rights duty, procurement term, or AI-specific rule",
      "Effective date, transition period, exemption, threshold, and enforcement authority",
    ],
    evidence: [
      "System purpose, role assignment, and jurisdictional nexus",
      "Impact, risk, testing, validation, and monitoring records",
      "Notices, explanations, appeal pathways, and human-review records",
      "Data provenance, evaluation boundaries, and material-change history",
      "Procurement terms, vendor representations, and allocation of responsibility",
      "Incident, complaint, correction, enforcement, and outcome records",
    ],
    routeQuestions: [
      "Which authority can bind this actor and this activity?",
      "Is the source enacted law, enforceable regulation, official guidance, or voluntary practice?",
      "Does an existing sector or civil-rights obligation govern before an AI-specific rule is considered?",
      "Which state or local requirements attach to the system's use or affected population?",
      "What evidence supports each bounded duty without overstating national applicability?",
      "What unresolved issue requires counsel, regulator guidance, or further factual development?",
    ],
  },
  canada: {
    name: "Canada",
    code: "CA",
    designation: "Federal, provincial, privacy, automated-decision, and sector governance",
    summary:
      "Review Canadian AI governance through the correct federal, provincial, territorial, public-sector, private-sector, privacy, human-rights, consumer, and sector authority. Preserve the status of proposed instruments separately from enacted and enforceable obligations.",
    authorityBoundary:
      "Canadian governance may arise from federal law, provincial or territorial law, public-sector directives, privacy requirements, human-rights duties, sector regulation, procurement conditions, or voluntary standards. Proposed legislation must never be represented as enacted law.",
    sourceFamilies: [
      "Federal statutes, regulations, and parliamentary instruments",
      "Provincial and territorial statutes and regulations",
      "Public-sector automated-decision directives and policy",
      "Federal and provincial privacy requirements",
      "Human-rights, employment, consumer, and sector obligations",
      "Regulator findings, guidance, and official interpretations",
      "Government procurement and contractual controls",
      "National and international standards used in Canadian practice",
    ],
    applicability: [
      "Federal, provincial, territorial, municipal, or cross-border activity",
      "Public institution, private organization, service provider, or regulated professional",
      "Personal information, automated decision, high-impact use, or public service delivery",
      "Commercial, employment, health, finance, education, or government context",
      "Enacted requirement, directive, policy, proposed bill, or voluntary framework",
      "Consent, notice, explanation, assessment, retention, access, and correction conditions",
    ],
    evidence: [
      "Organizational role, lawful authority, and jurisdictional basis",
      "Privacy, impact, algorithmic, and risk-assessment records",
      "Data collection, use, disclosure, retention, and access records",
      "System testing, validation, monitoring, and human-oversight evidence",
      "Public notice, explanation, recourse, and correction mechanisms",
      "Version, change, incident, complaint, and outcome histories",
    ],
    routeQuestions: [
      "Which federal, provincial, or territorial authority applies?",
      "Is the actor a public body, private organization, contractor, or regulated entity?",
      "Is the cited instrument enacted, in force, proposed, advisory, or contractual?",
      "What privacy, human-rights, consumer, or sector duty already governs the use?",
      "What assessment and explanation evidence is required for the bounded activity?",
      "What remains unresolved because the legal instrument or facts are still developing?",
    ],
  },
  "united-kingdom": {
    name: "United Kingdom",
    code: "UK",
    designation: "Regulator-led, sector-based, rights, safety, and assurance landscape",
    summary:
      "Review United Kingdom AI governance through the regulator, statute, sector, public-law duty, data-protection obligation, safety expectation, procurement condition, and assurance mechanism that actually governs the activity. Keep principles and guidance distinct from enforceable duties.",
    authorityBoundary:
      "A cross-sector principle does not automatically carry the same force as legislation, regulator rules, a statutory code, an enforcement notice, or a contractual requirement. The legal basis and responsible regulator must remain visible throughout the route.",
    sourceFamilies: [
      "Primary and secondary legislation",
      "Data-protection and information-rights requirements",
      "Sector-regulator rules, guidance, and enforcement",
      "Equality, employment, consumer, competition, and public-law duties",
      "Product safety, cybersecurity, and online-safety requirements",
      "Central and local government procurement controls",
      "Assurance, testing, audit, and technical standards",
      "Government policy, consultations, and regulator coordination",
    ],
    applicability: [
      "United Kingdom nation, regulator, sector, market, and affected person",
      "Developer, supplier, deployer, employer, public authority, or regulated firm",
      "Personal-data processing, automated decision, safety function, or public service",
      "Binding statute, regulator rule, statutory guidance, policy, or voluntary assurance",
      "Territorial reach, market placement, establishment, targeting, and cross-border activity",
      "Authorization, notice, fairness, accountability, contestability, and oversight conditions",
    ],
    evidence: [
      "Purpose, role, regulator, sector, and lawful-basis records",
      "Data-protection, equality, safety, and impact assessments",
      "Testing, validation, assurance, monitoring, and audit evidence",
      "Human authority, review, escalation, and contestability records",
      "Supplier claims, procurement conditions, and allocation of responsibility",
      "Incident, complaint, regulator-contact, correction, and outcome histories",
    ],
    routeQuestions: [
      "Which regulator or statutory authority governs the activity?",
      "Is the source legally binding, regulator guidance, policy, assurance practice, or consultation material?",
      "Which existing data, equality, safety, employment, consumer, or sector duty applies?",
      "What territorial and market connection brings the system within scope?",
      "What evidence supports accountability, fairness, safety, and meaningful human authority?",
      "What issue remains unsettled and requires legal or regulator review?",
    ],
  },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function JurisdictionPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const profile = profiles[slug];

  const records: GovernanceLibraryRecord[] = governanceLibraryRecords
    .filter((record) => slugify(record.jurisdiction) === slug)
    .sort((a, b) => a.title.localeCompare(b.title));

  const name = profile?.name ?? records[0]?.jurisdiction ?? titleFromSlug(slug);
  const recordTypes = Array.from(new Set(records.map((record) => record.recordType)));
  const publishers = Array.from(new Set(records.map((record) => record.publisher)));

  const fallbackProfile: JurisdictionProfile = {
    name,
    code: "JX",
    designation: "Governance jurisdiction record set",
    summary:
      "Review the governance sources associated with this jurisdiction while preserving source authority, legal force, regulated role, applicability, version, evidence expectations, and unresolved questions.",
    authorityBoundary:
      "Every source must remain attached to its issuing authority, legal status, scope, effective date, and applicability conditions. A library record supports research and route construction; it does not independently establish legal advice or compliance.",
    sourceFamilies: recordTypes.length > 0 ? recordTypes : ["Governance records under development"],
    applicability: [
      "Jurisdiction and issuing authority",
      "Regulated actor and organizational role",
      "System, activity, sector, and affected party",
      "Legal force, effective date, and version",
      "Evidence required for a bounded determination",
      "Unresolved questions requiring further review",
    ],
    evidence: [
      "Official source and publication record",
      "Applicability and role determination",
      "System and activity scope",
      "Authority and responsibility records",
      "Testing, monitoring, and outcome evidence",
      "Review, challenge, correction, and version history",
    ],
    routeQuestions: [
      "What authority issued the source?",
      "What legal force does it carry?",
      "Who and what fall within scope?",
      "When does the obligation apply?",
      "What evidence supports the determination?",
      "What remains unresolved?",
    ],
  };

  const activeProfile = profile ?? fallbackProfile;

  return (
    <main className="jurisdictionPage">
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="orb orbOne" />
      <div className="orb orbTwo" />

      <header className="topbar shell">
        <Link href="/governance-library/jurisdiction" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>{activeProfile.name}</strong>
            <small>AI Governance Jurisdiction</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/workspace/ai-governance/library">Library</Link>
          <Link href="/workspace/ai-governance/library/laws">Laws</Link>
          <Link href="/governance-library/jurisdiction">Global Map</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">JURISDICTION MODULE · {activeProfile.code}</p>
          <h1>
            {activeProfile.name}
            <span> AI Governance</span>
          </h1>
          <p className="designation">{activeProfile.designation}</p>
          <p className="lead">{activeProfile.summary}</p>

          <div className="heroActions">
            <a className="primaryButton" href="#records">
              Review records <span>→</span>
            </a>
            <Link className="secondaryButton" href="/workspace/ai-governance/library/laws">
              Return to Laws &amp; Regulations
            </Link>
          </div>
        </div>

        <div className="authorityVisual" aria-hidden="true">
          <div className="ring ringOne" />
          <div className="ring ringTwo" />
          <div className="ring ringThree" />
          <div className="authorityCore">
            <strong>{activeProfile.code}</strong>
            <small>Authority map</small>
          </div>
          <span className="orbitLabel labelOne">SOURCE</span>
          <span className="orbitLabel labelTwo">SCOPE</span>
          <span className="orbitLabel labelThree">FORCE</span>
          <span className="orbitLabel labelFour">EVIDENCE</span>
        </div>
      </section>

      <section className="metrics shell">
        <article><strong>{records.length}</strong><span>Library records</span></article>
        <article><strong>{recordTypes.length}</strong><span>Source types</span></article>
        <article><strong>{publishers.length}</strong><span>Issuing bodies</span></article>
        <article><strong>6</strong><span>Applicability gates</span></article>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">AUTHORITY BOUNDARY</p>
          <h2>Preserve legal force before mapping governance.</h2>
        </div>
        <p>{activeProfile.authorityBoundary}</p>
      </section>

      <section className="twoColumn shell">
        <div className="sectionCopy">
          <p className="eyebrow">SOURCE FAMILIES</p>
          <h2>Enter through the authority that can govern the activity.</h2>
          <p>
            This module separates source families so a route can identify what is binding,
            what is conditional, what is interpretive, and what remains voluntary.
          </p>
        </div>
        <div className="indexedList">
          {activeProfile.sourceFamilies.map((item, index) => (
            <div key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="applicability shell">
        <div className="sectionIntro">
          <p className="eyebrow">APPLICABILITY CONTROL</p>
          <h2>A jurisdiction name alone never establishes applicability.</h2>
          <p>
            A bounded legal route must identify the actor, activity, system, sector,
            geography, timing, authority, and triggering condition before any compliance
            conclusion is allowed to move toward execution.
          </p>
        </div>
        <div className="controlGrid">
          {activeProfile.applicability.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="evidence shell">
        <div className="evidenceHeader">
          <div>
            <p className="eyebrow">EVIDENCE EXPECTATIONS</p>
            <h2>Translate duties into inspectable records.</h2>
          </div>
          <p>
            Evidence must support the exact claim, role, system, version, period, and
            jurisdiction under review. A policy statement alone does not prove execution.
          </p>
        </div>
        <div className="evidenceGrid">
          {activeProfile.evidence.map((item, index) => (
            <article key={item}>
              <div className="evidenceIcon">{String(index + 1).padStart(2, "0")}</div>
              <h3>{item}</h3>
              <p>Preserve source, owner, date, scope, continuity, and review status.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="records shell" id="records">
        <div className="recordsHeader">
          <div>
            <p className="eyebrow">GOVERNANCE LIBRARY RECORDS</p>
            <h2>Available sources for {activeProfile.name}.</h2>
          </div>
          <Link href="/governance-library/all" className="textLink">Browse full library →</Link>
        </div>

        {records.length > 0 ? (
          <div className="recordGrid">
            {records.map((record) => (
              <Link key={record.slug} href={`/governance-library/${record.slug}`} className="recordCard">
                <div className="recordTop">
                  <span>{record.recordType}</span>
                  <small>{record.status}</small>
                </div>
                <h3>{record.title}</h3>
                <p>{record.summary}</p>
                <div className="recordMeta">
                  <span>{record.publisher}</span>
                  <strong>Open record →</strong>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="emptyState">
            <div className="emptySeal">{activeProfile.code}</div>
            <div>
              <p className="eyebrow">RECORD DEVELOPMENT</p>
              <h3>The jurisdiction architecture is active.</h3>
              <p>
                Source records are being added through the Governance Library. The module
                remains usable now for applicability analysis, evidence planning, and route
                construction without presenting unfinished research as legal authority.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="routeQuestions shell">
        <div className="sectionCopy">
          <p className="eyebrow">ROUTE QUESTIONS</p>
          <h2>Questions that must be resolved before execution.</h2>
        </div>
        <div className="questionStack">
          {activeProfile.routeQuestions.map((question, index) => (
            <div key={question}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{question}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="method shell">
        <div>
          <p className="eyebrow">TA-14 LEGAL IMPLEMENTATION METHOD</p>
          <h2>From official source to governed determination.</h2>
        </div>
        <div className="methodGrid">
          {[
            ["01", "Source", "Preserve the official instrument, issuing authority, version, date, language, and publication record."],
            ["02", "Applicability", "Determine jurisdiction, actor, role, system, sector, exclusions, thresholds, and timing conditions."],
            ["03", "Requirement", "Separate each obligation, prohibition, exception, responsible actor, and triggering condition."],
            ["04", "Evidence", "Identify the records, authority, controls, continuity, and outcomes needed to support the requirement."],
            ["05", "Route", "Compile the bounded requirement into bindings, commitments, execution limits, and decision gates."],
            ["06", "Verification", "Preserve the determination so another reviewer can inspect, challenge, replay, and correct it."],
          ].map(([number, title, copy]) => (
            <article key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">BUILD THE GOVERNED ROUTE</p>
          <h2>Do not turn a legal summary into execution permission.</h2>
          <p>
            Preserve the official source, map applicability, attach bounded evidence,
            identify unresolved conditions, and route the result through an inspectable
            TA-14 determination.
          </p>
        </div>
        <Link className="primaryButton" href="/workspace/routes/new">
          Build a Route <span>→</span>
        </Link>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <div>
          <Link href="/workspace/ai-governance/library/laws">Laws &amp; Regulations</Link>
          <Link href="/governance-library/jurisdiction">All Jurisdictions</Link>
        </div>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; background: #040914; }
        :global(body) {
          margin: 0;
          background:
            radial-gradient(circle at 12% 8%, rgba(66,207,190,.13), transparent 28%),
            radial-gradient(circle at 88% 22%, rgba(56,104,180,.13), transparent 26%),
            linear-gradient(180deg,#040914 0%,#07101f 50%,#050914 100%);
          color: #f7fbff;
          font-family: Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        }
        .jurisdictionPage { min-height: 100vh; position: relative; overflow: hidden; isolation: isolate; }
        .shell { width: min(1260px,calc(100% - 36px)); margin-inline: auto; position: relative; z-index: 2; }
        .stars { position: fixed; inset: -12%; pointer-events: none; z-index: -4; opacity: .34; }
        .starsOne { background-image: radial-gradient(circle,rgba(255,255,255,.75) 0 1px,transparent 1.4px); background-size: 92px 92px; animation: starDrift 34s linear infinite; }
        .starsTwo { background-image: radial-gradient(circle,rgba(99,225,209,.62) 0 1px,transparent 1.4px); background-size: 156px 156px; background-position: 39px 58px; animation: starDrift 48s linear infinite reverse; }
        .orb { position: fixed; width: 470px; height: 470px; border-radius: 999px; filter: blur(120px); opacity: .12; z-index: -3; animation: orbMove 14s ease-in-out infinite alternate; }
        .orbOne { left: -170px; top: -180px; background: #56dec9; }
        .orbTwo { right: -180px; top: 44%; background: #625eff; animation-delay: -6s; }
        .topbar { min-height: 84px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid rgba(132,154,188,.16); }
        .brand { display: flex; align-items: center; gap: 12px; color: white; text-decoration: none; }
        .brandMark { min-width: 64px; height: 38px; border-radius: 999px; display: grid; place-items: center; color: #03110f; background: linear-gradient(135deg,#57d9c8,#b8fff7); font-size: 13px; font-weight: 900; letter-spacing: .05em; }
        .brand > span:last-child { display: flex; flex-direction: column; }
        .brand strong { font-size: 14px; }
        .brand small { margin-top: 2px; color: #8798b4; font-size: 11px; }
        nav { display: flex; align-items: center; gap: 22px; }
        nav a { color: #9eacc1; text-decoration: none; font-size: 13px; transition: color .2s ease; }
        nav a:hover { color: #76e4d5; }
        .hero { min-height: 650px; display: grid; grid-template-columns: 1.16fr .84fr; gap: 60px; align-items: center; padding-block: 92px 80px; }
        .eyebrow { margin: 0; color: #61d9c9; font-size: 12px; font-weight: 800; letter-spacing: .2em; }
        h1,h2,h3,p { margin-top: 0; }
        h1 { max-width: 820px; margin: 18px 0 18px; font-size: clamp(48px,7vw,88px); line-height: .98; letter-spacing: -.052em; }
        h1 span { display: block; color: #76e4d5; }
        .designation { margin-bottom: 20px; color: #d7e4f5; font-size: 17px; font-weight: 700; }
        .lead { max-width: 780px; color: #aab9cf; font-size: 18px; line-height: 1.8; }
        .heroActions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
        .primaryButton,.secondaryButton { min-height: 50px; display: inline-flex; align-items: center; justify-content: center; gap: 12px; padding: 0 20px; border-radius: 12px; text-decoration: none; font-size: 14px; font-weight: 800; }
        .primaryButton { color: #03110f; background: linear-gradient(135deg,#57d9c8,#b8fff7); box-shadow: 0 18px 50px rgba(64,211,194,.14); }
        .secondaryButton { color: #eaf6ff; border: 1px solid rgba(137,158,190,.25); background: rgba(255,255,255,.035); }
        .authorityVisual { width: min(470px,100%); aspect-ratio: 1; margin-inline: auto; position: relative; display: grid; place-items: center; }
        .ring { position: absolute; border: 1px solid rgba(104,224,209,.25); border-radius: 50%; }
        .ringOne { inset: 4%; animation: spin 28s linear infinite; }
        .ringTwo { inset: 18%; border-style: dashed; animation: spin 21s linear infinite reverse; }
        .ringThree { inset: 31%; border-color: rgba(125,151,255,.3); animation: pulse 4s ease-in-out infinite; }
        .authorityCore { width: 148px; height: 148px; border-radius: 50%; display: grid; place-content: center; text-align: center; background: radial-gradient(circle at 36% 30%,#aafff4,#49cdbc 48%,#083a38); box-shadow: 0 0 80px rgba(82,220,202,.28),inset 0 0 36px rgba(255,255,255,.22); color: #031413; }
        .authorityCore strong { font-size: 42px; line-height: 1; }
        .authorityCore small { margin-top: 8px; font-size: 10px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
        .orbitLabel { position: absolute; padding: 7px 10px; border: 1px solid rgba(133,158,194,.25); border-radius: 999px; background: rgba(6,15,29,.8); color: #9fc0d6; font-size: 9px; font-weight: 900; letter-spacing: .13em; }
        .labelOne { top: 8%; left: 37%; }.labelTwo { right: 2%; top: 48%; }.labelThree { bottom: 7%; left: 39%; }.labelFour { left: 0; top: 48%; }
        .metrics { display: grid; grid-template-columns: repeat(4,1fr); border: 1px solid rgba(129,153,188,.16); border-radius: 18px; background: rgba(7,17,32,.66); backdrop-filter: blur(16px); overflow: hidden; }
        .metrics article { min-height: 128px; padding: 28px; display: flex; flex-direction: column; justify-content: center; border-right: 1px solid rgba(129,153,188,.14); }
        .metrics article:last-child { border-right: 0; }
        .metrics strong { font-size: 38px; color: #79e4d6; }
        .metrics span { margin-top: 6px; color: #8fa0b9; font-size: 12px; }
        .boundary { margin-top: 84px; padding: 42px; display: grid; grid-template-columns: .9fr 1.1fr; gap: 54px; border: 1px solid rgba(90,220,203,.2); border-radius: 20px; background: linear-gradient(135deg,rgba(42,180,164,.09),rgba(23,35,62,.28)); }
        h2 { margin: 12px 0 0; font-size: clamp(30px,4vw,50px); line-height: 1.08; letter-spacing: -.035em; }
        .boundary > p,.sectionCopy > p:last-child,.sectionIntro > p:last-child,.evidenceHeader > p { margin: 0; color: #a8b7cb; line-height: 1.8; }
        .twoColumn,.routeQuestions { padding-block: 110px; display: grid; grid-template-columns: .8fr 1.2fr; gap: 72px; }
        .sectionCopy h2,.sectionIntro h2 { margin-bottom: 22px; }
        .indexedList,.questionStack { display: grid; gap: 10px; }
        .indexedList div,.questionStack div { min-height: 68px; display: grid; grid-template-columns: 52px 1fr; align-items: center; gap: 16px; padding: 14px 18px; border: 1px solid rgba(129,153,188,.15); border-radius: 13px; background: rgba(255,255,255,.028); }
        .indexedList span,.questionStack span { color: #61d9c9; font-size: 11px; font-weight: 900; letter-spacing: .12em; }
        .indexedList strong,.questionStack strong { color: #eaf2fb; font-size: 14px; line-height: 1.5; }
        .applicability { padding: 86px 0 96px; border-top: 1px solid rgba(129,153,188,.13); border-bottom: 1px solid rgba(129,153,188,.13); }
        .sectionIntro { max-width: 850px; }
        .controlGrid { margin-top: 42px; display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        .controlGrid article { min-height: 156px; padding: 24px; border: 1px solid rgba(129,153,188,.15); border-radius: 16px; background: linear-gradient(145deg,rgba(255,255,255,.04),rgba(255,255,255,.018)); }
        .controlGrid span { color: #61d9c9; font-size: 11px; font-weight: 900; letter-spacing: .16em; }
        .controlGrid p { margin: 28px 0 0; color: #dce7f4; line-height: 1.55; font-weight: 700; }
        .evidence { padding-block: 110px; }
        .evidenceHeader { display: grid; grid-template-columns: 1fr .8fr; gap: 64px; align-items: end; }
        .evidenceGrid { margin-top: 44px; display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .evidenceGrid article { min-height: 225px; padding: 26px; border: 1px solid rgba(116,150,193,.16); border-radius: 17px; background: rgba(7,16,31,.72); }
        .evidenceIcon { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 11px; background: rgba(85,219,202,.11); color: #73e2d4; font-size: 11px; font-weight: 900; }
        .evidenceGrid h3 { margin: 28px 0 12px; font-size: 17px; line-height: 1.4; }
        .evidenceGrid p { margin: 0; color: #8fa0b7; font-size: 13px; line-height: 1.7; }
        .records { padding-block: 96px; border-top: 1px solid rgba(129,153,188,.13); }
        .recordsHeader { display: flex; align-items: end; justify-content: space-between; gap: 24px; }
        .textLink { color: #77e2d4; text-decoration: none; font-weight: 800; }
        .recordGrid { margin-top: 42px; display: grid; grid-template-columns: repeat(2,1fr); gap: 18px; }
        .recordCard { min-height: 300px; padding: 28px; display: flex; flex-direction: column; border: 1px solid rgba(129,153,188,.16); border-radius: 18px; background: linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.018)); color: white; text-decoration: none; transition: transform .2s ease,border-color .2s ease; }
        .recordCard:hover { transform: translateY(-3px); border-color: rgba(88,222,205,.42); }
        .recordTop { display: flex; justify-content: space-between; gap: 18px; }
        .recordTop span { color: #61d9c9; font-size: 10px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
        .recordTop small { color: #8698b2; }
        .recordCard h3 { margin: 28px 0 14px; font-size: 21px; line-height: 1.35; }
        .recordCard > p { color: #a1b1c7; line-height: 1.7; }
        .recordMeta { margin-top: auto; padding-top: 24px; display: flex; align-items: center; justify-content: space-between; gap: 18px; border-top: 1px solid rgba(129,153,188,.12); color: #8192aa; font-size: 12px; }
        .recordMeta strong { color: #75e2d4; }
        .emptyState { margin-top: 42px; padding: 42px; display: grid; grid-template-columns: 110px 1fr; gap: 30px; align-items: center; border: 1px solid rgba(86,217,200,.22); border-radius: 18px; background: rgba(31,129,118,.07); }
        .emptySeal { width: 94px; height: 94px; display: grid; place-items: center; border-radius: 50%; background: rgba(87,218,201,.12); border: 1px solid rgba(87,218,201,.28); color: #7be6d8; font-size: 26px; font-weight: 900; }
        .emptyState h3 { margin: 10px 0 12px; font-size: 26px; }
        .emptyState p:last-child { margin: 0; color: #a5b4c8; line-height: 1.75; }
        .routeQuestions { border-top: 1px solid rgba(129,153,188,.13); }
        .method { padding: 84px 0 104px; }
        .methodGrid { margin-top: 40px; display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        .methodGrid article { min-height: 218px; padding: 26px; border-top: 2px solid rgba(92,221,204,.45); background: rgba(255,255,255,.025); }
        .methodGrid span { color: #61d9c9; font-size: 11px; font-weight: 900; letter-spacing: .16em; }
        .methodGrid h3 { margin: 28px 0 12px; font-size: 20px; }
        .methodGrid p { margin: 0; color: #94a5bb; font-size: 13px; line-height: 1.75; }
        .finalCta { margin-bottom: 96px; padding: 44px; display: flex; align-items: center; justify-content: space-between; gap: 46px; border: 1px solid rgba(85,219,202,.24); border-radius: 20px; background: linear-gradient(135deg,rgba(37,157,144,.13),rgba(37,58,102,.16)); }
        .finalCta h2 { max-width: 770px; }
        .finalCta p:last-child { max-width: 800px; margin: 18px 0 0; color: #9fb0c5; line-height: 1.75; }
        .finalCta .primaryButton { flex: 0 0 auto; }
        footer { min-height: 104px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-top: 1px solid rgba(129,153,188,.15); color: #7789a2; font-size: 12px; }
        footer div { display: flex; gap: 22px; }
        footer a { color: #99acc3; text-decoration: none; }
        @keyframes starDrift { to { transform: translate3d(92px,92px,0); } }
        @keyframes orbMove { to { transform: translate3d(70px,45px,0) scale(1.12); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 50% { transform: scale(1.04); opacity: .55; } }
        @media (max-width: 980px) {
          nav { display: none; }
          .hero { grid-template-columns: 1fr; min-height: auto; }
          .authorityVisual { width: min(410px,88vw); }
          .metrics { grid-template-columns: repeat(2,1fr); }
          .metrics article:nth-child(2) { border-right: 0; }
          .metrics article:nth-child(-n+2) { border-bottom: 1px solid rgba(129,153,188,.14); }
          .boundary,.twoColumn,.routeQuestions,.evidenceHeader { grid-template-columns: 1fr; gap: 36px; }
          .controlGrid,.evidenceGrid,.methodGrid { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 680px) {
          .shell { width: min(100% - 24px,1260px); }
          .topbar { min-height: 72px; }
          .hero { padding-block: 72px 58px; }
          h1 { font-size: 48px; }
          .authorityVisual { width: min(330px,88vw); }
          .metrics,.controlGrid,.evidenceGrid,.recordGrid,.methodGrid { grid-template-columns: 1fr; }
          .metrics article { border-right: 0; border-bottom: 1px solid rgba(129,153,188,.14); }
          .metrics article:last-child { border-bottom: 0; }
          .boundary,.finalCta { padding: 28px; }
          .twoColumn,.routeQuestions,.evidence,.records { padding-block: 76px; }
          .recordsHeader,.finalCta,footer { align-items: flex-start; flex-direction: column; }
          .emptyState { grid-template-columns: 1fr; }
          footer { padding-block: 28px; }
          footer div { flex-direction: column; gap: 10px; }
        }
      `}</style>
    </main>
  );
}
