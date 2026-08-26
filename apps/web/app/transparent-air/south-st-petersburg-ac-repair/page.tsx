import type { Metadata } from 'next';
import Link from 'next/link';

const PRIMARY_PHONE_DISPLAY = '386-337-7215';
const PRIMARY_PHONE_HREF = 'tel:+13863377215';
const SECONDARY_PHONE_DISPLAY = '386-479-0435';
const SECONDARY_PHONE_HREF = 'tel:+13864790435';
const PAGE_URL = 'https://www.ta14exchange.com/transparent-air/south-st-petersburg-ac-repair';

export const metadata: Metadata = {
  title: 'AC Repair South St Petersburg FL | AC Second Opinions',
  description:
    'Need AC repair in South St. Petersburg, Florida, or want a second opinion before an expensive repair or replacement? Transparent Air provides evidence-based AC diagnostics personally performed by Greggory Don Butler.',
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'AC Repair & Second Opinions in South St. Petersburg, FL | Transparent Air',
    description:
      'Before authorizing an expensive AC repair or replacement in South St. Petersburg, get an evidence-based second opinion from Transparent Air.',
    url: PAGE_URL,
    type: 'website',
  },
};

const symptoms = [
  'AC running but the house is not cooling',
  'Warm air coming from the vents',
  'System starts and stops repeatedly',
  'Outdoor unit or compressor will not run',
  'Frozen coil or refrigerant-side concern',
  'Water around the air handler or drain issue',
  'Electrical, capacitor, motor, airflow, or thermostat concern',
  'A major repair or full-system replacement was recommended',
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Transparent Air South St. Petersburg AC Repair and Second Opinion Service',
  serviceType: 'Air conditioning diagnostic, repair evaluation, and second opinion',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Transparent Air',
    telephone: '+1-386-337-7215',
    url: PAGE_URL,
  },
  areaServed: { '@type': 'City', name: 'St. Petersburg', addressRegion: 'FL' },
  url: PAGE_URL,
};

export default function SouthStPetersburgACRepairPage() {
  return (
    <main style={{ background: '#f6fafb', color: '#123542', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        .sp-wrap{width:min(1160px,92vw);margin:auto}.sp-hero{padding:76px 0;background:radial-gradient(circle at 82% 12%,rgba(31,166,173,.2),transparent 31%),linear-gradient(135deg,#061f2b,#0a4050 70%,#096773);color:#fff}.sp-grid{display:grid;grid-template-columns:1.18fr .82fr;gap:44px;align-items:center}.sp-eye{font-size:.78rem;font-weight:900;letter-spacing:.15em;text-transform:uppercase;color:#82e1df}.sp-h1{font-size:clamp(2.7rem,6vw,5.4rem);line-height:.98;letter-spacing:-.045em;margin:15px 0 22px}.sp-lead{font-size:1.2rem;line-height:1.7;color:#e4f3f4}.sp-card{background:#fff;color:#143945;border-radius:16px;padding:28px;box-shadow:0 20px 55px rgba(0,0,0,.16)}.sp-btn{display:inline-flex;padding:15px 21px;border-radius:8px;background:#e7ad45;color:#082934;text-decoration:none;font-weight:900;margin-top:12px}.sp-btn.teal{background:#087f89;color:#fff}.sp-alt{display:inline-flex;padding:14px 19px;border:1px solid rgba(255,255,255,.45);border-radius:8px;color:#fff;text-decoration:none;font-weight:900;margin:12px 0 0 8px}.sp-section{padding:68px 0;background:#fff}.sp-section.alt{background:#edf7f7}.sp-section.dark{background:#082c3a;color:#e2eff1}.sp-section h2{font-size:clamp(2rem,4vw,3.2rem);line-height:1.08;color:#0a3948;margin:10px 0 22px}.sp-section.dark h2{color:#fff}.sp-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.sp-box{background:#fff;color:#173a46;border-radius:12px;padding:25px;border-top:4px solid #0b8b94}.sp-list{padding:0;list-style:none}.sp-list li{position:relative;padding:10px 0 10px 27px;border-bottom:1px solid #e4edef}.sp-list li:before{content:'✓';position:absolute;left:0;color:#078993;font-weight:900}.sp-list li:last-child{border:0}.sp-callout{font-size:clamp(1.5rem,3vw,2.15rem);font-weight:900;line-height:1.28;border-left:5px solid #e7ad45;padding-left:22px;margin:34px 0}.sp-link{color:#087985;font-weight:900}.sp-center{text-align:center}.sp-footer{background:#041a24;color:#bfd2d6;padding:38px 0}.sp-sticky{display:none}@media(max-width:800px){.sp-grid,.sp-cols{grid-template-columns:1fr}.sp-hero{padding:48px 0}.sp-alt{margin-left:0}.sp-sticky{display:block;position:fixed;bottom:0;left:0;right:0;background:#061f2b;padding:10px;text-align:center;z-index:50}.sp-sticky .sp-btn{width:94%;justify-content:center;margin:0}main{padding-bottom:70px}}
      `}</style>

      <header className="sp-hero">
        <div className="sp-wrap sp-grid">
          <div>
            <div className="sp-eye">Transparent Air · South St. Petersburg, Florida</div>
            <h1 className="sp-h1">AC Repair in South St. Petersburg Starts With Getting the Diagnosis Right.</h1>
            <p className="sp-lead">When your South St. Petersburg home is hot, the goal is not simply to replace the first part someone suspects. Transparent Air starts by establishing what the system is actually doing before recommending the next intervention.</p>
            <p className="sp-lead"><strong>If another company already recommended an expensive repair or replacement, Greggory Don Butler personally provides Transparent Air second-opinion evaluations.</strong></p>
            <a className="sp-btn" href={PRIMARY_PHONE_HREF}>Call {PRIMARY_PHONE_DISPLAY}</a>
            <a className="sp-alt" href={SECONDARY_PHONE_HREF}>Or {SECONDARY_PHONE_DISPLAY}</a>
          </div>
          <aside className="sp-card">
            <div className="sp-eye" style={{ color: '#087f89' }}>South St. Petersburg AC help</div>
            <h2>Is your AC not cooling?</h2>
            <ul className="sp-list">{symptoms.slice(0, 6).map((x) => <li key={x}>{x}</li>)}</ul>
            <a className="sp-btn teal" href={PRIMARY_PHONE_HREF}>Call Transparent Air</a>
          </aside>
        </div>
      </header>

      <section className="sp-section">
        <div className="sp-wrap">
          <div className="sp-eye" style={{ color: '#087f89' }}>Evidence before expense</div>
          <h2>Before Replacing Parts, Establish What the System Is Actually Doing.</h2>
          <p>Air-conditioning symptoms overlap. Poor airflow, control faults, electrical problems, drainage conditions, failed components, refrigerant-side conditions, and thermostat issues can produce similar complaints while requiring very different corrections.</p>
          <p>Transparent Air approaches the service call around a simple discipline: establish the condition, evaluate operating evidence, make the diagnostic determination, explain what that evidence supports, and only then determine what intervention should follow.</p>
          <div className="sp-callout">The goal is not to sell the biggest repair. The goal is to identify the condition that actually needs to be corrected.</div>
        </div>
      </section>

      <section className="sp-section dark">
        <div className="sp-wrap">
          <div className="sp-eye">When another company has already been out</div>
          <h2>South St. Petersburg AC Second Opinions</h2>
          <div className="sp-cols">
            <article className="sp-box"><h3>Expensive repair?</h3><p>If the recommendation is costly and you are uncertain about the diagnosis, another evidence-based evaluation can help before you authorize the work.</p></article>
            <article className="sp-box"><h3>Told you need a new system?</h3><p>A replacement recommendation is consequential. Transparent Air can evaluate the existing equipment before you decide whether replacement is justified.</p></article>
            <article className="sp-box"><h3>Repair did not solve it?</h3><p>If work was already performed and the original problem remains, the next evaluation should begin with the present condition rather than another assumption.</p></article>
          </div>
          <p><Link className="sp-link" style={{ color: '#8be0df' }} href="/transparent-air/second-opinion">Read about Transparent Air's full AC Second Opinion service →</Link></p>
        </div>
      </section>

      <section className="sp-section alt">
        <div className="sp-wrap sp-grid">
          <div>
            <div className="sp-eye" style={{ color: '#087f89' }}>Why Transparent Air?</div>
            <h2>Greggory Don Butler Personally Evaluates the System.</h2>
            <p>Transparent Air's second-opinion service is intentionally personal. Greggory Don Butler is an HVAC educator and author whose service methodology emphasizes baseline evidence, diagnostic determination, intervention discipline, and post-intervention performance.</p>
            <p><strong>You can examine his public work before deciding who you want evaluating an expensive air-conditioning diagnosis.</strong></p>
          </div>
          <aside className="sp-card">
            <div className="sp-eye" style={{ color: '#087f89' }}>Common reasons to call</div>
            <ul className="sp-list">{symptoms.map((x) => <li key={x}>{x}</li>)}</ul>
          </aside>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-wrap">
          <div className="sp-eye" style={{ color: '#087f89' }}>Related local service</div>
          <h2>Need Help in Another Nearby Area?</h2>
          <p><Link className="sp-link" href="/transparent-air/gulfport-ac-repair">Gulfport AC Repair & Second Opinions →</Link></p>
          <p><Link className="sp-link" href="/transparent-air/seminole-ac-repair">Seminole AC Repair & Second Opinions →</Link></p>
          <p><Link className="sp-link" href="/transparent-air/pinellas-park-ac-repair">Pinellas Park AC Repair & Second Opinions →</Link></p>
          <p><Link className="sp-link" href="/transparent-air/second-opinion">Pinellas County AC Second Opinion Service →</Link></p>
        </div>
      </section>

      <section className="sp-section alt sp-center">
        <div className="sp-wrap">
          <div className="sp-eye" style={{ color: '#087f89' }}>Transparent Air · South St. Petersburg AC service</div>
          <h2>Hot House? Expensive Estimate? Unsure About the Diagnosis?</h2>
          <p style={{ fontSize: '1.2rem' }}>Call Transparent Air. If a second opinion is what you need, Greggory Don Butler personally evaluates the system.</p>
          <a className="sp-btn" href={PRIMARY_PHONE_HREF}>Call {PRIMARY_PHONE_DISPLAY}</a>
          <a className="sp-alt" style={{ color: '#086b75', borderColor: '#afd0d3' }} href={SECONDARY_PHONE_HREF}>Or {SECONDARY_PHONE_DISPLAY}</a>
        </div>
      </section>

      <footer className="sp-footer">
        <div className="sp-wrap">
          <strong>Transparent Air</strong><br />
          Air-conditioning diagnostics, repair evaluation, and second opinions serving South St. Petersburg and selected Pinellas County areas.<br />
          <a style={{ color: '#fff' }} href={PRIMARY_PHONE_HREF}>{PRIMARY_PHONE_DISPLAY}</a> · <a style={{ color: '#fff' }} href={SECONDARY_PHONE_HREF}>{SECONDARY_PHONE_DISPLAY}</a>
          <p style={{ fontSize: '.85rem', color: '#9fb7bd' }}>TA-14 is a diagnostic/governance methodology and is not an occupational license or government certification. Service availability and applicable contractor/license information should be confirmed before scheduling.</p>
        </div>
      </footer>

      <div className="sp-sticky"><a className="sp-btn" href={PRIMARY_PHONE_HREF}>Call {PRIMARY_PHONE_DISPLAY}</a></div>
    </main>
  );
}
