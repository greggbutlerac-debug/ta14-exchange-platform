import Link from 'next/link';
import {
  CORPUS_HEALTH_SCORE,
  CORPUS_HEALTH_STATE,
  INTEGRITY_COUNTS,
  INTEGRITY_FINDINGS,
  SOURCE_COVERAGE,
  type IntegritySeverity,
} from '../corpus-integrity';
import { CORPUS_TOTAL } from '../corpus-merged';

const tone: Record<IntegritySeverity, { fg: string; bg: string; border: string }> = {
  PASS: { fg: '#76f4bc', bg: 'rgba(25,112,80,.15)', border: '#277a61' },
  INFO: { fg: '#83ddff', bg: 'rgba(32,103,145,.15)', border: '#2d6684' },
  WARN: { fg: '#ffd27d', bg: 'rgba(139,91,23,.15)', border: '#8c682c' },
  FAIL: { fg: '#ff9696', bg: 'rgba(139,38,38,.15)', border: '#863d47' },
};

export default function CorpusIntegrityPage() {
  const visibleFindings = INTEGRITY_FINDINGS.filter((finding) => finding.severity !== 'PASS');

  return (
    <main style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% -10%,#123651 0,#06111d 38%,#040b13 100%)', color: '#eef5ff', padding: '32px 24px 80px' }}>
      <div style={{ maxWidth: 1380, margin: '0 auto' }}>
        <nav style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 44 }}>
          <Link href="/foundation/public-corpus">← Public Corpus</Link>
          <Link href="/foundation">Foundation</Link>
          <Link href="/registry">Registry</Link>
          <Link href="/workspace">Open Exchange</Link>
        </nav>

        <section style={{ maxWidth: 1040, marginBottom: 38 }}>
          <div style={eyebrow}>TA-14 INSTITUTIONAL SELF-AUDIT • CORPUS INTEGRITY ENGINE</div>
          <h1 style={{ fontSize: 'clamp(46px,7vw,88px)', lineHeight: .98, margin: '18px 0' }}>The institution should be able to prove that it preserved <em>its own record.</em></h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, opacity: .78 }}>This engine evaluates the structured public corpus against known source inventories and record-level integrity rules. It is designed to expose missing source records, duplicate identities, weak provenance fields, and inconsistent publication states before they silently become institutional memory.</p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(260px,1.3fr) repeat(4,minmax(140px,1fr))', gap: 14, marginBottom: 48 }}>
          <div style={{ padding: 26, borderRadius: 22, border: `1px solid ${tone[CORPUS_HEALTH_STATE].border}`, background: tone[CORPUS_HEALTH_STATE].bg }}>
            <div style={eyebrow}>CURRENT CORPUS HEALTH</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: tone[CORPUS_HEALTH_STATE].fg, lineHeight: 1, marginTop: 12 }}>{CORPUS_HEALTH_SCORE}</div>
            <div style={{ opacity: .72, marginTop: 8 }}>{CORPUS_TOTAL} merged public records • {CORPUS_HEALTH_STATE}</div>
          </div>
          <Metric label="Critical failures" value={INTEGRITY_COUNTS.FAIL} severity="FAIL" />
          <Metric label="Warnings" value={INTEGRITY_COUNTS.WARN} severity="WARN" />
          <Metric label="Informational" value={INTEGRITY_COUNTS.INFO} severity="INFO" />
          <Metric label="Source families" value={SOURCE_COVERAGE.length} severity="PASS" />
        </section>

        <section style={{ marginBottom: 54 }}>
          <div style={eyebrow}>SOURCE-TO-LEDGER RECONCILIATION</div>
          <h2 style={sectionTitle}>Known source inventories versus the public corpus.</h2>
          <p style={intro}>A source family passes only when every structured source record in that inventory is represented in the merged institutional ledger.</p>
          <div style={{ display: 'grid', gap: 12 }}>
            {SOURCE_COVERAGE.map((item) => {
              const colors = tone[item.status];
              return <div key={item.source} style={{ display: 'grid', gridTemplateColumns: 'minmax(260px,2fr) repeat(3,minmax(100px,.6fr)) 100px', gap: 12, alignItems: 'center', padding: 18, borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.bg }}>
                <strong>{item.source}</strong><span>{item.expected} expected</span><span>{item.represented} represented</span><span>{item.missing} unresolved</span><strong style={{ color: colors.fg }}>{item.status}</strong>
              </div>;
            })}
          </div>
        </section>

        <section style={{ marginBottom: 54 }}>
          <div style={eyebrow}>INTEGRITY FINDINGS</div>
          <h2 style={sectionTitle}>{visibleFindings.length ? `${visibleFindings.length} conditions require inspection.` : 'No unresolved integrity findings.'}</h2>
          <p style={intro}>These findings are generated from the structured corpus itself. They do not claim that an external URL is reachable in real time; network link verification should be added as a separate scheduled evidence check.</p>
          <div style={{ display: 'grid', gap: 12 }}>
            {visibleFindings.map((finding) => {
              const colors = tone[finding.severity];
              return <article key={finding.id} style={{ padding: 20, borderRadius: 17, border: `1px solid ${colors.border}`, background: colors.bg }}><div style={{ color: colors.fg, fontSize: 11, fontWeight: 900, letterSpacing: 1.7 }}>{finding.severity} • {finding.id}</div><h3 style={{ margin: '8px 0', fontSize: 21 }}>{finding.title}</h3><p style={{ margin: 0, opacity: .76, lineHeight: 1.6 }}>{finding.detail}</p></article>;
            })}
            {!visibleFindings.length && <div style={{ padding: 24, borderRadius: 18, border: `1px solid ${tone.PASS.border}`, background: tone.PASS.bg, color: tone.PASS.fg }}><strong>Structured integrity checks currently pass.</strong></div>}
          </div>
        </section>

        <section style={{ padding: 30, border: '1px solid #28556f', borderRadius: 24, background: 'linear-gradient(145deg,rgba(11,37,55,.96),rgba(5,18,30,.96))' }}>
          <div style={eyebrow}>ENGINE BOUNDARY</div>
          <h2 style={{ fontSize: 34, margin: '10px 0' }}>Integrity is a continuing condition, not a one-time cleanup.</h2>
          <p style={{ lineHeight: 1.7, opacity: .75 }}>This first engine audits structured identity, source coverage, required provenance fields, and state consistency. The next layer should perform scheduled external-link verification, DOI resolution checks, repository reachability, patent-source reconciliation, and historical snapshots so corpus health itself becomes replayable evidence.</p>
          <p style={{ marginBottom: 0, fontWeight: 800 }}>No admissible evidence. No admissible execution.</p>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, severity }: { label: string; value: number; severity: IntegritySeverity }) {
  const colors = tone[severity];
  return <div style={{ padding: 20, borderRadius: 18, border: `1px solid ${colors.border}`, background: colors.bg }}><div style={{ fontSize: 34, fontWeight: 900, color: colors.fg }}>{value}</div><div style={{ opacity: .72 }}>{label}</div></div>;
}

const eyebrow = { letterSpacing: 2, fontSize: 11, fontWeight: 900, color: '#70ddff' } as const;
const sectionTitle = { fontSize: 'clamp(30px,4vw,48px)', margin: '10px 0 12px', lineHeight: 1.08 } as const;
const intro = { fontSize: 17, lineHeight: 1.65, opacity: .72, maxWidth: 900, marginBottom: 24 } as const;
