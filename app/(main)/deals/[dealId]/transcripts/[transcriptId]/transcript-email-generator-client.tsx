'use client';

import React from 'react'; // Removed useState as it's handled by the hook for main states
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { draftFollowUpEmailAction } from '../../actions';
import { useDealAIInteraction } from '@/lib/hooks/useDealAIInteraction'; // Import the hook

interface TranscriptEmailGeneratorClientProps {
  transcriptId: string;
}

// Define request and response types for this action
interface EmailRequestData {
  transcriptId: string;
}

interface EmailResponsePayload {
  emailText: string; // Assuming draftFollowUpEmailAction returns { success: boolean, emailText?: string, error?: string }
}

export function TranscriptEmailGeneratorClient({ transcriptId }: TranscriptEmailGeneratorClientProps) {
  const {
    data: emailData, // Contains { emailText: string } on success
    isLoading,
    error,
    execute: executeGenerateEmail,
    // reset, // Not explicitly used, but available
  } = useDealAIInteraction<EmailRequestData, EmailResponsePayload>({
    action: async (params) => {
      // Adapt draftFollowUpEmailAction which takes transcriptId directly
      const result = await draftFollowUpEmailAction(params.transcriptId);
      // Ensure the response fits ServerActionResponse structure for the hook
      if (result.success && result.emailText !== undefined) {
        return { success: true, data: { emailText: result.emailText } };
      }
      return { success: false, error: result.error };
    },
    successMessage: 'Email drafted successfully!',
    // onError and onSuccess can be added here if specific side-effects are needed
  });

  const handleGenerateEmail = () => {
    executeGenerateEmail({ transcriptId });
  };

  const handleCopyToClipboard = async () => {
    if (emailData?.emailText) {
      try {
        await navigator.clipboard.writeText(emailData.emailText);
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
          {emailData?.emailText && !isLoading && !error && (
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

        {emailData?.emailText && !isLoading && !error && (
          <Textarea
            readOnly
            value={emailData.emailText}
            placeholder="Generated email will appear here."
            rows={10}
            className="mt-2"
          />
        )}
      </CardContent>
    </Card>
  );
}
