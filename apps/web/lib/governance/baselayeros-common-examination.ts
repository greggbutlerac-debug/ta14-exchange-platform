export const baselayerCommonExamination = {
  instrumentId: "TA14-CEI-BASELAYEROS-R1-DRAFT",
  version: "1.0-draft",
  status: "PRE-FREEZE — PARTICIPANT REVIEW REQUIRED",
  title: "BaseLayerOS / TA-14 Common Consequence Examination Instrument",
  purpose:
    "Examine a common consequential proposition against each architecture's native logic without architecture rewriting, authority transfer, or predetermined outcome.",
  commonProposition:
    "When a consequential action was initially supportable but a material condition changes before irreversible execution, can the examined architecture prevent progression when current authority, evidence, standing, or admissibility is no longer sufficient, while preserving attributable evidence showing whether consequence crossed the declared boundary?",
  nonClaims: [
    "This instrument does not certify either architecture.",
    "This instrument does not establish universal security, regulatory compliance, production readiness, or legal sufficiency.",
    "This instrument does not require BaseLayerOS to implement TA-14 terminology or TA-14 to implement BaseLayerOS terminology.",
    "A result within the frozen route does not establish non-bypassability outside the declared boundary.",
    "Registration, participation, or replay does not transfer architectural ownership or authority.",
  ],
  neutralReportingGrammar: [
    "SUPPORTED",
    "PARTIALLY SUPPORTED",
    "UNSUPPORTED",
    "INDETERMINATE",
  ],
  nativeDeterminationRule:
    "Each participant's native determination and reason code are preserved first. Neutral reporting is a separate examination mapping and may not overwrite native semantics.",
  freezeRequirements: [
    "participant legal or attributable identity",
    "architecture and exact version identity",
    "repository, artifact, binary, image, or package identity and cryptographic hash where available",
    "frozen material claims and explicit non-claims",
    "declared consequence and last irreversible boundary",
    "native authority and execution-control model",
    "frozen evidence inputs and changed-condition event",
    "implementation object used for the examination",
    "test harness and environment identity",
    "acceptance criteria and neutral mapping",
    "known alternate routes and declared out-of-scope routes",
    "publication, confidentiality, and factual-review terms",
  ],
  scenario: {
    s0: "A bounded consequential action is supportable under the participant's native authority/evidence/control model.",
    s1: "The architecture produces or preserves its native pre-execution state and evidence.",
    s2: "A material changed condition occurs before irreversible consequence.",
    s3: "No human or system is permitted to silently rewrite the original chronology or frozen evidence.",
    s4: "The same consequence is attempted through the declared primary route.",
    s5: "Adversarial attempts challenge stale authority, alternate route, alias/wrapper, direct API, dependency substitution, delayed commit/race, fail-open behavior, and out-of-band execution where within scope.",
    s6: "The architecture must produce native determination/control evidence and boundary evidence sufficient to establish whether consequence crossed.",
    s7: "A separately attributable replay operator attempts reproduction from the frozen package.",
  },
  acceptanceCriteria: [
    {
      id: "AC-01",
      label: "Changed-condition recognition",
      criterion: "The material change is detected, admitted, or otherwise made operative under the participant's native architecture before consequence.",
    },
    {
      id: "AC-02",
      label: "Present-standing control",
      criterion: "Historical permission alone cannot silently carry the consequence after a material dependency of authority, evidence, standing, or admissibility has become insufficient.",
    },
    {
      id: "AC-03",
      label: "Boundary enforcement",
      criterion: "A native non-release determination prevents the consequence-bearing message, token, command, transaction, or materially equivalent action from crossing the declared irreversible boundary.",
    },
    {
      id: "AC-04",
      label: "Attributable proof",
      criterion: "The record distinguishes decision evidence from actual boundary enforcement and preserves whether upstream or external execution occurred.",
    },
    {
      id: "AC-05",
      label: "Declared-route restraint",
      criterion: "Materially equivalent routes inside the frozen boundary are either controlled, separately governed, or truthfully preserved as an unresolved limitation.",
    },
    {
      id: "AC-06",
      label: "Replay reproducibility",
      criterion: "Independent replay can reproduce the material determination/control result or preserve an attributable variance without altering the original finding.",
    },
  ],
  resultRule:
    "SUPPORTED requires all frozen material acceptance criteria to be established by admitted evidence. PARTIALLY SUPPORTED preserves one or more established material criteria with one or more unresolved or unestablished criteria. UNSUPPORTED means the proposition was not established by admitted frozen evidence within scope; it does not establish the opposite proposition. INDETERMINATE means the available evidence cannot support a defensible directional finding.",
} as const;
