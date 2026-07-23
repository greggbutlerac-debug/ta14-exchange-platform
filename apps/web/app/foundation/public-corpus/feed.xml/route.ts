import { TA14_PUBLIC_CORPUS } from "../corpus";

export const dynamic = "force-static";
export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function getSiteUrl() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!configured) {
    return "https://ta14-exchange-platform-theta.vercel.app";
  }

  return configured.startsWith("http") ? configured : `https://${configured}`;
}

function getRecordDate(record: (typeof TA14_PUBLIC_CORPUS)[number]) {
  if (record.date) {
    const parsed = new Date(`${record.date}T12:00:00Z`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return new Date(Date.UTC(record.year, 0, 1, 12, 0, 0));
}

export async function GET() {
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const feedUrl = `${siteUrl}/foundation/public-corpus/feed.xml`;
  const corpusUrl = `${siteUrl}/foundation/public-corpus`;

  const items = [...TA14_PUBLIC_CORPUS]
    .sort((a, b) => getRecordDate(b).getTime() - getRecordDate(a).getTime())
    .map((record) => {
      const recordUrl = `${corpusUrl}/${encodeURIComponent(record.id)}`;
      const description =
        record.description ??
        record.relationship ??
        `A public record preserved in the complete TA-14 Public Corpus.`;

      const categories = [
        record.category,
        ...(record.tags ?? []),
      ]
        .map((category) => `<category>${escapeXml(category)}</category>`)
        .join("");

      return `
        <item>
          <title>${escapeXml(record.title)}</title>
          <link>${escapeXml(recordUrl)}</link>
          <guid isPermaLink="true">${escapeXml(recordUrl)}</guid>
          <pubDate>${getRecordDate(record).toUTCString()}</pubDate>
          <description>${escapeXml(description)}</description>
          ${record.author ? `<author>${escapeXml(record.author)}</author>` : ""}
          ${categories}
        </item>
      `.trim();
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Complete TA-14 Public Corpus</title>
    <link>${escapeXml(corpusUrl)}</link>
    <description>Books, articles, DOI records, patent filings, standards, repositories, public sites, implementations, and chronology preserved in the TA-14 public record.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
