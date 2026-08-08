export interface SupabasePublicEnvironment {
  url: string;
  publishableKey: string;
}

function readSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!value) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL. " +
        "Configure it locally and in the Vercel project before using the account system.",
    );
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be a valid absolute URL.",
    );
  }

  if (
    parsedUrl.protocol !== "https:" &&
    parsedUrl.hostname !== "localhost"
  ) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must use HTTPS unless it points to localhost.",
    );
  }

  return parsedUrl.toString().replace(/\/$/, "");
}

function readSupabasePublishableKey(): string {
  const value =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!value) {
    throw new Error(
      "Missing Supabase public key. Configure NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY (legacy compatibility) locally and in Vercel.",
    );
  }

  return value;
}

export function getSupabaseUrl(): string {
  return readSupabaseUrl();
}

export function getSupabasePublicKey(): string {
  return readSupabasePublishableKey();
}

export function getSupabasePublicEnvironment(): SupabasePublicEnvironment {
  return {
    url: readSupabaseUrl(),
    publishableKey: readSupabasePublishableKey(),
  };
}
