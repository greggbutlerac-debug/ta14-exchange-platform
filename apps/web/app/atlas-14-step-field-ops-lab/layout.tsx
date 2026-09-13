import type { Metadata } from "next";
import SevenInSevenOutIntegrity from "./SevenInSevenOutIntegrity";
import AnswerLengthIntegrity from "./AnswerLengthIntegrity";

export const metadata: Metadata = {
  title: "TA-14 Field Ops Lab | TA-14 Academy",
  description: "Private TA-14 Academy field operations game prototype.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
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
      <AnswerLengthIntegrity />
    </>
  );
}
