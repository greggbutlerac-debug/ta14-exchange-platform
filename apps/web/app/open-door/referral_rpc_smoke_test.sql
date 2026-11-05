-- TA14 Open Door: transactional referral RPC smoke test
-- Run only in a trusted Supabase SQL editor against the intended project.
-- No external payments, customer records, or administrator grants.
-- Entire test rolls back. Do not run in an app/client session.
BEGIN;

DO $test$
DECLARE
  v_id uuid;
  v_row public.ta14_open_door_referral_entitlements;
  v_count integer;
BEGIN
  -- Verify permissions on the actual RPC signatures before testing behavior.
  IF has_function_privilege('anon', 'public.ta14_open_door_approve_referral(uuid)', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.ta14_open_door_approve_referral(uuid)', 'EXECUTE')
     OR has_function_privilege('anon', 'public.ta14_open_door_redeem_referral(uuid,integer)', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.ta14_open_door_redeem_referral(uuid,integer)', 'EXECUTE')
     OR NOT has_function_privilege('service_role', 'public.ta14_open_door_approve_referral(uuid)', 'EXECUTE')
     OR NOT has_function_privilege('service_role', 'public.ta14_open_door_redeem_referral(uuid,integer)', 'EXECUTE')
  THEN
    RAISE EXCEPTION 'Unexpected referral RPC permissions';
  END IF;

  INSERT INTO public.ta14_open_door_referral_entitlements
    (referring_entity_id, referred_entity_id, qualifying_engagement_id,
     paid_amount_cents, paid_verified_at)
  VALUES
    ('TA14_SMOKE_REFERRER', 'TA14_SMOKE_CUSTOMER',
     'TA14_SMOKE_' || gen_random_uuid()::text, 14900, now())
  RETURNING id INTO v_id;

  -- Simulate the request JWT role *only in this trusted test transaction*.
  -- This is not a real authenticated HTTP request.
  PERFORM set_config('request.jwt.claim.role', 'service_role', true);
  SELECT * INTO v_row FROM public.ta14_open_door_approve_referral(v_id);
  IF v_row.eligibility_status <> 'eligible' OR v_row.entitlement_cents <> 14900 THEN
    RAISE EXCEPTION 'Approval did not award exactly the verified payment';
  END IF;

  SELECT * INTO v_row FROM public.ta14_open_door_redeem_referral(v_id, 4900);
  IF v_row.redeemed_cents <> 4900 OR v_row.entitlement_cents-v_row.redeemed_cents <> 10000 THEN
    RAISE EXCEPTION 'Partial redemption balance mismatch';
  END IF;

  -- Overdraw must fail without changing the existing balance.
  BEGIN
    PERFORM public.ta14_open_door_redeem_referral(v_id, 10001);
    RAISE EXCEPTION 'Overdraw unexpectedly succeeded';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM = 'Overdraw unexpectedly succeeded' THEN RAISE; END IF;
  END;
  SELECT * INTO v_row FROM public.ta14_open_door_referral_entitlements WHERE id=v_id;
  IF v_row.redeemed_cents <> 4900 THEN
    RAISE EXCEPTION 'Overdraw changed the ledger';
  END IF;

  SELECT count(*) INTO v_count FROM public.ta14_open_door_referral_audit
  WHERE (new_record->>'id')=v_id::text;
  IF v_count < 3 THEN
    RAISE EXCEPTION 'Expected audit events for insert, approval and redemption; found %', v_count;
  END IF;
  RAISE NOTICE 'PASS: role grants, approval, partial redemption, overdraw protection, audit; rolling back';
END
$test$;

ROLLBACK;
