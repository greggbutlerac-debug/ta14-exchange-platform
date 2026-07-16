import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateDevelopmentSigningKey, type SigningKeyPair } from "../crypto/receipts";
import { sha256Canonical } from "../crypto/receipts";
import type { VendorPaymentRouteInput, SignedTestReceipt } from "../testing/payment-route-tests";
import type { AerRecord } from "../aer/generate-aer";

export type RouteEventInput = {
  eventId: string;
  rid: string;
  type: "ROUTE_CREATED" | "ROUTE_CORRECTED" | "AER_ISSUED";
  at: string;
  version: number;
  details?: Record<string, unknown>;
};
export type RouteEvent = RouteEventInput & { prevEventHash: string | null; eventHash: string };
export type StoredRouteVersion = {
  rid: string;
  organizationName: string;
  systemName: string;
  version: number;
  input: VendorPaymentRouteInput;
  receipt: SignedTestReceipt;
  createdAt: string;
};
export type RegistryRecord = { status: "SELF_DECLARED"; issuedAt: string; limitations: string[]; aer: AerRecord };
type Db = { routeVersions: StoredRouteVersion[]; events: RouteEvent[]; registries: Record<string, RegistryRecord>; key?: SigningKeyPair };

const dataDir = () => process.env.TA14_DATA_DIR ?? path.join(process.cwd(), "data");
const dataFile = () => path.join(dataDir(), "local-store.json");
let writeQueue = Promise.resolve();

async function load(): Promise<Db> {
  await mkdir(dataDir(), { recursive: true });
  try {
    const raw = JSON.parse(await readFile(dataFile(), "utf8"));
    return { routeVersions: raw.routeVersions ?? [], events: raw.events ?? [], registries: raw.registries ?? {}, key: raw.key };
  } catch {
    return { routeVersions: [], events: [], registries: {} };
  }
}

async function save(db: Db) {
  const file = dataFile();
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, JSON.stringify(db, null, 2), { encoding: "utf8", mode: 0o600 });
  await rename(tmp, file);
}

async function mutate<T>(fn: (db: Db) => Promise<T> | T): Promise<T> {
  let release!: () => void;
  const previous = writeQueue;
  writeQueue = new Promise<void>((resolve) => { release = resolve; });
  await previous;
  try {
    const db = await load();
    const result = await fn(db);
    await save(db);
    return result;
  } finally {
    release();
  }
}

function appendEvent(db: Db, event: RouteEventInput): RouteEvent {
  const prior = db.events.filter((item) => item.rid === event.rid).at(-1);
  const prevEventHash = prior?.eventHash ?? null;
  const eventHash = sha256Canonical({ ...event, prevEventHash });
  const stored = { ...event, prevEventHash, eventHash };
  db.events.push(stored);
  return stored;
}

export function verifyEventChain(events: RouteEvent[]): boolean {
  let previous: string | null = null;
  for (const event of events) {
    if (event.prevEventHash !== previous) return false;
    const { eventHash, ...unsigned } = event;
    if (eventHash !== sha256Canonical(unsigned)) return false;
    previous = eventHash;
  }
  return true;
}

export async function signingKey() {
  return mutate((db) => {
    if (!db.key) db.key = generateDevelopmentSigningKey();
    return db.key;
  });
}

export async function createRouteVersion(route: StoredRouteVersion, event: RouteEventInput) {
  return mutate((db) => {
    if (db.routeVersions.some((item) => item.rid === route.rid)) throw new Error("Route already exists.");
    db.routeVersions.push(route);
    appendEvent(db, event);
    return route;
  });
}

export async function appendRouteVersion(route: StoredRouteVersion, expectedCurrentVersion: number, event: RouteEventInput) {
  return mutate((db) => {
    const versions = db.routeVersions.filter((item) => item.rid === route.rid);
    const current = Math.max(...versions.map((item) => item.version), 0);
    if (current !== expectedCurrentVersion) throw new Error(`VERSION_CONFLICT: expected ${expectedCurrentVersion}, current ${current}.`);
    if (route.version !== current + 1) throw new Error("New route version must increment by exactly one.");
    db.routeVersions.push(route);
    appendEvent(db, event);
    return route;
  });
}

export async function issueRegistry(rid: string, registry: RegistryRecord, event: RouteEventInput) {
  return mutate((db) => {
    if (db.registries[rid]) throw new Error("A durable demonstration record has already been issued.");
    db.registries[rid] = registry;
    appendEvent(db, event);
    return registry;
  });
}

export async function getRoute(rid: string) {
  const db = await load();
  const versions = db.routeVersions.filter((item) => item.rid === rid).sort((a, b) => a.version - b.version);
  if (!versions.length) return undefined;
  const events = db.events.filter((item) => item.rid === rid).sort((a, b) => a.at.localeCompare(b.at));
  return { latest: versions.at(-1)!, versions, events, eventChainValid: verifyEventChain(events), registry: db.registries[rid] };
}

export async function getPublicVerificationBundle(rid: string) {
  const db = await load();
  const registry = db.registries[rid];
  if (!registry || !db.key) return undefined;
  const events = db.events.filter((item) => item.rid === rid).sort((a, b) => a.at.localeCompare(b.at));
  return {
    rid,
    publicKey: { keyId: db.key.keyId, algorithm: "Ed25519", publicKeyPem: db.key.publicKeyPem, status: "DEVELOPMENT_ONLY" },
    aer: registry.aer,
    eventChain: { valid: verifyEventChain(events), events },
    registry: { status: registry.status, issuedAt: registry.issuedAt, limitations: registry.limitations },
  };
}
