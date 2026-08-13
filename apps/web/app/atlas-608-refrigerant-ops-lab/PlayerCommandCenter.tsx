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

export default function PlayerCommandCenter(){
 const supabase=getArcadeSupabase();
 const [user,setUser]=useState<User|null>(null),[leaders,setLeaders]=useState<Leader[]>([]);
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[name,setName]=useState("");
 const [status,setStatus]=useState(supabase?"SIGN IN TO RECORD COMPETITIVE RUNS":"PLAYER NETWORK AWAITING DEPLOYMENT CONFIG");
 useEffect(()=>{if(!supabase)return;supabase.auth.getUser().then(({data}:{data:{user:User|null}})=>setUser(data.user));const {data:listener}=supabase.auth.onAuthStateChange((_event:AuthChangeEvent,session:Session|null)=>setUser(session?.user??null));return()=>listener.subscription.unsubscribe()},[supabase]);
 useEffect(()=>{if(!supabase)return;supabase.from("arcade_leaderboard").select("user_id,display_name,best_score,games_played,questions_answered,correct_answers,best_streak").eq("arcade_key","epa-608").order("best_score",{ascending:false}).limit(25).then(({data}:{data:unknown[]|null})=>setLeaders((data??[]) as Leader[]))},[supabase,user]);
 async function signIn(){if(!supabase)return;const {error}=await supabase.auth.signInWithPassword({email,password});setStatus(error?error.message:"WELCOME BACK — COMPETITIVE RECORDING ACTIVE")}
 async function signUp(){if(!supabase)return;if(name.trim().length<2){setStatus("ENTER A PLAYER NAME");return}const {data,error}=await supabase.auth.signUp({email,password});if(error){setStatus(error.message);return}if(data.user){await supabase.from("arcade_profiles").upsert({user_id:data.user.id,display_name:name.trim(),last_seen_at:new Date().toISOString()})}setStatus(data.session?"PLAYER CREATED — COMPETITIVE RECORDING ACTIVE":"CHECK YOUR EMAIL TO CONFIRM YOUR PLAYER ACCOUNT")}
 async function signOut(){if(!supabase)return;await supabase.auth.signOut();setStatus("SIGNED OUT — PRACTICE REMAINS AVAILABLE")}
 const mine=leaders.findIndex(x=>x.user_id===user?.id);
 return <section className="playerCommand"><style>{`
 .playerCommand{margin:0 14px 100px;border:1px solid #1b4a5d;border-radius:18px;background:linear-gradient(135deg,#04131e,#020912);padding:18px;color:#dff8ff}.pcHead{display:flex;justify-content:space-between;gap:20px;align-items:end;border-bottom:1px solid #163847;padding-bottom:12px}.pcHead small{color:#65eaff;font-size:9px;font-weight:1000;letter-spacing:.15em}.pcHead h2{margin:5px 0 0;font-size:24px}.pcStatus{font-size:9px;color:#ffd363;text-align:right}.pcGrid{display:grid;grid-template-columns:310px 1fr;gap:16px;margin-top:16px}.pcCard{border:1px solid #173a4b;border-radius:14px;background:#06131d;padding:14px}.pcCard h3{margin:0 0 10px;font-size:10px;letter-spacing:.12em;color:#69eaff}.pcInputs{display:grid;gap:8px}.pcInputs input{width:100%;border:1px solid #24495a;border-radius:9px;background:#020a10;color:white;padding:10px}.pcButtons{display:flex;gap:7px;margin-top:9px;flex-wrap:wrap}.pcButtons button{border:1px solid #3a7186;border-radius:9px;background:#092333;color:#e8fcff;padding:9px 11px;font-weight:900;font-size:9px;cursor:pointer}.pcButtons button.primary{border-color:#ffd363;color:#ffe7a0;background:#2b2208}.rankCall{margin-top:12px;padding:11px;border:1px solid #2e6555;border-radius:10px;color:#72efbb;background:#062019}.leaderRows{display:grid;gap:5px}.leader{display:grid;grid-template-columns:42px minmax(120px,1fr) 100px 85px 85px;gap:8px;align-items:center;padding:8px 10px;border:1px solid #123342;border-radius:9px;background:#04101a;font-size:10px}.leader.me{border-color:#ffd363;background:#241d08}.leader strong{color:#ffd363}.leader span:nth-child(n+3){text-align:right;color:#9fc2cf}.empty{color:#688895;font-size:11px;padding:20px;text-align:center}@media(max-width:850px){.pcGrid{grid-template-columns:1fr}.leader{grid-template-columns:35px 1fr 80px}.leader span:nth-child(4),.leader span:nth-child(5){display:none}.pcHead{align-items:start;flex-direction:column}.pcStatus{text-align:left}}
 `}</style><div className="pcHead"><div><small>TA-14 ACADEMY ARCADE PLAYER NETWORK</small><h2>608 PLAYER COMMAND CENTER</h2></div><div className="pcStatus">{status}</div></div><div className="pcGrid"><div className="pcCard"><h3>{user?"YOUR PLAYER PROFILE":"SIGN UP / SIGN IN"}</h3>{user?<><p style={{fontSize:12}}>Signed in as <b>{user.email}</b></p><div className="rankCall">{mine>=0?<>CURRENT TOP-25 RANK <strong>#{mine+1}</strong></>:<>Complete a qualifying run to enter the 608 leaderboard.</>}</div><div className="pcButtons"><button onClick={signOut}>SIGN OUT</button></div></>:<><div className="pcInputs"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Player name (needed for sign up)" maxLength={32}/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email"/><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password"/></div><div className="pcButtons"><button className="primary" onClick={signUp}>CREATE PLAYER</button><button onClick={signIn}>SIGN IN</button></div></>}</div><div className="pcCard"><h3>TOP 25 — EPA 608</h3><div className="leaderRows">{leaders.length?leaders.map((p,i)=>{const acc=p.questions_answered?Math.round(p.correct_answers/p.questions_answered*100):0;return <div className={`leader ${p.user_id===user?.id?"me":""}`} key={p.user_id}><strong>#{i+1}</strong><span>{p.display_name}</span><span>{Number(p.best_score).toLocaleString()} XP</span><span>{acc}% ACC</span><span>{p.games_played} RUNS</span></div>}):<div className="empty">The leaderboard opens as verified player runs are recorded.</div>}</div></div></div></section>
}
