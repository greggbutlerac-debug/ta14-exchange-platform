-- Reconstructs production migration 20260920130851 from the live schema.
create table if not exists public.ta14_afa_eaba_challenge_effects (
  effect_id uuid primary key default gen_random_uuid(),
  run_id uuid not null unique,
  mechanism_id text not null,
  mechanism_version text not null,
  action text not null,
  input_json jsonb not null,
  effect_payload jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.ta14_afa_eaba_challenge_effects enable row level security;
revoke all on table public.ta14_afa_eaba_challenge_effects from anon, authenticated;

create or replace function public.ta14_afa_eaba_apply_effect(
  p_run_id uuid, p_mechanism_id text, p_mechanism_version text, p_action text,
  p_passport_integrity boolean, p_freshness boolean, p_scope boolean,
  p_local_standing boolean, p_commit_binding boolean, p_bypass boolean
) returns jsonb
language plpgsql security definer set search_path to 'public'
as $function$
declare
  v_authorized boolean;
  v_effect_id uuid;
  v_input jsonb;
begin
  v_input := jsonb_build_object(
    'passportIntegrity', p_passport_integrity, 'freshness', p_freshness,
    'scope', p_scope, 'localStanding', p_local_standing,
    'commitBinding', p_commit_binding, 'bypass', p_bypass
  );
  v_authorized := p_passport_integrity and p_freshness and p_scope
    and p_local_standing and p_commit_binding and not p_bypass;
  if not v_authorized then
    return jsonb_build_object('attempted',true,'authorized',false,'fired',false,'effectId',null,'databaseResult','NO_EFFECT_ROW_CREATED');
  end if;
  insert into public.ta14_afa_eaba_challenge_effects
    (run_id,mechanism_id,mechanism_version,action,input_json,effect_payload)
  values
    (p_run_id,p_mechanism_id,p_mechanism_version,p_action,v_input,jsonb_build_object('protectedConsequence','DURABLE_EFFECT_ROW_CREATED'))
  returning effect_id into v_effect_id;
  return jsonb_build_object('attempted',true,'authorized',true,'fired',true,'effectId',v_effect_id,'databaseResult','DURABLE_EFFECT_ROW_CREATED');
end;
$function$;
revoke all on function public.ta14_afa_eaba_apply_effect(uuid,text,text,text,boolean,boolean,boolean,boolean,boolean,boolean) from public, anon, authenticated;
grant execute on function public.ta14_afa_eaba_apply_effect(uuid,text,text,text,boolean,boolean,boolean,boolean,boolean,boolean) to service_role;
