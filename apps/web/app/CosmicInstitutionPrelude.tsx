'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CosmicInstitutionPrelude() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <section className={`cosmicPrelude ${ready ? 'isReady' : ''}`} aria-label="TA-14 institutional introduction">
      <div className="deepField" aria-hidden="true">
        <div className="starLayer a" />
        <div className="starLayer b" />
        <div className="nebula n1" />
        <div className="nebula n2" />
        <div className="beam beamLeft"><i /><i /><i /></div>
        <div className="beam beamRight"><i /><i /><i /></div>
        <div className="collision"><span /><span /><span /><span /></div>
        <div className="constellation">
          {Array.from({ length: 12 }).map((_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}
        </div>
      </div>

      <div className="preludeCopy">
        <p className="institutionLabel">TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
        <div className="collisionLabels" aria-hidden="true">
          <span>AI GOVERNANCE</span><b>×</b><span>ADMISSIBLE EVIDENCE</span>
        </div>
        <p className="eventLabel">THE GOVERNANCE BOSON · INSTITUTIONAL METAPHOR</p>
        <h1>Where governance becomes<br/><em>a governed record.</em></h1>
        <p className="lead">A living institution for registering governance, preserving evidence, testing consequential routes, building governed artifacts, teaching admissible execution, and carrying records forward through time.</p>
        <div className="actions">
          <Link href="/workspace/ai-governance" className="primary">Enter the AI Governance Exchange <span>↗</span></Link>
          <Link href="/workspace/ai-governance/registry/register" className="secondary">Register a Governance <span>→</span></Link>
          <a href="#institutional-doors" className="ghost">Explore the Institution <span>↓</span></a>
        </div>
        <div className="axiom"><span>REALITY</span><i/> <span>RECORD</span><i/> <span>CONTINUITY</span><i/> <span>ADMISSIBILITY</span><i/> <span>BINDING</span><i/> <span>COMMIT</span><i/> <span>EXECUTION</span><i/> <span>OUTCOME</span></div>
      </div>

      <div className="scrollCue" aria-hidden="true"><span>ENTER THE INSTITUTION</span><i /></div>

      <style jsx>{`
        .cosmicPrelude{position:relative;min-height:100svh;display:grid;place-items:center;overflow:hidden;background:#01050b;color:#f5f7fa;isolation:isolate;border-bottom:1px solid rgba(209,166,79,.2)}
        .deepField{position:absolute;inset:0;overflow:hidden;z-index:-1;background:radial-gradient(circle at 50% 48%,rgba(82,61,145,.2),transparent 23%),radial-gradient(circle at 50% 50%,rgba(212,158,57,.1),transparent 35%),linear-gradient(#01040a,#020915 70%,#020812)}
        .starLayer{position:absolute;inset:-30%;background-image:radial-gradient(circle,#fff 0 1px,transparent 1.4px);background-size:83px 83px;opacity:.18;animation:drift 42s linear infinite}
        .starLayer.b{background-size:137px 137px;transform:rotate(17deg);opacity:.12;animation-duration:68s;animation-direction:reverse}
        .nebula{position:absolute;width:70vw;height:70vw;border-radius:50%;filter:blur(80px);opacity:.12;animation:breathe 10s ease-in-out infinite alternate}.n1{left:-35vw;top:5%;background:#087cff}.n2{right:-38vw;top:12%;background:#d69a2d;animation-delay:-5s}
        .beam{position:absolute;top:48%;width:48vw;height:4px;filter:drop-shadow(0 0 10px currentColor);opacity:.9}.beamLeft{left:-3vw;color:#2998ff;background:linear-gradient(90deg,transparent,#1479db,#bde5ff);transform-origin:right;animation:chargeL 4.8s ease-in-out infinite}.beamRight{right:-3vw;color:#e2a43d;background:linear-gradient(270deg,transparent,#c78422,#ffe3a4);transform-origin:left;animation:chargeR 4.8s ease-in-out infinite}.beam i{position:absolute;inset:-5px 0;border-top:1px solid currentColor;opacity:.25;transform:skewY(1deg)}.beam i:nth-child(2){transform:translateY(9px) skewY(-1deg)}.beam i:nth-child(3){transform:translateY(-9px)}
        .collision{position:absolute;left:50%;top:48%;width:10px;height:10px;transform:translate(-50%,-50%);border-radius:50%;background:#fff;box-shadow:0 0 30px #fff,0 0 90px #dfaa48,0 0 180px #7454ff;animation:core 4.8s ease-in-out infinite}.collision span{position:absolute;inset:-20px;border:1px solid rgba(255,221,151,.6);border-radius:50%;animation:ring 4.8s ease-out infinite}.collision span:nth-child(2){animation-delay:.18s}.collision span:nth-child(3){animation-delay:.36s}.collision span:nth-child(4){animation-delay:.54s}
        .constellation{position:absolute;left:50%;top:48%;width:1px;height:1px}.constellation i{--i:0;position:absolute;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 13px #fff;transform:rotate(calc(var(--i)*30deg)) translateX(calc(150px + var(--i)*13px));opacity:.55;animation:twinkle calc(2.5s + var(--i)*.13s) ease-in-out infinite alternate}
        .preludeCopy{width:min(1120px,calc(100% - 42px));text-align:center;padding:118px 0 105px}.institutionLabel{font-size:11px;letter-spacing:.28em;font-weight:800;color:#d8ab56;margin:0 0 30px}.collisionLabels{display:flex;justify-content:center;align-items:center;gap:18px;font-size:12px;letter-spacing:.16em;font-weight:850}.collisionLabels span:first-child{color:#70baff}.collisionLabels span:last-child{color:#efbf66}.collisionLabels b{font-size:18px;color:#fff}.eventLabel{margin:16px 0 12px;color:#8496aa;font-size:9px;letter-spacing:.2em;font-weight:800}.preludeCopy h1{margin:0 auto;max-width:1000px;font-size:clamp(48px,7.2vw,104px);line-height:.92;letter-spacing:-.055em;font-weight:720;text-shadow:0 8px 45px #000}.preludeCopy h1 em{font-style:normal;color:#e3b258;text-shadow:0 0 38px rgba(221,169,74,.25)}.lead{max-width:820px;margin:30px auto 0;color:#aab8c6;font-size:clamp(15px,1.6vw,19px);line-height:1.72}.actions{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-top:34px}.actions :global(a){min-height:48px;display:inline-flex;align-items:center;gap:13px;padding:0 20px;border-radius:12px;text-decoration:none;text-transform:uppercase;font-size:10px;letter-spacing:.09em;font-weight:900;transition:.25s ease}.primary{background:linear-gradient(135deg,#e0b35d,#9d6a1b);color:#06101b!important;box-shadow:0 14px 45px rgba(190,133,36,.2)}.secondary{border:1px solid rgba(86,167,246,.55);background:rgba(7,31,54,.72);color:#d9edff!important}.ghost{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.035);color:#d4dce4!important}.actions :global(a:hover){transform:translateY(-3px);filter:brightness(1.12)}
        .axiom{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;margin:40px auto 0;color:#8293a4;font-size:8px;letter-spacing:.11em;font-weight:800}.axiom i{width:20px;height:1px;background:linear-gradient(90deg,#267fd0,#d49a36)}
        .scrollCue{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);display:grid;justify-items:center;gap:8px;color:#677b8e;font-size:8px;letter-spacing:.18em;font-weight:800}.scrollCue i{width:1px;height:28px;background:linear-gradient(#d6a64d,transparent);animation:scroll 1.8s ease-in-out infinite}
        @keyframes drift{to{transform:translate3d(90px,55px,0)}}@keyframes breathe{to{transform:scale(1.18);opacity:.18}}@keyframes chargeL{0%,12%{transform:scaleX(.35);opacity:.2}45%,72%{transform:scaleX(1);opacity:1}100%{transform:scaleX(.35);opacity:.2}}@keyframes chargeR{0%,12%{transform:scaleX(.35);opacity:.2}45%,72%{transform:scaleX(1);opacity:1}100%{transform:scaleX(.35);opacity:.2}}@keyframes core{0%,30%,100%{transform:translate(-50%,-50%) scale(.5);opacity:.5}48%,60%{transform:translate(-50%,-50%) scale(2);opacity:1}}@keyframes ring{0%,42%{transform:scale(.1);opacity:0}52%{opacity:.9}88%,100%{transform:scale(16);opacity:0}}@keyframes twinkle{to{opacity:1;transform:rotate(calc(var(--i)*30deg)) translateX(calc(165px + var(--i)*14px)) scale(1.5)}}@keyframes scroll{50%{transform:translateY(7px);opacity:.35}}
        @media(max-width:700px){.preludeCopy{padding-top:95px}.beam{width:44vw}.constellation{display:none}.collisionLabels{gap:9px;font-size:9px}.axiom{max-width:330px}.preludeCopy h1{font-size:clamp(44px,15vw,70px)}}
        @media(prefers-reduced-motion:reduce){.starLayer,.nebula,.beam,.collision,.collision span,.constellation i,.scrollCue i{animation:none!important}}
      `}</style>
    </section>
  );
}
