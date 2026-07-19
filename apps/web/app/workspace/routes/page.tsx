"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { StoredRoute } from "../../../lib/route-library";
import {
  deleteSupabaseRoute,
  duplicateSupabaseRoute,
  listSupabaseRoutes,
} from "../../../lib/supabase-route-library";
import { savePendingRouteDraft } from "../../../lib/route-draft-transfer";
import OpenInBuilderButton from "./open-in-builder-button";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function downloadRoute(item: StoredRoute): void {
  const blob = new Blob([JSON.stringify(item.route, null, 2)], {
    type: "application/json",
  });

  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  const filename =
    item.route.metadata.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "ta14-route";

  anchor.href = href;
  anchor.download = `${filename}.json`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(href);
}

export default function RouteLibraryPage() {
  const router = useRouter();

  const [routes, setRoutes] = useState<StoredRoute[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [workingRouteId, setWorking
