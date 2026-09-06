import {NextRequest,NextResponse} from "next/server";
import {GoogleWebSearchServiceAdapter} from "../../../../lib/asg/search-provider";
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
  const provider=new GoogleWebSearchServiceAdapter();

  try{
    const result=await provider.search(request,10);
    const governed:GovernedCandidate[]=result.candidates.slice(0,10).map((r,index)=>{
      let canonicalHost:string|undefined;
      try{canonicalHost=new URL(r.url).hostname}catch{}
      const mediaType=/youtube\.com|youtu\.be|\bvideo\b/i.test(`${r.url} ${r.title} ${r.snippet}`)?"video":"web";
      const candidate:Candidate={
        id:r.providerResultId||`${recordId}-C${String(index+1).padStart(2,"0")}`,
        providerRank:r.rank,
        title:r.title,
        url:r.url,
        snippet:r.snippet,
        mediaType,
        canonicalHost,
        metadata:{provider:r.provider,displayUrl:r.displayUrl},
      };
      return {...candidate,provider:r.provider,providerResultId:r.providerResultId,determination:evaluateCandidate(request,profile,candidate)};
    });
    const delivered=governed.filter(c=>c.determination.state==="ALLOW").map((c,deliveryIndex)=>({...c,deliveryRank:deliveryIndex+1}));
    return NextResponse.json({
      schema:"ta14.asg.runtime-record.v0.1",
      recordId,
      request,
      profile,
      engineVersion:ASG_ENGINE_VERSION,
      profileVersion:ASG_PROFILE_VERSION,
      provider:result.provider,
      providerLive:result.live,
      providerWindow:{startRank:1,endRank:governed.length,candidateCount:governed.length},
      candidates:governed,
      deliveryCommit:{candidateRanks:delivered.map(c=>c.providerRank),deliveredCount:delivered.length,delivered},
      notice:"Provider candidates are preserved before TA-14 delivery determination. ALLOW establishes bounded delivery standing, not absolute truth.",
    });
  }catch(error:any){
    const code=String(error?.message||"PROVIDER_ERROR");
    const notConfigured=code==="GOOGLE_WEB_SEARCH_PROVIDER_NOT_CONFIGURED";
    return NextResponse.json({
      schema:"ta14.asg.runtime-record.v0.1",recordId,request,profile,
      engineVersion:ASG_ENGINE_VERSION,profileVersion:ASG_PROFILE_VERSION,
      state:"HOLD",reasonCode:notConfigured?"PROVIDER_CANDIDATE_SET_UNAVAILABLE":"PROVIDER_ERROR",
      explanation:notConfigured?"The request is preserved, but legitimate Google Web Search Service credentials are not configured. TA-14 will not manufacture provider candidates.":"The provider did not establish a candidate set. No delivery commit occurred.",
      provider:"GOOGLE_WEB_SEARCH_SERVICE",providerLive:false,candidates:[],deliveryCommit:{candidateRanks:[],deliveredCount:0,delivered:[]}
    },{status:notConfigured?503:502});
  }
}
