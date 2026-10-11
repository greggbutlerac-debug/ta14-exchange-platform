'use client';
import {useState} from 'react';
import TeachingDiagram from './TeachingDiagram';
export default function MalawiVisual({number,title,copy,hero=false}:{number:string;title:string;copy:string;hero?:boolean}){
 const [failed,setFailed]=useState(false);
 const index=hero?1:Number(number)+1;
 const filename='/TA14_Malawi_'+String(index).padStart(2,'0')+'.webp';
 return <div>{!failed?<img src={filename} alt={hero?'Malawi clean-air evidence and authority overview':title+' — illustrative TA14 Malawi governance teaching image'} onError={()=>setFailed(true)} style={{width:'100%',height:'auto',display:'block',borderRadius:12}}/>:hero?<p style={{color:'#a6c8d7'}}>Malawi Clean Air Governance: observation → evidence → local authority → bounded action → verified outcome.</p>:<TeachingDiagram number={number} title={title} copy={copy}/>}</div>;
}
