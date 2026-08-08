import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

  claimed_establishment_date: string | null;
  registered_at: string | null;

  profile_title: string;
  profile_subtitle: string | null;
  profile_deck: string | null;
  public_summary: string | null;

  who_they_are_markdown: string | null;
  what_they_are_building_markdown: string | null;
  what_they_declared_markdown: string | null;
  why_ta14_is_paying_attention_markdown: string | null;
  registration_meaning_markdown: string | null;
  governed_work_markdown: string | null;
  ta14_commentary_markdown: string | null;

  primary_website: string | null;
  profile_image_url: string | null;
  profile_image_alt: string | null;

  external_links: unknown;
  related_registry_identifiers: string[] | null;
  related_demonstration_identifiers: string[] | null;
  tags: string[] | null;

  is_featured: boolean;
  editorial_priority: number;

  publication_boundary: string | null;
  non_claims: string | null;

  published_at: string | null;
  updated_at: string | null;
};

type ExternalLink = {
  label: string;
  url: string;
};

function createSupabaseClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase environment variables are not configured.',
    );
  }

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(values) {
          try {
            values.forEach(
              ({
                name,
                value,
                options,
              }) => {
                cookieStore.set(
                  name,
                  value,
                  options,
                );
              },
            );
          } catch {
            // Public server-rendered pages only
            // require readable session cookies.
          }
        },
      },
    },
  );
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
  ).format(
    new Date(value),
  );
}

function formatDateTime(
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
      hour: 'numeric',
      minute: '2-digit',
    },
  ).format(
    new Date(value),
  );
}

function profileNumber(
  value: number,
): string {
  return String(
    value,
  ).padStart(
    3,
    '0',
  );
}

function cleanText(
  value: string | null,
): string {
  return (
    value?.trim() ??
    ''
  );
}

function parseExternalLinks(
  value: unknown,
): ExternalLink[] {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .map(
      (
        item,
      ): ExternalLink | null => {
        if (
          typeof item !==
            'object' ||
          item === null
        ) {
          return null;
        }

        const candidate =
          item as {
            label?: unknown;
            url?: unknown;
          };

        if (
          typeof candidate.label !==
            'string' ||
          typeof candidate.url !==
            'string'
        ) {
          return null;
        }

        const label =
          candidate.label.trim();

        const url =
          candidate.url.trim();

        if (
          !label ||
          !url
        ) {
          return null;
        }

        return {
          label,
          url,
        };
      },
    )
    .filter(
      (
        value,
      ): value is ExternalLink =>
        Boolean(value),
    );
}

function normalizeParagraphs(
  value: string | null,
): string[] {
  const text =
    cleanText(value);

  if (!text) {
    return [];
  }

  return text
    .split(
      /\n\s*\n/g,
    )
    .map(
      (paragraph) =>
        paragraph.trim(),
    )
    .filter(Boolean);
}

function TextSection({
  value,
}: {
  value: string | null;
}) {
  const paragraphs =
    normalizeParagraphs(
      value,
    );

  if (
    paragraphs.length === 0
  ) {
    return (
      <p
        style={{
          margin: 0,
          color:
            '#8297aa',
          fontSize: 16,
          lineHeight: 1.8,
        }}
      >
        No public commentary
        has been published for
        this section.
      </p>
    );
  }

  return (
    <div
      style={{
        display:
          'grid',
        gap: 18,
      }}
    >
      {paragraphs.map(
        (
          paragraph,
          index,
        ) => {
          const isStatement =
            paragraph.startsWith(
              '**',
            ) &&
            paragraph.endsWith(
              '**',
            );

          if (
            isStatement
          ) {
            const statement =
              paragraph
                .replace(
                  /^\*\*/,
                  '',
                )
                .replace(
                  /\*\*$/,
                  '',
                )
                .trim();

            return (
              <blockquote
                key={`${statement}-${index}`}
                style={{
                  margin: 0,
                  borderLeft:
                    '3px solid rgba(214, 170, 79, 0.85)',
                  padding:
                    '10px 0 10px 20px',
                  color:
                    '#f0c875',
                  fontSize:
                    'clamp(20px, 2.8vw, 28px)',
                  lineHeight:
                    1.45,
                  fontWeight:
                    700,
                  letterSpacing:
                    '-0.015em',
                }}
              >
                {statement}
              </blockquote>
            );
          }

          return (
            <p
              key={`${paragraph.slice(0, 40)}-${index}`}
              style={{
                margin: 0,
                color:
                  '#b4c5d5',
                fontSize:
                  17,
                lineHeight:
                  1.85,
              }}
            >
              {paragraph}
            </p>
          );
        },
      )}
    </div>
  );
}

function SectionEyebrow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom: 12,
        color:
          '#d7aa51',
        fontSize: 11,
        fontWeight: 800,
        letterSpacing:
          '0.15em',
        textTransform:
          'uppercase',
      }}
    >
      {children}
    </div>
  );
}

function ProfileSection({
  eyebrow,
  title,
  children,
  accent = false,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section
      style={{
        position:
          'relative',
        overflow:
          'hidden',
        border:
          accent
            ? '1px solid rgba(213, 167, 75, 0.30)'
            : '1px solid rgba(111, 153, 192, 0.16)',
        borderRadius:
          26,
        background:
          accent
            ? 'linear-gradient(135deg, rgba(29, 24, 12, 0.78), rgba(7, 22, 38, 0.92))'
            : 'linear-gradient(135deg, rgba(8, 26, 45, 0.84), rgba(4, 15, 27, 0.94))',
        padding:
          'clamp(28px, 5vw, 44px)',
        boxShadow:
          '0 22px 70px rgba(0, 0, 0, 0.20)',
      }}
    >
      <div
        style={{
          position:
            'absolute',
          right: -90,
          top: -90,
          width: 240,
          height: 240,
          borderRadius:
            '50%',
          background:
            accent
              ? 'radial-gradient(circle, rgba(213, 167, 75, 0.12), transparent 70%)'
              : 'radial-gradient(circle, rgba(62, 145, 220, 0.10), transparent 70%)',
          pointerEvents:
            'none',
        }}
      />

      <div
        style={{
          position:
            'relative',
          zIndex: 1,
        }}
      >
        <SectionEyebrow>
          {eyebrow}
        </SectionEyebrow>

        <h2
          style={{
            margin:
              '0 0 24px',
            color:
              '#f4f7fa',
            fontSize:
              'clamp(28px, 4vw, 44px)',
            lineHeight:
              1.05,
            letterSpacing:
              '-0.035em',
          }}
        >
          {title}
        </h2>

        {children}
      </div>
    </section>
  );
}

function DataLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        color:
          '#70899f',
        fontSize: 10,
        fontWeight: 800,
        letterSpacing:
          '0.14em',
        textTransform:
          'uppercase',
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function DataValue({
  children,
  gold = false,
}: {
  children: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <div
      style={{
        color:
          gold
            ? '#e8bb61'
            : '#e8eef4',
        fontSize: 16,
        lineHeight: 1.5,
        fontWeight:
          gold
            ? 800
            : 600,
      }}
    >
      {children}
    </div>
  );
}

function RecordData({
  label,
  value,
  gold = false,
}: {
  label: string;
  value: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <div
      style={{
        padding:
          '16px 0',
        borderBottom:
          '1px solid rgba(255,255,255,0.055)',
      }}
    >
      <DataLabel>
        {label}
      </DataLabel>

      <DataValue
        gold={gold}
      >
        {value}
      </DataValue>
    </div>
  );
}

function StatusPill({
  children,
  tone = 'blue',
}: {
  children: React.ReactNode;
  tone?:
    | 'blue'
    | 'gold'
    | 'green';
}) {
  const styles = {
    blue: {
      border:
        'rgba(91, 159, 214, 0.34)',
      background:
        'rgba(48, 111, 163, 0.12)',
      color:
        '#a6c9e6',
    },

    gold: {
      border:
        'rgba(213, 167, 75, 0.38)',
      background:
        'rgba(213, 167, 75, 0.10)',
      color:
        '#eac16f',
    },

    green: {
      border:
        'rgba(80, 187, 135, 0.32)',
      background:
        'rgba(52, 150, 102, 0.11)',
      color:
        '#91dbb4',
    },
  }[tone];

  return (
    <span
      style={{
        display:
          'inline-flex',
        alignItems:
          'center',
        minHeight: 30,
        padding:
          '0 11px',
        border:
          `1px solid ${styles.border}`,
        borderRadius:
          999,
        background:
          styles.background,
        color:
          styles.color,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing:
          '0.095em',
        textTransform:
          'uppercase',
      }}
    >
      {children}
    </span>
  );
}

function ArrowLink({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display:
          'inline-flex',
        alignItems:
          'center',
        justifyContent:
          'center',
        minHeight: 48,
        padding:
          '0 17px',
        borderRadius:
          12,
        textDecoration:
          'none',
        fontWeight: 800,
        fontSize: 14,
        border:
          primary
            ? '1px solid rgba(218, 174, 85, 0.8)'
            : '1px solid rgba(130, 169, 204, 0.28)',
        background:
          primary
            ? 'linear-gradient(135deg, #d7ab52, #9e6e20)'
            : 'rgba(255,255,255,0.025)',
        color:
          primary
            ? '#06101c'
            : '#c9dbe9',
      }}
    >
      {children}
    </Link>
  );
}

function ExternalButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display:
          'inline-flex',
        alignItems:
          'center',
        justifyContent:
          'center',
        minHeight: 44,
        padding:
          '0 15px',
        borderRadius:
          11,
        border:
          '1px solid rgba(115, 164, 205, 0.24)',
        background:
          'rgba(255,255,255,0.025)',
        color:
          '#bcd4e7',
        textDecoration:
          'none',
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {children} ↗
    </a>
  );
}

export const dynamic =
  'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params:
    Promise<{
      slug: string;
    }>;
}) {
  const {
    slug,
  } = await params;

  const cookieStore =
    await cookies();

  const supabase =
    createSupabaseClient(
      cookieStore,
    );

  const {
    data,
  } =
    await supabase
      .from(
        'ta14_governance_profiles_public_v1',
      )
      .select(
        'profile_title, public_summary, governance_name',
      )
      .eq(
        'slug',
        slug,
      )
      .maybeSingle();

  const profile =
    data as unknown as {
      profile_title?: string;
      public_summary?: string;
      governance_name?: string;
    } | null;

  const title =
    profile?.profile_title ??
    profile?.governance_name ??
    'TA-14 Governance Profile';

  const description =
    profile?.public_summary ??
    'TA-14 institutional commentary about a registered AI governance architecture.';

  return {
    title:
      `${title} | TA-14 Governance Profiles`,
    description,
  };
}

export default async function GovernanceProfilePage({
  params,
}: {
  params:
    Promise<{
      slug: string;
    }>;
}) {
  const {
    slug,
  } = await params;

  const cookieStore =
    await cookies();

  const supabase =
    createSupabaseClient(
      cookieStore,
    );

  const {
    data,
    error,
  } =
    await supabase
      .from(
        'ta14_governance_profiles_public_v1',
      )
      .select('*')
      .eq(
        'slug',
        slug,
      )
      .maybeSingle();

  if (
    error ||
    !data
  ) {
    notFound();
  }

  const profile =
    data as unknown as GovernanceProfile;

  const externalLinks =
    parseExternalLinks(
      profile.external_links,
    );

  const tags =
    profile.tags ??
    [];

  const relatedDemonstrations =
    profile.related_demonstration_identifiers ??
    [];

  const relatedRegistryIdentifiers =
    profile.related_registry_identifiers ??
    [];

  return (
    <main
      style={{
        minHeight:
          '100vh',
        background:
          'radial-gradient(circle at 14% 0%, rgba(28, 83, 139, 0.22), transparent 30%), radial-gradient(circle at 86% 8%, rgba(198, 145, 46, 0.12), transparent 28%), linear-gradient(180deg, #020813 0%, #06111e 44%, #020710 100%)',
        color:
          '#f3f6f9',
      }}
    >
      <header
        style={{
          position:
            'relative',
          overflow:
            'hidden',
          borderBottom:
            '1px solid rgba(213, 167, 75, 0.22)',
        }}
      >
        <div
          style={{
            position:
              'absolute',
            inset: 0,
            opacity: 0.30,
            pointerEvents:
              'none',
            backgroundImage:
              'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.9) 0 1px, transparent 1.4px), radial-gradient(circle at 68% 14%, rgba(255,255,255,0.7) 0 1px, transparent 1.4px), radial-gradient(circle at 88% 44%, rgba(255,255,255,0.65) 0 1px, transparent 1.4px), radial-gradient(circle at 46% 80%, rgba(255,255,255,0.5) 0 1px, transparent 1.4px)',
            backgroundSize:
              '210px 210px, 280px 280px, 330px 330px, 250px 250px',
          }}
        />

        <div
          style={{
            position:
              'absolute',
            right:
              '-12vw',
            top:
              '-25vw',
            width:
              '65vw',
            height:
              '65vw',
            borderRadius:
              '50%',
            border:
              '1px solid rgba(70, 144, 210, 0.10)',
            boxShadow:
              'inset 0 0 140px rgba(52, 120, 185, 0.08)',
            pointerEvents:
              'none',
          }}
        />

        <div
          style={{
            width:
              'min(1220px, calc(100% - 40px))',
            margin:
              '0 auto',
            padding:
              '36px 0 76px',
            position:
              'relative',
            zIndex: 1,
          }}
        >
          <nav
            style={{
              display:
                'flex',
              alignItems:
                'center',
              gap: 10,
              flexWrap:
                'wrap',
              marginBottom:
                48,
              fontSize: 13,
            }}
          >
            <Link
              href="/workspace/ai-governance/registry"
              style={{
                color:
                  '#a9bfd2',
                textDecoration:
                  'none',
              }}
            >
              Registry
            </Link>

            <span
              style={{
                color:
                  'rgba(255,255,255,0.25)',
              }}
            >
              /
            </span>

            <Link
              href="/workspace/ai-governance/registry/profiles"
              style={{
                color:
                  '#a9bfd2',
                textDecoration:
                  'none',
              }}
            >
              Governance
              Profiles
            </Link>

            <span
              style={{
                color:
                  'rgba(255,255,255,0.25)',
              }}
            >
              /
            </span>

            <span
              style={{
                color:
                  '#e1b65e',
              }}
            >
              Profile{' '}
              {profileNumber(
                profile.profile_number,
              )}
            </span>
          </nav>

          <div
            style={{
              display:
                'grid',
              gridTemplateColumns:
                'minmax(0, 1.45fr) minmax(280px, 0.55fr)',
              gap:
                'clamp(34px, 6vw, 80px)',
              alignItems:
                'end',
            }}
          >
            <div>
              <div
                style={{
                  display:
                    'flex',
                  gap: 10,
                  flexWrap:
                    'wrap',
                  marginBottom:
                    24,
                }}
              >
                <StatusPill
                  tone="gold"
                >
                  TA-14 Governance
                  Profile{' '}
                  {profileNumber(
                    profile.profile_number,
                  )}
                </StatusPill>

                <StatusPill
                  tone="green"
                >
                  Registered
                  Architecture
                </StatusPill>

                {profile.is_featured ? (
                  <StatusPill>
                    Featured
                    Profile
                  </StatusPill>
                ) : null}
              </div>

              <div
                style={{
                  marginBottom:
                    13,
                  color:
                    '#d6aa51',
                  fontSize:
                    12,
                  fontWeight:
                    800,
                  letterSpacing:
                    '0.14em',
                  textTransform:
                    'uppercase',
                }}
              >
                Independent
                Governance
                Architecture in
                the Public Record
              </div>

              <h1
                style={{
                  margin: 0,
                  maxWidth:
                    960,
                  color:
                    '#f7f9fb',
                  fontSize:
                    'clamp(46px, 7.4vw, 88px)',
                  lineHeight:
                    0.96,
                  letterSpacing:
                    '-0.048em',
                  fontWeight:
                    850,
                }}
              >
                {
                  profile.profile_title
                }
              </h1>

              {profile.profile_subtitle ? (
                <p
                  style={{
                    margin:
                      '24px 0 0',
                    maxWidth:
                      900,
                    color:
                      '#e1b85f',
                    fontSize:
                      'clamp(18px, 2.1vw, 24px)',
                    lineHeight:
                      1.55,
                    fontWeight:
                      650,
                  }}
                >
                  {
                    profile.profile_subtitle
                  }
                </p>
              ) : null}

              {profile.profile_deck ? (
                <p
                  style={{
                    margin:
                      '24px 0 0',
                    maxWidth:
                      900,
                    color:
                      '#aebfd0',
                    fontSize:
                      'clamp(17px, 2vw, 21px)',
                    lineHeight:
                      1.72,
                  }}
                >
                  {
                    profile.profile_deck
                  }
                </p>
              ) : null}

              <div
                style={{
                  display:
                    'flex',
                  gap: 12,
                  flexWrap:
                    'wrap',
                  marginTop:
                    34,
                }}
              >
                <ArrowLink
                  href={`/workspace/ai-governance/registry/records/${profile.registry_identifier}`}
                  primary
                >
                  Open Permanent
                  Registry Record →
                </ArrowLink>

                <ArrowLink
                  href="/workspace/ai-governance/registry/profiles"
                >
                  Browse Governance
                  Profiles
                </ArrowLink>
              </div>
            </div>

            <aside
              style={{
                border:
                  '1px solid rgba(213, 167, 75, 0.24)',
                borderRadius:
                  24,
                background:
                  'linear-gradient(180deg, rgba(8,25,43,0.90), rgba(5,15,27,0.96))',
                padding:
                  '26px 26px 20px',
                boxShadow:
                  '0 28px 85px rgba(0,0,0,0.32)',
              }}
            >
              <div
                style={{
                  marginBottom:
                    17,
                }}
              >
                <SectionEyebrow>
                  Registry Identity
                </SectionEyebrow>

                <div
                  style={{
                    color:
                      '#efc56f',
                    fontSize:
                      23,
                    lineHeight:
                      1.2,
                    fontWeight:
                      850,
                    wordBreak:
                      'break-word',
                  }}
                >
                  {
                    profile.registry_identifier
                  }
                </div>
              </div>

              <RecordData
                label="Governance"
                value={
                  profile.governance_name
                }
              />

              <RecordData
                label="Version"
                value={
                  profile.governance_version ??
                  'Not recorded'
                }
              />

              <RecordData
                label="Category"
                value={
                  profile.governance_category ??
                  'Not recorded'
                }
              />

              <RecordData
                label="Steward"
                value={
                  profile.steward_name ??
                  'Not recorded'
                }
              />

              {profile.organization_name ? (
                <RecordData
                  label="Organization"
                  value={
                    profile.organization_name
                  }
                />
              ) : null}

              <RecordData
                label="Registered"
                value={formatDate(
                  profile.registered_at,
                )}
              />
            </aside>
          </div>
        </div>
      </header>

      <section
        style={{
          width:
            'min(1220px, calc(100% - 40px))',
          margin:
            '0 auto',
          padding:
            '48px 0 18px',
        }}
      >
        <div
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 16,
          }}
        >
          <div
            style={{
              minHeight:
                150,
              padding: 24,
              border:
                '1px solid rgba(109, 156, 197, 0.17)',
              borderRadius:
                20,
              background:
                'rgba(7, 24, 41, 0.70)',
            }}
          >
            <SectionEyebrow>
              Identity
            </SectionEyebrow>

            <div
              style={{
                color:
                  '#eef3f7',
                fontSize: 20,
                fontWeight:
                  750,
                lineHeight:
                  1.35,
              }}
            >
              Independent
              architecture.
              Independent
              stewardship.
            </div>
          </div>

          <div
            style={{
              minHeight:
                150,
              padding: 24,
              border:
                '1px solid rgba(109, 156, 197, 0.17)',
              borderRadius:
                20,
              background:
                'rgba(7, 24, 41, 0.70)',
            }}
          >
            <SectionEyebrow>
              Baseline
            </SectionEyebrow>

            <div
              style={{
                color:
                  '#eef3f7',
                fontSize: 20,
                fontWeight:
                  750,
                lineHeight:
                  1.35,
              }}
            >
              Claims, boundaries,
              version, and
              evidence preserved
              before later work.
            </div>
          </div>

          <div
            style={{
              minHeight:
                150,
              padding: 24,
              border:
                '1px solid rgba(213, 167, 75, 0.22)',
              borderRadius:
                20,
              background:
                'rgba(30, 23, 9, 0.52)',
            }}
          >
            <SectionEyebrow>
              Boundary
            </SectionEyebrow>

            <div
              style={{
                color:
                  '#eef3f7',
                fontSize: 20,
                fontWeight:
                  750,
                lineHeight:
                  1.35,
              }}
            >
              Registration is not
              certification,
              endorsement, or
              technical validation.
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          width:
            'min(1220px, calc(100% - 40px))',
          margin:
            '0 auto',
          padding:
            '30px 0 88px',
        }}
      >
        <div
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'minmax(0, 1fr)',
            gap: 24,
          }}
        >
          <ProfileSection
            eyebrow="Profile Overview"
            title="What entered the public record"
            accent
          >
            <TextSection
              value={
                profile.public_summary
              }
            />
          </ProfileSection>

          <ProfileSection
            eyebrow="People & Stewardship"
            title="Who they are"
          >
            <TextSection
              value={
                profile.who_they_are_markdown
              }
            />
          </ProfileSection>

          <ProfileSection
            eyebrow="Architecture"
            title="What they are building"
          >
            <TextSection
              value={
                profile.what_they_are_building_markdown
              }
            />
          </ProfileSection>

          <ProfileSection
            eyebrow="Registered Declaration"
            title="What they declared"
          >
            <TextSection
              value={
                profile.what_they_declared_markdown
              }
            />
          </ProfileSection>

          <ProfileSection
            eyebrow="TA-14 Institutional View"
            title="Why TA-14 is paying attention"
            accent
          >
            <TextSection
              value={
                profile.why_ta14_is_paying_attention_markdown
              }
            />
          </ProfileSection>

          <ProfileSection
            eyebrow="Registration Boundary"
            title="What registration means"
          >
            <TextSection
              value={
                profile.registration_meaning_markdown
              }
            />
          </ProfileSection>

          <ProfileSection
            eyebrow="Governed Continuation"
            title="Work that may follow"
          >
            <TextSection
              value={
                profile.governed_work_markdown
              }
            />

            {relatedDemonstrations.length >
            0 ? (
              <div
                style={{
                  marginTop:
                    28,
                  paddingTop:
                    22,
                  borderTop:
                    '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <DataLabel>
                  Related
                  Demonstration
                  Records
                </DataLabel>

                <div
                  style={{
                    display:
                      'flex',
                    gap: 9,
                    flexWrap:
                      'wrap',
                    marginTop:
                      10,
                  }}
                >
                  {relatedDemonstrations.map(
                    (
                      identifier,
                    ) => (
                      <StatusPill
                        key={
                          identifier
                        }
                      >
                        {
                          identifier
                        }
                      </StatusPill>
                    ),
                  )}
                </div>
              </div>
            ) : null}
          </ProfileSection>

          <ProfileSection
            eyebrow="TA-14 Commentary"
            title="Why this profile matters"
            accent
          >
            <TextSection
              value={
                profile.ta14_commentary_markdown
              }
            />
          </ProfileSection>
        </div>
      </section>

      <section
        style={{
          borderTop:
            '1px solid rgba(213, 167, 75, 0.18)',
          borderBottom:
            '1px solid rgba(255,255,255,0.06)',
          background:
            'linear-gradient(180deg, rgba(2,9,17,0.18), rgba(0,0,0,0.28))',
        }}
      >
        <div
          style={{
            width:
              'min(1220px, calc(100% - 40px))',
            margin:
              '0 auto',
            padding:
              '60px 0',
            display:
              'grid',
            gridTemplateColumns:
              'minmax(0, 1.2fr) minmax(300px, 0.8fr)',
            gap: 38,
          }}
        >
          <div>
            <SectionEyebrow>
              Registered
              Institutional
              Baseline
            </SectionEyebrow>

            <h2
              style={{
                margin:
                  '0 0 20px',
                color:
                  '#f2f6f9',
                fontSize:
                  'clamp(31px, 4vw, 49px)',
                lineHeight:
                  1.05,
                letterSpacing:
                  '-0.035em',
              }}
            >
              The profile does not
              replace the Registry
              record.
            </h2>

            <p
              style={{
                margin: 0,
                maxWidth:
                  780,
                color:
                  '#9db2c5',
                fontSize: 17,
                lineHeight:
                  1.8,
              }}
            >
              The Registry
              preserves the
              attributable
              declaration. This
              Governance Profile
              is the TA-14
              Authority&apos;s
              public
              institutional
              commentary about
              what entered that
              record and why the
              architecture may be
              significant.
            </p>
          </div>

          <div
            style={{
              border:
                '1px solid rgba(213, 167, 75, 0.24)',
              borderRadius:
                22,
              background:
                'rgba(21, 18, 11, 0.48)',
              padding: 26,
            }}
          >
            <SectionEyebrow>
              Publication Boundary
            </SectionEyebrow>

            <p
              style={{
                margin: 0,
                color:
                  '#c3d0dc',
                fontSize: 15,
                lineHeight:
                  1.75,
              }}
            >
              {profile.publication_boundary ??
                'Registration is not certification, endorsement, legal validation, regulatory approval, ownership adjudication, or proof of technical performance.'}
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          width:
            'min(1220px, calc(100% - 40px))',
          margin:
            '0 auto',
          padding:
            '62px 0',
        }}
      >
        <div
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'minmax(0, 1fr) minmax(300px, 0.6fr)',
            gap: 36,
          }}
        >
          <div>
            <SectionEyebrow>
              Public References
            </SectionEyebrow>

            <h2
              style={{
                margin:
                  '0 0 24px',
                fontSize:
                  'clamp(29px, 4vw, 44px)',
                letterSpacing:
                  '-0.03em',
              }}
            >
              Continue into the
              source record.
            </h2>

            <div
              style={{
                display:
                  'flex',
                gap: 12,
                flexWrap:
                  'wrap',
              }}
            >
              <ArrowLink
                href={`/workspace/ai-governance/registry/records/${profile.registry_identifier}`}
                primary
              >
                Permanent Registry
                Record →
              </ArrowLink>

              {profile.primary_website ? (
                <ExternalButton
                  href={
                    profile.primary_website
                  }
                >
                  Official
                  Architecture Site
                </ExternalButton>
              ) : null}

              {externalLinks.map(
                (
                  link,
                ) => (
                  <ExternalButton
                    key={`${link.label}-${link.url}`}
                    href={
                      link.url
                    }
                  >
                    {link.label}
                  </ExternalButton>
                ),
              )}
            </div>
          </div>

          <aside
            style={{
              borderLeft:
                '1px solid rgba(255,255,255,0.07)',
              paddingLeft:
                28,
            }}
          >
            <RecordData
              label="Profile Published"
              value={formatDateTime(
                profile.published_at,
              )}
            />

            <RecordData
              label="Profile Updated"
              value={formatDateTime(
                profile.updated_at,
              )}
            />

            <RecordData
              label="Claimed Establishment"
              value={formatDate(
                profile.claimed_establishment_date,
              )}
            />
          </aside>
        </div>
      </section>

      {tags.length >
      0 ? (
        <section
          style={{
            borderTop:
              '1px solid rgba(255,255,255,0.055)',
          }}
        >
          <div
            style={{
              width:
                'min(1220px, calc(100% - 40px))',
              margin:
                '0 auto',
              padding:
                '42px 0',
            }}
          >
            <SectionEyebrow>
              Profile Tags
            </SectionEyebrow>

            <div
              style={{
                display:
                  'flex',
                flexWrap:
                  'wrap',
                gap: 10,
              }}
            >
              {tags.map(
                (
                  tag,
                ) => (
                  <span
                    key={tag}
                    style={{
                      display:
                        'inline-flex',
                      alignItems:
                        'center',
                      minHeight:
                        34,
                      padding:
                        '0 12px',
                      border:
                        '1px solid rgba(103, 157, 202, 0.22)',
                      borderRadius:
                        999,
                      background:
                        'rgba(64, 124, 174, 0.08)',
                      color:
                        '#a9c6de',
                      fontSize:
                        12,
                    }}
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>
      ) : null}

      {relatedRegistryIdentifiers.length >
      0 ? (
        <section
          style={{
            borderTop:
              '1px solid rgba(255,255,255,0.055)',
          }}
        >
          <div
            style={{
              width:
                'min(1220px, calc(100% - 40px))',
              margin:
                '0 auto',
              padding:
                '42px 0',
            }}
          >
            <SectionEyebrow>
              Related Registry
              Records
            </SectionEyebrow>

            <div
              style={{
                display:
                  'flex',
                gap: 10,
                flexWrap:
                  'wrap',
              }}
            >
              {relatedRegistryIdentifiers.map(
                (
                  identifier,
                ) => (
                  <Link
                    key={
                      identifier
                    }
                    href={`/workspace/ai-governance/registry/records/${identifier}`}
                    style={{
                      display:
                        'inline-flex',
                      alignItems:
                        'center',
                      minHeight:
                        38,
                      padding:
                        '0 13px',
                      border:
                        '1px solid rgba(213,167,75,0.25)',
                      borderRadius:
                        10,
                      background:
                        'rgba(213,167,75,0.06)',
                      color:
                        '#e2ba67',
                      textDecoration:
                        'none',
                      fontSize:
                        13,
                      fontWeight:
                        700,
                    }}
                  >
                    {
                      identifier
                    }
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>
      ) : null}

      {profile.non_claims ? (
        <section
          style={{
            borderTop:
              '1px solid rgba(213, 167, 75, 0.15)',
            background:
              'rgba(29, 22, 8, 0.25)',
          }}
        >
          <div
            style={{
              width:
                'min(1220px, calc(100% - 40px))',
              margin:
                '0 auto',
              padding:
                '44px 0',
            }}
          >
            <SectionEyebrow>
              Explicit Non-Claims
            </SectionEyebrow>

            <p
              style={{
                margin: 0,
                maxWidth:
                  980,
                color:
                  '#b8c7d4',
                fontSize: 15,
                lineHeight:
                  1.8,
              }}
            >
              {
                profile.non_claims
              }
            </p>
          </div>
        </section>
      ) : null}

      <section
        style={{
          borderTop:
            '1px solid rgba(255,255,255,0.06)',
          background:
            'linear-gradient(180deg, rgba(5,14,25,0.72), rgba(1,6,12,0.96))',
        }}
      >
        <div
          style={{
            width:
              'min(1220px, calc(100% - 40px))',
            margin:
              '0 auto',
            padding:
              '66px 0 74px',
            display:
              'grid',
            gridTemplateColumns:
              'minmax(0, 1.25fr) minmax(280px, 0.75fr)',
            gap: 38,
            alignItems:
              'center',
          }}
        >
          <div>
            <SectionEyebrow>
              Enter the Public
              Record
            </SectionEyebrow>

            <h2
              style={{
                margin: 0,
                maxWidth:
                  800,
                fontSize:
                  'clamp(33px, 4.8vw, 58px)',
                lineHeight:
                  1.02,
                letterSpacing:
                  '-0.04em',
              }}
            >
              Declare it.
              <br />
              Bound it.
              <br />
              Evidence it.
              <br />
              Register it.
            </h2>

            <p
              style={{
                margin:
                  '24px 0 0',
                maxWidth:
                  760,
                color:
                  '#93aabd',
                fontSize: 16,
                lineHeight:
                  1.8,
              }}
            >
              TA-14 Governance
              Profiles begin with
              an attributable
              Registry record.
              Independent
              governance
              architectures keep
              their own identity,
              claims, boundaries,
              stewardship, and
              evidence.
            </p>
          </div>

          <div
            style={{
              display:
                'flex',
              flexDirection:
                'column',
              gap: 12,
            }}
          >
            <ArrowLink
              href="/workspace/ai-governance/registry/register"
              primary
            >
              Register a Governance
              Architecture →
            </ArrowLink>

            <ArrowLink
              href="/workspace/ai-governance/registry/profiles"
            >
              Browse Governance
              Profiles
            </ArrowLink>

            <ArrowLink
              href="/workspace/ai-governance/registry/directory"
            >
              Browse Public
              Registry
            </ArrowLink>
          </div>
        </div>
      </section>

      <footer
        style={{
          borderTop:
            '1px solid rgba(213, 167, 75, 0.18)',
          padding:
            '36px 20px 44px',
          textAlign:
            'center',
          background:
            '#01050a',
        }}
      >
        <div
          style={{
            color:
              '#c89d49',
            fontWeight:
              800,
            letterSpacing:
              '0.17em',
            textTransform:
              'uppercase',
            fontSize: 12,
          }}
        >
          TA-14 Authority
          Governance
          Institution
        </div>

        <div
          style={{
            marginTop: 9,
            color:
              '#667c90',
            fontSize: 12,
            letterSpacing:
              '0.06em',
          }}
        >
          No admissible
          evidence. No
          admissible execution.
        </div>
      </footer>
    </main>
  );
}
