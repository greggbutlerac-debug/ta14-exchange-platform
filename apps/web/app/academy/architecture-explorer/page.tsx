"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AnchorId = "reality" | "record" | "continuity" | "admissibility" | "binding" | "commit" | "execution" | "outcome";
type ViewMode = "anchors" | "runtime" | "comparison" | "scenarios" | "glossary";
type RuntimeLink = { number: string; title: string; eyebrow: string; description: string; id: string; };
type SavedState = { version: "2.0"; selectedAnchor: AnchorId; selectedLink: string; completedLinks: string[]; notes: Record<string, string>; updatedAt: string; };

const STORAGE_KEY = "ta14-academy-architecture-explorer-v2";

const railItems = [
  {
    label: 'Academy Home',
    href: '/academy',
    glyph: 'AC',
    action: 'Home',
  },
  {
    label: 'Start Here',
    href: '/academy/start',
    glyph: '01',
    action: 'Begin',
  },
  {
    label: 'Mission Control',
    href: '/academy/mission-control',
    glyph: 'MC',
    action: 'Resume',
  },
  {
    label: 'Architecture Explorer',
    href: '/academy/architecture-explorer',
    glyph: 'AR',
    action: 'Inspect',
  },
  {
    label: 'Learning Routes',
    href: '/academy/routes',
    glyph: 'RT',
    action: 'Choose',
  },
  {
    label: 'Route Construction Lab',
    href: '/academy/route-construction-lab',
    glyph: 'RB',
    action: 'Build',
  },
  {
    label: 'Simulation Center',
    href: '/academy/simulator',
    glyph: 'SIM',
    action: 'Test',
  },
  {
    label: 'Review Workspace',
    href: '/academy/review',
    glyph: 'RV',
    action: 'Challenge',
  },
  {
    label: 'Assessment Center',
    href: '/academy/assessment',
    glyph: 'AS',
    action: 'Prove',
  },
  {
    label: 'Credential Dashboard',
    href: '/academy/credential-dashboard',
    glyph: 'CR',
    action: 'Advance',
  },
  {
    label: 'Credential Registry',
    href: '/academy/credential-registry',
    glyph: 'RG',
    action: 'Verify',
  },
  {
    label: 'Return to Exchange',
    href: '/',
    glyph: 'EX',
    action: 'Exit',
  },
] as const;

const anchors = [
  {
    id: 'reality' as AnchorId,
    number: '01',
    title: 'Reality',
    description: 'The condition that exists before interpretation.',
    detail: 'Reality is not a narrative preference. It is the bounded condition the route must begin from.',
  },
  {
    id: 'record' as AnchorId,
    number: '02',
    title: 'Record',
    description: 'The attributable representation of reality.',
    detail: 'The record preserves what was observed, by whom, when, where, and under what method.',
  },
  {
    id: 'continuity' as AnchorId,
    number: '03',
    title: 'Continuity',
    description: 'The unbroken connection across time and transition.',
    detail: 'Continuity prevents silent substitution, stale dependency, broken custody, and unexplained transformation.',
  },
  {
    id: 'admissibility' as AnchorId,
    number: '04',
    title: 'Admissibility',
    description: 'The right of evidence to support a determination.',
    detail: 'Evidence may exist and still be unfit for the exact decision, actor, time, scope, or consequence.',
  },
  {
    id: 'binding' as AnchorId,
    number: '05',
    title: 'Binding',
    description: 'The valid connection between determination and consequence.',
    detail: 'Authority must be valid for this action now, not merely associated with a trusted actor or role.',
  },
  {
    id: 'commit' as AnchorId,
    number: '06',
    title: 'Commit',
    description: 'The fixed approved state before action.',
    detail: 'Commit preserves the route version, boundary, conditions, dependencies, and determination that were actually approved.',
  },
  {
    id: 'execution' as AnchorId,
    number: '07',
    title: 'Execution',
    description: 'The controlled transition into real-world action.',
    detail: 'Execution must correspond to the committed state and remain admissible throughout runtime.',
  },
  {
    id: 'outcome' as AnchorId,
    number: '08',
    title: 'Outcome',
    description: 'The preserved result and consequence.',
    detail: 'Outcome evidence closes the route by showing what happened, what changed, and what remains unresolved.',
  },
] as const;

const runtimeLinks: RuntimeLink[] = [
  {
    number: '01',
    title: 'Reality',
    eyebrow: 'Observed condition',
    description: 'What exists now before interpretation enters the route.',
    id: 'reality',
  },
  {
    number: '02',
    title: 'Record',
    eyebrow: 'Preserved representation',
    description: 'What attributable artifact represents the observed condition.',
    id: 'record',
  },
  {
    number: '03',
    title: 'Identity',
    eyebrow: 'Actor and source identity',
    description: 'Who or what produced, supplied, transformed, or approved the record.',
    id: 'identity',
  },
  {
    number: '04',
    title: 'Provenance',
    eyebrow: 'Origin and lineage',
    description: 'Where the record came from and how its origin can be established.',
    id: 'provenance',
  },
  {
    number: '05',
    title: 'Time',
    eyebrow: 'Temporal validity',
    description: 'When the condition was observed and whether timing remains relevant.',
    id: 'time',
  },
  {
    number: '06',
    title: 'Custody',
    eyebrow: 'Possession and control',
    description: 'Who held or controlled the record across each material transition.',
    id: 'custody',
  },
  {
    number: '07',
    title: 'Integrity',
    eyebrow: 'Protection from alteration',
    description: 'Whether the record remained complete and resistant to silent change.',
    id: 'integrity',
  },
  {
    number: '08',
    title: 'Continuity',
    eyebrow: 'Unbroken connection',
    description: 'Whether reality, record, source, state, and decision remain connected.',
    id: 'continuity',
  },
  {
    number: '09',
    title: 'Relevance',
    eyebrow: 'Decision-specific fit',
    description: 'Whether the evidence bears directly on the exact question being decided.',
    id: 'relevance',
  },
  {
    number: '10',
    title: 'Freshness',
    eyebrow: 'Current applicability',
    description: 'Whether the evidence is current enough for the present consequence.',
    id: 'freshness',
  },
  {
    number: '11',
    title: 'Sufficiency',
    eyebrow: 'Support threshold',
    description: 'Whether enough admissible support exists to justify the determination.',
    id: 'sufficiency',
  },
  {
    number: '12',
    title: 'Conflict',
    eyebrow: 'Contradiction handling',
    description: 'Whether material disagreement has been surfaced, tested, and preserved.',
    id: 'conflict',
  },
  {
    number: '13',
    title: 'Admissibility',
    eyebrow: 'Permission to support',
    description: 'Whether the evidence may support this determination now.',
    id: 'admissibility',
  },
  {
    number: '14',
    title: 'Authority',
    eyebrow: 'Valid power to decide',
    description: 'Whether the actor has valid authority for the exact action and scope.',
    id: 'authority',
  },
  {
    number: '15',
    title: 'Boundary',
    eyebrow: 'Declared execution limit',
    description: 'Where the action begins, ends, and must not extend.',
    id: 'boundary',
  },
  {
    number: '16',
    title: 'Obligation',
    eyebrow: 'Required governing condition',
    description: 'What law, policy, standard, contract, or rule requires or limits action.',
    id: 'obligation',
  },
  {
    number: '17',
    title: 'Binding',
    eyebrow: 'Connection to consequence',
    description: 'Whether valid authority connects the determination to allowed consequence.',
    id: 'binding',
  },
  {
    number: '18',
    title: 'Determination',
    eyebrow: 'Supported decision state',
    description: 'What conclusion the evidence and authority actually support.',
    id: 'determination',
  },
  {
    number: '19',
    title: 'Commit',
    eyebrow: 'Frozen approved state',
    description: 'Which exact route, version, conditions, and dependencies are fixed.',
    id: 'commit',
  },
  {
    number: '20',
    title: 'Revalidation',
    eyebrow: 'Runtime condition check',
    description: 'Whether evidence, authority, dependencies, and boundaries still hold.',
    id: 'revalidation',
  },
  {
    number: '21',
    title: 'Execution',
    eyebrow: 'Controlled real-world action',
    description: 'What action is actually performed and by whom.',
    id: 'execution',
  },
  {
    number: '22',
    title: 'Correspondence',
    eyebrow: 'Execution-to-authorization match',
    description: 'Whether performed action matches the committed authorization.',
    id: 'correspondence',
  },
  {
    number: '23',
    title: 'Outcome',
    eyebrow: 'Observed result',
    description: 'What happened in reality after the governed action occurred.',
    id: 'outcome',
  },
  {
    number: '24',
    title: 'Preservation',
    eyebrow: 'Challengeable history',
    description: 'Whether the route, execution, and outcome remain attributable and reviewable.',
    id: 'preservation',
  },
];

const admissibilityChecks = [
  {
    title: 'Evidence current',
    description: 'Has the evidence remained sufficiently fresh for the present decision?',
  },
  {
    title: 'Authority valid',
    description: 'Does the actor still possess authority for this exact action and boundary?',
  },
  {
    title: 'Continuity preserved',
    description: 'Are identity, provenance, time, custody, and dependencies still connected?',
  },
  {
    title: 'Boundary intact',
    description: 'Has the proposed execution remained inside the approved scope?',
  },
  {
    title: 'Conflicts surfaced',
    description: 'Are contradictory records and unresolved objections visible?',
  },
  {
    title: 'Determination supported',
    description: 'Does the decision state follow from admissible evidence rather than preference?',
  },
  {
    title: 'Commit preserved',
    description: 'Can the approved version be distinguished from later edits or drift?',
  },
  {
    title: 'Runtime revalidated',
    description: 'Were material conditions checked immediately before execution?',
  },
  {
    title: 'Correspondence verified',
    description: 'Did the performed action match the authorized action?',
  },
  {
    title: 'Outcome preserved',
    description: 'Can the resulting condition be inspected and challenged later?',
  },
] as const;

const comparisons = [
  {
    topic: 'Identity',
    zeroTrust: 'Who or what is acting?',
    admissibleExecution: 'Whether this exact action is supported now.',
  },
  {
    topic: 'Access',
    zeroTrust: 'May the actor enter or use the system?',
    admissibleExecution: 'May the proposed consequence bind to reality?',
  },
  {
    topic: 'Trust posture',
    zeroTrust: 'Should the request be trusted under current controls?',
    admissibleExecution: 'Has execution earned the right to proceed under current evidence and authority?',
  },
  {
    topic: 'Continuous validation',
    zeroTrust: 'Is actor and request posture still acceptable?',
    admissibleExecution: 'Are evidence, authority, continuity, boundary, and correspondence still admissible?',
  },
  {
    topic: 'Primary failure prevented',
    zeroTrust: 'Unauthorized access or misuse.',
    admissibleExecution: 'Unsupported, unbounded, stale, or non-corresponding execution.',
  },
] as const;

const glossary = [
  {
    term: 'Admissible evidence',
    definition: 'Evidence that is relevant, current, sufficient, attributable, continuous, and fit for the exact decision being made.',
  },
  {
    term: 'Admissible execution',
    definition: 'Execution that has earned the right to proceed through valid evidence, authority, continuity, boundary, commit, and runtime correspondence.',
  },
  {
    term: 'Binding',
    definition: 'The valid connection between a supported determination and an authorized consequence.',
  },
  {
    term: 'Boundary',
    definition: 'The declared limit of actor, action, scope, system, time, jurisdiction, and consequence.',
  },
  {
    term: 'Commit',
    definition: 'The preserved approved state immediately before execution.',
  },
  {
    term: 'Continuity',
    definition: 'The unbroken relationship among reality, record, identity, provenance, time, custody, state, and decision.',
  },
  {
    term: 'Correspondence',
    definition: 'The match between what was authorized and what was actually executed.',
  },
  {
    term: 'Determination',
    definition: 'A bounded decision state supported by admissible evidence and valid authority.',
  },
  {
    term: 'Evidence conflict',
    definition: 'A material contradiction among records, sources, observations, or interpretations that must remain visible until resolved.',
  },
  {
    term: 'Execution drift',
    definition: 'A change in evidence, authority, dependency, scope, actor, timing, or action after approval.',
  },
  {
    term: 'Governed route',
    definition: 'A preserved chain that connects reality to outcome through inspectable evidence, authority, decisions, execution, and verification.',
  },
  {
    term: 'Hold',
    definition: 'A non-final state that prevents execution while required support, authority, continuity, or boundary conditions remain unresolved.',
  },
  {
    term: 'Outcome evidence',
    definition: 'Preserved proof of what actually occurred after execution.',
  },
  {
    term: 'Preservation',
    definition: 'The maintenance of attributable, versioned, challengeable history across the route.',
  },
  {
    term: 'Revalidation',
    definition: 'A new test of material conditions before or during execution.',
  },
  {
    term: 'Runtime governance',
    definition: 'Controls that remain active while consequence-bearing execution is occurring.',
  },
] as const;

const scenarios = [
  {
    title: 'Clinical decision support',
    situation: 'A verified model recommends intervention using a record that is twelve hours stale after the patient condition changed.',
    result: 'Freshness and continuity fail. The route holds before binding.',
  },
  {
    title: 'Autonomous procurement',
    situation: 'An approved agent places an order after the spending authority was reduced.',
    result: 'Authority and boundary fail. Identity remains valid, but execution is inadmissible.',
  },
  {
    title: 'Building automation',
    situation: 'A control sequence is authorized under normal occupancy but executes during emergency response.',
    result: 'Context, boundary, and revalidation fail.',
  },
  {
    title: 'Financial transfer',
    situation: 'The recipient is verified, but the supporting obligation was superseded by a later contract amendment.',
    result: 'Continuity, obligation, and binding fail.',
  },
  {
    title: 'Environmental monitoring',
    situation: 'A sensor report is complete but its calibration chain cannot be established.',
    result: 'Provenance and integrity fail before admissibility.',
  },
  {
    title: 'Public benefits eligibility',
    situation: 'A determination is reached while a conflicting record remains unresolved and hidden from review.',
    result: 'Conflict and sufficiency fail.',
  },
  {
    title: 'Industrial maintenance',
    situation: 'The committed repair plan is altered at runtime without a new boundary review.',
    result: 'Commit and correspondence fail.',
  },
  {
    title: 'Hiring automation',
    situation: 'A model is approved for screening but used to make final selection decisions.',
    result: 'Purpose and execution boundary are exceeded.',
  },
] as const;

const anchorCorrespondence: Record<AnchorId, string[]> = {
  reality: ['reality', 'record', 'identity'],
  record: ['record', 'identity', 'provenance', 'time', 'custody', 'integrity'],
  continuity: ['continuity', 'provenance', 'time', 'custody', 'integrity'],
  admissibility: ['relevance', 'freshness', 'sufficiency', 'conflict', 'admissibility'],
  binding: ['authority', 'boundary', 'obligation', 'binding'],
  commit: ['determination', 'commit', 'revalidation'],
  execution: ['execution', 'correspondence', 'revalidation'],
  outcome: ['outcome', 'preservation'],
};

type RuntimeDossier = {
  id: string;
  title: string;
  question: string;
  requiredEvidence: string;
  failureMode: string;
  gateResponse: string;
  teachingNote: string;
  inspectionQuestions: string[];
  evidenceExamples: string[];
  failureSignals: string[];
};

const runtimeDossiers: RuntimeDossier[] = [
  {
    id: 'reality',
    title: 'Reality',
    question: 'What condition actually exists before interpretation?',
    requiredEvidence: 'Direct observation, declared condition, environmental state, system state, or bounded request.',
    failureMode: 'Assumption is treated as fact or a preferred narrative replaces the observed condition.',
    gateResponse: 'HOLD until the condition is described without importing an unsupported conclusion.',
    teachingNote: 'Reality must be explicit enough that another reviewer can distinguish observation from inference.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 01?",
      "Which source is responsible for proving reality?",
      "What change would invalidate the current reality state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary reality artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing reality support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'record',
    title: 'Record',
    question: 'What preserved artifact represents the observed condition?',
    requiredEvidence: 'Attributed observation, captured data, declaration, image, measurement, log, or source document.',
    failureMode: 'The route relies on memory, transient output, or an artifact whose origin cannot be established.',
    gateResponse: 'HOLD until a preservable and attributable representation exists.',
    teachingNote: 'A record is not automatically admissible merely because it exists.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 02?",
      "Which source is responsible for proving record?",
      "What change would invalidate the current record state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary record artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing record support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'identity',
    title: 'Identity',
    question: 'Who or what produced, supplied, transformed, or approved the record?',
    requiredEvidence: 'Human identity, system identity, device identity, role, credential, and source attribution.',
    failureMode: 'The route cannot establish the actor, source, device, or transformation identity.',
    gateResponse: 'HOLD or DENY depending on whether identity can be recovered without contaminating the record.',
    teachingNote: 'Identity must remain connected to the exact act performed, not merely to an account or organization.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 03?",
      "Which source is responsible for proving identity?",
      "What change would invalidate the current identity state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary identity artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing identity support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'provenance',
    title: 'Provenance',
    question: 'Where did the record originate and through what lineage did it arrive?',
    requiredEvidence: 'Origin system, acquisition method, transformation history, source reference, and lineage map.',
    failureMode: 'The record appears complete but its origin or transformation chain is unknown.',
    gateResponse: 'HOLD until the route can establish origin and material transformations.',
    teachingNote: 'Provenance explains how the record became what the decision-maker is seeing.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 04?",
      "Which source is responsible for proving provenance?",
      "What change would invalidate the current provenance state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary provenance artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing provenance support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'time',
    title: 'Time',
    question: 'When was the condition observed and when was the record created?',
    requiredEvidence: 'Observation time, creation time, receipt time, effective time, expiration, and decision time.',
    failureMode: 'Timing is absent, ambiguous, inconsistent, or incompatible with the proposed consequence.',
    gateResponse: 'HOLD until temporal relationship and validity are established.',
    teachingNote: 'A true record may still be unusable when its timing is wrong for the decision.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 05?",
      "Which source is responsible for proving time?",
      "What change would invalidate the current time state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary time artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing time support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'custody',
    title: 'Custody',
    question: 'Who possessed or controlled the record across material transitions?',
    requiredEvidence: 'Custodian identity, transfer events, access history, storage state, and control boundaries.',
    failureMode: 'An unexplained handoff or access event creates a gap in control.',
    gateResponse: 'HOLD while the custody discontinuity remains material and unresolved.',
    teachingNote: 'Custody focuses on possession and control while provenance focuses on origin and lineage.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 06?",
      "Which source is responsible for proving custody?",
      "What change would invalidate the current custody state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary custody artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing custody support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'integrity',
    title: 'Integrity',
    question: 'Has the record remained complete and resistant to silent alteration?',
    requiredEvidence: 'Hashes, signatures, validation results, immutable history, tamper evidence, and reconciliation.',
    failureMode: 'The route cannot distinguish the current artifact from an altered or incomplete version.',
    gateResponse: 'DENY when integrity cannot be restored; otherwise HOLD for validation.',
    teachingNote: 'Integrity does not prove truth, but it preserves confidence that the artifact has not silently changed.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 07?",
      "Which source is responsible for proving integrity?",
      "What change would invalidate the current integrity state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary integrity artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing integrity support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'continuity',
    title: 'Continuity',
    question: 'Has reality remained connected to the present decision across time and transition?',
    requiredEvidence: 'Linked identity, provenance, timing, custody, state changes, dependencies, and version history.',
    failureMode: 'A stale dependency, substitution, missing handoff, or unexplained transformation breaks the chain.',
    gateResponse: 'HOLD and return to the earliest broken connection.',
    teachingNote: 'Continuity is tested across the whole route, not only inside a single database or file.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 08?",
      "Which source is responsible for proving continuity?",
      "What change would invalidate the current continuity state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary continuity artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing continuity support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'relevance',
    title: 'Relevance',
    question: 'Does this evidence bear directly on the exact decision being considered?',
    requiredEvidence: 'Decision question, evidence relationship, scope alignment, and exclusion rationale.',
    failureMode: 'Accurate evidence is used to support a different question than the one it actually addresses.',
    gateResponse: 'HOLD until relevant support is separated from merely interesting information.',
    teachingNote: 'Relevance is decision-specific and cannot be inherited from another use case.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 09?",
      "Which source is responsible for proving relevance?",
      "What change would invalidate the current relevance state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary relevance artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing relevance support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'freshness',
    title: 'Freshness',
    question: 'Is the evidence current enough for the present action and consequence?',
    requiredEvidence: 'Age threshold, change rate, last validation, dependency update, and effective period.',
    failureMode: 'Evidence was once valid but the governed condition has materially changed.',
    gateResponse: 'HOLD and reacquire or revalidate evidence before binding.',
    teachingNote: 'Freshness is based on how quickly the governed reality can change, not a universal time window.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 10?",
      "Which source is responsible for proving freshness?",
      "What change would invalidate the current freshness state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary freshness artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing freshness support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'sufficiency',
    title: 'Sufficiency',
    question: 'Is there enough admissible support to justify the determination?',
    requiredEvidence: 'Required evidence set, confidence threshold, coverage, unresolved gaps, and corroboration.',
    failureMode: 'A partial record is treated as though it proves the whole proposition.',
    gateResponse: 'HOLD until the minimum support threshold is satisfied or DENY when it cannot be.',
    teachingNote: 'Sufficiency must be declared before seeing whether the available evidence is favorable.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 11?",
      "Which source is responsible for proving sufficiency?",
      "What change would invalidate the current sufficiency state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary sufficiency artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing sufficiency support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'conflict',
    title: 'Conflict',
    question: 'Have material contradictions been surfaced, tested, and preserved?',
    requiredEvidence: 'Contradictory records, objection history, reconciliation method, unresolved issues, and reviewer findings.',
    failureMode: 'The route silently selects the preferred record or hides disagreement from later review.',
    gateResponse: 'HOLD or ESCALATE until the conflict is resolved or bounded transparently.',
    teachingNote: 'Unresolved conflict is a preserved condition, not permission to choose the most convenient answer.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 12?",
      "Which source is responsible for proving conflict?",
      "What change would invalidate the current conflict state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary conflict artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing conflict support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'admissibility',
    title: 'Admissibility',
    question: 'May this evidence support this determination now?',
    requiredEvidence: 'Relevance, freshness, sufficiency, integrity, continuity, conflict status, and scope fit.',
    failureMode: 'Evidence exists but is unfit for this actor, time, scope, decision, or consequence.',
    gateResponse: 'HOLD, DENY, or ESCALATE according to the failed admissibility condition.',
    teachingNote: 'Admissibility is the decision-specific right of evidence to carry governing weight.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 13?",
      "Which source is responsible for proving admissibility?",
      "What change would invalidate the current admissibility state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary admissibility artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing admissibility support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'authority',
    title: 'Authority',
    question: 'Who may make, approve, or execute this exact decision?',
    requiredEvidence: 'Role mandate, delegation, jurisdiction, credential, approval scope, and effective period.',
    failureMode: 'The actor is trusted or credentialed but lacks authority for this exact action.',
    gateResponse: 'DENY or ESCALATE; authority cannot be inferred from confidence or access.',
    teachingNote: 'Authority must be valid for actor, action, scope, system, time, and consequence.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 14?",
      "Which source is responsible for proving authority?",
      "What change would invalidate the current authority state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary authority artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing authority support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'boundary',
    title: 'Boundary',
    question: 'Where does the allowed action begin, end, and remain prohibited?',
    requiredEvidence: 'Purpose, actor, system, data, action, time, geography, population, and consequence limits.',
    failureMode: 'The route permits an adjacent use or expanded action that was never approved.',
    gateResponse: 'HOLD or DENY when execution would cross the declared boundary.',
    teachingNote: 'A broad goal is not a boundary; boundaries must be operationally testable.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 15?",
      "Which source is responsible for proving boundary?",
      "What change would invalidate the current boundary state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary boundary artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing boundary support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'obligation',
    title: 'Obligation',
    question: 'What rule, policy, contract, standard, or duty governs the action?',
    requiredEvidence: 'Applicable authority text, policy requirement, contractual duty, mandatory control, and exception rule.',
    failureMode: 'The route cites a general principle that does not impose or permit the specific action.',
    gateResponse: 'HOLD until applicability and obligation are established.',
    teachingNote: 'Obligation can require action, prohibit action, or impose conditions on action.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 16?",
      "Which source is responsible for proving obligation?",
      "What change would invalidate the current obligation state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary obligation artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing obligation support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'binding',
    title: 'Binding',
    question: 'What valid authority connects the determination to consequence?',
    requiredEvidence: 'Supported determination, valid authority, applicable obligation, declared boundary, and approval state.',
    failureMode: 'The route jumps from analysis to consequence without a valid governing connection.',
    gateResponse: 'DENY execution until the binding relationship is explicit and valid.',
    teachingNote: 'Binding is where a supported decision becomes capable of authorizing real-world consequence.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 17?",
      "Which source is responsible for proving binding?",
      "What change would invalidate the current binding state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary binding artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing binding support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'determination',
    title: 'Determination',
    question: 'What conclusion do the admissible evidence and valid authority actually support?',
    requiredEvidence: 'Finding, confidence, unresolved conditions, rationale, alternatives, and permitted state.',
    failureMode: 'A desired outcome is written first and evidence is arranged around it.',
    gateResponse: 'HOLD, DENY, ALLOW, or ESCALATE must follow from preserved support.',
    teachingNote: 'Determination is bounded by what the evidence proves and what authority permits.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 18?",
      "Which source is responsible for proving determination?",
      "What change would invalidate the current determination state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary determination artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing determination support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'commit',
    title: 'Commit',
    question: 'What exact approved route state is fixed before execution?',
    requiredEvidence: 'Version, determination, actor, action, evidence set, conditions, dependencies, boundary, and timestamp.',
    failureMode: 'The route remains mutable after approval or cannot distinguish approved state from later edits.',
    gateResponse: 'HOLD until an attributable and immutable commit exists.',
    teachingNote: 'Commit creates the reference state against which runtime correspondence can be tested.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 19?",
      "Which source is responsible for proving commit?",
      "What change would invalidate the current commit state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary commit artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing commit support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'revalidation',
    title: 'Revalidation',
    question: 'Do the material conditions still hold immediately before and during execution?',
    requiredEvidence: 'Evidence freshness, authority status, dependency state, boundary, context, and revocation signals.',
    failureMode: 'Execution proceeds after a material condition changed or authority was withdrawn.',
    gateResponse: 'HOLD or stop execution at the earliest detected drift.',
    teachingNote: 'Revalidation prevents yesterday’s approval from becoming unconditional permission today.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 20?",
      "Which source is responsible for proving revalidation?",
      "What change would invalidate the current revalidation state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary revalidation artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing revalidation support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'execution',
    title: 'Execution',
    question: 'What action is actually performed, by whom, when, and against what target?',
    requiredEvidence: 'Actor identity, action trace, target, timing, parameters, controls, and runtime events.',
    failureMode: 'The real action is not attributable or cannot be distinguished from the approved action.',
    gateResponse: 'Stop, HOLD, or DENY when execution cannot remain inside the committed state.',
    teachingNote: 'Execution is the moment consequence begins to bind to reality.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 21?",
      "Which source is responsible for proving execution?",
      "What change would invalidate the current execution state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary execution artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing execution support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'correspondence',
    title: 'Correspondence',
    question: 'Did the performed action match the committed authorization?',
    requiredEvidence: 'Command-to-action mapping, parameter comparison, actor match, target match, timing, and scope.',
    failureMode: 'The system performs a nearby but materially different action.',
    gateResponse: 'Stop execution and preserve the variance for challenge and review.',
    teachingNote: 'A technically successful action can still be governance failure when it does not correspond.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 22?",
      "Which source is responsible for proving correspondence?",
      "What change would invalidate the current correspondence state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary correspondence artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing correspondence support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'outcome',
    title: 'Outcome',
    question: 'What actually happened after execution?',
    requiredEvidence: 'Observed result, expected result, deviation, harm, benefit, residual condition, and secondary effects.',
    failureMode: 'The route records permission and action but does not preserve the real-world result.',
    gateResponse: 'HOLD route closure until outcome evidence is captured or absence is explained.',
    teachingNote: 'Outcome closes the loop between governed intent and actual consequence.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 23?",
      "Which source is responsible for proving outcome?",
      "What change would invalidate the current outcome state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary outcome artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing outcome support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
  {
    id: 'preservation',
    title: 'Preservation',
    question: 'Can the complete route survive later inspection, challenge, and reconstruction?',
    requiredEvidence: 'Version history, evidence package, decision record, execution trace, outcome record, findings, and corrections.',
    failureMode: 'History is overwritten, fragmented, unattributed, or inaccessible to authorized challenge.',
    gateResponse: 'The route remains incomplete until preservation duties are satisfied.',
    teachingNote: 'Preservation makes accountability possible without pretending the past was cleaner than it was.',
    inspectionQuestions: [
      "What exact fact must be established at runtime link 24?",
      "Which source is responsible for proving preservation?",
      "What change would invalidate the current preservation state?",
      "Who is authorized to challenge or correct this link?",
      "What must be preserved if this link produces HOLD?",
    ],
    evidenceExamples: [
      "Primary preservation artifact",
      "Independent corroborating record",
      "Attributable validation result",
      "Version and timing evidence",
      "Preserved reviewer finding",
    ],
    failureSignals: [
      "Missing preservation support",
      "Unattributed or unversioned artifact",
      "Material condition changed after review",
      "Boundary or authority relationship unclear",
      "Contradiction hidden or unresolved",
    ],
  },
];

const architectureStudyPrompts = [
  {
    id: 'reality',
    number: '01',
    title: 'Reality',
    prompt: "Explain why reality cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where reality exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when reality fails.",
  },
  {
    id: 'record',
    number: '02',
    title: 'Record',
    prompt: "Explain why record cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where record exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when record fails.",
  },
  {
    id: 'identity',
    number: '03',
    title: 'Identity',
    prompt: "Explain why identity cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where identity exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when identity fails.",
  },
  {
    id: 'provenance',
    number: '04',
    title: 'Provenance',
    prompt: "Explain why provenance cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where provenance exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when provenance fails.",
  },
  {
    id: 'time',
    number: '05',
    title: 'Time',
    prompt: "Explain why time cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where time exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when time fails.",
  },
  {
    id: 'custody',
    number: '06',
    title: 'Custody',
    prompt: "Explain why custody cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where custody exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when custody fails.",
  },
  {
    id: 'integrity',
    number: '07',
    title: 'Integrity',
    prompt: "Explain why integrity cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where integrity exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when integrity fails.",
  },
  {
    id: 'continuity',
    number: '08',
    title: 'Continuity',
    prompt: "Explain why continuity cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where continuity exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when continuity fails.",
  },
  {
    id: 'relevance',
    number: '09',
    title: 'Relevance',
    prompt: "Explain why relevance cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where relevance exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when relevance fails.",
  },
  {
    id: 'freshness',
    number: '10',
    title: 'Freshness',
    prompt: "Explain why freshness cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where freshness exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when freshness fails.",
  },
  {
    id: 'sufficiency',
    number: '11',
    title: 'Sufficiency',
    prompt: "Explain why sufficiency cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where sufficiency exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when sufficiency fails.",
  },
  {
    id: 'conflict',
    number: '12',
    title: 'Conflict',
    prompt: "Explain why conflict cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where conflict exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when conflict fails.",
  },
  {
    id: 'admissibility',
    number: '13',
    title: 'Admissibility',
    prompt: "Explain why admissibility cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where admissibility exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when admissibility fails.",
  },
  {
    id: 'authority',
    number: '14',
    title: 'Authority',
    prompt: "Explain why authority cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where authority exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when authority fails.",
  },
  {
    id: 'boundary',
    number: '15',
    title: 'Boundary',
    prompt: "Explain why boundary cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where boundary exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when boundary fails.",
  },
  {
    id: 'obligation',
    number: '16',
    title: 'Obligation',
    prompt: "Explain why obligation cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where obligation exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when obligation fails.",
  },
  {
    id: 'binding',
    number: '17',
    title: 'Binding',
    prompt: "Explain why binding cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where binding exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when binding fails.",
  },
  {
    id: 'determination',
    number: '18',
    title: 'Determination',
    prompt: "Explain why determination cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where determination exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when determination fails.",
  },
  {
    id: 'commit',
    number: '19',
    title: 'Commit',
    prompt: "Explain why commit cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where commit exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when commit fails.",
  },
  {
    id: 'revalidation',
    number: '20',
    title: 'Revalidation',
    prompt: "Explain why revalidation cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where revalidation exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when revalidation fails.",
  },
  {
    id: 'execution',
    number: '21',
    title: 'Execution',
    prompt: "Explain why execution cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where execution exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when execution fails.",
  },
  {
    id: 'correspondence',
    number: '22',
    title: 'Correspondence',
    prompt: "Explain why correspondence cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where correspondence exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when correspondence fails.",
  },
  {
    id: 'outcome',
    number: '23',
    title: 'Outcome',
    prompt: "Explain why outcome cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where outcome exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when outcome fails.",
  },
  {
    id: 'preservation',
    number: '24',
    title: 'Preservation',
    prompt: "Explain why preservation cannot be assumed merely because the previous runtime link passed.",
    challenge: "Describe a case where preservation exists but remains inadmissible for the proposed consequence.",
    preservation: "Identify the artifact that should be preserved when preservation fails.",
  },
] as const;


const architecturePrinciples = [
  {
    number: '01',
    title: 'Reality before narrative',
    description: 'Begin from the bounded condition that exists, not from the outcome someone hopes to justify.',
    question: "What evidence would prove that principle 01 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 01.",
  },
  {
    number: '02',
    title: 'Record before reliance',
    description: 'A consequential route cannot depend on an unpreserved memory, transient output, or invisible source.',
    question: "What evidence would prove that principle 02 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 02.",
  },
  {
    number: '03',
    title: 'Identity before attribution',
    description: 'The route must know who or what produced, transformed, reviewed, approved, and executed each material act.',
    question: "What evidence would prove that principle 03 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 03.",
  },
  {
    number: '04',
    title: 'Provenance before confidence',
    description: 'Confidence cannot replace knowledge of origin, lineage, method, and material transformation.',
    question: "What evidence would prove that principle 04 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 04.",
  },
  {
    number: '05',
    title: 'Time before applicability',
    description: 'A true statement from the wrong time may be unusable for the decision being made now.',
    question: "What evidence would prove that principle 05 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 05.",
  },
  {
    number: '06',
    title: 'Custody before trust',
    description: 'Control transitions and possession history must remain visible where integrity or challenge depends on them.',
    question: "What evidence would prove that principle 06 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 06.",
  },
  {
    number: '07',
    title: 'Integrity before interpretation',
    description: 'Interpretation is premature when the route cannot establish that the artifact remained complete and unaltered.',
    question: "What evidence would prove that principle 07 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 07.",
  },
  {
    number: '08',
    title: 'Continuity before conclusion',
    description: 'Evidence must remain connected across identity, provenance, time, custody, version, and dependency change.',
    question: "What evidence would prove that principle 08 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 08.",
  },
  {
    number: '09',
    title: 'Relevance before volume',
    description: 'More information does not solve a decision when the information does not bear on the exact question.',
    question: "What evidence would prove that principle 09 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 09.",
  },
  {
    number: '10',
    title: 'Freshness before execution',
    description: 'Previously valid evidence must be tested against how quickly the governed reality can change.',
    question: "What evidence would prove that principle 10 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 10.",
  },
  {
    number: '11',
    title: 'Sufficiency before permission',
    description: 'A partial record cannot be promoted into full support merely because action is urgent or desirable.',
    question: "What evidence would prove that principle 11 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 11.",
  },
  {
    number: '12',
    title: 'Conflict before selection',
    description: 'Contradiction must be surfaced and preserved before any record is allowed to carry governing weight.',
    question: "What evidence would prove that principle 12 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 12.",
  },
  {
    number: '13',
    title: 'Admissibility before determination',
    description: 'Evidence may inform discussion without being allowed to support a consequence-bearing conclusion.',
    question: "What evidence would prove that principle 13 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 13.",
  },
  {
    number: '14',
    title: 'Authority before approval',
    description: 'Access, expertise, identity, and trust do not create authority for an action that exceeds role or scope.',
    question: "What evidence would prove that principle 14 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 14.",
  },
  {
    number: '15',
    title: 'Boundary before autonomy',
    description: 'The system must know where action begins, ends, and remains prohibited before it is allowed to operate.',
    question: "What evidence would prove that principle 15 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 15.",
  },
  {
    number: '16',
    title: 'Obligation before enforcement',
    description: 'The route must establish the exact rule, duty, prohibition, or permission that governs consequence.',
    question: "What evidence would prove that principle 16 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 16.",
  },
  {
    number: '17',
    title: 'Binding before consequence',
    description: 'A determination cannot bind to reality without a valid connection to authority and declared scope.',
    question: "What evidence would prove that principle 17 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 17.",
  },
  {
    number: '18',
    title: 'Determination before commitment',
    description: 'The approved state must follow from evidence and authority rather than from a preferred execution plan.',
    question: "What evidence would prove that principle 18 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 18.",
  },
  {
    number: '19',
    title: 'Commit before action',
    description: 'The route version, conditions, dependencies, actor, and boundary must be fixed before execution begins.',
    question: "What evidence would prove that principle 19 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 19.",
  },
  {
    number: '20',
    title: 'Revalidation before runtime',
    description: 'Material conditions must be checked again when time, context, authority, evidence, or dependencies can drift.',
    question: "What evidence would prove that principle 20 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 20.",
  },
  {
    number: '21',
    title: 'Execution under control',
    description: 'The performed action must remain attributable, observable, bounded, and interruptible where required.',
    question: "What evidence would prove that principle 21 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 21.",
  },
  {
    number: '22',
    title: 'Correspondence before success',
    description: 'Technical completion is not governance success when the performed act differs from the authorized act.',
    question: "What evidence would prove that principle 22 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 22.",
  },
  {
    number: '23',
    title: 'Outcome before closure',
    description: 'A route is not complete until the real-world result and residual condition are observed and preserved.',
    question: "What evidence would prove that principle 23 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 23.",
  },
  {
    number: '24',
    title: 'Preservation before finality',
    description: 'The complete history must remain reconstructable, attributable, versioned, challengeable, and correctable.',
    question: "What evidence would prove that principle 24 has actually been satisfied?",
    consequence: "If this principle fails, the route must stop at or before runtime link 24.",
  },
] as const;


export default function ArchitectureExplorerPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("anchors");
  const [selectedAnchor, setSelectedAnchor] = useState<AnchorId>("reality");
  const [selectedLink, setSelectedLink] = useState("reality");
  const [completedLinks, setCompletedLinks] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [hydrated, setHydrated] = useState(false);
  const [mobileRailOpen, setMobileRailOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedState;
        if (parsed.version === "2.0") {
          setSelectedAnchor(parsed.selectedAnchor || "reality");
          setSelectedLink(parsed.selectedLink || "reality");
          setCompletedLinks(Array.isArray(parsed.completedLinks) ? parsed.completedLinks : []);
          setNotes(parsed.notes || {});
        }
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setHydrated(true);
    }
  }, []);

  const activeAnchor = useMemo(() => anchors.find((item) => item.id === selectedAnchor) ?? anchors[0], [selectedAnchor]);
  const activeLink = useMemo(() => runtimeLinks.find((item) => item.id === selectedLink) ?? runtimeLinks[0], [selectedLink]);
  const activeDossier = useMemo(() => runtimeDossiers.find((item) => item.id === selectedLink) ?? runtimeDossiers[0], [selectedLink]);
  const activeStudyPrompt = useMemo(() => architectureStudyPrompts.find((item) => item.id === selectedLink) ?? architectureStudyPrompts[0], [selectedLink]);
  const filteredLinks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return runtimeLinks;
    return runtimeLinks.filter((item) => `${item.number} ${item.title} ${item.eyebrow} ${item.description}`.toLowerCase().includes(query));
  }, [search]);
  const progress = Math.round((completedLinks.length / runtimeLinks.length) * 100);

  function saveProgress() {
    try {
      const payload: SavedState = { version: "2.0", selectedAnchor, selectedLink, completedLinks, notes, updatedAt: new Date().toISOString() };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setSaveStatus("saved");
    } catch { setSaveStatus("error"); }
  }

  function navigateToView(mode: ViewMode, sectionId: string) {
    setViewMode(mode);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function toggleLink(id: string) {
    setCompletedLinks((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setSaveStatus("idle");
  }

  function selectAnchor(id: AnchorId) {
    setSelectedAnchor(id);
    const first = anchorCorrespondence[id][0];
    if (first) setSelectedLink(first);
    navigateToView("anchors", "architecture-workspace");
  }

  return (
    <main className="min-h-screen bg-[#020611] text-slate-100">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #020611; }
        main { position: relative; isolation: isolate; min-height: 100vh; overflow: hidden; color: #e8f1ff; background:
          radial-gradient(circle at 16% 8%, rgba(34,211,238,.13), transparent 30rem),
          radial-gradient(circle at 86% 26%, rgba(139,92,246,.12), transparent 34rem),
          radial-gradient(circle at 58% 88%, rgba(16,185,129,.08), transparent 32rem),
          linear-gradient(180deg,#020611 0%,#04101c 48%,#020611 100%); }
        main::before { content:""; position:fixed; inset:0; pointer-events:none; z-index:-1; opacity:.34; background-image:
          linear-gradient(rgba(125,211,252,.035) 1px,transparent 1px),
          linear-gradient(90deg,rgba(125,211,252,.035) 1px,transparent 1px); background-size:42px 42px; mask-image:linear-gradient(to bottom,black,transparent 88%); }
        main::after { content:""; position:fixed; inset:0; pointer-events:none; z-index:80; box-shadow:inset 0 0 140px rgba(0,0,0,.72); }
        main > aside, main > button[class*="fixed"] { display:none !important; }
        main > div[class*="lg:pl"] { padding-left:0 !important; }
        a { color:inherit; text-decoration:none; }
        button,input,textarea { font:inherit; }
        button { cursor:pointer; }
        input,textarea { color:#eef7ff; }
      
        [class~="relative"]{position:relative}[class~="absolute"]{position:absolute}[class~="fixed"]{position:fixed}
        [class~="inset-0"]{inset:0}[class~="top-4"]{top:1rem}[class~="top-16"]{top:4rem}[class~="top-[28rem]"]{top:28rem}
        [class~="left-4"]{left:1rem}[class~="-left-32"]{left:-8rem}[class~="left-[38%]"]{left:38%}[class~="right-[-10rem]"]{right:-10rem}[class~="bottom-[-16rem]"]{bottom:-16rem}
        [class~="z-50"]{z-index:50}[class~="z-[100]"]{z-index:100}[class~="pointer-events-none"]{pointer-events:none}
        [class~="block"]{display:block}[class~="inline-flex"]{display:inline-flex}[class~="flex"]{display:flex}[class~="grid"]{display:grid}
        [class~="flex-col"]{flex-direction:column}[class~="flex-wrap"]{flex-wrap:wrap}[class~="flex-1"]{flex:1 1 0%}
        [class~="items-center"]{align-items:center}[class~="items-end"]{align-items:flex-end}[class~="items-start"]{align-items:flex-start}
        [class~="justify-between"]{justify-content:space-between}[class~="place-items-center"]{place-items:center}
        [class~="shrink-0"]{flex-shrink:0}[class~="min-w-0"]{min-width:0}[class~="min-h-0"]{min-height:0}
        [class~="w-full"]{width:100%}[class~="h-full"]{height:100%}[class~="min-h-screen"]{min-height:100vh}
        [class~="w-9"]{width:2.25rem}[class~="h-9"]{height:2.25rem}[class~="w-12"]{width:3rem}[class~="h-12"]{height:3rem}
        [class~="w-[32rem]"]{width:32rem}[class~="h-[32rem]"]{height:32rem}[class~="w-[34rem]"]{width:34rem}[class~="h-[34rem]"]{height:34rem}[class~="w-[38rem]"]{width:38rem}[class~="h-[38rem]"]{height:38rem}
        [class~="max-w-[1500px]"]{max-width:1500px}[class~="max-w-5xl"]{max-width:64rem}[class~="max-w-4xl"]{max-width:56rem}[class~="max-w-2xl"]{max-width:42rem}
        [class~="max-h-[780px]"]{max-height:780px}[class~="min-h-52"]{min-height:13rem}
        [class~="mx-auto"]{margin-left:auto;margin-right:auto}
        [class~="mt-1"]{margin-top:.25rem}[class~="mt-2"]{margin-top:.5rem}[class~="mt-3"]{margin-top:.75rem}[class~="mt-4"]{margin-top:1rem}[class~="mt-5"]{margin-top:1.25rem}[class~="mt-6"]{margin-top:1.5rem}[class~="mt-7"]{margin-top:1.75rem}[class~="mt-8"]{margin-top:2rem}[class~="mt-14"]{margin-top:3.5rem}[class~="mt-16"]{margin-top:4rem}
        [class~="p-4"]{padding:1rem}[class~="p-5"]{padding:1.25rem}[class~="p-6"]{padding:1.5rem}[class~="p-7"]{padding:1.75rem}
        [class~="px-2.5"]{padding-left:.625rem;padding-right:.625rem}[class~="px-3"]{padding-left:.75rem;padding-right:.75rem}[class~="px-4"]{padding-left:1rem;padding-right:1rem}[class~="px-5"]{padding-left:1.25rem;padding-right:1.25rem}
        [class~="py-1"]{padding-top:.25rem;padding-bottom:.25rem}[class~="py-2"]{padding-top:.5rem;padding-bottom:.5rem}[class~="py-3"]{padding-top:.75rem;padding-bottom:.75rem}[class~="py-4"]{padding-top:1rem;padding-bottom:1rem}[class~="py-6"]{padding-top:1.5rem;padding-bottom:1.5rem}[class~="py-8"]{padding-top:2rem;padding-bottom:2rem}[class~="py-10"]{padding-top:2.5rem;padding-bottom:2.5rem}
        [class~="pt-12"]{padding-top:3rem}[class~="pb-5"]{padding-bottom:1.25rem}[class~="pb-6"]{padding-bottom:1.5rem}[class~="pr-1"]{padding-right:.25rem}[class~="pl-0"]{padding-left:0}
        [class~="gap-2"]{gap:.5rem}[class~="gap-3"]{gap:.75rem}[class~="gap-4"]{gap:1rem}[class~="gap-5"]{gap:1.25rem}[class~="gap-6"]{gap:1.5rem}[class~="gap-8"]{gap:2rem}
        [class~="space-y-1"]>*+*{margin-top:.25rem}[class~="space-y-2"]>*+*{margin-top:.5rem}[class~="space-y-3"]>*+*{margin-top:.75rem}[class~="space-y-6"]>*+*{margin-top:1.5rem}
        [class~="grid-cols-[.55fr_1fr_1fr]"]{grid-template-columns:.55fr 1fr 1fr}
        [class~="rounded-lg"]{border-radius:.65rem}[class~="rounded-xl"]{border-radius:.9rem}[class~="rounded-2xl"]{border-radius:1.25rem}[class~="rounded-3xl"]{border-radius:1.75rem}[class~="rounded-full"]{border-radius:9999px}
        [class~="border"]{border:1px solid rgba(148,163,184,.18)}[class~="border-2"]{border-width:2px}[class~="border-b"]{border-bottom:1px solid rgba(148,163,184,.16)}[class~="border-t"]{border-top:1px solid rgba(148,163,184,.16)}[class~="border-l"]{border-left:1px solid rgba(148,163,184,.16)}
        [class~="border-white/10"]{border-color:rgba(255,255,255,.1)}[class~="border-transparent"]{border-color:transparent}
        [class~="border-cyan-300/15"]{border-color:rgba(103,232,249,.15)}[class~="border-cyan-300/20"]{border-color:rgba(103,232,249,.2)}[class~="border-cyan-300/25"]{border-color:rgba(103,232,249,.25)}[class~="border-cyan-300/30"]{border-color:rgba(103,232,249,.3)}
        [class~="border-violet-300/15"]{border-color:rgba(196,181,253,.15)}[class~="border-violet-300/20"]{border-color:rgba(196,181,253,.2)}[class~="border-violet-300/25"]{border-color:rgba(196,181,253,.25)}
        [class~="border-amber-300/15"]{border-color:rgba(252,211,77,.15)}[class~="border-amber-300/20"]{border-color:rgba(252,211,77,.2)}[class~="border-rose-300/15"]{border-color:rgba(253,164,175,.15)}
        [class~="border-t-cyan-300"]{border-top-color:#67e8f9}
        [class~="bg-[#020611]"]{background:#020611}[class~="bg-[#020611]/85"]{background:rgba(2,6,17,.85)}[class~="bg-[#07111f]/95"]{background:rgba(7,17,31,.95)}
        [class~="bg-white/10"]{background:rgba(255,255,255,.1)}[class~="bg-white/[0.03]"]{background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.018))}[class~="bg-white/[0.04]"]{background:rgba(255,255,255,.04)}[class~="bg-white/[0.05]"]{background:rgba(255,255,255,.05)}
        [class~="bg-black/15"]{background:rgba(0,0,0,.15)}[class~="bg-black/20"]{background:rgba(0,0,0,.2)}[class~="bg-black/25"]{background:rgba(0,0,0,.25)}
        [class~="bg-cyan-300"]{background:#67e8f9}[class~="bg-cyan-300/10"]{background:rgba(103,232,249,.1)}[class~="bg-cyan-300/[0.03]"]{background:rgba(103,232,249,.03)}[class~="bg-cyan-300/[0.05]"]{background:rgba(103,232,249,.05)}
        [class~="bg-violet-300/10"]{background:rgba(196,181,253,.1)}[class~="bg-violet-300/[0.04]"]{background:rgba(196,181,253,.04)}[class~="bg-amber-300/10"]{background:rgba(252,211,77,.1)}[class~="bg-amber-300/[0.05]"]{background:rgba(252,211,77,.05)}[class~="bg-rose-300/[0.05]"]{background:rgba(253,164,175,.05)}[class~="bg-rose-300/[0.06]"]{background:rgba(253,164,175,.06)}
        [class~="bg-cyan-500/10"]{background:rgba(6,182,212,.1)}[class~="bg-violet-500/10"]{background:rgba(139,92,246,.1)}[class~="bg-emerald-500/10"]{background:rgba(16,185,129,.1)}
        [class~="bg-gradient-to-br"]{background-image:linear-gradient(135deg,rgba(103,232,249,.12),rgba(139,92,246,.07))}
        [class~="from-cyan-300/10"],[class~="from-cyan-300/12"]{background-image:linear-gradient(135deg,rgba(103,232,249,.14),rgba(139,92,246,.07))}
        [class~="from-violet-300/10"]{background-image:linear-gradient(135deg,rgba(196,181,253,.12),rgba(103,232,249,.06))}
        [class~="text-white"]{color:#fff}[class~="text-slate-100"]{color:#f1f5f9}[class~="text-slate-200"]{color:#e2e8f0}[class~="text-slate-300"]{color:#cbd5e1}[class~="text-slate-400"]{color:#94a3b8}[class~="text-slate-500"]{color:#64748b}[class~="text-slate-600"]{color:#475569}
        [class~="text-cyan-200"]{color:#a5f3fc}[class~="text-cyan-300"]{color:#67e8f9}[class~="text-violet-100"]{color:#ede9fe}[class~="text-violet-200"]{color:#ddd6fe}[class~="text-violet-300"]{color:#c4b5fd}[class~="text-amber-200"]{color:#fde68a}[class~="text-rose-200"]{color:#fecdd3}[class~="text-rose-300"]{color:#fda4af}[class~="text-emerald-300"]{color:#6ee7b7}[class~="text-[#03101a]"]{color:#03101a}
        [class~="text-[9px]"]{font-size:9px}[class~="text-[10px]"]{font-size:10px}[class~="text-xs"]{font-size:.75rem}[class~="text-sm"]{font-size:.875rem}[class~="text-base"]{font-size:1rem}[class~="text-lg"]{font-size:1.125rem}[class~="text-xl"]{font-size:1.25rem}[class~="text-2xl"]{font-size:1.5rem}[class~="text-3xl"]{font-size:1.875rem}[class~="text-4xl"]{font-size:2.25rem}
        [class~="font-bold"]{font-weight:700}[class~="font-black"]{font-weight:900}[class~="uppercase"]{text-transform:uppercase}[class~="text-center"]{text-align:center}[class~="text-left"]{text-align:left}
        [class~="leading-tight"]{line-height:1.12}[class~="leading-5"]{line-height:1.25rem}[class~="leading-6"]{line-height:1.5rem}[class~="leading-7"]{line-height:1.75rem}[class~="leading-8"]{line-height:2rem}
        [class~="tracking-tight"]{letter-spacing:-.025em}[class~="tracking-[0.1em]"]{letter-spacing:.1em}[class~="tracking-[0.12em]"]{letter-spacing:.12em}[class~="tracking-[0.14em]"]{letter-spacing:.14em}[class~="tracking-[0.15em]"]{letter-spacing:.15em}[class~="tracking-[0.16em]"]{letter-spacing:.16em}[class~="tracking-[0.18em]"]{letter-spacing:.18em}[class~="tracking-[0.2em]"]{letter-spacing:.2em}[class~="tracking-[0.22em]"]{letter-spacing:.22em}[class~="tracking-[0.24em]"]{letter-spacing:.24em}[class~="tracking-[0.28em]"]{letter-spacing:.28em}
        [class~="overflow-hidden"]{overflow:hidden}[class~="overflow-y-auto"]{overflow-y:auto}[class~="truncate"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        [class~="outline-none"]{outline:none}[class~="backdrop-blur"],[class~="backdrop-blur-xl"]{backdrop-filter:blur(22px)}[class~="shadow-2xl"]{box-shadow:0 30px 90px rgba(0,0,0,.48),0 0 0 1px rgba(255,255,255,.025)}
        [class~="blur-[130px]"]{filter:blur(130px)}[class~="blur-[140px]"]{filter:blur(140px)}[class~="blur-[150px]"]{filter:blur(150px)}
        [class~="transition"],[class~="transition-all"]{transition:all .24s ease}
        [class~="animate-spin"]{animation:ta14Spin 1s linear infinite}@keyframes ta14Spin{to{transform:rotate(360deg)}}
        [class~="placeholder:text-slate-600"]::placeholder{color:#475569}
        [class~="focus:border-cyan-300/35"]:focus,[class~="focus:border-cyan-300/40"]:focus{border-color:rgba(103,232,249,.48);box-shadow:0 0 0 4px rgba(34,211,238,.08)}
        [class~="hover:border-cyan-300/30"]:hover{border-color:rgba(103,232,249,.42)}[class~="hover:text-white"]:hover{color:#fff}[class~="hover:bg-cyan-200"]:hover{background:#a5f3fc}
        [class~="group"]:hover [class~="group-hover:text-cyan-300"]{color:#67e8f9}[class~="group"]:hover [class~="group-hover:text-slate-300"]{color:#cbd5e1}[class~="group"]:hover [class~="group-hover:translate-x-1"]{transform:translateX(.25rem)}
      
        main section > article, main section > div[class*="rounded"], main article[class*="rounded"] { position:relative; overflow:hidden; box-shadow:0 20px 70px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.035); }
        main section > article::before, main article[class*="rounded"]::before { content:""; position:absolute; inset:0; pointer-events:none; background:linear-gradient(135deg,rgba(255,255,255,.035),transparent 34%); }
        main article[class*="rounded"]:hover { transform:translateY(-2px); border-color:rgba(103,232,249,.22); box-shadow:0 28px 90px rgba(0,0,0,.34),0 0 34px rgba(34,211,238,.045),inset 0 1px 0 rgba(255,255,255,.05); }
        main button[class*="rounded"], main a[class*="rounded"] { position:relative; overflow:hidden; box-shadow:inset 0 1px 0 rgba(255,255,255,.06); }
        main button[class*="rounded"]:hover, main a[class*="rounded"]:hover { transform:translateY(-1px); }
        textarea,input { width:100%; border:1px solid rgba(148,163,184,.16); background:rgba(0,0,0,.25); border-radius:1rem; padding:.9rem 1rem; outline:none; transition:.2s ease; }
      
        @media (min-width:640px){[class~="sm:flex-row"]{flex-direction:row}[class~="sm:grid-cols-2"]{grid-template-columns:repeat(2,minmax(0,1fr))}[class~="sm:items-start"]{align-items:flex-start}[class~="sm:justify-between"]{justify-content:space-between}[class~="sm:p-8"]{padding:2rem}[class~="sm:p-9"]{padding:2.25rem}[class~="sm:px-8"]{padding-left:2rem;padding-right:2rem}[class~="sm:text-lg"]{font-size:1.125rem}[class~="sm:text-3xl"]{font-size:1.875rem}[class~="sm:text-5xl"]{font-size:3rem}[class~="sm:text-6xl"]{font-size:3.75rem}}
        @media (min-width:768px){[class~="md:flex-row"]{flex-direction:row}[class~="md:grid-cols-2"]{grid-template-columns:repeat(2,minmax(0,1fr))}[class~="md:grid-cols-3"]{grid-template-columns:repeat(3,minmax(0,1fr))}[class~="md:items-center"]{align-items:center}[class~="md:items-end"]{align-items:flex-end}[class~="md:justify-between"]{justify-content:space-between}}
        @media (min-width:1024px){[class~="lg:grid-cols-2"]{grid-template-columns:repeat(2,minmax(0,1fr))}[class~="lg:px-10"]{padding-left:2.5rem;padding-right:2.5rem}[class~="lg:pt-0"]{padding-top:0}[class~="lg:hidden"]{display:none}}
        @media (min-width:1280px){[class~="xl:flex-row"]{flex-direction:row}[class~="xl:grid-cols-3"]{grid-template-columns:repeat(3,minmax(0,1fr))}[class~="xl:grid-cols-4"]{grid-template-columns:repeat(4,minmax(0,1fr))}[class~="xl:grid-cols-5"]{grid-template-columns:repeat(5,minmax(0,1fr))}[class~="xl:grid-cols-[.72fr_1.28fr]"]{grid-template-columns:.72fr 1.28fr}[class~="xl:grid-cols-[.8fr_1.2fr]"]{grid-template-columns:.8fr 1.2fr}[class~="xl:grid-cols-[1.1fr_.9fr]"]{grid-template-columns:1.1fr .9fr}[class~="xl:grid-cols-[1.25fr_.75fr]"]{grid-template-columns:1.25fr .75fr}[class~="xl:items-center"]{align-items:center}[class~="xl:items-end"]{align-items:flex-end}[class~="xl:justify-between"]{justify-content:space-between}}
        @media (max-width:767px){[class~="grid-cols-[.55fr_1fr_1fr]"]{grid-template-columns:1fr} [class~="grid-cols-[.55fr_1fr_1fr]"]>[class~="border-l"]{border-left:0;border-top:1px solid rgba(255,255,255,.1)} main{font-size:15px}}

        /* TA-14 dimensional architecture environment */
        .architecture-command-bar{position:sticky;top:0;z-index:35;background:linear-gradient(180deg,rgba(2,6,17,.96),rgba(3,11,23,.84));box-shadow:0 18px 55px rgba(0,0,0,.36),inset 0 -1px 0 rgba(103,232,249,.08)}
        .architecture-command-bar::after{content:"";position:absolute;left:5%;right:5%;bottom:-1px;height:1px;background:linear-gradient(90deg,transparent,rgba(103,232,249,.8),rgba(196,181,253,.6),transparent);filter:drop-shadow(0 0 8px rgba(103,232,249,.8))}
        .architecture-hero-stage{position:relative;min-height:600px;padding:clamp(1.5rem,4vw,4.5rem);border:1px solid rgba(103,232,249,.18);border-radius:2.4rem;background:linear-gradient(135deg,rgba(5,18,34,.96),rgba(4,10,24,.86) 48%,rgba(22,13,48,.76));box-shadow:0 42px 120px rgba(0,0,0,.52),inset 0 1px 0 rgba(255,255,255,.08),inset 0 -70px 110px rgba(0,0,0,.28);overflow:hidden;isolation:isolate}
        .architecture-hero-stage::before{content:"";position:absolute;inset:-2px;z-index:-2;background:conic-gradient(from 210deg at 50% 50%,rgba(103,232,249,.25),transparent 16%,rgba(139,92,246,.2) 34%,transparent 58%,rgba(16,185,129,.16) 74%,transparent);filter:blur(34px);opacity:.9}
        .architecture-hero-stage::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(rgba(103,232,249,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(103,232,249,.045) 1px,transparent 1px);background-size:34px 34px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.95),transparent 92%);transform:perspective(900px) rotateX(58deg) scale(1.45) translateY(20%);transform-origin:bottom;opacity:.65}
        .architecture-hero-copy{position:relative;z-index:3;align-self:center;text-shadow:0 8px 40px rgba(0,0,0,.65)}
        .architecture-hero-copy h2{font-size:clamp(3rem,6vw,6.7rem)!important;line-height:.92!important;max-width:15ch!important;letter-spacing:-.055em!important;background:linear-gradient(180deg,#fff 0%,#d9f8ff 48%,#9eeafa 100%);-webkit-background-clip:text;background-clip:text;color:transparent!important;filter:drop-shadow(0 16px 36px rgba(0,0,0,.45))}
        .architecture-principle-core{position:relative;z-index:4;align-self:center;min-height:310px;display:flex;flex-direction:column;justify-content:center;border-color:rgba(196,181,253,.28)!important;background:linear-gradient(145deg,rgba(20,30,58,.88),rgba(8,13,29,.78))!important;box-shadow:0 35px 90px rgba(0,0,0,.45),0 0 60px rgba(139,92,246,.12),inset 0 1px 0 rgba(255,255,255,.08)!important;transform:perspective(1200px) rotateY(-4deg) translateZ(20px)}
        .architecture-principle-core::after{content:"AEA / 24";position:absolute;right:1.2rem;top:1rem;font-size:.65rem;font-weight:900;letter-spacing:.24em;color:rgba(196,181,253,.48)}
        .architecture-principle-core p:nth-child(2){font-size:clamp(2rem,3.2vw,3.8rem)!important;line-height:.95!important}
        .architecture-chain-horizon{grid-column:1/-1;position:relative;z-index:5;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:.75rem;margin-top:1.2rem;padding:1.35rem;border-radius:1.7rem;border:1px solid rgba(103,232,249,.15);background:rgba(1,8,19,.76);box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 25px 70px rgba(0,0,0,.35);backdrop-filter:blur(20px)}
        .architecture-chain-beam{position:absolute;left:5%;right:5%;top:50%;height:2px;background:linear-gradient(90deg,rgba(103,232,249,.12),#67e8f9 35%,#c4b5fd 68%,rgba(196,181,253,.12));box-shadow:0 0 18px rgba(103,232,249,.7);transform:translateY(-50%)}
        .architecture-chain-node{position:relative;z-index:2;min-height:96px;border:1px solid rgba(255,255,255,.09);border-radius:1rem;background:linear-gradient(180deg,rgba(13,28,49,.95),rgba(5,12,25,.94));color:#dcecff;padding:.8rem .55rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.28rem;box-shadow:0 14px 28px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.04);transition:.3s cubic-bezier(.2,.8,.2,1)}
        .architecture-chain-node::before{content:"";position:absolute;top:-7px;width:13px;height:13px;border-radius:50%;background:#071323;border:2px solid #67e8f9;box-shadow:0 0 0 5px rgba(103,232,249,.08),0 0 20px rgba(103,232,249,.65)}
        .architecture-chain-node:hover,.architecture-chain-node.is-active{transform:translateY(-8px) scale(1.025);border-color:rgba(103,232,249,.48);background:linear-gradient(180deg,rgba(16,52,74,.96),rgba(8,19,36,.97));box-shadow:0 24px 46px rgba(0,0,0,.45),0 0 32px rgba(34,211,238,.15),inset 0 1px 0 rgba(255,255,255,.08)}
        .architecture-chain-node span{font-size:.62rem;font-weight:900;letter-spacing:.18em;color:#67e8f9}.architecture-chain-node strong{font-size:.78rem}.architecture-chain-node small{font-size:.48rem;letter-spacing:.18em;color:#64748b}
        .architecture-anchor-deck{position:relative;padding:clamp(1rem,2vw,2rem);border-radius:2rem;background:linear-gradient(180deg,rgba(5,16,29,.68),rgba(2,8,18,.35));border:1px solid rgba(255,255,255,.055);box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
        .architecture-anchor-card{min-height:230px!important;position:relative;isolation:isolate;background:linear-gradient(155deg,rgba(14,31,52,.92),rgba(5,12,26,.96))!important;box-shadow:0 24px 55px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.05)!important;transform:perspective(1000px) translateZ(0);transition:.35s cubic-bezier(.2,.8,.2,1)!important}
        .architecture-anchor-card::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(circle at 15% 15%,rgba(103,232,249,.14),transparent 34%),linear-gradient(145deg,transparent 45%,rgba(196,181,253,.06));opacity:.75}
        .architecture-anchor-card::after{content:"";position:absolute;left:1.25rem;right:1.25rem;bottom:.9rem;height:2px;background:linear-gradient(90deg,#67e8f9,rgba(196,181,253,.2),transparent);box-shadow:0 0 14px rgba(103,232,249,.5);transform:scaleX(.2);transform-origin:left;transition:.35s ease}
        .architecture-anchor-card:hover{transform:perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-10px) translateZ(22px)!important;box-shadow:0 38px 85px rgba(0,0,0,.5),0 0 45px rgba(34,211,238,.12),inset 0 1px 0 rgba(255,255,255,.08)!important}.architecture-anchor-card:hover::after{transform:scaleX(1)}
        .architecture-anchor-card h4{font-size:1.55rem!important}.architecture-anchor-card p{font-size:.92rem!important}
        .architecture-anchor-focus,.architecture-runtime-map{min-height:390px;display:flex;flex-direction:column;justify-content:center;background:linear-gradient(145deg,rgba(8,34,54,.92),rgba(5,12,27,.96))!important;box-shadow:0 34px 80px rgba(0,0,0,.44),0 0 45px rgba(34,211,238,.07),inset 0 1px 0 rgba(255,255,255,.06)!important}
        .architecture-runtime-map{background:linear-gradient(145deg,rgba(16,17,43,.92),rgba(5,12,27,.97))!important}
        .architecture-runtime-console{position:relative;padding:1rem;border-radius:2rem;background:linear-gradient(180deg,rgba(4,14,27,.72),rgba(2,8,18,.45));border:1px solid rgba(103,232,249,.08)}
        .architecture-runtime-rail{position:sticky;top:118px;max-height:calc(100vh - 145px);background:linear-gradient(180deg,rgba(7,20,36,.97),rgba(4,10,22,.98))!important;box-shadow:0 32px 80px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.05)!important}
        .architecture-runtime-core{position:relative;min-height:430px;background:radial-gradient(circle at 82% 18%,rgba(196,181,253,.14),transparent 31%),radial-gradient(circle at 14% 88%,rgba(103,232,249,.12),transparent 36%),linear-gradient(145deg,rgba(7,29,49,.96),rgba(9,10,31,.96))!important;box-shadow:0 42px 100px rgba(0,0,0,.52),0 0 70px rgba(34,211,238,.08),inset 0 1px 0 rgba(255,255,255,.07)!important}
        .architecture-runtime-core::after{content:"LIVE RUNTIME";position:absolute;right:1.4rem;bottom:1.15rem;font-size:.55rem;font-weight:900;letter-spacing:.24em;color:rgba(103,232,249,.38)}
        main article[class*="rounded"],main button[class*="rounded"]{will-change:transform}
        @keyframes architecturePulse{0%,100%{opacity:.45;transform:scale(.98)}50%{opacity:.95;transform:scale(1.02)}}
        .architecture-principle-core::before{content:"";position:absolute;right:1.2rem;bottom:1.2rem;width:74px;height:74px;border-radius:50%;border:1px solid rgba(196,181,253,.2);box-shadow:0 0 35px rgba(139,92,246,.18),inset 0 0 25px rgba(103,232,249,.08);animation:architecturePulse 4s ease-in-out infinite}
        @media(max-width:1100px){.architecture-chain-horizon{grid-template-columns:repeat(4,minmax(0,1fr))}.architecture-chain-beam{display:none}.architecture-principle-core{transform:none}.architecture-runtime-rail{position:relative;top:auto;max-height:none}}
        @media(max-width:680px){.architecture-hero-stage{min-height:auto;padding:1.2rem;border-radius:1.5rem}.architecture-hero-copy h2{font-size:2.8rem!important}.architecture-chain-horizon{grid-template-columns:repeat(2,minmax(0,1fr));padding:.8rem}.architecture-anchor-card{min-height:190px!important}.architecture-principle-core{min-height:260px}}

      `}</style>
      
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 top-16 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute right-[-10rem] top-[28rem] h-[38rem] w-[38rem] rounded-full bg-violet-500/10 blur-[150px]" />
        <div className="absolute bottom-[-16rem] left-[38%] h-[34rem] w-[34rem] rounded-full bg-emerald-500/10 blur-[140px]" />
      </div>

      <button type="button" onClick={() => setMobileRailOpen((v) => !v)} className="fixed left-4 top-4 z-50 rounded-xl border border-cyan-300/30 bg-[#07111f]/95 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-200 shadow-2xl backdrop-blur lg:hidden">
        {mobileRailOpen ? "Close Academy" : "Academy Actions"}
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-[310px] border-r border-white/10 bg-[#040a14]/96 p-5 shadow-2xl backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${mobileRailOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <Link href="/academy" className="flex items-center gap-3 border-b border-white/10 pb-5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-sm font-black tracking-[0.14em] text-cyan-200">TA</span>
            <span><strong className="block text-base text-white">TA-14 Academy</strong><small className="text-xs text-slate-400">Seventh major door</small></span>
          </Link>

          <div className="mt-5 rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-300/12 to-violet-300/8 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">Primary action</p>
            <h2 className="mt-2 text-lg font-black text-white">Inspect the complete chain.</h2>
            <p className="mt-2 text-xs leading-5 text-slate-300">Move from the eight visible anchors into the verified complete 24-link runtime architecture.</p>
            <button type="button" onClick={() => { navigateToView("runtime", "architecture-workspace"); setMobileRailOpen(false); }} className="mt-4 w-full rounded-xl bg-cyan-300 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#03101a] transition hover:bg-cyan-200">Open 24-link runtime</button>
          </div>

          <nav className="mt-5 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Academy institutional navigation">
            {railItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileRailOpen(false)} className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${item.href === "/academy/architecture-explorer" ? "border-cyan-300/25 bg-cyan-300/10" : "border-transparent hover:border-white/10 hover:bg-white/[0.04]"}`}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[10px] font-black tracking-[0.1em] text-cyan-200">{item.glyph}</span>
                <span className="min-w-0 flex-1"><strong className="block truncate text-xs text-white">{item.label}</strong><small className="text-[10px] uppercase tracking-[0.14em] text-slate-500 group-hover:text-slate-300">{item.action}</small></span>
                <span className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300">→</span>
              </Link>
            ))}
          </nav>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between text-xs"><span className="text-slate-400">Explorer progress</span><strong className="text-white">{progress}%</strong></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${progress}%` }} /></div>
            <button type="button" onClick={saveProgress} className="mt-3 w-full rounded-lg border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-300 hover:border-cyan-300/30 hover:text-white">{saveStatus === "saved" ? "Progress saved" : saveStatus === "error" ? "Save unavailable" : "Save progress"}</button>
          </div>
        </div>
      </aside>

      <div className="relative lg:pl-[310px]">
        <header className="architecture-command-bar border-b border-white/10 bg-[#020611]/85 px-5 py-6 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="pl-0 pt-12 lg:pt-0">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">TA-14 Academy · Architecture Explorer</p>
              <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">From visible anchors to runtime governance.</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {[ ["anchors","Eight anchors"], ["runtime","24-link runtime"], ["comparison","Zero Trust comparison"], ["scenarios","Failure scenarios"], ["glossary","Glossary"] ].map(([id,label]) => (
                <button key={id} type="button" onClick={() => navigateToView(id as ViewMode, "architecture-workspace")} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${viewMode === id ? "border-cyan-300/40 bg-cyan-300/12 text-cyan-100" : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}>{label}</button>
              ))}
            </div>
          </div>
        </header>

        <div id="architecture-workspace" className="mx-auto max-w-[1500px] scroll-mt-8 px-5 py-10 sm:px-8 lg:px-10">
          <section className="architecture-hero-stage grid gap-8 xl:grid-cols-[1.25fr_.75fr] xl:items-end">
            <div className="architecture-hero-copy">
              <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Architecture orientation</span>
              <h2 className="mt-6 max-w-5xl text-4xl font-black tracking-tight text-white sm:text-6xl">See how consequential execution earns the right to proceed.</h2>
              <p className="mt-6 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">The eight visible anchors provide public orientation. The verified complete 24-link runtime chain provides the operational depth required to test evidence, authority, continuity, boundary, correspondence, and outcome before consequence becomes real.</p>
            </div>
            <div className="architecture-principle-core rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">Governing principle</p>
              <p className="mt-4 text-2xl font-black leading-tight text-white">No admissible evidence.<br />No admissible execution.</p>
              <p className="mt-4 text-sm leading-6 text-slate-400">The Academy may explain, guide, and challenge. It may never fabricate evidence, invent authority, erase uncertainty, or silently select a favorable determination.</p>
            </div>
            <div className="architecture-chain-horizon">
              <div className="architecture-chain-beam" />
              {anchors.map((anchor, index) => (
                <button key={`hero-${anchor.id}`} type="button" onClick={() => selectAnchor(anchor.id)} className={`architecture-chain-node ${selectedAnchor === anchor.id ? "is-active" : ""}`}>
                  <span>{anchor.number}</span>
                  <strong>{anchor.title}</strong>
                  <small>{index === 0 ? "BEGIN" : index === anchors.length - 1 ? "CLOSE" : "VERIFY"}</small>
                </button>
              ))}
            </div>
          </section>

          {viewMode === "anchors" && (
            <section className="architecture-anchor-deck mt-14">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
                <div><p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Public orientation</p><h3 className="mt-2 text-3xl font-black text-white">The eight visible anchors</h3></div>
                <p className="max-w-2xl text-sm leading-6 text-slate-400">Select an anchor to inspect its purpose, corresponding runtime links, and the failure it prevents.</p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {anchors.map((anchor) => (
                  <button key={anchor.id} type="button" onClick={() => selectAnchor(anchor.id)} className={`architecture-anchor-card rounded-2xl border p-5 text-left transition ${selectedAnchor === anchor.id ? "border-cyan-300/45 bg-cyan-300/10 shadow-[0_0_40px_rgba(34,211,238,0.08)]" : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"}`}>
                    <div className="flex items-center justify-between"><span className="text-xs font-black tracking-[0.2em] text-cyan-300">{anchor.number}</span><span className="text-slate-600">→</span></div>
                    <h4 className="mt-8 text-xl font-black text-white">{anchor.title}</h4>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{anchor.description}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
                <article className="architecture-anchor-focus rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 to-transparent p-7">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Anchor {activeAnchor.number}</p>
                  <h3 className="mt-3 text-4xl font-black text-white">{activeAnchor.title}</h3>
                  <p className="mt-5 text-base leading-8 text-slate-300">{activeAnchor.detail}</p>
                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Architectural question</p><p className="mt-3 text-lg font-bold text-white">What must be true here before the route may continue?</p></div>
                </article>
                <article className="architecture-runtime-map rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                  <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">Runtime correspondence</p><h3 className="mt-2 text-2xl font-black text-white">Links governed by this anchor</h3></div><button type="button" onClick={() => navigateToView("runtime", "architecture-workspace")} className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:border-cyan-300/30 hover:text-white">Open all 24 →</button></div>
                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {runtimeLinks.filter((link) => anchorCorrespondence[selectedAnchor].includes(link.id)).map((link) => (
                      <button key={link.id} type="button" onClick={() => { setSelectedLink(link.id); navigateToView("runtime", "architecture-workspace"); }} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-cyan-300/30">
                        <span className="text-[10px] font-black tracking-[0.18em] text-cyan-300">{link.number}</span><strong className="mt-2 block text-sm text-white">{link.title}</strong><small className="mt-1 block text-xs leading-5 text-slate-500">{link.eyebrow}</small>
                      </button>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          )}

          {viewMode === "runtime" && (
            <section className="architecture-runtime-console mt-14">
              <div className="grid gap-6 xl:grid-cols-[.72fr_1.28fr]">
                <aside className="architecture-runtime-rail rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Verified complete chain</p><h3 className="mt-2 text-2xl font-black text-white">24 runtime links</h3></div><strong className="text-sm text-cyan-200">{progress}%</strong></div>
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the architecture" className="mt-5 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40" />
                  <div className="mt-4 max-h-[780px] space-y-2 overflow-y-auto pr-1">
                    {filteredLinks.map((link) => (
                      <button key={link.id} type="button" onClick={() => setSelectedLink(link.id)} className={`w-full rounded-xl border p-3 text-left transition ${selectedLink === link.id ? "border-cyan-300/35 bg-cyan-300/10" : "border-white/5 bg-black/15 hover:border-white/15"}`}>
                        <div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-[10px] font-black text-cyan-200">{link.number}</span><span className="min-w-0 flex-1"><strong className="block text-sm text-white">{link.title}</strong><small className="block truncate text-[10px] uppercase tracking-[0.12em] text-slate-500">{link.eyebrow}</small></span>{completedLinks.includes(link.id) && <span className="text-emerald-300">✓</span>}</div>
                      </button>
                    ))}
                  </div>
                </aside>
                <div className="space-y-6">
                  <article className="architecture-runtime-core rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-white/[0.03] to-violet-300/5 p-7 sm:p-9">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Runtime link {activeLink.number}</p><h3 className="mt-3 text-4xl font-black text-white sm:text-5xl">{activeLink.title}</h3><p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-violet-200">{activeLink.eyebrow}</p></div><button type="button" onClick={() => toggleLink(activeLink.id)} className={`rounded-xl border px-5 py-3 text-xs font-black uppercase tracking-[0.16em] ${completedLinks.includes(activeLink.id) ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200" : "border-white/10 text-slate-300 hover:border-cyan-300/30 hover:text-white"}`}>{completedLinks.includes(activeLink.id) ? "Marked complete" : "Mark explored"}</button></div>
                    <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-200">{activeLink.description}</p>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                      {[ ["Input","What enters this link must be attributable and bounded."], ["Test","The route asks whether the required condition is actually satisfied."], ["Output","The result is preserved as support, failure, HOLD, DENY, or escalation."] ].map(([title,text]) => <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{title}</p><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p></div>)}
                    </div>
                  </article>
                  <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                      Runtime dossier
                    </p>
                    <h4 className="mt-3 text-2xl font-black text-white">
                      {activeDossier.question}
                    </h4>
                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                          Required evidence
                        </p>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                          {activeDossier.requiredEvidence}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-rose-300/15 bg-rose-300/[0.05] p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-200">
                          Failure mode
                        </p>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                          {activeDossier.failureMode}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.05] p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
                          Gate response
                        </p>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                          {activeDossier.gateResponse}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.05] p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
                          Teaching note
                        </p>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                          {activeDossier.teachingNote}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 xl:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
                        <h5 className="text-sm font-black text-white">Inspection questions</h5>
                        <div className="mt-4 space-y-3">
                          {activeDossier.inspectionQuestions.map((item, index) => (
                            <div key={item} className="flex gap-3 text-xs leading-5 text-slate-400">
                              <span className="font-black text-cyan-300">{String(index + 1).padStart(2, "0")}</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
                        <h5 className="text-sm font-black text-white">Evidence examples</h5>
                        <div className="mt-4 space-y-3">
                          {activeDossier.evidenceExamples.map((item, index) => (
                            <div key={item} className="flex gap-3 text-xs leading-5 text-slate-400">
                              <span className="font-black text-emerald-300">{String(index + 1).padStart(2, "0")}</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
                        <h5 className="text-sm font-black text-white">Failure signals</h5>
                        <div className="mt-4 space-y-3">
                          {activeDossier.failureSignals.map((item, index) => (
                            <div key={item} className="flex gap-3 text-xs leading-5 text-slate-400">
                              <span className="font-black text-rose-300">{String(index + 1).padStart(2, "0")}</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>

                  <article className="rounded-3xl border border-violet-300/15 bg-violet-300/[0.04] p-7">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">
                      Study checkpoint {activeStudyPrompt.number}
                    </p>
                    <h4 className="mt-3 text-2xl font-black text-white">
                      {activeStudyPrompt.title}
                    </h4>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Explain</p>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{activeStudyPrompt.prompt}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Challenge</p>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{activeStudyPrompt.challenge}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Preserve</p>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{activeStudyPrompt.preservation}</p>
                      </div>
                    </div>
                  </article>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Learner note</p><textarea value={notes[activeLink.id] || ""} onChange={(event) => { setNotes((current) => ({ ...current, [activeLink.id]: event.target.value })); setSaveStatus("idle"); }} placeholder="What must remain true at this link? What failure would stop the route?" className="mt-4 min-h-52 w-full rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/35" /></article>
                    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">Failure posture</p><h4 className="mt-3 text-2xl font-black text-white">Unresolved means unresolved.</h4><p className="mt-4 text-sm leading-7 text-slate-400">The architecture does not convert uncertainty into approval. A missing record, stale condition, invalid authority, broken boundary, or correspondence gap remains visible and may produce HOLD, DENY, or ESCALATE.</p><Link href="/academy/simulator" className="mt-6 inline-flex rounded-xl border border-violet-300/25 bg-violet-300/10 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-violet-100">Test this link in simulation →</Link></article>
                  </div>
                </div>
              </div>
            </section>
          )}

          {viewMode === "comparison" && (
            <section className="mt-14">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Control distinction</p><h3 className="mt-3 text-3xl font-black text-white">Zero Trust and admissible execution answer different questions.</h3><p className="mt-4 max-w-4xl text-base leading-7 text-slate-400">Zero Trust asks whether an actor and request should be trusted. Admissible execution asks whether this specific action has earned the right to bind to reality now.</p>
                <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
                  <div className="grid grid-cols-[.55fr_1fr_1fr] bg-white/[0.05] text-xs font-black uppercase tracking-[0.15em] text-slate-400"><div className="p-4">Dimension</div><div className="border-l border-white/10 p-4">Zero Trust</div><div className="border-l border-white/10 p-4 text-cyan-200">Admissible execution</div></div>
                  {comparisons.map((row) => <div key={row.topic} className="grid grid-cols-[.55fr_1fr_1fr] border-t border-white/10 text-sm"><div className="p-4 font-bold text-white">{row.topic}</div><div className="border-l border-white/10 p-4 leading-6 text-slate-400">{row.zeroTrust}</div><div className="border-l border-white/10 bg-cyan-300/[0.03] p-4 leading-6 text-slate-300">{row.admissibleExecution}</div></div>)}
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">{admissibilityChecks.slice(0,5).map((item, index) => <article key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-5"><span className="text-xs font-black text-cyan-300">0{index + 1}</span><h4 className="mt-6 text-lg font-black text-white">{item.title}</h4><p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p></article>)}</div>
            </section>
          )}

          {viewMode === "scenarios" && (
            <section className="mt-14">
              <div><p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Architecture in practice</p><h3 className="mt-3 text-3xl font-black text-white">Find the earliest failure before consequence.</h3></div>
              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {scenarios.map((scenario, index) => <article key={scenario.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><div className="flex items-center justify-between"><span className="text-xs font-black tracking-[0.2em] text-cyan-300">SCENARIO {String(index + 1).padStart(2, "0")}</span><span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-amber-200">Find the gate</span></div><h4 className="mt-5 text-2xl font-black text-white">{scenario.title}</h4><p className="mt-4 text-sm leading-7 text-slate-300">{scenario.situation}</p><div className="mt-6 rounded-2xl border border-rose-300/15 bg-rose-300/[0.06] p-5"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-200">Earliest architectural failure</p><p className="mt-3 text-sm leading-6 text-slate-300">{scenario.result}</p></div></article>)}
              </div>
            </section>
          )}

          {viewMode === "glossary" && (
            <section className="mt-14">
              <div><p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Shared language</p><h3 className="mt-3 text-3xl font-black text-white">Architecture glossary</h3></div>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{glossary.map((item, index) => <article key={item.term} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><span className="text-[10px] font-black tracking-[0.18em] text-cyan-300">{String(index + 1).padStart(2, "0")}</span><h4 className="mt-5 text-xl font-black text-white">{item.term}</h4><p className="mt-3 text-sm leading-6 text-slate-400">{item.definition}</p></article>)}</div>
            </section>
          )}

          <section className="mt-16">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                  Constitutional operating principles
                </p>
                <h3 className="mt-3 text-3xl font-black text-white">
                  Twenty-four rules for consequence-bearing execution.
                </h3>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-slate-400">
                These principles do not replace the runtime chain. They explain the discipline each link protects and the reason the route cannot silently skip ahead.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {architecturePrinciples.map((principle) => (
                <article
                  key={principle.number}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-[0.2em] text-cyan-300">
                      {principle.number}
                    </span>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
                      Operating rule
                    </span>
                  </div>
                  <h4 className="mt-6 text-xl font-black text-white">
                    {principle.title}
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {principle.description}
                  </p>
                  <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-200">
                      Inspection question
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {principle.question}
                    </p>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-slate-500">
                    {principle.consequence}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
            <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Runtime readiness</p><h3 className="mt-3 text-3xl font-black text-white">Ten questions before consequence.</h3>
              <div className="mt-6 grid gap-3 md:grid-cols-2">{admissibilityChecks.map((item, index) => <div key={item.title} className="flex gap-4 rounded-2xl border border-white/10 bg-black/15 p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-[10px] font-black text-cyan-200">{String(index + 1).padStart(2, "0")}</span><div><h4 className="text-sm font-black text-white">{item.title}</h4><p className="mt-2 text-xs leading-5 text-slate-500">{item.description}</p></div></div>)}</div>
            </article>
            <article className="rounded-3xl border border-violet-300/20 bg-gradient-to-br from-violet-300/10 to-cyan-300/5 p-7">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">Continue the route</p><h3 className="mt-3 text-3xl font-black text-white">Architecture becomes competency through practice.</h3><p className="mt-5 text-sm leading-7 text-slate-300">Move from inspection into route construction, simulation, review, assessment, and preserved credential evidence. Completion alone does not prove capability.</p>
              <div className="mt-7 space-y-3">
                <Link href="/academy/route-construction-lab" className="flex items-center justify-between rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black text-[#03101a]"><span>Build a governed route</span><span>→</span></Link>
                <Link href="/academy/simulator" className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm font-black text-white hover:border-cyan-300/30"><span>Test runtime conditions</span><span>→</span></Link>
                <Link href="/academy/assessment" className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm font-black text-white hover:border-cyan-300/30"><span>Prove bounded competency</span><span>→</span></Link>
              </div>
            </article>
          </section>

          <footer className="mt-16 flex flex-col gap-5 border-t border-white/10 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <div><strong className="block text-white">TA-14 Academy</strong><span>Seventh major door of the TA-14 AI Governance Exchange</span></div>
            <div className="flex flex-wrap gap-4"><Link href="/academy" className="hover:text-white">Academy Home</Link><Link href="/academy/mission-control" className="hover:text-white">Mission Control</Link><Link href="/" className="hover:text-white">Return to Exchange</Link></div>
          </footer>
        </div>
      </div>

      {!hydrated && <div className="fixed inset-0 z-[100] grid place-items-center bg-[#020611]"><div className="text-center"><div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-cyan-300" /><p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Opening architecture</p></div></div>}
    </main>
  );
}
