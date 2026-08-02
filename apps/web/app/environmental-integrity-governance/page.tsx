"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Pathway = {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  accent: string;
  glow: string;
  academy: string;
  capabilities: string[];
  outputs: string[];
};

const pathways: Pathway[] = [
  {
    id: "air",
    code: "AIR",
    title: "Atmospheric Integrity Records",
    subtitle: "Preserve the atmosphere as attributable evidence",
    description:
      "Create bounded atmospheric records that preserve where, when, how, and under what operating conditions air was measured, interpreted, challenged, and relied upon.",
    href: "/environmental-records",
    accent: "#6fe8ff",
    glow: "rgba(78, 221, 255, .46)",
    academy: "Atmospheric Integrity Records Academy",
    capabilities: [
      "Exterior-to-interior atmospheric comparison",
      "Instrument identity, calibration, location, and chronology",
      "Psychrometric, particulate, gas, pressure, and sound channels",
      "Baseline, intervention, restoration, and future-reliance records",
    ],
    outputs: [
      "Atmospheric Integrity Record",
      "Building protection comparison",
      "Continuity and admissibility finding",
      "Bounded environmental interpretation",
    ],
  },
  {
    id: "pair",
    code: "PAIR",
    title: "Personal Atmospheric Integrity Records",
    subtitle: "Preserve the atmosphere encountered by a person",
    description:
      "Build person-centered atmospheric records that bind environmental exposure, location, chronology, instruments, activity, transitions, and declared limitations without turning evidence into unsupported medical certainty.",
    href: "/environmental-records",
    accent: "#b08cff",
    glow: "rgba(176, 140, 255, .42)",
    academy: "Personal Atmospheric Integrity Records Academy",
    capabilities: [
      "Personal exposure chronology and location transitions",
      "Indoor, outdoor, vehicle, workplace, and public-space contexts",
      "Activity-validity and instrument-continuity review",
      "Separation of atmospheric evidence from diagnosis",
    ],
    outputs: [
      "Personal Atmospheric Integrity Record",
      "Exposure chronology",
      "Context and limitation declaration",
      "Future-comparison package",
    ],
  },
  {
    id: "building",
    code: "BLDG",
    title: "Building & Facility Integrity",
    subtitle: "Determine whether a place remained valid for its activity",
    description:
      "Govern the environmental state of hospitals, laboratories, schools, data centers, cleanrooms, public buildings, housing, industrial facilities, and critical infrastructure.",
    href: "/built-environment",
    accent: "#39f2a1",
    glow: "rgba(57, 242, 161, .42)",
    academy: "Building Environmental Integrity Academy",
    capabilities: [
      "Occupancy, activity, room, zone, and facility boundaries",
      "Pressure, humidity, dew point, ventilation, moisture, and power",
      "Hospital, laboratory, cleanroom, school, and data-center pathways",
      "Closure, restriction, restoration, and reopening determinations",
    ],
    outputs: [
      "Building Environmental Record",
      "Activity-validity determination",
      "Facility restoration record",
      "Verified reopening package",
    ],
  },
  {
    id: "hvac",
    code: "HVAC",
    title: "HVAC Governance",
    subtitle: "Turn field work into governed technical evidence",
    description:
      "Connect diagnostic evidence, electrical integrity, refrigerant governance, airflow, moisture, technician activity, intervention authority, and verified outcome through one preserved route.",
    href: "/built-environment",
    accent: "#ffd15c",
    glow: "rgba(255, 209, 92, .42)",
    academy: "HVAC Academy",
    capabilities: [
      "HVAC diagnostic and electrical integrity records",
      "Refrigerant, nitrogen, evacuation, charging, and recovery governance",
      "Airflow, static pressure, fan, moisture, and psychrometric evidence",
      "Technician competency, intervention, and post-intervention verification",
    ],
    outputs: [
      "Governed HVAC Diagnostic Record",
      "Electrical Integrity Record",
      "Refrigerant Governance Record",
      "Post-Intervention Performance Record",
    ],
  },
  {
    id: "environment",
    code: "ENV",
    title: "Air, Water, Land & Pollution Governance",
    subtitle: "Govern environmental evidence across media and jurisdictions",
    description:
      "Preserve environmental reality across air, water, soil, land, waste, contamination, industrial release, remediation, and anti-pollution pathways while distinguishing measurement from legal or scientific conclusion.",
    href: "/workspace/environmental-records",
    accent: "#71d58d",
    glow: "rgba(113, 213, 141, .42)",
    academy: "Environmental Evidence Academy",
    capabilities: [
      "Air, water, soil, land, waste, and contamination records",
      "Sampling plans, chain of custody, laboratory evidence, and field evidence",
      "Threshold, permit, standard, law, and jurisdiction mapping",
      "Remediation, restoration, and outcome-comparison pathways",
    ],
    outputs: [
      "Governed Environmental Interpretation Record",
      "Contamination evidence package",
      "Remediation comparison",
      "Environmental outcome record",
    ],
  },
  {
    id: "review",
    code: "ER",
    title: "Environmental Entity Review",
    subtitle: "Review what an environmental entity can actually prove",
    description:
      "Guide organizations through a structured review of a bounded environmental capability, record system, instrument pathway, governance claim, intervention process, or outcome-verification method.",
    href: "/workspace/entity-review",
    accent: "#ff9f68",
    glow: "rgba(255, 159, 104, .42)",
    academy: "Environmental Entity Review Academy",
    capabilities: [
      "Guided claim, scope, non-claim, evidence, and authority construction",
      "Instrument, method, version, confidentiality, and publication boundaries",
      "Readiness checks and evidence-gap detection",
      "Bounded findings, corrective actions, artifacts, and reassessment",
    ],
    outputs: [
      "Environmental entity review package",
      "Bounded findings record",
      "Corrective action pathway",
      "Publication or registry option",
    ],
  },
  {
    id: "records",
    code: "REG",
    title: "Environmental Records & Registry",
    subtitle: "Preserve environmental evidence for inspection and future reliance",
    description:
      "Create, preserve, register, verify, compare, challenge, correct, and supersede environmental records without erasing prior versions or overstating what the evidence supports.",
    href: "/environmental-records",
    accent: "#5ba6ff",
    glow: "rgba(91, 166, 255, .42)",
    academy: "Environmental Records Academy",
    capabilities: [
      "Record creation, interpretation, review, export, and verification",
      "Attribution, chronology, custody, versioning, and integrity packages",
      "Challenge, correction, supersession, and preserved history",
      "Cross-record comparison and future-reliance pathways",
    ],
    outputs: [
      "Registered environmental record",
      "Verification package",
      "Version and correction history",
      "Comparative outcome record",
    ],
  },
  {
    id: "academy",
    code: "AC",
    title: "Environmental Integrity Governance Academy",
    subtitle: "Learn the domain before consequence is bound",
    description:
      "Enter the educational backbone for atmospheric records, PAIR, HVAC, buildings, sensors, environmental evidence, intervention, entity review, law, standards, and outcome verification.",
    href: "/academy",
    accent: "#62f0c4",
    glow: "rgba(98, 240, 196, .42)",
    academy: "Central Environmental Integrity Academy",
    capabilities: [
      "Start-here routes, architecture explorers, and learning pathways",
      "Demonstrations, simulations, labs, and failure analysis",
      "Assessments, credentials, instructor routes, and accreditation",
      "Domain academies connected directly to live governance workspaces",
    ],
    outputs: [
      "Learning record",
      "Simulation evidence",
      "Assessment result",
      "Credential or readiness status",
    ],
  },
];

const governingChain = [
  ["Reality", "◉", "The actual environmental condition, activity, place, person, system, or event."],
  ["Record", "▤", "The preserved measurement, observation, media, identity, time, place, and context."],
  ["Continuity", "∞", "The proof that the record remained attributable, chronological, intact, and comparable."],
  ["Admissibility", "⬡", "The determination of what evidence may support which environmental proposition."],
  ["Binding", "⌁", "The authority, threshold, activity, subject, place, and consequence joined before action."],
  ["Commit", "◆", "The preserved environmental determination before intervention or reliance."],
  ["Intervention", "▷", "The governed technical, operational, legal, or protective action taken."],
  ["Outcome", "♛", "The verified environmental result returned to the record for future reliance."],
] as const;

const determinations = [
  ["ALLOW", "The evidence and authority support the bounded environmental action or reliance."],
  ["HOLD", "The route pauses because evidence, continuity, authority, or conditions remain incomplete."],
  ["DENY", "The proposed action or claim is not supported within the preserved boundary."],
  ["ESCALATE", "Conflict, consequence, uncertainty, or authority requires another qualified decision-maker."],
] as const;

const academyDoors = [
  ["AIR", "Atmospheric Integrity Records Academy", "Atmospheric evidence, instruments, continuity, interpretation, and future reliance."],
  ["PAIR", "Personal Atmospheric Integrity Records Academy", "Personal atmospheric chronology, activity contexts, boundaries, and comparison."],
  ["HVAC", "HVAC Academy", "Diagnostics, electrical integrity, refrigerant governance, field evidence, and competency."],
  ["BLDG", "Building Environmental Integrity Academy", "Hospitals, laboratories, schools, facilities, activity validity, and restoration."],
  ["ENV", "Environmental Evidence Academy", "Air, water, soil, contamination, sampling, custody, remediation, and outcome."],
  ["ER", "Environmental Entity Review Academy", "Learn the review, build the package, validate readiness, submit, and understand findings."],
] as const;

const evidenceChannels = [
  "Dry-bulb temperature",
  "Wet-bulb temperature",
  "Relative humidity",
  "Dew point",
  "Humidity ratio",
  "Enthalpy",
  "Specific volume",
  "Static pressure",
  "Differential pressure",
  "Airflow",
  "Particulate matter",
  "Volatile organic compounds",
  "Carbon dioxide",
  "Carbon monoxide",
  "Radon",
  "Sound",
  "Moisture",
  "Water quality",
  "Soil and land evidence",
  "Electrical condition",
  "Refrigerant condition",
  "Equipment state",
  "Occupancy and activity",
  "Authority and intervention",
] as const;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function EnvironmentalIntegrityGovernancePage() {
  const [selectedPathway, setSelectedPathway] = useState(pathways[0].id);
  const [activeChainIndex, setActiveChainIndex] = useState(0);
  const [expandedEvidence, setExpandedEvidence] = useState(false);

  const selected = useMemo(
    () => pathways.find((pathway) => pathway.id === selectedPathway) ?? pathways[0],
    [selectedPathway],
  );

  return (
    <main>
      <div className="environmentCanvas" aria-hidden="true">
        <div className="atmosphere atmosphereOne" />
        <div className="atmosphere atmosphereTwo" />
        <div className="atmosphere atmosphereThree" />
        <div className="gridField" />
        <div className="horizon" />
        <div className="route routeOne" />
        <div className="route routeTwo" />
        <div className="route routeThree" />
        <div className="particleField pOne" />
        <div className="particleField pTwo" />
      </div>

      <section className="institutionBar shell">
        <Link href="/" className="institutionIdentity">
          <span className="institutionSeal">TA</span>
          <span>
            <strong>TA-14 Authority Governance Institution</strong>
            <small>Environmental Integrity Governance</small>
          </span>
        </Link>
        <nav aria-label="Environmental integrity navigation">
          <Link href="/">Institution Home</Link>
          <Link href="/academy">TA-14 Academy</Link>
          <Link href="/environmental-records">Environmental Records</Link>
          <Link className="navPrimary" href="/workspace/environmental-records">Enter Workspace</Link>
        </nav>
      </section>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">TA-14 ENVIRONMENTAL INTEGRITY GOVERNANCE</p>
          <h1>
            Govern environmental reality
            <em> before intervention becomes consequence.</em>
          </h1>
          <p className="heroLead">
            Environmental Integrity Governance is the institutional division that preserves environmental reality from measurement through outcome. It brings Atmospheric Integrity Records, Personal Atmospheric Integrity Records, buildings, HVAC, air, water, land, pollution, environmental entity review, records, registries, and Academy pathways under one governed roof.
          </p>
          <div className="heroActions">
            <Link className="button primary" href="#pathways">Enter Environmental Integrity Governance <span>↓</span></Link>
            <Link className="button secondary" href="/workspace/environmental-records">Open Environmental Records Workspace <Arrow /></Link>
            <Link className="button secondary" href="/academy">Enter Environmental Integrity Academy <Arrow /></Link>
          </div>
          <div className="governingRule">
            <span>THE GOVERNING RULE</span>
            <strong>No admissible environmental evidence. No admissible environmental intervention.</strong>
          </div>
        </div>

        <div className="heroInstrument" aria-label="Environmental integrity system overview">
          <div className="instrumentHalo" />
          <div className="instrumentCore">
            <span className="coreCode">EIG</span>
            <strong>Environmental Integrity</strong>
            <small>REALITY · RECORD · INTERVENTION · OUTCOME</small>
          </div>
          <div className="orbit orbitA"><i>Air</i></div>
          <div className="orbit orbitB"><i>Water</i></div>
          <div className="orbit orbitC"><i>Buildings</i></div>
          <div className="orbit orbitD"><i>HVAC</i></div>
          <div className="orbit orbitE"><i>Evidence</i></div>
          <div className="instrumentReadout">
            <span><b>08</b> governed pathways</span>
            <span><b>04</b> determination states</span>
            <span><b>01</b> preserved route</span>
          </div>
        </div>
      </section>

      <section className="definitionBand shell">
        <article>
          <span>WHAT IT GOVERNS</span>
          <strong>Environmental reality across people, places, systems, and time</strong>
          <p>Air, water, land, buildings, HVAC, sensors, laboratories, facilities, contamination, interventions, restoration, and verified outcomes.</p>
        </article>
        <article>
          <span>WHAT IT SEPARATES</span>
          <strong>Measurement, interpretation, determination, intervention, and outcome</strong>
          <p>No measurement automatically becomes a diagnosis, compliance claim, safety claim, remediation claim, or permission to act.</p>
        </article>
        <article>
          <span>WHAT IT PRESERVES</span>
          <strong>The complete environmental route</strong>
          <p>Identity, location, activity, chronology, instruments, evidence, authority, limitations, determination, intervention, and resulting condition.</p>
        </article>
      </section>

      <section className="pathwaySection shell" id="pathways">
        <div className="sectionHeading centered">
          <p className="eyebrow">THE ENVIRONMENTAL INSTITUTION</p>
          <h2>One governed division. Eight connected pathways.</h2>
          <p>Atmospheric records and HVAC do not stand outside Environmental Integrity Governance. They are specialized pathways inside the division, connected to records, entity review, Academy instruction, intervention governance, and outcome verification.</p>
        </div>

        <div className="pathwayLayout">
          <div className="pathwayRail" role="tablist" aria-label="Environmental integrity pathways">
            {pathways.map((pathway) => (
              <button
                type="button"
                role="tab"
                aria-selected={selected.id === pathway.id}
                className={selected.id === pathway.id ? "active" : ""}
                key={pathway.id}
                onClick={() => setSelectedPathway(pathway.id)}
                style={{ "--pathAccent": pathway.accent, "--pathGlow": pathway.glow } as CSSProperties}
              >
                <span>{pathway.code}</span>
                <div>
                  <strong>{pathway.title}</strong>
                  <small>{pathway.subtitle}</small>
                </div>
                <i>→</i>
              </button>
            ))}
          </div>

          <article
            className="pathwayDetail"
            style={{ "--pathAccent": selected.accent, "--pathGlow": selected.glow } as CSSProperties}
          >
            <div className="detailPortal" aria-hidden="true">
              <div className="portalGlow" />
              <div className="portalRing ringOne" />
              <div className="portalRing ringTwo" />
              <div className="portalCore">
                <span>{selected.code}</span>
                <small>ENVIRONMENTAL PATHWAY</small>
              </div>
            </div>
            <div className="detailCopy">
              <p className="pathKicker">{selected.subtitle}</p>
              <h3>{selected.title}</h3>
              <p className="pathDescription">{selected.description}</p>
              <div className="detailColumns">
                <div>
                  <span className="miniHeading">CAPABILITIES</span>
                  <ul>{selected.capabilities.map((item) => <li key={item}><i>✦</i>{item}</li>)}</ul>
                </div>
                <div>
                  <span className="miniHeading">GOVERNED OUTPUTS</span>
                  <ul>{selected.outputs.map((item) => <li key={item}><i>◆</i>{item}</li>)}</ul>
                </div>
              </div>
              <div className="academyBridge">
                <span>ACADEMY PATHWAY</span>
                <strong>{selected.academy}</strong>
                <p>Learn the evidence, boundaries, failure modes, examples, and readiness requirements before entering the live pathway.</p>
              </div>
              <div className="detailActions">
                <Link className="button primary" href={selected.href}>Enter {selected.title} <Arrow /></Link>
                <Link className="button secondary" href="/academy">Open Academy Pathway <Arrow /></Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="chainSection shell">
        <div className="sectionHeading">
          <p className="eyebrow">THE ENVIRONMENTAL GOVERNING CHAIN</p>
          <h2>Environmental evidence must survive every transition from reality to outcome.</h2>
          <p>Choose a stage to inspect what the institution preserves. No stage is allowed to disappear into the next, and no intervention is treated as proof that the intended environmental outcome occurred.</p>
        </div>

        <div className="chainInterface">
          <div className="chainTrack">
            {governingChain.map(([label, icon], index) => (
              <button
                type="button"
                key={label}
                className={activeChainIndex === index ? "active" : ""}
                onClick={() => setActiveChainIndex(index)}
              >
                <span>{icon}</span>
                <strong>{label}</strong>
                {index < governingChain.length - 1 ? <i>→</i> : null}
              </button>
            ))}
          </div>
          <article className="chainExplanation">
            <span>STAGE {String(activeChainIndex + 1).padStart(2, "0")}</span>
            <h3>{governingChain[activeChainIndex][0]}</h3>
            <p>{governingChain[activeChainIndex][2]}</p>
            <div className="chainBoundary">
              <strong>Institutional question</strong>
              <p>{[
                "What environmental reality actually existed, for whom, where, during which activity, and under what conditions?",
                "What was preserved, by which instrument or observer, at what time and place, and with what declared context?",
                "Can the evidence be traced without unexplained gaps, substitutions, stale calibration, broken custody, or invalid comparison?",
                "What proposition may this evidence support, and what conclusion remains outside the evidence boundary?",
                "Which authority, threshold, subject, activity, place, intervention, and consequence are being joined?",
                "What determination was preserved before anyone acted, relied, restricted, reopened, remediated, or declared success?",
                "Did the actual technical or operational intervention correspond to the committed determination and remain within its limits?",
                "What changed in reality, was the intended protection achieved, did it persist, and what new evidence returned to the record?",
              ][activeChainIndex]}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="determinationSection shell">
        <div className="sectionHeading centered">
          <p className="eyebrow">FOUR ENVIRONMENTAL DETERMINATIONS</p>
          <h2>Every governed route must end in a bounded state before consequence is allowed.</h2>
        </div>
        <div className="determinationGrid">
          {determinations.map(([title, text], index) => (
            <article key={title} className={`state state${index + 1}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <small>Preserved with evidence, authority, scope, limitations, and review path.</small>
            </article>
          ))}
        </div>
      </section>

      <section className="recordsSection shell">
        <div className="recordsCopy">
          <p className="eyebrow">ENVIRONMENTAL RECORDS</p>
          <h2>Environmental data becomes governable only when its identity, continuity, meaning, and limits are preserved.</h2>
          <p>The institution accepts many evidence channels, but it does not flatten them into one generic score. Each channel remains connected to its instrument, location, activity, chronology, calibration, authority, interpretation boundary, and intended use.</p>
          <button type="button" className="textButton" onClick={() => setExpandedEvidence((current) => !current)}>
            {expandedEvidence ? "Show core evidence channels" : "Show all evidence channels"} <span>{expandedEvidence ? "↑" : "↓"}</span>
          </button>
          <div className={`evidenceGrid ${expandedEvidence ? "expanded" : ""}`}>
            {evidenceChannels.slice(0, expandedEvidence ? evidenceChannels.length : 12).map((channel, index) => (
              <div key={channel}><span>{String(index + 1).padStart(2, "0")}</span><strong>{channel}</strong></div>
            ))}
          </div>
        </div>
        <aside className="recordVault">
          <div className="vaultHeader"><span>ENVIRONMENTAL RECORD VAULT</span><b>INSPECTABLE</b></div>
          <div className="recordStack">
            {["Reality declaration", "Instrument and method record", "Continuity package", "Admissibility finding", "Authority and threshold map", "Committed determination", "Intervention record", "Outcome verification"].map((item, index) => (
              <article key={item} style={{ "--stack": index } as CSSProperties}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                <i>{index < 3 ? "EVIDENCE" : index < 6 ? "GOVERNANCE" : "OUTCOME"}</i>
              </article>
            ))}
          </div>
          <p>A complete environmental route preserves what was observed, what was admitted, who had authority, what was decided, what was done, and what reality showed afterward.</p>
        </aside>
      </section>

      <section className="academySection shell">
        <div className="academyVisual" aria-hidden="true">
          <div className="academySeal"><small>TA-14</small><strong>ACADEMY</strong><span>ENVIRONMENTAL INTEGRITY</span></div>
          <i className="academyOrbit orbitOne" />
          <i className="academyOrbit orbitTwo" />
          <i className="academyOrbit orbitThree" />
        </div>
        <div className="academyCopy">
          <p className="eyebrow">THE ACADEMY INSIDE THE DIVISION</p>
          <h2>Learn the environmental pathway, inspect failure, practice the route, and prove readiness before live reliance.</h2>
          <p>The Environmental Integrity Governance Academy is not separate from the work. Every pathway teaches the participant what each required element means, why it matters, what evidence supports it, what creates a HOLD, and how to construct a defensible environmental record.</p>
          <div className="academyGrid">
            {academyDoors.map(([code, title, text]) => (
              <Link href="/academy" key={title}>
                <span>{code}</span>
                <div><strong>{title}</strong><p>{text}</p></div>
                <b>↗</b>
              </Link>
            ))}
          </div>
          <div className="heroActions leftActions">
            <Link className="button academyButton" href="/academy">Enter Environmental Integrity Academy <Arrow /></Link>
            <Link className="button secondary" href="/academy/simulation-center">Open Simulation Center <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="entityReviewSection shell">
        <div className="sectionHeading">
          <p className="eyebrow">ENVIRONMENTAL ENTITY REVIEW</p>
          <h2>Do not hand TA-14 a pile of documents. Build a review-ready environmental package with the institution guiding every step.</h2>
          <p>The guided review pathway teaches the participant what is required while it assembles entity identity, bounded capability, scope, non-claims, evidence, authority, instrument versions, confidentiality, execution pathway, limitations, and publication permissions.</p>
        </div>
        <div className="reviewRoute">
          {["Learn", "Define", "Bound", "Evidence", "Authority", "Validate", "Submit", "Findings"].map((step, index) => (
            <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < 7 ? <i>→</i> : null}</div>
          ))}
        </div>
        <div className="reviewPanels">
          <article>
            <span>THE ENTITY BUILDS</span>
            <h3>A complete, bounded, evidence-aware submission</h3>
            <ul>
              <li>Entity, owner, responsible roles, jurisdictions, systems, instruments, and versions</li>
              <li>One reviewable capability or claim with scope, non-claims, exclusions, and limitations</li>
              <li>Evidence, calibration, methods, continuity, authorities, thresholds, and expected outcome</li>
              <li>Confidentiality, intellectual-property, attribution, publication, and registry permissions</li>
            </ul>
          </article>
          <article>
            <span>TA-14 RETURNS</span>
            <h3>Bounded findings that distinguish proof from environmental assertion</h3>
            <ul>
              <li>Supported, conditional, held, denied, escalated, corrected, or outside-scope findings</li>
              <li>Evidence gaps, authority gaps, corrective actions, and reassessment requirements</li>
              <li>Record, execution artifact, registry, case-study, and publication options where applicable</li>
              <li>A preserved statement of what TA-14 reviewed, what it did not review, and what remains unresolved</li>
            </ul>
          </article>
        </div>
        <div className="heroActions">
          <Link className="button primary" href="/workspace/entity-review">Begin Environmental Entity Review <Arrow /></Link>
          <Link className="button secondary" href="/academy">Learn Entity Review First <Arrow /></Link>
        </div>
      </section>

      <section className="lawBridge shell">
        <div>
          <p className="eyebrow">CONNECTED TO LAW, STANDARDS & PUBLIC POLICY</p>
          <h2>Environmental evidence reveals where existing laws, regulations, codes, and standards remain primitive.</h2>
          <p>Environmental Integrity Governance supplies the governed reality. The Law, Standards & Public Policy division preserves current instruments, identifies what they leave out, teaches the gap through the Academy, and publishes clearly labeled TA-14 proposed upgrades.</p>
        </div>
        <div className="lawComparison">
          {["Current law or standard", "Observed evidence gap", "Why the gap matters", "TA-14 proposed upgrade", "Changed duty, record, enforcement, or outcome"].map((item, index) => (
            <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < 4 ? <i>↓</i> : null}</div>
          ))}
        </div>
        <Link className="button gold" href="/governance-library/laws">Enter Law, Standards & Public Policy <Arrow /></Link>
      </section>

      <section className="closingSection shell">
        <div className="closingGlow" aria-hidden="true" />
        <p className="eyebrow">TA-14 ENVIRONMENTAL INTEGRITY GOVERNANCE</p>
        <h2>Preserve the environment as evidence. Govern intervention. Verify the outcome.</h2>
        <p>Enter the pathway that matches the environmental reality you need to preserve, review, teach, govern, or improve.</p>
        <div className="heroActions">
          <Link className="button primary" href="/workspace/environmental-records">Enter Environmental Records Workspace <Arrow /></Link>
          <Link className="button academyButton" href="/academy">Enter TA-14 Academy <Arrow /></Link>
          <Link className="button secondary" href="/">Return to TA-14Authority.org <Arrow /></Link>
        </div>
        <div className="closingChain">
          {governingChain.map(([label], index) => <span key={label}>{label}{index < governingChain.length - 1 ? <i>→</i> : null}</span>)}
        </div>
        <strong className="finalRule">No admissible environmental evidence. No admissible environmental intervention.</strong>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <span>Environmental Integrity Governance · TA14Authority.org</span>
      </footer>

      <style jsx>{`
        :global(*){box-sizing:border-box}
        :global(html){scroll-behavior:smooth;background:#020a0c}
        :global(body){margin:0;background:#020a0c;color:#f5fbfa;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        :global(a){color:inherit}
        main{min-height:100vh;position:relative;overflow:hidden;isolation:isolate;background:linear-gradient(180deg,rgba(2,12,15,.72),rgba(3,12,13,.94))}
        .shell{width:min(1480px,calc(100% - 36px));margin-inline:auto;position:relative;z-index:2}
        .environmentCanvas{position:fixed;inset:0;z-index:-3;overflow:hidden;pointer-events:none;background:radial-gradient(circle at 50% -10%,rgba(53,185,174,.18),transparent 34%),linear-gradient(180deg,#02090d,#061315 46%,#020708)}
        .atmosphere{position:absolute;border-radius:50%;filter:blur(100px);opacity:.18;animation:atmosphereDrift 18s ease-in-out infinite alternate}
        .atmosphereOne{width:700px;height:700px;left:-260px;top:16%;background:#0d9f9a}
        .atmosphereTwo{width:760px;height:760px;right:-300px;top:42%;background:#4ab766;animation-delay:-7s}
        .atmosphereThree{width:600px;height:600px;left:34%;top:72%;background:#326ec9;animation-delay:-11s}
        .gridField{position:absolute;inset:0;opacity:.12;background-image:linear-gradient(rgba(100,229,210,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(100,229,210,.35) 1px,transparent 1px);background-size:82px 82px;mask-image:linear-gradient(to bottom,transparent 2%,black 35%,black 80%,transparent)}
        .horizon{position:absolute;left:-10%;right:-10%;top:31%;height:1px;background:linear-gradient(90deg,transparent,rgba(111,232,255,.7),rgba(119,240,169,.8),transparent);box-shadow:0 0 34px rgba(94,225,208,.42)}
        .route{position:absolute;width:72vw;height:1px;background:linear-gradient(90deg,transparent,rgba(86,229,214,.6),rgba(255,210,92,.5),transparent);filter:drop-shadow(0 0 8px rgba(86,229,214,.5))}
        .route::after{content:"";position:absolute;top:-3px;left:20%;width:7px;height:7px;border-radius:50%;background:#fff2a8;box-shadow:0 0 18px #ffe374;animation:packet 7s linear infinite}
        .routeOne{top:20%;left:-12%;transform:rotate(-8deg)}
        .routeTwo{top:56%;right:-18%;transform:rotate(10deg)}
        .routeThree{top:84%;left:4%;transform:rotate(-4deg)}
        .particleField{position:absolute;width:4px;height:4px;border-radius:50%;background:#b9fff4;box-shadow:90px 40px #fff,180px 110px #72e9ff,270px 30px #a2ffbd,360px 180px #ffe49b,480px 80px #fff,590px 220px #6ddcc9;animation:dust 16s linear infinite}
        .pOne{left:4%;top:20%}.pTwo{right:4%;top:58%;animation-delay:-8s}
        .institutionBar{min-height:88px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid rgba(112,222,206,.16)}
        .institutionIdentity{display:flex;align-items:center;gap:13px;text-decoration:none}
        .institutionSeal{width:46px;height:46px;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(255,220,126,.55);background:radial-gradient(circle,rgba(255,210,97,.18),rgba(5,27,29,.92));color:#ffe09a;font-family:Georgia,serif;font-weight:900;box-shadow:0 0 25px rgba(255,194,70,.14)}
        .institutionIdentity strong,.institutionIdentity small{display:block}.institutionIdentity strong{font-family:Georgia,serif;font-size:16px}.institutionIdentity small{margin-top:3px;color:#74c7bd;font-size:10px;font-weight:900;letter-spacing:.15em;text-transform:uppercase}
        nav{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}nav a{padding:10px 12px;border-radius:10px;color:#a9c7c4;text-decoration:none;font-size:12px;font-weight:800}nav a:hover{color:white;background:rgba(255,255,255,.04)}nav .navPrimary{color:#041512;background:linear-gradient(135deg,#baffed,#56d9bd);box-shadow:0 8px 22px rgba(54,202,171,.16)}
        .hero{min-height:760px;padding:92px 0 80px;display:grid;grid-template-columns:minmax(0,1.12fr) minmax(420px,.88fr);gap:66px;align-items:center}
        .eyebrow{margin:0;color:#65e5d0;font-size:11px;font-weight:950;letter-spacing:.24em;text-transform:uppercase}
        .hero h1,.sectionHeading h2,.academyCopy h2,.lawBridge h2,.closingSection h2{margin:14px 0 20px;font-family:Georgia,"Times New Roman",serif;font-size:clamp(48px,6vw,92px);line-height:.96;letter-spacing:-.055em;text-wrap:balance}
        .hero h1 em{display:block;color:#ffd15c;font-style:italic;text-shadow:0 0 35px rgba(255,209,92,.15)}
        .heroLead{max-width:850px;margin:0;color:#bed0cf;font-size:18px;line-height:1.72}
        .heroActions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.leftActions{justify-content:flex-start}
        .button{min-height:52px;padding:0 22px;display:inline-flex;align-items:center;justify-content:center;gap:13px;border:1px solid transparent;border-radius:14px;text-decoration:none;font-size:13px;font-weight:950;transition:.25s;position:relative;overflow:hidden}.button:hover{transform:translateY(-4px)}
        .button.primary{color:#041411;background:linear-gradient(135deg,#c7fff4,#5edfc6 64%,#2aa68f);border-color:#9ff4e4;box-shadow:0 16px 34px rgba(53,210,180,.18)}
        .button.secondary{color:#eafffb;border-color:rgba(103,225,208,.25);background:linear-gradient(180deg,rgba(14,49,49,.9),rgba(5,25,28,.92));box-shadow:inset 0 1px rgba(255,255,255,.05)}
        .button.academyButton{color:#041512;background:linear-gradient(135deg,#c5ffe8,#55efa9 65%,#209b69);border-color:#96f5c6}
        .button.gold{color:#211600;background:linear-gradient(135deg,#fff0b1,#edbc4d 65%,#a96b0c);border-color:#f5d77c}
        .governingRule{margin-top:30px;padding:17px 20px;border-left:3px solid #ffd15c;background:linear-gradient(90deg,rgba(255,209,92,.08),transparent);border-radius:0 12px 12px 0}.governingRule span{display:block;color:#a99767;font-size:9px;font-weight:950;letter-spacing:.16em}.governingRule strong{display:block;margin-top:7px;font-family:Georgia,serif;font-size:18px;color:#fff0bd}
        .heroInstrument{height:570px;position:relative;display:grid;place-items:center}.instrumentHalo{position:absolute;width:470px;height:470px;border-radius:50%;background:radial-gradient(circle,rgba(91,237,210,.2),transparent 68%);filter:blur(20px);animation:breathe 4s ease-in-out infinite alternate}.instrumentCore{width:240px;height:240px;position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border-radius:50%;border:2px solid rgba(255,220,119,.62);background:radial-gradient(circle at 50% 38%,rgba(255,230,149,.16),rgba(4,28,30,.94) 64%);box-shadow:0 0 70px rgba(74,225,200,.22),inset 0 0 40px rgba(255,215,103,.08)}
        .coreCode{font-family:Georgia,serif;font-size:62px;color:#ffe39a;font-weight:900}.instrumentCore strong{font-family:Georgia,serif;font-size:22px}.instrumentCore small{max-width:165px;margin-top:8px;color:#75cfc3;font-size:8px;font-weight:950;letter-spacing:.14em}
        .orbit{position:absolute;left:50%;top:50%;border:1px solid rgba(104,229,211,.3);border-radius:50%;transform:translate(-50%,-50%);animation:orbitSpin 22s linear infinite}.orbit i{position:absolute;left:50%;top:-10px;padding:5px 9px;border-radius:999px;background:#092a2c;border:1px solid rgba(116,237,220,.32);color:#c8fff5;font-size:9px;font-style:normal;font-weight:900;letter-spacing:.08em}.orbitA{width:320px;height:320px}.orbitB{width:390px;height:235px;transform:translate(-50%,-50%) rotate(31deg);animation-direction:reverse;animation-duration:18s}.orbitC{width:440px;height:440px;animation-duration:30s}.orbitD{width:500px;height:295px;transform:translate(-50%,-50%) rotate(-34deg);animation-direction:reverse;animation-duration:26s}.orbitE{width:530px;height:530px;border-color:rgba(255,209,92,.18);animation-duration:38s}
        .instrumentReadout{position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:min(100%,520px);display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.instrumentReadout span{padding:13px 10px;border:1px solid rgba(100,225,207,.16);border-radius:11px;background:rgba(5,25,27,.82);color:#819f9d;font-size:9px;font-weight:900;text-transform:uppercase;text-align:center}.instrumentReadout b{display:block;margin-bottom:4px;color:#fff1bd;font-family:Georgia,serif;font-size:24px}
        .definitionBand{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;padding:0 0 80px}.definitionBand article{padding:25px;border:1px solid rgba(99,222,204,.16);border-radius:20px;background:linear-gradient(145deg,rgba(10,37,39,.8),rgba(4,20,23,.86));box-shadow:0 18px 42px rgba(0,0,0,.18)}.definitionBand span,.miniHeading{color:#6bb7ae;font-size:9px;font-weight:950;letter-spacing:.16em}.definitionBand strong{display:block;margin:13px 0 9px;font-family:Georgia,serif;font-size:21px}.definitionBand p{margin:0;color:#98afad;font-size:13px;line-height:1.6}
        .pathwaySection,.chainSection,.determinationSection,.recordsSection,.academySection,.entityReviewSection,.lawBridge,.closingSection{padding:92px 0}.sectionHeading{max-width:1080px}.sectionHeading.centered{text-align:center;margin-inline:auto}.sectionHeading h2,.academyCopy h2,.lawBridge h2,.closingSection h2{font-size:clamp(40px,4.9vw,72px)}.sectionHeading>p:last-child,.academyCopy>p,.lawBridge>div>p,.closingSection>p{color:#a9bfbd;font-size:16px;line-height:1.72}
        .pathwayLayout{display:grid;grid-template-columns:420px 1fr;gap:20px;margin-top:45px}.pathwayRail{display:flex;flex-direction:column;gap:8px}.pathwayRail button{width:100%;padding:16px;display:grid;grid-template-columns:54px 1fr 20px;gap:13px;align-items:center;border:1px solid rgba(255,255,255,.07);border-radius:15px;color:#d8e9e7;background:linear-gradient(145deg,rgba(10,35,37,.78),rgba(4,18,21,.88));text-align:left;cursor:pointer;transition:.25s}.pathwayRail button:hover,.pathwayRail button.active{transform:translateX(6px);border-color:var(--pathAccent);box-shadow:0 10px 30px var(--pathGlow),inset 0 0 28px rgba(255,255,255,.025)}.pathwayRail button>span{width:52px;height:52px;display:grid;place-items:center;border-radius:12px;border:1px solid var(--pathAccent);color:var(--pathAccent);background:rgba(3,18,20,.7);font-weight:950}.pathwayRail strong,.pathwayRail small{display:block}.pathwayRail strong{font-size:13px}.pathwayRail small{margin-top:5px;color:#789491;font-size:10px;line-height:1.35}.pathwayRail i{color:var(--pathAccent);font-style:normal}
        .pathwayDetail{min-height:720px;padding:38px;display:grid;grid-template-columns:300px 1fr;gap:38px;align-items:center;border:1px solid color-mix(in srgb,var(--pathAccent) 34%,transparent);border-radius:28px;background:radial-gradient(circle at 12% 42%,var(--pathGlow),transparent 35%),linear-gradient(145deg,rgba(9,39,40,.88),rgba(3,16,19,.96));box-shadow:0 30px 75px rgba(0,0,0,.28),inset 0 1px rgba(255,255,255,.04)}
        .detailPortal{height:430px;position:relative;display:grid;place-items:center}.portalGlow{position:absolute;width:270px;height:270px;border-radius:50%;background:radial-gradient(circle,var(--pathGlow),transparent 70%);filter:blur(18px);animation:breathe 3.5s ease-in-out infinite alternate}.portalRing{position:absolute;border-radius:50%;border:1px solid color-mix(in srgb,var(--pathAccent) 55%,transparent);animation:orbitSpin 15s linear infinite}.ringOne{width:245px;height:360px}.ringTwo{width:330px;height:210px;transform:rotate(37deg);animation-direction:reverse}.portalCore{width:174px;height:174px;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:50%;border:2px solid var(--pathAccent);background:radial-gradient(circle,rgba(255,255,255,.1),rgba(3,22,24,.94));box-shadow:0 0 55px var(--pathGlow)}.portalCore span{color:var(--pathAccent);font-family:Georgia,serif;font-size:46px;font-weight:900}.portalCore small{margin-top:7px;color:#b8cfcc;font-size:8px;font-weight:950;letter-spacing:.12em}
        .pathKicker{margin:0;color:var(--pathAccent);font-size:10px;font-weight:950;letter-spacing:.15em;text-transform:uppercase}.detailCopy h3{margin:12px 0 14px;font-family:Georgia,serif;font-size:46px;line-height:1}.pathDescription{color:#b8ccca;font-size:16px;line-height:1.65}.detailColumns{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:26px}.detailColumns ul,.reviewPanels ul{list-style:none;padding:0;margin:11px 0 0}.detailColumns li,.reviewPanels li{display:flex;gap:9px;margin:9px 0;color:#9fb8b5;font-size:12px;line-height:1.45}.detailColumns li i{color:var(--pathAccent);font-style:normal}.academyBridge{margin-top:24px;padding:18px;border:1px solid color-mix(in srgb,var(--pathAccent) 25%,transparent);border-radius:15px;background:rgba(255,255,255,.025)}.academyBridge span{color:var(--pathAccent);font-size:8px;font-weight:950;letter-spacing:.14em}.academyBridge strong{display:block;margin-top:7px;font-family:Georgia,serif;font-size:19px}.academyBridge p{margin:6px 0 0;color:#8ca7a4;font-size:11px;line-height:1.5}.detailActions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
        .chainInterface{margin-top:42px;border:1px solid rgba(97,224,206,.18);border-radius:26px;overflow:hidden;background:rgba(3,18,21,.82)}.chainTrack{display:grid;grid-template-columns:repeat(8,1fr);border-bottom:1px solid rgba(97,224,206,.15)}.chainTrack button{min-width:0;padding:22px 8px;position:relative;border:0;border-right:1px solid rgba(255,255,255,.06);color:#8ca7a4;background:transparent;cursor:pointer}.chainTrack button:last-child{border-right:0}.chainTrack button span,.chainTrack button strong{display:block}.chainTrack button span{font-size:25px}.chainTrack button strong{margin-top:8px;font-size:10px}.chainTrack button i{position:absolute;right:-7px;top:50%;z-index:2;color:#4d8c84;font-style:normal}.chainTrack button.active{color:#fff4c6;background:linear-gradient(180deg,rgba(255,209,92,.12),rgba(67,224,199,.07));box-shadow:inset 0 -3px #ffd15c}.chainExplanation{padding:40px;display:grid;grid-template-columns:130px 1fr;gap:8px 30px;align-items:start}.chainExplanation>span{grid-row:1/4;color:#62dfca;font-size:10px;font-weight:950;letter-spacing:.14em}.chainExplanation h3{margin:0;font-family:Georgia,serif;font-size:46px}.chainExplanation>p{margin:0;color:#b2c6c4;font-size:16px;line-height:1.65}.chainBoundary{grid-column:2;margin-top:16px;padding:18px;border-left:3px solid #ffd15c;background:rgba(255,209,92,.05)}.chainBoundary strong{color:#ffdf87;font-size:9px;letter-spacing:.14em}.chainBoundary p{margin:7px 0 0;color:#d0dcd9;font-family:Georgia,serif;font-size:17px;line-height:1.5}
        .determinationGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:42px}.determinationGrid article{min-height:265px;padding:25px;border-radius:19px;border:1px solid rgba(255,255,255,.09);background:linear-gradient(145deg,rgba(11,37,39,.82),rgba(3,17,19,.92));position:relative;overflow:hidden}.determinationGrid article::before{content:"";position:absolute;inset:auto -20% -45% 20%;height:180px;border-radius:50%;background:var(--stateGlow);filter:blur(48px);opacity:.24}.determinationGrid span{color:#6d8e8a;font-size:10px;font-weight:950}.determinationGrid h3{margin:34px 0 12px;font-family:Georgia,serif;font-size:38px;color:var(--state)}.determinationGrid p{color:#aabdbb;font-size:13px;line-height:1.6}.determinationGrid small{display:block;margin-top:18px;color:#6f8d89;font-size:10px;line-height:1.45}.state1{--state:#62f0b5;--stateGlow:#35d996}.state2{--state:#ffd15c;--stateGlow:#ffd15c}.state3{--state:#ff7288;--stateGlow:#ff526c}.state4{--state:#b697ff;--stateGlow:#9c77ff}
        .recordsSection{display:grid;grid-template-columns:1.1fr .9fr;gap:32px;align-items:start}.recordsCopy h2{margin:13px 0 18px;font-family:Georgia,serif;font-size:clamp(40px,4.5vw,68px);line-height:1;letter-spacing:-.045em}.recordsCopy>p{color:#aabfbc;font-size:16px;line-height:1.7}.textButton{margin:14px 0 20px;padding:0;border:0;color:#72e8d5;background:none;font-weight:900;cursor:pointer}.evidenceGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.evidenceGrid div{padding:11px;border:1px solid rgba(101,224,206,.12);border-radius:10px;background:rgba(255,255,255,.025)}.evidenceGrid span{display:block;color:#527f79;font-size:8px}.evidenceGrid strong{display:block;margin-top:5px;color:#bcd0cd;font-size:10px}.recordVault{padding:22px;border:1px solid rgba(255,209,92,.23);border-radius:24px;background:linear-gradient(145deg,rgba(39,31,12,.45),rgba(4,21,23,.92));box-shadow:0 28px 70px rgba(0,0,0,.25)}.vaultHeader{display:flex;justify-content:space-between;gap:14px;padding-bottom:15px;border-bottom:1px solid rgba(255,255,255,.08);color:#ffdc80;font-size:9px;font-weight:950;letter-spacing:.14em}.vaultHeader b{color:#65e0cc}.recordStack{padding:26px 10px}.recordStack article{margin-top:calc(var(--stack) * -4px);padding:15px;display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:linear-gradient(145deg,rgba(18,50,50,.97),rgba(6,25,28,.97));box-shadow:0 10px 22px rgba(0,0,0,.24);transform:translateX(calc(var(--stack) * 2px))}.recordStack span{color:#5d8c86;font-size:9px}.recordStack strong{font-size:11px}.recordStack i{color:#d9b861;font-size:7px;font-style:normal;font-weight:950;letter-spacing:.1em}.recordVault>p{margin:0;color:#92aaa7;font-size:12px;line-height:1.6}
        .academySection{display:grid;grid-template-columns:.8fr 1.2fr;gap:56px;align-items:center;border-top:1px solid rgba(97,224,206,.13);border-bottom:1px solid rgba(97,224,206,.13)}.academyVisual{height:520px;position:relative;display:grid;place-items:center}.academySeal{width:250px;height:250px;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:50%;border:2px solid #64efb3;background:radial-gradient(circle,rgba(98,240,180,.17),rgba(3,28,27,.95));box-shadow:0 0 70px rgba(75,232,172,.2)}.academySeal small{color:#75bca5;font-weight:950;letter-spacing:.16em}.academySeal strong{font-family:Georgia,serif;font-size:42px;color:#baffda}.academySeal span{margin-top:8px;color:#69d9b1;font-size:8px;font-weight:950;letter-spacing:.14em}.academyOrbit{position:absolute;border:1px solid rgba(98,240,180,.28);border-radius:50%;animation:orbitSpin 23s linear infinite}.orbitOne{width:330px;height:440px}.orbitTwo{width:460px;height:270px;transform:rotate(35deg);animation-direction:reverse}.orbitThree{width:500px;height:500px;border-color:rgba(255,209,92,.14);animation-duration:36s}.academyGrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:24px}.academyGrid a{padding:14px;display:grid;grid-template-columns:48px 1fr 16px;gap:12px;align-items:center;border:1px solid rgba(100,230,190,.14);border-radius:13px;background:rgba(255,255,255,.025);text-decoration:none;transition:.25s}.academyGrid a:hover{transform:translateY(-3px);border-color:#62efb5}.academyGrid a>span{width:46px;height:46px;display:grid;place-items:center;border-radius:10px;border:1px solid #62efb5;color:#83f3c1;font-size:10px;font-weight:950}.academyGrid strong{font-size:11px}.academyGrid p{margin:5px 0 0;color:#7e9995;font-size:9px;line-height:1.4}.academyGrid b{color:#62efb5}
        .entityReviewSection{border-bottom:1px solid rgba(97,224,206,.13)}.reviewRoute{display:grid;grid-template-columns:repeat(8,1fr);margin-top:35px;border:1px solid rgba(97,224,206,.16);border-radius:16px;overflow:hidden}.reviewRoute div{min-width:0;padding:19px 8px;position:relative;text-align:center;border-right:1px solid rgba(255,255,255,.06);background:rgba(5,27,29,.72)}.reviewRoute div:last-child{border-right:0}.reviewRoute span,.reviewRoute strong{display:block}.reviewRoute span{color:#5d918a;font-size:8px}.reviewRoute strong{margin-top:6px;font-size:10px}.reviewRoute i{position:absolute;right:-6px;top:50%;z-index:2;color:#5ea59b;font-style:normal}.reviewPanels{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-top:18px}.reviewPanels article{padding:26px;border:1px solid rgba(98,225,205,.15);border-radius:18px;background:linear-gradient(145deg,rgba(11,38,39,.82),rgba(4,19,22,.9))}.reviewPanels article>span{color:#68d8c5;font-size:9px;font-weight:950;letter-spacing:.14em}.reviewPanels h3{margin:12px 0 8px;font-family:Georgia,serif;font-size:25px}.reviewPanels li::before{content:"✦";color:#ffd15c;margin-right:2px}
        .lawBridge{display:grid;grid-template-columns:1.1fr .7fr;gap:44px;align-items:center}.lawBridge .button{grid-column:1}.lawComparison{grid-row:1/3;grid-column:2;display:flex;flex-direction:column;gap:0;padding:20px;border:1px solid rgba(255,209,92,.2);border-radius:22px;background:linear-gradient(145deg,rgba(46,35,10,.42),rgba(5,24,26,.9))}.lawComparison div{padding:15px;position:relative;border:1px solid rgba(255,255,255,.07);border-radius:11px;background:rgba(255,255,255,.025)}.lawComparison span{color:#b18e42;font-size:8px}.lawComparison strong{display:block;margin-top:5px;font-size:11px}.lawComparison i{position:absolute;left:50%;bottom:-13px;z-index:2;color:#ffd15c;font-style:normal}
        .closingSection{text-align:center;padding-bottom:80px}.closingGlow{position:absolute;left:50%;top:30px;width:850px;height:360px;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(86,229,204,.15),transparent 68%);filter:blur(22px);pointer-events:none}.closingSection>p{max-width:850px;margin-inline:auto}.closingChain{margin-top:38px;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.closingChain span{display:flex;align-items:center;gap:8px;color:#8dacaa;font-size:10px;font-weight:900}.closingChain i{color:#ffd15c;font-style:normal}.finalRule{display:block;margin-top:25px;color:#ffe59e;font-family:Georgia,serif;font-size:21px}
        footer{min-height:82px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-top:1px solid rgba(97,224,206,.13);color:#607f7b;font-size:10px;font-weight:800;letter-spacing:.08em}
        @keyframes atmosphereDrift{to{transform:translate3d(65px,-35px,0) scale(1.08)}}@keyframes packet{from{left:0}to{left:100%}}@keyframes dust{to{transform:translate3d(110px,-80px,0)}}@keyframes breathe{to{transform:scale(1.08);opacity:.8}}@keyframes orbitSpin{to{transform:translate(-50%,-50%) rotate(360deg)}}
        @media(max-width:1180px){.hero{grid-template-columns:1fr;min-height:auto}.heroInstrument{height:560px}.pathwayLayout{grid-template-columns:1fr}.pathwayRail{display:grid;grid-template-columns:1fr 1fr}.pathwayDetail{grid-template-columns:260px 1fr}.chainTrack{grid-template-columns:repeat(4,1fr)}.chainTrack button:nth-child(4){border-right:0}.determinationGrid{grid-template-columns:1fr 1fr}.recordsSection,.academySection,.lawBridge{grid-template-columns:1fr}.lawComparison{grid-column:1;grid-row:auto}.lawBridge .button{grid-column:1;width:max-content}.academyVisual{height:430px}.reviewRoute{grid-template-columns:repeat(4,1fr)}}
        @media(max-width:760px){.shell{width:min(100% - 22px,1480px)}.institutionBar{padding:14px 0;align-items:flex-start}.institutionIdentity strong{font-size:13px}.institutionIdentity small{font-size:8px}nav{display:none}.hero{padding:64px 0}.hero h1{font-size:48px}.heroLead{font-size:15px}.heroInstrument{height:430px;transform:scale(.78);margin:-45px 0}.definitionBand{grid-template-columns:1fr}.pathwayRail{grid-template-columns:1fr}.pathwayDetail{min-height:auto;padding:24px;grid-template-columns:1fr}.detailPortal{height:300px}.detailColumns{grid-template-columns:1fr}.chainTrack{grid-template-columns:1fr 1fr}.chainExplanation{padding:25px;grid-template-columns:1fr}.chainExplanation>span{grid-row:auto}.chainBoundary{grid-column:1}.determinationGrid{grid-template-columns:1fr}.recordsSection{padding-top:60px}.evidenceGrid{grid-template-columns:1fr 1fr}.academyGrid{grid-template-columns:1fr}.reviewRoute{grid-template-columns:1fr 1fr}.reviewPanels{grid-template-columns:1fr}.lawBridge h2,.closingSection h2,.sectionHeading h2,.academyCopy h2,.recordsCopy h2{font-size:40px}.closingChain{display:grid;grid-template-columns:1fr 1fr}.closingChain span{justify-content:center}.instrumentReadout{grid-template-columns:1fr}.instrumentReadout span:nth-child(n+2){display:none}footer{flex-direction:column;justify-content:center;text-align:center}.heroActions .button{width:100%}}
        @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
      `}</style>
    </main>
  );
}
