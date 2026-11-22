/**
 * Content-signature checks for HPR photograph originals.
 *
 * The client's Content-Type header is a claim. These checks read the actual
 * bytes: the leading signature must identify the same image type the client
 * declared, and for formats with a reliable trailer / length field the file
 * must be structurally complete (detects truncated or partial uploads).
 *
 * This is format plausibility, not image validation: it does not decode the
 * image and does not establish what the photograph shows.
 */

export const HPR_PHOTO_MAX_BYTES = 25 * 1024 * 1024; // 26214400, equals the bucket + #704 CHECK limit

export const HPR_PHOTO_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'] as const;
export type HprPhotoContentType = (typeof HPR_PHOTO_CONTENT_TYPES)[number];

export function isHprPhotoContentType(value: string): value is HprPhotoContentType {
  return (HPR_PHOTO_CONTENT_TYPES as readonly string[]).includes(value);
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const PNG_IEND_TRAILER = [0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82];
// ISO-BMFF major/compatible brands used by HEIC/HEIF stills.
const HEIF_BRANDS = new Set(['heic', 'heix', 'heim', 'heis', 'hevc', 'hevx', 'mif1', 'msf1']);

function startsWith(bytes: Uint8Array, sig: number[], offset = 0): boolean {
  if (bytes.length < offset + sig.length) return false;
  return sig.every((b, i) => bytes[offset + i] === b);
}

function ascii(bytes: Uint8Array, start: number, end: number): string {
  return String.fromCharCode(...bytes.subarray(start, end));
}

/** Identifies the image type from the leading bytes, or null. */
export function sniffImageType(bytes: Uint8Array): HprPhotoContentType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (startsWith(bytes, PNG_SIGNATURE)) return 'image/png';
  if (bytes.length >= 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') return 'image/webp';
  if (bytes.length >= 12 && ascii(bytes, 4, 8) === 'ftyp') {
    const boxSize = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(0);
    if (boxSize < 16 || boxSize > bytes.length || boxSize > 4096) return null;
    const brands = [ascii(bytes, 8, 12)];
    for (let o = 16; o + 4 <= boxSize; o += 4) brands.push(ascii(bytes, o, o + 4));
    if (brands.some(b => HEIF_BRANDS.has(b))) return 'image/heic';
  }
  return null;
}

export type SignatureFinding =
  | {ok: true; contentType: HprPhotoContentType}
  | {ok: false; reason: 'HPR_CONTENT_SIGNATURE_UNRECOGNIZED' | 'HPR_CONTENT_SIGNATURE_MISMATCH' | 'HPR_CONTENT_TRUNCATED'};

/**
 * Requires that the bytes are a structurally complete image of exactly the
 * declared type. Fails closed on anything unrecognized.
 */
export function checkContentSignature(bytes: Uint8Array, declared: HprPhotoContentType): SignatureFinding {
  const sniffed = sniffImageType(bytes);
  if (!sniffed) return {ok: false, reason: 'HPR_CONTENT_SIGNATURE_UNRECOGNIZED'};
  if (sniffed !== declared) return {ok: false, reason: 'HPR_CONTENT_SIGNATURE_MISMATCH'};

  switch (sniffed) {
    case 'image/jpeg':
      // End-of-image marker must terminate the file.
      if (bytes.length < 4 || bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
        return {ok: false, reason: 'HPR_CONTENT_TRUNCATED'};
      }
      break;
    case 'image/png':
      // IEND chunk (type + CRC) must terminate the file.
      if (bytes.length < PNG_SIGNATURE.length + 12 || !startsWith(bytes, PNG_IEND_TRAILER, bytes.length - 8)) {
        return {ok: false, reason: 'HPR_CONTENT_TRUNCATED'};
      }
      break;
    case 'image/webp': {
      // RIFF length field covers everything after the first 8 bytes.
      const riffSize = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(4, true);
      if (riffSize + 8 !== bytes.length) return {ok: false, reason: 'HPR_CONTENT_TRUNCATED'};
      break;
    }
    case 'image/heic': {
      // Walk top-level ISO-BMFF boxes; they must tile the file exactly.
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      let offset = 0;
      while (offset < bytes.length) {
        if (offset + 8 > bytes.length) return {ok: false, reason: 'HPR_CONTENT_TRUNCATED'};
        let size = view.getUint32(offset);
        if (size === 1) {
          if (offset + 16 > bytes.length) return {ok: false, reason: 'HPR_CONTENT_TRUNCATED'};
          const big = view.getBigUint64(offset + 8);
          if (big > BigInt(Number.MAX_SAFE_INTEGER)) return {ok: false, reason: 'HPR_CONTENT_TRUNCATED'};
          size = Number(big);
        } else if (size === 0) {
          size = bytes.length - offset; // box extends to end of file
        }
        if (size < 8 || offset + size > bytes.length) return {ok: false, reason: 'HPR_CONTENT_TRUNCATED'};
        offset += size;
      }
      break;
    }
  }
  return {ok: true, contentType: sniffed};
}
