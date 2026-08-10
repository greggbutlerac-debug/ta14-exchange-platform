"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

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

type PatentFamily = {
  number: number;
  name: string;
  applications: TA14CanonicalSourceRecord[];
};

function patentFamilyNumber(
  source: TA14CanonicalSourceRecord,
): number | null {
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

function patentFamilyName(
  source: TA14CanonicalSourceRecord,
): string {
  const value = source.metadata?.patent_family_name;

  return typeof value === "string" && value.trim()
    ? value
    : "Unclassified Patent Family";
}

export default function TA14PatentPortfolioMapPage() {
  return (
    <Suspense fallback={<PatentPortfolioRouteLoading />}>
      <TA14PatentPortfolioMapContent />
    </Suspense>
  );
}

function TA14PatentPortfolioMapContent() {
  const searchParams = useSearchParams();
  const requestedApplication = searchParams.get("application");
  const requestedLink = searchParams.get("link");

  const [sources, setSources] = useState<TA14CanonicalSourceRecord[]>([]);
  const [relations, setRelations] = useState<
    TA14CanonicalLinkSourceRecord[]
  >([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [sourceRecords, relationRecords] = await Promise.all([
          listTA14CanonicalSources(),
          listTA14CanonicalLinkSources(),
        ]);

        if (cancelled) return;

        const patentSources = sourceRecords.filter(
          (source) => source.sourceType === "patent_application",
        );

        setSources(patentSources);
        setRelations(
          relationRecords.filter(
            (relation) => relation.relationType === "patent_position",
          ),
        );

        if (patentSources.length > 0) {
          const requestedApplicationRecord = requestedApplication
            ? patentSources.find(
                (source) =>
                  source.sourceIdentifier === requestedApplication ||
                  source.id === requestedApplication,
              )
            : null;

          const validRequestedLink = requestedLink
            ? TA14_24_LINKS.find(
                (link) => link.linkId === requestedLink,
              )
            : null;

          const firstSourceForRequestedLink = validRequestedLink
            ? patentSources.find((source) =>
                relationRecords.some(
                  (relation) =>
                    relation.relationType === "patent_position" &&
                    relation.linkId === validRequestedLink.linkId &&
                    relation.sourceId === source.id,
                ),
              )
            : null;

          setSelectedSourceId(
            requestedApplicationRecord?.id ??
              firstSourceForRequestedLink?.id ??
              patentSources[0].id,
          );
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load TA-14 patent portfolio.",
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
  }, [requestedApplication, requestedLink]);

  const families = useMemo<PatentFamily[]>(() => {
    const grouped = new Map<number, PatentFamily>();

    for (const source of sources) {
      const number = patentFamilyNumber(source);

      if (number == null) continue;

      const existing = grouped.get(number);

      if (existing) {
        existing.applications.push(source);
      } else {
        grouped.set(number, {
          number,
          name: patentFamilyName(source),
          applications: [source],
        });
      }
    }

    return [...grouped.values()]
      .sort((a, b) => a.number - b.number)
      .map((family) => ({
        ...family,
        applications: [...family.applications].sort((a, b) => {
          const aOrder =
            typeof a.metadata?.portfolio_order === "number"
              ? a.metadata.portfolio_order
              : 999;
          const bOrder =
            typeof b.metadata?.portfolio_order === "number"
              ? b.metadata.portfolio_order
              : 999;

          return aOrder - bOrder;
        }),
      }));
  }, [sources]);

  const selectedSource = useMemo(
    () =>
      sources.find((source) => source.id === selectedSourceId) ?? null,
    [sources, selectedSourceId],
  );

  const selectedRelations = useMemo(
    () =>
      selectedSource
        ? relations
            .filter(
              (relation) => relation.sourceId === selectedSource.id,
            )
            .sort((a, b) => {
              const aLink = TA14_24_LINKS.find(
                (link) => link.linkId === a.linkId,
              );
              const bLink = TA14_24_LINKS.find(
                (link) => link.linkId === b.linkId,
              );

              return (aLink?.order ?? 999) - (bLink?.order ?? 999);
            })
        : [],
    [relations, selectedSource],
  );

  const coveredLinks = useMemo(() => {
    const ids = new Set<TA14LinkId>(
      relations.map((relation) => relation.linkId),
    );

    return TA14_24_LINKS.filter((link) => ids.has(link.linkId));
  }, [relations]);

  const focusedLink = useMemo(
    () =>
      requestedLink
        ? TA14_24_LINKS.find(
            (link) => link.linkId === requestedLink,
          ) ?? null
        : null,
    [requestedLink],
  );

  const focusedSourceIds = useMemo(() => {
    if (!focusedLink) {
      return new Set<string>();
    }

    return new Set(
      relations
        .filter(
          (relation) => relation.linkId === focusedLink.linkId,
        )
        .map((relation) => relation.sourceId),
    );
  }, [focusedLink, relations]);

  const registryUnavailable =
    Boolean(error) &&
    /ta14_canonical_sources|schema cache|relation .* does not exist/i.test(
      error ?? "",
    );

  return (
    <main className="patent">
      <style>{`
        .patent {
          --bg: #020711;
          --panel: rgba(8, 20, 32, .86);
          --panel-2: rgba(10, 26, 40, .76);
          --line: rgba(129, 176, 210, .14);
          --line-strong: rgba(84, 232, 255, .26);
          --cyan: #54e8ff;
          --cyan-soft: #c4f8ff;
          --indigo: #a8b2ff;
          --green: #45eaa6;
          --amber: #f1c769;
          --amber-soft: #ffe9ac;
          --rose: #ff9ab0;
          --text: #eff8ff;
          --muted: #93a8ba;
          --dim: #647b8f;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 10% 0%, rgba(241,199,105,.11), transparent 24%),
            radial-gradient(circle at 91% 5%, rgba(84,232,255,.08), transparent 25%),
            linear-gradient(180deg, #020711 0%, #030a13 55%, #020711 100%);
        }

        .patent * { box-sizing: border-box; }

        .patent-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .patent-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .patent-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
          background-size: 58px 58px;
          mask-image: linear-gradient(to bottom, #000, transparent 90%);
          opacity: .38;
        }

        .patent-topline {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 20px;
        }

        .patent-back {
          color: var(--cyan-soft);
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }

        .patent-chip {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(241,199,105,.18);
          border-radius: 999px;
          background: rgba(241,199,105,.045);
          color: var(--amber-soft);
          font-size: .62rem;
          font-weight: 900;
          text-decoration: none;
          transition: 160ms ease;
        }

        .patent-chip:hover {
          transform: translateY(-1px);
          border-color: rgba(241,199,105,.34);
          background: rgba(241,199,105,.08);
        }

        .patent-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(420px, .92fr);
          gap: 64px;
          align-items: center;
          padding: 72px 0 82px;
        }

        .patent-kicker {
          color: var(--amber);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .20em;
          text-transform: uppercase;
        }

        .patent-title {
          max-width: 980px;
          margin: 14px 0 0;
          font-size: clamp(3.2rem, 6vw, 6.2rem);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .patent-title span {
          display: block;
          color: var(--amber-soft);
        }

        .patent-lead {
          max-width: 880px;
          margin: 26px 0 0;
          color: #c8d8e4;
          font-size: clamp(1rem, 1.35vw, 1.18rem);
          line-height: 1.8;
        }

        .patent-focus {
          display: inline-grid;
          gap: 4px;
          margin-top: 24px;
          padding: 12px 14px;
          border: 1px solid rgba(84,232,255,.18);
          border-radius: 14px;
          background: rgba(84,232,255,.045);
        }

        .patent-focus small {
          color: var(--dim);
          font-size: .56rem;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .patent-focus strong {
          color: var(--cyan-soft);
          font-size: .76rem;
        }

        .patent-orbit {
          position: relative;
          width: min(510px, 100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .patent-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(241,199,105,.10);
          border-radius: 50%;
        }

        .patent-ring.r1 { width: 96%; height: 96%; }
        .patent-ring.r2 { width: 75%; height: 75%; border-color: rgba(84,232,255,.11); }
        .patent-ring.r3 { width: 54%; height: 54%; border-color: rgba(241,199,105,.14); }
        .patent-ring.r4 { width: 34%; height: 34%; border-color: rgba(168,178,255,.12); }

        .patent-axis-h,
        .patent-axis-v {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .patent-axis-h {
          width: 88%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(241,199,105,.14), transparent);
        }

        .patent-axis-v {
          width: 1px;
          height: 88%;
          background: linear-gradient(180deg, transparent, rgba(84,232,255,.12), transparent);
        }

        .patent-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 178px;
          height: 178px;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(241,199,105,.25);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(241,199,105,.12), transparent 44%),
            rgba(5,16,27,.95);
          box-shadow: 0 0 90px rgba(241,199,105,.09);
          text-align: center;
        }

        .patent-core small {
          display: block;
          color: var(--amber);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .patent-core strong {
          display: block;
          margin-top: 4px;
          font-size: 3.2rem;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .patent-core span {
          display: block;
          margin-top: 6px;
          color: var(--muted);
          font-size: .64rem;
        }

        .patent-node {
          position: absolute;
          min-width: 110px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 12px 34px rgba(0,0,0,.24);
        }

        .patent-node b {
          display: block;
          color: var(--amber);
          font-size: .56rem;
          letter-spacing: .12em;
        }

        .patent-node span {
          display: block;
          margin-top: 4px;
          color: #d7e5ef;
          font-size: .66rem;
          font-weight: 850;
        }

        .patent-node.n1 { left: 1%; top: 19%; }
        .patent-node.n2 { right: 0; top: 24%; }
        .patent-node.n3 { right: 4%; bottom: 18%; }
        .patent-node.n4 { left: 0; bottom: 18%; }
        .patent-node.n5 { left: 50%; top: 0; transform: translateX(-50%); }

        .patent-metrics {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.76);
        }

        .patent-metric-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .patent-metric {
          min-height: 98px;
          padding: 20px;
          border-right: 1px solid var(--line);
        }

        .patent-metric:last-child { border-right: 0; }

        .patent-metric strong {
          display: block;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .patent-metric span {
          display: block;
          margin-top: 8px;
          color: var(--dim);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .patent-section {
          padding: 74px 0 92px;
        }

        .patent-section.alt {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.66);
        }

        .patent-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .patent-eyebrow {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .patent-h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.7rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .patent-section-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .patent-link-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
        }

        .patent-link {
          min-height: 124px;
          display: grid;
          align-content: space-between;
          gap: 16px;
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(0,0,0,.10);
          text-decoration: none;
          transition: 160ms ease;
        }

        .patent-link:hover {
          transform: translateY(-2px);
          border-color: rgba(84,232,255,.24);
          background: rgba(84,232,255,.035);
        }

        .patent-link.covered {
          border-color: rgba(241,199,105,.18);
          background: rgba(241,199,105,.035);
        }

        .patent-link.focused {
          border-color: rgba(84,232,255,.32);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.08), transparent 46%),
            rgba(84,232,255,.045);
        }

        .patent-link-top {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 8px;
        }

        .patent-link-index {
          color: var(--cyan);
          font-size: .60rem;
          font-weight: 950;
        }

        .patent-link-count {
          padding: 4px 7px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--dim);
          font-size: .50rem;
          font-weight: 850;
        }

        .patent-link-name {
          color: #eaf4fb;
          font-size: .72rem;
          font-weight: 850;
          line-height: 1.35;
        }

        .patent-link-track {
          width: 34px;
          height: 1px;
          background: rgba(255,255,255,.10);
          transition: width 160ms ease, background 160ms ease;
        }

        .patent-link:hover .patent-link-track,
        .patent-link.focused .patent-link-track {
          width: 100%;
          background: rgba(84,232,255,.28);
        }

        .patent-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(390px, .92fr);
          gap: 20px;
          align-items: start;
        }

        .patent-families {
          display: grid;
          gap: 16px;
        }

        .patent-family {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: rgba(255,255,255,.024);
        }

        .patent-family-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
          padding: 20px 22px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(241,199,105,.06), transparent 44%),
            rgba(255,255,255,.01);
        }

        .patent-family-head small {
          display: block;
          color: var(--amber);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .patent-family-head h2 {
          margin: 7px 0 0;
          font-size: 1.35rem;
          line-height: 1.15;
          letter-spacing: -.025em;
        }

        .patent-family-head span {
          color: var(--dim);
          font-size: .60rem;
          font-weight: 850;
        }

        .patent-app-list {
          display: grid;
          gap: 10px;
          padding: 16px;
        }

        .patent-app {
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(0,0,0,.11);
          color: var(--text);
          text-align: left;
          cursor: pointer;
          transition: 160ms ease;
        }

        .patent-app:hover {
          transform: translateY(-2px);
          border-color: rgba(241,199,105,.22);
          background: rgba(241,199,105,.03);
        }

        .patent-app.active {
          border-color: rgba(241,199,105,.34);
          background:
            radial-gradient(circle at 100% 0%, rgba(241,199,105,.09), transparent 45%),
            rgba(241,199,105,.045);
        }

        .patent-app.focused {
          border-color: rgba(84,232,255,.22);
          background: rgba(84,232,255,.03);
        }

        .patent-app-top {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .patent-app-id {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 900;
        }

        .patent-app-count {
          padding: 4px 8px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--dim);
          font-size: .50rem;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .patent-app-title {
          margin-top: 10px;
          color: #edf7ff;
          font-size: .77rem;
          font-weight: 850;
          line-height: 1.55;
        }

        .patent-detail {
          position: sticky;
          top: 22px;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.025);
        }

        .patent-detail-head {
          padding: 22px 24px 20px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.07), transparent 42%),
            rgba(255,255,255,.01);
        }

        .patent-detail-head small {
          display: block;
          color: var(--amber);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .patent-detail-id {
          margin-top: 10px;
          color: var(--cyan);
          font-size: .68rem;
          font-weight: 900;
        }

        .patent-detail h2 {
          margin: 10px 0 0;
          font-size: 1.75rem;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .patent-detail-summary {
          margin: 14px 0 0;
          color: var(--muted);
          font-size: .74rem;
          line-height: 1.7;
        }

        .patent-detail-body {
          padding: 20px 24px 24px;
        }

        .patent-detail-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .patent-detail-card {
          padding: 13px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(0,0,0,.11);
        }

        .patent-detail-card span {
          display: block;
          color: var(--dim);
          font-size: .50rem;
          font-weight: 900;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .patent-detail-card strong {
          display: block;
          margin-top: 6px;
          color: #dceaf4;
          font-size: .68rem;
          line-height: 1.45;
        }

        .patent-relations {
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid var(--line);
        }

        .patent-relations > small {
          display: block;
          color: var(--dim);
          font-size: .52rem;
          font-weight: 900;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .patent-relation-list {
          display: grid;
          gap: 9px;
          margin-top: 12px;
        }

        .patent-relation {
          padding: 13px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(0,0,0,.10);
        }

        .patent-relation a {
          color: var(--cyan);
          font-size: .69rem;
          font-weight: 900;
          text-decoration: none;
        }

        .patent-relation p {
          margin: 7px 0 0;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.55;
        }

        .patent-open-source {
          display: inline-flex;
          margin-top: 18px;
          color: var(--amber-soft);
          font-size: .68rem;
          font-weight: 900;
          text-decoration: none;
        }

        .patent-status {
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(0,0,0,.11);
        }

        .patent-status strong {
          display: block;
          font-size: .80rem;
        }

        .patent-status p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: .70rem;
          line-height: 1.6;
        }

        .patent-status.error {
          border-color: rgba(255,154,176,.18);
          background: rgba(255,154,176,.035);
        }

        .patent-status.error strong { color: #ffd8e1; }

        .patent-boundary {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.72);
        }

        .patent-boundary-grid {
          display: grid;
          grid-template-columns: minmax(0, .88fr) minmax(0, 1.12fr);
          gap: 34px;
          align-items: start;
          padding: 72px 0;
        }

        .patent-boundary h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.4rem);
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .patent-boundary p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.75;
        }

        .patent-boundary-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .patent-boundary-card {
          min-height: 146px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(255,255,255,.022);
        }

        .patent-boundary-card b {
          color: var(--amber);
          font-size: .56rem;
          letter-spacing: .12em;
        }

        .patent-boundary-card strong {
          display: block;
          margin-top: 8px;
          font-size: .76rem;
        }

        .patent-boundary-card span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.55;
        }

        .patent-close {
          padding: 76px 0 98px;
          text-align: center;
        }

        .patent-close h2 {
          max-width: 900px;
          margin: 10px auto 0;
          font-size: clamp(2.2rem, 4.2vw, 4.4rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .patent-close p {
          max-width: 760px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .patent-close-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 9px;
          margin-top: 25px;
        }

        .patent-button {
          min-height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: rgba(255,255,255,.025);
          color: #dceaf4;
          font-size: .62rem;
          font-weight: 900;
          text-decoration: none;
          transition: 160ms ease;
        }

        .patent-button:hover {
          transform: translateY(-1px);
          border-color: rgba(241,199,105,.28);
          background: rgba(241,199,105,.04);
        }

        .patent-loading-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          color: var(--text);
          background:
            radial-gradient(circle at 50% 0%, rgba(241,199,105,.08), transparent 28%),
            #020711;
        }

        .patent-loading-card {
          width: min(760px, calc(100% - 40px));
          padding: 34px;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: rgba(255,255,255,.025);
        }

        .patent-loading-card small {
          color: var(--amber);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .patent-loading-card h1 {
          margin: 10px 0 0;
          font-size: 2.3rem;
          letter-spacing: -.04em;
        }

        .patent-loading-card p {
          margin: 14px 0 0;
          color: var(--muted);
          line-height: 1.7;
          font-size: .76rem;
        }

        @media (max-width: 1180px) {
          .patent-hero-grid { grid-template-columns: 1fr; }
          .patent-orbit { max-width: 500px; }
          .patent-link-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .patent-workspace { grid-template-columns: 1fr; }
          .patent-detail { position: static; }
        }

        @media (max-width: 820px) {
          .patent-shell { width: min(100% - 28px, 1460px); }
          .patent-topline,
          .patent-section-head,
          .patent-family-head { display: grid; align-items: start; }
          .patent-title { font-size: clamp(2.8rem, 13vw, 4.8rem); }
          .patent-link-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .patent-boundary-grid { grid-template-columns: 1fr; }
          .patent-boundary-cards { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 560px) {
          .patent-metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .patent-metric:nth-child(2) { border-right: 0; }
          .patent-metric:nth-child(-n+2) { border-bottom: 1px solid var(--line); }
          .patent-link-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .patent-detail-grid,
          .patent-boundary-cards { grid-template-columns: 1fr; }
          .patent-node { display: none; }
        }
      `}</style>

      <section className="patent-hero">
        <div className="patent-shell patent-topline">
          <Link
            href="/academy/24-link-architecture/provenance"
            className="patent-back"
          >
            ← Back to Provenance Map
          </Link>

          <Link
            href="/academy/24-link-architecture/provenance/patents/families"
            className="patent-chip"
          >
            Explore eight patent families
          </Link>
        </div>

        <div className="patent-shell patent-hero-grid">
          <div>
            <div className="patent-kicker">
              TA-14 Patent Position · Architecture Map
            </div>

            <h1 className="patent-title">
              Eight patent families.
              <span>Thirty-two application records. One bounded map.</span>
            </h1>

            <p className="patent-lead">
              Explore the documented TA-14 patent portfolio by family and see
              which canonical links each application is currently related to
              in the institutional patent-position record.
            </p>

            {focusedLink ? (
              <div className="patent-focus">
                <small>Patent-position focus</small>
                <strong>
                  {focusedLink.linkId} · {focusedLink.canonicalName} ·{" "}
                  {focusedSourceIds.size} mapped application
                  {focusedSourceIds.size === 1 ? "" : "s"}
                </strong>
              </div>
            ) : null}
          </div>

          <div className="patent-orbit" aria-label="TA-14 patent architecture map motif">
            <div className="patent-ring r1" />
            <div className="patent-ring r2" />
            <div className="patent-ring r3" />
            <div className="patent-ring r4" />
            <div className="patent-axis-h" />
            <div className="patent-axis-v" />

            <div className="patent-core">
              <div>
                <small>PATENT MAP</small>
                <strong>8×32</strong>
                <span>families · application records</span>
              </div>
            </div>

            <div className="patent-node n1">
              <b>F1</b>
              <span>Family architecture</span>
            </div>
            <div className="patent-node n2">
              <b>24</b>
              <span>Canonical positions</span>
            </div>
            <div className="patent-node n3">
              <b>REL</b>
              <span>Bounded relations</span>
            </div>
            <div className="patent-node n4">
              <b>APP</b>
              <span>Application record</span>
            </div>
            <div className="patent-node n5">
              <b>POS</b>
              <span>Patent position</span>
            </div>
          </div>
        </div>
      </section>

      <section className="patent-metrics">
        <div className="patent-shell patent-metric-grid">
          <Metric value={String(families.length)} label="Patent families" />
          <Metric value={String(sources.length)} label="Applications" />
          <Metric
            value={String(coveredLinks.length)}
            label="24-link positions represented"
          />
          <Metric
            value={String(relations.length)}
            label="Bounded relationships"
          />
        </div>
      </section>

      <section className="patent-section alt">
        <div className="patent-shell">
          <div className="patent-section-head">
            <div>
              <div className="patent-eyebrow">
                Canonical coverage
              </div>
              <h2 className="patent-h2">
                See where the portfolio is positioned across all 24 links.
              </h2>
            </div>

            <p className="patent-section-copy">
              Each link shows how many bounded patent-position relationships
              currently connect application records to that canonical state.
              A relationship is an architectural map, not a legal conclusion.
            </p>
          </div>

          <div className="patent-link-grid">
            {TA14_24_LINKS.map((link) => {
              const count = relations.filter(
                (relation) => relation.linkId === link.linkId,
              ).length;

              return (
                <Link
                  key={link.linkId}
                  href={`/academy/24-link-architecture/${String(
                    link.order,
                  ).padStart(2, "0")}-${link.slug}`}
                  className={[
                    "patent-link",
                    count > 0 ? "covered" : "",
                    focusedLink?.linkId === link.linkId ? "focused" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="patent-link-top">
                    <span className="patent-link-index">
                      {String(link.order).padStart(2, "0")}
                    </span>
                    <span className="patent-link-count">{count}</span>
                  </div>

                  <div>
                    <div className="patent-link-name">
                      {link.canonicalName}
                    </div>
                    <div className="patent-link-track" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="patent-section">
        <div className="patent-shell">
          <div className="patent-section-head">
            <div>
              <div
                className="patent-eyebrow"
                style={{ color: "var(--amber)" }}
              >
                Portfolio workspace
              </div>
              <h2 className="patent-h2">
                Explore families. Inspect applications. Trace bounded links.
              </h2>
            </div>

            <p className="patent-section-copy">
              The family list preserves portfolio grouping and application
              order. The selected application panel preserves filing metadata,
              public summary, source URL, and every mapped 24-link relationship.
            </p>
          </div>

          {loading ? (
            <div className="patent-status">
              <strong>Loading patent portfolio…</strong>
              <p>
                Resolving patent application records and bounded
                architecture-position relationships.
              </p>
            </div>
          ) : error ? (
            <div className="patent-status error">
              <strong>
                {registryUnavailable
                  ? "Canonical patent-position registry not yet available in production"
                  : "Patent portfolio unavailable"}
              </strong>
              <p>
                {registryUnavailable
                  ? "The Academy patent-position experience is available, but the canonical source registry required to populate application and relationship data has not yet been initialized or exposed in the production schema. No patent relationship is being inferred or invented."
                  : "TA-14 could not load the patent-position registry. The architecture and patent-position boundaries remain available while the source registry is restored."}
              </p>
            </div>
          ) : families.length === 0 ? (
            <div className="patent-status">
              <strong>No patent application records are currently available.</strong>
              <p>
                The portfolio workspace will populate from the canonical
                provenance registry when patent-application source records and
                patent-position relationships are present.
              </p>
            </div>
          ) : (
            <div className="patent-workspace">
              <div className="patent-families">
                {families.map((family) => (
                  <section
                    key={family.number}
                    className="patent-family"
                  >
                    <div className="patent-family-head">
                      <div>
                        <small>Patent Family {family.number}</small>
                        <h2>{family.name}</h2>
                      </div>

                      <span>
                        {family.applications.length} application
                        {family.applications.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="patent-app-list">
                      {family.applications.map((source) => {
                        const active = source.id === selectedSourceId;
                        const relationshipCount = relations.filter(
                          (relation) => relation.sourceId === source.id,
                        ).length;

                        return (
                          <button
                            key={source.id}
                            type="button"
                            onClick={() => setSelectedSourceId(source.id)}
                            className={[
                              "patent-app",
                              active ? "active" : "",
                              focusedSourceIds.has(source.id)
                                ? "focused"
                                : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            <div className="patent-app-top">
                              <span className="patent-app-id">
                                {source.sourceIdentifier ??
                                  "Identifier pending"}
                              </span>

                              <span className="patent-app-count">
                                {relationshipCount} mapped link
                                {relationshipCount === 1 ? "" : "s"}
                              </span>
                            </div>

                            <div className="patent-app-title">
                              {source.title}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              <aside className="patent-detail">
                {selectedSource ? (
                  <>
                    <div className="patent-detail-head">
                      <small>Selected application</small>
                      <div className="patent-detail-id">
                        {selectedSource.sourceIdentifier ??
                          "Identifier pending"}
                      </div>
                      <h2>{selectedSource.title}</h2>

                      {selectedSource.publicSummary ? (
                        <p className="patent-detail-summary">
                          {selectedSource.publicSummary}
                        </p>
                      ) : null}
                    </div>

                    <div className="patent-detail-body">
                      <div className="patent-detail-grid">
                        <Detail
                          label="Jurisdiction"
                          value={selectedSource.jurisdiction ?? "Not stated"}
                        />
                        <Detail
                          label="Status"
                          value={selectedSource.status ?? "Not stated"}
                        />
                        <Detail
                          label="Filing date"
                          value={selectedSource.filingDate ?? "Not stated"}
                        />
                        <Detail
                          label="Priority date"
                          value={selectedSource.priorityDate ?? "Not stated"}
                        />
                      </div>

                      <div className="patent-relations">
                        <small>
                          Bounded 24-link patent-position relationships
                        </small>

                        {selectedRelations.length === 0 ? (
                          <div className="patent-status" style={{ marginTop: 12 }}>
                            <strong>
                              No bounded relationship recorded yet.
                            </strong>
                            <p>
                              This application currently has no
                              patent-position relationship recorded against the
                              canonical 24-link architecture.
                            </p>
                          </div>
                        ) : (
                          <div className="patent-relation-list">
                            {selectedRelations.map((relation) => {
                              const link = TA14_24_LINKS.find(
                                (item) => item.linkId === relation.linkId,
                              );

                              return (
                                <article
                                  key={relation.id}
                                  className="patent-relation"
                                >
                                  <Link
                                    href={`/academy/24-link-architecture/${String(
                                      link?.order ?? 0,
                                    ).padStart(2, "0")}-${link?.slug ?? ""}`}
                                  >
                                    {String(link?.order ?? 0).padStart(
                                      2,
                                      "0",
                                    )}{" "}
                                    {link?.canonicalName ?? relation.linkId}
                                  </Link>

                                  {relation.relationSummary ? (
                                    <p>{relation.relationSummary}</p>
                                  ) : null}
                                </article>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {selectedSource.sourceUrl ? (
                        <a
                          href={selectedSource.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="patent-open-source"
                        >
                          Open public patent-position source →
                        </a>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <div className="patent-detail-body">
                    <div className="patent-status">
                      <strong>Select an application.</strong>
                      <p>
                        Choose an application from a patent family to inspect
                        filing metadata and mapped architecture relationships.
                      </p>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>
      </section>

      <section className="patent-boundary">
        <div className="patent-shell patent-boundary-grid">
          <div>
            <div
              className="patent-eyebrow"
              style={{ color: "var(--amber)" }}
            >
              Patent-position boundary
            </div>

            <h2>
              Architecture mapping is not patent claim construction.
            </h2>

            <p>
              This view records how the public TA-14 patent portfolio is
              architecturally positioned against the 24-link canon. It does
              not determine patent validity, grant status, infringement,
              ownership, or the legal scope of any claim.
            </p>
          </div>

          <div className="patent-boundary-cards">
            <BoundaryCard
              code="MAP"
              title="Architecture relationship"
              text="A mapped relationship records a bounded architectural connection between an application record and one or more canonical links."
            />
            <BoundaryCard
              code="FILE"
              title="Filing record"
              text="A filing date or application identifier establishes a documented filing record; it does not by itself establish claim scope or legal outcome."
            />
            <BoundaryCard
              code="SRC"
              title="Public source"
              text="A linked public source supports inspectability and chronology while remaining distinct from Academy interpretation."
            />
            <BoundaryCard
              code="LAW"
              title="No legal adjudication"
              text="The Academy does not determine validity, infringement, ownership, enforceability, or the legal construction of any patent claim."
            />
          </div>
        </div>
      </section>

      <section className="patent-close">
        <div className="patent-shell">
          <div className="patent-eyebrow">
            Patent position as governed record
          </div>

          <h2>
            Keep the filing visible.
            <br />
            Keep the architectural claim bounded.
          </h2>

          <p>
            The value of the portfolio map is not in collapsing doctrine,
            provenance, and patent position into one assertion. It is in
            preserving the exact application record, the exact mapped
            architectural relationship, and the exact boundary of what that
            relationship does not establish.
          </p>

          <div className="patent-close-actions">
            <Link
              href="/academy/24-link-architecture/provenance"
              className="patent-button"
            >
              Return to Provenance Map
            </Link>

            <Link
              href="/academy/24-link-architecture/provenance/patents/families"
              className="patent-button"
            >
              Explore Eight Patent Families
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="patent-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="patent-detail-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
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
    <article className="patent-boundary-card">
      <b>{code}</b>
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}

function PatentPortfolioRouteLoading() {
  return (
    <main className="patent patent-loading-page">
      <style>{`
        .patent {
          --line: rgba(129, 176, 210, .14);
          --amber: #f1c769;
          --text: #eff8ff;
          --muted: #93a8ba;
        }

        .patent-loading-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          color: var(--text);
          background:
            radial-gradient(circle at 50% 0%, rgba(241,199,105,.08), transparent 28%),
            #020711;
        }

        .patent-loading-card {
          width: min(760px, calc(100% - 40px));
          padding: 34px;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: rgba(255,255,255,.025);
        }

        .patent-loading-card small {
          color: var(--amber);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .patent-loading-card h1 {
          margin: 10px 0 0;
          font-size: 2.3rem;
          letter-spacing: -.04em;
        }

        .patent-loading-card p {
          margin: 14px 0 0;
          color: var(--muted);
          line-height: 1.7;
          font-size: .76rem;
        }
      `}</style>

      <section className="patent-loading-card">
        <small>TA-14 Patent Position · Architecture Map</small>
        <h1>Resolving patent application…</h1>
        <p>
          Loading the requested application and its bounded relationships to
          the canonical 24-link architecture.
        </p>
      </section>
    </main>
  );
}
