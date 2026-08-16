import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Synthetic Media, Deepfakes and AI-Generated Content',
  description:'Understand Article 50 transparency duties for deepfakes and AI-generated or manipulated content, including provider marking, deployer disclosure, editorial exceptions, evidence, and revalidation.',
  alternates:{canonical:'/eu-ai-act/synthetic-media-deepfakes'},
  keywords:['EU AI Act deepfakes','Article 50 deepfake disclosure','AI generated content transparency EU','synthetic media AI Act','machine readable AI content marking','AI content disclosure Europe'],
  openGraph:{title:'EU AI Act Compliance for Synthetic Media and Deepfakes | TA-14',description:'A governed guide to Article 50 transparency duties for synthetic and manipulated content.',url:'/eu-ai-act/synthetic-media-deepfakes',type:'website'}
};

const cards=[
  {title:'IS THE CONTENT AI-GENERATED OR AI-MANIPULATED?',copy:'Article 50 distinguishes provider-side marking duties from deployer-side disclosure duties. Start by identifying whether the system generates or manipulates synthetic audio, image, video or text content and who is responsible for putting that content into use.'},
  {title:'IS MACHINE-READABLE MARKING REQUIRED?',copy:'Providers of AI systems that generate synthetic audio, image, video or text content must ensure outputs are marked in a machine-readable format and detectable as artificially generated or manipulated, subject to the Regulation’s technical-feasibility and proportionality conditions.'},
  {title:'IS THE CONTENT A DEEPFAKE OR PUBLIC-INTEREST TEXT?',copy:'Deployers of systems that generate or manipulate deepfake image, audio or video content must disclose that the content was artificially generated or manipulated. Article 50 also addresses AI-generated or manipulated text published to inform the public on matters of public interest.'},
  {title:'CAN YOU PROVE WHICH DISCLOSURE APPLIED TO WHICH VERSION?',copy:'Preserve the system version, content type, generation or manipulation event, marking method, user-facing disclosure, editorial process where relevant, publication context, exceptions relied on and the evidence showing the disclosure matched the actual content.'},
];

const steps=[
  {title:'Classify the content and operator role',copy:'Separate provider duties from deployer duties and distinguish synthetic text, image, audio and video. Determine whether the content qualifies as a deepfake, public-interest text, artistic work or another category.'},
  {title:'Apply the correct marking or disclosure route',copy:'Bind machine-readable marking, visible or otherwise appropriate disclosure, and any editorial-control exception to the exact content and publication context rather than relying on a generic website disclaimer.'},
  {title:'Preserve the disclosure evidence',copy:'Record the model and system version, content provenance, marking technology, disclosure text or signal, publication state, responsible operator and any human editorial review so the transparency action can be reconstructed later.'},
  {title:'Revalidate after model, content or distribution changes',copy:'A new generator, edited media, changed watermark or metadata process, new channel, removed disclosure, new editorial workflow or republishing event can make the prior transparency evidence stale.'},
];

const faqs=[
  {q:'What does Article 50 require for AI-generated content?',a:'Provider-side duties include ensuring certain synthetic audio, image, video and text outputs are marked in a machine-readable format and detectable as artificially generated or manipulated. Deployer-side duties include disclosure for certain deepfake content and certain AI-generated or manipulated public-interest text.'},
  {q:'Do deepfakes need to be disclosed?',a:'Yes. Deployers of AI systems that generate or manipulate image, audio or video content constituting a deepfake must disclose that the content has been artificially generated or manipulated, subject to the Regulation’s specific treatment for artistic, creative, satirical, fictional and analogous works.'},
  {q:'Does AI-generated text always need a disclosure?',a:'No. Article 50 specifically addresses AI-generated or manipulated text published to inform the public on matters of public interest. The Regulation also includes an exception where the AI-generated content has undergone human review or editorial control and a natural or legal person holds editorial responsibility for publication.'},
  {q:'Can a generic footer or privacy policy satisfy the disclosure duty?',a:'A generic disclosure may not prove that the relevant person encountered the required transparency at the right content and context. The better governance record ties the disclosure or marking to the actual content, publication event, system version and operator role.'},
  {q:'When did Article 50 transparency obligations start applying?',a:'Article 50 transparency obligations apply from 2 August 2026 under the AI Act’s application timeline.'},
  {q:'Does TA-14 certify synthetic media or deepfake content as compliant?',a:'No. TA-14 can preserve the content classification, operator role, marking and disclosure evidence, exceptions, gaps, publication state and revalidation history. It does not provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function SyntheticMediaDeepfakesPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · ARTICLE 50 · DEEPFAKES · SYNTHETIC MEDIA"
  title="IF AI MADE OR ALTERED THE CONTENT,"
  accent="THE DISCLOSURE HAS TO TRAVEL WITH IT."
  intro="Synthetic media governance is no longer just a trust-and-safety preference. Article 50 creates specific transparency duties for providers and deployers of systems that generate or manipulate content. The core operational problem is proving that the right marking or disclosure was attached to the right content, by the right actor, at the right time."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Article 50"
  sourceHref="https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=en"
  sourceNote="Article 50 establishes transparency duties for AI-generated and manipulated content, including machine-readable marking by certain providers and disclosure duties for certain deepfake and public-interest content. The Regulation also contains tailored treatment for artistic and similar works and an editorial-control exception for specified public-interest text."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=synthetic-media-deepfakes"
  workspaceHref="/eu-ai-act/article-50"
  workspaceLabel="OPEN ARTICLE 50 WORKSPACE →"
/>}
