'use client';

import {useEffect,useRef,useState} from 'react';
import {recordExchangeEvent} from '@/lib/record-exchange-event';

type RouteLike={routeId?:string;metadata?:Record<string,unknown>;[key:string]:unknown};

function normalize(v:string){return v.replace(/\s+/g,' ').trim()}
function findDecision(text:string){const m=text.match(/\b(ALLOW|HOLD|DENY|ESCALATE)\b/);return m?.[1]??'SCANNED'}

export default function ScannerExchangeRecorder(){
  const[lastKey,setLastKey]=useState('');
  const[receipt,setReceipt]=useState('');
  const busy=useRef(false);

  useEffect(()=>{
    const handler=(event:MouseEvent)=>{
      const target=event.target as HTMLElement|null;
      const button=target?.closest('button');
      if(!button)return;
      const label=normalize(button.textContent??'').toUpperCase();
      if(!label.includes('RUN SCAN'))return;
      if(busy.current)return;
      window.setTimeout(async()=>{
        try{
          const textarea=document.querySelector('textarea') as HTMLTextAreaElement|null;
          if(!textarea?.value)return;
          const route=JSON.parse(textarea.value) as RouteLike;
          const routeId=String(route.routeId??'UNKNOWN').trim();
          if(!routeId||routeId==='UNKNOWN')return;
          const pageText=normalize(document.body.innerText);
          const decision=findDecision(pageText);
          const key=`${routeId}:${decision}:${textarea.value.length}`;
          if(key===lastKey)return;
          busy.current=true;
          const name=String(route.metadata?.name??routeId);
          const result=await recordExchangeEvent({
            routeId,
            eventType:'TESTED',
            eventState:decision,
            summary:`Route scanner completed for ${name}.`,
            visibility:'PUBLIC',
            eventData:{decision,scanner:'TA14_ROUTE_SCANNER',source:'workspace/scanner'}
          });
          if(result.ok){setLastKey(key);setReceipt(`TESTED event recorded · ${decision}`)}
          else if(result.reason==='AUTH_REQUIRED')setReceipt('Scan completed locally · sign in to record it in Exchange history');
          else setReceipt('Scan completed locally · Exchange history was not updated');
        }catch{setReceipt('Scan completed locally · route identity could not be recorded')}
        finally{busy.current=false}
      },350);
    };
    document.addEventListener('click',handler,true);
    return()=>document.removeEventListener('click',handler,true);
  },[lastKey]);

  if(!receipt)return null;
  return <div style={{position:'fixed',right:18,bottom:18,zIndex:80,maxWidth:360,padding:'12px 14px',border:'1px solid rgba(103,230,247,.28)',borderRadius:14,background:'rgba(4,15,24,.96)',color:'#bdeffc',fontSize:11,fontWeight:800,letterSpacing:'.04em',boxShadow:'0 18px 60px rgba(0,0,0,.35)'}}>{receipt}</div>;
}
