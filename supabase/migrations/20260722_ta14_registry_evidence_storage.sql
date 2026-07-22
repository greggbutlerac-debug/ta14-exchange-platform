-- TA-14 AI Governance Registry
-- Evidence storage bucket and access policies
--
-- Object path convention:
--   {owner_user_id}/{submission_id}/{evidence_id}/{sanitized_filename}
--
-- Registry evidence remains private while the parent submission is a draft,
-- submitted, or under review. Public access is allowed only when:
--   1. the evidence metadata is marked public,
--   2. the parent Registry record is public,
--   3. the parent has a Registry identifier, and
--   4. the parent is in a published lifecycle state.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'ai-governance-registry-evidence',
  'ai-governance-registry-evidence',
  false,
  52428800,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/csv',
    'application/json',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'application/zip',
    'application/x-zip-compressed'
  ]
)
on conflict (id)
do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Registry owners can upload draft evidence"
  on storage.objects;

create policy "Registry owners can upload draft evidence"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'ai-governance-registry-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id::text = (storage.foldername(name))[2]
      and s.owner_user_id = auth.uid()
      and s.status in ('draft', 'submitted', 'under_review')
      and s.registry_identifier is null
  )
);

drop policy if exists "Registry owners can read their evidence objects"
  on storage.objects;

create policy "Registry owners can read their evidence objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'ai-governance-registry-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Registry owners can replace editable evidence objects"
  on storage.objects;

create policy "Registry owners can replace editable evidence objects"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'ai-governance-registry-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id::text = (storage.foldername(name))[2]
      and s.owner_user_id = auth.uid()
      and s.status in ('draft', 'submitted', 'under_review')
      and s.registry_identifier is null
  )
)
with check (
  bucket_id = 'ai-governance-registry-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Registry owners can delete draft evidence objects"
  on storage.objects;

create policy "Registry owners can delete draft evidence objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'ai-governance-registry-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id::text = (storage.foldername(name))[2]
      and s.owner_user_id = auth.uid()
      and s.status = 'draft'
      and s.registry_identifier is null
  )
);

drop policy if exists "Public can read published Registry evidence objects"
  on storage.objects;

create policy "Public can read published Registry evidence objects"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'ai-governance-registry-evidence'
  and exists (
    select 1
    from public.ai_governance_registry_evidence e
    join public.ai_governance_registry_submissions s
      on s.id = e.submission_id
    where e.storage_bucket = bucket_id
      and e.storage_path = name
      and e.visibility = 'public'
      and e.evidence_state = 'current'
      and s.record_visibility = 'public'
      and s.registry_identifier is not null
      and s.status in (
        'registered',
        'disputed',
        'superseded',
        'withdrawn',
        'archived'
      )
  )
);

comment on column public.ai_governance_registry_evidence.storage_bucket is
  'Supabase Storage bucket containing the preserved evidence object.';

comment on column public.ai_governance_registry_evidence.storage_path is
  'Durable object path. The path binds owner, submission, evidence identifier, and original filename.';
