"use client";

import { useState } from "react";

export type ReplayStage = {
  label: string;
  title: string;
  state: string;
  determination: string;
  explanation: string;
  supports?: string;
  limit?: string;
};

export default function RecordedExaminationPlayer({
  eyebrow, title, intro, stages,
}: {
  eyebrow: string; title: string; intro: string; stages: ReplayStage[];
}) {
  const [index, setIndex] = useState(0);
  const stage = stages[index];
  const upper = stage.determination.toUpperCase();
  const tone = upper.includes("NOT") || upper.includes("BLOCK") || upper.includes("DENY")
    ? "red" : upper.includes("PARTIAL") || upper.includes("OPEN") || upper.includes("HOLD") ? "amber" : "green";

  return (
    <section className="recorded-player">
      <div className="rp-head">
        <div><p>{eyebrow}</p><h2>{title}</h2><span>{intro}</span></div>
        <b>HISTORICAL RECORD · INTERACTIVE REPLAY</b>
      </div>

      <div className="rp-track" aria-label="Recorded examination stages">
        {stages.map((s, i) => (
          <button type="button" key={s.label} className={i === index ? "active" : i < index ? "seen" : ""} onClick={() => setIndex(i)}>
            <small>{String(i + 1).padStart(2, "0")}</small><strong>{s.label}</strong>
          </button>
        ))}
      </div>

      <div className="rp-stage">
        <div className="rp-state">
          <small>CURRENT REPLAY STATE</small><h3>{stage.title}</h3><p>{stage.state}</p>
          <div className={"rp-determination " + tone}><span>RECORDED DETERMINATION</span><strong>{stage.determination}</strong></div>
        </div>
        <div className="rp-record">
          <small>WHY THE RECORD CHANGED</small><p>{stage.explanation}</p>
          {stage.supports && <div className="support"><b>THE RECORD SUPPORTS</b><span>{stage.supports}</span></div>}
          {stage.limit && <div className="limit"><b>THE RECORD DOES NOT ESTABLISH</b><span>{stage.limit}</span></div>}
        </div>
      </div>

      <div className="rp-controls">
        <button type="button" onClick={() => setIndex(0)} disabled={index === 0}>RESTORE FROZEN BASELINE</button>
        <button type="button" className="primary" onClick={() => setIndex(Math.min(stages.length - 1, index + 1))} disabled={index === stages.length - 1}>
          {index === stages.length - 1 ? "RECORDED OUTCOME REACHED" : "APPLY NEXT RECORDED CONDITION →"}
        </button>
      </div>
      <p className="rp-note">This control replays the preserved bounded record. It does not generate a new finding or alter the historical determination.</p>

      <style jsx>{`
        .recorded-player{max-width:1500px;margin:0 auto 28px;padding:34px;border:1px solid rgba(103,220,255,.2);border-radius:26px;background:linear-gradient(145deg,rgba(6,20,33,.96),rgba(2,9,16,.94));box-shadow:0 28px 90px rgba(0,0,0,.25)}
        .rp-head{display:flex;justify-content:space-between;gap:30px;align-items:start}.rp-head p,.rp-state small,.rp-record small{margin:0;color:#76dcff;font-size:.7rem;font-weight:900;letter-spacing:.16em}.rp-head h2{font-size:clamp(1.8rem,3vw,3.2rem);margin:7px 0 12px}.rp-head span{color:#abc5d4;line-height:1.65;max-width:850px;display:block}.rp-head>b{font-size:.66rem;letter-spacing:.13em;color:#ffd37d;border:1px solid rgba(243,187,87,.28);padding:9px 11px;border-radius:999px;white-space:nowrap}
        .rp-track{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:8px;margin:28px 0}.rp-track button{text-align:left;padding:13px;border-radius:13px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);color:#829eaf;cursor:pointer}.rp-track button.active{border-color:rgba(103,220,255,.55);background:rgba(103,220,255,.1);color:#eefaff}.rp-track button.seen{color:#a9d9c5}.rp-track small,.rp-track strong{display:block}.rp-track small{font-size:.62rem;margin-bottom:5px}.rp-track strong{font-size:.72rem;letter-spacing:.05em}
        .rp-stage{display:grid;grid-template-columns:.9fr 1.1fr;gap:18px}.rp-state,.rp-record{padding:25px;border:1px solid rgba(255,255,255,.08);border-radius:18px;background:rgba(255,255,255,.025)}.rp-state h3{font-size:1.5rem;margin:8px 0}.rp-state>p,.rp-record>p{color:#b6ccd9;line-height:1.65}.rp-determination{margin-top:20px;padding:16px;border-radius:14px;border:1px solid rgba(255,255,255,.09)}.rp-determination span,.rp-determination strong{display:block}.rp-determination span{font-size:.63rem;letter-spacing:.13em;color:#91aab9}.rp-determination strong{font-size:1.25rem;margin-top:4px}.rp-determination.green strong{color:#68efb1}.rp-determination.amber strong{color:#ffd37d}.rp-determination.red strong{color:#ff8c95}
        .support,.limit{display:grid;gap:5px;padding:13px 0;border-top:1px solid rgba(255,255,255,.07)}.support b,.limit b{font-size:.64rem;letter-spacing:.12em}.support b{color:#68efb1}.limit b{color:#ff9ba3}.support span,.limit span{color:#a9c1cf;font-size:.86rem;line-height:1.5}
        .rp-controls{display:flex;justify-content:space-between;gap:10px;margin-top:18px}.rp-controls button{min-height:44px;padding:11px 15px;border-radius:11px;border:1px solid rgba(120,210,255,.2);background:rgba(255,255,255,.03);color:#b8d0de;font-weight:850;cursor:pointer}.rp-controls .primary{background:linear-gradient(135deg,#137fa8,#0a5677);color:white}.rp-controls button:disabled{opacity:.38;cursor:not-allowed}.rp-note{color:#6f8c9e;font-size:.75rem;margin:12px 0 0}
        @media(max-width:800px){.recorded-player{padding:22px}.rp-head{display:block}.rp-head>b{display:inline-block;margin-top:15px}.rp-stage{grid-template-columns:1fr}.rp-controls{flex-direction:column}.rp-controls button{width:100%}}
      `}</style>
    </section>
  );
}
