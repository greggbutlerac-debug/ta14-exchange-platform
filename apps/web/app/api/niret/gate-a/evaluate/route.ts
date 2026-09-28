import { NextResponse, type NextRequest } from "next/server";

import { GOVERNED_OEM_REGISTRY } from "../../../../../../../packages/domain/niret/oem-registry";
import { loadCertificationVerifier } from "../../../../../lib/niret/certification-verifier";
import { evaluateNiretSubmission, NO_SOURCES, submissionContext } from "../../../../../lib/niret/server-evaluate";
import { createClient } from "../../../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 256 * 1024;

/**
 * POST /api/niret/gate-a/evaluate
 *
 * Authenticated transport to the frozen TA-14-NIRET-GA-C1 engine. The route
 * applies no Gate-A rule: malformed or incomplete evidence is passed to the
 * engine, which fails closed and returns its canonical receipt.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to evaluate NIRET Gate A." }, { status: 401 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Submission too large." }, { status: 413 });
  }
  let body: { input?: unknown };
  try {
    body = JSON.parse(raw) as { input?: unknown };
  } catch {
    return NextResponse.json({ error: "Submission is not valid JSON." }, { status: 400 });
  }

  // The authenticated account establishes who submitted the record only. Certification is verified
  // only from appointed-verifier records for that account (A4); no authority-establishment source is
  // integrated yet, so those elements are recorded as unavailable. The governed OEM registry (A7) is
  // integrated; it is empty until a genuine manufacturer source is registered.
  const now = new Date();
  const certificationVerifier = await loadCertificationVerifier(supabase, user.id, now);
  const sources = { ...NO_SOURCES, submitter: { accountId: user.id }, certificationVerifier, oemRegistry: GOVERNED_OEM_REGISTRY };
  const { receipt, findings, oemReference } = evaluateNiretSubmission(body.input, now, sources);
  return NextResponse.json(
    { receipt, findings, context: submissionContext(sources, oemReference) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
