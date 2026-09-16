import Link from 'next/link';

type Props = { current: 'thailand' | 'uae' };

export function SixthWorldShowroomRail({ current }: Props) {
  const other = current === 'thailand'
    ? { href: '/environmental-integrity-governance/uae', label: 'UAE Showroom' }
    : { href: '/global-institutional-engagement/thailand', label: 'Thailand Showroom' };
  return <aside className="swRail" aria-label="TA-14 architecture and institutional showroom navigation">
    <style>{`.swRail{position:relative;z-index:4;width:min(1180px,calc(100% - 40px));margin:26px auto 34px;padding:14px;border:1px solid rgba(231,194,107,.22);border-radius:16px;background:rgba(3,12,18,.86);backdrop-filter:blur(14px);display:flex;gap:9px;flex-wrap:wrap;align-items:center}.swRail>a{display:inline-flex;align-items:center;min-height:38px;padding:0 13px;border:1px solid rgba(255,255,255,.12);border-radius:9px;color:#dce8ed;text-decoration:none;font:800 10px/1.2 Arial,sans-serif;letter-spacing:.06em}.swRail>a:hover{border-color:rgba(231,194,107,.55);background:rgba(231,194,107,.08)}.swRail>a:first-of-type{background:#e7c26b;color:#071015;border-color:#e7c26b}.swRailLabel{margin-right:4px;color:#8197a3;font:900 8px/1 Arial,sans-serif;letter-spacing:.16em}@media(max-width:680px){.swRail{width:min(100% - 24px,1180px)}.swRail>a{flex:1 1 calc(50% - 9px);justify-content:center;text-align:center}}`}</style>
    <span className="swRailLabel">EXPLORE</span>
    <Link href="/environmental-integrity-governance">EIG Architecture</Link>
    <Link href="/environmental-integrity-governance">Atmospheric Integrity Records</Link>
    <Link href="/registry/ta-14-admissible-execution-architecture">AEA Architecture</Link>
    <Link href="/global-institutional-engagement">All Institutional Showrooms</Link>
    <Link href={other.href}>{other.label}</Link>
    <a href="mailto:ta14admissibleexecution@gmail.com">Request Technical Examination</a>
  </aside>;
}
