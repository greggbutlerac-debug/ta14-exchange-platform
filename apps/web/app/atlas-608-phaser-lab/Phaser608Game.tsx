"use client";

import {useEffect,useRef} from "react";

export default function Phaser608Game(){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  let game:any;
  let cancelled=false;
  (async()=>{
   const Phaser=(await import("phaser")).default;
   if(cancelled||!host.current)return;
   class CoreOrbit extends Phaser.Scene{
    score=0;streak=0;question=0;scoreText!:Phaser.GameObjects.Text;streakText!:Phaser.GameObjects.Text;qText!:Phaser.GameObjects.Text;answerGroup!:Phaser.GameObjects.Group;
    questions=[
     {q:"Which statement best separates ODP from GWP?",a:["Both measure cylinder pressure","They mean the same thing","ODP concerns ozone depletion; GWP concerns climate warming relative to CO₂","ODP applies only to tools"],c:2},
     {q:"Before opening a refrigerant circuit, what must govern the action?",a:["How quickly the customer needs cooling","Required recovery and the applicable service rules","Whether the compressor sounds normal","Whether the technician owns gauges"],c:1},
     {q:"Recovery, recycling and reclaiming are best understood as…",a:["Three interchangeable words","Different refrigerant-management processes","Only disposal methods","Optional technician preferences"],c:1},
     {q:"A cylinder that appears empty should be treated as…",a:["Proof that no refrigerant remains","Safe to vent","An observation requiring proper verification","Ready for any refrigerant"],c:2}
    ];
    create(){
     const w=1280,h=720;
     this.cameras.main.setBackgroundColor("#020612");
     for(let i=0;i<170;i++){const s=this.add.circle(Phaser.Math.Between(0,w),Phaser.Math.Between(0,h),Phaser.Math.Between(1,2),0xb9f7ff,Phaser.Math.FloatBetween(.25,.95));this.tweens.add({targets:s,alpha:.15,duration:Phaser.Math.Between(700,2200),yoyo:true,repeat:-1})}
     const planet=this.add.circle(1050,185,112,0x12658c).setStrokeStyle(5,0x55eaff,.65);this.add.ellipse(1050,185,290,56).setStrokeStyle(4,0x64ffae,.7).setAngle(-13);this.tweens.add({targets:planet,scaleX:1.04,scaleY:1.04,duration:1700,yoyo:true,repeat:-1});
     this.add.text(54,35,"TA-14 ACADEMY // PRIVATE PHASER LAB",{fontFamily:"monospace",fontSize:"14px",color:"#64ffae",fontStyle:"bold"});
     this.add.text(54,61,"EPA 608 // CORE ORBIT",{fontFamily:"monospace",fontSize:"36px",color:"#eafcff",fontStyle:"bold"}).setShadow(0,0,"#38dfff",18);
     this.scoreText=this.add.text(55,120,"SCORE  0",{fontFamily:"monospace",fontSize:"19px",color:"#61eaff",fontStyle:"bold"});
     this.streakText=this.add.text(250,120,"STREAK  0x",{fontFamily:"monospace",fontSize:"19px",color:"#73ffb5",fontStyle:"bold"});
     this.add.text(54,170,"CADET RUN // LEVEL 1",{fontFamily:"monospace",fontSize:"13px",color:"#ffd96b",fontStyle:"bold"});
     this.qText=this.add.text(54,210,"",{fontFamily:"Arial",fontSize:"27px",color:"#ffffff",fontStyle:"bold",wordWrap:{width:800}});
     this.answerGroup=this.add.group();this.loadQuestion();
     this.add.text(54,675,"READ EVERY WORD  •  CHOOSE THE MOST DEFENSIBLE ANSWER  •  608 READINESS TRAINING — NOT EPA CERTIFICATION",{fontFamily:"monospace",fontSize:"11px",color:"#668a9c"});
    }
    loadQuestion(){
     this.answerGroup.clear(true,true);const q=this.questions[this.question%this.questions.length];this.qText.setText(`QUESTION ${this.question+1}  //  ${q.q}`);
     q.a.forEach((answer,i)=>{const y=315+i*76;const box=this.add.rectangle(450,y,790,58,0x071727,.96).setStrokeStyle(2,0x1f7892,.8).setInteractive({useHandCursor:true});const label=this.add.text(78,y-13,`${String.fromCharCode(65+i)}.  ${answer}`,{fontFamily:"Arial",fontSize:"17px",color:"#d9f4ff",wordWrap:{width:730}});this.answerGroup.addMultiple([box,label]);box.on("pointerover",()=>box.setStrokeStyle(3,0x65ffae,1));box.on("pointerout",()=>box.setStrokeStyle(2,0x1f7892,.8));box.on("pointerdown",()=>this.answer(i,box))});
    }
    answer(i:number,box:Phaser.GameObjects.Rectangle){const q=this.questions[this.question%this.questions.length];if(i===q.c){this.score+=650*(this.streak>=2?2:1);this.streak++;box.setFillStyle(0x0c5437);this.flash(0x53ff9e);this.burst(box.x,box.y);this.cameras.main.shake(80,.002)}else{this.score=Math.max(0,this.score-150);this.streak=0;box.setFillStyle(0x5a1028);this.flash(0xff315f);this.cameras.main.shake(260,.012)}this.scoreText.setText(`SCORE  ${this.score.toLocaleString()}`);this.streakText.setText(`STREAK  ${this.streak}x`);this.time.delayedCall(650,()=>{this.question++;this.loadQuestion()})}
    flash(color:number){const r=this.add.rectangle(640,360,1280,720,color,.16).setDepth(20);this.tweens.add({targets:r,alpha:0,duration:380,onComplete:()=>r.destroy()})}
    burst(x:number,y:number){for(let i=0;i<30;i++){const p=this.add.circle(x,y,Phaser.Math.Between(2,6),i%2?0x61ffad:0x50eaff);this.tweens.add({targets:p,x:x+Phaser.Math.Between(-190,190),y:y+Phaser.Math.Between(-150,150),alpha:0,scale:0,duration:Phaser.Math.Between(300,700),ease:"Cubic.easeOut",onComplete:()=>p.destroy()})}}
   }
   game=new Phaser.Game({type:Phaser.AUTO,width:1280,height:720,parent:host.current,backgroundColor:"#020612",scene:[CoreOrbit],scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH}});
  })();
  return()=>{cancelled=true;if(game)game.destroy(true)};
 },[]);
 return <div ref={host} style={{width:"100%",height:"100%"}}/>;
}
