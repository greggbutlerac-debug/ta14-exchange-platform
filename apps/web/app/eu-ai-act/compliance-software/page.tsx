import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance Software and Governance Platform',
  description:'Compare what EU AI Act compliance software should actually do: classify AI systems, map obligations, preserve evidence, track change, support revalidation, and maintain an auditable governance record.',
  alternates:{canonical:'/eu-ai-act/compliance-software'},
  keywords:['EU AI Act compliance software','EU AI Act compliance platform','AI governance software','AI compliance software Europe','AI Act tool','AI compliance evidence platform'],
  openGraph:{title:'EU AI Act Compliance Software | TA-14',description:'A governed operating platform for AI system classification, evidence, obligations, change, and revalidation.',url:'/eu-ai-act/compliance-software',type:'website'}
};

const cards=[
  {title:'CAN THE SOFTWARE IDENTIFY THE ACTUAL AI SYSTEM?',copy:'A useful platform should preserve system identity, intended purpose, version, role, EU exposure, dependencies and scope before mapping obligations. If the system boundary is wrong, everything downstream can be wrong.'},
  {title:'DOES IT MAP OBLIGATIONS TO EVIDENCE?',copy:'A checklist tells you what to think about. A governance platform should connect each obligation to the evidence, owner, version, limitation, review state and unresolved gap that supports it.'},
  {title:'DOES IT KNOW WHEN THE ANSWER MAY HAVE CHANGED?',copy:'AI systems, models, vendors, deployment contexts and legal-source states move. The platform should expose material change and question whether prior classification or evidence can still be relied upon.'},
  {title:'CAN IT PRESERVE A REVIEWABLE CHRONOLOGY?',copy:'Governance evidence should survive handoffs, audits, customer diligence and regulatory review. The record should show what was known, what supported the determination, what changed and what was revalidated.'},
];

const steps=[
  {title:'Classify before you subscribe to complexity',copy:'Start with one real AI system. Establish intended purpose, possible actor role, EU exposure, risk route and unresolved facts before deciding how much governance capacity you need.'},
  {title:'Build a living System Passport',copy:'Preserve system identity, versions, obligations, evidence, gaps, owners and limitations in one governed record rather than recreating the picture across spreadsheets and folders.'},
  {title:'Operate against current evidence state',copy:'See what is supported, conditional, stale, missing, under review or awaiting revalidation. The platform should make uncertainty visible instead of smoothing it away.'},
  {title:'Escalate when software is not enough',copy:'Where legal judgment, independent review or a bounded readiness assessment is needed, route the system into a separately governed human review rather than pretending software can certify the outcome.'},
];

const faqs=[
  {q:'What should EU AI Act compliance software actually do?',a:'At minimum, it should help identify AI systems, classify role and risk routes, map obligations, preserve evidence, show gaps, track versions and material changes, and support revalidation. A static checklist is useful for orientation but not enough for continuing governance.'},
  {q:'Can software automatically tell us that we are compliant?',a:'It should not make that claim casually. EU AI Act compliance depends on facts, legal interpretation, technical evidence, organizational controls and sometimes third-party or authority processes. Software can structure evidence and support decisions without replacing every legal or conformity judgment.'},
  {q:'Why not just use spreadsheets and SharePoint?',a:'You can, but the governance burden rises quickly when multiple systems, versions, owners, obligations, evidence objects and change events must remain connected. The problem is not file storage; it is preserving the relationship among the system, the obligation, the evidence and the decision over time.'},
  {q:'Does TA-14 include a free entry point?',a:'Yes. Organizations can start with a free AI system classification pathway before deciding whether they need a persistent Evidence Passport, team workspace, Governance Pro, Institution access, or a separate readiness review.'},
  {q:'How much does TA-14 EU AI Act software cost?',a:'Current plans begin at $19 per month for Evidence Passport, with larger workspace, governance and institutional tiers available for broader system portfolios and operating needs.'},
  {q:'Does a TA-14 subscription include certification or legal advice?',a:'No. Subscription access provides governance infrastructure. Legal advice, certification, conformity assessment, regulatory approval and formal TA-14 review findings remain separate matters unless expressly included in a written scope.'},
];

export default function ComplianceSoftwarePage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · COMPLIANCE SOFTWARE · GOVERNANCE PLATFORM"
  title="DON’T BUY ANOTHER"
  accent="STATIC CHECKLIST."
  intro="EU AI Act compliance software should help your organization maintain a current system-level governance record—not merely give you a list of articles to read. The practical value is knowing what applies, what evidence supports the position, what is missing, what changed and what must be revalidated."
  sourceLabel="European Commission · EU AI Act Service Desk and Official Regulation"
  sourceHref="https://ai-act-service-desk.ec.europa.eu/en"
  sourceNote="The EU already provides authoritative regulatory information and official support resources. Paid software should therefore earn its value by helping organizations operate and preserve their own system, evidence, obligation and change state over time."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=compliance-software"
  workspaceHref="/eu-ai-act/commercial#pricing"
  workspaceLabel="COMPARE PAID PLANS →"
/>}
