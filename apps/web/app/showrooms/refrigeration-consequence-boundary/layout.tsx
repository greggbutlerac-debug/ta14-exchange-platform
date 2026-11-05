import type { ReactNode } from 'react';

// Issue #684: owner-authorized unlisted public teaching showroom.
// Keep this route out of the public showroom registry and sitemap.
// Page metadata independently sets robots noindex/nofollow.
export default function RefrigerationConsequenceBoundaryLayout({ children }: { children: ReactNode }) {
  return children;
}
