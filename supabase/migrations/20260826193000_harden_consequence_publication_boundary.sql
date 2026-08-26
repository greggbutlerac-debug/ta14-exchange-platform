-- TA-14 Consequence Examination Engine
-- Publication-boundary hardening.
-- A PUBLIC receipt is the affirmative authority for public disclosure of the
-- corresponding finding, cryptographic seal, and chronology.
-- WITHHELD examinations remain institutionally preserved but are not publicly readable.
-- This migration does not modify the 14-step Registry, Registry submission contracts,
-- S0-S7 examination ordering, runtime sealing, finding issuance, or terminal issuance logic.

-- Replace unconditional public-read policies created by 20260826152000.
drop policy if exists public_read_consequence_findings on public.consequence_examination_findings;
drop policy if exists public_read_consequence_seals on public.consequence_examination_seals;
drop policy if exists public_read_consequence_chronology on public.consequence_examination_chronology;

-- Findings become public only after the same run has an affirmatively PUBLIC receipt.
create policy public_read_published_consequence_findings
on public.consequence_examination_findings
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.consequence_examination_receipts r
    where r.run_id = consequence_examination_findings.run_id
      and r.publication_state = 'PUBLIC'
      and r.published_at is not null
  )
);

-- Cryptographic seals follow the same publication authority.
create policy public_read_published_consequence_seals
on public.consequence_examination_seals
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.consequence_examination_receipts r
    where r.run_id = consequence_examination_seals.run_id
      and r.publication_state = 'PUBLIC'
      and r.published_at is not null
  )
);

-- Chronology is publicly inspectable only for an affirmatively published run.
create policy public_read_published_consequence_chronology
on public.consequence_examination_chronology
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.consequence_examination_receipts r
    where r.run_id = consequence_examination_chronology.run_id
      and r.publication_state = 'PUBLIC'
      and r.published_at is not null
  )
);

-- Preserve the existing receipt publication policy. Recreate defensively so the
-- complete public boundary is explicit in this hardening migration.
drop policy if exists public_read_public_consequence_receipts on public.consequence_examination_receipts;
create policy public_read_public_consequence_receipts
on public.consequence_examination_receipts
for select
to anon, authenticated
using (
  publication_state = 'PUBLIC'
  and published_at is not null
);
