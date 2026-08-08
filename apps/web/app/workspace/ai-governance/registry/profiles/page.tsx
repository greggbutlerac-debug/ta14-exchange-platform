import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import GovernanceProfileEditorLink from '../GovernanceProfileEditorLink';

type PublicRegistryRecord = {
  id: string;
  registry_identifier: string;
  governance_name: string;
  short_name?: string | null;
  version?: string | null;
  category?: string | null;
  steward?: string | null;
  registered_at?: string | null;
  status: string;
  summary?: string | null;
};

type GovernanceProfile = {
  id: string;
  profile_number: number;
  slug: string;
  registry_identifier: string;
  governance_name: string;
  short_name: string | null;
  governance_version: string | null;
  governance_category: string | null;
  steward_name: string | null;
  organization_name: string | null;
  registered_at: string | null;
  profile_title: string;
  profile_subtitle: string | null;
  profile_deck: string | null;
  public_summary: string | null;
  primary_website: string | null;
  tags: string[];
  is_featured: boolean;
  publication_boundary: string;
  published_at: string | null;
};

function createSupabaseClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase environment variables are not configured.',
    );
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },

      setAll(values) {
        try {
          values.forEach(
            ({ name, value, options }) => {
              cookieStore.set(
                name,
                value,
                options,
              );
            },
          );
        } catch {
          // Server-rendered public pages only require readable cookies.
        }
      },
    },
  });
}

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return 'Not recorded';
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  ).format(new Date(value));
}

function profileNumber(
  value: number,
): string {
  return String(value).padStart(3, '0');
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title:
    'TA-14 Governance Profiles | TA-14 Authority',
  description:
    'Institutional profiles of independent AI governance architectures registered through the TA-14 AI Governance Exchange.',
};

export default async function GovernanceProfilesPage() {
  const cookieStore = await cookies();

  const supabase =
    createSupabaseClient(cookieStore);

  const {
    data,
    error,
  } = await supabase
    .from(
      'ta14_governance_profiles_public_v1',
    )
    .select('*')
    .order(
      'is_featured',
      { ascending: false },
    )
    .order(
      'editorial_priority',
      { ascending: false },
    )
    .order(
      'profile_number',
      { ascending: true },
    );

  const profiles =
    error || !data
      ? []
      : (data as unknown as GovernanceProfile[]);

  const {
    data: registryData,
    error: registryError,
  } = await supabase.rpc(
    'ta14_registry_public_directory_v1',
  );

  const registryRecords =
    registryError || !Array.isArray(registryData)
      ? []
      : (registryData as unknown as PublicRegistryRecord[]).filter(
          (record) =>
            record &&
            typeof record.registry_identifier === 'string' &&
            typeof record.governance_name === 'string' &&
            typeof record.status === 'string',
        );

  const activeRegistryRecords = registryRecords.filter(
    (record) =>
      record.status.toLowerCase() === 'registered',
  );

  const profiledRegistryIdentifiers = new Set(
    profiles.map((profile) =>
      profile.registry_identifier.toUpperCase(),
    ),
  );

  const registeredWithoutProfile = activeRegistryRecords.filter(
    (record) =>
      !profiledRegistryIdentifiers.has(
        record.registry_identifier.toUpperCase(),
      ),
  );

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 20% 0%, rgba(30, 86, 146, 0.20), transparent 34%), radial-gradient(circle at 80% 10%, rgba(176, 124, 35, 0.13), transparent 32%), linear-gradient(180deg, #020814 0%, #06111f 45%, #020812 100%)',
        color: '#f5f7fb',
      }}
    >
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom:
            '1px solid rgba(213, 167, 75, 0.28)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.42,
            backgroundImage:
              'radial-gradient(circle at 15% 35%, rgba(255,255,255,0.75) 0 1px, transparent 1.5px), radial-gradient(circle at 72% 18%, rgba(255,255,255,0.7) 0 1px, transparent 1.5px), radial-gradient(circle at 85% 65%, rgba(255,255,255,0.55) 0 1px, transparent 1.5px), radial-gradient(circle at 40% 82%, rgba(255,255,255,0.45) 0 1px, transparent 1.5px)',
            backgroundSize:
              '190px 190px, 260px 260px, 320px 320px, 230px 230px',
          }}
        />

        <div
          style={{
            width: 'min(1180px, calc(100% - 40px))',
            margin: '0 auto',
            padding:
              '42px 0 76px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <nav
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: 48,
            }}
          >
            <Link
              href="/workspace/ai-governance/registry"
              style={{
                color: '#d9e6f4',
                textDecoration: 'none',
                fontSize: 14,
                letterSpacing: '0.04em',
              }}
            >
              Registry Home
            </Link>

            <span
              style={{
                color:
                  'rgba(255,255,255,0.28)',
              }}
            >
              /
            </span>

            <span
              style={{
                color: '#d4a84f',
                fontSize: 14,
                letterSpacing: '0.05em',
              }}
            >
              Governance Profiles
            </span>

            <span
              style={{
                color:
                  'rgba(255,255,255,0.28)',
              }}
            >
              /
            </span>

            <GovernanceProfileEditorLink />
          </nav>

          <div
            style={{
              maxWidth: 900,
            }}
          >
            <div
              style={{
                display:
                  'inline-flex',
                alignItems:
                  'center',
                gap: 10,
                padding:
                  '8px 13px',
                border:
                  '1px solid rgba(213, 167, 75, 0.36)',
                borderRadius: 999,
                background:
                  'rgba(213, 167, 75, 0.07)',
                color: '#e7bf6c',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing:
                  '0.12em',
                textTransform:
                  'uppercase',
                marginBottom: 24,
              }}
            >
              TA-14 Authority
              Institutional Commentary
            </div>

            <h1
              style={{
                margin: 0,
                fontSize:
                  'clamp(48px, 8vw, 92px)',
                lineHeight: 0.95,
                letterSpacing:
                  '-0.045em',
                fontWeight: 800,
                maxWidth: 980,
              }}
            >
              TA-14
              <br />
              Governance Profiles
            </h1>

            <p
              style={{
                margin:
                  '28px 0 0',
                maxWidth: 850,
                color:
                  '#b9c8d8',
                fontSize:
                  'clamp(18px, 2.4vw, 25px)',
                lineHeight: 1.55,
              }}
            >
              Independent AI
              governance
              architectures in
              the public record,
              introduced through
              TA-14 institutional
              commentary without
              collapsing their
              identities into
              TA-14.
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          width:
            'min(1180px, calc(100% - 40px))',
          margin: '0 auto',
          padding:
            '58px 0 24px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 18,
          }}
        >
          <div
            style={{
              padding: 22,
              border:
                '1px solid rgba(103, 162, 216, 0.18)',
              borderRadius: 18,
              background:
                'rgba(8, 23, 40, 0.72)',
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: '#7ca7ce',
                letterSpacing:
                  '0.12em',
                textTransform:
                  'uppercase',
                fontWeight: 700,
              }}
            >
              Registered First
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: 19,
                fontWeight: 700,
              }}
            >
              The Registry remains
              the evidentiary
              record.
            </div>
          </div>

          <div
            style={{
              padding: 22,
              border:
                '1px solid rgba(103, 162, 216, 0.18)',
              borderRadius: 18,
              background:
                'rgba(8, 23, 40, 0.72)',
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: '#7ca7ce',
                letterSpacing:
                  '0.12em',
                textTransform:
                  'uppercase',
                fontWeight: 700,
              }}
            >
              Commentary Second
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: 19,
                fontWeight: 700,
              }}
            >
              TA-14 explains why a
              registered
              architecture matters.
            </div>
          </div>

          <div
            style={{
              padding: 22,
              border:
                '1px solid rgba(213, 167, 75, 0.22)',
              borderRadius: 18,
              background:
                'rgba(28, 21, 7, 0.52)',
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: '#d8ab54',
                letterSpacing:
                  '0.12em',
                textTransform:
                  'uppercase',
                fontWeight: 700,
              }}
            >
              Boundary Preserved
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: 19,
                fontWeight: 700,
              }}
            >
              Registration is not
              certification or
              endorsement.
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          width:
            'min(1180px, calc(100% - 40px))',
          margin: '0 auto',
          padding:
            '38px 0 88px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems:
              'flex-end',
            gap: 24,
            flexWrap: 'wrap',
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                color: '#d7aa51',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing:
                  '0.14em',
                textTransform:
                  'uppercase',
                marginBottom: 10,
              }}
            >
              Public Institutional
              Profiles
            </div>

            <h2
              style={{
                margin: 0,
                fontSize:
                  'clamp(32px, 5vw, 54px)',
                lineHeight: 1,
                letterSpacing:
                  '-0.035em',
              }}
            >
              Architectures that
              stepped into the
              record.
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
              color: '#8599ad',
              fontSize: 14,
            }}
          >
            <span>
              <strong style={{ color: '#f0c76f' }}>
                {activeRegistryRecords.length}
              </strong>{' '}
              registered governance
              {activeRegistryRecords.length === 1
                ? ' record'
                : ' records'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <strong style={{ color: '#a9c9e4' }}>
                {profiles.length}
              </strong>{' '}
              published commentary
              {profiles.length === 1
                ? ' profile'
                : ' profiles'}
            </span>
          </div>
        </div>

        {registryError ? (
          <div
            style={{
              border: '1px solid rgba(213, 167, 75, 0.34)',
              background: 'rgba(80, 56, 12, 0.16)',
              borderRadius: 20,
              padding: 24,
              marginBottom: 24,
              color: '#f2d28b',
              lineHeight: 1.65,
            }}
          >
            The authoritative public Registry count could not be loaded.
            Published Governance Profiles are still shown below, but they
            must not be interpreted as the total number of registered
            governance records.
          </div>
        ) : null}

        {!registryError && registeredWithoutProfile.length > 0 ? (
          <section
            style={{
              border: '1px solid rgba(95, 157, 207, 0.28)',
              borderRadius: 26,
              background: 'linear-gradient(135deg, rgba(8,25,43,0.93), rgba(4,14,26,0.97))',
              padding: 'clamp(24px, 4vw, 36px)',
              marginBottom: 30,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
                gap: 20,
                flexWrap: 'wrap',
                marginBottom: 22,
              }}
            >
              <div>
                <div
                  style={{
                    color: '#8fbbe0',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',
                    marginBottom: 9,
                  }}
                >
                  Registered First · Commentary Separate
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 'clamp(24px, 3vw, 34px)',
                    letterSpacing: '-0.025em',
                  }}
                >
                  Registered governance records without a published TA-14 commentary profile
                </h3>
              </div>
              <span style={{ color: '#8da6ba', fontSize: 13 }}>
                {registeredWithoutProfile.length}{' '}
                {registeredWithoutProfile.length === 1 ? 'record' : 'records'}
              </span>
            </div>

            <p
              style={{
                margin: '0 0 22px',
                color: '#9fb2c4',
                lineHeight: 1.7,
                maxWidth: 900,
              }}
            >
              These architectures are already in the authoritative Registry.
              Their absence from the editorial profile collection does not
              erase or delay their registration. Registration and TA-14
              institutional commentary remain separate governed acts.
            </p>

            <div style={{ display: 'grid', gap: 14 }}>
              {registeredWithoutProfile.map((record) => (
                <article
                  key={record.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) auto',
                    gap: 20,
                    alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 18,
                    background: 'rgba(255,255,255,0.025)',
                    padding: '20px 22px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: '#f0c76f',
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                      }}
                    >
                      {record.registry_identifier}
                    </div>
                    <h4
                      style={{
                        margin: '7px 0 0',
                        fontSize: 21,
                      }}
                    >
                      {record.governance_name}
                    </h4>
                    <div
                      style={{
                        marginTop: 7,
                        color: '#839bad',
                        fontSize: 14,
                      }}
                    >
                      Steward: {record.steward ?? 'Not declared'}
                      {' · '}Version: {record.version ?? 'Not recorded'}
                      {' · '}Registered: {formatDate(record.registered_at ?? null)}
                    </div>
                  </div>

                  <Link
                    href={`/workspace/ai-governance/registry/public/${record.registry_identifier}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 42,
                      padding: '0 15px',
                      borderRadius: 11,
                      border: '1px solid rgba(136,177,214,0.28)',
                      color: '#c7d9e8',
                      textDecoration: 'none',
                      background: 'rgba(255,255,255,0.025)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Open Registry Record →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {error ? (
          <div
            style={{
              border:
                '1px solid rgba(190, 92, 92, 0.4)',
              background:
                'rgba(90, 24, 24, 0.18)',
              borderRadius: 20,
              padding: 28,
              color: '#ffd4d4',
            }}
          >
            Governance Profiles
            could not be loaded
            from the public
            profile service.
          </div>
        ) : null}

        {!error &&
        profiles.length === 0 ? (
          <div
            style={{
              border:
                '1px solid rgba(255,255,255,0.12)',
              borderRadius: 24,
              background:
                'rgba(255,255,255,0.025)',
              padding:
                '54px 32px',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                margin:
                  '0 0 12px',
                fontSize: 26,
              }}
            >
              No Governance Profiles
              are published yet.
            </h3>

            <p
              style={{
                margin:
                  '0 auto',
                maxWidth: 650,
                color: '#8fa3b7',
                lineHeight: 1.7,
              }}
            >
              Registered governance
              architectures may be
              selected for TA-14
              institutional
              profiling after their
              Registry baseline has
              been established.
            </p>
          </div>
        ) : null}

        <div
          style={{
            display: 'grid',
            gap: 26,
          }}
        >
          {profiles.map(
            (profile) => (
              <article
                key={profile.id}
                style={{
                  position:
                    'relative',
                  overflow:
                    'hidden',
                  border:
                    profile.is_featured
                      ? '1px solid rgba(213, 167, 75, 0.42)'
                      : '1px solid rgba(117, 158, 195, 0.22)',
                  borderRadius:
                    28,
                  background:
                    profile.is_featured
                      ? 'linear-gradient(135deg, rgba(11,30,52,0.96), rgba(9,20,35,0.98) 57%, rgba(45,31,8,0.92))'
                      : 'linear-gradient(135deg, rgba(11,30,52,0.92), rgba(5,15,28,0.96))',
                  boxShadow:
                    '0 30px 90px rgba(0,0,0,0.30)',
                }}
              >
                <div
                  style={{
                    position:
                      'absolute',
                    width: 340,
                    height: 340,
                    borderRadius:
                      '50%',
                    right: -100,
                    top: -120,
                    background:
                      'radial-gradient(circle, rgba(62,145,220,0.17), transparent 67%)',
                    pointerEvents:
                      'none',
                  }}
                />

                <div
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      'minmax(0, 1.4fr) minmax(240px, 0.6fr)',
                    gap: 30,
                    padding:
                      'clamp(28px, 5vw, 48px)',
                    position:
                      'relative',
                    zIndex: 1,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display:
                          'flex',
                        gap: 10,
                        alignItems:
                          'center',
                        flexWrap:
                          'wrap',
                        marginBottom:
                          20,
                      }}
                    >
                      <span
                        style={{
                          display:
                            'inline-flex',
                          padding:
                            '7px 10px',
                          border:
                            '1px solid rgba(213,167,75,0.34)',
                          borderRadius:
                            999,
                          color:
                            '#edc574',
                          background:
                            'rgba(213,167,75,0.08)',
                          fontSize:
                            11,
                          fontWeight:
                            800,
                          letterSpacing:
                            '0.11em',
                          textTransform:
                            'uppercase',
                        }}
                      >
                        Profile{' '}
                        {profileNumber(
                          profile.profile_number,
                        )}
                      </span>

                      {profile.is_featured ? (
                        <span
                          style={{
                            color:
                              '#8fbbe0',
                            fontSize:
                              12,
                            fontWeight:
                              700,
                            letterSpacing:
                              '0.08em',
                            textTransform:
                              'uppercase',
                          }}
                        >
                          Featured
                          Governance
                          Profile
                        </span>
                      ) : null}
                    </div>

                    <h3
                      style={{
                        margin: 0,
                        fontSize:
                          'clamp(32px, 5vw, 56px)',
                        lineHeight:
                          1.02,
                        letterSpacing:
                          '-0.04em',
                      }}
                    >
                      {
                        profile.profile_title
                      }
                    </h3>

                    {profile.profile_subtitle ? (
                      <p
                        style={{
                          margin:
                            '16px 0 0',
                          color:
                            '#d5b469',
                          fontSize:
                            18,
                          lineHeight:
                            1.5,
                          maxWidth:
                            850,
                        }}
                      >
                        {
                          profile.profile_subtitle
                        }
                      </p>
                    ) : null}

                    <p
                      style={{
                        margin:
                          '24px 0 0',
                        maxWidth:
                          830,
                        color:
                          '#b5c5d5',
                        fontSize:
                          17,
                        lineHeight:
                          1.75,
                      }}
                    >
                      {
                        profile.public_summary
                      }
                    </p>

                    <div
                      style={{
                        display:
                          'flex',
                        flexWrap:
                          'wrap',
                        gap: 10,
                        marginTop:
                          28,
                      }}
                    >
                      {(
                        profile.tags ??
                        []
                      ).map(
                        (tag) => (
                          <span
                            key={tag}
                            style={{
                              padding:
                                '7px 11px',
                              borderRadius:
                                999,
                              border:
                                '1px solid rgba(109,155,197,0.22)',
                              background:
                                'rgba(68,119,164,0.08)',
                              color:
                                '#a7c4dd',
                              fontSize:
                                12,
                            }}
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>

                    <div
                      style={{
                        display:
                          'flex',
                        gap: 12,
                        flexWrap:
                          'wrap',
                        marginTop:
                          32,
                      }}
                    >
                      <Link
                        href={`/workspace/ai-governance/registry/profiles/${profile.slug}`}
                        style={{
                          display:
                            'inline-flex',
                          alignItems:
                            'center',
                          justifyContent:
                            'center',
                          minHeight:
                            46,
                          padding:
                            '0 18px',
                          borderRadius:
                            12,
                          background:
                            'linear-gradient(135deg, #d6aa50, #9c6c1c)',
                          color:
                            '#07111d',
                          fontWeight:
                            800,
                          textDecoration:
                            'none',
                        }}
                      >
                        Read TA-14
                        Profile →
                      </Link>

                      <Link
                        href={`/workspace/ai-governance/registry/public/${profile.registry_identifier}`}
                        style={{
                          display:
                            'inline-flex',
                          alignItems:
                            'center',
                          justifyContent:
                            'center',
                          minHeight:
                            46,
                          padding:
                            '0 18px',
                          borderRadius:
                            12,
                          border:
                            '1px solid rgba(136,177,214,0.28)',
                          color:
                            '#c7d9e8',
                          textDecoration:
                            'none',
                          background:
                            'rgba(255,255,255,0.025)',
                        }}
                      >
                        Open Registry
                        Record
                      </Link>
                    </div>
                  </div>

                  <aside
                    style={{
                      alignSelf:
                        'stretch',
                      borderLeft:
                        '1px solid rgba(255,255,255,0.08)',
                      paddingLeft:
                        28,
                      display:
                        'flex',
                      flexDirection:
                        'column',
                      justifyContent:
                        'center',
                      gap: 22,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize:
                            11,
                          fontWeight:
                            800,
                          color:
                            '#718ba3',
                          letterSpacing:
                            '0.12em',
                          textTransform:
                            'uppercase',
                        }}
                      >
                        Registry
                        Identifier
                      </div>

                      <div
                        style={{
                          marginTop:
                            7,
                          fontSize:
                            19,
                          color:
                            '#f0c76f',
                          fontWeight:
                            800,
                        }}
                      >
                        {
                          profile.registry_identifier
                        }
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize:
                            11,
                          fontWeight:
                            800,
                          color:
                            '#718ba3',
                          letterSpacing:
                            '0.12em',
                          textTransform:
                            'uppercase',
                        }}
                      >
                        Steward
                      </div>

                      <div
                        style={{
                          marginTop:
                            7,
                          fontSize:
                            17,
                        }}
                      >
                        {profile.steward_name ??
                          'Not declared'}
                      </div>

                      {profile.organization_name ? (
                        <div
                          style={{
                            color:
                              '#8299ad',
                            marginTop:
                              4,
                          }}
                        >
                          {
                            profile.organization_name
                          }
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize:
                            11,
                          fontWeight:
                            800,
                          color:
                            '#718ba3',
                          letterSpacing:
                            '0.12em',
                          textTransform:
                            'uppercase',
                        }}
                      >
                        Version
                      </div>

                      <div
                        style={{
                          marginTop:
                            7,
                          fontSize:
                            17,
                        }}
                      >
                        {profile.governance_version ??
                          'Not recorded'}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize:
                            11,
                          fontWeight:
                            800,
                          color:
                            '#718ba3',
                          letterSpacing:
                            '0.12em',
                          textTransform:
                            'uppercase',
                        }}
                      >
                        Registered
                      </div>

                      <div
                        style={{
                          marginTop:
                            7,
                          fontSize:
                            17,
                        }}
                      >
                        {formatDate(
                          profile.registered_at,
                        )}
                      </div>
                    </div>
                  </aside>
                </div>
              </article>
            ),
          )}
        </div>
      </section>

      <section
        style={{
          borderTop:
            '1px solid rgba(213, 167, 75, 0.20)',
          background:
            'rgba(0,0,0,0.20)',
        }}
      >
        <div
          style={{
            width:
              'min(1180px, calc(100% - 40px))',
            margin: '0 auto',
            padding:
              '60px 0 72px',
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 1.3fr) minmax(280px, 0.7fr)',
            gap: 40,
            alignItems:
              'center',
          }}
        >
          <div>
            <div
              style={{
                color: '#d7aa51',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing:
                  '0.13em',
                textTransform:
                  'uppercase',
                marginBottom: 12,
              }}
            >
              The Registry Comes First
            </div>

            <h2
              style={{
                margin: 0,
                fontSize:
                  'clamp(30px, 4vw, 48px)',
                letterSpacing:
                  '-0.035em',
              }}
            >
              Declare it. Bound it.
              Evidence it. Register it.
            </h2>

            <p
              style={{
                margin:
                  '20px 0 0',
                color: '#9aafc2',
                lineHeight: 1.75,
                maxWidth: 760,
                fontSize: 16,
              }}
            >
              Governance Profiles do
              not replace Registry
              records. They help the
              public understand
              serious registered
              architectures after
              their attributable
              baseline has already
              entered the record.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection:
                'column',
              gap: 12,
            }}
          >
            <Link
              href="/workspace/ai-governance/registry/register"
              style={{
                display:
                  'inline-flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                minHeight: 52,
                padding:
                  '0 20px',
                borderRadius: 13,
                background:
                  'linear-gradient(135deg, #d9af58, #a27123)',
                color: '#07111d',
                fontWeight: 800,
                textDecoration:
                  'none',
              }}
            >
              Register a Governance
              Architecture →
            </Link>

            <Link
              href="/workspace/ai-governance/registry/public"
              style={{
                display:
                  'inline-flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                minHeight: 52,
                padding:
                  '0 20px',
                borderRadius: 13,
                border:
                  '1px solid rgba(135,177,214,0.28)',
                color: '#c7d9e8',
                textDecoration:
                  'none',
                background:
                  'rgba(255,255,255,0.025)',
              }}
            >
              Browse Public Registry
              →
            </Link>
          </div>
        </div>
      </section>

      <footer
        style={{
          borderTop:
            '1px solid rgba(255,255,255,0.06)',
          padding:
            '34px 20px 44px',
          textAlign: 'center',
          color: '#667b8f',
          fontSize: 13,
          letterSpacing:
            '0.05em',
        }}
      >
        TA-14 Authority Governance
        Institution
        <br />
        No admissible evidence. No
        admissible execution.
      </footer>
    </main>
  );
}
