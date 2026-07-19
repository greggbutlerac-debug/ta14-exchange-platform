import { redirect } from "next/navigation";

import { createClient } from "../supabase/server";

export async function redirectIfAuthenticated(): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/workspace");
  }
}
