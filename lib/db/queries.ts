import 'server-only';

import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  type SQL,
} from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import {
  user,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  message,
  vote,
  type DBMessage,
  type Chat,
  stream,
  deal,
  type Deal,
  transcript,
  type Transcript,
  contact, // Added contact
  type Contact, // Added Contact type
  dealContact, // Added dealContact
  type DealContact, // Added DealContact type
} from './schema';
import type { ArtifactKind } from '@/components/artifact';
import { generateUUID } from '../utils';
import { generateHashedPassword } from './utils';
import type { VisibilityType } from '@/components/visibility-selector';
import { ChatSDKError } from '../errors';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get user by email',
    );
  }
}

export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);

  try {
    return await db.insert(user).values({ email, password: hashedPassword });
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to create user');
  }
}

export async function createGuestUser() {
  const email = `guest-${Date.now()}`;
  const password = generateHashedPassword(generateUUID());

  try {
    return await db.insert(user).values({ email, password }).returning({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to create guest user',
    );
  }
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
      visibility,
    });
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to save chat');
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));
    await db.delete(stream).where(eq(stream.chatId, id));

    const [chatsDeleted] = await db
      .delete(chat)
      .where(eq(chat.id, id))
      .returning();
    return chatsDeleted;
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to delete chat by id',
    );
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const extendedLimit = limit + 1;

    const query = (whereCondition?: SQL<any>) =>
      db
        .select()
        .from(chat)
        .where(
          whereCondition
            ? and(whereCondition, eq(chat.userId, id))
            : eq(chat.userId, id),
        )
        .orderBy(desc(chat.createdAt))
        .limit(extendedLimit);

    let filteredChats: Array<Chat> = [];

    if (startingAfter) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, startingAfter))
        .limit(1);

      if (!selectedChat) {
        throw new ChatSDKError(
          'not_found:database',
          `Chat with id ${startingAfter} not found`,
        );
      }

      filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
    } else if (endingBefore) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, endingBefore))
        .limit(1);

      if (!selectedChat) {
        throw new ChatSDKError(
          'not_found:database',
          `Chat with id ${endingBefore} not found`,
        );
      }

      filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
    } else {
      filteredChats = await query();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get chats by user id',
    );
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get chat by id');
  }
}

export async function saveMessages({
  messages,
}: {
  messages: Array<DBMessage>;
}) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to save messages');
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get messages by chat id',
    );
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === 'up' })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === 'up',
    });
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to vote message');
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get votes by chat id',
    );
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    return await db
      .insert(document)
      .values({
        id,
        title,
        kind,
        content,
        userId,
        createdAt: new Date(),
      })
      .returning();
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to save document');
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get documents by id',
    );
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get document by id',
    );
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp),
        ),
      );

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)))
      .returning();
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to delete documents by id after timestamp',
    );
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to save suggestions',
    );
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get suggestions by document id',
    );
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get message by id',
    );
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)),
      );

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(
          and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds)),
        );

      return await db
        .delete(message)
        .where(
          and(eq(message.chatId, chatId), inArray(message.id, messageIds)),
        );
    }
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to delete messages by chat id after timestamp',
    );
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to update chat visibility by id',
    );
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: { id: string; differenceInHours: number }) {
  try {
    const twentyFourHoursAgo = new Date(
      Date.now() - differenceInHours * 60 * 60 * 1000,
    );

    const [stats] = await db
      .select({ count: count(message.id) })
      .from(message)
      .innerJoin(chat, eq(message.chatId, chat.id))
      .where(
        and(
          eq(chat.userId, id),
          gte(message.createdAt, twentyFourHoursAgo),
          eq(message.role, 'user'),
        ),
      )
      .execute();

    return stats?.count ?? 0;
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get message count by user id',
    );
  }
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  try {
    await db
      .insert(stream)
      .values({ id: streamId, chatId, createdAt: new Date() });
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to create stream id',
    );
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    const streamIds = await db
      .select({ id: stream.id })
      .from(stream)
      .where(eq(stream.chatId, chatId))
      .orderBy(asc(stream.createdAt))
      .execute();

    return streamIds.map(({ id }) => id);
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get stream ids by chat id',
    );
  }
}

export async function createDeal({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) {
  try {
    return await db
      .insert(deal)
      .values({
        name,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to create deal');
  }
}

import { sql } from 'drizzle-orm'; // Import sql

// Define a type for the deal with transcript count
export type DealWithTranscriptCount = Deal & { transcriptCount: number };

export async function getDealsByUserId({ userId }: { userId: string }): Promise<DealWithTranscriptCount[]> {
  try {
    // Subquery to count transcripts for each deal
    const transcriptCountsSq = db
      .select({
        dealId: transcript.dealId,
        // Ensure count returns a number, coalesce null to 0
        transcriptCount: sql<number>`cast(count(${transcript.id}) as int)`.as('transcript_count'),
      })
      .from(transcript)
      .groupBy(transcript.dealId)
      .as('transcript_counts_sq');

    const dealsWithCounts = await db
      .select({
        id: deal.id,
        name: deal.name,
        userId: deal.userId,
        createdAt: deal.createdAt,
        updatedAt: deal.updatedAt,
        transcriptCount: sql<number>`coalesce(${transcriptCountsSq.transcriptCount}, 0)`.as('transcriptCount'),
      })
      .from(deal)
      .leftJoin(transcriptCountsSq, eq(deal.id, transcriptCountsSq.dealId))
      .where(eq(deal.userId, userId))
      .orderBy(desc(deal.createdAt));
    
    return dealsWithCounts as DealWithTranscriptCount[];
  } catch (error) {
    console.error("Error in getDealsByUserId:", error);
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get deals by user id with transcript count',
    );
  }
}

export async function getDealById({ id }: { id: string }) {
  try {
    const [selectedDeal] = await db.select().from(deal).where(eq(deal.id, id));
    return selectedDeal;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get deal by id');
  }
}

export async function updateDeal({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  try {
    return await db
      .update(deal)
      .set({ name, updatedAt: new Date() })
      .where(eq(deal.id, id))
      .returning();
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to update deal');
  }
}

export async function deleteDealById({ dealId, userId }: { dealId: string; userId: string }) {
  try {
    return await db.transaction(async (tx) => {
      // First, delete all transcripts associated with the deal
      await tx.delete(transcript).where(eq(transcript.dealId, dealId));

      // Then, delete the deal itself, ensuring the user owns it
      const deletedDeals = await tx
        .delete(deal)
        .where(and(eq(deal.id, dealId), eq(deal.userId, userId)))
        .returning();

      if (deletedDeals.length === 0) {
        // This could mean the deal didn't exist or the user didn't own it.
        // The server action calling this should handle this as an authorization/not found error.
        throw new Error('Deal not found or user not authorized to delete this deal.');
      }
      
      return deletedDeals[0];
    });
  } catch (error) {
    console.error("Error in deleteDealById:", error);
    // Re-throw the original error or a new ChatSDKError
    if (error instanceof ChatSDKError) {
      throw error;
    }
    throw new ChatSDKError('bad_request:database', 'Failed to delete deal and associated transcripts');
  }
}

export async function createTranscript({
  dealId,
  fileName,
  content,
  callDate,
  callTime,
}: {
  dealId: string;
  fileName: string;
  content: string;
  callDate: string;
  callTime: string;
}) {
  try {
    return await db
      .insert(transcript)
      .values({
        dealId,
        fileName,
        content,
        callDate,
        callTime,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to create transcript');
  }
}

export async function getTranscriptsByDealId({ dealId }: { dealId: string }) {
  try {
    return await db
      .select()
      .from(transcript)
      .where(eq(transcript.dealId, dealId))
      .orderBy(desc(transcript.createdAt));
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get transcripts by deal id',
    );
  }
}

export async function getTranscriptById({ id }: { id: string }) {
  try {
    const [selectedTranscript] = await db
      .select()
      .from(transcript)
      .where(eq(transcript.id, id));
    return selectedTranscript;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get transcript by id');
  }
}

export async function deleteTranscript({ id }: { id: string }) {
  try {
    const [deletedTranscript] = await db
      .delete(transcript)
      .where(eq(transcript.id, id))
      .returning();
    return deletedTranscript;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to delete transcript');
  }
}

export async function getTranscriptCountByDealId({ dealId }: { dealId: string }) {
  try {
    const [stats] = await db
      .select({ count: count(transcript.id) })
      .from(transcript)
      .where(eq(transcript.dealId, dealId))
      .execute();

    return stats?.count ?? 0;
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get transcript count by deal id',
    );
  }
}

// Contact and DealContact Queries

export async function findDealByIdAndUserId({ dealId, userId }: { dealId: string; userId: string }): Promise<Deal | undefined> {
  try {
    const [foundDeal] = await db
      .select()
      .from(deal)
      .where(and(eq(deal.id, dealId), eq(deal.userId, userId)))
      .limit(1);
    return foundDeal;
  } catch (error) {
    console.error("Error in findDealByIdAndUserId:", error);
    throw new ChatSDKError('bad_request:database', 'Failed to find deal by id and user id');
  }
}

export async function findContactByEmailAndUserId({ email, userId }: { email: string; userId: string }): Promise<Contact | undefined> {
  try {
    const [foundContact] = await db
      .select()
      .from(contact)
      .where(and(eq(contact.email, email), eq(contact.userId, userId)))
      .limit(1);
    return foundContact;
  } catch (error) {
    console.error("Error in findContactByEmailAndUserId:", error);
    throw new ChatSDKError('bad_request:database', 'Failed to find contact by email and user id');
  }
}

export async function createNewContact(input: {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string | null;
  userId: string;
}): Promise<Contact> {
  try {
    const [newContact] = await db
      .insert(contact)
      .values({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        jobTitle: input.jobTitle,
        userId: input.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    if (!newContact) {
      throw new Error('Contact creation failed, no record returned.');
    }
    return newContact;
  } catch (error) {
    console.error("Error in createNewContact:", error);
    // Consider checking for unique constraint violation if not already handled by DB/Drizzle
    throw new ChatSDKError('bad_request:database', 'Failed to create new contact');
  }
}

export async function findDealContact({ dealId, contactId }: { dealId: string; contactId: string }): Promise<DealContact | undefined> {
  try {
    const [foundDealContact] = await db
      .select()
      .from(dealContact)
      .where(and(eq(dealContact.dealId, dealId), eq(dealContact.contactId, contactId)))
      .limit(1);
    return foundDealContact;
  } catch (error) {
    console.error("Error in findDealContact:", error);
    throw new ChatSDKError('bad_request:database', 'Failed to find deal-contact association');
  }
}

export async function createNewDealContact(input: {
  dealId: string;
  contactId: string;
  roleInDeal?: string | null;
}): Promise<DealContact> {
  try {
    const [newDealContact] = await db
      .insert(dealContact)
      .values({
        dealId: input.dealId,
        contactId: input.contactId,
        roleInDeal: input.roleInDeal,
      })
      .returning();
    if (!newDealContact) {
      throw new Error('DealContact creation failed, no record returned.');
    }
    return newDealContact;
  } catch (error) {
    console.error("Error in createNewDealContact:", error);
    throw new ChatSDKError('bad_request:database', 'Failed to create deal-contact association');
  }
}

export async function updateDealContactRole(input: {
  dealId: string;
  contactId: string;
  roleInDeal?: string | null;
}): Promise<DealContact> {
  try {
    const [updatedDealContact] = await db
      .update(dealContact)
      .set({ roleInDeal: input.roleInDeal })
      .where(and(eq(dealContact.dealId, input.dealId), eq(dealContact.contactId, input.contactId)))
      .returning();
    if (!updatedDealContact) {
      throw new Error('DealContact role update failed, no record returned or association not found.');
    }
    return updatedDealContact;
  } catch (error) {
    console.error("Error in updateDealContactRole:", error);
    throw new ChatSDKError('bad_request:database', 'Failed to update deal-contact role');
  }
}

export type ContactWithRole = Contact & { roleInDeal: string | null };

export async function getContactsForDeal({ dealId, userId }: { dealId: string; userId: string }): Promise<ContactWithRole[]> {
  try {
    // First, verify the user has access to the deal
    const dealCheck = await findDealByIdAndUserId({ dealId, userId });
    if (!dealCheck) {
      // Or throw an error, or return empty array if preferred for non-existent/unauthorized deals
      console.warn(`User ${userId} attempted to access contacts for deal ${dealId} without permission or deal does not exist.`);
      return []; 
    }

    const results = await db
      .select({
        // Select all columns from contact table
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        jobTitle: contact.jobTitle,
        userId: contact.userId,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
        // Select roleInDeal from dealContact table
        roleInDeal: dealContact.roleInDeal,
      })
      .from(contact)
      .innerJoin(dealContact, eq(contact.id, dealContact.contactId))
      .where(eq(dealContact.dealId, dealId))
      .orderBy(contact.lastName, contact.firstName); // Optional: order by name

    return results.map(r => ({
      id: r.id,
      firstName: r.firstName,
      lastName: r.lastName,
      email: r.email,
      jobTitle: r.jobTitle,
      userId: r.userId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      roleInDeal: r.roleInDeal,
    }));
  } catch (error) {
    console.error("Error in getContactsForDeal:", error);
    throw new ChatSDKError('bad_request:database', 'Failed to get contacts for deal');
  }
}

export async function removeContactFromDealQuery({ dealId, contactId }: { dealId: string; contactId: string }): Promise<{ success: boolean, error?: string }> {
  try {
    // Note: Authorization (ensuring the user owns the deal) should be handled in the server action
    // before calling this query, or this query could be extended to take userId.
    // For now, it directly attempts the deletion based on dealId and contactId.
    const result = await db
      .delete(dealContact)
      .where(and(eq(dealContact.dealId, dealId), eq(dealContact.contactId, contactId)))
      .returning(); // .returning() might not be supported by all drivers or needed if we just check affectedRows

    // Check if any row was actually deleted.
    // The exact way to check affected rows depends on the Drizzle driver and DB.
    // For pg, .returning() will return the deleted rows. If empty, nothing was deleted.
    if (result.length === 0) {
      // This could mean the association didn't exist in the first place.
      // Depending on desired behavior, this could be an error or a silent success.
      // For now, let's treat it as a "not found" scenario which the action can interpret.
      return { success: false, error: "Association not found or already removed." };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in removeContactFromDealQuery:", error);
    throw new ChatSDKError('bad_request:database', 'Failed to remove contact from deal');
  }
}
