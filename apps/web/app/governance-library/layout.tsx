import type { ReactNode } from "react";

import { GovernanceLibraryNavigation } from "../../components/governance-library/GovernanceLibraryNavigation";

type GovernanceLibraryLayoutProps = {
  children: ReactNode;
};

export default function GovernanceLibraryLayout({
  children,
}: GovernanceLibraryLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/10 bg-[#070b19] px-5 py-8 lg:block">
          <div className="sticky top-6">
            <GovernanceLibraryNavigation />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="border-b border-white/10 bg-[#070b19] px-5 py-4 lg:hidden">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-white">
                <span>AI Governance Library Navigation</span>
                <span className="text-slate-400 transition group-open:rotate-180">
                  ↓
                </span>
              </summary>

              <div className="mt-3 rounded-xl border border-white/10 bg-[#050816] p-4">
                <GovernanceLibraryNavigation />
              </div>
            </details>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
