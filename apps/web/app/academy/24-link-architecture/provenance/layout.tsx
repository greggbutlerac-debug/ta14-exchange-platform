import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "TA-14 Provenance Map | TA-14 Academy",
    template: "%s | TA-14 Provenance",
  },
  description:
    "Explore the public chronology, patent-position records, publications, artifacts, reviews, and bounded source relationships behind the TA-14 24-Link Admissible Execution Architecture.",
  openGraph: {
    title: "TA-14 Provenance Map",
    description:
      "The public provenance layer for the TA-14 24-Link Admissible Execution Architecture, including chronology, patent-position records, publications, artifacts, and reviews.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TA14ProvenanceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
