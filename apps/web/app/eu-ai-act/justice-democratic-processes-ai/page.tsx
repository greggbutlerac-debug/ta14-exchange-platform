import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Justice and Democratic Processes AI',
  description:'Understand high-risk AI pathways for courts, legal interpretation, alternative dispute resolution, elections and referenda under the EU AI Act, including human decision authority, evidence, oversight and revalidation.',
  alternates:{canonical:'/eu-ai-act/justice-democratic-processes-ai'},
  keywords:['EU AI Act justice AI','judicial AI high risk','AI courts EU AI Act','election AI high risk','democratic processes AI Act','Annex III justice AI'],
  openGraph:{title:'EU AI Act Compliance for Justice and Democratic Processes AI | TA-14',description:'A governed guide to Annex III justice and democratic-process AI pathways under the EU AI Act.',url:'/eu-ai-act/justice-democratic-processes-ai',type:'website'}
};

const cards=[
  {title:'IS AI ASSISTING A JUDICIAL AUTHORITY WITH FACTS OR LAW?',copy:'Annex III classifies certain AI intended to assist judicial authorities, or act on their behalf, in researching and interpreting facts and law and applying the law to a concrete set of facts as high-risk.'},
  {title:'IS THE SYSTEM USED IN LEGALLY EFFECTIVE DISPUTE RESOLUTION?',copy:'AI used by alternative dispute resolution bodies can also fall on the high-risk route when the system performs those justice-related functions and the proceeding produces legal effects for the parties.'},
  {title:'IS AI DIRECTLY INFLUENCING VOTERS OR ELECTION OUTCOMES?',copy:'Annex III also treats AI intended to influence the outcome of an election or referendum, or the voting behaviour of natural persons in the exercise of their vote, as high-risk, subject to the Regulation’s exception for purely administrative or logistical campaign tools whose outputs are not directly exposed to voters.'},
  {title:'CAN YOU PROVE THE HUMAN DECISION-MAKER REMAINED ACCOUNTABLE?',copy:'Preserve the system’s role, authority boundary, source material, model and version, human review, reasoning inputs, override path, logs, material changes and the evidence showing that AI supported rather than silently replaced the accountable human decision.'},
];

const steps=[
  {title:'Define the justice or democratic function precisely',copy:'Separate legal research, fact analysis, law application, administrative support, dispute resolution, campaign logistics, voter-facing influence and election optimisation. These functions do not all sit on the same AI Act route.'},
  {title:'Classify under Annex III and preserve any Article 6(3) analysis',copy:'Determine whether the system materially influences a listed justice or democratic-process use. If a provider relies on the Article 6(3) non-high-risk route, preserve the documented basis before placing the system on the market or putting it into service.'},
  {title:'Bind human authority and evidence to the consequential decision',copy:'Connect source material, system output, human interpretation, decision authority, review, logging, limitations, challenge or appeal pathways and any correction record so the outcome remains reconstructable.'},
  {title:'Revalidate after model, law, procedure or campaign changes',copy:'A new model, changed legal source, jurisdiction, workflow, dispute-resolution role, voter-facing feature or campaign use can make the prior classification and evidence stale.'},
];

const faqs=[
  {q:'Is AI used by courts high-risk under the EU AI Act?',a:'Certain judicial AI systems are. Annex III covers AI intended to assist a judicial authority, or act on its behalf, in researching and interpreting facts and the law and applying the law to a concrete set of facts.'},
  {q:'Can AI make the final judicial decision?',a:'The Regulation’s recitals state that AI may support judges and judicial independence, but should not replace the final human decision. Final decision-making must remain human-driven.'},
  {q:'Are all court administrative tools high-risk?',a:'No. Purely ancillary administrative activities that do not affect the actual administration of justice in individual cases—such as anonymisation, pseudonymisation, personnel communication or routine administrative tasks—are distinguished from the high-risk judicial route.'},
  {q:'Is election-related AI high-risk?',a:'Certain AI intended to influence election or referendum outcomes or the voting behaviour of natural persons is high-risk. The Regulation excludes purely administrative or logistical campaign tools whose outputs are not directly exposed to natural persons.'},
  {q:'What evidence should be preserved?',a:'Preserve system identity and version, intended purpose, authority, source material, classification basis, human decision role, logs, limitations, appeal or challenge routes, changes and the evidence supporting each material decision or influence claim.'},
  {q:'Does TA-14 determine whether a judicial or election AI use is legally permissible?',a:'No. TA-14 can preserve the classification basis, authority claim, evidence, decision scope, gaps, review history and revalidation state. It does not provide legal advice, judicial authorisation, conformity assessment, certification or regulatory approval.'},
];

export default function JusticeDemocraticProcessesAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · JUSTICE · COURTS · DEMOCRATIC PROCESSES"
  title="WHEN AI TOUCHES LAW OR THE VOTE,"
  accent="HUMAN AUTHORITY HAS TO REMAIN REAL."
  intro="AI used in courts, legally effective dispute resolution, elections and referenda can sit directly inside Annex III high-risk pathways. The central governance question is whether the system merely supports an accountable human process—or materially influences a legal or democratic outcome without a durable evidence and authority record."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Annex III, Point 8"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="The Regulation classifies specified AI used in the administration of justice and democratic processes as high-risk, including certain judicial-assistance systems and systems intended to influence election or referendum outcomes or voting behaviour. It also states that final judicial decision-making must remain human-driven and distinguishes purely ancillary administrative activities."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=justice-democratic-processes-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
