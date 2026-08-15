import type { ReactNode } from "react";

export default function EuAiActGovernedRecordsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="euRecordsWorld">
      {children}
      <style>{`
        .euRecordsWorld{position:relative;isolation:isolate;background:#02060d;min-height:100vh}
        .euRecordsWorld:before{content:"";position:fixed;inset:0;z-index:-2;pointer-events:none;background:radial-gradient(circle at 76% 8%,rgba(46,177,255,.15),transparent 28%),radial-gradient(circle at 10% 52%,rgba(74,79,255,.09),transparent 30%),linear-gradient(180deg,#020711,#02050a 58%,#03070e)}
        .euRecordsWorld:after{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;opacity:.22;background-image:linear-gradient(rgba(110,224,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(110,224,255,.035) 1px,transparent 1px);background-size:76px 76px;mask-image:linear-gradient(to bottom,#000,transparent 82%)}

        .euRecordsWorld main{background:transparent!important}
        .euRecordsWorld .topbar{margin-top:14px;min-height:76px!important;padding:0 22px;border:1px solid rgba(110,224,255,.16)!important;border-radius:18px;background:rgba(4,13,23,.72);backdrop-filter:blur(18px);box-shadow:0 18px 50px rgba(0,0,0,.34)}
        .euRecordsWorld .brandMark{border:1px solid rgba(169,239,255,.62);background:linear-gradient(135deg,#7ce7ff,#c9f6ff)!important;box-shadow:0 0 28px rgba(83,218,255,.2)}
        .euRecordsWorld nav a{transition:.18s ease}.euRecordsWorld nav a:hover{color:#fff!important;text-shadow:0 0 16px rgba(110,224,255,.48)}

        .euRecordsWorld .hero{position:relative;min-height:620px!important;margin-top:18px;padding:68px clamp(28px,5vw,70px)!important;border:1px solid rgba(110,224,255,.19);border-radius:32px;background:linear-gradient(125deg,rgba(7,23,39,.92),rgba(4,10,19,.91) 55%,rgba(10,19,34,.88));box-shadow:0 34px 90px rgba(0,0,0,.52),inset 0 1px rgba(255,255,255,.05);overflow:hidden}
        .euRecordsWorld .hero:before{content:"";position:absolute;width:560px;height:560px;right:-180px;top:-250px;border:1px solid rgba(111,226,255,.18);border-radius:50%;box-shadow:0 0 0 58px rgba(111,226,255,.045),0 0 0 116px rgba(111,226,255,.025);animation:recordsOrbit 11s ease-in-out infinite}
        .euRecordsWorld .hero:after{content:"";position:absolute;left:4%;right:4%;bottom:0;height:1px;background:linear-gradient(90deg,transparent,#72e8ff,transparent);box-shadow:0 0 24px #72e8ff66}
        .euRecordsWorld .heroCopy,.euRecordsWorld .recordVisual{position:relative;z-index:2}
        .euRecordsWorld h1{font-size:clamp(50px,6.5vw,92px)!important;line-height:.94!important;letter-spacing:-.065em!important;text-shadow:0 18px 55px rgba(0,0,0,.55)}
        .euRecordsWorld .lead{font-size:17px!important;color:#a8bdcd!important;max-width:720px!important}
        .euRecordsWorld .eyebrow{color:#77e6ff!important;text-shadow:0 0 18px rgba(78,218,255,.35)}
        .euRecordsWorld .primaryButton,.euRecordsWorld .secondaryButton{transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
        .euRecordsWorld .primaryButton:hover,.euRecordsWorld .secondaryButton:hover{transform:translateY(-3px);box-shadow:0 18px 42px rgba(0,0,0,.42)}
        .euRecordsWorld .recordCard{border-color:rgba(113,226,255,.42)!important;background:radial-gradient(circle at 30% 5%,rgba(76,206,255,.13),transparent 32%),linear-gradient(160deg,rgba(14,39,61,.98),rgba(4,12,23,.99))!important;box-shadow:0 34px 80px rgba(0,0,0,.5),0 0 50px rgba(40,198,255,.08),inset 0 1px rgba(255,255,255,.07)!important}
        .euRecordsWorld .frontCard{box-shadow:0 38px 90px rgba(0,0,0,.58),0 0 70px rgba(50,205,255,.13),inset 0 1px rgba(255,255,255,.08)!important}
        .euRecordsWorld .seal{box-shadow:0 0 0 9px rgba(91,218,255,.045),0 0 38px rgba(76,168,255,.38),inset 0 0 25px rgba(76,168,255,.22)!important}

        .euRecordsWorld .boundaryNotice{position:relative;margin-top:24px;border-color:rgba(242,196,86,.28)!important;background:radial-gradient(circle at 50% 0,rgba(242,196,86,.09),transparent 46%),linear-gradient(180deg,rgba(20,22,28,.94),rgba(8,14,23,.96))!important;box-shadow:0 24px 65px rgba(0,0,0,.38)!important;overflow:hidden}
        .euRecordsWorld .boundaryNotice:before{content:"";position:absolute;left:12%;right:12%;top:0;height:2px;background:linear-gradient(90deg,transparent,#f1ca69,transparent);box-shadow:0 0 22px #f1ca6966}
        .euRecordsWorld .boundaryNotice .eyebrow{color:#f1d17c!important}

        .euRecordsWorld .summary{gap:16px!important;padding-top:30px!important}
        .euRecordsWorld .summary article{position:relative;min-height:150px!important;border-color:rgba(110,224,255,.17)!important;background:linear-gradient(150deg,rgba(8,26,42,.9),rgba(4,11,20,.94))!important;box-shadow:0 18px 44px rgba(0,0,0,.3);overflow:hidden;transition:.2s ease}
        .euRecordsWorld .summary article:after{content:"";position:absolute;right:-34px;bottom:-42px;width:120px;height:120px;border:1px solid rgba(110,224,255,.1);border-radius:50%;box-shadow:0 0 0 20px rgba(110,224,255,.025)}
        .euRecordsWorld .summary article:hover{transform:translateY(-5px);border-color:rgba(110,224,255,.43)!important;box-shadow:0 26px 58px rgba(0,0,0,.46),0 0 34px rgba(60,214,255,.08)}
        .euRecordsWorld .summary span{color:#7ce8ff!important;text-shadow:0 0 28px rgba(83,218,255,.25)}

        .euRecordsWorld .library{position:relative;border-radius:30px!important;border-color:rgba(110,224,255,.2)!important;background:linear-gradient(155deg,rgba(7,20,34,.96),rgba(4,10,18,.97))!important;box-shadow:0 30px 80px rgba(0,0,0,.44)!important;overflow:hidden}
        .euRecordsWorld .library:before{content:"";position:absolute;inset:0 auto 0 0;width:2px;background:linear-gradient(transparent,#71e5ff 20%,#71e5ff 75%,transparent);box-shadow:0 0 22px #71e5ff55}
        .euRecordsWorld .sectionIntro{padding-bottom:28px;border-bottom:1px solid rgba(110,224,255,.13)}
        .euRecordsWorld .sectionIntro h2,.euRecordsWorld .architecture h2,.euRecordsWorld .finalCta h2{letter-spacing:-.045em!important}
        .euRecordsWorld .filters{padding:18px;border:1px solid rgba(110,224,255,.13);border-radius:18px;background:rgba(3,10,18,.62);box-shadow:inset 0 1px rgba(255,255,255,.025)}
        .euRecordsWorld input{border-color:rgba(110,224,255,.2)!important;background:rgba(2,8,15,.86)!important;box-shadow:inset 0 8px 24px rgba(0,0,0,.22)}
        .euRecordsWorld .filterButtons button{transition:.18s ease}.euRecordsWorld .filterButtons button:hover{border-color:rgba(110,224,255,.4)!important;color:#fff!important}.euRecordsWorld .filterButtons button.active{background:linear-gradient(135deg,rgba(61,188,236,.18),rgba(57,106,220,.12))!important;box-shadow:0 0 24px rgba(72,210,255,.08)}

        .euRecordsWorld .record{position:relative;border-radius:20px!important;border-color:rgba(110,224,255,.14)!important;background:linear-gradient(145deg,rgba(7,20,32,.96),rgba(3,9,17,.97))!important;box-shadow:0 14px 34px rgba(0,0,0,.25);transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}
        .euRecordsWorld .record:before{content:"";position:absolute;inset:0 auto 0 0;width:3px;background:linear-gradient(#71e6ff,transparent 78%);opacity:.35}
        .euRecordsWorld .record:hover{transform:translateY(-3px);border-color:rgba(110,224,255,.36)!important;box-shadow:0 22px 52px rgba(0,0,0,.42),0 0 30px rgba(60,214,255,.055)}
        .euRecordsWorld .record.open{border-color:rgba(110,224,255,.48)!important;box-shadow:0 26px 60px rgba(0,0,0,.48),0 0 42px rgba(60,214,255,.08)}
        .euRecordsWorld .articleBadge{border-color:rgba(110,224,255,.38)!important;background:radial-gradient(circle at 50% 0,rgba(93,221,255,.14),transparent 70%),rgba(13,43,65,.5)!important;color:#9beeff!important;box-shadow:0 0 24px rgba(73,211,255,.08),inset 0 1px rgba(255,255,255,.05)}
        .euRecordsWorld .recordTitle h3{color:#f3f9ff;font-size:24px!important}.euRecordsWorld .recordTitle p{color:#93aabd!important;line-height:1.62!important}
        .euRecordsWorld .expandIcon{border-color:rgba(110,224,255,.35)!important;background:rgba(110,224,255,.05);box-shadow:0 0 20px rgba(110,224,255,.07)}
        .euRecordsWorld .proofBlock{background:linear-gradient(145deg,rgba(8,23,35,.88),rgba(4,11,19,.9))!important;box-shadow:inset 0 1px rgba(255,255,255,.03)}
        .euRecordsWorld .fieldTags span{background:rgba(72,184,226,.075)!important;box-shadow:inset 0 1px rgba(255,255,255,.025)}
        .euRecordsWorld .recordActions a{transition:.18s ease}.euRecordsWorld .recordActions a:hover{transform:translateY(-2px);border-color:rgba(110,224,255,.48)!important;background:rgba(72,184,226,.12)!important;color:#e9fbff!important}

        .euRecordsWorld .architecture{position:relative;border-color:rgba(110,224,255,.2)!important;background:radial-gradient(circle at 15% 0,rgba(75,213,255,.08),transparent 34%),linear-gradient(145deg,rgba(7,20,33,.95),rgba(4,10,18,.97))!important;box-shadow:0 28px 70px rgba(0,0,0,.4)!important}
        .euRecordsWorld .architectureGrid{position:relative;gap:18px!important}.euRecordsWorld .architectureGrid:before{content:"";position:absolute;left:8%;right:8%;top:38px;height:1px;background:linear-gradient(90deg,transparent,#71e6ff55,#71e6ff55,transparent)}
        .euRecordsWorld .architectureGrid article{position:relative;z-index:1;min-height:210px;border-color:rgba(110,224,255,.16)!important;background:linear-gradient(155deg,rgba(9,28,43,.94),rgba(4,11,19,.96))!important;box-shadow:0 16px 38px rgba(0,0,0,.28);transition:.2s ease}.euRecordsWorld .architectureGrid article:hover{transform:translateY(-5px);border-color:rgba(110,224,255,.42)!important;box-shadow:0 24px 54px rgba(0,0,0,.44)}.euRecordsWorld .architectureGrid span{display:grid;width:42px;height:42px;place-items:center;border:1px solid rgba(110,224,255,.38);border-radius:50%;background:#071725;color:#8feaff!important;box-shadow:0 0 24px rgba(110,224,255,.12)}

        .euRecordsWorld .finalCta{position:relative;border-color:rgba(242,196,86,.28)!important;background:radial-gradient(circle at 82% 40%,rgba(242,196,86,.09),transparent 28%),radial-gradient(circle at 15% 0,rgba(80,218,255,.1),transparent 34%),linear-gradient(125deg,rgba(7,24,39,.97),rgba(7,13,23,.98))!important;box-shadow:0 34px 82px rgba(0,0,0,.5)!important;overflow:hidden}.euRecordsWorld .finalCta:after{content:"";position:absolute;width:280px;height:280px;right:-120px;top:-130px;border:1px solid rgba(242,196,86,.16);border-radius:50%;box-shadow:0 0 0 42px rgba(242,196,86,.025)}
        .euRecordsWorld footer{border-top:1px solid rgba(110,224,255,.1);margin-top:42px}

        @keyframes recordsOrbit{0%,100%{transform:scale(.96) rotate(0deg);opacity:.55}50%{transform:scale(1.04) rotate(9deg);opacity:.95}}
        @media(max-width:900px){.euRecordsWorld .hero{padding:42px 26px!important}.euRecordsWorld .architectureGrid:before{display:none}}
      `}</style>
    </div>
  );
}
