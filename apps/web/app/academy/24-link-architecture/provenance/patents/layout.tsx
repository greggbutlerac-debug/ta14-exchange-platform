import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "TA-14 Patent Portfolio | TA-14 Academy",
  description:
    "Explore the TA-14 patent-position portfolio, eight documented patent families, application records, and bounded relationships to the canonical 24-Link Admissible Execution Architecture.",
  openGraph: {
    title: "TA-14 Patent Portfolio",
    description:
      "Eight patent families and their bounded architectural relationships across the TA-14 24-Link Admissible Execution Architecture.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TA14PatentProvenanceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
