-- TA14 Open Door: proposed payment-evidence-gated approval RPC.
-- REVIEW-ONLY: apply only AFTER payment_evidence_binding_proposal.sql is reviewed
-- and deployed. Do not deploy this independently or enable customer awards yet.
--
-- The verified_by field is a record of a review, not proof that the referenced
-- payment actually cleared. A trusted operator must reconcile it with the
-- authoritative payment provider and approved referral eligibility first.
--
-- Existing grants are reasserted explicitly so this remains service-role-only.
create or replace function public.ta14_open_door_approve_referral(p_id uuid)
returns public.ta14_open_door_referral_entitlements
language plpgsql
security invoker
set search_path = public
as $$
declare
  v public.ta14_open_door_referral_entitlements;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'Service role required';
  end if;

  update public.ta14_open_door_referral_entitlements
     set eligibility_status = 'eligible',
         entitlement_cents = paid_amount_cents,
         updated_at = now()
   where id = p_id
     and eligibility_status = 'pending'
     and paid_verified_at is not null
     and paid_amount_cents > 0
     and referring_entity_id <> referred_entity_id
     and nullif(btrim(payment_evidence_reference), '') is not null
     and payment_evidence_verified_by is not null
     and payment_evidence_reviewed_at is not null
     and payment_evidence_reviewed_at <= now()
   returning * into v;

  if not found then
    raise exception 'Referral on HOLD: missing verified payment evidence or not pending';
  end if;
  return v;
end
$$;

revoke all on function public.ta14_open_door_approve_referral(uuid) from public, anon, authenticated;
grant execute on function public.ta14_open_door_approve_referral(uuid) to service_role;

-- Remaining gaps before deployment:
-- 1. An independently verified payment-provider reference and reversal state.
-- 2. A trusted, auditable workflow for setting evidence reviewer fields.
-- 3. Real service-order validation before any redemption.
-- 4. Controlled integration tests and a migration rollback plan.
