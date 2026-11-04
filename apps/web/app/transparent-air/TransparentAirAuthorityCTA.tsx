import Link from 'next/link';

const GOOGLE_VERIFY_URL = 'https://www.google.com/search?q=Greggory+Don+Butler+HVAC&udm=50';
const GOOGLE_BUSINESS_URL = 'https://maps.app.goo.gl/mzJaBCXreAta8X1R9';
const PRIMARY_PHONE_DISPLAY = '386-337-7215';
const PRIMARY_PHONE_HREF = 'tel:+13863377215';

export default function TransparentAirAuthorityCTA() {
  return (
    <section aria-label="Transparent Air verification and contact" className="ta-authority-proof">
      <style>{`
        .ta-authority-proof{background:linear-gradient(135deg,#061f2c,#0a3d4d);color:#fff;border-top:1px solid rgba(126,224,223,.2);border-bottom:1px solid rgba(126,224,223,.2)}
        .ta-authority-proof *{box-sizing:border-box}
        .ta-authority-wrap{width:min(1160px,92vw);margin:0 auto;padding:34px 0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px;align-items:center}
        .ta-authority-kicker{font-size:11px;font-weight:950;letter-spacing:.16em;text-transform:uppercase;color:#7ee0df;margin-bottom:9px}
        .ta-authority-title{font-size:clamp(25px,3.2vw,42px);line-height:1.05;letter-spacing:-.035em;font-weight:950;margin:0 0 10px}
        .ta-authority-copy{max-width:760px;margin:0;color:#cfe3e7;font-size:15px;line-height:1.65}
        .ta-authority-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;min-width:0}
        .ta-authority-btn{display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:13px 16px;min-width:0;line-height:1.45;border-radius:9px;text-decoration:none;font-size:11px;font-weight:950;letter-spacing:.055em;text-align:center}
        .ta-authority-btn.verify{background:#fff;color:#092b38}
        .ta-authority-btn.call{background:#e7ad45;color:#082934}
        .ta-authority-note{display:block;margin-top:8px;color:#9dbcc3;font-size:10px}
        @media(max-width:960px){.ta-authority-wrap{grid-template-columns:1fr;gap:22px}} @media(max-width:580px){.ta-authority-actions{grid-template-columns:1fr}.ta-authority-btn{width:100%}}
      `}</style>
      <div className="ta-authority-wrap">
        <div>
          <div className="ta-authority-kicker">Transparent Air · 4.9★ Google rating · 115 reviews</div>
          <h2 className="ta-authority-title">St. Petersburg AC service, backed by experience.</h2>
          <p className="ta-authority-copy" style={{marginBottom:10,fontWeight:900,color:'#f3d98f'}}>
            Need a second opinion before replacing your AC? Ask about our $80 diagnostic visit.
          </p>
          <p className="ta-authority-copy">
            Transparent Air serves South Pinellas County with practical air-conditioning diagnostics and service. Founded by Greggory Don Butler, also founder of TA14 Academy. Explore our reviews or call to discuss your system.
          </p>
          <span className="ta-authority-note">Independent Google search opens in a new tab.</span>
        </div>
        <div className="ta-authority-actions">
          <a
            className="ta-authority-btn verify"
            href={GOOGLE_BUSINESS_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-transparent-air-proof="google-transparent-air-business-profile"
          >
            SEE OUR GOOGLE REVIEWS ↗
          </a>
          <a
            className="ta-authority-btn verify"
            href={GOOGLE_VERIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-transparent-air-proof="google-greggory-don-butler-hvac"
          >
            SEARCH OUR HVAC BACKGROUND ↗
          </a>
          <Link className="ta-authority-btn verify" href="/transparent-air/second-opinion">
            EXPLORE THE $80 SECOND OPINION →
          </Link>
          <a className="ta-authority-btn call" href={PRIMARY_PHONE_HREF}>
            CALL TRANSPARENT AIR · {PRIMARY_PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
