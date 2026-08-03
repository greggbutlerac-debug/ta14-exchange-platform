"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

type StatusFamily =
  | "In force"
  | "Published"
  | "Adopted"
  | "Proposed"
  | "Under development"
  | "Guidance"
  | "Superseded"
  | "Unknown";

type StatusDefinition = {
  family: StatusFamily;
  code: string;
  title: string;
  description: string;
  authorityEffect: string;
  evidenceQuestion: string;
  executionBoundary: string;
  academyPrompt: string;
};

const statusDefinitions: StatusDefinition[] = [
  {
    family: "In force",
    code: "IF",
    title: "In force",
    description:
      "An enacted or formally effective instrument that currently carries legal or regulatory effect within a defined jurisdiction and scope.",
    authorityEffect:
      "May impose binding duties when jurisdiction, role, activity, effective date, exemptions, and controlling edition are established.",
    evidenceQuestion:
      "What official source proves the instrument is currently effective for this subject, place, activity, and date?",
    executionBoundary:
      "The label does not establish applicability by itself. Current authority, scope, evidence, and implementation conditions must still be resolved.",
    academyPrompt:
      "Learn how enacted text, effective dates, amendments, delegated rules, exemptions, and judicial interpretation affect present authority.",
  },
  {
    family: "Published",
    code: "PB",
    title: "Published",
    description:
      "An issued standard, framework, report, method, specification, or institutional record available in a defined edition or version.",
    authorityEffect:
      "Publication proves issuance, not automatic legal force. Authority may arise through adoption, incorporation, contract, policy, permit, or another binding source.",
    evidenceQuestion:
      "Which exact edition was issued, who published it, and how did it become relevant to the governed route?",
    executionBoundary:
      "A published instrument cannot be treated as self-executing authority unless its adoption pathway is preserved.",
    academyPrompt:
      "Study the difference between publication, adoption, accreditation, certification, incorporation by reference, and legal enforceability.",
  },
  {
    family: "Adopted",
    code: "AD",
    title: "Adopted",
    description:
      "An instrument formally accepted into law, regulation, code, policy, permit, contract, organizational governance, or another controlling authority path.",
    authorityEffect:
      "May become binding within the adopting authority's defined subject, edition, geography, role, and enforcement boundary.",
    evidenceQuestion:
      "Who adopted it, under what authority, which edition was adopted, and what limitations or modifications accompanied adoption?",
    executionBoundary:
      "Adoption must be tied to the actual controlling source; a newer published edition does not automatically replace the adopted edition.",
    academyPrompt:
      "Trace adoption from publisher to law, code, contract, permit, policy, or organizational mandate and identify the controlling version.",
  },
  {
    family: "Proposed",
    code: "PR",
    title: "Proposed",
    description:
      "A bill, draft rule, model law, proposed standard, consultation text, TA-14 upgrade, or other instrument not yet carrying final binding effect.",
    authorityEffect:
      "May influence planning, consultation, readiness, research, and policy development but does not carry enacted force merely because it has been proposed.",
    evidenceQuestion:
      "What proposal stage, sponsor, version, consultation record, and path to adoption can be verified?",
    executionBoundary:
      "Proposed language must never be represented as enacted law, final regulation, adopted code, or accredited standard.",
    academyPrompt:
      "Compare the current instrument with the proposal, identify the gap, inspect the upgraded duty, and understand what must occur before adoption.",
  },
  {
    family: "Under development",
    code: "UD",
    title: "Under development",
    description:
      "An instrument, revision, implementation system, or institutional record that remains in active drafting, committee, testing, consultation, or validation.",
    authorityEffect:
      "Supports awareness and preparation but ordinarily lacks final authority until development, approval, publication, and adoption conditions are completed.",
    evidenceQuestion:
      "What body controls development, what stage has been reached, what version is being reviewed, and what remains unresolved?",
    executionBoundary:
      "Draft content must remain bounded as provisional and cannot be used to overstate present compliance, conformity, or authority.",
    academyPrompt:
      "Learn how committee stages, public comment, ballots, validation, publication, and adoption transform a draft into a controlling instrument.",
  },
  {
    family: "Guidance",
    code: "GD",
    title: "Guidance",
    description:
      "A recommendation, advisory framework, health guideline, interpretive resource, technical report, or best-practice document intended to inform decisions.",
    authorityEffect:
      "May shape professional practice, policy, risk assessment, evidence interpretation, or reasonableness without independently creating a legal duty.",
    evidenceQuestion:
      "Who issued the guidance, for what audience and purpose, and has another authority made it mandatory or contractually controlling?",
    executionBoundary:
      "Guidance must not be mislabeled as law, regulation, adopted code, certification, or permission to execute.",
    academyPrompt:
      "Inspect how health guidance, technical recommendations, and policy frameworks inform decisions while remaining distinct from binding authority.",
  },
  {
    family: "Superseded",
    code: "SS",
    title: "Superseded",
    description:
      "An earlier edition, withdrawn rule, replaced policy, amended instrument, or prior record that no longer represents the current controlling version.",
    authorityEffect:
      "May remain historically relevant to conduct, contracts, permits, events, or installations governed during its effective period.",
    evidenceQuestion:
      "When was it replaced, what superseded it, and does the earlier edition still govern any preserved event, contract, permit, or installed condition?",
    executionBoundary:
      "A superseded instrument cannot be silently used as current authority, but it must not be erased when it controlled the historical route.",
    academyPrompt:
      "Learn version continuity, transition periods, grandfathering, retroactivity, preserved history, and the difference between current and event-time authority.",
  },
  {
    family: "Unknown",
    code: "UN",
    title: "Unresolved or unspecified",
    description:
      "The record does not yet establish a reliable status, controlling edition, effective date, adoption path, or supersession relationship.",
    authorityEffect:
      "No execution reliance should be granted until the status and controlling authority are resolved.",
    evidenceQuestion:
      "Which official source, version, date, adoption record, and authority are missing?",
    executionBoundary:
      "Unresolved status creates a HOLD condition for consequential reliance.",
    academyPrompt:
      "Practice resolving incomplete status records and learn when uncertainty requires HOLD or ESCALATE rather than assumption.",
  },
];

const statusJourney = [
  ["01", "Identify", "Identify the instrument, publisher, jurisdiction, record type, and claimed status."],
  ["02", "Source", "Locate the official publication, register, repository, code, contract, permit, or institutional record."],
  ["03", "Version", "Preserve the edition, revision, amendment, publication date, effective date, and transition period."],
  ["04", "Authority", "Determine who issued, adopted, enforced, interpreted, or superseded the instrument."],
  ["05", "Scope", "Resolve subject, role, activity, geography, sector, thresholds, exemptions, and exclusions."],
  ["06", "Status", "Classify the instrument without collapsing publication, adoption, proposal, guidance, or legal force."],
  ["07", "Determine", "Issue ALLOW, HOLD, DENY, or ESCALATE for the proposed reliance on the status claim."],
  ["08", "Preserve", "Bind the conclusion to its source, evidence, date, limitations, review path, and future revalidation trigger."],
] as const;

const failureModes = [
  ["Published treated as binding", "A standard or framework is cited as mandatory even though no adoption, contract, regulation, permit, or policy makes it controlling."],
  ["Proposal presented as enacted", "Draft legislation, a proposed rule, or a TA-14 model law is described as though it already carries legal force."],
  ["Latest edition assumed controlling", "The newest published standard is used even though a jurisdiction adopted an older edition or modified it during adoption."],
  ["Superseded authority erased", "A prior edition that governed the historical event is removed instead of preserved for reconstruction and review."],
  ["Guidance elevated to law", "A WHO guideline, agency advisory, framework, or recommendation is represented as a directly enforceable legal requirement."],
  ["Effective date ignored", "An enacted or published instrument is applied before its effective date, after expiration, or outside a transition period."],
  ["Status copied without source", "A catalog label is repeated without an official publication, register, adoption record, or controlling authority source."],
  ["Status not revalidated", "A status conclusion remains in use after amendment, withdrawal, supersession, jurisdiction change, or material system change."],
] as const;

function normalizeStatus(value?: string): StatusFamily {
  const status = (value || "").trim().toLowerCase();
  if (status.includes("force") || status.includes("effective") || status.includes("enacted")) return "In force";
  if (status.includes("adopt")) return "Adopted";
  if (status.includes("propos") || status.includes("draft")) return "Proposed";
  if (status.includes("develop") || status.includes("consult") || status.includes("progress")) return "Under development";
  if (status.includes("guid") || status.includes("recommend") || status.includes("advis")) return "Guidance";
  if (status.includes("supers") || status.includes("withdraw") || status.includes("repeal") || status.includes("retired")) return "Superseded";
  if (status.includes("publish") || status.includes("issued") || status.includes("final")) return "Published";
  return "Unknown";
}

function statusClass(value: StatusFamily) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

export default function GovernanceLibraryStatusPage() {
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFamily | "All">("All");
  const [selectedRecordType, setSelectedRecordType] = useState("All record types");
  const [selectedSlug, setSelectedSlug] = useState(governanceLibraryRecords[0]?.slug ?? "");

  const normalizedRecords = useMemo(
    () => governanceLibraryRecords.map((record) => ({ record, family: normalizeStatus(record.status) })),
    [],
  );

  const recordTypes = useMemo(
    () => ["All record types", ...Array.from(new Set(governanceLibraryRecords.map((record) => record.recordType))).sort()],
    [],
  );

  const filteredRecords = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return normalizedRecords.filter(({ record, family }) => {
      const statusMatches = selectedStatus === "All" || family === selectedStatus;
      const typeMatches = selectedRecordType === "All record types" || record.recordType === selectedRecordType;
      const searchable = [
        record.title,
        record.summary,
        record.publisher,
        record.jurisdiction,
        record.recordType,
        record.status,
        family,
      ].join(" ").toLowerCase();
      return statusMatches && typeMatches && terms.every((term) => searchable.includes(term));
    });
  }, [normalizedRecords, query, selectedRecordType, selectedStatus]);

  const selectedEntry =
    normalizedRecords.find(({ record }) => record.slug === selectedSlug) ??
    filteredRecords[0] ??
    normalizedRecords[0];

  const selectedDefinition =
    statusDefinitions.find((definition) => definition.family === selectedEntry?.family) ?? statusDefinitions[7];

  const metrics = useMemo(() => ({
    records: governanceLibraryRecords.length,
    statuses: new Set(normalizedRecords.map(({ family }) => family)).size,
    publishers: new Set(governanceLibraryRecords.map((record) => record.publisher)).size,
    jurisdictions: new Set(governanceLibraryRecords.map((record) => record.jurisdiction)).size,
    unresolved: normalizedRecords.filter(({ family }) => family === "Unknown").length,
  }), [normalizedRecords]);

  return (
    <main className="statusPage">
      <div className="background" aria-hidden="true">
        <div className="grid" />
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="route routeOne" />
        <div className="route routeTwo" />
      </div>

      <div className="shell">
        <header className="topbar">
          <Link href="/governance-library">← Governance Library</Link>
          <span><i /> Institutional status resolution</span>
          <Link className="topAction" href="/governance-library/applicability">Resolve applicability →</Link>
        </header>

        <section className="hero">
          <div className="heroSeal"><span>ST</span><small>TA-14</small></div>
          <p className="eyebrow">TA-14 INSTITUTIONAL GOVERNANCE LIBRARY</p>
          <h1>Governance Status <em>Resolution System</em></h1>
          <p className="lead">
            Determine whether an instrument is in force, published, adopted, proposed, under development, guidance, superseded, or unresolved—without confusing publication with authority or proposal with enacted law.
          </p>
          <div className="heroActions">
            <a className="primary" href="#status-workspace">Open Status Workspace ↓</a>
            <Link className="secondary" href="/governance-library/authorities">Resolve Authority ↗</Link>
            <Link className="secondary" href="/governance-library/jurisdiction">Resolve Jurisdiction ↗</Link>
          </div>
          <div className="metrics">
            <article><strong>{metrics.records}</strong><span>Library records</span></article>
            <article><strong>{metrics.statuses}</strong><span>Status families</span></article>
            <article><strong>{metrics.publishers}</strong><span>Publishers</span></article>
            <article><strong>{metrics.jurisdictions}</strong><span>Jurisdictions</span></article>
            <article><strong>{metrics.unresolved}</strong><span>Unresolved records</span></article>
          </div>
        </section>

        <section className="definitionSection">
          <div className="sectionHeading">
            <div><p className="eyebrow">STATUS IS A GOVERNED CLAIM</p><h2>One word can change the authority of an entire route.</h2></div>
            <p>A status label must be supported by an official source, version, date, authority, jurisdiction, adoption path, and supersession record. TA-14 preserves those distinctions before reliance.</p>
          </div>
          <div className="definitionGrid">
            {statusDefinitions.map((definition) => (
              <button
                type="button"
                key={definition.family}
                className={selectedStatus === definition.family ? "active" : ""}
                onClick={() => setSelectedStatus(definition.family)}
              >
                <span className={`statusCode ${statusClass(definition.family)}`}>{definition.code}</span>
                <strong>{definition.title}</strong>
                <p>{definition.description}</p>
                <small>Inspect records →</small>
              </button>
            ))}
          </div>
        </section>

        <section className="workspaceSection" id="status-workspace">
          <div className="sectionHeading compact">
            <div><p className="eyebrow">STATUS CONTROL DESK</p><h2>Find the record. Inspect the status. Preserve the boundary.</h2></div>
            <p>Search across laws, regulations, standards, codes, frameworks, guidance, proposals, and institutional records.</p>
          </div>

          <div className="filters">
            <label>Search records<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, publisher, jurisdiction, status..." /></label>
            <label>Status<select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as StatusFamily | "All")}><option value="All">All statuses</option>{statusDefinitions.map((item) => <option key={item.family} value={item.family}>{item.title}</option>)}</select></label>
            <label>Record type<select value={selectedRecordType} onChange={(event) => setSelectedRecordType(event.target.value)}>{recordTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
            <button type="button" onClick={() => { setQuery(""); setSelectedStatus("All"); setSelectedRecordType("All record types"); }}>Clear filters</button>
          </div>

          <div className="workspaceGrid">
            <aside className="recordIndex">
              <div className="indexHeader"><span>STATUS INDEX</span><strong>{filteredRecords.length} records</strong></div>
              <div className="recordList">
                {filteredRecords.map(({ record, family }, index) => (
                  <button type="button" key={record.slug} onClick={() => setSelectedSlug(record.slug)} className={selectedEntry?.record.slug === record.slug ? "active" : ""}>
                    <span className="recordNumber">{String(index + 1).padStart(2, "0")}</span>
                    <div><small>{record.recordType}</small><strong>{record.title}</strong><em>{record.publisher} · {record.jurisdiction}</em></div>
                    <i className={statusClass(family)} />
                  </button>
                ))}
                {filteredRecords.length === 0 ? <div className="empty"><strong>No records matched.</strong><p>Clear filters or broaden the search.</p></div> : null}
              </div>
            </aside>

            {selectedEntry ? (
              <article className="recordInspector">
                <div className="recordHeader">
                  <div className={`recordSeal ${statusClass(selectedEntry.family)}`}>{selectedDefinition.code}</div>
                  <div><p>{selectedEntry.record.publisher}</p><h3>{selectedEntry.record.title}</h3><span>{selectedEntry.record.recordType}</span></div>
                  <b className={statusClass(selectedEntry.family)}>{selectedDefinition.title}</b>
                </div>

                <div className="authorityStrip">
                  <div><span>Declared status</span><strong>{selectedEntry.record.status || "Unspecified"}</strong></div>
                  <div><span>Normalized status</span><strong>{selectedEntry.family}</strong></div>
                  <div><span>Jurisdiction</span><strong>{selectedEntry.record.jurisdiction}</strong></div>
                  <div><span>Publisher</span><strong>{selectedEntry.record.publisher}</strong></div>
                </div>

                <section className="summaryCard"><span>RECORD SUMMARY</span><p>{selectedEntry.record.summary}</p></section>

                <div className="analysisGrid">
                  <section><span>STATUS MEANING</span><strong>{selectedDefinition.description}</strong></section>
                  <section><span>AUTHORITY EFFECT</span><strong>{selectedDefinition.authorityEffect}</strong></section>
                  <section><span>EVIDENCE QUESTION</span><strong>{selectedDefinition.evidenceQuestion}</strong></section>
                  <section><span>EXECUTION BOUNDARY</span><strong>{selectedDefinition.executionBoundary}</strong></section>
                </div>

                <section className="academyCard">
                  <div className="academySeal">AC</div>
                  <div><span>TA-14 STATUS ACADEMY</span><h4>{selectedDefinition.title} status pathway</h4><p>{selectedDefinition.academyPrompt}</p></div>
                </section>

                <section className="determinationCard">
                  <span>STATUS RELIANCE DETERMINATION</span>
                  <h4>{selectedEntry.family === "Unknown" ? "HOLD until the governing status is resolved." : "Status identified; applicability and authority still require separate resolution."}</h4>
                  <p>No status label independently authorizes execution. The instrument must still pass authority, jurisdiction, applicability, evidence, continuity, and current-version review.</p>
                </section>

                <div className="recordActions">
                  <Link href={`/governance-library/${selectedEntry.record.slug}`}>Open Record</Link>
                  <Link href="/governance-library/authorities">Resolve Authority</Link>
                  <Link className="primaryAction" href="/governance-library/applicability">Resolve Applicability →</Link>
                </div>
              </article>
            ) : null}
          </div>
        </section>

        <section className="journeySection">
          <div className="sectionHeading"><div><p className="eyebrow">STATUS RESOLUTION SEQUENCE</p><h2>Do not trust the label. Reconstruct the status.</h2></div><p>Each transition preserves the evidence needed to defend why a status was accepted, held, denied, or escalated.</p></div>
          <div className="journeyGrid">{statusJourney.map(([number, title, text]) => <article key={number}><span>{number}</span><strong>{title}</strong><p>{text}</p></article>)}</div>
        </section>

        <section className="failureSection">
          <div className="sectionHeading"><div><p className="eyebrow">STATUS FAILURE MODES</p><h2>Most authority failures begin with a status assumption.</h2></div><p>The institution teaches the participant to detect the exact point where a record became overstated, stale, incomplete, or falsely binding.</p></div>
          <div className="failureGrid">{failureModes.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p><small>{index % 4 === 0 ? "HOLD" : index % 4 === 1 ? "DENY" : index % 4 === 2 ? "ESCALATE" : "REVALIDATE"}</small></article>)}</div>
        </section>

        <section className="boundarySection">
          <div className="boundarySeal">SB</div>
          <p className="eyebrow gold">INSTITUTIONAL STATUS BOUNDARY</p>
          <h2>Status classification is not legal advice, certification, conformity, or permission to execute.</h2>
          <p>This page organizes the status represented in TA-14 library records and teaches how status should be verified. Official sources, enacted text, registers, adopting authorities, courts, regulators, contracts, permits, and qualified reviewers remain controlling.</p>
          <div className="boundaryGrid">
            <article><span>THE LIBRARY PROVIDES</span><strong>Classification, navigation, source questions, evidence boundaries, and review pathways.</strong></article>
            <article><span>THE LIBRARY DOES NOT PROVIDE</span><strong>Automatic legal effect, official publication, certification, accreditation, or universal applicability.</strong></article>
            <article><span>EXECUTION REQUIRES</span><strong>Current authority, jurisdiction, applicability, admissible evidence, binding, control, and preserved outcome.</strong></article>
          </div>
          <div className="boundaryActions"><Link href="/governance-library/type">Resolve Record Type</Link><Link href="/governance-library/jurisdiction">Resolve Jurisdiction</Link><Link className="primaryAction" href="/governance-library/applicability">Resolve Applicability →</Link></div>
        </section>

        <footer><span>TA-14 Authority Governance Institution</span><span>Governance Status Resolution System · TA14Authority.org</span></footer>
      </div>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }
        :global(html) {
          scroll-behavior: smooth;
          background: #020813;
        }
        :global(body) {
          margin: 0;
          color: #f4f9fc;
          background: #020813;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        :global(a) {
          color: inherit;
        }
        .statusPage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background: linear-gradient(180deg, rgba(2, 10, 22, .72), rgba(2, 7, 15, .97));
        }
        .background {
          position: fixed;
          inset: 0;
          z-index: -3;
          overflow: hidden;
          pointer-events: none;
          background: radial-gradient(circle at 50% -10%, rgba(43, 157, 215, .17), transparent 36%), linear-gradient(180deg, #020914, #04111c 52%, #01050b);
        }
        .grid {
          position: absolute;
          inset: 0;
          opacity: .15;
          background-image: linear-gradient(rgba(104, 216, 242, .18) 1px, transparent 1px), linear-gradient(90deg, rgba(104, 216, 242, .18) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }
        .glow {
          position: absolute;
          width: 720px;
          height: 720px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: .13;
        }
        .glowOne {
          left: -260px;
          top: 18%;
          background: #1485d1;
        }
        .glowTwo {
          right: -280px;
          top: 58%;
          background: #dc9c2f;
        }
        .route {
          position: absolute;
          width: 74vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(80, 208, 241, .56), rgba(242, 190, 86, .45), transparent);
          filter: drop-shadow(0 0 8px rgba(80, 208, 241, .4));
        }
        .routeOne {
          left: -12%;
          top: 26%;
          transform: rotate(-8deg);
        }
        .routeTwo {
          right: -18%;
          top: 70%;
          transform: rotate(9deg);
        }
        .shell {
          width: min(1480px, calc(100% - 38px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
          padding-bottom: 70px;
        }
        .topbar {
          min-height: 72px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid rgba(106, 216, 240, .15);
        }
        .topbar a {
          width: max-content;
          padding: 10px 13px;
          border: 1px solid rgba(255, 255, 255, .09);
          border-radius: 10px;
          color: #b5c9d2;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .06em;
          text-transform: uppercase;
        }
        .topbar .topAction {
          justify-self: end;
          color: #06131c;
          border-color: #a9edf9;
          background: linear-gradient(135deg, #d8fbff, #6bdbea 66%, #39a7c0);
        }
        .topbar > span {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #78929d;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .13em;
          text-transform: uppercase;
        }
        .topbar > span i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6de4b0;
          box-shadow: 0 0 14px rgba(109, 228, 176, .9);
        }
        .hero {
          max-width: 1180px;
          margin-inline: auto;
          padding: 88px 0 78px;
          text-align: center;
        }
        .heroSeal {
          width: 108px;
          height: 108px;
          margin: 0 auto 26px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(246, 197, 91, .38);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(246, 197, 91, .12), rgba(4, 20, 34, .95) 68%);
          box-shadow: 0 0 60px rgba(246, 197, 91, .1);
        }
        .heroSeal span {
          color: #ffe29a;
          font: 900 31px Georgia, serif;
        }
        .heroSeal small {
          color: #76919d;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .16em;
        }
        .eyebrow {
          margin: 0;
          color: #68dff2;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .22em;
          text-transform: uppercase;
        }
        .eyebrow.gold {
          color: #edbd5d;
        }
        h1, h2, h3, h4 {
          font-family: Georgia, "Times New Roman", serif;
        }
        .hero h1 {
          margin: 14px 0 0;
          font-size: clamp(52px, 6.3vw, 94px);
          line-height: .94;
          letter-spacing: -.055em;
        }
        .hero h1 em {
          display: block;
          color: #aabcc5;
          font-weight: 500;
        }
        .lead {
          max-width: 930px;
          margin: 26px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }
        .heroActions {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 11px;
        }
        .heroActions a, .recordActions a, .boundaryActions a {
          min-height: 48px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 12px;
          color: #c9d9df;
          background: rgba(4, 20, 32, .82);
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .05em;
          text-transform: uppercase;
          transition: .22s;
        }
        .heroActions a:hover, .recordActions a:hover, .boundaryActions a:hover {
          transform: translateY(-3px);
        }
        .heroActions .primary, .primaryAction {
          color: #05151b !important;
          border-color: #a8eff8 !important;
          background: linear-gradient(135deg, #dcfcff, #72dfed 65%, #3fa7bf) !important;
        }
        .metrics {
          margin-top: 38px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 11px;
        }
        .metrics article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, .07);
          border-radius: 15px;
          background: rgba(5, 21, 34, .66);
        }
        .metrics strong {
          display: block;
          color: #f0cf87;
          font: 700 28px Georgia, serif;
        }
        .metrics span {
          display: block;
          margin-top: 5px;
          color: #758f9a;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .definitionSection, .workspaceSection, .journeySection, .failureSection {
          padding: 82px 0;
        }
        .sectionHeading {
          margin-bottom: 32px;
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          align-items: end;
          gap: 42px;
        }
        .sectionHeading.compact {
          margin-bottom: 25px;
        }
        .sectionHeading h2, .boundarySection h2 {
          margin: 11px 0 0;
          font-size: clamp(39px, 4.6vw, 68px);
          line-height: .98;
          letter-spacing: -.048em;
        }
        .sectionHeading > p {
          margin: 0;
          color: #9bafb8;
          font-size: 15px;
          line-height: 1.72;
        }
        .definitionGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .definitionGrid button {
          min-height: 280px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          border: 1px solid rgba(255, 255, 255, .07);
          border-radius: 18px;
          color: inherit;
          background: linear-gradient(145deg, rgba(9, 31, 47, .84), rgba(3, 14, 24, .94));
          cursor: pointer;
          text-align: left;
          transition: .22s;
        }
        .definitionGrid button:hover, .definitionGrid button.active {
          transform: translateY(-5px);
          border-color: rgba(101, 220, 241, .3);
          box-shadow: 0 18px 45px rgba(0, 0, 0, .25);
        }
        .statusCode {
          width: 47px;
          height: 47px;
          display: grid;
          place-items: center;
          border: 1px solid currentColor;
          border-radius: 12px;
          color: #72def0;
          font-size: 10px;
          font-weight: 950;
        }
        .statusCode.in-force, .recordSeal.in-force, .recordHeader b.in-force { color: #6ce9ad; }
        .statusCode.published, .recordSeal.published, .recordHeader b.published { color: #72dff1; }
        .statusCode.adopted, .recordSeal.adopted, .recordHeader b.adopted { color: #8cb7ff; }
        .statusCode.proposed, .recordSeal.proposed, .recordHeader b.proposed { color: #edbd5d; }
        .statusCode.under-development, .recordSeal.under-development, .recordHeader b.under-development { color: #d7a6ff; }
        .statusCode.guidance, .recordSeal.guidance, .recordHeader b.guidance { color: #80e5d0; }
        .statusCode.superseded, .recordSeal.superseded, .recordHeader b.superseded { color: #ef7d89; }
        .statusCode.unknown, .recordSeal.unknown, .recordHeader b.unknown { color: #a7b2b8; }
        .definitionGrid strong {
          margin-top: 20px;
          font: 700 23px Georgia, serif;
        }
        .definitionGrid p {
          margin: 11px 0 0;
          color: #91a7b1;
          font-size: 12px;
          line-height: 1.62;
        }
        .definitionGrid small {
          margin-top: auto;
          padding-top: 20px;
          color: #69d9eb;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .08em;
        }
        .filters {
          padding: 18px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 220px 240px auto;
          gap: 11px;
          align-items: end;
          border: 1px solid rgba(101, 220, 241, .13);
          border-radius: 19px;
          background: linear-gradient(145deg, rgba(8, 29, 45, .95), rgba(3, 13, 23, .98));
        }
        label {
          display: grid;
          gap: 7px;
          color: #7895a1;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .09em;
          text-transform: uppercase;
        }
        input, select {
          width: 100%;
          min-height: 46px;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 10px;
          outline: none;
          color: #e8f2f6;
          background: rgba(0, 0, 0, .2);
          font: inherit;
          text-transform: none;
        }
        select option {
          background: #071522;
        }
        .filters button {
          min-height: 46px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 10px;
          color: #bacbd2;
          background: rgba(0, 0, 0, .2);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }
        .workspaceGrid {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 400px minmax(0, 1fr);
          gap: 16px;
          align-items: start;
        }
        .recordIndex, .recordInspector {
          border: 1px solid rgba(101, 220, 241, .12);
          border-radius: 22px;
          background: linear-gradient(145deg, rgba(8, 29, 44, .95), rgba(3, 13, 22, .98));
        }
        .recordIndex {
          position: sticky;
          top: 18px;
          padding: 17px;
          max-height: 920px;
          overflow: auto;
        }
        .indexHeader {
          padding: 4px 3px 14px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, .06);
        }
        .indexHeader span {
          color: #69d9eb;
          font-size: 8px;
          font-weight: 900;
        }
        .indexHeader strong {
          color: #edc979;
          font: 700 16px Georgia, serif;
        }
        .recordList {
          margin-top: 13px;
          display: grid;
          gap: 8px;
        }
        .recordList button {
          width: 100%;
          padding: 12px;
          display: grid;
          grid-template-columns: 39px minmax(0, 1fr) 8px;
          gap: 10px;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, .06);
          border-radius: 12px;
          color: inherit;
          background: rgba(0, 0, 0, .15);
          cursor: pointer;
          text-align: left;
        }
        .recordList button:hover, .recordList button.active {
          border-color: rgba(101, 220, 241, .29);
          background: rgba(101, 220, 241, .05);
        }
        .recordNumber {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(101, 220, 241, .14);
          border-radius: 9px;
          color: #68d9eb;
          font-size: 8px;
        }
        .recordList button div {
          min-width: 0;
        }
        .recordList small, .recordList strong, .recordList em {
          display: block;
        }
        .recordList small {
          color: #6f8792;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }
        .recordList strong {
          margin-top: 4px;
          color: #d9e7ec;
          font-size: 10px;
          line-height: 1.35;
        }
        .recordList em {
          margin-top: 4px;
          color: #6d838d;
          font-size: 7px;
          font-style: normal;
        }
        .recordList button > i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #82929a;
        }
        .recordList button > i.in-force { background: #6ce9ad; }
        .recordList button > i.published { background: #72dff1; }
        .recordList button > i.adopted { background: #8cb7ff; }
        .recordList button > i.proposed { background: #edbd5d; }
        .recordList button > i.under-development { background: #d7a6ff; }
        .recordList button > i.guidance { background: #80e5d0; }
        .recordList button > i.superseded { background: #ef7d89; }
        .recordList button > i.unknown { background: #a7b2b8; }
        .empty {
          padding: 34px 18px;
          text-align: center;
        }
        .empty p {
          color: #718792;
          font-size: 10px;
        }
        .recordInspector {
          padding: 26px;
        }
        .recordHeader {
          display: grid;
          grid-template-columns: 72px minmax(0, 1fr) auto;
          gap: 17px;
          align-items: center;
        }
        .recordSeal {
          width: 72px;
          height: 72px;
          display: grid;
          place-items: center;
          border: 1px solid currentColor;
          border-radius: 50%;
          font: 700 20px Georgia, serif;
        }
        .recordHeader p {
          margin: 0;
          color: #69d9eb;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }
        .recordHeader h3 {
          margin: 6px 0 0;
          font-size: clamp(29px, 3vw, 44px);
          line-height: 1;
        }
        .recordHeader span {
          display: block;
          margin-top: 7px;
          color: #8299a3;
          font-size: 10px;
        }
        .recordHeader b {
          padding: 9px 12px;
          border: 1px solid currentColor;
          border-radius: 999px;
          font-size: 8px;
          text-transform: uppercase;
        }
        .authorityStrip {
          margin-top: 22px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 9px;
        }
        .authorityStrip div, .summaryCard, .analysisGrid section {
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, .07);
          border-radius: 14px;
          background: rgba(0, 0, 0, .14);
        }
        .authorityStrip span, .summaryCard > span, .analysisGrid span {
          color: #68d9eb;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .authorityStrip strong {
          display: block;
          margin-top: 7px;
          font-size: 10px;
          line-height: 1.4;
        }
        .summaryCard {
          margin-top: 13px;
        }
        .summaryCard p {
          margin: 9px 0 0;
          color: #a8bac2;
          font-size: 13px;
          line-height: 1.68;
        }
        .analysisGrid {
          margin-top: 13px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 11px;
        }
        .analysisGrid strong {
          display: block;
          margin-top: 9px;
          color: #c9d7dc;
          font: 700 15px Georgia, serif;
          line-height: 1.48;
        }
        .academyCard, .determinationCard {
          margin-top: 13px;
          padding: 19px;
          display: grid;
          grid-template-columns: 62px 1fr;
          gap: 16px;
          border: 1px solid rgba(109, 231, 174, .18);
          border-radius: 15px;
          background: linear-gradient(145deg, rgba(21, 61, 48, .28), rgba(4, 20, 28, .8));
        }
        .academySeal {
          width: 62px;
          height: 62px;
          display: grid;
          place-items: center;
          border: 1px solid #6de7ae;
          border-radius: 50%;
          color: #9df3c7;
          font-family: Georgia, serif;
        }
        .academyCard span, .determinationCard > span {
          color: #70dfad;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .academyCard h4, .determinationCard h4 {
          margin: 7px 0 0;
          font-size: 22px;
        }
        .academyCard p, .determinationCard p {
          margin: 7px 0 0;
          color: #9eb3b8;
          font-size: 11px;
          line-height: 1.6;
        }
        .determinationCard {
          grid-template-columns: 1fr;
          border-color: rgba(239, 190, 90, .2);
          background: linear-gradient(145deg, rgba(60, 43, 12, .3), rgba(4, 20, 28, .82));
        }
        .determinationCard > span {
          color: #e7b95b;
        }
        .recordActions, .boundaryActions {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 9px;
        }
        .journeyGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 11px;
        }
        .journeyGrid article {
          min-height: 195px;
          padding: 20px;
          border: 1px solid rgba(101, 220, 241, .1);
          border-radius: 16px;
          background: rgba(7, 27, 41, .72);
        }
        .journeyGrid span {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(239, 190, 90, .22);
          border-radius: 50%;
          color: #e9bd64;
          font-size: 8px;
        }
        .journeyGrid strong {
          display: block;
          margin-top: 22px;
          font: 700 20px Georgia, serif;
        }
        .journeyGrid p {
          margin: 10px 0 0;
          color: #8198a2;
          font-size: 10px;
          line-height: 1.58;
        }
        .failureGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 11px;
        }
        .failureGrid article {
          min-height: 250px;
          padding: 21px;
          position: relative;
          border: 1px solid rgba(239, 125, 137, .13);
          border-radius: 17px;
          background: linear-gradient(145deg, rgba(47, 22, 31, .35), rgba(4, 18, 28, .88));
        }
        .failureGrid > article > span {
          color: #ef7d89;
          font-size: 9px;
          font-weight: 900;
        }
        .failureGrid h3 {
          margin: 28px 0 0;
          font-size: 22px;
          line-height: 1.05;
        }
        .failureGrid p {
          margin: 11px 0 0;
          color: #8fa4ad;
          font-size: 11px;
          line-height: 1.6;
        }
        .failureGrid small {
          position: absolute;
          left: 21px;
          bottom: 18px;
          color: #efb65c;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .12em;
        }
        .boundarySection {
          margin-top: 82px;
          padding: 56px 34px;
          border: 1px solid rgba(239, 190, 90, .23);
          border-radius: 29px;
          background: rgba(6, 20, 33, .96);
          text-align: center;
        }
        .boundarySeal {
          width: 82px;
          height: 82px;
          margin: 0 auto 24px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(239, 190, 90, .34);
          border-radius: 50%;
          color: #efc871;
          font: 700 23px Georgia, serif;
        }
        .boundarySection > p:not(.eyebrow) {
          max-width: 960px;
          margin: 21px auto 0;
          color: #9eafb7;
          font-size: 15px;
          line-height: 1.76;
        }
        .boundaryGrid {
          max-width: 1080px;
          margin: 30px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 11px;
        }
        .boundaryGrid article {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, .07);
          border-radius: 15px;
        }
        .boundaryGrid span {
          color: #e6b85c;
          font-size: 8px;
          font-weight: 900;
        }
        .boundaryGrid strong {
          display: block;
          margin-top: 9px;
          font-size: 12px;
          line-height: 1.5;
        }
        .boundaryActions {
          justify-content: center;
        }
        footer {
          min-height: 86px;
          margin-top: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid rgba(101, 220, 241, .12);
          color: #607a85;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .08em;
        }
        @media (max-width: 1120px) {
          .definitionGrid, .journeyGrid, .failureGrid {
            grid-template-columns: repeat(2, 1fr);
          }
          .workspaceGrid {
            grid-template-columns: 1fr;
          }
          .recordIndex {
            position: static;
            max-height: none;
          }
          .filters {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 760px) {
          .shell {
            width: calc(100% - 22px);
          }
          .topbar {
            grid-template-columns: 1fr auto;
          }
          .topbar > span {
            display: none;
          }
          .metrics, .definitionGrid, .journeyGrid, .failureGrid, .sectionHeading, .filters, .authorityStrip, .analysisGrid, .boundaryGrid {
            grid-template-columns: 1fr;
          }
          .recordHeader {
            grid-template-columns: 1fr;
          }
          .recordHeader b {
            width: max-content;
          }
          .academyCard {
            grid-template-columns: 1fr;
          }
          .recordActions, .boundaryActions {
            flex-direction: column;
          }
          .recordActions a, .boundaryActions a {
            width: 100%;
          }
          footer {
            flex-direction: column;
            justify-content: center;
            text-align: center;
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
