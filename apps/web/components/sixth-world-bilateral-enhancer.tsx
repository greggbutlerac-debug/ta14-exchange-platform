'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Country = 'thailand' | 'uae';

const TH: Record<string,string> = {
  'From air-quality evidence to governed action.':'จากหลักฐานคุณภาพอากาศ สู่การดำเนินการที่มีการกำกับดูแล',
  'Measurement can establish a condition. What governs everything that happens next?':'การตรวจวัดสามารถยืนยันสภาวะได้ แล้วอะไรเป็นสิ่งกำกับดูแลทุกสิ่งที่เกิดขึ้นต่อจากนั้น?',
  'When does air-quality data become a sufficiently governed, traceable, current record to support consequential action?':'เมื่อใดข้อมูลคุณภาพอากาศจึงกลายเป็นบันทึกที่มีการกำกับดูแล ตรวจสอบย้อนกลับได้ และเป็นปัจจุบันเพียงพอที่จะรองรับการดำเนินการที่มีผลตามมา?',
  'Preserve the route from reality to outcome.':'รักษาเส้นทางจากความเป็นจริงไปสู่ผลลัพธ์',
  'Not another monitoring platform. A governance layer between evidence and consequence.':'ไม่ใช่อีกหนึ่งแพลตฟอร์มตรวจวัด แต่เป็นชั้นการกำกับดูแลระหว่างหลักฐานกับผลที่ตามมา',
  'What produced the evidence?':'อะไรเป็นแหล่งกำเนิดของหลักฐาน?',
  'Is the represented condition still true?':'สภาวะที่บันทึกไว้นั้นยังคงเป็นจริงอยู่หรือไม่?',
  'Who may cause the consequence?':'ใครมีอำนาจทำให้เกิดผลตามมา?',
  'A PM2.5 signal is not the end of the governance problem.':'สัญญาณ PM2.5 ไม่ใช่จุดสิ้นสุดของปัญหาด้านการกำกับดูแล',
  'Air-quality evidence crosses a consequential threshold.':'หลักฐานคุณภาพอากาศข้ามเกณฑ์ที่อาจนำไปสู่การดำเนินการ',
  'Conditions change before action.':'เงื่อนไขเปลี่ยนแปลงก่อนการดำเนินการ',
  'Revalidate before consequence.':'ตรวจสอบความใช้ได้อีกครั้งก่อนเกิดผลตามมา',
  "Start from the institution's own public record.":'เริ่มจากบันทึกสาธารณะของสถาบันเอง',
  'KINGDOM OF THAILAND · POLLUTION CONTROL DEPARTMENT · TECHNICAL EXAMINATION SURFACE':'ราชอาณาจักรไทย · กรมควบคุมมลพิษ · พื้นที่สำหรับการตรวจสอบทางเทคนิค',
  'THE QUESTION':'คำถามหลัก','TA-14 GOVERNING CHAIN':'ห่วงโซ่การกำกับดูแล TA-14','WHERE THE ARCHITECTURE ENTERS':'จุดที่สถาปัตยกรรมเข้ามาทำหน้าที่','ILLUSTRATIVE THAILAND EXAMINATION':'ตัวอย่างการตรวจสอบสำหรับประเทศไทย','OFFICIAL THAILAND REFERENCE SURFACES':'แหล่งอ้างอิงทางการของประเทศไทย',
  'OBSERVATION':'การสังเกต','CHANGED CONTEXT':'บริบทที่เปลี่ยนแปลง','EXECUTION BOUNDARY':'ขอบเขตการดำเนินการ','PROVENANCE':'ที่มาของหลักฐาน','CURRENT STATE':'สถานะปัจจุบัน','AUTHORITY':'อำนาจ'
};

const AR: Record<string,string> = {
  'From national air-quality measurement to governed environmental action.':'من القياس الوطني لجودة الهواء إلى العمل البيئي الخاضع للحوكمة.',
  'This showroom starts with what exists.':'تبدأ هذه الواجهة بما هو قائم بالفعل.',
  'The UAE Agenda names the institutional problem.':'تحدد أجندة دولة الإمارات المشكلة المؤسسية بوضوح.',
  'UAE measurement stays native. TA-14 governs the handoff.':'تبقى منظومة القياس الإماراتية كما هي، بينما يحكم TA-14 عملية الانتقال من الدليل إلى الإجراء.',
  'One preserved route from reality to outcome.':'مسار واحد محفوظ من الواقع إلى النتيجة.',
  'Start with one school or government building. Prove only what the evidence earns.':'ابدأ بمدرسة واحدة أو مبنى حكومي واحد، وأثبت فقط ما تسمح به الأدلة.',
  'More value from the infrastructure already deployed.':'قيمة أكبر من البنية التحتية القائمة بالفعل.',
  'A small examination before any large deployment.':'فحص محدود قبل أي نشر واسع النطاق.',
  'Can the UAE preserve a demonstrable chain from environmental observation to authorized consequence - and prove when that chain must stop?':'هل تستطيع دولة الإمارات الحفاظ على سلسلة قابلة للإثبات من الرصد البيئي إلى النتيجة المصرح بها، وإثبات متى يجب أن تتوقف تلك السلسلة؟',
  "Built from the UAE's own published direction.":'مبني على التوجهات المنشورة رسمياً لدولة الإمارات.',
  'When has measurement earned consequence?':'متى يصبح القياس أساساً مستحقاً لنتيجة أو إجراء؟',
  'Use existing sensors':'استخدم أجهزة الاستشعار القائمة','Freeze the scenario':'ثبّت السيناريو','Create the AIR':'أنشئ سجل السلامة الجوية AIR','Run EIG prospectively':'شغّل حوكمة السلامة البيئية EIG استباقياً','Expose the execution boundary':'أظهر حدود التنفيذ','Preserve the outcome':'احفظ النتيجة',
  'THE UAE HAS ALREADY BUILT THE MEASUREMENT SIDE':'لقد بنت دولة الإمارات بالفعل جانب القياس','THE INDOOR-AIR SEAM':'فاصل الهواء الداخلي','PROPOSED COMPLEMENTARY ARCHITECTURE':'البنية التكميلية المقترحة','TA-14 GOVERNING CHAIN':'سلسلة حوكمة TA-14','BOUNDED UAE TECHNICAL EXAMINATION':'فحص تقني إماراتي محدود','WHAT SUCCESS WOULD MEAN':'ما الذي يعنيه النجاح','WHAT IT WOULD TAKE':'ما المطلوب','THE EXAMINATION QUESTION':'سؤال الفحص','OFFICIAL UAE BASIS':'الأساس الرسمي الإماراتي',
  'MEASUREMENT':'القياس','GOVERNED RECORD':'سجل خاضع للحوكمة','AUTHORIZED CONSEQUENCE':'نتيجة مصرح بها','FOR SENSOR NETWORKS':'لشبكات الاستشعار','FOR GOVERNMENT':'للحكومة','FOR FUTURE AI':'للذكاء الاصطناعي المستقبلي'
};

function flag(country:Country, side:'host'|'us'){
  return <div className={`swFlag ${side==='us'?'us':country}`} aria-label={side==='us'?'United States flag':country==='thailand'?'Thailand flag':'United Arab Emirates flag'}>{side==='us'&&<i/>}</div>;
}

export function SixthWorldBilateralEnhancer(){
  const pathname=usePathname();
  useEffect(()=>{
    const country:Country|null=pathname==='/global-institutional-engagement/thailand'?'thailand':pathname==='/environmental-integrity-governance/uae'?'uae':null;
    if(!country) return;
    document.body.dataset.sixthCountry=country;
    const root=document.querySelector('main'); if(!root) return;
    if(!root.querySelector('.swBilateral')){
      const mount=document.createElement('div'); mount.className='swBilateralMount'; root.prepend(mount);
      const host=country==='thailand'?'<div class="swFlag thailand"></div>':'<div class="swFlag uae"></div>';
      mount.innerHTML=`<div class="swBilateral"><div class="swNation"><div class="swCountry">${host}<div><b>${country==='thailand'?'ประเทศไทย':'الإمارات العربية المتحدة'}</b><small>${country==='thailand'?'THAILAND':'UNITED ARAB EMIRATES'}</small></div></div><div class="swSeal">TA-14 <span>GLOBAL INSTITUTIONAL ENGAGEMENT</span></div><div class="swNation swRight"><div><b>UNITED STATES</b><small>UNITED STATES OF AMERICA</small></div><div class="swFlag us"><i></i></div></div></div><div class="swLandmark ${country}">${country==='thailand'?'<i></i><i></i><i></i><i></i><i></i>':'<i></i><i></i><i></i><i></i><i></i><i></i>'}</div>`;
    }
    const dictionary=country==='thailand'?TH:AR;
    const nodes=root.querySelectorAll('h1,h2,h3,p,.eyebrow,.quote,strong');
    nodes.forEach(el=>{
      if((el as HTMLElement).dataset.swTranslated) return;
      const key=(el.textContent||'').replace(/\s+/g,' ').trim(); const native=dictionary[key]; if(!native) return;
      const n=document.createElement('div'); n.className=`swNative ${country==='uae'?'rtl':''}`; n.lang=country==='thailand'?'th':'ar'; n.textContent=native;
      el.parentNode?.insertBefore(n,el); (el as HTMLElement).dataset.swTranslated='1'; el.classList.add('swEnglish');
    });
    return()=>{delete document.body.dataset.sixthCountry};
  },[pathname]);
  if(pathname!=='/global-institutional-engagement/thailand'&&pathname!=='/environmental-integrity-governance/uae') return null;
  return <style>{`
    .swBilateralMount{position:relative;z-index:30}.swBilateral{height:118px;padding:0 max(24px,calc((100vw - 1180px)/2));display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px;background:linear-gradient(180deg,rgba(1,5,9,.98),rgba(3,12,18,.94));border-bottom:1px solid rgba(255,255,255,.14);box-shadow:0 18px 55px rgba(0,0,0,.34)}.swNation{display:flex;align-items:center;gap:18px}.swRight{justify-content:flex-end;text-align:right}.swNation b{display:block;color:#fff;font-size:15px;letter-spacing:.08em}.swNation small{display:block;margin-top:5px;color:#8799a4;font-size:8px;letter-spacing:.18em}.swSeal{text-align:center;color:#d8b65d;font:800 14px Georgia,serif;letter-spacing:.12em}.swSeal span{display:block;margin-top:5px;color:#82949e;font:800 7px Arial,sans-serif;letter-spacing:.16em}.swFlag{width:126px;height:76px;flex:none;border:1px solid rgba(255,255,255,.35);box-shadow:0 7px 24px rgba(0,0,0,.45);position:relative;overflow:hidden}.swFlag.thailand{background:linear-gradient(to bottom,#a51931 0 16.66%,#f4f5f8 16.66% 33.33%,#2d2a4a 33.33% 66.66%,#f4f5f8 66.66% 83.33%,#a51931 83.33%)}.swFlag.uae{background:linear-gradient(to bottom,#009a49 0 33.33%,#fff 33.33% 66.66%,#000 66.66%);border-left:31px solid #ce1126}.swFlag.us{background:repeating-linear-gradient(to bottom,#b22234 0 5.85px,#fff 5.85px 11.7px)}.swFlag.us:before{content:'✦ ✦ ✦ ✦ ✦\\A ✦ ✦ ✦ ✦\\A ✦ ✦ ✦ ✦ ✦\\A ✦ ✦ ✦ ✦';white-space:pre;position:absolute;left:0;top:0;width:52px;height:41px;padding:3px;background:#3c3b6e;color:#fff;font-size:6px;line-height:8px;letter-spacing:2px}.swLandmark{height:105px;margin-top:-1px;position:relative;overflow:hidden;opacity:.7;pointer-events:none;background:linear-gradient(180deg,rgba(8,24,34,.96),rgba(2,8,12,.1))}.swLandmark i{position:absolute;bottom:0;background:linear-gradient(180deg,rgba(215,184,101,.32),rgba(20,43,54,.75));filter:drop-shadow(0 0 14px rgba(226,190,95,.14))}.swLandmark.thailand i:nth-child(1){left:12%;width:28px;height:72px;clip-path:polygon(50% 0,68% 34%,61% 34%,78% 70%,68% 70%,82% 100%,18% 100%,32% 70%,22% 70%,39% 34%,32% 34%)}.swLandmark.thailand i:nth-child(2){left:22%;width:18px;height:48px;clip-path:polygon(50% 0,70% 45%,62% 45%,80% 100%,20% 100%,38% 45%,30% 45%)}.swLandmark.thailand i:nth-child(3){left:50%;width:42px;height:94px;clip-path:polygon(50% 0,61% 28%,56% 28%,70% 57%,64% 57%,82% 100%,18% 100%,36% 57%,30% 57%,44% 28%,39% 28%)}.swLandmark.thailand i:nth-child(4){right:22%;width:18px;height:48px;clip-path:polygon(50% 0,70% 45%,62% 45%,80% 100%,20% 100%,38% 45%,30% 45%)}.swLandmark.thailand i:nth-child(5){right:12%;width:28px;height:72px;clip-path:polygon(50% 0,68% 34%,61% 34%,78% 70%,68% 70%,82% 100%,18% 100%,32% 70%,22% 70%,39% 34%,32% 34%)}.swLandmark.uae i:nth-child(1){left:10%;width:32px;height:46px}.swLandmark.uae i:nth-child(2){left:24%;width:42px;height:63px;border-radius:20px 20px 0 0}.swLandmark.uae i:nth-child(3){left:48%;width:18px;height:102px;clip-path:polygon(44% 0,56% 0,61% 45%,75% 100%,25% 100%,39% 45%)}.swLandmark.uae i:nth-child(4){right:27%;width:50px;height:58px;border-radius:25px 25px 0 0}.swLandmark.uae i:nth-child(5){right:16%;width:12px;height:76px}.swLandmark.uae i:nth-child(6){right:8%;width:25px;height:38px}.swNative{max-width:930px;margin:12px 0 5px;color:#fff;font-size:1.08em;font-weight:750;line-height:1.55}.swNative.rtl{direction:rtl;text-align:right;font-family:Tahoma,Arial,sans-serif}.swEnglish{opacity:.82}.swNative+h1,.swNative+h2{margin-top:4px!important}.swNative+h3{margin-top:4px!important}.swNative+.eyebrow{margin-top:0!important}@media(max-width:760px){.swBilateral{height:auto;min-height:130px;padding:18px;grid-template-columns:1fr 1fr}.swSeal{grid-column:1/-1;grid-row:2}.swFlag{width:86px;height:52px}.swNation{gap:9px}.swNation b{font-size:10px}.swNation small{display:none}.swLandmark{height:72px}}
  `}</style>;
}
