# Legacy migration version collision: audit and remediation plan (D6)

Status: **AUDIT / PLAN ONLY.** No migration file is renamed or edited, and no
remote migration history is read or changed.
Scope: `supabase/migrations/` on `main` at `a82c54d5`.
Origin: found while building isolated local verification for PR #704 (HPR field
evidence). This issue is separate from #704. The default HPR-only validation does
not depend on it.

## 1. Finding

The Supabase CLI identifies each migration by the numeric prefix of its
filename (the *version*). It records that version as the primary key of
`supabase_migrations.schema_migrations`, so every version must be unique.

Of the 76 migration files on `main`:

* 49 use 14-digit `YYYYMMDDHHMMSS` versions. All are unique.
* 27 use **8-digit, date-only** `YYYYMMDD` versions. 22 of these share just
  **5 versions**:

| Version | Files | Commit-order position (alphabetical position) |
|---|---|---|
| `20260721` | 2 | matches alphabetical order |
| `20260722` | 6 | **differs** |
| `20260808` | 3 | **differs** |
| `20260809` | 8 | **differs** |
| `20260810` | 3 | **differs** |

The other five date-only files (`20260719`, `20260724`, `20260725`, `20260726`
and `20260818`) are unique, so they are not colliding.

### Files, in the order they were first committed to the repository

Commit order is derived read-only from `git log --diff-filter=A`. It is the best
available evidence of the order the migrations were written in. It is **not**
evidence of the order they were applied to any database.

```
20260721  1 create_partner_review_network_applications
          2 create_partner_review_network_private_storage
20260722  1 ta14_ai_governance_registry_foundation
          2 ta14_registry_sources_and_foundational_record
          3 ta14_registry_evidence_storage
          4 ta14_registry_reviewer_decisions
          5 ta14_registry_public_directory
          6 ta14_registry_finalization
20260808  1 ta14_registry_public_projection_fidelity
          2 ta14_registry_public_claim_projection
          3 ta14_registry_version_series_foundation
20260809  1 ta14_registry_admin_notification_deliveries
          2 ta14_24_link_academy_foundation
          3 ta14_24_link_canonical_registry
          4 ta14_provenance_public_sources
          5 ta14_provenance_admin_write_policies
          6 ta14_patent_portfolio_32_sources
          7 ta14_patent_portfolio_bounded_24_link_mappings
          8 ta14_chain_of_eight_origin_provenance
20260810  1 harmonic_single_governance_identity_correction
          2 governance_life_history_foundation
          3 governance_life_history_append_bridge
```

## 2. Consequences

1. **A from-scratch apply cannot succeed.** `supabase start`, `supabase db reset`
   and a new preview or branch database all hit the duplicate versions.
2. **Alphabetical order is not safe.** A static scan found real forward
   references when the files are sorted alphabetically within a version:
   * `20260810_governance_life_history_append_bridge` references
     `ta14_governance_life_history_events`, which is created by
     `20260810_governance_life_history_foundation`. That file sorts later.
   * `20260722_ta14_registry_finalization` references
     `ta14_registry_public_records`, created in `…_public_directory`, and
     `ta14_registry_is_reviewer`, created in `…_reviewer_decisions`. Both sort
     later.

   So a naive mechanical rename such as `20260722` → `20260722000001…` in
   alphabetical order would produce a history that fails, or silently differs
   from production.
3. **The production history is unknown to this audit.** If these files had been
   applied with `supabase db push`, the duplicate primary key would have failed.
   That suggests production was migrated another way, for example through the SQL
   editor or an MCP or `apply_migration` call that assigns its own 14-digit
   version. In that case the remote `schema_migrations` versions may not match
   *any* repository filename. **This is a hypothesis and has not been verified.**
   This audit deliberately did not connect to the hosted project.

## 3. What must not be done

* Do not rename, edit or squash applied migration files as a routine fix.
* Do not insert, update or delete rows in production
  `supabase_migrations.schema_migrations`. This includes `supabase migration
  repair`, except as an explicitly approved, owner-run step of a reviewed plan.
* Do not run `supabase db push` against production while this is unresolved.
  The CLI's view of the history is inconsistent.
* Do not couple this remediation to PR #704 or any feature PR.

## 4. Remediation plan (proposed, needs owner and Atlas approval)

**Step 1: read-only remote audit (owner-run).** Capture the remote history
without changing it:

```sql
-- read-only
select version, name, array_length(statements, 1) as stmts
from supabase_migrations.schema_migrations
order by version;
```

Attach the output, with no credentials, to the remediation PR. Then map each
repository file to exactly one remote row by name and statement content. Any
file with no remote row, and any remote row with no file, is a finding of its own.

**Step 2: choose one option, based on Step 1.**

| Option | What changes | When appropriate | Risk |
|---|---|---|---|
| **A. Local-only version shim (recommended first)** | Nothing in `supabase/migrations/`. A local and CI staging script copies migrations into a scratch project and assigns synthetic unique versions **in documented commit order** (table above), for example `20260722000001`…`000006`. | Always safe. It unblocks from-scratch local and CI verification immediately. | The shim order is an assertion. A full local apply must prove it succeeds, and it must be kept in sync. |
| **B. Align filenames to the remote history** | Rename the 22 files to the exact 14-digit versions already recorded remotely. Contents are unchanged, so the files byte-match what was applied. | Only if Step 1 shows every file has a unique remote version. | Renaming is a repository-history change. Production is untouched, because the names would already match it. |
| **C. Rebaseline** | Replace the legacy history with a reviewed baseline dump of the production schema, keeping the originals archived. | Only if Step 1 shows the remote history cannot be reconciled. | Highest. Needs a separate review of the dump, grants and RLS, and owner-run `migration repair` on production. |

**Step 3: acceptance criteria for whichever option is chosen.**

* `ls supabase/migrations/*.sql | sed -E 's/_.*//' | sort | uniq -d` returns
  nothing, or the shim's output does under option A.
* A fresh local `supabase start` applies the full history with no errors.
* The schema produced locally matches a read-only production schema dump for the
  affected objects.
* No production `schema_migrations` change happens without a recorded,
  owner-approved command and its output.

## 5. Interaction with PR #704

`scripts/hpr/local-supabase-verify.sh full` (on the #704 branch) detects this
collision and stops before starting the stack. The default `hpr-only` mode applies only the
self-contained HPR migration, so it is unaffected. HPR validation results must
not be read as validation of the full legacy history.
