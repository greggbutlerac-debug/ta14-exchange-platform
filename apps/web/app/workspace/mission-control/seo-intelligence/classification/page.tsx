"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Classification = {
  classification: string;
  visits: number;
  events: number;
  pageViews: number;
  clicks: number;
  intentEvents: number;
};

type Payload = {
  generatedAt: string;
  windowDays: number;
  filtering?: {
    mode?: string;
    unfilteredEvents?: number;
    qualifiedHumanEvents?: number;
    classifications?: Classification[];
  };
};

const explanations: Record<string, string> = {
  QUALIFIED_HUMAN: "Acquisition traffic currently admitted into headline SEO demand metrics.",
  KNOWN_PARTICIPANT: "Authenticated or attributable participant traffic preserved but excluded from new-customer acquisition metrics.",
  INTERNAL_OPERATOR: "TA-14 operator/admin activity preserved for audit and excluded from acquisition demand.",
  INFRASTRUCTURE_UNKNOWN: "Traffic resembling hosting/infrastructure activity without sufficient human evidence.",
  UNKNOWN: "Observed traffic that does not yet carry enough evidence to classify as qualified human, participant, operator, infrastructure, or bot.",
  BOT: "Crawler or automated user-agent activity excluded from human acquisition metrics.",
};

export default function SeoClassificationPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [status, setStatus] = useState("Loading classification evidence…");

  useEffect(() => {
    fetch("/api/admin/seo-intelligence", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) throw new Error("Sign in to view this private engine.");
        if (response.status === 403) throw new Error("This engine is restricted to the TA-14 owner account.");
        if (!response.ok) throw new Error("SEO classification evidence is not available.");
        return response.json();
      })
      .then((payload) => { setData(payload); setStatus(""); })
      .catch((error) => setStatus(error.message));
  }, []);

  const rows = data?.filtering?.classifications ?? [];
  const totals = useMemo(() => rows.reduce((acc, row) => ({
    visits: acc.visits + row.visits,
    events: acc.events + row.events,
    pageViews: acc.pageViews + row.pageViews,
    clicks: acc.clicks + row.clicks,
    intentEvents: acc.intentEvents + row.intentEvents,
  }), { visits: 0, events: 0, pageViews: 0, clicks: 0, intentEvents: 0 }), [rows]);

  const unknown = rows.find((row) => row.classification === "UNKNOWN");
  const qualified = rows.find((row) => row.classification === "QUALIFIED_HUMAN");

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <nav style={styles.nav}>
          <Link href="/workspace/mission-control/seo-intelligence" style={styles.link}>← SEO Intelligence</Link>
          <Link href="/workspace/mission-control/seo-intelligence/click-intelligence" style={styles.link}>Click Intelligence →</Link>
        </nav>

        <p style={styles.kicker}>SEO INTELLIGENCE · PRIVATE · CLASSIFICATION EVIDENCE</p>
        <h1 style={styles.h1}>Where did the traffic go?</h1>
        <p style={styles.lead}>This surface exposes the classifier populations behind the headline SEO metrics. A zero in Qualified Human does not mean zero traffic occurred. It means no observed visit currently satisfied the acquisition classifier.</p>

        {status ? <div style={styles.notice}>{status}</div> : null}

        {data ? <>
          <section style={styles.metrics}>
            <Metric label="All classified visits" value={totals.visits} />
            <Metric label="All telemetry events" value={totals.events} />
            <Metric label="All page views" value={totals.pageViews} />
            <Metric label="All clicks" value={totals.clicks} />
            <Metric label="All intent events" value={totals.intentEvents} />
            <Metric label="Qualified-human events" value={data.filtering?.qualifiedHumanEvents ?? 0} />
          </section>

          <section style={styles.boundary}>
            <strong>MEASUREMENT BOUNDARY</strong>
            <p>Headline SEO demand metrics use <code>{data.filtering?.mode ?? "qualified-human-acquisition"}</code>. Raw traffic is preserved separately. The purpose of this page is to show whether traffic is being excluded because it is internal, known-participant, automated, infrastructure-like, or simply unresolved.</p>
          </section>

          <section style={styles.grid}>
            {rows.map((row) => <article key={row.classification} style={styles.card}>
              <div style={styles.cardTop}><strong style={styles.className}>{row.classification}</strong><span style={styles.badge}>{row.visits} visits</span></div>
              <p style={styles.copy}>{explanations[row.classification] ?? "Classifier population."}</p>
              <div style={styles.row}><span>Events</span><strong>{row.events.toLocaleString()}</strong></div>
              <div style={styles.row}><span>Page views</span><strong>{row.pageViews.toLocaleString()}</strong></div>
              <div style={styles.row}><span>Clicks</span><strong>{row.clicks.toLocaleString()}</strong></div>
              <div style={styles.row}><span>Intent events</span><strong>{row.intentEvents.toLocaleString()}</strong></div>
            </article>)}
          </section>

          <section style={styles.diagnosis}>
            <p style={styles.kicker}>DIAGNOSTIC INTERPRETATION</p>
            <h2 style={styles.h2}>{(unknown?.visits ?? 0) > (qualified?.visits ?? 0) ? "Unresolved traffic is larger than admitted acquisition traffic." : "Qualified acquisition traffic is not being dominated by UNKNOWN traffic."}</h2>
            <p style={styles.copy}>If UNKNOWN is substantial, the next repair is not to count it automatically. We inspect what evidence those visits are missing—click activity, recognized human referrer, commercial intent, or authenticated attribution—and repair collection/classification at that boundary.</p>
          </section>
        </> : null}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <article style={styles.metric}><strong>{value.toLocaleString()}</strong><span>{label}</span></article>;
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "radial-gradient(circle at 12% 0%,rgba(40,161,230,.13),transparent 27%),linear-gradient(180deg,#02060c,#06101b 48%,#02060b)", color: "#f5f9ff", fontFamily: "Inter,system-ui,sans-serif" },
  shell: { width: "min(1180px,calc(100% - 32px))", margin: "0 auto", padding: "28px 0 72px" },
  nav: { display: "flex", justifyContent: "space-between", gap: 16, paddingBottom: 20, borderBottom: "1px solid rgba(151,178,209,.15)" },
  link: { color: "#7fd7ff", textDecoration: "none", fontWeight: 800 },
  kicker: { color: "#4dc8ff", fontWeight: 900, fontSize: 11, letterSpacing: ".14em", marginTop: 38 },
  h1: { fontFamily: "Georgia,serif", fontSize: "clamp(44px,7vw,78px)", lineHeight: 1, margin: "14px 0" },
  h2: { fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,44px)", margin: "8px 0 12px" },
  lead: { color: "#b9c9d9", maxWidth: 920, lineHeight: 1.7, fontSize: 17 },
  notice: { marginTop: 20, padding: 16, border: "1px solid rgba(244,198,103,.3)", borderRadius: 14, color: "#f4d99c", background: "rgba(90,64,12,.16)" },
  metrics: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginTop: 28 },
  metric: { padding: 18, border: "1px solid rgba(77,200,255,.16)", borderRadius: 15, background: "rgba(8,16,27,.82)", display: "grid", gap: 6 },
  boundary: { marginTop: 16, padding: 20, border: "1px solid rgba(108,226,173,.2)", borderRadius: 15, background: "rgba(6,35,26,.34)", color: "#bed8cc", lineHeight: 1.6 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14, marginTop: 20 },
  card: { padding: 20, border: "1px solid rgba(151,178,209,.15)", borderRadius: 16, background: "rgba(8,16,27,.88)" },
  cardTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  className: { fontSize: 13, letterSpacing: ".06em" },
  badge: { padding: "5px 8px", borderRadius: 999, background: "rgba(77,200,255,.11)", color: "#8ddeff", fontSize: 12 },
  copy: { color: "#9fb2c5", lineHeight: 1.6 },
  row: { display: "flex", justifyContent: "space-between", gap: 16, padding: "9px 0", borderTop: "1px solid rgba(255,255,255,.055)", color: "#b9c9d9" },
  diagnosis: { marginTop: 24, padding: 24, borderRadius: 18, border: "1px solid rgba(244,198,103,.18)", background: "rgba(30,25,10,.24)" },
};