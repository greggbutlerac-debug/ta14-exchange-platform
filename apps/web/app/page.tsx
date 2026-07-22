"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
const workspaces = [
  {
    id: "ai",
    code: "AI",
    title: "AI Governance",
    href: "/workspace/ai-governance",
    kicker: "GOVERN CONSEQUENTIAL AI EXECUTION",
    description:
      "Build, test, challenge, correct, preserve, and verify AI governance routes before consequential execution is permitted to proceed.",
    color: "#62afff",
    glow: "rgba(63, 154, 255, .56)",
    world: "aiWorld",
    features: [
      "Agents, models, tools, APIs, and automated decisions",
      "Authority, evidence, admissibility, and commit gates",
      "ALLOW, HOLD, DENY, and ESCALATE route decisions",
      "Runtime records tied to verified outcomes",
    ],
  },
  {
    id: "records",
    code: "GR",
    title: "Governed & Environmental Records",
    href: "/workspace/governed-records",
    kicker: "PRESERVE REALITY BEFORE INTERPRETATION",
    description:
      "Create, upload, preserve, and interpret governed records across environmental, atmospheric, building, hospital, HVAC, land, water, and air domains.",
    color: "#78e6b0",
    glow: "rgba(92, 224, 167, .52)",
    world: "recordsWorld",
    features: [
      "Governed, environmental, and atmospheric records",
      "Bounded interpretation with explicit limitations",
      "Separate record, determination, intervention, and outcome",
      "Attributable chronology, ownership, lineage, and exports",
    ],
  },
  {
    id: "entity",
    code: "ER",
    title: "Entity Review",
    href: "/workspace/entity-review",
    kicker: "REVIEW THE WHOLE GOVERNANCE ENTITY",
    description:
      "Submit an organization, AI system, governance architecture, program, product, implementation, or route for independent governed review.",
    color: "#dd83ff",
    glow: "rgba(199, 91, 255, .55)",
    world: "entityWorld",
    features: [
      "Organizations, systems, architectures, and programs",
      "Declared claims, non-claims, evidence, and boundaries",
      "Independent findings, objections, and corrections",
      "Visible review status and preserved outcomes",
    ],
  },
  {
    id: "eu",
    code: "EU",
    title: "European Union Artificial Intelligence Act",
    href: "/workspace/ai-governance/eu-ai-act",
    kicker: "TURN LEGAL DUTIES INTO INSPECTABLE ROUTES",
    description:
      "Translate EU AI Act roles, classifications, duties, evidence dependencies, transparency requirements, and unresolved questions into governed implementation pathways.",
    color: "#ffd15c",
    glow: "rgba(255, 196, 65, .52)",
    world: "euWorld",
    features: [
      "Actor roles, system classification, and applicability",
      "High-risk duties and Article 50 transparency",
      "Evidence routes, records, testing, and documentation",
      "Implementation boundaries without checklist theater",
    ],
  },
  {
    id: "registry",
    code: "RG",
    title: "AI Governance Registry",
    href: "/registry",
    kicker: "ESTABLISH A DATED AND ATTRIBUTABLE RECORD",
    description:
      "Register governance architectures as searchable, versioned records with preserved identity, stewardship, claims, non-claims, evidence, lineage, and status.",
    color: "#f2b95f",
    glow: "rgba(236, 164, 57, .52)",
    world: "registryWorld",
    features: [
      "Governance identity and registry identifier",
      "Claims, non-claims, scope, and limitations",
      "Evidence, publications, repositories, and demonstrations",
      "Version history, lineage, ownership, and status",
    ],
  },
];

const chain = [
  ["Reality", "◉"],
  ["Record", "▤"],
  ["Continuity", "∞"],
  ["Admissibility", "⬡"],
  ["Binding", "⌁"],
  ["Commit", "◆"],
  ["Execution", "▷"],
  ["Outcome", "♛"],
];

const exchangeCapabilities = [
  ["01", "Build governance routes", "Translate consequential decisions into inspectable inputs, authorities, evidence gates, failure states, and governed outcomes."],
  ["02", "Preserve governed records", "Keep the source record separate from interpretation, determination, intervention, and outcome so the evidence remains admissible."],
  ["03", "Request independent review", "Bring organizations, systems, architectures, records, or routes into a bounded review process with visible findings and limitations."],
  ["04", "Verify execution", "Test whether the preserved route still corresponds to the implementation, authority, evidence, execution, and claimed result."],
];

const marketplaceItems = [
  ["Post a governance need", "Describe the system, record, route, evidence gap, or review scope you need help with.", "/marketplace/post"],
  ["Find governance work", "Discover bounded opportunities for evidence mapping, route review, implementation, and verification.", "/marketplace"],
  ["Discover reviewers", "Find professionals through declared expertise, visible artifacts, evidence signals, and stated limitations.", "/marketplace"],
  ["Build review reputation", "Preserve completed scopes, findings, outcomes, and review history instead of relying on unsupported claims.", "/marketplace"],
];

const registryFields = [
  "Governance identity and registry identifier",
  "Founder, author, steward, or organization",
  "Establishment date and registration timestamp",
  "Claims, non-claims, limitations, and scope",
  "Version history, status, ownership, and licensing",
  "Evidence, publications, repositories, demonstrations, and supporting documents",
];

const networkSteps = [
  ["Declare", "State the reviewer, scope, expertise, boundaries, conflicts, and evidence requirements."],
  ["Review", "Inspect the route, architecture, record, implementation, or entity without silently expanding the scope."],
  ["Preserve", "Retain findings, objections, corrections, limitations, and superseded versions."],
  ["Verify", "Test whether the reviewed implementation still corresponds to the evidence and claimed outcome."],
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function HomePage() {
  return (
    <main>
      <div className="cosmos" aria-hidden="true">
        <div className="nebula nebulaOne" />
        <div className="nebula nebulaTwo" />
        <div className="stars starsOne" />
        <div className="stars starsTwo" />
        <div className="stars starsThree" />
        <div className="constellation constellationOne"><i/><i/><i/><i/><i/></div>
        <div className="constellation constellationTwo"><i/><i/><i/><i/></div>
        <div className="shooting shootingOne" />
        <div className="shooting shootingTwo" />
        <div className="shooting shootingThree" />
        <div className="governedRoutes">
          <i className="route routeOne" />
          <i className="route routeTwo" />
          <i className="route routeThree" />
          <i className="route routeFour" />
        </div>
        <div className="orbitCluster orbitLeft">
          <span className="planet planetBlue" />
          <span className="planet planetGold" />
          <span className="moon moonOne" />
          <i className="orbit orbitA" />
          <i className="orbit orbitB" />
          <i className="orbit orbitC" />
        </div>
        <div className="orbitCluster orbitRight">
          <span className="planet planetGold large" />
          <span className="planet planetBlue small" />
          <span className="moon moonTwo" />
          <i className="orbit orbitA" />
          <i className="orbit orbitB" />
          <i className="orbit orbitC" />
        </div>
        <div className="burst burstOne" />
        <div className="burst burstTwo" />
        <div className="burst burstThree" />
        <div className="burst burstFour" />
        <div className="burst burstFive" />
        <div className="burst burstSix" />
        <div className="burst burstSeven" />
        <div className="ambient ambientOne" />
        <div className="ambient ambientTwo" />
        <div className="cosmicDust dustOne" />
        <div className="cosmicDust dustTwo" />
      </div>

      {/* Primary navigation is provided by the shared site header. */}

      <section className="institution shell">
        <p>TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
        <div className="institutionRule"><i/><span>THE PUBLIC ENTRANCE TO ADMISSIBLE EXECUTION</span><i/></div>
      </section>

      <section className="hero shell">
        <div className="heroSeal" aria-hidden="true">
          <span>TA-14</span>
          <i/><i/><i/>
        </div>
        <p className="eyebrow">THE GRAND EXCHANGE HALL</p>
        <h1>
          AI governance should not end with a policy. It should become an
          <em> inspectable route to execution.</em>
        </h1>
        <p className="heroLead">
          The TA-14 AI Governance Exchange is a free governance playground and institutional workspace for building, testing, preserving, reviewing, and verifying consequential AI routes. It separates the law, the claim, the evidence, the determination, the commitment, the execution, and the outcome so one layer cannot silently corrupt another.
        </p>
        <div className="heroActions">
          <Link className="grandButton primary" href="/workspace">Open the Exchange <Arrow /></Link>
          <Link className="grandButton gold" href="/workspace/ai-governance/registry#foundation">Explore the TA-14 Foundation <Arrow /></Link>
          <Link className="grandButton glass" href="#five-doors">Choose a Governed Door <span>↓</span></Link>
          <Link className="grandButton glass" href="/workspace/ai-governance/eu-ai-act">Explore the EU AI Act <Arrow /></Link>
          <Link className="grandButton glass" href="/marketplace">Enter the Marketplace <Arrow /></Link>
        </div>
        <div className="heroDefinition">
          <article><span>WHAT IT IS</span><strong>A governed execution exchange</strong><p>Build and inspect the route from evidence to execution instead of trusting an unsupported conclusion.</p></article>
          <article><span>WHO IT SERVES</span><strong>Builders, deployers, reviewers, and institutions</strong><p>Use it for AI systems, governance architectures, records, organizations, environmental evidence, and regulated pathways.</p></article>
          <article><span>WHAT IT PRESERVES</span><strong>Attributable evidence and boundaries</strong><p>Keep ownership, chronology, versions, limitations, objections, decisions, and outcomes visible under scrutiny.</p></article>
        </div>
      </section>

      <section className="hall shell" id="five-doors">
        <div className="hallArchitecture" aria-hidden="true"><i/><i/><i/><i/><i/></div>
        <div className="hallGlow" aria-hidden="true" />
        <div className="sectionIntro centeredIntro">
          <p className="eyebrow">FIVE PRIMARY GOVERNANCE DESTINATIONS</p>
          <h2>Choose the institution that governs what you need to build, preserve, review, interpret, or establish.</h2>
          <p>Each doorway opens into a distinct governed institution. Their routes connect across the Exchange, but their evidence boundaries, authorities, records, and review purposes remain explicit.</p>
        </div>

        <div className="doors">
          {workspaces.map((workspace) => (
            <Link
              href={workspace.href}
              className="workspace"
              key={workspace.id}
              style={{ "--accent": workspace.color, "--accentGlow": workspace.glow } as CSSProperties}
            >
              <div className="doorStage">
                <div className="portalHalo" />
                <div className="sparkField">
                  {Array.from({ length: 14 }).map((_, index) => <i key={index} style={{ "--n": index } as CSSProperties} />)}
                </div>
                <div className="columns leftColumn"><i/><i/><i/></div>
                <div className="columns rightColumn"><i/><i/><i/></div>
                <div className="archFrame">
                  <div className="archCrown"><i className="crownLine one"/><i className="crownLine two"/><i className="crownLine three"/><span className="crownGem"/></div>
                  <div className="doorOpening">
                    <div className={`portalWorld ${workspace.world}`}>
                      <span className="worldGrid"/><span className="worldOrb orbOne"/><span className="worldOrb orbTwo"/><span className="worldOrb orbThree"/>
                      <span className="worldLine worldLineOne"/><span className="worldLine worldLineTwo"/><span className="worldLine worldLineThree"/>
                      <span className="worldParticle p1"/><span className="worldParticle p2"/><span className="worldParticle p3"/><span className="worldParticle p4"/><span className="worldParticle p5"/>
                    </div>
                    <div className="lightWithin" />
                    <div className="thresholdMessage">
                      <span>{workspace.code}</span>
                      <strong>{workspace.title}</strong>
                      <small>ENTER GOVERNED WORKSPACE</small>
                    </div>
                    <div className="doorLeaf singleDoor">
                      <div className="doorEmblem"><span>{workspace.code}</span></div>
                      <div className="doorPanels"><i/><i/><i/><i/><i/><i/></div>
                      <span className="hinge h1"/><span className="hinge h2"/><span className="hinge h3"/>
                      <span className="doorHandle" />
                      <span className="doorKeyPlate" />
                    </div>
                  </div>
                </div>
                <div className="steps"><i/><i/><i/></div>
                <div className="lightSpill" />
                <div className="floorReflection" />
              </div>

              <div className="workspaceCard">
                <span className="miniCode">{workspace.code}</span>
                <p className="workspaceKicker">{workspace.kicker}</p>
                <h3>{workspace.title}</h3>
                <p>{workspace.description}</p>
                <ul>{workspace.features.map((feature) => <li key={feature}><span>✦</span>{feature}</li>)}</ul>
                <div className="workspaceCta">Enter {workspace.title}<span>→</span></div>
              </div>
            </Link>
          ))}
        </div>
        <div className="obsidianFloor" aria-hidden="true" />
      </section>

      <section className="exchangeExplanation shell">
        <div className="sectionIntro">
          <p className="eyebrow">WHAT THE EXCHANGE ACTUALLY DOES</p>
          <h2>It converts consequential claims into routes that can be inspected.</h2>
          <p>The Exchange is not another dashboard that declares governance complete. It is the place where governance is built as a visible chain of evidence, authority, review, commitment, execution, and outcome.</p>
        </div>
        <div className="capabilityGrid">
          {exchangeCapabilities.map(([number,title,text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
        <div className="chainVault">
          <p className="bandEyebrow">THE TA-14 GOVERNING CHAIN</p>
          <div className="chain">
            {chain.map(([label, icon], index) => <div className="chainNode" key={label}><span className="chainIcon">{icon}</span><strong>{label}</strong>{index < chain.length - 1 && <i>→</i>}</div>)}
          </div>
          <p>Each link may depend on the prior link, but no link is allowed to disappear into the next. That separation is what keeps the route open to scrutiny.</p>
        </div>
      </section>

      <section className="featureSection foundationSection shell">
        <div className="foundationVault" aria-hidden="true">
          <div className="foundationHalo" />
          <div className="foundationOrbit orbitOne"><span /></div>
          <div className="foundationOrbit orbitTwo"><span /></div>
          <div className="foundationOrbit orbitThree"><span /></div>
          <div className="foundationSeal">
            <small>TA-14</small>
            <strong>FOUNDATION</strong>
            <span>ARCHITECTURE • STANDARDS • PUBLIC RECORD</span>
          </div>
          <div className="foundationStars">
            <i/><i/><i/><i/><i/><i/><i/><i/>
          </div>
        </div>

        <div className="featureCopy">
          <span className="statusFlag">FOUNDATIONAL PUBLIC RECORD ACTIVE</span>
          <p className="eyebrow">TA-14 FOUNDATION</p>
          <h2>Open the architecture from which the Exchange was built.</h2>
          <p>
            The TA-14 Foundation is the parent public record for the architecture,
            standards family, chronology, books, articles, Zenodo records, GitHub
            repositories, reference implementations, and institutional systems
            that support the TA-14 AI Governance Exchange.
          </p>

          <div className="foundationMap">
            {[
              "Foundational Architectural Registry",
              "Architecture Family",
              "Standards Family",
              "Public Timeline",
              "Books and Articles",
              "Zenodo Records",
              "GitHub Repositories",
              "Reference Implementations",
              "TA-14 AI Governance Exchange",
              "AI Governance Registry",
            ].map((item, index) => (
              <span key={item}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                {item}
              </span>
            ))}
          </div>

          <div className="foundationBoundary">
            <strong>Public architecture is not the same as certification.</strong>
            <p>
              The Foundation preserves identity, provenance, chronology,
              relationships, publications, implementations, and evidence. It
              does not convert a documented claim into independent validation,
              legal compliance, regulatory approval, or certification.
            </p>
          </div>

          <div className="featureActions">
            <Link className="grandButton gold" href="/workspace/ai-governance/registry#foundation">
              Explore the TA-14 Foundation <Arrow />
            </Link>
            <Link className="grandButton primary" href="/workspace/ai-governance/registry">
              Open the Architectural Registry <Arrow />
            </Link>
            <Link className="grandButton glass" href="/architecture">
              Browse the Architecture <Arrow />
            </Link>
            <Link className="grandButton glass" href="/workspace">
              Open the AI Governance Exchange <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="featureSection euSection shell">
        <div className="featureCopy">
          <p className="eyebrow">EU AI ACT GOVERNANCE WORKSPACE</p>
          <h2>Turn legal obligations into inspectable applicability and evidence routes.</h2>
          <p>Explore actor roles, system classification, high-risk duties, Article 50 transparency, evidence dependencies, unresolved questions, review pathways, records, and implementation boundaries without confusing a checklist with proof.</p>
          <div className="statStrip"><span><b>2 AUG 2026</b>Article 50 transparency obligations apply</span><span><b>PROVIDERS</b>Systems, models, marking, disclosure, and evidence</span><span><b>DEPLOYERS</b>Use context, notice, deepfakes, and public-interest text</span></div>
          <div className="featureActions">
            <Link className="grandButton primary" href="/workspace/ai-governance/eu-ai-act">Open EU AI Act Workspace <Arrow /></Link>
            <Link className="grandButton glass" href="/workspace/ai-governance">Open AI Governance <Arrow /></Link>
          </div>
        </div>
        <div className="euUniverse" aria-hidden="true">
          <div className="euPlanet"><span>EU</span>{Array.from({length:12}).map((_,i)=><i key={i} style={{"--i":i} as CSSProperties}/>)}</div>
          <div className="euOrbit one"/><div className="euOrbit two"/><div className="euOrbit three"/>
          <div className="articleMarkers"><span>50(1)</span><span>50(2)</span><span>50(3)</span><span>50(4)</span></div>
        </div>
      </section>

      <section className="marketplaceSection shell">
        <div className="marketplaceHeader">
          <div>
            <p className="eyebrow">THE GOVERNANCE MARKETPLACE</p>
            <h2>Find work, post needs, discover reviewers, and build visible governance reputation.</h2>
          </div>
          <Link className="grandButton gold" href="/marketplace">Open Marketplace <Arrow /></Link>
        </div>
        <div className="marketGrid">
          {marketplaceItems.map(([title,text,href],index)=><Link href={href} key={title}><span>{String(index+1).padStart(2,"0")}</span><div className="marketOrb"/><h3>{title}</h3><p>{text}</p><b>Open pathway <Arrow /></b></Link>)}
        </div>
      </section>

      <section className="featureSection networkSection shell">
        <div className="networkVisual" aria-hidden="true">
          <div className="networkCore">PRN</div>
          {Array.from({length:8}).map((_,i)=><span key={i} style={{"--i":i} as CSSProperties}/>) }
          <i className="networkRing one"/><i className="networkRing two"/><i className="networkRing three"/>
        </div>
        <div className="featureCopy">
          <p className="eyebrow">TA-14 PARTNER REVIEW NETWORK</p>
          <h2>Independent architectures remain independent. Review becomes connected.</h2>
          <p>The Partner Review Network creates bounded review lanes for specialized governance systems and professionals. It preserves each partner's identity, scope, expertise, limitations, findings, and review history while adding a second TA-14 review layer where appropriate.</p>
          <div className="networkSteps">{networkSteps.map(([title,text],i)=><article key={title}><span>{i+1}</span><div><strong>{title}</strong><p>{text}</p></div></article>)}</div>
          <div className="featureActions"><Link className="grandButton primary" href="/marketplace">Discover Review Pathways <Arrow /></Link><Link className="grandButton glass" href="/marketplace/post">Post a Review Need <Arrow /></Link></div>
        </div>
      </section>

      <section className="recordsConstellation shell">
        <div className="sectionIntro centeredIntro">
          <p className="eyebrow">RECORDS ARE NOT CONCLUSIONS</p>
          <h2>Preserve the record. Bound the interpretation. Separate the determination.</h2>
          <p>Environmental records now live inside the broader Governed Records institution. The source record remains separate from interpretation, diagnosis, determination, intervention, optimization, and outcome so the evidence can survive scrutiny.</p>
        </div>
        <div className="recordsPair">
          <article className="recordWorld green"><div className="recordVisual"><i/><i/><i/><span>GR</span></div><h3>Governed Records</h3><p>Create, upload, preserve, interpret, review, version, and export records with explicit proof boundaries.</p><Link className="polishedAction" href="/workspace/governed-records">Open Governed Records <Arrow /></Link></article>
          <article className="recordWorld blue"><div className="recordVisual atmosphere"><i/><i/><i/><span>ER</span></div><h3>Environmental Records</h3><p>Enter the environmental domain within Governed Records for atmospheric, building, hospital, HVAC, sensor, land, water, and air evidence.</p><Link className="polishedAction" href="/workspace/governed-records/environmental">Open Environmental Records <Arrow /></Link></article>
        </div>
      </section>

      <section className="verificationSection shell">
        <div className="verificationBeam" aria-hidden="true"><span/><span/><span/></div>
        <div className="featureCopy">
          <p className="eyebrow">RUNTIME VERIFICATION</p>
          <h2>Approval is not the end of governance. The route must remain admissible through execution.</h2>
          <p>Verification asks whether the identity, authority, evidence, continuity, binding, commit, execution, and outcome still correspond to the preserved route. When they do not, the system should HOLD, DENY, or ESCALATE instead of pretending the earlier approval still applies.</p>
          <div className="featureActions"><Link className="grandButton primary" href="/workspace/verification">Open Verification <Arrow /></Link><Link className="grandButton glass" href="/workspace">Open Workspace <Arrow /></Link></div>
        </div>
      </section>

      <section className="closingTemple shell">
        <div className="closingBurst" aria-hidden="true"/>
        <p className="eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
        <h2>Choose the correct door. Preserve the evidence. Govern the route. Verify the outcome.</h2>
        <p>The TA-14 AI Governance Exchange is open as a playground for builders, institutions, reviewers, founders, deployers, and anyone prepared to make consequential governance inspectable.</p>
        <div className="heroActions centeredActions"><Link className="grandButton primary" href="/workspace">Enter the Exchange <Arrow /></Link><Link className="grandButton gold" href="/marketplace/post">Post a Governance Need <Arrow /></Link></div>
        <div className="sealChain">{chain.map(([label],index)=><span key={label}>{label}{index<chain.length-1&&<i>→</i>}</span>)}</div>
        <strong>No admissible evidence. No admissible execution.</strong>
      </section>

      <footer className="shell"><span>TA-14 AI Governance Exchange</span><span>Architectural legibility without architectural assimilation.</span></footer>

      <style jsx>{`
        :global(*){box-sizing:border-box}
        :global(html){background:#020711;scroll-behavior:smooth}
        :global(body){margin:0;color:#f8fbff;background:#020711;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        :global(a){color:inherit}
        main{min-height:100vh;position:relative;overflow:hidden;isolation:isolate;background:linear-gradient(180deg,rgba(2,7,17,.6),rgba(3,9,17,.9))}
        .shell{width:min(1540px,calc(100% - 36px));margin-inline:auto;position:relative;z-index:3}
        .cosmos{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:-5;background:radial-gradient(circle at 50% -8%,rgba(26,102,171,.2),transparent 35%),linear-gradient(180deg,#020711,#07111e 48%,#030711)}
        .nebula{position:absolute;width:800px;height:800px;border-radius:50%;filter:blur(110px);opacity:.15;animation:nebulaFloat 18s ease-in-out infinite alternate}.nebulaOne{left:-280px;top:28%;background:#075fca}.nebulaTwo{right:-260px;top:50%;background:#9d4bff;animation-delay:-8s}
        .stars{position:absolute;inset:-12%}.starsOne{background-image:radial-gradient(circle,rgba(255,255,255,.88) 0 1px,transparent 1.5px);background-size:106px 106px;animation:starsOne 42s linear infinite}.starsTwo{background-image:radial-gradient(circle,rgba(69,180,255,.76) 0 1px,transparent 1.5px);background-size:168px 168px;background-position:44px 67px;animation:starsTwo 56s linear infinite reverse}.starsThree{background-image:radial-gradient(circle,rgba(255,190,65,.8) 0 1px,transparent 1.5px);background-size:248px 248px;background-position:90px 28px;opacity:.34;animation:pulseStars 7s ease-in-out infinite alternate}
        .shooting{position:absolute;width:190px;height:2px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.95));filter:drop-shadow(0 0 7px #8bdfff);opacity:0;transform:rotate(-24deg);animation:shooting 8s linear infinite}.shooting::after{content:"";position:absolute;right:0;top:-2px;width:6px;height:6px;border-radius:50%;background:white;box-shadow:0 0 16px white}.shootingOne{left:-20%;top:18%}.shootingTwo{left:20%;top:46%;animation-delay:-3.2s}.shootingThree{left:65%;top:72%;animation-delay:-5.7s}
        .constellation{position:absolute;width:360px;height:240px;opacity:.2}.constellationOne{left:6%;top:33%}.constellationTwo{right:8%;top:64%;transform:rotate(17deg)}.constellation i{position:absolute;width:5px;height:5px;border-radius:50%;background:#9de7ff;box-shadow:0 0 12px #5bc9f0}.constellation i::after{content:"";position:absolute;left:3px;top:2px;width:110px;height:1px;background:linear-gradient(90deg,rgba(116,214,239,.55),transparent);transform:rotate(var(--r,20deg));transform-origin:left}.constellation i:nth-child(1){left:10%;top:20%;--r:28deg}.constellation i:nth-child(2){left:35%;top:42%;--r:-18deg}.constellation i:nth-child(3){left:63%;top:27%;--r:42deg}.constellation i:nth-child(4){left:75%;top:66%;--r:160deg}.constellation i:nth-child(5){left:26%;top:76%;--r:-50deg}
        .route{position:absolute;height:1px;width:74vw;background:linear-gradient(90deg,transparent,rgba(90,190,255,.65),rgba(255,194,72,.52),transparent);filter:drop-shadow(0 0 8px rgba(90,190,255,.45))}.route::after{content:"";position:absolute;top:-3px;left:25%;width:7px;height:7px;border-radius:999px;background:#ffe7a5;box-shadow:0 0 18px rgba(255,211,103,.9);animation:packet 6s linear infinite}.routeOne{top:20%;left:-15%;transform:rotate(-9deg);animation:lineOne 16s linear infinite}.routeTwo{top:44%;right:-20%;transform:rotate(11deg);animation:lineTwo 20s linear infinite}.routeThree{top:68%;left:10%;transform:rotate(-4deg);animation:lineThree 24s linear infinite}.routeFour{top:88%;right:-20%;transform:rotate(7deg);animation:lineTwo 27s linear infinite reverse}
        .orbitCluster{position:absolute;width:390px;height:260px;animation:drift 12s ease-in-out infinite alternate}.orbitLeft{left:-34px;top:72px}.orbitRight{right:-46px;top:78px;transform:scale(.92);animation-delay:-4s}.orbit{position:absolute;left:0;right:0;top:50%;height:126px;border:1px solid rgba(255,181,47,.45);border-radius:50%;transform:rotate(-12deg);animation:orbitPulse 5s ease-in-out infinite alternate}.orbitB{transform:rotate(13deg) scale(.82);opacity:.7}.orbitC{transform:rotate(-28deg) scale(.62);opacity:.55}.planet,.moon{position:absolute;z-index:2;border-radius:999px}.planetBlue{left:98px;top:54px;width:76px;height:76px;background:radial-gradient(circle at 34% 30%,#d9f5ff,#3c97ff 24%,#0d2e76 58%,#06112c 75%);box-shadow:0 0 34px rgba(67,152,255,.7)}.planetGold{left:24px;top:122px;width:40px;height:40px;background:radial-gradient(circle at 34% 30%,#fff4b2,#f5ad27 34%,#7c3604 70%);box-shadow:0 0 26px rgba(255,173,39,.75)}.planetGold.large{left:205px;top:34px;width:72px;height:72px}.planetBlue.small{left:72px;top:132px;width:28px;height:28px}.moon{width:16px;height:16px;background:radial-gradient(circle at 30% 30%,#fff,#8bb6d6 45%,#20354c 80%);box-shadow:0 0 14px rgba(179,225,255,.55);animation:moonOrbit 9s linear infinite}.moonOne{left:170px;top:170px}.moonTwo{left:110px;top:46px;animation-direction:reverse}
        .ambient{position:absolute;width:440px;height:440px;border-radius:50%;filter:blur(80px);opacity:.16;animation:ambientBreath 9s ease-in-out infinite alternate}.ambientOne{left:12%;top:34%;background:#0a69ff}.ambientTwo{right:10%;top:42%;background:#ff9f1a;animation-delay:-3s}.burst{position:absolute;width:10px;height:10px;background:#fff0a6;box-shadow:0 0 18px rgba(255,222,112,.95),0 0 40px rgba(255,180,54,.55);transform:rotate(45deg);animation:burst 4.8s ease-in-out infinite}.burst::before,.burst::after{content:"";position:absolute;left:50%;top:50%;background:linear-gradient(90deg,transparent,#ffe49a,transparent);transform:translate(-50%,-50%)}.burst::before{width:86px;height:1px}.burst::after{width:1px;height:86px}.burstOne{left:48%;top:14%}.burstTwo{right:8%;top:27%;animation-delay:-2.1s}.burstThree{left:9%;top:74%;animation-delay:-3.4s}.burstFour{left:22%;top:43%;animation-delay:-1.2s;transform:rotate(45deg) scale(.72)}.burstFive{right:24%;top:62%;animation-delay:-4.3s;transform:rotate(45deg) scale(.86)}.burstSix{left:66%;top:32%;animation-delay:-5.7s;transform:rotate(45deg) scale(.58)}.burstSeven{right:5%;top:84%;animation-delay:-2.9s;transform:rotate(45deg) scale(.7)}.cosmicDust{position:absolute;width:4px;height:4px;border-radius:50%;background:#ffeab2;box-shadow:90px 40px #9be9ff,180px 130px #fff,270px 60px #ffd477,350px 190px #bc8aff,480px 10px #fff;animation:dustDrift 13s linear infinite}.dustOne{left:5%;top:28%}.dustTwo{right:6%;top:55%;animation-delay:-6s}
        .institution{padding-top:25px;text-align:center}.institution>p{margin:0;color:#d6be86;font-size:10px;font-weight:950;letter-spacing:.34em}.institutionRule{margin-top:11px;display:flex;align-items:center;justify-content:center;gap:18px}.institutionRule span{color:#ffe7b0;font-family:Georgia,"Times New Roman",serif;font-size:17px;letter-spacing:.16em}.institutionRule i{width:130px;height:1px;background:linear-gradient(90deg,transparent,#c78a22)}.institutionRule i:last-child{background:linear-gradient(90deg,#c78a22,transparent)}
        .hero{padding:52px 0 58px;text-align:center}.heroSeal{width:112px;height:112px;margin:0 auto 22px;position:relative;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(255,201,92,.42);background:radial-gradient(circle,rgba(255,185,52,.14),rgba(6,21,38,.84) 66%);box-shadow:0 0 60px rgba(255,180,42,.13),inset 0 0 30px rgba(91,189,255,.08)}.heroSeal span{color:#ffe39a;font-family:Georgia,serif;font-weight:900;font-size:22px;letter-spacing:.08em}.heroSeal i{position:absolute;inset:12px;border:1px solid rgba(112,216,239,.25);border-radius:50%;animation:sealSpin 16s linear infinite}.heroSeal i:nth-child(3){inset:24px;animation-direction:reverse;animation-duration:11s}.heroSeal i:nth-child(4){inset:37px;border-color:rgba(255,198,74,.35);animation-duration:8s}.eyebrow,.bandEyebrow{margin:0;color:#70dff3;font-size:11px;font-weight:950;letter-spacing:.24em}.hero h1{max-width:1260px;margin:15px auto 20px;font-family:Georgia,"Times New Roman",serif;font-size:clamp(48px,6.1vw,94px);line-height:.96;letter-spacing:-.055em;text-wrap:balance}.hero h1 em{color:#ffc541;font-style:italic;text-shadow:0 0 34px rgba(255,184,48,.18)}.heroLead{max-width:1060px;margin:0 auto;color:#c7d6de;font-size:18px;line-height:1.7;text-wrap:balance}.heroActions{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:30px}.grandButton{min-height:52px;padding:0 22px;display:inline-flex;align-items:center;justify-content:center;gap:14px;border-radius:14px;border:1px solid transparent;text-decoration:none;font-size:13px;font-weight:950;position:relative;overflow:hidden;transition:transform .25s,border-color .25s,box-shadow .25s}.grandButton::before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 20%,rgba(255,255,255,.28) 46%,transparent 70%);transform:translateX(-130%);transition:transform .6s}.grandButton:hover{transform:translateY(-4px)}.grandButton:hover::before{transform:translateX(130%)}.grandButton.primary{color:#031019;background:linear-gradient(135deg,#c8f7ff,#65d5ef 65%,#36a8ca);border-color:#a2effd;box-shadow:0 16px 34px rgba(61,190,220,.23),inset 0 1px rgba(255,255,255,.72)}.grandButton.gold{color:#261500;background:linear-gradient(135deg,#ffeba9,#efb944 64%,#b87310);border-color:#f5d073;box-shadow:0 16px 34px rgba(225,164,42,.2),inset 0 1px rgba(255,255,255,.55)}.grandButton.glass{color:#e9fbff;border-color:rgba(124,215,236,.29);background:linear-gradient(180deg,rgba(18,49,68,.9),rgba(7,24,38,.92));box-shadow:inset 0 1px rgba(255,255,255,.05)}.grandButton.glass:hover{border-color:#70d8ef;box-shadow:0 14px 30px rgba(29,151,183,.15)}.heroDefinition{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-top:42px;text-align:left}.heroDefinition article{padding:23px;border:1px solid rgba(111,202,225,.16);border-radius:19px;background:linear-gradient(145deg,rgba(12,35,50,.72),rgba(6,19,31,.8));box-shadow:0 18px 42px rgba(0,0,0,.15)}.heroDefinition span{color:#7698a7;font-size:10px;font-weight:950;letter-spacing:.12em}.heroDefinition strong{display:block;margin:14px 0 8px;font-family:Georgia,serif;font-size:21px}.heroDefinition p{margin:0;color:#9eb2bc;font-size:13px;line-height:1.58}
        .sectionIntro{max-width:1050px}.centeredIntro{margin:0 auto;text-align:center}.sectionIntro h2,.featureCopy h2,.marketplaceHeader h2,.closingTemple h2{margin:12px 0 16px;font-family:Georgia,"Times New Roman",serif;font-size:clamp(38px,4.7vw,70px);line-height:.99;letter-spacing:-.045em;text-wrap:balance}.sectionIntro>p:last-child,.featureCopy>p:not(.eyebrow),.marketplaceHeader p,.closingTemple>p:not(.eyebrow){color:#aebfc8;font-size:16px;line-height:1.7}
        .hall{scroll-margin-top:20px;padding:56px 18px 54px;border-radius:34px;border:1px solid rgba(255,194,74,.17);background:linear-gradient(180deg,rgba(7,18,30,.55),rgba(3,8,14,.24)),radial-gradient(circle at 50% 0%,rgba(255,185,57,.09),transparent 42%);box-shadow:inset 0 1px rgba(255,255,255,.03),0 34px 90px rgba(0,0,0,.3);overflow:hidden}.hallArchitecture{position:absolute;inset:0;opacity:.18;pointer-events:none}.hallArchitecture i{position:absolute;top:0;bottom:0;width:4px;background:linear-gradient(180deg,#dda33a,transparent 72%);box-shadow:0 0 24px #c17c13}.hallArchitecture i:nth-child(1){left:4%}.hallArchitecture i:nth-child(2){left:25%}.hallArchitecture i:nth-child(3){left:50%}.hallArchitecture i:nth-child(4){left:75%}.hallArchitecture i:nth-child(5){right:4%}.hallGlow{position:absolute;left:50%;top:-160px;width:1000px;height:420px;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(255,200,99,.14),transparent 68%);filter:blur(24px);pointer-events:none}.doors{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:18px;margin-top:44px;position:relative;z-index:2}.workspace{display:block;min-width:0;color:inherit;text-decoration:none}.doorStage{position:relative;height:480px;overflow:visible;perspective:1800px}.portalHalo{position:absolute;left:50%;top:36px;width:245px;height:320px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,var(--accentGlow),transparent 68%);filter:blur(26px);opacity:.45;transition:.45s}.archFrame{position:absolute;left:50%;bottom:68px;width:218px;height:340px;transform:translateX(-50%);border:12px solid #b87b16;border-radius:132px 132px 16px 16px;background:linear-gradient(90deg,#633604,#f1c869 17%,#a76510 50%,#f6d07a 82%,#5e3203),repeating-linear-gradient(100deg,rgba(255,255,255,.08) 0 2px,transparent 2px 8px);box-shadow:0 0 0 3px rgba(255,222,153,.5),0 0 36px rgba(255,182,45,.36),inset 0 0 20px rgba(255,232,180,.18);transition:.52s cubic-bezier(.2,.75,.18,1)}.archFrame::before{content:"";position:absolute;left:-28px;right:-28px;top:132px;height:16px;background:linear-gradient(180deg,#f7d07a,#8c5109);border-radius:4px;box-shadow:0 0 12px rgba(255,197,79,.36)}.archCrown{position:absolute;left:50%;top:-31px;width:164px;height:104px;transform:translateX(-50%);border-radius:96px 96px 18px 18px;border:2px solid rgba(255,224,160,.5);background:radial-gradient(circle at 50% 70%,rgba(255,221,146,.16),transparent 56%),linear-gradient(180deg,#e2aa3b,#764005);overflow:hidden}.crownLine{position:absolute;left:50%;bottom:4px;width:2px;height:90px;background:linear-gradient(180deg,#ffe4a5,#6f3702);transform-origin:bottom}.crownLine.one{transform:rotate(-28deg)}.crownLine.two{transform:rotate(0)}.crownLine.three{transform:rotate(28deg)}.crownGem{position:absolute;left:50%;top:14px;width:27px;height:27px;transform:translateX(-50%) rotate(45deg);border:1px solid #ffe2a0;background:linear-gradient(135deg,#fff4bd,#f4ae24 55%,#7b3400);box-shadow:0 0 18px rgba(255,194,65,.75)}.doorOpening{position:absolute;left:12px;right:12px;top:12px;bottom:10px;overflow:hidden;border-radius:112px 112px 5px 5px;background:#07101b;box-shadow:inset 0 0 40px rgba(255,246,197,.3);transform-style:preserve-3d}.portalWorld{position:absolute;inset:0;overflow:hidden;background:radial-gradient(circle at 50% 44%,color-mix(in srgb,var(--accent) 44%,white),transparent 10%),radial-gradient(circle at 50% 54%,var(--accentGlow),transparent 46%),linear-gradient(180deg,#07111b,#02080f);opacity:.9}.worldGrid{position:absolute;inset:0;opacity:.25;background-image:linear-gradient(color-mix(in srgb,var(--accent) 42%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--accent) 42%,transparent) 1px,transparent 1px);background-size:26px 26px;transform:perspective(280px) rotateX(58deg) scale(1.4);transform-origin:center bottom;animation:gridMove 10s linear infinite}.worldOrb{position:absolute;border-radius:999px;background:var(--accent);box-shadow:0 0 18px var(--accentGlow);animation:worldFloat 5.5s ease-in-out infinite alternate}.orbOne{width:14px;height:14px;left:25%;top:34%}.orbTwo{width:9px;height:9px;right:22%;top:48%;animation-delay:-2s}.orbThree{width:7px;height:7px;left:48%;top:22%;animation-delay:-3.4s}.worldLine{position:absolute;height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent);filter:drop-shadow(0 0 5px var(--accentGlow));transform-origin:left;animation:worldSweep 4.8s linear infinite}.worldLineOne{width:150px;left:18px;top:90px;transform:rotate(22deg)}.worldLineTwo{width:165px;left:34px;top:150px;transform:rotate(-16deg);animation-delay:-1.4s}.worldLineThree{width:130px;left:54px;top:210px;transform:rotate(8deg);animation-delay:-2.8s}.worldParticle{position:absolute;width:4px;height:4px;border-radius:999px;background:color-mix(in srgb,var(--accent) 82%,white);box-shadow:0 0 10px var(--accentGlow);animation:particleRise 6s linear infinite}.p1{left:18%;bottom:8%}.p2{left:36%;bottom:0;animation-delay:-1.4s}.p3{left:54%;bottom:12%;animation-delay:-2.8s}.p4{left:72%;bottom:4%;animation-delay:-4.1s}.p5{left:86%;bottom:18%;animation-delay:-5.2s}.recordsWorld::after{content:"";position:absolute;inset:52px 45px 62px;background:linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,244,210,.62)),repeating-linear-gradient(180deg,transparent 0 11px,rgba(50,65,42,.18) 11px 12px);border-radius:4px;transform:rotate(-4deg);opacity:.2;box-shadow:24px 16px rgba(255,255,255,.08),-16px 24px rgba(255,255,255,.06)}.environmentWorld::before,.environmentWorld::after{content:"";position:absolute;left:-20%;width:140%;height:44px;border-radius:50%;border-top:2px solid color-mix(in srgb,var(--accent) 72%,transparent);filter:blur(2px);animation:airflow 5s ease-in-out infinite alternate}.environmentWorld::before{top:42%;transform:rotate(-8deg)}.environmentWorld::after{top:62%;transform:rotate(9deg);animation-delay:-2s}.entityWorld::after{content:"";position:absolute;inset:50px 30px 68px;border:1px solid color-mix(in srgb,var(--accent) 56%,transparent);clip-path:polygon(50% 0,100% 25%,88% 82%,50% 100%,12% 82%,0 25%);box-shadow:inset 0 0 24px var(--accentGlow);animation:entityPulse 3.8s ease-in-out infinite alternate}.euWorld::after{content:"EU";position:absolute;left:50%;top:48%;width:116px;height:116px;transform:translate(-50%,-50%);display:grid;place-items:center;border-radius:50%;border:2px solid #ffd15c;color:#fff4bf;background:radial-gradient(circle,#2453b8,#071846 72%);box-shadow:0 0 36px rgba(255,204,77,.3);font-family:Georgia,serif;font-size:34px;font-weight:900}.registryWorld::after{content:"RG";position:absolute;left:50%;top:48%;width:112px;height:112px;transform:translate(-50%,-50%);display:grid;place-items:center;border-radius:18px;border:3px double #f2b95f;color:#fff0c1;background:linear-gradient(145deg,#563006,#1a1005);box-shadow:0 0 36px rgba(236,164,57,.34),inset 0 0 24px rgba(255,210,115,.12);font-family:Georgia,serif;font-size:31px;font-weight:900}.lightWithin{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.54),transparent 28%),radial-gradient(circle at 50% 48%,rgba(255,255,255,.48),transparent 36%);animation:lightPulse 2.6s ease-in-out infinite alternate}.thresholdMessage{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;opacity:0;transform:scale(.9);transition:.45s;z-index:1}.thresholdMessage span{width:72px;height:72px;display:grid;place-items:center;border-radius:50%;border:2px solid var(--accent);color:white;background:rgba(4,18,30,.58);box-shadow:0 0 28px var(--accentGlow);font-size:24px;font-weight:950}.thresholdMessage strong{font-family:Georgia,serif;font-size:22px}.thresholdMessage small{color:var(--accent);font-size:9px;font-weight:950;letter-spacing:.14em}.doorLeaf{position:absolute;inset:0;transform-style:preserve-3d;border:1px solid rgba(255,227,166,.56);background:linear-gradient(100deg,rgba(255,255,255,.18),transparent 18%,transparent 78%,rgba(0,0,0,.3)),repeating-linear-gradient(96deg,rgba(255,255,255,.04) 0 2px,transparent 2px 7px),linear-gradient(90deg,#925309,#d99c2b 38%,#b87514 62%,#7e4607);box-shadow:inset 0 0 0 3px rgba(93,51,5,.38),inset 0 0 25px rgba(255,222,151,.13),0 8px 24px rgba(0,0,0,.25);transition:transform 720ms cubic-bezier(.16,.78,.16,1),filter .32s,box-shadow .32s;z-index:3}.doorLeaf::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 24%,rgba(255,255,255,.3) 42%,transparent 58%);transform:translateX(-130%);animation:bronzeSweep 7s ease-in-out infinite}.singleDoor{transform-origin:left center;border-radius:110px 110px 5px 5px}.doorEmblem{position:absolute;left:50%;top:45px;width:88px;height:88px;transform:translateX(-50%);border-radius:50%;border:5px solid #c78a20;background:radial-gradient(circle,color-mix(in srgb,var(--accent) 70%,#06111a),#09111a 72%);box-shadow:0 0 0 2px rgba(255,225,157,.55),0 0 24px var(--accentGlow);display:grid;place-items:center;overflow:hidden}.doorEmblem span{color:#fff4c7;font-size:26px;font-weight:950;text-shadow:0 0 14px var(--accentGlow)}.doorPanels{position:absolute;left:18px;right:18px;top:151px;bottom:28px;display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(3,1fr);gap:9px}.doorPanels i{border:2px solid rgba(101,54,5,.62);border-radius:3px;box-shadow:inset 0 0 0 2px rgba(255,214,132,.12),inset 0 0 12px rgba(77,36,0,.22)}.hinge{position:absolute;left:4px;width:10px;height:38px;border-radius:4px;background:linear-gradient(90deg,#5e3202,#f1c35e,#693902);box-shadow:0 0 8px rgba(255,198,76,.35)}.h1{top:25%}.h2{top:48%}.h3{top:72%}.doorHandle{position:absolute;right:18px;top:58%;width:14px;height:14px;border-radius:50%;background:#fff0aa;box-shadow:0 0 12px rgba(255,231,151,.85);transition:.24s}.doorKeyPlate{position:absolute;right:16px;top:64%;width:18px;height:34px;border-radius:8px;background:linear-gradient(90deg,#6b3803,#f0bf57,#754104);box-shadow:0 0 8px rgba(255,198,76,.28)}.columns{position:absolute;bottom:60px;width:36px;height:274px;display:flex;gap:2px;z-index:4}.leftColumn{left:calc(50% - 142px)}.rightColumn{right:calc(50% - 142px)}.columns i{flex:1;border-radius:4px;background:linear-gradient(90deg,#653704,#f0c96b 45%,#8b4e08 80%);box-shadow:0 0 14px rgba(255,189,60,.28)}.steps{position:absolute;left:50%;bottom:18px;width:286px;transform:translateX(-50%);display:grid;gap:5px;z-index:5}.steps i{height:12px;border-radius:2px;background:linear-gradient(180deg,#e0aa44,#704000);box-shadow:0 2px 9px rgba(255,180,39,.32)}.steps i:nth-child(2){margin-inline:-15px}.steps i:nth-child(3){margin-inline:-30px}.lightSpill{position:absolute;left:50%;bottom:-4px;width:80px;height:190px;transform:translateX(-50%) scaleX(.12);transform-origin:top;clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);background:linear-gradient(180deg,rgba(255,248,205,1),rgba(255,185,45,.72) 42%,transparent);filter:blur(5px);opacity:0;transition:.72s cubic-bezier(.2,.75,.18,1);z-index:2}.floorReflection{position:absolute;left:50%;bottom:-28px;width:240px;height:126px;transform:translateX(-50%) perspective(260px) rotateX(62deg);background:radial-gradient(ellipse,var(--accentGlow),transparent 68%);filter:blur(10px);opacity:.2;transition:.62s}.sparkField{position:absolute;inset:50px 20px 40px;opacity:0;transition:.35s}.sparkField i{position:absolute;left:calc((var(--n) * 17%) % 92%);top:calc((var(--n) * 29%) % 84%);width:5px;height:5px;border-radius:50%;background:color-mix(in srgb,var(--accent) 72%,white);box-shadow:0 0 13px var(--accentGlow);animation:sparkPop 2.6s ease-in-out infinite;animation-delay:calc(var(--n) * -.17s)}.workspace:hover .singleDoor,.workspace:focus-visible .singleDoor{transform:translateZ(26px) rotateY(-16deg) translateX(-3px);filter:saturate(1.18) brightness(1.1);box-shadow:inset 0 0 0 3px rgba(93,51,5,.38),inset 0 0 25px rgba(255,222,151,.16),24px 18px 40px rgba(0,0,0,.52)}.workspace:hover .doorHandle,.workspace:focus-visible .doorHandle{transform:rotate(40deg) scale(1.3);box-shadow:0 0 20px rgba(255,240,170,1)}.workspace:hover .lightSpill,.workspace:focus-visible .lightSpill{opacity:1;transform:translateX(-50%) scaleX(5.6)}.workspace:hover .portalHalo,.workspace:focus-visible .portalHalo{opacity:.95;transform:translateX(-50%) scale(1.16)}.workspace:hover .floorReflection,.workspace:focus-visible .floorReflection{opacity:.52;transform:translateX(-50%) perspective(260px) rotateX(62deg) scale(1.25)}.workspace:hover .archFrame,.workspace:focus-visible .archFrame{transform:translateX(-50%) translateY(-6px) scale(1.02);box-shadow:0 0 0 3px rgba(255,222,153,.7),0 0 58px rgba(255,182,45,.56),inset 0 0 20px rgba(255,232,180,.18)}.workspace:hover .thresholdMessage,.workspace:focus-visible .thresholdMessage{opacity:1;transform:scale(1)}.workspace:hover .sparkField,.workspace:focus-visible .sparkField{opacity:1}.workspaceCard{min-height:372px;margin-top:-10px;padding:22px 20px 20px;border-radius:18px;border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);background:linear-gradient(180deg,rgba(53,35,12,.96),rgba(16,13,10,.98));box-shadow:0 16px 44px rgba(0,0,0,.3),inset 0 1px rgba(255,255,255,.03);transition:.28s}.workspace:hover .workspaceCard,.workspace:focus-visible .workspaceCard{transform:translateY(-10px);border-color:var(--accent);box-shadow:0 28px 60px rgba(0,0,0,.4),0 0 34px var(--accentGlow)}.miniCode{display:inline-grid;place-items:center;min-width:30px;height:30px;padding:0 8px;border-radius:7px;border:1px solid var(--accent);color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent);font-size:12px;font-weight:950;box-shadow:0 0 12px var(--accentGlow)}.workspaceKicker{min-height:auto!important;margin:12px 0 0!important;color:var(--accent)!important;font-size:9px!important;font-weight:950;letter-spacing:.12em}.workspaceCard h3{margin:9px 0 8px;font-family:Georgia,"Times New Roman",serif;font-size:25px;letter-spacing:-.025em}.workspaceCard>p{min-height:88px;margin:0;color:color-mix(in srgb,var(--accent) 70%,white);line-height:1.5;font-size:14px}.workspaceCard ul{display:grid;gap:9px;margin:17px 0 0;padding:0;list-style:none}.workspaceCard li{display:grid;grid-template-columns:16px 1fr;gap:8px;color:#d4e0e8;font-size:12px;line-height:1.4}.workspaceCard li span{color:var(--accent);text-shadow:0 0 10px var(--accentGlow)}.workspaceCta{min-height:46px;margin-top:18px;padding:0 14px;display:flex;align-items:center;justify-content:center;gap:18px;border-radius:10px;border:1px solid var(--accent);color:color-mix(in srgb,var(--accent) 70%,white);background:linear-gradient(180deg,color-mix(in srgb,var(--accent) 12%,transparent),rgba(0,0,0,.08));box-shadow:inset 0 0 18px color-mix(in srgb,var(--accent) 8%,transparent);font-size:12px;font-weight:900}.obsidianFloor{position:absolute;left:-6%;right:-6%;bottom:-150px;height:310px;background:linear-gradient(180deg,rgba(7,12,18,.1),rgba(0,0,0,.82)),repeating-linear-gradient(90deg,transparent 0 119px,rgba(255,255,255,.025) 120px),repeating-linear-gradient(0deg,transparent 0 59px,rgba(255,255,255,.018) 60px);transform:perspective(700px) rotateX(66deg);transform-origin:center top;opacity:.78;z-index:0}
        .exchangeExplanation{padding:125px 0 20px}.capabilityGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-top:34px}.capabilityGrid article{min-height:250px;padding:24px;border:1px solid rgba(100,195,218,.16);border-radius:22px;background:radial-gradient(circle at 100% 0%,rgba(83,205,236,.08),transparent 42%),linear-gradient(145deg,rgba(13,37,53,.86),rgba(6,21,34,.92));transition:.25s}.capabilityGrid article:hover{transform:translateY(-7px);border-color:rgba(112,216,239,.52);box-shadow:0 24px 56px rgba(0,0,0,.24)}.capabilityGrid span{width:45px;height:45px;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(112,216,239,.4);color:#8de8fa;background:rgba(58,177,207,.07);font-size:12px;font-weight:950}.capabilityGrid h3{margin:28px 0 10px;font-size:20px}.capabilityGrid p{color:#96adb7;line-height:1.6}.chainVault{margin-top:24px;padding:28px;border:1px solid rgba(255,185,54,.28);border-radius:24px;background:radial-gradient(circle at 50% 0%,rgba(255,172,32,.08),transparent 38%),linear-gradient(180deg,rgba(6,16,27,.96),rgba(3,9,16,.98));box-shadow:0 20px 56px rgba(0,0,0,.28)}.bandEyebrow{color:#ffc64e;letter-spacing:.12em}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;margin-top:18px}.chainNode{position:relative;text-align:center}.chainIcon{width:52px;height:52px;margin:0 auto 8px;display:grid;place-items:center;border-radius:50%;border:2px solid #ffc345;color:#ffd87c;background:rgba(112,69,5,.16);box-shadow:0 0 18px rgba(255,184,48,.2);font-size:20px}.chainNode strong{display:block;color:#ffd16b;font-size:10px}.chainNode i{position:absolute;right:-7px;top:18px;color:#f6b62f;font-style:normal}.chainVault>p:last-child{max-width:980px;margin:18px auto 0;color:#aebdc7;line-height:1.6;text-align:center}
        .featureSection{min-height:690px;margin-top:118px;padding:52px;display:grid;grid-template-columns:1fr 1.15fr;gap:72px;align-items:center;border:1px solid rgba(103,194,220,.17);border-radius:32px;background:radial-gradient(circle at 0 0,rgba(69,179,228,.09),transparent 40%),linear-gradient(145deg,rgba(12,31,47,.9),rgba(5,15,26,.96));box-shadow:0 30px 80px rgba(0,0,0,.24);overflow:hidden}.featureCopy{position:relative;z-index:2}.featureCopy p{max-width:840px}.featureActions{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}.statusFlag{display:inline-flex;min-height:31px;align-items:center;padding:0 11px;margin-bottom:16px;border-radius:999px;border:1px solid rgba(255,194,72,.36);color:#ffe09b;background:rgba(111,69,5,.14);font-size:10px;font-weight:950;letter-spacing:.12em}.foundationSection{grid-template-columns:1fr 1.2fr;background:radial-gradient(circle at 0 30%,rgba(62,183,211,.13),transparent 40%),radial-gradient(circle at 100% 0,rgba(255,185,61,.11),transparent 34%),linear-gradient(145deg,rgba(12,31,47,.94),rgba(5,15,26,.98))}.foundationVault{height:520px;position:relative;display:grid;place-items:center}.foundationHalo{position:absolute;width:450px;height:450px;border-radius:50%;background:radial-gradient(circle,rgba(83,205,229,.22),rgba(255,187,54,.08) 36%,transparent 68%);filter:blur(28px);animation:ambientBreath 5s ease-in-out infinite alternate}.foundationSeal{width:248px;height:248px;position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:50%;border:2px solid rgba(255,207,111,.68);background:radial-gradient(circle at 36% 30%,rgba(91,211,232,.25),rgba(10,28,43,.96) 55%,rgba(31,19,4,.98));box-shadow:0 0 0 12px rgba(255,198,77,.05),0 0 80px rgba(74,202,228,.2),inset 0 0 42px rgba(255,190,66,.12)}.foundationSeal::before,.foundationSeal::after{content:"";position:absolute;border-radius:50%;border:1px solid rgba(255,218,143,.26)}.foundationSeal::before{inset:18px}.foundationSeal::after{inset:38px;border-color:rgba(102,221,236,.25)}.foundationSeal small{position:relative;z-index:2;color:#83e3f1;font-size:13px;font-weight:950;letter-spacing:.23em}.foundationSeal strong{position:relative;z-index:2;margin:10px 0 8px;color:#ffe09a;font-family:Georgia,serif;font-size:30px;letter-spacing:.06em}.foundationSeal span{position:relative;z-index:2;max-width:155px;color:#abc2ca;font-size:8px;font-weight:900;line-height:1.55;letter-spacing:.14em;text-align:center}.foundationOrbit{position:absolute;border-radius:50%;border:1px solid rgba(104,218,235,.28);animation:orbitSpin 18s linear infinite}.foundationOrbit span{position:absolute;right:-6px;top:50%;width:12px;height:12px;border-radius:50%;background:#72dff0;box-shadow:0 0 18px #72dff0}.foundationOrbit.orbitOne{width:330px;height:330px}.foundationOrbit.orbitTwo{width:410px;height:190px;border-color:rgba(255,197,74,.34);transform:rotate(35deg);animation-direction:reverse;animation-duration:24s}.foundationOrbit.orbitTwo span{background:#ffd16b;box-shadow:0 0 18px #ffd16b}.foundationOrbit.orbitThree{width:470px;height:230px;border-color:rgba(196,128,255,.22);transform:rotate(-35deg);animation-duration:31s}.foundationOrbit.orbitThree span{background:#d491ff;box-shadow:0 0 18px #d491ff}.foundationStars i{position:absolute;width:7px;height:7px;border-radius:50%;background:#ffe6a2;box-shadow:0 0 17px #ffc64b;animation:sparkPop 3s ease-in-out infinite}.foundationStars i:nth-child(1){left:8%;top:18%}.foundationStars i:nth-child(2){right:12%;top:28%;animation-delay:-1s}.foundationStars i:nth-child(3){left:14%;bottom:24%;animation-delay:-1.8s}.foundationStars i:nth-child(4){right:8%;bottom:15%;animation-delay:-2.4s}.foundationStars i:nth-child(5){left:48%;top:3%;animation-delay:-.7s}.foundationStars i:nth-child(6){right:34%;bottom:4%;animation-delay:-2.7s}.foundationStars i:nth-child(7){left:34%;top:16%;animation-delay:-1.5s}.foundationStars i:nth-child(8){right:26%;top:48%;animation-delay:-2.2s}.foundationMap{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:24px}.foundationMap span{display:grid;grid-template-columns:34px 1fr;align-items:center;gap:10px;padding:12px 13px;border:1px solid rgba(255,197,76,.14);border-radius:12px;color:#c8d4da;background:rgba(255,255,255,.02);font-size:12px;line-height:1.45}.foundationMap b{width:30px;height:30px;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(116,218,237,.3);color:#86e5f4;background:rgba(56,171,196,.08);font-size:9px}.foundationBoundary{margin-top:20px;padding:17px 18px;border:1px solid rgba(255,196,75,.2);border-radius:15px;background:rgba(98,61,9,.12)}.foundationBoundary strong{color:#ffe09b;font-size:14px}.foundationBoundary p{margin:7px 0 0!important;color:#aab9c1!important;font-size:12px!important;line-height:1.6!important}.euSection{grid-template-columns:1.15fr 1fr;background:radial-gradient(circle at 100% 20%,rgba(42,88,211,.18),transparent 40%),linear-gradient(145deg,rgba(9,27,61,.93),rgba(4,14,31,.98))}.statStrip{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:24px}.statStrip span{padding:15px;border:1px solid rgba(92,156,255,.18);border-radius:13px;color:#9eb0ca;background:rgba(255,255,255,.025);font-size:11px;line-height:1.45}.statStrip b{display:block;margin-bottom:5px;color:#ffd266;font-size:12px}.euUniverse{height:500px;position:relative;display:grid;place-items:center}.euPlanet{width:210px;height:210px;position:relative;display:grid;place-items:center;border-radius:50%;background:radial-gradient(circle at 35% 30%,#4b8cff,#123b9c 40%,#061642 74%);box-shadow:0 0 80px rgba(49,104,255,.45),inset -20px -20px 50px rgba(0,0,0,.4)}.euPlanet span{font-family:Georgia,serif;font-size:54px;color:white;text-shadow:0 0 24px rgba(255,255,255,.4)}.euPlanet i{position:absolute;left:50%;top:50%;width:8px;height:8px;border-radius:50%;background:#ffd33e;box-shadow:0 0 12px #ffd33e;transform:rotate(calc(var(--i)*30deg)) translateY(-77px)}.euOrbit{position:absolute;width:420px;height:170px;border:1px solid rgba(255,207,70,.35);border-radius:50%;animation:orbitSpin 16s linear infinite}.euOrbit.two{transform:rotate(60deg) scale(.78);animation-direction:reverse}.euOrbit.three{transform:rotate(-55deg) scale(.58);animation-duration:11s}.articleMarkers span{position:absolute;min-width:58px;height:34px;display:grid;place-items:center;border-radius:999px;border:1px solid rgba(255,207,70,.4);color:#ffe08d;background:rgba(9,25,63,.86);font-size:11px;font-weight:950;box-shadow:0 0 18px rgba(255,190,45,.13)}.articleMarkers span:nth-child(1){left:4%;top:20%}.articleMarkers span:nth-child(2){right:3%;top:28%}.articleMarkers span:nth-child(3){left:8%;bottom:22%}.articleMarkers span:nth-child(4){right:10%;bottom:14%}
        .marketplaceSection{margin-top:118px;padding:58px 48px;border:1px solid rgba(255,191,67,.2);border-radius:32px;background:radial-gradient(circle at 50% 0%,rgba(255,184,40,.09),transparent 42%),linear-gradient(145deg,rgba(28,24,18,.9),rgba(6,16,27,.97));box-shadow:0 30px 80px rgba(0,0,0,.25)}.marketplaceHeader{display:flex;justify-content:space-between;gap:30px;align-items:end}.marketplaceHeader>div{max-width:1050px}.marketGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-top:34px}.marketGrid a{min-height:300px;padding:24px;display:flex;flex-direction:column;position:relative;overflow:hidden;border:1px solid rgba(255,198,76,.16);border-radius:21px;color:inherit;text-decoration:none;background:linear-gradient(145deg,rgba(43,33,19,.72),rgba(8,19,30,.92));transition:.25s}.marketGrid a::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 100% 0%,rgba(255,191,65,.14),transparent 42%);opacity:0;transition:.25s}.marketGrid a:hover{transform:translateY(-8px);border-color:rgba(255,203,96,.58);box-shadow:0 24px 60px rgba(0,0,0,.3)}.marketGrid a:hover::before{opacity:1}.marketGrid>a>span{color:#9f7a35;font-size:11px;font-weight:950}.marketOrb{width:64px;height:64px;margin:28px 0 20px;border-radius:50%;border:1px solid rgba(255,203,96,.42);background:radial-gradient(circle,#ffd474,#9b5c0a 40%,#241300 72%);box-shadow:0 0 30px rgba(255,183,45,.2)}.marketGrid h3{font-size:21px}.marketGrid p{color:#aaafa9;line-height:1.6}.marketGrid b{display:inline-flex;align-items:center;gap:10px;margin-top:auto;color:#ffd478;font-size:12px}
        .networkSection{grid-template-columns:1fr 1.18fr}.networkVisual{height:500px;position:relative;display:grid;place-items:center}.networkCore{width:120px;height:120px;display:grid;place-items:center;border-radius:50%;border:2px solid #d493ff;color:#f4dcff;background:radial-gradient(circle,#b96df1,#3a1359 60%,#11071b);box-shadow:0 0 55px rgba(190,103,241,.42);font-size:28px;font-weight:950}.networkVisual>span{position:absolute;left:50%;top:50%;width:48px;height:48px;border-radius:50%;border:1px solid #72dff3;background:radial-gradient(circle,#a7f1ff,#176986 64%,#061821);box-shadow:0 0 22px rgba(85,207,233,.35);transform:rotate(calc(var(--i)*45deg)) translateY(-180px)}.networkRing{position:absolute;width:370px;height:370px;border-radius:50%;border:1px solid rgba(112,216,239,.25);animation:orbitSpin 18s linear infinite}.networkRing.two{width:290px;height:180px;border-color:rgba(221,131,255,.28);transform:rotate(35deg);animation-direction:reverse}.networkRing.three{width:430px;height:190px;border-color:rgba(255,199,74,.2);transform:rotate(-42deg);animation-duration:24s}.networkSteps{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:24px}.networkSteps article{display:grid;grid-template-columns:38px 1fr;gap:12px;padding:14px;border:1px solid rgba(189,108,241,.16);border-radius:13px;background:rgba(255,255,255,.02)}.networkSteps article>span{width:34px;height:34px;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(210,141,255,.38);color:#e7b9ff;font-size:11px;font-weight:950}.networkSteps strong{font-size:13px}.networkSteps p{margin:4px 0 0!important;color:#9daeb8!important;font-size:11px!important;line-height:1.45!important}
        .recordsConstellation{padding-top:130px}.recordsPair{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:36px}.recordWorld{min-height:470px;padding:36px;border:1px solid rgba(103,194,220,.17);border-radius:28px;background:linear-gradient(145deg,rgba(13,37,53,.88),rgba(6,21,34,.94));box-shadow:0 24px 70px rgba(0,0,0,.22)}.recordVisual{height:220px;position:relative;display:grid;place-items:center;border-radius:22px;background:radial-gradient(circle,rgba(146,229,74,.22),transparent 54%),linear-gradient(180deg,#07141e,#031018);overflow:hidden}.recordVisual i{position:absolute;width:180px;height:120px;border:1px solid rgba(158,232,76,.3);border-radius:8px;transform:rotate(-5deg);background:repeating-linear-gradient(180deg,rgba(255,255,255,.04) 0 10px,transparent 10px 20px)}.recordVisual i:nth-child(2){transform:translate(30px,14px) rotate(4deg)}.recordVisual i:nth-child(3){transform:translate(-28px,24px) rotate(-10deg)}.recordVisual span{position:relative;z-index:2;width:86px;height:86px;display:grid;place-items:center;border-radius:50%;border:2px solid #9ee84c;color:#efffd9;background:rgba(21,53,20,.72);box-shadow:0 0 28px rgba(143,225,62,.35);font-size:27px;font-weight:950}.recordVisual.atmosphere{background:radial-gradient(circle,rgba(67,218,230,.24),transparent 54%),linear-gradient(180deg,#07141e,#031018)}.recordVisual.atmosphere i{width:150%;height:40px;border:0;border-top:2px solid rgba(101,232,241,.42);border-radius:50%;background:none;animation:airflow 5s ease-in-out infinite alternate}.recordVisual.atmosphere i:nth-child(2){top:35%;transform:rotate(-8deg)}.recordVisual.atmosphere i:nth-child(3){top:60%;transform:rotate(8deg);animation-delay:-2s}.recordVisual.atmosphere span{border-color:#65e8f1;background:rgba(7,48,56,.72);box-shadow:0 0 28px rgba(67,218,230,.35)}.recordWorld h3{margin:26px 0 10px;font-family:Georgia,serif;font-size:32px}.recordWorld p{color:#9fb2bc;line-height:1.65}.recordWorld a{min-height:46px;margin-top:18px;padding:0 16px;display:inline-flex;align-items:center;gap:13px;border-radius:11px;border:1px solid rgba(112,216,239,.35);color:#c9f6ff;background:rgba(36,129,153,.09);text-decoration:none;font-size:12px;font-weight:950}.polishedAction{position:relative;overflow:hidden;box-shadow:inset 0 1px rgba(255,255,255,.08),0 10px 24px rgba(0,0,0,.18);transition:transform .25s,border-color .25s,box-shadow .25s}.polishedAction::before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 22%,rgba(255,255,255,.22) 46%,transparent 70%);transform:translateX(-130%);transition:transform .58s}.polishedAction:hover{transform:translateY(-3px);border-color:#77e5f5;box-shadow:inset 0 1px rgba(255,255,255,.12),0 16px 30px rgba(0,0,0,.28),0 0 24px rgba(75,205,231,.15)}.polishedAction:hover::before{transform:translateX(130%)}
        .verificationSection{min-height:610px;margin-top:118px;padding:56px;display:grid;grid-template-columns:1fr 1.1fr;gap:70px;align-items:center;border:1px solid rgba(103,194,220,.17);border-radius:32px;background:radial-gradient(circle at 0 50%,rgba(38,173,223,.14),transparent 44%),linear-gradient(145deg,rgba(8,29,43,.94),rgba(4,14,24,.98));overflow:hidden}.verificationBeam{height:450px;position:relative}.verificationBeam::before{content:"";position:absolute;left:50%;top:2%;bottom:2%;width:2px;background:linear-gradient(180deg,transparent,#70e0f4,#ffd46f,transparent);box-shadow:0 0 22px #70e0f4}.verificationBeam::after{content:"";position:absolute;left:50%;top:50%;width:360px;height:360px;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(112,216,239,.24);box-shadow:0 0 70px rgba(59,198,230,.14),inset 0 0 70px rgba(255,199,76,.08);animation:sealSpin 18s linear infinite}.verificationBeam span{position:absolute;left:50%;width:110px;height:110px;transform:translateX(-50%) rotate(45deg);border:1px solid rgba(255,212,109,.38);background:rgba(4,24,35,.74);box-shadow:0 0 30px rgba(68,206,235,.2)}.verificationBeam span:nth-child(1){top:8%}.verificationBeam span:nth-child(2){top:38%;width:140px;height:140px}.verificationBeam span:nth-child(3){bottom:8%}
        .closingTemple{margin-top:120px;padding:80px 36px;text-align:center;border:1px solid rgba(255,191,67,.24);border-radius:34px;background:radial-gradient(circle at 50% 0%,rgba(255,194,73,.12),transparent 42%),linear-gradient(145deg,rgba(27,28,33,.92),rgba(6,15,25,.98));box-shadow:0 34px 90px rgba(0,0,0,.3);overflow:hidden}.closingTemple h2{max-width:1100px;margin:16px auto}.closingTemple>p:not(.eyebrow){max-width:930px;margin:0 auto}.centeredActions{justify-content:center}.closingBurst{position:absolute;left:50%;top:-190px;width:480px;height:480px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,210,113,.2),transparent 64%);filter:blur(20px);animation:ambientBreath 4s ease-in-out infinite alternate}.sealChain{margin:34px auto 18px;display:flex;flex-wrap:wrap;justify-content:center;gap:8px 14px;color:#ffd06a;font-family:Georgia,serif;font-size:16px}.sealChain span{display:inline-flex;align-items:center;gap:14px}.sealChain i{color:#b87818;font-style:normal}.closingTemple>strong{color:#f6e0a7;font-size:15px}footer{min-height:90px;display:flex;justify-content:space-between;align-items:center;color:#718694;font-size:11px}
        @keyframes starsOne{to{transform:translate3d(110px,145px,0)}}@keyframes starsTwo{to{transform:translate3d(-120px,100px,0)}}@keyframes pulseStars{from{opacity:.18;transform:scale(.98)}to{opacity:.42;transform:scale(1.02)}}@keyframes shooting{0%{transform:translate(-20vw,-10vh) rotate(-24deg);opacity:0}8%{opacity:1}35%{opacity:0}100%{transform:translate(140vw,70vh) rotate(-24deg);opacity:0}}@keyframes lineOne{from{transform:translateX(-30vw) rotate(-9deg);opacity:0}16%{opacity:.5}82%{opacity:.35}to{transform:translateX(105vw) rotate(-9deg);opacity:0}}@keyframes lineTwo{from{transform:translateX(30vw) rotate(11deg);opacity:0}18%{opacity:.45}85%{opacity:.3}to{transform:translateX(-105vw) rotate(11deg);opacity:0}}@keyframes lineThree{from{transform:translateX(-50vw) rotate(-4deg);opacity:0}20%{opacity:.38}82%{opacity:.28}to{transform:translateX(90vw) rotate(-4deg);opacity:0}}@keyframes packet{from{transform:translateX(-20vw);opacity:0}15%{opacity:1}80%{opacity:1}to{transform:translateX(80vw);opacity:0}}@keyframes burst{0%,55%,100%{transform:rotate(45deg) scale(.35);opacity:.15}66%{transform:rotate(45deg) scale(1.15);opacity:1}}@keyframes drift{to{translate:8px 12px}}@keyframes ambientBreath{from{transform:scale(.92);opacity:.1}to{transform:scale(1.08);opacity:.22}}@keyframes nebulaFloat{to{transform:translate(70px,-40px) scale(1.12)}}@keyframes orbitPulse{to{opacity:.72;filter:drop-shadow(0 0 10px rgba(255,190,58,.25))}}@keyframes moonOrbit{to{transform:rotate(360deg) translateX(120px) rotate(-360deg)}}@keyframes dustDrift{to{transform:translate(160px,-100px);opacity:0}}@keyframes sealSpin{to{transform:rotate(360deg)}}@keyframes gridMove{to{background-position:0 26px,26px 0}}@keyframes worldFloat{from{transform:translate3d(-4px,-6px,0) scale(.9)}to{transform:translate3d(7px,12px,0) scale(1.15)}}@keyframes worldSweep{from{opacity:0;translate:-30px 0}25%{opacity:.8}75%{opacity:.55}to{opacity:0;translate:70px 0}}@keyframes particleRise{from{transform:translateY(18px) scale(.7);opacity:0}20%{opacity:.8}80%{opacity:.6}to{transform:translateY(-240px) scale(1.2);opacity:0}}@keyframes bronzeSweep{0%,58%{transform:translateX(-130%)}78%,100%{transform:translateX(130%)}}@keyframes airflow{from{translate:-14px -4px;opacity:.28}to{translate:16px 6px;opacity:.7}}@keyframes entityPulse{from{transform:scale(.94) rotate(-2deg);opacity:.35}to{transform:scale(1.04) rotate(2deg);opacity:.75}}@keyframes lightPulse{from{opacity:.42}to{opacity:.88}}@keyframes sparkPop{0%,100%{transform:scale(.3);opacity:.15}50%{transform:scale(1.5);opacity:1}}@keyframes orbitSpin{to{rotate:360deg}}
        @media(max-width:1280px){.doors{grid-template-columns:repeat(3,1fr)}.doorStage{height:500px}.capabilityGrid,.marketGrid{grid-template-columns:repeat(2,1fr)}.featureSection,.verificationSection{grid-template-columns:1fr}.foundationVault,.euUniverse,.networkVisual,.verificationBeam{order:2}.chain{grid-template-columns:repeat(4,1fr);row-gap:18px}.chainNode i{display:none}}
        @media(max-width:980px){.doors{grid-template-columns:repeat(2,1fr)}}@media(max-width:760px){.shell{width:min(100% - 20px,1540px)}.institutionRule i{width:42px}.institutionRule span{font-size:13px;letter-spacing:.08em}.hero{padding-top:38px}.hero h1{font-size:clamp(42px,12vw,64px)}.heroLead{font-size:16px}.heroDefinition,.doors,.capabilityGrid,.marketGrid,.recordsPair,.foundationMap,.statStrip,.networkSteps{grid-template-columns:1fr}.heroActions .grandButton,.featureActions .grandButton{width:100%}.hall{padding-inline:10px}.doorStage{height:475px}.featureSection,.marketplaceSection,.verificationSection{padding:34px 20px;margin-top:80px}.marketplaceHeader{display:grid}.chain{grid-template-columns:repeat(2,1fr)}.foundationVault,.euUniverse,.networkVisual,.verificationBeam{height:390px}.foundationVault{transform:scale(.8)}.euUniverse{transform:scale(.8)}.networkVisual{transform:scale(.8)}.sectionIntro h2,.featureCopy h2,.marketplaceHeader h2,.closingTemple h2{font-size:clamp(34px,10vw,52px)}footer{flex-direction:column;align-items:flex-start;justify-content:center;gap:6px}}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:1ms!important;scroll-behavior:auto!important}}
      `}</style>
    </main>
  );
}
