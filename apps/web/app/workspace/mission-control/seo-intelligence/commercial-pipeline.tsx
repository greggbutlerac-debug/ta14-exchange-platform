"use client";

import { useEffect, useMemo, useState } from "react";

type Trial = {
  userId: string;
  email: string | null;
  tier: string | null;
  status: string | null;
  startedAt: string;
  endsAt: string;
  daysRemaining: number;
  sourcePage: string | null;
  utmSource: string | null;
  priority: "ACTIVATION" | "VALUE_PROOF" | "CONVERSION_DUE";
};

type Payload = {
  summary: {
    activeTrials: number;
    conversionDueTrials: number;
    convertedTrials: number;
    attributedPaidSubscriptions: number;
    attributedRevenue: number;
    attributedMrr: number;
  };
  trialPipeline: { active: number; conversionDue: number; converted: number; expired: number };
  attentionQueue: Trial[];
};

const stages = ["Offer", "Click", "Tier Selected", "Activation", "Trial Active", "Value Proof", "Conversion Due", "Paid", "MRR"];

function nextAction(trial: Trial) {
  if (trial.priority === "CONVERSION_DUE") return "Contact now: confirm value delivered, answer objections, and ask whether they want paid continuation.";
  if (trial.priority === "VALUE_PROOF") return "Deliver a concrete outcome before Day 50 and document the value they would lose by leaving.";
  return "Complete onboarding, confirm the intended use case, and get the customer to first useful governed outcome.";
}

export default function CommercialPipeline() {
  const [data, setData] = useState<Payload | null>(null);
  const [state, setState] = useState("Loading commercial pipeline…");

  useEffect(() => {
    fetch("/api/admin/seo-intelligence", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 401 ? "Sign in to view the commercial pipeline." : "Commercial pipeline unavailable.");
        return response.json();
      })
      .then((payload) => { setData(payload); setState(""); })
      .catch((error) => setState(error.message));
  }, []);

  const queue = useMemo(() => data?.attentionQueue || [], [data]);

  return (
    <section className="commercialPipeline" aria-label="TA-14 commercial trial pipeline">
      <div className="pipelineHeader">
        <div>
          <small>COMMERCIAL REVENUE CONTROL</small>
          <h2>60-Day Trial Pipeline</h2>
          <p>Offer → Click → Tier → Activation → Trial → Value → Conversion → Paid → MRR</p>
        </div>
        <div className="revenueState">
          <span><b>${data?.summary.attributedRevenue?.toLocaleString() || "0"}</b> attributed revenue</span>
          <span><b>${data?.summary.attributedMrr?.toLocaleString() || "0"}</b> attributed MRR</span>
        </div>
      </div>

      <div className="stageRail">
        {stages.map((stage, index) => <div className="stage" key={stage}><em>{String(index + 1).padStart(2, "0")}</em><strong>{stage}</strong></div>)}
      </div>

      {state ? <div className="pipelineMessage">{state}</div> : null}

      {data ? <>
        <div className="trialMetrics">
          <article><strong>{data.trialPipeline.active}</strong><span>Active trials</span></article>
          <article><strong>{data.trialPipeline.conversionDue}</strong><span>Conversion due</span></article>
          <article><strong>{data.trialPipeline.converted}</strong><span>Converted trials</span></article>
          <article><strong>{data.trialPipeline.expired}</strong><span>Expired unconverted</span></article>
          <article><strong>{data.summary.attributedPaidSubscriptions}</strong><span>Attributed paid</span></article>
        </div>

        <div className="queuePanel">
          <div className="queueHeading">
            <div><small>ACTION QUEUE</small><h3>Who is closest to paying?</h3></div>
            <span>{queue.length} open trial{queue.length === 1 ? "" : "s"}</span>
          </div>
          {queue.length ? <div className="queueList">
            {queue.map((trial) => <article className={`queueItem ${trial.priority.toLowerCase()}`} key={`${trial.userId}-${trial.startedAt}`}>
              <div className="identity">
                <strong>{trial.email || "Authenticated TA-14 user"}</strong>
                <span>{trial.tier || "Tier not recorded"} · {trial.daysRemaining} day{Math.abs(trial.daysRemaining) === 1 ? "" : "s"} remaining</span>
              </div>
              <div className="source"><span>Source</span><strong>{trial.utmSource || trial.sourcePage || "Direct / unknown"}</strong></div>
              <div className="priority"><span>{trial.priority.replace("_", " ")}</span><p>{nextAction(trial)}</p></div>
            </article>)}
          </div> : <div className="emptyQueue"><strong>No active external 60-day trials yet.</strong><p>The next commercial job is activation: move qualified interest into the trial instead of treating general engagement as a customer.</p></div>}
        </div>

        <div className="commercialBoundary"><strong>COMMERCIAL EVIDENCE BOUNDARY</strong><span>Intent is not a customer. Trial is not paid. Revenue and MRR are asserted only from authoritative billing evidence. No automatic Day-60 charge.</span></div>
      </> : null}

      <style jsx>{`
        .commercialPipeline{position:relative;z-index:3;padding:22px clamp(18px,3vw,46px) 28px;background:linear-gradient(180deg,#07111d,#030810);color:#f5f9ff;font-family:Inter,ui-sans-serif,system-ui,sans-serif;border-bottom:1px solid rgba(151,178,209,.15)}
        .pipelineHeader{max-width:1500px;margin:0 auto 18px;display:flex;justify-content:space-between;gap:22px;align-items:flex-end}.pipelineHeader small,.queueHeading small{color:#67d6ff;letter-spacing:.15em;font-size:.62rem;font-weight:900}.pipelineHeader h2{margin:5px 0 4px;font-size:1.45rem}.pipelineHeader p{margin:0;color:#8fa6bd;font-size:.78rem}.revenueState{display:flex;gap:9px;flex-wrap:wrap}.revenueState span{padding:10px 12px;border:1px solid rgba(244,198,103,.22);border-radius:12px;background:rgba(244,198,103,.05);color:#91a6bb;font-size:.68rem;text-transform:uppercase}.revenueState b{display:block;color:#f4cf78;font-size:1rem;margin-bottom:2px}
        .stageRail{max-width:1500px;margin:0 auto;display:grid;grid-template-columns:repeat(9,minmax(0,1fr));border:1px solid rgba(77,200,255,.14);border-radius:14px;overflow:hidden}.stage{min-height:58px;display:grid;place-content:center;text-align:center;gap:3px;background:rgba(255,255,255,.018);border-right:1px solid rgba(255,255,255,.05)}.stage:last-child{border-right:0}.stage em{font-style:normal;color:#5d7893;font-size:.55rem;font-weight:900}.stage strong{font-size:.68rem}
        .pipelineMessage,.trialMetrics,.queuePanel,.commercialBoundary{max-width:1500px;margin-left:auto;margin-right:auto}.pipelineMessage{margin-top:14px;color:#8fa6bd}.trialMetrics{display:grid;grid-template-columns:repeat(5,1fr);gap:9px;margin-top:14px}.trialMetrics article{padding:13px 14px;border:1px solid rgba(255,255,255,.07);border-radius:13px;background:rgba(255,255,255,.025)}.trialMetrics strong{display:block;font-size:1.35rem}.trialMetrics span{color:#7f96ad;font-size:.66rem;text-transform:uppercase;letter-spacing:.07em}
        .queuePanel{margin-top:14px;padding:18px;border:1px solid rgba(77,200,255,.15);border-radius:16px;background:rgba(9,20,33,.82)}.queueHeading{display:flex;justify-content:space-between;align-items:center;gap:16px}.queueHeading h3{margin:4px 0 0}.queueHeading>span{color:#7f96ad;font-size:.72rem}.queueList{display:grid;gap:9px;margin-top:14px}.queueItem{display:grid;grid-template-columns:1.2fr .7fr 1.5fr;gap:14px;padding:14px;border:1px solid rgba(255,255,255,.07);border-radius:13px;background:rgba(255,255,255,.02)}.queueItem.conversion_due{border-color:rgba(244,198,103,.34);background:rgba(244,198,103,.045)}.queueItem.value_proof{border-color:rgba(77,200,255,.25)}.identity strong,.source strong{display:block;font-size:.78rem}.identity span,.source span{color:#7d94aa;font-size:.66rem}.priority>span{display:inline-block;margin-bottom:5px;color:#e8f5ff;font-size:.61rem;font-weight:900;letter-spacing:.09em}.priority p{margin:0;color:#9fb1c2;font-size:.71rem;line-height:1.5}.emptyQueue{margin-top:14px;padding:18px;border:1px dashed rgba(255,255,255,.1);border-radius:13px;text-align:center}.emptyQueue strong{font-size:.82rem}.emptyQueue p{margin:7px auto 0;max-width:700px;color:#8096ab;font-size:.72rem;line-height:1.5}.commercialBoundary{margin-top:12px;padding:11px 13px;border-left:3px solid #f4c667;background:rgba(244,198,103,.04);display:flex;gap:12px;align-items:flex-start}.commercialBoundary strong{color:#f4d991;font-size:.62rem;letter-spacing:.09em;white-space:nowrap}.commercialBoundary span{color:#958a70;font-size:.68rem;line-height:1.5}
        @media(max-width:980px){.pipelineHeader{display:block}.revenueState{margin-top:13px}.stageRail{grid-template-columns:repeat(3,1fr)}.stage{border-bottom:1px solid rgba(255,255,255,.05)}.trialMetrics{grid-template-columns:repeat(2,1fr)}.queueItem{grid-template-columns:1fr}.commercialBoundary{display:block}.commercialBoundary span{display:block;margin-top:6px}}
      `}</style>
    </section>
  );
}
