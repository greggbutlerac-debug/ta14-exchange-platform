import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TA-14 Institutional Constitution | TA-14 Authority",
  description:
    "The constitutional baseline governing TA-14 Authority, its institutional powers, evidence discipline, review authority, appeals, records, continuity, succession, and amendment.",
};

const articles = [
  {
    id: "foundational-architecture",
    numeral: "I",
    title: "Foundational Architecture",
    body: [
      "The constitutional parent architecture of TA-14 Authority is the TA-14 Admissible Execution Architecture.",
      "Institutional consequence shall remain traceable through Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome, together with any additional canonical TA-14 links required by the applicable review.",
      "TA-14 applies this discipline to its own registrations, evidence decisions, reviews, determinations, publication, standards, authority, corrections, appeals, continuity, succession, and constitutional change.",
    ],
  },
  {
    id: "powers-limits",
    numeral: "II",
    title: "Institutional Powers and Limits",
    body: [
      "TA-14 Authority may operate governed registration, evidence intake, bounded architecture review, determinations, publication, verification, lineage, challenge, correction, appeal, standards governance, reviewer qualification, institutional audit, Academy assessment, simulation, and research pathways.",
      "Findings remain bounded to the identified governance, version, claims, admitted evidence, conditions, scope, governing standards, verification level, and temporal state represented by the evidence.",
      "Registration is not endorsement. Review is not universal certification. Technical capability, administrative privilege, infrastructure control, or software permission does not itself create institutional legitimacy.",
    ],
  },
  {
    id: "participant-rights",
    numeral: "III",
    title: "Participant Rights and Responsibilities",
    body: [
      "Participants have the right to know the review scope, version, claims, non-claims, applicable procedure, evidence requests, confidentiality boundary, bounded findings, correction route, challenge route, and appeal route where applicable.",
      "Participants are responsible for truthful evidence identification, source attribution, version disclosure, separation of evidence from assertion, confidentiality compliance, and accurate representation of TA-14 findings.",
      "Participant statements and TA-14 findings remain separate voices. Neither may silently rewrite the other’s historical record.",
    ],
  },
  {
    id: "evidence-governance",
    numeral: "IV",
    title: "Evidence Governance",
    body: [
      "Material evidence used for consequential review shall be attributable, versioned, provenance-aware, authority-aware, and assigned an explicit evidentiary state.",
      "Evidence does not acquire institutional weight merely through submission. Reliance requires admission under the applicable procedure.",
      "A consequential determination shall bind to a preserved evidence package or freeze. New evidence does not mutate a historical freeze; it requires reopening, admission, a new freeze, and preserved lineage.",
    ],
  },
  {
    id: "review-determination",
    numeral: "V",
    title: "Review and Determination",
    body: [
      "Governed review may proceed through Intake → Triage → Scope Lock → Evidence Admission → Package Freeze → Review → Determination → Quality Control → Publication Decision → Publication → Follow-Up → Closure.",
      "Material findings should resolve claim, evidence, evidence state, governing TA-14 element, analysis, limitation, and finding.",
      "Determination classes may include SUPPORTED, PARTIALLY SUPPORTED, HOLD, DENY, ESCALATE, and OUTSIDE SCOPE. Execution-governance artifacts may use ALLOW, HOLD, DENY, and ESCALATE where appropriate.",
    ],
  },
  {
    id: "institutional-authority",
    numeral: "VI",
    title: "Institutional Authority",
    body: [
      "TA-14 may maintain distinct intake, scope, evidence admission, review, determination, escalation, quality control, publication, correction, appeal, standards, registry, oversight, recovery, and constitutional authority classes.",
      "Qualification establishes demonstrated competence. Authority establishes current institutional permission to exercise that competence. They are not equivalent.",
      "No institutional consequence may bind when the actor’s legitimate authority path cannot be resolved.",
    ],
  },
  {
    id: "challenge-correction-appeal",
    numeral: "VII",
    title: "Challenge, Correction and Appeal",
    body: [
      "Eligible participants and qualified third parties may use defined factual correction, evidence challenge, interpretation challenge, changed-condition notice, and formal appeal routes.",
      "The constitutional rule is: correct the record without erasing the record.",
      "Authorized appeal outcomes may include AFFIRM, MODIFY, REVERSE, REMAND, and OUTSIDE APPEAL SCOPE. TA-14’s own factual statements, evidence handling, findings, scope application, and procedural decisions remain challengeable under applicable procedure.",
    ],
  },
  {
    id: "standards-doctrine",
    numeral: "VIII",
    title: "Standards and Doctrine Governance",
    body: [
      "Operative TA-14 standards shall be attributable, versioned, dated, preserved, and changed through governed change control.",
      "A pending case shall not be resolved by retroactively rewriting the standard governing that case merely to obtain a preferred outcome.",
      "TA-14 shall preserve the distinction Doctrine → Standard → Procedure → System Control → Case Application. Software behavior shall not silently become doctrine.",
    ],
  },
  {
    id: "records-preservation",
    numeral: "IX",
    title: "Institutional Records and Preservation",
    body: [
      "Consequential institutional actions shall generate preserved records sufficient to establish actor, authority, object, prior state, new state, evidence dependency, time, version, and integrity reference.",
      "Completed cases should preserve scope, claims, non-claims, evidence manifest, freeze, authority, applicable standards, findings, determination, quality control, publication boundary, challenges, corrections, appeals, and chronology.",
      "Current application state may be optimized for operation, but historical institutional state shall not depend on silent mutation of current tables alone.",
    ],
  },
  {
    id: "security",
    numeral: "X",
    title: "Security and Trust Boundaries",
    body: [
      "Authentication establishes identity; it does not establish institutional authority.",
      "Consequential access shall resolve identity, active authority, scope, object, requested action, current state, and applicable conflict restrictions before institutional consequence binds.",
      "Technical administrators and service identities may possess technical capability without possessing institutional legitimacy to alter findings, determinations, standards, evidence freezes, or constitutional records.",
    ],
  },
  {
    id: "oversight",
    numeral: "XI",
    title: "Institutional Oversight",
    body: [
      "TA-14 shall remain capable of auditing review integrity, reviewer integrity, authority integrity, evidence integrity, publication integrity, challenge integrity, and systemic procedural drift.",
      "Oversight may generate institutional exceptions, corrective actions, calibration requirements, standards proposals, retraining requirements, or institutional HOLD.",
      "Oversight metrics shall be interpreted contextually and shall not create incentives to defend an incorrect determination merely to protect performance statistics.",
    ],
  },
  {
    id: "continuity",
    numeral: "XII",
    title: "Institutional Continuity",
    body: [
      "TA-14 may declare NORMAL, DEGRADED, RESTRICTED, INSTITUTIONAL HOLD, RECOVERY, REVALIDATION, and RESTORED continuity states.",
      "Restoring infrastructure is not equivalent to restoring institutional legitimacy. Recovery requires identification of the last trusted state, verification of preserved records, authority reconstruction, resolution of disputed intervals, and revalidation of affected consequences.",
      "Where institutional integrity cannot be established, affected consequential operations shall fail closed.",
    ],
  },
  {
    id: "succession",
    numeral: "XIII",
    title: "Constitutional Authority and Succession",
    body: [
      "Institutional legitimacy shall not automatically pass with possession of a domain, repository, database, credential, signing key, financial account, or administrative role.",
      "TA-14 may distinguish Founding Authority, Institutional Authority, Delegated Authority, Acting Authority, Emergency Authority, and Successor Authority, each with explicit source, scope, limitations, conditions, and effective state.",
      "Historical authorship and provenance shall not be rewritten by succession. A successor may receive institutional authority without becoming the historical originator.",
    ],
  },
  {
    id: "amendment",
    numeral: "XIV",
    title: "Amendment",
    body: [
      "Constitutional change requires an attributable amendment proposal, declared problem, rationale or evidence basis, affected provisions, institutional impact, required authority, approval record, effective date, version, and preserved supersession lineage.",
      "Emergency integrity measures may temporarily preserve the institution but shall not become a permanent constitutional shortcut without formal ratification.",
      "Immutable historical facts, including authorship and provenance, shall not be changed by constitutional amendment.",
    ],
  },
  {
    id: "supremacy",
    numeral: "XV",
    title: "Constitutional Supremacy and Conflict",
    body: [
      "This Constitution is the supreme institutional baseline for subordinate TA-14 standards, procedures, software controls, reviewer actions, administrative acts, and governed institutional execution.",
      "Where a subordinate procedure or technical control conflicts with the Constitution, technical execution does not by itself create legitimate institutional consequence.",
      "TA-14 Authority is itself subject to the admissibility discipline it applies to consequence-bearing execution. Authority must remain attributable, bounded, evidenced, continuous, reviewable, and preserved.",
    ],
  },
] as const;

export default function ConstitutionPage() {
  return (
    <main className="constitutionPage">
      <div className="stars" />
      <aside className="toc" aria-label="Constitution table of contents">
        <Link href="/workspace/mission-control" className="backLink">← Mission Control</Link>
        <div className="tocLabel">TA-14 CONSTITUTION</div>
        <div className="tocVersion">Version 1.0 · Active baseline</div>
        <nav>
          {articles.map((article) => (
            <a key={article.id} href={`#${article.id}`}>
              <span>{article.numeral}</span>{article.title}
            </a>
          ))}
        </nav>
      </aside>

      <article className="document">
        <header className="hero">
          <div className="seal">TA-14</div>
          <p className="eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
          <h1>Institutional Constitution</h1>
          <p className="lead">The governing constitutional baseline for TA-14 Authority and its consequence-bearing institutional actions.</p>
          <div className="meta">
            <span><b>Version</b> 1.0</span>
            <span><b>Status</b> Active baseline</span>
            <span><b>Parent</b> TA-14 Admissible Execution Architecture</span>
            <span><b>Supersedes</b> None</span>
          </div>
          <blockquote>No admissible institutional state. No admissible institutional execution.</blockquote>
        </header>

        <section className="preamble">
          <p className="eyebrow">PREAMBLE</p>
          <h2>Governance must govern itself.</h2>
          <p>TA-14 Authority exists to govern consequence-bearing execution through attributable, bounded, evidence-supported, reviewable, and preserved institutional processes. TA-14 shall not demand from external systems a standard of governance that it is unwilling to apply to itself.</p>
          <p>Institutional legitimacy shall not arise merely from technical capability, administrative privilege, organizational position, infrastructure control, access credentials, or title. A legitimate TA-14 institutional consequence must arise through evidence, authority, scope, continuity, admissibility, binding, commitment, execution control, preservation, and accountable outcome.</p>
        </section>

        {articles.map((article) => (
          <section className="article" id={article.id} key={article.id}>
            <div className="articleNumber">ARTICLE {article.numeral}</div>
            <h2>{article.title}</h2>
            {article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}

        <footer>
          <div className="closingRule">TA-14 Authority is itself subject to TA-14.</div>
          <p>This public constitutional record is a governance instrument of TA-14 Authority. It does not by itself constitute legal, regulatory, or governmental certification.</p>
          <Link href="/workspace/mission-control" className="returnButton">Return to Mission Control →</Link>
        </footer>
      </article>

      <style>{`
        *{box-sizing:border-box}.constitutionPage{min-height:100vh;background:#020611;color:#eef6ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;position:relative}.stars{position:fixed;inset:0;pointer-events:none;background-image:radial-gradient(circle at 15% 20%,rgba(89,215,255,.12),transparent 22%),radial-gradient(circle at 83% 9%,rgba(242,200,101,.09),transparent 18%),linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:auto,auto,56px 56px,56px 56px}.toc{position:fixed;left:24px;top:24px;bottom:24px;width:272px;padding:22px;border:1px solid rgba(89,215,255,.2);border-radius:24px;background:rgba(5,13,29,.88);backdrop-filter:blur(18px);overflow:auto;z-index:2}.backLink{color:#8ce3ff;text-decoration:none;font-weight:800;font-size:13px}.tocLabel{margin-top:28px;color:#f2c865;font-size:11px;font-weight:900;letter-spacing:.16em}.tocVersion{margin:7px 0 18px;color:#8ea3ba;font-size:12px}.toc nav{display:grid;gap:4px}.toc nav a{display:flex;gap:10px;padding:9px 10px;border-radius:10px;color:#b9c9da;text-decoration:none;font-size:12px;line-height:1.35}.toc nav a:hover{background:rgba(89,215,255,.08);color:#fff}.toc nav span{min-width:20px;color:#59d7ff;font-weight:900}.document{position:relative;z-index:1;width:min(900px,calc(100% - 360px));margin-left:336px;padding:56px 0 100px}.hero,.preamble,.article,footer{border:1px solid rgba(132,164,202,.17);background:linear-gradient(145deg,rgba(8,19,39,.92),rgba(4,10,23,.88));border-radius:28px;padding:42px;margin-bottom:22px;box-shadow:0 24px 80px rgba(0,0,0,.24)}.seal{width:82px;height:82px;border:1px solid rgba(242,200,101,.5);border-radius:22px;display:grid;place-items:center;color:#f2c865;font-weight:1000;letter-spacing:.08em;margin-bottom:28px;background:radial-gradient(circle,rgba(242,200,101,.12),transparent 68%)}.eyebrow,.articleNumber{font-size:11px;font-weight:900;letter-spacing:.17em;color:#59d7ff}.hero h1{font-size:clamp(42px,7vw,78px);line-height:.96;margin:12px 0 22px;letter-spacing:-.055em}.lead{font-size:20px;line-height:1.7;color:#b9c9da;max-width:730px}.meta{display:flex;flex-wrap:wrap;gap:9px;margin-top:30px}.meta span{border:1px solid rgba(132,164,202,.18);border-radius:999px;padding:8px 12px;color:#9fb0c5;font-size:12px}.meta b{color:#fff;margin-right:5px}.hero blockquote{margin:32px 0 0;padding:22px 24px;border-left:3px solid #f2c865;background:rgba(242,200,101,.06);font-size:18px;color:#ffe7a6}.preamble h2,.article h2{font-size:34px;letter-spacing:-.03em;margin:10px 0 20px}.preamble p,.article p,footer p{color:#aebfd1;line-height:1.85;font-size:16px}.article{scroll-margin-top:24px}.articleNumber{color:#f2c865}.closingRule{font-size:28px;font-weight:900;letter-spacing:-.03em;margin-bottom:18px}.returnButton{display:inline-block;margin-top:18px;padding:13px 18px;border-radius:12px;background:#59d7ff;color:#02101b;font-weight:900;text-decoration:none}@media(max-width:980px){.toc{position:relative;left:auto;top:auto;bottom:auto;width:auto;margin:16px}.document{width:auto;margin:0;padding:8px 16px 72px}.toc nav{grid-template-columns:repeat(2,minmax(0,1fr))}.hero,.preamble,.article,footer{padding:28px}}@media(max-width:620px){.toc nav{grid-template-columns:1fr}.hero h1{font-size:44px}.hero,.preamble,.article,footer{border-radius:20px;padding:22px}.preamble h2,.article h2{font-size:28px}}
      `}</style>
    </main>
  );
}
