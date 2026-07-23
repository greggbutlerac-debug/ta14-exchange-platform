import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Complete TA-14 Public Corpus",
    template: "%s | Complete TA-14 Public Corpus",
  },
  description:
    "Search the complete TA-14 public record across books, articles, DOI records, patent filings, standards, repositories, public sites, implementations, and chronology.",
  keywords: [
    "TA-14",
    "TA-14 AI Governance Exchange",
    "TA-14 Public Corpus",
    "AI governance",
    "Environmental Integrity Governance",
    "Atmospheric Integrity Records",
    "Admissible Execution Architecture",
    "public record",
    "governance registry",
    "governed records",
  ],
  alternates: {
    canonical: "/foundation/public-corpus",
  },
  openGraph: {
    type: "website",
    title: "Complete TA-14 Public Corpus",
    description:
      "A searchable, attributable, and bounded public record of TA-14 books, articles, DOI records, patent filings, standards, repositories, implementations, and chronology.",
    url: "/foundation/public-corpus",
    siteName: "TA-14 AI Governance Exchange",
  },
  twitter: {
    card: "summary_large_image",
    title: "Complete TA-14 Public Corpus",
    description:
      "Search the attributable public record behind TA-14 governance architecture, publications, repositories, filings, and implementations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

type PublicCorpusLayoutProps = {
  children: ReactNode;
};

export default function PublicCorpusLayout({
  children,
}: PublicCorpusLayoutProps) {
  return children;
}
