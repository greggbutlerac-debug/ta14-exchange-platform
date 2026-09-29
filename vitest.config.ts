import { defineConfig } from "vitest/config";

// tsconfig uses "jsx": "preserve" for Next.js; tests that render React
// components need Vite to transform JSX itself.
export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
});
