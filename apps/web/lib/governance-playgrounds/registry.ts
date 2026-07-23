import type {
  GovernanceLaneId,
  PlaygroundRegistryEntry,
} from "./types";

/**
 * TA-14 Governance-Specific Playgrounds
 * Canonical navigation and availability registry
 *
 * This registry is intentionally presentation-safe and dependency-free.
 * Pages, sidebars, cards, route guards, and future feature flags should read
 * from this file rather than hard-coding governance playground links.
 */

export const GOVERNANCE_PLAYGROUND_BASE_PATH =
  "/ai-governance/playground" as const;

export const GOVERNANCE_PLAYGROUND_REGISTRY = [
  {
    laneId: "general",
    slug: "",
    href: GOVERNANCE_PLAYGROUND_BASE_PATH,
    name: "General AI Governance Playground",
    shortDescription:
      "Build, test, challenge, correct, preserve, and verify a complete governance route.",
    enabled: true,
    order: 10,
    badge: "FOUNDATION",
  },
  {
    laneId: "runtime-execution",
    slug: "runtime-execution",
    href: `${GOVERNANCE_PLAYGROUND_BASE_PATH}/runtime-execution`,
    name: "Runtime & Execution Governance",
    shortDescription:
      "Test whether authority, evidence, tools, boundaries, and intervention controls remain valid during execution.",
    enabled: true,
    order: 20,
    badge: "REFERENCE",
  },
  {
    laneId: "model-evaluation",
    slug: "model-evaluation",
    href: `${GOVERNANCE_PLAYGROUND_BASE_PATH}/model-evaluation`,
    name: "Model & Evaluation Governance",
    shortDescription:
      "Test model identity, intended use, evaluation evidence, performance limits, change control, and approval validity.",
    enabled: false,
    order: 30,
    badge: "COMING_SOON",
  },
  {
    laneId: "data-provenance",
    slug: "data-provenance",
    href: `${GOVERNANCE_PLAYGROUND_BASE_PATH}/data-provenance`,
    name: "Data & Provenance Governance",
    shortDescription:
      "Test provenance, ownership, consent, quality, lineage, transformation, access, retention, and geographic restrictions.",
    enabled: false,
    order: 40,
    badge: "COMING_SOON",
  },
  {
    laneId: "agent-tools",
    slug: "agent-tools",
    href: `${GOVERNANCE_PLAYGROUND_BASE_PATH}/agent-tools`,
    name: "Agent & Tool Governance",
    shortDescription:
      "Test delegated objectives, tool permissions, memory, sub-agents, external actions, escalation, and termination.",
    enabled: false,
    order: 50,
    badge: "COMING_SOON",
  },
  {
    laneId: "decision",
    slug: "decision",
    href: `${GOVERNANCE_PLAYGROUND_BASE_PATH}/decision`,
    name: "Decision Governance",
    shortDescription:
      "Test consequential decisions, affected parties, evidence, authority, review rights, traceability, and outcome correspondence.",
    enabled: false,
    order: 60,
    badge: "COMING_SOON",
  },
  {
    laneId: "human-oversight",
    slug: "human-oversight",
    href: `${GOVERNANCE_PLAYGROUND_BASE_PATH}/human-oversight`,
    name: "Human Oversight Governance",
    shortDescription:
      "Test whether human oversight is informed, qualified, timely, recorded, independent, and capable of stopping execution.",
    enabled: false,
    order: 70,
    badge: "COMING_SOON",
  },
  {
    laneId: "policy-controls",
    slug: "policy-controls",
    href: `${GOVERNANCE_PLAYGROUND_BASE_PATH}/policy-controls`,
    name: "Policy & Control Governance",
    shortDescription:
      "Test whether written policy is translated into enforceable controls, evidence requirements, exceptions, and consequences.",
    enabled: false,
    order: 80,
    badge: "COMING_SOON",
  },
  {
    laneId: "risk",
    slug: "risk",
    href: `${GOVERNANCE_PLAYGROUND_BASE_PATH}/risk`,
    name: "Risk Governance",
    shortDescription:
      "Test risk identification, ownership, treatment, residual acceptance, authority, monitoring, and continuing validity.",
    enabled: false,
    order: 90,
    badge: "COMING_SOON",
  },
  {
    laneId: "compliance-regulatory",
    slug: "compliance-regulatory",
    href: `${GOVERNANCE_PLAYGROUND_BASE_PATH}/compliance-regulatory`,
    name: "Compliance & Regulatory Governance",
    shortDescription:
      "Test applicability, regulated roles, duties, controls, evidence, unresolved interpretation, and ongoing verification.",
    enabled: false,
    order: 100,
    badge: "COMING_SOON",
  },
  {
    laneId: "security-third-party",
    slug: "security-third-party",
    href: `${GOVERNANCE_PLAYGROUND_BASE_PATH}/security-third-party`,
    name: "Security & Third-Party Governance",
    shortDescription:
      "Test threats, dependencies, credentials, access, vendors, incidents, containment, restoration, and responsibility.",
    enabled: false,
    order: 110,
    badge: "COMING_SOON",
  },
  {
    laneId: "outcome-assurance",
    slug: "outcome-assurance",
    href: `${GOVERNANCE_PLAYGROUND_BASE_PATH}/outcome-assurance`,
    name: "Outcome & Assurance Governance",
    shortDescription:
      "Test whether approved intention, executed action, measured result, claimed benefit, and actual outcome correspond.",
    enabled: false,
    order: 120,
    badge: "COMING_SOON",
  },
] as const satisfies readonly PlaygroundRegistryEntry[];

export type GovernancePlaygroundRegistryEntry =
  (typeof GOVERNANCE_PLAYGROUND_REGISTRY)[number];

export const GOVERNANCE_PLAYGROUND_BY_LANE = Object.freeze(
  Object.fromEntries(
    GOVERNANCE_PLAYGROUND_REGISTRY.map((entry) => [entry.laneId, entry]),
  ) as Record<GovernanceLaneId, GovernancePlaygroundRegistryEntry>,
);

export const ENABLED_GOVERNANCE_PLAYGROUNDS =
  GOVERNANCE_PLAYGROUND_REGISTRY.filter((entry) => entry.enabled);

export const SPECIALIZED_GOVERNANCE_PLAYGROUNDS =
  GOVERNANCE_PLAYGROUND_REGISTRY.filter(
    (entry) => entry.laneId !== "general",
  );

export const ENABLED_SPECIALIZED_GOVERNANCE_PLAYGROUNDS =
  SPECIALIZED_GOVERNANCE_PLAYGROUNDS.filter((entry) => entry.enabled);

export function getGovernancePlaygroundByLane(
  laneId: GovernanceLaneId,
): GovernancePlaygroundRegistryEntry {
  return GOVERNANCE_PLAYGROUND_BY_LANE[laneId];
}

export function getGovernancePlaygroundBySlug(
  slug: string,
): GovernancePlaygroundRegistryEntry | undefined {
  const normalizedSlug = slug.trim().replace(/^\/+|\/+$/g, "");

  return GOVERNANCE_PLAYGROUND_REGISTRY.find(
    (entry) => entry.slug === normalizedSlug,
  );
}

export function isGovernancePlaygroundEnabled(
  laneId: GovernanceLaneId,
): boolean {
  return GOVERNANCE_PLAYGROUND_BY_LANE[laneId].enabled;
}

export function getGovernancePlaygroundHref(
  laneId: GovernanceLaneId,
): string {
  return GOVERNANCE_PLAYGROUND_BY_LANE[laneId].href;
}
