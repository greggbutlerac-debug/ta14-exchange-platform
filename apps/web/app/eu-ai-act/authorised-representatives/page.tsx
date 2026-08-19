import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Authorised Representatives of Non-EU AI Providers',
  description:'Understand EU AI Act obligations for authorised representatives of non-EU providers of high-risk AI systems and GPAI models, including written mandates, verification, document retention, registration, authority cooperation and termination duties.',
  alternates:{canonical:'/eu-ai-act/authorised-representatives'},
  keywords:['EU AI Act authorised representative','non-EU AI provider representative EU','Article 22 AI Act representative','Article 54 GPAI authorised representative','AI Act third country provider EU representative'],
  openGraph:{title:'EU AI Act Compliance for Authorised Representatives | TA-14',description:'A governed guide to Articles 22 and 54 for authorised representatives of non-EU AI providers.',url:'/eu-ai-act/authorised-representatives',type:'website'}
};

const cards=[
  {title:'DOES A NON-EU PROVIDER NEED AN EU AUTHORISED REPRESENTATIVE?',copy:'Providers established in third countries must appoint an authorised representative in the Union before making a high-risk AI system available on the Union market. Non-EU GPAI model providers generally face a parallel requirement before placing a GPAI model on the Union market.'},
  {title:'IS THE WRITTEN MANDATE BROAD ENOUGH TO PERFORM THE REQUIRED TASKS?',copy:'The representative must be empowered by written mandate to verify specified compliance evidence, retain required documentation, respond to competent authorities, cooperate on risk-reduction actions and, where applicable, handle registration duties.'},
  {title:'CAN THE REPRESENTATIVE PRODUCE THE EVIDENCE YEARS LATER?',copy:'For high-risk systems, Article 22 requires specified documents and provider contact details to remain available for 10 years. For GPAI models, Article 54 likewise requires technical documentation and provider contact details to be retained for 10 years.'},
  {title:'WHAT IF THE PROVIDER IS ACTING CONTRARY TO THE AI ACT?',copy:'The representative is not merely a mailbox. Articles 22 and 54 require termination of the mandate when the representative considers or has reason to consider that the provider is acting contrary to its obligations, with prompt notice to the relevant authority.'},
];

const steps=[
  {title:'Identify which representative regime applies',copy:'Determine whether the mandate concerns a high-risk AI system under Article 22, a general-purpose AI model under Article 54, or both. Preserve the provider identity, system or model scope, establishment location and market-placement route.'},
  {title:'Map the written mandate to the statutory task list',copy:'For high-risk systems, cover conformity-document verification, document retention, authority requests, cooperation and registration. For GPAI, cover Annex XI technical documentation, Article 53 and where applicable Article 55 obligations, retention and AI Office cooperation.'},
  {title:'Build the authority-response and document-retention record',copy:'Preserve mandate versions, provider contact details, declarations, technical documentation, certificates where applicable, registration evidence, authority requests, responses, logs under provider control where relevant, and cooperation actions.'},
  {title:'Revalidate the mandate and terminate when the legal boundary is crossed',copy:'A new product line, system version, GPAI model, provider restructuring, changed mandate or evidence of provider non-compliance can make the existing appointment incomplete. Preserve the basis for continuation or termination and any authority notice.'},
];

const faqs=[
  {q:'When must a non-EU provider of a high-risk AI system appoint an authorised representative?',a:'Article 22 requires providers established in third countries to appoint, by written mandate, an authorised representative established in the Union before making their high-risk AI systems available on the Union market.'},
  {q:'What must an authorised representative for a high-risk AI system do?',a:'The mandate must empower the representative to verify that the EU declaration of conformity and technical documentation exist and that the appropriate conformity assessment was completed; retain specified documents; respond to competent authorities; cooperate on risk-reduction actions; and, where applicable, fulfil or verify registration duties.'},
  {q:'Do non-EU GPAI providers also need an authorised representative?',a:'Generally yes. Article 54 requires providers established in third countries to appoint an authorised representative in the Union before placing a GPAI model on the Union market. A limited exception exists for certain free and open-source GPAI models unless they present systemic risk.'},
  {q:'How long must the representative keep documents?',a:'Articles 22 and 54 both set 10-year retention periods for specified documents and provider contact details after the relevant high-risk system or GPAI model has been placed on the market or put into service, as applicable.'},
  {q:'Can authorities contact the authorised representative instead of the provider?',a:'Yes. The written mandate must empower the representative to be addressed, in addition to or instead of the provider, on issues related to ensuring compliance with the AI Act.'},
  {q:'What if the provider appears to be violating the AI Act?',a:'The authorised representative must terminate the mandate if it considers or has reason to consider that the provider is acting contrary to its obligations, and must promptly inform the relevant market-surveillance authority or AI Office as applicable.'},
  {q:'Does TA-14 certify an authorised representative arrangement as compliant?',a:'No. TA-14 can preserve the mandate scope, provider identity, evidence-retention state, authority communications, registration state, termination basis and revalidation history. It does not provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function AuthorisedRepresentativesPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · NON-EU PROVIDERS · AUTHORISED REPRESENTATIVES · ARTICLES 22 & 54"
  title="IF THE PROVIDER IS OUTSIDE THE EU,"
  accent="THE REPRESENTATIVE HAS TO CARRY MORE THAN A NAME."
  intro="Authorised representatives are the compliance bridge between certain non-EU AI providers and Union authorities. For high-risk systems and many GPAI models, the role requires a written mandate, specific verification and retention duties, authority cooperation, registration support where applicable, and a defined exit when the provider is acting contrary to the AI Act."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Articles 22 and 54"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="Article 22 governs authorised representatives for non-EU providers of high-risk AI systems. Article 54 creates a parallel regime for non-EU providers of GPAI models, including a limited open-source exception and AI Office cooperation duties."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=authorised-representatives"
  workspaceHref="/eu-ai-act/commercial"
  workspaceLabel="BUILD THE REPRESENTATIVE EVIDENCE RECORD →"
/>}
