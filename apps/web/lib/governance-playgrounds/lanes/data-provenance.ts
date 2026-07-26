import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 Data Provenance Governance Playground
 *
 * Tests whether governed data remains identifiable, attributable, authorized,
 * traceable, transformed within declared rules, preserved without silent
 * substitution, and valid for the use that depends upon it.
 *
 * Governing principle:
 * No admissible evidence. No admissible execution.
 */

export const DATA_PROVENANCE_GATE_IDS = [
  "G01_ROUTE_IDENTITY",
  "G02_GOVERNANCE_CLAIM",
  "G03_SCOPE_BOUNDARY",
  "G04_ACTOR_IDENTITY",
  "G05_EVIDENCE_SUFFICIENCY",
  "G06_AUTHORITY_VALIDITY",
  "G07_RULE_CONTROL_BINDING",
  "G08_DEPENDENCY_INTEGRITY",
  "G09_HUMAN_OVERSIGHT",
  "G10_EXECUTION_CONSTRAINT",
  "G11_INTERVENTION_ESCALATION",
  "G12_RECORD_CONTINUITY",
  "G13_OUTCOME_CORRESPONDENCE",
  "G14_REPLAY_CONTINUING_VALIDITY",
] as const satisfies readonly SharedGateId[];

export const DATA_PROVENANCE_EVIDENCE_TYPES = [
  "GOVERNANCE_CLAIM_SUPPORT",
  "DATASET_IDENTITY",
  "DATA_SOURCE_RECORD",
  "SOURCE_AUTHORITY",
  "COLLECTION_RECORD",
  "COLLECTION_AUTHORITY",
  "CONSENT_RECORD",
  "PERMITTED_USE_RECORD",
  "DATA_LINEAGE",
  "CHAIN_OF_CUSTODY",
  "TRANSFORMATION_RECORD",
  "NORMALIZATION_RECORD",
  "LABELING_RECORD",
  "QUALITY_ASSESSMENT",
  "INTEGRITY_CHECK_RESULT",
  "SCHEMA_RECORD",
  "RETENTION_RECORD",
  "DELETION_RECORD",
  "ACCESS_RECORD",
  "EXPORT_RECORD",
  "PROVENANCE_CONFLICT_RECORD",
  "CHANGE_RECORD",
  "HUMAN_REVIEW_RECORD",
  "REPLAY_RESULT",
] as const;

export type DataProvenanceEvidenceType =
  (typeof DATA_PROVENANCE_EVIDENCE_TYPES)[number];

export const DATA_PROVENANCE_SECTIONS = [
  {
    sectionId: "data-identity",
    title: "Data Identity",
    description:
      "Identify the exact dataset, record collection, stream, package, version, owner, and governed use being tested.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Provenance route title",
        description: "A specific name for this data provenance route.",
        type: "text",
        required: true,
        placeholder: "Customer eligibility dataset provenance review",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Route description",
        description:
          "Describe the data from origin through collection, transformation, use, preservation, and retirement.",
        type: "textarea",
        required: true,
        placeholder:
          "Describe where the data originated, who collected it, what transformations occurred, who relies on it, and what decision or system it supports.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "datasetName",
        label: "Dataset or record collection name",
        type: "text",
        required: true,
        placeholder: "customer-eligibility-records",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "datasetIdentifier",
        label: "Stable dataset identifier",
        description:
          "A stable identifier for the exact dataset, stream, corpus, file set, table, or record collection.",
        type: "text",
        required: true,
        placeholder: "dataset:customer-eligibility:2026-07",
        validation: { minLength: 3, maxLength: 300 },
      },
      {
        key: "datasetVersion",
        label: "Dataset version",
        type: "text",
        required: true,
        placeholder: "2026.07.1",
        validation: { minLength: 1, maxLength: 120 },
      },
      {
        key: "dataOwner",
        label: "Declared data owner or steward",
        type: "text",
        required: true,
        placeholder: "Data Governance Office",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "dataClass",
        label: "Data class",
        type: "select",
        required: true,
        options: [
          { value: "operational", label: "Operational data" },
          { value: "transactional", label: "Transactional data" },
          { value: "personal", label: "Personal data" },
          { value: "sensitive-personal", label: "Sensitive personal data" },
          { value: "regulated", label: "Regulated data" },
          { value: "training", label: "Training data" },
          { value: "evaluation", label: "Evaluation data" },
          { value: "retrieval", label: "Retrieval or reference data" },
          { value: "sensor", label: "Sensor or telemetry data" },
          { value: "synthetic", label: "Synthetic data" },
          { value: "mixed", label: "Mixed data class" },
          { value: "other", label: "Other" },
        ],
      },
      {
        key: "governedUse",
        label: "Governed downstream use",
        type: "textarea",
        required: true,
        placeholder:
          "State the model, decision, workflow, report, record, or execution route that depends on this data.",
        validation: { minLength: 10, maxLength: 3000 },
      },
    ],
  },
  {
    sectionId: "claim-boundary",
    title: "Governance Claim and Boundary",
    description:
      "State what the provenance record claims to establish, the boundary of that claim, and what remains unproven.",
    order: 20,
    fields: [
      {
        key: "governanceClaim",
        label: "Data provenance governance claim",
        type: "textarea",
        required: true,
        placeholder:
          "This route establishes the identity, origin, authority, chain of custody, transformation history, integrity, and permitted use of the identified dataset.",
        validation: { minLength: 20, maxLength: 3500 },
      },
      {
        key: "provenanceClaims",
        label: "Claimed provenance properties",
        type: "multiselect",
        required: true,
        options: [
          { value: "identity", label: "Dataset identity" },
          { value: "origin", label: "Source origin" },
          { value: "authority", label: "Collection authority" },
          { value: "consent", label: "Consent or permission" },
          { value: "lineage", label: "Lineage" },
          { value: "custody", label: "Chain of custody" },
          { value: "transformations", label: "Transformation history" },
          { value: "quality", label: "Quality assessment" },
          { value: "integrity", label: "Integrity" },
          { value: "permitted-use", label: "Permitted use" },
          { value: "retention", label: "Retention and deletion" },
          { value: "continuing-validity", label: "Continuing validity" },
        ],
      },
      {
        key: "inScope",
        label: "In scope",
        type: "textarea",
        required: true,
        placeholder:
          "Sources, records, fields, populations, jurisdictions, collection periods, transformations, systems, and uses included.",
        validation: { minLength: 10, maxLength: 4000 },
      },
      {
        key: "outOfScope",
        label: "Out of scope",
        type: "textarea",
        required: true,
        placeholder:
          "Excluded sources, fields, populations, time periods, transformations, jurisdictions, inferred attributes, and downstream uses.",
        validation: { minLength: 10, maxLength: 4000 },
      },
      {
        key: "explicitNonClaims",
        label: "Explicit non-claims",
        description:
          "State what this provenance route does not establish.",
        type: "textarea",
        required: true,
        placeholder:
          "This route does not prove that every record is factually correct, unbiased, complete, lawful in every jurisdiction, or suitable for an undeclared downstream use.",
        validation: { minLength: 10, maxLength: 3500 },
      },
      {
        key: "jurisdictions",
        label: "Jurisdictions and regulatory contexts",
        type: "textarea",
        required: true,
        placeholder:
          "List the jurisdictions, contractual regimes, sector rules, and internal policies relevant to collection, use, transfer, retention, and deletion.",
        validation: { minLength: 2, maxLength: 3000 },
      },
    ],
  },
  {
    sectionId: "sources-authority",
    title: "Sources, Collection, and Authority",
    description:
      "Identify each material source, who supplied or collected it, under what authority, and for what permitted purpose.",
    order: 30,
    fields: [
      {
        key: "dataSources",
        label: "Material data sources",
        type: "json",
        required: true,
        placeholder:
          '[{"sourceId":"source-1","type":"first-party-system","owner":"operations","collectionMethod":"transaction record"}]',
      },
      {
        key: "sourceAuthorityRecords",
        label: "Source authority records",
        type: "json",
        required: true,
        placeholder:
          '[{"sourceId":"source-1","authority":"service agreement","scope":"eligibility processing","validUntil":"2027-01-01T00:00:00Z"}]',
      },
      {
        key: "collectionMethods",
        label: "Collection methods",
        type: "json",
        required: true,
        placeholder:
          '[{"sourceId":"source-1","method":"direct collection","system":"intake-portal","automated":true}]',
      },
      {
        key: "consentAndPermissionRecords",
        label: "Consent, notice, license, or permission records",
        type: "json",
        required: true,
        placeholder:
          '[{"recordId":"permission-1","basis":"contractual permission","scope":"declared operational use","revocable":true}]',
      },
      {
        key: "permittedUses",
        label: "Permitted uses",
        type: "json",
        required: true,
        placeholder:
          '[{"use":"eligibility determination support","sourceIds":["source-1"],"conditions":["human review"]}]',
      },
      {
        key: "prohibitedUses",
        label: "Prohibited or unsupported uses",
        type: "json",
        required: true,
        placeholder:
          '[{"use":"marketing profiling","reason":"not authorized by source permission"}]',
      },
      {
        key: "sourceVerificationMethod",
        label: "Source verification method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how each source identity, provider, authority, collection method, and delivery record is verified.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
  {
    sectionId: "lineage-custody",
    title: "Lineage and Chain of Custody",
    description:
      "Trace how the data moved, who handled it, where custody changed, and whether continuity remained intact.",
    order: 40,
    fields: [
      {
        key: "lineageMap",
        label: "End-to-end lineage map",
        type: "json",
        required: true,
        placeholder:
          '[{"step":1,"from":"source-system","to":"landing-zone","operation":"ingest","actor":"pipeline-1"}]',
      },
      {
        key: "custodyEvents",
        label: "Chain-of-custody events",
        type: "json",
        required: true,
        placeholder:
          '[{"eventId":"custody-1","holder":"data-platform","receivedAt":"2026-07-25T12:00:00Z","integrityCheck":"passed"}]',
      },
      {
        key: "storageLocations",
        label: "Storage locations and systems",
        type: "json",
        required: true,
        placeholder:
          '[{"system":"governed-data-store","region":"us-east","encryption":"enabled","approved":true}]',
      },
      {
        key: "accessRoles",
        label: "Authorized access roles",
        type: "json",
        required: true,
        placeholder:
          '[{"role":"data-steward","permissions":["read","approve-correction"],"scope":"dataset-version"}]',
      },
      {
        key: "transferControls",
        label: "Transfer and export controls",
        type: "json",
        required: true,
        placeholder:
          '[{"transfer":"internal-system-to-model-service","control":"approved service identity","failure":"HOLD"}]',
      },
      {
        key: "continuityVerification",
        label: "Continuity verification method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe checksums, signatures, immutable logs, reconciliation, sequence controls, and exception handling used to detect breaks in custody.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
  {
    sectionId: "transformations-quality",
    title: "Transformations, Quality, and Integrity",
    description:
      "Declare every material transformation and test whether the resulting data remains traceable, bounded, and fit for the declared use.",
    order: 50,
    fields: [
      {
        key: "transformationHistory",
        label: "Transformation history",
        type: "json",
        required: true,
        placeholder:
          '[{"step":1,"operation":"normalize-date","inputVersion":"raw-1","outputVersion":"normalized-1","codeVersion":"etl-4.2"}]',
      },
      {
        key: "derivedFields",
        label: "Derived, inferred, or labeled fields",
        type: "json",
        required: true,
        placeholder:
          '[{"field":"eligibility-band","derivation":"rule-set-3","reviewed":true,"reversible":false}]',
      },
      {
        key: "qualityDimensions",
        label: "Quality dimensions and thresholds",
        type: "json",
        required: true,
        placeholder:
          '[{"dimension":"completeness","metric":"required-field-present-rate","threshold":0.99,"failure":"HOLD"}]',
      },
      {
        key: "integrityControls",
        label: "Integrity controls",
        type: "json",
        required: true,
        placeholder:
          '[{"control":"record-count reconciliation","enforcementPoint":"post-transform","failure":"HOLD"}]',
      },
      {
        key: "errorAndCorrectionPolicy",
        label: "Error detection and correction policy",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how errors are detected, challenged, corrected, approved, versioned, and preserved without overwriting prior records.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "transformationBoundary",
        label: "Transformation authority boundary",
        type: "textarea",
        required: true,
        placeholder:
          "State which transformations are approved, who may perform them, and which changes require reauthorization or replay.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
  {
    sectionId: "oversight-intervention",
    title: "Oversight, Challenge, and Intervention",
    description:
      "Define who reviews provenance, how disputes are handled, and how unauthorized or corrupted data is stopped from continuing downstream.",
    order: 60,
    fields: [
      {
        key: "humanOversightRequired",
        label: "Human provenance oversight required",
        type: "boolean",
        required: true,
        defaultValue: true,
      },
      {
        key: "oversightActors",
        label: "Oversight actors",
        type: "json",
        required: true,
        appliesWhen: [
          {
            ruleId: "DATA-OVERSIGHT-01",
            description: "Required when human oversight is enabled.",
            field: "humanOversightRequired",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '[{"actorId":"steward-1","role":"data steward","qualification":"provenance review","independent":true}]',
      },
      {
        key: "challengeProcess",
        label: "Challenge and counterevidence process",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how provenance, authority, quality, transformation, or ownership claims may be challenged and resolved.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "interventionPowers",
        label: "Intervention powers",
        type: "multiselect",
        required: true,
        appliesWhen: [
          {
            ruleId: "DATA-OVERSIGHT-02",
            description: "Required when human oversight is enabled.",
            field: "humanOversightRequired",
            operator: "equals",
            expected: true,
          },
        ],
        options: [
          { value: "inspect", label: "Inspect provenance evidence" },
          { value: "hold", label: "Place dataset or route on HOLD" },
          { value: "deny", label: "DENY downstream use" },
          { value: "quarantine", label: "Quarantine affected data" },
          { value: "correct", label: "Request correction" },
          { value: "revoke", label: "Revoke permission or authority" },
          { value: "rollback", label: "Restore prior governed version" },
          { value: "escalate", label: "Escalate for independent review" },
        ],
      },
      {
        key: "quarantineProcedure",
        label: "Quarantine and containment procedure",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how affected data is isolated, downstream propagation is stopped, evidence is preserved, and authorized users are notified.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "conflictResolutionAuthority",
        label: "Conflict resolution authority",
        type: "json",
        required: true,
        placeholder:
          '[{"holder":"data-governance-panel","scope":"resolve provenance conflicts","cannotWaive":["unknown source","revoked authority"]}]',
      },
    ],
  },
  {
    sectionId: "records-retention-replay",
    title: "Records, Retention, and Replay",
    description:
      "Define what must be preserved, how long validity continues, and which material changes require a new provenance determination.",
    order: 70,
    fields: [
      {
        key: "recordPlan",
        label: "Provenance record preservation plan",
        type: "json",
        required: true,
        placeholder:
          '["DATASET_IDENTITY","DATA_SOURCE_RECORD","DATA_LINEAGE","TRANSFORMATION_RECORD","TA14_BOUNDED_DETERMINATION"]',
      },
      {
        key: "retentionPolicy",
        label: "Retention policy",
        type: "textarea",
        required: true,
        placeholder:
          "State retention periods, legal holds, archival rules, deletion authority, and proof of deletion requirements.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "validityWindow",
        label: "Provenance determination validity window",
        type: "text",
        required: true,
        placeholder:
          "Valid until source, authority, schema, transformation, permitted use, custody, or dataset version materially changes",
        validation: { minLength: 3, maxLength: 700 },
      },
      {
        key: "replayTriggers",
        label: "Mandatory replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["source change","authority expiration","consent revocation","schema change","transformation change","custody break","integrity failure","new downstream use"]',
      },
      {
        key: "driftMonitoringPlan",
        label: "Provenance drift monitoring plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how changes in source, volume, schema, fields, authority, consent, custody, transformations, quality, and use are detected.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "continuingValidityMethod",
        label: "Continuing validity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how downstream systems verify that the current data package still matches the approved provenance record before use.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const DATA_PROVENANCE_SCENARIOS = [
  {
    scenarioId: "DATA-BASELINE-ALLOW",
    laneId: "data-provenance",
    title: "Approved data provenance baseline",
    description:
      "The dataset identity, sources, authority, lineage, custody, transformations, integrity, permitted use, oversight, and records are complete and current.",
    scenarioClass: "BASELINE",
    required: true,
    preconditions: [],
    injections: [],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "PASS",
      G02_GOVERNANCE_CLAIM: "PASS",
      G03_SCOPE_BOUNDARY: "PASS",
      G04_ACTOR_IDENTITY: "PASS",
      G05_EVIDENCE_SUFFICIENCY: "PASS",
      G06_AUTHORITY_VALIDITY: "PASS",
      G07_RULE_CONTROL_BINDING: "PASS",
      G08_DEPENDENCY_INTEGRITY: "PASS",
      G09_HUMAN_OVERSIGHT: "PASS",
      G10_EXECUTION_CONSTRAINT: "PASS",
      G11_INTERVENTION_ESCALATION: "PASS",
      G12_RECORD_CONTINUITY: "PASS",
      G14_REPLAY_CONTINUING_VALIDITY: "PASS",
    },
    expectedDetermination: "ALLOW",
    recoveryRequirements: [],
  },
  {
    scenarioId: "DATA-UNKNOWN-SOURCE",
    laneId: "data-provenance",
    title: "Material data source cannot be identified",
    description:
      "A material portion of the dataset lacks a verifiable origin, provider, collection record, or source identifier.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DATA-UNKNOWN-SOURCE-I01",
        title: "Remove source identity",
        description:
          "Remove the source identity and collection record for a material dataset component.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "dataSources",
        value: "unknown-material-source",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Identify and verify the material source.",
      "Preserve the unknown-source finding.",
      "Remove or quarantine unsupported records until provenance is established.",
    ],
  },
  {
    scenarioId: "DATA-AUTHORITY-EXPIRES",
    laneId: "data-provenance",
    title: "Collection or use authority expires",
    description:
      "The source was previously authorized, but the collection, license, consent, or permitted-use authority is no longer valid.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DATA-AUTHORITY-EXPIRES-I01",
        title: "Expire source authority",
        description:
          "Advance time beyond the validity of a material source authority or permission record.",
        mutationType: "REVOKE_AUTHORITY",
        target: "sourceAuthorityRecords",
      },
    ],
    expectedGateStatuses: {
      G06_AUTHORITY_VALIDITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Stop new collection or downstream use covered by the expired authority.",
      "Obtain renewed authority or remove affected data.",
      "Replay the provenance route before continuing use.",
    ],
  },
  {
    scenarioId: "DATA-CONSENT-REVOKED",
    laneId: "data-provenance",
    title: "Consent or permission is revoked",
    description:
      "A valid consent, permission, license, or contractual basis is withdrawn for a material subset of the data.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DATA-CONSENT-REVOKED-I01",
        title: "Revoke permission",
        description:
          "Mark a material consent or permission record as revoked before downstream use.",
        mutationType: "REVOKE_AUTHORITY",
        target: "consentAndPermissionRecords",
      },
    ],
    expectedGateStatuses: {
      G03_SCOPE_BOUNDARY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Quarantine or remove affected records.",
      "Preserve the revocation and downstream impact record.",
      "Rebuild and replay the governed dataset if continued use is permitted.",
    ],
  },
  {
    scenarioId: "DATA-CUSTODY-BREAK",
    laneId: "data-provenance",
    title: "Chain of custody contains an unexplained gap",
    description:
      "The dataset moves between systems or holders without a complete transfer, receipt, or integrity record.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DATA-CUSTODY-BREAK-I01",
        title: "Remove custody event",
        description:
          "Delete or invalidate a material receipt or transfer event in the custody chain.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "custodyEvents",
        value: "material-custody-gap",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G12_RECORD_CONTINUITY: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Quarantine the affected dataset version.",
      "Reconstruct the custody chain from preserved evidence where possible.",
      "Reject or replace records whose continuity cannot be established.",
    ],
  },
  {
    scenarioId: "DATA-UNAUTHORIZED-TRANSFORMATION",
    laneId: "data-provenance",
    title: "Unauthorized transformation changes material data",
    description:
      "A transformation, derivation, label, normalization, deletion, or aggregation occurs outside the approved transformation boundary.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DATA-UNAUTHORIZED-TRANSFORMATION-I01",
        title: "Introduce unapproved transformation",
        description:
          "Add a material transformation that was not declared, authorized, or preserved.",
        mutationType: "CHANGE_DATA",
        target: "transformationHistory",
        value: "unapproved-material-transformation",
      },
    ],
    expectedGateStatuses: {
      G06_AUTHORITY_VALIDITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Stop use of the altered dataset.",
      "Restore the last governed version or rebuild from verified source data.",
      "Authorize and document any necessary new transformation before replay.",
    ],
  },
  {
    scenarioId: "DATA-DATASET-SUBSTITUTION",
    laneId: "data-provenance",
    title: "Dataset is silently substituted",
    description:
      "A downstream route receives a dataset or version different from the one whose provenance was approved.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DATA-DATASET-SUBSTITUTION-I01",
        title: "Substitute dataset version",
        description:
          "Replace the governed dataset identifier or version with a different package before downstream use.",
        mutationType: "CHANGE_DATA",
        target: "datasetVersion",
        value: "substituted-unevaluated-version",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Block the substituted dataset.",
      "Preserve the approved and actual dataset identities separately.",
      "Run a new provenance route for the substituted version if it is required.",
    ],
  },
  {
    scenarioId: "DATA-INTEGRITY-FAILURE",
    laneId: "data-provenance",
    title: "Integrity verification fails",
    description:
      "Checksums, signatures, reconciliation, record counts, schema checks, or other integrity controls detect material corruption or unexplained change.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DATA-INTEGRITY-FAILURE-I01",
        title: "Fail integrity check",
        description:
          "Alter the dataset so a mandatory integrity control no longer passes.",
        mutationType: "CHANGE_DATA",
        target: "integrityControls",
        value: "mandatory-integrity-check-failed",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Quarantine the failed dataset version.",
      "Identify the corruption point and affected records.",
      "Restore or regenerate the dataset from verified evidence and replay.",
    ],
  },
  {
    scenarioId: "DATA-PROVENANCE-CONFLICT",
    laneId: "data-provenance",
    title: "Material provenance records conflict",
    description:
      "Two current evidence sources materially disagree about origin, ownership, authority, transformation, custody, or permitted use.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DATA-PROVENANCE-CONFLICT-I01",
        title: "Create provenance conflict",
        description:
          "Introduce a second credible provenance record that contradicts a material claim.",
        mutationType: "CREATE_EVIDENCE_CONFLICT",
        target: "sourceAuthorityRecords",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "ESCALATED",
      G06_AUTHORITY_VALIDITY: "ESCALATED",
      G12_RECORD_CONTINUITY: "PASS",
    },
    expectedDetermination: "ESCALATE",
    recoveryRequirements: [
      "Preserve both conflicting provenance positions and their evidence.",
      "Assign an authorized independent reviewer.",
      "Resolve the conflict or explicitly restrict the affected data and use.",
    ],
  },
  {
    scenarioId: "DATA-OUT-OF-SCOPE-USE",
    laneId: "data-provenance",
    title: "Data is proposed for an undeclared downstream use",
    description:
      "Data collected and governed for one purpose is proposed for a materially different model, decision, profiling, transfer, or execution use.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DATA-OUT-OF-SCOPE-USE-I01",
        title: "Change downstream use",
        description:
          "Alter the governed use beyond the declared permitted-use boundary.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "governedUse",
        value: "undeclared-downstream-use",
      },
    ],
    expectedGateStatuses: {
      G02_GOVERNANCE_CLAIM: "FAIL",
      G03_SCOPE_BOUNDARY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Return the use to the approved boundary or create a new provenance route.",
      "Obtain authority and permission appropriate to the new use.",
    ],
  },
  {
    scenarioId: "DATA-HUMAN-CANNOT-INTERVENE",
    laneId: "data-provenance",
    title: "Data steward cannot quarantine or stop use",
    description:
      "Human oversight is represented, but the designated steward lacks timely authority or technical ability to quarantine data or stop downstream use.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DATA-HUMAN-CANNOT-INTERVENE-I01",
        title: "Block provenance intervention",
        description:
          "Prevent the designated steward from placing the dataset on HOLD or quarantining affected records.",
        mutationType: "BLOCK_HUMAN_INTERVENTION",
        target: "interventionPowers",
      },
    ],
    expectedGateStatuses: {
      G09_HUMAN_OVERSIGHT: "FAIL",
      G11_INTERVENTION_ESCALATION: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Grant and test real quarantine and downstream-stop authority.",
      "Verify that affected uses fail closed during steward unavailability.",
    ],
  },
  {
    scenarioId: "DATA-POST-ALLOW-DRIFT",
    laneId: "data-provenance",
    title: "Provenance materially drifts after approval",
    description:
      "Source mix, schema, field meaning, population, collection method, transformation, or retention condition changes after the original determination.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DATA-POST-ALLOW-DRIFT-I01",
        title: "Introduce provenance drift",
        description:
          "Change a material source, schema, field meaning, collection method, or transformation after approval.",
        mutationType: "CHANGE_DATA",
        target: "lineageMap",
        value: "material-provenance-drift",
      },
    ],
    expectedGateStatuses: {
      G03_SCOPE_BOUNDARY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Preserve the original and changed provenance state.",
      "Re-evaluate affected sources, transformations, permissions, and downstream uses.",
      "Issue a new bounded determination.",
    ],
  },
  {
    scenarioId: "DATA-RECOVERY-REPLAY",
    laneId: "data-provenance",
    title: "Corrected provenance recovery and replay",
    description:
      "A prior failed or held provenance route is corrected, preserved, replayed, and issued as a new determination without overwriting the original result.",
    scenarioClass: "RECOVERY",
    required: true,
    preconditions: [],
    injections: [],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "PASS",
      G03_SCOPE_BOUNDARY: "PASS",
      G05_EVIDENCE_SUFFICIENCY: "PASS",
      G06_AUTHORITY_VALIDITY: "PASS",
      G07_RULE_CONTROL_BINDING: "PASS",
      G08_DEPENDENCY_INTEGRITY: "PASS",
      G09_HUMAN_OVERSIGHT: "PASS",
      G10_EXECUTION_CONSTRAINT: "PASS",
      G11_INTERVENTION_ESCALATION: "PASS",
      G12_RECORD_CONTINUITY: "PASS",
      G14_REPLAY_CONTINUING_VALIDITY: "PASS",
    },
    expectedDetermination: "ALLOW",
    recoveryRequirements: [
      "Preserve the original failed or held provenance result.",
      "Link the corrected dataset and evidence package to the prior version.",
      "Issue a new determination rather than editing the original record.",
    ],
  },
] as const satisfies readonly ScenarioDefinition[];

export type DataProvenanceScenario =
  (typeof DATA_PROVENANCE_SCENARIOS)[number];

export const DATA_PROVENANCE_LANE = {
  laneId: "data-provenance",
  name: "Data Provenance Governance Playground",
  shortName: "Data Provenance",
  description:
    "Test whether governed data remains identifiable, attributable, authorized, traceable, intact, permitted for its declared use, challengeable, and continuously valid from source through downstream use and replay.",
  claimsGoverned: [
    "The exact dataset, version, source composition, and governed use are identified.",
    "Material data sources possess attributable origin and valid collection or use authority.",
    "Consent, permission, license, and permitted-use boundaries are explicit and reviewable.",
    "Lineage and chain of custody remain continuous from source through transformation and downstream delivery.",
    "Material transformations, derivations, labels, corrections, and deletions are authorized and preserved.",
    "Quality and integrity controls are bound to explicit thresholds and failure responses.",
    "Material source, authority, schema, custody, transformation, population, or use changes invalidate prior approval until replay.",
    "Conflicts, corrections, supersession, retention, deletion, and recovery remain preserved without overwriting prior records.",
  ],
  nonClaims: [
    "This lane does not prove that every data value is factually correct, complete, unbiased, or suitable for every possible use.",
    "This lane does not independently prove privacy compliance, cybersecurity, legal ownership, intellectual-property validity, or regulatory compliance unless separately evidenced and tested.",
    "A verified source does not establish that all downstream inferences or decisions are valid.",
    "This lane does not prove that a model, agent, or decision system used the data correctly.",
    "An ALLOW determination applies only to the tested dataset, version, sources, permissions, custody, transformations, use, time, and evaluator version.",
  ],
  sections: DATA_PROVENANCE_SECTIONS,
  gateIds: DATA_PROVENANCE_GATE_IDS,
  evidenceTypes: [...DATA_PROVENANCE_EVIDENCE_TYPES],
  scenarioIds: DATA_PROVENANCE_SCENARIOS.map(
    (scenario) => scenario.scenarioId,
  ),
  determinationGuidance: [
    "DENY when a material source is unknown, the dataset is substituted, a prohibited use is requested, or an explicit provenance or authority boundary is violated.",
    "ESCALATE when material source, ownership, authority, custody, transformation, or permitted-use evidence conflicts require independent judgment.",
    "HOLD when mandatory provenance evidence, authority, consent, custody, integrity, oversight, correction, retention, or replay requirements remain incomplete, expired, or failed.",
    "ALLOW only when all applicable mandatory gates pass and all required scenarios demonstrate the expected bounded behavior.",
  ],
  enabled: true,
  version: "1.0.0",
} as const satisfies LaneDefinition;

export function getDataProvenanceScenario(
  scenarioId: string,
): DataProvenanceScenario | undefined {
  return DATA_PROVENANCE_SCENARIOS.find(
    (scenario) => scenario.scenarioId === scenarioId,
  );
}
