import { redirect } from "next/navigation";

export default function LegacyGovernanceProfileRedirect() {
  redirect("/registry");
}
