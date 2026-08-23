"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type GovernedFeed = {
  count: number;
  records: Array<{
    finding_class: string | null;
    governance_registry_identifier: string;
    governance_name: string;
    public_record_href: string | null;
  }>;
};

export default function ArtifactClassSummary() {
  const [governedCount, setGovernedCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/artifacts/governed", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Governed artifact feed returned ${response.status}`);
        return response.json() as Promise<GovernedFeed>;
      })
      .then((feed) => {
        if (!active) return;
        setGovernedCount(feed.count ?? 0);
        setStatus("ready");
      })
      .catch((error) => {
        console.error("Unable to load governed artifact metric", error);
        if (active) setStatus("error");
      });
    return () => { active = false; };
  }, []);

  return (
    <section
      aria-label="Artifact registry class summary"
      style={{
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 24,
        padding: 24,
        background: "rgba(255,255,255,.025)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap", alignItems: "end" }}>
        <div>
          <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: ".15em", fontSize: 12, opacity: .58 }}>Exchange artifact registry</p>
          <h2 style={{ margin: "8px 0 8px", fontSize: "clamp(1.8rem,4vw,3rem)" }}>One registry. Distinct governed artifact classes.</h2>
          <p style={{ margin: 0, maxWidth: 780, lineHeight: 1.7, opacity: .74 }}>
            The Exchange preserves execution evidence and governed review findings under separate artifact classes so each record retains its own proposition, verification state, and claims boundary.
          </p>
        </div>
        <nav aria-label="Artifact class navigation" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="#directory" style={linkStyle}>Execution artifacts</Link>
          <Link href="#governed-findings" style={linkStyle}>Governed findings</Link>
        </nav>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginTop: 24 }}>
        <Metric label="Execution artifact corpus" value="41" detail="40 TA-14 execution artifacts · 1 external governance execution artifact" />
        <Metric label="Governed finding corpus" value={status === "ready" ? String(governedCount ?? 0) : status === "error" ? "—" : "…"} detail={status === "error" ? "Live governed-finding metric unavailable" : "Live from production governed-artifact projection"} />
        <Metric label="Artifact classes" value="2" detail="Execution artifacts · Governed finding artifacts" />
        <Metric label="Registry principle" value="Bounded" detail="Artifact class never widens the proposition the evidence can support" />
      </div>
    </section>
  );
}

const linkStyle = {
  color: "#dbeaff",
  textDecoration: "none",
  border: "1px solid rgba(159,199,255,.24)",
  borderRadius: 999,
  padding: "10px 14px",
  background: "rgba(159,199,255,.06)",
  fontWeight: 700,
  fontSize: 13,
} as const;

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article style={{ border: "1px solid rgba(159,199,255,.16)", borderRadius: 18, padding: 18, background: "rgba(0,0,0,.12)" }}>
      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".1em", opacity: .56 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 30, fontWeight: 800, lineHeight: 1.05 }}>{value}</div>
      <p style={{ margin: "9px 0 0", lineHeight: 1.55, opacity: .68, fontSize: 13 }}>{detail}</p>
    </article>
  );
}
