import { redirect } from "next/navigation";

type RecordsBridgePageProps = {
  searchParams: Promise<{
    rid?: string | string[];
  }>;
};

export default async function RecordsBridgePage({
  searchParams,
}: RecordsBridgePageProps) {
  const parameters = await searchParams;

  const rawRid = Array.isArray(parameters.rid)
    ? parameters.rid[0]
    : parameters.rid;

  const rid = rawRid?.trim();

  if (rid) {
    redirect(`/records?rid=${encodeURIComponent(rid)}`);
  }

  redirect("/records");
}
