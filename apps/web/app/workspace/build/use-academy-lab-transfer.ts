"use client";

import { useEffect, useState } from "react";

export type AcademyLabTransfer = {
  schema: "TA14_ACADEMY_LAB_TRANSFER_V1";
  createdAt: string;
  labId: string;
  labTitle: string;
  source: "ACADEMY_LAB";
  route: {
    schema: "TA14_ROUTE_DRAFT_V1";
    routeId: string;
    status: "DRAFT";
    metadata: {
      name: string;
      domain: string;
      owner: string;
      version: number;
      source: "ACADEMY_LAB";
      sourceLabId: string;
    };
    chain: {
      reality: string;
      record: string;
      continuity: string;
      admissibility: string;
      binding: string;
      commit: string;
      execution: string;
      outcome: string;
    };
    readiness: {
      completedStages: number;
      totalStages: number;
      missingStages: string[];
      nextAction: "COMPLETE_ROUTE_DEFINITION";
    };
    governingPrinciple: string;
  };
};

export type AcademyLabTransferState = {
  checked: boolean;
  transfer: AcademyLabTransfer | null;
};

const ACADEMY_LAB_TRANSFER_KEY =
  "ta14.academy.lab.transfer.v1";

function consumeAcademyLabTransfer(): AcademyLabTransfer | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(
    ACADEMY_LAB_TRANSFER_KEY,
  );

  if (!raw) {
    return null;
  }

  window.sessionStorage.removeItem(
    ACADEMY_LAB_TRANSFER_KEY,
  );

  try {
    const parsed = JSON.parse(raw) as AcademyLabTransfer;

    if (
      parsed.schema !== "TA14_ACADEMY_LAB_TRANSFER_V1" ||
      parsed.source !== "ACADEMY_LAB"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function useAcademyLabTransfer(): AcademyLabTransferState {
  const [state, setState] =
    useState<AcademyLabTransferState>({
      checked: false,
      transfer: null,
    });

  useEffect(() => {
    setState({
      checked: true,
      transfer: consumeAcademyLabTransfer(),
    });
  }, []);

  return state;
}
