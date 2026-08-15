"use client";

import { useEffect, useMemo, useState } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { getArcadeSupabase } from "../../lib/arcade-supabase";

type Determination = {
  id: number;
  world_key: string;
  score: number;
  accuracy: number;
  correct_answers: number;
  required_buckets: string[];
  tested_buckets: string[];
  blockers: string[];
  critical_lock_active: boolean;
  determination: "cleared" | "not_cleared" | "incomplete_evidence" | "critical_lock";
  determined_at: string;
};

type CriticalEvent = {
  id: number;
  bucket: string;
  status: "locked" | "remediation" | "cleared";
  remediation_attempts: number;
  locked_at: string;
  cleared_at: string | null;
};

type BucketState = "not_tested" | "in_progress" | "cleared" | "locked" | "remediation" | "recleared";

type MatrixRow = {
  bucket: string;
  state: BucketState;
  evidenceCount: number;
  bestAccuracy: number | null;
  lastEvidenceAt: string | null;
};

const BUCKETS = ["Core", "Three Rs", "Safety", "Type I", "Type II", "Type III", "Modern Transition"] as const;

const determinationLabel = (value: Determination["determination"]) => ({
  cleared: "CLEARED",
  not_cleared: "NOT CLEARED",
  incomplete_evidence: "INCOMPLETE EVIDENCE",
  critical_lock: "CRITICAL LOCK",
}[value]);

const stateLabel = (value: BucketState) => ({
  not_tested: "NOT TESTED",
  in_progress: "IN PROGRESS",
  cleared: "CLEARED",
  locked: "LOCKED",
  remediation: "REMEDIATION",
  recleared: "RECLEARED",
}[value]);

function normalizeBucket(bucket: string) {
  const b = bucket.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (b.includes("threer")) return "Three Rs";
  if (b.includes("safety")) return "Safety";
  if (b.includes("typeiii")) return "Type III";
  if (b.includes("typeii")) return "Type II";
  if (b.includes("typei")) return "Type I";
  if (b.includes("transition") || b.includes("a2l") || b.includes("modern")) return "Modern Transition";
  if (b.includes("core")) return "Core";
  return bucket;
}

function shortDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export default function PersistedReadinessPanel() {
  const supabase = getArcadeSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<Determination[]>([]);
  const [criticalEvents, setCriticalEvents] = useState<CriticalEvent[]>([]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then((result: { data: { user: User | null } }) => setUser(result.data.user));
    const { data } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !user) {
      setRecords([]);
      setCriticalEvents([]);
      return;
    }

    let live = true;
    const userId = user.id;

    const load = async () => {
      const [determinations, critical] = await Promise.all([
        supabase
          .from("arcade_readiness_determinations")
          .select("id,world_key,score,accuracy,correct_answers,required_buckets,tested_buckets,blockers,critical_lock_active,determination,determined_at")
          .eq("user_id", userId)
          .eq("arcade_key", "epa-608")
          .order("determined_at", { ascending: false })
          .limit(50),
        supabase
          .from("arcade_critical_events")
          .select("id,bucket,status,remediation_attempts,locked_at,cleared_at")
          .eq("user_id", userId)
          .eq("arcade_key", "epa-608")
          .order("locked_at", { ascending: false })
          .limit(100),
      ]);

      if (!live) return;
      setRecords((determinations.data ?? []) as Determination[]);
      setCriticalEvents((critical.data ?? []) as CriticalEvent[]);
    };

    void load();
    const refresh = () => void load();
    window.addEventListener("focus", refresh);
    const timer = window.setInterval(refresh, 5000);
    return () => {
      live = false;
      window.removeEventListener("focus", refresh);
      window.clearInterval(timer);
    };
  }, [supabase, user]);

  const matrix = useMemo<MatrixRow[]>(() => {
    return BUCKETS.map((bucket) => {
      const bucketDeterminations = records.filter((record) =>
        record.tested_buckets.some((tested) => normalizeBucket(tested) === bucket),
      );
      const bucketCriticalEvents = criticalEvents.filter((event) => normalizeBucket(event.bucket) === bucket);
      const unresolved = bucketCriticalEvents.find((event) => event.status !== "cleared");
      const hadClearedCritical = bucketCriticalEvents.some((event) => event.status === "cleared");
      const hasClearedDetermination = bucketDeterminations.some(
        (record) => record.determination === "cleared" && record.required_buckets.some((required) => normalizeBucket(required) === bucket),
      );

      let state: BucketState = "not_tested";
      if (unresolved?.status === "locked") state = "locked";
      else if (unresolved?.status === "remediation") state = "remediation";
      else if (hadClearedCritical) state = "recleared";
      else if (hasClearedDetermination) state = "cleared";
      else if (bucketDeterminations.length > 0) state = "in_progress";

      const evidenceDates = [
        ...bucketDeterminations.map((record) => record.determined_at),
        ...bucketCriticalEvents.map((event) => event.cleared_at ?? event.locked_at),
      ].filter(Boolean);

      return {
        bucket,
        state,
        evidenceCount: bucketDeterminations.length + bucketCriticalEvents.length,
        bestAccuracy: bucketDeterminations.length
          ? Math.max(...bucketDeterminations.map((record) => Number(record.accuracy)))
          : null,
        lastEvidenceAt: evidenceDates.length
          ? evidenceDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
          : null,
      };
    });
  }, [records, criticalEvents]);

  if (!user) return null;

  const unresolvedCount = matrix.filter((row) => row.state === "locked" || row.state === "remediation").length;
  const clearedCount = matrix.filter((row) => row.state === "cleared" || row.state === "recleared").length;

  return (
    <section className="persistedReadiness">
      <style>{`
        .persistedReadiness{margin:0 14px 16px;padding:16px;border:1px solid #1b4a5d;border-radius:16px;background:#03101a;color:#dff8ff}
        .persistedReadiness h2{margin:0 0 5px;font-size:16px}.persistedReadiness>p{margin:0 0 12px;color:#7899a7;font-size:10px}
        .matrixSummary{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.matrixSummary span{padding:7px 9px;border:1px solid #23495a;border-radius:999px;background:#04131e;color:#99bfcc;font-size:9px;font-weight:900}.matrixSummary .ok{border-color:#2e6555;color:#72efbb}.matrixSummary .blocked{border-color:#7d2738;color:#ff9aaa}
        .clearanceMatrix{display:grid;grid-template-columns:repeat(7,minmax(120px,1fr));gap:7px;margin-bottom:16px}.bucketCell{min-height:116px;padding:11px;border:1px solid #173a4b;border-radius:11px;background:#04101a}.bucketCell strong{display:block;font-size:10px;color:#e8fcff}.bucketState{display:inline-block;margin:8px 0 7px;padding:5px 7px;border-radius:999px;border:1px solid #365766;color:#94b9c7;font-size:8px;font-weight:1000;letter-spacing:.06em}.bucketCell.cleared,.bucketCell.recleared{border-color:#2e6555}.bucketCell.cleared .bucketState,.bucketCell.recleared .bucketState{border-color:#2e6555;color:#72efbb}.bucketCell.locked,.bucketCell.remediation{border-color:#8f263a;background:#1d0810}.bucketCell.locked .bucketState,.bucketCell.remediation .bucketState{border-color:#8f263a;color:#ff9aaa}.bucketCell small{display:block;color:#6f929f;font-size:8px;line-height:1.5}
        .determinationRows{display:grid;gap:7px}.determinationRow{display:grid;grid-template-columns:150px 120px 90px 90px minmax(180px,1fr);gap:8px;align-items:center;padding:10px;border:1px solid #173a4b;border-radius:10px;background:#04101a;font-size:10px}.determinationRow.cleared{border-color:#2e6555}.determinationRow.blocked{border-color:#7d2738}.determinationRow strong{color:#ffd363}.determinationRow.cleared strong{color:#72efbb}.determinationRow.blocked strong{color:#ff9aaa}.determinationRow span{color:#9fc2cf}.emptyReadiness{padding:12px;color:#688895;font-size:10px}
        @media(max-width:1200px){.clearanceMatrix{grid-template-columns:repeat(4,minmax(120px,1fr))}}@media(max-width:800px){.clearanceMatrix{grid-template-columns:repeat(2,minmax(120px,1fr))}.determinationRow{grid-template-columns:1fr 100px 70px}.determinationRow span:nth-child(4),.determinationRow span:nth-child(5){display:none}}
      `}</style>

      <h2>EPA 608 READINESS CLEARANCE MATRIX</h2>
      <p>Critical locks override score. Remediation restores readiness without erasing the historical miss.</p>

      <div className="matrixSummary">
        <span className="ok">{clearedCount}/7 CLEARED OR RECLEARED</span>
        <span className={unresolvedCount ? "blocked" : "ok"}>{unresolvedCount} UNRESOLVED CRITICAL LOCK{unresolvedCount === 1 ? "" : "S"}</span>
        <span>{records.length} PERSISTED DETERMINATION{records.length === 1 ? "" : "S"}</span>
      </div>

      <div className="clearanceMatrix">
        {matrix.map((row) => (
          <div className={`bucketCell ${row.state}`} key={row.bucket}>
            <strong>{row.bucket}</strong>
            <span className="bucketState">{stateLabel(row.state)}</span>
            <small>Evidence objects: {row.evidenceCount}</small>
            <small>Best run accuracy: {row.bestAccuracy === null ? "—" : `${row.bestAccuracy}%`}</small>
            <small>Last evidence: {shortDate(row.lastEvidenceAt)}</small>
          </div>
        ))}
      </div>

      <h2>PERSISTED READINESS DETERMINATIONS</h2>
      <p>High score ≠ readiness • Completed run ≠ readiness • Readiness = evidence-backed determination</p>
      <div className="determinationRows">
        {records.length ? records.slice(0, 10).map((record) => (
          <div className={`determinationRow ${record.determination === "cleared" ? "cleared" : "blocked"}`} key={record.id}>
            <strong>{determinationLabel(record.determination)}</strong>
            <span>{record.world_key.toUpperCase()}</span>
            <span>{record.accuracy}% ACC</span>
            <span>{record.score.toLocaleString()} XP</span>
            <span>{record.blockers.length ? record.blockers.join(" • ") : `Evidence complete • ${record.tested_buckets.length}/${record.required_buckets.length} required buckets tested`}</span>
          </div>
        )) : <div className="emptyReadiness">No persisted readiness determination yet. Complete a signed-in 100-question run to create one.</div>}
      </div>
    </section>
  );
}
