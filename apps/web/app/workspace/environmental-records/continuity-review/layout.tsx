"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

const CONTINUITY_KEY = "ta14-environmental-continuity-review-workspace-v1";

type PreservedContinuity = {
  reviewId?: string;
  sourceInterpretationId?: string;
  entitlementId?: string;
  entitledProposition?: string;
  continuityDetermination?: string;
  continuityReason?: string;
  identityStatement?: string;
  versionStatement?: string;
  updatedAt?: string;
};

function isPreservedContinuity(value: PreservedContinuity | null) {
  return Boolean(
    value?.reviewId &&
      value.sourceInterpretationId &&
      value.entitlementId &&
      value.entitledProposition &&
      value.continuityDetermination &&
      value.continuityDetermination !== "NOT_ASSESSED" &&
      value.continuityReason &&
      value.identityStatement &&
      value.versionStatement &&
      value.updatedAt,
  );
}

export default function EnvironmentalContinuityLayout({ children }: { children: ReactNode }) {
  const [mayEnterAdmissibility, setMayEnterAdmissibility] = useState(false);

  useEffect(() => {
    function inspect() {
      const raw = window.localStorage.getItem(CONTINUITY_KEY);
      if (!raw) {
        setMayEnterAdmissibility(false);
        return;
      }
      try {
        setMayEnterAdmissibility(isPreservedContinuity(JSON.parse(raw) as PreservedContinuity));
      } catch {
        setMayEnterAdmissibility(false);
      }
    }

    inspect();
    const timer = window.setInterval(inspect, 750);
    window.addEventListener("storage", inspect);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("storage", inspect);
    };
  }, []);

  return (
    <>
      {children}
      {mayEnterAdmissibility ? (
        <aside style={{ position: "fixed", right: 20, bottom: 20, zIndex: 50 }}>
          <Link
            href="/workspace/environmental-records/admissibility-review"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "13px 18px",
              borderRadius: 11,
              background: "#d2e87d",
              color: "#172004",
              textDecoration: "none",
              fontFamily: "Inter,system-ui,sans-serif",
              fontWeight: 900,
              boxShadow: "0 12px 32px rgba(0,0,0,.32)",
            }}
          >
            Continue to Environmental Admissibility Review →
          </Link>
        </aside>
      ) : null}
    </>
  );
}
