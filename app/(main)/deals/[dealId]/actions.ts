'use server';

import { auth } from '@/app/(auth)/auth';
import { 
  createTranscript, 
  updateDeal, 
  getDealById, 
  deleteDealById,
  deleteTranscript as deleteTranscriptQuery, // Renamed to avoid conflict
  getTranscriptById
} from '@/lib/db/queries'; 
import { myProvider } from '@/lib/ai/providers'; // Added for LLM
import { generateText } from 'ai'; // Added for LLM
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function uploadTranscript(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  try {
    const dealId = formData.get('dealId') as string;
    const file = formData.get('file') as File;
    const callDate = formData.get('callDate') as string;
    const callTime = formData.get('callTime') as string;

    if (!file || !dealId || !callDate || !callTime) {
      throw new Error('Missing required fields');
    }

    // Validate file type
    if (!file.type.includes('text') && !file.name.endsWith('.vtt')) {
      throw new Error('Please upload a .txt or .vtt file');
    }

    // Read file content
    const content = await file.text();
    
    if (!content.trim()) {
      throw new Error('File appears to be empty');
    }

    // Create transcript record
    const [transcript] = await createTranscript({
      dealId,
      fileName: file.name,
      content,
      callDate,
      callTime,
    });

    return { success: true, transcript };
  } catch (error) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to upload transcript'
    };
  }
}

export async function draftFollowUpEmailAction(transcriptId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    // In a real app, you might redirect or throw a specific auth error
    // For now, returning an error object similar to other actions
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const transcript = await getTranscriptById({ id: transcriptId });

    if (!transcript) {
      return { success: false, error: 'Transcript not found.' };
    }

    if (!transcript.content || transcript.content.trim() === '') {
      return { success: false, error: 'Transcript content is empty.' };
    }
    
    // Verify the user owns the deal associated with this transcript
    const deal = await getDealById({ id: transcript.dealId });
    if (!deal || deal.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized to access this transcript.' };
    }

    const prompt = `
      Role: You are an expert email writer for sales professionals.
      Goal: Draft a concise and actionable follow-up email to keep momentum going with a prospect after a sales call.
      Context: The following is a transcript of the sales call.
      Transcript:
      ---
      ${transcript.content}
      ---
      Instructions:
      - Keep the email brief and to the point.
      - Reference key discussion points or agreements from the transcript.
      - Propose a clear next step.
      - Maintain a professional and friendly tone.
      - Do not include a subject line, only the body of the email.
      - Do not include a generic greeting like "Dear [Prospect Name]," or a sign-off like "Best regards, [Your Name]". Focus solely on the email body content that would go between a greeting and a sign-off.
    `;

    const { text: emailText } = await generateText({
      model: myProvider.languageModel('chat-model'),
      prompt: prompt,
    });

    if (!emailText || emailText.trim() === '') {
      return { success: false, error: 'LLM failed to generate email content.' };
    }

    return { success: true, emailText };

  } catch (error) {
    console.error('Draft follow-up email error:', error);
    if (error instanceof Error && error.message.includes('authentication')) {
      // Handle potential API key errors more specifically if needed
      return { success: false, error: 'LLM authentication failed. Please check API key.' };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to draft follow-up email.',
    };
  }
}

export async function updateDealName(dealId: string, newName: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  if (!newName.trim()) {
    return { success: false, error: 'Deal name cannot be empty.' };
  }
  if (newName.trim().length > 255) {
    return { success: false, error: 'Deal name cannot exceed 255 characters.' };
  }

  try {
    // Optional: Check if the user owns the deal before updating
    const deal = await getDealById({ id: dealId });
    if (!deal || deal.userId !== session.user.id) {
      return { success: false, error: 'Deal not found or unauthorized.' };
    }

    const updatedDeals = await updateDeal({ id: dealId, name: newName.trim() }); // Changed to use updateDeal
    
    if (updatedDeals.length === 0) {
      return { success: false, error: 'Failed to update deal name in database.' };
    }

    revalidatePath(`/deals/${dealId}`);
    revalidatePath('/deals'); // Also revalidate the list page if names are shown there

    return { success: true, updatedDeal: updatedDeals[0] };
  } catch (error) {
    console.error('Update deal name error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update deal name',
    };
  }
}

export async function deleteDeal(dealId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    // Not strictly necessary to return an error object here if redirecting,
    // but can be useful if called from a context that handles the return value.
    // redirect('/login'); 
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Verify user owns the deal before deleting
    const deal = await getDealById({ id: dealId });
    if (!deal || deal.userId !== session.user.id) {
      return { success: false, error: 'Deal not found or you do not have permission to delete it.' };
    }

    await deleteDealById({ dealId, userId: session.user.id }); // Assuming deleteDealById handles transcript deletion

    revalidatePath('/deals');
    revalidatePath(`/deals/${dealId}`); // Revalidate the specific deal page, though it will be gone

    // Redirect happens after revalidation
    // No need to return a success object if redirecting immediately.
    // However, for testing or if the client handles redirect differently, it might be useful.
  } catch (error) {
    console.error('Delete deal error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete deal',
    };
  }

  // If try block completes without error, redirect.
  // This ensures redirect only happens on successful deletion and revalidation.
  redirect('/deals'); 
  // Note: redirect() throws an error, so code after it won't execute.
  // For clarity, you might return a success object if not redirecting,
  // but since redirect is the goal, this is fine.
}

export async function deleteTranscriptAction(transcriptId: string, dealId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Optional: Verify user owns the deal associated with the transcript
    const transcript = await getTranscriptById({ id: transcriptId });
    if (!transcript) {
      return { success: false, error: 'Transcript not found.' };
    }
    if (transcript.dealId !== dealId) {
      // This is an integrity check, should not happen if UI passes correct dealId
      return { success: false, error: 'Transcript does not belong to the specified deal.'};
    }

    const deal = await getDealById({ id: dealId });
    if (!deal || deal.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized to delete transcript for this deal.' };
    }

    await deleteTranscriptQuery({ id: transcriptId });

    revalidatePath(`/deals/${dealId}`); // Revalidate the deal detail page
    revalidatePath('/deals'); // Revalidate the deals list page (for transcript counts)

    return { success: true, message: 'Transcript deleted successfully.' };
  } catch (error) {
    console.error('Delete transcript error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete transcript',
    };
  }
}

/**
 * Server action to answer a user's question based on combined transcript content.
 * @param allTranscriptsContent - A single string containing all formatted transcript texts.
 * @param userQuestion - The user's question about the transcripts.
 * @returns An object with `success: true` and the `answer`, or `success: false` and an `error` message.
 */
export async function answerTranscriptQuestionAction(
  allTranscriptsContent: string,
  userQuestion: string
): Promise<{ success: boolean; answer?: string; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  if (!allTranscriptsContent.trim() || !userQuestion.trim()) {
    return { success: false, error: 'Transcript content and question cannot be empty.' };
  }

  const prompt = `
You are an AI assistant. Your task is to answer the following question based *solely* on the provided "Transcript Context" below.
Do not use any external knowledge or make assumptions beyond what is explicitly stated in the transcripts.
If the answer cannot be found in the provided transcripts, you MUST respond with: "The answer cannot be found in the provided transcripts."

Transcript Context:
---
${allTranscriptsContent}
---

User Question: ${userQuestion}
  `;

  try {
    const { text: answer } = await generateText({
      model: myProvider.languageModel('chat-model'),
      prompt: prompt,
    });

    if (!answer || answer.trim() === '') {
      return { success: false, error: 'The AI failed to generate an answer. Please try again.' };
    }

    return { success: true, answer: answer.trim() };
  } catch (error) {
    console.error('Error in answerTranscriptQuestionAction LLM call:', error);
    // Check for specific error types if needed, e.g., API key issues
    if (error instanceof Error && error.message.includes('authentication')) {
      return { success: false, error: 'LLM authentication failed. Please check your API key configuration.' };
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred while trying to get an answer.' 
    };
  }
}
