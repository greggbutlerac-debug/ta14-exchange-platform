-- TA-14 Partner Review Network private storage foundation
-- Creates the private supporting-material bucket and applicant-scoped
-- object policies. Expected object path:
--   <auth-user-id>/<application-id>/<unique-file-name>

begin;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'partner-review-network-private',
  'partner-review-network-private',
  false,
  26214400,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/json',
    'application/zip',
    'application/x-zip-compressed'
  ]::text[]
)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "PRN applicants can read their own private objects"
  on storage.objects;

create policy "PRN applicants can read their own private objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'partner-review-network-private'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.partner_review_network_applications application
    where application.id::text = (storage.foldername(name))[2]
      and application.applicant_user_id = auth.uid()
  )
);

drop policy if exists "PRN applicants can upload to editable applications"
  on storage.objects;

create policy "PRN applicants can upload to editable applications"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'partner-review-network-private'
  and (storage.foldername(name))[1] = auth.uid()::text
  and array_length(storage.foldername(name), 1) >= 2
  and exists (
    select 1
    from public.partner_review_network_applications application
    where application.id::text = (storage.foldername(name))[2]
      and application.applicant_user_id = auth.uid()
      and application.status in (
        'draft',
        'ready_for_payment',
        'payment_pending',
        'correction_requested'
      )
  )
);

drop policy if exists "PRN applicants can replace objects for editable applications"
  on storage.objects;

create policy "PRN applicants can replace objects for editable applications"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'partner-review-network-private'
  and owner_id = auth.uid()::text
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.partner_review_network_applications application
    where application.id::text = (storage.foldername(name))[2]
      and application.applicant_user_id = auth.uid()
      and application.status in (
        'draft',
        'ready_for_payment',
        'payment_pending',
        'correction_requested'
      )
  )
)
with check (
  bucket_id = 'partner-review-network-private'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.partner_review_network_applications application
    where application.id::text = (storage.foldername(name))[2]
      and application.applicant_user_id = auth.uid()
      and application.status in (
        'draft',
        'ready_for_payment',
        'payment_pending',
        'correction_requested'
      )
  )
);

drop policy if exists "PRN applicants can delete objects for editable applications"
  on storage.objects;

create policy "PRN applicants can delete objects for editable applications"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'partner-review-network-private'
  and owner_id = auth.uid()::text
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.partner_review_network_applications application
    where application.id::text = (storage.foldername(name))[2]
      and application.applicant_user_id = auth.uid()
      and application.status in (
        'draft',
        'ready_for_payment',
        'payment_pending',
        'correction_requested'
      )
  )
);

comment on column public.partner_review_network_attachments.storage_path is
  'Private Supabase Storage object path using <applicant-user-id>/<application-id>/<unique-file-name>.';

commit;
