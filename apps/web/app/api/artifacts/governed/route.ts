import { NextResponse } from "next/server";
import { listPublishedGovernedArtifacts } from "../../../../lib/governed-artifacts/public-repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const records = await listPublishedGovernedArtifacts();

  return NextResponse.json(
    {
      registry: "TA-14 Governed Artifact Registry",
      projection: "ta14_governed_artifacts_public_v1",
      generatedAt: new Date().toISOString(),
      count: records.length,
      records,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
