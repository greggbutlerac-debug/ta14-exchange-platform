"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { applicableInstruments, jurisdictionChain, jurisdictions } from "../../lib/world-law-catalog";

const domainOptions = ["ALL", "Atmosphere", "Air & Atmosphere", "Water", "Buildings", "Local Government", "Municipal", "AI"];

function layerLabel(layer: string) {
  return layer.replaceAll("_", " / ");
}

export default function WorldEnvironmentalLawPage() {
  const [selectedCode, setSelectedCode] = useState("US-FL-STPETE");
  const [domain, setDomain] = useState("ALL");
  const [query, setQuery] = useState("");

  const selected = jurisdictions.find((j) => j.code === selectedCode) ?? jurisdictions[0];
  const chain = jurisdictionChain(selected.code);
  const laws = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return applicableInstruments(selected.code).filter((law) => {
      const domainPass = domain === "ALL" || law.domain === domain;
      const queryPass = !normalized || [law.title, law.domain, law.authority, law.jurisdiction].join(" ").toLowerCase().includes(normalized);
      return domainPass && queryPass;
    });
  }, [selected.code, domain, query]);

  return (
    <main className="worldLaw">
      <header className="topbar">
        <Link href="/" className="brand"><span>TA</span><div><strong>TA-14 Authority Governance Institution</strong><small>Fourth Door · World Environmental Law</small></div></Link>
        <nav><Link href="/">Institution Home</Link><Link href="/governance-library/laws">Law Library</Link><Link href="/academy">Academy</Link></nav>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">FOURTH DOOR · WORLD ENVIRONMENTAL LAW</p>
          <h1>The law where you stand.<br/><em>The governed rewrite for what should come next.</em></h1>
          <p className="lead">Click a place on Earth. Inspect the environmental-law stack that reaches it. Preserve what is actually binding, understand what it means, then examine the TA-14 proposal for stronger evidence, authority, execution, and verified outcome.</p>
          <div className="principle">CURRENT LAW IS CURRENT LAW · TA-14 ANALYSIS IS ANALYSIS · TA-14 REWRITE IS PROPOSED LAW</div>
        </div>
        <div className="heroStats"><article><strong>07</strong><span>jurisdiction layers</span></article><article><strong>{jurisdictions.length}</strong><span>map nodes in V1</span></article><article><strong>{laws.length}</strong><span>laws applying here</span></article></div>
      </section>

      <section className="commandGrid">
        <div className="mapPanel">
          <div className="panelHead"><div><p className="eyebrow">WORLD MAP V1</p><h2>Explore authority geographically.</h2></div><span className="live">LIVE JURISDICTION STACK</span></div>
          <div className="mapShell">
            <svg viewBox="0 0 1000 560" role="img" aria-label="Interactive World Environmental Law map">
              <defs>
                <radialGradient id="ocean" cx="50%" cy="45%" r="65%"><stop offset="0%" stopColor="#123148"/><stop offset="100%" stopColor="#06131d"/></radialGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <rect width="1000" height="560" rx="28" fill="url(#ocean)"/>
              <g fill="#15394a" stroke="#2c6274" strokeWidth="1.5" opacity=".95">
                <path d="M78 155 L150 105 250 97 318 142 300 205 245 226 206 280 142 252 104 206Z"/>
                <path d="M266 286 L319 314 350 401 318 505 273 452 252 346Z"/>
                <path d="M455 116 L530 102 585 136 568 185 516 193 478 164Z"/>
                <path d="M498 197 L585 192 650 249 620 370 559 452 512 401 475 292Z"/>
                <path d="M582 131 L695 103 833 132 916 197 879 266 768 247 714 294 649 255 570 188Z"/>
                <path d="M770 379 L858 360 921 410 899 480 814 491 764 442Z"/>
                <path d="M887 220 L925 204 946 242 923 269Z"/>
              </g>
              <g opacity=".22" stroke="#6de4ff"><path d="M0 140 H1000"/><path d="M0 280 H1000"/><path d="M0 420 H1000"/><path d="M200 0 V560"/><path d="M400 0 V560"/><path d="M600 0 V560"/><path d="M800 0 V560"/></g>
              {jurisdictions.filter((j) => j.code !== "GLOBAL").map((j) => {
                const active = j.code === selected.code;
                return <g key={j.code} transform={`translate(${j.x * 10} ${j.y * 5.6})`} onClick={() => setSelectedCode(j.code)} className="pin" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedCode(j.code); }}>
                  <circle r={active ? 16 : 10} fill={active ? "#f3bf59" : "#53d7ec"} opacity={active ? .2 : .14} filter="url(#glow)"/>
                  <circle r={active ? 7 : 5} fill={active ? "#f3bf59" : "#7de7f4"}/>
                  <text x="12" y="4" fill={active ? "#ffe5a6" : "#d9f8ff"} fontSize="12" fontWeight="700">{j.label}</text>
                </g>;
              })}
            </svg>
            <div className="mapLegend"><span><i className="dot current"/>Selected jurisdiction</span><span><i className="dot node"/>Available V1 node</span><span>Map geometry is an exploration interface, not a legal boundary survey.</span></div>
          </div>
        </div>

        <aside className="authorityPanel">
          <p className="eyebrow">SELECTED GEOGRAPHY</p><h2>{selected.name}</h2><p className="muted">{layerLabel(selected.layer)}</p>
          <div className="chain">{chain.map((node, index) => <div key={node.code} className={node.code === selected.code ? "chainNode active" : "chainNode"}><span>{String(index + 1).padStart(2,"0")}</span><div><strong>{node.name}</strong><small>{layerLabel(node.layer)}</small></div></div>)}</div>
          <div className="stackRule">Selecting a city never hides inherited authority. International, national, state, county, and municipal layers remain inspectable.</div>
        </aside>
      </section>

      <section className="lawSection">
        <div className="sectionHead"><div><p className="eyebrow">LAW MODE</p><h2>What governs here?</h2><p>These V1 records are tied to the jurisdiction stack above. Each law remains attributed to its actual issuing layer.</p></div><div className="filters"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search law, domain, authority…"/><select value={domain} onChange={(e) => setDomain(e.target.value)}>{domainOptions.map((d) => <option key={d}>{d}</option>)}</select></div></div>
        <div className="lawGrid">{laws.map((law) => <article className="lawCard" key={law.slug}>
          <div className="lawMeta"><span>{law.layer.replaceAll("_"," ")}</span><b>{law.status}</b></div>
          <h3>{law.shortTitle}</h3><p className="domain">{law.domain} · {law.jurisdiction}</p><p>{law.currentMeaning}</p>
          <div className="gap"><small>TA-14 EXAMINATION</small><strong>{law.structuralLimit}</strong></div>
          <div className="actions"><Link className="primary" href={`/world-environmental-law/law/${law.slug}`}>EXAMINE THIS LAW →</Link><Link href={`/world-environmental-law/law/${law.slug}#rewrite`}>SEE THE TA-14 REWRITE</Link></div>
        </article>)}</div>
      </section>

      <section className="northStar"><p className="eyebrow">NORTH STAR</p><h2>Geography → authority → law → meaning → evidence → TA-14 examination → proposed rewrite.</h2><p>The world itself becomes the index without flattening legal status or confusing enacted authority with TA-14 proposed law.</p></section>

      <style jsx>{`
        :global(body){margin:0;background:#061019;color:#eaf5f7;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.worldLaw{min-height:100vh;background:radial-gradient(circle at 72% 18%,rgba(36,121,145,.2),transparent 30%),linear-gradient(180deg,#061019,#07141d 55%,#081017)}
        .topbar{max-width:1440px;margin:auto;padding:22px 34px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,.09)}.brand{display:flex;gap:12px;align-items:center;color:inherit;text-decoration:none}.brand>span{width:42px;height:42px;border:1px solid #d7ad55;border-radius:50%;display:grid;place-items:center;color:#f0c66a;font-weight:900}.brand strong,.brand small{display:block}.brand small{color:#8fa9b1;margin-top:3px}.topbar nav{display:flex;gap:22px}.topbar nav a{color:#bcd0d5;text-decoration:none;font-size:14px}.hero{max-width:1370px;margin:auto;padding:78px 34px 46px;display:grid;grid-template-columns:1.6fr .8fr;gap:48px;align-items:end}.eyebrow{color:#e1b659;font-weight:900;font-size:12px;letter-spacing:.16em;margin:0 0 12px}.hero h1{font-size:clamp(42px,6vw,86px);line-height:.96;margin:0;letter-spacing:-.05em;max-width:1000px}.hero h1 em{font-style:normal;color:#7edeee}.lead{font-size:19px;line-height:1.7;color:#b6cad0;max-width:900px}.principle{margin-top:24px;padding:14px 16px;border-left:3px solid #e1b659;background:rgba(225,182,89,.08);font-size:12px;font-weight:800;color:#f3dfad}.heroStats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.heroStats article{padding:18px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.025);border-radius:16px}.heroStats strong,.heroStats span{display:block}.heroStats strong{font-size:32px;color:#7edeee}.heroStats span{font-size:11px;color:#8fa9b1;margin-top:6px;text-transform:uppercase;letter-spacing:.09em}
        .commandGrid{max-width:1440px;margin:0 auto;padding:24px 34px 54px;display:grid;grid-template-columns:1.65fr .7fr;gap:20px}.mapPanel,.authorityPanel{border:1px solid rgba(255,255,255,.1);background:rgba(5,17,25,.8);border-radius:24px;padding:22px}.panelHead{display:flex;justify-content:space-between;gap:20px;align-items:center}.panelHead h2,.authorityPanel h2,.sectionHead h2,.northStar h2{margin:0;font-size:28px}.live{font-size:10px;color:#79e5c2;border:1px solid rgba(121,229,194,.35);padding:8px 10px;border-radius:999px}.mapShell{margin-top:18px}.mapShell svg{width:100%;display:block;border:1px solid rgba(119,218,239,.15);border-radius:22px}.pin{cursor:pointer;outline:none}.mapLegend{display:flex;gap:16px;flex-wrap:wrap;font-size:11px;color:#8fa9b1;margin-top:10px}.dot{width:7px;height:7px;border-radius:50%;display:inline-block;margin-right:6px}.current{background:#f3bf59}.node{background:#7de7f4}.muted{color:#78939c}.chain{margin-top:22px;display:grid;gap:8px}.chainNode{display:flex;gap:12px;padding:12px;border:1px solid rgba(255,255,255,.08);border-radius:12px}.chainNode>span{font-size:10px;color:#64828c}.chainNode strong,.chainNode small{display:block}.chainNode small{color:#6f8b94;font-size:10px;margin-top:3px}.chainNode.active{border-color:rgba(243,191,89,.45);background:rgba(243,191,89,.07)}.stackRule{margin-top:18px;padding:14px;background:rgba(126,222,238,.06);border:1px solid rgba(126,222,238,.15);font-size:12px;line-height:1.55;color:#a9c3ca;border-radius:12px}
        .lawSection{max-width:1370px;margin:auto;padding:32px 34px 80px}.sectionHead{display:flex;justify-content:space-between;gap:24px;align-items:end}.sectionHead>div:first-child{max-width:760px}.sectionHead p{color:#9db3ba}.filters{display:flex;gap:10px}.filters input,.filters select{background:#0b1b25;color:#dbe8eb;border:1px solid rgba(255,255,255,.12);padding:12px 13px;border-radius:10px;min-width:220px}.filters select{min-width:150px}.lawGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:24px}.lawCard{padding:22px;border-radius:18px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(160deg,rgba(255,255,255,.035),rgba(255,255,255,.012));display:flex;flex-direction:column;min-height:390px}.lawMeta{display:flex;justify-content:space-between;gap:12px;font-size:10px;color:#7edeee;text-transform:uppercase;letter-spacing:.1em}.lawMeta b{color:#ddbb73}.lawCard h3{font-size:26px;margin:18px 0 6px}.domain{color:#7d9aa3;font-size:12px}.lawCard>p:not(.domain){color:#aec2c8;line-height:1.55}.gap{margin-top:auto;padding:14px;border-left:2px solid #d2a94d;background:rgba(210,169,77,.06)}.gap small,.gap strong{display:block}.gap small{color:#d2a94d;font-size:9px;letter-spacing:.12em}.gap strong{font-size:12px;line-height:1.5;margin-top:7px;color:#dbe6e8}.actions{margin-top:16px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}.actions a{font-size:11px;text-decoration:none;color:#8edfec;font-weight:800}.actions .primary{background:#e1b659;color:#071019;padding:10px 12px;border-radius:9px}.northStar{max-width:1300px;margin:0 auto 80px;padding:34px;border:1px solid rgba(225,182,89,.25);background:linear-gradient(90deg,rgba(225,182,89,.08),rgba(126,222,238,.05));border-radius:22px}.northStar h2{font-size:clamp(27px,4vw,46px);max-width:1100px}.northStar p:last-child{color:#a9bcc1}
        @media(max-width:980px){.hero,.commandGrid{grid-template-columns:1fr}.heroStats{max-width:600px}.lawGrid{grid-template-columns:1fr 1fr}.sectionHead{align-items:stretch;flex-direction:column}}@media(max-width:680px){.topbar{align-items:flex-start;gap:20px;flex-direction:column;padding:18px}.topbar nav{flex-wrap:wrap;gap:12px}.hero{padding:48px 18px 26px}.heroStats{grid-template-columns:1fr}.commandGrid,.lawSection{padding-left:18px;padding-right:18px}.panelHead{align-items:flex-start;flex-direction:column}.mapShell svg{min-height:310px}.mapLegend{display:grid}.lawGrid{grid-template-columns:1fr}.filters{flex-direction:column}.filters input,.filters select{min-width:0;width:100%;box-sizing:border-box}.lawCard{min-height:0}.northStar{margin:0 18px 50px;padding:24px}.hero h1{font-size:47px}}
      `}</style>
    </main>
  );
}
