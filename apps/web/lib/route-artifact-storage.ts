import { createClient } from "./supabase/client";

export const ROUTE_ARTIFACT_BUCKET = "route-artifacts" as const;

export const MAX_ROUTE_ARTIFACT_FILE_BYTES = 50 * 1024 * 1024;

export type UploadedRouteArtifactFile = {
  originalFilename: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
};

function sanitizeFilename(filename: string): string {
  const normalized = filename
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "artifact-file";
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function calculateFileSha256(file: File): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error("This browser cannot calculate SHA-256 file digests.");
  }

  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    await file.arrayBuffer(),
  );

  return bytesToHex(new Uint8Array(digest));
}

export async function uploadRouteArtifactFile(input: {
  routeRecordId: string;
  file: File;
}): Promise<UploadedRouteArtifactFile> {
  const { routeRecordId, file } = input;

  if (!routeRecordId.trim()) {
    throw new Error("Route record ID is required for file upload.");
  }

  if (file.size <= 0) {
    throw new Error("The selected file is empty.");
  }

  if (file.size > MAX_ROUTE_ARTIFACT_FILE_BYTES) {
    throw new Error("The selected file exceeds the 50 MB upload limit.");
  }

  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("You must be signed in to upload route artifacts.");
  }

  const sha256 = await calculateFileSha256(file);
  const safeFilename = sanitizeFilename(file.name);
  const storagePath = [
    user.id,
    routeRecordId,
    `${crypto.randomUUID()}-${safeFilename}`,
  ].join("/");

  const { error: uploadError } = await supabase.storage
    .from(ROUTE_ARTIFACT_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  return {
    originalFilename: file.name,
    storagePath,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    sha256,
  };
}

export async function removeRouteArtifactFile(
  storagePath: string,
): Promise<void> {
  const normalizedPath = storagePath.trim();

  if (!normalizedPath) {
    return;
  }

  const supabase = createClient();
  const { error } = await supabase.storage
    .from(ROUTE_ARTIFACT_BUCKET)
    .remove([normalizedPath]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function openRouteArtifactFile(
  storagePath: string,
): Promise<void> {
  const normalizedPath = storagePath.trim();

  if (!normalizedPath) {
    throw new Error("This artifact has no stored file.");
  }

  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(ROUTE_ARTIFACT_BUCKET)
    .createSignedUrl(normalizedPath, 60);

  if (error) {
    throw new Error(error.message);
  }

  const opened = window.open(data.signedUrl, "_blank", "noopener,noreferrer");

  if (!opened) {
    window.location.assign(data.signedUrl);
  }
}
