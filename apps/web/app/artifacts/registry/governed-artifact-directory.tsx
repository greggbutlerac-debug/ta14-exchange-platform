"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GovernedArtifact = {
  artifact_identifier: string;
  case_identifier: string | null;
  governance_registry_identifier: string;
  governance_name: string;
  governance_version: string | null;
  governance_version_verification_status: string;
  artifact_type: string;
  title: string;
  current_record_version: string;
  finding_class: string | null;
  technical_review_status: string | null;
  correction_status: string | null;
  administrative_verification_status: string | null;
  disclosure_state: string;
  public_summary: string;
  public_record_href: string | null;
  registered_at: string;
};

type Feed = {
  count: number;
  records: GovernedArtifact[];
};

export default function GovernedArtifactDirectory() {
  const [records, setRecords] = useState<GovernedArtifact[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/artifacts/governed", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Governed artifact feed returned ${response.status}`);
        return response.json() as Promise<Feed>;
      })
      .then((feed) => {
        if (!active) return;
        setRecords(feed.records ?? []);
        setState("ready");
      })
      .catch((error) => {
        console.error("Unable to load governed artifact directory", error);
        if (active) setState("error");
      });
    return () => { active = false; };
  }, []);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return records;
    return records.filter((record) => [
      record.artifact_identifier,
      record.case_identifier,
      record.governance_registry_identifier,
      record.governance_name,
      record.title,
      record.finding_class,
    ].filter(Boolean).join(" ").toLowerCase().includes(normalized));
  }, [records, query]);

  return (
    <section id="governed-findings" style={{ marginTop: 42, border: "1px solid rgba(255,255,255,.12)", borderRadius: 24, padding: 24, background: "rgba(255,255,255,.025)" }}>
      <div style={{ display: "flex", gap: 18, alignItems: "end", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: ".14em", fontSize: 12, opacity: .62 }}>Live production projection</p>
          <h2 style={{ margin: "8px 0", fontSize: 28 }}>Governed Finding Artifacts</h2>
          <p style={{ margin: 0, maxWidth: 760, lineHeight: 1.65, opacity: .76 }}>Published governed findings are loaded from the TA-14 governed-artifact registry rather than embedded page constants. Source files and admitted evidence remain subject to their recorded disclosure boundaries.</p>
        </div>
        <input aria-label="Search governed finding artifacts" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search governed findings" style={{ minWidth: 260, padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,.18)", background: "rgba(0,0,0,.22)", color: "inherit" }} />
      </div>

      {state === "loading" ? <p style={{ marginTop: 24, opacity: .7 }}>Loading governed artifact records…</p> : null}
      {state === "error" ? <p style={{ marginTop: 24 }}>The governed artifact projection is temporarily unavailable. No fallback record has been invented.</p> : null}
      {state === "ready" && visible.length === 0 ? <p style={{ marginTop: 24, opacity: .7 }}>No published governed findings match this search.</p> : null}

      <div style={{ display: "grid", gap: 14, marginTop: 24 }}>
        {visible.map((record) => (
          <article key={record.artifact_identifier} style={{ border: "1px solid rgba(159,199,255,.18)", borderRadius: 18, padding: 20 }}>
            <div style={{ display: "flex", gap: 12, justifyContent: "space-between", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", opacity: .62 }}>{record.artifact_identifier} · v{record.current_record_version}</div>
                <h3 style={{ margin: "8px 0 6px", fontSize: 21 }}>{record.title}</h3>
                <div style={{ opacity: .72 }}>{record.governance_name} · {record.governance_registry_identifier} · Governance v{record.governance_version ?? "unverified"}</div>
              </div>
              <strong>{record.finding_class ?? record.artifact_type}</strong>
            </div>
            <p style={{ lineHeight: 1.65, opacity: .8 }}>{record.public_summary}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 13, opacity: .72 }}>
              <span>Technical review: {record.technical_review_status ?? "n/a"}</span>
              <span>Correction: {record.correction_status ?? "n/a"}</span>
              <span>Administrative verification: {record.administrative_verification_status ?? "n/a"}</span>
              <span>Disclosure: {record.disclosure_state}</span>
            </div>
            {record.public_record_href ? <p style={{ marginBottom: 0 }}><Link href={record.public_record_href} style={{ color: "#9fc7ff" }}>Inspect governed finding →</Link></p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
