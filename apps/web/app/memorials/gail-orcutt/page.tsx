import Link from "next/link";
import MemorialExperience from "./MemorialExperience";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gail Orcutt | A Teacher. A Legacy. A Promise. | TA14",
  description: "An independent educational memorial honoring Iowa teacher and radon advocate Gail Orcutt, with thanks to Lisa Greenfield for bringing her story to TA14.",
};

const timeline = [
  { year: "33 YEARS", heading: "A life in education", copy: "Gail Orcutt spent 33 years teaching in Iowa. Her dedication to learning would become a lasting commitment to public health." },
  { year: "2010", heading: "A life-changing diagnosis", copy: "A nonsmoker, Gail was diagnosed with lung cancer. She went on to educate others about radon, a radioactive gas that cannot be seen or smelled." },
  { year: "2013", heading: "Her advocacy recognized", copy: "Her public-health work earned the Iowa Cancer Champion Award. She helped build awareness through Iowa's radon advocacy community." },
  { year: "2020", heading: "Her passing", copy: "Gail died in May 2020. Her work continued through the people and organizations she inspired." },
  { year: "2022", heading: "Her name becomes part of the law", copy: "Iowa enacted House File 2412, the Gail Orcutt School Radon Safety Act, establishing school testing and related responsibilities." },
];
const sections = [
  { n: "01", title: "The woman behind the law", kicker: "BEFORE THE LEGISLATION, THERE WAS A TEACHER", copy: "For 33 years, Gail Orcutt helped children learn. Later, after her lung cancer diagnosis, she became a determined voice for radon awareness. Her work asked a simple, enduring question: How do we protect people from a danger they cannot detect with their senses?" },
  { n: "02", title: "The invisible condition", kicker: "RADON IS REAL EVEN WHEN WE CANNOT SEE IT", copy: "Radon is a naturally occurring radioactive gas. Long-term exposure increases lung cancer risk. Testing provides evidence about a particular place and measurement period. It does not reveal every historical exposure or guarantee future conditions." },
  { n: "03", title: "A law that carries her name", kicker: "IOWA HOUSE FILE 2412 · 2022", copy: "The Gail Orcutt School Radon Safety Act established a public-school testing framework. It includes initial testing by July 1, 2027, repeat testing at least every five years, publication of results, follow-up for elevated initial readings, and mitigation-planning provisions under specified conditions. These are meaningful obligations, not a guarantee that every classroom is continuously monitored." },
  { n: "04", title: "After the measurement", kicker: "TESTING IS A BEGINNING, NOT THE END", copy: "A test records a result. Confirmation establishes the basis for further decisions. A mitigation plan documents intended action. An installation record shows work was performed. Appropriate follow-up testing helps determine whether concentrations were reduced. These records are connected, but they are not interchangeable." },
  { n: "05", title: "The children and their families", kicker: "THE HUMAN REASON THE RECORD MATTERS", copy: "Parents deserve understandable, accurate information about school radon testing, follow-up actions, and verified results. The record should disclose meaningful uncertainty rather than claim to know a child's exact historical dose or the cause of an individual illness." },
  { n: "06", title: "How her story reached us", kicker: "WITH GRATITUDE TO LISA GREENFIELD", copy: "This memorial began with a conversation. Lisa Greenfield introduced TA14 founder Greggory Don Butler to Gail Orcutt's life and advocacy. That introduction inspired this independent tribute. We thank Lisa for making sure Gail's story reached someone else who could help carry it forward." },
  { n: "07", title: "TA14's pledge in her memory", kicker: "AN INDEPENDENT COMMITMENT", copy: "TA14 Authority Governance Institution LLC pledges to work toward a future in which school environmental concerns are not merely measured, but documented, examined, addressed, and followed through to verifiable outcomes. We will distinguish what evidence proves from what it cannot prove, and we will not present an unverified intervention as a verified outcome." },
  { n: "08", title: "The evidence must carry on", kicker: "A LEGACY OF EDUCATION AND PROTECTION", copy: "Gail helped make the invisible visible. Her story reminds us that children deserve thoughtful protection and that the responsibility does not end when a test is complete. The classroom may be silent. The evidence must never be." },
];

export default function GailOrcuttMemorial() {
  return <main style={{background:"#061420",color:"#f4f6f5",minHeight:"100vh",fontFamily:"Arial, Helvetica, sans-serif"}}>
    <div style={{maxWidth:1140,margin:"auto",padding:"26px 22px 100px"}}>
      <nav style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap",fontSize:14}}>
        <Link href="/" style={{color:"#a7dfe5",textDecoration:"none"}}>← TA14 Exchange</Link>
        <Link href="/showrooms/radon-mitigation-evidence-continuity" style={{color:"#a7dfe5",textDecoration:"none"}}>Radon evidence showroom →</Link>
      </nav>
      <header style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:40,alignItems:"center",padding:"75px 0 70px",borderBottom:"1px solid #385365"}}>
        <div>
          <p style={{color:"#e8c98d",fontSize:12,fontWeight:700,letterSpacing:3}}>AN INDEPENDENT EDUCATIONAL MEMORIAL</p>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(56px,8vw,108px)",lineHeight:.96,margin:"24px 0"}}>Gail<br/>Orcutt</h1>
          <p style={{fontFamily:"Georgia,serif",fontSize:"clamp(24px,3vw,38px)",lineHeight:1.2,color:"#f0d9ae"}}>A teacher. A legacy.<br/>A promise to the children.</p>
          <p style={{fontSize:18,lineHeight:1.8,maxWidth:520,color:"#c6d7df"}}>She spent a lifetime teaching. Her advocacy helped inspire an Iowa law requiring schools to take radon testing seriously. Her story deserves to keep teaching us.</p>
          <p style={{fontSize:14,color:"#b4c5ce"}}>Presented by TA14 Authority Governance Institution LLC</p>
        </div>
        <figure style={{margin:0}}>
          <img src="/Warm%20Garden%20Portrait.png" alt="AI-created illustrative portrait inspired by the memorial; not an authenticated photograph of Gail Orcutt" style={{width:"100%",display:"block",borderRadius:16,border:"1px solid #6a6770",boxShadow:"0 24px 60px #0008"}}/>
          <figcaption style={{fontSize:12,color:"#a7b8c4",marginTop:12,lineHeight:1.5}}>Illustrative AI-created portrait. Not an original or verified photograph of Gail Orcutt.</figcaption>
        </figure>
      </header>
      <MemorialExperience />
      <div style={{padding:"54px 0 30px",textAlign:"center"}}>
        <p style={{fontFamily:"Georgia,serif",fontSize:"clamp(24px,4vw,43px)",lineHeight:1.35,maxWidth:800,margin:"auto",color:"#f1dfbd"}}>“The classroom may be silent.<br/>The evidence must never be.”</p>
      </div>
      <section style={{padding:"48px 0"}}>
        <p style={{color:"#e8c98d",letterSpacing:2,fontSize:12}}>THE LIFE AND LEGACY</p>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:40,marginTop:12}}>A lifetime of teaching. A legacy of protection.</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
          {timeline.map(t=><article key={t.year} style={{padding:22,border:"1px solid #385365",borderRadius:12,background:"#0b2331"}}><p style={{color:"#f0d29a",fontWeight:800,letterSpacing:2}}>{t.year}</p><h3 style={{fontFamily:"Georgia,serif",fontSize:23}}>{t.heading}</h3><p style={{lineHeight:1.7,color:"#c3d4dd"}}>{t.copy}</p></article>)}
        </div>
      </section>
      {sections.map((s,i)=><section key={s.n} id={"chapter-"+s.n} style={{padding:"clamp(45px,7vw,92px) clamp(18px,4vw,48px)",borderTop:"1px solid #2c485a",margin:"18px 0",borderRadius:18,background:i%3===0?"linear-gradient(125deg,#142e3d,#081925)":i%3===1?"linear-gradient(125deg,#0b2230,#172f36)":"linear-gradient(125deg,#182936,#0b1b29)",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:24,alignItems:"start"}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}><span style={{fontFamily:"Georgia,serif",fontSize:"clamp(70px,10vw,150px)",lineHeight:1,color:"#d6bb87",opacity:.85}}>{s.n}</span><span aria-hidden="true" style={{height:3,width:90,background:"#d6bb87",display:"block"}}/><span style={{fontFamily:"Georgia,serif",fontSize:20,color:"#e9d7b4",maxWidth:260}}>{["A lifetime of teaching","What we cannot see","A law in her name","The duty to follow through","Every child matters","A story shared","An enduring commitment","The lesson continues"][i]}</span></div>
        <div style={{maxWidth:820}}>
          <p style={{fontSize:12,color:"#85d9e2",fontWeight:700,letterSpacing:2}}>{s.kicker}</p>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(29px,4vw,47px)",lineHeight:1.2}}>{s.title}</h2>
          <p style={{fontSize:19,lineHeight:1.85,color:"#d0dde4"}}>{s.copy}</p>
          {i===2&&<p><a href="https://www.legis.iowa.gov/legislation/BillBook?ga=89&ba=HF2412" target="_blank" rel="noopener noreferrer" style={{color:"#86e1eb"}}>Read Iowa House File 2412 ↗</a></p>}
          {i===3&&<Link href="/showrooms/radon-mitigation-evidence-continuity" style={{color:"#86e1eb"}}>Explore the radon evidence-continuity demonstration →</Link>}
        </div>
      </section>)}
      <section style={{padding:"clamp(30px,6vw,70px)",border:"1px solid #9d8051",borderRadius:18,background:"radial-gradient(circle at 80% 10%,#3c3a30 0%,#112c37 48%,#081923 100%)",textAlign:"center"}}>
        <p style={{fontSize:12,letterSpacing:2,color:"#e9c98e"}}>CONTINUE HER WORK</p>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(30px,4vw,48px)"}}>A teacher’s lesson should never end.</h2>
        <p style={{lineHeight:1.8,fontSize:18,color:"#c7d8df"}}>In Gail’s memory, keep asking what was measured, what action followed, and whether the outcome was verified. Explore an educational examination of why completed work and verified improvement are not the same.</p>
        <Link href="/showrooms/radon-mitigation-evidence-continuity" style={{display:"inline-block",background:"#bce9ed",color:"#06202b",fontWeight:800,padding:"16px 22px",borderRadius:9,textDecoration:"none"}}>Enter the radon showroom →</Link>
      </section>
      <section style={{padding:"55px 0 20px"}}>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:27}}>Primary sources and further reading</h2>
        <ul style={{lineHeight:2.1,color:"#c4d6df"}}>
          <li><a href="https://www.legis.iowa.gov/legislation/BillBook?ga=89&ba=HF2412" style={{color:"#95dce6"}}>Iowa Legislature — House File 2412 (2022)</a></li>
          <li><a href="https://hhs.iowa.gov/" style={{color:"#95dce6"}}>Iowa Health and Human Services — Radon program</a></li>
          <li><a href="https://canceriowa.org/" style={{color:"#95dce6"}}>Iowa Cancer Consortium — Gail Orcutt and radon advocacy</a></li>
          <li><a href="https://www.fightcancer.org/" style={{color:"#95dce6"}}>American Cancer Society Cancer Action Network — school radon safety advocacy</a></li>
        </ul>
      </section>
      <footer style={{borderTop:"1px solid #395464",paddingTop:24,fontSize:13,lineHeight:1.8,color:"#a7bac4"}}>
        Independent educational memorial by TA14 Authority Governance Institution LLC. No endorsement, sponsorship, or affiliation with Gail Orcutt's family, the State of Iowa, or named organizations is claimed. The illustration is AI-generated and is not a verified likeness. TA14's governance concepts are educational proposals, not a deployed school monitoring system. This page does not provide medical or legal advice.
      </footer>
    </div>
  </main>;
}
