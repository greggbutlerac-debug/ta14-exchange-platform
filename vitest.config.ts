import path from "node:path";
import { defineConfig } from "vitest/config";

// tsconfig uses "jsx": "preserve" for Next.js; tests that render React
// components need Vite to transform JSX itself.
// "@/..." mirrors the tsconfig path alias so route handlers can be imported
// in tests (matches only "@" or "@/...", never "@scope/pkg").
export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "apps/web") } },
});
