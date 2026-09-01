import Link from "next/link";
import type { ReactNode } from "react";
import { requireUser } from "../../../lib/auth/require-user";

export default async function MissionControlLayout({ children }: { children: ReactNode }) {
  await requireUser();

  return (
    <>
      <div
        style={{
          position: "relative",
          zIndex: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          padding: "10px clamp(18px, 3vw, 46px)",
          borderBottom: "1px solid rgba(76,202,255,.18)",
          background: "#02060c",
          color: "#dce9f7",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div>
          <strong
            style={{
              display: "block",
              color: "#7de3ff",
              fontSize: 11,
              letterSpacing: ".16em",
              textTransform: "uppercase",
            }}
          >
            Private Institutional Intelligence
          </strong>
          <span style={{ display: "block", marginTop: 3, color: "#71869f", fontSize: 12 }}>
            Discovery → Intent → Identity → Conversion → Revenue
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Link
            href="/workspace/mission-control/governance-registry"
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 38,
              padding: "0 14px",
              border: "1px solid rgba(112,229,174,.34)",
              borderRadius: 10,
              background: "rgba(74,190,139,.10)",
              color: "#effff7",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            Governance Registry Watch →
          </Link>
          <Link
            href="/workspace/mission-control/seo-intelligence"
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 38,
              padding: "0 14px",
              border: "1px solid rgba(76,202,255,.36)",
              borderRadius: 10,
              background: "rgba(34,167,226,.12)",
              color: "#effbff",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            SEO Intelligence · Private →
          </Link>
        </div>
      </div>
      {children}
    </>
  );
}
