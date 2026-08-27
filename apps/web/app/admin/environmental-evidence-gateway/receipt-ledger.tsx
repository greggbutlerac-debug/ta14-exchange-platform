'use client';

import { useEffect, useState } from 'react';

type ReceiptSeed={record_id:string;replay_id:string;evidence_hash:string;determination_hash:string;determination:string;receipt_payload:unknown};
type Preserved={record_id:string;replay_id:string;determination:string;preserved_at:string;replay_verification:{status:'PASS'|'FAIL';recomputed_hash:string;stored_hash:string}};

export default function ReceiptLedger({seed}:{seed:ReceiptSeed}){
 const[receipts,setReceipts]=useState<Preserved[]>([]);const[status,setStatus]=useState('');const[busy,setBusy]=useState(false);
 async function load(){try{const r=await fetch('/api/admin/environmental-evidence-gateway/receipts',{cache:'no-store'});const b=await r.json();if(r.ok)setReceipts(b.receipts??[]);else setStatus(b.error??'Receipt ledger unavailable.')}catch{setStatus('Receipt ledger unavailable.')}}
 useEffect(()=>{void load()},[]);
 async function preserve(){setBusy(true);setStatus('Verifying canonical receipt before preservation…');try{const r=await fetch('/api/admin/environmental-evidence-gateway/receipts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(seed)});const b=await r.json();if(!r.ok)throw new Error(b.error??'Preservation failed.');setStatus(`PRESERVED · REPLAY VERIFICATION ${b.replay_verification.status}`);await load()}catch(e){setStatus(e instanceof Error?e.message:'Preservation failed.')}finally{setBusy(false)}}
 return <section style={{marginTop:18}}>
  <div style={actionCard}><div><div style={label}>DURABLE PRIVATE LEDGER</div><div style={{fontSize:20,fontWeight:800,marginTop:5}}>Preserve this governed result</div><p style={copy}>Write the current canonical receipt to the owner-scoped ledger only after its SHA-256 verifies server-side.</p></div><button onClick={preserve} disabled={busy} style={{...button,opacity:busy?.65:1,cursor:busy?'wait':'pointer'}}>{busy?'VERIFYING…':'PRESERVE RECEIPT'}</button></div>
  {status&&<div style={{...notice,borderColor:status.includes('PRESERVED')?'#b9ddc3':'#d8e0ea',background:status.includes('PRESERVED')?'#eef9f1':'#f7f9fc'}}><b>{status}</b></div>}
  <div style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'end',margin:'24px 0 10px'}}><div><div style={label}>LEDGER</div><h3 style={{margin:'4px 0 0',fontSize:19}}>Private preserved receipts</h3></div><span style={count}>{receipts.length} preserved</span></div>
  {receipts.length?<div style={{display:'grid',gap:10}}>{receipts.map(r=><article key={r.replay_id} style={receiptCard}><div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}><div><div style={{fontWeight:800}}>{r.record_id}</div><div style={mono}>{r.replay_id}</div></div><div style={{display:'flex',gap:8,alignItems:'center'}}><span style={pill}>{r.determination}</span><span style={{...pill,background:r.replay_verification.status==='PASS'?'#eaf7ee':'#fff0f0',color:r.replay_verification.status==='PASS'?'#28633a':'#9f2f2f'}}>{r.replay_verification.status==='PASS'?'REPLAY VERIFIED':'REPLAY FAILED'}</span></div></div><div style={{fontSize:12,color:'#7b8798',marginTop:12}}>Preserved {new Date(r.preserved_at).toLocaleString()}</div></article>)}</div>:<div style={empty}><div style={{fontWeight:750}}>No private receipts preserved yet.</div><div style={{fontSize:13,color:'#748094',marginTop:5}}>The current run remains ephemeral until you deliberately preserve it.</div></div>}
 </section>
}
const actionCard:React.CSSProperties={display:'flex',justifyContent:'space-between',alignItems:'center',gap:24,flexWrap:'wrap',padding:20,border:'1px solid #dce4ed',borderRadius:16,background:'#f8fafc'};
const label:React.CSSProperties={fontSize:10,letterSpacing:'.14em',fontWeight:850,color:'#6f7d90'};
const copy:React.CSSProperties={margin:'7px 0 0',fontSize:13,color:'#657286',lineHeight:1.55,maxWidth:650};
const button:React.CSSProperties={border:0,borderRadius:11,padding:'12px 16px',background:'#17283e',color:'#fff',fontSize:11,fontWeight:850,letterSpacing:'.07em'};
const notice:React.CSSProperties={marginTop:12,padding:'12px 14px',border:'1px solid',borderRadius:11,fontSize:12,color:'#344256'};
const count:React.CSSProperties={fontSize:11,fontWeight:800,color:'#68778a',background:'#f1f4f8',padding:'6px 9px',borderRadius:999};
const receiptCard:React.CSSProperties={padding:17,border:'1px solid #e1e7ee',borderRadius:14,background:'#fff'};
const mono:React.CSSProperties={fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace',fontSize:11,color:'#748094',marginTop:5,wordBreak:'break-all'};
const pill:React.CSSProperties={fontSize:10,fontWeight:850,letterSpacing:'.05em',padding:'6px 8px',borderRadius:999,background:'#eef3f8',color:'#34485e'};
const empty:React.CSSProperties={padding:22,border:'1px dashed #cfd8e3',borderRadius:14,background:'#fbfcfd'};
