import type { MetadataRoute } from 'next';

const baseUrl = 'https://ta14exchange.com';

const routes = [
  '/',
  '/eu-ai-act',
  '/eu-ai-act/start',
  '/eu-ai-act/classifier',
  '/eu-ai-act/system-classification',
  '/eu-ai-act/article-50',
  '/eu-ai-act/article-50-compliance',
  '/eu-ai-act/ai-literacy',
  '/eu-ai-act/us-companies',
  '/eu-ai-act/chatbots',
  '/eu-ai-act/customer-service-ai',
  '/eu-ai-act/recruitment-hr',
  '/eu-ai-act/financial-services',
  '/eu-ai-act/healthcare-medical-ai',
  '/eu-ai-act/saas-companies',
  '/eu-ai-act/small-business',
  '/eu-ai-act/evidence-requirements',
  '/eu-ai-act/compliance-software',
  '/eu-ai-act/high-risk',
  '/eu-ai-act/high-risk-requirements',
  '/eu-ai-act/fundamental-rights',
  '/eu-ai-act/source-state',
  '/eu-ai-act/system-passport',
  '/eu-ai-act/passport',
  '/eu-ai-act/proof-lab',
  '/eu-ai-act/command-center',
  '/eu-ai-act/commercial',
  '/academy/eu-ai-act',
  '/workspace/governed-records/eu-ai-act',
  '/ai-governance-registry',
  '/ai-governance',
  '/academy',
  '/marketplace',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route, index) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: index === 0 ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : route.startsWith('/eu-ai-act') ? 0.9 : 0.7,
  }));
}
