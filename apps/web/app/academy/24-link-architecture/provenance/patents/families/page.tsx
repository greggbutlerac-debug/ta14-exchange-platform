"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  type TA14LinkId,
} from "@/lib/academy/ta14-24-link-canon";
import {
  listTA14CanonicalLinkSources,
  listTA14CanonicalSources,
  type TA14CanonicalLinkSourceRecord,
  type TA14CanonicalSourceRecord,
} from "@/lib/academy/ta14-canonical-registry";

type FamilyView = {
  number: number;
  name: string;
  applications: TA14CanonicalSourceRecord[];
  coveredLinks: TA14LinkId[];
  relationshipCount: number;
};

function familyNumber(source: TA14CanonicalSourceRecord): number | null {
  const value = source.metadata?.patent_family;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function familyName(source: TA14CanonicalSourceRecord): string {
  const value = source.metadata?.patent_family_name;

  return typeof value === "string" && value.trim()
    ? value
    : "Unclassified Patent Family";
}

function portfolioOrder(source: TA14CanonicalSourceRecord): number {
  return typeof source.metadata?.portfolio_order === "number"
    ? source.metadata.portfolio_order
    : 999;
}

function isRegistryUnavailable(error: string | null): boolean {
  if (!error) return false;

  return /ta14_canonical_sources|schema cache|relation .* does not exist/i.test(
    error,
  );
}

export default function TA14PatentFamiliesPage() {
  const [sources, setSources] = useState<TA14CanonicalSourceRecord[]>([]);
  const [relations, setRelations] = useState<TA14CanonicalLinkSourceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [sourceRows, relationRows] = await Promise.all([
          listTA14CanonicalSources(),
          listTA14CanonicalLinkSources(),
        ]);

        if (cancelled) return;

        setSources(
          sourceRows.filter(
            (source) => source.sourceType === "patent_application",
          ),
        );

        setRelations(
          relationRows.filter(
            (relation) => relation.relationType === "patent_position",
          ),
        );
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load patent families.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const families = useMemo<FamilyView[]>(() => {
    const grouped = new Map<number, TA14CanonicalSourceRecord[]>();

    for (const source of sources) {
      const number = familyNumber(source);
      if (number == null) continue;

      const list = grouped.get(number) ?? [];
      list.push(source);
      grouped.set(number, list);
    }

    return [...grouped.entries()]
      .sort(([a], [b]) => a - b)
      .map(([number, applications]) => {
        const sourceIds = new Set(applications.map((item) => item.id));
        const familyRelations = relations.filter((relation) =>
          sourceIds.has(relation.sourceId),
        );
        const coveredLinks = [...new Set(familyRelations.map((r) => r.linkId))];

        return {
          number,
          name: familyName(applications[0]),
          applications: [...applications].sort(
            (a, b) => portfolioOrder(a) - portfolioOrder(b),
          ),
          coveredLinks,
          relationshipCount: familyRelations.length,
        };
      });
  }, [relations, sources]);

  const totals = useMemo(() => {
    const uniqueCoveredLinks = new Set<TA14LinkId>();

    for (const family of families) {
      for (const linkId of family.coveredLinks) {
        uniqueCoveredLinks.add(linkId);
      }
    }

    return {
      families: families.length,
      applications: sources.length,
      links: uniqueCoveredLinks.size,
      relationships: relations.length,
    };
  }, [families, relations.length, sources.length]);

  const registryUnavailable = isRegistryUnavailable(error);

  return (
    <main className="families">
      <style>{`
        .families {
          --bg: #020711;
          --panel: rgba(8, 20, 32, .86);
          --panel2: rgba(10, 26, 40, .76);
          --line: rgba(129, 176, 210, .14);
          --lineStrong: rgba(84, 232, 255, .26);
          --amber: #f1c769;
          --amberSoft: #ffe8aa;
          --cyan: #54e8ff;
          --cyanSoft: #c4f8ff;
          --indigo: #a8b2ff;
          --indigoSoft: #e0e4ff;
          --green: #45eaa6;
          --greenSoft: #c8f7df;
          --rose: #ff96ad;
          --roseSoft: #ffd1dc;
          --text: #eff8ff;
          --muted: #93a8ba;
          --dim: #647b8f;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 9% 0%, rgba(241,199,105,.12), transparent 24%),
            radial-gradient(circle at 92% 5%, rgba(168,178,255,.10), transparent 25%),
            linear-gradient(180deg, #020711 0%, #030a13 55%, #020711 100%);
        }

        .families * {
          box-sizing: border-box;
        }

        .families-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .families-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .families-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: linear-gradient(to bottom, #000, transparent 90%);
          opacity: .38;
        }

        .families-topline {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 20px;
        }

        .families-back {
          color: var(--cyanSoft);
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }

        .families-badge {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(241,199,105,.20);
          border-radius: 999px;
          background: rgba(241,199,105,.05);
          color: var(--amberSoft);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .families-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(420px, .92fr);
          gap: 64px;
          align-items: center;
          padding: 72px 0 84px;
        }

        .families-kicker {
          color: var(--amber);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .20em;
          text-transform: uppercase;
        }

        .families-title {
          max-width: 980px;
          margin: 14px 0 0;
          font-size: clamp(3.15rem, 6vw, 6.15rem);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .families-title span {
          display: block;
          color: var(--amberSoft);
        }

        .families-lead {
          max-width: 920px;
          margin: 26px 0 0;
          color: #c8d8e4;
          font-size: clamp(1rem, 1.35vw, 1.18rem);
          line-height: 1.8;
        }

        .families-rules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .families-rule {
          padding: 7px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.026);
          color: var(--muted);
          font-size: .56rem;
          font-weight: 850;
        }

        .families-orbit {
          position: relative;
          width: min(510px, 100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .families-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(129,176,210,.10);
          border-radius: 50%;
        }

        .families-ring.r1 { width: 96%; height: 96%; }
        .families-ring.r2 {
          width: 76%;
          height: 76%;
          border-color: rgba(241,199,105,.14);
        }
        .families-ring.r3 {
          width: 56%;
          height: 56%;
          border-color: rgba(84,232,255,.12);
        }
        .families-ring.r4 {
          width: 36%;
          height: 36%;
          border-color: rgba(168,178,255,.12);
        }

        .families-axis-h,
        .families-axis-v {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .families-axis-h {
          width: 88%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(241,199,105,.16),
            transparent
          );
        }

        .families-axis-v {
          width: 1px;
          height: 88%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(84,232,255,.13),
            transparent
          );
        }

        .families-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 184px;
          height: 184px;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(241,199,105,.27);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(241,199,105,.13), transparent 44%),
            rgba(5,16,27,.95);
          box-shadow: 0 0 90px rgba(241,199,105,.09);
          text-align: center;
        }

        .families-core small {
          display: block;
          color: var(--amber);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .families-core strong {
          display: block;
          margin-top: 5px;
          font-size: 3.4rem;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .families-core span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
        }

        .families-node {
          position: absolute;
          min-width: 118px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 12px 34px rgba(0,0,0,.24);
        }

        .families-node b {
          display: block;
          color: var(--amber);
          font-size: .55rem;
          letter-spacing: .12em;
        }

        .families-node span {
          display: block;
          margin-top: 4px;
          color: #d7e5ef;
          font-size: .66rem;
          font-weight: 850;
        }

        .families-node.n1 { left: 0; top: 18%; }
        .families-node.n2 { right: 0; top: 24%; }
        .families-node.n3 { right: 4%; bottom: 18%; }
        .families-node.n4 { left: 0; bottom: 18%; }
        .families-node.n5 {
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }

        .families-metrics {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.76);
        }

        .families-metric-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .families-metric {
          min-height: 98px;
          padding: 20px;
          border-right: 1px solid var(--line);
        }

        .families-metric:last-child {
          border-right: 0;
        }

        .families-metric strong {
          display: block;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .families-metric span {
          display: block;
          margin-top: 8px;
          color: var(--dim);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .families-section {
          padding: 72px 0 90px;
        }

        .families-section.alt {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.66);
        }

        .families-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .families-eyebrow {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .families-h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.7rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .families-section-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .families-status {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: rgba(255,255,255,.024);
        }

        .families-status-head {
          padding: 20px 22px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.06), transparent 42%),
            rgba(255,255,255,.01);
        }

        .families-status-head small {
          display: block;
          color: var(--cyan);
          font-size: .54rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .families-status-head h3 {
          margin: 8px 0 0;
          font-size: 1.35rem;
          line-height: 1.2;
        }

        .families-status-body {
          padding: 20px 22px 22px;
        }

        .families-status-body p {
          margin: 0;
          color: var(--muted);
          font-size: .72rem;
          line-height: 1.7;
        }

        .families-status.error {
          border-color: rgba(255,150,173,.18);
          background:
            radial-gradient(circle at 100% 0%, rgba(255,150,173,.06), transparent 42%),
            rgba(255,150,173,.025);
        }

        .families-status.error .families-status-head small {
          color: var(--rose);
        }

        .families-status.error .families-status-head h3 {
          color: var(--roseSoft);
        }

        .families-family-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .families-family {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.024);
          transition: 170ms ease;
        }

        .families-family:hover {
          transform: translateY(-3px);
          border-color: rgba(241,199,105,.24);
          background:
            radial-gradient(circle at 100% 0%, rgba(241,199,105,.06), transparent 42%),
            rgba(241,199,105,.025);
        }

        .families-family::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(241,199,105,.55),
            transparent
          );
          opacity: .7;
        }

        .families-family-head {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          align-items: start;
          padding: 22px 22px 20px;
          border-bottom: 1px solid var(--line);
        }

        .families-family-kicker {
          color: var(--amber);
          font-size: .54rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .families-family h3 {
          margin: 8px 0 0;
          font-size: 1.42rem;
          line-height: 1.15;
          letter-spacing: -.025em;
        }

        .families-family-number {
          color: rgba(255,255,255,.10);
          font-size: 4.4rem;
          line-height: .8;
          font-weight: 950;
          letter-spacing: -.08em;
        }

        .families-family-body {
          padding: 20px 22px 22px;
        }

        .families-badge-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .families-stat {
          min-height: 72px;
          padding: 11px 10px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: rgba(0,0,0,.10);
          text-align: center;
        }

        .families-stat strong {
          display: block;
          font-size: 1.15rem;
          line-height: 1;
        }

        .families-stat span {
          display: block;
          margin-top: 6px;
          color: var(--dim);
          font-size: .48rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .families-map {
          margin-top: 18px;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(0,0,0,.10);
        }

        .families-map-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 11px 13px;
          border-bottom: 1px solid var(--line);
        }

        .families-map-head small {
          color: var(--dim);
          font-size: .49rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .families-map-head span {
          color: var(--cyan);
          font-size: .55rem;
          font-weight: 850;
        }

        .families-link-list {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          padding: 12px;
        }

        .families-link-chip {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 9px;
          border: 1px solid rgba(84,232,255,.14);
          border-radius: 999px;
          background: rgba(84,232,255,.035);
          color: var(--cyanSoft);
          font-size: .53rem;
          font-weight: 850;
          text-decoration: none;
          transition: 150ms ease;
        }

        .families-link-chip:hover {
          transform: translateY(-1px);
          border-color: rgba(84,232,255,.28);
          background: rgba(84,232,255,.065);
        }

        .families-empty-links {
          padding: 13px;
          color: var(--muted);
          font-size: .63rem;
          line-height: 1.55;
        }

        .families-apps {
          margin-top: 18px;
        }

        .families-apps-label {
          color: var(--dim);
          font-size: .49rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .families-app-list {
          display: grid;
          gap: 9px;
          margin-top: 10px;
        }

        .families-app {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          min-height: 86px;
          padding: 13px 14px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(0,0,0,.10);
          color: var(--text);
          text-decoration: none;
          transition: 160ms ease;
        }

        .families-app:hover {
          transform: translateX(2px);
          border-color: rgba(241,199,105,.24);
          background: rgba(241,199,105,.03);
        }

        .families-app-id {
          color: var(--cyan);
          font-size: .57rem;
          font-weight: 900;
        }

        .families-app-title {
          margin-top: 6px;
          color: #e9f4fb;
          font-size: .68rem;
          font-weight: 820;
          line-height: 1.5;
        }

        .families-app-arrow {
          color: var(--amber);
          font-size: 1rem;
        }

        .families-boundary {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.72);
        }

        .families-boundary-grid {
          display: grid;
          grid-template-columns: minmax(0, .88fr) minmax(0, 1.12fr);
          gap: 34px;
          align-items: start;
          padding: 72px 0;
        }

        .families-boundary h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.4rem);
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .families-boundary p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.75;
        }

        .families-boundary-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .families-boundary-card {
          min-height: 148px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(255,255,255,.022);
        }

        .families-boundary-card b {
          color: var(--amber);
          font-size: .56rem;
          letter-spacing: .12em;
        }

        .families-boundary-card strong {
          display: block;
          margin-top: 8px;
          font-size: .76rem;
        }

        .families-boundary-card span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.55;
        }

        .families-close {
          padding: 76px 0 98px;
          text-align: center;
        }

        .families-close h2 {
          max-width: 920px;
          margin: 10px auto 0;
          font-size: clamp(2.3rem, 4.2vw, 4.6rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .families-close p {
          max-width: 760px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .families-close-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 26px;
        }

        .families-button {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: rgba(255,255,255,.025);
          color: #dceaf4;
          font-size: .64rem;
          font-weight: 900;
          text-decoration: none;
          transition: 160ms ease;
        }

        .families-button.primary {
          border-color: rgba(241,199,105,.25);
          background: rgba(241,199,105,.065);
          color: var(--amberSoft);
        }

        .families-button:hover {
          transform: translateY(-2px);
          border-color: var(--lineStrong);
        }

        @media (max-width: 1180px) {
          .families-hero-grid {
            grid-template-columns: 1fr;
          }

          .families-orbit {
            max-width: 500px;
          }
        }

        @media (max-width: 900px) {
          .families-shell {
            width: min(100% - 28px, 1460px);
          }

          .families-topline,
          .families-section-head,
          .families-boundary-grid {
            display: grid;
            align-items: start;
          }

          .families-title {
            font-size: clamp(2.8rem, 13vw, 4.8rem);
          }

          .families-family-grid {
            grid-template-columns: 1fr;
          }

          .families-boundary-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .families-metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .families-metric {
            border-bottom: 1px solid var(--line);
          }

          .families-metric:nth-child(2n) {
            border-right: 0;
          }

          .families-boundary-cards {
            grid-template-columns: 1fr;
          }

          .families-family-head {
            grid-template-columns: 1fr;
          }

          .families-family-number {
            font-size: 3.2rem;
          }

          .families-node {
            display: none;
          }

          .families-close-actions {
            display: grid;
          }
        }
      `}</style>

      <section className="families-hero">
        <div className="families-shell families-topline">
          <Link
            href="/academy/24-link-architecture/provenance/patents"
            className="families-back"
          >
            ← Patent Portfolio Map
          </Link>

          <span className="families-badge">
            Patent Portfolio · Family View
          </span>
        </div>

        <div className="families-shell families-hero-grid">
          <div>
            <div className="families-kicker">
              TA-14 Patent Portfolio · Family View
            </div>

            <h1 className="families-title">
              Eight patent families across the
              <span>admissible-execution architecture.</span>
            </h1>

            <p className="families-lead">
              Each family groups related application records while preserving
              the bounded 24-link architecture relationships recorded for the
              individual filings inside that family.
            </p>

            <div className="families-rules">
              <span className="families-rule">Family ≠ claim scope</span>
              <span className="families-rule">Applications remain distinct</span>
              <span className="families-rule">24-link maps remain bounded</span>
              <span className="families-rule">Public record remains inspectable</span>
            </div>
          </div>

          <div
            className="families-orbit"
            aria-label="TA-14 patent family architecture motif"
          >
            <div className="families-ring r1" />
            <div className="families-ring r2" />
            <div className="families-ring r3" />
            <div className="families-ring r4" />
            <div className="families-axis-h" />
            <div className="families-axis-v" />

            <div className="families-core">
              <div>
                <small>PATENT FAMILIES</small>
                <strong>{loading ? "…" : totals.families}</strong>
                <span>family groupings loaded</span>
              </div>
            </div>

            <div className="families-node n1">
              <b>{loading ? "—" : totals.applications}</b>
              <span>Applications</span>
            </div>

            <div className="families-node n2">
              <b>{loading ? "—" : totals.links}</b>
              <span>24-link positions</span>
            </div>

            <div className="families-node n3">
              <b>{loading ? "—" : totals.relationships}</b>
              <span>Bounded maps</span>
            </div>

            <div className="families-node n4">
              <b>APP</b>
              <span>Application level</span>
            </div>

            <div className="families-node n5">
              <b>FAM</b>
              <span>Portfolio structure</span>
            </div>
          </div>
        </div>
      </section>

      <section className="families-metrics">
        <div className="families-shell families-metric-grid">
          <Metric value={loading ? "—" : String(totals.families)} label="Patent families" />
          <Metric value={loading ? "—" : String(totals.applications)} label="Application records" />
          <Metric value={loading ? "—" : String(totals.links)} label="24-link positions represented" />
          <Metric value={loading ? "—" : String(totals.relationships)} label="Bounded relationships" />
        </div>
      </section>

      <section className="families-section">
        <div className="families-shell">
          <div className="families-section-head">
            <div>
              <div className="families-eyebrow" style={{ color: "var(--amber)" }}>
                Family architecture
              </div>

              <h2 className="families-h2">
                Read the portfolio by family without erasing the filings inside it.
              </h2>
            </div>

            <p className="families-section-copy">
              Family aggregation is useful for orientation, but every link map
              remains grounded in individual application records. Open any
              application to inspect its own bounded architecture relationships.
            </p>
          </div>

          {loading ? (
            <StatusCard
              eyebrow="Loading portfolio structure"
              title="Resolving patent families…"
              body="Loading patent application records, family metadata, and bounded patent-position relationships from the canonical registry."
            />
          ) : error ? (
            <StatusCard
              error
              eyebrow="Registry attention"
              title={
                registryUnavailable
                  ? "Canonical patent-family registry not yet available in production"
                  : "Patent families unavailable"
              }
              body={
                registryUnavailable
                  ? "The Patent Family experience is available, but the canonical source registry required to populate family and application records has not yet been initialized or exposed in the production schema. No family coverage, application relationship, or patent position is being inferred to fill that gap."
                  : "TA-14 could not load the patent-family registry. The family-level architecture boundary remains available while the canonical source data is restored."
              }
            />
          ) : families.length === 0 ? (
            <StatusCard
              eyebrow="No family records loaded"
              title="Patent-family records are not yet available."
              body="The family workspace will populate when patent-application source records include patent-family metadata and bounded patent-position relationships in the canonical registry."
            />
          ) : (
            <div className="families-family-grid">
              {families.map((family) => {
                const coveredLinkRecords = family.coveredLinks
                  .map((linkId) =>
                    TA14_24_LINKS.find((link) => link.linkId === linkId),
                  )
                  .filter(
                    (link): link is (typeof TA14_24_LINKS)[number] =>
                      Boolean(link),
                  )
                  .sort((a, b) => a.order - b.order);

                return (
                  <article
                    key={family.number}
                    className="families-family"
                  >
                    <div className="families-family-head">
                      <div>
                        <div className="families-family-kicker">
                          Patent Family {family.number}
                        </div>

                        <h3>{family.name}</h3>
                      </div>

                      <div className="families-family-number">
                        {String(family.number).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="families-family-body">
                      <div className="families-badge-row">
                        <Stat
                          value={String(family.applications.length)}
                          label="Applications"
                        />
                        <Stat
                          value={String(family.coveredLinks.length)}
                          label="Links"
                        />
                        <Stat
                          value={String(family.relationshipCount)}
                          label="Maps"
                        />
                      </div>

                      <div className="families-map">
                        <div className="families-map-head">
                          <small>Family aggregate · bounded 24-link positions</small>
                          <span>{coveredLinkRecords.length} represented</span>
                        </div>

                        {coveredLinkRecords.length ? (
                          <div className="families-link-list">
                            {coveredLinkRecords.map((link) => (
                              <Link
                                key={link.linkId}
                                href={`/academy/24-link-architecture/${String(
                                  link.order,
                                ).padStart(2, "0")}-${link.slug}`}
                                className="families-link-chip"
                              >
                                {String(link.order).padStart(2, "0")} {link.canonicalName}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="families-empty-links">
                            No bounded patent-position relationships are currently recorded for applications in this family.
                          </div>
                        )}
                      </div>

                      <div className="families-apps">
                        <div className="families-apps-label">
                          Individual application records
                        </div>

                        <div className="families-app-list">
                          {family.applications.map((application) => (
                            <Link
                              key={application.id}
                              href={`/academy/24-link-architecture/provenance/patents?application=${encodeURIComponent(
                                application.sourceIdentifier ?? application.id,
                              )}`}
                              className="families-app"
                            >
                              <div>
                                <div className="families-app-id">
                                  {application.sourceIdentifier ?? "Identifier pending"}
                                </div>

                                <div className="families-app-title">
                                  {application.title}
                                </div>
                              </div>

                              <span className="families-app-arrow">→</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="families-boundary">
        <div className="families-shell families-boundary-grid">
          <div>
            <div className="families-eyebrow" style={{ color: "var(--amber)" }}>
              Family-level boundary
            </div>

            <h2>
              Portfolio structure is not patent claim construction.
            </h2>

            <p>
              Family grouping helps explain the structure of the public TA-14
              patent portfolio, but it does not convert a family label into a
              claim that every application within the family covers every
              architecture link shown by the family aggregate.
            </p>
          </div>

          <div className="families-boundary-cards">
            <BoundaryCard
              code="FAM"
              title="Family is an organizational layer"
              text="A patent family groups related application records for portfolio orientation; it does not erase the identity or filing posture of the individual applications."
            />

            <BoundaryCard
              code="APP"
              title="Application remains the evidence record"
              text="Architecture relationships are recorded at the application/source level before they are aggregated into a family view."
            />

            <BoundaryCard
              code="MAP"
              title="Mapped link remains bounded"
              text="A 24-link patent-position relationship is an architectural map, not a conclusion about patent validity, infringement, or legal claim scope."
            />

            <BoundaryCard
              code="AGG"
              title="Aggregate does not become universal coverage"
              text="A family may collectively touch several links without every application inside that family being related to every link shown in the aggregate."
            />
          </div>
        </div>
      </section>

      <section className="families-close">
        <div className="families-shell">
          <div className="families-eyebrow" style={{ color: "var(--amber)" }}>
            Inspect the portfolio at the right resolution
          </div>

          <h2>
            See the family.
            <br />
            Preserve the filing.
          </h2>

          <p>
            Use the family view to understand portfolio structure, then open
            the Patent Portfolio Map to inspect the individual application and
            its bounded relationship to the 24-link architecture.
          </p>

          <div className="families-close-actions">
            <Link
              href="/academy/24-link-architecture/provenance/patents"
              className="families-button primary"
            >
              Open Patent Portfolio Map →
            </Link>

            <Link
              href="/academy/24-link-architecture/provenance"
              className="families-button"
            >
              Return to Provenance Map
            </Link>

            <Link
              href="/academy/24-link-architecture"
              className="families-button"
            >
              Open 24-Link Explorer
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="families-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="families-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function StatusCard({
  eyebrow,
  title,
  body,
  error = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  error?: boolean;
}) {
  return (
    <section
      className={[
        "families-status",
        error ? "error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="families-status-head">
        <small>{eyebrow}</small>
        <h3>{title}</h3>
      </div>

      <div className="families-status-body">
        <p>{body}</p>
      </div>
    </section>
  );
}

function BoundaryCard({
  code,
  title,
  text,
}: {
  code: string;
  title: string;
  text: string;
}) {
  return (
    <article className="families-boundary-card">
      <b>{code}</b>
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}
