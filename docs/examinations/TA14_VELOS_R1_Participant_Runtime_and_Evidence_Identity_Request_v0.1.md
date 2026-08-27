# TA-14 × VELOS R1 — PARTICIPANT RUNTIME + EVIDENCE IDENTITY REQUEST

**Document:** TA14-VELOS-R1-PREI-001  
**Version:** v0.1  
**Status:** ISSUED FOR PARTICIPANT RUNTIME / EVIDENCE RECONCILIATION  
**Related Scope:** TA14-VELOS-R1-SCOPE-001 v0.2  
**Related Readiness Matrix:** TA14-VELOS-R1-TFR-001 v0.1  
**Related Acceptance Package:** TA14-VELOS-R1-AIAC-001 v0.1  
**Participant Registry Identity:** TA-14-AIGR-000029  
**Participant:** Velos Systems  
**Participant Version:** v1.0.0 — Layer-4 Deterministic Enforcement Substrate

---

## 1. PURPOSE

The TA-14-side VECT contract, schema, and preliminary examination fixtures now exist as bounded repository artifacts. The remaining Technical Freeze blockers are primarily participant-owned Velos runtime and evidence identities.

This request asks Velos to provide only the exact facts required to bind the declared v1.0.0 execution surface to reproducible, inspectable artifacts before Technical Freeze.

This is not an architecture rewrite, certification request, or demand that Velos adopt TA-14 terminology.

### Response rule

For every item below, provide one of:

- **FIXED** — exact identity/configuration exists now; provide the requested values;
- **UNFROZEN** — the item is intended for R1 but the exact value has not yet been fixed;
- **NOT APPLICABLE** — explain why the artifact/evidence channel does not apply to the declared R1 route;
- **OUT OF SCOPE** — explain why it is outside the frozen proposition.

Do not estimate hashes, versions, paths, clock sources, runtime identities, or measurements.

---

## 2. A-09 — VELOS CONTROL-PLANE / MAP-LOADER IDENTITY

Please provide:

- canonical artifact name;
- version/revision;
- source repository + exact commit, if source is available;
- binary/container identity, if applicable;
- build procedure/toolchain if the binary is built from source;
- SHA-256 of the frozen executable/package where technically applicable;
- exact invocation or service entrypoint used in R1;
- exact interface by which a validated VECT is inserted into native Velos state.

**Participant response:**

---

## 3. A-10 — eBPF ENFORCEMENT ARTIFACT

Please provide:

- source artifact/repository identity;
- exact commit/revision;
- source file(s) containing the R1 `tc_ingress` program;
- BPF program/section name;
- compiler and version;
- build flags relevant to the R1 object;
- resulting `.o` / deployable object identity;
- SHA-256 of the frozen object;
- loader attachment command/procedure.

If CO-RE/BTF or another build portability mechanism is used, identify it.

**Participant response:**

---

## 4. A-11 — `canonical_state_map` DEFINITION

Please provide the exact R1 map definition:

- map name;
- BPF map type;
- key schema;
- value schema;
- max entries;
- flags;
- pinned filesystem path, if pinned;
- lifetime/ownership semantics;
- whether the map persists across loader/control-plane restart;
- how VECT identity maps to the key actually evaluated at `tc_ingress`.

**Participant response:**

---

## 5. A-12 — REVOCATION / MUTATION MECHANISM

For F4, provide the exact mechanism used to make previously valid authority no longer executable:

- command/API/function/tool;
- version/artifact identity;
- exact operation on `canonical_state_map` or equivalent native state;
- synchronous/asynchronous semantics;
- expected point at which the change becomes effective;
- how the mutation event itself is captured as evidence;
- whether active established flows are separately enumerated for reset handling.

**Participant response:**

---

## 6. A-13 — KERNEL ENVIRONMENT IDENTITY

Please provide the exact R1 kernel/runtime host facts:

- Linux distribution/image;
- exact `uname -a` / kernel release;
- architecture;
- relevant BPF/tc feature assumptions;
- BTF identity/status if used;
- host, VM, bare-metal, container-host, or CI-runner classification;
- any kernel configuration dependency material to the declared enforcement behavior.

If the exact environment is not yet provisioned, mark **UNFROZEN**.

**Participant response:**

---

## 7. A-14 — CONTAINER / RUNTIME IMAGE IDENTITY

If containers or immutable runtime images are used, provide:

- image name;
- immutable image digest;
- runtime (`docker`, `containerd`, etc.);
- relevant container/network privileges;
- namespace ownership;
- whether the eBPF program is loaded from host or container context.

If no container image is used, mark **NOT APPLICABLE** and identify the equivalent runtime package/environment identity.

**Participant response:**

---

## 8. A-15 — NETWORK NAMESPACE / TOPOLOGY RECORD

Please provide the exact R1 path from challenge source to target service, including:

- namespaces;
- veth pairs;
- bridges;
- interface names;
- IP addresses;
- routing entries relevant to R1;
- target namespace;
- any NAT, proxy, service mesh, forwarding, or overlay behavior;
- diagram or command-output form sufficient for independent reconstruction.

**Participant response:**

---

## 9. A-16 — `tc_ingress` ATTACHMENT EVIDENCE

Please provide the exact attachment identity:

- interface receiving `clsact`;
- qdisc state;
- ingress filter/program ID;
- BPF program tag/ID if available;
- commands used to load/attach;
- command/output planned to prove the frozen object is attached to the frozen interface at execution time.

**Participant response:**

---

## 10. A-17 / A-18 — TARGET SERVICE + SOCKET FIXTURE

Please define the exact consequential target for R1:

- service/application name;
- version or artifact identity;
- SHA-256/container digest where applicable;
- namespace;
- protocol;
- destination IP;
- destination port;
- exact process/socket binding;
- method used to prove whether a challenged packet entered the kernel socket receive buffer;
- distinction between kernel socket admission and application-level processing.

The R1 execution-crossing point is specifically **kernel socket receive-buffer admission**, not later application behavior.

**Participant response:**

---

## 11. A-19 — CHALLENGE PAYLOAD BINDING

Please state whether Velos requires any additional participant-side constraints on the challenge payload beyond the VECT `payload_binding_hash`.

If yes, provide:

- exact payload format;
- size/transport constraints;
- fragmentation/reassembly assumptions;
- whether retransmission changes the payload identity;
- method for binding the observed packet to the frozen payload hash.

**Participant response:**

---

## 12. A-20 / A-21 — KERNEL EVENT SCHEMA + COLLECTOR

Please provide:

- exact kernel/ring-buffer event schema;
- schema version;
- event fields;
- event collector artifact name/version;
- source/binary identity and SHA-256 where applicable;
- collector invocation;
- output format;
- storage path or evidence-package location;
- method to prove event loss/drops did or did not occur;
- exact correlation fields linking the event to VECT/assertion and packet evidence.

**Participant response:**

---

## 13. A-22 — GOVERNANCE REFUSAL RECEIPT SCHEMA

The participant previously supplied representative fields. For freeze, please provide the exact canonical R1 receipt schema or machine-readable definition, including:

- schema/version identifier;
- canonical serialization format;
- mandatory vs optional fields;
- exact reason-code enumeration;
- signature-input/canonicalization procedure;
- exact relationship among `receipt_id`, `assertion_id`, token fingerprint, kernel timestamp, and packet/header evidence.

**Participant response:**

---

## 14. A-23 — RECEIPT SIGNER PUBLIC IDENTITY

Please provide only public verification identity, not secret material:

- signer/node URN or canonical identifier;
- Ed25519 public key;
- stable public-key fingerprint;
- key publication location or participant-preserved artifact;
- key rotation rule relevant to R1;
- evidence proving which key signed the frozen R1 receipts.

Do **not** provide private keys, seeds, HSM credentials, or enclave secrets.

**Participant response:**

---

## 15. A-24 — OFFLINE RECEIPT VERIFIER

Please provide:

- verifier artifact/tool name;
- version;
- source/binary identity;
- SHA-256 where applicable;
- exact offline verification command/procedure;
- required inputs;
- expected success/failure output;
- whether a third party can run it without privileged Velos infrastructure.

**Participant response:**

---

## 16. A-25 / A-26 — PACKET CAPTURE TOOL + CONFIGURATION

Please provide the frozen packet-evidence method:

- tool (`tcpdump`, `dumpcap`, etc.);
- version;
- capture namespace/interface;
- capture filter;
- snap length;
- timestamp precision/source;
- start condition;
- stop condition;
- output format;
- file naming convention;
- integrity/hash method;
- whether capture occurs on one or both sides of the `tc_ingress` cut.

If only one capture point is used, explain how target non-admission will be independently established.

**Participant response:**

---

## 17. A-27 — PTP / WALL-CLOCK SOURCE

The participant previously declared PTP / `CLOCK_REALTIME` with ±5.0 ms maximum tolerated skew.

Please provide:

- PTP implementation/tool;
- version;
- grandmaster/upstream source identity where available;
- synchronization command/configuration;
- health/status evidence captured immediately before and after R1 execution;
- method used to demonstrate actual skew remained within the frozen tolerance;
- behavior if sync health is lost during a challenge.

**Participant response:**

---

## 18. A-28 — MONOTONIC CHRONOLOGY SOURCE

Please provide:

- exact kernel monotonic clock used for local event ordering;
- timestamp unit/precision;
- how it appears in kernel event evidence;
- how local monotonic chronology is associated with UTC/wall-clock evidence without pretending they are the same clock domain.

**Participant response:**

---

## 19. S6 — IN-SCOPE ALTERNATE ROUTE CONFIRMATION

Earlier factual review correctly bounded unmonitored host paths, direct IPC, loopback, and other non-instrumented routes outside the R1 claim.

For Technical Freeze, please answer the narrower question:

> Within the declared R1 environment, is there any alternate route by which the same frozen network consequence can reach the target service/socket **without traversing the designated instrumented `tc_ingress` interface**?

Choose one:

- **NO IN-SCOPE ALTERNATE ROUTE IDENTIFIED** — provide topology evidence supporting this statement;
- **YES — ALTERNATE ROUTE EXISTS** — identify it so S6 can challenge it;
- **UNFROZEN / UNKNOWN** — route surface not yet sufficiently established.

This does not widen R1 to architecture-wide non-bypassability.

**Participant response:**

---

## 20. PARTICIPANT ATTESTATION

Please select one:

- [ ] **A. FACTUALLY COMPLETE FOR FREEZE PREPARATION** — the fixed responses above accurately describe the intended Velos v1.0.0 R1 runtime/evidence configuration; any remaining `UNFROZEN` item is explicitly identified.
- [ ] **B. COMPLETE WITH CORRECTIONS / QUALIFICATIONS** — provide corrections below.
- [ ] **C. NOT READY FOR FREEZE PREPARATION** — identify the unresolved runtime/evidence facts.

**Participant name:**  
**Role:**  
**Date:**  
**Attestation state:**  

### Corrections / qualifications

---

## 21. TA-14 PROCESS BOUNDARY

Receipt of this response does **not** establish Technical Freeze, interoperability, certification, performance validation, or a supported R1 finding.

TA-14 will:

1. reconcile the participant response against TA14-VELOS-R1-SCOPE-001 v0.2;
2. populate the participant-owned artifact identities in TA14-VELOS-R1-AIAC-001 v0.2;
3. preserve final SHA-256 / immutable identities for the full frozen package;
4. issue a Technical Freeze readiness determination;
5. require final participant acceptance of the frozen participant-specific facts before R1 execution is authorized.

**Technical Freeze remains HOLD until those steps are complete.**
