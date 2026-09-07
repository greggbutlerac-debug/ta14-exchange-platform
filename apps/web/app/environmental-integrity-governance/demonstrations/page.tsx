import Link from 'next/link';

const demos = [
  ['/environmental-integrity-governance/demonstrations/environmental-evidence-conformance','EIG SHOWCASE · ENVIRONMENTAL EVIDENCE CONFORMANCE','Environmental Evidence Conformance Showcase','Test whether an existing monitoring system produces evidence that is admissible for bounded consequential reliance. Compare the same system in monitoring-only and TA-14 governed states.','#83f0bd'],
  ['/environmental-integrity-governance/demonstrations/architecture','REUSABLE GOVERNANCE FRAMEWORK · R1','EIG Demonstration Architecture','The common evidence, admissibility, changed-condition, authority, commit, execution, and outcome structure used across environmental demonstration families.','#71e5ad'],
  ['/environmental-integrity-governance/demonstrations/conflicting-environmental-record','EIG DEMONSTRATION 001 · R1','The Conflicting Environmental Record','Two environmental measurements. Different contexts. One governed question: may the proposed consequence cross the boundary?','#71e5ad'],
  ['/environmental-integrity-governance/demonstrations/changed-condition-moisture','EIG DEMONSTRATION 002 · R1 · CHANGED CONDITION','The Moisture Condition Changed Before Commit','An intervention is initially supportable. Material environmental evidence changes before execution. Does governance stop the stale ALLOW from crossing the boundary?','#f0cf75'],
  ['/environmental-integrity-governance/demonstrations/reporting-to-authority','EIG DEMONSTRATION 003 · R1 · REPORTING → AUTHORITY','From Environmental Reporting to Environmental Authority','Continuous monitoring and historical reporting can establish useful information. What must be established before that record is authorized to cause a consequential building action?','#87bcff'],
  ['/environmental-integrity-governance/demonstrations/transient-pm25-aggregation','EIG DEMONSTRATION 004 · R1 · TIME-RESOLUTION FAILURE','When the Average Erases the Event','A short-duration PM2.5 event is visible in the native record but progressively obscured by aggregation. Can a mathematically correct average substitute for the required time resolution?','#ffad8e'],
  ['/environmental-integrity-governance/demonstrations/wrong-inspection-object','EIG DEMONSTRATION 005 · R1 · OBJECT LOCALIZATION','The Wrong Inspection Object','A visible environmental symptom requires inspection, but its causal object remains unresolved. Can governance preserve the condition without silently converting symptom into cause, fault, authority, or intervention target?','#c9afff'],
] as const;

export default function EnvironmentalDemonstrationsPage(){
  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0%,#12372d 0,#071511 38%,#030807 78%)',color:'#edf9f4',fontFamily:'Arial,Helvetica,sans-serif'}}>
    <nav style={{padding:'18px clamp(20px,5vw,72px)',borderBottom:'1px solid rgba(120,240,190,.18)'}}><Link href='/environmental-integrity-governance' style={{color:'#83f0bd',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL INTEGRITY GOVERNANCE</Link></nav>
    <section style={{maxWidth:1180,margin:'0 auto',padding:'80px 24px'}}>
      <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.18em',fontSize:12}}>DOOR 03 · ENVIRONMENTAL PROVING GROUND</p>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(44px,7vw,78px)',lineHeight:1,margin:'14px 0 20px'}}>Governance should be demonstrated, not merely described.</h1>
      <p style={{maxWidth:850,color:'#b8d0c5',fontSize:18,lineHeight:1.7}}>Run bounded environmental cases against preserved evidence, declared non-claims, proposition-specific admissibility, changed conditions, time resolution, object localization, and the commit boundary.</p>
      <div style={{marginTop:34}}>{demos.map(([href,label,title,description,accent],i)=><Link key={href} href={href} style={{display:'block',marginTop:i?18:0,padding:i===0?34:26,border:`1px solid ${accent}55`,borderRadius:18,background:i===0?'linear-gradient(135deg,rgba(20,74,53,.86),rgba(5,20,15,.78))':'rgba(5,20,15,.62)',color:'#edf9f4',textDecoration:'none',boxShadow:i===0?'0 0 42px rgba(78,221,160,.08)':'none'}}><small style={{color:accent,fontWeight:900,letterSpacing:'.14em'}}>{label}</small><h2 style={{fontFamily:'Georgia,serif',fontSize:i===0?42:34,margin:'9px 0'}}>{title}</h2><p style={{color:'#b8d0c5',lineHeight:1.65,maxWidth:920}}>{description}</p><strong style={{display:'inline-block',marginTop:10,color:accent}}>{i===0?'OPEN THE CONFORMANCE SHOWCASE →':'RUN / INSPECT →'}</strong></Link>)}</div>
    </section>
  </main>;
}
