import TeachingDiagram from './TeachingDiagram';
export default function MalawiVisual({number,title,copy,hero=false}:{number:string;title:string;copy:string;hero?:boolean}){
 return <TeachingDiagram number={hero?'00':number} title={title} copy={copy}/>;
}
