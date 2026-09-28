import { createHash } from "node:crypto";
import { canonicalJson } from "../canonical-json";
import { sha256Canonical } from "../../crypto/receipts";

/** s03: entryHash = SHA-256(prevEntryHash || canonical(entry)), where entry excludes its own entryHash. */
export function computeEntryHash(prevEntryHash: string, entryWithoutHash: unknown): string {
  return createHash("sha256").update(prevEntryHash + canonicalJson(entryWithoutHash)).digest("hex");
}

/** s18: SHA-256 over canonical JSON for every object. */
export const objectHash = sha256Canonical;

export function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const item of Object.values(value as Record<string, unknown>)) deepFreeze(item);
  }
  return value;
}

/** Detached, frozen copy: callers can read preserved history but never hold a mutable reference to it. */
export function frozenCopy<T>(value: T): T {
  return deepFreeze(structuredClone(value));
}
