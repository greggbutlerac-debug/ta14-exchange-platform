"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

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
  const body = JSON.stringify(data);

  // sendBeacon is the most reliable path for analytics because navigation
  // cannot cancel an in-flight event. Fall back to keepalive fetch where
  // Beacon is unavailable or declines the payload.
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/seo-intelligence/collect", blob)) return;
  }

  void fetch("/api/seo-intelligence/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    cache: "no-store",
    credentials: "same-origin",
  }).catch(() => {});
}

export function SeoIntelligenceTracker() {
  const pathname = usePathname();
  const last = useRef("");

  useEffect(() => {
    if (!pathname || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const key = `${pathname}?${params.toString()}`;
    if (last.current === key) return;
    last.current = key;

    // Run after hydration/paint so telemetry never blocks the page.
    const timer = window.setTimeout(() => send(payload(pathname, params)), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
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
