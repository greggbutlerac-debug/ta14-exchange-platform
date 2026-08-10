"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { TA14ProvenanceAdminLink } from "@/components/academy/ta14-provenance-admin-link";
import {
  TA14_24_LINKS,
  type TA14LinkId,
} from "@/lib/academy/ta14-24-link-canon";
import {
  loadTA14FullProvenanceMap,
  summarizeTA14Provenance,
  type TA14LinkProvenanceBundle,
} from "@/lib/academy/ta14-canonical-registry";

export default function TA14ProvenanceMapPage() {
  return (
    <Suspense fallback={<TA14ProvenanceMapRouteLoading />}>
      <TA14ProvenanceMapContent />
    </Suspense>
  );
}

function TA14ProvenanceMapContent() {
  const searchParams = useSearchParams();
  const requestedLink = searchParams.get("link");

  const [bundles, setBundles] = useState<TA14LinkProvenanceBundle[]>([]);
  const [selectedLinkId, setSelectedLinkId] =
    useState<TA14LinkId>("TA14-LINK-01");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestedLink) return;

    const matched = TA14_24_LINKS.find(
      (item) => item.linkId === requestedLink,
    );

    if (matched) {
      setSelectedLinkId(matched.linkId);
    }
  }, [requestedLink]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const result = await loadTA14FullProvenanceMap();

        if (!cancelled) {
          setBundles(result);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load TA-14 provenance map.",
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

  const summary = useMemo(
    () => summarizeTA14Provenance(bundles),
    [bundles],
  );

  const selected = useMemo(
    () =>
      bundles.find((bundle) => bundle.linkId === selectedLinkId) ?? {
        linkId: selectedLinkId,
        order:
          TA14_24_LINKS.find((item) => item.linkId === selectedLinkId)?.order ??
          1,
        canonicalName:
          TA14_24_LINKS.find((item) => item.linkId === selectedLinkId)
            ?.canonicalName ?? "Unknown link",
        sources: [],
      },
    [bundles, selectedLinkId],
  );

  const selectedCanon = useMemo(
    () => TA14_24_LINKS.find((item) => item.linkId === selected.linkId),
    [selected.linkId],
  );

  const requestedCanon = useMemo(
    () => TA14_24_LINKS.find((item) => item.linkId === requestedLink),
    [requestedLink],
  );

  const registryUnavailable =
    Boolean(error) &&
    /ta14_canonical_sources|schema cache|relation .* does not exist/i.test(
      error ?? "",
    );

  return (
    <main className="prov">
      <style>{`
        .prov {
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
          --rose: #ff9ab0;
          --text: #eff8ff;
          --muted: #93a8ba;
          --dim: #647b8f;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 9% 0%, rgba(84,232,255,.10), transparent 24%),
            radial-gradient(circle at 92% 4%, rgba(138,114,255,.09), transparent 26%),
            linear-gradient(180deg, #020711 0%, #030a13 55%, #020711 100%);
        }

        .prov * { box-sizing: border-box; }

        .prov-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .prov-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .prov-hero::before {
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

        .prov-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(420px, .92fr);
          gap: 64px;
          align-items: center;
          padding: 74px 0 82px;
        }

        .prov-topline {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 20px;
        }

        .prov-back {
          color: var(--cyan-soft);
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }

        .prov-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .prov-chip {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.028);
          color: #d9e7f2;
          font-size: .62rem;
          font-weight: 900;
          text-decoration: none;
          transition: 160ms ease;
        }

        .prov-chip:hover {
          transform: translateY(-1px);
          border-color: var(--line-strong);
          background: rgba(84,232,255,.05);
        }

        .prov-kicker {
          color: var(--indigo);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .20em;
          text-transform: uppercase;
        }

        .prov-title {
          max-width: 960px;
          margin: 14px 0 0;
          font-size: clamp(3.2rem, 6vw, 6.4rem);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .prov-title span {
          display: block;
          color: var(--cyan-soft);
        }

        .prov-lead {
          max-width: 860px;
          margin: 26px 0 0;
          color: #c8d8e4;
          font-size: clamp(1rem, 1.35vw, 1.18rem);
          line-height: 1.8;
        }

        .prov-focus {
          display: inline-grid;
          gap: 4px;
          margin-top: 24px;
          padding: 12px 14px;
          border: 1px solid rgba(168,178,255,.20);
          border-radius: 14px;
          background: rgba(168,178,255,.055);
        }

        .prov-focus small {
          color: var(--dim);
          font-size: .56rem;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .prov-focus strong {
          color: #e8ebff;
          font-size: .76rem;
        }

        .prov-orbit {
          position: relative;
          width: min(510px, 100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .prov-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(129,176,210,.10);
          border-radius: 50%;
        }

        .prov-ring.r1 { width: 96%; height: 96%; }
        .prov-ring.r2 { width: 75%; height: 75%; border-color: rgba(84,232,255,.12); }
        .prov-ring.r3 { width: 54%; height: 54%; border-color: rgba(168,178,255,.13); }
        .prov-ring.r4 { width: 34%; height: 34%; border-color: rgba(69,234,166,.12); }

        .prov-axis-h,
        .prov-axis-v {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .prov-axis-h {
          width: 88%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(84,232,255,.14), transparent);
        }

        .prov-axis-v {
          width: 1px;
          height: 88%;
          background: linear-gradient(180deg, transparent, rgba(168,178,255,.14), transparent);
        }

        .prov-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 176px;
          height: 176px;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(84,232,255,.25);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(84,232,255,.12), transparent 44%),
            rgba(5,16,27,.95);
          box-shadow: 0 0 90px rgba(84,232,255,.10);
          text-align: center;
        }

        .prov-core small {
          display: block;
          color: var(--cyan);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .prov-core strong {
          display: block;
          margin-top: 4px;
          font-size: 3.3rem;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .prov-core span {
          display: block;
          margin-top: 6px;
          color: var(--muted);
          font-size: .64rem;
        }

        .prov-node {
          position: absolute;
          min-width: 108px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 12px 34px rgba(0,0,0,.24);
        }

        .prov-node b {
          display: block;
          color: var(--cyan);
          font-size: .56rem;
          letter-spacing: .12em;
        }

        .prov-node span {
          display: block;
          margin-top: 4px;
          color: #d7e5ef;
          font-size: .66rem;
          font-weight: 850;
        }

        .prov-node.n1 { left: 1%; top: 19%; }
        .prov-node.n2 { right: 0; top: 24%; }
        .prov-node.n3 { right: 4%; bottom: 18%; }
        .prov-node.n4 { left: 0; bottom: 18%; }
        .prov-node.n5 { left: 50%; top: 0; transform: translateX(-50%); }

        .prov-metrics {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.76);
        }

        .prov-metric-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .prov-metric {
          min-height: 98px;
          padding: 20px;
          border-right: 1px solid var(--line);
        }

        .prov-metric:last-child { border-right: 0; }

        .prov-metric strong {
          display: block;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .prov-metric span {
          display: block;
          margin-top: 8px;
          color: var(--dim);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .prov-workspace {
          padding: 78px 0 92px;
        }

        .prov-workspace-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .prov-eyebrow {
          color: var(--green);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .prov-h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.7rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .prov-workspace-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .prov-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.06fr) minmax(390px, .94fr);
          gap: 20px;
          align-items: start;
        }

        .prov-coverage,
        .prov-detail {
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.024);
        }

        .prov-coverage {
          padding: 22px;
        }

        .prov-coverage-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--line);
        }

        .prov-coverage-head strong {
          font-size: .82rem;
        }

        .prov-coverage-head span {
          color: var(--dim);
          font-size: .60rem;
        }

        .prov-links {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .prov-link {
          min-height: 116px;
          position: relative;
          overflow: hidden;
          display: grid;
          align-content: space-between;
          gap: 14px;
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(0,0,0,.10);
          color: var(--text);
          text-align: left;
          cursor: pointer;
          transition: 160ms ease;
        }

        .prov-link:hover {
          transform: translateY(-2px);
          border-color: rgba(84,232,255,.24);
          background: rgba(84,232,255,.035);
        }

        .prov-link.active {
          border-color: rgba(168,178,255,.32);
          background:
            radial-gradient(circle at 100% 0%, rgba(168,178,255,.10), transparent 46%),
            rgba(168,178,255,.05);
        }

        .prov-link-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .prov-link-index {
          color: var(--cyan);
          font-size: .60rem;
          font-weight: 950;
        }

        .prov-source-count {
          padding: 4px 7px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--dim);
          font-size: .50rem;
          font-weight: 850;
        }

        .prov-link-name {
          color: #eaf4fb;
          font-size: .72rem;
          font-weight: 850;
          line-height: 1.35;
        }

        .prov-link-track {
          width: 34px;
          height: 1px;
          background: rgba(255,255,255,.10);
          transition: width 160ms ease, background 160ms ease;
        }

        .prov-link:hover .prov-link-track,
        .prov-link.active .prov-link-track {
          width: 100%;
          background: rgba(84,232,255,.28);
        }

        .prov-detail {
          position: sticky;
          top: 22px;
          min-height: 540px;
          overflow: hidden;
        }

        .prov-detail-head {
          position: relative;
          padding: 24px 24px 20px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.08), transparent 40%),
            rgba(255,255,255,.01);
        }

        .prov-detail-index {
          color: var(--cyan);
          font-size: .60rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .prov-detail h2 {
          margin: 8px 0 0;
          font-size: 1.8rem;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .prov-detail-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 14px;
        }

        .prov-detail-meta span {
          padding: 5px 8px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--muted);
          font-size: .52rem;
          font-weight: 850;
        }

        .prov-detail-body {
          padding: 22px 24px 24px;
        }

        .prov-loading,
        .prov-empty,
        .prov-error {
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(0,0,0,.12);
        }

        .prov-loading strong,
        .prov-empty strong,
        .prov-error strong {
          display: block;
          font-size: .80rem;
        }

        .prov-loading p,
        .prov-empty p,
        .prov-error p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: .70rem;
          line-height: 1.6;
        }

        .prov-error {
          border-color: rgba(255,154,176,.18);
          background: rgba(255,154,176,.035);
        }

        .prov-error strong { color: #ffd8e1; }

        .prov-empty-action {
          margin-top: 14px;
        }

        .prov-source-list {
          display: grid;
          gap: 12px;
        }

        .prov-source-card {
          padding: 17px;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: rgba(0,0,0,.12);
        }

        .prov-source-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .prov-source-tags span {
          padding: 5px 8px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--muted);
          font-size: .49rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .prov-source-tags .relation {
          border-color: rgba(84,232,255,.17);
          background: rgba(84,232,255,.045);
          color: var(--cyan-soft);
        }

        .prov-source-tags .primary {
          border-color: rgba(241,199,105,.18);
          background: rgba(241,199,105,.045);
          color: #ffe8aa;
        }

        .prov-source-card h3 {
          margin: 13px 0 0;
          font-size: .92rem;
          line-height: 1.3;
        }

        .prov-source-card p {
          margin: 9px 0 0;
          color: var(--muted);
          font-size: .68rem;
          line-height: 1.6;
        }

        .prov-source-facts {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 7px 12px;
          margin-top: 13px;
          padding-top: 12px;
          border-top: 1px solid var(--line);
        }

        .prov-source-facts span {
          color: var(--dim);
          font-size: .58rem;
          overflow-wrap: anywhere;
        }

        .prov-open-source {
          display: inline-flex;
          margin-top: 13px;
          color: var(--cyan);
          font-size: .66rem;
          font-weight: 900;
          text-decoration: none;
        }

        .prov-detail-footer {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 18px;
          padding-top: 17px;
          border-top: 1px solid var(--line);
        }

        .prov-button {
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

        .prov-button:hover {
          transform: translateY(-1px);
          border-color: var(--line-strong);
          background: rgba(84,232,255,.045);
        }

        .prov-doctrine {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.72);
        }

        .prov-doctrine-grid {
          display: grid;
          grid-template-columns: minmax(0, .84fr) minmax(0, 1.16fr);
          gap: 34px;
          align-items: start;
          padding: 72px 0;
        }

        .prov-doctrine h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.4rem);
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .prov-doctrine p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.75;
        }

        .prov-doctrine-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .prov-doctrine-card {
          min-height: 142px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(255,255,255,.022);
        }

        .prov-doctrine-card b {
          color: var(--amber);
          font-size: .56rem;
          letter-spacing: .12em;
        }

        .prov-doctrine-card strong {
          display: block;
          margin-top: 8px;
          font-size: .76rem;
        }

        .prov-doctrine-card span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.55;
        }

        .prov-close {
          padding: 76px 0 98px;
          text-align: center;
        }

        .prov-close h2 {
          max-width: 880px;
          margin: 10px auto 0;
          font-size: clamp(2.2rem, 4.2vw, 4.4rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .prov-close p {
          max-width: 760px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .prov-close-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 9px;
          margin-top: 25px;
        }

        .prov-loading-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          color: var(--text);
          background:
            radial-gradient(circle at 50% 0%, rgba(84,232,255,.08), transparent 28%),
            #020711;
        }

        .prov-loading-card {
          width: min(760px, calc(100% - 40px));
          padding: 34px;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: rgba(255,255,255,.025);
        }

        .prov-loading-card h1 {
          margin: 10px 0 0;
          font-size: 2.3rem;
          letter-spacing: -.04em;
        }

        .prov-loading-card p {
          margin: 14px 0 0;
          color: var(--muted);
          line-height: 1.7;
          font-size: .76rem;
        }

        @media (max-width: 1180px) {
          .prov-hero-grid { grid-template-columns: 1fr; }
          .prov-orbit { max-width: 500px; }
          .prov-grid { grid-template-columns: 1fr; }
          .prov-detail { position: static; }
          .prov-metric-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .prov-metric:nth-child(3) { border-right: 0; }
          .prov-metric:nth-child(-n+3) { border-bottom: 1px solid var(--line); }
        }

        @media (max-width: 820px) {
          .prov-shell { width: min(100% - 28px, 1460px); }
          .prov-topline,
          .prov-workspace-head { display: grid; align-items: start; }
          .prov-title { font-size: clamp(2.8rem, 13vw, 4.8rem); }
          .prov-links { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .prov-doctrine-grid { grid-template-columns: 1fr; }
          .prov-doctrine-cards { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 560px) {
          .prov-metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .prov-metric { border-bottom: 1px solid var(--line); }
          .prov-metric:nth-child(2n) { border-right: 0; }
          .prov-links,
          .prov-doctrine-cards,
          .prov-source-facts { grid-template-columns: 1fr; }
          .prov-node { display: none; }
          .prov-actions,
          .prov-close-actions { display: grid; }
        }
      `}</style>

      <section className="prov-hero">
        <div className="prov-shell prov-topline">
          <Link
            href="/academy/24-link-architecture"
            className="prov-back"
          >
            ← Back to 24-Link Explorer
          </Link>

          <div className="prov-actions">
            <Link
              href="/academy/24-link-architecture/provenance/patents"
              className="prov-chip"
            >
              Explore patent portfolio
            </Link>

            <Link
              href="/academy/24-link-architecture/provenance/patents/families"
              className="prov-chip"
            >
              Browse eight patent families
            </Link>

            <TA14ProvenanceAdminLink />
          </div>
        </div>

        <div className="prov-shell prov-hero-grid">
          <div>
            <div className="prov-kicker">
              TA-14 Academy · Provenance Map
            </div>

            <h1 className="prov-title">
              Show the evidence
              <span>behind the architecture.</span>
            </h1>

            <p className="prov-lead">
              Each canonical link can be connected to its public chronology,
              publications, patent applications, patents, artifacts, reviews,
              and other provenance-bearing records without collapsing those
              sources into a single claim.
            </p>

            {requestedCanon ? (
              <div className="prov-focus">
                <small>Focused provenance view</small>
                <strong>
                  {requestedCanon.linkId} · {requestedCanon.canonicalName}
                </strong>
              </div>
            ) : null}
          </div>

          <div className="prov-orbit" aria-label="TA-14 provenance relationship motif">
            <div className="prov-ring r1" />
            <div className="prov-ring r2" />
            <div className="prov-ring r3" />
            <div className="prov-ring r4" />
            <div className="prov-axis-h" />
            <div className="prov-axis-v" />

            <div className="prov-core">
              <div>
                <small>PROVENANCE</small>
                <strong>24</strong>
                <span>canonical link surfaces</span>
              </div>
            </div>

            <div className="prov-node n1">
              <b>CH</b>
              <span>Chronology</span>
            </div>
            <div className="prov-node n2">
              <b>PP</b>
              <span>Patent position</span>
            </div>
            <div className="prov-node n3">
              <b>AR</b>
              <span>Artifacts</span>
            </div>
            <div className="prov-node n4">
              <b>RV</b>
              <span>Reviews</span>
            </div>
            <div className="prov-node n5">
              <b>PB</b>
              <span>Publications</span>
            </div>
          </div>
        </div>
      </section>

      <section className="prov-metrics">
        <div className="prov-shell prov-metric-grid">
          <Metric
            value={String(summary.linksWithSources)}
            label="Links with sources"
          />
          <Metric
            value={String(summary.totalRelationships)}
            label="Total relationships"
          />
          <Metric
            value={String(summary.primaryProvenanceRelationships)}
            label="Primary provenance"
          />
          <Metric
            value={String(summary.patentRelationships)}
            label="Patent relationships"
          />
          <Metric
            value={String(summary.publicationRelationships)}
            label="Publication relationships"
          />
        </div>
      </section>

      <section className="prov-workspace">
        <div className="prov-shell">
          <div className="prov-workspace-head">
            <div>
              <div className="prov-eyebrow">
                24-Link provenance coverage
              </div>
              <h2 className="prov-h2">
                Select a link. Inspect its governed source relationships.
              </h2>
            </div>

            <p className="prov-workspace-copy">
              The map preserves source class, relationship type, chronology,
              filing information, primary-provenance status, and the boundary
              between architectural doctrine and the records that support or
              document it.
            </p>
          </div>

          <div className="prov-grid">
            <section className="prov-coverage">
              <div className="prov-coverage-head">
                <strong>Canonical link coverage</strong>
                <span>
                  {summary.linksWithSources} of 24 currently have source relationships
                </span>
              </div>

              <div className="prov-links">
                {TA14_24_LINKS.map((item) => {
                  const bundle = bundles.find(
                    (candidate) => candidate.linkId === item.linkId,
                  );
                  const sourceCount = bundle?.sources.length ?? 0;

                  return (
                    <button
                      key={item.linkId}
                      type="button"
                      onClick={() => setSelectedLinkId(item.linkId)}
                      className={[
                        "prov-link",
                        selectedLinkId === item.linkId ? "active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="prov-link-top">
                        <span className="prov-link-index">
                          {String(item.order).padStart(2, "0")}
                        </span>

                        <span className="prov-source-count">
                          {sourceCount} source{sourceCount === 1 ? "" : "s"}
                        </span>
                      </div>

                      <div>
                        <div className="prov-link-name">
                          {item.canonicalName}
                        </div>
                        <div className="prov-link-track" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <aside className="prov-detail">
              <div className="prov-detail-head">
                <div className="prov-detail-index">
                  Link {String(selected.order).padStart(2, "0")}
                </div>

                <h2>{selected.canonicalName}</h2>

                <div className="prov-detail-meta">
                  <span>{selected.linkId}</span>
                  <span>
                    {selected.sources.length} relationship
                    {selected.sources.length === 1 ? "" : "s"}
                  </span>
                  <span>
                    {selectedCanon?.parentAnchor ?? "TA-14 canonical route"}
                  </span>
                </div>
              </div>

              <div className="prov-detail-body">
                {loading ? (
                  <div className="prov-loading">
                    <strong>Loading provenance relationships…</strong>
                    <p>
                      Resolving canonical source records and their bounded
                      relationships to this link.
                    </p>
                  </div>
                ) : error ? (
                  <div className="prov-error">
                    <strong>
                      {registryUnavailable
                        ? "Canonical provenance registry not yet available in production"
                        : "Provenance map unavailable"}
                    </strong>

                    <p>
                      {registryUnavailable
                        ? "The Academy can still display the 24-link canon and preserve provenance boundaries, but the production canonical-source registry has not yet been initialized or exposed to this route. No source relationship is being invented to fill that gap."
                        : "TA-14 could not load the provenance relationship registry for this link. The canonical lesson remains available while the source registry is restored."}
                    </p>

                    <div className="prov-empty-action">
                      <TA14ProvenanceAdminLink linkId={selected.linkId} />
                    </div>
                  </div>
                ) : selected.sources.length === 0 ? (
                  <div className="prov-empty">
                    <strong>No source relationship recorded yet.</strong>
                    <p>
                      This does not mean the link lacks provenance. It means no
                      public source relationship has yet been entered into the
                      canonical registry for this link.
                    </p>

                    <div className="prov-empty-action">
                      <TA14ProvenanceAdminLink linkId={selected.linkId} />
                    </div>
                  </div>
                ) : (
                  <div className="prov-source-list">
                    {selected.sources.map(({ relation, source }) => (
                      <article
                        key={`${relation.id}-${source.id}`}
                        className="prov-source-card"
                      >
                        <div className="prov-source-tags">
                          <span className="relation">
                            {relation.relationType.replaceAll("_", " ")}
                          </span>

                          <span>
                            {source.sourceType.replaceAll("_", " ")}
                          </span>

                          {relation.isPrimaryProvenance ? (
                            <span className="primary">
                              Primary provenance
                            </span>
                          ) : null}
                        </div>

                        <h3>{source.title}</h3>

                        {relation.relationSummary ? (
                          <p>{relation.relationSummary}</p>
                        ) : null}

                        {source.publicSummary ? (
                          <p>{source.publicSummary}</p>
                        ) : null}

                        <div className="prov-source-facts">
                          {source.publicationDate ? (
                            <span>
                              Published: {source.publicationDate}
                            </span>
                          ) : null}

                          {source.filingDate ? (
                            <span>Filed: {source.filingDate}</span>
                          ) : null}

                          {source.priorityDate ? (
                            <span>Priority: {source.priorityDate}</span>
                          ) : null}

                          {source.sourceIdentifier ? (
                            <span>ID: {source.sourceIdentifier}</span>
                          ) : null}
                        </div>

                        {source.sourceUrl ? (
                          <a
                            href={source.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="prov-open-source"
                          >
                            Open public source →
                          </a>
                        ) : null}
                      </article>
                    ))}
                  </div>
                )}

                <div className="prov-detail-footer">
                  <Link
                    href={`/academy/24-link-architecture/${String(
                      selected.order,
                    ).padStart(2, "0")}-${selectedCanon?.slug ?? ""}`}
                    className="prov-button"
                  >
                    Open canonical lesson →
                  </Link>

                  <Link
                    href={`/academy/24-link-architecture/provenance/intake?link=${encodeURIComponent(
                      selected.linkId,
                    )}`}
                    className="prov-button"
                  >
                    Register source for this link
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="prov-doctrine">
        <div className="prov-shell prov-doctrine-grid">
          <div>
            <div
              className="prov-eyebrow"
              style={{ color: "var(--amber)" }}
            >
              Provenance rule
            </div>

            <h2>
              Chronology, patent position, and architectural doctrine remain
              distinct records.
            </h2>

            <p>
              A publication can establish public chronology. A patent
              application can establish a filing record and patent-position
              relationship. An artifact can demonstrate implementation. A
              review can establish a bounded finding. The Academy should show
              these relationships together without claiming that one source
              automatically proves all of the others.
            </p>
          </div>

          <div className="prov-doctrine-cards">
            <DoctrineCard
              code="CH"
              title="Chronology"
              text="A dated public source can support when a concept, route, or doctrine entered the public record."
            />
            <DoctrineCard
              code="PP"
              title="Patent position"
              text="A filing can support the existence and chronology of a patent application without deciding legal claim scope."
            />
            <DoctrineCard
              code="AR"
              title="Artifacts"
              text="An implementation artifact can demonstrate that something was built or recorded without automatically proving production readiness."
            />
            <DoctrineCard
              code="RV"
              title="Reviews"
              text="A bounded review establishes only the findings supported by the submitted evidence and declared scope."
            />
          </div>
        </div>
      </section>

      <section className="prov-close">
        <div className="prov-shell">
          <div className="prov-eyebrow">
            Provenance as governed evidence
          </div>

          <h2>
            Preserve the relationship.
            <br />
            Preserve the boundary.
          </h2>

          <p>
            The purpose of this map is not to turn every source into proof of
            everything. It is to preserve what each source is, what it
            supports, which canonical link it relates to, and what it does not
            establish.
          </p>

          <div className="prov-close-actions">
            <Link
              href="/academy/24-link-architecture"
              className="prov-button"
            >
              Return to 24-Link Explorer
            </Link>

            <Link
              href="/academy/24-link-architecture/provenance/patents"
              className="prov-button"
            >
              Open Patent Portfolio
            </Link>

            <TA14ProvenanceAdminLink />
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="prov-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function DoctrineCard({
  code,
  title,
  text,
}: {
  code: string;
  title: string;
  text: string;
}) {
  return (
    <article className="prov-doctrine-card">
      <b>{code}</b>
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}

function TA14ProvenanceMapRouteLoading() {
  return (
    <main className="prov prov-loading-page">
      <style>{`
        .prov {
          --line: rgba(129, 176, 210, .14);
          --cyan: #54e8ff;
          --indigo: #a8b2ff;
          --text: #eff8ff;
          --muted: #93a8ba;
        }

        .prov-loading-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          color: var(--text);
          background:
            radial-gradient(circle at 50% 0%, rgba(84,232,255,.08), transparent 28%),
            #020711;
        }

        .prov-loading-card {
          width: min(760px, calc(100% - 40px));
          padding: 34px;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: rgba(255,255,255,.025);
        }

        .prov-loading-card small {
          color: var(--indigo);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .prov-loading-card h1 {
          margin: 10px 0 0;
          font-size: 2.3rem;
          letter-spacing: -.04em;
        }

        .prov-loading-card p {
          margin: 14px 0 0;
          color: var(--muted);
          line-height: 1.7;
          font-size: .76rem;
        }
      `}</style>

      <section className="prov-loading-card">
        <small>TA-14 Academy · Provenance Map</small>
        <h1>Resolving link-focused provenance…</h1>
        <p>
          Preparing the requested canonical link and its governed source
          relationships.
        </p>
      </section>
    </main>
  );
}
