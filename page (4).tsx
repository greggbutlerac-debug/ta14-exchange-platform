import { describe, expect, it } from "vitest";
import { canonicalJson } from "../../packages/domain/canonical-json.js";
import { sha256Canonical } from "../../packages/crypto/receipts.js";

describe("canonical JSON", () => {
  it("is stable across object key order", () => {
    expect(canonicalJson({ b: 2, a: 1 })).toBe(canonicalJson({ a: 1, b: 2 }));
    expect(sha256Canonical({ b: 2, a: 1 })).toBe(sha256Canonical({ a: 1, b: 2 }));
  });
  it("rejects non-finite numbers", () => expect(() => canonicalJson({ x: Number.NaN })).toThrow());
});
