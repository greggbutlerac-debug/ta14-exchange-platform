export interface WorkspaceRuntimeProjection {
 schema_version:string;
 mode:'REFERENCE_ONLY';
 valid_reference_response:boolean;
 diagnostics:string[];
 reference_result:{
  decision:string|null;
  receipt_status:string|null;
  receipt_execution_authorized_claim:boolean;
  snapshot_execution_authorized_claim:boolean;
 };
 production_authorization:{
  boundary:'REFERENCE_ONLY_PRODUCTION_HOLD';
  effective_disposition:'HOLD';
  production_execution_authorized:false;
  production_commit_authorized:false;
 };
}
export function projectRuntimeReferenceForWorkspace(raw:unknown):WorkspaceRuntimeProjection;
