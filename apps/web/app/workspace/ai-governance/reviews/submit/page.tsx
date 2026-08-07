'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type MessageCategory =
  | 'GENERAL_INQUIRY'
  | 'PARTICIPANT_CONTACT'
  | 'REVIEW_REQUEST'
  | 'EVIDENCE_QUESTION'
  | 'EVIDENCE_CHALLENGE'
  | 'FACTUAL_CORRECTION'
  | 'TECHNICAL_COMMENT'
  | 'REPLICATION_REQUEST'
  | 'DEMONSTRATION_REQUEST'
  | 'COLLABORATION_INQUIRY'
  | 'PUBLICATION_REFERENCE'
  | 'RIGHTS_OR_ATTRIBUTION'
  | 'DISPUTE_NOTICE'
  | 'REGISTRY_QUESTION'
  | 'FINDING_QUESTION'
  | 'ARTIFACT_QUESTION'
  | 'VERSION_LINEAGE_QUESTION'
  | 'OTHER';

type RecordVisibility =
  | 'PUBLIC'
  | 'CONTROLLED'
  | 'PRIVATE'
  | 'PUBLIC_METADATA_ONLY';

type PublicationPermission =
  | 'PUBLICATION_ALLOWED'
  | 'PUBLICATION_ALLOWED_WITH_ATTRIBUTION'
  | 'PUBLICATION_METADATA_ONLY'
  | 'CONTROLLED_USE_ONLY'
  | 'PRIVATE'
  | 'REQUIRES_FURTHER_APPROVAL';

type SubmissionIntent =
  | 'PARTICIPANT_REVIEW'
  | 'PARTICIPANT_RESPONSE'
  | 'INDEPENDENT_REVIEW'
  | 'EVIDENCE_CHALLENGE'
  | 'FACTUAL_CORRECTION'
  | 'TECHNICAL_COMMENT'
  | 'REPLICATION_REQUEST'
  | 'DEMONSTRATION_REQUEST'
  | 'EXTERNAL_PUBLICATION'
  | 'REGISTRY_QUESTION'
  | 'FINDING_QUESTION'
  | 'ARTIFACT_QUESTION'
  | 'COLLABORATION_INQUIRY'
  | 'RIGHTS_OR_ATTRIBUTION'
  | 'DISPUTE_NOTICE'
  | 'GENERAL_INQUIRY';

type SupportingLink = {
  id: string;
  label: string;
  url: string;
};

type FormState = {
  intent: SubmissionIntent;
  submitterName: string;
  submitterEmail: string;
  submitterOrganization: string;
  submitterRole: string;
  subject: string;
  messageBody: string;
  registryIdentifier: string;
  governanceEntityName: string;
  governanceVersion: string;
  demonstrationIdentifier: string;
  caseIdentifier: string;
  findingIdentifier: string;
  artifactIdentifier: string;
  relatedReviewRecordId: string;
  visibility: RecordVisibility;
  publicationPermission: PublicationPermission;
  conflictDisclosure: string;
  affiliationDisclosure: string;
  responseRequested: boolean;
  attributionConfirmed: boolean;
  recordBoundaryConfirmed: boolean;
  publicationBoundaryConfirmed: boolean;
};

type SubmittedMessage = {
  id: string;
  message_identifier: string | null;
  category: MessageCategory;
  subject: string;
  registry_identifier: string | null;
  demonstration_identifier: string | null;
  case_identifier: string | null;
  finding_identifier: string | null;
  artifact_identifier: string | null;
  related_review_record_id: string | null;
  visibility: RecordVisibility;
  publication_permission: PublicationPermission;
  status: string;
  disposition: string | null;
  response_requested: boolean;
  submitted_at: string;
  integrity_digest: string | null;
};

type IntentDefinition = {
  value: SubmissionIntent;
  number: string;
  title: string;
  category: MessageCategory;
  eyebrow: string;
  description: string;
  recordBound: boolean;
  publicRecordCandidate: boolean;
  subjectPrefix: string;
  helper: string;
};

const DRAFT_KEY = 'ta14-reviews-responses-governed-message-draft-v1';
const MAX_SUBJECT_LENGTH = 240;
const MAX_MESSAGE_LENGTH = 30000;
const MAX_DISCLOSURE_LENGTH = 8000;
const MAX_LINKS = 12;

const intentDefinitions: IntentDefinition[] = [
  {
    value: 'PARTICIPANT_REVIEW',
    number: '01',
    title: 'Participant Review',
    category: 'PARTICIPANT_CONTACT',
    eyebrow: 'PARTICIPANT VOICE',
    description:
      'Preserve an attributable review from a steward, architect, owner, or authorized participant associated with a governed record.',
    recordBound: true,
    publicRecordCandidate: true,
    subjectPrefix: 'Participant Review — ',
    helper:
      'A participant review remains the participant\'s own voice. It does not become a TA-14 finding or certification through receipt.',
  },
  {
    value: 'PARTICIPANT_RESPONSE',
    number: '02',
    title: 'Participant Response',
    category: 'PARTICIPANT_CONTACT',
    eyebrow: 'RESPONSE TO A GOVERNED RECORD',
    description:
      'Respond to a TA-14 finding, artifact, challenge, review, or other governed record without rewriting the underlying record.',
    recordBound: true,
    publicRecordCandidate: true,
    subjectPrefix: 'Participant Response — ',
    helper:
      'Agreement, disagreement, qualification, clarification, and interpretation remain separate from the underlying TA-14 record.',
  },
  {
    value: 'INDEPENDENT_REVIEW',
    number: '03',
    title: 'Independent Review',
    category: 'REVIEW_REQUEST',
    eyebrow: 'INDEPENDENT ANALYSIS',
    description:
      'Submit attributable independent analysis of a governance entity, demonstration, finding, artifact, evidence package, or methodology.',
    recordBound: true,
    publicRecordCandidate: true,
    subjectPrefix: 'Independent Review — ',
    helper:
      'TA-14 may preserve, publish, respond to, dispute, accept, or decline to adopt conclusions. Submission does not make the review a TA-14 finding.',
  },
  {
    value: 'EVIDENCE_CHALLENGE',
    number: '04',
    title: 'Evidence Challenge',
    category: 'EVIDENCE_CHALLENGE',
    eyebrow: 'CHALLENGE A CLAIM OR EVIDENCE BASIS',
    description:
      'Identify a specific evidentiary issue associated with a registered claim, governed demonstration, execution artifact, or finding.',
    recordBound: true,
    publicRecordCandidate: true,
    subjectPrefix: 'Evidence Challenge — ',
    helper:
      'Identify the record, the claim or finding at issue, the evidentiary basis, supporting sources, and requested disposition if any.',
  },
  {
    value: 'FACTUAL_CORRECTION',
    number: '05',
    title: 'Factual Correction Request',
    category: 'FACTUAL_CORRECTION',
    eyebrow: 'OBJECTIVE RECORD ACCURACY',
    description:
      'Request correction of an objective record error such as an identifier, version, timestamp, hash, artifact description, or attribution.',
    recordBound: true,
    publicRecordCandidate: true,
    subjectPrefix: 'Factual Correction Request — ',
    helper:
      'This pathway concerns objective record accuracy. It is not a pathway for negotiating an independent TA-14 determination.',
  },
  {
    value: 'TECHNICAL_COMMENT',
    number: '06',
    title: 'Technical Comment',
    category: 'TECHNICAL_COMMENT',
    eyebrow: 'SUBSTANTIVE TECHNICAL ANALYSIS',
    description:
      'Submit attributable technical analysis that does not rise to the level of a formal evidence challenge or independent review.',
    recordBound: true,
    publicRecordCandidate: true,
    subjectPrefix: 'Technical Comment — ',
    helper:
      'Technical comments remain attributable and may be linked to the relevant governed record.',
  },
  {
    value: 'REPLICATION_REQUEST',
    number: '07',
    title: 'Replication Request',
    category: 'REPLICATION_REQUEST',
    eyebrow: 'REQUEST REPRODUCIBLE EXAMINATION',
    description:
      'Request that a registered claim, architecture, behavior, or consequence-bearing route be replicated or independently re-examined.',
    recordBound: true,
    publicRecordCandidate: true,
    subjectPrefix: 'Replication Request — ',
    helper:
      'A replication request does not guarantee acceptance into a future review or demonstration process.',
  },
  {
    value: 'DEMONSTRATION_REQUEST',
    number: '08',
    title: 'Demonstration Request',
    category: 'DEMONSTRATION_REQUEST',
    eyebrow: 'REQUEST A GOVERNED DEMONSTRATION',
    description:
      'Propose a bounded scenario, route, claim, or runtime behavior for possible examination through a future governed demonstration.',
    recordBound: false,
    publicRecordCandidate: true,
    subjectPrefix: 'Demonstration Request — ',
    helper:
      'Describe the scenario and what would need to be preserved or observed. Submission does not guarantee acceptance.',
  },
  {
    value: 'EXTERNAL_PUBLICATION',
    number: '09',
    title: 'External Publication Reference',
    category: 'PUBLICATION_REFERENCE',
    eyebrow: 'LINK AN INDEPENDENT PUBLICATION',
    description:
      'Submit an attributable article, paper, case study, repository publication, institutional report, or research commentary for linkage.',
    recordBound: true,
    publicRecordCandidate: true,
    subjectPrefix: 'External Publication — ',
    helper:
      'External publications remain under the authorship and responsibility of their authors. Linking does not constitute institutional adoption.',
  },
  {
    value: 'REGISTRY_QUESTION',
    number: '10',
    title: 'Registry Question',
    category: 'REGISTRY_QUESTION',
    eyebrow: 'QUESTION A REGISTRY RECORD',
    description:
      'Ask a bounded question about a registered governance entity, its baseline, version, stewardship, or registration boundary.',
    recordBound: true,
    publicRecordCandidate: false,
    subjectPrefix: 'Registry Question — ',
    helper:
      'Use the Registry Identifier whenever possible so the question remains attached to the correct record.',
  },
  {
    value: 'FINDING_QUESTION',
    number: '11',
    title: 'Finding Question',
    category: 'FINDING_QUESTION',
    eyebrow: 'QUESTION A TA-14 FINDING',
    description:
      'Ask about the scope, wording, evidence basis, chronology, or institutional boundary of a TA-14 finding.',
    recordBound: true,
    publicRecordCandidate: false,
    subjectPrefix: 'Finding Question — ',
    helper:
      'Questions do not alter the finding. Any correction, challenge, response, or superseding record remains separate.',
  },
  {
    value: 'ARTIFACT_QUESTION',
    number: '12',
    title: 'Artifact Question',
    category: 'ARTIFACT_QUESTION',
    eyebrow: 'QUESTION AN EXECUTION OR EVIDENCE ARTIFACT',
    description:
      'Ask about an execution artifact, admitted evidence object, receipt, digest, or other preserved technical record.',
    recordBound: true,
    publicRecordCandidate: false,
    subjectPrefix: 'Artifact Question — ',
    helper:
      'Identify the artifact precisely so the inquiry can be bound to the correct record instead of becoming free-floating commentary.',
  },
  {
    value: 'COLLABORATION_INQUIRY',
    number: '13',
    title: 'Collaboration Inquiry',
    category: 'COLLABORATION_INQUIRY',
    eyebrow: 'DEFINED COLLABORATION PATH',
    description:
      'Contact TA-14 about a bounded collaboration, institutional relationship, evidence exchange, review pathway, or reciprocal engagement.',
    recordBound: false,
    publicRecordCandidate: false,
    subjectPrefix: 'Collaboration Inquiry — ',
    helper:
      'Use this for concrete collaboration proposals. Architecture development or solution shaping may require a defined engagement.',
  },
  {
    value: 'RIGHTS_OR_ATTRIBUTION',
    number: '14',
    title: 'Rights or Attribution Notice',
    category: 'RIGHTS_OR_ATTRIBUTION',
    eyebrow: 'PROVENANCE AND ATTRIBUTION',
    description:
      'Submit a bounded rights, provenance, attribution, authorship, stewardship, or licensing notice tied to a governed record.',
    recordBound: true,
    publicRecordCandidate: true,
    subjectPrefix: 'Rights or Attribution Notice — ',
    helper:
      'Receipt preserves the notice and asserted basis. It is not ownership adjudication or a legal conclusion.',
  },
  {
    value: 'DISPUTE_NOTICE',
    number: '15',
    title: 'Dispute Notice',
    category: 'DISPUTE_NOTICE',
    eyebrow: 'FORMAL DISPUTE NOTICE',
    description:
      'Submit an attributable notice that a governed record, claim, attribution, version, evidence object, or related matter is disputed.',
    recordBound: true,
    publicRecordCandidate: true,
    subjectPrefix: 'Dispute Notice — ',
    helper:
      'A dispute notice does not itself establish that the disputed claim is invalid. It preserves the existence and basis of the dispute.',
  },
  {
    value: 'GENERAL_INQUIRY',
    number: '16',
    title: 'General Governed Inquiry',
    category: 'GENERAL_INQUIRY',
    eyebrow: 'STRUCTURED CONTACT',
    description:
      'Send a general inquiry to TA-14 when none of the more specific governed pathways applies.',
    recordBound: false,
    publicRecordCandidate: false,
    subjectPrefix: 'Governed Inquiry — ',
    helper:
      'Use the most specific pathway available. General inquiry is intentionally the fallback rather than the default.',
  },
];

const initialForm: FormState = {
  intent: 'PARTICIPANT_REVIEW',
  submitterName: '',
  submitterEmail: '',
  submitterOrganization: '',
  submitterRole: '',
  subject: '',
  messageBody: '',
  registryIdentifier: '',
  governanceEntityName: '',
  governanceVersion: '',
  demonstrationIdentifier: '',
  caseIdentifier: '',
  findingIdentifier: '',
  artifactIdentifier: '',
  relatedReviewRecordId: '',
  visibility: 'PRIVATE',
  publicationPermission: 'PRIVATE',
  conflictDisclosure: '',
  affiliationDisclosure: '',
  responseRequested: false,
  attributionConfirmed: false,
  recordBoundaryConfirmed: false,
  publicationBoundaryConfirmed: false,
};

function safeId() {
  try {
    if (typeof globalThis.crypto?.randomUUID === 'function') {
      return globalThis.crypto.randomUUID();
    }
  } catch {
    // Fall through to a UI-only identifier.
  }

  return `ta14-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function nonEmpty(value: string) {
  return value.trim().length > 0;
}

function definitionFor(intent: SubmissionIntent) {
  return intentDefinitions.find((item) => item.value === intent) ?? intentDefinitions[0];
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    return parsed.toString();
  } catch {
    return '';
  }
}

export default function ReviewsResponsesSubmitPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [links, setLinks] = useState<SupportingLink[]>([]);
  const [activeStage, setActiveStage] = useState(0);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<SubmittedMessage | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  const selectedIntent = useMemo(() => definitionFor(form.intent), [form.intent]);

  const stages = [
    { number: '01', title: 'Choose Pathway', short: 'Pathway' },
    { number: '02', title: 'Attribution', short: 'Identity' },
    { number: '03', title: 'Bind Record', short: 'Record' },
    { number: '04', title: 'Submission', short: 'Content' },
    { number: '05', title: 'Links & Disclosures', short: 'Evidence' },
    { number: '06', title: 'Publication Boundary', short: 'Boundary' },
    { number: '07', title: 'Review & Submit', short: 'Submit' },
  ] as const;

  const recordContextCount = useMemo(
    () =>
      [
        form.registryIdentifier,
        form.demonstrationIdentifier,
        form.caseIdentifier,
        form.findingIdentifier,
        form.artifactIdentifier,
        form.relatedReviewRecordId,
      ].filter(nonEmpty).length,
    [
      form.registryIdentifier,
      form.demonstrationIdentifier,
      form.caseIdentifier,
      form.findingIdentifier,
      form.artifactIdentifier,
      form.relatedReviewRecordId,
    ],
  );

  const normalizedLinks = useMemo(
    () =>
      links
        .map((item) => ({ ...item, url: normalizeUrl(item.url) }))
        .filter((item) => Boolean(item.url)),
    [links],
  );

  const completion = useMemo(() => {
    const checks = [
      nonEmpty(form.submitterName),
      nonEmpty(form.subject),
      nonEmpty(form.messageBody),
      !selectedIntent.recordBound || recordContextCount > 0,
      form.attributionConfirmed,
      form.recordBoundaryConfirmed,
      form.publicationBoundaryConfirmed,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [
    form.submitterName,
    form.subject,
    form.messageBody,
    form.attributionConfirmed,
    form.recordBoundaryConfirmed,
    form.publicationBoundaryConfirmed,
    selectedIntent.recordBound,
    recordContextCount,
  ]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DRAFT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          form?: Partial<FormState>;
          links?: SupportingLink[];
        };
        if (parsed.form) setForm({ ...initialForm, ...parsed.form });
        if (Array.isArray(parsed.links)) setLinks(parsed.links.slice(0, MAX_LINKS));
        setMessage('A local governed-submission draft was restored on this device.');
      }
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    } finally {
      setDraftRestored(true);
    }
  }, []);

  useEffect(() => {
    if (!draftRestored || submittedMessage) return;
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          savedAt: new Date().toISOString(),
          form,
          links,
        }),
      );
    } catch {
      // Browser recovery is a convenience layer only.
    }
  }, [draftRestored, form, links, submittedMessage]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors([]);
    setMessage('');
  }

  function chooseIntent(intent: SubmissionIntent) {
    const next = definitionFor(intent);

    setForm((current) => {
      const generatedSubject = intentDefinitions.some((item) =>
        current.subject.startsWith(item.subjectPrefix),
      );

      return {
        ...current,
        intent,
        subject: !current.subject.trim() || generatedSubject ? next.subjectPrefix : current.subject,
      };
    });

    setErrors([]);
    setMessage(`${next.title} pathway selected.`);
  }

  function addSupportingLink() {
    if (links.length >= MAX_LINKS) {
      setErrors([`A maximum of ${MAX_LINKS} supporting links may be attached.`]);
      return;
    }

    setLinks((current) => [
      ...current,
      { id: safeId(), label: '', url: '' },
    ]);
  }

  function updateSupportingLink(id: string, key: 'label' | 'url', value: string) {
    setLinks((current) =>
      current.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
    setErrors([]);
  }

  function removeSupportingLink(id: string) {
    setLinks((current) => current.filter((item) => item.id !== id));
  }

  function stageComplete(stage: number) {
    switch (stage) {
      case 0:
        return Boolean(form.intent);
      case 1:
        return nonEmpty(form.submitterName);
      case 2:
        return !selectedIntent.recordBound || recordContextCount > 0;
      case 3:
        return nonEmpty(form.subject) && nonEmpty(form.messageBody);
      case 4:
        return links.every((item) => !item.url.trim() || Boolean(normalizeUrl(item.url)));
      case 5:
        return (
          form.attributionConfirmed &&
          form.recordBoundaryConfirmed &&
          form.publicationBoundaryConfirmed
        );
      case 6:
        return completion === 100;
      default:
        return true;
    }
  }

  function goToStage(next: number) {
    if (next > activeStage && !stageComplete(activeStage)) {
      setErrors([
        `Complete the required items in ${stages[activeStage].title} before continuing.`,
      ]);
      return;
    }

    setErrors([]);
    setMessage('');
    setActiveStage(Math.max(0, Math.min(stages.length - 1, next)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function validate() {
    const nextErrors: string[] = [];

    if (!nonEmpty(form.submitterName)) nextErrors.push('Submitter name is required.');

    if (!nonEmpty(form.subject)) {
      nextErrors.push('Subject is required.');
    } else if (form.subject.trim().length > MAX_SUBJECT_LENGTH) {
      nextErrors.push(`Subject must be ${MAX_SUBJECT_LENGTH} characters or fewer.`);
    }

    if (!nonEmpty(form.messageBody)) {
      nextErrors.push('Submission body is required.');
    } else if (form.messageBody.trim().length > MAX_MESSAGE_LENGTH) {
      nextErrors.push(`Submission body must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
    }

    if (selectedIntent.recordBound && recordContextCount < 1) {
      nextErrors.push(
        'This pathway must be bound to at least one Registry, demonstration, case, finding, artifact, or review identifier.',
      );
    }

    for (const item of links) {
      if (item.url.trim() && !normalizeUrl(item.url)) {
        nextErrors.push(
          `Supporting link "${item.label || item.url}" is not a valid HTTP or HTTPS URL.`,
        );
      }
    }

    if (form.conflictDisclosure.trim().length > MAX_DISCLOSURE_LENGTH) {
      nextErrors.push(
        `Conflict disclosure must be ${MAX_DISCLOSURE_LENGTH} characters or fewer.`,
      );
    }

    if (form.affiliationDisclosure.trim().length > MAX_DISCLOSURE_LENGTH) {
      nextErrors.push(
        `Affiliation disclosure must be ${MAX_DISCLOSURE_LENGTH} characters or fewer.`,
      );
    }

    if (!form.attributionConfirmed) nextErrors.push('Confirm the attribution declaration.');
    if (!form.recordBoundaryConfirmed) nextErrors.push('Acknowledge the separate-record boundary.');
    if (!form.publicationBoundaryConfirmed) {
      nextErrors.push('Acknowledge the publication-permission boundary.');
    }

    setErrors(nextErrors);
    return nextErrors.length === 0;
  }

  function discardDraft() {
    setForm(initialForm);
    setLinks([]);
    setSubmittedMessage(null);
    setActiveStage(0);
    setErrors([]);
    setMessage('Local governed-submission draft discarded.');

    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // No further action needed.
    }
  }

  async function submitGovernedMessage() {
    if (!validate()) {
      setMessage('The governed submission is not ready. Resolve the required items first.');
      return;
    }

    setBusy(true);
    setErrors([]);
    setMessage('');

    try {
      const response = await fetch('/api/ai-governance/reviews/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submitterName: form.submitterName.trim(),
          submitterEmail: form.submitterEmail.trim(),
          submitterOrganization: form.submitterOrganization.trim(),
          submitterRole: form.submitterRole.trim(),
          category: selectedIntent.category,
          subject: form.subject.trim(),
          messageBody: form.messageBody.trim(),
          registryIdentifier: form.registryIdentifier.trim(),
          governanceEntityName: form.governanceEntityName.trim(),
          governanceVersion: form.governanceVersion.trim(),
          demonstrationIdentifier: form.demonstrationIdentifier.trim(),
          caseIdentifier: form.caseIdentifier.trim(),
          findingIdentifier: form.findingIdentifier.trim(),
          artifactIdentifier: form.artifactIdentifier.trim(),
          relatedReviewRecordId: form.relatedReviewRecordId.trim(),
          visibility: form.visibility,
          publicationPermission: form.publicationPermission,
          supportingLinks: normalizedLinks.map((item) => ({
            label: item.label.trim(),
            url: item.url,
          })),
          conflictDisclosure: form.conflictDisclosure.trim(),
          affiliationDisclosure: form.affiliationDisclosure.trim(),
          responseRequested: form.responseRequested,
          metadata: {
            submission_intent: form.intent,
            submission_intent_title: selectedIntent.title,
            interface_version: 'TA-14-REVIEWS-RESPONSES-INTAKE-1.0',
            declarations: {
              attribution_confirmed: form.attributionConfirmed,
              separate_record_boundary_confirmed: form.recordBoundaryConfirmed,
              publication_boundary_confirmed: form.publicationBoundaryConfirmed,
            },
          },
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        const detail = Array.isArray(payload.details) ? payload.details.join(' ') : '';
        throw new Error(
          `${payload.error ?? 'Unable to preserve the governed submission.'}${detail ? ` ${detail}` : ''}`,
        );
      }

      setSubmittedMessage(payload.message as SubmittedMessage);
      setMessage(payload.notice ?? 'Governed submission preserved.');

      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Submission already exists server-side.
      }

      setActiveStage(stages.length - 1);
    } catch (error) {
      setErrors([
        error instanceof Error
          ? error.message
          : 'Unable to preserve the governed submission.',
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitGovernedMessage();
  }

  const publicationBoundaryCopy =
    form.publicationPermission === 'PUBLICATION_ALLOWED'
      ? 'TA-14 may publish the submitted content publicly, subject to institutional moderation, record integrity, and applicable law.'
      : form.publicationPermission === 'PUBLICATION_ALLOWED_WITH_ATTRIBUTION'
        ? 'TA-14 may publish the submitted content publicly with attribution to the identified submitter.'
        : form.publicationPermission === 'PUBLICATION_METADATA_ONLY'
          ? 'TA-14 may publish metadata about the existence of the submission without publishing the full content.'
          : form.publicationPermission === 'CONTROLLED_USE_ONLY'
            ? 'The submission may be used only within a controlled institutional context.'
            : form.publicationPermission === 'REQUIRES_FURTHER_APPROVAL'
              ? 'No publication should occur until additional approval is obtained.'
              : 'The submission is private and should not be publicly published solely because it was received.';

  return (
    <main className="rr-page">
      <div className="cosmos" aria-hidden="true">
        <div className="stars stars-a" />
        <div className="stars stars-b" />
        <div className="line line-a" />
        <div className="line line-b" />
        <div className="orbit orbit-a"><i /></div>
        <div className="orbit orbit-b"><i /></div>
        <div className="orb orb-a" />
        <div className="orb orb-b" />
      </div>

      <header className="topbar">
        <Link href="/workspace/ai-governance/reviews" className="brand">
          <span className="brand-mark">TA-14</span>
          <span className="brand-copy">
            <strong>Reviews & Responses</strong>
            <small>Governed Messaging Intake</small>
          </span>
        </Link>

        <nav aria-label="Reviews and Responses navigation">
          <Link href="/workspace/ai-governance" className="nav-button">
            AI Governance Home
          </Link>
          <Link href="/workspace/ai-governance/reviews" className="nav-button">
            Reviews & Responses
          </Link>
          <Link href="/workspace/ai-governance/registry" className="nav-button">
            Registry
          </Link>
          <Link href="/workspace/ai-governance/demonstrations" className="nav-button">
            Demonstrations
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div className="eyebrow">
          ATTRIBUTABLE INPUT · PRESERVED CHRONOLOGY · SEPARATE VOICES
        </div>

        <h1>Review it. Respond to it. Challenge it. Preserve it.</h1>

        <p>
          The TA-14 AI Governance Exchange does not use an unrestricted comment
          feed for consequence-bearing governance records. This workspace
          preserves attributable submissions as governed records linked to the
          Registry entity, demonstration, case, finding, artifact, review, or
          publication they address.
        </p>

        <div className="hero-principles">
          <article>
            <span>01</span>
            <strong>Separate voices</strong>
            <p>
              Participant response is not a TA-14 finding. Independent review is
              not institutional adoption. A challenge does not silently rewrite
              the record it challenges.
            </p>
          </article>

          <article>
            <span>02</span>
            <strong>Preserve chronology</strong>
            <p>
              Baseline, demonstration, evidence, finding, response, challenge,
              learning, and later version remain distinguishable over time.
            </p>
          </article>

          <article>
            <span>03</span>
            <strong>Govern publication</strong>
            <p>
              Visibility and publication permission are explicit. Receipt alone
              does not make submitted content public or adopted.
            </p>
          </article>
        </div>

        <div className="hero-boundary">
          <strong>Institutional boundary</strong>
          <span>
            Receipt of a governed submission does not make it admitted evidence,
            a TA-14 finding, certification, endorsement, legal validation,
            regulatory approval, or institutional adoption.
          </span>
        </div>
      </section>

      <form className="workspace" onSubmit={handleSubmit}>
        <aside className="left-rail">
          <section className="progress-card">
            <div className="progress-top">
              <span>Submission readiness</span>
              <strong>{completion}%</strong>
            </div>
            <div className="progress-track">
              <i style={{ width: `${completion}%` }} />
            </div>
            <small>
              Governed completeness indicator only. Not a quality score,
              certification, or evidentiary determination.
            </small>
          </section>

          <nav className="stage-list" aria-label="Governed submission stages">
            {stages.map((stage, index) => (
              <button
                key={stage.number}
                type="button"
                className={`${index === activeStage ? 'active' : ''} ${
                  stageComplete(index) ? 'complete' : ''
                }`}
                onClick={() => goToStage(index)}
              >
                <span>{stage.number}</span>
                <div>
                  <strong>{stage.short}</strong>
                  <small>{stage.title}</small>
                </div>
                <b>{stageComplete(index) ? '✓' : ''}</b>
              </button>
            ))}
          </nav>

          <section className="rail-note">
            <small>CURRENT PATHWAY</small>
            <strong>{selectedIntent.title}</strong>
            <p>{selectedIntent.description}</p>
          </section>

          <section className="rail-actions">
            <button
              type="button"
              onClick={discardDraft}
              disabled={busy}
              className="danger-button"
            >
              Discard Local Draft
            </button>
          </section>
        </aside>

        <section className="main-panel">
          <div className="stage-heading">
            <div>
              <span>
                STAGE {stages[activeStage].number} OF {String(stages.length).padStart(2, '0')}
              </span>
              <h2>{stages[activeStage].title}</h2>
            </div>
            <div className={`stage-status ${stageComplete(activeStage) ? 'complete' : ''}`}>
              {stageComplete(activeStage) ? 'STAGE COMPLETE' : 'IN PROGRESS'}
            </div>
          </div>

          {activeStage === 0 && (
            <section className="panel-card">
              <div className="section-intro">
                <span>CHOOSE THE MOST SPECIFIC PATHWAY</span>
                <h3>What are you placing into the record?</h3>
                <p>
                  Select the institutional class that best describes the purpose
                  of your submission. Reviews, responses, challenges,
                  corrections, comments, requests, publications, and general
                  contact remain distinguishable.
                </p>
              </div>

              <div className="pathway-grid">
                {intentDefinitions.map((intent) => (
                  <button
                    type="button"
                    key={intent.value}
                    className={`pathway-card ${form.intent === intent.value ? 'selected' : ''}`}
                    onClick={() => chooseIntent(intent.value)}
                  >
                    <div className="pathway-number">{intent.number}</div>
                    <div className="pathway-copy">
                      <small>{intent.eyebrow}</small>
                      <strong>{intent.title}</strong>
                      <p>{intent.description}</p>
                    </div>
                    <div className="pathway-state">
                      {form.intent === intent.value ? 'SELECTED' : 'CHOOSE'}
                    </div>
                  </button>
                ))}
              </div>

              <div className="explanation-card">
                <strong>{selectedIntent.title}</strong>
                <p>{selectedIntent.helper}</p>
                <div className="tag-row">
                  <span>Category: {selectedIntent.category}</span>
                  <span>
                    {selectedIntent.recordBound
                      ? 'Record linkage required'
                      : 'Record linkage optional at intake'}
                  </span>
                  <span>
                    {selectedIntent.publicRecordCandidate
                      ? 'May become a public record'
                      : 'Normally governed contact'}
                  </span>
                </div>
              </div>
            </section>
          )}

          {activeStage === 1 && (
            <section className="panel-card">
              <div className="section-intro">
                <span>ATTRIBUTION BEFORE INTERPRETATION</span>
                <h3>Who is speaking?</h3>
                <p>
                  Governed submissions remain attributable. Identity,
                  organization, role, affiliation, and conflicts should be
                  preserved before content is interpreted or published.
                </p>
              </div>

              <div className="field-grid two">
                <label>
                  Submitter name <em>Required</em>
                  <input
                    value={form.submitterName}
                    onChange={(event) => updateField('submitterName', event.target.value)}
                    placeholder="Full attributable name"
                    autoComplete="name"
                  />
                </label>

                <label>
                  Submitter email
                  <input
                    type="email"
                    value={form.submitterEmail}
                    onChange={(event) => updateField('submitterEmail', event.target.value)}
                    placeholder="Used for governed follow-up"
                    autoComplete="email"
                  />
                </label>

                <label>
                  Organization
                  <input
                    value={form.submitterOrganization}
                    onChange={(event) =>
                      updateField('submitterOrganization', event.target.value)
                    }
                    placeholder="Company, institution, project, or independent"
                  />
                </label>

                <label>
                  Role or relationship
                  <input
                    value={form.submitterRole}
                    onChange={(event) => updateField('submitterRole', event.target.value)}
                    placeholder="Founder, steward, reviewer, participant, researcher..."
                  />
                </label>
              </div>

              <div className="boundary-note">
                <strong>Attribution does not establish authority.</strong>
                <p>
                  The Exchange preserves who submitted the record and what role
                  they declared. Receipt does not independently verify identity,
                  authority, ownership, authorship, or legal rights.
                </p>
              </div>
            </section>
          )}

          {activeStage === 2 && (
            <section className="panel-card">
              <div className="section-intro">
                <span>BIND THE SUBMISSION TO ITS SUBJECT</span>
                <h3>Which governed record are you addressing?</h3>
                <p>
                  Use identifiers that already exist. A message about a finding
                  should remain attached to that finding. Commentary detached
                  from its record weakens chronology.
                </p>
              </div>

              <div className="record-requirement">
                <strong>
                  {selectedIntent.recordBound
                    ? 'Record linkage required for this pathway.'
                    : 'Record linkage is optional at intake for this pathway.'}
                </strong>
                <p>
                  {selectedIntent.recordBound
                    ? 'Identify at least one Registry, demonstration, case, finding, artifact, or review identifier.'
                    : 'Any later institutional action should bind this submission to the record it creates or affects.'}
                </p>
              </div>

              <div className="field-grid two">
                <label>
                  Registry Identifier
                  <input
                    value={form.registryIdentifier}
                    onChange={(event) =>
                      updateField('registryIdentifier', event.target.value)
                    }
                    placeholder="TA-14-AIGR-000008"
                  />
                </label>

                <label>
                  Governance entity name
                  <input
                    value={form.governanceEntityName}
                    onChange={(event) =>
                      updateField('governanceEntityName', event.target.value)
                    }
                    placeholder="Harmonic Constitutional Runtime"
                  />
                </label>

                <label>
                  Governance version
                  <input
                    value={form.governanceVersion}
                    onChange={(event) =>
                      updateField('governanceVersion', event.target.value)
                    }
                    placeholder="1.0"
                  />
                </label>

                <label>
                  Demonstration Identifier
                  <input
                    value={form.demonstrationIdentifier}
                    onChange={(event) =>
                      updateField('demonstrationIdentifier', event.target.value)
                    }
                    placeholder="FD-2026-0002"
                  />
                </label>

                <label>
                  Case Identifier
                  <input
                    value={form.caseIdentifier}
                    onChange={(event) => updateField('caseIdentifier', event.target.value)}
                    placeholder="CASE-001"
                  />
                </label>

                <label>
                  Finding Identifier
                  <input
                    value={form.findingIdentifier}
                    onChange={(event) =>
                      updateField('findingIdentifier', event.target.value)
                    }
                    placeholder="FD-2026-0002-CASE-001"
                  />
                </label>

                <label>
                  Artifact Identifier
                  <input
                    value={form.artifactIdentifier}
                    onChange={(event) =>
                      updateField('artifactIdentifier', event.target.value)
                    }
                    placeholder="Execution or evidence artifact identifier"
                  />
                </label>

                <label>
                  Related Review Record UUID
                  <input
                    value={form.relatedReviewRecordId}
                    onChange={(event) =>
                      updateField('relatedReviewRecordId', event.target.value)
                    }
                    placeholder="Optional internal review record UUID"
                  />
                </label>
              </div>

              <div className="context-summary">
                <div><small>Bound identifiers</small><strong>{recordContextCount}</strong></div>
                <div>
                  <small>Pathway requirement</small>
                  <strong>{selectedIntent.recordBound ? 'REQUIRED' : 'OPTIONAL'}</strong>
                </div>
                <div>
                  <small>Context state</small>
                  <strong>{recordContextCount > 0 ? 'BOUND' : 'UNBOUND'}</strong>
                </div>
              </div>
            </section>
          )}

          {activeStage === 3 && (
            <section className="panel-card">
              <div className="section-intro">
                <span>PRESERVE THE SUBSTANCE</span>
                <h3>State the submission in your own voice.</h3>
                <p>
                  The text remains attributable to you. TA-14 may later
                  respond, publish, classify, accept for record, challenge,
                  decline, or take another governed disposition without
                  silently rewriting your submission.
                </p>
              </div>

              <label>
                Subject <em>Required</em>
                <input
                  value={form.subject}
                  maxLength={MAX_SUBJECT_LENGTH}
                  onChange={(event) => updateField('subject', event.target.value)}
                  placeholder={selectedIntent.subjectPrefix}
                />
                <small>{form.subject.length} / {MAX_SUBJECT_LENGTH}</small>
              </label>

              <label className="large-field">
                Submission body <em>Required</em>
                <textarea
                  rows={18}
                  value={form.messageBody}
                  maxLength={MAX_MESSAGE_LENGTH}
                  onChange={(event) => updateField('messageBody', event.target.value)}
                  placeholder="State what you are submitting, the record you are addressing, what you believe the evidence supports, any limitation you want preserved, and any specific action or response you are requesting."
                />
                <small>{form.messageBody.length} / {MAX_MESSAGE_LENGTH}</small>
              </label>

              <label className="response-row">
                <input
                  type="checkbox"
                  checked={form.responseRequested}
                  onChange={(event) =>
                    updateField('responseRequested', event.target.checked)
                  }
                />
                <span>
                  <strong>Request a TA-14 response</strong>
                  <small>
                    A requested response is recorded as part of the submission.
                    It does not guarantee response, publication, review,
                    demonstration, or particular disposition.
                  </small>
                </span>
              </label>
            </section>
          )}

          {activeStage === 4 && (
            <section className="panel-card">
              <div className="section-intro">
                <span>SOURCES · LINKS · AFFILIATIONS · CONFLICTS</span>
                <h3>Preserve what supports or qualifies your submission.</h3>
                <p>
                  Supporting links may point to public evidence, repositories,
                  publications, demonstrations, reports, source records, or
                  other relevant material. Links are references; receipt does
                  not admit them as evidence.
                </p>
              </div>

              <div className="section-toolbar">
                <div>
                  <strong>Supporting links</strong>
                  <small>{links.length} / {MAX_LINKS}</small>
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={addSupportingLink}
                >
                  Add Supporting Link ＋
                </button>
              </div>

              {links.length === 0 && (
                <div className="empty-state">
                  No supporting links attached. This is allowed unless the
                  substance of your submission requires a source to be
                  intelligible.
                </div>
              )}

              <div className="link-stack">
                {links.map((item, index) => (
                  <article className="link-card" key={item.id}>
                    <div className="link-index">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="link-fields">
                      <label>
                        Label
                        <input
                          value={item.label}
                          onChange={(event) =>
                            updateSupportingLink(item.id, 'label', event.target.value)
                          }
                          placeholder="Public evidence route, repository, article..."
                        />
                      </label>
                      <label>
                        URL
                        <input
                          type="url"
                          value={item.url}
                          onChange={(event) =>
                            updateSupportingLink(item.id, 'url', event.target.value)
                          }
                          placeholder="https://"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeSupportingLink(item.id)}
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </div>

              <div className="field-grid two disclosure-grid">
                <label>
                  Affiliation disclosure
                  <textarea
                    rows={8}
                    value={form.affiliationDisclosure}
                    maxLength={MAX_DISCLOSURE_LENGTH}
                    onChange={(event) =>
                      updateField('affiliationDisclosure', event.target.value)
                    }
                    placeholder="Describe relationships, roles, organizations, partnerships, employment, participation, or other affiliations relevant to how this submission should be understood."
                  />
                  <small>
                    {form.affiliationDisclosure.length} / {MAX_DISCLOSURE_LENGTH}
                  </small>
                </label>

                <label>
                  Conflict disclosure
                  <textarea
                    rows={8}
                    value={form.conflictDisclosure}
                    maxLength={MAX_DISCLOSURE_LENGTH}
                    onChange={(event) =>
                      updateField('conflictDisclosure', event.target.value)
                    }
                    placeholder="Disclose financial, professional, authorship, competitive, ownership, advocacy, review, or other interests that may materially affect interpretation."
                  />
                  <small>
                    {form.conflictDisclosure.length} / {MAX_DISCLOSURE_LENGTH}
                  </small>
                </label>
              </div>

              <div className="boundary-note">
                <strong>Source linkage is not evidence admission.</strong>
                <p>
                  TA-14 may later admit, reject, classify, verify, challenge,
                  or otherwise govern a linked source through a separate
                  evidentiary process.
                </p>
              </div>
            </section>
          )}

          {activeStage === 5 && (
            <section className="panel-card">
              <div className="section-intro">
                <span>VISIBILITY IS NOT THE SAME AS PUBLICATION PERMISSION</span>
                <h3>Define how this submission may be handled.</h3>
                <p>
                  Visibility controls how the record may be exposed.
                  Publication permission separately records whether the
                  submitted content may be published and under what conditions.
                </p>
              </div>

              <div className="field-grid two">
                <label>
                  Record visibility
                  <select
                    value={form.visibility}
                    onChange={(event) =>
                      updateField('visibility', event.target.value as RecordVisibility)
                    }
                  >
                    <option value="PRIVATE">Private</option>
                    <option value="CONTROLLED">Controlled</option>
                    <option value="PUBLIC_METADATA_ONLY">Public metadata only</option>
                    <option value="PUBLIC">Public</option>
                  </select>
                </label>

                <label>
                  Publication permission
                  <select
                    value={form.publicationPermission}
                    onChange={(event) =>
                      updateField(
                        'publicationPermission',
                        event.target.value as PublicationPermission,
                      )
                    }
                  >
                    <option value="PRIVATE">Private</option>
                    <option value="CONTROLLED_USE_ONLY">Controlled use only</option>
                    <option value="REQUIRES_FURTHER_APPROVAL">
                      Requires further approval
                    </option>
                    <option value="PUBLICATION_METADATA_ONLY">
                      Publication metadata only
                    </option>
                    <option value="PUBLICATION_ALLOWED_WITH_ATTRIBUTION">
                      Publication allowed with attribution
                    </option>
                    <option value="PUBLICATION_ALLOWED">Publication allowed</option>
                  </select>
                </label>
              </div>

              <div className="publication-boundary">
                <small>CURRENT PUBLICATION BOUNDARY</small>
                <strong>{form.publicationPermission}</strong>
                <p>{publicationBoundaryCopy}</p>
              </div>

              <div className="declaration-stack">
                <label className="declaration-row">
                  <input
                    type="checkbox"
                    checked={form.attributionConfirmed}
                    onChange={(event) =>
                      updateField('attributionConfirmed', event.target.checked)
                    }
                  />
                  <span>
                    <strong>Attribution declaration</strong>
                    I understand that this submission will be preserved as my
                    attributable voice and should not be represented as a TA-14
                    statement unless TA-14 separately issues one.
                  </span>
                </label>

                <label className="declaration-row">
                  <input
                    type="checkbox"
                    checked={form.recordBoundaryConfirmed}
                    onChange={(event) =>
                      updateField('recordBoundaryConfirmed', event.target.checked)
                    }
                  />
                  <span>
                    <strong>Separate-record boundary</strong>
                    I understand that this submission does not silently alter,
                    replace, or rewrite an existing Registry record,
                    demonstration, finding, artifact, review, or publication.
                  </span>
                </label>

                <label className="declaration-row">
                  <input
                    type="checkbox"
                    checked={form.publicationBoundaryConfirmed}
                    onChange={(event) =>
                      updateField('publicationBoundaryConfirmed', event.target.checked)
                    }
                  />
                  <span>
                    <strong>Publication-permission boundary</strong>
                    I understand that publication, institutional adoption,
                    evidentiary admission, and disposition are separate acts
                    from receipt of this submission.
                  </span>
                </label>
              </div>
            </section>
          )}

          {activeStage === 6 && (
            <section className="panel-card final-stage">
              <div className="readiness-hero">
                <span>GOVERNED SUBMISSION READINESS</span>
                <strong>{completion}%</strong>
                <p>
                  This indicator measures whether required intake elements are
                  present. It is not a measure of truth, merit, evidentiary
                  sufficiency, or institutional agreement.
                </p>
              </div>

              <div className="review-grid">
                <article><small>Pathway</small><strong>{selectedIntent.title}</strong><span>{selectedIntent.category}</span></article>
                <article><small>Submitter</small><strong>{form.submitterName || 'Not declared'}</strong><span>{form.submitterRole || 'Role not declared'}</span></article>
                <article><small>Record linkage</small><strong>{recordContextCount} identifier{recordContextCount === 1 ? '' : 's'}</strong><span>{selectedIntent.recordBound ? 'Required pathway' : 'Optional pathway'}</span></article>
                <article><small>Visibility</small><strong>{form.visibility}</strong><span>{form.publicationPermission}</span></article>
                <article><small>Response</small><strong>{form.responseRequested ? 'REQUESTED' : 'NOT REQUESTED'}</strong><span>Request does not guarantee response</span></article>
                <article><small>Supporting links</small><strong>{normalizedLinks.length}</strong><span>References, not automatically admitted evidence</span></article>
              </div>

              <section className="preview-block">
                <div className="preview-block-heading">
                  <div>
                    <small>SUBJECT</small>
                    <strong>{form.subject || 'No subject'}</strong>
                  </div>
                  <span>{selectedIntent.eyebrow}</span>
                </div>
                <p>{form.messageBody || 'No submission body entered.'}</p>
              </section>

              <div className="final-boundary">
                <strong>Preserve the submission without collapsing the record.</strong>
                <p>
                  On submission, the Exchange preserves a governed message
                  record with an automatically assigned TA-14 message
                  identifier, attribution, category, linked-record context,
                  visibility, publication permission, disclosures, supporting
                  links, response-request state, timestamp, and integrity digest.
                </p>
              </div>

              {submittedMessage ? (
                <section className="success-record">
                  <div className="success-mark">✓</div>
                  <div>
                    <small>GOVERNED MESSAGE PRESERVED</small>
                    <h3>{submittedMessage.message_identifier ?? 'Identifier assigned'}</h3>
                    <p>
                      The submission is now preserved as a separate institutional
                      record in status <strong>{submittedMessage.status}</strong>.
                    </p>

                    <div className="receipt-grid">
                      <span><small>Internal ID</small><strong>{submittedMessage.id}</strong></span>
                      <span><small>Submitted</small><strong>{new Date(submittedMessage.submitted_at).toLocaleString()}</strong></span>
                      <span><small>Category</small><strong>{submittedMessage.category}</strong></span>
                      <span><small>Visibility</small><strong>{submittedMessage.visibility}</strong></span>
                      <span className="wide"><small>Integrity digest</small><code>{submittedMessage.integrity_digest ?? 'Digest unavailable'}</code></span>
                    </div>

                    <div className="success-actions">
                      <Link className="primary-button" href="/workspace/ai-governance/reviews">
                        Return to Reviews & Responses →
                      </Link>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          setForm(initialForm);
                          setLinks([]);
                          setSubmittedMessage(null);
                          setActiveStage(0);
                          setMessage('Ready for a new governed submission.');
                        }}
                      >
                        Start Another Submission
                      </button>
                    </div>
                  </div>
                </section>
              ) : (
                <div className="submit-panel">
                  <div>
                    <small>READY TO PRESERVE</small>
                    <strong>Submit as a separate governed record</strong>
                    <p>
                      The record will receive its message identifier from the
                      TA-14 database sequence. The interface does not invent
                      institutional identifiers.
                    </p>
                  </div>
                  <button type="submit" className="primary-button large-submit" disabled={busy}>
                    {busy ? 'Preserving Governed Submission…' : 'Preserve Governed Submission →'}
                  </button>
                </div>
              )}
            </section>
          )}

          {(errors.length > 0 || message) && (
            <section
              className={`notice-panel ${errors.length > 0 ? 'has-errors' : ''}`}
              aria-live="polite"
            >
              {message && <strong>{message}</strong>}
              {errors.length > 0 && (
                <ul>
                  {errors.map((error) => <li key={error}>{error}</li>)}
                </ul>
              )}
            </section>
          )}

          <div className="navigation-row">
            <button
              type="button"
              className="secondary-button"
              disabled={activeStage === 0}
              onClick={() => goToStage(activeStage - 1)}
            >
              ← Previous
            </button>

            <span>
              {stages[activeStage].number} / {String(stages.length).padStart(2, '0')}
            </span>

            {activeStage < stages.length - 1 ? (
              <button
                type="button"
                className="primary-button"
                onClick={() => goToStage(activeStage + 1)}
              >
                Save & Continue →
              </button>
            ) : !submittedMessage ? (
              <button type="submit" className="primary-button" disabled={busy}>
                {busy ? 'Preserving…' : 'Submit →'}
              </button>
            ) : (
              <Link href="/workspace/ai-governance/reviews" className="primary-button">
                Reviews & Responses →
              </Link>
            )}
          </div>
        </section>

        <aside className="right-rail">
          <section className="preview-card">
            <div className="preview-top">
              <span>LIVE GOVERNED RECORD PREVIEW</span>
              <strong>{form.visibility}</strong>
            </div>

            <div className="preview-body">
              <small>MESSAGE IDENTIFIER</small>
              <b>{submittedMessage?.message_identifier ?? 'PENDING ASSIGNMENT'}</b>
              <h3>{form.subject || selectedIntent.title}</h3>
              <p>{form.messageBody || 'The submission body will appear here as you write it.'}</p>

              <div className="preview-meta">
                <div><small>Pathway</small><strong>{selectedIntent.title}</strong></div>
                <div><small>Submitter</small><strong>{form.submitterName || 'Not declared'}</strong></div>
                <div><small>Linked records</small><strong>{recordContextCount}</strong></div>
                <div><small>Response</small><strong>{form.responseRequested ? 'REQUESTED' : 'NO'}</strong></div>
              </div>

              <section>
                <h4>Record Context</h4>
                <ul>
                  {form.registryIdentifier && <li>Registry: {form.registryIdentifier}</li>}
                  {form.demonstrationIdentifier && <li>Demonstration: {form.demonstrationIdentifier}</li>}
                  {form.caseIdentifier && <li>Case: {form.caseIdentifier}</li>}
                  {form.findingIdentifier && <li>Finding: {form.findingIdentifier}</li>}
                  {form.artifactIdentifier && <li>Artifact: {form.artifactIdentifier}</li>}
                  {recordContextCount === 0 && <li>No governed record identifier entered yet.</li>}
                </ul>
              </section>

              <section>
                <h4>Publication Boundary</h4>
                <p>{publicationBoundaryCopy}</p>
              </section>

              <div className="preview-boundary">
                Separate voice · Separate record · No silent rewrite
              </div>
            </div>
          </section>

          <section className="right-note">
            <small>GOVERNING PRINCIPLE</small>
            <strong>Preserve the beginning.</strong>
            <p>
              Preserve the evidence. Preserve the finding. Preserve the response.
              Preserve the challenge. Preserve what changed next.
            </p>
          </section>

          <section className="right-note">
            <small>TA-14 BOUNDARY</small>
            <strong>No admissible evidence. No admissible execution.</strong>
            <p>
              A governed message can become part of institutional chronology
              without automatically becoming admissible evidence.
            </p>
          </section>
        </aside>
      </form>

      <footer>
        <div>
          <strong>TA-14 Authority Governance Institution</strong>
          <span>
            Reviews · Responses · Challenges · Corrections · Messages · Public Record
          </span>
        </div>
        <div className="footer-links">
          <Link href="/workspace/ai-governance/reviews" className="nav-button">
            Reviews & Responses
          </Link>
          <Link href="/workspace/ai-governance/registry" className="nav-button">
            Registry
          </Link>
          <Link href="/workspace/ai-governance" className="nav-button">
            AI Governance Home
          </Link>
        </div>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; }
        :global(body) { margin: 0; background: #040714; color: #f6f4ef; }

        .rr-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 24px clamp(14px, 2.8vw, 44px) 56px;
          background:
            radial-gradient(circle at 50% -5%, rgba(49,105,180,.22), transparent 33%),
            radial-gradient(circle at 88% 26%, rgba(144,85,190,.12), transparent 30%),
            radial-gradient(circle at 10% 70%, rgba(214,157,75,.1), transparent 28%),
            linear-gradient(180deg,#040714 0%,#08111f 48%,#040711 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .cosmos { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .stars { position: absolute; inset: -20%; opacity: .3; background-image: radial-gradient(circle,rgba(255,255,255,.76) 0 1px,transparent 1.4px); animation: drift 42s linear infinite; }
        .stars-a { background-size: 52px 52px; }
        .stars-b { background-size: 93px 93px; opacity: .16; animation-duration: 64s; animation-direction: reverse; }
        .line { position: absolute; width: 760px; height: 1px; background: linear-gradient(90deg,transparent,rgba(114,184,246,.35),rgba(232,190,104,.4),transparent); animation: sweep 18s ease-in-out infinite; }
        .line-a { left: -12%; top: 23%; transform: rotate(15deg); }
        .line-b { right: -10%; bottom: 18%; transform: rotate(-13deg); animation-delay: -8s; }
        .orbit { position: absolute; border: 1px solid rgba(126,190,230,.13); border-radius: 50%; animation: spin 40s linear infinite; }
        .orbit i { position: absolute; width: 8px; height: 8px; border-radius: 50%; background: #edc46f; box-shadow: 0 0 18px rgba(237,196,111,.75); }
        .orbit-a { width: 430px; height: 430px; right: -170px; top: 13%; }
        .orbit-a i { top: 15%; left: 10%; }
        .orbit-b { width: 330px; height: 330px; left: -140px; bottom: 5%; animation-direction: reverse; }
        .orbit-b i { right: 8%; bottom: 22%; }
        .orb { position: absolute; border-radius: 50%; opacity: .2; animation: float 16s ease-in-out infinite; }
        .orb-a { width: 250px; height: 250px; right: 7%; top: 48%; background: radial-gradient(circle at 34% 32%,#94d7ff,#1d3975 48%,transparent 73%); }
        .orb-b { width: 160px; height: 160px; left: 7%; top: 34%; background: radial-gradient(circle at 40% 36%,#e7bc69,#6b3f19 48%,transparent 72%); animation-delay: -6s; }

        @keyframes drift { to { transform: translate3d(110px,80px,0); } }
        @keyframes sweep { 0%,100% { opacity:.1; } 50% { opacity:.7; transform: translateX(90px) rotate(15deg); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(18px,-24px,0); } }

        .topbar,.hero,.workspace,footer { position: relative; z-index: 2; max-width: 1600px; margin-inline: auto; }
        .topbar { display:flex; justify-content:space-between; align-items:center; gap:18px; padding:8px 0 30px; }
        .topbar nav,.footer-links,.success-actions { display:flex; flex-wrap:wrap; gap:8px; }

        .brand { display:inline-flex; align-items:center; gap:12px; color:#fff6dd; text-decoration:none; }
        .brand-mark { display:grid; place-items:center; width:62px; height:48px; border:1px solid rgba(244,204,126,.52); border-radius:14px; background:linear-gradient(145deg,#e5b963,#6e431c); color:#140d07; font-family:Georgia,serif; font-weight:900; }
        .brand-copy { display:grid; gap:2px; }
        .brand-copy strong { font-family:Georgia,serif; font-size:19px; font-weight:600; }
        .brand-copy small { color:#aab6c8; font-size:10px; letter-spacing:.1em; text-transform:uppercase; }

        .nav-button,.primary-button,.secondary-button,.danger-button,.remove-button {
          display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:11px 14px;
          border:1px solid rgba(151,174,209,.28); border-radius:12px; color:#f6f8fd;
          background:rgba(13,22,39,.78); text-decoration:none; font-size:12px; font-weight:820; cursor:pointer;
          transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;
        }
        .nav-button:hover,.primary-button:hover,.secondary-button:hover,.danger-button:hover,.remove-button:hover { transform:translateY(-2px); }
        .primary-button { border-color:#e8c476; background:linear-gradient(180deg,#e0b760,#8b5521); color:#160e07; }
        .danger-button,.remove-button { border-color:rgba(224,118,90,.45); background:rgba(93,34,24,.34); color:#ffd8ca; }
        button:disabled { opacity:.48; cursor:not-allowed; transform:none !important; }

        .hero { padding:54px 0 44px; text-align:center; }
        .eyebrow,.section-intro>span,.stage-heading>div>span,.readiness-hero>span,.rail-note>small,.right-note>small,.publication-boundary>small,.success-record small,.submit-panel small {
          color:#efc97c; font-size:10px; font-weight:900; letter-spacing:.16em; text-transform:uppercase;
        }
        .hero h1 { max-width:1120px; margin:20px auto 22px; font-family:Georgia,serif; font-size:clamp(46px,6.7vw,90px); line-height:.96; font-weight:500; letter-spacing:-.035em; }
        .hero>p { max-width:980px; margin:0 auto; color:#bcc8d7; font-size:clamp(16px,1.5vw,19px); line-height:1.75; }
        .hero-principles { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; max-width:1180px; margin:34px auto 20px; text-align:left; }
        .hero-principles article { min-height:175px; padding:22px; border:1px solid rgba(151,174,209,.18); border-radius:19px; background:linear-gradient(180deg,rgba(17,29,50,.86),rgba(7,13,25,.9)); }
        .hero-principles span { display:inline-flex; margin-bottom:16px; color:#79b8eb; font-size:10px; font-weight:900; letter-spacing:.14em; }
        .hero-principles strong { display:block; margin-bottom:8px; font-family:Georgia,serif; font-size:22px; color:#fff0cb; }
        .hero-principles p { margin:0; color:#9eacbf; line-height:1.6; font-size:13px; }
        .hero-boundary { display:grid; grid-template-columns:auto 1fr; gap:16px; align-items:center; max-width:1180px; margin:0 auto; padding:18px 20px; text-align:left; border:1px solid rgba(231,186,101,.35); border-radius:17px; background:rgba(64,46,21,.33); }
        .hero-boundary strong { color:#f4cf86; }
        .hero-boundary span { color:#c4bdad; line-height:1.55; }

        .workspace { display:grid; grid-template-columns:250px minmax(0,1fr) 330px; gap:18px; align-items:start; }
        .left-rail,.right-rail { position:sticky; top:18px; display:grid; gap:14px; }
        .progress-card,.stage-list,.rail-note,.rail-actions,.stage-heading,.panel-card,.notice-panel,.navigation-row,.preview-card,.right-note {
          border:1px solid rgba(151,174,209,.18); border-radius:19px;
          background:linear-gradient(180deg,rgba(15,25,45,.95),rgba(7,12,24,.97));
          box-shadow:0 22px 60px rgba(0,0,0,.18);
        }
        .progress-card { padding:17px; }
        .progress-top { display:flex; justify-content:space-between; align-items:baseline; gap:12px; }
        .progress-top span { color:#9eadc0; font-size:10px; text-transform:uppercase; letter-spacing:.08em; }
        .progress-top strong { font-family:Georgia,serif; font-size:28px; color:#f3ce84; }
        .progress-track { height:8px; overflow:hidden; margin:10px 0 12px; border-radius:999px; background:rgba(255,255,255,.08); }
        .progress-track i { display:block; height:100%; background:linear-gradient(90deg,#74b1e7,#e7bd69); }
        .progress-card small { color:#7f8da1; line-height:1.45; }

        .stage-list { overflow:hidden; }
        .stage-list button { width:100%; display:grid; grid-template-columns:34px 1fr 18px; gap:9px; align-items:center; padding:11px 12px; border:0; border-bottom:1px solid rgba(151,174,209,.09); text-align:left; color:#b9c5d5; background:transparent; cursor:pointer; }
        .stage-list button:hover,.stage-list button.active { background:rgba(232,190,104,.08); }
        .stage-list button.active { box-shadow:inset 3px 0 #e7bd69; color:#fff2d2; }
        .stage-list button>span { color:#75b4e7; font-size:10px; font-weight:900; }
        .stage-list button>div { display:grid; gap:2px; }
        .stage-list button strong { font-size:12px; }
        .stage-list button small { color:#7d8ba0; font-size:9px; }
        .stage-list button b { color:transparent; }
        .stage-list button.complete>span,.stage-list button.complete>b { color:#8fe0b4; }

        .rail-note,.right-note { padding:17px; }
        .rail-note strong,.right-note strong { display:block; margin:7px 0; color:#f7d28a; font-family:Georgia,serif; font-size:19px; font-weight:600; }
        .rail-note p,.right-note p { margin:0; color:#95a4b8; line-height:1.55; font-size:12px; }
        .rail-actions { padding:12px; }
        .rail-actions button { width:100%; }

        .main-panel { min-width:0; display:grid; gap:14px; }
        .stage-heading { display:flex; justify-content:space-between; align-items:center; gap:18px; padding:19px 23px; }
        .stage-heading h2 { margin:4px 0 0; font-family:Georgia,serif; font-size:34px; font-weight:500; }
        .stage-status { padding:8px 10px; border:1px solid rgba(126,187,224,.25); border-radius:999px; color:#9dd4f0; font-size:9px; font-weight:900; letter-spacing:.08em; }
        .stage-status.complete { border-color:rgba(115,208,160,.32); color:#99e0ba; }

        .panel-card { min-height:620px; padding:clamp(22px,4vw,38px); }
        .section-intro { max-width:920px; margin-bottom:26px; }
        .section-intro h3 { margin:7px 0 9px; font-family:Georgia,serif; font-size:clamp(29px,3vw,43px); font-weight:500; }
        .section-intro p { margin:0; color:#a5b2c4; line-height:1.68; }

        .pathway-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
        .pathway-card { display:grid; grid-template-columns:44px 1fr auto; gap:14px; align-items:start; min-height:170px; padding:18px; text-align:left; border:1px solid rgba(151,174,209,.18); border-radius:17px; color:#f1f4f9; background:linear-gradient(180deg,rgba(15,27,49,.78),rgba(8,15,28,.9)); cursor:pointer; transition:transform .18s ease,border-color .18s ease; }
        .pathway-card:hover,.pathway-card.selected { transform:translateY(-2px); border-color:rgba(232,190,104,.55); }
        .pathway-number { display:grid; place-items:center; width:44px; height:44px; border-radius:12px; background:rgba(118,177,230,.1); color:#8bc4f1; font-family:Georgia,serif; font-weight:800; }
        .pathway-copy small { color:#e6bd6e; font-size:8px; font-weight:900; letter-spacing:.12em; }
        .pathway-copy strong { display:block; margin:5px 0 7px; font-family:Georgia,serif; font-size:19px; }
        .pathway-copy p { margin:0; color:#93a2b7; line-height:1.5; font-size:12px; }
        .pathway-state { padding:6px 8px; border:1px solid rgba(130,180,219,.18); border-radius:999px; color:#8ea0b6; font-size:8px; font-weight:900; }
        .pathway-card.selected .pathway-state { color:#9ee0bd; border-color:rgba(137,215,174,.3); }

        .explanation-card { margin-top:16px; padding:20px; border:1px solid rgba(231,187,100,.27); border-radius:16px; background:rgba(64,47,23,.25); }
        .explanation-card>strong { font-family:Georgia,serif; font-size:22px; color:#f7d28b; }
        .explanation-card>p { margin:8px 0 14px; color:#b3ad9f; line-height:1.55; }
        .tag-row { display:flex; flex-wrap:wrap; gap:8px; }
        .tag-row span { padding:6px 9px; border:1px solid rgba(151,174,209,.15); border-radius:999px; color:#9cb2cc; background:rgba(255,255,255,.025); font-size:9px; font-weight:800; }

        .field-grid { display:grid; gap:16px; margin-bottom:18px; }
        .field-grid.two { grid-template-columns:repeat(2,minmax(0,1fr)); }
        label { display:grid; gap:8px; color:#edf2f8; font-size:13px; font-weight:760; }
        label em { color:#eac372; font-size:9px; font-style:normal; text-transform:uppercase; letter-spacing:.09em; }
        label>small { color:#7f91a8; font-size:10px; font-weight:500; }
        input,textarea,select { width:100%; padding:13px 14px; border:1px solid rgba(151,174,209,.25); border-radius:12px; outline:none; color:#f6f8fc; background:rgba(3,8,17,.78); font:inherit; font-weight:500; }
        input:focus,textarea:focus,select:focus { border-color:#e6bd6e; box-shadow:0 0 0 3px rgba(230,189,110,.1); }
        textarea { resize:vertical; line-height:1.58; }
        select option { background:#0a1220; }
        .large-field { margin-top:18px; }

        .boundary-note,.record-requirement,.publication-boundary,.final-boundary { padding:18px; border-left:3px solid #d9ad58; border-radius:0 14px 14px 0; background:rgba(214,170,86,.07); }
        .boundary-note strong,.record-requirement strong,.final-boundary strong { color:#f0cb83; }
        .boundary-note p,.record-requirement p,.final-boundary p { margin:6px 0 0; color:#abb5c4; line-height:1.58; }

        .context-summary { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:24px; }
        .context-summary>div,.review-grid article { padding:16px; border:1px solid rgba(151,174,209,.16); border-radius:13px; background:rgba(255,255,255,.025); }
        .context-summary small,.review-grid small,.receipt-grid small { display:block; color:#7f91a8; font-size:9px; text-transform:uppercase; letter-spacing:.08em; }
        .context-summary strong { display:block; margin-top:7px; color:#f2cf87; font-family:Georgia,serif; font-size:22px; }

        .response-row,.declaration-row { display:flex; align-items:flex-start; gap:12px; padding:15px; border:1px solid rgba(151,174,209,.17); border-radius:14px; background:rgba(255,255,255,.025); }
        .response-row { margin-top:20px; }
        .response-row input,.declaration-row input { width:18px; height:18px; margin-top:2px; accent-color:#d7aa55; }
        .response-row span,.declaration-row span { color:#b8c4d2; font-weight:500; line-height:1.55; }
        .response-row strong,.declaration-row strong { display:block; margin-bottom:4px; color:#fff0ce; }

        .section-toolbar { display:flex; justify-content:space-between; align-items:center; gap:14px; margin-bottom:14px; }
        .section-toolbar>div { display:grid; gap:3px; }
        .section-toolbar strong { color:#f3cf87; font-family:Georgia,serif; font-size:20px; }
        .section-toolbar small { color:#7f91a8; }
        .empty-state { padding:18px; border:1px dashed rgba(151,174,209,.22); border-radius:14px; color:#92a1b4; background:rgba(255,255,255,.02); }

        .link-stack { display:grid; gap:10px; }
        .link-card { display:grid; grid-template-columns:40px 1fr auto; gap:12px; align-items:center; padding:14px; border:1px solid rgba(151,174,209,.17); border-radius:14px; background:rgba(255,255,255,.022); }
        .link-index { display:grid; place-items:center; width:40px; height:40px; border-radius:11px; background:rgba(116,176,231,.1); color:#9ecdf1; font-family:Georgia,serif; font-size:12px; font-weight:800; }
        .link-fields { display:grid; grid-template-columns:minmax(150px,.45fr) 1fr; gap:12px; }
        .disclosure-grid { margin-top:24px; }

        .publication-boundary { margin:18px 0; }
        .publication-boundary>strong { display:block; margin:6px 0; color:#f4d08a; font-family:Georgia,serif; font-size:22px; }
        .publication-boundary>p { margin:0; color:#aaa792; line-height:1.58; }
        .declaration-stack { display:grid; gap:12px; }

        .readiness-hero { padding:26px; text-align:center; border:1px solid rgba(231,187,100,.28); border-radius:18px; background:rgba(68,48,22,.24); }
        .readiness-hero>strong { display:block; margin:8px 0; color:#fff0c8; font-family:Georgia,serif; font-size:64px; }
        .readiness-hero>p { max-width:760px; margin:0 auto; color:#a9b2c1; line-height:1.58; }

        .review-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; margin:18px 0; }
        .review-grid strong { display:block; margin:7px 0 3px; color:#f2ce86; overflow-wrap:anywhere; }
        .review-grid span { color:#8495aa; font-size:10px; overflow-wrap:anywhere; }

        .preview-block { margin:18px 0; padding:20px; border:1px solid rgba(126,180,224,.22); border-radius:16px; background:rgba(14,38,65,.18); }
        .preview-block-heading { display:flex; justify-content:space-between; gap:12px; align-items:flex-start; padding-bottom:14px; border-bottom:1px solid rgba(151,174,209,.12); }
        .preview-block-heading>div { display:grid; gap:4px; }
        .preview-block-heading small { color:#7992ad; font-size:8px; letter-spacing:.12em; }
        .preview-block-heading strong { color:#fff1d1; font-family:Georgia,serif; font-size:20px; }
        .preview-block-heading>span { color:#e8c171; font-size:9px; font-weight:900; letter-spacing:.1em; }
        .preview-block>p { margin:16px 0 0; color:#b2bfce; line-height:1.7; white-space:pre-wrap; }

        .submit-panel { display:flex; justify-content:space-between; align-items:center; gap:20px; margin-top:18px; padding:20px; border:1px solid rgba(112,202,157,.24); border-radius:16px; background:rgba(19,71,48,.12); }
        .submit-panel>div { display:grid; gap:5px; }
        .submit-panel strong { color:#bcf0d2; font-family:Georgia,serif; font-size:22px; }
        .submit-panel p { max-width:670px; margin:0; color:#93aa9d; line-height:1.5; }
        .large-submit { min-width:250px; padding:14px 18px; }

        .success-record { display:grid; grid-template-columns:58px 1fr; gap:18px; margin-top:20px; padding:22px; border:1px solid rgba(105,204,154,.3); border-radius:18px; background:rgba(17,69,48,.16); }
        .success-mark { display:grid; place-items:center; width:58px; height:58px; border-radius:16px; color:#07120c; background:#94e0b9; font-size:26px; font-weight:900; }
        .success-record h3 { margin:4px 0 7px; color:#c8f4dc; font-family:Georgia,serif; font-size:29px; font-weight:600; }
        .success-record p { margin:0; color:#9db4a7; line-height:1.55; }

        .receipt-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin:18px 0; }
        .receipt-grid>span { padding:12px; border:1px solid rgba(105,204,154,.17); border-radius:12px; background:rgba(4,20,13,.28); }
        .receipt-grid strong { display:block; margin-top:5px; overflow-wrap:anywhere; color:#cce9d9; font-size:11px; }
        .receipt-grid .wide { grid-column:1/-1; }
        .receipt-grid code { display:block; margin-top:6px; overflow-wrap:anywhere; color:#9ac7b0; font-size:10px; }

        .notice-panel { padding:16px 19px; color:#d9edff; background:rgba(22,61,96,.32); }
        .notice-panel.has-errors { border-color:rgba(229,127,92,.5); color:#ffe0d3; background:rgba(91,34,23,.32); }
        .notice-panel ul { margin:9px 0 0; padding-left:19px; line-height:1.65; }

        .navigation-row { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:13px; }
        .navigation-row>span { color:#8190a4; font-size:10px; font-weight:900; letter-spacing:.1em; }

        .preview-card { overflow:hidden; }
        .preview-top { display:flex; justify-content:space-between; gap:10px; padding:14px; border-bottom:1px solid rgba(151,174,209,.12); color:#e6bd6e; font-size:8px; font-weight:900; letter-spacing:.1em; }
        .preview-top strong { color:#9fd4f0; }
        .preview-body { display:grid; gap:13px; padding:16px; }
        .preview-body>small { color:#74859b; font-size:8px; letter-spacing:.12em; }
        .preview-body>b { color:#e7bd6b; font-size:10px; }
        .preview-body>h3 { margin:0; color:#fff0cf; font-family:Georgia,serif; font-size:25px; font-weight:500; line-height:1.08; overflow-wrap:anywhere; }
        .preview-body>p,.preview-body section p { margin:0; color:#9eaabd; line-height:1.56; white-space:pre-wrap; font-size:12px; }
        .preview-meta { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .preview-meta>div { padding:9px; border:1px solid rgba(151,174,209,.11); border-radius:10px; background:rgba(255,255,255,.02); }
        .preview-meta small { display:block; color:#74859a; font-size:8px; text-transform:uppercase; }
        .preview-meta strong { display:block; margin-top:4px; color:#dce3ec; font-size:10px; overflow-wrap:anywhere; }
        .preview-body section { padding-top:12px; border-top:1px solid rgba(151,174,209,.11); }
        .preview-body section h4 { margin:0 0 7px; color:#f0cc84; font-family:Georgia,serif; font-size:16px; font-weight:500; }
        .preview-body ul { margin:0; padding-left:17px; color:#94a3b7; line-height:1.6; font-size:11px; }
        .preview-boundary { padding:10px; border-radius:10px; color:#ffd9cb; background:rgba(91,34,23,.24); text-align:center; font-size:8px; font-weight:900; letter-spacing:.08em; }

        footer { display:flex; justify-content:space-between; align-items:center; gap:18px; padding-top:34px; }
        footer>div:first-child { display:grid; gap:4px; }
        footer strong { color:#fff0cf; }
        footer span { color:#7f8da1; font-size:11px; }

        @media (max-width:1300px) {
          .workspace { grid-template-columns:230px minmax(0,1fr); }
          .right-rail { position:relative; grid-column:1/-1; grid-template-columns:2fr 1fr 1fr; top:auto; }
        }

        @media (max-width:1000px) {
          .workspace { grid-template-columns:1fr; }
          .left-rail,.right-rail { position:relative; top:auto; }
          .stage-list { display:grid; grid-template-columns:repeat(2,1fr); }
          .pathway-grid,.hero-principles,.field-grid.two,.review-grid,.right-rail { grid-template-columns:1fr; }
          .link-card { grid-template-columns:36px 1fr; }
          .link-fields { grid-template-columns:1fr; }
          .link-card .remove-button { grid-column:2; justify-self:start; }
        }

        @media (max-width:720px) {
          .rr-page { padding-inline:12px; }
          .topbar,footer,.submit-panel,.stage-heading,.navigation-row,.section-toolbar,.preview-block-heading { flex-direction:column; align-items:stretch; }
          .hero-boundary { grid-template-columns:1fr; }
          .stage-list { grid-template-columns:1fr; }
          .pathway-card { grid-template-columns:40px 1fr; }
          .pathway-state { grid-column:2; justify-self:start; }
          .context-summary,.receipt-grid,.preview-meta { grid-template-columns:1fr; }
          .receipt-grid .wide { grid-column:auto; }
          .link-card { grid-template-columns:1fr; }
          .link-card .remove-button { grid-column:auto; }
          .submit-panel,.success-record { display:grid; grid-template-columns:1fr; }
          .large-submit,.success-actions .primary-button,.success-actions .secondary-button { width:100%; }
        }

        @media (prefers-reduced-motion:reduce) {
          .stars,.line,.orbit,.orb { animation:none; }
          * { scroll-behavior:auto !important; transition:none !important; }
        }
      `}</style>
    </main>
  );
}
