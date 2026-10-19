// Explicit missing-prerequisite guidance. Advisory only; never grants authorization.
export function explainGovernanceGaps(input) {
 const evidence=input?.evidence||{},authority=input?.authority||{};
 const present=(o,k)=>typeof o?.[k]==='string'&&o[k].trim().length>0;
 const requirements=[
  {id:'evidence_source',gate:'Record',field:'source',section:'evidence',label:'Identify the originating observation source',proof:'Independently authenticated source record and accountable issuer'},
  {id:'evidence_timestamp',gate:'Record',field:'timestamp',section:'evidence',label:'Establish when the observation occurred',proof:'Verifiable timestamp bound to the source record'},
  {id:'evidence_calibration',gate:'Admissibility',field:'calibration',section:'evidence',label:'Establish measurement verification basis',proof:'Applicable calibration or validation record with scope and validity'},
  {id:'evidence_continuity',gate:'Continuity',field:'continuity',section:'evidence',label:'Establish evidence continuity and custody',proof:'Verifiable provenance and integrity chain'},
  {id:'actor',gate:'Binding',field:'actor',section:'authority',label:'Identify the proposed responsible actor',proof:'Authenticated actor identity'},
  {id:'capacity',gate:'Binding',field:'capacity',section:'authority',label:'Establish the actor’s capacity',proof:'Independently established role and capacity record'},
  {id:'standing',gate:'Binding',field:'standing_basis',section:'authority',label:'Establish standing for this consequence',proof:'Applicable standing basis scoped to the actor and proposed consequence'},
  {id:'relationship',gate:'Binding',field:'authority_relationship',section:'authority',label:'Establish the authority relationship',proof:'Verified delegation or institutional authority chain'},
  {id:'policy',gate:'Admissibility',field:'applicable_policy',section:'authority',label:'Identify the applicable governing policy',proof:'Authenticated applicable policy version and scope'}
 ];
 return requirements.map(r=>{
  const claim=present(r.section==='evidence'?evidence:authority,r.field);
  return {id:r.id,gate:r.gate,label:r.label,claimStatus:claim?'CLAIM_PRESENT_UNVERIFIED':'CLAIM_MISSING',requiredProof:r.proof,established:false};
 }).concat([
  {id:'issuer_trust',gate:'Admissibility',label:'Verify attestation issuer and revocation status',claimStatus:'NOT_CONFIGURED',requiredProof:'Independently administered issuer trust registry and fresh revocation evidence',established:false},
  {id:'execution_receipt',gate:'Commit',label:'Establish bounded execution authorization',claimStatus:'NOT_IMPLEMENTED',requiredProof:'Valid scoped, time-limited and replay-resistant execution receipt',established:false}
 ]);
}
