import type { MetadataRoute } from 'next';

const baseUrl = 'https://ta14exchange.com';

const routes = [
  '/',
  '/eu-ai-act',
  '/eu-ai-act/start',
  '/eu-ai-act/classifier',
  '/eu-ai-act/article-50',
  '/eu-ai-act/high-risk',
  '/eu-ai-act/fundamental-rights',
  '/eu-ai-act/source-state',
  '/eu-ai-act/system-passport',
  '/eu-ai-act/passport',
  '/eu-ai-act/proof-lab',
  '/eu-ai-act/command-center',
  '/eu-ai-act/commercial',
  '/eu-ai-act/join',
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
