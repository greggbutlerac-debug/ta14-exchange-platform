/**
 * Regression: Next.js rejects sibling dynamic segments with different names under one path
 * ("You cannot use different slug names for the same dynamic path ('id' !== 'slug')"). main had two such
 * conflicts (marketplace/opportunities and marketplace/professionals had both [id] and [slug]), which broke
 * `next start`. The fix keeps one [id] segment per collection and preserves public URL behaviour:
 *   - slug URLs render the slug record pages (pre-generated, with their own metadata);
 *   - ID URLs — the form every in-app link uses — and any other value render the existing ID-addressed page
 *     with the inherited default metadata, exactly as production served them before the fix.
 */
import { mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

import OpportunityPage, {
  generateMetadata as opportunityMetadata,
  generateStaticParams as opportunityStaticParams,
} from "../../apps/web/app/marketplace/opportunities/[id]/page";
import OpportunityIdRecordDetail from "../../apps/web/app/marketplace/opportunities/[id]/id-record-detail";
import ProfessionalPage, {
  generateMetadata as professionalMetadata,
  generateStaticParams as professionalStaticParams,
} from "../../apps/web/app/marketplace/professionals/[id]/page";
import ProfessionalIdRecordDetail from "../../apps/web/app/marketplace/professionals/[id]/id-record-detail";

const APP_DIR = "apps/web/app";

/** Distinct dynamic parameter names among a directory's immediate child segments (route groups are transparent). */
function dynamicSegmentConflicts(directory: string): Array<{ path: string; names: string[] }> {
  const conflicts: Array<{ path: string; names: string[] }> = [];
  const visit = (dir: string): void => {
    const children = readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory());
    // Route groups "(name)" and private folders "_name" do not create a URL segment; include their dynamic
    // children in the parent's namespace so conflicts across groups are also caught.
    const expand = (d: string): string[] =>
      readdirSync(d, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((entry) => (/^\(.*\)$/.test(entry.name) ? expand(join(d, entry.name)) : [entry.name]));
    const names = new Set(
      expand(dir)
        .map((name) => /^\[\[?(?:\.\.\.)?([^\]]+)\]\]?$/.exec(name)?.[1])
        .filter((name): name is string => Boolean(name)),
    );
    if (names.size > 1) conflicts.push({ path: dir, names: [...names].sort() });
    for (const child of children) visit(join(dir, child.name));
  };
  visit(directory);
  return conflicts;
}

describe("App Router dynamic segments", () => {
  it("no directory has sibling dynamic segments with different parameter names", () => {
    expect(dynamicSegmentConflicts(APP_DIR).map((conflict) => ({ ...conflict, path: relative(process.cwd(), conflict.path) }))).toEqual([]);
  });

  it("the guard detects the conflict shape that previously existed on main (fixture tree)", () => {
    const root = mkdtempSync(join(tmpdir(), "ta14-route-guard-"));
    try {
      for (const dir of ["marketplace/opportunities/[id]", "marketplace/opportunities/[slug]", "marketplace/organizations/[slug]", "a/(group)/[x]", "a/[y]"]) {
        mkdirSync(join(root, dir), { recursive: true });
      }
      const found = dynamicSegmentConflicts(root).map((conflict) => ({ ...conflict, path: relative(root, conflict.path) }));
      expect(found).toEqual([
        { path: "a", names: ["x", "y"] },
        { path: "marketplace/opportunities", names: ["id", "slug"] },
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

type Element = { type: unknown; props: Record<string, unknown> };
const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe.each([
  {
    collection: "opportunities",
    Page: OpportunityPage,
    metadata: opportunityMetadata,
    staticParams: opportunityStaticParams,
    IdRecordDetail: OpportunityIdRecordDetail,
    slug: "high-risk-vendor-payment-approval-route",
    slugTitle: "High-Risk Vendor Payment Approval Route",
    linkedIds: ["TA-14-MKT-OPP-001", "TA-14-MKT-OPP-004"],
  },
  {
    collection: "professionals",
    Page: ProfessionalPage,
    metadata: professionalMetadata,
    staticParams: professionalStaticParams,
    IdRecordDetail: ProfessionalIdRecordDetail,
    slug: "mara-ellington",
    slugTitle: "Mara Ellington",
    linkedIds: ["TA-14-PRO-001"],
  },
])("marketplace/$collection/[id] preserves public URL behaviour", ({ Page, metadata, staticParams, IdRecordDetail, slug, slugTitle, linkedIds }) => {
  it("pre-generates every slug record page", () => {
    const generated = staticParams().map((entry) => entry.id);
    expect(generated).toContain(slug);
    expect(generated.length).toBeGreaterThanOrEqual(3);
  });

  it("slug URLs render the slug record with its own title", async () => {
    expect((await metadata(params(slug))).title).toBe(slugTitle);
    const element = (await Page(params(slug))) as unknown as Element;
    expect(element.type).not.toBe(IdRecordDetail);
  });

  it.each(linkedIds)("the in-app ID link %s renders the ID-addressed page with inherited metadata", async (id) => {
    expect(await metadata(params(id))).toEqual({});
    const element = (await Page(params(id))) as unknown as Element;
    expect(element.type).toBe(IdRecordDetail);
  });

  it("any other value keeps the previous production behaviour (ID page, not a hard 404)", async () => {
    expect(await metadata(params("no-such-record"))).toEqual({});
    expect(((await Page(params("no-such-record"))) as unknown as Element).type).toBe(IdRecordDetail);
  });
});
