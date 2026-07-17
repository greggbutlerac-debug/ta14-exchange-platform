"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type RouteStatus = "PUBLISHED" | "DRAFT" | "UNDER_REVIEW";
type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

type ExchangeRoute = {
  id: string;
  title: string;
  domain: string;
  summary: string;
  author: string;
  version: string;
  status: RouteStatus;
  decision: Decision;
  score: number;
  forks: number;
  tests: number;
  updated: string;
  tags: string[];
  chain: Record<string, string>;
};

const stages = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

const seedRoutes: ExchangeRoute[] = [
  {
    id: "vendor-payment-v3",
    title: "High-Value Vendor Payment",
    domain: "Finance",
    summary:
      "A consequence-bearing payment route requiring authority, beneficiary, destination, and settlement correspondence before closure.",
    author: "TA-14 Authority",
    version: "3.0.0",
    status: "PUBLISHED",
    decision: "ALLOW",
    score: 100,
    forks: 18,
    tests: 243,
    updated: "2026-07-17",
    tags: ["payment", "authority", "beneficiary", "settlement"],
    chain: {
      Reality: "Invoice, purchase order, supplier identity, and payment request exist.",
      Record: "Canonical request and evidence package are preserved.",
      Continuity: "Evidence origin, transformations, and versions are traceable.",
      Admissibility: "Required evidence and policy thresholds are satisfied.",
      Binding: "Actor, authority, beneficiary, amount, and destination are bound.",
      Commit: "The admitted route is hashed and committed before execution.",
      Execution: "The payment instruction matches the committed route.",
      Outcome: "Settlement receipt confirms amount, account, and completion.",
    },
  },
  {
    id: "ai-agent-refund-v1",
    title: "AI Agent Customer Refund",
    domain: "AI Governance",
    summary:
      "A bounded route for an AI agent proposing and issuing refunds within verified policy, identity, and amount limits.",
    author: "TA-14 Exchange Lab",
    version: "1.2.0",
    status: "UNDER_REVIEW",
    decision: "HOLD",
    score: 81,
    forks: 7,
    tests: 96,
    updated: "2026-07-16",
    tags: ["agent", "refund", "customer", "runtime"],
    chain: {
      Reality: "Customer account, order, complaint, and proposed refund exist.",
      Record: "Conversation, order state, and refund proposal are recorded.",
      Continuity: "Order and customer records are linked to their source systems.",
      Admissibility: "Policy threshold is present; temporal validity remains unresolved.",
      Binding: "Agent identity and customer account are bound.",
      Commit: "Pending renewed admissibility before commit.",
      Execution: "UNKNOWN",
      Outcome: "UNKNOWN",
    },
  },
  {
    id: "hvac-refrigerant-intervention-v2",
    title: "Refrigerant Intervention Threshold",
    domain: "HVAC",
    summary:
      "A field-governance route that prevents refrigerant intervention until non-invasive evidence supports the action.",
    author: "Transparent Air",
    version: "2.4.1",
    status: "PUBLISHED",
    decision: "ALLOW",
    score: 96,
    forks: 12,
    tests: 174,
    updated: "2026-07-14",
    tags: ["hvac", "refrigerant", "field-evidence", "threshold"],
    chain: {
      Reality: "Operating conditions and system state are observed in the field.",
      Record: "Measurements, video, equipment identity, and environmental state are preserved.",
      Continuity: "Probe, technician, location, and measurement continuity are maintained.",
      Admissibility: "Non-invasive entry threshold is satisfied.",
      Binding: "Technician, equipment, property, refrigerant, and intervention are bound.",
      Commit: "The intervention route is committed before valve movement.",
      Execution: "Measured refrigerant movement corresponds to the committed action.",
      Outcome: "Post-intervention verification confirms system response.",
    },
  },
  {
    id: "clinical-ai-escalation-v1",
    title: "Clinical AI Escalation Route",
    domain: "Healthcare",
    summary:
      "A route that requires escalation when clinical evidence, authority, or patient-state continuity is insufficient for automated action.",
    author: "Community Draft",
    version: "0.8.0",
    status: "DRAFT",
    decision: "ESCALATE",
    score: 68,
    forks: 3,
    tests: 31,
    updated: "2026-07-11",
    tags: ["clinical", "patient", "escalation", "ai"],
    chain: {
      Reality: "Patient state and proposed clinical action are described.",
      Record: "Clinical observations are partially recorded.",
      Continuity: "Source-system continuity is incomplete.",
      Admissibility: "Required clinician review is absent.",
      Binding: "Patient identity is present; authority binding is unresolved.",
      Commit: "UNKNOWN",
      Execution: "UNKNOWN",
      Outcome: "UNKNOWN",
    },
  },
];

function badgeClasses(value: string) {
  if (value === "ALLOW" || value === "PUBLISHED") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }
  if (value === "HOLD" || value === "UNDER_REVIEW") {
    return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  }
  if (value === "DENY") {
    return "border-rose-400/30 bg-rose-400/10 text-rose-200";
  }
  if (value === "ESCALATE") {
    return "border-violet-400/30 bg-violet-400/10 text-violet-200";
  }
  return "border-slate-400/30 bg-slate-400/10 text-slate-200";
}

export default function RouteExchangePage() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All domains");
  const [decision, setDecision] = useState("All decisions");
  const [selected, setSelected] = useState<ExchangeRoute>(seedRoutes[0]);
  const [notice, setNotice] = useState("");

  const domains = useMemo(
    () => ["All domains", ...Array.from(new Set(seedRoutes.map((route) => route.domain)))],
    [],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return seedRoutes.filter((route) => {
      const matchesQuery =
        !normalized ||
        route.title.toLowerCase().includes(normalized) ||
        route.summary.toLowerCase().includes(normalized) ||
        route.tags.some((tag) => tag.includes(normalized));
      const matchesDomain = domain === "All domains" || route.domain === domain;
      const matchesDecision = decision === "All decisions" || route.decision === decision;
      return matchesQuery && matchesDomain && matchesDecision;
    });
  }, [query, domain, decision]);

  function copyRoute(route: ExchangeRoute) {
    const payload = {
      schema: "TA14_EXCHANGE_ROUTE_V1",
      exchangeRouteId: route.id,
      title: route.title,
      domain: route.domain,
      version: route.version,
      author: route.author,
      status: route.status,
      latestDecision: route.decision,
      readinessScore: route.score,
      route: route.chain,
      provenance: {
        source: "TA-14 Exchange",
        importedAt: new Date().toISOString(),
        relationship: "forked-copy",
      },
    };

    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setNotice(`Copied ${route.title} as a forkable TA14_EXCHANGE_ROUTE_V1 package.`);
  }

  function downloadRoute(route: ExchangeRoute) {
    const payload = {
      schema: "TA14_EXCHANGE_ROUTE_V1",
      exchangeRouteId: route.id,
      title: route.title,
      domain: route.domain,
      version: route.version,
      author: route.author,
      status: route.status,
      latestDecision: route.decision,
      readinessScore: route.score,
      route: route.chain,
      provenance: {
        source: "TA-14 Exchange",
        exportedAt: new Date().toISOString(),
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${route.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice(`Downloaded ${route.title}.`);
  }

  return (
    <main className="min-h-screen bg-[#07090d] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-10 lg:py-12">
        <header className="mb-8 flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              TA-14 Exchange
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Browse, inspect, test, and fork governance routes.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Exchange entries are route packages, not endorsements. Published status does not replace independent admissibility testing against the user&apos;s actual evidence, authority, environment, and consequence.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/workspace/build"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Build a route
            </Link>
            <Link
              href="/workspace/scanner"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-200"
            >
              Open scanner
            </Link>
          </div>
        </header>

        <section className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[1fr_220px_220px]">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Search routes
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, purpose, or tag"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Domain
            </span>
            <select
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm outline-none focus:border-cyan-300/50"
            >
              {domains.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Latest decision
            </span>
            <select
              value={decision}
              onChange={(event) => setDecision(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm outline-none focus:border-cyan-300/50"
            >
              {["All decisions", "ALLOW", "HOLD", "DENY", "ESCALATE"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </section>

        {notice ? (
          <div className="mb-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
            {notice}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_460px]">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{filtered.length} exchange routes</h2>
              <span className="text-sm text-slate-500">Public preview catalog</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((route) => (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => setSelected(route)}
                  className={`rounded-3xl border p-5 text-left transition ${
                    selected.id === route.id
                      ? "border-cyan-300/40 bg-cyan-300/[0.08]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {route.domain}
                      </div>
                      <h3 className="mt-2 text-xl font-semibold">{route.title}</h3>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] ${badgeClasses(route.decision)}`}>
                      {route.decision}
                    </span>
                  </div>

                  <p className="min-h-[72px] text-sm leading-6 text-slate-300">{route.summary}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {route.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-xs text-slate-400">
                    <div>
                      <div className="text-base font-semibold text-white">{route.score}%</div>
                      readiness
                    </div>
                    <div>
                      <div className="text-base font-semibold text-white">{route.tests}</div>
                      tests
                    </div>
                    <div>
                      <div className="text-base font-semibold text-white">{route.forks}</div>
                      forks
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-slate-400">
                No routes match those filters.
              </div>
            ) : null}
          </section>

          <aside className="h-fit rounded-3xl border border-white/10 bg-[#0b0f16] p-5 xl:sticky xl:top-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Selected route</div>
                <h2 className="mt-2 text-2xl font-semibold">{selected.title}</h2>
                <div className="mt-2 text-sm text-slate-400">
                  {selected.author} · v{selected.version}
                </div>
              </div>
              <span className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.14em] ${badgeClasses(selected.status)}`}>
                {selected.status.replace("_", " ")}
              </span>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-slate-400">Construction readiness</span>
                <span className="font-semibold">{selected.score}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-cyan-300" style={{ width: `${selected.score}%` }} />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {stages.map((stage, index) => {
                const value = selected.chain[stage];
                const unknown = !value || value === "UNKNOWN";
                return (
                  <div key={stage} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs text-slate-300">
                          {index + 1}
                        </span>
                        <span className="text-sm font-semibold">{stage}</span>
                      </div>
                      <span className={`text-[10px] font-bold tracking-[0.14em] ${unknown ? "text-amber-300" : "text-emerald-300"}`}>
                        {unknown ? "UNKNOWN" : "PRESENT"}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-400">{value || "UNKNOWN"}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => copyRoute(selected)}
                className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium transition hover:border-white/30 hover:bg-white/5"
              >
                Copy package
              </button>
              <button
                type="button"
                onClick={() => downloadRoute(selected)}
                className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium transition hover:border-white/30 hover:bg-white/5"
              >
                Download JSON
              </button>
            </div>

            <Link
              href="/workspace/scanner"
              className="mt-3 block rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-slate-200"
            >
              Test this route
            </Link>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Forking preserves source provenance. A copied route must be retested against its new evidence, authority, environment, and intended consequence before it can become admissible.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
