import OpenDoorIntake from './OpenDoorIntake';
import DecisionGuide from './DecisionGuide';
import Link from 'next/link';

export const metadata = {
 title: 'TA14 Open Door | Pay It Forward',
 description: 'Tell TA14 what is preventing an important decision. Explore a bounded evidence-and-authority examination and our one-for-one Pay It Forward service program.',
};

const steps = [
 ['01', 'Tell us the obstacle', 'Describe the decision you need to make, what evidence exists, and what is preventing action.'],
 ['02', 'Check the fit', 'We review whether a bounded TA14 examination can genuinely help. If not, we say so.'],
 ['03', 'Agree on a pilot', 'Before any payment, agree in writing on the scope, deliverables, price, timeframe, and refund procedure.'],
 ['04', 'Examine and preserve', 'We document evidence, applicable authority, established standing, limitations, and the supported disposition.'],
];

export default function OpenDoorPage() {
 return <main style={{background:'#071522',color:'#f4f7f8',minHeight:'100vh',fontFamily:'system-ui,sans-serif'}}>
 <div style={{maxWidth:960,margin:'auto',padding:'32px 22px 80px'}}>
 <nav style={{display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap',fontSize:13}}><Link href="/" style={{color:'#9ce3d5'}}>← TA14 EXCHANGE</Link><Link href="/showrooms" style={{color:'#9ce3d5'}}>Explore public showrooms</Link></nav>
 <header style={{padding:'76px 0 48px'}}>
 <p style={{letterSpacing:3,color:'#9ce3d5',fontSize:12,fontWeight:700}}>TA14 AUTHORITY GOVERNANCE INSTITUTION</p>
 <h1 style={{fontSize:'clamp(44px,8vw,82px)',lineHeight:1.04,letterSpacing:-2,margin:'20px 0'}}>An open door to<br/><span style={{color:'#9ce3d5'}}>accountable action.</span></h1>
 <p style={{fontSize:21,lineHeight:1.55,maxWidth:720,color:'#d3e0e7'}}>Tell us what you are trying to accomplish, what is holding you back, and what you have already documented. If TA14 can genuinely help, we will explore a small, bounded pilot. If we cannot, we will tell you.</p>
 <a href="mailto:ta14admissibleexecution@gmail.com?subject=TA14%20Open%20Door%20%E2%80%94%20My%20decision%20and%20obstacle&body=Organization%3A%0AWhat%20we%20want%20to%20accomplish%3A%0AWhat%20is%20preventing%20us%3A%0AEvidence%20already%20available%3A%0AWho%20is%20authorized%20to%20decide%3A%0A" style={{display:'inline-block',background:'#9ce3d5',color:'#071522',padding:'15px 22px',borderRadius:8,fontWeight:700,textDecoration:'none',marginTop:16}}>Tell us your obstacle →</a>
 <p style={{fontSize:13,color:'#a8bbc7',marginTop:18}}>Please do not send confidential, personal, or sensitive records in your first message.</p>
 </header>
 <DecisionGuide />
 <section style={{borderTop:'1px solid #395260',paddingTop:36,marginTop:48}}><h2 style={{fontSize:32}}>How a first engagement works</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:16}}>{steps.map(([n,title,body])=><article key={n} style={{background:'#102737',padding:20,borderRadius:10}}><span style={{color:'#9ce3d5'}}>{n}</span><h3>{title}</h3><p style={{color:'#c0d2dc',lineHeight:1.6}}>{body}</p></article>)}</div></section>
 <section style={{marginTop:60,padding:30,border:'1px solid #3b6870',borderRadius:12}}><p style={{color:'#9ce3d5',letterSpacing:2,fontSize:12}}>ONE FOR ONE</p><h2 style={{fontSize:34}}>Pay It Forward</h2><p style={{fontSize:18,lineHeight:1.7}}>Introduce a new customer who completes a qualifying paid TA14 engagement, and earn a complimentary eligible service entitlement equivalent in value to that paid scope. Each qualifying referral earns another entitlement. We recognize the relationships you bring, not just the payment.</p><p style={{color:'#b9ccd6',lineHeight:1.6}}>Referral eligibility, redemption, and restrictions will be documented before participation. Referral rewards are unavailable where applicable law, procurement requirements, or professional ethics prohibit them. Complimentary services remain subject to appropriate scope and capacity.</p></section>
 <section style={{marginTop:30,padding:24,background:'#102737',borderRadius:12}}><h2 style={{fontSize:26}}>Already know someone who needs TA14?</h2><p style={{lineHeight:1.65,color:'#d3e0e7'}}>Introduce them by email, with their permission. Include your name and the new customer's organization. TA14 will confirm the introduction in writing and explain eligibility before any paid engagement. Until the referral ledger and award controls are launched, complimentary entitlements are reviewed and recorded manually; no reward is automatic.</p><a href="mailto:ta14admissibleexecution@gmail.com?subject=TA14%20Pay%20It%20Forward%20referral&body=My%20name%3A%0AMy%20organization%3A%0AReferred%20organization%3A%0AContact%20person%20(with%20permission)%3A%0AProblem%20they%20want%20to%20solve%3A%0A" style={{display:'inline-block',background:'#9ce3d5',color:'#071522',padding:'13px 19px',borderRadius:8,fontWeight:700,textDecoration:'none'}}>Prepare a referral email →</a><p style={{fontSize:13,color:'#a8bbc7'}}>No payment is taken here. An email introduction does not itself earn a complimentary service.</p></section>
 <section style={{marginTop:55}}><h2 style={{fontSize:32}}>Fair pricing. Accountable delivery.</h2><p style={{fontSize:18,lineHeight:1.7}}>Eligible micro-examinations are proposed to begin at $149 for a first route and $49 for an additional route. More complex matters require a separate scope and quote. We offer a 100% pilot-fee refund if you are dissatisfied with a completed pilot, under the written terms agreed before payment.</p><p style={{color:'#b9ccd6',lineHeight:1.6}}>TA14 examines evidence, authority, standing, and decision boundaries. We do not promise approval, substitute for licensed professional services, or confer regulatory authority. ALLOW, HOLD, DENY, and ESCALATE remain possible findings.</p></section>
 <OpenDoorIntake />
 <section style={{marginTop:55,background:'#102737',padding:30,borderRadius:12}}><h2 style={{fontSize:30}}>Vet us. Ask questions. Start small.</h2><p style={{lineHeight:1.7}}>Explore our public work and independently assess whether our approach is relevant. We prefer an initial written conversation without pressure or obligation.</p><a href="mailto:ta14admissibleexecution@gmail.com?subject=TA14%20Open%20Door%20inquiry" style={{color:'#9ce3d5',fontWeight:700}}>Start a written conversation →</a></section>
 <footer style={{marginTop:56,fontSize:13,color:'#a8bbc7'}}>TA14 Authority Governance Institution · Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</footer>
 </div></main>;
}
