import Link from 'next/link';
import SaferAirExperience from './SaferAirExperience';

const chain=['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'];

const sources=[
  ['The Safer Air Project · 2026 conference','https://www.saferairproject.com/safer-shared-air-indoor-air-health-and-productivity-conference-2026'],
  ['The Safer Air Project · Making the invisible visible','https://www.saferairproject.com/making-the-invisible-visible'],
  ['RESET × Safer Air Project × PHAN · RSAAI','https://www.saferairproject.com/resources/reset-safer-air-project-and-public-health-action-network-launch-joint-initiative-to-make-indoor-air-quality-measurable-and-accessible'],
  ['Global Commission on Healthy Indoor Air · IWBI','https://www.wellcertified.com/global-commission'],
  ['TA-14 · Environmental Integrity Governance','/environmental-integrity-governance'],
  ['TA-14 · Country & Institutional Showrooms','/global-institutional-engagement/showrooms'],
  ['TA-14 · NIST AI-Optimized Building Controls candidate surface','/nist-ai-optimized-building-controls']
];

export const metadata={
  title:'The Safer Air Project × TA-14 | From Visible Air to Governed Consequence',
  description:'Public technical showroom examining the seam between indoor-air visibility, evidence, authority, standing, execution and outcome.'
};

export default function Page(){return <main className="p"><div className="shell">
  <nav>
    <Link href="/showrooms/environmental-atmospheric">← ENVIRONMENTAL & ATMOSPHERIC SHOWROOMS</Link>
    <Link className="brand" href="/"><span>TA-14</span> AUTHORITY</Link>
    <a href="https://www.saferairproject.com/" target="_blank" rel="noreferrer">THE SAFER AIR PROJECT ↗</a>
  </nav>

  <header>
    <div className="status"><b>PUBLIC TECHNICAL SHOWROOM</b><span>OPEN FOR CORRECTION</span><span>NO PARTNERSHIP OR ENDORSEMENT IMPLIED</span></div>
    <p className="eye">THE SAFER AIR PROJECT × TA-14 · HEALTHY INDOOR AIR · ACCESSIBILITY · CONSEQUENCE GOVERNANCE</p>
    <h1>Make the invisible visible.<br/><em>Then govern what happens next.</em></h1>
    <p className="lead">The Safer Air Project is helping move indoor air from an invisible background condition into public view, national policy, accessibility practice and global discussion. TA-14 does not replace that work. This showroom examines the next seam: once a condition is visible and a consequence is proposed, what must be established before that consequence is allowed to become reality?</p>
    <div className="question">
      <small>TA-14 GOVERNING QUESTION</small>
      <strong>Does this proposed consequence have sufficient <em>Admissible Evidence</em>, <em>Applicable Authority</em>, and <em>Established Standing</em> to become reality <u>NOW</u>?</strong>
    </div>
  </header>

  <section>
    <p className="eye">01 · WHAT THE SAFER AIR PROJECT IS ALREADY DOING</p>
    <h2>They are not starting with technology.<br/><em>They are changing what indoor air means.</em></h2>
    <p className="intro">The Safer Air Project frames indoor air quality as a health, accessibility and inclusion issue; advocates for performance-based IAQ standards in public buildings; convenes policymakers, clinicians, researchers, industry and people with lived experience; and runs public-awareness work designed to make indoor-air conditions visible.</p>
    <div className="cards four">
      <article><span>01</span><b>MAKE AIR VISIBLE</b><p>Encourage organisations to monitor indoor air in real time and visibly display IAQ information so people can understand the spaces they enter.</p></article>
      <article><span>02</span><b>MOVE POLICY</b><p>Advance a National Healthy Air Strategy and performance-based approaches for public buildings through advocacy, evidence and institutional engagement.</p></article>
      <article><span>03</span><b>CENTER PEOPLE</b><p>Frame indoor air as an accessibility and inclusion issue, especially for people whose health or participation can be affected by shared indoor environments.</p></article>
      <article><span>04</span><b>BUILD A GLOBAL FRAME</b><p>Plum Stone is a co-chair of the Global Commission on Healthy Indoor Air, a coalition of more than 170 leaders and experts from more than 30 countries.</p></article>
    </div>
  </section>

  <section className="band">
    <p className="eye">02 · THE NEWEST SEAM</p>
    <h2>Visibility is becoming infrastructure.</h2>
    <p className="intro">In September 2026, RESET, The Safer Air Project and the Public Health Action Network announced the RESET Safer Air Accessibility Index (RSAAI), intended to make indoor-air safety and the air-cleaning technology in use more visible. That is a significant step toward inspectable environmental context. TA-14 asks what happens when that visible context is used to justify a consequential action.</p>
    <div className="bridge">
      <div><small>VISIBLE CONDITION</small><b>What is happening?</b><p>Monitoring · display · index · environmental context</p></div>
      <i>→</i>
      <div><small>EVIDENCE</small><b>Can the record be relied upon?</b><p>Provenance · continuity · time · scope · changed condition</p></div>
      <i>→</i>
      <div className="hot"><small>AUTHORITY SEAM</small><b>What may happen next?</b><p>Applicable Authority · Established Standing · exact binding · present eligibility</p></div>
      <i>→</i>
      <div><small>OUTCOME</small><b>What actually happened?</b><p>Execution · verification · post-condition · new baseline</p></div>
    </div>
  </section>

  <section>
    <p className="eye">03 · THIS IS NOT A CRITIQUE OF THEIR WORK</p>
    <h2>The “gap” is a boundary between jobs.</h2>
    <p className="intro">The Safer Air Project does not claim to be a building-control authorization system, an execution runtime, a regulatory authority or a replacement for owners, operators, clinicians, engineers or public agencies. The open seam appears when evidence developed for visibility, accessibility, policy or performance is asked to support a real-world consequence.</p>
    <div className="compare">
      <div>
        <small>SAFER AIR PROJECT / RELATED IAQ WORK</small>
        <h3>Make conditions understandable and actionable.</h3>
        <ul><li>Public awareness</li><li>Measurement visibility</li><li>Accessibility framing</li><li>Policy reform</li><li>Performance standards</li><li>Cross-sector convening</li></ul>
      </div>
      <div className="plus">+</div>
      <div className="ta">
        <small>TA-14 GOVERNANCE LAYER</small>
        <h3>Make consequences inspectable before execution.</h3>
        <ul><li>Evidence provenance and continuity</li><li>Applicable Authority</li><li>Established Standing</li><li>Exact object / place / time binding</li><li>ALLOW · HOLD · DENY · ESCALATE</li><li>Outcome and revalidation record</li></ul>
      </div>
    </div>
    <div className="notreplace"><b>TA-14 DOES NOT REPLACE THE IAQ LAYER.</b><p>It preserves the distinction between “we can see a condition,” “we have evidence,” “someone has authority,” and “this exact consequence may execute here and now.”</p></div>
  </section>

  <SaferAirExperience/>

  <section>
    <p className="eye">04 · A PERFORMANCE STANDARD IS NOT YET AN EXECUTION DECISION</p>
    <h2>One target can produce many consequences.</h2>
    <div className="matrix">
      <article><b>STANDARD / TARGET</b><p>A public building should maintain defined IAQ performance.</p><span>ESTABLISHES A REQUIREMENT OR EXPECTATION</span></article>
      <article><b>MEASUREMENT</b><p>A sensor or verified record shows current conditions.</p><span>ESTABLISHES OBSERVATION / EVIDENCE</span></article>
      <article><b>DECISION</b><p>A specific intervention is proposed: ventilation, filtration, scheduling, occupancy, maintenance or another response.</p><span>PROPOSES A CONSEQUENCE</span></article>
      <article><b>AUTHORIZATION</b><p>The responsible domain establishes who may approve that exact action, for which asset, under which conditions, and for how long.</p><span>ESTABLISHES PRESENT ELIGIBILITY</span></article>
      <article><b>EXECUTION</b><p>The bounded intervention is committed and carried out.</p><span>CHANGES REALITY</span></article>
      <article><b>OUTCOME</b><p>The resulting environmental condition is measured, preserved and compared to the intended result.</p><span>CREATES THE NEXT RECORD</span></article>
    </div>
  </section>

  <section className="world">
    <p className="eye">05 · WHY TA-14 IS BRINGING THIS QUESTION GLOBALLY</p>
    <h2>This showroom is one room in a much larger public examination environment.</h2>
    <p className="intro">TA-14 currently maintains 20 public country and institutional showroom surfaces on the Exchange, with states deliberately separated into outreach, referral, technical response, meeting, examination and other earned conditions. The public index includes active or preserved work involving jurisdictions such as Guatemala, Uzbekistan, Singapore, Bosnia and Herzegovina, Georgia, Ukraine, Thailand, the United Arab Emirates, the Czech Republic, France and others.</p>
    <div className="worldgrid">
      <article><strong>20</strong><b>PUBLIC COUNTRY / INSTITUTIONAL SURFACES</b><p>The visible Exchange index as of September 25, 2026. Broader outreach is not converted into a public “engagement” count unless the record supports it.</p></article>
      <article><strong>NIST</strong><b>MEETING SCHEDULED · SEPT 30</b><p>TA-14 has a scheduled technical conversation with NIST personnel concerning the pre-execution authority boundary in AI-optimized building controls. This does not imply NIST endorsement or adoption.</p></article>
      <article><strong>GLOBAL</strong><b>LOCAL AUTHORITY REMAINS LOCAL</b><p>TA-14’s federation rule is intentionally conservative: authority context may cross independent domains; execution authority must be established locally.</p></article>
    </div>
    <div className="boundary"><b>RECORD DISCIPLINE</b><p>This page does not state that The Safer Air Project, the Global Commission, RESET, NIST, any government, or any other institution has adopted, endorsed, certified or partnered with TA-14. It identifies public work, preserved correspondence or scheduled technical engagement only where the record establishes it.</p></div>
  </section>

  <section>
    <p className="eye">06 · THE COLLABORATION QUESTION</p>
    <h2>What could be examined together?</h2>
    <p className="intro">Before discussing sponsorship, promotion or formal partnership, TA-14 would rather test whether there is a useful technical seam. The proposed starting point is deliberately narrow and corrigible.</p>
    <div className="steps">
      <article><span>01</span><b>SELECT ONE REAL IAQ PATHWAY</b><p>For example: a publicly visible condition, an RSAAI representation, or a performance-standard scenario.</p></article>
      <article><span>02</span><b>NAME THE PROPOSED CONSEQUENCE</b><p>What would someone actually do because of the evidence?</p></article>
      <article><span>03</span><b>MAP WHO OWNS EACH DECISION</b><p>Keep Safer Air, building owner, operator, regulator, clinician, vendor and other roles separate rather than collapsing them.</p></article>
      <article><span>04</span><b>TEST THE BOUNDARY</b><p>Ask what evidence, authority, standing and binding must be true before the consequence can cross into reality.</p></article>
      <article><span>05</span><b>PRESERVE THE RESULT</b><p>If TA-14 adds nothing, say so. If a seam is found, define it precisely and keep both architectures independently owned.</p></article>
    </div>
  </section>

  <section className="invitation">
    <p className="eye">OPEN INVITATION FOR CORRECTION</p>
    <h2>Plum — if we have represented your work incorrectly, tell us.</h2>
    <p>TA-14 built this surface before asking The Safer Air Project to adopt anything. The purpose is to make the proposed boundary visible enough to correct. If the distinction is useful, we would welcome a technical conversation about one bounded example and let the evidence determine whether there is something worth doing together.</p>
    <div className="ctas">
      <a href="https://www.saferairproject.com/safer-shared-air-indoor-air-health-and-productivity-conference-2026" target="_blank" rel="noreferrer">SAFER SHARED AIR 2026 ↗</a>
      <Link href="/environmental-integrity-governance">TA-14 ENVIRONMENTAL INTEGRITY →</Link>
      <Link href="/global-institutional-engagement/showrooms">GLOBAL SHOWROOM INDEX →</Link>
    </div>
  </section>

  <section className="sources">
    <p className="eye">PUBLIC SOURCES & RELATED SURFACES</p>
    <div>{sources.map(([t,h])=>h.startsWith('/')?<Link key={h} href={h}>{t}<span>→</span></Link>:<a key={h} href={h} target="_blank" rel="noreferrer">{t}<span>↗</span></a>)}</div>
  </section>

  <div className="chain">{chain.map((x,i)=><div key={x}><small>{String(i+1).padStart(2,'0')}</small><b>{x}</b></div>)}</div>

  <footer>TA-14 AUTHORITY · THE SAFER AIR PROJECT × TA-14 · PUBLIC TECHNICAL SHOWROOM<br/>OPEN FOR CORRECTION · NO ENDORSEMENT, ADOPTION, PARTNERSHIP OR EXECUTION AUTHORITY IMPLIED</footer>
</div>
<style>{`
*{box-sizing:border-box}.p{min-height:100vh;background:radial-gradient(circle at 9% 0%,rgba(65,206,255,.16),transparent 28%),radial-gradient(circle at 91% 3%,rgba(127,229,203,.12),transparent 26%),linear-gradient(180deg,#02070c,#06131a 48%,#02070c);color:#edf6f8;font-family:Inter,Arial,sans-serif}.shell{width:min(1220px,calc(100% - 38px));margin:auto}
nav{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid #ffffff14}nav a{color:#cfe1e8;text-decoration:none;font-size:9px;font-weight:900;letter-spacing:.1em}.brand{font-size:17px!important}.brand span,.eye{color:#76ddff}
header{padding:82px 0 66px}.status{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:40px}.status b,.status span{padding:8px 10px;border:1px solid #ffffff18;border-radius:999px;font-size:8px}.status b{color:#7fe5cb;border-color:#7fe5cb44}h1{max-width:1120px;margin:15px 0 25px;font:clamp(56px,8vw,104px) Georgia,serif;line-height:.92;letter-spacing:-.055em}h1 em,h2 em{font-style:normal;color:#7fe5cb}.lead,.intro{max-width:980px;color:#a9bec7;font-size:17px;line-height:1.75}.question{margin-top:34px;padding:28px;border:1px solid #f0c86c44;border-radius:20px;background:linear-gradient(135deg,#241b081f,#07141b)}.question small{display:block;color:#f0c86c;font-size:9px;font-weight:950;letter-spacing:.16em}.question strong{display:block;margin-top:13px;max-width:1050px;font:clamp(24px,3.2vw,40px) Georgia,serif;line-height:1.28}.question em{color:#7fe5cb;font-style:normal}.question u{text-decoration:none;color:#f0c86c}
section{padding:72px 0;border-top:1px solid #ffffff12}h2{max-width:1050px;margin:9px 0 18px;font:clamp(38px,5.4vw,66px) Georgia,serif;line-height:1.02;letter-spacing:-.03em}.eye{font-size:9px!important;font-weight:950;letter-spacing:.18em}.cards{display:grid;gap:13px;margin-top:30px}.four{grid-template-columns:repeat(4,1fr)}.cards article,.matrix article,.steps article{padding:24px;border:1px solid #ffffff16;border-radius:16px;background:#051219}.cards span,.steps span{display:block;color:#76ddff;font-size:9px;font-weight:950}.cards b,.matrix b,.steps b{display:block;margin:12px 0;color:#dcecf2;font-size:11px}.cards p,.matrix p,.steps p{color:#8fa6b0;font-size:12px;line-height:1.65}
.band{margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding-left:max(19px,calc((100vw - 1220px)/2));padding-right:max(19px,calc((100vw - 1220px)/2));background:linear-gradient(90deg,#04131a,#071b22,#04131a)}.bridge{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;align-items:stretch;margin-top:32px}.bridge>div{padding:22px;border:1px solid #ffffff16;border-radius:15px;background:#041017}.bridge>i{display:none}.bridge small{color:#76ddff;font-size:8px;font-weight:950}.bridge b{display:block;margin:10px 0;font:20px Georgia,serif}.bridge p{color:#8ba3ad;font-size:11px;line-height:1.55}.bridge .hot{border-color:#f0c86c55;background:#2a200a33}.bridge .hot small{color:#f0c86c}
.compare{display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:stretch;margin-top:34px}.compare>div:not(.plus){padding:30px;border:1px solid #ffffff18;border-radius:20px;background:#051219}.compare .ta{border-color:#7fe5cb55!important;background:#08211d66!important}.compare small{color:#76ddff;font-size:8px;font-weight:950;letter-spacing:.13em}.compare h3{font:28px Georgia,serif}.compare ul{margin:22px 0 0;padding-left:18px;color:#9db3bc;line-height:1.9;font-size:13px}.plus{align-self:center;color:#f0c86c;font-size:34px}.notreplace,.boundary{margin-top:24px;padding:22px;border-left:3px solid #f0c86c;background:#f0c86c0c}.notreplace b,.boundary b{color:#f0c86c;font-size:9px;letter-spacing:.14em}.notreplace p,.boundary p{color:#9fb3bc;line-height:1.7;font-size:12px}
.matrix{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:30px}.matrix article span{display:block;margin-top:16px;color:#7fe5cb;font-size:8px;font-weight:950}
.worldgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:30px}.worldgrid article{padding:27px;border:1px solid #76ddff22;border-radius:18px;background:#06131b}.worldgrid strong{display:block;font:42px Georgia,serif;color:#76ddff}.worldgrid b{display:block;margin:10px 0;color:#dcecf2;font-size:10px}.worldgrid p{color:#8fa6b0;font-size:12px;line-height:1.65}.steps{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:30px}
.invitation{padding-bottom:78px}.invitation>p:not(.eye){max-width:980px;color:#a9bec7;line-height:1.75}.ctas{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}.ctas a{padding:13px 15px;border:1px solid #76ddff44;border-radius:9px;color:#dff8ff;text-decoration:none;font-size:9px;font-weight:950}.sources>div{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:25px}.sources a{display:flex;justify-content:space-between;gap:20px;padding:16px 18px;border:1px solid #ffffff14;border-radius:10px;color:#cfe1e8;text-decoration:none;font-size:11px}.sources a span{color:#76ddff}
.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:7px;padding:34px 0 64px;border-top:1px solid #ffffff12}.chain div{padding:15px 8px;border:1px solid #7fe5cb26;border-radius:9px;text-align:center}.chain small{display:block;color:#55747d;font-size:7px}.chain b{display:block;margin-top:6px;color:#9ddfcf;font-size:8px}footer{padding:35px 0 70px;border-top:1px solid #ffffff12;color:#637d87;font-size:9px;line-height:1.8}
@media(max-width:960px){.four,.bridge,.matrix,.worldgrid{grid-template-columns:repeat(2,1fr)}.steps{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){nav{padding:18px 0;flex-wrap:wrap}.four,.bridge,.matrix,.worldgrid,.steps,.compare,.sources>div{grid-template-columns:1fr}.plus{text-align:center}.chain{grid-template-columns:repeat(2,1fr)}h1{font-size:clamp(48px,15vw,76px)}}
`}</style>
</main>}