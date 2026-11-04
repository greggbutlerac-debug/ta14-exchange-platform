import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { decideAccess } from "../../apps/web/app/showrooms/refrigeration-consequence-boundary/access";
import { EnvironmentalIntegrityNode } from "../../apps/web/lib/refrigeration-boundary/ein";
import { emergencyGrant, evaluateEmergency } from "../../apps/web/lib/refrigeration-boundary/emergency";

/*
 * The examination is owner-gated pending publication approval, and emergency authorization never
 * rests on untrusted (inadmissible) controller signals.
 */
const ROOT = join(__dirname, "..", "..");
const DIR = join(ROOT, "apps/web/app/showrooms/refrigeration-consequence-boundary");
const read = (p: string) => readFileSync(join(DIR, p), "utf8");

describe("owner gate (fail closed)", () => {
  const owner = "00000000-0000-4000-8000-000000000001";
  const cases: Array<[string, Parameters<typeof decideAccess>[0], boolean]> = [
    ["the signed-in owner", { ownerId: owner, userId: owner }, true],
    ["another signed-in user", { ownerId: owner, userId: "someone-else" }, false],
    ["no session", { ownerId: owner, userId: null }, false],
    ["no owner configured", { ownerId: "", userId: owner }, false],
    ["owner id with whitespace only", { ownerId: "   ", userId: "   " }, false],
    ["local preview flag off Vercel", { localPreview: "1", userId: null }, true],
    ["local preview flag ON Vercel", { localPreview: "1", vercel: "1", ownerId: owner, userId: null }, false],
    ["local preview flag with another value", { localPreview: "true", userId: null }, false],
  ];
  for (const [name, input, allowed] of cases) it(`${name} → ${allowed ? "allowed" : "404"}`, () => { expect(decideAccess(input).allowed).toBe(allowed); });

  it("the layout, the evidence route and the PDF route all enforce the gate before anything else", () => {
    expect(read("layout.tsx")).toMatch(/if \(!\(await examinationAccess\(\)\)\.allowed\) notFound\(\);/);
    for (const route of ["evidence/[file]/route.ts", "files/[file]/route.ts"]) {
      const src = read(route);
      const gate = src.indexOf("examinationAccess()).allowed) return new NextResponse('Not found.', { status: 404 })");
      expect(gate).toBeGreaterThan(0);
      expect(gate).toBeLessThan(src.indexOf("await params"));
    }
    expect(read("access.ts")).toMatch(/catch \{\s*userId = null; \/\/ fail closed/);
  });
  it("no examination file is served from public/", () => {
    expect(existsSync(join(ROOT, "apps/web/public/showrooms/refrigeration-consequence-boundary"))).toBe(false);
  });
  it("the page gates itself before computing anything, because layouts and pages render in parallel", () => {
    const page = read("page.tsx");
    const body = page.slice(page.indexOf("export default async function"));
    expect(body.split("\n")[1].trim()).toBe("if (!(await examinationAccess()).allowed) notFound();");
    expect(page).not.toMatch(/export const metadata/);
    const meta = page.slice(page.indexOf("export async function generateMetadata"), page.indexOf("export default async function"));
    expect(meta.indexOf("examinationAccess()")).toBeLessThan(meta.indexOf("title:"));
  });
  it("the page stays out of search indexes, the sitemap and the showroom index", () => {
    expect(read("page.tsx")).toMatch(/const robots = \{ index: false, follow: false, nocache: true \}/);
    expect(readFileSync(join(ROOT, "apps/web/app/sitemap.ts"), "utf8")).not.toContain("refrigeration-consequence-boundary");
    expect(readFileSync(join(ROOT, "apps/web/app/showrooms/page.tsx"), "utf8")).not.toContain("refrigeration-consequence-boundary");
  });
  it("no unverified third-party attribution appears in the examination's content", () => {
    const files = [
      ...readdirSync(DIR, { recursive: true }).map((f) => join(DIR, String(f))),
      ...readdirSync(join(ROOT, "apps/web/lib/refrigeration-boundary")).map((f) => join(ROOT, "apps/web/lib/refrigeration-boundary", f)),
      ...readdirSync(join(ROOT, "docs/refrigeration-consequence-boundary")).filter((f) => /\.(md|html)$/.test(f)).map((f) => join(ROOT, "docs/refrigeration-consequence-boundary", f)),
    ].filter((f) => /\.(tsx?|md|html)$/.test(f));
    for (const f of files) expect(readFileSync(f, "utf8"), f).not.toMatch(/Onuma|ONUMA|Kimon|Gipson|Asset Leadership/);
  });
});

describe("no emergency authorization from inadmissible evidence", () => {
  const LOST = { P1: null, P2: null, AIR: null, HEATER_CT: 0.08, COMPRESSOR_CT: 0.08 };
  const build = (reportedAirC: number) => { const ein = new EnvironmentalIntegrityNode(); for (let m = 200; m <= 240; m += 5) ein.observe(m, LOST, reportedAirC); return ein; };
  const request = { kind: "PROTECTIVE_MEASURE" as const, requestId: "R", measure: "RESTORE_SEALED_SETPOINT" };
  const held = { holderActorId: "TECH-01", grant: emergencyGrant("RESTORE_SEALED_SETPOINT", 0, 1440) };

  it("the controller's untrusted reports do not influence any emergency decision", () => {
    const calm = evaluateEmergency({ actorId: "TECH-01", request, held, ein: build(-22), minute: 240 });
    const alarming = evaluateEmergency({ actorId: "TECH-01", request, held, ein: build(25), minute: 240 });
    expect(alarming.determination).toBe(calm.determination);
    expect(alarming.reasonCodes).toEqual(calm.reasonCodes);
    expect(alarming.conditionEvidenceId).toBe(calm.conditionEvidenceId);
  });
  it("evidence loss alone, without the scoped authority and standing, never authorizes", () => {
    expect(evaluateEmergency({ actorId: "TECH-01", request, held: null, ein: build(25), minute: 240 }).permitted).toBe(false);
    expect(evaluateEmergency({ actorId: "UNKNOWN-REMOTE-01", request, held, ein: build(25), minute: 240 }).permitted).toBe(false);
  });
  it("an alarming controller report with independent evidence available does not open the emergency route", () => {
    const ein = new EnvironmentalIntegrityNode();
    for (let i = 0; i < 9; i++) ein.observe(200 + i * 5, { P1: -21.4 + i * 0.01, P2: -21.2 - i * 0.01, AIR: -22 + i * 0.013, HEATER_CT: 0.08, COMPRESSOR_CT: 6 }, 25);
    expect(evaluateEmergency({ actorId: "TECH-01", request, held, ein, minute: 240 }).permitted).toBe(false);
  });
});
