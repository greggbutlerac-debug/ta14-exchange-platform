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

function bindAuthenticatedUser() {
  void fetch("/api/seo-intelligence/bind-user", {
    method: "POST",
    cache: "no-store",
    credentials: "same-origin",
  }).catch(() => {});
}

function euFunnelSignal(text: string) {
  const t=text.trim().replace(/\s+/g," ").toUpperCase();
  if(!t)return null;
  if(t.includes("CONTINUE TO PAYPAL"))return "EU_FUNNEL_PAYPAL_CLICKED";
  if(t.includes("GO TO SECURE PAYMENT"))return "EU_FUNNEL_BOUNDARY_ACCEPTED";
  if(t==="CONTINUE →"||t==="CONTINUE")return "EU_FUNNEL_STEP_CONTINUE";
  if(t.includes("ANNUAL · SAVE")||t==="MONTHLY")return "EU_FUNNEL_BILLING_SELECTED";
  if(t==="SELECT"||t==="SELECTED")return "EU_FUNNEL_PLAN_SELECTED";
  return null;
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

    const telemetryTimer = window.setTimeout(() => send(payload(pathname, params)), 0);
    const bindTimer = window.setTimeout(bindAuthenticatedUser, 350);
    return () => {
      window.clearTimeout(telemetryTimer);
      window.clearTimeout(bindTimer);
    };
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const params = new URLSearchParams(window.location.search);
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (anchor?.href) {
        send({
          ...payload(window.location.pathname, params),
          eventType: "click",
          targetHref: anchor.href,
          targetText: (anchor.innerText || anchor.getAttribute("aria-label") || "").trim().slice(0, 500),
        });
        return;
      }
      if(window.location.pathname!=="/eu-ai-act/join")return;
      const button=target.closest("button") as HTMLButtonElement|null;
      if(!button)return;
      const text=(button.innerText||button.getAttribute("aria-label")||"").trim().slice(0,500);
      const signal=euFunnelSignal(text);
      if(!signal)return;
      send({...payload(window.location.pathname,params),eventType:"click",targetHref:`ta14://commercial-funnel/${signal.toLowerCase()}`,targetText:signal,metadata:{funnel:"eu-ai-act",signal}});
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(()=>{
    const onChange=(event:Event)=>{
      if(window.location.pathname!=="/eu-ai-act/join")return;
      const target=event.target;
      if(!(target instanceof HTMLInputElement)||target.type!=="checkbox"||!target.checked)return;
      const params=new URLSearchParams(window.location.search);
      send({...payload(window.location.pathname,params),eventType:"click",targetHref:"ta14://commercial-funnel/eu_funnel_boundary_checkbox_accepted",targetText:"EU_FUNNEL_BOUNDARY_CHECKBOX_ACCEPTED",metadata:{funnel:"eu-ai-act",signal:"EU_FUNNEL_BOUNDARY_CHECKBOX_ACCEPTED"}});
    };
    document.addEventListener("change",onChange,true);
    return()=>document.removeEventListener("change",onChange,true);
  },[]);

  return null;
}
