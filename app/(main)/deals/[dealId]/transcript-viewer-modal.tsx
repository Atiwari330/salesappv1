'use client';

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
  if (!transcript) {
    return null;
  }

  return (
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
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
