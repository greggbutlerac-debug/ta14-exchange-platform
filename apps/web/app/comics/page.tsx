import Link from 'next/link';

const series = [
  {
    title: 'The Consequence Wars',
    subtitle: 'Cinematic interactive governance comics',
    description: 'Fictional Guardians confront unauthorized automation. Follow the evidence, examine authority, and decide when a proposed consequence must be held, denied, or escalated.',
    episodes: [{number: 1, title: 'The Millisecond Between Permission and Consequence', href: '/showrooms/the-consequence-wars', status: 'READ EPISODE 1'}],
  },
];

export const metadata = {
  title: 'Comics & Graphic Stories | TA-14 Exchange',
  description: 'The home of TA-14 interactive educational comics, starting with The Consequence Wars.',
};

export default function ComicsLibrary() {
  return (
    <main style={{minHeight:'100vh',background:'radial-gradient(ellipse at 80% 0%,#321329 0%,#080f20 44%,#040911 100%)',color:'#f3f6ff',fontFamily:'Arial,sans-serif'}}>
      <div style={{maxWidth:1140,margin:'0 auto',padding:'28px 22px 90px'}}>
        <nav style={{display:'flex',gap:24,flexWrap:'wrap',fontSize:13,letterSpacing:1.2}}>
          <Link href="/" style={{color:'#8ddcf7'}}>← TA-14 EXCHANGE</Link>
          <Link href="/showrooms" style={{color:'#8ddcf7'}}>SHOWROOM LIBRARY</Link>
        </nav>
        <header style={{padding:'75px 0 55px'}}>
          <p style={{color:'#f5bb70',fontWeight:800,letterSpacing:3,fontSize:12}}>TA-14 ORIGINAL EDUCATIONAL STORIES</p>
          <h1 style={{fontSize:'clamp(48px,9vw,110px)',letterSpacing:-3,lineHeight:.98,margin:'22px 0'}}>COMICS <span style={{color:'#f47980'}}>&</span><br/>GRAPHIC STORIES</h1>
          <p style={{fontSize:'clamp(17px,2vw,22px)',maxWidth:740,lineHeight:1.7,color:'#c3cee0'}}>Cinematic fiction. Real questions about evidence, authority, and the consequences of intelligent systems. Explore our growing collection of interactive stories.</p>
        </header>
        {series.map(s=><section key={s.title} style={{border:'1px solid #455779',borderRadius:22,overflow:'hidden',background:'linear-gradient(130deg,#15253d,#140e1c)',marginBottom:26}}>
          <div style={{padding:'clamp(22px,5vw,50px)'}}>
            <p style={{fontSize:12,fontWeight:800,color:'#f5bb70',letterSpacing:2}}>FEATURED SERIES · SEASON ONE</p>
            <h2 style={{fontSize:'clamp(35px,6vw,68px)',margin:'14px 0',lineHeight:1.05}}>{s.title}</h2>
            <p style={{fontSize:13,color:'#8ddcf7',fontWeight:700,letterSpacing:1}}>{s.subtitle}</p>
            <p style={{maxWidth:790,lineHeight:1.75,color:'#c4d0e0',fontSize:17}}>{s.description}</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16,marginTop:30}}>
              {s.episodes.map(ep=><Link key={ep.number} href={ep.href} style={{display:'block',padding:24,borderRadius:16,background:'#081a2b',border:'1px solid #48759a',color:'#fff',textDecoration:'none'}}>
                <span style={{fontSize:12,color:'#f5bb70',fontWeight:800,letterSpacing:2}}>EPISODE {String(ep.number).padStart(2,'0')}</span>
                <h3 style={{fontSize:22,lineHeight:1.3,margin:'12px 0 26px'}}>{ep.title}</h3>
                <span style={{display:'inline-block',background:'#80d8f4',color:'#071a2a',borderRadius:9,padding:'12px 17px',fontSize:12,fontWeight:900}}>{ep.status} →</span>
              </Link>)}
            </div>
          </div>
        </section>)}
        <p style={{color:'#9baec7',lineHeight:1.7}}>More episodes and original series will appear here as they are released. Stories are fictional educational experiences; they do not claim real-world deployments or independent validation.</p>
      </div>
    </main>
  );
}
