'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadTranscript, deleteTranscriptAction } from './actions'; // Import deleteTranscriptAction
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { Transcript } from '@/lib/db/schema';
import { Trash2, Eye } from 'lucide-react'; // Import Trash2 icon, Eye for View Details
import Link from 'next/link'; // Import Link for navigation
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'; // Import AlertDialog components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TranscriptViewerModal } from './transcript-viewer-modal';
import { TranscriptQnASection } from './transcript-qna-section'; // Added import

interface TranscriptSectionProps {
  dealName: string;
  dealId: string;
  initialTranscripts: Transcript[];
}

export function TranscriptSection({ dealName, dealId, initialTranscripts }: TranscriptSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [callDate, setCallDate] = useState('');
  const [callTime, setCallTime] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // State for delete transcript functionality
  const [transcriptToDelete, setTranscriptToDelete] = useState<Transcript | null>(null);
  const [isDeleteTranscriptModalOpen, setIsDeleteTranscriptModalOpen] = useState(false);
  const [isDeletingTranscript, setIsDeletingTranscript] = useState(false); // Loading state for transcript deletion

  const handleViewTranscript = (transcript: Transcript) => {
    setSelectedTranscript(transcript);
    setIsViewerOpen(true);
  };

  const handleOpenDeleteTranscriptModal = (transcript: Transcript) => {
    setTranscriptToDelete(transcript);
    setIsDeleteTranscriptModalOpen(true);
  };

  const handleConfirmDeleteTranscript = async () => {
    if (!transcriptToDelete) return;

    setIsDeletingTranscript(true);
    try {
      const result = await deleteTranscriptAction(transcriptToDelete.id, dealId);
      if (result.success) {
        toast.success(result.message || 'Transcript deleted successfully.');
        router.refresh(); // Re-fetches data and re-renders the component
      } else {
        toast.error(result.error || 'Failed to delete transcript.');
      }
    } catch (error) {
      console.error('Failed to delete transcript:', error);
      toast.error('An unexpected error occurred while trying to delete the transcript.');
    } finally {
      setIsDeletingTranscript(false);
      setIsDeleteTranscriptModalOpen(false);
      setTranscriptToDelete(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'text/plain' || file.name.endsWith('.vtt'))) {
      setSelectedFile(file);
    } else {
      toast.error('Please select a .txt or .vtt file');
      e.target.value = '';
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !callDate || !callTime) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('dealId', dealId);
      formData.append('file', selectedFile);
      formData.append('callDate', callDate);
      formData.append('callTime', callTime);

      const result = await uploadTranscript(formData);
      
      if (result.success) {
        toast.success('Transcript uploaded successfully');
        setIsModalOpen(false);
        setSelectedFile(null);
        setCallDate('');
        setCallTime('');
        router.refresh(); // Refresh to show the new transcript
      } else {
        toast.error(result.error || 'Failed to upload transcript');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload transcript');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Transcripts for {dealName}</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>+ Upload Transcript</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Transcript</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="transcript-file">Transcript File</Label>
                <Input
                  id="transcript-file"
                  type="file"
                  accept=".txt,.vtt"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Accepts .txt and .vtt files
                </p>
              </div>
              
              <div>
                <Label htmlFor="call-date">Call Date</Label>
                <Input
                  id="call-date"
                  type="date"
                  value={callDate}
                  onChange={(e) => setCallDate(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="call-time">Call Time</Label>
                <Input
                  id="call-time"
                  type="time"
                  value={callTime}
                  onChange={(e) => setCallTime(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload Transcript'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {initialTranscripts && initialTranscripts.length > 0 ? (
        <div className="space-y-4">
          {initialTranscripts.map((transcript) => (
            <Card key={transcript.id}>
              <CardHeader>
                <CardTitle>{transcript.fileName}</CardTitle>
                <CardDescription>
                  Call Date: {new Date(transcript.callDate).toLocaleDateString()} at {transcript.callTime}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end space-x-2">
                {/* <Button variant="outline" size="sm" onClick={() => handleViewTranscript(transcript)}>
                  View Transcript (Modal) 
                </Button> */}
                <Link href={`/deals/${dealId}/transcripts/${transcript.id}`} passHref>
                  <Button variant="outline" size="sm" asChild>
                    <span><Eye className="mr-2 h-4 w-4" /> View Details</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleOpenDeleteTranscriptModal(transcript)}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive/50 hover:border-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete Transcript</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            No transcripts uploaded for this deal yet.
          </p>
        </div>
      )}

      {/* AI Q&A Section */}
      <TranscriptQnASection initialTranscripts={initialTranscripts} dealId={dealId} />

      <TranscriptViewerModal
        isOpen={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        transcript={selectedTranscript}
      />

      {transcriptToDelete && (
        <AlertDialog open={isDeleteTranscriptModalOpen} onOpenChange={setIsDeleteTranscriptModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this transcript?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the transcript 
                "{transcriptToDelete.fileName}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingTranscript} onClick={() => {
                setIsDeleteTranscriptModalOpen(false);
                setTranscriptToDelete(null);
              }}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmDeleteTranscript} 
                disabled={isDeletingTranscript}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isDeletingTranscript ? 'Deleting...' : 'Confirm Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
