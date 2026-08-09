import type { ReactNode } from 'react';

import { RegistryMissionControlDock } from '@/components/workspace/registry-mission-control-dock';

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
    <div
      className={[
        'ta14-ai-governance-workspace-shell',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {showRegistryMissionControl ? (
        <div className="ta14-ai-governance-workspace-shell__registry">
          <RegistryMissionControlDock />
        </div>
      ) : null}

      <div className="ta14-ai-governance-workspace-shell__content">
        {children}
      </div>

      <style>{`
        .ta14-ai-governance-workspace-shell {
          position: relative;
          display: grid;
          width: 100%;
          gap: 18px;
        }

        .ta14-ai-governance-workspace-shell__registry {
          position: relative;
          z-index: 3;
          width: 100%;
        }

        .ta14-ai-governance-workspace-shell__content {
          position: relative;
          z-index: 1;
          min-width: 0;
          width: 100%;
        }

        @media (max-width: 760px) {
          .ta14-ai-governance-workspace-shell {
            gap: 14px;
          }
        }
      `}</style>
    </div>
  );
}
