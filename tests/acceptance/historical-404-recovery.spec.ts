import { describe, expect, it } from "vitest";
import nextConfig from "../../apps/web/next.config";

/**
 * Guard verified legacy URLs recovered from historical production 404 traffic.
 * This tests redirect configuration, not live HTTP availability.
 */
const historicalRoutes = [
  ["/showrooms/c2VtaWNvbm", "/showrooms/semiconductor-fab-consequence-boundary"],
  ["/examinations/c3RvcC10aG", "/examinations/stop-the-cyber-attack"],
  ["/registry/ta-14-admissible-execution-architecture/showcase/b3duZXItdG", "/registry/ta-14-admissible-execution-architecture/showcase/owner-to-consequence-collaboration"],
  ["/ai-governance/register", "/workspace/ai-governance/registry/register"],
  ["/showrooms/dGhhaWxhbm", "/showrooms/thailand-school-air-evidence"],
  ["/showrooms/Y2xlYW4tYW", "/showrooms/clean-air-developing-minds"],
  ["/examinations/ZGF2aWQtaG", "/examinations/david-holmberg-technical-challenge"],
  ["/showrooms/YXJpem9uYS", "/showrooms/arizona-building-as-evidence"],
  ["/examinations/stop-the-cyber-attack/presentatio", "/examinations/stop-the-cyber-attack/presentation"],
  ["/global-institutional-engage/thailand", "/global-institutional-engagement/thailand"],
  ["/showrooms/Zm91bmRpbm", "/showrooms/founding-institutional-sponsorship"],
  ["/admissible-execution-architecture", "/registry/ta-14-admissible-execution-architecture"],
  ["/admissible-computation-architecture", "/ai-governance/admissible-computation"],
  ["/ai-governance/playground", "/workspace/ai-governance/playground"],
  ["/governance-library/all", "/governance-library"],
  ["/entity-review", "/workspace/entity-review"],
  ["/request-review", "/workspace/entity-review"],
  ["/ai-governance/my-routes", "/workspace/my-routes"],
  ["/workspace/governed-records/admissibility-review", "/workspace/governed-records"],
  ["/global-institutional-engagement/null", "/global-institutional-engagement/showrooms"],
  ["/workspace/ai-governance/registry/records/TA-14-AIGR-000017/null", "/registry/TA-14-AIGR-000017"],
  ["/eu-ai-act/null", "/eu-ai-act"],
  ["/null", "/"],
  ["/index", "/"],
] as const;

describe("historical 404 recovery redirects", () => {
  it.each(historicalRoutes)("%s permanently redirects to %s", async (source, destination) => {
    const redirects = await nextConfig.redirects!();
    const matches = redirects.filter((redirect) => redirect.source === source);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ destination, permanent: true });
  });

  it("has no duplicate recovery source paths", () => {
    const sources = historicalRoutes.map(([source]) => source);
    expect(new Set(sources).size).toBe(sources.length);
  });
});
