'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transcript } from '@/lib/db/schema';
import { answerTranscriptQuestionAction } from './actions'; // Will be used in the next step
import { toast } from 'sonner'; // Will be used for error handling

interface TranscriptQnASectionProps {
  initialTranscripts: Transcript[];
  dealId: string; // Added dealId for potential future use, though not strictly needed for current plan
}

export function TranscriptQnASection({ initialTranscripts, dealId }: TranscriptQnASectionProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question.');
      return;
    }

    setIsLoading(true);
    setAnswer(null);
    setError(null);

    try {
      // Context preparation is now handled by the server action via getDealAIContext
      // The client only needs to pass the dealId and the question.
      
      // Ensure initialTranscripts are available if we still want a client-side check,
      // though the server action will now fetch them.
      // For this refactoring, the primary check for "no content" will effectively
      // be handled by the server action if getDealAIContext returns null or empty transcripts.
      if (!initialTranscripts || initialTranscripts.length === 0) {
        // This check can remain as a quick client-side guard,
        // though the server action is the source of truth for context.
        toast.error('No transcripts available for this deal to ask questions about.');
        setError('No transcripts available for this deal.');
        setIsLoading(false);
        return;
      }

      const result = await answerTranscriptQuestionAction(dealId, question);

      if (result.success && result.answer) {
        setAnswer(result.answer);
        // setQuestion(''); // Optionally clear the question input
      } else {
        const errorMessage = result.error || 'An unexpected error occurred.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (e) {
      console.error('Failed to ask question:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
            {/* Consider adding a skeleton loader here for better UX */}
          </div>
        )}

        {error && !isLoading && (
          <div className="pt-4 text-destructive">
            <p>Error: {error}</p>
          </div>
        )}

        {answer && !isLoading && !error && (
          <div className="pt-4 space-y-2">
            <h3 className="font-semibold">Answer:</h3>
            <div className="prose dark:prose-invert max-w-none p-3 bg-muted rounded-md whitespace-pre-wrap">
              {answer}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
