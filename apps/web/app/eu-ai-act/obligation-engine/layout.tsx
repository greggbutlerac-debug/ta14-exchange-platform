import { Suspense } from 'react';
import GovernedSystemContextBar from '../components/GovernedSystemContextBar';

function SystemContextFallback(){
  return <div style={{padding:'15px max(24px,4vw)',borderBottom:'1px solid rgba(93,210,241,.28)',background:'linear-gradient(90deg,rgba(3,14,24,.98),rgba(6,27,42,.98),rgba(3,12,21,.98))',color:'#8fb6c8',fontFamily:'Inter,system-ui,sans-serif',fontSize:9}}>Loading governed system context…</div>;
}

export default function ObligationEngineLayout({children}:{children:React.ReactNode}){
  return <><Suspense fallback={<SystemContextFallback/>}><GovernedSystemContextBar/></Suspense>{children}</>;
}
