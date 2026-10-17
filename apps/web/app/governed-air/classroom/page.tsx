import type { Metadata } from 'next';
import ClassroomExam from './classroom-exam';
export const metadata: Metadata = {title:'Governed Air — Private Classroom Prototype',robots:{index:false,follow:false},description:'Simulation-only TA14 governed air classroom examination prototype.'};
export default function Page(){return <ClassroomExam/>}
