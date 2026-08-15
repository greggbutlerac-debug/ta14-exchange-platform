import type { Metadata } from 'next';
import { Suspense } from 'react';
import GovernedSystemContextBar from '../components/GovernedSystemContextBar';

export const metadata: Metadata = {
  title: 'EU AI Act Classification Tool for AI Systems',
  description:
    'Classify an AI system by actor role, use case, risk pathway, exceptions, and unresolved facts before mapping EU AI Act obligations and evidence requirements.',
  alternates: {
    canonical: '/eu-ai-act/classifier',
  },
  keywords: [
    'EU AI Act classification tool',
    'EU AI Act risk classification',
    'AI system classifier EU',
    'EU AI Act provider deployer',
    'EU AI Act compliance checker',
  ],
  openGraph: {
    title: 'EU AI Act Classification Tool | TA-14',
    description:
      'Identify your role, system category, possible risk route, exceptions, and evidence still needed under the EU AI Act.',
    url: '/eu-ai-act/classifier',
    type: 'website',
  },
};

function SystemContextFallback(){
  return <div style={{padding:'15px max(24px,4vw)',borderBottom:'1px solid rgba(93,210,241,.28)',background:'linear-gradient(90deg,rgba(3,14,24,.98),rgba(6,27,42,.98),rgba(3,12,21,.98))',color:'#8fb6c8',fontFamily:'Inter,system-ui,sans-serif',fontSize:9}}>Loading governed system context…</div>;
}

export default function ClassifierLayout({children}:{children:React.ReactNode}){
  return <><Suspense fallback={<SystemContextFallback/>}><GovernedSystemContextBar/></Suspense>{children}</>;
}
