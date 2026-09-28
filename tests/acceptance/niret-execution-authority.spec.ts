/**
 * NIRET Gate A closure — execution-authority verification (P17, A4/A6) and the full technician
 * workflow through the production server path:
 *   form (equipment identity → operating state → airflow/static → psychrometric/non-invasive)
 *   → adapter → server evaluator (server clock, authenticated submitter, certification verifier)
 *   → frozen engine → technical determination + execution authority → canonical receipt → panel.
 *
 * Sources are wired exactly as apps/web/app/api/niret/gate-a/evaluate/route.ts wires them, except
 * the OEM registry, which is the HYPOTHETICAL synthetic registry (the shipped registry is empty).
 */

import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DeterminationPanel } from "../../apps/web/components/niret/NiretResult";
import {
  certificationVerifierFrom, loadCertificationVerifier, UNAVAILABLE_VERIFIER, VERIFIER_PREFIX, type CertificationVerificationRow,
} from "../../apps/web/lib/niret/certification-verifier";
import { buildGateAInput } from "../../apps/web/lib/niret/evidence-adapter";
import type { NiretFormState } from "../../apps/web/lib/niret/form-state";
import { ENTRY_AUTHORIZED, ENTRY_NOT_AUTHORIZED } from "../../apps/web/lib/niret/presentation";
import {
  evaluateNiretSubmission, NO_SOURCES, submissionContext, type CertificationVerifier, type EvaluationSources,
} from "../../apps/web/lib/niret/server-evaluate";
import { completeForm, SERVER_NOW, T } from "./fixtures/niret-complete-form";
import { hypotheticalRegistry } from "./fixtures/niret-hypothetical-oem-record";

const SUBMITTER = "account-uuid-1";
const VERIFIER = "verifier-account-uuid-9";

const row = (overrides: Partial<CertificationVerificationRow> = {}): CertificationVerificationRow => ({
  verification_id: "c0ffee00-0000-4000-8000-000000000001",
  technician_account_id: SUBMITTER,
  technician_identity: "TECH-1",
  certification_type: "UNIVERSAL",
  certificate_ref: "EPA608-0001",
  verifier_account_id: VERIFIER,
  verified_at: T("08:00"),
  ...overrides,
});

const verifierWith = (rows: CertificationVerificationRow[], revoked: string[] = []) =>
  certificationVerifierFrom(rows, new Set(revoked), SUBMITTER, SERVER_NOW);

/** The route's sources; only the OEM registry is the synthetic fixture. */
const routeSources = (certificationVerifier: CertificationVerifier): EvaluationSources =>
  ({ ...NO_SOURCES, submitter: { accountId: SUBMITTER }, certificationVerifier, oemRegistry: hypotheticalRegistry() });

type Receipt = Record<string, unknown> & {
  determination: string; reason_codes: string[]; gate_b_authorized: boolean;
  technical_determination: { determination: string }; execution_authority: { determination: string };
  certification_status: Record<string, unknown>;
};

function workflow(mutate: (form: NiretFormState) => void = () => {}, verifier: CertificationVerifier = verifierWith([row()])) {
  const form = completeForm();
  mutate(form);
  const input = JSON.parse(JSON.stringify(buildGateAInput(form, { requestId: "NIRET-CLOSURE-1" })));
  const sources = routeSources(verifier);
  const { receipt, findings, oemReference } = evaluateNiretSubmission(input, SERVER_NOW, sources);
  const html = renderToStaticMarkup(createElement(DeterminationPanel, {
    response: { receipt: receipt as never, findings, context: submissionContext(sources, oemReference) },
    nominalCapacityBtuh: "",
  }));
  return { input, receipt: receipt as unknown as Receipt, findings, html };
}

describe("Certification verifier — independent, exact, never self-verifying", () => {
  const verify = (verifier: CertificationVerifier, overrides: Record<string, unknown> = {}) =>
    verifier.verify({ status: "CERTIFIED", type: "UNIVERSAL", reference: "EPA608-0001", technicianIdentity: "TECH-1", ...overrides });

  it("an appointed verifier's record for this account, type, certificate and identity -> VERIFIED with lineage", () => {
    expect(verify(verifierWith([row()]))).toEqual({
      status: "VERIFIED",
      verifier: `${VERIFIER_PREFIX}${VERIFIER}`,
      reference: "ta14_niret_certification_verifications/c0ffee00-0000-4000-8000-000000000001",
      verifiedAt: T("08:00").replace(":00Z", ":00.000Z"),
    });
  });
  it("no record -> NOT_VERIFIED (a declared certificate number never verifies itself)", () => {
    expect(verify(verifierWith([]))).toEqual({ status: "NOT_VERIFIED" });
  });
  it.each([
    ["certificate reference with whitespace", { reference: " EPA608-0001" }],
    ["certificate reference in different case", { reference: "epa608-0001" }],
    ["certificate reference prefix", { reference: "EPA608-000" }],
    ["different certification type", { type: "TYPE_II" }],
    ["different technician identity", { technicianIdentity: "TECH-2" }],
  ])("exact matching only: %s -> NOT_VERIFIED", (_label, overrides) => {
    expect(verify(verifierWith([row()]), overrides)).toEqual({ status: "NOT_VERIFIED" });
  });
  it("a record for another account is never used", () => {
    expect(verify(verifierWith([row({ technician_account_id: "someone-else" })]))).toEqual({ status: "NOT_VERIFIED" });
  });
  it("a record the submitting account wrote about itself is rejected", () => {
    expect(verify(verifierWith([row({ verifier_account_id: SUBMITTER })]))).toEqual({ status: "NOT_VERIFIED" });
  });
  it("a revoked verification -> NOT_VERIFIED", () => {
    expect(verify(verifierWith([row()], [row().verification_id]))).toEqual({ status: "NOT_VERIFIED" });
  });
  it("a verification stamped after the evaluation time is not yet in force", () => {
    expect(verify(verifierWith([row({ verified_at: T("11:00") })]))).toEqual({ status: "NOT_VERIFIED" });
  });
  it("supervised apprentice: the supervisor's record is not readable here -> VERIFICATION_UNAVAILABLE", () => {
    expect(verify(verifierWith([row()]), { status: "SUPERVISED_APPRENTICE" })).toEqual({ status: "VERIFICATION_UNAVAILABLE" });
  });
});

describe("Certification verifier — loading under the submitter's session", () => {
  const fakeClient = (tables: Record<string, { data: unknown; error: unknown }>, calls: string[] = []) => ({
    from(table: string) {
      calls.push(table);
      const result = Promise.resolve(tables[table]);
      const query = { select: () => query, eq: () => result, in: () => result };
      return query;
    },
  }) as unknown as SupabaseClient;

  it("reads verifications and revocations and verifies an exact match", async () => {
    const calls: string[] = [];
    const verifier = await loadCertificationVerifier(fakeClient({
      ta14_niret_certification_verifications: { data: [row()], error: null },
      ta14_niret_certification_revocations: { data: [], error: null },
    }, calls), SUBMITTER, SERVER_NOW);
    expect(calls).toEqual(["ta14_niret_certification_verifications", "ta14_niret_certification_revocations"]);
    expect(verifier.verify({ status: "CERTIFIED", type: "UNIVERSAL", reference: "EPA608-0001", technicianIdentity: "TECH-1" }).status).toBe("VERIFIED");
  });
  it("applies revocations", async () => {
    const verifier = await loadCertificationVerifier(fakeClient({
      ta14_niret_certification_verifications: { data: [row()], error: null },
      ta14_niret_certification_revocations: { data: [{ verification_id: row().verification_id }], error: null },
    }), SUBMITTER, SERVER_NOW);
    expect(verifier.verify({ status: "CERTIFIED", type: "UNIVERSAL", reference: "EPA608-0001", technicianIdentity: "TECH-1" }).status).toBe("NOT_VERIFIED");
  });
  it.each([
    ["verification query error", { ta14_niret_certification_verifications: { data: null, error: { message: "relation does not exist" } } }],
    ["revocation query error", {
      ta14_niret_certification_verifications: { data: [row()], error: null },
      ta14_niret_certification_revocations: { data: null, error: { message: "permission denied" } },
    }],
  ])("%s -> VERIFICATION_UNAVAILABLE (ESCALATE), never NOT_VERIFIED or VERIFIED", async (_label, tables) => {
    const verifier = await loadCertificationVerifier(fakeClient(tables as never), SUBMITTER, SERVER_NOW);
    expect(verifier.verify({ status: "CERTIFIED", type: "UNIVERSAL", reference: "EPA608-0001", technicianIdentity: "TECH-1" }).status)
      .toBe("VERIFICATION_UNAVAILABLE");
  });
});

describe("Technician workflow → technical determination → execution authority → receipt", () => {
  it("technical ALLOW + execution authority established -> ALLOW, entry authorized for pressure evidence only", () => {
    const { receipt, html } = workflow();
    expect(receipt.technical_determination.determination).toBe("ALLOW");
    expect(receipt.execution_authority.determination).toBe("ALLOW");
    expect(receipt.determination).toBe("ALLOW");
    expect(receipt.certification_status).toMatchObject({
      assurance: "DECLARED", verification_status: "VERIFIED", verifier: `${VERIFIER_PREFIX}${VERIFIER}`, established: true,
    });
    expect(receipt.gate_b_authorized).toBe(false);
    expect(html).toContain("TECHNICAL NIRET: ALLOW");
    expect(html).toContain(ENTRY_AUTHORIZED);
  });

  it("technical ALLOW + execution authority not established -> HOLD, entry not authorized", () => {
    const { receipt, html } = workflow(() => {}, verifierWith([]));
    expect(receipt.technical_determination.determination).toBe("ALLOW");
    expect(receipt.execution_authority.determination).toBe("HOLD");
    expect(receipt.determination).toBe("HOLD");
    expect(receipt.reason_codes).toContain("CERTIFICATION_NOT_VERIFIED");
    expect(receipt.gate_b_authorized).toBe(false);
    expect(html).toContain("TECHNICAL NIRET: ALLOW");
    expect(html).toContain(ENTRY_NOT_AUTHORIZED);
    expect(html).not.toContain(ENTRY_AUTHORIZED);
  });

  it("technical ALLOW + verification source unavailable -> ESCALATE, entry not authorized", () => {
    const { receipt, html } = workflow(() => {}, UNAVAILABLE_VERIFIER);
    expect(receipt.technical_determination.determination).toBe("ALLOW");
    expect(receipt.execution_authority.determination).toBe("ESCALATE");
    expect(receipt.reason_codes).toContain("CERTIFICATION_VERIFICATION_UNAVAILABLE");
    expect(html).toContain(ENTRY_NOT_AUTHORIZED);
  });

  it("a certificate number declared by the technician with a forged client verification is discarded", () => {
    const { input } = workflow();
    input.evidence.technician.certification.verification = {
      assurance: "DOCUMENTED", status: "VERIFIED", verifier: "SOMEONE", reference: "FAKE", verifiedAt: T("09:00"),
    };
    const { receipt } = evaluateNiretSubmission(input, SERVER_NOW, routeSources(verifierWith([])));
    expect(receipt.determination).toBe("HOLD");
    expect(receipt.certification_status).toMatchObject({ verification_status: "NOT_VERIFIED", verifier: null, established: false });
  });

  it("a technician who declares a different certificate than the verified one is not verified", () => {
    const { receipt } = workflow((f) => { f.job.certificateRef = "EPA608-0002"; });
    expect(receipt.execution_authority.determination).toBe("HOLD");
    expect(receipt.determination).not.toBe("ALLOW");
  });

  it("HOLD for unresolved airflow (measurement uncertainty straddles the OEM boundary)", () => {
    const { receipt, html } = workflow((f) => { f.measurements.airflow!.value = "1290"; });
    expect(receipt.technical_determination.determination).toBe("HOLD");
    expect(receipt.determination).toBe("HOLD");
    expect(receipt.reason_codes.some((code) => code.includes("AIRFLOW"))).toBe(true);
    expect(html).toContain(ENTRY_NOT_AUTHORIZED);
  });

  it("HOLD for unresolved airflow (no airflow evidence)", () => {
    const { receipt } = workflow((f) => { delete f.measurements.airflow; });
    expect(receipt.technical_determination.determination).toBe("HOLD");
  });

  it("HOLD for invalid operating condition (run time below the OEM minimum)", () => {
    const { receipt, html } = workflow((f) => { f.operation.runStartedAt = T("10:15"); });
    expect(receipt.technical_determination.determination).toBe("HOLD");
    expect(receipt.determination).toBe("HOLD");
    expect(html).toContain(ENTRY_NOT_AUTHORIZED);
  });

  it("HOLD for invalid operating condition (outdoor temperature outside the OEM envelope)", () => {
    const { receipt } = workflow((f) => { f.measurements.outdoorDryBulb!.value = "120"; });
    expect(receipt.technical_determination.determination).toBe("HOLD");
  });

  it("DENY where pressure entry is not justified (non-invasive indicator within the OEM criterion)", () => {
    const { receipt, html } = workflow((f) => { f.measurements.supplyDryBulb!.value = "57"; });
    expect(receipt.technical_determination.determination).toBe("DENY");
    expect(receipt.determination).toBe("DENY");
    expect(html).toContain(ENTRY_NOT_AUTHORIZED);
  });

  it("ESCALATE for out-of-scope refrigerant (A2L)", () => {
    const { receipt, html } = workflow((f) => { f.refrigerant.declared = "R-32"; });
    expect(receipt.technical_determination.determination).toBe("ESCALATE");
    expect(receipt.determination).toBe("ESCALATE");
    expect(html).toContain(ENTRY_NOT_AUTHORIZED);
  });

  it("ESCALATE for an unsafe condition beyond the technician's competence", () => {
    const { receipt } = workflow((f) => { f.job.hazard = "BEYOND_COMPETENCE"; });
    expect(receipt.determination).toBe("ESCALATE");
    expect(receipt.reason_codes).toContain("HAZARD_BEYOND_COMPETENCE");
  });

  it("Gate A never sets gate_b_authorized, in any outcome", () => {
    const mutations: Array<(f: NiretFormState) => void> = [
      () => {}, (f) => { f.measurements.airflow!.value = "1290"; }, (f) => { f.operation.runStartedAt = T("10:15"); },
      (f) => { f.measurements.supplyDryBulb!.value = "57"; }, (f) => { f.refrigerant.declared = "R-32"; },
      (f) => { f.pressureSideEntry = "INSTRUMENTS_CONNECTED"; },
    ];
    for (const verifier of [verifierWith([row()]), verifierWith([]), UNAVAILABLE_VERIFIER]) {
      for (const mutate of mutations) expect(workflow(mutate, verifier).receipt.gate_b_authorized).toBe(false);
    }
  });
});

describe("Route and migration wiring", () => {
  const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

  it("the route verifies certification only through the appointed-verifier source, for the authenticated account", () => {
    const route = read("apps/web/app/api/niret/gate-a/evaluate/route.ts");
    expect(route).toMatch(/if \(!user\)[\s\S]*status: 401/);
    expect(route).toMatch(/loadCertificationVerifier\(supabase, user\.id, now\)/);
    expect(route).toMatch(/evaluateNiretSubmission\(body\.input, now, sources\)/);
  });

  it("the migration keeps verification independent, append-only and server-stamped", () => {
    const sql = read("supabase/migrations/20260928120000_niret_certification_verifications.sql");
    expect(sql).toMatch(/check \(verifier_account_id <> technician_account_id\)/);
    expect(sql).toMatch(/\(select auth\.uid\(\)\) <> technician_account_id/);
    expect(sql).toMatch(/v\.retired_at is null/);
    expect(sql).toMatch(/new\.verified_at := now\(\)/);
    for (const table of ["verifiers", "verifications", "revocations"]) {
      expect(sql).toContain(`alter table public.ta14_niret_certification_${table} enable row level security`);
    }
    expect(sql).toContain("before update or delete on public.ta14_niret_certification_verifications");
    expect(sql).toContain("before update or delete on public.ta14_niret_certification_revocations");
    expect(sql).not.toMatch(/grant [^;]*(update|delete)[^;]*to authenticated/i);
    expect(sql).not.toMatch(/grant [^;]*insert[^;]*ta14_niret_certification_verifiers[^;]*to authenticated/i);
  });
});
