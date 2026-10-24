'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Curated indoor-air governance teaching rooms. We intentionally do not badge
 * every environmental or country page: ambient-air and municipal monitoring
 * are distinct domains and do not imply institutional GO-IAQG participation.
 */
const indoorAirRooms = [
  "/global-institutional-engagement/colombia",
  "/global-institutional-engagement/ashrae-education-iaq-execution-boundary",
  "/global-institutional-engagement/healthy-indoor-air-consequence-boundary",
  "/global-institutional-engagement/school-iaq-consequence-boundary",
  "/global-institutional-engagement/united-states-epa-indoor-air",
  "/showrooms/air-measurement-governed-evidence",
  "/showrooms/american-lung-association-invisible-risks",
  "/showrooms/arizona-iaq-building-evidence",
  "/showrooms/clean-air-developing-minds",
  "/showrooms/ediaqi-croatia",
  "/showrooms/environmental-atmospheric",
  "/showrooms/evidence-governed-hvac",
  "/showrooms/hotel-canaletto-governed-continuity",
  "/showrooms/india-school-air",
  "/showrooms/intelligent-hvac-evidence-governance",
  "/showrooms/pooja-choradia-pair-eri-clinical",
  "/showrooms/radon-mitigation-evidence-continuity",
  "/showrooms/school-air-quality-governance",
  "/showrooms/school-atmospheric-integrity",
  "/showrooms/thailand-school-air-evidence",
  "/showrooms/the-filter-is-not-the-proof",
  "/showrooms/uk-school-air",
  "/environmental-integrity-governance/building-governed-air",
  "/environmental-integrity-governance/showcase/airthings-space-radon",
  "/environmental-integrity-governance/showcase/safer-air-project"
] as const;
const countryBridge = '/global-institutional-engagement/colombia';

export function GOIAQGShowroomBridge() {
  const pathname = usePathname();
  const isCountryBridge = pathname === countryBridge;
  const eligible = indoorAirRooms.some((route) => pathname === route || (route === '/global-institutional-engagement/united-states-epa-indoor-air' && pathname.startsWith(route + '/')));
  if (!eligible) return null;
  const spanish = isCountryBridge;
  return (
    <aside aria-label="Global Open Indoor Air Quality Governance" style={{background:'#081c27',color:'#ecf7f7',borderBottom:'1px solid #3a7180',padding:'12px clamp(18px,4vw,52px)',fontFamily:'Arial,sans-serif'}}>
      <div style={{maxWidth:1180,margin:'0 auto',display:'flex',gap:16,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
        <div style={{flex:'1 1 280px'}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.12em',color:'#fcd116'}}>{spanish?'INICIATIVA GLOBAL RELACIONADA · TA14':'TA14 · RELATED GLOBAL GOVERNANCE INITIATIVE'}</div>
          <div style={{fontSize:'clamp(15px,2vw,20px)',fontWeight:750,lineHeight:1.3,marginTop:4}}>Global Open Indoor Air Quality Governance <span style={{color:'#fcd116'}}>(GO-IAQG)</span></div>
          <div style={{fontSize:12,lineHeight:1.5,color:'#b8cbd1',marginTop:4}}>{spanish?'Marco de gobernanza de aire interior relacionado con la trazabilidad de evidencia, autoridad y consecuencias. Esta sala examina calidad del aire ambiente y no implica adopción de GO-IAQG por Colombia.':'An open indoor-air governance initiative connecting environmental evidence, applicable authority, bounded decisions and verified outcomes. Educational connection only; no institutional endorsement implied.'}</div>
        </div>
        <Link href="/indoor-air-governance" style={{display:'inline-block',padding:'10px 14px',border:'1px solid #e6c848',borderRadius:8,color:'#ffdf6e',textDecoration:'none',fontSize:12,fontWeight:800,whiteSpace:'normal'}}>{spanish?'CONOCER GO-IAQG →':'EXPLORE GO-IAQG →'}</Link>
      </div>
    </aside>
  );
}
