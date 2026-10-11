'use client';
import {useState} from 'react';
import TeachingDiagram from './TeachingDiagram';
const illustrations=[
'TA14 Governed Environmental Evidence.png',
'TA14 Governed Environmental Evidence.png',
'TA14 Governed Environmental Evidence.png',
'From Sensor Reading to Governed Outcome.png',
'Pyramid of Value_ Sensor to Impact.png',
'The Sensor’s Highest Purpose.png',
'From Sensor to Real-World Impact.png',
'The Journey to the Pinnacle of Sensor Impact.png',
'The Verified Outcome Infographic.png'
];
export default function MalawiVisual({number,title,copy,hero=false}:{number:string;title:string;copy:string;hero?:boolean}){
 const [failed,setFailed]=useState(false);
 const index=hero?0:Number(number);
 const filename=illustrations[index];
 const src='/'+encodeURIComponent(filename);
 return <div>{!failed?<figure style={{margin:0}}><img src={src} alt={hero?'Illustrative TA14 environmental evidence overview':title+' — illustrative governance visual, not Malawi field documentation'} onError={()=>setFailed(true)} style={{width:'100%',height:'auto',display:'block',borderRadius:12}} loading={hero?'eager':'lazy'}/><figcaption style={{fontSize:12,color:'#a7c4d4',marginTop:8}}>Illustrative TA14 governance visual · Not a photograph or verified record of a Malawi intervention.</figcaption></figure>:hero?<p style={{color:'#a6c8d7'}}>Malawi Clean Air Governance: observation → evidence → local authority → bounded action → verified outcome.</p>:<TeachingDiagram number={number} title={title} copy={copy}/>}</div>;
}
