import Ajv, { type JSONSchemaType } from "ajv";

const ajv = new Ajv({ allErrors: true, removeAdditional: false });

export interface CreateRouteRequest {
  organizationName: string;
  systemName: string;
  actorId: string;
  supplierId: string;
  invoiceId: string;
  beneficiaryId: string;
  amountUsd: number;
}

const createSchema: JSONSchemaType<CreateRouteRequest> = {
  type: "object",
  additionalProperties: false,
  required: ["organizationName", "systemName", "actorId", "supplierId", "invoiceId", "beneficiaryId", "amountUsd"],
  properties: {
    organizationName: { type: "string", minLength: 1, maxLength: 200 },
    systemName: { type: "string", minLength: 1, maxLength: 200 },
    actorId: { type: "string", minLength: 1, maxLength: 120 },
    supplierId: { type: "string", minLength: 1, maxLength: 120 },
    invoiceId: { type: "string", minLength: 1, maxLength: 120 },
    beneficiaryId: { type: "string", minLength: 1, maxLength: 120 },
    amountUsd: { type: "number", exclusiveMinimum: 0, maximum: 1_000_000_000 },
  },
};

export interface CorrectRouteRequest {
  expectedVersion: number;
  procurementAuthority: { authorityId: string; issuer: string; effectiveAt: string; expiresAt: string };
  financeAuthority: { authorityId: string; issuer: string; effectiveAt: string; expiresAt: string };
  beneficiaryEvidence: { evidenceId: string; source: string; hash: string };
}

const text = { type: "string", minLength: 1, maxLength: 200 } as const;
const timestamp = { type: "string", minLength: 20, maxLength: 40 } as const;
const authoritySchema = {
  type: "object",
  additionalProperties: false,
  required: ["authorityId", "issuer", "effectiveAt", "expiresAt"],
  properties: { authorityId: text, issuer: text, effectiveAt: timestamp, expiresAt: timestamp },
} as const;

const correctionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["expectedVersion", "procurementAuthority", "financeAuthority", "beneficiaryEvidence"],
  properties: {
    expectedVersion: { type: "integer", minimum: 1 },
    procurementAuthority: authoritySchema,
    financeAuthority: authoritySchema,
    beneficiaryEvidence: {
      type: "object",
      additionalProperties: false,
      required: ["evidenceId", "source", "hash"],
      properties: {
        evidenceId: { type: "string", minLength: 1, maxLength: 120 },
        source: { type: "string", minLength: 1, maxLength: 240 },
        hash: { type: "string", pattern: "^[a-fA-F0-9]{64}$" },
      },
    },
  },
} as const;

const validateCreate = ajv.compile(createSchema);
const validateCorrection = ajv.compile<CorrectRouteRequest>(correctionSchema);
const errorText = (errors: unknown) =>
  ((errors as Array<{ instancePath?: string; message?: string }> | null) ?? [])
    .map((e) => `${e.instancePath || "request"} ${e.message}`)
    .join("; ");

export function parseCreateRoute(body: unknown): CreateRouteRequest {
  if (!validateCreate(body)) throw new Error(`VALIDATION_ERROR: ${errorText(validateCreate.errors)}`);
  return body;
}

export function parseCorrection(body: unknown): CorrectRouteRequest {
  if (!validateCorrection(body)) throw new Error(`VALIDATION_ERROR: ${errorText(validateCorrection.errors)}`);
  return body;
}
