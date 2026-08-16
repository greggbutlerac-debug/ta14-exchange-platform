import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for AI Agents and Autonomous Workflows',
  description:'A practical EU AI Act guide for AI agents and autonomous workflows: classification, delegated authority, tool use, human oversight, logging, transparency, change control and revalidation.',
  alternates:{canonical:'/eu-ai-act/ai-agents-autonomous-workflows'},
  keywords:['EU AI Act AI agents','autonomous AI compliance EU','agentic AI governance','AI workflow compliance Europe','AI agent human oversight','AI agent logging EU AI Act'],
  openGraph:{title:'EU AI Act Compliance for AI Agents and Autonomous Workflows | TA-14',description:'A governed approach to agentic AI, delegated authority, tool use, logging, oversight and revalidation under the EU AI Act.',url:'/eu-ai-act/ai-agents-autonomous-workflows',type:'website'}
};

const cards=[
  {title:'WHAT CAN THE AGENT ACTUALLY DO?',copy:'Classify the real capability boundary: read, recommend, draft, call tools, change records, approve, purchase, communicate, trigger external systems or execute transactions. Risk turns on intended purpose and consequence, not the label “agent.”'},
  {title:'DOES DELEGATED AUTHORITY MOVE THE SYSTEM INTO A HIGH-RISK USE?',copy:'An agent used in recruitment, credit, healthcare, education, public benefits or another listed domain may inherit the high-risk route of that intended purpose. Agent autonomy does not create a separate legal category, but it can intensify the control problem.'},
  {title:'CAN A HUMAN ACTUALLY OVERRIDE OR STOP IT?',copy:'For high-risk AI, Article 14 requires effective human oversight proportionate to risk, autonomy and context, including the ability to understand limitations, disregard or reverse outputs, and intervene or stop the system in a safe state where appropriate.'},
  {title:'CAN YOU RECONSTRUCT WHAT THE AGENT DID?',copy:'High-risk systems must support automatic logging. For agentic workflows, preserve prompts or instructions where appropriate, tool calls, approvals, outputs, execution events, model and workflow versions, exceptions, and the chain from recommendation to action.'},
];

const steps=[
  {title:'Define the agent boundary before classifying it',copy:'Separate the model, orchestrator, tools, memory, external APIs, human checkpoints and downstream systems. One “AI agent” may actually be a chain of several systems and operators.'},
  {title:'Classify by intended purpose and consequence',copy:'Test prohibited practices, high-risk routes, transparency duties and operator roles against what the workflow actually does. Do not assume that an agent is high-risk merely because it is autonomous—or low-risk because it began as a productivity tool.'},
  {title:'Bind authority, oversight and logging to every consequential action',copy:'Define which actions require approval, which can execute automatically, what evidence authorises them, how a human can interrupt or reverse the process, and what logs prove the action path afterward.'},
  {title:'Revalidate after tool, model or workflow changes',copy:'A new tool, broader permission, model swap, changed prompt, new memory source, removed approval gate or expanded intended purpose can materially change the classification and control state.'},
];

const faqs=[
  {q:'Does the EU AI Act have a separate legal category for AI agents?',a:'The Regulation does not create a standalone “AI agent” risk class. An agent is governed according to the AI system’s intended purpose, operator role, risk category and applicable obligations. Its level of autonomy can affect how human oversight and control measures must be designed.'},
  {q:'When can an AI agent become high-risk?',a:'When the agent is intended to perform or materially support a use listed in Article 6 or Annex III, or is part of a regulated product route under Article 6(1), it can fall within the high-risk framework. The actual use matters more than the marketing label.'},
  {q:'What does human oversight mean for autonomous workflows?',a:'For high-risk AI, Article 14 requires effective oversight by natural persons. Oversight measures must be proportionate to risk, autonomy and context, and should enable responsible humans to understand limitations, monitor operation, disregard or reverse outputs, and intervene or stop the system where appropriate.'},
  {q:'Do AI agents need logging?',a:'High-risk AI systems must technically allow automatic recording of relevant events over their lifetime under Article 12. In an agentic workflow, logs should be sufficient to reconstruct relevant tool use, decisions, interventions, failures and material execution events.'},
  {q:'What if an agent talks directly to customers or users?',a:'Article 50 transparency duties can also apply where people interact directly with AI, including obligations that have applied since 2 August 2026. Agentic capability does not replace those transparency requirements.'},
  {q:'Does TA-14 certify an autonomous workflow as compliant?',a:'No. TA-14 can preserve the role analysis, intended purpose, authority model, oversight design, logs, evidence, changes and revalidation history. It does not provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function AiAgentsAutonomousWorkflowsPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · AI AGENTS · AUTONOMOUS WORKFLOWS · TOOL USE"
  title="WHEN AI CAN ACT,"
  accent="AUTHORITY HAS TO BE GOVERNED BEFORE EXECUTION."
  intro="Agentic AI changes the operational problem because the system may no longer stop at generating an answer. It can call tools, alter records, trigger external systems and cause real-world effects. Under the EU AI Act, the legal route still turns on intended purpose and role—but autonomy makes authority, oversight, logging and change control much more consequential."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Articles 12–14 and Risk-Based Classification"
  sourceHref="https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=en"
  sourceNote="The AI Act does not create a standalone legal class for AI agents. Relevant obligations follow from the system’s intended purpose, operator role and risk category. For high-risk AI, the Regulation requires automatic event logging, sufficient transparency for deployers, and effective human oversight proportionate to the risks, level of autonomy and context of use."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=ai-agents-autonomous-workflows"
  workspaceHref="/eu-ai-act/commercial"
  workspaceLabel="BUILD THE AGENT GOVERNANCE RECORD →"
/>}
