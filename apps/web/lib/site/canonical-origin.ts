/**
 * Canonical public identity of the TA-14 Exchange.
 *
 * Vercel remains deployment infrastructure, but its hostnames are not public TA-14 surfaces. Every
 * absolute URL the application generates for public navigation, metadata, feeds, sitemaps, shared links
 * or documents must use a canonical TA-14 domain, never a `*.vercel.app` host.
 *
 * `https://www.ta14exchange.com` is the established canonical Exchange origin (sitemap.ts, robots.ts,
 * account recovery, README). `www.ta14authority.org` is a distinct, intentional TA-14 domain served by
 * the same deployment and is not rewritten here.
 */
export const CANONICAL_EXCHANGE_ORIGIN = "https://www.ta14exchange.com";

/**
 * The raw Vercel production alias that must no longer operate as an independent public surface.
 * Requests to it are permanently redirected to the canonical origin (see next.config.ts). Preview
 * deployment hosts are deliberately NOT listed, so previews keep working on their own URLs.
 */
export const VERCEL_PRODUCTION_ALIAS_HOSTS = ["ta14-exchange-platform-theta.vercel.app"] as const;

/** Absolute canonical URL for a path on the Exchange. */
export function canonicalExchangeUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${CANONICAL_EXCHANGE_ORIGIN}${normalizedPath}`;
}

/** True for any Vercel-hosted deployment hostname (production alias or preview). */
export function isVercelDeploymentHost(host: string): boolean {
  const hostname = host.trim().toLowerCase().replace(/:\d+$/, "");
  return hostname === "vercel.app" || hostname.endsWith(".vercel.app");
}

/**
 * Origin to use when building links that leave the current page (sharing, copying). Keeps intentional
 * TA-14 domains (Exchange, Authority) and local development as they are, but never emits a Vercel host.
 */
export function publicOriginFor(currentOrigin: string | undefined | null): string {
  if (!currentOrigin) return CANONICAL_EXCHANGE_ORIGIN;
  try {
    const url = new URL(currentOrigin);
    return isVercelDeploymentHost(url.host) ? CANONICAL_EXCHANGE_ORIGIN : url.origin;
  } catch {
    return CANONICAL_EXCHANGE_ORIGIN;
  }
}
