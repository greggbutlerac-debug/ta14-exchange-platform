import {
  type TA14EvidenceHealthState,
  type TA14LinkId,
  type TA14RouteDecision,
} from "./ta14-24-link-canon";
import { createClient } from "../supabase/client";

export type TA14AcademyLifecycleStatus =
  | "draft"
  | "active"
  | "completed"
  | "archived";

export type TA14PassportStatus = "active" | "completed" | "archived";

export type TA14MasteryStage =
  | "NOT STARTED"
  | "RECOGNIZED"
  | "EXPLAINED"
  | "EVIDENCE-MAPPED"
  | "DIAGNOSED"
  | "APPLIED"
  | "REPLAYED"
  | "MASTERED";

export type TA14VisibilityBoundary = "public" | "private" | "mixed";

export type TA14SimulationResultState =
  | "submitted"
  | "route_preserved"
  | "reassess"
  | "voided";

export interface TA14RouteSessionRecord {
  id: string;
  ownerUserId: string;
  title: string;
  subjectType: string;
  subjectName: string;
  declaredScope: string | null;
  currentLinkId: TA14LinkId;
  lastAdmissibleLinkId: TA14LinkId | null;
  firstBrokenLinkId: TA14LinkId | null;
  decision: TA14RouteDecision;
  reason: string | null;
  requiredRecovery: string | null;
  formingConsequence: string | null;
  status: TA14AcademyLifecycleStatus;
  routeContext: Record<string, unknown>;
  completedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TA14RouteSessionInput {
  title?: string;
  subjectType?: string;
  subjectName: string;
  declaredScope?: string | null;
  currentLinkId: TA14LinkId;
  lastAdmissibleLinkId?: TA14LinkId | null;
  firstBrokenLinkId?: TA14LinkId | null;
  decision: TA14RouteDecision;
  reason?: string | null;
  requiredRecovery?: string | null;
  formingConsequence?: string | null;
  status?: TA14AcademyLifecycleStatus;
  routeContext?: Record<string, unknown>;
  completedAt?: string | null;
  archivedAt?: string | null;
}

export interface TA14RouteEventInput {
  sessionId: string;
  eventType: string;
  eventSummary: string;
  previousState?: Record<string, unknown>;
  resultingState?: Record<string, unknown>;
  eventPayload?: Record<string, unknown>;
}

export interface TA14PassportRecord {
  id: string;
  ownerUserId: string;
  passportKey: string;
  title: string;
  status: TA14PassportStatus;
  startedAt: string;
  completedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TA14PassportLinkRecord {
  id: string;
  passportId: string;
  linkId: TA14LinkId;
  masteryStage: TA14MasteryStage;
  evidenceSummary: string | null;
  evidenceReferences: string[];
  assessmentNotes: string | null;
  demonstratedAt: string | null;
  verifiedAt: string | null;
  verifiedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TA14PassportLinkInput {
  passportId: string;
  linkId: TA14LinkId;
  masteryStage: TA14MasteryStage;
  evidenceSummary?: string | null;
  evidenceReferences?: string[];
  assessmentNotes?: string | null;
  demonstratedAt?: string | null;
}

export interface TA14ChainMapRecord {
  id: string;
  ownerUserId: string;
  subjectName: string;
  subjectType: string;
  declaredScope: string | null;
  versionLabel: string | null;
  registrySubmissionId: string | null;
  status: TA14AcademyLifecycleStatus;
  mapContext: Record<string, unknown>;
  completedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TA14ChainMapInput {
  subjectName: string;
  subjectType?: string;
  declaredScope?: string | null;
  versionLabel?: string | null;
  registrySubmissionId?: string | null;
  status?: TA14AcademyLifecycleStatus;
  mapContext?: Record<string, unknown>;
  completedAt?: string | null;
  archivedAt?: string | null;
}

export interface TA14ChainMapLinkRecord {
  id: string;
  chainMapId: string;
  linkId: TA14LinkId;
  evidenceState: TA14EvidenceHealthState;
  supportingArtifactReference: string | null;
  evidenceReferences: string[];
  assessmentNote: string | null;
  reviewScope: string | null;
  versionState: string | null;
  challengeState: string | null;
  visibility: TA14VisibilityBoundary;
  createdAt: string;
  updatedAt: string;
}

export interface TA14ChainMapLinkInput {
  chainMapId: string;
  linkId: TA14LinkId;
  evidenceState: TA14EvidenceHealthState;
  supportingArtifactReference?: string | null;
  evidenceReferences?: string[];
  assessmentNote?: string | null;
  reviewScope?: string | null;
  versionState?: string | null;
  challengeState?: string | null;
  visibility?: TA14VisibilityBoundary;
}

export interface TA14SimulationAttemptInput {
  scenarioId: string;
  scenarioVersion?: string;
  selectedFirstBrokenLinkId?: TA14LinkId | null;
  selectedLastAdmissibleLinkId?: TA14LinkId | null;
  selectedDecision?: TA14RouteDecision | null;
  expectedFirstBrokenLinkId?: TA14LinkId | null;
  expectedLastAdmissibleLinkId?: TA14LinkId | null;
  expectedDecision?: TA14RouteDecision | null;
  routePreservationScore: number;
  resultState: TA14SimulationResultState;
  attemptPayload?: Record<string, unknown>;
}

export interface TA14SimulationAttemptRecord {
  id: string;
  ownerUserId: string;
  scenarioId: string;
  scenarioVersion: string;
  selectedFirstBrokenLinkId: TA14LinkId | null;
  selectedLastAdmissibleLinkId: TA14LinkId | null;
  selectedDecision: TA14RouteDecision | null;
  expectedFirstBrokenLinkId: TA14LinkId | null;
  expectedLastAdmissibleLinkId: TA14LinkId | null;
  expectedDecision: TA14RouteDecision | null;
  routePreservationScore: number;
  resultState: TA14SimulationResultState;
  attemptPayload: Record<string, unknown>;
  completedAt: string;
  createdAt: string;
}

type RouteSessionRow = {
  id: string;
  owner_user_id: string;
  title: string;
  subject_type: string;
  subject_name: string;
  declared_scope: string | null;
  current_link_id: TA14LinkId;
  last_admissible_link_id: TA14LinkId | null;
  first_broken_link_id: TA14LinkId | null;
  decision: TA14RouteDecision;
  reason: string | null;
  required_recovery: string | null;
  forming_consequence: string | null;
  status: TA14AcademyLifecycleStatus;
  route_context: Record<string, unknown> | null;
  completed_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

type PassportRow = {
  id: string;
  owner_user_id: string;
  passport_key: string;
  title: string;
  status: TA14PassportStatus;
  started_at: string;
  completed_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

type PassportLinkRow = {
  id: string;
  passport_id: string;
  link_id: TA14LinkId;
  mastery_stage: TA14MasteryStage;
  evidence_summary: string | null;
  evidence_references: unknown;
  assessment_notes: string | null;
  demonstrated_at: string | null;
  verified_at: string | null;
  verified_by_user_id: string | null;
  created_at: string;
  updated_at: string;
};

type ChainMapRow = {
  id: string;
  owner_user_id: string;
  subject_name: string;
  subject_type: string;
  declared_scope: string | null;
  version_label: string | null;
  registry_submission_id: string | null;
  status: TA14AcademyLifecycleStatus;
  map_context: Record<string, unknown> | null;
  completed_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

type ChainMapLinkRow = {
  id: string;
  chain_map_id: string;
  link_id: TA14LinkId;
  evidence_state: TA14EvidenceHealthState;
  supporting_artifact_reference: string | null;
  evidence_references: unknown;
  assessment_note: string | null;
  review_scope: string | null;
  version_state: string | null;
  challenge_state: string | null;
  visibility: TA14VisibilityBoundary;
  created_at: string;
  updated_at: string;
};

type SimulationAttemptRow = {
  id: string;
  owner_user_id: string;
  scenario_id: string;
  scenario_version: string;
  selected_first_broken_link_id: TA14LinkId | null;
  selected_last_admissible_link_id: TA14LinkId | null;
  selected_decision: TA14RouteDecision | null;
  expected_first_broken_link_id: TA14LinkId | null;
  expected_last_admissible_link_id: TA14LinkId | null;
  expected_decision: TA14RouteDecision | null;
  route_preservation_score: number;
  result_state: TA14SimulationResultState;
  attempt_payload: Record<string, unknown> | null;
  completed_at: string;
  created_at: string;
};

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("You must be signed in to save TA-14 Academy records.");
  }

  return user.id;
}

function mapRouteSession(row: RouteSessionRow): TA14RouteSessionRecord {
  return {
    id: row.id,
    ownerUserId: row.owner_user_id,
    title: row.title,
    subjectType: row.subject_type,
    subjectName: row.subject_name,
    declaredScope: row.declared_scope,
    currentLinkId: row.current_link_id,
    lastAdmissibleLinkId: row.last_admissible_link_id,
    firstBrokenLinkId: row.first_broken_link_id,
    decision: row.decision,
    reason: row.reason,
    requiredRecovery: row.required_recovery,
    formingConsequence: row.forming_consequence,
    status: row.status,
    routeContext: row.route_context ?? {},
    completedAt: row.completed_at,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPassport(row: PassportRow): TA14PassportRecord {
  return {
    id: row.id,
    ownerUserId: row.owner_user_id,
    passportKey: row.passport_key,
    title: row.title,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPassportLink(row: PassportLinkRow): TA14PassportLinkRecord {
  return {
    id: row.id,
    passportId: row.passport_id,
    linkId: row.link_id,
    masteryStage: row.mastery_stage,
    evidenceSummary: row.evidence_summary,
    evidenceReferences: asStringArray(row.evidence_references),
    assessmentNotes: row.assessment_notes,
    demonstratedAt: row.demonstrated_at,
    verifiedAt: row.verified_at,
    verifiedByUserId: row.verified_by_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapChainMap(row: ChainMapRow): TA14ChainMapRecord {
  return {
    id: row.id,
    ownerUserId: row.owner_user_id,
    subjectName: row.subject_name,
    subjectType: row.subject_type,
    declaredScope: row.declared_scope,
    versionLabel: row.version_label,
    registrySubmissionId: row.registry_submission_id,
    status: row.status,
    mapContext: row.map_context ?? {},
    completedAt: row.completed_at,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapChainMapLink(row: ChainMapLinkRow): TA14ChainMapLinkRecord {
  return {
    id: row.id,
    chainMapId: row.chain_map_id,
    linkId: row.link_id,
    evidenceState: row.evidence_state,
    supportingArtifactReference: row.supporting_artifact_reference,
    evidenceReferences: asStringArray(row.evidence_references),
    assessmentNote: row.assessment_note,
    reviewScope: row.review_scope,
    versionState: row.version_state,
    challengeState: row.challenge_state,
    visibility: row.visibility,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSimulationAttempt(
  row: SimulationAttemptRow,
): TA14SimulationAttemptRecord {
  return {
    id: row.id,
    ownerUserId: row.owner_user_id,
    scenarioId: row.scenario_id,
    scenarioVersion: row.scenario_version,
    selectedFirstBrokenLinkId: row.selected_first_broken_link_id,
    selectedLastAdmissibleLinkId: row.selected_last_admissible_link_id,
    selectedDecision: row.selected_decision,
    expectedFirstBrokenLinkId: row.expected_first_broken_link_id,
    expectedLastAdmissibleLinkId: row.expected_last_admissible_link_id,
    expectedDecision: row.expected_decision,
    routePreservationScore: row.route_preservation_score,
    resultState: row.result_state,
    attemptPayload: row.attempt_payload ?? {},
    completedAt: row.completed_at,
    createdAt: row.created_at,
  };
}

export async function listTA14RouteSessions(): Promise<
  TA14RouteSessionRecord[]
> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ta14_academy_route_sessions")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RouteSessionRow[]).map(mapRouteSession);
}

export async function saveTA14RouteSession(
  input: TA14RouteSessionInput,
  existingId?: string,
): Promise<TA14RouteSessionRecord> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const payload = {
    owner_user_id: userId,
    title: input.title ?? "TA-14 Route State Session",
    subject_type: input.subjectType ?? "governed_system",
    subject_name: input.subjectName,
    declared_scope: input.declaredScope ?? null,
    current_link_id: input.currentLinkId,
    last_admissible_link_id: input.lastAdmissibleLinkId ?? null,
    first_broken_link_id: input.firstBrokenLinkId ?? null,
    decision: input.decision,
    reason: input.reason ?? null,
    required_recovery: input.requiredRecovery ?? null,
    forming_consequence: input.formingConsequence ?? null,
    status: input.status ?? "draft",
    route_context: input.routeContext ?? {},
    completed_at: input.completedAt ?? null,
    archived_at: input.archivedAt ?? null,
  };

  const query = existingId
    ? supabase
        .from("ta14_academy_route_sessions")
        .update(payload)
        .eq("id", existingId)
    : supabase.from("ta14_academy_route_sessions").insert(payload);

  const { data, error } = await query.select("*").single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRouteSession(data as RouteSessionRow);
}

export async function appendTA14RouteEvent(
  input: TA14RouteEventInput,
): Promise<string> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("ta14_academy_route_events")
    .insert({
      session_id: input.sessionId,
      actor_user_id: userId,
      event_type: input.eventType,
      event_summary: input.eventSummary,
      previous_state: input.previousState ?? {},
      resulting_state: input.resultingState ?? {},
      event_payload: input.eventPayload ?? {},
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return (data as { id: string }).id;
}

export async function getOrCreateTA14Passport(
  passportKey = "primary",
): Promise<TA14PassportRecord> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const { data: existing, error: lookupError } = await supabase
    .from("ta14_academy_passports")
    .select("*")
    .eq("owner_user_id", userId)
    .eq("passport_key", passportKey)
    .maybeSingle();

  if (lookupError) {
    throw new Error(lookupError.message);
  }

  if (existing) {
    return mapPassport(existing as PassportRow);
  }

  const { data, error } = await supabase
    .from("ta14_academy_passports")
    .insert({
      owner_user_id: userId,
      passport_key: passportKey,
      title: "TA-14 24-Link Chain Passport",
      status: "active",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapPassport(data as PassportRow);
}

export async function listTA14PassportLinks(
  passportId: string,
): Promise<TA14PassportLinkRecord[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ta14_academy_passport_links")
    .select("*")
    .eq("passport_id", passportId)
    .order("link_id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as PassportLinkRow[]).map(mapPassportLink);
}

export async function saveTA14PassportLink(
  input: TA14PassportLinkInput,
): Promise<TA14PassportLinkRecord> {
  const supabase = createClient();

  const payload = {
    passport_id: input.passportId,
    link_id: input.linkId,
    mastery_stage: input.masteryStage,
    evidence_summary: input.evidenceSummary ?? null,
    evidence_references: input.evidenceReferences ?? [],
    assessment_notes: input.assessmentNotes ?? null,
    demonstrated_at:
      input.demonstratedAt ??
      (input.masteryStage === "NOT STARTED"
        ? null
        : new Date().toISOString()),
  };

  const { data, error } = await supabase
    .from("ta14_academy_passport_links")
    .upsert(payload, {
      onConflict: "passport_id,link_id",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapPassportLink(data as PassportLinkRow);
}

export async function listTA14ChainMaps(): Promise<TA14ChainMapRecord[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ta14_academy_chain_maps")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ChainMapRow[]).map(mapChainMap);
}

export async function saveTA14ChainMap(
  input: TA14ChainMapInput,
  existingId?: string,
): Promise<TA14ChainMapRecord> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const payload = {
    owner_user_id: userId,
    subject_name: input.subjectName,
    subject_type: input.subjectType ?? "governed_system",
    declared_scope: input.declaredScope ?? null,
    version_label: input.versionLabel ?? null,
    registry_submission_id: input.registrySubmissionId ?? null,
    status: input.status ?? "draft",
    map_context: input.mapContext ?? {},
    completed_at: input.completedAt ?? null,
    archived_at: input.archivedAt ?? null,
  };

  const query = existingId
    ? supabase
        .from("ta14_academy_chain_maps")
        .update(payload)
        .eq("id", existingId)
    : supabase.from("ta14_academy_chain_maps").insert(payload);

  const { data, error } = await query.select("*").single();

  if (error) {
    throw new Error(error.message);
  }

  return mapChainMap(data as ChainMapRow);
}

export async function listTA14ChainMapLinks(
  chainMapId: string,
): Promise<TA14ChainMapLinkRecord[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ta14_academy_chain_map_links")
    .select("*")
    .eq("chain_map_id", chainMapId)
    .order("link_id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ChainMapLinkRow[]).map(mapChainMapLink);
}

export async function saveTA14ChainMapLink(
  input: TA14ChainMapLinkInput,
): Promise<TA14ChainMapLinkRecord> {
  const supabase = createClient();

  const payload = {
    chain_map_id: input.chainMapId,
    link_id: input.linkId,
    evidence_state: input.evidenceState,
    supporting_artifact_reference:
      input.supportingArtifactReference ?? null,
    evidence_references: input.evidenceReferences ?? [],
    assessment_note: input.assessmentNote ?? null,
    review_scope: input.reviewScope ?? null,
    version_state: input.versionState ?? null,
    challenge_state: input.challengeState ?? null,
    visibility: input.visibility ?? "public",
  };

  const { data, error } = await supabase
    .from("ta14_academy_chain_map_links")
    .upsert(payload, {
      onConflict: "chain_map_id,link_id",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapChainMapLink(data as ChainMapLinkRow);
}

export async function saveTA14SimulationAttempt(
  input: TA14SimulationAttemptInput,
): Promise<TA14SimulationAttemptRecord> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const score = Math.max(
    0,
    Math.min(100, Math.round(input.routePreservationScore)),
  );

  const { data, error } = await supabase
    .from("ta14_academy_simulation_attempts")
    .insert({
      owner_user_id: userId,
      scenario_id: input.scenarioId,
      scenario_version: input.scenarioVersion ?? "v1",
      selected_first_broken_link_id:
        input.selectedFirstBrokenLinkId ?? null,
      selected_last_admissible_link_id:
        input.selectedLastAdmissibleLinkId ?? null,
      selected_decision: input.selectedDecision ?? null,
      expected_first_broken_link_id:
        input.expectedFirstBrokenLinkId ?? null,
      expected_last_admissible_link_id:
        input.expectedLastAdmissibleLinkId ?? null,
      expected_decision: input.expectedDecision ?? null,
      route_preservation_score: score,
      result_state: input.resultState,
      attempt_payload: input.attemptPayload ?? {},
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapSimulationAttempt(data as SimulationAttemptRow);
}

export async function listTA14SimulationAttempts(
  limit = 50,
): Promise<TA14SimulationAttemptRecord[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ta14_academy_simulation_attempts")
    .select("*")
    .order("completed_at", { ascending: false })
    .limit(Math.max(1, Math.min(limit, 200)));

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as SimulationAttemptRow[]).map(
    mapSimulationAttempt,
  );
}
