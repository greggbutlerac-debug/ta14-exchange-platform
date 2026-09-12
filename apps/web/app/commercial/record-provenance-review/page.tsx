import {CommercialEnginePage} from '@/components/commercial-engine';import {recordProvenanceReview as engine} from '@/lib/commercial-offers';
export const metadata={title:'AI Record Provenance Review | TA-14',description:'Paid review of AI and human record creation, edits, acceptance, signing authority, continuity and attribution.',alternates:{canonical:'/commercial/record-provenance-review'}};
export default function Page(){return <CommercialEnginePage engine={engine}/>}
