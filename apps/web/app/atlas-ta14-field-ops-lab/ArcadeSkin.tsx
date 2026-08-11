"use client";

export default function ArcadeSkin(){
 return <>
  <div className="arcadeMarquee" aria-hidden="true"><span>TA-14 FIELD OPS</span><b>THE TA-14-STEP ARCADE</b><span>PLAYER 1 // HVACDR</span></div>
  <div className="arcadeEdge arcadeEdgeLeft" aria-hidden="true"/>
  <div className="arcadeEdge arcadeEdgeRight" aria-hidden="true"/>
  <div className="crtScan" aria-hidden="true"/>
  <div className="arcadeTicker" aria-hidden="true"><span>SEQUENCE • EVIDENCE • SAFETY • HOMEOWNER CARE • NOT YET • FIELD DISCIPLINE • TA-14</span></div>
  <style jsx global>{`
   .fieldOps .tech{display:none!important}
   .fieldOps{padding-top:42px!important;background-color:#02050a!important}
   .fieldOps.inside{background:radial-gradient(circle at 50% 22%,#132a4a 0,#081224 38%,#02050b 72%,#010207 100%)!important}
   .fieldOps.outside{background:radial-gradient(circle at 50% 20%,#0d3c31 0,#08221f 34%,#020908 68%,#010303 100%)!important}
   .fieldOps:after{content:"";position:fixed;z-index:2;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 50%,transparent 50%,rgba(0,0,0,.5) 100%)}
   .arcadeMarquee{position:fixed;z-index:125;left:0;right:0;top:0;height:42px;display:flex;align-items:center;justify-content:center;gap:34px;border-bottom:1px solid rgba(83,229,255,.55);background:linear-gradient(180deg,#07182d,#020817);box-shadow:0 0 36px rgba(48,216,255,.35),inset 0 -1px 0 rgba(91,255,169,.25);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase;overflow:hidden}
   .arcadeMarquee span{color:#54eaff;font-size:8px;font-weight:1000;letter-spacing:.22em;text-shadow:0 0 12px #43dfff}
   .arcadeMarquee b{color:#7affb4;font-size:13px;letter-spacing:.13em;text-shadow:0 0 10px #65ffad,0 0 24px #31ff8a;animation:marqueePulse 1.6s ease-in-out infinite alternate}
   .arcadeEdge{position:fixed;z-index:110;top:42px;bottom:0;width:6px;pointer-events:none;background:linear-gradient(180deg,#53eaff,#4b7dff 42%,#68ffae 75%,#53eaff);box-shadow:0 0 14px #4edfff,0 0 34px #4dff9d;animation:edgePower 2.2s ease-in-out infinite alternate}
   .arcadeEdgeLeft{left:0}.arcadeEdgeRight{right:0}
   .crtScan{position:fixed;z-index:105;inset:42px 0 0;pointer-events:none;opacity:.11;background:repeating-linear-gradient(180deg,rgba(255,255,255,.2) 0 1px,transparent 1px 4px);mix-blend-mode:screen}
   .arcadeTicker{position:fixed;z-index:116;left:50%;bottom:8px;transform:translateX(-50%);width:min(760px,calc(100vw - 60px));height:24px;overflow:hidden;border:1px solid rgba(86,232,255,.28);border-radius:999px;background:rgba(2,10,18,.88);box-shadow:0 0 22px rgba(48,220,255,.16);font:900 8px ui-monospace,SFMono-Regular,Menlo,monospace;color:#73ffb5;letter-spacing:.2em;white-space:nowrap}
   .arcadeTicker span{position:absolute;line-height:22px;animation:tickerRun 14s linear infinite}
   .fieldOps .top{top:0!important;border-bottom-color:rgba(85,235,255,.46)!important;background:linear-gradient(180deg,rgba(3,11,25,.97),rgba(2,7,16,.94))!important;box-shadow:0 10px 46px rgba(40,215,255,.16),0 0 0 1px rgba(95,255,170,.06) inset!important}
   .fieldOps .brand small{color:#66ffb0!important;text-shadow:0 0 10px rgba(85,255,165,.55)}
   .fieldOps .brand h1{font-family:ui-monospace,SFMono-Regular,Menlo,monospace!important;text-transform:uppercase!important;text-shadow:0 0 16px rgba(81,230,255,.2)}
   .fieldOps .hudBox{border-color:rgba(80,224,255,.34)!important;background:linear-gradient(180deg,rgba(5,28,45,.95),rgba(2,12,24,.96))!important;border-radius:6px!important;box-shadow:0 0 20px rgba(45,219,255,.08),inset 0 0 14px rgba(74,255,163,.03)!important}
   .fieldOps .hudBox b{color:#71ffad!important;text-shadow:0 0 10px rgba(83,255,166,.5)}
   .fieldOps .glass{border-color:rgba(70,220,255,.30)!important;background:linear-gradient(180deg,rgba(4,19,35,.91),rgba(2,8,19,.95))!important;box-shadow:0 22px 85px rgba(0,0,0,.45),0 0 28px rgba(44,214,255,.07),inset 0 0 0 1px rgba(91,255,167,.025)!important}
   .fieldOps .sequence{border-radius:8px!important;border-left:2px solid rgba(84,232,255,.48)!important}
   .fieldOps .node{border-radius:5px!important}
   .fieldOps .node.active{border-color:#59eaff!important;background:linear-gradient(90deg,rgba(28,97,154,.34),rgba(23,92,69,.12))!important;box-shadow:0 0 20px rgba(56,220,255,.17),inset 3px 0 0 #69ffae!important;animation:nodeArcade 1s steps(2,end) infinite}
   .fieldOps .nodeNum{border-radius:4px!important;background:#031424!important;box-shadow:inset 0 0 12px rgba(55,226,255,.09)}
   .fieldOps .cinema{border-radius:8px!important;border:2px solid rgba(77,230,255,.50)!important;box-shadow:0 0 0 5px #030812,0 0 0 7px rgba(80,255,170,.22),0 35px 100px rgba(0,0,0,.55),0 0 50px rgba(54,218,255,.14)!important}
   .fieldOps .cinema:after{content:"PLAYER 1 // SERVICE CALL ACTIVE";position:absolute;left:50%;bottom:12px;transform:translateX(-50%);z-index:8;padding:6px 12px;border:1px solid rgba(101,255,180,.28);background:rgba(2,12,20,.82);color:#6dffb1;font:1000 7px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;text-shadow:0 0 8px #4dff9c;white-space:nowrap}
   .fieldOps .homeowner{left:14%!important;font-size:105px!important;animation:homeownerIdle 2.6s ease-in-out infinite alternate}
   .fieldOps .airHandler{right:12%!important;box-shadow:-24px 28px 60px rgba(0,0,0,.5),0 0 48px rgba(63,224,255,.15)!important}
   .fieldOps .mission{border-radius:8px!important;border-top:2px solid #55eaff!important;box-shadow:0 0 32px rgba(51,219,255,.08),inset 0 0 24px rgba(67,255,164,.025)!important}
   .fieldOps .eyebrow{color:#76ffb5!important;text-shadow:0 0 9px rgba(87,255,171,.4)}
   .fieldOps .mission h2{font-family:ui-monospace,SFMono-Regular,Menlo,monospace!important;text-transform:uppercase!important;letter-spacing:.015em!important}
   .fieldOps .stop{border-radius:4px!important;border-color:rgba(95,255,170,.38)!important;background:linear-gradient(90deg,rgba(8,55,40,.35),rgba(4,24,28,.35))!important;box-shadow:inset 0 0 18px rgba(77,255,156,.03)}
   .fieldOps .actionGrid button{position:relative;border-radius:5px!important;border-color:rgba(65,217,255,.30)!important;background:linear-gradient(180deg,#071d35,#03101f)!important;box-shadow:inset 0 0 14px rgba(67,219,255,.025);overflow:hidden}
   .fieldOps .actionGrid button:before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,transparent,#58eaff,#6effae,transparent);opacity:.55}
   .fieldOps .actionGrid button:hover{border-color:#62eaff!important;background:linear-gradient(180deg,#0a3152,#061a2e)!important;box-shadow:0 0 28px rgba(55,224,255,.20)!important;transform:translateY(-3px) scale(1.01)!important}
   .fieldOps .actionGrid .advance{border-color:rgba(91,255,166,.55)!important;background:linear-gradient(180deg,#0a432b,#042016)!important;box-shadow:0 0 24px rgba(73,255,152,.08)!important}
   .fieldOps .actionGrid .advance:hover{border-color:#6effae!important;background:linear-gradient(180deg,#10643d,#052a1c)!important;box-shadow:0 0 34px rgba(73,255,152,.24)!important}
   .fieldOps .panel{border-radius:7px!important}.fieldOps .panel h3{color:#72ffb4!important;text-shadow:0 0 10px rgba(83,255,167,.35)}
   .fieldOps .progressBar{height:10px!important;border:1px solid rgba(82,232,255,.22);background:#020814!important}.fieldOps .progressBar i{background:linear-gradient(90deg,#19d8ff,#5b7cff,#59ff9b)!important;animation:meterCharge 1.8s ease-in-out infinite alternate}
   .fieldOps .privateMark{bottom:38px!important;color:#476d7b!important}
   .customerChallenge{border-radius:7px!important;border-width:2px!important;box-shadow:0 0 0 4px #020714,0 0 38px rgba(59,224,255,.3),0 22px 70px #000d!important}
   .customerChallenge:before{content:"QUICK RESPONSE BONUS";position:absolute;right:12px;top:-19px;color:#72ffb3;font:1000 7px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em;text-shadow:0 0 8px #59ffa2}
   .customerAnswers button{border-radius:4px!important}.customerAnswers button:hover{box-shadow:0 0 16px rgba(84,255,167,.17)}
   @keyframes marqueePulse{to{filter:brightness(1.35);transform:scale(1.03)}}
   @keyframes edgePower{from{filter:brightness(.72)}to{filter:brightness(1.35)}}
   @keyframes tickerRun{from{transform:translateX(780px)}to{transform:translateX(-110%)}}
   @keyframes nodeArcade{50%{filter:brightness(1.24)}}
   @keyframes homeownerIdle{from{transform:translateY(0)}to{transform:translateY(-5px)}}
   @keyframes meterCharge{to{filter:brightness(1.45)}}
   @media(max-width:900px){.arcadeMarquee{gap:12px}.arcadeMarquee span{display:none}.fieldOps{padding-top:42px!important}}
   @media(prefers-reduced-motion:reduce){.arcadeMarquee b,.arcadeEdge,.arcadeTicker span,.fieldOps .node.active,.fieldOps .homeowner,.fieldOps .progressBar i{animation:none!important}}
  `}</style>
 </>;
}
