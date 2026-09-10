import fs from 'node:fs';
import path from 'node:path';

const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? '';
const isJxf6Project = productionUrl.includes('ta14-exchange-platform-jxf6');

if (!isJxf6Project) {
  process.exit(0);
}

const source = path.resolve('apps/web/.next');
const destination = path.resolve('vercel/path0/apps/web/.next');

if (!fs.existsSync(source)) {
  console.error(`[jxf6-output-compat] Missing Next.js output at ${source}`);
  process.exit(1);
}

fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.cpSync(source, destination, { recursive: true });
console.log(`[jxf6-output-compat] Mirrored ${source} -> ${destination}`);
