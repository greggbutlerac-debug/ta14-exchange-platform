import type {
  GateId,
  GateResult,
} from "./types";
import type {
  RuntimeEvidenceAttachment,
  RuntimeEvidenceSummary,
} from "./runtime-evidence-storage";

/**
 * TA-14 Runtime Governance Playground
 * Evidence-to-gate binding
 *
 * Relationship is not admissibility. This adapter preserves the declared
 * relationship of evidence candidates to gates, but it MUST NOT promote
 * CONTEXT_ONLY evidence into supporting evidence. Authenticity, sufficiency,
 * continuity, admissibility and truth are evaluated elsewhere.
 */

export interface GateEvidenceBinding {
  gateId: GateId;
  supportingEvidenceIds: readonly string[];
  conflictingEvidenceIds: readonly string[];
  contextEvidenceIds: readonly string[];
}

export interface EvidenceBindingResult {
  gateResults: readonly GateResult[];
  bindings: readonly GateEvidenceBinding[];
  unboundEvidenceIds: readonly string[];
}

type EvidenceLike =
  | RuntimeEvidenceAttachment
  | RuntimeEvidenceSummary;

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

export function buildGateEvidenceBindings(
  gateResults: readonly GateResult[],
  attachments: readonly EvidenceLike[],
): readonly GateEvidenceBinding[] {
  return gateResults.map((gateResult) => {
    const gateAttachments = attachments.filter(
      (attachment) => attachment.gateId === gateResult.gateId,
    );

    return {
      gateId: gateResult.gateId,
      supportingEvidenceIds: unique(
        gateAttachments
          .filter(
            (attachment) =>
              attachment.relationship === "SUPPORTING",
          )
          .map((attachment) => attachment.evidenceId),
      ),
      conflictingEvidenceIds: unique(
        gateAttachments
          .filter(
            (attachment) =>
              attachment.relationship === "CONFLICTING",
          )
          .map((attachment) => attachment.evidenceId),
      ),
      contextEvidenceIds: unique(
        gateAttachments
          .filter(
            (attachment) =>
              attachment.relationship === "CONTEXT_ONLY",
          )
          .map((attachment) => attachment.evidenceId),
      ),
    };
  });
}

export function bindEvidenceToGateResults(
  gateResults: readonly GateResult[],
  attachments: readonly EvidenceLike[],
): EvidenceBindingResult {
  const bindings = buildGateEvidenceBindings(
    gateResults,
    attachments,
  );

  const gateResultsWithEvidence = gateResults.map(
    (gateResult) => {
      const binding = bindings.find(
        (candidate) => candidate.gateId === gateResult.gateId,
      );

      if (!binding) {
        return gateResult;
      }

      return {
        ...gateResult,
        // Critical hardening rule: CONTEXT_ONLY remains context-only and can
        // never satisfy a mandatory gate merely because it is attached.
        supportingEvidenceIds: unique([
          ...gateResult.supportingEvidenceIds,
          ...binding.supportingEvidenceIds,
        ]),
        conflictingEvidenceIds: unique([
          ...gateResult.conflictingEvidenceIds,
          ...binding.conflictingEvidenceIds,
        ]),
      };
    },
  );

  const boundEvidenceIds = new Set(
    bindings.flatMap((binding) => [
      ...binding.supportingEvidenceIds,
      ...binding.conflictingEvidenceIds,
      ...binding.contextEvidenceIds,
    ]),
  );

  const unboundEvidenceIds = attachments
    .filter(
      (attachment) =>
        !attachment.gateId ||
        !boundEvidenceIds.has(attachment.evidenceId),
    )
    .map((attachment) => attachment.evidenceId);

  return {
    gateResults: gateResultsWithEvidence,
    bindings,
    unboundEvidenceIds: unique(unboundEvidenceIds),
  };
}

export function evidenceAttachmentCounts(
  attachments: readonly EvidenceLike[],
): {
  total: number;
  supporting: number;
  conflicting: number;
  contextOnly: number;
  gateBound: number;
  routeLevel: number;
} {
  return {
    total: attachments.length,
    supporting: attachments.filter(
      (attachment) => attachment.relationship === "SUPPORTING",
    ).length,
    conflicting: attachments.filter(
      (attachment) => attachment.relationship === "CONFLICTING",
    ).length,
    contextOnly: attachments.filter(
      (attachment) => attachment.relationship === "CONTEXT_ONLY",
    ).length,
    gateBound: attachments.filter(
      (attachment) => Boolean(attachment.gateId),
    ).length,
    routeLevel: attachments.filter(
      (attachment) => !attachment.gateId,
    ).length,
  };
}
