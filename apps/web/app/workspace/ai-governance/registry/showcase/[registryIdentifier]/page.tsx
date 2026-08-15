import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

import { listPublishedGovernedArtifacts } from '../../../../../../lib/governed-artifacts/public-repository';

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

type PublicRegistryRecord = {
  registry_identifier: string;
  governance_name: string;
  short_name?: string | null;
  version?: string | null;
  category?: string | null;
  steward?: string | null;
  registered_at?: string | null;
  status: string;
  visibility?: string | null;
  is_published?: boolean | null;
  summary?: string | null;
  formal_claims?: string | null;
  explicit_non_claims?: string | null;
  known_limitations?: string | null;
  regulatory_scope?: string | null;
  evidence_count?: number | null;
  dispute_count?: number | null;
};

type ExternalLink = { label: string; url: string };

type Props = {
  params: Promise<{ registryIdentifier: string }>;
};

function createSupabaseClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase environment variables are not configured.');

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Public server-rendered pages only require readable cookies.
        }
      },
    },
  });
}

function clean(value: string | null | undefined): string {
  return (value ?? '').trim();
}

function paragraphs(value: string | null | undefined): string[] {
  return clean(value).split(/\n\s*\n/g).map((item) => item.trim()).filter(Boolean);
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'Not recorded';
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(value));
}

function isDemonstration(type: string): boolean {
  const normalized = type.toLowerCase();
  return normalized.includes('demonstration') || normalized.includes('founding');
}

function externalLinks(value: unknown): ExternalLink[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const candidate = item as { label?: unknown; url?: unknown };
    if (typeof candidate.label !== 'string' || typeof candidate.url !== 'string') return [];
    const label = candidate.label.trim();
    const url = candidate.url.trim();
    return label && url ? [{ label, url }] : [];
  });
}

function artifactHref(identifier: string, explicit: string | null): string {
  return explicit || `/workspace/ai-governance/artifacts/governed/${encodeURIComponent(identifier)}`;
}

function SectionText({ value }: { value: string | null | undefined }) {
  const items = paragraphs(value);
  if (!items.length) return <p className="muted">No additional public commentary has been published for this section.</p>;
  return <>{items.map((item, index) => <p key={`${index}-${item.slice(0, 16)}`}>{item}</p>)}</>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { registryIdentifier } = await params;
  return {
    title: `${decodeURIComponent(registryIdentifier)} | TA-14 Governance Showcase`,
    description: 'Governance identity, governed artifacts, demonstrations, evidence, chronology, and public record depth in the TA-14 AI Governance Exchange.',
  };
}

export default async function GovernanceShowcaseDetailPage({ params }: Props) {
  const { registryIdentifier: encodedIdentifier } = await params;
  const registryIdentifier = decodeURIComponent(encodedIdentifier).toUpperCase();
  const cookieStore = await cookies();
  const supabase = createSupabaseClient(cookieStore);

  const [directoryResult, profileResult, artifacts] = await Promise.all([
    supabase.rpc('ta14_registry_public_directory_v1'),
    supabase.from('ta14_governance_profiles_public_v1').select('*').eq('registry_identifier', registryIdentifier).maybeSingle(),
    listPublishedGovernedArtifacts(),
  ]);

  const directory = Array.isArray(directoryResult.data) ? directoryResult.data as PublicRegistryRecord[] : [];
  const record = directory.find((candidate) => candidate.registry_identifier?.toUpperCase() === registryIdentifier && candidate.status?.toLowerCase() === 'registered');
  if (!record) notFound();

  const profile = (profileResult.data ?? null) as GovernanceProfile | null;
  const governedArtifacts = artifacts
    .filter((artifact) => artifact.governance_registry_identifier?.toUpperCase() === registryIdentifier)
    .sort((a, b) => new Date(b.registered_at).getTime() - new Date(a.registered_at).getTime());

  const demonstrations = governedArtifacts.filter((artifact) => isDemonstration(artifact.artifact_type));
  const evidenceObjects = Array.from(new Set(governedArtifacts.flatMap((artifact) => artifact.evidence_object_identifiers ?? [])));
  const artifactTypes = Array.from(new Set(governedArtifacts.map((artifact) => artifact.artifact_type)));
  const links = externalLinks(profile?.external_links);

  const name = profile?.governance_name || record.governance_name;
  const shortName = profile?.short_name || record.short_name || null;
  const version = profile?.governance_version || record.version || 'Not recorded';
  const steward = profile?.steward_name || record.steward || 'Not recorded';
  const category = profile?.governance_category || record.category || 'AI Governance';
  const summary = profile?.profile_deck || profile?.public_summary || record.summary || 'A registered governance architecture in the TA-14 AI Governance Exchange public record.';
  const primaryWebsite = profile?.primary_website || null;
  const founding = demonstrations[demonstrations.length - 1] ?? null;

  const milestones = [
    { label: 'Governance Registered', active: true },
    { label: 'Public Profile', active: Boolean(profile) },
    { label: 'Founding Demonstration', active: demonstrations.length > 0 },
    { label: 'Governed Artifact', active: governedArtifacts.length > 0 },
    { label: 'Evidence Series', active: evidenceObjects.length > 1 },
    { label: 'Expanding Record', active: governedArtifacts.length >= 5 },
  ];

  return (
    <main className="shell">
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .shell { min-height: 100vh; overflow: hidden; color: #f7f9fc; background: radial-gradient(circle at 17% 2%,rgba(42,108,176,.25),transparent 27%),radial-gradient(circle at 84% 8%,rgba(226,176,73,.16),transparent 26%),linear-gradient(180deg,#01050b 0%,#04111f 48%,#01050b 100%); }
        .wrap { width: min(1240px,calc(100% - 40px)); margin: 0 auto; position: relative; z-index: 2; }
        .hero { position: relative; padding: 36px 0 82px; border-bottom: 1px solid rgba(225,177,77,.24); overflow: hidden; }
        .stars,.stars:before,.stars:after { content:''; position:absolute; inset:0; pointer-events:none; background-image:radial-gradient(circle,rgba(255,255,255,.95) 0 1px,transparent 1.4px),radial-gradient(circle,rgba(235,194,105,.85) 0 1px,transparent 1.5px),radial-gradient(circle,rgba(127,184,232,.75) 0 1px,transparent 1.4px); background-size:149px 149px,229px 229px,313px 313px; opacity:.31; }
        .stars:before { transform:translate3d(70px,100px,0); opacity:.55; }
        .stars:after { transform:translate3d(-90px,190px,0); opacity:.25; }
        .orbit { position:absolute; right:-150px; top:-180px; width:620px; height:620px; border:1px solid rgba(109,165,211,.12); border-radius:50%; box-shadow:inset 0 0 90px rgba(62,121,174,.06); }
        .orbit:before,.orbit:after { content:''; position:absolute; border:1px solid rgba(225,177,77,.12); border-radius:50%; }
        .orbit:before { inset:80px; }.orbit:after { inset:170px; }
        .nav { display:flex; gap:11px; flex-wrap:wrap; align-items:center; margin-bottom:64px; color:#6f879d; font-size:13px; }
        .nav a { color:#b7cee3; text-decoration:none; }.nav strong { color:#edc36d; }
        .eyebrow { display:inline-flex; align-items:center; gap:10px; padding:8px 13px; border:1px solid rgba(225,177,77,.35); border-radius:999px; background:rgba(225,177,77,.07); color:#efc66e; font-size:11px; font-weight:900; letter-spacing:.13em; text-transform:uppercase; }
        .hero-grid { display:grid; grid-template-columns:minmax(0,1.5fr) minmax(320px,.6fr); gap:52px; align-items:end; }
        h1 { max-width:980px; margin:24px 0 12px; font-size:clamp(52px,8.5vw,108px); line-height:.9; letter-spacing:-.055em; }
        .subtitle { max-width:850px; margin-top:22px; color:#d8b868; font-size:clamp(18px,2vw,25px); font-weight:800; line-height:1.4; }
        .summary { max-width:900px; margin:24px 0 0; color:#aabfd2; font-size:clamp(17px,2vw,23px); line-height:1.65; }
        .identity-panel { padding:25px; border:1px solid rgba(225,177,77,.28); border-radius:22px; background:linear-gradient(160deg,rgba(26,27,26,.84),rgba(5,17,29,.92)); box-shadow:0 32px 90px rgba(0,0,0,.24); }
        .seal { width:72px; height:72px; border:1px solid rgba(236,193,103,.42); border-radius:50%; display:grid; place-items:center; color:#efc66d; font-size:28px; box-shadow:0 0 38px rgba(225,177,77,.12),inset 0 0 28px rgba(225,177,77,.08); }
        .id-label { margin-top:24px; color:#7894ad; font-size:10px; font-weight:900; letter-spacing:.13em; text-transform:uppercase; }
        .id-value { margin-top:6px; color:#f1d18d; font-size:17px; font-weight:900; overflow-wrap:anywhere; }
        .facts { display:grid; gap:12px; margin-top:18px; }.fact { padding-top:12px; border-top:1px solid rgba(255,255,255,.06); }.fact span { display:block; color:#6f879d; font-size:10px; text-transform:uppercase; letter-spacing:.1em; font-weight:900; }.fact strong { display:block; margin-top:5px; color:#dce9f6; font-size:14px; }
        .actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:30px; }.button { min-height:48px; padding:0 18px; display:inline-flex; align-items:center; justify-content:center; border-radius:12px; text-decoration:none; font-size:13px; font-weight:900; }.primary { color:#07111b; background:linear-gradient(135deg,#f3d187,#d8a94d); box-shadow:0 14px 38px rgba(218,170,74,.16); }.secondary { color:#dceafa; border:1px solid rgba(119,173,217,.24); background:rgba(8,26,44,.68); }
        .metric-band { margin-top:-32px; position:relative; z-index:4; }.metrics { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; }.metric { padding:21px; border:1px solid rgba(116,169,213,.17); border-radius:18px; background:rgba(5,18,31,.94); box-shadow:0 20px 60px rgba(0,0,0,.2); }.metric strong { display:block; color:#f0ca76; font-size:34px; letter-spacing:-.04em; }.metric span { color:#788fa4; font-size:10px; font-weight:900; letter-spacing:.1em; text-transform:uppercase; }
        .section { padding:78px 0; }.section + .section { border-top:1px solid rgba(112,165,210,.1); }.kicker { color:#dcae55; font-size:11px; font-weight:900; letter-spacing:.14em; text-transform:uppercase; }.section h2 { margin:10px 0 0; font-size:clamp(35px,5vw,58px); line-height:1; letter-spacing:-.04em; }.lead { max-width:760px; margin-top:18px; color:#8fa7bb; line-height:1.7; }.section-head { display:flex; align-items:end; justify-content:space-between; gap:28px; margin-bottom:30px; }
        .milestone-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; }.milestone { min-height:132px; padding:20px; border:1px solid rgba(114,166,210,.14); border-radius:18px; background:rgba(7,23,38,.58); }.milestone.active { border-color:rgba(225,177,77,.29); background:radial-gradient(circle at 100% 0%,rgba(225,177,77,.11),transparent 40%),rgba(8,24,39,.78); }.milestone .mark { color:#6c8499; font-size:20px; }.milestone.active .mark { color:#eac26b; text-shadow:0 0 18px rgba(234,194,107,.35); }.milestone strong { display:block; margin-top:18px; }.milestone small { display:block; margin-top:7px; color:#71899e; line-height:1.45; }
        .founding { position:relative; overflow:hidden; padding:34px; border:1px solid rgba(226,177,76,.34); border-radius:26px; background:radial-gradient(circle at 88% 12%,rgba(230,181,78,.16),transparent 31%),linear-gradient(150deg,rgba(27,29,26,.92),rgba(5,18,31,.94)); }.founding:after { content:'✦'; position:absolute; right:34px; top:20px; color:rgba(239,198,110,.32); font-size:86px; }.founding h3 { max-width:850px; margin:14px 0 10px; font-size:clamp(30px,4.5vw,54px); line-height:1; letter-spacing:-.04em; }.founding p { max-width:850px; color:#a8bbcc; line-height:1.7; }.founding-meta { display:flex; flex-wrap:wrap; gap:9px; margin-top:24px; }.chip { padding:8px 10px; border:1px solid rgba(225,177,77,.19); border-radius:999px; color:#dfbd74; background:rgba(225,177,77,.05); font-size:10px; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }
        .artifact-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }.artifact { position:relative; overflow:hidden; min-height:300px; padding:25px; border:1px solid rgba(112,166,211,.16); border-radius:20px; background:linear-gradient(155deg,rgba(10,31,51,.86),rgba(4,14,24,.92)); }.artifact:before { content:''; position:absolute; width:190px; height:190px; right:-100px; top:-100px; border:1px solid rgba(129,182,224,.11); border-radius:50%; }.artifact.demo { border-color:rgba(225,177,77,.29); }.artifact-type { color:#7da7ca; font-size:10px; font-weight:900; letter-spacing:.11em; text-transform:uppercase; }.artifact.demo .artifact-type { color:#e5b85e; }.artifact h3 { position:relative; margin:16px 0 10px; font-size:25px; line-height:1.12; letter-spacing:-.025em; }.artifact-id { color:#6e879d; font-size:11px; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; }.artifact p { color:#94aabd; line-height:1.6; }.artifact-meta { display:flex; gap:8px; flex-wrap:wrap; margin:20px 0; }.artifact-meta span { padding:6px 8px; border:1px solid rgba(255,255,255,.06); border-radius:8px; color:#718ba1; font-size:10px; }.artifact a { color:#efc56e; text-decoration:none; font-weight:900; font-size:13px; }
        .content-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; }.content-card { padding:27px; border:1px solid rgba(112,165,210,.14); border-radius:20px; background:rgba(7,22,37,.62); }.content-card h3 { margin:0 0 16px; color:#e7c476; font-size:20px; }.content-card p { color:#9fb4c6; line-height:1.72; }.muted { color:#71889d !important; }
        .timeline { display:grid; gap:0; }.time-row { display:grid; grid-template-columns:130px 20px 1fr; gap:18px; min-height:90px; }.time-date { color:#748b9f; font-size:12px; padding-top:4px; }.time-axis { position:relative; }.time-axis:before { content:''; position:absolute; left:9px; top:0; bottom:0; width:1px; background:rgba(116,169,213,.18); }.time-axis:after { content:''; position:absolute; left:5px; top:5px; width:9px; height:9px; border-radius:50%; background:#dfb257; box-shadow:0 0 16px rgba(223,178,87,.45); }.time-body { padding-bottom:26px; }.time-body strong { display:block; color:#dce8f3; }.time-body small { display:block; margin-top:5px; color:#7f96aa; line-height:1.5; }
        .invitation { padding:84px 0 110px; text-align:center; }.invitation-box { padding:58px 28px; border:1px solid rgba(225,177,77,.27); border-radius:28px; background:radial-gradient(circle at 50% 0%,rgba(225,177,77,.12),transparent 45%),rgba(5,18,31,.72); }.invitation h2 { max-width:850px; margin:14px auto; font-size:clamp(40px,6vw,72px); line-height:.96; letter-spacing:-.05em; }.invitation p { max-width:760px; margin:22px auto; color:#9bb0c3; font-size:18px; line-height:1.7; }.boundary { max-width:900px; margin:30px auto 0; color:#667e92; font-size:12px; line-height:1.7; }
        @media (max-width:900px) { .hero-grid,.content-grid,.artifact-grid { grid-template-columns:1fr; }.metrics { grid-template-columns:repeat(2,minmax(0,1fr)); }.milestone-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }.identity-panel { max-width:620px; }.section-head { display:block; }.lead { margin-top:16px; } }
        @media (max-width:580px) { .wrap { width:min(calc(100% - 24px),1240px); }.metrics,.milestone-grid { grid-template-columns:1fr 1fr; }.time-row { grid-template-columns:92px 18px 1fr; gap:10px; }.founding { padding:24px; }.identity-panel { padding:20px; } }
      `}</style>

      <section className="hero">
        <div className="stars" />
        <div className="orbit" />
        <div className="wrap">
          <nav className="nav">
            <Link href="/workspace/ai-governance">AI Governance Exchange</Link><span>/</span>
            <Link href="/workspace/ai-governance/registry/showcase">Governance Showcase</Link><span>/</span>
            <strong>{shortName || name}</strong>
          </nav>

          <div className="hero-grid">
            <div>
              <div className="eyebrow">✦ Registered Governance · Living Governed Record</div>
              <h1>{name}</h1>
              {profile?.profile_subtitle ? <div className="subtitle">{profile.profile_subtitle}</div> : null}
              <p className="summary">{summary}</p>
              <div className="actions">
                <Link className="button primary" href={`/workspace/ai-governance/registry/records/${encodeURIComponent(registryIdentifier)}`}>View Authoritative Registry Record →</Link>
                {primaryWebsite ? <a className="button secondary" href={primaryWebsite} target="_blank" rel="noreferrer">Visit Governance Website</a> : null}
                {profile?.slug ? <Link className="button secondary" href={`/workspace/ai-governance/registry/profiles/${profile.slug}`}>Institutional Commentary</Link> : null}
              </div>
            </div>

            <aside className="identity-panel">
              <div className="seal">✦</div>
              <div className="id-label">TA-14 Governance Registry Identifier</div>
              <div className="id-value">{registryIdentifier}</div>
              <div className="facts">
                <div className="fact"><span>Record State</span><strong>Registered</strong></div>
                <div className="fact"><span>Steward</span><strong>{steward}</strong></div>
                <div className="fact"><span>Current Version</span><strong>{version}</strong></div>
                <div className="fact"><span>Category</span><strong>{category}</strong></div>
                <div className="fact"><span>Registered</span><strong>{formatDate(profile?.registered_at || record.registered_at)}</strong></div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="metric-band"><div className="wrap"><div className="metrics">
        <div className="metric"><strong>{governedArtifacts.length}</strong><span>Governed Artifacts</span></div>
        <div className="metric"><strong>{demonstrations.length}</strong><span>Demonstrations</span></div>
        <div className="metric"><strong>{evidenceObjects.length}</strong><span>Linked Evidence Objects</span></div>
        <div className="metric"><strong>{artifactTypes.length}</strong><span>Artifact Classes</span></div>
      </div></div></div>

      <section className="section"><div className="wrap">
        <div className="section-head"><div><div className="kicker">Governed Record Progression</div><h2>A record that grows with the work.</h2></div><p className="lead">Milestones illuminate only when the public governed record supports them. They show record depth and chronology, not comparative rank, certification, or endorsement.</p></div>
        <div className="milestone-grid">{milestones.map((milestone) => <div key={milestone.label} className={`milestone ${milestone.active ? 'active' : ''}`}><div className="mark">{milestone.active ? '✦' : '○'}</div><strong>{milestone.label}</strong><small>{milestone.active ? 'Supported by the current public record.' : 'Not yet represented in the current public record.'}</small></div>)}</div>
      </div></section>

      <section className="section"><div className="wrap">
        <div className="section-head"><div><div className="kicker">Founding Demonstration</div><h2>The first consequential proof point.</h2></div><p className="lead">When a governance enters a founding demonstration, the Showcase elevates it as a major chronology event rather than burying it inside an artifact list.</p></div>
        {founding ? <div className="founding"><div className="kicker">✦ Founding Demonstration Entered Into the Record</div><h3>{founding.title}</h3><div className="artifact-id">{founding.artifact_identifier}</div><p>{founding.public_summary}</p><div className="founding-meta"><span className="chip">{founding.artifact_type}</span><span className="chip">Entered {formatDate(founding.registered_at)}</span><span className="chip">{founding.evidence_object_identifiers?.length ?? 0} Evidence Objects</span></div><div className="actions"><Link className="button primary" href={artifactHref(founding.artifact_identifier, founding.public_record_href)}>Open Founding Demonstration →</Link></div></div> : <div className="founding"><div className="kicker">Founding Demonstration · Not Yet Entered</div><h3>The registered foundation is established.</h3><p>This governance has a public Registry identity, but no public governed artifact currently classified as a founding or demonstration record. When one is entered, it will be elevated here automatically.</p></div>}
      </div></section>

      <section className="section"><div className="wrap">
        <div className="section-head"><div><div className="kicker">Governed Work</div><h2>Every artifact adds to the constellation.</h2></div><p className="lead">Artifacts remain independently identifiable records while strengthening the visible chronology of the governance that produced them.</p></div>
        {governedArtifacts.length ? <div className="artifact-grid">{governedArtifacts.map((artifact) => <article key={artifact.artifact_identifier} className={`artifact ${isDemonstration(artifact.artifact_type) ? 'demo' : ''}`}><div className="artifact-type">{isDemonstration(artifact.artifact_type) ? '✦ Demonstration · ' : ''}{artifact.artifact_type}</div><h3>{artifact.title}</h3><div className="artifact-id">{artifact.artifact_identifier}</div><p>{artifact.public_summary}</p><div className="artifact-meta"><span>{formatDate(artifact.registered_at)}</span><span>{artifact.evidence_object_identifiers?.length ?? 0} evidence objects</span><span>{artifact.current_record_version}</span>{artifact.finding_class ? <span>{artifact.finding_class}</span> : null}</div><Link href={artifactHref(artifact.artifact_identifier, artifact.public_record_href)}>Open governed artifact →</Link></article>)}</div> : <div className="content-card"><h3>Registered foundation established</h3><p>No published governed artifacts are linked to this governance identifier yet. The Showcase will expand automatically as qualifying records are entered.</p></div>}
      </div></section>

      <section className="section"><div className="wrap">
        <div className="section-head"><div><div className="kicker">Architecture & Declaration</div><h2>The governance in its own terms.</h2></div><p className="lead">The Showcase preserves the governance's identity while separating registrant declarations from TA-14 commentary and review findings.</p></div>
        <div className="content-grid">
          <div className="content-card"><h3>Who They Are</h3><SectionText value={profile?.who_they_are_markdown || record.summary} /></div>
          <div className="content-card"><h3>What They Are Building</h3><SectionText value={profile?.what_they_are_building_markdown} /></div>
          <div className="content-card"><h3>What They Declared</h3><SectionText value={profile?.what_they_declared_markdown || record.formal_claims} /></div>
          <div className="content-card"><h3>Explicit Boundaries & Non-Claims</h3><SectionText value={profile?.non_claims || record.explicit_non_claims} /></div>
          <div className="content-card"><h3>Known Limitations</h3><SectionText value={record.known_limitations} /></div>
          <div className="content-card"><h3>TA-14 Institutional Commentary</h3><SectionText value={profile?.ta14_commentary_markdown || profile?.why_ta14_is_paying_attention_markdown} /></div>
        </div>
      </div></section>

      <section className="section"><div className="wrap">
        <div className="section-head"><div><div className="kicker">Chronology</div><h2>How the public record accumulated.</h2></div><p className="lead">Registration establishes the foundation. Each subsequent public governed artifact becomes another dated point in the governance's preserved history.</p></div>
        <div className="timeline">
          <div className="time-row"><div className="time-date">{formatDate(profile?.registered_at || record.registered_at)}</div><div className="time-axis"/><div className="time-body"><strong>Governance entered the TA-14 Registry</strong><small>{registryIdentifier} · Registration is not certification.</small></div></div>
          {[...governedArtifacts].reverse().map((artifact) => <div className="time-row" key={`timeline-${artifact.artifact_identifier}`}><div className="time-date">{formatDate(artifact.registered_at)}</div><div className="time-axis"/><div className="time-body"><strong>{isDemonstration(artifact.artifact_type) ? '✦ ' : ''}{artifact.title}</strong><small>{artifact.artifact_type} · {artifact.artifact_identifier}</small></div></div>)}
        </div>
      </div></section>

      {(primaryWebsite || links.length) ? <section className="section"><div className="wrap"><div className="section-head"><div><div className="kicker">Governance Connections</div><h2>Continue into the architecture.</h2></div></div><div className="actions">{primaryWebsite ? <a className="button primary" href={primaryWebsite} target="_blank" rel="noreferrer">Official Governance Website →</a> : null}{links.map((link) => <a key={`${link.label}-${link.url}`} className="button secondary" href={link.url} target="_blank" rel="noreferrer">{link.label}</a>)}</div></div></section> : null}

      <section className="invitation"><div className="wrap"><div className="invitation-box"><div className="kicker">TA-14 AI Governance Exchange</div><h2>Where is your governance in the record?</h2><p>Independent architectures retain their identity. Registration establishes a governed public foundation, and future demonstrations, artifacts, evidence, and evolution can deepen that record over time.</p><div className="actions" style={{ justifyContent: 'center' }}><Link className="button primary" href="/workspace/ai-governance/registry/register">Register Your Governance →</Link><Link className="button secondary" href="/workspace/ai-governance/registry/showcase">Explore the Governance Showcase</Link></div><div className="boundary">Registration, governed artifact publication, profile presentation, and record depth do not by themselves constitute certification, endorsement, legal compliance, production validation, comparative ranking, or a finding that a governance is fit for a particular deployment. The authoritative Registry record and any separately issued governed review artifacts control their own stated scope.</div></div></div></section>
    </main>
  );
}
