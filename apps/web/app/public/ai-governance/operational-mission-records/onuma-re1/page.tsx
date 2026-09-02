import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TA14-OMR-000001 | The HOLD That Became Work",
  description:
    "ONUMA / TA-14 RE1 governed building interoperability mission: persistent digital identity survived while present execution standing remained HOLD pending physical verification.",
  alternates: {
    canonical: "https://www.ta14exchange.com/public/ai-governance/operational-mission-records/onuma-re1",
  },
  openGraph: {
    title: "TA14-OMR-000001 | The HOLD That Became Work",
    description:
      "A live governed building interoperability mission showing why digital continuity does not automatically become present execution authority.",
    url: "https://www.ta14exchange.com/public/ai-governance/operational-mission-records/onuma-re1",
    siteName: "TA-14 Authority",
    type: "website",
  },
};

// Public rendering boundary for the published TA-14 / ONUMA founding mission record.
// The canonical record remains authored at the workspace path; this route only
// renders that same artifact outside the authenticated workspace layout.
export { default } from "../../../../workspace/ai-governance/operational-mission-records/onuma-re1/page";
