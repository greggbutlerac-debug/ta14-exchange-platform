-- Durable final examination reports for TA14-AFA-EABA-SX-001.
create table if not exists public.ta14_afa_eaba_challenge_reports (
 report_id uuid primary key default gen_random_uuid(), examination_id uuid not null unique,
 mechanism_id text not null, mechanism_version text not null, report_json jsonb not null,
 integrity_hash text not null check (integrity_hash ~ '^[a-f0-9]{64}$'), created_at timestamptz not null default now()
);
alter table public.ta14_afa_eaba_challenge_reports enable row level security;
revoke all on table public.ta14_afa_eaba_challenge_reports from anon, authenticated;
drop trigger if exists ta14_afa_eaba_reports_append_only on public.ta14_afa_eaba_challenge_reports;
create trigger ta14_afa_eaba_reports_append_only before update or delete on public.ta14_afa_eaba_challenge_reports for each row execute function public.ta14_afa_eaba_reject_mutation();
revoke update, delete, truncate on table public.ta14_afa_eaba_challenge_reports from service_role;
grant select, insert on table public.ta14_afa_eaba_challenge_reports to service_role;