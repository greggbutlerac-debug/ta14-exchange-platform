# TA-14 Exchange Corpus — Archival Ingestion Contract (Draft)

Status: **DESIGN ONLY — no PDF files have been mirrored, no production ingestion has run.**

## Purpose

Make the Exchange an independently usable, provenance-preserving reference library for the 47 Zenodo dashboard records. The registry at `docs/corpus/zenodo-publication-registry.md` is the starting metadata inventory, not an authoritative record of the original bytes.

## Required per-publication manifest

```json
{
  "local_id": "ASA",
  "source": "zenodo",
  "zenodo_record_id": "23199253",
  "doi": "10.5281/zenodo.23199253",
  "concept_doi": "10.5281/zenodo.23199252",
  "exact_title": "TA14 Admissible Standing Architecture (ASA) v1.0-RC1",
  "version": "v1.0",
  "published_at": "2026-10-07",
  "author": "Butler, Greggory Don",
  "source_access": "open",
  "license": "CC-BY-4.0",
  "mirror_permission": "pending-review",
  "files": [],
  "verification": {
    "source_metadata_checked_at": null,
    "bytes_verified_at": null,
    "verification_status": "not-ingested"
  },
  "implementation_status": "not-assessed"
}
```

This is an **illustrative ASA record**, not an assertion that the PDF has been fetched or checked. The Zenodo concept DOI was supplied by the founder; check it against the live record during ingestion.

For each file, add `filename`, `size_bytes`, `source_url`, `sha256`, `source_checksum_algorithm`, `source_checksum`, `storage_key`, and `verified` only after acquiring and validating the actual bytes. Never invent missing hashes.

## Security and publication rules

1. **Restricted means restricted.** Do not download restricted files by circumventing access controls, or put them in `public/`, Git history, frontend bundles, open search indexes, or a publicly readable bucket.
2. An owner-authenticated retrieval path may be used only with explicit authorization and an appropriately private destination. A Zenodo metadata listing does not grant permission to mirror restricted file bytes.
3. Open-access files still require license and source-file verification. Preserve attribution, source DOI, original filename, and exact bytes.
4. Store binary files in access-controlled object storage, not in the source repository. Use immutable versioned object keys and content hashes; keep metadata and indexes separately.
5. The frontend must query an access-filtered server API. No unauthorized record text, snippets, embeddings, or download URLs may leak to public clients.
6. The Exchange may display publication metadata and outbound DOI links while a local file is unavailable; label such records `metadata-only`.
7. Do not call a record `locally archived` until its original file exists in Exchange storage and its digest is verified.
8. Do not claim an architecture is executable, conformance-tested, or production validated based on a Zenodo publication.

## Proposed ingestion state machine

`metadata-only → metadata-verified → permission-cleared → bytes-acquired → hash-verified → privately-stored → access-reviewed → exchange-available`

Any failed hash or access review returns the record to a non-downloadable state. Do not silently advance states.

## Proposed Exchange experience

- Public landing page: searchable title, domain, DOI, publication date, abstract and source access.
- Detail page: citation, source provenance, version relationships, dependency map, and availability status.
- Download/read button: only if the file has been locally archived and the requesting identity is authorized.
- Institution-only admin view: missing DOI list, ingest queue, checksum exceptions, access-review queue, and drift/version updates.
- Clear distinction between `publication`, `architecture`, `reference implementation`, and `production system`.

## Acceptance gates before merge/deploy

- All 47 records mapped to exact Zenodo record IDs and version DOIs, or explicitly flagged unresolved.
- Every mirrored file has independently checked byte hash, license, permission, and storage access policy.
- Public and restricted access tests (including search-result leakage and direct object URL checks) pass.
- Search/index behavior tested without treating restricted content as public.
- No build-time secrets or production credentials committed.
- Explicit founder approval to merge and publish.
