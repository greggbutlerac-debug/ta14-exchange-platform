import type { Metadata } from 'next';
import Link from 'next/link';

const PAGE_URL = 'https://www.ta14exchange.com/transparent-air';
const PHONE_DISPLAY = '386-337-7215';
const PHONE_HREF = 'tel:+13863377215';
const GOOGLE_VERIFY_URL = 'https://www.google.com/search?q=Greggory+Don+Butler+HVAC&udm=50';

export const metadata: Metadata = {
  title: 'Transparent Air | AC Repair, Heat Pump Service & Second Opinions in Pinellas County',
  description:
    'Transparent Air provides evidence-based AC repair diagnostics, heat pump service, and second opinions in Gulfport, South St. Petersburg, Maximo / Pinellas Point, Seminole, and Pinellas Park, Florida.',
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Transparent Air | AC Repair & Second Opinions in Pinellas County',
    description:
      '4.9★ on Google with 115 reviews. Evidence-based AC diagnostics, repair evaluations, and second opinions from Transparent Air.',
    url: PAGE_URL,
    type: 'website',
  },
};

const serviceAreas = [
  ['Gulfport', '/transparent-air/gulfport-ac-repair'],
  ['South St. Petersburg', '/transparent-air/south-st-petersburg-ac-repair'],
  ['Maximo / Pinellas Point · 33711', '/transparent-air/maximo-pinellas-point-ac-repair'],
  ['Seminole', '/transparent-air/seminole-ac-repair'],
  ['Pinellas Park', '/transparent-air/pinellas-park-ac-repair'],
] as const;

const problems = [
  'AC not cooling',
  'Heat pump not working',
  'Warm air from the vents',
  'System starts and stops repeatedly',
  'Outdoor unit will not run',
  'Frozen coil or refrigerant concern',
  'Electrical, capacitor, motor, airflow, drain, or thermostat problem',
  'Expensive repair or replacement recommendation',
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HVACBusiness',
  name: 'Transparent Air',
  url: PAGE_URL,
  telephone: '+1-386-337-7215',
  founder: { '@type': 'Person', name: 'Greggory Don Butler' },
  areaServed: ['Gulfport', 'South St. Petersburg', 'Seminole', 'Pinellas Park'],
  description:
    'Evidence-based air-conditioning diagnostics, repair evaluations, heat pump service, and second opinions in Pinellas County, Florida.',
};

export default function TransparentAirPage() {
  return (
    <main className="ta-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        *{box-sizing:border-box}.ta-home{min-height:100vh;background:#f4f8f9;color:#123642;font-family:Arial,sans-serif}.wrap{width:min(1160px,92vw);margin:auto}.hero{padding:78px 0 64px;color:#fff;background:radial-gradient(circle at 84% 8%,rgba(35,188,193,.24),transparent 31%),linear-gradient(135deg,#051d29,#093c4b 66%,#08616b)}.eyebrow{font-size:11px;font-weight:950;letter-spacing:.16em;text-transform:uppercase;color:#7ee0df}.heroGrid{display:grid;grid-template-columns:1.18fr .82fr;gap:42px;align-items:center}.hero h1{font-size:clamp(3rem,6.6vw,6.2rem);line-height:.91;letter-spacing:-.055em;margin:16px 0 23px;max-width:850px}.hero h1 em{color:#f1c268;font-style:normal}.lead{font-size:1.2rem;line-height:1.65;color:#e0eef1;max-width:760px}.proof{font-size:1rem;font-weight:950;color:#fff;margin:19px 0}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:13px 19px;border-radius:9px;text-decoration:none;font-size:12px;font-weight:950;letter-spacing:.04em}.btn.call{background:#e7ad45;color:#082934}.btn.verify{background:#fff;color:#092b38}.heroCard{background:#fff;color:#153a47;border-radius:17px;padding:28px;box-shadow:0 22px 65px rgba(0,0,0,.2)}.heroCard h2{margin:8px 0 17px;font-size:28px}.list{list-style:none;padding:0;margin:0}.list li{position:relative;padding:10px 0 10px 27px;border-bottom:1px solid #e3edef}.list li:before{content:'✓';position:absolute;left:0;color:#078993;font-weight:950}.list li:last-child{border:0}.section{padding:68px 0;background:#fff}.section.alt{background:#eaf5f5}.section.dark{background:#072a37;color:#e5f1f3}.section h2{font-size:clamp(2.1rem,4.5vw,3.7rem);line-height:1.02;letter-spacing:-.035em;margin:11px 0 20px;color:#0a3544}.section.dark h2{color:#fff}.section p{font-size:17px;line-height:1.7;max-width:870px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:31px}.card{background:#fff;color:#153a47;border:1px solid #d8e5e8;border-radius:14px;padding:24px}.card h3{margin:0 0 10px}.dark .card{border:0}.areaGrid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:25px}.area{display:flex;min-height:92px;align-items:center;justify-content:center;text-align:center;padding:14px;background:#fff;border:1px solid #d7e4e7;border-radius:12px;color:#0b6872;text-decoration:none;font-weight:950}.quote{font-size:clamp(1.7rem,3.4vw,2.7rem);font-weight:950;line-height:1.18;border-left:5px solid #e7ad45;padding-left:23px;margin:30px 0}.final{padding:67px 0;text-align:center;background:#0a3948;color:#fff}.final h2{font-size:clamp(2.2rem,5vw,4.4rem);margin:0 0 14px}.final p{color:#d5e7ea;font-size:18px}.final .actions{justify-content:center}@media(max-width:850px){.heroGrid,.cards{grid-template-columns:1fr}.areaGrid{grid-template-columns:1fr 1fr}.hero{padding-top:52px}}@media(max-width:520px){.areaGrid{grid-template-columns:1fr}.btn{width:100%}}
      `}</style>

      <header className="hero">
        <div className="wrap heroGrid">
          <div>
            <div className="eyebrow">Transparent Air · Pinellas County, Florida</div>
            <h1>AC not working? <em>Get the diagnosis right.</em></h1>
            <p className="lead">When the house is hot, you need the problem found—not a guess and not a parts cannon. Transparent Air provides evidence-based AC diagnostics, heat pump service, repair evaluations, and second opinions across our South Pinellas service area.</p>
            <p className="proof">4.9★ on Google · 115 reviews · Greggory Don Butler personally performs Transparent Air second-opinion evaluations.</p>
            <div className="actions">
              <a className="btn call" href={PHONE_HREF}>CALL TRANSPARENT AIR · {PHONE_DISPLAY}</a>
              <a className="btn verify" href={GOOGLE_VERIFY_URL} target="_blank" rel="noopener noreferrer" data-transparent-air-proof="google-greggory-don-butler-hvac">GOOGLE GREGGORY DON BUTLER + HVAC · AI MODE ↗</a>
            </div>
          </div>
          <aside className="heroCard">
            <div className="eyebrow" style={{color:'#087f89'}}>Need AC help?</div>
            <h2>Start with what the system is actually doing.</h2>
            <ul className="list">{problems.map((x)=><li key={x}>{x}</li>)}</ul>
          </aside>
        </div>
      </header>

      <section className="section">
        <div className="wrap">
          <div className="eyebrow" style={{color:'#087f89'}}>Why Transparent Air?</div>
          <h2>Before you choose who works on your AC, verify who you are calling.</h2>
          <p>Transparent Air is owned by Greggory Don Butler, founder of TA14 and TA14 Academy. His HVAC work, publications, training, and evidence-based diagnostic methodology are part of a public record you can examine before deciding who you want working on your system.</p>
          <div className="quote">You do not need to believe a marketing claim. Google the person who is going to diagnose your air conditioner.</div>
          <div className="actions">
            <a className="btn verify" style={{border:'1px solid #b9d3d7'}} href={GOOGLE_VERIFY_URL} target="_blank" rel="noopener noreferrer" data-transparent-air-proof="google-greggory-don-butler-hvac">VERIFY GREGGORY DON BUTLER + HVAC · AI MODE ↗</a>
            <a className="btn call" href={PHONE_HREF}>CALL NOW · {PHONE_DISPLAY}</a>
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="wrap">
          <div className="eyebrow">The offer</div>
          <h2>Repair call, heat pump problem, or expensive recommendation—we start with evidence.</h2>
          <div className="cards">
            <article className="card"><h3>AC / Heat Pump Not Working</h3><p>We evaluate the present condition and operating evidence before deciding what should be repaired.</p><p><Link href="/transparent-air/ac-not-working">AC NOT WORKING →</Link><br/><Link href="/transparent-air/ac-not-cooling">AC NOT COOLING →</Link><br/><Link href="/transparent-air/heat-pump-not-working">HEAT PUMP NOT WORKING →</Link></p></article>
            <article className="card"><h3>Expensive Repair</h3><p>If the recommendation is costly and you are unsure about the diagnosis, get another set of eyes on it before authorizing the work.</p></article>
            <article className="card"><h3>Told You Need a New System?</h3><p>A replacement decision can cost thousands. <Link href="/transparent-air/told-you-need-new-ac">See what to verify before replacement →</Link></p></article>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="eyebrow" style={{color:'#087f89'}}>Local service</div>
          <h2>Choose your area.</h2>
          <p>These pages are built around the local AC problems homeowners actually search for when they need help now.</p>
          <div className="areaGrid">{serviceAreas.map(([name,href])=><Link className="area" href={href} key={href}>{name} AC Repair →</Link>)}</div>
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <div className="eyebrow">Transparent Air</div>
          <h2>Your AC is broken. Start with the diagnosis.</h2>
          <p>Call Transparent Air and tell us what the system is doing.</p>
          <div className="actions">
            <a className="btn call" href={PHONE_HREF}>CALL {PHONE_DISPLAY}</a>
            <Link className="btn verify" href="/transparent-air/second-opinion">GET A SECOND OPINION →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
