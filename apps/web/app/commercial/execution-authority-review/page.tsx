import {CommercialEnginePage} from '@/components/commercial-engine';import {executionAuthorityReview as engine} from '@/lib/commercial-offers';
export const metadata={title:'AI Execution Authority Review | TA-14',description:'Paid evidence-bound review of whether an AI or consequential workflow was authorized to execute under current evidence and authority.',alternates:{canonical:'/commercial/execution-authority-review'}};
export default function Page(){return <CommercialEnginePage engine={engine}/>}
