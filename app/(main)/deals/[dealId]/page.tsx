import { notFound, redirect } from 'next/navigation';
import { getDealById, getTranscriptsByDealId } from '@/lib/db/queries';
import { auth } from '@/app/(auth)/auth';
import { TranscriptSection } from './transcript-section';

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

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Deal Header Section */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">{deal.name}</h1>
        <p className="text-muted-foreground mt-2">
          Created on {new Date(deal.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Transcripts Section */}
      <TranscriptSection dealName={deal.name} dealId={dealId} />
    </div>
  );
}
