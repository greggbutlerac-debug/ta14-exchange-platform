"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  type TA14LinkId,
} from "@/lib/academy/ta14-24-link-canon";
import {
  readTA14ProvenanceLinkPrefill,
} from "@/lib/academy/ta14-provenance-intake-link-prefill";
import {
  createEmptyTA14ProvenanceSourceDraft,
  createTA14ProvenanceRelationship,
  provenanceRelationTypeLabel,
  provenanceSourceTypeLabel,
  TA14_PROVENANCE_RELATION_TYPES,
  TA14_PROVENANCE_SOURCE_TYPES,
  validateTA14ProvenanceSubmission,
  type TA14ProvenanceLinkDraft,
  type TA14ProvenanceSourceDraft,
} from "@/lib/academy/ta14-provenance-types";
import { persistTA14ProvenanceSubmission } from "@/lib/academy/ta14-provenance-persistence";

export default function TA14ProvenanceIntakePage() {
  return (
    <Suspense fallback={<ProvenanceIntakeLoading />}>
      <TA14ProvenanceIntakePageContent />
    </Suspense>
  );
}

function TA14ProvenanceIntakePageContent() {
  const searchParams = useSearchParams();

  const [source, setSource] = useState<TA14ProvenanceSourceDraft>(
    createEmptyTA14ProvenanceSourceDraft(),
  );
  const [relationships, setRelationships] = useState<
    TA14ProvenanceLinkDraft[]
  >([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [savedSourceId, setSavedSourceId] = useState<string | null>(null);

  const requestedLink = useMemo(
    () =>
      readTA14ProvenanceLinkPrefill(
        searchParams.get("link"),
      ),
    [searchParams],
  );

  useEffect(() => {
    if (!requestedLink) {
      return;
    }

    setRelationships((current) => {
      if (
        current.some(
          (relationship) =>
            relationship.linkId === requestedLink,
        )
      ) {
        return current;
      }

      return [
        ...current,
        createTA14ProvenanceRelationship(requestedLink),
      ];
    });
  }, [requestedLink]);

  const errors = useMemo(
    () => validateTA14ProvenanceSubmission({ source, relationships }),
    [source, relationships],
  );

  function updateSource<K extends keyof TA14ProvenanceSourceDraft>(
    key: K,
    value: TA14ProvenanceSourceDraft[K],
  ) {
    setSource((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleLink(linkId: TA14LinkId) {
    setRelationships((current) => {
      const exists = current.some(
        (relationship) => relationship.linkId === linkId,
      );

      if (exists) {
        return current.filter(
          (relationship) => relationship.linkId !== linkId,
        );
      }

      return [
        ...current,
        createTA14ProvenanceRelationship(linkId),
      ];
    });
  }

  function updateRelationship(
    linkId: TA14LinkId,
    patch: Partial<TA14ProvenanceLinkDraft>,
  ) {
    setRelationships((current) =>
      current.map((relationship) =>
        relationship.linkId === linkId
          ? { ...relationship, ...patch }
          : relationship,
      ),
    );
  }

  async function submit() {
    if (errors.length > 0 || saving) {
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const result = await persistTA14ProvenanceSubmission({
        source,
        relationships,
      });

      setSavedSourceId(result.source.id);
      setMessage(
        `Saved ${result.source.title} with ${result.relationships.length} bounded TA-14 link relationship${result.relationships.length === 1 ? "" : "s"}.`,
      );
    } catch (caught) {
      setMessage(
        caught instanceof Error
          ? caught.message
          : "Unable to save provenance source.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/academy/24-link-architecture/provenance"
              className="text-sm font-semibold text-sky-300"
            >
              ← Provenance Map
            </Link>

            <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1 text-xs font-semibold text-amber-200">
              Administrative intake
            </span>
          </div>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300">
            TA-14 Canonical Registry
          </p>

          <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Register architecture provenance without overstating it.
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Enter a patent application, patent, publication, book, article,
            artifact, review, or other public record once, then declare the
            exact relationship that source has to each applicable TA-14 link.
          </p>

          {requestedLink ? (
            <div className="mt-8 inline-flex rounded-2xl border border-indigo-300/25 bg-indigo-300/[0.06] px-4 py-3">
              <p className="text-sm text-indigo-100">
                Prefilled from{" "}
                <strong>
                  {requestedLink}
                </strong>
                {" · "}
                {
                  TA14_24_LINKS.find(
                    (link) => link.linkId === requestedLink,
                  )?.canonicalName
                }
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="space-y-6">
          <Panel title="1. Source identity">
            <Field label="Source type">
              <select
                value={source.sourceType}
                onChange={(event) =>
                  updateSource(
                    "sourceType",
                    event.target
                      .value as TA14ProvenanceSourceDraft["sourceType"],
                  )
                }
                className={inputClass}
              >
                {TA14_PROVENANCE_SOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {provenanceSourceTypeLabel(type)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Title">
              <input
                value={source.title}
                onChange={(event) =>
                  updateSource("title", event.target.value)
                }
                className={inputClass}
                placeholder="Exact public title"
              />
            </Field>

            <Field label="Identifier">
              <input
                value={source.sourceIdentifier}
                onChange={(event) =>
                  updateSource(
                    "sourceIdentifier",
                    event.target.value,
                  )
                }
                className={inputClass}
                placeholder="Application, publication, patent, DOI, artifact, or record ID"
              />
            </Field>

            <Field label="Public URL">
              <input
                value={source.sourceUrl}
                onChange={(event) =>
                  updateSource("sourceUrl", event.target.value)
                }
                className={inputClass}
                placeholder="https://..."
              />
            </Field>
          </Panel>

          <Panel title="2. Dates and legal/public status">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Publication date">
                <input
                  type="date"
                  value={source.publicationDate}
                  onChange={(event) =>
                    updateSource(
                      "publicationDate",
                      event.target.value,
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Filing date">
                <input
                  type="date"
                  value={source.filingDate}
                  onChange={(event) =>
                    updateSource("filingDate", event.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Priority date">
                <input
                  type="date"
                  value={source.priorityDate}
                  onChange={(event) =>
                    updateSource("priorityDate", event.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Jurisdiction">
                <input
                  value={source.jurisdiction}
                  onChange={(event) =>
                    updateSource(
                      "jurisdiction",
                      event.target.value,
                    )
                  }
                  className={inputClass}
                  placeholder="US, PCT, etc."
                />
              </Field>
            </div>

            <Field label="Status">
              <input
                value={source.status}
                onChange={(event) =>
                  updateSource("status", event.target.value)
                }
                className={inputClass}
                placeholder="Filed, pending, published, granted, public..."
              />
            </Field>

            <Field label="Version">
              <input
                value={source.versionLabel}
                onChange={(event) =>
                  updateSource("versionLabel", event.target.value)
                }
                className={inputClass}
                placeholder="Optional version label"
              />
            </Field>
          </Panel>

          <Panel title="3. Public explanation">
            <Field label="Public summary">
              <textarea
                value={source.publicSummary}
                onChange={(event) =>
                  updateSource(
                    "publicSummary",
                    event.target.value,
                  )
                }
                className={`${inputClass} min-h-28`}
                placeholder="What this source publicly establishes."
              />
            </Field>

            <Field label="Provenance role">
              <textarea
                value={source.provenanceRole}
                onChange={(event) =>
                  updateSource(
                    "provenanceRole",
                    event.target.value,
                  )
                }
                className={`${inputClass} min-h-24`}
                placeholder="Why this source matters to TA-14 chronology, patent position, implementation, or review."
              />
            </Field>
          </Panel>
        </section>

        <section className="space-y-6">
          <Panel title="4. Select applicable TA-14 links">
            <p className="text-sm leading-6 text-slate-400">
              Select only links for which you can state a bounded,
              source-grounded relationship.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {TA14_24_LINKS.map((link) => {
                const selected = relationships.some(
                  (relationship) =>
                    relationship.linkId === link.linkId,
                );

                return (
                  <button
                    key={link.linkId}
                    type="button"
                    onClick={() => toggleLink(link.linkId)}
                    className={[
                      "rounded-2xl border p-4 text-left transition",
                      selected
                        ? "border-indigo-300/45 bg-indigo-300/[0.09]"
                        : "border-white/10 bg-white/[0.025] hover:border-white/20",
                    ].join(" ")}
                  >
                    <span className="text-xs font-semibold text-sky-300">
                      {String(link.order).padStart(2, "0")}
                    </span>
                    <p className="mt-2 text-sm font-semibold">
                      {link.canonicalName}
                    </p>
                  </button>
                );
              })}
            </div>
          </Panel>

          {relationships.length > 0 ? (
            <Panel title="5. Bound each relationship">
              <div className="space-y-5">
                {relationships
                  .slice()
                  .sort((a, b) => a.linkId.localeCompare(b.linkId))
                  .map((relationship) => {
                    const canonical = TA14_24_LINKS.find(
                      (link) =>
                        link.linkId === relationship.linkId,
                    );

                    return (
                      <article
                        key={relationship.linkId}
                        className="rounded-2xl border border-white/10 bg-black/15 p-5"
                      >
                        <p className="text-xs font-semibold text-sky-300">
                          Link {String(canonical?.order ?? 0).padStart(2, "0")}
                        </p>
                        <h3 className="mt-1 font-semibold">
                          {canonical?.canonicalName}
                        </h3>

                        <div className="mt-4 grid gap-4">
                          <Field label="Relationship type">
                            <select
                              value={relationship.relationType}
                              onChange={(event) =>
                                updateRelationship(
                                  relationship.linkId,
                                  {
                                    relationType:
                                      event.target
                                        .value as TA14ProvenanceLinkDraft["relationType"],
                                  },
                                )
                              }
                              className={inputClass}
                            >
                              {TA14_PROVENANCE_RELATION_TYPES.map(
                                (type) => (
                                  <option key={type} value={type}>
                                    {provenanceRelationTypeLabel(type)}
                                  </option>
                                ),
                              )}
                            </select>
                          </Field>

                          <Field label="Bounded relationship statement">
                            <textarea
                              value={relationship.relationSummary}
                              onChange={(event) =>
                                updateRelationship(
                                  relationship.linkId,
                                  {
                                    relationSummary:
                                      event.target.value,
                                  },
                                )
                              }
                              className={`${inputClass} min-h-24`}
                              placeholder="State exactly what this source establishes for this link—and no more."
                            />
                          </Field>

                          <div className="flex flex-wrap gap-5 text-sm text-slate-300">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={
                                  relationship.isPrimaryProvenance
                                }
                                onChange={(event) =>
                                  updateRelationship(
                                    relationship.linkId,
                                    {
                                      isPrimaryProvenance:
                                        event.target.checked,
                                    },
                                  )
                                }
                              />
                              Primary provenance
                            </label>

                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={
                                  relationship.publicVisibility
                                }
                                onChange={(event) =>
                                  updateRelationship(
                                    relationship.linkId,
                                    {
                                      publicVisibility:
                                        event.target.checked,
                                    },
                                  )
                                }
                              />
                              Publicly visible
                            </label>
                          </div>
                        </div>
                      </article>
                    );
                  })}
              </div>
            </Panel>
          ) : null}

          <Panel title="6. Validate and register">
            {errors.length > 0 ? (
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-4">
                <p className="text-sm font-semibold text-amber-200">
                  Intake is not ready yet.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {errors.map((error) => (
                    <li key={error}>• {error}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.05] p-4">
                <p className="text-sm font-semibold text-emerald-200">
                  Source is structurally ready for registration.
                </p>
              </div>
            )}

            {message ? (
              <p className="mt-4 text-sm leading-6 text-slate-300">
                {message}
              </p>
            ) : null}

            {savedSourceId ? (
              <p className="mt-2 text-xs text-slate-500">
                Source record: {savedSourceId}
              </p>
            ) : null}

            <button
              type="button"
              disabled={errors.length > 0 || saving}
              onClick={() => void submit()}
              className="mt-5 w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition enabled:hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving
                ? "Registering provenance…"
                : "Register canonical source"}
            </button>
          </Panel>
        </section>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/40";

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}


function ProvenanceIntakeLoading() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300">
            TA-14 Canonical Registry
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Loading provenance intake…
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Preparing the bounded TA-14 link relationship state.
          </p>
        </div>
      </section>
    </main>
  );
}
