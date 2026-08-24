"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function payload(pathname: string, params: URLSearchParams) {
  return {
    eventType: "page_view",
    pagePath: `${pathname}${params.toString() ? `?${params}` : ""}`,
    pageTitle: document.title,
    referrer: document.referrer,
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmTerm: params.get("utm_term"),
    utmContent: params.get("utm_content"),
  };
}

function send(data: Record<string, unknown>) {
  void fetch("/api/seo-intelligence/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    keepalive: true,
    cache: "no-store",
  }).catch(() => {});
}

export function SeoIntelligenceTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const last = useRef("");

  useEffect(() => {
    if (!pathname) return;
    const key = `${pathname}?${searchParams.toString()}`;
    if (last.current === key) return;
    last.current = key;
    send(payload(pathname, searchParams));
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a") as HTMLAnchorElement | null;
      if (!anchor?.href) return;
      const params = new URLSearchParams(window.location.search);
      send({
        ...payload(window.location.pathname, params),
        eventType: "click",
        targetHref: anchor.href,
        targetText: (anchor.innerText || anchor.getAttribute("aria-label") || "").trim().slice(0, 500),
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
