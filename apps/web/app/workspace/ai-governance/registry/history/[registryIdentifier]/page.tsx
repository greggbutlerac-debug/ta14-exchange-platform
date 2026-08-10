import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

type LifeEvent = {
  registry_identifier: string;
  event_key: string;
  event_type: string;
  event_date: string;
  title: string;
  summary: string | null;
  governance_version: string | null;
  artifact_identifier: string | null;
  demonstration_identifier: string | null;
  related_record_href: string | null;
  evidence_state: string | null;
  sequence_number: number;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  }).format(new Date(value));
}

function label(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function GovernanceLifeHistoryPage({ params }: {
  params: Promise<{ registryIdentifier: string }>;
}) {
  const { registryIdentifier } = await params;
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase environment variables are not configured.');

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => undefined,
    },
  });

  const [{ data: eventsData }, { data: registryData }] = await Promise.all([
    supabase.from('ta14_governance_life_history_public_v1').select('*')
      .eq('registry_identifier', registryIdentifier).order('sequence_number', { ascending: true }),
    supabase.from('ta14_registry_public_records').select('governance_name,version,steward_name,organization_name,registered_at')
      .eq('registry_identifier', registryIdentifier).maybeSingle(),
  ]);

  const events = (eventsData ?? []) as LifeEvent[];
  const registry = registryData as null | {
    governance_name?: string; version?: string; steward_name?: string;
    organization_name?: string; registered_at?: string;
  };
  const name = registry?.governance_name ?? registryIdentifier;

  return (
    <main style={{ minHeight: '100vh', color: '#eef4f8', background: 'radial-gradient(circle at 12% 0%, rgba(31,91,145,.24), transparent 30%), linear-gradient(180deg,#020813,#06111e 48%,#020710)' }}>
      <section style={{ borderBottom: '1px solid rgba(213,167,75,.22)' }}>
        <div style={{ width: 'min(1180px,calc(100% - 40px))', margin: '0 auto', padding: '42px 0 58px' }}>
          <nav style={{ display: 'flex', gap: 9, flexWrap: 'wrap', fontSize: 13, marginBottom: 42 }}>
            <Link href="/workspace/ai-governance/registry" style={{ color: '#a9bfd2', textDecoration: 'none' }}>Registry</Link>
            <span style={{ color: '#52687b' }}>/</span>
            <Link href="/workspace/ai-governance/registry/profiles" style={{ color: '#a9bfd2', textDecoration: 'none' }}>Governance Profiles</Link>
            <span style={{ color: '#52687b' }}>/</span><span style={{ color: '#e1b65e' }}>Life History</span>
          </nav>
          <div style={{ color: '#d6aa51', fontSize: 12, fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 14 }}>TA-14 Governed Architecture Life History</div>
          <h1 style={{ margin: 0, maxWidth: 950, fontSize: 'clamp(42px,7vw,82px)', lineHeight: .98, letterSpacing: '-.045em' }}>{name}</h1>
          <p style={{ maxWidth: 900, color: '#aebfd0', fontSize: 19, lineHeight: 1.7, margin: '24px 0 0' }}>
            One permanent governance identity. Versions, artifacts, findings, challenges, responses and later evidence accumulate beneath it without rewriting prior states.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 28 }}>
            {[registryIdentifier, registry?.version ? `Current version ${registry.version}` : null, `${events.length} preserved events`].filter(Boolean).map((item) => (
              <span key={item as string} style={{ border: '1px solid rgba(213,167,75,.3)', borderRadius: 999, padding: '8px 12px', color: '#e7bd68', fontSize: 12, fontWeight: 800 }}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ width: 'min(1180px,calc(100% - 40px))', margin: '0 auto', padding: '48px 0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14, marginBottom: 46 }}>
          {[
            ['Permanent identity', registryIdentifier],
            ['Current version', registry?.version ?? 'Not recorded'],
            ['Steward', registry?.steward_name ?? 'Not recorded'],
            ['Progression events', String(events.length)],
          ].map(([k,v]) => <div key={k} style={{ border: '1px solid rgba(111,153,192,.16)', borderRadius: 20, background: 'rgba(7,24,41,.72)', padding: 22 }}><div style={{ color: '#70899f', fontSize: 10, fontWeight: 800, letterSpacing: '.13em', textTransform: 'uppercase' }}>{k}</div><div style={{ marginTop: 8, fontSize: 18, fontWeight: 750, color: '#edf3f7' }}>{v}</div></div>)}
        </div>

        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
          <div><div style={{ color: '#d6aa51', fontSize: 11, fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase' }}>Progression Record</div><h2 style={{ margin: '8px 0 0', fontSize: 'clamp(30px,4vw,48px)', letterSpacing: '-.035em' }}>What changed, and when.</h2></div>
          <Link href={`/workspace/ai-governance/registry/records/${registryIdentifier}`} style={{ color: '#e4b85f', textDecoration: 'none', fontWeight: 800 }}>Open permanent Registry record →</Link>
        </div>

        {events.length === 0 ? (
          <div style={{ border: '1px solid rgba(111,153,192,.18)', borderRadius: 22, padding: 30, color: '#9fb2c3', background: 'rgba(7,24,41,.6)' }}>No published progression events have been recorded for this governance identity yet.</div>
        ) : (
          <div style={{ position: 'relative', display: 'grid', gap: 16 }}>
            {events.map((event, index) => (
              <article key={event.event_key} style={{ display: 'grid', gridTemplateColumns: '88px minmax(0,1fr)', gap: 20 }}>
                <div style={{ textAlign: 'right', paddingTop: 22 }}><div style={{ color: '#e2b55d', fontWeight: 850, fontSize: 12 }}>{String(index + 1).padStart(2,'0')}</div><div style={{ color: '#6f879a', fontSize: 11, marginTop: 5 }}>{formatDate(event.event_date)}</div></div>
                <div style={{ border: event.event_type === 'artifact' ? '1px solid rgba(213,167,75,.28)' : '1px solid rgba(111,153,192,.17)', borderRadius: 22, background: event.event_type === 'artifact' ? 'linear-gradient(135deg,rgba(31,25,11,.66),rgba(7,23,39,.9))' : 'rgba(7,24,41,.72)', padding: '24px 26px' }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 13 }}>
                    <span style={{ color: '#dcb35f', fontSize: 10, fontWeight: 850, letterSpacing: '.12em', textTransform: 'uppercase' }}>{label(event.event_type)}</span>
                    {event.governance_version ? <span style={{ color: '#7f9bb1', fontSize: 10, fontWeight: 800 }}>VERSION {event.governance_version}</span> : null}
                    {event.evidence_state ? <span style={{ color: '#7f9bb1', fontSize: 10, fontWeight: 800 }}>{label(event.evidence_state)}</span> : null}
                  </div>
                  <h3 style={{ margin: 0, fontSize: 23, lineHeight: 1.25, color: '#f1f5f8' }}>{event.title}</h3>
                  {event.summary ? <p style={{ margin: '12px 0 0', color: '#aabccc', lineHeight: 1.75, fontSize: 15 }}>{event.summary}</p> : null}
                  {event.artifact_identifier ? <div style={{ marginTop: 14, color: '#dcb35f', fontSize: 12, fontWeight: 800 }}>Artifact: {event.artifact_identifier}</div> : null}
                  {event.related_record_href ? <Link href={event.related_record_href} style={{ display: 'inline-block', marginTop: 16, color: '#bcd7ea', fontWeight: 750, fontSize: 13, textDecoration: 'none' }}>Open governed record →</Link> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
