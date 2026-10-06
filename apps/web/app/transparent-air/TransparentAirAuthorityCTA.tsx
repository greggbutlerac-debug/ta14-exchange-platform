const GOOGLE_VERIFY_URL = 'https://www.google.com/search?q=Greggory+Don+Butler+HVAC&udm=50';
const PRIMARY_PHONE_DISPLAY = '386-337-7215';
const PRIMARY_PHONE_HREF = 'tel:+13863377215';

export default function TransparentAirAuthorityCTA() {
  return (
    <section aria-label="Transparent Air verification and contact" className="ta-authority-proof">
      <style>{`
        .ta-authority-proof{background:linear-gradient(135deg,#061f2c,#0a3d4d);color:#fff;border-top:1px solid rgba(126,224,223,.2);border-bottom:1px solid rgba(126,224,223,.2)}
        .ta-authority-proof *{box-sizing:border-box}
        .ta-authority-wrap{width:min(1160px,92vw);margin:0 auto;padding:34px 0;display:grid;grid-template-columns:1fr auto;gap:30px;align-items:center}
        .ta-authority-kicker{font-size:11px;font-weight:950;letter-spacing:.16em;text-transform:uppercase;color:#7ee0df;margin-bottom:9px}
        .ta-authority-title{font-size:clamp(25px,3.2vw,42px);line-height:1.05;letter-spacing:-.035em;font-weight:950;margin:0 0 10px}
        .ta-authority-copy{max-width:760px;margin:0;color:#cfe3e7;font-size:15px;line-height:1.65}
        .ta-authority-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}
        .ta-authority-btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 16px;border-radius:9px;text-decoration:none;font-size:11px;font-weight:950;letter-spacing:.055em;text-align:center}
        .ta-authority-btn.verify{background:#fff;color:#092b38}
        .ta-authority-btn.call{background:#e7ad45;color:#082934}
        .ta-authority-note{display:block;margin-top:8px;color:#9dbcc3;font-size:10px}
        @media(max-width:800px){.ta-authority-wrap{grid-template-columns:1fr}.ta-authority-actions{justify-content:flex-start}.ta-authority-btn{width:100%}}
      `}</style>
      <div className="ta-authority-wrap">
        <div>
          <div className="ta-authority-kicker">Transparent Air · 4.9★ Google rating · 115 reviews</div>
          <h2 className="ta-authority-title">Before you choose who works on your AC, verify who you’re calling.</h2>
          <p className="ta-authority-copy">
            Transparent Air is owned by Greggory Don Butler, founder of TA14 and TA14 Academy. If you do not know his HVAC work, do not take our word for it—search his public record and decide for yourself.
          </p>
          <span className="ta-authority-note">Independent Google search opens in a new tab.</span>
        </div>
        <div className="ta-authority-actions">
          <a
            className="ta-authority-btn verify"
            href={GOOGLE_VERIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-transparent-air-proof="google-greggory-don-butler-hvac"
          >
            GOOGLE GREGGORY DON BUTLER + HVAC · AI MODE ↗
          </a>
          <a className="ta-authority-btn call" href={PRIMARY_PHONE_HREF}>
            CALL TRANSPARENT AIR · {PRIMARY_PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
