import { NextResponse } from "next/server";

import { getRoute } from "../../../../lib/local-store";

type RouteContext = {
  params: Promise<{
    rid: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { rid: rawRid } = await context.params;
    const rid = decodeURIComponent(rawRid).trim().toUpperCase();

    if (!rid) {
      return NextResponse.json(
        {
          error: "A route identity is required.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const route = await getRoute(rid);

    if (!route) {
      return NextResponse.json(
        {
          error: "No preserved route was found for that RID.",
          rid,
        },
        {
          status: 404,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    return NextResponse.json(
      {
        rid,
        latest: route.latest,
        versions: route.versions,
        events: route.events,
        eventChainValid: route.eventChainValid,
        registry: route.registry ?? null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The route record could not be retrieved.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
