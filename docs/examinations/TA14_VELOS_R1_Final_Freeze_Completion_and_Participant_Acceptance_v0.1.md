# TA-14 × VELOS R1 — FINAL FREEZE-COMPLETION + PARTICIPANT ACCEPTANCE

**Document:** TA14-VELOS-R1-FFCPA-001  
**Version:** v0.1  
**Status:** ISSUED FOR FINAL IDENTITY SEALING + PARTICIPANT ACCEPTANCE  
**Registry:** TA-14-AIGR-000029  
**Participant:** Velos Systems  
**Participant Version:** v1.0.0 — Layer-4 Deterministic Enforcement Substrate  
**Related Reconciliation:** TA14-VELOS-R1-PRR-001 v0.2

---

## 1. PURPOSE

This instrument closes the remaining Technical Freeze dependencies for TA-14 × Velos R1.

It does not itself issue Technical Freeze and does not authorize examination execution.

The participant must supply or confirm the remaining exact identities below. TA-14 will then seal the immutable manifest, update the readiness matrix, and issue Technical Freeze only if every mandatory gate is satisfied.

---

## 2. REMAINING IDENTITY-SEALING ITEMS

### FC-01 — `velos-l4-map-loader`
Provide or confirm:
- exact source repository;
- exact commit/revision;
- build procedure/toolchain;
- resulting executable/package identity;
- SHA-256 where technically applicable.

**Participant response:**

### FC-02 — `velos_l4_filter.bpf.o`
Provide or confirm:
- exact source commit containing `bpf/velos_l4_filter.bpf.c`;
- exact Clang/LLVM version used;
- exact build command/flags;
- resulting object SHA-256;
- program/section remains `tc_ingress / velos_wiregate_sec`.

**Participant response:**

### FC-03 — Final runtime/environment manifest
Provide or confirm:
- final Linux 6.8.0-generic host/VM identity used for R1;
- x86_64;
- BTF enabled;
- namespace names and interface names;
- relevant capabilities/privileges;
- immutable VM image/package identifier if one exists; otherwise state that the environment is a configured host/VM and identify the command-output evidence that will freeze it.

**Participant response:**

### FC-04 — Target echo-listener artifact
Provide or confirm:
- exact implementation/source file or package;
- exact version/revision;
- build/runtime command;
- SHA-256/container digest where applicable;
- target remains TCP `10.240.0.2:8443` in `ns_target`.

**Participant response:**

### FC-05 — `velos-event-collector`
Provide or confirm:
- exact source/binary identity;
- version/revision;
- invocation command;
- output format/location;
- SHA-256 where technically applicable;
- zero-drop evidence method.

**Participant response:**

### FC-06 — Ed25519 public verification identity
Provide only public material:
- public key for `urn:velos:key:node-l4-sec01`;
- stable public-key fingerprint;
- representation/encoding;
- participant-preserved publication/location for the R1 evidence package.

Do not provide private-key material.

**Participant response:**

### FC-07 — `velos-receipt-verify`
Provide or confirm:
- exact version/revision;
- source/binary identity;
- SHA-256 where applicable;
- exact offline verification command;
- expected valid/invalid result semantics.

**Participant response:**

### FC-08 — Packet-capture identity
Provide or confirm:
- selected tool for the frozen run (`dumpcap` or `tcpdump`, not an unresolved alternative);
- exact version;
- exact capture interface(s);
- exact capture filter;
- timestamp precision/source;
- start/stop procedure;
- output filename convention;
- SHA-256 procedure for completed capture files.

**Participant response:**

### FC-09 — Clock synchronization health evidence
Provide or confirm:
- selected clock-sync mechanism (`chrony`, PTP stack, or exact combination);
- exact tool/version;
- exact pre-run and post-run health/status commands;
- evidence field used to show actual skew remains within ±5.0 ms;
- fail-closed behavior if the bound is exceeded or health becomes unknown.

**Participant response:**

### FC-10 — S6 topology proof
Provide the exact command-output evidence to be preserved immediately before R1 execution, sufficient to show:
- `ns_target` contains only `lo` and `veth-target` as declared;
- relevant routes/addressing;
- no in-scope alternate network path reaches the frozen target without crossing the designated instrumented interface.

**Participant response:**

---

## 3. RECEIPT CRYPTOGRAPHY FINAL CONFIRMATION

Earlier participant-authored material referenced HMAC-SHA256 Governance Refusal Receipts.

The two latest participant factual responses specify canonical RFC 8785 JSON receipts signed via Ed25519 with offline third-party verification.

For R1 Technical Freeze, select one:

- [ ] **ED25519 GOVERNS R1.** The earlier HMAC-SHA256 statement does not govern the frozen R1 receipt mechanism.
- [ ] **HMAC-SHA256 GOVERNS R1.** Explain the conflict with the two later Ed25519 factual responses.
- [ ] **OTHER / UNFROZEN.** Explain.

**Participant clarification:**

---

## 4. FINAL PARTICIPANT FACTUAL ACCEPTANCE

By selecting A below, the participant confirms only the factual accuracy of the participant-specific frozen identities and boundaries. This is not a TA-14 finding and is not a certification of Velos.

Choose one:

- [ ] **A. ACCEPT FOR TECHNICAL FREEZE** — The populated FC-01 through FC-10 identities, the R1 proposition, non-claims, route boundary, execution-crossing point, failure matrix, evidence channels, performance exclusion, and receipt cryptography accurately describe the intended Velos v1.0.0 R1 configuration.
- [ ] **B. ACCEPT WITH CORRECTIONS** — Provide corrections below before freeze.
- [ ] **C. DO NOT ACCEPT FOR FREEZE** — Identify unresolved facts.

**Participant name:**  
**Role:**  
**Participant-local date:**  
**Acceptance state:**  

### Corrections / qualifications

---

## 5. TA-14 FREEZE ISSUANCE CONDITIONS

TA-14 may issue Technical Freeze only after:

1. FC-01 through FC-10 are resolved to exact identities or an explicitly justified not-applicable state;
2. all hashable artifacts have final immutable digests;
3. the Ed25519/HMAC-SHA256 discrepancy is explicitly resolved;
4. final topology evidence method is fixed;
5. all F0-F9 fixtures and PASS/FAIL/INCOMPLETE criteria remain unchanged from the predeclared acceptance package except for non-substantive identity population;
6. participant factual acceptance is preserved;
7. TA-14 generates the final immutable artifact manifest and Technical Freeze record.

No post-run change may alter the frozen proposition, non-claims, route, execution-crossing point, evidence requirements, or determination criteria for the same R1 run.

---

## 6. CURRENT INSTITUTIONAL STATE

**READY FOR FINAL IDENTITY SEALING + PARTICIPANT ACCEPTANCE**

**TECHNICAL FREEZE: NOT YET ISSUED**  
**R1 EXECUTION: NOT AUTHORIZED**  
**FINDING: NONE**
