'use client';

import Link from 'next/link';
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  registryRequiredCompletion,
  registryWizardStepComplete,
  registryWizardValidationErrors,
} from '@/lib/gap-ixc/registry-wizard-gates';

type Visibility = 'PUBLIC' | 'CONTROLLED' | 'PRIVATE';
type ProvenanceStatus =
  | ''
  | 'REGISTRANT-PRODUCED'
  | 'TA14-PRODUCED'
  | 'INDEPENDENTLY PRODUCED'
  | 'INDEPENDENTLY REPRODUCED'
  | 'PUBLIC-SOURCE'
  | 'CROSS-PARTY'
  | 'NOT INDEPENDENTLY ESTABLISHED'
  | 'NOT REPORTED'
  | 'NOT SUBMITTED'
  | 'NOT PRESERVED'
  | 'OUTSIDE REVIEW SCOPE';
type ContactVisibility = 'REGISTRY_FORM' | 'WEBSITE_ONLY' | 'PUBLIC_EMAIL' | 'PRIVATE';
type AuthorityRole =
  | 'Founder'
  | 'Author'
  | 'Current steward'
  | 'Organization representative'
  | 'Legal representative'
  | 'Authorized submitter'
  | 'Contributor'
  | 'Third-party claimant'
  | 'Other';
type ReviewPathway =
  | ''
  | 'Record-only registration'
  | 'Administrative completeness review'
  | 'Identity and authority review'
  | 'Evidence review'
  | 'Independent governance review'
  | 'Partner Review Network review'
  | 'Public dispute resolution pathway';
type EvidenceRelationship =
  | 'Identity'
  | 'Establishment date'
  | 'Authorship'
  | 'Governance claim'
  | 'Technical architecture'
  | 'Public disclosure'
  | 'Ownership or licensing'
  | 'Demonstration'
  | 'Independent review'
  | 'Regulatory mapping'
  | 'Other';
type EvidenceCategory =
  | 'Founding declaration'
  | 'Governance specification'
  | 'Claims evidence'
  | 'Limitations / non-claims'
  | 'Publication'
  | 'Repository export'
  | 'Demonstration record'
  | 'Standards or regulatory mapping'
  | 'Ownership or licensing record'
  | 'Other supporting evidence';

type EvidenceFile = {
  id: string;
  file: File;
  category: EvidenceCategory;
  description: string;
  visibility: Visibility;
  relationship: EvidenceRelationship;
  sha256: string;
  provenanceStatus: ProvenanceStatus;
};

type PreservedEvidence = {
  id: string;
  submission_id: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  sha256_hex: string;
  evidence_relationship: string;
  evidence_classification: string | null;
  description: string;
  visibility: 'public' | 'private' | 'selective';
  evidence_state: string;
  submitted_at: string;
  storage_bucket: string | null;
  storage_path: string | null;
  provenance_status?: ProvenanceStatus | null;
};

type PublicationRecord = {
  id: string;
  publicationType: string;
  title: string;
  authors: string;
  publisherOrPlatform: string;
  publicationDate: string;
  url: string;
  doi: string;
  isbn: string;
  citationText: string;
  description: string;
  relationshipToGovernance: string;
  visibility: Visibility;
  provenanceStatus: ProvenanceStatus;
};

type RepositoryRecord = {
  id: string;
  provider: 'GitHub' | 'GitLab' | 'Bitbucket' | 'Codeberg' | 'Other';
  repositoryName: string;
  repositoryOwner: string;
  repositoryUrl: string;
  defaultBranch: string;
  releaseOrTag: string;
  commitSha: string;
  license: string;
  accessState: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';
  description: string;
  relationshipToGovernance: string;
  provenanceStatus: ProvenanceStatus;
};

type ZenodoRecord = {
  id: string;
  title: string;
  recordUrl: string;
  doi: string;
  conceptDoi: string;
  zenodoRecordId: string;
  version: string;
  publicationDate: string;
  creators: string;
  resourceType: string;
  description: string;
  relationshipToGovernance: string;
  visibility: Visibility;
  provenanceStatus: ProvenanceStatus;
};

type PatentRecord = {
  id: string;
  title: string;
  jurisdiction: string;
  filingType: string;
  applicationStatus: string;
  applicationNumber: string;
  publicationNumber: string;
  patentNumber: string;
  filingDate: string;
  publicationDate: string;
  grantDate: string;
  priorityDate: string;
  inventors: string;
  applicantOrAssignee: string;
  officialUrl: string;
  description: string;
  relationshipToGovernance: string;
  convertedFromId: string;
  continuationOfId: string;
  visibility: Visibility;
};

type FormState = {
  governanceName: string;
  shortName: string;
  currentVersion: string;
  effectiveVersionDate: string;
  establishmentDate: string;
  governanceCategory: string;
  claimantName: string;
  claimantType: string;
  authorityRole: AuthorityRole;
  authorityEvidence: string;
  stewardName: string;
  organization: string;
  contactEmail: string;
  website: string;
  publicEvidenceRoute: string;
  jurisdiction: string;
  regulatoryScope: string;
  plainDescription: string;
  claims: string;
  nonClaims: string;
  limitations: string;
  ownershipDeclaration: string;
  license: string;
  recordVisibility: Visibility;
  contactVisibility: ContactVisibility;
  allowReviewRequests: boolean;
  allowCollaboration: boolean;
  allowDisputeNotices: boolean;
  disputes: string;
  reviewPathway: ReviewPathway;
  publicContact: boolean;
  authorityConfirmed: boolean;
  accuracyConfirmed: boolean;
  boundaryConfirmed: boolean;
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_TOTAL_SIZE = 250 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [
  'pdf','doc','docx','txt','md','csv','json','xls','xlsx','ppt','pptx','png','jpg','jpeg','webp','zip',
];

const provenanceStatuses: ProvenanceStatus[] = [
  '', 'REGISTRANT-PRODUCED', 'TA14-PRODUCED', 'INDEPENDENTLY PRODUCED',
  'INDEPENDENTLY REPRODUCED', 'PUBLIC-SOURCE', 'CROSS-PARTY',
  'NOT INDEPENDENTLY ESTABLISHED', 'NOT REPORTED', 'NOT SUBMITTED',
  'NOT PRESERVED', 'OUTSIDE REVIEW SCOPE',
];

const evidenceCategories: EvidenceCategory[] = [
  'Founding declaration','Governance specification','Claims evidence','Limitations / non-claims',
  'Publication','Repository export','Demonstration record','Standards or regulatory mapping',
  'Ownership or licensing record','Other supporting evidence',
];

const evidenceRelationships: EvidenceRelationship[] = [
  'Identity','Establishment date','Authorship','Governance claim','Technical architecture',
  'Public disclosure','Ownership or licensing','Demonstration','Independent review',
  'Regulatory mapping','Other',
];

const DRAFT_KEY = 'ta14-ai-governance-registry-intake-draft-v3';
const RECOVERY_KEY = 'ta14-ai-governance-registry-recovery-key-v1';

const wizardSteps = [
  { number: '01', title: 'Governance Identity', short: 'Identity' },
  { number: '02', title: 'Founder & Authority', short: 'Authority' },
  { number: '03', title: 'Stewardship', short: 'Stewardship' },
  { number: '04', title: 'Governance Description', short: 'Description' },
  { number: '05', title: 'Claims', short: 'Claims' },
  { number: '06', title: 'Non-Claims', short: 'Non-Claims' },
  { number: '07', title: 'Scope & Jurisdiction', short: 'Scope' },
  { number: '08', title: 'Evidence Package', short: 'Evidence' },
  { number: '09', title: 'Publications', short: 'Publications' },
  { number: '10', title: 'Repositories & Deposits', short: 'Repositories' },
  { number: '11', title: 'Patents & Rights', short: 'Rights' },
  { number: '12', title: 'Review Pathway', short: 'Review' },
  { number: '13', title: 'Declarations', short: 'Declarations' },
  { number: '14', title: 'Preview & Receipt', short: 'Preview' },
] as const;

function safeId() {
  try { if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID(); } catch {}
  return `ta14-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function asArray<T>(value: unknown): T[] { return Array.isArray(value) ? (value as T[]) : []; }
function createPublication(): PublicationRecord { return { id:safeId(),publicationType:'Article',title:'',authors:'',publisherOrPlatform:'',publicationDate:'',url:'',doi:'',isbn:'',citationText:'',description:'',relationshipToGovernance:'',visibility:'PUBLIC',provenanceStatus:'' }; }
function createRepository(): RepositoryRecord { return { id:safeId(),provider:'GitHub',repositoryName:'',repositoryOwner:'',repositoryUrl:'',defaultBranch:'',releaseOrTag:'',commitSha:'',license:'',accessState:'PUBLIC',description:'',relationshipToGovernance:'',provenanceStatus:'' }; }
function createZenodo(): ZenodoRecord { return { id:safeId(),title:'',recordUrl:'',doi:'',conceptDoi:'',zenodoRecordId:'',version:'',publicationDate:'',creators:'',resourceType:'',description:'',relationshipToGovernance:'',visibility:'PUBLIC',provenanceStatus:'' }; }
function createPatent(): PatentRecord { return { id:safeId(),title:'',jurisdiction:'United States',filingType:'Provisional application',applicationStatus:'Filed',applicationNumber:'',publicationNumber:'',patentNumber:'',filingDate:'',publicationDate:'',grantDate:'',priorityDate:'',inventors:'',applicantOrAssignee:'',officialUrl:'',description:'',relationshipToGovernance:'',convertedFromId:'',continuationOfId:'',visibility:'PUBLIC' }; }

async function sha256File(file: File) {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(digest)).map((value) => value.toString(16).padStart(2, '0')).join('');
}

const initialForm: FormState = {
  governanceName:'',shortName:'',currentVersion:'',effectiveVersionDate:'',establishmentDate:'',governanceCategory:'',claimantName:'',claimantType:'Individual founder or author',authorityRole:'Founder',authorityEvidence:'',stewardName:'',organization:'',contactEmail:'',website:'',publicEvidenceRoute:'',jurisdiction:'',regulatoryScope:'',plainDescription:'',claims:'',nonClaims:'',limitations:'',ownershipDeclaration:'',license:'',recordVisibility:'PUBLIC',contactVisibility:'REGISTRY_FORM',allowReviewRequests:true,allowCollaboration:true,allowDisputeNotices:true,disputes:'',reviewPathway:'',publicContact:false,authorityConfirmed:false,accuracyConfirmed:false,boundaryConfirmed:false,
};

function bytesToSize(bytes: number) { if (bytes === 0) return '0 bytes'; const units=['bytes','KB','MB','GB']; const index=Math.floor(Math.log(bytes)/Math.log(1024)); return `${(bytes/1024**index).toFixed(index===0?0:1)} ${units[index]}`; }
function fileExtension(name: string) { const pieces=name.toLowerCase().split('.'); return pieces.length>1?pieces.pop()??'':''; }

export default function RegisterGovernancePage() {
  const fileInputRef=useRef<HTMLInputElement>(null);
  const registrationStartedRecordedRef=useRef(false);
  const lifecycleSessionKeyRef=useRef<string|null>(null);
  const [form,setForm]=useState<FormState>(initialForm);
  const [files,setFiles]=useState<EvidenceFile[]>([]);
  const [dragActive,setDragActive]=useState(false);
  const [message,setMessage]=useState('');
  const [errors,setErrors]=useState<string[]>([]);
  const [publications,setPublications]=useState<PublicationRecord[]>([]);
  const [repositories,setRepositories]=useState<RepositoryRecord[]>([]);
  const [zenodoRecords,setZenodoRecords]=useState<ZenodoRecord[]>([]);
  const [patentRecords,setPatentRecords]=useState<PatentRecord[]>([]);
  const [draftId,setDraftId]=useState<string|null>(null);
  const [draftBusy,setDraftBusy]=useState(false);
  const [persistenceState,setPersistenceState]=useState<'CHECKING'|'NONE'|'BROWSER_ONLY'|'ACCOUNT_BACKED'|'SUBMITTED'|'REGISTERED'|'ERROR'>('CHECKING');
  const [preservedEvidence,setPreservedEvidence]=useState<PreservedEvidence[]>([]);
  const [evidenceBusyId,setEvidenceBusyId]=useState<string|null>(null);
  const [evidenceListBusy,setEvidenceListBusy]=useState(false);
  const [activeStep,setActiveStep]=useState(0);
  const [previewOpen,setPreviewOpen]=useState(true);
  const [receiptGenerated,setReceiptGenerated]=useState(false);
  const [submitBusy,setSubmitBusy]=useState(false);
  const [submittedRecord,setSubmittedRecord]=useState<{id:string;status:string;submitted_at:string|null;registryIdentifier?:string|null;registeredAt?:string|null;pendingReview?:boolean}|null>(null);
  const [termsAccepted,setTermsAccepted]=useState(false);
  const [termsBusy,setTermsBusy]=useState(false);

  const gateInput = useMemo(() => ({
    governanceName: form.governanceName,
    currentVersion: form.currentVersion,
    claimantName: form.claimantName,
    authorityRole: form.authorityRole,
    authorityConfirmed: form.authorityConfirmed,
    stewardName: form.stewardName || form.claimantName,
    contactEmail: form.contactEmail,
    plainDescription: form.plainDescription,
    claims: form.claims,
    accuracyConfirmed: form.accuracyConfirmed,
    boundaryConfirmed: form.boundaryConfirmed,
    termsAccepted,
  }), [form, termsAccepted]);

  const completion = useMemo(() => registryRequiredCompletion(gateInput), [gateInput]);
  const requiredCompletion = completion.percent;
  const missingRequired = completion.missing;

  function getRecoveryKey(){ let key=window.localStorage.getItem(RECOVERY_KEY)?.trim()??''; if(!key){ key=globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random().toString(36).slice(2)}`; window.localStorage.setItem(RECOVERY_KEY,key);} return key; }
  function buildRecoveryPayload(stepOverride?:number){ return { recoveryKey:getRecoveryKey(),activeStep:stepOverride??activeStep,form:{...form,stewardName:form.stewardName.trim()||form.claimantName.trim()},publications,repositories,zenodoRecords,patentRecords }; }
  function hasMeaningfulRecoveryData(){ return Boolean(form.governanceName.trim()||form.currentVersion.trim()||form.claimantName.trim()||form.contactEmail.trim()||form.plainDescription.trim()||form.claims.trim()||form.nonClaims.trim()||publications.length||repositories.length||zenodoRecords.length||patentRecords.length); }

  async function saveRecoveryDraft(stepOverride?:number):Promise<boolean>{
    if(!hasMeaningfulRecoveryData()) return true;
    const recoveryPayload={savedAt:new Date().toISOString(),...buildRecoveryPayload(stepOverride)};
    try{window.localStorage.setItem(DRAFT_KEY,JSON.stringify(recoveryPayload));}catch{}
    try{
      const response=await fetch('/api/ai-governance/registry/registration-recovery',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(recoveryPayload)});
      const payload=await response.json(); if(!response.ok) throw new Error(payload.error??'Unable to preserve registration recovery state.'); return true;
    }catch(error){setPersistenceState('BROWSER_ONLY');setErrors([error instanceof Error?error.message:'Unable to preserve registration recovery state.']);setMessage('This step remains in browser recovery only. It was NOT advanced because the account-backed recovery copy could not be confirmed.');return false;}
  }

  async function promoteRecoveryDraft(submissionId:string){ try{await fetch('/api/ai-governance/registry/registration-recovery',{method:'PATCH',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({recoveryKey:getRecoveryKey(),submissionId,state:'promoted'})});}catch{} }

  async function recordLifecycleEvent(eventType:'registration_page_opened'|'registration_started'|'draft_saved'|'registration_failed',payload?:Record<string,unknown>,submissionIdOverride?:string|null){
    try{
      if(!lifecycleSessionKeyRef.current){const existing=window.sessionStorage.getItem('ta14.registry.registration.lifecycle.session.v1');const next=existing||(globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random().toString(36).slice(2)}`);lifecycleSessionKeyRef.current=next;if(!existing)window.sessionStorage.setItem('ta14.registry.registration.lifecycle.session.v1',next);}
      await fetch('/api/ai-governance/registry/lifecycle-events',{method:'POST',credentials:'same-origin',cache:'no-store',keepalive:true,headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({eventType,source:'web',sessionKey:lifecycleSessionKeyRef.current,submissionId:submissionIdOverride??draftId,governanceName:form.governanceName.trim()||null,organizationName:form.organization.trim()||null,contactEmail:form.contactEmail.trim()||null,eventPayload:{active_step:activeStep,persistence_state:persistenceState,...payload}})});
    }catch{}
  }

  useEffect(()=>{void recordLifecycleEvent('registration_page_opened',{route:'/workspace/ai-governance/registry/register'});},[]);
  const totalSize=useMemo(()=>files.reduce((total,item)=>total+item.file.size,0),[files]);

  function updateField<K extends keyof FormState>(key:K,value:FormState[K]){setForm((current)=>({...current,[key]:value}));setMessage('');if(!registrationStartedRecordedRef.current){const meaningfulValue=typeof value==='string'?value.trim().length>0:Boolean(value);if(meaningfulValue){registrationStartedRecordedRef.current=true;void recordLifecycleEvent('registration_started',{first_field:String(key)});}}}

  async function addFiles(incoming:File[]){const nextErrors:string[]=[];const currentKeys=new Set(files.map((item)=>`${item.file.name}:${item.file.size}:${item.file.lastModified}`));const accepted:EvidenceFile[]=[];let prospectiveTotal=totalSize;for(const file of incoming){const extension=fileExtension(file.name);const key=`${file.name}:${file.size}:${file.lastModified}`;if(!ACCEPTED_EXTENSIONS.includes(extension)){nextErrors.push(`${file.name}: unsupported file type.`);continue;}if(file.size>MAX_FILE_SIZE){nextErrors.push(`${file.name}: exceeds the 50 MB individual file limit.`);continue;}if(currentKeys.has(key)){nextErrors.push(`${file.name}: duplicate file was not added.`);continue;}if(prospectiveTotal+file.size>MAX_TOTAL_SIZE){nextErrors.push(`${file.name}: would exceed the 250 MB evidence-package limit.`);continue;}currentKeys.add(key);prospectiveTotal+=file.size;accepted.push({id:safeId(),file,category:'Other supporting evidence',description:'',visibility:form.recordVisibility,relationship:'Other',provenanceStatus:'',sha256:await sha256File(file)});}setFiles((current)=>[...current,...accepted]);setErrors(nextErrors);if(accepted.length>0)setMessage(`${accepted.length} evidence file${accepted.length===1?'':'s'} added.`);}
  function handleFileChange(event:ChangeEvent<HTMLInputElement>){addFiles(Array.from(event.target.files??[]));event.target.value='';}
  function handleDrop(event:DragEvent<HTMLDivElement>){event.preventDefault();setDragActive(false);addFiles(Array.from(event.dataTransfer.files));}
  function updateEvidence(id:string,changes:Partial<Pick<EvidenceFile,'category'|'description'|'visibility'|'relationship'|'provenanceStatus'>>){setFiles((current)=>current.map((item)=>item.id===id?{...item,...changes}:item));}
  function removeEvidence(id:string){setFiles((current)=>current.filter((item)=>item.id!==id));setMessage('Evidence file removed from this intake package.');}
  async function readApiPayload(response:Response):Promise<any>{const contentType=response.headers.get('content-type')??'';const raw=await response.text();if(!raw)return{};if(contentType.includes('application/json')){try{return JSON.parse(raw);}catch{throw new Error(`Registry API returned invalid JSON (${response.status}).`);}}try{return JSON.parse(raw);}catch{return{error:raw.slice(0,500)||`Registry API request failed (${response.status}).`};}}
  async function fetchPreservedEvidence(submissionId:string):Promise<PreservedEvidence[]>{const response=await fetch(`/api/ai-governance/registry/evidence?submissionId=${encodeURIComponent(submissionId)}`,{method:'GET',cache:'no-store'});const payload=await readApiPayload(response);if(!response.ok)throw new Error(payload.error??'Unable to load preserved evidence.');return asArray<PreservedEvidence>(payload.evidence);}
  async function loadPreservedEvidence(submissionId:string){setEvidenceListBusy(true);try{setPreservedEvidence(await fetchPreservedEvidence(submissionId));}catch(error){setErrors((current)=>[...current,error instanceof Error?error.message:'Unable to load preserved evidence.']);}finally{setEvidenceListBusy(false);}}

  async function preserveEvidence(item:EvidenceFile){if(!draftId){setErrors(['Save the Registry intake as a private draft before preserving evidence files.']);document.querySelector('.progress-panel')?.scrollIntoView({behavior:'smooth'});return;}if(!item.description.trim()){setErrors([`${item.file.name}: describe what this file supports before preserving it.`]);return;}if(!item.provenanceStatus){setErrors([`${item.file.name}: select a provenance status before preserving it.`]);return;}setEvidenceBusyId(item.id);setErrors([]);try{const body=new FormData();body.append('file',item.file);body.append('submissionId',draftId);body.append('evidenceRelationship',item.relationship);body.append('evidenceClassification',item.category);body.append('description',item.description.trim());body.append('provenanceStatus',item.provenanceStatus);body.append('visibility',item.visibility==='PUBLIC'?'public':item.visibility==='CONTROLLED'?'selective':'private');const response=await fetch('/api/ai-governance/registry/evidence',{method:'POST',body});const payload=await readApiPayload(response);if(!response.ok)throw new Error(payload.error??'Unable to preserve evidence.');setPreservedEvidence((current)=>[...current,payload.evidence]);setFiles((current)=>current.filter((candidate)=>candidate.id!==item.id));setMessage(`${item.file.name} is preserved, hashed, private by policy, and bound to this Registry draft.`);}catch(error){setErrors([error instanceof Error?error.message:`Unable to preserve ${item.file.name}.`]);}finally{setEvidenceBusyId(null);}}

  async function preserveEvidenceForSubmission(item:EvidenceFile,submissionId:string){if(!item.description.trim())throw new Error(`${item.file.name}: describe what this file supports before preserving it.`);if(!item.provenanceStatus)throw new Error(`${item.file.name}: select a provenance status before preserving it.`);const body=new FormData();body.append('file',item.file);body.append('submissionId',submissionId);body.append('evidenceRelationship',item.relationship);body.append('evidenceClassification',item.category);body.append('description',item.description.trim());body.append('provenanceStatus',item.provenanceStatus);body.append('visibility',item.visibility==='PUBLIC'?'public':item.visibility==='CONTROLLED'?'selective':'private');const response=await fetch('/api/ai-governance/registry/evidence',{method:'POST',body});const payload=await readApiPayload(response);if(!response.ok)throw new Error(payload.error??`Unable to preserve ${item.file.name}.`);return payload.evidence as PreservedEvidence;}
  async function deletePreservedEvidence(id:string){setEvidenceBusyId(id);setErrors([]);try{const response=await fetch(`/api/ai-governance/registry/evidence?id=${encodeURIComponent(id)}`,{method:'DELETE'});const payload=await response.json();if(!response.ok)throw new Error(payload.error??'Unable to delete evidence.');setPreservedEvidence((current)=>current.filter((item)=>item.id!==id));setMessage('The preserved evidence object and its draft metadata were deleted.');}catch(error){setErrors([error instanceof Error?error.message:'Unable to delete evidence.']);}finally{setEvidenceBusyId(null);}}

  function updatePublication(id:string,changes:Partial<PublicationRecord>){setPublications((current)=>current.map((item)=>item.id===id?{...item,...changes}:item));}
  function updateRepository(id:string,changes:Partial<RepositoryRecord>){setRepositories((current)=>current.map((item)=>item.id===id?{...item,...changes}:item));}
  function updateZenodo(id:string,changes:Partial<ZenodoRecord>){setZenodoRecords((current)=>current.map((item)=>item.id===id?{...item,...changes}:item));}
  function updatePatent(id:string,changes:Partial<PatentRecord>){setPatentRecords((current)=>current.map((item)=>item.id===id?{...item,...changes}:item));}

  function hydrateFromServerDraft(draft:any){const submission=draft.submission??{};setDraftId(submission.id??null);setForm({...initialForm,governanceName:submission.governance_name??'',shortName:submission.short_name??'',currentVersion:submission.current_version??'',effectiveVersionDate:submission.effective_version_date??'',establishmentDate:submission.claimed_establishment_date??'',governanceCategory:submission.governance_category??'',claimantName:submission.claimant_name??'',claimantType:submission.claimant_type??initialForm.claimantType,authorityRole:submission.submitter_authority_role??initialForm.authorityRole,authorityEvidence:submission.authority_basis??'',stewardName:submission.current_steward??'',organization:submission.organization_name??'',contactEmail:submission.contact_email??'',website:submission.public_website??'',publicEvidenceRoute:submission.public_evidence_route??'',jurisdiction:submission.geographic_scope??'',regulatoryScope:submission.regulatory_scope??'',plainDescription:submission.plain_language_description??'',claims:submission.formal_claims??'',nonClaims:submission.explicit_non_claims??'',limitations:submission.known_limitations??'',ownershipDeclaration:submission.ownership_declaration??'',license:submission.license_statement??'',recordVisibility:submission.record_visibility==='public'?'PUBLIC':submission.record_visibility==='selective'?'CONTROLLED':'PRIVATE',contactVisibility:submission.public_contact_mode==='public_email'?'PUBLIC_EMAIL':submission.public_contact_mode==='website_only'?'WEBSITE_ONLY':submission.public_contact_mode==='private'?'PRIVATE':'REGISTRY_FORM',allowReviewRequests:Boolean(submission.allow_review_requests),allowCollaboration:Boolean(submission.allow_collaboration_inquiries),allowDisputeNotices:Boolean(submission.allow_dispute_notices),disputes:submission.known_disputes??'',reviewPathway:submission.requested_review_pathway??initialForm.reviewPathway,publicContact:submission.public_contact_mode!=='private',authorityConfirmed:Boolean(submission.authority_declaration_accepted),accuracyConfirmed:Boolean(submission.accuracy_declaration_accepted),boundaryConfirmed:Boolean(submission.registry_boundary_accepted)});
    setPublications(asArray<any>(draft.publications).map((item:any)=>({id:item.id??safeId(),publicationType:item.publication_type??'Article',title:item.title??'',authors:item.authors??'',publisherOrPlatform:item.publisher_or_platform??'',publicationDate:item.publication_date??'',url:item.url??'',doi:item.doi??'',isbn:item.isbn??'',citationText:item.citation_text??'',description:item.abstract_or_description??'',relationshipToGovernance:item.relationship_to_governance??'',provenanceStatus:item.provenance_status??'',visibility:item.visibility==='public'?'PUBLIC':item.visibility==='selective'?'CONTROLLED':'PRIVATE'})));
    setRepositories(asArray<any>(draft.repositories).map((item:any)=>({id:item.id??safeId(),provider:(item.provider?item.provider.charAt(0).toUpperCase()+item.provider.slice(1):'GitHub') as RepositoryRecord['provider'],repositoryName:item.repository_name??'',repositoryOwner:item.repository_owner??'',repositoryUrl:item.repository_url??'',defaultBranch:item.default_branch??'',releaseOrTag:item.release_or_tag??'',commitSha:item.commit_sha??'',license:item.license??'',accessState:(item.access_state??'public').toUpperCase() as RepositoryRecord['accessState'],description:item.description??'',relationshipToGovernance:item.relationship_to_governance??'',provenanceStatus:item.provenance_status??''})));
    setZenodoRecords(asArray<any>(draft.zenodoRecords).map((item:any)=>({id:item.id??safeId(),title:item.title??'',recordUrl:item.record_url??'',doi:item.doi??'',conceptDoi:item.concept_doi??'',zenodoRecordId:item.zenodo_record_id??'',version:item.version??'',publicationDate:item.publication_date??'',creators:item.creators??'',resourceType:item.resource_type??'',description:item.description??'',relationshipToGovernance:item.relationship_to_governance??'',provenanceStatus:item.provenance_status??'',visibility:item.visibility==='public'?'PUBLIC':item.visibility==='selective'?'CONTROLLED':'PRIVATE'})));
    setPatentRecords(asArray<any>(draft.patentRecords).map((item:any)=>({id:item.id??safeId(),title:item.title??'',jurisdiction:item.jurisdiction??'',filingType:item.filing_type??'',applicationStatus:item.application_status??'',applicationNumber:item.application_number??'',publicationNumber:item.publication_number??'',patentNumber:item.patent_number??'',filingDate:item.filing_date??'',publicationDate:item.publication_date??'',grantDate:item.grant_date??'',priorityDate:item.priority_date??'',inventors:item.inventors??'',applicantOrAssignee:item.applicant_or_assignee??'',officialUrl:item.official_url??'',description:item.description??'',relationshipToGovernance:item.relationship_to_governance??'',convertedFromId:'',continuationOfId:'',visibility:item.visibility==='public'?'PUBLIC':item.visibility==='selective'?'CONTROLLED':'PRIVATE'})));
  }

  useEffect(()=>{let cancelled=false;async function resumeDraft(){const searchParams=new URLSearchParams(window.location.search);const requestedDraftId=searchParams.get('draft')?.trim()??'';const forceNew=searchParams.get('new')==='1';if(forceNew){try{window.localStorage.removeItem(DRAFT_KEY);window.localStorage.removeItem(RECOVERY_KEY);}catch{}if(!cancelled){setDraftId(null);setPersistenceState('NONE');setForm(initialForm);setFiles([]);setPreservedEvidence([]);setPublications([]);setRepositories([]);setZenodoRecords([]);setPatentRecords([]);setMessage('New Registry intake started. Existing account-backed drafts remain preserved and unchanged.');}return;}try{const endpoint=requestedDraftId?`/api/ai-governance/registry/drafts?id=${encodeURIComponent(requestedDraftId)}`:'/api/ai-governance/registry/drafts';const response=await fetch(endpoint,{method:'GET',cache:'no-store'});if(response.ok){const payload=await response.json();if(!cancelled&&payload.draft){hydrateFromServerDraft(payload.draft);setPersistenceState('ACCOUNT_BACKED');if(payload.draft.submission?.id)await loadPreservedEvidence(payload.draft.submission.id);setMessage(requestedDraftId?'The selected private Registry draft was resumed from your signed-in account.':'Private Registry draft resumed from your signed-in account, including preserved evidence metadata.');return;}if(requestedDraftId&&!cancelled){setPersistenceState('NONE');setErrors(['The selected draft is unavailable, is no longer a draft, or does not belong to this signed-in account.']);setMessage('No Registry record was changed. Return to My Registry Records and select an available draft.');return;}}}catch{if(requestedDraftId&&!cancelled){setPersistenceState('NONE');setErrors(['The selected Registry draft could not be loaded.']);setMessage('No Registry record was changed. Return to My Registry Records and try again.');return;}}
    try{const recoveryResponse=await fetch('/api/ai-governance/registry/registration-recovery',{method:'GET',credentials:'same-origin',cache:'no-store'});if(recoveryResponse.ok){const recovery=await recoveryResponse.json();if(!cancelled&&recovery.recovery?.draft_payload){const savedPayload=recovery.recovery.draft_payload as {form?:FormState;publications?:PublicationRecord[];repositories?:RepositoryRecord[];zenodoRecords?:ZenodoRecord[];patentRecords?:PatentRecord[];activeStep?:number;recoveryKey?:string};if(savedPayload.recoveryKey)window.localStorage.setItem(RECOVERY_KEY,savedPayload.recoveryKey);if(savedPayload.form){setForm({...initialForm,...savedPayload.form});setPublications(asArray<PublicationRecord>(savedPayload.publications));setRepositories(asArray<RepositoryRecord>(savedPayload.repositories));setZenodoRecords(asArray<ZenodoRecord>(savedPayload.zenodoRecords));setPatentRecords(asArray<PatentRecord>(savedPayload.patentRecords));setActiveStep(Math.max(0,Math.min(wizardSteps.length-1,Number(savedPayload.activeStep??0))));setPersistenceState('BROWSER_ONLY');setMessage('Your interrupted registration was recovered from your signed-in account. Continue where you left off; it is preserved as recovery state but is NOT yet a Registry submission.');return;}}}}catch{}
    let saved:string|null=null;try{saved=window.localStorage.getItem(DRAFT_KEY);}catch{return;}if(!saved||cancelled){if(!cancelled)setPersistenceState('NONE');return;}try{const parsed=JSON.parse(saved) as {form?:FormState;publications?:PublicationRecord[];repositories?:RepositoryRecord[];zenodoRecords?:ZenodoRecord[];patentRecords?:PatentRecord[];activeStep?:number;recoveryKey?:string};if(parsed.form){setForm({...initialForm,...parsed.form});setPublications(asArray<PublicationRecord>(parsed.publications));setRepositories(asArray<RepositoryRecord>(parsed.repositories));setZenodoRecords(asArray<ZenodoRecord>(parsed.zenodoRecords));setPatentRecords(asArray<PatentRecord>(parsed.patentRecords));setActiveStep(Math.max(0,Math.min(wizardSteps.length-1,Number(parsed.activeStep??0))));if(parsed.recoveryKey)window.localStorage.setItem(RECOVERY_KEY,parsed.recoveryKey);setPersistenceState('BROWSER_ONLY');setMessage('Your prior browser recovery draft was recovered. TA-14 will preserve it to your signed-in account before you advance. It is NOT yet a Registry submission. Evidence files must be reattached.');void fetch('/api/ai-governance/registry/registration-recovery',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({savedAt:new Date().toISOString(),recoveryKey:parsed.recoveryKey??getRecoveryKey(),activeStep:parsed.activeStep??0,form:{...initialForm,...parsed.form},publications:asArray<PublicationRecord>(parsed.publications),repositories:asArray<RepositoryRecord>(parsed.repositories),zenodoRecords:asArray<ZenodoRecord>(parsed.zenodoRecords),patentRecords:asArray<PatentRecord>(parsed.patentRecords)})});}}catch{window.localStorage.removeItem(DRAFT_KEY);}}
    resumeDraft();return()=>{cancelled=true;};},[]);

  async function saveDraft():Promise<string|null>{setDraftBusy(true);setErrors([]);const recoveryPayload={savedAt:new Date().toISOString(),recoveryKey:getRecoveryKey(),activeStep,form:{...form,stewardName:form.stewardName.trim()||form.claimantName.trim()},publications,repositories,zenodoRecords,patentRecords};window.localStorage.setItem(DRAFT_KEY,JSON.stringify(recoveryPayload));try{const response=await fetch('/api/ai-governance/registry/drafts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:draftId??undefined,form:{...form,stewardName:form.stewardName.trim()||form.claimantName.trim()},publications,repositories,zenodoRecords,patentRecords})});const payload=await response.json();if(!response.ok)throw new Error(payload.error??'Unable to save the Registry draft.');setDraftId(payload.draftId);setPersistenceState('ACCOUNT_BACKED');await promoteRecoveryDraft(payload.draftId);await loadPreservedEvidence(payload.draftId);setMessage(`Saved to TA-14 Registry account. Governed draft ID: ${payload.draftId}. Evidence files may now be preserved and bound to this draft.`);void recordLifecycleEvent('draft_saved',{draft_id:payload.draftId},payload.draftId);return payload.draftId as string;}catch(error){setPersistenceState('BROWSER_ONLY');setErrors([error instanceof Error?error.message:'Unable to save the Registry draft.']);setMessage('Browser recovery only — NOT saved to the TA-14 Registry. Do not treat this intake as submitted or governed until an account-backed draft ID is confirmed.');return null;}finally{setDraftBusy(false);}}

  function validate(){const nextErrors=registryWizardValidationErrors(gateInput);const undocumented=files.filter((item)=>!item.description.trim());if(undocumented.length>0)nextErrors.push('Every evidence file you choose to submit requires a short description.');const unprovenanced=files.filter((item)=>!item.provenanceStatus);if(unprovenanced.length>0)nextErrors.push('Every evidence file you choose to submit requires a provenance status.');setErrors(nextErrors);return nextErrors.length===0;}

  async function submitForReview(){if(!validate()){setMessage('The intake is not ready for submission. Resolve the required items first.');return;}setSubmitBusy(true);setErrors([]);setMessage('');try{const submissionId=await saveDraft();if(!submissionId)throw new Error('Submission stopped because the current intake could not be confirmed as an account-backed TA-14 Registry draft.');if(files.length>0){const uploaded:PreservedEvidence[]=[];for(const item of files){setEvidenceBusyId(item.id);uploaded.push(await preserveEvidenceForSubmission(item,submissionId));}setPreservedEvidence((current)=>[...current,...uploaded]);setFiles([]);setEvidenceBusyId(null);}setTermsBusy(true);const termsResponse=await fetch('/api/terms/accept',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({submissionId,termsCode:'TA14-RET-001',termsVersion:'1.1',acceptanceMethod:'explicit_checkbox',accepted:true})});const termsPayload=await termsResponse.json();if(!termsResponse.ok)throw new Error(termsPayload.error??'Unable to preserve Registry Terms acceptance.');setTermsBusy(false);const response=await fetch('/api/ai-governance/registry/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({submissionId})});const payload=await response.json();if(!response.ok){const details=Array.isArray(payload.details)?` ${payload.details.join(' ')}`:'';throw new Error(`${payload.error??'Unable to submit the Registry intake.'}${details}`);}window.localStorage.removeItem(DRAFT_KEY);if(payload.registration?.registryIdentifier){const finalized={id:payload.registration.submissionId??submissionId,status:'registered',submitted_at:payload.registration.registeredAt??null,registryIdentifier:payload.registration.registryIdentifier,registeredAt:payload.registration.registeredAt??null,pendingReview:false};setSubmittedRecord(finalized);setPersistenceState('REGISTERED');setMessage(`${payload.notice??'AUTHORITATIVE REGISTRATION COMPLETE.'} Permanent Registry Identifier: ${payload.registration.registryIdentifier}. This is the only state that constitutes completed TA-14 Governance Entity Registration.`);window.location.assign(`/workspace/ai-governance/registry/records/${encodeURIComponent(payload.registration.registryIdentifier)}`);return;}if(payload.submission?.id){const pending={id:payload.submission.id,status:payload.submission.status??'submitted',submitted_at:payload.submission.submitted_at??null,registryIdentifier:payload.submission.registry_identifier??null,registeredAt:payload.submission.accepted_at??null,pendingReview:Boolean(payload.pendingReview)};setSubmittedRecord(pending);setPersistenceState('SUBMITTED');setMessage(payload.notice??'Registry intake submitted for review. NOT REGISTERED. The submission is awaiting the selected review pathway and no permanent Registry Identifier has been issued.');window.location.assign('/workspace/ai-governance/registry/my-records');return;}throw new Error('The Registry accepted the request but did not return a submission or registration record.');}catch(error){const failureMessage=error instanceof Error?error.message:'Unable to submit the Registry intake for review.';setErrors([failureMessage]);void recordLifecycleEvent('registration_failed',{failure_message:failureMessage,phase:'submission'},draftId);}finally{setEvidenceBusyId(null);setTermsBusy(false);setSubmitBusy(false);}}

  async function discardDraft(){setDraftBusy(true);setErrors([]);try{if(draftId){const response=await fetch(`/api/ai-governance/registry/drafts?id=${encodeURIComponent(draftId)}`,{method:'DELETE'});const payload=await response.json();if(!response.ok)throw new Error(payload.error??'Unable to delete the Registry draft.');}window.localStorage.removeItem(DRAFT_KEY);setDraftId(null);setPersistenceState('NONE');setForm(initialForm);setFiles([]);setPreservedEvidence([]);setPublications([]);setRepositories([]);setZenodoRecords([]);setPatentRecords([]);setMessage('Private Registry draft discarded.');}catch(error){setErrors([error instanceof Error?error.message:'Unable to discard the Registry draft.']);}finally{setDraftBusy(false);}}

  function reviewMissingItems(){const valid=validate();if(valid){setMessage('All required Registry intake fields are complete.');return;}window.setTimeout(()=>{const target=document.querySelector<HTMLElement>('[data-required-incomplete="true"]');target?.scrollIntoView({behavior:'smooth',block:'center'});target?.querySelector<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>('input, textarea, select')?.focus();},0);}

  function buildManifest(confirmedDraftId?:string|null){return{schema:'TA-14-AI-GOVERNANCE-REGISTRY-INTAKE',schemaVersion:'1.0',generatedAt:new Date().toISOString(),registryBoundary:'This intake package records a declaration and optional supporting evidence. It is not certification, legal validation, regulatory approval, technical verification, or an ownership determination.',registration:{...form,reviewPathway:form.reviewPathway||'Record-only registration'},registryTermsAcceptance:{termsCode:'TA14-RET-001',termsVersion:'1.1',accepted:termsAccepted,acceptanceMethod:'explicit_checkbox'},publications,repositories,zenodoRecords,patentRecords,draftId:confirmedDraftId??draftId??'browser-recovery-draft',submissionState:submittedRecord?.status??(requiredCompletion===100?'REVIEW_READY_NOT_PUBLIC':draftId?'DRAFT_ACCOUNT_BACKED':'BROWSER_RECOVERY_DRAFT'),evidenceManifest:[...preservedEvidence.map((item)=>({evidenceId:item.id,filename:item.original_filename,mediaType:item.mime_type,sizeBytes:item.size_bytes,category:item.evidence_classification,relationship:item.evidence_relationship,provenanceStatus:item.provenance_status??'',description:item.description,visibility:item.visibility,sha256:item.sha256_hex,preserved:true,storageBucket:item.storage_bucket,storagePath:item.storage_path})),...files.map((item)=>({filename:item.file.name,mediaType:item.file.type||'application/octet-stream',sizeBytes:item.file.size,lastModified:new Date(item.file.lastModified).toISOString(),category:item.category,relationship:item.relationship,provenanceStatus:item.provenanceStatus,description:item.description,visibility:item.visibility,sha256:item.sha256,preserved:false}))]};}

  async function downloadManifest(){if(!validate()){setMessage('Complete the highlighted required fields before generating the intake manifest.');reviewMissingItems();return;}const confirmedDraftId=await saveDraft();if(!confirmedDraftId){setMessage('The intake manifest was not generated because the current Page 14 state could not be confirmed as an account-backed TA-14 Registry draft. Your browser recovery copy remains available, but it is not the governed Registry record.');return;}const blob=new Blob([JSON.stringify(buildManifest(confirmedDraftId),null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=`${form.shortName||form.governanceName||'governance'}-registry-intake.json`.toLowerCase().replace(/[^a-z0-9.-]+/g,'-');document.body.appendChild(anchor);anchor.click();anchor.remove();URL.revokeObjectURL(url);setMessage('Review-ready intake manifest generated. Evidence files remain on this device.');}

  function handleSubmit(event:FormEvent<HTMLFormElement>){event.preventDefault();void submitForReview();}

  const qualityScores=useMemo(()=>{const score=(items:unknown[])=>Math.round((items.filter(Boolean).length/Math.max(items.length,1))*100);return{identity:score([form.governanceName,form.shortName||true,form.currentVersion,form.effectiveVersionDate||true,form.establishmentDate||true,form.governanceCategory||true]),attribution:score([form.claimantName,form.authorityRole,form.authorityEvidence||true,form.stewardName||form.claimantName,form.organization||true,form.contactEmail]),boundaries:score([form.plainDescription,form.claims,form.nonClaims||true,form.limitations||true,form.regulatoryScope||true]),evidence:Math.min(100,(files.length+preservedEvidence.length)*20+publications.length*10+repositories.length*10+zenodoRecords.length*10+patentRecords.length*10),rights:score([form.ownershipDeclaration||true,form.license||true,form.disputes||true,form.reviewPathway||true])};},[form,files.length,preservedEvidence.length,publications.length,repositories.length,zenodoRecords.length,patentRecords.length]);
  const overallReadiness=useMemo(()=>Math.round((qualityScores.identity+qualityScores.attribution+qualityScores.boundaries+qualityScores.evidence+qualityScores.rights)/5),[qualityScores]);
  function stepHasRequiredData(step:number){return registryWizardStepComplete(step,gateInput);}

  async function goToStep(next:number){if(next>activeStep&&!stepHasRequiredData(activeStep)){setErrors([`Complete the required items in Step ${wizardSteps[activeStep].number}: ${wizardSteps[activeStep].title} before continuing.`]);setMessage('This step is not complete yet.');return;}if(next>activeStep&&activeStep===7&&files.length>0){setErrors([]);setMessage('Preserving supplied evidence before Step 09…');const submissionId=await saveDraft();if(!submissionId)return;try{for(const item of files){setEvidenceBusyId(item.id);await preserveEvidenceForSubmission(item,submissionId);}setEvidenceBusyId(null);const authoritativeEvidence=await fetchPreservedEvidence(submissionId);setPreservedEvidence(authoritativeEvidence);setFiles([]);const recoveryPreserved=await saveRecoveryDraft(next);if(!recoveryPreserved)return;setErrors([]);setMessage('Supplied evidence preserved. Step 09 is now available.');}catch(error){setEvidenceBusyId(null);setErrors([error instanceof Error?error.message:'Unable to preserve evidence.']);setMessage('Step 08 remains open because evidence you chose to submit must be durably preserved before continuing.');return;}}else if(next>activeStep){const preserved=await saveRecoveryDraft(next);if(!preserved)return;setErrors([]);setMessage('Step saved to your account-backed recovery record.');}else{setErrors([]);setMessage('');}setActiveStep(Math.max(0,Math.min(wizardSteps.length-1,next)));window.scrollTo({top:0,behavior:'smooth'});}

  async function generateReceipt(){if(!validate()){setMessage('Complete the required fields before generating the Registry Intake Receipt.');return;}const confirmedDraftId=await saveDraft();if(!confirmedDraftId){setMessage('Pre-submission receipt not generated. The current intake could not be confirmed as an account-backed TA-14 Registry draft. This intake is NOT REGISTERED.');return;}const manifest=buildManifest(confirmedDraftId);const receipt={receiptType:'TA-14 AI Governance Registry PRE-SUBMISSION Draft Receipt',receiptVersion:'1.1',generatedAt:new Date().toISOString(),submissionState:'PRE_SUBMISSION_NOT_REGISTERED',registrationStatus:'NOT_REGISTERED',registryIdentifier:null,draftId:confirmedDraftId,governanceName:form.governanceName,currentVersion:form.currentVersion,claimedEstablishmentDate:form.establishmentDate||null,evidenceCounts:{localEvidenceFiles:files.length,preservedEvidenceFiles:preservedEvidence.length,publications:publications.length,repositories:repositories.length,zenodoRecords:zenodoRecords.length,patentRecords:patentRecords.length},readiness:{requiredCompletion,overallReadiness,composition:'Arithmetic mean of identity, attribution, boundaries, evidence, and rights/review quality scores. Informational only; not certification or a validity score.',qualityScores},registryBoundary:'PRE-SUBMISSION ONLY. NOT REGISTERED. This receipt proves only that an account-backed draft intake package was prepared. It is not proof of submission, registration, a public Registry identifier, certification, legal validation, regulatory approval, ownership adjudication, or technical performance.',manifest};const blob=new Blob([JSON.stringify(receipt,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=`${form.shortName||form.governanceName||'governance'}-registry-intake-receipt.json`.toLowerCase().replace(/[^a-z0-9.-]+/g,'-');document.body.appendChild(anchor);anchor.click();anchor.remove();URL.revokeObjectURL(url);setReceiptGenerated(true);setMessage('PRE-SUBMISSION draft receipt generated. This intake is NOT REGISTERED. Registration exists only after the TA-14 Registry returns a permanent Registry Identifier.');}

  return (
    <main className="registry-wizard-page">
      <header className="topbar"><Link href="/workspace/ai-governance/registry" className="brand-button"><span className="brand-mark">TA-14</span><span><strong>AI Governance Registry</strong><small>14-step governed registration wizard</small></span></Link></header>
      <section className="hero-shell"><div className="eyebrow">GUIDED REGISTRY INTAKE · FOUNDATIONAL RELEASE</div><h1>Register an AI Governance Architecture</h1><p>Keep all fourteen TA-14 Registry steps while supplying only what is necessary for an attributable record. Optional enrichment may be left blank and added later.</p><div className="boundary-banner"><strong>Registration is not certification.</strong><span>Record-only registration preserves identity, attribution, claims, declarations, and the Registry boundary. Evidence and deeper review remain optional unless a later governed pathway specifically requires them.</span></div></section>
      <section className="wizard-shell">
        <aside className="wizard-sidebar"><div className="progress-card"><span>Required completion</span><strong>{requiredCompletion}%</strong><div className="progress-track"><div className="progress-fill" style={{width:`${requiredCompletion}%`}} /></div><small>{missingRequired} required item{missingRequired===1?'':'s'} remain</small></div><div className="step-list">{wizardSteps.map((step,index)=><button type="button" key={step.number} className={`${index===activeStep?'active':''} ${stepHasRequiredData(index)?'complete':''}`} onClick={()=>goToStep(index)}><span>{step.number}</span><div><strong>{step.short}</strong><small>{step.title}</small></div><b>{stepHasRequiredData(index)?'✓':''}</b></button>)}</div></aside>
        <div className="wizard-content">
          <div className="step-header"><div><span>STEP {wizardSteps[activeStep].number} OF 14</span><h2>{wizardSteps[activeStep].title}</h2></div><div className="step-state">{stepHasRequiredData(activeStep)?'STEP COMPLETE':'IN PROGRESS'}</div></div>
          {activeStep===0&&<section className="step-card"><p className="step-intro">Identify the architecture. Only name and current version are required for record-only registration.</p><div className="field-grid two"><label>Governance name <em>Required</em><input value={form.governanceName} onChange={(e)=>updateField('governanceName',e.target.value)} /></label><label>Short name or acronym<input value={form.shortName} onChange={(e)=>updateField('shortName',e.target.value)} /></label><label>Current version <em>Required</em><input value={form.currentVersion} onChange={(e)=>updateField('currentVersion',e.target.value)} /></label><label>Effective version date <small>Optional</small><input type="date" value={form.effectiveVersionDate} onChange={(e)=>updateField('effectiveVersionDate',e.target.value)} /></label><label>Claimed establishment date <small>Optional</small><input type="date" value={form.establishmentDate} onChange={(e)=>updateField('establishmentDate',e.target.value)} /></label><label>Governance category <small>Optional</small><input value={form.governanceCategory} onChange={(e)=>updateField('governanceCategory',e.target.value)} /></label></div></section>}
          {activeStep===1&&<section className="step-card"><p className="step-intro">Preserve claimant attribution and the role of the person submitting the record.</p><div className="field-grid two"><label>Claimant, founder, or author <em>Required</em><input value={form.claimantName} onChange={(e)=>updateField('claimantName',e.target.value)} /></label><label>Submission authority role <em>Required</em><select value={form.authorityRole} onChange={(e)=>updateField('authorityRole',e.target.value as AuthorityRole)}>{['Founder','Author','Current steward','Organization representative','Legal representative','Authorized submitter','Contributor','Third-party claimant','Other'].map((role)=><option key={role}>{role}</option>)}</select></label><label>Authority evidence or explanation <small>Optional enrichment</small><textarea rows={5} value={form.authorityEvidence} onChange={(e)=>updateField('authorityEvidence',e.target.value)} /></label><label>Contact email <em>Required</em><input type="email" value={form.contactEmail} onChange={(e)=>updateField('contactEmail',e.target.value)} /></label><label>Public website <small>Optional</small><input type="url" value={form.website} onChange={(e)=>updateField('website',e.target.value)} /></label><label>Public evidence route <small>Optional</small><input type="url" value={form.publicEvidenceRoute} onChange={(e)=>updateField('publicEvidenceRoute',e.target.value)} /></label></div></section>}
          {activeStep===2&&<section className="step-card"><p className="step-intro">Identify current stewardship. If left blank, the claimant is used as steward for record-only registration.</p><div className="field-grid two"><label>Current steward<input value={form.stewardName} onChange={(e)=>updateField('stewardName',e.target.value)} placeholder={form.claimantName||'Defaults to claimant'} /></label><label>Organization <small>Optional</small><input value={form.organization} onChange={(e)=>updateField('organization',e.target.value)} /></label></div></section>}
          {activeStep===3&&<section className="step-card"><label>Plain-language description <em>Required</em><textarea rows={12} value={form.plainDescription} onChange={(e)=>updateField('plainDescription',e.target.value)} /></label></section>}
          {activeStep===4&&<section className="step-card"><label>Formal claims <em>Required</em><textarea rows={14} value={form.claims} onChange={(e)=>updateField('claims',e.target.value)} /></label></section>}
          {activeStep===5&&<section className="step-card"><p className="step-intro">Optional enrichment. Add non-claims and limitations when useful; leaving this step blank does not block registration.</p><label>Explicit non-claims <small>Optional</small><textarea rows={12} value={form.nonClaims} onChange={(e)=>updateField('nonClaims',e.target.value)} /></label><label>Known limitations <small>Optional</small><textarea rows={8} value={form.limitations} onChange={(e)=>updateField('limitations',e.target.value)} /></label></section>}
          {activeStep===6&&<section className="step-card"><p className="step-intro">Optional scope and jurisdiction context.</p><div className="field-grid two"><label>Geographic or jurisdictional scope<input value={form.jurisdiction} onChange={(e)=>updateField('jurisdiction',e.target.value)} /></label><label>Regulatory or standards scope<input value={form.regulatoryScope} onChange={(e)=>updateField('regulatoryScope',e.target.value)} /></label></div></section>}
          {activeStep===7&&<section className="step-card"><p className="step-intro"><strong>Optional evidence.</strong> You may leave this step blank. If you add evidence, each supplied object must have a description and provenance status before preservation.</p><div className={`drop-zone ${dragActive?'drag-active':''}`} onDragEnter={(e)=>{e.preventDefault();setDragActive(true);}} onDragOver={(e)=>e.preventDefault()} onDragLeave={(e)=>{if(e.currentTarget===e.target)setDragActive(false);}} onDrop={handleDrop}><input ref={fileInputRef} type="file" multiple accept={ACCEPTED_EXTENSIONS.map((extension)=>`.${extension}`).join(',')} onChange={handleFileChange} className="hidden-file-input" /><h3>Optional evidence package</h3><button type="button" className="primary-button" onClick={()=>fileInputRef.current?.click()}>Choose Evidence Files ＋</button></div>{files.map((item,index)=><article className="evidence-item" key={item.id}><div className="file-index">{String(index+1).padStart(2,'0')}</div><div className="file-body"><div className="file-header"><div><h3>{item.file.name}</h3><p>{bytesToSize(item.file.size)}</p></div><div className="file-actions"><button type="button" className="primary-button" disabled={!draftId||evidenceBusyId===item.id} onClick={()=>preserveEvidence(item)}>{evidenceBusyId===item.id?'Preserving…':draftId?'Preserve Evidence':'Save Draft First'}</button><button type="button" className="remove-button" onClick={()=>removeEvidence(item.id)}>Remove</button></div></div><label>Provenance status <em>Required for supplied evidence</em><select value={item.provenanceStatus} onChange={(e)=>updateEvidence(item.id,{provenanceStatus:e.target.value as ProvenanceStatus})}>{provenanceStatuses.map((status)=><option key={status||'UNSELECTED'} value={status}>{status||'Select provenance status'}</option>)}</select></label><label>What this file supports <em>Required for supplied evidence</em><textarea rows={4} value={item.description} onChange={(e)=>updateEvidence(item.id,{description:e.target.value})} /></label></div></article>)}</section>}
          {activeStep===8&&<section className="step-card"><p className="step-intro">Optional publications. Add none, one, or many.</p><button type="button" className="primary-button" onClick={()=>setPublications((current)=>[...current,createPublication()])}>Add Publication ＋</button>{publications.length===0&&<p className="empty-state">No publications added. You may continue.</p>}</section>}
          {activeStep===9&&<section className="step-card"><p className="step-intro">Optional repositories and deposits.</p><button type="button" className="primary-button" onClick={()=>setRepositories((current)=>[...current,createRepository()])}>Add Repository ＋</button><button type="button" className="secondary-button" onClick={()=>setZenodoRecords((current)=>[...current,createZenodo()])}>Add Zenodo Record ＋</button>{repositories.length===0&&zenodoRecords.length===0&&<p className="empty-state">No repositories or deposits added. You may continue.</p>}</section>}
          {activeStep===10&&<section className="step-card"><p className="step-intro">Optional patent, rights, ownership, licensing, and dispute enrichment.</p><button type="button" className="primary-button" onClick={()=>setPatentRecords((current)=>[...current,createPatent()])}>Add Patent Record ＋</button><label>Ownership and submission-rights narrative <small>Optional enrichment</small><textarea rows={8} value={form.ownershipDeclaration} onChange={(e)=>updateField('ownershipDeclaration',e.target.value)} /></label><label>License or permitted-use statement <small>Optional</small><textarea rows={8} value={form.license} onChange={(e)=>updateField('license',e.target.value)} /></label><label>Known disputes <small>Optional</small><textarea rows={6} value={form.disputes} onChange={(e)=>updateField('disputes',e.target.value)} /></label></section>}
          {activeStep===11&&<section className="step-card"><p className="step-intro">Deeper review is optional. If you leave this unselected, TA-14 uses <strong>Record-only registration</strong>.</p><label>Requested Registry pathway <small>Optional</small><select value={form.reviewPathway} onChange={(e)=>updateField('reviewPathway',e.target.value as ReviewPathway)}><option value="">Default — Record-only registration</option><option>Record-only registration</option><option>Administrative completeness review</option><option>Identity and authority review</option><option>Evidence review</option><option>Independent governance review</option><option>Partner Review Network review</option></select></label></section>}
          {activeStep===12&&<section className="step-card"><p className="step-intro">These declarations are the final required governance boundary.</p><div className="declaration-stack"><label className="declaration-row"><input type="checkbox" checked={form.authorityConfirmed} onChange={(e)=>updateField('authorityConfirmed',e.target.checked)} /><span><strong>Authority to submit</strong>I am authorized to submit this registration, or I have disclosed the limits of that authority.</span></label><label className="declaration-row"><input type="checkbox" checked={form.accuracyConfirmed} onChange={(e)=>updateField('accuracyConfirmed',e.target.checked)} /><span><strong>Accuracy and attribution</strong>The registration is accurate to the best of my knowledge.</span></label><label className="declaration-row"><input type="checkbox" checked={form.boundaryConfirmed} onChange={(e)=>updateField('boundaryConfirmed',e.target.checked)} /><span><strong>Registry boundary</strong>I understand registration is not certification, legal approval, ownership adjudication, or proof of technical performance.</span></label><label className="declaration-row"><input type="checkbox" checked={termsAccepted} onChange={(e)=>setTermsAccepted(e.target.checked)} /><span><strong>TA14-RET-001 v1.1 Registry Terms</strong>I accept the Registry Terms required for governed submission.</span></label></div></section>}
          {activeStep===13&&<section className="step-card final-step"><div className="readiness-hero"><span>REQUIRED REGISTRATION COMPLETION</span><strong>{requiredCompletion}%</strong><p>Optional enrichment does not reduce registration eligibility.</p></div><div className="receipt-panel"><h3>Pre-Submission Draft Receipt</h3><p>Generate a draft manifest or receipt. Evidence, non-claims, rights narratives, and deeper review remain optional for record-only registration.</p><div className="receipt-actions"><button type="button" className="secondary-button" onClick={()=>void downloadManifest()}>Download Intake Manifest ↓</button><button type="button" className="primary-button" onClick={()=>void generateReceipt()}>Generate PRE-SUBMISSION Draft Receipt ↓</button></div>{receiptGenerated&&<span className="receipt-success">PRE-SUBMISSION receipt generated — NOT REGISTERED.</span>}</div><div className="final-boundary"><strong>{requiredCompletion===100?'Ready for formal submission.':'Required registration information remains.'}</strong><p>Submission preserves the account-backed Registry record. Record-only registration does not require an evidence package or a deeper review pathway.</p><button type="button" className="primary-button" onClick={submitForReview} disabled={submitBusy||termsBusy||requiredCompletion<100||Boolean(submittedRecord)}>{submittedRecord?'Submitted ✓':termsBusy?'Preserving Terms…':submitBusy?'Submitting…':'Submit Registration →'}</button></div></section>}
          {(errors.length>0||message)&&<section className={`notice-panel ${errors.length>0?'has-errors':''}`} aria-live="polite">{message&&<strong>{message}</strong>}{errors.length>0&&<ul>{errors.map((error)=><li key={error}>{error}</li>)}</ul>}</section>}
          <div className="wizard-navigation"><button type="button" className="secondary-button" disabled={activeStep===0} onClick={()=>void goToStep(activeStep-1)}>← Previous</button><span>{wizardSteps[activeStep].number} / 14</span>{activeStep<wizardSteps.length-1?<button type="button" className="primary-button" onClick={()=>void goToStep(activeStep+1)} disabled={Boolean(evidenceBusyId)}>{evidenceBusyId?'Preserving Evidence…':'Save & Continue →'}</button>:<button type="button" className="primary-button" onClick={submitForReview} disabled={submitBusy||termsBusy||requiredCompletion<100||Boolean(submittedRecord)}>Submit Registration →</button>}</div>
        </div>
      </section>
      <style jsx>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#050812;color:#f7f3e8}.registry-wizard-page{min-height:100vh;padding:24px clamp(16px,3vw,44px) 56px;font-family:Inter,ui-sans-serif,system-ui;background:linear-gradient(180deg,#050812,#09101d 48%,#050711)}.topbar,.hero-shell,.wizard-shell{max-width:1540px;margin-inline:auto}.topbar{display:flex;justify-content:space-between;padding:12px 0 28px}.brand-button,.primary-button,.secondary-button,.remove-button{border:1px solid rgba(219,177,102,.42);border-radius:12px;padding:10px 14px;color:#fff8e8;text-decoration:none;background:rgba(29,23,18,.84);cursor:pointer}.brand-button{display:inline-flex;gap:12px;align-items:center}.brand-button>span:last-child{display:grid}.brand-mark{display:grid;place-items:center;min-width:56px;height:42px;border-radius:10px;background:#d7a74e;color:#130d07;font-weight:900}.hero-shell{text-align:center;padding:48px 0 38px}.eyebrow{color:#e8bc68;font-size:11px;font-weight:900;letter-spacing:.2em}.hero-shell h1{font-family:Georgia,serif;font-size:clamp(44px,7vw,84px);margin:18px auto}.hero-shell>p{max-width:900px;margin:0 auto 24px;color:#c9d1df;font-size:18px;line-height:1.7}.boundary-banner{display:grid;gap:5px;max-width:980px;margin:auto;padding:17px 20px;text-align:left;border:1px solid rgba(231,184,96,.4);border-radius:17px;background:rgba(47,35,20,.56)}.wizard-shell{display:grid;grid-template-columns:250px minmax(0,1fr);gap:18px;align-items:start}.wizard-sidebar{position:sticky;top:18px;display:grid;gap:14px}.progress-card,.step-list,.step-header,.step-card,.notice-panel,.wizard-navigation{border:1px solid rgba(151,169,199,.2);border-radius:20px;background:rgba(8,13,25,.97)}.progress-card{padding:17px}.progress-card>strong{display:block;margin:5px 0 10px;color:#f0c979;font-size:34px}.progress-track{height:8px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden}.progress-fill{height:100%;background:linear-gradient(90deg,#7cb6e8,#e8bc68)}.step-list{overflow:hidden}.step-list button{width:100%;display:grid;grid-template-columns:34px 1fr 18px;gap:9px;align-items:center;padding:10px 12px;border:0;border-bottom:1px solid rgba(151,169,199,.1);text-align:left;color:#bec9d8;background:transparent;cursor:pointer}.step-list button.active{background:rgba(232,188,104,.09);color:#fff3d5}.step-list button div{display:grid}.wizard-content{display:grid;gap:14px}.step-header{display:flex;justify-content:space-between;align-items:center;padding:20px 24px}.step-header h2{margin:4px 0 0;font-family:Georgia,serif;font-size:34px}.step-card{min-height:420px;padding:clamp(22px,4vw,38px)}.step-intro{color:#aab7c8;line-height:1.7}.field-grid{display:grid;gap:16px;margin-bottom:18px}.field-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}label{display:grid;gap:8px;color:#edf2fa;font-size:13px;font-weight:750}label em{color:#eec571;font-size:9px;font-style:normal;text-transform:uppercase}label small{color:#8fa1b8;font-weight:500}input,select,textarea{width:100%;border:1px solid rgba(151,169,199,.28);border-radius:12px;padding:13px 14px;color:#f6f8fc;background:rgba(4,9,18,.82);font:inherit}textarea{resize:vertical}.declaration-stack{display:grid;gap:12px}.declaration-row{display:flex;gap:12px;padding:14px;border:1px solid rgba(151,169,199,.18);border-radius:14px}.declaration-row input{width:18px;height:18px}.declaration-row strong{display:block;color:#fff4d9}.drop-zone{display:grid;justify-items:center;gap:10px;padding:46px 20px;border:1px dashed rgba(232,188,104,.55);border-radius:20px}.hidden-file-input{display:none}.evidence-item{display:grid;grid-template-columns:44px 1fr;gap:14px;margin-top:16px;padding:18px;border:1px solid rgba(151,169,199,.22);border-radius:17px}.file-index{display:grid;place-items:center;height:44px;border-radius:12px;background:rgba(129,164,207,.12)}.file-header,.file-actions,.receipt-actions{display:flex;justify-content:space-between;gap:10px;align-items:center}.empty-state{padding:17px;border:1px dashed rgba(151,169,199,.22);border-radius:13px;color:#98a8bd}.readiness-hero{text-align:center;padding:24px;border:1px solid rgba(232,188,104,.28);border-radius:18px}.readiness-hero>strong{display:block;margin:8px 0;font-size:64px;color:#fff0c8}.receipt-panel,.final-boundary{margin-top:18px;padding:22px;border:1px solid rgba(126,178,225,.28);border-radius:17px}.notice-panel{padding:16px 20px}.notice-panel.has-errors{border-color:rgba(230,128,93,.55);color:#ffe1d4}.wizard-navigation{display:flex;justify-content:space-between;align-items:center;padding:14px}button:disabled{opacity:.48;cursor:not-allowed}@media(max-width:900px){.wizard-shell{grid-template-columns:1fr}.wizard-sidebar{position:relative;top:auto}.field-grid.two{grid-template-columns:1fr}}
      `}</style>
    </main>
  );
}
