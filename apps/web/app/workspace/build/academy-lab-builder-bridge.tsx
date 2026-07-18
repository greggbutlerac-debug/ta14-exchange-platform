"use client";

import AcademyLabTransferLoader from "./academy-lab-transfer-loader";
import type { AcademyLabBuilderDraft } from "./academy-lab-transfer-adapter";

type AcademyLabBuilderBridgeProps = {
  hasExistingWork: boolean;
  onApply: (draft: AcademyLabBuilderDraft) => void;
};

export default function AcademyLabBuilderBridge({
  hasExistingWork,
  onApply,
}: AcademyLabBuilderBridgeProps) {
  return (
    <AcademyLabTransferLoader
      onApply={(draft) => {
        if (
          hasExistingWork &&
          !window.confirm(
            "Loading the Academy Lab route will replace the route currently open in the builder. Continue?",
          )
        ) {
          return;
        }

        onApply(draft);
      }}
    />
  );
}
