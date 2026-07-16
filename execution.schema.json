import { randomUUID } from "node:crypto";
import { deriveDecision, nextPermissibleAction, type RequirementResult, type RouteScopeState } from "../domain/state-machine";
import { sha256Canonical, signCanonical, verifyCanonical } from "../crypto/receipts";

export const PAYMENT_REQUIREMENT_LIBRARY_VERSION = "TA14-PAY-2026-07-16.3";
export const POLICY_REGISTRY = {"PROC-PAY-2026.1":{effectiveAt:"2026-01-01T00:00:00.000Z",thresholdUsd:25000,status:"CURRENT" as const}};
export type EvidenceBinding={evidenceId:string;claim:"supplier"|"invoice"|"beneficiary"|"bypass_test"|"replay_test"|"duplicate_test"|"execution"|"outcome";hash:string;observedAt:string};
export interface AuthorityInput {authorityId:string;role:"procurement"|"finance";actorId:string;active:boolean;effectiveAt:string;expiresAt:string;revokedAt?:string;boundPaymentHash:string;scopeOrganizationId:string;scopeSystemId:string;}
export interface VendorPaymentRouteInput {routeId:string;routeVersion:number;organizationId:string;systemId:string;actorId:string;policyVersion:string;amountUsd:number;supplierId?:string;invoiceId?:string;beneficiaryId?:string;beneficiaryVerified?:boolean;committedPaymentHash?:string;executionPaymentHash?:string;duplicatePaymentDetected?:boolean;bypassSucceeded?:boolean;replayAuthorizationUsed?:boolean;outcomeAttributionResolved?:boolean;authorities:AuthorityInput[];evidenceBindings?:EvidenceBinding[];evaluatedAt:string;}
export interface UnsignedTestReceipt {receiptId:string;routeId:string;routeVersion:number;requirementLibraryVersion:string;policyVersion:string;evaluatedAt:string;inputManifestHash:string;decisionFingerprint:string;scopeState:RouteScopeState;decision:ReturnType<typeof deriveDecision>|"OUT_OF_SCOPE";results:RequirementResult[];nextAction:string;signingKeyId:string;}
export interface SignedTestReceipt extends UnsignedTestReceipt {signature:string;}
function parseTimestamp(value:string,field:string){const parsed=Date.parse(value);if(!Number.isFinite(parsed))throw new TypeError(`${field} must be a valid ISO-8601 timestamp.`);return parsed;}
const result=(rv:RequirementResult["result"],id:string,reason:string,evidenceIds:string[]=[]):RequirementResult=>({requirementId:id,requirementVersion:PAYMENT_REQUIREMENT_LIBRARY_VERSION,result:rv,reason,evidenceIds});
const bound=(input:VendorPaymentRouteInput,claim:EvidenceBinding["claim"])=>input.evidenceBindings?.filter(e=>e.claim===claim).map(e=>e.evidenceId)??[];
export function evaluateVendorPaymentRoute(input:VendorPaymentRouteInput, signing:{keyId:string;privateKeyPem:string}):SignedTestReceipt{
 if(!Number.isInteger(input.routeVersion)||input.routeVersion<1)throw new TypeError("routeVersion must be a positive integer.");
 if(!Number.isFinite(input.amountUsd)||input.amountUsd<=0)throw new TypeError("amountUsd must be greater than zero.");
 for(const f of ["routeId","organizationId","systemId","actorId","policyVersion"] as const)if(!input[f].trim())throw new TypeError(`${f} is required.`);
 const policy=POLICY_REGISTRY[input.policyVersion as keyof typeof POLICY_REGISTRY];if(!policy||policy.status!=="CURRENT")throw new TypeError("policyVersion is not recognized as current.");
 const evaluatedAtMs=parseTimestamp(input.evaluatedAt,"evaluatedAt");for(const e of input.evidenceBindings??[])parseTimestamp(e.observedAt,`evidence ${e.evidenceId}.observedAt`);
 const scopeState:RouteScopeState=input.amountUsd>policy.thresholdUsd?"IN_SCOPE":"OUT_OF_SCOPE";const inputManifestHash=sha256Canonical(input);
 const base={routeId:input.routeId,routeVersion:input.routeVersion,requirementLibraryVersion:PAYMENT_REQUIREMENT_LIBRARY_VERSION,policyVersion:input.policyVersion,inputManifestHash};
 if(scopeState==="OUT_OF_SCOPE"){const decisionFingerprint=sha256Canonical({...base,scopeState,decision:"OUT_OF_SCOPE",results:[]});const unsigned:UnsignedTestReceipt={receiptId:randomUUID(),...base,evaluatedAt:new Date(evaluatedAtMs).toISOString(),decisionFingerprint,scopeState,decision:"OUT_OF_SCOPE",results:[],nextAction:"Select a route template whose threshold and scope cover this transaction.",signingKeyId:signing.keyId};return {...unsigned,signature:signCanonical(unsigned,signing.privateKeyPem)};}
 const results:RequirementResult[]=[];
 results.push(input.supplierId&&bound(input,"supplier").length&&input.invoiceId&&bound(input,"invoice").length?result("SATISFIED","TA14-PAY-EVID-001","Supplier and invoice identities are evidence-bound.",[...bound(input,"supplier"),...bound(input,"invoice")]):result("HOLD","TA14-PAY-EVID-001","Supplier and invoice identities require explicit evidence bindings."));
 for (const role of ["procurement", "finance"] as const) {
   const candidates = input.authorities.filter(a => a.role === role);
   const id = `TA14-PAY-AUTH-${role.toUpperCase()}-001`;
   if (!candidates.length) {
     results.push(result("HOLD", id, `Current ${role} authority is missing.`));
     continue;
   }
   const valid = candidates.filter(a => {
     const eff = parseTimestamp(a.effectiveAt, `${role}.effectiveAt`);
     const exp = parseTimestamp(a.expiresAt, `${role}.expiresAt`);
     if (exp <= eff) throw new TypeError(`${role}.expiresAt must be after effectiveAt.`);
     const revoked = a.revokedAt ? parseTimestamp(a.revokedAt, `${role}.revokedAt`) <= evaluatedAtMs : false;
     return a.active && !revoked && eff <= evaluatedAtMs && exp > evaluatedAtMs &&
       a.actorId === input.actorId && a.scopeOrganizationId === input.organizationId &&
       a.scopeSystemId === input.systemId && !!input.committedPaymentHash &&
       a.boundPaymentHash === input.committedPaymentHash;
   });
   if (valid.length > 1) {
     results.push(result("ESCALATE", id, `Multiple valid ${role} authorities conflict; responsible authority selection is required.`, valid.map(a => a.authorityId)));
   } else if (valid.length === 0) {
     results.push(result("HOLD", id, `${role} authority is not current, actor-bound, scope-bound, or payment-bound.`, candidates.map(a => a.authorityId)));
   } else {
     results.push(result("SATISFIED", id, `Current ${role} authority is valid and exactly bound.`, [valid[0].authorityId]));
   }
 }
 results.push(input.beneficiaryId&&input.beneficiaryVerified&&bound(input,"beneficiary").length?result("SATISFIED","TA14-PAY-BEN-001","Beneficiary identity is verified and evidence-bound.",bound(input,"beneficiary")):result("HOLD","TA14-PAY-BEN-001","Verified beneficiary identity and evidence binding are required."));
 results.push(input.bypassSucceeded===true?result("DENY","TA14-PAY-BYP-001","A prohibited path successfully bypassed the gate.",bound(input,"bypass_test")):input.bypassSucceeded===false&&bound(input,"bypass_test").length?result("SATISFIED","TA14-PAY-BYP-001","Bypass resistance was tested with no successful bypass.",bound(input,"bypass_test")):result("HOLD","TA14-PAY-BYP-001","Bypass testing evidence is required."));
 results.push(input.replayAuthorizationUsed===true?result("DENY","TA14-PAY-RPL-001","A stale or previously used authorization was replayed.",bound(input,"replay_test")):input.replayAuthorizationUsed===false&&bound(input,"replay_test").length?result("SATISFIED","TA14-PAY-RPL-001","Replay testing found no invalid authorization reuse.",bound(input,"replay_test")):result("HOLD","TA14-PAY-RPL-001","Replay testing evidence is required."));
 results.push(input.duplicatePaymentDetected===true?result("DENY","TA14-PAY-DUP-001","Duplicate payment risk was detected.",bound(input,"duplicate_test")):input.duplicatePaymentDetected===false&&bound(input,"duplicate_test").length?result("SATISFIED","TA14-PAY-DUP-001","Duplicate-payment testing found no duplicate.",bound(input,"duplicate_test")):result("HOLD","TA14-PAY-DUP-001","Duplicate-payment testing evidence is required."));
 if(input.committedPaymentHash&&input.executionPaymentHash&&input.committedPaymentHash!==input.executionPaymentHash)results.push(result("DENY","TA14-PAY-COMMIT-001","Execution payload does not match the committed payment object.",bound(input,"execution")));else if(!input.executionPaymentHash||!bound(input,"execution").length)results.push(result("HOLD","TA14-PAY-COMMIT-001","Execution correspondence evidence is incomplete."));else results.push(result("SATISFIED","TA14-PAY-COMMIT-001","Execution matches the committed payment object.",bound(input,"execution")));
 if(input.outcomeAttributionResolved===false)results.push(result("ESCALATE","TA14-PAY-OUT-001","Outcome attribution requires responsible human review.",bound(input,"outcome")));else if(input.outcomeAttributionResolved===true&&bound(input,"outcome").length)results.push(result("SATISFIED","TA14-PAY-OUT-001","Outcome correspondence is resolved and evidence-bound.",bound(input,"outcome")));else results.push(result("HOLD","TA14-PAY-OUT-001","Outcome evidence is not yet available."));
 const decision=deriveDecision(results);const decisionFingerprint=sha256Canonical({...base,scopeState,decision,results});const unsigned:UnsignedTestReceipt={receiptId:randomUUID(),...base,evaluatedAt:new Date(evaluatedAtMs).toISOString(),decisionFingerprint,scopeState,decision,results,nextAction:nextPermissibleAction(decision),signingKeyId:signing.keyId};return {...unsigned,signature:signCanonical(unsigned,signing.privateKeyPem)};
}
export function verifyTestReceipt(receipt:SignedTestReceipt,publicKeyPem:string){const{signature,...unsigned}=receipt;return verifyCanonical(unsigned,signature,publicKeyPem);}
