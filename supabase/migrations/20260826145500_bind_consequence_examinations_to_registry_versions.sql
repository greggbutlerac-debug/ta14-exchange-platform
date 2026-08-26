-- TA-14 Consequence Examination Engine
-- Bind every issued Technical Freeze and every examination run to an existing
-- registered governance architecture/version without creating or mutating Registry identity.

alter table public.consequence_technical_freezes
  add column if not exists registry_record_id uuid,
  add column if not exists registry_version_record_id uuid;

alter table public.consequence_examination_runs
  add column if not exists registry_record_id uuid,
  add column if not exists registry_version_record_id uuid;

alter table public.consequence_technical_freezes
  drop constraint if exists consequence_technical_freezes_registry_record_id_fkey,
  add constraint consequence_technical_freezes_registry_record_id_fkey
    foreign key (registry_record_id)
    references public.ta14_registry_public_records(id)
    on delete restrict,
  drop constraint if exists consequence_technical_freezes_registry_version_record_id_fkey,
  add constraint consequence_technical_freezes_registry_version_record_id_fkey
    foreign key (registry_version_record_id)
    references public.ta14_registry_version_records(id)
    on delete restrict;

alter table public.consequence_examination_runs
  drop constraint if exists consequence_examination_runs_registry_record_id_fkey,
  add constraint consequence_examination_runs_registry_record_id_fkey
    foreign key (registry_record_id)
    references public.ta14_registry_public_records(id)
    on delete restrict,
  drop constraint if exists consequence_examination_runs_registry_version_record_id_fkey,
  add constraint consequence_examination_runs_registry_version_record_id_fkey
    foreign key (registry_version_record_id)
    references public.ta14_registry_version_records(id)
    on delete restrict;

alter table public.consequence_technical_freezes
  drop constraint if exists issued_freeze_requires_registry_binding,
  add constraint issued_freeze_requires_registry_binding
    check (
      status <> 'TECHNICAL_FREEZE_ISSUED'
      or (registry_record_id is not null and registry_version_record_id is not null)
    );

create index if not exists consequence_technical_freezes_registry_record_idx
  on public.consequence_technical_freezes(registry_record_id);
create index if not exists consequence_technical_freezes_registry_version_idx
  on public.consequence_technical_freezes(registry_version_record_id);
create index if not exists consequence_examination_runs_registry_record_idx
  on public.consequence_examination_runs(registry_record_id);
create index if not exists consequence_examination_runs_registry_version_idx
  on public.consequence_examination_runs(registry_version_record_id);

create or replace function public.validate_consequence_freeze_registry_binding()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  registry_identifier_value text;
  registry_version_value text;
  version_registry_identifier_value text;
  version_label_value text;
begin
  if new.registry_record_id is null and new.registry_version_record_id is null then
    if new.status = 'TECHNICAL_FREEZE_ISSUED' then
      raise exception 'Issued Technical Freeze requires an existing Registry architecture/version binding';
    end if;
    return new;
  end if;

  if new.registry_record_id is null or new.registry_version_record_id is null then
    raise exception 'Registry architecture and Registry version must be bound together';
  end if;

  select r.registry_identifier, r.version
    into registry_identifier_value, registry_version_value
  from public.ta14_registry_public_records r
  where r.id = new.registry_record_id
    and lower(r.status) = 'registered';

  if registry_identifier_value is null then
    raise exception 'Registry binding does not identify an existing registered architecture';
  end if;

  select v.registry_identifier, v.version_label
    into version_registry_identifier_value, version_label_value
  from public.ta14_registry_version_records v
  where v.id = new.registry_version_record_id;

  if version_registry_identifier_value is null then
    raise exception 'Registry version binding does not identify an existing version record';
  end if;

  if upper(version_registry_identifier_value) <> upper(registry_identifier_value) then
    raise exception 'Registry version does not belong to the bound Registry architecture';
  end if;

  if coalesce(trim(version_label_value), '') <> coalesce(trim(registry_version_value), '') then
    raise exception 'Registry version label does not match the bound registered architecture version';
  end if;

  return new;
end;
$$;

revoke all on function public.validate_consequence_freeze_registry_binding()
  from public, anon, authenticated;

drop trigger if exists validate_consequence_freeze_registry_binding
  on public.consequence_technical_freezes;
create trigger validate_consequence_freeze_registry_binding
before insert or update of registry_record_id, registry_version_record_id, status
on public.consequence_technical_freezes
for each row
execute function public.validate_consequence_freeze_registry_binding();

create or replace function public.enforce_consequence_run_registry_binding()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  freeze_registry_record_id uuid;
  freeze_registry_version_record_id uuid;
  freeze_status text;
  registry_identifier_value text;
begin
  select f.registry_record_id, f.registry_version_record_id, f.status
    into freeze_registry_record_id, freeze_registry_version_record_id, freeze_status
  from public.consequence_technical_freezes f
  where f.record_id = new.freeze_record_id
    and f.freeze_sha256 = new.freeze_sha256;

  if freeze_status is distinct from 'TECHNICAL_FREEZE_ISSUED' then
    raise exception 'Examination run requires a matching issued Technical Freeze';
  end if;

  if freeze_registry_record_id is null or freeze_registry_version_record_id is null then
    raise exception 'Issued Technical Freeze lacks Registry architecture/version binding';
  end if;

  if new.registry_record_id is null then
    new.registry_record_id := freeze_registry_record_id;
  end if;
  if new.registry_version_record_id is null then
    new.registry_version_record_id := freeze_registry_version_record_id;
  end if;

  if new.registry_record_id <> freeze_registry_record_id
     or new.registry_version_record_id <> freeze_registry_version_record_id then
    raise exception 'Examination run Registry binding must exactly match its Technical Freeze';
  end if;

  select r.registry_identifier
    into registry_identifier_value
  from public.ta14_registry_public_records r
  where r.id = freeze_registry_record_id;

  -- Compatibility/display field only. Registry identity remains authoritative in the Registry tables.
  new.governance_registry_identifier := registry_identifier_value;

  return new;
end;
$$;

revoke all on function public.enforce_consequence_run_registry_binding()
  from public, anon, authenticated;

drop trigger if exists enforce_consequence_run_registry_binding
  on public.consequence_examination_runs;
create trigger enforce_consequence_run_registry_binding
before insert or update of freeze_record_id, freeze_sha256, registry_record_id, registry_version_record_id, governance_registry_identifier
on public.consequence_examination_runs
for each row
execute function public.enforce_consequence_run_registry_binding();
