
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { decideAccess } from "../../apps/web/app/showrooms/refrigeration-consequence-boundary/access";
import { EnvironmentalIntegrityNode } from "../../apps/web/lib/refrigeration-boundary/ein";
import {
  emergencyGrant,
  evaluateEmergency,
} from "../../apps/web/lib/refrigeration-boundary/emergency";

/*
 * TA-14 Refrigeration Consequence Boundary
 *
 * Issue #684:
 * The teaching showroom is approved for unlisted public viewing.
 *
 * The public teaching page does not require owner authentication.
 * Restricted evidence exports remain owner-gated and fail closed.
 *
 * Emergency authorization must never rely on untrusted or
 * inadmissible controller signals.
 *
 * No admissible evidence. No admissible execution.
 */

const ROOT = join(__dirname, "..", "..");

const DIR = join(
  ROOT,
  "apps/web/app/showrooms/refrigeration-consequence-boundary"
);

const read = (path: string) =>
  readFileSync(join(DIR, path), "utf8");

describe("refrigeration showroom access governance", () => {
  const owner = "00000000-0000-4000-8000-000000000001";

  const cases: Array<
    [string, Parameters<typeof decideAccess>[0], boolean]
  > = [
    [
      "the signed-in owner",
      { ownerId: owner, userId: owner },
      true,
    ],
    [
      "another signed-in user",
      { ownerId: owner, userId: "someone-else" },
      false,
    ],
    [
      "no session",
      { ownerId: owner, userId: null },
      false,
    ],
    [
      "no owner configured",
      { ownerId: "", userId: owner },
      false,
    ],
    [
      "owner id with whitespace only",
      { ownerId: "   ", userId: "   " },
      false,
    ],
    [
      "local preview flag off Vercel",
      { localPreview: "1", userId: null },
      true,
    ],
    [
      "local preview flag ON Vercel",
      {
        localPreview: "1",
        vercel: "1",
        ownerId: owner,
        userId: null,
      },
      false,
    ],
    [
      "local preview flag with another value",
      { localPreview: "true", userId: null },
      false,
    ],
  ];

  for (const [name, input, allowed] of cases) {
    it(`${name} -> ${allowed ? "allowed" : "404"}`, () => {
      expect(decideAccess(input).allowed).toBe(allowed);
    });
  }

  it("allows the approved public teaching layout without exposing restricted evidence", () => {
    const layout = read("layout.tsx");

    // Issue #684 authorizes the unlisted teaching page.
    expect(layout).toContain("return children;");

    // The layout must not impose the former owner-only gate.
    expect(layout).not.toContain("examinationAccess()");
    expect(layout).not.toContain("notFound()");

    // Restricted evidence routes must independently enforce access.
    const route = read("evidence/[file]/route.ts");

    const gate = route.indexOf(
      "examinationAccess()).allowed) return new NextResponse('Not found.', { status: 404 })"
    );

    expect(gate).toBeGreaterThan(0);
    expect(gate).toBeLessThan(route.indexOf("await params"));

    // The withdrawn PDF route must remain unavailable.
    expect(
      existsSync(join(DIR, "files/[file]/route.ts"))
    ).toBe(false);

    expect(read("page.tsx")).not.toContain(
      "Technical examination (PDF)"
    );

    // Authentication errors must fail closed.
    expect(read("access.ts")).toMatch(
      /catch \{\s*userId = null; \/\/ fail closed/
    );
  });

  it("does not expose examination files through the public directory", () => {
    expect(
      existsSync(
        join(
          ROOT,
          "apps/web/public/showrooms/refrigeration-consequence-boundary"
        )
      )
    ).toBe(false);
  });

  it("preserves the approved public teaching page and its metadata policy", () => {
    const page = read("page.tsx");

    const body = page.slice(
      page.indexOf("export default async function")
    );

    expect(body.split("\n")[1].trim()).toBe(
      "const results = await runAllScenarios();"
    );

    expect(page).not.toMatch(/export const metadata/);

    const meta = page.slice(
      page.indexOf("export async function generateMetadata"),
      page.indexOf("export default async function")
    );

    expect(meta).toContain("robots,");
    expect(meta).toContain("title:");
  });

  it("keeps the unlisted page out of search indexes and public discovery", () => {
    expect(read("page.tsx")).toMatch(
      /const robots = \{ index: false, follow: false, nocache: true \}/
    );

    const sitemap = readFileSync(
      join(ROOT, "apps/web/app/sitemap.ts"),
      "utf8"
    );

    const showroomIndex = readFileSync(
      join(ROOT, "apps/web/app/showrooms/page.tsx"),
      "utf8"
    );

    expect(sitemap).not.toContain(
      "refrigeration-consequence-boundary"
    );

    expect(showroomIndex).not.toContain(
      "refrigeration-consequence-boundary"
    );
  });

  it("contains no unverified third-party attribution", () => {
    const files = [
      ...readdirSync(DIR, { recursive: true }).map(
        (file) => join(DIR, String(file))
      ),

      ...readdirSync(
        join(ROOT, "apps/web/lib/refrigeration-boundary")
      ).map((file) =>
        join(
          ROOT,
          "apps/web/lib/refrigeration-boundary",
          file
        )
      ),

      ...readdirSync(
        join(ROOT, "docs/refrigeration-consequence-boundary")
      )
        .filter((file) => /\.(md|html)$/.test(file))
        .map((file) =>
          join(
            ROOT,
            "docs/refrigeration-consequence-boundary",
            file
          )
        ),
    ].filter((file) => /\.(tsx?|md|html)$/.test(file));

    for (const file of files) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(
        /Onuma|ONUMA|Kimon|Gipson|Asset Leadership/
      );
    }
  });
});

describe("no emergency authorization from inadmissible evidence", () => {
  const LOST = {
    P1: null,
    P2: null,
    AIR: null,
    HEATER_CT: 0.08,
    COMPRESSOR_CT: 0.08,
  };

  const build = (reportedAirC: number) => {
    const ein = new EnvironmentalIntegrityNode();

    for (let minute = 200; minute <= 240; minute += 5) {
      ein.observe(minute, LOST, reportedAirC);
    }

    return ein;
  };

  const request = {
    kind: "PROTECTIVE_MEASURE" as const,
    requestId: "R",
    measure: "RESTORE_SEALED_SETPOINT",
  };

  const held = {
    holderActorId: "TECH-01",
    grant: emergencyGrant(
      "RESTORE_SEALED_SETPOINT",
      0,
      1440
    ),
  };

  it("does not allow untrusted controller reports to influence emergency decisions", () => {
    const calm = evaluateEmergency({
      actorId: "TECH-01",
      request,
      held,
      ein: build(-22),
      minute: 240,
    });

    const alarming = evaluateEmergency({
      actorId: "TECH-01",
      request,
      held,
      ein: build(25),
      minute: 240,
    });

    expect(alarming.determination).toBe(
      calm.determination
    );

    expect(alarming.reasonCodes).toEqual(
      calm.reasonCodes
    );

    expect(alarming.conditionEvidenceId).toBe(
      calm.conditionEvidenceId
    );
  });

  it("does not authorize intervention without scoped authority and standing", () => {
    expect(
      evaluateEmergency({
        actorId: "TECH-01",
        request,
        held: null,
        ein: build(25),
        minute: 240,
      }).permitted
    ).toBe(false);

    expect(
      evaluateEmergency({
        actorId: "UNKNOWN-REMOTE-01",
        request,
        held,
        ein: build(25),
        minute: 240,
      }).permitted
    ).toBe(false);
  });

  it("does not open emergency execution from alarming controller reports when independent evidence exists", () => {
    const ein = new EnvironmentalIntegrityNode();

    for (let i = 0; i < 9; i++) {
      ein.observe(
        200 + i * 5,
        {
          P1: -21.4 + i * 0.01,
          P2: -21.2 - i * 0.01,
          AIR: -22 + i * 0.013,
          HEATER_CT: 0.08,
          COMPRESSOR_CT: 6,
        },
        25
      );
    }

    expect(
      evaluateEmergency({
        actorId: "TECH-01",
        request,
        held,
        ein,
        minute: 240,
      }).permitted
    ).toBe(false);
  });
});
