import type { Metadata } from 'next';
import Link from 'next/link';

const PRIMARY_PHONE_DISPLAY = '386-337-7215';
const PRIMARY_PHONE_HREF = 'tel:+13863377215';
const SECONDARY_PHONE_DISPLAY = '386-479-0435';
const SECONDARY_PHONE_HREF = 'tel:+13864790435';
const PAGE_URL = 'https://www.ta14exchange.com/transparent-air/maximo-pinellas-point-ac-repair';

export const metadata: Metadata = {
  title: 'AC Repair Maximo & Pinellas Point FL | 33711 AC Second Opinions',
  description: 'Need AC repair in Maximo, Pinellas Point, or ZIP 33711? Transparent Air provides evidence-based AC diagnostics and second opinions personally performed by Greggory Don Butler.',
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'AC Repair & Second Opinions in Maximo / Pinellas Point, FL | Transparent Air',
    description: 'Before authorizing an expensive AC repair or replacement in Maximo, Pinellas Point, or 33711, get an evidence-based second opinion from Transparent Air.',
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
  name: 'Transparent Air Maximo and Pinellas Point AC Repair and Second Opinion Service',
  serviceType: 'Air conditioning diagnostic, repair evaluation, and second opinion',
  provider: { '@type': 'LocalBusiness', name: 'Transparent Air', telephone: '+1-386-337-7215', url: PAGE_URL },
  areaServed: [
    { '@type': 'Place', name: 'Maximo, St. Petersburg, FL' },
    { '@type': 'Place', name: 'Pinellas Point, St. Petersburg, FL' },
    { '@type': 'Place', name: '33711' },
  ],
  url: PAGE_URL,
};

export default function MaximoPinellasPointACRepairPage() {
  return (
    <main style={{ background: '#f6fafb', color: '#123542', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        .mp-wrap{width:min(1160px,92vw);margin:auto}.mp-hero{padding:76px 0;background:radial-gradient(circle at 82% 12%,rgba(31,166,173,.2),transparent 31%),linear-gradient(135deg,#061f2b,#0a4050 70%,#096773);color:#fff}.mp-grid{display:grid;grid-template-columns:1.18fr .82fr;gap:44px;align-items:center}.mp-eye{font-size:.78rem;font-weight:900;letter-spacing:.15em;text-transform:uppercase;color:#82e1df}.mp-h1{font-size:clamp(2.7rem,6vw,5.4rem);line-height:.98;letter-spacing:-.045em;margin:15px 0 22px}.mp-lead{font-size:1.2rem;line-height:1.7;color:#e4f3f4}.mp-card{background:#fff;color:#143945;border-radius:16px;padding:28px;box-shadow:0 20px 55px rgba(0,0,0,.16)}.mp-btn{display:inline-flex;padding:15px 21px;border-radius:8px;background:#e7ad45;color:#082934;text-decoration:none;font-weight:900;margin-top:12px}.mp-btn.teal{background:#087f89;color:#fff}.mp-alt{display:inline-flex;padding:14px 19px;border:1px solid rgba(255,255,255,.45);border-radius:8px;color:#fff;text-decoration:none;font-weight:900;margin:12px 0 0 8px}.mp-section{padding:68px 0;background:#fff}.mp-section.alt{background:#edf7f7}.mp-section.dark{background:#082c3a;color:#e2eff1}.mp-section h2{font-size:clamp(2rem,4vw,3.2rem);line-height:1.08;color:#0a3948;margin:10px 0 22px}.mp-section.dark h2{color:#fff}.mp-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.mp-box{background:#fff;color:#173a46;border-radius:12px;padding:25px;border-top:4px solid #0b8b94}.mp-list{padding:0;list-style:none}.mp-list li{position:relative;padding:10px 0 10px 27px;border-bottom:1px solid #e4edef}.mp-list li:before{content:'✓';position:absolute;left:0;color:#078993;font-weight:900}.mp-list li:last-child{border:0}.mp-callout{font-size:clamp(1.5rem,3vw,2.15rem);font-weight:900;line-height:1.28;border-left:5px solid #e7ad45;padding-left:22px;margin:34px 0}.mp-link{color:#087985;font-weight:900}.mp-center{text-align:center}.mp-footer{background:#041a24;color:#bfd2d6;padding:38px 0}.mp-sticky{display:none}@media(max-width:800px){.mp-grid,.mp-cols{grid-template-columns:1fr}.mp-hero{padding:48px 0}.mp-alt{margin-left:0}.mp-sticky{display:block;position:fixed;bottom:0;left:0;right:0;background:#061f2b;padding:10px;text-align:center;z-index:50}.mp-sticky .mp-btn{width:94%;justify-content:center;margin:0}main{padding-bottom:70px}}
      `}</style>

      <header className="mp-hero"><div className="mp-wrap mp-grid"><div>
        <div className="mp-eye">Transparent Air · Maximo / Pinellas Point · 33711</div>
        <h1 className="mp-h1">AC Repair in Maximo & Pinellas Point Starts With Getting the Diagnosis Right.</h1>
        <p className="mp-lead">If your home in Maximo, Pinellas Point, or ZIP 33711 is hot, Transparent Air starts by establishing what the system is actually doing before recommending the next intervention.</p>
        <p className="mp-lead"><strong>If another company already recommended an expensive repair or replacement, Greggory Don Butler personally provides Transparent Air second-opinion evaluations.</strong></p>
        <a className="mp-btn" href={PRIMARY_PHONE_HREF}>Call {PRIMARY_PHONE_DISPLAY}</a><a className="mp-alt" href={SECONDARY_PHONE_HREF}>Or {SECONDARY_PHONE_DISPLAY}</a>
      </div><aside className="mp-card"><div className="mp-eye" style={{color:'#087f89'}}>33711 AC help</div><h2>Is your AC not cooling?</h2><ul className="mp-list">{symptoms.slice(0,6).map((x)=><li key={x}>{x}</li>)}</ul><a className="mp-btn teal" href={PRIMARY_PHONE_HREF}>Call Transparent Air</a></aside></div></header>

      <section className="mp-section"><div className="mp-wrap"><div className="mp-eye" style={{color:'#087f89'}}>Evidence before expense</div><h2>Before Replacing Parts, Establish What the System Is Actually Doing.</h2><p>Air-conditioning symptoms overlap. Poor airflow, control faults, electrical problems, drainage conditions, failed components, refrigerant-side conditions, and thermostat issues can produce similar complaints while requiring very different corrections.</p><p>Transparent Air establishes the condition, evaluates operating evidence, makes the diagnostic determination, explains what that evidence supports, and only then determines what intervention should follow.</p><div className="mp-callout">The goal is not to sell the biggest repair. The goal is to identify the condition that actually needs to be corrected.</div></div></section>

      <section className="mp-section dark"><div className="mp-wrap"><div className="mp-eye">When another company has already been out</div><h2>Maximo & Pinellas Point AC Second Opinions</h2><div className="mp-cols"><article className="mp-box"><h3>Expensive repair?</h3><p>If the recommendation is costly and you are uncertain about the diagnosis, another evidence-based evaluation can help before you authorize the work.</p></article><article className="mp-box"><h3>Told you need a new system?</h3><p>A replacement recommendation is consequential. Transparent Air can evaluate the existing equipment before you decide whether replacement is justified.</p></article><article className="mp-box"><h3>Repair did not solve it?</h3><p>If work was already performed and the original problem remains, the next evaluation should begin with the present condition rather than another assumption.</p></article></div><p><Link className="mp-link" style={{color:'#8be0df'}} href="/transparent-air/second-opinion">Read about Transparent Air's full AC Second Opinion service →</Link></p></div></section>

      <section className="mp-section alt"><div className="mp-wrap mp-grid"><div><div className="mp-eye" style={{color:'#087f89'}}>Local South Pinellas service</div><h2>Serving Maximo, Pinellas Point & ZIP 33711.</h2><p>This page is specifically for homeowners in the Maximo and Pinellas Point area of South St. Petersburg, including ZIP 33711, who need AC diagnostics, repair evaluation, or a second opinion.</p><p><strong>Call when you need a diagnosis you can understand before you authorize an expensive intervention.</strong></p></div><aside className="mp-card"><div className="mp-eye" style={{color:'#087f89'}}>Common reasons to call</div><ul className="mp-list">{symptoms.map((x)=><li key={x}>{x}</li>)}</ul></aside></div></section>

      <section className="mp-section mp-center"><div className="mp-wrap"><div className="mp-eye" style={{color:'#087f89'}}>Transparent Air · Maximo / Pinellas Point AC service</div><h2>Hot House? Expensive Estimate? Unsure About the Diagnosis?</h2><p style={{fontSize:'1.2rem'}}>Call Transparent Air. Greggory Don Butler personally evaluates the system.</p><a className="mp-btn" href={PRIMARY_PHONE_HREF}>Call {PRIMARY_PHONE_DISPLAY}</a><a className="mp-alt" style={{color:'#086b75',borderColor:'#afd0d3'}} href={SECONDARY_PHONE_HREF}>Or {SECONDARY_PHONE_DISPLAY}</a></div></section>

      <footer className="mp-footer"><div className="mp-wrap"><strong>Transparent Air</strong><br/>Air-conditioning diagnostics, repair evaluation, and second opinions serving Maximo, Pinellas Point, ZIP 33711, and selected South Pinellas areas.<br/><a style={{color:'#fff'}} href={PRIMARY_PHONE_HREF}>{PRIMARY_PHONE_DISPLAY}</a> · <a style={{color:'#fff'}} href={SECONDARY_PHONE_HREF}>{SECONDARY_PHONE_DISPLAY}</a><p style={{fontSize:'.85rem',color:'#9fb7bd'}}>TA-14 is a diagnostic/governance methodology and is not an occupational license or government certification. Service availability and applicable contractor/license information should be confirmed before scheduling.</p></div></footer>
      <div className="mp-sticky"><a className="mp-btn" href={PRIMARY_PHONE_HREF}>Call {PRIMARY_PHONE_DISPLAY}</a></div>
    </main>
  );
}
