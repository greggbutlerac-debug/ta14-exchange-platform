# TA-14 Environmental Evidence Gateway — HibouAir R1 Adapter Contract

**Status:** FROZEN CANDIDATE · PRIVATE · NO LIVE CREDENTIALS
**Version:** 1.0
**Date:** 2026-08-27

## Purpose
Define the least-privilege boundary by which one authorized HibouAir real-time AQM stream may enter the TA-14 Environmental Evidence Gateway for the R1 interoperability demonstration.

## Authority boundary
The adapter is an evidence-ingestion component only. It does not acquire authority to control HibouAir, ControlHub, building equipment, BAS/BMS systems, ventilation equipment, or any other execution surface. It cannot create operational authority from sensor data.

## R1 scope
One authorized stream. One declared device identity. One declared site/zone mapping. One bounded environmental proposition. One separately declared authority object. One bounded consequence: `ventilation_increase_only`.

## Permitted input
The adapter MAY read only the fields supplied by the authorized HibouAir interface that are required to construct an EnvironmentalObservation, including where available:
- source/device identity;
- provider identity;
- observation timestamp;
- site/zone identity or declared mapping;
- CO2;
- PM2.5;
- VOC;
- temperature;
- relative humidity;
- provider quality/status metadata.

No undocumented HibouAir field is treated as authoritative. Unit and semantic mappings must be declared before live ingestion.

## Required normalized observation
Every accepted observation must resolve to:
- provider;
- deviceId;
- observedAt;
- zone;
- declared measurement names and units;
- source quality state;
- adapter version.

Missing source identity, malformed required units, unparseable timestamps, undeclared zone mapping, or unsupported payload shape MUST fail closed and MUST NOT be silently repaired.

## Transport permissions
R1 adapter permissions are READ ONLY. No POST/PUT/PATCH/DELETE toward HibouAir operational surfaces. No command, actuator, configuration, calibration, alarm acknowledgement, device administration, credential administration, or ControlHub control permission is required or permitted.

Credentials, when supplied, must be server-side secrets and must never be committed to the repository, returned in receipts, exposed to the browser, or preserved in AIR records.

## Continuity
The gateway, not the adapter, determines continuity. The adapter preserves source timestamps and source identity without manufacturing continuity. Source changes, excessive gaps, stale observations, or quality failures are surfaced to the determination engine.

## R1A evidence proposition
Can the authorized HibouAir stream produce a sufficiently continuous, attributable, qualified environmental record to support the stated environmental proposition within the declared time boundary?

R1A does not grant execution authority.

## R1B execution proposition
Only after R1A is supportable and a separate authority object is valid may the gateway ask whether `ventilation_increase_only` may bind within that authority's declared scope.

Evidence admissibility is not intervention authority.

## Determinations
The gateway owns the governed determination. The adapter does not. Expected states are ALLOW, HOLD, DENY, or ESCALATE according to the frozen gateway rules.

## Preservation
Normalized evidence used for a determination must be hashable independently of credentials. The canonical receipt preserves evidence identity, governing inputs, determination, limitations, and replay identity. It does not claim to be a digital signature or HibouAir attestation.

## Non-claims
This R1 contract does not certify sensor accuracy, diagnose indoor-air conditions, certify regulatory compliance, predict future conditions, authorize equipment control, represent HibouAir endorsement, or transfer HibouAir intellectual property or operational authority to TA-14.

## Activation gates
Live activation remains prohibited until all of the following are satisfied:
1. HibouAir provides authorized API documentation and bounded credentials/access.
2. Exact endpoint, authentication method, payload schema, units, timestamps, rate/continuity behavior, and device/zone mapping are documented from HibouAir materials.
3. The adapter is verified read-only.
4. Malformed/missing/stale/source-change cases fail closed.
5. Credentials remain server-only.
6. A simulated contract test passes against the frozen mapping.
7. The first live observation is preserved as evidence before any consequential R1B claim is made.

## Freeze statement
Until authorized HibouAir documentation/access is received, this contract freezes the TA-14 side of the interface only. It intentionally does not invent HibouAir endpoints, authentication, payload fields, thresholds, device semantics, or control capabilities.
