'use server';

import { auth } from '@/app/(auth)/auth';
import { createDeal as createDealQuery } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export async function createDeal(name: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const [deal] = await createDealQuery({
    name,
    userId: session.user.id,
  });

  return deal;
}
