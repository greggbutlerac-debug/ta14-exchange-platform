import type { ReactNode } from "react";
import EngineAcademyHelp from "../../../components/academy/EngineAcademyHelp";
import ArtifactClassSummary from "./artifact-class-summary";
import ArtifactClassificationBridge from "./artifact-classification-bridge";
import GovernedArtifactDirectory from "./governed-artifact-directory";

export default function ArtifactRegistryLayout({ children }: { children: ReactNode }) {
  return (
    <>
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
