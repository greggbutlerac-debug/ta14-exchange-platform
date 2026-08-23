import type { MetadataRoute } from 'next';

const baseUrl = 'https://ta14exchange.com';

const routes = [
  '/',
  '/transparent-air/gulfport-ac-repair',
  '/transparent-air/second-opinion',
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
  '/eu-ai-act/hiring-interviews-candidate-screening',
  '/eu-ai-act/employee-monitoring-workplace-ai',
  '/eu-ai-act/financial-services',
  '/eu-ai-act/credit-scoring-lending-ai',
  '/eu-ai-act/insurance-ai',
  '/eu-ai-act/healthcare-medical-ai',
  '/eu-ai-act/education-ai',
  '/eu-ai-act/education-admissions-testing-assessment-ai',
  '/eu-ai-act/ai-proctoring-exam-monitoring',
  '/eu-ai-act/biometric-ai',
  '/eu-ai-act/emotion-recognition-ai',
  '/eu-ai-act/law-enforcement-ai',
  '/eu-ai-act/migration-asylum-border-ai',
  '/eu-ai-act/critical-infrastructure-ai',
  '/eu-ai-act/public-benefits-essential-services-ai',
  '/eu-ai-act/public-administration-government-ai',
  '/eu-ai-act/justice-democratic-processes-ai',
  '/eu-ai-act/gpai-providers',
  '/eu-ai-act/importers-distributors',
  '/eu-ai-act/authorised-representatives',
  '/eu-ai-act/vendor-procurement',
  '/eu-ai-act/ai-agents-autonomous-workflows',
  '/eu-ai-act/synthetic-media-deepfakes',
  '/eu-ai-act/saas-companies',
  '/eu-ai-act/small-business',
  '/eu-ai-act/evidence-requirements',
  '/eu-ai-act/compliance-software',
  '/eu-ai-act/compliance-cost',
  '/eu-ai-act/compliance-help',
  '/eu-ai-act/provider-obligations',
  '/eu-ai-act/deployer-obligations',
  '/eu-ai-act/deadlines',
  '/eu-ai-act/readiness-assessment',
  '/eu-ai-act/audit-readiness',
  '/eu-ai-act/fines-penalties',
  '/eu-ai-act/ai-system-inventory',
  '/eu-ai-act/incident-reporting',
  '/eu-ai-act/conformity-assessment',
  '/eu-ai-act/post-market-monitoring',
  '/eu-ai-act/record-keeping',
  '/eu-ai-act/high-risk',
  '/eu-ai-act/high-risk-requirements',
  '/eu-ai-act/fundamental-rights',
  '/eu-ai-act/fundamental-rights-impact-assessment',
  '/eu-ai-act/source-state',
  '/eu-ai-act/system-passport',
  '/eu-ai-act/passport',
  '/eu-ai-act/proof-lab',
  '/eu-ai-act/command-center',
  '/eu-ai-act/commercial',
  '/eu-ai-act/readiness-review',
  '/academy/eu-ai-act',
  '/workspace/governed-records/eu-ai-act',
  '/ai-governance-registry',
  '/ai-governance',
  '/academy',
  '/marketplace',
  '/artifacts',
  '/artifacts/registry',
  '/artifacts/founding-demonstrations',
  '/artifacts/interoperability-examinations',
];

const executionArtifactRoutes = Array.from(
  { length: 40 },
  (_, index) => `/artifacts/ta14-ea-${String(index + 1).padStart(6, '0')}`,
);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const allRoutes = [...routes, ...executionArtifactRoutes];

  return allRoutes.map((route, index) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: index === 0 ? 'daily' : 'weekly',
    priority:
      route === '/'
        ? 1
        : route === '/artifacts/registry'
          ? 0.9
          : route.startsWith('/artifacts/ta14-ea-')
            ? 0.82
            : route.startsWith('/transparent-air')
              ? 0.95
              : route.startsWith('/eu-ai-act')
                ? 0.9
                : 0.7,
  }));
}
