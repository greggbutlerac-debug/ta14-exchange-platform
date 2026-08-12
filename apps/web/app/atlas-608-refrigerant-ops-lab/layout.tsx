import type { Metadata } from "next";
import { Suspense } from "react";
import WorldAutoSelect from "./WorldAutoSelect";
import MissionRailController from "./MissionRailController";
import LightningStorm from "./LightningStorm";
import PhaserArcadeOverlay from "./PhaserArcadeOverlay";
import RunProgressionHUD from "./RunProgressionHUD";
import RunUnlockSequence from "./RunUnlockSequence";
import PressureDecisionEvents from "./PressureDecisionEvents";
import "./arcade.css";
import "./electric-palette.css";

export const metadata: Metadata = {
  title: "EPA 608 Refrigerant Ops | TA-14 Academy Private Preview",
  description: "Private TA-14 Academy EPA Section 608 readiness game prototype.",
  robots: { index: false, follow: false, nocache: true },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>
    <Suspense fallback={null}><WorldAutoSelect /></Suspense>
    {children}
    <LightningStorm />
    <PhaserArcadeOverlay />
    <RunProgressionHUD />
    <RunUnlockSequence />
    <PressureDecisionEvents />
    <Suspense fallback={null}><MissionRailController /></Suspense>
  </>;
}
