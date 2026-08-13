"use client";

import Link from "next/link";

const records = [
  {
    code: "GAR",
    title: "Governing Authority Record",
    desc: "The parent institutional instrument establishing the source, scope, delegation, limitation, review, publication, amendment, and revocation of authority exercised through the Exchange.",
    href: "/workspace/ai-governance/institutional-authority",
    state: "PUBLIC",
    role: "PARENT AUTHORITY",
    version: "FOUNDATIONAL",
  },
  {
    code: "ADR",
    title: "Atlas Chief of Staff Delegation Record",
    desc: "The subordinate delegation record identifying Atlas's bounded operational authority, prohibited authority, escalation requirements, and traceability to Human Institutional Authority.",
    href: "/workspace/ai-governance/institutional-authority/atlas-delegation",
    state: "PUBLIC",
    role: "DELEGATED AUTHORITY",
    version: "ACTIVE",
  },
  {
    code: "PAA",
    title: "Participation & Publication Authorization",
    desc: "The publication-boundary record separating preliminary correspondence, evidence admission, review authority, publication authority, protected material, corrections, and preservation.",
    href: "/workspace/ai-governance/institutional-authority/publication-authorization",
    state: "PUBLIC",
    role: "PARTICIPATION BOUNDARY",
    version: "ACTIVE",
  },
] as const;

const sequence = [
  ["Inspect institutional authority", "Confirm who governs the Exchange and where authority originates."],
  ["Inspect Atlas delegation", "Confirm the operational authority delegated to the Chief of Staff."],
  ["Inspect publication boundary", "Understand what may become public before anything is submitted."],
  ["Decide whether your authority permits participation", "Your own governing authority decides whether to proceed."],
  ["Register governed identity", "Create an attributable institutional identity without surrendering sovereignty."],
  ["Submit only intended governed material", "Evidence enters through the applicable intake process, not through conversation."],
] as const;

export default function RegistrationPackage() {
  return (
    <main className="page">
      <div className="grid" />
      <div className="ambient ambientA" />
      <div className="ambient ambientB" />

      <header className="topbar">
        <Link href="/workspace/ai-governance" className="back">← AI Governance Exchange</Link>
        <div className="topIdentity">
          <span className="pulse" />
          <span>TA-14 · PRE-REGISTRATION DUE DILIGENCE</span>
        </div>
        <Link href="/workspace/ai-governance/registry" className="registryLink">Registry →</Link>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <div className="eyebrow">INSTITUTIONAL DUE DILIGENCE · BEFORE CONSEQUENCE-BEARING COMMITMENT</div>
          <h1>
            Inspect the authority <em>before you register.</em>
          </h1>
          <p className="lead">
            The Exchange does not require a prospective participant to rely on an unexplained assertion of institutional authority. This package assembles the public records needed to inspect who governs the Exchange, what Atlas may do, and what publication authority a participant may grant before proprietary evidence is submitted.
          </p>

          <div className="heroActions">
            <a href="#records" className="primaryAction">Inspect governing records ↓</a>
            <Link href="/workspace/ai-governance/institutional-authority" className="secondaryAction">Open parent authority →</Link>
          </div>
        </div>

        <div className="authorityPanel">
          <div className="panelLabel">CURRENT INSTITUTIONAL STATE</div>
          <div className="authoritySeal"><span>TA</span><strong>14</strong></div>
          <div className="stateRows">
            <div><span>Authority evidence</span><strong>PUBLIC</strong></div>
            <div><span>Atlas delegation</span><strong>PUBLIC</strong></div>
            <div><span>Publication boundary</span><strong>PUBLIC</strong></div>
            <div><span>Participant evidence admitted</span><strong className="held">NO</strong></div>
          </div>
        </div>
      </section>

      <section className="statusStrip shell">
        <div>
          <span className="statusDot" />
          <div><small>PRE-REGISTRATION STATE</small><strong>Institutional review only</strong></div>
        </div>
        <div><small>PROPRIETARY EVIDENCE</small><strong>Not required</strong></div>
        <div><small>FOUNDING DEMONSTRATION</small><strong>Not opened</strong></div>
        <div><small>PUBLICATION AUTHORIZATION</small><strong>Not inferred</strong></div>
      </section>

      <section className="authorityChain shell">
        <div className="sectionHead compact">
          <div>
            <div className="eyebrow">AUTHORITY TRACE</div>
            <h2>Authority should be visible before reliance.</h2>
          </div>
          <p>Every institutional act must be traceable backward to a valid authority source and forward to a bounded institutional record.</p>
        </div>
        <div className="chainRow">
          {["Human Institutional Authority", "TA-14 Authority Governance Institution", "TA-14 AI Governance Exchange", "Authorized Institutional Role", "Bounded Institutional Act"].map((item, i) => (
            <article key={item}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
              {i < 4 ? <b>→</b> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="records shell" id="records">
        <div className="sectionHead">
          <div>
            <div className="eyebrow">GOVERNING RECORD SET</div>
            <h2>Three records. One inspectable authority boundary.</h2>
          </div>
          <p>These records are meant to be read before registration so a prospective participant can evaluate TA-14's authority structure without submitting proprietary material first.</p>
        </div>

        <div className="recordGrid">
          {records.map((record, index) => (
            <Link href={record.href} className="recordCard" key={record.code}>
              <div className="recordTop">
                <div className="recordIndex">{String(index + 1).padStart(2, "0")}</div>
                <div className="recordBadges">
                  <span>{record.state}</span>
                  <span>{record.version}</span>
                </div>
              </div>
              <div className="recordRole">{record.role}</div>
              <h3>{record.title}</h3>
              <p>{record.desc}</p>
              <div className="recordFooter">
                <span>{record.code}</span>
                <strong>OPEN RECORD →</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="sequence shell">
        <div className="sectionHead">
          <div>
            <div className="eyebrow">PROSPECTIVE PARTICIPANT SEQUENCE</div>
            <h2>Due diligence comes before evidence submission.</h2>
          </div>
          <p>The Exchange deliberately separates authority inspection from registration, registration from evidence admission, and evidence admission from publication.</p>
        </div>

        <div className="sequenceGrid">
          {sequence.map(([title, description], index) => (
            <article key={title}>
              <div className="stepNumber">{String(index + 1).padStart(2, "0")}</div>
              <div className="stepRule" />
              <h3>{title}</h3>
              <p>{description}</p>
              {index < sequence.length - 1 ? <span className="nextArrow">→</span> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="boundary shell">
        <div className="boundaryIcon">≠</div>
        <div>
          <div className="eyebrow">PRE-REGISTRATION BOUNDARY</div>
          <h2>Conversation is not admission.</h2>
          <p>
            Material exchanged during preliminary institutional due diligence does not become admitted TA-14 evidence merely because it was communicated to Atlas or another Exchange representative. Evidence admission requires the applicable governed intake process.
          </p>
        </div>
        <div className="boundaryRule">
          <span>PRELIMINARY CORRESPONDENCE</span>
          <b>≠</b>
          <span>ADMITTED EVIDENCE</span>
        </div>
      </section>

      <section className="ready shell">
        <div className="sectionHead">
          <div>
            <div className="eyebrow">WHEN DUE DILIGENCE IS COMPLETE</div>
            <h2>A participant may proceed without surrendering architectural sovereignty.</h2>
          </div>
          <p>Each stage creates a different institutional effect. The Exchange keeps those effects separate so registration cannot silently become evidence admission, publication, certification, or endorsement.</p>
        </div>

        <div className="readyGrid">
          <article><span>01</span><strong>Registration</strong><p>Creates a governed identity and attributable record.</p></article>
          <article><span>02</span><strong>Evidence admission</strong><p>Defines what material may support the proceeding.</p></article>
          <article><span>03</span><strong>Publication authorization</strong><p>Defines what may become public.</p></article>
          <article><span>04</span><strong>Finding authority</strong><p>Remains bounded by proposition, evidence, scope, and limitations.</p></article>
        </div>

        <div className="ctaBand">
          <div><small>NEXT GOVERNED STEP</small><strong>Registration begins only after your own authority permits participation.</strong></div>
          <Link href="/workspace/ai-governance/registry">Proceed to Governance Registry →</Link>
        </div>
      </section>

      <footer>
        <div><strong>TA-14 Authority Governance Institution</strong><span>TA-14 AI Governance Exchange · Institutional Due Diligence</span></div>
        <p>Asserted authority <b>≠</b> evidenced authority.</p>
      </footer>

      <style jsx>{`
        :global(*){box-sizing:border-box}
        :global(html){scroll-behavior:smooth;background:#02070d}
        :global(body){margin:0;background:#02070d;color:#eef9ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        :global(a){color:inherit;text-decoration:none}
        .page{position:relative;min-height:100vh;overflow:hidden;background:radial-gradient(circle at 50% -5%,rgba(57,170,220,.16),transparent 30%),radial-gradient(circle at 10% 55%,rgba(244,186,84,.09),transparent 26%),radial-gradient(circle at 92% 70%,rgba(96,218,255,.07),transparent 25%),linear-gradient(180deg,#02070d 0%,#06131e 48%,#02070d 100%)}
        .grid{position:fixed;inset:0;pointer-events:none;opacity:.16;background-image:linear-gradient(rgba(100,217,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(100,217,255,.04) 1px,transparent 1px);background-size:54px 54px;mask-image:linear-gradient(to bottom,black,transparent 92%)}
        .ambient{position:fixed;border-radius:50%;filter:blur(100px);pointer-events:none;opacity:.15}.ambientA{width:380px;height:380px;left:-150px;top:22%;background:#2ea9e6}.ambientB{width:360px;height:360px;right:-120px;top:60%;background:#e7a83f}
        .shell{position:relative;z-index:2;width:min(1220px,calc(100% - 40px));margin-inline:auto}
        .topbar{position:relative;z-index:20;min-height:72px;padding:0 5vw;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border-bottom:1px solid rgba(120,220,255,.13);background:rgba(2,8,14,.84);backdrop-filter:blur(20px);color:#8da9ba;font-size:.68rem;font-weight:850;letter-spacing:.09em}.registryLink{text-align:right}.topIdentity{display:flex;align-items:center;gap:9px;color:#d9edf7}.pulse{width:7px;height:7px;border-radius:50%;background:#72e6b2;box-shadow:0 0 16px rgba(114,230,178,.8)}
        .hero{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(320px,.55fr);gap:62px;align-items:center;padding:118px 0 78px}.eyebrow{color:#f4ba54;font-size:.62rem;font-weight:900;letter-spacing:.19em;text-transform:uppercase}.hero h1{max-width:900px;margin:16px 0 28px;font-size:clamp(3.4rem,6.4vw,6.7rem);line-height:.91;letter-spacing:-.06em}.hero h1 em{font-style:normal;color:#65dcff;text-shadow:0 0 34px rgba(101,220,255,.12)}.lead{max-width:860px;margin:0;color:#a9c2d0;font-size:1.08rem;line-height:1.88}.heroActions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.heroActions a{padding:14px 18px;border-radius:10px;font-size:.72rem;font-weight:900}.primaryAction{background:linear-gradient(135deg,#f6c05c,#d69a30);color:#07111a;box-shadow:0 12px 34px rgba(244,186,84,.16)}.secondaryAction{border:1px solid rgba(101,220,255,.22);background:rgba(8,27,41,.74);color:#dff8ff}
        .authorityPanel{position:relative;padding:28px;border:1px solid rgba(101,220,255,.18);border-radius:22px;background:linear-gradient(180deg,rgba(8,27,41,.9),rgba(3,14,23,.86));box-shadow:0 28px 70px rgba(0,0,0,.25),inset 0 1px rgba(255,255,255,.03)}.authorityPanel:before{content:"";position:absolute;inset:-1px;border-radius:22px;padding:1px;background:linear-gradient(145deg,rgba(101,220,255,.28),transparent 40%,rgba(244,186,84,.18));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;pointer-events:none}.panelLabel{color:#738fa0;font-size:.56rem;font-weight:900;letter-spacing:.15em}.authoritySeal{width:92px;height:92px;margin:22px 0;display:flex;align-items:baseline;justify-content:center;gap:2px;border-radius:50%;border:1px solid rgba(244,186,84,.46);background:radial-gradient(circle,rgba(244,186,84,.11),rgba(0,0,0,.3));box-shadow:0 0 44px rgba(244,186,84,.08)}.authoritySeal span{color:#f4ba54;font-size:1.4rem;font-weight:900}.authoritySeal strong{color:#fff;font-size:2rem}.stateRows{display:grid;gap:0}.stateRows div{display:flex;justify-content:space-between;gap:18px;padding:12px 0;border-top:1px solid rgba(113,209,242,.09);font-size:.72rem}.stateRows span{color:#809bab}.stateRows strong{color:#72e6b2;font-size:.65rem;letter-spacing:.08em}.stateRows strong.held{color:#f4ba54}
        .statusStrip{display:grid;grid-template-columns:1.25fr repeat(3,1fr);border:1px solid rgba(105,215,250,.14);border-radius:17px;background:rgba(5,19,30,.78);box-shadow:0 20px 50px rgba(0,0,0,.16);overflow:hidden}.statusStrip>div{min-height:92px;padding:20px 22px;display:flex;align-items:center;gap:12px;border-right:1px solid rgba(105,215,250,.1)}.statusStrip>div:last-child{border-right:0}.statusStrip small,.statusStrip strong{display:block}.statusStrip small{color:#718fa1;font-size:.53rem;font-weight:900;letter-spacing:.13em}.statusStrip strong{margin-top:5px;font-size:.75rem}.statusDot{width:9px;height:9px;flex:0 0 auto;border-radius:50%;background:#72e6b2;box-shadow:0 0 17px rgba(114,230,178,.75)}
        .authorityChain,.records,.sequence,.ready{padding-top:105px}.sectionHead{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.58fr);gap:60px;align-items:end;margin-bottom:34px}.sectionHead.compact{margin-bottom:28px}.sectionHead h2{max-width:750px;margin:10px 0 0;font-size:clamp(2rem,4vw,3.35rem);line-height:1.02;letter-spacing:-.035em}.sectionHead>p{margin:0;color:#8ca9b9;line-height:1.75;font-size:.88rem}
        .chainRow{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.chainRow article{position:relative;min-height:120px;padding:18px;border:1px solid rgba(101,220,255,.13);border-radius:13px;background:linear-gradient(180deg,rgba(7,24,37,.88),rgba(5,18,29,.68));box-shadow:inset 0 1px rgba(255,255,255,.02)}.chainRow article>span{color:#64d9ff;font-size:.58rem;font-weight:900}.chainRow strong{display:block;margin-top:28px;font-size:.72rem;line-height:1.4}.chainRow b{position:absolute;right:-11px;top:50%;z-index:5;color:#f4ba54;font-size:1rem}
        .recordGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.recordCard{position:relative;min-height:390px;padding:26px;display:flex;flex-direction:column;border:1px solid rgba(102,218,255,.15);border-radius:19px;background:linear-gradient(155deg,rgba(9,30,45,.9),rgba(4,16,26,.82));box-shadow:0 24px 60px rgba(0,0,0,.2);overflow:hidden;transition:transform .22s,border-color .22s,box-shadow .22s}.recordCard:after{content:"";position:absolute;inset:auto -18% -42% auto;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(101,220,255,.1),transparent 65%);pointer-events:none}.recordCard:hover{transform:translateY(-6px);border-color:rgba(244,186,84,.33);box-shadow:0 32px 75px rgba(0,0,0,.28)}.recordTop{display:flex;justify-content:space-between;align-items:center}.recordIndex{color:#f4ba54;font-size:.72rem;font-weight:900}.recordBadges{display:flex;gap:6px}.recordBadges span{padding:5px 7px;border:1px solid rgba(114,230,178,.18);border-radius:999px;color:#72e6b2;font-size:.48rem;font-weight:900;letter-spacing:.1em}.recordRole{margin-top:56px;color:#64d9ff;font-size:.55rem;font-weight:900;letter-spacing:.15em}.recordCard h3{margin:11px 0 14px;font-size:1.65rem;line-height:1.1}.recordCard p{margin:0;color:#92adbc;line-height:1.72;font-size:.84rem}.recordFooter{margin-top:auto;padding-top:28px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(103,215,250,.1)}.recordFooter span{color:#718fa0;font-size:.58rem;font-weight:900}.recordFooter strong{color:#f4ba54;font-size:.61rem;letter-spacing:.08em}
        .sequenceGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.sequenceGrid article{position:relative;min-height:210px;padding:24px;border:1px solid rgba(101,220,255,.13);border-radius:15px;background:linear-gradient(180deg,rgba(6,22,34,.82),rgba(4,16,25,.68))}.stepNumber{color:#64d9ff;font-size:.65rem;font-weight:900}.stepRule{width:42px;height:2px;margin:22px 0;background:linear-gradient(90deg,#f4ba54,transparent)}.sequenceGrid h3{margin:0 0 11px;font-size:1rem;line-height:1.35}.sequenceGrid p{margin:0;color:#819dab;font-size:.78rem;line-height:1.65}.nextArrow{position:absolute;right:-10px;top:50%;z-index:4;color:#f4ba54;font-weight:900}
        .boundary{margin-top:110px;padding:42px 46px;display:grid;grid-template-columns:90px minmax(0,1fr) minmax(270px,.52fr);gap:32px;align-items:center;border:1px solid rgba(244,186,84,.3);border-radius:22px;background:linear-gradient(120deg,rgba(244,186,84,.1),rgba(7,24,36,.84) 55%,rgba(101,220,255,.04));box-shadow:0 26px 70px rgba(0,0,0,.2)}.boundaryIcon{width:74px;height:74px;display:grid;place-items:center;border-radius:18px;border:1px solid rgba(244,186,84,.4);color:#f4ba54;font-size:2.5rem;font-weight:300;background:rgba(244,186,84,.05)}.boundary h2{margin:8px 0 10px;font-size:2.2rem}.boundary p{margin:0;color:#a5bdca;line-height:1.8}.boundaryRule{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;text-align:center}.boundaryRule span{padding:14px 10px;border:1px solid rgba(101,220,255,.13);border-radius:10px;color:#9eb7c5;font-size:.57rem;font-weight:900;letter-spacing:.08em}.boundaryRule b{color:#f4ba54;font-size:1.5rem}
        .readyGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.readyGrid article{min-height:175px;padding:23px;border:1px solid rgba(101,220,255,.13);border-radius:14px;background:rgba(6,21,33,.72)}.readyGrid article>span{color:#f4ba54;font-size:.57rem;font-weight:900}.readyGrid strong{display:block;margin-top:28px;color:#64d9ff;font-size:.87rem}.readyGrid p{margin:8px 0 0;color:#849fad;font-size:.77rem;line-height:1.6}.ctaBand{margin:24px 0 105px;padding:25px 27px;display:flex;justify-content:space-between;align-items:center;gap:30px;border:1px solid rgba(244,186,84,.22);border-radius:15px;background:linear-gradient(90deg,rgba(244,186,84,.08),rgba(9,29,43,.7))}.ctaBand small,.ctaBand strong{display:block}.ctaBand small{color:#f4ba54;font-size:.52rem;font-weight:900;letter-spacing:.13em}.ctaBand strong{margin-top:6px;font-size:.8rem}.ctaBand a{padding:13px 17px;border-radius:9px;background:#f4ba54;color:#07111a;font-size:.68rem;font-weight:900;white-space:nowrap}
        footer{position:relative;z-index:2;padding:34px 5vw;display:flex;align-items:center;justify-content:space-between;gap:30px;border-top:1px solid rgba(103,215,250,.12);background:rgba(2,8,14,.72)}footer strong,footer span{display:block}footer strong{font-size:.75rem}footer span{margin-top:4px;color:#718fa0;font-size:.62rem}footer p{margin:0;color:#8fa9b7;font-size:.72rem}footer p b{color:#f4ba54}
        @media(max-width:980px){.hero{grid-template-columns:1fr}.authorityPanel{max-width:620px}.statusStrip{grid-template-columns:1fr 1fr}.statusStrip>div:nth-child(2){border-right:0}.statusStrip>div{border-bottom:1px solid rgba(105,215,250,.1)}.sectionHead{grid-template-columns:1fr;gap:18px}.recordGrid{grid-template-columns:1fr}.recordCard{min-height:300px}.recordRole{margin-top:34px}.chainRow{grid-template-columns:1fr}.chainRow b{right:auto;left:27px;top:auto;bottom:-14px;transform:rotate(90deg)}.sequenceGrid{grid-template-columns:1fr 1fr}.boundary{grid-template-columns:74px 1fr}.boundaryRule{grid-column:1/-1}.readyGrid{grid-template-columns:1fr 1fr}}
        @media(max-width:680px){.topbar{grid-template-columns:1fr auto}.topIdentity{display:none}.hero{padding-top:76px}.hero h1{font-size:clamp(3rem,14vw,4.6rem)}.statusStrip{grid-template-columns:1fr}.statusStrip>div{border-right:0}.sequenceGrid,.readyGrid{grid-template-columns:1fr}.nextArrow{right:auto;left:26px;top:auto;bottom:-14px;transform:rotate(90deg)}.boundary{padding:28px;grid-template-columns:1fr}.boundaryIcon{width:60px;height:60px}.boundaryRule{grid-template-columns:1fr}.boundaryRule b{transform:rotate(90deg)}.ctaBand{align-items:flex-start;flex-direction:column}.ctaBand a{width:100%;text-align:center}footer{align-items:flex-start;flex-direction:column}}
      `}</style>
    </main>
  );
}
