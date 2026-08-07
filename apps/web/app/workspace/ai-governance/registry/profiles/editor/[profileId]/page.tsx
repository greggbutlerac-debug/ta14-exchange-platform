'use client';

import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

type GovernanceProfile = {
  id: string;
  profile_number: number;
  slug: string;
  profile_status: string;
  registry_identifier: string;
  registry_public_record_id: string | null;
  registry_source_record_id: string | null;
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
  related_registry_identifiers: string[];
  related_demonstration_identifiers: string[];
  tags: string[];
  is_featured: boolean;
  editorial_priority: number;
  publication_boundary: string;
  non_claims: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  archived_at: string | null;
};

type FormState = {
  profile_title: string;
  profile_subtitle: string;
  profile_deck: string;
  public_summary: string;
  who_they_are_markdown: string;
  what_they_are_building_markdown: string;
  what_they_declared_markdown: string;
  why_ta14_is_paying_attention_markdown: string;
  registration_meaning_markdown: string;
  governed_work_markdown: string;
  ta14_commentary_markdown: string;
  primary_website: string;
  profile_image_url: string;
  profile_image_alt: string;
  tags: string;
  related_registry_identifiers: string;
  related_demonstration_identifiers: string;
  is_featured: boolean;
  editorial_priority: string;
  publication_boundary: string;
  non_claims: string;
};

function toForm(profile: GovernanceProfile): FormState {
  return {
    profile_title: profile.profile_title ?? '',
    profile_subtitle: profile.profile_subtitle ?? '',
    profile_deck: profile.profile_deck ?? '',
    public_summary: profile.public_summary ?? '',
    who_they_are_markdown: profile.who_they_are_markdown ?? '',
    what_they_are_building_markdown: profile.what_they_are_building_markdown ?? '',
    what_they_declared_markdown: profile.what_they_declared_markdown ?? '',
    why_ta14_is_paying_attention_markdown:
      profile.why_ta14_is_paying_attention_markdown ?? '',
    registration_meaning_markdown: profile.registration_meaning_markdown ?? '',
    governed_work_markdown: profile.governed_work_markdown ?? '',
    ta14_commentary_markdown: profile.ta14_commentary_markdown ?? '',
    primary_website: profile.primary_website ?? '',
    profile_image_url: profile.profile_image_url ?? '',
    profile_image_alt: profile.profile_image_alt ?? '',
    tags: (profile.tags ?? []).join(', '),
    related_registry_identifiers:
      (profile.related_registry_identifiers ?? []).join(', '),
    related_demonstration_identifiers:
      (profile.related_demonstration_identifiers ?? []).join(', '),
    is_featured: profile.is_featured,
    editorial_priority: String(profile.editorial_priority ?? 0),
    publication_boundary: profile.publication_boundary ?? '',
    non_claims: profile.non_claims ?? '',
  };
}

function csv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function nullable(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function formatDate(value: string | null) {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function profileNumber(value: number) {
  return String(value).padStart(3, '0');
}

function label(value: string | null | undefined) {
  if (!value?.trim()) return 'Not declared';
  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function GovernanceProfileEditorRecordPage() {
  const params = useParams<{ profileId: string }>();
  const profileId = params?.profileId ?? '';

  const [profile, setProfile] = useState<GovernanceProfile | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return null;
    return createBrowserClient(url, anonKey);
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
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
        throw new Error('Your TA-14 institutional session is missing or expired.');
      }

      const { data: reviewer, error: reviewerError } = await supabase.rpc(
        'ta14_registry_is_reviewer',
      );

      if (reviewerError) throw reviewerError;

      const isAuthorized = reviewer === true;
      setAuthorized(isAuthorized);

      if (!isAuthorized) return;

      const { data, error: profileError } = await supabase
        .from('ta14_governance_profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (profileError) throw profileError;

      const loaded = data as unknown as GovernanceProfile;
      setProfile(loaded);
      setForm(toForm(loaded));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'The Governance Profile could not be loaded.',
      );
    } finally {
      setLoading(false);
    }
  }, [profileId, supabase]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
    setNotice('');
  }

  async function saveDraft() {
    if (!supabase || !profile || !form) return;

    setSaving(true);
    setError('');
    setNotice('');

    try {
      const priority = Number.parseInt(form.editorial_priority, 10);

      const updates = {
        profile_title: form.profile_title.trim(),
        profile_subtitle: nullable(form.profile_subtitle),
        profile_deck: nullable(form.profile_deck),
        public_summary: nullable(form.public_summary),
        who_they_are_markdown: nullable(form.who_they_are_markdown),
        what_they_are_building_markdown: nullable(
          form.what_they_are_building_markdown,
        ),
        what_they_declared_markdown: nullable(form.what_they_declared_markdown),
        why_ta14_is_paying_attention_markdown: nullable(
          form.why_ta14_is_paying_attention_markdown,
        ),
        registration_meaning_markdown: nullable(
          form.registration_meaning_markdown,
        ),
        governed_work_markdown: nullable(form.governed_work_markdown),
        ta14_commentary_markdown: nullable(form.ta14_commentary_markdown),
        primary_website: nullable(form.primary_website),
        profile_image_url: nullable(form.profile_image_url),
        profile_image_alt: nullable(form.profile_image_alt),
        tags: csv(form.tags),
        related_registry_identifiers: csv(form.related_registry_identifiers),
        related_demonstration_identifiers: csv(
          form.related_demonstration_identifiers,
        ),
        is_featured: form.is_featured,
        editorial_priority: Number.isFinite(priority) ? priority : 0,
        publication_boundary: form.publication_boundary.trim(),
        non_claims: nullable(form.non_claims),
        updated_at: new Date().toISOString(),
      };

      if (!updates.profile_title) {
        throw new Error('Profile title is required.');
      }

      if (!updates.publication_boundary) {
        throw new Error('Publication boundary is required.');
      }

      const { data, error: updateError } = await supabase
        .from('ta14_governance_profiles')
        .update(updates)
        .eq('id', profile.id)
        .select('*')
        .single();

      if (updateError) throw updateError;

      const saved = data as unknown as GovernanceProfile;
      setProfile(saved);
      setForm(toForm(saved));
      setNotice('Editorial changes saved.');
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'The Governance Profile could not be saved.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="pageShell">
        <section className="stateCard">
          <span className="pulseDot" aria-hidden="true" />
          <div>
            <p className="eyebrow">GOVERNANCE PROFILE EDITOR</p>
            <h1>Loading controlled editorial record.</h1>
          </div>
        </section>
        <style jsx global>{styles}</style>
      </main>
    );
  }

  if (authorized === false) {
    return (
      <main className="pageShell">
        <section className="stateCard errorCard">
          <div>
            <p className="eyebrow">AUTHORITY REQUIRED</p>
            <h1>TA-14 reviewer/editor authority is required.</h1>
            <p>This editorial record is not available to this account.</p>
          </div>
          <Link
            className="secondaryButton"
            href="/workspace/ai-governance/registry/profiles/editor"
          >
            Return to Editor
          </Link>
        </section>
        <style jsx global>{styles}</style>
      </main>
    );
  }

  if (!profile || !form) {
    return (
      <main className="pageShell">
        <section className="stateCard errorCard">
          <div>
            <p className="eyebrow">PROFILE UNAVAILABLE</p>
            <h1>The requested editorial record could not be opened.</h1>
            <p>{error || 'No matching Governance Profile was found.'}</p>
          </div>
        </section>
        <style jsx global>{styles}</style>
      </main>
    );
  }

  const published = profile.profile_status.toLowerCase() === 'published';

  return (
    <main className="pageShell">
      <nav className="topBar">
        <Link
          className="secondaryButton"
          href="/workspace/ai-governance/registry/profiles/editor"
        >
          ← Profile Editor
        </Link>

        <div className="topLinks">
          <Link
            className="textLink"
            href={`/workspace/ai-governance/registry/public/${encodeURIComponent(
              profile.registry_identifier,
            )}`}
          >
            Registry Baseline
          </Link>

          {published ? (
            <Link
              className="textLink"
              href={`/workspace/ai-governance/registry/profiles/${encodeURIComponent(
                profile.slug,
              )}`}
            >
              Public Profile
            </Link>
          ) : null}
        </div>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">
            TA-14 GOVERNANCE PROFILE {profileNumber(profile.profile_number)}
          </p>
          <h1>{profile.profile_title}</h1>
          <p className="lead">
            Controlled TA-14 institutional commentary anchored to the permanent
            Registry baseline for {profile.governance_name}.
          </p>
        </div>

        <aside className="statusPanel">
          <span className={`status status-${profile.profile_status.toLowerCase()}`}>
            {label(profile.profile_status)}
          </span>
          <dl>
            <div>
              <dt>Registry ID</dt>
              <dd>{profile.registry_identifier}</dd>
            </div>
            <div>
              <dt>Governance</dt>
              <dd>{profile.governance_name}</dd>
            </div>
            <div>
              <dt>Steward</dt>
              <dd>{profile.steward_name || 'Not declared'}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{formatDate(profile.updated_at)}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="boundary">
        <div>
          <p className="eyebrow">EDITORIAL SEPARATION</p>
          <strong>The Registry declaration is not editable here.</strong>
          <p>
            Governance identity, version, steward, category, registration date,
            and the permanent Registry Identifier remain anchored to the
            registered record. This page edits only the separate TA-14
            Governance Profile publication layer.
          </p>
        </div>
      </section>

      {error ? (
        <section className="message errorCard">
          <strong>Editor attention</strong>
          <p>{error}</p>
        </section>
      ) : null}

      {notice ? (
        <section className="message successCard">
          <strong>{notice}</strong>
          <p>The Registry baseline was not altered.</p>
        </section>
      ) : null}

      <section className="editorGrid">
        <div className="editorMain">
          <EditorSection
            eyebrow="PUBLIC INTRODUCTION"
            title="Profile identity and opening narrative"
            description="Author the public-facing TA-14 introduction without changing the registered identity."
          >
            <Field label="Profile title">
              <input
                value={form.profile_title}
                onChange={(event) => setField('profile_title', event.target.value)}
              />
            </Field>

            <Field label="Profile subtitle">
              <input
                value={form.profile_subtitle}
                onChange={(event) =>
                  setField('profile_subtitle', event.target.value)
                }
              />
            </Field>

            <Field label="Profile deck">
              <textarea
                rows={4}
                value={form.profile_deck}
                onChange={(event) => setField('profile_deck', event.target.value)}
              />
            </Field>

            <Field label="Public summary">
              <textarea
                rows={6}
                value={form.public_summary}
                onChange={(event) =>
                  setField('public_summary', event.target.value)
                }
              />
            </Field>
          </EditorSection>

          <EditorSection
            eyebrow="PEOPLE & STEWARDSHIP"
            title="Who they are"
            description="Describe the steward and organization from attributable source material."
          >
            <Field label="Who they are — Markdown">
              <textarea
                rows={10}
                value={form.who_they_are_markdown}
                onChange={(event) =>
                  setField('who_they_are_markdown', event.target.value)
                }
              />
            </Field>
          </EditorSection>

          <EditorSection
            eyebrow="ARCHITECTURE"
            title="What they are building"
            description="Explain the architecture in its own bounded identity."
          >
            <Field label="What they are building — Markdown">
              <textarea
                rows={12}
                value={form.what_they_are_building_markdown}
                onChange={(event) =>
                  setField('what_they_are_building_markdown', event.target.value)
                }
              />
            </Field>
          </EditorSection>

          <EditorSection
            eyebrow="REGISTERED DECLARATION"
            title="What they declared"
            description="Keep claims and non-claims grounded in the registered baseline."
          >
            <Field label="What they declared — Markdown">
              <textarea
                rows={12}
                value={form.what_they_declared_markdown}
                onChange={(event) =>
                  setField('what_they_declared_markdown', event.target.value)
                }
              />
            </Field>
          </EditorSection>

          <EditorSection
            eyebrow="TA-14 INSTITUTIONAL VIEW"
            title="Why TA-14 is paying attention"
            description="This is TA-14 commentary. Keep it clearly separate from the registrant declaration."
          >
            <Field label="Why TA-14 is paying attention — Markdown">
              <textarea
                rows={12}
                value={form.why_ta14_is_paying_attention_markdown}
                onChange={(event) =>
                  setField(
                    'why_ta14_is_paying_attention_markdown',
                    event.target.value,
                  )
                }
              />
            </Field>
          </EditorSection>

          <EditorSection
            eyebrow="REGISTRATION BOUNDARY"
            title="What registration means"
            description="Preserve the distinction between recording a declaration and validating it."
          >
            <Field label="Registration meaning — Markdown">
              <textarea
                rows={10}
                value={form.registration_meaning_markdown}
                onChange={(event) =>
                  setField('registration_meaning_markdown', event.target.value)
                }
              />
            </Field>
          </EditorSection>

          <EditorSection
            eyebrow="GOVERNED CONTINUATION"
            title="Work that may follow"
            description="Connect future demonstrations, reviews, artifacts, or version history without pre-judging them."
          >
            <Field label="Governed work — Markdown">
              <textarea
                rows={10}
                value={form.governed_work_markdown}
                onChange={(event) =>
                  setField('governed_work_markdown', event.target.value)
                }
              />
            </Field>
          </EditorSection>

          <EditorSection
            eyebrow="TA-14 COMMENTARY"
            title="Why this profile matters"
            description="Institutional commentary should explain significance without becoming certification or comparative superiority."
          >
            <Field label="TA-14 commentary — Markdown">
              <textarea
                rows={12}
                value={form.ta14_commentary_markdown}
                onChange={(event) =>
                  setField('ta14_commentary_markdown', event.target.value)
                }
              />
            </Field>
          </EditorSection>

          <EditorSection
            eyebrow="PUBLICATION BOUNDARY"
            title="Explicit non-claims"
            description="These fields travel with the profile to prevent registration or publication from being mistaken for validation."
          >
            <Field label="Publication boundary">
              <textarea
                rows={6}
                value={form.publication_boundary}
                onChange={(event) =>
                  setField('publication_boundary', event.target.value)
                }
              />
            </Field>

            <Field label="Explicit non-claims">
              <textarea
                rows={8}
                value={form.non_claims}
                onChange={(event) => setField('non_claims', event.target.value)}
              />
            </Field>
          </EditorSection>
        </div>

        <aside className="editorSidebar">
          <section className="sideCard">
            <p className="eyebrow">REGISTRY BASELINE</p>
            <h2>Read-only identity</h2>
            <dl className="baselineList">
              <div>
                <dt>Registry identifier</dt>
                <dd>{profile.registry_identifier}</dd>
              </div>
              <div>
                <dt>Governance</dt>
                <dd>{profile.governance_name}</dd>
              </div>
              <div>
                <dt>Version</dt>
                <dd>{profile.governance_version || 'Not recorded'}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{label(profile.governance_category)}</dd>
              </div>
              <div>
                <dt>Steward</dt>
                <dd>{profile.steward_name || 'Not declared'}</dd>
              </div>
              <div>
                <dt>Organization</dt>
                <dd>{profile.organization_name || 'Not declared'}</dd>
              </div>
              <div>
                <dt>Registered</dt>
                <dd>{formatDate(profile.registered_at)}</dd>
              </div>
            </dl>
          </section>

          <section className="sideCard">
            <p className="eyebrow">PUBLIC REFERENCES</p>
            <h2>Links and media</h2>

            <Field label="Primary website">
              <input
                value={form.primary_website}
                onChange={(event) =>
                  setField('primary_website', event.target.value)
                }
              />
            </Field>

            <Field label="Profile image URL">
              <input
                value={form.profile_image_url}
                onChange={(event) =>
                  setField('profile_image_url', event.target.value)
                }
              />
            </Field>

            <Field label="Profile image alt text">
              <input
                value={form.profile_image_alt}
                onChange={(event) =>
                  setField('profile_image_alt', event.target.value)
                }
              />
            </Field>
          </section>

          <section className="sideCard">
            <p className="eyebrow">RELATIONSHIPS</p>
            <h2>Connected records</h2>

            <Field label="Related Registry IDs — comma separated">
              <textarea
                rows={4}
                value={form.related_registry_identifiers}
                onChange={(event) =>
                  setField('related_registry_identifiers', event.target.value)
                }
              />
            </Field>

            <Field label="Related demonstration IDs — comma separated">
              <textarea
                rows={4}
                value={form.related_demonstration_identifiers}
                onChange={(event) =>
                  setField(
                    'related_demonstration_identifiers',
                    event.target.value,
                  )
                }
              />
            </Field>

            <Field label="Tags — comma separated">
              <textarea
                rows={4}
                value={form.tags}
                onChange={(event) => setField('tags', event.target.value)}
              />
            </Field>
          </section>

          <section className="sideCard">
            <p className="eyebrow">EDITORIAL CONTROL</p>
            <h2>Placement</h2>

            <label className="checkRow">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(event) =>
                  setField('is_featured', event.target.checked)
                }
              />
              <span>
                <strong>Featured profile</strong>
                <small>Controls editorial prominence, not validity.</small>
              </span>
            </label>

            <Field label="Editorial priority">
              <input
                inputMode="numeric"
                value={form.editorial_priority}
                onChange={(event) =>
                  setField('editorial_priority', event.target.value)
                }
              />
            </Field>
          </section>

          <section className="saveCard">
            <p className="eyebrow">CONTROLLED SAVE</p>
            <h2>Preserve editorial work</h2>
            <p>
              Saving changes updates only the TA-14 Governance Profile. It does
              not alter the underlying Registry record or publish a draft.
            </p>

            <button
              type="button"
              className="primaryButton"
              disabled={saving}
              onClick={() => void saveDraft()}
            >
              {saving ? 'Saving…' : 'Save Editorial Changes'}
            </button>
          </section>
        </aside>
      </section>

      <style jsx global>{styles}</style>
    </main>
  );
}

function EditorSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="editorSection">
      <div className="sectionIntro">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="fieldStack">{children}</div>
    </section>
  );
}

function Field({
  label: fieldLabel,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{fieldLabel}</span>
      {children}
    </label>
  );
}

const styles = `
  * { box-sizing: border-box; }

  body {
    margin: 0;
    background:
      radial-gradient(circle at 10% 8%, rgba(72,122,255,.16), transparent 32rem),
      radial-gradient(circle at 90% 14%, rgba(103,231,195,.10), transparent 30rem),
      #07101f;
    color: #eef4ff;
  }

  button, input, textarea { font: inherit; }

  .pageShell {
    min-height: 100vh;
    padding: 32px 24px 90px;
  }

  .topBar,
  .hero,
  .boundary,
  .message,
  .editorGrid,
  .stateCard {
    width: min(1240px, 100%);
    margin-inline: auto;
  }

  .topBar {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
  }

  .topLinks {
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(300px, .65fr);
    gap: 20px;
    margin-bottom: 18px;
  }

  .hero > div,
  .statusPanel,
  .boundary,
  .message,
  .editorSection,
  .sideCard,
  .saveCard,
  .stateCard {
    border: 1px solid rgba(164,190,231,.18);
    border-radius: 24px;
    background: rgba(11,25,47,.88);
    box-shadow: 0 24px 80px rgba(0,0,0,.24);
  }

  .hero > div {
    padding: clamp(28px, 5vw, 52px);
  }

  .statusPanel {
    padding: 26px;
  }

  h1, h2, p { margin-top: 0; }

  h1 {
    margin-bottom: 18px;
    font-size: clamp(2.6rem, 5vw, 5.4rem);
    line-height: .96;
    letter-spacing: -.05em;
  }

  h2 {
    margin-bottom: 10px;
    font-size: clamp(1.35rem, 2.5vw, 2rem);
    letter-spacing: -.03em;
  }

  .lead,
  .sectionIntro p,
  .boundary p,
  .message p,
  .saveCard p,
  .stateCard p {
    color: #aebdd4;
    line-height: 1.7;
  }

  .eyebrow {
    margin-bottom: 9px;
    color: #7fe4c4;
    font-size: .74rem;
    font-weight: 900;
    letter-spacing: .17em;
  }

  .status {
    display: inline-flex;
    margin-bottom: 18px;
    padding: 8px 11px;
    border-radius: 999px;
    font-size: .76rem;
    font-weight: 900;
  }

  .status-draft {
    border: 1px solid rgba(255,210,127,.42);
    background: rgba(145,91,22,.22);
    color: #ffe0a8;
  }

  .status-published {
    border: 1px solid rgba(127,228,196,.42);
    background: rgba(34,118,92,.22);
    color: #bff7e5;
  }

  .statusPanel dl,
  .baselineList {
    margin: 0;
    display: grid;
    gap: 11px;
  }

  .statusPanel dl > div,
  .baselineList > div {
    padding: 12px;
    border: 1px solid rgba(164,190,231,.10);
    border-radius: 12px;
    background: rgba(7,17,33,.34);
  }

  dt {
    margin-bottom: 5px;
    color: #8092ae;
    font-size: .67rem;
    font-weight: 900;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    overflow-wrap: anywhere;
    line-height: 1.45;
  }

  .boundary {
    margin-bottom: 18px;
    padding: 22px 26px;
    border-color: rgba(255,210,127,.24);
  }

  .boundary strong {
    display: block;
    margin-bottom: 8px;
    color: #fff0c6;
    font-size: 1.15rem;
  }

  .boundary p { margin-bottom: 0; }

  .message {
    margin-bottom: 18px;
    padding: 18px 22px;
  }

  .message strong { display: block; margin-bottom: 5px; }
  .message p { margin-bottom: 0; }

  .errorCard { border-color: rgba(255,124,145,.30); }
  .successCard { border-color: rgba(127,228,196,.32); }

  .editorGrid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 20px;
    align-items: start;
  }

  .editorMain {
    display: grid;
    gap: 18px;
  }

  .editorSidebar {
    position: sticky;
    top: 20px;
    display: grid;
    gap: 16px;
  }

  .editorSection,
  .sideCard,
  .saveCard {
    padding: 24px;
  }

  .sectionIntro {
    margin-bottom: 20px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(164,190,231,.10);
  }

  .sectionIntro p:last-child { margin-bottom: 0; }

  .fieldStack {
    display: grid;
    gap: 16px;
  }

  .field {
    display: grid;
    gap: 7px;
  }

  .field > span {
    color: #9dadc3;
    font-size: .72rem;
    font-weight: 900;
    letter-spacing: .06em;
    text-transform: uppercase;
  }

  .field input,
  .field textarea {
    width: 100%;
    border: 1px solid rgba(164,190,231,.22);
    border-radius: 12px;
    outline: none;
    padding: 12px 13px;
    background: rgba(7,17,33,.72);
    color: #eef4ff;
    line-height: 1.55;
  }

  .field textarea {
    resize: vertical;
    min-height: 100px;
  }

  .field input:focus,
  .field textarea:focus {
    border-color: rgba(127,228,196,.68);
    box-shadow: 0 0 0 3px rgba(127,228,196,.08);
  }

  .checkRow {
    margin-bottom: 18px;
    display: flex;
    align-items: flex-start;
    gap: 11px;
    cursor: pointer;
  }

  .checkRow input {
    margin-top: 4px;
    width: 18px;
    height: 18px;
  }

  .checkRow span {
    display: grid;
    gap: 4px;
  }

  .checkRow small {
    color: #8ea1bd;
    line-height: 1.4;
  }

  .saveCard {
    border-color: rgba(255,210,127,.25);
    background:
      radial-gradient(circle at 100% 0%, rgba(255,210,127,.08), transparent 18rem),
      rgba(11,25,47,.9);
  }

  .saveCard .primaryButton { width: 100%; }

  .primaryButton,
  .secondaryButton {
    min-height: 46px;
    padding: 11px 17px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 13px;
    font-weight: 900;
    text-decoration: none;
    cursor: pointer;
  }

  .primaryButton {
    border: 1px solid rgba(255,226,167,.72);
    background: linear-gradient(135deg, #ffe4a6, #e8a33d);
    color: #171005;
  }

  .primaryButton:disabled {
    cursor: wait;
    opacity: .62;
  }

  .secondaryButton {
    border: 1px solid rgba(164,190,231,.30);
    background: rgba(15,34,63,.74);
    color: #eef4ff;
  }

  .textLink {
    color: #9ec8ff;
    font-weight: 800;
    text-decoration: none;
  }

  .stateCard {
    min-height: 320px;
    padding: 34px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
  }

  .pulseDot {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: #7fe4c4;
    box-shadow: 0 0 28px rgba(127,228,196,.9);
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,100% { transform: scale(.85); opacity: .6; }
    50% { transform: scale(1.2); opacity: 1; }
  }

  @media (max-width: 980px) {
    .hero,
    .editorGrid {
      grid-template-columns: 1fr;
    }

    .editorSidebar {
      position: static;
    }
  }

  @media (max-width: 650px) {
    .pageShell { padding-inline: 16px; }

    .topBar,
    .stateCard {
      align-items: stretch;
      flex-direction: column;
    }

    .primaryButton,
    .secondaryButton {
      width: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pulseDot { animation: none; }
  }
`;
