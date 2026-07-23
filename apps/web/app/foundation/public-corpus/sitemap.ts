import type { MetadataRoute } from "next";

import { TA14_PUBLIC_CORPUS } from "./corpus";

const FALLBACK_SITE_URL = "https://ta14-exchange-platform-theta.vercel.app";

function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!configuredUrl) return FALLBACK_SITE_URL;

  const normalizedUrl = configuredUrl.startsWith("http")
    ? configuredUrl
    : `https://${configuredUrl}`;

  return normalizedUrl.replace(/\/$/, "");
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
