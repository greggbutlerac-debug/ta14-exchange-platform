import { get, put } from "@vercel/blob";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AerRecord } from "../../../packages/aer/generate-aer";
import {
  generateDevelopmentSigningKey,
  sha256Canonical,
  type SigningKeyPair,
} from "../../../packages/crypto/receipts";
import type {
  SignedTestReceipt,
  VendorPaymentRouteInput,
} from "../../../packages/testing/payment-route-tests";

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

const BLOB_PATHNAME = "ta14-exchange/runtime/local-store.json";

const dataDir = (): string =>
  process.env.TA14_DATA_DIR ?? path.join(process.cwd(), "data");

const dataFile = (): string =>
  path.join(dataDir(), "local-store.json");

let writeQueue: Promise<void> = Promise.resolve();

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

async function loadBlob(): Promise<Db> {
  try {
    const result = await get(BLOB_PATHNAME, {
      access: "public",
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return emptyDb();
    }

    const contents = await new Response(result.stream).text();
    const parsed = JSON.parse(contents) as Partial<Db>;

    return normalizeDb(parsed);
  } catch {
    return emptyDb();
  }
}

async function saveBlob(db: Db): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(db, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
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
  const db = await loadBlob();
  const result = await operation(db);

  await saveBlob(db);

  return result;
}

async function mutate<T>(
  operation: (db: Db) => Promise<T> | T,
): Promise<T> {
  let releaseQueue!: () => void;

  const previousWrite = writeQueue;

  writeQueue = new Promise<void>((resolve) => {
    releaseQueue = resolve;
  });

  await previousWrite;

  try {
    if (useBlobStorage()) {
      return await mutateBlob(operation);
    }

    return await mutateLocal(operation);
  } finally {
    releaseQueue();
  }
}

async function load(): Promise<Db> {
  if (useBlobStorage()) {
    return loadBlob();
  }

  return loadLocal();
}

function appendEvent(
  db: Db,
  event: RouteEventInput,
): RouteEvent {
  const priorEvent = db.events
    .filter((item) => item.rid === event.rid)
    .at(-1);

  const prevEventHash = priorEvent?.eventHash ?? null;

  const eventHash = sha256Canonical({
    ...event,
    prevEventHash,
  });

  const storedEvent: RouteEvent = {
    ...event,
    prevEventHash,
    eventHash,
  };

  db.events.push(storedEvent);

  return storedEvent;
}

export function verifyEventChain(
  events: RouteEvent[],
): boolean {
  let previousEventHash: string | null = null;

  for (const event of events) {
    if (event.prevEventHash !== previousEventHash) {
      return false;
    }

    const { eventHash, ...unsignedEvent } = event;

    if (eventHash !== sha256Canonical(unsignedEvent)) {
      return false;
    }

    previousEventHash = eventHash;
  }

  return true;
}

export async function signingKey(): Promise<SigningKeyPair> {
  const existingDb = await load();

  if (existingDb.key) {
    return existingDb.key;
  }

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

    const currentVersion = Math.max(
      ...versions.map((item) => item.version),
      0,
    );

    if (currentVersion !== expectedCurrentVersion) {
      throw new Error(
        `VERSION_CONFLICT: expected ${expectedCurrentVersion}, current ${currentVersion}.`,
      );
    }

    if (route.version !== currentVersion + 1) {
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
    .sort((first, second) => first.version - second.version);

  if (versions.length === 0) {
    return undefined;
  }

  const events = db.events
    .filter((item) => item.rid === rid)
    .sort((first, second) => first.at.localeCompare(second.at));

  return {
    latest: versions.at(-1)!,
    versions,
    events,
    eventChainValid: verifyEventChain(events),
    registry: db.registries[rid],
  };
}

export async function getPublicVerificationBundle(
  rid: string,
) {
  const db = await load();
  const registry = db.registries[rid];

  if (!registry || !db.key) {
    return undefined;
  }

  const events = db.events
    .filter((item) => item.rid === rid)
    .sort((first, second) => first.at.localeCompare(second.at));

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
