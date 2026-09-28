/**
 * RFC 3161 HTTP transport (application/timestamp-query -> application/timestamp-reply). Sends only the
 * DER TimeStampReq (a SHA-256 checkpoint digest, a nonce and certReq); never evidence.
 */
import type { TsaTransport } from "../../../../../packages/domain/eie/witness/checkpoint";

const MAX_REPLY_BYTES = 64 * 1024;
const TIMEOUT_MS = 15_000;

export function httpTsaTransport(url: string, fetchImpl: typeof fetch = fetch): TsaTransport {
  if (!/^https:\/\//.test(url)) throw new Error("TSA URL must use HTTPS");
  return {
    url,
    async request(queryDer: Uint8Array): Promise<Uint8Array> {
      const response = await fetchImpl(url, {
        method: "POST",
        headers: { "Content-Type": "application/timestamp-query", Accept: "application/timestamp-reply" },
        body: Buffer.from(queryDer),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!response.ok) throw new Error(`TSA_HTTP_${response.status}`);
      if (!(response.headers.get("content-type") ?? "").startsWith("application/timestamp-reply")) throw new Error("TSA_CONTENT_TYPE");
      const body = new Uint8Array(await response.arrayBuffer());
      if (body.byteLength === 0 || body.byteLength > MAX_REPLY_BYTES) throw new Error("TSA_REPLY_SIZE");
      return body;
    },
  };
}
