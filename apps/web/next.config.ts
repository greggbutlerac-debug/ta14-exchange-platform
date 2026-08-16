import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },

  outputFileTracingRoot: path.resolve(process.cwd(), "../.."),

  async redirects() {
    return [
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
