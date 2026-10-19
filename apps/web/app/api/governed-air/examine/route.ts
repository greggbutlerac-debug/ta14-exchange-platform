import {NextRequest, NextResponse} from 'next/server';
import {examineGovernedAirCase} from '../../../../../governed-air/examination-pipeline.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const noStore={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
export async function POST(request:NextRequest) {
 const length=Number(request.headers.get('content-length')||0);
 if(length>16384) return NextResponse.json({error:'Request too large'},{status:413,headers:noStore});
 let body:unknown;
 try {
  const raw=await request.text();
  if(raw.length>16384) return NextResponse.json({error:'Request too large'},{status:413,headers:noStore});
  body=JSON.parse(raw);
 } catch {return NextResponse.json({error:'Invalid JSON'},{status:400,headers:noStore})}
 if(!body || typeof body!=='object' || Array.isArray(body)) return NextResponse.json({error:'Expected examination object'},{status:400,headers:noStore});
 // Deliberately no client-provided trust keys and no environment key injection.
 // This endpoint is a private-development simulation, NOT an authorization API.
 const result=examineGovernedAirCase(body,{keys:{}});
 return NextResponse.json({schema:'governed-air-examination-v0.1',mode:'DEVELOPMENT_SIMULATION',...result},{status:200,headers:noStore});
}
export async function GET() {
 return NextResponse.json({error:'Use POST with a JSON examination. No execution authority is available.'},{status:405,headers:noStore});
}
