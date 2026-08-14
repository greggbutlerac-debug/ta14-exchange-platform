'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

const routes:Record<string,string>={
  'OPEN CHANGE IMPACT →':'/eu-ai-act/revalidation-engine',
  'OPEN EVIDENCE ROUTE →':'/eu-ai-act/article-50',
  'OPEN CLASSIFICATION →':'/eu-ai-act/classifier',
  'OPEN OVERSIGHT →':'/eu-ai-act/obligation-engine?focus=A14-002',
  'OPEN SOURCE IMPACT →':'/eu-ai-act/revalidation-engine?change=source-delta',
  'OPEN IMPACT GRAPH →':'/eu-ai-act/revalidation-engine',
  'EXAMINER ROOMS · NEXT RELEASE':'/eu-ai-act/institution',
  'ASK ATLAS →':'/eu-ai-act/pro',
};

function normalize(value:string){return value.replace(/\s+/g,' ').trim()}

export default function CommandCenterActionRouter(){
  const router=useRouter();
  useEffect(()=>{
    const handler=(event:MouseEvent)=>{
      const target=event.target as HTMLElement|null;
      const button=target?.closest('button');
      if(!button)return;
      const href=routes[normalize(button.textContent??'')];
      if(!href)return;
      event.preventDefault();
      event.stopPropagation();
      router.push(href);
    };
    document.addEventListener('click',handler,true);
    return()=>document.removeEventListener('click',handler,true);
  },[router]);
  return null;
}
