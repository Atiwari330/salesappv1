'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transcript } from '@/lib/db/schema';
import { answerTranscriptQuestionAction } from './actions';
import { useDealAIInteraction } from '@/lib/hooks/useDealAIInteraction'; // Import the hook
import { toast } from 'sonner';

interface TranscriptQnASectionProps {
  initialTranscripts: Transcript[]; // This can still be used for the initial guard message
  dealId: string;
}

// Define the request and response types for this specific action
interface AnswerRequestData {
  dealId: string;
  question: string;
}

interface AnswerResponsePayload {
  answer: string; // Assuming answerTranscriptQuestionAction returns { success: boolean, answer?: string, error?: string }
}


export function TranscriptQnASection({ initialTranscripts, dealId }: TranscriptQnASectionProps) {
  const [question, setQuestion] = useState('');

  const {
    data: answerData, // Contains { answer: string } on success
    isLoading,
    error,
    execute: executeAskQuestion,
    // reset, // Not explicitly used in this component's current logic, but available
  } = useDealAIInteraction<AnswerRequestData, AnswerResponsePayload>({
    action: async (params) => {
      // The hook expects an action that takes a single requestData object.
      // answerTranscriptQuestionAction takes (dealId, question)
      // So we adapt it here.
      const result = await answerTranscriptQuestionAction(params.dealId, params.question);
      // The hook expects ServerActionResponse structure, so we ensure 'data' field is present on success
      if (result.success && result.answer !== undefined) {
        return { success: true, data: { answer: result.answer } };
      }
      return { success: false, error: result.error };
    },
    successMessage: 'Answer received!',
    // onError and onSuccess can be added here if specific side-effects are needed beyond toast
  });

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question.');
      return;
    }

    // Client-side guard for no transcripts can remain
    if (!initialTranscripts || initialTranscripts.length === 0) {
      toast.error('No transcripts available for this deal to ask questions about.');
      // The hook will set its own error state if the action fails,
      // but this is a quick client-side feedback before calling the action.
      // To be consistent, we might let the hook handle all errors,
      // or set a local error for this specific pre-condition.
      // For now, let's rely on the toast and not set the hook's error for this.
      return;
    }
    
    executeAskQuestion({ dealId, question });
  };

  if (!initialTranscripts || initialTranscripts.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Upload transcripts to ask questions about them.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Ask About Transcripts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`transcript-qna-input-${dealId}`}>Ask a question about these transcripts...</Label>
          <Input
            id={`transcript-qna-input-${dealId}`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="E.g., What were the main concerns raised by the client?"
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleAskQuestion} disabled={isLoading || !question.trim()}>
          {isLoading ? 'Asking...' : 'Ask Question'}
        </Button>

        {isLoading && (
          <div className="pt-4">
            <p className="text-muted-foreground">Thinking...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="pt-4 text-destructive">
            <p>Error: {error}</p>
          </div>
        )}

        {answerData?.answer && !isLoading && !error && (
          <div className="pt-4 space-y-2">
            <h3 className="font-semibold">Answer:</h3>
            <div className="prose dark:prose-invert max-w-none p-3 bg-muted rounded-md whitespace-pre-wrap">
              {answerData.answer}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
