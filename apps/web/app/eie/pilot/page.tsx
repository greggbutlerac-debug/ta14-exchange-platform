import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { pilotGuard } from "../../../lib/eie/pilot/environment";
import { PilotConsole } from "./PilotConsole";

export const dynamic = "force-dynamic";

export const metadata = { title: "EIE Tier 1 Pilot", robots: { index: false, follow: false } };

/**
 * TA-14 EIE Tier 1 pilot console (P4 = 4a). Local-only; 404 unless the pilot flag, project allowlist and
 * local host guards all pass. Evidence acquisition only; the Gate A declared input is a separate step.
 */
export default async function PilotPage() {
  const host = (await headers()).get("host");
  if (!pilotGuard(process.env, host).enabled) notFound();
  return <PilotConsole />;
}
