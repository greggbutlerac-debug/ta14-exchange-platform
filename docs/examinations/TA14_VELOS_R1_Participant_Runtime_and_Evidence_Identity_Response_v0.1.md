# TA-14 × VELOS R1 — PARTICIPANT RUNTIME + EVIDENCE IDENTITY RESPONSE

**Document:** TA14-VELOS-R1-PREI-001-RESP-v0.1  
**Registry:** TA-14-AIGR-000029  
**Participant:** Velos Systems  
**Participant Version:** v1.0.0  
**Preservation State:** PRESERVED AS RECEIVED — PARTICIPANT-AUTHORED — NO TA-14 VALIDATION

---

Greggory — Below is the completed reconciliation for TA14-VELOS-R1-PREI-001 v0.1 against Velos Systems v1.0.0.

## A-09: VELOS CONTROL-PLANE / MAP-LOADER
- Status: FIXED (Commit/Digest: UNFROZEN)
- Artifact: velos-l4-map-loader (v1.0.0-rc1, Go 1.22+ / Cilium eBPF).
- Entrypoint: Local IPC -> Pins SHA-256 capability hash into BPF map.

## A-10: eBPF ENFORCEMENT ARTIFACT
- Status: FIXED (Deployable Object SHA-256: UNFROZEN)
- Program/Section: tc_ingress / velos_wiregate_sec (Source: bpf/velos_l4_filter.bpf.c).
- Compiler: Clang/LLVM 17+ (-O2 -target bpf). CO-RE/BTF enabled via vmlinux.h.
- Attach Command: tc filter add dev <veth-target> ingress bpf da obj velos_l4_filter.bpf.o sec tc_ingress

## A-11: canonical_state_map DEFINITION
- Status: FIXED
- Map: velos_state_map (BPF_MAP_TYPE_HASH, Max: 65,536, Pinned: /sys/fs/bpf/velos_l4_state_map).
- Key (40B): { dst_ip (u32), dst_port (u16), proto (u8), pad (u8), payload_hash (32B) }.
- Value (24B): { valid_until_ts (u64), nonce (u64), max_retransmits (u32), current_retransmits (u32) }.

## A-12: REVOCATION / MUTATION MECHANISM
- Status: FIXED
- Operation: velos_ctl evict / bpf_map_delete_elem() — Synchronous atomic O(1) invalidation.
- Active Flows: Synchronous bilateral TCP_RST injection + conntrack purge. Ring buffer event emitted.

## A-13 & A-14: KERNEL & RUNTIME IDENTITY
- Status: FIXED
- Kernel: Linux 6.8.0-generic (x86_64), clsact qdisc, BTF enabled. Dedicated bare-metal/VM testbed.
- Isolation: Linux Network Namespaces (ip netns); loaded via root context (CAP_BPF, CAP_NET_ADMIN).

## A-15 & A-16: TOPOLOGY & ATTACHMENT EVIDENCE
- Status: FIXED
- Topology: Root Namespace (veth-host) <-> ns_target (veth-target: 10.240.0.2/24)
- Direct /30 routing, no NAT/proxy.
- Attachment: tc qdisc add dev veth-target clsact; proved via bpftool prog show & tc filter show.

## A-17 & A-18: TARGET SERVICE & SOCKET FIXTURE
- Status: FIXED
- Target: Minimal deterministic TCP echo listener on ns_target (10.240.0.2:8443).
- Crossing Cut: Traversal past tc_ingress into socket rcv buffer. TC_ACT_SHOT drops skb before sock_queue_rcv_skb.

## A-19: CHALLENGE PAYLOAD BINDING
- Status: FIXED
- Payload: Bound to VECT payload_binding_hash (SHA-256). Single TCP segment (<1460B MTU, no IP frag).

## A-20 & A-21: KERNEL EVENT SCHEMA + COLLECTOR
- Status: FIXED
- Channel: BPF Ring Buffer (velos-event-collector). Schema: { monotonic_ts, assertion_id, action_code, reason, payload_hash }. Zero drop tolerance.

## A-22, A-23, A-24: REFUSAL RECEIPT, SIGNER & VERIFIER
- Status: FIXED
- Schema: Canonical RFC 8785 JSON signed via Ed25519 (URN: urn:velos:key:node-l4-sec01).
- Verifier: velos-receipt-verify (Standalone CLI, 100% offline third-party verifiable).

## A-25 & A-26: PACKET CAPTURE
- Status: FIXED
- Tool: dumpcap / tcpdump (libpcap). Dual-capture: ingress veth vs target socket rcv queue.

## A-27 & A-28: CLOCKS & CHRONOLOGY
- Status: FIXED
- Wall-Clock: chrony / PTP synced to UTC (Max skew: ±5.0ms; fail-closed on breach).
- Monotonic: CLOCK_MONOTONIC_RAW for internal microsecond delta measurement.

## S6: IN-SCOPE ALTERNATE ROUTE
- Status: NO IN-SCOPE ALTERNATE ROUTE IDENTIFIED
- Boundary: Namespace contains exclusively lo and veth-target. Alternate host/IPC paths are explicitly OUT OF SCOPE.

## PARTICIPANT ATTESTATION
- State: [X] A. FACTUALLY COMPLETE FOR FREEZE PREPARATION
- Attested by: Naimatullah, Founder & Principal Architect, Velos Systems (August 28, 2026).
- Note: Fixed values accurately describe Velos v1.0.0. Deployable object digests (UNFROZEN) will seal upon harness run.

Standing by for AIAC-001 v0.2 and Technical Freeze.
