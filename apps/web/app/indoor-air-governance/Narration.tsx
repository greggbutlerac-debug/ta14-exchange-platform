'use client';
import { useEffect, useState } from 'react';
const scripts = [
'01 — REALITY. We begin with the actual classroom, not a dashboard conclusion. Occupancy, indoor carbon dioxide, outdoor particulate matter, and the operating state of the air-handling system establish the physical context. Observation alone is not permission to intervene.',
'02 — RECORD. Preserve the raw readings, instrument identity, timestamp, location, and HVAC state. The Atmospheric Integrity Record must retain what was actually observed and where it came from. A summary cannot replace its original evidence.',
'03 — CONTINUITY. The original evidence must remain attributable as it moves through storage, processing, handoffs, and time. Changed conditions do not erase the original record. They change what that record can support now.',
'04 — ADMISSIBILITY. A preserved reading may be authentic but insufficient for the proposed ventilation action. The question is whether current evidence is relevant, reliable, and sufficient for this particular consequence.',
'05 — BINDING. Connect the evidence to the specific HVAC asset, applicable policy, operating constraints, responsible decision maker, and proposed action. An observation does not independently grant authority.',
'06 — COMMIT. Before any physical action, test admissible evidence, applicable authority, and established standing. With wildfire smoke changing outdoor air, the earlier proposal is held pending renewed examination.',
'07 — EXECUTION. HOLD means the prepared ventilation command is not released. The equipment remains under its existing authorized control. Capability is not authority.',
'08 — OUTCOME. Verify and record what actually happened, including non-execution. Preserve the held command, decision context, equipment state, and new environmental observations. A documented HOLD is an outcome.'
];
export default function Narration({index}:{index:number}) {
 const [playing,setPlaying]=useState(false);
 const [supported,setSupported]=useState(true);
 useEffect(()=>{setSupported(typeof window!=='undefined' && 'speechSynthesis' in window);return ()=>{if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();};},[]);
 function toggle(){if(!supported)return;window.speechSynthesis.cancel();if(playing){setPlaying(false);return;}const utterance=new SpeechSynthesisUtterance(scripts[index]);utterance.lang='en-US';utterance.rate=.9;const voices=window.speechSynthesis.getVoices();const samantha=voices.find(v=>/samantha/i.test(v.name));if(samantha)utterance.voice=samantha;utterance.onend=()=>setPlaying(false);utterance.onerror=()=>setPlaying(false);window.speechSynthesis.speak(utterance);setPlaying(true);}
 return <div><button type="button" onClick={toggle} disabled={!supported} aria-label={playing?'Stop narration':'Play numbered narration'} style={{background:'#153a43',color:'#e8f1f3',border:'1px solid #9ee7d1',padding:'10px 16px',cursor:'pointer'}}>{playing?'■ Stop narration':'▶ Play narration'}</button>{!supported&&<p>Audio narration is not supported by this browser.</p>}<details style={{marginTop:10}}><summary>Read narration transcript</summary><p>{scripts[index]}</p></details></div>;
}
