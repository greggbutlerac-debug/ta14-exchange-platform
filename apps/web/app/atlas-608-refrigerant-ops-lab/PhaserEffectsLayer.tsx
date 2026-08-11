"use client";

import {useEffect,useRef} from "react";

type Props={flash:"good"|"bad"|null};

export default function PhaserEffectsLayer({flash}:Props){
 const host=useRef<HTMLDivElement>(null);
 const sceneRef=useRef<any>(null);
 useEffect(()=>{
  let game:any;let cancelled=false;
  (async()=>{
   const Phaser=(await import("phaser")).default;
   if(cancelled||!host.current)return;
   class EffectsScene extends Phaser.Scene{
    create(){
     sceneRef.current=this;const w=window.innerWidth,h=window.innerHeight;
     for(let i=0;i<110;i++){const star=this.add.circle(Phaser.Math.Between(0,w),Phaser.Math.Between(0,h),Phaser.Math.Between(1,2),0xbefaff,Phaser.Math.FloatBetween(.08,.45));this.tweens.add({targets:star,alpha:Phaser.Math.FloatBetween(.04,.18),duration:Phaser.Math.Between(900,3000),yoyo:true,repeat:-1})}
     for(let i=0;i<9;i++){const orb=this.add.circle(Phaser.Math.Between(0,w),Phaser.Math.Between(0,h),Phaser.Math.Between(3,8),i%2?0x5affab:0x48ddff,.22);this.tweens.add({targets:orb,x:orb.x+Phaser.Math.Between(-220,220),y:orb.y+Phaser.Math.Between(-150,150),duration:Phaser.Math.Between(5000,10000),yoyo:true,repeat:-1,ease:"Sine.easeInOut"})}
     this.time.addEvent({delay:Phaser.Math.Between(4500,8000),loop:true,callback:()=>this.ambientArc()});
    }
    correctBurst(){
     const w=this.scale.width,h=this.scale.height;this.energyWave(w/2,h/2,0x63ffad);this.energyWave(w/2,h/2,0x54e8ff,110);
     for(let j=0;j<5;j++){const x=Phaser.Math.Between(Math.round(w*.12),Math.round(w*.88)),y=Phaser.Math.Between(Math.round(h*.12),Math.round(h*.78));this.time.delayedCall(j*65,()=>{for(let i=0;i<34;i++){const p=this.add.circle(x,y,Phaser.Math.Between(2,7),i%2?0x64ffab:0x54e8ff,.95);this.tweens.add({targets:p,x:x+Phaser.Math.Between(-230,230),y:y+Phaser.Math.Between(-190,190),alpha:0,scale:0,duration:Phaser.Math.Between(350,820),ease:"Cubic.easeOut",onComplete:()=>p.destroy()})}})}
     for(let i=0;i<7;i++)this.lightning(i*65,false);this.planetPulse();
    }
    wrongHit(){this.cameras.main.shake(330,.011);const veil=this.add.rectangle(this.scale.width/2,this.scale.height/2,this.scale.width,this.scale.height,0xff235f,.13);this.tweens.add({targets:veil,alpha:0,duration:470,onComplete:()=>veil.destroy()});this.energyWave(this.scale.width/2,this.scale.height/2,0xff315f);this.lightning(0,true);this.lightning(90,true);this.lightning(170,true)}
    energyWave(x:number,y:number,color:number,delay=0){this.time.delayedCall(delay,()=>{const ring=this.add.circle(x,y,20).setStrokeStyle(5,color,.85).setFillStyle(color,.025);this.tweens.add({targets:ring,scale:28,alpha:0,duration:720,ease:"Quad.easeOut",onComplete:()=>ring.destroy()})})}
    planetPulse(){const x=this.scale.width*.88,y=this.scale.height*.24;const planet=this.add.circle(x,y,12,0x43dfff,.12).setStrokeStyle(4,0x62ffad,.75);const ring=this.add.ellipse(x,y,42,14).setStrokeStyle(3,0x55eaff,.7);this.tweens.add({targets:[planet,ring],scale:10,alpha:0,duration:850,ease:"Cubic.easeOut",onComplete:()=>{planet.destroy();ring.destroy()}})}
    ambientArc(){if(Math.random()>.72)this.lightning(0,false,.18)}
    lightning(delay:number,bad:boolean,alpha=.9){this.time.delayedCall(delay,()=>{const g=this.add.graphics();const color=bad?0xff3569:(Math.random()>.5?0x63ffad:0x58eaff);g.lineStyle(Phaser.Math.Between(2,5),color,alpha);let x=Phaser.Math.Between(40,this.scale.width-40),y=-20;g.beginPath();g.moveTo(x,y);while(y<this.scale.height*.78){x+=Phaser.Math.Between(-44,44);y+=Phaser.Math.Between(24,58);g.lineTo(x,y)}g.strokePath();this.tweens.add({targets:g,alpha:0,duration:bad?230:190,onComplete:()=>g.destroy()})})}
   }
   game=new Phaser.Game({type:Phaser.AUTO,parent:host.current,transparent:true,width:window.innerWidth,height:window.innerHeight,scene:[EffectsScene],scale:{mode:Phaser.Scale.RESIZE,width:"100%",height:"100%"},render:{antialias:true,pixelArt:false}});
  })();
  const resize=()=>game?.scale?.resize(window.innerWidth,window.innerHeight);window.addEventListener("resize",resize);return()=>{cancelled=true;window.removeEventListener("resize",resize);sceneRef.current=null;if(game)game.destroy(true)};
 },[]);
 useEffect(()=>{const scene=sceneRef.current;if(!scene||!flash)return;if(flash==="good")scene.correctBurst();else scene.wrongHit()},[flash]);
 return <div ref={host} aria-hidden="true" style={{position:"fixed",inset:0,zIndex:35,pointerEvents:"none",overflow:"hidden"}}/>;
}
