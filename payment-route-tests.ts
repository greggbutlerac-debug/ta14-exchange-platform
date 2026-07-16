export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

function normalize(value: unknown): JsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value as JsonPrimitive;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("Canonical JSON does not permit NaN or Infinity.");
    return Object.is(value, -0) ? 0 : value;
  }
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) throw new TypeError("Invalid Date cannot be canonicalized.");
    return value.toISOString();
  }
  if (Array.isArray(value)) return value.map(normalize);
  if (typeof value === "object") {
    const input = value as Record<string, unknown>;
    const out: Record<string, JsonValue> = {};
    for (const key of Object.keys(input).sort()) {
      const item = input[key];
      if (item === undefined || typeof item === "function" || typeof item === "symbol") continue;
      out[key] = normalize(item);
    }
    return out;
  }
  throw new TypeError(`Unsupported canonical JSON type: ${typeof value}`);
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(normalize(value));
}
