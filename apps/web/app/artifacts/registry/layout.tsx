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
        aria-label="Founding Demonstrations"
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
          <div>
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
            <span style={{ display: "block", marginTop: 5, fontSize: 13, opacity: .78 }}>
              Harmonic 001 · Harmonic 002 · Shango FD-2026-0005 — three different demonstrations of evidence-bounded governance.
            </span>
          </div>

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
            Explore Founding Demonstrations →
          </Link>
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
