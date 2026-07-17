import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { evaluateVendorPaymentRoute } from "../../../../../../../packages/testing/payment-route-tests";
import {
  appendRouteVersion,
  getRoute,
  signingKey,
} from "../../../../../../../packages/storage/local-store";
import { parseCorrection } from "../../../../../lib/route-requests";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ rid: string }> },
) {
  const correlationId = randomUUID();

  try {
    const { rid } = await params;
    const body = parseCorrection(await req.json());

    const state = await getRoute(rid);

    if (!state) {
      throw new Error("Route not found");
    }

    const currentRoute = state.latest;

    if (currentRoute.version !== body.expectedVersion) {
      throw new Error(
        `VERSION_CONFLICT: expected ${body.expectedVersion}, current ${currentRoute.version}.`,
      );
    }

    const now = new Date().toISOString();

    const createAuthority = (
      authority: typeof body.procurementAuthority,
      role: "procurement" | "finance",
    ) => ({
      authorityId: authority.authorityId.trim(),
      role,
      actorId: currentRoute.input.actorId,
      active: true,
      effectiveAt: authority.effectiveAt,
      expiresAt: authority.expiresAt,
      boundPaymentHash: currentRoute.input.committedPaymentHash!,
      scopeOrganizationId: currentRoute.input.organizationId,
      scopeSystemId: currentRoute.input.systemId,
    });

    const input = {
      ...currentRoute.input,
      routeVersion: currentRoute.version + 1,
      beneficiaryVerified: true,
      authorities: [
        createAuthority(
          body.procurementAuthority,
          "procurement",
        ),
        createAuthority(body.financeAuthority, "finance"),
      ],
      evidenceBindings: [
        ...(currentRoute.input.evidenceBindings ?? []),
        {
          evidenceId: body.beneficiaryEvidence.evidenceId.trim(),
          claim: "beneficiary" as const,
          hash: body.beneficiaryEvidence.hash.toLowerCase(),
          observedAt: now,
        },
      ],
      evaluatedAt: now,
    };

    const key = await signingKey();
    const receipt = evaluateVendorPaymentRoute(input, key);

    const correctedRoute = {
      ...currentRoute,
      version: input.routeVersion,
      input,
      receipt,
      createdAt: now,
    };

    await appendRouteVersion(
      correctedRoute,
      body.expectedVersion,
      {
        eventId: randomUUID(),
        rid,
        type: "ROUTE_CORRECTED",
        at: now,
        version: correctedRoute.version,
        details: {
          decision: receipt.decision,
          authorityIssuers: [
            body.procurementAuthority.issuer,
            body.financeAuthority.issuer,
          ],
          beneficiaryEvidenceSource:
            body.beneficiaryEvidence.source,
          previousVersion: body.expectedVersion,
        },
      },
    );

    return NextResponse.json({
      ...correctedRoute,
      decision: receipt.decision,
      correlationId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: message,
        correlationId,
      },
      {
        status: message.startsWith("VERSION_CONFLICT")
          ? 409
          : 400,
      },
    );
  }
}
