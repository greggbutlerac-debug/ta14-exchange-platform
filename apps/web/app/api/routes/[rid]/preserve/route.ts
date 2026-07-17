import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { generateAer } from "../../../../../../../packages/aer/generate-aer";
import {
  getRoute,
  issueRegistry,
  signingKey,
} from "../../../../../../../packages/storage/local-store";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ rid: string }> },
) {
  const correlationId = randomUUID();

  try {
    const { rid } = await params;
    const state = await getRoute(rid);

    if (!state) {
      throw new Error("Route not found");
    }

    const route = state.latest;

    if (route.receipt.decision !== "ALLOW") {
      throw new Error(
        "Only an ALLOW route may be preserved in this demonstration.",
      );
    }

    if (!state.eventChainValid) {
      throw new Error(
        "Route event chain failed integrity verification.",
      );
    }

    const key = await signingKey();
    const issuedAt = new Date().toISOString();

    const history = state.events.map((event) => ({
      event: event.type,
      at: event.at,
      version: event.version,
      eventHash: event.eventHash,
      prevEventHash: event.prevEventHash,
    }));

    const evidenceIndex = (
      route.input.evidenceBindings ?? []
    ).map((evidence) => {
      const isFixture =
        evidence.evidenceId.startsWith("FIXTURE-");

      const source = isFixture
        ? "demonstration fixture"
        : "user supplied/reference";

      return {
        evidenceId: evidence.evidenceId,
        hash: evidence.hash,
        source,
        claim: evidence.claim,
        evidenceProvenance: {
          capturedBy: isFixture
            ? "TA-14 Exchange demonstration runtime"
            : route.input.actorId,
          capturedAt: evidence.observedAt,
          captureMethod: isFixture
            ? ("DERIVED" as const)
            : ("USER_ENTRY" as const),
          origin: source,
        },
      };
    });

    const aer = generateAer(
      {
        rid: route.rid,
        routeVersion: route.version,
        organizationId: route.input.organizationId,
        systemId: route.input.systemId,
        purpose:
          "Approve and execute supplier payments under enterprise policy.",
        scope: "Vendor payment above USD 25,000.",
        limitations: [
          "Self-declared local demonstration",
          "Fixture evidence is used for bypass, replay, duplicate, execution, and outcome tests",
          "No independent TA-14 verification",
          "No legal or certification opinion",
        ],
        boundary: "SELF_DECLARED",
        authorityBasis: route.input.authorities.map(
          (authority) => authority.authorityId,
        ),
        policyVersion: route.input.policyVersion,
        testReceipt: route.receipt,
        evidenceIndex,
        history,
        verificationInstructions:
          "Download the verification bundle and verify the AER manifest hash and Ed25519 signature using the included development public key.",
      },
      key,
      issuedAt,
    );

    const registry = {
      status: "SELF_DECLARED" as const,
      issuedAt,
      limitations: aer.limitations,
      aer,
    };

    await issueRegistry(rid, registry, {
      eventId: randomUUID(),
      rid,
      type: "AER_ISSUED",
      at: issuedAt,
      version: route.version,
      details: {
        aerId: aer.aerId,
        manifestHash: aer.manifestHash,
      },
    });

    return NextResponse.json({
      ...route,
      aer,
      registry: {
        status: registry.status,
        issuedAt,
        limitations: registry.limitations,
      },
      decision: route.receipt.decision,
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
