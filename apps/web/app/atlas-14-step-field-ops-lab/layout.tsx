import type { Metadata } from "next";
import MissionRouteExactTitles from "./MissionRouteExactTitles";

export const metadata: Metadata = {
  title: "TA-14 Field Ops Lab | 7 In / 7 Out Arcade",
  description: "TA-14 Academy 7 In / 7 Out field operations arcade.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AtlasFieldOpsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}<MissionRouteExactTitles /></>;
}
