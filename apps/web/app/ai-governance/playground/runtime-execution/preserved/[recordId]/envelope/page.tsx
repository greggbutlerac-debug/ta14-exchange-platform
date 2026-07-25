"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  exportPreservedRuntimeRecordEnvelopeById,
  getPreservedRuntimeRecordEnvelope,
  verifyStoredPreservedRuntimeRecordEnvelope,
  type PreservedRuntimeEnvelopeVerification,
  type PreservedRuntimeRecordEnvelope,
} from "../../../../../../../lib/governance-playgrounds";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "long",
  }).format(date);
}

function downloadJson(filename: string, contents: string): void {
  const blob = new Blob([contents], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export default function RuntimePreservedRecordEnvelopePage() {
  const params = useParams<{ recordId: string }>();
  const recordId = decodeURIComponent(params.recordId);

  const [envelope, setEnvelope] =
    useState<PreservedRuntimeRecordEnvelope | null | undefined>(
      undefined,
    );
  const [verification, setVerification] =
    useState<PreservedRuntimeEnvelopeVerification | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedEnvelope =
      getPreservedRuntimeRecordEnvelope(recordId) ?? null;

    setEnvelope(storedEnvelope);
    setVerification(null);
    setVerificationError("");
    setCopied(false);
  }, [recordId]);

  async function handleVerify(): Promise<void> {
    if (!envelope) {
      return;
    }

    setVerifying(true);
    setVerificationError("");

    try {
      const result =
        await verifyStoredPreservedRuntimeRecordEnvelope(
          envelope.record.recordId,
        );

      setVerification(result);
    } catch (error) {
      setVerification(null);
      setVerificationError(
        error instanceof Error
          ? error.message
          : "The integrity envelope could not be verified.",
      );
    } finally {
      setVerifying(false);
    }
  }

  function handleExport(): void {
    if (!envelope) {
      return;
    }

    downloadJson(
      `${envelope.record.recordId}-integrity-envelope.json`,
      exportPreservedRuntimeRecordEnvelopeById(
        envelope.record.recordId,
      ),
    );
  }

  async function handleCopyDigest(): Promise<void> {
    if (!envelope) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        envelope.integrity.digest,
      );
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setVerificationError(
        "The SHA-256 digest could not be copied automatically.",
      );
    }
  }

  if (envelope === undefined) {
    return (
      <main className="min-h-screen bg-[#03060b] px-5 py-12 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.035] p-8">
          <p className="text-sm text-white/60">
            Loading preserved-record integrity envelope…
          </p>
        </div>
      </main>
    );
  }

  if (envelope === null) {
    return (
      <main className="min-h-screen bg-[#03060b] px-5 py-12 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.035] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200/70">
            Envelope unavailable
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            Integrity envelope not found
          </h1>

          <p className="mt-4 break-all font-mono text-sm text-white/50">
            {recordId}
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60">
            A preserved record may exist without a corresponding local
            integrity envelope if the record was created before envelope
            storage was introduced, imported without its envelope, or stored
            in a different browser.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                recordId,
              )}`}
              className="inline-flex rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
            >
              Return to preserved record
            </Link>

            <Link
              href="/ai-governance/playground/runtime-execution/preserved"
              className="inline-flex rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
            >
              View preserved records
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const metadataEntries = Object.entries(envelope.metadata);

  return (
    <main className="min-h-screen bg-[#03060b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
              envelope.record.recordId,
            )}`}
            className="text-sm font-semibold text-sky-200/80 transition hover:text-sky-100"
          >
            ← Preserved record
          </Link>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleCopyDigest()}
              className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
            >
              {copied ? "Digest Copied" : "Copy SHA-256 Digest"}
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
            >
              Export Envelope JSON
            </button>
          </div>
        </div>

        <header className="mt-5 rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
              Integrity Envelope
            </span>

            <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-200">
              {envelope.integrity.algorithm}
            </span>

            {verification ? (
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                  verification.envelopeValid
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                    : "border-rose-400/30 bg-rose-400/10 text-rose-200"
                }`}
              >
                {verification.envelopeValid
                  ? "Envelope Verified"
                  : "Verification Failed"}
              </span>
            ) : (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
                Verification Pending
              </span>
            )}
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Preserved Record Integrity Envelope
          </h1>

          <p className="mt-3 break-all font-mono text-xs text-white/45">
            {envelope.record.recordId}
          </p>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/65">
            This envelope binds the preserved Runtime governed record to a
            SHA-256 digest calculated from its canonicalized content.
            Verification recomputes the digest and checks the preserved
            record&apos;s structural and preservation validity. It does not
            establish real-world execution, certification, or regulatory
            compliance.
          </p>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Envelope created
            </p>
            <p className="mt-3 text-sm leading-6 text-white/80">
              {formatDate(envelope.createdAt)}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Canonicalized
            </p>
            <p className="mt-3 text-sm leading-6 text-white/80">
              {formatDate(envelope.integrity.canonicalizedAt)}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Envelope schema
            </p>
            <p className="mt-3 font-mono text-sm text-white/80">
              {envelope.envelopeSchemaVersion}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Record schema
            </p>
            <p className="mt-3 font-mono text-sm text-white/80">
              {envelope.integrity.schemaVersion}
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                SHA-256 content digest
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Recomputed during verification from the canonicalized
                preserved-record content.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void handleVerify()}
              disabled={verifying}
              className="rounded-xl border border-sky-300/30 bg-sky-300/10 px-5 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-200/50 hover:bg-sky-300/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {verifying ? "Verifying…" : "Verify Envelope"}
            </button>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="min-w-[48rem] break-all font-mono text-sm leading-7 text-emerald-200/85">
              {envelope.integrity.digest}
            </p>
          </div>

          {verificationError ? (
            <div className="mt-5 rounded-xl border border-rose-400/25 bg-rose-400/[0.08] p-4 text-sm leading-6 text-rose-100/85">
              {verificationError}
            </div>
          ) : null}

          {verification ? (
            <div
              className={`mt-5 rounded-2xl border p-5 ${
                verification.envelopeValid
                  ? "border-emerald-400/25 bg-emerald-400/[0.08]"
                  : "border-rose-400/25 bg-rose-400/[0.08]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p
                  className={`text-sm font-semibold ${
                    verification.envelopeValid
                      ? "text-emerald-100"
                      : "text-rose-100"
                  }`}
                >
                  {verification.envelopeValid
                    ? "The envelope passed all verification checks."
                    : "The envelope did not pass all verification checks."}
                </p>

                <p className="text-xs text-white/50">
                  Verified {formatDate(verification.verifiedAt)}
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                    Integrity
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white/80">
                    {verification.integrityValid
                      ? "Valid"
                      : "Invalid"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                    Structure
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white/80">
                    {verification.recordVerification.structurallyValid
                      ? "Valid"
                      : "Invalid"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                    Preservation
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white/80">
                    {verification.recordVerification.preservationValid
                      ? "Valid"
                      : "Invalid"}
                  </p>
                </div>
              </div>

              {verification.reasons.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {verification.reasons.map((reason) => (
                    <li
                      key={reason}
                      className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/65"
                    >
                      {reason}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-lg font-semibold">
              Envelope identity
            </h2>

            <dl className="mt-5 space-y-4 font-mono text-xs text-white/60">
              <div>
                <dt className="text-white/35">Record ID</dt>
                <dd className="mt-1 break-all">
                  {envelope.integrity.recordId}
                </dd>
              </div>

              <div>
                <dt className="text-white/35">Hash algorithm</dt>
                <dd className="mt-1">
                  {envelope.integrity.algorithm}
                </dd>
              </div>

              <div>
                <dt className="text-white/35">
                  Envelope schema version
                </dt>
                <dd className="mt-1">
                  {envelope.envelopeSchemaVersion}
                </dd>
              </div>

              <div>
                <dt className="text-white/35">
                  Preserved record status
                </dt>
                <dd className="mt-1">
                  {envelope.record.status}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-lg font-semibold">
              Envelope metadata
            </h2>

            {metadataEntries.length > 0 ? (
              <dl className="mt-5 space-y-4">
                {metadataEntries.map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs uppercase tracking-[0.16em] text-white/40">
                      {key}
                    </dt>
                    <dd className="mt-2 break-words font-mono text-xs leading-6 text-white/65">
                      {typeof value === "string"
                        ? value
                        : JSON.stringify(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-sm leading-6 text-white/55">
                No additional envelope metadata was preserved.
              </p>
            )}
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-lg font-semibold">
            Integrity boundary
          </h2>

          <p className="mt-4 max-w-5xl text-sm leading-7 text-white/65">
            A valid digest proves that the locally stored preserved record
            currently matches the canonical content from which this envelope
            was generated. It does not prove that every source assertion was
            true, that an external event occurred, that execution was lawful,
            or that the record satisfies a certification or regulatory
            obligation.
          </p>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
              envelope.record.recordId,
            )}`}
            className="rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
          >
            Open preserved record
          </Link>

          <Link
            href="/ai-governance/playground/runtime-execution/preserved"
            className="rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
          >
            View preserved records
          </Link>
        </div>
      </div>
    </main>
  );
}
