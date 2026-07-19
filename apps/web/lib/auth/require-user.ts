import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createClient } from "../supabase/server";

export async function requireUser(): Promise<User> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?error=Sign+in+to+enter+your+governed+workspace.");
  }

  return user;
}
