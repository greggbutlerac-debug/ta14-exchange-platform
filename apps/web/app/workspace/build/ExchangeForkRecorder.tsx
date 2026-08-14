'use client';

import {useEffect,useRef,useState} from 'react';
import {recordExchangeEvent} from '@/lib/record-exchange-event';

export default function ExchangeForkRecorder(){
  const[receipt,setReceipt]=useState('');
  const source=useRef<string|null>(null);
  const recorded=useRef(false);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const fork=params.get('fork')?.trim()||null;
    source.current=fork;
    if(fork)setReceipt(`Fork staged from ${fork} · save to My Routes to establish the new governed copy`);

    const handler=(event:MouseEvent)=>{
      const button=(event.target as HTMLElement|null)?.closest('button');
      if(!button||!source.current||recorded.current)return;
      const label=(button.textContent??'').replace(/\s+/g,' ').trim().toUpperCase();
      if(label!=='SAVE TO MY ROUTES')return;
      window.setTimeout(async()=>{
        if(recorded.current||!source.current)return;
        const pageText=document.body.innerText;
        if(!pageText.includes('Route saved to My Routes.')){
          setReceipt('Fork remains staged · no Exchange fork event recorded');
          return;
        }
        const routeName=(document.querySelector('input') as HTMLInputElement|null)?.value?.trim()||'Governance route';
        const result=await recordExchangeEvent({
          routeId:`fork:${source.current}:${Date.now()}`,
          sourceRouteId:source.current,
          eventType:'FORKED',
          eventState:'PROVENANCE_PRESERVED',
          summary:`Provenance-preserved fork created from ${source.current}.`,
          visibility:'PUBLIC',
          eventData:{sourceRouteId:source.current,routeName,workspace:'workspace/build'}
        });
        if(result.ok){recorded.current=true;setReceipt('FORKED event recorded · source provenance preserved')}
        else if(result.reason==='AUTH_REQUIRED')setReceipt('Fork saved locally · sign in to record Exchange lineage');
        else setReceipt('Fork saved · Exchange lineage event was not recorded');
      },700);
    };
    document.addEventListener('click',handler,true);
    return()=>document.removeEventListener('click',handler,true);
  },[]);

  if(!receipt)return null;
  return <div style={{position:'fixed',right:18,bottom:18,zIndex:90,maxWidth:390,padding:'12px 14px',border:'1px solid rgba(103,230,247,.28)',borderRadius:14,background:'rgba(4,15,24,.96)',color:'#bdeffc',fontSize:11,fontWeight:800,letterSpacing:'.03em',boxShadow:'0 18px 60px rgba(0,0,0,.35)'}}>{receipt}</div>;
}
