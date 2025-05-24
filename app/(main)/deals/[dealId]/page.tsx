import { notFound, redirect } from 'next/navigation';
import { getDealById, getTranscriptsByDealId } from '@/lib/db/queries';
import { auth } from '@/app/(auth)/auth';
import { TranscriptSection } from './transcript-section';
import { DealHeaderClient } from './deal-header-client';
import { DealContactsSection } from './deal-contacts-section'; // Added import

interface DealDetailPageProps {
  params: Promise<{ dealId: string }>;
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { dealId } = await params;
  const deal = await getDealById({ id: dealId });

  if (!deal) {
    notFound();
  }

  // Ensure the deal belongs to the current user
  if (deal.userId !== session.user.id) {
    notFound();
  }

  const transcripts = await getTranscriptsByDealId({ dealId });

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Deal Header Section */}
      <DealHeaderClient initialDeal={deal} />

      {/* Transcripts Section */}
      <TranscriptSection dealName={deal.name} dealId={dealId} initialTranscripts={transcripts} />

      {/* Contacts Section */}
      <DealContactsSection dealId={deal.id} />
    </div>
  );
}
