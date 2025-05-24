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
import { uploadTranscript } from './actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface TranscriptSectionProps {
  dealName: string;
  dealId: string;
}

export function TranscriptSection({ dealName, dealId }: TranscriptSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [callDate, setCallDate] = useState('');
  const [callTime, setCallTime] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

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
      
      <div className="bg-card border rounded-lg p-6">
        <p className="text-muted-foreground">
          No transcripts uploaded yet. Upload functionality will be available soon.
        </p>
      </div>
    </div>
  );
}
