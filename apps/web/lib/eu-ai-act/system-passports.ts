import { createClient } from "@/lib/supabase/client";

export type SystemPassport = {
  id: string;
  systemKey: string;
  name: string;
  version: string;
  purpose: string;
  role: string;
  jurisdiction: string;
  provider: string;
  model: string;
  owner: string;
  risk: string;
  article50: string;
  highRisk: string;
  gpai: string;
  fria: string;
  lastChanged: string;
  evidenceState: string;
  notes: string;
};

type Row = {
  id: string;
  system_key: string;
  name: string;
  version: string;
  intended_purpose: string | null;
  operator_role: string | null;
  jurisdiction: string | null;
  provider: string | null;
  model_dependency: string | null;
  accountable_owner: string | null;
  risk_state: string;
  article_50_state: string;
  high_risk_state: string;
  gpai_state: string;
  fria_state: string;
  last_material_change: string | null;
  evidence_state: string;
  boundary_notes: string | null;
};

function fromRow(row: Row): SystemPassport {
  return {
    id: row.id,
    systemKey: row.system_key,
    name: row.name,
    version: row.version,
    purpose: row.intended_purpose ?? "",
    role: row.operator_role ?? "UNRESOLVED",
    jurisdiction: row.jurisdiction ?? "EU",
    provider: row.provider ?? "",
    model: row.model_dependency ?? "",
    owner: row.accountable_owner ?? "",
    risk: row.risk_state,
    article50: row.article_50_state,
    highRisk: row.high_risk_state,
    gpai: row.gpai_state,
    fria: row.fria_state,
    lastChanged: row.last_material_change ?? "",
    evidenceState: row.evidence_state,
    notes: row.boundary_notes ?? "",
  };
}

function toRow(passport: SystemPassport) {
  return {
    system_key: passport.systemKey,
    name: passport.name || "Unnamed AI system",
    version: passport.version || "1.0",
    intended_purpose: passport.purpose || null,
    operator_role: passport.role || "UNRESOLVED",
    jurisdiction: passport.jurisdiction || "EU",
    provider: passport.provider || null,
    model_dependency: passport.model || null,
    accountable_owner: passport.owner || null,
    risk_state: passport.risk || "UNRESOLVED",
    article_50_state: passport.article50 || "UNRESOLVED",
    high_risk_state: passport.highRisk || "UNRESOLVED",
    gpai_state: passport.gpai || "UNRESOLVED",
    fria_state: passport.fria || "UNRESOLVED",
    last_material_change: passport.lastChanged || null,
    evidence_state: passport.evidenceState || "NOT ASSESSED",
    boundary_notes: passport.notes || null,
  };
}

export async function listSystemPassports(): Promise<SystemPassport[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("eu_ai_systems")
    .select("id,system_key,name,version,intended_purpose,operator_role,jurisdiction,provider,model_dependency,accountable_owner,risk_state,article_50_state,high_risk_state,gpai_state,fria_state,last_material_change,evidence_state,boundary_notes")
    .order("recorded_at", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as Row[]).map(fromRow);
}

export async function createSystemPassport(passport: SystemPassport): Promise<SystemPassport> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("eu_ai_systems")
    .insert(toRow(passport))
    .select("id,system_key,name,version,intended_purpose,operator_role,jurisdiction,provider,model_dependency,accountable_owner,risk_state,article_50_state,high_risk_state,gpai_state,fria_state,last_material_change,evidence_state,boundary_notes")
    .single();
  if (error) throw error;
  return fromRow(data as Row);
}

export async function updateSystemPassport(passport: SystemPassport): Promise<SystemPassport> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("eu_ai_systems")
    .update({ ...toRow(passport), updated_at: new Date().toISOString() })
    .eq("id", passport.id)
    .select("id,system_key,name,version,intended_purpose,operator_role,jurisdiction,provider,model_dependency,accountable_owner,risk_state,article_50_state,high_risk_state,gpai_state,fria_state,last_material_change,evidence_state,boundary_notes")
    .single();
  if (error) throw error;
  return fromRow(data as Row);
}

export async function deleteSystemPassport(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("eu_ai_systems").delete().eq("id", id);
  if (error) throw error;
}
