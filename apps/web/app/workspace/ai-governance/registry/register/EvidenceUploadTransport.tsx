'use client';

import { useEffect } from 'react';
import { createClient } from '../../../../../lib/supabase/client';

const EVIDENCE_ROUTE = '/api/ai-governance/registry/evidence';

function jsonResponse(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function isEvidencePost(input: RequestInfo | URL, init?: RequestInit): boolean {
  const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
  const url = requestUrl(input);
  return method === 'POST' && url.includes(EVIDENCE_ROUTE);
}

export default function EvidenceUploadTransport() {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    const governedFetch: typeof window.fetch = async (input, init) => {
      if (!isEvidencePost(input, init) || !(init?.body instanceof FormData)) {
        return originalFetch(input, init);
      }

      const formData = init.body;
      const fileValue = formData.get('file');
      if (!(fileValue instanceof File)) {
        return jsonResponse({ error: 'An evidence file is required.' }, 400);
      }

      const submissionId = String(formData.get('submissionId') ?? '').trim();
      const evidenceRelationship = String(formData.get('evidenceRelationship') ?? '').trim();
      const evidenceClassification = String(formData.get('evidenceClassification') ?? '').trim();
      const description = String(formData.get('description') ?? '').trim();
      const visibility = String(formData.get('visibility') ?? 'private').trim();
      const provenanceStatus = String(formData.get('provenanceStatus') ?? '').trim();

      try {
        const digest = await crypto.subtle.digest('SHA-256', await fileValue.arrayBuffer());
        const sha256Hex = Array.from(new Uint8Array(digest))
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('');

        const authorizeResponse = await originalFetch(EVIDENCE_ROUTE, {
          method: 'POST',
          credentials: 'same-origin',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            action: 'authorize_direct_upload',
            submissionId,
            originalFilename: fileValue.name,
            mimeType: fileValue.type || 'application/octet-stream',
            sizeBytes: fileValue.size,
            sha256Hex,
            evidenceRelationship,
            evidenceClassification,
            description,
            visibility,
            provenanceStatus,
          }),
        });
        const authorization = await authorizeResponse.json();
        if (!authorizeResponse.ok) {
          return jsonResponse(
            { error: authorization.error ?? 'Unable to authorize evidence upload.' },
            authorizeResponse.status,
          );
        }

        const supabase = createClient();
        const { error: uploadError } = await supabase.storage
          .from(authorization.bucket)
          .uploadToSignedUrl(
            authorization.storagePath,
            authorization.uploadToken,
            fileValue,
            {
              contentType: fileValue.type || 'application/octet-stream',
              upsert: false,
            },
          );

        if (uploadError) {
          await originalFetch(EVIDENCE_ROUTE, {
            method: 'POST',
            credentials: 'same-origin',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              action: 'abort_direct_upload',
              evidenceId: authorization.evidenceId,
            }),
          }).catch(() => undefined);

          return jsonResponse({ error: `Evidence upload failed: ${uploadError.message}` }, 502);
        }

        const confirmResponse = await originalFetch(EVIDENCE_ROUTE, {
          method: 'POST',
          credentials: 'same-origin',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            action: 'confirm_direct_upload',
            evidenceId: authorization.evidenceId,
          }),
        });
        const confirmation = await confirmResponse.json();
        return jsonResponse(confirmation, confirmResponse.status);
      } catch (error) {
        return jsonResponse(
          {
            error:
              error instanceof Error
                ? error.message
                : 'Unable to preserve Registry evidence.',
          },
          500,
        );
      }
    };

    window.fetch = governedFetch;

    return () => {
      if (window.fetch === governedFetch) window.fetch = originalFetch;
    };
  }, []);

  return null;
}
