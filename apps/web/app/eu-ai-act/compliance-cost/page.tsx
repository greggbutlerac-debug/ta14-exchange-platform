import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
 title:'EU AI Act Compliance Cost: Software, Evidence & Readiness Pricing',
 description:'Understand the cost drivers behind EU AI Act readiness and compare TA-14 operating access from $19/month with independent governed readiness review from $750.',
 alternates:{canonical:'/eu-ai-act/compliance-cost'},
 keywords:['EU AI Act compliance cost','EU AI Act compliance pricing','AI Act software cost','AI Act readiness assessment cost','EU AI Act compliance tool pricing','AI governance software pricing'],
 openGraph:{title:'EU AI Act Compliance Cost | TA-14',description:'What drives EU AI Act readiness cost, what software can reduce, and where independent review remains separate.',url:'/eu-ai-act/compliance-cost',type:'website'}
};

const cards=[
 {title:'HOW MANY AI SYSTEMS ARE ACTUALLY IN SCOPE?',copy:'Cost starts with portfolio size. Each real system can carry its own identity, intended purpose, actor role, classification, evidence, change history and revalidation burden.'},
 {title:'WHAT ROLE DOES THE ORGANIZATION ACTUALLY HOLD?',copy:'Provider, deployer, importer, distributor, authorised representative and GPAI-provider pathways do not create identical work. Establish role before estimating the operating burden.'},
 {title:'HOW MUCH OF THE WORK IS CONTINUING?',copy:'Classification is not the whole cost. Evidence upkeep, logs, documentation, incidents, post-market activity, human oversight and material-change revalidation can create continuing work.'},
 {title:'WHAT REQUIRES OUTSIDE PROFESSIONAL OR CONFORMITY WORK?',copy:'Software does not eliminate legal advice, notified-body work, conformity assessment or other independent professional costs when those are applicable. Budget those separately from the operating workspace.'},
];

const steps=[
 {title:'Classify before buying an oversized compliance program',copy:'Establish the actual AI system, intended purpose, EU exposure and likely operator role first. A low-cost operating path should begin with scope rather than fear.'},
 {title:'Match operating access to portfolio size',copy:'TA-14 publishes a direct ladder: Evidence Passport $19/month, Compliance Workspace $49/month, Governance Pro $99/month and Institution $499/month.'},
 {title:'Keep independent examination separate',copy:'When an organization wants a governed human readiness examination, TA-14 treats that as a separate service beginning at $750 rather than disguising professional review inside a software subscription.'},
 {title:'Recalculate when reality changes',copy:'New systems, model swaps, changed purposes, new jurisdictions, authority changes and evidence gaps can change both the governance burden and the appropriate operating tier.'},
];

const faqs=[
 {q:'How much does TA-14 EU AI Act access cost?',a:'Current monthly operating tiers are $19 for Evidence Passport, $49 for Compliance Workspace, $99 for Governance Pro and $499 for Institution. Annual billing is also available through the Exchange.'},
 {q:'Is the $19 plan a legal compliance certification?',a:'No. Evidence Passport is operating evidence infrastructure. Subscription access does not create legal advice, certification, CE marking, regulatory approval, conformity assessment or an automatic favorable governance determination.'},
 {q:'What does a TA-14 governed readiness review cost?',a:'A fixed-scope independent governed readiness review begins at $750. It is separate from the software subscription because examination and operating infrastructure are different functions.'},
 {q:'Why can EU AI Act programs cost more than software?',a:'Internal staff time, evidence creation, engineering changes, legal advice, training, conformity work, external assessment and continuing monitoring can all sit outside the software license. The correct total depends on the actual system and obligations.'},
 {q:'Should a small business start with the Institution tier?',a:'Not automatically. TA-14 is designed to let an organization start with the smallest tier that fits the current system count and governance need, then upgrade when scope actually grows.'},
 {q:'Can I start without paying?',a:'Yes. The free classifier is intended to establish the initial system, purpose, role, exposure and unresolved facts before the organization decides what continuing operating infrastructure it needs.'},
];

export default function ComplianceCostPage(){return <SeoAcquisitionPage
 eyebrow="EU AI ACT · COST · PRICING · OPERATING BURDEN"
 title="WHAT WILL EU AI ACT READINESS"
 accent="ACTUALLY COST YOU?"
 intro="There is no honest universal compliance price because the work changes with the AI system, operator role, risk route, portfolio size and evidence burden. TA-14 separates the question into free classification, transparent operating access, and independent governed review when human examination is actually needed."
 sourceLabel="EUR-Lex · Regulation (EU) 2024/1689"
 sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
 sourceNote="The Regulation creates different obligations for different actors, system classes and use contexts. Cost should therefore be estimated from the applicable obligation set—not from a generic promise that every AI system needs the same compliance program."
 cards={cards}
 steps={steps}
 faqs={faqs}
 classifierHref="/eu-ai-act/classifier?intent=compliance-cost"
 workspaceHref="/eu-ai-act/commercial"
 workspaceLabel="COMPARE $19 · $49 · $99 · $499 PLANS →"
/>}
