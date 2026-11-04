import type { Metadata } from "next";

const title = "TA14 Admissible Standing Architecture (ASA) · TA-14-AIGR-000047";
const description =
  "Who may legitimately invoke the authority? Explore TA14 Admissible Standing Architecture v1.0-RC1: Actor, Capacity, Standing Basis, Authority Relationship, the Admissible Standing Record, and the boundary between established standing and authorized execution.";
const url = "https://www.ta14exchange.com/governance-showcase/TA-14-AIGR-000047";
const image = "https://www.ta14exchange.com/TA14%20Admissible%20Standing%20Architecture%20Infographic.png";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: "TA14 Authority Governance Institution",
    type: "website",
    images: [{ url: image, alt: "TA14 Admissible Standing Architecture infographic" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
