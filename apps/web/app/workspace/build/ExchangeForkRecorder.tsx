'use client';

import {useEffect,useRef,useState} from 'react';
import {recordExchangeEvent} from '@/lib/record-exchange-event';
import {foundingRouteToDraft,getFoundingExchangeRoute} from '@/lib/exchange-founding-routes';
import {getExchangeNetworkSnapshot} from '@/lib/exchange-network';
import {stageRouteForBuilder} from '@/lib/route-builder-handoff';
import type {TransferRouteDraft} from '@/lib/route-draft-transfer';

export default function ExchangeForkRecorder(){
 const[receipt,setReceipt]=useState('');const source=useRef<string|null>(null);const recorded=useRef(false);
 useEffect(()=>{
  const fork=new URLSearchParams(window.location.search).get('fork')?.trim()||null;source.current=fork;
  if(fork){window.setTimeout(async()=>{try{const founding=getFoundingExchangeRoute(fork);let draft:TransferRouteDraft|undefined;if(founding)draft=foundingRouteToDraft(founding,{fork:true});else{const snapshot=await getExchangeNetworkSnapshot();const persisted=snapshot.routes.find(r=>r.routeId===fork||r.id===fork);if(persisted&&persisted.routeData?.schema==='TA14_ROUTE_DRAFT_V1')draft={...(persisted.routeData as unknown as TransferRouteDraft),routeId:`draft:${fork}-fork`,metadata:{...(persisted.routeData as unknown as TransferRouteDraft).metadata,name:`${persisted.title} — Fork`}}}if(!draft){setReceipt(`Fork source ${fork} could not be loaded`);return}stageRouteForBuilder(draft,{source:'DUPLICATE',libraryRouteId:null});window.dispatchEvent(new Event('ta14:exchange-fork-staged'));setReceipt(`Fork loaded from ${fork} · source provenance will be preserved when saved`)}catch{setReceipt('Exchange fork loading is temporarily unavailable')}},80)}
  const handler=(event:MouseEvent)=>{const button=(event.target as HTMLElement|null)?.closest('button');if(!button||!source.current||recorded.current)return;const label=(button.textContent??'').replace(/\s+/g,' ').trim().toUpperCase();if(label!=='SAVE TO MY ROUTES')return;window.setTimeout(async()=>{if(recorded.current||!source.current)return;const pageText=document.body.innerText;if(!pageText.includes('Route saved to My Routes.')){setReceipt('Fork remains staged · no Exchange fork event recorded');return}const routeName=(document.querySelector('input') as HTMLInputElement|null)?.value?.trim()||'Governance route';const result=await recordExchangeEvent({routeId:`fork:${source.current}:${Date.now()}`,sourceRouteId:source.current,eventType:'FORKED',eventState:'PROVENANCE_PRESERVED',summary:`Provenance-preserved fork created from ${source.current}.`,visibility:'PUBLIC',eventData:{sourceRouteId:source.current,routeName,workspace:'workspace/build',lineage:'SOURCE_PRESERVED'}});if(result.ok){recorded.current=true;setReceipt('FORKED event recorded · source provenance preserved')}else if(result.reason==='AUTH_REQUIRED')setReceipt('Fork saved locally · sign in to record Exchange lineage');else setReceipt('Fork saved · Exchange lineage event was not recorded')},700)};
  document.addEventListener('click',handler,true);return()=>document.removeEventListener('click',handler,true)
 },[]);
 if(!receipt)return null;return <div style={{position:'fixed',right:18,bottom:18,zIndex:90,maxWidth:410,padding:'12px 14px',border:'1px solid rgba(103,230,247,.28)',borderRadius:14,background:'rgba(4,15,24,.96)',color:'#bdeffc',fontSize:11,fontWeight:800,letterSpacing:'.03em',boxShadow:'0 18px 60px rgba(0,0,0,.35)'}}>{receipt}</div>
}
