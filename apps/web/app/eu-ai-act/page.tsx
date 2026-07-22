"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RoleCard = {
  code: string;
  title: string;
  description: string;
  href: string;
};

type RequirementCard = {
  title: string;
  status: "Available" | "Expanding" | "Planned";
  description: string;
  href: string;
};

type ArticlePathway = {
  article: string;
  state: "READY TO MAP" | "EVIDENCE GAP" | "REVIEW REQUIRED";
  id: string;
  title: string;
  role: string;
  description: string;
  scope: string[];
  evidence: string[];
  outputs: string[];
};

const roles: RoleCard[] = [
  {
    code: "PR",
    title: "Provider",
    description:
      "You develop an AI system or general-purpose AI model and place it on the market or put it into service under your name or trademark.",
    href: "/eu-ai-act/roles/provider",
  },
  {
    code: "DE",
    title: "Deployer",
    description:
      "You use an AI system under your authority in a professional or organisational context.",
    href: "/eu-ai-act/roles/deployer",
  },
  {
    code: "IM",
    title: "Importer",
    description:
      "You place an AI system bearing the name or trademark of a provider established outside the Union on the Union market.",
    href: "/eu-ai-act/roles/importer",
  },
  {
    code: "DI",
    title: "Distributor",
    description:
      "You make an AI system available on the Union market without being the provider or importer.",
    href: "/eu-ai-act/roles/distributor",
  },
  {
    code: "PM",
    title: "Product Manufacturer",
    description:
      "You place an AI system on the market or put it into service together with your product under your own name or trademark.",
    href: "/eu-ai-act/roles/product-manufacturer",
  },
  {
    code: "AR",
    title: "Authorised Representative",
    description:
      "You are established in the Union and hold a written mandate to perform specified tasks on behalf of a provider.",
    href: "/eu-ai-act/roles/authorised-representative",
  },
  {
    code: "GP",
    title: "GPAI Provider",
    description:
      "You develop or place a general-purpose AI model on the market and need a model-level governance pathway.",
    href: "/eu-ai-act/roles/gpai-provider",
  },
  {
    code: "?",
    title: "Not Sure?",
    description:
      "Use a guided route to identify possible roles, system categories, exceptions, and evidence still needed.",
    href: "/eu-ai-act/classify",
  },
];

const requirements: RequirementCard[] = [
  {
    title: "Risk Classification",
    status: "Expanding",
    description:
      "Determine whether a system is prohibited, high-risk, transparency-scoped, limited-risk, or outside a claimed category.",
    href: "/eu-ai-act/requirements/risk-classification",
  },
  {
    title: "Prohibited Practices",
    status: "Planned",
    description:
      "Map use cases against prohibited-practice categories, exceptions, evidence, and escalation boundaries.",
    href: "/eu-ai-act/requirements/prohibited-practices",
  },
  {
    title: "High-Risk AI Systems",
    status: "Available",
    description:
      "Explore lifecycle duties, risk management, data governance, documentation, oversight, logging, and monitoring.",
    href: "/eu-ai-act/requirements/high-risk",
  },
  {
    title: "General-Purpose AI",
    status: "Expanding",
    description:
      "Separate model-provider duties, systemic-risk pathways, technical information, copyright policy, and downstream support.",
    href: "/eu-ai-act/requirements/gpai",
  },
  {
    title: "Article 50 Transparency",
    status: "Available",
    description:
      "Map direct-interaction disclosure, synthetic-content marking, biometric notice, deepfakes, and public-interest text.",
    href: "#article-50",
  },
  {
    title: "Conformity Assessment",
    status: "Planned",
    description:
      "Preserve the selected assessment route, evidence package, reviewers, findings, corrections, and resulting standing.",
    href: "/eu-ai-act/requirements/conformity-assessment",
  },
  {
    title: "Post-Market Monitoring",
    status: "Planned",
    description:
      "Govern continuing performance, incidents, material changes, corrective action, and evidence validity after deployment.",
    href: "/eu-ai-act/requirements/post-market-monitoring",
  },
  {
    title: "Incident Reporting",
    status: "Planned",
    description:
      "Create bounded routes for detection, classification, chronology, notification, correction, and preserved outcome.",
    href: "/eu-ai-act/requirements/incident-reporting",
  },
  {
    title: "Human Oversight",
    status: "Expanding",
    description:
      "Define accountable human authority, intervention capability, escalation, competence, and override boundaries.",
    href: "/eu-ai-act/requirements/human-oversight",
  },
  {
    title: "Technical Documentation",
    status: "Planned",
    description:
      "Bind system identity, intended purpose, architecture, data, testing, limits, versions, changes, and evidence ownership.",
    href: "/eu-ai-act/requirements/technical-documentation",
  },
  {
    title: "Fundamental Rights Impact Assessment",
    status: "Available",
    description:
      "Structure affected-person context, risks, safeguards, governance decisions, review, and retained limitations.",
    href: "/eu-ai-act/requirements/fria",
  },
  {
    title: "Recordkeeping and Logs",
    status: "Expanding",
    description:
      "Preserve identity, chronology, provenance, access, decisions, interventions, changes, and outcomes.",
    href: "/eu-ai-act/requirements/recordkeeping",
  },
];

const pathways: ArticlePathway[] = [
  {
    article: "Article 50(1)",
    state: "READY TO MAP",
    id: "TA-14-EU-AIA-50-1",
    title: "Direct AI interaction disclosure",
    role: "Provider",
    description:
      "Map whether a system interacts directly with natural persons and whether the disclosure design clearly informs them that they are interacting with AI.",
    scope: [
      "Interactive AI systems",
      "Chatbots and conversational systems",
      "Direct user-facing AI interfaces",
    ],
    evidence: [
      "Intended-purpose statement",
      "User-interface captures",
      "Disclosure timing and wording",
      "Exception analysis",
      "Version and deployment record",
    ],
    outputs: [
      "Applicability record",
      "Disclosure evidence map",
      "Gap and exception record",
      "Review-ready route package",
    ],
  },
  {
    article: "Article 50(2)",
    state: "EVIDENCE GAP",
    id: "TA-14-EU-AIA-50-2",
    title: "Machine-readable marking and detectability",
    role: "Provider",
    description:
      "Preserve how synthetic or manipulated audio, image, video, and text outputs are marked in a machine-readable format and made detectable where technically feasible.",
    scope: [
      "Generative AI systems",
      "Synthetic media systems",
      "AI-generated or manipulated content",
    ],
    evidence: [
      "Marking architecture",
      "Detection testing",
      "Interoperability evidence",
      "Robustness evidence",
      "Technical-feasibility determination",
    ],
    outputs: [
      "Marking implementation record",
      "Detectability test record",
      "Technical limitation record",
      "Provider evidence package",
    ],
  },
  {
    article: "Article 50(3)",
    state: "REVIEW REQUIRED",
    id: "TA-14-EU-AIA-50-3",
    title: "Emotion recognition and biometric categorisation notice",
    role: "Provider or Deployer",
    description:
      "Map notice obligations where natural persons are exposed to emotion-recognition or biometric-categorisation systems, subject to applicable exceptions.",
    scope: [
      "Emotion-recognition systems",
      "Biometric-categorisation systems",
      "Workplace or public-facing deployments",
    ],
    evidence: [
      "System classification",
      "Deployment context",
      "Notice design",
      "Exception analysis",
      "Affected-person pathway",
    ],
    outputs: [
      "Applicability determination",
      "Notice implementation record",
      "Exception and limitation record",
      "Deployment evidence package",
    ],
  },
  {
    article: "Article 50(4)",
    state: "READY TO MAP",
    id: "TA-14-EU-AIA-50-4",
    title: "Deepfake and public-interest text disclosure",
    role: "Deployer",
    description:
      "Map deployer-side disclosure for deepfakes and certain AI-generated or manipulated text published to inform the public on matters of public interest.",
    scope: [
      "Deepfakes",
      "AI-generated public-interest text",
      "Professionally deployed synthetic media",
    ],
    evidence: [
      "Content classification",
      "Editorial-control record",
      "Disclosure wording and placement",
      "Publication chronology",
      "Exception analysis",
    ],
    outputs: [
      "Deployer disclosure record",
      "Editorial-control determination",
      "Publication evidence package",
      "Exception and boundary record",
    ],
  },
];

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

const connectedPathways = [
  ["01", "AI Governance Registry", "Preserve governance identity, establishment date, versions, claims, non-claims, evidence, and stewardship.", "/registry"],
  ["02", "Governance Routes", "Convert obligations into inspectable pathways with inputs, gates, evidence, outputs, and explicit failure states.", "/workspace/routes"],
  ["03", "Governed Records", "Preserve applicability, evidence, review, disclosure, change, and outcome records.", "/workspace/governed-records"],
  ["04", "Independent Review", "Discover professionals through declared expertise, evidence signals, artifacts, and visible limitations.", "/marketplace"],
  ["05", "Post or Find Work", "Create bounded opportunities for gap analysis, evidence mapping, route review, and transparency implementation.", "/post-a-need"],
];

export default function EuAiActPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filteredPathways = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pathways.filter((pathway) => {
      const roleMatch =
        roleFilter === "All" ||
        pathway.role === roleFilter ||
        (roleFilter === "Provider or Deployer" &&
          pathway.role === "Provider or Deployer");

      const searchMatch =
        !query ||
        [
          pathway.article,
          pathway.state,
          pathway.id,
          pathway.title,
          pathway.role,
          pathway.description,
          ...pathway.scope,
          ...pathway.evidence,
          ...pathway.outputs,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return roleMatch && searchMatch;
    });
  }, [roleFilter, search]);

  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="orb orbOne" />
      <div className="orb orbTwo" />

      <header className="topbar shell">
        <Link href="/" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>AI Governance Exchange</strong>
            <small>No admissible evidence. No admissible execution.</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Exchange</Link>
          <Link href="/workspace">Workspace</Link>
          <Link href="/eu-ai-act" className="active">EU AI Act</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/workspace/governed-records">Records</Link>
          <Link href="/workspace/verification">Verification</Link>
          <Link className="navCta" href="/post-a-need">Post a Need</Link>
        </nav>
      </header>

      <section className="breadcrumb shell">
        <Link href="/">TA-14 AI Governance Exchange</Link>
        <span>/</span>
        <strong>EU AI Act</strong>
      </section>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">EU AI ACT GOVERNANCE WORKSPACE</p>
          <h1>Turn regulatory obligations into inspectable evidence routes.</h1>
          <p className="lead">
            The EU AI Act does not become governable merely because an organisation has a policy,
            checklist, legal memo, or dashboard. TA-14 separates applicability, evidence,
            determination, review, commitment, execution, and preserved outcome so each claimed
            compliance pathway can be inspected under scrutiny.
          </p>

          <div className="heroActions">
            <a className="primaryButton" href="#article-50">Open Article 50 Workspace <span>→</span></a>
            <Link className="secondaryButton" href="/eu-ai-act/classify">Classify My Role or System</Link>
          </div>

          <div className="heroLinks">
            <Link href="/workspace/routes">Browse governance routes <span>↗</span></Link>
            <Link href="/marketplace">Find an independent reviewer <span>↗</span></Link>
          </div>
        </div>

        <div className="heroPanel">
          <div className="dateCard mainDate">
            <span>ARTICLE 50 APPLICATION DATE</span>
            <strong>2 August 2026</strong>
            <p>Transparency obligations for providers and deployers of certain AI systems begin to apply.</p>
          </div>

          <div className="dateCard">
            <span>INITIAL CODE SIGNATORY LIST</span>
            <strong>27 July 2026 · 18:00 CEST</strong>
            <p>Submission deadline for inclusion in the initial public list of Code of Practice signatories.</p>
          </div>

          <div className="legalBoundary">
            <strong>This workspace does not provide legal advice or certify compliance.</strong>
            <p>It structures obligations, evidence, gaps, review routes, decisions, and records.</p>
          </div>
        </div>
      </section>

      <section className="snapshot shell">
        <article>
          <span>Regulation</span>
          <strong>EU 2024/1689</strong>
          <p>Risk-based obligations for AI systems, models, providers, deployers, and other actors.</p>
        </article>
        <article>
          <span>Current focus</span>
          <strong>Article 50</strong>
          <p>Interaction disclosure, marking, detectability, deepfakes, and public-interest text.</p>
        </article>
        <article>
          <span>Code status</span>
          <strong className="statusValue blue">VOLUNTARY</strong>
          <p>Signing can support a compliance pathway but is not conclusive proof of compliance.</p>
        </article>
        <article>
          <span>Alternative route</span>
          <strong className="statusValue green">PERMITTED</strong>
          <p>Non-signatories remain responsible for demonstrating adequate alternative measures.</p>
        </article>
      </section>

      <section className="section shell">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">ROLE NAVIGATOR</p>
            <h2>Begin with the role you actually hold.</h2>
            <p>Different actors can carry different obligations for the same system or model. Choose the closest role to open a bounded pathway.</p>
          </div>
          <Link className="sectionButton" href="/eu-ai-act/classify">Start Guided Classification <span>→</span></Link>
        </div>

        <div className="roleGrid">
          {roles.map((role) => (
            <article className="roleCard" key={role.title}>
              <span className="roleCode">{role.code}</span>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
              <Link className="cardButton" href={role.href}>Open role pathway <span>→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="guided shell">
        <div>
          <p className="eyebrow">GUIDED CLASSIFICATION</p>
          <h2>I do not know whether my system is high-risk—or which role applies.</h2>
          <p>Walk through a bounded sequence of questions that separates declared facts, unresolved facts, possible classifications, exceptions, and evidence still needed.</p>
        </div>
        <Link className="primaryButton" href="/eu-ai-act/classify">Start Guided Classification <span>→</span></Link>
      </section>

      <section className="section shell">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">REQUIREMENTS EXPLORER</p>
            <h2>Open the Act by governance problem—not by guesswork.</h2>
            <p>Each destination preserves the legal source, actor, applicability basis, evidence expectations, unresolved questions, review route, and governed outputs.</p>
          </div>
        </div>

        <div className="requirementsGrid">
          {requirements.map((item) => (
            <article className="requirementCard" key={item.title}>
              <div className="cardTopline">
                <span className={`statusBadge ${item.status.toLowerCase()}`}>{item.status}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link className="cardButton" href={item.href}>Explore requirement <span>→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="progressSection shell">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">GOVERNANCE PROGRESS MAP</p>
            <h2>Move from an uncertain system description to a verifiable governed record.</h2>
          </div>
        </div>

        <div className="progressGrid">
          {progress.map(([number, title, description], index) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              {index < progress.length - 1 && <i>→</i>}
            </article>
          ))}
        </div>
      </section>

      <section className="splitSection shell">
        <div>
          <p className="eyebrow">SOURCE-BOUND GOVERNANCE</p>
          <h2>The platform must point back to the controlling source.</h2>
        </div>
        <div className="sourceGrid">
          <article><span>Official Article</span><p>Each requirement route should identify the controlling article and preserve the exact source version used for the determination.</p></article>
          <article><span>Relevant Recitals</span><p>Recitals may provide context but should remain distinguishable from binding operative provisions.</p></article>
          <article><span>Official Guidance</span><p>Commission, AI Office, Board, standards, and authority guidance should be dated, attributed, and never silently substituted for the Regulation.</p></article>
          <article><span>TA-14 Boundary</span><p>TA-14 structures governance routes and evidence. It does not replace the official text, competent legal advice, conformity assessment, or regulator judgment.</p></article>
        </div>
      </section>

      <section className="difference shell">
        <div>
          <p className="eyebrow">THE TA-14 DIFFERENCE</p>
          <h2>Do not collapse the law, the evidence, and the conclusion into one layer.</h2>
          <p>A regulation states obligations. An organisation declares how those obligations apply. Evidence supports that declaration. Review tests the evidence and reasoning. Only after those layers remain separate can the route become inspectable.</p>
        </div>
        <div className="differenceFlow">
          {[
            ["01", "Obligation", "What the applicable legal text requires."],
            ["02", "Applicability", "Why the organisation, role, system, and use case are in or out."],
            ["03", "Evidence", "What proves the claimed implementation actually exists."],
            ["04", "Determination", "A bounded conclusion tied to stated evidence and rules."],
            ["05", "Review", "Independent challenge, correction, escalation, or confirmation."],
            ["06", "Record", "A dated, attributable, versioned preservation of the route."],
          ].map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="articleWorkspace shell" id="article-50">
        <div className="workspaceHeader">
          <div>
            <p className="eyebrow">ARTICLE 50 TRANSPARENCY WORKSPACE</p>
            <h2>Map the obligation before claiming the outcome.</h2>
            <p>These demonstration pathways separate provider and deployer duties, identify evidence dependencies, expose missing proof, and define review-ready outputs.</p>
          </div>
          <div className="workspaceBadge">4 pathways</div>
        </div>

        <div className="workspaceControls">
          <label>
            <span>Search pathways</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search obligation, role, evidence, output, or pathway ID" />
          </label>
          <label>
            <span>Role</span>
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option>All</option>
              <option>Provider</option>
              <option>Deployer</option>
              <option>Provider or Deployer</option>
            </select>
          </label>
        </div>

        <div className="demoNotice">No backend evidence submission or legal determination is connected yet.</div>

        <div className="pathwayGrid">
          {filteredPathways.map((pathway) => (
            <article className="pathwayCard" key={pathway.id}>
              <div className="pathwayTopline">
                <span className="articleLabel">{pathway.article}</span>
                <span className={`stateBadge ${pathway.state.toLowerCase().replaceAll(" ", "-")}`}>{pathway.state}</span>
              </div>
              <span className="pathwayId">{pathway.id}</span>
              <h3>{pathway.title}</h3>
              <span className="rolePill">{pathway.role}</span>
              <p className="pathwayDescription">{pathway.description}</p>

              <div className="pathwayColumns">
                <div>
                  <span className="columnLabel">Potential scope</span>
                  <ul>{pathway.scope.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div>
                  <span className="columnLabel">Evidence to preserve</span>
                  <ul>{pathway.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div>
                  <span className="columnLabel">Governed outputs</span>
                  <ul>{pathway.outputs.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </div>

              <div className="pathwayActions">
                <Link className="primarySmall" href={`/workspace/routes/new?pathway=${pathway.id}`}>Open route workspace <span>→</span></Link>
                <Link className="secondarySmall" href="/marketplace">Find reviewer</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="codePathway shell">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">CODE OF PRACTICE PATHWAY</p>
            <h2>Signing the Code and complying with Article 50 are not the same claim.</h2>
            <p>The Code of Practice is a voluntary tool for demonstrating compliance with specified transparency obligations. Adherence can create a more predictable route, but it is not conclusive evidence of compliance.</p>
          </div>
        </div>

        <div className="routeChoiceGrid">
          <article>
            <span className="choiceLabel blue">SIGNATORY ROUTE</span>
            <h3>Adhere to the Code</h3>
            <ul>
              <li>Identify the exact commitments that apply.</li>
              <li>Bind implementation evidence to each commitment.</li>
              <li>Preserve testing, exceptions, limitations, and updates.</li>
              <li>Demonstrate continuing adherence rather than one-time signature.</li>
            </ul>
            <Link className="cardButton" href="/eu-ai-act/code/signatory">Open signatory route <span>→</span></Link>
          </article>
          <article>
            <span className="choiceLabel green">ALTERNATIVE ROUTE</span>
            <h3>Use other adequate measures</h3>
            <ul>
              <li>Document why the selected measures satisfy Article 50.</li>
              <li>Map differences from the Code and justify those differences.</li>
              <li>Prepare evidence for competent-authority information requests.</li>
              <li>Preserve gap analyses, testing, and technical limitations.</li>
            </ul>
            <Link className="cardButton" href="/eu-ai-act/code/alternative">Open alternative route <span>→</span></Link>
          </article>
        </div>
      </section>

      <section className="recordsSection shell">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">GOVERNED RECORD ARCHITECTURE</p>
            <h2>Every material claim should become a dated, attributable record.</h2>
          </div>
          <Link className="sectionButton" href="/workspace/governed-records">Open Governed Records <span>→</span></Link>
        </div>

        <div className="recordsGrid">
          {[
            ["Applicability Record", "Preserves actor, role, system, use case, jurisdiction, scope, exceptions, and the basis for inclusion or exclusion."],
            ["Evidence Map", "Binds each obligation or commitment to documents, technical artifacts, tests, owners, versions, and unresolved gaps."],
            ["Transparency Implementation Record", "Preserves marking, notice, disclosure, placement, timing, detectability, and deployment state."],
            ["Independent Review Record", "Preserves reviewer identity, scope, evidence reviewed, findings, objections, corrections, and limitations."],
            ["Change Record", "Shows what changed, when, why, by whom, and whether prior evidence remains valid."],
            ["Outcome Record", "Preserves what was approved, held, denied, escalated, superseded, withdrawn, or left unresolved."],
          ].map(([title, description], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <Link href="/workspace/governed-records/builder" className="recordButton">Create record <span>→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="connected shell">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">CONNECTED EXCHANGE PATHWAYS</p>
            <h2>The EU AI Act workspace should not become another isolated compliance page.</h2>
          </div>
        </div>

        <div className="connectedGrid">
          {connectedPathways.map(([number, title, description, href]) => (
            <Link key={number} href={href} className="connectedCard">
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <b>Open pathway →</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="finalCta shell">
        <p className="eyebrow">NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</p>
        <h2>The deadline may start the obligation. It does not complete the evidence chain.</h2>
        <p>The TA-14 EU AI Act workspace is designed to make each regulatory pathway inspectable: what applies, why it applies, what evidence exists, what remains missing, who reviewed it, what changed, and what decision the evidence can actually support.</p>
        <div className="finalActions">
          <a className="primaryButton" href="#article-50">Explore Article 50 <span>→</span></a>
          <Link className="secondaryButton" href="/marketplace">Open Marketplace</Link>
        </div>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <span>No admissible evidence. No admissible execution.</span>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; background: #020a12; }
        :global(body) {
          margin: 0;
          color: #edf8ff;
          background:
            radial-gradient(circle at 12% 8%, rgba(45, 167, 219, .12), transparent 27%),
            radial-gradient(circle at 84% 22%, rgba(33, 104, 177, .12), transparent 30%),
            linear-gradient(180deg, #020913 0%, #061522 44%, #04101a 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        main { position: relative; min-height: 100vh; overflow: hidden; isolation: isolate; }
        .shell { width: min(1320px, calc(100% - 40px)); margin-inline: auto; position: relative; z-index: 2; }
        .stars { position: fixed; inset: -12%; z-index: -4; pointer-events: none; opacity: .28; }
        .starsOne { background-image: radial-gradient(circle, rgba(255,255,255,.8) 0 1px, transparent 1.4px); background-size: 102px 102px; animation: drift 42s linear infinite; }
        .starsTwo { background-image: radial-gradient(circle, rgba(88,207,255,.7) 0 1px, transparent 1.4px); background-size: 168px 168px; background-position: 52px 71px; animation: drift 58s linear infinite reverse; }
        .orb { position: fixed; z-index: -3; width: 520px; height: 520px; border-radius: 999px; filter: blur(120px); opacity: .11; animation: floatGlow 14s ease-in-out infinite alternate; }
        .orbOne { left: -190px; top: -180px; background: #19bfea; }
        .orbTwo { right: -210px; top: 42%; background: #1b66d1; animation-delay: -6s; }
        .topbar { min-height: 86px; display: flex; align-items: center; justify-content: space-between; gap: 26px; border-bottom: 1px solid rgba(120,195,225,.13); }
        .brand { display: flex; align-items: center; gap: 12px; color: white; text-decoration: none; }
        .brandMark { width: 66px; height: 40px; border-radius: 999px; display: grid; place-items: center; background: linear-gradient(135deg,#63d8ff,#d6f7ff); color: #03111b; font-size: 13px; font-weight: 950; letter-spacing: .04em; }
        .brand > span:last-child { display: flex; flex-direction: column; }
        .brand strong { font-size: 15px; }
        .brand small { margin-top: 2px; color: #7f9bab; font-size: 11px; }
        nav { display: flex; align-items: center; gap: 20px; }
        nav a { color: #9bb4c4; text-decoration: none; font-size: 13px; font-weight: 750; }
        nav a.active { color: #ecfbff; }
        nav .navCta { min-height: 40px; padding: 0 14px; display: inline-flex; align-items: center; border-radius: 11px; color: #03111b; background: linear-gradient(135deg,#5fd6ff,#c9f4ff); }
        .breadcrumb { min-height: 64px; display: flex; align-items: center; gap: 10px; color: #6e8a9b; font-size: 13px; }
        .breadcrumb a { color: #8da8b8; text-decoration: none; }
        .breadcrumb strong { color: #d8eaf3; }
        .hero { display: grid; grid-template-columns: 1.1fr .9fr; gap: 54px; align-items: center; padding: 66px 0 76px; }
        .eyebrow { margin: 0; color: #6ddfff; font-size: 11px; font-weight: 950; letter-spacing: .18em; }
        h1 { max-width: 900px; margin: 18px 0 24px; font-size: clamp(54px,7vw,94px); line-height: .96; letter-spacing: -.065em; }
        .lead { max-width: 830px; margin: 0; color: #a5bbc8; font-size: 18px; line-height: 1.72; }
        .heroActions,.finalActions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
        .primaryButton,.secondaryButton,.sectionButton { min-height: 54px; display: inline-flex; align-items: center; justify-content: center; gap: 22px; padding: 0 20px; border-radius: 14px; text-decoration: none; font-weight: 900; }
        .primaryButton { color: #021019; background: linear-gradient(135deg,#5ad8ff,#d1f7ff); box-shadow: 0 14px 40px rgba(65,196,240,.18); }
        .secondaryButton { color: #dff6ff; border: 1px solid rgba(108,207,239,.26); background: rgba(55,137,166,.07); }
        .heroLinks { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 18px; }
        .heroLinks a { color: #80cae5; text-decoration: none; font-size: 13px; font-weight: 800; }
        .heroPanel { display: grid; gap: 14px; }
        .dateCard,.legalBoundary { padding: 24px; border-radius: 20px; border: 1px solid rgba(105,190,222,.18); background: linear-gradient(180deg,rgba(12,37,53,.88),rgba(7,22,34,.94)); box-shadow: 0 20px 50px rgba(0,0,0,.18); }
        .dateCard.mainDate { border-color: rgba(94,220,255,.4); background: radial-gradient(circle at 90% 10%,rgba(56,192,237,.12),transparent 35%),linear-gradient(180deg,rgba(13,43,61,.94),rgba(6,22,34,.98)); }
        .dateCard span,.legalBoundary strong { color: #71dcff; font-size: 11px; font-weight: 950; letter-spacing: .12em; }
        .dateCard strong { display: block; margin-top: 10px; font-size: 28px; letter-spacing: -.035em; }
        .dateCard p,.legalBoundary p { margin: 10px 0 0; color: #91aab9; line-height: 1.56; }
        .legalBoundary { border-color: rgba(255,197,100,.2); background: rgba(134,87,27,.05); }
        .legalBoundary strong { color: #ffd17b; }
        .snapshot { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 14px; padding-bottom: 74px; }
        .snapshot article { min-height: 190px; padding: 24px; border-radius: 20px; border: 1px solid rgba(111,170,197,.16); background: rgba(8,25,38,.78); }
        .snapshot article > span { color: #748d9d; font-size: 11px; font-weight: 900; letter-spacing: .11em; text-transform: uppercase; }
        .snapshot strong { display: block; margin-top: 14px; font-size: 25px; }
        .snapshot p { color: #93aab8; line-height: 1.55; }
        .statusValue { font-size: 17px !important; letter-spacing: .06em; }
        .statusValue.blue { color: #72ddff; }
        .statusValue.green { color: #77e0af; }
        .section,.progressSection,.splitSection,.difference,.articleWorkspace,.codePathway,.recordsSection,.connected,.guided,.finalCta { margin-top: 22px; padding: 48px; border: 1px solid rgba(109,170,199,.16); border-radius: 28px; background: linear-gradient(180deg,rgba(9,27,42,.91),rgba(5,17,27,.96)); box-shadow: 0 26px 70px rgba(0,0,0,.22); }
        .sectionHeader,.workspaceHeader { display: flex; justify-content: space-between; align-items: end; gap: 32px; }
        .sectionHeader > div:first-child,.workspaceHeader > div:first-child { max-width: 880px; }
        .sectionHeader h2,.guided h2,.splitSection h2,.difference h2,.workspaceHeader h2,.finalCta h2 { margin: 14px 0 16px; font-size: clamp(36px,5vw,60px); line-height: 1.03; letter-spacing: -.05em; }
        .sectionHeader p:not(.eyebrow),.guided p,.splitSection p,.difference > div:first-child > p:not(.eyebrow),.workspaceHeader p,.finalCta > p:not(.eyebrow) { color: #9eb4c1; line-height: 1.68; }
        .sectionButton { color: #dff8ff; border: 1px solid rgba(102,209,243,.28); background: rgba(65,167,201,.08); white-space: nowrap; }
        .roleGrid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 14px; margin-top: 30px; }
        .roleCard,.requirementCard { position: relative; min-height: 300px; padding: 24px; border-radius: 20px; border: 1px solid rgba(104,169,197,.15); background: radial-gradient(circle at 90% 0%,rgba(58,178,220,.07),transparent 34%),rgba(6,20,32,.85); display: flex; flex-direction: column; transition: transform .18s ease,border-color .18s ease,box-shadow .18s ease; }
        .roleCard:hover,.requirementCard:hover { transform: translateY(-4px); border-color: rgba(93,216,255,.4); box-shadow: 0 18px 44px rgba(18,110,146,.14); }
        .roleCode { width: 50px; height: 50px; border-radius: 14px; display: grid; place-items: center; color: #05141e; background: linear-gradient(135deg,#58d7ff,#bceeff); font-weight: 950; }
        .roleCard h3,.requirementCard h3 { margin: 20px 0 10px; font-size: 24px; letter-spacing: -.03em; }
        .roleCard p,.requirementCard p { margin: 0; color: #91a8b6; line-height: 1.58; }
        .cardButton,.recordButton { min-height: 46px; margin-top: auto; padding: 0 14px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; gap: 16px; color: #9ee8ff; background: rgba(58,160,198,.08); border: 1px solid rgba(99,205,238,.22); text-decoration: none; font-size: 13px; font-weight: 900; }
        .guided { display: flex; justify-content: space-between; align-items: center; gap: 40px; background: radial-gradient(circle at 85% 30%,rgba(55,181,225,.12),transparent 32%),linear-gradient(180deg,rgba(10,33,49,.94),rgba(5,19,30,.96)); }
        .guided > div { max-width: 850px; }
        .requirementsGrid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; margin-top: 30px; }
        .cardTopline { display: flex; justify-content: flex-end; }
        .statusBadge,.stateBadge,.choiceLabel { padding: 6px 9px; border-radius: 999px; font-size: 9px; font-weight: 950; letter-spacing: .1em; text-transform: uppercase; }
        .statusBadge.available { color: #8ee8bc; border: 1px solid rgba(102,222,161,.23); background: rgba(61,182,126,.08); }
        .statusBadge.expanding { color: #83d8ff; border: 1px solid rgba(102,196,239,.23); background: rgba(47,142,190,.08); }
        .statusBadge.planned { color: #c3b5ff; border: 1px solid rgba(177,145,255,.23); background: rgba(124,82,202,.08); }
        .progressGrid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 14px; margin-top: 30px; }
        .progressGrid article { position: relative; min-height: 210px; padding: 22px; border-radius: 18px; border: 1px solid rgba(104,169,197,.15); background: rgba(7,23,35,.82); }
        .progressGrid article > span { color: #6edcff; font-size: 11px; font-weight: 950; letter-spacing: .14em; }
        .progressGrid h3 { margin: 16px 0 10px; font-size: 22px; }
        .progressGrid p { margin: 0; color: #91a8b6; line-height: 1.56; }
        .progressGrid i { position: absolute; right: -11px; top: 50%; color: #4fb5d7; font-style: normal; z-index: 2; }
        .splitSection,.difference { display: grid; grid-template-columns: .78fr 1.22fr; gap: 38px; align-items: start; }
        .sourceGrid,.differenceFlow { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }
        .sourceGrid article,.differenceFlow article { padding: 22px; border-radius: 18px; border: 1px solid rgba(103,168,196,.15); background: rgba(7,22,34,.82); }
        .sourceGrid span,.differenceFlow span { color: #6ddcff; font-size: 11px; font-weight: 950; letter-spacing: .12em; text-transform: uppercase; }
        .sourceGrid p,.differenceFlow p { margin: 10px 0 0; color: #94aab7; line-height: 1.56; }
        .differenceFlow h3 { margin: 14px 0 0; font-size: 22px; }
        .workspaceBadge { padding: 10px 14px; border-radius: 999px; color: #96e6ff; border: 1px solid rgba(96,211,245,.24); background: rgba(55,157,195,.08); font-size: 12px; font-weight: 900; }
        .workspaceControls { display: grid; grid-template-columns: 1fr 260px; gap: 14px; margin-top: 30px; }
        .workspaceControls label { display: grid; gap: 8px; }
        .workspaceControls label span { color: #9db3c0; font-size: 12px; font-weight: 850; }
        input,select { width: 100%; min-height: 52px; padding: 0 14px; border-radius: 13px; border: 1px solid rgba(105,172,200,.18); background: rgba(3,14,23,.82); color: #eefaff; outline: none; font: inherit; }
        input:focus,select:focus { border-color: rgba(97,218,255,.56); box-shadow: 0 0 0 3px rgba(59,178,218,.08); }
        .demoNotice { margin-top: 14px; padding: 14px 16px; border-radius: 13px; border: 1px solid rgba(255,196,91,.18); background: rgba(151,97,24,.05); color: #d9be8e; font-size: 13px; }
        .pathwayGrid { display: grid; gap: 16px; margin-top: 20px; }
        .pathwayCard { padding: 28px; border-radius: 22px; border: 1px solid rgba(104,177,206,.18); background: radial-gradient(circle at 95% 0%,rgba(57,181,223,.08),transparent 34%),rgba(5,20,31,.9); }
        .pathwayTopline { display: flex; justify-content: space-between; gap: 14px; align-items: center; }
        .articleLabel { color: #77deff; font-weight: 950; }
        .stateBadge.ready-to-map { color: #83e2b8; border: 1px solid rgba(93,216,157,.22); background: rgba(48,170,111,.08); }
        .stateBadge.evidence-gap { color: #ffd083; border: 1px solid rgba(239,181,73,.22); background: rgba(188,123,28,.08); }
        .stateBadge.review-required { color: #c4b2ff; border: 1px solid rgba(175,144,252,.22); background: rgba(118,76,201,.08); }
        .pathwayId { display: block; margin-top: 18px; color: #718b9b; font-size: 11px; font-weight: 900; letter-spacing: .12em; }
        .pathwayCard h3 { margin: 10px 0 12px; font-size: 34px; letter-spacing: -.04em; }
        .rolePill { display: inline-flex; padding: 7px 10px; border-radius: 999px; color: #9ce7ff; background: rgba(51,155,193,.08); border: 1px solid rgba(91,200,233,.2); font-size: 11px; font-weight: 900; }
        .pathwayDescription { max-width: 950px; color: #9db2bf; line-height: 1.66; }
        .pathwayColumns { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 16px; margin-top: 24px; }
        .pathwayColumns > div { padding: 18px; border-radius: 16px; border: 1px solid rgba(104,169,197,.13); background: rgba(255,255,255,.015); }
        .columnLabel { color: #72dcff; font-size: 11px; font-weight: 950; letter-spacing: .11em; text-transform: uppercase; }
        ul { margin: 12px 0 0; padding-left: 20px; color: #aabdc8; }
        li { margin-bottom: 8px; line-height: 1.48; }
        .pathwayActions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
        .primarySmall,.secondarySmall { min-height: 44px; display: inline-flex; align-items: center; gap: 18px; padding: 0 14px; border-radius: 11px; text-decoration: none; font-size: 13px; font-weight: 900; }
        .primarySmall { color: #04111a; background: linear-gradient(135deg,#59d7ff,#c8f2ff); }
        .secondarySmall { color: #c9eefb; border: 1px solid rgba(96,205,239,.22); background: rgba(55,154,190,.06); }
        .routeChoiceGrid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; margin-top: 30px; }
        .routeChoiceGrid article { min-height: 330px; padding: 26px; border-radius: 21px; border: 1px solid rgba(106,176,205,.16); background: rgba(6,21,33,.86); display: flex; flex-direction: column; }
        .choiceLabel.blue { width: fit-content; color: #7edfff; border: 1px solid rgba(94,204,240,.22); background: rgba(53,154,194,.08); }
        .choiceLabel.green { width: fit-content; color: #88e2b5; border: 1px solid rgba(91,213,154,.22); background: rgba(47,171,107,.08); }
        .routeChoiceGrid h3 { margin: 18px 0 0; font-size: 29px; }
        .recordsGrid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; margin-top: 30px; }
        .recordsGrid article { min-height: 265px; padding: 22px; border-radius: 19px; border: 1px solid rgba(106,176,205,.15); background: rgba(6,21,33,.84); display: flex; flex-direction: column; }
        .recordsGrid article > span { color: #71dcff; font-size: 11px; font-weight: 950; letter-spacing: .14em; }
        .recordsGrid h3 { margin: 16px 0 10px; font-size: 23px; }
        .recordsGrid p { margin: 0; color: #95abb8; line-height: 1.56; }
        .recordButton { margin-top: auto; }
        .connectedGrid { display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: 14px; margin-top: 30px; }
        .connectedCard { min-height: 280px; padding: 22px; border-radius: 19px; border: 1px solid rgba(106,176,205,.15); background: rgba(6,21,33,.84); color: inherit; text-decoration: none; display: flex; flex-direction: column; transition: transform .18s ease,border-color .18s ease; }
        .connectedCard:hover { transform: translateY(-4px); border-color: rgba(94,213,250,.4); }
        .connectedCard > span { color: #71dcff; font-size: 11px; font-weight: 950; letter-spacing: .14em; }
        .connectedCard h3 { margin: 16px 0 10px; font-size: 22px; }
        .connectedCard p { margin: 0; color: #95abb8; line-height: 1.56; }
        .connectedCard b { margin-top: auto; color: #8fe6ff; font-size: 13px; }
        .finalCta { margin-top: 76px; padding: 64px 54px; text-align: center; background: radial-gradient(circle at 50% 0%,rgba(55,193,235,.16),transparent 40%),linear-gradient(180deg,rgba(10,39,55,.95),rgba(4,18,29,.98)); }
        .finalCta > p:not(.eyebrow) { max-width: 900px; margin-inline: auto; }
        .finalActions { justify-content: center; }
        footer { min-height: 120px; display: flex; align-items: center; justify-content: space-between; gap: 24px; color: #718b9b; font-size: 12px; }
        @keyframes drift { from { transform: translate3d(0,0,0); } to { transform: translate3d(100px,150px,0); } }
        @keyframes floatGlow { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(55px,38px,0) scale(1.08); } }
        @media (max-width: 1080px) {
          nav { display: none; }
          .hero,.splitSection,.difference { grid-template-columns: 1fr; }
          .snapshot,.roleGrid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .requirementsGrid,.recordsGrid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .connectedGrid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .pathwayColumns { grid-template-columns: 1fr; }
        }
        @media (max-width: 760px) {
          .shell { width: min(100% - 20px,1320px); }
          .hero { padding: 48px 0 58px; }
          .section,.progressSection,.splitSection,.difference,.articleWorkspace,.codePathway,.recordsSection,.connected,.guided,.finalCta { padding: 28px 22px; }
          .sectionHeader,.workspaceHeader,.guided { flex-direction: column; align-items: flex-start; }
          .snapshot,.roleGrid,.requirementsGrid,.progressGrid,.sourceGrid,.differenceFlow,.routeChoiceGrid,.recordsGrid,.connectedGrid,.workspaceControls { grid-template-columns: 1fr; }
          .progressGrid article i { display: none; }
          .sectionButton { width: 100%; }
          .heroActions,.finalActions { flex-direction: column; }
          .primaryButton,.secondaryButton { width: 100%; }
          footer { flex-direction: column; justify-content: center; align-items: flex-start; }
        }
      `}</style>
    </main>
  );
}
