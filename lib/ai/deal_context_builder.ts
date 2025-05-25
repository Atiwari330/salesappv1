import 'server-only';

import {
  findDealByIdAndUserId,
  getDealById,
  getTranscriptsByDealId,
  getContactsForDeal,
  getActionItemsByDealId,
  getTranscriptsByDealIdAndIds, // Added for Story 3.1.2
  type ContactWithRole, // Explicitly import type for Story 3.1.6
} from '@/lib/db/queries';
import type { Transcript, ActionItem } from '@/lib/db/schema'; // Import schema types for Story 3.1.6
import type { DealAIContext, DealAIContextParams, FormatDealContextOptions } from './deal_context_types'; // Added FormatDealContextOptions
import { ChatSDKError } from '@/lib/errors'; // Assuming ChatSDKError is the standard error type

/**
 * @async
 * @function getDealAIContext
 * Retrieves and structures the comprehensive AI context for a given deal.
 *
 * This function performs an initial authorization check to ensure the user
 * has access to the deal before fetching any sensitive information.
 *
 * @param {DealAIContextParams} params - The parameters for fetching the deal context,
 * including `dealId` and `userId`.
 * @returns {Promise<DealAIContext | null>} A promise that resolves to the
 * `DealAIContext` object if the user is authorized and the deal is found,
 * or `null` otherwise. It may throw a ChatSDKError for database issues.
 *
 * Future enhancements will populate this object with deal details, transcripts,
 * contacts, and action items based on further parameters in `DealAIContextParams`.
 */
export async function getDealAIContext(
  params: DealAIContextParams,
): Promise<DealAIContext | null> {
  const { dealId, userId } = params;

  try {
    // Story 1.2.1: Initial authorization check
    const authorizedDeal = await findDealByIdAndUserId({ dealId, userId });

    if (!authorizedDeal) {
      // User is not authorized or the deal does not exist
      // Story 1.2.1: Return null if not authorized or deal not found
      return null;
    }

    // Placeholder for fetching and assembling the full DealAIContext
    // This will be built out in subsequent stories (1.2.2 to 1.2.6)
    // For now, if authorized, we indicate success by preparing for data,
    // but the actual data assembly is pending.
    // Story 1.2.1: Placeholder to return a DealAIContext object.
    // For the skeleton, we'll return null until data fetching is implemented.
    // Or, more accurately for a skeleton that will be filled:
    // const dealContext: DealAIContext = {
    //   deal: authorizedDeal, // This will be the full deal from getDealById later
    //   transcripts: [],
    //   contacts: [],
    //   actionItems: [],
    // };
    // return dealContext;
    // For strict adherence to "placeholder to return a DealAIContext object"
    // and "returns null ... if the user is not authorized OR THE DEAL IS NOT FOUND"
    // and "skeleton" implies not fully functional yet.
    // Let's return null for now, and subsequent stories will populate it.
    // The acceptance criteria also says "it has a placeholder to return a DealAIContext object"
    // which implies the *structure* is there, even if not fully populated.
    // Let's make it slightly more than null for the success path of the skeleton.

    // TODO: Story 1.2.2: Integrate Fetching `Deal` Details (use getDealById)
    // TODO: Story 1.2.3: Integrate Fetching All `Transcript` Details
    // TODO: Story 1.2.4: Integrate Fetching `ContactWithRole` Details
    // TODO: Story 1.2.5: Integrate Fetching `ActionItem` Details
    // TODO: Story 1.2.6: Assemble and Return Full `DealAIContext`

    // For the skeleton (Story 1.2.1), if authorized, we've passed the check.
    // The actual assembly of DealAIContext will happen in later stories.
    // Returning a partial/empty structure or null are both valid for a skeleton.
    // Given the AC "placeholder to return a DealAIContext object", let's return a minimal valid structure.
    // However, `authorizedDeal` from `findDealByIdAndUserId` might not be the complete `Deal` object
    // Story 1.2.2: Integrate Fetching `Deal` Details
    const dealDetails = await getDealById({ id: dealId });

    if (!dealDetails) {
      // This case should ideally not be hit if authorizedDeal was found,
      // but as a safeguard or if getDealById has stricter checks/fails.
      console.error(
        `Deal details not found for dealId ${dealId} even after authorization.`,
      );
      return null;
    }

    // Story 1.2.3, 3.1.2 & 3.1.6: Integrate Fetching Transcripts with Selective Inclusion & Limiting
    let fetchedTranscripts: Transcript[] = [];
    if (params.includeTranscripts !== false) { // Default to true if undefined
      if (params.transcriptIds && params.transcriptIds.length > 0) {
        fetchedTranscripts = await getTranscriptsByDealIdAndIds({
          dealId,
          transcriptIds: params.transcriptIds,
        });
      } else {
        fetchedTranscripts = await getTranscriptsByDealId({ dealId });
      }

      // Story 3.1.4: Implement Transcript Limiting
      if (params.limitTranscripts && params.limitTranscripts > 0 && fetchedTranscripts.length > params.limitTranscripts) {
        fetchedTranscripts = fetchedTranscripts.slice(0, params.limitTranscripts);
      }
    }

    // Story 1.2.4 & 3.1.6: Integrate Fetching `ContactWithRole` Details with Selective Inclusion
    let fetchedContacts: ContactWithRole[] = [];
    if (params.includeContacts !== false) { // Default to true
      fetchedContacts = await getContactsForDeal({ dealId, userId });
    }

    // Story 1.2.5 & 3.1.6: Integrate Fetching `ActionItem` Details with Selective Inclusion
    let fetchedActionItems: ActionItem[] = [];
    if (params.includeActionItems !== false) { // Default to true
      fetchedActionItems = await getActionItemsByDealId({ dealId, userId });
    }

    const dealContext: DealAIContext = {
      deal: dealDetails,
      transcripts: fetchedTranscripts,
      contacts: fetchedContacts,
      actionItems: fetchedActionItems,
    };

    return dealContext;

  } catch (error) {
    // Log the error for server-side observability
    console.error(`Failed to get deal AI context for dealId ${dealId}:`, error);

    // Re-throw database-related errors as ChatSDKError if they are not already
    if (error instanceof ChatSDKError) {
      throw error;
    }
    // For other unexpected errors, wrap them
    throw new ChatSDKError(
      'bad_request:database',
      'An unexpected error occurred while fetching deal context.',
    );
  }
}

/**
 * @function formatDealContextForLLM
 * Converts a structured DealAIContext object into an LLM-friendly string.
 *
 * @param {DealAIContext} context - The structured deal context object.
 * @param {object} [options] - Optional parameters to customize formatting.
 *                                (Detailed options to be defined in Story 3.2.3)
 * @returns {string} An LLM-friendly string representation of the deal context.
 *
 * Initial implementation (Story 2.1.1) is a skeleton.
 * Subsequent stories (2.1.2 - 2.1.5) will add formatting for each section.
 * Advanced options and summarization will be handled in Phase 3.
 */
export function formatDealContextForLLM(
  context: DealAIContext,
  options?: FormatDealContextOptions, // Updated options type
): string {
  // TODO: Story 2.1.2: Add `Deal` Details Formatting
  // TODO: Story 2.1.3: Add `ContactWithRole` List Formatting
  // TODO: Story 2.1.4: Add `Transcript` List Formatting with Basic Truncation
  // TODO: Story 2.1.5: Add `ActionItem` List Formatting

  // Placeholder for formatting logic
  // For now, it will just return a simple string indicating the deal ID.
  // This will be built out in subsequent stories.
  if (!context) {
    return 'Error: No deal context provided.';
  }
  if (!context.deal && (!options?.includeSections || options.includeSections.includes('deal'))) {
    // If deal section is expected by default or explicitly, but no deal data
    return 'Error: Deal details missing from context.';
  }

  let formattedString = '--- DEAL CONTEXT ---\n\n';
  const sectionsToInclude = options?.includeSections || ['deal', 'contacts', 'transcripts', 'actionItems'];

  // Story 2.1.2: Add `Deal` Details Formatting
  if (sectionsToInclude.includes('deal') && context.deal) {
    const { deal } = context;
    formattedString += `Deal Information:\n`;
    formattedString += `  Name: ${deal.name}\n`;
    formattedString += `  ID: ${deal.id}\n`;
    formattedString += `  Created At: ${new Date(deal.createdAt).toLocaleDateString()}\n`;
    formattedString += '\n';
  }

  // Story 2.1.3: Add `ContactWithRole` List Formatting
  if (sectionsToInclude.includes('contacts') && context.contacts && context.contacts.length > 0) {
    formattedString += `Associated Contacts:\n`;
    context.contacts.forEach((contact) => {
      formattedString += `  - Name: ${contact.firstName} ${contact.lastName}\n`;
      formattedString += `    Email: ${contact.email || 'N/A'}\n`;
      formattedString += `    Job Title: ${contact.jobTitle || 'N/A'}\n`;
      formattedString += `    Role in Deal: ${contact.roleInDeal || 'N/A'}\n`;
    });
    formattedString += '\n';
  }

  // Story 2.1.4 & 3.2.3: Add `Transcript` List Formatting with options
  if (sectionsToInclude.includes('transcripts') && context.transcripts && context.transcripts.length > 0) {
    formattedString += `Transcripts:\n`;
    const transcriptFormat = options?.transcriptFormat || 'full'; // Default to 'full'

    context.transcripts.forEach((transcript) => {
      formattedString += `  - File Name: ${transcript.fileName || 'N/A'}\n`;
      formattedString += `    Call Date: ${transcript.callDate ? new Date(transcript.callDate).toLocaleDateString() : 'N/A'}\n`;
      formattedString += `    Call Time: ${transcript.callTime || 'N/A'}\n`;

      if (transcriptFormat === 'full') {
        formattedString += `    Content: ${transcript.content || 'N/A'}\n`;
      } else if (transcriptFormat === 'summary') {
        // Placeholder for future summarization logic (Story 3.2.2)
        // For now, defaults to full content if 'summary' is chosen but no summarizer exists.
        formattedString += `    Content (Summary - Full for now): ${transcript.content || 'N/A'}\n`;
      }
      // For 'titles_only', no content is added beyond metadata.
    });
    formattedString += '\n';
  }

  // Story 2.1.5: Add `ActionItem` List Formatting
  if (sectionsToInclude.includes('actionItems') && context.actionItems && context.actionItems.length > 0) {
    formattedString += `Action Items:\n`;
    context.actionItems.forEach((item) => {
      formattedString += `  - Description: ${item.description}\n`;
      formattedString += `    Status: ${item.isCompleted ? 'Completed' : 'Pending'}\n`;
    });
    formattedString += '\n';
  }
  
  if (formattedString === '--- DEAL CONTEXT ---\n\n') {
    // If no sections were included or context was empty for included sections
    return 'No relevant context sections were included or available for formatting.';
  }

  return formattedString;
}
