type DiagramProps={number:string;title:string;copy:string};
const stages=['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'];
export default function TeachingDiagram({number,title,copy}:DiagramProps){
 const index=Math.max(0,Math.min(7,Number(number)-1));
 return <figure style={{margin:0,border:'1px solid #31536a',borderRadius:16,overflow:'hidden',background:'#061927'}}>
 <svg viewBox="0 0 1100 590" role="img" aria-label={title+': '+copy} style={{display:'block',width:'100%',height:'auto'}}>
 <defs><linearGradient id={'bg'+number} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#08263c"/><stop offset="1" stopColor="#041019"/></linearGradient></defs>
 <rect width="1100" height="590" fill={'url(#bg'+number+')'}/>
 <text x="60" y="68" fill="#eac47a" fontSize="20" fontWeight="bold" letterSpacing="4">TA14 · MALAWI · TEACHING SECTION {number} / 08</text>
 <text x="60" y="135" fill="#f5f9fc" fontSize="39" fontWeight="bold">{title.toUpperCase()}</text>
 <line x1="60" x2="1040" y1="166" y2="166" stroke="#46718b" strokeWidth="2"/>
 {stages.map((stage,i)=>{const x=68+(i%4)*260,y=220+Math.floor(i/4)*150,active=i===index;return <g key={stage}><rect x={x} y={y} width="220" height="106" rx="14" fill={active?'#255d72':'#0c2a3d'} stroke={active?'#f1c66f':'#376078'} strokeWidth={active?4:1.5}/><text x={x+17} y={y+32} fill={active?'#ffe09c':'#86cbe2'} fontSize="18" fontWeight="bold">{String(i+1).padStart(2,'0')}</text><text x={x+17} y={y+70} fill="#f0f7fb" fontSize={stage.length>11?15:19} fontWeight="bold">{stage}</text></g>})}
 <text x="60" y="548" fill="#eac47a" fontSize="18">OBSERVED IS NOT INFERRED. INFERRED IS NOT AUTHORIZED.</text>
 </svg>
 <figcaption style={{padding:'18px 22px',color:'#c4d5df',lineHeight:1.6}}>{copy} <strong style={{color:'#eac47a'}}>Highlighted gate: {stages[index]}.</strong></figcaption>
 </figure>
}