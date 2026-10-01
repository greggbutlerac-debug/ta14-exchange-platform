'use client';

import { useState } from 'react';

type Props = {
  children: React.ReactNode;
  localLabel?: string;
  localStatus?: string;
  englishStatus?: string;
};

export default function ShowroomLanguageView({children,localLabel='Local language',localStatus,englishStatus}:Props){
  const [english,setEnglish]=useState(false);
  return <div className={english?'ta14EnglishView':''}>
    <button type="button" className="ta14LanguageControl" onClick={()=>setEnglish(v=>!v)} aria-pressed={english}>
      {'🌐 '}{english?'VIEW '+localLabel.toUpperCase():'VIEW IN ENGLISH'}
      <small>{english?(englishStatus||'ENGLISH VIEW'):(localStatus||'LOCAL LANGUAGE VIEW')}</small>
    </button>
    {children}
    <style jsx global>{`
      .ta14LanguageControl{position:fixed;right:18px;top:82px;z-index:1000;border:1px solid #f7d117;background:#071719;color:#fff;padding:11px 14px;border-radius:7px;box-shadow:0 8px 28px #0008;cursor:pointer;text-decoration:none;font:900 10px/1.2 Arial,sans-serif;letter-spacing:.08em}
      .ta14LanguageControl small{display:block;color:#f7d117;font-size:7px;letter-spacing:.1em;margin-top:5px;text-align:right}
      .ta14EnglishView .tp,.ta14EnglishView .hm{display:none!important}
      .ta14EnglishView .en{display:block!important;color:inherit!important;font-size:inherit!important;line-height:inherit!important;font-weight:inherit!important;margin-top:0!important}
      @media(max-width:760px){.ta14LanguageControl{top:auto;bottom:16px;right:16px}}
    `}</style>
  </div>;
}
