# TA-14 Buyer-Intent Discovery Cluster v1

**Date:** 2026-08-23
**Purpose:** Revenue Activation Plan discovery research. Build only search surfaces that correspond to real buyer language, a bounded TA-14 examination, inspectable proof, and a commercial conversion path.

## Current cornerstone cluster

Already live/hardened:

1. `/ai-governance/authorization-changed-before-execution`
2. `/ai-governance/evidence-changed-before-execution`
3. `/ai-governance/ai-agent-executed-without-authority`
4. `/ai-governance/prove-ai-action-was-blocked`
5. Hub: `/ai-governance/execution-evidence`

Commercial path:

`Buyer problem -> inspectable proof -> $249 Execution Evidence Snapshot -> $750+ Execution Claim Review -> intake`

## External-language validation — 2026-08-23

Current search results show a recurring market vocabulary around:

- **AI agent audit trail**
- **AI agent audit / how to audit AI agents**
- **AI audit evidence**
- **AI agent authorization / prove authority**
- **AI agent permissions / delegated authority**
- **execution evidence**
- **audit logs versus execution evidence**
- **agent incident / security audit evidence**
- **proof that a specific action was authorized when it executed**

This is qualitative SERP validation, not keyword-volume data. No search-volume claim is made.

## Evidence that the language is active

- NIST NCCoE's 2026 Software and AI Agent Identity and Authorization concept paper explicitly asks how agents prove authority for a specific action, how delegation works, how human identity binds to agent authorization, and how actions/intent can be logged in tamper-proof, verifiable form.
- Current commercial and practitioner pages use titles such as “AI Agent Audit Trail,” “How to Audit an AI Agent System,” “AI Agent Audit Checklist,” “AI Agent Permissions,” and “What AI audit evidence should teams collect?”
- Multiple current sources distinguish ordinary application logging from evidence that connects requested action, authorization, execution, and outcome.

## Recommended second discovery cluster

### P1 — Build next

**Route:** `/ai-governance/ai-agent-audit-trail`

**Primary buyer question:** What should an AI agent audit trail actually prove?

**Intent:** Audit/compliance/security teams evaluating whether runtime logs are enough.

**TA-14 fit:** Very high. Connect requested action, evidence, authority, binding/commit, execution, outcome, replay, and proof boundary.

**Proof bridge:** EA-000013, EA-000020, EA-000028/29/30 plus registry.

**Conversion:** $249 Snapshot for one sampled action; $750+ Review for a bounded execution claim.

---

**Route:** `/ai-governance/prove-ai-agent-action-was-authorized`

**Primary buyer question:** Can you prove this specific AI agent action was authorized when it executed?

**Intent:** Audit, incident response, GRC, regulated deployment, delegated authority.

**TA-14 fit:** Very high. This is narrower than the existing “authorization changed before execution” page: the searcher begins with a completed or sampled action and needs affirmative proof of authority at the consequence boundary.

**Proof bridge:** EA-000013 plus execution correspondence artifacts.

**Conversion:** Snapshot for one action/evidence bundle; Claim Review for authority/changed-condition/replay analysis.

---

**Route:** `/ai-governance/ai-logs-vs-execution-evidence`

**Primary buyer question:** Are AI agent logs enough for an audit?

**Intent:** Education with strong commercial qualification. Searcher already has logs but is unsure whether they prove authorization, restraint, or outcome.

**TA-14 fit:** High. This page should distinguish event logging from proposition-specific execution evidence without claiming logs are useless.

**Proof bridge:** EA-000020 and EA-000030 are especially useful because they show correspondence and non-occurrence proof boundaries.

**Conversion:** Snapshot: submit one log/evidence set and one bounded claim.

### P2 — Build after first conversion/search data

**Route:** `/ai-governance/ai-agent-incident-evidence`

Buyer question: What evidence should we preserve after an AI agent incident?

Potential overlap with unauthorized-execution page. Build only if Search Console/query data demonstrates broader incident-intent demand.

---

**Route:** `/ai-governance/ai-agent-permissions-audit`

Buyer question: How do you audit AI agent permissions, delegation, and action authority?

Potential overlap with authorization pages. Build only if permission/delegation queries emerge.

## Pages NOT recommended now

Do not create generic pages for:

- “AI governance framework”
- “What is AI governance?”
- “Best AI governance”
- generic “responsible AI”
- generic “AI safety”
- generic “AI compliance”

These are broad, crowded, weakly qualified intents and do not naturally lead to the narrow paid execution-evidence offer.

## Cannibalization rules

1. Existing **authorization changed before execution** owns changed/stale authority before consequence.
2. New **prove action was authorized** owns affirmative proof for a specific sampled/completed action.
3. Existing **executed without authority** owns incident reconstruction after suspected unauthorized execution.
4. Existing **prove action was blocked** owns refusal/non-occurrence claims.
5. New **agent audit trail** owns the complete evidence record/auditability question.
6. New **logs vs execution evidence** owns the narrower “are my logs enough?” comparison.

If a draft cannot maintain these boundaries, merge it into an existing page rather than publish another route.

## Build gate

A new SEO page ships only when all six are true:

1. Real buyer-language evidence exists.
2. Search intent is materially distinct from an existing production route.
3. TA-14 can answer the question with a bounded examination.
4. At least one inspectable proof artifact supports the page.
5. The page has a natural $249 or $750+ conversion path.
6. Claims remain inside what the evidence can actually establish.

## Measurement

Do not judge this cluster by page count. Track:

- indexed pages
- organic impressions by query cluster
- organic clicks
- hub-to-problem-page CTR
- proof-artifact click-through
- Snapshot CTA clicks
- intake starts
- qualified inquiries
- paid Snapshots
- Claim Review expansion
- objections and search language used by buyers

Use actual Search Console and conversion data to decide whether P2 pages should exist.
