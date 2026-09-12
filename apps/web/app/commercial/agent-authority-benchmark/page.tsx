import {CommercialEnginePage} from '@/components/commercial-engine';import {agentAuthorityBenchmark as engine} from '@/lib/commercial-offers';
export const metadata={title:'AI Agent Execution Authority Benchmark | TA-14 ACA',description:'Test whether AI agents stop when authority stops across tool use, changed context, revocation and irreversible actions.',alternates:{canonical:'/commercial/agent-authority-benchmark'}};
export default function Page(){return <CommercialEnginePage engine={engine}/>}
