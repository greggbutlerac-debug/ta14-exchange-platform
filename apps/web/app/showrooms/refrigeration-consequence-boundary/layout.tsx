import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { examinationAccess } from './access';

// Owner-gated pending publication approval (see access.ts).
export const dynamic = 'force-dynamic';

export default async function RefrigerationConsequenceBoundaryOwnerLayout({ children }: { children: ReactNode }) {
  if (!(await examinationAccess()).allowed) notFound();
  return children;
}
