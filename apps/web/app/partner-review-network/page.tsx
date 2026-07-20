import type { Metadata } from "next";

import PartnerReviewNetworkWorkspacePage from "../workspace/ai-governance/partner-review-network/page";

export const metadata: Metadata = {
  title: "TA-14 Partner Review Network",
  description:
    "Explore the TA-14 Partner Review Network: independent governance architectures, written boundaries, specialized review pathways, and TA-14 second-layer admissible-execution review.",
};

export default function PartnerReviewNetworkPage() {
  return <PartnerReviewNetworkWorkspacePage />;
}
