import type { Metadata } from 'next';
import LessonAudio from './LessonAudio';

export const metadata: Metadata = {
  title: 'Evidence Before Intervention | HVAC Technical Examination Draft | TA14',
  description: 'Unpublished examination draft: eight HVAC evidence-governance teaching lessons. Not an adopted field standard.',
  robots: { index: false, follow: false },
};

const lessons = [
  [
    "Preserve Reality Before Intervention",
    "Look at the first illustration as the opening scene of a real HVAC service call. The customer reports a comfort problem, but a complaint is a reason to investigate, not proof of a failed part. Before making a change, the technician identifies the equipment and documents what is actually happening: the reported concern, operating mode, thermostat command, equipment identification, visible conditions, and any safety or access limitations. That is the difference between arriving with a theory and preserving an observable starting point.\n\n\n\nImagine a system that is cooling poorly. If someone immediately changes the thermostat, resets a fault, cleans a coil, or replaces a capacitor, information about the original condition can disappear. We may no longer know whether the equipment was running continuously, cycling abnormally, or failing to start. The illustration is teaching preservation: keep observations, times, sources, and what the technician did separate from assumptions.\n\n\n\nSafety is not sacrificed to obtain a perfect record. If an immediate protective action is required, take the appropriate lawful and safe action, then document why the original state could not be fully preserved. The governing question is not whether the technician is capable of making a repair. It is whether the evidence supports the next step and whether that step is permitted. The first lesson is to observe reality before changing reality.",
    "An observation is not yet a diagnosis. Preserve what existed before the technician altered it.",
    "Next, build a traceable original-state performance record."
  ],
  [
    "Original-State HVAC Performance Record",
    "This illustration introduces the original-state HVAC Performance Record. Think of the record as a carefully preserved description of how the equipment behaved before a consequential intervention. It should explain the operating conditions, the exact measurement locations, units, instruments, time, and relevant system configuration. Air-side temperatures, airflow indicators, accessible electrical observations, controls, and safety observations can help establish that state when obtained safely and within scope.\n\n\n\nNow consider a warm supply-air reading. By itself, that reading does not prove that the system needs refrigerant. The interpretation may depend on equipment mode, airflow, load, control behavior, and other evidence. The record must distinguish measured facts from calculated values and diagnostic inferences. A technician should be able to point to each reading and answer: Where did this come from? Under what conditions was it taken? Can another qualified reviewer understand and evaluate it?\n\n\n\nYou may see gauges or pressures in this teaching image. Those are illustrative, not instructions to connect gauges early. Refrigerant-side evidence belongs in the baseline only when the applicable NIRET conditions have been satisfied and separate authority for entry exists. Baseline establishment can progress through the examination, but the original evidence cannot be silently rewritten after an intervention. If the conditions later change, preserve the raw before and after records as separate records, with any comparisons explained.",
    "The baseline must be attributable, preserved, and distinguishable from later changes.",
    "Next, examine the full indoor and outdoor inspection sequence."
  ],
  [
    "Seven In / Seven Out Examination",
    "The fourteen-step picture is a teaching map, not a blanket work authorization. The Academy organizes the field examination into Seven In and Seven Out: seven indoor steps and seven outdoor steps. Indoors, that route addresses the air handler, heat-kit or furnace operation, blower and airflow, evaporator coil, metering-device identification, filter and return conditions, and final indoor integrity. Outdoors, it addresses condenser observations and access, start components and insulation, motor and compressor electrical evidence, reassembly, condenser airflow and cleaning, refrigerant-charge approximation, and condensate management with system closure. Each step must be interpreted through the controlling Academy instructions.\n\n\n\nNotice what the sequence accomplishes: it keeps the technician from declaring a refrigerant problem before exploring accessible, non-invasive alternatives. A restricted filter or an airflow fault can affect temperatures and the meaning of later refrigerant-side measurements. Likewise, observing a damaged component is not automatically authority to replace it.\n\n\n\nSome step titles mention opening panels, cleaning, reassembly, or other consequential work. Those words do not remove electrical, mechanical, refrigerant, safety, site, or legal requirements. A step may need to be held, scoped differently, or separately authorized. Record which steps were completed, which were not, and why. The educational value is not checking fourteen boxes. It is maintaining an attributable route from the original complaint to the evidence needed for a justified diagnostic determination.",
    "Fourteen inspection steps do not create fourteen permissions to intervene.",
    "Next, evaluate whether refrigerant-system entry is justified."
  ],
  [
    "NIRET: Non-Invasive Refrigerant Entry Threshold",
    "NIRET means Non-Invasive Refrigerant Entry Threshold. This image is about the decision boundary before disturbing the refrigerant circuit. The technician first preserves non-invasive findings and asks what uncertainty remains. Can the concern be explained or narrowed through airflow, operating mode, controls, accessible electrical evidence, and the original-state observations? If not, what specific question would refrigerant-side measurements resolve?\n\n\n\nConnecting gauges merely because they are available reverses the order. A pressure reading can be affected by conditions the technician has not yet established, and system entry has consequences of its own. NIRET therefore concerns evidentiary necessity. It is not a universal requirement to enter the circuit, and satisfying a threshold does not create permission to connect, recover, charge, or repair.\n\n\n\nImagine two service calls. In one, a documented air-side restriction explains the performance concern; further refrigerant entry might not be justified. In another, the non-invasive record leaves a specific unresolved refrigerant-side question; a qualified person may consider entry, subject to the exact controlling Academy threshold and separate authority. In both cases, the decision and supporting evidence should be recorded, including a decision not to enter. The detailed criteria must come from the controlling Academy source, not from this illustration alone. The point of the image is to make the pause before refrigerant entry visible.",
    "Evidentiary necessity and execution authority are separate questions.",
    "Next, declare what the available evidence actually establishes."
  ],
  [
    "Declared Diagnostic Determination",
    "Here we arrive at the Declared Diagnostic Determination, or DDD. The illustration presents a determination form because a diagnosis needs to become an attributable, reviewable statement before an intervention is proposed. It is not enough to say, \"I think the charge is low,\" or \"the capacitor is bad.\" A defensible determination identifies the condition supported by observations, the reasoning connecting those observations to the finding, the uncertainty that remains, and the limits of what has been established.\n\n\n\nRead the image as a distinction among four categories: what was observed, what was measured, what was calculated or inferred, and what the evidence actually supports. A measurement can be accurate while an interpretation remains uncertain. Conflicting readings should be preserved and examined, not quietly discarded. A determination may also be that the evidence is insufficient and further investigation is necessary.\n\n\n\nAny name, signature, numerical reading, or completed form shown in the illustration is a fictional teaching example. It is not a signed field record and cannot authorize work. The DDD is an evidentiary boundary: it tells the next decision-maker what is known, what is not, and why a particular intervention is being considered. If the supporting evidence changes, the determination must be reviewed rather than retroactively making the old record appear stronger. The next step is not automatic execution. It is examination of authority and standing.",
    "A diagnostic determination is a finding, not permission to repair.",
    "Next, establish standing and authority for the proposed intervention."
  ],
  [
    "Establish Authority Before Intervention",
    "Look closely at the permission and scope elements in this illustration. Even a technically sound diagnosis does not answer who may perform an intervention, under what capacity, on whose equipment, and within which limits. TA14 separates capability from authority. A technician may know how to replace a component without having the customer authorization, applicable legal standing, site permission, safety conditions, or manufacturer-supported basis required for that particular action.\n\n\n\nAn admissible execution decision therefore considers the actor, their capacity, the standing basis, the authority relationship, the proposed action, and the bounded scope. The question is not simply, \"Can we fix it?\" It is whether admissible evidence, applicable authority, and established standing support making that proposed consequence real now. A bounded approval for inspection does not automatically permit a major equipment replacement, system opening, or an unrelated repair.\n\n\n\nThe illustration contains example forms, names, approvals, and possibly license or equipment references. They are teaching placeholders only. They do not establish any real authorization or credential. If scope, qualification, site access, safety, or authority is missing, the correct response is to hold the consequential action and document the gap. If authorized work proceeds, preserve what was approved, what was done, who did it, and any deviation. Authority must be established before execution, not inferred afterward from a successful result.",
    "Capability does not equal authority; a valid diagnosis does not grant execution permission.",
    "Next, preserve the system state after any authorized intervention."
  ],
  [
    "Post-Intervention HVAC Performance Record",
    "The seventh illustration moves from the authorized intervention to the post-intervention HVAC Performance Record. The technician has changed something, but the work being completed is not proof that the original problem was resolved. We now need a new, independently attributable description of the system's state after the work.\n\n\n\nThe post record should document operating mode, relevant load and environmental conditions, measurement points, methods, units, timing, equipment configuration, and the observed response. Where appropriate and safely obtained, repeat comparable measurements from the original record. Preserve new anomalies and remaining complaints as well as favorable results. Never edit the before record to make the after reading look more convincing.\n\n\n\nSuppose a condenser or airflow component has been changed. A lower temperature, different pressure, or improved comfort may be encouraging, but the conditions might no longer be directly comparable. Outside temperature, airflow, load, or equipment configuration may have changed. The examiner must distinguish raw observed differences from justified adjustments and must state what comparison remains possible. A before/after graphic can suggest improvement without establishing it. That is why we preserve two separate performance records and identify sources, methods, and limitations. The image teaches disciplined post-work measurement, not permission to declare victory. A claim of restored or improved performance requires the next lesson: a supported comparison and outcome determination.",
    "A post-state record alone does not establish improvement.",
    "Next, compare both records and classify only the supported outcome."
  ],
  [
    "Proof of Performance and Verified Outcome",
    "This final illustration brings the entire evidence-to-proof route together. Start with the preserved original state and the declared diagnostic determination. Then trace the actual authorized intervention and the independently preserved post-intervention state. Proof of Performance is not a photograph of a running unit and it is not an invoice saying the job is complete. It is a defensible comparison between records that were collected under understood conditions, with their provenance and limitations intact.\n\n\n\nThe comparison asks whether the relevant measurements are genuinely comparable: same or explainably different operating modes, measurement points, methods, units, loads, and equipment configuration. Where adjustments are needed, retain the raw observations alongside the adjusted analysis and explain the method. If you cannot establish enough comparability, the outcome must not be overstated. Sample numerical improvements and apparent signatures in the image are illustrative, not authenticated proof.\n\n\n\nTA14 uses seven outcome classifications: IMPROVED, RESTORED, UNCHANGED, DEGRADED, PARTIALLY RESOLVED, UNRESOLVED, and INDETERMINATE. Each has to follow from the evidence. An unresolved complaint is not hidden behind one favorable reading; an indeterminate comparison is not relabeled a success. Finally, ask whether the complete chain is traceable from reality through the records, admissibility, authority, execution, and observed outcome. If a required link is missing, state the limitation. This is the central discipline of Evidence Before Intervention: no admissible evidence, no admissible execution, and no unsupported claim of verified performance.",
    "An outcome claim must not exceed the preserved evidence.",
    "Complete the evidence chain, document limitations, and submit technical feedback."
  ]
] as const;

const pdfUrl = '/TA14_Evidence_Before_Intervention_HVAC_Technical_Reference_v1.pdf';
const imageFiles = [
  'Evidence Before HVAC Intervention.png',
  'Evidence Before Intervention_ HVAC Record.png',
  'HVAC Evidence Before Intervention.png',
  'Evidence Before HVAC Intervention (1).png',
  'Evidence Before HVAC Intervention (2).png',
  'Evidence Before HVAC Intervention (3).png',
  'Post-Intervention HVAC Performance Record.png',
  'Evidence Before Intervention_ Verified HVAC Outcomes.png',
] as const;

const teachingCautions = [
  'A service concern, visual inspection, or equipment label is not independently sufficient to establish a repair.',
  'Any refrigerant-gauge imagery is conditional teaching material. Pressure readings must not be taken before applicable NIRET and separate execution authority; do not treat illustrative readings as a real baseline.',
  'The fourteen steps are a teaching route. Cleaning, panel operations, adjustments, and other consequential actions require their own safety and authority controls.',
  'Use only the controlling Academy NIRET criteria. A threshold finding does not automatically authorize connection, entry, recovery, charging, or repair.',
  'Any names, numbers, measurements, or apparent signatures in the illustration are fictional placeholders, not real evidence, determinations, or attestations.',
  'Any apparent customer approval, license number, signature, proposed equipment change, or manufacturer instruction is illustrative only. Actual scope and authority must be independently established.',
  'Changing equipment or operating conditions can defeat direct comparability. Preserve both records separately and identify any adjustments or limits on claims of improvement.',
  'Sample signatures and before/after values do not establish verified outcomes. If provenance or comparability is insufficient, retain an indeterminate or otherwise supported classification.',
] as const;

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
        <p>Diagnostic-termination wording, applicable NIRET details, independent technical validation, and lesson-image technical review remain outstanding. The illustrated examples are not field records, approvals, or credentials.</p>
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
              <img src={`/${encodeURIComponent(imageFiles[i])}`} alt={`Teaching illustration ${i+1}: ${title}. Illustrative examples, not authenticated field evidence.`} width={1536} height={1024} loading={i < 2 ? "eager" : "lazy"} style={{width:'100%',height:'auto',borderRadius:12}} />
              <figcaption style={{fontSize:13,marginTop:8}}>Illustrative teaching image — no real authorization, signature, measured outcome, or technical attestation is represented.</figcaption>
            </figure>
            <LessonAudio number={i+1} title={title} script={narration} />
            <section aria-label={`Samantha's narration for lesson ${i+1}`} style={{background:'#edf4fa',border:'1px solid #c6d9e7',borderRadius:14,padding:'clamp(20px,3vw,34px)',margin:'16px 0 24px',color:'#13283a'}}>
              <p style={{fontSize:12,fontWeight:800,letterSpacing:'.13em',textTransform:'uppercase',margin:'0 0 4px',color:'#326386'}}>TA14 · Guided teaching</p>
              <h4 style={{fontSize:'1.35rem',lineHeight:1.3,margin:'0 0 18px'}}>Samantha explains the image</h4>
              <div style={{fontSize:'1.05rem',lineHeight:1.85,maxWidth:850}}>
                {narration.split('\n\n').map((paragraph,j)=><p key={j} style={{margin:'0 0 16px'}}>{paragraph}</p>)}
              </div>
            </section>
            <aside style={{borderLeft:'4px solid #bd7130',padding:'12px 16px',background:'#fff4e7',color:'#382713',margin:'16px 0'}}>
              <strong>Technical interpretation boundary</strong>
              <p style={{marginBottom:0}}>{teachingCautions[i]}</p>
            </aside>

            {i === 4 && <p style={{borderLeft:"4px solid #3a6185",padding:"12px 16px",background:"#edf4fa"}}><strong>Diagnostic termination is a separate Academy requirement.</strong> A Declared Diagnostic Determination does not by itself establish that the controlling examination-stop conditions have been met. The specific Academy criteria must be verified before making that claim.</p>}
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
      <section aria-labelledby="academy-practice" style={{border:'1px solid #9fb9cc',borderRadius:14,padding:'24px',margin:'32px 0'}}>
        <p style={{fontWeight:800,letterSpacing:'.09em',fontSize:12}}>CONTINUE THE ACADEMY ROUTE</p>
        <h2 id="academy-practice">Study the governing blueprint. Then practice.</h2>
        <p>This eight-image showroom is an introduction, not the complete controlling field standard or a competency credential. The Academy blueprint preserves the nine proof elements, explains the NIRET evidence boundary, and provides access to the fourteen-step field operations lab.</p>
        <nav style={{display:'flex',flexWrap:'wrap',gap:18}}>
          <a href="/academy/hvac/blueprint">Review the Academy blueprint and Samantha audio guide ↗</a>
          <a href="/exchange/hvac/14-step/1">Begin the fourteen-step field route ↗</a>
        </nav>
        <p style={{fontSize:13,marginTop:16}}>Each image has its own Samantha audio playback control immediately beneath it. Voice availability and voice identity depend on the visitor's device; complete written narration remains available.</p>
      </section>
      <section>
        <h2>Companion technical reference</h2>
        <p>Use the technical reference to inspect the field sequence, admissibility limits, and outcome classifications. The document is committed in the repository public directory.</p><p><a href={pdfUrl} download>Download the eight-page HVAC Technical Reference v1.0 (PDF)</a></p>
      </section>
      <footer style={{borderTop:'1px solid #899aa9',marginTop:40,paddingTop:24}}>
        <p>Independent technical observations are welcome. Please identify the lesson number, evidence concern, and proposed correction. Do not include private customer records.</p>
        <a href="mailto:ta14admissibleexecution@gmail.com?subject=HVAC%20Evidence%20Before%20Intervention%20Technical%20Feedback" style={{position:'fixed',right:20,bottom:20,background:'#163c62',color:'white',padding:'10px 14px',borderRadius:999,fontSize:13,fontWeight:700,boxShadow:'0 4px 16px #0003',zIndex:20}}>Submit Technical Feedback ↗</a>
        <p>Examination draft only. No governing publication, credentialing, or institutional endorsement is implied.</p>
      </footer>
    </main>
  );
}
