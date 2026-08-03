"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { governanceLibraryRecords } from "../../../lib/governance-library";
import type { GovernanceLibraryRecord } from "../../../lib/governance-library/records-foundational";

type SourceState = "Official" | "Supporting" | "Unresolved";
type SourceRecord = GovernanceLibraryRecord & {
  officialUrl?: string;
  sourceUrl?: string;
  jurisdiction?: string;
  year?: string | number;
  status?: string;
  category?: string;
  topics?: string[];
};

const sourcePrinciples = [
  {
    code: "01",
    title: "Official before secondary",
    text: "Use the issuing authority, standards body, legislature, regulator, treaty secretariat, or official publisher whenever an authoritative source is available.",
  },
  {
    code: "02",
    title: "Version before interpretation",
    text: "Preserve the edition, amendment, effective date, adoption state, and supersession history before relying on summaries or crosswalks.",
  },
  {
    code: "03",
    title: "Source before claim",
    text: "A governance claim should remain bounded to what the cited source actually establishes, not what a secondary description implies.",
  },
  {
    code: "04",
    title: "Authority before execution",
    text: "A source can prove publication or content, but execution still requires applicable authority, evidence, scope, binding, and a preserved determination.",
  },
] as const;

const sourceFailureModes = [
  ["Mirror treated as authority", "A copied or archived page is relied upon without confirming the controlling official publication."],
  ["Edition drift", "The source is official, but the edition used is not the edition adopted, contracted, or applicable to the reviewed activity."],
  ["Summary substituted for text", "A press release, article, or overview is treated as though it reproduces the controlling legal or technical requirements."],
  ["Jurisdiction omitted", "The source is real, but its territorial, sectoral, subject-matter, or organizational reach is not established."],
  ["Proposal treated as enacted", "A bill, draft, model law, consultation text, or TA-14 proposal is presented as currently binding authority."],
  ["Guidance treated as mandatory", "A recommendation or public-health guideline is cited as though it creates a legal duty without an adoption pathway."],
  ["Broken provenance", "The record cannot show where the source came from, when it was retrieved, or whether the content has changed."],
  ["Source proves too much", "A citation is used to support a conclusion broader than the source text, scope, evidence, or authority permits."],
] as const;

function normalize(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function sourceFor(record: SourceRecord): string {
  return normalize(record.officialUrl) || normalize(record.sourceUrl);
}

function sourceState(record: SourceRecord): SourceState {
  if (normalize(record.officialUrl)) return "Official";
  if (normalize(record.sourceUrl)) return "Supporting";
  return "Unresolved";
}

function sourceClass(value: SourceState): string {
  return value.toLowerCase();
}

function recordSearchText(record: SourceRecord): string {
  return [
    record.title,
    record.summary,
    record.publisher,
    record.recordType,
    record.jurisdiction,
    record.year,
    record.status,
    record.category,
    ...(Array.isArray(record.topics) ? record.topics : []),
  ]
    .map(normalize)
    .join(" ")
    .toLowerCase();
}

export default function GovernanceLibrarySourceIndexPage() {
  const records = governanceLibraryRecords as SourceRecord[];
  const [query, setQuery] = useState("");
  const [publisher, setPublisher] = useState("All publishers");
  const [recordType, setRecordType] = useState("All record types");
  const [state, setState] = useState<"All source states" | SourceState>("All source states");
  const [selectedSlug, setSelectedSlug] = useState(records[0]?.slug ?? "");

  const publishers = useMemo(
    () => ["All publishers", ...Array.from(new Set(records.map((record) => normalize(record.publisher)).filter(Boolean))).sort()],
    [records],
  );

  const recordTypes = useMemo(
    () => ["All record types", ...Array.from(new Set(records.map((record) => normalize(record.recordType)).filter(Boolean))).sort()],
    [records],
  );

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return records.filter((record) => {
      const publisherMatch = publisher === "All publishers" || normalize(record.publisher) === publisher;
      const typeMatch = recordType === "All record types" || normalize(record.recordType) === recordType;
      const stateMatch = state === "All source states" || sourceState(record) === state;
      const searchable = recordSearchText(record);
      const queryMatch = terms.length === 0 || terms.every((term) => searchable.includes(term));
      return publisherMatch && typeMatch && stateMatch && queryMatch;
    });
  }, [publisher, query, recordType, records, state]);

  const selected = records.find((record) => record.slug === selectedSlug) ?? filtered[0] ?? records[0];

  const metrics = useMemo(() => {
    const official = records.filter((record) => sourceState(record) === "Official").length;
    const supporting = records.filter((record) => sourceState(record) === "Supporting").length;
    const unresolved = records.filter((record) => sourceState(record) === "Unresolved").length;
    return {
      total: records.length,
      official,
      supporting,
      unresolved,
      publishers: new Set(records.map((record) => normalize(record.publisher)).filter(Boolean)).size,
      types: new Set(records.map((record) => normalize(record.recordType)).filter(Boolean)).size,
    };
  }, [records]);

  function resetFilters() {
    setQuery("");
    setPublisher("All publishers");
    setRecordType("All record types");
    setState("All source states");
  }

  return (
    <main className="sourcePage">
      <div className="background" aria-hidden="true">
        <div className="grid" />
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="route routeOne" />
        <div className="route routeTwo" />
      </div>

      <div className="pageShell">
        <header className="topbar">
          <Link href="/governance-library" className="topLink">← Governance Library</Link>
          <div className="topStatus"><span /> Institutional source resolution</div>
          <Link href="/governance-library/authorities" className="topAction">Resolve Authority →</Link>
        </header>

        <section className="hero">
          <div className="heroSeal"><span>SRC</span><small>TA-14</small></div>
          <p className="eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
          <h1>Official Source <em>Index</em></h1>
          <p className="lead">
            Locate the originating law, regulation, standard, code, framework, guidance document, method, or institutional record before relying on a governance claim. This index preserves source identity, publisher, record type, status, and the boundary between publication and execution authority.
          </p>
          <div className="heroActions">
            <Link href="#source-workspace" className="button primary">Open Source Workspace ↓</Link>
            <Link href="/governance-library/status" className="button secondary">Resolve Status →</Link>
            <Link href="/governance-library/applicability" className="button secondary">Determine Applicability →</Link>
          </div>
          <div className="metricGrid">
            <article><strong>{metrics.total}</strong><span>Governance records</span></article>
            <article><strong>{metrics.official}</strong><span>Official sources</span></article>
            <article><strong>{metrics.supporting}</strong><span>Supporting sources</span></article>
            <article><strong>{metrics.unresolved}</strong><span>Source gaps</span></article>
            <article><strong>{metrics.publishers}</strong><span>Publishers</span></article>
            <article><strong>{metrics.types}</strong><span>Record types</span></article>
          </div>
        </section>

        <section className="principlesSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">SOURCE DISCIPLINE</p>
              <h2>The source must be preserved before the claim can be trusted.</h2>
            </div>
            <p>TA-14 separates source authenticity, legal or technical authority, applicability, evidence sufficiency, and execution permission. A real source can still be irrelevant, superseded, non-binding, or outside scope.</p>
          </div>
          <div className="principlesGrid">
            {sourcePrinciples.map((item) => (
              <article key={item.code}>
                <span>{item.code}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="workspaceSection" id="source-workspace">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">OFFICIAL SOURCE CONTROL DESK</p>
              <h2>Find the record. Inspect the publisher. Preserve the boundary.</h2>
            </div>
            <p>Use the filters to locate governance records, then inspect whether the source is official, supporting, unresolved, current, applicable, and sufficient for the proposition being asserted.</p>
          </div>

          <div className="filterPanel">
            <label className="searchField">Search records
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Clean Air Act, EPA, ASHRAE, ISO, EU AI Act..." />
            </label>
            <label>Publisher
              <select value={publisher} onChange={(event) => setPublisher(event.target.value)}>
                {publishers.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>Record type
              <select value={recordType} onChange={(event) => setRecordType(event.target.value)}>
                {recordTypes.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>Source state
              <select value={state} onChange={(event) => setState(event.target.value as "All source states" | SourceState)}>
                {(["All source states", "Official", "Supporting", "Unresolved"] as const).map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <button type="button" onClick={resetFilters} className="clearButton">Clear filters</button>
          </div>

          <div className="workspaceGrid">
            <aside className="sourceIndex">
              <div className="indexHeading">
                <div><span>Source index</span><strong>{filtered.length} records</strong></div>
                <small>Select a record to inspect source identity, publisher, status, type, and execution boundary.</small>
              </div>
              <div className="sourceList">
                {filtered.map((record, index) => {
                  const currentState = sourceState(record);
                  return (
                    <button
                      type="button"
                      key={record.slug}
                      className={selected?.slug === record.slug ? "sourceButton active" : "sourceButton"}
                      onClick={() => setSelectedSlug(record.slug)}
                    >
                      <span className="sourceNumber">{String(index + 1).padStart(2, "0")}</span>
                      <span className="sourceIdentity">
                        <small>{normalize(record.recordType) || "Governance record"}</small>
                        <strong>{record.title}</strong>
                        <em>{normalize(record.publisher) || "Publisher unresolved"}</em>
                      </span>
                      <span className={`stateDot ${sourceClass(currentState)}`} title={currentState} />
                    </button>
                  );
                })}
                {filtered.length === 0 ? (
                  <div className="emptyState"><span>00</span><strong>No source matched.</strong><p>Broaden the search or clear the filters.</p></div>
                ) : null}
              </div>
            </aside>

            {selected ? (
              <section className="sourceRecord">
                <div className="recordHeader">
                  <div className="recordIdentity">
                    <div className="recordSeal">{normalize(selected.recordType).slice(0, 3).toUpperCase() || "SRC"}</div>
                    <div>
                      <p>{normalize(selected.publisher) || "Publisher unresolved"}</p>
                      <h3>{selected.title}</h3>
                      <span>{selected.summary}</span>
                    </div>
                  </div>
                  <span className={`stateBadge ${sourceClass(sourceState(selected))}`}>{sourceState(selected)}</span>
                </div>

                <div className="authorityStrip">
                  <article><span>Publisher</span><strong>{normalize(selected.publisher) || "Unresolved"}</strong></article>
                  <article><span>Record type</span><strong>{normalize(selected.recordType) || "Unresolved"}</strong></article>
                  <article><span>Jurisdiction</span><strong>{normalize(selected.jurisdiction) || "Review required"}</strong></article>
                  <article><span>Year or edition</span><strong>{normalize(selected.year) || "Verify official record"}</strong></article>
                  <article><span>Status</span><strong>{normalize(selected.status) || "Status review required"}</strong></article>
                  <article><span>Source state</span><strong>{sourceState(selected)}</strong></article>
                </div>

                <article className="sourceSummary">
                  <span>Governed source summary</span>
                  <strong>{selected.title}</strong>
                  <p>{selected.summary || "No summary is preserved for this record."}</p>
                </article>

                <div className="recordColumns">
                  <article className="recordCard">
                    <div className="cardHeading"><span>Source resolution questions</span><strong>08</strong></div>
                    <ol>
                      <li>Is this the issuing authority or an authorized official publisher?</li>
                      <li>What edition, amendment, revision, or effective date is controlling?</li>
                      <li>Has the instrument been adopted, incorporated, enacted, or contractually required?</li>
                      <li>Which jurisdiction, sector, subject, activity, and role fall within scope?</li>
                      <li>Is the record current, superseded, proposed, guidance, or unresolved?</li>
                      <li>What proposition does the source actually support?</li>
                      <li>What evidence remains necessary beyond the source text?</li>
                      <li>What authority must still bind before execution or reliance?</li>
                    </ol>
                  </article>

                  <article className="recordCard">
                    <div className="cardHeading"><span>TA-14 source boundary</span><strong>T14</strong></div>
                    <p className="boundaryText">
                      An official source can establish authorship, publication, text, version, or institutional position. It does not automatically establish applicability, compliance, certification, admissibility, or permission to execute a consequential action.
                    </p>
                    <div className="boundaryTags">
                      <span>Source identity</span><span>Version</span><span>Authority</span><span>Scope</span><span>Evidence</span><span>Execution</span>
                    </div>
                  </article>
                </div>

                <article className="sourceAccessCard">
                  <div>
                    <span>Source access</span>
                    <strong>{sourceFor(selected) ? "A source link is preserved for this record." : "No source link is currently preserved."}</strong>
                    <p>External source availability, licensing, access restrictions, and later amendments remain controlled by the originating publisher.</p>
                  </div>
                  <div className="recordActions">
                    <Link href={`/governance-library/${selected.slug}`} className="button secondary">Open Governance Record</Link>
                    {sourceFor(selected) ? <a href={sourceFor(selected)} target="_blank" rel="noreferrer" className="button gold">Open Source ↗</a> : <Link href="/governance-library/authorities" className="button gold">Resolve Source Authority →</Link>}
                  </div>
                </article>
              </section>
            ) : null}
          </div>
        </section>

        <section className="resolutionSection">
          <div className="sectionHeading centered">
            <div>
              <p className="eyebrow">SOURCE RESOLUTION SEQUENCE</p>
              <h2>Publication is the beginning of source governance, not the end.</h2>
            </div>
            <p>Each source must be traced from publisher through version, authority, applicability, evidence, and governed reliance.</p>
          </div>
          <div className="resolutionRoute">
            {[
              ["01", "Identify", "Preserve title, publisher, URL, identifier, and source class."],
              ["02", "Authenticate", "Confirm the source is official, authorized, or clearly labeled as supporting."],
              ["03", "Version", "Resolve edition, amendment, effective date, adoption, and supersession."],
              ["04", "Classify", "Distinguish law, regulation, standard, code, guidance, framework, method, or proposal."],
              ["05", "Locate", "Resolve jurisdiction, sector, role, activity, system, and territorial scope."],
              ["06", "Apply", "Determine whether the source governs, informs, supports, or remains outside scope."],
              ["07", "Evidence", "Preserve the evidence required to support the bounded proposition."],
              ["08", "Bind", "Join source, authority, evidence, determination, execution, and outcome."],
            ].map(([code, title, text]) => (
              <article key={code}><span>{code}</span><strong>{title}</strong><p>{text}</p></article>
            ))}
          </div>
        </section>

        <section className="failureSection">
          <div className="sectionHeading">
            <div><p className="eyebrow">SOURCE FAILURE MODES</p><h2>A real citation can still support an invalid conclusion.</h2></div>
            <p>The source layer must preserve both what is known and what remains unresolved. These failure modes should produce HOLD, DENY, or ESCALATE rather than silent assumption.</p>
          </div>
          <div className="failureGrid">
            {sourceFailureModes.map(([title, text], index) => (
              <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{text}</p></article>
            ))}
          </div>
        </section>

        <section className="academySection">
          <div className="academyVisual" aria-hidden="true">
            <div className="academySeal"><small>TA-14</small><strong>ACADEMY</strong><span>SOURCE & AUTHORITY LITERACY</span></div>
            <i className="orbit orbitA" /><i className="orbit orbitB" /><i className="orbit orbitC" />
          </div>
          <div className="academyCopy">
            <p className="eyebrow">TA-14 SOURCE LITERACY ACADEMY</p>
            <h2>Teach people to distinguish an official source from applicable authority.</h2>
            <p>The Academy pathway explains source classes, publishers, official editions, incorporation by reference, treaty implementation, guidance, model codes, proposed instruments, version drift, source licensing, and the point at which a citation becomes admissible support for a bounded claim.</p>
            <div className="academyGrid">
              {[
                ["SRC", "Source identity", "Publisher, title, URL, identifier, authenticity, and provenance."],
                ["VER", "Version literacy", "Edition, amendment, effective date, adoption, and supersession."],
                ["AUT", "Authority literacy", "Legislative, regulatory, contractual, technical, and institutional authority."],
                ["APP", "Applicability", "Jurisdiction, scope, role, activity, sector, and exclusions."],
                ["EVD", "Evidence boundary", "What the source proves, what it supports, and what remains unresolved."],
                ["EXE", "Execution boundary", "Why citation does not by itself authorize consequential execution."],
              ].map(([code, title, text]) => (
                <article key={code}><span>{code}</span><div><strong>{title}</strong><p>{text}</p></div></article>
              ))}
            </div>
            <div className="heroActions leftActions">
              <Link href="/academy" className="button academyButton">Enter TA-14 Academy →</Link>
              <Link href="/governance-library/authorities" className="button secondary">Open Authorities →</Link>
              <Link href="/governance-library/applicability" className="button secondary">Open Applicability →</Link>
            </div>
          </div>
        </section>

        <section className="closingSection">
          <p className="eyebrow">TA-14 OFFICIAL SOURCE INDEX</p>
          <h2>Preserve the source. Resolve the authority. Bound the claim.</h2>
          <p>No citation should silently become applicability, compliance, certification, or permission to execute.</p>
          <div className="heroActions">
            <Link href="/governance-library" className="button secondary">Return to Governance Library</Link>
            <Link href="/governance-library/status" className="button secondary">Resolve Status</Link>
            <Link href="/governance-library/applicability" className="button primary">Determine Applicability →</Link>
          </div>
          <strong className="finalRule">No authenticated source. No admissible reliance.</strong>
        </section>

        <footer><span>TA-14 Authority Governance Institution</span><span>Official Source Index · TA14Authority.org</span></footer>
      </div>

      <style jsx>{`
        :global(*){box-sizing:border-box}
        :global(html){scroll-behavior:smooth;background:#020812}
        :global(body){margin:0;background:#020812;color:#f5fbff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        :global(a){color:inherit}
        .sourcePage{min-height:100vh;position:relative;overflow:hidden;isolation:isolate;background:linear-gradient(180deg,rgba(2,9,18,.76),rgba(2,7,13,.98))}
        .background{position:fixed;inset:0;z-index:-3;pointer-events:none;overflow:hidden;background:radial-gradient(circle at 50% -10%,rgba(40,137,212,.18),transparent 34%),linear-gradient(180deg,#020914,#06111d 46%,#02070d)}
        .grid{position:absolute;inset:0;opacity:.12;background-image:linear-gradient(rgba(105,216,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(105,216,255,.35) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,black,transparent 88%)}
        .glow{position:absolute;width:720px;height:720px;border-radius:50%;filter:blur(110px);opacity:.13}.glowOne{left:-260px;top:20%;background:#1175d0}.glowTwo{right:-280px;top:55%;background:#d39d33}
        .route{position:absolute;width:70vw;height:1px;background:linear-gradient(90deg,transparent,rgba(100,220,255,.65),rgba(255,198,80,.5),transparent);filter:drop-shadow(0 0 8px rgba(75,190,230,.5))}.route::after{content:"";position:absolute;top:-3px;left:0;width:7px;height:7px;border-radius:50%;background:#fff0a8;box-shadow:0 0 16px #ffd76b;animation:packet 8s linear infinite}.routeOne{top:23%;left:-10%;transform:rotate(-7deg)}.routeTwo{top:71%;right:-12%;transform:rotate(8deg)}
        .pageShell{width:min(1500px,calc(100% - 40px));margin:auto;padding:22px 0 80px;position:relative;z-index:2}
        .topbar{min-height:68px;padding:11px 12px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:14px;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:linear-gradient(180deg,rgba(8,28,45,.9),rgba(4,15,26,.82));box-shadow:0 16px 50px rgba(0,0,0,.28);backdrop-filter:blur(16px)}
        .topLink,.topAction,.button{min-height:46px;padding:0 16px;display:inline-flex;align-items:center;justify-content:center;gap:10px;border-radius:11px;text-decoration:none;font-size:10px;font-weight:950;letter-spacing:.05em;text-transform:uppercase;transition:.22s}.topLink{justify-self:start;color:#c5d5df;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.18)}.topAction{justify-self:end;color:#051924;border:1px solid #b7f4ff;background:linear-gradient(135deg,#ddfbff,#73deef 64%,#35aac6)}.topStatus{display:flex;align-items:center;gap:9px;color:#8fa8b5;font-size:9px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.topStatus span{width:7px;height:7px;border-radius:50%;background:#74e4b1;box-shadow:0 0 14px #74e4b1}.topLink:hover,.topAction:hover,.button:hover{transform:translateY(-3px)}
        .hero{max-width:1200px;margin:auto;padding:88px 0 76px;text-align:center}.heroSeal{width:112px;height:112px;margin:0 auto 25px;display:grid;place-items:center;align-content:center;border:1px solid rgba(255,199,87,.4);border-radius:50%;background:radial-gradient(circle,rgba(255,196,74,.14),rgba(5,22,37,.96) 70%);box-shadow:0 0 60px rgba(255,194,68,.11)}.heroSeal span{color:#ffe3a1;font:900 29px Georgia,serif}.heroSeal small{color:#7893a0;font-size:8px;font-weight:950;letter-spacing:.17em}.eyebrow{margin:0;color:#6fe3f4;font-size:10px;font-weight:950;letter-spacing:.22em;text-transform:uppercase}.hero h1,.sectionHeading h2,.academyCopy h2,.closingSection h2{margin:14px 0 20px;font-family:Georgia,"Times New Roman",serif;font-size:clamp(48px,6vw,88px);line-height:.96;letter-spacing:-.055em}.hero h1 em{display:block;color:#f0c66b;font-weight:500}.lead{max-width:980px;margin:0 auto;color:#afc1cb;font-size:18px;line-height:1.75}.heroActions{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:29px}.leftActions{justify-content:flex-start}.button.primary{color:#041a23;border:1px solid #b7f4ff;background:linear-gradient(135deg,#dcfbff,#70deef 64%,#36acc8)}.button.secondary{color:#dcebf1;border:1px solid rgba(255,255,255,.11);background:rgba(5,23,36,.88)}.button.gold{color:#241700;border:1px solid #f2d27d;background:linear-gradient(135deg,#fff0b0,#ebba4b 65%,#9f6410)}.button.academyButton{color:#04160f;border:1px solid #a5f3c7;background:linear-gradient(135deg,#d7ffe6,#66e7a1 64%,#299d68)}
        .metricGrid{margin-top:38px;display:grid;grid-template-columns:repeat(6,1fr);gap:10px}.metricGrid article{padding:18px;border:1px solid rgba(255,255,255,.07);border-radius:15px;background:rgba(6,21,34,.65)}.metricGrid strong{display:block;color:#f0cf88;font:700 28px Georgia,serif}.metricGrid span{display:block;margin-top:5px;color:#778f9a;font-size:8px;font-weight:950;letter-spacing:.08em;text-transform:uppercase}
        .principlesSection,.workspaceSection,.resolutionSection,.failureSection,.academySection,.closingSection{padding:82px 0}.sectionHeading{margin-bottom:30px;display:grid;grid-template-columns:1.15fr .85fr;gap:42px;align-items:end}.sectionHeading.centered{text-align:center;grid-template-columns:1fr;max-width:1050px;margin:0 auto 34px}.sectionHeading h2,.academyCopy h2,.closingSection h2{font-size:clamp(38px,4.6vw,68px)}.sectionHeading>p,.sectionHeading>div+p,.academyCopy>p,.closingSection>p{margin:0;color:#9fb3bc;font-size:15px;line-height:1.75}.principlesGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.principlesGrid article{min-height:220px;padding:22px;border:1px solid rgba(102,221,245,.12);border-radius:17px;background:linear-gradient(145deg,rgba(9,31,47,.82),rgba(3,15,25,.92))}.principlesGrid span{width:38px;height:38px;display:grid;place-items:center;border:1px solid rgba(255,200,83,.22);border-radius:50%;color:#f0c873;font-size:8px}.principlesGrid strong{display:block;margin-top:23px;font-family:Georgia,serif;font-size:20px}.principlesGrid p{margin:10px 0 0;color:#879da7;font-size:11px;line-height:1.65}
        .filterPanel{padding:18px;display:grid;grid-template-columns:minmax(0,1.2fr) 210px 210px 190px auto;gap:11px;align-items:end;border:1px solid rgba(102,221,245,.13);border-radius:20px;background:linear-gradient(145deg,rgba(8,29,44,.94),rgba(3,13,22,.98))}label{display:grid;gap:8px;color:#7e9daa;font-size:8px;font-weight:950;letter-spacing:.09em;text-transform:uppercase}input,select{width:100%;min-height:47px;padding:0 13px;border:1px solid rgba(255,255,255,.1);border-radius:10px;outline:none;color:#eaf4f7;background:rgba(0,0,0,.2);font:inherit;text-transform:none}select option{background:#071621}.clearButton{min-height:47px;padding:0 15px;border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#b7c8d0;background:rgba(0,0,0,.18);cursor:pointer;font-size:8px;font-weight:950;text-transform:uppercase}
        .workspaceGrid{margin-top:16px;display:grid;grid-template-columns:390px minmax(0,1fr);gap:16px;align-items:start}.sourceIndex,.sourceRecord{border:1px solid rgba(102,221,245,.13);border-radius:23px;background:linear-gradient(145deg,rgba(8,29,44,.95),rgba(3,13,22,.99))}.sourceIndex{position:sticky;top:18px;padding:17px;max-height:82vh;overflow:auto}.indexHeading{padding:3px 2px 15px;border-bottom:1px solid rgba(255,255,255,.06)}.indexHeading div{display:flex;align-items:center;justify-content:space-between;gap:10px}.indexHeading span{color:#6edcec;font-size:8px;font-weight:950;text-transform:uppercase}.indexHeading strong{color:#efca7d;font:700 16px Georgia,serif}.indexHeading small{display:block;margin-top:8px;color:#708893;font-size:9px;line-height:1.5}.sourceList{margin-top:13px;display:grid;gap:8px}.sourceButton{width:100%;padding:12px;display:grid;grid-template-columns:40px minmax(0,1fr) 9px;gap:10px;align-items:center;border:1px solid rgba(255,255,255,.06);border-radius:12px;color:inherit;background:rgba(0,0,0,.14);cursor:pointer;text-align:left}.sourceButton:hover,.sourceButton.active{border-color:rgba(101,224,245,.3);background:rgba(101,224,245,.055)}.sourceNumber{width:40px;height:40px;display:grid;place-items:center;border:1px solid rgba(101,224,245,.15);border-radius:9px;color:#69d9e9;font-size:8px}.sourceIdentity{min-width:0;display:grid;gap:4px}.sourceIdentity small{color:#708995;font-size:7px;font-weight:950;text-transform:uppercase}.sourceIdentity strong{overflow:hidden;color:#dce8ec;font-size:10px;text-overflow:ellipsis;white-space:nowrap}.sourceIdentity em{overflow:hidden;color:#6d838e;font-size:8px;font-style:normal;text-overflow:ellipsis;white-space:nowrap}.stateDot{width:8px;height:8px;border-radius:50%;background:#65737a}.stateDot.official{background:#72e6b2}.stateDot.supporting{background:#75d9ef}.stateDot.unresolved{background:#efc66b}.emptyState{padding:34px 15px;text-align:center}.emptyState span{color:#efca7d;font:700 30px Georgia,serif}.emptyState strong{display:block;margin-top:10px}.emptyState p{color:#7c909a;font-size:10px}
        .sourceRecord{padding:25px}.recordHeader{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.recordIdentity{display:flex;align-items:center;gap:16px}.recordSeal{width:72px;height:72px;flex:0 0 72px;display:grid;place-items:center;border:1px solid rgba(255,199,86,.28);border-radius:50%;color:#efc979;font:700 17px Georgia,serif}.recordIdentity p{margin:0;color:#68dbea;font-size:8px;font-weight:950;text-transform:uppercase}.recordIdentity h3{margin:6px 0 0;font-family:Georgia,serif;font-size:clamp(28px,3vw,43px)}.recordIdentity span{display:block;max-width:850px;margin-top:8px;color:#859aa4;font-size:11px;line-height:1.55}.stateBadge{padding:9px 12px;border:1px solid rgba(255,255,255,.1);border-radius:999px;color:#a3b5bd;font-size:8px;font-weight:950;text-transform:uppercase}.stateBadge.official{color:#8ff1c0;border-color:rgba(114,230,178,.3)}.stateBadge.supporting{color:#8be8fa;border-color:rgba(117,217,239,.3)}.stateBadge.unresolved{color:#f2cf7a;border-color:rgba(239,198,107,.3)}
        .authorityStrip{margin-top:22px;display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.authorityStrip article,.sourceSummary,.recordCard,.sourceAccessCard{padding:17px;border:1px solid rgba(255,255,255,.07);border-radius:15px;background:rgba(0,0,0,.14)}.authorityStrip span,.sourceSummary>span,.cardHeading span,.sourceAccessCard span{color:#6edcec;font-size:7px;font-weight:950;text-transform:uppercase}.authorityStrip strong{display:block;margin-top:7px;font-size:10px}.sourceSummary{margin-top:13px}.sourceSummary>strong{display:block;margin-top:9px;font:700 18px Georgia,serif}.sourceSummary p{margin:10px 0 0;color:#9cafb8;font-size:12px;line-height:1.68}.recordColumns{margin-top:13px;display:grid;grid-template-columns:1fr 1fr;gap:12px}.cardHeading{padding-bottom:12px;display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06)}.cardHeading strong{color:#efca7d;font:700 17px Georgia,serif}.recordCard ol{margin:14px 0 0;padding-left:18px}.recordCard li{margin:9px 0;color:#9cafb8;font-size:10px;line-height:1.5}.boundaryText{margin:14px 0 0;color:#c8d7dc;font-family:Georgia,serif;font-size:17px;line-height:1.55}.boundaryTags{display:flex;flex-wrap:wrap;gap:7px;margin-top:16px}.boundaryTags span{padding:7px 9px;border:1px solid rgba(255,199,86,.15);border-radius:999px;color:#d8b769;font-size:7px;font-weight:950;text-transform:uppercase}.sourceAccessCard{margin-top:13px;display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center}.sourceAccessCard strong{display:block;margin-top:8px;font-family:Georgia,serif;font-size:18px}.sourceAccessCard p{margin:7px 0 0;color:#8197a1;font-size:10px;line-height:1.5}.recordActions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px}
        .resolutionRoute{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.resolutionRoute article{min-height:190px;padding:19px;border:1px solid rgba(102,221,245,.11);border-radius:16px;background:rgba(8,28,42,.72)}.resolutionRoute span{width:37px;height:37px;display:grid;place-items:center;border:1px solid rgba(255,199,84,.2);border-radius:50%;color:#efc76f;font-size:8px}.resolutionRoute strong{display:block;margin-top:22px;font-family:Georgia,serif;font-size:19px}.resolutionRoute p{margin:10px 0 0;color:#8197a1;font-size:10px;line-height:1.58}
        .failureGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.failureGrid article{min-height:200px;padding:20px;border:1px solid rgba(255,126,126,.11);border-radius:16px;background:linear-gradient(145deg,rgba(44,18,25,.45),rgba(6,18,28,.88))}.failureGrid span{color:#ef9caa;font-size:8px;font-weight:950}.failureGrid strong{display:block;margin-top:28px;font-family:Georgia,serif;font-size:18px}.failureGrid p{margin:10px 0 0;color:#8f9faa;font-size:10px;line-height:1.6}
        .academySection{display:grid;grid-template-columns:.8fr 1.2fr;gap:52px;align-items:center;border-top:1px solid rgba(102,221,245,.13);border-bottom:1px solid rgba(102,221,245,.13)}.academyVisual{height:500px;position:relative;display:grid;place-items:center}.academySeal{width:245px;height:245px;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid #64efb3;border-radius:50%;background:radial-gradient(circle,rgba(98,240,180,.16),rgba(3,26,28,.96));box-shadow:0 0 70px rgba(75,232,172,.18)}.academySeal small{color:#75bca5;font-weight:950;letter-spacing:.16em}.academySeal strong{font-family:Georgia,serif;font-size:40px;color:#baffda}.academySeal span{margin-top:8px;color:#68d8b0;font-size:8px;font-weight:950;letter-spacing:.12em}.orbit{position:absolute;border:1px solid rgba(98,240,180,.27);border-radius:50%;animation:orbitSpin 24s linear infinite}.orbitA{width:330px;height:440px}.orbitB{width:450px;height:270px;transform:rotate(34deg);animation-direction:reverse}.orbitC{width:490px;height:490px;border-color:rgba(255,199,84,.14);animation-duration:36s}.academyGrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:23px}.academyGrid article{padding:14px;display:grid;grid-template-columns:48px 1fr;gap:11px;align-items:center;border:1px solid rgba(100,230,190,.14);border-radius:12px;background:rgba(255,255,255,.025)}.academyGrid article>span{width:46px;height:46px;display:grid;place-items:center;border:1px solid #62efb5;border-radius:10px;color:#83f3c1;font-size:9px;font-weight:950}.academyGrid strong{font-size:11px}.academyGrid p{margin:5px 0 0;color:#7d9895;font-size:9px;line-height:1.4}
        .closingSection{text-align:center}.closingSection>p{max-width:850px;margin-inline:auto}.finalRule{display:block;margin-top:25px;color:#ffe39a;font-family:Georgia,serif;font-size:21px}footer{min-height:80px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-top:1px solid rgba(102,221,245,.13);color:#607985;font-size:9px;font-weight:900;letter-spacing:.08em}
        @keyframes packet{from{left:0}to{left:100%}}@keyframes orbitSpin{to{transform:rotate(360deg)}}
        @media(max-width:1100px){.metricGrid{grid-template-columns:repeat(3,1fr)}.filterPanel{grid-template-columns:1fr 1fr}.clearButton{grid-column:span 2}.workspaceGrid{grid-template-columns:1fr}.sourceIndex{position:static;max-height:none}.principlesGrid,.failureGrid{grid-template-columns:1fr 1fr}.academySection{grid-template-columns:1fr}.academyVisual{height:420px}.sectionHeading{grid-template-columns:1fr}.sourceAccessCard{grid-template-columns:1fr}.recordActions{justify-content:flex-start}}
        @media(max-width:760px){.pageShell{width:calc(100% - 22px)}.topbar{grid-template-columns:1fr 1fr}.topStatus{display:none}.hero{padding:65px 0}.hero h1{font-size:50px}.lead{font-size:15px}.metricGrid,.principlesGrid,.failureGrid,.resolutionRoute,.authorityStrip,.recordColumns,.academyGrid{grid-template-columns:1fr}.filterPanel{grid-template-columns:1fr}.clearButton{grid-column:auto}.recordHeader,.recordIdentity{flex-direction:column}.recordIdentity{align-items:flex-start}.heroActions .button,.recordActions .button{width:100%}.academyVisual{height:340px;transform:scale(.78);margin:-35px 0}footer{flex-direction:column;justify-content:center;text-align:center}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
      `}</style>
    </main>
  );
}
