import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },

  outputFileTracingRoot: path.resolve(process.cwd(), "../.."),

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
