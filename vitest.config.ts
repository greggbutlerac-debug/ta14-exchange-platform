import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

// Preserve the Next.js JSX test transform while resolving app imports.
export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./apps/web', import.meta.url)),
    },
  },
});
