import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EPA 608 Refrigerant Ops | TA-14 Academy Private Preview",
  description: "Private TA-14 Academy EPA Section 608 readiness game prototype.",
  robots: { index: false, follow: false, nocache: true },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
