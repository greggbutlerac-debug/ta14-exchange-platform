export type VectTargetBinding = {
  protocol: "TCP";
  dst_ip: string;
  dst_port: number;
  payload_binding_hash: string;
};

export type VectTemporalAuthority = {
  clock_source: "CLOCK_REALTIME";
  epoch_ts_micros: number;
  valid_for_micros: number;
  max_skew_tolerance_micros: 5000;
};

export type VectIdempotencyConstraints = {
  nonce: string;
  max_allowed_retransmissions: 3;
  single_session_only: true;
};

export type VelosExecutionCapabilityToken = {
  assertion_id: string;
  capability_token_fingerprint: string;
  target_binding: VectTargetBinding;
  temporal_authority: VectTemporalAuthority;
  idempotency_constraints: VectIdempotencyConstraints;
};

export type CreateVectInput = {
  assertionId: string;
  capabilityTokenFingerprint: string;
  dstIp: string;
  dstPort: number;
  payloadBindingHash: string;
  epochTsMicros: number;
  validForMicros: number;
  nonce: string;
};

const HEX64 = /^[0-9a-fA-F]{64}$/;

function assertNonEmpty(value: string, field: string) {
  if (!value.trim()) throw new Error(`VECT_INVALID_${field.toUpperCase()}`);
}

function assertHex64(value: string, field: string) {
  if (!HEX64.test(value)) throw new Error(`VECT_INVALID_${field.toUpperCase()}`);
}

function assertUint(value: number, field: string, max = Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(value) || value < 0 || value > max) {
    throw new Error(`VECT_INVALID_${field.toUpperCase()}`);
  }
}

export function createVect(input: CreateVectInput): VelosExecutionCapabilityToken {
  assertNonEmpty(input.assertionId, "assertion_id");
  assertHex64(input.capabilityTokenFingerprint, "capability_token_fingerprint");
  assertNonEmpty(input.dstIp, "dst_ip");
  assertUint(input.dstPort, "dst_port", 65535);
  if (input.dstPort === 0) throw new Error("VECT_INVALID_DST_PORT");
  assertHex64(input.payloadBindingHash, "payload_binding_hash");
  assertUint(input.epochTsMicros, "epoch_ts_micros");
  assertUint(input.validForMicros, "valid_for_micros");
  if (input.validForMicros === 0) throw new Error("VECT_INVALID_VALID_FOR_MICROS");
  assertHex64(input.nonce, "nonce");

  return {
    assertion_id: input.assertionId,
    capability_token_fingerprint: input.capabilityTokenFingerprint.toLowerCase(),
    target_binding: {
      protocol: "TCP",
      dst_ip: input.dstIp,
      dst_port: input.dstPort,
      payload_binding_hash: input.payloadBindingHash.toLowerCase(),
    },
    temporal_authority: {
      clock_source: "CLOCK_REALTIME",
      epoch_ts_micros: input.epochTsMicros,
      valid_for_micros: input.validForMicros,
      max_skew_tolerance_micros: 5000,
    },
    idempotency_constraints: {
      nonce: input.nonce.toLowerCase(),
      max_allowed_retransmissions: 3,
      single_session_only: true,
    },
  };
}

function canonicalizeValue(value: unknown): string {
  if (value === null || typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalizeValue).join(",")}]`;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalizeValue(record[key])}`).join(",")}}`;
  }
  throw new Error("VECT_UNSUPPORTED_CANONICAL_VALUE");
}

/**
 * Canonical JSON serialization for the bounded R1 VECT object.
 * The object contains only JSON primitives and nested objects; keys are sorted
 * lexicographically and values use ECMAScript JSON serialization semantics.
 */
export function canonicalizeVect(vect: VelosExecutionCapabilityToken): string {
  return canonicalizeValue(vect);
}

export function validateVect(vect: VelosExecutionCapabilityToken): string[] {
  const reasons: string[] = [];
  try {
    createVect({
      assertionId: vect.assertion_id,
      capabilityTokenFingerprint: vect.capability_token_fingerprint,
      dstIp: vect.target_binding.dst_ip,
      dstPort: vect.target_binding.dst_port,
      payloadBindingHash: vect.target_binding.payload_binding_hash,
      epochTsMicros: vect.temporal_authority.epoch_ts_micros,
      validForMicros: vect.temporal_authority.valid_for_micros,
      nonce: vect.idempotency_constraints.nonce,
    });
  } catch (error) {
    reasons.push(error instanceof Error ? error.message : "VECT_INVALID");
  }

  if (vect.target_binding.protocol !== "TCP") reasons.push("VECT_INVALID_PROTOCOL");
  if (vect.temporal_authority.clock_source !== "CLOCK_REALTIME") reasons.push("VECT_INVALID_CLOCK_SOURCE");
  if (vect.temporal_authority.max_skew_tolerance_micros !== 5000) reasons.push("VECT_INVALID_MAX_SKEW");
  if (vect.idempotency_constraints.max_allowed_retransmissions !== 3) reasons.push("VECT_INVALID_RETRANSMISSION_LIMIT");
  if (vect.idempotency_constraints.single_session_only !== true) reasons.push("VECT_INVALID_SESSION_CONSTRAINT");

  return [...new Set(reasons)];
}
