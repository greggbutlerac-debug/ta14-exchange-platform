/**
 * TA-14 Governance Playground Lane Registry
 *
 * Central export and ordered registry for every supported governance lane.
 */

export { AGENT_TOOLS_LANE } from "./agent-tools";
export { COMPLIANCE_REGULATORY_LANE } from "./compliance-regulatory";
export { DATA_PROVENANCE_LANE } from "./data-provenance";
export { DECISION_LANE } from "./decision";
export { GENERAL_LANE } from "./general";
export { HUMAN_OVERSIGHT_LANE } from "./human-oversight";
export { MODEL_EVALUATION_LANE } from "./model-evaluation";
export { OUTCOME_ASSURANCE_LANE } from "./outcome-assurance";
export { POLICY_CONTROLS_LANE } from "./policy-controls";
export { RISK_LANE } from "./risk";
export { RUNTIME_EXECUTION_LANE } from "./runtime-execution";
export { SECURITY_THIRD_PARTY_LANE } from "./security-third-party";

import { AGENT_TOOLS_LANE } from "./agent-tools";
import { COMPLIANCE_REGULATORY_LANE } from "./compliance-regulatory";
import { DATA_PROVENANCE_LANE } from "./data-provenance";
import { DECISION_LANE } from "./decision";
import { GENERAL_LANE } from "./general";
import { HUMAN_OVERSIGHT_LANE } from "./human-oversight";
import { MODEL_EVALUATION_LANE } from "./model-evaluation";
import { OUTCOME_ASSURANCE_LANE } from "./outcome-assurance";
import { POLICY_CONTROLS_LANE } from "./policy-controls";
import { RISK_LANE } from "./risk";
import { RUNTIME_EXECUTION_LANE } from "./runtime-execution";
import { SECURITY_THIRD_PARTY_LANE } from "./security-third-party";

export const GOVERNANCE_PLAYGROUND_LANES = [
  GENERAL_LANE,
  DECISION_LANE,
  RISK_LANE,
  DATA_PROVENANCE_LANE,
  MODEL_EVALUATION_LANE,
  AGENT_TOOLS_LANE,
  HUMAN_OVERSIGHT_LANE,
  POLICY_CONTROLS_LANE,
  COMPLIANCE_REGULATORY_LANE,
  SECURITY_THIRD_PARTY_LANE,
  RUNTIME_EXECUTION_LANE,
  OUTCOME_ASSURANCE_LANE,
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
  ) as {
    [LaneId in GovernancePlaygroundLaneId]: Extract<
      GovernancePlaygroundLane,
      { laneId: LaneId }
    >;
  };

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
