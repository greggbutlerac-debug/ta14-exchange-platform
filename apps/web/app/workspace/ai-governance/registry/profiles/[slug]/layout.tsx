import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import GovernedProgressionDock from './GovernedProgressionDock';

type ProfileIdentity = {
  registry_identifier: string;
  governance_version: string | null;
};

function createSupabaseClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // This public layout only reads published records.
      },
    },
  });
}

export default async function GovernanceProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createSupabaseClient(cookieStore);

  if (!supabase) return children;

  const { data: profileData } = await supabase
    .from('ta14_governance_profiles_public_v1')
    .select('registry_identifier, governance_version')
    .eq('slug', slug)
    .maybeSingle();

  const profile = profileData as ProfileIdentity | null;

  if (!profile?.registry_identifier) return children;

  const { count } = await supabase
    .from('ta14_governance_life_history_public_v1')
    .select('event_key', { count: 'exact', head: true })
    .eq('registry_identifier', profile.registry_identifier);

  return (
    <>
      {children}
      <GovernedProgressionDock
        registryIdentifier={profile.registry_identifier}
        eventCount={count ?? 0}
        currentVersion={profile.governance_version}
      />
    </>
  );
}
