"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type SiteActivityResponse = {
  counted: boolean;
  newVisitor?: boolean;
  visitors?: number;
  pageViews?: number;
  updatedAt?: string;
};

type SiteActivityState = {
  visitors: number | null;
  pageViews: number | null;
  status: "loading" | "ready" | "unavailable";
};

function formatCount(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

function displayCount(value: number | null, status: SiteActivityState["status"]): string {
  if (status === "loading") return "···";
  return formatCount(value);
}

export function SiteActivityCounter() {
  const pathname = usePathname();
  const lastCountedPathRef = useRef<string | null>(null);
  const [activity, setActivity] = useState<SiteActivityState>({ visitors: null, pageViews: null, status: "loading" });

  useEffect(() => {
    if (!pathname || lastCountedPathRef.current === pathname) return;
    lastCountedPathRef.current = pathname;
    const controller = new AbortController();

    async function recordActivity() {
      try {
        const response = await fetch("/api/site-activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: pathname }),
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Site activity request failed: ${response.status}`);
        const payload = (await response.json()) as SiteActivityResponse;
        if (!payload.counted || typeof payload.visitors !== "number" || typeof payload.pageViews !== "number") {
          setActivity((current) => ({ ...current, status: "unavailable" }));
          return;
        }
        setActivity({ visitors: payload.visitors, pageViews: payload.pageViews, status: "ready" });
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Unable to load TA-14 site activity:", error);
        setActivity((current) => ({ ...current, status: "unavailable" }));
      }
    }

    void recordActivity();
    return () => controller.abort();
  }, [pathname]);

  const metrics = [
    { label: "Visitors", value: displayCount(activity.visitors, activity.status), note: "Recorded public visitors" },
    { label: "Page Views", value: displayCount(activity.pageViews, activity.status), note: "Recorded Exchange views" },
  ];

  return (
    <section aria-label="TA-14 Exchange public activity" className="relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-[radial-gradient(circle_at_90%_0%,rgba(34,211,238,0.10),transparent_36%),linear-gradient(145deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
      <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-7">
        <div>
          <div className="flex items-center gap-3">
            <span className={`h-2 w-2 rounded-full ${activity.status === "ready" ? "bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.85)]" : "bg-slate-500"}`} />
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-cyan-200/80">TA-14 Exchange Activity</p>
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">Public network activity</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Live cumulative activity recorded across the public Exchange surface.</p>
          <div className="mt-4 inline-flex items-center rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {activity.status === "ready" ? "Live totals · network online" : activity.status === "loading" ? "Refreshing public totals" : "Totals temporarily unavailable"}
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-3 sm:min-w-[360px]">
          {metrics.map((metric) => (
            <div key={metric.label} className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-5 py-5">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <p className="text-3xl font-bold tracking-[-0.04em] tabular-nums text-white sm:text-4xl">{metric.value}</p>
              <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-cyan-200/70">{metric.label}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{metric.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
