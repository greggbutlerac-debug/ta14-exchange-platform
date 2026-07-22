'use client';

import Link from 'next/link';
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type Visibility = 'PUBLIC' | 'CONTROLLED' | 'PRIVATE';
type ContactVisibility = 'REGISTRY_FORM' | 'WEBSITE_ONLY' | 'PUBLIC_EMAIL' | 'PRIVATE';
type AuthorityRole =
  | 'Founder'
  | 'Author'
  | 'Current steward'
  | 'Organization representative'
  | 'Legal representative'
  | 'Authorized submitter'
  | 'Contributor'
  | 'Third-party claimant'
  | 'Other';
type ReviewPathway =
  | 'Record-only registration'
  | 'Administrative completeness review'
  | 'Identity and authority review'
  | 'Evidence review'
  | 'Independent governance review'
  | 'Partner Review Network review'
  | 'Public dispute resolution pathway';
type EvidenceRelationship =
  | 'Identity'
  | 'Establishment date'
  | 'Authorship'
  | 'Governance claim'
  | 'Technical architecture'
  | 'Public disclosure'
  | 'Ownership or licensing'
  | 'Demonstration'
  | 'Independent review'
  | 'Regulatory mapping'
  | 'Other';
type EvidenceCategory =
  | 'Founding declaration'
  | 'Governance specification'
  | 'Claims evidence'
  | 'Limitations / non-claims'
  | 'Publication'
  | 'Repository export'
  | 'Demonstration record'
  | 'Standards or regulatory mapping'
  | 'Ownership or licensing record'
  | 'Other supporting evidence';

type EvidenceFile = {
  id: string;
  file: File;
  category: EvidenceCategory;
  description: string;
  visibility: Visibility;
  relationship: EvidenceRelationship;
  sha256: string;
};

type PreservedEvidence = {
  id: string;
  submission_id: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  sha256_hex: string;
  evidence_relationship: string;
  evidence_classification: string | null;
  description: string;
  visibility: 'public' | 'private' | 'selective';
  evidence_state: string;
  submitted_at: string;
  storage_bucket: string | null;
  storage_path: string | null;
};


type PublicationRecord = {
  id: string;
  publicationType: string;
  title: string;
  authors: string;
  publisherOrPlatform: string;
  publicationDate: string;
  url: string;
  doi: string;
  isbn: string;
  citationText: string;
  description: string;
  relationshipToGovernance: string;
  visibility: Visibility;
};

type RepositoryRecord = {
  id: string;
  provider: 'GitHub' | 'GitLab' | 'Bitbucket' | 'Codeberg' | 'Other';
  repositoryName: string;
  repositoryOwner: string;
  repositoryUrl: string;
  defaultBranch: string;
  releaseOrTag: string;
  commitSha: string;
  license: string;
  accessState: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';
  description: string;
  relationshipToGovernance: string;
};

type ZenodoRecord = {
  id: string;
  title: string;
  recordUrl: string;
  doi: string;
  conceptDoi: string;
  zenodoRecordId: string;
  version: string;
  publicationDate: string;
  creators: string;
  resourceType: string;
  description: string;
  relationshipToGovernance: string;
  visibility: Visibility;
};

type PatentRecord = {
  id: string;
  title: string;
  jurisdiction: string;
  filingType: string;
  applicationStatus: string;
  applicationNumber: string;
  publicationNumber: string;
  patentNumber: string;
  filingDate: string;
  publicationDate: string;
  grantDate: string;
  priorityDate: string;
  inventors: string;
  applicantOrAssignee: string;
  officialUrl: string;
  description: string;
  relationshipToGovernance: string;
  convertedFromId: string;
  continuationOfId: string;
  visibility: Visibility;
};

type FormState = {
  governanceName: string;
  shortName: string;
  currentVersion: string;
  effectiveVersionDate: string;
  establishmentDate: string;
  governanceCategory: string;
  claimantName: string;
  claimantType: string;
  authorityRole: AuthorityRole;
  authorityEvidence: string;
  stewardName: string;
  organization: string;
  contactEmail: string;
  website: string;
  jurisdiction: string;
  regulatoryScope: string;
  plainDescription: string;
  claims: string;
  nonClaims: string;
  limitations: string;
  ownershipDeclaration: string;
  license: string;
  recordVisibility: Visibility;
  contactVisibility: ContactVisibility;
  allowReviewRequests: boolean;
  allowCollaboration: boolean;
  allowDisputeNotices: boolean;
  disputes: string;
  reviewPathway: ReviewPathway;
  publicContact: boolean;
  authorityConfirmed: boolean;
  accuracyConfirmed: boolean;
  boundaryConfirmed: boolean;
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_TOTAL_SIZE = 250 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'txt',
  'md',
  'csv',
  'json',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'zip',
];

const evidenceCategories: EvidenceCategory[] = [
  'Founding declaration',
  'Governance specification',
  'Claims evidence',
  'Limitations / non-claims',
  'Publication',
  'Repository export',
  'Demonstration record',
  'Standards or regulatory mapping',
  'Ownership or licensing record',
  'Other supporting evidence',
];


const evidenceRelationships: EvidenceRelationship[] = [
  'Identity',
  'Establishment date',
  'Authorship',
  'Governance claim',
  'Technical architecture',
  'Public disclosure',
  'Ownership or licensing',
  'Demonstration',
  'Independent review',
  'Regulatory mapping',
  'Other',
];

const DRAFT_KEY = 'ta14-ai-governance-registry-intake-draft-v3';

function createPublication(): PublicationRecord {
  return {
    id: crypto.randomUUID(), publicationType: 'Article', title: '', authors: '',
    publisherOrPlatform: '', publicationDate: '', url: '', doi: '', isbn: '',
    citationText: '', description: '', relationshipToGovernance: '', visibility: 'PUBLIC',
  };
}

function createRepository(): RepositoryRecord {
  return {
    id: crypto.randomUUID(), provider: 'GitHub', repositoryName: '', repositoryOwner: '',
    repositoryUrl: '', defaultBranch: '', releaseOrTag: '', commitSha: '', license: '',
    accessState: 'PUBLIC', description: '', relationshipToGovernance: '',
  };
}

function createZenodo(): ZenodoRecord {
  return {
    id: crypto.randomUUID(), title: '', recordUrl: '', doi: '', conceptDoi: '',
    zenodoRecordId: '', version: '', publicationDate: '', creators: '', resourceType: '',
    description: '', relationshipToGovernance: '', visibility: 'PUBLIC',
  };
}

function createPatent(): PatentRecord {
  return {
    id: crypto.randomUUID(), title: '', jurisdiction: 'United States',
    filingType: 'Provisional application', applicationStatus: 'Filed',
    applicationNumber: '', publicationNumber: '', patentNumber: '', filingDate: '',
    publicationDate: '', grantDate: '', priorityDate: '', inventors: '',
    applicantOrAssignee: '', officialUrl: '', description: '',
    relationshipToGovernance: '', convertedFromId: '', continuationOfId: '',
    visibility: 'PUBLIC',
  };
}


async function sha256File(file: File) {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
}

const initialForm: FormState = {
  governanceName: '',
  shortName: '',
  currentVersion: '1.0',
  effectiveVersionDate: '',
  establishmentDate: '',
  governanceCategory: '',
  claimantName: '',
  claimantType: 'Individual founder or author',
  authorityRole: 'Founder',
  authorityEvidence: '',
  stewardName: '',
  organization: '',
  contactEmail: '',
  website: '',
  jurisdiction: '',
  regulatoryScope: '',
  plainDescription: '',
  claims: '',
  nonClaims: '',
  limitations: '',
  ownershipDeclaration: '',
  license: '',
  recordVisibility: 'PUBLIC',
  contactVisibility: 'REGISTRY_FORM',
  allowReviewRequests: true,
  allowCollaboration: true,
  allowDisputeNotices: true,
  disputes: '',
  reviewPathway: 'Record-only registration',
  publicContact: false,
  authorityConfirmed: false,
  accuracyConfirmed: false,
  boundaryConfirmed: false,
};

function bytesToSize(bytes: number) {
  if (bytes === 0) return '0 bytes';
  const units = ['bytes', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function fileExtension(name: string) {
  const pieces = name.toLowerCase().split('.');
  return pieces.length > 1 ? pieces.pop() ?? '' : '';
}

export default function RegisterGovernancePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const [publications, setPublications] = useState<PublicationRecord[]>([]);
  const [repositories, setRepositories] = useState<RepositoryRecord[]>([]);
  const [zenodoRecords, setZenodoRecords] = useState<ZenodoRecord[]>([]);
  const [patentRecords, setPatentRecords] = useState<PatentRecord[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftBusy, setDraftBusy] = useState(false);
  const [preservedEvidence, setPreservedEvidence] = useState<PreservedEvidence[]>([]);
  const [evidenceBusyId, setEvidenceBusyId] = useState<string | null>(null);
  const [evidenceListBusy, setEvidenceListBusy] = useState(false);

  const totalSize = useMemo(
    () => files.reduce((total, item) => total + item.file.size, 0),
    [files],
  );

  const requiredCompletion = useMemo(() => {
    const checks = [
      form.governanceName,
      form.currentVersion,
      form.effectiveVersionDate,
      form.establishmentDate,
      form.governanceCategory,
      form.claimantName,
      form.authorityRole,
      form.authorityEvidence,
      form.contactEmail,
      form.plainDescription,
      form.claims,
      form.nonClaims,
      form.ownershipDeclaration,
      form.reviewPathway,
      form.authorityConfirmed,
      form.accuracyConfirmed,
      form.boundaryConfirmed,
    ];
    const complete = checks.filter(Boolean).length;
    return Math.round((complete / checks.length) * 100);
  }, [form]);

  const requiredItems = 17;
  const missingRequired = Math.max(0, Math.ceil(requiredItems * (100 - requiredCompletion) / 100));

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage('');
  }

  async function addFiles(incoming: File[]) {
    const nextErrors: string[] = [];
    const currentKeys = new Set(
      files.map((item) => `${item.file.name}:${item.file.size}:${item.file.lastModified}`),
    );
    const accepted: EvidenceFile[] = [];
    let prospectiveTotal = totalSize;

    for (const file of incoming) {
      const extension = fileExtension(file.name);
      const key = `${file.name}:${file.size}:${file.lastModified}`;

      if (!ACCEPTED_EXTENSIONS.includes(extension)) {
        nextErrors.push(`${file.name}: unsupported file type.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        nextErrors.push(`${file.name}: exceeds the 50 MB individual file limit.`);
        continue;
      }

      if (currentKeys.has(key)) {
        nextErrors.push(`${file.name}: duplicate file was not added.`);
        continue;
      }

      if (prospectiveTotal + file.size > MAX_TOTAL_SIZE) {
        nextErrors.push(`${file.name}: would exceed the 250 MB evidence-package limit.`);
        continue;
      }

      currentKeys.add(key);
      prospectiveTotal += file.size;
      accepted.push({
        id: crypto.randomUUID(),
        file,
        category: 'Other supporting evidence',
        description: '',
        visibility: form.recordVisibility,
        relationship: 'Other',
        sha256: await sha256File(file),
      });
    }

    setFiles((current) => [...current, ...accepted]);
    setErrors(nextErrors);
    if (accepted.length > 0) {
      setMessage(`${accepted.length} evidence file${accepted.length === 1 ? '' : 's'} added.`);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  function updateEvidence(
    id: string,
    changes: Partial<Pick<EvidenceFile, 'category' | 'description' | 'visibility' | 'relationship'>>,
  ) {
    setFiles((current) =>
      current.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }

  function removeEvidence(id: string) {
    setFiles((current) => current.filter((item) => item.id !== id));
    setMessage('Evidence file removed from this intake package.');
  }

  async function loadPreservedEvidence(submissionId: string) {
    setEvidenceListBusy(true);
    try {
      const response = await fetch(
        `/api/ai-governance/registry/evidence?submissionId=${encodeURIComponent(submissionId)}`,
        { method: 'GET', cache: 'no-store' },
      );
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to load preserved evidence.');
      setPreservedEvidence(payload.evidence ?? []);
    } catch (error) {
      setErrors((current) => [
        ...current,
        error instanceof Error ? error.message : 'Unable to load preserved evidence.',
      ]);
    } finally {
      setEvidenceListBusy(false);
    }
  }

  async function preserveEvidence(item: EvidenceFile) {
    if (!draftId) {
      setErrors(['Save the Registry intake as a private draft before preserving evidence files.']);
      document.querySelector('.progress-panel')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!item.description.trim()) {
      setErrors([`${item.file.name}: describe what this file supports before preserving it.`]);
      return;
    }

    setEvidenceBusyId(item.id);
    setErrors([]);
    try {
      const body = new FormData();
      body.append('file', item.file);
      body.append('submissionId', draftId);
      body.append('evidenceRelationship', item.relationship);
      body.append('evidenceClassification', item.category);
      body.append('description', item.description.trim());
      body.append(
        'visibility',
        item.visibility === 'PUBLIC'
          ? 'public'
          : item.visibility === 'CONTROLLED'
            ? 'selective'
            : 'private',
      );

      const response = await fetch('/api/ai-governance/registry/evidence', {
        method: 'POST',
        body,
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to preserve evidence.');

      setPreservedEvidence((current) => [...current, payload.evidence]);
      setFiles((current) => current.filter((candidate) => candidate.id !== item.id));
      setMessage(`${item.file.name} is preserved, hashed, private by policy, and bound to this Registry draft.`);
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : `Unable to preserve ${item.file.name}.`,
      ]);
    } finally {
      setEvidenceBusyId(null);
    }
  }

  async function deletePreservedEvidence(id: string) {
    setEvidenceBusyId(id);
    setErrors([]);
    try {
      const response = await fetch(
        `/api/ai-governance/registry/evidence?id=${encodeURIComponent(id)}`,
        { method: 'DELETE' },
      );
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to delete evidence.');
      setPreservedEvidence((current) => current.filter((item) => item.id !== id));
      setMessage('The preserved evidence object and its draft metadata were deleted.');
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Unable to delete evidence.']);
    } finally {
      setEvidenceBusyId(null);
    }
  }


  function updatePublication(id: string, changes: Partial<PublicationRecord>) {
    setPublications((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item));
  }
  function updateRepository(id: string, changes: Partial<RepositoryRecord>) {
    setRepositories((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item));
  }
  function updateZenodo(id: string, changes: Partial<ZenodoRecord>) {
    setZenodoRecords((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item));
  }
  function updatePatent(id: string, changes: Partial<PatentRecord>) {
    setPatentRecords((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item));
  }

  function hydrateFromServerDraft(draft: any) {
    const submission = draft.submission ?? {};

    setDraftId(submission.id ?? null);
    setForm({
      ...initialForm,
      governanceName: submission.governance_name ?? '',
      shortName: submission.short_name ?? '',
      currentVersion: submission.current_version ?? '',
      effectiveVersionDate: submission.effective_version_date ?? '',
      establishmentDate: submission.claimed_establishment_date ?? '',
      governanceCategory: submission.governance_category ?? '',
      claimantName: submission.claimant_name ?? '',
      claimantType: submission.claimant_type ?? initialForm.claimantType,
      authorityRole: submission.submitter_authority_role ?? initialForm.authorityRole,
      authorityEvidence: submission.authority_basis ?? '',
      stewardName: submission.current_steward ?? '',
      organization: submission.organization_name ?? '',
      contactEmail: submission.contact_email ?? '',
      website: submission.public_website ?? '',
      jurisdiction: submission.geographic_scope ?? '',
      regulatoryScope: submission.regulatory_scope ?? '',
      plainDescription: submission.plain_language_description ?? '',
      claims: submission.formal_claims ?? '',
      nonClaims: submission.explicit_non_claims ?? '',
      limitations: submission.known_limitations ?? '',
      ownershipDeclaration: submission.ownership_declaration ?? '',
      license: submission.license_statement ?? '',
      recordVisibility:
        submission.record_visibility === 'public'
          ? 'PUBLIC'
          : submission.record_visibility === 'selective'
            ? 'CONTROLLED'
            : 'PRIVATE',
      contactVisibility:
        submission.public_contact_mode === 'public_email'
          ? 'PUBLIC_EMAIL'
          : submission.public_contact_mode === 'website_only'
            ? 'WEBSITE_ONLY'
            : submission.public_contact_mode === 'private'
              ? 'PRIVATE'
              : 'REGISTRY_FORM',
      allowReviewRequests: Boolean(submission.allow_review_requests),
      allowCollaboration: Boolean(submission.allow_collaboration_inquiries),
      allowDisputeNotices: Boolean(submission.allow_dispute_notices),
      disputes: submission.known_disputes ?? '',
      reviewPathway: submission.requested_review_pathway ?? initialForm.reviewPathway,
      publicContact: submission.public_contact_mode !== 'private',
      authorityConfirmed: Boolean(submission.authority_declaration_accepted),
      accuracyConfirmed: Boolean(submission.accuracy_declaration_accepted),
      boundaryConfirmed: Boolean(submission.registry_boundary_accepted),
    });

    setPublications(
      (draft.publications ?? []).map((item: any) => ({
        id: item.id ?? crypto.randomUUID(),
        publicationType: item.publication_type ?? 'Article',
        title: item.title ?? '',
        authors: item.authors ?? '',
        publisherOrPlatform: item.publisher_or_platform ?? '',
        publicationDate: item.publication_date ?? '',
        url: item.url ?? '',
        doi: item.doi ?? '',
        isbn: item.isbn ?? '',
        citationText: item.citation_text ?? '',
        description: item.abstract_or_description ?? '',
        relationshipToGovernance: item.relationship_to_governance ?? '',
        visibility: item.visibility === 'public' ? 'PUBLIC' : item.visibility === 'selective' ? 'CONTROLLED' : 'PRIVATE',
      })),
    );

    setRepositories(
      (draft.repositories ?? []).map((item: any) => ({
        id: item.id ?? crypto.randomUUID(),
        provider: (item.provider
          ? item.provider.charAt(0).toUpperCase() + item.provider.slice(1)
          : 'GitHub') as RepositoryRecord['provider'],
        repositoryName: item.repository_name ?? '',
        repositoryOwner: item.repository_owner ?? '',
        repositoryUrl: item.repository_url ?? '',
        defaultBranch: item.default_branch ?? '',
        releaseOrTag: item.release_or_tag ?? '',
        commitSha: item.commit_sha ?? '',
        license: item.license ?? '',
        accessState: (item.access_state ?? 'public').toUpperCase() as RepositoryRecord['accessState'],
        description: item.description ?? '',
        relationshipToGovernance: item.relationship_to_governance ?? '',
      })),
    );

    setZenodoRecords(
      (draft.zenodoRecords ?? []).map((item: any) => ({
        id: item.id ?? crypto.randomUUID(),
        title: item.title ?? '',
        recordUrl: item.record_url ?? '',
        doi: item.doi ?? '',
        conceptDoi: item.concept_doi ?? '',
        zenodoRecordId: item.zenodo_record_id ?? '',
        version: item.version ?? '',
        publicationDate: item.publication_date ?? '',
        creators: item.creators ?? '',
        resourceType: item.resource_type ?? '',
        description: item.description ?? '',
        relationshipToGovernance: item.relationship_to_governance ?? '',
        visibility: item.visibility === 'public' ? 'PUBLIC' : item.visibility === 'selective' ? 'CONTROLLED' : 'PRIVATE',
      })),
    );

    setPatentRecords(
      (draft.patentRecords ?? []).map((item: any) => ({
        id: item.id ?? crypto.randomUUID(),
        title: item.title ?? '',
        jurisdiction: item.jurisdiction ?? '',
        filingType: item.filing_type ?? '',
        applicationStatus: item.application_status ?? '',
        applicationNumber: item.application_number ?? '',
        publicationNumber: item.publication_number ?? '',
        patentNumber: item.patent_number ?? '',
        filingDate: item.filing_date ?? '',
        publicationDate: item.publication_date ?? '',
        grantDate: item.grant_date ?? '',
        priorityDate: item.priority_date ?? '',
        inventors: item.inventors ?? '',
        applicantOrAssignee: item.applicant_or_assignee ?? '',
        officialUrl: item.official_url ?? '',
        description: item.description ?? '',
        relationshipToGovernance: item.relationship_to_governance ?? '',
        convertedFromId: '',
        continuationOfId: '',
        visibility: item.visibility === 'public' ? 'PUBLIC' : item.visibility === 'selective' ? 'CONTROLLED' : 'PRIVATE',
      })),
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function resumeDraft() {
      try {
        const response = await fetch('/api/ai-governance/registry/drafts', {
          method: 'GET',
          cache: 'no-store',
        });

        if (response.ok) {
          const payload = await response.json();
          if (!cancelled && payload.draft) {
            hydrateFromServerDraft(payload.draft);
            if (payload.draft.submission?.id) {
              await loadPreservedEvidence(payload.draft.submission.id);
            }
            setMessage('Private Registry draft resumed from your signed-in account, including preserved evidence metadata.');
            return;
          }
        }
      } catch {
        // Browser-local recovery below remains available as a resilience layer.
      }

      const saved = window.localStorage.getItem(DRAFT_KEY);
      if (!saved || cancelled) return;

      try {
        const parsed = JSON.parse(saved) as {
          form?: FormState;
          publications?: PublicationRecord[];
          repositories?: RepositoryRecord[];
          zenodoRecords?: ZenodoRecord[];
          patentRecords?: PatentRecord[];
        };
        if (parsed.form) {
          setForm({ ...initialForm, ...parsed.form });
          setPublications(parsed.publications ?? []);
          setRepositories(parsed.repositories ?? []);
          setZenodoRecords(parsed.zenodoRecords ?? []);
          setPatentRecords(parsed.patentRecords ?? []);
          setMessage('A browser recovery draft was loaded. Save it while signed in to preserve it under your account. Evidence files must be reattached.');
        }
      } catch {
        window.localStorage.removeItem(DRAFT_KEY);
      }
    }

    resumeDraft();
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveDraft() {
    setDraftBusy(true);
    setErrors([]);

    const recoveryPayload = {
      savedAt: new Date().toISOString(),
      form,
      publications,
      repositories,
      zenodoRecords,
      patentRecords,
    };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(recoveryPayload));

    try {
      const response = await fetch('/api/ai-governance/registry/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: draftId ?? undefined,
          form,
          publications,
          repositories,
          zenodoRecords,
          patentRecords,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to save the Registry draft.');
      }

      setDraftId(payload.draftId);
      await loadPreservedEvidence(payload.draftId);
      setMessage('Private draft saved to your signed-in Registry account. Evidence files may now be preserved and bound to this draft.');
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Unable to save the Registry draft.']);
      setMessage('A browser recovery copy was preserved, but the account-backed draft was not saved.');
    } finally {
      setDraftBusy(false);
    }
  }

  async function discardDraft() {
    setDraftBusy(true);
    setErrors([]);

    try {
      if (draftId) {
        const response = await fetch(`/api/ai-governance/registry/drafts?id=${encodeURIComponent(draftId)}`, {
          method: 'DELETE',
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error ?? 'Unable to delete the Registry draft.');
        }
      }

      window.localStorage.removeItem(DRAFT_KEY);
      setDraftId(null);
      setForm(initialForm);
      setFiles([]);
      setPreservedEvidence([]);
      setPublications([]);
      setRepositories([]);
      setZenodoRecords([]);
      setPatentRecords([]);
      setMessage('Private Registry draft discarded.');
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Unable to discard the Registry draft.']);
    } finally {
      setDraftBusy(false);
    }
  }

  function reviewMissingItems() {
    validate();
    document.querySelector<HTMLElement>('[data-required-incomplete="true"]')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  function validate() {
    const nextErrors: string[] = [];
    if (!form.governanceName.trim()) nextErrors.push('Governance name is required.');
    if (!form.currentVersion.trim()) nextErrors.push('Current version is required.');
    if (!form.effectiveVersionDate) nextErrors.push('Effective version date is required.');
    if (!form.establishmentDate) nextErrors.push('Claimed establishment date is required.');
    if (!form.governanceCategory.trim()) nextErrors.push('Governance category is required.');
    if (!form.claimantName.trim()) nextErrors.push('Claimant name is required.');
    if (!form.authorityRole) nextErrors.push('Submission authority role is required.');
    if (!form.authorityEvidence.trim()) nextErrors.push('Authority evidence or explanation is required.');
    if (!form.contactEmail.trim()) nextErrors.push('Contact email is required.');
    if (!form.plainDescription.trim()) nextErrors.push('Plain-language description is required.');
    if (!form.claims.trim()) nextErrors.push('At least one affirmative claim is required.');
    if (!form.nonClaims.trim()) nextErrors.push('Explicit non-claims are required.');
    if (!form.ownershipDeclaration.trim()) {
      nextErrors.push('Ownership and submission-rights declaration is required.');
    }
    if (!form.authorityConfirmed) nextErrors.push('Submission authority must be confirmed.');
    if (!form.accuracyConfirmed) nextErrors.push('Accuracy declaration must be confirmed.');
    if (!form.boundaryConfirmed) nextErrors.push('Registry boundary must be acknowledged.');

    if (!form.reviewPathway) nextErrors.push('A requested review pathway is required.');

    const undocumented = files.filter((item) => !item.description.trim());
    if (undocumented.length > 0) {
      nextErrors.push('Every evidence file requires a short description.');
    }

    setErrors(nextErrors);
    return nextErrors.length === 0;
  }

  function buildManifest() {
    return {
      schema: 'TA-14-AI-GOVERNANCE-REGISTRY-INTAKE',
      schemaVersion: '1.0',
      generatedAt: new Date().toISOString(),
      registryBoundary:
        'This intake package records a declaration and supporting evidence. It is not certification, legal validation, regulatory approval, technical verification, or an ownership determination.',
      registration: form,
      publications,
      repositories,
      zenodoRecords,
      patentRecords,
      evidenceManifest: files.map((item) => ({
        filename: item.file.name,
        mediaType: item.file.type || 'application/octet-stream',
        sizeBytes: item.file.size,
        lastModified: new Date(item.file.lastModified).toISOString(),
        category: item.category,
        relationship: item.relationship,
        description: item.description,
        visibility: item.visibility,
        sha256: item.sha256,
      })),
    };
  }

  function downloadManifest() {
    if (!validate()) {
      setMessage('Complete the required fields before generating the intake manifest.');
      return;
    }

    const blob = new Blob([JSON.stringify(buildManifest(), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${form.shortName || form.governanceName || 'governance'}-registry-intake.json`
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, '-');
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setMessage('Review-ready intake manifest generated. Evidence files remain on this device.');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      setMessage('The intake package is not ready for review. Resolve the items below.');
      return;
    }
    setMessage(
      'The intake package is review-ready. Registry submission storage is not connected on this page yet; generate the manifest to preserve the completed intake now.',
    );
  }

  return (
    <main className="registry-intake-page">
      <div className="cosmos" aria-hidden="true">
        <div className="stars stars-a" />
        <div className="stars stars-b" />
        <div className="orb orb-one" />
        <div className="orb orb-two" />
      </div>

      <header className="topbar">
        <Link href="/workspace/ai-governance/registry" className="brand-button">
          <span className="brand-mark">TA-14</span>
          <span>
            <strong>AI Governance Registry</strong>
            <small>Governed registration intake</small>
          </span>
        </Link>
        <nav aria-label="Registry navigation">
          <Link href="/workspace/ai-governance/registry" className="nav-button">
            Registry Method
          </Link>
          <Link href="/workspace/ai-governance/registry/records" className="nav-button">
            Search Registry
          </Link>
          <Link href="/workspace" className="nav-button">
            Open Workspace
          </Link>
        </nav>
      </header>

      <section className="hero-shell">
        <div className="eyebrow">FORMAL REGISTRY INTAKE · FOUNDATIONAL RELEASE</div>
        <h1>Register an AI Governance Architecture</h1>
        <p>
          Establish a dated, attributable, versioned declaration of identity, scope,
          claims, non-claims, evidence, stewardship, ownership, and limitations.
        </p>
        <div className="boundary-banner">
          <strong>Registration is not certification.</strong>
          <span>
            Submission records what was declared and supplied. It does not by itself
            establish truth, ownership priority, legal compliance, technical efficacy,
            regulatory acceptance, or fitness for use.
          </span>
        </div>
      </section>

      <section className="progress-panel" aria-label="Intake completion">
        <div>
          <span>Required intake completion</span>
          <strong>{requiredCompletion}% · {missingRequired} required item{missingRequired === 1 ? '' : 's'} remain</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${requiredCompletion}%` }} />
        </div>
        <div className="progress-actions">
          <button type="button" className="mini-button" onClick={saveDraft} disabled={draftBusy}>{draftBusy ? 'Saving…' : draftId ? 'Update Draft' : 'Save Draft'}</button>
          <button type="button" className="mini-button" onClick={reviewMissingItems}>Review Missing Items</button>
          <button type="button" className="mini-button danger" onClick={discardDraft} disabled={draftBusy}>Discard Draft</button>
        </div>
        <div className="progress-meta">
          <span>{files.length} evidence files</span>
          <span>{bytesToSize(totalSize)} of 250 MB</span>
          <span>{form.recordVisibility.toLowerCase()} record</span>
        </div>
      </section>

      <form onSubmit={handleSubmit} noValidate>
        <section className="form-section">
          <div className="section-heading">
            <span>01</span>
            <div>
              <h2>Governance Identity</h2>
              <p>Identify the architecture as it should appear in the Registry.</p>
            </div>
          </div>
          <div className="field-grid three">
            <label>
              Governance name <em>Required</em>
              <input
                value={form.governanceName}
                onChange={(event) => updateField('governanceName', event.target.value)}
                placeholder="Full public governance name"
              />
            </label>
            <label>
              Short name or acronym
              <input
                value={form.shortName}
                onChange={(event) => updateField('shortName', event.target.value)}
                placeholder="Optional"
              />
            </label>
            <label>
              Current version <em>Required</em>
              <input
                value={form.currentVersion}
                onChange={(event) => updateField('currentVersion', event.target.value)}
                placeholder="1.0"
              />
            </label>
            <label data-required-incomplete={!form.effectiveVersionDate}>
              Effective version date <em>Required</em>
              <span className="date-wrap">
                <input
                  type="date"
                  value={form.effectiveVersionDate}
                  onChange={(event) => updateField('effectiveVersionDate', event.target.value)}
                />
              </span>
            </label>
            <label data-required-incomplete={!form.establishmentDate}>
              Claimed establishment date <em>Required</em>
              <span className="date-wrap">
                <input
                  type="date"
                  value={form.establishmentDate}
                  onChange={(event) => updateField('establishmentDate', event.target.value)}
                />
              </span>
            </label>
            <label>
              Governance category <em>Required</em>
              <input
                value={form.governanceCategory}
                onChange={(event) => updateField('governanceCategory', event.target.value)}
                placeholder="AI governance, runtime governance, evidence governance..."
              />
            </label>
            <label>
              Record visibility
              <select
                value={form.recordVisibility}
                onChange={(event) =>
                  updateField('recordVisibility', event.target.value as Visibility)
                }
              >
                <option value="PUBLIC">Public</option>
                <option value="CONTROLLED">Controlled access</option>
                <option value="PRIVATE">Private intake</option>
              </select>
            </label>
          </div>
        </section>

        <section className="form-section">
          <div className="section-heading">
            <span>02</span>
            <div>
              <h2>Attribution and Stewardship</h2>
              <p>Separate the claimant, submitter, steward, and organization.</p>
            </div>
          </div>
          <div className="field-grid two">
            <label>
              Claimant, founder, or author <em>Required</em>
              <input
                value={form.claimantName}
                onChange={(event) => updateField('claimantName', event.target.value)}
                placeholder="Full legal or public name"
              />
            </label>
            <label>
              Claimant type
              <select
                value={form.claimantType}
                onChange={(event) => updateField('claimantType', event.target.value)}
              >
                <option>Individual founder or author</option>
                <option>Organization</option>
                <option>Research group</option>
                <option>Standards or governance body</option>
                <option>Joint claimants</option>
              </select>
            </label>
            <label data-required-incomplete={!form.authorityRole}>
              Submission authority role <em>Required</em>
              <select
                value={form.authorityRole}
                onChange={(event) => updateField('authorityRole', event.target.value as AuthorityRole)}
              >
                {['Founder','Author','Current steward','Organization representative','Legal representative','Authorized submitter','Contributor','Third-party claimant','Other'].map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </label>
            <label data-required-incomplete={!form.authorityEvidence.trim()}>
              Authority evidence or explanation <em>Required</em>
              <input
                value={form.authorityEvidence}
                onChange={(event) => updateField('authorityEvidence', event.target.value)}
                placeholder="Appointment, authorization, founding record, public role, or disclosed limitation"
              />
            </label>
            <label>
              Current steward
              <input
                value={form.stewardName}
                onChange={(event) => updateField('stewardName', event.target.value)}
                placeholder="Person or entity responsible for the current version"
              />
            </label>
            <label>
              Organization
              <input
                value={form.organization}
                onChange={(event) => updateField('organization', event.target.value)}
                placeholder="Organization, institution, or independent practice"
              />
            </label>
            <label>
              Contact email <em>Required</em>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(event) => updateField('contactEmail', event.target.value)}
                placeholder="registry-contact@example.com"
              />
            </label>
            <label>
              Public website or repository
              <input
                type="url"
                value={form.website}
                onChange={(event) => updateField('website', event.target.value)}
                placeholder="https://"
              />
            </label>
          </div>
          <div className="field-grid two">
            <label>
              Public contact treatment
              <select
                value={form.contactVisibility}
                onChange={(event) => updateField('contactVisibility', event.target.value as ContactVisibility)}
              >
                <option value="REGISTRY_FORM">Registry-managed contact form</option>
                <option value="WEBSITE_ONLY">Display website only</option>
                <option value="PUBLIC_EMAIL">Display submitted email publicly</option>
                <option value="PRIVATE">Keep contact private</option>
              </select>
            </label>
          </div>
          <div className="contact-permissions">
            <label className="check-row"><input type="checkbox" checked={form.allowReviewRequests} onChange={(event) => updateField('allowReviewRequests', event.target.checked)} /><span>Allow governed review requests.</span></label>
            <label className="check-row"><input type="checkbox" checked={form.allowCollaboration} onChange={(event) => updateField('allowCollaboration', event.target.checked)} /><span>Allow collaboration inquiries.</span></label>
            <label className="check-row"><input type="checkbox" checked={form.allowDisputeNotices} onChange={(event) => updateField('allowDisputeNotices', event.target.checked)} /><span>Allow formal dispute notices.</span></label>
          </div>
        </section>

        <section className="form-section">
          <div className="section-heading">
            <span>03</span>
            <div>
              <h2>Scope, Claims, and Boundaries</h2>
              <p>Make the affirmative claims and the non-claims equally visible.</p>
            </div>
          </div>
          <div className="field-grid two">
            <label>
              Geographic or jurisdictional scope
              <input
                value={form.jurisdiction}
                onChange={(event) => updateField('jurisdiction', event.target.value)}
                placeholder="Global, United States, European Union, sector-specific..."
              />
            </label>
            <label>
              Regulatory or standards scope
              <input
                value={form.regulatoryScope}
                onChange={(event) => updateField('regulatoryScope', event.target.value)}
                placeholder="EU AI Act, NIST AI RMF, ISO/IEC, internal governance..."
              />
            </label>
          </div>
          <label>
            Plain-language description <em>Required</em>
            <textarea
              rows={5}
              value={form.plainDescription}
              onChange={(event) => updateField('plainDescription', event.target.value)}
              placeholder="Explain what the governance architecture is, who it serves, what it governs, and how it is intended to be used."
            />
          </label>
          <div className="field-grid two textareas">
            <label>
              Formal claims <em>Required</em>
              <textarea
                rows={8}
                value={form.claims}
                onChange={(event) => updateField('claims', event.target.value)}
                placeholder="List each affirmative claim on a separate line. Avoid unsupported promotional language."
              />
            </label>
            <label>
              Explicit non-claims <em>Required</em>
              <textarea
                rows={8}
                value={form.nonClaims}
                onChange={(event) => updateField('nonClaims', event.target.value)}
                placeholder="State what this architecture does not prove, certify, guarantee, replace, or authorize."
              />
            </label>
          </div>
          <label>
            Known limitations, dependencies, and unresolved questions
            <textarea
              rows={6}
              value={form.limitations}
              onChange={(event) => updateField('limitations', event.target.value)}
              placeholder="Identify known implementation limits, dependencies, conflicts, exceptions, evidence gaps, and unresolved questions."
            />
          </label>
        </section>

        <section className="form-section evidence-section">
          <div className="section-heading">
            <span>04</span>
            <div>
              <h2>Evidence Package</h2>
              <p>Drag, drop, classify, and describe every supporting item.</p>
            </div>
          </div>

          <div
            className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              if (event.currentTarget === event.target) setDragActive(false);
            }}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_EXTENSIONS.map((extension) => `.${extension}`).join(',')}
              onChange={handleFileChange}
              className="hidden-file-input"
            />
            <div className="upload-symbol">⇧</div>
            <h3>Drop evidence files here</h3>
            <p>
              Or use the polished file selector. Multiple files are supported, with
              duplicate, type, individual-size, and package-size validation.
            </p>
            <button
              type="button"
              className="primary-button"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Evidence Files
              <span>＋</span>
            </button>
            <small>
              PDF, DOCX, TXT, CSV, JSON, XLSX, PPTX, images, and ZIP · 50 MB each ·
              250 MB package
            </small>
          </div>

          <div className="evidence-boundary">
            <strong>Evidence-boundary notice</strong>
            <p>
              Uploading preserves the submitted item and its declared relationship to
              the registration. It does not establish authenticity, truth, ownership,
              validity, regulatory acceptance, or technical effectiveness.
            </p>
          </div>

          {files.length > 0 && (
            <div className="evidence-list">
              {files.map((item, index) => (
                <article className="evidence-item" key={item.id}>
                  <div className="file-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="file-body">
                    <div className="file-header">
                      <div>
                        <h3>{item.file.name}</h3>
                        <p>
                          {bytesToSize(item.file.size)} ·{' '}
                          {item.file.type || 'Unspecified media type'}
                        </p>
                      </div>
                      <div className="file-actions">
                        <button
                          type="button"
                          className="primary-button compact-button"
                          disabled={!draftId || evidenceBusyId === item.id}
                          onClick={() => preserveEvidence(item)}
                        >
                          {evidenceBusyId === item.id ? 'Preserving…' : draftId ? 'Preserve Evidence' : 'Save Draft First'}
                        </button>
                        <button
                          type="button"
                          className="remove-button"
                          disabled={evidenceBusyId === item.id}
                          onClick={() => removeEvidence(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="hash-line"><strong>SHA-256</strong><code>{item.sha256}</code></div>
                    <div className="field-grid three compact">
                      <label>
                        Evidence category
                        <select
                          value={item.category}
                          onChange={(event) =>
                            updateEvidence(item.id, {
                              category: event.target.value as EvidenceCategory,
                            })
                          }
                        >
                          {evidenceCategories.map((category) => (
                            <option key={category}>{category}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Declared evidence relationship
                        <select
                          value={item.relationship}
                          onChange={(event) => updateEvidence(item.id, { relationship: event.target.value as EvidenceRelationship })}
                        >
                          {evidenceRelationships.map((relationship) => (
                            <option key={relationship}>{relationship}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Evidence visibility
                        <select
                          value={item.visibility}
                          onChange={(event) =>
                            updateEvidence(item.id, {
                              visibility: event.target.value as Visibility,
                            })
                          }
                        >
                          <option value="PUBLIC">Public</option>
                          <option value="CONTROLLED">Controlled access</option>
                          <option value="PRIVATE">Private</option>
                        </select>
                      </label>
                    </div>
                    <label>
                      What this file supports <em>Required</em>
                      <textarea
                        rows={3}
                        value={item.description}
                        onChange={(event) =>
                          updateEvidence(item.id, { description: event.target.value })
                        }
                        placeholder="Describe the specific claim, identity assertion, version, boundary, ownership declaration, or historical event this item supports."
                      />
                    </label>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="preserved-evidence-panel">
            <div className="preserved-heading">
              <div>
                <span className="status-kicker">ACCOUNT-BACKED EVIDENCE</span>
                <h3>Preserved and bound to this draft</h3>
              </div>
              <span className="preserved-count">
                {evidenceListBusy ? 'Loading…' : `${preservedEvidence.length} preserved`}
              </span>
            </div>
            {!draftId && (
              <p className="empty-state">Save the intake as a private draft before uploading evidence to Registry storage.</p>
            )}
            {draftId && !evidenceListBusy && preservedEvidence.length === 0 && (
              <p className="empty-state">No evidence files have been preserved for this draft yet.</p>
            )}
            {preservedEvidence.length > 0 && (
              <div className="preserved-list">
                {preservedEvidence.map((item) => (
                  <article className="preserved-item" key={item.id}>
                    <div className="preserved-status" aria-label="Preserved evidence status">✓</div>
                    <div className="preserved-body">
                      <div className="file-header">
                        <div>
                          <h3>{item.original_filename}</h3>
                          <p>{bytesToSize(item.size_bytes)} · {item.mime_type}</p>
                        </div>
                        <button
                          type="button"
                          className="remove-button"
                          disabled={evidenceBusyId === item.id}
                          onClick={() => deletePreservedEvidence(item.id)}
                        >
                          {evidenceBusyId === item.id ? 'Deleting…' : 'Delete Draft Evidence'}
                        </button>
                      </div>
                      <div className="evidence-badges">
                        <span>Preserved</span>
                        <span>SHA-256 hashed</span>
                        <span>Bound to draft</span>
                        <span>{item.visibility === 'public' ? 'Public after registration' : item.visibility === 'selective' ? 'Controlled access' : 'Private'}</span>
                      </div>
                      <p className="preserved-description">{item.description}</p>
                      <div className="hash-line"><strong>SHA-256</strong><code>{item.sha256_hex}</code></div>
                      <div className="preserved-meta">
                        <span><strong>Relationship:</strong> {item.evidence_relationship}</span>
                        <span><strong>Classification:</strong> {item.evidence_classification || 'Not specified'}</span>
                        <span><strong>Preserved:</strong> {new Date(item.submitted_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="form-section">
          <div className="section-heading">
            <span>05</span>
            <div>
              <h2>Publications, Repositories, Zenodo, and Patents</h2>
              <p>Preserve each external source as its own repeatable, attributable Registry record.</p>
            </div>
          </div>

          <div className="source-boundary">
            <strong>Links are not interchangeable.</strong>
            <p>An article, a GitHub repository, a Zenodo deposit, a patent application, and a granted patent carry different identifiers, dates, states, and evidentiary meanings. Each remains separately declared.</p>
          </div>

          <div className="source-group">
            <div className="source-group-heading">
              <div><span>AR</span><h3>Articles and Publications</h3></div>
              <button type="button" className="mini-button" onClick={() => setPublications((current) => [...current, createPublication()])}>Add Publication</button>
            </div>
            {publications.length === 0 && <p className="empty-state">No publications added. Add articles, books, papers, reports, standards, white papers, presentations, or websites.</p>}
            {publications.map((item, index) => (
              <article className="source-card" key={item.id}>
                <div className="source-card-title"><strong>Publication {index + 1}</strong><button type="button" className="remove-button" onClick={() => setPublications((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button></div>
                <div className="field-grid three compact">
                  <label>Publication type<select value={item.publicationType} onChange={(e) => updatePublication(item.id, { publicationType: e.target.value })}><option>Article</option><option>Book</option><option>Book chapter</option><option>Paper</option><option>Report</option><option>Standard</option><option>White paper</option><option>Presentation</option><option>Website</option><option>Other</option></select></label>
                  <label>Title<input value={item.title} onChange={(e) => updatePublication(item.id, { title: e.target.value })} /></label>
                  <label>Authors<input value={item.authors} onChange={(e) => updatePublication(item.id, { authors: e.target.value })} /></label>
                  <label>Publisher or platform<input value={item.publisherOrPlatform} onChange={(e) => updatePublication(item.id, { publisherOrPlatform: e.target.value })} /></label>
                  <label>Publication date<input type="date" value={item.publicationDate} onChange={(e) => updatePublication(item.id, { publicationDate: e.target.value })} /></label>
                  <label>Public URL<input type="url" value={item.url} onChange={(e) => updatePublication(item.id, { url: e.target.value })} placeholder="https://" /></label>
                  <label>DOI<input value={item.doi} onChange={(e) => updatePublication(item.id, { doi: e.target.value })} /></label>
                  <label>ISBN<input value={item.isbn} onChange={(e) => updatePublication(item.id, { isbn: e.target.value })} /></label>
                  <label>Visibility<select value={item.visibility} onChange={(e) => updatePublication(item.id, { visibility: e.target.value as Visibility })}><option value="PUBLIC">Public</option><option value="CONTROLLED">Controlled</option><option value="PRIVATE">Private</option></select></label>
                </div>
                <label>Citation text<input value={item.citationText} onChange={(e) => updatePublication(item.id, { citationText: e.target.value })} /></label>
                <label>Description<textarea rows={3} value={item.description} onChange={(e) => updatePublication(item.id, { description: e.target.value })} /></label>
                <label>Relationship to this governance architecture<textarea rows={3} value={item.relationshipToGovernance} onChange={(e) => updatePublication(item.id, { relationshipToGovernance: e.target.value })} /></label>
              </article>
            ))}
          </div>

          <div className="source-group">
            <div className="source-group-heading">
              <div><span>GH</span><h3>GitHub and Software Repositories</h3></div>
              <button type="button" className="mini-button" onClick={() => setRepositories((current) => [...current, createRepository()])}>Add GitHub Repository</button>
            </div>
            {repositories.length === 0 && <p className="empty-state">No repositories added. GitHub receives its own dedicated record rather than being hidden in a general links field.</p>}
            {repositories.map((item, index) => (
              <article className="source-card" key={item.id}>
                <div className="source-card-title"><strong>Repository {index + 1}</strong><button type="button" className="remove-button" onClick={() => setRepositories((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button></div>
                <div className="field-grid three compact">
                  <label>Provider<select value={item.provider} onChange={(e) => updateRepository(item.id, { provider: e.target.value as RepositoryRecord['provider'] })}><option>GitHub</option><option>GitLab</option><option>Bitbucket</option><option>Codeberg</option><option>Other</option></select></label>
                  <label>Repository name<input value={item.repositoryName} onChange={(e) => updateRepository(item.id, { repositoryName: e.target.value })} /></label>
                  <label>Repository owner<input value={item.repositoryOwner} onChange={(e) => updateRepository(item.id, { repositoryOwner: e.target.value })} /></label>
                  <label>Repository URL<input type="url" value={item.repositoryUrl} onChange={(e) => updateRepository(item.id, { repositoryUrl: e.target.value })} placeholder="https://github.com/..." /></label>
                  <label>Default branch<input value={item.defaultBranch} onChange={(e) => updateRepository(item.id, { defaultBranch: e.target.value })} placeholder="main" /></label>
                  <label>Release or tag<input value={item.releaseOrTag} onChange={(e) => updateRepository(item.id, { releaseOrTag: e.target.value })} /></label>
                  <label>Commit SHA<input value={item.commitSha} onChange={(e) => updateRepository(item.id, { commitSha: e.target.value })} /></label>
                  <label>License<input value={item.license} onChange={(e) => updateRepository(item.id, { license: e.target.value })} /></label>
                  <label>Access state<select value={item.accessState} onChange={(e) => updateRepository(item.id, { accessState: e.target.value as RepositoryRecord['accessState'] })}><option value="PUBLIC">Public</option><option value="PRIVATE">Private</option><option value="RESTRICTED">Restricted</option></select></label>
                </div>
                <label>Description<textarea rows={3} value={item.description} onChange={(e) => updateRepository(item.id, { description: e.target.value })} /></label>
                <label>Relationship to this governance architecture<textarea rows={3} value={item.relationshipToGovernance} onChange={(e) => updateRepository(item.id, { relationshipToGovernance: e.target.value })} /></label>
              </article>
            ))}
          </div>

          <div className="source-group">
            <div className="source-group-heading">
              <div><span>ZE</span><h3>Zenodo Records</h3></div>
              <button type="button" className="mini-button" onClick={() => setZenodoRecords((current) => [...current, createZenodo()])}>Add Zenodo Record</button>
            </div>
            {zenodoRecords.length === 0 && <p className="empty-state">No Zenodo records added. Add one deposit, then another, without collapsing separate DOIs or versions.</p>}
            {zenodoRecords.map((item, index) => (
              <article className="source-card" key={item.id}>
                <div className="source-card-title"><strong>Zenodo Record {index + 1}</strong><button type="button" className="remove-button" onClick={() => setZenodoRecords((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button></div>
                <div className="field-grid three compact">
                  <label>Title<input value={item.title} onChange={(e) => updateZenodo(item.id, { title: e.target.value })} /></label>
                  <label>Zenodo record URL<input type="url" value={item.recordUrl} onChange={(e) => updateZenodo(item.id, { recordUrl: e.target.value })} placeholder="https://zenodo.org/records/..." /></label>
                  <label>Record DOI<input value={item.doi} onChange={(e) => updateZenodo(item.id, { doi: e.target.value })} /></label>
                  <label>Concept DOI<input value={item.conceptDoi} onChange={(e) => updateZenodo(item.id, { conceptDoi: e.target.value })} /></label>
                  <label>Zenodo record ID<input value={item.zenodoRecordId} onChange={(e) => updateZenodo(item.id, { zenodoRecordId: e.target.value })} /></label>
                  <label>Version<input value={item.version} onChange={(e) => updateZenodo(item.id, { version: e.target.value })} /></label>
                  <label>Publication date<input type="date" value={item.publicationDate} onChange={(e) => updateZenodo(item.id, { publicationDate: e.target.value })} /></label>
                  <label>Creators<input value={item.creators} onChange={(e) => updateZenodo(item.id, { creators: e.target.value })} /></label>
                  <label>Resource type<input value={item.resourceType} onChange={(e) => updateZenodo(item.id, { resourceType: e.target.value })} /></label>
                  <label>Visibility<select value={item.visibility} onChange={(e) => updateZenodo(item.id, { visibility: e.target.value as Visibility })}><option value="PUBLIC">Public</option><option value="CONTROLLED">Controlled</option><option value="PRIVATE">Private</option></select></label>
                </div>
                <label>Description<textarea rows={3} value={item.description} onChange={(e) => updateZenodo(item.id, { description: e.target.value })} /></label>
                <label>Relationship to this governance architecture<textarea rows={3} value={item.relationshipToGovernance} onChange={(e) => updateZenodo(item.id, { relationshipToGovernance: e.target.value })} /></label>
              </article>
            ))}
          </div>

          <div className="source-group">
            <div className="source-group-heading">
              <div><span>IP</span><h3>Patent Applications and Granted Patents</h3></div>
              <button type="button" className="mini-button" onClick={() => setPatentRecords((current) => [...current, createPatent()])}>Add Patent Application or Patent</button>
            </div>
            {patentRecords.length === 0 && <p className="empty-state">No patent records added. Applications and granted patents remain distinct, with conversion and continuation lineage preserved.</p>}
            {patentRecords.map((item, index) => (
              <article className="source-card" key={item.id}>
                <div className="source-card-title"><strong>Patent Record {index + 1}</strong><button type="button" className="remove-button" onClick={() => setPatentRecords((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button></div>
                <div className="field-grid three compact">
                  <label>Title<input value={item.title} onChange={(e) => updatePatent(item.id, { title: e.target.value })} /></label>
                  <label>Jurisdiction<input value={item.jurisdiction} onChange={(e) => updatePatent(item.id, { jurisdiction: e.target.value })} /></label>
                  <label>Filing type<select value={item.filingType} onChange={(e) => updatePatent(item.id, { filingType: e.target.value })}><option>Provisional application</option><option>Non-provisional application</option><option>PCT application</option><option>Continuation</option><option>Continuation-in-part</option><option>Divisional</option><option>Reissue application</option><option>Utility patent</option><option>Design patent</option><option>Plant patent</option><option>Foreign application</option><option>Other</option></select></label>
                  <label>Status<select value={item.applicationStatus} onChange={(e) => updatePatent(item.id, { applicationStatus: e.target.value })}><option>Draft</option><option>Filed</option><option>Pending</option><option>Published</option><option>Allowed</option><option>Granted</option><option>Abandoned</option><option>Rejected</option><option>Expired</option><option>Lapsed</option><option>Withdrawn</option></select></label>
                  <label>Application number<input value={item.applicationNumber} onChange={(e) => updatePatent(item.id, { applicationNumber: e.target.value })} /></label>
                  <label>Publication number<input value={item.publicationNumber} onChange={(e) => updatePatent(item.id, { publicationNumber: e.target.value })} /></label>
                  <label>Patent number<input value={item.patentNumber} onChange={(e) => updatePatent(item.id, { patentNumber: e.target.value })} /></label>
                  <label>Filing date<input type="date" value={item.filingDate} onChange={(e) => updatePatent(item.id, { filingDate: e.target.value })} /></label>
                  <label>Publication date<input type="date" value={item.publicationDate} onChange={(e) => updatePatent(item.id, { publicationDate: e.target.value })} /></label>
                  <label>Grant date<input type="date" value={item.grantDate} onChange={(e) => updatePatent(item.id, { grantDate: e.target.value })} /></label>
                  <label>Priority date<input type="date" value={item.priorityDate} onChange={(e) => updatePatent(item.id, { priorityDate: e.target.value })} /></label>
                  <label>Inventors<input value={item.inventors} onChange={(e) => updatePatent(item.id, { inventors: e.target.value })} /></label>
                  <label>Applicant or assignee<input value={item.applicantOrAssignee} onChange={(e) => updatePatent(item.id, { applicantOrAssignee: e.target.value })} /></label>
                  <label>Official URL<input type="url" value={item.officialUrl} onChange={(e) => updatePatent(item.id, { officialUrl: e.target.value })} placeholder="https://" /></label>
                  <label>Visibility<select value={item.visibility} onChange={(e) => updatePatent(item.id, { visibility: e.target.value as Visibility })}><option value="PUBLIC">Public</option><option value="CONTROLLED">Controlled</option><option value="PRIVATE">Private</option></select></label>
                  <label>Converted from application<select value={item.convertedFromId} onChange={(e) => updatePatent(item.id, { convertedFromId: e.target.value })}><option value="">None declared</option>{patentRecords.filter((candidate) => candidate.id !== item.id).map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.applicationNumber || candidate.title || 'Untitled patent record'}</option>)}</select></label>
                  <label>Continuation of<select value={item.continuationOfId} onChange={(e) => updatePatent(item.id, { continuationOfId: e.target.value })}><option value="">None declared</option>{patentRecords.filter((candidate) => candidate.id !== item.id).map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.applicationNumber || candidate.title || 'Untitled patent record'}</option>)}</select></label>
                </div>
                <label>Description<textarea rows={3} value={item.description} onChange={(e) => updatePatent(item.id, { description: e.target.value })} /></label>
                <label>Relationship to this governance architecture<textarea rows={3} value={item.relationshipToGovernance} onChange={(e) => updatePatent(item.id, { relationshipToGovernance: e.target.value })} /></label>
              </article>
            ))}
          </div>
        </section>

        <section className="form-section">
          <div className="section-heading">
            <span>06</span>
            <div>
              <h2>Rights and Declarations</h2>
              <p>Preserve authority, ownership assertions, licensing, and submission boundaries.</p>
            </div>
          </div>
          <div className="field-grid two">
            <label>
              Ownership and submission-rights declaration <em>Required</em>
              <textarea
                rows={7}
                value={form.ownershipDeclaration}
                onChange={(event) =>
                  updateField('ownershipDeclaration', event.target.value)
                }
                placeholder="State who claims ownership or stewardship, the submitter's authority, known joint interests, and any contested or uncertain rights."
              />
            </label>
            <label>
              License or permitted-use statement
              <textarea
                rows={7}
                value={form.license}
                onChange={(event) => updateField('license', event.target.value)}
                placeholder="Identify the applicable license, reserved rights, public-use permissions, or restrictions."
              />
            </label>
          </div>

          <label>
            Known disputes, competing claims, or attribution conflicts
            <textarea
              rows={6}
              value={form.disputes}
              onChange={(event) => updateField('disputes', event.target.value)}
              placeholder="Disclose contested authorship, ownership disagreements, former collaborators, competing establishment dates, known objections, or pending proceedings. State 'None known' when appropriate."
            />
          </label>

          <div className="review-pathway-panel">
            <label data-required-incomplete={!form.reviewPathway}>
              Requested Registry pathway <em>Required</em>
              <select value={form.reviewPathway} onChange={(event) => updateField('reviewPathway', event.target.value as ReviewPathway)}>
                <option>Record-only registration</option>
                <option>Administrative completeness review</option>
                <option>Identity and authority review</option>
                <option>Evidence review</option>
                <option>Independent governance review</option>
                <option>Partner Review Network review</option>
                <option>Public dispute resolution pathway</option>
              </select>
            </label>
            <p>The selected pathway defines the requested depth of review. Registration alone remains distinct from certification, endorsement, legal compliance, or technical validation.</p>
          </div>

          <div className="declaration-stack">
            <label className="declaration-row">
              <input
                type="checkbox"
                checked={form.authorityConfirmed}
                onChange={(event) =>
                  updateField('authorityConfirmed', event.target.checked)
                }
              />
              <span>
                <strong>Authority to submit</strong>
                I declare that I am authorized to submit this registration and its
                evidence, or I have clearly disclosed the limits of that authority.
              </span>
            </label>
            <label className="declaration-row">
              <input
                type="checkbox"
                checked={form.accuracyConfirmed}
                onChange={(event) =>
                  updateField('accuracyConfirmed', event.target.checked)
                }
              />
              <span>
                <strong>Accuracy and attribution</strong>
                I declare that the registration is accurate to the best of my knowledge
                and that material sources, contributors, disputes, and limitations have
                not been knowingly concealed.
              </span>
            </label>
            <label className="declaration-row">
              <input
                type="checkbox"
                checked={form.boundaryConfirmed}
                onChange={(event) =>
                  updateField('boundaryConfirmed', event.target.checked)
                }
              />
              <span>
                <strong>Registry boundary</strong>
                I understand that registration preserves a declaration and supporting
                evidence; it is not certification, legal advice, regulatory approval,
                ownership adjudication, or proof that the architecture works as claimed.
              </span>
            </label>
          </div>
        </section>

        {(errors.length > 0 || message) && (
          <section className={`notice-panel ${errors.length > 0 ? 'has-errors' : ''}`} aria-live="polite">
            {message && <strong>{message}</strong>}
            {errors.length > 0 && (
              <ul>
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        <section className="submission-panel">
          <div>
            <div className="eyebrow">REVIEW-READY INTAKE PACKAGE</div>
            <h2>Preserve the declaration before requesting registration.</h2>
            <p>
              Review and validate the registration, then download a JSON manifest containing the metadata, declared evidence relationships, and SHA-256 file hashes. Private drafts and uploaded evidence are now preserved under the signed-in account, but they are not public Registry records. A public Registry record does not exist until intake is formally submitted, reviewed, accepted, assigned an identifier, and published by the Registry.
            </p>
          </div>
          <div className="submission-actions">
            <button type="button" className="secondary-button" onClick={downloadManifest}>
              Download Intake Manifest
              <span>↓</span>
            </button>
            <button type="submit" className="primary-button large">
              Review & Validate Intake
              <span>✓</span>
            </button>
          </div>
        </section>
      </form>

      <footer>
        <div>
          <strong>TA-14 AI Governance Registry</strong>
          <span>Declaration · Identity · Evidence · Review · Registration · Version</span>
        </div>
        <Link href="/workspace/ai-governance/registry" className="nav-button">
          Return to Registry
          <span>←</span>
        </Link>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(body) { margin: 0; background: #050812; color: #f7f3e8; }
        .registry-intake-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 24px clamp(18px, 4vw, 64px) 56px;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:
            radial-gradient(circle at 50% 10%, rgba(23, 72, 130, .2), transparent 32%),
            linear-gradient(180deg, #050812 0%, #090d19 45%, #050711 100%);
        }
        .cosmos { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
        .stars { position: absolute; inset: -25%; opacity: .48; background-image: radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.4px); background-size: 48px 48px; animation: drift 30s linear infinite; }
        .stars-b { opacity: .2; background-size: 83px 83px; animation-duration: 50s; animation-direction: reverse; }
        .orb { position: absolute; border-radius: 999px; filter: blur(2px); opacity: .25; }
        .orb-one { width: 260px; height: 260px; right: -90px; top: 18%; background: radial-gradient(circle at 35% 35%, #8ad7ff, #19316c 52%, transparent 72%); }
        .orb-two { width: 190px; height: 190px; left: -70px; top: 62%; background: radial-gradient(circle at 40% 35%, #f7c471, #7d3f14 48%, transparent 72%); }
        @keyframes drift { to { transform: translate3d(80px, 60px, 0); } }
        .topbar, .hero-shell, .progress-panel, form, footer { position: relative; z-index: 2; max-width: 1220px; margin-inline: auto; }
        .topbar { display: flex; justify-content: space-between; gap: 20px; align-items: center; padding: 12px 0 30px; }
        .topbar nav { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
        .brand-button, .nav-button, .primary-button, .secondary-button, .remove-button { text-decoration: none; border: 1px solid rgba(219, 177, 102, .48); color: #fff8e8; background: linear-gradient(180deg, rgba(78,55,25,.62), rgba(29,23,18,.84)); box-shadow: inset 0 1px rgba(255,255,255,.08), 0 10px 25px rgba(0,0,0,.22); transition: transform .2s ease, border-color .2s ease, background .2s ease; }
        .brand-button:hover, .nav-button:hover, .primary-button:hover, .secondary-button:hover, .remove-button:hover { transform: translateY(-2px); border-color: rgba(255,214,139,.9); }
        .brand-button { display: inline-flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 14px; }
        .brand-button span:last-child { display: grid; gap: 2px; }
        .brand-button small { color: #c8b998; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
        .brand-mark { display: grid; place-items: center; min-width: 56px; height: 42px; border-radius: 10px; background: linear-gradient(145deg, #d7a74e, #6e431d); font-family: Georgia, serif; font-weight: 800; color: #130d07; }
        .nav-button { display: inline-flex; align-items: center; gap: 8px; padding: 11px 15px; border-radius: 12px; font-size: 13px; font-weight: 700; }
        .hero-shell { text-align: center; padding: clamp(34px, 7vw, 82px) 0 34px; }
        .eyebrow { color: #e8bc68; letter-spacing: .2em; font-size: 12px; font-weight: 800; }
        h1, h2, h3, p { margin-top: 0; }
        h1 { max-width: 900px; margin: 18px auto; font-family: Georgia, serif; font-size: clamp(42px, 7vw, 82px); line-height: .98; font-weight: 500; }
        .hero-shell > p { max-width: 820px; margin: 0 auto 26px; color: #c9d1df; font-size: clamp(17px, 2vw, 21px); line-height: 1.65; }
        .boundary-banner { display: grid; gap: 5px; max-width: 900px; margin: 0 auto; padding: 18px 22px; text-align: left; border: 1px solid rgba(231,184,96,.4); border-radius: 18px; background: rgba(47,35,20,.56); }
        .boundary-banner strong { color: #ffd98e; }
        .boundary-banner span { color: #d7ceba; line-height: 1.55; }
        .progress-panel { padding: 20px 24px; margin-bottom: 24px; border: 1px solid rgba(126,158,203,.25); border-radius: 18px; background: rgba(10,17,32,.82); backdrop-filter: blur(12px); }
        .progress-panel > div:first-child, .progress-meta { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .progress-panel strong { color: #f0c979; }
        .progress-track { height: 9px; margin: 13px 0; overflow: hidden; border-radius: 999px; background: rgba(255,255,255,.08); }
        .progress-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, #7cb6e8, #e8bc68); transition: width .3s ease; }
        .progress-actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 14px 0; }
        .mini-button { border: 1px solid rgba(219,177,102,.38); border-radius: 10px; padding: 9px 12px; cursor: pointer; color: #f7edd7; background: rgba(67,48,25,.48); font-weight: 750; }
        .mini-button.danger { border-color: rgba(226,124,92,.4); color: #ffd9cc; background: rgba(92,35,24,.3); }
        .progress-meta { color: #9eabc0; font-size: 12px; text-transform: uppercase; letter-spacing: .09em; }
        form { display: grid; gap: 22px; }
        .form-section { padding: clamp(22px, 4vw, 38px); border: 1px solid rgba(151,169,199,.2); border-radius: 24px; background: linear-gradient(180deg, rgba(15,24,43,.94), rgba(8,13,25,.96)); box-shadow: 0 25px 70px rgba(0,0,0,.22); }
        .section-heading { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 26px; }
        .section-heading > span { display: grid; place-items: center; flex: 0 0 44px; height: 44px; border-radius: 12px; background: linear-gradient(145deg, #d9aa55, #704519); color: #160e06; font-family: Georgia, serif; font-weight: 900; }
        .section-heading h2 { margin-bottom: 5px; font-family: Georgia, serif; font-size: clamp(25px, 3vw, 36px); font-weight: 500; }
        .section-heading p { color: #98a7bc; margin-bottom: 0; }
        .field-grid { display: grid; gap: 18px; margin-bottom: 18px; }
        .field-grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .field-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .field-grid.compact { margin-bottom: 14px; }
        label { display: grid; gap: 8px; color: #edf2fa; font-size: 13px; font-weight: 750; letter-spacing: .02em; }
        label em { color: #eec571; font-size: 10px; font-style: normal; text-transform: uppercase; letter-spacing: .1em; }
        input, select, textarea { width: 100%; border: 1px solid rgba(151,169,199,.28); border-radius: 12px; padding: 13px 14px; color: #f6f8fc; background: rgba(4,9,18,.82); font: inherit; font-weight: 500; outline: none; }
        input:focus, select:focus, textarea:focus { border-color: #e8bc68; box-shadow: 0 0 0 3px rgba(232,188,104,.12); }
        textarea { resize: vertical; line-height: 1.55; }
        select option { background: #0b1220; }
        .date-wrap { display: block; width: 100%; }
        .date-wrap input { min-width: 0; }
        .check-row, .declaration-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px; border: 1px solid rgba(151,169,199,.18); border-radius: 14px; background: rgba(255,255,255,.025); }
        .check-row input, .declaration-row input { width: 18px; height: 18px; margin-top: 2px; accent-color: #d9aa55; }
        .check-row span, .declaration-row span { font-weight: 500; line-height: 1.55; color: #cbd4e2; }
        .declaration-row strong { display: block; margin-bottom: 3px; color: #fff4d9; }
        .declaration-stack { display: grid; gap: 12px; }
        .contact-permissions { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        .review-pathway-panel { display: grid; gap: 12px; margin: 22px 0; padding: 18px; border: 1px solid rgba(232,188,104,.28); border-radius: 16px; background: rgba(232,188,104,.055); }
        .review-pathway-panel p { margin: 0; color: #aeb9ca; line-height: 1.55; }

        .source-boundary { margin-bottom: 24px; padding: 17px 19px; border-left: 3px solid #79b4e6; border-radius: 0 14px 14px 0; background: rgba(60,105,151,.1); }
        .source-boundary strong { color: #bcdfff; }
        .source-boundary p { margin: 5px 0 0; color: #b8c6d8; line-height: 1.55; }
        .source-group { display: grid; gap: 14px; padding: 22px 0; border-top: 1px solid rgba(151,169,199,.16); }
        .source-group:first-of-type { border-top: 0; }
        .source-group-heading, .source-card-title { display: flex; justify-content: space-between; align-items: center; gap: 14px; }
        .source-group-heading > div { display: flex; align-items: center; gap: 12px; }
        .source-group-heading span { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 10px; color: #170f07; background: linear-gradient(145deg, #e3bb70, #86531f); font-family: Georgia, serif; font-weight: 900; }
        .source-group-heading h3 { margin: 0; font-family: Georgia, serif; font-size: clamp(21px, 3vw, 29px); font-weight: 500; }
        .empty-state { margin: 0; padding: 18px; border: 1px dashed rgba(151,169,199,.22); border-radius: 14px; color: #98a8bd; background: rgba(255,255,255,.02); }
        .source-card { display: grid; gap: 15px; padding: 19px; border: 1px solid rgba(151,169,199,.22); border-radius: 18px; background: rgba(255,255,255,.025); }
        .source-card-title strong { color: #f1ce89; font-family: Georgia, serif; font-size: 18px; }
        .hash-line { display: grid; gap: 5px; margin: 0 0 14px; padding: 10px 12px; border-radius: 10px; background: rgba(0,0,0,.24); }
        .hash-line strong { color: #e9c474; font-size: 11px; letter-spacing: .12em; }
        .hash-line code { overflow-wrap: anywhere; color: #adc6df; font-size: 11px; }
        [data-required-incomplete="true"] input, [data-required-incomplete="true"] select, [data-required-incomplete="true"] textarea { border-color: rgba(232,188,104,.55); }
        .drop-zone { display: grid; justify-items: center; gap: 12px; padding: clamp(34px, 7vw, 70px) 20px; text-align: center; border: 1px dashed rgba(232,188,104,.55); border-radius: 22px; background: radial-gradient(circle at 50% 30%, rgba(69,111,164,.18), transparent 58%), rgba(4,10,20,.6); transition: border-color .2s ease, background .2s ease, transform .2s ease; }
        .drop-zone.drag-active { border-color: #ffd98e; background: rgba(70,55,29,.42); transform: scale(1.005); }
        .drop-zone h3 { margin-bottom: 0; font-family: Georgia, serif; font-size: 28px; }
        .drop-zone p { max-width: 650px; margin-bottom: 0; color: #aebbd0; line-height: 1.55; }
        .drop-zone small { color: #8f9cb0; }
        .upload-symbol { display: grid; place-items: center; width: 64px; height: 64px; border: 1px solid rgba(232,188,104,.5); border-radius: 18px; color: #ffd98e; background: linear-gradient(145deg, rgba(232,188,104,.18), rgba(42,67,101,.2)); font-size: 30px; }
        .hidden-file-input { display: none; }
        .primary-button, .secondary-button { display: inline-flex; justify-content: center; align-items: center; gap: 12px; border-radius: 13px; padding: 13px 18px; cursor: pointer; font-weight: 800; }
        .primary-button { background: linear-gradient(180deg, #d7ab59, #87521f); color: #160e07; border-color: #f0ce85; }
        .primary-button.large { min-height: 54px; padding-inline: 24px; }
        .secondary-button { background: linear-gradient(180deg, rgba(47,73,108,.94), rgba(22,34,55,.96)); border-color: rgba(130,178,225,.55); }
        .evidence-boundary { margin: 18px 0; padding: 16px 18px; border-left: 3px solid #d7aa57; background: rgba(216,170,85,.07); }
        .evidence-boundary strong { color: #f2ce87; }
        .evidence-boundary p { margin: 5px 0 0; color: #b9c3d2; line-height: 1.55; }
        .evidence-list { display: grid; gap: 14px; margin-top: 18px; }
        .evidence-item { display: flex; gap: 16px; padding: 18px; border: 1px solid rgba(151,169,199,.22); border-radius: 18px; background: rgba(255,255,255,.025); }
        .file-index { display: grid; place-items: center; flex: 0 0 44px; height: 44px; border-radius: 12px; background: rgba(129,164,207,.12); color: #a9d6ff; font-family: Georgia, serif; font-weight: 800; }
        .file-body { min-width: 0; flex: 1; }
        .file-header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 16px; }
        .file-header h3 { overflow-wrap: anywhere; margin-bottom: 4px; font-size: 17px; }
        .file-header p { margin-bottom: 0; color: #8f9db1; font-size: 12px; }
        .remove-button { padding: 9px 12px; border-radius: 10px; cursor: pointer; color: #ffd8ca; border-color: rgba(226,124,92,.42); background: rgba(94,34,23,.28); }
        .file-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
        .compact-button { padding: 9px 12px; border-radius: 10px; font-size: 12px; }
        button:disabled { cursor: not-allowed; opacity: .5; transform: none !important; }
        .preserved-evidence-panel { display: grid; gap: 16px; margin-top: 24px; padding: 20px; border: 1px solid rgba(104,190,150,.3); border-radius: 20px; background: rgba(20,72,51,.12); }
        .preserved-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
        .preserved-heading h3 { margin: 4px 0 0; font-family: Georgia, serif; font-size: 25px; font-weight: 500; }
        .status-kicker { color: #8ee0b9; font-size: 10px; font-weight: 850; letter-spacing: .15em; }
        .preserved-count { padding: 8px 11px; border: 1px solid rgba(104,190,150,.35); border-radius: 999px; color: #b8f2d6; background: rgba(34,103,73,.22); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
        .preserved-list { display: grid; gap: 12px; }
        .preserved-item { display: flex; gap: 14px; padding: 17px; border: 1px solid rgba(104,190,150,.24); border-radius: 17px; background: rgba(5,18,15,.48); }
        .preserved-status { display: grid; place-items: center; flex: 0 0 42px; height: 42px; border-radius: 50%; color: #07140e; background: linear-gradient(145deg, #9ae9c1, #3d956c); font-weight: 950; }
        .preserved-body { min-width: 0; flex: 1; }
        .evidence-badges { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 12px; }
        .evidence-badges span { padding: 6px 9px; border: 1px solid rgba(104,190,150,.28); border-radius: 999px; color: #bdebd5; background: rgba(42,109,79,.18); font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
        .preserved-description { margin: 0 0 12px; color: #c5d4cc; line-height: 1.55; }
        .preserved-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; color: #9db4a8; font-size: 11px; }
        .preserved-meta strong { color: #d4eadf; }
        .notice-panel { padding: 18px 22px; border: 1px solid rgba(126,177,221,.38); border-radius: 16px; color: #d9ecff; background: rgba(24,64,100,.34); }
        .notice-panel.has-errors { border-color: rgba(230,128,93,.55); color: #ffe1d4; background: rgba(92,35,24,.34); }
        .notice-panel ul { margin: 10px 0 0; padding-left: 20px; line-height: 1.7; }
        .submission-panel { display: flex; justify-content: space-between; gap: 30px; align-items: center; padding: clamp(24px, 5vw, 44px); border: 1px solid rgba(232,188,104,.42); border-radius: 24px; background: linear-gradient(120deg, rgba(71,48,20,.7), rgba(13,28,49,.9)); }
        .submission-panel > div:first-child { max-width: 700px; }
        .submission-panel h2 { margin: 8px 0; font-family: Georgia, serif; font-size: clamp(26px, 4vw, 42px); font-weight: 500; }
        .submission-panel p { margin-bottom: 0; color: #c4cddd; line-height: 1.6; }
        .submission-actions { display: grid; gap: 12px; min-width: min(100%, 270px); }
        footer { display: flex; justify-content: space-between; gap: 20px; align-items: center; padding-top: 34px; }
        footer > div { display: grid; gap: 4px; }
        footer span { color: #8996a9; font-size: 12px; }
        @media (max-width: 900px) {
          .field-grid.three { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .submission-panel { align-items: stretch; flex-direction: column; }
          .submission-actions { width: 100%; }
        }
        @media (max-width: 680px) {
          .registry-intake-page { padding-inline: 14px; }
          .topbar, footer { align-items: stretch; flex-direction: column; }
          .topbar nav { justify-content: stretch; }
          .topbar nav .nav-button { flex: 1; justify-content: center; }
          .field-grid.two, .field-grid.three, .contact-permissions { grid-template-columns: 1fr; }
          .source-group-heading, .source-card-title { align-items: stretch; flex-direction: column; }
          .source-group-heading .mini-button, .source-card-title .remove-button { width: 100%; }
          .form-section { padding: 20px 16px; }
          .section-heading { gap: 12px; }
          .evidence-item { flex-direction: column; }
          .file-header { flex-direction: column; }
          .file-actions { width: 100%; flex-direction: column; }
          .file-actions button, .remove-button { width: 100%; }
          .preserved-heading { align-items: stretch; flex-direction: column; }
          .preserved-item { flex-direction: column; }
          .preserved-meta { grid-template-columns: 1fr; }
          footer .nav-button { justify-content: center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .stars { animation: none; }
          * { scroll-behavior: auto !important; transition: none !important; }
        }
      `}</style>
    </main>
  );
}
