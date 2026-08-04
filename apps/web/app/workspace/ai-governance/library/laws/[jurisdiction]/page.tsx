import Link from "next/link";
import { notFound } from "next/navigation";

type JurisdictionKey =
  | "united-states"
  | "canada"
  | "united-kingdom"
  | "global";

type JurisdictionModule = {
  name: string;
  code: string;
  eyebrow: string;
  headline: string;
  introduction: string;
  authorityStatement: string;
  lanes: Array<{ title: string; description: string }>;
  questions: string[];
  routeSteps: Array<{ title: string; description: string }>;
};

const modules: Record<JurisdictionKey, JurisdictionModule> = {
  "united-states": {
    name: "United States",
    code: "US",
    eyebrow: "FEDERAL, STATE & SECTOR GOVERNANCE",
    headline: "Map the authority before mapping the obligation.",
    introduction:
      "The United States module separates federal, state, sector, procurement, civil-rights, consumer-protection, privacy, safety, and agency-specific sources. It is designed to prevent a policy, framework, executive action, guidance document, or state rule from being presented as one universal national AI law.",
    authorityStatement:
      "A United States review must identify the governing body, geographic reach, regulated actor, sector, legal force, effective condition, enforcement pathway, and evidence needed for the specific route.",
    lanes: [
      {
        title: "Federal authority",
        description:
          "Organize statutes, agency rules, executive actions, procurement conditions, official guidance, and regulator interpretations by issuing authority and legal force.",
      },
      {
        title: "State authority",
        description:
          "Preserve state-by-state differences, effective dates, covered entities, protected activities, exemptions, enforcement mechanisms, and preemption questions.",
      },
      {
        title: "Sector obligations",
        description:
          "Separate requirements affecting employment, finance, healthcare, education, housing, insurance, critical infrastructure, public services, and other regulated domains.",
      },
      {
        title: "Rights and remedies",
        description:
          "Connect discrimination, privacy, consumer protection, due process, accessibility, notice, appeal, and recordkeeping duties to the affected route.",
      },
      {
        title: "Procurement and contracting",
        description:
          "Track public-sector acquisition conditions, vendor representations, contractual controls, audit rights, documentation duties, and continuing oversight.",
      },
      {
        title: "Evidence and enforcement",
        description:
          "Identify the records, testing, authority, monitoring, notices, decisions, and outcome evidence needed to support a bounded legal determination.",
      },
    ],
    questions: [
      "Which federal, state, local, tribal, or territorial authority governs the activity?",
      "Is the source binding law, regulation, contract, official guidance, policy, or voluntary practice?",
      "What actor, sector, system, decision, or affected person brings the route within scope?",
      "Which duties apply before deployment, at decision time, and after execution?",
      "What notice, review, appeal, testing, documentation, or monitoring evidence is required?",
      "What remains unresolved and must be referred for qualified legal review?",
    ],
    routeSteps: [
      { title: "Locate", description: "Identify every potentially governing federal, state, sector, and contractual source." },
      { title: "Classify", description: "Preserve legal force, issuing authority, scope, version, effective date, and enforcement status." },
      { title: "Apply", description: "Match the regulated actor, activity, system, decision, geography, sector, and affected party." },
      { title: "Evidence", description: "Define the records and controls that can support each bounded requirement." },
      { title: "Bind", description: "Compile supported duties into route conditions, holds, denials, escalations, and execution boundaries." },
      { title: "Preserve", description: "Retain the source basis, determination, reviewer, limitations, execution result, and outcome history." },
    ],
  },
  canada: {
    name: "Canada",
    code: "CA",
    eyebrow: "FEDERAL, PROVINCIAL & TERRITORIAL GOVERNANCE",
    headline: "Keep jurisdiction, public authority, and private obligation distinct.",
    introduction:
      "The Canada module organizes federal, provincial, territorial, privacy, public-sector automated-decision, consumer, human-rights, safety, procurement, and sector-specific sources without treating every instrument as equivalent or universally applicable.",
    authorityStatement:
      "A Canadian review should preserve the issuing authority, public or private context, province or territory, regulated role, legal force, effective status, language version, and evidence expectations attached to the route.",
    lanes: [
      { title: "Federal sources", description: "Separate legislation, regulation, public-sector directives, procurement controls, official guidance, and regulator interpretation." },
      { title: "Provincial and territorial sources", description: "Preserve local privacy, employment, consumer, human-rights, health, education, and public-administration differences." },
      { title: "Public-sector decisions", description: "Map automated-decision assessment, notice, explanation, review, monitoring, documentation, and accountability pathways where applicable." },
      { title: "Privacy and data governance", description: "Connect collection, use, disclosure, safeguarding, retention, access, correction, and accountability duties to the AI route." },
      { title: "Human rights and impact", description: "Identify discrimination, accessibility, procedural fairness, affected-person, and remedy considerations." },
      { title: "Evidence and continuity", description: "Preserve versions, authority, assessments, tests, approvals, notices, decisions, monitoring, incidents, and outcomes." },
    ],
    questions: [
      "Is the activity governed federally, provincially, territorially, contractually, or through more than one authority?",
      "Is the organization acting in a public-sector, private-sector, employment, health, financial, or other regulated capacity?",
      "Which privacy, human-rights, consumer, safety, procurement, or administrative-law conditions attach?",
      "What assessment, notice, explanation, human review, documentation, or monitoring is required?",
      "Which language, version, effective date, exemption, or transitional condition applies?",
      "What requires qualified Canadian legal review before a compliance determination can be made?",
    ],
    routeSteps: [
      { title: "Authority", description: "Identify the federal, provincial, territorial, municipal, sector, and contractual authorities." },
      { title: "Context", description: "Determine public or private role, geography, sector, decision type, affected persons, and data use." },
      { title: "Requirement", description: "Separate binding obligations, directives, guidance, standards, exceptions, and unresolved questions." },
      { title: "Evidence", description: "Define the assessment, record, notice, control, review, approval, monitoring, and outcome evidence." },
      { title: "Decision", description: "Issue a bounded ALLOW, HOLD, DENY, or ESCALATE determination before execution." },
      { title: "Continuity", description: "Revalidate when law, policy, system, data, purpose, authority, geography, or risk materially changes." },
    ],
  },
  "united-kingdom": {
    name: "United Kingdom",
    code: "UK",
    eyebrow: "CROSS-REGULATOR & SECTOR GOVERNANCE",
    headline: "Translate principles into regulator-specific evidence.",
    introduction:
      "The United Kingdom module is structured around the authority of Parliament, government, courts, regulators, sector rules, procurement conditions, official guidance, assurance activity, and organizational controls. It keeps broad AI principles separate from enforceable duties attached to a particular actor or sector.",
    authorityStatement:
      "A United Kingdom review must identify which regulator or authority governs the route, what existing legal duty is engaged, how any AI-specific guidance relates to that duty, and what evidence supports the resulting determination.",
    lanes: [
      { title: "Primary and secondary law", description: "Preserve legislation, regulations, amendments, commencement conditions, territorial reach, covered actors, and statutory authority." },
      { title: "Regulator pathways", description: "Map regulator rules, codes, enforcement positions, official guidance, sandboxes, assurance expectations, and sector interpretation." },
      { title: "Data and information rights", description: "Connect data protection, transparency, access, explanation, security, retention, governance, and affected-person rights." },
      { title: "Equality, fairness, and remedies", description: "Identify equality, discrimination, accessibility, procedural fairness, employment, consumer, and public-law considerations." },
      { title: "Safety and assurance", description: "Preserve testing, risk assessment, human oversight, technical documentation, incident response, audit, and continuing assurance evidence." },
      { title: "Procurement and accountability", description: "Track public procurement, supplier claims, contractual allocation, audit rights, governance ownership, and executive accountability." },
    ],
    questions: [
      "Which Parliament, government body, court, regulator, public authority, or contractual body governs the route?",
      "What existing legal duty is engaged by the system, decision, actor, sector, data, or affected person?",
      "Is the cited source binding, interpretive, advisory, contractual, voluntary, or an internal control?",
      "What regulator-specific evidence would support fairness, safety, transparency, accountability, or contestability?",
      "What territorial, sector, role, exemption, commencement, or enforcement condition changes applicability?",
      "What uncertainty requires qualified legal interpretation or regulator engagement?",
    ],
    routeSteps: [
      { title: "Regulator", description: "Identify the competent authority, sector regulator, public body, court, and contractual governance pathway." },
      { title: "Duty", description: "Locate the underlying legal obligation rather than relying only on broad AI principles or summaries." },
      { title: "Interpretation", description: "Preserve official guidance and regulator positions without converting them into a different legal force." },
      { title: "Evidence", description: "Map assessments, testing, records, notices, oversight, approvals, incidents, appeals, and outcomes." },
      { title: "Execution", description: "Bind supported requirements to the route before a consequential action can proceed." },
      { title: "Review", description: "Preserve challenge, correction, revalidation, regulator change, and post-execution outcome history." },
    ],
  },
  global: {
    name: "Global Jurisdictions",
    code: "GL",
    eyebrow: "GLOBAL LEGAL MAP",
    headline: "Navigate across borders without collapsing legal boundaries.",
    introduction:
      "The global module provides a governed entry point for country, regional, subnational, sector, treaty, standards, and cross-border AI governance sources. It is designed to show where additional jurisdiction-specific research is required and to prevent one region's rule from being projected onto another without authority.",
    authorityStatement:
      "Every global mapping should preserve country or region, issuing authority, legal force, language, official source, version, effective status, regulated role, sector, data movement, execution location, affected population, and unresolved conflict-of-law questions.",
    lanes: [
      { title: "Europe", description: "Map European Union, EEA, national, sector, regulator, data-protection, product-safety, employment, and public-sector sources." },
      { title: "Americas", description: "Organize national, federal, state, provincial, territorial, sector, consumer, privacy, civil-rights, and procurement pathways." },
      { title: "Asia-Pacific", description: "Preserve country-specific legislation, regulator guidance, safety frameworks, data rules, sector requirements, and cross-border conditions." },
      { title: "Middle East and Africa", description: "Track national strategies, legislation, sector regulation, data governance, public-sector controls, standards, and emerging institutions." },
      { title: "Cross-border operations", description: "Identify establishment, offering, targeting, deployment, data-transfer, outsourcing, supply-chain, and affected-person connections." },
      { title: "Conflict and escalation", description: "Expose incompatible duties, uncertain authority, language gaps, version conflicts, and questions requiring local legal counsel." },
    ],
    questions: [
      "Where is the organization established, the system supplied, the activity performed, the data processed, and the affected person located?",
      "Which national, regional, subnational, sector, contractual, or cross-border authorities may govern?",
      "What source is official, current, translated, binding, enforceable, transitional, proposed, or voluntary?",
      "Do localization, transfer, sovereignty, public-sector, critical-infrastructure, or national-security conditions apply?",
      "Which obligations conflict, overlap, depend on role, or require separate evidence packages?",
      "Where must the route HOLD or ESCALATE for qualified local legal review?",
    ],
    routeSteps: [
      { title: "Footprint", description: "Map establishment, supply, deployment, users, data, infrastructure, decisions, outcomes, and affected populations." },
      { title: "Authorities", description: "Identify each jurisdiction, regulator, sector body, contractual authority, and cross-border instrument." },
      { title: "Sources", description: "Preserve official text, language, translation status, legal force, version, effective date, and provenance." },
      { title: "Conflicts", description: "Expose overlap, contradiction, localization, transfer, sovereignty, and conflict-of-law questions." },
      { title: "Routes", description: "Create jurisdiction-specific bindings rather than one unsupported global compliance claim." },
      { title: "Escalation", description: "Hold execution when local authority, interpretation, evidence, or cross-border compatibility remains unresolved." },
    ],
  },
};

const validKeys = Object.keys(modules) as JurisdictionKey[];

export function generateStaticParams() {
  return validKeys.map((jurisdiction) => ({ jurisdiction }));
}

export default async function JurisdictionLawPage({
  params,
}: {
  params: Promise<{ jurisdiction: string }>;
}) {
  const { jurisdiction } = await params;
  if (!validKeys.includes(jurisdiction as JurisdictionKey)) notFound();

  const module = modules[jurisdiction as JurisdictionKey];

  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="orb orbOne" />
      <div className="orb orbTwo" />

      <header className="topbar shell">
        <Link href="/workspace/ai-governance/library/laws" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>{module.name}</strong>
            <small>Laws &amp; Regulations</small>
          </span>
        </Link>
        <nav>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/workspace/ai-governance/library">Library</Link>
          <Link href="/workspace/ai-governance/library/laws">Jurisdictions</Link>
          <Link href="/workspace">Playground</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div>
          <p className="eyebrow">{module.eyebrow}</p>
          <h1>{module.headline}</h1>
          <p className="lead">{module.introduction}</p>
          <div className="heroActions">
            <a className="primaryButton" href="#source-lanes">Explore source lanes <span>→</span></a>
            <Link className="secondaryButton" href="/workspace/ai-governance/library/laws">All jurisdictions</Link>
          </div>
        </div>
        <div className="legalVisual" aria-hidden="true">
          <div className="ring ringOne" />
          <div className="ring ringTwo" />
          <div className="legalCore"><strong>{module.code}</strong><small>Authority map</small></div>
        </div>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">AUTHORITY BOUNDARY</p>
          <h2>Determine who governs before determining what applies.</h2>
        </div>
        <p>{module.authorityStatement}</p>
      </section>

      <section className="section shell" id="source-lanes">
        <div className="sectionIntro">
          <p className="eyebrow">SOURCE LANES</p>
          <h2>Build the jurisdiction from attributable authority.</h2>
          <p>Each lane is a governed research and implementation pathway. Sources should be preserved with official provenance, version, legal force, applicability, limitations, evidence expectations, and review history.</p>
        </div>
        <div className="grid">
          {module.lanes.map((lane, index) => (
            <article className="card" key={lane.title}>
              <span className="number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{lane.title}</h3>
              <p>{lane.description}</p>
              <div className="status">SOURCE PATHWAY</div>
            </article>
          ))}
        </div>
      </section>

      <section className="questions shell">
        <div className="sectionIntro">
          <p className="eyebrow">APPLICABILITY QUESTIONS</p>
          <h2>Legal mapping begins with bounded facts.</h2>
        </div>
        <div className="questionList">
          {module.questions.map((question, index) => (
            <div className="question" key={question}><span>{String(index + 1).padStart(2, "0")}</span><p>{question}</p></div>
          ))}
        </div>
      </section>

      <section className="method shell">
        <div className="sectionIntro">
          <p className="eyebrow">TA-14 IMPLEMENTATION ROUTE</p>
          <h2>Move from source authority to admissible execution.</h2>
        </div>
        <div className="steps">
          {module.routeSteps.map((step, index) => (
            <article className="step" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{step.title}</h3><p>{step.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta shell">
        <div>
          <p className="eyebrow">GOVERNED LEGAL IMPLEMENTATION</p>
          <h2>Do not turn a legal summary into execution permission.</h2>
          <p>Use the jurisdiction module to locate authority, preserve uncertainty, define evidence, construct bindings, and escalate unresolved legal questions before consequential execution.</p>
        </div>
        <div className="ctaActions">
          <Link className="primaryButton" href="/workspace/routes/new">Build a governed route <span>→</span></Link>
          <Link className="secondaryButton" href="/workspace/ai-governance/library/laws">Return to Laws &amp; Regulations</Link>
        </div>
      </section>

      <footer className="shell">
        <strong>TA-14 Authority Governance Institution</strong>
        <span>{module.name} · Laws &amp; Regulations</span>
      </footer>

      <style>{`
        :global(*){box-sizing:border-box} :global(html){scroll-behavior:smooth} :global(body){margin:0;background:#07101f;color:#f7f9ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        main{min-height:100vh;overflow:hidden;position:relative;background:radial-gradient(circle at 17% 12%,rgba(63,93,255,.16),transparent 31%),radial-gradient(circle at 85% 24%,rgba(45,209,190,.1),transparent 28%),linear-gradient(180deg,#07101f 0%,#0a1324 55%,#07101f 100%)}
        .shell{width:min(1180px,calc(100% - 40px));margin:0 auto;position:relative;z-index:2}.stars{position:absolute;inset:0;pointer-events:none;opacity:.2;background-image:radial-gradient(circle,white 1px,transparent 1.4px);background-size:58px 58px}.starsTwo{background-size:91px 91px;transform:translate(23px,17px);opacity:.1}.orb{position:absolute;border-radius:50%;filter:blur(2px);pointer-events:none}.orbOne{width:420px;height:420px;top:250px;right:-250px;background:rgba(63,93,255,.1)}.orbTwo{width:340px;height:340px;top:1180px;left:-230px;background:rgba(45,209,190,.08)}
        .topbar{display:flex;align-items:center;justify-content:space-between;padding:25px 0;border-bottom:1px solid rgba(255,255,255,.1)}.brand{display:flex;align-items:center;gap:12px;color:white;text-decoration:none}.brandMark{width:50px;height:50px;display:grid;place-items:center;border-radius:15px;border:1px solid rgba(100,128,255,.55);background:linear-gradient(145deg,rgba(73,94,255,.28),rgba(23,31,67,.9));font-size:12px;font-weight:900;letter-spacing:.07em}.brand strong,.brand small{display:block}.brand small{color:#9ba9c7;margin-top:3px}.topbar nav{display:flex;gap:22px;flex-wrap:wrap}.topbar nav a{color:#aebbd5;text-decoration:none;font-size:14px}.topbar nav a:hover{color:white}
        .hero{padding:105px 0 85px;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(300px,.65fr);gap:70px;align-items:center}.eyebrow{margin:0 0 16px;color:#8fa4ff;font-weight:850;font-size:12px;letter-spacing:.18em}.hero h1{font-size:clamp(46px,7vw,82px);line-height:.98;letter-spacing:-.055em;margin:0;max-width:850px}.lead{font-size:19px;line-height:1.75;color:#b6c2d9;max-width:820px;margin:28px 0 0}.heroActions,.ctaActions{display:flex;gap:12px;flex-wrap:wrap;margin-top:32px}.primaryButton,.secondaryButton{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:14px 19px;border-radius:999px;text-decoration:none;font-weight:800;font-size:14px}.primaryButton{background:linear-gradient(135deg,#6980ff,#4358d8);color:white;box-shadow:0 15px 35px rgba(48,72,210,.25)}.secondaryButton{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.04);color:#dbe3f5}.legalVisual{min-height:360px;display:grid;place-items:center;position:relative}.ring{position:absolute;border:1px solid rgba(124,145,255,.32);border-radius:50%}.ringOne{width:330px;height:330px}.ringTwo{width:245px;height:245px;border-color:rgba(54,205,191,.28)}.legalCore{width:160px;height:160px;border-radius:50%;display:grid;place-content:center;text-align:center;background:radial-gradient(circle at 35% 30%,#4459d8,#151d3f 68%);border:1px solid rgba(255,255,255,.18);box-shadow:0 0 80px rgba(72,94,255,.24)}.legalCore strong{font-size:42px}.legalCore small{color:#c2ccef;margin-top:5px}
        .boundary{display:grid;grid-template-columns:.85fr 1.15fr;gap:45px;padding:38px;border:1px solid rgba(255,255,255,.1);border-radius:26px;background:linear-gradient(135deg,rgba(27,39,77,.78),rgba(10,19,36,.82));box-shadow:0 30px 80px rgba(0,0,0,.22)}.boundary h2,.sectionIntro h2,.cta h2{font-size:clamp(30px,4vw,48px);line-height:1.08;letter-spacing:-.035em;margin:0}.boundary>p,.sectionIntro>p:last-child,.cta p{margin:0;color:#b7c3da;line-height:1.75;font-size:16px}
        .section,.questions,.method{padding:105px 0 0}.sectionIntro{max-width:820px}.sectionIntro>p:last-child{margin-top:18px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:38px}.card{padding:27px;min-height:270px;border:1px solid rgba(255,255,255,.1);border-radius:22px;background:linear-gradient(155deg,rgba(25,37,69,.9),rgba(10,18,34,.92));position:relative}.number{display:inline-grid;place-items:center;width:40px;height:40px;border-radius:12px;background:rgba(91,111,255,.14);color:#9cafef;font-weight:900;font-size:12px}.card h3{font-size:21px;margin:24px 0 12px}.card p{color:#aebbd2;line-height:1.65;margin:0}.status{position:absolute;left:27px;bottom:24px;font-size:10px;letter-spacing:.15em;color:#7185d9;font-weight:900}
        .questionList{display:grid;gap:12px;margin-top:35px}.question{display:grid;grid-template-columns:56px 1fr;align-items:center;padding:18px 22px;border-radius:17px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.035)}.question span{color:#8197ef;font-weight:900;font-size:12px}.question p{margin:0;color:#d5ddef;font-size:16px}
        .steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;margin-top:38px}.step{display:grid;grid-template-columns:52px 1fr;gap:16px;padding:24px;border-radius:20px;border:1px solid rgba(255,255,255,.09);background:rgba(12,22,41,.78)}.step>span{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:rgba(45,209,190,.1);color:#6cd9cc;font-weight:900;font-size:12px}.step h3{margin:1px 0 8px}.step p{margin:0;color:#aebbd2;line-height:1.6}
        .cta{margin-top:110px;padding:46px;display:grid;grid-template-columns:1.15fr .85fr;gap:50px;align-items:center;border:1px solid rgba(108,129,255,.23);border-radius:28px;background:radial-gradient(circle at 85% 20%,rgba(59,205,188,.1),transparent 35%),linear-gradient(135deg,rgba(40,55,108,.88),rgba(12,22,42,.94))}.cta p{margin-top:17px}.ctaActions{justify-content:flex-end;margin-top:0}footer{display:flex;justify-content:space-between;gap:20px;padding:48px 0;color:#7f8ba5;font-size:13px}
        @media(max-width:900px){.topbar{align-items:flex-start;gap:22px}.topbar nav{justify-content:flex-end}.hero{grid-template-columns:1fr;padding-top:75px}.legalVisual{min-height:290px}.boundary,.cta{grid-template-columns:1fr}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ctaActions{justify-content:flex-start}}
        @media(max-width:650px){.shell{width:min(100% - 24px,1180px)}.topbar{display:block}.topbar nav{margin-top:20px;justify-content:flex-start;gap:14px}.hero h1{font-size:45px}.lead{font-size:17px}.legalVisual{display:none}.boundary{padding:27px}.grid,.steps{grid-template-columns:1fr}.card{min-height:245px}.cta{padding:29px}.primaryButton,.secondaryButton{width:100%}footer{display:grid}}
      `}</style>
    </main>
  );
}
