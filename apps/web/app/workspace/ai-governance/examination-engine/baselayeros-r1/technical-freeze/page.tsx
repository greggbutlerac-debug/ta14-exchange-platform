import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { baseLayerTechnicalFreezeRecord as freeze, type FreezeGate } from "@/lib/governance/technical-freeze-record";
import { IssueFreezeForm } from "./issue-freeze-form";

export const metadata = { title: "BaseLayerOS R1 Technical Freeze | TA-14 Exchange" };
export const dynamic = "force-dynamic";
const panel: React.CSSProperties = { border: "1px solid rgba(148,163,184,.25)", borderRadius: 18, padding: 22, background: "rgba(15,23,42,.58)" };

type PersistedFreeze = {
  record_id: string;
  status: "DRAFT" | "TECHNICAL_FREEZE_ISSUED" | "SUPERSEDED" | "WITHDRAWN";
  participant_review_state: "COMPLETE" | "INCOMPLETE";
  gate_state: FreezeGate[] | null;
  frozen_objects: Array<{ id: string; sha256: string }> | null;
  freeze_sha256: string | null;
  issued_at: string | null;
};

export default async function TechnicalFreezePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consequence_technical_freezes")
    .select("record_id,status,participant_review_state,gate_state,frozen_objects,freeze_sha256,issued_at")
    .eq("record_id", freeze.recordId)
    .maybeSingle();

  const persisted = data as PersistedFreeze | null;
  const gates: readonly FreezeGate[] = persisted?.gate_state?.length ? persisted.gate_state : freeze.gates;
  const satisfied = gates.filter(g => g.state === "SATISFIED").length;
  const issued = persisted?.status === "TECHNICAL_FREEZE_ISSUED" && !!persisted.freeze_sha256 && !!persisted.issued_at;
  const allGatesResolved = !!persisted && gates.length === freeze.gates.length && gates.every(g => g.state === "SATISFIED" || (g.state === "NOT_APPLICABLE" && !!g.resolutionReason?.trim()));
  const evidenceBound = !!persisted?.frozen_objects?.length && gates.filter(g => g.state === "SATISFIED").every(g => !!g.evidenceObjectIds?.length);
  const readyToIssue = persisted?.status === "DRAFT" && persisted.participant_review_state === "COMPLETE" && allGatesResolved && evidenceBound && !error;
  const executionState = issued ? "UNLOCKED BY PERSISTED TECHNICAL FREEZE" : "LOCKED";
  const status = persisted?.status ?? freeze.status;

  return <main style={{ maxWidth: 1120, margin: "0 auto", padding: "44px 24px 80px", color: "#e5e7eb" }}>
    <p style={{ color: "#94a3b8", letterSpacing: ".14em", fontSize: 12 }}>TA-14 TECHNICAL FREEZE CONTROL</p>
    <h1 style={{ fontSize: "clamp(2rem,5vw,4rem)", lineHeight: 1.04 }}>BaseLayerOS / TA-14 R1 Technical Freeze</h1>
    <p><strong>{freeze.recordId}</strong></p><p style={{ color: issued ? "#86efac" : "#fbbf24", fontWeight: 900 }}>{status}</p>
    <section style={{ ...panel, margin: "28px 0" }}><h2>Freeze rule</h2><p style={{ lineHeight: 1.7 }}>{freeze.rule}</p><p><strong>Current readiness:</strong> {satisfied}/{gates.length} required gates satisfied.</p><p><strong>Participant factual review:</strong> {persisted?.participant_review_state ?? "NO PERSISTED DRAFT"}</p><p><strong>Evidence binding:</strong> {evidenceBound ? "ESTABLISHED" : "NOT ESTABLISHED"}</p><p style={{ color: issued ? "#86efac" : "#fca5a5", fontWeight: 800 }}>EXAMINATION EXECUTION: {executionState}</p>{error && <p style={{ color: "#fca5a5" }}>Persistence verification unavailable. Fail-closed state preserved.</p>}<IssueFreezeForm ready={readyToIssue} issued={issued} /></section>
    <section style={{ margin: "34px 0" }}><h2>Freeze gates</h2><div style={{ display: "grid", gap: 12 }}>{gates.map(g => <article key={g.id} style={panel}><small style={{ color: "#94a3b8" }}>{g.id}</small><h3>{g.title}</h3><p>{g.requiredObject}</p><p style={{ color: g.state === "SATISFIED" ? "#86efac" : "#fca5a5", fontWeight: 800 }}>{g.state}</p></article>)}</div></section>
    {persisted?.freeze_sha256 && <section style={{ ...panel, margin: "34px 0" }}><h2>Persisted freeze identity</h2><p style={{ overflowWrap: "anywhere" }}><strong>SHA-256:</strong> {persisted.freeze_sha256}</p><p><strong>Issued:</strong> {persisted.issued_at ?? "NOT ISSUED"}</p></section>}
    <section style={{ ...panel, margin: "34px 0" }}><h2>Cryptographic issuance requirements</h2><ol>{freeze.issuanceRequirements.map(v => <li key={v} style={{ margin: "10px 0" }}>{v}</li>)}</ol><p><strong>{freeze.executableRule}</strong></p></section>
    <section style={{ ...panel, marginTop: 34 }}><h2>Historical integrity</h2><p>A Technical Freeze is issued as a new immutable evidence object. It does not overwrite intake, participant factual review, or the pre-freeze proposal. Later corrections, replays, successor versions, and findings accumulate against the frozen chronology.</p><p><strong>No persisted issued freeze. No execution.</strong></p><Link href="/workspace/ai-governance/examination-engine/baselayeros-r1">← Participant Review</Link></section>
  </main>;
}
