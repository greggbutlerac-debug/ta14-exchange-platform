-- SX-002 CANDIDATE ONLY. DO NOT APPLY TO PRODUCTION.
-- This is a narrowly scoped fail-closed patch to the existing SX-001 demonstration.
-- It does not solve asserted-authority provenance or privileged direct writes.
-- Must first run against an isolated staging database and test all negative paths.
CREATE OR REPLACE FUNCTION public.ta14_afa_eaba_apply_effect(
  p_run_id uuid, p_mechanism_id text, p_mechanism_version text, p_action text,
  p_passport_integrity boolean, p_freshness boolean, p_scope boolean,
  p_local_standing boolean, p_commit_binding boolean, p_bypass boolean
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_authorized boolean;
  v_effect_id uuid;
  v_input jsonb;
BEGIN
  v_input := jsonb_build_object(
    'passportIntegrity', p_passport_integrity,
    'freshness', p_freshness,
    'scope', p_scope,
    'localStanding', p_local_standing,
    'commitBinding', p_commit_binding,
    'bypass', p_bypass
  );
  v_authorized := p_passport_integrity AND p_freshness AND p_scope
    AND p_local_standing AND p_commit_binding AND NOT p_bypass;
  -- PostgreSQL NULL is not TRUE: explicitly deny UNKNOWN.
  IF v_authorized IS DISTINCT FROM TRUE THEN
    RETURN jsonb_build_object('attempted',true,'authorized',false,
      'fired',false,'effectId',null,'databaseResult','NO_EFFECT_ROW_CREATED');
  END IF;
  INSERT INTO public.ta14_afa_eaba_challenge_effects
    (run_id,mechanism_id,mechanism_version,action,input_json,effect_payload)
  VALUES (p_run_id,p_mechanism_id,p_mechanism_version,p_action,v_input,
    jsonb_build_object('protectedConsequence','DURABLE_EFFECT_ROW_CREATED'))
  RETURNING effect_id INTO v_effect_id;
  RETURN jsonb_build_object('attempted',true,'authorized',true,
    'fired',true,'effectId',v_effect_id,
    'databaseResult','DURABLE_EFFECT_ROW_CREATED');
END;
$function$;
REVOKE ALL ON FUNCTION public.ta14_afa_eaba_apply_effect(uuid,text,text,text,boolean,boolean,boolean,boolean,boolean,boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ta14_afa_eaba_apply_effect(uuid,text,text,text,boolean,boolean,boolean,boolean,boolean,boolean) TO service_role;
-- WARNING: service_role retains direct INSERT on effect sink. This is a
-- non-production candidate logic patch, not a complete SX-002 enforcement gate.
