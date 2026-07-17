import { NextResponse } from "next/server";
import { randomUUID, createHash } from "node:crypto";

import {
  evaluateVendorPaymentRoute,
  type VendorPaymentRouteInput,
} from "../../../../../packages/testing/payment-route-tests";
import {
  createRouteVersion,
  signingKey,
} from "../../../../../packages/storage/local-store";
import { createPaymentCommit } from "../../../../../packages/domain/payment-commit";
import { parseCreateRoute } from "../../../lib/route-requests";

const createHashValue = (value: string): string =>
  createHash("sha256").update(value.trim()).digest("hex");

export async function POST(req: Request) {
  const correlationId = randomUUID();

  try {
    const body = parseCreateRoute(await req.json());

    const rid = `TA14-RID-${randomUUID().slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();
    const policyVersion = "PROC-PAY-2026.1";

    const { hash: committedPaymentHash } = createPaymentCommit({
      ...body,
      policyVersion,
    });

    const input: VendorPaymentRouteInput = {
      routeId: rid,
      routeVersion: 1,
      organizationId: `TA14-ORG-${randomUUID()
        .slice(0, 6)
        .toUpperCase()}`,
      systemId: `TA14-SYS-${randomUUID().slice(0, 6).toUpperCase()}`,
      actorId: body.actorId.trim(),
      policyVersion,
      amountUsd: body.amountUsd,
      supplierId: body.supplierId.trim(),
      invoiceId: body.invoiceId.trim(),
      beneficiaryId: body.beneficiaryId.trim(),
      beneficiaryVerified: false,
      committedPaymentHash,
      executionPaymentHash: committedPaymentHash,
      duplicatePaymentDetected: false,
      bypassSucceeded: false,
      replayAuthorizationUsed: false,
      outcomeAttributionResolved: true,
      authorities: [],
      evidenceBindings: [
        {
          evidenceId: "EID-SUPPLIER",
          claim: "supplier",
          hash: createHashValue(body.supplierId),
          observedAt: now,
        },
        {
          evidenceId: "EID-INVOICE",
          claim: "invoice",
          hash: createHashValue(body.invoiceId),
          observedAt: now,
        },
        {
          evidenceId: "FIXTURE-BYPASS",
          claim: "bypass_test",
          hash: createHashValue("DEMONSTRATION_FIXTURE:no-bypass"),
          observedAt: now,
        },
        {
          evidenceId: "FIXTURE-REPLAY",
          claim: "replay_test",
          hash: createHashValue("DEMONSTRATION_FIXTURE:no-replay"),
          observedAt: now,
        },
        {
          evidenceId: "FIXTURE-DUP",
          claim: "duplicate_test",
          hash: createHashValue("DEMONSTRATION_FIXTURE:no-duplicate"),
          observedAt: now,
        },
        {
          evidenceId: "FIXTURE-EXEC",
          claim: "execution",
          hash: committedPaymentHash,
          observedAt: now,
        },
        {
          evidenceId: "FIXTURE-OUT",
          claim: "outcome",
          hash: createHashValue(
            "DEMONSTRATION_FIXTURE:outcome-resolved",
          ),
          observedAt: now,
        },
      ],
      evaluatedAt: now,
    };

    const key = await signingKey();
    const receipt = evaluateVendorPaymentRoute(input, key);

    const route = {
      rid,
      organizationName: body.organizationName.trim(),
      systemName: body.systemName.trim(),
      version: 1,
      input,
      receipt,
      createdAt: now,
    };

    await createRouteVersion(route, {
      eventId: randomUUID(),
      rid,
      type: "ROUTE_CREATED",
      at: now,
      version: 1,
      details: {
        decision: receipt.decision,
        fixtureEvidence: true,
      },
    });

    return NextResponse.json({
      ...route,
      decision: receipt.decision,
      correlationId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error",
        correlationId,
      },
      { status: 400 },
    );
  }
}
