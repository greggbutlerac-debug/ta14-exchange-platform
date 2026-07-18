import type { TransferRouteDraft } from "./route-draft-transfer";
import type { AcademyLab } from "./academy-labs";

export const ACADEMY_LAB_TRANSFER_SCHEMA =
  "TA14_ACADEMY_LAB_TRANSFER_V1" as const;

export const ACADEMY_LAB_TRANSFER_KEY =
  "ta14.academy.lab.transfer.v1";

export type AcademyLabTransfer = {
  schema: typeof ACADEMY_LAB_TRANSFER_SCHEMA;
  createdAt: string;
  labId: string;
  labTitle: string;
  source: "ACADEMY_LAB";
  route: TransferRouteDraft;
};

function canUseSessionStorage(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.sessionStorage !== "undefined"
  );
}

export function createAcademyLabRouteDraft(
  lab: AcademyLab,
): TransferRouteDraft {
  const chain = Object.fromEntries(
    lab.route.map((stage) => [
      stage.stage.toLowerCase(),
      `${stage.evidence} ${stage.question}`,
    ]),
  ) as TransferRouteDraft["chain"];

  return {
    schema: "TA14_ROUTE_DRAFT_V1",
    routeId: `academy:${lab.id}`,
    status: "DRAFT",
    metadata: {
      name: `Academy Lab: ${lab.title}`,
      domain: "AI Governance",
      owner: "TA-14 Academy",
      version: 1,
    },
    chain,
    readiness: {
      completedStages: 0,
      totalStages: 8,
      missingStages: [
        "reality",
        "record",
        "continuity",
        "admissibility",
        "binding",
        "commit",
        "execution",
        "outcome",
      ],
      nextAction: "COMPLETE_ROUTE_DEFINITION",
    },
    governingPrinciple:
      "No admissible evidence. No admissible execution.",
  };
}

export function stageAcademyLabTransfer(
  lab: AcademyLab,
): AcademyLabTransfer {
  const transfer: AcademyLabTransfer = {
    schema: ACADEMY_LAB_TRANSFER_SCHEMA,
    createdAt: new Date().toISOString(),
    labId: lab.id,
    labTitle: lab.title,
    source: "ACADEMY_LAB",
    route: createAcademyLabRouteDraft(lab),
  };

  if (canUseSessionStorage()) {
    window.sessionStorage.setItem(
      ACADEMY_LAB_TRANSFER_KEY,
      JSON.stringify(transfer),
    );
  }

  return transfer;
}

export function consumeAcademyLabTransfer():
  | AcademyLabTransfer
  | null {
  if (!canUseSessionStorage()) {
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
    return JSON.parse(raw) as AcademyLabTransfer;
  } catch {
    return null;
  }
}
