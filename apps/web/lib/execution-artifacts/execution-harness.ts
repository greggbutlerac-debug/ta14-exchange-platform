import { createHash } from "node:crypto";

export const TA14_CHAIN = [
  "REALITY",
  "RECORD",
  "CONTINUITY",
  "ADMISSIBILITY",
  "BINDING",
  "COMMIT",
  "EXECUTION",
  "OUTCOME",
] as const;

export type ChainStage = (typeof TA14_CHAIN)[number];
export type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
export type StageDisposition = "PASS" | "HOLD" | "DENY" | "ESCALATE" | "NOT_REACHED";

export interface ArtifactPredicate {
  id: string;
  stage: ChainStage;
  description: string;
  required: boolean;
  observed: boolean | null;
  failureDetermination: Exclude<Determination, "ALLOW">;
  evidenceRef?: string;
}

export interface ArtifactTestSpecification {
  schemaVersion: "ta14.execution-spec.v1";
  artifactId: string;
  routeId: string;
  title: string;
  frozenAt: string;
  input: Readonly<Record<string, unknown>>;
  predicates: readonly ArtifactPredicate[];
  expectedDetermination: Determination;
  claimsBoundary: string;
}

export interface StageTrace {
  stage: ChainStage;
  disposition: StageDisposition;
  evaluatedPredicateIds: string[];
  evidenceRefs: string[];
  reason: string;
}

export interface ExecutionReceipt {
  schemaVersion: "ta14.execution-receipt.v1";
  artifactId: string;
  routeId: string;
  specificationHash: string;
  determination: Determination;
  terminalStage: ChainStage;
  traceHash: string;
  executedAt: string;
}

export interface EvidenceManifestEntry {
  name: "specification.json" | "trace.json" | "receipt.json";
  sha256: string;
}

export interface ExecutionEvidencePackage {
  specification: ArtifactTestSpecification;
  trace: StageTrace[];
  receipt: ExecutionReceipt;
  manifest: EvidenceManifestEntry[];
  rootHash: string;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

export function sha256(value: unknown): string {
  return `sha256:${createHash("sha256").update(typeof value === "string" ? value : canonicalize(value)).digest("hex")}`;
}

function outcomeForStage(predicates: readonly ArtifactPredicate[]): Determination {
  const failures = predicates.filter((p) => p.required && p.observed !== true);
  if (!failures.length) return "ALLOW";
  // Deterministic precedence: DENY is disqualifying; unresolved conflicts
  // ESCALATE; missing/uncertain qualification HOLDs.
  if (failures.some((p) => p.failureDetermination === "DENY")) return "DENY";
  if (failures.some((p) => p.failureDetermination === "ESCALATE")) return "ESCALATE";
  return "HOLD";
}

export function executeArtifactSpecification(
  specification: ArtifactTestSpecification,
  executedAt = new Date().toISOString(),
): ExecutionEvidencePackage {
  const trace: StageTrace[] = [];
  let determination: Determination = "ALLOW";
  let terminalStage: ChainStage = "OUTCOME";
  let stopped = false;

  for (const stage of TA14_CHAIN) {
    if (stopped) {
      trace.push({ stage, disposition: "NOT_REACHED", evaluatedPredicateIds: [], evidenceRefs: [], reason: "Prior governed determination prevented progression." });
      continue;
    }

    const predicates = specification.predicates.filter((p) => p.stage === stage);
    const stageDetermination = outcomeForStage(predicates);
    const evidenceRefs = predicates.flatMap((p) => p.evidenceRef ? [p.evidenceRef] : []);

    if (stageDetermination === "ALLOW") {
      trace.push({ stage, disposition: "PASS", evaluatedPredicateIds: predicates.map((p) => p.id), evidenceRefs, reason: predicates.length ? "All required predicates at this stage have standing." : "No blocking predicate configured for this stage." });
      continue;
    }

    determination = stageDetermination;
    terminalStage = stage;
    stopped = true;
    trace.push({ stage, disposition: stageDetermination, evaluatedPredicateIds: predicates.map((p) => p.id), evidenceRefs, reason: `Required predicate standing failed at ${stage}; governed determination is ${stageDetermination}.` });
  }

  const specificationHash = sha256(specification);
  const traceHash = sha256(trace);
  const receipt: ExecutionReceipt = {
    schemaVersion: "ta14.execution-receipt.v1",
    artifactId: specification.artifactId,
    routeId: specification.routeId,
    specificationHash,
    determination,
    terminalStage,
    traceHash,
    executedAt,
  };

  const manifest: EvidenceManifestEntry[] = [
    { name: "specification.json", sha256: specificationHash },
    { name: "trace.json", sha256: traceHash },
    { name: "receipt.json", sha256: sha256(receipt) },
  ];
  const rootHash = sha256(manifest);

  return { specification, trace, receipt, manifest, rootHash };
}

export function assertExpectedDetermination(result: ExecutionEvidencePackage): void {
  if (result.receipt.determination !== result.specification.expectedDetermination) {
    throw new Error(`Artifact ${result.specification.artifactId} expected ${result.specification.expectedDetermination} but executed as ${result.receipt.determination}.`);
  }
}

export function mutatePredicate(
  specification: ArtifactTestSpecification,
  predicateId: string,
  observed: boolean | null,
): ArtifactTestSpecification {
  if (!specification.predicates.some((p) => p.id === predicateId)) throw new Error(`Unknown predicate: ${predicateId}`);
  return {
    ...specification,
    predicates: specification.predicates.map((p) => p.id === predicateId ? { ...p, observed } : p),
  };
}
