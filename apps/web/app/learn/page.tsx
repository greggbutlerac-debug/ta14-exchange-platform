'use client';

import Link from 'next/link';

const timeline = [
  {
    title: 'Reality',
    text: 'Observe the real-world condition before consequence is authorized.',
  },
  {
    title: 'Record',
    text: 'Capture evidence as durable, attributable records.',
  },
  {
    title: 'Continuity',
    text: 'Preserve provenance, custody, and correspondence.',
  },
  {
    title: 'Admissibility',
    text: 'Evaluate whether the evidence is sufficient for execution.',
  },
  {
    title: 'Binding',
    text: 'Bind actor, authority, object, destination, and intent.',
  },
  {
    title: 'Commit',
    text: 'Freeze the authorized execution object.',
  },
  {
    title: 'Execution',
    text: 'Carry out only the committed route.',
  },
  {
    title: 'Outcome',
    text: 'Verify that consequence corresponds to authorization.',
  },
];

export default function LearnPage() {
  return (
    <main style={{
      minHeight:'100vh',
      background:'#030812',
      color:'white',
      fontFamily:'Inter,system-ui,sans-serif',
      padding:'48px'
    }}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <Link href="/" style={{color:'#66e6ff',textDecoration:'none'}}>← Back to Exchange</Link>

        <p style={{letterSpacing:3,color:'#66e6ff',fontWeight:800,marginTop:40}}>
          TA-14 KNOWLEDGE CENTER
        </p>

        <h1 style={{
          fontSize:'clamp(56px,8vw,100px)',
          lineHeight:.92,
          margin:'18px 0'
        }}>
          Learn the
          <br/>
          Admissible
          <br/>
          Execution Architecture.
        </h1>

        <p style={{
          maxWidth:760,
          color:'#b7c6d6',
          fontSize:20,
          lineHeight:1.8
        }}>
          This interactive learning surface explains the eight canonical stages
          of the TA-14 execution chain and serves as the educational entry point
          into the Exchange Platform.
        </p>

        <div style={{
          display:'grid',
          gap:20,
          marginTop:60
        }}>
          {timeline.map((item,index)=>(
            <section key={item.title}
              style={{
                border:'1px solid rgba(120,180,255,.15)',
                borderRadius:24,
                padding:28,
                background:'rgba(255,255,255,.03)',
                display:'grid',
                gridTemplateColumns:'90px 1fr',
                gap:24
              }}>
              <div style={{
                width:72,
                height:72,
                borderRadius:18,
                display:'grid',
                placeItems:'center',
                background:'linear-gradient(135deg,#4fdcff,#2ef0a5)',
                color:'#021017',
                fontWeight:900,
                fontSize:28
              }}>
                {index+1}
              </div>

              <div>
                <h2 style={{margin:'4px 0 12px',fontSize:34}}>
                  {item.title}
                </h2>
                <p style={{
                  margin:0,
                  color:'#b7c6d6',
                  lineHeight:1.8,
                  fontSize:18
                }}>
                  {item.text}
                </p>
              </div>
            </section>
          ))}
        </div>

        <section style={{
          marginTop:70,
          padding:36,
          borderRadius:28,
          background:'linear-gradient(135deg,rgba(67,190,255,.12),rgba(41,240,170,.08))',
          border:'1px solid rgba(100,220,255,.2)'
        }}>
          <p style={{letterSpacing:2,color:'#66e6ff',fontWeight:800}}>
            GOVERNING PRINCIPLE
          </p>

          <h2 style={{fontSize:52,margin:'8px 0 18px'}}>
            No admissible evidence.
            <br/>
            No admissible execution.
          </h2>

          <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
            <Link href="/runtime" style={{
              padding:'14px 22px',
              borderRadius:14,
              background:'linear-gradient(90deg,#5fe8ff,#34f2a3)',
              color:'#03110b',
              textDecoration:'none',
              fontWeight:800
            }}>
              Try Runtime Gate
            </Link>

            <Link href="/review" style={{
              padding:'14px 22px',
              borderRadius:14,
              border:'1px solid rgba(255,255,255,.15)',
              color:'white',
              textDecoration:'none'
            }}>
              Request Review
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
