"use client";
import dynamic from "next/dynamic";
const Phaser608Game=dynamic(()=>import("./Phaser608Game"),{ssr:false});
export default function Phaser608Lab(){return <main style={{margin:0,minHeight:"100vh",background:"#01030a",overflow:"hidden"}}><div style={{width:"100vw",height:"100vh"}}><Phaser608Game/></div></main>}
