import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "../../../lib/supabase/server";

const DEFAULT_INSTITUTION_EMAILS = new Set([
  "ta14admissibleexecution@gmail.com",
  "greggbutlerac@gmail.com",
]);

function institutionEmails() {
  const configured = (process.env.TA14_MISSION_CONTROL_ADMIN_EMAILS ||
    process.env.NEXT_PUBLIC_TA14_MISSION_CONTROL_ADMIN_EMAILS ||
    "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return new Set([...DEFAULT_INSTITUTION_EMAILS, ...configured]);
}

export default async function MissionControlLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.trim().toLowerCase();
  const authorized = Boolean(email && institutionEmails().has(email));

  if (!authorized) {
    redirect("/workspace/ai-governance/registry/my-records");
  }

  return (
    <>
      <aside
        aria-label="TA-14 constitutional authority"
        style={{
          position: "fixed",
          left: 18,
          top: 150,
          width: 228,
          zIndex: 1000,
          padding: 14,
          border: "1px solid rgba(242,200,101,.36)",
          borderRadius: 16,
          background:
            "linear-gradient(145deg, rgba(20,16,7,.96), rgba(5,14,28,.96))",
          boxShadow: "0 18px 60px rgba(0,0,0,.38)",
          backdropFilter: "blur(16px)",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            color: "#f2c865",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: ".14em",
          }}
        >
          CONSTITUTIONAL AUTHORITY
        </div>
        <strong
          style={{
            display: "block",
            marginTop: 8,
            color: "#f5f8ff",
            fontSize: 14,
            lineHeight: 1.35,
          }}
        >
          TA-14 Institutional Constitution
        </strong>
        <div
          style={{
            marginTop: 5,
            color: "#8ea3ba",
            fontSize: 11,
          }}
        >
          Version 1.0 · Active baseline
        </div>
        <Link
          href="/institution/constitution"
          style={{
            display: "block",
            marginTop: 12,
            padding: "10px 12px",
            borderRadius: 10,
            background: "#f2c865",
            color: "#120d03",
            textAlign: "center",
            textDecoration: "none",
            fontSize: 11,
            fontWeight: 900,
          }}
        >
          Read Constitution →
        </Link>
      </aside>
      {children}
    </>
  );
}
