import path from "node:path";
import type { NextConfig } from "next";

// next.config.ts is loaded by Next's own config loader, which cannot resolve relative TypeScript imports,
// so these values are declared here. They MUST equal apps/web/lib/site/canonical-origin.ts; the
// canonical-domain regression test enforces that.
export const CANONICAL_EXCHANGE_ORIGIN = "https://www.ta14exchange.com";
export const VERCEL_PRODUCTION_ALIAS_HOSTS = ["ta14-exchange-platform-theta.vercel.app"] as const;

/**
 * The raw Vercel production alias must not operate as an independent public TA-14 surface: page,
 * sitemap and robots requests to it are permanently redirected to the same path on the canonical
 * origin. Excluded on purpose:
 *   - /api/*   Vercel cron jobs, webhooks and API clients may call the deployment host directly;
 *   - /_next/* build assets.
 * Only the exact production alias hosts match, so preview deployments keep serving on their own URLs.
 */
const escapeHostPattern = (host: string) => host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const vercelProductionAliasRedirects = VERCEL_PRODUCTION_ALIAS_HOSTS.map((host) => ({
  source: "/:path((?!api(?:/|$)|_next/).*)",
  has: [{ type: "host" as const, value: escapeHostPattern(host) }],
  destination: `${CANONICAL_EXCHANGE_ORIGIN}/:path`,
  permanent: true,
}));

const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },

  env: {
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabasePublicKey,
  },

  outputFileTracingRoot: path.resolve(process.cwd(), "../.."),

  async redirects() {
    return [
      ...vercelProductionAliasRedirects,
      {
        source: "/workspace/ai-governance/registry/records/TA-14-AIGR-000008",
        destination: "/registry/TA-14-AIGR-000008",
        permanent: true,
      },
      {
        source: "/workspace/ai-governance/registry/records/TA-14-AIGR-000011",
        destination: "/registry/TA-14-AIGR-000011",
        permanent: true,
      },
      {
        source: "/workspace/ai-governance/registry/records/TA-14-AIGR-000025",
        destination: "/registry/TA-14-AIGR-000025",
        permanent: true,
      },
      {
        source: "/workspace/ai-governance/registry/showcase",
        destination: "/governance-showcase",
        permanent: true,
      },
      {
        source: "/workspace/ai-governance/registry/showcase/:registryIdentifier",
        destination: "/governance-showcase/:registryIdentifier",
        permanent: true,
      },
    ];
  },

  webpack(config) {
    config.resolve = config.resolve ?? {};

    config.resolve.modules = [
      path.resolve(process.cwd(), "node_modules"),
      ...(config.resolve.modules ?? ["node_modules"]),
    ];

    return config;
  },
};

export default nextConfig;
