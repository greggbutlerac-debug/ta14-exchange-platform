create table if not exists public.consequence_examination_definitions (
  definition_id text primary key,
  slug text not null unique,
  name text not null,
  version text not null,
  description text,
  proposition_schema jsonb not null default '{}'::jsonb,
  freeze_gate_schema jsonb not null default '[]'::jsonb,
  stage_schema jsonb not null default '[]'::jsonb,
  determination_grammar jsonb not null default '[]'::jsonb,
  publication_boundary text not null,
  status text not null default 'ACTIVE' check (status in ('DRAFT','ACTIVE','RETIRED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.consequence_examination_definitions enable row level security;
grant select on public.consequence_examination_definitions to anon, authenticated;
revoke insert, update, delete, truncate on public.consequence_examination_definitions from anon, authenticated;
create policy "public_read_active_examination_definitions" on public.consequence_examination_definitions for select to anon, authenticated using (status = 'ACTIVE');

insert into public.consequence_examination_definitions (
  definition_id, slug, name, version, description, proposition_schema, freeze_gate_schema, stage_schema, determination_grammar, publication_boundary, status
) values (
  'TA14-EXDEF-BASELAYEROS-R1-V1',
  'baselayeros-r1',
  'BaseLayerOS R1 Changed-Condition Consequence Examination',
  '1.0',
  'A bounded consequence examination for determining whether the participant architecture preserves or changes consequential progression after a material pre-execution condition change, including alternate-route challenge evidence.',
  jsonb_build_object(
    'required_fields', jsonb_build_array('participant_identity','architecture_identity','native_claims','authority_semantics','consequence_boundary','changed_condition','route_surface','evidence_package','acceptance_criteria','replay_terms','publication_terms')
  ),
  jsonb_build_array(
    jsonb_build_object('id','TF-01','title','Participant authority'),
    jsonb_build_object('id','TF-02','title','Architecture identity'),
    jsonb_build_object('id','TF-03','title','Artifact integrity'),
    jsonb_build_object('id','TF-04','title','Claims and non-claims'),
    jsonb_build_object('id','TF-05','title','Native semantics'),
    jsonb_build_object('id','TF-06','title','Consequence boundary'),
    jsonb_build_object('id','TF-07','title','Changed-condition object'),
    jsonb_build_object('id','TF-08','title','Route surface'),
    jsonb_build_object('id','TF-09','title','Evidence package'),
    jsonb_build_object('id','TF-10','title','Acceptance criteria'),
    jsonb_build_object('id','TF-11','title','Replay package'),
    jsonb_build_object('id','TF-12','title','Publication and confidentiality')
  ),
  jsonb_build_array(
    jsonb_build_object('id','S0','title','Frozen baseline'),
    jsonb_build_object('id','S1','title','Initial supportable state'),
    jsonb_build_object('id','S2','title','Authority / evidence established'),
    jsonb_build_object('id','S3','title','Material condition change'),
    jsonb_build_object('id','S4','title','Native reassessment'),
    jsonb_build_object('id','S5','title','Consequential commitment challenge'),
    jsonb_build_object('id','S6','title','Alternate-route / bypass challenge'),
    jsonb_build_object('id','S7','title','Outcome and restoration evidence')
  ),
  jsonb_build_array('SUPPORTED','PARTIALLY_SUPPORTED','UNSUPPORTED','INDETERMINATE'),
  'Findings remain bounded to the frozen proposition, admitted evidence, declared environment, execution chronology, and stated acceptance criteria. Registration or publication does not establish universal certification or comparative superiority.',
  'ACTIVE'
) on conflict (definition_id) do nothing;

alter table public.consequence_technical_freezes add column if not exists definition_id text references public.consequence_examination_definitions(definition_id) on delete restrict;
alter table public.consequence_examination_runs add column if not exists definition_id text references public.consequence_examination_definitions(definition_id) on delete restrict;
create index if not exists consequence_technical_freezes_definition_idx on public.consequence_technical_freezes(definition_id);
create index if not exists consequence_examination_runs_definition_idx on public.consequence_examination_runs(definition_id);
