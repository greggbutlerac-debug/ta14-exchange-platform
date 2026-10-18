# Governed Air — Trusted Verification Boundary v0.1 (design contract)

Status: DEVELOPMENT DESIGN ONLY. No trust service, production authorization, cryptographic signature verification, or physical execution is implemented.

## Trust separation
1. **Claim**: any submitted measurement, document, actor identity, capacity, standing basis, or policy citation. User-entered text is always untrusted, including words such as "verified", "approved", or "signed".
2. **Evidence verification**: a verifier external to the claimant checks source identity, authenticity, timestamp, calibration basis, chain of custody, scope, and revocation status. Preserve original bytes and the verification method, timestamp, and result.
3. **Authority verification**: independently establish applicable policy, delegation, jurisdiction, actor capacity, established standing, scope, effective time, and revocation. Evidence verification never implies execution authority.
4. **Binding**: bind verified evidence, verified actor, authority relationship, proposed consequence, constraints, case version, tenant, and evaluation time into one immutable decision input. Reject stale or cross-tenant references.
5. **Decision**: default HOLD on unknown or unavailable checks; DENY invalid/forbidden actions; ESCALATE when an independently applicable safety rule requires it. ALLOW requires all trusted checks and an independently approved execution policy.
6. **Commit and execution**: require an authenticated, one-time, scope-limited receipt bound to the precise action and site. An execution service must independently verify the receipt before acting. No receipt or execution service exists yet.
7. **Outcome**: append observation of the actual outcome without rewriting the original decision or claiming an outcome that was not observed.

## Minimum verifier result (future interface)
- verifier_id, verifier_version, tenant_id, case_id
- subject_id, evidence_digest, provenance_chain, verification_method
- verified_at, expires_at, revoked_at (nullable)
- authority_scope, actor_capacity, standing_basis, policy_version
- verification_status: VERIFIED | REJECTED | INDETERMINATE
- verifier_signature and independently trusted public-key identity
- raw_claim_reference and immutable verification_receipt_reference

All fields are requirements, not presently trusted inputs. Never accept a caller-supplied verification_status or verifier_signature as proof without cryptographic and trust-anchor checks.

## Negative test requirements
- Forged verifier or self-asserted VERIFIED -> HOLD
- Expired, revoked, or unavailable trust anchor -> HOLD/DENY according to policy
- Cross-tenant evidence, standing, or receipt -> DENY
- Replay of action receipt -> DENY
- Mutation of action, site, actor, or policy after binding -> DENY
- Missing evidence or standing -> HOLD
- Evidence verified but actor lacks standing -> HOLD
- Trusted receipt valid for investigation but used for equipment control -> DENY
- Verification service unavailable -> HOLD; never silently fail open

## Present implementation
The classroom evaluator may return simulated ALLOW for bounded investigation. The structured workspace uses workspace-boundary.mjs and downgrades that simulated ALLOW to HOLD for unverified caller claims. This design does not change the classroom fixture or enable any execution.
