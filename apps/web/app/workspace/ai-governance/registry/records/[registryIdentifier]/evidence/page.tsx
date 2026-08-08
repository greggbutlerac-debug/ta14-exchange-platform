import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = {
  params: Promise<{
    registryIdentifier: string;
  }>;
};

type RegistrySubmission = {
  id: string;
  registry_identifier: string;
  governance_name: string;
  current_version: string | null;
  current_steward: string | null;
  organization_name: string | null;
  status: string;
  record_visibility: string | null;
};

type EvidenceRecord = {
  id: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  sha256_hex: string;
  evidence_relationship: string;
  evidence_classification: string | null;
  description: string;
  visibility: string;
  evidence_state: string;
  source_date: string | null;
  source_url: string | null;
  submitted_at: string | null;
  storage_bucket: string | null;
  storage_path: string | null;
};

function createSupabaseClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
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
          // Existing request cookies remain readable in this Server Component.
        }
      },
    },
  });
}

function normalizeIdentifier(value: string) {
  return decodeURIComponent(value).trim().toUpperCase();
}

function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) return '0 bytes';

  const units = ['bytes', 'KB', 'MB', 'GB'];
  const index = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1,
  );
  const amount = value / 1024 ** index;

  return `${amount.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatDate(value: string | null) {
  if (!value) return 'Not recorded';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(date);
}

function formatDateTime(value: string | null) {
  if (!value) return 'Not recorded';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function statusLabel(value: string) {
  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function visibilityLabel(value: string) {
  if (value === 'public') return 'Public';
  if (value === 'selective') return 'Selective';
  return 'Private';
}

function evidenceCanOpen(record: EvidenceRecord) {
  return Boolean(
    (record.storage_bucket && record.storage_path) || record.source_url,
  );
}

export default async function RegistryEvidenceViewerPage({
  params,
}: PageProps) {
  const { registryIdentifier: routeIdentifier } = await params;
  const registryIdentifier = normalizeIdentifier(routeIdentifier);

  if (!/^TA-14-AIGR-[0-9]{4,}$/.test(registryIdentifier)) {
    notFound();
  }

  const cookieStore = await cookies();
  const supabase = createSupabaseClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: submissionData, error: submissionError } = await supabase
    .from('ai_governance_registry_submissions')
    .select(
      'id, registry_identifier, governance_name, current_version, current_steward, organization_name, status, record_visibility',
    )
    .eq('registry_identifier', registryIdentifier)
    .maybeSingle();

  if (submissionError || !submissionData) {
    notFound();
  }

  const submission = submissionData as RegistrySubmission;

  const { data: evidenceData, error: evidenceError } = await supabase
    .from('ai_governance_registry_evidence')
    .select(
      [
        'id',
        'original_filename',
        'mime_type',
        'size_bytes',
        'sha256_hex',
        'evidence_relationship',
        'evidence_classification',
        'description',
        'visibility',
        'evidence_state',
        'source_date',
        'source_url',
        'submitted_at',
        'storage_bucket',
        'storage_path',
      ].join(','),
    )
    .eq('submission_id', submission.id)
    .order('submitted_at', { ascending: true });

  if (evidenceError) {
    throw new Error(`Unable to load Registry evidence: ${evidenceError.message}`);
  }

  const evidence = (evidenceData ?? []) as EvidenceRecord[];
  const controlledCount = evidence.filter(
    (record) => record.visibility !== 'public',
  ).length;
  const publicCount = evidence.filter(
    (record) => record.visibility === 'public',
  ).length;

  return (
    <main className="evidencePage">
      <div className="starField" aria-hidden="true" />
      <div className="orbit orbitA" aria-hidden="true" />
      <div className="orbit orbitB" aria-hidden="true" />

      <div className="pageInner">
        <nav className="topNav">
          <Link
            href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
              registryIdentifier,
            )}`}
            className="button secondary"
          >
            ← Permanent Registry Record
          </Link>
          <Link
            href="/workspace/ai-governance/registry/directory"
            className="textLink"
          >
            Browse Public Directory
          </Link>
        </nav>

        <header className="hero">
          <p className="eyebrow">TA-14 REGISTRY EVIDENCE VIEWER</p>
          <div className="heroGrid">
            <div>
              <h1>Preserved Evidence</h1>
              <p className="heroLead">
                Evidence records attributable to{' '}
                <strong>{submission.governance_name}</strong> and Registry
                identifier <strong>{registryIdentifier}</strong>.
              </p>
            </div>

            <aside className="identityCard">
              <span className="registryId">{registryIdentifier}</span>
              <dl>
                <div>
                  <dt>Governance</dt>
                  <dd>{submission.governance_name}</dd>
                </div>
                <div>
                  <dt>Version</dt>
                  <dd>{submission.current_version || 'Not recorded'}</dd>
                </div>
                <div>
                  <dt>Steward</dt>
                  <dd>{submission.current_steward || 'Not recorded'}</dd>
                </div>
                {submission.organization_name ? (
                  <div>
                    <dt>Organization</dt>
                    <dd>{submission.organization_name}</dd>
                  </div>
                ) : null}
              </dl>
            </aside>
          </div>
        </header>

        <section className="boundaryCard">
          <div>
            <p className="eyebrow">EVIDENCE ACCESS BOUNDARY</p>
            <h2>Visibility remains governed.</h2>
          </div>
          <p>
            Public readers see only evidence explicitly released as public.
            Registrants can see their own evidence. Authorized TA-14 Registry
            reviewers can inspect preserved public, selective, and private
            evidence for institutional review. Opening evidence does not change
            its visibility or publication state.
          </p>
        </section>

        <section className="metrics">
          <article>
            <span>Visible to this reader</span>
            <strong>{evidence.length}</strong>
            <p>Records returned under the current Registry access policies.</p>
          </article>
          <article>
            <span>Public in this view</span>
            <strong>{publicCount}</strong>
            <p>Evidence explicitly designated public.</p>
          </article>
          <article>
            <span>Controlled in this view</span>
            <strong>{controlledCount}</strong>
            <p>Selective or private evidence visible under authenticated authority.</p>
          </article>
        </section>

        {evidence.length === 0 ? (
          <section className="emptyCard">
            <p className="eyebrow">NO VISIBLE EVIDENCE</p>
            <h2>No evidence records are available to this reader.</h2>
            <p>
              This does not establish that the Registry contains no evidence.
              It means no evidence metadata was returned under the current
              access boundary.
            </p>
          </section>
        ) : (
          <section className="evidenceStack">
            {evidence.map((record, index) => (
              <article className="evidenceCard" key={record.id}>
                <div className="cardTop">
                  <div>
                    <p className="eyebrow">EVIDENCE {index + 1}</p>
                    <h2>{record.original_filename}</h2>
                  </div>
                  <div className="pillRow">
                    <span className={`pill visibility ${record.visibility}`}>
                      {visibilityLabel(record.visibility)}
                    </span>
                    <span className="pill state">
                      {statusLabel(record.evidence_state)}
                    </span>
                  </div>
                </div>

                <p className="description">{record.description}</p>

                <dl className="detailGrid">
                  <div>
                    <dt>Relationship</dt>
                    <dd>{record.evidence_relationship}</dd>
                  </div>
                  <div>
                    <dt>Classification</dt>
                    <dd>{record.evidence_classification || 'Not declared'}</dd>
                  </div>
                  <div>
                    <dt>MIME type</dt>
                    <dd>{record.mime_type}</dd>
                  </div>
                  <div>
                    <dt>Size</dt>
                    <dd>{formatBytes(record.size_bytes)}</dd>
                  </div>
                  <div>
                    <dt>Source date</dt>
                    <dd>{formatDate(record.source_date)}</dd>
                  </div>
                  <div>
                    <dt>Submitted</dt>
                    <dd>{formatDateTime(record.submitted_at)}</dd>
                  </div>
                  <div className="full">
                    <dt>SHA-256</dt>
                    <dd className="hash">{record.sha256_hex}</dd>
                  </div>
                  {record.source_url ? (
                    <div className="full">
                      <dt>Declared source URL</dt>
                      <dd className="urlValue">{record.source_url}</dd>
                    </div>
                  ) : null}
                </dl>

                <div className="actions">
                  {evidenceCanOpen(record) ? (
                    <a
                      href={`/api/registry/evidence/${encodeURIComponent(
                        record.id,
                      )}/open`}
                      className="button primary"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Evidence →
                    </a>
                  ) : (
                    <span className="unavailable">
                      Metadata preserved · no readable object attached
                    </span>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        <section className="readerCard">
          <p className="eyebrow">CURRENT READER</p>
          <h2>{user?.email ? 'Authenticated Registry session' : 'Public session'}</h2>
          <p>
            {user?.email
              ? `Evidence visibility was evaluated under the signed-in session for ${user.email}.`
              : 'Evidence visibility was evaluated under the anonymous public Registry policy.'}
          </p>
          <p className="smallBoundary">
            Registration is not certification. Evidence presence is not a TA-14
            finding. Evidence must still be reviewed within the applicable
            governed scope before any review conclusion is issued.
          </p>
        </section>
      </div>

      <style>{`
        :global(body) { margin: 0; background: #020811; }
        .evidencePage { min-height: 100vh; position: relative; overflow: hidden; background: radial-gradient(circle at 12% 0%, rgba(31,92,151,.25), transparent 31%), radial-gradient(circle at 86% 10%, rgba(208,157,53,.13), transparent 28%), linear-gradient(180deg,#020812 0%,#06121f 48%,#01050a 100%); color: #eef4f8; }
        .starField { position: fixed; inset: 0; opacity: .32; pointer-events: none; background-image: radial-gradient(circle,rgba(255,255,255,.95) 0 1px,transparent 1.4px),radial-gradient(circle,rgba(255,255,255,.55) 0 1px,transparent 1.4px); background-size: 220px 220px, 310px 310px; background-position: 0 0, 91px 137px; animation: drift 44s linear infinite; }
        .orbit { position: fixed; border: 1px solid rgba(79,151,211,.10); border-radius: 50%; pointer-events: none; }
        .orbitA { width: 64vw; height: 64vw; right: -26vw; top: -22vw; animation: spin 70s linear infinite; }
        .orbitB { width: 42vw; height: 42vw; left: -22vw; bottom: -20vw; animation: spin 58s linear infinite reverse; }
        .pageInner { width: min(1220px, calc(100% - 40px)); margin: 0 auto; padding: 34px 0 80px; position: relative; z-index: 1; }
        .topNav { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 54px; }
        .textLink { color: #aec5d8; text-decoration: none; font-weight: 700; font-size: 14px; }
        .button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 16px; border-radius: 11px; text-decoration: none; font-size: 13px; font-weight: 800; }
        .button.secondary { color: #c8d9e6; border: 1px solid rgba(120,165,201,.28); background: rgba(255,255,255,.025); }
        .button.primary { color: #07111c; border: 1px solid rgba(228,185,91,.82); background: linear-gradient(135deg,#e1b65c,#a87724); }
        .hero { margin-bottom: 30px; }
        .heroGrid { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(280px,.6fr); gap: clamp(28px,5vw,68px); align-items: end; }
        .eyebrow { margin: 0 0 11px; color: #d7aa51; font-size: 11px; font-weight: 850; letter-spacing: .15em; text-transform: uppercase; }
        h1 { margin: 0; font-size: clamp(48px,7vw,88px); line-height: .98; letter-spacing: -.05em; }
        .heroLead { max-width: 790px; margin: 24px 0 0; color: #a9bdce; font-size: clamp(17px,2vw,21px); line-height: 1.75; }
        .heroLead strong { color: #edc673; }
        .identityCard, .boundaryCard, .evidenceCard, .readerCard, .emptyCard { border: 1px solid rgba(112,157,196,.18); border-radius: 24px; background: linear-gradient(145deg,rgba(8,27,46,.88),rgba(4,15,27,.95)); box-shadow: 0 24px 70px rgba(0,0,0,.22); }
        .identityCard { padding: 24px; border-color: rgba(215,170,81,.26); }
        .registryId { display: block; color: #efc56f; font-size: 20px; font-weight: 850; margin-bottom: 14px; word-break: break-word; }
        .identityCard dl { margin: 0; }
        .identityCard dl div { padding: 11px 0; border-top: 1px solid rgba(255,255,255,.06); }
        dt { color: #738da3; font-size: 10px; font-weight: 850; letter-spacing: .13em; text-transform: uppercase; margin-bottom: 5px; }
        dd { margin: 0; color: #dce7ef; line-height: 1.55; }
        .boundaryCard { display: grid; grid-template-columns: minmax(260px,.55fr) minmax(0,1.45fr); gap: 32px; padding: 28px; margin: 34px 0 20px; border-color: rgba(215,170,81,.27); background: linear-gradient(135deg,rgba(31,24,10,.7),rgba(6,21,37,.94)); }
        .boundaryCard h2, .readerCard h2, .emptyCard h2 { margin: 0; font-size: clamp(25px,3vw,37px); letter-spacing: -.03em; }
        .boundaryCard > p, .readerCard > p, .emptyCard > p { margin: 0; color: #afc1d0; line-height: 1.78; }
        .metrics { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; margin: 20px 0 34px; }
        .metrics article { padding: 22px; border: 1px solid rgba(107,153,193,.16); border-radius: 19px; background: rgba(7,24,41,.68); }
        .metrics span { color: #8ba4b8; font-size: 12px; font-weight: 750; }
        .metrics strong { display: block; margin: 8px 0; color: #efc56f; font-size: 34px; }
        .metrics p { margin: 0; color: #7790a5; font-size: 13px; line-height: 1.6; }
        .evidenceStack { display: grid; gap: 20px; }
        .evidenceCard { padding: clamp(24px,4vw,38px); }
        .cardTop { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; }
        .cardTop h2 { margin: 0; color: #f1f6f9; font-size: clamp(23px,3vw,34px); letter-spacing: -.025em; word-break: break-word; }
        .pillRow { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
        .pill { display: inline-flex; align-items: center; min-height: 30px; padding: 0 10px; border-radius: 999px; font-size: 10px; font-weight: 850; letter-spacing: .09em; text-transform: uppercase; }
        .pill.visibility.public { color: #8fddb4; border: 1px solid rgba(80,187,135,.32); background: rgba(52,150,102,.11); }
        .pill.visibility.selective { color: #efc56f; border: 1px solid rgba(213,167,75,.35); background: rgba(213,167,75,.09); }
        .pill.visibility.private { color: #c3b7e8; border: 1px solid rgba(151,126,211,.32); background: rgba(113,83,180,.11); }
        .pill.state { color: #9fc8e7; border: 1px solid rgba(91,159,214,.30); background: rgba(48,111,163,.10); }
        .description { margin: 24px 0; color: #b6c8d6; font-size: 16px; line-height: 1.8; }
        .detailGrid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 0 24px; margin: 0; border-top: 1px solid rgba(255,255,255,.06); }
        .detailGrid > div { padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,.055); min-width: 0; }
        .detailGrid .full { grid-column: 1 / -1; }
        .hash, .urlValue { overflow-wrap: anywhere; font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; font-size: 12px; color: #a9c1d5; }
        .actions { margin-top: 24px; display: flex; align-items: center; gap: 14px; }
        .unavailable { color: #7f96a9; font-size: 13px; }
        .readerCard, .emptyCard { margin-top: 34px; padding: 30px; }
        .readerCard h2, .emptyCard h2 { margin-bottom: 15px; }
        .smallBoundary { margin-top: 18px !important; padding-top: 18px; border-top: 1px solid rgba(215,170,81,.16); color: #8fa4b7 !important; font-size: 13px; }
        @keyframes drift { from { transform: translate3d(0,0,0); } to { transform: translate3d(-110px,70px,0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 820px) { .heroGrid, .boundaryCard { grid-template-columns: 1fr; } .metrics { grid-template-columns: 1fr; } .cardTop { flex-direction: column; } .pillRow { justify-content: flex-start; } .detailGrid { grid-template-columns: 1fr; } .detailGrid .full { grid-column: auto; } }
        @media (prefers-reduced-motion: reduce) { .starField, .orbit { animation: none; } }
      `}</style>
    </main>
  );
}
