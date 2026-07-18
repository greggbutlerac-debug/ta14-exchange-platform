"use client";

import { useEffect, useState } from "react";

import {
  academyLabTransferToBuilderDraft,
  type AcademyLabBuilderDraft,
} from "./academy-lab-transfer-adapter";
import AcademyLabTransferPanel from "./academy-lab-transfer-panel";
import {
  useAcademyLabTransfer,
  type AcademyLabTransfer,
} from "./use-academy-lab-transfer";

type AcademyLabTransferLoaderProps = {
  onApply: (draft: AcademyLabBuilderDraft) => void;
};

export default function AcademyLabTransferLoader({
  onApply,
}: AcademyLabTransferLoaderProps) {
  const transferState = useAcademyLabTransfer();
  const [pendingTransfer, setPendingTransfer] =
    useState<AcademyLabTransfer | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);

  useEffect(() => {
    if (!transferState.checked || !transferState.transfer) {
      return;
    }

    setPendingTransfer(transferState.transfer);
    setTransferError(null);
  }, [transferState.checked, transferState.transfer]);

  if (!pendingTransfer) {
    return null;
  }

  return (
    <div>
      <AcademyLabTransferPanel
        transfer={pendingTransfer}
        onApply={() => {
          try {
            const draft = academyLabTransferToBuilderDraft(pendingTransfer);
            onApply(draft);
            setPendingTransfer(null);
            setTransferError(null);
          } catch (error) {
            setTransferError(
              error instanceof Error
                ? error.message
                : "The Academy Lab transfer could not be loaded.",
            );
          }
        }}
        onDismiss={() => {
          setPendingTransfer(null);
          setTransferError(null);
        }}
      />

      {transferError ? (
        <div
          role="alert"
          style={{
            marginTop: "-12px",
            marginBottom: "24px",
            padding: "14px 16px",
            border: "1px solid rgba(248, 113, 113, 0.5)",
            borderRadius: "12px",
            background: "rgba(127, 29, 29, 0.2)",
            color: "#fecaca",
            fontSize: "14px",
            lineHeight: 1.5,
          }}
        >
          <strong style={{ display: "block", marginBottom: "4px" }}>
            Academy Lab transfer rejected
          </strong>
          {transferError}
        </div>
      ) : null}
    </div>
  );
}
