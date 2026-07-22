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


const wizardSteps = [
  { number: '01', title: 'Governance Identity', short: 'Identity' },
  { number: '02', title: 'Founder & Authority', short: 'Authority' },
  { number: '03', title: 'Stewardship', short: 'Stewardship' },
  { number: '04', title: 'Governance Description', short: 'Description' },
  { number: '05', title: 'Claims', short: 'Claims' },
  { number: '06', title: 'Non-Claims', short: 'Non-Claims' },
  { number: '07', title: 'Scope & Jurisdiction', short: 'Scope' },
  { number: '08', title: 'Evidence Package', short: 'Evidence' },
  { number: '09', title: 'Publications', short: 'Publications' },
  { number: '10', title: 'Repositories & Deposits', short: 'Repositories' },
  { number: '11', title: 'Patents & Rights', short: 'Rights' },
  { number: '12', title: 'Review Pathway', short: 'Review' },
  { number: '13', title: 'Declarations', short: 'Declarations' },
  { number: '14', title: 'Preview & Receipt', short: 'Preview' },
] as const;

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
  const [activeStep, setActiveStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [receiptGenerated, setReceiptGenerated] = useState(false);

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


  const qualityScores = useMemo(() => {
    const score = (items: unknown[]) =>
      Math.round((items.filter(Boolean).length / Math.max(items.length, 1)) * 100);

    return {
      identity: score([
        form.governanceName,
        form.shortName || true,
        form.currentVersion,
        form.effectiveVersionDate,
        form.establishmentDate,
        form.governanceCategory,
      ]),
      attribution: score([
        form.claimantName,
        form.authorityRole,
        form.authorityEvidence,
        form.stewardName || form.claimantName,
        form.organization || true,
        form.contactEmail,
      ]),
      boundaries: score([
        form.plainDescription,
        form.claims,
        form.nonClaims,
        form.limitations || true,
        form.regulatoryScope || true,
      ]),
      evidence: Math.min(
        100,
        (files.length + preservedEvidence.length) * 20 +
          publications.length * 10 +
          repositories.length * 10 +
          zenodoRecords.length * 10 +
          patentRecords.length * 10,
      ),
      rights: score([
        form.ownershipDeclaration,
        form.license || true,
        form.disputes || true,
        form.reviewPathway,
      ]),
    };
  }, [
    form,
    files.length,
    preservedEvidence.length,
    publications.length,
    repositories.length,
    zenodoRecords.length,
    patentRecords.length,
  ]);

  const overallReadiness = useMemo(
    () =>
      Math.round(
        (qualityScores.identity +
          qualityScores.attribution +
          qualityScores.boundaries +
          qualityScores.evidence +
          qualityScores.rights) /
          5,
      ),
    [qualityScores],
  );

  function stepHasRequiredData(step: number) {
    switch (step) {
      case 0:
        return Boolean(
          form.governanceName.trim() &&
            form.currentVersion.trim() &&
            form.effectiveVersionDate &&
            form.establishmentDate &&
            form.governanceCategory.trim(),
        );
      case 1:
        return Boolean(
          form.claimantName.trim() &&
            form.authorityRole &&
            form.authorityEvidence.trim() &&
            form.contactEmail.trim(),
        );
      case 2:
        return Boolean(form.stewardName.trim() || form.claimantName.trim());
      case 3:
        return Boolean(form.plainDescription.trim());
      case 4:
        return Boolean(form.claims.trim());
      case 5:
        return Boolean(form.nonClaims.trim());
      case 6:
        return true;
      case 7:
        return files.every((item) => item.description.trim());
      case 8:
      case 9:
      case 10:
        return true;
      case 11:
        return Boolean(form.reviewPathway);
      case 12:
        return Boolean(
          form.authorityConfirmed &&
            form.accuracyConfirmed &&
            form.boundaryConfirmed,
        );
      case 13:
        return validate();
      default:
        return true;
    }
  }

  function goToStep(next: number) {
    if (next > activeStep && !stepHasRequiredData(activeStep)) {
      setErrors([
        `Complete the required items in Step ${wizardSteps[activeStep].number}: ${wizardSteps[activeStep].title} before continuing.`,
      ]);
      setMessage('This step is not complete yet.');
      return;
    }

    setErrors([]);
    setMessage('');
    setActiveStep(Math.max(0, Math.min(wizardSteps.length - 1, next)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function generateReceipt() {
    if (!validate()) {
      setMessage('Complete the required fields before generating the Registry Intake Receipt.');
      return;
    }

    const manifest = buildManifest();
    const receipt = {
      receiptType: 'TA-14 AI Governance Registry Intake Receipt',
      receiptVersion: '1.0',
      generatedAt: new Date().toISOString(),
      submissionState: 'REVIEW_READY_NOT_PUBLIC',
      draftId: draftId ?? 'browser-recovery-draft',
      governanceName: form.governanceName,
      currentVersion: form.currentVersion,
      claimedEstablishmentDate: form.establishmentDate,
      evidenceCounts: {
        localEvidenceFiles: files.length,
        preservedEvidenceFiles: preservedEvidence.length,
        publications: publications.length,
        repositories: repositories.length,
        zenodoRecords: zenodoRecords.length,
        patentRecords: patentRecords.length,
      },
      readiness: {
        requiredCompletion,
        overallReadiness,
        qualityScores,
      },
      registryBoundary:
        'This receipt proves generation of an intake package. It is not a public Registry identifier, certification, legal validation, regulatory approval, ownership adjudication, or proof of technical performance.',
      manifest,
    };

    const blob = new Blob([JSON.stringify(receipt, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${form.shortName || form.governanceName || 'governance'}-registry-intake-receipt.json`
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, '-');
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setReceiptGenerated(true);
    setMessage('Registry Intake Receipt generated. This is proof of intake preparation, not proof of public registration.');
  }

  return (
    <main className="registry-wizard-page">
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
            <small>14-step governed registration wizard</small>
          </span>
        </Link>

        <nav aria-label="Registry navigation">
          <Link href="/foundation" className="nav-button">Credentials</Link>
          <Link href="/workspace/ai-governance/registry" className="nav-button">Registry Method</Link>
          <Link href="/workspace/ai-governance/registry/records" className="nav-button">Search Registry</Link>
        </nav>
      </header>

      <section className="hero-shell">
        <div className="eyebrow">GUIDED REGISTRY INTAKE · FOUNDATIONAL RELEASE</div>
        <h1>Register an AI Governance Architecture</h1>
        <p>
          Build a dated, attributable, versioned declaration through fourteen governed steps.
          Every step remains separate so identity, claims, evidence, rights, review, and
          publication boundaries cannot silently collapse into one another.
        </p>

        <div className="boundary-banner">
          <strong>Registration is not certification.</strong>
          <span>
            This wizard prepares and preserves an intake package. A public Registry record
            does not exist until the intake is submitted, reviewed, accepted, assigned an
            identifier, and published by the Registry.
          </span>
        </div>
      </section>

      <section className="wizard-shell">
        <aside className="wizard-sidebar">
          <div className="progress-card">
            <span>Required completion</span>
            <strong>{requiredCompletion}%</strong>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${requiredCompletion}%` }} />
            </div>
            <small>{missingRequired} required item{missingRequired === 1 ? '' : 's'} remain</small>
          </div>

          <div className="step-list" aria-label="Registry wizard steps">
            {wizardSteps.map((step, index) => (
              <button
                type="button"
                key={step.number}
                className={`${index === activeStep ? 'active' : ''} ${
                  stepHasRequiredData(index) ? 'complete' : ''
                }`}
                onClick={() => goToStep(index)}
              >
                <span>{step.number}</span>
                <div>
                  <strong>{step.short}</strong>
                  <small>{step.title}</small>
                </div>
                <b>{stepHasRequiredData(index) ? '✓' : ''}</b>
              </button>
            ))}
          </div>

          <div className="draft-actions">
            <button type="button" onClick={saveDraft} disabled={draftBusy}>
              {draftBusy ? 'Saving…' : draftId ? 'Update Account Draft' : 'Save Account Draft'}
            </button>
            <button type="button" onClick={() => setPreviewOpen((value) => !value)}>
              {previewOpen ? 'Hide Live Preview' : 'Show Live Preview'}
            </button>
            <button type="button" className="danger" onClick={discardDraft} disabled={draftBusy}>
              Discard Draft
            </button>
          </div>
        </aside>

        <div className="wizard-content">
          <div className="step-header">
            <div>
              <span>STEP {wizardSteps[activeStep].number} OF 14</span>
              <h2>{wizardSteps[activeStep].title}</h2>
            </div>
            <div className="step-state">
              {stepHasRequiredData(activeStep) ? 'STEP COMPLETE' : 'IN PROGRESS'}
            </div>
          </div>

          {activeStep === 0 && (
            <section className="step-card">
              <p className="step-intro">
                Identify the governance architecture exactly as it should appear in the Registry.
              </p>
              <div className="field-grid two">
                <label>Governance name <em>Required</em>
                  <input value={form.governanceName} onChange={(e) => updateField('governanceName', e.target.value)} placeholder="Full public governance name" />
                </label>
                <label>Short name or acronym
                  <input value={form.shortName} onChange={(e) => updateField('shortName', e.target.value)} placeholder="Optional" />
                </label>
                <label>Current version <em>Required</em>
                  <input value={form.currentVersion} onChange={(e) => updateField('currentVersion', e.target.value)} />
                </label>
                <label>Effective version date <em>Required</em>
                  <input type="date" value={form.effectiveVersionDate} onChange={(e) => updateField('effectiveVersionDate', e.target.value)} />
                </label>
                <label>Claimed establishment date <em>Required</em>
                  <input type="date" value={form.establishmentDate} onChange={(e) => updateField('establishmentDate', e.target.value)} />
                </label>
                <label>Governance category <em>Required</em>
                  <input value={form.governanceCategory} onChange={(e) => updateField('governanceCategory', e.target.value)} placeholder="AI governance, evidence governance..." />
                </label>
                <label>Record visibility
                  <select value={form.recordVisibility} onChange={(e) => updateField('recordVisibility', e.target.value as Visibility)}>
                    <option value="PUBLIC">Public</option>
                    <option value="CONTROLLED">Controlled access</option>
                    <option value="PRIVATE">Private intake</option>
                  </select>
                </label>
              </div>
            </section>
          )}

          {activeStep === 1 && (
            <section className="step-card">
              <p className="step-intro">
                Separate the claimant from the person submitting the record and preserve the basis of submission authority.
              </p>
              <div className="field-grid two">
                <label>Claimant, founder, or author <em>Required</em>
                  <input value={form.claimantName} onChange={(e) => updateField('claimantName', e.target.value)} />
                </label>
                <label>Claimant type
                  <select value={form.claimantType} onChange={(e) => updateField('claimantType', e.target.value)}>
                    <option>Individual founder or author</option><option>Organization</option><option>Research group</option><option>Standards or governance body</option><option>Joint claimants</option>
                  </select>
                </label>
                <label>Submission authority role <em>Required</em>
                  <select value={form.authorityRole} onChange={(e) => updateField('authorityRole', e.target.value as AuthorityRole)}>
                    {['Founder','Author','Current steward','Organization representative','Legal representative','Authorized submitter','Contributor','Third-party claimant','Other'].map((role) => <option key={role}>{role}</option>)}
                  </select>
                </label>
                <label>Authority evidence or explanation <em>Required</em>
                  <textarea rows={5} value={form.authorityEvidence} onChange={(e) => updateField('authorityEvidence', e.target.value)} placeholder="Appointment, authorization, founding record, public role, or disclosed limitation" />
                </label>
                <label>Contact email <em>Required</em>
                  <input type="email" value={form.contactEmail} onChange={(e) => updateField('contactEmail', e.target.value)} />
                </label>
                <label>Public website
                  <input type="url" value={form.website} onChange={(e) => updateField('website', e.target.value)} placeholder="https://" />
                </label>
              </div>
            </section>
          )}

          {activeStep === 2 && (
            <section className="step-card">
              <p className="step-intro">
                Identify who currently maintains the architecture and how Registry users may contact the steward.
              </p>
              <div className="field-grid two">
                <label>Current steward
                  <input value={form.stewardName} onChange={(e) => updateField('stewardName', e.target.value)} placeholder={form.claimantName || 'Person or entity responsible for the current version'} />
                </label>
                <label>Organization
                  <input value={form.organization} onChange={(e) => updateField('organization', e.target.value)} />
                </label>
                <label>Public contact treatment
                  <select value={form.contactVisibility} onChange={(e) => updateField('contactVisibility', e.target.value as ContactVisibility)}>
                    <option value="REGISTRY_FORM">Registry-managed contact form</option>
                    <option value="WEBSITE_ONLY">Display website only</option>
                    <option value="PUBLIC_EMAIL">Display submitted email publicly</option>
                    <option value="PRIVATE">Keep contact private</option>
                  </select>
                </label>
              </div>
              <div className="permission-grid">
                <label className="check-row"><input type="checkbox" checked={form.allowReviewRequests} onChange={(e) => updateField('allowReviewRequests', e.target.checked)} /><span>Allow governed review requests.</span></label>
                <label className="check-row"><input type="checkbox" checked={form.allowCollaboration} onChange={(e) => updateField('allowCollaboration', e.target.checked)} /><span>Allow collaboration inquiries.</span></label>
                <label className="check-row"><input type="checkbox" checked={form.allowDisputeNotices} onChange={(e) => updateField('allowDisputeNotices', e.target.checked)} /><span>Allow formal dispute notices.</span></label>
              </div>
            </section>
          )}

          {activeStep === 3 && (
            <section className="step-card">
              <p className="step-intro">
                Explain what the architecture is, who it serves, and how it is intended to govern consequence-bearing activity.
              </p>
              <label>Plain-language description <em>Required</em>
                <textarea rows={12} value={form.plainDescription} onChange={(e) => updateField('plainDescription', e.target.value)} placeholder="Explain what the governance architecture is, who it serves, what it governs, and how it is intended to be used." />
              </label>
            </section>
          )}

          {activeStep === 4 && (
            <section className="step-card">
              <p className="step-intro">
                State each affirmative claim separately. Avoid promotional language that cannot be tied to evidence.
              </p>
              <label>Formal claims <em>Required</em>
                <textarea rows={14} value={form.claims} onChange={(e) => updateField('claims', e.target.value)} placeholder="List each affirmative claim on a separate line." />
              </label>
            </section>
          )}

          {activeStep === 5 && (
            <section className="step-card">
              <p className="step-intro">
                Non-claims are first-class Registry content. State what the architecture does not prove, certify, replace, authorize, or guarantee.
              </p>
              <label>Explicit non-claims <em>Required</em>
                <textarea rows={12} value={form.nonClaims} onChange={(e) => updateField('nonClaims', e.target.value)} />
              </label>
              <label>Known limitations, dependencies, and unresolved questions
                <textarea rows={8} value={form.limitations} onChange={(e) => updateField('limitations', e.target.value)} />
              </label>
            </section>
          )}

          {activeStep === 6 && (
            <section className="step-card">
              <p className="step-intro">
                Declare the geographic, jurisdictional, regulatory, and standards context without implying automatic compliance.
              </p>
              <div className="field-grid two">
                <label>Geographic or jurisdictional scope
                  <input value={form.jurisdiction} onChange={(e) => updateField('jurisdiction', e.target.value)} placeholder="Global, United States, European Union..." />
                </label>
                <label>Regulatory or standards scope
                  <input value={form.regulatoryScope} onChange={(e) => updateField('regulatoryScope', e.target.value)} placeholder="EU AI Act, NIST AI RMF, ISO/IEC..." />
                </label>
              </div>
              <div className="boundary-note">
                <strong>Scope is a declaration, not a finding.</strong>
                <p>Listing a regulation or standard does not establish conformity, approval, certification, or legal sufficiency.</p>
              </div>
            </section>
          )}

          {activeStep === 7 && (
            <section className="step-card">
              <p className="step-intro">
                Add, hash, classify, describe, and preserve supporting evidence. Save an account draft before preserving files.
              </p>
              <div
                className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => { if (e.currentTarget === e.target) setDragActive(false); }}
                onDrop={handleDrop}
              >
                <input ref={fileInputRef} type="file" multiple accept={ACCEPTED_EXTENSIONS.map((extension) => `.${extension}`).join(',')} onChange={handleFileChange} className="hidden-file-input" />
                <div className="upload-symbol">⇧</div>
                <h3>Drop evidence files here</h3>
                <p>Each file receives a SHA-256 digest and a declared evidence relationship.</p>
                <button type="button" className="primary-button" onClick={() => fileInputRef.current?.click()}>Choose Evidence Files ＋</button>
                <small>50 MB each · 250 MB package</small>
              </div>

              {files.map((item, index) => (
                <article className="evidence-item" key={item.id}>
                  <div className="file-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="file-body">
                    <div className="file-header">
                      <div><h3>{item.file.name}</h3><p>{bytesToSize(item.file.size)}</p></div>
                      <div className="file-actions">
                        <button type="button" className="primary-button compact-button" disabled={!draftId || evidenceBusyId === item.id} onClick={() => preserveEvidence(item)}>
                          {evidenceBusyId === item.id ? 'Preserving…' : draftId ? 'Preserve Evidence' : 'Save Draft First'}
                        </button>
                        <button type="button" className="remove-button" onClick={() => removeEvidence(item.id)}>Remove</button>
                      </div>
                    </div>
                    <div className="hash-line"><strong>SHA-256</strong><code>{item.sha256}</code></div>
                    <div className="field-grid three">
                      <label>Category<select value={item.category} onChange={(e) => updateEvidence(item.id, { category: e.target.value as EvidenceCategory })}>{evidenceCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
                      <label>Relationship<select value={item.relationship} onChange={(e) => updateEvidence(item.id, { relationship: e.target.value as EvidenceRelationship })}>{evidenceRelationships.map((relationship) => <option key={relationship}>{relationship}</option>)}</select></label>
                      <label>Visibility<select value={item.visibility} onChange={(e) => updateEvidence(item.id, { visibility: e.target.value as Visibility })}><option value="PUBLIC">Public</option><option value="CONTROLLED">Controlled</option><option value="PRIVATE">Private</option></select></label>
                    </div>
                    <label>What this file supports <em>Required</em><textarea rows={4} value={item.description} onChange={(e) => updateEvidence(item.id, { description: e.target.value })} /></label>
                  </div>
                </article>
              ))}

              <div className="preserved-panel">
                <div className="panel-heading"><h3>Preserved account evidence</h3><span>{evidenceListBusy ? 'Loading…' : `${preservedEvidence.length} preserved`}</span></div>
                {!draftId && <p className="empty-state">Save the intake as an account draft before preserving evidence.</p>}
                {draftId && preservedEvidence.length === 0 && !evidenceListBusy && <p className="empty-state">No evidence has been preserved for this draft yet.</p>}
                {preservedEvidence.map((item) => (
                  <article className="preserved-item" key={item.id}>
                    <div><strong>{item.original_filename}</strong><small>{bytesToSize(item.size_bytes)} · {item.evidence_relationship}</small></div>
                    <button type="button" className="remove-button" disabled={evidenceBusyId === item.id} onClick={() => deletePreservedEvidence(item.id)}>{evidenceBusyId === item.id ? 'Deleting…' : 'Delete'}</button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeStep === 8 && (
            <section className="step-card">
              <div className="step-toolbar">
                <p className="step-intro">Add books, articles, papers, reports, standards, presentations, or websites as separate attributable records.</p>
                <button type="button" className="primary-button" onClick={() => setPublications((current) => [...current, createPublication()])}>Add Publication ＋</button>
              </div>
              {publications.length === 0 && <p className="empty-state">No publications added.</p>}
              {publications.map((item, index) => (
                <article className="source-card" key={item.id}>
                  <div className="source-card-title"><strong>Publication {index + 1}</strong><button type="button" className="remove-button" onClick={() => setPublications((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button></div>
                  <div className="field-grid three">
                    <label>Type<select value={item.publicationType} onChange={(e) => updatePublication(item.id, { publicationType: e.target.value })}><option>Article</option><option>Book</option><option>Paper</option><option>Report</option><option>Standard</option><option>Website</option><option>Other</option></select></label>
                    <label>Title<input value={item.title} onChange={(e) => updatePublication(item.id, { title: e.target.value })} /></label>
                    <label>Authors<input value={item.authors} onChange={(e) => updatePublication(item.id, { authors: e.target.value })} /></label>
                    <label>Publisher or platform<input value={item.publisherOrPlatform} onChange={(e) => updatePublication(item.id, { publisherOrPlatform: e.target.value })} /></label>
                    <label>Publication date<input type="date" value={item.publicationDate} onChange={(e) => updatePublication(item.id, { publicationDate: e.target.value })} /></label>
                    <label>Public URL<input type="url" value={item.url} onChange={(e) => updatePublication(item.id, { url: e.target.value })} /></label>
                    <label>DOI<input value={item.doi} onChange={(e) => updatePublication(item.id, { doi: e.target.value })} /></label>
                    <label>ISBN<input value={item.isbn} onChange={(e) => updatePublication(item.id, { isbn: e.target.value })} /></label>
                    <label>Visibility<select value={item.visibility} onChange={(e) => updatePublication(item.id, { visibility: e.target.value as Visibility })}><option value="PUBLIC">Public</option><option value="CONTROLLED">Controlled</option><option value="PRIVATE">Private</option></select></label>
                  </div>
                  <label>Citation text<input value={item.citationText} onChange={(e) => updatePublication(item.id, { citationText: e.target.value })} /></label>
                  <label>Relationship to governance<textarea rows={3} value={item.relationshipToGovernance} onChange={(e) => updatePublication(item.id, { relationshipToGovernance: e.target.value })} /></label>
                </article>
              ))}
            </section>
          )}

          {activeStep === 9 && (
            <section className="step-card">
              <div className="dual-toolbar">
                <button type="button" className="primary-button" onClick={() => setRepositories((current) => [...current, createRepository()])}>Add Repository ＋</button>
                <button type="button" className="secondary-button" onClick={() => setZenodoRecords((current) => [...current, createZenodo()])}>Add Zenodo Record ＋</button>
              </div>
              {repositories.map((item, index) => (
                <article className="source-card" key={item.id}>
                  <div className="source-card-title"><strong>Repository {index + 1}</strong><button type="button" className="remove-button" onClick={() => setRepositories((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button></div>
                  <div className="field-grid three">
                    <label>Provider<select value={item.provider} onChange={(e) => updateRepository(item.id, { provider: e.target.value as RepositoryRecord['provider'] })}><option>GitHub</option><option>GitLab</option><option>Bitbucket</option><option>Codeberg</option><option>Other</option></select></label>
                    <label>Name<input value={item.repositoryName} onChange={(e) => updateRepository(item.id, { repositoryName: e.target.value })} /></label>
                    <label>Owner<input value={item.repositoryOwner} onChange={(e) => updateRepository(item.id, { repositoryOwner: e.target.value })} /></label>
                    <label>URL<input type="url" value={item.repositoryUrl} onChange={(e) => updateRepository(item.id, { repositoryUrl: e.target.value })} /></label>
                    <label>Branch<input value={item.defaultBranch} onChange={(e) => updateRepository(item.id, { defaultBranch: e.target.value })} /></label>
                    <label>Release or tag<input value={item.releaseOrTag} onChange={(e) => updateRepository(item.id, { releaseOrTag: e.target.value })} /></label>
                    <label>Commit SHA<input value={item.commitSha} onChange={(e) => updateRepository(item.id, { commitSha: e.target.value })} /></label>
                    <label>License<input value={item.license} onChange={(e) => updateRepository(item.id, { license: e.target.value })} /></label>
                  </div>
                  <label>Relationship to governance<textarea rows={3} value={item.relationshipToGovernance} onChange={(e) => updateRepository(item.id, { relationshipToGovernance: e.target.value })} /></label>
                </article>
              ))}
              {zenodoRecords.map((item, index) => (
                <article className="source-card zenodo" key={item.id}>
                  <div className="source-card-title"><strong>Zenodo Record {index + 1}</strong><button type="button" className="remove-button" onClick={() => setZenodoRecords((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button></div>
                  <div className="field-grid three">
                    <label>Title<input value={item.title} onChange={(e) => updateZenodo(item.id, { title: e.target.value })} /></label>
                    <label>Record URL<input type="url" value={item.recordUrl} onChange={(e) => updateZenodo(item.id, { recordUrl: e.target.value })} /></label>
                    <label>DOI<input value={item.doi} onChange={(e) => updateZenodo(item.id, { doi: e.target.value })} /></label>
                    <label>Concept DOI<input value={item.conceptDoi} onChange={(e) => updateZenodo(item.id, { conceptDoi: e.target.value })} /></label>
                    <label>Record ID<input value={item.zenodoRecordId} onChange={(e) => updateZenodo(item.id, { zenodoRecordId: e.target.value })} /></label>
                    <label>Version<input value={item.version} onChange={(e) => updateZenodo(item.id, { version: e.target.value })} /></label>
                    <label>Publication date<input type="date" value={item.publicationDate} onChange={(e) => updateZenodo(item.id, { publicationDate: e.target.value })} /></label>
                    <label>Creators<input value={item.creators} onChange={(e) => updateZenodo(item.id, { creators: e.target.value })} /></label>
                  </div>
                  <label>Relationship to governance<textarea rows={3} value={item.relationshipToGovernance} onChange={(e) => updateZenodo(item.id, { relationshipToGovernance: e.target.value })} /></label>
                </article>
              ))}
              {repositories.length === 0 && zenodoRecords.length === 0 && <p className="empty-state">No repositories or Zenodo deposits added.</p>}
            </section>
          )}

          {activeStep === 10 && (
            <section className="step-card">
              <div className="step-toolbar">
                <p className="step-intro">Patent applications, granted patents, ownership declarations, licenses, and disputes remain distinct.</p>
                <button type="button" className="primary-button" onClick={() => setPatentRecords((current) => [...current, createPatent()])}>Add Patent Record ＋</button>
              </div>
              {patentRecords.map((item, index) => (
                <article className="source-card" key={item.id}>
                  <div className="source-card-title"><strong>Patent Record {index + 1}</strong><button type="button" className="remove-button" onClick={() => setPatentRecords((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button></div>
                  <div className="field-grid three">
                    <label>Title<input value={item.title} onChange={(e) => updatePatent(item.id, { title: e.target.value })} /></label>
                    <label>Jurisdiction<input value={item.jurisdiction} onChange={(e) => updatePatent(item.id, { jurisdiction: e.target.value })} /></label>
                    <label>Filing type<select value={item.filingType} onChange={(e) => updatePatent(item.id, { filingType: e.target.value })}><option>Provisional application</option><option>Non-provisional application</option><option>PCT application</option><option>Continuation</option><option>Utility patent</option><option>Other</option></select></label>
                    <label>Status<select value={item.applicationStatus} onChange={(e) => updatePatent(item.id, { applicationStatus: e.target.value })}><option>Filed</option><option>Pending</option><option>Published</option><option>Granted</option><option>Abandoned</option><option>Withdrawn</option></select></label>
                    <label>Application number<input value={item.applicationNumber} onChange={(e) => updatePatent(item.id, { applicationNumber: e.target.value })} /></label>
                    <label>Patent number<input value={item.patentNumber} onChange={(e) => updatePatent(item.id, { patentNumber: e.target.value })} /></label>
                    <label>Filing date<input type="date" value={item.filingDate} onChange={(e) => updatePatent(item.id, { filingDate: e.target.value })} /></label>
                    <label>Inventors<input value={item.inventors} onChange={(e) => updatePatent(item.id, { inventors: e.target.value })} /></label>
                    <label>Official URL<input type="url" value={item.officialUrl} onChange={(e) => updatePatent(item.id, { officialUrl: e.target.value })} /></label>
                  </div>
                  <label>Relationship to governance<textarea rows={3} value={item.relationshipToGovernance} onChange={(e) => updatePatent(item.id, { relationshipToGovernance: e.target.value })} /></label>
                </article>
              ))}
              <div className="field-grid two">
                <label>Ownership and submission-rights declaration <em>Required</em>
                  <textarea rows={8} value={form.ownershipDeclaration} onChange={(e) => updateField('ownershipDeclaration', e.target.value)} />
                </label>
                <label>License or permitted-use statement
                  <textarea rows={8} value={form.license} onChange={(e) => updateField('license', e.target.value)} />
                </label>
              </div>
              <label>Known disputes or competing claims
                <textarea rows={6} value={form.disputes} onChange={(e) => updateField('disputes', e.target.value)} />
              </label>
            </section>
          )}

          {activeStep === 11 && (
            <section className="step-card">
              <p className="step-intro">Select the depth of review being requested. The pathway changes the review scope, not the meaning of registration.</p>
              <label>Requested Registry pathway <em>Required</em>
                <select value={form.reviewPathway} onChange={(e) => updateField('reviewPathway', e.target.value as ReviewPathway)}>
                  <option>Record-only registration</option>
                  <option>Administrative completeness review</option>
                  <option>Identity and authority review</option>
                  <option>Evidence review</option>
                  <option>Independent governance review</option>
                  <option>Partner Review Network review</option>
                  <option>Public dispute resolution pathway</option>
                </select>
              </label>
              <div className="review-cards">
                <article><strong>Record-only</strong><p>Preserves the submitted declaration and supporting record without independent validation.</p></article>
                <article><strong>Administrative</strong><p>Reviews completeness, required fields, identifiers, and internal record consistency.</p></article>
                <article><strong>Independent review</strong><p>May examine identity, authority, evidence, governance boundaries, and declared claims under a separate scope.</p></article>
              </div>
            </section>
          )}

          {activeStep === 12 && (
            <section className="step-card">
              <p className="step-intro">These declarations are required before the intake can be treated as review-ready.</p>
              <div className="declaration-stack">
                <label className="declaration-row"><input type="checkbox" checked={form.authorityConfirmed} onChange={(e) => updateField('authorityConfirmed', e.target.checked)} /><span><strong>Authority to submit</strong>I am authorized to submit this registration and its evidence, or I have clearly disclosed the limits of that authority.</span></label>
                <label className="declaration-row"><input type="checkbox" checked={form.accuracyConfirmed} onChange={(e) => updateField('accuracyConfirmed', e.target.checked)} /><span><strong>Accuracy and attribution</strong>The registration is accurate to the best of my knowledge and material sources, contributors, disputes, and limitations have not been knowingly concealed.</span></label>
                <label className="declaration-row"><input type="checkbox" checked={form.boundaryConfirmed} onChange={(e) => updateField('boundaryConfirmed', e.target.checked)} /><span><strong>Registry boundary</strong>I understand that registration is not certification, legal advice, regulatory approval, ownership adjudication, or proof of technical performance.</span></label>
              </div>
            </section>
          )}

          {activeStep === 13 && (
            <section className="step-card final-step">
              <div className="readiness-hero">
                <span>REGISTRY READINESS</span>
                <strong>{overallReadiness}%</strong>
                <p>Informational quality indicator only. It is not certification, endorsement, or a validity score.</p>
              </div>

              <div className="quality-grid">
                {[
                  ['Identity completeness', qualityScores.identity],
                  ['Attribution completeness', qualityScores.attribution],
                  ['Boundary completeness', qualityScores.boundaries],
                  ['Evidence coverage', qualityScores.evidence],
                  ['Rights & review completeness', qualityScores.rights],
                ].map(([label, value]) => (
                  <article key={String(label)}>
                    <span>{label}</span>
                    <strong>{value}%</strong>
                    <div><i style={{ width: `${value}%` }} /></div>
                  </article>
                ))}
              </div>

              <div className="receipt-panel">
                <h3>Registry Intake Receipt</h3>
                <p>
                  Generate a JSON receipt containing the timestamp, draft identifier, counts,
                  readiness indicators, declarations, manifest, and evidence hashes.
                </p>
                <div className="receipt-actions">
                  <button type="button" className="secondary-button" onClick={downloadManifest}>Download Intake Manifest ↓</button>
                  <button type="button" className="primary-button" onClick={generateReceipt}>Generate Intake Receipt ✓</button>
                </div>
                {receiptGenerated && <span className="receipt-success">Receipt generated successfully.</span>}
              </div>

              <div className="final-boundary">
                <strong>No public Registry record exists yet.</strong>
                <p>
                  This intake is review-ready only. Formal submission, acceptance, identifier assignment,
                  and publication require the connected Registry submission workflow.
                </p>
              </div>
            </section>
          )}

          {(errors.length > 0 || message) && (
            <section className={`notice-panel ${errors.length > 0 ? 'has-errors' : ''}`} aria-live="polite">
              {message && <strong>{message}</strong>}
              {errors.length > 0 && <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
            </section>
          )}

          <div className="wizard-navigation">
            <button type="button" className="secondary-button" disabled={activeStep === 0} onClick={() => goToStep(activeStep - 1)}>← Previous</button>
            <span>{wizardSteps[activeStep].number} / 14</span>
            {activeStep < wizardSteps.length - 1 ? (
              <button type="button" className="primary-button" onClick={() => goToStep(activeStep + 1)}>Save & Continue →</button>
            ) : (
              <button type="button" className="primary-button" onClick={generateReceipt}>Generate Receipt ✓</button>
            )}
          </div>
        </div>

        {previewOpen && (
          <aside className="live-preview">
            <div className="preview-heading">
              <span>LIVE REGISTRY PREVIEW</span>
              <strong>{form.recordVisibility}</strong>
            </div>
            <div className="preview-record">
              <small>REGISTRY IDENTIFIER</small>
              <b>PENDING ASSIGNMENT</b>
              <h2>{form.governanceName || 'Untitled Governance Architecture'}</h2>
              <p>{form.plainDescription || 'The plain-language governance description will appear here.'}</p>

              <div className="preview-meta">
                <div><small>Claimant</small><strong>{form.claimantName || 'Not declared'}</strong></div>
                <div><small>Steward</small><strong>{form.stewardName || form.claimantName || 'Not declared'}</strong></div>
                <div><small>Version</small><strong>{form.currentVersion || 'Not declared'}</strong></div>
                <div><small>Status</small><strong>DRAFT INTAKE</strong></div>
              </div>

              <section>
                <h3>Claims</h3>
                <p>{form.claims || 'No affirmative claims entered yet.'}</p>
              </section>
              <section>
                <h3>Explicit Non-Claims</h3>
                <p>{form.nonClaims || 'No explicit non-claims entered yet.'}</p>
              </section>
              <section>
                <h3>Evidence Summary</h3>
                <ul>
                  <li>{files.length + preservedEvidence.length} evidence file(s)</li>
                  <li>{publications.length} publication(s)</li>
                  <li>{repositories.length} repository record(s)</li>
                  <li>{zenodoRecords.length} Zenodo record(s)</li>
                  <li>{patentRecords.length} patent record(s)</li>
                </ul>
              </section>
              <div className="preview-boundary">
                Preview only · Not registered · Not certified
              </div>
            </div>
          </aside>
        )}
      </section>

      <footer>
        <div>
          <strong>TA-14 AI Governance Registry</strong>
          <span>Identity · Claims · Evidence · Rights · Review · Receipt</span>
        </div>
        <Link href="/workspace/ai-governance/registry" className="nav-button">Return to Registry ←</Link>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(body) { margin: 0; background: #050812; color: #f7f3e8; }
        .registry-wizard-page { position: relative; min-height: 100vh; overflow: hidden; padding: 24px clamp(16px, 3vw, 44px) 56px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: radial-gradient(circle at 50% 0%, rgba(23,72,130,.22), transparent 34%), linear-gradient(180deg,#050812,#09101d 48%,#050711); }
        .cosmos { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
        .stars { position: absolute; inset: -25%; opacity: .42; background-image: radial-gradient(circle,rgba(255,255,255,.72) 0 1px,transparent 1.4px); background-size: 58px 58px; animation: drift 36s linear infinite; }
        .stars-b { opacity: .2; background-size: 97px 97px; animation-duration: 58s; animation-direction: reverse; }
        .orb { position: absolute; border-radius: 50%; filter: blur(3px); opacity: .22; }
        .orb-one { width: 300px; height: 300px; right: -120px; top: 18%; background: radial-gradient(circle at 35% 35%,#8ad7ff,#19316c 52%,transparent 72%); }
        .orb-two { width: 220px; height: 220px; left: -90px; top: 64%; background: radial-gradient(circle at 40% 35%,#f7c471,#7d3f14 48%,transparent 72%); }
        @keyframes drift { to { transform: translate3d(90px,70px,0); } }
        .topbar,.hero-shell,.wizard-shell,footer { position: relative; z-index: 2; max-width: 1540px; margin-inline: auto; }
        .topbar { display:flex; justify-content:space-between; align-items:center; gap:20px; padding:12px 0 28px; }
        .topbar nav { display:flex; gap:9px; flex-wrap:wrap; }
        .brand-button,.nav-button,.primary-button,.secondary-button,.remove-button { text-decoration:none; border:1px solid rgba(219,177,102,.42); color:#fff8e8; background:linear-gradient(180deg,rgba(78,55,25,.62),rgba(29,23,18,.84)); transition:transform .2s ease,border-color .2s ease; }
        .brand-button:hover,.nav-button:hover,.primary-button:hover,.secondary-button:hover,.remove-button:hover { transform:translateY(-2px); border-color:rgba(255,214,139,.9); }
        .brand-button { display:inline-flex; align-items:center; gap:12px; padding:10px 14px; border-radius:14px; }
        .brand-button > span:last-child { display:grid; gap:2px; }
        .brand-button small { color:#c8b998; font-size:10px; letter-spacing:.08em; text-transform:uppercase; }
        .brand-mark { display:grid; place-items:center; min-width:56px; height:42px; border-radius:10px; background:linear-gradient(145deg,#d7a74e,#6e431d); color:#130d07; font-family:Georgia,serif; font-weight:900; }
        .nav-button { display:inline-flex; align-items:center; justify-content:center; padding:10px 14px; border-radius:11px; font-size:12px; font-weight:800; }
        .hero-shell { text-align:center; padding:48px 0 38px; }
        .eyebrow { color:#e8bc68; letter-spacing:.2em; font-size:11px; font-weight:900; }
        h1,h2,h3,p { margin-top:0; }
        h1 { max-width:950px; margin:18px auto; font-family:Georgia,serif; font-size:clamp(44px,7vw,84px); line-height:.98; font-weight:500; }
        .hero-shell > p { max-width:900px; margin:0 auto 24px; color:#c9d1df; font-size:18px; line-height:1.7; }
        .boundary-banner { display:grid; gap:5px; max-width:980px; margin:auto; padding:17px 20px; text-align:left; border:1px solid rgba(231,184,96,.4); border-radius:17px; background:rgba(47,35,20,.56); }
        .boundary-banner strong { color:#ffd98e; }
        .boundary-banner span { color:#d7ceba; line-height:1.55; }
        .wizard-shell { display:grid; grid-template-columns:250px minmax(0,1fr) 330px; gap:18px; align-items:start; }
        .wizard-sidebar,.live-preview { position:sticky; top:18px; display:grid; gap:14px; }
        .progress-card,.step-list,.draft-actions,.step-header,.step-card,.live-preview,.notice-panel,.wizard-navigation { border:1px solid rgba(151,169,199,.2); border-radius:20px; background:linear-gradient(180deg,rgba(15,24,43,.95),rgba(8,13,25,.97)); box-shadow:0 22px 60px rgba(0,0,0,.2); }
        .progress-card { padding:17px; }
        .progress-card > span { color:#9cacc1; font-size:10px; text-transform:uppercase; letter-spacing:.12em; }
        .progress-card > strong { display:block; margin:5px 0 10px; color:#f0c979; font-family:Georgia,serif; font-size:34px; }
        .progress-card small { color:#98a6b9; }
        .progress-track { height:8px; overflow:hidden; border-radius:99px; background:rgba(255,255,255,.08); }
        .progress-fill { height:100%; background:linear-gradient(90deg,#7cb6e8,#e8bc68); }
        .step-list { overflow:hidden; }
        .step-list button { width:100%; display:grid; grid-template-columns:34px 1fr 18px; gap:9px; align-items:center; padding:10px 12px; border:0; border-bottom:1px solid rgba(151,169,199,.1); text-align:left; color:#bec9d8; background:transparent; cursor:pointer; }
        .step-list button:last-child { border-bottom:0; }
        .step-list button:hover,.step-list button.active { background:rgba(232,188,104,.09); }
        .step-list button.active { color:#fff3d5; box-shadow:inset 3px 0 #e8bc68; }
        .step-list button > span { color:#7baed7; font-size:10px; font-weight:900; }
        .step-list button.complete > span,.step-list button.complete > b { color:#83deb3; }
        .step-list button div { display:grid; gap:2px; }
        .step-list button strong { font-size:12px; }
        .step-list button small { color:#7f8ea2; font-size:9px; }
        .draft-actions { display:grid; gap:8px; padding:12px; }
        .draft-actions button { padding:10px; border:1px solid rgba(219,177,102,.3); border-radius:10px; color:#f8edd5; background:rgba(68,48,24,.45); cursor:pointer; font-weight:750; }
        .draft-actions button.danger { color:#ffd9cc; border-color:rgba(226,124,92,.36); background:rgba(92,35,24,.28); }
        .wizard-content { min-width:0; display:grid; gap:14px; }
        .step-header { display:flex; justify-content:space-between; align-items:center; gap:20px; padding:20px 24px; }
        .step-header span { color:#e8bc68; font-size:10px; font-weight:900; letter-spacing:.14em; }
        .step-header h2 { margin:4px 0 0; font-family:Georgia,serif; font-size:34px; font-weight:500; }
        .step-state { padding:8px 10px; border:1px solid rgba(126,190,224,.25); border-radius:999px; color:#9fd7f2; font-size:9px; font-weight:900; letter-spacing:.1em; }
        .step-card { min-height:540px; padding:clamp(22px,4vw,38px); }
        .step-intro { color:#aab7c8; line-height:1.7; }
        .field-grid { display:grid; gap:16px; margin-bottom:18px; }
        .field-grid.two { grid-template-columns:repeat(2,minmax(0,1fr)); }
        .field-grid.three { grid-template-columns:repeat(3,minmax(0,1fr)); }
        label { display:grid; gap:8px; color:#edf2fa; font-size:13px; font-weight:750; }
        label em { color:#eec571; font-size:9px; font-style:normal; text-transform:uppercase; letter-spacing:.1em; }
        input,select,textarea { width:100%; border:1px solid rgba(151,169,199,.28); border-radius:12px; padding:13px 14px; color:#f6f8fc; background:rgba(4,9,18,.82); font:inherit; font-weight:500; outline:none; }
        input:focus,select:focus,textarea:focus { border-color:#e8bc68; box-shadow:0 0 0 3px rgba(232,188,104,.12); }
        textarea { resize:vertical; line-height:1.55; }
        select option { background:#0b1220; }
        .permission-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        .check-row,.declaration-row { display:flex; gap:12px; align-items:flex-start; padding:14px; border:1px solid rgba(151,169,199,.18); border-radius:14px; background:rgba(255,255,255,.025); }
        .check-row input,.declaration-row input { width:18px; height:18px; margin-top:2px; accent-color:#d9aa55; }
        .check-row span,.declaration-row span { color:#cbd4e2; font-weight:500; line-height:1.55; }
        .declaration-row strong { display:block; color:#fff4d9; margin-bottom:4px; }
        .declaration-stack { display:grid; gap:12px; }
        .boundary-note,.final-boundary { padding:18px; border-left:3px solid #d7aa57; border-radius:0 14px 14px 0; background:rgba(216,170,85,.07); }
        .boundary-note strong,.final-boundary strong { color:#f2ce87; }
        .boundary-note p,.final-boundary p { margin:5px 0 0; color:#b9c3d2; line-height:1.55; }
        .drop-zone { display:grid; justify-items:center; gap:10px; padding:46px 20px; text-align:center; border:1px dashed rgba(232,188,104,.55); border-radius:20px; background:radial-gradient(circle at 50% 30%,rgba(69,111,164,.18),transparent 58%),rgba(4,10,20,.6); }
        .drop-zone.drag-active { border-color:#ffd98e; background:rgba(70,55,29,.42); }
        .drop-zone h3 { margin:0; font-family:Georgia,serif; font-size:28px; }
        .drop-zone p { margin:0; color:#aebbd0; }
        .upload-symbol { display:grid; place-items:center; width:58px; height:58px; border:1px solid rgba(232,188,104,.5); border-radius:16px; color:#ffd98e; font-size:28px; }
        .hidden-file-input { display:none; }
        .primary-button,.secondary-button,.remove-button { display:inline-flex; align-items:center; justify-content:center; gap:10px; border-radius:12px; padding:12px 16px; cursor:pointer; font-weight:850; }
        .primary-button { background:linear-gradient(180deg,#d7ab59,#87521f); color:#160e07; border-color:#f0ce85; }
        .secondary-button { background:linear-gradient(180deg,rgba(47,73,108,.94),rgba(22,34,55,.96)); border-color:rgba(130,178,225,.55); }
        .remove-button { padding:8px 11px; color:#ffd8ca; border-color:rgba(226,124,92,.42); background:rgba(94,34,23,.28); }
        button:disabled { opacity:.48; cursor:not-allowed; transform:none !important; }
        .evidence-item,.source-card { display:grid; gap:14px; margin-top:16px; padding:18px; border:1px solid rgba(151,169,199,.22); border-radius:17px; background:rgba(255,255,255,.025); }
        .evidence-item { grid-template-columns:44px 1fr; }
        .file-index { display:grid; place-items:center; height:44px; border-radius:12px; background:rgba(129,164,207,.12); color:#a9d6ff; font-family:Georgia,serif; font-weight:800; }
        .file-header,.source-card-title,.step-toolbar,.dual-toolbar,.panel-heading { display:flex; justify-content:space-between; gap:14px; align-items:flex-start; }
        .file-header h3 { margin-bottom:4px; font-size:16px; overflow-wrap:anywhere; }
        .file-header p { margin:0; color:#8f9db1; font-size:12px; }
        .file-actions { display:flex; flex-wrap:wrap; gap:8px; }
        .compact-button { padding:8px 11px; font-size:11px; }
        .hash-line { display:grid; gap:5px; padding:10px 12px; border-radius:10px; background:rgba(0,0,0,.24); }
        .hash-line strong { color:#e9c474; font-size:10px; letter-spacing:.12em; }
        .hash-line code { overflow-wrap:anywhere; color:#adc6df; font-size:10px; }
        .preserved-panel { display:grid; gap:10px; margin-top:20px; padding:17px; border:1px solid rgba(104,190,150,.28); border-radius:17px; background:rgba(20,72,51,.11); }
        .panel-heading h3 { margin:0; font-family:Georgia,serif; font-size:21px; }
        .panel-heading span { color:#b8f2d6; font-size:11px; }
        .preserved-item { display:flex; justify-content:space-between; gap:14px; align-items:center; padding:13px; border:1px solid rgba(104,190,150,.2); border-radius:13px; background:rgba(5,18,15,.45); }
        .preserved-item div { display:grid; gap:4px; }
        .preserved-item small { color:#8fa99b; }
        .empty-state { padding:17px; border:1px dashed rgba(151,169,199,.22); border-radius:13px; color:#98a8bd; background:rgba(255,255,255,.02); }
        .source-card-title strong { color:#f1ce89; font-family:Georgia,serif; font-size:18px; }
        .source-card.zenodo { border-color:rgba(126,178,225,.24); }
        .dual-toolbar { justify-content:flex-start; margin-bottom:12px; }
        .review-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:22px; }
        .review-cards article { padding:18px; border:1px solid rgba(151,169,199,.18); border-radius:14px; background:rgba(255,255,255,.025); }
        .review-cards strong { color:#f2ce87; font-family:Georgia,serif; font-size:19px; }
        .review-cards p { margin:8px 0 0; color:#9daabc; line-height:1.55; font-size:12px; }
        .readiness-hero { text-align:center; padding:24px; border:1px solid rgba(232,188,104,.28); border-radius:18px; background:rgba(71,48,20,.25); }
        .readiness-hero > span { color:#e8bc68; font-size:10px; letter-spacing:.14em; font-weight:900; }
        .readiness-hero > strong { display:block; margin:8px 0; font-family:Georgia,serif; font-size:64px; color:#fff0c8; }
        .readiness-hero p { margin:0; color:#aeb8c8; }
        .quality-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; margin:18px 0; }
        .quality-grid article { padding:14px; border:1px solid rgba(151,169,199,.17); border-radius:13px; background:rgba(255,255,255,.025); }
        .quality-grid span { color:#94a3b7; font-size:10px; }
        .quality-grid strong { display:block; margin:5px 0 9px; color:#f1ce89; }
        .quality-grid article > div { height:5px; overflow:hidden; border-radius:99px; background:rgba(255,255,255,.08); }
        .quality-grid i { display:block; height:100%; background:linear-gradient(90deg,#7cb6e8,#e8bc68); }
        .receipt-panel { padding:22px; border:1px solid rgba(126,178,225,.28); border-radius:17px; background:rgba(24,64,100,.18); }
        .receipt-panel h3 { margin-bottom:7px; font-family:Georgia,serif; font-size:25px; }
        .receipt-panel p { color:#aeb9ca; line-height:1.6; }
        .receipt-actions { display:flex; flex-wrap:wrap; gap:10px; }
        .receipt-success { display:block; margin-top:12px; color:#9be2bc; font-weight:800; }
        .final-boundary { margin-top:18px; }
        .notice-panel { padding:16px 20px; color:#d9ecff; background:rgba(24,64,100,.34); }
        .notice-panel.has-errors { border-color:rgba(230,128,93,.55); color:#ffe1d4; background:rgba(92,35,24,.34); }
        .notice-panel ul { margin:10px 0 0; padding-left:20px; line-height:1.7; }
        .wizard-navigation { display:flex; justify-content:space-between; align-items:center; gap:14px; padding:14px; }
        .wizard-navigation > span { color:#8998ab; font-size:11px; font-weight:900; letter-spacing:.1em; }
        .live-preview { padding:16px; }
        .preview-heading { display:flex; justify-content:space-between; gap:10px; color:#e8bc68; font-size:9px; font-weight:900; letter-spacing:.1em; }
        .preview-heading strong { color:#9fd7f2; }
        .preview-record { display:grid; gap:14px; padding:18px; border:1px solid rgba(151,169,199,.15); border-radius:16px; background:rgba(4,9,18,.62); }
        .preview-record > small { color:#7f90a5; font-size:8px; letter-spacing:.12em; }
        .preview-record > b { color:#e8bc68; font-size:10px; }
        .preview-record > h2 { margin:0; font-family:Georgia,serif; font-size:27px; font-weight:500; line-height:1.05; }
        .preview-record > p,.preview-record section p { margin:0; color:#9facc0; line-height:1.55; white-space:pre-line; font-size:12px; }
        .preview-meta { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .preview-meta div { padding:10px; border:1px solid rgba(151,169,199,.12); border-radius:10px; background:rgba(255,255,255,.02); }
        .preview-meta small { display:block; color:#75879d; font-size:8px; text-transform:uppercase; }
        .preview-meta strong { display:block; margin-top:4px; font-size:11px; }
        .preview-record section { padding-top:12px; border-top:1px solid rgba(151,169,199,.12); }
        .preview-record section h3 { margin-bottom:7px; font-family:Georgia,serif; font-size:17px; font-weight:500; color:#f1ce89; }
        .preview-record ul { margin:0; padding-left:18px; color:#9facc0; font-size:11px; line-height:1.7; }
        .preview-boundary { padding:10px; border-radius:10px; color:#ffd9cc; background:rgba(92,35,24,.26); font-size:9px; font-weight:900; text-align:center; letter-spacing:.06em; }
        footer { display:flex; justify-content:space-between; align-items:center; gap:20px; padding-top:34px; }
        footer > div { display:grid; gap:4px; }
        footer span { color:#8996a9; font-size:12px; }
        @media (max-width:1250px) { .wizard-shell { grid-template-columns:230px minmax(0,1fr); } .live-preview { position:relative; grid-column:1 / -1; top:auto; } .preview-record { grid-template-columns:1fr; } }
        @media (max-width:900px) { .wizard-shell { grid-template-columns:1fr; } .wizard-sidebar { position:relative; top:auto; } .step-list { display:grid; grid-template-columns:repeat(2,1fr); } .step-list button { border-right:1px solid rgba(151,169,199,.1); } .field-grid.three,.quality-grid { grid-template-columns:repeat(2,1fr); } .review-cards { grid-template-columns:1fr; } }
        @media (max-width:680px) { .registry-wizard-page { padding-inline:12px; } .topbar,footer { flex-direction:column; align-items:stretch; } .topbar nav { justify-content:stretch; } .topbar nav .nav-button { flex:1; } .field-grid.two,.field-grid.three,.permission-grid,.quality-grid,.step-list { grid-template-columns:1fr; } .step-header,.wizard-navigation,.file-header,.source-card-title,.step-toolbar,.dual-toolbar,.panel-heading,.preserved-item { flex-direction:column; align-items:stretch; } .evidence-item { grid-template-columns:1fr; } .file-actions,.receipt-actions { display:grid; } .file-actions button,.receipt-actions button { width:100%; } .preview-meta { grid-template-columns:1fr; } }
        @media (prefers-reduced-motion:reduce) { .stars { animation:none; } * { scroll-behavior:auto !important; transition:none !important; } }
      `}</style>
    </main>
  );
}
