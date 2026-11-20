#!/usr/bin/env bash
# TA-14 HPR — isolated LOCAL Supabase verification for PR #704.
#
# Spins up a throwaway local Supabase stack (Docker) in a scratch workdir that
# is NOT linked to any Supabase project, applies migrations, runs the
# read-only privilege verification SQL, runs lint/advisors where the CLI
# supports them, runs the real GoTrue/PostgREST integration suite, then stops
# the stack and discards its volumes.
#
# It never uses production credentials:
#   * every SUPABASE_* / DATABASE_URL / POSTGRES_* variable is removed from
#     the environment before the CLI runs (including SUPABASE_ACCESS_TOKEN,
#     so the CLI cannot reach the Supabase platform API);
#   * the workdir is fresh and has no supabase/.temp/project-ref link;
#   * API and DB URLs reported by `supabase status` must be loopback.
#
# Usage:
#   scripts/hpr/local-supabase-verify.sh            # HPR migration only (default)
#   scripts/hpr/local-supabase-verify.sh full       # every repo migration from scratch
#   KEEP_STACK=1 scripts/hpr/local-supabase-verify.sh   # leave the stack running
#
# Requirements: Docker-compatible runtime (Docker Desktop, OrbStack or Colima)
# running, and the Supabase CLI on PATH. Does not upgrade either.
set -euo pipefail

MODE="${1:-hpr-only}"
case "$MODE" in hpr-only|full) ;; *) echo "usage: $0 [hpr-only|full]" >&2; exit 2;; esac

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HPR_MIGRATION="20261116200000_hpr_field_evidence_foundation.sql"
VERIFY_SQL="$REPO_ROOT/supabase/verification/verify_hpr_field_evidence_privileges.sql"
PROJECT_ID="ta14-hpr-local-verify"
RUN_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ta14-hpr-local.XXXXXX")"
WORKDIR="$RUN_DIR/project"
LOG="$RUN_DIR/verify.log"
mkdir -p "$WORKDIR"
# Redact credentials from everything written to the terminal and verify.log
# (`supabase start` / `status` print local JWTs, sb_* keys and DB passwords).
if sed -l -n '' </dev/null 2>/dev/null; then SED_LB=-l; else SED_LB=-u; fi
redact() {
  sed -E $SED_LB \
    -e 's/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/[REDACTED_JWT]/g' \
    -e 's/sb_(publishable|secret)_[A-Za-z0-9_-]+/sb_\1_[REDACTED]/g' \
    -e 's#(postgres(ql)?://[^:/@[:space:]]+):[^@[:space:]]+@#\1:[REDACTED]@#g' \
    -e 's#(https?://[^?[:space:]"]+)\?[^[:space:]"]*(Signature|X-Amz|Encoded|token)[^[:space:]"]*#\1?[REDACTED_QUERY]#g' \
    -e 's/("?[A-Z0-9_]*(KEY|SECRET|TOKEN|PASSWORD)[A-Z0-9_]*"?[[:space:]]*[=:][[:space:]]*"?)[^",[:space:]}]+/\1[REDACTED]/g'
}
exec > >(redact | tee -a "$LOG") 2>&1

step() { printf '\n=== %s ===\n' "$*"; }
fail() { printf '\nFAIL: %s\nLog: %s\n' "$*" "$LOG" >&2; exit 1; }

# --- 0. strip anything that could point at a real project -------------------
EXCLUDE_SERVICES="${HPR_EXCLUDE_SERVICES:-studio,imgproxy,edge-runtime,logflare,vector}"
stripped=0
for v in $(env | cut -d= -f1 | grep -E '^(SUPABASE_[A-Za-z0-9_]*|NEXT_PUBLIC_SUPABASE_[A-Za-z0-9_]*|DATABASE_URL|POSTGRES_[A-Za-z0-9_]*|PG[A-Z]+)$' || true); do
  unset "$v"; stripped=$((stripped + 1))
done
export SUPABASE_TELEMETRY_DISABLED=1 DO_NOT_TRACK=1

# --- 1. tooling ---------------------------------------------------------------
step "1. Tooling"
command -v docker >/dev/null || fail "docker not on PATH (install Docker Desktop, OrbStack or Colima)"
command -v supabase >/dev/null || fail "supabase CLI not on PATH (brew install supabase/tap/supabase)"
docker info >/dev/null 2>&1 || fail "Docker daemon not running"
echo "supabase CLI: $(supabase --version)"
echo "docker:       $(docker version --format 'client {{.Client.Version}} / server {{.Server.Version}}')"
echo "mode:         $MODE"
echo "workdir:      $WORKDIR (unlinked scratch project)"
echo "credential env vars stripped: $stripped"

# --- 2. scratch project + migrations -----------------------------------------
step "2. Scratch project"
cd "$WORKDIR"
supabase init </dev/null >/dev/null
[ -f supabase/config.toml ] || fail "supabase init did not create config.toml"
sed -i.bak -E "s/^project_id = .*/project_id = \"$PROJECT_ID\"/" supabase/config.toml && rm -f supabase/config.toml.bak
[ ! -e supabase/.temp/project-ref ] || fail "scratch project is linked to a remote project"
mkdir -p supabase/migrations

if [ "$MODE" = "full" ]; then
  dups="$(ls "$REPO_ROOT"/supabase/migrations/*.sql | xargs -n1 basename | sed -E 's/^([0-9]+)_.*/\1/' | sort | uniq -d)"
  if [ -n "$dups" ]; then
    echo "Duplicate migration versions (Supabase CLI requires unique versions):"
    for d in $dups; do ls "$REPO_ROOT"/supabase/migrations/"${d}"_*.sql | xargs -n1 basename | sed 's/^/  /'; done
    fail "full-history apply blocked by duplicate migration versions (pre-existing; see FIELD-EVIDENCE-OPEN-DEPENDENCIES.md D6)"
  fi
  cp "$REPO_ROOT"/supabase/migrations/*.sql supabase/migrations/
else
  cp "$REPO_ROOT/supabase/migrations/$HPR_MIGRATION" supabase/migrations/
fi
echo "migrations staged: $(ls supabase/migrations | wc -l | tr -d ' ')"

cleanup() {
  if [ "${KEEP_STACK:-0}" != "1" ]; then
    step "Teardown"
    (cd "$WORKDIR" && supabase stop --no-backup) || true
  else
    echo "KEEP_STACK=1: stack left running in $WORKDIR"
  fi
  echo "Log: $LOG"
}
trap cleanup EXIT

# --- 3. start (applies migrations on a fresh database) -----------------------
step "3. supabase start (fresh volumes, migrations applied)"
supabase start -x "$EXCLUDE_SERVICES" || fail "supabase start failed (check migration errors above; override excluded services with HPR_EXCLUDE_SERVICES)"

eval "$(supabase status -o env | sed -n -E 's/^([A-Z_]+)=(.*)$/LOCAL_\1=\2/p')"
LOCAL_ANON="${LOCAL_ANON_KEY:-${LOCAL_PUBLISHABLE_KEY:-}}"
LOCAL_SERVICE="${LOCAL_SERVICE_ROLE_KEY:-${LOCAL_SECRET_KEY:-}}"
[[ "${LOCAL_API_URL:-}" =~ ^http://(127\.0\.0\.1|localhost): ]] || fail "API URL is not loopback: ${LOCAL_API_URL:-unset}"
[[ "${LOCAL_DB_URL:-}" =~ @(127\.0\.0\.1|localhost): ]] || fail "DB URL is not loopback"
[ -n "$LOCAL_ANON" ] && [ -n "$LOCAL_SERVICE" ] || fail "could not read local API keys from supabase status"
echo "API: $LOCAL_API_URL (loopback verified)"

DB_CONTAINER="supabase_db_${PROJECT_ID}"
psql_local() { docker exec -i "$DB_CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -X -q "$@"; }

step "3b. Migration history"
psql_local -At -c "select version || ' ' || coalesce(name, '') from supabase_migrations.schema_migrations order by version"

# --- 4. privilege verification SQL -------------------------------------------
step "4. verify_hpr_field_evidence_privileges.sql"
out="$(psql_local -At -F ' | ' < "$VERIFY_SQL")"
echo "$out"
lines="$(printf '%s\n' "$out" | sed '/^$/d' | wc -l | tr -d ' ')"
[ "$lines" = "1" ] && [[ "$(printf '%s' "$out" | sed '/^$/d')" =~ ^[0-9]+$ ]] \
  || fail "verification SQL reported findings (sections 1-6 must return 0 rows)"
echo "PASS: sections 1-6 returned 0 rows; section 7 storage_pending_photos=$out"

# --- 4b. lint / advisors where supported --------------------------------------
step "4b. Lint / advisors"
# CLI v1/v2 print "Available Commands:", CLI v3 prints "SUBCOMMANDS".
db_subcommands="$(supabase db --help 2>/dev/null | awk '/^(Available Commands:|SUBCOMMANDS)/{f=1;next} f&&NF{print $1} f&&!NF{exit}')"
echo "supabase db subcommands: $(echo $db_subcommands)"
# CLI v1/v2 need --local; CLI v3 targets local by default and has no --local.
# --remote is never passed, and the scratch project is unlinked (checked above).
local_flag() { supabase db "$1" --help 2>/dev/null | grep -qE '^[[:space:]]*--local\b' && echo --local || true; }
if printf '%s\n' $db_subcommands | grep -qx lint; then
  echo "\$ supabase db lint $(local_flag lint) --level warning --schema public"
  supabase db lint $(local_flag lint) --level warning --schema public || echo "WARN: db lint reported issues (see above)"
else
  echo "supabase db lint: not supported by this CLI"
fi
if printf '%s\n' $db_subcommands | grep -qx advisors; then
  echo "\$ supabase db advisors $(local_flag advisors) --type all --level info"
  supabase db advisors $(local_flag advisors) --type all --level info || echo "WARN: advisors reported issues (see above)"
else
  echo "Security/performance advisors: not available in this CLI version (hosted-only)."
fi

# --- 5. real GoTrue / PostgREST integration ----------------------------------
step "5. Real auth / RLS / isolation / append-only (vitest)"
cd "$REPO_ROOT"
HPR_LOCAL_SUPABASE_URL="$LOCAL_API_URL" \
HPR_LOCAL_SUPABASE_ANON_KEY="$LOCAL_ANON" \
HPR_LOCAL_SUPABASE_SERVICE_ROLE_KEY="$LOCAL_SERVICE" \
  npx vitest run tests/hvac-performance-record/local-supabase --reporter=verbose \
  || fail "local Supabase integration tests failed"

step "6. Log credential scan"
sleep 1  # let the redaction pipe flush
if grep -nE 'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}|sb_(secret|publishable)_[A-Za-z0-9]|postgres(ql)?://[^:/@[:space:]]+:[^[@[:space:]]+@|"?[A-Z0-9_]*(KEY|SECRET|TOKEN|PASSWORD)[A-Z0-9_]*"?[[:space:]]*[=:][[:space:]]*"?[^[",[:space:]}]' "$LOG" >/dev/null; then
  fail "verify.log contains an unredacted credential-like value"
fi
echo "PASS: no unredacted JWTs, sb_* keys, DB passwords or *KEY/*SECRET/*TOKEN values in $LOG"

step "RESULT: PASS ($MODE)"
