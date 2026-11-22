import {createHash} from 'node:crypto';

export class HprBodyError extends Error {
  constructor(readonly reason: 'HPR_PAYLOAD_TOO_LARGE' | 'HPR_PAYLOAD_EMPTY' | 'HPR_PARTIAL_UPLOAD' | 'HPR_BODY_READ_FAILED') {
    super(reason);
  }
}

export type DigestedBody = {bytes: Uint8Array; sha256: string; byteSize: number};

/**
 * Reads a request body while computing SHA-256 over the exact bytes received.
 * Stops (and cancels the stream) as soon as more than `maxBytes` arrive, so an
 * oversized body is never buffered in full. If the client declared a
 * Content-Length, the received byte count must equal it (a short body is a
 * partial upload). A stream error or client abort is a partial upload too.
 */
export async function readBodyWithDigest(
  body: ReadableStream<Uint8Array> | null,
  maxBytes: number,
  declaredLength: number | null,
): Promise<DigestedBody> {
  if (!body) throw new HprBodyError('HPR_PAYLOAD_EMPTY');
  const hash = createHash('sha256');
  const chunks: Uint8Array[] = [];
  let received = 0;
  const reader = body.getReader();
  try {
    for (;;) {
      let next: ReadableStreamReadResult<Uint8Array>;
      try {
        next = await reader.read();
      } catch {
        throw new HprBodyError('HPR_PARTIAL_UPLOAD');
      }
      if (next.done) break;
      const chunk = next.value;
      received += chunk.byteLength;
      if (received > maxBytes) {
        await reader.cancel().catch(() => undefined);
        throw new HprBodyError('HPR_PAYLOAD_TOO_LARGE');
      }
      hash.update(chunk);
      chunks.push(chunk);
    }
  } finally {
    reader.releaseLock();
  }
  if (received === 0) throw new HprBodyError('HPR_PAYLOAD_EMPTY');
  if (declaredLength !== null && declaredLength !== received) throw new HprBodyError('HPR_PARTIAL_UPLOAD');

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.byteLength;
  }
  return {bytes, sha256: hash.digest('hex'), byteSize: received};
}

/** SHA-256 and byte count of a stream, for reconciliation re-reads. */
export async function digestStream(stream: ReadableStream<Uint8Array>): Promise<{sha256: string; byteSize: number}> {
  const hash = createHash('sha256');
  let size = 0;
  const reader = stream.getReader();
  for (;;) {
    const {done, value} = await reader.read();
    if (done) break;
    size += value.byteLength;
    hash.update(value);
  }
  return {sha256: hash.digest('hex'), byteSize: size};
}
