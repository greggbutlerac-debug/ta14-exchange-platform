# TA14-AFA-EABA-SX-002 — Candidate Hardened Boundary

Status: CANDIDATE / HOLD. Design-only; not deployed, frozen, certified, or independently verified.

## Historical continuity
Preserve TA14-AFA-EABA-SX-001 v1.2.0 and its original receipts, reports, migrations, and declared bounded acceptance criteria unchanged. SX-002 is a separate candidate, not a retroactive correction.

## Protected consequence
A durable effect insertion is the bounded protected consequence. No claim about real HVAC actuators, universal substrate, or other execution paths follows from this demonstration.

## Trust model
Untrusted: HTTP clients, submitted authorization booleans, replayed receipts, stale or substituted targets, and general-purpose service-role application clients.
Trusted only after independent validation: signed or authoritative passport records, revocation and expiry state, locally established standing, target/action/scope, and unique commit identity.

## Required enforcement
1. No client-supplied boolean may itself establish admissibility, authority, scope, standing, freshness, or binding.
2. The commit function must resolve and validate authoritative records inside its transaction, including actor, exact target, action, version, scope, expiration/revocation, evidence continuity, and local standing.
3. Commit identity must be single-use with uniqueness enforced at the database boundary; concurrent replay must fail closed.
4. Recheck material conditions immediately before effect insertion; bind the exact evidence and target to the effect receipt.
5. Revoke INSERT/UPDATE/DELETE/TRUNCATE on protected effect tables from ordinary and general-purpose service credentials. Grant insertion only through a narrowly scoped, audited function identity; review owner, SECURITY DEFINER, RLS, grants, and other privileged routes.
6. Keep refused attempts and effect observations in separate append-only records; a decision receipt is not proof of physical effect or restraint.
7. Inventory all possible write paths, including admin, migration, background jobs, direct SQL, RPC, and integrations. Explicitly bound the threat model for database owner/superuser powers.

## Reproducible acceptance tests (isolated staging only)
A. Valid, current, locally established authorization yields exactly one effect and a corresponding receipt.
B. Forged all-true booleans without authoritative records yield zero effects.
C. Expired/revoked passport or changed target/scope yields zero effects.
D. Direct table insert using every application credential yields permission denied.
E. Replay and concurrent duplicate commit yield at most one effect.
F. Missing governance dependency, stale evidence, or unverifiable identity fails closed.
G. An alternate endpoint/job cannot create the same protected effect without the gate.
H. Independently query durable effects and preserve test input, version, actor, timestamp, and evidence hash.

## Disposition rules
ALLOW only within the frozen bounded mechanism after evidence-backed tests A-H and independent review. HOLD for missing proof, incomplete access-path inventory, or unverified deployment. DENY for demonstrated unauthorized effect. ESCALATE for unresolved privileged trust boundaries.

No production schema, permissions, endpoint, or physical equipment may be changed as part of this design record.
