"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";

type SiteActivityResponse = {
  counted: boolean;
  newVisitor?: boolean;
  visitors?: number;
  pageViews?: number;
  updatedAt?: string;
};

type SiteActivityState = {
  visitors: number | null;
  pageViews: number | null;
  status: "loading" | "ready" | "unavailable";
};

function formatCount(value: number | null): string {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

function SiteActivityCounter() {
  const pathname = usePathname();
  const lastCountedPathRef = useRef<string | null>(null);
  const [activity, setActivity] = useState<SiteActivityState>({
    visitors: null,
    pageViews: null,
    status: "loading",
  });

  useEffect(() => {
    if (!pathname || lastCountedPathRef.current === pathname) {
      return;
    }

    lastCountedPathRef.current = pathname;
    const controller = new AbortController();

    async function recordActivity() {
      try {
        const response = await fetch("/api/site-activity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: pathname }),
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Site activity request failed: ${response.status}`);
        }

        const payload = (await response.json()) as SiteActivityResponse;

        if (
          !payload.counted ||
          typeof payload.visitors !== "number" ||
          typeof payload.pageViews !== "number"
        ) {
          setActivity((current) => ({
            ...current,
            status: "unavailable",
          }));
          return;
        }

        setActivity({
          visitors: payload.visitors,
          pageViews: payload.pageViews,
          status: "ready",
        });
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }

        console.error("Unable to load TA-14 site activity:", error);

        setActivity((current) => ({
          ...current,
          status: "unavailable",
        }));
      }
    }

    void recordActivity();

    return () => controller.abort();
  }, [pathname]);

  return (
    <section
      aria-label="TA-14 Exchange public activity"
      className="siteActivityCounter"
    >
      <div className="activityHeading">
        <p>TA-14 Exchange Activity</p>
        <span>Public site totals</span>
      </div>

      <div className="activityMetrics">
        <div>
          <strong>{formatCount(activity.visitors)}</strong>
          <span>Visitors</span>
        </div>
        <div>
          <strong>{formatCount(activity.pageViews)}</strong>
          <span>Page Views</span>
        </div>
      </div>

      {activity.status === "unavailable" ? (
        <p className="activityUnavailable">
          Activity totals are temporarily unavailable.
        </p>
      ) : null}
    </section>
  );
}

const workspaces = [
  {
    id: "ai",
    code: "AI",
    title: "TA-14 AI Governance Exchange",
    href: "/workspace/ai-governance",
    kicker: "GOVERN CONSEQUENTIAL AI BEFORE REALITY IS BOUND",
    description:
      "Build, test, review, preserve, and verify AI governance routes across models, agents, tools, identities, authorities, evidence, commitments, executions, and outcomes.",
    color: "#62afff",
    glow: "rgba(63, 154, 255, .56)",
    world: "aiWorld",
    features: [
      "Governed route construction and runtime verification",
      "AI entity review and guided review intake",
      "Execution artifacts, registries, verification, and preserved findings",
      "EU AI Act review, Partner Review Network, and marketplace",
    ],
  },
  {
    id: "academy",
    code: "AC",
    title: "TA-14 Academy",
    href: "/academy",
    kicker: "THE EDUCATIONAL BACKBONE OF THE WHOLE INSTITUTION",
    description:
      "Enter the central learning institution, then choose AI governance, environmental integrity, HVAC, Atmospheric Integrity Records, entity review, law, standards, public research, or any future TA-14 discipline.",
    color: "#39f2a1",
    glow: "rgba(57, 242, 161, .52)",
    world: "academyWorld",
    features: [
      "Domain-specific learning halls across every institution",
      "Architecture explorers, simulations, labs, and assessments",
      "Entity Review Academy and guided readiness pathways",
      "Credentials, instructor pathways, and accreditation systems",
    ],
  },
  {
    id: "environment",
    code: "EI",
    title: "Environmental Integrity Governance",
    href: "/workspace/governed-records/environmental",
    kicker: "GOVERN ENVIRONMENTAL REALITY FROM RECORD TO OUTCOME",
    description:
      "Govern air, water, land, pollution, buildings, HVAC systems, atmospheric evidence, environmental intervention, and verified outcomes through one environmental institution.",
    color: "#78e6b0",
    glow: "rgba(92, 224, 167, .52)",
    world: "recordsWorld",
    features: [
      "Atmospheric Integrity Records and Personal Atmospheric Integrity Records",
      "HVAC, building, hospital, laboratory, sensor, air, and water pathways",
      "Environmental entity review, intervention, and outcome verification",
      "Embedded Environmental, HVAC, and Atmospheric Integrity Academies",
    ],
  },
  {
    id: "law",
    code: "LAW",
    title: "Law, Standards & Public Policy",
    href: "/governance-library/laws",
    kicker: "PRESERVE WHAT EXISTS · EXPOSE THE GAP · PROPOSE THE UPGRADE",
    description:
      "Study current law, regulations, standards, and codes beside clearly labeled TA-14 proposed acts, model language, upgraded standards, and public-policy pathways.",
    color: "#f2b95f",
    glow: "rgba(236, 164, 57, .52)",
    world: "euWorld",
    features: [
      "Current and proposed statutes, acts, regulations, and model law",
      "ASHRAE, ANSI-accredited, building, mechanical, and technical standards",
      "Gap analysis, authority mapping, enforcement, evidence, and execution comparison",
      "Law Academy, Standards Academy, scenarios, and public-policy education",
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

const academyDomains = [
  ["AI", "AI Governance Academy", "Architecture, routes, agents, models, identity, evidence, authority, execution, artifacts, and verification.", "/academy"],
  ["EI", "Environmental Integrity Academy", "Air, water, land, pollution, environmental records, intervention, enforcement, and outcome integrity.", "/academy"],
  ["HV", "HVAC Academy", "Diagnostics, electrical integrity, refrigerant governance, sensing, field evidence, and technician competency.", "/academy"],
  ["ER", "Entity Review Academy", "Learn the review, build the package, validate readiness, submit evidence, and understand bounded findings.", "/workspace/entity-review"],
  ["PR", "Public Research Academy", "Research literacy, public evidence, publication boundaries, repositories, challenge, and correction.", "/academy"],
  ["LW", "Law Academy", "Current law, primitive gaps, proposed upgrades, practical differences, scenarios, and legislative reasoning.", "/governance-library/laws"],
  ["ST", "Standards Academy", "Standards status, applicability, incorporation, technical gaps, proposed upgrades, and execution effects.", "/governance-library/standards"],
  ["AIR", "Atmospheric Integrity Academy", "Atmospheric evidence, instruments, continuity, building protection, personal records, and future reliance.", "/academy"],
];

const entityJourney = [
  ["01", "Learn the review", "See what TA-14 examines, how findings work, and why bounded claims are more credible than universal promises."],
  ["02", "Define the entity", "Preserve identity, ownership, stewardship, jurisdiction, responsible contacts, systems, versions, and declared roles."],
  ["03", "Build the claim", "Turn broad marketing language into one precise capability, use case, control, architecture, or reviewable proposition."],
  ["04", "Set boundaries", "Declare scope, non-claims, exclusions, confidentiality, intellectual-property limits, publication permissions, and conditions."],
  ["05", "Assemble evidence", "Upload records, policies, technical outputs, demonstrations, signatures, repositories, authorities, and supporting material."],
  ["06", "Validate readiness", "Identify missing fields, contradictions, unsupported claims, weak authority, stale versions, and unresolved evidence gaps."],
  ["07", "Submit the package", "Create a structured review-ready package instead of handing TA-14 an unorganized collection of documents."],
  ["08", "Receive findings", "Obtain bounded findings, limitations, corrective actions, artifact options, publication pathways, and reassessment steps."],
];

const modernizationTracks = [
  {
    code: "LAW",
    title: "Law & Legislative Modernization",
    href: "/governance-library/laws",
    text: "Preserve enacted law as it exists, identify where it is primitive or incomplete, teach the consequences of the gap, and publish clearly labeled TA-14 proposed upgrades.",
    items: ["Clean Air Act and air-pollution law", "Clean Water Act and water-protection law", "EPA regulations and enforcement pathways", "Environmental, public-health, building, and anti-pollution legislation"],
  },
  {
    code: "STD",
    title: "Standards, Codes & Technical Modernization",
    href: "/governance-library/standards",
    text: "Distinguish standards from statutes, preserve their real authority, show how adoption makes them enforceable, and propose stronger evidence and execution requirements.",
    items: ["ASHRAE standards and guidelines", "ANSI-accredited standards", "Building, mechanical, HVAC, and environmental codes", "Measurement, sensor, AI governance, and verification standards"],
  },
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

      <div className="siteActivityDock shell">
        <SiteActivityCounter />
      </div>

      <section className="institution shell">
        <p>TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
        <div className="institutionRule"><i/><span>ONE INSTITUTION · FOUR GOVERNED WORLDS · ONE PRESERVED ROUTE TO RELIANCE</span><i/></div>
      </section>

      <section className="hero shell">
        <div className="heroSeal" aria-hidden="true">
          <span>TA-14</span>
          <i/><i/><i/>
        </div>
        <p className="eyebrow">THE GRAND INSTITUTIONAL FRONT DOOR</p>
        <h1>
          Governance for consequential AI, environmental reality, institutional learning, and
          <em> the laws, standards, and public policy the future will require.</em>
        </h1>
        <p className="heroLead">
          TA-14Authority.org is the public front door to four governed institutional worlds: the TA-14 AI Governance Exchange, TA-14 Academy, Environmental Integrity Governance, and Law, Standards & Public Policy. Everything else belongs behind the correct door as a governed pathway, shared institutional utility, record, registry, Academy discipline, or review process.
        </p>
        <div className="heroActions">
          <Link className="grandButton primary" href="#institutional-doors">Enter the Grand Institutional Hall <span>↓</span></Link>
          <Link className="grandButton gold" href="/workspace/ai-governance">Enter the AI Governance Exchange <Arrow /></Link>
          <Link className="grandButton academyButton" href="/academy">Enter TA-14 Academy <Arrow /></Link>
          <Link className="grandButton glass" href="/workspace/entity-review">Begin Guided Entity Review <Arrow /></Link>
          <Link className="grandButton glass" href="/governance-library/laws">Enter Law, Standards & Public Policy <Arrow /></Link>
        </div>
        <div className="heroDefinition">
          <article><span>THE INSTITUTION</span><strong>One governed umbrella</strong><p>Four primary divisions: AI Governance, TA-14 Academy, Environmental Integrity Governance, and Law, Standards & Public Policy. Registries, research, records, verification, entity review, HVAC, and atmospheric pathways live behind the correct door.</p></article>
          <article><span>THE ACADEMY</span><strong>Present inside every division</strong><p>Learn each institution, inspect examples, run simulations, build readiness, and understand why every required element matters.</p></article>
          <article><span>THE GOVERNING RULE</span><strong>No admissible evidence. No admissible execution.</strong><p>Claims become routes, routes become determinations, and determinations must survive execution and outcome verification.</p></article>
        </div>
      </section>

      <section className="hall shell" id="institutional-doors">
        <div className="hallArchitecture" aria-hidden="true"><i/><i/><i/><i/><i/></div>
        <div className="hallGlow" aria-hidden="true" />
        <div className="sectionIntro centeredIntro">
          <p className="eyebrow">FOUR GRAND INSTITUTIONAL ENTRANCES</p>
          <h2>Choose the world you need. The Academy, evidence, review, and governing chain travel with you.</h2>
          <p>Four doors are enough. Each opens into a complete institutional world with its own authority, evidence, Academy pathways, review processes, records, registries, and public responsibilities.</p>
        </div>

        <div className="doors institutionalDoors">
          {workspaces.map((workspace) => (
            <Link
              href={workspace.href}
              className={`workspace institutionDoor ${workspace.id === "academy" ? "academyDoor" : ""}`}
              key={workspace.id}
              style={{ "--accent": workspace.color, "--accentGlow": workspace.glow } as CSSProperties}
            >
              <div className="doorStage">
                <div className="portalHalo" />
                <div className="sparkField">
                  {Array.from({ length: 18 }).map((_, index) => <i key={index} style={{ "--n": index } as CSSProperties} />)}
                </div>
                <div className="columns leftColumn"><i/><i/><i/></div>
                <div className="columns rightColumn"><i/><i/><i/></div>
                <div className="archFrame grandArch">
                  <div className="archCrown"><i className="crownLine one"/><i className="crownLine two"/><i className="crownLine three"/><span className="crownGem"/></div>
                  <div className="doorOpening">
                    <div className={`portalWorld ${workspace.world}`}>
                      <span className="worldGrid"/><span className="worldOrb orbOne"/><span className="worldOrb orbTwo"/><span className="worldOrb orbThree"/>
                      <span className="worldLine worldLineOne"/><span className="worldLine worldLineTwo"/><span className="worldLine worldLineThree"/>
                      <span className="worldParticle p1"/><span className="worldParticle p2"/><span className="worldParticle p3"/><span className="worldParticle p4"/><span className="worldParticle p5"/>
                    </div>
                    <div className="interiorVista"><span/><span/><span/></div>
                    <div className="lightWithin" />
                    <div className="thresholdMessage">
                      <span>{workspace.code}</span>
                      <strong>{workspace.title}</strong>
                      <small>ENTER INSTITUTIONAL WORLD</small>
                    </div>
                    <div className="doorLeaf singleDoor grandDoorLeaf">
                      <div className="doorEmblem"><span>{workspace.code}</span></div>
                      <div className="doorPanels carvedPanels"><i/><i/><i/><i/><i/><i/></div>
                      <span className="hinge h1"/><span className="hinge h2"/><span className="hinge h3"/>
                      <span className="doorHandle" />
                      <span className="doorKeyPlate" />
                    </div>
                  </div>
                </div>
                <div className="steps"><i/><i/><i/></div>
                <div className="lightSpill grandLightSpill" />
                <div className="dustInLight">{Array.from({length:12}).map((_,index)=><i key={index} style={{"--d":index} as CSSProperties}/>)}</div>
                <div className="floorReflection" />
              </div>

              <div className="workspaceCard institutionalCard">
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

      <section className="environmentalWorlds shell" aria-labelledby="environmental-worlds-title">
        <div className="environmentalWorldsIntro">
          <p className="eyebrow">INSIDE ENVIRONMENTAL INTEGRITY GOVERNANCE</p>
          <h2 id="environmental-worlds-title">One environmental door. Multiple governed pathways.</h2>
          <p>Atmospheric Integrity Records and HVAC do not stand outside Environmental Integrity Governance. They operate inside it with their own records, Academy pathways, review routes, evidence boundaries, and calls to action.</p>
        </div>
        <div className="environmentalWorldGrid">
          {[
            ["AIR", "Atmospheric Integrity Records", "Preserve exterior, interior, building, hospital, laboratory, and environmental atmospheric evidence with instrument, location, chronology, and continuity intact.", "/workspace/governed-records/environmental"],
            ["PAIR", "Personal Atmospheric Integrity Records", "Create bounded personal exposure records that distinguish measured conditions, context, interpretation, intervention, and outcome.", "/workspace/governed-records/environmental"],
            ["HVAC", "HVAC Governance", "Govern diagnostics, electrical integrity, refrigerant work, airflow, pressure, moisture, sensing, intervention, and post-intervention performance.", "/workspace/governed-records/environmental"],
            ["ER", "Environmental Entity Review", "Guide environmental, building, HVAC, sensor, and atmospheric entities through scoped evidence preparation and governed review.", "/workspace/entity-review"],
          ].map(([code,title,text,href]) => (
            <Link href={href} key={title}>
              <span>{code}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <b>Open governed pathway <Arrow /></b>
            </Link>
          ))}
        </div>
      </section>

      <section className="academySpine shell">
        <div className="academySpineVisual" aria-hidden="true">
          <div className="academyCentralSeal"><small>TA-14</small><strong>ACADEMY</strong><span>LEARN · BUILD · SIMULATE · VERIFY</span></div>
          <i className="academyOrbit orbitOne"/><i className="academyOrbit orbitTwo"/><i className="academyOrbit orbitThree"/>
          {academyDomains.map(([code],index)=><b key={code} style={{"--i":index} as CSSProperties}>{code}</b>)}
        </div>
        <div className="academySpineCopy">
          <p className="eyebrow">THE ACADEMY IS INSIDE EVERYTHING</p>
          <h2>One central Academy. A dedicated learning institution inside every TA-14 world.</h2>
          <p>Enter through the Academy and choose a discipline—or enter any institutional division and open its embedded Academy pathway. The Academy teaches what the system is, why each requirement exists, how to build it correctly, how to inspect failure, and how to demonstrate readiness before consequence is allowed.</p>
          <div className="academyDomainGrid">
            {academyDomains.map(([code,title,text,href])=><Link href={href} key={title}><span>{code}</span><div><strong>{title}</strong><p>{text}</p></div><b>↗</b></Link>)}
          </div>
          <div className="featureActions"><Link className="grandButton academyButton" href="/academy">Enter the Central Academy <Arrow /></Link><Link className="grandButton glass" href="/academy/simulation-center">Open Simulation Center <Arrow /></Link></div>
        </div>
      </section>

      <section className="entityReviewGateway shell">
        <div className="sectionIntro">
          <p className="eyebrow">ENTITY REVIEW · GUIDED LIKE TURBOTAX, GOVERNED LIKE TA-14</p>
          <h2>We do not ask an entity to guess what a review requires. We teach it, build it, validate it, and receive it ready for review.</h2>
          <p>The Entity Review Academy and live review workflow are one connected system. A participant learns why each element matters while constructing a complete package. At the end, the entity submits an organized, bounded, evidence-aware record that TA-14 can govern and return with findings.</p>
        </div>
        <div className="reviewJourney">
          {entityJourney.map(([number,title,text],index)=><article key={number}><span>{number}</span><div><small>STEP {index+1} OF {entityJourney.length}</small><h3>{title}</h3><p>{text}</p></div></article>)}
        </div>
        <div className="reviewReadinessPanel">
          <div><p className="eyebrow">WHAT THE PARTICIPANT BUILDS</p><h3>A complete, review-ready governance package</h3><ul><li>Entity identity, ownership, roles, systems, and versions</li><li>Bounded capability claim, scope, non-claims, and exclusions</li><li>Evidence, authority, continuity, confidentiality, and publication boundaries</li><li>Execution pathway, expected outcome, limitations, and unresolved questions</li></ul></div>
          <div><p className="eyebrow">WHAT TA-14 RETURNS</p><h3>Bounded findings that distinguish proof from assertion</h3><ul><li>Supported, conditional, held, denied, escalated, or outside-scope findings</li><li>Corrective actions, evidence gaps, and reassessment requirements</li><li>Execution artifact, registry, case-study, and publication options</li><li>A preserved record of what was reviewed and what was not</li></ul></div>
        </div>
        <div className="featureActions centeredActions"><Link className="grandButton primary" href="/workspace/entity-review">Enter Guided Entity Review <Arrow /></Link><Link className="grandButton glass" href="/academy">Learn Entity Review First <Arrow /></Link></div>
      </section>

      <section className="exchangeExplanation shell">
        <div className="sectionIntro">
          <p className="eyebrow">THE GOVERNING CHAIN BENEATH EVERY DIVISION</p>
          <h2>Different institutions. One requirement: preserve the route from reality to outcome.</h2>
          <p>AI governance, environmental integrity, public research, law, standards, Academy, and entity review have different authorities and evidence. They share one discipline: no layer is allowed to disappear into the next.</p>
        </div>
        <div className="chainVault">
          <p className="bandEyebrow">THE TA-14 GOVERNING CHAIN</p>
          <div className="chain">
            {chain.map(([label, icon], index) => <div className="chainNode" key={label}><span className="chainIcon">{icon}</span><strong>{label}</strong>{index < chain.length - 1 && <i>→</i>}</div>)}
          </div>
          <p>Reality becomes a record. The record must retain continuity. Evidence must become admissible. Authority and consequence must bind before commitment. Execution must correspond to the determination. Outcome must return to the record.</p>
        </div>
      </section>

      <section className="modernizationSection shell">
        <div className="sectionIntro centeredIntro">
          <p className="eyebrow">CURRENT INSTRUMENTS · TA-14 PROPOSED UPGRADES</p>
          <h2>We will not confuse laws with standards—or preserve either one as untouchable merely because it already exists.</h2>
          <p>TA-14 will teach what each instrument is, preserve its real authority, identify what it leaves out, explain why the gap matters, and publish a clearly labeled proposed upgrade that can be inspected, challenged, improved, and eventually adopted.</p>
        </div>
        <div className="modernizationGrid">
          {modernizationTracks.map((track)=><article key={track.code}><span className="modernCode">{track.code}</span><h3>{track.title}</h3><p>{track.text}</p><ul>{track.items.map(item=><li key={item}>✦ {item}</li>)}</ul><Link className="polishedAction" href={track.href}>Enter {track.title} <Arrow /></Link></article>)}
        </div>
        <div className="comparisonRoute">
          <span>WHAT EXISTS</span><i>→</i><span>WHAT IT LEAVES OUT</span><i>→</i><span>WHY THE GAP MATTERS</span><i>→</i><span>WHAT TA-14 PROPOSES</span><i>→</i><span>WHAT CHANGES IN PRACTICE</span>
        </div>
      </section>

      <section className="credentialsSection shell" id="credentials">
        <div className="credentialsVisual" aria-hidden="true">
          <div className="credentialsHalo" />
          <div className="credentialsSeal"><small>TA-14</small><strong>PUBLIC RECORD</strong><span>IDENTITY • CLAIMS • EVIDENCE • CHRONOLOGY</span></div>
          <i className="credentialOrbit one" /><i className="credentialOrbit two" />
        </div>
        <div className="credentialsCopy">
          <span className="statusFlag">PUBLIC RESEARCH AND INSTITUTIONAL RECORD</span>
          <p className="eyebrow">WHAT WE BUILT · WHAT WE CLAIM · WHAT THE RECORD SUPPORTS</p>
          <h2>The institution must be able to show its own work before asking anyone else to show theirs.</h2>
          <p>The public record brings TA-14 identity, architecture, chronology, publications, repositories, filings, reference implementations, records, demonstrations, limitations, disputes, corrections, and challenge pathways into one inspectable entrance.</p>
          <div className="credentialsGrid">
            {[["Identity","Institution, founder, authorship, stewardship, and declared ownership."],["Architecture","Governing chain, architecture families, standards, methods, and scope."],["Chronology","Dated declarations, releases, publications, versions, and milestones."],["Research","Public studies, technical work, records, repositories, and evidence packages."],["Claims","What TA-14 claims, what it does not claim, and what remains conditional."],["Correction","Challenges, objections, corrections, supersession, and preserved history."]].map(([title,text],index)=><article key={title}><span>{String(index+1).padStart(2,"0")}</span><div><strong>{title}</strong><p>{text}</p></div></article>)}
          </div>
          <div className="featureActions"><Link className="grandButton gold credentialsPrimary" href="/foundation">Open Public Research & Public Record <Arrow /></Link><Link className="grandButton glass" href="/registry">Open Registry <Arrow /></Link></div>
        </div>
      </section>

      <section className="artifactLaunchDeck shell" aria-label="Execution Artifacts institution">
        <div className="artifactLaunchSignal" aria-hidden="true"><span className="signalCore">EA</span><i className="signalRing ringOne"/><i className="signalRing ringTwo"/><i className="signalRing ringThree"/><b className="signalBeam beamOne"/><b className="signalBeam beamTwo"/></div>
        <div className="artifactLaunchCopy">
          <p className="eyebrow">EXECUTION ARTIFACTS · REGISTRIES · VERIFICATION</p>
          <h2>Governance becomes institutional when the route leaves behind proof.</h2>
          <p>Inspect bounded execution records that preserve the proposed consequence, governing route, admitted evidence, authority, continuity, determination, technical execution effect, outcome, integrity package, verification path, and explicit proof boundary.</p>
          <div className="artifactLaunchMetrics"><article><strong>12</strong><span>Founding artifacts</span></article><article><strong>4</strong><span>Determination states</span></article><article><strong>24</strong><span>Runtime links represented</span></article><article><strong>8</strong><span>Visible anchor links</span></article></div>
          <div className="artifactLaunchActions"><Link className="grandButton artifactButton" href="/artifacts">Inspect Execution Artifacts <Arrow /></Link><Link className="grandButton glass" href="/artifacts/verify">Open Verification Center <Arrow /></Link><Link className="grandButton glass" href="/registry">Open Registry <Arrow /></Link></div>
        </div>
      </section>

      <section className="marketplaceSection shell">
        <div className="marketplaceHeader"><div><p className="eyebrow">THE INSTITUTION IN MOTION</p><h2>Bring us your governance, evidence, environmental record, standard, proposed law, research, or bounded claim.</h2><p>TA-14 is building the pathways through which outside entities can learn the process, assemble what is necessary, enter the correct institutional division, and receive a preserved result.</p></div><Link className="grandButton gold" href="/marketplace/post">Post a Governed Need <Arrow /></Link></div>
        <div className="marketGrid">
          {[["Enter AI Governance","Build or review a consequential AI route, capability, architecture, artifact, or implementation.","/workspace/ai-governance"],["Enter Environmental Integrity","Preserve environmental reality and govern records, interventions, and outcomes.","/workspace/governed-records/environmental"],["Begin Entity Review","Use the guided Academy and readiness builder to create a review-ready package.","/workspace/entity-review"],["Join the Institutional Record","Publish, register, preserve, challenge, correct, and build inspectable reputation.","/registry"]].map(([title,text,href],index)=><Link href={href} key={title}><span>{String(index+1).padStart(2,"0")}</span><div className="marketOrb"/><h3>{title}</h3><p>{text}</p><b>Open pathway <Arrow /></b></Link>)}
        </div>
      </section>

      <section className="closingTemple shell">
        <div className="closingBurst" aria-hidden="true"/>
        <p className="eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
        <h2>Enter the right world. Learn the architecture. Preserve the evidence. Govern the route. Verify the outcome.</h2>
        <p>This is the public front door to an institution designed to govern AI, environmental reality, entities, research, law, standards, execution, and future reliance—while keeping Atmospheric Integrity Records, Personal Atmospheric Integrity Records, HVAC, building evidence, and sensor governance inside Environmental Integrity Governance and the TA-14 Academy.</p>
        <div className="heroActions centeredActions"><Link className="grandButton primary" href="#institutional-doors">Choose an Institutional Door <span>↑</span></Link><Link className="grandButton academyButton" href="/academy">Enter TA-14 Academy <Arrow /></Link><Link className="grandButton gold" href="/workspace/entity-review">Bring Us Your Governance <Arrow /></Link></div>
        <div className="sealChain">{chain.map(([label],index)=><span key={label}>{label}{index<chain.length-1&&<i>→</i>}</span>)}</div>
        <strong>No admissible evidence. No admissible execution.</strong>
      </section>

      <footer className="shell"><span>TA-14 Authority Governance Institution</span><span>TA14Authority.org · Four doors. Distinct authorities. Preserved evidence. Governed outcomes.</span></footer>

      <style jsx>{`
        :global(*) {
          box-sizing:border-box
        }

                :global(html) {
          background:#020711;
            scroll-behavior:smooth
        }

                :global(body) {
          margin:0;
            color:#f8fbff;
            background:#020711;
            font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
        }

                :global(a) {
          color:inherit
        }

                main {
          min-height:100vh;
            position:relative;
            overflow:hidden;
            isolation:isolate;
            background:linear-gradient(180deg,rgba(2,7,17,.6),rgba(3,9,17,.9))
        }

                .shell {
          width:min(1540px,calc(100% - 36px));
            margin-inline:auto;
            position:relative;
            z-index:3
        }

                .cosmos {
          position:fixed;
            inset:0;
            overflow:hidden;
            pointer-events:none;
            z-index:-5;
            background:radial-gradient(circle at 50% -8%,rgba(26,102,171,.2),transparent 35%),linear-gradient(180deg,#020711,#07111e 48%,#030711)
        }

                .nebula {
          position:absolute;
            width:800px;
            height:800px;
            border-radius:50%;
            filter:blur(110px);
            opacity:.15;
            animation:nebulaFloat 18s ease-in-out infinite alternate
        }
        .nebulaOne {
          left:-280px;
            top:28%;
            background:#075fca
        }
        .nebulaTwo {
          right:-260px;
            top:50%;
            background:#9d4bff;
            animation-delay:-8s
        }

                .stars {
          position:absolute;
            inset:-12%
        }
        .starsOne {
          background-image:radial-gradient(circle,rgba(255,255,255,.88) 0 1px,transparent 1.5px);
            background-size:106px 106px;
            animation:starsOne 42s linear infinite
        }
        .starsTwo {
          background-image:radial-gradient(circle,rgba(69,180,255,.76) 0 1px,transparent 1.5px);
            background-size:168px 168px;
            background-position:44px 67px;
            animation:starsTwo 56s linear infinite reverse
        }
        .starsThree {
          background-image:radial-gradient(circle,rgba(255,190,65,.8) 0 1px,transparent 1.5px);
            background-size:248px 248px;
            background-position:90px 28px;
            opacity:.34;
            animation:pulseStars 7s ease-in-out infinite alternate
        }

                .shooting {
          position:absolute;
            width:190px;
            height:2px;
            background:linear-gradient(90deg,transparent,rgba(255,255,255,.95));
            filter:drop-shadow(0 0 7px #8bdfff);
            opacity:0;
            transform:rotate(-24deg);
            animation:shooting 8s linear infinite
        }
        .shooting::after {
          content:"";
            position:absolute;
            right:0;
            top:-2px;
            width:6px;
            height:6px;
            border-radius:50%;
            background:white;
            box-shadow:0 0 16px white
        }
        .shootingOne {
          left:-20%;
            top:18%
        }
        .shootingTwo {
          left:20%;
            top:46%;
            animation-delay:-3.2s
        }
        .shootingThree {
          left:65%;
            top:72%;
            animation-delay:-5.7s
        }

                .constellation {
          position:absolute;
            width:360px;
            height:240px;
            opacity:.2
        }
        .constellationOne {
          left:6%;
            top:33%
        }
        .constellationTwo {
          right:8%;
            top:64%;
            transform:rotate(17deg)
        }
        .constellation i {
          position:absolute;
            width:5px;
            height:5px;
            border-radius:50%;
            background:#9de7ff;
            box-shadow:0 0 12px #5bc9f0
        }
        .constellation i::after {
          content:"";
            position:absolute;
            left:3px;
            top:2px;
            width:110px;
            height:1px;
            background:linear-gradient(90deg,rgba(116,214,239,.55),transparent);
            transform:rotate(var(--r,20deg));
            transform-origin:left
        }
        .constellation i:nth-child(1) {
          left:10%;
            top:20%;
            --r:28deg
        }
        .constellation i:nth-child(2) {
          left:35%;
            top:42%;
            --r:-18deg
        }
        .constellation i:nth-child(3) {
          left:63%;
            top:27%;
            --r:42deg
        }
        .constellation i:nth-child(4) {
          left:75%;
            top:66%;
            --r:160deg
        }
        .constellation i:nth-child(5) {
          left:26%;
            top:76%;
            --r:-50deg
        }

                .route {
          position:absolute;
            height:1px;
            width:74vw;
            background:linear-gradient(90deg,transparent,rgba(90,190,255,.65),rgba(255,194,72,.52),transparent);
            filter:drop-shadow(0 0 8px rgba(90,190,255,.45))
        }
        .route::after {
          content:"";
            position:absolute;
            top:-3px;
            left:25%;
            width:7px;
            height:7px;
            border-radius:999px;
            background:#ffe7a5;
            box-shadow:0 0 18px rgba(255,211,103,.9);
            animation:packet 6s linear infinite
        }
        .routeOne {
          top:20%;
            left:-15%;
            transform:rotate(-9deg);
            animation:lineOne 16s linear infinite
        }
        .routeTwo {
          top:44%;
            right:-20%;
            transform:rotate(11deg);
            animation:lineTwo 20s linear infinite
        }
        .routeThree {
          top:68%;
            left:10%;
            transform:rotate(-4deg);
            animation:lineThree 24s linear infinite
        }
        .routeFour {
          top:88%;
            right:-20%;
            transform:rotate(7deg);
            animation:lineTwo 27s linear infinite reverse
        }

                .orbitCluster {
          position:absolute;
            width:390px;
            height:260px;
            animation:drift 12s ease-in-out infinite alternate
        }
        .orbitLeft {
          left:-34px;
            top:72px
        }
        .orbitRight {
          right:-46px;
            top:78px;
            transform:scale(.92);
            animation-delay:-4s
        }
        .orbit {
          position:absolute;
            left:0;
            right:0;
            top:50%;
            height:126px;
            border:1px solid rgba(255,181,47,.45);
            border-radius:50%;
            transform:rotate(-12deg);
            animation:orbitPulse 5s ease-in-out infinite alternate
        }
        .orbitB {
          transform:rotate(13deg) scale(.82);
            opacity:.7
        }
        .orbitC {
          transform:rotate(-28deg) scale(.62);
            opacity:.55
        }
        .planet,.moon {
          position:absolute;
            z-index:2;
            border-radius:999px
        }
        .planetBlue {
          left:98px;
            top:54px;
            width:76px;
            height:76px;
            background:radial-gradient(circle at 34% 30%,#d9f5ff,#3c97ff 24%,#0d2e76 58%,#06112c 75%);
            box-shadow:0 0 34px rgba(67,152,255,.7)
        }
        .planetGold {
          left:24px;
            top:122px;
            width:40px;
            height:40px;
            background:radial-gradient(circle at 34% 30%,#fff4b2,#f5ad27 34%,#7c3604 70%);
            box-shadow:0 0 26px rgba(255,173,39,.75)
        }
        .planetGold.large {
          left:205px;
            top:34px;
            width:72px;
            height:72px
        }
        .planetBlue.small {
          left:72px;
            top:132px;
            width:28px;
            height:28px
        }
        .moon {
          width:16px;
            height:16px;
            background:radial-gradient(circle at 30% 30%,#fff,#8bb6d6 45%,#20354c 80%);
            box-shadow:0 0 14px rgba(179,225,255,.55);
            animation:moonOrbit 9s linear infinite
        }
        .moonOne {
          left:170px;
            top:170px
        }
        .moonTwo {
          left:110px;
            top:46px;
            animation-direction:reverse
        }

                .ambient {
          position:absolute;
            width:440px;
            height:440px;
            border-radius:50%;
            filter:blur(80px);
            opacity:.16;
            animation:ambientBreath 9s ease-in-out infinite alternate
        }
        .ambientOne {
          left:12%;
            top:34%;
            background:#0a69ff
        }
        .ambientTwo {
          right:10%;
            top:42%;
            background:#ff9f1a;
            animation-delay:-3s
        }
        .burst {
          position:absolute;
            width:10px;
            height:10px;
            background:#fff0a6;
            box-shadow:0 0 18px rgba(255,222,112,.95),0 0 40px rgba(255,180,54,.55);
            transform:rotate(45deg);
            animation:burst 4.8s ease-in-out infinite
        }
        .burst::before,.burst::after {
          content:"";
            position:absolute;
            left:50%;
            top:50%;
            background:linear-gradient(90deg,transparent,#ffe49a,transparent);
            transform:translate(-50%,-50%)
        }
        .burst::before {
          width:86px;
            height:1px
        }
        .burst::after {
          width:1px;
            height:86px
        }
        .burstOne {
          left:48%;
            top:14%
        }
        .burstTwo {
          right:8%;
            top:27%;
            animation-delay:-2.1s
        }
        .burstThree {
          left:9%;
            top:74%;
            animation-delay:-3.4s
        }
        .burstFour {
          left:22%;
            top:43%;
            animation-delay:-1.2s;
            transform:rotate(45deg) scale(.72)
        }
        .burstFive {
          right:24%;
            top:62%;
            animation-delay:-4.3s;
            transform:rotate(45deg) scale(.86)
        }
        .burstSix {
          left:66%;
            top:32%;
            animation-delay:-5.7s;
            transform:rotate(45deg) scale(.58)
        }
        .burstSeven {
          right:5%;
            top:84%;
            animation-delay:-2.9s;
            transform:rotate(45deg) scale(.7)
        }
        .cosmicDust {
          position:absolute;
            width:4px;
            height:4px;
            border-radius:50%;
            background:#ffeab2;
            box-shadow:90px 40px #9be9ff,180px 130px #fff,270px 60px #ffd477,350px 190px #bc8aff,480px 10px #fff;
            animation:dustDrift 13s linear infinite
        }
        .dustOne {
          left:5%;
            top:28%
        }
        .dustTwo {
          right:6%;
            top:55%;
            animation-delay:-6s
        }


                .siteActivityDock {
          display:flex;
            justify-content:flex-end;
            padding-top:16px
        }

                .siteActivityCounter {
          width:min(100%,430px);
            padding:13px 15px;
            border:1px solid rgba(112,216,239,.24);
            border-radius:16px;
            background:linear-gradient(145deg,rgba(8,27,42,.9),rgba(5,15,26,.94));
            box-shadow:0 14px 34px rgba(0,0,0,.24),inset 0 1px rgba(255,255,255,.04);
            backdrop-filter:blur(12px)
        }

                .activityHeading {
          display:flex;
            align-items:center;
            justify-content:space-between;
            gap:14px;
            margin-bottom:10px
        }

                .activityHeading p {
          margin:0;
            color:#d9f9ff;
            font-size:10px;
            font-weight:950;
            letter-spacing:.16em;
            text-transform:uppercase
        }

                .activityHeading span {
          color:#718a98;
            font-size:10px
        }

                .activityMetrics {
          display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:9px
        }

                .activityMetrics>div {
          min-height:58px;
            padding:9px 12px;
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:12px;
            border:1px solid rgba(255,255,255,.08);
            border-radius:11px;
            background:rgba(255,255,255,.025)
        }

                .activityMetrics strong {
          color:#fff4bf;
            font-family:Georgia,"Times New Roman",serif;
            font-size:24px;
            line-height:1;
            font-variant-numeric:tabular-nums
        }

                .activityMetrics span {
          color:#8fa5b1;
            font-size:9px;
            font-weight:900;
            letter-spacing:.11em;
            text-transform:uppercase;
            text-align:right
        }

                .activityUnavailable {
          margin:9px 0 0;
            color:#8b9aa3;
            font-size:10px;
            text-align:right
        }

                .institution {
          padding-top:25px;
            text-align:center
        }
        .institution>p {
          margin:0;
            color:#d6be86;
            font-size:10px;
            font-weight:950;
            letter-spacing:.34em
        }
        .institutionRule {
          margin-top:11px;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:18px
        }
        .institutionRule span {
          color:#ffe7b0;
            font-family:Georgia,"Times New Roman",serif;
            font-size:17px;
            letter-spacing:.16em
        }
        .institutionRule i {
          width:130px;
            height:1px;
            background:linear-gradient(90deg,transparent,#c78a22)
        }
        .institutionRule i:last-child {
          background:linear-gradient(90deg,#c78a22,transparent)
        }

                .hero {
          padding:52px 0 58px;
            text-align:center
        }
        .heroSeal {
          width:112px;
            height:112px;
            margin:0 auto 22px;
            position:relative;
            display:grid;
            place-items:center;
            border-radius:50%;
            border:1px solid rgba(255,201,92,.42);
            background:radial-gradient(circle,rgba(255,185,52,.14),rgba(6,21,38,.84) 66%);
            box-shadow:0 0 60px rgba(255,180,42,.13),inset 0 0 30px rgba(91,189,255,.08)
        }
        .heroSeal span {
          color:#ffe39a;
            font-family:Georgia,serif;
            font-weight:900;
            font-size:22px;
            letter-spacing:.08em
        }
        .heroSeal i {
          position:absolute;
            inset:12px;
            border:1px solid rgba(112,216,239,.25);
            border-radius:50%;
            animation:sealSpin 16s linear infinite
        }
        .heroSeal i:nth-child(3) {
          inset:24px;
            animation-direction:reverse;
            animation-duration:11s
        }
        .heroSeal i:nth-child(4) {
          inset:37px;
            border-color:rgba(255,198,74,.35);
            animation-duration:8s
        }
        .eyebrow,.bandEyebrow {
          margin:0;
            color:#70dff3;
            font-size:11px;
            font-weight:950;
            letter-spacing:.24em
        }
        .hero h1 {
          max-width:1260px;
            margin:15px auto 20px;
            font-family:Georgia,"Times New Roman",serif;
            font-size:clamp(48px,6.1vw,94px);
            line-height:.96;
            letter-spacing:-.055em;
            text-wrap:balance
        }
        .hero h1 em {
          color:#ffc541;
            font-style:italic;
            text-shadow:0 0 34px rgba(255,184,48,.18)
        }
        .heroLead {
          max-width:1060px;
            margin:0 auto;
            color:#c7d6de;
            font-size:18px;
            line-height:1.7;
            text-wrap:balance
        }
        .heroActions {
          display:flex;
            flex-wrap:wrap;
            justify-content:center;
            gap:12px;
            margin-top:30px
        }
        .grandButton {
          min-height:52px;
            padding:0 22px;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            gap:14px;
            border-radius:14px;
            border:1px solid transparent;
            text-decoration:none;
            font-size:13px;
            font-weight:950;
            position:relative;
            overflow:hidden;
            transition:transform .25s,border-color .25s,box-shadow .25s
        }
        .grandButton::before {
          content:"";
            position:absolute;
            inset:0;
            background:linear-gradient(110deg,transparent 20%,rgba(255,255,255,.28) 46%,transparent 70%);
            transform:translateX(-130%);
            transition:transform .6s
        }
        .grandButton:hover {
          transform:translateY(-4px)
        }
        .grandButton:hover::before {
          transform:translateX(130%)
        }
        .grandButton.primary {
          color:#031019;
            background:linear-gradient(135deg,#c8f7ff,#65d5ef 65%,#36a8ca);
            border-color:#a2effd;
            box-shadow:0 16px 34px rgba(61,190,220,.23),inset 0 1px rgba(255,255,255,.72)
        }
        .grandButton.gold {
          color:#261500;
            background:linear-gradient(135deg,#ffeba9,#efb944 64%,#b87310);
            border-color:#f5d073;
            box-shadow:0 16px 34px rgba(225,164,42,.2),inset 0 1px rgba(255,255,255,.55)
        }
        .grandButton.glass {
          color:#e9fbff;
            border-color:rgba(124,215,236,.29);
            background:linear-gradient(180deg,rgba(18,49,68,.9),rgba(7,24,38,.92));
            box-shadow:inset 0 1px rgba(255,255,255,.05)
        }
        .grandButton.glass:hover {
          border-color:#70d8ef;
            box-shadow:0 14px 30px rgba(29,151,183,.15)
        }
        .heroDefinition {
          display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:15px;
            margin-top:42px;
            text-align:left
        }
        .heroDefinition article {
          padding:23px;
            border:1px solid rgba(111,202,225,.16);
            border-radius:19px;
            background:linear-gradient(145deg,rgba(12,35,50,.72),rgba(6,19,31,.8));
            box-shadow:0 18px 42px rgba(0,0,0,.15)
        }
        .heroDefinition span {
          color:#7698a7;
            font-size:10px;
            font-weight:950;
            letter-spacing:.12em
        }
        .heroDefinition strong {
          display:block;
            margin:14px 0 8px;
            font-family:Georgia,serif;
            font-size:21px
        }
        .heroDefinition p {
          margin:0;
            color:#9eb2bc;
            font-size:13px;
            line-height:1.58
        }

                .sectionIntro {
          max-width:1050px
        }
        .centeredIntro {
          margin:0 auto;
            text-align:center
        }
        .sectionIntro h2,.featureCopy h2,.marketplaceHeader h2,.closingTemple h2 {
          margin:12px 0 16px;
            font-family:Georgia,"Times New Roman",serif;
            font-size:clamp(38px,4.7vw,70px);
            line-height:.99;
            letter-spacing:-.045em;
            text-wrap:balance
        }
        .sectionIntro>p:last-child,.featureCopy>p:not(.eyebrow),.marketplaceHeader p,.closingTemple>p:not(.eyebrow) {
          color:#aebfc8;
            font-size:16px;
            line-height:1.7
        }

                .hall {
          scroll-margin-top:20px;
            padding:56px 18px 54px;
            border-radius:34px;
            border:1px solid rgba(255,194,74,.17);
            background:linear-gradient(180deg,rgba(7,18,30,.55),rgba(3,8,14,.24)),radial-gradient(circle at 50% 0%,rgba(255,185,57,.09),transparent 42%);
            box-shadow:inset 0 1px rgba(255,255,255,.03),0 34px 90px rgba(0,0,0,.3);
            overflow:hidden
        }
        .hallArchitecture {
          position:absolute;
            inset:0;
            opacity:.18;
            pointer-events:none
        }
        .hallArchitecture i {
          position:absolute;
            top:0;
            bottom:0;
            width:4px;
            background:linear-gradient(180deg,#dda33a,transparent 72%);
            box-shadow:0 0 24px #c17c13
        }
        .hallArchitecture i:nth-child(1) {
          left:4%
        }
        .hallArchitecture i:nth-child(2) {
          left:25%
        }
        .hallArchitecture i:nth-child(3) {
          left:50%
        }
        .hallArchitecture i:nth-child(4) {
          left:75%
        }
        .hallArchitecture i:nth-child(5) {
          right:4%
        }
        .hallGlow {
          position:absolute;
            left:50%;
            top:-160px;
            width:1000px;
            height:420px;
            transform:translateX(-50%);
            background:radial-gradient(ellipse,rgba(255,200,99,.14),transparent 68%);
            filter:blur(24px);
            pointer-events:none
        }
        .doors {
          display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:18px;
            margin-top:44px;
            position:relative;
            z-index:2
        }
        .workspace {
          display:block;
            min-width:0;
            color:inherit;
            text-decoration:none
        }
        .doorStage {
          position:relative;
            height:480px;
            overflow:visible;
            perspective:1800px
        }
        .portalHalo {
          position:absolute;
            left:50%;
            top:36px;
            width:245px;
            height:320px;
            transform:translateX(-50%);
            border-radius:50%;
            background:radial-gradient(circle,var(--accentGlow),transparent 68%);
            filter:blur(26px);
            opacity:.45;
            transition:.45s
        }
        .archFrame {
          position:absolute;
            left:50%;
            bottom:68px;
            width:218px;
            height:340px;
            transform:translateX(-50%);
            border:12px solid #b87b16;
            border-radius:132px 132px 16px 16px;
            background:linear-gradient(90deg,#633604,#f1c869 17%,#a76510 50%,#f6d07a 82%,#5e3203),repeating-linear-gradient(100deg,rgba(255,255,255,.08) 0 2px,transparent 2px 8px);
            box-shadow:0 0 0 3px rgba(255,222,153,.5),0 0 36px rgba(255,182,45,.36),inset 0 0 20px rgba(255,232,180,.18);
            transition:.52s cubic-bezier(.2,.75,.18,1)
        }
        .archFrame::before {
          content:"";
            position:absolute;
            left:-28px;
            right:-28px;
            top:132px;
            height:16px;
            background:linear-gradient(180deg,#f7d07a,#8c5109);
            border-radius:4px;
            box-shadow:0 0 12px rgba(255,197,79,.36)
        }
        .archCrown {
          position:absolute;
            left:50%;
            top:-31px;
            width:164px;
            height:104px;
            transform:translateX(-50%);
            border-radius:96px 96px 18px 18px;
            border:2px solid rgba(255,224,160,.5);
            background:radial-gradient(circle at 50% 70%,rgba(255,221,146,.16),transparent 56%),linear-gradient(180deg,#e2aa3b,#764005);
            overflow:hidden
        }
        .crownLine {
          position:absolute;
            left:50%;
            bottom:4px;
            width:2px;
            height:90px;
            background:linear-gradient(180deg,#ffe4a5,#6f3702);
            transform-origin:bottom
        }
        .crownLine.one {
          transform:rotate(-28deg)
        }
        .crownLine.two {
          transform:rotate(0)
        }
        .crownLine.three {
          transform:rotate(28deg)
        }
        .crownGem {
          position:absolute;
            left:50%;
            top:14px;
            width:27px;
            height:27px;
            transform:translateX(-50%) rotate(45deg);
            border:1px solid #ffe2a0;
            background:linear-gradient(135deg,#fff4bd,#f4ae24 55%,#7b3400);
            box-shadow:0 0 18px rgba(255,194,65,.75)
        }
        .doorOpening {
          position:absolute;
            left:12px;
            right:12px;
            top:12px;
            bottom:10px;
            overflow:hidden;
            border-radius:112px 112px 5px 5px;
            background:#07101b;
            box-shadow:inset 0 0 40px rgba(255,246,197,.3);
            transform-style:preserve-3d
        }
        .portalWorld {
          position:absolute;
            inset:0;
            overflow:hidden;
            background:radial-gradient(circle at 50% 44%,color-mix(in srgb,var(--accent) 44%,white),transparent 10%),radial-gradient(circle at 50% 54%,var(--accentGlow),transparent 46%),linear-gradient(180deg,#07111b,#02080f);
            opacity:.9
        }
        .worldGrid {
          position:absolute;
            inset:0;
            opacity:.25;
            background-image:linear-gradient(color-mix(in srgb,var(--accent) 42%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--accent) 42%,transparent) 1px,transparent 1px);
            background-size:26px 26px;
            transform:perspective(280px) rotateX(58deg) scale(1.4);
            transform-origin:center bottom;
            animation:gridMove 10s linear infinite
        }
        .worldOrb {
          position:absolute;
            border-radius:999px;
            background:var(--accent);
            box-shadow:0 0 18px var(--accentGlow);
            animation:worldFloat 5.5s ease-in-out infinite alternate
        }
        .orbOne {
          width:14px;
            height:14px;
            left:25%;
            top:34%
        }
        .orbTwo {
          width:9px;
            height:9px;
            right:22%;
            top:48%;
            animation-delay:-2s
        }
        .orbThree {
          width:7px;
            height:7px;
            left:48%;
            top:22%;
            animation-delay:-3.4s
        }
        .worldLine {
          position:absolute;
            height:1px;
            background:linear-gradient(90deg,transparent,var(--accent),transparent);
            filter:drop-shadow(0 0 5px var(--accentGlow));
            transform-origin:left;
            animation:worldSweep 4.8s linear infinite
        }
        .worldLineOne {
          width:150px;
            left:18px;
            top:90px;
            transform:rotate(22deg)
        }
        .worldLineTwo {
          width:165px;
            left:34px;
            top:150px;
            transform:rotate(-16deg);
            animation-delay:-1.4s
        }
        .worldLineThree {
          width:130px;
            left:54px;
            top:210px;
            transform:rotate(8deg);
            animation-delay:-2.8s
        }
        .worldParticle {
          position:absolute;
            width:4px;
            height:4px;
            border-radius:999px;
            background:color-mix(in srgb,var(--accent) 82%,white);
            box-shadow:0 0 10px var(--accentGlow);
            animation:particleRise 6s linear infinite
        }
        .p1 {
          left:18%;
            bottom:8%
        }
        .p2 {
          left:36%;
            bottom:0;
            animation-delay:-1.4s
        }
        .p3 {
          left:54%;
            bottom:12%;
            animation-delay:-2.8s
        }
        .p4 {
          left:72%;
            bottom:4%;
            animation-delay:-4.1s
        }
        .p5 {
          left:86%;
            bottom:18%;
            animation-delay:-5.2s
        }
        .recordsWorld::after {
          content:"";
            position:absolute;
            inset:52px 45px 62px;
            background:linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,244,210,.62)),repeating-linear-gradient(180deg,transparent 0 11px,rgba(50,65,42,.18) 11px 12px);
            border-radius:4px;
            transform:rotate(-4deg);
            opacity:.2;
            box-shadow:24px 16px rgba(255,255,255,.08),-16px 24px rgba(255,255,255,.06)
        }
        .environmentWorld::before,.environmentWorld::after {
          content:"";
            position:absolute;
            left:-20%;
            width:140%;
            height:44px;
            border-radius:50%;
            border-top:2px solid color-mix(in srgb,var(--accent) 72%,transparent);
            filter:blur(2px);
            animation:airflow 5s ease-in-out infinite alternate
        }
        .environmentWorld::before {
          top:42%;
            transform:rotate(-8deg)
        }
        .environmentWorld::after {
          top:62%;
            transform:rotate(9deg);
            animation-delay:-2s
        }
        .entityWorld::after {
          content:"";
            position:absolute;
            inset:50px 30px 68px;
            border:1px solid color-mix(in srgb,var(--accent) 56%,transparent);
            clip-path:polygon(50% 0,100% 25%,88% 82%,50% 100%,12% 82%,0 25%);
            box-shadow:inset 0 0 24px var(--accentGlow);
            animation:entityPulse 3.8s ease-in-out infinite alternate
        }
        .euWorld::after {
          content:"EU";
            position:absolute;
            left:50%;
            top:48%;
            width:116px;
            height:116px;
            transform:translate(-50%,-50%);
            display:grid;
            place-items:center;
            border-radius:50%;
            border:2px solid #ffd15c;
            color:#fff4bf;
            background:radial-gradient(circle,#2453b8,#071846 72%);
            box-shadow:0 0 36px rgba(255,204,77,.3);
            font-family:Georgia,serif;
            font-size:34px;
            font-weight:900
        }
        .registryWorld::after {
          content:"RG";
            position:absolute;
            left:50%;
            top:48%;
            width:112px;
            height:112px;
            transform:translate(-50%,-50%);
            display:grid;
            place-items:center;
            border-radius:18px;
            border:3px double #f2b95f;
            color:#fff0c1;
            background:linear-gradient(145deg,#563006,#1a1005);
            box-shadow:0 0 36px rgba(236,164,57,.34),inset 0 0 24px rgba(255,210,115,.12);
            font-family:Georgia,serif;
            font-size:31px;
            font-weight:900
        }
        .lightWithin {
          position:absolute;
            inset:0;
            background:linear-gradient(180deg,rgba(255,255,255,.54),transparent 28%),radial-gradient(circle at 50% 48%,rgba(255,255,255,.48),transparent 36%);
            animation:lightPulse 2.6s ease-in-out infinite alternate
        }
        .thresholdMessage {
          position:absolute;
            inset:0;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:8px;
            text-align:center;
            opacity:0;
            transform:scale(.9);
            transition:.45s;
            z-index:1
        }
        .thresholdMessage span {
          width:72px;
            height:72px;
            display:grid;
            place-items:center;
            border-radius:50%;
            border:2px solid var(--accent);
            color:white;
            background:rgba(4,18,30,.58);
            box-shadow:0 0 28px var(--accentGlow);
            font-size:24px;
            font-weight:950
        }
        .thresholdMessage strong {
          font-family:Georgia,serif;
            font-size:22px
        }
        .thresholdMessage small {
          color:var(--accent);
            font-size:9px;
            font-weight:950;
            letter-spacing:.14em
        }
        .doorLeaf {
          position:absolute;
            inset:0;
            transform-style:preserve-3d;
            border:1px solid rgba(255,227,166,.56);
            background:linear-gradient(100deg,rgba(255,255,255,.18),transparent 18%,transparent 78%,rgba(0,0,0,.3)),repeating-linear-gradient(96deg,rgba(255,255,255,.04) 0 2px,transparent 2px 7px),linear-gradient(90deg,#925309,#d99c2b 38%,#b87514 62%,#7e4607);
            box-shadow:inset 0 0 0 3px rgba(93,51,5,.38),inset 0 0 25px rgba(255,222,151,.13),0 8px 24px rgba(0,0,0,.25);
            transition:transform 720ms cubic-bezier(.16,.78,.16,1),filter .32s,box-shadow .32s;
            z-index:3
        }
        .doorLeaf::after {
          content:"";
            position:absolute;
            inset:0;
            background:linear-gradient(110deg,transparent 24%,rgba(255,255,255,.3) 42%,transparent 58%);
            transform:translateX(-130%);
            animation:bronzeSweep 7s ease-in-out infinite
        }
        .singleDoor {
          transform-origin:left center;
            border-radius:110px 110px 5px 5px
        }
        .doorEmblem {
          position:absolute;
            left:50%;
            top:45px;
            width:88px;
            height:88px;
            transform:translateX(-50%);
            border-radius:50%;
            border:5px solid #c78a20;
            background:radial-gradient(circle,color-mix(in srgb,var(--accent) 70%,#06111a),#09111a 72%);
            box-shadow:0 0 0 2px rgba(255,225,157,.55),0 0 24px var(--accentGlow);
            display:grid;
            place-items:center;
            overflow:hidden
        }
        .doorEmblem span {
          color:#fff4c7;
            font-size:26px;
            font-weight:950;
            text-shadow:0 0 14px var(--accentGlow)
        }
        .doorPanels {
          position:absolute;
            left:18px;
            right:18px;
            top:151px;
            bottom:28px;
            display:grid;
            grid-template-columns:repeat(2,1fr);
            grid-template-rows:repeat(3,1fr);
            gap:9px
        }
        .doorPanels i {
          border:2px solid rgba(101,54,5,.62);
            border-radius:3px;
            box-shadow:inset 0 0 0 2px rgba(255,214,132,.12),inset 0 0 12px rgba(77,36,0,.22)
        }
        .hinge {
          position:absolute;
            left:4px;
            width:10px;
            height:38px;
            border-radius:4px;
            background:linear-gradient(90deg,#5e3202,#f1c35e,#693902);
            box-shadow:0 0 8px rgba(255,198,76,.35)
        }
        .h1 {
          top:25%
        }
        .h2 {
          top:48%
        }
        .h3 {
          top:72%
        }
        .doorHandle {
          position:absolute;
            right:18px;
            top:58%;
            width:14px;
            height:14px;
            border-radius:50%;
            background:#fff0aa;
            box-shadow:0 0 12px rgba(255,231,151,.85);
            transition:.24s
        }
        .doorKeyPlate {
          position:absolute;
            right:16px;
            top:64%;
            width:18px;
            height:34px;
            border-radius:8px;
            background:linear-gradient(90deg,#6b3803,#f0bf57,#754104);
            box-shadow:0 0 8px rgba(255,198,76,.28)
        }
        .columns {
          position:absolute;
            bottom:60px;
            width:36px;
            height:274px;
            display:flex;
            gap:2px;
            z-index:4
        }
        .leftColumn {
          left:calc(50% - 142px)
        }
        .rightColumn {
          right:calc(50% - 142px)
        }
        .columns i {
          flex:1;
            border-radius:4px;
            background:linear-gradient(90deg,#653704,#f0c96b 45%,#8b4e08 80%);
            box-shadow:0 0 14px rgba(255,189,60,.28)
        }
        .steps {
          position:absolute;
            left:50%;
            bottom:18px;
            width:286px;
            transform:translateX(-50%);
            display:grid;
            gap:5px;
            z-index:5
        }
        .steps i {
          height:12px;
            border-radius:2px;
            background:linear-gradient(180deg,#e0aa44,#704000);
            box-shadow:0 2px 9px rgba(255,180,39,.32)
        }
        .steps i:nth-child(2) {
          margin-inline:-15px
        }
        .steps i:nth-child(3) {
          margin-inline:-30px
        }
        .lightSpill {
          position:absolute;
            left:50%;
            bottom:-4px;
            width:80px;
            height:190px;
            transform:translateX(-50%) scaleX(.12);
            transform-origin:top;
            clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);
            background:linear-gradient(180deg,rgba(255,248,205,1),rgba(255,185,45,.72) 42%,transparent);
            filter:blur(5px);
            opacity:0;
            transition:.72s cubic-bezier(.2,.75,.18,1);
            z-index:2
        }
        .floorReflection {
          position:absolute;
            left:50%;
            bottom:-28px;
            width:240px;
            height:126px;
            transform:translateX(-50%) perspective(260px) rotateX(62deg);
            background:radial-gradient(ellipse,var(--accentGlow),transparent 68%);
            filter:blur(10px);
            opacity:.2;
            transition:.62s
        }
        .sparkField {
          position:absolute;
            inset:50px 20px 40px;
            opacity:0;
            transition:.35s
        }
        .sparkField i {
          position:absolute;
            left:calc((var(--n) * 17%) % 92%);
            top:calc((var(--n) * 29%) % 84%);
            width:5px;
            height:5px;
            border-radius:50%;
            background:color-mix(in srgb,var(--accent) 72%,white);
            box-shadow:0 0 13px var(--accentGlow);
            animation:sparkPop 2.6s ease-in-out infinite;
            animation-delay:calc(var(--n) * -.17s)
        }
        .workspace:hover .singleDoor,.workspace:focus-visible .singleDoor {
          transform:translateZ(26px) rotateY(-16deg) translateX(-3px);
            filter:saturate(1.18) brightness(1.1);
            box-shadow:inset 0 0 0 3px rgba(93,51,5,.38),inset 0 0 25px rgba(255,222,151,.16),24px 18px 40px rgba(0,0,0,.52)
        }
        .workspace:hover .doorHandle,.workspace:focus-visible .doorHandle {
          transform:rotate(40deg) scale(1.3);
            box-shadow:0 0 20px rgba(255,240,170,1)
        }
        .workspace:hover .lightSpill,.workspace:focus-visible .lightSpill {
          opacity:1;
            transform:translateX(-50%) scaleX(5.6)
        }
        .workspace:hover .portalHalo,.workspace:focus-visible .portalHalo {
          opacity:.95;
            transform:translateX(-50%) scale(1.16)
        }
        .workspace:hover .floorReflection,.workspace:focus-visible .floorReflection {
          opacity:.52;
            transform:translateX(-50%) perspective(260px) rotateX(62deg) scale(1.25)
        }
        .workspace:hover .archFrame,.workspace:focus-visible .archFrame {
          transform:translateX(-50%) translateY(-6px) scale(1.02);
            box-shadow:0 0 0 3px rgba(255,222,153,.7),0 0 58px rgba(255,182,45,.56),inset 0 0 20px rgba(255,232,180,.18)
        }
        .workspace:hover .thresholdMessage,.workspace:focus-visible .thresholdMessage {
          opacity:1;
            transform:scale(1)
        }
        .workspace:hover .sparkField,.workspace:focus-visible .sparkField {
          opacity:1
        }
        .workspaceCard {
          min-height:372px;
            margin-top:-10px;
            padding:22px 20px 20px;
            border-radius:18px;
            border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);
            background:linear-gradient(180deg,rgba(53,35,12,.96),rgba(16,13,10,.98));
            box-shadow:0 16px 44px rgba(0,0,0,.3),inset 0 1px rgba(255,255,255,.03);
            transition:.28s
        }
        .workspace:hover .workspaceCard,.workspace:focus-visible .workspaceCard {
          transform:translateY(-10px);
            border-color:var(--accent);
            box-shadow:0 28px 60px rgba(0,0,0,.4),0 0 34px var(--accentGlow)
        }
        .miniCode {
          display:inline-grid;
            place-items:center;
            min-width:30px;
            height:30px;
            padding:0 8px;
            border-radius:7px;
            border:1px solid var(--accent);
            color:var(--accent);
            background:color-mix(in srgb,var(--accent) 10%,transparent);
            font-size:12px;
            font-weight:950;
            box-shadow:0 0 12px var(--accentGlow)
        }
        .workspaceKicker {
          min-height:auto!important;
            margin:12px 0 0!important;
            color:var(--accent)!important;
            font-size:9px!important;
            font-weight:950;
            letter-spacing:.12em
        }
        .workspaceCard h3 {
          margin:9px 0 8px;
            font-family:Georgia,"Times New Roman",serif;
            font-size:25px;
            letter-spacing:-.025em
        }
        .workspaceCard>p {
          min-height:88px;
            margin:0;
            color:color-mix(in srgb,var(--accent) 70%,white);
            line-height:1.5;
            font-size:14px
        }
        .workspaceCard ul {
          display:grid;
            gap:9px;
            margin:17px 0 0;
            padding:0;
            list-style:none
        }
        .workspaceCard li {
          display:grid;
            grid-template-columns:16px 1fr;
            gap:8px;
            color:#d4e0e8;
            font-size:12px;
            line-height:1.4
        }
        .workspaceCard li span {
          color:var(--accent);
            text-shadow:0 0 10px var(--accentGlow)
        }
        .workspaceCta {
          min-height:46px;
            margin-top:18px;
            padding:0 14px;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:18px;
            border-radius:10px;
            border:1px solid var(--accent);
            color:color-mix(in srgb,var(--accent) 70%,white);
            background:linear-gradient(180deg,color-mix(in srgb,var(--accent) 12%,transparent),rgba(0,0,0,.08));
            box-shadow:inset 0 0 18px color-mix(in srgb,var(--accent) 8%,transparent);
            font-size:12px;
            font-weight:900
        }
        .obsidianFloor {
          position:absolute;
            left:-6%;
            right:-6%;
            bottom:-150px;
            height:310px;
            background:linear-gradient(180deg,rgba(7,12,18,.1),rgba(0,0,0,.82)),repeating-linear-gradient(90deg,transparent 0 119px,rgba(255,255,255,.025) 120px),repeating-linear-gradient(0deg,transparent 0 59px,rgba(255,255,255,.018) 60px);
            transform:perspective(700px) rotateX(66deg);
            transform-origin:center top;
            opacity:.78;
            z-index:0
        }

                .exchangeExplanation {
          padding:125px 0 20px
        }
        .capabilityGrid {
          display:grid;
            grid-template-columns:repeat(4,1fr);
            gap:15px;
            margin-top:34px
        }
        .capabilityGrid article {
          min-height:250px;
            padding:24px;
            border:1px solid rgba(100,195,218,.16);
            border-radius:22px;
            background:radial-gradient(circle at 100% 0%,rgba(83,205,236,.08),transparent 42%),linear-gradient(145deg,rgba(13,37,53,.86),rgba(6,21,34,.92));
            transition:.25s
        }
        .capabilityGrid article:hover {
          transform:translateY(-7px);
            border-color:rgba(112,216,239,.52);
            box-shadow:0 24px 56px rgba(0,0,0,.24)
        }
        .capabilityGrid span {
          width:45px;
            height:45px;
            display:grid;
            place-items:center;
            border-radius:50%;
            border:1px solid rgba(112,216,239,.4);
            color:#8de8fa;
            background:rgba(58,177,207,.07);
            font-size:12px;
            font-weight:950
        }
        .capabilityGrid h3 {
          margin:28px 0 10px;
            font-size:20px
        }
        .capabilityGrid p {
          color:#96adb7;
            line-height:1.6
        }
        .chainVault {
          margin-top:24px;
            padding:28px;
            border:1px solid rgba(255,185,54,.28);
            border-radius:24px;
            background:radial-gradient(circle at 50% 0%,rgba(255,172,32,.08),transparent 38%),linear-gradient(180deg,rgba(6,16,27,.96),rgba(3,9,16,.98));
            box-shadow:0 20px 56px rgba(0,0,0,.28)
        }
        .bandEyebrow {
          color:#ffc64e;
            letter-spacing:.12em
        }
        .chain {
          display:grid;
            grid-template-columns:repeat(8,1fr);
            gap:4px;
            margin-top:18px
        }
        .chainNode {
          position:relative;
            text-align:center
        }
        .chainIcon {
          width:52px;
            height:52px;
            margin:0 auto 8px;
            display:grid;
            place-items:center;
            border-radius:50%;
            border:2px solid #ffc345;
            color:#ffd87c;
            background:rgba(112,69,5,.16);
            box-shadow:0 0 18px rgba(255,184,48,.2);
            font-size:20px
        }
        .chainNode strong {
          display:block;
            color:#ffd16b;
            font-size:10px
        }
        .chainNode i {
          position:absolute;
            right:-7px;
            top:18px;
            color:#f6b62f;
            font-style:normal
        }
        .chainVault>p:last-child {
          max-width:980px;
            margin:18px auto 0;
            color:#aebdc7;
            line-height:1.6;
            text-align:center
        }

                .featureSection {
          min-height:690px;
            margin-top:118px;
            padding:52px;
            display:grid;
            grid-template-columns:1fr 1.15fr;
            gap:72px;
            align-items:center;
            border:1px solid rgba(103,194,220,.17);
            border-radius:32px;
            background:radial-gradient(circle at 0 0,rgba(69,179,228,.09),transparent 40%),linear-gradient(145deg,rgba(12,31,47,.9),rgba(5,15,26,.96));
            box-shadow:0 30px 80px rgba(0,0,0,.24);
            overflow:hidden
        }
        .featureCopy {
          position:relative;
            z-index:2
        }
        .featureCopy p {
          max-width:840px
        }
        .featureActions {
          display:flex;
            flex-wrap:wrap;
            gap:12px;
            margin-top:26px
        }
        .statusFlag {
          display:inline-flex;
            min-height:31px;
            align-items:center;
            padding:0 11px;
            margin-bottom:16px;
            border-radius:999px;
            border:1px solid rgba(255,194,72,.36);
            color:#ffe09b;
            background:rgba(111,69,5,.14);
            font-size:10px;
            font-weight:950;
            letter-spacing:.12em
        }
        .credentialsSection {
          min-height:560px;
            margin-top:118px;
            padding:44px 48px;
            display:grid;
            grid-template-columns:.72fr 1.28fr;
            gap:56px;
            align-items:center;
            border:1px solid rgba(255,194,74,.2);
            border-radius:30px;
            background:radial-gradient(circle at 0 40%,rgba(65,188,216,.13),transparent 38%),radial-gradient(circle at 100% 0,rgba(255,188,62,.1),transparent 34%),linear-gradient(145deg,rgba(11,30,45,.94),rgba(5,15,26,.98));
            box-shadow:0 28px 76px rgba(0,0,0,.25);
            overflow:hidden
        }
        .credentialsVisual {
          height:390px;
            position:relative;
            display:grid;
            place-items:center
        }
        .credentialsHalo {
          position:absolute;
            width:340px;
            height:340px;
            border-radius:50%;
            background:radial-gradient(circle,rgba(89,211,232,.22),rgba(255,191,65,.09) 38%,transparent 68%);
            filter:blur(24px);
            animation:ambientBreath 5s ease-in-out infinite alternate
        }
        .credentialsSeal {
          width:220px;
            height:220px;
            position:relative;
            z-index:3;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            border-radius:50%;
            border:2px solid rgba(255,207,111,.68);
            background:radial-gradient(circle at 36% 30%,rgba(91,211,232,.24),rgba(10,28,43,.96) 55%,rgba(31,19,4,.98));
            box-shadow:0 0 0 10px rgba(255,198,77,.05),0 0 70px rgba(74,202,228,.2),inset 0 0 38px rgba(255,190,66,.12)
        }
        .credentialsSeal::before,.credentialsSeal::after {
          content:"";
            position:absolute;
            border-radius:50%;
            border:1px solid rgba(255,218,143,.26)
        }
        .credentialsSeal::before {
          inset:18px
        }
        .credentialsSeal::after {
          inset:38px;
            border-color:rgba(102,221,236,.25)
        }
        .credentialsSeal small {
          position:relative;
            z-index:2;
            color:#83e3f1;
            font-size:12px;
            font-weight:950;
            letter-spacing:.23em
        }
        .credentialsSeal strong {
          position:relative;
            z-index:2;
            margin:10px 0 8px;
            color:#ffe09a;
            font-family:Georgia,serif;
            font-size:25px;
            letter-spacing:.05em
        }
        .credentialsSeal span {
          position:relative;
            z-index:2;
            max-width:155px;
            color:#abc2ca;
            font-size:8px;
            font-weight:900;
            line-height:1.55;
            letter-spacing:.12em;
            text-align:center
        }
        .credentialOrbit {
          position:absolute;
            border-radius:50%;
            border:1px solid rgba(104,218,235,.3);
            animation:orbitSpin 18s linear infinite
        }
        .credentialOrbit.one {
          width:305px;
            height:305px
        }
        .credentialOrbit.two {
          width:360px;
            height:165px;
            border-color:rgba(255,197,74,.35);
            transform:rotate(34deg);
            animation-direction:reverse;
            animation-duration:24s
        }
        .credentialsCopy {
          position:relative;
            z-index:2
        }
        .credentialsCopy h2 {
          margin:12px 0 16px;
            font-family:Georgia,"Times New Roman",serif;
            font-size:clamp(38px,4.3vw,64px);
            line-height:.99;
            letter-spacing:-.045em;
            text-wrap:balance
        }
        .credentialsCopy>p:not(.eyebrow) {
          max-width:900px;
            color:#aebfc8;
            font-size:15px;
            line-height:1.7
        }
        .credentialsGrid {
          display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:10px;
            margin-top:23px
        }
        .credentialsGrid article {
          display:grid;
            grid-template-columns:38px 1fr;
            gap:12px;
            padding:13px;
            border:1px solid rgba(255,197,76,.14);
            border-radius:13px;
            background:rgba(255,255,255,.022)
        }
        .credentialsGrid article>span {
          width:34px;
            height:34px;
            display:grid;
            place-items:center;
            border-radius:50%;
            border:1px solid rgba(116,218,237,.3);
            color:#86e5f4;
            background:rgba(56,171,196,.08);
            font-size:9px;
            font-weight:950
        }
        .credentialsGrid strong {
          font-size:13px
        }
        .credentialsGrid p {
          margin:4px 0 0;
            color:#9daeb8;
            font-size:11px;
            line-height:1.48
        }
        .credentialsBoundary {
          margin-top:18px;
            padding:15px 17px;
            border:1px solid rgba(255,196,75,.2);
            border-radius:14px;
            background:rgba(98,61,9,.12)
        }
        .credentialsBoundary strong {
          color:#ffe09b;
            font-size:13px
        }
        .credentialsBoundary p {
          margin:6px 0 0;
            color:#aab9c1;
            font-size:11px;
            line-height:1.58
        }
        .credentialsPrimary {
          min-width:310px
        }

                .euSection {
          grid-template-columns:1.15fr 1fr;
            background:radial-gradient(circle at 100% 20%,rgba(42,88,211,.18),transparent 40%),linear-gradient(145deg,rgba(9,27,61,.93),rgba(4,14,31,.98))
        }
        .statStrip {
          display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:10px;
            margin-top:24px
        }
        .statStrip span {
          padding:15px;
            border:1px solid rgba(92,156,255,.18);
            border-radius:13px;
            color:#9eb0ca;
            background:rgba(255,255,255,.025);
            font-size:11px;
            line-height:1.45
        }
        .statStrip b {
          display:block;
            margin-bottom:5px;
            color:#ffd266;
            font-size:12px
        }
        .euUniverse {
          height:500px;
            position:relative;
            display:grid;
            place-items:center
        }
        .euPlanet {
          width:210px;
            height:210px;
            position:relative;
            display:grid;
            place-items:center;
            border-radius:50%;
            background:radial-gradient(circle at 35% 30%,#4b8cff,#123b9c 40%,#061642 74%);
            box-shadow:0 0 80px rgba(49,104,255,.45),inset -20px -20px 50px rgba(0,0,0,.4)
        }
        .euPlanet span {
          font-family:Georgia,serif;
            font-size:54px;
            color:white;
            text-shadow:0 0 24px rgba(255,255,255,.4)
        }
        .euPlanet i {
          position:absolute;
            left:50%;
            top:50%;
            width:8px;
            height:8px;
            border-radius:50%;
            background:#ffd33e;
            box-shadow:0 0 12px #ffd33e;
            transform:rotate(calc(var(--i)*30deg)) translateY(-77px)
        }
        .euOrbit {
          position:absolute;
            width:420px;
            height:170px;
            border:1px solid rgba(255,207,70,.35);
            border-radius:50%;
            animation:orbitSpin 16s linear infinite
        }
        .euOrbit.two {
          transform:rotate(60deg) scale(.78);
            animation-direction:reverse
        }
        .euOrbit.three {
          transform:rotate(-55deg) scale(.58);
            animation-duration:11s
        }
        .articleMarkers span {
          position:absolute;
            min-width:58px;
            height:34px;
            display:grid;
            place-items:center;
            border-radius:999px;
            border:1px solid rgba(255,207,70,.4);
            color:#ffe08d;
            background:rgba(9,25,63,.86);
            font-size:11px;
            font-weight:950;
            box-shadow:0 0 18px rgba(255,190,45,.13)
        }
        .articleMarkers span:nth-child(1) {
          left:4%;
            top:20%
        }
        .articleMarkers span:nth-child(2) {
          right:3%;
            top:28%
        }
        .articleMarkers span:nth-child(3) {
          left:8%;
            bottom:22%
        }
        .articleMarkers span:nth-child(4) {
          right:10%;
            bottom:14%
        }

                .marketplaceSection {
          margin-top:118px;
            padding:58px 48px;
            border:1px solid rgba(255,191,67,.2);
            border-radius:32px;
            background:radial-gradient(circle at 50% 0%,rgba(255,184,40,.09),transparent 42%),linear-gradient(145deg,rgba(28,24,18,.9),rgba(6,16,27,.97));
            box-shadow:0 30px 80px rgba(0,0,0,.25)
        }
        .marketplaceHeader {
          display:flex;
            justify-content:space-between;
            gap:30px;
            align-items:end
        }
        .marketplaceHeader>div {
          max-width:1050px
        }
        .marketGrid {
          display:grid;
            grid-template-columns:repeat(4,1fr);
            gap:15px;
            margin-top:34px
        }
        .marketGrid a {
          min-height:300px;
            padding:24px;
            display:flex;
            flex-direction:column;
            position:relative;
            overflow:hidden;
            border:1px solid rgba(255,198,76,.16);
            border-radius:21px;
            color:inherit;
            text-decoration:none;
            background:linear-gradient(145deg,rgba(43,33,19,.72),rgba(8,19,30,.92));
            transition:.25s
        }
        .marketGrid a::before {
          content:"";
            position:absolute;
            inset:0;
            background:radial-gradient(circle at 100% 0%,rgba(255,191,65,.14),transparent 42%);
            opacity:0;
            transition:.25s
        }
        .marketGrid a:hover {
          transform:translateY(-8px);
            border-color:rgba(255,203,96,.58);
            box-shadow:0 24px 60px rgba(0,0,0,.3)
        }
        .marketGrid a:hover::before {
          opacity:1
        }
        .marketGrid>a>span {
          color:#9f7a35;
            font-size:11px;
            font-weight:950
        }
        .marketOrb {
          width:64px;
            height:64px;
            margin:28px 0 20px;
            border-radius:50%;
            border:1px solid rgba(255,203,96,.42);
            background:radial-gradient(circle,#ffd474,#9b5c0a 40%,#241300 72%);
            box-shadow:0 0 30px rgba(255,183,45,.2)
        }
        .marketGrid h3 {
          font-size:21px
        }
        .marketGrid p {
          color:#aaafa9;
            line-height:1.6
        }
        .marketGrid b {
          display:inline-flex;
            align-items:center;
            gap:10px;
            margin-top:auto;
            color:#ffd478;
            font-size:12px
        }

                .networkSection {
          grid-template-columns:1fr 1.18fr
        }
        .networkVisual {
          height:500px;
            position:relative;
            display:grid;
            place-items:center
        }
        .networkCore {
          width:120px;
            height:120px;
            display:grid;
            place-items:center;
            border-radius:50%;
            border:2px solid #d493ff;
            color:#f4dcff;
            background:radial-gradient(circle,#b96df1,#3a1359 60%,#11071b);
            box-shadow:0 0 55px rgba(190,103,241,.42);
            font-size:28px;
            font-weight:950
        }
        .networkVisual>span {
          position:absolute;
            left:50%;
            top:50%;
            width:48px;
            height:48px;
            border-radius:50%;
            border:1px solid #72dff3;
            background:radial-gradient(circle,#a7f1ff,#176986 64%,#061821);
            box-shadow:0 0 22px rgba(85,207,233,.35);
            transform:rotate(calc(var(--i)*45deg)) translateY(-180px)
        }
        .networkRing {
          position:absolute;
            width:370px;
            height:370px;
            border-radius:50%;
            border:1px solid rgba(112,216,239,.25);
            animation:orbitSpin 18s linear infinite
        }
        .networkRing.two {
          width:290px;
            height:180px;
            border-color:rgba(221,131,255,.28);
            transform:rotate(35deg);
            animation-direction:reverse
        }
        .networkRing.three {
          width:430px;
            height:190px;
            border-color:rgba(255,199,74,.2);
            transform:rotate(-42deg);
            animation-duration:24s
        }
        .networkSteps {
          display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:10px;
            margin-top:24px
        }
        .networkSteps article {
          display:grid;
            grid-template-columns:38px 1fr;
            gap:12px;
            padding:14px;
            border:1px solid rgba(189,108,241,.16);
            border-radius:13px;
            background:rgba(255,255,255,.02)
        }
        .networkSteps article>span {
          width:34px;
            height:34px;
            display:grid;
            place-items:center;
            border-radius:50%;
            border:1px solid rgba(210,141,255,.38);
            color:#e7b9ff;
            font-size:11px;
            font-weight:950
        }
        .networkSteps strong {
          font-size:13px
        }
        .networkSteps p {
          margin:4px 0 0!important;
            color:#9daeb8!important;
            font-size:11px!important;
            line-height:1.45!important
        }

                .recordsConstellation {
          padding-top:130px
        }
        .recordsPair {
          display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:18px;
            margin-top:36px
        }
        .recordWorld {
          min-height:470px;
            padding:36px;
            border:1px solid rgba(103,194,220,.17);
            border-radius:28px;
            background:linear-gradient(145deg,rgba(13,37,53,.88),rgba(6,21,34,.94));
            box-shadow:0 24px 70px rgba(0,0,0,.22)
        }
        .recordVisual {
          height:220px;
            position:relative;
            display:grid;
            place-items:center;
            border-radius:22px;
            background:radial-gradient(circle,rgba(146,229,74,.22),transparent 54%),linear-gradient(180deg,#07141e,#031018);
            overflow:hidden
        }
        .recordVisual i {
          position:absolute;
            width:180px;
            height:120px;
            border:1px solid rgba(158,232,76,.3);
            border-radius:8px;
            transform:rotate(-5deg);
            background:repeating-linear-gradient(180deg,rgba(255,255,255,.04) 0 10px,transparent 10px 20px)
        }
        .recordVisual i:nth-child(2) {
          transform:translate(30px,14px) rotate(4deg)
        }
        .recordVisual i:nth-child(3) {
          transform:translate(-28px,24px) rotate(-10deg)
        }
        .recordVisual span {
          position:relative;
            z-index:2;
            width:86px;
            height:86px;
            display:grid;
            place-items:center;
            border-radius:50%;
            border:2px solid #9ee84c;
            color:#efffd9;
            background:rgba(21,53,20,.72);
            box-shadow:0 0 28px rgba(143,225,62,.35);
            font-size:27px;
            font-weight:950
        }
        .recordVisual.atmosphere {
          background:radial-gradient(circle,rgba(67,218,230,.24),transparent 54%),linear-gradient(180deg,#07141e,#031018)
        }
        .recordVisual.atmosphere i {
          width:150%;
            height:40px;
            border:0;
            border-top:2px solid rgba(101,232,241,.42);
            border-radius:50%;
            background:none;
            animation:airflow 5s ease-in-out infinite alternate
        }
        .recordVisual.atmosphere i:nth-child(2) {
          top:35%;
            transform:rotate(-8deg)
        }
        .recordVisual.atmosphere i:nth-child(3) {
          top:60%;
            transform:rotate(8deg);
            animation-delay:-2s
        }
        .recordVisual.atmosphere span {
          border-color:#65e8f1;
            background:rgba(7,48,56,.72);
            box-shadow:0 0 28px rgba(67,218,230,.35)
        }
        .recordWorld h3 {
          margin:26px 0 10px;
            font-family:Georgia,serif;
            font-size:32px
        }
        .recordWorld p {
          color:#9fb2bc;
            line-height:1.65
        }
        .recordWorld a {
          min-height:46px;
            margin-top:18px;
            padding:0 16px;
            display:inline-flex;
            align-items:center;
            gap:13px;
            border-radius:11px;
            border:1px solid rgba(112,216,239,.35);
            color:#c9f6ff;
            background:rgba(36,129,153,.09);
            text-decoration:none;
            font-size:12px;
            font-weight:950
        }
        .polishedAction {
          position:relative;
            overflow:hidden;
            box-shadow:inset 0 1px rgba(255,255,255,.08),0 10px 24px rgba(0,0,0,.18);
            transition:transform .25s,border-color .25s,box-shadow .25s
        }
        .polishedAction::before {
          content:"";
            position:absolute;
            inset:0;
            background:linear-gradient(110deg,transparent 22%,rgba(255,255,255,.22) 46%,transparent 70%);
            transform:translateX(-130%);
            transition:transform .58s
        }
        .polishedAction:hover {
          transform:translateY(-3px);
            border-color:#77e5f5;
            box-shadow:inset 0 1px rgba(255,255,255,.12),0 16px 30px rgba(0,0,0,.28),0 0 24px rgba(75,205,231,.15)
        }
        .polishedAction:hover::before {
          transform:translateX(130%)
        }

                .verificationSection {
          min-height:610px;
            margin-top:118px;
            padding:56px;
            display:grid;
            grid-template-columns:1fr 1.1fr;
            gap:70px;
            align-items:center;
            border:1px solid rgba(103,194,220,.17);
            border-radius:32px;
            background:radial-gradient(circle at 0 50%,rgba(38,173,223,.14),transparent 44%),linear-gradient(145deg,rgba(8,29,43,.94),rgba(4,14,24,.98));
            overflow:hidden
        }
        .verificationBeam {
          height:450px;
            position:relative
        }
        .verificationBeam::before {
          content:"";
            position:absolute;
            left:50%;
            top:2%;
            bottom:2%;
            width:2px;
            background:linear-gradient(180deg,transparent,#70e0f4,#ffd46f,transparent);
            box-shadow:0 0 22px #70e0f4
        }
        .verificationBeam::after {
          content:"";
            position:absolute;
            left:50%;
            top:50%;
            width:360px;
            height:360px;
            transform:translate(-50%,-50%);
            border-radius:50%;
            border:1px solid rgba(112,216,239,.24);
            box-shadow:0 0 70px rgba(59,198,230,.14),inset 0 0 70px rgba(255,199,76,.08);
            animation:sealSpin 18s linear infinite
        }
        .verificationBeam span {
          position:absolute;
            left:50%;
            width:110px;
            height:110px;
            transform:translateX(-50%) rotate(45deg);
            border:1px solid rgba(255,212,109,.38);
            background:rgba(4,24,35,.74);
            box-shadow:0 0 30px rgba(68,206,235,.2)
        }
        .verificationBeam span:nth-child(1) {
          top:8%
        }
        .verificationBeam span:nth-child(2) {
          top:38%;
            width:140px;
            height:140px
        }
        .verificationBeam span:nth-child(3) {
          bottom:8%
        }

                .closingTemple {
          margin-top:120px;
            padding:80px 36px;
            text-align:center;
            border:1px solid rgba(255,191,67,.24);
            border-radius:34px;
            background:radial-gradient(circle at 50% 0%,rgba(255,194,73,.12),transparent 42%),linear-gradient(145deg,rgba(27,28,33,.92),rgba(6,15,25,.98));
            box-shadow:0 34px 90px rgba(0,0,0,.3);
            overflow:hidden
        }
        .closingTemple h2 {
          max-width:1100px;
            margin:16px auto
        }
        .closingTemple>p:not(.eyebrow) {
          max-width:930px;
            margin:0 auto
        }
        .centeredActions {
          justify-content:center
        }
        .closingBurst {
          position:absolute;
            left:50%;
            top:-190px;
            width:480px;
            height:480px;
            transform:translateX(-50%);
            border-radius:50%;
            background:radial-gradient(circle,rgba(255,210,113,.2),transparent 64%);
            filter:blur(20px);
            animation:ambientBreath 4s ease-in-out infinite alternate
        }
        .sealChain {
          margin:34px auto 18px;
            display:flex;
            flex-wrap:wrap;
            justify-content:center;
            gap:8px 14px;
            color:#ffd06a;
            font-family:Georgia,serif;
            font-size:16px
        }
        .sealChain span {
          display:inline-flex;
            align-items:center;
            gap:14px
        }
        .sealChain i {
          color:#b87818;
            font-style:normal
        }
        .closingTemple>strong {
          color:#f6e0a7;
            font-size:15px
        }
        footer {
          min-height:90px;
            display:flex;
            justify-content:space-between;
            align-items:center;
            color:#718694;
            font-size:11px
        }


                .grandButton.artifactButton {
          color:#1b0803;
            background:linear-gradient(135deg,#ffe6d7,#ffae7b 55%,#ff7848);
            border-color:#ffc2a0;
            box-shadow:0 16px 34px rgba(255,111,61,.23),inset 0 1px rgba(255,255,255,.65)
        }

                .artifactDoor {
          grid-column:span 2;
            border-color:rgba(255,143,91,.44);
            background:radial-gradient(circle at 50% 8%,rgba(255,119,64,.17),transparent 39%),linear-gradient(145deg,rgba(30,16,22,.95),rgba(7,18,29,.98))
        }

                .artifactDoor::after {
          content:"DOOR VIII";
            position:absolute;
            right:18px;
            top:18px;
            z-index:8;
            padding:8px 12px;
            border:1px solid rgba(255,177,137,.4);
            border-radius:999px;
            color:#ffe2d2;
            background:rgba(62,22,16,.72);
            font-size:9px;
            font-weight:950;
            letter-spacing:.18em;
            box-shadow:0 0 24px rgba(255,112,62,.16)
        }

                .artifactDoor .doorStage {
          background:radial-gradient(circle at 50% 24%,rgba(255,105,54,.22),transparent 42%),linear-gradient(180deg,rgba(13,22,34,.98),rgba(9,7,13,.99))
        }

                .artifactDoor .archFrame {
          filter:drop-shadow(0 0 26px rgba(255,109,58,.24))
        }

                .artifactDoor .portalHalo {
          background:radial-gradient(circle,rgba(255,138,82,.28),rgba(255,105,54,.08) 38%,transparent 70%)
        }

                .artifactDoor .thresholdMessage {
          border-color:rgba(255,158,111,.4);
            background:rgba(35,13,12,.78);
            box-shadow:0 0 36px rgba(255,112,62,.18)
        }

                .artifactDoor .workspaceCta {
          border-color:rgba(255,157,109,.38);
            color:#ffe4d6;
            background:rgba(255,109,58,.08)
        }

                .doorLaunchFlag {
          display:inline-flex;
            width:max-content;
            margin:0 0 12px;
            padding:7px 10px;
            border:1px solid rgba(255,160,114,.35);
            border-radius:999px;
            color:#ffd8c4;
            background:rgba(255,111,61,.09);
            font-size:9px;
            font-weight:950;
            letter-spacing:.17em
        }

                .artifactWorld {
          background:radial-gradient(circle at 50% 24%,rgba(255,139,75,.5),transparent 17%),radial-gradient(circle at 30% 70%,rgba(72,202,255,.28),transparent 34%),linear-gradient(180deg,#1c0d13,#07131f 58%,#02070d)
        }

                .artifactWorld::before {
          content:"";
            position:absolute;
            inset:13%;
            border:1px solid rgba(255,168,116,.32);
            clip-path:polygon(50% 0,100% 24%,100% 76%,50% 100%,0 76%,0 24%);
            box-shadow:inset 0 0 35px rgba(255,105,54,.13);
            animation:artifactHexPulse 4.8s ease-in-out infinite alternate
        }

                .artifactWorld::after {
          content:"";
            position:absolute;
            left:14%;
            right:14%;
            top:48%;
            height:2px;
            background:linear-gradient(90deg,transparent,#ff9b69,#78e5ff,#ff9b69,transparent);
            box-shadow:0 0 16px rgba(255,126,74,.65);
            animation:artifactScan 3.8s ease-in-out infinite
        }

                .artifactLaunchDeck {
          margin-top:34px;
            padding:42px;
            position:relative;
            display:grid;
            grid-template-columns:340px 1fr;
            gap:54px;
            align-items:center;
            border:1px solid rgba(255,151,101,.34);
            border-radius:30px;
            background:radial-gradient(circle at 12% 50%,rgba(255,103,48,.18),transparent 34%),radial-gradient(circle at 90% 18%,rgba(67,205,239,.11),transparent 31%),linear-gradient(145deg,rgba(27,12,18,.96),rgba(5,17,29,.98));
            box-shadow:0 34px 90px rgba(0,0,0,.36),inset 0 1px rgba(255,255,255,.05);
            overflow:hidden
        }

                .artifactLaunchDeck::before {
          content:"";
            position:absolute;
            inset:0;
            background:linear-gradient(110deg,transparent 24%,rgba(255,255,255,.04) 49%,transparent 74%);
            transform:translateX(-120%);
            animation:bronzeSweep 8s ease-in-out infinite
        }

                .artifactLaunchSignal {
          height:310px;
            position:relative;
            display:grid;
            place-items:center
        }

                .signalCore {
          position:relative;
            z-index:5;
            width:112px;
            height:112px;
            display:grid;
            place-items:center;
            border-radius:24px;
            transform:rotate(45deg);
            border:2px solid #ffae7c;
            color:#fff0e7;
            background:linear-gradient(145deg,rgba(255,112,59,.42),rgba(8,26,40,.94));
            box-shadow:0 0 42px rgba(255,106,55,.36),inset 0 0 28px rgba(88,218,247,.13);
            font-family:Georgia,serif;
            font-size:30px;
            font-weight:950
        }

                .signalCore::first-line {
          transform:rotate(-45deg)
        }

                .signalRing {
          position:absolute;
            border:1px solid rgba(255,157,105,.35);
            border-radius:50%;
            animation:orbitSpin 18s linear infinite
        }

                .signalRing.ringOne {
          width:205px;
            height:205px
        }

                .signalRing.ringTwo {
          width:270px;
            height:130px;
            transform:rotate(28deg);
            animation-direction:reverse;
            animation-duration:13s
        }

                .signalRing.ringThree {
          width:300px;
            height:165px;
            transform:rotate(-38deg);
            border-color:rgba(97,220,245,.26);
            animation-duration:23s
        }

                .signalBeam {
          position:absolute;
            width:290px;
            height:1px;
            background:linear-gradient(90deg,transparent,rgba(255,151,98,.8),transparent);
            filter:drop-shadow(0 0 6px rgba(255,125,72,.75))
        }

                .signalBeam.beamOne {
          transform:rotate(45deg)
        }

                .signalBeam.beamTwo {
          transform:rotate(-45deg)
        }

                .artifactLaunchCopy {
          position:relative;
            z-index:2
        }

                .artifactLaunchCopy h2 {
          max-width:900px;
            margin:12px 0 14px;
            font-family:Georgia,"Times New Roman",serif;
            font-size:clamp(38px,4.4vw,68px);
            line-height:1.02;
            letter-spacing:-.04em
        }

                .artifactLaunchCopy>p:not(.eyebrow) {
          max-width:950px;
            color:#c3d2da;
            font-size:16px;
            line-height:1.7
        }

                .artifactLaunchMetrics {
          display:grid;
            grid-template-columns:repeat(4,1fr);
            gap:10px;
            margin-top:24px
        }

                .artifactLaunchMetrics article {
          padding:16px;
            border:1px solid rgba(255,155,105,.18);
            border-radius:14px;
            background:rgba(255,255,255,.025)
        }

                .artifactLaunchMetrics strong {
          display:block;
            color:#ffb082;
            font-family:Georgia,serif;
            font-size:29px
        }

                .artifactLaunchMetrics span {
          display:block;
            margin-top:4px;
            color:#91a6b1;
            font-size:10px;
            font-weight:850;
            letter-spacing:.08em;
            text-transform:uppercase
        }

                .artifactLaunchActions {
          display:flex;
            flex-wrap:wrap;
            gap:10px;
            margin-top:24px
        }


        
        .grandButton.academyButton {
          color:#041a10;
          background:linear-gradient(135deg,#d9ffeb,#64f2ad 56%,#1fbd78);
          border-color:#9dffd0;
          box-shadow:0 16px 34px rgba(50,219,142,.22),inset 0 1px rgba(255,255,255,.72)
        }
        .institutionalDoors {
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:20px
        }
        .institutionDoor {
          position:relative
        }
        .institutionDoor .doorStage {
          height:535px
        }
        .grandArch {
          width:236px;
          height:370px;
          border-width:14px;
          border-radius:145px 145px 18px 18px;
          background:linear-gradient(90deg,#4b2d12,#d7b270 14%,#7b4b1a 29%,#f0d59b 48%,#7d4b18 68%,#d1a85f 84%,#43270e),repeating-linear-gradient(92deg,rgba(255,255,255,.07) 0 2px,transparent 2px 9px)
        }
        .grandDoorLeaf {
          background:linear-gradient(100deg,rgba(255,255,255,.14),transparent 20%,transparent 76%,rgba(0,0,0,.33)),repeating-linear-gradient(96deg,rgba(255,255,255,.035) 0 2px,transparent 2px 8px),linear-gradient(90deg,#5c3514,#ad7938 34%,#d0a45f 51%,#9a6429 68%,#4f2d10)
        }
        .carvedPanels i {
          border-color:rgba(69,38,13,.7);
          border-radius:14px 14px 5px 5px;
          box-shadow:inset 0 0 0 2px rgba(255,230,179,.09),inset 0 0 18px rgba(47,24,5,.34)
        }
        .interiorVista {
          position:absolute;
          inset:0;
          z-index:1;
          opacity:.74;
          background:linear-gradient(180deg,rgba(255,244,205,.22),transparent 22%),radial-gradient(ellipse at 50% 90%,var(--accentGlow),transparent 52%)
        }
        .interiorVista span {
          position:absolute;
          left:50%;
          bottom:18%;
          width:46px;
          height:170px;
          transform:translateX(-50%);
          border-radius:24px 24px 0 0;
          border:1px solid color-mix(in srgb,var(--accent) 46%,white);
          background:linear-gradient(180deg,color-mix(in srgb,var(--accent) 18%,transparent),rgba(2,9,15,.38));
          box-shadow:0 0 30px var(--accentGlow)
        }
        .interiorVista span:nth-child(2) {transform:translateX(-120px) scale(.72);opacity:.5}
        .interiorVista span:nth-child(3) {transform:translateX(74px) scale(.72);opacity:.5}
        .institutionDoor:hover .singleDoor,.institutionDoor:focus-visible .singleDoor {
          transform:translateZ(36px) rotateY(-34deg) translateX(-8px);
          filter:saturate(1.16) brightness(1.08);
          box-shadow:inset 0 0 0 3px rgba(58,32,10,.45),inset 0 0 30px rgba(255,228,170,.18),34px 24px 56px rgba(0,0,0,.62)
        }
        .grandLightSpill {
          width:118px;
          height:245px;
          background:linear-gradient(180deg,rgba(255,251,221,1),color-mix(in srgb,var(--accent) 55%,#ffd16f) 38%,transparent 92%)
        }
        .institutionDoor:hover .grandLightSpill,.institutionDoor:focus-visible .grandLightSpill {
          transform:translateX(-50%) scaleX(6.8);
          opacity:.95
        }
        .dustInLight {
          position:absolute;
          left:50%;
          bottom:5px;
          width:310px;
          height:220px;
          transform:translateX(-50%);
          opacity:0;
          z-index:6;
          pointer-events:none;
          transition:opacity .5s
        }
        .dustInLight i {
          position:absolute;
          left:calc((var(--d) * 23%) % 96%);
          bottom:calc((var(--d) * 13%) % 45%);
          width:4px;
          height:4px;
          border-radius:50%;
          background:#fff4c8;
          box-shadow:0 0 10px #ffe298;
          animation:dustRise calc(3.8s + var(--d) * .12s) linear infinite;
          animation-delay:calc(var(--d) * -.31s)
        }
        .institutionDoor:hover .dustInLight,.institutionDoor:focus-visible .dustInLight {opacity:.9}
        .institutionalCard {
          min-height:404px;
          background:linear-gradient(180deg,rgba(34,27,18,.97),rgba(9,13,17,.99))
        }
        .academyDoor .archFrame {
          box-shadow:0 0 0 3px rgba(190,255,218,.45),0 0 52px rgba(57,242,161,.34),inset 0 0 24px rgba(200,255,223,.16)
        }
        .environmentalWorlds {
          margin-top:96px;
          padding:46px;
          border:1px solid rgba(120,230,176,.22);
          border-radius:30px;
          background:radial-gradient(circle at 10% 0%,rgba(77,225,166,.12),transparent 38%),radial-gradient(circle at 100% 100%,rgba(75,202,238,.1),transparent 40%),linear-gradient(145deg,rgba(8,31,34,.94),rgba(4,16,27,.98));
          box-shadow:0 28px 76px rgba(0,0,0,.26)
        }
        .environmentalWorldsIntro {max-width:1080px}
        .environmentalWorldsIntro h2 {
          margin:12px 0 16px;
          font-family:Georgia,"Times New Roman",serif;
          font-size:clamp(38px,4.7vw,70px);
          line-height:.99;
          letter-spacing:-.045em
        }
        .environmentalWorldsIntro>p:last-child {color:#afc7c2;font-size:16px;line-height:1.7}
        .environmentalWorldGrid {display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:30px}
        .environmentalWorldGrid a {
          min-height:285px;padding:24px;display:flex;flex-direction:column;
          border:1px solid rgba(118,228,181,.18);border-radius:20px;color:inherit;text-decoration:none;
          background:linear-gradient(145deg,rgba(18,55,53,.72),rgba(6,23,31,.94));
          box-shadow:inset 0 1px rgba(255,255,255,.03);
          transition:transform .26s,border-color .26s,box-shadow .26s
        }
        .environmentalWorldGrid a:hover {transform:translateY(-8px);border-color:rgba(120,230,176,.58);box-shadow:0 24px 56px rgba(0,0,0,.3),0 0 30px rgba(87,223,174,.12)}
        .environmentalWorldGrid a>span {width:max-content;min-width:46px;height:38px;padding:0 10px;display:grid;place-items:center;border-radius:10px;border:1px solid rgba(120,230,176,.45);color:#aef7d1;background:rgba(76,206,155,.08);font-size:11px;font-weight:950;letter-spacing:.08em}
        .environmentalWorldGrid h3 {margin:24px 0 10px;font-family:Georgia,"Times New Roman",serif;font-size:25px}
        .environmentalWorldGrid p {margin:0;color:#a7bdb8;font-size:13px;line-height:1.62}
        .environmentalWorldGrid b {margin-top:auto;padding-top:20px;display:inline-flex;align-items:center;gap:9px;color:#8de8c1;font-size:11px}


        .institutionUtilityRail {
          margin-top:22px;
          padding:18px 22px;
          display:flex;
          flex-wrap:wrap;
          align-items:center;
          justify-content:center;
          gap:12px;
          border:1px solid rgba(112,216,239,.18);
          border-radius:18px;
          background:linear-gradient(145deg,rgba(8,27,42,.82),rgba(5,15,26,.88));
          box-shadow:0 18px 42px rgba(0,0,0,.18),inset 0 1px rgba(255,255,255,.04)
        }
        .institutionUtilityRail>span {
          margin-right:8px;
          color:#7698a7;
          font-size:9px;
          font-weight:950;
          letter-spacing:.16em
        }
        .institutionUtilityRail a {
          padding:9px 12px;
          border:1px solid rgba(255,255,255,.08);
          border-radius:10px;
          color:#dff9ff;
          background:rgba(255,255,255,.025);
          text-decoration:none;
          font-size:11px;
          font-weight:900;
          transition:.25s
        }
        .institutionUtilityRail a:hover {
          border-color:rgba(112,216,239,.5);
          transform:translateY(-2px)
        }

        .academySpine {
          margin-top:120px;
          min-height:760px;
          padding:56px;
          display:grid;
          grid-template-columns:.86fr 1.34fr;
          gap:68px;
          align-items:center;
          border:1px solid rgba(74,240,163,.24);
          border-radius:34px;
          background:radial-gradient(circle at 15% 45%,rgba(57,242,161,.15),transparent 36%),radial-gradient(circle at 92% 10%,rgba(78,190,255,.1),transparent 34%),linear-gradient(145deg,rgba(7,34,27,.94),rgba(4,15,25,.98));
          box-shadow:0 32px 90px rgba(0,0,0,.3)
        }
        .academySpineVisual {
          min-height:520px;
          position:relative;
          display:grid;
          place-items:center
        }
        .academyCentralSeal {
          width:220px;
          height:220px;
          position:relative;
          z-index:5;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          border-radius:50%;
          border:2px solid #8dffd0;
          background:radial-gradient(circle at 34% 28%,rgba(191,255,222,.3),rgba(9,61,40,.96) 48%,rgba(3,19,15,.99));
          box-shadow:0 0 72px rgba(57,242,161,.32),inset 0 0 40px rgba(130,255,196,.15)
        }
        .academyCentralSeal small {color:#baffda;font-weight:950;letter-spacing:.25em}
        .academyCentralSeal strong {margin:10px 0;color:#ecfff5;font-family:Georgia,serif;font-size:31px}
        .academyCentralSeal span {max-width:150px;color:#9fd8bd;font-size:9px;font-weight:900;line-height:1.5;letter-spacing:.13em;text-align:center}
        .academyOrbit {
          position:absolute;
          border-radius:50%;
          border:1px solid rgba(98,246,178,.3);
          animation:orbitSpin 22s linear infinite
        }
        .academyOrbit.orbitOne {width:360px;height:360px}
        .academyOrbit.orbitTwo {width:470px;height:220px;transform:rotate(34deg);animation-direction:reverse;animation-duration:28s}
        .academyOrbit.orbitThree {width:520px;height:260px;transform:rotate(-42deg);border-color:rgba(88,193,255,.24);animation-duration:34s}
        .academySpineVisual>b {
          position:absolute;
          left:50%;
          top:50%;
          width:58px;
          height:58px;
          display:grid;
          place-items:center;
          border-radius:50%;
          border:1px solid rgba(171,255,214,.46);
          color:#dffff0;
          background:radial-gradient(circle,#2f9e70,#0d3e2d 68%,#03130e);
          box-shadow:0 0 24px rgba(57,242,161,.28);
          transform:rotate(calc(var(--i)*45deg)) translateY(-205px) rotate(calc(var(--i)*-45deg));
          font-size:10px
        }
        .academySpineCopy h2,.entityReviewGateway h2,.modernizationSection h2 {
          margin:12px 0 16px;
          font-family:Georgia,"Times New Roman",serif;
          font-size:clamp(38px,4.8vw,72px);
          line-height:.99;
          letter-spacing:-.045em
        }
        .academySpineCopy>p:not(.eyebrow),.entityReviewGateway .sectionIntro>p:last-child,.modernizationSection .sectionIntro>p:last-child {color:#afc4bd;font-size:16px;line-height:1.72}
        .academyDomainGrid {display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:25px}
        .academyDomainGrid a {
          min-height:126px;
          padding:15px;
          display:grid;
          grid-template-columns:46px 1fr 18px;
          gap:12px;
          align-items:start;
          border:1px solid rgba(78,232,160,.16);
          border-radius:15px;
          color:inherit;
          text-decoration:none;
          background:rgba(255,255,255,.024);
          transition:.25s
        }
        .academyDomainGrid a:hover {transform:translateY(-4px);border-color:rgba(106,255,188,.52);box-shadow:0 18px 40px rgba(0,0,0,.22)}
        .academyDomainGrid a>span {width:42px;height:42px;display:grid;place-items:center;border-radius:50%;border:1px solid #69eeb2;color:#baffd8;background:rgba(57,242,161,.08);font-size:10px;font-weight:950}
        .academyDomainGrid strong {font-size:13px}
        .academyDomainGrid p {margin:5px 0 0;color:#94aaa0;font-size:11px;line-height:1.5}
        .academyDomainGrid a>b {color:#6ef2b0}
        .entityReviewGateway {
          margin-top:120px;
          padding:62px 48px;
          border:1px solid rgba(213,131,255,.22);
          border-radius:34px;
          background:radial-gradient(circle at 100% 0,rgba(205,104,255,.12),transparent 36%),linear-gradient(145deg,rgba(28,13,40,.94),rgba(5,16,26,.98));
          box-shadow:0 32px 90px rgba(0,0,0,.3)
        }
        .reviewJourney {display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:34px}
        .reviewJourney article {min-height:220px;padding:20px;border:1px solid rgba(214,139,255,.16);border-radius:18px;background:linear-gradient(145deg,rgba(49,24,66,.5),rgba(8,20,31,.9));transition:.25s}
        .reviewJourney article:hover {transform:translateY(-6px);border-color:rgba(222,157,255,.46);box-shadow:0 22px 50px rgba(0,0,0,.28)}
        .reviewJourney article>span {width:44px;height:44px;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(221,151,255,.5);color:#efc9ff;background:rgba(199,91,255,.08);font-size:11px;font-weight:950}
        .reviewJourney small {display:block;margin-top:18px;color:#9a77a8;font-size:9px;font-weight:900;letter-spacing:.1em}
        .reviewJourney h3 {margin:8px 0;font-size:18px}
        .reviewJourney p {margin:0;color:#a7aeb7;font-size:12px;line-height:1.55}
        .reviewReadinessPanel {display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:22px}
        .reviewReadinessPanel>div {padding:24px;border:1px solid rgba(114,216,239,.16);border-radius:19px;background:rgba(255,255,255,.025)}
        .reviewReadinessPanel h3 {margin:10px 0 14px;font-family:Georgia,serif;font-size:25px}
        .reviewReadinessPanel ul {display:grid;gap:10px;margin:0;padding-left:18px;color:#aebdc5;font-size:12px;line-height:1.5}
        .modernizationSection {margin-top:120px;padding:64px 48px;border:1px solid rgba(255,190,67,.22);border-radius:34px;background:radial-gradient(circle at 50% 0,rgba(255,186,51,.11),transparent 40%),linear-gradient(145deg,rgba(31,24,15,.95),rgba(5,15,25,.98));box-shadow:0 32px 90px rgba(0,0,0,.3)}
        .modernizationGrid {display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:36px}
        .modernizationGrid article {min-height:470px;padding:32px;border:1px solid rgba(255,198,78,.18);border-radius:24px;background:linear-gradient(145deg,rgba(52,37,18,.7),rgba(8,19,30,.94));box-shadow:0 22px 60px rgba(0,0,0,.24)}
        .modernCode {width:62px;height:62px;display:grid;place-items:center;border-radius:50%;border:1px solid #ffd16c;color:#ffe3a3;background:rgba(255,191,59,.08);box-shadow:0 0 28px rgba(255,186,51,.16);font-size:12px;font-weight:950}
        .modernizationGrid h3 {margin:24px 0 12px;font-family:Georgia,serif;font-size:34px}
        .modernizationGrid p {color:#b6b4ad;line-height:1.68}
        .modernizationGrid ul {display:grid;gap:11px;margin:20px 0 26px;padding:0;list-style:none;color:#d3c6a7;font-size:13px}
        .modernizationGrid .polishedAction {min-height:48px;padding:0 17px;display:inline-flex;align-items:center;gap:12px;border-radius:11px;border:1px solid rgba(255,202,95,.35);color:#ffe3a5;background:rgba(255,184,43,.07);text-decoration:none;font-size:12px;font-weight:950}
        .comparisonRoute {margin-top:24px;padding:18px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px 16px;border:1px solid rgba(255,202,95,.17);border-radius:17px;background:rgba(255,255,255,.02);color:#e8d4a5;font-size:10px;font-weight:950;letter-spacing:.09em}
        .comparisonRoute i {color:#d49423;font-style:normal}
        @keyframes dustRise {
          from {transform:translateY(18px) translateX(-8px) scale(.6);opacity:0}
          20% {opacity:.8}
          80% {opacity:.55}
          to {transform:translateY(-190px) translateX(18px) scale(1.2);opacity:0}
        }
        @keyframes artifactHexPulse {
          from {
            transform:scale(.92) rotate(-3deg);
              opacity:.42
          }
          to {
            transform:scale(1.03) rotate(3deg);
              opacity:.9
          }

        }

                @keyframes artifactScan {
          0%,100% {
            transform:translateY(-66px);
              opacity:.2
          }
          50% {
            transform:translateY(66px);
              opacity:1
          }

        }

                @keyframes starsOne {
          to {
            transform:translate3d(110px,145px,0)
          }

        }
        @keyframes starsTwo {
          to {
            transform:translate3d(-120px,100px,0)
          }

        }
        @keyframes pulseStars {
          from {
            opacity:.18;
              transform:scale(.98)
          }
          to {
            opacity:.42;
              transform:scale(1.02)
          }

        }
        @keyframes shooting {
          0% {
            transform:translate(-20vw,-10vh) rotate(-24deg);
              opacity:0
          }
          8% {
            opacity:1
          }
          35% {
            opacity:0
          }
          100% {
            transform:translate(140vw,70vh) rotate(-24deg);
              opacity:0
          }

        }
        @keyframes lineOne {
          from {
            transform:translateX(-30vw) rotate(-9deg);
              opacity:0
          }
          16% {
            opacity:.5
          }
          82% {
            opacity:.35
          }
          to {
            transform:translateX(105vw) rotate(-9deg);
              opacity:0
          }

        }
        @keyframes lineTwo {
          from {
            transform:translateX(30vw) rotate(11deg);
              opacity:0
          }
          18% {
            opacity:.45
          }
          85% {
            opacity:.3
          }
          to {
            transform:translateX(-105vw) rotate(11deg);
              opacity:0
          }

        }
        @keyframes lineThree {
          from {
            transform:translateX(-50vw) rotate(-4deg);
              opacity:0
          }
          20% {
            opacity:.38
          }
          82% {
            opacity:.28
          }
          to {
            transform:translateX(90vw) rotate(-4deg);
              opacity:0
          }

        }
        @keyframes packet {
          from {
            transform:translateX(-20vw);
              opacity:0
          }
          15% {
            opacity:1
          }
          80% {
            opacity:1
          }
          to {
            transform:translateX(80vw);
              opacity:0
          }

        }
        @keyframes burst {
          0%,55%,100% {
            transform:rotate(45deg) scale(.35);
              opacity:.15
          }
          66% {
            transform:rotate(45deg) scale(1.15);
              opacity:1
          }

        }
        @keyframes drift {
          to {
            translate:8px 12px
          }

        }
        @keyframes ambientBreath {
          from {
            transform:scale(.92);
              opacity:.1
          }
          to {
            transform:scale(1.08);
              opacity:.22
          }

        }
        @keyframes nebulaFloat {
          to {
            transform:translate(70px,-40px) scale(1.12)
          }

        }
        @keyframes orbitPulse {
          to {
            opacity:.72;
              filter:drop-shadow(0 0 10px rgba(255,190,58,.25))
          }

        }
        @keyframes moonOrbit {
          to {
            transform:rotate(360deg) translateX(120px) rotate(-360deg)
          }

        }
        @keyframes dustDrift {
          to {
            transform:translate(160px,-100px);
              opacity:0
          }

        }
        @keyframes sealSpin {
          to {
            transform:rotate(360deg)
          }

        }
        @keyframes gridMove {
          to {
            background-position:0 26px,26px 0
          }

        }
        @keyframes worldFloat {
          from {
            transform:translate3d(-4px,-6px,0) scale(.9)
          }
          to {
            transform:translate3d(7px,12px,0) scale(1.15)
          }

        }
        @keyframes worldSweep {
          from {
            opacity:0;
              translate:-30px 0
          }
          25% {
            opacity:.8
          }
          75% {
            opacity:.55
          }
          to {
            opacity:0;
              translate:70px 0
          }

        }
        @keyframes particleRise {
          from {
            transform:translateY(18px) scale(.7);
              opacity:0
          }
          20% {
            opacity:.8
          }
          80% {
            opacity:.6
          }
          to {
            transform:translateY(-240px) scale(1.2);
              opacity:0
          }

        }
        @keyframes bronzeSweep {
          0%,58% {
            transform:translateX(-130%)
          }
          78%,100% {
            transform:translateX(130%)
          }

        }
        @keyframes airflow {
          from {
            translate:-14px -4px;
              opacity:.28
          }
          to {
            translate:16px 6px;
              opacity:.7
          }

        }
        @keyframes entityPulse {
          from {
            transform:scale(.94) rotate(-2deg);
              opacity:.35
          }
          to {
            transform:scale(1.04) rotate(2deg);
              opacity:.75
          }

        }
        @keyframes lightPulse {
          from {
            opacity:.42
          }
          to {
            opacity:.88
          }

        }
        @keyframes sparkPop {
          0%,100% {
            transform:scale(.3);
              opacity:.15
          }
          50% {
            transform:scale(1.5);
              opacity:1
          }

        }
        @keyframes orbitSpin {
          to {
            rotate:360deg
          }

        }

                @media(max-width:1280px) {
          .doors {
            grid-template-columns:repeat(3,1fr)
          }
          .artifactDoor {
            grid-column:span 3
          }
          .artifactLaunchDeck {
            grid-template-columns:280px 1fr
          }
          .doorStage {
            height:500px
          }
          .capabilityGrid,.marketGrid {
            grid-template-columns:repeat(2,1fr)
          }
          .featureSection,.verificationSection {
            grid-template-columns:1fr
          }
          .credentialsVisual,.euUniverse,.networkVisual,.verificationBeam {
            order:2
          }
          .chain {
            grid-template-columns:repeat(4,1fr);
              row-gap:18px
          }
          .chainNode i {
            display:none
          }

        }

                @media(max-width:980px) {
          .doors {
            grid-template-columns:repeat(2,1fr)
          }
          .artifactDoor {
            grid-column:span 2
          }
          .artifactLaunchDeck {
            grid-template-columns:1fr
          }
          .artifactLaunchSignal {
            height:250px
          }
          .artifactLaunchMetrics {
            grid-template-columns:repeat(2,1fr)
          }

        }
        @media(max-width:760px) {
          .institutionUtilityRail {align-items:stretch}
          .institutionUtilityRail>span {width:100%;text-align:center;margin:0 0 4px}
          .institutionUtilityRail a {flex:1 1 42%;text-align:center}
          .siteActivityDock {
            justify-content:center;
              padding-top:12px
          }
          .siteActivityCounter {
            width:100%
          }
          .activityHeading {
            align-items:flex-start;
              flex-direction:column;
              gap:3px
          }
          .shell {
            width:min(100% - 20px,1540px)
          }
          .institutionRule i {
            width:42px
          }
          .institutionRule span {
            font-size:13px;
              letter-spacing:.08em
          }
          .hero {
            padding-top:38px
          }
          .hero h1 {
            font-size:clamp(42px,12vw,64px)
          }
          .heroLead {
            font-size:16px
          }
          .heroDefinition,.doors,.capabilityGrid,.marketGrid,.recordsPair,.credentialsGrid,.statStrip,.networkSteps {
            grid-template-columns:1fr
          }
          .heroActions .grandButton,.featureActions .grandButton {
            width:100%
          }
          .hall {
            padding-inline:10px
          }
          .artifactDoor {
            grid-column:span 1
          }
          .artifactLaunchDeck {
            padding:30px 18px
          }
          .artifactLaunchMetrics {
            grid-template-columns:1fr 1fr
          }
          .artifactLaunchActions .grandButton {
            width:100%
          }
          .doorStage {
            height:475px
          }
          .featureSection,.credentialsSection,.marketplaceSection,.verificationSection {
            padding:34px 20px;
              margin-top:80px
          }
          .marketplaceHeader {
            display:grid
          }
          .chain {
            grid-template-columns:repeat(2,1fr)
          }
          .credentialsVisual,.euUniverse,.networkVisual,.verificationBeam {
            height:390px
          }
          .credentialsVisual {
            transform:scale(.82)
          }
          .euUniverse {
            transform:scale(.8)
          }
          .networkVisual {
            transform:scale(.8)
          }
          .sectionIntro h2,.featureCopy h2,.marketplaceHeader h2,.closingTemple h2 {
            font-size:clamp(34px,10vw,52px)
          }
          footer {
            flex-direction:column;
              align-items:flex-start;
              justify-content:center;
              gap:6px
          }

        }

        
        @media(max-width:1280px) {
          .institutionalDoors {grid-template-columns:repeat(2,1fr)}
          .academySpine {grid-template-columns:1fr}
          .reviewJourney {grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:980px) {
          .institutionalDoors {grid-template-columns:repeat(2,1fr)}
          .academyDomainGrid {grid-template-columns:1fr}
          .modernizationGrid {grid-template-columns:1fr}
        }
        @media(max-width:760px) {
          .institutionalDoors,.reviewJourney,.reviewReadinessPanel {grid-template-columns:1fr}
          .academySpine,.entityReviewGateway,.modernizationSection,.environmentalWorlds {padding:34px 20px;margin-top:80px}
          .academySpineVisual {min-height:390px;transform:scale(.76)}
          .institutionDoor .doorStage {height:500px}
          .institutionRule span {max-width:260px}
        }
        @media(prefers-reduced-motion:reduce) {
          *,*::before,*::after {
            animation-duration:1ms!important;
              animation-iteration-count:1!important;
              transition-duration:1ms!important;
              scroll-behavior:auto!important
          }

        }


      `}</style>
    </main>
  );
}
