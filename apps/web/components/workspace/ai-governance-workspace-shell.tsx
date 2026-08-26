import Link from 'next/link';
import type { ReactNode } from 'react';

type AiGovernanceWorkspaceShellProps = {
  children: ReactNode;
  className?: string;
  showRegistryMissionControl?: boolean;
};

export function AiGovernanceWorkspaceShell({
  children,
  className = '',
  showRegistryMissionControl = true,
}: AiGovernanceWorkspaceShellProps) {
  return (
    <div className={['ta14-ai-governance-workspace-shell', className].filter(Boolean).join(' ')}>
      {showRegistryMissionControl ? (
        <div className="ta14-ai-governance-workspace-shell__registry">
          <Link href="/workspace/mission-control/governance-registry" className="ta14-registry-watch-link">
            <span><strong>Governance Registry Watch</strong><small>Incomplete · submitted · held · review · issued · last 24h</small></span>
            <b>Mission Control →</b>
          </Link>
        </div>
      ) : null}
      <div className="ta14-ai-governance-workspace-shell__content">{children}</div>
      <style>{`
        .ta14-ai-governance-workspace-shell{position:relative;display:grid;width:100%;gap:18px}.ta14-ai-governance-workspace-shell__registry{position:relative;z-index:3;width:100%}.ta14-ai-governance-workspace-shell__content{position:relative;z-index:1;min-width:0;width:100%}.ta14-registry-watch-link{display:flex;align-items:center;justify-content:space-between;gap:18px;width:100%;box-sizing:border-box;border:1px solid rgba(114,223,255,.22);border-radius:14px;padding:12px 15px;background:rgba(114,223,255,.045);color:inherit;text-decoration:none}.ta14-registry-watch-link span{display:grid;gap:3px}.ta14-registry-watch-link strong{font-size:11px;letter-spacing:.08em;text-transform:uppercase}.ta14-registry-watch-link small{color:rgba(220,233,247,.58);font-size:10px}.ta14-registry-watch-link b{color:#72dfff;font-size:11px;white-space:nowrap}@media(max-width:760px){.ta14-ai-governance-workspace-shell{gap:14px}.ta14-registry-watch-link{align-items:flex-start;flex-direction:column}.ta14-registry-watch-link b{white-space:normal}}
      `}</style>
    </div>
  );
}
