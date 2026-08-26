import type { GapIxcDetermination, GapIxcPortableAssurance } from "./types";

export function toPortableAssurance(
  determination: GapIxcDetermination,
): GapIxcPortableAssurance {
  if (!determination.propositionId || !determination.proposition.trim()) {
    throw new Error("GAP-IXC determination requires a frozen proposition identity.");
  }
  if (!determination.architectureRegistryId || !determination.architectureVersion) {
    throw new Error("GAP-IXC determination requires architecture and version identity.");
  }
  if (!determination.evidenceBasis.length) {
    throw new Error("GAP-IXC state cannot travel without evidentiary standing.");
  }
  if (!determination.independenceBoundary.trim()) {
    throw new Error("GAP-IXC state cannot travel without an independence boundary.");
  }

  return {
    determinationId: determination.determinationId,
    dimension: determination.dimension,
    state: determination.state,
    propositionId: determination.propositionId,
    architectureRegistryId: determination.architectureRegistryId,
    architectureVersion: determination.architectureVersion,
    evidenceBasis: determination.evidenceBasis,
    materialQualification: determination.materialQualification,
    independenceBoundary: determination.independenceBoundary,
    historicalSourceId: determination.historicalSourceId,
  };
}

export function isFavorableGapIxcState(state: GapIxcDetermination["state"]) {
  return state === "ESTABLISHED" || state === "PARTIALLY_ESTABLISHED";
}

export function assertNoNakedFavorableState(determination: GapIxcDetermination) {
  if (!isFavorableGapIxcState(determination.state)) return;

  if (!determination.evidenceBasis.length) {
    throw new Error("Favorable GAP-IXC state missing evidence basis.");
  }
  if (!determination.independenceBoundary.trim()) {
    throw new Error("Favorable GAP-IXC state missing independence boundary.");
  }
  if (!determination.evidenceIds.length) {
    throw new Error("Favorable GAP-IXC state missing admitted evidence references.");
  }
}
