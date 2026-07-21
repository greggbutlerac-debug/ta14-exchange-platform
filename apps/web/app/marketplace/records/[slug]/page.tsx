import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type GovernedRecord = {
  slug: string;
  title: string;
  category: string;
  status: 'REQUEST OPEN' | 'INVITATION ONLY' | 'PREVIEW';
  visibility: string;
  summary: string;
  subject: string;
  intendedUse: string;
  recordSteward: string;
  pricing: string;
  timing: string;
  evidenceClasses: string[];
  contributorRoles: {
    title: string;
    description: string;
  }[];
  requiredSections: {
    title: string;
    description: string;
  }[];
  interpretationBoundaries: string[];
  reviewStates: {
    state: string;
    description: string;
  }[];
  proofBoundaries: string[];
};

const records: GovernedRecord[] = [
  {
    slug: 'atmospheric-integrity-record',
    title: 'Atmospheric Integrity Record',
    category: 'Air',
    status: 'REQUEST OPEN',
    visibility: 'Public or private',
    summary:
      'A governed record of atmospheric conditions, source evidence, continuity, contributor identity, daily preservation, interpretation boundaries, and change over time.',
    subject:
      'A declared indoor, outdoor, mobile, occupational, residential, institutional, or process-related atmospheric environment.',
    intendedUse:
      'Preserve a reviewable environmental record that can support bounded interpretation, comparison, investigation, planning, or later governance action.',
    recordSteward:
      'An assigned Record Steward maintains structure, contributor permissions, version state, correction history, continuity, and preservation.',
    pricing: 'Request proposals',
    timing: 'Typical initial scope: 14-30 days',
    evidenceClasses: [
      'Atmospheric sensor records',
      'Instrument identity and calibration',
      'Location and zone identity',
      'Weather or outdoor reference data',
      'HVAC and ventilation records',
      'Occupancy and activity context',
      'Service and intervention history',
      'Images, video, or field observations',
    ],
    contributorRoles: [
      {
        title: 'Requester',
        description:
          'Declares the subject, intended use, visibility, timing, and required record period.',
      },
      {
        title: 'Record Steward',
        description:
          'Maintains the governed record, contributor permissions, continuity, versions, and corrections.',
      },
      {
        title: 'Evidence Contributor',
        description:
          'Provides attributable source evidence without gaining automatic interpretation or approval authority.',
      },
      {
        title: 'Domain Interpreter',
        description:
          'Produces a bounded interpretation limited to the preserved evidence and declared rules.',
      },
      {
        title: 'Independent Reviewer',
        description:
          'Examines continuity, scope, unresolved gaps, interpretation boundaries, and overclaim risk.',
      },
      {
        title: 'Verifier',
        description:
          'Tests record integrity, version dependencies, required fields, and declared verification checks.',
      },
    ],
    requiredSections: [
      {
        title: 'Subject and Scope',
        description:
          'Identifies the environment, locations, record period, intended use, exclusions, and visibility.',
      },
      {
        title: 'Source Evidence Register',
        description:
          'Lists each evidence source, instrument, owner, contributor, timestamp, and access state.',
      },
      {
        title: 'Continuity Record',
        description:
          'Preserves custody, transfer, version, timestamp, source identity, and known gaps.',
      },
      {
        title: 'Daily or Event Record',
        description:
          'Captures the declared atmospheric state, relevant context, events, anomalies, and interventions.',
      },
      {
        title: 'Governed Interpretation',
        description:
          'Explains what the evidence shows without silently converting the record into diagnosis or causation.',
      },
      {
        title: 'Corrections and Supersession',
        description:
          'Preserves corrections, challenges, replaced evidence, new versions, and reasons for change.',
      },
    ],
    interpretationBoundaries: [
      'The record may describe measured conditions and declared context.',
      'The interpretation may identify patterns, deviations, missing evidence, and unresolved questions.',
      'The interpretation may compare states under declared conditions.',
      'The interpretation must not silently diagnose a person, building, source, or cause.',
      'Optimization recommendations must remain separate from the record and interpretation.',
    ],
    reviewStates: [
      {
        state: 'SUBMITTED',
        description: 'Evidence or files were supplied for the record.',
      },
      {
        state: 'PRESERVED',
        description: 'The record was stored with time, identity, and version state.',
      },
      {
        state: 'CONTINUITY REVIEWED',
        description: 'Source, custody, identity, transfer, and gaps were examined.',
      },
      {
        state: 'INTERPRETED',
        description: 'A bounded interpretation was issued.',
      },
      {
        state: 'INDEPENDENTLY REVIEWED',
        description: 'A separate reviewer examined the declared scope.',
      },
      {
        state: 'VERIFIED',
        description: 'Declared integrity or replay checks passed.',
      },
    ],
    proofBoundaries: [
      'The record does not prove medical causation.',
      'The record does not certify regulatory compliance unless separately reviewed for a declared jurisdiction and scope.',
      'The record does not guarantee sensor accuracy beyond preserved calibration and validation evidence.',
      'The record does not replace diagnosis, engineering judgment, legal advice, or operational authority.',
      'Verification is limited to the declared record structure and supplied evidence.',
    ],
  },
  {
    slug: 'personal-atmospheric-integrity-record',
    title: 'Personal Atmospheric Integrity Record',
    category: 'Personal Air',
    status: 'INVITATION ONLY',
    visibility: 'Private or selectively shared',
    summary:
      'A private governed record of personal atmospheric exposure evidence, locations, source context, continuity, permissions, and bounded interpretation.',
    subject:
      'A named individual and the declared environments, time periods, activities, and atmospheric evidence associated with that person.',
    intendedUse:
      'Preserve a private environmental chronology that may be selectively shared with clinicians, investigators, employers, counsel, or trusted reviewers.',
    recordSteward:
      'The individual or an authorized steward controls access, contributor permissions, sharing, correction, and preservation.',
    pricing: 'Scoped engagement',
    timing: 'Typical initial scope: 21-45 days',
    evidenceClasses: [
      'Portable or wearable sensor records',
      'Location and time history',
      'Building environmental records',
      'Workplace or vehicle records',
      'Symptom or event notes supplied by the individual',
      'Laboratory or medical documents supplied by the individual',
      'Images and field observations',
      'External weather and air reference records',
    ],
    contributorRoles: [
      {
        title: 'Record Subject',
        description:
          'Controls the private record, access permissions, intended use, and sharing decisions.',
      },
      {
        title: 'Authorized Steward',
        description:
          'Maintains continuity, versions, corrections, access, and contributor boundaries.',
      },
      {
        title: 'Evidence Contributor',
        description:
          'Provides source evidence within explicit permission and declared scope.',
      },
      {
        title: 'Environmental Interpreter',
        description:
          'Explains the atmospheric evidence without issuing a medical diagnosis.',
      },
      {
        title: 'Clinical Recipient',
        description:
          'May receive the record but remains independently responsible for clinical interpretation.',
      },
      {
        title: 'Independent Reviewer',
        description:
          'Reviews continuity, evidence gaps, privacy boundaries, and interpretation claims.',
      },
    ],
    requiredSections: [
      {
        title: 'Subject Authorization',
        description:
          'Preserves identity, consent, sharing rules, intended use, and revocation state.',
      },
      {
        title: 'Exposure Chronology',
        description:
          'Records locations, time periods, activities, events, and associated atmospheric evidence.',
      },
      {
        title: 'Source and Continuity Register',
        description:
          'Preserves the origin, contributor, custody, version, and known limitations of each source.',
      },
      {
        title: 'Private Evidence Vault',
        description:
          'Stores restricted files and records with controlled access and download permissions.',
      },
      {
        title: 'Governed Environmental Interpretation',
        description:
          'Describes what the environmental evidence shows without diagnosing the individual.',
      },
      {
        title: 'Sharing and Disclosure History',
        description:
          'Preserves who received the record, when, under what authority, and which version was shared.',
      },
    ],
    interpretationBoundaries: [
      'The record may describe exposure conditions and chronology.',
      'The interpretation may identify patterns, correlations, or unresolved environmental questions.',
      'The interpretation may support a clinician by organizing environmental evidence.',
      'The record must not diagnose disease, injury, or causation.',
      'Clinical, legal, and occupational conclusions remain separate.',
    ],
    reviewStates: [
      {
        state: 'PRIVATE DRAFT',
        description: 'The subject or steward is assembling the record.',
      },
      {
        state: 'PRESERVED',
        description: 'The record and permissions were stored with version state.',
      },
      {
        state: 'CONTINUITY REVIEWED',
        description: 'Source, custody, chronology, and gaps were examined.',
      },
      {
        state: 'INTERPRETED',
        description: 'A bounded environmental interpretation was issued.',
      },
      {
        state: 'SHARED',
        description: 'A declared version was released to an authorized recipient.',
      },
      {
        state: 'SUPERSEDED',
        description: 'A newer version replaced the prior active record without deleting history.',
      },
    ],
    proofBoundaries: [
      'The record is not a medical record unless adopted and governed by an authorized healthcare provider.',
      'The record does not diagnose illness or prove causation.',
      'Private sharing does not transfer ownership of the record.',
      'The record does not guarantee completeness of exposure history.',
      'Interpretation remains limited to the evidence preserved and permissions granted.',
    ],
  },
  {
    slug: 'building-environmental-record',
    title: 'Building Environmental Record',
    category: 'Buildings',
    status: 'REQUEST OPEN',
    visibility: 'Public summary with private evidence options',
    summary:
      'A governed record that binds building sensor, service, occupancy, event, intervention, and environmental evidence into a preserved state history.',
    subject:
      'A declared building, campus, zone, room, system, or operational environment.',
    intendedUse:
      'Preserve daily, periodic, or event-based environmental records that can support review, comparison, intervention governance, and post-intervention proof.',
    recordSteward:
      'A building owner, operator, facility team, or assigned independent steward maintains the official record.',
    pricing: '$4,500 starting scope',
    timing: 'Typical initial scope: 30-60 days',
    evidenceClasses: [
      'Building automation system exports',
      'Independent sensor records',
      'HVAC service and commissioning records',
      'Occupancy and activity records',
      'Weather and outdoor reference data',
      'Maintenance and intervention records',
      'Water, moisture, pressure, and ventilation evidence',
      'Incident and complaint history',
    ],
    contributorRoles: [
      {
        title: 'Building Owner or Operator',
        description:
          'Declares the subject, intended use, access, visibility, and operational boundaries.',
      },
      {
        title: 'Record Steward',
        description:
          'Maintains source registration, contributor permissions, continuity, versions, and correction history.',
      },
      {
        title: 'Controls or Sensor Contributor',
        description:
          'Provides attributable data and source-system context.',
      },
      {
        title: 'Service Contributor',
        description:
          'Provides maintenance, diagnosis, intervention, and post-state evidence.',
      },
      {
        title: 'Independent Reviewer',
        description:
          'Examines continuity, environmental claims, intervention proof, and unresolved gaps.',
      },
      {
        title: 'Verifier',
        description:
          'Tests required sections, evidence dependencies, timestamps, versions, and declared comparisons.',
      },
    ],
    requiredSections: [
      {
        title: 'Building and Zone Identity',
        description:
          'Declares the property, systems, rooms, zones, ownership, operator, and record scope.',
      },
      {
        title: 'Environmental Source Register',
        description:
          'Lists BAS, sensors, service records, laboratories, contributors, and external reference sources.',
      },
      {
        title: 'Daily or Event Record',
        description:
          'Preserves conditions, operating context, anomalies, occupancy, and declared events.',
      },
      {
        title: 'Intervention History',
        description:
          'Separates authorized interventions from the original evidence and preserves action details.',
      },
      {
        title: 'Post-Intervention Comparison',
        description:
          'Compares declared post-state evidence against the preserved baseline under stated conditions.',
      },
      {
        title: 'Governed Interpretation and Status',
        description:
          'Issues a bounded interpretation and declares unresolved gaps, HOLD states, corrections, and supersession.',
      },
    ],
    interpretationBoundaries: [
      'The record may describe building environmental conditions and operational state.',
      'The interpretation may identify drift, anomalies, missing evidence, or changed performance.',
      'The interpretation may compare baseline and post-intervention states.',
      'The record must not silently claim occupant diagnosis or universal causation.',
      'Optimization and control changes require separate authority and governance.',
    ],
    reviewStates: [
      {
        state: 'BASELINE OPEN',
        description: 'The original state is being collected and preserved.',
      },
      {
        state: 'BASELINE PRESERVED',
        description: 'Required original-state evidence is complete for the declared scope.',
      },
      {
        state: 'INTERVENTION RECORDED',
        description: 'Authorized actions and execution evidence were added.',
      },
      {
        state: 'POST-STATE REVIEWED',
        description: 'Post-intervention evidence was compared with the baseline.',
      },
      {
        state: 'INDEPENDENTLY REVIEWED',
        description: 'A separate reviewer examined claims and evidence.',
      },
      {
        state: 'CURRENT RECORD',
        description: 'The active governed version is available under declared permissions.',
      },
    ],
    proofBoundaries: [
      'The record does not guarantee future building performance.',
      'The record does not prove occupant health outcomes.',
      'The record does not replace engineering, code, legal, or regulatory review.',
      'Post-intervention comparison is limited to declared conditions and available evidence.',
      'A public summary may omit private evidence and restricted operational details.',
    ],
  },
  {
    slug: 'hospital-environmental-record',
    title: 'Hospital Environmental Record',
    category: 'Healthcare',
    status: 'PREVIEW',
    visibility: 'Restricted',
    summary:
      'A restricted hospital environmental record framework preserving source, contributor, continuity, interpretation, correction, and clinical non-diagnosis boundaries.',
    subject:
      'A hospital, department, room, isolation area, procedural zone, pharmacy, laboratory, or other declared healthcare environment.',
    intendedUse:
      'Create a trusted environmental record that facilities, infection prevention, clinicians, laboratories, and authorized reviewers can use without collapsing environmental evidence into clinical diagnosis.',
    recordSteward:
      'An authorized hospital Record Steward manages contributor permissions, restricted evidence, versions, corrections, and institutional continuity.',
    pricing: 'Enterprise scope',
    timing: 'Typical initial scope: 45-90 days',
    evidenceClasses: [
      'Building automation records',
      'Room pressure and ventilation evidence',
      'Temperature and humidity records',
      'Air-cleaning and filtration records',
      'Facilities and maintenance history',
      'Laboratory reports',
      'Incident and deviation records',
      'Restricted clinical or operational context',
    ],
    contributorRoles: [
      {
        title: 'Hospital Record Steward',
        description:
          'Maintains official structure, permissions, continuity, version state, and institutional preservation.',
      },
      {
        title: 'Facilities Contributor',
        description:
          'Provides attributable building, HVAC, room, maintenance, and intervention evidence.',
      },
      {
        title: 'Laboratory Contributor',
        description:
          'Provides governed reports and source details within declared authority.',
      },
      {
        title: 'Clinical Recipient',
        description:
          'Uses the environmental record as one evidence source without transferring clinical authority to the record.',
      },
      {
        title: 'Independent Environmental Reviewer',
        description:
          'Reviews environmental scope, continuity, interpretation, and unresolved gaps.',
      },
      {
        title: 'Privacy and Governance Reviewer',
        description:
          'Reviews access, restricted fields, disclosure, and institutional boundary controls.',
      },
    ],
    requiredSections: [
      {
        title: 'Institutional and Zone Identity',
        description:
          'Declares hospital, department, room, system, responsible authority, and record scope.',
      },
      {
        title: 'Restricted Evidence Register',
        description:
          'Preserves source, owner, access class, contributor, timestamp, and retention state.',
      },
      {
        title: 'Environmental Condition Record',
        description:
          'Captures declared conditions, operating context, room state, events, deviations, and interventions.',
      },
      {
        title: 'Continuity and Access Record',
        description:
          'Preserves custody, transfers, downloads, disclosures, versions, and permission changes.',
      },
      {
        title: 'Governed Interpretation',
        description:
          'Explains environmental evidence under declared rules while preserving the clinical non-diagnosis boundary.',
      },
      {
        title: 'Correction, Escalation, and Supersession',
        description:
          'Preserves challenges, corrected evidence, HOLD states, escalations, and new active versions.',
      },
    ],
    interpretationBoundaries: [
      'The record may describe environmental and operational conditions.',
      'The interpretation may identify deviations, evidence gaps, or conditions requiring review.',
      'The record may support clinical or infection-prevention review as one evidence source.',
      'The record must not diagnose a patient or establish clinical causation.',
      'Clinical decisions remain under authorized clinical governance.',
    ],
    reviewStates: [
      {
        state: 'RESTRICTED DRAFT',
        description: 'Authorized contributors are assembling the institutional record.',
      },
      {
        state: 'CONTINUITY REVIEWED',
        description: 'Source, custody, access, version, and transfer were examined.',
      },
      {
        state: 'ENVIRONMENTALLY INTERPRETED',
        description: 'A bounded environmental interpretation was issued.',
      },
      {
        state: 'CLINICAL BOUNDARY CONFIRMED',
        description: 'The record was checked for improper diagnostic or causation claims.',
      },
      {
        state: 'INDEPENDENTLY REVIEWED',
        description: 'A separate reviewer examined the declared environmental scope.',
      },
      {
        state: 'ACTIVE INSTITUTIONAL RECORD',
        description: 'The current version is preserved under restricted access.',
      },
    ],
    proofBoundaries: [
      'The record does not diagnose patients.',
      'The record does not establish infection source or medical causation by itself.',
      'The record does not replace hospital policy, clinical judgment, code, or regulatory authority.',
      'Access and privacy controls must be defined separately for each institution.',
      'Environmental interpretation remains limited to preserved evidence.',
    ],
  },
  {
    slug: 'hvac-performance-record',
    title: 'HVAC Performance Record',
    category: 'HVAC',
    status: 'REQUEST OPEN',
    visibility: 'Public summary or private project record',
    summary:
      'A governed baseline, diagnostic-determination, intervention, and post-intervention performance record for HVAC systems.',
    subject:
      'A declared HVAC system, component, zone, building, service event, or performance intervention.',
    intendedUse:
      'Preserve original state, evidence-bound determinations, intervention authority, execution evidence, and post-state performance comparison.',
    recordSteward:
      'The owner, contractor, independent reviewer, or assigned steward maintains the official project record and version history.',
    pricing: '$1,850 starting scope',
    timing: 'Typical initial scope: 7-14 days',
    evidenceClasses: [
      'Equipment and system identity',
      'Sequence-of-operation evidence',
      'Electrical measurements',
      'Airflow and static-pressure measurements',
      'Refrigerant-system measurements',
      'Temperature and psychrometric evidence',
      'Images and body-worn video',
      'Intervention and post-state records',
    ],
    contributorRoles: [
      {
        title: 'Owner or Requester',
        description:
          'Declares the system, problem, intended use, access, and required proof.',
      },
      {
        title: 'Field Technician',
        description:
          'Collects attributable evidence and performs only authorized interventions.',
      },
      {
        title: 'Diagnostic Determination Author',
        description:
          'Issues evidence-bound determinations separate from measurements and intervention.',
      },
      {
        title: 'Record Steward',
        description:
          'Maintains baseline, versions, continuity, intervention record, and post-state comparison.',
      },
      {
        title: 'Independent Reviewer',
        description:
          'Reviews sequence, baseline sufficiency, determination logic, and performance claims.',
      },
      {
        title: 'Verifier',
        description:
          'Tests required evidence, dependencies, timestamps, route states, and post-state comparison.',
      },
    ],
    requiredSections: [
      {
        title: 'System Identity and Sequence',
        description:
          'Declares equipment, configuration, sequence, controls, operating context, and intended function.',
      },
      {
        title: 'Original-State Baseline',
        description:
          'Preserves non-invasive measurements, observations, video, and operating state before intervention.',
      },
      {
        title: 'Diagnostic Determinations',
        description:
          'Separates evidence, observations, exclusions, and rule-constrained determinations.',
      },
      {
        title: 'Intervention Authorization',
        description:
          'Declares who authorized the action, why, under what evidence, and with which limitations.',
      },
      {
        title: 'Execution Record',
        description:
          'Preserves technician identity, action, materials, measurements, timestamps, and deviations.',
      },
      {
        title: 'Post-Intervention Performance Record',
        description:
          'Compares the new state against the preserved baseline under declared test conditions.',
      },
    ],
    interpretationBoundaries: [
      'Measurements remain separate from diagnostic determinations.',
      'Diagnostic determinations remain separate from interventions.',
      'Interventions remain separate from post-state performance claims.',
      'The record may show change under declared conditions.',
      'The record must not claim future reliability or causation beyond the evidence.',
    ],
    reviewStates: [
      {
        state: 'BASELINE REQUIRED',
        description: 'Intervention is not yet admissible because the original state is incomplete.',
      },
      {
        state: 'BASELINE PRESERVED',
        description: 'Required original-state evidence is complete.',
      },
      {
        state: 'DETERMINATION DECLARED',
        description: 'Evidence-bound diagnostic determinations were issued.',
      },
      {
        state: 'INTERVENTION AUTHORIZED',
        description: 'Declared authority approved the bounded action.',
      },
      {
        state: 'POST-STATE CAPTURED',
        description: 'Post-intervention evidence was preserved.',
      },
      {
        state: 'PERFORMANCE COMPARED',
        description: 'Post-state was compared against the original baseline.',
      },
    ],
    proofBoundaries: [
      'The record does not guarantee future equipment life or performance.',
      'The record does not replace manufacturer, code, licensing, or safety requirements.',
      'The record does not prove causation beyond measured and preserved evidence.',
      'Post-state comparison is limited to declared test conditions.',
      'A completed record does not make every intervention correct or admissible.',
    ],
  },
  {
    slug: 'land-integrity-record',
    title: 'Land Integrity Record',
    category: 'Land',
    status: 'PREVIEW',
    visibility: 'Public summary or private evidence record',
    summary:
      'A governed land record preserving parcel identity, observations, sampling, custody, interventions, interpretations, and change over time.',
    subject:
      'A declared parcel, site, easement, habitat, agricultural area, development area, or environmental zone.',
    intendedUse:
      'Preserve a reviewable land-condition chronology that can support bounded interpretation, planning, remediation review, or change comparison.',
    recordSteward:
      'The owner, organization, public authority, or independent steward maintains the official record.',
    pricing: 'Request proposals',
    timing: 'Scope dependent',
    evidenceClasses: [
      'Parcel and survey records',
      'Sampling plans and results',
      'Laboratory reports',
      'Images and field observations',
      'Soil, vegetation, and moisture evidence',
      'Intervention and remediation history',
      'Weather and external reference data',
      'Custody and transfer records',
    ],
    contributorRoles: [
      {
        title: 'Land Owner or Requester',
        description:
          'Declares the site, intended use, access, visibility, and record period.',
      },
      {
        title: 'Record Steward',
        description:
          'Maintains parcel identity, source register, continuity, versions, and corrections.',
      },
      {
        title: 'Field Contributor',
        description:
          'Provides attributable observations, sampling, images, and site context.',
      },
      {
        title: 'Laboratory Contributor',
        description:
          'Provides governed analytical reports and method details.',
      },
      {
        title: 'Domain Interpreter',
        description:
          'Issues bounded interpretation without overstating causation, legal status, or remediation success.',
      },
      {
        title: 'Independent Reviewer',
        description:
          'Reviews sampling, custody, continuity, scope, claims, and unresolved gaps.',
      },
    ],
    requiredSections: [
      {
        title: 'Parcel and Site Identity',
        description:
          'Declares boundaries, ownership or authority, location, intended use, and record scope.',
      },
      {
        title: 'Observation and Sampling Record',
        description:
          'Preserves field methods, locations, timestamps, contributors, samples, and conditions.',
      },
      {
        title: 'Custody and Laboratory Record',
        description:
          'Preserves transfer, receipt, methods, results, versions, and known limitations.',
      },
      {
        title: 'Intervention History',
        description:
          'Separates remediation, construction, treatment, or land-use changes from the source record.',
      },
      {
        title: 'Governed Interpretation',
        description:
          'Explains what the land evidence shows under declared rules and limitations.',
      },
      {
        title: 'Change and Supersession Record',
        description:
          'Preserves new surveys, corrections, changed conditions, interventions, and newer active versions.',
      },
    ],
    interpretationBoundaries: [
      'The record may describe land conditions and change over time.',
      'The interpretation may identify anomalies, evidence gaps, or areas requiring additional review.',
      'The interpretation may compare pre- and post-intervention states.',
      'The record must not silently establish legal liability, ownership, or causation.',
      'Remediation success requires declared criteria and separate review.',
    ],
    reviewStates: [
      {
        state: 'SITE DECLARED',
        description: 'The subject, parcel, authority, and record scope were established.',
      },
      {
        state: 'EVIDENCE COLLECTED',
        description: 'Field, sampling, laboratory, and source records were added.',
      },
      {
        state: 'CUSTODY REVIEWED',
        description: 'Transfer, receipt, identity, and continuity were examined.',
      },
      {
        state: 'INTERPRETED',
        description: 'A bounded land interpretation was issued.',
      },
      {
        state: 'INTERVENTION COMPARED',
        description: 'Declared post-intervention evidence was compared with the baseline.',
      },
      {
        state: 'CURRENT RECORD',
        description: 'The active version is preserved under declared access.',
      },
    ],
    proofBoundaries: [
      'The record does not establish legal title or liability.',
      'The record does not prove contamination source without sufficient evidence.',
      'The record does not certify remediation success without declared criteria and review.',
      'The record does not replace legal, surveying, engineering, or regulatory authority.',
      'Interpretation remains limited to the preserved site evidence.',
    ],
  },
  {
    slug: 'water-integrity-record',
    title: 'Water Integrity Record',
    category: 'Water',
    status: 'REQUEST OPEN',
    visibility: 'Public summary or private evidence record',
    summary:
      'A governed water record preserving source identity, sampling, custody, laboratory evidence, interpretation, correction, and change over time.',
    subject:
      'A declared water source, supply, well, vessel, storage system, treatment system, body of water, or distribution segment.',
    intendedUse:
      'Preserve a reviewable water-condition record that can support bounded interpretation, comparison, treatment review, or later governance action.',
    recordSteward:
      'The owner, operator, public authority, organization, or assigned independent steward maintains the official record.',
    pricing: 'Request proposals',
    timing: 'Typical initial scope: 14-30 days',
    evidenceClasses: [
      'Source and system identity',
      'Sampling event records',
      'Field measurements',
      'Laboratory reports',
      'Chain-of-custody records',
      'Treatment and intervention history',
      'Weather, flow, or external context',
      'Images and field observations',
    ],
    contributorRoles: [
      {
        title: 'Requester or Water Authority',
        description:
          'Declares the source, intended use, access, visibility, and record scope.',
      },
      {
        title: 'Record Steward',
        description:
          'Maintains source identity, contributor permissions, continuity, versions, and corrections.',
      },
      {
        title: 'Sampler or Field Contributor',
        description:
          'Provides attributable sampling, field measurements, observations, and conditions.',
      },
      {
        title: 'Laboratory Contributor',
        description:
          'Provides governed analytical evidence, methods, detection limits, and report versions.',
      },
      {
        title: 'Domain Interpreter',
        description:
          'Produces bounded interpretation under declared standards and evidence limitations.',
      },
      {
        title: 'Independent Reviewer',
        description:
          'Reviews sampling, custody, laboratory continuity, interpretation, and unresolved gaps.',
      },
    ],
    requiredSections: [
      {
        title: 'Source and System Identity',
        description:
          'Declares the water source, location, ownership or authority, intended use, and record period.',
      },
      {
        title: 'Sampling Event Record',
        description:
          'Preserves method, location, time, conditions, contributor identity, and sample identification.',
      },
      {
        title: 'Custody and Laboratory Record',
        description:
          'Preserves transfer, receipt, analytical method, result, version, and known limitations.',
      },
      {
        title: 'Treatment and Intervention History',
        description:
          'Separates treatment, flushing, repair, or operational change from original evidence.',
      },
      {
        title: 'Governed Interpretation',
        description:
          'Explains what the water evidence shows under declared standards and proof boundaries.',
      },
      {
        title: 'Correction and Current-State Record',
        description:
          'Preserves corrected evidence, new samples, supersession, and the active governed version.',
      },
    ],
    interpretationBoundaries: [
      'The record may describe measured water conditions and source context.',
      'The interpretation may compare results with declared thresholds or standards.',
      'The interpretation may identify anomalies, gaps, or conditions requiring review.',
      'The record must not silently diagnose health effects or prove causation.',
      'Treatment recommendations require separate authority and scope.',
    ],
    reviewStates: [
      {
        state: 'SOURCE DECLARED',
        description: 'The source, intended use, authority, and record scope were established.',
      },
      {
        state: 'SAMPLE PRESERVED',
        description: 'Sampling identity, conditions, and contributor record were stored.',
      },
      {
        state: 'CUSTODY REVIEWED',
        description: 'Transfer, receipt, identity, and continuity were examined.',
      },
      {
        state: 'LABORATORY EVIDENCE ADDED',
        description: 'Governed analytical evidence and methods were preserved.',
      },
      {
        state: 'INTERPRETED',
        description: 'A bounded water interpretation was issued.',
      },
      {
        state: 'CURRENT RECORD',
        description: 'The active governed version is preserved under declared access.',
      },
    ],
    proofBoundaries: [
      'The record does not diagnose health effects.',
      'The record does not prove contamination source without sufficient evidence.',
      'The record does not certify compliance unless separately reviewed for a declared jurisdiction and scope.',
      'The record does not replace public-health, engineering, legal, or regulatory authority.',
      'Interpretation remains limited to preserved sampling and laboratory evidence.',
    ],
  },
  {
    slug: 'laboratory-environmental-record',
    title: 'Laboratory Environmental Record',
    category: 'Laboratory',
    status: 'INVITATION ONLY',
    visibility: 'Restricted',
    summary:
      'A controlled environmental record for laboratories requiring attributable evidence, restricted contributors, exact continuity, deviation history, and bounded interpretation.',
    subject:
      'A declared laboratory, controlled room, process area, instrument environment, clean zone, or test environment.',
    intendedUse:
      'Preserve a controlled environmental record that can support quality review, deviation analysis, process continuity, and post-intervention comparison.',
    recordSteward:
      'An authorized laboratory or quality Record Steward manages permissions, source identity, continuity, corrections, and retention.',
    pricing: 'Scoped engagement',
    timing: 'Typical initial scope: 30-60 days',
    evidenceClasses: [
      'Environmental monitoring systems',
      'Instrument identity and calibration',
      'Temperature, humidity, pressure, and particle records',
      'Access and activity logs',
      'Maintenance and service records',
      'Deviation and corrective-action records',
      'Laboratory reports',
      'Restricted images or video',
    ],
    contributorRoles: [
      {
        title: 'Laboratory Record Steward',
        description:
          'Maintains official structure, source register, permissions, continuity, retention, and version state.',
      },
      {
        title: 'Environmental Monitoring Contributor',
        description:
          'Provides attributable system records, instrument identity, and operating context.',
      },
      {
        title: 'Quality Contributor',
        description:
          'Provides deviation, corrective-action, review, and approval evidence within declared authority.',
      },
      {
        title: 'Service Contributor',
        description:
          'Provides maintenance, repair, calibration, and intervention evidence.',
      },
      {
        title: 'Independent Reviewer',
        description:
          'Reviews continuity, deviations, interpretation, proof claims, and unresolved gaps.',
      },
      {
        title: 'Verifier',
        description:
          'Tests required fields, source dependencies, timestamps, versions, and declared integrity checks.',
      },
    ],
    requiredSections: [
      {
        title: 'Controlled Environment Identity',
        description:
          'Declares the laboratory, zone, process, instruments, ownership, and record scope.',
      },
      {
        title: 'Source and Instrument Register',
        description:
          'Preserves source systems, calibration, contributor identity, access, and version state.',
      },
      {
        title: 'Environmental Condition Record',
        description:
          'Captures declared conditions, operating context, access, activities, deviations, and events.',
      },
      {
        title: 'Deviation and Intervention Record',
        description:
          'Separates observed state, deviation, determination, authorization, action, and post-state evidence.',
      },
      {
        title: 'Governed Interpretation',
        description:
          'Explains the environmental evidence under declared laboratory and quality boundaries.',
      },
      {
        title: 'Review, Correction, and Retention',
        description:
          'Preserves independent review, correction, supersession, access history, and retention state.',
      },
    ],
    interpretationBoundaries: [
      'The record may describe controlled environmental conditions and deviations.',
      'The interpretation may identify continuity gaps or evidence requiring quality review.',
      'The interpretation may compare pre- and post-intervention conditions.',
      'The record must not silently establish product disposition or regulatory compliance.',
      'Quality, scientific, and regulatory decisions remain under separate authority.',
    ],
    reviewStates: [
      {
        state: 'CONTROLLED DRAFT',
        description: 'Authorized contributors are assembling the restricted record.',
      },
      {
        state: 'SOURCE VERIFIED',
        description: 'Declared source systems and instrument identities were reviewed.',
      },
      {
        state: 'CONTINUITY REVIEWED',
        description: 'Custody, access, version, and transfer were examined.',
      },
      {
        state: 'DEVIATION INTERPRETED',
        description: 'A bounded interpretation was issued for the declared deviation scope.',
      },
      {
        state: 'INDEPENDENTLY REVIEWED',
        description: 'A separate reviewer examined the record and proof boundaries.',
      },
      {
        state: 'ACTIVE CONTROLLED RECORD',
        description: 'The current version is preserved under restricted access and retention rules.',
      },
    ],
    proofBoundaries: [
      'The record does not determine product release or disposition by itself.',
      'The record does not certify regulatory compliance unless separately reviewed.',
      'The record does not replace scientific, quality, engineering, or regulatory authority.',
      'Restricted access must be configured for the specific organization.',
      'Verification remains limited to declared record structure and evidence.',
    ],
  },
];

function getRecord(slug: string) {
  return records.find((record) => record.slug === slug);
}

export function generateStaticParams() {
  return records.map((record) => ({
    slug: record.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = getRecord(slug);

  if (!record) {
    return {
      title: 'Governed Record',
    };
  }

  return {
    title: record.title,
    description: record.summary,
  };
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="m5 12.5 4 4L19 7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 8v5M12 17.2v.1M10.3 3.7 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function GovernedRecordDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = getRecord(slug);

  if (!record) {
    notFound();
  }

  return (
    <main className="recordPage">
      <div className="backgroundLayer" aria-hidden="true">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="star starOne" />
        <div className="star starTwo" />
        <div className="star starThree" />
      </div>

      <section className="heroSection">
        <div className="pageShell">
          <Link className="backLink" href="/marketplace/records">
            <span aria-hidden="true">←</span>
            Back to Governed Records
          </Link>

          <div className="heroGrid">
            <div>
              <div className="topline">
                <span className="categoryBadge">{record.category}</span>
                <span className="statusBadge">{record.status}</span>
              </div>

              <span className="kicker">GOVERNED RECORD SCOPE</span>
              <h1>{record.title}</h1>
              <p className="heroLead">{record.summary}</p>

              <div className="heroActions">
                <a className="primaryButton" href="#request">
                  Review request boundary
                  <ArrowIcon />
                </a>
                <a className="secondaryButton" href="#structure">
                  View record structure
                </a>
              </div>

              <div className="boundaryNotice">
                <AlertIcon />
                <span>
                  This is a demonstration record scope. Live requests, evidence
                  upload, private storage, access permissions, contributor
                  invitations, payments, and record issuance are not connected.
                </span>
              </div>
            </div>

            <aside className="summaryCard">
              <div className="summaryHeader">
                <span>RECORD SUMMARY</span>
                <strong>{record.visibility}</strong>
              </div>

              <dl>
                <div>
                  <dt>Subject</dt>
                  <dd>{record.subject}</dd>
                </div>
                <div>
                  <dt>Intended use</dt>
                  <dd>{record.intendedUse}</dd>
                </div>
                <div>
                  <dt>Record stewardship</dt>
                  <dd>{record.recordSteward}</dd>
                </div>
                <div>
                  <dt>Pricing</dt>
                  <dd>{record.pricing}</dd>
                </div>
                <div>
                  <dt>Timing</dt>
                  <dd>{record.timing}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="sectionBlock" id="structure">
        <div className="pageShell twoColumnLayout">
          <div className="mainColumn">
            <article className="contentCard">
              <span className="sectionKicker">REQUIRED RECORD STRUCTURE</span>
              <h2>What the governed record must contain</h2>

              <div className="structureList">
                {record.requiredSections.map((section, index) => (
                  <div className="structureItem" key={section.title}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{section.title}</h3>
                      <p>{section.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">CONTRIBUTOR AUTHORITY</span>
              <h2>Who may contribute and what that does not authorize</h2>

              <div className="rolesGrid">
                {record.contributorRoles.map((role) => (
                  <div className="roleCard" key={role.title}>
                    <h3>{role.title}</h3>
                    <p>{role.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">INTERPRETATION BOUNDARIES</span>
              <h2>What the interpretation may and may not do</h2>

              <div className="checkList">
                {record.interpretationBoundaries.map((boundary) => (
                  <div className="checkItem" key={boundary}>
                    <CheckIcon />
                    <span>{boundary}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">REVIEW AND RECORD STATES</span>
              <h2>What each visible status means</h2>

              <div className="stateList">
                {record.reviewStates.map((item) => (
                  <div className="stateItem" key={item.state}>
                    <strong>{item.state}</strong>
                    <span>{item.description}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard proofCard">
              <span className="sectionKicker">PROOF BOUNDARIES</span>
              <h2>What this record does not prove</h2>

              <div className="boundaryList">
                {record.proofBoundaries.map((boundary) => (
                  <div className="boundaryItem" key={boundary}>
                    <AlertIcon />
                    <span>{boundary}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="sideColumn">
            <div className="sideCard">
              <span className="sectionKicker">EVIDENCE CLASSES</span>
              <h3>Evidence that may support this record</h3>

              <div className="chipList">
                {record.evidenceClasses.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="sideCard">
              <span className="sectionKicker">SEPARATED LAYERS</span>
              <h3>Do not collapse these scopes</h3>

              <div className="layerList">
                {[
                  ['Record', 'Preserved source evidence'],
                  ['Interpretation', 'Bounded explanation'],
                  ['Diagnosis', 'Separate determination'],
                  ['Optimization', 'Separate recommendation'],
                  ['Execution', 'Separate authorized action'],
                ].map(([title, description]) => (
                  <div key={title}>
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sideCard governanceCard">
              <span className="sectionKicker">TA-14 RECORD PRINCIPLE</span>
              <h3>Preserve before consequence</h3>
              <p>
                The record must remain independently reviewable before an
                interpretation, diagnosis, recommendation, optimization, or
                execution is allowed to claim authority over it.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="sectionBlock sectionTint" id="request">
        <div className="pageShell requestPanel">
          <div>
            <span className="sectionKicker">REQUEST BOUNDARY</span>
            <h2>Request a governed record with a declared subject and use.</h2>
            <p>
              The connected workflow will require subject identity, intended
              use, evidence sources, record period, visibility, permissions,
              desired interpretation, timing, budget, and proof boundaries
              before contributors are invited.
            </p>

            <div className="requestRequirements">
              {[
                'Declared subject',
                'Intended use',
                'Record period',
                'Evidence sources',
                'Visibility and permissions',
                'Interpretation request',
                'Timing and budget',
                'Proof boundaries',
              ].map((item) => (
                <div key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="requestAction">
            <span>REQUEST WORKFLOW NOT CONNECTED</span>
            <button type="button" disabled>
              Request this governed record
            </button>
            <small>
              This control remains disabled until authenticated intake,
              storage, permissions, matching, and payment workflows are
              implemented.
            </small>
          </div>
        </div>
      </section>

      <section className="finalSection">
        <div className="pageShell finalPanel">
          <div>
            <span className="sectionKicker">GOVERNED RECORD PRINCIPLE</span>
            <h2>Preserve what happened before deciding what it means.</h2>
            <p>
              A governed record creates attributable, reviewable continuity
              between reality, evidence, interpretation, correction, and later
              action.
            </p>
          </div>

          <div className="finalActions">
            <Link className="primaryButton" href="/marketplace/post-a-need">
              Request a custom record
              <ArrowIcon />
            </Link>
            <Link className="secondaryButton" href="/marketplace/records">
              Return to record catalog
            </Link>
          </div>

          <div className="maxim">
            No admissible evidence. No admissible execution.
          </div>
        </div>
      </section>

      <style>{`
        :root {
          --bg: #041019;
          --border: rgba(118, 213, 220, 0.2);
          --border-strong: rgba(118, 213, 220, 0.42);
          --text: #f3fbfc;
          --muted: #a9c1c8;
          --teal: #67e0df;
          --blue: #62a9ff;
          --gold: #ffd878;
          --violet: #bca4ff;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--bg);
        }

        .recordPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 12% 8%, rgba(37, 185, 189, 0.15), transparent 30%),
            radial-gradient(circle at 86% 18%, rgba(98, 169, 255, 0.12), transparent 28%),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .recordPage::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.22;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }

        .backgroundLayer {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .glow {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.13;
          animation: glowPulse 9s ease-in-out infinite;
        }

        .glowOne {
          top: 4%;
          left: -130px;
          background: var(--teal);
        }

        .glowTwo {
          top: 42%;
          right: -150px;
          background: var(--blue);
          animation-delay: 3s;
        }

        .star {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 12px white;
          animation: twinkle 4.2s ease-in-out infinite;
        }

        .starOne { top: 7%; left: 24%; }
        .starTwo { top: 16%; right: 14%; animation-delay: 1.2s; }
        .starThree { top: 44%; left: 7%; animation-delay: 2.4s; }

        .pageShell {
          position: relative;
          z-index: 2;
          width: min(1160px, calc(100% - 40px));
          margin: 0 auto;
        }

        .heroSection {
          padding: 86px 0 90px;
        }

        .backLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 52px;
          color: var(--muted);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 700;
          transition: color 180ms ease, transform 180ms ease;
        }

        .backLink:hover {
          color: var(--teal);
          transform: translateX(-3px);
        }

        .heroGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.06fr) minmax(380px, 0.74fr);
          gap: 58px;
          align-items: start;
        }

        .topline {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 22px;
        }

        .categoryBadge,
        .statusBadge {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          font-size: 0.64rem;
          font-weight: 850;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .categoryBadge {
          color: var(--teal);
          border: 1px solid rgba(103, 224, 223, 0.2);
          background: rgba(103, 224, 223, 0.06);
        }

        .statusBadge {
          color: #2b230e;
          background: var(--gold);
        }

        .kicker,
        .sectionKicker {
          display: inline-flex;
          color: var(--teal);
          font-size: 0.74rem;
          font-weight: 850;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          margin: 14px 0 24px;
          font-size: clamp(3.25rem, 6.7vw, 6.9rem);
          line-height: 0.95;
          letter-spacing: -0.06em;
          text-wrap: balance;
        }

        .heroLead {
          max-width: 760px;
          color: var(--muted);
          font-size: clamp(1.05rem, 1.6vw, 1.28rem);
          line-height: 1.75;
        }

        .heroActions,
        .finalActions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 32px;
        }

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 48px;
          padding: 0 20px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 0.94rem;
          font-weight: 800;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .primaryButton {
          color: #031114;
          background: linear-gradient(135deg, var(--teal), #b2f7f1);
          box-shadow: 0 12px 34px rgba(37, 185, 189, 0.24);
        }

        .secondaryButton {
          color: var(--text);
          border: 1px solid var(--border-strong);
          background: rgba(10, 30, 42, 0.64);
          backdrop-filter: blur(12px);
        }

        .primaryButton:hover,
        .secondaryButton:hover {
          transform: translateY(-2px);
        }

        .secondaryButton:hover {
          border-color: var(--teal);
          background: rgba(14, 42, 54, 0.9);
        }

        .boundaryNotice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          max-width: 760px;
          margin-top: 28px;
          padding: 14px 16px;
          border: 1px solid rgba(255, 216, 120, 0.22);
          border-radius: 14px;
          color: #eadfbf;
          background: rgba(255, 216, 120, 0.06);
          font-size: 0.85rem;
          line-height: 1.6;
        }

        .boundaryNotice svg {
          flex: 0 0 auto;
          margin-top: 2px;
          color: var(--gold);
        }

        .summaryCard {
          padding: 24px;
          border: 1px solid var(--border-strong);
          border-radius: 26px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.13), transparent 30%),
            linear-gradient(145deg, rgba(9, 32, 44, 0.92), rgba(4, 17, 25, 0.97));
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
        }

        .summaryHeader {
          display: grid;
          gap: 6px;
          margin-bottom: 20px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(118, 213, 220, 0.15);
        }

        .summaryHeader span {
          color: var(--teal);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.15em;
        }

        .summaryHeader strong {
          line-height: 1.45;
        }

        dl {
          display: grid;
          gap: 0;
          margin: 0;
        }

        dl > div {
          display: grid;
          gap: 6px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(118, 213, 220, 0.09);
        }

        dl > div:last-child {
          border-bottom: 0;
        }

        dt {
          color: #78959d;
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        dd {
          margin: 0;
          color: #e4f0f2;
          font-size: 0.84rem;
          line-height: 1.55;
        }

        .sectionBlock {
          position: relative;
          padding: 105px 0;
          scroll-margin-top: 70px;
        }

        .sectionTint {
          border-top: 1px solid rgba(118, 213, 220, 0.08);
          border-bottom: 1px solid rgba(118, 213, 220, 0.08);
          background: linear-gradient(180deg, rgba(9, 28, 39, 0.66), rgba(5, 18, 26, 0.45));
        }

        .twoColumnLayout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 0.38fr);
          gap: 26px;
          align-items: start;
        }

        .mainColumn,
        .sideColumn {
          display: grid;
          gap: 20px;
        }

        .sideColumn {
          position: sticky;
          top: 24px;
        }

        .contentCard,
        .sideCard {
          border: 1px solid var(--border);
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.08), transparent 28%),
            linear-gradient(145deg, rgba(10, 31, 43, 0.86), rgba(4, 18, 27, 0.95));
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.16);
        }

        .contentCard {
          padding: 30px;
          border-radius: 24px;
        }

        .sideCard {
          padding: 22px;
          border-radius: 20px;
        }

        .contentCard h2 {
          margin: 10px 0 20px;
          font-size: clamp(2rem, 3.7vw, 3.7rem);
          line-height: 1.08;
          letter-spacing: -0.045em;
          text-wrap: balance;
        }

        .sideCard h3 {
          margin: 10px 0 18px;
          font-size: 1.2rem;
        }

        .structureList {
          display: grid;
          gap: 12px;
        }

        .structureItem {
          display: grid;
          grid-template-columns: 46px 1fr;
          gap: 14px;
          padding: 16px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.018);
        }

        .structureItem > span {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #031114;
          background: var(--teal);
          font-size: 0.7rem;
          font-weight: 900;
        }

        .structureItem h3 {
          margin: 2px 0 7px;
          font-size: 1rem;
        }

        .structureItem p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .rolesGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .roleCard {
          padding: 16px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.018);
        }

        .roleCard h3 {
          margin-bottom: 8px;
          font-size: 1rem;
        }

        .roleCard p {
          margin: 0;
          color: var(--muted);
          line-height: 1.58;
        }

        .checkList,
        .boundaryList {
          display: grid;
          gap: 12px;
        }

        .checkItem,
        .boundaryItem {
          display: flex;
          gap: 11px;
          align-items: flex-start;
          padding: 14px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
          color: #dcebed;
          line-height: 1.6;
        }

        .checkItem svg {
          flex: 0 0 auto;
          margin-top: 3px;
          color: var(--teal);
        }

        .boundaryItem svg {
          flex: 0 0 auto;
          margin-top: 3px;
          color: var(--gold);
        }

        .stateList {
          display: grid;
          gap: 10px;
        }

        .stateItem {
          display: grid;
          gap: 6px;
          padding: 14px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
        }

        .stateItem strong {
          color: var(--teal);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
        }

        .stateItem span {
          color: var(--muted);
          font-size: 0.82rem;
          line-height: 1.5;
        }

        .proofCard {
          border-color: rgba(255, 216, 120, 0.22);
          background:
            radial-gradient(circle at 0 0, rgba(255, 216, 120, 0.08), transparent 28%),
            linear-gradient(145deg, rgba(35, 30, 18, 0.72), rgba(15, 18, 22, 0.95));
        }

        .chipList {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(103, 224, 223, 0.16);
          border-radius: 999px;
          color: #dcebed;
          background: rgba(103, 224, 223, 0.06);
          font-size: 0.76rem;
          line-height: 1.4;
        }

        .layerList {
          display: grid;
          gap: 9px;
        }

        .layerList > div {
          display: grid;
          gap: 4px;
          padding: 11px 12px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.018);
        }

        .layerList strong {
          color: var(--teal);
          font-size: 0.76rem;
        }

        .layerList span {
          color: var(--muted);
          font-size: 0.74rem;
        }

        .governanceCard {
          border-color: rgba(188, 164, 255, 0.2);
          background:
            radial-gradient(circle at 0 0, rgba(188, 164, 255, 0.1), transparent 28%),
            linear-gradient(145deg, rgba(22, 23, 45, 0.84), rgba(4, 18, 27, 0.95));
        }

        .governanceCard p {
          margin: 0;
          color: #c2bad8;
          line-height: 1.65;
        }

        .requestPanel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 0.42fr);
          gap: 44px;
          align-items: center;
          padding: 34px;
          border: 1px solid var(--border-strong);
          border-radius: 28px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.12), transparent 26%),
            linear-gradient(145deg, rgba(9, 32, 44, 0.9), rgba(4, 17, 25, 0.96));
        }

        .requestPanel h2,
        .finalPanel h2 {
          margin: 10px 0 16px;
          font-size: clamp(2.2rem, 4.4vw, 4.6rem);
          line-height: 1.05;
          letter-spacing: -0.05em;
          text-wrap: balance;
        }

        .requestPanel p,
        .finalPanel p {
          color: var(--muted);
          font-size: 1.02rem;
          line-height: 1.75;
        }

        .requestRequirements {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 26px;
        }

        .requestRequirements > div {
          display: flex;
          gap: 9px;
          align-items: center;
          padding: 11px 12px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.018);
          color: #dcebed;
          font-size: 0.78rem;
        }

        .requestRequirements svg {
          flex: 0 0 auto;
          color: var(--teal);
        }

        .requestAction {
          display: grid;
          gap: 12px;
          padding: 22px;
          border: 1px solid rgba(255, 216, 120, 0.2);
          border-radius: 20px;
          background: rgba(255, 216, 120, 0.05);
        }

        .requestAction > span {
          color: var(--gold);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.13em;
        }

        .requestAction button {
          min-height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          color: #789098;
          background: rgba(255, 255, 255, 0.035);
          font-weight: 800;
          cursor: not-allowed;
        }

        .requestAction small {
          color: #a99f87;
          line-height: 1.5;
        }

        .finalSection {
          padding: 60px 0 80px;
        }

        .finalPanel {
          display: grid;
          gap: 30px;
          padding: 42px;
          border: 1px solid var(--border-strong);
          border-radius: 30px;
          background:
            radial-gradient(circle at 86% 12%, rgba(98, 169, 255, 0.13), transparent 32%),
            radial-gradient(circle at 10% 88%, rgba(103, 224, 223, 0.12), transparent 32%),
            linear-gradient(145deg, rgba(8, 30, 42, 0.95), rgba(3, 15, 23, 0.98));
        }

        .finalPanel p {
          max-width: 820px;
          margin: 0;
        }

        .maxim {
          padding-top: 24px;
          border-top: 1px solid rgba(118, 213, 220, 0.14);
          color: var(--teal);
          font-size: 0.84rem;
          font-weight: 850;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.09;
            transform: scale(0.92);
          }
          50% {
            opacity: 0.17;
            transform: scale(1.08);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

        @media (max-width: 980px) {
          .heroGrid,
          .twoColumnLayout,
          .requestPanel {
            grid-template-columns: 1fr;
          }

          .sideColumn {
            position: static;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .pageShell {
            width: min(100% - 24px, 1160px);
          }

          .heroSection {
            padding-top: 56px;
          }

          .backLink {
            margin-bottom: 38px;
          }

          .sectionBlock {
            padding: 78px 0;
          }

          .sideColumn,
          .rolesGrid,
          .requestRequirements {
            grid-template-columns: 1fr;
          }

          .contentCard {
            padding: 23px 19px;
          }

          .requestPanel,
          .finalPanel {
            padding: 28px 22px;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: clamp(2.8rem, 16vw, 4.2rem);
          }

          .heroActions,
          .finalActions {
            flex-direction: column;
            align-items: stretch;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          .structureItem {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </main>
  );
}
