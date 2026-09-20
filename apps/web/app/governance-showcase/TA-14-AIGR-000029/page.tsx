import type {Metadata} from 'next';
import VelosShowcase from './VelosShowcase';

export const metadata:Metadata={
 title:'Velos Systems v1.0.0 | TA-14 Governance Showcase',
 description:'Interactive TA-14 governance showcase for Velos Systems v1.0.0, TA-14-AIGR-000029, preserving separate prior and successor R1 examination chains.'
};

export default function Page(){return <VelosShowcase/>;}
