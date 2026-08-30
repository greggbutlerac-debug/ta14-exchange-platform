'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavigationItem = { href:string; label:string; glyph:string; matchPrefixes?:string[]; partner?:boolean; institutional?:boolean };
const missionControlHref='/workspace/mission-control';
const aiGovernanceHomeHref='/workspace/ai-governance';
const playgroundHref='/workspace/ai-governance/playground';
const adversarialExaminationHref='/workspace/ai-governance/adversarial-examination';
const examinationEngineHref='/workspace/ai-governance/examination-engine';
const demonstrationsHref='/workspace/ai-governance/demonstrations';
const provenanceHref='/workspace/ai-governance/provenance-reconciliation';
const foundingDemonstrationsHref='/artifacts/founding-demonstrations';
const interoperabilityExaminationsHref='/artifacts/interoperability-examinations';
const andeksExaminationHref='/artifacts/ta14-andeks-ie-2026-001';
const andeksResponseHref='/artifacts/ta14-andeks-ie-2026-001/independent-response';
const reviewsResponsesHref='/workspace/ai-governance/reviews';
const artifactsHref='/artifacts';
const euAiActHref='/eu-ai-act';
const euAiActCommandCenterHref='/eu-ai-act/command-center';
const euAiActClassifierHref='/eu-ai-act/classifier';
const euAiActAccessHref='/eu-ai-act/commercial';
const governanceLibraryHref='/workspace/ai-governance/library';
const institutionalAuthorityHref='/workspace/ai-governance/institutional-authority/registration-package';
const institutionalAuthorityPrefix='/workspace/ai-governance/institutional-authority';
const registryHref='/workspace/ai-governance/registry';
const registryInboxHref='/workspace/ai-governance/registry/inbox';
const partnerReviewNetworkHref='/workspace/ai-governance/partner-review-network';
const pricingHref='/workspace/ai-governance/pricing';
const workspaceNavigation:NavigationItem[]=[
 {href:missionControlHref,label:'Mission Control',glyph:'MC',matchPrefixes:[missionControlHref],institutional:true},
 {href:aiGovernanceHomeHref,label:'AI Governance Home',glyph:'⌂',matchPrefixes:[aiGovernanceHomeHref]},
 {href:playgroundHref,label:'Playground',glyph:'◈',matchPrefixes:[playgroundHref]},
 {href:provenanceHref,label:'Provenance Reconciliation',glyph:'PR',matchPrefixes:[provenanceHref],institutional:true},
 {href:adversarialExaminationHref,label:'Adversarial Examination',glyph:'AX',matchPrefixes:[adversarialExaminationHref],institutional:true},
 {href:examinationEngineHref,label:'Consequence Examination',glyph:'CE',matchPrefixes:[examinationEngineHref],institutional:true},
 {href:demonstrationsHref,label:'Demonstrations',glyph:'◎',matchPrefixes:[demonstrationsHref]},
 {href:foundingDemonstrationsHref,label:'Founding Demonstrations',glyph:'FD',matchPrefixes:[foundingDemonstrationsHref],institutional:true},
 {href:interoperabilityExaminationsHref,label:'Interoperability Examinations',glyph:'IE',matchPrefixes:[interoperabilityExaminationsHref,andeksExaminationHref],institutional:true},
 {href:reviewsResponsesHref,label:'Reviews & Responses',glyph:'RR',matchPrefixes:[reviewsResponsesHref]},
 {href:artifactsHref,label:'Artifact Registry',glyph:'AR',matchPrefixes:[artifactsHref],institutional:true},
 {href:euAiActHref,label:'EU AI Act · World 05',glyph:'05',matchPrefixes:['/eu-ai-act']},
 {href:governanceLibraryHref,label:'Governance Library',glyph:'L',matchPrefixes:[governanceLibraryHref]},
 {href:institutionalAuthorityHref,label:'Institutional Authority',glyph:'IA',matchPrefixes:[institutionalAuthorityPrefix],institutional:true},
 {href:registryHref,label:'Registry',glyph:'RG',matchPrefixes:[registryHref]},
 {href:registryInboxHref,label:'Registry Inbox',glyph:'IN',matchPrefixes:[registryInboxHref],institutional:true},
 {href:'/workspace/routes/new',label:'Build a Route',glyph:'◇',matchPrefixes:['/workspace/routes/new']},
 {href:'/workspace/routes',label:'My AI Routes',glyph:'R',matchPrefixes:['/workspace/routes']},
 {href:partnerReviewNetworkHref,label:'Partner Review Network',glyph:'P',matchPrefixes:[partnerReviewNetworkHref],partner:true},
 {href:pricingHref,label:'Pricing',glyph:'$',matchPrefixes:[pricingHref]},
];
const mobileLabels=new Set(['Mission Control','AI Governance Home','Playground','Provenance Reconciliation','Adversarial Examination','Consequence Examination','EU AI Act · World 05','Founding Demonstrations','Interoperability Examinations','Reviews & Responses','Artifact Registry','Institutional Authority','Registry Inbox']);
const mobileNavigation=workspaceNavigation.filter(i=>mobileLabels.has(i.label));
function isItemActive(pathname:string,item:NavigationItem){if(item.href==='/workspace/routes')return pathname==='/workspace/routes'||(pathname.startsWith('/workspace/routes/')&&!pathname.startsWith('/workspace/routes/new'));if(item.href===aiGovernanceHomeHref)return pathname===aiGovernanceHomeHref;if(item.href===registryHref)return pathname===registryHref||(pathname.startsWith(`${registryHref}/`)&&!pathname.startsWith(registryInboxHref));return(item.matchPrefixes??[item.href]).some(prefix=>pathname===prefix||pathname.startsWith(`${prefix}/`))}
export function AiGovernanceNavigation(){const pathname=usePathname();return <><aside className="ta14-sidebar" aria-label="TA-14 institutional and AI Governance workspace navigation"><section><span className="ta14-nav-label">Institution</span><nav className="ta14-nav-list">{workspaceNavigation.map(item=>{const active=isItemActive(pathname,item);return <Link aria-current={active?'page':undefined} className={`ta14-nav-item${active?' active':''}${item.partner?' partner':''}${item.institutional?' institutional':''}`} href={item.href} key={item.href}><span className="ta14-nav-glyph" aria-hidden="true">{item.glyph}</span><span>{item.label}</span></Link>})}</nav></section>
<article className="ta14-sidebar-note"><small>Provenance Reconciliation</small><strong>Overlap is not a finding.</strong><p>Registered architectures can submit a disputed provenance record, identify an Exchange or external architecture, preserve evidence, and place neutral outreach under TA-14 institutional control.</p><Link href={provenanceHref}>Open Provenance Reconciliation →</Link></article>
<article className="ta14-sidebar-note"><small>Consequence Examination Engine</small><strong>Make the claim executable.</strong><p>Apply machine-readable invariants, consequence-boundary proof, adversarial bypass challenges, independent replay requirements, and claim-to-proof coverage to bounded architecture claims.</p><Link href={examinationEngineHref}>Open Consequence Examination →</Link></article>
<article className="ta14-sidebar-note"><small>Adversarial Examination</small><strong>Do not stop at the happy path.</strong><p>Challenge changed conditions, authority, evidence supportability, succession, revalidation, historical integrity, offline reconstruction, and compound bypass routes before treating a claim as demonstrated.</p><Link href={adversarialExaminationHref}>Open Adversarial Examination →</Link></article>
<article className="ta14-sidebar-note"><small>Governed World 05 · EU AI Act</small><strong>Move from the playground into the operating environment.</strong><p>Use the AI Governance Playground to explore a route, then carry the work into World 05 for persistent System Passports, governed classification, obligation mapping, evidence state, change tracking, revalidation, and controlled examination.</p><Link href={euAiActHref}>Enter EU AI Act World 05 →</Link><br/><Link href={euAiActClassifierHref}>Classify a system →</Link><br/><Link href={euAiActCommandCenterHref}>Open Command Center →</Link><br/><Link href={euAiActAccessHref}>View access & pricing →</Link></article>
<article className="ta14-sidebar-note"><small>Pre-Registration Institutional Due Diligence</small><strong>Inspect the authority before you register.</strong><p>Review the Governing Authority Record, Atlas Chief of Staff Delegation Record, and Participation & Publication Authorization before submitting proprietary evidence or making a consequence-bearing participation decision.</p><Link href={institutionalAuthorityHref}>Open Institutional Authority →</Link></article>
<article className="ta14-sidebar-note"><small>Latest Controlled Examination State</small><strong>TA-14 / ANDEKS™ IE-2026-001 is documentarily complete.</strong><p>TA-14&apos;s finding remains independently issued. ANDEKS™ has independently preserved its response and identified no material factual inaccuracies in TA-14&apos;s representation. Pilot authorization has not been issued; the next-gate decision remains reserved.</p><Link href={andeksExaminationHref}>Open completed examination →</Link><br/><Link href={andeksResponseHref}>Open ANDEKS™ independent response →</Link></article>
<article className="ta14-sidebar-note"><small>TA-14 Governed Examination Pathways</small><strong>Demonstrate a claim. Examine an interface.</strong><p>Founding Demonstrations preserve bounded claims and findings. Interoperability Examinations preserve bounded relationships between independent architectures without collapsing their authority or identity.</p><Link href={foundingDemonstrationsHref}>Open Founding Demonstrations →</Link><br/><Link href={interoperabilityExaminationsHref}>Open Interoperability Examinations →</Link></article>
<article className="ta14-sidebar-note"><small>TA-14 Institutional Mission Control</small><strong>Identity. Action. Records. Continuity.</strong><p>See active work, required actions, registered entities, reviews, artifacts, credentials, commercial scopes, and institutional history in one operating view.</p><Link href={missionControlHref}>Open Mission Control →</Link></article>
<article className="ta14-sidebar-note"><small>TA-14 Reviews & Responses</small><strong>Independent voices. Preserved chronology.</strong><p>Inspect participant reviews, independent reviews, evidence challenges, factual corrections, technical comments, external publications, and governed responses attached to the institutional record.</p><Link href={reviewsResponsesHref}>Open Reviews & Responses →</Link></article>
<article className="ta14-sidebar-note"><small>TA-14 Partner Review Network</small><strong>Independent architectures. Written boundaries.</strong><p>Explore the current partner-review pathways and learn what each governance architecture contributes.</p><Link href={partnerReviewNetworkHref}>Explore the network →</Link></article></aside><nav className="ta14-mobile-nav" aria-label="Mobile institutional and AI Governance navigation">{mobileNavigation.map(item=>{const active=isItemActive(pathname,item);return <Link aria-current={active?'page':undefined} className={`ta14-mobile-link${active?' active':''}${item.partner?' partner':''}${item.institutional?' institutional':''}`} href={item.href} key={item.href}><b aria-hidden="true">{item.glyph}</b><span>{item.label}</span></Link>})}</nav></>}
