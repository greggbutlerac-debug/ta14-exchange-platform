import type { MetadataRoute } from "next";

import { CANONICAL_EXCHANGE_ORIGIN } from "../../../lib/site/canonical-origin";
import { TA14_PUBLIC_CORPUS } from "./corpus";

// Sitemap URLs always use the canonical Exchange origin (matching app/sitemap.ts and robots.ts).
// Deployment-derived hosts (VERCEL_URL / VERCEL_PROJECT_PRODUCTION_URL) are Vercel infrastructure.
function getSiteUrl() {
  return CANONICAL_EXCHANGE_ORIGIN;
}

function getLastModified(date: string | undefined, year: number) {
  if (date) {
    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return new Date(`${year}-01-01T00:00:00.000Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const corpusIndex: MetadataRoute.Sitemap[number] = {
    url: `${siteUrl}/foundation/public-corpus`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  };

  const recordEntries: MetadataRoute.Sitemap = TA14_PUBLIC_CORPUS.map(
    (record) => ({
      url: `${siteUrl}/foundation/public-corpus/${encodeURIComponent(record.id)}`,
      lastModified: getLastModified(record.date, record.year),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [corpusIndex, ...recordEntries];
}
