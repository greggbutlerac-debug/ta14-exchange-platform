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
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

export function SiteActivityCounter() {
  const pathname = usePathname();
  const lastCountedPathRef = useRef<string | null>(null);
  const [activity, setActivity] = useState<SiteActivityState>({
    visitors: null,
    pageViews: null,
    status: "loading",
  });

  useEffect(() => {
    if (!pathname || lastCountedPathRef.current === pathname) {
      return;
    }

    lastCountedPathRef.current = pathname;

    const controller = new AbortController();

    async function recordActivity() {
      try {
        const response = await fetch("/api/site-activity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: pathname,
          }),
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Site activity request failed: ${response.status}`);
        }

        const payload = (await response.json()) as SiteActivityResponse;

        if (
          !payload.counted ||
          typeof payload.visitors !== "number" ||
          typeof payload.pageViews !== "number"
        ) {
          setActivity((current) => ({
            ...current,
            status: "unavailable",
          }));
          return;
        }

        setActivity({
          visitors: payload.visitors,
          pageViews: payload.pageViews,
          status: "ready",
        });
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }

        console.error("Unable to load TA-14 site activity:", error);

        setActivity((current) => ({
          ...current,
          status: "unavailable",
        }));
      }
    }

    void recordActivity();

    return () => {
      controller.abort();
    };
  }, [pathname]);

  return (
    <section
      aria-label="TA-14 Exchange public activity"
      className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 shadow-[0_0_30px_rgba(255,255,255,0.04)] backdrop-blur"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/45">
            TA-14 Exchange Activity
          </p>
          <p className="mt-1 text-sm text-white/65">
            Public activity recorded across the Exchange
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="min-w-28 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-center">
            <p className="text-2xl font-semibold tabular-nums text-white">
              {formatCount(activity.visitors)}
            </p>
            <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/45">
              Visitors
            </p>
          </div>

          <div className="min-w-28 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-center">
            <p className="text-2xl font-semibold tabular-nums text-white">
              {formatCount(activity.pageViews)}
            </p>
            <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/45">
              Page Views
            </p>
          </div>
        </div>
      </div>

      {activity.status === "unavailable" ? (
        <p className="mt-3 text-xs text-white/35">
          Public activity totals are temporarily unavailable.
        </p>
      ) : null}
    </section>
  );
}
