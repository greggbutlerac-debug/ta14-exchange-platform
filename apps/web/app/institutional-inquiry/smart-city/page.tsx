'use client';
import Link from 'next/link';
import {useState} from 'react';
export default function SmartCityInquiry(){
 const [pathway,setPathway]=useState('Municipal & Government');
 const [organization,setOrganization]=useState('');
 const [role,setRole]=useState('');
 const [email,setEmail]=useState('');
 const [useCase,setUseCase]=useState('');
 const [boundary,setBoundary]=useState('');
 const [engagement,setEngagement]=useState('Initial written discussion');
 const fields=[['Organization',organization,setOrganization],['Name and institutional role',role,setRole],['Reply email',email,setEmail]];
 const ready=organization.trim()&&role.trim()&&email.includes('@')&&useCase.trim()&&boundary.trim();
 const body=['TA14 SMART CITY — INSTITUTIONAL INQUIRY','Pathway: '+pathway,'Organization: '+organization,'Name / role: '+role,'Reply email: '+email,'Use case: '+useCase,'Proposed consequence / execution boundary: '+boundary,'Requested engagement: '+engagement,'','This inquiry does not establish registration, admissibility, authority, standing, approval, or a formal disposition.'].join('\n');
 const mailto='mailto:ta14admissibleexecution@gmail.com?subject='+encodeURIComponent('TA14 Smart City — Institutional Inquiry')+'&body='+encodeURIComponent(body);
 const field={display:'block',width:'100%',boxSizing:'border-box',marginTop:8,padding:12,border:'1px solid #57748c',borderRadius:8,background:'#102d44',color:'#fff',fontSize:16};
 return <main style={{background:'#071a2b',color:'#e6f4ff',minHeight:'100vh',padding:'50px 20px',fontFamily:'system-ui,sans-serif'}}><div style={{maxWidth:760,margin:'auto'}}>
 <Link href="/showrooms/smart-city-admissible-governance" style={{color:'#9de2eb'}}>← Return to Smart City showroom</Link>
 <p style={{color:'#f4ca70',fontSize:12,letterSpacing:2,marginTop:36}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · WRITTEN INQUIRY</p>
 <h1 style={{fontSize:'clamp(30px,5vw,48px)'}}>Request a Technical Examination</h1>
 <p style={{lineHeight:1.7,color:'#c4d7e5'}}>Tell us which real-world consequence you want to examine. This opens a written inquiry only; formal examination, governance registration, and commercial scope require separate agreement.</p>
 <form onSubmit={e=>{e.preventDefault();if(ready)window.location.href=mailto;}} style={{display:'grid',gap:18,marginTop:30}}>
 <label>Institutional pathway<select value={pathway} onChange={e=>setPathway(e.target.value)} style={field}>{['Municipal & Government','Technology & Infrastructure','Research & Standards'].map(x=><option key={x}>{x}</option>)}</select></label>
 {fields.map(([label,value,setValue])=><label key={label}>{label}<input required type={label==='Reply email'?'email':'text'} value={value} onChange={e=>setValue(e.target.value)} style={field}/></label>)}
 <label>Infrastructure use case<textarea required rows={3} value={useCase} onChange={e=>setUseCase(e.target.value)} style={field}/></label>
 <label>Proposed consequence / execution boundary<textarea required rows={3} value={boundary} onChange={e=>setBoundary(e.target.value)} style={field}/></label>
 <label>Requested engagement<select value={engagement} onChange={e=>setEngagement(e.target.value)} style={field}>{['Initial written discussion','Bounded technical examination scoping','Governance registration information','Commercial integration discussion'].map(x=><option key={x}>{x}</option>)}</select></label>
 <button type="submit" disabled={!ready} style={{background:'#9de2eb',color:'#062232',border:0,borderRadius:9,padding:15,fontWeight:800,opacity:ready?1:.5,cursor:'pointer'}}>Prepare email inquiry ↗</button>
 </form><p style={{fontSize:13,color:'#b4cad8',lineHeight:1.7}}>The button opens your email application with the information above. Nothing is transmitted by this page; review and send the email yourself.</p>
 <p style={{marginTop:30,color:'#f4ca70'}}>Capability ≠ Authority. No admissible evidence. No admissible execution.</p>
 </div></main>;
}
