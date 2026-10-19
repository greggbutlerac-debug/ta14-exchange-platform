export type BrowserTrace = {anchor:string;status:string;note:string};
export type BrowserExamination = {disposition:'HOLD';simulation:true;executionAuthorized:false;attestation:{status:'INDETERMINATE';trusted:false;reason:string};trace:BrowserTrace[]};
export function explainUnverifiedExamination(input:unknown):BrowserExamination;
