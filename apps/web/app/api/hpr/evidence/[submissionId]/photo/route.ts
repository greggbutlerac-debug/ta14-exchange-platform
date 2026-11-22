/**
 * PUT /api/hpr/evidence/{submissionId}/photo
 *
 * Uploads the original photograph for one HPR PHOTO submission. Body: the raw
 * image bytes. Headers: Content-Type (image/jpeg|png|heic|webp) and
 * X-HPR-Upload-Nonce (a fresh UUID per request).
 *
 * Disabled unless HPR_PHOTO_UPLOAD_ENABLED=true (default off; not enabled in
 * any deployment by this change). Identity comes from the Supabase cookie
 * session verified with Supabase Auth (auth.getUser()); any technicianId,
 * object path, content type or digest the client sends is not trusted.
 *
 * The result is an UNRECONCILED declaration. Not verification, not
 * admission, no DDD, no intervention authority.
 */
import type {NextRequest} from 'next/server';

import {authenticateFromCookies} from '@/lib/hvac-performance-record/photo-upload/cookie-session';
import {createHprServiceClient, servicePort} from '@/lib/hvac-performance-record/photo-upload/supabase-ports';
import {handlePhotoUpload, type ServicePort} from '@/lib/hvac-performance-record/photo-upload/upload-handler';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  context: {params: Promise<{submissionId: string}>},
): Promise<Response> {
  const {submissionId} = await context.params;
  let service: ServicePort | undefined;
  return handlePhotoUpload(request, submissionId, {
    enabled: process.env.HPR_PHOTO_UPLOAD_ENABLED === 'true',
    authenticate: () => authenticateFromCookies(request.cookies),
    // Created lazily: a disabled or unauthenticated request never loads the service credential.
    get service() {
      return (service ??= servicePort(createHprServiceClient()));
    },
    log: (event, detail) => console.warn(`[hpr] ${event}`, detail),
  });
}
