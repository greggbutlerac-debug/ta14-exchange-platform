import { redirect } from "next/navigation";

/**
 * Canonical Governance Entity Registration entry point.
 *
 * The TA-14 AI Governance Exchange maintains one participant-facing
 * registration workflow: the established 14-step AI Governance Registry
 * intake at /workspace/ai-governance/registry.
 *
 * This route intentionally performs no registration logic of its own.
 * Keeping /governance/register as a stable public entry point preserves
 * existing links while preventing duplicate draft models, parallel intake
 * states, or divergent submission pathways.
 */
export default function GovernanceRegistrationEntryPage() {
  redirect("/workspace/ai-governance/registry");
}
