import type { TransferRouteDraft } from "../../../lib/route-draft-transfer";
import type { AcademyLabTransfer } from "./use-academy-lab-transfer";

export type AcademyLabBuilderDraft = {
  route: TransferRouteDraft;
  sourceLabel: string;
  labId: string;
  labTitle: string;
};

const stageKeys = [
  "reality",
  "record",
  "continuity",
  "admissibility",
  "binding",
  "commit",
  "execution",
  "outcome",
] as const;

export function academyLabTransferToBuilderDraft(
  transfer: AcademyLabTransfer,
): AcademyLabBuilderDraft {
  if (transfer.schema !== "TA14_ACADEMY_LAB_TRANSFER_V1") {
    throw new Error("Unsupported Academy Lab transfer schema.");
  }

  if (transfer.source !== "ACADEMY_LAB") {
    throw new Error("The transfer did not originate from the Academy Lab.");
  }

  if (transfer.route.schema !== "TA14_ROUTE_DRAFT_V1") {
    throw new Error("The Academy Lab transfer does not contain a valid route draft.");
  }

  const chain = Object.fromEntries(
    stageKeys.map((key) => {
      const value = transfer.route.chain[key];

      if (typeof value !== "string") {
        throw new Error(`The ${key} stage is missing from the Academy Lab route.`);
      }

      return [key, value.trim() || "UNKNOWN"];
    }),
  ) as TransferRouteDraft["chain"];

  const completedStages = stageKeys.filter(
    (key) => chain[key] !== "UNKNOWN",
  ).length;

  const missingStages = stageKeys
    .filter((key) => chain[key] === "UNKNOWN")
    .map((key) => key);

  const route: TransferRouteDraft = {
    schema: "TA14_ROUTE_DRAFT_V1",
    routeId:
      transfer.route.routeId.trim() ||
      `academy-lab:${transfer.labId}:${transfer.createdAt}`,
    status: completedStages === 8 ? "READY_FOR_TEST" : "DRAFT",
    metadata: {
      name:
        transfer.route.metadata.name.trim() ||
        `${transfer.labTitle} route`,
      domain: transfer.route.metadata.domain.trim() || "AI Governance",
      owner: transfer.route.metadata.owner.trim() || "UNKNOWN",
      version: transfer.route.metadata.version || 1,
    },
    chain,
    readiness: {
      completedStages,
      totalStages: 8,
      missingStages,
      nextAction:
        completedStages === 8
          ? "SUBMIT_TO_SANDBOX"
          : "COMPLETE_ROUTE_DEFINITION",
    },
    governingPrinciple:
      transfer.route.governingPrinciple.trim() ||
      "No admissible evidence. No admissible execution.",
  };

  return {
    route,
    sourceLabel: "Academy Lab",
    labId: transfer.labId,
    labTitle: transfer.labTitle,
  };
}
