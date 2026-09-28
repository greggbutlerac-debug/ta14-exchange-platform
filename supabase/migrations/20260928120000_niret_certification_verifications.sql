-- NIRET Gate A execution authority (C1-R7 P17 / Amendment A4): independent certification verification source.
--
-- A technician-entered certification is DECLARED or DOCUMENTED evidence only. It becomes VERIFIED for
-- Gate A only through a row written here by an appointed verifier who is not the technician, after
-- checking the credential with its issuing organization. Appointment is an owner (service-role) act.
-- Verifications and revocations are append-only; nothing a technician submits can create or alter them.

create table public.ta14_niret_certification_verifiers (
  verifier_account_id uuid primary key references auth.users(id),
  appointed_by text not null check (length(btrim(appointed_by)) > 0),
  appointed_at timestamptz not null default now(),
  retired_at timestamptz
);

alter table public.ta14_niret_certification_verifiers enable row level security;

-- Appointment and retirement are service-role only: no insert/update/delete grant to authenticated users.
grant select on public.ta14_niret_certification_verifiers to authenticated;

create policy "niret verifier reads own appointment"
on public.ta14_niret_certification_verifiers
for select to authenticated
using ((select auth.uid()) = verifier_account_id);

create table public.ta14_niret_certification_verifications (
  verification_id uuid primary key default gen_random_uuid(),
  -- The authenticated account whose credential was checked.
  technician_account_id uuid not null references auth.users(id),
  -- The exact technician identity string used in NIRET submissions (evidence.technician.identity).
  technician_identity text not null check (length(technician_identity) > 0 and technician_identity = btrim(technician_identity)),
  certification_type text not null check (certification_type in ('TYPE_I', 'TYPE_II', 'TYPE_III', 'UNIVERSAL')),
  -- Exact certificate reference as the technician declares it; matched without normalization.
  certificate_ref text not null check (length(certificate_ref) > 0 and certificate_ref = btrim(certificate_ref)),
  holder_name text not null check (length(btrim(holder_name)) > 0),
  issuing_organization text not null check (length(btrim(issuing_organization)) > 0),
  method text not null check (method in ('ISSUER_RECORD_LOOKUP', 'ISSUER_CONFIRMATION_OF_INSPECTED_CERTIFICATE')),
  evidence_reference text not null check (length(btrim(evidence_reference)) > 0),
  evidence_sha256 text check (evidence_sha256 ~ '^[0-9a-f]{64}$'),
  verifier_account_id uuid not null references auth.users(id),
  verified_at timestamptz not null default now(),
  constraint niret_certification_not_self_verified check (verifier_account_id <> technician_account_id)
);

create index ta14_niret_certification_verifications_technician
  on public.ta14_niret_certification_verifications (technician_account_id);

alter table public.ta14_niret_certification_verifications enable row level security;

grant select, insert on public.ta14_niret_certification_verifications to authenticated;

create policy "niret certification technician or verifier read"
on public.ta14_niret_certification_verifications
for select to authenticated
using ((select auth.uid()) = technician_account_id or (select auth.uid()) = verifier_account_id);

create policy "niret certification appointed verifier append"
on public.ta14_niret_certification_verifications
for insert to authenticated
with check (
  (select auth.uid()) = verifier_account_id
  and (select auth.uid()) <> technician_account_id
  and exists (
    select 1 from public.ta14_niret_certification_verifiers v
    where v.verifier_account_id = (select auth.uid()) and v.retired_at is null
  )
);

create table public.ta14_niret_certification_revocations (
  revocation_id uuid primary key default gen_random_uuid(),
  verification_id uuid not null references public.ta14_niret_certification_verifications(verification_id),
  revoked_by uuid not null references auth.users(id),
  reason text not null check (length(btrim(reason)) > 0),
  revoked_at timestamptz not null default now()
);

create index ta14_niret_certification_revocations_verification
  on public.ta14_niret_certification_revocations (verification_id);

alter table public.ta14_niret_certification_revocations enable row level security;

grant select, insert on public.ta14_niret_certification_revocations to authenticated;

create policy "niret revocation technician or verifier read"
on public.ta14_niret_certification_revocations
for select to authenticated
using (
  (select auth.uid()) = revoked_by
  or exists (
    select 1 from public.ta14_niret_certification_verifications c
    where c.verification_id = ta14_niret_certification_revocations.verification_id
      and (select auth.uid()) = c.technician_account_id
  )
);

create policy "niret revocation appointed verifier append"
on public.ta14_niret_certification_revocations
for insert to authenticated
with check (
  (select auth.uid()) = revoked_by
  and exists (
    select 1 from public.ta14_niret_certification_verifiers v
    where v.verifier_account_id = (select auth.uid()) and v.retired_at is null
  )
);

-- The server clock, not the verifier, stamps verification and revocation times.
create or replace function public.ta14_niret_certification_stamp_time()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_table_name = 'ta14_niret_certification_verifications' then
    new.verified_at := now();
  else
    new.revoked_at := now();
  end if;
  return new;
end;
$$;

create trigger ta14_niret_certification_verifications_stamp
before insert on public.ta14_niret_certification_verifications
for each row execute function public.ta14_niret_certification_stamp_time();

create trigger ta14_niret_certification_revocations_stamp
before insert on public.ta14_niret_certification_revocations
for each row execute function public.ta14_niret_certification_stamp_time();

create or replace function public.ta14_niret_certification_append_only()
returns trigger language plpgsql set search_path = public as $$
begin
  raise exception 'TA-14 NIRET certification verification evidence is append-only';
end;
$$;

create trigger ta14_niret_certification_verifications_append_only
before update or delete on public.ta14_niret_certification_verifications
for each row execute function public.ta14_niret_certification_append_only();

create trigger ta14_niret_certification_revocations_append_only
before update or delete on public.ta14_niret_certification_revocations
for each row execute function public.ta14_niret_certification_append_only();
