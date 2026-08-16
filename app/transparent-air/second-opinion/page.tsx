import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AC Second Opinion in Pinellas County, FL | Transparent Air',
  description:
    'Unsure about an AC diagnosis or expensive repair recommendation? Transparent Air offers second-opinion air-conditioning evaluations in Gulfport, South St. Pete, Seminole and Pinellas Park.',
  robots: { index: true, follow: true },
};

const PHONE_DISPLAY = 'CALL TRANSPARENT AIR';
const PHONE_HREF = 'tel:REPLACE_WITH_PHONE';

const serviceAreas = ['Gulfport', 'South St. Pete', 'Seminole', 'Pinellas Park'];

const reasons = [
  'A major repair was recommended.',
  'You were told the system should be replaced.',
  'The diagnosis was not clearly explained.',
  'You have paid for repairs but the same problem remains.',
  'You were given a compressor, refrigerant, electrical, or airflow diagnosis and want another opinion.',
  'You simply want more confidence before spending the money.',
];

const credentials = [
  'Founder of TA-14 Academy',
  'Founder of the TA-14 AI Governance Institute',
  'Author of 29 published books',
  'Teaches air-conditioning diagnostics and service methodology',
  'Developed the Transparent Air evidence-before-intervention service discipline',
  'Personally performs Transparent Air second-opinion evaluations',
];

export default function TransparentAirSecondOpinionPage() {
  return (
    <main style={{ background: '#f7fbfc', color: '#102f3d', minHeight: '100vh' }}>
      <style>{`
        .ta-wrap{width:min(1160px,92vw);margin:0 auto}.ta-hero{padding:78px 0 66px;background:radial-gradient(circle at 80% 0%,rgba(15,145,154,.18),transparent 35%),linear-gradient(135deg,#061f2c,#0b3949 65%,#0c5360);color:white}.ta-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:46px;align-items:center}.ta-eyebrow{font-size:.78rem;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#7ee0df}.ta-h1{font-size:clamp(2.7rem,6vw,5.5rem);line-height:.98;letter-spacing:-.045em;margin:16px 0 24px;max-width:900px}.ta-lead{font-size:1.22rem;line-height:1.7;color:#e2f2f3;max-width:780px}.ta-btn{display:inline-flex;align-items:center;justify-content:center;padding:15px 22px;border-radius:8px;background:#e7ad45;color:#092734;text-decoration:none;font-weight:900;margin-top:14px}.ta-btn.secondary{background:#0e8790;color:white}.ta-card{background:white;color:#173846;border:1px solid #d9e7e9;border-radius:16px;padding:28px;box-shadow:0 18px 50px rgba(0,0,0,.12)}.ta-card h2,.ta-section h2{margin-top:0;color:#0a3444}.ta-list{padding:0;list-style:none}.ta-list li{padding:10px 0 10px 28px;position:relative;border-bottom:1px solid #e7eff0}.ta-list li:last-child{border:0}.ta-list li:before{content:'✓';position:absolute;left:0;color:#078993;font-weight:900}.ta-section{padding:70px 0;background:white}.ta-section.alt{background:#edf7f7}.ta-section.dark{background:#082a38;color:white}.ta-section.dark h2{color:white}.ta-section.dark p{color:#dcebed}.ta-columns{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.ta-step{background:white;color:#173846;border-radius:12px;padding:26px;border-top:4px solid #0c8b94}.ta-quote{font-size:clamp(1.5rem,3vw,2.25rem);font-weight:900;line-height:1.25;border-left:5px solid #e7ad45;padding-left:24px;margin:38px 0}.ta-proof{display:grid;grid-template-columns:.75fr 1.25fr;gap:42px;align-items:start}.ta-number{font-size:5rem;line-height:1;font-weight:950;color:#078993}.ta-area{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0}.ta-pill{padding:8px 12px;border:1px solid #bad7da;border-radius:999px;font-weight:800;background:white}.ta-center{text-align:center}.ta-small{font-size:.88rem;color:#58727c}.ta-footer{padding:38px 0;background:#041a24;color:#bcd0d5}.ta-academy{display:inline-block;margin-top:14px;color:#0b7380;font-weight:900}.ta-sticky{display:none}@media(max-width:800px){.ta-grid,.ta-proof,.ta-columns{grid-template-columns:1fr}.ta-hero{padding:50px 0}.ta-sticky{display:block;position:fixed;bottom:0;left:0;right:0;background:#061f2c;padding:10px;z-index:50;text-align:center}.ta-sticky .ta-btn{width:94%;margin:0}main{padding-bottom:72px}}
      `}</style>

      <header className="ta-hero">
        <div className="ta-wrap ta-grid">
          <div>
            <div className="ta-eyebrow">Transparent Air · AC Second Opinions · Pinellas County</div>
            <h1 className="ta-h1">Before You Pay for the Repair, Be Sure the Diagnosis Is Right.</h1>
            <p className="ta-lead">
              If you have been told your air conditioner needs an expensive repair—or needs to be replaced—and you are unsure about what you were told, call Transparent Air for a second opinion.
            </p>
            <p className="ta-lead"><strong>Greggory Don Butler personally comes out and evaluates your air-conditioning system.</strong></p>
            <a className="ta-btn" href={PHONE_HREF}>{PHONE_DISPLAY}</a>
            <div className="ta-area">{serviceAreas.map((area) => <span className="ta-pill" key={area}>{area}</span>)}</div>
          </div>
          <aside className="ta-card">
            <div className="ta-eyebrow" style={{ color: '#087f89' }}>Get another set of eyes on it</div>
            <h2>Not sure about the diagnosis?</h2>
            <ul className="ta-list">{reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
            <a className="ta-btn secondary" href={PHONE_HREF}>Get a Second Opinion</a>
          </aside>
        </div>
      </header>

      <section className="ta-section">
        <div className="ta-wrap">
          <div className="ta-eyebrow" style={{ color: '#087f89' }}>Why a second opinion matters</div>
          <h2>Florida Does Not Issue a State HVAC Journeyman License.</h2>
          <p>Florida licenses HVAC contractors at the state level, but it does not issue a state HVAC journeyman license to the individual service technician. The contractor's license alone therefore does not tell a homeowner what diagnostic standard the individual person at the door follows.</p>
          <p>There are excellent HVAC technicians in Florida. This page does not assume another technician or contractor is wrong. It makes a simpler point: when a diagnosis could cost hundreds or thousands of dollars, you should understand the evidence supporting the recommendation before authorizing the work.</p>
          <div className="ta-quote">You should not have to pay for the wrong repair because the diagnosis was wrong.</div>
        </div>
      </section>

      <section className="ta-section dark">
        <div className="ta-wrap">
          <div className="ta-eyebrow">The Transparent Air standard</div>
          <h2>An AC Second Opinion Built Around Evidence</h2>
          <div className="ta-columns">
            <article className="ta-step"><h3>1 · Establish the condition</h3><p>Start with what the system is actually doing and preserve a useful baseline before consequence-bearing intervention.</p></article>
            <article className="ta-step"><h3>2 · Make the determination</h3><p>Measurements, observations, operating sequence, and system evidence support the diagnostic determination—not guesswork.</p></article>
            <article className="ta-step"><h3>3 · Explain what follows</h3><p>You hear what the evidence supports before deciding what repair, further testing, or replacement decision should proceed.</p></article>
          </div>
        </div>
      </section>

      <section className="ta-section alt">
        <div className="ta-wrap ta-proof">
          <aside className="ta-card">
            <div className="ta-number">29</div>
            <h2>Published books</h2>
            <p>Greggory Don Butler's work extends beyond a service truck. His public record can be examined before you ever call Transparent Air.</p>
          </aside>
          <div>
            <div className="ta-eyebrow" style={{ color: '#087f89' }}>Who is Greggory Don Butler?</div>
            <h2>Don't Take Our Word for It. Google His Name.</h2>
            <p>If you are not familiar with Greggory Don Butler, search his name. Review his public work and decide for yourself who you want evaluating an expensive air-conditioning diagnosis.</p>
            <ul className="ta-list">{credentials.map((item) => <li key={item}>{item}</li>)}</ul>
            <p><strong>Your first diagnosis may have come from whoever was dispatched. Your Transparent Air second opinion comes from Greggory Don Butler.</strong></p>
          </div>
        </div>
      </section>

      <section className="ta-section">
        <div className="ta-wrap">
          <div className="ta-eyebrow" style={{ color: '#087f89' }}>What happens when you call</div>
          <h2>A Straightforward Second-Opinion Visit</h2>
          <div className="ta-columns">
            <article><h3>Tell us what you were told.</h3><p>Share the complaint, diagnosis, estimate, and proposed repair or replacement recommendation.</p></article>
            <article><h3>Greggory evaluates the system.</h3><p>The equipment is evaluated using Transparent Air's documented evidence-before-intervention diagnostic discipline.</p></article>
            <article><h3>You get a clear explanation.</h3><p>You hear what the evidence supports so you can make a more informed decision about what happens next.</p></article>
          </div>
        </div>
      </section>

      <section className="ta-section alt">
        <div className="ta-wrap">
          <div className="ta-eyebrow" style={{ color: '#087f89' }}>TA-14 applied to HVAC</div>
          <h2>Want to Understand the Standard Behind the Service?</h2>
          <p>Transparent Air's service discipline is connected to the deeper TA-14 work on evidence, admissibility, intervention, execution, and outcome. Homeowners do not need to enroll or sign in to use this second-opinion service.</p>
          <p>For visitors who want the educational foundation, the TA-14 Academy includes HVAC learning pathways that explain why baseline evidence, diagnostic determination, governed intervention, and post-intervention performance matter.</p>
          <Link className="ta-academy" href="/academy">Explore TA-14 Academy →</Link>
        </div>
      </section>

      <section className="ta-section ta-center">
        <div className="ta-wrap">
          <div className="ta-eyebrow" style={{ color: '#087f89' }}>Gulfport · South St. Pete · Seminole · Pinellas Park</div>
          <h2>Unsure About Your AC Diagnosis?</h2>
          <p style={{ fontSize: '1.2rem' }}>Before you authorize an expensive repair or replacement, get another set of eyes on the system.</p>
          <p><strong>Call Transparent Air and have Greggory Don Butler personally evaluate it.</strong></p>
          <a className="ta-btn" href={PHONE_HREF}>{PHONE_DISPLAY}</a>
        </div>
      </section>

      <footer className="ta-footer">
        <div className="ta-wrap">
          <strong>Transparent Air</strong><br />
          AC diagnostics and second opinions for selected Pinellas County service areas.
          <p className="ta-small" style={{ color: '#a9c0c6' }}>TA-14 is a diagnostic/governance methodology and is not an occupational license or government certification. Local service availability, pricing, contractor/license information, and the telephone number should be verified and inserted before public promotion.</p>
        </div>
      </footer>

      <div className="ta-sticky"><a className="ta-btn" href={PHONE_HREF}>Call Transparent Air</a></div>
    </main>
  );
}
