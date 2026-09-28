/**
 * RFC 3161 Time-Stamp Protocol: request construction and token verification (standards-based ASN.1/DER
 * via pkijs/asn1js; no hand-written DER parsing).
 *
 * The TSA receives only a SHA-256 digest (the checkpoint hash). A verified token proves that digest
 * existed no later than genTime, signed by a TSA certificate chaining to a pinned trust anchor. It proves
 * nothing about the truth or admissibility of the evidence behind the checkpoint.
 */
import { createHash, webcrypto } from "node:crypto";
import * as asn1js from "asn1js";
import * as pkijs from "pkijs";

export const SHA256_OID = "2.16.840.1.101.3.4.2.1";
export const EKU_TIME_STAMPING_OID = "1.3.6.1.5.5.7.3.8";
const EXT_KEY_USAGE_OID = "2.5.29.37";
const SIGNED_DATA_OID = "1.2.840.113549.1.7.2";
const TST_INFO_OID = "1.2.840.113549.1.9.16.1.4";

let engineInstalled = false;
function ensureEngine(): void {
  if (engineInstalled) return;
  pkijs.setEngine("ta14-node-webcrypto", new pkijs.CryptoEngine({ name: "ta14-node-webcrypto", crypto: webcrypto as unknown as Crypto }));
  engineInstalled = true;
}

export const hexToBytes = (hex: string): Uint8Array => Uint8Array.from(hex.match(/../g) ?? [], (b) => parseInt(b, 16));
export const bytesToHex = (bytes: ArrayBuffer | Uint8Array): string => Buffer.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)).toString("hex");
const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;

/** A positive nonce (high bit cleared so the INTEGER is not negative). */
export function positiveNonceHex(random: Uint8Array): string {
  const bytes = Uint8Array.from(random);
  bytes[0] = (bytes[0] & 0x7f) | 0x01;
  return bytesToHex(bytes);
}

export function buildTimestampRequest(digestHex: string, nonceHex: string): Uint8Array {
  const request = new pkijs.TimeStampReq({
    version: 1,
    messageImprint: new pkijs.MessageImprint({
      hashAlgorithm: new pkijs.AlgorithmIdentifier({ algorithmId: SHA256_OID }),
      hashedMessage: new asn1js.OctetString({ valueHex: toArrayBuffer(hexToBytes(digestHex)) }),
    }),
    nonce: new asn1js.Integer({ valueHex: toArrayBuffer(hexToBytes(nonceHex)) }),
    certReq: true,
  });
  return new Uint8Array(request.toSchema().toBER(false));
}

export interface TimestampFields {
  tokenDerBase64: string;
  genTime: string;
  serialNumberHex: string;
  policyOid: string;
  hashAlgorithmOid: string;
  messageImprintHex: string;
  nonceHex: string | null;
  tsaSubject: string;
  signerCertificateSha256: string;
}

export type TimestampVerification =
  | { valid: true; fields: TimestampFields; detail: [] }
  | { valid: false; fields: Partial<TimestampFields>; detail: string[] };

export interface TokenExpectations {
  digestHex: string;
  /** The request nonce, when verifying a fresh response. Stored tokens re-verify against their recorded nonce. */
  nonceHex: string | null;
  /** Pinned TSA trust anchors (DER certificates). */
  trustAnchorsDer: readonly Uint8Array[];
  /** The stamped time must not precede this instant (the window's closedAt). */
  notBefore: string;
}

function subjectOf(cert: pkijs.Certificate): string {
  return cert.subject.typesAndValues.map((tv) => `${tv.type}=${(tv.value.valueBlock as { value?: string }).value ?? ""}`).join(",");
}

const HASHES: Readonly<Record<string, string>> = {
  "2.16.840.1.101.3.4.2.1": "SHA-256", "2.16.840.1.101.3.4.2.2": "SHA-384", "2.16.840.1.101.3.4.2.3": "SHA-512",
};
const ATTR_CONTENT_TYPE = "1.2.840.113549.1.9.3";
const ATTR_MESSAGE_DIGEST = "1.2.840.113549.1.9.4";
const ATTR_SIGNING_CERTIFICATE = "1.2.840.113549.1.9.16.2.12";
const ATTR_SIGNING_CERTIFICATE_V2 = "1.2.840.113549.1.9.16.2.47";
const SUBJECT_KEY_IDENTIFIER_OID = "2.5.29.14";

const equalBytes = (a: ArrayBuffer | Uint8Array, b: ArrayBuffer | Uint8Array) => Buffer.from(a instanceof Uint8Array ? a : new Uint8Array(a)).equals(Buffer.from(b instanceof Uint8Array ? b : new Uint8Array(b)));

/** ESS signing-certificate(-v2) attribute: the certHash of the first ESSCertID must match the signer certificate. */
function signingCertificateBound(attributes: pkijs.Attribute[], signerDer: Uint8Array): boolean {
  for (const attribute of attributes) {
    if (attribute.type !== ATTR_SIGNING_CERTIFICATE_V2 && attribute.type !== ATTR_SIGNING_CERTIFICATE) continue;
    const signingCertificate = attribute.values[0] as asn1js.Sequence;
    const certs = signingCertificate?.valueBlock.value[0] as asn1js.Sequence | undefined;
    const first = certs?.valueBlock.value[0] as asn1js.Sequence | undefined;
    if (!first) return false;
    const parts = first.valueBlock.value;
    let hashName = attribute.type === ATTR_SIGNING_CERTIFICATE ? "sha1" : "sha256";
    let index = 0;
    if (attribute.type === ATTR_SIGNING_CERTIFICATE_V2 && parts[0] instanceof asn1js.Sequence) {
      const oid = (parts[0].valueBlock.value[0] as asn1js.ObjectIdentifier).valueBlock.toString();
      const name = HASHES[oid];
      if (!name) return false;
      hashName = name.replace("-", "").toLowerCase();
      index = 1;
    }
    const certHash = parts[index];
    if (!(certHash instanceof asn1js.OctetString)) return false;
    return equalBytes(certHash.valueBlock.valueHexView, createHash(hashName).update(signerDer).digest());
  }
  return false;
}

/** RFC 5652 signer verification for a TimeStampToken, plus chain validation to the pinned anchors at genTime. */
async function verifySigner(signed: pkijs.SignedData, eContent: Uint8Array, trustedCerts: pkijs.Certificate[], genTime: Date):
  Promise<{ signer: pkijs.Certificate | null; detail: string[] }> {
  const detail: string[] = [];
  const crypto = pkijs.getCrypto(true);
  const signerInfo = signed.signerInfos[0];
  if (!signerInfo || signed.signerInfos.length !== 1) return { signer: null, detail: ["SIGNER_UNKNOWN"] };
  const certificates = (signed.certificates ?? []).filter((c): c is pkijs.Certificate => c instanceof pkijs.Certificate);
  const sid = signerInfo.sid;
  const signer = certificates.find((cert) => {
    if (sid instanceof pkijs.IssuerAndSerialNumber) return cert.issuer.isEqual(sid.issuer) && cert.serialNumber.isEqual(sid.serialNumber);
    const ski = cert.extensions?.find((e) => e.extnID === SUBJECT_KEY_IDENTIFIER_OID)?.parsedValue as asn1js.OctetString | undefined;
    return !!ski && sid instanceof asn1js.Primitive && equalBytes(ski.valueBlock.valueHexView, sid.valueBlock.valueHexView);
  }) ?? null;
  if (!signer) return { signer: null, detail: ["SIGNER_UNKNOWN"] };

  const hashName = HASHES[signerInfo.digestAlgorithm.algorithmId];
  if (!hashName) return { signer, detail: ["DIGEST_ALGORITHM_UNSUPPORTED"] };
  // RFC 5652 5.3: signed attributes MUST be present when the content type is not id-data.
  const attributes = signerInfo.signedAttrs?.attributes;
  if (!signerInfo.signedAttrs || !attributes) return { signer, detail: ["SIGNED_ATTRIBUTES_MISSING"] };
  const contentType = attributes.find((a) => a.type === ATTR_CONTENT_TYPE)?.values[0] as asn1js.ObjectIdentifier | undefined;
  if (contentType?.valueBlock.toString() !== TST_INFO_OID) detail.push("CONTENT_TYPE_ATTRIBUTE");
  const messageDigest = attributes.find((a) => a.type === ATTR_MESSAGE_DIGEST)?.values[0] as asn1js.OctetString | undefined;
  const digest = await crypto.digest(hashName, toArrayBuffer(eContent));
  if (!messageDigest || !equalBytes(messageDigest.valueBlock.valueHexView, digest)) detail.push("MESSAGE_DIGEST_MISMATCH");
  const signerDer = new Uint8Array(signer.toSchema().toBER(false));
  if (!signingCertificateBound(attributes, signerDer)) detail.push("SIGNING_CERTIFICATE_UNBOUND");

  const signedBytes = signerInfo.signedAttrs.encodedValue;
  const rsaEncryption = signerInfo.signatureAlgorithm.algorithmId === "1.2.840.113549.1.1.1";
  let signatureOk = false;
  try {
    signatureOk = rsaEncryption
      ? await crypto.verifyWithPublicKey(signedBytes, signerInfo.signature, signer.subjectPublicKeyInfo, signerInfo.signatureAlgorithm, hashName)
      : await crypto.verifyWithPublicKey(signedBytes, signerInfo.signature, signer.subjectPublicKeyInfo, signerInfo.signatureAlgorithm);
  } catch {
    signatureOk = false;
  }
  if (!signatureOk) detail.push("SIGNATURE_INVALID");

  try {
    const chain = await new pkijs.CertificateChainValidationEngine({ trustedCerts, certs: [signer, ...certificates.filter((c) => c !== signer)], checkDate: genTime }).verify();
    if (!chain.result) detail.push("CHAIN_UNTRUSTED");
  } catch {
    detail.push("CHAIN_UNTRUSTED");
  }
  return { signer, detail };
}

/** Verifies a TimeStampToken (a CMS ContentInfo, DER). */
export async function verifyTimestampToken(tokenDer: Uint8Array, expected: TokenExpectations): Promise<TimestampVerification> {
  ensureEngine();
  const detail: string[] = [];
  const fields: Partial<TimestampFields> = { tokenDerBase64: Buffer.from(tokenDer).toString("base64") };
  try {
    const contentInfo = new pkijs.ContentInfo({ schema: asn1js.fromBER(toArrayBuffer(tokenDer)).result });
    if (contentInfo.contentType !== SIGNED_DATA_OID) return { valid: false, fields, detail: ["TOKEN_CONTENT_TYPE"] };
    const signed = new pkijs.SignedData({ schema: contentInfo.content });
    if (signed.encapContentInfo.eContentType !== TST_INFO_OID || !signed.encapContentInfo.eContent) return { valid: false, fields, detail: ["TOKEN_ECONTENT_TYPE"] };
    const tstInfo = new pkijs.TSTInfo({ schema: asn1js.fromBER(toArrayBuffer(new Uint8Array(signed.encapContentInfo.eContent.getValue()))).result });

    fields.genTime = tstInfo.genTime.toISOString();
    fields.serialNumberHex = bytesToHex(tstInfo.serialNumber.valueBlock.valueHexView);
    fields.policyOid = tstInfo.policy;
    fields.hashAlgorithmOid = tstInfo.messageImprint.hashAlgorithm.algorithmId;
    fields.messageImprintHex = bytesToHex(tstInfo.messageImprint.hashedMessage.valueBlock.valueHexView);
    fields.nonceHex = tstInfo.nonce ? bytesToHex(tstInfo.nonce.valueBlock.valueHexView) : null;

    if (fields.hashAlgorithmOid !== SHA256_OID) detail.push("IMPRINT_ALGORITHM");
    if (fields.messageImprintHex !== expected.digestHex) detail.push("IMPRINT_MISMATCH");
    if (expected.nonceHex !== null && fields.nonceHex !== expected.nonceHex) detail.push("NONCE_MISMATCH");
    if (tstInfo.genTime.getTime() < Date.parse(expected.notBefore)) detail.push("GENTIME_BEFORE_SEAL");

    const trustedCerts = expected.trustAnchorsDer.map((der) => new pkijs.Certificate({ schema: asn1js.fromBER(toArrayBuffer(der)).result }));
    const verdict = await verifySigner(signed, new Uint8Array(signed.encapContentInfo.eContent.getValue()), trustedCerts, tstInfo.genTime);
    detail.push(...verdict.detail);
    const signer = verdict.signer;
    if (signer) {
      fields.tsaSubject = subjectOf(signer);
      fields.signerCertificateSha256 = createHash("sha256").update(new Uint8Array(signer.toSchema().toBER(false))).digest("hex");
      // RFC 3161 2.3: the TSA certificate carries id-kp-timeStamping as its only purpose, in a critical extension.
      const ekuExtension = signer.extensions?.find((e) => e.extnID === EXT_KEY_USAGE_OID);
      const eku = ekuExtension?.parsedValue as pkijs.ExtKeyUsage | undefined;
      if (!ekuExtension?.critical || !eku?.keyPurposes.includes(EKU_TIME_STAMPING_OID)) detail.push("EKU_MISSING");
    }
  } catch {
    return { valid: false, fields, detail: ["PARSE_ERROR"] };
  }
  if (detail.length > 0) return { valid: false, fields, detail: [...new Set(detail)].sort() };
  return { valid: true, fields: fields as TimestampFields, detail: [] };
}

/** Verifies a TimeStampResp (DER) and extracts its token. */
export async function verifyTimestampResponse(responseDer: Uint8Array, expected: TokenExpectations): Promise<TimestampVerification> {
  ensureEngine();
  let token: Uint8Array;
  try {
    const response = new pkijs.TimeStampResp({ schema: asn1js.fromBER(toArrayBuffer(responseDer)).result });
    const status = response.status.status;
    if ((status !== pkijs.PKIStatus.granted && status !== pkijs.PKIStatus.grantedWithMods) || !response.timeStampToken) {
      return { valid: false, fields: {}, detail: ["TSA_STATUS_REJECTED"] };
    }
    token = new Uint8Array(response.timeStampToken.toSchema().toBER(false));
  } catch {
    return { valid: false, fields: {}, detail: ["PARSE_ERROR"] };
  }
  return verifyTimestampToken(token, expected);
}

export function pemToDer(pem: string): Uint8Array {
  return Uint8Array.from(Buffer.from(pem.replace(/-----(BEGIN|END) CERTIFICATE-----/g, "").replace(/\s+/g, ""), "base64"));
}
