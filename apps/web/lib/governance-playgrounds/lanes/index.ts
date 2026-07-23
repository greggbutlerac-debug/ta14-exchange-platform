import type {
  GovernanceLaneId,
  LaneDefinition,
} from "../types";
import {
  GOVERNANCE_PLAYGROUND_REGISTRY,
  type GovernancePlaygroundRegistryEntry,
} from "../registry";
import { RUNTIME_EXECUTION_LANE } from "./runtime-execution";

/**
 * TA-14 Governance-Specific Playgrounds
 * Canonical lane-definition registry
 *
 * Navigation metadata lives in ../registry.ts.
 * Full build definitions live in this directory.
 *
 * A lane may appear in navigation as COMING_SOON before its full definition
 * is registered here. Only fully implemented lanes belong in LANE_DEFINITIONS.
 */

export const LANE_DEFINITIONS = [
  RUNTIME_EXECUTION_LANE,
] as const satisfies readonly LaneDefinition[];

export type RegisteredLaneDefinition =
  (typeof LANE_DEFINITIONS)[number];

export const LANE_DEFINITION_BY_ID = Object.freeze(
  Object.fromEntries(
    LANE_DEFINITIONS.map((lane) => [lane.laneId, lane]),
  ) as Partial<Record<GovernanceLaneId, RegisteredLaneDefinition>>,
);

export interface GovernanceLaneCatalogEntry {
  registry: GovernancePlaygroundRegistryEntry;
  definition?: RegisteredLaneDefinition;
  implemented: boolean;
  enabled: boolean;
}

export const GOVERNANCE_LANE_CATALOG =
  GOVERNANCE_PLAYGROUND_REGISTRY.map<GovernanceLaneCatalogEntry>(
    (registryEntry) => {
      const definition = LANE_DEFINITION_BY_ID[registryEntry.laneId];

      return {
        registry: registryEntry,
        definition,
        implemented: Boolean(definition),
        enabled: registryEntry.enabled && Boolean(definition),
      };
    },
  );

export const IMPLEMENTED_GOVERNANCE_LANES =
  GOVERNANCE_LANE_CATALOG.filter((entry) => entry.implemented);

export const ENABLED_IMPLEMENTED_GOVERNANCE_LANES =
  GOVERNANCE_LANE_CATALOG.filter((entry) => entry.enabled);

export function getLaneDefinition(
  laneId: GovernanceLaneId,
): RegisteredLaneDefinition | undefined {
  return LANE_DEFINITION_BY_ID[laneId];
}

export function requireLaneDefinition(
  laneId: GovernanceLaneId,
): RegisteredLaneDefinition {
  const definition = getLaneDefinition(laneId);

  if (!definition) {
    throw new Error(
      `Governance playground lane "${laneId}" is not implemented.`,
    );
  }

  return definition;
}

export function isLaneImplemented(
  laneId: GovernanceLaneId,
): boolean {
  return Boolean(getLaneDefinition(laneId));
}

export function isLaneAvailable(
  laneId: GovernanceLaneId,
): boolean {
  const catalogEntry = GOVERNANCE_LANE_CATALOG.find(
    (entry) => entry.registry.laneId === laneId,
  );

  return Boolean(catalogEntry?.enabled);
}

export function getLaneCatalogEntry(
  laneId: GovernanceLaneId,
): GovernanceLaneCatalogEntry {
  const catalogEntry = GOVERNANCE_LANE_CATALOG.find(
    (entry) => entry.registry.laneId === laneId,
  );

  if (!catalogEntry) {
    throw new Error(
      `Governance playground lane "${laneId}" is not registered.`,
    );
  }

  return catalogEntry;
}
