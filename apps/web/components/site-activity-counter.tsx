"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from './site-activity-counter.module.css';

type SiteActivityResponse = { counted:boolean; newVisitor?:boolean; visitors?:number; pageViews?:number; updatedAt?:string };
type SiteActivityState = { visitors:number|null; pageViews:number|null; status:"loading"|"ready"|"unavailable" };

function formatCount(value:number|null){ return value===null ? "—" : new Intl.NumberFormat("en-US").format(value); }
function displayCount(value:number|null,status:SiteActivityState["status"]){ return status==="loading" ? "···" : formatCount(value); }

export function SiteActivityCounter(){
  const pathname=usePathname();
  const lastCountedPathRef=useRef<string|null>(null);
  const [activity,setActivity]=useState<SiteActivityState>({visitors:null,pageViews:null,status:"loading"});

  useEffect(()=>{
    if(!pathname||lastCountedPathRef.current===pathname)return;
    lastCountedPathRef.current=pathname;
    const controller=new AbortController();
    async function recordActivity(){
      try{
        const response=await fetch("/api/site-activity",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:pathname}),cache:"no-store",signal:controller.signal});
        if(!response.ok)throw new Error(`Site activity request failed: ${response.status}`);
        const payload=(await response.json()) as SiteActivityResponse;
        if(!payload.counted||typeof payload.visitors!=="number"||typeof payload.pageViews!=="number"){setActivity(c=>({...c,status:"unavailable"}));return;}
        setActivity({visitors:payload.visitors,pageViews:payload.pageViews,status:"ready"});
      }catch(error){if((error as Error).name==="AbortError")return;console.error("Unable to load TA-14 site activity:",error);setActivity(c=>({...c,status:"unavailable"}));}
    }
    void recordActivity();return()=>controller.abort();
  },[pathname]);

  const metrics=[
    {icon:'◎',label:'Visitors',value:displayCount(activity.visitors,activity.status),note:'Recorded public visitors'},
    {icon:'◉',label:'Page Views',value:displayCount(activity.pageViews,activity.status),note:'Recorded Exchange views'},
  ];

  return <section aria-label="TA-14 Exchange public activity" className={`${styles.dashboard} ${activity.status==="loading"?styles.loading:""}`}>
    <div className={styles.inner}>
      <div className={styles.header}>
        <div><div className={styles.eyebrow}>TA-14 Exchange Activity</div><h2 className={styles.title}>Public network activity</h2><p className={styles.subtitle}>Live cumulative activity recorded across the public Exchange surface.</p></div>
        <div className={styles.status}><span className={`${styles.statusDot} ${activity.status==="ready"?"":styles.off}`} />{activity.status==="ready"?'Live':activity.status==="loading"?'Refreshing':'Unavailable'}</div>
      </div>
      <div className={styles.metrics}>{metrics.map(metric=><div className={styles.metric} key={metric.label}><span className={styles.metricIcon}>{metric.icon}</span><span className={styles.value}>{metric.value}</span><span className={styles.label}>{metric.label}</span><span className={styles.note}>{metric.note}</span></div>)}</div>
      <div className={styles.network}><div className={styles.networkGlyph}>◇</div><div><span className={styles.networkLabel}>Network state</span><span className={styles.networkState}>FOUNDING</span><div className={styles.networkCopy}>Governance in execution · public Exchange surface online and recording cumulative activity.</div></div></div>
    </div>
  </section>;
}
