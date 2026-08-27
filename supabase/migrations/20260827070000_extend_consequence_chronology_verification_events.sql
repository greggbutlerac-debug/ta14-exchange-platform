-- TA-14 Consequence Examination Engine
-- Chronology grammar hardening for post-examination institutional events.
-- This migration does not alter Registry identity, the 14-step Registry,
-- S0-S7 ordering, runtime sealing, findings, receipts, or publication semantics.

alter table public.consequence_examination_chronology
  drop constraint if exists consequence_examination_chronology_event_kind_check;

alter table public.consequence_examination_chronology
  add constraint consequence_examination_chronology_event_kind_check
  check (
    event_kind in (
      'TECHNICAL_FREEZE',
      'RUN_OPENED',
      'S0','S1','S2','S3','S4','S5','S6','S7',
      'FINDING',
      'SEALED',
      'RECEIPT_PUBLISHED',
      'INDEPENDENT_VERIFICATION',
      'VERIFIER_ADMISSIBILITY',
      'EXAMINATION_LINEAGE',
      'VOIDED'
    )
  );
