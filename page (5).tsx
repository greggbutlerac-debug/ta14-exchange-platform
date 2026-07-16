import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { generateDevelopmentSigningKey } from "../../packages/crypto/receipts";
import { evaluateVendorPaymentRoute, type VendorPaymentRouteInput } from "../../packages/testing/payment-route-tests";
import { appendRouteVersion, createRouteVersion, getRoute, verifyEventChain } from "../../packages/storage/local-store";

let directory = "";
const baseInput = (version: number): VendorPaymentRouteInput => ({
  routeId: "TA14-RID-STORAGE",
  routeVersion: version,
  organizationId: "TA14-ORG-STORAGE",
  systemId: "TA14-SYS-STORAGE",
  actorId: "actor-1",
  policyVersion: "PROC-PAY-2026.1",
  amountUsd: 30000,
  supplierId: "supplier-1",
  invoiceId: "invoice-1",
  beneficiaryId: "beneficiary-1",
  beneficiaryVerified: false,
  committedPaymentHash: "a".repeat(64),
  executionPaymentHash: "a".repeat(64),
  duplicatePaymentDetected: false,
  bypassSucceeded: false,
  replayAuthorizationUsed: false,
  outcomeAttributionResolved: true,
  authorities: [],
  evidenceBindings: [],
  evaluatedAt: "2026-07-16T12:00:00.000Z",
});

beforeEach(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "ta14-store-"));
  process.env.TA14_DATA_DIR = directory;
});

afterEach(async () => {
  delete process.env.TA14_DATA_DIR;
  await rm(directory, { recursive: true, force: true });
});

describe("append-only local continuity store", () => {
  it("preserves prior route versions and chains events", async () => {
    const key = generateDevelopmentSigningKey();
    const input1 = baseInput(1);
    const receipt1 = evaluateVendorPaymentRoute(input1, key);
    await createRouteVersion(
      { rid: input1.routeId, organizationName: "Org", systemName: "System", version: 1, input: input1, receipt: receipt1, createdAt: input1.evaluatedAt },
      { eventId: "event-1", rid: input1.routeId, type: "ROUTE_CREATED", at: input1.evaluatedAt, version: 1 },
    );

    const input2 = { ...input1, routeVersion: 2, evaluatedAt: "2026-07-16T12:05:00.000Z" };
    const receipt2 = evaluateVendorPaymentRoute(input2, key);
    await appendRouteVersion(
      { rid: input2.routeId, organizationName: "Org", systemName: "System", version: 2, input: input2, receipt: receipt2, createdAt: input2.evaluatedAt },
      1,
      { eventId: "event-2", rid: input2.routeId, type: "ROUTE_CORRECTED", at: input2.evaluatedAt, version: 2 },
    );

    const state = await getRoute(input1.routeId);
    expect(state?.versions.map((item) => item.version)).toEqual([1, 2]);
    expect(state?.events).toHaveLength(2);
    expect(state?.eventChainValid).toBe(true);
    expect(verifyEventChain(state!.events)).toBe(true);
  });

  it("rejects optimistic-version conflicts without losing history", async () => {
    const key = generateDevelopmentSigningKey();
    const input = baseInput(1);
    const receipt = evaluateVendorPaymentRoute(input, key);
    await createRouteVersion(
      { rid: input.routeId, organizationName: "Org", systemName: "System", version: 1, input, receipt, createdAt: input.evaluatedAt },
      { eventId: "event-1", rid: input.routeId, type: "ROUTE_CREATED", at: input.evaluatedAt, version: 1 },
    );
    const input2 = { ...input, routeVersion: 2, evaluatedAt: "2026-07-16T12:05:00.000Z" };
    const receipt2 = evaluateVendorPaymentRoute(input2, key);
    await expect(appendRouteVersion(
      { rid: input2.routeId, organizationName: "Org", systemName: "System", version: 2, input: input2, receipt: receipt2, createdAt: input2.evaluatedAt },
      9,
      { eventId: "event-2", rid: input2.routeId, type: "ROUTE_CORRECTED", at: input2.evaluatedAt, version: 2 },
    )).rejects.toThrow("VERSION_CONFLICT");
    expect((await getRoute(input.routeId))?.versions).toHaveLength(1);
  });

  it("writes the local store with restricted file permissions", async () => {
    const key = generateDevelopmentSigningKey();
    const input = baseInput(1);
    const receipt = evaluateVendorPaymentRoute(input, key);
    await createRouteVersion(
      { rid: input.routeId, organizationName: "Org", systemName: "System", version: 1, input, receipt, createdAt: input.evaluatedAt },
      { eventId: "event-1", rid: input.routeId, type: "ROUTE_CREATED", at: input.evaluatedAt, version: 1 },
    );
    const contents = JSON.parse(await readFile(path.join(directory, "local-store.json"), "utf8"));
    expect(contents.routeVersions).toHaveLength(1);
    expect(contents.events[0].eventHash).toMatch(/^[a-f0-9]{64}$/);
  });
});
