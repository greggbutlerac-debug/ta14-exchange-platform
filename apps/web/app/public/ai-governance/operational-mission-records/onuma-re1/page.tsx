import type { Metadata } from "next";

const title = "TA14-OMR-000001 | The HOLD That Became Work";
const description =
  "ONUMA / TA-14 RE1 governed building interoperability mission: persistent digital identity survived while present execution standing remained HOLD pending physical verification.";
const socialDescription =
  "A live governed building interoperability mission showing why digital continuity does not automatically become present execution authority.";
const canonical = "https://www.ta14exchange.com/public/ai-governance/operational-mission-records/onuma-re1";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: {
    title,
    description: socialDescription,
    url: canonical,
    siteName: "TA-14 Authority",
    type: "website",
    images: ["https://www.ta14exchange.com/ta14-social-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: socialDescription,
    images: ["https://www.ta14exchange.com/ta14-social-preview.png"],
  },
};

// Public rendering boundary for the published TA-14 / ONUMA founding mission record.
// The canonical record remains authored at the workspace path; this route only
// renders that same artifact outside the authenticated workspace layout.
export { default } from "../../../../workspace/ai-governance/operational-mission-records/onuma-re1/page";
