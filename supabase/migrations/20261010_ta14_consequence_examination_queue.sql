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

COMMIT;
