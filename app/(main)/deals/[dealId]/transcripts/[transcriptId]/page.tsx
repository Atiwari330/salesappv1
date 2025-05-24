import { notFound, redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';
import { getTranscriptById, getDealById } from '@/lib/db/queries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns'; // For formatting date
import { TranscriptActionItemsClient } from './transcript-action-items-client'; // Import the new client component

interface TranscriptDetailPageProps {
  params: {
    dealId: string;
    transcriptId: string;
  };
}

export default async function TranscriptDetailPage({ params: incomingParams }: TranscriptDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const params = await incomingParams; // Added await
  const { dealId, transcriptId } = params; // Destructure from awaited params

  if (!dealId || !transcriptId) {
    notFound();
  }

  const transcript = await getTranscriptById({ id: transcriptId });

  if (!transcript) {
    notFound();
  }

  // Authorization: Check if the transcript belongs to the dealId in the URL
  // and if the user owns that deal.
  if (transcript.dealId !== dealId) {
    console.warn(`Transcript ${transcriptId} does not belong to deal ${dealId}.`);
    notFound(); // Or redirect to an error page / show an error message
  }

  const deal = await getDealById({ id: dealId });
  if (!deal || deal.userId !== session.user.id) {
    console.warn(`User ${session.user.id} does not own deal ${dealId}.`);
    notFound(); // Or redirect to an error page / show an error message
  }
  
  // Attempt to parse callDate for formatting. If it's already a Date object, this is fine.
  // If it's a string, new Date() will attempt to parse it.
  let formattedCallDate = transcript.callDate;
  try {
    // Assuming callDate is YYYY-MM-DD and callTime is HH:MM
    // We might need a more robust parsing if formats vary
    const dateStr = `${transcript.callDate}T${transcript.callTime}:00`;
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      formattedCallDate = format(parsedDate, 'MMMM d, yyyy HH:mm');
    } else {
      // Fallback if parsing fails, use original strings
      formattedCallDate = `${transcript.callDate} at ${transcript.callTime}`;
    }
  } catch (e) {
    console.error("Error formatting date for transcript:", e);
    formattedCallDate = `${transcript.callDate} at ${transcript.callTime}`; // Fallback
  }


  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{transcript.fileName}</CardTitle>
          <CardDescription>
            Call Date: {formattedCallDate} <br />
            Associated Deal: {deal.name} (ID: {dealId})
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Transcript Content:</h3>
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap bg-muted p-4 rounded-md">
            {transcript.content}
          </div>
        </CardContent>
      </Card>

      {/* Action Items Section for this Transcript */}
      <TranscriptActionItemsClient transcriptId={transcriptId} dealId={dealId} />

       {/* Placeholder for Q&A Section (Future) */}
       {/* 
        <div className="mt-6 p-4 border rounded-md bg-background shadow">
         <h2 className="text-xl font-semibold mb-3">Q&A for this Transcript</h2>
         <p className="text-muted-foreground">
           (Q&A specific to this transcript will be displayed here - Future Implementation)
         </p>
       </div>
       */}
    </div>
  );
}
