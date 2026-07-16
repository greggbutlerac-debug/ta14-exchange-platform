import {describe,expect,it} from "vitest";
import {parseCreateRoute,parseCorrection} from "../../packages/validation/route-requests";
import {createPaymentCommit} from "../../packages/domain/payment-commit";

describe("V0.3.1 request and commit integrity",()=>{
 it("rejects undeclared create-route fields",()=>{expect(()=>parseCreateRoute({organizationName:"A",systemName:"S",actorId:"x",supplierId:"s",invoiceId:"i",beneficiaryId:"b",amountUsd:25001,hidden:true})).toThrow(/additional properties/)});
 it("requires a 64-character beneficiary evidence hash",()=>{expect(()=>parseCorrection({expectedVersion:1,procurementAuthority:{authorityId:"p",issuer:"i",effectiveAt:new Date().toISOString(),expiresAt:new Date(Date.now()+1000).toISOString()},financeAuthority:{authorityId:"f",issuer:"i",effectiveAt:new Date().toISOString(),expiresAt:new Date(Date.now()+1000).toISOString()},beneficiaryEvidence:{evidenceId:"e",source:"s",hash:"bad"}})).toThrow(/pattern/)});
 it("normalizes payment value to minor units",()=>{const a=createPaymentCommit({amountUsd:32500,supplierId:" s ",invoiceId:" i ",beneficiaryId:" b ",policyVersion:"p"});const b=createPaymentCommit({amountUsd:32500.00,supplierId:"s",invoiceId:"i",beneficiaryId:"b",policyVersion:"p"});expect(a).toEqual(b)});
 it("rejects more than two decimal places",()=>{expect(()=>createPaymentCommit({amountUsd:1.001,supplierId:"s",invoiceId:"i",beneficiaryId:"b",policyVersion:"p"})).toThrow(/two decimal/)});
});
