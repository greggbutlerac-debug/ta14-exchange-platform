import type { ReactNode } from "react";
import Link from "next/link";
import EngineAcademyHelp from "../../../components/academy/EngineAcademyHelp";
import ArtifactClassSummary from "./artifact-class-summary";
import ArtifactClassificationBridge from "./artifact-classification-bridge";
import GovernedArtifactDirectory from "./governed-artifact-directory";

const SECOND_CORPUS = [
  ["TA14-EA-000013", "TA14-EAR-000025", "Authority expires after approval but before execution", "HOLD"],
  ["TA14-EA-000014", "TA14-EAR-000026", "Evidence source identity substituted mid-chain", "DENY"],
  ["TA14-EA-000015", "TA14-EAR-000027", "Conflicting chain-of-custody histories detected", "ESCALATE"],
  ["TA14-EA-000016", "TA14-EAR-000028", "Dependency version changes after commit", "HOLD"],
  ["TA14-EA-000017", "TA14-EAR-000029", "New evidence supersedes admitted evidence", "HOLD"],
  ["TA14-EA-000018", "TA14-EAR-000030", "Authorized action sent toward wrong destination", "DENY"],
  ["TA14-EA-000019", "TA14-EAR-000031", "Execution begins but interruption prevents completion", "ESCALATE"],
  ["TA14-EA-000020", "TA14-EAR-000032", "Executed action differs from committed action", "DENY"],
  ["TA14-EA-000021", "TA14-EAR-000033", "Material condition changes during final revalidation", "HOLD"],
  ["TA14-EA-000022", "TA14-EAR-000034", "Two valid obligations produce incompatible consequences", "ESCALATE"],
  ["TA14-EA-000023", "TA14-EAR-000035", "Historical artifact cannot be cryptographically reconstructed", "HOLD"],
  ["TA14-EA-000024", "TA14-EAR-000036", "Changed state revalidated and authorized execution succeeds", "ALLOW"],
] as const;

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

      <section
        aria-label="TA-14 execution artifact corpus status"
        style={{
          padding: "16px 5vw",
          borderBottom: "1px solid rgba(86,227,159,.18)",
          background: "linear-gradient(90deg, rgba(5,20,18,.99), rgba(5,16,27,.99))",
          color: "#eefaff",
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ maxWidth: 1500, margin: "0 auto", display: "flex", gap: 18, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <strong style={{ display: "block", color: "#65e7ad", fontSize: 11, letterSpacing: ".14em" }}>TA-14 EXECUTION ARTIFACT CORPUS · 24 PUBLIC RECORDS</strong>
            <span style={{ display: "block", marginTop: 5, color: "#a8bec8", fontSize: 12, lineHeight: 1.55 }}>
              TA14-EA-000001 through TA14-EA-000024 are now represented in the public registry estate. The second corpus uses permanent EAR identities TA14-EAR-000025 through TA14-EAR-000036 so previously issued historical registry identities remain intact.
            </span>
          </div>
          <Link href="/artifacts" style={{ color: "#caffdf", textDecoration: "none", fontWeight: 850, fontSize: 12 }}>Open Artifact Library →</Link>
        </div>
      </section>

      <div id="directory">{children}</div>

      <section
        aria-label="TA-14 second execution artifact corpus"
        style={{
          background: "#050914",
          color: "#eef5ff",
          padding: "30px 24px 24px",
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ color: "#65e7ad", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>SECOND EXECUTION ARTIFACT CORPUS · REGISTERED</div>
            <h2 style={{ margin: "7px 0 8px", fontSize: "clamp(25px,3vw,38px)" }}>TA14-EA-000013 through TA14-EA-000024</h2>
            <p style={{ margin: 0, maxWidth: 900, color: "#9fb4c2", lineHeight: 1.65, fontSize: 13 }}>
              Twelve additional bounded TA-14 execution artifacts. Their permanent registry identities are TA14-EAR-000025 through TA14-EAR-000036. Registration does not expand the claims boundary of any individual artifact; each record remains limited to its preserved case.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
            {SECOND_CORPUS.map(([artifactId, registryId, title, determination]) => (
              <Link
                key={artifactId}
                href={`/artifacts/${artifactId.toLowerCase()}`}
                style={{
                  display: "block",
                  padding: 16,
                  borderRadius: 14,
                  border: "1px solid rgba(101,231,173,.16)",
                  background: "linear-gradient(145deg,rgba(8,23,31,.96),rgba(5,12,20,.98))",
                  color: "#eff8ff",
                  textDecoration: "none",
                }}
              >
                <div style={{ color: "#65e7ad", fontSize: 10, fontWeight: 900, letterSpacing: ".09em" }}>{artifactId} · {registryId}</div>
                <div style={{ marginTop: 8, minHeight: 40, fontWeight: 820, lineHeight: 1.35 }}>{title}</div>
                <div style={{ marginTop: 10, color: "#ffd37b", fontSize: 11, fontWeight: 850 }}>{determination}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
