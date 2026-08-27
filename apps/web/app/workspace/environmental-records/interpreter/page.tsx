"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { EnvironmentalPropositionBoundary, EntitlementStanding, PropositionEntitlement } from "../../../../lib/environmental-governance/proposition-entitlement";
import { validateDeterminationBoundary, type BoundedEnvironmentalDetermination, type EnvironmentalDeterminationState } from "../../../../lib/environmental-governance/bounded-determination";

const WORKSPACE_KEY = "ta14-governed-record-interpreter-workspace-v2";
const LIBRARY_KEY = "ta14-governed-record-interpreter-library-v2";

type EnvironmentalInterpreterPayload = {
  interpretationId?: string; status?: string; version?: string; recordClass?: string; interpretationQuestion?: string; sourceRecordText?: string;
  supportedFinding?: string; continuityFinding?: string; calibrationFinding?: string; timeBoundaryFinding?: string; refusedConclusion?: string; nextAdmissibleStep?: string;
  hasGap?: boolean; hasCalibrationConcern?: boolean; hasTimeBoundary?: boolean; entitlementId?: string; entitlementStanding?: EntitlementStanding;
  entitledProposition?: string; entitlementBoundary?: EnvironmentalPropositionBoundary; entitlementLimitations?: string[]; prohibitedExtensions?: string[]; evidenceRefs?: string[];
  createdAt?: string; updatedAt?: string; resultSummary?: string; determinationState?: EnvironmentalDeterminationState; determinationReasons?: string[];
};

function createIdentifier(prefix: string) {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
  return `${prefix}-${stamp}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function stateForStanding(standing: EntitlementStanding): EnvironmentalDeterminationState {
  if (standing === "ESTABLISHED") return "SUPPORTED";
  if (standing === "PARTIAL") return "PARTIALLY_SUPPORTED";
  if (standing === "NOT_ESTABLISHED") return "UNSUPPORTED";
  return "INDETERMINATE";
}

export default function EnvironmentalRecordInterpreterPage() {
  const [payload, setPayload] = useState<EnvironmentalInterpreterPayload | null>(null);
  const [sourceSnapshot, setSourceSnapshot] = useState("");
  const [question, setQuestion] = useState("");
  const [determinationText, setDeterminationText] = useState("");
  const [notice, setNotice] = useState("");
  const [preserved, setPreserved] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(WORKSPACE_KEY);
    if (!saved) { setNotice("HOLD — no admitted environmental evidence package is present. Return to the Environmental Records Playground and establish readiness first."); return; }
    try {
      const parsed = JSON.parse(saved) as EnvironmentalInterpreterPayload;
      setPayload(parsed); setSourceSnapshot(parsed.sourceRecordText ?? ""); setQuestion(parsed.interpretationQuestion ?? "");
      setDeterminationText(parsed.resultSummary || "The admitted environmental evidence supports only a bounded interpretation of the entitled proposition. Any unresolved continuity, calibration, threshold, authority, or evidentiary limitation remains preserved and no broader causal, health, or execution claim is established.");
    } catch { setNotice("HOLD — the admitted environmental evidence package could not be parsed."); }
  }, []);

  const entitlement = useMemo<PropositionEntitlement | null>(() => {
    if (!payload?.entitlementId || !payload.entitlementStanding || !payload.entitledProposition || !payload.entitlementBoundary) return null;
    return { entitlementId: payload.entitlementId, proposition: payload.entitledProposition, evidenceRefs: payload.evidenceRefs ?? [], boundary: payload.entitlementBoundary, standing: payload.entitlementStanding, limitations: payload.entitlementLimitations ?? [], prohibitedExtensions: payload.prohibitedExtensions ?? [], createdAt: payload.createdAt ?? new Date().toISOString() };
  }, [payload]);

  const determination = useMemo<BoundedEnvironmentalDetermination | null>(() => {
    if (!entitlement) return null;
    return { determinationId: createIdentifier("TA14-DET"), entitlementId: entitlement.entitlementId, proposition: question.trim(), state: stateForStanding(entitlement.standing), determinationText: determinationText.trim(), establishedBoundary: entitlement.boundary, evidenceRefs: entitlement.evidenceRefs, unresolvedConditions: entitlement.limitations, prohibitedExtensions: entitlement.prohibitedExtensions, createdAt: new Date().toISOString() };
  }, [determinationText, entitlement, question]);

  const bounding = useMemo(() => (!entitlement || !determination) ? { valid: false, reasons: ["ENTITLEMENT_NOT_PRESENT"] } : validateDeterminationBoundary(entitlement, determination), [determination, entitlement]);
  const sourceAltered = Boolean(payload?.sourceRecordText && sourceSnapshot !== payload.sourceRecordText);
  const canPreserve = Boolean(entitlement && bounding.valid && !sourceAltered && determinationText.trim());

  function preserveDetermination() {
    if (!payload || !entitlement || !determination) { setNotice("HOLD — proposition entitlement is not present. This interpretation cannot be preserved as an entitled environmental determination."); return; }
    if (sourceAltered) { setNotice("HOLD — the admitted source package changed after entitlement. Revalidation is required before interpretation can proceed."); return; }
    if (!bounding.valid) { setNotice(`HOLD — interpretation exceeds the admitted proposition boundary: ${bounding.reasons.join(", ")}.`); return; }
    const now = new Date().toISOString();
    const record: EnvironmentalInterpreterPayload = { ...payload, interpretationId: payload.interpretationId || createIdentifier("TA-14-ERI"), status: "PRESERVED", version: payload.version || "1.0", interpretationQuestion: entitlement.proposition, resultSummary: determination.determinationText, determinationState: determination.state, determinationReasons: [], updatedAt: now, createdAt: payload.createdAt || now };
    let library: EnvironmentalInterpreterPayload[] = [];
    const existingRaw = window.localStorage.getItem(LIBRARY_KEY);
    if (existingRaw) { try { const parsed = JSON.parse(existingRaw) as EnvironmentalInterpreterPayload[]; library = Array.isArray(parsed) ? parsed : []; } catch { library = []; } }
    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(record));
    window.localStorage.setItem(LIBRARY_KEY, JSON.stringify([record, ...library.filter((item) => item.interpretationId !== record.interpretationId)]));
    setPayload(record); setPreserved(true);
    setNotice(`${record.interpretationId} preserved as ${determination.state}. The determination remains bound to entitlement ${entitlement.entitlementId}; no broader authority or causation was created.`);
  }

  if (!payload) return <main style={styles.page}><section style={styles.shell}><p style={styles.kicker}>TA-14 · ENVIRONMENTAL RECORD INTERPRETER</p><h1 style={styles.h1}>HOLD — no entitled evidence package.</h1><p style={styles.copy}>{notice || "Return to the Playground to establish environmental readiness and proposition entitlement."}</p><Link href="/workspace/environmental-records/playground" style={styles.link}>Return to Environmental Records Playground</Link></section></main>;

  return <main style={styles.page}><section style={styles.shell}>
    <nav style={styles.nav}><Link href="/workspace/environmental-records/playground" style={styles.link}>← Environmental Records Playground</Link><span style={styles.muted}>Protected ERI boundary</span></nav>
    <p style={styles.kicker}>ENVIRONMENTAL RECORD INTERPRETER · ENTITLEMENT-BOUND</p><h1 style={styles.h1}>Interpret the record without widening what the evidence earned.</h1><p style={styles.copy}>The admitted evidence package, proposition, and environmental object remain separate from the resulting determination. ERI may interpret within the established entitlement; it may not silently create a broader claim.</p>{notice ? <div style={styles.notice}>{notice}</div> : null}
    {!entitlement ? <div style={styles.hold}><strong>HOLD — entitlement missing.</strong><p style={styles.copy}>Re-run the record through the Environmental Records Playground before preserving an environmental determination.</p></div> : <>
      <section style={styles.grid}><article style={styles.card}><p style={styles.cardLabel}>ADMITTED PROPOSITION ENTITLEMENT</p><h2 style={styles.h2}>{entitlement.standing}</h2><dl style={styles.meta}><div><dt>Entitlement ID</dt><dd>{entitlement.entitlementId}</dd></div><div><dt>Proposition</dt><dd>{entitlement.proposition}</dd></div><div><dt>Object</dt><dd>{entitlement.boundary.inspectionObject}</dd></div><div><dt>Temporal boundary</dt><dd>{entitlement.boundary.temporalBoundary || "Not separately established"}</dd></div><div><dt>Spatial boundary</dt><dd>{entitlement.boundary.spatialBoundary || "Not separately established"}</dd></div><div><dt>Threshold reference</dt><dd>{entitlement.boundary.thresholdReference || "Not separately established"}</dd></div></dl></article>
      <article style={styles.card}><p style={styles.cardLabel}>BOUNDARY STATUS</p><h2 style={styles.h2}>{bounding.valid && !sourceAltered ? "WITHIN ENTITLEMENT" : "HOLD"}</h2><p style={styles.copy}>Determination state: <strong>{determination?.state}</strong>. Preservation follows the admitted standing and cannot inflate it.</p>{sourceAltered ? <p style={styles.reason}>CMT_REALITY_CHANGED / evidence package altered after entitlement.</p> : null}{bounding.reasons.map((reason) => <p key={reason} style={styles.reason}>{reason}</p>)}</article></section>
      <section style={styles.card}><p style={styles.cardLabel}>ENTITLED PROPOSITION · LOCKED</p><textarea value={question} readOnly rows={3} style={{...styles.textarea, opacity: .88}} /></section>
      <section style={styles.card}><p style={styles.cardLabel}>ADMITTED SOURCE PACKAGE · LOCKED</p><textarea value={sourceSnapshot} readOnly rows={12} style={{...styles.textarea, opacity: .78}} /></section>
      <section style={styles.card}><p style={styles.cardLabel}>BOUNDED ENVIRONMENTAL DETERMINATION · {determination?.state}</p><textarea value={determinationText} onChange={(event) => { setDeterminationText(event.target.value); setPreserved(false); setNotice(""); }} rows={7} style={styles.textarea} /><div style={styles.split}><div><strong>Material limitations</strong>{(entitlement.limitations.length ? entitlement.limitations : ["No additional limitation declared."]).map((item) => <p key={item} style={styles.muted}>• {item}</p>)}</div><div><strong>Prohibited extensions</strong>{(entitlement.prohibitedExtensions.length ? entitlement.prohibitedExtensions : ["No prohibited extension declared."]).map((item) => <p key={item} style={styles.muted}>• {item}</p>)}</div></div></section>
      <div style={styles.actions}><button type="button" onClick={preserveDetermination} disabled={!canPreserve} style={{...styles.button, opacity: canPreserve ? 1 : .45}}>Preserve Bounded Determination</button><Link href="/workspace/governed-records/continuity-review" style={styles.secondary}>Continue to Continuity Review</Link></div>{preserved ? <div style={styles.success}><strong>PRESERVED.</strong> Historical interpretation remains attributable to its entitlement and admitted evidence package.</div> : null}
    </>}
  </section></main>;
}

const styles: Record<string, React.CSSProperties> = {
  page:{minHeight:"100vh",background:"radial-gradient(circle at 12% 0%, #153b31 0, #04110e 38%, #020706 84%)",color:"#f1fbf7",fontFamily:"Inter, system-ui, sans-serif"},shell:{width:"min(1180px, calc(100% - 32px))",margin:"0 auto",padding:"28px 0 72px"},nav:{display:"flex",justifyContent:"space-between",gap:16,paddingBottom:22,borderBottom:"1px solid rgba(125,232,181,.14)"},kicker:{marginTop:46,color:"#7de8b5",fontWeight:900,fontSize:11,letterSpacing:".16em"},h1:{maxWidth:980,margin:"16px 0",fontFamily:"Georgia, serif",fontSize:"clamp(42px, 6vw, 72px)",lineHeight:1.02},h2:{margin:"8px 0 14px",fontSize:24},copy:{maxWidth:920,color:"#b9cec5",lineHeight:1.7},muted:{color:"#8fa99e",lineHeight:1.55,fontSize:13},link:{color:"#89efc1",textDecoration:"none",fontWeight:800},notice:{margin:"22px 0",padding:16,borderRadius:13,border:"1px solid rgba(255,210,122,.28)",background:"rgba(78,56,10,.18)",color:"#f0dca2",lineHeight:1.55},hold:{marginTop:22,padding:22,borderRadius:15,border:"1px solid rgba(255,173,142,.28)",background:"rgba(64,24,16,.24)"},grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:14,marginTop:28},card:{marginTop:14,padding:22,border:"1px solid rgba(125,232,181,.18)",borderRadius:17,background:"rgba(5,24,18,.78)"},cardLabel:{margin:0,color:"#7de8b5",fontWeight:900,letterSpacing:".11em",fontSize:10},meta:{display:"grid",gap:10,margin:0},textarea:{width:"100%",boxSizing:"border-box",padding:14,borderRadius:12,border:"1px solid rgba(125,232,181,.2)",background:"#04100d",color:"#effbf6",lineHeight:1.55,resize:"vertical",fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace"},reason:{margin:"8px 0 0",color:"#ffd27a",fontFamily:"ui-monospace, monospace",fontSize:12},split:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18,marginTop:18},actions:{display:"flex",flexWrap:"wrap",gap:12,marginTop:18},button:{border:0,borderRadius:999,padding:"13px 20px",background:"#7de8b5",color:"#042016",fontWeight:900},secondary:{border:"1px solid rgba(125,232,181,.25)",borderRadius:999,padding:"12px 18px",color:"#dff8ed",textDecoration:"none",fontWeight:800},success:{marginTop:18,padding:16,borderRadius:13,background:"rgba(33,102,70,.24)",border:"1px solid rgba(125,232,181,.28)",color:"#c8f5df"}
};