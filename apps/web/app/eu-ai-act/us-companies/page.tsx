import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
 title:'EU AI Act Compliance for US Companies',
 description:'Understand when the EU AI Act can affect US and other non-EU AI providers and deployers, then classify one AI system and preserve the evidence behind the position.',
 alternates:{canonical:'/eu-ai-act/us-companies'},
 keywords:['EU AI Act US companies','EU AI Act non EU companies','EU AI Act extraterritorial scope','EU AI Act US SaaS','EU AI Act American companies'],
 openGraph:{title:'EU AI Act Compliance for US Companies | TA-14',description:'US and non-EU companies can face EU AI Act obligations depending on market placement, deployment and where AI outputs are used.',url:'/eu-ai-act/us-companies',type:'website'}
};

export default function Page(){return <SeoAcquisitionPage
 eyebrow="EU AI ACT · NON-EU / US COMPANY ROUTE"
 title="BASED IN THE UNITED STATES?"
 accent="EU AI ACT EXPOSURE CAN STILL EXIST."
 intro="A company does not necessarily have to be established in the European Union for the EU AI Act to matter. The Regulation contains territorial-scope rules that can reach providers placing AI systems or models on the EU market and certain providers or deployers where AI-system output is used in the Union. The right starting point is the specific system and route—not the company’s mailing address alone."
 sourceLabel="Regulation (EU) 2024/1689 · Article 2 territorial scope"
 sourceHref="https://eur-lex.europa.eu/eli/reg/2024/1689/oj"
 sourceNote="Article 2 of the EU AI Act defines territorial scope, including circumstances involving providers established outside the Union and providers or deployers whose AI-system output is used in the Union."
 classifierHref="/eu-ai-act/classifier?source=us-companies"
 cards={[
  {title:'Selling AI into the EU',copy:'If a US company places an AI system or general-purpose AI model on the EU market, location outside Europe does not by itself remove the need for an EU AI Act scope analysis.'},
  {title:'AI output used in the Union',copy:'For certain providers and deployers outside the EU, the location where the AI-system output is used can be material to territorial scope.'},
  {title:'EU customers and deployment context',copy:'Map which entity contracts with EU customers, who provides or deploys the system, where it is put into service and what intended purpose is represented.'},
  {title:'Representative and downstream duties',copy:'Depending on the role and system, non-EU providers may need to examine representative, documentation, transparency or downstream-support requirements rather than assuming a US compliance program is sufficient.'},
 ]}
 steps={[
  {title:'Define the company-system relationship',copy:'Identify the legal entity, product or model, contracting route, intended purpose, users, customers and deployment geography.'},
  {title:'Classify the regulated actor',copy:'Separate provider, deployer, importer, distributor, product-manufacturer, authorised-representative and GPAI-provider questions.'},
  {title:'Map EU exposure and obligations',copy:'Record why the EU AI Act may be included, excluded, conditional or unresolved for this specific system rather than making a company-wide assumption.'},
  {title:'Preserve the evidence and changes',copy:'Keep the contracts, technical documentation, notices, tests, role determinations, versions and changes connected to the proposition they support.'},
 ]}
 faqs={[
  {q:'Does the EU AI Act apply only to companies located in Europe?',a:'No. The Regulation includes territorial-scope provisions that can apply to certain providers outside the EU and to certain providers or deployers where AI-system output is used in the Union.'},
  {q:'If we only have EU customers, does that automatically mean the Act applies?',a:'Not automatically in the same way to every system. Market placement, actor role, use, output location, exclusions and the system category all matter. The analysis should be system-specific.'},
  {q:'Can a US company use this workspace?',a:'Yes. The workspace is designed to preserve system identity, role, scope, evidence, obligations and change regardless of headquarters location. It does not replace EU legal counsel where legal advice is required.'},
  {q:'Should we wait until every later high-risk deadline before starting?',a:'No general answer fits every organization. Some obligations already apply, including Article 50 transparency obligations from 2 August 2026, while other provisions follow different timelines. Early system inventory and evidence mapping can reduce later reconstruction work.'},
 ]}
/>}
