/** Minimal, structurally complete image byte fixtures (not decodable photos). */
export function jpeg(size = 2048): Uint8Array {
  const b = new Uint8Array(size);
  b.set([0xff, 0xd8, 0xff, 0xe0], 0);
  for (let i = 4; i < size - 2; i++) b[i] = (i * 31) & 0x7f;
  b.set([0xff, 0xd9], size - 2);
  return b;
}

export function png(size = 2048): Uint8Array {
  const b = new Uint8Array(size);
  b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  for (let i = 8; i < size - 12; i++) b[i] = (i * 17) & 0xff;
  b.set([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82], size - 12);
  return b;
}

export function webp(size = 2048): Uint8Array {
  const b = new Uint8Array(size);
  b.set([...'RIFF'].map(c => c.charCodeAt(0)), 0);
  new DataView(b.buffer).setUint32(4, size - 8, true);
  b.set([...'WEBPVP8 '].map(c => c.charCodeAt(0)), 8);
  return b;
}

export function heic(size = 2048): Uint8Array {
  const b = new Uint8Array(size);
  const v = new DataView(b.buffer);
  v.setUint32(0, 24);
  b.set([...'ftypheic'].map(c => c.charCodeAt(0)), 4);
  b.set([...'mif1heic'].map(c => c.charCodeAt(0)), 16);
  v.setUint32(24, size - 24);
  b.set([...'mdat'].map(c => c.charCodeAt(0)), 28);
  return b;
}

export function streamOf(bytes: Uint8Array, chunk = 1024, failAfter?: number): ReadableStream<Uint8Array> {
  let offset = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (failAfter !== undefined && offset >= failAfter) {
        controller.error(new Error('client aborted'));
        return;
      }
      if (offset >= bytes.length) {
        controller.close();
        return;
      }
      controller.enqueue(bytes.slice(offset, offset + chunk));
      offset += chunk;
    },
  });
}
