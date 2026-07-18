"use client";

import { useRouter } from "next/navigation";
import {
  savePendingRouteDraft,
  type TransferRouteDraft,
} from "../../../lib/route-draft-transfer";

type EvaluateRouteLinkProps = {
  route: TransferRouteDraft;
  className?: string;
  children?: React.ReactNode;
};

export default function EvaluateRouteLink({
  route,
  className,
  children,
}: EvaluateRouteLinkProps) {
  const router = useRouter();

  function handleEvaluate() {
    savePendingRouteDraft(route);
    router.push("/workspace/routes/new");
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleEvaluate}
    >
      {children ?? "Evaluate route →"}
    </button>
  );
}
