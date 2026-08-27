import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function EnvironmentalEvidenceGatewayOwnerLayout({ children }: { children: ReactNode }) {
  const ownerId = process.env.TA14_REVENUE_OWNER_USER_ID?.trim();
  if (!ownerId) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== ownerId) notFound();

  return children;
}
