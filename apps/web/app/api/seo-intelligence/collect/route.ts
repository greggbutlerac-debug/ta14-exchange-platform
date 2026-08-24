import { randomUUID } from "crypto";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const VISIT_COOKIE = "ta14_seo_visit_id";
const MAX = 500;

function clean(value: unknown, max = MAX) {
  return typeof value === "string" ? value.slice(0, max) : null;
}

function engine(host: string | null) {
  if (!host) return null;
  const h = host.toLowerCase();
  if (h.includes("google.")) return "Google";
  if (h.includes("bing.com")) return "Bing";
  if (h.includes("duckduckgo.com")) return "DuckDuckGo";
  if (h.includes("yahoo.")) return "Yahoo";
  if (h.includes("ecosia.org")) return "Ecosia";
  if (h.includes("perplexity.ai")) return "Perplexity";
  if (h.includes("chatgpt.com") || h.includes("openai.com")) return "ChatGPT";
  return null;
}

function device(ua: string) {
  if (/bot|crawler|spider/i.test(ua)) return "bot";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobile|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

export async function POST(req: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return NextResponse.json({ ok: false }, { status: 503 });

    const body = await req.json().catch(() => ({}));
    const eventType = body?.eventType === "click" ? "click" : "page_view";
    const pagePath = clean(body?.pagePath, 1000);
    if (!pagePath) return NextResponse.json({ ok: false }, { status: 400 });

    const cookieStore = await cookies();
    const existing = cookieStore.get(VISIT_COOKIE)?.value;
    const visitId = existing ?? randomUUID();
    const h = await headers();
    const ua = h.get("user-agent") ?? "";
    const referrer = clean(body?.referrer, 2000);
    let referrerHost: string | null = null;
    let searchQuery: string | null = null;
    try {
      if (referrer) {
        const r = new URL(referrer);
        referrerHost = r.hostname;
        searchQuery = clean(r.searchParams.get("q") ?? r.searchParams.get("p") ?? r.searchParams.get("query"), 500);
      }
    } catch {}

    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await db.from("ta14_seo_intelligence_events").insert({
      event_type: eventType,
      visit_id: visitId,
      page_path: pagePath,
      page_title: clean(body?.pageTitle, 500),
      target_href: clean(body?.targetHref, 2000),
      target_text: clean(body?.targetText, 500),
      referrer: referrer,
      referrer_host: referrerHost,
      search_engine: engine(referrerHost),
      search_query: searchQuery,
      utm_source: clean(body?.utmSource),
      utm_medium: clean(body?.utmMedium),
      utm_campaign: clean(body?.utmCampaign),
      utm_term: clean(body?.utmTerm),
      utm_content: clean(body?.utmContent),
      country: clean(h.get("x-vercel-ip-country"), 100),
      region: clean(h.get("x-vercel-ip-country-region"), 150),
      city: clean(h.get("x-vercel-ip-city"), 200),
      latitude: Number(h.get("x-vercel-ip-latitude")) || null,
      longitude: Number(h.get("x-vercel-ip-longitude")) || null,
      user_agent: clean(ua, 1000),
      device_class: device(ua),
      metadata: { source: "ta14-exchange", schema: 1 },
    });
    if (error) throw error;

    const response = NextResponse.json({ ok: true });
    if (!existing) response.cookies.set({ name: VISIT_COOKIE, value: visitId, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  } catch (error) {
    console.error("SEO_INTELLIGENCE_COLLECT_FAILED", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
