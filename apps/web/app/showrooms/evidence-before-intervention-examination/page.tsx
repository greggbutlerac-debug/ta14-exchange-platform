import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Evidence Before Intervention | HVAC Technical Examination Draft | TA14',
  description: 'Unpublished examination draft: eight HVAC evidence-governance teaching lessons. Not an adopted field standard.',
  robots: { index: false, follow: false },
};

const lessons = [
  [
    "Preserve Reality Before Intervention",
    "Record the complaint, asset identity, operating mode, safety conditions, and initial observations before changing the system.",
    "An observation is not yet a diagnosis. Preserve what existed before the technician altered it.",
    "Next, build a traceable original-state performance record."
  ],
  [
    "Original-State HVAC Performance Record",
    "Document conditions, measurement points, instruments, units, timestamps, and uncertainty. Refrigerant-side readings are included only if NIRET and separate authorization permit entry.",
    "The baseline must be attributable, preserved, and distinguishable from later changes.",
    "Next, examine the full indoor and outdoor inspection sequence."
  ],
  [
    "Seven In / Seven Out Examination",
    "Follow the Academy's fourteen-step teaching route: seven indoor and seven outdoor steps. Each observation remains bounded by safety and authority.",
    "Fourteen inspection steps do not create fourteen permissions to intervene.",
    "Next, evaluate whether refrigerant-system entry is justified."
  ],
  [
    "NIRET: Non-Invasive Refrigerant Entry Threshold",
    "Use the controlling Academy NIRET requirements and preserved non-invasive evidence to evaluate whether refrigerant entry is necessary. NIRET does not itself authorize entry.",
    "Evidentiary necessity and execution authority are separate questions.",
    "Next, declare what the available evidence actually establishes."
  ],
  [
    "Declared Diagnostic Determination",
    "Separate observed facts, calculations, inference, uncertainty, and supported diagnostic findings. Record unresolved questions without inventing certainty.",
    "A diagnostic determination is a finding, not permission to repair.",
    "Next, establish standing and authority for the proposed intervention."
  ],
  [
    "Establish Authority Before Intervention",
    "Define the proposed action, actor, capacity, applicable authority, established standing, site and safety constraints, and authorized scope. Hold if any required condition is missing.",
    "Capability does not equal authority; a valid diagnosis does not grant execution permission.",
    "Next, preserve the system state after any authorized intervention."
  ],
  [
    "Post-Intervention HVAC Performance Record",
    "After authorized work, document the new state with comparable points, methods, units, equipment configuration, operating conditions, and timestamps. Keep the original record intact.",
    "A post-state record alone does not establish improvement.",
    "Next, compare both records and classify only the supported outcome."
  ],
  [
    "Proof of Performance and Verified Outcome",
    "Compare admissible original-state and post-intervention records; evaluate comparability and uncertainty. Classify as IMPROVED, RESTORED, UNCHANGED, DEGRADED, PARTIALLY RESOLVED, UNRESOLVED, or INDETERMINATE only where supported.",
    "An outcome claim must not exceed the preserved evidence.",
    "Complete the evidence chain, document limitations, and submit technical feedback."
  ]
] as const;

const assetRoot = '/evidence-before-intervention';
const pdfUrl = `${assetRoot}/TA14_Evidence_Before_Intervention_HVAC_Technical_Reference_v1.pdf`;

const academyChain = [
  'Sequence', 'Non-Invasive Evidence', 'NIRET',
  'Refrigerant-Side Evidence (if justified and separately authorized)',
  'Original-State HVAC Performance Record', 'Declared Diagnostic Determination',
  'Evidence-Based Intervention', 'HVAC Post-Performance Record', 'Proof of Performance',
];

const criticalFailures = [
  'Intervention before the original-state record is preserved',
  'Refrigerant entry before applicable NIRET is satisfied',
  'Fabricated, backfilled, reconstructed, or silently altered baseline',
  'No declared diagnostic determination before intervention',
  'Intervention unsupported by the evidence or determination',
  'Improvement claimed from post-state alone',
  'Unsafe or unlawful conduct',
];

export default function EvidenceBeforeInterventionExaminationDraft() {
  return (
    <main style={{maxWidth:1080,margin:'0 auto',padding:'48px 20px 100px',fontFamily:'system-ui, sans-serif',lineHeight:1.65}}>
      <p style={{fontWeight:800,letterSpacing:'.12em'}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · TECHNICAL EXAMINATION</p>
      <h1 style={{fontSize:'clamp(2.1rem,5vw,4rem)',lineHeight:1.1}}>Evidence Before Intervention</h1>
      <p>Eight lessons for evidence-governed HVAC service. Teaching sequence only; not a replacement for the controlling Academy field standard.</p>
      <aside style={{border:'2px solid #a63b3b',borderRadius:12,padding:20,margin:'24px 0'}}>
        <strong>PUBLICATION HOLD · DRAFT</strong>
        <p>Diagnostic-termination wording, applicable NIRET details, technical validation, and final asset verification remain outstanding. The illustrated examples are not field records, approvals, or credentials.</p>
      </aside>
      <nav aria-label="Room navigation" style={{display:'flex',gap:16,flexWrap:'wrap',margin:'24px 0'}}><a href="#lessons">Begin eight lessons ↓</a><a href={pdfUrl} target="_blank" rel="noopener noreferrer" download>Download technical reference (PDF) ↗</a><a href="/academy/hvac/blueprint">Academy Blueprint v0.2 ↗</a></nav>
      <section aria-labelledby="academy-chain">
        <h2 id="academy-chain">Controlling Academy evidence-to-proof chain</h2>
        <ol>{academyChain.map((stage)=><li key={stage}>{stage}</li>)}</ol>
        <p>The nine Academy chain stages and the eight showroom teaching lessons are different structures.</p>
      </section>
      <section aria-labelledby="lessons">
        <h2 id="lessons">Eight-lesson guided examination</h2>
        {lessons.map(([title,narration,learned,next],i)=>(
          <article key={title} id={`lesson-${i+1}`} style={{border:'1px solid #899aa9',borderRadius:16,padding:24,margin:'24px 0'}}>
            <p style={{fontWeight:800}}>LESSON {String(i+1).padStart(2,'0')} / 08</p>
            <h3 style={{fontSize:'1.6rem'}}>{title}</h3>
            <figure style={{margin:'20px 0'}}>
              <Image src={`${assetRoot}/lesson-${String(i+1).padStart(2,'0')}.png`} alt={`Teaching illustration ${i+1}: ${title}. Illustrative examples, not authenticated field evidence.`} width={1536} height={1024} sizes="(max-width: 1080px) 100vw, 1080px" style={{width:'100%',height:'auto',borderRadius:12}} />
              <figcaption style={{fontSize:13,marginTop:8}}>Illustrative teaching image — no real authorization, signature, measured outcome, or technical attestation is represented.</figcaption>
            </figure>
            <h4>Samantha · guided narration</h4>
            <p>{narration}</p>
            <h4>What you learned</h4><p>{learned}</p>
            <h4>What comes next</h4><p>{next}</p>
          </article>
        ))}
      </section>
      <section>
        <h2>Critical examination failures</h2>
        <ul>{criticalFailures.map(f=><li key={f}>{f}</li>)}</ul>
        <p>Urgent protective action remains bounded by applicable safety and legal requirements. Preserve surviving evidence and document lost testability.</p>
      </section>
      <section>
        <h2>Companion technical reference</h2>
        <p>Use the technical reference to inspect the field sequence, admissibility limits, and outcome classifications. The link below expects the committed file at the agreed public asset path.</p><p><a href={pdfUrl} download>Download the eight-page HVAC Technical Reference v1.0 (PDF)</a></p>
      </section>
      <footer style={{borderTop:'1px solid #899aa9',marginTop:40,paddingTop:24}}>
        <p>Independent technical observations are welcome. Please identify the lesson number, evidence concern, and proposed correction. Do not include private customer records.</p>
        <a href="mailto:ta14admissibleexecution@gmail.com?subject=HVAC%20Evidence%20Before%20Intervention%20Technical%20Feedback" style={{position:'fixed',right:20,bottom:20,background:'#163c62',color:'white',padding:'10px 14px',borderRadius:999,fontSize:13,fontWeight:700,boxShadow:'0 4px 16px #0003',zIndex:20}}>Submit Technical Feedback ↗</a>
        <p>Examination draft only. No governing publication, credentialing, or institutional endorsement is implied.</p>
      </footer>
    </main>
  );
}
