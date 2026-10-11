import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

// Preserve Next.js JSX transform and resolve application imports for tests.
export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  resolve: { alias: { '@': fileURLToPath(new URL('./apps/web', import.meta.url)) } },
});
