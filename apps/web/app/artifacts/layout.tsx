'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const missingExternalRecords = [
  {
    code: 'FD-2026-0002 · CASE 003',
    governance: 'Harmonic Constitutional Runtime',
    title: 'Frozen Test Did Not Produce the Expected Record',
    status: 'PARTIALLY SUPPORTED',
    version: '2.0',
    registry: 'TA-14-AIGR-000010',
    artifactClass: 'Governed Demonstration Artifact',
    summary: 'The returned evidence supported a later authority-loss classification and execution block, but did not establish the complete frozen initially-admissible-to-revoked transition. The original frozen proposition remains preserved rather than being moved after the result became known.',
    boundary: 'The evidence supports a narrower truth than the expected test result. Case 003 does not establish the complete frozen transition and does not retroactively alter Case 002 or Harmonic Version 2.0 claims.',
    href: '/artifacts/fd-2026-0002-case-003',
    registryHref: '/workspace/ai-governance/registry/records/TA-14-AIGR-000010',
  },
  {
    code: 'FD-2026-0005',
    governance: 'Shango MID',
    title: 'Evidence Can Support a Narrower Truth Than the Claim',
    status: 'PARTIALLY SUPPORTED',
    version: '2.2',
    registry: 'TA-14-AIGR-000011',
    artifactClass: 'Governed Finding Record',
    summary: 'Shango MID moved through evidence integrity, admission, technical review, governed finding, factual correction, Registry-side version verification, and administrative closure without manufacturing a stronger technical finding than the admitted record supported.',
    boundary: 'A factual correction changes the preserved record only where evidence supports the corrected condition. The correction does not silently rewrite the original finding or convert partial support into broader validation.',
    href: '/artifacts/fd-2026-0005',
    registryHref: '/workspace/ai-governance/registry/records/TA-14-AIGR-000011',
  },
  {
    code: 'IE-2026-001',
    governance: 'ANDEKS™',
    title: 'TA-14 / ANDEKS™ Bounded Interoperability Examination',
    status: 'SUPPORTED INTEROPERABILITY · BOUNDED',
    version: '1.0',
    registry: 'TA-14-AIGR-000012',
    artifactClass: 'Interoperability Examination Record',
    summary: 'A frozen documentary governance-interface proposition produced a bounded positive interoperability finding while preserving ANDEKS™ as an independent architecture with its own response, authority, limitations, and architectural sovereignty.',
    boundary: 'The finding is documentary and interface-bounded. It is not a merger, certification, universal compatibility claim, or pilot authorization. Pilot authorization remains reserved.',
    href: '/artifacts/ta14-andeks-ie-2026-001',
    registryHref: '/workspace/ai-governance/registry/records/TA-14-AIGR-000012',
  },
] as const;

export default function ArtifactsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isArtifactLibrary = pathname === '/artifacts';

  return (
    <>
      {children}
      {isArtifactLibrary ? (
        <section className="external-governed-completion" aria-label="Additional external governed artifact records">
          <div className="egc-head">
            <div>
              <small>EXTERNAL GOVERNED RECORD SET · COMPLETION</small>
              <h2>The review lineage continues beyond Harmonic Cases 001 and 002.</h2>
            </div>
            <p>
              These three records complete the currently surfaced external governed set in the Artifact Library. They remain separate from the twelve TA-14 founding execution-proof artifacts and retain their own evidence ceilings, authority boundaries, and institutional classifications.
            </p>
          </div>

          <div className="egc-counts">
            <span><b>05</b> external governed records represented across the library</span>
            <span><b>03</b> Harmonic bounded cases</span>
            <span><b>01</b> Shango governed finding</span>
            <span><b>01</b> ANDEKS™ interoperability examination</span>
          </div>

          <div className="egc-grid">
            {missingExternalRecords.map((record) => (
              <article key={record.code}>
                <div className="egc-id"><span>{record.code}</span><small>{record.artifactClass}</small></div>
                <p className="egc-governance">{record.governance}</p>
                <h3>{record.title}</h3>
                <div className="egc-status"><b>{record.status}</b><span>Version {record.version}</span></div>
                <p className="egc-summary">{record.summary}</p>
                <div className="egc-facts"><span><small>Registry identity</small><b>{record.registry}</b></span><span><small>Publication posture</small><b>Governed public record</b></span></div>
                <div className="egc-boundary"><strong>BOUNDARY</strong><span>{record.boundary}</span></div>
                <div className="egc-actions"><Link href={record.href}>Open governed record →</Link><Link href={record.registryHref}>Open Registry identity</Link></div>
              </article>
            ))}
          </div>

          <div className="egc-rule"><b>Classification rule</b><span>External reviews, demonstrations, findings, and interoperability examinations are preserved in the Artifact Library without being counted as TA-14 founding execution-proof artifacts.</span></div>

          <style jsx>{`
            .external-governed-completion{position:relative;z-index:3;margin:-10px auto 70px;width:min(1480px,calc(100% - 40px));padding:38px clamp(20px,4vw,64px);border-top:1px solid rgba(244,201,93,.18);border-bottom:1px solid rgba(105,216,255,.12);background:radial-gradient(circle at 85% 0,rgba(48,151,211,.09),transparent 34%),linear-gradient(180deg,rgba(5,12,24,.98),rgba(3,8,17,.98));color:#edf4ff;font-family:Inter,ui-sans-serif,system-ui,sans-serif}.egc-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,.85fr);gap:35px;align-items:end}.egc-head small{color:#f4c95d;font-size:10px;font-weight:900;letter-spacing:.17em}.egc-head h2{margin:8px 0 0;font-size:clamp(28px,4vw,48px);line-height:1.02;letter-spacing:-.035em}.egc-head>p{margin:0;color:#96a9bd;line-height:1.75}.egc-counts{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:26px 0}.egc-counts span{padding:13px;border:1px solid rgba(105,216,255,.12);border-radius:11px;color:#8299aa;font-size:10px;background:rgba(6,18,30,.68)}.egc-counts b{display:block;margin-bottom:3px;color:#69d8ff;font-size:18px}.egc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.egc-grid article{padding:25px;border:1px solid rgba(244,201,93,.22);border-radius:19px;background:linear-gradient(145deg,rgba(244,201,93,.055),rgba(7,20,34,.9));box-shadow:0 22px 70px rgba(0,0,0,.18)}.egc-id{display:flex;justify-content:space-between;gap:12px;align-items:center}.egc-id span{color:#f4c95d;font-size:11px;font-weight:900}.egc-id small{color:#70899b;font-size:8px;text-transform:uppercase;letter-spacing:.08em}.egc-governance{margin:22px 0 6px;color:#70dfff;font-size:10px;font-weight:850;text-transform:uppercase;letter-spacing:.1em}.egc-grid h3{margin:0;font-size:22px;line-height:1.1}.egc-status{display:flex;flex-wrap:wrap;gap:7px;margin:17px 0}.egc-status b,.egc-status span{padding:6px 8px;border-radius:999px;font-size:8px;letter-spacing:.07em}.egc-status b{border:1px solid rgba(244,201,93,.28);color:#f4c95d;background:rgba(244,201,93,.07)}.egc-status span{border:1px solid rgba(105,216,255,.16);color:#91a9ba}.egc-summary{min-height:112px;color:#9eb1c1;line-height:1.67;font-size:12px}.egc-facts{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:17px 0}.egc-facts span{padding:10px;border:1px solid rgba(105,216,255,.1);border-radius:9px}.egc-facts small,.egc-facts b{display:block}.egc-facts small{color:#6e8799;font-size:7px;text-transform:uppercase}.egc-facts b{margin-top:4px;font-size:9px}.egc-boundary{padding:12px;border-left:3px solid #f4c95d;background:rgba(244,201,93,.05)}.egc-boundary strong,.egc-boundary span{display:block}.egc-boundary strong{color:#f4c95d;font-size:8px;letter-spacing:.12em}.egc-boundary span{margin-top:5px;color:#95a8b8;font-size:10px;line-height:1.55}.egc-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:17px}.egc-actions :global(a){padding:9px 10px;border:1px solid rgba(105,216,255,.19);border-radius:9px;color:#dce9f2;text-decoration:none;font-size:9px;font-weight:850}.egc-actions :global(a:first-child){color:#f4d779;border-color:rgba(244,201,93,.28)}.egc-rule{display:flex;gap:13px;margin-top:18px;padding:14px;border:1px solid rgba(244,201,93,.2);border-radius:11px;color:#94a9b9;font-size:10px}.egc-rule b{color:#f4c95d;white-space:nowrap}@media(max-width:980px){.egc-grid{grid-template-columns:1fr}.egc-counts{grid-template-columns:1fr 1fr}.egc-summary{min-height:0}}@media(max-width:760px){.egc-head{grid-template-columns:1fr}.egc-counts{grid-template-columns:1fr}.egc-facts{grid-template-columns:1fr}.egc-rule{flex-direction:column}}
          `}</style>
        </section>
      ) : null}
    </>
  );
}
