# TA-14 Registered Participant Continuation Boundary

Status: CONTROLLED DESIGN BOUNDARY
Date: 2026-08-27

## Purpose

Create a measurable commercial continuation path for already-registered governance participants without converting Registry status, Registry notifications, or institutional records into marketing consent or commercial authority.

## Governing separation

Registry registration is an institutional record.

Commercial continuation is a separate voluntary interaction.

Therefore:

- registration MUST NOT create a paid customer state;
- registration MUST NOT create marketing consent;
- Registry administrator notifications MUST NOT be repurposed as participant marketing delivery;
- acknowledgement or resolution of a Registry notification MUST NOT alter commercial eligibility;
- commercial interaction MUST NOT modify the underlying Registry record;
- institutional identifiers MAY be carried as attribution context but MUST NOT be treated as commercial authority.

## Eligible continuation surface

A registered participant may encounter a separate continuation offer after successful registration or when revisiting their authenticated Registry record.

Canonical offer:

`Start 60-Day TA-14 Workspace`

Canonical destination:

`/start-free`

The destination SHOULD preserve:

- `source=registry`
- `registry_id=<registry identifier>`
- `submission_id=<submission identifier>`
- existing UTM attribution when present

## Measurement chain

The controlled commercial evidence chain is:

`Registered Registry record`

→ `Registered Trial Offer Viewed`

→ `Start 60-Day TA-14 Workspace` click

→ `ta14_seo_visit_id`

→ authenticated `/start-free` continuation

→ commercial trial activation

→ trial row with `source_visit_id`

→ active / converted state

→ authoritative subscription attribution

→ paid state

No downstream stage may be inferred from an upstream stage.

## Existing participant exposure

Existing registered participants SHOULD NOT be mass-emailed merely because an email address exists in Registry or authentication data.

Permitted exposure mechanisms include:

1. authenticated Registry-record continuation surface;
2. participant workspace continuation surface;
3. individually authorized outreach performed through an appropriate communication channel;
4. future opt-in commercial notification capability with explicit preference evidence.

Any future automated participant email campaign requires a separate consent/eligibility model and delivery audit. It must not inherit permission from Registry administrator notification infrastructure.

## Deduplication

Offer impressions and clicks may repeat. Commercial reporting SHOULD count distinct `visit_id` for visitor-level conversion metrics.

Trial activation remains governed by the commercial trial ledger and its existing one-trial/account rules.

## Attribution

The server-side `ta14_seo_visit_id` cookie is the primary browser-session bridge into trial activation.

Registry identifier and submission identifier are supporting commercial attribution metadata only. They do not establish certification, endorsement, authority, or institutional determination.

## Internal operator exclusion

TA-14 owner/reviewer/operator activity MUST be excluded from qualified participant conversion metrics wherever operator identity is known.

Testing activity must remain distinguishable from external participant evidence.

## Evidence states

A dashboard stage MUST resolve to one of three meanings:

- positive observed value: evidence exists;
- `0`: tracking is available and no qualifying evidence was observed;
- `TRACKING_UNAVAILABLE`: the authoritative source could not be evaluated.

Unavailable evidence MUST NOT be rendered or interpreted as zero.

## Commercial authority boundary

The following claims require their own evidence:

- participant/customer: qualifying commercial interaction or account state;
- trial: authoritative commercial trial row;
- converted: authoritative trial conversion state;
- paid: authoritative billing/subscription attribution;
- revenue/MRR: authoritative billing evidence.

Traffic, registration, offer exposure, clicks, and intent are not revenue.

## Operational objective

Increase qualified exposure to the existing continuation surface while preserving the Registry as an institutional record system.

The first operational target is not mass outreach. It is to make the continuation offer reliably discoverable by legitimate registered participants, measure the resulting cohort, and only then decide whether a separately consented outreach system is justified.

## Acceptance criteria

This boundary is satisfied when:

- registered participants can discover a separate commercial continuation;
- Registry institutional state remains unchanged by that interaction;
- offer views and CTA clicks are measurable;
- trial activation is bound to the attributable visit where available;
- paid conversion is derived only from authoritative subscription attribution;
- internal/operator activity is excluded from commercial evidence;
- missing tracking is distinguished from observed zero;
- no Registry email/address is treated as marketing consent by default.

## Institutional rule

**Registration establishes a Registry record. It does not establish commercial consent. Commercial continuation must remain voluntary, separately attributable, and evidentially bounded.**
