-- TA-14 Patent Portfolio -> 24-Link Architecture
-- Bounded patent-position relationship mappings
-- Date: 2026-08-09
--
-- IMPORTANT:
-- These mappings are architectural provenance / patent-position mappings.
-- They are NOT legal conclusions about claim construction, patent scope,
-- validity, infringement, ownership, or grant status.
--
-- A relationship means only that the documented application title and
-- public TA-14 portfolio positioning materially relate the filing to the
-- identified architectural link. Exact claim coverage remains a separate
-- patent-law question.
--
-- Canonical link IDs:
-- 01 Admissible Reality
-- 02 Record
-- 03 Continuity
-- 04 Evidence Governance
-- 05 Admissible Evidence
-- 06 Admissible Truth
-- 07 Reliance
-- 08 Authority
-- 09 Legitimacy
-- 10 Consequence Formation
-- 11 Attachment / Assent
-- 12 Binding Reality
-- 13 Binding
-- 14 Commit Reality
-- 15 Commit
-- 16 Execution Reality
-- 17 Admissible Non-Occurrence
-- 18 Prevented Consequence
-- 19 Execution
-- 20 Outcome Reality
-- 21 Outcome
-- 22 New Reality
-- 23 Memory
-- 24 Future Chain

create temporary table ta14_patent_link_map (
  source_identifier text not null,
  link_order integer not null,
  relation_summary text not null,
  primary key (source_identifier, link_order)
) on commit drop;

insert into ta14_patent_link_map
  (source_identifier, link_order, relation_summary)
values

-- Family 1: foundational diagnostic proof-before-action
('US 63/940,392', 2, 'The documented diagnostic-evaluation filing materially relates to creation of a governed diagnostic record before corrective action.'),
('US 63/940,392', 4, 'The filing is positioned within TA-14 as proof-before-action diagnostic governance and therefore relates to governance of evidence used for diagnostic determination.'),
('US 63/940,392', 5, 'The filing materially relates to evidence sufficient to support a diagnostic determination before intervention.'),
('US 63/940,392', 19, 'The filing materially relates to the boundary between diagnostic proof and subsequent corrective execution.'),

('US 19/427,932', 2, 'The documented nonprovisional diagnostic-evaluation filing materially relates to preservation of a diagnostic record before corrective action.'),
('US 19/427,932', 4, 'The filing is positioned within the foundational proof-before-action family and materially relates to governed diagnostic evidence.'),
('US 19/427,932', 5, 'The filing materially relates to evidence supporting a diagnostic determination before intervention.'),
('US 19/427,932', 19, 'The filing materially relates to the transition from diagnostic proof to corrective execution.'),

-- Family 2: analyzer / refrigerant governor / corrective action
('US 63/957,580', 4, 'The filing expressly combines analyzer-driven refrigerant governance with evidentiary compliance recording.'),
('US 63/957,580', 15, 'Automated charging described by the filing materially relates to the governed commit boundary preceding consequence-bearing execution.'),
('US 63/957,580', 19, 'Automated refrigerant charging is a consequence-bearing execution pathway addressed by the filing.'),
('US 63/957,580', 21, 'Evidentiary compliance recording materially relates to verification of the resulting corrective-action outcome.'),

('US 63/965,488', 2, 'Evidence-locked verification of declared refrigerant state transitions materially depends on a preserved state-transition record.'),
('US 63/965,488', 3, 'Verification of a declared state transition materially relates to continuity across pre-transition and post-transition state.'),
('US 63/965,488', 5, 'The filing expressly concerns evidence-locked verification and therefore materially relates to admissible evidence.'),
('US 63/965,488', 19, 'The declared refrigerant state transition is the execution event whose verification is governed by the filing.'),

('US 63/968,807', 1, 'Real-time psychrometric and airflow observations materially relate to the state of reality used to evaluate refrigerant charge correctness.'),
('US 63/968,807', 5, 'The filing expressly concerns time-bounded evidence used to verify refrigerant charge correctness.'),
('US 63/968,807', 6, 'Verification of charge correctness materially relates to the architecture''s determination of admissible truth from governed evidence.'),
('US 63/968,807', 21, 'Charge-correctness verification materially relates to the verified outcome of the diagnostic or corrective pathway.'),

('US 63/968,809', 2, 'The filing expressly concerns evidence capture during refrigerant state transitions and therefore materially relates to the transition record.'),
('US 63/968,809', 3, 'Time-bounded evidence capture materially relates to continuity during a changing refrigerant state.'),
('US 63/968,809', 4, 'The filing materially relates to governance of evidence generated during an active state transition.'),
('US 63/968,809', 5, 'Verification of time-bounded transition evidence materially relates to admissible evidence.'),

('US 64/015,207', 5, 'The filing expressly describes admissibility-gated autonomous HVAC performance correction.'),
('US 64/015,207', 15, 'An admissibility-gated autonomous correction materially relates to the commit boundary before corrective action is allowed.'),
('US 64/015,207', 17, 'A gate capable of withholding autonomous correction materially relates to admissible non-occurrence when execution is not permitted.'),
('US 64/015,207', 19, 'Autonomous HVAC performance correction and refrigerant governance are consequence-bearing execution pathways addressed by the filing.'),
('US 64/015,207', 21, 'Performance correction materially relates to verification of the resulting system outcome.'),

('US 64/015,224', 5, 'The filing expressly describes admissibility-gated execution for autonomous refrigerant optimization.'),
('US 64/015,224', 15, 'The admissibility gate materially relates to the commit boundary before autonomous optimization executes.'),
('US 64/015,224', 17, 'Withholding execution when admissibility is not established materially relates to admissible non-occurrence.'),
('US 64/015,224', 19, 'Autonomous refrigerant optimization is the consequence-bearing execution pathway addressed by the filing.'),
('US 64/015,224', 21, 'Closed-loop performance verification expressly relates the filing to governed outcome verification.'),

-- Family 3: EIG / environmental truth
('US 63/963,010', 1, 'Continuous psychrometric state classification materially relates to the environmental state treated as observable reality.'),
('US 63/963,010', 2, 'Continuous state classification materially relates to creation of a persistent environmental record.'),
('US 63/963,010', 3, 'Continuous psychrometric classification materially relates to preservation of environmental continuity over time.'),
('US 63/963,010', 4, 'The filing expressly concerns Environmental Integrity Governance and therefore materially relates to evidence governance.'),
('US 63/963,010', 6, 'Governed continuous environmental state classification materially relates to determination of environmental truth.'),

('US 63/963,035', 1, 'Non-invasive electrical and psychrometric observations materially relate to the measured environmental and system reality.'),
('US 63/963,035', 4, 'The filing expressly governs evidence coupling energy input to environmental outcome.'),
('US 63/963,035', 5, 'Non-invasive electrical and psychrometric evidence materially relates to admissible evidence.'),
('US 63/963,035', 20, 'The filing materially relates energy use to the resulting environmental outcome reality.'),
('US 63/963,035', 21, 'The governed energy-to-environmental coupling materially relates to outcome determination.'),

('US 19/452,753', 2, 'Passive outcome recording expressly relates the filing to creation of environmental evidence records.'),
('US 19/452,753', 4, 'Environmental integrity evidence production materially relates to evidence governance.'),
('US 19/452,753', 5, 'Time-bounded risk envelopes materially relate to whether environmental evidence remains admissible for reliance.'),
('US 19/452,753', 20, 'Passive outcome recording materially relates to observed outcome reality.'),

('US 19/452,963', 4, 'Evidence-locked Environmental Integrity Governance directly relates the filing to governed environmental evidence.'),
('US 19/452,963', 5, 'Evidence locking materially relates to preservation of evidence admissibility.'),
('US 19/452,963', 6, 'Witness rendering materially relates governed evidence to an environmental truth representation.'),
('US 19/452,963', 23, 'Evidence-locked witness records materially relate to durable architectural memory.'),

('US 63/963,978', 2, 'Dual-node psychrometric evidence recording directly relates the filing to environmental records.'),
('US 63/963,978', 3, 'Dual-node recording materially relates to continuity and corroboration across environmental observations.'),
('US 63/963,978', 4, 'The filing expressly concerns governance of psychrometric evidence used for safety-critical determinations.'),
('US 63/963,978', 5, 'Governed dual-node evidence materially relates to admissible evidence for environmental integrity determinations.'),

('US 63/966,331', 2, 'Thermostat-embedded environmental integrity recording directly relates the filing to environmental records.'),
('US 63/966,331', 3, 'Longitudinal envelope monitoring materially relates to continuity of environmental state over time.'),
('US 63/966,331', 22, 'Change-point detection materially relates to recognition of a new environmental reality.'),
('US 63/966,331', 23, 'Longitudinal environmental recording materially relates to durable memory of prior environmental states.'),

('US 63/966,959', 4, 'Evidence-locked environmental integrity verification materially relates to evidence governance.'),
('US 63/966,959', 5, 'Evidence locking and verification materially relate to admissible environmental evidence.'),
('US 63/966,959', 6, 'Non-controlling outcome witnessing materially relates to verification of environmental truth without collapsing observer and controller roles.'),
('US 63/966,959', 20, 'Outcome witnessing materially relates to the observed outcome reality of the safety-critical imaging environment.'),

('US 63/973,113', 2, 'The filing expressly concerns environmental integrity recording using a governed recorder.'),
('US 63/973,113', 3, 'Time-bounded recording materially relates to continuity and freshness of environmental evidence.'),
('US 63/973,113', 4, 'Use of a governed Environmental Integrity Recorder directly relates the filing to evidence governance.'),
('US 63/973,113', 5, 'Evidence-locked recording materially relates to admissible evidence.'),

('US 64/011,306', 2, 'Atmospheric Integrity Records directly relate the filing to governed environmental records.'),
('US 64/011,306', 3, 'Federated evidence architectures materially relate to preservation of environmental continuity across nodes and domains.'),
('US 64/011,306', 4, 'Environmental Integrity Governance and federated evidence architectures directly relate the filing to evidence governance.'),
('US 64/011,306', 6, 'Non-invasive environmental truth verification materially relates to admissible truth.'),

-- Family 4: admissibility / invalidity / measurement integrity
('US 63/963,839', 3, 'Measurement integrity materially relates to continuity and reliability of the evidence state over time.'),
('US 63/963,839', 4, 'The filing expressly concerns evidence governance in an evidence-locked environmental system.'),
('US 63/963,839', 5, 'Evidence admissibility and invalidity gating directly relate the filing to admissible evidence.'),
('US 63/963,839', 7, 'Invalidity gating materially relates to whether downstream reliance on evidence remains valid.'),

-- Family 5: authority separation / firewalls
('US 63/963,826', 4, 'Institutional boundary governance materially relates to governance of how evidence may be interpreted and used.'),
('US 63/963,826', 8, 'Institutional boundary governance and non-encroachment directly relate the filing to bounded authority.'),
('US 63/963,826', 9, 'Non-encroachment materially relates to legitimacy of an institutional actor''s use of authority.'),

('US 63/963,833', 4, 'Third-party interpretation firewalls materially relate to governance of evidence interpretation.'),
('US 63/963,833', 8, 'Interpretation firewalls materially relate to separation and limitation of third-party authority.'),
('US 63/963,833', 9, 'The firewall materially relates to legitimacy of interpretation by preventing unauthorized role collapse.'),

('US 63/966,338', 7, 'Non-coercive evidence escalation materially relates to whether evidence may properly support downstream reliance.'),
('US 63/966,338', 8, 'Authority-separated architecture directly relates the filing to bounded authority.'),
('US 63/966,338', 9, 'Non-coercive escalation materially relates to legitimate exercise of authority without improper compulsion.'),

('US 63/966,343', 2, 'Thermostat-sourced Environmental Integrity Records directly relate the filing to environmental records.'),
('US 63/966,343', 3, 'Synchronization across thermostat, analyzer, and procedural governor materially relates to continuity across governed nodes.'),
('US 63/966,343', 8, 'Synchronization with a procedural governor materially relates to bounded authority over downstream action.'),
('US 63/966,343', 15, 'Procedural governor synchronization materially relates to the controlled commit boundary preceding execution.'),

-- Family 6: AIR / PAIR / federated continuity
('US 64/015,062', 2, 'Continuous personal environmental exposure recording directly relates the filing to person-associated environmental records.'),
('US 64/015,062', 3, 'Integrity-governed chronology directly relates the filing to continuity over time.'),
('US 64/015,062', 4, 'Federated environmental data integration materially relates to governance of evidence across sources.'),
('US 64/015,062', 23, 'Longitudinal personal environmental chronology materially relates to durable memory.'),

('US 64/015,073', 2, 'Federated environmental exposure tracking materially relates to creation of environmental exposure records.'),
('US 64/015,073', 3, 'Cross-domain exposure tracking materially relates to continuity across environments and domains.'),
('US 64/015,073', 4, 'Federated environmental intelligence materially relates to governance of evidence integrated across nodes.'),
('US 64/015,073', 23, 'Longitudinal exposure tracking materially relates to memory of prior environmental states.'),

('US 64/015,076', 1, 'Real-time environmental mapping materially relates to representation of current atmospheric reality.'),
('US 64/015,076', 2, 'Mobile and fixed environmental nodes materially relate to creation of federated atmospheric records.'),
('US 64/015,076', 3, 'Continuous environmental representation materially relates to atmospheric continuity across nodes and time.'),
('US 64/015,076', 4, 'Federated Atmospheric Integrity Networks materially relate to governance of distributed environmental evidence.'),

('US 64/024,196', 2, 'Personal environmental chronological records directly relate the filing to governed records.'),
('US 64/024,196', 3, 'Continuity assurance using multi-node redundant recording directly relates the filing to continuity.'),
('US 64/024,196', 23, 'Preserved personal environmental chronology materially relates to durable memory.'),

('US 64/024,209', 1, 'Body-proximate environmental sensing materially relates to observation of the person-associated environmental reality.'),
('US 64/024,209', 2, 'Modular person-associated sensing nodes materially relate to creation of environmental exposure records.'),
('US 64/024,209', 3, 'Persistent person-associated sensing materially relates to continuity of environmental observation.'),

-- Family 7: guided human execution
('US 64/025,521', 8, 'Real-time guided human task execution materially relates to the authority under which a human action is directed.'),
('US 64/025,521', 15, 'Automated verification before or during guided task performance materially relates to the commit boundary for human execution.'),
('US 64/025,521', 19, 'Guided human task performance is the consequence-bearing execution pathway addressed by the filing.'),
('US 64/025,521', 21, 'Automated verification and evidence capture materially relate to verification of task outcome.'),

-- Family 8: admissible transitions / continuity / execution control
('US 64/021,710', 2, 'A governed, append-only chronological record directly relates the filing to Record.'),
('US 64/021,710', 3, 'Chronological state-transition preservation directly relates the filing to Continuity.'),
('US 64/021,710', 5, 'Enforcement of admissible state transitions materially relates to evidence sufficient to permit a transition.'),
('US 64/021,710', 15, 'Enforcing an admissible transition materially relates to the commit boundary before state change.'),
('US 64/021,710', 19, 'The governed state transition is the execution event controlled by the filing.'),

('US 64/022,608', 3, 'Admissible chronological evidence materially depends on preserved continuity across relevant state history.'),
('US 64/022,608', 5, 'The filing expressly bases execution control on admissible chronological evidence.'),
('US 64/022,608', 15, 'Deterministic execution control materially relates to the commit decision before consequence-bearing action.'),
('US 64/022,608', 17, 'Deterministic refusal of execution when evidence is not admissible materially relates to admissible non-occurrence.'),
('US 64/022,608', 18, 'Execution control capable of preventing an inadmissible action materially relates to prevented consequence.'),
('US 64/022,608', 19, 'The filing directly concerns control of consequence-bearing execution.'),

('US 64/030,366', 3, 'The filing expressly concerns maintaining admissible state continuity over time.'),
('US 64/030,366', 5, 'Admissible state continuity materially relates to continued validity of the evidence state.'),
('US 64/030,366', 7, 'Determining reliance validity over time directly relates the filing to Reliance.'),
('US 64/030,366', 22, 'A changed state that invalidates prior reliance materially relates to recognition of New Reality.'),
('US 64/030,366', 24, 'Re-evaluation of reliance after state change materially relates to initiation of a Future Chain.'),

('US 64/030,461', 5, 'Admissible state validation directly relates the filing to the evidence/admissibility condition preceding execution.'),
('US 64/030,461', 15, 'Execution control based on admissible state validation materially relates to the commit boundary.'),
('US 64/030,461', 17, 'Withholding execution when state validation fails materially relates to admissible non-occurrence.'),
('US 64/030,461', 18, 'Execution control that blocks an inadmissible transition materially relates to prevented consequence.'),
('US 64/030,461', 19, 'The filing directly concerns consequence-bearing execution control.');

-- Resolve the numeric link order to canonical link IDs and persist.
insert into public.ta14_canonical_link_sources (
  link_id,
  source_id,
  relation_type,
  relation_summary,
  is_primary_provenance,
  public_visibility
)
select
  links.link_id,
  sources.id,
  'patent_position',
  mappings.relation_summary,
  false,
  true
from ta14_patent_link_map as mappings
join public.ta14_canonical_sources as sources
  on sources.source_type = 'patent_application'
 and sources.source_identifier = mappings.source_identifier
join public.ta14_canonical_links as links
  on links.link_order = mappings.link_order
where links.doctrine_state = 'active'
on conflict (link_id, source_id, relation_type)
do update set
  relation_summary = excluded.relation_summary,
  public_visibility = excluded.public_visibility,
  updated_at = timezone('utc', now());

-- Guard against unresolved source or link references.
do $$
declare
  expected_count integer;
  resolved_count integer;
begin
  select count(*) into expected_count
  from ta14_patent_link_map;

  select count(*) into resolved_count
  from ta14_patent_link_map as mappings
  join public.ta14_canonical_sources as sources
    on sources.source_type = 'patent_application'
   and sources.source_identifier = mappings.source_identifier
  join public.ta14_canonical_links as links
    on links.link_order = mappings.link_order
   and links.doctrine_state = 'active';

  if expected_count <> resolved_count then
    raise exception
      'TA-14 patent/link mapping resolution failed: expected %, resolved %.',
      expected_count,
      resolved_count;
  end if;
end;
$$;
