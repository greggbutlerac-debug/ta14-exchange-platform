import {NextRequest,NextResponse} from "next/server";
import {SerperGoogleSearchAdapter} from "../../../../lib/asg/search-provider";
import {ASG_ENGINE_VERSION,ASG_PROFILE_VERSION,Candidate,classifyProfile,evaluateCandidate} from "../../../../lib/asg/governance";

export const dynamic="force-dynamic";
type GovernedCandidate=Candidate&{provider:string;providerResultId?:string;determination:ReturnType<typeof evaluateCandidate>};

export async function POST(req:NextRequest){
  let body:any;
  try{body=await req.json()}catch{return NextResponse.json({error:"INVALID_JSON"},{status:400})}
  const request=String(body?.query||"").trim();
  if(!request)return NextResponse.json({error:"QUERY_REQUIRED"},{status:400});

  const recordId=`ASG-${Date.now().toString(36).toUpperCase()}`;
  const profile=classifyProfile(request);
  const provider=new SerperGoogleSearchAdapter();

  try{
    const result=await provider.search(request,{limit:10});
    const frozenProviderCandidates=result.candidates.slice(0,10).map((r,index)=>({providerRank:r.rank||index+1,title:r.title,url:r.url,snippet:r.snippet,displayUrl:r.displayUrl,provider:r.provider,providerResultId:r.providerResultId}));
    const governed:GovernedCandidate[]=frozenProviderCandidates.map((r,index)=>{
      let canonicalHost:string|undefined;try{canonicalHost=new URL(r.url).hostname}catch{}
      const mediaType=/youtube\.com|youtu\.be|\bvideo\b/i.test(`${r.url} ${r.title} ${r.snippet}`)?"video":"web";
      const candidate:Candidate={id:r.providerResultId||`${recordId}-C${String(index+1).padStart(2,"0")}`,providerRank:r.providerRank,title:r.title,url:r.url,snippet:r.snippet,mediaType,canonicalHost,metadata:{provider:r.provider,displayUrl:r.displayUrl}};
      return {...candidate,provider:r.provider,providerResultId:r.providerResultId,determination:evaluateCandidate(request,profile,candidate)};
    });
    const admitted=governed.filter(c=>c.determination.state==="ALLOW").map((c,deliveryIndex)=>({...c,deliveryRank:deliveryIndex+1}));
    const nonAdmitted=governed.filter(c=>c.determination.state!=="ALLOW");
    const admittedRecord={schema:"ta14.asg.admitted-record.v0.1",parentRecordId:recordId,request,provider:result.provider,providerLive:result.live,engineVersion:ASG_ENGINE_VERSION,profileVersion:ASG_PROFILE_VERSION,profile,admittedCount:admitted.length,admitted:admitted.map(c=>({originalProviderRank:c.providerRank,deliveredRank:c.deliveryRank,title:c.title,url:c.url,snippet:c.snippet,canonicalHost:c.canonicalHost,determination:c.determination.state,reasonCode:c.determination.reasonCode,reason:c.determination.explanation,evaluationTier:c.determination.evaluationTier})),rule:"Each item crossed the delivery boundary because it acquired ALLOW standing under the active bounded request and profile. ALLOW is not a certificate of absolute truth."};
    const nonAdmittedRecord={schema:"ta14.asg.non-admitted-record.v0.1",parentRecordId:recordId,request,provider:result.provider,providerLive:result.live,engineVersion:ASG_ENGINE_VERSION,profileVersion:ASG_PROFILE_VERSION,profile,nonAdmittedCount:nonAdmitted.length,nonAdmitted:nonAdmitted.map(c=>({originalProviderRank:c.providerRank,title:c.title,url:c.url,snippet:c.snippet,canonicalHost:c.canonicalHost,determination:c.determination.state,reasonCode:c.determination.reasonCode,reason:c.determination.explanation,evaluationTier:c.determination.evaluationTier})),rule:"Every HOLD, DENY, or ESCALATE candidate remains preserved with its original provider rank and reason for not crossing the delivery boundary."};
    return NextResponse.json({schema:"ta14.asg.runtime-record.v0.2",recordId,request,profile,engineVersion:ASG_ENGINE_VERSION,profileVersion:ASG_PROFILE_VERSION,provider:result.provider,providerLive:result.live,providerWindow:{startRank:1,endRank:frozenProviderCandidates.length,candidateCount:frozenProviderCandidates.length},frozenProviderCandidates,candidates:governed,deliveryCommit:{candidateRanks:admitted.map(c=>c.providerRank),deliveredCount:admitted.length,delivered:admitted},admittedRecord,nonAdmittedRecord,notice:"Live Google search results are retrieved through the configured provider adapter and frozen before TA-14 evaluation. Original provider rank is preserved. Admitted and non-admitted outcomes remain separate evidence records."});
  }catch(error:any){
    const code=String(error?.code||error?.message||"PROVIDER_ERROR");
    const providerStatus=typeof error?.status==="number"?error.status:undefined;
    const providerDetail=typeof error?.detail==="string"?error.detail:undefined;
    const notConfigured=code==="SEARCH_PROVIDER_NOT_CONFIGURED";
    console.error("ASG_PROVIDER_FAILURE",{recordId,provider:"GOOGLE_VIA_SERPER",code,providerStatus,providerDetail});
    return NextResponse.json({schema:"ta14.asg.runtime-record.v0.2",recordId,request,profile,engineVersion:ASG_ENGINE_VERSION,profileVersion:ASG_PROFILE_VERSION,state:"HOLD",reasonCode:notConfigured?"PROVIDER_CANDIDATE_SET_UNAVAILABLE":code,providerErrorCode:code,providerStatus,providerDetail,explanation:notConfigured?"The request is preserved, but the live Google-results provider API key is not configured. TA-14 will not manufacture provider candidates.":`The provider did not establish a candidate set (${code}). No delivery commit occurred.${providerDetail?` Provider detail: ${providerDetail}`:""}`,provider:"GOOGLE_VIA_SERPER",providerLive:false,frozenProviderCandidates:[],candidates:[],deliveryCommit:{candidateRanks:[],deliveredCount:0,delivered:[]},admittedRecord:null,nonAdmittedRecord:null},{status:notConfigured?503:502});
  }
}
