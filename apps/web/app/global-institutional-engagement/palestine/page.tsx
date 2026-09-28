import Link from 'next/link';

const questions = [
  ['01','PURPOSE · SCOPE · EXPECTED OUTCOME','Purpose: examine one bounded evidence-to-consequence pathway with EQA. Scope: begin with an existing air-quality record or assessment, identify the exact proposed consequence, then make the evidence, authority, standing, timing and outcome boundaries inspectable. Expected outcome: a technically correct, EQA-correctable comparison record showing where evidence ends and consequential authority begins. No adoption of TA-14 is required.'],
  ['02','POTENTIAL BENEFIT / ADDED VALUE TO EQA','TA-14 offers a traceable separation between measurement, evidence, authority and execution. For EQA, the proposed value is not another monitoring platform; it is an examination method for showing exactly what a technically valid record is sufficient to support, which authority applies to a proposed action, whether the actor has standing, whether the conditions remain current, and why a consequence proceeds, pauses, is denied or escalated.'],
  ['03','INSTITUTIONAL STATUS + MANDATE OF TA-14','TA-14 Authority is an independent governance institution and public architecture body. Its mandate is self-defined: research, publish, register, test and operate governance architectures concerned with evidence, authority, standing and consequence-bearing execution. TA-14 is not a Palestinian governmental body, regulator, standards authority or delegated agent of EQA, and it claims no Palestinian statutory or regulatory authority.'],
  ['04','INTENDED USE · PUBLICATION · DISSEMINATION','TA-14 proposes to use only public EQA information and information EQA expressly supplies for this dialogue. The purpose of publication is transparency, technical examination and correction—not attribution of endorsement. EQA may identify inaccuracies at any time; corrections should be reflected on this surface. Non-public material is not presumed publishable, and no EQA communication is treated as consent, adoption, partnership or approval unless separately established.'],
  ['05','AIR + AEA DOCUMENTATION + APPLICATION','AIR is the environmental record layer: it preserves time-bounded atmospheric reality with provenance, continuity and integrity boundaries. AEA is the consequence-governance layer: it tests whether the evidence, authority and standing required for a specific proposed consequence are sufficient now. Applied together, AIR can preserve what the atmosphere did while AEA governs whether that evidence is sufficient to support a particular action. Reference documentation is linked directly below.']
];

const chain=['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'];

export const metadata={
  title:'Palestine · EQA Air-Quality Evidence to Consequence | TA-14',
  description:'Public technical clarification surface responding to the Environment Quality Authority of Palestine regarding TA-14, AIR and Admissible Execution Architecture.'
};

export default function Page(){
  return <main className="p">
    <div className="shell">
      <nav>
        <Link className="brand" href="/"><b>TA-14</b> AUTHORITY</Link>
        <Link href="/global-institutional-engagement">GLOBAL INSTITUTIONAL ENGAGEMENT</Link>
        <Link href="/global-institutional-engagement/showrooms">COUNTRY SHOWROOMS</Link>
      </nav>

      <header>
        <div className="bilateral">
          <div><span className="flag">🇵🇸</span><b>STATE OF PALESTINE</b><small>ENVIRONMENT QUALITY AUTHORITY · AIR QUALITY AND OZONE DEPARTMENT</small></div>
          <i>×</i>
          <div className="right"><span className="flag">🇺🇸</span><b>TA-14 AUTHORITY</b><small>INDEPENDENT GOVERNANCE INSTITUTION · UNITED STATES</small></div>
        </div>
        <p className="eye">PALESTINE × TA-14 · PUBLIC TECHNICAL CLARIFICATION SURFACE · 28 SEPTEMBER 2026</p>
        <h1>Before dialogue continues,<br/><em>make the boundary explicit.</em></h1>
        <p className="lead">On 28 September 2026, Dr. Adnan Judeh, Director of the Air Quality and Ozone Department at Palestine's Environment Quality Authority, asked TA-14 to clarify the purpose, value, institutional status, publication rules and underlying AIR / AEA documentation before EQA decides whether further technical engagement is appropriate. This showroom answers those questions publicly and keeps the institutional boundary visible.</p>
        <div className="status"><b>SUBSTANTIVE EQA REPLY RECEIVED</b><b>CLARIFICATION REQUEST ACTIVE</b><b>NO ENDORSEMENT OR ADOPTION CLAIMED</b></div>
        <div className="rule"><small>TA-14 GOVERNING QUESTION</small><strong>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</strong></div>
      </header>

      <div className="chain">{chain.map(x=><span key={x}>{x}</span>)}</div>

      <section>
        <p className="eye">01 · WHAT EQA ASKED</p>
        <h2>Five questions. Five explicit answers.</h2>
        <div className="questions">{questions.map(([n,t,c])=><article key={n}><span>{n}</span><div><b>{t}</b><p>{c}</p></div></article>)}</div>
      </section>

      <section className="band">
        <p className="eye">02 · THE INSTITUTIONAL BOUNDARY</p>
        <h2>EQA remains the competent Palestinian authority.</h2>
        <p className="lead2">TA-14 does not replace Palestine's air-quality monitoring, environmental assessment, law, permitting, enforcement, public-health judgment or administrative decision-making. TA-14 examines a narrower question: what must be established before technically valid environmental information can support a specific consequential act now?</p>
        <div className="flow">
          <div><b>EQA NATIVE SYSTEM</b><p>measurement · assessment · legal framework · competent authority · environmental decision</p></div>
          <span>→</span>
          <div className="gate"><b>TA-14 EXAMINATION BOUNDARY</b><p>continuity · admissibility · binding · authority · standing · currentness · commit</p></div>
          <span>→</span>
          <div><b>CONSEQUENCE + OUTCOME</b><p>warning · restriction · permit action · intervention · enforcement · preserved result</p></div>
        </div>
      </section>

      <section>
        <p className="eye">03 · AIR · ATMOSPHERIC INTEGRITY RECORDS</p>
        <h2>AIR is a record architecture, not a sensor and not an authority.</h2>
        <p className="lead2"><b>Atmospheric Integrity Records (AIR)</b> are designed to preserve atmospheric conditions as a governed chronology rather than treating a dashboard, trend or isolated measurement as self-authenticating evidence. An AIR separates observation from interpretation and action, preserves when and where a condition was observed, keeps provenance and continuity inspectable, and can mark intervals invalid when required integrity conditions are not satisfied. AIR does not decide policy, diagnose health, create legal authority or command an intervention.</p>
        <div className="grid three">
          <article><b>ATTRIBUTABLE</b><p>Who or what produced the record, by which method, at which place and time?</p></article>
          <article><b>CONTINUOUS</b><p>Can the record's identity, provenance, transformations and later references be followed without silently substituting a different object?</p></article>
          <article><b>BOUNDED</b><p>What does this atmospheric record actually establish—and what does it not establish about authority, standing or execution?</p></article>
        </div>
        <div className="docs">
          <a href="https://medium.com/@greggbutlerac/atmospheric-integrity-records-the-missing-infrastructure-of-intelligent-buildings-7e13a925f929" target="_blank" rel="noreferrer"><small>AIR · PUBLIC ARCHITECTURE EXPLANATION</small><b>Atmospheric Integrity Records: The Missing Infrastructure of Intelligent Buildings ↗</b><p>Explains AIR as continuous, append-only, time-bounded atmospheric chronology separated from interpretation, optimization and actuation.</p></a>
          <a href="/foundation/public-corpus"><small>TA-14 · PUBLIC CORPUS</small><b>Environmental & Atmospheric Integrity family ↗</b><p>Inspect the public lineage for AIR, Environmental Integrity Governance, PAIR and related environmental evidence records.</p></a>
        </div>
        <div className="mantra">Monitoring is not evidence; evidence is not authority; authority is not execution.</div>
      </section>

      <section>
        <p className="eye">04 · AEA · ADMISSIBLE EXECUTION ARCHITECTURE</p>
        <h2>AEA governs the transition from proposed consequence to execution.</h2>
        <p className="lead2"><b>Admissible Execution Architecture (AEA)</b> is an evidence-first governance architecture for consequence-bearing action. It does not determine what Palestinian law should be, replace EQA's competent authority, or convert technical evidence into permission. It preserves the route from Reality through Record, Continuity, Admissibility, Binding, Commit, Execution and Outcome, and asks whether the exact proposed consequence has sufficient Admissible Evidence, Applicable Authority and Established Standing to become reality now.</p>
        <div className="grid four">
          <article><small>ADMISSIBLE EVIDENCE</small><b>Is the evidence sufficient for this exact proposition?</b></article>
          <article><small>APPLICABLE AUTHORITY</small><b>Is there current authority for this exact consequence?</b></article>
          <article><small>ESTABLISHED STANDING</small><b>May this actor rely on that authority here and now?</b></article>
          <article><small>NOW</small><b>Have material conditions changed since those facts were established?</b></article>
        </div>
        <div className="determinations"><b>ALLOW</b><b>HOLD</b><b>DENY</b><b>ESCALATE</b></div>
        <div className="docs">
          <a href="https://doi.org/10.5281/zenodo.20463927" target="_blank" rel="noreferrer"><small>AEA · DOI-BACKED FOUNDATIONAL REFERENCE</small><b>TA-14 Admissible Execution Architecture · Volume 1 ↗</b><p>Foundational monograph documenting the evidence-first architecture and the Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome chain.</p></a>
          <a href="/foundation/public-corpus"><small>TA-14 · COMPLETE PUBLIC CORPUS</small><b>Inspect the architecture lineage ↗</b><p>Public institutional ledger for TA-14 architecture, evidence, standards, DOI records, repositories and environmental lineage.</p></a>
        </div>
      </section>

      <section className="band">
        <p className="eye">05 · ONE BOUNDED PALESTINIAN EXAMINATION</p>
        <h2>Start with one real pathway, not a national replacement programme.</h2>
        <div className="exam">
          <article><span>01</span><b>SELECT ONE AIR-QUALITY RECORD</b><p>Use an existing EQA record, measurement, assessment or documented event suitable for technical discussion.</p></article>
          <article><span>02</span><b>NAME ONE PROPOSED CONSEQUENCE</b><p>State exactly what the record is proposed to support: warning, restriction, permit action, intervention, enforcement step or another bounded act.</p></article>
          <article><span>03</span><b>IDENTIFY THE AUTHORITY PATH</b><p>Preserve the Palestinian institution, legal basis, actor, scope, place and time window applicable to that act.</p></article>
          <article><span>04</span><b>CHANGE ONE MATERIAL CONDITION</b><p>Change time, air condition, threshold, jurisdiction, responsible actor, affected place or proposed action.</p></article>
          <article><span>05</span><b>RETURN A DETERMINATION</b><p>Observe whether the consequence remains ALLOW, or becomes HOLD, DENY or ESCALATE—and why.</p></article>
          <article><span>06</span><b>PRESERVE THE OUTCOME</b><p>Record what actually happened so any later action begins from current reality rather than inherited permission.</p></article>
        </div>
      </section>

      <section>
        <p className="eye">06 · PUBLICATION + INFORMATION USE</p>
        <h2>Correction has priority over narrative.</h2>
        <div className="boundary"><b>PUBLIC-RECORD BOUNDARY</b><p>This page records TA-14's interpretation of the questions received from EQA and TA-14's answers. It does not represent endorsement, adoption, certification, partnership, pilot authorization, procurement, governmental approval or regulatory recognition by the Environment Quality Authority, Dr. Adnan Judeh, or the State of Palestine. If EQA identifies any inaccurate representation, TA-14 should correct the public surface and preserve the correction.</p></div>
        <div className="uses">
          <p><b>TA-14 MAY USE</b><br/>Public information, TA-14's own architecture, and EQA material that EQA expressly provides for the technical dialogue.</p>
          <p><b>TA-14 SHOULD NOT INFER</b><br/>Approval, adoption, mandate, legal authority, consent to publish non-public material, or agreement with a TA-14 characterization unless separately established.</p>
        </div>
      </section>

      <section className="band">
        <p className="eye">07 · REFERENCE DOCUMENTATION</p>
        <h2>The requested documentation, in one place.</h2>
        <p className="lead2">These references are provided so EQA can inspect the architecture independently of this showroom. They are evidence of TA-14's published architecture and institutional record; they are not evidence of Palestinian adoption or applicability.</p>
        <div className="refgrid">
          <a href="https://doi.org/10.5281/zenodo.20463927" target="_blank" rel="noreferrer"><span>AEA</span><b>Foundational Monograph v1.2</b><p>DOI 10.5281/zenodo.20463927 · evidence-first consequence-governance architecture.</p></a>
          <a href="https://medium.com/@greggbutlerac/atmospheric-integrity-records-the-missing-infrastructure-of-intelligent-buildings-7e13a925f929" target="_blank" rel="noreferrer"><span>AIR</span><b>Atmospheric Integrity Records</b><p>Public AIR architecture explanation and environmental-record boundary.</p></a>
          <a href="/foundation/public-corpus"><span>CORPUS</span><b>Complete TA-14 Public Corpus</b><p>Public lineage across architecture, environmental integrity, DOI records, standards and implementations.</p></a>
          <a href="https://github.com/greggbutlerac-debug/ta14-admissible-execution-gate" target="_blank" rel="noreferrer"><span>REPOSITORY</span><b>TA-14 Admissible Execution Gate</b><p>Public architecture, doctrine, provenance, standards and reference-material repository.</p></a>
          <a href="https://environment.pna.ps/" target="_blank" rel="noreferrer"><span>EQA</span><b>Environment Quality Authority</b><p>Official Palestinian institutional source. EQA's own public materials govern representations of its mandate and functions.</p></a>
        </div>
      </section>

      <section>
        <p className="eye">08 · PROPOSED NEXT STEP</p>
        <h2>EQA can correct this before deciding whether to proceed.</h2>
        <div className="next"><b>REQUEST TO EQA</b><p>Please identify any part of this representation that is inaccurate or inconsistent with EQA's mandate, air-quality functions, information-use expectations, or the Palestinian administrative pathway. If the boundary is represented correctly, TA-14 proposes one bounded written technical examination before any broader engagement is considered.</p></div>
        <a className="source" href="https://environment.pna.ps/" target="_blank" rel="noreferrer">ENVIRONMENT QUALITY AUTHORITY OFFICIAL SITE ↗</a>
      </section>

      <footer>TA-14 AUTHORITY · PALESTINE PUBLIC TECHNICAL CLARIFICATION SURFACE<br/>CONTACT ≠ ENDORSEMENT · EVIDENCE ≠ AUTHORITY · AUTHORITY ≠ EXECUTION</footer>
    </div>

    <style>{`
      *{box-sizing:border-box}.p{min-height:100vh;background:radial-gradient(circle at 8% 0%,rgba(35,140,93,.18),transparent 30%),radial-gradient(circle at 92% 4%,rgba(210,55,60,.12),transparent 28%),linear-gradient(180deg,#020807,#06110f 45%,#020605);color:#eef6f2;font-family:Arial,sans-serif}.shell{width:min(1180px,calc(100% - 36px));margin:auto}nav{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid #ffffff14}nav a{color:#dbeae3;text-decoration:none;font-size:10px;font-weight:900;letter-spacing:.1em}.brand{font-size:18px!important}.brand b,.eye{color:#70d7a5}header{padding:78px 0 44px}.bilateral{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:20px;margin-bottom:52px}.bilateral>div{display:grid;grid-template-columns:auto 1fr;gap:2px 14px;align-items:center}.bilateral .flag{grid-row:1/3;font-size:44px}.bilateral b{font-size:13px}.bilateral small{color:#8ca49a}.bilateral i{color:#71847b}.bilateral .right{text-align:right}.bilateral .right .flag{grid-column:2}.bilateral .right b,.bilateral .right small{grid-column:1}.eye{font-size:10px;font-weight:950;letter-spacing:.18em}h1{margin:14px 0 22px;font:clamp(52px,7vw,88px) Georgia,serif;line-height:.95;letter-spacing:-.04em}h1 em{color:#e6c875;font-style:normal}.lead,.lead2{max-width:980px;color:#a9bbb3;font-size:17px;line-height:1.75}.status{display:flex;gap:8px;flex-wrap:wrap;margin:28px 0}.status b{padding:8px 10px;border:1px solid #ffffff1c;border-radius:999px;font-size:8px}.rule{padding:24px;border-left:3px solid #70d7a5;background:#70d7a50d}.rule small{display:block;color:#70d7a5;font-weight:900}.rule strong{display:block;margin-top:8px;font:24px Georgia,serif}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:7px;margin:24px 0 62px}.chain span{padding:12px 7px;border:1px solid #70d7a52b;border-radius:9px;text-align:center;font-size:8px;font-weight:900;color:#9ce7c3}section{padding:64px 0;border-top:1px solid #ffffff12}h2{max-width:980px;margin:10px 0 18px;font:clamp(36px,5vw,58px) Georgia,serif;line-height:1.04}.questions{display:grid;gap:10px;margin-top:30px}.questions article{display:grid;grid-template-columns:62px 1fr;gap:18px;padding:20px;border:1px solid #ffffff16;border-radius:16px;background:#ffffff05}.questions span{font:27px Georgia,serif;color:#70d7a5}.questions b,.grid b,.exam b{font-size:11px}.questions p,.grid p,.exam p,.flow p{color:#9eb1a8;line-height:1.65}.band{margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding-left:max(18px,calc((100vw - 1180px)/2));padding-right:max(18px,calc((100vw - 1180px)/2));background:#ffffff04}.flow{display:grid;grid-template-columns:1fr auto 1.15fr auto 1fr;gap:12px;align-items:stretch;margin-top:30px}.flow div{padding:22px;border:1px solid #ffffff16}.flow .gate{border-color:#70d7a5}.flow span{align-self:center;color:#70d7a5}.grid{display:grid;gap:12px;margin-top:26px}.three{grid-template-columns:repeat(3,1fr)}.four{grid-template-columns:repeat(4,1fr)}.grid article{padding:22px;border:1px solid #ffffff16;border-radius:14px;background:#ffffff04}.grid small{display:block;color:#70d7a5;font-size:8px;font-weight:900;margin-bottom:10px}.mantra,.next{margin-top:22px;padding:24px;border:1px solid #e6c8753b;background:#e6c8750d;font:21px Georgia,serif}.determinations{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:18px}.determinations b{padding:15px;border:1px solid #70d7a52b;text-align:center;color:#9ce7c3}.exam{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:28px}.exam article{padding:22px;border:1px solid #ffffff16;border-radius:14px}.exam span{font:28px Georgia,serif;color:#70d7a5}.exam b{display:block;margin:10px 0}.boundary{padding:24px;border:1px solid #e6c8753b;background:#e6c8750b}.boundary b{color:#e6c875}.boundary p{color:#a9bbb3;line-height:1.7}.uses{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}.uses p{padding:20px;border:1px solid #ffffff16;color:#9eb1a8;line-height:1.65}.uses b{color:#70d7a5;font-size:9px}.next b{display:block;color:#e6c875;font:10px Arial,sans-serif;letter-spacing:.12em}.next p{font:16px Arial,sans-serif;color:#a9bbb3;line-height:1.7}.docs{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}.docs a,.refgrid a{display:block;padding:20px;border:1px solid #70d7a52b;border-radius:14px;background:#70d7a508;color:#dcebe4;text-decoration:none}.docs small{display:block;color:#70d7a5;font-size:8px;font-weight:900;letter-spacing:.1em;margin-bottom:9px}.docs b,.refgrid b{display:block;font:18px Georgia,serif}.docs p,.refgrid p{color:#91a79c;line-height:1.55;font-size:12px}.refgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:25px}.refgrid a:last-child{grid-column:1/-1}.refgrid span{display:inline-block;margin-bottom:10px;color:#e6c875;font-size:8px;font-weight:900;letter-spacing:.12em}.source{display:inline-block;margin-top:18px;padding:13px 16px;border:1px solid #70d7a5;color:#9ce7c3;text-decoration:none;font-size:9px;font-weight:900}footer{padding:44px 0 70px;border-top:1px solid #ffffff12;color:#6f847a;font-size:9px;line-height:1.8}@media(max-width:900px){.bilateral{grid-template-columns:1fr}.bilateral>i{display:none}.bilateral .right{text-align:left}.bilateral .right .flag{grid-column:1}.bilateral .right b,.bilateral .right small{grid-column:2}.flow,.three,.four,.exam,.docs,.refgrid{grid-template-columns:1fr}.refgrid a:last-child{grid-column:auto}.chain{grid-template-columns:repeat(2,1fr)}.determinations{grid-template-columns:1fr 1fr}}@media(max-width:650px){nav{padding:18px 0;flex-wrap:wrap}.uses{grid-template-columns:1fr}.questions article{grid-template-columns:1fr}.shell{width:min(100% - 28px,1180px)}}
    `}</style>
  </main>
}