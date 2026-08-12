import type { ReactNode } from "react";
import Link from "next/link";
import EngineAcademyHelp from "../../../components/academy/EngineAcademyHelp";
import ArtifactClassSummary from "./artifact-class-summary";
import ArtifactClassificationBridge from "./artifact-classification-bridge";
import GovernedArtifactDirectory from "./governed-artifact-directory";

export default function ArtifactRegistryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <section
        aria-label="Public governed artifact pathways"
        style={{
          position: "relative",
          zIndex: 60,
          padding: "14px 5vw",
          borderBottom: "1px solid rgba(244,186,84,.22)",
          background:
            "linear-gradient(90deg, rgba(44,31,12,.98), rgba(6,27,43,.98), rgba(11,40,31,.97))",
          color: "#edf8ff",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 1500,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 880 }}>
            <strong
              style={{
                display: "block",
                color: "#ffd37b",
                fontSize: 11,
                letterSpacing: ".14em",
                textTransform: "uppercase",
              }}
            >
              Public Governed Artifact Series
            </strong>
            <span style={{ display: "block", marginTop: 5, fontSize: 13, opacity: .82, lineHeight: 1.55 }}>
              Harmonic Cases 001–003 · Shango FD-2026-0005 · TA-14 / ANDEKS™ IE-2026-001 — governed demonstrations, controlled findings, bounded interoperability records, and independently attributable participant responses preserved as separate institutional objects.
            </span>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href="/artifacts/founding-demonstrations"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "11px 15px",
                borderRadius: 11,
                border: "1px solid rgba(244,186,84,.30)",
                background: "rgba(244,186,84,.10)",
                color: "#ffe0a2",
                fontSize: 12,
                fontWeight: 850,
                textDecoration: "none",
              }}
            >
              Founding Demonstrations →
            </Link>

            <Link
              href="/artifacts/interoperability-examinations"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "11px 15px",
                borderRadius: 11,
                border: "1px solid rgba(101,221,255,.30)",
                background: "rgba(101,221,255,.09)",
                color: "#c8f3ff",
                fontSize: 12,
                fontWeight: 850,
                textDecoration: "none",
              }}
            >
              Interoperability Examinations →
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-label="Latest interoperability examination state"
        style={{
          position: "relative",
          zIndex: 59,
          padding: "12px 5vw",
          borderBottom: "1px solid rgba(101,221,255,.16)",
          background: "linear-gradient(90deg, rgba(4,18,29,.98), rgba(7,36,48,.98))",
          color: "#eaf9ff",
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ maxWidth: 1500, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 20, alignItems: "center" }}>
          <div>
            <strong style={{ display: "block", color: "#8ee9ff", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase" }}>
              TA-14 / ANDEKS™ IE-2026-001 · Independent Response Preserved
            </strong>
            <span style={{ display: "block", marginTop: 5, color: "#a9c3cf", fontSize: 12, lineHeight: 1.55 }}>
              Documentary examination complete. TA-14 finding independently preserved. ANDEKS™ response independently preserved. No material factual inaccuracies identified in TA-14&apos;s representation. Pilot not authorized; next-gate decision reserved.
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/artifacts/ta14-andeks-ie-2026-001" style={{ padding: "9px 12px", border: "1px solid rgba(101,221,255,.22)", borderRadius: 10, background: "rgba(101,221,255,.07)", color: "#c9f4ff", fontSize: 11, fontWeight: 850, textDecoration: "none" }}>
              Examination →
            </Link>
            <Link href="/artifacts/ta14-andeks-ie-2026-001/independent-response" style={{ padding: "9px 12px", border: "1px solid rgba(114,239,182,.22)", borderRadius: 10, background: "rgba(114,239,182,.07)", color: "#caffdf", fontSize: 11, fontWeight: 850, textDecoration: "none" }}>
              ANDEKS™ Response →
            </Link>
          </div>
        </div>
      </section>

      <div id="directory">{children}</div>
      <div
        style={{
          background: "#050914",
          color: "#eef5ff",
          padding: "0 24px 64px",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <ArtifactClassSummary />
          <ArtifactClassificationBridge />
          <div id="governed-findings">
            <GovernedArtifactDirectory />
          </div>
        </div>
      </div>
      <EngineAcademyHelp
        engineName="Execution Artifact Registry"
        guideHref="/academy/engine-guides/execution-artifact-registry"
        assuranceState="Guided operation available · formal engine assurance review in progress"
      />
    </>
  );
}
