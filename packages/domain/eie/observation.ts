/**
 * s04 Environmental Integrity Node observation contract.
 *
 * Validation rejects; it never repairs, defaults, converts or derives. A rejected
 * observation is returned with its reason codes and is never admitted as evidence.
 */
import Ajv2020 from "ajv/dist/2020";
import schema from "../../../schemas/eie-node-observation.schema.json";
import { objectHash } from "./chain";
import { EIE_REASON } from "./reason-codes";
import { parseInstant } from "./time";
import { CHANNELS, type NodeObservation, type RecorderMode } from "./types";

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validateSchema = ajv.compile(schema);

const KNOWN_FIELDS = new Set(schema.required);

export type ObservationValidation =
  | { ok: true; observation: NodeObservation; observationHash: string; reasonCodes: [] }
  | { ok: false; reasonCodes: string[] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const nonEmpty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

export function validateObservation(input: unknown, mode: RecorderMode): ObservationValidation {
  const codes = new Set<string>();
  if (!isRecord(input)) return { ok: false, reasonCodes: [EIE_REASON.FIELD_MISSING] };

  for (const field of KNOWN_FIELDS) if (!(field in input) || input[field] === undefined) codes.add(EIE_REASON.FIELD_MISSING);
  for (const field of Object.keys(input)) if (!KNOWN_FIELDS.has(field)) codes.add(EIE_REASON.FIELD_UNRECOGNIZED);

  if (!nonEmpty(input.observationId)) codes.add(EIE_REASON.FIELD_MISSING);
  if ("channel" in input && !(CHANNELS as readonly unknown[]).includes(input.channel)) codes.add(EIE_REASON.CHANNEL_UNKNOWN);

  const source = input.source;
  if (!isRecord(source) || !nonEmpty(source.provider) || !nonEmpty(source.deviceId)) codes.add(EIE_REASON.SOURCE_UNIDENTIFIED);

  if (!nonEmpty(input.unit)) codes.add(EIE_REASON.UNIT_UNDECLARED);
  if (typeof input.value !== "number" || !Number.isFinite(input.value)) codes.add(EIE_REASON.VALUE_INVALID);
  if (!Number.isSafeInteger(input.sequence) || (input.sequence as number) < 0) codes.add(EIE_REASON.VALUE_INVALID);

  const observedAt = parseInstant(input.observedAt);
  const receivedAt = parseInstant(input.receivedAt);
  if (observedAt === null || receivedAt === null) codes.add(EIE_REASON.TIME_UNPARSEABLE);

  const instrument = input.instrument;
  if (!isRecord(instrument) || !nonEmpty(instrument.id) || !nonEmpty(instrument.calibrationOrFitnessRef)) {
    codes.add(EIE_REASON.INSTRUMENT_UNFIT);
  } else {
    const fitUntil = parseInstant(instrument.fitUntil);
    if (fitUntil === null || (observedAt !== null && observedAt > fitUntil)) codes.add(EIE_REASON.INSTRUMENT_UNFIT);
  }

  const location = input.location;
  const basis = isRecord(location) ? location.basis : undefined;
  if (!isRecord(location) || !nonEmpty(location.physical) || !isRecord(basis) || !nonEmpty(basis.ref)) {
    codes.add(EIE_REASON.LOCATION_BASIS_MISSING);
  } else if (input.channel === "AIRFLOW" && basis.kind !== "GOVERNED_METHOD") {
    // s04: "airflow (governed method)".
    codes.add(EIE_REASON.LOCATION_BASIS_MISSING);
  }

  if (mode === "PRODUCTION" && input.acquisitionMethod === "SIMULATED") codes.add(EIE_REASON.SIMULATED_IN_PRODUCTION);

  // Structural backstop: anything the schema rejects that the specific checks did not name.
  if (!validateSchema(input) && codes.size === 0) codes.add(EIE_REASON.VALUE_INVALID);

  if (codes.size > 0) return { ok: false, reasonCodes: [...codes].sort() };
  const observation = structuredClone(input) as unknown as NodeObservation;
  return { ok: true, observation, observationHash: objectHash(observation), reasonCodes: [] };
}
