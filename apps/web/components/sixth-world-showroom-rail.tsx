import Link from 'next/link';

type Props = { current: 'thailand' | 'uae' | 'guatemala' | 'kazakhstan' | 'singapore' };

const showrooms = [
  { key: 'uae', href: '/environmental-integrity-governance/uae', label: 'UAE Showroom' },
  { key: 'thailand', href: '/global-institutional-engagement/thailand', label: 'Thailand Showroom' },
  { key: 'guatemala', href: '/global-institutional-engagement/guatemala', label: 'Guatemala Showroom' },
  { key: 'kazakhstan', href: '/global-institutional-engagement/kazakhstan', label: 'Kazakhstan Showroom' },
  { key: 'singapore', href: '/global-institutional-engagement/singapore', label: 'Singapore Showroom' },
] as const;

export function SixthWorldShowroomRail({ current }: Props) {
  return <aside className="swRail" aria-label="TA-14 architecture and institutional showroom navigation">
    <style>{`.swRail{position:relative;z-index:4;width:min(1180px,calc(100% - 40px));margin:26px auto 34px;padding:14px;border:1px solid rgba(231,194,107,.22);border-radius:16px;background:rgba(3,12,18,.86);backdrop-filter:blur(14px);display:flex;gap:9px;flex-wrap:wrap;align-items:center}.swRail>a{display:inline-flex;align-items:center;min-height:38px;padding:0 13px;border:1px solid rgba(255,255,255,.12);border-radius:9px;color:#dce8ed;text-decoration:none;font:800 10px/1.2 Arial,sans-serif;letter-spacing:.06em}.swRail>a:hover{border-color:rgba(231,194,107,.55);background:rgba(231,194,107,.08)}.swRail>a:first-of-type{background:#e7c26b;color:#071015;border-color:#e7c26b}.swRail>a[aria-current='page']{border-color:rgba(140,200,239,.65);background:rgba(140,200,239,.1);color:#dff3ff}.swRailLabel{margin-right:4px;color:#8197a3;font:900 8px/1 Arial,sans-serif;letter-spacing:.16em}@media(max-width:680px){.swRail{width:min(100% - 24px,1180px)}.swRail>a{flex:1 1 calc(50% - 9px);justify-content:center;text-align:center}}`}</style>
    <span className="swRailLabel">EXPLORE</span>
    <Link href="/environmental-integrity-governance">EIG Architecture</Link>
    <Link href="/environmental-integrity-governance">Atmospheric Integrity Records</Link>
    <Link href="/registry/ta-14-admissible-execution-architecture">AEA Architecture</Link>
    <Link href="/global-institutional-engagement">All Institutional Showrooms</Link>
    {showrooms.map((showroom)=><Link key={showroom.key} href={showroom.href} aria-current={current===showroom.key?'page':undefined}>{showroom.label}</Link>)}
    <a href="mailto:ta14admissibleexecution@gmail.com">Request Technical Examination</a>
  </aside>;
}
