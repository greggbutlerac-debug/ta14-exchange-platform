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

type Props = { params: Promise<{ registryIdentifier: string }> };

function createSupabaseClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase environment variables are not configured.');

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(values) {
        try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch { /* Public rendering only requires readable cookies. */ }
      },
    },
  });
}

function clean(value: string | null | undefined): string { return (value ?? '').trim(); }
function blocks(value: string | null | undefined): string[] {
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
    return candidate.label.trim() && candidate.url.trim()
      ? [{ label: candidate.label.trim(), url: candidate.url.trim() }]
      : [];
  });
}
function artifactHref(identifier: string, explicit: string | null): string {
  return explicit || `/workspace/ai-governance/artifacts/governed/${encodeURIComponent(identifier)}`;
}
function shorten(value: string | null | undefined, max = 220): string {
  const text = clean(value).replace(/[*#_`>]/g, '').replace(/\s+/g, ' ');
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}
function SectionText({ value }: { value: string | null | undefined }) {
  const items = blocks(value);
  if (!items.length) return <p className="muted">No additional public commentary is published for this section yet.</p>;
  return <>{items.map((item, index) => <p key={`${index}-${item.slice(0, 18)}`}>{item}</p>)}</>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { registryIdentifier } = await params;
  return {
    title: `${decodeURIComponent(registryIdentifier)} | TA-14 Governance Showcase`,
    description: 'A living institutional showcase of governance identity, evidence, demonstrations, artifacts, chronology, and governed record depth.',
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
  const record = directory.find((candidate) =>
    candidate.registry_identifier?.toUpperCase() === registryIdentifier &&
    candidate.status?.toLowerCase() === 'registered',
  );
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
  const organization = profile?.organization_name || null;
  const summary = profile?.profile_deck || profile?.public_summary || record.summary || 'A registered governance architecture in the TA-14 AI Governance Exchange public record.';
  const primaryWebsite = profile?.primary_website || null;
  const founding = demonstrations.length ? demonstrations[demonstrations.length - 1] : null;
  const publicEvidenceCount = Math.max(record.evidence_count ?? 0, evidenceObjects.length);
  const relationIds = (profile?.related_registry_identifiers ?? []).filter((id) => id.toUpperCase() !== registryIdentifier);
  const relatedRecords = directory.filter((candidate) => relationIds.includes(candidate.registry_identifier));

  const milestones = [
    { label: 'Permanent Registry Identity', detail: registryIdentifier, active: true },
    { label: 'Institutional Showcase', detail: profile ? 'Published profile active' : 'Registry foundation only', active: Boolean(profile) },
    { label: 'Public Evidence', detail: `${publicEvidenceCount} preserved item${publicEvidenceCount === 1 ? '' : 's'}`, active: publicEvidenceCount > 0 },
    { label: 'Founding Demonstration', detail: founding ? founding.artifact_identifier : 'Not yet entered', active: Boolean(founding) },
    { label: 'Governed Artifact Series', detail: `${governedArtifacts.length} public artifact${governedArtifacts.length === 1 ? '' : 's'}`, active: governedArtifacts.length > 0 },
    { label: 'Expanding Institutional Record', detail: governedArtifacts.length >= 5 ? 'Deepening chronology' : 'Future milestone', active: governedArtifacts.length >= 5 },
  ];

  const recordNodes = [
    { label: 'Identity', value: shortName || name, active: true },
    { label: 'Authority', value: steward, active: Boolean(steward) },
    { label: 'Evidence', value: publicEvidenceCount ? `${publicEvidenceCount} preserved` : 'Awaiting public evidence', active: publicEvidenceCount > 0 },
    { label: 'Demonstrations', value: demonstrations.length ? `${demonstrations.length} entered` : 'Open future node', active: demonstrations.length > 0 },
    { label: 'Artifacts', value: governedArtifacts.length ? `${governedArtifacts.length} governed` : 'Open future node', active: governedArtifacts.length > 0 },
    { label: 'Chronology', value: formatDate(profile?.registered_at || record.registered_at), active: true },
  ];

  return (
    <main className="showcase">
      <style>{`
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0}
        .showcase{min-height:100vh;overflow:hidden;color:#f5f8fc;background:radial-gradient(circle at 12% 4%,rgba(35,104,173,.26),transparent 25%),radial-gradient(circle at 87% 7%,rgba(227,177,76,.16),transparent 26%),radial-gradient(circle at 50% 58%,rgba(36,76,124,.12),transparent 36%),linear-gradient(180deg,#01050b 0%,#04111f 43%,#02070d 100%)}
        .wrap{width:min(1280px,calc(100% - 40px));margin:0 auto;position:relative;z-index:2}
        .stars,.stars:before,.stars:after{content:'';position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,rgba(255,255,255,.92) 0 1px,transparent 1.4px),radial-gradient(circle,rgba(239,198,108,.78) 0 1px,transparent 1.5px),radial-gradient(circle,rgba(121,183,234,.65) 0 1px,transparent 1.4px);background-size:151px 151px,239px 239px,331px 331px;opacity:.30}.stars:before{transform:translate(70px,110px);opacity:.48}.stars:after{transform:translate(-90px,210px);opacity:.21}
        .hero{position:relative;min-height:760px;padding:38px 0 92px;border-bottom:1px solid rgba(226,177,78,.22)}
        .orbit{position:absolute;border:1px solid rgba(120,177,224,.10);border-radius:50%;pointer-events:none}.orbit-a{width:760px;height:760px;right:-250px;top:-230px}.orbit-b{width:470px;height:470px;right:-105px;top:-85px;border-color:rgba(226,177,78,.11)}.orbit-c{width:240px;height:240px;right:10px;top:30px}
        .nav{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:70px;color:#627c93;font-size:12px}.nav a{color:#a9c5df;text-decoration:none}.nav strong{color:#edc46d}
        .hero-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(330px,.55fr);gap:56px;align-items:center}.eyebrow{display:inline-flex;align-items:center;gap:9px;padding:8px 13px;border:1px solid rgba(226,177,78,.34);border-radius:999px;color:#efc770;background:rgba(226,177,78,.07);font-size:10px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.hero h1{max-width:900px;margin:24px 0 0;font-size:clamp(54px,8vw,106px);line-height:.88;letter-spacing:-.06em}.hero-subtitle{max-width:900px;margin-top:24px;color:#e1bd6d;font-size:clamp(20px,2vw,29px);font-weight:850;line-height:1.35}.hero-summary{max-width:900px;margin-top:22px;color:#a8bfd3;font-size:clamp(17px,1.8vw,22px);line-height:1.72}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}.button{min-height:48px;padding:0 18px;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;text-decoration:none;font-size:13px;font-weight:900}.primary{color:#07111b;background:linear-gradient(135deg,#f5d48c,#d5a346);box-shadow:0 18px 48px rgba(218,168,69,.17)}.secondary{color:#dbeafa;border:1px solid rgba(120,175,220,.25);background:rgba(8,27,45,.7)}
        .identity-card{position:relative;overflow:hidden;padding:28px;border:1px solid rgba(228,181,84,.30);border-radius:25px;background:linear-gradient(155deg,rgba(25,28,29,.92),rgba(5,18,31,.94));box-shadow:0 36px 100px rgba(0,0,0,.32)}.identity-card:after{content:'';position:absolute;width:260px;height:260px;right:-130px;top:-130px;border:1px solid rgba(232,190,98,.18);border-radius:50%}.seal{width:86px;height:86px;display:grid;place-items:center;border:1px solid rgba(238,199,116,.43);border-radius:50%;color:#f0ca78;font-size:30px;box-shadow:0 0 45px rgba(225,177,76,.13),inset 0 0 35px rgba(225,177,76,.07)}.seal small{font-size:10px;letter-spacing:.12em;font-weight:900}.id-label{margin-top:25px;color:#6e8ba5;font-size:9px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.id-value{margin-top:7px;color:#f0cd84;font-size:17px;font-weight:950;overflow-wrap:anywhere}.identity-facts{display:grid;gap:11px;margin-top:19px}.identity-fact{padding-top:11px;border-top:1px solid rgba(255,255,255,.06)}.identity-fact span{display:block;color:#677f95;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.11em}.identity-fact strong{display:block;margin-top:5px;color:#dce9f5;font-size:14px;line-height:1.45}
        .metric-band{position:relative;z-index:4;margin-top:-38px}.metrics{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:11px}.metric{padding:21px;border:1px solid rgba(110,166,212,.18);border-radius:18px;background:rgba(5,18,31,.96);box-shadow:0 20px 60px rgba(0,0,0,.22)}.metric strong{display:block;color:#f0c873;font-size:34px;letter-spacing:-.05em}.metric span{display:block;margin-top:4px;color:#748da3;font-size:9px;font-weight:900;letter-spacing:.11em;text-transform:uppercase}
        .section{padding:84px 0}.section+.section{border-top:1px solid rgba(111,165,209,.10)}.section-head{display:flex;justify-content:space-between;align-items:end;gap:34px;margin-bottom:34px}.kicker{color:#dcae55;font-size:10px;font-weight:900;letter-spacing:.15em;text-transform:uppercase}.section h2{margin:10px 0 0;font-size:clamp(38px,5vw,62px);line-height:.98;letter-spacing:-.045em}.lead{max-width:720px;color:#8da6bb;line-height:1.72}
        .constellation{position:relative;min-height:560px;overflow:hidden;border:1px solid rgba(109,166,212,.17);border-radius:30px;background:radial-gradient(circle at 50% 48%,rgba(35,101,158,.18),transparent 34%),rgba(4,14,24,.68);box-shadow:inset 0 0 100px rgba(0,0,0,.2)}.constellation:before,.constellation:after{content:'';position:absolute;border:1px solid rgba(115,173,219,.11);border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%)}.constellation:before{width:430px;height:430px}.constellation:after{width:280px;height:280px;border-color:rgba(226,177,78,.12)}.core-node{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:190px;height:190px;display:grid;place-items:center;text-align:center;padding:20px;border:1px solid rgba(230,184,87,.43);border-radius:50%;background:radial-gradient(circle,rgba(226,177,78,.16),rgba(7,23,38,.96) 68%);box-shadow:0 0 80px rgba(225,177,77,.18)}.core-node strong{display:block;color:#f4d391;font-size:20px}.core-node small{display:block;margin-top:7px;color:#7893aa;font-size:9px;letter-spacing:.1em;text-transform:uppercase}.node{position:absolute;width:170px;min-height:88px;padding:15px;border:1px solid rgba(105,164,212,.18);border-radius:16px;background:rgba(7,24,40,.92);box-shadow:0 15px 45px rgba(0,0,0,.2)}.node:before{content:'';position:absolute;width:8px;height:8px;border-radius:50%;background:#577d9e;box-shadow:0 0 18px rgba(93,148,192,.4);top:15px;right:15px}.node.active{border-color:rgba(225,177,78,.28)}.node.active:before{background:#e4b65b;box-shadow:0 0 20px rgba(228,182,91,.65)}.node span{display:block;color:#748ea5;font-size:9px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.node strong{display:block;margin-top:7px;color:#dce9f5;font-size:13px;line-height:1.35}.n0{left:8%;top:15%}.n1{right:8%;top:15%}.n2{left:5%;bottom:15%}.n3{right:5%;bottom:15%}.n4{left:50%;top:6%;transform:translateX(-50%)}.n5{left:50%;bottom:6%;transform:translateX(-50%)}
        .milestone-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.milestone{min-height:150px;padding:21px;border:1px solid rgba(111,166,211,.14);border-radius:20px;background:rgba(7,22,37,.58)}.milestone.active{border-color:rgba(225,177,78,.29);background:radial-gradient(circle at 100% 0%,rgba(225,177,78,.10),transparent 42%),rgba(8,24,39,.75)}.milestone .mark{font-size:22px;color:#607b92}.milestone.active .mark{color:#e8bc63;text-shadow:0 0 20px rgba(232,188,99,.4)}.milestone strong{display:block;margin-top:18px;color:#e5edf6;font-size:16px}.milestone small{display:block;margin-top:7px;color:#718a9f;line-height:1.5}
        .spotlight{position:relative;overflow:hidden;padding:42px;border:1px solid rgba(228,180,80,.34);border-radius:30px;background:radial-gradient(circle at 90% 10%,rgba(228,180,80,.17),transparent 31%),linear-gradient(150deg,rgba(29,31,27,.93),rgba(5,18,31,.95));box-shadow:0 35px 100px rgba(0,0,0,.21)}.spotlight:after{content:'✦';position:absolute;right:38px;top:20px;color:rgba(239,198,110,.24);font-size:110px}.spotlight h3{max-width:900px;margin:15px 0 10px;font-size:clamp(32px,4.5vw,58px);line-height:1;letter-spacing:-.045em}.spotlight p{max-width:900px;color:#9fb5c7;line-height:1.72}.chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:22px}.chip{padding:8px 10px;border:1px solid rgba(225,177,78,.20);border-radius:999px;color:#e0bc73;background:rgba(225,177,78,.05);font-size:9px;font-weight:900;letter-spacing:.09em;text-transform:uppercase}
        .artifact-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.artifact{position:relative;overflow:hidden;min-height:320px;padding:25px;border:1px solid rgba(110,166,212,.16);border-radius:22px;background:linear-gradient(155deg,rgba(10,31,51,.88),rgba(4,14,24,.95))}.artifact.demo{border-color:rgba(225,177,78,.30)}.artifact-index{position:absolute;right:22px;top:16px;color:rgba(122,171,211,.14);font-size:60px;font-weight:950;letter-spacing:-.06em}.artifact.demo .artifact-index{color:rgba(230,183,84,.14)}.artifact-type{position:relative;color:#7ea9cd;font-size:9px;font-weight:900;letter-spacing:.11em;text-transform:uppercase}.artifact.demo .artifact-type{color:#e5ba64}.artifact h3{position:relative;margin:16px 0 9px;font-size:25px;line-height:1.12;letter-spacing:-.03em}.artifact-id{position:relative;color:#6c879e;font:10px ui-monospace,SFMono-Regular,Menlo,monospace}.artifact p{position:relative;color:#94aabd;line-height:1.62}.artifact-meta{display:flex;gap:7px;flex-wrap:wrap;margin:20px 0}.artifact-meta span{padding:6px 8px;border:1px solid rgba(255,255,255,.06);border-radius:8px;color:#718ba1;font-size:9px}.artifact a{color:#efc66e;text-decoration:none;font-size:12px;font-weight:900}
        .content-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.content-card{padding:29px;border:1px solid rgba(111,165,210,.14);border-radius:21px;background:rgba(7,22,37,.62)}.content-card.emphasis{border-color:rgba(225,177,78,.22);background:linear-gradient(150deg,rgba(23,27,28,.75),rgba(7,22,37,.72))}.content-card h3{margin:0 0 16px;color:#e7c477;font-size:20px}.content-card p{color:#9db3c5;line-height:1.75}.muted{color:#6d879d!important}
        .evidence-vault{display:grid;grid-template-columns:minmax(0,.6fr) minmax(0,1.4fr);gap:18px}.evidence-number{display:flex;flex-direction:column;justify-content:space-between;min-height:310px;padding:30px;border:1px solid rgba(226,177,78,.28);border-radius:24px;background:radial-gradient(circle at 50% 15%,rgba(226,177,78,.13),transparent 40%),rgba(9,24,38,.7)}.evidence-number strong{font-size:clamp(70px,10vw,128px);line-height:.8;color:#f0ca77;letter-spacing:-.08em}.evidence-number span{color:#7890a5;font-size:10px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.evidence-copy{padding:30px;border:1px solid rgba(111,165,210,.14);border-radius:24px;background:rgba(7,22,37,.6)}.evidence-copy h3{margin:0;font-size:30px;letter-spacing:-.03em}.evidence-copy p{color:#95acbf;line-height:1.75}.evidence-copy .boundary-line{margin-top:18px;padding:15px;border-left:2px solid rgba(225,177,78,.42);background:rgba(225,177,78,.05);color:#b9c8d5;font-size:12px}
        .relations{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:13px}.relation{padding:21px;border:1px solid rgba(113,167,212,.15);border-radius:18px;background:rgba(7,22,37,.58)}.relation span{color:#708ba2;font-size:9px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.relation strong{display:block;margin-top:8px;color:#e4edf5}.relation a{display:inline-block;margin-top:15px;color:#e6bd69;text-decoration:none;font-size:12px;font-weight:900}
        .timeline{display:grid}.time-row{display:grid;grid-template-columns:150px 24px 1fr;gap:18px;min-height:94px}.time-date{padding-top:4px;color:#728aa0;font-size:11px}.time-axis{position:relative}.time-axis:before{content:'';position:absolute;left:11px;top:0;bottom:0;width:1px;background:rgba(113,167,212,.18)}.time-axis:after{content:'';position:absolute;left:7px;top:5px;width:9px;height:9px;border-radius:50%;background:#e1b358;box-shadow:0 0 18px rgba(225,179,88,.45)}.time-body{padding-bottom:28px}.time-body strong{display:block;color:#dce8f3}.time-body small{display:block;margin-top:5px;color:#7e96aa;line-height:1.5}
        .invitation{padding:92px 0 118px;text-align:center}.invitation-box{position:relative;overflow:hidden;padding:62px 28px;border:1px solid rgba(226,177,78,.27);border-radius:30px;background:radial-gradient(circle at 50% 0%,rgba(226,177,78,.12),transparent 45%),rgba(5,18,31,.72)}.invitation h2{max-width:900px;margin:15px auto;font-size:clamp(42px,6.5vw,78px);line-height:.95;letter-spacing:-.055em}.invitation p{max-width:780px;margin:22px auto;color:#99afc2;font-size:18px;line-height:1.7}.boundary{max-width:920px;margin:30px auto 0;color:#627c91;font-size:11px;line-height:1.72}
        @media(max-width:980px){.hero-grid,.evidence-vault{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(3,minmax(0,1fr))}.content-grid,.artifact-grid{grid-template-columns:1fr}.milestone-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.section-head{display:block}.lead{margin-top:16px}.identity-card{max-width:650px}.constellation{min-height:700px}.n0{left:5%;top:10%}.n1{right:5%;top:10%}.n2{left:5%;bottom:10%}.n3{right:5%;bottom:10%}.n4{top:23%}.n5{bottom:23%}}
        @media(max-width:620px){.wrap{width:min(100% - 24px,1280px)}.hero{min-height:auto}.metrics{grid-template-columns:1fr 1fr}.milestone-grid{grid-template-columns:1fr}.constellation{min-height:auto;padding:22px;display:grid;gap:10px}.core-node,.node{position:relative!important;inset:auto!important;transform:none!important;width:auto;height:auto;min-height:86px;border-radius:16px}.core-node{min-height:120px}.spotlight{padding:26px}.time-row{grid-template-columns:100px 18px 1fr;gap:10px}}
      `}</style>

      <section className="hero">
        <div className="stars" />
        <div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit orbit-c" />
        <div className="wrap">
          <nav className="nav">
            <Link href="/workspace/ai-governance">AI Governance Exchange</Link><span>/</span>
            <Link href="/workspace/ai-governance/registry/showcase">Governance Showcase</Link><span>/</span>
            <strong>{shortName || name}</strong>
          </nav>

          <div className="hero-grid">
            <div>
              <div className="eyebrow">✦ Registered Governance · Living Institutional Record</div>
              <h1>{name}</h1>
              <div className="hero-subtitle">{profile?.profile_subtitle || category}</div>
              <p className="hero-summary">{summary}</p>
              <div className="actions">
                <Link className="button primary" href={`/workspace/ai-governance/registry/records/${encodeURIComponent(registryIdentifier)}`}>Open Authoritative Registry Record →</Link>
                {primaryWebsite ? <a className="button secondary" href={primaryWebsite} target="_blank" rel="noreferrer">Visit Governance Website ↗</a> : null}
                {profile?.slug ? <Link className="button secondary" href={`/workspace/ai-governance/registry/profiles/${profile.slug}`}>Read Institutional Commentary</Link> : null}
              </div>
            </div>

            <aside className="identity-card">
              <div className="seal"><small>TA-14</small></div>
              <div className="id-label">Permanent Governance Registry Identifier</div>
              <div className="id-value">{registryIdentifier}</div>
              <div className="identity-facts">
                <div className="identity-fact"><span>Record State</span><strong>Registered · Public</strong></div>
                <div className="identity-fact"><span>Steward</span><strong>{steward}</strong></div>
                {organization ? <div className="identity-fact"><span>Organization</span><strong>{organization}</strong></div> : null}
                <div className="identity-fact"><span>Version</span><strong>{version}</strong></div>
                <div className="identity-fact"><span>Registered</span><strong>{formatDate(profile?.registered_at || record.registered_at)}</strong></div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="metric-band"><div className="wrap"><div className="metrics">
        <div className="metric"><strong>{publicEvidenceCount}</strong><span>Public Evidence</span></div>
        <div className="metric"><strong>{governedArtifacts.length}</strong><span>Governed Artifacts</span></div>
        <div className="metric"><strong>{demonstrations.length}</strong><span>Demonstrations</span></div>
        <div className="metric"><strong>{artifactTypes.length}</strong><span>Artifact Classes</span></div>
        <div className="metric"><strong>{record.dispute_count ?? 0}</strong><span>Active Disputes</span></div>
      </div></div></div>

      <section className="section"><div className="wrap">
        <div className="section-head"><div><div className="kicker">Governance Constellation</div><h2>A living record, not a directory listing.</h2></div><p className="lead">The center is the permanent governance identity. Every preserved evidence object, demonstration, artifact, and chronology event deepens the institutional record around it without changing who owns or stewards the architecture.</p></div>
        <div className="constellation">
          <div className="stars" />
          <div className="core-node"><div><strong>{shortName || name}</strong><small>{registryIdentifier}</small></div></div>
          {recordNodes.map((node, index) => <div className={`node n${index} ${node.active ? 'active' : ''}`} key={node.label}><span>{node.label}</span><strong>{node.value}</strong></div>)}
        </div>
      </div></section>

      <section className="section"><div className="wrap">
        <div className="section-head"><div><div className="kicker">Institutional Milestones</div><h2>The record earns its depth.</h2></div><p className="lead">Milestones illuminate only when the public record supports them. They show chronology and preserved activity—not certification, endorsement, or comparative rank.</p></div>
        <div className="milestone-grid">{milestones.map((milestone) => <div className={`milestone ${milestone.active ? 'active' : ''}`} key={milestone.label}><div className="mark">{milestone.active ? '✦' : '○'}</div><strong>{milestone.label}</strong><small>{milestone.detail}</small></div>)}</div>
      </div></section>

      <section className="section"><div className="wrap">
        <div className="section-head"><div><div className="kicker">Founding Demonstration</div><h2>The first major proof point gets the stage.</h2></div><p className="lead">A Founding Demonstration should never disappear inside a generic artifact list. When one enters the governed record, it becomes a major institutional moment on this page.</p></div>
        {founding ? <article className="spotlight"><div className="kicker">✦ Founding Demonstration Entered Into the Record</div><h3>{founding.title}</h3><div className="artifact-id">{founding.artifact_identifier}</div><p>{founding.public_summary}</p><div className="chips"><span className="chip">{founding.artifact_type}</span><span className="chip">Entered {formatDate(founding.registered_at)}</span><span className="chip">{founding.evidence_object_identifiers?.length ?? 0} Linked Evidence Objects</span>{founding.finding_class ? <span className="chip">{founding.finding_class}</span> : null}</div><div className="actions"><Link className="button primary" href={artifactHref(founding.artifact_identifier, founding.public_record_href)}>Enter the Demonstration Record →</Link></div></article> : <article className="spotlight"><div className="kicker">Founding Demonstration · Open Future Milestone</div><h3>The Registry foundation is established. The demonstration stage remains open.</h3><p>No published governed artifact linked to this governance is currently classified as a founding or demonstration record. When one is formally entered, this entire section upgrades automatically and gives that event flagship treatment.</p></article>}
      </div></section>

      <section className="section"><div className="wrap">
        <div className="section-head"><div><div className="kicker">Governed Artifact Gallery</div><h2>Every artifact becomes part of the exhibit.</h2></div><p className="lead">The page gets richer because the governed record gets richer. New artifacts accumulate as individually identifiable institutional objects rather than disappearing into a file list.</p></div>
        {governedArtifacts.length ? <div className="artifact-grid">{governedArtifacts.map((artifact, index) => <article className={`artifact ${isDemonstration(artifact.artifact_type) ? 'demo' : ''}`} key={artifact.artifact_identifier}><div className="artifact-index">{String(index + 1).padStart(2, '0')}</div><div className="artifact-type">{isDemonstration(artifact.artifact_type) ? '✦ Demonstration · ' : ''}{artifact.artifact_type}</div><h3>{artifact.title}</h3><div className="artifact-id">{artifact.artifact_identifier}</div><p>{shorten(artifact.public_summary, 300)}</p><div className="artifact-meta"><span>{formatDate(artifact.registered_at)}</span><span>{artifact.evidence_object_identifiers?.length ?? 0} evidence objects</span><span>{artifact.current_record_version}</span>{artifact.finding_class ? <span>{artifact.finding_class}</span> : null}</div><Link href={artifactHref(artifact.artifact_identifier, artifact.public_record_href)}>Open governed artifact →</Link></article>)}</div> : <div className="content-card emphasis"><h3>The gallery is waiting for its first governed artifact.</h3><p>This is intentional. Registration establishes the identity; governed work deepens it. The page will expand automatically when qualifying artifacts are published beneath {registryIdentifier}.</p></div>}
      </div></section>

      <section className="section"><div className="wrap">
        <div className="section-head"><div><div className="kicker">Evidence Vault</div><h2>Evidence is visible as institutional depth.</h2></div><p className="lead">The Showcase surfaces the existence and scale of the preserved evidence boundary while the authoritative Registry record remains the source for the exact evidence objects, hashes, declarations, and limitations.</p></div>
        <div className="evidence-vault"><div className="evidence-number"><strong>{publicEvidenceCount}</strong><span>Public evidence items preserved in the current record</span></div><div className="evidence-copy"><h3>Evidence supports a record. It does not become a blanket assurance claim.</h3><p>{record.known_limitations ? shorten(record.known_limitations, 620) : 'The Registry preserves evidence and declared boundaries so later demonstrations, reviews, and findings can be compared against an attributable baseline.'}</p><div className="boundary-line">Evidence presence, provenance, cryptographic integrity, or publication does not by itself establish substantive truth, universal technical validity, legal sufficiency, certification, or fitness for deployment.</div><div className="actions"><Link className="button primary" href={`/workspace/ai-governance/registry/records/${encodeURIComponent(registryIdentifier)}`}>Inspect Evidence in Registry →</Link></div></div></div>
      </div></section>

      <section className="section"><div className="wrap">
        <div className="section-head"><div><div className="kicker">Architecture & Declaration</div><h2>The governance in its own terms.</h2></div><p className="lead">Registrant declarations remain distinguishable from TA-14 institutional commentary. The permanent Registry record controls the authoritative registration baseline.</p></div>
        <div className="content-grid">
          <div className="content-card emphasis"><h3>Who They Are</h3><SectionText value={profile?.who_they_are_markdown || record.summary} /></div>
          <div className="content-card"><h3>What They Are Building</h3><SectionText value={profile?.what_they_are_building_markdown} /></div>
          <div className="content-card"><h3>What They Declared</h3><SectionText value={profile?.what_they_declared_markdown || record.formal_claims} /></div>
          <div className="content-card"><h3>Explicit Boundaries & Non-Claims</h3><SectionText value={profile?.non_claims || record.explicit_non_claims} /></div>
          <div className="content-card"><h3>Known Limitations</h3><SectionText value={record.known_limitations} /></div>
          <div className="content-card emphasis"><h3>TA-14 Institutional Commentary</h3><SectionText value={profile?.ta14_commentary_markdown || profile?.why_ta14_is_paying_attention_markdown} /></div>
        </div>
      </div></section>

      {(relatedRecords.length > 0 || relationIds.length > 0) ? <section className="section"><div className="wrap"><div className="section-head"><div><div className="kicker">Architecture Relationships</div><h2>Connected without being collapsed.</h2></div><p className="lead">Related governance identities remain independent records. Relationships can be displayed without implying merger, ownership transfer, certification, or automatic evidence inheritance.</p></div><div className="relations">{relationIds.map((id) => { const related = relatedRecords.find((candidate) => candidate.registry_identifier === id); return <div className="relation" key={id}><span>Related Governance Identity</span><strong>{related?.governance_name || id}</strong><a href={`/workspace/ai-governance/registry/showcase/${encodeURIComponent(id)}`}>Explore related governance →</a></div>; })}</div></div></section> : null}

      <section className="section"><div className="wrap">
        <div className="section-head"><div><div className="kicker">Public Chronology</div><h2>History should accumulate, not disappear.</h2></div><p className="lead">The registration remains the foundation. Every later governed artifact becomes another dated point in the preserved public record.</p></div>
        <div className="timeline"><div className="time-row"><div className="time-date">{formatDate(profile?.registered_at || record.registered_at)}</div><div className="time-axis"/><div className="time-body"><strong>Permanent governance identity entered the Registry</strong><small>{registryIdentifier} · Registration is not certification.</small></div></div>{[...governedArtifacts].reverse().map((artifact) => <div className="time-row" key={`timeline-${artifact.artifact_identifier}`}><div className="time-date">{formatDate(artifact.registered_at)}</div><div className="time-axis"/><div className="time-body"><strong>{isDemonstration(artifact.artifact_type) ? '✦ ' : ''}{artifact.title}</strong><small>{artifact.artifact_type} · {artifact.artifact_identifier}</small></div></div>)}</div>
      </div></section>

      {(primaryWebsite || links.length) ? <section className="section"><div className="wrap"><div className="section-head"><div><div className="kicker">Continue Into the Governance</div><h2>Leave the Exchange and inspect the architecture itself.</h2></div></div><div className="actions">{primaryWebsite ? <a className="button primary" href={primaryWebsite} target="_blank" rel="noreferrer">Official Governance Website →</a> : null}{links.map((link) => <a key={`${link.label}-${link.url}`} className="button secondary" href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div></div></section> : null}

      <section className="invitation"><div className="wrap"><div className="invitation-box"><div className="stars"/><div style={{position:'relative',zIndex:2}}><div className="kicker">TA-14 AI Governance Exchange</div><h2>Imagine your governance growing here.</h2><p>Registration establishes the permanent foundation. Demonstrations become milestones. Evidence becomes visible depth. Artifacts become exhibits. Version evolution becomes chronology. Independent architecture identity remains intact.</p><div className="actions" style={{justifyContent:'center'}}><Link className="button primary" href="/workspace/ai-governance/registry/register">Register Your Governance →</Link><Link className="button secondary" href="/workspace/ai-governance/registry/showcase">Explore All Governances</Link></div><div className="boundary">Registration, profile presentation, public evidence, artifact publication, milestones, and Showcase record depth do not by themselves constitute certification, endorsement, accreditation, legal compliance, production validation, comparative ranking, or a finding of fitness for deployment. Separately issued governed review artifacts control their own stated scope.</div></div></div></div></section>
    </main>
  );
}
