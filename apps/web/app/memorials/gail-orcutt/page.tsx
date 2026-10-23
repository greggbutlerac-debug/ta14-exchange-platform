import Link from "next/link";
import type { Metadata } from "next";
import MemorialExperience from "./MemorialExperience";

export const metadata: Metadata = {
  title: "Gail Orcutt | A Teacher. A Legacy. A Promise. | TA14",
  description: "An independent, story-led memorial honoring Iowa educator and radon advocate Gail Orcutt, her life, and the law enacted after her passing.",
};

const chapters = [
  {
    "eyebrow": "A LIFE BEFORE THE LAW",
    "title": "A teacher, a neighbor, a life richly lived",
    "paras": [
      "Gail Orcutt was born in Carroll, Iowa, in 1953. She grew up there, graduated from Kuemper High School, and pursued her education at the University of Northern Iowa and Viterbo University. Education became more than a profession: it was a constant thread in her life.",
      "Across 33 years in Waterloo, Norwalk, and Des Moines, Gail taught young people, including as a special-education and reading teacher. She retired in 2008, but the curiosity and care of a teacher did not retire with her.",
      "Outside the classroom she loved gardening, quilting, golf, and the ordinary pleasures of a full life. She married Bill Orcutt in 1981. To remember only the illness and the legislation would miss the woman whose life came first."
    ],
    "image": "Eager Hands in a Sunlit Classroom.png",
    "alt": "Illustration of young students engaged in class",
    "caption": "A lifetime spent helping others learn."
  },
  {
    "eyebrow": "MAY 2010",
    "title": "The diagnosis that changed the lesson",
    "paras": [
      "Two years after retiring, Gail noticed a cough and a wheeze. She sought medical advice and received a devastating diagnosis: lung cancer, despite never having smoked. She later described undergoing removal of her left lung and chemotherapy.",
      "While recovering, she encountered information about radon, an invisible radioactive gas that can build up indoors. She tested places connected to her own life and began asking why more people did not know about this preventable environmental risk.",
      "What followed was not a claim that one reading could explain every exposure in her life. It was the resolve of an educator: if people cannot see or smell a danger, they must be given the knowledge and means to test for it."
    ],
    "image": "Sunlit Classroom of Bright Futures.png",
    "alt": "Sun-filled elementary classroom illustration",
    "caption": "Beautiful rooms can still contain invisible risks. Only appropriate testing can reveal radon concentrations."
  },
  {
    "eyebrow": "A TEACHER BECOMES AN ADVOCATE",
    "title": "She kept teaching, only the classroom grew larger",
    "paras": [
      "Gail began speaking with families, healthcare professionals, community groups, and lawmakers. She participated in the Iowa Cancer Consortium and helped establish its Radon Workgroup and the Iowa Radon Coalition. Her efforts were recognized with the 2013 Iowa Cancer Champion Award.",
      "Her persistence was practical. In 2015 she described sharing radon information and test kits with Iowa legislators and visiting newly elected lawmakers. She wanted the people making decisions to understand both the danger and what testing could reveal.",
      "Even amid treatment and recurrence, she continued to share her story. She did not turn away from the difficulty of her own experience; she used it to make the next person's path better informed."
    ],
    "image": "ChatGPT Image Oct 23, 2026, 10_54_07 AM.png",
    "alt": "Schoolchildren working together on an environmental model",
    "caption": "Education gives knowledge a path into action."
  },
  {
    "eyebrow": "SCHOOLS AND THE INVISIBLE RISK",
    "title": "Why she turned her attention to children",
    "paras": [
      "Gail knew schools from the inside. She had spent decades in their classrooms, among students and fellow educators. Radon could accumulate in buildings without any smell or visible sign. A school could feel safe while still needing evidence about the air within it.",
      "In her advocacy, the question was not simply whether a building had ever been checked. It was whether schools should have a clear obligation to test and respond when results called for further action.",
      "The people at the center of this question were children, teachers, families, and school employees—people whose everyday lives depend on the places where they gather."
    ],
    "image": "Joyful Children Running at Recess.png",
    "alt": "Illustration of children playing at recess",
    "caption": "The human reason to test: children deserve places of learning that adults responsibly evaluate."
  },
  {
    "eyebrow": "MAY 19, 2020 → MAY 24, 2022",
    "title": "She did not live to see the law",
    "paras": [
      "Gail died on May 19, 2020. The work she began did not end there. Other advocates and lawmakers continued seeking school radon protections, and on May 24, 2022, Iowa's governor signed the Gail Orcutt School Radon Safety Act.",
      "The law took effect July 1, 2022. It requires public-school districts to plan for testing, complete initial testing at each attendance center by July 1, 2027, repeat testing at least every five years, and make results available. Elevated readings can trigger follow-up testing and mitigation-planning responsibilities under the law.",
      "That distinction matters. Enactment is a milestone; testing, appropriate action, and follow-up are how its purpose becomes meaningful. Gail did not see the signature. Her legacy asks what happens after it."
    ],
    "image": "Gail Orcutt’s Legacy Lives On.png",
    "alt": "Illustrated timeline of Gail's passing, enactment of the Iowa law, and the 2027 initial testing deadline",
    "caption": "Her voice became a law. Our responsibility is to follow through. Illustrative memorial timeline."
  },
  {
    "eyebrow": "WHAT FOLLOWING THROUGH MEANS",
    "title": "A measurement begins the responsibility",
    "paras": [
      "A radon test is an observation within a defined place and period—not a complete account of anyone's lifetime exposure. Decision-makers need to preserve the context of the reading: where the device was placed, how the measurement was conducted, when it occurred, and what the results do or do not establish.",
      "When a result indicates that action is needed, the record should continue through review, decisions, mitigation work, and appropriate verification. A proposed plan is not completed work. Completed work, by itself, is not proof of improvement.",
      "This is where TA14's educational approach connects to Gail's legacy: measured reality, clear evidence, responsible authority, and verifiable outcomes. It does not replace Iowa law, qualified radon professionals, or public authorities."
    ],
    "image": "Classroom Radon Test Inspection.png",
    "alt": "Illustration of a technician documenting a school radon test",
    "caption": "A classroom radon measurement is the beginning of an evidence record."
  },
  {
    "eyebrow": "A LEGACY BEYOND ONE LAW",
    "title": "Her care for others kept finding new forms",
    "paras": [
      "Gail and Bill Orcutt also established a fund to support radon awareness and help people with limited means address radon in their homes. The Iowa Cancer Consortium remembered her as a generous colleague whose example helped change systems, not just conversations.",
      "Her life holds more than one lesson: the discipline of a teacher, the courage to share personal experience, and the belief that information should reach people before it is too late to help them.",
      "We honor that work without claiming to speak for Gail or her family. The images in this memorial are symbolic. They express our gratitude, not scenes documented from her life."
    ],
    "image": "ChatGPT Image Oct 23, 2026, 10_54_17 AM.png",
    "alt": "Illustration of children and a teacher planting a tree",
    "caption": "What we plant in service to others can continue to grow."
  },
  {
    "eyebrow": "HOW THIS TRIBUTE CAME TO BE",
    "title": "One story shared becomes another responsibility",
    "paras": [
      "Lisa Greenfield introduced TA14 founder Greggory Don Butler to Gail Orcutt's story. That introduction led to this independent educational memorial, created with gratitude and respect.",
      "TA14 Authority Governance Institution LLC commits to teaching why observations must be preserved, how decisions must rest on applicable authority, and why claimed improvements should be verified. These are our commitments, not words attributed to Gail.",
      "The enduring subject is Gail herself: a woman who spent 33 years teaching and, after life changed, kept teaching in a different way. Her example invites all of us to ask what we can do with what we now know."
    ],
    "image": "Hands-On Learning in a Sunny Classroom.png",
    "alt": "Illustration of a teacher guiding children through a lesson",
    "caption": "The lesson continues when others choose to learn and act."
  }
];
const imageSrc = (filename: string) => "/" + encodeURIComponent(filename);

export default function GailOrcuttMemorial() {
 return <main style={{background:"#071620",color:"#f3f4f0",minHeight:"100vh",fontFamily:"Arial, Helvetica, sans-serif"}}>
  <div style={{maxWidth:1420,margin:"auto",padding:"24px clamp(18px,4vw,72px) 100px"}}>
   <nav style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:16,fontSize:14,marginBottom:32}}>
    <Link href="/" style={{color:"#a4e0e5",textDecoration:"none"}}>← TA14 Exchange</Link>
    <p style={{fontFamily:"Georgia,serif",fontSize:"clamp(22px,2.6vw,35px)",lineHeight:1.5,color:"#f0d5a7",maxWidth:960,margin:"0 auto 38px"}}>May every classroom that is tested, every family that receives an answer, and every school that follows through be part of the lesson Gail left behind.</p>
    <Link href="/showrooms/radon-mitigation-evidence-continuity" style={{color:"#a4e0e5",textDecoration:"none"}}>Radon evidence showroom →</Link>
   </nav>
   <header style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,370px),1fr))",gap:"clamp(26px,5vw,80px)",alignItems:"center",padding:"54px 0 82px",borderBottom:"1px solid #3a5360"}}>
    <div>
     <p style={{fontSize:12,letterSpacing:3,color:"#e5c58b",fontWeight:700}}>AN INDEPENDENT EDUCATIONAL MEMORIAL</p>
     <h1 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:"clamp(70px,10vw,150px)",lineHeight:.94,margin:"22px 0 26px"}}>Gail<br/>Orcutt</h1>
     <p style={{fontFamily:"Georgia,serif",fontSize:"clamp(27px,3vw,44px)",lineHeight:1.23,color:"#ecd5aa",margin:"12px 0 30px"}}>A teacher. A life of service.<br/>A lesson that outlived her.</p>
     <p style={{fontSize:20,lineHeight:1.8,color:"#cbd8df",maxWidth:650}}>For 33 years, Gail helped children learn. When lung cancer changed her life, she continued teaching—this time about a danger people cannot see, smell, or recognize without testing.</p>
     <p style={{fontSize:15,color:"#9fb4c0",marginTop:30}}>May 7, 1953 — May 19, 2020 · Iowa</p>
    </div>
    <figure style={{margin:0}}>
      <img src="/Warm%20Garden%20Portrait.png" alt="AI-created tribute portrait honoring Gail Orcutt, not an authenticated photograph or likeness" style={{width:"100%",borderRadius:16,border:"1px solid #52616b",boxShadow:"0 25px 70px #0007"}}/>
      <figcaption style={{fontSize:13,color:"#aebdc6",lineHeight:1.6,marginTop:12}}>Artistic AI-created tribute portrait. It is not a verified photograph or authenticated likeness of Gail Orcutt.</figcaption>
    </figure>
   </header>
   <div style={{textAlign:"center",padding:"clamp(66px,9vw,120px) 12px"}}>
     <p style={{fontFamily:"Georgia,serif",color:"#f0d6a7",fontSize:"clamp(29px,4.3vw,59px)",lineHeight:1.3,maxWidth:1010,margin:"auto"}}>“She did not live to see the law.<br/>But the lesson she taught was not forgotten.”</p>
   </div>
   <p style={{fontSize:13,color:"#9eb6c0",textAlign:"center",margin:"0 0 28px"}}>The images below are symbolic AI-generated illustrations, not photographs of Gail, her students, or historical events.</p>
   <section aria-label="Gail Orcutt's life story">
    {chapters.map((c,i)=><article key={c.title} style={{borderTop:"1px solid #34505d",padding:"clamp(48px,7vw,100px) 0",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,400px),1fr))",alignItems:"center",gap:"clamp(28px,5vw,75px)"}}>
      <div style={{order:i%2===0?0:1}}>
        <p style={{fontSize:12,letterSpacing:2.7,color:"#d7bd86",fontWeight:700}}>{c.eyebrow}</p>
        <h2 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:"clamp(34px,3.7vw,57px)",lineHeight:1.16,margin:"18px 0 30px"}}>{c.title}</h2>
        {c.paras.map((p,j)=><p key={j} style={{fontSize:"clamp(17px,1.45vw,20px)",color:"#cedbe0",lineHeight:1.88,margin:"0 0 23px"}}>{p}</p>)}
        {i===4&&<p><a href="https://hhs.iowa.gov/health-prevention/providers-professionals/radiological-health/radon/radon-k-12-schools" target="_blank" rel="noopener noreferrer" style={{color:"#8ce4e6"}}>Read Iowa's school radon requirements ↗</a></p>}
      </div>
      <figure style={{margin:0,order:i%2===0?1:0}}>
        <img src={imageSrc(c.image)} alt={c.alt} loading="lazy" style={{width:"100%",display:"block",borderRadius:16,border:"1px solid #365460",boxShadow:"0 18px 48px #0005"}}/>
        <figcaption style={{fontSize:13,color:"#aebfc9",lineHeight:1.6,marginTop:13}}>{c.caption}</figcaption>
      </figure>
    </article>)}
   </section>
   <MemorialExperience />
   <section style={{margin:"76px 0 0",background:"linear-gradient(130deg,#143344,#0d2731)",padding:"clamp(30px,6vw,80px)",borderRadius:20,border:"1px solid #6f6b55",textAlign:"center"}}>
    <p style={{color:"#e9c98e",letterSpacing:2,fontSize:12}}>THE LESSON CONTINUES</p>
    <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(34px,4.5vw,60px)",fontWeight:400,margin:"18px 0"}}>A teacher’s influence has no final bell.</h2>
    <p style={{fontSize:19,lineHeight:1.85,maxWidth:900,margin:"20px auto 34px",color:"#d2e0e5"}}>For thirty-three years, Gail gave children the gift of learning. When illness changed her own life, she used what she learned to help protect lives she would never know. She did not live to see the Iowa law carrying her name, but her voice helped bring a responsibility into the world that endures beyond her lifetime.</p>
    <Link href="/showrooms/radon-mitigation-evidence-continuity" style={{display:"inline-block",padding:"16px 26px",background:"#bce9ed",color:"#07212a",borderRadius:8,textDecoration:"none",fontWeight:800}}>Explore radon evidence and verification →</Link>
   </section>
   <section style={{padding:"75px 0 35px"}}>
    <h2 style={{fontFamily:"Georgia,serif",fontSize:31,fontWeight:400}}>Sources and further reading</h2>
    <ul style={{lineHeight:2.1,color:"#c4d7df",fontSize:16}}>
     <li><a href="https://www.tributearchive.com/obituaries/13809045/Gail-Orcutt" style={{color:"#9de0e8"}}>Gail Orcutt's obituary — family, career, and life</a></li>
     <li><a href="https://canceriowa.org/gails-journey/" style={{color:"#9de0e8"}}>Iowa Cancer Consortium — Gail's Journey, in her own words</a></li>
     <li><a href="https://canceriowa.org/mourning-the-passing-of-gail-orcutt/" style={{color:"#9de0e8"}}>Iowa Cancer Consortium — remembering Gail's advocacy</a></li>
     <li><a href="https://www.fightcancer.org/releases/governor-signs-bill-radon-testing-and-mitigation-schools" style={{color:"#9de0e8"}}>American Cancer Society Cancer Action Network — 2022 law signed</a></li>
     <li><a href="https://hhs.iowa.gov/health-prevention/providers-professionals/radiological-health/radon/radon-k-12-schools" style={{color:"#9de0e8"}}>Iowa HHS — school radon requirements and deadlines</a></li>
    </ul>
   </section>
   <footer style={{borderTop:"1px solid #365260",paddingTop:24,fontSize:13,lineHeight:1.8,color:"#a7b9c3"}}>Independent educational memorial by TA14 Authority Governance Institution LLC. This tribute is not affiliated with or endorsed by Gail Orcutt's family, the State of Iowa, or the organizations cited. The opening portrait is AI-generated, not a verified likeness. All classroom and school illustrations are symbolic, not documentary photographs. TA14's governance discussion is educational, not a deployed authorization or school monitoring service. This page is not medical or legal advice.</footer>
  </div>
 </main>;
}
