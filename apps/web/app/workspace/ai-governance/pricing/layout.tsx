import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Governance Workspace Pricing | TA-14",
  description: "Operational workspace pricing and governed checkout for TA-14 AI governance services.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/pricing/ai-governance" },
};

export default function WorkspaceAiGovernancePricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
