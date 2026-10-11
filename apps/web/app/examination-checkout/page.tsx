'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';

type PayPalButtons={render:(target:HTMLElement)=>Promise<void>;close?:()=>void};
type PayPalWindow=Window & {paypal?:{Buttons:(options:Record<string,unknown>)=>PayPalButtons}};
const PRODUCT='governed-consequence-examination';
export default function ExaminationCheckout(){
 const [status,setStatus]=useState('');const [ready,setReady]=useState(false);
 const [claim,setClaim]=useState('');const [email,setEmail]=useState('');
 const [confirmed,setConfirmed]=useState(false);const [order,setOrder]=useState('');
 const box=useRef<HTMLDivElement>(null);
 const clientId=process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
 useEffect(()=>{if(!clientId||!confirmed||!claim.trim()||!email.trim())return;
 const id='ta14-exam-paypal-sdk';
 if((window as PayPalWindow).paypal){setReady(true);return}
 let script=document.getElementById(id) as HTMLScriptElement|null;
 if(!script){script=document.createElement('script');script.id=id;script.src='https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(clientId)+'&currency=USD&intent=capture&components=buttons';script.async=true;document.body.appendChild(script)}
 const ok=()=>setReady(true);const fail=()=>setStatus('PayPal could not load. Please retry.');
 script.addEventListener('load',ok);script.addEventListener('error',fail);
 return()=>{script?.removeEventListener('load',ok);script?.removeEventListener('error',fail)}
 },[clientId,confirmed,claim,email]);
 useEffect(()=>{if(!ready||!box.current||!confirmed)return;const paypal=(window as PayPalWindow).paypal;if(!paypal)return;
 let disposed=false;box.current.innerHTML='';
 const buttons=paypal.Buttons({
  style:{layout:'vertical',shape:'rect',label:'paypal'},
  createOrder:async()=>{setStatus('Creating secure PayPal order…');const r=await fetch('/api/paypal/create-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId:PRODUCT,customerReference:email.trim().slice(0,120)})});const data=await r.json();if(!r.ok||!data.orderId&&!data.id)throw Error(data.message||'Unable to create order');return data.orderId||data.id},
  onApprove:async(data:{orderID:string})=>{setStatus('Verifying payment…');const r=await fetch('/api/paypal/capture-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:data.orderID})});const result=await r.json();if(!r.ok||result.status!=='COMPLETED'&&result.captureStatus!=='COMPLETED'){setStatus('Payment not confirmed. Please contact TA14 with your PayPal order reference.');return}setOrder(data.orderID);setStatus('Payment confirmed. Email your examination materials using the link below.')},
  onCancel:()=>setStatus('Payment cancelled; no examination has been purchased.'),
  onError:()=>setStatus('PayPal encountered an error. No payment is confirmed here.')
 });
 void buttons.render(box.current).catch(()=>{if(!disposed)setStatus('Unable to display PayPal checkout.')});
 return()=>{disposed=true;buttons.close?.()}
 },[ready,confirmed,email]);
 const intake='mailto:ta14admissibleexecution@gmail.com?subject='+encodeURIComponent('Paid TA14 examination - PayPal '+order)+'&body='+encodeURIComponent('PayPal order: '+order+'\nContact: '+email+'\nProposed consequence: '+claim+'\nEvidence links / authority / standing: ');
 return <main style={{minHeight:'100vh',background:'#081321',color:'#eef5fc',padding:'48px 20px',fontFamily:'system-ui'}}>
 <div style={{maxWidth:720,margin:'auto'}}><Link href="/pricing" style={{color:'#8ddcf4'}}>← Pricing</Link><p style={{letterSpacing:2,color:'#8ddcf4'}}>TA14 AUTHORITY GOVERNANCE INSTITUTION</p>
 <h1 style={{fontSize:38}}>One bounded examination. $149.</h1><p>Purchase an independent review of one proposed consequence. A paid examination does not guarantee ALLOW, certification, or regulatory approval. Possible dispositions: ALLOW / HOLD / DENY / ESCALATE.</p>
 <div style={{background:'#11263a',padding:24,borderRadius:14,marginTop:24}}>
 <label htmlFor="claim">What consequence should TA14 examine?</label><textarea id="claim" value={claim} onChange={e=>setClaim(e.target.value)} maxLength={1500} rows={4} style={{display:'block',width:'100%',margin:'8px 0 18px',padding:12,color:'#14202a'}} placeholder="Describe one proposed consequence and the system or decision involved."/>
 <label htmlFor="email">Your email for the examination record</label><input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{display:'block',width:'100%',margin:'8px 0 18px',padding:12,color:'#14202a'}} placeholder="you@example.com"/>
 <label style={{display:'flex',gap:10,alignItems:'start'}}><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> I understand this is a $149 examination of one bounded claim, not a guaranteed favorable result. I will provide the necessary evidence and authority context.</label>
 <div style={{marginTop:20}}>{!clientId?<p>PayPal is not configured for this deployment. Please contact TA14 before paying.</p>:!confirmed||!claim.trim()||!email.includes('@')?<p>Complete the description, email, and acknowledgement to enable secure checkout.</p>:<div ref={box}/>}</div>
 {status&&<p role="status">{status}</p>}{order&&<p><a href={intake} style={{color:'#8ddcf4',fontWeight:700}}>Send your examination evidence and order reference →</a></p>}
 </div><p style={{fontSize:13,opacity:.75,marginTop:20}}>Payment is processed by PayPal. TA14 does not collect your PayPal password or card information on this page. Do not submit sensitive evidence until a secure handling method is agreed.</p></div></main>
}