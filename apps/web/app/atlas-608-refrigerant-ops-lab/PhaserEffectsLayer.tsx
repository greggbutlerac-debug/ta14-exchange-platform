"use client";

import {useEffect,useRef} from "react";

type Props={flash:"good"|"bad"|null};

export default function PhaserEffectsLayer({flash}:Props){
 const host=useRef<HTMLDivElement>(null);
 const sceneRef=useRef<any>(null);

 useEffect(()=>{
  let game:any;
  let cancelled=false;
  (async()=>{
   const Phaser=(await import("phaser")).default;
   if(cancelled||!host.current)return;

   class EffectsScene extends Phaser.Scene{
    create(){
     sceneRef.current=this;
     const w=window.innerWidth,h=window.innerHeight;

     for(let i=0;i<90;i++){
      const star=this.add.circle(
       Phaser.Math.Between(0,w),
       Phaser.Math.Between(0,h),
       Phaser.Math.Between(1,2),
       0xbefaff,
       Phaser.Math.FloatBetween(.12,.5)
      );
      this.tweens.add({targets:star,alpha:Phaser.Math.FloatBetween(.05,.2),duration:Phaser.Math.Between(1200,3200),yoyo:true,repeat:-1});
     }

     for(let i=0;i<7;i++){
      const orb=this.add.circle(
       Phaser.Math.Between(0,w),
       Phaser.Math.Between(0,h),
       Phaser.Math.Between(3,7),
       i%2?0x5affab:0x48ddff,
       .25
      );
      this.tweens.add({targets:orb,x:orb.x+Phaser.Math.Between(-180,180),y:orb.y+Phaser.Math.Between(-120,120),duration:Phaser.Math.Between(5000,9000),yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
     }
    }

    correctBurst(){
     const w=this.scale.width,h=this.scale.height;
     for(let j=0;j<4;j++){
      const x=Phaser.Math.Between(Math.round(w*.18),Math.round(w*.82));
      const y=Phaser.Math.Between(Math.round(h*.16),Math.round(h*.70));
      this.time.delayedCall(j*70,()=>{
       for(let i=0;i<28;i++){
        const p=this.add.circle(x,y,Phaser.Math.Between(2,6),i%2?0x64ffab:0x54e8ff,.95);
        this.tweens.add({targets:p,x:x+Phaser.Math.Between(-190,190),y:y+Phaser.Math.Between(-160,160),alpha:0,scale:0,duration:Phaser.Math.Between(320,720),ease:"Cubic.easeOut",onComplete:()=>p.destroy()});
       }
      });
     }
     for(let i=0;i<5;i++)this.lightning(i*80,false);
    }

    wrongHit(){
     this.cameras.main.shake(300,.009);
     const veil=this.add.rectangle(this.scale.width/2,this.scale.height/2,this.scale.width,this.scale.height,0xff235f,.11);
     this.tweens.add({targets:veil,alpha:0,duration:430,onComplete:()=>veil.destroy()});
     this.lightning(0,true);
     this.lightning(100,true);
    }

    lightning(delay:number,bad:boolean){
     this.time.delayedCall(delay,()=>{
      const g=this.add.graphics();
      const color=bad?0xff3569:(Math.random()>.5?0x63ffad:0x58eaff);
      g.lineStyle(Phaser.Math.Between(2,5),color,.9);
      let x=Phaser.Math.Between(40,this.scale.width-40),y=-20;
      g.beginPath();g.moveTo(x,y);
      while(y<this.scale.height*.72){x+=Phaser.Math.Between(-40,40);y+=Phaser.Math.Between(25,60);g.lineTo(x,y)}
      g.strokePath();
      this.tweens.add({targets:g,alpha:0,duration:180,onComplete:()=>g.destroy()});
     });
    }
   }

   game=new Phaser.Game({
    type:Phaser.AUTO,
    parent:host.current,
    transparent:true,
    width:window.innerWidth,
    height:window.innerHeight,
    scene:[EffectsScene],
    scale:{mode:Phaser.Scale.RESIZE,width:"100%",height:"100%"},
    render:{antialias:true,pixelArt:false}
   });
  })();

  const resize=()=>game?.scale?.resize(window.innerWidth,window.innerHeight);
  window.addEventListener("resize",resize);
  return()=>{cancelled=true;window.removeEventListener("resize",resize);sceneRef.current=null;if(game)game.destroy(true)};
 },[]);

 useEffect(()=>{
  const scene=sceneRef.current;
  if(!scene||!flash)return;
  if(flash==="good")scene.correctBurst();
  else scene.wrongHit();
 },[flash]);

 return <div ref={host} aria-hidden="true" style={{position:"fixed",inset:0,zIndex:35,pointerEvents:"none",overflow:"hidden"}}/>;
}
