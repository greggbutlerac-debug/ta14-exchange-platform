import type { ReactNode } from "react";
import Link from "next/link";

export default function AndeksExaminationLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <section
        aria-label="ANDEKS independent examination response status"
        style={{
          position: "relative",
          zIndex: 90,
          padding: "14px 5vw",
          borderBottom: "1px solid rgba(109,224,255,.18)",
          background: "linear-gradient(90deg, rgba(3,15,25,.98), rgba(7,35,47,.98), rgba(5,25,31,.98))",
          color: "#eefaff",
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 1450,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 980 }}>
            <strong
              style={{
                display: "block",
                color: "#8feaff",
                fontSize: 10,
                letterSpacing: ".14em",
                textTransform: "uppercase",
              }}
            >
              Independent Participant Response Received
            </strong>
            <span style={{ display: "block", marginTop: 5, color: "#abc5d1", fontSize: 12, lineHeight: 1.55 }}>
              ANDEKS™ has independently preserved its response to TA-14 / ANDEKS™ IE-2026-001. The TA-14 finding and ANDEKS™ response remain separately issued and separately attributable. Pilot authorization has not been issued; the next-gate decision remains reserved.
            </span>
          </div>

          <Link
            href="/artifacts/ta14-andeks-ie-2026-001/independent-response"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 42,
              padding: "0 15px",
              border: "1px solid rgba(109,224,255,.28)",
              borderRadius: 11,
              background: "rgba(109,224,255,.08)",
              color: "#caf5ff",
              fontSize: 11,
              fontWeight: 850,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Open ANDEKS™ Response →
          </Link>
        </div>
      </section>
      {children}
    </>
  );
}
