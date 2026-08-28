import Link from "next/link";

import { requestAccountRecovery } from "./actions";

type Props = { searchParams: Promise<{ error?: string; message?: string; next?: string }> };

function safeNext(value?: string) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/workspace/ai-governance/registry/register";
}

export default async function AccountRecoveryPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = safeNext(params.next);
  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24,background:"#080b12",color:"#f7f8fb",fontFamily:"Inter,system-ui,sans-serif"}}>
      <section style={{width:"min(620px,100%)",padding:36,border:"1px solid #283142",borderRadius:24,background:"#111725"}}>
        <Link href={`/login?next=${encodeURIComponent(next)}`} style={{color:"#9bb0ff",textDecoration:"none",fontWeight:800}}>TA-14 EXCHANGE PLATFORM</Link>
        <p style={{marginTop:36,color:"#8fa8ff",fontSize:12,fontWeight:800,letterSpacing:".14em"}}>ACCOUNT IDENTITY RECOVERY</p>
        <h1 style={{fontSize:"clamp(2.2rem,6vw,4rem)",lineHeight:1,letterSpacing:"-.05em"}}>Recover your Exchange identity.</h1>
        <p style={{color:"#b8c0cf",lineHeight:1.7}}>Use the email address associated with the account. TA-14 will send a recovery link if that identity exists. Recovery does not create, merge, transfer, register, approve, or authorize any governance record.</p>
        {params.error ? <div role="alert" style={{padding:14,borderRadius:12,background:"#351719",color:"#ffc8c8",marginBottom:18}}>{params.error}</div> : null}
        {params.message ? <div role="status" style={{padding:14,borderRadius:12,background:"#143524",color:"#c9f6db",marginBottom:18}}>{params.message}</div> : null}
        <form action={requestAccountRecovery}>
          <input type="hidden" name="next" value={next} />
          <label style={{display:"grid",gap:8,fontWeight:700}}>Email address
            <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" style={{minHeight:50,padding:"0 14px",borderRadius:12,border:"1px solid #46516a",background:"#0c111c",color:"#fff",font:"inherit"}} />
          </label>
          <button type="submit" style={{width:"100%",minHeight:50,marginTop:18,border:0,borderRadius:12,background:"#315cf6",color:"white",font:"inherit",fontWeight:800,cursor:"pointer"}}>Send recovery link</button>
        </form>
        <p style={{marginTop:22,color:"#8e98aa",fontSize:13,lineHeight:1.6}}>For privacy, the recovery response does not confirm whether a particular email is registered.</p>
      </section>
    </main>
  );
}
