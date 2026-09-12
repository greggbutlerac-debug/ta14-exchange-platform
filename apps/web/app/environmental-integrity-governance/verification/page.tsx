import {CommercialEnginePage} from '@/components/commercial-engine';import {environmentalVerification as engine} from '@/lib/commercial-offers';
export const metadata={title:'Environmental Integrity Verification | TA-14',description:'Paid environmental baseline, exposure-pathway, intervention and post-intervention verification records bounded to what evidence can establish.',alternates:{canonical:'/environmental-integrity-governance/verification'}};
export default function Page(){return <CommercialEnginePage engine={engine}/>}
