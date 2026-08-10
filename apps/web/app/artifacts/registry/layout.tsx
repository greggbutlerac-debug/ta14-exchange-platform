import type { ReactNode } from "react";
import EngineAcademyHelp from "../../../components/academy/EngineAcademyHelp";

export default function ArtifactRegistryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <EngineAcademyHelp
        engineName="Execution Artifact Registry"
        guideHref="/academy/engine-guides/execution-artifact-registry"
        assuranceState="Guided operation available · formal engine assurance review in progress"
      />
    </>
  );
}
