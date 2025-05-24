'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { draftFollowUpEmailAction } from '../../actions'; // Corrected path

interface TranscriptEmailGeneratorClientProps {
  transcriptId: string;
}

export function TranscriptEmailGeneratorClient({ transcriptId }: TranscriptEmailGeneratorClientProps) {
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateEmail = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedEmail(null); // Clear previous email
    try {
      const result = await draftFollowUpEmailAction(transcriptId);
      if (result.success && result.emailText) {
        setGeneratedEmail(result.emailText);
        toast.success('Email drafted successfully!');
      } else {
        setError(result.error || 'Failed to generate email.');
        toast.error(result.error || 'Failed to generate email.');
      }
    } catch (e) {
      console.error('Error generating email:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (generatedEmail) {
      try {
        await navigator.clipboard.writeText(generatedEmail);
        toast.success('Email copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy email:', err);
        toast.error('Failed to copy email.');
      }
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Draft Follow-up Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button onClick={handleGenerateEmail} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Email'}
          </Button>
          {generatedEmail && !isLoading && !error && (
            <Button onClick={handleCopyToClipboard} variant="outline">
              Copy Email
            </Button>
          )}
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Generating email...</p>}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {generatedEmail && !isLoading && !error && (
          <Textarea
            readOnly
            value={generatedEmail}
            placeholder="Generated email will appear here."
            rows={10}
            className="mt-2"
          />
        )}
      </CardContent>
    </Card>
  );
}
