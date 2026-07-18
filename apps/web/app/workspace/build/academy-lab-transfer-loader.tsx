"use client";

import { useEffect, useState } from "react";
import AcademyLabTransferPanel from "./academy-lab-transfer-panel";
import {
  useAcademyLabTransfer,
  type AcademyLabTransfer,
} from "./use-academy-lab-transfer";

type AcademyLabTransferLoaderProps = {
  onApply: (transfer: AcademyLabTransfer) => void;
};

export default function AcademyLabTransferLoader({
  onApply,
}: AcademyLabTransferLoaderProps) {
  const transferState = useAcademyLabTransfer();
  const [pendingTransfer, setPendingTransfer] =
    useState<AcademyLabTransfer | null>(null);

  useEffect(() => {
    if (!transferState.checked || !transferState.transfer) {
      return;
    }

    setPendingTransfer(transferState.transfer);
  }, [transferState.checked, transferState.transfer]);

  if (!pendingTransfer) {
    return null;
  }

  return (
    <AcademyLabTransferPanel
      transfer={pendingTransfer}
      onApply={() => {
        onApply(pendingTransfer);
        setPendingTransfer(null);
      }}
      onDismiss={() => setPendingTransfer(null)}
    />
  );
}
