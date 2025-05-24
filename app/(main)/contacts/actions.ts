'use server';

import { auth } from '@/app/(auth)/auth';
import {
  findDealByIdAndUserId,
  findContactByEmailAndUserId,
  createNewContact,
  findDealContact,
  createNewDealContact,
  updateDealContactRole,
  getContactsForDeal,
  type ContactWithRole,
  removeContactFromDealQuery, // Added import
} from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
// Removed: import { contact, deal, dealContact } from '@/lib/db/schema';
// Removed: import { and, eq } from 'drizzle-orm';
// Removed: import { db } from '@/lib/db';

// Define the input schema for validation
const AddContactToDealSchema = z.object({
  dealId: z.string().uuid(),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  jobTitle: z.string().optional(),
  roleInDeal: z.string().optional(),
});

export type AddContactToDealInput = z.infer<typeof AddContactToDealSchema>;

interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Partial<Record<keyof AddContactToDealInput, string>>;
}

export async function addContactToDealAction(
  input: AddContactToDealInput,
): Promise<ActionResult<{ contactId: string; dealId: string; roleInDeal?: string | null }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }
  const userId = session.user.id;

  const validatedFields = AddContactToDealSchema.safeParse(input);
  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors as Partial<Record<keyof AddContactToDealInput, string>>,
    };
  }

  const { dealId, firstName, lastName, email, jobTitle, roleInDeal } = validatedFields.data;

  try {
    // Check if the deal exists and belongs to the user to ensure authorization
    const existingDeal = await findDealByIdAndUserId({ dealId, userId });

    if (!existingDeal) {
      return { success: false, error: 'Deal not found or access denied.' };
    }

    let contactToLink = await findContactByEmailAndUserId({ email, userId });

    if (!contactToLink) {
      contactToLink = await createNewContact({
        firstName,
        lastName,
        email,
        jobTitle: jobTitle || null,
        userId,
      });
      if (!contactToLink) { // Should be handled by createNewContact throwing an error
        return { success: false, error: 'Failed to create contact.' };
      }
    }

    // Check if the association already exists
    const existingAssociation = await findDealContact({ dealId, contactId: contactToLink.id });

    if (existingAssociation) {
      if (existingAssociation.roleInDeal !== (roleInDeal || null)) {
        await updateDealContactRole({
          dealId,
          contactId: contactToLink.id,
          roleInDeal: roleInDeal || null,
        });
      }
    } else {
      await createNewDealContact({
        dealId,
        contactId: contactToLink.id,
        roleInDeal: roleInDeal || null,
      });
    }
    
    revalidatePath(`/deals/${dealId}`); // Revalidate the deal page to show the new contact

    return {
      success: true,
      data: {
        contactId: contactToLink.id,
        dealId,
        roleInDeal: roleInDeal || null,
      },
    };
  } catch (error) {
    console.error('Error in addContactToDealAction:', error);
    // Check for unique constraint violation for email if not handled by findFirst logic
    if (error instanceof Error && 'code' in error && error.code === '23505') { // Postgres unique violation
        return { success: false, error: 'A contact with this email already exists for another user or a global constraint was violated.' };
    }
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

// Schema for getContactsForDealAction input
const GetContactsForDealSchema = z.object({
  dealId: z.string().uuid(),
});

export async function getContactsForDealAction(
  input: { dealId: string }
): Promise<ActionResult<ContactWithRole[]>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }
  const userId = session.user.id;

  const validatedFields = GetContactsForDealSchema.safeParse(input);
  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input: Deal ID is required.',
      // Optionally, include fieldErrors if you want to be more specific
      // fieldErrors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { dealId } = validatedFields.data;

  try {
    const contacts = await getContactsForDeal({ dealId, userId });
    return { success: true, data: contacts };
  } catch (error) {
    console.error('Error in getContactsForDealAction:', error);
    // Check if it's a ChatSDKError from the query to pass a more specific message
    if (error instanceof Error && error.message.includes('Failed to get contacts for deal')) {
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred while fetching contacts.' };
  }
}

// Schema for removeContactFromDealAction input
const RemoveContactFromDealSchema = z.object({
  dealId: z.string().uuid(),
  contactId: z.string().uuid(),
});

export async function removeContactFromDealAction(
  input: { dealId: string; contactId: string }
): Promise<ActionResult<null>> { // Returns null on success data
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }
  const userId = session.user.id;

  const validatedFields = RemoveContactFromDealSchema.safeParse(input);
  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input: Deal ID and Contact ID are required.',
      // fieldErrors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { dealId, contactId } = validatedFields.data;

  try {
    // Check if the deal exists and belongs to the user to ensure authorization
    const existingDeal = await findDealByIdAndUserId({ dealId, userId });
    if (!existingDeal) {
      return { success: false, error: 'Deal not found or access denied.' };
    }

    const result = await removeContactFromDealQuery({ dealId, contactId });

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to remove contact association.' };
    }
    
    revalidatePath(`/deals/${dealId}`); // Revalidate the deal page

    return { success: true, data: null };
  } catch (error) {
    console.error('Error in removeContactFromDealAction:', error);
    if (error instanceof Error && error.message.includes('Failed to remove contact from deal')) {
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred while removing contact.' };
  }
}
