import type { Metadata } from 'next';
import ExaminationWorkspace from './workspace';
export const metadata: Metadata = {title:'Governed Air | Examination Workspace (Private Simulation)',robots:{index:false,follow:false},description:'Private simulation-only structured TA14 governance examination workspace.'};
export default function Page(){return <ExaminationWorkspace/>}
