"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = { name: string; count: number };
type Data = {
  generatedAt: string;
  windowDays: number;
  degraded?: { identityAttribution?: boolean; subscriptionAttribution?: boolean };
  summary: {
    pageViews: number;
    uniqueVisitors: number;
    clicks: number;
    searchArrivals: number;
    commercialIntentEvents: number;
    commercialIntentVisitors: number;
    averageIntentScore: number;
    authenticatedAttributedUsers: number;
    paidSubscriptions: number;
    attributedPaidSubscriptions: number;
    attributedRevenue: number;
  };
  pages: Item[];
  searchEngines: Item[];
  searchQueries: Item[];
  referrers: Item[];
  campaigns: Item[];
  sources: Item[];
  terms: Item[];
  devices: Item[];
  locations: Item[];
  clickTargets: Item[];
  intentTypes: Item[];
  intentPages: Item[];
  subscriptionPlans: Item[];
};

function DataPanel({ title, eyebrow, items, empty = "No data recorded yet." }: { title: string; eyebrow: string; items: Item[]; empty?: string }) {
  return (
    <section className="panel dataPanel">
      <div className="panelHeading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
        </div>
        <span className="panelState blue">{items?.length || 0} SIGNALS</span>
      </div>
      {items?.length ? (
        <div className="dataRows">
          {items.slice(0, 15).map((item, index) => (
            <div className="dataRow" key={`${item.name}-${index}`}>
              <span>{item.name}</span>
              <strong>{item.count.toLocaleString()}</strong>
            </div>
          ))}
        </div>
      ) : (
        <div className="emptyState">
          <span className="emptyDot" />
          <strong>No recorded signal</strong>
          <p>{empty}</p>
        </div>
      )}
    </section>
  );
}

export default function SeoIntelligencePage() {
  const [data, setData] = useState<Data | null>(null);
  const [status, setStatus] = useState("Loading private telemetry…");

  useEffect(() => {
    fetch("/api/admin/seo-intelligence", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) throw new Error("Sign in to view this private engine.");
        if (response.status === 403) throw new Error("This engine is restricted to the TA-14 owner account.");
        if (!response.ok) throw new Error("SEO Intelligence is not available yet.");
        return response.json();
      })
      .then((payload) => {
        setData(payload);
        setStatus("");
      })
      .catch((error) => setStatus(error.message));
  }, []);

  const degraded = Boolean(data?.degraded?.identityAttribution || data?.degraded?.subscriptionAttribution);
  const metrics = data ? [
    ["Page views", data.summary.pageViews],
    ["Unique visitors", data.summary.uniqueVisitors],
    ["Tracked clicks", data.summary.clicks],
    ["Search arrivals", data.summary.searchArrivals],
    ["Intent events", data.summary.commercialIntentEvents],
    ["Intent visitors", data.summary.commercialIntentVisitors],
    ["Authenticated attribution", data.summary.authenticatedAttributedUsers],
    ["Paid subscriptions", data.summary.paidSubscriptions],
  ] as const : [];

  return (
    <main className="missionControl">
      <div className="gridField" />
      <div className="ambient ambientBlue" />
      <div className="ambient ambientGold" />
      <div className="ambient ambientCyan" />

      <header className="commandHeader">
        <div className="commandBrand">
          <div className="brandSeal"><span>TA</span><strong>14</strong></div>
          <div>
            <small>TA-14 AUTHORITY GOVERNANCE INSTITUTION</small>
            <h1>SEO Intelligence</h1>
          </div>
        </div>
        <div className="commandActions">
          <Link href="/workspace/mission-control" className="headerLink">Mission Control</Link>
          <Link href="/workspace/ai-governance" className="headerLink">AI Governance</Link>
          <Link href="/workspace/ai-governance/registry" className="headerLink">Registry</Link>
          <Link href="/" className="headerPrimary">Return to Institution →</Link>
        </div>
      </header>

      <section className="institutionBar">
        <div className="identityBlock">
          <span className="liveDot" />
          <div>
            <small>PRIVATE INSTITUTIONAL INTELLIGENCE</small>
            <strong>Discovery → Intent → Identity → Conversion → Revenue</strong>
          </div>
        </div>
        <div className="authorityPills">
          <span>Visibility: private</span>
          <span>Window: {data?.windowDays || 30} days</span>
          <span>Raw IP: not stored</span>
        </div>
      </section>

      <section className="heroSection">
        <div className="heroCopy">
          <p className="eyebrow">INSTITUTIONAL DEMAND INTELLIGENCE</p>
          <h2>See how the Exchange is found.<span> See what becomes demand.</span></h2>
          <p className="heroLead">SEO Intelligence connects public discovery signals to bounded commercial intent, authenticated identity, authoritative subscription state, and eventually verified revenue—without confusing attention with evidence of a sale.</p>
          <div className="heroActions">
            <a href="#signal-detail" className="primaryAction">Inspect Signal Detail →</a>
            <Link href="/workspace/mission-control" className="secondaryAction">Return to Mission Control</Link>
          </div>
        </div>

        <div className="heroStatus">
          <div className="statusHeader">
            <div>
              <small>INTELLIGENCE STATE</small>
              <strong>{degraded ? "Operational · attribution attention required" : "Operational · evidence surface current"}</strong>
            </div>
            <span className={`stateBadge ${degraded ? "warn" : ""}`}>{degraded ? "DEGRADED" : "LIVE"}</span>
          </div>
          <div className="statusMetrics">
            <article><span>{data?.summary.uniqueVisitors.toLocaleString() || "0"}</span><small>Visitors observed</small></article>
            <article><span>{data?.summary.searchArrivals.toLocaleString() || "0"}</span><small>Search arrivals</small></article>
            <article><span>{data?.summary.commercialIntentVisitors.toLocaleString() || "0"}</span><small>Intent visitors</small></article>
            <article><span>{data?.summary.attributedPaidSubscriptions.toLocaleString() || "0"}</span><small>Paid conversions</small></article>
          </div>
          <div className="currentFocus">
            <small>CURRENT MEASUREMENT BOUNDARY</small>
            <strong>Revenue remains unasserted until monetary evidence is connected.</strong>
            <p>Behavioral intent is not treated as a customer, and a customer is not treated as revenue without authoritative billing evidence.</p>
          </div>
        </div>
      </section>

      <section className="chainSection" aria-label="SEO intelligence chain">
        {["Discovery", "Visit", "Behavior", "Intent", "Identity", "Subscription", "Conversion", "Revenue"].map((stage, index) => (
          <div className="chainStage" key={stage}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage}</strong>
            {index < 7 ? <i>→</i> : null}
          </div>
        ))}
      </section>

      {status ? <section className="systemMessage panel">{status}</section> : null}

      {data ? (
        <>
          <section className="metricsSection panel">
            <div className="panelHeading wide">
              <div><p className="eyebrow">THIRTY-DAY INSTITUTIONAL SIGNAL</p><h3>Current demand surface</h3></div>
              <span className={`panelState ${degraded ? "gold" : "green"}`}>{degraded ? "ATTRIBUTION DEGRADED" : "CURRENT"}</span>
            </div>
            <div className="metricGrid">
              {metrics.map(([label, value]) => (
                <article className="metricCard" key={label}><span>{Number(value).toLocaleString()}</span><small>{label}</small></article>
              ))}
            </div>
            <div className="conversionGrid">
              <article><small>ATTRIBUTED PAID CONVERSIONS</small><strong>{data.summary.attributedPaidSubscriptions.toLocaleString()}</strong></article>
              <article><small>ATTRIBUTED REVENUE</small><strong>${data.summary.attributedRevenue.toLocaleString()}</strong></article>
              <article><small>AVERAGE INTENT SCORE</small><strong>{data.summary.averageIntentScore.toLocaleString()}</strong></article>
            </div>
            <div className="evidenceBoundary"><strong>EVIDENCE BOUNDARY</strong><p>Private owner view · rolling {data.windowDays}-day traffic window · no raw IP address stored. Intent is inferred behavior. Authenticated attribution requires a signed-in TA-14 identity. Paid conversion requires the authoritative billing ledger.</p></div>
          </section>

          <section id="signal-detail" className="detailIntro"><p className="eyebrow">SIGNAL DETAIL</p><h3>What the Exchange is telling us</h3></section>
          <section className="detailGrid">
            <DataPanel eyebrow="COMMERCIAL" title="Paid subscription plans" items={data.subscriptionPlans} empty="No authoritative paid subscriptions recorded yet." />
            <DataPanel eyebrow="INTENT" title="Commercial intent categories" items={data.intentTypes} />
            <DataPanel eyebrow="INTENT" title="Pages producing intent" items={data.intentPages} />
            <DataPanel eyebrow="CONTENT" title="Top Exchange pages" items={data.pages} />
            <DataPanel eyebrow="BEHAVIOR" title="What people click" items={data.clickTargets} />
            <DataPanel eyebrow="DISCOVERY" title="Search engines & AI referrers" items={data.searchEngines} />
            <DataPanel eyebrow="DISCOVERY" title="Search terms observed" items={data.searchQueries} />
            <DataPanel eyebrow="SOURCE" title="Traffic sources" items={data.referrers} />
            <DataPanel eyebrow="GEOGRAPHY" title="Approximate geographic demand" items={data.locations} />
            <DataPanel eyebrow="CAMPAIGN" title="Campaign names" items={data.campaigns} />
            <DataPanel eyebrow="CAMPAIGN" title="UTM sources" items={data.sources} />
            <DataPanel eyebrow="CAMPAIGN" title="UTM terms / keyword campaigns" items={data.terms} />
            <DataPanel eyebrow="DEVICE" title="Devices" items={data.devices} />
          </section>
        </>
      ) : null}

      <footer className="institutionFooter">
        <div><strong>TA-14 Authority Governance Institution</strong><span>No admissible evidence. No admissible execution.</span></div>
        <nav><Link href="/workspace/mission-control">Mission Control</Link><Link href="/workspace/ai-governance">AI Governance</Link><Link href="/academy">Academy</Link><Link href="/workspace/ai-governance/registry">Registry</Link></nav>
      </footer>

      <style jsx>{`
        .missionControl{--bg:#03070d;--panel:rgba(8,16,27,.9);--line:rgba(151,178,209,.15);--text:#f5f9ff;--muted:#91a5bd;--blue:#4dc8ff;--cyan:#6be7ef;--gold:#f4c667;--green:#6ce2ad;position:relative;min-height:100vh;overflow:hidden;color:var(--text);background:radial-gradient(circle at 12% 0%,rgba(40,161,230,.13),transparent 27%),radial-gradient(circle at 88% 8%,rgba(244,198,103,.08),transparent 24%),linear-gradient(180deg,#02060c 0%,#06101b 42%,#02060b 100%);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.missionControl *{box-sizing:border-box}.missionControl a{color:inherit;text-decoration:none}.gridField{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.19;background-image:linear-gradient(rgba(255,255,255,.024) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.024) 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(to bottom,#000 0%,rgba(0,0,0,.72) 55%,transparent 100%)}.ambient{position:fixed;z-index:0;width:380px;height:380px;border-radius:999px;filter:blur(100px);pointer-events:none;opacity:.12}.ambientBlue{left:-170px;top:260px;background:#2ea8ff}.ambientGold{right:-190px;top:520px;background:#f2bf55}.ambientCyan{left:38%;bottom:-250px;background:#52e6e7}.commandHeader,.institutionBar,.heroSection,.chainSection,.metricsSection,.detailIntro,.detailGrid,.systemMessage,.institutionFooter{position:relative;z-index:2}.commandHeader{position:sticky;top:0;z-index:80;min-height:82px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:14px clamp(18px,3vw,46px);border-bottom:1px solid var(--line);background:rgba(3,8,15,.9);backdrop-filter:blur(24px);box-shadow:0 18px 45px rgba(0,0,0,.24)}.commandBrand,.commandActions,.identityBlock,.authorityPills,.heroActions,.panelHeading,.institutionFooter,.institutionFooter nav{display:flex;align-items:center}.commandBrand{gap:14px}.brandSeal{width:52px;height:52px;display:grid;grid-template-columns:1fr 1fr;place-items:center;flex:0 0 52px;border:1px solid rgba(93,210,255,.42);border-radius:16px;color:#e9f9ff;background:linear-gradient(145deg,rgba(44,179,236,.25),rgba(5,13,24,.9));box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 14px 32px rgba(22,162,226,.14);font-weight:900;letter-spacing:-.06em}.brandSeal span{font-size:.66rem;color:#8adfff}.brandSeal strong{font-size:1.04rem}.commandBrand small{display:block;color:#7790aa;font-size:.64rem;letter-spacing:.16em}.commandBrand h1{margin:4px 0 0;font-size:1rem}.commandActions{gap:8px;flex-wrap:wrap;justify-content:flex-end}.headerLink,.headerPrimary{min-height:40px;display:inline-flex;align-items:center;justify-content:center;padding:0 13px;border-radius:11px;font-size:.74rem;font-weight:800;transition:160ms ease}.headerLink{border:1px solid rgba(255,255,255,.1);color:#c6d5e6;background:rgba(255,255,255,.035)}.headerPrimary{border:1px solid rgba(76,202,255,.4);color:#effbff;background:linear-gradient(135deg,rgba(30,170,230,.26),rgba(32,102,173,.18))}.headerLink:hover,.headerPrimary:hover{transform:translateY(-1px);border-color:rgba(103,217,255,.5)}.institutionBar{min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:10px clamp(18px,3vw,46px);border-bottom:1px solid rgba(255,255,255,.07);background:rgba(4,11,20,.72)}.identityBlock{gap:11px}.liveDot{width:10px;height:10px;border-radius:50%;background:var(--green);box-shadow:0 0 0 5px rgba(108,226,173,.08),0 0 20px rgba(108,226,173,.42)}.identityBlock small{display:block;color:#6f849d;font-size:.62rem;letter-spacing:.14em}.identityBlock strong{display:block;margin-top:4px;color:#d9e7f6;font-size:.76rem}.authorityPills{gap:8px;flex-wrap:wrap;justify-content:flex-end}.authorityPills span{padding:7px 10px;border:1px solid rgba(255,255,255,.08);border-radius:999px;color:#91a7bf;background:rgba(255,255,255,.025);font-size:.64rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.heroSection{max-width:1500px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(360px,.65fr);gap:28px;padding:clamp(54px,7vw,100px) clamp(18px,3vw,46px) 42px}.eyebrow{margin:0 0 10px;color:var(--blue);font-size:.66rem;font-weight:900;letter-spacing:.19em;text-transform:uppercase}.heroCopy h2{max-width:900px;margin:0;font-size:clamp(2.6rem,5vw,5.6rem);line-height:.98;letter-spacing:-.055em}.heroCopy h2 span{display:block;color:transparent;background:linear-gradient(90deg,#79dfff,#a8edff 48%,#dcefff);background-clip:text}.heroLead{max-width:860px;margin:28px 0 0;color:#a7b8ca;font-size:clamp(1rem,1.5vw,1.16rem);line-height:1.8}.heroActions{gap:12px;flex-wrap:wrap;margin-top:30px}.primaryAction,.secondaryAction{min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding:0 18px;border-radius:13px;font-size:.78rem;font-weight:900;transition:170ms ease}.primaryAction{border:1px solid rgba(84,211,255,.45);color:#f2fcff;background:linear-gradient(135deg,rgba(20,170,232,.34),rgba(41,105,189,.24));box-shadow:0 14px 34px rgba(20,154,220,.12)}.secondaryAction{border:1px solid rgba(255,255,255,.12);color:#dce9f7;background:rgba(255,255,255,.045)}.primaryAction:hover,.secondaryAction:hover{transform:translateY(-2px)}.heroStatus,.panel{border:1px solid var(--line);border-radius:22px;background:linear-gradient(180deg,rgba(15,29,46,.87),rgba(5,13,23,.9));box-shadow:inset 0 1px 0 rgba(255,255,255,.045),0 26px 64px rgba(0,0,0,.18);backdrop-filter:blur(15px)}.heroStatus{align-self:end;padding:22px}.statusHeader{display:flex;align-items:center;justify-content:space-between;gap:18px}.statusHeader small{display:block;color:#70879f;font-size:.62rem;letter-spacing:.14em}.statusHeader strong{display:block;margin-top:5px;font-size:.9rem}.stateBadge,.panelState{display:inline-flex;align-items:center;justify-content:center;padding:7px 10px;border-radius:999px;font-size:.62rem;font-weight:900;letter-spacing:.1em}.stateBadge{color:#bcffe0;border:1px solid rgba(108,226,173,.32);background:rgba(108,226,173,.08)}.stateBadge.warn{color:#fff0bb;border-color:rgba(244,198,103,.36);background:rgba(244,198,103,.08)}.statusMetrics{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:22px}.statusMetrics article{min-height:92px;display:grid;align-content:center;gap:5px;padding:12px;border:1px solid rgba(255,255,255,.07);border-radius:14px;background:rgba(255,255,255,.026)}.statusMetrics span{font-size:1.6rem;font-weight:900}.statusMetrics small{color:#71869f;font-size:.62rem;line-height:1.35}.currentFocus{margin-top:14px;padding:16px;border:1px solid rgba(244,198,103,.18);border-radius:15px;background:rgba(244,198,103,.055)}.currentFocus small{color:#b89c5f;font-size:.6rem;letter-spacing:.13em}.currentFocus strong{display:block;margin-top:7px;color:#fff2c3;font-size:.86rem}.currentFocus p{margin:8px 0 0;color:#a89c7d;font-size:.72rem;line-height:1.55}.chainSection{max-width:1500px;margin:0 auto;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));padding:0 clamp(18px,3vw,46px) 34px}.chainStage{position:relative;min-height:72px;display:grid;align-content:center;justify-items:center;gap:5px;border-top:1px solid rgba(83,198,255,.17);border-bottom:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.018)}.chainStage:first-child{border-left:1px solid rgba(255,255,255,.05);border-radius:14px 0 0 14px}.chainStage:last-child{border-right:1px solid rgba(255,255,255,.05);border-radius:0 14px 14px 0}.chainStage span{color:#64809b;font-size:.58rem;font-weight:900;letter-spacing:.12em}.chainStage strong{font-size:.73rem}.chainStage i{position:absolute;right:-5px;top:50%;z-index:2;color:#4dc8ff;font-style:normal;transform:translateY(-50%)}.metricsSection,.systemMessage{max-width:1500px;margin:0 auto 26px;padding:24px}.panelHeading{justify-content:space-between;gap:18px}.panelHeading h3{margin:4px 0 0;font-size:1.18rem}.panelState.blue{color:#bfefff;border:1px solid rgba(77,200,255,.28);background:rgba(77,200,255,.08)}.panelState.green{color:#bdffe1;border:1px solid rgba(108,226,173,.28);background:rgba(108,226,173,.08)}.panelState.gold{color:#fff0bb;border:1px solid rgba(244,198,103,.28);background:rgba(244,198,103,.08)}.metricGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:22px}.metricCard{min-height:112px;display:grid;align-content:center;gap:8px;padding:17px;border:1px solid rgba(255,255,255,.075);border-radius:16px;background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.018))}.metricCard span{font-size:2rem;font-weight:900;letter-spacing:-.04em}.metricCard small{color:#71869f;font-size:.65rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em}.conversionGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px}.conversionGrid article{padding:20px;border:1px solid rgba(77,200,255,.13);border-radius:16px;background:rgba(77,200,255,.035)}.conversionGrid small{display:block;color:#6f849d;font-size:.6rem;letter-spacing:.12em}.conversionGrid strong{display:block;margin-top:8px;font-size:2rem}.evidenceBoundary{margin-top:14px;padding:16px;border:1px solid rgba(244,198,103,.15);border-radius:15px;background:rgba(244,198,103,.04)}.evidenceBoundary strong{color:#f2d58e;font-size:.66rem;letter-spacing:.13em}.evidenceBoundary p{margin:7px 0 0;color:#9caec1;font-size:.76rem;line-height:1.6}.detailIntro{max-width:1500px;margin:42px auto 16px;padding:0 clamp(18px,3vw,46px)}.detailIntro h3{margin:0;font-size:1.6rem}.detailGrid{max-width:1500px;margin:0 auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;padding:0 clamp(18px,3vw,46px) 48px}.dataPanel{padding:22px}.dataRows{display:grid;gap:8px;margin-top:18px}.dataRow{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:11px 12px;border:1px solid rgba(255,255,255,.06);border-radius:12px;background:rgba(255,255,255,.022)}.dataRow span{color:#a6b8ca;font-size:.78rem;overflow-wrap:anywhere}.dataRow strong{flex:0 0 auto;min-width:34px;padding:5px 8px;border-radius:999px;color:#dff8ff;background:rgba(77,200,255,.08);font-size:.72rem;text-align:center}.emptyState{margin-top:18px;padding:26px;border:1px dashed rgba(255,255,255,.1);border-radius:15px;text-align:center;background:rgba(255,255,255,.015)}.emptyDot{display:block;width:8px;height:8px;margin:0 auto 10px;border-radius:50%;background:#4dc8ff;box-shadow:0 0 16px rgba(77,200,255,.55)}.emptyState strong{display:block;font-size:.82rem}.emptyState p{margin:6px 0 0;color:#71869f;font-size:.72rem}.institutionFooter{justify-content:space-between;gap:24px;padding:28px clamp(18px,3vw,46px);border-top:1px solid var(--line);background:rgba(2,7,13,.72)}.institutionFooter div strong,.institutionFooter div span{display:block}.institutionFooter div strong{font-size:.78rem}.institutionFooter div span{margin-top:5px;color:#71869f;font-size:.68rem}.institutionFooter nav{gap:16px;flex-wrap:wrap}.institutionFooter nav a{color:#91a7bf;font-size:.7rem}.institutionFooter nav a:hover{color:#dff7ff}@media(max-width:1050px){.heroSection{grid-template-columns:1fr}.heroStatus{max-width:none}.metricGrid{grid-template-columns:repeat(2,1fr)}.chainSection{grid-template-columns:repeat(4,1fr)}.chainStage:nth-child(4){border-radius:0 14px 14px 0}.chainStage:nth-child(5){border-left:1px solid rgba(255,255,255,.05);border-radius:14px 0 0 14px}.detailGrid{grid-template-columns:1fr}}@media(max-width:720px){.commandHeader,.institutionBar,.institutionFooter{align-items:flex-start;flex-direction:column}.commandActions,.authorityPills{justify-content:flex-start}.heroSection{padding-top:44px}.heroCopy h2{font-size:2.65rem}.statusMetrics,.metricGrid,.conversionGrid{grid-template-columns:1fr 1fr}.chainSection{grid-template-columns:repeat(2,1fr)}.chainStage{border-radius:0!important}.chainStage:nth-child(odd){border-left:1px solid rgba(255,255,255,.05)}.detailGrid{padding-bottom:32px}.institutionFooter nav{gap:11px}}@media(max-width:480px){.statusMetrics,.metricGrid,.conversionGrid{grid-template-columns:1fr}}
      `}</style>
    </main>
  );
}
