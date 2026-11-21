# Module 03 — Instructional visual review register

Status: **review required**. This register documents current source-code associations, not an approval of the visual content. It does not imply the images were inspected visually or tested on a device.

## Lesson-by-lesson register

| Lesson | Current visual | Status / action |
|---|---|---|
| 3.01 Air Is Part of the System | `Air Is Part of the System Infographic.png` | Existing asset; review correctness and legibility |
| 3.02 Airflow Path & System Boundaries | `Airflow Path and System Boundaries.png` | Existing asset; review actual equipment-order caveat |
| 3.03 Static Pressure Fundamentals | `HVAC Airflow and Static Pressure Investigation.png` | Existing asset; verify signed pressure and reference conventions |
| 3.04 External Static Pressure Measurement | `AirEvidenceDiagrams.tsx` (tesp) | New conceptual SVG; verify manufacturer-specific boundary disclaimer |
| 3.05 Pressure Drop Across Components | `AirEvidenceDiagrams.tsx` (component-drop) | New conceptual SVG; verify upstream/downstream tap logic |
| 3.06 Airflow Estimation & Measurement | `AirEvidenceDiagrams.tsx` (airflow) | New conceptual SVG; verify area/velocity and representative traverse limitations |
| 3.07 Temperature as Evidence | `HVAC Temperature & Humidity Training Infographic.png` | Existing asset; review temperature-only claims |
| 3.08 Heat Transfer & Sensible Performance | `TA-14 Academy_ Heat Transfer & Moisture Control.png` | Existing asset; review sensible vs total capacity |
| 3.09 Moisture Fundamentals | `HVAC Temperature & Humidity Training Infographic.png` | Shared asset; confirm lesson-specific relevance |
| 3.10 Relative Humidity, Dew Point & Context | `HVAC Temperature & Humidity Training Infographic.png` | Shared asset; confirm RH/dew-point treatment |
| 3.11 Sensible vs Latent Performance | `TA-14 Academy_ Heat Transfer & Moisture Control.png` | Shared asset; verify sensible/latent separation |
| 3.12 Dehumidification as System Performance | `TA-14 Academy_ Heat Transfer & Moisture Control.png` | Shared asset; verify moisture-removal claims |
| 3.13 Airflow × Coil × Moisture Interaction | `TA-14 Academy_ Heat Transfer & Moisture Control.png` | Shared asset; verify causal relationships |
| 3.14 Airflow & Moisture Guided Practice | No standalone visual; interactive browser exercise | Inspect step UI, measurement choices, and mobile controls |
| 3.15 Airflow, Heat & Moisture Perform | No standalone visual; interactive browser exercise | Inspect independent decision UI and submission feedback |
| 3.16 Evidence Integration Check | `Independent Review Challenge Infographic.png` | Existing asset; verify relevance to integration assessment |

## Review gates

1. **Technical accuracy:** No diagram may imply that temperature split, component pressure drop, condensate, or a single airflow estimate alone establishes capacity, charge, or a formal diagnosis. Confirm reference points, operating state, uncertainty, and applicable manufacturer requirements.
2. **Authority boundary:** A training visual must not depict the technician issuing or editing a DDD, or refrigerant-system entry without the required evidence and authorization gates.
3. **Visual inspection:** Inspect each actual raster asset, not merely its filename. Confirm legibility, correct spelling, labels, crop, contrast, and no unsupported or misleading arrows.
4. **Responsive QA:** Review at narrow phone, tablet and desktop widths. Confirm SVG text remains legible, radio controls are reachable, and no horizontal overflow.
5. **Accessibility:** Verify meaningful alt text/captions, keyboard navigation, focus visibility and reading order. Current generic raster alt text is provisional.
6. **Narration alignment:** Verify Samantha's corresponding script appears beneath the visual and accurately explains it; recorded synchronized audio is not yet integrated.
7. **Assessment integrity:** Browser practice results are local and ephemeral. Do not present them as saved grades, verified performance records, or credentials.

## Release gate

Keep PR #691 in draft until actual visual inspection, mobile QA, narration and learner-state requirements are decided and verified. GitHub typecheck/tests/build do **not** establish instructional approval.
