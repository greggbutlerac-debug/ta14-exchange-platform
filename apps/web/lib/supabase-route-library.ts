import type { TransferRouteDraft } from "./route-draft-transfer";
import type { StoredRoute } from "./route-library";
import { createClient } from "./supabase/client";

type ExchangeRouteRow = {
  id: string;
  user_id: string;
  route_id: string;
  route_name: string;
  domain: string;
  owner: string;
  status: string;
  version: number;
  route_data: TransferRouteDraft;
  created_at: string;
  updated_at: string;
};

function mapRowToStoredRoute(row: ExchangeRouteRow): StoredRoute {
  return {
    id: row.id,
    route: row.route_data,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("You must be signed in to manage exchange routes.");
  }

  return user.id;
}

export async function listSupabaseRoutes(): Promise<StoredRoute[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("exchange_routes")
    .select(
      "id,user_id,route_id,route_name,domain,owner,status,version,route_data,created_at,updated_at",
    )
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ExchangeRouteRow[]).map(mapRowToStoredRoute);
}

export async function getSupabaseRoute(
  id: string,
): Promise<StoredRoute | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("exchange_routes")
    .select(
      "id,user_id,route_id,route_name,domain,owner,status,version,route_data,created_at,updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data
    ? mapRowToStoredRoute(data as ExchangeRouteRow)
    : null;
}

export async function saveSupabaseRoute(
  route: TransferRouteDraft,
  existingId?: string,
): Promise<StoredRoute> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const payload = {
    user_id: userId,
    route_id: route.routeId,
    route_name: route.metadata.name,
    domain: route.metadata.domain,
    owner: route.metadata.owner,
    status:
      route.readiness.completedStages === route.readiness.totalStages
        ? "READY_FOR_TEST"
        : "DRAFT",
    version: route.metadata.version,
    route_data: route,
  };

  const query = existingId
    ? supabase
        .from("exchange_routes")
        .update(payload)
        .eq("id", existingId)
    : supabase.from("exchange_routes").insert(payload);

  const { data, error } = await query
    .select(
      "id,user_id,route_id,route_name,domain,owner,status,version,route_data,created_at,updated_at",
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToStoredRoute(data as ExchangeRouteRow);
}

export async function deleteSupabaseRoute(
  id: string,
): Promise<boolean> {
  const supabase = createClient();

  const { error, count } = await supabase
    .from("exchange_routes")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return (count ?? 0) > 0;
}

export async function duplicateSupabaseRoute(
  id: string,
): Promise<StoredRoute | null> {
  const source = await getSupabaseRoute(id);

  if (!source) {
    return null;
  }

  return saveSupabaseRoute({
    ...source.route,
    routeId: `${source.route.routeId}:copy:${crypto.randomUUID()}`,
    metadata: {
      ...source.route.metadata,
      name: `${source.route.metadata.name} Copy`,
      version: source.route.metadata.version + 1,
    },
  });
}

export async function clearSupabaseRoutes(): Promise<void> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("exchange_routes")
    .delete()
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}
