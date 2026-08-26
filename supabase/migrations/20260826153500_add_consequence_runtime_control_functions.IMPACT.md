# Object Impact — 20260826153500_add_consequence_runtime_control_functions.sql

Status: COMMITTED / NOT YET EXECUTED IN SUPABASE

## Purpose
Adds controlled runtime functions for opening a Consequence Examination run, recording S0-S7 in strict order, and sealing the completed run.

## Functions created/replaced
- public.consequence_open_run(text,text,text,uuid,text,jsonb)
- public.consequence_record_stage(text,uuid,text,jsonb,text)
- public.consequence_seal_run(text,uuid,text,jsonb,text)

All three are SECURITY DEFINER functions with empty search_path and EXECUTE revoked from PUBLIC, anon, and authenticated. They are intended for controlled server-side/institutional invocation only.

## Existing tables written by functions
- public.consequence_examination_runs
- public.consequence_examination_events
- public.consequence_examination_chronology

## Existing tables read by functions
- public.consequence_technical_freezes
- public.consequence_examination_runs
- public.consequence_examination_events
- public.consequence_examination_chronology

## Runtime rules established
1. A run can open only from a matching TECHNICAL_FREEZE_ISSUED freeze.
2. The freeze must already bind an examination definition and an existing Registry architecture/version.
3. The run inherits definition_id, registry_record_id, and registry_version_record_id from the freeze.
4. Opening records TECHNICAL_FREEZE and RUN_OPENED chronology entries.
5. Runtime stages are limited to S0-S7.
6. S0-S7 must be recorded exactly once and in strict numerical order.
7. Each stage requires a SHA-256 payload digest.
8. Only the run's bound operator may record stages or seal the run.
9. A run cannot seal until all eight stages exist.
10. Final determination is limited to SUPPORTED, PARTIALLY_SUPPORTED, UNSUPPORTED, or INDETERMINATE.
11. Sealing requires a run SHA-256 digest.

## Registry impact
NONE.

No Registry table, column, constraint, policy, trigger, function, submission step, readiness rule, review rule, finalization rule, Registry identifier, or version record is created or modified.

The functions only consume Registry bindings already inherited through the Technical Freeze and existing examination-run enforcement.

## Schema objects NOT created or modified
- No tables created
- No columns added or changed
- No constraints added or changed
- No indexes added or changed
- No triggers added or changed
- No RLS policies added or changed
- No Registry objects changed
- No findings/seals/receipts schema changed
