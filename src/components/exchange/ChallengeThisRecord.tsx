"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ChallengeThisRecordProps = {
  recordType: string;
  recordKey: string;
  recordVersion?: string | null;
  recordTitle?: string;
};

export default function ChallengeThisRecord({
  recordType,
  recordKey,
  recordVersion,
  recordTitle,
}: ChallengeThisRecordProps) {
  const [copied, setCopied] = useState(false);

  const recordReference = useMemo(() => {
    const parts = [recordType, recordKey];

    if (recordVersion) {
      parts.push(recordVersion);
    }

    return parts.join(" / ");
  }, [recordKey, recordType, recordVersion]);

  const reviewsHref =
    "/workspace/ai-governance/reviews?type=EVIDENCE_CHALLENGE";

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(recordReference);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-3xl border border-amber-300/15 bg-amber-300/[0.035] p-6 shadow-2xl backdrop-blur-xl md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
            Challenge & Correction Route
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Challenge this governed record
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/60 md:text-base">
            A challenge does not overwrite the original record. It creates a
            separate, attributable route for an evidence challenge, factual
            correction, technical comment, participant response, or other
            governed review record.
          </p>

          <p className="mt-3 text-sm leading-7 text-white/60 md:text-base">
            If a later authorized determination changes the governing state,
            that change should remain linked to this record through preserved
            institutional lineage rather than replacing the original history.
          </p>
        </div>

        <div className="w-fit rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-medium text-white/50">
          Original record preserved
        </div>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
            Record reference
          </div>

          <div className="mt-3 break-words text-sm font-semibold text-white/80">
            {recordTitle || recordKey}
          </div>

          <div className="mt-2 break-words font-mono text-xs leading-5 text-white/45">
            {recordReference}
          </div>

          <button
            type="button"
            onClick={copyReference}
            className="mt-4 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/65 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            {copied ? "Reference copied" : "Copy record reference"}
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
            Governed pathway
          </div>

          <p className="mt-3 text-sm leading-6 text-white/60">
            Open the Reviews & Responses evidence-challenge pathway to inspect
            preserved challenges and related governed records. Use the record
            reference shown here when identifying the exact record at issue.
          </p>

          <Link
            href={reviewsHref}
            className="mt-4 inline-flex rounded-full border border-amber-200/20 bg-amber-200/[0.08] px-4 py-2 text-xs font-semibold text-amber-100 transition hover:border-amber-200/35 hover:bg-amber-200/[0.12]"
          >
            Open Evidence Challenges
          </Link>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-5">
        <p className="text-xs leading-6 text-white/45">
          This control does not itself submit, admit, uphold, deny, or
          adjudicate a challenge. It preserves the boundary between the
          authoritative record and the separate Reviews & Responses pathway
          until a dedicated governed challenge-intake write route is available.
        </p>
      </div>
    </section>
  );
}
