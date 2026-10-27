'use client';

import {useState, type FormEvent} from 'react';

const recipient = 'ta14admissibleexecution@gmail.com';

export default function OpenDoorIntake() {
 const [organization,setOrganization] = useState('');
 const [contact,setContact] = useState('');
 const [email,setEmail] = useState('');
 const [goal,setGoal] = useState('');
 const [obstacle,setObstacle] = useState('');
 const [evidence,setEvidence] = useState('');
 const [referrer,setReferrer] = useState('');
 const [ack,setAck] = useState(false);
 function submit(event:FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (!ack) return;
  const subject = 'TA14 Open Door inquiry - ' + (organization.trim() || 'individual');
  const body = [
   'Organization / individual: '+organization.trim(),
   'Contact name: '+contact.trim(),
   'Reply email: '+email.trim(),
   'What we want to accomplish: '+goal.trim(),
   'What is preventing us: '+obstacle.trim(),
   'What records exist (describe only): '+(evidence.trim()||'Not specified'),
   'Referred by (optional): '+(referrer.trim()||'Not specified'),
   '',
   'I understand this is an initial inquiry, not a paid engagement or an agreement to share confidential records.'
  ].join('\n');
  window.location.href = 'mailto:'+recipient+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 }
 const fieldStyle = {display:'block',width:'100%',boxSizing:'border-box' as const,border:'1px solid #64808b',borderRadius:7,background:'#f8fbfd',color:'#102737',padding:12,font:'inherit',marginTop:7};
 const labelStyle = {display:'block',fontWeight:600,marginTop:18};
 return <section aria-labelledby="open-door-intake" style={{marginTop:54,background:'#102737',padding:'26px',borderRadius:12}}>
  <p style={{color:'#9ce3d5',fontSize:12,letterSpacing:2}}>NO OBLIGATION</p>
  <h2 id="open-door-intake" style={{fontSize:32}}>Tell us where you are stuck.</h2>
  <p style={{color:'#d3e0e7',lineHeight:1.6}}>This form prepares an email in your own email app. Nothing is submitted to a TA14 database. You can review and edit the message before sending.</p>
  <form onSubmit={submit}>
   <label style={labelStyle}>Organization or individual <input style={fieldStyle} required maxLength={120} value={organization} onChange={e=>setOrganization(e.target.value)} /></label>
   <label style={labelStyle}>Your name <input style={fieldStyle} required maxLength={120} value={contact} onChange={e=>setContact(e.target.value)} /></label>
   <label style={labelStyle}>Reply email <input type="email" style={fieldStyle} required maxLength={180} value={email} onChange={e=>setEmail(e.target.value)} /></label>
   <label style={labelStyle}>What do you want to accomplish? <textarea style={fieldStyle} required rows={3} maxLength={1500} value={goal} onChange={e=>setGoal(e.target.value)} /></label>
   <label style={labelStyle}>What is preventing that today? <textarea style={fieldStyle} required rows={3} maxLength={1500} value={obstacle} onChange={e=>setObstacle(e.target.value)} /></label>
   <label style={labelStyle}>What evidence or records exist? (description only) <textarea style={fieldStyle} rows={2} maxLength={800} value={evidence} onChange={e=>setEvidence(e.target.value)} /></label>
   <label style={labelStyle}>Who introduced you to TA14? (optional) <input style={fieldStyle} maxLength={180} value={referrer} onChange={e=>setReferrer(e.target.value)} /></label>
   <label style={{display:'flex',alignItems:'flex-start',gap:10,marginTop:24,lineHeight:1.5}}><input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)} required style={{marginTop:5}} />I will not include confidential, sensitive, or personal records in this first inquiry.</label>
   <button type="submit" disabled={!ack} style={{background:ack?'#9ce3d5':'#64748b',color:'#071522',border:0,padding:'14px 20px',borderRadius:8,fontWeight:700,cursor:ack?'pointer':'not-allowed',marginTop:20}}>Prepare my email →</button>
  </form>
 </section>;
}
