import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function GovernanceProfileEditorLink() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server-rendered navigation only requires readable cookies.
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: isReviewer, error } = await supabase.rpc(
    'ta14_registry_is_reviewer',
  );

  if (error || isReviewer !== true) {
    return null;
  }

  return (
    <Link
      href="/workspace/ai-governance/registry/profiles/editor"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
        padding: '0 15px',
        borderRadius: 11,
        border: '1px solid rgba(213, 167, 75, 0.34)',
        background: 'rgba(213, 167, 75, 0.08)',
        color: '#edc574',
        textDecoration: 'none',
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: '0.04em',
      }}
    >
      Governance Profile Editor →
    </Link>
  );
}
