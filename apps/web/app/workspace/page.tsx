'use client';

import { useMemo, useRef, useState } from 'react';

type Decision = 'HOLD' | 'ALLOW' | 'DENY' | 'ESCALATE';

type RequirementResult = {
  requirementId: string;
  result: Decision | 'PASS' | 'FAIL';
  reason: string;
};

type ApiRecord = {
  rid: string;
  version: number;
  decision: Decision;
  receipt?: {
    nextAction?: string;
    decisionFingerprint?: string;
    results?: RequirementResult[];
  };
  aer?: unknown;
  registry?: Record<string, unknown> | null;
  correlationId?: string;
};

type RouteForm = {
  organizationName: string;
  systemName: string;
  actorId: string;
  supplierId: string;
  invoiceId: string;
  beneficiaryId: string;
  amountUsd: string;
};

type DemoPackage = {
  id: string;
  number: string;
  icon: string;
  category: string;
  title: string;
  description: string;
  consequence: string;
  routeLabel: string;
  policyLabel: string;
  accent: string;
  tags: string[];
  form: RouteForm;
};

const sha256Placeholder = '0'.repeat(64);

const fieldLabels: Record<string, string> = {
  organizationName: 'Organization name',
  systemName: 'Governance system or accountable agent',
  actorId: 'Accountable actor ID',
  supplierId: 'Supplier or destination ID',
  invoiceId: 'Invoice or action object ID',
  beneficiaryId: 'Beneficiary ID',
  amountUsd: 'Consequence value (USD)',
  procurementAuthorityId: 'Procurement authority ID',
  procurementIssuer: 'Procurement authority issuer',
  procurementEffectiveAt: 'Procurement effective time',
  procurementExpiresAt: 'Procurement expiry time',
  financeAuthorityId: 'Finance authority ID',
  financeIssuer: 'Finance authority issuer',
  financeEffectiveAt: 'Finance effective time',
  financeExpiresAt: 'Finance expiry time',
  beneficiaryEvidenceId: 'Beneficiary evidence ID',
  beneficiaryEvidenceSource: 'Evidence source',
  beneficiaryEvidenceHash: 'Evidence SHA-256',
};

const phases = ['Define', 'Test', 'Correct', 'AER', 'Preserve'];

const demoPackages: DemoPackage[] = [
  {
    id: 'vendor-payment',
    number: '01',
    icon: '◇',
    category: 'Finance governance',
    title: 'Vendor Payment Route',
    description:
      'Test a payment above the governed threshold. The first execution is intentionally incomplete so TA-14 can expose missing dual authority and beneficiary binding.',
    consequence: 'USD 32,500 vendor payment',
    routeLabel: 'Vendor payment above USD 25,000',
    policyLabel: 'PROC-PAY-2026.1',
    accent: 'cyan',
    tags: ['Dual authority', 'Beneficiary binding', 'Correction history'],
    form: {
      organizationName: 'Northstar Procurement Group',
      systemName: 'Procurement Agent v4.2',
      actorId: 'buyer-001',
      supplierId: 'apex-industrial-009',
      invoiceId: 'INV-2026-0716',
      beneficiaryId: 'beneficiary-apex-009',
      amountUsd: '32500',
    },
  },
  {
    id: 'agent-purchase',
    number: '02',
    icon: '⌘',
    category: 'AI agent governance',
    title: 'Autonomous Agent Purchase',
    description:
      'Challenge an AI purchasing agent that is attempting to authorize a consequential acquisition without complete accountable authority.',
    consequence: 'USD 48,750 autonomous acquisition',
    routeLabel: 'Autonomous purchasing agent route',
    policyLabel: 'PROC-PAY-2026.1',
    accent: 'violet',
    tags: ['Agent identity', 'Tool authority', 'Destination proof'],
    form: {
      organizationName: 'Helix Autonomous Systems',
      systemName: 'Procurement Copilot v7.1',
      actorId: 'agent-supervisor-204',
      supplierId: 'quantum-compute-supply-441',
      invoiceId: 'AGENT-PO-88421',
      beneficiaryId: 'beneficiary-qcs-441',
      amountUsd: '48750',
    },
  },
  {
    id: 'infrastructure',
    number: '03',
    icon: '↯',
    category: 'Infrastructure governance',
    title: 'Critical Equipment Acquisition',
    description:
      'Evaluate an emergency infrastructure purchase where operational urgency cannot replace evidence, authority, or exact beneficiary binding.',
    consequence: 'USD 76,400 infrastructure purchase',
    routeLabel: 'Critical infrastructure acquisition route',
    policyLabel: 'PROC-PAY-2026.1',
    accent: 'amber',
    tags: ['Operational urgency', 'Current authority', 'Exact object binding'],
    form: {
      organizationName: 'Civic Grid Operations',
      systemName: 'Emergency Procurement Controller',
      actorId: 'grid-ops-director-014',
      supplierId: 'resilience-power-systems-118',
      invoiceId: 'GRID-EMERGENCY-6208',
      beneficiaryId: 'beneficiary-rps-118',
      amountUsd: '76400',
    },
  },
  {
    id: 'environmental',
    number: '04',
    icon: '◎',
    category: 'Environmental governance',
    title: 'Refrigerant Recovery Authorization',
    description:
      'Test the commercial authorization route supporting a governed refrigerant recovery operation while preserving the boundary between payment authority and field evidence.',
    consequence: 'USD 27,850 governed recovery scope',
    routeLabel: 'Environmental service authorization route',
    policyLabel: 'PROC-PAY-2026.1',
    accent: 'green',
    tags: ['Environmental scope', 'Accountable actor', 'Preserved route'],
    form: {
      organizationName: 'Transparent Air Environmental Services',
      systemName: 'TA-14 Refrigerant Governor',
      actorId: 'authorized-technician-014',
      supplierId: 'certified-reclaimer-608',
      invoiceId: 'RECOVERY-SCOPE-TA14-001',
      beneficiaryId: 'beneficiary-reclaimer-608',
      amountUsd: '27850',
    },
  },
];

function phaseStatus(record: ApiRecord | null, index: number) {
  if (!record) return index === 0 ? 'active' : '';

  if (record.registry) {
    return index <= 4 ? 'complete' : '';
  }

  if (record.decision === 'ALLOW') {
    return index <= 3 ? 'complete' : '';
  }

  if (record.decision === 'HOLD') {
    if (index < 2) return 'complete';
    return index === 2 ? 'active' : '';
  }

  return index <= 1 ? 'complete' : '';
}

function formatCurrency(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return 'Not defined';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function WorkspacePage() {
  const routeWorkspaceRef = useRef<HTMLDivElement | null>(null);

  const [record, setRecord] = useState<ApiRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [selectedDemoId, setSelectedDemoId] = useState(demoPackages[0].id);
  const [workspaceMode, setWorkspaceMode] = useState<'package' | 'custom'>(
    'package',
  );

  const selectedDemo =
    demoPackages.find((demo) => demo.id === selectedDemoId) || demoPackages[0];

  const [form, setForm] = useState<RouteForm>({
    ...demoPackages[0].form,
  });

  const validFrom = useMemo(
    () => new Date(Date.now() - 60_000).toISOString(),
    [],
  );

  const validUntil = useMemo(
    () => new Date(Date.now() + 30 * 86_400_000).toISOString(),
    [],
  );

  const [correction, setCorrection] = useState({
    procurementAuthorityId: 'TA14-AID-PROC-001',
    procurementIssuer: 'Procurement Director',
    procurementEffectiveAt: validFrom,
    procurementExpiresAt: validUntil,
    financeAuthorityId: 'TA14-AID-FIN-001',
    financeIssuer: 'Finance Director',
    financeEffectiveAt: validFrom,
    financeExpiresAt: validUntil,
    beneficiaryEvidenceId: 'TA14-EID-BEN-001',
    beneficiaryEvidenceSource: 'Beneficiary verification record',
    beneficiaryEvidenceHash: sha256Placeholder,
  });

  function scrollToWorkspace() {
    window.setTimeout(() => {
      routeWorkspaceRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  }

  function resetRuntimeState() {
    setRecord(null);
    setError('');
  }

  function launchDemo(demo: DemoPackage) {
    setSelectedDemoId(demo.id);
    setWorkspaceMode('package');
    setForm({ ...demo.form });
    resetRuntimeState();
    scrollToWorkspace();
  }

  function launchCustomBuilder() {
    setWorkspaceMode('custom');
    setForm({
      organizationName: '',
      systemName: '',
      actorId: '',
      supplierId: '',
      invoiceId: '',
      beneficiaryId: '',
      amountUsd: '',
    });
    resetRuntimeState();
    scrollToWorkspace();
  }

  function restartCurrentRoute() {
    resetRuntimeState();
  }

  async function call(url: string, body: unknown = {}) {
    setBusy(true);
    setError('');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          `${payload.error || 'Request failed'}${
            payload.correlationId
              ? ` · correlation ${payload.correlationId}`
              : ''
          }`,
        );
      }

      setRecord(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Request failed');
    } finally {
      setBusy(false);
    }
  }

  const correctionBody = record
    ? {
        expectedVersion: record.version,
        procurementAuthority: {
          authorityId: correction.procurementAuthorityId,
          issuer: correction.procurementIssuer,
          effectiveAt: correction.procurementEffectiveAt,
          expiresAt: correction.procurementExpiresAt,
        },
        financeAuthority: {
          authorityId: correction.financeAuthorityId,
          issuer: correction.financeIssuer,
          effectiveAt: correction.financeEffectiveAt,
          expiresAt: correction.financeExpiresAt,
        },
        beneficiaryEvidence: {
          evidenceId: correction.beneficiaryEvidenceId,
          source: correction.beneficiaryEvidenceSource,
          hash: correction.beneficiaryEvidenceHash,
        },
      }
    : {};

  const routeTitle =
    workspaceMode === 'custom'
      ? 'Build Your Own Consequential Route'
      : selectedDemo.routeLabel;

  const routeCategory =
    workspaceMode === 'custom'
      ? 'Builder-controlled route'
      : selectedDemo.category;

  const policyLabel =
    workspaceMode === 'custom'
      ? 'PROC-PAY-2026.1 · Current bounded engine'
      : selectedDemo.policyLabel;

  const routeDescription =
    workspaceMode === 'custom'
      ? 'Enter your own organization, accountable system, actor, destination, action object, beneficiary, and consequence value. TA-14 will evaluate the submitted route using the current bounded payment-governance engine.'
      : selectedDemo.description;

  const formComplete = Object.values(form).every(
    (value) => value.trim().length > 0,
  );

  return (
    <main className="workspace-shell">
      <style>{`
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #02050a;
          color: #f5f8ff;
        }

        button,
        input {
          font: inherit;
        }

        .workspace-shell {
          min-height: 100vh;
          padding: 28px 0 110px;
          overflow: hidden;
          background:
            radial-gradient(circle at 8% 0%, rgba(39, 162, 255, .18), transparent 30%),
            radial-gradient(circle at 92% 8%, rgba(60, 241, 166, .11), transparent 28%),
            radial-gradient(circle at 50% 52%, rgba(103, 80, 255, .07), transparent 36%),
            linear-gradient(180deg, #02050a 0%, #06101b 46%, #03070d 100%);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .workspace-shell::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: .23;
          background-image:
            linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px);
          background-size: 38px 38px;
          mask-image: linear-gradient(to bottom, #000, transparent 88%);
        }

        .workspace-shell::after {
          content: "";
          position: fixed;
          top: -180px;
          left: 50%;
          z-index: 0;
          width: 760px;
          height: 420px;
          pointer-events: none;
          transform: translateX(-50%);
          border-radius: 50%;
          background: rgba(58, 206, 255, .07);
          filter: blur(90px);
        }

        .wrap {
          position: relative;
          z-index: 1;
          width: min(1220px, 92vw);
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 88px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          text-decoration: none;
          font-weight: 900;
          letter-spacing: .08em;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(84, 232, 255, .48);
          border-radius: 14px;
          background:
            linear-gradient(
              145deg,
              rgba(84, 232, 255, .18),
              rgba(41, 167, 255, .05)
            );
          box-shadow:
            0 0 34px rgba(41, 167, 255, .20),
            inset 0 0 18px rgba(84, 232, 255, .04);
        }

        .top-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .link-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 16px;
          border: 1px solid rgba(150, 180, 215, .20);
          border-radius: 999px;
          color: #dce8f6;
          background: rgba(8, 17, 29, .66);
          text-decoration: none;
          font-weight: 800;
          transition:
            border-color .2s ease,
            background .2s ease,
            transform .2s ease;
        }

        .link-button:hover {
          transform: translateY(-1px);
          border-color: rgba(84, 232, 255, .42);
          background: rgba(14, 29, 47, .86);
        }

        .hero {
          max-width: 1030px;
          margin-bottom: 64px;
        }

        .eyebrow {
          color: #63e9ff;
          font-size: .75rem;
          font-weight: 900;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 1100px;
          margin: 20px 0 24px;
          font-size: clamp(3.25rem, 8vw, 7.2rem);
          line-height: .91;
          letter-spacing: -.07em;
        }

        .gradient {
          color: transparent;
          background:
            linear-gradient(
              100deg,
              #ffffff 8%,
              #8cecff 47%,
              #4ff0b2 92%
            );
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero p {
          max-width: 820px;
          margin: 0;
          color: #9eb0c5;
          font-size: clamp(1.06rem, 2vw, 1.3rem);
          line-height: 1.78;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .hero-stat-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 32px;
        }

        .hero-stat {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          min-height: 36px;
          padding: 0 13px;
          border: 1px solid rgba(132, 172, 211, .14);
          border-radius: 999px;
          color: #a9bbcf;
          background: rgba(7, 15, 26, .56);
          font-size: .78rem;
          font-weight: 800;
        }

        .hero-stat::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #53efb1;
          box-shadow: 0 0 13px rgba(83, 239, 177, .65);
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 26px;
        }

        .section-heading h2 {
          max-width: 760px;
          margin: 12px 0 0;
          font-size: clamp(2rem, 4vw, 3.7rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .section-heading p {
          max-width: 440px;
          margin: 0;
          color: #91a5ba;
          line-height: 1.7;
        }

        .demo-library {
          margin-bottom: 92px;
        }

        .demo-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .demo-card {
          position: relative;
          display: flex;
          min-height: 350px;
          flex-direction: column;
          padding: 28px;
          overflow: hidden;
          border: 1px solid rgba(137, 174, 213, .15);
          border-radius: 26px;
          background:
            linear-gradient(
              180deg,
              rgba(14, 27, 44, .86),
              rgba(5, 12, 21, .92)
            );
          box-shadow: 0 28px 80px rgba(0, 0, 0, .25);
          transition:
            transform .22s ease,
            border-color .22s ease,
            box-shadow .22s ease;
        }

        .demo-card:hover {
          transform: translateY(-4px);
          border-color: rgba(84, 232, 255, .34);
          box-shadow: 0 34px 100px rgba(0, 0, 0, .36);
        }

        .demo-card.selected {
          border-color: rgba(84, 232, 255, .46);
          box-shadow:
            0 34px 100px rgba(0, 0, 0, .36),
            0 0 50px rgba(41, 167, 255, .09);
        }

        .demo-card::before {
          content: "";
          position: absolute;
          top: -110px;
          right: -80px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          opacity: .14;
          filter: blur(16px);
        }

        .demo-card.cyan::before {
          background: #49dfff;
        }

        .demo-card.violet::before {
          background: #8f78ff;
        }

        .demo-card.amber::before {
          background: #ffc65c;
        }

        .demo-card.green::before {
          background: #48efa7;
        }

        .demo-card-top {
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .demo-number {
          color: #547089;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;
          font-size: .78rem;
          font-weight: 900;
          letter-spacing: .12em;
        }

        .demo-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(126, 193, 225, .20);
          border-radius: 15px;
          color: #8beaff;
          background: rgba(8, 19, 31, .78);
          font-size: 1.3rem;
          box-shadow: inset 0 0 20px rgba(84, 232, 255, .05);
        }

        .demo-category {
          position: relative;
          margin-top: 44px;
          color: #6bdff6;
          font-size: .72rem;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .demo-card h3 {
          position: relative;
          margin: 10px 0 14px;
          font-size: clamp(1.6rem, 3vw, 2.3rem);
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .demo-card p {
          position: relative;
          margin: 0;
          color: #91a5ba;
          line-height: 1.68;
        }

        .demo-tags {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 22px;
        }

        .demo-tag {
          min-height: 29px;
          padding: 6px 10px;
          border: 1px solid rgba(143, 178, 213, .13);
          border-radius: 999px;
          color: #9eb3c8;
          background: rgba(3, 9, 16, .42);
          font-size: .7rem;
          font-weight: 800;
        }

        .demo-card-bottom {
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-top: auto;
          padding-top: 28px;
        }

        .consequence {
          display: grid;
          gap: 5px;
          color: #70869b;
          font-size: .7rem;
          font-weight: 900;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .consequence strong {
          color: #eef7ff;
          font-size: .9rem;
          letter-spacing: 0;
          text-transform: none;
        }

        .launch-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0 16px;
          border: 1px solid rgba(84, 232, 255, .23);
          border-radius: 999px;
          color: #e7f8ff;
          background: rgba(14, 34, 52, .86);
          cursor: pointer;
          font-weight: 900;
          transition:
            transform .2s ease,
            border-color .2s ease,
            background .2s ease;
        }

        .launch-button:hover {
          transform: translateY(-1px);
          border-color: rgba(84, 232, 255, .52);
          background: rgba(20, 49, 72, .94);
        }

        .builder-banner {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) auto;
          gap: 28px;
          align-items: center;
          margin-top: 20px;
          padding: clamp(26px, 5vw, 48px);
          overflow: hidden;
          border: 1px solid rgba(84, 232, 255, .22);
          border-radius: 30px;
          background:
            radial-gradient(
              circle at 85% 40%,
              rgba(57, 242, 161, .11),
              transparent 30%
            ),
            linear-gradient(
              110deg,
              rgba(18, 41, 61, .95),
              rgba(6, 15, 25, .96)
            );
          box-shadow:
            0 35px 100px rgba(0, 0, 0, .30),
            inset 0 0 70px rgba(84, 232, 255, .025);
        }

        .builder-banner::before {
          content: "BUILD";
          position: absolute;
          right: 32px;
          bottom: -28px;
          color: rgba(255, 255, 255, .025);
          font-size: clamp(5rem, 14vw, 10rem);
          font-weight: 1000;
          letter-spacing: -.08em;
        }

        .builder-copy {
          position: relative;
          max-width: 760px;
        }

        .builder-copy h3 {
          margin: 12px 0 14px;
          font-size: clamp(2rem, 4vw, 3.6rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .builder-copy p {
          margin: 0;
          color: #9db1c5;
          line-height: 1.72;
        }

        .primary,
        .secondary,
        .action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 0 21px;
          border-radius: 999px;
          cursor: pointer;
          text-decoration: none;
          font-weight: 900;
          transition:
            transform .2s ease,
            filter .2s ease,
            border-color .2s ease;
        }

        .primary {
          border: 0;
          color: #03100c;
          background:
            linear-gradient(
              100deg,
              #54e8ff,
              #39f2a1
            );
          box-shadow: 0 0 36px rgba(57, 242, 161, .17);
        }

        .primary:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.07);
        }

        .secondary {
          border: 1px solid rgba(142, 180, 219, .24);
          color: #dce8f6;
          background: rgba(11, 22, 37, .78);
        }

        .secondary:hover:not(:disabled) {
          transform: translateY(-1px);
          border-color: rgba(84, 232, 255, .42);
        }

        button:disabled {
          cursor: not-allowed;
          opacity: .56;
        }

        .runtime-section {
          scroll-margin-top: 24px;
        }

        .runtime-intro {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .runtime-intro h2 {
          margin: 12px 0 0;
          font-size: clamp(2.2rem, 5vw, 4.3rem);
          line-height: .98;
          letter-spacing: -.06em;
        }

        .runtime-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-height: 38px;
          padding: 0 13px;
          border: 1px solid rgba(84, 232, 255, .22);
          border-radius: 999px;
          color: #9deeff;
          background: rgba(7, 18, 29, .74);
          font-size: .73rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .runtime-badge::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4af0aa;
          box-shadow: 0 0 12px rgba(74, 240, 170, .62);
        }

        .phase-rail {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin: 0 0 28px;
        }

        .phase {
          position: relative;
          min-height: 80px;
          padding: 16px;
          overflow: hidden;
          border: 1px solid rgba(137, 174, 213, .14);
          border-radius: 18px;
          color: #71859b;
          background: rgba(8, 17, 29, .62);
          font-weight: 800;
        }

        .phase span {
          display: block;
          margin-bottom: 8px;
          color: #51687e;
          font-size: .7rem;
          letter-spacing: .14em;
        }

        .phase.active,
        .phase.complete {
          border-color: rgba(84, 232, 255, .34);
          color: #eef8ff;
          box-shadow: 0 0 34px rgba(41, 167, 255, .10);
        }

        .phase.complete::after {
          content: "";
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 2px;
          background:
            linear-gradient(
              90deg,
              #29a7ff,
              #54e8ff,
              #39f2a1
            );
        }

        .alert {
          margin: 0 0 22px;
          padding: 16px 18px;
          border: 1px solid rgba(255, 69, 107, .27);
          border-radius: 15px;
          color: #ffc2cf;
          background: rgba(255, 69, 107, .07);
        }

        .grid-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1.15fr)
            minmax(320px, .85fr);
          gap: 22px;
          align-items: start;
        }

        .panel {
          overflow: hidden;
          border: 1px solid rgba(135, 172, 211, .16);
          border-radius: 26px;
          background:
            linear-gradient(
              180deg,
              rgba(13, 25, 41, .90),
              rgba(6, 13, 23, .91)
            );
          box-shadow: 0 30px 90px rgba(0, 0, 0, .34);
        }

        .panel-inner {
          padding: clamp(22px, 4vw, 38px);
        }

        .panel-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }

        .panel h2 {
          margin: 10px 0 0;
          font-size: clamp(1.7rem, 3vw, 2.65rem);
          letter-spacing: -.04em;
        }

        .panel-head p,
        .muted {
          color: #93a6ba;
          line-height: 1.7;
        }

        .panel-head p {
          max-width: 420px;
          margin: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .field {
          display: grid;
          gap: 8px;
        }

        .field span {
          color: #aebed0;
          font-size: .78rem;
          font-weight: 800;
          letter-spacing: .05em;
        }

        .field input {
          width: 100%;
          min-height: 50px;
          padding: 0 14px;
          border: 1px solid rgba(137, 174, 213, .17);
          border-radius: 13px;
          outline: none;
          color: #eef7ff;
          background: rgba(2, 7, 13, .66);
          transition:
            border-color .2s ease,
            box-shadow .2s ease;
        }

        .field input:focus {
          border-color: #54e8ff;
          box-shadow: 0 0 0 3px rgba(84, 232, 255, .09);
        }

        .field input:disabled {
          color: #75889c;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .boundary {
          margin-top: 22px;
          padding: 16px 18px;
          border: 1px solid rgba(255, 212, 106, .16);
          border-radius: 14px;
          color: #c5b98f;
          background: rgba(255, 212, 106, .045);
          font-size: .88rem;
          line-height: 1.6;
        }

        .status-panel {
          position: sticky;
          top: 22px;
        }

        .decision-orb {
          display: grid;
          place-items: center;
          width: 154px;
          height: 154px;
          margin: 26px auto;
          border: 1px solid rgba(84, 232, 255, .28);
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(84, 232, 255, .13),
              rgba(41, 167, 255, .03) 60%,
              transparent 70%
            );
          box-shadow:
            0 0 70px rgba(41, 167, 255, .16),
            inset 0 0 40px rgba(84, 232, 255, .08);
        }

        .decision-orb strong {
          font-size: 1.65rem;
          letter-spacing: .08em;
        }

        .decision-orb.hold {
          border-color: rgba(255, 69, 107, .38);
          box-shadow: 0 0 70px rgba(255, 69, 107, .16);
        }

        .decision-orb.allow {
          border-color: rgba(57, 242, 161, .42);
          box-shadow: 0 0 70px rgba(57, 242, 161, .18);
        }

        .decision-orb.deny {
          border-color: rgba(255, 116, 72, .42);
          box-shadow: 0 0 70px rgba(255, 116, 72, .17);
        }

        .decision-orb.escalate {
          border-color: rgba(255, 203, 82, .42);
          box-shadow: 0 0 70px rgba(255, 203, 82, .16);
        }

        .status-copy {
          color: #9cafc2;
          line-height: 1.7;
          text-align: center;
        }

        .route-meta {
          display: grid;
          gap: 10px;
          margin-top: 24px;
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 13px 0;
          border-top: 1px solid rgba(137, 174, 213, .11);
          color: #8195aa;
          font-size: .84rem;
        }

        .meta-row strong {
          color: #eaf5ff;
          text-align: right;
          overflow-wrap: anywhere;
        }

        .result-panel {
          margin-top: 22px;
        }

        .result-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 0 11px;
          border-radius: 999px;
          font-size: .72rem;
          font-weight: 900;
          letter-spacing: .11em;
        }

        .pill.HOLD,
        .pill.FAIL {
          border: 1px solid rgba(255, 69, 107, .24);
          color: #ff8ca3;
          background: rgba(255, 69, 107, .10);
        }

        .pill.ALLOW,
        .pill.PASS {
          border: 1px solid rgba(57, 242, 161, .23);
          color: #72f6b8;
          background: rgba(57, 242, 161, .09);
        }

        .pill.DENY {
          border: 1px solid rgba(255, 116, 72, .25);
          color: #ff9a77;
          background: rgba(255, 116, 72, .09);
        }

        .pill.ESCALATE {
          border: 1px solid rgba(255, 203, 82, .25);
          color: #ffd977;
          background: rgba(255, 203, 82, .09);
        }

        .fingerprint {
          margin: 22px 0;
          padding: 15px;
          border-radius: 13px;
          color: #7de9ff;
          background: #02070c;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;
          overflow-wrap: anywhere;
        }

        .requirements {
          display: grid;
          gap: 12px;
        }

        .requirement {
          padding: 17px;
          border: 1px solid rgba(137, 174, 213, .13);
          border-radius: 15px;
          background: rgba(2, 8, 14, .42);
        }

        .requirement-top {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .requirement p {
          margin: 11px 0 0;
          color: #91a5b9;
          line-height: 1.6;
        }

        .subpanel {
          margin-top: 24px;
          padding: 24px;
          border: 1px solid rgba(84, 232, 255, .15);
          border-radius: 20px;
          background: rgba(6, 15, 25, .68);
        }

        .preserved {
          text-align: center;
        }

        .scope-note {
          margin-top: 92px;
          padding: 28px;
          border: 1px solid rgba(137, 174, 213, .13);
          border-radius: 22px;
          color: #879caf;
          background: rgba(5, 12, 21, .58);
          line-height: 1.7;
        }

        .scope-note strong {
          color: #dcebf7;
        }

        @media (max-width: 980px) {
          .demo-grid {
            grid-template-columns: 1fr;
          }

          .grid-layout {
            grid-template-columns: 1fr;
          }

          .status-panel {
            position: static;
          }

          .section-heading,
          .runtime-intro {
            display: block;
          }

          .section-heading p {
            margin-top: 18px;
          }

          .runtime-badge {
            margin-top: 18px;
          }

          .builder-banner {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .topbar {
            margin-bottom: 56px;
          }

          .top-actions {
            display: none;
          }

          .phase-rail {
            grid-template-columns: 1fr 1fr;
          }

          .panel-head {
            display: block;
          }

          .panel-head p {
            margin-top: 14px;
          }
        }

        @media (max-width: 620px) {
          .workspace-shell {
            padding-top: 18px;
          }

          .hero h1 {
            font-size: 3.35rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .phase-rail {
            grid-template-columns: 1fr;
          }

          .demo-card {
            min-height: 0;
            padding: 22px;
          }

          .demo-card-bottom {
            align-items: stretch;
            flex-direction: column;
          }

          .launch-button {
            width: 100%;
          }

          .builder-banner {
            padding: 25px;
          }

          .builder-banner .primary {
            width: 100%;
          }

          .meta-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 7px;
          }

          .meta-row strong {
            text-align: left;
          }
        }
      `}</style>

      <div className="wrap">
        <nav className="topbar" aria-label="Workspace navigation">
          <a className="brand" href="/">
            <span className="brand-mark">14</span>
            <span>TA-14 EXCHANGE</span>
          </a>

          <div className="top-actions">
            <a className="link-button" href="/architecture">
              Architecture
            </a>
            <a className="link-button" href="/verify">
              Verify a record
            </a>
            <a className="link-button" href="/review">
              Request review
            </a>
          </div>
        </nav>

        <section className="hero">
          <div className="eyebrow">
            Governance demonstration library · live execution workspace
          </div>

          <h1>
            <span className="gradient">
              Experience governance before consequence.
            </span>
          </h1>

          <p>
            Launch a prepared route, watch TA-14 stop an inadmissible
            consequence, supply the missing proof, preserve the original
            decision, and generate a reconstructable execution record. Then
            build and test a route using your own information.
          </p>

          <div className="hero-actions">
            <button
              className="primary"
              onClick={() =>
                document
                  .getElementById('demonstration-library')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore demonstrations →
            </button>

            <button className="secondary" onClick={launchCustomBuilder}>
              Build your own route
            </button>
          </div>

          <div className="hero-stat-row">
            <span className="hero-stat">Deterministic route evaluation</span>
            <span className="hero-stat">Immutable correction history</span>
            <span className="hero-stat">Signed AER continuity</span>
            <span className="hero-stat">Public registry reference</span>
          </div>
        </section>

        <section
          className="demo-library"
          id="demonstration-library"
          aria-labelledby="demonstration-library-title"
        >
          <div className="section-heading">
            <div>
              <div className="eyebrow">Prepared governance packages</div>
              <h2 id="demonstration-library-title">
                Choose a consequential route to challenge.
              </h2>
            </div>

            <p>
              Each package loads a complete scenario into the live workspace.
              Run the initial route, inspect the HOLD, correct the missing
              proof, and preserve the resulting record.
            </p>
          </div>

          <div className="demo-grid">
            {demoPackages.map((demo) => (
              <article
                className={`demo-card ${demo.accent} ${
                  workspaceMode === 'package' &&
                  selectedDemoId === demo.id
                    ? 'selected'
                    : ''
                }`}
                key={demo.id}
              >
                <div className="demo-card-top">
                  <span className="demo-number">{demo.number}</span>
                  <span className="demo-icon" aria-hidden="true">
                    {demo.icon}
                  </span>
                </div>

                <div className="demo-category">{demo.category}</div>
                <h3>{demo.title}</h3>
                <p>{demo.description}</p>

                <div className="demo-tags">
                  {demo.tags.map((tag) => (
                    <span className="demo-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="demo-card-bottom">
                  <div className="consequence">
                    Consequence
                    <strong>{demo.consequence}</strong>
                  </div>

                  <button
                    className="launch-button"
                    onClick={() => launchDemo(demo)}
                  >
                    Launch package →
                  </button>
                </div>
              </article>
            ))}
          </div>

          <article className="builder-banner">
            <div className="builder-copy">
              <div className="eyebrow">Builder-controlled route</div>
              <h3>Bring your own organization, system, and consequence.</h3>
              <p>
                Replace the packaged scenario with your own accountable actor,
                supplier or destination, action object, beneficiary, and
                consequence value. The current public release evaluates the
                submission through TA-14&apos;s bounded consequential-payment
                route.
              </p>
            </div>

            <button className="primary" onClick={launchCustomBuilder}>
              Open the Route Builder →
            </button>
          </article>
        </section>

        <section
          className="runtime-section"
          ref={routeWorkspaceRef}
          aria-labelledby="runtime-title"
        >
          <div className="runtime-intro">
            <div>
              <div className="eyebrow">{routeCategory}</div>
              <h2 id="runtime-title">{routeTitle}</h2>
            </div>

            <div className="runtime-badge">
              {workspaceMode === 'custom'
                ? 'Custom builder active'
                : `${selectedDemo.title} loaded`}
            </div>
          </div>

          <div className="phase-rail" aria-label="Route construction phases">
            {phases.map((phase, index) => (
              <div
                className={`phase ${phaseStatus(record, index)}`}
                key={phase}
              >
                <span>0{index + 1}</span>
                {phase}
              </div>
            ))}
          </div>

          {error && (
            <div className="alert" role="alert">
              <strong>Request could not be completed.</strong>
              <br />
              {error}
            </div>
          )}

          <div className="grid-layout">
            <section className="panel">
              <div className="panel-inner">
                <div className="panel-head">
                  <div>
                    <div className="eyebrow">Route definition</div>
                    <h2>{routeTitle}</h2>
                  </div>

                  <p>{routeDescription}</p>
                </div>

                <div className="form-grid">
                  {Object.entries(form).map(([key, value]) => (
                    <label className="field" key={key}>
                      <span>{fieldLabels[key] || key}</span>

                      <input
                        type={key === 'amountUsd' ? 'number' : 'text'}
                        value={value}
                        disabled={Boolean(record)}
                        placeholder={
                          workspaceMode === 'custom'
                            ? `Enter ${(
                                fieldLabels[key] || key
                              ).toLowerCase()}`
                            : undefined
                        }
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            [key]: event.target.value,
                          }))
                        }
                      />
                    </label>
                  ))}
                </div>

                <div className="actions">
                  <button
                    className="primary"
                    disabled={busy || Boolean(record) || !formComplete}
                    onClick={() =>
                      call('/api/routes', {
                        ...form,
                        amountUsd: Number(form.amountUsd),
                      })
                    }
                  >
                    {busy
                      ? 'Running admissibility engine…'
                      : 'Run the initial route →'}
                  </button>

                  {record && (
                    <button
                      className="secondary"
                      disabled={busy}
                      onClick={restartCurrentRoute}
                    >
                      Start a new route
                    </button>
                  )}

                  {workspaceMode === 'custom' && !record && (
                    <button
                      className="secondary"
                      disabled={busy}
                      onClick={() => launchDemo(demoPackages[0])}
                    >
                      Return to prepared package
                    </button>
                  )}
                </div>

                <div className="boundary">
                  <strong>Current public-runtime boundary:</strong> these
                  packages use the deployed consequential-payment engine and
                  policy family. Domain labels provide different operational
                  contexts; they do not falsely represent separate healthcare,
                  infrastructure, environmental, or autonomous-agent policy
                  engines. Additional domain engines can be connected to this
                  library as their route requirements are implemented.
                </div>
              </div>
            </section>

            <aside className="panel status-panel">
              <div className="panel-inner">
                <div className="eyebrow">Runtime state</div>

                <div
                  className={`decision-orb ${
                    record?.decision.toLowerCase() || ''
                  }`}
                >
                  <strong>
                    {busy ? 'TESTING' : record?.decision || 'READY'}
                  </strong>
                </div>

                <p className="status-copy">
                  {!record &&
                    'The route is defined and ready for deterministic evaluation.'}

                  {record?.decision === 'HOLD' &&
                    'The consequence is stopped. Required proof is incomplete but correctable.'}

                  {record?.decision === 'ALLOW' &&
                    'The route satisfies the mandatory requirements within its declared scope.'}

                  {record?.decision === 'DENY' &&
                    'The route is not eligible for correction within the current execution state.'}

                  {record?.decision === 'ESCALATE' &&
                    'The route requires accountable review before execution may proceed.'}
                </p>

                <div className="route-meta">
                  <div className="meta-row">
                    <span>Architecture</span>
                    <strong>TA-14 Admissible Execution</strong>
                  </div>

                  <div className="meta-row">
                    <span>Policy</span>
                    <strong>{policyLabel}</strong>
                  </div>

                  <div className="meta-row">
                    <span>Consequence</span>
                    <strong>{formatCurrency(form.amountUsd)}</strong>
                  </div>

                  <div className="meta-row">
                    <span>Route identity</span>
                    <strong>{record?.rid || 'Pending evaluation'}</strong>
                  </div>

                  <div className="meta-row">
                    <span>Version</span>
                    <strong>{record?.version || 'Not issued'}</strong>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {record && (
            <section className="panel result-panel">
              <div className="panel-inner">
                <div className="result-head">
                  <div>
                    <div className={`pill ${record.decision}`}>
                      {record.decision}
                    </div>

                    <h2>Route {record.rid}</h2>

                    <p className="muted">
                      Immutable version {record.version} · Policy {policyLabel}
                    </p>
                  </div>
                </div>

                <p className="muted">{record.receipt?.nextAction}</p>

                <div className="fingerprint">
                  Decision fingerprint ·{' '}
                  {record.receipt?.decisionFingerprint || 'Not available'}
                </div>

                <div className="requirements">
                  {record.receipt?.results?.map((result) => (
                    <article
                      className="requirement"
                      key={result.requirementId}
                    >
                      <div className="requirement-top">
                        <span className={`pill ${result.result}`}>
                          {result.result}
                        </span>

                        <strong>{result.requirementId}</strong>
                      </div>

                      <p>{result.reason}</p>
                    </article>
                  ))}
                </div>

                {record.decision === 'HOLD' && (
                  <div className="subpanel">
                    <div className="eyebrow">
                      Free correction · history preserved
                    </div>

                    <h2>
                      Supply the missing authority and beneficiary proof.
                    </h2>

                    <p className="muted">
                      The correction creates a new immutable route version. It
                      does not erase, overwrite, or conceal the original HOLD.
                    </p>

                    <div className="form-grid">
                      {Object.entries(correction).map(([key, value]) => (
                        <label className="field" key={key}>
                          <span>{fieldLabels[key] || key}</span>

                          <input
                            value={value}
                            onChange={(event) =>
                              setCorrection((current) => ({
                                ...current,
                                [key]: event.target.value,
                              }))
                            }
                          />
                        </label>
                      ))}
                    </div>

                    <div className="actions">
                      <button
                        className="primary"
                        disabled={busy}
                        onClick={() =>
                          call(
                            `/api/routes/${record.rid}/correct`,
                            correctionBody,
                          )
                        }
                      >
                        {busy
                          ? 'Creating version and rerunning…'
                          : 'Submit correction and rerun →'}
                      </button>
                    </div>
                  </div>
                )}

                {record.decision === 'ALLOW' && !record.registry && (
                  <div className="subpanel">
                    <div className="eyebrow">AER continuity</div>

                    <h2>Generate the signed route record.</h2>

                    <p className="muted">
                      Preserve the demonstration record to generate an
                      Admissible Execution Record, event history, essential
                      manifest, and registry reference.
                    </p>

                    <div className="actions">
                      <button
                        className="primary"
                        disabled={busy}
                        onClick={() =>
                          call(`/api/routes/${record.rid}/preserve`)
                        }
                      >
                        {busy
                          ? 'Generating and signing…'
                          : 'Generate AER and preserve record →'}
                      </button>
                    </div>
                  </div>
                )}

                {Boolean(record.registry) && (
                  <div className="subpanel preserved">
                    <div className="pill ALLOW">
                      SELF-DECLARED RECORD ISSUED
                    </div>

                    <h2>The route is preserved.</h2>

                    <p className="muted">
                      Inspect signatures, event continuity, declared
                      limitations, decision history, and the downloadable
                      verification bundle.
                    </p>

                    <div
                      className="actions"
                      style={{ justifyContent: 'center' }}
                    >
                      <a
                        className="action primary"
                        href={`/registry/${record.rid}`}
                      >
                        Open TA14-RID registry →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </section>

        <div className="scope-note">
          <strong>Demonstration integrity notice:</strong> The TA-14 Exchange
          Platform distinguishes a working route engine from unimplemented
          domain claims. This release provides multiple prepared operating
          contexts and a user-controlled builder on top of the currently
          deployed consequential-payment route. New policy engines can be
          introduced as independent packages without redesigning the workspace
          or erasing the identity and history of existing routes.
        </div>
      </div>
    </main>
  );
}
