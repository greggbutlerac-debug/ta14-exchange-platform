# TA-14 Governance Continuity & Execution Authority Engine (GCEA)

## Architecture Freeze v1.0

**Status:** FROZEN INTERNAL ARCHITECTURE  
**Authority:** TA-14 Authority  
**Visibility:** Private / internal development  
**Version:** 1.0  
**Freeze basis:** Production R1 and R2 evidence established in the TA-14 Exchange

---

## 1. Purpose

GCEA is a TA-14-native execution-authority capability that determines whether a specific consequence is presently authorized to proceed under current evidence, current standing, current scope, and current authority.

GCEA does not treat historical approval as permanent execution authority. A materially changed condition can challenge present standing, collapse binding scope, and require reauthorization before the governed consequence can proceed.

The canonical governing chain is:

**Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome**

The v1.0 freeze covers the authority boundary through execution-attempt adjudication and preserved replay evidence. Commit, external execution, and outcome objects remain future implementation work unless separately frozen.

---

## 2. Canonical Determinations

GCEA v1.0 recognizes exactly four authority determinations:

- **ALLOW** — present standing and binding scope are established for the declared consequence.
- **HOLD** — present authority is not presently sufficient to progress, but the condition may be curable through additional evidence, revalidation, or reauthorization.
- **DENY** — the attempted consequence is not authorized to execute under the evaluated state.
- **ESCALATE** — the requested intervention or authority path requires higher or different authority and cannot be resolved within the evaluated scope.

No external system may reinterpret HOLD as ALLOW, or infer permission from the absence of DENY.

---

## 3. Canonical Standing States

GCEA v1.0 recognizes:

- **CURRENT**
- **CHALLENGED**
- **EXPIRED**
- **REVOKED**

Standing is evaluated against present conditions. Historical validity remains part of chronology but does not by itself establish current binding authority.

---

## 4. Canonical Governed Objects

### 4.1 Governed Asset

Required identity fields:

- `assetId`
- `version`
- `routeId`
- `consequence`

The governed asset identifies the exact object/version/route/consequence combination against which authority is evaluated.

### 4.2 Authority Grant

Required fields:

- `authorityId`
- `assetId`
- `assetVersion`
- `routeId`
- `consequence`
- `effectiveAt`
- `expiresAt`
- `revoked`

Authority is scope-bound. A grant for a different asset version, route, or consequence does not transfer automatically.

### 4.3 Evidence Standing

Required fields:

- `evidenceId`
- `continuitySupported`
- `admissibilitySupported`

Continuity and admissibility are separate conditions. Either may independently prevent present binding authority.

### 4.4 Material Change

Required fields:

- `changeId`
- `detectedAt`
- `category`
- `material`
- `description`

Frozen v1.0 change categories:

`MODEL | PROMPT | DATA | VENDOR | POLICY | OPERATIONAL | OTHER`

A material change challenges prior standing and requires reauthorization before the prior consequence may regain binding scope.

### 4.5 Execution Attempt

Required fields:

- `attemptId`
- `attemptedAt`
- `consequence`

Execution is evaluated against present standing, not against historical approval alone.

### 4.6 Intervention Authority

Required fields:

- `authorityId`
- `routeId`
- `consequence`
- `effectiveAt`
- `expiresAt`
- `revoked`

Intervention authority is separately scoped. Invalid or unscoped intervention authority does not silently override the primary execution determination.

---

## 5. Binding Rule

Binding scope exists only when all of the following are true:

1. evidence continuity is supported;
2. evidence admissibility is supported;
3. the authority grant exists;
4. the grant is effective and unexpired;
5. the grant is not revoked;
6. the asset/version/route/consequence scope matches exactly;
7. standing is CURRENT; and
8. no material change is presently challenging the authority state.

If these conditions do not hold, GCEA does not infer permission.

---

## 6. Material-Change Rule

When a material change is present:

- standing becomes **CHALLENGED**;
- the authority determination becomes **HOLD** unless a stronger denial condition applies;
- binding scope collapses to `null` / NONE;
- historical authority remains preserved as historical evidence;
- an execution attempt against the challenged consequence is refused;
- reauthorization must create current support for the changed asset state before binding can be restored.

Later reauthorization does not rewrite or erase the earlier HOLD or DENY event.

---

## 7. Execution-Attempt Rule

GCEA v1.0 distinguishes standing evaluation from consequence execution.

A challenged state may evaluate to **HOLD** at the standing layer while the actual attempted consequence evaluates to **DENY** at the execution boundary.

An execution attempt is permitted only when:

- standing determination is ALLOW;
- binding scope equals the attempted consequence; and
- the attempted consequence matches the governed asset consequence.

Otherwise the execution boundary refuses progression.

---

## 8. Receipt and Replay Contract

### 8.1 Authority Receipt

Canonical version:

`TA14.GCEA.RECEIPT.v1`

Each authority evaluation produces:

- SHA-256 hash;
- replay identity;
- canonical payload;
- determination;
- standing;
- binding scope;
- reason codes.

### 8.2 Execution Receipt

Canonical version:

`TA14.GCEA.EXECUTION.v1`

Each execution-attempt evaluation preserves:

- attempted consequence;
- evaluated authority input;
- standing receipt hash;
- intervention authority, if any;
- final determination;
- `executionPermitted` boolean;
- reason codes;
- SHA-256 identity.

### 8.3 Semantic Replay

For records containing preserved authority input, v1.0 semantic replay must independently recompute the authority determination from that input and reproduce the historical:

- determination;
- standing;
- receipt hash; and
- replay identity.

A hash-only integrity check is not equivalent to semantic replay.

---

## 9. Chronology Contract

The production chronology is append-only and sequence ordered.

Each event preserves:

- run identity;
- sequence number;
- event type;
- asset/version/route identity;
- determination and standing;
- receipt hash and replay identity;
- preserved payload;
- previous-event hash;
- event hash;
- preservation time.

The chain must reject broken sequencing, event-hash mismatch, previous-event mismatch, and receipt-replay mismatch.

The v1.0 event vocabulary is:

`BASELINE | MATERIAL_CHANGE | AUTHORITY_CHALLENGE | BOUNDARY_DETERMINATION | REAUTHORIZATION | RESTORATION | REPLAY_VERIFICATION`

---

## 10. Reason-Code Baseline

The v1.0 implementation currently includes these frozen reason-code meanings:

- `CONTINUITY_UNSUPPORTED`
- `ADMISSIBILITY_UNSUPPORTED`
- `MATERIAL_CHANGE_REQUIRES_REAUTHORIZATION`
- `AUTHORITY_ABSENT`
- `AUTHORITY_REVOKED`
- `AUTHORITY_NOT_EFFECTIVE`
- `AUTHORITY_EXPIRED`
- `AUTHORITY_SCOPE_MISMATCH`
- `PRESENT_STANDING_ESTABLISHED`
- `ATTEMPT_CONSEQUENCE_MISMATCH`
- `EXECUTION_BOUNDARY_REFUSED`
- `EXECUTION_BOUNDARY_PERMITTED`
- `INTERVENTION_AUTHORITY_INVALID_OR_UNSCOPED`

Future versions may add reason codes, but v1.0 semantics must not be silently redefined.

---

## 11. Founding Production Evidence

### R1

Founding authenticated production R1 established:

- owner-authenticated execution;
- material-change standing challenge;
- binding-scope collapse;
- reauthorization and restoration;
- append-only production chronology;
- hash-chain preservation; and
- persisted replay verification.

Founding preserved run anchor:

`TA14-GCEA-R1-20260828001058`

### R2

R2 added preserved authority inputs, semantic replay, and an explicit challenged execution attempt.

Preserved production run:

`TA14-GCEA-R2-20260828122853`

R2 result:

- 5 preserved events;
- 5 semantic replays;
- challenged execution determination: **DENY**;
- `executionPermitted = false`;
- terminal event hash:

`8a7ceb2f5c53ed97ae9fe910c4509d50d18311ea83621e9b66ffd706db3497c8`

This evidence establishes the bounded v1.0 claims below. It does not extend them beyond the demonstrated environment.

---

## 12. Frozen v1.0 Claims

Within the bounded TA-14 production demonstration, GCEA v1.0 has established that it can:

1. identify a governed asset/version/route/consequence;
2. evaluate present authority separately from historical approval;
3. challenge standing after a material change;
4. collapse present binding scope when standing is challenged;
5. refuse a consequential execution attempt while binding authority is absent;
6. preserve the refusal and its authority inputs in append-only chronology;
7. reauthorize a changed asset under new current authority;
8. restore binding only after current standing is re-established;
9. create deterministic SHA-256 authority and execution receipts; and
10. semantically replay preserved authority inputs and reproduce historical determinations.

---

## 13. Frozen v1.0 Non-Claims

GCEA v1.0 does **not** claim:

- OrchestrAI integration or OMG compatibility;
- implementation of any third party's architecture;
- automatic control of external customer systems;
- regulatory certification;
- Registry standing by virtue of this internal freeze;
- universal correctness of third-party evidence;
- authority transfer from an external governance system into TA-14;
- external execution enforcement beyond the bounded TA-14 demonstration;
- completed canonical Commit or Outcome objects; or
- production readiness as a general third-party commercial adapter.

---

## 14. Independent-Development Boundary

GCEA is an independently developed TA-14 capability.

The v1.0 freeze does not incorporate OrchestrAI source code, private schema, confidential material, copied interface, proprietary rule configuration, or branding.

Third-party governance systems may later be connected only through a separately declared adapter or examination boundary. No adapter may imply authority transfer, equivalence, certification, or interoperability unless those claims are independently established.

---

## 15. Change Control

This document freezes GCEA architecture version **1.0**.

A change requires a new version when it alters any of the following:

- determination semantics;
- standing semantics;
- binding rule;
- authority scope model;
- material-change consequences;
- execution-attempt refusal rule;
- receipt canonicalization;
- semantic replay contract;
- chronology integrity rules; or
- frozen claims/non-claims.

Implementation corrections that do not alter frozen semantics may remain within v1.0, but must preserve historical receipts and chronology.

No later implementation may retrospectively rewrite an existing R1/R2 event to make it conform to newer behavior.

---

## 16. Next Architectural Boundary

The next phase is not automatically "R3."

Before any new numbered examination, TA-14 must separately define and freeze the next architectural object(s). The intended next product-development boundary is:

**Commit → Execution → Outcome**

followed by a neutral third-party adapter contract if and only if the internal canonical objects are first established.

---

**Freeze statement:** GCEA v1.0 is frozen as the TA-14-native present-standing and execution-authority architecture described above. Production R1 and R2 are preserved as founding evidence. Future development must extend this architecture explicitly rather than silently changing what R1 or R2 proved.
