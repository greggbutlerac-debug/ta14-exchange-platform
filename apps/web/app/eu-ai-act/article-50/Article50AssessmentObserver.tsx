'use client';

import {useEffect} from 'react';
import {publishArticle50Assessment} from '@/lib/eu-ai-act/article-50-session';

function text(el:Element|null){return (el?.textContent??'').replace(/\s+/g,' ').trim()}
function unique<T>(items:T[]){return Array.from(new Set(items))}

function snapshot(){
 const shell=document.querySelector('#assessment-builder');if(!shell)return;
 const role=text(shell.querySelector('.choice-grid.three .choice.selected strong'))||'UNRESOLVED';
 const contentTypes=Array.from(shell.querySelectorAll('.choice-grid.content .choice.selected strong')).map(text).filter(Boolean);
 const selectedObligations=Array.from(shell.querySelectorAll('.obligation.selected'));
 const obligationIds=selectedObligations.map(el=>text(el.querySelector('.obligation-topline small'))).filter(Boolean);
 const required=Array.from(shell.querySelectorAll('.evidence-item strong')).map(text).filter(Boolean);
 const declared=Array.from(shell.querySelectorAll('.evidence-item.confirmed strong')).map(text).filter(Boolean);
 const assessmentState=text(shell.querySelector('.assessment-state'))||'NOT ASSESSED';
 const evidenceRequired=unique(required),evidenceDeclared=unique(declared);
 const evidencePercent=evidenceRequired.length?Math.round(evidenceDeclared.length/evidenceRequired.length*100):0;
 publishArticle50Assessment({actorRole:role,contentTypes:unique(contentTypes),obligationIds:unique(obligationIds),evidenceRequired,evidenceDeclared,assessmentState,evidencePercent,updatedAt:new Date().toISOString()});
}

export default function Article50AssessmentObserver(){
 useEffect(()=>{
  let timer:number|undefined;
  const queue=()=>{window.clearTimeout(timer);timer=window.setTimeout(snapshot,40)};
  const root=document.querySelector('#assessment-builder')??document.body;
  const observer=new MutationObserver(queue);observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class','checked']});
  root.addEventListener('click',queue,true);root.addEventListener('change',queue,true);root.addEventListener('input',queue,true);queue();
  return()=>{observer.disconnect();root.removeEventListener('click',queue,true);root.removeEventListener('change',queue,true);root.removeEventListener('input',queue,true);window.clearTimeout(timer)};
 },[]);
 return null;
}
