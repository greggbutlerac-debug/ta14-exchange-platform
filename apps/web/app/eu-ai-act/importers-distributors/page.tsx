import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for AI Importers and Distributors',
  description:'Understand EU AI Act obligations for importers and distributors of high-risk AI systems, including conformity verification, CE marking, declarations, instructions, non-conformity handling, traceability, authority cooperation and provider-role shifts.',
  alternates:{canonical:'/eu-ai-act/importers-distributors'},
  keywords:['EU AI Act importer obligations','EU AI Act distributor obligations','high risk AI importer compliance','AI distributor CE marking EU','Article 23 AI Act importer','Article 24 AI Act distributor'],
  openGraph:{title:'EU AI Act Compliance for AI Importers and Distributors | TA-14',description:'A governed guide to Articles 23–25 for AI importers and distributors.',url:'/eu-ai-act/importers-distributors',type:'website'}
};

const cards=[
  {title:'ARE YOU THE IMPORTER OR THE DISTRIBUTOR?',copy:'An importer is established in the Union and places on the market an AI system bearing the name or trademark of a third-country entity. A distributor is another supply-chain actor that makes an AI system available on the Union market.'},
  {title:'HAS THE REQUIRED HIGH-RISK CONFORMITY EVIDENCE BEEN VERIFIED?',copy:'Before placing a high-risk system on the market, importers must verify the provider’s conformity assessment, technical documentation, CE marking, EU declaration of conformity, instructions for use and authorised representative where required. Distributors have their own pre-market verification duties.'},
  {title:'WHAT HAPPENS IF THE SYSTEM APPEARS NON-CONFORMING OR RISKY?',copy:'An importer must not place a high-risk system on the market where there is sufficient reason to consider it non-conforming, falsified or supported by falsified documentation. Distributors likewise must stop availability and take or support corrective action where non-conformity is identified.'},
  {title:'COULD YOUR ACTIONS TURN YOU INTO THE PROVIDER?',copy:'Under Article 25, an importer, distributor, deployer or other third party can become the provider of a high-risk AI system if it rebrands the system, substantially modifies it while it remains high-risk, or changes its intended purpose so it becomes high-risk.'},
];

const steps=[
  {title:'Establish the operator role before market activity',copy:'Record the provider, authorised representative, importer, distributor, product manufacturer and deployer roles. Do not rely only on contract labels; preserve the facts showing who places or makes the system available on the Union market.'},
  {title:'Verify the market-access evidence package',copy:'For high-risk systems, preserve conformity-assessment evidence, technical-documentation availability, CE marking, EU declaration of conformity, instructions for use, provider and importer identification, and authorised-representative evidence where applicable.'},
  {title:'Create a stop, notify and corrective-action path',copy:'Define who can halt placement or distribution, who must notify the provider, importer, authorised representative or market-surveillance authority, how recall or withdrawal is handled, and what evidence proves the response.'},
  {title:'Revalidate after rebranding, modification or intended-purpose change',copy:'A branding change, software update, integration, substantial modification or changed intended purpose can alter operator roles and may move an importer or distributor into provider obligations under Article 25.'},
];

const faqs=[
  {q:'What must an importer verify before placing a high-risk AI system on the EU market?',a:'Article 23 requires the importer to verify that the provider carried out the relevant conformity assessment, drew up the required technical documentation, affixed the CE marking, supplied the EU declaration of conformity and instructions for use, and appointed an authorised representative where required.'},
  {q:'What must a distributor verify before making a high-risk AI system available?',a:'Article 24 requires the distributor to verify the required CE marking, a copy of the EU declaration of conformity, instructions for use, and specified provider and importer obligations before making the system available.'},
  {q:'What if an importer believes the documentation is false or the system is non-conforming?',a:'The importer must not place the system on the market until it has been brought into conformity. If the system presents a relevant risk, the importer must inform the provider, authorised representative and market-surveillance authorities.'},
  {q:'Do importers have record-retention duties?',a:'Yes. Article 23 requires importers to keep specified conformity evidence for 10 years after the high-risk AI system has been placed on the market or put into service, including applicable notified-body certificates, instructions for use and the EU declaration of conformity.'},
  {q:'Can a distributor or importer become the provider?',a:'Yes. Article 25 can shift provider obligations to a distributor, importer, deployer or other third party that puts its own name or trademark on the high-risk system, makes a substantial modification while it remains high-risk, or changes the intended purpose so it becomes high-risk.'},
  {q:'Do importers and distributors have to cooperate with authorities?',a:'Yes. Articles 23 and 24 require cooperation with relevant competent authorities, including providing requested information and documentation and supporting actions to reduce or mitigate risks posed by high-risk systems.'},
  {q:'Does TA-14 certify that an importer or distributor has satisfied the AI Act?',a:'No. TA-14 can preserve the operator-role basis, verification evidence, non-conformity state, corrective actions, authority communications, role changes and revalidation history. It does not provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function ImportersDistributorsPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · IMPORTERS · DISTRIBUTORS · ARTICLES 23–25"
  title="IF YOU PUT AI INTO THE EU MARKET,"
  accent="YOU NEED MORE THAN A VENDOR PROMISE."
  intro="Importers and distributors sit inside the EU AI Act’s market-access chain. For high-risk AI systems, they must verify specific conformity evidence, stop market activity when non-conformity is suspected, support corrective action, cooperate with authorities, and watch for changes that can shift them into the provider role."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Articles 23, 24 and 25"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="Articles 23 and 24 establish specific verification, non-conformity, record, cooperation and corrective-action duties for importers and distributors of high-risk AI systems. Article 25 can shift provider obligations to another supply-chain actor after rebranding, substantial modification or a changed intended purpose."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=importers-distributors"
  workspaceHref="/eu-ai-act/commercial"
  workspaceLabel="BUILD THE MARKET-ACCESS RECORD →"
/>}
