# TA-14 × VELOS R1 — PARTICIPANT FACTUAL REVIEW REQUEST

**Document:** TA14-VELOS-R1-PFR-001  
**Version:** v0.1  
**Status:** ISSUED FOR PARTICIPANT FACTUAL REVIEW  
**Related Scoping Instrument:** TA14-VELOS-R1-SCOPE-001 v0.1  
**Participant Registry Identity:** TA-14-AIGR-000029  
**Participant:** Velos Systems  
**Participant Version:** v1.0.0 — Layer-4 Deterministic Enforcement Substrate

---

## PURPOSE

This request asks Velos Systems to reconcile factual and technical details required before TA-14 can produce v0.2 of the bilateral scoping instrument or assess Technical Freeze readiness.

This is **not** a request to rewrite Velos architecture in TA-14 terminology. Participant-authored terms, mechanisms, and boundaries remain Velos-defined.

Please answer each item using the actual Velos v1.0.0 implementation and intended examination configuration. Where an item is not yet fixed, mark it **UNFROZEN** rather than estimating or generalizing.

---

## PFR-01 — INTERFACE CARRIER OBJECT

Please identify the exact object, token, message, map entry, envelope, or other carrier by which the frozen TA-14-side state would be presented to Velos.

Please provide:

- canonical name;
- field structure;
- serialization/encoding, if applicable;
- producer;
- consumer;
- cryptographic binding, if any;
- freshness/TTL field, if any;
- target-scope field(s), if any;
- how Velos distinguishes a valid carrier from malformed or unknown input.

**Participant response:**

---

## PFR-02 — NEUTRAL INPUT TERMINOLOGY

TA-14 v0.1 currently uses the neutral phrase:

> “upstream attestation / authority context presented to Velos”

Please confirm whether this is factually acceptable for the interface boundary.

If not, provide the exact Velos-preferred phrase and explain why.

**Participant response:**

---

## PFR-03 — EXACT ENFORCEMENT HOOK AND NETWORK PATH

Please identify the exact examination path from ingress through the Velos enforcement point to the destination application/socket.

Please provide:

- Linux interface(s);
- tc hook direction and attachment point;
- relevant namespace/veth topology, if used;
- destination socket/service identity;
- whether the examination runs bare-metal, VM, container, namespace, or other environment;
- any user-space component that can affect packet progression before or after the hook.

**Participant response:**

---

## PFR-04 — CONSEQUENCE / EXECUTION-CROSSING POINT

R1 must freeze one exact point at which the challenged action is considered to have crossed from attempted progression into consequential execution.

Please identify that point in Velos terms.

Examples only — do not adopt unless accurate:

- packet admitted beyond tc_ingress;
- packet reaches destination socket;
- application receives payload;
- downstream state mutation begins.

Please state the earliest technically defensible crossing point Velos is prepared to test.

**Participant response:**

---

## PFR-05 — TCP_RST SCOPE

The participant-authored route specification states that fail-closed refusal can include TC_ACT_SHOT and stateless TCP_RST emission.

Please specify:

- whether TCP_RST is expected for every refusal vector;
- which protocol/session conditions support TCP_RST;
- whether TC_ACT_SHOT alone is the authoritative execution cut;
- what evidence distinguishes packet drop from successful channel teardown;
- any cases where no TCP_RST should be expected.

**Participant response:**

---

## PFR-06 — CANONICAL STATE MUTATION / REVOCATION TIMING

For the changed-authority challenge, please define the exact behavior of canonical_state_map or the corresponding Velos native state object.

Please provide:

- how revocation/invalidation is written;
- whether update is synchronous or asynchronous;
- when the new state becomes effective at the enforcement hook;
- whether already-admitted packets/flows are affected;
- whether only the next incoming packet reflects the changed state;
- what timestamps or events can prove mutation chronology.

**Participant response:**

---

## PFR-07 — GOVERNANCE REFUSAL RECEIPT

Please provide the exact receipt schema or representative field list for the Velos Governance Refusal Receipt.

Please identify:

- receipt identifier;
- event timestamp(s);
- token/carrier identifier;
- challenged target identifier;
- violation/failure code;
- packet/header hash or equivalent correlation object;
- enforcement result;
- signing/MAC algorithm;
- key identifier;
- key custody model;
- verification procedure;
- whether a third party can verify the receipt offline without privileged Velos access.

Do not provide secret key material.

**Participant response:**

---

## PFR-08 — ALTERNATE / BYPASS ROUTE SURFACE

S6 requires a declared alternate-route or bypass challenge.

Please identify every in-scope route by which the same frozen consequence could reach the same destination without traversing the examined Velos control.

For each route, identify whether it is:

- impossible by architecture;
- disabled by configuration;
- outside declared scope;
- present and challengeable;
- unknown/unfrozen.

Examples may include alternate interfaces, namespaces, host networking, loopback, direct process access, sidecar paths, tunneling, IPv4/IPv6 divergence, or control-plane exceptions, but Velos should define the actual surface.

**Participant response:**

---

## PFR-09 — CROSS-SYSTEM CLOCK AND CORRELATION METHOD

Please identify how R1 can correlate the chronology across:

1. TA-14-side determination/carrier creation;
2. Velos control-plane ingestion;
3. kernel enforcement event;
4. packet/network observation;
5. Governance Refusal Receipt creation.

Please provide:

- clock sources;
- synchronization method;
- expected skew/error bounds, if known;
- event IDs or hashes used for cross-correlation;
- whether packet capture is available;
- whether monotonic and wall-clock timestamps are both available.

If precise cross-system synchronization is not available, state what alternative causal-correlation method Velos proposes.

**Participant response:**

---

## PFR-10 — < 4.0 µs PERFORMANCE CLAIM IN R1

Please choose one of the following:

### Option A — EXCLUDE PERFORMANCE MEASUREMENT FROM R1

R1 examines active pre-execution interdiction and evidence correspondence only. The participant-authored < 4.0 µs claim remains preserved but unexamined.

### Option B — INCLUDE A SEPARATE FROZEN PERFORMANCE SUB-PROTOCOL

If included, please provide the proposed:

- measurement start and stop points;
- clock source;
- instrumentation method;
- hardware/CPU/kernel environment;
- concurrency/load conditions;
- sample size;
- warm-up method;
- aggregation statistic(s);
- outlier treatment;
- raw evidence to preserve;
- acceptance threshold.

TA-14 will not infer a validated latency finding from registration, documentation, or a benchmark summary alone.

**Participant selection and response:**

---

## PARTICIPANT FACTUAL ATTESTATION

Please conclude with one of the following:

**A. FACTUALLY ACCEPTED AS WRITTEN**  
The responses above accurately represent Velos Systems v1.0.0 and the proposed R1 examination configuration.

**B. ACCEPTED WITH CORRECTIONS**  
The responses above are accurate subject to the listed corrections or qualifications.

**C. NOT READY TO FREEZE**  
One or more material details remain unfrozen and require further participant work before R1 Technical Freeze readiness review.

Participant name:  
Role/authority:  
Date:  
Attestation state:  
Corrections/qualifications, if any:

---

## TA-14 PROCESS BOUNDARY

Receipt of this factual review does not establish a finding, interoperability, certification, or Technical Freeze.

TA-14 will use the participant response only to reconcile the bilateral scoping instrument. Any architecture, mechanism, performance, or evidence proposition remains subject to the frozen examination and admitted execution evidence.

**Next controlled artifact after reconciliation:** TA14-VELOS-R1-SCOPE-001 v0.2.
