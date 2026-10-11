-- TA14 consequence examination queue: REVIEW ONLY. Do not run on production without approval.
-- Prerequisite: public.ta14_consequence_examination_intakes(intake_id) exists and is unique.
BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS ta14_cex_intakes_paypal_order_unique
  ON public.ta14_consequence_examination_intakes (paypal_order_id)
  WHERE paypal_order_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ta14_cex_intakes_paypal_capture_unique
  ON public.ta14_consequence_examination_intakes (paypal_capture_id)
  WHERE paypal_capture_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.ta14_consequence_examination_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id text NOT NULL UNIQUE CHECK (queue_id ~ '^TA14-CEX-Q-[A-Z0-9]{12}$'),
  intake_id text NOT NULL UNIQUE REFERENCES public.ta14_consequence_examination_intakes(intake_id),
  state text NOT NULL DEFAULT 'QUEUED'
    CHECK (state IN ('QUEUED','ASSIGNED','IN_EXAMINATION')),
  paid_at timestamptz NOT NULL,
  evidence_manifest_sha256 text NOT NULL CHECK (evidence_manifest_sha256 ~ '^[0-9a-f]{64}$'),
  evidence_item_count integer NOT NULL DEFAULT 0 CHECK (evidence_item_count >= 0),
  assigned_operator_user_id uuid,
  assigned_operator_name text,
  assigned_at timestamptz,
  examination_started_at timestamptz,
  queued_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (state = 'QUEUED' OR (assigned_operator_user_id IS NOT NULL AND assigned_at IS NOT NULL)),
  CHECK (state <> 'IN_EXAMINATION' OR examination_started_at IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS public.ta14_consequence_examination_queue_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id text NOT NULL REFERENCES public.ta14_consequence_examination_queue(queue_id),
  intake_id text NOT NULL REFERENCES public.ta14_consequence_examination_intakes(intake_id),
  event_type text NOT NULL CHECK (event_type IN ('PAID_INTAKE_QUEUED','EXAMINER_ASSIGNED','EXAMINATION_STARTED')),
  from_state text CHECK (from_state IS NULL OR from_state IN ('QUEUED','ASSIGNED','IN_EXAMINATION')),
  to_state text NOT NULL CHECK (to_state IN ('QUEUED','ASSIGNED','IN_EXAMINATION')),
  event_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ta14_cex_queue_events_queue_chronology
  ON public.ta14_consequence_examination_queue_events (queue_id,created_at,id);
CREATE UNIQUE INDEX IF NOT EXISTS ta14_cex_queue_events_one_paid_enqueue
  ON public.ta14_consequence_examination_queue_events (queue_id)
  WHERE event_type = 'PAID_INTAKE_QUEUED';

-- These records are written by server-side privileged routes only.
ALTER TABLE public.ta14_consequence_examination_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ta14_consequence_examination_queue_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.ta14_consequence_examination_queue FROM anon,authenticated;
REVOKE ALL ON public.ta14_consequence_examination_queue_events FROM anon,authenticated;


-- One database transaction for the verified payment, evidence freeze, queue,
-- and initial chronology event. Only the trusted service role may execute.
CREATE OR REPLACE FUNCTION public.ta14_finalize_verified_examination_payment(
  p_intake_id text,
  p_order_id text,
  p_capture_id text,
  p_paid_at timestamptz,
  p_manifest jsonb,
  p_manifest_sha256 text,
  p_evidence_item_count integer
)
RETURNS TABLE (
  result_intake_id text,
  result_queue_id text,
  result_queue_state text,
  result_paid_at timestamptz,
  result_manifest_sha256 text,
  result_evidence_item_count integer,
  result_idempotent boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $
DECLARE
  v_intake public.ta14_consequence_examination_intakes%ROWTYPE;
  v_queue public.ta14_consequence_examination_queue%ROWTYPE;
  v_was_paid boolean;
BEGIN
  IF p_intake_id !~ '^TA14-CEX-[0-9]{8}-[A-Z0-9]{10}

     OR p_order_id !~ '^[A-Z0-9]{1,36}

     OR p_capture_id !~ '^[A-Z0-9]{1,36}

     OR p_paid_at IS NULL
     OR p_manifest IS NULL
     OR p_manifest_sha256 !~ '^[0-9a-f]{64}

     OR p_evidence_item_count IS NULL OR p_evidence_item_count < 0
  THEN
    RAISE EXCEPTION 'Invalid verified payment finalization parameters';
  END IF;

  SELECT * INTO v_intake
    FROM public.ta14_consequence_examination_intakes
    WHERE intake_id = p_intake_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Examination intake does not exist';
  END IF;

  v_was_paid := v_intake.status = 'PAID';
  IF v_was_paid THEN
    IF v_intake.paypal_order_id IS DISTINCT FROM p_order_id
       OR v_intake.paypal_capture_id IS DISTINCT FROM p_capture_id THEN
      RAISE EXCEPTION 'Intake already bound to another payment';
    END IF;
  ELSIF v_intake.status = 'READY_FOR_PAYMENT' THEN
    UPDATE public.ta14_consequence_examination_intakes
       SET status = 'PAID',
           paypal_order_id = p_order_id,
           paypal_capture_id = p_capture_id,
           paid_amount = 149.00,
           paid_currency = 'USD',
           paid_at = p_paid_at,
           evidence_manifest = p_manifest,
           evidence_manifest_sha256 = p_manifest_sha256,
           evidence_frozen_at = p_paid_at,
           evidence_item_count = p_evidence_item_count,
           updated_at = now()
     WHERE intake_id = p_intake_id;
  ELSE
    RAISE EXCEPTION 'Intake is not payable';
  END IF;

  SELECT * INTO v_intake
    FROM public.ta14_consequence_examination_intakes
    WHERE intake_id = p_intake_id;

  INSERT INTO public.ta14_consequence_examination_queue
    (queue_id, intake_id, state, paid_at, evidence_manifest_sha256, evidence_item_count)
  VALUES
    ('TA14-CEX-Q-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
     p_intake_id, 'QUEUED', v_intake.paid_at,
     v_intake.evidence_manifest_sha256, coalesce(v_intake.evidence_item_count, 0))
  ON CONFLICT (intake_id) DO NOTHING;

  SELECT * INTO v_queue FROM public.ta14_consequence_examination_queue
    WHERE intake_id = p_intake_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Examination queue could not be established';
  END IF;

  INSERT INTO public.ta14_consequence_examination_queue_events
    (queue_id, intake_id, event_type, from_state, to_state, event_payload)
  VALUES
    (v_queue.queue_id, p_intake_id, 'PAID_INTAKE_QUEUED', NULL, 'QUEUED',
     jsonb_build_object('evidenceManifestSha256', v_intake.evidence_manifest_sha256,
                        'evidenceItemCount', coalesce(v_intake.evidence_item_count, 0)))
  ON CONFLICT DO NOTHING;

  RETURN QUERY SELECT v_intake.intake_id, v_queue.queue_id, v_queue.state,
    v_intake.paid_at, v_intake.evidence_manifest_sha256,
    coalesce(v_intake.evidence_item_count, 0), v_was_paid;
END;
$;
REVOKE ALL ON FUNCTION public.ta14_finalize_verified_examination_payment(
  text,text,text,timestamptz,jsonb,text,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ta14_finalize_verified_examination_payment(
  text,text,text,timestamptz,jsonb,text,integer) TO service_role;

COMMIT;
