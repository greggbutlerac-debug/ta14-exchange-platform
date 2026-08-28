import Link from "next/link";

import { updateRecoveredPassword } from "./actions";

type Props = { searchParams: Promise<{ error?: string; next?: string }> };
function safeNext(value?: string) { return value?.startsWith("/") && !value.startsWith("//") ? value : "/workspace/ai-governance/registry/register"; }

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = safeNext(params.next);
  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24,background:"#080b12",color:"#f7f8fb",fontFamily:"Inter,system-ui,sans-serif"}}>
      <section style={{width:"min(620px,100%)",padding:36,border:"1px solid #283142",borderRadius:24,background:"#111725"}}>
        <Link href="/" style={{color:"#9bb0ff",textDecoration:"none",fontWeight:800}}>TA-14 EXCHANGE PLATFORM</Link>
        <p style={{marginTop:36,color:"#8fa8ff",fontSize:12,fontWeight:800,letterSpacing:".14em"}}>RECOVERED IDENTITY</p>
        <h1 style={{fontSize:"clamp(2.2rem,6vw,4rem)",lineHeight:1,letterSpacing:"-.05em"}}>Set a new password.</h1>
        <p style={{color:"#b8c0cf",lineHeight:1.7}}>The recovery link establishes a temporary authenticated session. Set a new password to regain control of the same Exchange identity; this does not create a second account.</p>
        {params.error ? <div role="alert" style={{padding:14,borderRadius:12,background:"#351719",color:"#ffc8c8",marginBottom:18}}>{params.error}</div> : null}
        <form action={updateRecoveredPassword}>
          <input type="hidden" name="next" value={next} />
          <label style={{display:"grid",gap:8,fontWeight:700}}>New password<input name="password" type="password" autoComplete="new-password" minLength={8} required style={{minHeight:50,padding:"0 14px",borderRadius:12,border:"1px solid #46516a",background:"#0c111c",color:"#fff",font:"inherit"}} /></label>
          <label style={{display:"grid",gap:8,fontWeight:700,marginTop:16}}>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required style={{minHeight:50,padding:"0 14px",borderRadius:12,border:"1px solid #46516a",background:"#0c111c",color:"#fff",font:"inherit"}} /></label>
          <button type="submit" style={{width:"100%",minHeight:50,marginTop:18,border:0,borderRadius:12,background:"#315cf6",color:"white",font:"inherit",fontWeight:800,cursor:"pointer"}}>Set password & continue</button>
        </form>
      </section>
    </main>
  );
}
