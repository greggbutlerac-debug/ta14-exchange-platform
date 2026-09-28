/**
 * Governed OEM reference registry (TA-14-NIRET-GA-C1 Amendments A7 and A8 / C1-R5).
 *
 * Source records: one separately preserved authoritative document each (outdoor-unit
 * instructions, indoor-unit fan performance, product data, or an AHRI certification
 * listing), with its own hash, acquisition, transcription, independent review,
 * applicability and supersession.
 *
 * System bindings: bind source records to one exactly matched system without merging
 * them. Every criterion maps to exactly one constituent; pairing comes from first-party
 * OEM match data or a verified AHRI listing, which never supplies a technical criterion.
 *
 * Custody is process-based (A7): records and bindings reach the registry only through an
 * owner-reviewed change pinning their canonical SHA-256 in the manifest. Any structural
 * rejection makes the whole registry unavailable (fail closed, ESCALATE). Content
 * conflicts between bound sources make that binding inadmissible (R5-02, HOLD).
 * Nothing is invented, interpolated or defaulted.
 */

import Ajv2020 from "ajv/dist/2020";
import { sha256Canonical } from "../../../crypto/receipts";
import bindingSchema from "../../../../schemas/niret-oem-system-binding.schema.json";
import recordSchema from "../../../../schemas/niret-oem-reference-record.schema.json";
import { EXPECTED_UNIT } from "../evaluate-gate-a";
import { resolveRange } from "../range";
import type {
  ApplicabilityCondition,
  CriterionCandidate,
  MeasurementKey,
  MeteringType,
  OemRange,
  OemReference,
  OemSourceClass,
  OemSourceProvenance,
  RangeDerivation,
  Unit,
} from "../types";

export interface Cite {
  pageRef: string;
  tableOrChart: string | null;
}

interface CitedValue { value: number; cite: Cite }

type CitedDerivation =
  | { form: "TOLERANCE_BAND"; nominal: CitedValue; tolerance: CitedValue }
  | { form: "PERCENT_OF_RATED"; rated: CitedValue; percent: CitedValue }
  | { form: "PER_TON"; nominalTons: CitedValue; minPerTon: CitedValue | null; maxPerTon: CitedValue | null };

export interface CitedRange {
  min: number | null;
  max: number | null;
  unit: Unit;
  cite: Cite;
  unbounded?: { side: "MIN" | "MAX"; cite: Cite };
  derivation?: CitedDerivation;
}

interface RecordCondition {
  measurement: MeasurementKey;
  min: number | null;
  max: number | null;
  unit: Unit;
  cite: Cite;
  unbounded?: { side: "MIN" | "MAX"; cite: Cite };
}

interface RecordCandidate {
  candidateId: string;
  range: CitedRange;
  meteringTypes?: MeteringType[];
  appliesWhen: RecordCondition[];
}

type Absent = { status: "NOT_IN_DOCUMENT" } | { status: "OEM_CONFIRMED_NOT_PUBLISHED"; cite: Cite };

export interface SourceCriteria {
  chargingMethod?:
    | {
        status: "IDENTIFIED";
        description: string;
        cite: Cite;
        pressureBased: boolean;
        meteringTypes?: MeteringType[];
        conditions?: RecordCondition[];
        postEventVerification?: { text: string; cite: Cite };
      }
    | Absent;
  specialToolOrModeRequired?: { value: boolean; description: string | null; cite: Cite | null };
  airflowCriteria?: Array<
    | { kind: "CFM_RANGE"; range: CitedRange; meteringTypes?: MeteringType[] }
    | { kind: "TEMPERATURE_DROP"; coverage: "COMPLETE" | "PARTIAL"; candidates: RecordCandidate[]; meteringTypes?: MeteringType[] }
  >;
  espTableDomain?: { blowerSetting: string; range: CitedRange };
  staticLimits?: Array<{ component: "TOTAL" | "RETURN" | "SUPPLY"; basis: "SIGNED" | "MAGNITUDE"; range: CitedRange }>;
  /** A9: OEM fan-performance data, values exactly as published. */
  fanPerformance?: {
    convention: { text: string; cite: Cite };
    designatedSetting: { setting: string; cite: Cite } | null;
    settings: Array<{ setting: string; coolingPermitted: boolean; cite: Cite; points: Array<{ esp: number; cfm: number }> }>;
  };
  ambientEnvelope?: CitedRange;
  voltageRange?: CitedRange;
  minRunMinutes?: { value: number; cite: Cite };
  stabilityCriterion?: { measurement: MeasurementKey; maxChange: number; unit: Unit; cite: Cite };
  permitsEcmWithTableMethod?: { value: boolean; cite: Cite };
  measurementLocations?: Partial<Record<MeasurementKey, { location: string; oemText: string; cite: Cite }>>;
  noninvasiveCriterion?:
    | {
        status: "PUBLISHED";
        derivation: Extract<OemReference["noninvasiveCriterion"], { status: "PUBLISHED" }>["derivation"];
        definitionCite?: Cite | null;
        coverage: "COMPLETE" | "PARTIAL";
        lookup: { interpolationRequired: boolean; calculationRequired: boolean; unrepresentedConditions: string[] };
        candidates: RecordCandidate[];
      }
    | Absent;
}

type Review = {
  state: "PENDING_REVIEW" | "VERIFIED" | "REJECTED";
  reviewedBy: string | null;
  reviewedAt: string | null;
  method: "INDEPENDENT_SECOND_READ_AGAINST_HASHED_DOCUMENT";
  notes: string | null;
};
type Status = { supersession: "CURRENT" | "SUPERSEDED" | "WITHDRAWN"; supersededBy: string | null; supersedes: string[] };

/** One separately preserved authoritative source (A8). */
export interface OemReferenceRecord {
  recordId: string;
  recordVersion: number;
  contract: "TA-14-NIRET-GA-C1/A8";
  sourceClass: OemSourceClass;
  manufacturer: string;
  coverage: { modelFamily: string | null; models: string[] };
  matchedSystems: Array<{ indoorModel: string; outdoorModel: string; meteringDevice?: MeteringType | null; cite: Cite }>;
  ahriReference: string | null;
  /** A10: structured AHRI listing evidence (AHRI_CERTIFICATION_LISTING only). */
  ahriListing?: AhriListing | null;
  document: { documentId: string; title: string; revision: string | null; date: string | null; sha256: string; mediaType: string };
  acquisition: {
    method: "OEM_WEBSITE_DOWNLOAD" | "OEM_DIRECT_SUPPLY" | "DISTRIBUTOR_SUPPLY" | "LITERATURE_SHIPPED_WITH_EQUIPMENT" | "AHRI_DIRECTORY_CERTIFICATE" | "AHRI_DIRECTORY_RECORD";
    sourceRef: string;
    acquiredBy: string;
    acquiredAt: string;
  };
  curation: { transcribedBy: string; transcribedAt: string; curationRequestRef: string | null };
  review: Review;
  status: Status;
  criteria: SourceCriteria;
}

/** Amendment A10: AHRI listing evidence, present or historical. */
export interface AhriListing {
  referenceNumber: string;
  listedOutdoorModel: string;
  listedIndoorModel: string;
  enhancements: Array<{ notation: string; meaning: string; authority: string }>;
  historicalListingEvidence: string;
  presentStatus: "ACTIVE" | "PRODUCTION_STOPPED" | "DISCONTINUED" | "OBSOLETE";
  presentStatusObservedAt: string;
  certifiedAtObservation: boolean;
  listedFrom: string | null;
  discontinuedOn: string | null;
  ratingsBasis: string | null;
  ratings: Record<string, number | null>;
  limitations: string;
}

/** AHRI General OM section 11.4: only Active and Production Stopped models are AHRI certified. */
const AHRI_CERTIFIED_STATUSES = new Set(["ACTIVE", "PRODUCTION_STOPPED"]);

export type CriterionKey = Exclude<keyof SourceCriteria, "measurementLocations">;

/** Binds separately preserved sources to one exactly matched system (A8). */
export interface OemSystemBinding {
  bindingId: string;
  bindingVersion: number;
  contract: "TA-14-NIRET-GA-C1/A8";
  system: { manufacturer: string; indoorModel: string; outdoorModel: string };
  constituents: Array<{ recordId: string; recordHash: string }>;
  pairingSources: string[];
  criterionSources: Partial<Record<CriterionKey, string>> & {
    specialToolOrModeRequired: string;
    measurementLocations?: Partial<Record<MeasurementKey, string>>;
  };
  noninvasiveCriterionAbsence: "NOT_IN_BOUND_SOURCES" | "OEM_CONFIRMED_NOT_PUBLISHED" | null;
  curation: { transcribedBy: string; transcribedAt: string };
  review: Review;
  status: Status;
}

export interface RegistryManifest {
  records: Record<string, string>;
  bindings: Record<string, string>;
}

interface AcceptedBinding {
  binding: OemSystemBinding;
  bindingHash: string;
  /** R5-02: content conflicts between bound sources; any conflict makes the binding inadmissible (HOLD). */
  conflicts: string[];
}

export interface OemRegistry {
  /** False when any record, binding or manifest entry was rejected: the registry then resolves nothing. */
  available: boolean;
  records: ReadonlyArray<{ record: OemReferenceRecord; recordHash: string }>;
  bindings: ReadonlyArray<AcceptedBinding>;
  rejections: ReadonlyArray<{ id: string | null; reason: string }>;
}

export type OemResolution =
  | { status: "RESOLVED"; bindingId: string; bindingHash: string; binding: OemSystemBinding; sources: OemReferenceRecord[]; reference: OemReference }
  | { status: "CONFLICT"; bindingId: string; bindingHash: string; conflicts: string[] }
  | { status: "NOT_VERIFIED"; bindingId: string }
  | { status: "NO_RECORD" }
  | { status: "REGISTRY_UNAVAILABLE"; reasons: string[] };

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validateRecord = ajv.compile(recordSchema);
const validateBinding = ajv.compile(bindingSchema);

/** Identity compares exactly, ignoring only case and whitespace (A7). */
export const identityKey = (value: string): string => value.toUpperCase().replace(/\s+/g, "");

const RANGE_UNITS: Readonly<Record<"ambientEnvelope" | "voltageRange", Unit>> = { ambientEnvelope: "F", voltageRange: "V" };
const CRITERION_KEYS: readonly CriterionKey[] = [
  "chargingMethod", "specialToolOrModeRequired", "airflowCriteria", "espTableDomain", "staticLimits", "fanPerformance",
  "ambientEnvelope", "voltageRange", "minRunMinutes", "stabilityCriterion", "permitsEcmWithTableMethod", "noninvasiveCriterion",
];
const LISTING: OemSourceClass = "AHRI_CERTIFICATION_LISTING";

const at = (stamp: string | null) => (stamp === null ? Number.NaN : Date.parse(stamp));

/** Engine form of a cited derivation (values only). */
function engineDerivation(derivation: CitedDerivation): RangeDerivation {
  if (derivation.form === "TOLERANCE_BAND") return { form: "TOLERANCE_BAND", nominal: derivation.nominal.value, tolerance: derivation.tolerance.value };
  if (derivation.form === "PERCENT_OF_RATED") return { form: "PERCENT_OF_RATED", rated: derivation.rated.value, percent: derivation.percent.value };
  return {
    form: "PER_TON", nominalTons: derivation.nominalTons.value,
    minPerTon: derivation.minPerTon?.value ?? null, maxPerTon: derivation.maxPerTon?.value ?? null,
  };
}

function rangeResolves(range: CitedRange | RecordCondition): boolean {
  const derivation = "derivation" in range && range.derivation ? engineDerivation(range.derivation) : undefined;
  return resolveRange({ min: range.min, max: range.max, unbounded: range.unbounded?.side, derivation }) !== null;
}

function reviewFindings(review: Review, transcribedBy: string, transcribedAt: string, prefix: string): string[] {
  const findings: string[] = [];
  if (review.state !== "PENDING_REVIEW" && (!review.reviewedBy || !review.reviewedAt)) findings.push(`${prefix}REVIEW_IDENTITY_OR_TIME_MISSING`);
  if (review.state === "VERIFIED" && review.reviewedBy && identityKey(review.reviewedBy) === identityKey(transcribedBy)) {
    findings.push(`${prefix}REVIEW_NOT_INDEPENDENT_OF_TRANSCRIPTION`);
  }
  if (review.reviewedAt && at(review.reviewedAt) < at(transcribedAt)) findings.push(`${prefix}REVIEW_PRECEDES_TRANSCRIPTION`);
  return findings;
}

function statusFindings(status: Status): string[] {
  if (status.supersession === "SUPERSEDED" && !status.supersededBy) return ["SUPERSEDED_WITHOUT_SUCCESSOR"];
  if (status.supersession === "CURRENT" && status.supersededBy) return ["CURRENT_RECORD_NAMES_SUCCESSOR"];
  return [];
}

function candidateFindings(candidates: readonly RecordCandidate[], indicatorUnit: Unit, label: string): string[] {
  const findings: string[] = [];
  const ids = new Set<string>();
  const axes = (candidate: RecordCandidate) => candidate.appliesWhen.map((c) => c.measurement).sort().join(",");
  const firstAxes = axes(candidates[0] as RecordCandidate);
  for (const candidate of candidates) {
    if (ids.has(candidate.candidateId)) findings.push(`CANDIDATE_ID_DUPLICATED:${label}:${candidate.candidateId}`);
    ids.add(candidate.candidateId);
    if (!rangeResolves(candidate.range)) findings.push(`BOUNDS_INVALID:${label}:${candidate.candidateId}`);
    if (candidate.range.unit !== indicatorUnit) findings.push(`UNIT_NOT_CONTRACT_UNIT:${label}:${candidate.candidateId}`);
    if (new Set(candidate.appliesWhen.map((c) => c.measurement)).size !== candidate.appliesWhen.length) {
      findings.push(`CONDITION_REPEATED:${label}:${candidate.candidateId}`);
    }
    if (axes(candidate) !== firstAxes) findings.push(`CANDIDATE_CONDITIONS_NOT_UNIFORM:${label}:${candidate.candidateId}`);
    for (const condition of candidate.appliesWhen) {
      if (!rangeResolves(condition)) findings.push(`BOUNDS_INVALID:${label}:${candidate.candidateId}:${condition.measurement}`);
      if (condition.unit !== EXPECTED_UNIT[condition.measurement]) findings.push(`UNIT_NOT_CONTRACT_UNIT:${label}:${candidate.candidateId}:${condition.measurement}`);
    }
  }
  // Overlapping applicability (for the same metering applicability) would let two published values apply at once.
  const low = (c: RecordCondition) => c.min ?? -Infinity;
  const high = (c: RecordCondition) => c.max ?? Infinity;
  const meteringOverlap = (a: RecordCandidate, b: RecordCandidate) =>
    !a.meteringTypes || !b.meteringTypes || a.meteringTypes.some((type) => b.meteringTypes?.includes(type));
  candidates.forEach((a, i) => candidates.slice(i + 1).forEach((b) => {
    const overlaps = meteringOverlap(a, b) && a.appliesWhen.every((ca) => {
      const cb = b.appliesWhen.find((c) => c.measurement === ca.measurement);
      return cb !== undefined && low(ca) < high(cb) && low(cb) < high(ca);
    });
    if (overlaps) findings.push(`CANDIDATE_BANDS_OVERLAP:${label}:${a.candidateId}/${b.candidateId}`);
  }));
  return findings;
}

/** Registration rules for one source record beyond the schema. Empty means registrable. */
export function registrationFindings(record: OemReferenceRecord): string[] {
  const findings: string[] = [];
  for (const [label, stamp] of [["acquiredAt", record.acquisition.acquiredAt], ["transcribedAt", record.curation.transcribedAt], ["reviewedAt", record.review.reviewedAt]] as const) {
    if (stamp !== null && Number.isNaN(at(stamp))) findings.push(`TIMESTAMP_UNPARSEABLE:${label}`);
  }
  findings.push(...reviewFindings(record.review, record.curation.transcribedBy, record.curation.transcribedAt, ""));
  findings.push(...statusFindings(record.status));

  const criteria = record.criteria;
  if (record.sourceClass === LISTING) {
    // An AHRI listing establishes pairing identity only; it never carries technical criteria.
    if (Object.keys(criteria).length > 0) findings.push("CERTIFICATION_LISTING_CARRIES_CRITERIA");
    if (!record.ahriReference) findings.push("CERTIFICATION_LISTING_WITHOUT_REFERENCE");
    if (record.matchedSystems.length === 0) findings.push("CERTIFICATION_LISTING_WITHOUT_MATCH");
    // A10: the listing must carry structured present/historical status and never overstate certification.
    const listing = record.ahriListing;
    if (!listing) findings.push("AHRI_LISTING_EVIDENCE_MISSING");
    else {
      if (listing.referenceNumber !== record.ahriReference) findings.push("AHRI_LISTING_REFERENCE_MISMATCH");
      if (listing.certifiedAtObservation !== AHRI_CERTIFIED_STATUSES.has(listing.presentStatus)) findings.push("AHRI_CERTIFICATION_STATUS_MISREPRESENTED");
      if (!record.matchedSystems.some((system) => system.outdoorModel === listing.listedOutdoorModel && system.indoorModel === listing.listedIndoorModel)) {
        findings.push("AHRI_LISTED_COMBINATION_NOT_IN_MATCHED_SYSTEMS");
      }
      if (Number.isNaN(at(listing.presentStatusObservedAt))) findings.push("TIMESTAMP_UNPARSEABLE:presentStatusObservedAt");
    }
  } else {
    if (record.ahriReference !== null) findings.push("AHRI_REFERENCE_ON_NON_LISTING_SOURCE");
    if (record.ahriListing) findings.push("AHRI_LISTING_ON_NON_LISTING_SOURCE");
  }

  for (const key of Object.keys(RANGE_UNITS) as Array<keyof typeof RANGE_UNITS>) {
    const range = criteria[key];
    if (!range) continue;
    if (!rangeResolves(range)) findings.push(`BOUNDS_INVALID:${key}`);
    if (range.unit !== RANGE_UNITS[key]) findings.push(`UNIT_NOT_CONTRACT_UNIT:${key}`);
  }
  if (criteria.espTableDomain) {
    if (!rangeResolves(criteria.espTableDomain.range)) findings.push("BOUNDS_INVALID:espTableDomain");
    if (criteria.espTableDomain.range.unit !== "IN_WC") findings.push("UNIT_NOT_CONTRACT_UNIT:espTableDomain");
  }
  (criteria.staticLimits ?? []).forEach((limit, i) => {
    if (!rangeResolves(limit.range)) findings.push(`BOUNDS_INVALID:staticLimits:${i}`);
    if (limit.range.unit !== "IN_WC") findings.push(`UNIT_NOT_CONTRACT_UNIT:staticLimits:${i}`);
  });
  if (criteria.fanPerformance) {
    const fan = criteria.fanPerformance;
    const names = new Set<string>();
    fan.settings.forEach((setting) => {
      if (names.has(identityKey(setting.setting))) findings.push(`FAN_SETTING_DUPLICATED:${setting.setting}`);
      names.add(identityKey(setting.setting));
      if (new Set(setting.points.map((point) => point.esp)).size !== setting.points.length) findings.push(`FAN_ESP_DUPLICATED:${setting.setting}`);
    });
    if (fan.designatedSetting) {
      const designated = fan.settings.find((setting) => identityKey(setting.setting) === identityKey(fan.designatedSetting?.setting ?? ""));
      if (!designated || !designated.coolingPermitted) findings.push("FAN_DESIGNATED_SETTING_NOT_PUBLISHED_FOR_COOLING");
    }
  }
  if (criteria.stabilityCriterion && criteria.stabilityCriterion.unit !== EXPECTED_UNIT[criteria.stabilityCriterion.measurement]) {
    findings.push("UNIT_NOT_CONTRACT_UNIT:stabilityCriterion");
  }
  if (criteria.chargingMethod?.status === "IDENTIFIED") {
    for (const condition of criteria.chargingMethod.conditions ?? []) {
      if (!rangeResolves(condition)) findings.push(`BOUNDS_INVALID:chargingMethod:${condition.measurement}`);
      if (condition.unit !== EXPECTED_UNIT[condition.measurement]) findings.push(`UNIT_NOT_CONTRACT_UNIT:chargingMethod:${condition.measurement}`);
    }
    if (criteria.chargingMethod.postEventVerification && !criteria.chargingMethod.pressureBased) {
      findings.push("POST_EVENT_VERIFICATION_ON_NON_PRESSURE_METHOD");
    }
  }
  (criteria.airflowCriteria ?? []).forEach((criterion, i) => {
    if (criterion.kind === "CFM_RANGE") {
      if (!rangeResolves(criterion.range)) findings.push(`BOUNDS_INVALID:airflowCriteria:${i}`);
      if (criterion.range.unit !== "CFM") findings.push(`UNIT_NOT_CONTRACT_UNIT:airflowCriteria:${i}`);
    } else {
      findings.push(...candidateFindings(criterion.candidates, "F", `airflowCriteria:${i}`));
    }
  });
  const criterion = criteria.noninvasiveCriterion;
  if (criterion?.status === "PUBLISHED") {
    const indicatorUnit = criterion.derivation.kind === "SINGLE_MEASUREMENT" ? EXPECTED_UNIT[criterion.derivation.measurement] : "F";
    findings.push(...candidateFindings(criterion.candidates, indicatorUnit, "noninvasiveCriterion"));
    // R5-09: the approach derivation is admissible only where the OEM itself defines it.
    if (criterion.derivation.kind === "LIQUID_LINE_MINUS_OUTDOOR_DRY_BULB" && !criterion.definitionCite) {
      findings.push("DERIVATION_NOT_DEFINED_BY_OEM:noninvasiveCriterion");
    }
  }
  return findings;
}

/** Criterion content without citations, for R5-02 conflict comparison. */
function withoutCites(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutCites);
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .filter(([key]) => key !== "cite" && key !== "definitionCite")
    .map(([key, child]) => [key, withoutCites(child)]));
}

const states = (value: { status?: string } | undefined) =>
  value !== undefined && value.status !== "NOT_IN_DOCUMENT";

/** Binding rules: structural rejections (registry unavailable) and content conflicts (binding inadmissible). */
export function bindingFindings(
  binding: OemSystemBinding,
  sources: ReadonlyMap<string, { record: OemReferenceRecord; recordHash: string }>,
): { rejections: string[]; conflicts: string[] } {
  const rejections: string[] = [];
  const conflicts: string[] = [];
  rejections.push(...reviewFindings(binding.review, binding.curation.transcribedBy, binding.curation.transcribedAt, "BINDING_"));
  rejections.push(...statusFindings(binding.status).map((reason) => `BINDING_${reason}`));

  const constituentIds = new Set<string>();
  for (const constituent of binding.constituents) {
    constituentIds.add(constituent.recordId);
    const source = sources.get(constituent.recordId);
    if (!source) rejections.push(`CONSTITUENT_NOT_REGISTERED:${constituent.recordId}`);
    else if (source.recordHash !== constituent.recordHash) rejections.push(`CONSTITUENT_HASH_MISMATCH:${constituent.recordId}`);
  }
  if (constituentIds.size !== binding.constituents.length) rejections.push("CONSTITUENT_DUPLICATED");
  const bound = (id: string) => (constituentIds.has(id) ? sources.get(id)?.record : undefined);

  for (const id of binding.pairingSources) if (!constituentIds.has(id)) rejections.push(`PAIRING_SOURCE_NOT_CONSTITUENT:${id}`);
  const mapped: Array<[string, string]> = [
    ...CRITERION_KEYS.flatMap((key) => (binding.criterionSources[key] ? [[key, binding.criterionSources[key] as string] as [string, string]] : [])),
    ...Object.entries(binding.criterionSources.measurementLocations ?? {}).map(([key, id]) => [`measurementLocations.${key}`, id as string] as [string, string]),
  ];
  for (const [key, id] of mapped) {
    const record = bound(id);
    if (!constituentIds.has(id)) { rejections.push(`CRITERION_SOURCE_NOT_CONSTITUENT:${key}`); continue; }
    if (!record) continue;
    if (record.sourceClass === LISTING) { rejections.push(`CRITERION_FROM_CERTIFICATION_LISTING:${key}`); continue; }
    const present = key.startsWith("measurementLocations.")
      ? record.criteria.measurementLocations?.[key.split(".")[1] as MeasurementKey] !== undefined
      : record.criteria[key as CriterionKey] !== undefined;
    if (!present) rejections.push(`CRITERION_NOT_IN_SOURCE:${key}`);
  }
  if (binding.criterionSources.noninvasiveCriterion && binding.noninvasiveCriterionAbsence !== null) rejections.push("NONINVASIVE_CRITERION_MAPPED_AND_ABSENT");
  if (!binding.criterionSources.noninvasiveCriterion && binding.noninvasiveCriterionAbsence === null) rejections.push("NONINVASIVE_CRITERION_UNACCOUNTED");

  // R5-02 content conflicts.
  const members = binding.constituents.flatMap((c) => (bound(c.recordId) ? [bound(c.recordId) as OemReferenceRecord] : []));
  for (const record of members) {
    if (identityKey(record.manufacturer) !== identityKey(binding.system.manufacturer)) conflicts.push(`MANUFACTURER_MISMATCH:${record.recordId}`);
  }
  for (const id of binding.pairingSources) {
    const record = bound(id);
    if (!record) continue;
    const lists = record.matchedSystems.some((system) =>
      identityKey(system.indoorModel) === identityKey(binding.system.indoorModel) &&
      identityKey(system.outdoorModel) === identityKey(binding.system.outdoorModel));
    if (!lists) conflicts.push(`PAIRING_SOURCE_DOES_NOT_LIST_SYSTEM:${id}`);
  }
  const technical = members.filter((record) => record.sourceClass !== LISTING);
  for (const key of CRITERION_KEYS) {
    const stated = technical.filter((record) => states(record.criteria[key] as { status?: string } | undefined));
    const distinct = new Set(stated.map((record) => JSON.stringify(withoutCites(record.criteria[key]))));
    if (distinct.size > 1) conflicts.push(`CRITERION_CONFLICT:${key}`);
  }
  const locationKeys = new Set(technical.flatMap((record) => Object.keys(record.criteria.measurementLocations ?? {})));
  for (const key of locationKeys) {
    const distinct = new Set(technical.flatMap((record) => {
      const value = record.criteria.measurementLocations?.[key as MeasurementKey];
      return value ? [value.location] : [];
    }));
    if (distinct.size > 1) conflicts.push(`CRITERION_CONFLICT:measurementLocations.${key}`);
  }
  if (binding.noninvasiveCriterionAbsence !== null && technical.some((record) => record.criteria.noninvasiveCriterion?.status === "PUBLISHED")) {
    conflicts.push("NONINVASIVE_CRITERION_ABSENCE_CONTRADICTED");
  }
  if (binding.noninvasiveCriterionAbsence === "OEM_CONFIRMED_NOT_PUBLISHED" &&
    !technical.some((record) => record.criteria.noninvasiveCriterion?.status === "OEM_CONFIRMED_NOT_PUBLISHED")) {
    rejections.push("NONINVASIVE_ABSENCE_CONFIRMATION_NOT_CITED");
  }
  return { rejections, conflicts };
}

export function loadOemRegistry(
  records: readonly unknown[],
  bindings: readonly unknown[],
  manifest: RegistryManifest,
): OemRegistry {
  const accepted = new Map<string, { record: OemReferenceRecord; recordHash: string }>();
  const acceptedBindings: AcceptedBinding[] = [];
  const rejections: Array<{ id: string | null; reason: string }> = [];
  const idOf = (raw: unknown, key: string) => {
    const value = (raw as Record<string, unknown> | null)?.[key];
    return typeof value === "string" ? value : null;
  };

  const seenRecords = new Set<string>();
  for (const raw of records) {
    const id = idOf(raw, "recordId");
    if (!validateRecord(raw)) {
      rejections.push({ id, reason: `SCHEMA_INVALID:${(validateRecord.errors ?? []).map((e) => `${e.instancePath} ${e.message}`).join("; ")}` });
      continue;
    }
    const record = raw as unknown as OemReferenceRecord;
    if (seenRecords.has(record.recordId)) { rejections.push({ id, reason: "RECORD_ID_DUPLICATED" }); continue; }
    seenRecords.add(record.recordId);
    const recordHash = sha256Canonical(record);
    if (manifest.records[record.recordId] !== recordHash) { rejections.push({ id, reason: "RECORD_HASH_NOT_PINNED_IN_MANIFEST" }); continue; }
    const findings = registrationFindings(record);
    if (findings.length > 0) { for (const reason of findings) rejections.push({ id, reason }); continue; }
    accepted.set(record.recordId, { record, recordHash });
  }
  for (const id of Object.keys(manifest.records)) if (!seenRecords.has(id)) rejections.push({ id, reason: "MANIFEST_ENTRY_WITHOUT_RECORD" });

  const seenBindings = new Set<string>();
  for (const raw of bindings) {
    const id = idOf(raw, "bindingId");
    if (!validateBinding(raw)) {
      rejections.push({ id, reason: `SCHEMA_INVALID:${(validateBinding.errors ?? []).map((e) => `${e.instancePath} ${e.message}`).join("; ")}` });
      continue;
    }
    const binding = raw as unknown as OemSystemBinding;
    if (seenBindings.has(binding.bindingId)) { rejections.push({ id, reason: "BINDING_ID_DUPLICATED" }); continue; }
    seenBindings.add(binding.bindingId);
    const bindingHash = sha256Canonical(binding);
    if (manifest.bindings[binding.bindingId] !== bindingHash) { rejections.push({ id, reason: "BINDING_HASH_NOT_PINNED_IN_MANIFEST" }); continue; }
    const { rejections: structural, conflicts } = bindingFindings(binding, accepted);
    if (structural.length > 0) { for (const reason of structural) rejections.push({ id, reason }); continue; }
    acceptedBindings.push({ binding, bindingHash, conflicts });
  }
  for (const id of Object.keys(manifest.bindings)) if (!seenBindings.has(id)) rejections.push({ id, reason: "MANIFEST_ENTRY_WITHOUT_BINDING" });

  // At most one CURRENT, non-rejected binding per exact system.
  const claimed = new Map<string, string>();
  for (const { binding } of acceptedBindings) {
    if (binding.status.supersession !== "CURRENT" || binding.review.state === "REJECTED") continue;
    const key = [binding.system.manufacturer, binding.system.indoorModel, binding.system.outdoorModel].map(identityKey).join("|");
    const other = claimed.get(key);
    if (other) rejections.push({ id: binding.bindingId, reason: `DUPLICATE_CURRENT_BINDING_FOR_SYSTEM:${other}` });
    else claimed.set(key, binding.bindingId);
  }

  return { available: rejections.length === 0, records: [...accepted.values()], bindings: acceptedBindings, rejections };
}

export function resolveOemReference(
  registry: OemRegistry,
  equipment: { manufacturer?: unknown; indoorModel?: unknown; outdoorModel?: unknown },
): OemResolution {
  if (!registry.available) {
    return { status: "REGISTRY_UNAVAILABLE", reasons: registry.rejections.map((item) => `${item.id ?? "?"}:${item.reason}`) };
  }
  const { manufacturer, indoorModel, outdoorModel } = equipment;
  if (typeof manufacturer !== "string" || typeof indoorModel !== "string" || typeof outdoorModel !== "string") return { status: "NO_RECORD" };
  const match = registry.bindings.find(({ binding }) =>
    binding.status.supersession === "CURRENT" && binding.review.state !== "REJECTED" &&
    identityKey(binding.system.manufacturer) === identityKey(manufacturer) &&
    identityKey(binding.system.indoorModel) === identityKey(indoorModel) &&
    identityKey(binding.system.outdoorModel) === identityKey(outdoorModel));
  if (!match) return { status: "NO_RECORD" };
  const { binding, bindingHash, conflicts } = match;
  if (binding.review.state !== "VERIFIED") return { status: "NOT_VERIFIED", bindingId: binding.bindingId };
  if (conflicts.length > 0) return { status: "CONFLICT", bindingId: binding.bindingId, bindingHash, conflicts };
  const byId = new Map(registry.records.map((entry) => [entry.record.recordId, entry] as const));
  const sources = binding.constituents.map((constituent) => byId.get(constituent.recordId) as { record: OemReferenceRecord; recordHash: string });
  return {
    status: "RESOLVED",
    bindingId: binding.bindingId,
    bindingHash,
    binding,
    sources: sources.map((entry) => entry.record),
    reference: projectBinding(binding, bindingHash, sources),
  };
}

/** Citation carried into every engine reference: document, revision, page and table/chart. */
export function citation(record: OemReferenceRecord, cite: Cite): string {
  const document = [record.document.documentId, record.document.revision ? `rev ${record.document.revision}` : null].filter(Boolean).join(" ");
  return [document, `p. ${cite.pageRef}`, cite.tableOrChart].filter(Boolean).join(" · ");
}

function projectRange(record: OemReferenceRecord, range: CitedRange): OemRange {
  const operands = range.derivation
    ? Object.entries(range.derivation).flatMap(([name, operand]) =>
      operand && typeof operand === "object" && "cite" in operand ? [`${name}: ${citation(record, (operand as CitedValue).cite)}`] : [])
    : [];
  const unboundedRef = range.unbounded ? [`unbounded ${range.unbounded.side}: ${citation(record, range.unbounded.cite)}`] : [];
  return {
    min: range.min,
    max: range.max,
    unit: range.unit,
    ref: [citation(record, range.cite), ...operands, ...unboundedRef].join(" | "),
    ...(range.unbounded ? { unbounded: range.unbounded.side } : {}),
    ...(range.derivation ? { derivation: engineDerivation(range.derivation) } : {}),
  };
}

function projectCondition(record: OemReferenceRecord, condition: RecordCondition): ApplicabilityCondition {
  return {
    measurement: condition.measurement,
    min: condition.min,
    max: condition.max,
    unit: condition.unit,
    ref: [citation(record, condition.cite), ...(condition.unbounded ? [`unbounded ${condition.unbounded.side}: ${citation(record, condition.unbounded.cite)}`] : [])].join(" | "),
    ...(condition.unbounded ? { unbounded: condition.unbounded.side } : {}),
  };
}

function projectCandidate(record: OemReferenceRecord, candidate: RecordCandidate): CriterionCandidate {
  return {
    candidateId: candidate.candidateId,
    range: projectRange(record, candidate.range),
    appliesWhen: candidate.appliesWhen.map((condition) => projectCondition(record, condition)),
    ...(candidate.meteringTypes ? { meteringTypes: candidate.meteringTypes } : {}),
  };
}

/**
 * Projects a VERIFIED, CURRENT, conflict-free binding into the engine contract. Every criterion is
 * taken only from the constituent the binding maps it to; constituents keep separate provenance.
 */
export function projectBinding(
  binding: OemSystemBinding,
  bindingHash: string,
  sources: ReadonlyArray<{ record: OemReferenceRecord; recordHash: string }>,
): OemReference {
  const byId = new Map(sources.map((entry) => [entry.record.recordId, entry.record] as const));
  const from = <K extends CriterionKey>(key: K): [OemReferenceRecord, NonNullable<SourceCriteria[K]>] | null => {
    const id = binding.criterionSources[key];
    const record = id ? byId.get(id) : undefined;
    const value = record?.criteria[key];
    return record && value !== undefined ? [record, value as NonNullable<SourceCriteria[K]>] : null;
  };

  const reference: Record<string, unknown> = {
    documentRefs: sources.map(({ record }) =>
      `${record.sourceClass}: ${record.document.documentId}${record.document.revision ? ` rev ${record.document.revision}` : ""} — ${record.document.title}`),
  };

  const tool = from("specialToolOrModeRequired");
  reference.requiresUnavailableToolOrMode = tool ? tool[1].value : true;

  const method = from("chargingMethod");
  if (method && method[1].status === "IDENTIFIED") {
    const [record, value] = method;
    reference.chargingMethod = {
      status: "IDENTIFIED",
      ref: `${citation(record, value.cite)} · ${value.description}`,
      pressureBased: value.pressureBased,
      ...(value.meteringTypes ? { meteringTypes: value.meteringTypes } : {}),
      ...(value.conditions ? { conditions: value.conditions.map((condition) => projectCondition(record, condition)) } : {}),
      ...(value.postEventVerification ? { postEventVerification: { ref: `${citation(record, value.postEventVerification.cite)} · ${value.postEventVerification.text}` } } : {}),
    };
  } else {
    reference.chargingMethod = { status: "NOT_OBTAINED", obtainable: !(method && method[1].status === "OEM_CONFIRMED_NOT_PUBLISHED") };
  }

  const airflow = from("airflowCriteria");
  if (airflow) {
    const [record, list] = airflow;
    reference.airflowCriteria = list.map((criterion) => criterion.kind === "CFM_RANGE"
      ? { kind: "CFM_RANGE", range: projectRange(record, criterion.range), ...(criterion.meteringTypes ? { meteringTypes: criterion.meteringTypes } : {}) }
      : {
          kind: "TEMPERATURE_DROP", coverage: criterion.coverage,
          candidates: criterion.candidates.map((candidate) => projectCandidate(record, candidate)),
          ...(criterion.meteringTypes ? { meteringTypes: criterion.meteringTypes } : {}),
        });
  }
  const esp = from("espTableDomain");
  if (esp) reference.espTableDomain = projectRange(esp[0], { ...esp[1].range, cite: esp[1].range.cite });
  const fan = from("fanPerformance");
  if (fan) {
    const [record, value] = fan;
    reference.fanPerformance = {
      ref: [citation(record, value.convention.cite), ...value.settings.map((setting) => `${setting.setting}: ${citation(record, setting.cite)}`),
        ...(value.designatedSetting ? [`designated: ${citation(record, value.designatedSetting.cite)}`] : [])].join(" | "),
      convention: value.convention.text,
      designatedSetting: value.designatedSetting?.setting ?? null,
      settings: value.settings.map(({ setting, coolingPermitted, points }) => ({ setting, coolingPermitted, points: points.map(({ esp, cfm }) => ({ esp, cfm })) })),
    };
  }
  const limits = from("staticLimits");
  if (limits) reference.staticLimits = limits[1].map((limit) => ({ component: limit.component, basis: limit.basis, range: projectRange(limits[0], limit.range) }));
  for (const key of ["ambientEnvelope", "voltageRange"] as const) {
    const value = from(key);
    if (value) reference[key] = projectRange(value[0], value[1]);
  }
  const minRun = from("minRunMinutes");
  if (minRun) reference.minRunMinutes = { value: minRun[1].value, ref: citation(minRun[0], minRun[1].cite) };
  const stability = from("stabilityCriterion");
  if (stability) {
    const [record, value] = stability;
    reference.stabilityCriterion = { measurement: value.measurement, maxChange: value.maxChange, unit: value.unit, ref: citation(record, value.cite) };
  }
  const ecm = from("permitsEcmWithTableMethod");
  if (ecm) reference.permitsEcmWithTableMethod = ecm[1].value;

  reference.measurementLocations = Object.fromEntries(Object.entries(binding.criterionSources.measurementLocations ?? {}).flatMap(([key, id]) => {
    const value = byId.get(id as string)?.criteria.measurementLocations?.[key as MeasurementKey];
    return value ? [[key, value.location]] : [];
  }));

  const noninvasive = from("noninvasiveCriterion");
  if (noninvasive && noninvasive[1].status === "PUBLISHED") {
    const [record, value] = noninvasive;
    reference.noninvasiveCriterion = {
      status: "PUBLISHED", derivation: value.derivation, coverage: value.coverage, lookup: value.lookup,
      candidates: value.candidates.map((candidate) => projectCandidate(record, candidate)),
    };
  } else {
    reference.noninvasiveCriterion = {
      status: "NOT_OBTAINED",
      obtainable: binding.noninvasiveCriterionAbsence !== "OEM_CONFIRMED_NOT_PUBLISHED" &&
        !(noninvasive && noninvasive[1].status === "OEM_CONFIRMED_NOT_PUBLISHED"),
    };
  }

  const criterionSources: Record<string, string> = {};
  for (const key of CRITERION_KEYS) if (binding.criterionSources[key]) criterionSources[key] = binding.criterionSources[key] as string;
  for (const [key, id] of Object.entries(binding.criterionSources.measurementLocations ?? {})) criterionSources[`measurementLocations.${key}`] = id as string;

  reference.provenance = {
    acquisitionMethod: "GOVERNED_LIBRARY",
    verification: "VERIFIED",
    manufacturer: binding.system.manufacturer,
    verifiedBy: binding.review.reviewedBy,
    verifiedAt: binding.review.reviewedAt,
    recordId: binding.bindingId,
    recordHash: bindingHash,
    matchedSystems: [{ indoorModel: binding.system.indoorModel, outdoorModel: binding.system.outdoorModel }],
    transcribedBy: binding.curation.transcribedBy,
    transcribedAt: binding.curation.transcribedAt,
    supersession: binding.status.supersession,
    sources: sources.map(({ record, recordHash }) => sourceProvenance(record, recordHash)),
    pairingSources: [...binding.pairingSources],
    criterionSources,
  };
  return reference as unknown as OemReference;
}

function sourceProvenance(record: OemReferenceRecord, recordHash: string): OemSourceProvenance {
  return JSON.parse(JSON.stringify({
    recordId: record.recordId,
    recordHash,
    sourceClass: record.sourceClass,
    documentId: record.document.documentId,
    revision: record.document.revision ?? undefined,
    documentDate: record.document.date ?? undefined,
    documentHash: record.document.sha256,
    sourceRef: record.acquisition.sourceRef,
    transcribedBy: record.curation.transcribedBy,
    transcribedAt: record.curation.transcribedAt,
    verification: record.review.state === "VERIFIED" ? "VERIFIED" : "NOT_VERIFIED",
    verifiedBy: record.review.reviewedBy ?? undefined,
    verifiedAt: record.review.reviewedAt ?? undefined,
    supersession: record.status.supersession,
    // A10: AHRI present status is carried so a historical listing is never read as current certification.
    ahriPresentStatus: record.ahriListing?.presentStatus,
    ahriCertifiedAtObservation: record.ahriListing?.certifiedAtObservation,
    ahriStatusObservedAt: record.ahriListing?.presentStatusObservedAt,
  })) as OemSourceProvenance;
}
