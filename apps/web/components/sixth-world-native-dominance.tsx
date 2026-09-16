'use client';

import { usePathname } from 'next/navigation';

export function SixthWorldNativeDominance() {
  const pathname = usePathname();
  const active = pathname === '/global-institutional-engagement/thailand' || pathname === '/environmental-integrity-governance/uae';
  if (!active) return null;

  return <style>{`
    /* Sixth World rule: the host country's language owns the visual hierarchy.
       English remains immediately available as the smaller verification layer. */
    .swNative {
      display:block !important;
      margin:0 0 .32em !important;
      color:#f5e4a8 !important;
      font-size:clamp(1.15rem,1.65vw,1.65rem) !important;
      font-weight:760 !important;
      line-height:1.42 !important;
      letter-spacing:0 !important;
      opacity:1 !important;
    }
    h1 + .swNative, h2 + .swNative, h3 + .swNative { margin-top:.2em !important; }
    .swNative + h1,
    .swNative + h2,
    .swNative + h3,
    .swNative + .swEnglish { margin-top:0 !important; }

    /* Native copy inserted before an English hero/section heading inherits the
       semantic scale of that heading rather than reading like a translation note. */
    .swNative:has(+ h1) {
      font-size:clamp(2.8rem,6.4vw,6.8rem) !important;
      font-weight:850 !important;
      line-height:1.03 !important;
      max-width:15ch;
      margin-bottom:.2em !important;
      text-wrap:balance;
    }
    .swNative:has(+ h2) {
      font-size:clamp(2rem,4vw,4.25rem) !important;
      font-weight:820 !important;
      line-height:1.08 !important;
      margin-bottom:.18em !important;
      text-wrap:balance;
    }
    .swNative:has(+ h3),
    .swNative:has(+ .eyebrow),
    .swNative:has(+ strong) {
      font-size:clamp(1.3rem,2.2vw,2.15rem) !important;
      font-weight:800 !important;
      line-height:1.16 !important;
      margin-bottom:.18em !important;
    }

    /* English is deliberately subordinate everywhere it has a native pair. */
    .swEnglish {
      font-size:clamp(.72rem,.9vw,.92rem) !important;
      font-weight:520 !important;
      line-height:1.5 !important;
      letter-spacing:.015em !important;
      color:#8fa1aa !important;
      opacity:.78 !important;
      max-width:76ch;
    }
    h1.swEnglish {
      font-size:clamp(1rem,1.35vw,1.35rem) !important;
      line-height:1.28 !important;
      font-weight:600 !important;
      max-width:62ch;
    }
    h2.swEnglish {
      font-size:clamp(.88rem,1.12vw,1.12rem) !important;
      line-height:1.35 !important;
      font-weight:600 !important;
    }
    h3.swEnglish, .eyebrow.swEnglish, strong.swEnglish {
      font-size:clamp(.7rem,.86vw,.86rem) !important;
      line-height:1.35 !important;
      font-weight:600 !important;
    }

    /* Arabic remains right-to-left at the block level without reversing the
       bilateral page or flag order. */
    body[data-sixth-country='uae'] .swNative {
      direction:rtl;
      text-align:right;
      font-family:Tahoma,Arial,sans-serif !important;
      margin-left:auto !important;
    }
    body[data-sixth-country='uae'] .swNative:has(+ h1),
    body[data-sixth-country='uae'] .swNative:has(+ h2) { max-width:18ch; }

    @media (max-width:720px) {
      .swNative:has(+ h1){font-size:clamp(2.35rem,11vw,4rem) !important;}
      .swNative:has(+ h2){font-size:clamp(1.75rem,8vw,3rem) !important;}
      .swEnglish{font-size:.72rem !important;}
    }
  `}</style>;
}
