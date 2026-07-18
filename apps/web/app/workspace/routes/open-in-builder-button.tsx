"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { TransferRouteDraft } from "../../../lib/route-draft-transfer";
import { stageRouteForBuilder } from "../../../lib/route-builder-handoff";

type OpenInBuilderButtonProps = {
  route: TransferRouteDraft;
  libraryRouteId?: string | null;
  className?: string;
  children?: ReactNode;
};

export default function OpenInBuilderButton({
  route,
  libraryRouteId = null,
  className,
  children = "Edit in builder →",
}: OpenInBuilderButtonProps) {
  const router = useRouter();

  function openInBuilder() {
    stageRouteForBuilder(route, {
      source: "MY_ROUTES",
      libraryRouteId,
    });

    router.push("/workspace/build");
  }

  return (
    <button
      type="button"
      className={className}
      onClick={openInBuilder}
    >
      {children}
    </button>
  );
}
