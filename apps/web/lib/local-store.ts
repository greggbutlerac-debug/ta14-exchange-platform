import { get, put } from '@vercel/blob';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { AerRecord } from '../../../packages/aer/generate-aer';
import {
  generateDevelopmentSigningKey,
  sha256Canonical,
  type SigningKeyPair,
} from '../../../packages/crypto/receipts';
import type {
  SignedTestReceipt,
  VendorPaymentRouteInput,
} from '../../../packages/testing/payment-route-tests';
import type {
  Organization,
  OrganizationInvitation,
  OrganizationMembership,
  OrganizationRole,
  SubscriptionPlan,
} from './organizations';

export type RouteEventInput = {
  eventId: string;
  rid: string;
  type: 'ROUTE_CREATED' | 'ROUTE_CORRECTED' | 'AER_ISSUED';
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
  organizationId?: string;
  createdBy?: string;
};

export type RegistryRecord = {
  status: 'SELF_DECLARED';
  issuedAt: string;
  limitations: string[];
  aer: AerRecord;
  organizationId?: string;
  createdBy?: string;
};

export type DraftMaterialClassification =
  | 'Reality'
  | 'Record'
  | 'Authority'
  | 'Binding'
  | 'Commit'
  | 'Execution'
  | 'Outcome'
  | 'Supporting Evidence'
  | 'Unknown';

export type DraftMaterial = {
  evidenceId: string;
  filename: string;
  mediaType: string;
  sizeBytes: number;
  classification: DraftMaterialClassification;
  integrityState: 'PENDING' | 'INVENTORIED' | 'VERIFIED';
  continuityState:
    | 'SOURCE_REVIEW_REQUIRED'
    | 'READY_FOR_SOURCE_REVIEW';
  sourceLabel?: string;
  observedAt?: string;
  receivedAt: string;
  localFingerprint?: string;
};

export type DraftRecord = {
  draftId: string;
  title: string;
  recordType: string;
  ownerId: string;
  organizationId?: string;
  createdBy?: string;
  currentStage:
    | 'REALITY'
    | 'EVIDENCE'
    | 'IDENTITY'
    | 'CONTINUITY'
    | 'AUTHORITY'
    | 'ADMISSIBILITY'
    | 'BINDING'
    | 'COMMIT'
    | 'EXECUTION'
    | 'OUTCOME'
    | 'ESTABLISHMENT'
    | 'LIFECYCLE';
  readinessPercent: number;
  blockers: string[];
  warnings: string[];
  materials: DraftMaterial[];
  declarations: Record<string, unknown>;
  relationships: Record<string, unknown>[];
  lifecycleDraft: Record<string, unknown>;
  status: 'ACTIVE' | 'ABANDONED' | 'ESTABLISHED';
  createdAt: string;
  updatedAt: string;
};

type Db = {
  routeVersions: StoredRouteVersion[];
  events: RouteEvent[];
  registries: Record<string, RegistryRecord>;
  drafts: DraftRecord[];
  organizations: Organization[];
  memberships: OrganizationMembership[];
  invitations: OrganizationInvitation[];
  key?: SigningKeyPair;
};

const BLOB_PATHNAME = 'ta14-exchange/runtime/local-store.json';

const dataDir = (): string =>
  process.env.TA14_DATA_DIR ?? path.join(process.cwd(), 'data');

const dataFile = (): string =>
  path.join(dataDir(), 'local-store.json');

let writeQueue: Promise<void> = Promise.resolve();

function emptyDb(): Db {
  return {
    routeVersions: [],
    events: [],
    registries: {},
    drafts: [],
    organizations: [],
    memberships: [],
    invitations: [],
  };
}

function normalizeDb(raw: Partial<Db> | undefined): Db {
  return {
    routeVersions: raw?.routeVersions ?? [],
    events: raw?.events ?? [],
    registries: raw?.registries ?? {},
    drafts: raw?.drafts ?? [],
    organizations: raw?.organizations ?? [],
    memberships: raw?.memberships ?? [],
    invitations: raw?.invitations ?? [],
    key: raw?.key,
  };
}

function useBlobStorage(): boolean {
  return (
    process.env.VERCEL === '1' ||
    Boolean(process.env.BLOB_STORE_ID) ||
    Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  );
}

async function loadLocal(): Promise<Db> {
  await mkdir(dataDir(), { recursive: true });

  try {
    const contents = await readFile(dataFile(), 'utf8');
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
    encoding: 'utf8',
    mode: 0o600,
  });

  await rename(temporaryFile, file);
}

async function loadBlob(): Promise<Db> {
  try {
    const result = await get(BLOB_PATHNAME, {
      access: 'private',
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
    access: 'private',
    contentType: 'application/json',
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
      throw new Error('Route already exists.');
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
        'New route version must increment by exactly one.',
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
        'A durable demonstration record has already been issued.',
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
    .sort((first, second) =>
      first.at.localeCompare(second.at),
    );

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
    .sort((first, second) =>
      first.at.localeCompare(second.at),
    );

  return {
    rid,
    publicKey: {
      keyId: db.key.keyId,
      algorithm: 'Ed25519',
      publicKeyPem: db.key.publicKeyPem,
      status: 'DEVELOPMENT_ONLY',
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

export async function createDraftRecord(
  draft: DraftRecord,
): Promise<DraftRecord> {
  return mutate((db) => {
    if (
      db.drafts.some(
        (item) => item.draftId === draft.draftId,
      )
    ) {
      throw new Error('Draft already exists.');
    }

    db.drafts.push(draft);

    return draft;
  });
}

export async function listDraftRecords(
  ownerId?: string,
  organizationId?: string,
): Promise<DraftRecord[]> {
  const db = await load();

  return db.drafts
    .filter((draft) => {
      if (draft.status !== 'ACTIVE') {
        return false;
      }

      if (
        organizationId &&
        draft.organizationId !== organizationId
      ) {
        return false;
      }

      if (ownerId && draft.ownerId !== ownerId) {
        return false;
      }

      return true;
    })
    .sort((first, second) =>
      second.updatedAt.localeCompare(first.updatedAt),
    );
}

export async function getDraftRecord(
  draftId: string,
): Promise<DraftRecord | undefined> {
  const db = await load();

  return db.drafts.find(
    (draft) => draft.draftId === draftId,
  );
}

export async function updateDraftRecord(
  draftId: string,
  update: (draft: DraftRecord) => DraftRecord,
): Promise<DraftRecord> {
  return mutate((db) => {
    const index = db.drafts.findIndex(
      (draft) => draft.draftId === draftId,
    );

    if (index < 0) {
      throw new Error('Draft not found.');
    }

    const current = db.drafts[index];
    const next = update(current);

    if (next.draftId !== current.draftId) {
      throw new Error('Draft identity cannot be changed.');
    }

    if (next.createdAt !== current.createdAt) {
      throw new Error(
        'Draft creation time cannot be changed.',
      );
    }

    db.drafts[index] = next;

    return next;
  });
}

export async function abandonDraftRecord(
  draftId: string,
  abandonedAt: string,
): Promise<DraftRecord> {
  return updateDraftRecord(draftId, (draft) => ({
    ...draft,
    status: 'ABANDONED',
    updatedAt: abandonedAt,
  }));
}

export async function createStoredOrganization(
  organization: Organization,
  ownerMembership: OrganizationMembership,
): Promise<Organization> {
  return mutate((db) => {
    const duplicateId = db.organizations.some(
      (item) =>
        item.organizationId === organization.organizationId,
    );

    if (duplicateId) {
      throw new Error('Organization already exists.');
    }

    const duplicateSlug = db.organizations.some(
      (item) => item.slug === organization.slug,
    );

    if (duplicateSlug) {
      throw new Error('Organization slug is already in use.');
    }

    if (
      ownerMembership.organizationId !==
      organization.organizationId
    ) {
      throw new Error(
        'Owner membership must belong to the organization.',
      );
    }

    if (ownerMembership.role !== 'OWNER') {
      throw new Error(
        'Initial organization membership must be OWNER.',
      );
    }

    if (
      ownerMembership.userId !== organization.createdBy
    ) {
      throw new Error(
        'Organization creator must match the initial owner.',
      );
    }

    db.organizations.push(organization);
    db.memberships.push(ownerMembership);

    return organization;
  });
}

export async function listOrganizationsForUser(
  userId: string,
): Promise<
  Array<{
    organization: Organization;
    membership: OrganizationMembership;
  }>
> {
  const db = await load();

  const memberships = db.memberships.filter(
    (membership) =>
      membership.userId === userId &&
      membership.status === 'ACTIVE',
  );

  return memberships
    .map((membership) => {
      const organization = db.organizations.find(
        (item) =>
          item.organizationId ===
          membership.organizationId,
      );

      if (!organization) {
        return undefined;
      }

      return {
        organization,
        membership,
      };
    })
    .filter(
      (
        value,
      ): value is {
        organization: Organization;
        membership: OrganizationMembership;
      } => Boolean(value),
    )
    .sort((first, second) =>
      first.organization.name.localeCompare(
        second.organization.name,
      ),
    );
}

export async function getOrganization(
  organizationId: string,
): Promise<Organization | undefined> {
  const db = await load();

  return db.organizations.find(
    (organization) =>
      organization.organizationId === organizationId,
  );
}

export async function getOrganizationBySlug(
  slug: string,
): Promise<Organization | undefined> {
  const db = await load();

  return db.organizations.find(
    (organization) => organization.slug === slug,
  );
}

export async function updateStoredOrganization(
  organizationId: string,
  update: (organization: Organization) => Organization,
): Promise<Organization> {
  return mutate((db) => {
    const index = db.organizations.findIndex(
      (organization) =>
        organization.organizationId === organizationId,
    );

    if (index < 0) {
      throw new Error('Organization not found.');
    }

    const current = db.organizations[index];
    const next = update(current);

    if (
      next.organizationId !== current.organizationId
    ) {
      throw new Error(
        'Organization identity cannot be changed.',
      );
    }

    if (next.createdAt !== current.createdAt) {
      throw new Error(
        'Organization creation time cannot be changed.',
      );
    }

    const slugConflict = db.organizations.some(
      (organization, organizationIndex) =>
        organizationIndex !== index &&
        organization.slug === next.slug,
    );

    if (slugConflict) {
      throw new Error(
        'Organization slug is already in use.',
      );
    }

    db.organizations[index] = next;

    return next;
  });
}

export async function updateOrganizationPlan(
  organizationId: string,
  plan: SubscriptionPlan,
  updatedAt = new Date().toISOString(),
): Promise<Organization> {
  return updateStoredOrganization(
    organizationId,
    (organization) => ({
      ...organization,
      plan,
      subscriptionStatus: 'ACTIVE',
      updatedAt,
    }),
  );
}

export async function addOrganizationMembership(
  membership: OrganizationMembership,
): Promise<OrganizationMembership> {
  return mutate((db) => {
    const organizationExists = db.organizations.some(
      (organization) =>
        organization.organizationId ===
        membership.organizationId,
    );

    if (!organizationExists) {
      throw new Error('Organization not found.');
    }

    const existingMembership = db.memberships.find(
      (item) =>
        item.organizationId ===
          membership.organizationId &&
        item.userId === membership.userId,
    );

    if (existingMembership) {
      throw new Error(
        'User already has an organization membership.',
      );
    }

    const membershipIdExists = db.memberships.some(
      (item) =>
        item.membershipId === membership.membershipId,
    );

    if (membershipIdExists) {
      throw new Error('Membership already exists.');
    }

    db.memberships.push(membership);

    return membership;
  });
}

export async function listOrganizationMemberships(
  organizationId: string,
): Promise<OrganizationMembership[]> {
  const db = await load();

  return db.memberships
    .filter(
      (membership) =>
        membership.organizationId === organizationId,
    )
    .sort((first, second) =>
      first.createdAt.localeCompare(second.createdAt),
    );
}

export async function getOrganizationMembership(
  organizationId: string,
  userId: string,
): Promise<OrganizationMembership | undefined> {
  const db = await load();

  return db.memberships.find(
    (membership) =>
      membership.organizationId === organizationId &&
      membership.userId === userId,
  );
}

export async function updateOrganizationMembership(
  membershipId: string,
  update: (
    membership: OrganizationMembership,
  ) => OrganizationMembership,
): Promise<OrganizationMembership> {
  return mutate((db) => {
    const index = db.memberships.findIndex(
      (membership) =>
        membership.membershipId === membershipId,
    );

    if (index < 0) {
      throw new Error('Membership not found.');
    }

    const current = db.memberships[index];
    const next = update(current);

    if (next.membershipId !== current.membershipId) {
      throw new Error(
        'Membership identity cannot be changed.',
      );
    }

    if (
      next.organizationId !== current.organizationId
    ) {
      throw new Error(
        'Membership organization cannot be changed.',
      );
    }

    if (next.userId !== current.userId) {
      throw new Error(
        'Membership user cannot be changed.',
      );
    }

    if (next.createdAt !== current.createdAt) {
      throw new Error(
        'Membership creation time cannot be changed.',
      );
    }

    if (
      current.role === 'OWNER' &&
      next.role !== 'OWNER'
    ) {
      const activeOwners = db.memberships.filter(
        (membership) =>
          membership.organizationId ===
            current.organizationId &&
          membership.role === 'OWNER' &&
          membership.status === 'ACTIVE',
      );

      if (activeOwners.length <= 1) {
        throw new Error(
          'An organization must retain at least one active owner.',
        );
      }
    }

    db.memberships[index] = next;

    return next;
  });
}

export async function changeOrganizationMemberRole(
  membershipId: string,
  role: OrganizationRole,
  updatedAt = new Date().toISOString(),
): Promise<OrganizationMembership> {
  return updateOrganizationMembership(
    membershipId,
    (membership) => ({
      ...membership,
      role,
      updatedAt,
    }),
  );
}

export async function removeOrganizationMembership(
  membershipId: string,
  updatedAt = new Date().toISOString(),
): Promise<OrganizationMembership> {
  return updateOrganizationMembership(
    membershipId,
    (membership) => ({
      ...membership,
      status: 'SUSPENDED',
      updatedAt,
    }),
  );
}

export async function createOrganizationInvitation(
  invitation: OrganizationInvitation,
): Promise<OrganizationInvitation> {
  return mutate((db) => {
    const organizationExists = db.organizations.some(
      (organization) =>
        organization.organizationId ===
        invitation.organizationId,
    );

    if (!organizationExists) {
      throw new Error('Organization not found.');
    }

    const invitationIdExists = db.invitations.some(
      (item) =>
        item.invitationId === invitation.invitationId,
    );

    if (invitationIdExists) {
      throw new Error('Invitation already exists.');
    }

    const pendingInvitationExists = db.invitations.some(
      (item) =>
        item.organizationId ===
          invitation.organizationId &&
        item.email.toLowerCase() ===
          invitation.email.toLowerCase() &&
        item.status === 'PENDING',
    );

    if (pendingInvitationExists) {
      throw new Error(
        'A pending invitation already exists for this email.',
      );
    }

    db.invitations.push(invitation);

    return invitation;
  });
}

export async function listOrganizationInvitations(
  organizationId: string,
): Promise<OrganizationInvitation[]> {
  const db = await load();

  return db.invitations
    .filter(
      (invitation) =>
        invitation.organizationId === organizationId,
    )
    .sort((first, second) =>
      second.createdAt.localeCompare(first.createdAt),
    );
}

export async function getInvitationByTokenHash(
  tokenHash: string,
): Promise<OrganizationInvitation | undefined> {
  const db = await load();

  return db.invitations.find(
    (invitation) =>
      invitation.tokenHash === tokenHash,
  );
}

export async function updateOrganizationInvitation(
  invitationId: string,
  update: (
    invitation: OrganizationInvitation,
  ) => OrganizationInvitation,
): Promise<OrganizationInvitation> {
  return mutate((db) => {
    const index = db.invitations.findIndex(
      (invitation) =>
        invitation.invitationId === invitationId,
    );

    if (index < 0) {
      throw new Error('Invitation not found.');
    }

    const current = db.invitations[index];
    const next = update(current);

    if (next.invitationId !== current.invitationId) {
      throw new Error(
        'Invitation identity cannot be changed.',
      );
    }

    if (
      next.organizationId !== current.organizationId
    ) {
      throw new Error(
        'Invitation organization cannot be changed.',
      );
    }

    if (next.createdAt !== current.createdAt) {
      throw new Error(
        'Invitation creation time cannot be changed.',
      );
    }

    db.invitations[index] = next;

    return next;
  });
}
