/**
 * Continuity profiles pinned for the Tier 1 pilot: `${profileId}@${profileVersion}` -> canonical hash.
 *
 * EMPTY. A profile enters here only after AUTHORSHIP -> DOCUMENTATION -> INDEPENDENT REVIEW (an eligible
 * reviewer who is not the author, attesting) -> ESTABLISHMENT (TA-14 Governance Owner) -> ACTIVATION (this
 * pin, by owner-authorized change). AI may help draft; it cannot attest. Until then no pilot window opens.
 */
import type { ContinuityProfileRegistry } from "../continuity-profile";

export const PILOT_PINNED_CONTINUITY_PROFILES: ContinuityProfileRegistry = new Map();
