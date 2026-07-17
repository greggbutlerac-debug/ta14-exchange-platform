import {
  BlobPreconditionFailedError,
  get,
  put,
} from "@vercel/blob";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AerRecord } from "../aer/generate-aer";
import {
  generateDevelopmentSigningKey,
  sha256Canonical,
  type SigningKeyPair,
} from "../crypto/receipts";
import type {
  SignedTestReceipt,
  VendorPaymentRouteInput,
} from "../testing/payment-route-tests";

export type RouteEventInput = {
  eventId: string;
  rid: string;
  type: "ROUTE_CREATED" | "ROUTE_CORRECTED" | "AER_ISSUED";
  at: string;
  version: number;
  details?: Record<string, unknown>;
};

export type RouteEvent = RouteEventInput & {
  prevEventHash: string | null;
  eventHash: string;
};

export type StoredRouteVersion = {
  rid: string;
  organizationName: string;
  systemName: string;
  version: number;
  input: VendorPaymentRouteInput;
  receipt: SignedTestReceipt;
  createdAt: string;
};

export type RegistryRecord = {
  status: "SELF_DECLARED";
  issuedAt: string;
  limitations: string[];
  aer: AerRecord;
};

type Db = {
  routeVersions: StoredRouteVersion[];
  events: RouteEvent[];
  registries: Record<string, RegistryRecord>;
  key?: SigningKeyPair;
};

type LoadedBlobDb = {
  db: Db;
  etag: string | null;
};

const BLOB_PATHNAME = "ta14-exchange/runtime/local-store.json";
const MAX_BLOB_WRITE_ATTEMPTS = 6;

const dataDir = () =>
  process.env.TA14_DATA_DIR ?? path.join(process.cwd(), "data");

const dataFile = () => path.join(dataDir(), "local-store.json");

let writeQueue = Promise.resolve();

function emptyDb(): Db {
  return {
    routeVersions: [],
    events: [],
    registries: {},
  };
}

function normalizeDb(raw: Partial<Db> | undefined): Db {
  return {
    routeVersions: raw?.routeVersions ?? [],
    events: raw?.events ?? [],
    registries: raw?.registries ?? {},
    key: raw?.key,
  };
}

function useBlobStorage(): boolean {
  /*
   * Current Vercel Blob connections use short-lived OIDC authentication
   * automatically inside Vercel Functions and may not expose the legacy
   * BLOB_READ_WRITE_TOKEN variable.
   *
   * BLOB_STORE_ID confirms the connected store. VERCEL confirms that the
   * code is executing in a Vercel deployment. The legacy token remains
   * supported for local environments and older project connections.
   */
  return (
    process.env.VERCEL === "1" ||
    Boolean(process.env.BLOB_STORE_ID) ||
    Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  );
}

async function loadLocal(): Promise<Db> {
  await mkdir(dataDir(), { recursive: true });

  try {
    const contents = await readFile(dataFile(), "utf8");
    const parsed = JSON.parse(contents) as Partial<Db>;

    return normalizeDb(parsed);
  } catch {
    return emptyDb();
  }
}

async function saveLocal(db: Db): Promise<void> {
  await mkdir(dataDir(), { recursive: true });

  const file = dataFile();
  const temporaryFile = `${file}.${process.pid}.${Date.now()}.tmp`;

  await writeFile(temporaryFile, JSON.stringify(db, null, 2), {
    encoding: "utf8",
    mode: 0o600,
  });

  await rename(temporaryFile, file);
}

async function loadBlob(): Promise<LoadedBlobDb> {
  const result = await get(BLOB_PATHNAME, {
    access: "private",
  });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return {
      db: emptyDb(),
      etag: null,
    };
  }

  const contents = await new Response(result.stream).text();
  const parsed = JSON.parse(contents) as Partial<Db>;

  return {
    db: normalizeDb(parsed),
    etag: result.blob.etag,
  };
}

async function saveBlob(db: Db, etag: string | null): Promise<void> {
  const body = JSON.stringify(db, null, 2);

  if (etag) {
    await put(BLOB_PATHNAME, body, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      ifMatch: etag,
    });

    return;
  }

  await put(BLOB_PATHNAME, body, {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

function isConcurrentBlobWrite(error: unknown): boolean {
  if (error instanceof BlobPreconditionFailedError) {
    return true;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("already exists") ||
    message.includes("precondition") ||
    message.includes("etag") ||
    message.includes("conflict")
  );
}

async function waitBeforeRetry(attempt: number): Promise<void> {
  const delayMilliseconds =
    35 * 2 ** attempt + Math.floor(Math.random() * 40);

  await new Promise<void>((resolve) => {
    setTimeout(resolve, delayMilliseconds);
  });
}

async function mutateLocal<T>(
  operation: (db: Db) => Promise<T> | T,
): Promise<T> {
  const db = await loadLocal();
  const result = await operation(db);

  await saveLocal(db);

  return result;
}

async function mutateBlob<T>(
  operation: (db: Db) => Promise<T> | T,
): Promise<T> {
  for (
    let attempt = 0;
    attempt < MAX_BLOB_WRITE_ATTEMPTS;
    attempt += 1
  ) {
    const loaded = await loadBlob();
    const result = await operation(loaded.db);

    try {
      await saveBlob(loaded.db, loaded.etag);
      return result;
    } catch (error) {
      const finalAttempt =
        attempt === MAX_BLOB_WRITE_ATTEMPTS - 1;

      if (!isConcurrentBlobWrite(error) || finalAttempt) {
        throw error;
      }

      await waitBeforeRetry(attempt);
    }
  }

  throw new Error("Unable to persist the route store.");
}

async function mutate<T>(
  operation: (db: Db) => Promise<T> | T,
): Promise<T> {
  let release!: () => void;

  const previous = writeQueue;

  writeQueue = new Promise<void>((resolve) => {
    release = resolve;
  });

  await previous;

  try {
    if (useBlobStorage()) {
      return await mutateBlob(operation);
    }

    return await mutateLocal(operation);
  } finally {
    release();
  }
}

async function load(): Promise<Db> {
  if (useBlobStorage()) {
    const loaded = await loadBlob();
    return loaded.db;
  }

  return loadLocal();
}

function appendEvent(db: Db, event: RouteEventInput): RouteEvent {
  const prior = db.events
    .filter((item) => item.rid === event.rid)
    .at(-1);

  const prevEventHash = prior?.eventHash ?? null;

  const eventHash = sha256Canonical({
    ...event,
    prevEventHash,
  });

  const stored: RouteEvent = {
    ...event,
    prevEventHash,
    eventHash,
  };

  db.events.push(stored);

  return stored;
}

export function verifyEventChain(events: RouteEvent[]): boolean {
  let previous: string | null = null;

  for (const event of events) {
    if (event.prevEventHash !== previous) {
      return false;
    }

    const { eventHash, ...unsigned } = event;

    if (eventHash !== sha256Canonical(unsigned)) {
      return false;
    }

    previous = eventHash;
  }

  return true;
}

export async function signingKey(): Promise<SigningKeyPair> {
  return mutate((db) => {
    if (!db.key) {
      db.key = generateDevelopmentSigningKey();
    }

    return db.key;
  });
}

export async function createRouteVersion(
  route: StoredRouteVersion,
  event: RouteEventInput,
): Promise<StoredRouteVersion> {
  return mutate((db) => {
    const routeAlreadyExists = db.routeVersions.some(
      (item) => item.rid === route.rid,
    );

    if (routeAlreadyExists) {
      throw new Error("Route already exists.");
    }

    db.routeVersions.push(route);
    appendEvent(db, event);

    return route;
  });
}

export async function appendRouteVersion(
  route: StoredRouteVersion,
  expectedCurrentVersion: number,
  event: RouteEventInput,
): Promise<StoredRouteVersion> {
  return mutate((db) => {
    const versions = db.routeVersions.filter(
      (item) => item.rid === route.rid,
    );

    const current = Math.max(
      ...versions.map((item) => item.version),
      0,
    );

    if (current !== expectedCurrentVersion) {
      throw new Error(
        `VERSION_CONFLICT: expected ${expectedCurrentVersion}, current ${current}.`,
      );
    }

    if (route.version !== current + 1) {
      throw new Error(
        "New route version must increment by exactly one.",
      );
    }

    db.routeVersions.push(route);
    appendEvent(db, event);

    return route;
  });
}

export async function issueRegistry(
  rid: string,
  registry: RegistryRecord,
  event: RouteEventInput,
): Promise<RegistryRecord> {
  return mutate((db) => {
    if (db.registries[rid]) {
      throw new Error(
        "A durable demonstration record has already been issued.",
      );
    }

    db.registries[rid] = registry;
    appendEvent(db, event);

    return registry;
  });
}

export async function getRoute(rid: string) {
  const db = await load();

  const versions = db.routeVersions
    .filter((item) => item.rid === rid)
    .sort((a, b) => a.version - b.version);

  if (!versions.length) {
    return undefined;
  }

  const events = db.events
    .filter((item) => item.rid === rid)
    .sort((a, b) => a.at.localeCompare(b.at));

  return {
    latest: versions.at(-1)!,
    versions,
    events,
    eventChainValid: verifyEventChain(events),
    registry: db.registries[rid],
  };
}

export async function getPublicVerificationBundle(rid: string) {
  const db = await load();
  const registry = db.registries[rid];

  if (!registry || !db.key) {
    return undefined;
  }

  const events = db.events
    .filter((item) => item.rid === rid)
    .sort((a, b) => a.at.localeCompare(b.at));

  return {
    rid,
    publicKey: {
      keyId: db.key.keyId,
      algorithm: "Ed25519",
      publicKeyPem: db.key.publicKeyPem,
      status: "DEVELOPMENT_ONLY",
    },
    aer: registry.aer,
    eventChain: {
      valid: verifyEventChain(events),
      events,
    },
    registry: {
      status: registry.status,
      issuedAt: registry.issuedAt,
      limitations: registry.limitations,
    },
  };
}
