import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

import { listPublishedGovernedArtifacts } from '../../../../../lib/governed-artifacts/public-repository';

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
  profile_image_url: string | null;
  tags: string[] | null;
  is_featured: boolean;
  editorial_priority: number;
  publication_boundary: string | null;
  published_at: string | null;
};

type PublicRegistryRecord = {
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

type ShowcaseGovernance = {
  registryIdentifier: string;
  name: string;
  shortName: string | null;
  version: string | null;
  category: string | null;
  steward: string | null;
  registeredAt: string | null;
  summary: string | null;
  profile: GovernanceProfile | null;
  artifactCount: number;
  artifactTypes: string[];
  demonstrationCount: number;
  evidenceObjectCount: number;
  latestArtifactAt: string | null;
};

function createSupabaseClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return createServerClient(url, anonKey, {
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
          // Public server-rendered pages only require readable cookies.
        }
      },
    },
  });
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'Record date pending';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function compact(value: string | null | undefined, max = 230): string {
  const clean = (value ?? '').replace(/[*#_`>]/g, '').replace(/\s+/g, ' ').trim();
  if (!clean) return 'A registered governance architecture in the TA-14 AI Governance Exchange public record.';
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

function isDemonstration(type: string): boolean {
  const normalized = type.toLowerCase();
  return normalized.includes('demonstration') || normalized.includes('founding');
}

function recordDepthLabel(item: ShowcaseGovernance): string {
  if (item.artifactCount >= 10) return 'Deep Governed Record';
  if (item.artifactCount >= 5) return 'Expanding Governed Record';
  if (item.artifactCount >= 1) return 'Active Governed Record';
  return 'Registered Foundation';
}

function recordDepthWidth(item: ShowcaseGovernance): string {
  if (item.artifactCount >= 10) return '100%';
  if (item.artifactCount >= 5) return '82%';
  if (item.artifactCount >= 1) return '62%';
  return '30%';
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'TA-14 Governance Showcase | AI Governance Exchange',
  description:
    'Explore independent governance architectures, founding demonstrations, governed artifacts, evidence, and public chronology in the TA-14 AI Governance Exchange.',
};

export default async function GovernanceShowcasePage() {
  const cookieStore = await cookies();
  const supabase = createSupabaseClient(cookieStore);

  const [{ data: profileData }, registryResult, artifacts] = await Promise.all([
    supabase
      .from('ta14_governance_profiles_public_v1')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('editorial_priority', { ascending: false })
      .order('profile_number', { ascending: true }),
    supabase.rpc('ta14_registry_public_directory_v1'),
    listPublishedGovernedArtifacts(),
  ]);

  const profiles = (profileData ?? []) as GovernanceProfile[];
  const registryRecords = Array.isArray(registryResult.data)
    ? (registryResult.data as PublicRegistryRecord[]).filter(
        (record) => record.status?.toLowerCase() === 'registered',
      )
    : [];

  const profileByRegistry = new Map(
    profiles.map((profile) => [profile.registry_identifier.toUpperCase(), profile]),
  );

  const showcase: ShowcaseGovernance[] = registryRecords.map((record) => {
    const registryIdentifier = record.registry_identifier.toUpperCase();
    const profile = profileByRegistry.get(registryIdentifier) ?? null;
    const governedArtifacts = artifacts.filter(
      (artifact) => artifact.governance_registry_identifier?.toUpperCase() === registryIdentifier,
    );
    const artifactTypes = Array.from(new Set(governedArtifacts.map((artifact) => artifact.artifact_type)));
    const evidenceObjectCount = new Set(
      governedArtifacts.flatMap((artifact) => artifact.evidence_object_identifiers ?? []),
    ).size;

    return {
      registryIdentifier,
      name: profile?.governance_name ?? record.governance_name,
      shortName: profile?.short_name ?? record.short_name ?? null,
      version: profile?.governance_version ?? record.version ?? null,
      category: profile?.governance_category ?? record.category ?? null,
      steward: profile?.steward_name ?? record.steward ?? null,
      registeredAt: profile?.registered_at ?? record.registered_at ?? null,
      summary: profile?.profile_deck ?? profile?.public_summary ?? record.summary ?? null,
      profile,
      artifactCount: governedArtifacts.length,
      artifactTypes,
      demonstrationCount: governedArtifacts.filter((artifact) => isDemonstration(artifact.artifact_type)).length,
      evidenceObjectCount,
      latestArtifactAt: governedArtifacts[0]?.registered_at ?? null,
    };
  });

  showcase.sort((a, b) => {
    const featuredDifference = Number(Boolean(b.profile?.is_featured)) - Number(Boolean(a.profile?.is_featured));
    if (featuredDifference !== 0) return featuredDifference;
    if (b.artifactCount !== a.artifactCount) return b.artifactCount - a.artifactCount;
    return a.name.localeCompare(b.name);
  });

  const totalArtifacts = showcase.reduce((sum, item) => sum + item.artifactCount, 0);
  const totalDemonstrations = showcase.reduce((sum, item) => sum + item.demonstrationCount, 0);
  const totalEvidenceObjects = showcase.reduce((sum, item) => sum + item.evidenceObjectCount, 0);
  const activeBuilders = showcase.filter((item) => item.artifactCount > 0).length;

  const recentArtifacts = artifacts.slice(0, 8);

  return (
    <main className="showcase-shell">
      <style>{`
        * { box-sizing: border-box; }
        .showcase-shell {
          min-height: 100vh;
          color: #f7f9fc;
          background:
            radial-gradient(circle at 16% 4%, rgba(47, 115, 184, .25), transparent 28%),
            radial-gradient(circle at 84% 10%, rgba(222, 171, 71, .15), transparent 25%),
            radial-gradient(circle at 52% 60%, rgba(36, 89, 145, .10), transparent 38%),
            linear-gradient(180deg, #01050b 0%, #03101d 44%, #01050a 100%);
          overflow: hidden;
        }
        .stars, .stars::before, .stars::after {
          position: absolute; inset: 0; content: ''; pointer-events: none;
          background-image:
            radial-gradient(circle, rgba(255,255,255,.95) 0 1px, transparent 1.4px),
            radial-gradient(circle, rgba(235,195,108,.85) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(133,190,235,.75) 0 1px, transparent 1.4px);
          background-size: 157px 157px, 241px 241px, 311px 311px;
          background-position: 21px 42px, 97px 13px, 181px 109px;
          opacity: .35;
        }
        .stars::before { transform: translate3d(40px, 80px, 0); opacity: .5; }
        .stars::after { transform: translate3d(-70px, 150px, 0); opacity: .25; }
        .wrap { width: min(1240px, calc(100% - 40px)); margin: 0 auto; position: relative; z-index: 2; }
        .hero { position: relative; padding: 38px 0 88px; border-bottom: 1px solid rgba(222,171,71,.22); }
        .nav { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 70px; font-size: 13px; }
        .nav a { color: #b9cee2; text-decoration: none; }
        .nav strong { color: #e8bd67; letter-spacing: .08em; text-transform: uppercase; }
        .eyebrow { display: inline-flex; gap: 10px; align-items: center; padding: 8px 13px; border: 1px solid rgba(224,174,74,.34); border-radius: 999px; background: rgba(224,174,74,.07); color: #efc66f; text-transform: uppercase; letter-spacing: .13em; font-size: 11px; font-weight: 800; }
        .hero h1 { max-width: 1000px; margin: 25px 0 0; font-size: clamp(54px, 9vw, 112px); line-height: .9; letter-spacing: -.055em; }
        .hero h1 span { display: block; background: linear-gradient(90deg,#fff 0%,#dceafb 46%,#e9bd65 100%); -webkit-background-clip: text; color: transparent; }
        .hero-copy { max-width: 900px; margin: 32px 0 0; color: #afc2d5; font-size: clamp(19px,2.3vw,27px); line-height: 1.5; }
        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 32px; }
        .button { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 20px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 14px; letter-spacing: .02em; }
        .button-primary { color: #07101a; background: linear-gradient(135deg,#f4d38b,#d7a64b); box-shadow: 0 10px 38px rgba(214,164,70,.18); }
        .button-secondary { color: #dceafa; border: 1px solid rgba(130,181,224,.25); background: rgba(8,26,44,.68); }
        .metrics { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 14px; margin-top: -32px; }
        .metric { padding: 22px; border: 1px solid rgba(116,168,211,.18); border-radius: 18px; background: rgba(5,18,31,.92); box-shadow: 0 18px 60px rgba(0,0,0,.2); }
        .metric strong { display: block; font-size: 34px; letter-spacing: -.04em; color: #f1c970; }
        .metric span { color: #879db1; font-size: 12px; text-transform: uppercase; letter-spacing: .11em; font-weight: 800; }
        .section { padding: 78px 0; }
        .section-head { display: flex; justify-content: space-between; gap: 28px; align-items: end; margin-bottom: 30px; }
        .kicker { color: #dcae55; text-transform: uppercase; letter-spacing: .14em; font-size: 11px; font-weight: 900; }
        .section h2 { margin: 10px 0 0; font-size: clamp(35px,5vw,58px); line-height: 1; letter-spacing: -.04em; }
        .section-lead { max-width: 600px; color: #8fa5ba; line-height: 1.7; }
        .grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 22px; }
        .card { position: relative; overflow: hidden; min-height: 430px; padding: 28px; border: 1px solid rgba(113,166,211,.18); border-radius: 24px; background: linear-gradient(155deg,rgba(12,34,56,.92),rgba(3,12,22,.95)); box-shadow: 0 28px 80px rgba(0,0,0,.2); }
        .card::before { content: ''; position: absolute; width: 260px; height: 260px; border-radius: 50%; right: -120px; top: -130px; background: radial-gradient(circle,rgba(225,177,80,.16),transparent 68%); }
        .card-featured { border-color: rgba(226,177,79,.35); box-shadow: 0 30px 100px rgba(198,146,48,.08); }
        .card-top { display: flex; justify-content: space-between; gap: 16px; align-items: start; position: relative; z-index: 1; }
        .identity { color: #7fa9cf; font-size: 11px; font-weight: 900; letter-spacing: .11em; text-transform: uppercase; }
        .status { padding: 7px 10px; border: 1px solid rgba(226,177,79,.3); border-radius: 999px; color: #eac36e; background: rgba(226,177,79,.07); font-size: 10px; text-transform: uppercase; letter-spacing: .1em; font-weight: 900; white-space: nowrap; }
        .card h3 { position: relative; z-index: 1; margin: 32px 0 8px; max-width: 680px; font-size: clamp(28px,4vw,44px); line-height: 1; letter-spacing: -.04em; }
        .subtitle { color: #d7b665; font-size: 14px; font-weight: 800; }
        .summary { position: relative; z-index: 1; margin: 18px 0 24px; color: #a7bbcd; line-height: 1.65; max-width: 720px; }
        .milestones { display: flex; flex-wrap: wrap; gap: 8px; margin: 20px 0; }
        .milestone { padding: 7px 10px; border-radius: 9px; border: 1px solid rgba(114,169,215,.16); background: rgba(113,168,213,.06); color: #b8d2e8; font-size: 11px; font-weight: 800; }
        .milestone-gold { border-color: rgba(224,174,74,.28); color: #efc872; background: rgba(224,174,74,.07); }
        .depth { margin-top: 26px; }
        .depth-row { display: flex; justify-content: space-between; gap: 12px; color: #8499ad; font-size: 11px; text-transform: uppercase; letter-spacing: .09em; font-weight: 800; }
        .depth-track { height: 5px; margin-top: 9px; border-radius: 999px; background: rgba(255,255,255,.06); overflow: hidden; }
        .depth-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg,#4d8cc0,#e2b252); box-shadow: 0 0 22px rgba(226,178,82,.3); }
        .facts { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px; margin: 25px 0; }
        .fact { padding: 12px; border-radius: 12px; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.05); }
        .fact strong { display: block; color: #f1d28e; font-size: 19px; }
        .fact span { color: #71869a; font-size: 10px; text-transform: uppercase; letter-spacing: .08em; }
        .card-actions { display: flex; gap: 10px; flex-wrap: wrap; position: relative; z-index: 1; }
        .activity { border-top: 1px solid rgba(113,166,211,.12); border-bottom: 1px solid rgba(113,166,211,.12); background: rgba(2,10,18,.48); }
        .activity-list { display: grid; gap: 10px; }
        .activity-item { display: grid; grid-template-columns: 14px 1fr auto; gap: 15px; align-items: center; padding: 18px 20px; border: 1px solid rgba(115,169,213,.12); border-radius: 15px; background: rgba(8,24,40,.54); }
        .spark { width: 8px; height: 8px; border-radius: 50%; background: #e5b85e; box-shadow: 0 0 18px rgba(229,184,94,.75); }
        .activity-item strong { display: block; color: #dce9f5; }
        .activity-item small { color: #72899e; }
        .activity-date { color: #8298ab; font-size: 12px; white-space: nowrap; }
        .invitation { padding: 90px 0 110px; text-align: center; }
        .invitation-box { position: relative; overflow: hidden; padding: 62px 28px; border: 1px solid rgba(225,177,78,.27); border-radius: 28px; background: radial-gradient(circle at 50% 0%,rgba(222,172,72,.12),transparent 42%),rgba(5,18,31,.74); }
        .invitation h2 { max-width: 850px; margin: 15px auto; font-size: clamp(42px,7vw,76px); line-height: .95; letter-spacing: -.05em; }
        .invitation p { max-width: 760px; margin: 24px auto 0; color: #9eb3c6; font-size: 18px; line-height: 1.7; }
        .boundary { max-width: 900px; margin: 32px auto 0; color: #667d91; font-size: 12px; line-height: 1.7; }
        @media (max-width: 850px) {
          .metrics { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .grid { grid-template-columns: 1fr; }
          .section-head { display: block; }
          .section-lead { margin-top: 18px; }
        }
        @media (max-width: 560px) {
          .wrap { width: min(100% - 24px,1240px); }
          .metrics { grid-template-columns: 1fr 1fr; }
          .metric { padding: 17px; }
          .card { padding: 22px; }
          .facts { grid-template-columns: 1fr 1fr 1fr; }
          .activity-item { grid-template-columns: 12px 1fr; }
          .activity-date { grid-column: 2; }
        }
      `}</style>

      <section className="hero">
        <div className="stars" />
        <div className="wrap">
          <nav className="nav">
            <Link href="/workspace/ai-governance">AI Governance Exchange</Link>
            <span>/</span>
            <Link href="/workspace/ai-governance/registry">Registry</Link>
            <span>/</span>
            <strong>Governance Showcase</strong>
          </nav>

          <div className="eyebrow">✦ TA-14 AI Governance Exchange · Living Public Record</div>
          <h1>
            Governances that
            <span>entered the record.</span>
          </h1>
          <p className="hero-copy">
            Independent governance architectures, their founding declarations, demonstrations,
            governed artifacts, evidence, reviews, and evolution — preserved as growing public
            records without collapsing their identities into TA-14.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/workspace/ai-governance/registry/register">
              Put Your Governance Into the Record →
            </Link>
            <Link className="button button-secondary" href="/workspace/ai-governance/registry">
              View Authoritative Registry
            </Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="metrics">
          <div className="metric"><strong>{showcase.length}</strong><span>Registered Governances</span></div>
          <div className="metric"><strong>{totalArtifacts}</strong><span>Governed Artifacts</span></div>
          <div className="metric"><strong>{totalDemonstrations}</strong><span>Demonstrations</span></div>
          <div className="metric"><strong>{totalEvidenceObjects}</strong><span>Evidence Objects</span></div>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="kicker">Governance Constellations</div>
              <h2>Every record can grow.</h2>
            </div>
            <p className="section-lead">
              Registration establishes the foundation. Demonstrations, artifacts, evidence,
              reviews, and version evolution deepen the public record. The Showcase reflects that
              governed activity without turning activity volume into certification or rank.
            </p>
          </div>

          <div className="grid">
            {showcase.map((item) => (
              <article
                className={`card ${item.profile?.is_featured ? 'card-featured' : ''}`}
                key={item.registryIdentifier}
              >
                <div className="card-top">
                  <div className="identity">{item.registryIdentifier}</div>
                  <div className="status">✦ {recordDepthLabel(item)}</div>
                </div>

                <h3>{item.name}</h3>
                <div className="subtitle">
                  {item.profile?.profile_subtitle ?? item.shortName ?? item.category ?? 'Registered Governance'}
                </div>
                <p className="summary">{compact(item.summary)}</p>

                <div className="milestones">
                  <span className="milestone milestone-gold">Registered Foundation</span>
                  {item.demonstrationCount > 0 ? (
                    <span className="milestone milestone-gold">✦ Founding / Governed Demonstration</span>
                  ) : null}
                  {item.artifactCount > 0 ? (
                    <span className="milestone">{item.artifactCount} Governed Artifact{item.artifactCount === 1 ? '' : 's'}</span>
                  ) : null}
                  {item.evidenceObjectCount > 0 ? (
                    <span className="milestone">{item.evidenceObjectCount} Evidence Object{item.evidenceObjectCount === 1 ? '' : 's'}</span>
                  ) : null}
                  {item.profile?.is_featured ? <span className="milestone">Featured Institutional Profile</span> : null}
                </div>

                <div className="depth">
                  <div className="depth-row">
                    <span>Governed Record Depth</span>
                    <span>{recordDepthLabel(item)}</span>
                  </div>
                  <div className="depth-track">
                    <div className="depth-fill" style={{ width: recordDepthWidth(item) }} />
                  </div>
                </div>

                <div className="facts">
                  <div className="fact"><strong>{item.artifactCount}</strong><span>Artifacts</span></div>
                  <div className="fact"><strong>{item.demonstrationCount}</strong><span>Demos</span></div>
                  <div className="fact"><strong>{item.evidenceObjectCount}</strong><span>Evidence</span></div>
                </div>

                <div className="card-actions">
                  {item.profile ? (
                    <Link className="button button-primary" href={`/workspace/ai-governance/registry/profiles/${item.profile.slug}`}>
                      Explore Governance →
                    </Link>
                  ) : (
                    <Link className="button button-primary" href="/workspace/ai-governance/registry">
                      View Registry Record →
                    </Link>
                  )}
                  {item.profile?.primary_website ? (
                    <a className="button button-secondary" href={item.profile.primary_website} target="_blank" rel="noreferrer">
                      Governance Website ↗
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section activity">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="kicker">Recently Entered Into the Record</div>
              <h2>The Exchange is alive.</h2>
            </div>
            <p className="section-lead">
              Governed work should never disappear into a file list. Each public artifact becomes
              another dated point in the architecture's institutional chronology.
            </p>
          </div>

          <div className="activity-list">
            {recentArtifacts.length > 0 ? recentArtifacts.map((artifact) => (
              <div className="activity-item" key={artifact.artifact_identifier}>
                <span className="spark" />
                <div>
                  <strong>{artifact.governance_name} · {artifact.title}</strong>
                  <small>{artifact.artifact_identifier} · {artifact.artifact_type}</small>
                </div>
                <span className="activity-date">{formatDate(artifact.registered_at)}</span>
              </div>
            )) : (
              <div className="activity-item">
                <span className="spark" />
                <div>
                  <strong>Governed artifact chronology is ready.</strong>
                  <small>Published artifacts will appear here automatically as they enter the record.</small>
                </div>
                <span className="activity-date">Live public layer</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="invitation">
        <div className="wrap">
          <div className="invitation-box">
            <div className="stars" />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div className="kicker">Your Architecture Has A History. Preserve It.</div>
              <h2>Put your governance into the record.</h2>
              <p>
                Independent architectures retain their identities. Registration creates a governed
                public foundation. Every authorized demonstration, artifact, review, evidence object,
                and version can deepen the record from there.
              </p>
              <div className="hero-actions" style={{ justifyContent: 'center' }}>
                <Link className="button button-primary" href="/workspace/ai-governance/registry/register">
                  Register Your Governance →
                </Link>
                <Link className="button button-secondary" href="/workspace/ai-governance/registry/profiles">
                  Browse Institutional Profiles
                </Link>
              </div>
              <div className="boundary">
                Registration establishes a governed public record. It does not constitute TA-14
                certification, endorsement, technical validation, legal approval, or a finding of
                fitness for deployment. Governed record depth reflects preserved public activity,
                not rank or comparative superiority.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingBottom: 44, color: '#5f7589', fontSize: 12 }}>
        {activeBuilders} of {showcase.length} registered governance records currently have published governed artifacts linked through the public artifact layer.
      </div>
    </main>
  );
}
