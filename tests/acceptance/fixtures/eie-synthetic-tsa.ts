/*
 * SYNTHETIC RFC 3161 Time-Stamp Authority for tests only. It builds a throwaway CA, a TSA certificate
 * (EKU id-kp-timeStamping, critical) and real DER TimeStampResp messages with pkijs, so the verifier is
 * exercised against standards-conformant tokens without any network TSA. Never a real trust anchor.
 */
import { createHash, webcrypto } from "node:crypto";
import * as asn1js from "asn1js";
import * as pkijs from "pkijs";
import { EKU_TIME_STAMPING_OID, type TsaTransport } from "../../../packages/domain/eie";

pkijs.setEngine("ta14-test-webcrypto", new pkijs.CryptoEngine({ name: "ta14-test-webcrypto", crypto: webcrypto as unknown as Crypto }));

const RSA = { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" };
const TST_INFO_OID = "1.2.840.113549.1.9.16.1.4";
const SIGNED_DATA_OID = "1.2.840.113549.1.7.2";
const ab = (u: Uint8Array) => u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength) as ArrayBuffer;

function name(cn: string) {
  return new pkijs.RelativeDistinguishedNames({ typesAndValues: [new pkijs.AttributeTypeAndValue({ type: "2.5.4.3", value: new asn1js.PrintableString({ value: cn }) })] });
}

async function certificate(args: { cn: string; issuerCn: string; serial: number; publicKey: CryptoKey; signingKey: CryptoKey; ca: boolean; eku: string[] | null; ekuCritical?: boolean }) {
  const cert = new pkijs.Certificate();
  cert.version = 2;
  cert.serialNumber = new asn1js.Integer({ value: args.serial });
  cert.issuer = name(args.issuerCn);
  cert.subject = name(args.cn);
  cert.notBefore.value = new Date("2026-01-01T00:00:00Z");
  cert.notAfter.value = new Date("2031-01-01T00:00:00Z");
  cert.extensions = [
    new pkijs.Extension({ extnID: "2.5.29.19", critical: true, extnValue: new pkijs.BasicConstraints({ cA: args.ca }).toSchema().toBER(false) }),
  ];
  if (args.eku) {
    cert.extensions.push(new pkijs.Extension({ extnID: "2.5.29.37", critical: args.ekuCritical ?? true, extnValue: new pkijs.ExtKeyUsage({ keyPurposes: args.eku }).toSchema().toBER(false) }));
  }
  await cert.subjectPublicKeyInfo.importKey(args.publicKey);
  await cert.sign(args.signingKey, "SHA-256");
  return cert;
}

const toPem = (cert: pkijs.Certificate) =>
  `-----BEGIN CERTIFICATE-----\n${Buffer.from(cert.toSchema().toBER(false)).toString("base64").match(/.{1,64}/g)!.join("\n")}\n-----END CERTIFICATE-----\n`;

export interface SyntheticTsa {
  url: string;
  trustAnchorPem: string;
  /** Answers a TimeStampReq with a signed TimeStampResp stamped at the given time. */
  respond(queryDer: Uint8Array, genTime: Date, options?: { tamperImprint?: boolean; dropNonce?: boolean; reject?: boolean; omitSigningCertificate?: boolean }): Promise<Uint8Array>;
  transport(genTime: () => Date, options?: Parameters<SyntheticTsa["respond"]>[2]): TsaTransport;
}

export async function createSyntheticTsa(options: { eku?: boolean; ekuCritical?: boolean; label?: string } = {}): Promise<SyntheticTsa> {
  const label = options.label ?? "SYNTHETIC";
  const caKeys = await webcrypto.subtle.generateKey(RSA, true, ["sign", "verify"]) as CryptoKeyPair;
  const tsaKeys = await webcrypto.subtle.generateKey(RSA, true, ["sign", "verify"]) as CryptoKeyPair;
  const ca = await certificate({ cn: `${label} TEST ROOT - NOT A TRUST ANCHOR`, issuerCn: `${label} TEST ROOT - NOT A TRUST ANCHOR`, serial: 1, publicKey: caKeys.publicKey, signingKey: caKeys.privateKey, ca: true, eku: null });
  const tsaCert = await certificate({
    cn: `${label} TEST TSA`, issuerCn: `${label} TEST ROOT - NOT A TRUST ANCHOR`, serial: 2, publicKey: tsaKeys.publicKey, signingKey: caKeys.privateKey,
    ca: false, eku: options.eku === false ? ["1.3.6.1.5.5.7.3.1"] : [EKU_TIME_STAMPING_OID], ekuCritical: options.ekuCritical,
  });
  let serial = 1000;
  // ESS signing-certificate-v2 (RFC 5035), default SHA-256: binds the signer certificate into the signed attributes.
  const tsaCertHash = createHash("sha256").update(new Uint8Array(tsaCert.toSchema().toBER(false))).digest();
  const signingCertificateV2 = new pkijs.Attribute({
    type: "1.2.840.113549.1.9.16.2.47",
    values: [new asn1js.Sequence({ value: [new asn1js.Sequence({ value: [new asn1js.Sequence({ value: [new asn1js.OctetString({ valueHex: ab(new Uint8Array(tsaCertHash)) })] })] })] })],
  });

  async function respond(queryDer: Uint8Array, genTime: Date, opts: { tamperImprint?: boolean; dropNonce?: boolean; reject?: boolean; omitSigningCertificate?: boolean } = {}) {
    if (opts.reject) {
      return new Uint8Array(new pkijs.TimeStampResp({ status: new pkijs.PKIStatusInfo({ status: pkijs.PKIStatus.rejection }) }).toSchema().toBER(false));
    }
    const request = new pkijs.TimeStampReq({ schema: asn1js.fromBER(ab(queryDer)).result });
    const imprint = new Uint8Array(request.messageImprint.hashedMessage.valueBlock.valueHexView);
    if (opts.tamperImprint) imprint[0] ^= 0xff;
    const tstInfo = new pkijs.TSTInfo({
      version: 1,
      policy: "1.3.6.1.4.1.99999.1.1",
      messageImprint: new pkijs.MessageImprint({ hashAlgorithm: request.messageImprint.hashAlgorithm, hashedMessage: new asn1js.OctetString({ valueHex: ab(imprint) }) }),
      serialNumber: new asn1js.Integer({ value: serial++ }),
      genTime,
      ...(request.nonce && !opts.dropNonce ? { nonce: request.nonce } : {}),
    });
    const eContent = new Uint8Array(tstInfo.toSchema().toBER(false));
    const digest = createHash("sha256").update(eContent).digest();
    const signed = new pkijs.SignedData({
      version: 3,
      encapContentInfo: new pkijs.EncapsulatedContentInfo({ eContentType: TST_INFO_OID, eContent: new asn1js.OctetString({ valueHex: ab(eContent) }) }),
      signerInfos: [new pkijs.SignerInfo({
        version: 1,
        sid: new pkijs.IssuerAndSerialNumber({ issuer: tsaCert.issuer, serialNumber: tsaCert.serialNumber }),
        signedAttrs: new pkijs.SignedAndUnsignedAttributes({
          type: 0,
          attributes: [
            new pkijs.Attribute({ type: "1.2.840.113549.1.9.3", values: [new asn1js.ObjectIdentifier({ value: TST_INFO_OID })] }),
            new pkijs.Attribute({ type: "1.2.840.113549.1.9.4", values: [new asn1js.OctetString({ valueHex: ab(new Uint8Array(digest)) })] }),
            ...(opts.omitSigningCertificate ? [] : [signingCertificateV2]),
          ],
        }),
      })],
      certificates: [tsaCert, ca],
    });
    await signed.sign(tsaKeys.privateKey, 0, "SHA-256", ab(eContent));
    const token = new pkijs.ContentInfo({ contentType: SIGNED_DATA_OID, content: signed.toSchema(true) });
    return new Uint8Array(new pkijs.TimeStampResp({ status: new pkijs.PKIStatusInfo({ status: pkijs.PKIStatus.granted }), timeStampToken: token }).toSchema().toBER(false));
  }

  const url = `https://tsa.synthetic.invalid/${label.toLowerCase()}`;
  return {
    url,
    trustAnchorPem: toPem(ca),
    respond,
    transport: (genTime, opts) => ({ url, request: (query) => respond(query, genTime(), opts) }),
  };
}
