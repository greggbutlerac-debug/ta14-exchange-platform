import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import {
  getSupabasePublicKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

function createRegistryClient(accessToken: string) {
  return createClient(getSupabaseUrl(), getSupabasePublicKey(), {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function getBearerToken(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim() || null;
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = getBearerToken(request);

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const supabase = createRegistryClient(accessToken);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unable to verify authenticated user." },
        { status: 401 },
      );
    }

    const requestedId = request.nextUrl.searchParams.get("id");

    let query = supabase
      .from("ai_governance_registry_submissions")
      .select("*")
      .eq("owner_user_id", user.id)
      .eq("status", "draft");

    if (requestedId) {
      query = query.eq("id", requestedId).limit(1);
    } else {
      query = query.order("updated_at", { ascending: false }).limit(1);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          error: "Unable to load Registry draft.",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      draft: data ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected Registry draft error.",
        details:
          error instanceof Error ? error.message : "Unknown server error.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = getBearerToken(request);

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const supabase = createRegistryClient(accessToken);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unable to verify authenticated user." },
        { status: 401 },
      );
    }

    const body = await request.json();

    const submissionId =
      typeof body?.id === "string" && body.id.trim()
        ? body.id.trim()
        : null;

    const payload =
      body?.payload && typeof body.payload === "object"
        ? body.payload
        : body;

    if (submissionId) {
      const { data, error } = await supabase
        .from("ai_governance_registry_submissions")
        .update({
          ...payload,
          owner_user_id: user.id,
          status: "draft",
          updated_at: new Date().toISOString(),
        })
        .eq("id", submissionId)
        .eq("owner_user_id", user.id)
        .eq("status", "draft")
        .select("*")
        .single();

      if (error) {
        return NextResponse.json(
          {
            error: "Unable to update Registry draft.",
            details: error.message,
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        draft: data,
      });
    }

    const { data, error } = await supabase
      .from("ai_governance_registry_submissions")
      .insert({
        ...payload,
        owner_user_id: user.id,
        status: "draft",
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "Unable to create Registry draft.",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      draft: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected Registry draft error.",
        details:
          error instanceof Error ? error.message : "Unknown server error.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const accessToken = getBearerToken(request);

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const submissionId = request.nextUrl.searchParams.get("id");

    if (!submissionId) {
      return NextResponse.json(
        { error: "Draft id is required." },
        { status: 400 },
      );
    }

    const supabase = createRegistryClient(accessToken);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unable to verify authenticated user." },
        { status: 401 },
      );
    }

    const { error } = await supabase
      .from("ai_governance_registry_submissions")
      .delete()
      .eq("id", submissionId)
      .eq("owner_user_id", user.id)
      .eq("status", "draft");

    if (error) {
      return NextResponse.json(
        {
          error: "Unable to discard Registry draft.",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected Registry draft error.",
        details:
          error instanceof Error ? error.message : "Unknown server error.",
      },
      { status: 500 },
    );
  }
}
