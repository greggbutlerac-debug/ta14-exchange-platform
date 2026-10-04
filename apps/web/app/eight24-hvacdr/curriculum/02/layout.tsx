'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

const lessons=Array.from({length:18},(_,i)=>String(i+1).padStart(2,'0'));

export default function Module02Layout({children}:{children:React.ReactNode}){
  const pathname=usePathname();
  const match=pathname.match(/\/curriculum\/02\/lesson\/(\d{2})(?:\/|$)/);
  const current=match?.[1];
  if(!current)return <>{children}</>;
  return <>
    <div style={{background:'#001326',padding:'16px 20px 0'}}>
      <nav aria-label="Module 02 lesson directory" style={{maxWidth:1120,margin:'0 auto 16px',border:'1px solid rgba(255,255,255,.18)',borderRadius:14,padding:14}}>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
          <Link href="/eight24-hvacdr" style={{padding:'9px 12px',borderRadius:9,background:'#fff',color:'#001326',fontWeight:800,textDecoration:'none'}}>PROGRAM HOME</Link>
          <Link href="/eight24-hvacdr/curriculum/02" style={{padding:'9px 12px',borderRadius:9,background:'#fff',color:'#001326',fontWeight:800,textDecoration:'none'}}>MODULE 02 HOME</Link>
          {lessons.map(id=><Link key={id} href={`/eight24-hvacdr/curriculum/02/lesson/${id}`} aria-current={id===current?'page':undefined} style={{minWidth:48,textAlign:'center',padding:'9px 10px',borderRadius:9,border:'1px solid rgba(255,255,255,.3)',background:id===current?'#fff':'transparent',color:id===current?'#001326':'#fff',fontWeight:800,textDecoration:'none'}}>2.{id}</Link>)}
        </div>
      </nav>
      <section aria-label="Module 02 teaching visual placeholder" style={{maxWidth:1120,margin:'0 auto 20px',padding:18,border:'1px solid #285b78',borderRadius:16,background:'linear-gradient(145deg,#062945,#041e35)',color:'#f7fbff'}}>
        <small style={{color:'#7BAFD4',fontWeight:900}}>LESSON 2.{current} · TEACHING VISUAL</small>
        <p style={{color:'#C9E0EF',margin:'8px 0 0',lineHeight:1.6}}>Visual and Samantha guided walkthrough slot reserved. The lesson and assessment remain fully usable while the approved Module 02 teaching image is added.</p>
      </section>
    </div>
    {children}
    <div style={{background:'#001326',padding:'20px'}}>
      <nav aria-label="Lesson progression" style={{maxWidth:1120,margin:'auto',display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
        {Number(current)>1?<Link href={`/eight24-hvacdr/curriculum/02/lesson/${String(Number(current)-1).padStart(2,'0')}`} style={{color:'#fff',fontWeight:800}}>← PREVIOUS LESSON</Link>:<Link href="/eight24-hvacdr/curriculum/02" style={{color:'#fff',fontWeight:800}}>← MODULE 02 HOME</Link>}
        {Number(current)<18?<Link href={`/eight24-hvacdr/curriculum/02/lesson/${String(Number(current)+1).padStart(2,'0')}`} style={{color:'#fff',fontWeight:800}}>NEXT LESSON →</Link>:<Link href="/eight24-hvacdr" style={{color:'#fff',fontWeight:800}}>PROGRAM HOME →</Link>}
      </nav>
    </div>
  </>;
}
