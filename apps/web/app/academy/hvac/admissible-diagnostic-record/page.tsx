import {CommercialEnginePage} from '@/components/commercial-engine';import {hvacAdmissibleDiagnosticRecord as engine} from '@/lib/commercial-offers';
export const metadata={title:'HVAC Admissible Diagnostic Record | TA-14 Academy',description:'HVAC evidence-before-intervention diagnostic record, baseline performance record, declared determination and post-intervention verification.',alternates:{canonical:'/academy/hvac/admissible-diagnostic-record'}};
export default function Page(){return <CommercialEnginePage engine={engine}/>}
