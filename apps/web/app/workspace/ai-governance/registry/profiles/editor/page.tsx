'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useCallback, useEffect, useMemo, useState } from 'react';

type RegistryPublicRecord = {
  id: string;
  registry_identifier: string;
  source_record_id: string | null;
  governance_name: string;
  short_name: string | null;
  version: string | null;
  category: string | null;
  steward: string | null;
  claimed_establishment_date: string | null;
  registered_at: string | null;
  status: string;
  visibility: string | null;
  is_published: boolean;
  published_at: string | null;
  summary: string | null;
  domains: string[] | null;
  evidence_count: number | null;
  dispute_count: number | null;
};

type GovernanceProfileRow = {
  id: string;
  profile_number: number;
  slug: string;
  profile_status: string;
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
  is_featured: boolean;
  editorial_priority: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

type WorkspaceFilter = 'all' | 'eligible' | 'draft' | 'published' | 'archived';

type DraftCreationState = {
  registryIdentifier: string;
  busy: boolean;
};

function formatDate(value: string | null) {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function label(value: string | null | undefined, fallback = 'Not declared') {
  if (!value?.trim()) return fallback;
  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function profileNumber(value: number) {
  return String(value).padStart(3, '0');
}

function normalizedStatus(value: string | null | undefined) {
  return (value ?? '').trim().toLowerCase().replaceAll(' ', '_');
}

export default function GovernanceProfileEditorPage() {
  const router = useRouter();
  const [registryRecords, setRegistryRecords] = useState<RegistryPublicRecord[]>([]);
  const [profiles, setProfiles] = useState<GovernanceProfileRow[]>([]);
  const [filter, setFilter] = useState<WorkspaceFilter>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [reviewerAuthorized, setReviewerAuthorized] = useState<boolean | null>(null);
  const [draftState, setDraftState] = useState<DraftCreationState | null>(null);
  const [notice, setNotice] = useState('');

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return null;
    return createBrowserClient(url, anonKey);
  }, []);

  const loadWorkspace = useCallback(
    async (mode: 'initial' | 'refresh' = 'initial') => {
      if (mode === 'initial') setLoading(true);
      else setRefreshing(true);
      setError('');

      try {
        if (!supabase) {
          throw new Error('Supabase environment variables are not configured.');
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session?.access_token) {
          throw new Error(
            'Your TA-14 institutional session is missing or expired. Sign in again.',
          );
        }

        const { data: reviewerData, error: reviewerError } = await supabase.rpc(
          'ta14_registry_is_reviewer',
        );

        if (reviewerError) throw reviewerError;

        const authorized = reviewerData === true;
        setReviewerAuthorized(authorized);

        if (!authorized) {
          setRegistryRecords([]);
          setProfiles([]);
          return;
        }

        const [registryResult, profileResult] = await Promise.all([
          supabase
            .from('ta14_registry_public_records')
            .select(
              [
                'id',
                'registry_identifier',
                'source_record_id',
                'governance_name',
                'short_name',
                'version',
                'category',
                'steward',
                'claimed_establishment_date',
                'registered_at',
                'status',
                'visibility',
                'is_published',
                'published_at',
                'summary',
                'domains',
                'evidence_count',
                'dispute_count',
              ].join(','),
            )
            .eq('status', 'Registered')
            .eq('is_published', true)
            .order('registered_at', { ascending: false, nullsFirst: false }),

          supabase
            .from('ta14_governance_profiles')
            .select(
              [
                'id',
                'profile_number',
                'slug',
                'profile_status',
                'registry_identifier',
                'governance_name',
                'short_name',
                'governance_version',
                'governance_category',
                'steward_name',
                'organization_name',
                'registered_at',
                'profile_title',
                'profile_subtitle',
                'is_featured',
                'editorial_priority',
                'created_at',
                'updated_at',
                'published_at',
              ].join(','),
            )
            .order('profile_number', { ascending: true }),
        ]);

        if (registryResult.error) throw registryResult.error;
        if (profileResult.error) throw profileResult.error;

        setRegistryRecords(
          (registryResult.data ?? []) as unknown as RegistryPublicRecord[],
        );
        setProfiles((profileResult.data ?? []) as unknown as GovernanceProfileRow[]);
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : 'The Governance Profile editorial workspace could not be loaded.',
        );
      } finally {
        if (mode === 'initial') setLoading(false);
        else setRefreshing(false);
      }
    },
    [supabase],
  );

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  const profileByRegistryIdentifier = useMemo(
    () =>
      new Map(
        profiles.map((profile) => [profile.registry_identifier, profile] as const),
      ),
    [profiles],
  );

  const eligibleRecords = useMemo(
    () =>
      registryRecords.filter(
        (record) => !profileByRegistryIdentifier.has(record.registry_identifier),
      ),
    [profileByRegistryIdentifier, registryRecords],
  );

  const counts = useMemo(
    () => ({
      all: eligibleRecords.length + profiles.length,
      eligible: eligibleRecords.length,
      draft: profiles.filter(
        (profile) => normalizedStatus(profile.profile_status) === 'draft',
      ).length,
      published: profiles.filter(
        (profile) => normalizedStatus(profile.profile_status) === 'published',
      ).length,
      archived: profiles.filter(
        (profile) => normalizedStatus(profile.profile_status) === 'archived',
      ).length,
    }),
    [eligibleRecords, profiles],
  );

  const visibleEligible = useMemo(() => {
    if (filter !== 'all' && filter !== 'eligible') return [];
    const query = search.trim().toLowerCase();

    return eligibleRecords.filter((record) => {
      if (!query) return true;
      return [
        record.governance_name,
        record.short_name,
        record.registry_identifier,
        record.version,
        record.category,
        record.steward,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [eligibleRecords, filter, search]);

  const visibleProfiles = useMemo(() => {
    if (filter === 'eligible') return [];
    const query = search.trim().toLowerCase();

    return profiles.filter((profile) => {
      const status = normalizedStatus(profile.profile_status);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'draft' && status === 'draft') ||
        (filter === 'published' && status === 'published') ||
        (filter === 'archived' && status === 'archived');

      if (!matchesFilter) return false;
      if (!query) return true;

      return [
        profile.profile_title,
        profile.governance_name,
        profile.short_name,
        profile.registry_identifier,
        profile.governance_version,
        profile.governance_category,
        profile.steward_name,
        profile.organization_name,
        profile.slug,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [filter, profiles, search]);

  async function createDraft(record: RegistryPublicRecord) {
    if (!supabase) return;

    setNotice('');
    setError('');
    setDraftState({
      registryIdentifier: record.registry_identifier,
      busy: true,
    });

    try {
      const { data, error: createError } = await supabase.rpc(
        'ta14_governance_profile_create_draft_v1',
        {
          requested_registry_identifier: record.registry_identifier,
        },
      );

      if (createError) throw createError;

      const created = data as unknown as GovernanceProfileRow | null;

      setNotice(
        created?.profile_number
          ? `Profile ${profileNumber(created.profile_number)} draft created for ${record.governance_name}.`
          : `Governance Profile draft created for ${record.governance_name}.`,
      );

      if (created?.id) {
        router.push(
          `/workspace/ai-governance/registry/profiles/editor/${encodeURIComponent(created.id)}`,
        );
        return;
      }

      await loadWorkspace('refresh');
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'The Governance Profile draft could not be created.',
      );
    } finally {
      setDraftState(null);
    }
  }

  return (
    <main className="pageShell">
      <div className="stars starsOne" aria-hidden="true" />
      <div className="stars starsTwo" aria-hidden="true" />
      <div className="orbit orbitOne" aria-hidden="true" />
      <div className="orbit orbitTwo" aria-hidden="true" />

      <nav className="topBar">
        <div className="topBarLinks">
          <Link href="/workspace/ai-governance/registry" className="secondaryButton">
            Registry Home
          </Link>
          <Link href="/workspace/ai-governance/registry/review" className="textLink">
            Reviewer Queue
          </Link>
          <Link href="/workspace/ai-governance/registry/profiles" className="textLink">
            Public Profiles
          </Link>
        </div>

        <button
          type="button"
          className="secondaryButton"
          disabled={refreshing || loading}
          onClick={() => void loadWorkspace('refresh')}
        >
          {refreshing ? 'Refreshing…' : 'Refresh Workspace'}
        </button>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">CONTROLLED TA-14 EDITORIAL WORKSPACE</p>
          <h1>Governance Profile Editor</h1>
          <p className="lead">
            Create TA-14 Governance Profile drafts from already registered,
            published governance entities, preserve the Registry declaration as
            the evidentiary baseline, and keep TA-14 institutional commentary
            separate from the registrant&apos;s own record.
          </p>
        </div>

        <aside className="boundaryPanel">
          <p className="eyebrow">EDITORIAL BOUNDARY</p>
          <strong>Registration comes first.</strong>
          <p>
            This workspace may seed a TA-14 editorial draft only after a
            governance architecture has a registered, published Registry
            baseline. Creating a profile does not certify, endorse, validate, or
            rewrite the underlying governance record.
          </p>
        </aside>
      </section>

      {reviewerAuthorized === false && !loading ? (
        <section className="stateCard errorCard">
          <div>
            <p className="eyebrow">INSTITUTIONAL AUTHORITY REQUIRED</p>
            <h2>This account is not authorized to edit TA-14 Governance Profiles.</h2>
            <p>
              Governance Profile creation and editorial access are limited to
              authenticated TA-14 reviewer/editor identities.
            </p>
          </div>
          <Link href="/workspace/ai-governance/registry" className="secondaryButton">
            Return to Registry
          </Link>
        </section>
      ) : null}

      {reviewerAuthorized !== false ? (
        <>
          <section className="authorityStrip">
            <div>
              <p className="eyebrow">TA-14 EDITORIAL AUTHORITY</p>
              <strong>
                Registry identity remains the source. Commentary remains a
                separate TA-14 publication.
              </strong>
            </div>

            <div className="authorityStages" aria-label="Governance Profile stages">
              <span>Registered</span><b>→</b><span>Draft Seeded</span><b>→</b>
              <span>Editorial Review</span><b>→</b><span>Published</span>
            </div>
          </section>

          <section className="controlCard">
            <div className="filterRow" role="group" aria-label="Profile workspace filters">
              {(
                [
                  ['all', 'All', counts.all],
                  ['eligible', 'Eligible', counts.eligible],
                  ['draft', 'Drafts', counts.draft],
                  ['published', 'Published', counts.published],
                  ['archived', 'Archived', counts.archived],
                ] as const
              ).map(([value, text, count]) => (
                <button
                  key={value}
                  type="button"
                  className={filter === value ? 'filter activeFilter' : 'filter'}
                  onClick={() => setFilter(value)}
                >
                  {text}<span>{count}</span>
                </button>
              ))}
            </div>

            <label className="searchBox">
              <span>Search editorial workspace</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Governance, Registry ID, steward, category, profile…"
              />
            </label>
          </section>
        </>
      ) : null}

      {notice ? (
        <section className="noticeCard">
          <span className="noticeDot" aria-hidden="true" />
          <div>
            <p className="eyebrow">EDITORIAL RECORD CREATED</p>
            <strong>{notice}</strong>
            <p>The new record remains a private TA-14 draft until separately edited and published.</p>
          </div>
        </section>
      ) : null}

      {loading ? (
        <section className="stateCard">
          <span className="pulseDot" aria-hidden="true" />
          <div>
            <p className="eyebrow">EDITORIAL WORKSPACE</p>
            <h2>Loading registered entities and Governance Profiles.</h2>
            <p>Checking TA-14 reviewer authority and retrieving the governed editorial state.</p>
          </div>
        </section>
      ) : null}

      {!loading && error ? (
        <section className="stateCard errorCard">
          <div>
            <p className="eyebrow">WORKSPACE ATTENTION</p>
            <h2>The Governance Profile workspace needs attention.</h2>
            <p>{error}</p>
          </div>
          <button type="button" className="primaryButton" onClick={() => void loadWorkspace('refresh')}>
            Try Again
          </button>
        </section>
      ) : null}

      {!loading && !error && reviewerAuthorized && visibleEligible.length === 0 && visibleProfiles.length === 0 ? (
        <section className="stateCard">
          <div>
            <p className="eyebrow">NO MATCHING PROFILE WORK</p>
            <h2>The current editorial workspace is clear.</h2>
            <p>No eligible registered entities or existing Governance Profiles match this filter and search query.</p>
          </div>
        </section>
      ) : null}

      {!loading && !error && reviewerAuthorized && visibleEligible.length > 0 ? (
        <section className="workspaceSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">ELIGIBLE REGISTERED ENTITIES</p>
              <h2>Ready for a TA-14 Governance Profile draft.</h2>
            </div>
            <span>{visibleEligible.length} eligible</span>
          </div>

          <div className="queueGrid">
            {visibleEligible.map((record) => {
              const creating =
                draftState?.busy === true &&
                draftState.registryIdentifier === record.registry_identifier;

              return (
                <article className="recordCard eligibleCard" key={record.id}>
                  <div className="cardTop">
                    <div>
                      <p className="eyebrow">REGISTERED · NO PROFILE YET</p>
                      <h2>{record.governance_name}</h2>
                    </div>
                    <span className="statusBadge status-eligible">Eligible</span>
                  </div>

                  <p className="registryId">{record.registry_identifier}</p>

                  <dl className="detailGrid">
                    <div><dt>Short name</dt><dd>{record.short_name || 'Not declared'}</dd></div>
                    <div><dt>Category</dt><dd>{label(record.category)}</dd></div>
                    <div><dt>Version</dt><dd>{record.version || 'Not declared'}</dd></div>
                    <div><dt>Steward</dt><dd>{record.steward || 'Not declared'}</dd></div>
                    <div><dt>Registered</dt><dd>{formatDate(record.registered_at)}</dd></div>
                    <div><dt>Evidence records</dt><dd>{record.evidence_count ?? 0}</dd></div>
                  </dl>

                  {record.summary ? (
                    <div className="summaryBox">
                      <span>Registry summary</span>
                      <p>{record.summary}</p>
                    </div>
                  ) : null}

                  <div className="cardFooter">
                    <p>
                      Create a private TA-14 editorial draft seeded only with registered identity and public baseline information. No TA-14 commentary is invented by this operation.
                    </p>
                    <button
                      type="button"
                      className="primaryButton"
                      disabled={creating}
                      onClick={() => void createDraft(record)}
                    >
                      {creating ? 'Creating Draft…' : 'Create Profile Draft'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {!loading && !error && reviewerAuthorized && visibleProfiles.length > 0 ? (
        <section className="workspaceSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">TA-14 GOVERNANCE PROFILES</p>
              <h2>Existing editorial records.</h2>
            </div>
            <span>{visibleProfiles.length} shown</span>
          </div>

          <div className="queueGrid">
            {visibleProfiles.map((profile) => {
              const status = normalizedStatus(profile.profile_status);
              const published = status === 'published';

              return (
                <article className="recordCard profileCard" key={profile.id}>
                  <div className="cardTop">
                    <div>
                      <p className="eyebrow">PROFILE {profileNumber(profile.profile_number)}</p>
                      <h2>{profile.profile_title}</h2>
                    </div>
                    <span className={`statusBadge status-${status}`}>
                      {label(profile.profile_status)}
                    </span>
                  </div>

                  <p className="registryId">{profile.registry_identifier}</p>

                  <dl className="detailGrid">
                    <div><dt>Governance</dt><dd>{profile.governance_name}</dd></div>
                    <div><dt>Steward</dt><dd>{profile.steward_name || 'Not declared'}</dd></div>
                    <div><dt>Organization</dt><dd>{profile.organization_name || 'Not declared'}</dd></div>
                    <div><dt>Version</dt><dd>{profile.governance_version || 'Not recorded'}</dd></div>
                    <div><dt>Last updated</dt><dd>{formatDate(profile.updated_at)}</dd></div>
                    <div><dt>Published</dt><dd>{formatDate(profile.published_at)}</dd></div>
                  </dl>

                  {profile.profile_subtitle ? (
                    <div className="summaryBox">
                      <span>Profile subtitle</span>
                      <p>{profile.profile_subtitle}</p>
                    </div>
                  ) : null}

                  <div className="cardFooter">
                    <p>
                      {published
                        ? 'This profile is currently public. Editing should preserve publication boundaries and the Registry baseline.'
                        : 'This profile remains unpublished TA-14 editorial work and is not visible through the public profile directory.'}
                    </p>
                    <div className="cardActions">
                      <Link
                        href={`/workspace/ai-governance/registry/profiles/editor/${encodeURIComponent(profile.id)}`}
                        className="primaryButton"
                      >
                        Edit Profile
                      </Link>
                      {published ? (
                        <Link
                          href={`/workspace/ai-governance/registry/profiles/${encodeURIComponent(profile.slug)}`}
                          className="secondaryButton"
                        >
                          Open Public Profile
                        </Link>
                      ) : null}
                      <Link
                        href={`/workspace/ai-governance/registry/public/${encodeURIComponent(profile.registry_identifier)}`}
                        className="secondaryButton"
                      >
                        Registry Baseline
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="workflowBoundary">
        <div>
          <p className="eyebrow">NO BUILD-BEFORE-BASELINE</p>
          <h2>Profile creation does not authorize architecture shaping.</h2>
          <p>
            The Governance Profile layer introduces registered work and preserves TA-14 institutional commentary. It does not grant a registrant certification, partnership status, implementation guidance, review findings, or access to TA-14 architecture-building work.
          </p>
        </div>

        <div className="workflowSteps">
          <div><span>01</span><strong>Register</strong><p>Registrant establishes the attributable baseline.</p></div>
          <div><span>02</span><strong>Seed Draft</strong><p>TA-14 creates a controlled editorial record.</p></div>
          <div><span>03</span><strong>Edit</strong><p>TA-14 authors source-grounded institutional commentary.</p></div>
          <div><span>04</span><strong>Publish</strong><p>Only approved commentary enters the public profile directory.</p></div>
        </div>
      </section>

      <style jsx global>{styles}</style>
    </main>
  );
}

const styles = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background:
      radial-gradient(circle at 10% 8%, rgba(72, 122, 255, 0.18), transparent 32rem),
      radial-gradient(circle at 88% 12%, rgba(103, 231, 195, 0.12), transparent 30rem),
      radial-gradient(circle at 50% 95%, rgba(255, 184, 82, 0.08), transparent 32rem),
      #07101f;
    color: #eef4ff;
  }
  button, input { font: inherit; }
  button:disabled { cursor: wait; opacity: .62; }
  .pageShell { position: relative; min-height: 100vh; overflow: hidden; padding: 32px 24px 88px; }
  .pageShell > *:not(.stars):not(.orbit) { position: relative; z-index: 2; }
  .stars { position: fixed; inset: 0; pointer-events: none; opacity: .42; background-image: radial-gradient(circle, rgba(255,255,255,.8) 0 1px, transparent 1.3px); background-size: 54px 54px; animation: starDrift 28s linear infinite; }
  .starsTwo { opacity: .18; background-size: 86px 86px; animation-duration: 48s; animation-direction: reverse; }
  .orbit { position: fixed; width: 430px; height: 430px; border: 1px solid rgba(127,228,196,.12); border-radius: 50%; pointer-events: none; animation: rotateOrbit 36s linear infinite; }
  .orbit::after { content: ''; position: absolute; width: 8px; height: 8px; top: 22px; left: 210px; border-radius: 50%; background: rgba(127,228,196,.85); box-shadow: 0 0 24px rgba(127,228,196,.9); }
  .orbitOne { top: 4%; right: -200px; }
  .orbitTwo { width: 540px; height: 540px; left: -250px; bottom: 2%; animation-duration: 52s; animation-direction: reverse; }
  .topBar,.hero,.authorityStrip,.controlCard,.noticeCard,.workspaceSection,.stateCard,.workflowBoundary { width: min(1180px,100%); margin-inline: auto; }
  .topBar { margin-bottom: 38px; display: flex; align-items: center; justify-content: space-between; gap: 18px; }
  .topBarLinks { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .hero { margin-bottom: 18px; display: grid; grid-template-columns: minmax(0,1.35fr) minmax(280px,.65fr); gap: 24px; }
  .hero > div,.boundaryPanel,.authorityStrip,.controlCard,.noticeCard,.recordCard,.stateCard,.workflowBoundary { border: 1px solid rgba(164,190,231,.18); background: rgba(11,25,47,.86); box-shadow: 0 24px 80px rgba(0,0,0,.25); backdrop-filter: blur(18px); border-radius: 24px; }
  .hero > div { padding: clamp(28px,5vw,52px); }
  .boundaryPanel { padding: 26px; display: flex; flex-direction: column; justify-content: center; }
  .boundaryPanel strong { margin-bottom: 12px; font-size: 1.7rem; }
  h1,h2,p { margin-top: 0; }
  h1 { margin-bottom: 18px; font-size: clamp(2.8rem,6vw,5.8rem); line-height: .95; letter-spacing: -.055em; }
  h2 { margin-bottom: 10px; font-size: clamp(1.45rem,2.8vw,2.2rem); letter-spacing: -.035em; }
  .eyebrow { margin-bottom: 10px; color: #7fe4c4; font-size: .76rem; font-weight: 900; letter-spacing: .18em; }
  .lead,.boundaryPanel p,.recordCard p,.stateCard p,.workflowBoundary p { margin-bottom: 0; color: #aebdd4; line-height: 1.7; }
  .authorityStrip { margin-bottom: 18px; padding: 20px 22px; display: flex; align-items: center; justify-content: space-between; gap: 22px; border-color: rgba(127,228,196,.24); background: linear-gradient(90deg,rgba(17,65,70,.34),rgba(11,25,47,.9)); }
  .authorityStrip strong { display: block; max-width: 610px; color: #e9fff7; line-height: 1.5; }
  .authorityStages { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .authorityStages span { padding: 7px 10px; border: 1px solid rgba(127,228,196,.24); border-radius: 999px; background: rgba(24,83,79,.28); color: #bdf4e3; font-size: .72rem; font-weight: 900; }
  .authorityStages b { color: #ffd27f; }
  .controlCard { margin-bottom: 18px; padding: 20px; display: grid; grid-template-columns: minmax(0,1fr) minmax(280px,.65fr); gap: 20px; align-items: end; }
  .filterRow { display: flex; flex-wrap: wrap; gap: 9px; }
  .filter { min-height: 42px; padding: 8px 12px; display: inline-flex; gap: 8px; align-items: center; border: 1px solid rgba(164,190,231,.2); border-radius: 999px; background: rgba(8,19,37,.58); color: #c3cee0; font-weight: 850; cursor: pointer; }
  .filter span { min-width: 24px; padding: 3px 6px; border-radius: 999px; background: rgba(127,228,196,.12); color: #9ff0d6; text-align: center; font-size: .76rem; }
  .activeFilter { border-color: rgba(127,228,196,.55); background: rgba(31,71,91,.6); color: #effff9; }
  .searchBox { display: grid; gap: 7px; color: #9dadc3; font-size: .74rem; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; }
  .searchBox input { min-height: 46px; width: 100%; border: 1px solid rgba(164,190,231,.22); border-radius: 12px; outline: none; padding: 0 14px; background: rgba(7,17,33,.72); color: #eef4ff; }
  .searchBox input:focus { border-color: rgba(127,228,196,.7); box-shadow: 0 0 0 3px rgba(127,228,196,.08); }
  .noticeCard { margin-bottom: 18px; padding: 20px 22px; display: flex; align-items: center; gap: 18px; border-color: rgba(255,210,127,.3); background: rgba(85,58,17,.32); }
  .noticeCard strong { color: #fff0c6; }
  .noticeCard p { margin: 5px 0 0; color: #c8d3e4; }
  .noticeDot,.pulseDot { width: 16px; height: 16px; flex: 0 0 auto; border-radius: 50%; }
  .noticeDot { background: #ffd27f; box-shadow: 0 0 28px rgba(255,210,127,.7); }
  .pulseDot { background: #7fe4c4; box-shadow: 0 0 28px rgba(127,228,196,.9); animation: pulse 1.5s ease-in-out infinite; }
  .workspaceSection { margin-top: 24px; }
  .sectionHeading { margin-bottom: 14px; display: flex; justify-content: space-between; align-items: end; gap: 20px; }
  .sectionHeading h2 { margin-bottom: 0; }
  .sectionHeading > span { color: #8ea1bd; font-size: .82rem; font-weight: 800; }
  .queueGrid { display: grid; gap: 16px; }
  .recordCard { padding: 24px; }
  .eligibleCard { border-color: rgba(255,210,127,.24); background: radial-gradient(circle at 100% 0%,rgba(255,210,127,.08),transparent 24rem),rgba(11,25,47,.88); }
  .profileCard { background: radial-gradient(circle at 100% 0%,rgba(127,228,196,.06),transparent 22rem),rgba(11,25,47,.88); }
  .cardTop,.cardFooter { display: flex; align-items: flex-start; justify-content: space-between; gap: 22px; }
  .statusBadge { padding: 8px 11px; flex: 0 0 auto; border: 1px solid rgba(164,190,231,.22); border-radius: 999px; color: #dbe7f9; font-size: .77rem; font-weight: 900; }
  .status-eligible,.status-draft { border-color: rgba(255,210,127,.42); background: rgba(145,91,22,.22); color: #ffe0a8; }
  .status-published { border-color: rgba(127,228,196,.42); background: rgba(34,118,92,.22); color: #bff7e5; }
  .status-archived { border-color: rgba(164,190,231,.28); background: rgba(92,107,132,.2); color: #c8d3e5; }
  .registryId { margin: 2px 0 18px !important; color: #ffd27f !important; font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; font-size: .8rem; overflow-wrap: anywhere; }
  .detailGrid { margin: 0 0 20px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
  .detailGrid > div { min-width: 0; padding: 14px; border: 1px solid rgba(164,190,231,.1); border-radius: 13px; background: rgba(7,17,33,.36); }
  dt { margin-bottom: 6px; color: #8092ae; font-size: .68rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
  dd { margin: 0; line-height: 1.5; overflow-wrap: anywhere; }
  .summaryBox { margin-bottom: 20px; padding: 16px; border: 1px solid rgba(164,190,231,.1); border-radius: 14px; background: rgba(7,17,33,.38); }
  .summaryBox span { display: block; margin-bottom: 7px; color: #8092ae; font-size: .68rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
  .summaryBox p { margin: 0; }
  .cardFooter { align-items: center; padding-top: 18px; border-top: 1px solid rgba(164,190,231,.1); }
  .cardFooter > p { max-width: 690px; }
  .cardActions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
  .stateCard { min-height: 300px; padding: 34px; display: flex; align-items: center; justify-content: space-between; gap: 28px; }
  .errorCard { border-color: rgba(255,124,145,.28); }
  .workflowBoundary { margin-top: 30px; padding: 30px; display: grid; grid-template-columns: minmax(0,.82fr) minmax(0,1.18fr); gap: 28px; border-color: rgba(255,210,127,.2); background: radial-gradient(circle at 0% 0%,rgba(255,210,127,.08),transparent 20rem),rgba(11,25,47,.86); }
  .workflowSteps { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
  .workflowSteps > div { padding: 16px; border: 1px solid rgba(164,190,231,.1); border-radius: 14px; background: rgba(7,17,33,.38); }
  .workflowSteps span { display: block; margin-bottom: 7px; color: #ffd27f; font-size: .72rem; font-weight: 900; letter-spacing: .1em; }
  .workflowSteps strong { display: block; margin-bottom: 7px; color: #eef4ff; }
  .workflowSteps p { margin: 0; font-size: .85rem; }
  .primaryButton,.secondaryButton { min-height: 46px; padding: 11px 17px; display: inline-flex; align-items: center; justify-content: center; border-radius: 13px; font-weight: 900; text-decoration: none; cursor: pointer; }
  .primaryButton { border: 1px solid rgba(255,226,167,.72); background: linear-gradient(135deg,#ffe4a6,#e8a33d); color: #171005; }
  .secondaryButton { border: 1px solid rgba(164,190,231,.3); background: rgba(15,34,63,.74); color: #eef4ff; }
  .textLink { color: #9ec8ff; font-weight: 800; text-decoration: none; }
  @keyframes starDrift { from { transform: translate3d(0,0,0); } to { transform: translate3d(54px,54px,0); } }
  @keyframes rotateOrbit { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { transform: scale(.85); opacity: .6; } 50% { transform: scale(1.2); opacity: 1; } }
  @media (max-width: 920px) {
    .hero,.controlCard,.detailGrid,.workflowBoundary { grid-template-columns: 1fr; }
    .authorityStrip,.cardFooter { align-items: stretch; flex-direction: column; }
    .cardActions { justify-content: flex-start; }
  }
  @media (max-width: 650px) {
    .pageShell { padding-inline: 16px; }
    .topBar,.topBarLinks,.cardTop,.stateCard,.sectionHeading { align-items: stretch; flex-direction: column; }
    .workflowSteps { grid-template-columns: 1fr; }
    .primaryButton,.secondaryButton { width: 100%; }
  }
  @media (prefers-reduced-motion: reduce) {
    .stars,.orbit,.pulseDot { animation: none; }
  }
`;
