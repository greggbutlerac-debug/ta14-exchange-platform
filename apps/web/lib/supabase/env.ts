export interface SupabasePublicEnvironment {
  url: string;
  publishableKey: string;
}

function readSupabaseUrl(): string {
  const value =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

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
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!value) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
        "Configure it locally and in the Vercel project before using the account system.",
    );
  }

  return value;
}

export function getSupabasePublicEnvironment(): SupabasePublicEnvironment {
  return {
    url: readSupabaseUrl(),
    publishableKey: readSupabasePublishableKey(),
  };
}
