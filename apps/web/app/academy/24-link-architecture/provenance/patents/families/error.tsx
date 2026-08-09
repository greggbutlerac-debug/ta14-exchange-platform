"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function TA14PatentFamiliesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("TA-14 patent families route error", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-20 lg:px-8">
        <div className="w-full rounded-3xl border border-rose-300/20 bg-white/[0.03] p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-200">
            TA-14 Patent Families · Recovery Boundary
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            The patent-family view could not be resolved.
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-slate-300">
            The underlying patent application records and bounded 24-link
            mappings remain separate from this display failure. Retry the
            family view or continue through the main Patent Portfolio Map.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-100"
            >
              Retry patent families
            </button>

            <Link
              href="/academy/24-link-architecture/provenance/patents"
              className="rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-5 py-2.5 text-sm font-semibold text-amber-200"
            >
              Patent Portfolio Map
            </Link>

            <Link
              href="/academy/24-link-architecture/provenance"
              className="rounded-full border border-sky-300/20 bg-sky-300/[0.06] px-5 py-2.5 text-sm font-semibold text-sky-200"
            >
              Provenance Map
            </Link>
          </div>

          {error.digest ? (
            <p className="mt-8 text-xs text-slate-600">
              Recovery reference: {error.digest}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
