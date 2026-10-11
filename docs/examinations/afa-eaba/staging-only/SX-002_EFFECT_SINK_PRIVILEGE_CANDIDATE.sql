-- SX-002 ISOLATED STAGING CANDIDATE. NOT FOR PRODUCTION DEPLOYMENT.
-- Execute only after reviewing all application dependencies and database ownership.
-- Assumes the protected effects table exists in the disposable test database.
-- This narrows table privileges; it does NOT authenticate evidence or
-- replace the asserted-boolean gate with an authoritative transactional gate.
BEGIN;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON TABLE public.ta14_afa_eaba_challenge_effects
  FROM PUBLIC, anon, authenticated, service_role;
-- Existing service_role function execution remains a separate unresolved
-- authorization boundary. Do not claim complete SX-002 enforcement.
DO $check$
BEGIN
  IF has_table_privilege('service_role',
       'public.ta14_afa_eaba_challenge_effects', 'INSERT')
    OR has_table_privilege('anon',
       'public.ta14_afa_eaba_challenge_effects', 'INSERT')
    OR has_table_privilege('authenticated',
       'public.ta14_afa_eaba_challenge_effects', 'INSERT')
  THEN
    RAISE EXCEPTION 'Effect sink still permits direct INSERT by application roles';
  END IF;
END;
$check$;
COMMIT;
