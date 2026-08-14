"use client";

import { useEffect, useState } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { getArcadeSupabase } from "../../lib/arcade-supabase";

type Leader = {
  user_id: string;
  display_name: string;
  best_score: number;
  games_played: number;
  questions_answered: number;
  correct_answers: number;
  best_streak: number;
};

type Run = {
  id: number;
  world_key: string;
  score: number;
  questions_answered: number;
  correct_answers: number;
  misses: number;
  best_streak: number;
  duration_seconds: number;
  completed: boolean;
  created_at: string;
};

type CriticalEvent = {
  id: number;
  world_key: string;
  question_id: number;
  bucket: string;
  lesson: string;
  original_why: string;
  status: "locked" | "remediation" | "cleared";
  remediation_attempts: number;
  locked_at: string;
  cleared_at: string | null;
};

type PlayerStats = {
  completedRuns: number;
  bestScore: number;
  bestStreak: number;
  fastestSeconds: number | null;
};

const EMPTY_STATS: PlayerStats = {
  completedRuns: 0,
  bestScore: 0,
  bestStreak: 0,
  fastestSeconds: null,
};

function formatDuration(seconds: number | null) {
  if (seconds === null || !Number.isFinite(seconds)) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = Math.max(0, seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function formatWorld(worldKey: string) {
  return worldKey
    .replace(/^epa-608[-_:]?/i, "")
    .replace(/[-_]/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase()) || "EPA 608";
}

export default function PlayerCommandCenter() {
  const supabase = getArcadeSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [criticalEvents, setCriticalEvents] = useState<CriticalEvent[]>([]);
  const [stats, setStats] = useState<PlayerStats>(EMPTY_STATS);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState(
    supabase ? "SIGN IN TO RECORD COMPETITIVE RUNS" : "PLAYER NETWORK AWAITING DEPLOYMENT CONFIG",
  );

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => setUser(session?.user ?? null),
    );
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("arcade_leaderboard")
      .select("user_id,display_name,best_score,games_played,questions_answered,correct_answers,best_streak")
      .eq("arcade_key", "epa-608")
      .order("best_score", { ascending: false })
      .limit(25)
      .then(({ data }: { data: unknown[] | null }) => setLeaders((data ?? []) as Leader[]));
  }, [supabase, user]);

  useEffect(() => {
    if (!supabase) return;
    if (!user) {
      setRuns([]);
      setCriticalEvents([]);
      setStats(EMPTY_STATS);
      return;
    }

    let cancelled = false;
    const userId = user.id;

    async function loadPlayerHistory() {
      const recentQuery = supabase
        .from("arcade_runs")
        .select("id,world_key,score,questions_answered,correct_answers,misses,best_streak,duration_seconds,completed,created_at")
        .eq("user_id", userId)
        .eq("arcade_key", "epa-608")
        .eq("completed", true)
        .order("created_at", { ascending: false })
        .limit(10);

      const countQuery = supabase
        .from("arcade_runs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("arcade_key", "epa-608")
        .eq("completed", true);

      const bestScoreQuery = supabase
        .from("arcade_runs")
        .select("score")
        .eq("user_id", userId)
        .eq("arcade_key", "epa-608")
        .eq("completed", true)
        .order("score", { ascending: false })
        .limit(1);

      const bestStreakQuery = supabase
        .from("arcade_runs")
        .select("best_streak")
        .eq("user_id", userId)
        .eq("arcade_key", "epa-608")
        .eq("completed", true)
        .order("best_streak", { ascending: false })
        .limit(1);

      const fastestQuery = supabase
        .from("arcade_runs")
        .select("duration_seconds")
        .eq("user_id", userId)
        .eq("arcade_key", "epa-608")
        .eq("completed", true)
        .gt("duration_seconds", 0)
        .order("duration_seconds", { ascending: true })
        .limit(1);

      const criticalQuery = supabase
        .from("arcade_critical_events")
        .select("id,world_key,question_id,bucket,lesson,original_why,status,remediation_attempts,locked_at,cleared_at")
        .eq("user_id", userId)
        .eq("arcade_key", "epa-608")
        .order("locked_at", { ascending: false })
        .limit(25);

      const [recent, count, bestScore, bestStreak, fastest, critical] = await Promise.all([
        recentQuery,
        countQuery,
        bestScoreQuery,
        bestStreakQuery,
        fastestQuery,
        criticalQuery,
      ]);

      if (cancelled) return;

      const firstError = recent.error || count.error || bestScore.error || bestStreak.error || fastest.error || critical.error;
      if (firstError) {
        setStatus(`PLAYER HISTORY UNAVAILABLE — ${firstError.message}`);
        return;
      }

      setRuns((recent.data ?? []) as Run[]);
      setCriticalEvents((critical.data ?? []) as CriticalEvent[]);
      setStats({
        completedRuns: count.count ?? 0,
        bestScore: Number(bestScore.data?.[0]?.score ?? 0),
        bestStreak: Number(bestStreak.data?.[0]?.best_streak ?? 0),
        fastestSeconds:
          fastest.data?.[0]?.duration_seconds === undefined || fastest.data?.[0]?.duration_seconds === null
            ? null
            : Number(fastest.data[0].duration_seconds),
      });
    }

    loadPlayerHistory();
    const refresh = () => void loadPlayerHistory();
    window.addEventListener("focus", refresh);
    const timer = window.setInterval(refresh, 10000);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", refresh);
      window.clearInterval(timer);
    };
  }, [supabase, user]);

  async function signIn() {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setStatus(error ? error.message : "WELCOME BACK — COMPETITIVE RECORDING ACTIVE");
  }

  async function signUp() {
    if (!supabase) return;
    if (name.trim().length < 2) {
      setStatus("ENTER A PLAYER NAME");
      return;
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setStatus(error.message);
      return;
    }
    if (data.user) {
      await supabase
        .from("arcade_profiles")
        .upsert({ user_id: data.user.id, display_name: name.trim(), last_seen_at: new Date().toISOString() });
    }
    setStatus(
      data.session
        ? "PLAYER CREATED — COMPETITIVE RECORDING ACTIVE"
        : "CHECK YOUR EMAIL TO CONFIRM YOUR PLAYER ACCOUNT",
    );
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setStatus("SIGNED OUT — PRACTICE REMAINS AVAILABLE");
  }

  const mine = leaders.findIndex((x) => x.user_id === user?.id);
  const unresolved = criticalEvents.filter((event) => event.status !== "cleared");
  const cleared = criticalEvents.filter((event) => event.status === "cleared");

  return (
    <section className="playerCommand">
      <style>{`
 .playerCommand{margin:0 14px 100px;border:1px solid #1b4a5d;border-radius:18px;background:linear-gradient(135deg,#04131e,#020912);padding:18px;color:#dff8ff}.pcHead{display:flex;justify-content:space-between;gap:20px;align-items:end;border-bottom:1px solid #163847;padding-bottom:12px}.pcHead small{color:#65eaff;font-size:9px;font-weight:1000;letter-spacing:.15em}.pcHead h2{margin:5px 0 0;font-size:24px}.pcStatus{font-size:9px;color:#ffd363;text-align:right}.pcGrid{display:grid;grid-template-columns:310px 1fr;gap:16px;margin-top:16px}.pcCard{border:1px solid #173a4b;border-radius:14px;background:#06131d;padding:14px}.pcCard h3{margin:0 0 10px;font-size:10px;letter-spacing:.12em;color:#69eaff}.pcInputs{display:grid;gap:8px}.pcInputs input{width:100%;border:1px solid #24495a;border-radius:9px;background:#020a10;color:white;padding:10px}.pcButtons{display:flex;gap:7px;margin-top:9px;flex-wrap:wrap}.pcButtons button{border:1px solid #3a7186;border-radius:9px;background:#092333;color:#e8fcff;padding:9px 11px;font-weight:900;font-size:9px;cursor:pointer}.pcButtons button.primary{border-color:#ffd363;color:#ffe7a0;background:#2b2208}.rankCall{margin-top:12px;padding:11px;border:1px solid #2e6555;border-radius:10px;color:#72efbb;background:#062019}.readinessBlocked{margin-top:9px;padding:11px;border:1px solid #8f263a;border-radius:10px;color:#ff9aaa;background:#240811}.statGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:10px}.statTile{border:1px solid #173a4b;border-radius:10px;background:#04101a;padding:10px}.statTile small{display:block;font-size:8px;color:#718e9a;letter-spacing:.08em}.statTile strong{display:block;margin-top:4px;color:#ffd363;font-size:16px}.leaderRows,.historyRows,.criticalRows{display:grid;gap:5px}.leader{display:grid;grid-template-columns:42px minmax(120px,1fr) 100px 85px 85px;gap:8px;align-items:center;padding:8px 10px;border:1px solid #123342;border-radius:9px;background:#04101a;font-size:10px}.leader.me{border-color:#ffd363;background:#241d08}.leader strong{color:#ffd363}.leader span:nth-child(n+3){text-align:right;color:#9fc2cf}.historyCard,.criticalCard{grid-column:1/-1}.runRow{display:grid;grid-template-columns:120px minmax(100px,1fr) 90px 80px 80px 90px;gap:8px;align-items:center;padding:9px 10px;border:1px solid #123342;border-radius:9px;background:#04101a;font-size:10px}.runRow strong{color:#ffd363}.runRow span:nth-child(n+3){text-align:right;color:#9fc2cf}.runDate{color:#6e95a4!important;text-align:left!important}.criticalRow{display:grid;grid-template-columns:90px 130px minmax(160px,1fr) 100px 95px;gap:8px;align-items:center;padding:10px;border:1px solid #7d2738;border-radius:9px;background:#1d0810;font-size:10px}.criticalRow.cleared{border-color:#235f4c;background:#061d17}.criticalRow strong{color:#ff9aaa}.criticalRow.cleared strong{color:#72efbb}.criticalRow span{color:#c7a7ae}.criticalRow.cleared span{color:#9fcfc0}.empty{color:#688895;font-size:11px;padding:20px;text-align:center}@media(max-width:850px){.pcGrid{grid-template-columns:1fr}.leader{grid-template-columns:35px 1fr 80px}.leader span:nth-child(4),.leader span:nth-child(5){display:none}.pcHead{align-items:start;flex-direction:column}.pcStatus{text-align:left}.historyCard,.criticalCard{grid-column:auto}.runRow{grid-template-columns:1fr 80px 70px}.runRow span:nth-child(4),.runRow span:nth-child(5),.runRow span:nth-child(6){display:none}.criticalRow{grid-template-columns:85px 1fr 90px}.criticalRow span:nth-child(4),.criticalRow span:nth-child(5){display:none}.statGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
 `}</style>
      <div className="pcHead">
        <div>
          <small>TA-14 ACADEMY ARCADE PLAYER NETWORK</small>
          <h2>608 PLAYER COMMAND CENTER</h2>
        </div>
        <div className="pcStatus">{status}</div>
      </div>

      <div className="pcGrid">
        <div className="pcCard">
          <h3>{user ? "YOUR PLAYER PROFILE" : "SIGN UP / SIGN IN"}</h3>
          {user ? (
            <>
              <p style={{ fontSize: 12 }}>
                Signed in as <b>{user.email}</b>
              </p>
              <div className="rankCall">
                {mine >= 0 ? (
                  <>CURRENT TOP-25 RANK <strong>#{mine + 1}</strong></>
                ) : (
                  <>Complete a qualifying run to enter the 608 leaderboard.</>
                )}
              </div>
              {unresolved.length > 0 && (
                <div className="readinessBlocked">
                  <strong>{unresolved.length} UNRESOLVED CRITICAL READINESS LOCK{unresolved.length === 1 ? "" : "S"}</strong><br />
                  Readiness remains NOT CLEARED until the required remediation is passed.
                </div>
              )}
              <div className="statGrid">
                <div className="statTile"><small>BEST SCORE</small><strong>{stats.bestScore.toLocaleString()} XP</strong></div>
                <div className="statTile"><small>BEST STREAK</small><strong>{stats.bestStreak}</strong></div>
                <div className="statTile"><small>FASTEST RUN</small><strong>{formatDuration(stats.fastestSeconds)}</strong></div>
                <div className="statTile"><small>COMPLETED RUNS</small><strong>{stats.completedRuns}</strong></div>
              </div>
              <div className="pcButtons"><button onClick={signOut}>SIGN OUT</button></div>
            </>
          ) : (
            <>
              <div className="pcInputs">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Player name (needed for sign up)" maxLength={32} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
              </div>
              <div className="pcButtons">
                <button className="primary" onClick={signUp}>CREATE PLAYER</button>
                <button onClick={signIn}>SIGN IN</button>
              </div>
            </>
          )}
        </div>

        <div className="pcCard">
          <h3>TOP 25 — EPA 608</h3>
          <div className="leaderRows">
            {leaders.length ? leaders.map((p, i) => {
              const acc = p.questions_answered ? Math.round((p.correct_answers / p.questions_answered) * 100) : 0;
              return <div className={`leader ${p.user_id === user?.id ? "me" : ""}`} key={p.user_id}>
                <strong>#{i + 1}</strong><span>{p.display_name}</span><span>{Number(p.best_score).toLocaleString()} XP</span><span>{acc}% ACC</span><span>{p.games_played} RUNS</span>
              </div>;
            }) : <div className="empty">The leaderboard opens as verified player runs are recorded.</div>}
          </div>
        </div>

        {user && (
          <div className="pcCard criticalCard">
            <h3>CRITICAL READINESS EVIDENCE</h3>
            <div className="criticalRows">
              {criticalEvents.length ? criticalEvents.map((event) => (
                <div className={`criticalRow ${event.status === "cleared" ? "cleared" : ""}`} key={event.id}>
                  <strong>{event.status === "cleared" ? "CLEARED" : "NOT CLEARED"}</strong>
                  <span>{event.bucket}</span>
                  <span>{event.lesson}</span>
                  <span>{formatWorld(event.world_key)}</span>
                  <span>{event.remediation_attempts} RETEST{event.remediation_attempts === 1 ? "" : "S"}</span>
                </div>
              )) : <div className="empty">No critical-miss evidence has been recorded for this player.</div>}
            </div>
            {cleared.length > 0 && unresolved.length === 0 && <div className="rankCall">All recorded critical readiness events are currently <strong>CLEARED</strong>.</div>}
          </div>
        )}

        {user && (
          <div className="pcCard historyCard">
            <h3>YOUR RECENT COMPLETED RUNS</h3>
            <div className="historyRows">
              {runs.length ? runs.map((run) => {
                const accuracy = run.questions_answered ? Math.round((run.correct_answers / run.questions_answered) * 100) : 0;
                return <div className="runRow" key={run.id}>
                  <span className="runDate">{new Date(run.created_at).toLocaleDateString()}</span>
                  <strong>{formatWorld(run.world_key)}</strong>
                  <span>{run.score.toLocaleString()} XP</span>
                  <span>{accuracy}% ACC</span>
                  <span>{run.best_streak} STREAK</span>
                  <span>{formatDuration(run.duration_seconds)}</span>
                </div>;
              }) : <div className="empty">Complete a 100-question run and your recorded history will appear here.</div>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
