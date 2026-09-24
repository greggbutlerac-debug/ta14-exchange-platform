import Link from 'next/link';
import ResponderConnectionLab from './ResponderConnectionLab';

export const metadata = {
  title: 'Responder Connection Boundary | CNS/CP × TA-14',
  description: 'Interactive public technical showroom separating building meaning, fixed Connection Profiles, dynamic connection policy, federation context and local execution authority.',
};

const layers = [
  ['01','BUILDING / GRAPH','ONUMA · RE1 · ASHRAE 223','Persistent identity, semantics, topology and APIs establish what the building objects are and how they relate.'],
  ['02','INTERACTION CONTRACT','CNS/CP','Fixed, named Profiles define a reusable interaction between independently operated parties.'],
  ['03','CONNECTION POLICY','CNS/CP ORCHESTRATION','The situation determines which connection is established under which Profile, for whom, for how long, and when it is revoked.'],
  ['04','FEDERATION CONTEXT','AFA + AVP','Authority context may cross between independent domains without becoming local execution authority merely because it traveled.'],
  ['05','LOCAL COMMIT','EABA + TA-14','The receiving domain independently determines whether this exact proposed consequence may become reality now.'],
];

export default function Page(){
  return <main className="p"><div className="s">
    <nav>
      <Link className="brand" href="/"><b>TA-14</b> AUTHORITY</Link>
      <Link href="/global-institutional-engagement/fire-chief-electrical-shutoff">FIRE-CHIEF SHUTOFF SANDBOX</Link>
      <Link href="/registry/ta-14-admissible-execution-architecture/showcase/owner-to-consequence-collaboration">OWNER → CONSEQUENCE</Link>
    </nav>

    <header>
      <div className="flags"><span>CONNECTION</span><i>×</i><span>CONSEQUENCE</span></div>
      <p className="eye">CNS/CP × ONUMA × TA-14 · PUBLIC TECHNICAL SHOWROOM</p>
      <h1>The connection can be valid.<br/><em>The command can still be HOLD.</em></h1>
      <p className="lead">A responder may be correctly identified. The building graph may be correct. A Connection Profile may be valid. A connection may be properly established. And the receiving system can still require a separate local determination before a physical consequence executes.</p>
      <div className="heroRule"><small>THE WHOLE SEAM IN ONE LINE</small><b>Graph establishes meaning → Profile establishes the interaction contract → connection policy establishes who is connected now → federation carries context → TA-14 governs whether this consequence may execute here, now.</b></div>
    </header>

    <section>
      <p className="eye">WHAT ANTO'S RESPONSE CHANGED</p>
      <h2>Start from the interaction — not from the building object.</h2>
      <div className="two">
        <article><b>NOT ENOUGH</b><h3>“There is an AHU, therefore there must be an AHU Profile.”</h3><p>A building graph can expose the correct object, semantics and API without establishing a governed interaction between two independent parties.</p></article>
        <article><b>THE BETTER START</b><h3>“What does the responder need to do?”</h3><p>READ and COMMAND are different interactions. They can be represented as separate fixed Profiles, while emergency conditions change the connections established under them.</p></article>
      </div>
    </section>

    <section>
      <p className="eye">THE FIVE LAYERS</p>
      <h2>Nobody has to become somebody else.</h2>
      <div className="layers">{layers.map(([n,k,a,d])=><article key={n}><span>{n}</span><small>{k}</small><h3>{a}</h3><p>{d}</p></article>)}</div>
    </section>

    <section className="profiles">
      <p className="eye">TWO FIXED PROFILES · ONE DYNAMIC SITUATION</p>
      <h2>The emergency changes the connection policy. <em>Not the Profile.</em></h2>
      <div className="profileGrid">
        <article><div className="profileTag">PROFILE 01</div><h3>RESPONDER READ</h3><p>Defines the reusable interaction for reading the bounded building state a responder is permitted to inspect.</p><div className="fixed">FIXED CONTRACT SHAPE</div></article>
        <article><div className="profileTag">PROFILE 02</div><h3>RESPONDER COMMAND</h3><p>Defines the reusable interaction for proposing a bounded command into the independently operated receiving domain.</p><div className="fixed">FIXED CONTRACT SHAPE</div></article>
      </div>
      <div className="policy"><b>CONNECTION POLICY MOVES</b><p>Emergency declared → establish the appropriate connection under the appropriate Profile → bind the named parties, scope, duration and revocation conditions → revoke or narrow the connection when the declaration or operational need changes.</p></div>
    </section>

    <ResponderConnectionLab />

    <section>
      <p className="eye">THE HANDOFF TO TA-14</p>
      <h2>A COMMAND connection does not silently become execution authority.</h2>
      <div className="handoffFlow">
        <div><b>01</b><span>PROFILE VALID</span><p>The responder-command interaction is a recognized contract.</p></div><i>→</i>
        <div><b>02</b><span>CONNECTION ESTABLISHED</span><p>This responder is connected under that Profile in this context.</p></div><i>→</i>
        <div><b>03</b><span>AUTHORITY CONTEXT CROSSES</span><p>AFA / AVP may carry bounded authority context across the independent-domain boundary.</p></div><i>→</i>
        <div className="hot"><b>04</b><span>LOCAL COMMIT</span><p>TA-14 asks whether this exact consequence has sufficient Admissible Evidence, Applicable Authority and Established Standing to become reality NOW.</p></div>
      </div>
    </section>

    <section>
      <p className="eye">WHAT EACH ARCHITECTURE IS ALLOWED TO SAY</p>
      <h2>Clear seams prevent accidental authority inheritance.</h2>
      <div className="matrix">
        <article><b>GRAPH</b><p>“I know what this object is and how it relates.”</p><strong>Does not say:</strong><p>“This party may command it.”</p></article>
        <article><b>CNS/CP</b><p>“These parties have this governed interaction under this Profile.”</p><strong>Does not say:</strong><p>“This exact consequence is locally authorized now.”</p></article>
        <article><b>AFA / AVP</b><p>“This authority context may cross and remain attributable.”</p><strong>Does not say:</strong><p>“Transported context is local execution authority.”</p></article>
        <article><b>EABA / TA-14</b><p>“This exact consequence may or may not cross the local commit boundary now.”</p><strong>Does not replace:</strong><p>The graph, Profile, connection policy, identity system or actuator.</p></article>
      </div>
    </section>

    <section>
      <p className="eye">PROPOSED FIRST BOUNDED EXAMINATION</p>
      <h2>Name the interactions. Freeze them. Then change the situation.</h2>
      <div className="freezeGrid">
        <article><b>FREEZE 01</b><h3>Responder Read Profile</h3><p>Named parties · readable scope · purpose · duration model · revocation model · required building references.</p></article>
        <article><b>FREEZE 02</b><h3>Responder Command Profile</h3><p>Named parties · command scope · purpose · duration model · revocation model · exact objects the request may address.</p></article>
        <article><b>RUN</b><h3>Emergency declaration changes</h3><p>Establish, narrow or revoke connections without rewriting the Profiles.</p></article>
        <article><b>TEST</b><h3>Command reaches commit boundary</h3><p>Observe whether TA-14 can independently ALLOW, HOLD, DENY or ESCALATE without CNS/CP being asked to make the execution decision.</p></article>
      </div>
    </section>

    <section className="boundary"><b>PUBLIC-RECORD BOUNDARY</b><p>This showroom records a proposed technical examination derived from the ongoing Monday Live / ONUMA / CNS/CP / TA-14 discussion. It is not a claim that Padi, CNS/CP, ONUMA, ALN, NIST, ASHRAE, any responder, or any public authority endorses or has adopted TA-14. The emergency-responder scenario is an examination surface, not operational emergency guidance.</p></section>

    <footer>TA-14 AUTHORITY · CNS/CP × RESPONDER CONNECTION BOUNDARY<br/>LINKING IS NOT CONNECTING · CONNECTING IS NOT AUTHORITY TO EXECUTE · UNDERSTANDING IS NOT PERMISSION</footer>
  </div><style>{'.p{min-height:100vh;background:radial-gradient(circle at 10% 0%,rgba(84,203,255,.16),transparent 30%),radial-gradient(circle at 88% 18%,rgba(163,111,255,.12),transparent 25%),linear-gradient(180deg,#02070c,#06111a 44%,#02070c);color:#eef7fb;font-family:Inter,Arial,sans-serif}.p *{box-sizing:border-box}.s{max-width:1220px;margin:auto;padding:0 28px}nav{height:78px;display:flex;align-items:center;gap:24px;border-bottom:1px solid #ffffff17;font-size:10px;letter-spacing:.12em;font-weight:850}nav a{color:#9fb4c1;text-decoration:none}.brand{margin-right:auto;font-size:15px!important}.brand b,.eye{color:#74dfff}header{padding:82px 0 68px}.flags{display:flex;align-items:center;gap:16px;font-size:11px;font-weight:950;letter-spacing:.2em;color:#9cb5c2}.flags i{font-style:normal;color:#ffd35f;font:38px Georgia,serif}.eye{font-size:10px;font-weight:950;letter-spacing:.18em;margin-top:18px}h1{font-size:clamp(48px,7vw,88px);line-height:.96;letter-spacing:-.055em;margin:16px 0 24px}h1 em,h2 em{font-style:normal;color:#ffd35f}.lead{max-width:1000px;font-size:clamp(18px,2vw,24px);line-height:1.62;color:#b6c8d2}.heroRule{margin-top:30px;padding:24px;border-left:4px solid #ffd35f;background:#ffd35f0c}.heroRule small{display:block;color:#ffd35f;font-size:9px;font-weight:950;letter-spacing:.16em}.heroRule b{display:block;margin-top:10px;font-size:clamp(18px,2vw,24px);line-height:1.5}section{padding:66px 0;border-top:1px solid #ffffff12}h2{font-size:clamp(32px,4.8vw,58px);line-height:1.03;letter-spacing:-.045em;max-width:1000px;margin:12px 0 26px}.two,.profileGrid,.freezeGrid,.matrix{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.two article,.profileGrid article,.freezeGrid article,.matrix article{padding:24px;border:1px solid #ffffff17;border-radius:17px;background:#07151f}.two b,.profileTag,.freezeGrid b,.matrix b{color:#74dfff;font-size:10px;font-weight:950;letter-spacing:.12em}.two h3,.profileGrid h3,.freezeGrid h3{font-size:22px;margin:10px 0}.two p,.profileGrid p,.freezeGrid p,.matrix p{color:#a8bac4;line-height:1.65}.layers{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.layers article{padding:20px;border:1px solid #ffffff14;border-radius:15px;background:#07151f}.layers span{display:block;color:#ffd35f;font:28px Georgia,serif}.layers small{display:block;margin-top:14px;color:#8299a7;font-size:9px;font-weight:950;letter-spacing:.1em}.layers h3{font-size:16px;margin:7px 0}.layers p{color:#a9bac4;font-size:13px;line-height:1.58}.profiles{background:linear-gradient(135deg,#ffffff03,#74dfff08);margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding-left:max(28px,calc((100vw - 1164px)/2));padding-right:max(28px,calc((100vw - 1164px)/2))}.profileGrid article{border-color:#74dfff35}.fixed{display:inline-block;margin-top:12px;padding:7px 9px;border-radius:999px;border:1px solid #74dfff44;color:#98e8ff;font-size:9px;font-weight:950}.policy{margin-top:14px;padding:22px;border:1px solid #ffd35f40;border-radius:15px;background:#ffd35f09}.policy b{color:#ffd35f;font-size:10px;letter-spacing:.12em}.policy p{margin-bottom:0;color:#d1c9ab;line-height:1.65}.handoffFlow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1.2fr;gap:10px;align-items:stretch}.handoffFlow>div{padding:20px;border:1px solid #ffffff16;border-radius:15px;background:#07151f}.handoffFlow>i{align-self:center;color:#5f7e8d;font-style:normal}.handoffFlow b{display:block;color:#ffd35f;font:24px Georgia,serif}.handoffFlow span{display:block;margin-top:10px;color:#9feaff;font-size:9px;font-weight:950;letter-spacing:.1em}.handoffFlow p{color:#a8bac4;font-size:12px;line-height:1.55}.handoffFlow .hot{border:2px solid #ffd35f75;background:#ffd35f0a}.matrix{grid-template-columns:repeat(4,1fr)}.matrix article strong{display:block;margin-top:14px;color:#ffd35f;font-size:9px;letter-spacing:.1em}.freezeGrid{grid-template-columns:repeat(4,1fr)}.freezeGrid article{border-color:#9b77ff30}.boundary{padding:26px;margin:58px 0 0;border:1px solid #8c6b32;background:#15150f;border-radius:16px}.boundary>b{color:#ffd35f;font-size:10px;letter-spacing:.12em}.boundary p{color:#c9c3b5;line-height:1.65}footer{padding:50px 0 72px;color:#6f8794;font-size:10px;letter-spacing:.12em;line-height:1.8}@media(max-width:980px){.layers{grid-template-columns:1fr 1fr}.matrix,.freezeGrid{grid-template-columns:1fr 1fr}.handoffFlow{grid-template-columns:1fr}.handoffFlow>i{text-align:center;transform:rotate(90deg)}}@media(max-width:680px){.s{padding:0 18px}nav{height:auto;padding:18px 0;flex-wrap:wrap}.two,.profileGrid,.matrix,.freezeGrid,.layers{grid-template-columns:1fr}h1{letter-spacing:-.02em}}'}</style></main>
}
