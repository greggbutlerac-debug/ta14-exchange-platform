import Link from "next/link";

import type { TA14LinkId } from "@/lib/academy/ta14-24-link-canon";
import { getTA14ProvenanceIntakeHref } from "@/lib/academy/ta14-provenance-intake-link-prefill";

export function TA14ProvenanceAdminLink({
  linkId,
  label,
}: {
  linkId?: TA14LinkId | null;
  label?: string;
}) {
  const resolvedLabel =
    label ??
    (linkId
      ? "Register source for this link"
      : "Register provenance source");

  return (
    <Link
      href={getTA14ProvenanceIntakeHref(linkId)}
      className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-4 py-2 text-xs font-semibold text-amber-200 transition hover:border-amber-300/40 hover:bg-amber-300/[0.1]"
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-amber-200 shadow-[0_0_14px_rgba(253,230,138,0.8)]"
      />
      {resolvedLabel}
    </Link>
  );
}
