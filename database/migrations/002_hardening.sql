BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE routes
  ADD CONSTRAINT routes_current_version_fk
  FOREIGN KEY (current_version_id) REFERENCES route_versions(route_version_id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE authority_records
  ADD CONSTRAINT authority_validity_window CHECK (expires_at > effective_at);

ALTER TABLE test_runs ADD COLUMN IF NOT EXISTS requirement_library_version text NOT NULL DEFAULT 'TA14-PAY-2026-07-16.2';
ALTER TABLE test_receipts ADD COLUMN IF NOT EXISTS signing_key_id text;
ALTER TABLE test_receipts ADD COLUMN IF NOT EXISTS signature text;
ALTER TABLE aer_records ADD COLUMN IF NOT EXISTS signing_key_id text;
ALTER TABLE aer_records ADD COLUMN IF NOT EXISTS signature text;

ALTER TABLE organizations FORCE ROW LEVEL SECURITY;
ALTER TABLE systems FORCE ROW LEVEL SECURITY;
ALTER TABLE routes FORCE ROW LEVEL SECURITY;
ALTER TABLE route_versions FORCE ROW LEVEL SECURITY;
ALTER TABLE evidence_objects FORCE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION ta14_current_user_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('ta14.user_id', true), '')::uuid
$$;

CREATE POLICY organizations_member_select ON organizations
FOR SELECT USING (
  owner_user_id = ta14_current_user_id() OR EXISTS (
    SELECT 1 FROM organization_members m WHERE m.org_id = organizations.org_id AND m.user_id = ta14_current_user_id() AND m.revoked_at IS NULL
  )
);

CREATE POLICY systems_member_all ON systems
USING (EXISTS (SELECT 1 FROM organization_members m WHERE m.org_id = systems.org_id AND m.user_id = ta14_current_user_id() AND m.revoked_at IS NULL))
WITH CHECK (EXISTS (SELECT 1 FROM organization_members m WHERE m.org_id = systems.org_id AND m.user_id = ta14_current_user_id() AND m.revoked_at IS NULL));

CREATE POLICY routes_member_all ON routes
USING (EXISTS (SELECT 1 FROM systems s JOIN organization_members m ON m.org_id = s.org_id WHERE s.system_id = routes.system_id AND m.user_id = ta14_current_user_id() AND m.revoked_at IS NULL))
WITH CHECK (EXISTS (SELECT 1 FROM systems s JOIN organization_members m ON m.org_id = s.org_id WHERE s.system_id = routes.system_id AND m.user_id = ta14_current_user_id() AND m.revoked_at IS NULL));

CREATE POLICY route_versions_member_select ON route_versions
FOR SELECT USING (EXISTS (SELECT 1 FROM routes r JOIN systems s ON s.system_id = r.system_id JOIN organization_members m ON m.org_id = s.org_id WHERE r.route_id = route_versions.route_id AND m.user_id = ta14_current_user_id() AND m.revoked_at IS NULL));

CREATE POLICY evidence_member_all ON evidence_objects
USING (EXISTS (SELECT 1 FROM organization_members m WHERE m.org_id = evidence_objects.org_id AND m.user_id = ta14_current_user_id() AND m.revoked_at IS NULL))
WITH CHECK (EXISTS (SELECT 1 FROM organization_members m WHERE m.org_id = evidence_objects.org_id AND m.user_id = ta14_current_user_id() AND m.revoked_at IS NULL));

COMMIT;
