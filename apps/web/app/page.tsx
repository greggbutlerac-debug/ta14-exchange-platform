'use client';

import Link from 'next/link';
import AtlasFrontDoor from './atlas-front-door/page';

export default function HomePage() {
  return (
    <>
      <section className="eu-world-gateway" aria-label="EU AI Act governed world">
        <div className="eu-world-inner">
          <div className="eu-world-number">GOVERNED WORLD 05</div>
          <div className="eu-world-copy">
            <span className="eu-world-code">EU</span>
            <div>
              <h2>EU AI ACT</h2>
              <p>Classify the system. Map applicable requirements. Build evidence. Preserve readiness, obligations, and governed progression.</p>
            </div>
          </div>
          <div className="eu-world-actions">
            <Link href="/eu-ai-act" className="eu-primary">ENTER EU AI ACT WORLD →</Link>
            <Link href="/eu-ai-act/classifier" className="eu-secondary">START CLASSIFICATION</Link>
            <Link href="/eu-ai-act/requirements" className="eu-secondary">VIEW REQUIREMENTS</Link>
          </div>
        </div>
      </section>
      <AtlasFrontDoor />
      <style jsx>{`
        .eu-world-gateway{position:relative;z-index:1000;background:linear-gradient(110deg,#07101f,#0b1730 48%,#10182a);border-bottom:1px solid rgba(110,168,255,.45);color:#fff;padding:18px 28px;font-family:Arial,Helvetica,sans-serif}
        .eu-world-inner{max-width:1500px;margin:0 auto;display:grid;grid-template-columns:auto 1fr auto;gap:24px;align-items:center}
        .eu-world-number{font-size:11px;letter-spacing:.18em;color:#8dbbff;white-space:nowrap}
        .eu-world-copy{display:flex;align-items:center;gap:16px}
        .eu-world-code{display:grid;place-items:center;width:52px;height:52px;border:1px solid #79aaff;border-radius:50%;font-weight:800;color:#b8d4ff;box-shadow:0 0 22px rgba(76,132,255,.28)}
        h2{margin:0 0 4px;font-size:22px;letter-spacing:.08em}
        p{margin:0;color:#c7d3e6;font-size:13px;line-height:1.45;max-width:720px}
        .eu-world-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}
        .eu-world-actions a{text-decoration:none;font-size:11px;font-weight:800;letter-spacing:.06em;padding:11px 13px;border-radius:3px}
        .eu-primary{background:#d9e7ff;color:#07101f}
        .eu-secondary{border:1px solid rgba(142,183,255,.45);color:#d9e7ff}
        @media(max-width:980px){.eu-world-inner{grid-template-columns:1fr}.eu-world-number{order:0}.eu-world-copy{order:1}.eu-world-actions{order:2;justify-content:flex-start}}
      `}</style>
    </>
  );
}
