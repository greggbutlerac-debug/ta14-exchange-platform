import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Founding Demonstration Methodology & Independence Standard | TA-14",
  description:
    "The public operating standard governing TA-14 Founding Demonstrations: registration, claim bounding, evidence integrity, admission, review, findings, corrections, verification, closure, preservation, and assessor independence.",
  alternates: {
    canonical: "/artifacts/founding-demonstrations/methodology",
  },
  openGraph: {
    title: "TA-14 Founding Demonstration Methodology & Independence Standard",
    description:
      "A public evidence-first, independence-first operating standard for bounded TA-14 Founding Demonstrations.",
    url: "/artifacts/founding-demonstrations/methodology",
    siteName: "TA-14 Authority Governance Institution",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "TA-14 Founding Demonstration Methodology & Independence Standard",
    description:
      "Register first. Build independently. Bring the evidence. Let the finding remain bounded.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MethodologyLayout({ children }: { children: ReactNode }) {
  return children;
}
