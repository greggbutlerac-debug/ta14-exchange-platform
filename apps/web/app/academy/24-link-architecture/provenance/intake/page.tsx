"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  type TA14LinkId,
} from "@/lib/academy/ta14-24-link-canon";
import {
  readTA14ProvenanceLinkPrefill,
} from "@/lib/academy/ta14-provenance-intake-link-prefill";
import {
  createEmptyTA14ProvenanceSourceDraft,
  createTA14ProvenanceRelationship,
  provenanceRelationTypeLabel,
  provenanceSourceTypeLabel,
  TA14_PROVENANCE_RELATION_TYPES,
  TA14_PROVENANCE_SOURCE_TYPES,
  validateTA14ProvenanceSubmission,
  type TA14ProvenanceLinkDraft,
  type TA14ProvenanceSourceDraft,
} from "@/lib/academy/ta14-provenance-types";
import { persistTA14ProvenanceSubmission } from "@/lib/academy/ta14-provenance-persistence";

export default function TA14ProvenanceIntakePage() {
  return (
    <Suspense fallback={<ProvenanceIntakeLoading />}>
      <TA14ProvenanceIntakePageContent />
    </Suspense>
  );
}

function TA14ProvenanceIntakePageContent() {
  const searchParams = useSearchParams();

  const [source, setSource] = useState<TA14ProvenanceSourceDraft>(
    createEmptyTA14ProvenanceSourceDraft(),
  );
  const [relationships, setRelationships] = useState<
    TA14ProvenanceLinkDraft[]
  >([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [savedSourceId, setSavedSourceId] = useState<string | null>(null);

  const requestedLink = useMemo(
    () =>
      readTA14ProvenanceLinkPrefill(
        searchParams.get("link"),
      ),
    [searchParams],
  );

  useEffect(() => {
    if (!requestedLink) {
      return;
    }

    setRelationships((current) => {
      if (
        current.some(
          (relationship) =>
            relationship.linkId === requestedLink,
        )
      ) {
        return current;
      }

      return [
        ...current,
        createTA14ProvenanceRelationship(requestedLink),
      ];
    });
  }, [requestedLink]);

  const errors = useMemo(
    () => validateTA14ProvenanceSubmission({ source, relationships }),
    [source, relationships],
  );

  const selectedLinks = useMemo(
    () =>
      relationships
        .map((relationship) =>
          TA14_24_LINKS.find(
            (link) => link.linkId === relationship.linkId,
          ),
        )
        .filter(
          (
            item,
          ): item is (typeof TA14_24_LINKS)[number] => Boolean(item),
        )
        .sort((a, b) => a.order - b.order),
    [relationships],
  );

  const primaryCount = useMemo(
    () =>
      relationships.filter(
        (relationship) => relationship.isPrimaryProvenance,
      ).length,
    [relationships],
  );

  const publicCount = useMemo(
    () =>
      relationships.filter(
        (relationship) => relationship.publicVisibility,
      ).length,
    [relationships],
  );

  const boundedCount = useMemo(
    () =>
      relationships.filter(
        (relationship) =>
          relationship.relationSummary.trim().length > 0,
      ).length,
    [relationships],
  );

  const completion = useMemo(() => {
    let points = 0;
    const total = 8;

    if (source.title.trim()) points += 1;
    if (source.sourceType) points += 1;
    if (source.sourceUrl.trim()) points += 1;
    if (source.publicSummary.trim()) points += 1;
    if (source.provenanceRole.trim()) points += 1;
    if (relationships.length > 0) points += 1;
    if (relationships.length > 0 && boundedCount === relationships.length) {
      points += 1;
    }
    if (errors.length === 0) points += 1;

    return Math.round((points / total) * 100);
  }, [source, relationships, boundedCount, errors.length]);

  function updateSource<K extends keyof TA14ProvenanceSourceDraft>(
    key: K,
    value: TA14ProvenanceSourceDraft[K],
  ) {
    setSource((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleLink(linkId: TA14LinkId) {
    setRelationships((current) => {
      const exists = current.some(
        (relationship) => relationship.linkId === linkId,
      );

      if (exists) {
        return current.filter(
          (relationship) => relationship.linkId !== linkId,
        );
      }

      return [
        ...current,
        createTA14ProvenanceRelationship(linkId),
      ];
    });
  }

  function updateRelationship(
    linkId: TA14LinkId,
    patch: Partial<TA14ProvenanceLinkDraft>,
  ) {
    setRelationships((current) =>
      current.map((relationship) =>
        relationship.linkId === linkId
          ? { ...relationship, ...patch }
          : relationship,
      ),
    );
  }

  async function submit() {
    if (errors.length > 0 || saving) {
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const result = await persistTA14ProvenanceSubmission({
        source,
        relationships,
      });

      setSavedSourceId(result.source.id);
      setMessage(
        `Saved ${result.source.title} with ${result.relationships.length} bounded TA-14 link relationship${result.relationships.length === 1 ? "" : "s"}.`,
      );
    } catch (caught) {
      setMessage(
        caught instanceof Error
          ? caught.message
          : "Unable to save provenance source.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="intake">
      <style>{`
        .intake {
          --bg: #020711;
          --panel: rgba(8, 20, 32, .86);
          --panel2: rgba(10, 26, 40, .76);
          --line: rgba(129, 176, 210, .14);
          --lineStrong: rgba(84, 232, 255, .26);
          --cyan: #54e8ff;
          --cyanSoft: #c4f8ff;
          --indigo: #a8b2ff;
          --indigoSoft: #e0e4ff;
          --green: #45eaa6;
          --greenSoft: #c9f7df;
          --amber: #f1c769;
          --amberSoft: #ffe8aa;
          --rose: #ff96ad;
          --text: #eff8ff;
          --muted: #93a8ba;
          --dim: #647b8f;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 10% 0%, rgba(168,178,255,.12), transparent 24%),
            radial-gradient(circle at 92% 5%, rgba(84,232,255,.09), transparent 25%),
            linear-gradient(180deg, #020711 0%, #030a13 55%, #020711 100%);
        }

        .intake * {
          box-sizing: border-box;
        }

        .intake-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .intake-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .intake-hero::before {
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

        .intake-topline {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 20px;
        }

        .intake-back {
          color: var(--cyanSoft);
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }

        .intake-badge {
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

        .intake-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(420px, .92fr);
          gap: 64px;
          align-items: center;
          padding: 72px 0 84px;
        }

        .intake-kicker {
          color: var(--indigo);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .20em;
          text-transform: uppercase;
        }

        .intake-title {
          max-width: 980px;
          margin: 14px 0 0;
          font-size: clamp(3.1rem, 6vw, 6.05rem);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .intake-title span {
          display: block;
          color: var(--indigoSoft);
        }

        .intake-lead {
          max-width: 930px;
          margin: 26px 0 0;
          color: #c8d8e4;
          font-size: clamp(1rem, 1.35vw, 1.18rem);
          line-height: 1.8;
        }

        .intake-rules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .intake-rule {
          padding: 7px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.026);
          color: var(--muted);
          font-size: .56rem;
          font-weight: 850;
        }

        .intake-prefill {
          display: inline-grid;
          gap: 4px;
          margin-top: 22px;
          padding: 12px 14px;
          border: 1px solid rgba(168,178,255,.22);
          border-radius: 14px;
          background: rgba(168,178,255,.055);
        }

        .intake-prefill small {
          color: var(--dim);
          font-size: .50rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .intake-prefill strong {
          color: var(--indigoSoft);
          font-size: .72rem;
        }

        .intake-orbit {
          position: relative;
          width: min(510px, 100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .intake-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(129,176,210,.10);
          border-radius: 50%;
        }

        .intake-ring.r1 { width: 96%; height: 96%; }
        .intake-ring.r2 {
          width: 76%;
          height: 76%;
          border-color: rgba(168,178,255,.14);
        }
        .intake-ring.r3 {
          width: 56%;
          height: 56%;
          border-color: rgba(84,232,255,.12);
        }
        .intake-ring.r4 {
          width: 36%;
          height: 36%;
          border-color: rgba(241,199,105,.12);
        }

        .intake-axis-h,
        .intake-axis-v {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .intake-axis-h {
          width: 88%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(168,178,255,.16),
            transparent
          );
        }

        .intake-axis-v {
          width: 1px;
          height: 88%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(84,232,255,.13),
            transparent
          );
        }

        .intake-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 182px;
          height: 182px;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(168,178,255,.27);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(168,178,255,.13), transparent 44%),
            rgba(5,16,27,.95);
          box-shadow: 0 0 90px rgba(168,178,255,.09);
          text-align: center;
        }

        .intake-core small {
          display: block;
          color: var(--indigo);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .intake-core strong {
          display: block;
          margin-top: 5px;
          font-size: 3.4rem;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .intake-core span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
        }

        .intake-node {
          position: absolute;
          min-width: 118px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 12px 34px rgba(0,0,0,.24);
        }

        .intake-node b {
          display: block;
          color: var(--indigo);
          font-size: .55rem;
          letter-spacing: .12em;
        }

        .intake-node span {
          display: block;
          margin-top: 4px;
          color: #d7e5ef;
          font-size: .66rem;
          font-weight: 850;
        }

        .intake-node.n1 { left: 0; top: 18%; }
        .intake-node.n2 { right: 0; top: 24%; }
        .intake-node.n3 { right: 4%; bottom: 18%; }
        .intake-node.n4 { left: 0; bottom: 18%; }
        .intake-node.n5 {
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }

        .intake-metrics {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.76);
        }

        .intake-metric-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .intake-metric {
          min-height: 98px;
          padding: 20px;
          border-right: 1px solid var(--line);
        }

        .intake-metric:last-child {
          border-right: 0;
        }

        .intake-metric strong {
          display: block;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .intake-metric span {
          display: block;
          margin-top: 8px;
          color: var(--dim);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .intake-section {
          padding: 72px 0 90px;
        }

        .intake-section.alt {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.66);
        }

        .intake-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .intake-eyebrow {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .intake-h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.7rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .intake-section-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .intake-workspace {
          display: grid;
          grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
          gap: 20px;
          align-items: start;
        }

        .intake-stack {
          display: grid;
          gap: 16px;
        }

        .intake-panel {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: rgba(255,255,255,.024);
        }

        .intake-panel-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          padding: 18px 20px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(168,178,255,.05), transparent 44%),
            rgba(255,255,255,.01);
        }

        .intake-panel-head small {
          display: block;
          color: var(--indigo);
          font-size: .51rem;
          font-weight: 950;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .intake-panel-head h3 {
          margin: 6px 0 0;
          font-size: 1.15rem;
          line-height: 1.2;
        }

        .intake-panel-code {
          color: rgba(255,255,255,.09);
          font-size: 2.35rem;
          line-height: .9;
          font-weight: 950;
        }

        .intake-panel-body {
          padding: 20px;
        }

        .intake-fields {
          display: grid;
          gap: 15px;
        }

        .intake-fields.two {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .intake-field {
          display: grid;
          gap: 7px;
        }

        .intake-field-label {
          color: #dceaf4;
          font-size: .63rem;
          font-weight: 900;
        }

        .intake-field-hint {
          color: var(--dim);
          font-size: .55rem;
          line-height: 1.4;
        }

        .intake-input,
        .intake-select,
        .intake-textarea {
          width: 100%;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: #07111e;
          color: var(--text);
          outline: none;
          font-size: .67rem;
          transition: 150ms ease;
        }

        .intake-input,
        .intake-select {
          min-height: 44px;
          padding: 0 11px;
        }

        .intake-textarea {
          min-height: 112px;
          padding: 11px 12px;
          resize: vertical;
          line-height: 1.6;
        }

        .intake-input::placeholder,
        .intake-textarea::placeholder {
          color: #52687b;
        }

        .intake-input:focus,
        .intake-select:focus,
        .intake-textarea:focus {
          border-color: rgba(168,178,255,.38);
          box-shadow: 0 0 0 3px rgba(168,178,255,.07);
        }

        .intake-links-panel {
          position: sticky;
          top: 22px;
        }

        .intake-link-guide {
          margin-bottom: 16px;
          padding: 13px 14px;
          border: 1px solid rgba(84,232,255,.14);
          border-radius: 13px;
          background: rgba(84,232,255,.035);
          color: var(--muted);
          font-size: .65rem;
          line-height: 1.55;
        }

        .intake-link-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
        }

        .intake-link {
          min-height: 128px;
          display: grid;
          align-content: space-between;
          gap: 13px;
          padding: 13px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: rgba(0,0,0,.10);
          color: var(--text);
          text-align: left;
          cursor: pointer;
          transition: 160ms ease;
        }

        .intake-link:hover {
          transform: translateY(-2px);
          border-color: rgba(168,178,255,.24);
          background: rgba(168,178,255,.03);
        }

        .intake-link.selected {
          border-color: rgba(168,178,255,.40);
          background:
            radial-gradient(circle at 100% 0%, rgba(168,178,255,.09), transparent 44%),
            rgba(168,178,255,.045);
        }

        .intake-link-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 9px;
        }

        .intake-link-index {
          color: var(--cyan);
          font-size: .57rem;
          font-weight: 950;
          letter-spacing: .10em;
        }

        .intake-link-state {
          padding: 5px 7px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--dim);
          font-size: .45rem;
          font-weight: 950;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .intake-link.selected .intake-link-state {
          border-color: rgba(168,178,255,.22);
          color: var(--indigoSoft);
        }

        .intake-link-name {
          font-size: .70rem;
          font-weight: 850;
          line-height: 1.4;
        }

        .intake-link-track {
          width: 34px;
          height: 2px;
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          transition: width 160ms ease;
        }

        .intake-link:hover .intake-link-track,
        .intake-link.selected .intake-link-track {
          width: 100%;
          background: rgba(168,178,255,.34);
        }

        .intake-relations {
          display: grid;
          gap: 14px;
        }

        .intake-relation {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 17px;
          background: rgba(0,0,0,.10);
        }

        .intake-relation-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 15px;
          border-bottom: 1px solid var(--line);
          background: rgba(255,255,255,.012);
        }

        .intake-relation-head small {
          display: block;
          color: var(--cyan);
          font-size: .49rem;
          font-weight: 950;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .intake-relation-head h4 {
          margin: 5px 0 0;
          font-size: .84rem;
        }

        .intake-relation-status {
          padding: 5px 7px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--dim);
          font-size: .45rem;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .intake-relation-status.ready {
          border-color: rgba(69,234,166,.18);
          color: var(--greenSoft);
          background: rgba(69,234,166,.035);
        }

        .intake-relation-body {
          display: grid;
          gap: 14px;
          padding: 15px;
        }

        .intake-checks {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .intake-check {
          min-height: 50px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 12px;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: rgba(255,255,255,.018);
          color: #dceaf4;
          font-size: .61rem;
          font-weight: 850;
        }

        .intake-check input {
          accent-color: #a8b2ff;
        }

        .intake-validation {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 17px;
          background: rgba(0,0,0,.10);
        }

        .intake-validation.not-ready {
          border-color: rgba(241,199,105,.18);
          background: rgba(241,199,105,.03);
        }

        .intake-validation.ready {
          border-color: rgba(69,234,166,.18);
          background: rgba(69,234,166,.03);
        }

        .intake-validation-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 14px;
          border-bottom: 1px solid var(--line);
        }

        .intake-validation.not-ready .intake-validation-head {
          border-bottom-color: rgba(241,199,105,.11);
        }

        .intake-validation.ready .intake-validation-head {
          border-bottom-color: rgba(69,234,166,.11);
        }

        .intake-validation-head strong {
          font-size: .72rem;
        }

        .intake-validation.not-ready .intake-validation-head strong {
          color: var(--amberSoft);
        }

        .intake-validation.ready .intake-validation-head strong {
          color: var(--greenSoft);
        }

        .intake-validation-head span {
          color: var(--dim);
          font-size: .52rem;
          font-weight: 900;
        }

        .intake-validation-body {
          padding: 14px;
        }

        .intake-error-list {
          display: grid;
          gap: 8px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .intake-error-list li {
          display: grid;
          grid-template-columns: 16px 1fr;
          gap: 7px;
          align-items: start;
          color: #ddd5bd;
          font-size: .64rem;
          line-height: 1.5;
        }

        .intake-error-list li::before {
          content: "•";
          color: var(--amber);
          font-weight: 950;
        }

        .intake-ready-copy {
          margin: 0;
          color: #d8eadd;
          font-size: .66rem;
          line-height: 1.6;
        }

        .intake-submit {
          width: 100%;
          min-height: 50px;
          margin-top: 14px;
          border: 1px solid rgba(168,178,255,.30);
          border-radius: 12px;
          background: rgba(168,178,255,.09);
          color: var(--indigoSoft);
          cursor: pointer;
          font-size: .69rem;
          font-weight: 950;
          transition: 160ms ease;
        }

        .intake-submit:enabled:hover {
          transform: translateY(-1px);
          border-color: rgba(168,178,255,.44);
          background: rgba(168,178,255,.13);
        }

        .intake-submit:disabled {
          cursor: not-allowed;
          opacity: .38;
        }

        .intake-message {
          margin-top: 14px;
          padding: 13px 14px;
          border: 1px solid rgba(84,232,255,.14);
          border-radius: 12px;
          background: rgba(84,232,255,.03);
          color: #dceaf4;
          font-size: .64rem;
          line-height: 1.55;
        }

        .intake-source-id {
          margin-top: 8px;
          color: var(--dim);
          font-size: .54rem;
          overflow-wrap: anywhere;
        }

        .intake-summary {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.72);
        }

        .intake-summary-grid {
          display: grid;
          grid-template-columns: minmax(0, .86fr) minmax(0, 1.14fr);
          gap: 34px;
          align-items: start;
          padding: 72px 0;
        }

        .intake-summary h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.4rem);
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .intake-summary p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.75;
        }

        .intake-summary-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .intake-summary-card {
          min-height: 148px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(255,255,255,.022);
        }

        .intake-summary-card b {
          color: var(--amber);
          font-size: .56rem;
          letter-spacing: .12em;
        }

        .intake-summary-card strong {
          display: block;
          margin-top: 8px;
          font-size: .76rem;
        }

        .intake-summary-card span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.55;
        }

        .intake-selected-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 18px;
        }

        .intake-selected-chip {
          padding: 6px 8px;
          border: 1px solid rgba(84,232,255,.14);
          border-radius: 999px;
          background: rgba(84,232,255,.03);
          color: var(--cyanSoft);
          font-size: .53rem;
          font-weight: 850;
        }

        .intake-close {
          padding: 76px 0 98px;
          text-align: center;
        }

        .intake-close h2 {
          max-width: 920px;
          margin: 10px auto 0;
          font-size: clamp(2.3rem, 4.2vw, 4.6rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .intake-close p {
          max-width: 780px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .intake-close-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 26px;
        }

        .intake-button {
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

        .intake-button.primary {
          border-color: rgba(168,178,255,.26);
          background: rgba(168,178,255,.07);
          color: var(--indigoSoft);
        }

        .intake-button:hover {
          transform: translateY(-2px);
          border-color: var(--lineStrong);
        }

        @media (max-width: 1180px) {
          .intake-hero-grid {
            grid-template-columns: 1fr;
          }

          .intake-orbit {
            max-width: 500px;
          }

          .intake-workspace {
            grid-template-columns: 1fr;
          }

          .intake-links-panel {
            position: static;
          }
        }

        @media (max-width: 900px) {
          .intake-shell {
            width: min(100% - 28px, 1460px);
          }

          .intake-topline,
          .intake-section-head,
          .intake-summary-grid {
            display: grid;
            align-items: start;
          }

          .intake-title {
            font-size: clamp(2.8rem, 13vw, 4.8rem);
          }

          .intake-metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .intake-metric {
            border-bottom: 1px solid var(--line);
          }

          .intake-metric:nth-child(2n) {
            border-right: 0;
          }

          .intake-link-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .intake-fields.two,
          .intake-link-grid,
          .intake-checks,
          .intake-summary-cards {
            grid-template-columns: 1fr;
          }

          .intake-node {
            display: none;
          }

          .intake-close-actions {
            display: grid;
          }
        }
      `}</style>

      <section className="intake-hero">
        <div className="intake-shell intake-topline">
          <Link
            href="/academy/24-link-architecture/provenance"
            className="intake-back"
          >
            ← Provenance Map
          </Link>

          <span className="intake-badge">
            Administrative intake · Canonical Registry
          </span>
        </div>

        <div className="intake-shell intake-hero-grid">
          <div>
            <div className="intake-kicker">
              TA-14 Canonical Registry
            </div>

            <h1 className="intake-title">
              Register architecture provenance
              <span>without overstating it.</span>
            </h1>

            <p className="intake-lead">
              Enter a patent application, patent, publication, book, article,
              artifact, review, or other public record once, then declare the
              exact relationship that source has to each applicable TA-14 link.
            </p>

            <div className="intake-rules">
              <span className="intake-rule">One source record</span>
              <span className="intake-rule">Bounded link relationships</span>
              <span className="intake-rule">Explicit public visibility</span>
              <span className="intake-rule">No automatic overclaim</span>
            </div>

            {requestedLink ? (
              <div className="intake-prefill">
                <small>Prefilled relationship focus</small>
                <strong>
                  {requestedLink} ·{
                    " "
                  }
                  {
                    TA14_24_LINKS.find(
                      (link) => link.linkId === requestedLink,
                    )?.canonicalName
                  }
                </strong>
              </div>
            ) : null}
          </div>

          <div
            className="intake-orbit"
            aria-label="TA-14 canonical provenance intake motif"
          >
            <div className="intake-ring r1" />
            <div className="intake-ring r2" />
            <div className="intake-ring r3" />
            <div className="intake-ring r4" />
            <div className="intake-axis-h" />
            <div className="intake-axis-v" />

            <div className="intake-core">
              <div>
                <small>INTAKE READY</small>
                <strong>{completion}%</strong>
                <span>structural completion</span>
              </div>
            </div>

            <div className="intake-node n1">
              <b>{relationships.length}</b>
              <span>Links selected</span>
            </div>

            <div className="intake-node n2">
              <b>{boundedCount}</b>
              <span>Bounded statements</span>
            </div>

            <div className="intake-node n3">
              <b>{primaryCount}</b>
              <span>Primary provenance</span>
            </div>

            <div className="intake-node n4">
              <b>{publicCount}</b>
              <span>Public relations</span>
            </div>

            <div className="intake-node n5">
              <b>{errors.length}</b>
              <span>Validation issues</span>
            </div>
          </div>
        </div>
      </section>

      <section className="intake-metrics">
        <div className="intake-shell intake-metric-grid">
          <Metric value={String(relationships.length)} label="Selected links" />
          <Metric value={String(boundedCount)} label="Bounded statements" />
          <Metric value={String(primaryCount)} label="Primary provenance" />
          <Metric value={String(publicCount)} label="Public relationships" />
          <Metric value={`${completion}%`} label="Intake completion" />
        </div>
      </section>

      <section className="intake-section">
        <div className="intake-shell">
          <div className="intake-section-head">
            <div>
              <div className="intake-eyebrow">
                Canonical source intake
              </div>

              <h2 className="intake-h2">
                Establish the source first. Then bind only what it actually supports.
              </h2>
            </div>

            <p className="intake-section-copy">
              The left side establishes source identity, dates, legal/public
              status, and public explanation. The right side maps that source
              to only those canonical links for which a bounded relationship
              can be stated.
            </p>
          </div>

          <div className="intake-workspace">
            <div className="intake-stack">
              <Panel
                code="01"
                eyebrow="Source identity"
                title="Identify the public record exactly."
              >
                <div className="intake-fields">
                  <Field
                    label="Source type"
                    hint="Choose the actual source class, not the role you hope it plays."
                  >
                    <select
                      value={source.sourceType}
                      onChange={(event) =>
                        updateSource(
                          "sourceType",
                          event.target
                            .value as TA14ProvenanceSourceDraft["sourceType"],
                        )
                      }
                      className="intake-select"
                    >
                      {TA14_PROVENANCE_SOURCE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {provenanceSourceTypeLabel(type)}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label="Title"
                    hint="Use the exact public title where one exists."
                  >
                    <input
                      value={source.title}
                      onChange={(event) =>
                        updateSource("title", event.target.value)
                      }
                      className="intake-input"
                      placeholder="Exact public title"
                    />
                  </Field>

                  <Field
                    label="Identifier"
                    hint="Application, publication, patent, DOI, artifact, or record identifier."
                  >
                    <input
                      value={source.sourceIdentifier}
                      onChange={(event) =>
                        updateSource(
                          "sourceIdentifier",
                          event.target.value,
                        )
                      }
                      className="intake-input"
                      placeholder="Application, publication, patent, DOI, artifact, or record ID"
                    />
                  </Field>

                  <Field
                    label="Public URL"
                    hint="Provide the public destination that allows independent inspection."
                  >
                    <input
                      value={source.sourceUrl}
                      onChange={(event) =>
                        updateSource("sourceUrl", event.target.value)
                      }
                      className="intake-input"
                      placeholder="https://..."
                    />
                  </Field>
                </div>
              </Panel>

              <Panel
                code="02"
                eyebrow="Dates and status"
                title="Preserve chronology and legal/public state."
              >
                <div className="intake-fields two">
                  <Field label="Publication date">
                    <input
                      type="date"
                      value={source.publicationDate}
                      onChange={(event) =>
                        updateSource(
                          "publicationDate",
                          event.target.value,
                        )
                      }
                      className="intake-input"
                    />
                  </Field>

                  <Field label="Filing date">
                    <input
                      type="date"
                      value={source.filingDate}
                      onChange={(event) =>
                        updateSource("filingDate", event.target.value)
                      }
                      className="intake-input"
                    />
                  </Field>

                  <Field label="Priority date">
                    <input
                      type="date"
                      value={source.priorityDate}
                      onChange={(event) =>
                        updateSource("priorityDate", event.target.value)
                      }
                      className="intake-input"
                    />
                  </Field>

                  <Field label="Jurisdiction">
                    <input
                      value={source.jurisdiction}
                      onChange={(event) =>
                        updateSource(
                          "jurisdiction",
                          event.target.value,
                        )
                      }
                      className="intake-input"
                      placeholder="US, PCT, etc."
                    />
                  </Field>
                </div>

                <div className="intake-fields" style={{ marginTop: 15 }}>
                  <Field
                    label="Status"
                    hint="Filed, pending, published, granted, public, released, reviewed, or another accurate state."
                  >
                    <input
                      value={source.status}
                      onChange={(event) =>
                        updateSource("status", event.target.value)
                      }
                      className="intake-input"
                      placeholder="Filed, pending, published, granted, public..."
                    />
                  </Field>

                  <Field
                    label="Version"
                    hint="Optional version label when the public record has a meaningful version state."
                  >
                    <input
                      value={source.versionLabel}
                      onChange={(event) =>
                        updateSource("versionLabel", event.target.value)
                      }
                      className="intake-input"
                      placeholder="Optional version label"
                    />
                  </Field>
                </div>
              </Panel>

              <Panel
                code="03"
                eyebrow="Public explanation"
                title="Explain what the source establishes—and why it matters."
              >
                <div className="intake-fields">
                  <Field
                    label="Public summary"
                    hint="State what the source itself publicly establishes."
                  >
                    <textarea
                      value={source.publicSummary}
                      onChange={(event) =>
                        updateSource(
                          "publicSummary",
                          event.target.value,
                        )
                      }
                      className="intake-textarea"
                      placeholder="What this source publicly establishes."
                    />
                  </Field>

                  <Field
                    label="Provenance role"
                    hint="Explain why the source matters to TA-14 chronology, patent position, implementation, or review."
                  >
                    <textarea
                      value={source.provenanceRole}
                      onChange={(event) =>
                        updateSource(
                          "provenanceRole",
                          event.target.value,
                        )
                      }
                      className="intake-textarea"
                      placeholder="Why this source matters to TA-14 chronology, patent position, implementation, or review."
                    />
                  </Field>
                </div>
              </Panel>
            </div>

            <div className="intake-stack intake-links-panel">
              <Panel
                code="04"
                eyebrow="Applicable links"
                title="Select only source-grounded relationships."
              >
                <div className="intake-link-guide">
                  Select only links for which you can state a bounded,
                  source-grounded relationship. Selection alone does not make
                  the relationship primary, public, or proven.
                </div>

                <div className="intake-link-grid">
                  {TA14_24_LINKS.map((link) => {
                    const selected = relationships.some(
                      (relationship) =>
                        relationship.linkId === link.linkId,
                    );

                    return (
                      <button
                        key={link.linkId}
                        type="button"
                        onClick={() => toggleLink(link.linkId)}
                        className={[
                          "intake-link",
                          selected ? "selected" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <div className="intake-link-top">
                          <span className="intake-link-index">
                            {String(link.order).padStart(2, "0")}
                          </span>

                          <span className="intake-link-state">
                            {selected ? "Selected" : "Open"}
                          </span>
                        </div>

                        <div>
                          <div className="intake-link-name">
                            {link.canonicalName}
                          </div>
                          <div className="intake-link-track" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Panel>

              {relationships.length > 0 ? (
                <Panel
                  code="05"
                  eyebrow="Bound relationships"
                  title="State exactly what this source establishes for each link."
                >
                  <div className="intake-relations">
                    {relationships
                      .slice()
                      .sort((a, b) => a.linkId.localeCompare(b.linkId))
                      .map((relationship) => {
                        const canonical = TA14_24_LINKS.find(
                          (link) =>
                            link.linkId === relationship.linkId,
                        );
                        const ready =
                          relationship.relationSummary.trim().length > 0;

                        return (
                          <article
                            key={relationship.linkId}
                            className="intake-relation"
                          >
                            <div className="intake-relation-head">
                              <div>
                                <small>
                                  Link {String(canonical?.order ?? 0).padStart(2, "0")}
                                </small>
                                <h4>{canonical?.canonicalName}</h4>
                              </div>

                              <span
                                className={[
                                  "intake-relation-status",
                                  ready ? "ready" : "",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                              >
                                {ready ? "Bounded" : "Needs statement"}
                              </span>
                            </div>

                            <div className="intake-relation-body">
                              <Field label="Relationship type">
                                <select
                                  value={relationship.relationType}
                                  onChange={(event) =>
                                    updateRelationship(
                                      relationship.linkId,
                                      {
                                        relationType:
                                          event.target
                                            .value as TA14ProvenanceLinkDraft["relationType"],
                                      },
                                    )
                                  }
                                  className="intake-select"
                                >
                                  {TA14_PROVENANCE_RELATION_TYPES.map(
                                    (type) => (
                                      <option key={type} value={type}>
                                        {provenanceRelationTypeLabel(type)}
                                      </option>
                                    ),
                                  )}
                                </select>
                              </Field>

                              <Field
                                label="Bounded relationship statement"
                                hint="State what this source establishes for this link—and no more."
                              >
                                <textarea
                                  value={relationship.relationSummary}
                                  onChange={(event) =>
                                    updateRelationship(
                                      relationship.linkId,
                                      {
                                        relationSummary:
                                          event.target.value,
                                      },
                                    )
                                  }
                                  className="intake-textarea"
                                  placeholder="State exactly what this source establishes for this link—and no more."
                                />
                              </Field>

                              <div className="intake-checks">
                                <label className="intake-check">
                                  <input
                                    type="checkbox"
                                    checked={
                                      relationship.isPrimaryProvenance
                                    }
                                    onChange={(event) =>
                                      updateRelationship(
                                        relationship.linkId,
                                        {
                                          isPrimaryProvenance:
                                            event.target.checked,
                                        },
                                      )
                                    }
                                  />
                                  Primary provenance
                                </label>

                                <label className="intake-check">
                                  <input
                                    type="checkbox"
                                    checked={
                                      relationship.publicVisibility
                                    }
                                    onChange={(event) =>
                                      updateRelationship(
                                        relationship.linkId,
                                        {
                                          publicVisibility:
                                            event.target.checked,
                                        },
                                      )
                                    }
                                  />
                                  Publicly visible
                                </label>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                  </div>
                </Panel>
              ) : null}

              <Panel
                code="06"
                eyebrow="Validation"
                title="Validate and register the canonical source."
              >
                <div
                  className={[
                    "intake-validation",
                    errors.length > 0 ? "not-ready" : "ready",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="intake-validation-head">
                    <strong>
                      {errors.length > 0
                        ? "Intake is not ready yet."
                        : "Source is structurally ready for registration."}
                    </strong>

                    <span>
                      {errors.length > 0
                        ? `${errors.length} issue${errors.length === 1 ? "" : "s"}`
                        : "Validation passed"}
                    </span>
                  </div>

                  <div className="intake-validation-body">
                    {errors.length > 0 ? (
                      <ul className="intake-error-list">
                        {errors.map((error) => (
                          <li key={error}>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="intake-ready-copy">
                        The source has the required identity and at least one
                        bounded TA-14 link relationship. Registration will
                        preserve the source and its declared relationship records.
                      </p>
                    )}
                  </div>
                </div>

                {message ? (
                  <div className="intake-message">
                    {message}
                  </div>
                ) : null}

                {savedSourceId ? (
                  <div className="intake-source-id">
                    Source record: {savedSourceId}
                  </div>
                ) : null}

                <button
                  type="button"
                  disabled={errors.length > 0 || saving}
                  onClick={() => void submit()}
                  className="intake-submit"
                >
                  {saving
                    ? "Registering provenance…"
                    : "Register canonical source"}
                </button>
              </Panel>
            </div>
          </div>
        </div>
      </section>

      <section className="intake-summary">
        <div className="intake-shell intake-summary-grid">
          <div>
            <div
              className="intake-eyebrow"
              style={{ color: "var(--amber)" }}
            >
              Registration boundary
            </div>

            <h2>
              A source can support chronology, implementation, patent position,
              or review without proving everything at once.
            </h2>

            <p>
              Canonical provenance intake exists to preserve the source once,
              then record the exact relationship it has to each applicable
              TA-14 link. A publication, patent filing, artifact, or review
              should never be silently promoted into a broader claim than its
              own public record supports.
            </p>

            {selectedLinks.length > 0 ? (
              <div className="intake-selected-strip">
                {selectedLinks.map((item) => (
                  <span
                    key={item.linkId}
                    className="intake-selected-chip"
                  >
                    {String(item.order).padStart(2, "0")} {item.canonicalName}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="intake-summary-cards">
            <BoundaryCard
              code="SRC"
              title="Source identity stays singular"
              text="The public record is entered once, then reused through bounded relationship records rather than duplicated with inconsistent metadata."
            />

            <BoundaryCard
              code="REL"
              title="Relationships stay explicit"
              text="Each selected link receives its own relationship type and bounded statement so one source cannot silently overclaim the whole architecture."
            />

            <BoundaryCard
              code="PRI"
              title="Primary provenance is declared"
              text="Primary-provenance status is an explicit relationship attribute, not something inferred merely because a source is old, important, or public."
            />

            <BoundaryCard
              code="VIS"
              title="Visibility is controlled"
              text="Public visibility is declared per relationship so internal or non-public mappings do not accidentally become public representations."
            />
          </div>
        </div>
      </section>

      <section className="intake-close">
        <div className="intake-shell">
          <div
            className="intake-eyebrow"
            style={{ color: "var(--indigo)" }}
          >
            Preserve the source. Bound the claim.
          </div>

          <h2>
            Register what exists.
            <br />
            State only what it proves.
          </h2>

          <p>
            The canonical registry becomes trustworthy only when source
            identity, chronology, relationship type, public visibility, and
            claim boundary remain inspectable as separate governed records.
          </p>

          <div className="intake-close-actions">
            <Link
              href="/academy/24-link-architecture/provenance"
              className="intake-button primary"
            >
              Return to Provenance Map →
            </Link>

            <Link
              href="/academy/24-link-architecture/provenance/patents"
              className="intake-button"
            >
              Open Patent Portfolio
            </Link>

            <Link
              href="/academy/24-link-architecture"
              className="intake-button"
            >
              Open 24-Link Explorer
            </Link>
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
    <div className="intake-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Panel({
  code,
  eyebrow,
  title,
  children,
}: {
  code: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="intake-panel">
      <div className="intake-panel-head">
        <div>
          <small>{eyebrow}</small>
          <h3>{title}</h3>
        </div>

        <span className="intake-panel-code">{code}</span>
      </div>

      <div className="intake-panel-body">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="intake-field">
      <span className="intake-field-label">
        {label}
      </span>

      {hint ? (
        <span className="intake-field-hint">
          {hint}
        </span>
      ) : null}

      {children}
    </label>
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
    <article className="intake-summary-card">
      <b>{code}</b>
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}

function ProvenanceIntakeLoading() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        color: "#eff8ff",
        background:
          "radial-gradient(circle at 50% 0%, rgba(168,178,255,.09), transparent 30%), #020711",
      }}
    >
      <section
        style={{
          width: "min(760px, 100%)",
          padding: "34px",
          border: "1px solid rgba(129,176,210,.14)",
          borderRadius: "22px",
          background: "rgba(255,255,255,.025)",
        }}
      >
        <small
          style={{
            color: "#a8b2ff",
            fontSize: ".62rem",
            fontWeight: 950,
            letterSpacing: ".18em",
            textTransform: "uppercase",
          }}
        >
          TA-14 Canonical Registry
        </small>

        <h1
          style={{
            margin: "10px 0 0",
            fontSize: "2.3rem",
            letterSpacing: "-.04em",
          }}
        >
          Loading provenance intake…
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            color: "#93a8ba",
            lineHeight: 1.7,
            fontSize: ".76rem",
          }}
        >
          Preparing the bounded TA-14 source and link-relationship state.
        </p>
      </section>
    </main>
  );
}
