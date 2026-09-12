import type { CommercialEngine } from '@/components/commercial-engine';

const request=(subject:string)=>`mailto:registry@ta14authority.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('I want to discuss this TA-14 paid commercial offer.\n\nOrganization:\nUse case:\nCurrent system/workflow:\nDesired outcome:\n')}`;

export const executionAuthorityReview:CommercialEngine={
  eyebrow:'TA-14 EXECUTION AUTHORITY REVIEW',
  title:'Prove whether a consequential workflow is actually authorized to execute.',
  promise:'A fixed-scope review of one AI, software, operational or physical workflow at the point where evidence becomes consequence.',
  audience:'AI teams · regulated operators · product owners · governance leaders · system integrators',
  price:'Fixed-scope reviews from $1,500',
  problem:'Logs, approvals, identity and policy may exist while nobody can prove that the exact action was admissible under the current evidence and authority when execution occurred.',
  deliverables:['Frozen proposition and execution boundary','Evidence / authority / continuity map','ALLOW · HOLD · DENY · ESCALATE determination','Missing-control findings and remediation priorities','Publishable or private evidence package, as scoped'],
  proof:['Identity is not execution authority.','Evidence is not automatically sufficient for consequence.','A control discovered after the act did not govern the act.'],
  seoTerms:['AI execution authority review','AI governance assessment','runtime AI controls','prove AI action authorized','AI agent authorization audit'],
  ctaLabel:'REQUEST PAID REVIEW',ctaHref:request('TA-14 Execution Authority Review'),secondaryLabel:'OPEN EXISTING CLAIM REVIEW',secondaryHref:'/execution-claim-review'
};

export const hvacAdmissibleDiagnosticRecord:CommercialEngine={
  eyebrow:'TA-14 ACADEMY · HVAC COMMERCIAL ENGINE',
  title:'The HVAC Admissible Diagnostic Record.',
  promise:'Turn troubleshooting into a governed sequence: baseline first, declared diagnostic determination second, intervention only after evidence is sufficient, and post-intervention proof at closure.',
  audience:'HVAC contractors · service managers · technicians · educators · training organizations',
  price:'Founding contractor implementation from $495',
  problem:'The trade can collect measurements and still intervene without a declared baseline, a bounded determination, an explicit intervention threshold, or a comparable post-intervention performance record.',
  deliverables:['Baseline performance-record template','Non-invasive evidence threshold before refrigerant/system entry','Declared diagnostic determination record','Intervention authorization checkpoint','Post-intervention performance record and baseline comparison','Implementation briefing for contractor or training team'],
  proof:['Measurement is not diagnosis.','Diagnosis is not automatically a declared determination.','A number is not permission to alter the system.','Performance must be proven after intervention against the preserved baseline.'],
  seoTerms:['HVAC diagnostic record','HVAC evidence before intervention','HVAC diagnostic process','HVAC performance record','HVAC technician diagnostic training'],
  ctaLabel:'START CONTRACTOR IMPLEMENTATION',ctaHref:request('HVAC Admissible Diagnostic Record Implementation'),secondaryLabel:'OPEN FREE HVAC ACADEMY',secondaryHref:'/academy/hvac'
};

export const environmentalVerification:CommercialEngine={
  eyebrow:'ENVIRONMENTAL INTEGRITY GOVERNANCE · COMMERCIAL ENGINE',
  title:'Environmental Integrity Verification.',
  promise:'A bounded verification record that connects baseline conditions, exposure pathways, intervention, post-intervention evidence and closure without turning “PASS” into an unsupported health claim.',
  audience:'Schools · facilities · IAQ firms · remediation teams · property operators · HVAC contractors',
  price:'Fixed-scope verification from $750',
  problem:'Monitoring and remediation can produce readings and reports without proving what changed, what remained unverified, whether the exposure pathway was addressed, or what the evidence is authorized to establish.',
  deliverables:['Pre-intervention environmental baseline','Source / reservoir / transport / exposure-pathway map','Intervention record and evidence requirements','Post-intervention verification record','Declared limitations and unresolved conditions','Bounded closure determination'],
  proof:['Monitoring is not verification.','A voluntary threshold does not prove safety for every occupant.','The result must stay bounded to what the evidence can actually establish.'],
  seoTerms:['indoor air quality verification','post remediation verification record','environmental exposure verification','IAQ performance verification','clean air verification'],
  ctaLabel:'REQUEST VERIFICATION',ctaHref:request('Environmental Integrity Verification'),secondaryLabel:'OPEN ENVIRONMENTAL GOVERNANCE',secondaryHref:'/environmental-integrity-governance'
};

export const recordProvenanceReview:CommercialEngine={
  eyebrow:'TA-14 RECORD PROVENANCE REVIEW',
  title:'Know who or what actually created the record you are relying on.',
  promise:'A provenance review for AI-assisted or multi-actor records: generation, edits, acceptance, signing, timestamps, authority and post-signature change.',
  audience:'Legal teams · healthcare operations · auditors · compliance teams · AI product owners',
  price:'Fixed-scope provenance reviews from $1,250',
  problem:'A signed or stored record can look authoritative while obscuring AI generation, copied-forward content, human review, edit history, signing sequence or the authority behind acceptance.',
  deliverables:['Record-creation and modification timeline','Human / AI contribution map','Acceptance and signing-authority review','Continuity and version findings','Gaps that prevent reliable attribution','Bounded provenance determination'],
  proof:['The final document is not the complete provenance chain.','Signature does not prove authorship.','Auditability requires preserving who generated, changed, accepted and relied on what.'],
  seoTerms:['AI record provenance audit','AI medical note audit trail','AI documentation provenance','record authenticity review','AI generated document audit'],
  ctaLabel:'REQUEST PROVENANCE REVIEW',ctaHref:request('TA-14 Record Provenance Review'),secondaryLabel:'VIEW EXECUTION EVIDENCE',secondaryHref:'/execution-evidence-snapshot'
};

export const agentAuthorityBenchmark:CommercialEngine={
  eyebrow:'ACA · AGENT EXECUTION AUTHORITY BENCHMARK',
  title:'Do not score only whether the agent completed the task. Score whether it stopped when authority stopped.',
  promise:'A bounded agent benchmark for tool use, changed context, revoked authority, conflicting evidence and irreversible action boundaries.',
  audience:'Agent builders · AI labs · enterprise AI teams · assurance providers · regulated deployers',
  price:'Benchmark engagements from $2,500',
  problem:'Most agent evaluations reward successful completion. That can hide unsafe sequencing, stale evidence, excessive tool authority and agents that continue after the permission envelope has changed.',
  deliverables:['Declared agent permission envelope','Pre-registered authority-change scenarios','Tool-call and execution-boundary tests','Changed-context and revocation tests','ALLOW / HOLD / DENY / ESCALATE behavior report','Evidence package suitable for internal assurance or publication'],
  proof:['Capability is not autonomy.','Autonomy is not authority.','Task success can still be governance failure.','The benchmark tests whether execution remains inside the authorized boundary.'],
  seoTerms:['AI agent benchmark','AI agent permission testing','AI agent governance benchmark','agentic AI authorization','AI tool use safety benchmark'],
  ctaLabel:'BOOK AGENT BENCHMARK',ctaHref:request('Agent Execution Authority Benchmark'),secondaryLabel:'OPEN AI GOVERNANCE WORLD',secondaryHref:'/ai-governance'
};

export const commercialOffers=[executionAuthorityReview,hvacAdmissibleDiagnosticRecord,environmentalVerification,recordProvenanceReview,agentAuthorityBenchmark];
