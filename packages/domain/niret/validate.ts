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
    for (const key of ["airflowRange", "espRange", "ambientEnvelope", "voltageRange"]) {
      const range = input.oem[key] as { min: number; max: number } | undefined;
      if (range && range.min > range.max) invalidFields.push(`/oem/${key}: min exceeds max`);
    }
    type Bounds = { min: number; max: number };
    const criterion = input.oem.noninvasiveCriterion as { status: string; candidates?: Array<{ range: Bounds; appliesWhen: Bounds[] }> };
    (criterion.candidates ?? []).forEach((candidate, index) => {
      if (candidate.range.min > candidate.range.max) invalidFields.push(`/oem/noninvasiveCriterion/candidates/${index}/range: min exceeds max`);
      candidate.appliesWhen.forEach((condition, at) => {
        if (condition.min > condition.max) invalidFields.push(`/oem/noninvasiveCriterion/candidates/${index}/appliesWhen/${at}: min exceeds max`);
      });
    });
  }

  return {
    valid: unknownFields.length === 0 && invalidFields.length === 0,
    unknownFields: [...new Set(unknownFields)].sort(),
    invalidFields: [...new Set(invalidFields)].sort(),
    prematureEntry: [...new Set(prematureEntry)].sort(),
  };
}
