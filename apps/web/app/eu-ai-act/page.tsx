"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RouteState = "READY TO MAP" | "EVIDENCE GAP" | "REVIEW REQUIRED";
type RequirementStatus = "Available" | "Expanding" | "Planned";

type TransparencyPathway = {
  id: string;
  article: string;
  role: string;
  title: string;
  description: string;
  appliesTo: string[];
  evidence: string[];
  outputs: string[];
  state: RouteState;
};

const routes = {
  article50: "#article-50-workspace",
  classification: "#guided-classification",
  prohibited: "#requirements-explorer",
  highRisk: "#requirements-explorer",
  marketplace: "/marketplace",
  opportunities: "/marketplace",
  professionals: "/marketplace",
  governedRecords: "/workspace/governed-records",
  governanceRoutes: "/workspace",
  registry: "/workspace",
} as const;

const roles = [
  ["PR", "Provider", "provider", "You develop an AI system or general-purpose AI model and place it on the market or put it into service under your name or trademark."],
  ["DE", "Deployer", "deployer", "You use an AI system under your authority in a professional or organisational context."],
  ["IM", "Importer", "importer", "You place an AI system bearing the name or trademark of a provider established outside the Union on the Union market."],
  ["DI", "Distributor", "distributor", "You make an AI system available on the Union market without being the provider or importer."],
  ["PM", "Product Manufacturer", "product-manufacturer", "You place an AI system on the market or put it into service together with your product under your own name or trademark."],
  ["AR", "Authorised Representative", "authorised-representative", "You are established in the Union and hold a written mandate to perform specified tasks on behalf of a provider."],
  ["GP", "GPAI Provider", "gpai-provider", "You develop or place a general-purpose AI model on the market and need a model-level governance pathway."],
  ["?", "Not Sure?", "not-sure", "Use a guided route to identify possible roles, system categories, exceptions, and evidence still needed."],
] as const;

const requirements: {
  title: string;
  status: RequirementStatus;
  copy: string;
  href: string;
}[] = [
  ["Risk Classification", "Expanding", "Determine whether a system is prohibited, high-risk, transparency-scoped, limited-risk, or outside a claimed category.", routes.classification],
  ["Prohibited Practices", "Available", "Map use cases against prohibited-practice categories, exceptions, evidence, and escalation boundaries.", routes.prohibited],
  ["High-Risk AI Systems", "Available", "Explore lifecycle duties, risk management, data governance, documentation, oversight, logging, and monitoring.", routes.highRisk],
  ["General-Purpose AI", "Expanding", "Separate model-provider duties, systemic-risk pathways, technical information, copyright policy, and downstream support.", "#requirements-roadmap"],
  ["Article 50 Transparency", "Available", "Map direct-interaction disclosure, synthetic-content marking, biometric notice, deepfakes, and public-interest text.", routes.article50],
  ["Conformity Assessment", "Planned", "Preserve the selected assessment route, evidence package, reviewers, findings, corrections, and resulting standing.", "#requirements-roadmap"],
  ["Post-Market Monitoring", "Planned", "Govern continuing performance, incidents, material changes, corrective action, and evidence validity after deployment.", "#requirements-roadmap"],
  ["Incident Reporting", "Planned", "Create bounded routes for detection, classification, chronology, notification, correction, and preserved outcome.", "#requirements-roadmap"],
  ["Human Oversight", "Expanding", "Define accountable human authority, intervention capability, escalation, competence, and override boundaries.", "#requirements-roadmap"],
  ["Technical Documentation", "Planned", "Bind system identity, intended purpose, architecture, data, testing, limits, versions, changes, and evidence ownership.", "#requirements-roadmap"],
  ["Fundamental Rights Impact Assessment", "Available", "Structure affected-person context, risks, safeguards, governance decisions, review, and retained limitations.", routes.highRisk],
  ["Recordkeeping and Logs", "Expanding", "Preserve identity, chronology, provenance, access, decisions, interventions, changes, and outcomes.", routes.governedRecords],
].map(([title, status, copy, href]) => ({ title, status: status as RequirementStatus, copy, href }));

const progress = [
  ["01", "Identify", "Identify the actor, system, model, product, use case, jurisdiction, and intended purpose."],
  ["02", "Classify", "Separate role classification, system category, risk category, and claimed exceptions."],
  ["03", "Determine Applicability", "State why each obligation is included, excluded, conditional, or unresolved."],
  ["04", "Map Requirements", "Translate applicable requirements into bounded evidence and decision routes."],
  ["05", "Preserve Evidence", "Bind claims to documents, tests, owners, versions, chronology, and limitations."],
  ["06", "Review", "Challenge reasoning, expose gaps, preserve objections, and correct without erasing history."],
  ["07", "Governed Record", "Create a dated, attributable record of applicability, evidence, decisions, and boundaries."],
  ["08", "Independent Verification", "Test whether the preserved package still corresponds to the claimed implementation."],
];

const transparencyPathways: TransparencyPathway[] = [
  {
    id: "TA-14-EU-AIA-50-1",
    article: "Article 50(1)",
    role: "Provider",
    title: "Direct AI interaction disclosure",
    description: "Map whether a system interacts directly with natural persons and whether the disclosure design clearly informs them that they are interacting with AI.",
    appliesTo: ["Interactive AI systems", "Chatbots and conversational systems", "Direct user-facing AI interfaces"],
    evidence: ["Intended-purpose statement", "User-interface captures", "Disclosure timing and wording", "Exception analysis", "Version and deployment record"],
    outputs: ["Applicability record", "Disclosure evidence map", "Gap and exception record", "Review-ready route package"],
    state: "READY TO MAP",
  },
  {
    id: "TA-14-EU-AIA-50-2",
    article: "Article 50(2)",
    role: "Provider",
    title: "Machine-readable marking and detectability",
    description: "Preserve how synthetic or manipulated audio, image, video, and text outputs are marked in a machine-readable format and made detectable where technically feasible.",
    appliesTo: ["Generative AI systems", "Synthetic media systems", "AI-generated or manipulated content"],
    evidence: ["Marking architecture", "Detection testing", "Interoperability evidence", "Robustness evidence", "Technical-feasibility determination"],
    outputs: ["Marking implementation record", "Detectability test record", "Technical limitation record", "Provider evidence package"],
    state: "EVIDENCE GAP",
  },
  {
    id: "TA-14-EU-AIA-50-3",
    article: "Article 50(3)",
    role: "Provider or Deployer",
    title: "Emotion recognition and biometric categorisation notice",
    description: "Map notice obligations where natural persons are exposed to emotion-recognition or biometric-categorisation systems, subject to applicable exceptions.",
    appliesTo: ["Emotion-recognition systems", "Biometric-categorisation systems", "Workplace or public-facing deployments"],
    evidence: ["System classification", "Deployment context", "Notice design", "Exception analysis", "Affected-person pathway"],
    outputs: ["Applicability determination", "Notice implementation record", "Exception and limitation record", "Deployment evidence package"],
    state: "REVIEW REQUIRED",
  },
  {
    id: "TA-14-EU-AIA-50-4",
    article: "Article 50(4)",
    role: "Deployer",
    title: "Deepfake and public-interest text disclosure",
    description: "Map deployer-side disclosure for deepfakes and certain AI-generated or manipulated text published to inform the public on matters of public interest.",
    appliesTo: ["Deepfakes", "AI-generated public-interest text", "Professionally deployed synthetic media"],
    evidence: ["Content classification", "Editorial-control record", "Disclosure wording and placement", "Publication chronology", "Exception analysis"],
    outputs: ["Deployer disclosure record", "Editorial-control determination", "Publication evidence package", "Exception and boundary record"],
    state: "READY TO MAP",
  },
];

const stateClass: Record<RouteState, string> = {
  "READY TO MAP": "ready",
  "EVIDENCE GAP": "gap",
  "REVIEW REQUIRED": "review",
};

const recordTypes = [
  ["01", "Applicability Record", "Preserves actor, role, system, use case, jurisdiction, scope, exceptions, and the basis for inclusion or exclusion."],
  ["02", "Evidence Map", "Binds each obligation or commitment to documents, technical artifacts, tests, owners, versions, and unresolved gaps."],
  ["03", "Transparency Implementation Record", "Preserves marking, notice, disclosure, placement, timing, detectability, and deployment state."],
  ["04", "Independent Review Record", "Preserves reviewer identity, scope, evidence reviewed, findings, objections, corrections, and limitations."],
  ["05", "Change Record", "Shows what changed, when, why, by whom, and whether prior evidence remains valid."],
  ["06", "Outcome Record", "Preserves what was approved, held, denied, escalated, superseded, withdrawn, or left unresolved."],
];

const connectedPathways = [
  ["01", "AI Governance Registry", "Preserve governance identity, establishment date, versions, claims, non-claims, evidence, and stewardship.", routes.registry],
  ["02", "Governance Routes", "Convert obligations into inspectable pathways with inputs, gates, evidence, outputs, and explicit failure states.", routes.governanceRoutes],
  ["03", "Governed Records", "Preserve applicability, evidence, review, disclosure, change, and outcome records.", routes.governedRecords],
  ["04", "Independent Review", "Discover professionals through declared expertise, evidence signals, artifacts, and visible limitations.", routes.professionals],
  ["05", "Post or Find Work", "Create bounded opportunities for gap analysis, evidence mapping, route review, and transparency implementation.", routes.opportunities],
];

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>;
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {action}
    </div>
  );
}

export default function EuAiActPage() {
  const [role, setRole] = useState<"All" | "Provider" | "Deployer" | "Provider or Deployer">("All");
  const [query, setQuery] = useState("");

  const filteredPathways = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return transparencyPathways.filter((pathway) => {
      const roleMatch = role === "All" || pathway.role === role;
      const queryMatch = !normalized || [
        pathway.id, pathway.article, pathway.role, pathway.title, pathway.description,
        ...pathway.appliesTo, ...pathway.evidence, ...pathway.outputs,
      ].join(" ").toLowerCase().includes(normalized);
      return roleMatch && queryMatch;
    });
  }, [query, role]);

  return (
    <main className="page-shell">
      <div className="cosmos" aria-hidden="true">
        <i className="star-field stars-a" />
        <i className="star-field stars-b" />
        <i className="orbit orbit-a" />
        <i className="orbit orbit-b" />
        <i className="route-line route-a" />
        <i className="route-line route-b" />
        <i className="route-line route-c" />
        <i className="glow glow-a" />
        <i className="glow glow-b" />
      </div>

      <div className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">TA-14 AI Governance Exchange</Link>
          <span>›</span>
          <span>EU AI Act</span>
        </nav>

        <header className="hero">
          <div>
            <span className="eyebrow">EU AI ACT GOVERNANCE WORKSPACE</span>
            <h1>Turn regulatory obligations into <em>inspectable evidence routes.</em></h1>
            <p className="hero-copy">
              The EU AI Act does not become governable merely because an organisation has a policy,
              checklist, legal memo, or dashboard. TA-14 separates applicability, evidence,
              determination, review, commitment, execution, and preserved outcome so each claimed
              compliance pathway can be inspected under scrutiny.
            </p>

            <div className="action-row">
              <Link className="button primary-button" href={routes.article50}>Open Article 50 Workspace <Arrow /></Link>
              <Link className="button gold-button" href={routes.classification}>Classify My Role or System <Arrow /></Link>
              <Link className="button glass-button" href={routes.governanceRoutes}>Open AI Governance Workspace <Arrow /></Link>
              <Link className="button glass-button" href={routes.professionals}>Open Reviewer Marketplace <Arrow /></Link>
            </div>
          </div>

          <aside className="deadline-panel">
            <article className="deadline-card">
              <span>ARTICLE 50 APPLICATION DATE</span>
              <strong>2 August 2026</strong>
              <p>Transparency obligations for providers and deployers of certain AI systems begin to apply.</p>
            </article>
            <article className="deadline-card">
              <span>INITIAL CODE SIGNATORY LIST</span>
              <strong>27 July 2026</strong>
              <b>18:00 CEST</b>
              <p>Submission deadline for inclusion in the initial public list of Code of Practice signatories.</p>
            </article>
          </aside>
        </header>

        <section className="legal-boundary">
          <span>!</span>
          <div>
            <strong>This workspace does not provide legal advice or certify compliance.</strong>
            <p>It structures obligations, evidence, gaps, review routes, decisions, and records.</p>
          </div>
        </section>

        <section className="status-grid">
          {[
            ["Regulation", "EU 2024/1689", "Risk-based obligations for AI systems, models, providers, deployers, and other actors."],
            ["Current focus", "Article 50", "Interaction disclosure, marking, detectability, deepfakes, and public-interest text."],
            ["Code status", "VOLUNTARY", "Signing can support a compliance pathway but is not conclusive proof of compliance."],
            ["Alternative route", "PERMITTED", "Non-signatories remain responsible for demonstrating adequate alternative measures."],
          ].map(([label, value, copy]) => (
            <article key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{copy}</p>
            </article>
          ))}
        </section>

        <section className="page-section">
          <SectionHeading
            eyebrow="ROLE NAVIGATOR"
            title="Begin with the role you actually hold."
            copy="Different actors can carry different obligations for the same system or model. Choose the closest role to open a bounded pathway."
            action={<Link className="section-action" href={routes.classification}>Start Guided Classification <Arrow /></Link>}
          />
          <div className="role-grid">
            {roles.map(([code, title, slug, copy]) => (
              <Link className="role-card" href={slug === "not-sure" ? "#guided-classification" : "#article-50-workspace"} key={title}>
                <span className="role-code">{code}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="card-link">Open role pathway <Arrow /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="guided-panel" id="guided-classification">
          <div className="guided-orb">?</div>
          <div>
            <span className="eyebrow">GUIDED CLASSIFICATION</span>
            <h2>I do not know whether my system is high-risk—or which role applies.</h2>
            <p>Walk through a bounded sequence of questions that separates declared facts, unresolved facts, possible classifications, exceptions, and evidence still needed.</p>
          </div>
          <Link className="button primary-button" href={routes.classification}>Start Guided Classification <Arrow /></Link>
        </section>

        <section className="page-section" id="requirements-explorer">
          <SectionHeading
            eyebrow="REQUIREMENTS EXPLORER"
            title="Open the Act by governance problem—not by guesswork."
            copy="Each destination preserves the legal source, actor, applicability basis, evidence expectations, unresolved questions, review route, and governed outputs."
          />
          <div className="requirements-grid">
            {requirements.map((item, index) => (
              <Link className="requirement-card" href={item.href} key={item.title}>
                <div className="requirement-top">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <span className="card-link">{item.status === "Planned" ? "View roadmap" : "Explore requirement"} <Arrow /></span>
              </Link>
            ))}
          </div>
          <div className="roadmap-note" id="requirements-roadmap" tabIndex={-1}>
            <span>PLATFORM ROADMAP</span>
            <p>Planned and expanding modules return here rather than sending visitors to unfinished destinations. Available modules open their dedicated workspaces.</p>
          </div>
        </section>

        <section className="page-section">
          <SectionHeading
            eyebrow="GOVERNANCE PROGRESS MAP"
            title="Move from an uncertain system description to a verifiable governed record."
          />
          <div className="progress-map">
            {progress.map(([number, title, copy], index) => (
              <article key={number}>
                <span className="progress-number">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                {index < progress.length - 1 && <i>→</i>}
              </article>
            ))}
          </div>
        </section>

        <section className="split-section">
          <article>
            <span className="eyebrow">SOURCE-BOUND GOVERNANCE</span>
            <h2>The platform must point back to the controlling source.</h2>
            {[
              ["Official Article", "Each requirement route should identify the controlling article and preserve the exact source version used for the determination."],
              ["Relevant Recitals", "Recitals may provide context but should remain distinguishable from binding operative provisions."],
              ["Official Guidance", "Commission, AI Office, Board, standards, and authority guidance should be dated, attributed, and never silently substituted for the Regulation."],
              ["TA-14 Boundary", "TA-14 structures governance routes and evidence. It does not replace the official text, competent legal advice, conformity assessment, or regulator judgment."],
            ].map(([title, copy]) => (
              <div className="source-row" key={title}><strong>{title}</strong><p>{copy}</p></div>
            ))}
          </article>

          <article>
            <span className="eyebrow">THE TA-14 DIFFERENCE</span>
            <h2>Do not collapse the law, the evidence, and the conclusion into one layer.</h2>
            <p>A regulation states obligations. An organisation declares how those obligations apply. Evidence supports that declaration. Review tests the evidence and reasoning.</p>
            <div className="difference-chain">
              {["Obligation", "Applicability", "Evidence", "Determination", "Review", "Record"].map((item, index) => (
                <span key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</span>
              ))}
            </div>
          </article>
        </section>

        <section className="page-section" id="article-50-workspace">
          <SectionHeading
            eyebrow="ARTICLE 50 TRANSPARENCY WORKSPACE"
            title="Map the obligation before claiming the outcome."
            copy="These demonstration pathways separate provider and deployer duties, identify evidence dependencies, expose missing proof, and define review-ready outputs."
            action={<Link className="section-action" href={routes.article50}>Jump to Article 50 Pathways <Arrow /></Link>}
          />

          <div className="filter-panel">
            <label>
              <span>Search pathways</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search obligation, role, evidence, output, or pathway ID"
              />
            </label>
            <div>
              <span className="filter-label">Role</span>
              <div className="filter-row">
                {(["All", "Provider", "Deployer", "Provider or Deployer"] as const).map((item) => (
                  <button type="button" key={item} className={role === item ? "selected" : ""} onClick={() => setRole(item)}>{item}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="results-meta">
            <strong>{filteredPathways.length} pathway{filteredPathways.length === 1 ? "" : "s"}</strong>
            <span>No backend evidence submission or legal determination is connected yet.</span>
          </div>

          <div className="pathway-grid">
            {filteredPathways.map((pathway) => (
              <article className="pathway-card" key={pathway.id}>
                <div className="card-topline">
                  <span>{pathway.article}</span>
                  <span className={`state-badge ${stateClass[pathway.state]}`}>{pathway.state}</span>
                </div>
                <span className="pathway-id">{pathway.id}</span>
                <h3>{pathway.title}</h3>
                <p className="role-label">{pathway.role}</p>
                <p className="description">{pathway.description}</p>

                <div className="scope-box">
                  <span>Potential scope</span>
                  <ul>{pathway.appliesTo.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>

                <div className="two-column">
                  <div>
                    <span>Evidence to preserve</span>
                    <ul>{pathway.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <span>Governed outputs</span>
                    <ul>{pathway.outputs.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>

                <div className="card-actions">
                  <Link className="button primary-button compact" href={routes.article50}>Inspect Article 50 Route <Arrow /></Link>
                  <Link className="button glass-button compact" href={routes.professionals}>Open Marketplace <Arrow /></Link>
                </div>
              </article>
            ))}
          </div>

          {filteredPathways.length === 0 && (
            <div className="empty-state">
              <h3>No pathways match those filters.</h3>
              <button type="button" onClick={() => { setQuery(""); setRole("All"); }}>Reset filters</button>
            </div>
          )}
        </section>

        <section className="page-section">
          <SectionHeading
            eyebrow="CODE OF PRACTICE PATHWAY"
            title="Signing the Code and complying with Article 50 are not the same claim."
            copy="The Code of Practice is a voluntary tool for demonstrating compliance with specified transparency obligations. Adherence can create a more predictable route, but it is not conclusive evidence of compliance."
          />
          <div className="comparison-grid">
            <article>
              <span>SIGNATORY ROUTE</span>
              <h3>Adhere to the Code</h3>
              <ul>
                <li>Identify the exact commitments that apply.</li>
                <li>Bind implementation evidence to each commitment.</li>
                <li>Preserve testing, exceptions, limitations, and updates.</li>
                <li>Demonstrate continuing adherence rather than one-time signature.</li>
              </ul>
              <Link className="boxed-link" href={routes.article50}>Open signatory route <Arrow /></Link>
            </article>
            <article>
              <span>ALTERNATIVE ROUTE</span>
              <h3>Use other adequate measures</h3>
              <ul>
                <li>Document why the selected measures satisfy Article 50.</li>
                <li>Map differences from the Code and justify those differences.</li>
                <li>Prepare evidence for competent-authority information requests.</li>
                <li>Preserve gap analyses, testing, and technical limitations.</li>
              </ul>
              <Link className="boxed-link" href={routes.article50}>Open alternative route <Arrow /></Link>
            </article>
          </div>
        </section>

        <section className="page-section">
          <SectionHeading
            eyebrow="GOVERNED RECORD ARCHITECTURE"
            title="Every material claim should become a dated, attributable record."
            action={<Link className="section-action" href={routes.governedRecords}>Open Governed Records <Arrow /></Link>}
          />
          <div className="record-grid">
            {recordTypes.map(([number, title, copy]) => (
              <Link className="record-card" href={routes.governedRecords} key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <b className="card-link">Create record <Arrow /></b>
              </Link>
            ))}
          </div>
        </section>

        <section className="page-section">
          <SectionHeading
            eyebrow="CONNECTED EXCHANGE PATHWAYS"
            title="The EU AI Act workspace should not become another isolated compliance page."
          />
          <div className="integration-grid">
            {connectedPathways.map(([number, title, copy, href]) => (
              <Link href={href} key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <b className="card-link">Open pathway <Arrow /></b>
              </Link>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <span className="eyebrow">NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</span>
          <h2>The deadline may start the obligation. It does not complete the evidence chain.</h2>
          <p>The TA-14 EU AI Act workspace is designed to make each regulatory pathway inspectable: what applies, why it applies, what evidence exists, what remains missing, who reviewed it, what changed, and what decision the evidence can actually support.</p>
          <div className="action-row centered">
            <Link className="button primary-button" href={routes.article50}>Explore Article 50 <Arrow /></Link>
            <Link className="button gold-button" href={routes.marketplace}>Open Marketplace <Arrow /></Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        :global(*){box-sizing:border-box}
        :global(html){scroll-behavior:smooth;background:#020711}
        :global(body){margin:0;background:#020711;color:#edf7fb;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        :global(a){color:inherit}
        button,input{font:inherit}

        .page-shell{min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 10% 0%,rgba(10,132,185,.18),transparent 26%),radial-gradient(circle at 90% 12%,rgba(97,63,190,.15),transparent 28%),linear-gradient(180deg,#03101c 0%,#020711 100%)}
        .content-shell{width:min(1380px,calc(100% - 40px));margin:auto;padding:28px 0 100px;position:relative;z-index:2}
        .cosmos{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:0}
        .star-field{position:absolute;inset:-20%}
        .stars-a{background-image:radial-gradient(circle,rgba(255,255,255,.8) 0 1px,transparent 1.5px);background-size:118px 118px;animation:stars 46s linear infinite}
        .stars-b{background-image:radial-gradient(circle,rgba(75,198,255,.64) 0 1px,transparent 1.5px);background-size:184px 184px;background-position:40px 70px;animation:stars 64s linear infinite reverse}
        .orbit{position:absolute;width:460px;height:180px;border:1px solid rgba(91,207,235,.13);border-radius:50%}
        .orbit-a{left:-140px;top:11%;transform:rotate(-17deg)}
        .orbit-b{right:-150px;top:44%;transform:rotate(24deg);border-color:rgba(255,193,70,.13)}
        .route-line{position:absolute;width:72vw;height:1px;background:linear-gradient(90deg,transparent,rgba(97,213,238,.46),rgba(255,195,78,.35),transparent);filter:drop-shadow(0 0 8px rgba(75,190,220,.36))}
        .route-line::after{content:"";position:absolute;top:-3px;width:7px;height:7px;border-radius:999px;background:#fff0ae;box-shadow:0 0 16px rgba(255,214,109,.9);animation:packet 7s linear infinite}
        .route-a{top:22%;left:-15%;transform:rotate(-8deg)}
        .route-b{top:58%;right:-20%;transform:rotate(10deg)}
        .route-c{top:82%;left:4%;transform:rotate(-4deg)}
        .glow{position:absolute;width:420px;height:420px;border-radius:50%;filter:blur(90px);opacity:.12}
        .glow-a{left:10%;top:32%;background:#138bd3}
        .glow-b{right:7%;top:60%;background:#9b5cff}

        .breadcrumbs{display:flex;gap:10px;margin-bottom:44px;color:#7b99a7;font-size:.86rem}
        .breadcrumbs a{text-decoration:none;color:#bcefff;border-bottom:1px solid rgba(112,216,239,.3);transition:.2s}
        .breadcrumbs a:hover{color:white;border-color:#70d8ef}

        .hero{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(320px,.55fr);gap:42px;align-items:end;padding-bottom:28px}
        .eyebrow{display:inline-block;color:#70d8ef;font-size:.72rem;font-weight:950;letter-spacing:.16em;text-transform:uppercase}
        h1,h2,h3,p{margin-top:0}
        h1{max-width:980px;margin:18px 0 24px;font-family:Georgia,"Times New Roman",serif;font-size:clamp(3.2rem,6.5vw,7rem);line-height:.93;letter-spacing:-.06em;text-wrap:balance}
        h1 em{color:#ffc754;font-style:italic;text-shadow:0 0 38px rgba(255,192,70,.16)}
        .hero-copy{max-width:900px;color:#b8cbd4;font-size:1.07rem;line-height:1.78}

        .action-row{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
        .button,.section-action,.card-link,.boxed-link{display:inline-flex;align-items:center;justify-content:center;gap:14px;text-decoration:none}
        .button{min-height:50px;padding:0 20px;border-radius:14px;border:1px solid transparent;font-size:.84rem;font-weight:950;position:relative;overflow:hidden;transition:transform .22s,box-shadow .22s,border-color .22s}
        .button::before,.section-action::before,.boxed-link::before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 20%,rgba(255,255,255,.24) 45%,transparent 70%);transform:translateX(-130%);transition:transform .55s}
        .button:hover,.section-action:hover,.boxed-link:hover{transform:translateY(-3px)}
        .button:hover::before,.section-action:hover::before,.boxed-link:hover::before{transform:translateX(130%)}
        .primary-button{color:#031019;background:linear-gradient(135deg,#b5f4ff,#59cce9 68%,#45accb);border-color:#9aeafa;box-shadow:0 14px 34px rgba(59,191,223,.22),inset 0 1px 0 rgba(255,255,255,.7)}
        .gold-button{color:#241400;background:linear-gradient(135deg,#ffe7a4,#e9b33e 65%,#b77412);border-color:#f0c866;box-shadow:0 14px 34px rgba(224,164,42,.18),inset 0 1px 0 rgba(255,255,255,.55)}
        .glass-button{color:#eafaff;border-color:rgba(129,215,237,.28);background:linear-gradient(180deg,rgba(15,43,61,.9),rgba(7,23,36,.9));box-shadow:inset 0 1px 0 rgba(255,255,255,.04)}
        .glass-button:hover{border-color:#70d8ef;box-shadow:0 13px 30px rgba(29,151,183,.15)}
        .compact{min-height:42px;padding:0 14px;font-size:.76rem;border-radius:11px}
        .arrow{font-size:1rem;transition:transform .22s}
        :global(a:hover) .arrow{transform:translate(3px,-2px)}

        .deadline-panel{display:grid;gap:14px}
        .deadline-card{padding:23px;border:1px solid rgba(229,182,72,.28);border-radius:22px;background:radial-gradient(circle at 100% 0%,rgba(255,198,76,.11),transparent 42%),linear-gradient(145deg,rgba(38,30,19,.75),rgba(13,20,28,.88));box-shadow:0 20px 50px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.035)}
        .deadline-card span{color:#c7a957;font-size:.66rem;font-weight:950;letter-spacing:.11em}
        .deadline-card strong{display:block;margin-top:12px;color:#ffe49c;font-size:1.55rem}
        .deadline-card b{display:block;margin-top:3px;color:#d5bd79;font-size:.9rem}
        .deadline-card p{margin:10px 0 0;color:#b9ae8d;line-height:1.55;font-size:.88rem}

        .legal-boundary{display:grid;grid-template-columns:42px 1fr;gap:16px;align-items:center;margin:18px 0 24px;padding:18px 20px;border:1px solid rgba(222,181,75,.25);border-radius:18px;background:rgba(126,86,15,.09)}
        .legal-boundary>span{width:38px;height:38px;display:grid;place-items:center;border-radius:999px;border:1px solid #ddb653;color:#ffe395;font-weight:950;box-shadow:0 0 18px rgba(225,175,51,.13)}
        .legal-boundary p{margin:4px 0 0;color:#bdb28f}

        .status-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;padding-bottom:84px}
        .status-grid article{min-height:195px;padding:22px;border:1px solid rgba(103,194,218,.16);border-radius:20px;background:radial-gradient(circle at top right,rgba(75,201,231,.07),transparent 38%),linear-gradient(145deg,rgba(12,34,49,.84),rgba(6,21,34,.9));box-shadow:0 18px 44px rgba(0,0,0,.14)}
        .status-grid span{color:#789aa9;font-size:.68rem;font-weight:950;letter-spacing:.1em;text-transform:uppercase}
        .status-grid strong{display:block;margin:34px 0 12px;font-size:1.38rem}
        .status-grid p{color:#93aab5;line-height:1.55}

        .page-section{padding-top:86px;scroll-margin-top:28px}
        .section-heading{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:28px;align-items:end;margin-bottom:30px}
        .section-heading>div{max-width:990px}
        .section-heading h2,.split-section h2,.final-cta h2{margin:12px 0 15px;font-family:Georgia,"Times New Roman",serif;font-size:clamp(2.4rem,4.7vw,5rem);line-height:.98;letter-spacing:-.052em;text-wrap:balance}
        .section-heading p{max-width:900px;color:#a9bec8;line-height:1.72}
        .section-action,.boxed-link{min-height:46px;padding:0 16px;border-radius:12px;border:1px solid rgba(111,213,236,.32);color:#c9f5ff;background:rgba(31,125,153,.08);font-size:.78rem;font-weight:900;position:relative;overflow:hidden;transition:.2s}
        .section-action:hover,.boxed-link:hover{border-color:#70d8ef;background:rgba(51,166,195,.13)}

        .role-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
        .role-card,.requirement-card,.record-card,.integration-grid a{color:inherit;text-decoration:none;position:relative;overflow:hidden;transition:transform .24s,border-color .24s,box-shadow .24s}
        .role-card{min-height:285px;padding:22px;display:flex;flex-direction:column;border:1px solid rgba(103,194,220,.16);border-radius:22px;background:linear-gradient(145deg,rgba(13,37,53,.88),rgba(6,21,34,.92))}
        .role-card::before,.requirement-card::before,.record-card::before,.integration-grid a::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 100% 0%,rgba(112,216,239,.12),transparent 40%);opacity:0;transition:opacity .24s}
        .role-card:hover,.requirement-card:hover,.record-card:hover,.integration-grid a:hover{transform:translateY(-7px);border-color:rgba(112,216,239,.58);box-shadow:0 24px 56px rgba(0,0,0,.24),0 0 30px rgba(48,170,201,.08)}
        .role-card:hover::before,.requirement-card:hover::before,.record-card:hover::before,.integration-grid a:hover::before{opacity:1}
        .role-code{width:46px;height:46px;display:grid;place-items:center;border-radius:12px;border:1px solid rgba(112,216,239,.46);color:#8ee8fa;background:rgba(63,185,213,.08);font-size:.8rem;font-weight:950;box-shadow:inset 0 0 14px rgba(64,184,213,.08)}
        .role-card h3{margin:27px 0 10px;font-size:1.27rem}
        .role-card p{color:#94abb6;line-height:1.58}
        .card-link{width:fit-content;margin-top:auto;min-height:38px;padding:0 13px;border-radius:10px;border:1px solid rgba(112,216,239,.25);color:#baf3ff;background:linear-gradient(180deg,rgba(44,139,165,.13),rgba(14,51,69,.12));box-shadow:inset 0 1px 0 rgba(255,255,255,.04);font-size:.77rem;font-weight:950;position:relative;z-index:1;transition:transform .2s,border-color .2s,box-shadow .2s,background .2s}.card-link:hover{transform:translateY(-2px);border-color:#70d8ef;background:linear-gradient(180deg,rgba(67,175,202,.2),rgba(15,65,85,.18));box-shadow:0 10px 24px rgba(44,157,184,.13)}

        .guided-panel{scroll-margin-top:28px;display:grid;grid-template-columns:82px minmax(0,1fr) auto;gap:24px;align-items:center;margin-top:28px;padding:28px;border:1px solid rgba(134,111,239,.28);border-radius:24px;background:radial-gradient(circle at 0 50%,rgba(116,83,235,.15),transparent 36%),linear-gradient(145deg,rgba(24,24,55,.92),rgba(8,19,34,.94))}
        .guided-orb{width:68px;height:68px;display:grid;place-items:center;border-radius:999px;border:1px solid #a38cff;color:#d7ccff;background:rgba(123,91,233,.12);box-shadow:0 0 28px rgba(123,91,233,.18);font-size:1.6rem;font-weight:950}
        .guided-panel h2{margin:8px 0;font-size:1.72rem}
        .guided-panel p{margin:0;color:#aeb7cb;line-height:1.6}

        .requirements-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
        .requirement-card{min-height:280px;padding:22px;display:flex;flex-direction:column;border:1px solid rgba(103,194,220,.16);border-radius:22px;background:linear-gradient(145deg,rgba(13,37,53,.88),rgba(6,21,34,.92))}
        .requirement-top{display:flex;align-items:center;justify-content:space-between;gap:12px;color:#628796;font-size:.72rem;font-weight:900}
        .status-pill{padding:7px 9px;border-radius:999px;font-size:.62rem;font-weight:950;letter-spacing:.08em;text-transform:uppercase}
        .status-pill.available{color:#91edc4;background:rgba(45,163,113,.12);border:1px solid rgba(77,205,146,.22)}
        .status-pill.expanding{color:#9ee9f7;background:rgba(49,170,201,.1);border:1px solid rgba(92,210,236,.2)}
        .status-pill.planned{color:#d0bd8e;background:rgba(164,121,36,.09);border:1px solid rgba(218,175,84,.18)}
        .requirement-card h3{margin:34px 0 11px;font-size:1.35rem}
        .requirement-card p{color:#94abb6;line-height:1.6}
        .roadmap-note{margin-top:16px;padding:18px 20px;border:1px solid rgba(218,175,84,.2);border-radius:16px;background:rgba(164,121,36,.06)}
        .roadmap-note span{color:#d6b967;font-size:.67rem;font-weight:950;letter-spacing:.11em}
        .roadmap-note p{margin:7px 0 0;color:#b9ad8e;line-height:1.55}

        .progress-map{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
        .progress-map article{min-height:220px;padding:21px;position:relative;border:1px solid rgba(103,194,220,.15);border-radius:20px;background:linear-gradient(145deg,rgba(12,34,49,.84),rgba(6,21,34,.9))}
        .progress-number{width:42px;height:42px;display:grid;place-items:center;border-radius:999px;border:1px solid rgba(112,216,239,.42);color:#8fe7f8;background:rgba(58,177,207,.07);font-size:.75rem;font-weight:950}
        .progress-map h3{margin:25px 0 9px;font-size:1.2rem}
        .progress-map p{color:#94abb6;line-height:1.55}
        .progress-map i{position:absolute;right:-11px;top:50%;color:#6fd8ef;font-style:normal;z-index:2}

        .split-section{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;padding-top:86px}
        .split-section>article{padding:30px;border-radius:25px;border:1px solid rgba(103,194,220,.17);background:linear-gradient(145deg,rgba(13,37,53,.9),rgba(6,21,34,.94))}
        .split-section>article>p{color:#a8bdc7;line-height:1.7}
        .source-row{padding:17px 0;border-top:1px solid rgba(106,182,203,.13)}
        .source-row p{margin:6px 0 0;color:#97aeb8;line-height:1.55}
        .difference-chain{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:25px}
        .difference-chain span{display:flex;align-items:center;gap:11px;min-height:48px;padding:0 13px;border-radius:12px;background:rgba(255,255,255,.03);color:#cce3eb;font-size:.85rem}
        .difference-chain b{color:#69d4ec;font-size:.68rem}

        .filter-panel{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(320px,.8fr);gap:20px;padding:22px;border:1px solid rgba(103,194,220,.17);border-radius:20px;background:rgba(7,24,37,.84)}
        .filter-panel label>span,.filter-label{display:block;margin-bottom:9px;color:#85a7b5;font-size:.7rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
        .filter-panel input{width:100%;min-height:48px;padding:0 16px;border-radius:12px;border:1px solid rgba(101,190,215,.24);outline:none;color:white;background:rgba(2,12,20,.7);transition:.2s}
        .filter-panel input:focus{border-color:#70d8ef;box-shadow:0 0 0 3px rgba(112,216,239,.08)}
        .filter-row{display:flex;flex-wrap:wrap;gap:8px}
        .filter-row button,.empty-state button{min-height:42px;padding:0 14px;border-radius:10px;border:1px solid rgba(103,194,220,.2);color:#a9c8d3;background:rgba(255,255,255,.02);cursor:pointer;transition:.2s}
        .filter-row button:hover,.filter-row button.selected,.empty-state button:hover{color:#031019;background:#79dff3;border-color:#79dff3;box-shadow:0 10px 24px rgba(61,189,218,.18)}

        .results-meta{display:flex;justify-content:space-between;gap:20px;margin:16px 2px;color:#7f9aa6;font-size:.8rem}
        .results-meta strong{color:#d9eff6}
        .pathway-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
        .pathway-card{padding:24px;border:1px solid rgba(103,194,220,.16);border-radius:22px;background:linear-gradient(145deg,rgba(13,37,53,.9),rgba(6,21,34,.94));box-shadow:0 18px 50px rgba(0,0,0,.16)}
        .card-topline{display:flex;align-items:center;justify-content:space-between;gap:12px;color:#a8c0ca;font-size:.77rem;font-weight:900}
        .state-badge{padding:7px 9px;border-radius:999px;font-size:.6rem;letter-spacing:.07em}
        .state-badge.ready{color:#8ff0c6;border:1px solid rgba(76,215,151,.25);background:rgba(45,163,113,.1)}
        .state-badge.gap{color:#ffd17b;border:1px solid rgba(235,178,69,.25);background:rgba(174,113,23,.1)}
        .state-badge.review{color:#d6b9ff;border:1px solid rgba(167,123,236,.26);background:rgba(111,71,178,.1)}
        .pathway-id{display:block;margin-top:14px;color:#5e8999;font-size:.68rem;font-weight:900;letter-spacing:.06em}
        .pathway-card h3{margin:8px 0 6px;font-size:1.55rem}
        .role-label{margin:0 0 14px;color:#71d8ee;font-size:.78rem;font-weight:900}
        .description{color:#a4b9c3;line-height:1.65}
        .scope-box{margin-top:18px;padding:16px;border-radius:14px;border:1px solid rgba(112,216,239,.13);background:rgba(255,255,255,.02)}
        .scope-box>span,.two-column>div>span{color:#85dced;font-size:.68rem;font-weight:950;letter-spacing:.08em;text-transform:uppercase}
        ul{padding-left:18px}
        li{margin:7px 0;color:#9fb3bc;line-height:1.45}
        .two-column{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:16px}
        .two-column>div{padding:16px;border-radius:14px;background:rgba(255,255,255,.02)}
        .card-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
        .empty-state{padding:40px;text-align:center;border:1px dashed rgba(112,216,239,.25);border-radius:20px;color:#a8c1cb}

        .comparison-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
        .comparison-grid article{padding:28px;border:1px solid rgba(229,182,72,.2);border-radius:22px;background:linear-gradient(145deg,rgba(37,29,18,.72),rgba(9,20,30,.92))}
        .comparison-grid article>span{color:#d7b862;font-size:.68rem;font-weight:950;letter-spacing:.1em}
        .comparison-grid h3{margin:14px 0 18px;font-size:1.6rem}
        .comparison-grid ul{margin-bottom:24px}
        .boxed-link{width:fit-content;color:#ffe0a0;border-color:rgba(229,182,72,.3);background:rgba(135,91,14,.08)}

        .record-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
        .record-card{min-height:250px;padding:22px;display:flex;flex-direction:column;border:1px solid rgba(103,194,220,.16);border-radius:20px;background:linear-gradient(145deg,rgba(13,37,53,.88),rgba(6,21,34,.92))}
        .record-card>span,.integration-grid a>span{color:#648a99;font-size:.72rem;font-weight:950}
        .record-card h3,.integration-grid h3{margin:26px 0 10px;font-size:1.3rem}
        .record-card p,.integration-grid p{color:#94abb6;line-height:1.58}

        .integration-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
        .integration-grid a{min-height:270px;padding:22px;display:flex;flex-direction:column;border:1px solid rgba(103,194,220,.16);border-radius:20px;background:linear-gradient(145deg,rgba(13,37,53,.88),rgba(6,21,34,.92))}

        .final-cta{margin-top:100px;padding:56px 36px;text-align:center;border:1px solid rgba(229,182,72,.25);border-radius:28px;background:radial-gradient(circle at 50% 0%,rgba(255,194,73,.11),transparent 42%),linear-gradient(145deg,rgba(27,28,33,.9),rgba(6,15,25,.96));box-shadow:0 28px 70px rgba(0,0,0,.24)}
        .final-cta h2{max-width:980px;margin:16px auto}
        .final-cta>p{max-width:900px;margin:0 auto;color:#adbfc7;line-height:1.72}
        .centered{justify-content:center}

        @keyframes stars{from{transform:translate3d(0,0,0)}to{transform:translate3d(120px,150px,0)}}
        @keyframes packet{from{left:-5%;opacity:0}15%{opacity:1}85%{opacity:1}to{left:105%;opacity:0}}

        @media(max-width:1100px){
          .hero{grid-template-columns:1fr}
          .status-grid,.role-grid,.progress-map{grid-template-columns:repeat(2,minmax(0,1fr))}
          .requirements-grid,.record-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
          .integration-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
          .guided-panel{grid-template-columns:70px 1fr}
          .guided-panel .button{grid-column:1/-1}
        }

        @media(max-width:760px){
          .content-shell{width:min(100% - 22px,1380px)}
          .section-heading,.filter-panel,.split-section{grid-template-columns:1fr}
          .status-grid,.role-grid,.requirements-grid,.progress-map,.pathway-grid,.comparison-grid,.record-grid,.integration-grid{grid-template-columns:1fr}
          .guided-panel{grid-template-columns:1fr}
          .two-column{grid-template-columns:1fr}
          .results-meta{flex-direction:column}
          h1{font-size:clamp(3rem,14vw,5rem)}
          .section-heading h2,.split-section h2,.final-cta h2{font-size:clamp(2.2rem,10vw,3.6rem)}
          .action-row .button{width:100%}
          .progress-map i{display:none}
          .final-cta{padding:40px 20px}
        }

        @media(prefers-reduced-motion:reduce){
          *,*::before,*::after{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:1ms!important;scroll-behavior:auto!important}
        }
      `}</style>
    </main>
  );
}
