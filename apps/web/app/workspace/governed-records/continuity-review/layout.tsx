"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const INTERPRETER_KEY = "ta14-governed-record-interpreter-workspace-v2";

export default function ContinuityReviewLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(INTERPRETER_KEY);
    if (raw) {
      try {
        const record = JSON.parse(raw) as {
          entitlementId?: string;
          entitledProposition?: string;
          entitlementStanding?: string;
          interpretationId?: string;
          resultSummary?: string;
        };

        const isEntitlementBoundEnvironmentalRecord = Boolean(
          record.entitlementId &&
            record.entitledProposition &&
            record.entitlementStanding &&
            record.interpretationId &&
            record.resultSummary,
        );

        if (isEntitlementBoundEnvironmentalRecord) {
          router.replace("/workspace/environmental-records/continuity-review");
          return;
        }
      } catch {
        // Preserve ordinary generic continuity-review behavior if the shared
        // browser-local workspace cannot be parsed.
      }
    }

    setResolved(true);
  }, [router]);

  if (!resolved) {
    return null;
  }

  return children;
}
