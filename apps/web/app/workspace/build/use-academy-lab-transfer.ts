"use client";

import { useEffect, useState } from "react";
import {
  consumeAcademyLabTransfer,
  type AcademyLabTransfer,
} from "../../../../lib/academy-lab-transfer";

export type AcademyLabTransferState = {
  checked: boolean;
  transfer: AcademyLabTransfer | null;
};

export function useAcademyLabTransfer(): AcademyLabTransferState {
  const [state, setState] =
    useState<AcademyLabTransferState>({
      checked: false,
      transfer: null,
    });

  useEffect(() => {
    const transfer = consumeAcademyLabTransfer();

    setState({
      checked: true,
      transfer,
    });
  }, []);

  return state;
}
