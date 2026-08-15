import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Article50ReceiptBridge from './Article50ReceiptBridge';

export const metadata: Metadata = {
  title: 'EU AI Act Article 50 Transparency Compliance',
  description:
    'Assess EU AI Act Article 50 transparency obligations for AI interactions, synthetic content, biometric and emotion-recognition notices, deepfakes, and public-interest text.',
  alternates: {
    canonical: '/eu-ai-act/article-50',
  },
  keywords: [
    'EU AI Act Article 50',
    'Article 50 transparency obligations',
    'AI chatbot disclosure EU',
    'deepfake disclosure EU AI Act',
    'synthetic content labeling EU AI Act',
  ],
  openGraph: {
    title: 'EU AI Act Article 50 Transparency Compliance | TA-14',
    description:
      'Map Article 50 applicability, disclosure evidence, gaps, exceptions, and governed records for AI systems and deployments.',
    url: '/eu-ai-act/article-50',
    type: 'website',
  },
};

export default function Article50Layout({children}:{children:ReactNode}){
 return <>{children}<Article50ReceiptBridge/></>;
}
