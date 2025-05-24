import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { getDealsByUserId } from '@/lib/db/queries';
import { DealsClient } from './deals-client';

export default async function DealsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const deals = await getDealsByUserId({ userId: session.user.id });

  return <DealsClient deals={deals} />;
}
