"use client";

import { usePathname } from "next/navigation";
import ArtifactCorpusStatus from "./corpus-status";

export default function ArtifactCorpusStatusShell() {
  const pathname = usePathname();
  if (pathname !== "/artifacts") return null;
  return <ArtifactCorpusStatus />;
}
