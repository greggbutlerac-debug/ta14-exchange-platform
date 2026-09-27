import type { ReactNode } from "react";

import { requireUser } from "../../../../lib/auth/require-user";

export const metadata = {
  title: "NIRET Gate A | TA-14 Academy HVACD/R",
  robots: { index: false, follow: false },
};

/** The governed technician workflow requires an authenticated account. */
export default async function NiretLayout({ children }: { children: ReactNode }) {
  await requireUser();
  return children;
}
