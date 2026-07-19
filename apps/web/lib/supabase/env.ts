const REQUIRED_PUBLIC_ENVIRONMENT_VARIABLES = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

type RequiredPublicEnvironmentVariable =
  (typeof REQUIRED_PUBLIC_ENVIRONMENT_VARIABLES)[number];

function readRequiredEnvironmentVariable(
  name: RequiredPublicEnvironmentVariable,
): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        "Configure it locally and in the Vercel project before using the account system.",
    );
  }

  return value;
}

function readSupabaseUrl(): string {
  const value = readRequiredEnvironmentVariable(
    "NEXT_PUBLIC_SUPABASE_URL",
  );

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be a valid absolute URL.",
    );
  }

  if (parsedUrl.protocol !== "https:" && parsedUrl.hostname !== "localhost") {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must use HTTPS unless it points to localhost.",
    );
  }

  return parsedUrl.toString().replace(/\/$/, "");
}

export interface SupabasePublicEnvironment {
  url: string;
  publishableKey: string;
}

export function getSupabasePublicEnvironment(): SupabasePublicEnvironment {
  return {
    url: readSupabaseUrl(),
    publishableKey: readRequiredEnvironmentVariable(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ),
  };
}
