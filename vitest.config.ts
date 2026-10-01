import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// tsconfig uses "jsx": "preserve" for Next.js; tests that render React
// components need Vite to transform JSX itself.
export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  // Mirror the tsconfig "@/*" → "apps/web/*" path so route modules can be imported in tests.
  resolve: { alias: [{ find: /^@\//, replacement: fileURLToPath(new URL("./apps/web/", import.meta.url)) }] },
});
