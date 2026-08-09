-- TA-14 Canonical Patent Portfolio — 32 U.S. Application Records
-- Date: 2026-08-09
--
-- Source:
--   TA-14 Patent Position and Patent Portfolio
--   https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio
--
-- Purpose:
--   Seed the 32 currently documented U.S. patent-application records across
--   eight TA-14 patent families into public.ta14_canonical_sources.
--
-- Important boundaries:
--   1. These are recorded as patent applications, not granted patents.
--   2. Filing dates are intentionally left NULL unless separately verified.
--   3. The public portfolio identifies December 14, 2025 as the patent-family
--      priority anchor, but this migration does not assign that date as the
--      individual filing date of every application.
--   4. Patent-to-link scope is NOT asserted here. Link mappings belong in a
--      separate bounded relationship migration.

insert into public.ta14_canonical_sources (
  source_type,
  title,
  source_identifier,
  source_url,
  publication_date,
  filing_date,
  priority_date,
  jurisdiction,
  status,
  version_label,
  public_summary,
  provenance_role,
  metadata
)
values

-- ---------------------------------------------------------------------------
-- Patent Family 1 — Foundational Proof-Before-Action Diagnostic Governance
-- ---------------------------------------------------------------------------

(
  'patent_application',
  'System and Method for Standardized HVAC Diagnostic Evaluation and Electrical Integrity Assessment',
  'US 63/940,392',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Foundational proof-before-action diagnostic governance filing in the TA-14 patent portfolio.',
  'Patent Family 1 — Foundational Proof-Before-Action Diagnostic Governance.',
  jsonb_build_object(
    'patent_family', 1,
    'patent_family_name', 'Foundational Proof-Before-Action Diagnostic Governance',
    'portfolio_order', 1,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'System and Method for Standardized HVAC Diagnostic Evaluation and Electrical Integrity Assessment',
  'US 19/427,932',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Nonprovisional continuation of the foundational diagnostic proof architecture documented in the TA-14 public patent portfolio.',
  'Patent Family 1 — Foundational Proof-Before-Action Diagnostic Governance.',
  jsonb_build_object(
    'patent_family', 1,
    'patent_family_name', 'Foundational Proof-Before-Action Diagnostic Governance',
    'portfolio_order', 2,
    'public_portfolio_record', true
  )
),

-- ---------------------------------------------------------------------------
-- Patent Family 2 — Analyzer, Refrigerant Governor, and Controlled Corrective Action
-- ---------------------------------------------------------------------------

(
  'patent_application',
  'Analyzer-Driven Refrigerant Governor with Automated Charging and Evidentiary Compliance Recording',
  'US 63/957,580',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Analyzer-driven refrigerant governance with automated charging and evidentiary compliance recording.',
  'Patent Family 2 — Analyzer, Refrigerant Governor, and Controlled Corrective Action.',
  jsonb_build_object(
    'patent_family', 2,
    'patent_family_name', 'Analyzer, Refrigerant Governor, and Controlled Corrective Action',
    'portfolio_order', 3,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Evidence-Locked Verification of Declared Refrigerant State Transitions in Environmental Integrity Governance Systems',
  'US 63/965,488',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Evidence-locked verification of declared refrigerant state transitions.',
  'Patent Family 2 — Analyzer, Refrigerant Governor, and Controlled Corrective Action.',
  jsonb_build_object(
    'patent_family', 2,
    'patent_family_name', 'Analyzer, Refrigerant Governor, and Controlled Corrective Action',
    'portfolio_order', 4,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Systems and Methods for Verifying Refrigerant Charge Correctness Using Real-Time Indoor Psychrometrics, Airflow Resolution, and Time-Bounded Evidence',
  'US 63/968,807',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Refrigerant charge verification using real-time indoor psychrometrics, airflow resolution, and time-bounded evidence.',
  'Patent Family 2 — Analyzer, Refrigerant Governor, and Controlled Corrective Action.',
  jsonb_build_object(
    'patent_family', 2,
    'patent_family_name', 'Analyzer, Refrigerant Governor, and Controlled Corrective Action',
    'portfolio_order', 5,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Systems and Methods for Time-Bounded Evidence Capture and Verification During Refrigerant State Transitions',
  'US 63/968,809',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Time-bounded evidence capture and verification during active refrigerant state transitions.',
  'Patent Family 2 — Analyzer, Refrigerant Governor, and Controlled Corrective Action.',
  jsonb_build_object(
    'patent_family', 2,
    'patent_family_name', 'Analyzer, Refrigerant Governor, and Controlled Corrective Action',
    'portfolio_order', 6,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'System-Embedded Environmental Integrity Node for Admissibility-Gated Autonomous HVAC Performance Correction and Refrigerant Governance',
  'US 64/015,207',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'System-embedded environmental integrity node for admissibility-gated autonomous HVAC correction and refrigerant governance.',
  'Patent Family 2 — Analyzer, Refrigerant Governor, and Controlled Corrective Action.',
  jsonb_build_object(
    'patent_family', 2,
    'patent_family_name', 'Analyzer, Refrigerant Governor, and Controlled Corrective Action',
    'portfolio_order', 7,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Autonomous Psychrometric and System-State Driven Refrigerant Optimization System with Admissibility-Gated Execution and Closed-Loop Performance Verification',
  'US 64/015,224',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Autonomous refrigerant optimization with admissibility-gated execution and closed-loop performance verification.',
  'Patent Family 2 — Analyzer, Refrigerant Governor, and Controlled Corrective Action.',
  jsonb_build_object(
    'patent_family', 2,
    'patent_family_name', 'Analyzer, Refrigerant Governor, and Controlled Corrective Action',
    'portfolio_order', 8,
    'public_portfolio_record', true
  )
),

-- ---------------------------------------------------------------------------
-- Patent Family 3 — Environmental Integrity Governance and Continuous Environmental Truth
-- ---------------------------------------------------------------------------

(
  'patent_application',
  'System and Method for Environmental Integrity Governance Using Continuous Psychrometric State Classification',
  'US 63/963,010',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Environmental Integrity Governance using continuous psychrometric state classification.',
  'Patent Family 3 — Environmental Integrity Governance and Continuous Environmental Truth.',
  jsonb_build_object(
    'patent_family', 3,
    'patent_family_name', 'Environmental Integrity Governance and Continuous Environmental Truth',
    'portfolio_order', 9,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'System and Method for Governing Energy-to-Environmental Outcome Coupling Using Non-Invasive Electrical and Psychrometric Evidence',
  'US 63/963,035',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Governance of energy-to-environmental outcome coupling using non-invasive electrical and psychrometric evidence.',
  'Patent Family 3 — Environmental Integrity Governance and Continuous Environmental Truth.',
  jsonb_build_object(
    'patent_family', 3,
    'patent_family_name', 'Environmental Integrity Governance and Continuous Environmental Truth',
    'portfolio_order', 10,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'System and Methods for Environmental Integrity Evidence Production Using Passive Outcome Recording and Time-Bounded Risk Envelopes',
  'US 19/452,753',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Environmental integrity evidence production through passive outcome recording and time-bounded risk envelopes.',
  'Patent Family 3 — Environmental Integrity Governance and Continuous Environmental Truth.',
  jsonb_build_object(
    'patent_family', 3,
    'patent_family_name', 'Environmental Integrity Governance and Continuous Environmental Truth',
    'portfolio_order', 11,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Evidence-Locked Environmental Integrity Governance and Witness Rendering Methods',
  'US 19/452,963',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Evidence-locked Environmental Integrity Governance and witness rendering methods.',
  'Patent Family 3 — Environmental Integrity Governance and Continuous Environmental Truth.',
  jsonb_build_object(
    'patent_family', 3,
    'patent_family_name', 'Environmental Integrity Governance and Continuous Environmental Truth',
    'portfolio_order', 12,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'System and Method for Dual-Node Psychrometric Evidence Recording and Governance in Safety-Critical Environmental Integrity Determinations',
  'US 63/963,978',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Dual-node psychrometric evidence recording and governance for safety-critical environmental integrity determinations.',
  'Patent Family 3 — Environmental Integrity Governance and Continuous Environmental Truth.',
  jsonb_build_object(
    'patent_family', 3,
    'patent_family_name', 'Environmental Integrity Governance and Continuous Environmental Truth',
    'portfolio_order', 13,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Thermostat-Embedded Environmental Integrity Recording System with Longitudinal Envelope Monitoring and Change-Point Detection',
  'US 63/966,331',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Thermostat-embedded Environmental Integrity recording with longitudinal envelope monitoring and change-point detection.',
  'Patent Family 3 — Environmental Integrity Governance and Continuous Environmental Truth.',
  jsonb_build_object(
    'patent_family', 3,
    'patent_family_name', 'Environmental Integrity Governance and Continuous Environmental Truth',
    'portfolio_order', 14,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Evidence-Locked Environmental Integrity Verification for Safety-Critical Imaging Systems Using Non-Controlling Outcome Witnessing',
  'US 63/966,959',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Evidence-locked environmental integrity verification for safety-critical imaging systems using non-controlling outcome witnessing.',
  'Patent Family 3 — Environmental Integrity Governance and Continuous Environmental Truth.',
  jsonb_build_object(
    'patent_family', 3,
    'patent_family_name', 'Environmental Integrity Governance and Continuous Environmental Truth',
    'portfolio_order', 15,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Systems and Methods for Time-Bounded, Evidence-Locked Environmental Integrity Recording Using a Governed Environmental Integrity Recorder',
  'US 63/973,113',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Time-bounded, evidence-locked environmental integrity recording using a governed Environmental Integrity Recorder.',
  'Patent Family 3 — Environmental Integrity Governance and Continuous Environmental Truth.',
  jsonb_build_object(
    'patent_family', 3,
    'patent_family_name', 'Environmental Integrity Governance and Continuous Environmental Truth',
    'portfolio_order', 16,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Environmental Integrity Governance Systems, Atmospheric Integrity Records, and Federated Evidence Architectures for Non-Invasive Environmental Truth Verification',
  'US 64/011,306',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Environmental Integrity Governance systems, Atmospheric Integrity Records, and federated evidence architectures for non-invasive environmental truth verification.',
  'Patent Family 3 — Environmental Integrity Governance and Continuous Environmental Truth.',
  jsonb_build_object(
    'patent_family', 3,
    'patent_family_name', 'Environmental Integrity Governance and Continuous Environmental Truth',
    'portfolio_order', 17,
    'public_portfolio_record', true
  )
),

-- ---------------------------------------------------------------------------
-- Patent Family 4 — Admissibility, Invalidity, and Measurement Integrity
-- ---------------------------------------------------------------------------

(
  'patent_application',
  'System and Method for Evidence Admissibility, Invalidity Gating, and Measurement Integrity in Evidence-Locked Environmental Governance',
  'US 63/963,839',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Evidence admissibility, invalidity gating, and measurement integrity in evidence-locked environmental governance.',
  'Patent Family 4 — Admissibility, Invalidity, and Measurement Integrity.',
  jsonb_build_object(
    'patent_family', 4,
    'patent_family_name', 'Admissibility, Invalidity, and Measurement Integrity',
    'portfolio_order', 18,
    'public_portfolio_record', true
  )
),

-- ---------------------------------------------------------------------------
-- Patent Family 5 — Institutional Authority Separation, Firewalls, and Non-Coercive Governance
-- ---------------------------------------------------------------------------

(
  'patent_application',
  'System and Method for Institutional Boundary Governance and Non-Encroachment in Evidence-Locked Environmental Integrity Determinations',
  'US 63/963,826',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Institutional boundary governance and non-encroachment in evidence-locked environmental integrity determinations.',
  'Patent Family 5 — Institutional Authority Separation, Firewalls, and Non-Coercive Governance.',
  jsonb_build_object(
    'patent_family', 5,
    'patent_family_name', 'Institutional Authority Separation, Firewalls, and Non-Coercive Governance',
    'portfolio_order', 19,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'System and Method for Third-Party Interpretation Firewalls in Evidence-Locked Environmental Integrity Governance',
  'US 63/963,833',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Third-party interpretation firewalls in evidence-locked environmental integrity governance.',
  'Patent Family 5 — Institutional Authority Separation, Firewalls, and Non-Coercive Governance.',
  jsonb_build_object(
    'patent_family', 5,
    'patent_family_name', 'Institutional Authority Separation, Firewalls, and Non-Coercive Governance',
    'portfolio_order', 20,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Non-Coercive Evidence Escalation and Authority-Separated Environmental Integrity Architecture',
  'US 63/966,338',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Non-coercive evidence escalation and authority-separated environmental integrity architecture.',
  'Patent Family 5 — Institutional Authority Separation, Firewalls, and Non-Coercive Governance.',
  jsonb_build_object(
    'patent_family', 5,
    'patent_family_name', 'Institutional Authority Separation, Firewalls, and Non-Coercive Governance',
    'portfolio_order', 21,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Thermostat-Sourced Environmental Integrity Synchronization with Analyzer and Procedural Governor Systems',
  'US 63/966,343',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Synchronization of thermostat-sourced Environmental Integrity Records with analyzer and procedural governor systems.',
  'Patent Family 5 — Institutional Authority Separation, Firewalls, and Non-Coercive Governance.',
  jsonb_build_object(
    'patent_family', 5,
    'patent_family_name', 'Institutional Authority Separation, Firewalls, and Non-Coercive Governance',
    'portfolio_order', 22,
    'public_portfolio_record', true
  )
),

-- ---------------------------------------------------------------------------
-- Patent Family 6 — AIR, PAIR, Federated Atmospheric Continuity, and Human Environmental Chronology
-- ---------------------------------------------------------------------------

(
  'patent_application',
  'Systems and Methods for Continuous Personal Environmental Exposure Recording, Integrity-Governed Chronology, and Federated Environmental Data Integration',
  'US 64/015,062',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Continuous personal environmental exposure recording, integrity-governed chronology, and federated environmental data integration.',
  'Patent Family 6 — AIR, PAIR, Federated Atmospheric Continuity, and Human Environmental Chronology.',
  jsonb_build_object(
    'patent_family', 6,
    'patent_family_name', 'AIR, PAIR, Federated Atmospheric Continuity, and Human Environmental Chronology',
    'portfolio_order', 23,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Systems and Methods for Federated Environmental Exposure Tracking, Risk Detection, and Cross-Domain Environmental Intelligence',
  'US 64/015,073',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Federated environmental exposure tracking, risk detection, and cross-domain environmental intelligence.',
  'Patent Family 6 — AIR, PAIR, Federated Atmospheric Continuity, and Human Environmental Chronology.',
  jsonb_build_object(
    'patent_family', 6,
    'patent_family_name', 'AIR, PAIR, Federated Atmospheric Continuity, and Human Environmental Chronology',
    'portfolio_order', 24,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Systems and Methods for Federated Atmospheric Integrity Networks Utilizing Mobile and Fixed Environmental Nodes for Real-Time Environmental Mapping, Continuous Environmental Representation, and Cross-Domain Environmental Intelligence',
  'US 64/015,076',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Federated Atmospheric Integrity Networks using mobile and fixed environmental nodes for continuous cross-domain environmental representation.',
  'Patent Family 6 — AIR, PAIR, Federated Atmospheric Continuity, and Human Environmental Chronology.',
  jsonb_build_object(
    'patent_family', 6,
    'patent_family_name', 'AIR, PAIR, Federated Atmospheric Continuity, and Human Environmental Chronology',
    'portfolio_order', 25,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'System and Method for Continuity Assurance of Personal Environmental Chronological Records Using Multi-Node Redundant Recording Architecture',
  'US 64/024,196',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Continuity assurance of personal environmental chronological records using multi-node redundant recording architecture.',
  'Patent Family 6 — AIR, PAIR, Federated Atmospheric Continuity, and Human Environmental Chronology.',
  jsonb_build_object(
    'patent_family', 6,
    'patent_family_name', 'AIR, PAIR, Federated Atmospheric Continuity, and Human Environmental Chronology',
    'portfolio_order', 26,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'System and Method for Person-Associated Environmental Sensing Using Modular Body-Proximate Nodes',
  'US 64/024,209',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Person-associated environmental sensing using modular body-proximate nodes.',
  'Patent Family 6 — AIR, PAIR, Federated Atmospheric Continuity, and Human Environmental Chronology.',
  jsonb_build_object(
    'patent_family', 6,
    'patent_family_name', 'AIR, PAIR, Federated Atmospheric Continuity, and Human Environmental Chronology',
    'portfolio_order', 27,
    'public_portfolio_record', true
  )
),

-- ---------------------------------------------------------------------------
-- Patent Family 7 — Guided Human Execution and Proof-Captured Task Performance
-- ---------------------------------------------------------------------------

(
  'patent_application',
  'System and Method for Real-Time Guided Human Task Execution with Automated Verification and Evidence Capture',
  'US 64/025,521',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Real-time guided human task execution with automated verification and evidence capture.',
  'Patent Family 7 — Guided Human Execution and Proof-Captured Task Performance.',
  jsonb_build_object(
    'patent_family', 7,
    'patent_family_name', 'Guided Human Execution and Proof-Captured Task Performance',
    'portfolio_order', 28,
    'public_portfolio_record', true
  )
),

-- ---------------------------------------------------------------------------
-- Patent Family 8 — Admissible State Transitions, Continuity, and Execution Control
-- ---------------------------------------------------------------------------

(
  'patent_application',
  'Systems and Methods for Enforcing Admissible State Transitions Using a Governed, Append-Only Chronological Record',
  'US 64/021,710',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Admissible state transitions enforced through a governed, append-only chronological record.',
  'Patent Family 8 — Admissible State Transitions, Continuity, and Execution Control.',
  jsonb_build_object(
    'patent_family', 8,
    'patent_family_name', 'Admissible State Transitions, Continuity, and Execution Control',
    'portfolio_order', 29,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'System and Method for Deterministic Execution Control Based on Admissible Chronological Evidence',
  'US 64/022,608',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Deterministic execution control based on admissible chronological evidence.',
  'Patent Family 8 — Admissible State Transitions, Continuity, and Execution Control.',
  jsonb_build_object(
    'patent_family', 8,
    'patent_family_name', 'Admissible State Transitions, Continuity, and Execution Control',
    'portfolio_order', 30,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'System and Method for Maintaining Admissible State Continuity and Determining Reliance Validity Over Time',
  'US 64/030,366',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Maintenance of admissible state continuity and determination of reliance validity over time.',
  'Patent Family 8 — Admissible State Transitions, Continuity, and Execution Control.',
  jsonb_build_object(
    'patent_family', 8,
    'patent_family_name', 'Admissible State Transitions, Continuity, and Execution Control',
    'portfolio_order', 31,
    'public_portfolio_record', true
  )
),
(
  'patent_application',
  'Systems and Methods for Execution Control Based on Admissible State Validation',
  'US 64/030,461',
  'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
  null,
  null,
  null,
  'US',
  'filed application',
  null,
  'Execution control based on admissible state validation.',
  'Patent Family 8 — Admissible State Transitions, Continuity, and Execution Control.',
  jsonb_build_object(
    'patent_family', 8,
    'patent_family_name', 'Admissible State Transitions, Continuity, and Execution Control',
    'portfolio_order', 32,
    'public_portfolio_record', true
  )
)

on conflict (source_type, source_identifier)
where source_identifier is not null
do update set
  title = excluded.title,
  source_url = excluded.source_url,
  jurisdiction = excluded.jurisdiction,
  status = excluded.status,
  public_summary = excluded.public_summary,
  provenance_role = excluded.provenance_role,
  metadata = excluded.metadata,
  updated_at = timezone('utc', now());

-- Validation guard: all 32 portfolio records should now exist.
do $$
declare
  portfolio_count integer;
begin
  select count(*)
    into portfolio_count
  from public.ta14_canonical_sources
  where source_type = 'patent_application'
    and coalesce((metadata ->> 'public_portfolio_record')::boolean, false)
    and source_identifier in (
      'US 63/940,392',
      'US 19/427,932',
      'US 63/957,580',
      'US 63/965,488',
      'US 63/968,807',
      'US 63/968,809',
      'US 64/015,207',
      'US 64/015,224',
      'US 63/963,010',
      'US 63/963,035',
      'US 19/452,753',
      'US 19/452,963',
      'US 63/963,978',
      'US 63/966,331',
      'US 63/966,959',
      'US 63/973,113',
      'US 64/011,306',
      'US 63/963,839',
      'US 63/963,826',
      'US 63/963,833',
      'US 63/966,338',
      'US 63/966,343',
      'US 64/015,062',
      'US 64/015,073',
      'US 64/015,076',
      'US 64/024,196',
      'US 64/024,209',
      'US 64/025,521',
      'US 64/021,710',
      'US 64/022,608',
      'US 64/030,366',
      'US 64/030,461'
    );

  if portfolio_count <> 32 then
    raise exception
      'TA-14 patent portfolio seed expected 32 application records, found %.',
      portfolio_count;
  end if;
end;
$$;

comment on table public.ta14_canonical_sources is
  'TA-14 provenance sources including the canonical 32-application public patent portfolio. Filing dates and patent scope must remain source-grounded and separately governed.';
