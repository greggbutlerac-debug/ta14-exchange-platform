import { redirect } from "next/navigation";

export default function LegacyGovernanceDirectoryRedirect() {
  redirect("/registry");
}
