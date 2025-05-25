'use server';

import { auth } from '@/app/(auth)/auth';
import {
  createTranscript,
  updateDeal,
  getDealById,
  deleteDealById,
  deleteTranscript as deleteTranscriptQuery, // Renamed to avoid conflict
  getTranscriptById,
  createActionItem, // Added for Action Items
  updateActionItem, // Added for Action Items
  deleteActionItem, // Added for Action Items
  getTranscriptsByDealId, // Added for scanning transcripts
  createMultipleActionItems, // Added for scanning transcripts
  getActionItemById, // Added for deleting action items
  getActionItemsByDealId, // Added for fetching action items
  getActionItemsByTranscriptId // Added for transcript-specific items
} from '@/lib/db/queries';
import type { ActionItem, Transcript } from '@/lib/db/schema'; // Import ActionItem & Transcript types from schema
// Story 2.2.3: Ensure formatDealContextForLLM is imported
import { getDealAIContext, formatDealContextForLLM } from '@/lib/ai/deal_context_builder';
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

// Action Item Server Actions

export async function getActionItemsForTranscriptAction(
  transcriptId: string,
): Promise<{ success: boolean; items?: ActionItem[]; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  if (!transcriptId) {
    return { success: false, error: 'Transcript ID is required.' };
  }

  try {
    // getActionItemsByTranscriptId in queries.ts handles user authorization
    // by checking if the user owns the deal associated with the transcript.
    const items = await getActionItemsByTranscriptId({ transcriptId, userId: session.user.id });
    return { success: true, items };
  } catch (error) {
    console.error('Error in getActionItemsForTranscriptAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch action items for transcript.',
    };
  }
}

export async function getActionItemsForDealAction(
  dealId: string,
): Promise<{ success: boolean; items?: ActionItem[]; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  if (!dealId) {
    return { success: false, error: 'Deal ID is required.' };
  }

  try {
    // getActionItemsByDealId in queries.ts already handles user authorization
    const items = await getActionItemsByDealId({ dealId, userId: session.user.id });
    return { success: true, items };
  } catch (error) {
    console.error('Error in getActionItemsForDealAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch action items.',
    };
  }
}

export async function addUserActionItemAction(
  dealId: string,
  description: string,
  transcriptId?: string | null, // Added transcriptId parameter
): Promise<{ success: boolean; actionItem?: ActionItem; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  if (!dealId || !description.trim()) {
    return { success: false, error: 'Deal ID and description are required.' };
  }

  try {
    // Verify user owns the deal
    const deal = await getDealById({ id: dealId });
    if (!deal || deal.userId !== session.user.id) {
      return { success: false, error: 'Deal not found or unauthorized.' };
    }

    const newActionItem = await createActionItem({
      dealId,
      transcriptId: transcriptId, // Pass transcriptId
      description: description.trim(),
      userId: session.user.id,
      isAISuggested: false,
    });

    revalidatePath(`/deals/${dealId}`);

    return { success: true, actionItem: newActionItem };
  } catch (error) {
    console.error('Error in addUserActionItemAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add action item.',
    };
  }
}

export async function updateUserActionItemAction(
  itemId: string,
  data: { description?: string; isCompleted?: boolean },
): Promise<{ success: boolean; actionItem?: ActionItem; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  if (!itemId || (data.description === undefined && data.isCompleted === undefined)) {
    return { success: false, error: 'Item ID and data to update are required.' };
  }
  if (data.description !== undefined && !data.description.trim()) {
    return { success: false, error: 'Description cannot be empty.' };
  }

  try {
    // The updateActionItem query in lib/db/queries.ts already handles user authorization
    // by checking if the user owns the deal associated with the action item.
    const updatedActionItem = await updateActionItem(itemId, session.user.id, {
      ...(data.description && { description: data.description.trim() }),
      ...(data.isCompleted !== undefined && { isCompleted: data.isCompleted }),
    });

    if (!updatedActionItem) {
      // This could mean the item was not found, or the user was not authorized.
      // The query function itself logs a warning for these cases.
      return { success: false, error: 'Failed to update action item. Item not found or unauthorized.' };
    }

    // Revalidate the path of the deal page where the action item is displayed
    // Assuming action items are displayed on /deals/[dealId]
    // Need to fetch the dealId from the updatedActionItem to revalidate the correct path
    revalidatePath(`/deals/${updatedActionItem.dealId}`);

    return { success: true, actionItem: updatedActionItem };
  } catch (error) {
    console.error('Error in updateUserActionItemAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update action item.',
    };
  }
}

export async function deleteUserActionItemAction(
  itemId: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  if (!itemId) {
    return { success: false, error: 'Item ID is required.' };
  }

  try {
    // The deleteActionItem query in lib/db/queries.ts handles user authorization
    // by checking if the user owns the deal associated with the action item.
    // It also needs the dealId for revalidation, so we fetch the item first.
    const itemToDelete = await getActionItemById(itemId); // Assuming a getActionItemById query exists or will be added

    if (!itemToDelete) {
        return { success: false, error: 'Action item not found.' };
    }
    // Authorization check is implicitly handled by deleteActionItem query via userId

    const deletedItem = await deleteActionItem(itemId, session.user.id);

    if (!deletedItem) {
      return { success: false, error: 'Failed to delete action item. Item not found or unauthorized.' };
    }

    revalidatePath(`/deals/${deletedItem.dealId}`);

    return { success: true };
  } catch (error) {
    console.error('Error in deleteUserActionItemAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete action item.',
    };
  }
}

export async function scanSingleTranscriptForActionItemsAction( // Renamed and added transcriptId
  dealId: string, // dealId is still needed for deal context and FK
  transcriptId: string,
): Promise<{ success: boolean; newItems?: ActionItem[]; count?: number; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  if (!dealId) {
    return { success: false, error: 'Deal ID is required.' };
  }

  try {
    // 1. Verify user ownership of the deal
    const deal = await getDealById({ id: dealId });
    if (!deal || deal.userId !== session.user.id) {
      return { success: false, error: 'Deal not found or unauthorized.' };
    }

    // 2. Fetch the specific transcript
    const transcript = await getTranscriptById({ id: transcriptId });

    // 3. Check if transcript exists and has content
    if (!transcript) {
      return { success: false, error: 'Transcript not found.' };
    }
    if (!transcript.content || !transcript.content.trim()) {
      return { success: true, newItems: [], count: 0, error: 'Transcript content is empty or missing.' };
    }

    const singleTranscriptContent = `Transcript from ${transcript.callDate} ${transcript.callTime} (${transcript.fileName}):\n${transcript.content}\n`;

    // 4. Construct a prompt for an LLM
    const prompt = `
      Analyze the following sales call transcript for the deal "${deal.name}".
      Identify and extract a list of clear, concise, and actionable tasks or follow-up items.
      Each action item should be a short phrase starting with a verb.
      If no specific action items can be identified, respond with an empty list or "No action items found.".
      Format the output as a JSON array of strings, where each string is an action item. For example: ["Schedule follow-up meeting", "Send pricing details", "Clarify budget constraints"].

      Transcript Context:
      ---
      ${singleTranscriptContent}
      ---

      Suggested Action Items (JSON array of strings):
    `;

    // 5. Use generateText to get suggestions
    const { text: rawSuggestions } = await generateText({
      model: myProvider.languageModel('chat-model'), // Or 'artifact-model' if deemed better
      prompt: prompt,
    });

    // 6. Parse the LLM's response
    let suggestedDescriptions: string[] = [];
    let cleanedSuggestions = rawSuggestions.trim();

    // Remove Markdown code fences if present
    if (cleanedSuggestions.startsWith("```json")) {
      cleanedSuggestions = cleanedSuggestions.substring(7); // Remove ```json
      if (cleanedSuggestions.endsWith("```")) {
        cleanedSuggestions = cleanedSuggestions.substring(0, cleanedSuggestions.length - 3);
      }
    } else if (cleanedSuggestions.startsWith("```")) { // Handle case with just ```
        cleanedSuggestions = cleanedSuggestions.substring(3);
        if (cleanedSuggestions.endsWith("```")) {
            cleanedSuggestions = cleanedSuggestions.substring(0, cleanedSuggestions.length - 3);
        }
    }
    cleanedSuggestions = cleanedSuggestions.trim(); // Trim again after stripping fences

    try {
      // Attempt to parse as JSON array
      const parsed = JSON.parse(cleanedSuggestions); // Use the cleaned string
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        suggestedDescriptions = parsed.filter(desc => desc.trim().length > 0);
      } else if (cleanedSuggestions.includes('\n') || cleanedSuggestions.includes('* ') || cleanedSuggestions.includes('- ')) {
        // Fallback: try to parse as a bulleted/newline-separated list (using cleanedSuggestions)
        suggestedDescriptions = cleanedSuggestions.split('\n')
          .map(line => line.replace(/^[\s*-]+/, '').trim())
          .filter(desc => desc.length > 0);
      } else if (cleanedSuggestions.trim().toLowerCase() !== "no action items found." && cleanedSuggestions.trim() !== "") {
        // Fallback for a single action item not in a list
         suggestedDescriptions = [cleanedSuggestions.trim()];
      }
    } catch (e) {
      console.warn("LLM response for action items was not valid JSON even after cleaning, attempting further fallback parsing:", cleanedSuggestions, e);
       if (cleanedSuggestions.includes('\n') || cleanedSuggestions.includes('* ') || cleanedSuggestions.includes('- ')) {
        suggestedDescriptions = cleanedSuggestions.split('\n')
          .map(line => line.replace(/^[\s*-]+/, '').trim())
          .filter(desc => desc.length > 0);
      } else if (cleanedSuggestions.trim().toLowerCase() !== "no action items found." && cleanedSuggestions.trim() !== "") {
         suggestedDescriptions = [cleanedSuggestions.trim()];
      }
    }

    if (suggestedDescriptions.length === 0) {
      // No error string here, client will inform based on count/empty array
      return { success: true, newItems: [], count: 0 };
    }

    // 7. Prepare ActionItem objects
    const itemsToCreate = suggestedDescriptions.map(description => ({
      dealId,
      transcriptId: transcriptId, // Link to the specific transcript
      description,
      userId: session.user!.id!,
      isAISuggested: true,
    }));

    // 8. Call createMultipleActionItems
    const newActionItems = await createMultipleActionItems(itemsToCreate);

    // 9. Call revalidatePath
    revalidatePath(`/deals/${dealId}`);

    // 10. Return success status, new items, and count
    return { success: true, newItems: newActionItems, count: newActionItems.length };

  } catch (error) {
    console.error('Error in scanSingleTranscriptForActionItemsAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to scan transcript for action items.',
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
    const initialTranscript = await getTranscriptById({ id: transcriptId });

    if (!initialTranscript) {
      return { success: false, error: 'Transcript not found.' };
    }
    if (!initialTranscript.content || initialTranscript.content.trim() === '') {
      return { success: false, error: 'Transcript content is empty.' };
    }

    // Fetch the full deal context, ensuring this specific transcript is included.
    // The dealId is derived from the initialTranscript for the getDealAIContext call.
    const dealAIContext = await getDealAIContext({
      dealId: initialTranscript.dealId,
      userId: session.user.id,
      transcriptIds: [transcriptId], // Focus on this transcript
      includeContacts: true,         // Include contacts for email context
      includeActionItems: true,      // Include action items for email context
      includeTranscripts: true       // Ensure transcripts (at least this one) are included
    });

    if (!dealAIContext) {
      return { 
        success: false, 
        error: 'Failed to retrieve comprehensive deal context for drafting email. User might be unauthorized or deal not found.' 
      };
    }

    // Format the comprehensive context for the LLM
    // We want full details for email drafting.
    const formattedLLMContext = formatDealContextForLLM(dealAIContext, {
      transcriptFormat: 'full', // Ensure full content for the specified transcript
      includeSections: ['deal', 'contacts', 'transcripts', 'actionItems']
    });
    
    if (!formattedLLMContext || formattedLLMContext.startsWith('Error:')) {
      return { success: false, error: formattedLLMContext || 'Failed to format deal context for LLM.' };
    }

    const prompt = `
      Role: You are an expert email writer for sales professionals.
      Goal: Draft a concise and actionable follow-up email to keep momentum going with a prospect after a sales call.
      Context: You are given the following comprehensive deal context, which includes details about the deal, associated contacts, relevant transcripts (specifically focusing on the one with ID ${transcriptId}), and action items.
      Deal Context:
      ---
      ${formattedLLMContext}
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
  dealId: string, // Changed from allTranscriptsContent
  userQuestion: string,
): Promise<{ success: boolean; answer?: string; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  if (!dealId.trim() || !userQuestion.trim()) {
    return { success: false, error: 'Deal ID and question cannot be empty.' };
  }

  try {
    // Story 2.2.2: Call getDealAIContext
    const dealAIContext = await getDealAIContext({
      dealId,
      userId: session.user.id,
      // For now, fetch all components by default
      includeContacts: true,
      includeActionItems: true,
      includeTranscripts: true,
    });

    if (!dealAIContext) {
      return {
        success: false,
        error: 'Failed to retrieve deal context. The deal may not exist or you may not have permission to access it.',
      };
    }

    // Story 2.2.3: Integrate formatDealContextForLLM
    const formattedLLMContext = formatDealContextForLLM(dealAIContext);

    // If the formatted context is empty or indicates an error (e.g., from formatDealContextForLLM itself)
    if (!formattedLLMContext || formattedLLMContext.startsWith('Error:')) {
        return { success: false, error: formattedLLMContext || 'Failed to format deal context for LLM.' };
    }

    const prompt = `
You are an AI assistant. Your task is to answer the following question based *solely* on the provided "Deal Context" below.
Do not use any external knowledge or make assumptions beyond what is explicitly stated in the context.
If the answer cannot be found in the provided context, you MUST respond with: "The answer cannot be found in the provided context."

Deal Context:
---
${formattedLLMContext}
---

User Question: ${userQuestion}
  `;

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
    if (error instanceof Error && error.message.includes('authentication')) {
      return { success: false, error: 'LLM authentication failed. Please check your API key configuration.' };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred while trying to get an answer.'
    };
  }
}
