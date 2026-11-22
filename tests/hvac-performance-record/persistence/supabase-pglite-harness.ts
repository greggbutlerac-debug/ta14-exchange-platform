/**
 * In-process Postgres (PGlite) harness that models the parts of Supabase the
 * HPR migration depends on, so RLS, grants, and triggers are executed for
 * real rather than inferred from SQL text.
 *
 * Modeled: the anon / authenticated / service_role roles, auth.users,
 * auth.uid() (same definition Supabase ships: JWT `sub` from request.jwt.*),
 * and Supabase's default privileges that grant ALL on new public tables and
 * functions to the API roles (so the migration must revoke them itself).
 *
 * Not modeled: PostgREST, GoTrue JWT signature verification, and the Storage
 * API (increment 2 adds only a minimal storage.* table model, STORAGE_STUB).
 * A JWT `sub` here is set directly; in production it comes from a token
 * Supabase has verified. That trust boundary is outside this harness.
 */
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {PGlite} from '@electric-sql/pglite';

export const MIGRATION_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../../../supabase/migrations/20261116200000_hpr_field_evidence_foundation.sql',
);

const SUPABASE_STUB = `
create role anon nologin noinherit;
create role authenticated nologin noinherit;
create role service_role nologin noinherit bypassrls;

create schema auth;
grant usage on schema auth to anon, authenticated, service_role;
grant usage on schema public to anon, authenticated, service_role;

create table auth.users (id uuid primary key, email text);

create function auth.uid() returns uuid language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;
grant execute on function auth.uid() to anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
`;

export const PHOTO_MIGRATION_PATH = process.env.HPR_PHOTO_MIGRATION_PATH ?? path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../../../supabase/migrations/20261122120000_hpr_private_photo_reconciliation.sql',
);

/**
 * Minimal model of the Supabase `storage` schema used by increment 2: the
 * buckets/objects tables, storage.foldername(), RLS enabled on objects, and
 * Supabase's broad table grants on storage.objects to the API roles (so the
 * migration's policies, not missing grants, are what deny access).
 * Not modeled: the Storage API server, its backend bytes, or its own checks.
 */
export const STORAGE_STUB = `
create schema storage;
grant usage on schema storage to anon, authenticated, service_role;
create table storage.buckets (
  id text primary key, name text not null unique, owner uuid, public boolean default false,
  file_size_limit bigint, allowed_mime_types text[], created_at timestamptz default now(), updated_at timestamptz default now()
);
create table storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets (id),
  name text not null,
  owner uuid, owner_id text,
  created_at timestamptz default now(), updated_at timestamptz default now(), last_accessed_at timestamptz default now(),
  metadata jsonb, version text, user_metadata jsonb,
  unique (bucket_id, name)
);
create function storage.foldername(name text) returns text[] language plpgsql immutable as $$
declare _parts text[];
begin
  select string_to_array(name, '/') into _parts;
  return _parts[1:array_length(_parts, 1) - 1];
end $$;
alter table storage.objects enable row level security;
alter table storage.buckets enable row level security;
grant all on storage.objects, storage.buckets to anon, authenticated, service_role;
grant execute on function storage.foldername(text) to anon, authenticated, service_role;
`;

export type SimOptions = {photoIncrement?: boolean};

export type Actor =
  | {role: 'anon'}
  | {role: 'authenticated'; sub: string}
  | {role: 'service_role'};

export class SupabaseSim {
  private constructor(readonly db: PGlite) {}

  static async create(options: SimOptions = {}): Promise<SupabaseSim> {
    const db = new PGlite();
    await db.exec(SUPABASE_STUB);
    if (options.photoIncrement) await db.exec(STORAGE_STUB);
    await db.exec(readFileSync(MIGRATION_PATH, 'utf8'));
    if (options.photoIncrement) await db.exec(readFileSync(PHOTO_MIGRATION_PATH, 'utf8'));
    return new SupabaseSim(db);
  }

  /** Runs as the migration owner (postgres). Test setup only. */
  async admin<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
    return (await this.db.query<T>(sql, params)).rows;
  }

  async createUser(id: string): Promise<string> {
    await this.admin('insert into auth.users (id, email) values ($1, $2)', [id, id + '@example.test']);
    return id;
  }

  async enrollTechnician(id: string, status: 'active' | 'suspended' = 'active'): Promise<void> {
    await this.as({role: 'service_role'}, 'insert into public.hpr_technicians (user_id, status) values ($1, $2)', [id, status]);
  }

  /** Executes one statement as the given API role inside its own transaction. */
  async as<T = Record<string, unknown>>(actor: Actor, sql: string, params: unknown[] = []): Promise<T[]> {
    return this.db.transaction(async tx => {
      const claims = actor.role === 'authenticated'
        ? JSON.stringify({sub: actor.sub, role: 'authenticated'})
        : JSON.stringify({role: actor.role});
      await tx.query(`select set_config('request.jwt.claims', $1, true)`, [claims]);
      await tx.query(`select set_config('request.jwt.claim.sub', $1, true)`, [
        actor.role === 'authenticated' ? actor.sub : '',
      ]);
      await tx.exec(`set local role ${actor.role}`);
      return (await tx.query<T>(sql, params)).rows;
    });
  }

  async close(): Promise<void> {
    await this.db.close();
  }
}
