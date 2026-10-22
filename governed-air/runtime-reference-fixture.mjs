// Synthetic reference response for the Governed Air integration demonstration.
// Not a response from a connected runtime, not evidence, and not authorization.
export const syntheticRuntimeResponse=Object.freeze({
 schema_version:'ta14.runtime.api_models.v1',success:true,
 orchestration_result:{
  record_type:'REFERENCE_ORCHESTRATION',reference_only:true,
  boundary:'REFERENCE_ONLY_PRODUCTION_HOLD',effective_disposition:'HOLD',
  execution_authorized:false,production_execution_authorized:false,production_commit_authorized:false,
  enforcement_decision:{decision:'PROCEED'},
  execution_receipt:{receipt_status:'EXECUTED',execution_authorized:true},
  production_authorization:{boundary:'REFERENCE_ONLY_PRODUCTION_HOLD',disposition:'HOLD',production_execution_authorized:false,production_commit_authorized:false},
  reference_artifact_presentation:{
   record_type:'REFERENCE_ARTIFACT_PRESENTATION',reference_receipt_status:'EXECUTED',
   reference_receipt_execution_authorized_claim:true,reference_snapshot_execution_authorized_claim:true,
   actual_execution_verified:false,independent_authority_established:false,
   effective_disposition:'HOLD',production_execution_authorized:false,production_commit_authorized:false,
   boundary:'REFERENCE_ONLY_PRODUCTION_HOLD'
  }
 }
});
