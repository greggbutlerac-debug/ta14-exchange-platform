import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act for Small Businesses and SMEs',
  description:'A practical EU AI Act starting point for SMEs and small businesses: identify AI systems, classify risk, preserve evidence, use SME support channels, and avoid overbuilding compliance too early.',
  alternates:{canonical:'/eu-ai-act/small-business'},
  keywords:['EU AI Act small business','EU AI Act SME','AI Act startup compliance','AI compliance for SMEs','small business AI regulation Europe','AI Act small company'],
  openGraph:{title:'EU AI Act for Small Businesses and SMEs | TA-14',description:'A practical, proportionate starting point for SMEs using or selling AI in Europe.',url:'/eu-ai-act/small-business',type:'website'}
};

const cards=[
  {title:'START WITH THE AI SYSTEMS YOU ACTUALLY USE',copy:'List the real systems that matter to the business: customer chatbots, recruitment tools, copilots, recommendation systems, AI features in your product, or other systems that can affect customers, workers or regulated decisions.'},
  {title:'CLASSIFY BEFORE YOU BUILD A BIG COMPLIANCE PROGRAM',copy:'Determine operator role, EU exposure, prohibited-use risk, high-risk routes, transparency duties and other relevant obligations. Small businesses should not spend enterprise-scale money before knowing which systems actually need deeper governance.'},
  {title:'KEEP THE EVIDENCE YOU WILL NEED LATER',copy:'Preserve system identity, vendor information, intended purpose, versions, instructions, training, notices, approvals, testing, changes and the facts supporting classification. A lightweight governed record now is cheaper than reconstruction later.'},
  {title:'USE THE SUPPORT CHANNELS THE ACT PROVIDES',copy:'The AI Act specifically requires support measures for SMEs and start-ups, including tailored awareness and training, dedicated communication channels, priority sandbox access where eligible, and proportionate treatment in certain conformity-assessment costs.'},
];

const steps=[
  {title:'Pick one real AI system',copy:'Do not begin with an organization-wide compliance transformation. Start with the system that creates the clearest customer, employee, regulatory or commercial exposure.'},
  {title:'Run a bounded classification',copy:'Establish what the system does, who provides or deploys it, whether EU scope is engaged, and which regulatory routes may apply. Preserve unresolved facts instead of guessing.'},
  {title:'Create the minimum durable evidence record',copy:'Keep the documents and facts that support the current position: system/version, vendor, purpose, role, notices, training, controls, approvals and important limitations.'},
  {title:'Expand only when the evidence shows you need to',copy:'Move into a larger workspace, readiness review, specialist legal advice or conformity pathway only when the system’s role, risk and evidence state justify it.'},
];

const faqs=[
  {q:'Does the EU AI Act apply to small businesses?',a:'Yes. The Act can apply to organizations of any size when they act as covered providers, deployers, importers, distributors or other operators. It also includes specific measures intended to reduce burden and improve support for SMEs and start-ups.'},
  {q:'Does the Act provide special support for SMEs?',a:'Yes. Article 62 requires Member States to provide measures such as tailored awareness and training, dedicated communication channels and priority access to regulatory sandboxes for eligible SMEs. It also requires proportionate consideration of SME size when setting certain conformity-assessment fees.'},
  {q:'Did the 2026 AI Omnibus change anything for smaller companies?',a:'Yes. The AI Omnibus entered into force on 27 July 2026 and extended some simplification measures beyond SMEs to small mid-cap companies, while also changing timelines and reducing certain administrative burdens.'},
  {q:'Do SMEs need the same high-risk compliance package as a large enterprise?',a:'The substantive high-risk requirements still matter when they apply, but the Act includes proportionate support and simplification measures for smaller operators. The right starting point is to classify the actual system before buying or building a large program.'},
  {q:'Can a small business start with spreadsheets?',a:'Yes, if the business can reliably preserve system identity, role, evidence, versions, changes and review history. The value of a dedicated platform appears when multiple systems, owners, obligations and evidence objects become hard to keep connected.'},
  {q:'Does TA-14 give legal advice to SMEs?',a:'No. TA-14 provides governance infrastructure and structured review pathways. It does not itself provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function SmallBusinessPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · SMALL BUSINESS · SME · START-UP"
  title="SMALL BUSINESS DOESN’T MEAN"
  accent="SMALL GOVERNANCE RISK."
  intro="A small company can still use consequential AI, sell AI into Europe, or depend on vendors whose systems affect customers and workers. The answer is not to copy an enterprise compliance program. Start with one real system, classify it, preserve the evidence, and expand only when the facts require it."
  sourceLabel="EUR-Lex · AI Act Article 62 and European Commission AI Omnibus"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="Article 62 requires specific support for SMEs and start-ups, including tailored awareness, training, communication channels and priority sandbox access where eligible. The AI Omnibus, which entered into force on 27 July 2026, also introduced further simplification and extended some support measures to small mid-cap companies."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=small-business"
  workspaceHref="/eu-ai-act/commercial"
  workspaceLabel="SEE SMALL-TEAM PLANS →"
/>}
