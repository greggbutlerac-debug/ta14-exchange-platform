import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

type JsonRecord = Record<string, unknown>;

type DraftPayload = {
  id?: string;
  form: JsonRecord;
  publications?: JsonRecord[];
  repositories?: JsonRecord[];
  zenodoRecords?: JsonRecord[];
  patentRecords?: JsonRecord[];
};

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function bool(value: unknown): boolean {
  return value === true;
}

function nullable(value: unknown): string | null {
  const normalized = text(value);
  return normalized.length > 0 ? normalized : null;
}

function lower(value: unknown, fallback: string): string {
  const normalized = text(value).toLowerCase();
  return normalized || fallback;
}

function mapVisibility(value: unknown): 'public' | 'private' | 'selective' {
  switch (text(value).toUpperCase()) {
    case 'PUBLIC':
      return 'public';
    case 'CONTROLLED':
      return 'selective';
    default:
      return 'private';
  }
}

function mapContactMode(
  value: unknown,
): 'registry_contact_form' | 'website_only' | 'public_email' | 'private' {
  switch (text(value).toUpperCase()) {
    case 'WEBSITE_ONLY':
      return 'website_only';
    case 'PUBLIC_EMAIL':
      return 'public_email';
    case 'PRIVATE':
      return 'private';
    default:
      return 'registry_contact_form';
  }
}

function mapProvider(value: unknown): string {
  const provider = text(value).toLowerCase();

  if (['github', 'gitlab', 'bitbucket', 'codeberg'].includes(provider)) {
    return provider;
  }

  return 'other';
}

function mapRepositoryAccess(value: unknown): string {
  switch (text(value).toUpperCase()) {
    case 'PUBLIC':
      return 'public';
    case 'RESTRICTED':
      return 'restricted';
    default:
      return 'private';
  }
}

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
          // A Server Component may have initiated the request. The route can
          // still read the existing authenticated session.
        }
      },
    },
  });
}

function buildSubmissionRow(form: JsonRecord, ownerUserId: string) {
  return {
    owner_user_id: ownerUserId,
    governance_name: text(form.governanceName),
    short_name: nullable(form.shortName),
    governance_category: text(form.governanceCategory),
    current_version: text(form.currentVersion),
    claimed_establishment_date: nullable(form.establishmentDate),
    effective_version_date: nullable(form.effectiveVersionDate),

    claimant_name: text(form.claimantName),
    claimant_type: text(form.claimantType),
    submitter_authority_role: text(form.authorityRole),
    authority_basis: text(form.authorityEvidence),
    current_steward: nullable(form.stewardName),
    organization_name: nullable(form.organization),
    contact_email: text(form.contactEmail),
    public_contact_mode: mapContactMode(form.contactVisibility),
    public_website: nullable(form.website),

    geographic_scope: nullable(form.jurisdiction),
    regulatory_scope: nullable(form.regulatoryScope),
    plain_language_description: text(form.plainDescription),
    formal_claims: text(form.claims),
    explicit_non_claims: text(form.nonClaims),
    known_limitations: nullable(form.limitations),
    known_disputes: nullable(form.disputes),

    ownership_declaration: text(form.ownershipDeclaration),
    license_statement: nullable(form.license),
    requested_review_pathway: text(form.reviewPathway),
    record_visibility: mapVisibility(form.recordVisibility),

    allow_review_requests: bool(form.allowReviewRequests),
    allow_collaboration_inquiries: bool(form.allowCollaboration),
    allow_dispute_notices: bool(form.allowDisputeNotices),

    authority_declaration_accepted: bool(form.authorityConfirmed),
    accuracy_declaration_accepted: bool(form.accuracyConfirmed),
    registry_boundary_accepted: bool(form.boundaryConfirmed),

    intake_manifest: {
      draft_format: 'TA-14-AIGR-DRAFT-1.0',
      saved_from: 'registry_intake',
      evidence_files_are_separate: true,
    },
    status: 'draft',
  };
}

function buildPublicationRows(
  records: JsonRecord[],
  submissionId: string,
  ownerUserId: string,
) {
  return records
    .filter((record) => text(record.title))
    .map((record) => ({
      submission_id: submissionId,
      owner_user_id: ownerUserId,
      publication_type: lower(record.publicationType, 'other'),
      title: text(record.title),
      authors: text(record.authors),
      publisher_or_platform: nullable(record.publisherOrPlatform),
      publication_date: nullable(record.publicationDate),
      url: nullable(record.url),
      doi: nullable(record.doi),
      isbn: nullable(record.isbn),
      citation_text: nullable(record.citationText),
      abstract_or_description: nullable(record.description),
      relationship_to_governance: text(record.relationshipToGovernance),
      visibility: mapVisibility(record.visibility),
      record_state: 'current',
    }));
}

function buildRepositoryRows(
  records: JsonRecord[],
  submissionId: string,
  ownerUserId: string,
) {
  return records
    .filter((record) => text(record.repositoryUrl))
    .map((record) => ({
      submission_id: submissionId,
      owner_user_id: ownerUserId,
      provider: mapProvider(record.provider),
      repository_name: text(record.repositoryName),
      repository_owner: nullable(record.repositoryOwner),
      repository_url: text(record.repositoryUrl),
      default_branch: nullable(record.defaultBranch),
      release_or_tag: nullable(record.releaseOrTag),
      commit_sha: nullable(record.commitSha),
      license: nullable(record.license),
      access_state: mapRepositoryAccess(record.accessState),
      repository_state: 'active',
      description: nullable(record.description),
      relationship_to_governance: text(record.relationshipToGovernance),
    }));
}

function buildZenodoRows(
  records: JsonRecord[],
  submissionId: string,
  ownerUserId: string,
) {
  return records
    .filter((record) => text(record.recordUrl))
    .map((record) => ({
      submission_id: submissionId,
      owner_user_id: ownerUserId,
      title: text(record.title),
      record_url: text(record.recordUrl),
      doi: nullable(record.doi),
      concept_doi: nullable(record.conceptDoi),
      zenodo_record_id: nullable(record.zenodoRecordId),
      version: nullable(record.version),
      publication_date: nullable(record.publicationDate),
      creators: nullable(record.creators),
      resource_type: nullable(record.resourceType),
      description: nullable(record.description),
      relationship_to_governance: text(record.relationshipToGovernance),
      visibility: mapVisibility(record.visibility),
      record_state: 'current',
    }));
}

function buildPatentRows(
  records: JsonRecord[],
  submissionId: string,
  ownerUserId: string,
) {
  return records
    .filter((record) => text(record.title))
    .map((record) => ({
      submission_id: submissionId,
      owner_user_id: ownerUserId,
      title: text(record.title),
      jurisdiction: text(record.jurisdiction),
      filing_type: lower(record.filingType, 'other').replaceAll(' ', '_'),
      application_status: lower(record.applicationStatus, 'filed').replaceAll(
        ' ',
        '_',
      ),
      application_number: nullable(record.applicationNumber),
      publication_number: nullable(record.publicationNumber),
      patent_number: nullable(record.patentNumber),
      filing_date: nullable(record.filingDate),
      publication_date: nullable(record.publicationDate),
      grant_date: nullable(record.grantDate),
      priority_date: nullable(record.priorityDate),
      inventors: nullable(record.inventors),
      applicant_or_assignee: nullable(record.applicantOrAssignee),
      official_url: nullable(record.officialUrl),
      description: nullable(record.description),
      relationship_to_governance: text(record.relationshipToGovernance),
      visibility: mapVisibility(record.visibility),
      record_state: 'current',
      // Lineage IDs are assigned in a later route after all patent rows have
      // durable database IDs. The intake manifest still preserves the local
      // convertedFromId and continuationOfId references.
    }));
}

async function replaceChildRows(
  supabase: ReturnType<typeof createSupabaseClient>,
  table: string,
  submissionId: string,
  rows: JsonRecord[],
) {
  const { error: deleteError } = await supabase
    .from(table)
    .delete()
    .eq('submission_id', submissionId);

  if (deleteError) {
    throw new Error(`${table}: ${deleteError.message}`);
  }

  if (rows.length === 0) {
    return;
  }

  const { error: insertError } = await supabase.from(table).insert(rows);

  if (insertError) {
    throw new Error(`${table}: ${insertError.message}`);
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const requestedId = request.nextUrl.searchParams.get('id');

    let query = supabase
      .from('ai_governance_registry_submissions')
      .select('*')
      .eq('owner_user_id', user.id)
      .eq('status', 'draft');

    query = requestedId
      ? query.eq('id', requestedId)
      : query.order('updated_at', { ascending: false }).limit(1);

    const { data: submissions, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const submission = submissions?.[0];

    if (!submission) {
      return NextResponse.json({ draft: null });
    }

    const [
      publicationsResult,
      repositoriesResult,
      zenodoResult,
      patentsResult,
    ] = await Promise.all([
      supabase
        .from('ai_governance_registry_publications')
        .select('*')
        .eq('submission_id', submission.id)
        .order('created_at'),
      supabase
        .from('ai_governance_registry_repositories')
        .select('*')
        .eq('submission_id', submission.id)
        .order('created_at'),
      supabase
        .from('ai_governance_registry_zenodo_records')
        .select('*')
        .eq('submission_id', submission.id)
        .order('created_at'),
      supabase
        .from('ai_governance_registry_patent_records')
        .select('*')
        .eq('submission_id', submission.id)
        .order('created_at'),
    ]);

    const firstError = [
      publicationsResult.error,
      repositoriesResult.error,
      zenodoResult.error,
      patentsResult.error,
    ].find(Boolean);

    if (firstError) {
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }

    return NextResponse.json({
      draft: {
        submission,
        publications: publicationsResult.data ?? [],
        repositories: repositoriesResult.data ?? [],
        zenodoRecords: zenodoResult.data ?? [],
        patentRecords: patentsResult.data ?? [],
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to load Registry draft.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as DraftPayload;
    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const form = payload.form ?? {};
    const submissionRow = buildSubmissionRow(form, user.id);

    let submissionId = text(payload.id);

    if (submissionId) {
      const { data, error } = await supabase
        .from('ai_governance_registry_submissions')
        .update(submissionRow)
        .eq('id', submissionId)
        .eq('owner_user_id', user.id)
        .eq('status', 'draft')
        .select('id, updated_at')
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      submissionId = data.id;
    } else {
      const { data, error } = await supabase
        .from('ai_governance_registry_submissions')
        .insert(submissionRow)
        .select('id, updated_at')
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      submissionId = data.id;
    }

    const publications = buildPublicationRows(
      payload.publications ?? [],
      submissionId,
      user.id,
    );
    const repositories = buildRepositoryRows(
      payload.repositories ?? [],
      submissionId,
      user.id,
    );
    const zenodoRecords = buildZenodoRows(
      payload.zenodoRecords ?? [],
      submissionId,
      user.id,
    );
    const patentRecords = buildPatentRows(
      payload.patentRecords ?? [],
      submissionId,
      user.id,
    );

    await replaceChildRows(
      supabase,
      'ai_governance_registry_publications',
      submissionId,
      publications,
    );
    await replaceChildRows(
      supabase,
      'ai_governance_registry_repositories',
      submissionId,
      repositories,
    );
    await replaceChildRows(
      supabase,
      'ai_governance_registry_zenodo_records',
      submissionId,
      zenodoRecords,
    );
    await replaceChildRows(
      supabase,
      'ai_governance_registry_patent_records',
      submissionId,
      patentRecords,
    );

    const { data: savedDraft, error: readError } = await supabase
      .from('ai_governance_registry_submissions')
      .select('id, updated_at')
      .eq('id', submissionId)
      .single();

    if (readError) {
      return NextResponse.json({ error: readError.message }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      draftId: savedDraft.id,
      savedAt: savedDraft.updated_at,
      notice:
        'The Registry intake draft is stored privately under the signed-in account. It is not a public Registry record.',
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to save Registry draft.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const draftId = request.nextUrl.searchParams.get('id');

    if (!draftId) {
      return NextResponse.json({ error: 'Draft ID is required.' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { error } = await supabase
      .from('ai_governance_registry_submissions')
      .delete()
      .eq('id', draftId)
      .eq('owner_user_id', user.id)
      .eq('status', 'draft');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      notice: 'The private Registry draft was deleted.',
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to delete Registry draft.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
