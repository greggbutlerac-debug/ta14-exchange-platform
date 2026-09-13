import type { Metadata } from "next";
import SevenInSevenOutIntegrity from "./SevenInSevenOutIntegrity";
import QuestionOnlyPlay from "./QuestionOnlyPlay";

export const metadata: Metadata = {
  title: "TA-14 Field Ops Lab | TA-14 Academy",
  description: "Public TA-14 Academy 14-step field operations training arcade.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function AtlasFieldOpsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <SevenInSevenOutIntegrity />
      <QuestionOnlyPlay />
    </>
  );
}
