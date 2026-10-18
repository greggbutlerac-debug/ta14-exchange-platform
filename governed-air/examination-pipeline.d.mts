export type AnchorTrace = {anchor:string;status:string;note:string};
export type PipelineResult = {disposition:'HOLD';simulation:true;executionAuthorized:false;reason:string;attestation:{status:string;trusted:boolean;reason:string};checks:Record<string,boolean>;trace:AnchorTrace[];underlyingBoundary:string};
export function examineGovernedAirCase(input: unknown, trust?: unknown): PipelineResult;
