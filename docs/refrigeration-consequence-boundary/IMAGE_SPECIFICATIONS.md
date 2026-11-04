# Refrigeration Consequence Boundary: teaching image specifications

Eight images are required. None has been produced; the showroom shows a labelled slot for each. Values quoted must come from the evidence exports (SIMULATION).

## 01 · THE ICE CREAM IS MELTING

- **Filename:** `rcb-01-the-ice-cream-is-melting.png` (1920×1080)
- **Purpose:** Introduce the incident and its physical consequence.
- **Layout:**
  - Left: a simplified display-freezer cutaway with product cartons and two product-simulant probes.
  - Centre: a 24-hour timeline marked "03:00 unauthorized 6-hour defrost" and the product temperature curve crossing −18 °C.
  - Right: the question "WHO AUTHORIZED THE CONSEQUENCE?" above an empty authorization-receipt card stamped "NO RECORD".
- **Labels:** Product peak -13.62 °C (simulation) · 352 min above −18 °C (simulation) · No authorization record
- **Constraints:**
  - Wide 16:9 educational infographic, 1920 × 1080 px, PNG.
  - TA-14 palette: navy #001426 / #062945 background, ice-blue #7BAFD4 and #B9D9EB accents, white text; amber #E8B04B for WATCH, coral #E86A5B for EXCEPTION/FAULT, grey #8A9BA8 for missing evidence.
  - Read left to right, top to bottom, with large numbered callouts.
  - No photographs or likenesses of real people; no portraits. No real brand, product or equipment logos.
  - Label all data "SIMULATION" in the lower-left corner; use only values from the evidence exports.

## 02 · THE LAST AUTHORIZED STATE

- **Filename:** `rcb-02-the-last-authorized-state.png` (1920×1080)
- **Purpose:** Show the authorized baseline as a sealed reference.
- **Layout:**
  - Left: equipment identity card (simulated freezer RCB-FREEZER-01, controller CTRL-SIM-01).
  - Centre: approved operating envelope: air band −25 to −19 °C, setpoint −22 °C, product limit −18 °C, and a 24-hour clock face with four 20-minute defrost windows.
  - Right: authorized actors (roles only, no faces), five independent evidence sources, and a seal block showing the baseline hash.
- **Labels:** AUTHORIZED BASELINE RCB-BL-1.0 · SEALED · STORED SEPARATELY · Roles: Facility Manager · Refrigeration Technician
- **Constraints:**
  - Wide 16:9 educational infographic, 1920 × 1080 px, PNG.
  - TA-14 palette: navy #001426 / #062945 background, ice-blue #7BAFD4 and #B9D9EB accents, white text; amber #E8B04B for WATCH, coral #E86A5B for EXCEPTION/FAULT, grey #8A9BA8 for missing evidence.
  - Read left to right, top to bottom, with large numbered callouts.
  - No photographs or likenesses of real people; no portraits. No real brand, product or equipment logos.
  - Label all data "SIMULATION" in the lower-left corner; use only values from the evidence exports.

## 03 · THE ATTACKER BYPASSES AEA

- **Filename:** `rcb-03-the-attacker-bypasses-aea.png` (1920×1080)
- **Purpose:** Contrast the governed route with the bypass route.
- **Layout:**
  - Top lane, "GOVERNED ROUTE": attacker → AEA gate (four checks: Evidence · Authority · Standing · Revalidation NOW) → DENY stamp → controller unchanged.
  - Bottom lane, "BYPASS ROUTE": attacker → direct write → controller changes → defrost heater ON; the AEA gate drawn beside the lane, greyed out, labelled "never consulted".
  - Right: results panel showing "S1 PREVENTION: PASS" and "S2 PREVENTION: FAIL".
- **Labels:** A bypassed gate is not an authorized execution · No authorization record is fabricated
- **Constraints:**
  - Wide 16:9 educational infographic, 1920 × 1080 px, PNG.
  - TA-14 palette: navy #001426 / #062945 background, ice-blue #7BAFD4 and #B9D9EB accents, white text; amber #E8B04B for WATCH, coral #E86A5B for EXCEPTION/FAULT, grey #8A9BA8 for missing evidence.
  - Read left to right, top to bottom, with large numbered callouts.
  - No photographs or likenesses of real people; no portraits. No real brand, product or equipment logos.
  - Label all data "SIMULATION" in the lower-left corner; use only values from the evidence exports.

## 04 · PHYSICAL REALITY BEGINS TO DRIFT

- **Filename:** `rcb-04-physical-reality-begins-to-drift.png` (1920×1080)
- **Purpose:** Show the gap between reported and observed reality.
- **Layout:**
  - Left: the controller display reading "−21.8 °C · OK", stamped "SELF-REPORT · UNTRUSTED".
  - Centre: a time-series chart from scenario S4: controller-reported air (flat dashed), independent probe air (rising dots), the approved band shaded.
  - Right: a divergence callout "Reported vs independent: > 3 K for 3 samples → FAULT".
- **Labels:** What the controller claims · What independent probes observe · Simulation ground truth (not available in real deployments)
- **Constraints:**
  - Wide 16:9 educational infographic, 1920 × 1080 px, PNG.
  - TA-14 palette: navy #001426 / #062945 background, ice-blue #7BAFD4 and #B9D9EB accents, white text; amber #E8B04B for WATCH, coral #E86A5B for EXCEPTION/FAULT, grey #8A9BA8 for missing evidence.
  - Read left to right, top to bottom, with large numbered callouts.
  - No photographs or likenesses of real people; no portraits. No real brand, product or equipment logos.
  - Label all data "SIMULATION" in the lower-left corner; use only values from the evidence exports.

## 05 · EIN DETECTS THE DEVIATION

- **Filename:** `rcb-05-ein-detects-the-deviation.png` (1920×1080)
- **Purpose:** Explain independent observation, thresholds, evidence quality and alerts.
- **Layout:**
  - Left: the five independent sources (P1, P2, AIR, HEATER_CT, COMPRESSOR_CT) on a separate logger, with the controller drawn apart and labelled "not trusted".
  - Centre: a status ladder NORMAL → WATCH → EXCEPTION → FAULT, with EVIDENCE_INSUFFICIENT on a separate grey rail, each with its trigger rule.
  - Right: a detection-latency bar chart for S2–S5 and an "S6: NOT DETECTED — evidence missing" bar in grey.
- **Labels:** Configured thresholds (simulation) · Detection is conditional, not guaranteed
- **Constraints:**
  - Wide 16:9 educational infographic, 1920 × 1080 px, PNG.
  - TA-14 palette: navy #001426 / #062945 background, ice-blue #7BAFD4 and #B9D9EB accents, white text; amber #E8B04B for WATCH, coral #E86A5B for EXCEPTION/FAULT, grey #8A9BA8 for missing evidence.
  - Read left to right, top to bottom, with large numbered callouts.
  - No photographs or likenesses of real people; no portraits. No real brand, product or equipment logos.
  - Label all data "SIMULATION" in the lower-left corner; use only values from the evidence exports.

## 06 · EIR PRESERVES THE INCIDENT

- **Filename:** `rcb-06-eir-preserves-the-incident.png` (1920×1080)
- **Purpose:** Show provenance, continuity, timestamps, integrity and the incident record.
- **Layout:**
  - Left: a sealed baseline block feeding a vertical hash chain of entries (BASELINE_REFERENCE → EIN_OBSERVATION → EIN_STATUS_CHANGED → EIN_ALERT → NOTIFICATION_SENT → … → OUTCOME_RECORDED).
  - Centre: an exploded view of one entry: seq, recordedAt, observedAt, source, independentOfController, payload, prevHash, entryHash.
  - Right: a tamper panel. One altered entry turns red and every later link breaks. A separate "EVIDENCE GAP" entry is drawn in grey.
- **Labels:** Hash-chained · append-only · Not signed · no trusted time-stamp (limitation) · Existence ≠ admissibility
- **Constraints:**
  - Wide 16:9 educational infographic, 1920 × 1080 px, PNG.
  - TA-14 palette: navy #001426 / #062945 background, ice-blue #7BAFD4 and #B9D9EB accents, white text; amber #E8B04B for WATCH, coral #E86A5B for EXCEPTION/FAULT, grey #8A9BA8 for missing evidence.
  - Read left to right, top to bottom, with large numbered callouts.
  - No photographs or likenesses of real people; no portraits. No real brand, product or equipment logos.
  - Label all data "SIMULATION" in the lower-left corner; use only values from the evidence exports.

## 07 · AUTHORIZED HUMAN INTERVENTION

- **Filename:** `rcb-07-authorized-human-intervention.png` (1920×1080)
- **Purpose:** Demonstrate investigation, authority revalidation, corrective action and accountability.
- **Layout:**
  - Left to right: ALERT → ACKNOWLEDGE (technician role icon, no face) → INVESTIGATE ("no authorization record for observed actuation") → AUTHORITY ISSUED (facility manager role) → COMMIT.
  - Below the commit step: a branch "authority revoked" → EXECUTION: DENY (revalidated NOW).
  - Then: NEW AUTHORITY → COMMIT → EXECUTION: ALLOW → controller restored to the sealed baseline.
- **Labels:** Commissioned once ≠ authorized forever · Revalidation NOW at the execution boundary · Every human action recorded
- **Constraints:**
  - Wide 16:9 educational infographic, 1920 × 1080 px, PNG.
  - TA-14 palette: navy #001426 / #062945 background, ice-blue #7BAFD4 and #B9D9EB accents, white text; amber #E8B04B for WATCH, coral #E86A5B for EXCEPTION/FAULT, grey #8A9BA8 for missing evidence.
  - Read left to right, top to bottom, with large numbered callouts.
  - No photographs or likenesses of real people; no portraits. No real brand, product or equipment logos.
  - Label all data "SIMULATION" in the lower-left corner; use only values from the evidence exports.

## 08 · THE OUTCOME BECOMES EVIDENCE

- **Filename:** `rcb-08-the-outcome-becomes-evidence.png` (1920×1080)
- **Purpose:** Compare the final outcome with the original baseline and show what was proven.
- **Layout:**
  - Left: the sealed baseline envelope overlaid with the post-intervention independent temperatures returning inside it.
  - Centre: the outcome record (restored time, warmest independent product reading, minutes above limit, "product disposition: not decided by TA-14").
  - Right: a claims matrix (eight scenarios × capabilities) with PASS, FAIL and NOT DEMONSTRATED cells, and a footer "Simulation — not physical-system validation".
- **Labels:** Outcome becomes the next evidence · What was proven · what was not
- **Constraints:**
  - Wide 16:9 educational infographic, 1920 × 1080 px, PNG.
  - TA-14 palette: navy #001426 / #062945 background, ice-blue #7BAFD4 and #B9D9EB accents, white text; amber #E8B04B for WATCH, coral #E86A5B for EXCEPTION/FAULT, grey #8A9BA8 for missing evidence.
  - Read left to right, top to bottom, with large numbered callouts.
  - No photographs or likenesses of real people; no portraits. No real brand, product or equipment logos.
  - Label all data "SIMULATION" in the lower-left corner; use only values from the evidence exports.
