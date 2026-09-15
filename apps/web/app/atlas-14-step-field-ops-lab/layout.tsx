import type { Metadata } from "next";
import SevenInSevenOutIntegrity from "./SevenInSevenOutIntegrity";
import QuestionOnlyPlay from "./QuestionOnlyPlay";
import MissionRouteExactTitles from "./MissionRouteExactTitles";

export const metadata: Metadata = {
  title: "TA-14 Field Ops Lab | Private Preview",
  description: "Private TA-14 Academy field operations game prototype.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AtlasFieldOpsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}<SevenInSevenOutIntegrity /><QuestionOnlyPlay /><MissionRouteExactTitles /></>;
}
