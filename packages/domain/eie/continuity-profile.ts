/**
 * Governed continuity profile for EIE evidence windows (s03 continuityPolicy, profile-supplied).
 *
 * TA-14 supplies the continuity semantics below; it supplies no numbers. Every numeric bound
 * comes from the profile's named basis, and a value the governing authority has not supplied is
 * explicitly NOT_ESTABLISHED. Treatment under a resolved profile:
 *
 * - Expected sequence: per (provider, deviceId, channel) stream. CONTIGUOUS_PER_STREAM means each
 *   observation is the previous sequence + 1, and a skip is missing evidence. MONOTONIC_PER_STREAM
 *   means sequences only increase, and a skip is not a gap. Required.
 * - Gaps: a CONTIGUOUS sequence skip, or source time between consecutive observations (or from window
 *   open, or to closure) beyond maxGapSeconds, is recorded as a GAP. The window is BROKEN and closes
 *   (close trigger: continuity break). maxGapSeconds is required.
 * - Maximum observation age: applied only when the profile establishes it. Older observations are rejected.
 * - Duplicates: an exact redelivery (same observationId, same content) is rejected with no continuity
 *   effect. The same observationId or the same stream sequence with different content is a conflicting
 *   duplicate: rejected, and the window is DEGRADED.
 * - Out-of-order: a sequence or source-time regression within a stream is rejected (never re-sequenced)
 *   and the window is DEGRADED. Late arrival never fills a recorded gap.
 * - Source time versus Recorder time: source time is preserved; the Recorder's recording time is
 *   authoritative for chronology. Source time after the Recorder's time by more than
 *   maxSourceClockLeadSeconds (zero when not established) is rejected and DEGRADED. Source time before
 *   the window opened is rejected and DEGRADED.
 * - Degraded versus broken: BROKEN means evidence is known to be missing from the record. DEGRADED means
 *   no evidence is known to be missing, but the source delivered preserved chronology anomalies (and,
 *   per s03, uncorroborated actor events). BROKEN takes precedence.
 * - Closure eligibility: an enabled submitter may close on declared end of purpose or the next lifecycle
 *   receipt at any time. The Recorder alone closes on continuity break or an established timeout.
 *   Evidence sufficiency (for example a minimum duration) is not a Recorder question.
 */
import { objectHash } from "./chain";
import { EIE_REASON } from "./reason-codes";
import { PROFILE_BASIS_KINDS, SEQUENCE_SEMANTICS, type ContinuityProfile, type ProfileBound, type RecorderMode } from "./types";

/** Governed, owner-pinned continuity profiles: `${profileId}@${profileVersion}` -> canonical hash. None exists yet. */
export type ContinuityProfileRegistry = ReadonlyMap<string, string>;
export const GOVERNED_CONTINUITY_PROFILES: ContinuityProfileRegistry = new Map();

const nonEmpty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function boundShape(bound: unknown, valid: (value: unknown) => boolean): boolean {
  if (!isRecord(bound)) return false;
  if (bound.status === "ESTABLISHED") return valid(bound.value) && nonEmpty(bound.basisRef);
  if (bound.status === "NOT_ESTABLISHED") return nonEmpty(bound.requiredFrom);
  return false;
}
const nonNegative = (value: unknown) => typeof value === "number" && Number.isFinite(value) && value >= 0;

export type ProfileResolution =
  | { ok: true; profile: ContinuityProfile; profileHash: string }
  | { ok: false; reasonCodes: string[] };

export function resolveContinuityProfile(
  input: unknown,
  mode: RecorderMode,
  registry: ContinuityProfileRegistry = GOVERNED_CONTINUITY_PROFILES,
): ProfileResolution {
  if (!isRecord(input)) return { ok: false, reasonCodes: [EIE_REASON.PROFILE_INVALID] };
  const basis = input.basis;
  const shapeOk = nonEmpty(input.profileId) && nonEmpty(input.profileVersion)
    && isRecord(basis) && (PROFILE_BASIS_KINDS as readonly unknown[]).includes(basis.kind) && nonEmpty(basis.ref)
    && boundShape(input.sequenceSemantics, (v) => (SEQUENCE_SEMANTICS as readonly unknown[]).includes(v))
    && boundShape(input.maxGapSeconds, nonNegative)
    && boundShape(input.maxObservationAgeSeconds, nonNegative)
    && boundShape(input.maxSourceClockLeadSeconds, nonNegative)
    && boundShape(input.windowTimeoutSeconds, nonNegative);
  if (!shapeOk) return { ok: false, reasonCodes: [EIE_REASON.PROFILE_INVALID] };

  const profile = structuredClone(input) as unknown as ContinuityProfile;
  const codes = new Set<string>();
  if (profile.sequenceSemantics.status !== "ESTABLISHED" || profile.maxGapSeconds.status !== "ESTABLISHED") {
    codes.add(EIE_REASON.PROFILE_BOUND_NOT_ESTABLISHED);
  }
  const profileHash = objectHash(profile);
  if (profile.basis.kind === "SYNTHETIC_FIXTURE" && mode !== "SIMULATION") codes.add(EIE_REASON.PROFILE_NOT_GOVERNED);
  if (mode === "PRODUCTION" && registry.get(`${profile.profileId}@${profile.profileVersion}`) !== profileHash) {
    codes.add(EIE_REASON.PROFILE_NOT_GOVERNED);
  }
  if (codes.size > 0) return { ok: false, reasonCodes: [...codes].sort() };
  return { ok: true, profile, profileHash };
}

/** The established value, or null when the profile explicitly does not establish it. */
export function established<T>(bound: ProfileBound<T>): T | null {
  return bound.status === "ESTABLISHED" ? bound.value : null;
}
