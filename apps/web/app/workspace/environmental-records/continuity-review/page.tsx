"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type {
  EnvironmentalPropositionBoundary,
  EntitlementStanding,
} from "../../../../lib/environmental-governance/proposition-entitlement";

const INTERPRETER_KEY = "ta14-governed-record-interpreter-workspace-v2";
const CONTINUITY_KEY = "ta14-environmental-continuity-review-workspace-v1";

type DeterminationState =
  | "SUPPORTED"
  | "PARTIALLY_SUPPORTED"
  | "UNSUPPORTED"
  | "INDETERMINATE";

type InterpreterRecord = {
  interpretationId?: string;
  status?: string;
  version?: string;
  recordClass?: string;
  interpretationQuestion?: string;
  sourceRecordText?: string;
  resultSummary?: string;
  determinationState?: DeterminationState;
  entitlementId?: string;
  entitlementStanding?: EntitlementStanding;
  entitledProposition?: string;
  entitlementBoundary?: EnvironmentalPropositionBoundary;
  entitlementLimitations?: string[];
  prohibitedExtensions?: string[];
  evidenceRefs?: string[];
  createdAt?: string;
  updatedAt?: string;
};

type ContinuityDetermination =
  | "NOT_ASSESSED"
  | "CONTINUOUS_WITHIN_BOUNDARY"
  | "PARTIAL"
  | "BROKEN"
  | "DISPUTED";

type EnvironmentalContinuityReview = {
  reviewId: string;
  sourceInterpretationId: string;
  entitlementId: string;
  entitledProposition: string;
  entitlementStanding: EntitlementStanding;
  entitlementBoundary: EnvironmentalPropositionBoundary;
  determinationState: DeterminationState;
  continuityDetermination: ContinuityDetermination;
  continuityReason: string;
  missingIntervals: string;
  custodyStatement: string;
  identityStatement: string;
  transmissionStatement: string;
  versionStatement: string;
  whatContinuitySupports: string;
  whatContinuityDoesNotSupport: string;
  requiredNextEvidence: string;
  createdAt: string;
  updatedAt: string;
};

function createIdentifier() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const time = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
  return `TA-14-ECR-${date}-${time}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export default function EnvironmentalContinuityReviewPage() {
  const [source, setSource] = useState<InterpreterRecord | null>(null);
  const [review, setReview] = useState<EnvironmentalContinuityReview | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(INTERPRETER_KEY);
    if (!raw) {
      setNotice("HOLD — no preserved environmental interpretation is available for continuity review.");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as InterpreterRecord;
      setSource(parsed);
      if (
        !parsed.interpretationId ||
        !parsed.entitlementId ||
        !parsed.entitledProposition ||
        !parsed.entitlementStanding ||
        !parsed.entitlementBoundary ||
        !parsed.resultSummary
      ) {
        setNotice("HOLD — the source interpretation does not carry a complete proposition entitlement and bounded determination identity.");
        return;
      }

      const saved = window.localStorage.getItem(CONTINUITY_KEY);
      if (saved) {
        try {
          const existing = JSON.parse(saved) as EnvironmentalContinuityReview;
          if (
            existing.sourceInterpretationId === parsed.interpretationId &&
            existing.entitlementId === parsed.entitlementId
          ) {
            setReview(existing);
            return;
          }
        } catch {
          window.localStorage.removeItem(CONTINUITY_KEY);
        }
      }

      const now = new Date().toISOString();
      setReview({
        reviewId: createIdentifier(),
        sourceInterpretationId: parsed.interpretationId,
        entitlementId: parsed.entitlementId,
        entitledProposition: parsed.entitledProposition,
        entitlementStanding: parsed.entitlementStanding,
        entitlementBoundary: parsed.entitlementBoundary,
        determinationState: parsed.determinationState ?? "INDETERMINATE",
        continuityDetermination: "NOT_ASSESSED",
        continuityReason: "",
        missingIntervals: "",
        custodyStatement: "",
        identityStatement: "",
        transmissionStatement: "",
        versionStatement: "",
        whatContinuitySupports: "",
        whatContinuityDoesNotSupport:
          "Continuity review cannot broaden the entitled proposition, create causal standing, create health standing, or create execution authority.",
        requiredNextEvidence: "",
        createdAt: now,
        updatedAt: now,
      });
    } catch {
      setNotice("HOLD — the preserved environmental interpretation could not be read.");
    }
  }, []);

  const continuityMayProgress = useMemo(() => {
    if (!review) return false;
    return (
      review.continuityDetermination !== "NOT_ASSESSED" &&
      review.continuityReason.trim().length >= 12 &&
      review.identityStatement.trim().length >= 8 &&
      review.versionStatement.trim().length >= 8
    );
  }, [review]);

  function update<K extends keyof EnvironmentalContinuityReview>(
    key: K,
    value: EnvironmentalContinuityReview[K],
  ) {
    setReview((current) =>
      current
        ? { ...current, [key]: value, updatedAt: new Date().toISOString() }
        : current,
    );
    setNotice("");
  }

  function preserve() {
    if (!review || !source) return;
    if (!continuityMayProgress) {
      setNotice("HOLD — continuity determination, reason, identity, and version evidence must be established before preservation.");
      return;
    }

    if (
      review.entitlementId !== source.entitlementId ||
      review.sourceInterpretationId !== source.interpretationId ||
      review.entitledProposition !== source.entitledProposition
    ) {
      setNotice("HOLD — entitlement or interpretation identity changed. Revalidation is required.");
      return;
    }

    const next = { ...review, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(CONTINUITY_KEY, JSON.stringify(next));
    setReview(next);
    setNotice(`${next.reviewId} preserved. Continuity standing remains subordinate to entitlement ${next.entitlementId} and cannot enlarge the bounded determination.`);
  }

  if (!source || !review) {
    return (
      <main style={styles.page}>
        <section style={styles.shell}>
          <p style={styles.kicker}>TA-14 · ENVIRONMENTAL CONTINUITY REVIEW</p>
          <h1 style={styles.h1}>HOLD — continuity source incomplete.</h1>
          <p style={styles.copy}>{notice || "A preserved entitlement-bound environmental determination is required."}</p>
          <Link href="/workspace/environmental-records/interpreter" style={styles.link}>Return to Environmental Record Interpreter</Link>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <nav style={styles.nav}>
          <Link href="/workspace/environmental-records/interpreter" style={styles.link}>← Environmental Record Interpreter</Link>
          <span style={styles.muted}>Continuity cannot create new standing</span>
        </nav>

        <p style={styles.kicker}>ENVIRONMENTAL CONTINUITY REVIEW · IDENTITY-BOUND</p>
        <h1 style={styles.h1}>Preserve the chain without widening the claim.</h1>
        <p style={styles.copy}>This review tests continuity of the already-entitled evidence and bounded determination. It may preserve standing, limit standing, or defeat standing. It may not enlarge the proposition or manufacture authority.</p>

        {notice ? <div style={styles.notice}>{notice}</div> : null}

        <section style={styles.grid}>
          <article style={styles.card}>
            <p style={styles.cardLabel}>BOUND IDENTITIES</p>
            <dl style={styles.meta}>
              <div><dt>Review</dt><dd>{review.reviewId}</dd></div>
              <div><dt>Interpretation</dt><dd>{review.sourceInterpretationId}</dd></div>
              <div><dt>Entitlement</dt><dd>{review.entitlementId}</dd></div>
              <div><dt>Entitlement standing</dt><dd>{review.entitlementStanding}</dd></div>
              <div><dt>Determination state</dt><dd>{review.determinationState}</dd></div>
            </dl>
          </article>

          <article style={styles.card}>
            <p style={styles.cardLabel}>LOCKED PROPOSITION</p>
            <p style={styles.copy}>{review.entitledProposition}</p>
            <p style={styles.muted}><strong>Object:</strong> {review.entitlementBoundary.inspectionObject}</p>
            <p style={styles.muted}><strong>Temporal:</strong> {review.entitlementBoundary.temporalBoundary || "Not separately established"}</p>
            <p style={styles.muted}><strong>Spatial:</strong> {review.entitlementBoundary.spatialBoundary || "Not separately established"}</p>
          </article>
        </section>

        <section style={styles.card}>
          <p style={styles.cardLabel}>CONTINUITY DETERMINATION</p>
          <select value={review.continuityDetermination} onChange={(event) => update("continuityDetermination", event.target.value as ContinuityDetermination)} style={styles.input}>
            <option value="NOT_ASSESSED">Not assessed</option>
            <option value="CONTINUOUS_WITHIN_BOUNDARY">Continuous within declared boundary</option>
            <option value="PARTIAL">Partially continuous</option>
            <option value="BROKEN">Continuity broken</option>
            <option value="DISPUTED">Continuity disputed</option>
          </select>
          <label style={styles.label}>Determination reason<textarea value={review.continuityReason} onChange={(event) => update("continuityReason", event.target.value)} rows={4} style={styles.textarea} /></label>
        </section>

        <section style={styles.grid}>
          <Field label="Missing intervals / gaps" value={review.missingIntervals} onChange={(value) => update("missingIntervals", value)} />
          <Field label="Identity continuity" value={review.identityStatement} onChange={(value) => update("identityStatement", value)} />
          <Field label="Version continuity" value={review.versionStatement} onChange={(value) => update("versionStatement", value)} />
          <Field label="Custody" value={review.custodyStatement} onChange={(value) => update("custodyStatement", value)} />
          <Field label="Transmission" value={review.transmissionStatement} onChange={(value) => update("transmissionStatement", value)} />
          <Field label="Required next evidence" value={review.requiredNextEvidence} onChange={(value) => update("requiredNextEvidence", value)} />
        </section>

        <section style={styles.card}>
          <p style={styles.cardLabel}>STANDING BOUNDARY</p>
          <label style={styles.label}>What continuity supports<textarea value={review.whatContinuitySupports} onChange={(event) => update("whatContinuitySupports", event.target.value)} rows={4} style={styles.textarea} /></label>
          <label style={styles.label}>What continuity does not support<textarea value={review.whatContinuityDoesNotSupport} onChange={(event) => update("whatContinuityDoesNotSupport", event.target.value)} rows={4} style={styles.textarea} /></label>
          <button type="button" onClick={preserve} style={{...styles.button, opacity: continuityMayProgress ? 1 : .5}}>Preserve Environmental Continuity Review</button>
        </section>
      </section>
    </main>
  );
}

function Field({label,value,onChange}:{label:string;value:string;onChange:(value:string)=>void}) {
  return <article style={styles.card}><label style={styles.label}>{label}<textarea value={value} onChange={(event)=>onChange(event.target.value)} rows={4} style={styles.textarea}/></label></article>;
}

const styles: Record<string, React.CSSProperties> = {
  page:{minHeight:"100vh",background:"radial-gradient(circle at 18% 0%,#183632 0,#061110 40%,#020706 84%)",color:"#f2fbf8",fontFamily:"Inter,system-ui,sans-serif"},
  shell:{width:"min(1180px,calc(100% - 32px))",margin:"0 auto",padding:"28px 0 72px"},
  nav:{display:"flex",justifyContent:"space-between",gap:16,paddingBottom:22,borderBottom:"1px solid rgba(125,232,181,.14)"},
  kicker:{marginTop:46,color:"#7de8b5",fontWeight:900,fontSize:11,letterSpacing:".16em"},
  h1:{maxWidth:980,fontFamily:"Georgia,serif",fontSize:"clamp(42px,6vw,72px)",lineHeight:1.02,margin:"16px 0"},
  copy:{color:"#b9cec5",lineHeight:1.7},muted:{color:"#8fa99e",fontSize:13,lineHeight:1.55},link:{color:"#89efc1",textDecoration:"none",fontWeight:800},
  notice:{margin:"22px 0",padding:16,borderRadius:13,border:"1px solid rgba(255,210,122,.28)",background:"rgba(78,56,10,.18)",color:"#f0dca2"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14,marginTop:14},card:{marginTop:14,padding:22,border:"1px solid rgba(125,232,181,.18)",borderRadius:17,background:"rgba(5,24,18,.78)"},cardLabel:{color:"#7de8b5",fontWeight:900,letterSpacing:".11em",fontSize:10},
  meta:{display:"grid",gap:10},label:{display:"grid",gap:8,color:"#b9cec5",fontWeight:800,fontSize:12,marginTop:12},input:{width:"100%",boxSizing:"border-box",padding:13,borderRadius:11,border:"1px solid rgba(125,232,181,.2)",background:"#04100d",color:"#effbf6"},textarea:{width:"100%",boxSizing:"border-box",padding:13,borderRadius:11,border:"1px solid rgba(125,232,181,.2)",background:"#04100d",color:"#effbf6",lineHeight:1.55,resize:"vertical"},button:{marginTop:16,border:0,borderRadius:11,padding:"13px 18px",background:"#7de8b5",color:"#062219",fontWeight:900,cursor:"pointer"}
};
