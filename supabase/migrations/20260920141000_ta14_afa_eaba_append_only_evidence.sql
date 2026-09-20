-- Applied to production as ta14_afa_eaba_append_only_evidence.
-- Makes preserved AFA x EABA challenge evidence append-only at the database boundary.
create or replace function public.ta14_afa_eaba_reject_mutation()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  raise exception 'TA14_AFA_EABA_APPEND_ONLY: preserved challenge evidence cannot be updated or deleted';
end;
$function$;

revoke all on function public.ta14_afa_eaba_reject_mutation() from public, anon, authenticated;

drop trigger if exists ta14_afa_eaba_effects_append_only on public.ta14_afa_eaba_challenge_effects;
create trigger ta14_afa_eaba_effects_append_only
before update or delete on public.ta14_afa_eaba_challenge_effects
for each row execute function public.ta14_afa_eaba_reject_mutation();

drop trigger if exists ta14_afa_eaba_receipts_append_only on public.ta14_afa_eaba_challenge_receipts;
create trigger ta14_afa_eaba_receipts_append_only
before update or delete on public.ta14_afa_eaba_challenge_receipts
for each row execute function public.ta14_afa_eaba_reject_mutation();

revoke update, delete, truncate on table public.ta14_afa_eaba_challenge_effects from service_role;
revoke update, delete, truncate on table public.ta14_afa_eaba_challenge_receipts from service_role;
