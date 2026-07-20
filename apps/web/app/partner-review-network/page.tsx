"use client";

import Link from "next/link";
import { useState } from "react";

type Partner = {
  name: string;
  status: string;
  lane: string;
  summary: string;
  governs: string[];
  contribution: string;
  boundary: string;
  pathwayUrl: string;
};

const partners: Partner[] = [
  {
    name: "Elias / LOVE-OS",
    status: "Signed Partner Review Pathway",
    lane:
      "Runtime Misexecution Pressure Assessment + TA-14 Admissible Execution Boundary Review",
    summary:
      "A specialized runtime-governance pathway focused on how systems behave under ambiguity, pressure, changing conditions, and consequence-bearing decision risk.",
    governs: [
      "Runtime misexecution exposure",
      "Refusal and escalation behavior",
      "Witness continuity",
      "Bounded execution behavior",
      "Operational pressure dynamics",
      "Intervention survivability",
    ],
    contribution:
      "Elias / LOVE-OS contributes the specialized runtime-governance and misexecution-pressure assessment layer. TA-14 contributes the second-layer review of the broader consequence-bearing route.",
    boundary:
      "This pathway is not a merger, certification, endorsement, production validation, security assurance, legal opinion, or claim that either architecture implements or absorbs the other.",
    pathwayUrl:
      "https://sites.google.com/view/ta-14partnerreviewnetworkanewc/elias-love-os-partner-review-pathway",
  },
  {
    name: "AnchorStack",
    status: "Signed Partner Review Pathway",
    lane:
      "Evidence Maturity / Pressure-Route Assessment + TA-14 Admissible Execution Boundary Review",
    summary:
      "A specialized evidence-maturity and pressure-route pathway examining whether governance evidence and route behavior remain credible before consequence attaches.",
    governs: [
      "Evidence maturity",
      "Pressure-route behavior",
      "Invalid operational continuation",
      "Bypass resistance",
      "Replay packets",
      "Assumption governance",
      "Route-governance artifacts",
      "Claim discipline",
    ],
    contribution:
      "AnchorStack contributes the evidence-maturity and pressure-route assessment layer. TA-14 reviews whether those findings support admissible execution across the full route from reality through outcome.",
    boundary:
      "Evidence maturity is not automatically route-complete admissibility. The pathway does not imply certification, endorsement, production validation, a source-code audit, or unrestricted TA-14 status.",
    pathwayUrl:
      "https://sites.google.com/view/ta-14partnerreviewnetworkanewc/anchorstack-partner-review-pathway",
  },
  {
    name: "AB / BIGMAE / Elias",
    status: "Accepted-in-Writing Partner Review Pathway",
    lane:
      "Governed Multi-Agent Execution / Identity & Binding Review + TA-14 Admissible Execution Boundary Review",
    summary:
      "A governed-agent and runtime-governance pathway focused on identity, consequence classification, authority, scope, cryptographic binding, continuity, and controlled execution.",
    governs: [
      "Governed multi-agent execution",
      "Agent identity and runtime-state separation",
      "Consequence classification",
      "Cryptographic binding",
      "Admissibility continuity",
      "Permit / Constrain / Refuse / Escalate logic",
      "Non-bypass behavior",
      "Formed-outcome verification",
    ],
    contribution:
      "AB / BIGMAE / Elias contributes the governed-agent, identity, binding, and runtime-governance assessment layer. TA-14 contributes the route-complete admissible-execution boundary and gap review.",
    boundary:
      "Strong identity, binding, receipts, or runtime controls do not independently prove full-chain admissible execution. The relationship remains independent, written, bounded, and claim-disciplined.",
    pathwayUrl:
      "https://sites.google.com/view/ta-14partnerreviewnetworkanewc/ab-bigmae-elias-partner-review-pathway",
  },
];

function PartnerCard({ partner }: { partner: Partner }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            {partner.status}
          </span>

          <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-medium text-sky-100">
            Second-layer review included
          </span>
        </div>

        <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {partner.name}
        </h3>

        <p className="mt-3 text-sm font-medium leading-6 text-sky-200">
          {partner.lane}
        </p>

        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
          {partner.summary}
        </p>

        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="mt-7 inline-flex min-h-12 w-full items-center justify-between rounded-2xl border border-sky-300/25 bg-sky-300/10 px-5 py-3 text-left font-semibold text-white transition hover:border-sky-200/50 hover:bg-sky-300/15 focus:outline-none focus:ring-2 focus:ring-sky-300 sm:w-auto sm:min-w-[290px]"
        >
          <span>{open ? "Hide Governance Details" : "Learn About Their Governance"}</span>
          <span
            aria-hidden="true"
            className={`ml-4 text-xl transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 bg-slate-950/45 p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <section>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">
                  What this architecture reviews
                </p>
                <ul className="mt-4 space-y-3">
                  {partner.governs.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-6 text-slate-200"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">
                    Network contribution
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {partner.contribution}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">
                    Declared boundary
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {partner.boundary}
                  </p>
                </div>
              </section>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
              <a
                href={partner.pathwayUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                Open Full Public Pathway
              </a>

              <Link
                href="/partner-review-network#how-it-works"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                How Second-Layer Review Works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PartnerReviewNetworkPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#06101f] text-white">
      <section className="relative border-b border-white/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,#081729_0%,#06101f_100%)]"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-200">
              TA-14 AI Governance Exchange
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-6xl">
              TA-14 Partner Review Network
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              Independent architectures. Written boundaries. Specialized review
              layers. TA-14 second-layer admissible-execution review.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#current-partners"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                Explore Current Partners
              </a>

              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                See How the Network Works
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[32px] border border-amber-200/20 bg-white/[0.05] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
              <img
                src="/images/ta-14-partner-review-network-emblem.png"
                alt="TA-14 Partner Review Network emblem"
                className="mx-auto aspect-square w-full rounded-[24px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="current-partners"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 sm:py-24 lg:px-8"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-300">
            Current network
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Three independent partner-review pathways
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Each entity remains independent. Each contributes a specialized
            governance lens. Select the interactive button on any card to see
            what that architecture reviews, what it contributes, and where its
            claims remain bounded.
          </p>
        </div>

        <div className="mt-12 grid gap-6">
          {partners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-24 border-y border-white/10 bg-white/[0.025]"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-200">
              How the network works
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Specialized governance without architectural absorption
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "01",
                "Independent architecture",
                "The partner keeps its own identity, methods, system, expertise, and review layer.",
              ],
              [
                "02",
                "Written boundary",
                "The lane states what is reviewed, what the evidence supports, and what is not being claimed.",
              ],
              [
                "03",
                "Specialized assessment",
                "The partner examines the governance surfaces within its declared field of competence.",
              ],
              [
                "04",
                "TA-14 second layer",
                "TA-14 reviews whether the broader consequence-bearing route supports admissible execution.",
              ],
            ].map(([number, title, text]) => (
              <article
                key={number}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="text-sm font-bold text-sky-300">{number}</p>
                <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-[28px] border border-sky-300/20 bg-sky-300/[0.06] p-7 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-200">
              The TA-14 chain
            </p>
            <p className="mt-5 text-xl font-semibold leading-9 text-white sm:text-2xl">
              Reality → Record → Continuity → Admissibility → Binding → Commit
              → Execution → Outcome
            </p>
            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300">
              A partner may provide a strong specialized review layer. TA-14
              asks the broader question: was the consequence-bearing route
              admissible enough for execution to proceed?
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-24 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-200">
          Network principle
        </p>

        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          No admissible evidence. No admissible execution.
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          The TA-14 Partner Review Network does not sell blanket approval.
          It preserves independence, review boundaries, evidence discipline,
          and second-layer scrutiny before stronger claims are made.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-white/30 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            Return to Exchange
          </Link>
        </div>
      </section>
    </main>
  );
}
