"use client";

import { useState } from "react";

type Partner = {
  name: string;
  initials: string;
  status: string;
  lane: string;
  summary: string;
  governs: string[];
  contribution: string;
  boundary: string;
  pathwayUrl: string;
  accent: "cyan" | "violet" | "amber";
};

const partners: Partner[] = [
  {
    name: "Elias / LOVE-OS",
    initials: "EL",
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
    accent: "cyan",
  },
  {
    name: "AnchorStack",
    initials: "AS",
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
    accent: "violet",
  },
  {
    name: "AB / BIGMAE / Elias",
    initials: "AB",
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
    accent: "amber",
  },
];

const accentClasses = {
  cyan: {
    ring: "border-cyan-300/30",
    glow: "shadow-[0_0_60px_rgba(34,211,238,0.12)]",
    badge: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
    dot: "bg-cyan-300",
    text: "text-cyan-200",
  },
  violet: {
    ring: "border-violet-300/30",
    glow: "shadow-[0_0_60px_rgba(167,139,250,0.12)]",
    badge: "border-violet-300/25 bg-violet-300/10 text-violet-100",
    dot: "bg-violet-300",
    text: "text-violet-200",
  },
  amber: {
    ring: "border-amber-300/30",
    glow: "shadow-[0_0_60px_rgba(252,211,77,0.12)]",
    badge: "border-amber-300/25 bg-amber-300/10 text-amber-100",
    dot: "bg-amber-300",
    text: "text-amber-200",
  },
};

function CosmicBackground() {
  const stars = Array.from({ length: 56 }, (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    top: `${(index * 53) % 100}%`,
    size: index % 7 === 0 ? 3 : index % 3 === 0 ? 2 : 1,
    delay: `${(index % 9) * 0.55}s`,
    duration: `${3.8 + (index % 6) * 0.7}s`,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030712]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(139,92,246,0.12),transparent_32%),radial-gradient(circle_at_50%_82%,rgba(245,158,11,0.07),transparent_30%)]" />

      <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

      {stars.map((star) => (
        <span
          key={star.id}
          className="cosmic-star absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      <div className="orbit orbit-one">
        <span className="orbit-node bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.95)]" />
      </div>
      <div className="orbit orbit-two">
        <span className="orbit-node bg-violet-300 shadow-[0_0_24px_rgba(167,139,250,0.95)]" />
      </div>
      <div className="orbit orbit-three">
        <span className="orbit-node bg-amber-300 shadow-[0_0_24px_rgba(252,211,77,0.9)]" />
      </div>

      <div className="network-line line-one" />
      <div className="network-line line-two" />
      <div className="network-line line-three" />
      <div className="network-line line-four" />

      <div className="absolute left-[8%] top-[18%] h-72 w-72 rounded-full border border-cyan-300/10" />
      <div className="absolute right-[6%] top-[32%] h-[28rem] w-[28rem] rounded-full border border-violet-300/10" />
      <div className="absolute bottom-[-12rem] left-[34%] h-[34rem] w-[34rem] rounded-full border border-amber-300/10" />
    </div>
  );
}

function PartnerCard({ partner, index }: { partner: Partner; index: number }) {
  const [open, setOpen] = useState(false);
  const accent = accentClasses[partner.accent];

  return (
    <article
      className={`group relative overflow-hidden rounded-[30px] border ${accent.ring} bg-slate-950/55 ${accent.glow} backdrop-blur-2xl transition duration-500 hover:-translate-y-1 hover:bg-slate-950/70`}
    >
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/[0.035] blur-2xl" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>

      <div className="relative p-6 sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div className="flex min-w-0 items-center gap-4">
            <div
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl border ${accent.ring} bg-white/[0.05] text-sm font-black tracking-[0.14em] text-white`}
            >
              {partner.initials}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Pathway {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                {partner.name}
              </h2>
            </div>
          </div>

          <span
            className={`hidden rounded-full border px-3 py-1 text-xs font-semibold sm:inline-flex ${accent.badge}`}
          >
            Independent
          </span>
        </div>

        <div className="mt-6">
          <span className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-100">
            {partner.status}
          </span>
        </div>

        <p className={`mt-5 text-sm font-semibold leading-6 ${accent.text}`}>
          {partner.lane}
        </p>

        <p className="mt-4 text-base leading-7 text-slate-300">
          {partner.summary}
        </p>

        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="mt-7 inline-flex min-h-12 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3 text-left font-semibold text-white transition hover:border-white/25 hover:bg-white/[0.075] focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:w-auto sm:min-w-[310px]"
        >
          <span>{open ? "Close Governance View" : "Open Governance View"}</span>
          <span
            aria-hidden="true"
            className={`ml-5 text-xl transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
      </div>

      <div
        className={`relative grid transition-[grid-template-rows] duration-500 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 bg-black/25 p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <section>
                <p className={`text-xs font-bold uppercase tracking-[0.22em] ${accent.text}`}>
                  Specialized review surfaces
                </p>

                <ul className="mt-5 space-y-3">
                  {partner.governs.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-6 text-slate-200"
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-200">
                    Network contribution
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {partner.contribution}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.035] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">
                    Declared boundary
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {partner.boundary}
                  </p>
                </div>
              </section>
            </div>

            <div className="mt-7 border-t border-white/10 pt-6">
              <a
                href={partner.pathwayUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              >
                Open Full Public Pathway
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PartnerReviewNetworkWorkspacePage() {
  return (
    <>
      <CosmicBackground />

      <main className="relative isolate overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-12">
        <section className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/45 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(34,211,238,0.11),transparent_24%),radial-gradient(circle_at_18%_80%,rgba(139,92,246,0.1),transparent_28%)]" />
            <div className="absolute left-[64%] top-1/2 hidden h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-white/10 lg:block" />
            <div className="absolute left-[69%] top-1/2 hidden h-[25rem] w-[25rem] -translate-y-1/2 rounded-full border border-cyan-300/15 lg:block" />
            <div className="absolute left-[74%] top-1/2 hidden h-[16rem] w-[16rem] -translate-y-1/2 rounded-full border border-violet-300/15 lg:block" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.18fr_0.82fr]">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.95)]" />
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">
                    Independent Governance Network
                  </span>
                </div>

                <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                  TA-14 Partner
                  <span className="block bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">
                    Review Network
                  </span>
                </h1>

                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                  Independent architectures remain independent. Their specialized
                  findings enter a written pathway, meet declared boundaries, and
                  receive TA-14 second-layer admissible-execution review.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#network"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  >
                    Enter the Network
                  </a>
                  <a
                    href="#architecture"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.045] px-6 py-3 font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  >
                    See the Architecture
                  </a>
                </div>
              </div>

              <div className="relative mx-auto aspect-square w-full max-w-[430px]">
                <div className="absolute inset-[7%] animate-[spin_28s_linear_infinite] rounded-full border border-cyan-300/20" />
                <div className="absolute inset-[18%] animate-[spin_20s_linear_infinite_reverse] rounded-full border border-violet-300/20" />
                <div className="absolute inset-[29%] animate-[spin_14s_linear_infinite] rounded-full border border-amber-300/20" />

                <div className="absolute left-1/2 top-[7%] h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(34,211,238,1)]" />
                <div className="absolute right-[13%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-violet-300 shadow-[0_0_22px_rgba(167,139,250,1)]" />
                <div className="absolute bottom-[11%] left-[22%] h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_22px_rgba(252,211,77,1)]" />

                <div className="absolute inset-[24%] rounded-full border border-white/10 bg-slate-950/65 p-5 shadow-[0_0_90px_rgba(34,211,238,0.12)] backdrop-blur-xl">
                  <img
                    src="/images/ta-14-partner-review-network-emblem.png"
                    alt="TA-14 Partner Review Network emblem"
                    className="h-full w-full rounded-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="network"
          className="mx-auto max-w-7xl scroll-mt-28 py-16 sm:py-20"
        >
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
                Current pathways
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Three specialized governance lenses. One bounded network.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                Each pathway declares what it reviews, what it contributes, and
                what it does not prove. TA-14 does not absorb the partner
                architecture. It reviews the consequence-bearing route around it.
              </p>

              <div className="mt-8 rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.045] p-6 backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Network rule
                </p>
                <p className="mt-4 text-xl font-semibold leading-8 text-white">
                  Independence is preserved. Boundaries are written. Claims stay
                  attached to evidence.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {partners.map((partner, index) => (
                <PartnerCard
                  key={partner.name}
                  partner={partner}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          id="architecture"
          className="mx-auto max-w-7xl scroll-mt-28 overflow-hidden rounded-[34px] border border-white/10 bg-slate-950/50 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8 lg:p-10"
        >
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-violet-200">
              Network architecture
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Specialized governance without architectural absorption
            </h2>
          </div>

          <div className="relative mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-cyan-300/20 via-white/25 to-amber-300/20 xl:block" />

            {[
              [
                "01",
                "Independent architecture",
                "The partner preserves its own identity, methods, system, expertise, and review layer.",
              ],
              [
                "02",
                "Written boundary",
                "The pathway states what is reviewed, what the evidence supports, and what remains outside scope.",
              ],
              [
                "03",
                "Specialized assessment",
                "The partner reviews the governance surfaces inside its declared field of competence.",
              ],
              [
                "04",
                "TA-14 second layer",
                "TA-14 reviews whether the larger consequence-bearing route supports admissible execution.",
              ],
            ].map(([number, title, text], index) => (
              <article
                key={number}
                className="relative rounded-[26px] border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055]"
              >
                <div
                  className={`relative z-10 grid h-12 w-12 place-items-center rounded-2xl border text-sm font-black ${
                    index === 0
                      ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-100"
                      : index === 1
                        ? "border-violet-300/25 bg-violet-300/10 text-violet-100"
                        : index === 2
                          ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
                          : "border-white/15 bg-white/[0.06] text-white"
                  }`}
                >
                  {number}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(135deg,rgba(34,211,238,0.07),rgba(139,92,246,0.05),rgba(245,158,11,0.04))] p-7 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              The TA-14 admissibility chain
            </p>
            <p className="mt-5 text-xl font-semibold leading-9 text-white sm:text-2xl">
              Reality → Record → Continuity → Admissibility → Binding → Commit →
              Execution → Outcome
            </p>
            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300">
              A specialized review may be strong without being route-complete.
              TA-14 asks whether the evidence, authority, binding, execution, and
              formed outcome remain admissible across the entire route.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl py-16 text-center sm:py-20">
          <div className="mx-auto mb-7 h-px w-40 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-200">
            Network principle
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            No admissible evidence.
            <span className="block text-slate-300">No admissible execution.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            The TA-14 Partner Review Network does not sell blanket approval. It
            preserves independence, written boundaries, evidence discipline, and
            second-layer scrutiny before stronger claims are permitted.
          </p>
        </section>
      </main>

      <style jsx global>{`
        @keyframes starPulse {
          0%,
          100% {
            opacity: 0.18;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.35);
          }
        }

        @keyframes orbitSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbitSpinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes lineDrift {
          0% {
            transform: translate3d(-12%, -8%, 0) rotate(var(--angle));
            opacity: 0.12;
          }
          50% {
            opacity: 0.45;
          }
          100% {
            transform: translate3d(14%, 10%, 0) rotate(var(--angle));
            opacity: 0.12;
          }
        }

        .cosmic-star {
          animation-name: starPulse;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .orbit {
          position: absolute;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .orbit-one {
          width: 42rem;
          height: 42rem;
          left: -14rem;
          top: 8rem;
          animation-name: orbitSpin;
          animation-duration: 38s;
        }

        .orbit-two {
          width: 34rem;
          height: 34rem;
          right: -11rem;
          top: 22rem;
          animation-name: orbitSpinReverse;
          animation-duration: 31s;
        }

        .orbit-three {
          width: 48rem;
          height: 48rem;
          left: 28%;
          bottom: -28rem;
          animation-name: orbitSpin;
          animation-duration: 46s;
        }

        .orbit-node {
          position: absolute;
          left: 50%;
          top: -5px;
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          transform: translateX(-50%);
        }

        .network-line {
          position: absolute;
          width: 48rem;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(125, 211, 252, 0.55),
            rgba(196, 181, 253, 0.35),
            transparent
          );
          transform-origin: center;
          animation: lineDrift 14s ease-in-out infinite alternate;
        }

        .line-one {
          --angle: 18deg;
          left: -8rem;
          top: 22%;
        }

        .line-two {
          --angle: -22deg;
          right: -12rem;
          top: 42%;
          animation-delay: -4s;
        }

        .line-three {
          --angle: 9deg;
          left: 14%;
          top: 68%;
          animation-delay: -7s;
        }

        .line-four {
          --angle: -11deg;
          right: 6%;
          top: 82%;
          animation-delay: -10s;
        }

        @media (prefers-reduced-motion: reduce) {
          .cosmic-star,
          .orbit,
          .network-line {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
