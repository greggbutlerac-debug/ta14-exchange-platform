"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type TimelineRecord = {
  year: string;
  title: string;
  jurisdiction: string;
  instrumentType: string;
  domain: string;
  summary: string;
};

const timelineRecords: TimelineRecord[] = [
  {
    year: "1970",
    title: "Clean Air Act",
    jurisdiction: "United States",
    instrumentType: "Law",
    domain: "Air & Atmospheric Protection",
    summary: "Established the modern federal air-pollution control structure and delegated major implementation responsibilities to EPA and states.",
  },
  {
    year: "1972",
    title: "Clean Water Act",
    jurisdiction: "United States",
    instrumentType: "Law",
    domain: "Water & Pollution Control",
    summary: "Created the principal federal structure for regulating pollutant discharges into waters of the United States.",
  },
  {
    year: "1974",
    title: "Safe Drinking Water Act",
    jurisdiction: "United States",
    instrumentType: "Law",
    domain: "Drinking Water",
    summary: "Authorized national health-based drinking-water standards and public water system oversight.",
  },
  {
    year: "1976",
    title: "RCRA",
    jurisdiction: "United States",
    instrumentType: "Law",
    domain: "Waste & Materials",
    summary: "Established cradle-to-grave governance for hazardous waste and a broader solid-waste framework.",
  },
  {
    year: "1980",
    title: "CERCLA / Superfund",
    jurisdiction: "United States",
    instrumentType: "Law",
    domain: "Contamination & Remediation",
    summary: "Created federal authority for hazardous-substance response, cleanup, liability, and long-term remediation.",
  },
  {
    year: "1986",
    title: "EPCRA",
    jurisdiction: "United States",
    instrumentType: "Law",
    domain: "Public Disclosure",
    summary: "Expanded emergency planning and community access to chemical-release information.",
  },
  {
    year: "1987",
    title: "Montreal Protocol",
    jurisdiction: "International",
    instrumentType: "Treaty",
    domain: "Atmospheric Protection",
    summary: "Created a binding international pathway for phasing down ozone-depleting substances.",
  },
  {
    year: "1990",
    title: "Clean Air Act Amendments",
    jurisdiction: "United States",
    instrumentType: "Law",
    domain: "Air & Atmospheric Protection",
    summary: "Strengthened national programs for hazardous air pollutants, acid rain, permits, enforcement, and mobile sources.",
  },
  {
    year: "1992",
    title: "UN Framework Convention on Climate Change",
    jurisdiction: "International",
    instrumentType: "Treaty",
    domain: "Climate Governance",
    summary: "Established the international framework for coordinated climate action and reporting.",
  },
  {
    year: "1996",
    title: "Food Quality Protection Act",
    jurisdiction: "United States",
    instrumentType: "Law",
    domain: "Pesticides & Exposure",
    summary: "Reworked pesticide residue standards around a health-protective reasonable-certainty-of-no-harm test.",
  },
  {
    year: "2001",
    title: "Stockholm Convention",
    jurisdiction: "International",
    instrumentType: "Treaty",
    domain: "Persistent Pollutants",
    summary: "Created an international regime for eliminating or restricting persistent organic pollutants.",
  },
  {
    year: "2006",
    title: "ASHRAE Standard 62.1 modern lineage",
    jurisdiction: "International",
    instrumentType: "Standard",
    domain: "Indoor Air Quality",
    summary: "Continued the modern ventilation and acceptable indoor air quality framework for nonresidential buildings.",
  },
  {
    year: "2015",
    title: "Paris Agreement",
    jurisdiction: "International",
    instrumentType: "Treaty",
    domain: "Climate Governance",
    summary: "Established nationally determined climate commitments, transparency, and recurring ambition cycles.",
  },
  {
    year: "2018",
    title: "ISO 45001",
    jurisdiction: "International",
    instrumentType: "Standard",
    domain: "Occupational Health",
    summary: "Established an occupational health and safety management-system standard relevant to environmental and facility governance.",
  },
  {
    year: "2021",
    title: "WHO Global Air Quality Guidelines",
    jurisdiction: "International",
    instrumentType: "Guidance",
    domain: "Public Health",
    summary: "Published evidence-informed air-quality guideline levels for major pollutants as non-binding health guidance.",
  },
  {
    year: "2023",
    title: "ISO/IEC 42001",
    jurisdiction: "International",
    instrumentType: "Standard",
    domain: "AI Governance",
    summary: "Published the first international AI management-system standard.",
  },
  {
    year: "2024",
    title: "EU AI Act",
    jurisdiction: "European Union",
    instrumentType: "Law",
    domain: "AI Governance",
    summary: "Entered into force as a comprehensive risk-based legal framework for artificial intelligence.",
  },
  {
    year: "2025",
    title: "TA-14 Governing Chain publication lineage",
    jurisdiction: "TA-14",
    instrumentType: "Architecture",
    domain: "Institutional Governance",
    summary: "Preserved the Reality to Outcome governing chain as the institutional route beneath TA-14 systems.",
  },
  {
    year: "2026",
    title: "TA-14 Environmental Integrity Governance",
    jurisdiction: "TA-14",
    instrumentType: "Institutional System",
    domain: "Environmental Governance",
    summary: "Organized AIR, PAIR, HVAC, buildings, environmental records, review, Academy, and outcome verification under one division.",
  },
  {
    year: "2026",
    title: "TA-14 Current & Proposed Law system",
    jurisdiction: "TA-14",
    instrumentType: "Institutional System",
    domain: "Law Modernization",
    summary: "Connected current law, identified gaps, Academy explanation, and clearly labeled proposed upgrades.",
  },
  {
    year: "2026",
    title: "TA-14 Standards, Codes & Technical Modernization",
    jurisdiction: "TA-14",
    instrumentType: "Institutional System",
    domain: "Standards Modernization",
    summary: "Connected standards status, adoption, evidence, execution boundaries, and proposed technical upgrades.",
  },
  {
    year: "2026",
    title: "TA-14 Authority Governance Institution",
    jurisdiction: "TA-14",
    instrumentType: "Institution",
    domain: "Institutional Governance",
    summary: "Brought AI Governance, Academy, Environmental Integrity Governance, and Law, Standards & Public Policy under one institutional front door.",
  },
];

const sequence = [
  "Source date",
  "Publication",
  "Adoption",
  "Applicability",
  "Implementation",
  "Amendment",
  "Supersession",
  "Outcome",
] as const;

const failureModes = [
  {
    title: "Publication confused with enforceability",
    description: "A document may be published without being adopted, incorporated, contracted, or legally binding.",
  },
  {
    title: "Latest edition confused with adopted edition",
    description: "The newest technical edition may not be the edition incorporated into a code, permit, contract, or regulation.",
  },
  {
    title: "Proposal confused with enacted law",
    description: "A model act, bill, recommendation, or TA-14 proposal must never be presented as current binding law.",
  },
  {
    title: "Amendment history erased",
    description: "A current rule may depend on prior amendments, transition periods, exemptions, and preserved historical versions.",
  },
  {
    title: "Effective date ignored",
    description: "An instrument may exist but not yet apply to the activity, actor, product, facility, or jurisdiction at issue.",
  },
  {
    title: "Repealed rule treated as active",
    description: "Superseded and repealed instruments remain historically relevant but cannot be relied upon as current authority.",
  },
  {
    title: "Guidance treated as command",
    description: "Health or technical guidance may inform policy and evidence without independently creating legal authority.",
  },
  {
    title: "Outcome history omitted",
    description: "A timeline that stops at publication cannot show whether implementation changed reality or produced the intended protection.",
  },
] as const;

function yearNumber(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function GovernanceTimelinePage() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All domains");
  const [jurisdiction, setJurisdiction] = useState("All jurisdictions");
  const [direction, setDirection] = useState<"ascending" | "descending">("ascending");
  const [selectedTitle, setSelectedTitle] = useState(timelineRecords[timelineRecords.length - 1].title);

  const domains = useMemo(() => ["All domains", ...Array.from(new Set(timelineRecords.map((record) => record.domain)))], []);
  const jurisdictions = useMemo(() => ["All jurisdictions", ...Array.from(new Set(timelineRecords.map((record) => record.jurisdiction)))], []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = timelineRecords.filter((record) => {
      const domainMatch = domain === "All domains" || record.domain === domain;
      const jurisdictionMatch = jurisdiction === "All jurisdictions" || record.jurisdiction === jurisdiction;
      const searchable = [record.year, record.title, record.jurisdiction, record.instrumentType, record.domain, record.summary].join(" ").toLowerCase();
      const queryMatch = normalized.length === 0 || normalized.split(/\s+/).every((token) => searchable.includes(token));
      return domainMatch && jurisdictionMatch && queryMatch;
    });
    return result.sort((left, right) => direction === "ascending" ? yearNumber(left.year) - yearNumber(right.year) : yearNumber(right.year) - yearNumber(left.year));
  }, [direction, domain, jurisdiction, query]);

  const selected = timelineRecords.find((record) => record.title === selectedTitle) ?? filtered[0] ?? timelineRecords[0];

  const metrics = useMemo(() => ({
    records: timelineRecords.length,
    jurisdictions: new Set(timelineRecords.map((record) => record.jurisdiction)).size,
    domains: new Set(timelineRecords.map((record) => record.domain)).size,
    earliest: Math.min(...timelineRecords.map((record) => yearNumber(record.year))),
    latest: Math.max(...timelineRecords.map((record) => yearNumber(record.year))),
  }), []);

  return (
    <main className="timelinePage">
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />
      <div className="grid" />
      <div className="shell">
        <header className="topbar">
          <Link href="/governance-library">← Governance Library</Link>
          <span>TA-14 Institutional Chronology</span>
          <Link href="/governance-library/status">Resolve Status →</Link>
        </header>

        <section className="hero">
          <div className="heroSeal"><strong>TL</strong><small>TA-14</small></div>
          <p className="eyebrow">INSTITUTIONAL GOVERNANCE TIMELINE</p>
          <h1>Preserve when authority changed—and what changed with it.</h1>
          <p className="lead">The TA-14 Governance Timeline distinguishes publication, adoption, amendment, applicability, implementation, supersession, and outcome. It prevents a date from being treated as authority without the instrument, jurisdiction, version, status, and evidence that give the date meaning.</p>
          <div className="heroMetrics">
            <article><strong>{metrics.records}</strong><span>Records</span></article>
            <article><strong>{metrics.jurisdictions}</strong><span>Jurisdictions</span></article>
            <article><strong>{metrics.domains}</strong><span>Domains</span></article>
            <article><strong>{metrics.earliest}</strong><span>Earliest year</span></article>
            <article><strong>{metrics.latest}</strong><span>Latest year</span></article>
          </div>
        </section>

        <section className="principleBand">
          <article>
            <span>A date is not authority</span>
            <p>Authority depends on the actual instrument, issuer, jurisdiction, status, adopted version, and applicable scope.</p>
          </article>
          <article>
            <span>A publication is not an implementation</span>
            <p>The timeline preserves when duties became operational, not merely when a document appeared.</p>
          </article>
          <article>
            <span>A current view must preserve history</span>
            <p>Superseded instruments, amendments, transition periods, and prior editions remain visible without being misrepresented as current.</p>
          </article>
        </section>

        <section className="workspace">
          <div className="sectionHeading">
            <div><p className="eyebrow">CHRONOLOGY WORKSPACE</p><h2>Find the event. Inspect the authority boundary.</h2></div>
            <p>Filter the institutional chronology by domain and jurisdiction, then inspect what the date represents and what it does not prove.</p>
          </div>
          <div className="filters">
            <label>Search<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search law, standard, treaty, TA-14..." /></label>
            <label>Domain<select value={domain} onChange={(event) => setDomain(event.target.value)}>{domains.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Jurisdiction<select value={jurisdiction} onChange={(event) => setJurisdiction(event.target.value)}>{jurisdictions.map((item) => <option key={item}>{item}</option>)}</select></label>
            <button type="button" onClick={() => setDirection((current) => current === "ascending" ? "descending" : "ascending")}>{direction === "ascending" ? "Oldest first" : "Newest first"}</button>
          </div>

          <div className="timelineWorkspace">
            <div className="timelineRail">
              {filtered.map((record, index) => (
                <button key={`${record.year}-${record.title}`} type="button" className={selected.title === record.title ? "timelineItem active" : "timelineItem"} onClick={() => setSelectedTitle(record.title)}>
                  <span className="year">{record.year}</span>
                  <span className="node" />
                  <span className="itemCopy"><small>{record.instrumentType} · {record.jurisdiction}</small><strong>{record.title}</strong><em>{record.domain}</em></span>
                  <span className="index">{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
              {filtered.length === 0 ? <div className="empty">No timeline record matched the selected filters.</div> : null}
            </div>

            <article className="recordInspector">
              <div className="recordHeader">
                <div className="recordYear">{selected.year}</div>
                <div><p>{selected.instrumentType}</p><h3>{selected.title}</h3><span>{selected.jurisdiction} · {selected.domain}</span></div>
              </div>
              <div className="recordSummary"><span>Chronology statement</span><p>{selected.summary}</p></div>
              <div className="boundaryGrid">
                <article><span>WHAT THE DATE MAY SHOW</span><strong>Publication, enactment, adoption, release, institutional formation, or another preserved milestone.</strong></article>
                <article><span>WHAT THE DATE DOES NOT PROVE</span><strong>Current applicability, legal force, adoption in every jurisdiction, implementation quality, conformity, or outcome.</strong></article>
                <article><span>WHAT MUST BE RESOLVED</span><strong>Official source, version, amendment history, effective date, jurisdiction, role, scope, evidence duty, and supersession.</strong></article>
                <article><span>TA-14 GOVERNING EFFECT</span><strong>Dates support continuity only when connected to authority, evidence, determination, execution, and outcome.</strong></article>
              </div>
              <div className="recordActions">
                <Link href="/governance-library/status">Resolve Status</Link>
                <Link href="/governance-library/authorities">Resolve Authority</Link>
                <Link href="/governance-library/applicability" className="primary">Test Applicability →</Link>
              </div>
            </article>
          </div>
        </section>

        <section className="sequenceSection">
          <div className="sectionHeading">
            <div><p className="eyebrow">TIMELINE RESOLUTION SEQUENCE</p><h2>Chronology must remain connected to legal and technical meaning.</h2></div>
            <p>TA-14 separates the date on a document from the date a duty, adopted edition, implementation requirement, or outcome became relevant.</p>
          </div>
          <div className="sequenceGrid">
            {sequence.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><p>{[
              "Identify the official source and the event represented by the date.",
              "Preserve when the instrument or edition was publicly issued.",
              "Determine whether and how the instrument was enacted, adopted, incorporated, or contracted.",
              "Resolve the effective date, transition period, covered actor, activity, facility, system, or jurisdiction.",
              "Preserve when operational duties, controls, inspections, records, or methods actually began.",
              "Capture amendments, corrections, extensions, waivers, and changed obligations.",
              "Preserve when a version ceased to control and what replaced it.",
              "Return implementation results and real-world consequences to the chronology.",
            ][index]}</p></article>)}
          </div>
        </section>

        <section className="failureSection">
          <div className="sectionHeading centered">
            <div><p className="eyebrow">CHRONOLOGY FAILURE MODES</p><h2>A timeline can look precise and still create false authority.</h2></div>
          </div>
          <div className="failureGrid">
            {failureModes.map((mode, index) => <article key={mode.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{mode.title}</h3><p>{mode.description}</p></article>)}
          </div>
        </section>

        <section className="academySection">
          <div className="academySeal"><small>TA-14</small><strong>ACADEMY</strong><span>TIMELINE & VERSION LITERACY</span></div>
          <div>
            <p className="eyebrow">THE ACADEMY INSIDE CHRONOLOGY</p>
            <h2>Learn what changed, when it changed, and why the difference matters.</h2>
            <p>The Timeline Academy teaches participants to distinguish publication from enactment, enactment from effective date, voluntary use from adoption, current editions from incorporated editions, amendment from replacement, and historical relevance from current authority.</p>
            <div className="academyGrid">
              <article><span>01</span><div><strong>Read the source</strong><p>Identify the controlling publisher, instrument, edition, and official record.</p></div></article>
              <article><span>02</span><div><strong>Resolve the event</strong><p>Classify whether the date represents publication, enactment, adoption, implementation, amendment, or supersession.</p></div></article>
              <article><span>03</span><div><strong>Map the authority</strong><p>Connect the chronology to the authority that created or adopted the obligation.</p></div></article>
              <article><span>04</span><div><strong>Test applicability</strong><p>Determine whether the dated instrument applied to the actor, activity, place, system, or facility.</p></div></article>
              <article><span>05</span><div><strong>Inspect the gap</strong><p>Identify missing transition periods, stale editions, conflicting dates, or unresolved status.</p></div></article>
              <article><span>06</span><div><strong>Preserve outcome</strong><p>Record what implementation produced and whether the intended protection occurred.</p></div></article>
            </div>
            <div className="academyActions"><Link href="/academy">Enter TA-14 Academy</Link><Link href="/governance-library/applicability" className="primary">Build Applicability Package →</Link></div>
          </div>
        </section>

        <section className="closing">
          <p className="eyebrow">TA-14 INSTITUTIONAL GOVERNANCE TIMELINE</p>
          <h2>Preserve the date. Resolve the authority. Verify the effect.</h2>
          <p>A trustworthy chronology does not merely show when a document appeared. It preserves what changed, who had authority, when the change applied, what evidence was required, and what happened afterward.</p>
          <div><Link href="/governance-library">Return to Governance Library</Link><Link href="/governance-library/status">Open Status Resolution</Link><Link href="/governance-library/applicability" className="primary">Resolve Applicability →</Link></div>
        </section>
      </div>


      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #020811;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #f7fbff;
          background: #020811;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        :global(a) {
          color: inherit;
        }

        .timelinePage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% -8%, rgba(70, 150, 220, .16), transparent 34%),
            linear-gradient(180deg, #020811 0%, #06111d 48%, #02070d 100%);
        }

        .grid {
          position: fixed;
          inset: 0;
          z-index: -3;
          pointer-events: none;
          opacity: .12;
          background-image:
            linear-gradient(rgba(112, 215, 239, .2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(112, 215, 239, .2) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, black, transparent 92%);
        }

        .ambient {
          position: fixed;
          width: 720px;
          height: 720px;
          z-index: -2;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          opacity: .12;
        }

        .ambientOne {
          left: -280px;
          top: 18%;
          background: #168bc5;
        }

        .ambientTwo {
          right: -300px;
          top: 58%;
          background: #d68d26;
        }

        .shell {
          width: min(1500px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
          padding-bottom: 90px;
        }

        .topbar {
          min-height: 76px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid rgba(111, 215, 239, .15);
        }

        .topbar a {
          width: max-content;
          padding: 11px 14px;
          border: 1px solid rgba(255, 255, 255, .09);
          border-radius: 10px;
          color: #c4d5dd;
          background: rgba(255, 255, 255, .025);
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .topbar a:last-child {
          justify-self: end;
        }

        .topbar span {
          color: #7395a2;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .hero {
          max-width: 1160px;
          margin-inline: auto;
          padding: 86px 0 74px;
          text-align: center;
        }

        .heroSeal {
          width: 110px;
          height: 110px;
          margin: 0 auto 25px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 4px;
          border: 1px solid rgba(255, 203, 91, .38);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 201, 84, .1), rgba(5, 21, 34, .95));
          box-shadow: 0 0 60px rgba(255, 187, 46, .1);
        }

        .heroSeal strong {
          color: #ffe29b;
          font-family: Georgia, serif;
          font-size: 34px;
        }

        .heroSeal small {
          color: #78939e;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .eyebrow {
          margin: 0;
          color: #6fe4f6;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .23em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3 {
          font-family: Georgia, "Times New Roman", serif;
        }

        .hero h1 {
          margin: 14px auto 0;
          font-size: clamp(50px, 6.2vw, 92px);
          line-height: .96;
          letter-spacing: -.055em;
          text-wrap: balance;
        }

        .lead {
          max-width: 980px;
          margin: 26px auto 0;
          color: #adbec7;
          font-size: 17px;
          line-height: 1.75;
        }

        .heroMetrics {
          margin-top: 35px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }

        .heroMetrics article {
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, .07);
          border-radius: 15px;
          background: rgba(5, 24, 38, .72);
        }

        .heroMetrics strong {
          display: block;
          color: #efd18c;
          font-family: Georgia, serif;
          font-size: 26px;
        }

        .heroMetrics span {
          display: block;
          margin-top: 5px;
          color: #748b96;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .principleBand {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding-bottom: 80px;
        }

        .principleBand article {
          padding: 23px;
          border: 1px solid rgba(111, 215, 239, .13);
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(9, 31, 45, .82), rgba(3, 16, 25, .9));
        }

        .principleBand span {
          color: #ffdb82;
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
        }

        .principleBand p {
          margin: 10px 0 0;
          color: #98aeb7;
          font-size: 13px;
          line-height: 1.62;
        }

        .workspace,
        .sequenceSection,
        .failureSection,
        .academySection,
        .closing {
          padding: 88px 0;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr .8fr;
          gap: 38px;
          align-items: end;
        }

        .sectionHeading.centered {
          display: block;
          max-width: 1050px;
          margin-inline: auto;
          text-align: center;
        }

        .sectionHeading h2,
        .academySection h2,
        .closing h2 {
          margin: 12px 0 0;
          font-size: clamp(39px, 4.8vw, 69px);
          line-height: .99;
          letter-spacing: -.048em;
          text-wrap: balance;
        }

        .sectionHeading > p {
          margin: 0;
          color: #98adb6;
          font-size: 15px;
          line-height: 1.72;
        }

        .filters {
          padding: 18px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 240px 240px auto;
          gap: 11px;
          align-items: end;
          border: 1px solid rgba(111, 215, 239, .13);
          border-radius: 18px;
          background: rgba(5, 22, 34, .86);
        }

        .filters label {
          display: grid;
          gap: 7px;
          color: #77939e;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .filters input,
        .filters select,
        .filters button {
          min-height: 46px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, .09);
          border-radius: 10px;
          outline: none;
          color: #edf8fb;
          background: rgba(0, 0, 0, .18);
        }

        .filters button {
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .filters option {
          background: #071522;
        }

        .timelineWorkspace {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 520px minmax(0, 1fr);
          gap: 17px;
          align-items: start;
        }

        .timelineRail,
        .recordInspector {
          border: 1px solid rgba(111, 215, 239, .13);
          border-radius: 23px;
          background: linear-gradient(145deg, rgba(8, 29, 43, .94), rgba(3, 13, 21, .98));
        }

        .timelineRail {
          padding: 17px;
          display: grid;
          gap: 9px;
        }

        .timelineItem {
          width: 100%;
          min-height: 82px;
          padding: 12px;
          display: grid;
          grid-template-columns: 66px 18px minmax(0, 1fr) 28px;
          gap: 10px;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, .06);
          border-radius: 13px;
          color: inherit;
          background: rgba(255, 255, 255, .02);
          cursor: pointer;
          text-align: left;
          transition: .22s;
        }

        .timelineItem:hover,
        .timelineItem.active {
          transform: translateX(4px);
          border-color: rgba(111, 228, 246, .34);
          background: rgba(111, 228, 246, .055);
        }

        .year {
          color: #f1cd7e;
          font-family: Georgia, serif;
          font-size: 20px;
        }

        .node {
          width: 12px;
          height: 12px;
          position: relative;
          border: 2px solid #6fe4f6;
          border-radius: 50%;
          box-shadow: 0 0 13px rgba(111, 228, 246, .42);
        }

        .node::before,
        .node::after {
          content: "";
          position: absolute;
          left: 50%;
          width: 1px;
          height: 37px;
          transform: translateX(-50%);
          background: rgba(111, 228, 246, .22);
        }

        .node::before {
          bottom: 100%;
        }

        .node::after {
          top: 100%;
        }

        .itemCopy {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .itemCopy small {
          color: #6f8a96;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .itemCopy strong {
          font-size: 11px;
          line-height: 1.35;
        }

        .itemCopy em {
          color: #d2ad5b;
          font-size: 8px;
          font-style: normal;
        }

        .index {
          color: #4f6f7b;
          font-size: 8px;
        }

        .empty {
          padding: 40px 20px;
          color: #8298a2;
          text-align: center;
        }

        .recordInspector {
          position: sticky;
          top: 18px;
          padding: 28px;
        }

        .recordHeader {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 20px;
          align-items: center;
        }

        .recordYear {
          width: 110px;
          height: 110px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 204, 94, .3);
          border-radius: 50%;
          color: #ffe1a0;
          background: radial-gradient(circle, rgba(255, 202, 84, .08), transparent 70%);
          font-family: Georgia, serif;
          font-size: 28px;
        }

        .recordHeader p {
          margin: 0;
          color: #6fe4f6;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .recordHeader h3 {
          margin: 7px 0 0;
          font-size: clamp(29px, 3vw, 44px);
          line-height: 1;
        }

        .recordHeader span {
          display: block;
          margin-top: 9px;
          color: #839aa4;
          font-size: 10px;
        }

        .recordSummary {
          margin-top: 22px;
          padding: 19px;
          border: 1px solid rgba(255, 255, 255, .07);
          border-radius: 15px;
          background: rgba(0, 0, 0, .14);
        }

        .recordSummary span {
          color: #e5bb61;
          font-size: 8px;
          font-weight: 950;
          text-transform: uppercase;
        }

        .recordSummary p {
          margin: 9px 0 0;
          color: #b6c8cf;
          font-size: 14px;
          line-height: 1.68;
        }

        .boundaryGrid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .boundaryGrid article {
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, .07);
          border-radius: 14px;
          background: rgba(255, 255, 255, .02);
        }

        .boundaryGrid span {
          color: #68dceb;
          font-size: 7px;
          font-weight: 950;
          letter-spacing: .08em;
        }

        .boundaryGrid strong {
          display: block;
          margin-top: 8px;
          color: #aebfc6;
          font-size: 10px;
          line-height: 1.5;
        }

        .recordActions,
        .academyActions,
        .closing > div {
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 9px;
        }

        .recordActions a,
        .academyActions a,
        .closing a {
          min-height: 45px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 10px;
          color: #c2d5dc;
          background: rgba(0, 0, 0, .18);
          text-decoration: none;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .recordActions .primary,
        .academyActions .primary,
        .closing .primary {
          color: #03141b;
          border-color: #9deefa;
          background: linear-gradient(135deg, #d9fbff, #72dff0 64%, #39abc6);
        }

        .sequenceGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 11px;
        }

        .sequenceGrid article {
          min-height: 200px;
          padding: 20px;
          border: 1px solid rgba(111, 215, 239, .11);
          border-radius: 17px;
          background: linear-gradient(145deg, rgba(9, 30, 44, .78), rgba(4, 16, 25, .88));
        }

        .sequenceGrid span,
        .failureGrid > article > span,
        .academyGrid > article > span {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 204, 92, .24);
          border-radius: 50%;
          color: #efc86f;
          font-size: 8px;
        }

        .sequenceGrid strong {
          display: block;
          margin-top: 24px;
          font-family: Georgia, serif;
          font-size: 20px;
        }

        .sequenceGrid p {
          margin: 10px 0 0;
          color: #8198a2;
          font-size: 10px;
          line-height: 1.58;
        }

        .failureGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 11px;
          margin-top: 35px;
        }

        .failureGrid article {
          min-height: 245px;
          padding: 21px;
          border: 1px solid rgba(255, 115, 136, .15);
          border-radius: 17px;
          background: linear-gradient(145deg, rgba(43, 15, 23, .42), rgba(5, 18, 27, .9));
        }

        .failureGrid h3 {
          margin: 27px 0 0;
          font-size: 21px;
        }

        .failureGrid p {
          color: #9caeb5;
          font-size: 11px;
          line-height: 1.6;
        }

        .academySection {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 55px;
          align-items: center;
          border-top: 1px solid rgba(111, 215, 239, .13);
          border-bottom: 1px solid rgba(111, 215, 239, .13);
        }

        .academySeal {
          width: 310px;
          height: 310px;
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(98, 240, 180, .52);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(98, 240, 180, .14), rgba(4, 26, 31, .95));
          box-shadow: 0 0 70px rgba(98, 240, 180, .14);
        }

        .academySeal small {
          color: #74a997;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .academySeal strong {
          color: #baffdc;
          font-family: Georgia, serif;
          font-size: 45px;
        }

        .academySeal span {
          margin-top: 8px;
          color: #64d9ae;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .13em;
        }

        .academySection > div > p:not(.eyebrow) {
          color: #a3b6bd;
          font-size: 15px;
          line-height: 1.72;
        }

        .academyGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 23px;
        }

        .academyGrid article {
          padding: 15px;
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 12px;
          border: 1px solid rgba(98, 240, 180, .12);
          border-radius: 13px;
          background: rgba(255, 255, 255, .02);
        }

        .academyGrid strong {
          font-size: 11px;
        }

        .academyGrid p {
          margin: 5px 0 0;
          color: #78918b;
          font-size: 9px;
          line-height: 1.45;
        }

        .closing {
          text-align: center;
        }

        .closing > p:not(.eyebrow) {
          max-width: 880px;
          margin: 20px auto 0;
          color: #a2b5bd;
          font-size: 15px;
          line-height: 1.75;
        }

        .closing > div {
          justify-content: center;
        }

        @media (max-width: 1100px) {
          .timelineWorkspace {
            grid-template-columns: 1fr;
          }

          .recordInspector {
            position: static;
          }

          .filters {
            grid-template-columns: 1fr 1fr;
          }

          .sequenceGrid,
          .failureGrid {
            grid-template-columns: 1fr 1fr;
          }

          .academySection {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .shell {
            width: calc(100% - 22px);
          }

          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbar span {
            display: none;
          }

          .hero {
            padding-top: 62px;
          }

          .hero h1 {
            font-size: 49px;
          }

          .heroMetrics,
          .principleBand,
          .sectionHeading,
          .filters,
          .boundaryGrid,
          .sequenceGrid,
          .failureGrid,
          .academyGrid {
            grid-template-columns: 1fr;
          }

          .timelineItem {
            grid-template-columns: 58px 16px 1fr;
          }

          .timelineItem .index {
            display: none;
          }

          .recordHeader {
            grid-template-columns: 1fr;
          }

          .recordYear {
            width: 92px;
            height: 92px;
          }

          .academySeal {
            width: 245px;
            height: 245px;
          }

          .recordActions,
          .academyActions,
          .closing > div {
            flex-direction: column;
          }

          .recordActions a,
          .academyActions a,
          .closing a {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
