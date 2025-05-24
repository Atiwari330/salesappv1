'use client';

import { useState } from 'react'; // Corrected import for loading state
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Transcript } from '@/lib/db/schema';
import { draftFollowUpEmailAction } from './actions'; // Added for server action
import { toast } from '@/components/toast'; // Added for TDE-07

interface TranscriptViewerModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  transcript: Transcript | null;
}

export function TranscriptViewerModal({
  isOpen,
  onOpenChange,
  transcript,
}: TranscriptViewerModalProps) {
  const [isDrafting, setIsDrafting] = useState(false); // For TDE-05
  const [draftedEmail, setDraftedEmail] = useState<string | null>(null); // For TDE-06
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false); // For TDE-06
  const [error, setError] = useState<string | null>(null); // For TDE-08

  if (!transcript) {
    return null;
  }

  const handleCopyToClipboard = async () => {
    if (draftedEmail) {
      try {
        await navigator.clipboard.writeText(draftedEmail);
        toast({ type: 'success', description: 'Email copied to clipboard!' });
      } catch (err) {
        console.error('Failed to copy email:', err);
        toast({ type: 'error', description: 'Failed to copy email.' });
      }
    }
  };

  const handleDraftEmail = async () => {
    if (!transcript) return;

    setIsDrafting(true);
    setError(null); // Reset error before new attempt - for TDE-08

    console.log(`Initiating email draft for transcript ID: ${transcript.id}`);
    
    try {
      const result = await draftFollowUpEmailAction(transcript.id);
      setIsDrafting(false); // Reset drafting state after action completes

      if (result.success && result.emailText) {
        console.log('Drafted Email:', result.emailText);
        setDraftedEmail(result.emailText); // For TDE-06
        setIsEmailModalOpen(true); // Open new modal for TDE-06
      } else {
        const errorMessage = result.error || 'Failed to draft email.';
        console.error('Failed to draft email:', errorMessage);
        setError(errorMessage); // For TDE-08
        toast({ type: 'error', description: `Failed to draft email: ${errorMessage}` }); // For TDE-08
      }
    } catch (e) {
      setIsDrafting(false); // Ensure drafting state is reset on unexpected error
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      console.error('An unexpected error occurred:', errorMessage);
      setError(errorMessage); // For TDE-08
      toast({ type: 'error', description: errorMessage }); // For TDE-08
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{transcript.fileName}</DialogTitle>
          <DialogDescription>
            Call Date: {new Date(transcript.callDate).toLocaleDateString()} at {transcript.callTime}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-6 py-4 my-4 border-t border-b">
          <pre className="whitespace-pre-wrap text-sm">
            {transcript.content}
          </pre>
        </div>
        <DialogFooter className="gap-2 sm:justify-between">
          {/* Button for TDE-01 */}
          <Button 
            type="button" 
            onClick={handleDraftEmail}
            disabled={isDrafting} // For TDE-05
          >
            {isDrafting ? 'Drafting...' : 'Draft Follow-up Email'} {/* For TDE-05 */}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* New Modal for Displaying Drafted Email (TDE-06) */}
    <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Drafted Follow-up Email</DialogTitle>
          <DialogDescription>
            Review the AI-generated email draft below. You can copy it to your clipboard.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-6 py-4 my-4 border-t border-b">
          <pre className="whitespace-pre-wrap text-sm">
            {draftedEmail || 'No email content generated.'}
          </pre>
        </div>
        <DialogFooter className="gap-2 sm:justify-between">
          <Button 
            type="button" 
            onClick={handleCopyToClipboard}
            disabled={!draftedEmail}
          >
            Copy to Clipboard
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsEmailModalOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
