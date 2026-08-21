import RegistryDirectoryClient, { type PublicRegistryRecord } from './RegistryDirectoryClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PublicRegistryRow = {
  id: string;
  registry_identifier: string;
  governance_name: string;
  short_name?: string | null;
  version?: string | null;
  category?: string | null;
  steward?: string | null;
  claimed_establishment_date?: string | null;
  registered_at?: string | null;
  status: string;
  summary?: string | null;
  domains?: string[] | null;
  evidence_count?: number | string | null;
  dispute_count?: number | string | null;
};

function numericCount(value:number|string|null|undefined){
 if(typeof value==='number'&&Number.isFinite(value))return value;
 if(typeof value==='string'){const parsed=Number.parseInt(value,10);if(Number.isFinite(parsed))return parsed;}
 return 0;
}

function normalizeRow(row:PublicRegistryRow):PublicRegistryRecord{
 return {id:row.id,registryIdentifier:row.registry_identifier,governanceName:row.governance_name,shortName:row.short_name??null,version:row.version??null,category:row.category??null,steward:row.steward??null,claimedEstablishmentDate:row.claimed_establishment_date??null,registeredAt:row.registered_at??null,status:row.status,summary:row.summary??null,domains:Array.isArray(row.domains)?row.domains:[],evidenceCount:numericCount(row.evidence_count),disputeCount:numericCount(row.dispute_count)};
}

async function loadPublicRegistry():Promise<{records:PublicRegistryRecord[];error:string}>{
 const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/,'');
 const supabaseAnonKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!supabaseUrl||!supabaseAnonKey)return {records:[],error:'The public Registry is temporarily unavailable.'};
 try{
  const response=await fetch(`${supabaseUrl}/rest/v1/rpc/ta14_registry_public_directory_v1`,{method:'POST',cache:'no-store',headers:{apikey:supabaseAnonKey,Authorization:`Bearer ${supabaseAnonKey}`,Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({})});
  if(!response.ok)return {records:[],error:'The public Registry could not be loaded.'};
  const payload:unknown=await response.json();
  if(!Array.isArray(payload))return {records:[],error:'The public Registry returned an invalid response.'};
  const records=(payload as PublicRegistryRow[]).filter(row=>row&&typeof row.id==='string'&&typeof row.registry_identifier==='string'&&typeof row.governance_name==='string'&&typeof row.status==='string').map(normalizeRow);
  return {records,error:''};
 }catch{return {records:[],error:'The public Registry service is temporarily unavailable.'};}
}

export default async function RegistryDirectoryPage(){
 const {records,error}=await loadPublicRegistry();
 return <RegistryDirectoryClient initialRecords={records} initialError={error}/>;
}
