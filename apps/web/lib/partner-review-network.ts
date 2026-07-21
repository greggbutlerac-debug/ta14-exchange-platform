import type { SupabaseClient } from '@supabase/supabase-js';

export const PARTNER_REVIEW_BUCKET = 'partner-review-network-private';
export const PARTNER_REVIEW_PRICE_CENTS = 45_000;
export const PARTNER_REVIEW_MAX_FILES = 12;
export const PARTNER_REVIEW_MAX_FILE_BYTES = 25 * 1024 * 1024;

export const PARTNER_REVIEW_ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/json',
  'application/zip',
  'application/x-zip-compressed',
]);

export type PartnerReviewApplicationStatus =
  | 'draft'
  | 'ready_for_payment'
  | 'payment_pending'
  | 'submitted'
  | 'under_review'
  | 'correction_requested'
  | 'determined'
  | 'withdrawn';

export type PartnerReviewPaymentStatus =
  | 'not_started'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'waived';

export type PartnerReviewOutcome =
  | 'qualified'
  | 'qualified_with_conditions'
  | 'deferred'
  | 'not_qualified';

export interface PartnerReviewApplication {
  id: string;
  applicant_user_id: string;
  application_number: string;
  status: PartnerReviewApplicationStatus;
  qualification_outcome: PartnerReviewOutcome | null;
  payment_status: PartnerReviewPaymentStatus;
  payment_amount_cents: number;
  payment_currency: string;

  organization_name: string | null;
  organization_website: string | null;
  contact_name: string | null;
  contact_role: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  jurisdiction: string | null;
  years_operating: number | null;

  primary_review_domain: string | null;
  secondary_review_domains: string[];
  governance_summary: string | null;
  desired_review_lane: string | null;
  representative_work: string | null;

  governance_method: string | null;
  evidence_qualification_method: string | null;
  uncertainty_handling: string | null;
  escalation_practice: string | null;

  reviewer_authority_boundary: string | null;
  conflict_disclosures: string | null;
  additional_context: string | null;

  acknowledgement_accuracy: boolean;
  acknowledgement_adverse_outcome: boolean;
  acknowledgement_payment_not_acceptance: boolean;
  acknowledgement_bounded_authority: boolean;

  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerReviewAttachment {
  id: string;
  application_id: string;
  applicant_user_id: string;
  storage_bucket: string;
  storage_path: string;
  original_filename: string;
  mime_type: string | null;
  size_bytes: number;
  upload_status: 'pending' | 'uploaded' | 'verified' | 'rejected' | 'removed';
  rejection_reason: string | null;
  uploaded_at: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export type PartnerReviewDraftInput = Partial<
  Pick<
    PartnerReviewApplication,
    | 'organization_name'
    | 'organization_website'
    | 'contact_name'
    | 'contact_role'
    | 'contact_email'
    | 'contact_phone'
    | 'jurisdiction'
    | 'years_operating'
    | 'primary_review_domain'
    | 'secondary_review_domains'
    | 'governance_summary'
    | 'desired_review_lane'
    | 'representative_work'
    | 'governance_method'
    | 'evidence_qualification_method'
    | 'uncertainty_handling'
    | 'escalation_practice'
    | 'reviewer_authority_boundary'
    | 'conflict_disclosures'
    | 'additional_context'
    | 'acknowledgement_accuracy'
    | 'acknowledgement_adverse_outcome'
    | 'acknowledgement_payment_not_acceptance'
    | 'acknowledgement_bounded_authority'
  >
>;

export interface PartnerReviewReadiness {
  ready: boolean;
  missing: string[];
}

function requireValue(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function evaluatePartnerReviewReadiness(
  application: Pick<
    PartnerReviewApplication,
    | 'organization_name'
    | 'contact_name'
    | 'contact_email'
    | 'primary_review_domain'
    | 'governance_method'
    | 'evidence_qualification_method'
    | 'reviewer_authority_boundary'
    | 'acknowledgement_accuracy'
    | 'acknowledgement_adverse_outcome'
    | 'acknowledgement_payment_not_acceptance'
    | 'acknowledgement_bounded_authority'
  >,
): PartnerReviewReadiness {
  const missing: string[] = [];

  if (!requireValue(application.organization_name)) {
    missing.push('Organization name');
  }

  if (!requireValue(application.contact_name)) {
    missing.push('Contact name');
  }

  if (!requireValue(application.contact_email)) {
    missing.push('Contact email');
  }

  if (!requireValue(application.primary_review_domain)) {
    missing.push('Primary review domain');
  }

  if (!requireValue(application.governance_method)) {
    missing.push('Governance method');
  }

  if (!requireValue(application.evidence_qualification_method)) {
    missing.push('Evidence qualification method');
  }

  if (!requireValue(application.reviewer_authority_boundary)) {
    missing.push('Reviewer authority boundary');
  }

  if (!application.acknowledgement_accuracy) {
    missing.push('Accuracy acknowledgement');
  }

  if (!application.acknowledgement_adverse_outcome) {
    missing.push('Adverse-outcome acknowledgement');
  }

  if (!application.acknowledgement_payment_not_acceptance) {
    missing.push('Payment-is-not-acceptance acknowledgement');
  }

  if (!application.acknowledgement_bounded_authority) {
    missing.push('Bounded-authority acknowledgement');
  }

  return {
    ready: missing.length === 0,
    missing,
  };
}

export function validatePartnerReviewFiles(files: File[]): string[] {
  const errors: string[] = [];

  if (files.length > PARTNER_REVIEW_MAX_FILES) {
    errors.push(
      `A maximum of ${PARTNER_REVIEW_MAX_FILES} supporting files may be uploaded.`,
    );
  }

  for (const file of files) {
    if (file.size > PARTNER_REVIEW_MAX_FILE_BYTES) {
      errors.push(`${file.name} exceeds the 25 MB file limit.`);
    }

    if (
      file.type &&
      !PARTNER_REVIEW_ALLOWED_MIME_TYPES.has(file.type.toLowerCase())
    ) {
      errors.push(`${file.name} is not an accepted supporting-file type.`);
    }
  }

  return errors;
}

function sanitizeFilename(filename: string): string {
  const normalized = filename
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || 'supporting-material';
}

function buildStoragePath(
  userId: string,
  applicationId: string,
  filename: string,
): string {
  const uniquePrefix =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${userId}/${applicationId}/${uniquePrefix}-${sanitizeFilename(filename)}`;
}

async function getAuthenticatedUserId(
  supabase: SupabaseClient,
): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error('You must be signed in to manage a partner review application.');
  }

  return user.id;
}

export async function createPartnerReviewApplication(
  supabase: SupabaseClient,
  initialValues: PartnerReviewDraftInput = {},
): Promise<PartnerReviewApplication> {
  const userId = await getAuthenticatedUserId(supabase);

  const { data, error } = await supabase
    .from('partner_review_network_applications')
    .insert({
      applicant_user_id: userId,
      status: 'draft',
      payment_status: 'not_started',
      payment_amount_cents: PARTNER_REVIEW_PRICE_CENTS,
      payment_currency: 'usd',
      ...initialValues,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PartnerReviewApplication;
}

export async function loadPartnerReviewApplication(
  supabase: SupabaseClient,
  applicationId: string,
): Promise<PartnerReviewApplication> {
  const { data, error } = await supabase
    .from('partner_review_network_applications')
    .select('*')
    .eq('id', applicationId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PartnerReviewApplication;
}

export async function savePartnerReviewDraft(
  supabase: SupabaseClient,
  applicationId: string,
  values: PartnerReviewDraftInput,
): Promise<PartnerReviewApplication> {
  const { data, error } = await supabase
    .from('partner_review_network_applications')
    .update(values)
    .eq('id', applicationId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PartnerReviewApplication;
}

export async function listPartnerReviewAttachments(
  supabase: SupabaseClient,
  applicationId: string,
): Promise<PartnerReviewAttachment[]> {
  const { data, error } = await supabase
    .from('partner_review_network_attachments')
    .select('*')
    .eq('application_id', applicationId)
    .neq('upload_status', 'removed')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PartnerReviewAttachment[];
}

export async function uploadPartnerReviewFile(
  supabase: SupabaseClient,
  applicationId: string,
  file: File,
): Promise<PartnerReviewAttachment> {
  const validationErrors = validatePartnerReviewFiles([file]);

  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(' '));
  }

  const userId = await getAuthenticatedUserId(supabase);
  const storagePath = buildStoragePath(userId, applicationId, file.name);

  const { error: storageError } = await supabase.storage
    .from(PARTNER_REVIEW_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      contentType: file.type || undefined,
      upsert: false,
    });

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { data, error: metadataError } = await supabase
    .from('partner_review_network_attachments')
    .insert({
      application_id: applicationId,
      applicant_user_id: userId,
      storage_bucket: PARTNER_REVIEW_BUCKET,
      storage_path: storagePath,
      original_filename: file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
      upload_status: 'uploaded',
      uploaded_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (metadataError) {
    await supabase.storage.from(PARTNER_REVIEW_BUCKET).remove([storagePath]);
    throw new Error(metadataError.message);
  }

  return data as PartnerReviewAttachment;
}

export async function removePartnerReviewFile(
  supabase: SupabaseClient,
  attachment: Pick<
    PartnerReviewAttachment,
    'id' | 'storage_bucket' | 'storage_path'
  >,
): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from(attachment.storage_bucket)
    .remove([attachment.storage_path]);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { error: metadataError } = await supabase
    .from('partner_review_network_attachments')
    .delete()
    .eq('id', attachment.id);

  if (metadataError) {
    throw new Error(metadataError.message);
  }
}

export async function markPartnerReviewReadyForPayment(
  supabase: SupabaseClient,
  application: PartnerReviewApplication,
): Promise<PartnerReviewApplication> {
  const readiness = evaluatePartnerReviewReadiness(application);

  if (!readiness.ready) {
    throw new Error(
      `The application is not ready for payment. Missing: ${readiness.missing.join(
        ', ',
      )}.`,
    );
  }

  const { data, error } = await supabase
    .from('partner_review_network_applications')
    .update({
      status: 'ready_for_payment',
      payment_status: 'not_started',
    })
    .eq('id', application.id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PartnerReviewApplication;
}

export async function withdrawPartnerReviewApplication(
  supabase: SupabaseClient,
  applicationId: string,
): Promise<PartnerReviewApplication> {
  const { data, error } = await supabase
    .from('partner_review_network_applications')
    .update({
      status: 'withdrawn',
      withdrawn_at: new Date().toISOString(),
    })
    .eq('id', applicationId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PartnerReviewApplication;
}
