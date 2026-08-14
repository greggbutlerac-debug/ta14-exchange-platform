'use client';

import Link from 'next/link';
import {usePathname,useRouter,useSearchParams} from 'next/navigation';
import {useEffect,useMemo,useState} from 'react';
import {listSystemPassports,type SystemPassport} from '@/lib/eu-ai-act/system-passports';

export default function GovernedSystemContextBar(){
  const pathname=usePathname();
  const router=useRouter();
  const search=useSearchParams();
  const requested=search.get('system');
  const [items,setItems]=useState<SystemPassport[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(()=>{let live=true;(async()=>{try{const rows=await listSystemPassports();if(live)setItems(rows)}catch(e){if(live)setError(e instanceof Error?e.message:'Unable to load governed system context.')}finally{if(live)setLoading(false)}})();return()=>{live=false}},[]);

  const active=useMemo(()=>items.find(x=>x.id===requested)||items[0]||null,[items,requested]);

  useEffect(()=>{
    if(!loading&&active&&!requested){
      const params=new URLSearchParams(search.toString());
      params.set('system',active.id);
      router.replace(`${pathname}?${params.toString()}`,{scroll:false});
    }
  },[loading,active,requested,pathname,router,search]);

  function choose(id:string){
    const params=new URLSearchParams(search.toString());
    params.set('system',id);
    router.replace(`${pathname}?${params.toString()}`,{scroll:false});
  }

  if(loading)return <div className="bar loading">Loading governed system context…<style jsx>{styles}</style></div>;
  if(error)return <div className="bar error">System context unavailable: {error}<style jsx>{styles}</style></div>;
  if(!active)return <div className="bar empty"><div><b>NO GOVERNED SYSTEM SELECTED</b><span>Create a System Passport before binding this workspace to an institutional AI-system identity.</span></div><Link href="/eu-ai-act/system-passport">CREATE SYSTEM PASSPORT →</Link><style jsx>{styles}</style></div>;

  return <div className="bar">
    <div className="identity"><span>ACTIVE GOVERNED SYSTEM</span><strong>{active.name}</strong><small>{active.systemKey} · VERSION {active.version} · {active.role}</small></div>
    <div className="facts"><div><span>INTENDED PURPOSE</span><b>{active.purpose||'NOT ESTABLISHED'}</b></div><div><span>RISK STATE</span><b>{active.risk}</b></div><div><span>EVIDENCE STATE</span><b>{active.evidenceState}</b></div></div>
    <div className="controls"><label><span>SWITCH SYSTEM</span><select value={active.id} onChange={e=>choose(e.target.value)}>{items.map(x=><option value={x.id} key={x.id}>{x.systemKey} · {x.name}</option>)}</select></label><Link href={`/eu-ai-act/system-passport?system=${active.id}`}>OPEN PASSPORT →</Link></div>
    <div className="boundary">This workspace is now operating in the context of the selected institutional System Passport. Tool outputs remain bounded to their own evidence and determination rules; system identity alone does not establish applicability or compliance.</div>
    <style jsx>{styles}</style>
  </div>;
}

const styles=`
.bar{position:relative;z-index:50;display:grid;grid-template-columns:minmax(240px,1.1fr) minmax(330px,1.4fr) minmax(230px,.8fr);gap:18px;align-items:center;padding:15px max(24px,4vw);border-bottom:1px solid rgba(93,210,241,.28);border-top:1px solid rgba(93,210,241,.18);background:linear-gradient(90deg,rgba(3,14,24,.98),rgba(6,27,42,.98),rgba(3,12,21,.98));color:#eaf8ff;font-family:Inter,system-ui,sans-serif;box-shadow:0 12px 38px rgba(0,0,0,.2)}
.identity,.facts div,.controls label{display:grid;gap:4px}.identity span,.facts span,.controls span{font-size:7px;font-weight:900;letter-spacing:.14em;color:#68dafa}.identity strong{font:20px Georgia,serif}.identity small{font-size:8px;color:#7d9bad}.facts{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:9px}.facts div{padding:9px 11px;border:1px solid rgba(99,198,225,.15);background:rgba(7,24,36,.72)}.facts b{font-size:9px;color:#bdd8e5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.controls{display:flex;gap:10px;align-items:end;justify-content:flex-end}.controls label{flex:1}.controls select{max-width:260px;padding:8px;border:1px solid #28526b;background:#06131e;color:#eaf8ff;font-size:9px}.controls :global(a){padding:9px 11px;border:1px solid #3c708c;color:#9be8ff;text-decoration:none;font-size:8px;font-weight:900;white-space:nowrap}.boundary{grid-column:1/-1;padding-top:9px;border-top:1px solid rgba(91,198,226,.12);color:#6f8fa3;font-size:8px;line-height:1.55}.loading,.error{grid-template-columns:1fr;font-size:9px;color:#8fb6c8}.error{color:#ffb1b1}.empty{grid-template-columns:1fr auto}.empty>div{display:grid;gap:4px}.empty b{font-size:9px;color:#ffd777}.empty span{font-size:9px;color:#8ca5b5}.empty :global(a){color:#9feaff;text-decoration:none;font-size:8px;font-weight:900}@media(max-width:980px){.bar{grid-template-columns:1fr}.facts{grid-template-columns:repeat(3,1fr)}.controls{justify-content:flex-start}.boundary{grid-column:1}}@media(max-width:620px){.facts{grid-template-columns:1fr}.controls{align-items:stretch;flex-direction:column}.controls select{max-width:none;width:100%}}
`;
