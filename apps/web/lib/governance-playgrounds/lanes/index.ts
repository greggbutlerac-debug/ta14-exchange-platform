/**
 * TA-14 Governance Playground Lane Registry
 *
 * This registry includes only lane modules that currently exist in the repository.
 * Add security-third-party and outcome-assurance after those files are uploaded.
 */

export { AGENT_TOOLS_LANE } from "./agent-tools";
export { COMPLIANCE_REGULATORY_LANE } from "./compliance-regulatory";
export { DATA_PROVENANCE_LANE } from "./data-provenance";
export { DECISION_LANE } from "./decision";
export { GENERAL_LANE } from "./general";
export { HUMAN_OVERSIGHT_LANE } from "./human-oversight";
export { MODEL_EVALUATION_LANE } from "./model-evaluation";
export { POLICY_CONTROLS_LANE } from "./policy-controls";
export { RISK_LANE } from "./risk";
export { RUNTIME_EXECUTION_LANE } from "./runtime-execution";

import { AGENT_TOOLS_LANE } from "./agent-tools";
import { COMPLIANCE_REGULATORY_LANE } from "./compliance-regulatory";
import { DATA_PROVENANCE_LANE } from "./data-provenance";
import { DECISION_LANE } from "./decision";
import { GENERAL_LANE } from "./general";
import { HUMAN_OVERSIGHT_LANE } from "./human-oversight";
import { MODEL_EVALUATION_LANE } from "./model-evaluation";
import { POLICY_CONTROLS_LANE } from "./policy-controls";
import { RISK_LANE } from "./risk";
import { RUNTIME_EXECUTION_LANE } from "./runtime-execution";

export const GOVERNANCE_PLAYGROUND_LANES = [
  GENERAL_LANE,
  DECISION_LANE,
  RISK_LANE,
  RUNTIME_EXECUTION_LANE,
  MODEL_EVALUATION_LANE,
  DATA_PROVENANCE_LANE,
  AGENT_TOOLS_LANE,
  HUMAN_OVERSIGHT_LANE,
  POLICY_CONTROLS_LANE,
  COMPLIANCE_REGULATORY_LANE,
] as const;

export type GovernancePlaygroundLane =
  (typeof GOVERNANCE_PLAYGROUND_LANES)[number];

export type GovernancePlaygroundLaneId =
  GovernancePlaygroundLane["laneId"];

export const GOVERNANCE_PLAYGROUND_LANE_IDS =
  GOVERNANCE_PLAYGROUND_LANES.map((lane) => lane.laneId);

export const GOVERNANCE_PLAYGROUND_LANES_BY_ID =
  Object.fromEntries(
    GOVERNANCE_PLAYGROUND_LANES.map((lane) => [lane.laneId, lane]),
  ) as Record<
    GovernancePlaygroundLaneId,
    GovernancePlaygroundLane
  >;

export function getGovernancePlaygroundLane(
  laneId: string,
): GovernancePlaygroundLane | undefined {
  return GOVERNANCE_PLAYGROUND_LANES.find(
    (lane) => lane.laneId === laneId,
  );
}

export function isGovernancePlaygroundLaneId(
  laneId: string,
): laneId is GovernancePlaygroundLaneId {
  return GOVERNANCE_PLAYGROUND_LANE_IDS.some(
    (supportedLaneId) => supportedLaneId === laneId,
  );
}
