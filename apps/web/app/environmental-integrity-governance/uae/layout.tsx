import Link from 'next/link';
import type { ReactNode } from 'react';

export default function UAEShowroomLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="uae-language-switch" aria-label="UAE showroom language selection">
        <Link href="/environmental-integrity-governance/uae">English</Link>
        <span aria-hidden="true">|</span>
        <Link href="/environmental-integrity-governance/uae/ar" lang="ar" dir="rtl">العربية</Link>
      </div>
      {children}
      <style>{`
        .uae-language-switch{position:fixed;z-index:1000;top:14px;right:18px;display:flex;align-items:center;gap:9px;padding:9px 13px;border:1px solid rgba(98,230,176,.42);border-radius:999px;background:rgba(3,16,13,.92);backdrop-filter:blur(10px);box-shadow:0 8px 28px rgba(0,0,0,.28);font:700 13px/1 Arial,Helvetica,sans-serif}.uae-language-switch a{color:#eef9f4;text-decoration:none}.uae-language-switch a:hover{color:#62e6b0}.uae-language-switch span{color:#55766a}@media(max-width:700px){.uae-language-switch{top:auto;right:12px;bottom:12px}}
      `}</style>
    </>
  );
}
