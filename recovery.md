import {NextResponse} from "next/server";
import {getPublicVerificationBundle} from "../../../../../../../packages/storage/local-store";
export async function GET(_:Request,{params}:{params:Promise<{rid:string}>}){const{rid}=await params;const bundle=await getPublicVerificationBundle(rid);if(!bundle)return NextResponse.json({error:"Registry record not found"},{status:404});return new NextResponse(JSON.stringify(bundle,null,2),{headers:{"content-type":"application/json; charset=utf-8","content-disposition":`attachment; filename="${rid}-verification-bundle.json"`}})}
