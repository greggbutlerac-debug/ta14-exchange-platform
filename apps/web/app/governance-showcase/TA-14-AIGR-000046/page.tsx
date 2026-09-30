import type { Metadata } from "next";

import HrosShowroom from "./hros-showroom";

export const metadata: Metadata = {
  title: "HROS v3.3 · Registered Governance Showroom | TA-14 Exchange",
  description:
    "Interactive registered-governance showroom for the Human Router Protocol Operating System (HROS) v3.3, TA-14-AIGR-000046. Declared architecture, preserved evidence and registration boundaries. Registration is not certification.",
};

export default function HrosGovernanceShowroomPage() {
  return <HrosShowroom />;
}
