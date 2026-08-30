import Link from 'next/link';

const TERMS_VERSION = 'v0.2';

const sections = [
  ['01', 'Registration boundary', [
    'Registration preserves an attributable, version-bound governance record. Registration is not certification, endorsement, regulatory approval, legal priority, technical validation, or authority to execute.',
    'A Registry record establishes what was declared, by whom, in what version, with what claims, non-claims, evidence references, rights declarations, and lifecycle state.',
    'Registration does not form, replace, amend, reinterpret, certify, or constitute a participant\'s independently authorized governing position.'
  ]],
  ['02', 'Intellectual property ownership', [
    'Each participant retains ownership of its pre-existing architecture, methods, terminology, software, documentation, trademarks, patents, patent-pending subject matter, trade secrets, and other intellectual property.',
    'Registration or participation in a Founding Demonstration does not transfer ownership of a participant architecture to TA-14 and does not transfer TA-14 architecture, methods, terminology, or institutional authority to the participant.',
    'No architecture may represent the other architecture as absorbed, incorporated, assigned, certified, or owned unless a separate written instrument expressly establishes that right.',
    'Architecture-derived mappings, interface specifications, originating terminology, structural material, or equivalent material exposed through an examination remain protected by the rights of their originating owner. Visibility through examination does not create an implied right to use, reproduce, incorporate, teach, sublicense, or independently commercialize that material.'
  ]],
  ['03', 'Attribution and architectural independence', [
    'Material used in a Registry record or demonstration must remain attributable to its declared source where attribution is required.',
    'Independent architectures remain independent. Interoperability, comparison, examination, registration, or participation does not create merger, agency, partnership, joint ownership, endorsement, or authority transfer.',
    'A TA-14 Governed Finding is TA-14\'s institutional determination about the bounded examination. It does not form, replace, amend, reinterpret, or constitute the participant\'s authorized governing position.'
  ]],
  ['04', 'Confidentiality and non-public material', [
    'Public registration does not create a general right for TA-14 to publish proprietary or non-public material supplied for a controlled examination.',
    'Non-public evidence must be handled according to the written evidence boundary established for the specific examination. Any additional confidentiality obligation should be agreed in writing before the protected material is admitted.',
    'Participants should not submit trade secrets, credentials, regulated personal data, or other restricted material to a public Registry surface.'
  ]],
  ['05', 'Evidence handling, availability, and retention', [
    'Evidence admitted to a demonstration should be identified sufficiently to preserve provenance, version, relationship to the proposition, and integrity information where available.',
    'TA-14 may preserve the institutional record necessary to establish what was examined, what determination was reached, and the chronology of the examination, subject to the declared evidence and confidentiality boundary.',
    'An evidence reference, description, hash, digest, manifest, receipt, pointer, or summary is not automatically equivalent to admission, availability, independent inspection, or independent evidentiary support for the underlying evidence.',
    'Where constituent evidence required for independent inspection has not been admitted or made inspectable within the declared boundary, TA-14 may preserve HOLD or another bounded status until the necessary evidence surface is available. No adverse inference is created merely because evidence outside the admitted surface has not been inspected.'
  ]],
  ['06', 'Licensing and permitted use', [
    'Participation grants only the permissions reasonably necessary to perform and preserve the agreed Registry or demonstration activity. It does not create a general license to commercialize, sublicense, train models on, reverse engineer, reproduce, or incorporate another participant\'s proprietary architecture.',
    'Any use of a resulting public artefact for methodology demonstration is limited to TA-14 methodology demonstrations of TA-14\'s own examination, evidence-governance, or institutional process. It does not authorize TA-14 to teach, reproduce, demonstrate, or commercialize a participant\'s proprietary methodology as its own.',
    'Any broader license, implementation right, integration right, commercial right, or derivative-use permission must be established separately in writing.'
  ]],
  ['07', 'Publication and factual-review boundary', [
    'The Registry may publish the accepted public Registry record and its lifecycle state according to the visibility selected or otherwise agreed for that record.',
    'A Founding Demonstration publication must remain bounded to the agreed proposition, claims, non-claims, evidence surface, determination, limitations, and preserved unresolved conditions.',
    'Before controlled publication of a Founding Demonstration, the participant must be given a factual-review opportunity for descriptions of the participant architecture, authorship, terminology, version, patent status where represented, and the nature of the examined interface. Factual review may correct or preserve disputed factual description; it does not give the participant a veto over, approval right in, or authority to alter TA-14\'s independently supported finding.',
    'Non-public participant material is not made public merely because it was used in an examination. Material factual disagreement that cannot be resolved should be preserved rather than silently rewritten.'
  ]],
  ['08', 'Claims, non-claims, and finding ceiling', [
    'Every demonstration must state what is being tested and what is not being tested before the result is treated as an institutional finding.',
    'A bounded finding cannot be expanded into architecture-wide certification, universal validity, legal compliance, regulatory acceptance, production fitness, safety assurance, or authority beyond the evidence actually examined.',
    'PASS, SUPPORTABLE, SUPPORTED, HOLD, DENY, INCOMPLETE, or other determinations remain bounded by the proposition and evidence record that produced them.'
  ]],
  ['09', 'Proposition-bounded examination authority', [
    'Before execution, the parties should freeze the participating system or architecture identity and version, the proposition, explicit non-claims, evidence boundary, examination method, acceptance criteria, participant roles, authority boundary, confidentiality treatment, and publication treatment.',
    'TA-14 retains control of its examination method and its evidence determinations, findings, holds, denials, escalations, and institutional record, but that examination authority is confined to the agreed examination proposition and admitted evidence surface.',
    'A TA-14 examination does not become an interpretation, modification, certification, replacement, or determination of the participant architecture or methodology in its own right.',
    'A demonstration tests the agreed interface or proposition. It does not rewrite either participant architecture to manufacture compatibility or a favorable result.',
    'Changed conditions that materially affect the proposition may require revalidation rather than reliance on historical standing.'
  ]],
  ['10', 'Resulting artefacts', [
    'TA-14 retains its independently created institutional examination records, findings, seals, receipts, review documents, and Registry records. A participant retains its independently created source architecture and participant-supplied materials.',
    'Neither party may use a resulting artefact to imply claims, endorsement, certification, ownership, or authority that the artefact itself does not establish.',
    'A resulting artefact does not create an implied license to use architecture-derived mappings, interface specifications, originating terminology, or equivalent structural material beyond the permissions expressly established for the examination.'
  ]],
  ['11', 'Correction, dispute, withdrawal, and supersession', [
    'Material corrections should be preserved through the Registry lifecycle rather than silently rewriting historical records.',
    'A participant may raise a documented challenge concerning attribution, ownership, scope, evidence, or material factual accuracy. Withdrawal or supersession changes current standing but does not require erasure of the historical event chain where retention is necessary for institutional continuity.'
  ]],
  ['12', 'Special terms', [
    'These standing terms provide the default Registry and Founding Demonstration boundary. A specific examination may require additional written terms for confidentiality, restricted evidence, licensing, publication, security, commercial arrangements, or other exceptional conditions.',
    'Where specific written terms conflict with these standing terms for a defined demonstration, the specific terms govern that demonstration only to the extent of the stated conflict.'
  ]],
] as const;

export default function RegistryTermsPage() {
  return <main className="page">
    <header className="topbar">
      <Link href="/workspace/ai-governance/registry" className="brand"><strong>TA-14</strong><span>AI Governance Registry</span></Link>
      <nav><Link href="/workspace/ai-governance/registry">Registry Home</Link><Link href="/workspace/ai-governance/registry/directory">Browse Registry</Link></nav>
    </header>

    <section className="hero">
      <p className="eyebrow">AUTHORITATIVE STANDING POLICY · {TERMS_VERSION}</p>
      <h1>Registration &<br/><span>Demonstration Terms</span></h1>
      <p className="lede">The standing rules governing TA-14 AI Governance Registry participation and bounded Founding Demonstrations. Read these terms before registering an architecture or providing proprietary or non-public evidence.</p>
      <div className="boundary"><strong>Registration is not certification.</strong><span>A Registry record preserves identity, claims, evidence references, provenance, rights declarations, and lifecycle state. A demonstration may establish only the bounded proposition actually examined.</span></div>
      <div className="actions"><Link className="primary" href="/workspace/ai-governance/registry/register">Continue to Registration →</Link><a className="secondary" href="#terms">Review Terms Below</a></div>
    </section>

    <section className="summary">
      <div><b>IP</b><span>Ownership and architecture-derived rights stay with their owner.</span></div><div><b>EVIDENCE</b><span>Identity or hashing does not equal admission or inspection.</span></div><div><b>AUTHORITY</b><span>A TA-14 finding does not become participant authority.</span></div><div><b>FINDINGS</b><span>No claim beyond the proposition and admitted evidence.</span></div>
    </section>

    <section id="terms" className="terms">
      {sections.map(([number,title,paragraphs]) => <article key={number}>
        <div className="number">{number}</div><div><h2>{title}</h2>{paragraphs.map((p,i)=><p key={i}>{p}</p>)}</div>
      </article>)}
    </section>

    <section className="acceptance">
      <p className="eyebrow">BEFORE YOU CONTINUE</p><h2>Know the boundary before you submit.</h2>
      <p>By proceeding, you acknowledge that registration does not transfer intellectual property, grant operational authority, certify your architecture, admit undisclosed evidence, or authorize TA-14 or the participant to appropriate the other\'s methodology. Any examination is bounded to the declared proposition and admitted evidence surface.</p>
      <p>A specific Founding Demonstration may add separately agreed written terms before evidence is admitted or examination begins.</p>
      <div className="version"><b>Standing terms version</b><span>{TERMS_VERSION}</span></div>
      <Link className="primary" href="/workspace/ai-governance/registry/register">Continue to Registration →</Link>
    </section>

    <footer><span>TA-14 Authority · AI Governance Registry</span><span>No admissible evidence. No admissible execution.</span></footer>
    <style>{`*{box-sizing:border-box}body{margin:0;background:#07101f;color:#eef4ff;font-family:Inter,system-ui,sans-serif}.page{min-height:100vh;background:radial-gradient(circle at 12% 0%,rgba(74,122,255,.17),transparent 34rem);padding:0 24px 70px}.topbar{max-width:1180px;margin:auto;padding:25px 0;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(164,190,231,.14)}a{color:inherit;text-decoration:none}.brand{display:flex;gap:12px;align-items:center}.brand strong{color:#7fe4c4;letter-spacing:.12em}.brand span{color:#aebdd4}.topbar nav{display:flex;gap:22px;color:#aebdd4;font-size:.9rem}.hero,.summary,.terms,.acceptance,footer{max-width:1080px;margin-inline:auto}.hero{padding:88px 0 58px}.eyebrow{color:#7fe4c4!important;font-size:.72rem;font-weight:900;letter-spacing:.17em}.hero h1{font-size:clamp(3.2rem,8vw,6.8rem);line-height:.88;letter-spacing:-.065em;margin:18px 0 28px}.hero h1 span{color:#9eb9ff}.lede{max-width:800px;font-size:1.18rem;line-height:1.75;color:#b6c4d8}.boundary{margin:30px 0;max-width:900px;padding:20px 22px;border-left:4px solid #ffd27f;background:rgba(255,210,127,.06);border-radius:0 14px 14px 0}.boundary strong,.boundary span{display:block}.boundary strong{color:#ffd27f;margin-bottom:7px}.boundary span{color:#aebdd4;line-height:1.65}.actions{display:flex;gap:12px;flex-wrap:wrap}.primary,.secondary{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:12px 18px;border-radius:13px;font-weight:850}.primary{background:linear-gradient(135deg,#7fe4c4,#4da9d8);color:#07101f}.secondary{border:1px solid rgba(164,190,231,.25);background:rgba(255,255,255,.04)}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:70px}.summary div{padding:18px;border:1px solid rgba(164,190,231,.13);border-radius:15px;background:rgba(11,25,47,.75)}.summary b,.summary span{display:block}.summary b{font-size:.67rem;color:#7fe4c4;letter-spacing:.13em;margin-bottom:8px}.summary span{font-size:.86rem;color:#aebdd4;line-height:1.45}.terms article{display:grid;grid-template-columns:72px 1fr;gap:18px;padding:31px 0;border-top:1px solid rgba(164,190,231,.13)}.number{font-size:.78rem;font-weight:900;color:#7fe4c4;letter-spacing:.1em}.terms h2{margin:0 0 14px;font-size:1.75rem;letter-spacing:-.03em}.terms p{margin:0 0 10px;color:#aebdd4;line-height:1.72}.acceptance{margin-top:55px;padding:34px;border:1px solid rgba(127,228,196,.28);border-radius:22px;background:linear-gradient(135deg,rgba(17,70,60,.25),rgba(11,25,47,.92))}.acceptance h2{font-size:2.3rem;margin:8px 0 12px}.acceptance>p:not(.eyebrow){max-width:800px;color:#aebdd4;line-height:1.7}.version{display:flex;gap:12px;margin:20px 0;align-items:center}.version b{color:#8092ae;text-transform:uppercase;font-size:.7rem}.version span{padding:5px 9px;border-radius:999px;background:rgba(127,228,196,.12);color:#c8f6e7;font-size:.8rem}footer{display:flex;justify-content:space-between;gap:20px;margin-top:60px;padding-top:20px;border-top:1px solid rgba(164,190,231,.13);color:#71829d;font-size:.75rem}@media(max-width:720px){.topbar nav{display:none}.hero{padding-top:55px}.summary{grid-template-columns:1fr 1fr}.terms article{grid-template-columns:42px 1fr}.acceptance{padding:24px}footer{flex-direction:column}}`}</style>
  </main>;
}
