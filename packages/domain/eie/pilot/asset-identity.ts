/**
 * Governed asset identity (Phase 2C ruling 4). Append-only events; nothing is inferred.
 *
 * Field observation vs authority: a nameplate photo plus a transcription is DOCUMENTED; a second person
 * who is not the transcriber checking the transcription against the recorded source makes it VERIFIED.
 * VERIFIED means the transcription matches the observed nameplate, nothing more. It establishes no OEM
 * model transformation, AHRI normalization or matched-system relationship; those need their own
 * authoritative source (the governed OEM registry). Values are compared byte-for-byte: no trimming, case
 * folding, prefix or truncation matching.
 */
import { deepFreeze } from "../chain";
import { EIE_REASON } from "../reason-codes";
import { parseInstant } from "../time";

export const COMPONENT_ROLES = ["OUTDOOR_UNIT", "INDOOR_UNIT", "PACKAGED_UNIT"] as const;
export const NAMEPLATE_FIELDS = ["MANUFACTURER", "MODEL", "SERIAL"] as const;
export type ComponentRole = (typeof COMPONENT_ROLES)[number];
export type NameplateField = (typeof NAMEPLATE_FIELDS)[number];

export interface AssetActor { accountId: string }

export type AssetEvent =
  | { type: "ASSET_REGISTERED"; assetId: string; siteRef: string; installedLocation: string; by: AssetActor; at: string }
  | { type: "COMPONENT_REGISTERED"; assetId: string; componentId: string; role: ComponentRole; by: AssetActor; at: string }
  | { type: "NAMEPLATE_EVIDENCE"; assetId: string; componentId: string; evidenceId: string; imageSha256: string; mediaType: string; storageRef: string | null; capturedAt: string; by: AssetActor; at: string }
  | { type: "TRANSCRIPTION"; assetId: string; componentId: string; transcriptionId: string; evidenceId: string; field: NameplateField; value: string; supersedes: string | null; by: AssetActor; at: string }
  | { type: "TRANSCRIPTION_VERIFICATION"; assetId: string; transcriptionId: string; outcome: "MATCHES_SOURCE" | "DOES_NOT_MATCH"; by: AssetActor; at: string }
  | { type: "COMPONENT_REPLACED"; assetId: string; componentId: string; reason: string; by: AssetActor; at: string };

export type FieldStatus = "DOCUMENTED" | "VERIFIED" | "REFUTED";

export interface FieldState {
  value: string;
  status: FieldStatus;
  transcriptionId: string;
  evidenceId: string;
  transcribedBy: string;
  verifiedBy: string | null;
  corrections: string[];
}

export interface ComponentState {
  componentId: string;
  role: ComponentRole;
  active: boolean;
  evidence: Array<{ evidenceId: string; imageSha256: string; mediaType: string; storageRef: string | null; capturedAt: string; capturedBy: string }>;
  fields: Partial<Record<NameplateField, FieldState>>;
}

export interface AssetState {
  assetId: string;
  siteRef: string;
  installedLocation: string;
  components: ComponentState[];
}

const nonEmpty = (v: unknown): v is string => typeof v === "string" && v.length > 0 && v.trim().length > 0;
const sha256Hex = (v: unknown) => typeof v === "string" && /^[0-9a-f]{64}$/.test(v);

/**
 * Checks one event against the events already recorded for its asset. Returns reason codes; an empty
 * list means the event may be appended.
 */
export function assetEventRefusal(existing: readonly AssetEvent[], event: AssetEvent): string[] {
  const refuse = [EIE_REASON.ASSET_EVENT_REFUSED];
  if (!event || !nonEmpty(event.assetId) || !event.by || !nonEmpty(event.by.accountId) || parseInstant(event.at) === null) return refuse;
  const registered = existing.some((e) => e.type === "ASSET_REGISTERED");
  const component = (id: string) => existing.find((e) => e.type === "COMPONENT_REGISTERED" && e.componentId === id);
  const replaced = (id: string) => existing.some((e) => e.type === "COMPONENT_REPLACED" && e.componentId === id);
  switch (event.type) {
    case "ASSET_REGISTERED":
      return registered || !nonEmpty(event.siteRef) || !nonEmpty(event.installedLocation) ? refuse : [];
    case "COMPONENT_REGISTERED":
      return !registered || component(event.componentId) || !(COMPONENT_ROLES as readonly string[]).includes(event.role) || !nonEmpty(event.componentId) ? refuse : [];
    case "NAMEPLATE_EVIDENCE":
      return !component(event.componentId) || replaced(event.componentId) || !nonEmpty(event.evidenceId) || !sha256Hex(event.imageSha256)
        || !nonEmpty(event.mediaType) || parseInstant(event.capturedAt) === null
        || existing.some((e) => e.type === "NAMEPLATE_EVIDENCE" && e.evidenceId === event.evidenceId) ? refuse : [];
    case "TRANSCRIPTION": {
      const evidence = existing.find((e) => e.type === "NAMEPLATE_EVIDENCE" && e.evidenceId === event.evidenceId && e.componentId === event.componentId);
      const prior = event.supersedes === null ? undefined
        : existing.find((e) => e.type === "TRANSCRIPTION" && e.transcriptionId === event.supersedes);
      const supersedesOk = event.supersedes === null
        || (prior?.type === "TRANSCRIPTION" && prior.componentId === event.componentId && prior.field === event.field);
      return !evidence || replaced(event.componentId) || !(NAMEPLATE_FIELDS as readonly string[]).includes(event.field) || !nonEmpty(event.value)
        || !supersedesOk || existing.some((e) => e.type === "TRANSCRIPTION" && e.transcriptionId === event.transcriptionId) ? refuse : [];
    }
    case "TRANSCRIPTION_VERIFICATION": {
      const transcription = existing.find((e) => e.type === "TRANSCRIPTION" && e.transcriptionId === event.transcriptionId);
      if (transcription?.type !== "TRANSCRIPTION") return refuse;
      // The original transcriber and the verifier must be different people.
      if (transcription.by.accountId === event.by.accountId) return refuse;
      if (existing.some((e) => e.type === "TRANSCRIPTION_VERIFICATION" && e.transcriptionId === event.transcriptionId)) return refuse;
      return event.outcome === "MATCHES_SOURCE" || event.outcome === "DOES_NOT_MATCH" ? [] : refuse;
    }
    case "COMPONENT_REPLACED":
      return !component(event.componentId) || replaced(event.componentId) || !nonEmpty(event.reason) ? refuse : [];
    default:
      return refuse;
  }
}

/** Derives the asset's identity state; returns undefined if the asset was never registered. */
export function deriveAsset(events: readonly AssetEvent[]): AssetState | undefined {
  const asset = events.find((e) => e.type === "ASSET_REGISTERED");
  if (asset?.type !== "ASSET_REGISTERED") return undefined;
  const components: ComponentState[] = [];
  for (const e of events) {
    if (e.type !== "COMPONENT_REGISTERED") continue;
    const own = events.filter((x) => "componentId" in x && x.componentId === e.componentId);
    const transcriptions = own.filter((x): x is Extract<AssetEvent, { type: "TRANSCRIPTION" }> => x.type === "TRANSCRIPTION");
    const superseded = new Set(transcriptions.map((t) => t.supersedes).filter((s): s is string => s !== null));
    const fields: ComponentState["fields"] = {};
    for (const field of NAMEPLATE_FIELDS) {
      const current = transcriptions.filter((t) => t.field === field && !superseded.has(t.transcriptionId));
      if (current.length !== 1) continue; // none, or an unresolved branch: never pick one
      const t = current[0];
      const verification = events.find((v) => v.type === "TRANSCRIPTION_VERIFICATION" && v.transcriptionId === t.transcriptionId);
      fields[field] = {
        value: t.value,
        status: verification?.type !== "TRANSCRIPTION_VERIFICATION" ? "DOCUMENTED" : verification.outcome === "MATCHES_SOURCE" ? "VERIFIED" : "REFUTED",
        transcriptionId: t.transcriptionId, evidenceId: t.evidenceId, transcribedBy: t.by.accountId,
        verifiedBy: verification?.type === "TRANSCRIPTION_VERIFICATION" ? verification.by.accountId : null,
        corrections: transcriptions.filter((x) => x.field === field && superseded.has(x.transcriptionId)).map((x) => x.transcriptionId),
      };
    }
    components.push({
      componentId: e.componentId, role: e.role,
      active: !own.some((x) => x.type === "COMPONENT_REPLACED"),
      evidence: own.filter((x): x is Extract<AssetEvent, { type: "NAMEPLATE_EVIDENCE" }> => x.type === "NAMEPLATE_EVIDENCE")
        .map((x) => ({ evidenceId: x.evidenceId, imageSha256: x.imageSha256, mediaType: x.mediaType, storageRef: x.storageRef, capturedAt: x.capturedAt, capturedBy: x.by.accountId })),
      fields,
    });
  }
  return deepFreeze({ assetId: asset.assetId, siteRef: asset.siteRef, installedLocation: asset.installedLocation, components });
}

/**
 * Gate A consistency: each declared C1-R7 equipment string must exactly equal the VERIFIED transcription
 * of the corresponding field on the single active component of the corresponding role.
 *   manufacturer -> OUTDOOR_UNIT (or PACKAGED_UNIT) MANUFACTURER
 *   outdoorModel -> OUTDOOR_UNIT (or PACKAGED_UNIT) MODEL
 *   indoorModel  -> INDOOR_UNIT MODEL
 * An empty or absent declared field is left to C1-R7 (which holds on missing identity); nothing is filled in.
 */
export function declaredEquipmentConsistency(asset: AssetState | undefined, declared: unknown): string[] {
  if (!asset) return [EIE_REASON.ASSET_UNKNOWN];
  const equipment = (declared as { evidence?: { equipment?: Record<string, unknown> } } | null)?.evidence?.equipment ?? {};
  const active = (roles: ComponentRole[]) => asset.components.filter((c) => c.active && roles.includes(c.role));
  const checks: Array<[unknown, ComponentRole[], NameplateField]> = [
    [equipment.manufacturer, ["OUTDOOR_UNIT", "PACKAGED_UNIT"], "MANUFACTURER"],
    [equipment.outdoorModel, ["OUTDOOR_UNIT", "PACKAGED_UNIT"], "MODEL"],
    [equipment.indoorModel, ["INDOOR_UNIT"], "MODEL"],
  ];
  const codes = new Set<string>();
  for (const [value, roles, field] of checks) {
    if (value === undefined || value === null || value === "") continue;
    const candidates = active(roles);
    const verified = candidates.length === 1 ? candidates[0].fields[field] : undefined;
    if (!verified || verified.status !== "VERIFIED") codes.add(EIE_REASON.ASSET_IDENTITY_UNVERIFIED);
    else if (value !== verified.value) codes.add(EIE_REASON.ASSET_IDENTITY_MISMATCH);
  }
  return [...codes].sort();
}
