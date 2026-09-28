/**
 * Pipeline stage: VALIDATION.
 *
 * Structural validation against the frozen input contract, plus the
 * Amendment A1 premature-entry scan. Unknown fields fail closed (HOLD);
 * refrigerant-side pressure evidence or a declared entry is premature
 * pressure-instrument entry (DENY), never merely an unknown field.
 */

import Ajv2020 from "ajv/dist/2020";
import schema from "../../../schemas/niret-evidence-record.schema.json";
import { PRESSURE_EVIDENCE_KEYS } from "./propositions";
import { resolveRange } from "./range";
import type { OemRange } from "./types";

type RangeAt = [string, Pick<OemRange, "min" | "max" | "unbounded" | "derivation">];

/** Every OEM range in the input, with its path (A8). */
function oemRanges(oem: Record<string, unknown>): RangeAt[] {
  const found: RangeAt[] = [];
  const add = (path: string, value: unknown) => { if (value && typeof value === "object") found.push([path, value as RangeAt[1]]); };
  for (const key of ["ambientEnvelope", "voltageRange", "espTableDomain"]) add(`/oem/${key}`, oem[key]);
  (oem.staticLimits as Array<{ range: unknown }> | undefined ?? []).forEach((limit, i) => add(`/oem/staticLimits/${i}/range`, limit.range));
  const candidates = (path: string, list: Array<{ range: unknown; appliesWhen: unknown[] }> | undefined) => (list ?? []).forEach((candidate, i) => {
    add(`${path}/${i}/range`, candidate.range);
    candidate.appliesWhen.forEach((condition, j) => add(`${path}/${i}/appliesWhen/${j}`, condition));
  });
  (oem.airflowCriteria as Array<{ kind: string; range?: unknown; candidates?: Array<{ range: unknown; appliesWhen: unknown[] }> }> | undefined ?? [])
    .forEach((criterion, i) => {
      if (criterion.kind === "CFM_RANGE") add(`/oem/airflowCriteria/${i}/range`, criterion.range);
      else candidates(`/oem/airflowCriteria/${i}/candidates`, criterion.candidates);
    });
  const criterion = oem.noninvasiveCriterion as { candidates?: Array<{ range: unknown; appliesWhen: unknown[] }> } | undefined;
  candidates("/oem/noninvasiveCriterion/candidates", criterion?.candidates);
  const method = oem.chargingMethod as { conditions?: unknown[] } | undefined;
  (method?.conditions ?? []).forEach((condition, i) => add(`/oem/chargingMethod/conditions/${i}`, condition));
  return found;
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validateSchema = ajv.compile(schema);

export interface ValidationOutcome {
  valid: boolean;
  unknownFields: string[];
  invalidFields: string[];
  prematureEntry: string[];
}

const PRESSURE_KEYS = new Set<string>(PRESSURE_EVIDENCE_KEYS);

function scanForPressureEvidence(value: unknown, path: string, found: string[]): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForPressureEvidence(item, `${path}/${index}`, found));
    return;
  }
  if (value === null || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (PRESSURE_KEYS.has(key)) found.push(`${path}/${key}`);
    scanForPressureEvidence(child, `${path}/${key}`, found);
  }
}

function collectTimestamps(value: unknown, found: string[]): void {
  if (Array.isArray(value)) {
    value.forEach((item) => collectTimestamps(item, found));
    return;
  }
  if (value === null || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (typeof child === "string" && (key.endsWith("At") || key === "at")) found.push(child);
    else collectTimestamps(child, found);
  }
}

export function validateGateAInput(raw: unknown): ValidationOutcome {
  const prematureEntry: string[] = [];
  scanForPressureEvidence(raw, "", prematureEntry);
  const entry = (raw as { evidence?: { pressureSideEntry?: unknown } } | null)?.evidence?.pressureSideEntry;
  if (typeof entry === "string" && entry !== "NOT_PERFORMED") prematureEntry.push(`/evidence/pressureSideEntry=${entry}`);

  const unknownFields: string[] = [];
  const invalidFields: string[] = [];
  if (!validateSchema(raw)) {
    for (const error of validateSchema.errors ?? []) {
      if (error.keyword === "additionalProperties") {
        unknownFields.push(`${error.instancePath}/${String((error.params as { additionalProperty: string }).additionalProperty)}`);
      } else {
        invalidFields.push(`${error.instancePath || "/"}: ${error.message ?? error.keyword}`);
      }
    }
  } else {
    const input = raw as { request: { evaluatedAt: string }; oem: Record<string, unknown> };
    const evaluatedAt = Date.parse(input.request.evaluatedAt);
    const stamps: string[] = [];
    collectTimestamps(raw, stamps);
    for (const stamp of stamps) {
      const at = Date.parse(stamp);
      if (Number.isNaN(at)) invalidFields.push(`timestamp not parseable: ${stamp}`);
      else if (at > evaluatedAt) invalidFields.push(`timestamp after evaluatedAt: ${stamp}`);
    }
    // Amendment A8: every OEM range must resolve (stated, OEM-stated unbounded side, or OEM-stated derivation).
    for (const [path, range] of oemRanges(input.oem)) {
      if (!resolveRange(range)) invalidFields.push(`${path}: range bounds invalid (min exceeds max, unstated unbounded side, or invalid derivation)`);
    }
    // Amendment A9: fan-performance points must be distinct published ESP values per setting.
    const fan = input.oem.fanPerformance as { settings: Array<{ points: Array<{ esp: number }> }> } | undefined;
    (fan?.settings ?? []).forEach((setting, i) => {
      if (new Set(setting.points.map((point) => point.esp)).size !== setting.points.length) {
        invalidFields.push(`/oem/fanPerformance/settings/${i}/points: duplicate ESP`);
      }
    });
  }

  return {
    valid: unknownFields.length === 0 && invalidFields.length === 0,
    unknownFields: [...new Set(unknownFields)].sort(),
    invalidFields: [...new Set(invalidFields)].sort(),
    prematureEntry: [...new Set(prematureEntry)].sort(),
  };
}
