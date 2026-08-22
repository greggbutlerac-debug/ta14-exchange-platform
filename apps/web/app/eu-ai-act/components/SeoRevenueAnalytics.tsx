'use client';

import {useEffect} from 'react';

declare global {interface Window {gtag?: (...args: unknown[])=>void}}

function send(name:string,params:Record<string,string|number|boolean>={}){
  if(typeof window==='undefined'||typeof window.gtag!=='function')return;
  window.gtag('event',name,{event_category:'eu_ai_act_seo_revenue',...params});
}

function planFromHref(href:string){
  try{return new URL(href,window.location.origin).searchParams.get('plan')||'unknown'}catch{return 'unknown'}
}

export default function SeoRevenueAnalytics(){
  useEffect(()=>{
    const landing=window.location.pathname;
    const query=new URLSearchParams(window.location.search);
    const source=query.get('utm_source')||document.referrer||'direct';
    const medium=query.get('utm_medium')||'organic_or_direct';
    const campaign=query.get('utm_campaign')||'none';
    send('eu_seo_revenue_page_view',{landing_path:landing,traffic_source:source.slice(0,120),traffic_medium:medium.slice(0,80),campaign:campaign.slice(0,120)});
    const onClick=(event:MouseEvent)=>{
      const target=event.target as HTMLElement|null;
      const link=target?.closest('a') as HTMLAnchorElement|null;
      if(!link)return;
      const href=link.getAttribute('href')||'';
      const label=(link.textContent||'').trim().replace(/\s+/g,' ').slice(0,120);
      const common={landing_path:landing,destination:href.slice(0,180),label};
      if(href.includes('/eu-ai-act/join?plan='))send('eu_paid_plan_click',{...common,plan:planFromHref(href)});
      else if(href.includes('/eu-ai-act/classifier'))send('eu_classifier_click',common);
      else if(href.includes('/eu-ai-act/readiness-review'))send('eu_readiness_review_click',{...common,value:750,currency:'USD'});
      else if(href.includes('/eu-ai-act/commercial'))send('eu_pricing_click',common);
    };
    document.addEventListener('click',onClick,true);
    return()=>document.removeEventListener('click',onClick,true);
  },[]);
  return null;
}
