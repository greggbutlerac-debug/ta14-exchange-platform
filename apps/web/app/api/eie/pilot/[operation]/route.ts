import { NextResponse, type NextRequest } from "next/server";

import { pilotGuard } from "../../../../../lib/eie/pilot/environment";
import { runOperation } from "../../../../../lib/eie/pilot/operations";
import { pilotRuntime } from "../../../../../lib/eie/pilot/pilot-recorder";
import { createClient } from "../../../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_JSON_BYTES = 512 * 1024;
const notFound = () => NextResponse.json({ error: "Not found." }, { status: 404 });

/**
 * TA-14 EIE Tier 1 pilot API (P4 = 4a). Inert (404) unless the pilot flag is set, the Supabase project is
 * allowlisted, the request is local and the process is not a deployment. Authenticated accounts only.
 */
async function handle(request: NextRequest, params: Promise<{ operation: string }>) {
  const guard = pilotGuard(process.env, request.headers.get("host"));
  if (!guard.enabled) return notFound();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to use the pilot." }, { status: 401 });

  const { operation } = await params;
  let input: unknown = {};
  let file: File | null = null;
  if (request.method === "POST") {
    const type = request.headers.get("content-type") ?? "";
    if (type.startsWith("multipart/form-data")) {
      const form = await request.formData();
      const candidate = form.get("file");
      file = candidate instanceof File ? candidate : null;
      try { input = JSON.parse(String(form.get("input") ?? "{}")); } catch { return NextResponse.json({ error: "Input is not valid JSON." }, { status: 400 }); }
    } else {
      const raw = await request.text();
      if (raw.length > MAX_JSON_BYTES) return NextResponse.json({ error: "Submission too large." }, { status: 413 });
      try { input = raw ? JSON.parse(raw) : {}; } catch { return NextResponse.json({ error: "Submission is not valid JSON." }, { status: 400 }); }
    }
  } else {
    input = Object.fromEntries(request.nextUrl.searchParams);
  }

  try {
    const runtimeContext = await pilotRuntime(user.id, supabase);
    const result = await runOperation(operation, { accountId: user.id, runtime: runtimeContext, now: () => new Date().toISOString() }, input, file);
    return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const code = error instanceof Error && /^EIE_[A-Z_]+/.test(error.message) ? error.message.split(":")[0] : "EIE_PILOT_OPERATION_FAILED";
    return NextResponse.json({ error: code }, { status: 500 });
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ operation: string }> }) {
  return handle(request, context.params);
}

export async function POST(request: NextRequest, context: { params: Promise<{ operation: string }> }) {
  return handle(request, context.params);
}
