import path from "node:path";
import type { NextConfig } from "next";

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
