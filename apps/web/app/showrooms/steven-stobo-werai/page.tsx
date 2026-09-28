export const metadata={
  title:'Steven Stobo · WeRAI × TA-14 AHIA | TA-14 Exchange',
  description:'Public interoperability participant record for Steven Stobo and the proposed WeRAI × TA-14 AHIA examination. Registration pending; no proprietary material published.'
};

const principles=[
  ['01','MACHINE CANNOT SELF-AUTHORIZE','WeRAI / G=1 is publicly described by Steven Stobo as preserving a named human at the irreversible execution boundary.'],
  ['02','HUMAN ACTION IS STILL EXAMINED','TA-14 AHIA independently asks whether the human intervention has sufficient evidence, authority, scope, standing, independence and present conditions.'],
  ['03','NO AUTHORITY INHERITANCE','Neither architecture may treat the other architecture\'s determination as authority it did not independently establish.'],
  ['04','NO PREDETERMINED PASS','A HOLD, DENY, limitation, mismatch or failed interoperability condition remains an admissible outcome of the examination.']
];

export default function StevenStoboShowroom(){return <main className="page">
<style>{`
*{box-sizing:border-box}.page{min-height:100vh;background:#05080b;color:#eef5f7;font-family:Arial,Helvetica,sans-serif}.shell{width:min(1160px,calc(100% - 36px));margin:auto}
nav{padding:24px 0;border-bottom:1px solid #1c2d36;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}.brand{font-size:10px;font-weight:950;letter-spacing:.14em}.navlinks a{color:#77dff2;text-decoration:none;font-size:10px;font-weight:900;margin-left:18px}
.hero{padding:88px 0 70px;background:radial-gradient(circle at 78% 10%,#123747 0,transparent 30%)}.eyebrow{color:#72dfef;font-size:10px;font-weight:950;letter-spacing:.16em}.hero h1{font:clamp(54px,8vw,96px)/.92 Georgia,serif;letter-spacing:-.05em;margin:17px 0 24px}.hero h1 em{display:block;color:#e9bd65;font-weight:400}.lead{max-width:890px;color:#b4c4ca;font:20px/1.65 Georgia,serif}.status{display:flex;gap:8px;flex-wrap:wrap;margin-top:28px}.status span{padding:8px 10px;border:1px solid #385260;color:#bed2d8;font-size:9px;font-weight:900;letter-spacing:.11em}.status .pending{border-color:#d7aa54;color:#efca77}
section{padding:70px 0;border-top:1px solid #101d24}h2{font:clamp(38px,5vw,62px)/1.02 Georgia,serif;margin:10px 0 22px}.intro{max-width:900px;color:#97abb3;font-size:16px;line-height:1.75}.cards{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:34px}.cards article{padding:26px;border:1px solid #1a3844;border-radius:17px;background:#08131a}.cards small{color:#e9bd65;font-weight:950}.cards h3{font:26px Georgia,serif;margin:12px 0}.cards p{color:#95aab3;font-size:13px;line-height:1.7}.seam{background:#0a171e}.chain{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:32px}.chain b{padding:12px 14px;border:1px solid #31515e;border-radius:10px;font-size:10px}.chain i{color:#e9bd65;font-style:normal}.rule{margin-top:30px;padding:22px;border-left:3px solid #e9bd65;background:#171306;color:#d8cba8;line-height:1.7}.private{background:#061118}.private strong{color:#e9bd65}.footer{padding:36px 0 55px;border-top:1px solid #14242c;color:#6f8790;font-size:10px;line-height:1.7}
@media(max-width:760px){.cards{grid-template-columns:1fr}.navlinks{display:none}}
`}</style>
<nav className="shell"><div className="brand">STEVEN STOBO · WeRAI × TA-14 AHIA</div><div className="navlinks"><a href="/">TA-14 EXCHANGE</a><a href="/showrooms/interoperability-systems">INTEROPERABILITY</a></div></nav>
<header className="hero"><div className="shell">
<p className="eyebrow">PUBLIC INTEROPERABILITY PARTICIPANT RECORD</p>
<h1>Steven Stobo <em>WeRAI AI Integration Inc.</em></h1>
<p className="lead">Steven Stobo has publicly accepted TA-14's invitation to examine a bounded interoperability seam between WeRAI / Human Router / G=1 and the TA-14 Admissible Human Intervention Architecture (AHIA). The purpose is not to merge the architectures. It is to test whether each can preserve its own authority boundary while contributing evidence to one consequential route.</p>
<div className="status"><span>PUBLIC PARTICIPANT</span><span>INTEROPERABILITY ACCEPTED IN PRINCIPLE</span><span className="pending">REGISTRATION PENDING</span><span>NO ENDORSEMENT IMPLIED</span><span>NO PROPRIETARY MATERIAL PUBLISHED</span></div>
</div></header>
<section><div className="shell"><p className="eyebrow">THE PROPOSED SEAM</p><h2>Machine restraint and human admissibility remain separate.</h2><p className="intro">The public proposition is narrow: WeRAI / G=1 preserves the non-delegable human committal at an irreversible boundary; TA-14 AHIA independently examines whether that human intervention is admissible before consequence. A determination by one side does not manufacture authority for the other.</p><div className="cards">{principles.map(([n,t,d])=><article key={n}><small>{n}</small><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
<section className="seam"><div className="shell"><p className="eyebrow">EXAMINATION CANDIDATE</p><h2>One consequence boundary. Two independent checks.</h2><div className="chain"><b>WeRAI / G=1</b><i>→</i><b>NAMED HUMAN COMMITTAL</b><i>→</i><b>TA-14 AHIA</b><i>→</i><b>CONSEQUENCE EXAMINATION</b></div><div className="rule"><strong>Independence rule:</strong> neither architecture may borrow, manufacture or silently inherit execution authority from the other. The future examination remains open to PASS, HOLD, DENY, limitation or other bounded result supported by the evidence.</div></div></section>
<section className="private"><div className="shell"><p className="eyebrow">DISCLOSURE BOUNDARY</p><h2>Presence is public. Substance remains bounded.</h2><p className="intro">This page records only the public interoperability intent already stated by the participants. It does not publish source code, private governance artifacts, technical implementation details, confidential evidence, proprietary architecture internals, or an examination finding. <strong>No TA-14 Registry identifier has been assigned to WeRAI / Human Router on this page.</strong> Registration remains pending.</p></div></section>
<footer className="footer"><div className="shell">PUBLIC INTEROPERABILITY PARTICIPANT RECORD · OPEN FOR CORRECTION · REGISTRATION PENDING · NO CERTIFICATION, VALIDATION OR ENDORSEMENT IMPLIED</div></footer>
</main>}
