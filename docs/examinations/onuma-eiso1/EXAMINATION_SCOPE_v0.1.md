# ONUMA Semantic Bridge ↔ TA-14 — EISO-1 Federated Execution Examination

Status: INTERNAL / PRE-PUBLICATION
Date: 2026-08-30

## Purpose

Prepare a bounded TA-14 Exchange examination around one externally governed building object without publishing or representing the external party as an Exchange participant before the work is complete.

## Frozen object

- External architecture: ONUMA Semantic Bridge
- Building context: RE1 residential tower public Semantic Bridge snapshot
- Object: EISO-1 — Power Disconnect
- Stable identity namespace: `ONUMA_ID`
- ONUMA ID: `3254365`
- RDF namespace: `http://onuma.com/schema#`
- RDF subject: `http://onuma.com/schema#Component_177_3254365`
- Persistent external identity remains ONUMA-governed; TA-14 does not mint a replacement object identifier.

## Examination proposition

Can TA-14 consume an externally established building identity and attributable context, preserve that identity and provenance, evaluate a proposed consequential action using TA-14's native execution-governance architecture, and return ALLOW / HOLD / DENY / ESCALATE against the same ONUMA identity without architectural absorption?

## Two conditions

### A — Normal operations

A facilities party, contractor, AI agent, or machine proposes operating EISO-1. No emergency authority is inferred.

### B — Verified fire/emergency test condition

A verified firefighter under a verified fire condition and bounded emergency authority proposes operating the same EISO-1 object. For the first pass, trust/authority facts may be explicit frozen test assertions and must remain labeled ASSERTED unless independently verified.

## Inputs

- ONUMA identity and semantic/building relationships from attributable source data;
- continuity/current-state evidence available at test time;
- actor identity/role/authority/scope/duration evidence available at test time;
- exact proposed action;
- provenance for every asserted, observed, inferred, or verified field.

## Native TA-14 output

One of:

- ALLOW
- HOLD
- DENY
- ESCALATE

No outcome is predetermined.

## Exchange record requirements

The examination record must preserve:

- external identity namespace and object ID;
- TA-14 architecture/version/ruleset used;
- technical freeze identifier and digest;
- evidence references and classification;
- authority source and status;
- chronology;
- determination and reason codes;
- execution state;
- unresolved conditions;
- whether the result was merely returned or actually consumed by an external system;
- whether execution was simulated, proposed, committed, transmitted, physically performed, or physically prevented.

## Non-claims

This internal preparation does not represent ONUMA, C4SB, LF Decentralized Trust, ALN, or any individual as a registered TA-14 Exchange participant.

It does not claim live API access until authenticated live access is actually exercised.

It does not claim bidirectional interoperability merely because TA-14 produces a machine-readable return.

It does not claim physical execution or physical prevention unless evidence establishes it.

## Publication gate

Keep the case internal until the technical examination is complete. Publication/participant representation is a later governance decision and is not required to perform the engineering work.
