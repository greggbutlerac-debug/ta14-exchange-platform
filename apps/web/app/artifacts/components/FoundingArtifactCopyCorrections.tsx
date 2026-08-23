'use client';

import { useEffect } from 'react';

const COMMON_REPLACEMENTS: Array<[RegExp,string]> = [
  [/\bA executor\b/g,'An executor'],
];

const SPECIFIC: Record<string, Array<[RegExp,string]>> = {
  'TA14-EA-000004': [
    [/\bL7\b/g,'L6'],
    [/120 institutional review checks/g,'Founding verification floor · bounded artifact checks'],
  ],
  'TA14-EA-000008': [
    [/Water-quality request and operating package/g,'Environmental condition request and operating package'],
    [/TA-14 Reference Water-Control Adapter/g,'TA-14 Reference Building-Control Adapter'],
    [/no live treatment systems were changed/g,'no live building-control systems were changed'],
    [/Route version 2\.0\.0 remained frozen and unchanged throughout evaluation\./g,'Route version 1.0.0 remained frozen and unchanged throughout evaluation.'],
    [/Authority remained valid for 5% delegated adjustment and did not extend to 12%\./g,'Authority was valid for the approved intervention at approval time; present standing still required final environmental revalidation.'],
    [/The governing record fixed five percent as the maximum operator-authorized adjustment\./g,'The governing record fixed the approved intervention and required environmental conditions to remain inside the route boundary through execution.'],
    [/DELEGATED_THRESHOLD_5_PERCENT/g,'APPROVED_INTERVENTION_BOUNDARY'],
  ],
};

export default function FoundingArtifactCopyCorrections({artifactId,sequence}:{artifactId:string;sequence:number}){
  useEffect(()=>{
    const replacements:Array<[RegExp,string]> = [
      [/\b\d{2} of 12\b/g,`${String(sequence).padStart(2,'0')} of 12`],
      ...COMMON_REPLACEMENTS,
      ...(SPECIFIC[artifactId] ?? []),
    ];
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const changed:Array<{node:Text;value:string}>=[];
    let current=walker.nextNode();
    while(current){
      const node=current as Text;
      if(node.nodeValue){
        let next=node.nodeValue;
        for(const [pattern,replacement] of replacements) next=next.replace(pattern,replacement);
        if(next!==node.nodeValue){changed.push({node,value:node.nodeValue});node.nodeValue=next;}
      }
      current=walker.nextNode();
    }
    return()=>changed.forEach(({node,value})=>{node.nodeValue=value});
  },[artifactId,sequence]);
  return null;
}
