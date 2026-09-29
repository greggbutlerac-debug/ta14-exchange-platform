/**
 * Regression: the raw Vercel production alias must not operate as an independent public TA-14 surface,
 * and production navigation / metadata / feeds / sitemaps / shared links must never emit *.vercel.app URLs.
 *
 * Redirect matching uses Next.js's own route matchers (path-match, matchHas), so the test exercises the
 * same logic the router applies to `redirects()`.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createRequire } from "node:module";
import { afterEach, describe, expect, it } from "vitest";

import nextConfig, {
  CANONICAL_EXCHANGE_ORIGIN as CONFIG_CANONICAL_ORIGIN,
  VERCEL_PRODUCTION_ALIAS_HOSTS as CONFIG_ALIAS_HOSTS,
  vercelProductionAliasRedirects,
} from "../../apps/web/next.config";
import {
  CANONICAL_EXCHANGE_ORIGIN,
  VERCEL_PRODUCTION_ALIAS_HOSTS,
  canonicalExchangeUrl,
  isVercelDeploymentHost,
  publicOriginFor,
} from "../../apps/web/lib/site/canonical-origin";

const require = createRequire(import.meta.url);
const { getPathMatch } = require("next/dist/shared/lib/router/utils/path-match");
const { matchHas } = require("next/dist/shared/lib/router/utils/prepare-destination");

const PRODUCTION_ALIAS = "ta14-exchange-platform-theta.vercel.app";

type Redirect = { source: string; destination: string; permanent?: boolean; has?: Array<{ type: string; value?: string }> };

/** Resolve the first redirect Next.js would apply for a host + path, as the router does. */
async function resolveRedirect(host: string, pathname: string): Promise<{ location: string; permanent: boolean } | null> {
  const redirects = (await nextConfig.redirects!()) as Redirect[];
  for (const redirect of redirects) {
    const params = getPathMatch(redirect.source, { strict: true, removeUnnamedParams: true })(pathname);
    if (!params) continue;
    if (redirect.has && !matchHas({ headers: { host } }, {}, redirect.has, [])) continue;
    const location = redirect.destination.replace(/:(\w+)/g, (_m: string, key: string) => String(params[key] ?? ""));
    return { location, permanent: redirect.permanent === true };
  }
  return null;
}

describe("canonical TA-14 origin", () => {
  it("is the established canonical Exchange origin", () => {
    expect(CANONICAL_EXCHANGE_ORIGIN).toBe("https://www.ta14exchange.com");
    expect(canonicalExchangeUrl("/pricing")).toBe("https://www.ta14exchange.com/pricing");
    expect(canonicalExchangeUrl("pricing")).toBe("https://www.ta14exchange.com/pricing");
  });

  it("next.config.ts declares the same origin and alias hosts as the canonical-origin module", () => {
    expect(CONFIG_CANONICAL_ORIGIN).toBe(CANONICAL_EXCHANGE_ORIGIN);
    expect([...CONFIG_ALIAS_HOSTS]).toEqual([...VERCEL_PRODUCTION_ALIAS_HOSTS]);
  });
});

describe("raw Vercel production alias redirects to the canonical origin", () => {
  it("covers the production alias", () => {
    expect(VERCEL_PRODUCTION_ALIAS_HOSTS).toContain(PRODUCTION_ALIAS);
    expect(vercelProductionAliasRedirects.length).toBe(VERCEL_PRODUCTION_ALIAS_HOSTS.length);
  });

  it.each([
    ["/", "https://www.ta14exchange.com/"],
    ["/pricing", "https://www.ta14exchange.com/pricing"],
    ["/workspace/ai-governance/registry/review", "https://www.ta14exchange.com/workspace/ai-governance/registry/review"],
    ["/sitemap.xml", "https://www.ta14exchange.com/sitemap.xml"],
    ["/robots.txt", "https://www.ta14exchange.com/robots.txt"],
  ])("permanently redirects %s on the production alias", async (path, expected) => {
    expect(await resolveRedirect(PRODUCTION_ALIAS, path)).toEqual({ location: expected, permanent: true });
    expect(await resolveRedirect(`${PRODUCTION_ALIAS}:443`, path)).toEqual({ location: expected, permanent: true });
  });

  it.each(["/api/ai-governance/registry/admin-notifications/deliver", "/api/acceptance/institutional-finding/trigger", "/api", "/_next/static/chunks/main-app.js"])(
    "does not redirect %s (crons, webhooks, API clients and build assets keep working on the deployment host)",
    async (path) => {
      expect(await resolveRedirect(PRODUCTION_ALIAS, path)).toBeNull();
    },
  );

  it.each([
    "ta14-exchange-platform-git-feature-branch-greggbutlerac-debug.vercel.app",
    "ta14-exchange-platform-abc123def-greggbutlerac-debug.vercel.app",
    "localhost:3000",
    "www.ta14exchange.com",
    "www.ta14authority.org",
  ])("does not redirect host %s (previews, local development and canonical TA-14 domains are untouched)", async (host) => {
    expect(await resolveRedirect(host, "/pricing")).toBeNull();
    expect(await resolveRedirect(host, "/")).toBeNull();
  });

  it("does not match look-alike hosts through an unescaped pattern", async () => {
    expect(await resolveRedirect("ta14-exchange-platform-thetaXvercel.app", "/")).toBeNull();
    expect(await resolveRedirect(`evil-${PRODUCTION_ALIAS}`, "/")).toBeNull();
  });
});

describe("generated public URLs never use a Vercel host", () => {
  const savedEnv = { ...process.env };
  afterEach(() => { process.env = { ...savedEnv }; });

  it("share links keep TA-14 domains but replace Vercel hosts with the canonical origin", () => {
    expect(isVercelDeploymentHost(PRODUCTION_ALIAS)).toBe(true);
    expect(isVercelDeploymentHost("www.ta14exchange.com")).toBe(false);
    expect(publicOriginFor(`https://${PRODUCTION_ALIAS}`)).toBe(CANONICAL_EXCHANGE_ORIGIN);
    expect(publicOriginFor("https://ta14-exchange-platform-git-x-team.vercel.app")).toBe(CANONICAL_EXCHANGE_ORIGIN);
    expect(publicOriginFor("https://www.ta14authority.org")).toBe("https://www.ta14authority.org");
    expect(publicOriginFor("https://www.ta14exchange.com")).toBe("https://www.ta14exchange.com");
    expect(publicOriginFor(undefined)).toBe(CANONICAL_EXCHANGE_ORIGIN);
    expect(publicOriginFor("not a url")).toBe(CANONICAL_EXCHANGE_ORIGIN);
  });

  it("public-corpus sitemap uses the canonical origin even when Vercel deployment variables are set", async () => {
    process.env.VERCEL_URL = "ta14-exchange-platform-abc123-team.vercel.app";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = PRODUCTION_ALIAS;
    const { default: sitemap } = await import("../../apps/web/app/foundation/public-corpus/sitemap");
    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.url.startsWith(`${CANONICAL_EXCHANGE_ORIGIN}/`)).toBe(true);
      expect(entry.url).not.toMatch(/vercel\.app/i);
    }
  });

  it("public-corpus feed uses the canonical origin even when Vercel deployment variables are set", async () => {
    process.env.VERCEL_URL = "ta14-exchange-platform-abc123-team.vercel.app";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = PRODUCTION_ALIAS;
    const { GET } = await import("../../apps/web/app/foundation/public-corpus/feed.xml/route");
    const body = await (await GET()).text();
    expect(body).toContain(CANONICAL_EXCHANGE_ORIGIN);
    expect(body).not.toMatch(/vercel\.app/i);
  });
});

describe("source guard: production code never emits *.vercel.app or apex-only canonical URLs", () => {
  const WEB = "apps/web";
  const SCANNED_ROOTS = ["app", "components", "lib", "middleware.ts", "next.config.ts"];
  /** The only places allowed to name the Vercel production alias (the redirect's input, not an emitted URL). */
  const ALLOWED = new Set(["apps/web/lib/site/canonical-origin.ts", "apps/web/next.config.ts"]);

  function sourceFiles(path: string): string[] {
    const stats = statSync(path);
    if (stats.isFile()) return /\.(tsx?|jsx?|mjs|cjs|json|xml|txt|md)$/.test(path) ? [path] : [];
    return readdirSync(path)
      .filter((name) => name !== "node_modules" && !name.startsWith("."))
      .flatMap((name) => sourceFiles(join(path, name)));
  }
  const files = SCANNED_ROOTS.flatMap((root) => sourceFiles(join(WEB, root))).map((file) => relative(process.cwd(), file));

  it("scans the production source tree", () => {
    expect(files.length).toBeGreaterThan(100);
  });

  it("contains no *.vercel.app URL outside the canonical-origin module", () => {
    const offenders = files.filter((file) => !ALLOWED.has(file) && /vercel\.app/i.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("declares no canonical URL on the apex host (which only redirects to www)", () => {
    const offenders = files.filter((file) => /canonical\s*:\s*['"`]https:\/\/ta14exchange\.com/.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("uses the canonical origin as the root metadataBase", () => {
    expect(readFileSync(join(WEB, "app/layout.tsx"), "utf8")).toContain("metadataBase: new URL(CANONICAL_EXCHANGE_ORIGIN)");
  });

  it("keeps the main sitemap and robots on the canonical origin", () => {
    expect(readFileSync(join(WEB, "app/sitemap.ts"), "utf8")).toContain(CANONICAL_EXCHANGE_ORIGIN);
    const robots = readFileSync(join(WEB, "app/robots.ts"), "utf8");
    expect(robots).toContain(`${CANONICAL_EXCHANGE_ORIGIN}/sitemap.xml`);
    expect(robots).toContain(`host: '${CANONICAL_EXCHANGE_ORIGIN}'`);
  });
});
