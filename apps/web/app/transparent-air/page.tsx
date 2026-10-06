import type { Metadata } from 'next';
import Link from 'next/link';

const PAGE_URL = 'https://www.ta14exchange.com/transparent-air';
const PHONE_DISPLAY = '386-337-7215';
const PHONE_HREF = 'tel:+13863377215';
const GOOGLE_VERIFY_URL = 'https://www.google.com/search?q=Greggory+Don+Butler+HVAC&udm=50';
const GOOGLE_BUSINESS_URL = 'https://maps.app.goo.gl/mzJaBCXreAta8X1R9';

export const metadata: Metadata = {
  title: 'Transparent Air | AC Repair, Heat Pump Service & $80 Second Opinions in Pinellas County',
  description:
    'AC not working? Transparent Air provides evidence-based AC diagnostics, heat pump service, repair evaluations, and $80 second opinions across South Pinellas County, Florida.',
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Transparent Air | Get the Diagnosis Right',
    description:
      '4.9★ on Google with 115 reviews. Evidence-based AC diagnostics, repair evaluations, heat pump service, and $80 second opinions.',
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
  'AC running but not cooling',
  'Heat pump not working',
  'Warm air from the vents',
  'Outdoor unit will not run',
  'Frozen coil or refrigerant concern',
  'System starts and stops repeatedly',
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
  areaServed: ['Gulfport', 'South St. Petersburg', 'Maximo', 'Pinellas Point', 'Seminole', 'Pinellas Park'],
  description:
    'Evidence-based air-conditioning diagnostics, repair evaluations, heat pump service, and second opinions in South Pinellas County, Florida.',
};

export default function TransparentAirPage() {
  return (
    <main className="ta">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        *{box-sizing:border-box}
        .ta{--ink:#0a2f3c;--deep:#061d28;--teal:#087f89;--aqua:#7ee0df;--gold:#e7ad45;--mist:#edf7f7;--line:#d7e5e7;min-height:100vh;background:#f7fbfb;color:var(--ink);font-family:Arial,sans-serif}
        .wrap{width:min(1180px,92vw);margin:auto}
        .hero{position:relative;overflow:hidden;padding:84px 0 70px;color:white;background:radial-gradient(circle at 88% 6%,rgba(126,224,223,.20),transparent 28%),radial-gradient(circle at 10% 100%,rgba(231,173,69,.11),transparent 30%),linear-gradient(135deg,#041821 0%,#073240 58%,#075963 100%)}
        .hero:after{content:"";position:absolute;inset:auto -7vw -14vw auto;width:36vw;height:36vw;border:1px solid rgba(255,255,255,.08);border-radius:50%}
        .heroGrid{display:grid;grid-template-columns:1.18fr .82fr;gap:52px;align-items:center;position:relative;z-index:1}
        .eyebrow{font-size:11px;font-weight:950;letter-spacing:.18em;text-transform:uppercase;color:var(--aqua)}
        .hero h1{font-size:clamp(3.35rem,7vw,6.9rem);line-height:.88;letter-spacing:-.06em;margin:17px 0 24px;max-width:860px}
        .hero h1 em{display:block;color:#f1c268;font-style:normal}
        .lead{max-width:790px;color:#dcebef;font-size:1.18rem;line-height:1.65}
        .trustRow{display:flex;flex-wrap:wrap;gap:10px;margin:23px 0 0}
        .trustPill{padding:9px 12px;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(255,255,255,.06);font-size:12px;font-weight:900}
        .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
        .btn{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:13px 18px;border-radius:10px;text-decoration:none;font-size:12px;font-weight:950;letter-spacing:.035em;transition:transform .18s ease,box-shadow .18s ease}
        .btn:hover{transform:translateY(-1px)}
        .btn.primary{background:var(--gold);color:#082934;box-shadow:0 8px 26px rgba(231,173,69,.22)}
        .btn.light{background:#fff;color:#092b38}
        .btn.outline{border:1px solid #aacbd0;color:#0a5360;background:#fff}
        .heroCard{position:relative;background:#fff;color:var(--ink);border-radius:22px;padding:30px;box-shadow:0 28px 80px rgba(0,0,0,.27)}
        .heroCard:before{content:"";position:absolute;top:0;left:28px;right:28px;height:4px;background:linear-gradient(90deg,var(--aqua),var(--gold));border-radius:0 0 5px 5px}
        .heroCard h2{font-size:29px;line-height:1.08;margin:9px 0 18px;letter-spacing:-.025em}
        .list{list-style:none;padding:0;margin:0}
        .list li{position:relative;padding:11px 0 11px 29px;border-bottom:1px solid #e7eff1;font-size:14px;line-height:1.35}
        .list li:before{content:'✓';position:absolute;left:0;color:var(--teal);font-weight:950}
        .list li:last-child{border-bottom:0}
        .proofBar{background:#0b3442;color:#fff;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06)}
        .proofGrid{display:grid;grid-template-columns:repeat(4,1fr)}
        .proofItem{padding:20px 18px;border-right:1px solid rgba(255,255,255,.09)}
        .proofItem:last-child{border-right:0}
        .proofBig{display:block;font-size:1.2rem;font-weight:950;color:#fff}
        .proofSmall{display:block;margin-top:4px;font-size:11px;color:#b9d2d8;text-transform:uppercase;letter-spacing:.08em}
        .section{padding:76px 0;background:#fff}
        .section.alt{background:var(--mist)}
        .section.dark{background:linear-gradient(135deg,#062430,#093c4b);color:#e8f3f5}
        .section h2{font-size:clamp(2.25rem,4.7vw,4.1rem);line-height:.98;letter-spacing:-.045em;margin:12px 0 20px;color:#0a3544}
        .section.dark h2{color:#fff}
        .section p{font-size:16.5px;line-height:1.7;max-width:900px}
        .decisionGrid{display:grid;grid-template-columns:1fr .9fr;gap:38px;align-items:center}
        .quote{font-size:clamp(1.7rem,3.2vw,2.7rem);font-weight:950;line-height:1.15;border-left:5px solid var(--gold);padding-left:22px;margin:28px 0}
        .process{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:30px}
        .step{background:#f7fbfb;border:1px solid var(--line);border-radius:15px;padding:22px}
        .stepNum{font-size:12px;font-weight:950;color:var(--teal);letter-spacing:.12em}
        .step h3{margin:8px 0 7px}
        .offer{background:#fff;color:var(--ink);border-radius:22px;padding:32px;box-shadow:0 22px 60px rgba(0,0,0,.16)}
        .price{font-size:clamp(3.4rem,6vw,5.4rem);font-weight:950;line-height:.9;letter-spacing:-.05em;color:#0b6771;margin:11px 0 10px}
        .priceSub{font-weight:900;color:#5d747a}
        .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:30px}
        .card{background:#fff;color:var(--ink);border:1px solid var(--line);border-radius:16px;padding:24px}
        .card h3{font-size:20px;margin:0 0 10px}
        .card a{color:#08717b;font-weight:950}
        .areaGrid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:26px}
        .area{display:flex;min-height:104px;align-items:center;justify-content:center;text-align:center;padding:15px;background:#fff;border:1px solid #d5e4e7;border-radius:14px;color:#0b6872;text-decoration:none;font-weight:950;box-shadow:0 6px 20px rgba(12,60,72,.04)}
        .final{padding:78px 0;text-align:center;color:#fff;background:radial-gradient(circle at 50% -40%,rgba(126,224,223,.22),transparent 45%),#072a37}
        .final h2{font-size:clamp(2.4rem,5.2vw,4.8rem);line-height:.98;letter-spacing:-.045em;margin:10px auto 16px;max-width:900px}
        .final p{color:#cfe1e5;font-size:18px}
        .final .actions{justify-content:center}
        @media(max-width:900px){.heroGrid,.decisionGrid,.cards{grid-template-columns:1fr}.proofGrid{grid-template-columns:1fr 1fr}.proofItem:nth-child(2){border-right:0}.areaGrid{grid-template-columns:1fr 1fr}.hero{padding-top:56px}.process{grid-template-columns:1fr}}
        @media(max-width:560px){.proofGrid,.areaGrid{grid-template-columns:1fr}.proofItem{border-right:0;border-bottom:1px solid rgba(255,255,255,.08)}.btn{width:100%}.hero h1{font-size:clamp(3rem,15vw,4.4rem)}}
      `}</style>

      <header className="hero">
        <div className="wrap heroGrid">
          <div>
            <div className="eyebrow">Transparent Air · South Pinellas County, Florida</div>
            <h1>AC not working? <em>Get the diagnosis right.</em></h1>
            <p className="lead">
              When the house is hot, you need the problem found—not a guess and not a parts cannon. Transparent Air provides evidence-based AC diagnostics, heat pump service, repair evaluations, and second opinions.
            </p>
            <div className="trustRow">
              <span className="trustPill">4.9★ Google rating</span>
              <span className="trustPill">115 reviews</span>
              <span className="trustPill">Greggory Don Butler personally performs second opinions</span>
            </div>
            <div className="actions">
              <a className="btn primary" href={PHONE_HREF}>CALL TRANSPARENT AIR · {PHONE_DISPLAY}</a>
              <a className="btn light" href={GOOGLE_BUSINESS_URL} target="_blank" rel="noopener noreferrer" data-transparent-air-proof="google-transparent-air-business-profile">
                SEE TRANSPARENT AIR ON GOOGLE ↗
              </a>
            </div>
          </div>
          <aside className="heroCard">
            <div className="eyebrow" style={{color:'#087f89'}}>Tell us what it is doing</div>
            <h2>Start with the symptom. Earn the conclusion.</h2>
            <ul className="list">{problems.map((x)=><li key={x}>{x}</li>)}</ul>
          </aside>
        </div>
      </header>

      <section className="proofBar" aria-label="Transparent Air proof points">
        <div className="wrap proofGrid">
          <div className="proofItem"><span className="proofBig">4.9★</span><span className="proofSmall">Google rating</span></div>
          <div className="proofItem"><span className="proofBig">115</span><span className="proofSmall">Google reviews</span></div>
          <div className="proofItem"><span className="proofBig">$80</span><span className="proofSmall">Second opinion</span></div>
          <div className="proofItem"><span className="proofBig">386-337-7215</span><span className="proofSmall">Call Transparent Air</span></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap decisionGrid">
          <div>
            <div className="eyebrow" style={{color:'#087f89'}}>Why Transparent Air?</div>
            <h2>Before you choose who works on your AC, verify who you are calling.</h2>
            <p>
              Transparent Air is owned by Greggory Don Butler, founder of TA14 and TA14 Academy. His HVAC work, publications, training, and evidence-based diagnostic methodology are part of a public record you can examine before deciding who you want working on your system.
            </p>
            <div className="quote">You do not need to believe a marketing claim. Verify the person who is going to diagnose your air conditioner.</div>
            <div className="actions">
              <a className="btn outline" href={GOOGLE_VERIFY_URL} target="_blank" rel="noopener noreferrer" data-transparent-air-proof="google-greggory-don-butler-hvac">GOOGLE GREGGORY DON BUTLER + HVAC · AI MODE ↗</a>
              <a className="btn primary" href={PHONE_HREF}>CALL NOW · {PHONE_DISPLAY}</a>
            </div>
          </div>
          <div className="offer">
            <div className="eyebrow" style={{color:'#087f89'}}>The decision-protection offer</div>
            <div className="price">$80</div>
            <div className="priceSub">to verify a decision that could cost $10,000.</div>
            <p>
              Told you that you need a new system? Get a low-cost independent second opinion before you authorize a high-cost replacement decision.
            </p>
            <p style={{fontSize:13,color:'#6a7d82'}}>This is a diagnostic second-opinion service, not an insurance policy. The evaluation may confirm the original recommendation or establish that another path is supportable.</p>
            <div className="actions">
              <Link className="btn primary" href="/transparent-air/second-opinion">BOOK THE $80 SECOND OPINION →</Link>
              <Link className="btn outline" href="/transparent-air/told-you-need-new-ac">VERIFY BEFORE YOU REPLACE →</Link>
            </div>
          </div>
        </div>

        <div className="wrap process">
          <div className="step"><div className="stepNum">01 · OBSERVE</div><h3>What is the system actually doing?</h3><p>Start with present conditions and symptoms before disturbing the system.</p></div>
          <div className="step"><div className="stepNum">02 · DIAGNOSE</div><h3>What does the evidence support?</h3><p>Separate an observed condition from an assumption, sales conclusion, or guess.</p></div>
          <div className="step"><div className="stepNum">03 · DECIDE</div><h3>What should happen next?</h3><p>Repair, monitor, investigate further, or replace—after the diagnosis earns the recommendation.</p></div>
        </div>
      </section>

      <section className="section dark">
        <div className="wrap">
          <div className="eyebrow">Choose the problem</div>
          <h2>Repair call, heat pump problem, or expensive recommendation—we start with evidence.</h2>
          <div className="cards">
            <article className="card">
              <h3>AC / Heat Pump Not Working</h3>
              <p>We evaluate the present condition and operating evidence before deciding what should be repaired.</p>
              <p><Link href="/transparent-air/ac-not-working">AC NOT WORKING →</Link><br/><Link href="/transparent-air/ac-not-cooling">AC NOT COOLING →</Link><br/><Link href="/transparent-air/heat-pump-not-working">HEAT PUMP NOT WORKING →</Link></p>
            </article>
            <article className="card">
              <h3>Expensive Repair</h3>
              <p>If the recommendation is costly and you are unsure about the diagnosis, get another set of eyes on it before authorizing the work.</p>
              <p><Link href="/transparent-air/second-opinion">GET A SECOND OPINION →</Link></p>
            </article>
            <article className="card">
              <h3>Told You Need a New AC?</h3>
              <p><strong>$80 to verify a decision that could cost $10,000.</strong> Protect the decision before you replace the equipment.</p>
              <p><Link href="/transparent-air/told-you-need-new-ac">VERIFY BEFORE YOU REPLACE →</Link></p>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="eyebrow" style={{color:'#087f89'}}>Local service</div>
          <h2>South Pinellas AC help, routed by area.</h2>
          <p>Choose your area for local AC repair and diagnostic service information.</p>
          <div className="areaGrid">{serviceAreas.map(([name,href])=><Link className="area" href={href} key={href}>{name} AC Repair →</Link>)}</div>
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <div className="eyebrow">Transparent Air</div>
          <h2>Your AC is broken. Start with the diagnosis.</h2>
          <p>Call Transparent Air and tell us what the system is doing.</p>
          <div className="actions">
            <a className="btn primary" href={PHONE_HREF}>CALL {PHONE_DISPLAY}</a>
            <Link className="btn light" href="/transparent-air/second-opinion">BOOK THE $80 SECOND OPINION →</Link>
            <a className="btn light" href={GOOGLE_BUSINESS_URL} target="_blank" rel="noopener noreferrer">SEE 4.9★ GOOGLE REVIEWS ↗</a>
          </div>
        </div>
      </section>
    </main>
  );
}
