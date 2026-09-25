'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Gate = 'supported' | 'missing' | 'expired' | 'outside';
type Result = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';

const convergence = [
  {
    tag: 'AUTOMATEDBUILDINGS',
    title: 'PROOF OVER PROMISE',
    lead: 'Ken Sinclair · Kelly Sinclair',
    text: 'AutomatedBuildings has framed its AHR Expo 2027 education program around a direct industry challenge: verify what smart buildings actually deliver.'
  },
  {
    tag: 'MONDAY LIVE',
    title: 'THE LIVE INDUSTRY CONVERSATION',
    lead: 'Ken Sinclair · Anto · panel community',
    text: 'The discussion is moving from claims and capability toward trust at runtime: transactions, APIs, changing conditions, autonomous decisions, and the boundary between information and consequence.'
  },
  {
    tag: 'CONNECTION PROFILE',
    title: 'THE GOVERNED CROSSING',
    lead: 'Anto · Connection Profile discussion · role open for confirmation',
    text: 'A Connection Profile can define what may cross between independently governed systems. Context can travel without silently converting connectivity into execution authority. Anto is explicitly invited to correct, narrow, or refine how his role and the Connection Profile are represented here.'
  },
  {
    tag: 'ONUMA',
    title: 'OWNER → INFORMATION → CONSEQUENCE',
    lead: 'Kimon Onuma · ONUMA',
    text: 'Persistent identity, semantic relationships, RDF/Turtle connectivity, and owner requirements give independently governed systems a shared way to point at the same asset reality.'
  },
  {
    tag: 'ASSET LEADERSHIP NETWORK',
    title: 'OWNER NEED MEETS EXECUTION',
    lead: 'ALN · Th@3',
    text: 'Asset leadership brings the owner, lifecycle, business process, and consequence into the same conversation: what must happen, why, under whose responsibility, and with what record afterward.'
  },
  {
    tag: 'ASHRAE TC 1.4',
    title: 'TECHNICAL CHALLENGE IN CHICAGO',
    lead: 'Innovative & Disruptive Technologies',
    text: 'TC 1.4 invited TA-14 into its Winter Conference discussion and indicated roughly ten minutes would be allocated to the TA-14 execution-boundary topic. The committee can challenge the question and determine whether a broader technical gap exists; if it does, Research Subcommittee consideration and possible development toward an ASHRAE research topic could follow.'
  }
];

const chain = [
  ['01', 'PROMISE', 'A claimed capability, benefit, recommendation, optimization, or outcome.'],
  ['02', 'PROOF', 'What was actually measured, verified, observed, or demonstrated?'],
  ['03', 'ADMISSIBLE EVIDENCE', 'Is the proof attributable, current, continuous enough, and fit for this exact proposition?'],
  ['04', 'APPLICABLE AUTHORITY', 'What authority governs this proposed consequence here and now?'],
  ['05', 'ESTABLISHED STANDING', 'Does the actor or system seeking execution possess the standing required for this consequence?'],
  ['06', 'COMMIT', 'What exact bounded consequence is being committed, under what present conditions?'],
  ['07', 'EXECUTION', 'Did the authorized system actually perform the bounded action?'],
  ['08', 'OUTCOME', 'What became real, and what new baseline must now be revalidated?']
];

const voices = [
  ['KEN + KELLY / AUTOMATEDBUILDINGS', 'Make the industry show the proof, not merely repeat the promise.'],
  ['KIMON / ONUMA', 'Make the owner requirement and information relationships explicit and machine-usable.'],
  ['ANTO / CONNECTION PROFILE', 'Make the crossing between systems explicit: what may travel, in what form, and under what bounded interface.'],
  ['ALN', 'Keep the owner, asset lifecycle, decision, responsibility, and business consequence in view.'],
  ['TA-14', 'Ask the final pre-consequence question: does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?']
];

export default function ProofOverPromiseChicagoShowroom() {
  const [proof, setProof] = useState<Gate>('supported');
  const [authority, setAuthority] = useState<Gate>('expired');
  const [standing, setStanding] = useState<Gate>('supported');
  const [scope, setScope] = useState<Gate>('supported');
  const [submittedProof, setSubmittedProof] = useState('');
  const [submittedConsequence, setSubmittedConsequence] = useState('');
  const [receiptOpen, setReceiptOpen] = useState(false);

  const failureIndex = scope === 'outside' ? 5 : proof === 'missing' ? 1 : (authority === 'missing' || authority === 'expired') ? 2 : standing === 'missing' ? 3 : 7;

  const result: Result = useMemo(() => {
    if (scope === 'outside') return 'DENY';
    if (proof === 'missing') return 'HOLD';
    if (authority === 'missing' || authority === 'expired') return 'HOLD';
    if (standing === 'missing') return 'ESCALATE';
    return 'ALLOW';
  }, [proof, authority, standing, scope]);

  const color = {
    ALLOW: '#71f2b6',
    HOLD: '#ffd36f',
    DENY: '#ff7885',
    ESCALATE: '#b9a8ff'
  }[result];

  const explanation = {
    ALLOW: 'The proof supports the proposition, applicable authority is current, standing is established, and the proposed consequence remains inside the bounded scope.',
    HOLD: 'Proof alone is not enough. A required present condition is missing or no longer current, so the consequence stops before execution.',
    DENY: 'The proposed consequence exceeds the established boundary. Capability does not expand authority.',
    ESCALATE: 'The record does not establish standing strongly enough for automated execution. Governed human review is required.'
  }[result];

  const button = (active:boolean) => ({
    cursor: 'pointer',
    borderRadius: 999,
    border: active ? '1px solid rgba(113,242,182,.6)' : '1px solid rgba(124,211,238,.18)',
    background: active ? 'rgba(113,242,182,.12)' : 'rgba(3,14,24,.68)',
    color: active ? '#e8fff4' : '#91a8b5',
    padding: '10px 13px',
    fontWeight: 950,
    fontSize: 10,
    letterSpacing: '.08em'
  } as const);

  const card = {
    border: '1px solid rgba(111,220,255,.16)',
    background: 'linear-gradient(145deg,rgba(5,24,37,.84),rgba(3,11,19,.95))',
    borderRadius: 20
  } as const;

  return (
    <main style={{
      minHeight:'100vh',
      padding:'44px 18px 110px',
      background:'radial-gradient(circle at 84% -2%,rgba(46,195,255,.19),transparent 27%),radial-gradient(circle at 8% 24%,rgba(113,242,182,.10),transparent 28%),linear-gradient(180deg,#02060b,#06101a 46%,#02060b)',
      color:'#eef8fb',
      fontFamily:'Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'
    }}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <nav style={{display:'flex',justifyContent:'space-between',gap:14,flexWrap:'wrap',paddingBottom:20,borderBottom:'1px solid rgba(111,220,255,.12)'}}>
          <Link href="/showrooms" style={{color:'#9de8f7',textDecoration:'none',fontWeight:900}}>← TA-14 SHOWROOMS</Link>
          <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#718d9b'}}>PUBLIC TECHNICAL SHOWROOM · CHICAGO 2027</div>
        </nav>

        <section style={{marginTop:26,padding:'clamp(38px,7vw,84px)',border:'1px solid rgba(111,220,255,.24)',borderRadius:32,background:'linear-gradient(145deg,rgba(7,38,56,.97),rgba(4,13,22,.99) 56%,rgba(19,28,50,.96))',boxShadow:'0 40px 130px rgba(0,0,0,.48)',overflow:'hidden',position:'relative'}}>
          <div style={{position:'absolute',right:'-8%',top:'-34%',width:430,height:430,borderRadius:'50%',border:'1px solid rgba(113,242,182,.12)',boxShadow:'0 0 90px rgba(64,211,255,.08)'}} />
          <div style={{fontSize:11,fontWeight:950,letterSpacing:'.22em',color:'#70dcff'}}>AUTOMATEDBUILDINGS × CHICAGO 2027 × TA-14</div>
          <h1 style={{fontSize:'clamp(54px,9.5vw,124px)',lineHeight:.82,letterSpacing:'-.07em',margin:'24px 0 30px',maxWidth:1120}}>
            PROOF<br/><span style={{color:'#71f2b6'}}>OVER PROMISE.</span>
          </h1>
          <div style={{fontSize:'clamp(25px,3.7vw,49px)',fontWeight:1000,letterSpacing:'-.045em',lineHeight:1.02,maxWidth:1000}}>
            AND THEN ONE MORE QUESTION:
          </div>
          <div style={{marginTop:18,fontSize:'clamp(26px,4.2vw,58px)',fontWeight:1000,letterSpacing:'-.05em',lineHeight:1.02,maxWidth:1050,color:'#dffcff'}}>
            PROVEN SUFFICIENT FOR WHAT CONSEQUENCE?
          </div>
          <p style={{fontSize:'clamp(17px,2vw,23px)',lineHeight:1.65,maxWidth:1000,color:'#b6cbd5',margin:'28px 0 0'}}>
            Proof matters. But proof, by itself, does not establish permission to change physical reality. Chicago creates a rare convergence: AutomatedBuildings is building 18 education sessions around <b style={{color:'#fff'}}>Proof Over Promise</b>, while TA-14 has been invited into ASHRAE TC 1.4&apos;s Innovative &amp; Disruptive Technologies discussion to put the execution boundary under technical challenge.
          </p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:30}}>
            <a href="#chicago-exam" style={{padding:'10px 16px',borderRadius:999,background:'#71f2b6',color:'#02100a',textDecoration:'none',fontWeight:1000,fontSize:10,letterSpacing:'.08em'}}>RUN THE CHICAGO EXAM ↓</a>
            {['PROMISE','PROOF','EVIDENCE','AUTHORITY','STANDING','EXECUTION','OUTCOME'].map((x,i)=><span key={x} style={{padding:'10px 13px',borderRadius:999,border:i===1?'1px solid rgba(113,242,182,.5)':'1px solid rgba(111,220,255,.17)',background:i===1?'rgba(113,242,182,.1)':'rgba(3,12,20,.6)',fontSize:10,fontWeight:950,letterSpacing:'.1em',color:i===1?'#dffff0':'#8facba'}}>{x}</span>)}
          </div>
        </section>

        <section style={{marginTop:24,padding:'clamp(26px,5vw,48px)',...card}}>
          <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#70dcff'}}>WHY CHICAGO MATTERS</div>
          <h2 style={{fontSize:'clamp(34px,5.3vw,64px)',letterSpacing:'-.05em',lineHeight:1,margin:'12px 0 16px'}}>Two independent events. One unusually important week.</h2>
          <p style={{maxWidth:1000,color:'#b8cbd4',fontSize:17,lineHeight:1.72}}>
            The 2027 ASHRAE Winter Conference runs January 23–27 in Chicago. The independently managed AHR Expo runs January 25–27 at McCormick Place and is co-sponsored by ASHRAE and AHRI. They are concurrent, not the same event. TA-14&apos;s TC 1.4 discussion belongs to the ASHRAE Winter Conference; AutomatedBuildings&apos; announced 18-session <b style={{color:'#fff'}}>Proof Over Promise</b> program belongs to its AHR Expo work.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12,marginTop:24}}>
            {[
              ['JAN 23–27','ASHRAE WINTER CONFERENCE','Chicago · technical sessions · committee work · research discussion'],
              ['TC 1.4','INNOVATIVE & DISRUPTIVE TECHNOLOGIES','TA-14 invited into the discussion · roughly ten minutes indicated for the execution-boundary topic'],
              ['JAN 25–27','AHR EXPO','McCormick Place · co-sponsored by ASHRAE + AHRI · independently managed from the Winter Conference'],
              ['18 SESSIONS','AUTOMATEDBUILDINGS','Publicly framed around one idea: PROOF OVER PROMISE']
            ].map(([a,b,c],i)=><article key={b} style={{padding:22,borderRadius:17,border:i===1?'1px solid rgba(113,242,182,.36)':'1px solid rgba(111,220,255,.14)',background:i===1?'rgba(113,242,182,.045)':'rgba(2,10,17,.52)'}}>
              <div style={{fontSize:28,fontWeight:1000,color:i===1?'#71f2b6':'#70dcff',letterSpacing:'-.03em'}}>{a}</div>
              <div style={{marginTop:9,fontSize:12,fontWeight:950,letterSpacing:'.08em'}}>{b}</div>
              <div style={{marginTop:9,color:'#91a8b5',fontSize:13,lineHeight:1.55}}>{c}</div>
            </article>)}
          </div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:20}}>
            <a href="https://www.ashrae.org/conferences/2027-winter-conference" target="_blank" rel="noreferrer" style={{padding:'12px 15px',borderRadius:10,border:'1px solid rgba(111,220,255,.3)',color:'#b9f1ff',textDecoration:'none',fontWeight:900,fontSize:12}}>ASHRAE 2027 WINTER CONFERENCE ↗</a>
            <a href="https://www.ahrexpo.com/about" target="_blank" rel="noreferrer" style={{padding:'12px 15px',borderRadius:10,border:'1px solid rgba(111,220,255,.3)',color:'#b9f1ff',textDecoration:'none',fontWeight:900,fontSize:12}}>AHR EXPO 2027 ↗</a>
          </div>
        </section>

        <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
          <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#71f2b6'}}>THE CONVERGENCE</div>
          <h2 style={{fontSize:'clamp(35px,5.5vw,66px)',lineHeight:.98,letterSpacing:'-.05em',margin:'12px 0 24px'}}>Different people. Different architectures. The same boundary is coming into view.</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(285px,1fr))',gap:12}}>
            {convergence.map((x,i)=><article key={x.tag} style={{padding:24,borderRadius:19,border:i===5?'1px solid rgba(113,242,182,.36)':'1px solid rgba(111,220,255,.14)',background:i===5?'linear-gradient(145deg,rgba(29,85,64,.25),rgba(2,10,17,.74))':'rgba(2,10,17,.56)'}}>
              <div style={{fontSize:10,fontWeight:950,letterSpacing:'.16em',color:i===5?'#71f2b6':'#70dcff'}}>{x.tag}</div>
              <h3 style={{fontSize:22,lineHeight:1.08,margin:'10px 0 7px',letterSpacing:'-.02em'}}>{x.title}</h3>
              <div style={{fontSize:12,fontWeight:900,color:'#91aab6',marginBottom:12}}>{x.lead}</div>
              <p style={{margin:0,color:'#b5c6ce',lineHeight:1.65,fontSize:14}}>{x.text}</p>
            </article>)}
          </div>
        </section>

        <section style={{marginTop:24,padding:'clamp(30px,5vw,56px)',border:'1px solid rgba(113,242,182,.25)',borderRadius:24,background:'linear-gradient(135deg,rgba(19,65,51,.28),rgba(3,12,20,.95))'}}>
          <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#71f2b6'}}>THE SHARED QUESTION</div>
          <h2 style={{fontSize:'clamp(38px,6vw,74px)',lineHeight:.96,letterSpacing:'-.055em',margin:'13px 0 22px'}}>
            PROOF IS A GATE.<br/><span style={{color:'#71f2b6'}}>IT IS NOT THE LAST GATE.</span>
          </h2>
          <p style={{fontSize:'clamp(19px,2.4vw,28px)',lineHeight:1.5,maxWidth:1060,color:'#c5d8df'}}>
            A system may be correct. A model may be accurate. A sensor may be calibrated. A connection may be valid. A recommendation may be justified. A benchmark may be met. None of those facts, standing alone, answer whether the proposed consequence is permitted to become reality now.
          </p>
          <div style={{marginTop:26,padding:'clamp(22px,4vw,40px)',borderRadius:20,border:'1px solid rgba(113,242,182,.34)',background:'rgba(2,10,17,.55)',fontSize:'clamp(24px,3.7vw,46px)',fontWeight:1000,letterSpacing:'-.04em',lineHeight:1.1}}>
            DOES THIS PROPOSED CONSEQUENCE HAVE SUFFICIENT <span style={{color:'#71f2b6'}}>ADMISSIBLE EVIDENCE</span>, <span style={{color:'#70dcff'}}>APPLICABLE AUTHORITY</span>, AND <span style={{color:'#d9ccff'}}>ESTABLISHED STANDING</span> TO BECOME REALITY <span style={{color:'#fff'}}>NOW?</span>
          </div>
        </section>

        <section style={{marginTop:24,padding:'clamp(28px,5vw,50px)',...card}}>
          <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#70dcff'}}>TWO LAYERS · ONE BOUNDARY</div>
          <h2 style={{fontSize:'clamp(33px,5vw,60px)',letterSpacing:'-.045em',lineHeight:1.02,margin:'12px 0 20px'}}>Chicago asks the question. TA-14 runs the examination.</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12}}>
            <div style={{padding:24,borderRadius:18,border:'1px solid rgba(113,242,182,.24)',background:'rgba(113,242,182,.04)'}}><div style={{fontSize:10,fontWeight:950,letterSpacing:'.15em',color:'#71f2b6'}}>CHICAGO QUESTION</div><div style={{marginTop:12,fontSize:'clamp(21px,3vw,34px)',fontWeight:1000,lineHeight:1.12}}>PROMISE → PROOF → WHAT MAY THIS PROOF AUTHORIZE?</div></div>
            <div style={{padding:24,borderRadius:18,border:'1px solid rgba(111,220,255,.18)',background:'rgba(2,10,17,.55)'}}><div style={{fontSize:10,fontWeight:950,letterSpacing:'.15em',color:'#70dcff'}}>CANONICAL TA-14 EXAMINATION</div><div style={{marginTop:12,fontSize:'clamp(18px,2.4vw,28px)',fontWeight:1000,lineHeight:1.3}}>REALITY → RECORD → CONTINUITY → ADMISSIBILITY → BINDING → COMMIT → EXECUTION → OUTCOME</div></div>
          </div>
          <p style={{margin:'18px 0 0',color:'#91a8b5',fontSize:14,lineHeight:1.65}}>The Chicago shorthand is an entry question. It does not replace the canonical TA-14 architecture.</p>
        </section>

        <section style={{marginTop:24,padding:'clamp(28px,5vw,50px)',...card}}>
          <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#70dcff'}}>FROM PROOF TO CONSEQUENCE</div>
          <h2 style={{fontSize:'clamp(33px,5vw,60px)',letterSpacing:'-.045em',lineHeight:1.02,margin:'12px 0 24px'}}>The full chain has to survive.</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:10}}>
            {chain.map(([n,t,d],i)=><div key={t} style={{padding:20,borderRadius:16,border:i===1||i===6?'1px solid rgba(113,242,182,.28)':'1px solid rgba(111,220,255,.12)',background:i===1||i===6?'rgba(113,242,182,.035)':'rgba(2,9,15,.56)'}}>
              <div style={{fontSize:11,fontWeight:950,color:i===1||i===6?'#71f2b6':'#70dcff'}}>{n}</div>
              <div style={{fontSize:17,fontWeight:1000,margin:'8px 0',letterSpacing:'.03em'}}>{t}</div>
              <div style={{fontSize:13,lineHeight:1.6,color:'#91a8b5'}}>{d}</div>
            </div>)}
          </div>
        </section>

        <section id="chicago-exam" style={{marginTop:24,padding:'clamp(28px,5vw,50px)',...card,scrollMarginTop:24}}>
          <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#71f2b6'}}>RUN THE PROOF → CONSEQUENCE EXAM</div>
          <h2 style={{fontSize:'clamp(34px,5vw,62px)',letterSpacing:'-.045em',lineHeight:1.02,margin:'12px 0 10px'}}>The building has proof. Does it have permission?</h2>
          <p style={{maxWidth:930,color:'#9eb3bd',lineHeight:1.68,fontSize:16}}>
            Scenario: analytics verify elevated CO₂ in an occupied classroom and recommend increasing outdoor-air ventilation. The controller is capable of issuing the command. Test the boundary.
          </p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:18}}>
            <a href="#classroom-example" style={{padding:'12px 16px',borderRadius:11,background:'rgba(113,242,182,.12)',border:'1px solid rgba(113,242,182,.38)',color:'#e5fff2',textDecoration:'none',fontWeight:950,fontSize:11}}>RUN THE CLASSROOM EXAMPLE ↓</a>
            <a href="#bring-proof" style={{padding:'12px 16px',borderRadius:11,border:'1px solid rgba(111,220,255,.3)',color:'#b9f2ff',textDecoration:'none',fontWeight:950,fontSize:11}}>EXAMINE MY OWN PROOF ↓</a>
          </div>

          <div id="classroom-example" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:12,marginTop:24,scrollMarginTop:24}}>
            <div style={{padding:20,...card}}>
              <div style={{fontSize:10,fontWeight:950,letterSpacing:'.15em',color:'#70dcff'}}>PROOF / EVIDENCE</div>
              <div style={{display:'flex',gap:7,flexWrap:'wrap',marginTop:13}}>
                <button onClick={()=>setProof('supported')} style={button(proof==='supported')}>CURRENT + ATTRIBUTABLE</button>
                <button onClick={()=>setProof('missing')} style={button(proof==='missing')}>INSUFFICIENT</button>
              </div>
            </div>
            <div style={{padding:20,...card}}>
              <div style={{fontSize:10,fontWeight:950,letterSpacing:'.15em',color:'#70dcff'}}>APPLICABLE AUTHORITY</div>
              <div style={{display:'flex',gap:7,flexWrap:'wrap',marginTop:13}}>
                <button onClick={()=>setAuthority('supported')} style={button(authority==='supported')}>CURRENT</button>
                <button onClick={()=>setAuthority('expired')} style={button(authority==='expired')}>EXPIRED</button>
              </div>
            </div>
            <div style={{padding:20,...card}}>
              <div style={{fontSize:10,fontWeight:950,letterSpacing:'.15em',color:'#70dcff'}}>ESTABLISHED STANDING</div>
              <div style={{display:'flex',gap:7,flexWrap:'wrap',marginTop:13}}>
                <button onClick={()=>setStanding('supported')} style={button(standing==='supported')}>ESTABLISHED</button>
                <button onClick={()=>setStanding('missing')} style={button(standing==='missing')}>UNRESOLVED</button>
              </div>
            </div>
            <div style={{padding:20,...card}}>
              <div style={{fontSize:10,fontWeight:950,letterSpacing:'.15em',color:'#70dcff'}}>EXECUTION SCOPE</div>
              <div style={{display:'flex',gap:7,flexWrap:'wrap',marginTop:13}}>
                <button onClick={()=>setScope('supported')} style={button(scope==='supported')}>IN BOUNDS</button>
                <button onClick={()=>setScope('outside')} style={button(scope==='outside')}>OUTSIDE</button>
              </div>
            </div>
          </div>

          <div style={{marginTop:18,padding:18,borderRadius:18,border:'1px solid rgba(111,220,255,.14)',background:'rgba(2,9,15,.56)'}}><div style={{fontSize:10,fontWeight:950,letterSpacing:'.15em',color:'#70dcff'}}>LIVE BOUNDARY TRACE</div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:7,marginTop:13}}>{['PROOF','EVIDENCE','AUTHORITY','STANDING','COMMIT','EXECUTION','OUTCOME'].map((x,i)=>{const passed=i<failureIndex;const stopped=i===failureIndex;return <div key={x} style={{padding:'12px 9px',borderRadius:12,textAlign:'center',border:stopped?`1px solid ${color}88`:'1px solid rgba(111,220,255,.12)',background:passed?'rgba(113,242,182,.08)':stopped?`${color}12`:'rgba(2,10,17,.45)',color:passed?'#dffff0':stopped?color:'#647d89',fontSize:10,fontWeight:950}}>{x}<div style={{marginTop:5,fontSize:9}}>{passed?'SURVIVES':stopped?'STOPS HERE':'NOT REACHED'}</div></div>})}</div></div>

          <div style={{marginTop:18,padding:'clamp(30px,5vw,52px)',borderRadius:24,border:`1px solid ${color}55`,background:`linear-gradient(135deg,${color}10,rgba(2,10,17,.96))`,textAlign:'center'}}>
            <div style={{fontSize:10,fontWeight:950,letterSpacing:'.2em',color:'#8099a5'}}>TA-14 DETERMINATION</div>
            <div style={{fontSize:'clamp(64px,11vw,132px)',fontWeight:1000,lineHeight:.9,letterSpacing:'-.07em',margin:'17px 0',color}}>{result}</div>
            <p style={{maxWidth:850,margin:'0 auto',fontSize:'clamp(16px,2vw,21px)',lineHeight:1.65,color:'#b9ccd5'}}>{explanation}</p>
          </div>

          <div style={{textAlign:'center',marginTop:18,fontSize:'clamp(18px,2.3vw,27px)',fontWeight:1000,letterSpacing:'-.02em'}}>
            MONITORING IS NOT EVIDENCE. EVIDENCE IS NOT AUTHORITY. AUTHORITY IS NOT EXECUTION.
          </div>
        </section>

        <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
          <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#70dcff'}}>NO MERGER REQUIRED</div>
          <h2 style={{fontSize:'clamp(34px,5.3vw,64px)',lineHeight:1,letterSpacing:'-.05em',margin:'12px 0 24px'}}>The power is in the seam between independently governed work.</h2>
          <div style={{display:'grid',gap:10}}>
            {voices.map(([who,what],i)=><div key={who} style={{display:'grid',gridTemplateColumns:'minmax(220px,.7fr) minmax(280px,1.7fr)',gap:18,padding:20,borderRadius:16,border:i===4?'1px solid rgba(113,242,182,.3)':'1px solid rgba(111,220,255,.12)',background:i===4?'rgba(113,242,182,.035)':'rgba(2,9,15,.52)'}}>
              <div style={{fontSize:11,fontWeight:950,letterSpacing:'.08em',color:i===4?'#71f2b6':'#70dcff'}}>{who}</div>
              <div style={{fontSize:15,lineHeight:1.6,color:'#bacbd3'}}>{what}</div>
            </div>)}
          </div>
          <p style={{margin:'20px 0 0',color:'#819aa7',fontSize:13,lineHeight:1.65}}>
            This showroom describes a convergence of independently governed conversations and architectures. It does not imply endorsement, adoption, sponsorship, partnership, or institutional approval by AutomatedBuildings, Monday Live, ONUMA, Asset Leadership Network, ASHRAE, AHRI, AHR Expo, Anto, Kimon Onuma, Ken Sinclair, Kelly Sinclair, or any other referenced participant.
          </p>
        </section>

        <section style={{marginTop:24,padding:'clamp(34px,6vw,68px)',border:'1px solid rgba(113,242,182,.3)',borderRadius:28,background:'radial-gradient(circle at 76% 0%,rgba(113,242,182,.11),transparent 28%),linear-gradient(145deg,rgba(8,36,48,.96),rgba(3,11,19,.98))'}}>
          <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#71f2b6'}}>CHICAGO EXAMINATION PROPOSITION</div>
          <h2 style={{fontSize:'clamp(40px,6.6vw,82px)',lineHeight:.93,letterSpacing:'-.06em',margin:'14px 0 22px'}}>DON&apos;T JUST SHOW THE PROOF.<br/><span style={{color:'#71f2b6'}}>SHOW WHAT THE PROOF CAN AUTHORIZE.</span></h2>
          <p style={{fontSize:'clamp(18px,2.3vw,26px)',lineHeight:1.58,maxWidth:1000,color:'#bdd0d8'}}>
            The opportunity in Chicago is not to make every architecture become TA-14. It is to freeze the interfaces, preserve independent ownership, test the evidence, locate the authority boundary, and show exactly where a proposed digital decision either earns permission to become physical reality — or stops.
          </p>
          <div id="bring-proof" style={{marginTop:28,padding:'clamp(22px,4vw,38px)',borderRadius:20,border:'1px solid rgba(111,220,255,.2)',background:'rgba(2,10,17,.58)',scrollMarginTop:24}}><div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#70dcff'}}>BRING YOUR OWN VERIFIED RESULT</div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12,marginTop:16}}><label style={{fontSize:11,fontWeight:900,color:'#9bb1bc'}}>WHAT DID YOU PROVE?<textarea value={submittedProof} onChange={e=>{setSubmittedProof(e.target.value);setReceiptOpen(false)}} style={{display:'block',width:'100%',minHeight:105,marginTop:8,padding:14,borderRadius:12,border:'1px solid rgba(111,220,255,.18)',background:'#020a11',color:'#eef8fb',font:'inherit',boxSizing:'border-box'}} /></label><label style={{fontSize:11,fontWeight:900,color:'#9bb1bc'}}>WHAT CONSEQUENCE DOES THAT PROOF PROPOSE?<textarea value={submittedConsequence} onChange={e=>{setSubmittedConsequence(e.target.value);setReceiptOpen(false)}} style={{display:'block',width:'100%',minHeight:105,marginTop:8,padding:14,borderRadius:12,border:'1px solid rgba(111,220,255,.18)',background:'#020a11',color:'#eef8fb',font:'inherit',boxSizing:'border-box'}} /></label></div><button disabled={!submittedProof.trim()||!submittedConsequence.trim()} onClick={()=>setReceiptOpen(true)} style={{marginTop:14,padding:'13px 18px',borderRadius:11,border:'1px solid rgba(113,242,182,.4)',background:'rgba(113,242,182,.13)',color:'#e4fff1',fontWeight:1000}}>FREEZE THIS EXAMINATION →</button>{receiptOpen&&<div style={{marginTop:18,padding:20,borderRadius:15,border:`1px solid ${color}55`}}><b>BOUNDED EXAMINATION RECEIPT · LOCAL SESSION</b><div style={{marginTop:10,lineHeight:1.7}}><b>EXAMINATION VERSION:</b> CHICAGO-POP-v0.2-CANDIDATE<br/><b>PROOF:</b> {submittedProof}<br/><b>PROPOSED CONSEQUENCE:</b> {submittedConsequence}<br/><b>ADMISSIBLE EVIDENCE STATE:</b> {proof==='supported'?'CURRENT + ATTRIBUTABLE':'INSUFFICIENT'}<br/><b>APPLICABLE AUTHORITY STATE:</b> {authority==='supported'?'CURRENT':'EXPIRED'}<br/><b>ESTABLISHED STANDING STATE:</b> {standing==='supported'?'ESTABLISHED':'UNRESOLVED'}<br/><b>EXECUTION SCOPE:</b> {scope==='supported'?'IN BOUNDS':'OUTSIDE'}<br/><b>DETERMINATION:</b> <span style={{color,fontWeight:1000}}>{result}</span></div><div style={{marginTop:8,fontSize:11,color:'#78909b'}}>NON-DURABLE LOCAL-SESSION DEMONSTRATION. This state is not written to the TA-14 registry and is not a durable receipt, certification, endorsement, or execution authorization.</div></div>}</div>

          <div style={{marginTop:28,padding:'clamp(22px,4vw,38px)',borderRadius:20,border:'1px solid rgba(113,242,182,.34)',background:'rgba(113,242,182,.055)'}}>
            <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#71f2b6'}}>AN OPEN EXAMINATION FOR CHICAGO</div>
            <div style={{marginTop:12,fontSize:'clamp(25px,3.8vw,48px)',fontWeight:1000,letterSpacing:'-.04em',lineHeight:1.06}}>BRING ONE VERIFIED RESULT.</div>
            <div style={{marginTop:18,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:9}}>
              {[
                ['01','NAME THE PROOF.'],
                ['02','NAME THE PROPOSED CONSEQUENCE.'],
                ['03','FREEZE THE BOUNDARY.'],
                ['04','TEST WHETHER THE PROOF ESTABLISHES THE AUTHORITY REQUIRED FOR THAT CONSEQUENCE.']
              ].map(([n,t])=><div key={n} style={{padding:17,borderRadius:14,border:'1px solid rgba(111,220,255,.13)',background:'rgba(2,10,17,.5)'}}><div style={{fontSize:10,fontWeight:950,color:'#70dcff'}}>{n}</div><div style={{marginTop:7,fontSize:14,fontWeight:950,lineHeight:1.4}}>{t}</div></div>)}
            </div>
            <p style={{margin:'18px 0 0',color:'#a9bec8',fontSize:14,lineHeight:1.65}}>This is an invitation to examination, not a claim that any AHR Expo session, presenter, organization, or architecture has accepted TA-14. The proposition is public so it can be challenged, corrected, bounded, or rejected on the record.</p>
          </div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:28}}>
            <Link href="/registry/ta-14-admissible-execution-architecture/showcase/owner-to-consequence-collaboration" style={{padding:'13px 17px',borderRadius:11,background:'rgba(113,242,182,.11)',border:'1px solid rgba(113,242,182,.38)',color:'#e5fff2',textDecoration:'none',fontWeight:950,fontSize:12}}>OWNER → CONSEQUENCE →</Link>
            <Link href="/registry/ta-14-admissible-execution-architecture/showcase/governed-connection-profile" style={{padding:'13px 17px',borderRadius:11,border:'1px solid rgba(111,220,255,.27)',color:'#b9f2ff',textDecoration:'none',fontWeight:950,fontSize:12}}>GOVERNED CONNECTION PROFILE →</Link>
            <Link href="/admissible-federation-architecture" style={{padding:'13px 17px',borderRadius:11,border:'1px solid rgba(111,220,255,.27)',color:'#b9f2ff',textDecoration:'none',fontWeight:950,fontSize:12}}>ADMISSIBLE FEDERATION ARCHITECTURE →</Link>
          </div>
        </section>

        <footer style={{marginTop:28,paddingTop:20,borderTop:'1px solid rgba(111,220,255,.1)',display:'flex',justifyContent:'space-between',gap:15,flexWrap:'wrap',color:'#66818e',fontSize:11,lineHeight:1.6}}>
          <div>TA-14 AUTHORITY · PUBLIC TECHNICAL SHOWROOM · CHICAGO 2027</div>
          <div>No endorsement implied · Independent architectures remain independently governed</div>
        </footer>
      </div>
    </main>
  );
}
