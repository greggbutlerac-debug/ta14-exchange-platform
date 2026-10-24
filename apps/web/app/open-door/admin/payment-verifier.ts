import 'server-only';

/**
 * TA14 Open Door payment authority boundary.
 *
 * A ledger row, browser assertion, email, screenshot or manually entered
 * "clear" flag is NOT a payment-provider verification.
 * No provider is configured yet: every request must HOLD.
 */
export type PaymentEvidenceRequest = Readonly<{
  engagementId:string;
  providerTransactionReference:string;
  expectedAmountCents:number;
  expectedCurrency:'USD';
}>;

export type PaymentVerification =
  | Readonly<{disposition:'HOLD';reason:string}>
  | Readonly<{
      disposition:'VERIFIED';
      provider:string;
      transactionReference:string;
      engagementId:string;
      settledAmountCents:number;
      currency:'USD';
      settlementState:'settled';
      reversalState:'clear';
      verifiedAt:string;
    }>;

export interface TrustedPaymentVerifier {
  /** Must query the authoritative provider with server-held credentials. */
  verify(request:PaymentEvidenceRequest):Promise<PaymentVerification>;
}

/**
 * No trusted payment verifier has been integrated or authorized.
 * This deliberate default prevents a database timestamp from being
 * mistaken for independent confirmation.
 */
export const unavailablePaymentVerifier:TrustedPaymentVerifier={
  async verify(_request) {
    return {
      disposition:'HOLD',
      reason:'No independently authorized payment-provider verification is connected.'
    };
  }
};

/**
 * Validate the returned provider record against the intended engagement.
 * Caller must first establish that the verifier itself is trusted.
 */
export function matchPaymentEvidence(
  request:PaymentEvidenceRequest,
  result:PaymentVerification
):PaymentVerification {
  if (result.disposition!=='VERIFIED') return result;
  if (!request.engagementId || !request.providerTransactionReference ||
      !Number.isSafeInteger(request.expectedAmountCents) ||
      request.expectedAmountCents<=0 ||
      result.engagementId!==request.engagementId ||
      result.transactionReference!==request.providerTransactionReference ||
      result.settledAmountCents!==request.expectedAmountCents ||
      result.currency!==request.expectedCurrency ||
      result.settlementState!=='settled' ||
      result.reversalState!=='clear' ||
      !Number.isFinite(Date.parse(result.verifiedAt)) ||
      Date.parse(result.verifiedAt)>Date.now()) {
    return {disposition:'HOLD',reason:'Payment-provider evidence does not match the qualifying engagement.'};
  }
  return result;
}
