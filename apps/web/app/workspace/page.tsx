import { redirect } from 'next/navigation';

const DEFAULT_WORKSPACE_ROUTE = '/workspace/ai-governance';

export default function WorkspacePage() {
  redirect(DEFAULT_WORKSPACE_ROUTE);
}
